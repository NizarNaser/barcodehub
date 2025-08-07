'use client';
import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "react-qr-code";

const barcodeTypes = [
  { label: "QR Code", value: "QR" },
  { label: "CODE128", value: "CODE128" },
  { label: "EAN13", value: "EAN13" },
  { label: "UPC", value: "UPC" },
  { label: "CODE39", value: "CODE39" },
  { label: "ITF", value: "ITF" },
  { label: "Pharmacode", value: "pharmacode" },
];

export default function BarcodeForm() {
  const [text, setText] = useState("https://example.com");
  const [type, setType] = useState("QR");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [logo, setLogo] = useState<File | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const qrRef = useRef<SVGSVGElement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  
    if (type !== "QR" && text) {
      try {
        // التحقق حسب نوع الباركود
        switch (type) {
          case "EAN13":
            if (!/^\d{12}$/.test(text)) {
              setError("EAN13 يجب أن يحتوي على 12 رقمًا فقط.");
              return;
            }
            break;
  
          case "UPC":
            if (!/^\d{11,12}$/.test(text)) {
              setError("UPC-A يجب أن يحتوي على 11 أو 12 رقمًا فقط.");
              return;
            }
            break;
  
          case "CODE128":
            if (text.length < 1) {
              setError("CODE128 يجب أن يحتوي على حرف واحد على الأقل.");
              return;
            }
            break;
  
          case "CODE39":
            if (!/^[A-Z0-9\-.$/+% ]+$/.test(text)) {
              setError("CODE39 يسمح بالحروف الكبيرة والأرقام وبعض الرموز: -.$/+% ");
              return;
            }
            break;
  
          case "ITF":
            if (!/^\d+$/.test(text) || text.length % 2 !== 0) {
              setError("ITF يجب أن يحتوي على أرقام فقط، وبعدد زوجي.");
              return;
            }
            break;
  
          case "MSI":
            if (!/^\d+$/.test(text)) {
              setError("MSI يسمح بالأرقام فقط.");
              return;
            }
            break;
  
          case "Pharmacode":
            if (!/^\d+$/.test(text) || parseInt(text) < 3 || parseInt(text) > 131070) {
              setError("Pharmacode يجب أن يكون رقمًا بين 3 و131070.");
              return;
            }
            break;
  
          default:
            setError("نوع الباركود غير مدعوم حاليًا.");
            return;
        }
  
        // توليد الباركود
        JsBarcode("#linear-barcode", text, {
          format: type,
          lineColor: color,
          width: 2,
          height: size,
          displayValue: true,
        });
  
      } catch (e) {
        console.error("خطأ في توليد الباركود:", e);
        setError("حدث خطأ أثناء توليد الباركود.");
      }
    }
  }, [text, type, color, size]);
  
  
  
  

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
    }
  };

  // دالة لتحميل الباركود كصورة
  const downloadBarcode = () => {
    if (type === "QR") {
        const svg = document.getElementById("linear-barcode") as unknown as SVGSVGElement;

      if (!svg) return alert("الرجاء توليد الكود أولاً");

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // إضافة اللوجو في وسط الصورة إذا موجود
        if (logo) {
          const logoImg = new Image();
          logoImg.onload = () => {
            const logoSize = canvas.width * 0.25;
            ctx?.drawImage(
              logoImg,
              (canvas.width - logoSize) / 2,
              (canvas.height - logoSize) / 2,
              logoSize,
              logoSize
            );
            URL.revokeObjectURL(url);
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qr-code.png";
            downloadLink.click();
          };
          logoImg.src = URL.createObjectURL(logo);
        } else {
          URL.revokeObjectURL(url);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = "qr-code.png";
          downloadLink.click();
        }
      };

      img.src = url;
    } else {
      // الباركود الخطي كـ SVG
      if (!svgRef.current) return alert("الرجاء توليد الكود أولاً");
      const svg = svgRef.current;

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "barcode.png";
        downloadLink.click();
      };

      img.src = url;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">توليد الباركود</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">نوع الباركود</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {barcodeTypes.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">النص / البيانات</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="أدخل النص أو الرابط هنا"
        />
        {error && (
  <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
)}

      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">لون الباركود</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 p-0 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">لون الخلفية</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 p-0 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">الحجم (px)</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          min={100}
          max={500}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {type === "QR" && (
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            رفع شعار (لوغو) للباركود
          </label>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full" />
        </div>
      )}

      <div className="flex justify-center mb-6">
        {type === "QR" ? (
          <div
            className="relative inline-block"
            style={{ backgroundColor: bgColor, padding: 10, borderRadius: 12 }}
          >
            <QRCode
              id="qr-code-svg"
              value={text}
              size={size}
              bgColor={bgColor}
              fgColor={color}
              level="H"
            />
            {logo && (
              <img
                src={URL.createObjectURL(logo)}
                alt="Logo"
                className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded"
              />
            )}
          </div>
        ) : (
          <svg
            id="linear-barcode"
            ref={svgRef}
            className="mx-auto"
            style={{ backgroundColor: bgColor }}
          />
        )}
      </div>

      <button
        onClick={downloadBarcode}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
      >
        تحميل الباركود
      </button>
    </div>
  );
}
