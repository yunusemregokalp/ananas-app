import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProviderOpportunitiesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const [opportunities, wallet, myQuotes] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: { status: { in: ["OPEN", "QUOTED"] } },
      include: {
        category: true,
        customer: { select: { name: true } },
        _count: { select: { quotes: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.wallet.findUnique({ where: { userId: session.user.id } }),
    prisma.quote.findMany({
      where: { provider: { userId: session.user.id } },
      select: { requestId: true }
    })
  ])

  const myQuoteRequestIds = new Set(myQuotes.map(q => q.requestId))

  // Aciliyete göre renk
  const urgencyMap: Record<string, { label: string; color: string }> = {
    "ACİL": { label: "🔴 Acil", color: "text-red-600 bg-red-50 border-red-200" },
    "1 HAFTA İÇİNDE": { label: "🟡 1 Hafta", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
    "TARİH BELLİ DEĞİL": { label: "🟢 Esnek", color: "text-green-700 bg-green-50 border-green-200" },
  }

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Yeni İş Fırsatları</h1>
          <p className="text-muted-foreground mt-1">{opportunities.length} açık talep mevcut</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm">
            💎 <span className="font-bold text-indigo-700">{wallet?.balance || 0}</span> kredi
          </div>
          <Link href="/hizmet-veren/kredi">
            <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200">Kredi Yükle</Button>
          </Link>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg text-muted-foreground">Şu an açık fırsat yok. Daha sonra tekrar kontrol edin.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map(req => {
            const alreadyQuoted = myQuoteRequestIds.has(req.id)
            const urgency = urgencyMap[req.urgency || ""] || null

            return (
              <Card key={req.id} className={`flex flex-col transition-all hover:shadow-md ${alreadyQuoted ? "opacity-60 border-green-200" : "hover:border-indigo-200"}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{req.category.name}</CardTitle>
                    {alreadyQuoted && (
                      <Badge className="bg-green-100 text-green-700 text-xs">✅ Teklif Verildi</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>📍 {req.city}, {req.district}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Müşteri</span>
                      <span className="font-medium">{req.customer.name}</span>
                    </div>
                    {urgency && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Aciliyet</span>
                        <Badge variant="outline" className={`text-xs ${urgency.color}`}>{urgency.label}</Badge>
                      </div>
                    )}
                    {req.budget && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bütçe</span>
                        <span className="font-medium">{req.budget}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mevcut Teklif</span>
                      <span className="font-medium">{req._count.quotes} adet</span>
                    </div>
                  </div>
                  {req.description && (
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg line-clamp-2">{req.description}</p>
                  )}
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Link href={`/hizmet-veren/firsatlar/${req.id}`} className="w-full">
                    <Button className={`w-full ${alreadyQuoted ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`} disabled={alreadyQuoted}>
                      {alreadyQuoted ? "Teklif Verildi" : "Detay & Teklif Ver"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
