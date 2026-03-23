"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

type Category = { id: string; name: string; slug: string }

export default function SearchBar({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (slug: string) => {
    setShowSuggestions(false)
    router.push(`/kategori/${slug}`)
  }

  const handleSearch = () => {
    if (filtered.length > 0) {
      handleSelect(filtered[0].slug)
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="bg-white rounded-full flex items-center p-2 shadow-2xl">
        <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
        <input
          type="text"
          placeholder="Hangi hizmete ihtiyacın var? Örn: Ev Temizliği"
          className="w-full bg-transparent text-gray-900 px-4 py-3 focus:outline-none text-lg"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(e.target.value.length > 0) }}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button size="lg" onClick={handleSearch} className="rounded-full px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-md">
          Ara
        </Button>
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 py-2 max-h-64 overflow-y-auto">
          {filtered.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.slug)}
              className="w-full text-left px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
