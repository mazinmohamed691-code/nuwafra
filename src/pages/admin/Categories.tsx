import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { getCategories } from "../../lib/db";
import type { Category } from "../../types";
export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const { push } = useToast();
  useEffect(() => { getCategories().then(setItems); }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">التصنيفات</h1>
        <button onClick={()=>push("أضف التصنيفات من Supabase مباشرة","info")} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"><Plus size={16}/> تصنيف جديد</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {items.map(c => (<div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 text-center"><div className="text-3xl mb-2">{c.icon}</div><p className="font-bold text-sm">{c.name}</p><p className="text-xs text-gray-500 mt-1">{c.type === "store" ? "متجر" : "منتج"}</p></div>))}
      </div>
    </div>
  );
}