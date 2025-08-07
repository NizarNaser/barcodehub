
"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 min-h-screen p-5 hidden md:block">
      <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
      <nav className="flex flex-col space-y-3">
        <Link href="/admin/" className="hover:bg-gray-700 rounded px-3 py-2">
          المقالات
        </Link>
        <Link href="/admin/articles/new" className="hover:bg-gray-700 rounded px-3 py-2">اضافة مقال</Link>
        <hr/>
        <Link href="/admin/users" className="hover:bg-gray-700 rounded px-3 py-2">
          المستخدمون
        </Link>
        <hr/>
                <Link href="/admin/comments" className="hover:bg-gray-700 rounded px-3 py-2">
          التعليقات
        </Link>
        {/* أضف روابط أخرى حسب الحاجة */}
      </nav>
    </aside>
  );
}
