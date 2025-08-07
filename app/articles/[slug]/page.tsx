import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CommentSection from "@/components/CommentSection";
import { ArticleType } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function Page({ params }: PageProps) {
  // Access the slug directly from the params object.
  // No need for 'await' here.
  const { slug } = await params;

  await connectDB();

  // استخدام slug بعد استخلاصه
  const article = await Article.findOne({ slug: slug }).lean<ArticleType | null>();
  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto mt-8 py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{article.title}</h1>

      {article.image && (
        <div className="mb-6">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={450}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      <p className="text-sm text-gray-500 mb-6">
        ✍️ الكاتب: {article.author || "غير معروف"} • 📅{" "}
        {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: ar })}
      </p>

      <article className="prose prose-lg max-w-none prose-blue rtl text-right">
        <ReactMarkdown>{article.content || ""}</ReactMarkdown>
      </article>

      <CommentSection articleId={article._id.toString()} />
    </div>
  );
}
