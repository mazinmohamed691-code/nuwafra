import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Package, ChefHat, Bike, Home } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { getOrder } from "../../lib/db";
import { ORDER_STATUS } from "../../lib/constants";
import type { Order, OrderStatus } from "../../types";
const STEPS: OrderStatus[] = ["pending","accepted","preparing","ready_for_pickup","assigned_to_driver","picked_up","on_the_way","delivered"];
const ICONS: Record<string, React.ReactNode> = {
  pending: <Package size={18}/>, accepted: <CheckCircle2 size={18}/>, preparing: <ChefHat size={18}/>,
  ready_for_pickup: <Package size={18}/>, assigned_to_driver: <Bike size={18}/>, picked_up: <Bike size={18}/>,
  on_the_way: <Bike size={18}/>, delivered: <Home size={18}/>
};
export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    getOrder(id).then(o => { setOrder(o); setLoading(false); });
  }, [id]);
  if (loading) return <Loading/>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-8"><EmptyState title="الطلب غير موجود"/></div>;
  const currentStep = ORDER_STATUS[order.status].step;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/customer/orders/${order.id}`} className="text-green-700 text-sm font-semibold">← تفاصيل الطلب</Link>
      <h1 className="text-2xl font-extrabold mt-4">تتبع الطلب {order.order_number}</h1>
      <p className="text-gray-500 mt-1">شاهد مراحل طلبك لحظة بلحظة</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const done = currentStep >= i;
            return (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>{done ? ICONS[s] : <Circle size={16}/>}</div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${done ? "text-gray-900" : "text-gray-400"}`}>{ORDER_STATUS[s].label}</p>
                  {done && i === currentStep && <p className="text-xs text-green-600 font-semibold mt-0.5">الحالة الحالية</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {order.status === "delivered" && <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mt-4"><p className="font-bold text-green-700">🎉 تم توصيل طلبك بنجاح</p><p className="text-sm text-gray-600 mt-1">شكراً لاستخدامك نوفرها</p></div>}
    </div>
  );
}