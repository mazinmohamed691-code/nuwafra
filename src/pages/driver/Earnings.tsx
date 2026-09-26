import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { DollarSign, TrendingUp, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDriverOrders } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import type { Order } from "../../types";
export default function Earnings() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { if (!user) return; getDriverOrders(user.id).then(setOrders); }, [user]);
  const delivered = orders.filter(o => o.status === "delivered");
  const total = delivered.reduce((s,o)=>s+o.driver_due, 0);
  const avg = delivered.length ? total / delivered.length : 0;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الأرباح</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="إجمالي الأرباح" value={formatCurrency(total)} icon={<DollarSign/>}/>
        <StatCard title="متوسط الطلب" value={formatCurrency(avg)} icon={<TrendingUp/>} color="gold"/>
        <StatCard title="الطلبات المكتملة" value={delivered.length} icon={<Package/>} color="ink"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الطلب</th><th className="text-right p-3">التاريخ</th><th className="text-right p-3">العمولة</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {delivered.map(o => (<tr key={o.id}><td className="p-3 font-semibold">{o.order_number}</td><td className="p-3 text-gray-500">{formatDate(o.created_at)}</td><td className="p-3 font-bold text-green-700">{formatCurrency(o.driver_due)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}