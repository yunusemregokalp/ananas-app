"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function startOrGetThread(quoteId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Oturum açmadınız" }

  // Teklifi kontrol et
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { request: true }
  })

  if (!quote) return { error: "Teklif bulunamadı" }

  // Kullanıcı bu teklifte yetkili mi? (Ya talebi açan Müşteri, ya da teklifi veren Provider)
  const isCustomer = quote.request.customerId === session.user.id
  let isProvider = false

  if (session.user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id }
    })
    isProvider = providerProfile?.id === quote.providerId
  }

  if (!isCustomer && !isProvider) {
    return { error: "Bu işleme yetkiniz yok" }
  }

  // Zaten var olan thread var mı?
  let thread = await prisma.messageThread.findUnique({
    where: { quoteId }
  })

  if (!thread) {
    // Yeni oluştur ve her iki tarafı participants'a ekle
    // Provider'ın userId'sini bulmamız lazım
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { id: quote.providerId },
        select: { userId: true }
    })

    if (!providerProfile) return { error: "Hizmet veren bulunamadı" }

    thread = await prisma.messageThread.create({
      data: {
        quoteId,
        participants: {
          connect: [{ id: quote.request.customerId }, { id: providerProfile.userId }]
        }
      }
    })
  }

  return { success: true, threadId: thread.id }
}

export async function sendMessage(threadId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Oturum açmadınız" }

  // Mesaj kanalında mıyız kontrolü
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: { participants: true }
  })

  if (!thread) return { error: "Mesaj kanalı bulunamadı" }

  const isParticipant = thread.participants.some(p => p.id === session.user.id)
  if (!isParticipant) return { error: "Bu sohbete mesaj gönderemezsiniz" }

  const message = await prisma.message.create({
    data: {
      threadId,
      senderId: session.user.id,
      content,
    }
  })

  revalidatePath(`/mesajlar/${threadId}`)
  
  return { success: true, messageId: message.id }
}
