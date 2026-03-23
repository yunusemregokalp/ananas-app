"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { hireProvider } from "@/app/actions/job"
import { useRouter } from "next/navigation"

export default function HireButton({ quoteId, status }: { quoteId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleHire = async () => {
    if (!confirm("Bu teklifi kabul edip işi bu hizmet verene vermek istediğinize emin misiniz?\n\nNot: Diğer tüm teklifler otomatik reddedilecektir.")) return

    setLoading(true)
    const res = await hireProvider(quoteId)
    setLoading(false)

    if (res?.error) {
      alert(res.error)
    } else {
      router.refresh()
    }
  }

  // Sadece AÇIK ise (PENDING teklifse ve talep OPEN/QUOTED ise) göster
  if (status !== "PENDING") return null

  return (
    <Button onClick={handleHire} disabled={loading} variant="default">
      {loading ? "Onaylanıyor..." : "Anlaş / İşi Ver"}
    </Button>
  )
}
