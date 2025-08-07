// types/next-auth.d.ts أو next-auth.d.ts في جذر المشروع
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string;
      role: string;
    };
  }
}
