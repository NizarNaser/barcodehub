// app/admin/layout.tsx

import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar"; // افترض عندك كومبوننت للسايدبار
import AdminHeader from "@/components/admin/AdminHeader"; // وكومبوننت للرأس

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    // إذا المستخدم ليس أدمن أو غير مسجل دخول، يمكن عمل Redirect أو عرض رسالة
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-red-600 text-xl font-bold">
          ليس لديك صلاحيات للدخول إلى هذه الصفحة.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar /> {/* القائمة الجانبية للأدمن */}
      <div className="flex-1 flex flex-col">
        <AdminHeader /> {/* رأس الصفحة */}
        <main className="p-6 bg-white flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
