import { useEffect, useState } from "react";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getMerchantStore, getStoreOrders, updateOrderStatus } from "../../lib/db";
import { formatCurrency, formatDateTime } from "../../lib/format";
import { ORDER_STATUS } from "../../lib/constants";
import type { Store, Order, OrderStatus } from "../../types";
export default function Orders() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [items, setItems] = useState<Order[]>([]);
  const { push } = useToast();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      setStore(s);
      if (s) setItems(await getStoreOrders(s.id));
    })();
  }, [user]);
  const update = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status, user?.id);
    setItems(items.map(o => o.id === id ? { ...o, status } : o));
    push("تم تحديث حالة الطلب", "success");
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">الطلبات</h1>
      <p className="text-gray-500 mt-1">إدارة طلبات {store?.name}</p>
      <div className="mt-6 space-y-3">
        {items.map(o => {
          const next = nextStatus(o.status);
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-extrabold">{o.order_number}</p><p className="text-xs text-gray-500 mt-1">{formatDateTime(o.created_at)}</p></div>
                <OrderStatusBadge status={o.status}/>
                <p className="font-extrabold text-green-700">{formatCurrency(o.total_amount)}</p>
                {next && <button onClick={()=>update(o.id, next)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">→ {ORDER_STATUS[next].label}</button>}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center text-gray-500 py-8">لا توجد طلبات</p>}
      </div>
    </div>
  );
}
function nextStatus(s: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = ["pending","accepted","preparing","ready_for_pickup"];
  const i = flow.indexOf(s);
  return i >= 0 && i < flow.length - 1 ? flow[i+1] : null;
}