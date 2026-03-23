import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | ANANAS",
  description: "ANANAS platformu hakkında en çok sorulan soruların cevapları.",
}

const faqs = [
  {
    category: "Müşteriler İçin",
    questions: [
      { q: "ANANAS'ı kullanmak ücretli mi?", a: "Hayır! Müşteriler için hizmet tamamen ücretsizdir. Talep oluşturur, teklif alır ve beğendiğiniz ustayla anlaşırsınız." },
      { q: "Nasıl teklif alabilirim?", a: "Anasayfadan ihtiyacınız olan hizmet kategorisini seçin, birkaç soruyu cevaplayın ve talebinizi gönderin. Bölgenizdeki ustalar size özel fiyat teklifleri gönderecektir." },
      { q: "Gelen teklifleri reddetme hakkım var mı?", a: "Evet, gelen tüm teklifleri değerlendirme hakkınız vardır. Beğenmediğiniz teklifleri görmezden gelebilir veya reddedebilirsiniz." },
      { q: "Ustaların güvenilirliğini nasıl anlarım?", a: "Her hizmet verenin profil sayfasında ortalama puanı, müşteri yorumları ve onay durumu gösterilir. 'Onaylı Profil' badge'i olan hizmet verenler platform tarafından doğrulanmıştır." },
      { q: "İş bittikten sonra ne yapmalıyım?", a: "İşi tamamladıktan sonra hizmet vereni puanlayıp yorum yazabilirsiniz. Bu, diğer müşterilere yardımcı olur ve ustanın profilini güçlendirir." },
    ]
  },
  {
    category: "Hizmet Verenler İçin",
    questions: [
      { q: "Hizmet veren olarak nasıl kayıt olabilirim?", a: "Kayıt sayfasından 'Hizmet Veren' rolüyle ücretsiz hesap oluşturun. Profilinizi tamamladıktan sonra yönetici onayı ile aktif olursunuz." },
      { q: "Kredi sistemi nasıl çalışır?", a: "Her teklif göndermeniz 10 kredi harcar. Kayıt sırasında başlangıç kredisi verilir. Ek kredi ihtiyacınız olduğunda Kredi Yükle sayfasından paket satın alabilirsiniz." },
      { q: "Teklifim kabul edilirse ne olur?", a: "Müşteri teklifinizi kabul ettiğinde size bildirim gönderilir ve müşteriyle mesajlaşma kanalı açılır. İşin detaylarını konuşup başlayabilirsiniz." },
      { q: "Profilimi nasıl güçlendirebilirim?", a: "Firma bilgilerinizi eksiksiz doldurun, müşterilerinizden yüksek puan alın ve hızlı-detaylı teklif mesajları yazın. İyi profiller %60 daha fazla iş kazanıyor." },
    ]
  },
  {
    category: "Genel",
    questions: [
      { q: "ANANAS hangi şehirlerde hizmet veriyor?", a: "Şu anda Türkiye genelinde 20 büyükşehirde hizmet vermekteyiz. Yeni şehirler sürekli eklenmektedir." },
      { q: "Ödeme nasıl yapılır?", a: "Ödeme doğrudan müşteri ile hizmet veren arasında gerçekleşir. ANANAS sadece aracı platformdur ve ödeme almaz." },
      { q: "Sorun yaşarsam kime başvurabilirim?", a: "destek@ananas.com.tr adresine e-posta göndererek veya 0850 XXX XX XX numarası üzerinden hafta içi 09:00-18:00 arası bize ulaşabilirsiniz." },
    ]
  }
]

export default function SSSPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-xl text-indigo-100">ANANAS hakkında merak ettiklerinizin cevapları burada.</p>
        </div>
      </section>

      <div className="container max-w-4xl py-12">
        {faqs.map((section, si) => (
          <div key={si} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {si === 0 ? "🛒" : si === 1 ? "🔧" : "ℹ️"} {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq, qi) => (
                <Card key={qi} className="hover:border-indigo-200 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
