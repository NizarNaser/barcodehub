"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ عرفنا الواجهة المناسبة للمستخدم
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  async function handleDelete(userId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(users.filter((u) => u._id !== userId));
    } else {
      alert("حدث خطأ أثناء الحذف");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-right">جميع المستخدمين</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-right">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">البريد الإلكتروني</th>
              <th className="p-2 border">الصلاحيات</th>
              <th className="p-2 border">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  لا يوجد مستخدمين حاليًا
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
