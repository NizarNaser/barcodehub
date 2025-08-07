import { connectDB } from "@/lib/db";
import Comment from "@/lib/models/comment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("articleId");

 const comments = await Comment.find().populate("articleId", "title").sort({ createdAt: -1 });

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, rating, articleId } = await req.json();
  await connectDB();

  const newComment = await Comment.create({
    articleId,
    content,
    rating,
    user: {
      name: session.user?.name,
      email: session.user?.email,
      image: session.user?.image,
      role: session.user?.role || "user",
    },
  });

  return NextResponse.json(newComment, { status: 201 });
}
