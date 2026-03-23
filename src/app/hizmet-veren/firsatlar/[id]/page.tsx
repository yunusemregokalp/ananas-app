import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import QuoteFormClient from "./QuoteFormClient"

export default async function OpportunityDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const [request, providerProfile, wallet] = await Promise.all([
    prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        customer: { select: { name: true } },
        answers: { include: { question: true } },
        _count: { select: { quotes: true } }
      }
    }),
    prisma.providerProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.wallet.findUnique({ where: { userId: session.user.id } })
  ])

  if (!request) return notFound()

  let hasQuoted = false
  if (providerProfile) {
    const existing = await prisma.quote.findFirst({
      where: { requestId: request.id, providerId: providerProfile.id }
    })
    hasQuoted = !!existing
  }

  const urgencyMap: Record<string, { label: string; color: string }> = {
    "ACİL": { label: "🔴 Acil", color: "text-red-600 bg-red-50" },
    "1 HAFTA İÇİNDE": { label: "🟡 1 Hafta", color: "text-yellow-700 bg-yellow-50" },
    "TARİH BELLİ DEĞİL": { label: "🟢 Esnek", color: "text-green-700 bg-green-50" },
  }

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Talep Detayları</h1>
        <Link href="/hizmet-veren/firsatlar" className="text-sm text-indigo-600 hover:underline">← Fırsatlara Dön</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Sol: Talep Detayları (3/5) */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{request.category.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {request.city}, {request.district} · 👤 {request.customer.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  {request.urgency && urgencyMap[request.urgency] && (
                    <Badge variant="outline" className={urgencyMap[request.urgency].color}>
                      {urgencyMap[request.urgency].label}
                    </Badge>
                  )}
                  <Badge variant="outline">{request._count.quotes} teklif</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Bütçe & Tarih */}
              <div className="grid grid-cols-2 gap-4">
                {request.budget && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Bütçe</p>
                    <p className="font-semibold">{request.budget}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Oluşturulma</p>
                  <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>

              {/* Açıklama */}
              {request.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Müşteri Notu</h3>
                  <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-100">{request.description}</p>
                </div>
              )}

              {/* Sorular & Cevaplar */}
              {request.answers.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Talep Detayları</h3>
                  <div className="space-y-2">
                    {request.answers.map(ans => (
                      <div key={ans.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="text-gray-600 font-medium">{ans.question.questionText}</span>
                        <span className="text-gray-900 text-right max-w-[60%]">{ans.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sağ: Teklif Formu (2/5) */}
        <div className="md:col-span-2">
          {hasQuoted ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-10 text-center text-green-800">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Teklifiniz İletildi</h3>
                <p className="text-sm mb-4">Bu talebe zaten teklif verdiniz. Müşteri teklifinizi inceliyor.</p>
                <Link href="/hizmet-veren/tekliflerim" className="text-indigo-600 text-sm font-medium hover:underline">
                  Tekliflerime Git →
                </Link>
              </CardContent>
            </Card>
          ) : (
            <QuoteFormClient requestId={request.id} balance={wallet?.balance || 0} />
          )}
        </div>
      </div>
    </div>
  )
}
