import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      providerProfile: true,
      customerProfile: true,
      _count: {
        select: {
          sentMessages: true,
        }
      }
    }
  })

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Platformdaki tüm kullanıcıları yönetin ({users.length} kayıt)</p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      <div className="space-y-3">
        {users.map(user => (
          <Card key={user.id} className="hover:border-indigo-200 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.name || "İsimsiz"}</div>
                  <div className="text-sm text-gray-500">
                    {user.email || user.phone || "Bilgi yok"} · {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={
                  user.role === "SUPER_ADMIN" ? "destructive" :
                  user.role === "PROVIDER" ? "default" : "secondary"
                }>
                  {user.role === "SUPER_ADMIN" ? "Yönetici" :
                   user.role === "PROVIDER" ? "Hizmet Veren" : "Müşteri"}
                </Badge>

                {user.providerProfile && (
                  <Badge variant="outline" className={
                    user.providerProfile.status === "APPROVED" 
                      ? "text-green-600 border-green-200 bg-green-50" 
                      : "text-yellow-600 border-yellow-200 bg-yellow-50"
                  }>
                    {user.providerProfile.status === "APPROVED" ? "Onaylı" : "Bekliyor"}
                  </Badge>
                )}

                {user.providerProfile && (
                  <Link href={`/hizmet-veren/profil/${user.id}`} className="text-xs text-indigo-600 hover:underline">
                    Profili Gör
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
