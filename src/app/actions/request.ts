"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createServiceRequest(params: {
  categoryId: string
  city: string
  district: string
  answers: Record<string, string>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { error: "unauthenticated" }
  }

  try {
    const newRequest = await prisma.serviceRequest.create({
      data: {
        customerId: session.user.id,
        categoryId: params.categoryId,
        city: params.city,
        district: params.district,
        status: "OPEN",
        answers: {
          create: Object.entries(params.answers).map(([questionId, answer]) => ({
            questionId,
            answer: String(answer)
          }))
        }
      }
    })

    revalidatePath("/musteri/taleplerim")

    return { success: true, requestId: newRequest.id }
  } catch (error) {
    console.error("Talep oluşturma hatası:", error)
    return { error: "Talebiniz oluşturulurken bir hata meydana geldi." }
  }
}
