import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import ChatClient from "./ChatClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const thread = await prisma.messageThread.findUnique({
    where: { id: params.id },
    include: {
      participants: true,
      quote: {
        include: { request: { include: { category: true } } }
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true }
      }
    }
  })

  if (!thread) return notFound()
  const isParticipant = thread.participants.some(p => p.id === session.user.id)
  if (!isParticipant) return notFound()

  const otherUser = thread.participants.find(p => p.id !== session.user.id)

  return (
    <div className="container py-4 md:py-8 max-w-4xl h-[calc(100vh-80px)] flex flex-col">
       <div className="border-b pb-4 mb-4 flex justify-between items-center">
         <div className="flex items-center gap-4">
           <Link href="/mesajlar">
             <Button variant="ghost" size="icon" className="md:hidden">&larr;</Button>
           </Link>
           <div>
             <h1 className="text-2xl font-bold">{otherUser?.name || "Kullanıcı"}</h1>
             <p className="text-sm text-muted-foreground mt-1">İlgili Talep: {thread.quote.request.category.name}</p>
           </div>
         </div>
         <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
           Tutar: {thread.quote.priceAmount.toLocaleString("tr-TR")} ₺
         </div>
       </div>

       {/* İstemci Tarafı Sohbet Arayüzü */}
       <ChatClient 
         threadId={thread.id} 
         currentUserId={session.user.id} 
         initialMessages={thread.messages.map(m => ({
           id: m.id,
           content: m.content,
           senderId: m.senderId,
           senderName: m.sender.name || "İsimsiz",
           createdAt: m.createdAt.toISOString()
         }))} 
       />
    </div>
  )
}
