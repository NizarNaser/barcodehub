// app/layout.tsx
import "@/app/globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BarcodeHub",
  description: "مولد باركود ومدونة معرفية تقنية",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={cn("bg-white text-gray-900 dark:bg-gray-950 dark:text-white", inter.className)}>
        
         <SessionProviderWrapper >
          <Header />
        <main className="min-h-[80vh] px-4 md:px-8 py-6">{children}</main>
        </SessionProviderWrapper>
        <Footer />
      </body>
    </html>
  );
}
