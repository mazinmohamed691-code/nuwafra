import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDriverOrders, getStores } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import type { Order, Store } from "../../types";
export default function History() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => {
    if (!user) return;
    Promise.all([getDriverOrders(user.id), getStores()]).then(([o, s]) => { setOrders(o); setStores(s); });
  }, [user]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">سجل الطلبات</h1>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 divide-y divide-gray-100">
        {orders.map(o => (
          <div key={o.id} className="p-4 flex items-center justify-between flex-wrap gap-2">
            <div><p className="font-bold text-sm">{o.order_number}</p><p className="text-xs text-gray-500 mt-0.5">{stores.find(s => s.id === o.store_id)?.name} • {formatDate(o.created_at)}</p></div>
            <div className="flex items-center gap-3"><OrderStatusBadge status={o.status}/><p className="font-bold text-green-700 text-sm">{formatCurrency(o.driver_due)}</p></div>
          </div>
        ))}
        {orders.length === 0 && <p className="p-6 text-center text-gray-500 text-sm">لا توجد طلبات</p>}
      </div>
    </div>
  );
}