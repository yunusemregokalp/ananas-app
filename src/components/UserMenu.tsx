"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"

type User = {
  name?: string | null
  email?: string | null
  role?: string
}

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  const isProvider = user.role === "PROVIDER"
  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN"

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Butonu */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 group"
      >
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:ring-2 group-hover:ring-indigo-300 transition-all">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors max-w-[120px] truncate">
          {user.name?.split(" ")[0] || "Hesabım"}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menü */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Kullanıcı Bilgisi */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">
              {isAdmin ? "⚙️ Yönetici" : isProvider ? "🔧 Hizmet Veren" : "🛒 Müşteri"}
            </p>
          </div>

          {/* Rol Bazlı Menü Linkleri */}
          <nav className="py-1">
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <span>📊</span> Yönetim Paneli
              </Link>
            )}

            {isProvider && (
              <>
                <Link href="/hizmet-veren/panel" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>📊</span> Panelim
                </Link>
                <Link href="/hizmet-veren/firsatlar" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>⚡</span> Fırsatlarım
                </Link>
                <Link href="/hizmet-veren/kredi" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>💎</span> Kredi Yükle
                </Link>
                <Link href="/hizmet-veren/profil/duzenle" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>✏️</span> Profilimi Düzenle
                </Link>
              </>
            )}

            {!isProvider && !isAdmin && (
              <>
                <Link href="/musteri/taleplerim" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>📋</span> Taleplerim
                </Link>
                <Link href="/musteri/profil" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  <span>👤</span> Profilim
                </Link>
              </>
            )}

            {/* Ortak Linkler */}
            <Link href="/mesajlar" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              <span>💬</span> Mesajlarım
            </Link>
            <Link href="/bildirimler" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              <span>🔔</span> Bildirimler
            </Link>
          </nav>

          {/* Çıkış */}
          <div className="border-t border-gray-100 pt-1 pb-1 mt-1">
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }) }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <span>🚪</span> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
