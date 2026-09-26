import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
export default function Profile() {
  const { user } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState({ full_name: user?.full_name || "", phone: user?.phone || "" });
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الملف الشخصي</h1>
      <p className="text-gray-500 mt-1">بياناتك الشخصية</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-extrabold text-2xl">{(user?.full_name || "؟").charAt(0)}</div>
          <div>
            <p className="font-bold">{user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 mt-1">{user?.role === "customer" ? "عميل" : user?.role === "merchant" ? "تاجر" : user?.role === "driver" ? "سائق" : "مدير"}</span>
          </div>
        </div>
        <form onSubmit={(e)=>{e.preventDefault(); push("تم حفظ التعديلات", "success");}} className="mt-6 space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل</label><input value={form.full_name} onChange={e=>setForm({...form, full_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الجوال</label><input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="+249..."/></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label><input value={user?.email || ""} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm"/></div>
          <button className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700">حفظ التعديلات</button>
        </form>
      </div>
    </div>
  );
}