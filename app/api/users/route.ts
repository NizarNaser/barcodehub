import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user"; // تأكد من وجود هذا النموذج

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب المستخدمين" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "فشل في إنشاء المستخدم" }, { status: 500 });
  }
}