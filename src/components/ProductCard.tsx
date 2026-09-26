import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "../types";
import { formatCurrency } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
export default function ProductCard({ product, storeName = "" }: { product: Product; storeName?: string }) {
  const { add } = useCart();
  const { push } = useToast();
  const price = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🛒</div>}
          {hasDiscount && <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">خصم {Math.round(((product.price - product.discount_price!) / product.price) * 100)}%</span>}
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.id}`}><h3 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[40px]">{product.name}</h3></Link>
        {storeName && <p className="text-xs text-gray-500 mt-1 truncate">{storeName}</p>}
        <div className="flex items-center gap-1 mt-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span className="text-xs text-gray-500">4.5</span></div>
        <div className="flex items-end justify-between mt-2">
          <div>
            {hasDiscount ? <><p className="text-green-700 font-extrabold">{formatCurrency(product.discount_price!)}</p><p className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</p></> : <p className="text-green-700 font-extrabold">{formatCurrency(price)}</p>}
          </div>
          <button onClick={() => { add(product, storeName || "متجر"); push("تمت الإضافة للسلة", "success"); }} className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-700" aria-label="أضف"><ShoppingCart size={16} /></button>
        </div>
      </div>
    </div>
  );
}