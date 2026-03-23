import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuoteFormClient from "./QuoteFormClient"

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      customer: { select: { name: true } },
      answers: { include: { question: true } }
    }
  })

  if (!request) return notFound()

  // Kullanıcının daha önce teklif verip vermediğini kontrol et
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id }
  })
  
  let hasQuoted = false
  if (providerProfile) {
    const existingQuote = await prisma.quote.findFirst({
      where: { requestId: request.id, providerId: providerProfile.id }
    })
    hasQuoted = !!existingQuote
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Talep Detayları</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{request.category.name}</CardTitle>
              <CardDescription>
                Müşteri: {request.customer.name} <br/>
                Lokasyon: {request.city}, {request.district}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Talep Özeti</h3>
              {request.answers.map(ans => (
                <div key={ans.id} className="grid grid-cols-3 gap-2 py-1 text-sm">
                  <span className="font-medium text-gray-600 col-span-1">{ans.question.questionText}</span>
                  <span className="col-span-2">{ans.answer}</span>
                </div>
              ))}
              {request.answers.length === 0 && (
                <p className="text-muted-foreground text-sm">Özel soru cevaplanmamış.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {hasQuoted ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-10 text-center text-green-800">
                <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Teklifiniz İletildi</h3>
                <p>Bu talebe zaten bir teklif verdiniz. Müşteri teklifinizi inceliyor.</p>
              </CardContent>
            </Card>
          ) : (
            <QuoteFormClient requestId={request.id} />
          )}
        </div>
      </div>
    </div>
  )
}
