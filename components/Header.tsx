"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react"; // ✅

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession(); // ✅

  const linkBaseClasses =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300";
  const activeLinkClasses = "text-blue-600 font-semibold dark:text-blue-400";

  const navLinks = (
    <>
      <Link
        href="/about"
        className={`${linkBaseClasses} ${pathname === "/about" ? activeLinkClasses : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        من نحن
      </Link>
      <Link
        href="/privacy-policy"
        className={`${linkBaseClasses} ${pathname === "/privacy-policy" ? activeLinkClasses : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        سياسة الخصوصية
      </Link>
      <Link
        href="/terms"
        className={`${linkBaseClasses} ${pathname === "/terms" ? activeLinkClasses : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        الشروط
      </Link>
      <Link
        href="/contact"
        className={`${linkBaseClasses} ${pathname === "/contact" ? activeLinkClasses : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        تواصل معنا
      </Link>

      {/* زر الدخول/الخروج */}
   {session ? (
  <div className="relative">
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition"
    >
      <img
        src={session.user?.image || "/default-avatar.png"}
        alt="الصورة الشخصية"
        className="w-9 h-9 rounded-full border border-gray-300"
      />
      <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-gray-200">
        {session.user?.name}
       
      </span>
    </button>
  

    {/* القائمة المنسدلة */}
    {menuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
        <button
          onClick={() => {
            signOut();
            setMenuOpen(false);
          }}
          className="w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          تسجيل الخروج
        </button>
      </div>
    )}
  </div>
) : (
  <Button
    variant="outline"
    onClick={() => {
      signIn("google");
      setMenuOpen(false);
    }}
    className="w-full md:w-auto text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors duration-300"
  >
    تسجيل الدخول
  </Button>
  
)}
{session?.user?.role === "admin" && (
  <Link
    href="/admin"
    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
  >
    لوحة التحكم
  </Link>
)}

    </>
  );

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 md:px-8 py-4 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300"
          onClick={() => setMenuOpen(false)}
        >
          BarcodeHub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <MinusIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden mt-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm rounded-b-md px-4 py-3 space-y-2">
          {navLinks}
        </nav>
      )}
    </header>
  );
}
