import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import Logo from "../components/Logo";
import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DEMO_ACCOUNTS } from "../lib/constants";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const { push } = useToast();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) { push(error, "error"); return; }
    push("مرحباً بك 👋", "success");
    nav("/dashboard");
  };
  const quick = (e: string) => { setEmail(e); setPassword("demo1234"); };
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground intensity="normal" grid gold />
      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex justify-center mb-6"><Logo size="lg" /></div>
          <h1 className="text-2xl font-extrabold text-center">تسجيل الدخول</h1>
          <p className="text-sm text-center text-gray-500 mt-1">مرحباً بك في نوفرها</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="you@example.com"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="••••••••"/>
              </div>
            </div>
            <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"><LogIn size={18}/> {loading ? "جاري الدخول..." : "دخول"}</button>
          </form>
          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center mb-3">— أو جرّب بحساب تجريبي —</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(a => (
                <button key={a.role} onClick={()=>quick(a.email)} type="button" className={`${a.color} text-white text-sm font-semibold rounded-xl py-2.5 hover:opacity-90 transition`}>{a.icon} {a.label}</button>
              ))}
            </div>
          </div>
          <p className="text-sm text-center mt-6 text-gray-600">ما عندك حساب؟ <Link to="/register" className="text-green-700 font-semibold">أنشئ حسابك</Link></p>
        </div>
      </div>
    </div>
  );
}