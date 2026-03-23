import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              ANANAS
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/nasil-calisir" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
              Nasıl Çalışır?
            </Link>
            <Link href="/hizmet-veren-ol" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Hizmet Veren Ol
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 hidden sm:block">
              Giriş Yap
            </Link>
            <Link href="/auth/register" className="bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 px-6 py-2.5 rounded-full transition-colors">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
