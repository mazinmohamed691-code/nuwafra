import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SUDAN_STATES } from "../../lib/constants";
import { useToast } from "../../context/ToastContext";
interface FeeRow { id: string; state: string; city: string; base_fee: number; }
export default function DeliveryFees() {
  const [items, setItems] = useState<FeeRow[]>([
    { id: "1", state: "الخرطوم", city: "الخرطوم", base_fee: 1500 },
    { id: "2", state: "الخرطوم", city: "أم درمان", base_fee: 1800 },
    { id: "3", state: "الخرطوم", city: "بحري", base_fee: 1700 },
    { id: "4", state: "الجزيرة", city: "ود مدني", base_fee: 2500 }
  ]);
  const { push } = useToast();
  const add = () => setItems([...items, { id: Date.now().toString(), state: "الخرطوم", city: "", base_fee: 1000 }]);
  const remove = (id: string) => setItems(items.filter(i=>i.id!==id));
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">رسوم التوصيل</h1>
        <button onClick={add} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"><Plus size={16}/> إضافة</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 divide-y divide-gray-100">
        {items.map(it => (
          <div key={it.id} className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الولاية</label><select value={it.state} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x, state: e.target.value}:x))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm">{SUDAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">المدينة</label><input value={it.city} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x, city: e.target.value}:x))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">الرسوم</label><input type="number" value={it.base_fee} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x, base_fee: Number(e.target.value)}:x))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
            <button onClick={()=>{remove(it.id); push("تم الحذف","success");}} className="bg-red-600 text-white px-3 py-2 rounded-lg font-semibold text-xs"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}