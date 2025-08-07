"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default  function NewArticlePage() {

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("## أهلاً بك في محرر المقالات");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "barcodehub_preset"); // عدّله حسب إعداداتك في Cloudinary

    const res = await fetch(`https://api.cloudinary.com/v1_1/duamf2exi/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.secure_url;
    } else {
      return null;
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!title || !slug || !content) {
      setError("جميع الحقول مطلوبة.");
      setLoading(false);
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      if (!uploadedUrl) {
        setError("فشل رفع الصورة.");
        setLoading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, image: imageUrl }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/");
    } else {
      setError("حدث خطأ أثناء حفظ المقال.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">✍️ إنشاء مقال جديد</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="عنوان المقال"
          className="w-full border border-gray-300 p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="رابط المقال (slug)"
          className="w-full border border-gray-300 p-2 rounded"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-2 rounded"
        />

        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded border border-gray-300"
            />
          </div>
        )}

        <div data-color-mode="light">
          <MDEditor value={content} onChange={(val) => setContent(val || "")} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "جاري الحفظ..." : "حفظ المقال"}
        </button>
      </div>
    </div>
  );
}
