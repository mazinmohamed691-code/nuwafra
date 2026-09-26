import { Link } from "react-router-dom";
import Logo from "./Logo";
import { APP_NAME, APP_NAME_EN, SLOGAN } from "../lib/constants";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-4 inline-block mb-4"><Logo size="md" /></div>
          <p className="text-sm leading-relaxed max-w-md">{APP_NAME} ({APP_NAME_EN}) — {SLOGAN}. منصة رقمية تجمع العملاء والمتاجر والمطاعم والسائقين والإدارة.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">المنصة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-400">الرئيسية</Link></li>
            <li><Link to="/stores" className="hover:text-green-400">المتاجر</Link></li>
            <li><Link to="/stores?type=restaurant" className="hover:text-green-400">المطاعم</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">الحساب</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-green-400">تسجيل دخول</Link></li>
            <li><Link to="/register" className="hover:text-green-400">حساب جديد</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} {APP_NAME} — جميع الحقوق محفوظة</div>
    </footer>
  );
}