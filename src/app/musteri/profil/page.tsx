import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function MusteriProfilPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "CUSTOMER") {
    return redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: true,
      requests: {
        include: { category: true, _count: { select: { quotes: true } } },
        orderBy: { createdAt: "desc" },
        take: 5
      },
      reviews: {
        include: { request: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  })

  if (!user) return redirect("/auth/login")

  const statusMap: Record<string, string> = {
    "OPEN": "🟢 Açık", "QUOTED": "📩 Teklif Aldı", "HIRED": "🤝 Anlaşıldı",
    "COMPLETED": "✅ Tamamlandı", "CANCELLED": "❌ İptal"
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profilim</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profil Kartı */}
        <Card className="col-span-1">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 text-3xl font-bold mb-4">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{user.phone || user.email}</p>
            <p className="text-xs text-indigo-600 font-medium mt-2">🛒 Müşteri Hesabı</p>

            <div className="mt-6 pt-6 border-t space-y-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Toplam Talep</span>
                <span className="font-semibold">{user.requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verilen Yorum</span>
                <span className="font-semibold">{user.reviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Üyelik</span>
                <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Son Talepler */}
        <Card className="col-span-2">
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Taleplerim</CardTitle>
            <Link href="/musteri/taleplerim" className="text-sm text-indigo-600 hover:underline">Tümü →</Link>
          </CardHeader>
          <CardContent className="pt-4">
            {user.requests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Henüz talep oluşturmadınız.</p>
                <Link href="/" className="text-indigo-600 font-medium hover:underline">Hemen bir hizmet seçin →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.requests.map(req => (
                  <Link key={req.id} href={`/musteri/taleplerim/${req.id}`}>
                    <div className="flex justify-between items-center p-3 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <div>
                        <span className="font-semibold text-gray-900">{req.category.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{req.city}</span>
                      </div>
                      <div className="text-sm">
                        <span className="mr-3">{statusMap[req.status] || req.status}</span>
                        <span className="text-gray-400">{req._count.quotes} teklif</span>
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
