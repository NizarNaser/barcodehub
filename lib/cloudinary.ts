import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "articles" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("حدث خطأ غير معروف أثناء رفع الصورة"));
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(imageUrl: string) {
  const publicId = imageUrl.split("/").pop()?.split(".")[0];
  return cloudinary.uploader.destroy(`articles/${publicId}`);
}
