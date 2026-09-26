import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getMerchantStore } from "../../lib/db";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { SUDAN_STATES } from "../../lib/constants";
import type { Store } from "../../types";
export default function StoreInfo() {
  const { user } = useAuth();
  const [form, setForm] = useState<Store | null>(null);
  const { push } = useToast();
  useEffect(() => { if (!user) return; getMerchantStore(user.id).then(setForm); }, [user]);
  if (!form) return <div className="p-8 text-center text-gray-500">لا يوجد متجر</div>;
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured && supabase) {
      await supabase.from("stores").update({ name: form.name, description: form.description, type: form.type, phone: form.phone, state: form.state, city: form.city, delivery_fee: form.delivery_fee, min_order: form.min_order }).eq("id", form.id);
    }
    push("تم حفظ التعديلات", "success");
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">معلومات المتجر</h1>
      <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 space-y-4">
        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المتجر</label><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف</label><textarea value={form.description||""} onChange={e=>setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">النوع</label><select value={form.type} onChange={e=>setForm({...form, type: e.target.value as "store"|"restaurant"})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"><option value="store">متجر</option><option value="restaurant">مطعم</option></select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف</label><input value={form.phone||""} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الولاية</label><select value={form.state||""} onChange={e=>setForm({...form, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm">{SUDAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">المدينة</label><input value={form.city||""} onChange={e=>setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">رسوم التوصيل</label><input type="number" value={form.delivery_fee} onChange={e=>setForm({...form, delivery_fee: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">أقل قيمة طلب</label><input type="number" value={form.min_order} onChange={e=>setForm({...form, min_order: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        </div>
        <button className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700">حفظ التعديلات</button>
      </form>
    </div>
  );
}