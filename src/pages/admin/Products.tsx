import { useEffect, useState } from "react";
import { getProducts, getStores } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Product, Store } from "../../types";
export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => { Promise.all([getProducts(), getStores()]).then(([p, s]) => { setProducts(p); setStores(s); }); }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المنتجات</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الاسم</th><th className="text-right p-3">المتجر</th><th className="text-right p-3">السعر</th><th className="text-right p-3">المخزون</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (<tr key={p.id}><td className="p-3 font-semibold">{p.name}</td><td className="p-3 text-gray-600">{stores.find(s=>s.id===p.store_id)?.name}</td><td className="p-3">{formatCurrency(p.discount_price || p.price)}</td><td className="p-3">{p.stock}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}