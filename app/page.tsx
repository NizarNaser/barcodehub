import BarcodeForm from "@/components/BarcodeForm";
import  Article  from "@/lib/models/article";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ArticleType } from "@/lib/types";
import { connectDB } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await connectDB();
  const params = await searchParams;
  const pageParam = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const page = Math.max(1, parseInt(pageParam || "1"));

  const limit = 6;
  const skip = (page - 1) * limit;

  const total = await Article.countDocuments();
  const totalPages = Math.ceil(total / limit);

  const articles = await Article.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<ArticleType[]>();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Barcode Section */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">توليد باركود</h2>
        <BarcodeForm />
      </section>

      {/* Articles */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">أحدث المقالات</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article._id.toString()}
              href={`/articles/${article.slug}`}
              className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {article.image && (
                <div className="relative w-full h-52">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    ✍️ {article.author || "غير معروف"} • 📅{" "}
                    {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: ar })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 flex-wrap gap-2 rtl space-x-reverse space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/?page=${i + 1}`}
              aria-current={page === i + 1 ? "page" : undefined}
              className={`px-4 py-2 rounded border ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

