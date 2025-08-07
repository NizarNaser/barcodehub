import { Types } from "mongoose"; // استخدم من mongoose بدل mongodb

export interface ArticleType {
  _id: Types.ObjectId; // أفضل دعمًا للعمليات في Mongoose
  title: string;
  slug: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
  author?: string;
  rating?: number;
}
