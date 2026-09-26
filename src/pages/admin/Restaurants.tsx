import { useEffect, useState } from "react";
import { getStores } from "../../lib/db";
import type { Store } from "../../types";
export default function Restaurants() {
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => { getStores({ type: "restaurant" }).then(setStores); }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المطاعم</h1>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {stores.map(s => (<div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5"><p className="font-extrabold">{s.name}</p><p className="text-xs text-gray-500 mt-1">{s.city} — {s.state}</p><div className="flex gap-2 mt-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">⭐ {s.rating}</span><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">عمولة {s.commission_rate}%</span></div></div>))}
      </div>
    </div>
  );
}