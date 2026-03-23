"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage } from "@/app/actions/chat"
import { useRouter } from "next/navigation"

type MessageType = {
  id: string
  content: string
  senderId: string
  senderName: string
  createdAt: string
}

export default function ChatClient({ 
  threadId, 
  currentUserId, 
  initialMessages 
}: { 
  threadId: string
  currentUserId: string
  initialMessages: MessageType[] 
}) {
  const router = useRouter()
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sona kaydırma efekti
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Çok basit MVP Polling mekanizması (canlı chat hissiyatı için)
  // Normalde Pusher/WebSocket veya SWR kullanılır
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    
    // Optimizstic Update (Kullanıcı beklememesi için hemen ekranda gösteriyoruz)
    const optimisticMsg: MessageType = {
      id: "temp-" + Date.now(),
      content: content.trim(),
      senderId: currentUserId,
      senderName: "Siz",
      createdAt: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, optimisticMsg])
    const oldContent = content
    setContent("")

    const res = await sendMessage(threadId, oldContent.trim())
    setLoading(false)

    if (res?.error) {
      alert(res.error)
      // Mesajı geri alabiliriz
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 rounded-lg border">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-sm">
            Mesajlaşma geçmişi boş.
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="text-xs text-gray-400 mb-1">{isMe ? "Siz" : msg.senderName}</div>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white border rounded-tl-none text-gray-800'}`}>
                  {msg.content}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="pt-4">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <Textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            placeholder="Mesajınızı yazın... (Enter ile gönder)"
            className="resize-none h-[60px] pb-4 rounded-full pl-6 pr-24"
          />
          <Button 
            type="submit" 
            disabled={loading || !content.trim()} 
            className="absolute right-2 top-2 bottom-2 h-auto rounded-full px-6"
          >
            Gönder
          </Button>
        </form>
      </div>
    </div>
  )
}
