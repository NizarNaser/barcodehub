"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// ✅ تحميل MDEditor ديناميكيًا (لأنه يستخدم window)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditArticleForm({ articleId }: { articleId: string }) {
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("حدث خطأ أثناء تحميل المقال:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [articleId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleContentChange(value: string | undefined) {
    setForm({ ...form, content: value || "" });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (newImage) {
      formData.append("image", newImage);
    }

    const res = await fetch(`/api/articles/${articleId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      alert("تم تحديث المقال بنجاح");
      router.push("/admin/");
    } else {
      alert("حدث خطأ أثناء التحديث");
    }
  }

  if (loading) return <p className="text-center py-8">جار تحميل بيانات المقال...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-right">تعديل المقال</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <label className="block text-right">
          العنوان:
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </label>

        <label className="block text-right">
          المحتوى:
          <div className="mt-2">
            <MDEditor value={form.content} onChange={handleContentChange} height={300} />
          </div>
        </label>

        {form.image && (
          <div className="text-center">
            <img src={form.image} alt="صورة المقال" className="w-48 mx-auto rounded mb-4" />
          </div>
        )}

        <label className="block text-right">
          صورة جديدة (اختياري):
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
