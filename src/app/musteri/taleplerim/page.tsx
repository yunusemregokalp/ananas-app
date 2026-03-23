import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CustomerRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const requests = await prisma.serviceRequest.findMany({
    where: { customerId: session.user.id },
    include: {
      category: true,
      _count: { select: { quotes: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
    "OPEN": { label: "Açık", icon: "🟢", color: "bg-green-50 text-green-700 border-green-200" },
    "QUOTED": { label: "Teklif Aldı", icon: "📩", color: "bg-blue-50 text-blue-700 border-blue-200" },
    "HIRED": { label: "Anlaşıldı", icon: "🤝", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    "COMPLETED": { label: "Tamamlandı", icon: "✅", color: "bg-green-50 text-green-700 border-green-200" },
    "CANCELLED": { label: "İptal", icon: "❌", color: "bg-red-50 text-red-700 border-red-200" },
  }

  const openCount = requests.filter(r => r.status === "OPEN" || r.status === "QUOTED").length
  const completedCount = requests.filter(r => r.status === "COMPLETED").length
  const totalQuotes = requests.reduce((sum, r) => sum + r._count.quotes, 0)

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Taleplerim</h1>
          <p className="text-muted-foreground mt-1">{requests.length} talep oluşturdunuz</p>
        </div>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6">+ Yeni Talep</Button>
        </Link>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Aktif</p>
            <p className="text-2xl font-bold">{openCount}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Toplam Teklif</p>
            <p className="text-2xl font-bold text-blue-600">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Tamamlanan</p>
            <p className="text-2xl font-bold text-indigo-600">{completedCount}</p>
          </CardContent>
        </Card>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg text-muted-foreground mb-4">Henüz talep oluşturmadınız.</p>
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8">Hemen Başla →</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const st = statusConfig[req.status] || { label: req.status, icon: "❓", color: "" }
            return (
              <Link key={req.id} href={`/musteri/taleplerim/${req.id}`}>
                <Card className="hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                        {st.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{req.category.name}</h3>
                        <p className="text-sm text-gray-500">
                          📍 {req.city}, {req.district} · 📅 {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {req._count.quotes > 0 && (
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          {req._count.quotes} teklif
                        </span>
                      )}
                      <Badge variant="outline" className={`text-xs ${st.color}`}>
                        {st.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
