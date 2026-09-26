import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import { demoProducts, demoStores } from "../../lib/demoData";
export default function Favorites() {
  const favs = demoProducts.slice(0, 4);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">المفضلة</h1>
      <p className="text-gray-500 mt-1">المنتجات التي أعجبتك</p>
      {favs.length === 0 ? <div className="mt-6"><EmptyState icon="❤️" title="لا توجد منتجات"/></div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">{favs.map(p => { const s = demoStores.find(x => x.id === p.store_id); return <ProductCard key={p.id} product={p} storeName={s?.name}/>; })}</div>}
    </div>
  );
}