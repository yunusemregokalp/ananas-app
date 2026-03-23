"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitQuote(params: {
  requestId: string
  priceAmount: number
  coverLetter: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return { error: "Giriş yapmanız gerekiyor." }
  }

  try {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!providerProfile) {
      return { error: "Hizmet veren profiliniz bulunamadı." }
    }

    if (providerProfile.status !== "APPROVED") {
      return { error: "Profiliniz henüz onaylanmadı. Yönetici onayı bekleyin." }
    }

    // Aynı talebe birden fazla teklif verilmesini engelle
    const existingQuote = await prisma.quote.findFirst({
      where: { requestId: params.requestId, providerId: providerProfile.id }
    })

    if (existingQuote) {
      return { error: "Bu talebe zaten teklif verdiniz." }
    }

    // Kredi kontrolü
    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } })
    const CREDIT_COST = 10

    if (!wallet || wallet.balance < CREDIT_COST) {
      return { error: `Yetersiz kredi. Teklif vermek için ${CREDIT_COST} kredi gerekiyor. Mevcut bakiyeniz: ${wallet?.balance || 0}` }
    }

    // Talep bilgilerini al (bildirim için)
    const request = await prisma.serviceRequest.findUnique({
      where: { id: params.requestId },
      include: { category: true, customer: { select: { id: true, name: true } } }
    })

    if (!request) return { error: "Talep bulunamadı." }

    // Transaction: Teklif oluştur + Kredi düş + İşlem kaydı + Bildirim
    const [newQuote] = await prisma.$transaction([
      // 1. Teklif oluştur
      prisma.quote.create({
        data: {
          requestId: params.requestId,
          providerId: providerProfile.id,
          priceAmount: params.priceAmount,
          priceType: "SABİT_FİYAT",
          coverLetter: params.coverLetter,
          creditCost: CREDIT_COST,
          status: "PENDING"
        }
      }),
      // 2. Kredi düş
      prisma.wallet.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: CREDIT_COST } }
      }),
      // 3. İşlem kaydı oluştur
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: CREDIT_COST,
          type: "DEBIT",
          reason: `${request.category.name} - ${request.city} talebi için teklif verildi`
        }
      }),
      // 4. Müşteriye bildirim gönder
      prisma.notification.create({
        data: {
          userId: request.customer.id,
          title: "Yeni Teklif Aldınız! 📩",
          message: `${providerProfile.companyName || session.user.name} "${request.category.name}" talebinize ${params.priceAmount.toLocaleString("tr-TR")} ₺ teklif verdi.`
        }
      }),
      // 5. Talep durumunu güncelle
      prisma.serviceRequest.update({
        where: { id: params.requestId },
        data: { status: "QUOTED" }
      })
    ])

    revalidatePath("/hizmet-veren/firsatlar")
    revalidatePath("/hizmet-veren/panel")
    revalidatePath(`/musteri/taleplerim/${params.requestId}`)

    return { success: true, quoteId: newQuote.id }
  } catch (error) {
    console.error("Teklif verme hatası:", error)
    return { error: "Teklifiniz iletilemedi, lütfen tekrar deneyin." }
  }
}
