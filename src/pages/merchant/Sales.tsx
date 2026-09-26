import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getStoreOrders } from "../../lib/db";
import { formatCurrency, formatDate } from "../../lib/format";
import { TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import type { Order, Store } from "../../types";
export default function Sales() {
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
  const sales = orders.reduce((s,o)=>s+o.product_total, 0);
  const delivered = orders.filter(o => o.status === "delivered");
  const avg = orders.length ? sales / orders.length : 0;
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المبيعات</h1>
      <p className="text-gray-500 mt-1">تحليل مبيعات {store?.name}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="إجمالي المبيعات" value={formatCurrency(sales)} icon={<DollarSign/>}/>
        <StatCard title="الطلبات المكتملة" value={delivered.length} icon={<ShoppingBag/>} color="gold"/>
        <StatCard title="متوسط الطلب" value={formatCurrency(avg)} icon={<TrendingUp/>}/>
        <StatCard title="إجمالي الطلبات" value={orders.length} icon={<ShoppingBag/>} color="ink"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="text-right p-3">الطلب</th><th className="text-right p-3">التاريخ</th><th className="text-right p-3">القيمة</th><th className="text-right p-3">مستحقك</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (<tr key={o.id}><td className="p-3 font-semibold">{o.order_number}</td><td className="p-3 text-gray-500">{formatDate(o.created_at)}</td><td className="p-3">{formatCurrency(o.product_total)}</td><td className="p-3 font-bold text-green-700">{formatCurrency(o.merchant_due)}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}