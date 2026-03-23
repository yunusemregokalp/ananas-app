import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminRaporlarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  // Kategori bazlı talep dağılımı
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { requests: true } },
      requests: {
        where: { status: "COMPLETED" },
        select: { id: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Son 30 günlük aktivite
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [recentUsers, recentRequests, recentQuotes] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.serviceRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.quote.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ])

  // Şehir bazlı talep dağılımı
  const cityStats = await prisma.serviceRequest.groupBy({
    by: ["city"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  })

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Raporlar & Analitik</h1>
          <p className="text-muted-foreground mt-1">Platform performansınızı analiz edin.</p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      {/* Son 30 Gün */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm">Son 30 Gün - Yeni Üye</p>
            <p className="text-4xl font-bold mt-2">{recentUsers}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-indigo-100 text-sm">Son 30 Gün - Yeni Talep</p>
            <p className="text-4xl font-bold mt-2">{recentRequests}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-purple-100 text-sm">Son 30 Gün - Yeni Teklif</p>
            <p className="text-4xl font-bold mt-2">{recentQuotes}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kategori Dağılımı */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Kategoriye Göre Talepler</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {categories.map(cat => {
                const total = cat._count.requests
                const completed = cat.requests.length
                const maxCount = Math.max(...categories.map(c => c._count.requests), 1)
                const barWidth = (total / maxCount) * 100

                return (
                  <div key={cat.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="text-gray-500">{total} talep ({completed} tamamlandı)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                )
              })}
              {categories.length === 0 && <p className="text-center py-4 text-muted-foreground text-sm">Veri yok.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Şehir Dağılımı */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Şehirlere Göre Talepler</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {cityStats.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">Henüz veri yok.</p>
            ) : (
              <div className="space-y-3">
                {cityStats.map((city, i) => {
                  const maxCount = cityStats[0]._count.id
                  const barWidth = (city._count.id / maxCount) * 100
                  return (
                    <div key={city.city}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {city.city}
                        </span>
                        <span className="text-gray-500">{city._count.id} talep</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
