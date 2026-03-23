import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function ProviderDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { categories: { include: { category: true } } }
  })

  if (!profile) return redirect("/auth/login")

  const [quotesGiven, acceptedQuotes, totalEarnings, recentRequests] = await Promise.all([
    prisma.quote.count({ where: { provider: { userId: session.user.id } } }),
    prisma.quote.count({ where: { provider: { userId: session.user.id }, status: "ACCEPTED" } }),
    prisma.quote.aggregate({
      where: { provider: { userId: session.user.id }, status: "ACCEPTED" },
      _sum: { priceAmount: true }
    }),
    prisma.serviceRequest.findMany({
      where: { status: { in: ["OPEN", "QUOTED"] } },
      include: { category: true, _count: { select: { quotes: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
  ])

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } })

  return (
    <div className="container py-10 max-w-6xl">
      {/* Hoşgeldin */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Merhaba, {profile.companyName || session.user.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">İşte bugünkü durumunuz.</p>
        </div>
        <Badge variant={profile.status === "APPROVED" ? "default" : "secondary"} className="text-sm px-4 py-1.5 w-fit">
          {profile.status === "APPROVED" ? "✅ Onaylı Profil" : "⏳ Onay Bekliyor"}
        </Badge>
      </div>

      {/* KPI Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Kalan Kredi</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{wallet?.balance?.toFixed(0) || 0} 💎</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Gönderilen Teklif</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{quotesGiven}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Kazanılan İş</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{acceptedQuotes}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Toplam Ciro</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(totalEarnings._sum.priceAmount || 0).toLocaleString("tr-TR")} ₺</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profil Bilgileri */}
        <Card className="col-span-1">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Profilim</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 text-3xl font-bold mb-3">
                {(profile.companyName || session.user.name || "?")[0].toUpperCase()}
              </div>
              <p className="font-bold text-lg">{profile.companyName || session.user.name}</p>
              <p className="text-yellow-500 font-semibold mt-1">
                ⭐ {profile.averageRating.toFixed(1)} ({profile.totalReviews} yorum)
              </p>
            </div>
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-gray-500">Şehir</span><span className="font-medium">{profile.city || "Belirtilmemiş"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Uzmanlık</span>
                <span className="font-medium">{profile.categories.map(c => c.category.name).join(", ") || "Yok"}</span>
              </div>
            </div>
            <Link href={`/hizmet-veren/profil/${session.user.id}`} className="block text-center text-sm text-indigo-600 hover:underline font-medium pt-2 border-t">
              Herkese Açık Profilimi Görüntüle →
            </Link>
          </CardContent>
        </Card>

        {/* Son Fırsatlar */}
        <Card className="col-span-2">
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Açılan Fırsatlar</CardTitle>
            <Link href="/hizmet-veren/firsatlar" className="text-sm text-indigo-600 hover:underline">
              Tümünü Gör →
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Şu anda açık talep bulunmuyor.</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map(req => (
                  <Link key={req.id} href={`/hizmet-veren/firsatlar/${req.id}`}>
                    <div className="flex justify-between items-center p-3 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <div>
                        <span className="font-semibold text-gray-900">{req.category.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{req.city}, {req.district}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{req._count.quotes} Teklif</Badge>
                        <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
