export const metadata = {
  title: "من نحن | BarcodeHub",
  description: "تعرف على رسالتنا ورؤيتنا في موقع BarcodeHub.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">من نحن</h1>
      <p className="text-gray-700 leading-loose">
        نحن في <strong>BarcodeHub</strong> نهدف إلى تقديم أدوات ذكية وسهلة لتوليد الباركود وقراءة المقالات التقنية بطريقة سلسة. نعمل على تطوير خدمات تساعد المستخدم في الحصول على تجربة رقمية متقدمة.
      </p>
    </main>
  );
}
