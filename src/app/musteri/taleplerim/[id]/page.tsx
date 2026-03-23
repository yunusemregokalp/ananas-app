import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import StartChatButton from "./StartChatButton"
import HireButton from "./HireButton"
import ReviewFormClient from "./ReviewFormClient"

export default async function CustomerRequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      review: true,
      answers: { include: { question: true } },
      quotes: { 
        include: { 
          provider: { include: { user: true } }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  // Başkasının talebini görmesini engelle
  if (!request || request.customerId !== session.user.id) return notFound()

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Talep Özeti</h1>
          <p className="text-muted-foreground mt-1">Gelen teklifleri ve talep detaylarını bu sayfadan inceleyebilirsiniz.</p>
        </div>
        <Badge 
          variant={
            request.status === "OPEN" || request.status === "QUOTED" ? "default" :
            request.status === "HIRED" ? "secondary" : "outline"
          } 
          className="text-sm px-4 py-1"
        >
          {request.status === "OPEN" || request.status === "QUOTED" ? "AÇIK (TEKLİF BEKLİYOR)" : 
           request.status === "HIRED" ? "ANLAŞILDI (İŞ SÜRÜYOR)" : 
           request.status === "COMPLETED" ? "TAMAMLANDI" : request.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sol Sütun: Talep Detayları */}
        <div className="space-y-6 col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{request.category.name}</CardTitle>
              <CardDescription>
                Hizmet Yeri: {request.city}, {request.district} <br/>
                Tarih: {new Date(request.createdAt).toLocaleDateString("tr-TR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Cevaplarınız</h3>
              {request.answers.map(ans => (
                <div key={ans.id} className="text-sm">
                  <span className="font-medium text-gray-700 block">{ans.question.questionText}</span>
                  <span className="text-gray-900 block mt-1">{ans.answer}</span>
                </div>
              ))}
              {request.answers.length === 0 && (
                <p className="text-muted-foreground text-sm">Standart talep detayları onaylandı.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sütun: Teklifler ve Aksiyonlar */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            {request.status === "OPEN" || request.status === "QUOTED" ? "Gelen Teklifler" : "Anlaşılan Sağlayıcı"}
          </h2>
          
          {request.quotes.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-lg text-muted-foreground font-medium">Henüz hizmet verenlerden teklif gelmedi.</p>
              <p className="text-sm text-gray-500 mt-2">Teklifler geldiğinde e-posta / SMS ile bilgilendirileceksiniz.</p>
            </div>
          ) : (
            request.quotes.map(quote => {
              // Eğer iş verildiyse ve bu teklif REJECTED (reddedilmişse) o teklifi ekranda göstermeye gerek yok
              if ((request.status === "HIRED" || request.status === "COMPLETED") && quote.status === "REJECTED") {
                return null;
              }

              return (
                <Card key={quote.id} className={`transition-colors ${quote.status === "ACCEPTED" ? "border-green-500 bg-green-50/30 shadow-md" : "hover:border-primary/50"}`}>
                  <CardHeader className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                         <Link href={`/hizmet-veren/profil/${quote.provider.userId}`} className="hover:text-primary transition-colors hover:underline">
                           {quote.provider.companyName || quote.provider.user.name}
                         </Link>
                         {quote.provider.status === "APPROVED" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">Onaylı Profil</Badge>
                         )}
                         {quote.status === "ACCEPTED" && (
                            <Badge className="bg-green-600 ml-2">İş Verildi</Badge>
                         )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                         ⭐ {quote.provider.averageRating?.toFixed(1) || "0"} Puan ( {quote.provider.totalReviews || "0"} Yorum )
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{quote.priceAmount.toLocaleString("tr-TR")} ₺</div>
                      <div className="text-xs text-muted-foreground uppercase">{quote.priceType.replace("_", " ")}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 bg-gray-50/80 p-4 rounded-md border text-sm italic">
                      "{quote.coverLetter}"
                    </p>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t pt-4 flex justify-end gap-3">
                    <StartChatButton quoteId={quote.id} />
                    
                    {/* Anlaş Butonu (Sadece henüz iş birine verilmediyse çıkar) */}
                    {(request.status === "OPEN" || request.status === "QUOTED") && (
                      <HireButton quoteId={quote.id} status={quote.status} />
                    )}
                  </CardFooter>
                </Card>
              )
            })
          )}

          {/* İşi Değerlendir Panel */}
          {request.status === "HIRED" && (
            <ReviewFormClient requestId={request.id} />
          )}

          {/* Tamamlanmış İşin Yorumu */}
          {request.status === "COMPLETED" && request.review && (
             <Card className="mt-6 border-yellow-200 bg-yellow-50/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-yellow-600">
                    <span className="text-yellow-400">★</span> 
                    Değerlendirmeniz ({request.review.rating} / 5)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{request.review.comment}"</p>
                </CardContent>
             </Card>
          )}

        </div>
      </div>
    </div>
  )
}
