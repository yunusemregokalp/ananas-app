import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileEditForm from "./ProfileEditForm"
import Link from "next/link"

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { categories: { include: { category: true } } }
  })

  if (!profile) return redirect("/auth/login")

  return (
    <div className="container py-10 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profilimi Düzenle</h1>
        <Link href="/hizmet-veren/panel" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle>Profil Bilgileriniz</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileEditForm profile={{
            companyName: profile.companyName,
            bio: profile.bio,
            city: profile.city,
          }} />
        </CardContent>
      </Card>

      {/* Uzmanlık Alanları */}
      <Card className="mt-6">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle>Uzmanlık Alanlarım</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {profile.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.categories.map(pc => (
                <span key={pc.categoryId} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100">
                  {pc.category.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Henüz uzmanlık alanı eklenmemiş. Yönetici onayı sonrası eklenecektir.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
