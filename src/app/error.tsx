"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Bir şeyler ters gitti</h1>
        <p className="text-gray-500 mb-6">
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya sayfayı yenileyin.
        </p>
        <button
          onClick={reset}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Tekrar Dene
        </button>
        <p className="text-xs text-gray-400 mt-4">{error.message}</p>
      </div>
    </div>
  )
}
