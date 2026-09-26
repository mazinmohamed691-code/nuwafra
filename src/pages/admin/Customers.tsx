import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getAllUsers, getCustomerOrders } from "../../lib/db";
import type { User } from "../../types";
export default function Customers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    (async () => {
      const all = await getAllUsers();
      const list = all.filter(u => u.role === "customer");
      setCustomers(list);
      const map: Record<string, number> = {};
      for (const c of list) map[c.id] = (await getCustomerOrders(c.id)).length;
      setCounts(map);
    })();
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3"><Users className="text-green-700" size={24}/><h1 className="text-2xl font-extrabold">العملاء</h1></div>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الاسم</th><th className="text-right p-3">البريد</th><th className="text-right p-3">الهاتف</th><th className="text-right p-3">عدد الطلبات</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(c => (<tr key={c.id}><td className="p-3 font-semibold">{c.full_name}</td><td className="p-3 text-gray-600">{c.email}</td><td className="p-3 text-gray-600">{c.phone || "—"}</td><td className="p-3">{counts[c.id] || 0}</td></tr>))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">لا يوجد عملاء</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}