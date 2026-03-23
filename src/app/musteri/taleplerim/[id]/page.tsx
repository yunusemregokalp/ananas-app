import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import StartChatButton from "./StartChatButton"

export default async function CustomerRequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/auth/login")

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      category: true,
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
        <Badge variant={request.status === "OPEN" ? "default" : "secondary"} className="text-sm px-4 py-1">
          {request.status === "OPEN" ? "AÇIK (TEKLİF BEKLİYOR)" : request.status}
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

        {/* Sağ Sütun: Teklifler */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Gelen Teklifler ({request.quotes.length})</h2>
          
          {request.quotes.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-lg text-muted-foreground font-medium">Henüz hizmet verenlerden teklif gelmedi.</p>
              <p className="text-sm text-gray-500 mt-2">Teklifler geldiğinde e-posta / SMS ile bilgilendirileceksiniz.</p>
            </div>
          ) : (
            request.quotes.map(quote => (
              <Card key={quote.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                       {quote.provider.companyName || quote.provider.user.name}
                       {quote.provider.status === "APPROVED" && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">Onaylı Profil</Badge>
                       )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                       ⭐ {quote.provider.averageRating.toFixed(1)} Puan ( {quote.provider.totalReviews} Yorum )
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{quote.priceAmount.toLocaleString("tr-TR")} ₺</div>
                    <div className="text-xs text-muted-foreground uppercase">{quote.priceType.replace("_", " ")}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-md border text-sm italic">
                    "{quote.coverLetter}"
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t pt-4 flex justify-end gap-3">
                  <StartChatButton quoteId={quote.id} />
                  <Button variant="default">Anlaş / İşi Ver</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
