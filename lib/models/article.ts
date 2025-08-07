import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String }, // جديد: رابط صورة المقال
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
