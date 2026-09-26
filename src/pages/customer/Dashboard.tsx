import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, MapPin, Bell, Package, ArrowLeft, Store } from "lucide-react";
import StatCard from "../../components/StatCard";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrders, getNotifications, getStores } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order, Store as StoreT, Notification } from "../../types";
export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [stores, setStores] = useState<StoreT[]>([]);
  useEffect(() => {
    if (!user) return;
    Promise.all([getCustomerOrders(user.id), getNotifications(user.id), getStores()]).then(([o, n, s]) => { setOrders(o); setNotifs(n); setStores(s); });
  }, [user]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-extrabold">مرحباً {user?.full_name} 👋</h1><p className="text-gray-500 mt-1">هذه نظرة سريعة على حسابك</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="طلباتي" value={orders.length} icon={<Package/>} />
        <StatCard title="في الطريق" value={orders.filter(o=>o.status==="on_the_way").length} icon={<ShoppingBag/>} color="gold" />
        <StatCard title="المفضلة" value={4} icon={<Heart/>} color="red" />
        <StatCard title="إشعارات" value={notifs.filter(n=>!n.is_read).length} icon={<Bell/>} color="ink" />
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Quick to="/stores" icon={<Store/>} title="تصفح المتاجر" desc="اطلب من أي متجر أو مطعم" />
        <Quick to="/customer/orders" icon={<Package/>} title="تتبع الطلبات" desc="شاهد حالة طلباتك" />
        <Quick to="/customer/addresses" icon={<MapPin/>} title="عناويني" desc="أضف أو عدّل عناوينك" />
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-extrabold">آخر الطلبات</h2><Link to="/customer/orders" className="text-green-700 text-sm font-semibold flex items-center gap-1">عرض الكل <ArrowLeft size={16}/></Link></div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {orders.slice(0,5).map(o => {
            const store = stores.find(s => s.id === o.store_id);
            return (
              <Link key={o.id} to={`/customer/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div><p className="font-bold text-sm">{o.order_number}</p><p className="text-xs text-gray-500 mt-0.5">{store?.name} • {formatDate(o.created_at)}</p></div>
                <div className="text-left"><OrderStatusBadge status={o.status} /><p className="text-sm font-bold text-green-700 mt-1">{formatCurrency(o.total_amount)}</p></div>
              </Link>
            );
          })}
          {orders.length === 0 && <p className="p-6 text-center text-gray-500 text-sm">لا توجد طلبات بعد</p>}
        </div>
      </div>
    </div>
  );
}
function Quick({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return <Link to={to} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">{icon}</div><div><p className="font-bold">{title}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div></Link>;
}