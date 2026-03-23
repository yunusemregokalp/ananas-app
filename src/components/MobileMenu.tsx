"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"

type User = {
  name?: string | null
  role?: string
}

export default function MobileMenu({ user }: { user?: User | null }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Menü"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-1">
            <Link href="/nasil-calisir" onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
              Nasıl Çalışır?
            </Link>

            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <Link href="/musteri/taleplerim" onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                    📋 Taleplerim
                  </Link>
                )}
                {user.role === "PROVIDER" && (
                  <>
                    <Link href="/hizmet-veren/panel" onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                      📊 Panelim
                    </Link>
                    <Link href="/hizmet-veren/firsatlar" onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                      ⚡ Fırsatlar
                    </Link>
                  </>
                )}
                {(user.role === "SUPER_ADMIN" || user.role === "ADMIN") && (
                  <Link href="/admin" onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                    ⚙️ Yönetim Paneli
                  </Link>
                )}
                <Link href="/mesajlar" onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                  💬 Mesajlarım
                </Link>
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }) }}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    🚪 Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/register" onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition-colors">
                  Hizmet Veren Ol
                </Link>
                <div className="border-t pt-2 mt-2 flex flex-col gap-2">
                  <Link href="/auth/login" onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-center border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Giriş Yap
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-center bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                    Kayıt Ol
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
