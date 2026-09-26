import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getStoreOrders } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order } from "../../types";
export default function Transactions() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      if (s) setOrders(await getStoreOrders(s.id));
    })();
  }, [user]);
  const rows = orders.flatMap(o => [
    { id: o.id+"-c", date: o.created_at, desc: `طلب ${o.order_number}`, amount: o.product_total },
    { id: o.id+"-comm", date: o.created_at, desc: "عمولة المنصة", amount: -o.platform_commission }
  ]);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المعاملات المالية</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">التاريخ</th><th className="text-right p-3">الوصف</th><th className="text-right p-3">المبلغ</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => (<tr key={r.id}><td className="p-3 text-gray-500">{formatDate(r.date)}</td><td className="p-3">{r.desc}</td><td className={`p-3 font-bold ${r.amount >= 0 ? "text-green-700" : "text-red-600"}`}>{r.amount >= 0 ? "+" : ""}{formatCurrency(r.amount)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}