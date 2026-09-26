import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ShoppingCart, Bell, LayoutDashboard, LogOut, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const rolePath = user ? `/${user.role}` : "/login";
  const doLogout = async () => { await logout(); nav("/"); };
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-semibold ${loc.pathname === "/" ? "text-green-700 bg-green-50" : "text-gray-700 hover:bg-gray-100"}`}>الرئيسية</Link>
            <Link to="/stores" className={`px-3 py-2 rounded-lg text-sm font-semibold ${loc.pathname === "/stores" ? "text-green-700 bg-green-50" : "text-gray-700 hover:bg-gray-100"}`}>المتاجر</Link>
            <Link to="/stores?type=restaurant" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100">المطاعم</Link>
          </nav>
        </div>
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input placeholder="ابحث..." className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" onKeyDown={e => e.key === "Enter" && nav(`/stores?q=${(e.target as HTMLInputElement).value}`)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && <>
            <Link to="/customer/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
              <ShoppingCart size={20} className="text-gray-700" />
              {count > 0 && <span className="absolute -top-1 -left-1 bg-green-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
            </Link>
            <Link to="/customer/notifications" className="p-2 rounded-lg hover:bg-gray-100 hidden md:block"><Bell size={20} className="text-gray-700" /></Link>
          </>}
          {user ? <div className="hidden md:flex items-center gap-2">
            <Link to={rolePath} className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"><LayoutDashboard size={16} /> لوحتي</Link>
            <button onClick={doLogout} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={16} /> خروج</button>
          </div> : <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100">دخول</Link>
            <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700">حساب جديد</Link>
          </div>}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && <div className="md:hidden border-t bg-white"><div className="p-4 space-y-2">
        <Link to="/" onClick={() => setOpen(false)} className="block py-2 font-semibold">الرئيسية</Link>
        <Link to="/stores" onClick={() => setOpen(false)} className="block py-2 font-semibold">المتاجر</Link>
        <Link to="/stores?type=restaurant" onClick={() => setOpen(false)} className="block py-2 font-semibold">المطاعم</Link>
        {user ? <>
          <Link to={rolePath} onClick={() => setOpen(false)} className="block py-2 font-semibold">لوحتي</Link>
          <Link to="/customer/cart" onClick={() => setOpen(false)} className="block py-2 font-semibold">السلة ({count})</Link>
          <button onClick={doLogout} className="block w-full text-right py-2 font-semibold text-red-600">خروج</button>
        </> : <>
          <Link to="/login" onClick={() => setOpen(false)} className="block py-2 font-semibold">دخول</Link>
          <Link to="/register" onClick={() => setOpen(false)} className="block py-2 font-semibold text-green-700">إنشاء حساب</Link>
        </>}
      </div></div>}
    </header>
  );
}