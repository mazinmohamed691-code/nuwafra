import StatCard from "../../components/StatCard";
import { TrendingUp, Users, Store, Truck, ShoppingBag, DollarSign } from "lucide-react";
import { demoStats } from "../../lib/demoData";
import { formatCurrency } from "../../lib/format";
export default function Stats() {
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس"];
  const data = [42, 58, 65, 71, 88, 92, 105, 118];
  const max = Math.max(...data);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">الإحصائيات</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="الطلبات" value={demoStats.totalOrders} icon={<ShoppingBag/>}/>
        <StatCard title="العملاء" value={demoStats.totalCustomers} icon={<Users/>} color="gold"/>
        <StatCard title="المتاجر" value={demoStats.totalStores} icon={<Store/>} color="ink"/>
        <StatCard title="السائقين" value={demoStats.totalDrivers} icon={<Truck/>} color="red"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp/> نمو الطلبات الشهرية</h2>
        <div className="flex items-end gap-2 h-48">
          {data.map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-green-600 rounded-t-lg" style={{ height: `${(v/max)*100}%` }}/><span className="text-xs text-gray-500">{months[i]}</span></div>))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <StatCard title="إجمالي المبيعات" value={formatCurrency(demoStats.totalRevenue)} icon={<DollarSign/>}/>
        <StatCard title="عمولات المنصة" value={formatCurrency(demoStats.platformCommission)} color="gold"/>
        <StatCard title="متوسط قيمة الطلب" value={formatCurrency(demoStats.avgOrderValue)} color="ink"/>
      </div>
    </div>
  );
}