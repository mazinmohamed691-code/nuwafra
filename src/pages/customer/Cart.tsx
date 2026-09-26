import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../lib/format";
import { demoStores } from "../../lib/demoData";
export default function Cart() {
  const { items, setQty, remove, total, clear, storeId } = useCart();
  const nav = useNavigate();
  const { user } = useAuth();
  const store = demoStores.find(s => s.id === storeId);
  const delivery = store?.delivery_fee || 0;
  const grand = total + delivery;
  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-10"><EmptyState icon="🛒" title="سلتك فارغة" subtitle="ابدأ بإضافة منتجات من المتاجر" action={<Link to="/stores" className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold">تصفح المتاجر</Link>}/></div>;
  }
  const goCheckout = () => { if (!user) { nav("/login"); return; } nav("/customer/checkout"); };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold">سلة التسوق</h1>
          <button onClick={clear} className="text-red-600 text-sm font-semibold">إفراغ السلة</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {items.map(it => {
            const price = it.product.discount_price || it.product.price;
            return (
              <div key={it.product.id} className="flex gap-3 p-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {it.product.image_url ? <img src={it.product.image_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-3xl">🛒</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/product/${it.product.id}`} className="font-bold text-sm block truncate hover:text-green-700">{it.product.name}</Link>
                      <p className="text-xs text-gray-500">{it.store_name}</p>
                    </div>
                    <button onClick={()=>remove(it.product.id)} className="text-red-500 p-1"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-100 px-1 py-0.5">
                      <button onClick={()=>setQty(it.product.id, it.quantity-1)} className="p-1.5 hover:bg-gray-100 rounded"><Minus size={14}/></button>
                      <span className="font-bold w-6 text-center text-sm">{it.quantity}</span>
                      <button onClick={()=>setQty(it.product.id, it.quantity+1)} className="p-1.5 hover:bg-gray-100 rounded"><Plus size={14}/></button>
                    </div>
                    <p className="font-extrabold text-green-700">{formatCurrency(price * it.quantity)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
          <h2 className="font-extrabold mb-4">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <Row label="قيمة المنتجات" value={formatCurrency(total)}/>
            <Row label="رسوم التوصيل" value={formatCurrency(delivery)}/>
            <div className="border-t border-gray-100 pt-3"><Row label="الإجمالي" value={formatCurrency(grand)} bold/></div>
          </div>
          <button onClick={goCheckout} className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700"><ShoppingBag size={18}/> إتمام الطلب</button>
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className="flex justify-between"><span className={bold ? "font-bold" : "text-gray-600"}>{label}</span><span className={bold ? "font-extrabold text-green-700" : ""}>{value}</span></div>;
}