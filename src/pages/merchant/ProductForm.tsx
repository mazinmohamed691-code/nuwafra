import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getProduct, createProduct, updateProduct, getCategories } from "../../lib/db";
import type { Product, Category, Store } from "../../types";
export default function ProductForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const { push } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ name: "", description: "", price: 0, image_url: "", stock: 100, is_active: true });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      setStore(s);
      setCats(await getCategories("product"));
      if (id) { const p = await getProduct(id); if (p) setForm(p); }
    })();
  }, [user, id]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !store) { push("املأ الحقول المطلوبة", "error"); return; }
    if (id) { await updateProduct(id, form); push("تم تعديل المنتج", "success"); }
    else {
      await createProduct({ store_id: store.id, name: form.name!, description: form.description, price: Number(form.price), discount_price: form.discount_price ? Number(form.discount_price) : undefined, category_id: form.category_id, image_url: form.image_url, stock: Number(form.stock || 0), is_active: true, is_featured: false });
      push("تم إضافة المنتج", "success");
    }
    nav("/merchant/products");
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">{id ? "تعديل منتج" : "منتج جديد"}</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 space-y-4">
        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المنتج *</label><input value={form.name||""} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" required/></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف</label><textarea value={form.description||""} onChange={e=>setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">السعر *</label><input type="number" value={form.price||0} onChange={e=>setForm({...form, price: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" required/></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">سعر بعد الخصم</label><input type="number" value={form.discount_price||""} onChange={e=>setForm({...form, discount_price: e.target.value ? Number(e.target.value) : undefined})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">التصنيف</label><select value={form.category_id||""} onChange={e=>setForm({...form, category_id: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"><option value="">— بدون —</option>{cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">المخزون</label><input type="number" value={form.stock||0} onChange={e=>setForm({...form, stock: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">رابط الصورة</label><input value={form.image_url||""} onChange={e=>setForm({...form, image_url: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="https://..."/></div>
        <div className="flex gap-2">
          <button className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700">{id ? "حفظ" : "إضافة"}</button>
          <button type="button" onClick={()=>nav("/merchant/products")} className="px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100">إلغاء</button>
        </div>
      </form>
    </div>
  );
}