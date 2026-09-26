import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-6xl font-extrabold text-green-600">404</h1>
        <p className="text-xl font-bold mt-3">الصفحة غير موجودة</p>
        <p className="text-gray-500 mt-2">ربما الرابط غير صحيح</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold mt-6">الرجوع للرئيسية</Link>
      </div>
    </div>
  );
}