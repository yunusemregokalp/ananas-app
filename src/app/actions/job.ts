"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function hireProvider(quoteId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Oturum açmadınız." }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { request: true }
  })

  if (!quote) return { error: "İlgili teklif bulunamadı." }
  if (quote.request.customerId !== session.user.id) return { error: "Sadece talep sahibi bu işlemi yapabilir." }
  if (quote.request.status === "HIRED" || quote.request.status === "COMPLETED") return { error: "Bu talep için zaten bir anlaşma yapılmış." }

  try {
    // Önce o talebe gelen tüm teklifleri reddediyoruz
    await prisma.quote.updateMany({
      where: { requestId: quote.requestId },
      data: { status: "REJECTED" }
    })
    
    // Sonra seçilen teklifi KABUL EDİLDİ durumuna getiriyoruz
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: "ACCEPTED" }
    })

    // İlgili ServiceRequest (Talep) durumunu HIRED (Sözleşildi/Verildi) yaparak kilitliyoruz.
    await prisma.serviceRequest.update({
      where: { id: quote.requestId },
      data: { status: "HIRED", hiredQuoteId: quoteId }
    })

    revalidatePath(`/musteri/taleplerim/${quote.requestId}`)
    revalidatePath(`/hizmet-veren/firsatlar`)
    revalidatePath("/musteri/taleplerim")

    return { success: true }
  } catch (error) {
    console.error("Anlaşma işlemi hatası:", error)
    return { error: "Anlaşma sağlanırken bir hata oluştu." }
  }
}

export async function completeJobAndReview(params: { requestId: string, rating: number, comment?: string }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Oturum açmadınız." }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.requestId },
    include: { 
      quotes: { 
        where: { status: "ACCEPTED" }, 
        include: { provider: true } 
      } 
    }
  })

  if (!request) return { error: "Talep bulunamadı." }
  if (request.customerId !== session.user.id) return { error: "Yetkisiz işlem." }
  if (request.quotes.length === 0) return { error: "Kabul edilmiş bir teklif bulunamadı." }

  const acceptedQuote = request.quotes[0]
  const provider = acceptedQuote.provider

  // Zaten yorum yapılmış mı?
  const existingReview = await prisma.review.findUnique({
    where: { requestId: request.id }
  })

  if (existingReview) return { error: "Bu hizmet için zaten değerlendirme yapmışsınız." }

  try {
    // Yorum Kaydı
    await prisma.review.create({
      data: {
        requestId: request.id,
        customerId: session.user.id,
        providerId: provider.userId,
        rating: params.rating,
        comment: params.comment || "",
        isApproved: true // MVP'de otomatiktir, küfür filtresi daha sonra admin paneline konur.
      }
    })

    // İş Durumunu COMPLETED yapalım
    await prisma.serviceRequest.update({
      where: { id: request.id },
      data: { status: "COMPLETED" }
    })

    // Provider'ın puanını (Ortalama Rating) güncelleyelim
    const allProviderReviews = await prisma.review.findMany({
      where: { providerId: provider.userId, isApproved: true }
    })

    const totalReviews = allProviderReviews.length
    const sumRatings = allProviderReviews.reduce((sum, rev) => sum + rev.rating, 0)
    const averageRating = totalReviews > 0 ? (sumRatings / totalReviews) : 0

    await prisma.providerProfile.update({
      where: { id: provider.id },
      data: { averageRating, totalReviews }
    })

    revalidatePath(`/musteri/taleplerim/${request.id}`)
    revalidatePath(`/hizmet-veren/profil/${provider.userId}`)

    return { success: true }
  } catch (error) {
    console.error("Yorum ekleme hatası:", error)
    return { error: "Değerlendirmeniz kaydedilirken bir hata oluştu." }
  }
}
