import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | ANANAS",
  description: "ANANAS platformu kullanım koşulları.",
}

export default function KullanimKosullariPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <p className="text-lg"><strong>Son güncelleme:</strong> Mart 2026</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Hizmet Tanımı</h2>
        <p>ANANAS, hizmet arayanlar ile hizmet verenleri buluşturan çevrimiçi bir pazaryeri platformudur. Platform, taraflar arasında aracılık yapmakta olup doğrudan hizmet sağlamamaktadır.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Üyelik ve Hesap</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Üyelik oluşturmak ücretsizdir.</li>
          <li>Hesap bilgilerinin doğruluğundan kullanıcı sorumludur.</li>
          <li>Hesap güvenliğini sağlamak kullanıcının sorumluluğundadır.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Hizmet Veren Yükümlülükleri</h2>
        <p>Hizmet verenler, verdikleri hizmetin kalitesinden ve zamanlamasından sorumludur. Platform onayı, hizmet kalitesini garanti etmez ancak güvenilirlik değerlendirmesine katkıda bulunur.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Kredi Sistemi</h2>
        <p>Hizmet verenler teklif göndermek için kredi kullanır. Kullanılmış krediler iade edilmez. Kredi paketleri ve fiyatları platform tarafından belirlenip güncellenebilir.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Sorumluluk Reddi</h2>
        <p>ANANAS, hizmet verenlerin iş kalitesinden, ödeme anlaşmazlıklarından veya taraflar arası uyuşmazlıklardan sorumlu tutulamaz.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">6. İletişim</h2>
        <p>Kullanım koşullarıyla ilgili sorularınız için: <strong>destek@ananas.com.tr</strong></p>
      </div>
    </div>
  )
}
