import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrders, getStores } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order, Store } from "../../types";
export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    Promise.all([getCustomerOrders(user.id), getStores()]).then(([o, s]) => { setOrders(o); setStores(s); setLoading(false); });
  }, [user]);
  if (loading) return <Loading/>;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">طلباتي</h1>
      <p className="text-gray-500 mt-1">شاهد جميع طلباتك ومتابعة حالتها</p>
      <div className="mt-6 space-y-3">
        {orders.length === 0 && <EmptyState icon="📦" title="لا توجد طلبات" subtitle="ابدأ بطلبك الأول" action={<Link to="/stores" className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold">تصفح المتاجر</Link>}/>}
        {orders.map(o => {
          const store = stores.find(s => s.id === o.store_id);
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-extrabold">{o.order_number}</p><p className="text-sm text-gray-500 mt-1">{store?.name} • {formatDate(o.created_at)}</p></div>
              <div className="flex items-center gap-4 flex-wrap">
                <OrderStatusBadge status={o.status}/>
                <p className="font-extrabold text-green-700">{formatCurrency(o.total_amount)}</p>
                <Link to={`/customer/orders/${o.id}`} className="border-2 border-green-600 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-xs">تفاصيل</Link>
                <Link to={`/customer/track/${o.id}`} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs">تتبع</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}