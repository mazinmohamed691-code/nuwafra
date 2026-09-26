import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Loading from "../../components/Loading";
import { getOrder, getStore, getAddresses } from "../../lib/db";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatDateTime } from "../../lib/format";
import type { Order, Store, Address } from "../../types";
export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const o = await getOrder(id);
      setOrder(o);
      if (o) {
        setStore(await getStore(o.store_id));
        if (o.address_id) {
          const list = await getAddresses(o.customer_id);
          setAddress(list.find(a => a.id === o.address_id) || null);
        }
      }
      setLoading(false);
    })();
  }, [id, user]);
  if (loading) return <Loading/>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-8"><EmptyState title="الطلب غير موجود"/></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/customer/orders" className="text-green-700 text-sm font-semibold">← رجوع للطلبات</Link>
      <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold">{order.order_number}</h1><p className="text-sm text-gray-500 mt-1">{formatDateTime(order.created_at)}</p></div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status}/>
          <Link to={`/customer/track/${order.id}`} className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">تتبع الطلب</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:col-span-2">
          <h2 className="font-bold mb-3">ملخص الدفع</h2>
          <div className="space-y-2 text-sm">
            <Row label="قيمة المنتجات" value={formatCurrency(order.product_total)}/>
            <Row label="رسوم التوصيل" value={formatCurrency(order.delivery_fee)}/>
            {order.discount > 0 && <Row label="خصم" value={"-" + formatCurrency(order.discount)}/>}
            <Row label="عمولة المنصة" value={formatCurrency(order.platform_commission)}/>
            <div className="border-t pt-2"><Row label="الإجمالي" value={formatCurrency(order.total_amount)} bold/></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold mb-2 flex items-center gap-2"><MapPin size={16}/> التوصيل إلى</h3>
            {address ? <><p className="text-sm font-semibold">{address.label}</p><p className="text-xs text-gray-500 mt-1">{address.state}، {address.city}، {address.neighborhood}</p><p className="text-xs text-gray-500">{address.street} — {address.landmark}</p><p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Phone size={12}/> {address.phone}</p></> : <p className="text-xs text-gray-500">—</p>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold mb-2">المتجر</h3>
            <p className="text-sm font-semibold">{store?.name}</p>
            <p className="text-xs text-gray-500 mt-1">{store?.city}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold mb-2">الدفع</h3>
            <p className="text-sm">{order.payment_method === "cash" ? "💵 الدفع عند الاستلام" : "💳 دفع تجريبي"}</p>
            <p className="text-xs text-gray-500 mt-1">حالة التسوية: {order.settlement_status === "pending" ? "قيد الانتظار" : "مسوّى"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className="flex justify-between"><span className={bold ? "font-bold" : "text-gray-600"}>{label}</span><span className={bold ? "font-extrabold text-green-700" : ""}>{value}</span></div>;
}