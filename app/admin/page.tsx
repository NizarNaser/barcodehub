"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    const res = await fetch("/api/articles");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function deleteArticle(id: string) {
    if (!confirm("هل أنت متأكد من حذف المقال؟")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } else {
      alert("حدث خطأ أثناء الحذف");
    }
  }

  if (loading) return <p>جاري تحميل المقالات...</p>;

  return (
    <div className="p-6 overflow-auto max-w-full">
      <h1 className="text-2xl font-bold mb-6">إدارة المقالات</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-300 p-3 text-right">الصورة</th>
            <th className="border border-gray-300 p-3 text-right">العنوان</th>
            <th className="border border-gray-300 p-3 text-right">تاريخ الإنشاء</th>
            <th className="border border-gray-300 p-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(({ _id, title, image, createdAt }) => (
            <tr key={_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-300 p-2 text-center">
                <Image
                  src={image}
                  alt={title}
                  className="w-16 h-12 object-cover rounded"
                />
              </td>
              <td className="border border-gray-300 p-2 text-right">{title}</td>
              <td className="border border-gray-300 p-2 text-right">
                {new Date(createdAt).toLocaleDateString("ar-EG")}
              </td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <a
                  href={`/admin/articles/edit/${_id}`}
                  className="text-blue-600 hover:underline"
                >
                  تعديل
                </a>
                <button
                  onClick={() => deleteArticle(_id)}
                  className="text-red-600 hover:underline"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
