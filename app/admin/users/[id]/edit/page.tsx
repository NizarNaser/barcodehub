"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
    const [form, setForm] = useState({ name: "", email: "", role: "user" });

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();
                setForm({ name: data.name, email: data.email, role: data.role || "user" });
            } catch (error) {
                console.error("فشل في جلب بيانات المستخدم:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId]);

  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) {
  setForm({ ...form, [e.target.name]: e.target.value });
}


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("تم تحديث المستخدم بنجاح");
            router.push("/admin/users");
        } else {
            alert("فشل في تحديث المستخدم");
        }
    }

    if (loading) return <p className="text-center py-8">جار تحميل بيانات المستخدم...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-right">تعديل المستخدم</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-right">
                    الاسم:
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mt-1"
                        required
                    />
                </label>
                <label className="block text-right">
                    البريد الإلكتروني:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mt-1"
                        required
                    />
                </label>
                <label className="block text-right">
                    الدور:
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mt-1"
                    >
                        <option value="user">مستخدم</option>
                        <option value="admin">مدير</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    حفظ التعديلات
                </button>
            </form>
        </div>
    );
}
