import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function CustomerRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const requests = await prisma.serviceRequest.findMany({
    where: { customerId: session.user.id },
    include: {
      category: true,
      quotes: true // Teklifleri de dahil et
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Taleplerim</h1>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Henüz bir hizmet talebiniz bulunmuyor. Ana sayfadan bir kategori seçerek ilk talebinizi oluşturabilirsiniz.
            </CardContent>
          </Card>
        ) : (
          requests.map(req => (
            <Card key={req.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>{req.category.name}</CardTitle>
                  <CardDescription>
                    {req.city}, {req.district} • {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                  </CardDescription>
                </div>
                <Badge variant={req.status === "OPEN" ? "default" : "secondary"}>
                  {req.status === "OPEN" ? "AÇIK" : req.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm font-medium">
                    {req.quotes.length} Teklif Alındı
                  </div>
                  <Link href={`/musteri/taleplerim/${req.id}`} className="text-primary hover:underline font-medium text-sm">
                    Detayları ve Teklifleri Gör &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
