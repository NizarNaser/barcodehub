"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface Comment {
  _id: string;
  userName: string;
  userImage?: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // جلب التعليقات من API عند تحميل المكون
useEffect(() => {
  async function fetchComments() {
    const res = await fetch(`/api/comments?articleId=${articleId}`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  }
  fetchComments();
}, [articleId]);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-yellow-400">
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}


  async function handleAddComment() {
    if (!session) {
      alert("يرجى تسجيل الدخول أولاً لإضافة تعليق.");
      signIn("google");
      return;
    }
    if (!content.trim()) {
      alert("الرجاء كتابة تعليق.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId,
        content,
        rating,
        userId: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setRating(5);
    } else {
      alert("حدث خطأ أثناء إضافة التعليق.");
    }
    setLoading(false);
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">التعليقات والتقييمات</h2>

      {/* نموذج إضافة تعليق */}
      <div className="mb-6">
        <textarea
          rows={3}
          className="w-full p-2 border rounded mb-2"
          placeholder="اكتب تعليقك هنا..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>التقييم: </label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2 p-1 border rounded">
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button
          onClick={handleAddComment}
          disabled={loading}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إضافة تعليق
        </button>
      </div>

      {/* عرض التعليقات */}
      <div>
        {(!comments || comments.length === 0) && <p>لا توجد تعليقات بعد.</p>}

        {comments.map((comment) => (
          <div key={comment._id} className="border p-4 mb-4 rounded">
            <div className="flex items-center mb-2">
              {comment.userImage && (
                <img
                  src={comment.userImage}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <strong>{comment.userName}</strong>
              <StarRating rating={comment.rating} />

            </div>
            <p>{comment.content}</p>
            <small className="text-gray-500">{new Date(comment.createdAt).toLocaleString("ar")}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
