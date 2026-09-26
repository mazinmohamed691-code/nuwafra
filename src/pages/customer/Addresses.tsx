import { useEffect, useState } from "react";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { getAddresses, saveAddress, deleteAddress } from "../../lib/db";
import { SUDAN_STATES } from "../../lib/constants";
import type { Address } from "../../types";
export default function Addresses() {
  const { user } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Address>>({ state: "الخرطوم", city: "الخرطوم", label: "المنزل" });
  const { push } = useToast();
  useEffect(() => { if (!user) return; getAddresses(user.id).then(setItems); }, [user]);
  const save = async () => {
    if (!user) return;
    if (!form.state || !form.city || !form.phone) { push("املأ الحقول المطلوبة", "error"); return; }
    await saveAddress({ ...(form as Address), user_id: user.id });
    const list = await getAddresses(user.id);
    setItems(list);
    setOpen(false);
    setForm({ state: "الخرطوم", city: "الخرطوم", label: "المنزل" });
    push("تم الحفظ", "success");
  };
  const remove = async (id: string) => { if (!confirm("حذف العنوان؟")) return; await deleteAddress(id); setItems(items.filter(i => i.id !== id)); push("تم الحذف", "success"); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">عناويني</h1>
        <button onClick={()=>{setForm({ state: "الخرطوم", city: "الخرطوم", label: "المنزل" }); setOpen(true);}} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"><Plus size={16}/> إضافة</button>
      </div>
      {items.length === 0 ? <div className="mt-6"><EmptyState icon="📍" title="لا توجد عناوين" subtitle="أضف عنوانك الأول"/></div> : <div className="mt-6 space-y-3">{items.map(a => (<div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0"><MapPin size={18}/></div><div><div className="flex items-center gap-2"><p className="font-bold">{a.label}</p>{a.is_default && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">افتراضي</span>}</div><p className="text-xs text-gray-500 mt-1">{a.state}، {a.city}، {a.neighborhood}</p><p className="text-xs text-gray-500">{a.street} — {a.landmark}</p><p className="text-xs text-gray-500 mt-1">{a.phone}</p></div></div><div className="flex gap-1"><button onClick={()=>{setForm(a); setOpen(true);}} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={16}/></button><button onClick={()=>remove(a.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button></div></div></div>))}</div>}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-extrabold mb-4">{form.id ? "تعديل عنوان" : "عنوان جديد"}</h2>
            <div className="space-y-3">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">التسمية</label><input value={form.label||""} onChange={e=>setForm({...form, label: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="المنزل، العمل..."/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الولاية *</label><select value={form.state||""} onChange={e=>setForm({...form, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm">{SUDAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">المدينة *</label><input value={form.city||""} onChange={e=>setForm({...form, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الحي</label><input value={form.neighborhood||""} onChange={e=>setForm({...form, neighborhood: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الشارع</label><input value={form.street||""} onChange={e=>setForm({...form, street: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">أقرب معلم</label><input value={form.landmark||""} onChange={e=>setForm({...form, landmark: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="مثال: بجوار مسجد..."/></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف *</label><input value={form.phone||""} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="+249..."/></div>
            </div>
            <div className="mt-5 flex gap-2"><button onClick={save} className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700">حفظ</button><button onClick={()=>setOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100">إلغاء</button></div>
          </div>
        </div>
      )}
    </div>
  );
}