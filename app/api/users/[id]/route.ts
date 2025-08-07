import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";

// استخراج ID من URL
function getIdFromRequest(req: NextRequest): string {
  return req.nextUrl.pathname.split("/").pop() || "";
}

// DELETE /api/users/[id]
export async function DELETE(req: NextRequest) {
  await connectDB();
  const id = getIdFromRequest(req);

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "خطأ أثناء الحذف" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest) {
  await connectDB();
  const id = getIdFromRequest(req);

  try {
    const { name, email, role } = await req.json();

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء التحديث" }, { status: 500 });
  }
}

// GET /api/users/[id]
export async function GET(req: NextRequest) {
  await connectDB();
  const id = getIdFromRequest(req);

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الجلب" }, { status: 500 });
  }
}
