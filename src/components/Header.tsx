import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import UserMenu from "./UserMenu"
import MobileMenu from "./MobileMenu"

export default async function Header() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              ANANAS
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/nasil-calisir" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Nasıl Çalışır?
            </Link>
            {!user && (
              <Link href="/auth/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Hizmet Veren Ol
              </Link>
            )}
            {user?.role === "CUSTOMER" && (
              <Link href="/musteri/taleplerim" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Taleplerim
              </Link>
            )}
            {user?.role === "PROVIDER" && (
              <Link href="/hizmet-veren/firsatlar" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Fırsatlar
              </Link>
            )}
          </nav>

          {/* Sağ Taraf */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu user={{ name: user.name, email: user.email, role: user.role }} />
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-colors shadow-sm">
                  Kayıt Ol
                </Link>
              </div>
            )}
            {/* Mobil Menü */}
            <MobileMenu user={user ? { name: user.name, role: user.role } : null} />
          </div>
        </div>
      </div>
    </header>
  )
}
