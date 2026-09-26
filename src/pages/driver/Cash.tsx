import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Banknote } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDriverOrders } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Order } from "../../types";
export default function Cash() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { if (!user) return; getDriverOrders(user.id).then(setOrders); }, [user]);
  const cashOrders = orders.filter(o => o.payment_method === "cash" && o.status === "delivered");
  const total = cashOrders.reduce((s,o)=>s+o.total_amount, 0);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المبالغ النقدية</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="إجمالي النقد" value={formatCurrency(total)} icon={<Banknote/>} color="gold"/>
        <StatCard title="عدد الطلبات النقدية" value={cashOrders.length}/>
        <StatCard title="للتسليم للمنصة" value={formatCurrency(total * 0.92)} color="red"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-6">
        <h2 className="font-bold mb-3">ملاحظة</h2>
        <p className="text-sm text-gray-600">يتم تسليم المبالغ النقدية المحصلة إلى المنصة أسبوعياً.</p>
      </div>
    </div>
  );
}