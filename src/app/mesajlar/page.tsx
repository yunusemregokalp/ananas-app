import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function InboxPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { id: session.user.id } } },
    include: {
      participants: true,
      quote: {
        include: { request: { include: { category: true } } }
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: { where: { isRead: false, senderId: { not: session.user.id } } }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const totalUnread = threads.reduce((sum, t) => sum + t._count.messages, 0)

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mesajlarım</h1>
          {totalUnread > 0 && (
            <p className="text-sm text-indigo-600 font-medium mt-1">{totalUnread} okunmamış mesaj</p>
          )}
        </div>
      </div>

      {threads.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-lg text-muted-foreground mb-2">Henüz mesajınız yok.</p>
          <p className="text-sm text-gray-400">Bir teklif kabul edildiğinde burada mesajlaşma başlayacak.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map(thread => {
            const otherUser = thread.participants.find(p => p.id !== session.user.id)
            const lastMsg = thread.messages[0]
            const unread = thread._count.messages
            const isUnread = unread > 0

            return (
              <Link key={thread.id} href={`/mesajlar/${thread.id}`}>
                <Card className={`hover:border-indigo-200 transition-all cursor-pointer ${isUnread ? "border-indigo-300 bg-indigo-50/30" : ""}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isUnread ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                        {otherUser?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                          {unread}
                        </div>
                      )}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                          {otherUser?.name || "Kullanıcı"}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                          {lastMsg
                            ? (lastMsg.senderId === session.user.id ? "Siz: " : "") + lastMsg.content
                            : "Sohbeti başlatmak için tıklayın."
                          }
                        </p>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {thread.quote.request.category.name}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
