import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProviderPublicProfilePage({ params }: { params: { id: string } }) {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: params.id },
    include: {
      user: true,
      categories: { include: { category: true } }
    }
  })

  // Eğer profil yoksa veya kullanıcı silinmişse 404
  if (!provider) return notFound()

  // Sadece onaylanmış (isApproved=true) yorumları al
  const reviews = await prisma.review.findMany({
    where: { providerId: params.id, isApproved: true },
    include: {
      customer: { select: { name: true } },
      request: { select: { category: { select: { name: true } } } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sütun: Profil Bilgileri */}
        <div className="md:w-1/3 space-y-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="text-center pt-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-4xl font-bold shadow-inner">
                {provider.companyName?.[0]?.toUpperCase() || provider.user.name?.[0]?.toUpperCase() || "H"}
              </div>
              <CardTitle className="text-2xl">{provider.companyName || provider.user.name}</CardTitle>
              <CardDescription className="text-lg mt-2 font-medium">
                <span className="text-yellow-500">⭐ {provider.averageRating.toFixed(1)}</span> 
                <span className="text-gray-500 text-sm ml-1">({provider.totalReviews} Yorum)</span>
              </CardDescription>
              {provider.status === "APPROVED" && (
                <Badge variant="outline" className="mt-4 text-green-600 border-green-200 bg-green-50 w-fit mx-auto px-3 py-1 text-sm">
                  Onaylı Hizmet Veren
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="bg-gray-50 p-3 rounded-md border text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Hizmet Verdiği İl</span>
                <span className="font-bold text-gray-900 text-base">{provider.city || "Türkiye Geneli"}</span>
              </div>
              <div>
                 <span className="text-gray-500 block mb-2 font-medium">Uzmanlık Alanları</span>
                 <div className="flex flex-wrap gap-2">
                   {provider.categories.map(pc => (
                     <Badge key={pc.categoryId} variant="secondary" className="px-2 py-1">{pc.category.name}</Badge>
                   ))}
                   {provider.categories.length === 0 && <span className="text-gray-400 italic">Kategori belirtilmemiş</span>}
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sütun: Biyografi ve Yorumlar */}
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader className="border-b bg-gray-50/50 pb-4">
              <CardTitle className="text-xl">Hakkında</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                {provider.bio || "Hizmet veren henüz detaylı bir tanıtım / biyografi metni eklemedi."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-gray-50/50 pb-4">
              <CardTitle className="text-xl">Müşteri Değerlendirmeleri ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-muted-foreground bg-gray-50 p-8 rounded-lg text-center border">
                  Bu hizmet verene henüz bir yorum yapılmamış. Yeni bir iş tamamlandığında değerlendirmeler burada görünür.
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-semibold text-gray-900 border-l-2 pl-2 border-primary">
                          {review.customer.name || "İsimsiz Müşteri"}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 bg-gray-100 border px-2 py-1 rounded-full">
                          Açtığı Talep: {review.request.category.name}
                        </span>
                      </div>
                      <div className="text-yellow-400 font-bold tracking-widest text-lg">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 italic bg-gray-50/50 p-3 rounded-md border-l-4 border-l-gray-200">
                        "{review.comment}"
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mt-3 text-right">
                      {new Date(review.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
