import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Minus, Plus, ArrowRight } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import { getProduct, getStore } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import type { Product, Store } from "../../types";
export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { push } = useToast();
  useEffect(() => {
    if (!id) return;
    getProduct(id).then(async p => {
      setProduct(p);
      if (p) setStore(await getStore(p.store_id));
      setLoading(false);
    });
  }, [id]);
  if (loading) return <Loading/>;
  if (!product) return <div className="max-w-3xl mx-auto px-4 py-8"><EmptyState title="المنتج غير موجود"/></div>;
  const price = product.discount_price || product.price;
  const handleAdd = () => {
    for (let i = 0; i < qty; i++) add(product, store?.name || "متجر");
    push(`تمت إضافة ${qty} من ${product.name}`, "success");
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={()=>nav(-1)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 mb-4"><ArrowRight size={16}/> رجوع</button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square bg-gray-100">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-6xl">🛒</div>}
        </div>
        <div>
          <p className="text-sm text-gray-500">{store?.name}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2"><Star size={16} className="text-yellow-500 fill-yellow-500"/><span className="text-sm font-semibold">4.5</span></div>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description || `منتج عالي الجودة من ${store?.name}`}</p>
          <div className="mt-6 flex items-end gap-3">
            {product.discount_price ? <><p className="text-3xl font-extrabold text-green-700">{formatCurrency(product.discount_price)}</p><p className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</p></> : <p className="text-3xl font-extrabold text-green-700">{formatCurrency(product.price)}</p>}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">الكمية:</span>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-2 py-1">
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="p-2 hover:bg-gray-100 rounded-lg"><Minus size={16}/></button>
              <span className="font-bold w-8 text-center">{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} className="p-2 hover:bg-gray-100 rounded-lg"><Plus size={16}/></button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleAdd} className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 flex-1 min-w-[150px]"><ShoppingCart size={18}/> أضف للسلة</button>
            <button onClick={()=>{ handleAdd(); nav("/customer/cart"); }} className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-green-50 flex-1 min-w-[150px]">اشترِ الآن</button>
          </div>
        </div>
      </div>
    </div>
  );
}