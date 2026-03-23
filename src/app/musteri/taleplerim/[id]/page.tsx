import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StartChatButton from "./StartChatButton"
import HireButton from "./HireButton"
import ReviewFormClient from "./ReviewFormClient"

export default async function CustomerRequestDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      review: true,
      answers: { include: { question: true } },
      quotes: {
        include: { provider: { include: { user: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!request || request.customerId !== session.user.id) return notFound()

  const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
    "OPEN": { label: "Açık - Teklif Bekleniyor", icon: "🟢", color: "bg-green-50 text-green-700 border-green-200" },
    "QUOTED": { label: "Teklif Aldı", icon: "📩", color: "bg-blue-50 text-blue-700 border-blue-200" },
    "HIRED": { label: "Anlaşıldı - İş Devam Ediyor", icon: "🤝", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    "COMPLETED": { label: "Tamamlandı", icon: "✅", color: "bg-green-50 text-green-700 border-green-200" },
    "CANCELLED": { label: "İptal Edildi", icon: "❌", color: "bg-red-50 text-red-700 border-red-200" },
  }
  const st = statusConfig[request.status] || { label: request.status, icon: "❓", color: "" }

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/musteri/taleplerim" className="text-sm text-indigo-600 hover:underline mb-2 block">← Tüm Taleplerim</Link>
          <h1 className="text-3xl font-bold">{request.category.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            📍 {request.city}, {request.district} · 📅 {new Date(request.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Badge variant="outline" className={`text-sm px-4 py-2 ${st.color}`}>
          {st.icon} {st.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sol: Talep Detayları */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-base">Talep Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              {request.urgency && (
                <div className="flex justify-between"><span className="text-gray-500">Aciliyet</span><span className="font-medium">{request.urgency}</span></div>
              )}
              {request.budget && (
                <div className="flex justify-between"><span className="text-gray-500">Bütçe</span><span className="font-medium">{request.budget}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Teklif Sayısı</span><span className="font-bold text-indigo-600">{request.quotes.length}</span></div>
            </CardContent>
          </Card>

          {request.description && (
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-base">Açıklamanız</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-gray-700">{request.description}</CardContent>
            </Card>
          )}

          {request.answers.length > 0 && (
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-base">Cevaplarınız</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {request.answers.map(ans => (
                  <div key={ans.id} className="text-sm">
                    <span className="text-gray-500 block">{ans.question.questionText}</span>
                    <span className="text-gray-900 font-medium">{ans.answer}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sağ: Teklifler */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-bold">
            {request.quotes.length > 0
              ? `${request.quotes.length} Teklif Geldi`
              : "Teklifler Bekleniyor..."
            }
          </h2>

          {request.quotes.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-lg text-muted-foreground">Hizmet verenler talebinizi inceliyor.</p>
              <p className="text-sm text-gray-400 mt-2">Teklifler geldiğinde bildirim alacaksınız.</p>
            </div>
          ) : (
            request.quotes.map(quote => {
              if ((request.status === "HIRED" || request.status === "COMPLETED") && quote.status === "REJECTED") return null

              return (
                <Card key={quote.id} className={`transition-all ${quote.status === "ACCEPTED" ? "border-green-300 bg-green-50/30 shadow-md" : "hover:border-indigo-200"}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {(quote.provider.companyName || quote.provider.user.name)?.[0]?.toUpperCase()}
                          </div>
                          <Link href={`/hizmet-veren/profil/${quote.provider.userId}`} className="hover:text-indigo-600 transition-colors hover:underline">
                            {quote.provider.companyName || quote.provider.user.name}
                          </Link>
                          {quote.provider.status === "APPROVED" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">✓ Onaylı</Badge>
                          )}
                          {quote.status === "ACCEPTED" && (
                            <Badge className="bg-green-600 text-xs">🤝 İş Verildi</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="ml-10 mt-1">
                          ⭐ {quote.provider.averageRating?.toFixed(1) || "0.0"} ({quote.provider.totalReviews} yorum)
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{quote.priceAmount.toLocaleString("tr-TR")} ₺</div>
                        <div className="text-xs text-gray-400">{quote.priceType.replace("_", " ")}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border italic">&ldquo;{quote.coverLetter}&rdquo;</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end gap-2">
                    <StartChatButton quoteId={quote.id} />
                    {(request.status === "OPEN" || request.status === "QUOTED") && (
                      <HireButton quoteId={quote.id} status={quote.status} />
                    )}
                  </CardFooter>
                </Card>
              )
            })
          )}

          {/* Değerlendirme */}
          {request.status === "HIRED" && <ReviewFormClient requestId={request.id} />}

          {request.status === "COMPLETED" && request.review && (
            <Card className="border-yellow-200 bg-yellow-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {"★".repeat(request.review.rating)}{"☆".repeat(5 - request.review.rating)}
                  <span className="text-lg ml-2">Değerlendirmeniz</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic">&ldquo;{request.review.comment}&rdquo;</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
