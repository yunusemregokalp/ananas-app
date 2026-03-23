import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Marka */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white text-xl font-bold tracking-tight">ANANAS</span>
            </div>
            <p className="text-sm leading-relaxed">
              Türkiye'nin güvenilir hizmet pazaryeri. Doğru profesyoneli bulmak hiç bu kadar kolay olmamıştı.
            </p>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Popüler Hizmetler</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kategori/ev-temizligi" className="hover:text-white transition-colors">Ev Temizliği</Link></li>
              <li><Link href="/kategori/nakliyat" className="hover:text-white transition-colors">Nakliyat</Link></li>
              <li><Link href="/kategori/boya-badana" className="hover:text-white transition-colors">Boya Badana</Link></li>
              <li><Link href="/kategori/tadilat" className="hover:text-white transition-colors">Tadilat & Dekorasyon</Link></li>
            </ul>
          </div>

          {/* Şirket */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Hizmet Veren Ol</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 destek@ananas.com.tr</li>
              <li>📞 0850 XXX XX XX</li>
              <li className="pt-2">
                <span className="text-xs text-gray-500">Çalışma Saatleri</span><br/>
                Hafta içi 09:00 – 18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ANANAS. Tüm hakları saklıdır.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-white transition-colors">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
