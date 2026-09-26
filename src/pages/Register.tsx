import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Lock } from "lucide-react";
import Logo from "../components/Logo";
import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { Role } from "../types";
export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "customer" as Role });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  const { push } = useToast();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await register(form.email, form.password, form.fullName, form.role);
    setLoading(false);
    if (error) { push(error, "error"); return; }
    push("تم إنشاء الحساب بنجاح", "success");
    nav("/dashboard");
  };
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground intensity="normal" grid gold />
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 relative">
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>
        <h1 className="text-2xl font-extrabold text-center">إنشاء حساب جديد</h1>
        <p className="text-sm text-center text-gray-500 mt-1">انضم إلى منصة نوفرها</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input required value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="الاسم الكامل"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="email" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="you@example.com"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="6 أحرف على الأقل"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">نوع الحساب</label>
            <div className="grid grid-cols-3 gap-2">
              {(["customer","merchant","driver"] as Role[]).map(r => (
                <button key={r} type="button" onClick={()=>setForm({...form, role: r})} className={`py-2.5 rounded-xl font-semibold text-sm border-2 transition ${form.role === r ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"}`}>{r === "customer" ? "👤 عميل" : r === "merchant" ? "🏪 تاجر" : "🛵 سائق"}</button>
              ))}
            </div>
          </div>
          <button disabled={loading} className="w-full bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50">{loading ? "..." : "إنشاء الحساب"}</button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600">عندك حساب؟ <Link to="/login" className="text-green-700 font-semibold">تسجيل دخول</Link></p>
      </div>
    </div>
  );
}