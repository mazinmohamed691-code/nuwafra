import { useEffect, useState } from "react";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { getAllUsers, getStores, getCustomerOrders } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order, Store, User } from "../../types";
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    (async () => {
      const [s, u] = await Promise.all([getStores(), getAllUsers()]);
      setStores(s); setUsers(u);
      const all: Order[] = [];
      for (const c of u.filter(x => x.role === "customer")) all.push(...await getCustomerOrders(c.id));
      setOrders(all);
    })();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الطلبات</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الطلب</th><th className="text-right p-3">العميل</th><th className="text-right p-3">المتجر</th><th className="text-right p-3">الإجمالي</th><th className="text-right p-3">العمولة</th><th className="text-right p-3">الحالة</th><th className="text-right p-3">التاريخ</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (<tr key={o.id}><td className="p-3 font-semibold">{o.order_number}</td><td className="p-3 text-gray-600">{users.find(u=>u.id===o.customer_id)?.full_name}</td><td className="p-3 text-gray-600">{stores.find(s=>s.id===o.store_id)?.name}</td><td className="p-3 font-bold">{formatCurrency(o.total_amount)}</td><td className="p-3 text-red-600">{formatCurrency(o.platform_commission)}</td><td className="p-3"><OrderStatusBadge status={o.status}/></td><td className="p-3 text-gray-500 text-xs">{formatDate(o.created_at)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}