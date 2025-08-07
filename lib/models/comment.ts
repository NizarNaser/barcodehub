import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    user: {
      name: String,
      email: String,
      image: String,
      role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    rating: { type: Number, min: 1, max: 5 },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
