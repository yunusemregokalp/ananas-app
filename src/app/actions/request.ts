"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createServiceRequest(params: {
  categoryId: string
  city: string
  district: string
  description?: string
  urgency?: string
  budget?: string
  answers: Record<string, string>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "unauthenticated" }
  }

  try {
    // Kategori bilgisini al (bildirim için)
    const category = await prisma.serviceCategory.findUnique({
      where: { id: params.categoryId },
      select: { name: true }
    })

    const newRequest = await prisma.serviceRequest.create({
      data: {
        customerId: session.user.id,
        categoryId: params.categoryId,
        city: params.city,
        district: params.district,
        description: params.description || null,
        urgency: params.urgency || null,
        budget: params.budget || null,
        status: "OPEN",
        answers: {
          create: Object.entries(params.answers).map(([questionId, answer]) => ({
            questionId,
            answer: String(answer)
          }))
        }
      }
    })

    // Müşteriye onay bildirimi gönder
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Talebiniz Oluşturuldu! ✅",
        message: `${category?.name || "Hizmet"} talebiniz başarıyla oluşturuldu. Ustalardan teklif almaya başladığınızda bilgilendirileceksiniz.`
      }
    })

    revalidatePath("/musteri/taleplerim")
    revalidatePath("/hizmet-veren/firsatlar")

    return { success: true, requestId: newRequest.id }
  } catch (error) {
    console.error("Talep oluşturma hatası:", error)
    return { error: "Talebiniz oluşturulurken bir hata meydana geldi." }
  }
}
