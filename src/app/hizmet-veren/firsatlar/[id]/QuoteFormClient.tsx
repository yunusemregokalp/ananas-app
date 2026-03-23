"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitQuote } from "@/app/actions/quote"
import { useRouter } from "next/navigation"

export default function QuoteFormClient({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [priceAmount, setPriceAmount] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await submitQuote({
      requestId,
      priceAmount: Number(priceAmount),
      coverLetter
    })

    setLoading(false)

    if (res?.error) {
      alert(res.error)
      return
    }

    if (res?.success) {
      // Başarılı olursa sayfayı sunucu tarafında yeniden render et (Teklifiniz İletildi UI'ı gözükmesi için)
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teklif Ver</CardTitle>
        <CardDescription>
          Müşteriye fiyat teklifinizi ve mesajınızı iletin. (Bu işlem 10 kredi düşecektir)
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Toplam Fiyat Teklifiniz (₺)</Label>
            <Input 
              type="number" 
              required 
              min={1}
              value={priceAmount}
              onChange={e => setPriceAmount(e.target.value)}
              placeholder="Örn: 1500" 
            />
          </div>
          <div className="space-y-2">
            <Label>Müşteriye Mesajınız (Ön Yazı)</Label>
            <Textarea 
              required
              placeholder="Kendinizden bahsedin ve hizmetinizi açıklayın..."
              className="resize-none h-32"
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Teklif Gönderiliyor..." : "Teklifi Gönder (10 Kredi Harca)"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
