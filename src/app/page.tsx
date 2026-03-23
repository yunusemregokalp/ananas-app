import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Search } from "lucide-react"

export default async function HomePage() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    take: 12,
    orderBy: { createdAt: "desc" },
  })

  const [totalProviders, totalRequests, totalReviews] = await Promise.all([
    prisma.providerProfile.count({ where: { status: "APPROVED" } }),
    prisma.serviceRequest.count(),
    prisma.review.count(),
  ])

  // Kategori ikonları
  const iconMap: Record<string, string> = {
    "ev-temizligi": "🧹", "nakliyat": "🚚", "boya-badana": "🎨", "tadilat": "🔨",
    "ozel-ders": "📚", "web-tasarim": "💻", "elektrik": "⚡", "tesisat": "🔧",
    "klima-servisi": "❄️", "fotografcilik": "📷", "bahce-bakimi": "🌿", "pest-kontrol": "🛡️",
  }

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Zamanın Değerli, <span className="text-yellow-400">İşin Ehline</span> Bırak.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mb-10">
            Temizlikten nakliyata, boyadan özel derse... Türkiye&apos;nin en güvenilir hizmet platformu ANANAS ile teklifleri anında karşılaştır.
          </p>

          <div className="w-full max-w-2xl bg-white rounded-full flex items-center p-2 shadow-2xl">
            <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Hangi hizmete ihtiyacın var? Örn: Ev Temizliği"
              className="w-full bg-transparent text-gray-900 px-4 py-3 focus:outline-none text-lg"
            />
            <Button size="lg" className="rounded-full px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-md">
              Ara
            </Button>
          </div>

          {/* Güven İstatistikleri */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-indigo-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalProviders}+</div>
              <div className="text-sm">Onaylı Profesyonel</div>
            </div>
            <div className="w-px bg-indigo-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalRequests}+</div>
              <div className="text-sm">Tamamlanan İş</div>
            </div>
            <div className="w-px bg-indigo-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalReviews}+</div>
              <div className="text-sm">Mutlu Müşteri Yorumu</div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Tüm Hizmet Kategorileri</h2>
            <p className="mt-4 text-lg text-gray-600">Her gün yüzlerce kişinin güvendiği hizmetler</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/kategori/${cat.slug}`} className="group block">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1">
                  <div className="text-4xl mb-3">
                    {iconMap[cat.slug] || cat.name.charAt(0)}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">3 Adımda Hizmet Al</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "📝", title: "Talep Oluştur", desc: "İhtiyacınızı seçin, birkaç soruyu cevaplayın." },
              { step: "2", icon: "📩", title: "Teklif Al", desc: "Bölgenizdeki ustalar size özel fiyat teklifi gönderir." },
              { step: "3", icon: "🤝", title: "Anlaş & Başla", desc: "Beğendiğiniz ustayla anlaşın, işe hemen başlayın." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/nasil-calisir">
              <Button variant="outline" className="rounded-full px-8">
                Detaylı Bilgi →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hemen Başlayın!</h2>
          <p className="text-xl text-indigo-100 mb-8">Ücretsiz kayıt olun, dakikalar içinde teklif almaya başlayın.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-10 font-bold shadow-lg">
                Hizmet Almak İstiyorum
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 font-bold">
                Hizmet Vermek İstiyorum
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
