export default function Loading() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <p className="text-gray-500 text-lg">Yükleniyor...</p>
      </div>
    </div>
  )
}
