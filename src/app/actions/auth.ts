"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function registerUser(params: {
  name: string
  phone: string
  password: string
  role: "CUSTOMER" | "PROVIDER"
}) {
  // Telefon numarası daha önce kullanılmış mı?
  const existing = await prisma.user.findFirst({
    where: { phone: params.phone }
  })

  if (existing) {
    return { error: "Bu telefon numarası ile daha önce kayıt yapılmış." }
  }

  const hashed = await bcrypt.hash(params.password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        phone: params.phone,
        password: hashed,
        role: params.role,
        customerProfile: params.role === "CUSTOMER" ? { create: {} } : undefined,
        providerProfile: params.role === "PROVIDER" ? {
          create: {
            status: "PENDING"
          }
        } : undefined,
        wallet: params.role === "PROVIDER" ? {
          create: { balance: 100 } // Başlangıç kredisi
        } : undefined,
      }
    })

    return { success: true, userId: user.id }
  } catch (err) {
    console.error(err)
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." }
  }
}

export async function updateProviderProfile(params: {
  companyName?: string
  bio?: string
  city?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Oturum açmadınız." }

  try {
    await prisma.providerProfile.update({
      where: { userId: session.user.id },
      data: {
        companyName: params.companyName,
        bio: params.bio,
        city: params.city,
      }
    })

    revalidatePath("/hizmet-veren/profil")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Profil güncellenirken hata oluştu." }
  }
}
