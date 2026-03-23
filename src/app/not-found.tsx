import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="text-8xl font-extrabold text-indigo-600 mb-4">404</div>
        <div className="text-6xl mb-6">🍍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Sayfa Bulunamadı</h1>
        <p className="text-gray-500 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Anasayfaya dönerek devam edebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700">
              Anasayfaya Dön
            </Button>
          </Link>
          <Link href="/nasil-calisir">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Nasıl Çalışır?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
