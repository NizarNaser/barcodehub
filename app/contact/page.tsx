'use client';

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        'service_aaf0uep',        // <-- استبدل بـ Service ID من EmailJS
        'template_j2p4tdj',    // <-- استبدل بـ Template ID من EmailJS
        formRef.current!,
        'YKBJv8TqbDo7iEUwr'     // <-- استبدل بـ Public Key من EmailJS
      );

      alert("✅ تم إرسال رسالتك بنجاح");
      formRef.current?.reset();
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">تواصل معنا</h1>
      <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="الاسم"
          required
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          required
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
        />
        <textarea
          name="message"
          rows={4}
          placeholder="رسالتك"
          required
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
        ></textarea>

        <input type="hidden" name="time" value={new Date().toLocaleString("ar-EG")} />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </form>
    </main>
  );
}
