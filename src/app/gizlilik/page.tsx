import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | ANANAS",
  description: "ANANAS gizlilik politikası ve kişisel veri koruma bilgileri.",
}

export default function GizlilikPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <p className="text-lg"><strong>Son güncelleme:</strong> Mart 2026</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Toplanan Veriler</h2>
        <p>ANANAS platformu, hizmet kalitesini artırmak amacıyla aşağıdaki kişisel verileri toplamaktadır:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ad, soyad, e-posta adresi ve telefon numarası</li>
          <li>Hizmet talep ve teklif bilgileri</li>
          <li>Mesajlaşma içerikleri</li>
          <li>Konum bilgileri (il/ilçe)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Verilerin Kullanım Amacı</h2>
        <p>Toplanan veriler yalnızca platformun işleyişini sağlamak, hizmet kalitesini iyileştirmek ve kullanıcı deneyimini geliştirmek amacıyla kullanılmaktadır.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Veri Güvenliği</h2>
        <p>Kişisel verileriniz endüstri standartlarına uygun şifreleme ve güvenlik önlemleriyle korunmaktadır. Verileriniz üçüncü taraflarla paylaşılmaz.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">4. KVKK Hakları</h2>
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verilerinize erişme, düzeltme ve silme hakkına sahipsiniz. Taleplerinizi destek@ananas.com.tr adresine iletebilirsiniz.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">5. İletişim</h2>
        <p>Gizlilik politikamızla ilgili sorularınız için: <strong>destek@ananas.com.tr</strong></p>
      </div>
    </div>
  )
}
