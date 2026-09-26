import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bike, DollarSign, Package, TrendingUp } from "lucide-react";
import StatCard from "../../components/StatCard";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getDriverOrders, getStores } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Order, Store } from "../../types";
export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  useEffect(() => {
    if (!user) return;
    Promise.all([getDriverOrders(user.id), getStores()]).then(([o, s]) => { setOrders(o); setStores(s); });
  }, [user]);
  const delivered = orders.filter(o => o.status === "delivered");
  const active = orders.find(o => o.status !== "delivered" && o.status !== "cancelled");
  const earnings = delivered.reduce((s,o)=>s+o.driver_due, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">لوحة السائق</h1>
      <p className="text-gray-500 mt-1">مرحباً {user?.full_name}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="الطلبات المكتملة" value={delivered.length} icon={<Package/>}/>
        <StatCard title="الأرباح" value={formatCurrency(earnings)} icon={<DollarSign/>} color="gold"/>
        <StatCard title="طلبات نشطة" value={orders.filter(o=>o.status!=="delivered"&&o.status!=="cancelled").length} icon={<Bike/>} color="ink"/>
        <StatCard title="التقييم" value="5.0" icon={<TrendingUp/>} color="red"/>
      </div>
      {active && <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-6 border-r-4 border-r-green-600">
        <h3 className="font-bold flex items-center gap-2"><Bike size={18}/> طلب حالي</h3>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div><p className="font-bold">{active.order_number}</p><p className="text-xs text-gray-500">{stores.find(s=>s.id===active.store_id)?.name}</p></div>
          <OrderStatusBadge status={active.status}/>
          <Link to="/driver/current" className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">متابعة</Link>
        </div>
      </div>}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Link to="/driver/new" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">الطلبات الجديدة</p></Link>
        <Link to="/driver/earnings" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">الأرباح</p></Link>
        <Link to="/driver/cash" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">المبالغ النقدية</p></Link>
      </div>
    </div>
  );
}