import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Search } from "lucide-react"

export default async function HomePage() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    take: 8,
    orderBy: { createdAt: "desc" }, // veya order/popülarite
  })

  return (
    <div className="min-h-screen flex flex-col pt-16"> {/* Header height pt-16 */}
      {/* HERO BÖLÜMÜ */}
      <section className="relative bg-indigo-900 overflow-hidden text-white">
        <div className="absolute inset-0">
          {/* Arkaya dekoratif gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 opacity-90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Zamanın Değerli, <span className="text-yellow-400">İşin Ehline</span> Bırak.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mb-10">
            Temizlikten nakliyata, boyadan özel derse... Türkiye'nin en güvenilir hizmet platformu ANANAS ile teklifleri anında karşılaştır.
          </p>

          <div className="w-full max-w-2xl bg-white rounded-full flex items-center p-2 shadow-xl">
            <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Hangi hizmete ihtiyacın var? Örn: Ev Temizliği"
              className="w-full bg-transparent text-gray-900 px-4 py-3 focus:outline-none text-lg"
            />
            <Button size="lg" className="rounded-full px-8 text-base bg-indigo-600 hover:bg-indigo-700">
              Ara
            </Button>
          </div>
        </div>
      </section>

      {/* POPÜLER KATEGORİLER */}
      <section className="py-20 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popüler Hizmetler</h2>
            <p className="mt-4 text-lg text-gray-600">Her gün yüzlerce kişinin güvendiği hizmetler</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="group block">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {cat.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))
            ) : (
              // Seed verisi yoksa gösterilecek örnekler (MVP demo için)
              <>
                {["Ev Temizliği", "Nakliyat", "Boya Badana", "Web Tasarım"].map((name) => (
                  <Link key={name} href={`/kategori/${name.toLowerCase().replace(" ", "-")}`} className="group block">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
                      <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {name.charAt(0)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                        {name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
