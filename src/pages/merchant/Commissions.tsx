import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getStoreOrders } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import { Percent } from "lucide-react";
import type { Order, Store } from "../../types";
export default function Commissions() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      setStore(s);
      if (s) setOrders(await getStoreOrders(s.id));
    })();
  }, [user]);
  const total = orders.reduce((s,o)=>s+o.platform_commission, 0);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">العمولات</h1>
      <p className="text-gray-500 mt-1">عمولات المنصة على طلباتك</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="نسبة العمولة" value={`${store?.commission_rate || 8}%`} icon={<Percent/>} color="gold"/>
        <StatCard title="إجمالي العمولات" value={formatCurrency(total)} icon={<Percent/>} color="red"/>
        <StatCard title="عدد الطلبات" value={orders.length}/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الطلب</th><th className="text-right p-3">التاريخ</th><th className="text-right p-3">القيمة</th><th className="text-right p-3">العمولة</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (<tr key={o.id}><td className="p-3 font-semibold">{o.order_number}</td><td className="p-3 text-gray-500">{formatDate(o.created_at)}</td><td className="p-3">{formatCurrency(o.product_total)}</td><td className="p-3 text-red-600 font-bold">- {formatCurrency(o.platform_commission)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}