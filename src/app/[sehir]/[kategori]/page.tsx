import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Params = { sehir: string; kategori: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const sehirAd = decodeURIComponent(params.sehir)
    .split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  const kategoriAd = decodeURIComponent(params.kategori)
    .split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return {
    title: `${sehirAd} ${kategoriAd} Hizmeti | ANANAS`,
    description: `${sehirAd} bölgesinde güvenilir ${kategoriAd} profesyonelleri. Ücretsiz teklif alın, fiyatları karşılaştırın. ANANAS ile hizmet vermek veya almak çok kolay.`,
    keywords: [`${sehirAd} ${kategoriAd}`, `${sehirAd} ${kategoriAd} fiyatı`, `${sehirAd} ${kategoriAd} ustası`],
    openGraph: {
      title: `${sehirAd} ${kategoriAd} Hizmeti | ANANAS`,
      description: `${sehirAd} bölgesinde güvenilir ${kategoriAd} profesyonelleri için ANANAS'a başvurun.`,
    }
  }
}

export default async function SehirKategoriPage({ params }: { params: Params }) {
  const sehirLabel = decodeURIComponent(params.sehir)
    .split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  const kategoriSlug = params.kategori

  const category = await prisma.serviceCategory.findUnique({
    where: { slug: kategoriSlug }
  })

  // Onaylanmış, ilgili şehirde çalışan Hizmet Verenler
  const providers = await prisma.providerProfile.findMany({
    where: {
      status: "APPROVED",
      city: { contains: sehirLabel, mode: "insensitive" },
      categories: { some: { category: { slug: kategoriSlug } } }
    },
    include: {
      user: { select: { name: true } },
      categories: { include: { category: true } }
    },
    take: 12,
    orderBy: { averageRating: "desc" }
  })

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Bölümü */}
      <section className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {sehirLabel} {category?.name || decodeURIComponent(params.kategori).replace(/-/g, " ")} Hizmeti
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            {sehirLabel} bölgesindeki en iyi ustalar ve firmalar ANANAS'ta. Ücretsiz teklif alın.
          </p>
          <Link href={`/kategori/${params.kategori}`}>
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-10 py-4 text-lg rounded-full shadow-lg">
              Ücretsiz Teklif Al
            </Button>
          </Link>
        </div>
      </section>

      {/* SEO İçerik Bölümü */}
      <section className="container py-12 max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          {sehirLabel} Bölgesindeki {category?.name} Hizmet Verenleri ({providers.length} Kayıtlı)
        </h2>

        {providers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map(p => (
              <Link key={p.id} href={`/hizmet-veren/profil/${p.userId}`}>
                <Card className="hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{p.companyName || p.user.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-500 font-semibold">
                      {"★".repeat(Math.round(p.averageRating))}{"☆".repeat(5 - Math.round(p.averageRating))}
                      <span className="text-gray-600 font-normal text-sm">({p.totalReviews} yorum)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.categories.slice(0, 3).map(pc => (
                        <span key={pc.categoryId} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                          {pc.category.name}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">📍 {p.city}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-lg text-gray-600 mb-4">
              {sehirLabel} bölgesinde henüz kayıtlı sağlayıcımız yok. Siz de hizmet verebilirsiniz!
            </p>
            <Link href="/auth/register">
              <Button variant="default">Hizmet Veren Olarak Kaydol</Button>
            </Link>
          </div>
        )}

        {/* SEO Metin Bölümü */}
        <div className="mt-12 prose max-w-none text-gray-700 border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {sehirLabel}&apos;da {category?.name} Hizmeti Nasıl Alınır?
          </h2>
          <p>
            ANANAS platformu üzerinden {sehirLabel} bölgesinde {category?.name || "hizmet"} almak oldukça kolay. Sadece birkaç adımda ihtiyacınızı tanımlayın, profesyonellerin tekliflerini karşılaştırın ve en uygun fiyatlı {category?.name} ustasını seçin.
          </p>
          <ol className="space-y-2 mt-4">
            <li><strong>1. Talep Oluşturun:</strong> İhtiyacınızı birkaç soruyu cevaplayarak tanımlayın.</li>
            <li><strong>2. Teklif Alın:</strong> {sehirLabel} bölgesindeki ustalar size fiyat teklifi gönderir.</li>
            <li><strong>3. Karşılaştırın:</strong> Profilleri, yorumları ve fiyatları kıyaslayın.</li>
            <li><strong>4. Anlaşın:</strong> Beğendığiniz usta ile güvenle anlaşın.</li>
          </ol>
        </div>
      </section>
    </div>
  )
}
