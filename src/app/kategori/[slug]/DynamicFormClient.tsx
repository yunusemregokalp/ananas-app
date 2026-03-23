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

export default function DynamicFormClient({ categoryId, questions }: { categoryId: string, questions: Question[] }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSelectChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await createServiceRequest({
      categoryId,
      city,
      district,
      answers,
    })

    setLoading(false)

    if (res?.error === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (res?.error) {
      alert(res.error)
      return
    }

    if (res?.success) {
      router.push("/musteri/taleplerim")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <Label className="text-base font-medium">
            {q.questionText} {q.isRequired && <span className="text-red-500">*</span>}
          </Label>
          
          {q.questionType === "SELECT" && (
            <Select 
              required={q.isRequired} 
              onValueChange={(val) => handleSelectChange(q.id, val || "")}
              value={answers[q.id]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz..." />
              </SelectTrigger>
              <SelectContent>
                {q.options.map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {q.questionType === "TEXT" && (
            <Textarea
              required={q.isRequired}
              placeholder="Detayları buraya yazabilirsiniz..."
              value={answers[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="resize-none h-24"
            />
          )}

          {q.questionType === "NUMBER" && (
            <Input
              type="number"
              required={q.isRequired}
              placeholder="Örn: 100"
              value={answers[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      {questions.length === 0 && (
        <div className="text-gray-500 py-4">Bu kategori için özel soru bulunmuyor. Talebinizi standart olarak oluşturabilirsiniz.</div>
      )}

      {/* Ekstra Lokasyon Soruları MVP Sabit */}
      <div className="space-y-3 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900">Lokasyon ve Kapsam</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>İl</Label>
            <Input 
              placeholder="Örn: İstanbul" 
              required 
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
          <div>
            <Label>İlçe</Label>
            <Input 
              placeholder="Örn: Kadıköy" 
              required 
              value={district}
              onChange={e => setDistrict(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button disabled={loading} type="submit" className="w-full text-lg h-12">
          {loading ? "Gönderiliyor..." : "Talebi Gönder ve Ücretsiz Teklif Al"}
        </Button>
      </div>
    </form>
  )
}
