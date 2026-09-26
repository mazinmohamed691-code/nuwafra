import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import StoreCard from "../../components/StoreCard";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { getStores, getProducts, getCategories } from "../../lib/db";
import type { Store, Product, Category } from "../../types";
export default function Stores() {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get("type");
  const [q, setQ] = useState(params.get("q") || "");
  const [tab, setTab] = useState<"stores" | "products">("stores");
  const [typeFilter, setTypeFilter] = useState<"all" | "store" | "restaurant">(typeParam === "restaurant" ? "restaurant" : "all");
  const [category, setCategory] = useState<string>("all");
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCategories("product").then(setCategories); }, []);
  useEffect(() => {
    setLoading(true);
    Promise.all([getStores({ type: typeFilter === "all" ? undefined : typeFilter, q: q || undefined }), getProducts({ q: q || undefined, categoryId: category !== "all" ? category : undefined })])
      .then(([s, p]) => { setStores(s); setProducts(p); setLoading(false); });
  }, [typeFilter, q, category]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">المتاجر والمطاعم</h1>
      <p className="text-gray-500 mt-1">تصفح واطلب من كل المتاجر المتوفرة</p>
      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input value={q} onChange={e=>{setQ(e.target.value); setParams(e.target.value ? {q: e.target.value} : {});}} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="ابحث..."/>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setTab("stores")} className={tab==="stores" ? "px-4 py-2.5 rounded-xl font-semibold text-sm bg-green-600 text-white" : "px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-green-600 text-green-700"}>المتاجر</button>
          <button onClick={()=>setTab("products")} className={tab==="products" ? "px-4 py-2.5 rounded-xl font-semibold text-sm bg-green-600 text-white" : "px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-green-600 text-green-700"}>المنتجات</button>
        </div>
      </div>
      {loading ? <Loading/> : tab === "stores" ? (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {(["all","store","restaurant"] as const).map(t => (
              <button key={t} onClick={()=>setTypeFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${typeFilter===t ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>{t === "all" ? "الكل" : t === "store" ? "متاجر" : "مطاعم"}</button>
            ))}
          </div>
          {stores.length === 0 ? <div className="mt-6"><EmptyState title="لا توجد نتائج"/></div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">{stores.map(s => <StoreCard key={s.id} store={s}/>)}</div>}
        </>
      ) : (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button onClick={()=>setCategory("all")} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${category==="all" ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>الكل</button>
            {categories.map(c => (
              <button key={c.id} onClick={()=>setCategory(c.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${category===c.id ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200"}`}>{c.icon} {c.name}</button>
            ))}
          </div>
          {products.length === 0 ? <div className="mt-6"><EmptyState title="لا توجد منتجات"/></div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">{products.map(p => {
            const s = stores.find(x => x.id === p.store_id);
            return <ProductCard key={p.id} product={p} storeName={s?.name}/>;
          })}</div>}
        </>
      )}
    </div>
  );
}