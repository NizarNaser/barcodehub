import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/lib/models/comment";

function extractIdFromPath(path: string) {
  return path.split("/").pop();
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromPath(req.nextUrl.pathname);
  await connectDB();

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ message: "تم حذف التعليق بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}
