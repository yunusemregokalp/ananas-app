"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { completeJobAndReview } from "@/app/actions/job"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewFormClient({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    setLoading(true)
    const res = await completeJobAndReview({ requestId, rating, comment })
    setLoading(false)

    if (res?.error) {
      alert(res.error)
    } else {
      router.refresh()
    }
  }

  return (
    <Card className="mt-6 border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-2 text-primary">Hizmeti Değerlendirin</h3>
        <p className="text-sm text-gray-700 mb-6">Bu hizmetin başarıyla tamamlandığını düşünüyorsanız Puan vererek Profili destekleyebilirsiniz.</p>
        
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => setRating(star)}
              className={`text-4xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>

        <Textarea 
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Hizmet Veren hakkındaki düşünceleriniz ve süreç nasıldı? (Opsiyonel)"
          className="mb-4 resize-none h-24 bg-white"
        />

        <Button onClick={onSubmit} disabled={loading} size="lg" className="w-full md:w-auto">
          {loading ? "Kaydediliyor..." : "Puanı Onayla ve İşi Kapat"}
        </Button>
      </CardContent>
    </Card>
  )
}
