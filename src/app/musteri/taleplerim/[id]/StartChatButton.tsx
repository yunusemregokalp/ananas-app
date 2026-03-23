"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { startOrGetThread } from "@/app/actions/chat"
import { useRouter } from "next/navigation"

export default function StartChatButton({ quoteId }: { quoteId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartChat = async () => {
    setLoading(true)
    const res = await startOrGetThread(quoteId)
    setLoading(false)

    if (res?.error) {
      alert(res.error)
    } else if (res?.threadId) {
      router.push(`/mesajlar/${res.threadId}`)
    }
  }

  return (
    <Button variant="outline" onClick={handleStartChat} disabled={loading}>
      {loading ? "Bağlanıyor..." : "Mesaj At"}
    </Button>
  )
}
