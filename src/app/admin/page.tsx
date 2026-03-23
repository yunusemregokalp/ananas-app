import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  const [
    totalCustomers, totalProviders, pendingProviders,
    totalRequests, openRequests, completedRequests,
    totalQuotes, totalReviews, totalCreditsSpent
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.providerProfile.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "OPEN" } }),
    prisma.serviceRequest.count({ where: { status: "COMPLETED" } }),
    prisma.quote.count(),
    prisma.review.count(),
    prisma.walletTransaction.count({ where: { type: "DEBIT" } }),
  ])

  // Son onay bekleyen hizmet verenler
  const pendingList = await prisma.providerProfile.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { name: true, phone: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  // Son talepler
  const recentRequests = await prisma.serviceRequest.findMany({
    include: { category: true, customer: { select: { name: true } }, _count: { select: { quotes: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Yönetim Paneli</h1>
        {pendingProviders > 0 && (
          <Link href="/admin/kullanicilar">
            <Badge className="bg-red-500 text-white px-4 py-2 text-sm animate-pulse">
              ⚠️ {pendingProviders} onay bekliyor
            </Badge>
          </Link>
        )}
      </div>

      {/* KPI Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground uppercase">Müşteri</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{totalCustomers}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground uppercase">Hizmet Veren</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProviders}</div>
            {pendingProviders > 0 && <p className="text-xs text-orange-600 font-medium mt-1">{pendingProviders} onay bekliyor</p>}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground uppercase">Toplam Talep</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRequests}</div>
            <p className="text-xs text-indigo-600 font-medium mt-1">{openRequests} açık · {completedRequests} tamamlandı</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground uppercase">Verilen Teklif</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuotes}</div>
            <p className="text-xs text-green-600 font-medium mt-1">{totalReviews} yorum · {totalCreditsSpent * 10} kredi harcandı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Onay Bekleyenler */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Onay Bekleyen Ustalar</CardTitle>
            <Link href="/admin/kullanicilar" className="text-sm text-indigo-600 hover:underline">Tümü →</Link>
          </CardHeader>
          <CardContent className="pt-4">
            {pendingList.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground text-sm">Onay bekleyen usta yok ✅</p>
            ) : (
              <div className="space-y-3">
                {pendingList.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <span className="font-semibold text-sm">{p.companyName || p.user.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{p.user.phone}</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-xs">Bekliyor</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Son Talepler */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Talepler</CardTitle>
            <Link href="/admin/talepler" className="text-sm text-indigo-600 hover:underline">Tümü →</Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentRequests.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground text-sm">Henüz talep yok.</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center p-3 rounded-lg border text-sm">
                    <div>
                      <span className="font-semibold">{req.category.name}</span>
                      <span className="text-gray-500 ml-2">{req.city} · {req.customer.name}</span>
                    </div>
                    <span className="text-gray-400">{req._count.quotes} teklif</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hızlı Linkler */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {[
              { href: "/admin/kullanicilar", icon: "👥", label: "Kullanıcı Yönetimi" },
              { href: "/admin/talepler", icon: "📋", label: "Talep Yönetimi" },
              { href: "/admin/kategoriler", icon: "⚙️", label: "Kategori Yönetimi" },
              { href: "/admin/raporlar", icon: "📊", label: "Finansal Raporlar" },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700 hover:text-indigo-700">
                <span className="text-lg">{link.icon}</span> {link.label}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Finansal Özet */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Kredi Sistemi Özeti</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
              <span className="text-sm text-gray-600">Toplam Verilen Teklif</span>
              <span className="text-lg font-bold">{totalQuotes}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Toplam Harcanan Kredi</span>
              <span className="text-lg font-bold text-green-600">{totalCreditsSpent * 10} 💎</span>
            </div>
            <p className="text-xs text-gray-400 italic">
              İlerleyen fazlarda Iyzico/Stripe entegrasyonu ile ödeme altyapısı eklenecektir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
