"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitQuote } from "@/app/actions/quote"
import { useRouter } from "next/navigation"

export default function QuoteFormClient({ requestId, balance }: { requestId: string; balance: number }) {
  const router = useRouter()
  const [priceAmount, setPriceAmount] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const CREDIT_COST = 10
  const hasEnoughCredits = balance >= CREDIT_COST

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await submitQuote({
      requestId,
      priceAmount: Number(priceAmount),
      coverLetter
    })

    setLoading(false)

    if (res?.error) {
      setError(res.error)
      return
    }

    if (res?.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-10 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Teklifiniz İletildi!</h3>
          <p className="text-green-700 mb-6">Müşteriye bildirim gönderildi. Teklifiniz kabul edilirse mesajlaşma başlar.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/hizmet-veren/firsatlar")} className="bg-green-600 hover:bg-green-700">
              Diğer Fırsatlara Bak
            </Button>
            <Button onClick={() => router.push("/hizmet-veren/tekliflerim")} variant="outline">
              Tekliflerime Git
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={!hasEnoughCredits ? "border-red-200 bg-red-50/30" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📩 Teklif Ver
        </CardTitle>
        <CardDescription>
          Müşteriye fiyat teklifinizi iletin. Bu işlem <strong>{CREDIT_COST} kredi</strong> harcayacaktır.
        </CardDescription>
      </CardHeader>

      {!hasEnoughCredits && (
        <CardContent className="pt-0">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ Yetersiz kredi! Mevcut bakiyeniz: <strong>{balance}</strong> kredi.
            Teklif vermek için en az {CREDIT_COST} kredi gereklidir.
            <Button onClick={() => router.push("/hizmet-veren/kredi")} variant="outline" size="sm" className="mt-2 text-red-600 border-red-300">
              Kredi Yükle →
            </Button>
          </div>
        </CardContent>
      )}

      {error && (
        <CardContent className="pt-0">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        </CardContent>
      )}

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Toplam Fiyat Teklifiniz (₺) <span className="text-red-500">*</span></Label>
            <Input
              type="number" required min={1}
              value={priceAmount} onChange={e => setPriceAmount(e.target.value)}
              placeholder="Örn: 1500" className="h-11 text-lg font-semibold"
              disabled={!hasEnoughCredits}
            />
          </div>
          <div className="space-y-2">
            <Label>Müşteriye Mesajınız <span className="text-red-500">*</span></Label>
            <Textarea
              required
              placeholder="Neden sizi seçmeliler? Deneyiminizden, yaklaşımınızdan ve tahmini sürenizden bahsedin..."
              className="resize-none h-36"
              value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
              disabled={!hasEnoughCredits}
            />
            <p className="text-xs text-gray-400">İyi yazılmış mesajlar %60 daha fazla kabul ediliyor.</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button disabled={loading || !hasEnoughCredits} type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold">
            {loading ? "Teklif Gönderiliyor..." : `Teklifi Gönder (${CREDIT_COST} Kredi)`}
          </Button>
          <p className="text-xs text-center text-gray-400">
            Mevcut bakiyeniz: <span className="font-semibold">{balance} 💎</span> · Teklif sonrası: <span className="font-semibold">{balance - CREDIT_COST} 💎</span>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
