'use client';

import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
}

interface Article {
  _id: string;
  title: string;
}

interface Comment {
  _id: string;
  articleId: Article | string;
  user: User;
  rating?: number;
  content: string;
  createdAt: string;
}

export default function ManageComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchComments();
  }, []);

  async function deleteComment(id: string) {
    if (!confirm("هل تريد حذف هذا التعليق؟")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c._id !== id));
      alert("تم حذف التعليق بنجاح");
    } else {
      alert("فشل حذف التعليق");
    }
  }

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div>
      <h1>إدارة التعليقات والتقييمات</h1>
      {comments.length === 0 && <p>لا توجد تعليقات حالياً.</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} style={{ border: "1px solid #ddd", marginBottom: 12, padding: 10 }}>
            <p><b>المقال:</b> {typeof comment.articleId === "string" ? comment.articleId : comment.articleId?.title || "غير معروف"}</p>
            <p><b>المستخدم:</b> {comment.user.name} ({comment.user.email})</p>
            <p><b>التقييم:</b> {comment.rating ?? "لا يوجد تقييم"}</p>
            <p><b>التعليق:</b> {comment.content}</p>
            <p><small>تاريخ النشر: {new Date(comment.createdAt).toLocaleString()}</small></p>
            <button
              onClick={() => deleteComment(comment._id)}
              style={{ background: "red", color: "white", border: "none", padding: "6px 12px", cursor: "pointer" }}
            >
              حذف التعليق
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
