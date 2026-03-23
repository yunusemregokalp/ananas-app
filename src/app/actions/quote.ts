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
    return { error: "unauthenticated" }
  }

  try {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!providerProfile) {
      return { error: "Hizmet veren profiliniz bulunamadı. Lütfen profilinizi tamamlayın." }
    }

    // Aynı talebe birden fazla teklif verilmesini engelle
    const existingQuote = await prisma.quote.findFirst({
      where: {
        requestId: params.requestId,
        providerId: providerProfile.id
      }
    })

    if (existingQuote) {
      return { error: "Bu talebe zaten teklif verdiniz." }
    }

    const newQuote = await prisma.quote.create({
      data: {
        requestId: params.requestId,
        providerId: providerProfile.id,
        priceAmount: params.priceAmount,
        priceType: "SABİT_FİYAT",
        coverLetter: params.coverLetter,
        creditCost: 10,
        status: "PENDING"
      }
    })

    await prisma.serviceRequest.update({
      where: { id: params.requestId },
      data: { status: "QUOTED" }
    })

    revalidatePath("/hizmet-veren/firsatlar")
    revalidatePath("/hizmet-veren/tekliflerim")
    revalidatePath(`/musteri/taleplerim/${params.requestId}`)

    return { success: true }
  } catch (error) {
    console.error("Teklif verme hatası:", error)
    return { error: "Teklifiniz iletilemedi, lütfen tekrar deneyin." }
  }
}
