"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await registerUser({ name, phone, password, role })

    if (res?.error) {
      setError(res.error)
      setLoading(false)
      return
    }

    // Kayıt başarılı → Otomatik giriş yap
    const login = await signIn("credentials", {
      redirect: false,
      phoneOrEmail: phone,
      password
    })

    setLoading(false)

    if (login?.ok) {
      window.location.href = role === "PROVIDER" ? "/hizmet-veren/firsatlar" : "/"
    } else {
      setError("Kayıt tamamlandı fakat otomatik giriş başarısız. Lütfen giriş yapın.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 pt-16 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Hesap Oluşturun</h1>
          <p className="text-gray-500 mt-2 text-sm">ANANAS'a katılın, fırsatları kaçırmayın.</p>
        </div>

        {/* Rol Seçimi */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`p-4 rounded-xl border-2 text-center transition-all ${role === "CUSTOMER" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <div className="text-2xl mb-1">🛒</div>
            <div className="font-semibold text-sm">Hizmet Alacağım</div>
            <div className="text-xs text-gray-400 mt-1">Müşteri Hesabı</div>
          </button>
          <button
            type="button"
            onClick={() => setRole("PROVIDER")}
            className={`p-4 rounded-xl border-2 text-center transition-all ${role === "PROVIDER" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <div className="text-2xl mb-1">🔧</div>
            <div className="font-semibold text-sm">Hizmet Vereceğim</div>
            <div className="text-xs text-gray-400 mt-1">Usta / Firma Hesabı</div>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Ad Soyad {role === "PROVIDER" ? "/ Firma İsmi" : ""}</Label>
            <Input
              required
              placeholder={role === "PROVIDER" ? "Örn: Mehmet Yapı Ltd. Şti." : "Örn: Ayşe Demir"}
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Telefon Numarası</Label>
            <Input
              required
              placeholder="05XXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Şifre (En az 6 karakter)</Label>
            <Input
              required
              type="password"
              placeholder="••••••••"
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold mt-2">
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol ve Devam Et"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/login" className="text-indigo-600 font-medium hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
