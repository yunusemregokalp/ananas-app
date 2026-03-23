import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function BildirimlerPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30
  })

  // Okunmamışları okundu yap
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  })

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Bildirimler</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-lg text-muted-foreground">Henüz bildiriminiz bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.id} className={`transition-colors ${!n.isRead ? "border-indigo-200 bg-indigo-50/30" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm flex-shrink-0 mt-0.5">
                    🔔
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      {!n.isRead && <Badge className="bg-indigo-600 text-xs">Yeni</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
