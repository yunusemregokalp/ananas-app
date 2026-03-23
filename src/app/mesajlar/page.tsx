import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InboxPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const threads = await prisma.messageThread.findMany({
    where: {
      participants: {
        some: { id: session.user.id }
      }
    },
    include: {
      participants: true,
      quote: {
        include: { request: { include: { category: true } } }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mesajlarım</h1>
      
      <div className="grid gap-4">
        {threads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
            Henüz hiçbir mesajınız bulunmuyor.
          </div>
        ) : (
          threads.map(thread => {
            const otherUser = thread.participants.find(p => p.id !== session.user.id)
            const lastMsg = thread.messages[0]
            
            return (
              <Link key={thread.id} href={`/mesajlar/${thread.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer group">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {otherUser?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        {otherUser?.name || "Kullanıcı"}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal bg-muted px-2 py-1 rounded">
                        İlgili Talep: {thread.quote.request.category.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 pb-4 pl-16">
                    <p className={`text-sm line-clamp-1 ${!lastMsg?.isRead && lastMsg?.senderId !== session.user.id ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {lastMsg ? lastMsg.content : "Sohbeti başlatmak için tıklayın."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
