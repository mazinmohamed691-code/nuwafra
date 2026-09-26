import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getProducts, deleteProduct } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/EmptyState";
import type { Store, Product } from "../../types";
export default function Products() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const { push } = useToast();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      setStore(s);
      if (s) setItems(await getProducts({ storeId: s.id }));
    })();
  }, [user]);
  const remove = async (id: string) => {
    if (!confirm("حذف المنتج؟")) return;
    await deleteProduct(id);
    setItems(items.filter(p => p.id !== id));
    push("تم الحذف", "success");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-extrabold">المنتجات</h1><p className="text-gray-500 mt-1">{items.length} منتج</p></div>
        <Link to="/merchant/products/new" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"><Plus size={16}/> منتج جديد</Link>
      </div>
      {items.length === 0 ? <div className="mt-6"><EmptyState icon="📦" title="لا توجد منتجات" action={<Link to="/merchant/products/new" className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold">إضافة منتج</Link>}/></div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">{p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{p.name}</p>
              <p className="text-xs text-gray-500 mt-1">المخزون: {p.stock}</p>
              <p className="font-extrabold text-green-700 text-sm mt-1">{formatCurrency(p.discount_price || p.price)}</p>
              <div className="flex gap-1 mt-2">
                <Link to={`/merchant/products/${p.id}/edit`} className="inline-flex items-center gap-1 border-2 border-green-600 text-green-700 px-3 py-1 rounded-lg font-semibold text-xs"><Pencil size={12}/> تعديل</Link>
                <button onClick={()=>remove(p.id)} className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg font-semibold text-xs"><Trash2 size={12}/> حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}