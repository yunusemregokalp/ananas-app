import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return redirect("/auth/login")
  }

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { requests: true, questions: true } }
    }
  })

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Hizmet kategorilerini ve dinamik sorularını yönetin ({categories.length} kategori)</p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="hover:border-indigo-200 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
                  {cat.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{cat._count.requests} talep</span>
                <span className="text-gray-600">{cat._count.questions} soru</span>
              </div>
              <div className="mt-3 pt-3 border-t">
                <Link href={`/kategori/${cat.slug}`} className="text-xs text-indigo-600 hover:underline">
                  Kategori Sayfası →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
