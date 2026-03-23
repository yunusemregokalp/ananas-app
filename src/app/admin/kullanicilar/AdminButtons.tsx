"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { approveProvider, rejectProvider } from "@/app/actions/admin"

export function ApproveButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handle = async () => {
    setLoading(true)
    await approveProvider(userId)
    setDone(true)
    setLoading(false)
  }

  if (done) return <span className="text-green-600 text-xs font-medium">✅ Onaylandı</span>

  return (
    <Button size="sm" variant="default" disabled={loading} onClick={handle}
      className="text-xs h-7 bg-green-600 hover:bg-green-700">
      {loading ? "..." : "Onayla"}
    </Button>
  )
}

export function RejectButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handle = async () => {
    setLoading(true)
    await rejectProvider(userId)
    setDone(true)
    setLoading(false)
  }

  if (done) return <span className="text-red-600 text-xs font-medium">❌ Reddedildi</span>

  return (
    <Button size="sm" variant="outline" disabled={loading} onClick={handle}
      className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
      {loading ? "..." : "Reddet"}
    </Button>
  )
}
