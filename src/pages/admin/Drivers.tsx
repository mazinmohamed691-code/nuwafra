import { useEffect, useState } from "react";
import { getAllUsers } from "../../lib/db";
import type { User } from "../../types";
export default function Drivers() {
  const [items, setItems] = useState<User[]>([]);
  useEffect(() => { getAllUsers().then(all => setItems(all.filter(u => u.role === "driver"))); }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">السائقين</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الاسم</th><th className="text-right p-3">البريد</th><th className="text-right p-3">الهاتف</th><th className="text-right p-3">الحالة</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(d => (<tr key={d.id}><td className="p-3 font-semibold">{d.full_name}</td><td className="p-3 text-gray-600">{d.email}</td><td className="p-3 text-gray-600">{d.phone || "—"}</td><td className="p-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">نشط</span></td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}