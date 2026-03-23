import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import CreditPackages from "./CreditPackages"

export default async function KrediPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "PROVIDER") {
    return redirect("/auth/login")
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  })

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kredi Yükle</h1>
        <Link href="/hizmet-veren/panel" className="text-sm text-indigo-600 hover:underline">← Panele Dön</Link>
      </div>

      <CreditPackages balance={wallet?.balance || 0} />

      {/* İşlem Geçmişi */}
      {wallet?.transactions && wallet.transactions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Son İşlemler</h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Tarih</th>
                  <th className="text-left px-4 py-3 font-medium">Açıklama</th>
                  <th className="text-right px-4 py-3 font-medium">Miktar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {wallet.transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">{tx.reason}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${tx.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "CREDIT" ? "+" : "-"}{tx.amount} 💎
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
