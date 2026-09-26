import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getAvailableOrders, getStores, getAddresses, assignOrderToDriver } from "../../lib/db";
import { formatCurrency, formatDateTime } from "../../lib/format";
import { MapPin } from "lucide-react";
import type { Order, Store, Address } from "../../types";
export default function NewOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [addresses, setAddresses] = useState<Record<string, Address[]>>({});
  const { push } = useToast();
  useEffect(() => {
    (async () => {
      const [o, s] = await Promise.all([getAvailableOrders(), getStores()]);
      setOrders(o); setStores(s);
      const map: Record<string, Address[]> = {};
      for (const order of o) map[order.customer_id] = await getAddresses(order.customer_id);
      setAddresses(map);
    })();
  }, []);
  const accept = async (id: string) => {
    if (!user) return;
    await assignOrderToDriver(id, user.id);
    setOrders(orders.filter(o => o.id !== id));
    push("تم قبول الطلب ✅", "success");
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الطلبات الجديدة</h1>
      {orders.length === 0 ? <div className="mt-6"><EmptyState icon="🛵" title="لا توجد طلبات متاحة"/></div> : <div className="mt-6 space-y-3">
        {orders.map(o => {
          const store = stores.find(s => s.id === o.store_id);
          const addr = addresses[o.customer_id]?.find(a => a.id === o.address_id);
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex justify-between flex-wrap gap-3">
                <div>
                  <p className="font-extrabold">{o.order_number}</p>
                  <p className="text-sm text-gray-600 mt-1">من: {store?.name}</p>
                  {addr && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {addr.neighborhood}, {addr.city}</p>}
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(o.created_at)}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">أجرك المتوقع</p>
                  <p className="font-extrabold text-green-700 text-lg">{formatCurrency(o.driver_due)}</p>
                  <button onClick={()=>accept(o.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm mt-2">قبول الطلب</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}