"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { createServiceRequest } from "@/app/actions/request"

type Question = {
  id: string
  questionText: string
  questionType: string
  isRequired: boolean
  options: { id: string; label: string; value: string }[]
}

const CITIES = [
  "İstanbul", "Ankara", "İzmir", "Antalya", "Bursa", "Adana", "Konya",
  "Gaziantep", "Kocaeli", "Mersin", "Diyarbakır", "Kayseri", "Eskişehir",
  "Samsun", "Trabzon", "Denizli", "Malatya", "Sakarya", "Muğla", "Balıkesir"
]

export default function DynamicFormClient({ categoryId, categoryName, questions }: { categoryId: string, categoryName: string, questions: Question[] }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [description, setDescription] = useState("")
  const [urgency, setUrgency] = useState("")
  const [budget, setBudget] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Sorular, 2: Lokasyon & Detay

  const handleChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await createServiceRequest({
      categoryId,
      city,
      district,
      description,
      urgency,
      budget,
      answers,
    })

    setLoading(false)

    if (res?.error === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    if (res?.error) { alert(res.error); return }
    if (res?.success) { router.push("/musteri/taleplerim") }
  }

  // Soru sayısı > 0 ise 2 adımlı, yoksa tek adımlı
  const totalSteps = questions.length > 0 ? 2 : 1

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Adım Göstergesi */}
      {totalSteps === 2 && (
        <div className="flex items-center gap-3 mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
            1. Detaylar
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 2 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
            2. Lokasyon
          </div>
        </div>
      )}

      {/* ADIM 1: Kategori Soruları */}
      {(step === 1 || totalSteps === 1) && (
        <>
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label className="text-base font-medium">
                {q.questionText} {q.isRequired && <span className="text-red-500">*</span>}
              </Label>

              {q.questionType === "SELECT" && (
                <Select required={q.isRequired} onValueChange={(val) => handleChange(q.id, val || "")} value={answers[q.id]}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
                  <SelectContent>
                    {q.options.map(opt => (
                      <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {q.questionType === "TEXT" && (
                <Textarea required={q.isRequired} placeholder="Detayları yazın..."
                  value={answers[q.id] || ""} onChange={(e) => handleChange(q.id, e.target.value)}
                  className="resize-none h-24" />
              )}

              {q.questionType === "NUMBER" && (
                <Input type="number" required={q.isRequired} placeholder="Örn: 100"
                  value={answers[q.id] || ""} onChange={(e) => handleChange(q.id, e.target.value)} className="h-11" />
              )}
            </div>
          ))}

          {questions.length === 0 && (
            <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-700">
              📝 {categoryName} için talebinizi aşağıdan oluşturabilirsiniz.
            </div>
          )}
        </>
      )}

      {/* ADIM 2 veya Tek Sayfa: Lokasyon & Detay */}
      {(step === 2 || totalSteps === 1) && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900">📍 Lokasyon ve Detaylar</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>İl <span className="text-red-500">*</span></Label>
              <Select required onValueChange={(v) => setCity(v || "")} value={city}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Şehir seçin..." /></SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>İlçe <span className="text-red-500">*</span></Label>
              <Input placeholder="Örn: Kadıköy" required value={district} onChange={e => setDistrict(e.target.value)} className="h-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Aciliyet</Label>
              <Select onValueChange={(v) => setUrgency(v || "")} value={urgency}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACİL">🔴 Acil</SelectItem>
                  <SelectItem value="1 HAFTA İÇİNDE">🟡 1 Hafta İçinde</SelectItem>
                  <SelectItem value="TARİH BELLİ DEĞİL">🟢 Esnek / Belli Değil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tahmini Bütçe</Label>
              <Select onValueChange={(v) => setBudget(v || "")} value={budget}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500 ₺">0 - 500 ₺</SelectItem>
                  <SelectItem value="500-1000 ₺">500 - 1.000 ₺</SelectItem>
                  <SelectItem value="1000-2500 ₺">1.000 - 2.500 ₺</SelectItem>
                  <SelectItem value="2500-5000 ₺">2.500 - 5.000 ₺</SelectItem>
                  <SelectItem value="5000+ ₺">5.000+ ₺</SelectItem>
                  <SelectItem value="Fiyat Teklifi Bekliyorum">Fiyat Teklifi Bekliyorum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Ek Açıklama</Label>
            <Textarea placeholder="İşle ilgili eklemek istediğiniz detayları yazın..."
              value={description} onChange={e => setDescription(e.target.value)}
              className="resize-none h-24" />
          </div>
        </div>
      )}

      {/* Butonlar */}
      <div className="pt-4 flex gap-3">
        {step === 2 && totalSteps === 2 && (
          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-base">
            ← Geri
          </Button>
        )}
        {step === 1 && totalSteps === 2 ? (
          <Button type="button" onClick={() => setStep(2)} className="flex-1 h-12 text-base bg-indigo-600 hover:bg-indigo-700">
            Devam Et →
          </Button>
        ) : (
          <Button disabled={loading} type="submit" className="flex-1 h-12 text-base bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Gönderiliyor..." : "🚀 Talebi Gönder ve Ücretsiz Teklif Al"}
          </Button>
        )}
      </div>
    </form>
  )
}
