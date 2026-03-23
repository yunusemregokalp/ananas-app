"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const packages = [
  { id: 1, credits: 50, price: 49.90, popular: false, label: "Başlangıç" },
  { id: 2, credits: 150, price: 119.90, popular: true, label: "Popüler" },
  { id: 3, credits: 350, price: 249.90, popular: false, label: "Profesyonel" },
  { id: 4, credits: 1000, price: 599.90, popular: false, label: "Kurumsal" },
]

export default function CreditPackages({ balance }: { balance: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePurchase = () => {
    // Gerçek ödeme entegrasyonu burada olacak (iyzico, stripe vb.)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div>
      {/* Mevcut Bakiye */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm">Mevcut Kredi Bakiyeniz</p>
            <p className="text-4xl font-bold mt-1">{balance} 💎</p>
          </div>
          <div className="text-right text-indigo-100 text-sm">
            <p>Her teklif göndermeniz <strong className="text-white">10 kredi</strong> harcar.</p>
            <p className="mt-1">Daha fazla teklif verin, daha fazla kazanın!</p>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-medium">
          ✅ Ödeme sistemi yakında aktif olacak! Şimdilik admin ile iletişime geçin.
        </div>
      )}

      {/* Paketler */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map(pkg => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all hover:shadow-lg relative ${
              selected === pkg.id ? "border-indigo-500 ring-2 ring-indigo-200" : "hover:border-indigo-200"
            } ${pkg.popular ? "border-indigo-300" : ""}`}
            onClick={() => setSelected(pkg.id)}
          >
            {pkg.popular && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-xs px-3">
                En Popüler
              </Badge>
            )}
            <CardHeader className="text-center pb-2 pt-6">
              <CardTitle className="text-sm text-gray-500 font-medium">{pkg.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">{pkg.credits}</div>
              <div className="text-sm text-gray-500 mb-4">kredi</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">{pkg.price.toFixed(2)} ₺</div>
              <div className="text-xs text-gray-400">
                ({(pkg.price / pkg.credits).toFixed(2)} ₺ / kredi)
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          disabled={!selected}
          onClick={handlePurchase}
          className="px-12 py-4 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg disabled:opacity-50"
        >
          {selected ? `${packages.find(p => p.id === selected)?.credits} Kredi Satın Al` : "Paket Seçin"}
        </Button>
        <p className="text-xs text-gray-400 mt-4">
          Ödeme altyapısı yakında aktif olacaktır. Şimdilik destek@ananas.com.tr adresine yazarak kredi talep edebilirsiniz.
        </p>
      </div>
    </div>
  )
}
