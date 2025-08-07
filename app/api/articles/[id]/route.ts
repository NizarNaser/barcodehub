import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Article from "@/lib/models/article";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";

// 🔍 استخراج ID من الرابط
function extractIdFromPath(url: string) {
  return url.split("/").pop();
}

// ✅ GET مقال
export async function GET(req: NextRequest) {
  const id = extractIdFromPath(req.nextUrl.pathname);
  await connectDB();

  try {
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (err) {
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 });
  }
}

// ✅ DELETE مقال
export async function DELETE(req: NextRequest) {
  const id = extractIdFromPath(req.nextUrl.pathname);
  await connectDB();

  try {
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    if (article.image) {
      await deleteImageFromCloudinary(article.image);
    }

    await Article.findByIdAndDelete(id);
    return NextResponse.json({ message: "تم حذف المقال بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}

// ✅ PUT تعديل مقال
export async function PUT(req: NextRequest) {
  const id = extractIdFromPath(req.nextUrl.pathname);
  await connectDB();

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    let imageUrl = existingArticle.image;

    if (imageFile && imageFile.size > 0) {
      if (existingArticle.image) {
        await deleteImageFromCloudinary(existingArticle.image);
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadRes = await uploadImageToCloudinary(buffer);

      imageUrl = uploadRes.secure_url;
    }

    existingArticle.title = title;
    existingArticle.content = content;
    existingArticle.image = imageUrl;

    await existingArticle.save();

    return NextResponse.json({ message: "تم تحديث المقال بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء التحديث:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التحديث" }, { status: 500 });
  }
}
