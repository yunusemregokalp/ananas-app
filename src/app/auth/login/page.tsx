"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [phoneOrEmail, setPhoneOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      phoneOrEmail,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Kullanıcı bulunamadı veya şifre hatalı")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hizmet almak veya hizmet vermek için ANANAS&apos;a katılın.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          <input
            type="text"
            autoComplete="email"
            required
            className="block w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            placeholder="E-posta veya Telefon Numarası"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
          />
          <input
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 pt-6 border-t mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline">
            Ücretsiz Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  )
}
