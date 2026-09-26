import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, DollarSign, TrendingUp, ArrowLeft } from "lucide-react";
import StatCard from "../../components/StatCard";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getMerchantStore, getStoreOrders, getProducts } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import type { Store, Order, Product } from "../../types";
export default function Dashboard() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      setStore(s);
      if (s) {
        const [o, p] = await Promise.all([getStoreOrders(s.id), getProducts({ storeId: s.id })]);
        setOrders(o); setProducts(p);
      }
    })();
  }, [user]);
  if (!store) return <div className="p-8 text-center text-gray-500">لا يوجد متجر مربوط بحسابك</div>;
  const sales = orders.filter(o => o.status === "delivered").reduce((s,o)=>s+o.product_total, 0);
  const commission = orders.reduce((s,o)=>s+o.platform_commission, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-extrabold">لوحة {store.name}</h1><p className="text-gray-500 mt-1">إدارة متجرك وطلباتك</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلبات" value={orders.length} icon={<ShoppingBag/>}/>
        <StatCard title="المنتجات" value={products.length} icon={<Package/>} color="gold"/>
        <StatCard title="المبيعات" value={formatCurrency(sales)} icon={<DollarSign/>}/>
        <StatCard title="العمولات" value={formatCurrency(commission)} icon={<TrendingUp/>} color="red"/>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link to="/merchant/products" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">إدارة المنتجات</p><p className="text-sm text-gray-500 mt-1">إضافة وتعديل المنتجات</p></Link>
        <Link to="/merchant/orders" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">الطلبات</p><p className="text-sm text-gray-500 mt-1">قبول ومتابعة الطلبات</p></Link>
        <Link to="/merchant/wallet" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><p className="font-bold">المحفظة</p><p className="text-sm text-gray-500 mt-1">الرصيد والمستحقات</p></Link>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-extrabold">آخر الطلبات</h2><Link to="/merchant/orders" className="text-green-700 text-sm font-semibold flex items-center gap-1">عرض الكل <ArrowLeft size={16}/></Link></div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {orders.slice(0,5).map(o => (<div key={o.id} className="flex items-center justify-between p-4"><div><p className="font-bold text-sm">{o.order_number}</p><p className="text-xs text-gray-500">{formatCurrency(o.total_amount)}</p></div><OrderStatusBadge status={o.status}/></div>))}
          {orders.length === 0 && <p className="p-6 text-center text-gray-500 text-sm">لا توجد طلبات</p>}
        </div>
      </div>
    </div>
  );
}