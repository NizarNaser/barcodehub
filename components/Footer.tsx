// components/Footer.tsx
export function Footer() {
    return (
      <footer className="border-t px-4 md:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} BarcodeHub. جميع الحقوق محفوظة.
      </footer>
    );
  }
  