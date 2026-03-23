import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nasıl Çalışır? | ANANAS",
  description: "ANANAS hizmet pazaryeri nasıl çalışır? Hizmet almak veya vermek için 3 adımda başlayın.",
}

const steps = [
  {
    icon: "📝",
    title: "1. İhtiyacınızı Tanımlayın",
    desc: "Hangi hizmete ihtiyacınız olduğunu seçin ve birkaç soruyu cevaplayın. Talebiniz saniyeler içinde ilgili profesyonellere iletilir.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "📩",
    title: "2. Teklif Alın ve Karşılaştırın",
    desc: "Bölgenizdeki onaylı hizmet verenler size özel fiyat teklifleri gönderir. Profilleri, puanları ve fiyatları karşılaştırın.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: "🤝",
    title: "3. Anlaşın ve İşi Başlatın",
    desc: "Beğendiğiniz profesyonelle anlaşın, doğrudan mesajlaşma ile iletişime geçin. İş bitince puanlama yaparak topluluğa katkıda bulunun.",
    color: "from-purple-500 to-pink-600",
  },
]

const providerSteps = [
  {
    icon: "🔧",
    title: "Ücretsiz Profil Oluşturun",
    desc: "Uzmanlık alanınızı ve hizmet verdiğiniz bölgeyi belirtin. Profiliniz dakikalar içinde aktif olur.",
  },
  {
    icon: "⚡",
    title: "Fırsatları Görün",
    desc: "Bölgenizdeki açık talepleri anında görüntüleyin. Size uygun işlere teklif verin.",
  },
  {
    icon: "💰",
    title: "Kazanmaya Başlayın",
    desc: "Müşterilerle anlaşın, işi tamamlayın, olumlu yorumlar toplayarak itibarınızı büyütün.",
  },
]

export default function NasilCalisirPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Nasıl Çalışır?</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            ANANAS ile hizmet almak veya vermek sadece 3 adım. Tamamen ücretsiz, hızlı ve güvenli.
          </p>
        </div>
      </section>

      {/* Hizmet Alanlar İçin */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Hizmet Almak İstiyorum</h2>
          <p className="text-center text-gray-500 mb-12">Ev temizliğinden nakliyata, boyadan tadilata… İhtiyacınız ne olursa olsun.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Card key={i} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${step.color}`} />
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 text-lg rounded-full shadow-lg">
                Ücretsiz Teklif Almaya Başla
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hizmet Verenler İçin */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Hizmet Vermek İstiyorum</h2>
          <p className="text-center text-gray-500 mb-12">Kendi işinizin patronu olun. ANANAS ile yeni müşteriler kazanın.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {providerSteps.map((step, i) => (
              <Card key={i} className="border border-gray-200 hover:border-indigo-200 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-10 py-4 text-lg rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                Hizmet Veren Olarak Kaydol
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            {[
              { q: "ANANAS'ı kullanmak ücretsiz mi?", a: "Hizmet almak tamamen ücretsizdir. Hizmet verenler yalnızca müşteriye teklif gönderirken kredi harcar." },
              { q: "Hizmet verenlerin güvenilirliğini nasıl anlayabilirim?", a: "Her hizmet verenin profil sayfasında geçmiş müşterilerden gelen puanlar ve yorumlar bulunur. Ayrıca 'Onaylı Profil' rozeti taşıyan ustalar ANANAS tarafından doğrulanmıştır." },
              { q: "Hangi şehirlerde hizmet veriliyor?", a: "ANANAS şu anda Türkiye genelinde hizmet vermektedir. Her il ve ilçede faaliyet gösteren profesyoneller platforma katılabilir." },
              { q: "Ödeme nasıl yapılır?", a: "Ödeme doğrudan müşteri ile hizmet veren arasında gerçekleşir. ANANAS aracılık ücreti almaz, yalnızca kredi sistemi üzerinden gelir elde eder." },
            ].map((faq, i) => (
              <div key={i} className="border rounded-xl p-6 hover:border-indigo-200 transition-colors">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
