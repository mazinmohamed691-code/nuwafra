import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Banknote } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStore, getAddresses, createOrder } from "../../lib/db";
import { formatCurrency, genOrderNumber } from "../../lib/format";
import type { Address, Store, Order, OrderItem } from "../../types";
export default function Checkout() {
  const { items, total, clear, storeId } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const { push } = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState("");
  const [method, setMethod] = useState<"cash" | "demo">("cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user || !storeId) return;
    getStore(storeId).then(setStore);
    getAddresses(user.id).then(list => {
      setAddresses(list);
      if (list[0]) setAddressId(list[0].id);
    });
  }, [user, storeId]);
  if (items.length === 0) { nav("/customer/cart"); return null; }
  const delivery = store?.delivery_fee || 0;
  const commissionRate = store?.commission_rate || 8;
  const commission = Math.round(total * commissionRate) / 100;
  const merchantDue = total - commission;
  const grand = total + delivery;
  const placeOrder = async () => {
    if (!user || !storeId) return;
    if (!addressId) { push("اختر عنواناً للتوصيل", "error"); return; }
    setLoading(true);
    const orderData: Omit<Order, "id" | "created_at"> = {
      order_number: genOrderNumber(), customer_id: user.id, store_id: storeId, address_id: addressId, status: "pending",
      product_total: total, delivery_fee: delivery, platform_commission: commission, discount: 0,
      merchant_due: merchantDue, driver_due: delivery, total_amount: grand, payment_method: method,
      settlement_status: "pending", notes
    };
    const orderItems: Omit<OrderItem, "id" | "order_id">[] = items.map(i => ({
      product_id: i.product.id, product_name: i.product.name,
      unit_price: i.product.discount_price || i.product.price, quantity: i.quantity,
      subtotal: (i.product.discount_price || i.product.price) * i.quantity
    }));
    try {
      const created = await createOrder(orderData, orderItems);
      clear();
      push("تم إنشاء الطلب بنجاح 🎉", "success");
      if (created) nav(`/customer/orders/${created.id}`);
      else nav("/customer/orders");
    } catch (e: any) {
      push(e?.message || "فشل إنشاء الطلب", "error");
    } finally { setLoading(false); }
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-extrabold">إتمام الطلب</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold flex items-center gap-2 mb-4"><MapPin size={18}/> عنوان التوصيل</h2>
          {addresses.length === 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-3">لا توجد عناوين محفوظة</p>
              <button onClick={() => nav("/customer/addresses")} className="border-2 border-green-600 text-green-700 px-4 py-2.5 rounded-xl font-semibold text-sm">إضافة عنوان</button>
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map(a => (
                <label key={a.id} className={`block p-3 rounded-xl border-2 cursor-pointer ${addressId===a.id ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
                  <input type="radio" className="hidden" checked={addressId===a.id} onChange={()=>setAddressId(a.id)}/>
                  <p className="font-bold text-sm">{a.label} — {a.neighborhood}, {a.city}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.state} • {a.street} • {a.landmark}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.phone}</p>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold mb-4">طريقة الدفع</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className={`p-4 rounded-xl border-2 cursor-pointer text-center ${method==="cash" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
              <input type="radio" className="hidden" checked={method==="cash"} onChange={()=>setMethod("cash")}/>
              <Banknote className="mx-auto text-green-700" size={24}/>
              <p className="font-bold text-sm mt-2">الدفع عند الاستلام</p>
            </label>
            <label className={`p-4 rounded-xl border-2 cursor-pointer text-center ${method==="demo" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
              <input type="radio" className="hidden" checked={method==="demo"} onChange={()=>setMethod("demo")}/>
              <CreditCard className="mx-auto text-green-700" size={24}/>
              <p className="font-bold text-sm mt-2">دفع تجريبي</p>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold mb-3">ملاحظات للطلب (اختياري)</h2>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="مثال: بدون بصل..."/>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
          <h2 className="font-extrabold mb-4">ملخص نهائي</h2>
          <div className="space-y-2 text-sm">
            <div className="space-y-1 max-h-40 overflow-y-auto mb-3">
              {items.map(it => (
                <div key={it.product.id} className="flex justify-between text-xs text-gray-600"><span>{it.quantity}× {it.product.name}</span><span>{formatCurrency((it.product.discount_price || it.product.price) * it.quantity)}</span></div>
              ))}
            </div>
            <Row label="قيمة المنتجات" value={formatCurrency(total)}/>
            <Row label="رسوم التوصيل" value={formatCurrency(delivery)}/>
            <div className="border-t border-gray-100 pt-3"><Row label="الإجمالي" value={formatCurrency(grand)} bold/></div>
          </div>
          <button disabled={loading} onClick={placeOrder} className="w-full mt-5 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50">{loading ? "جاري الإنشاء..." : "تأكيد الطلب"}</button>
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className="flex justify-between"><span className={bold ? "font-bold" : "text-gray-600"}>{label}</span><span className={bold ? "font-extrabold text-green-700" : ""}>{value}</span></div>;
}