import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { getStore, getProducts } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Store, Product } from "../../types";
export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    Promise.all([getStore(id), getProducts({ storeId: id })]).then(([s, p]) => { setStore(s); setProducts(p); setLoading(false); });
  }, [id]);
  if (loading) return <Loading/>;
  if (!store) return <div className="max-w-3xl mx-auto px-4 py-8"><EmptyState title="المتجر غير موجود"/></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-40 md:h-56 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
          <div className="text-white text-6xl">{store.type === "restaurant" ? "🍽️" : "🏪"}</div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold">{store.name}</h1>
              <p className="text-gray-500 mt-1 text-sm">{store.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500"/> {store.rating}</span>
                <span className="flex items-center gap-1"><MapPin size={14}/> {store.city}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> 25-40 دقيقة</span>
              </div>
            </div>
            <div className="text-sm"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">توصيل {formatCurrency(store.delivery_fee)}</span></div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 mt-8">المنتجات</h2>
      {products.length === 0 ? <EmptyState title="لا توجد منتجات" /> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map(p => <ProductCard key={p.id} product={p} storeName={store.name}/>)}</div>}
    </div>
  );
}