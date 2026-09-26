import { Link } from "react-router-dom";
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, Truck } from "lucide-react";
import StatCard from "../../components/StatCard";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { demoStats, demoOrders, demoStores } from "../../lib/demoData";
import { formatCurrency } from "../../lib/format";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">لوحة الإدارة</h1>
      <p className="text-gray-500 mt-1">نظرة شاملة على أداء المنصة</p>

      {/* إحصائيات رئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="إجمالي الطلبات" value={demoStats.totalOrders} icon={<ShoppingBag/>}/>
        <StatCard title="المتاجر" value={demoStats.totalStores} icon={<Store/>} color="gold"/>
        <StatCard title="العملاء" value={demoStats.totalCustomers} icon={<Users/>} color="ink"/>
        <StatCard title="السائقين" value={demoStats.totalDrivers} icon={<Truck/>} color="red"/>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <StatCard title="إجمالي المبيعات" value={formatCurrency(demoStats.totalRevenue)} icon={<DollarSign/>}/>
        <StatCard title="عمولات المنصة" value={formatCurrency(demoStats.platformCommission)} icon={<TrendingUp/>} color="gold"/>
        <StatCard title="رسوم التوصيل" value={formatCurrency(demoStats.deliveryFees)} color="ink"/>
        <StatCard title="متوسط الطلب" value={formatCurrency(demoStats.avgOrderValue)} color="red"/>
      </div>

      {/* روابط سريعة */}
      <div className="mt-8">
        <h2 className="text-xl font-extrabold mb-4">روابط سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin/merchant-balances" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">💼</div>
            <p className="font-bold text-sm">أرصدة التجار</p>
            <p className="text-xs text-gray-500 mt-1">اعتماد التسويات</p>
          </Link>
          <Link to="/admin/driver-dues" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">🛵</div>
            <p className="font-bold text-sm">مستحقات السائقين</p>
            <p className="text-xs text-gray-500 mt-1">الأرباح والنقد</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">📦</div>
            <p className="font-bold text-sm">الطلبات</p>
            <p className="text-xs text-gray-500 mt-1">إدارة كل الطلبات</p>
          </Link>
          <Link to="/admin/commissions" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition">
            <div className="text-3xl mb-2">💰</div>
            <p className="font-bold text-sm">العمولات</p>
            <p className="text-xs text-gray-500 mt-1">تعديل النسبة</p>
          </Link>
        </div>
      </div>

      {/* آخر الطلبات + أفضل المتاجر */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold">آخر الطلبات</h2>
            <Link to="/admin/orders" className="text-green-700 text-sm font-semibold">عرض الكل</Link>
          </div>
          <div className="space-y-2">
            {demoOrders.slice(0,5).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-bold text-sm">{o.order_number}</p>
                  <p className="text-xs text-gray-500">{demoStores.find(s=>s.id===o.store_id)?.name}</p>
                </div>
                <OrderStatusBadge status={o.status}/>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold">أفضل المتاجر</h2>
            <Link to="/admin/stores" className="text-green-700 text-sm font-semibold">عرض الكل</Link>
          </div>
          <div className="space-y-2">
            {demoStores.slice(0,5).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.type === "restaurant" ? "مطعم" : "متجر"}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">⭐ {s.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}