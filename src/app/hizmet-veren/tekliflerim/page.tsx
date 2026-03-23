import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function TekliflerimPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const quotes = await prisma.quote.findMany({
    where: { provider: { userId: session.user.id } },
    include: {
      request: {
        include: {
          category: true,
          customer: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const statusMap: Record<string, { label: string; color: string }> = {
    "PENDING": { label: "Bekliyor", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    "ACCEPTED": { label: "Kabul Edildi", color: "bg-green-50 text-green-700 border-green-200" },
    "REJECTED": { label: "Reddedildi", color: "bg-red-50 text-red-700 border-red-200" },
    "WITHDRAWN": { label: "Geri Çekildi", color: "bg-gray-50 text-gray-500 border-gray-200" },
  }

  const accepted = quotes.filter(q => q.status === "ACCEPTED").length
  const pending = quotes.filter(q => q.status === "PENDING").length
  const totalEarnings = quotes.filter(q => q.status === "ACCEPTED").reduce((sum, q) => sum + q.priceAmount, 0)

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tekliflerim</h1>
          <p className="text-muted-foreground mt-1">{quotes.length} teklif verildi</p>
        </div>
        <Link href="/hizmet-veren/panel" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Bekleyen</p>
            <p className="text-2xl font-bold">{pending}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Kabul Edilen</p>
            <p className="text-2xl font-bold text-green-600">{accepted}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Toplam Ciro</p>
            <p className="text-2xl font-bold">{totalEarnings.toLocaleString("tr-TR")} ₺</p>
          </CardContent>
        </Card>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg text-muted-foreground mb-3">Henüz teklif vermediniz.</p>
          <Link href="/hizmet-veren/firsatlar" className="text-indigo-600 font-medium hover:underline">Fırsatları Keşfet →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map(q => {
            const st = statusMap[q.status] || { label: q.status, color: "" }
            return (
              <Card key={q.id} className="hover:border-indigo-200 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{q.request.category.name}</span>
                      <Badge variant="outline" className={`text-xs ${st.color}`}>{st.label}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      📍 {q.request.city}, {q.request.district} · 👤 {q.request.customer.name} · 📅 {new Date(q.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{q.priceAmount.toLocaleString("tr-TR")} ₺</p>
                      <p className="text-xs text-gray-400">-{q.creditCost} kredi</p>
                    </div>
                    {q.status === "ACCEPTED" && (
                      <Link href={`/mesajlar`} className="text-xs text-indigo-600 hover:underline font-medium">
                        💬 Mesaj
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
