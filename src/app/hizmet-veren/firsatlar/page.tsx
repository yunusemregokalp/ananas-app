import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProviderOpportunitiesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    // Sadece hizmet verenler görebilir
    return redirect("/auth/login")
  }

  // Tüm AÇIK talepleri getir. (MVP'de lokasyon veya kategori filtresi koymuyoruz, hepsini listeliyoruz)
  const opportunities = await prisma.serviceRequest.findMany({
    where: { status: "OPEN" },
    include: {
      category: true,
      customer: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Yeni İş Fırsatları</h1>
          <p className="text-muted-foreground mt-1">Bölgenizdeki ve kategorinizdeki yeni taleplere teklif verin.</p>
        </div>
        <div className="text-right">
          {/* Gelecekte buraya cüzdan bakiye göstergesi konulabilir */}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/50 rounded-lg">
            Şu an için uygun yeni bir iş fırsatı bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
          </div>
        ) : (
          opportunities.map(req => (
            <Card key={req.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{req.category.name}</CardTitle>
                <CardDescription>
                  {req.city}, {req.district} • {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Müşteri: {req.customer.name}</p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {/* Talep detayının kısa bir özeti gösterilebilir (MVP için gizli tutulabilir) */}
                  Bu talebin detaylarını görmek ve teklif vermek için tıklayın.
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Link href={`/hizmet-veren/firsatlar/${req.id}`} className="w-full">
                  <Button className="w-full" variant="default">Teklif Ver</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
