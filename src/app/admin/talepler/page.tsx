import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      customer: { select: { name: true, phone: true } },
      _count: { select: { quotes: true } }
    }
  })

  const statusMap: Record<string, { label: string, color: string }> = {
    "OPEN": { label: "Açık", color: "bg-blue-50 text-blue-700 border-blue-200" },
    "QUOTED": { label: "Teklif Aldı", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    "HIRED": { label: "Anlaşıldı", color: "bg-orange-50 text-orange-700 border-orange-200" },
    "COMPLETED": { label: "Tamamlandı", color: "bg-green-50 text-green-700 border-green-200" },
    "CANCELLED": { label: "İptal", color: "bg-red-50 text-red-700 border-red-200" },
  }

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Talep Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Platformdaki tüm hizmet talepleri ({requests.length} adet)</p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-lg text-muted-foreground">Henüz hiç talep oluşturulmamış.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const st = statusMap[req.status] || { label: req.status, color: "" }
            return (
              <Card key={req.id} className="hover:border-indigo-200 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{req.category.name}</span>
                      <Badge variant="outline" className={`text-xs ${st.color}`}>{st.label}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      📍 {req.city}, {req.district} · 👤 {req.customer.name} ({req.customer.phone}) · 📅 {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{req._count.quotes} teklif</span>
                    <Link href={`/musteri/taleplerim/${req.id}`} className="text-xs text-indigo-600 hover:underline font-medium">
                      Detay →
                    </Link>
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
