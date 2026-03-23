import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  // Dashboard İstatistikleri (Sorguları paralel çalıştırarak hız kazanıyoruz)
  const [
    totalUsers,
    totalProviders,
    totalRequests,
    openRequests,
    completedRequests,
    totalQuotes,
    totalReviews
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "OPEN" } }),
    prisma.serviceRequest.count({ where: { status: "COMPLETED" } }),
    prisma.quote.count(),
    prisma.review.count()
  ])

  return (
    <div className="container py-10 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Kurucu Yönetim Paneli (KPI)</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Toplam Müşteri</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold text-gray-900">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Aktif Hizmet Veren</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold text-gray-900">{totalProviders}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tüm Talepler</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold text-gray-900">{totalRequests}</div>
             <p className="text-sm text-indigo-600 font-medium mt-1">{openRequests} tanesi hala AÇIK</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm bg-green-50/10">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-green-700 uppercase tracking-wider">Başarılı İşler</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold text-green-600">{completedRequests}</div>
             <p className="text-sm text-green-700 font-medium mt-1">{totalReviews} yorum yapıldı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card>
            <CardHeader className="border-b bg-gray-50/50">
               <CardTitle>Platform Hızlı Linkler</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-6">
               <Link href="/admin/kullanicilar" className="flex items-center gap-2 text-primary hover:underline group">
                  <span className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20">👥</span>
                  Müşterileri ve Hizmet Verenleri Yönet
               </Link>
               <Link href="/admin/talepler" className="flex items-center gap-2 text-primary hover:underline group">
                  <span className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20">📋</span>
                  Platformdaki İş Taleplerini İncele ( {totalRequests} )
               </Link>
               <Link href="/admin/kategoriler" className="flex items-center gap-2 text-primary hover:underline group">
                  <span className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20">⚙️</span>
                  Kategori ve Dinamik Form Sorularını Düzenle
               </Link>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="border-b bg-gray-50/50">
               <CardTitle>Finansal Özet (MVP Kredi Sistemi)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Toplam Verilen Teklif</div>
                    <div className="text-2xl font-bold">{totalQuotes} Teklif</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600">Teklif Başına Harcanan Kredi</div>
                    <div className="text-2xl font-bold font-mono">10 💎</div>
                  </div>
               </div>
               <p className="text-sm text-gray-500 italic">
                 Not: Şu anda tüm hizmet verenlere sistem tarafından varsayılan kredi verilmiştir. İlerleyen fazlarda "Cüzdan Bakiyesi Yükleme" entegrasyonu (Iyzico/Stripe) yapılabilir.
               </p>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
