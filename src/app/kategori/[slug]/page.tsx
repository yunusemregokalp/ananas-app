import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import DynamicFormClient from "./DynamicFormClient"

export default async function CategoryPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const category = await prisma.serviceCategory.findUnique({
    where: { slug: params.slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: { orderBy: { order: "asc" } }
        }
      }
    }
  })

  if (!category) return notFound()

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          {category.name} Hizmeti Al
        </h1>
        <p className="text-gray-600">
          İhtiyacınıza en uygun profesyonellerden teklif almak için birkaç detayı bizimle paylaşın.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <DynamicFormClient categoryId={category.id} questions={category.questions} />
      </div>
    </div>
  )
}
