import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hizmet Veren Ol | ANANAS",
  description: "ANANAS'a katılın ve binlerce potansiyel müşteriye ulaşın. Ücretsiz kayıt olun.",
}

const benefits = [
  { icon: "🎯", title: "Doğru Müşterilere Ulaşın", desc: "Yalnızca sizin uzmanlık alanınıza uygun talepleri görürsünüz." },
  { icon: "💰", title: "Kendi Fiyatınızı Belirleyin", desc: "Her iş için kendi teklifinizi ve fiyatınızı özgürce verin." },
  { icon: "⭐", title: "İtibar Oluşturun", desc: "Müşteri puanları ve yorumlarıyla güçlü bir profil oluşturun." },
  { icon: "📱", title: "Kolay Yönetim", desc: "Tüm tekliflerinizi, mesajlarınızı ve işlerinizi tek bir panelden yönetin." },
  { icon: "🔔", title: "Anlık Bildirimler", desc: "Yeni fırsatlardan anında haberdar olun, işleri kaçırmayın." },
  { icon: "🚀", title: "100 Başlangıç Kredisi", desc: "Kayıt olduğunuzda hesabınıza 100 kredi hediye yüklenir." },
]

const steps = [
  { num: "01", title: "Kayıt Olun", desc: "Ücretsiz hesabınızı oluşturun ve uzmanlık alanlarınızı seçin." },
  { num: "02", title: "Profilinizi Tamamlayın", desc: "Firma bilgilerinizi girin, hizmet verdiğiniz bölgeleri seçin." },
  { num: "03", title: "Fırsatları Keşfedin", desc: "Bölgenizdeki açık talepleri görüntüleyin ve teklif verin." },
  { num: "04", title: "Kazanmaya Başlayın", desc: "Müşterilerle anlaşın, işi tamamlayın ve para kazanın." },
]

export default function HizmetVerenOlPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white py-24">
        <div className="container max-w-5xl text-center">
          <div className="inline-block bg-yellow-400/20 text-yellow-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🎁 Şu an kayıt olanlara 100 başlangıç kredisi hediye!
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Uzmanlığınızı<br/><span className="text-yellow-400">Gelire Dönüştürün</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            ANANAS&apos;a katılın, binlerce potansiyel müşteriye ulaşın ve işinizi büyütün. Kayıt tamamen ücretsiz.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-12 py-5 text-lg rounded-full shadow-2xl">
              Hemen Ücretsiz Kaydol →
            </Button>
          </Link>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Neden ANANAS?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Tek yapmanız gereken alanınızdaki taleplere teklif vermek. Gerisini biz hallederiz.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow border-gray-100">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Adımlar */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Başlarım?</h2>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6 bg-white p-6 rounded-2xl border hover:border-indigo-200 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Son CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hemen Başlayın!</h2>
          <p className="text-xl text-indigo-100 mb-8">Kayıt tamamen ücretsiz. 100 başlangıç kredisi hediye.</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-bold px-12 py-5 text-lg rounded-full shadow-xl">
              Ücretsiz Hesap Oluştur
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
