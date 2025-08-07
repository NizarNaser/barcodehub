import { connectDB } from "@/lib/db";
import  Article  from "@/lib/models/article";
import { NextResponse ,NextRequest} from "next/server";

export async function GET() {
  await connectDB();
  const articles = await Article.find().sort({ createdAt: -1 }).limit(10);
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, image } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const newArticle = new Article({
      title,
      slug,
      content,
      image, // حفظ رابط الصورة
    });

    await newArticle.save();

    return NextResponse.json({ message: "تم حفظ المقال بنجاح" }, { status: 201 });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
