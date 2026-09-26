import { useEffect, useState } from "react";
import { getAllUsers, getDriverOrders } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { User, Order } from "../../types";
export default function DriverDues() {
  const [rows, setRows] = useState<{ driver: User; orders: number; due: number; cash: number }[]>([]);
  useEffect(() => {
    (async () => {
      const all = await getAllUsers();
      const drivers = all.filter(u => u.role === "driver");
      const result = [];
      for (const d of drivers) {
        const orders: Order[] = await getDriverOrders(d.id);
        result.push({ driver: d, orders: orders.length, due: orders.filter(o => o.status === "delivered").reduce((s,o)=>s+o.driver_due, 0), cash: orders.filter(o => o.payment_method === "cash").reduce((s,o)=>s+o.total_amount, 0) });
      }
      setRows(result);
    })();
  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">مستحقات السائقين</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">السائق</th><th className="text-right p-3">الطلبات</th><th className="text-right p-3">المستحق</th><th className="text-right p-3">النقد المُحصّل</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => (<tr key={r.driver.id}><td className="p-3 font-semibold">{r.driver.full_name}</td><td className="p-3">{r.orders}</td><td className="p-3 font-bold text-green-700">{formatCurrency(r.due)}</td><td className="p-3 text-red-600">{formatCurrency(r.cash)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}