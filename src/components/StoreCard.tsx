import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import type { Store } from "../types";
import { formatCurrency } from "../lib/format";
export default function StoreCard({ store }: { store: Store }) {
  return (
    <Link to={`/store/${store.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition group block">
      <div className="aspect-[16/9] bg-gradient-to-br from-green-100 to-green-50 relative">
        {store.cover_url ? <img src={store.cover_url} alt={store.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">{store.type === "restaurant" ? "🍽️" : "🏪"}</div>}
        <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">{store.type === "restaurant" ? "مطعم" : "متجر"}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-gray-900 truncate">{store.name}</h3>
          <div className="flex items-center gap-1 shrink-0"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-xs font-semibold">{store.rating?.toFixed(1)}</span></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{store.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><MapPin size={12} /> {store.city}</span><span>•</span><span>توصيل {formatCurrency(store.delivery_fee)}</span>
        </div>
      </div>
    </Link>
  );
}