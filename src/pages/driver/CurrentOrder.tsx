import { useEffect, useState } from "react";
import { MapPin, Phone, Package } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getDriverOrders, getStore, getAddresses, updateOrderStatus } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import { ORDER_STATUS } from "../../lib/constants";
import type { Order, Store, Address, OrderStatus } from "../../types";
const FLOW: OrderStatus[] = ["picked_up","on_the_way","delivered"];
export default function CurrentOrder() {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await getDriverOrders(user.id);
      const active = list.find(o => o.status !== "delivered" && o.status !== "cancelled");
      setOrder(active || null);
      if (active) {
        setStore(await getStore(active.store_id));
        if (active.address_id) {
          const addrs = await getAddresses(active.customer_id);
          setAddress(addrs.find(a => a.id === active.address_id) || null);
        }
      }
      setLoading(false);
    })();
  }, [user]);
  if (loading) return <Loading/>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-8"><EmptyState icon="🛵" title="لا يوجد طلب حالي"/></div>;
  const next = async () => {
    const i = FLOW.indexOf(order.status as OrderStatus);
    if (i >= 0 && i < FLOW.length - 1) {
      const ns = FLOW[i+1];
      await updateOrderStatus(order.id, ns, user?.id);
      setOrder({ ...order, status: ns });
      push(`تم التحديث: ${ORDER_STATUS[ns].label}`, "success");
    }
  };
  const buttonLabel = order.status === "picked_up" ? "بدأت التوصيل" : order.status === "on_the_way" ? "تم التوصيل" : "تم استلام الطلب";
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الطلب الحالي</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
        <div className="flex items-center justify-between flex-wrap gap-2"><p className="font-extrabold text-lg">{order.order_number}</p><OrderStatusBadge status={order.status}/></div>
        <p className="text-sm text-gray-500 mt-2">أجرك: <span className="font-bold text-green-700">{formatCurrency(order.driver_due)}</span></p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
        <h3 className="font-bold flex items-center gap-2 mb-2"><Package size={16}/> الاستلام من</h3>
        <p className="font-bold">{store?.name}</p>
        <p className="text-sm text-gray-500">{store?.city} • {store?.state}</p>
        {store?.phone && <a href={`tel:${store.phone}`} className="text-green-700 text-sm mt-2 flex items-center gap-1"><Phone size={14}/> {store.phone}</a>}
      </div>
      {address && <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
        <h3 className="font-bold flex items-center gap-2 mb-2"><MapPin size={16}/> التوصيل إلى</h3>
        <p className="font-bold">{address.label}</p>
        <p className="text-sm text-gray-600">{address.state}، {address.city}، {address.neighborhood}</p>
        <p className="text-sm text-gray-600">{address.street} — {address.landmark}</p>
        <a href={`tel:${address.phone}`} className="text-green-700 text-sm mt-2 flex items-center gap-1"><Phone size={14}/> {address.phone}</a>
      </div>}
      {order.status !== "delivered" && <button onClick={next} className="w-full mt-4 bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700">{buttonLabel}</button>}
      {order.status === "delivered" && <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mt-4 text-center"><p className="font-extrabold text-green-700">🎉 تم إكمال الطلب</p></div>}
    </div>
  );
}