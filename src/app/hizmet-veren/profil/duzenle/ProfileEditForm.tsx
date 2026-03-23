"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProviderProfile } from "@/app/actions/auth"

type Props = {
  profile: {
    companyName?: string | null
    bio?: string | null
    city?: string | null
  }
}

export default function ProfileEditForm({ profile }: Props) {
  const [companyName, setCompanyName] = useState(profile.companyName || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [city, setCity] = useState(profile.city || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    const res = await updateProviderProfile({ companyName, bio, city })

    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          ✅ Profiliniz başarıyla güncellendi!
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Firma / İşletme Adı</Label>
        <Input value={companyName} onChange={e => setCompanyName(e.target.value)}
          placeholder="Örn: Mehmet Yapı Ltd. Şti." className="h-11" />
      </div>

      <div className="space-y-1.5">
        <Label>Hakkımda / Firma Tanıtımı</Label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Kendinizi veya firmanızı tanıtın. Deneyiminizden ve uzmanlık alanlarınızdan bahsedin."
          className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm min-h-[120px] resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Hizmet Verdiğiniz Şehir</Label>
        <Input value={city} onChange={e => setCity(e.target.value)}
          placeholder="Örn: İstanbul" className="h-11" />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
        {loading ? "Kaydediliyor..." : "Profili Kaydet"}
      </Button>
    </form>
  )
}
