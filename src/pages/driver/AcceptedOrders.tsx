import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getDriverOrders, getStores } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Order, Store } from "../../types";
export default function AcceptedOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => {
    if (!user) return;
    Promise.all([getDriverOrders(user.id), getStores()]).then(([o, s]) => {
      setOrders(o.filter(x => x.status !== "delivered" && x.status !== "cancelled"));
      setStores(s);
    });
  }, [user]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الطلبات المقبولة</h1>
      {orders.length === 0 ? <div className="mt-6"><EmptyState icon="📋" title="لا توجد طلبات مقبولة"/></div> : <div className="mt-6 space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between flex-wrap gap-3">
            <div><p className="font-extrabold">{o.order_number}</p><p className="text-sm text-gray-500 mt-1">{stores.find(s => s.id === o.store_id)?.name}</p></div>
            <OrderStatusBadge status={o.status}/>
            <p className="font-bold text-green-700">{formatCurrency(o.driver_due)}</p>
            <Link to="/driver/current" className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">متابعة</Link>
          </div>
        ))}
      </div>}
    </div>
  );
}