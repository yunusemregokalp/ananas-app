"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function approveProvider(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return { error: "Yetkisiz erişim." }
  }

  await prisma.providerProfile.update({
    where: { userId },
    data: { status: "APPROVED" }
  })

  revalidatePath("/admin/kullanicilar")
  return { success: true }
}

export async function rejectProvider(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return { error: "Yetkisiz erişim." }
  }

  await prisma.providerProfile.update({
    where: { userId },
    data: { status: "REJECTED" }
  })

  revalidatePath("/admin/kullanicilar")
  return { success: true }
}

export async function addCredits(userId: string, amount: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return { error: "Yetkisiz erişim." }
  }

  await prisma.wallet.update({
    where: { userId },
    data: { balance: { increment: amount } }
  })

  revalidatePath("/admin/kullanicilar")
  return { success: true }
}

export async function createNotification(userId: string, title: string, message: string) {
  await prisma.notification.create({
    data: { userId, title, message }
  })
}
