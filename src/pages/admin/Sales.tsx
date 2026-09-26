import StatCard from "../../components/StatCard";
import { DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import { demoStats } from "../../lib/demoData";
import { formatCurrency } from "../../lib/format";
export default function Sales() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المبيعات</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="إجمالي المبيعات" value={formatCurrency(demoStats.totalRevenue)} icon={<DollarSign/>}/>
        <StatCard title="إجمالي الطلبات" value={demoStats.totalOrders} icon={<ShoppingBag/>} color="gold"/>
        <StatCard title="متوسط الطلب" value={formatCurrency(demoStats.avgOrderValue)} icon={<TrendingUp/>} color="ink"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-bold mb-3">توزيع المبيعات</h2>
        <div className="space-y-3">
          <ProgressRow label="المنتجات" value={demoStats.totalRevenue - demoStats.platformCommission - demoStats.deliveryFees} total={demoStats.totalRevenue}/>
          <ProgressRow label="عمولات المنصة" value={demoStats.platformCommission} total={demoStats.totalRevenue}/>
          <ProgressRow label="رسوم التوصيل" value={demoStats.deliveryFees} total={demoStats.totalRevenue}/>
        </div>
      </div>
    </div>
  );
}
function ProgressRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = Math.round((value / total) * 100);
  return (<div><div className="flex justify-between text-sm mb-1"><span className="font-semibold">{label}</span><span className="text-gray-600">{formatCurrency(value)} ({pct}%)</span></div><div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: pct + "%" }}/></div></div>);
}