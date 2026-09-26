import { useEffect, useState } from "react";
import { getStores, getStoreOrders } from "../../lib/db";
import { formatCurrency, formatDateTime } from "../../lib/format";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import type { Store, Order } from "../../types";

interface Settlement {
  id: string;
  party_type: string;
  party_id: string;
  amount: number;
  status: string;
  note?: string;
  created_at: string;
}

export default function MerchantBalances() {
  const [rows, setRows] = useState<{ store: Store; due: number; commission: number; orders: number }[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const { push } = useToast();

  const loadSettlements = async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("settlements")
        .select("*")
        .eq("party_type", "merchant")
        .order("created_at", { ascending: false });
      setSettlements((data || []) as Settlement[]);
    } else {
      const raw = localStorage.getItem("nuwafra_settlements");
      setSettlements(raw ? JSON.parse(raw) : []);
    }
  };

  useEffect(() => {
    (async () => {
      const stores = await getStores();
      const result = [];
      for (const s of stores) {
        const orders: Order[] = await getStoreOrders(s.id);
        result.push({
          store: s,
          due: orders.reduce((sum,o)=>sum+o.merchant_due, 0),
          commission: orders.reduce((sum,o)=>sum+o.platform_commission, 0),
          orders: orders.length,
        });
      }
      setRows(result);
      await loadSettlements();
    })();
  }, []);

  const approve = async (s: Settlement) => {
    if (!confirm(`اعتماد تحويل ${formatCurrency(s.amount)}؟`)) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from("settlements").update({ status: "paid" }).eq("id", s.id);
    }
    setSettlements(prev => prev.map(x => x.id === s.id ? { ...x, status: "paid" } : x));
    push("✅ تم اعتماد التسوية", "success");
  };

  const reject = async (s: Settlement) => {
    if (!confirm(`رفض طلب التسوية بمبلغ ${formatCurrency(s.amount)}؟`)) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from("settlements").update({ status: "cancelled" }).eq("id", s.id);
    }
    setSettlements(prev => prev.map(x => x.id === s.id ? { ...x, status: "cancelled" } : x));
    push("تم رفض التسوية", "info");
  };

  const storeName = (id: string) => rows.find(r => r.store.id === id)?.store.name || id.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">أرصدة التجار والتسويات</h1>

      {/* قسم التسويات */}
      <div className="mt-6">
        <h2 className="text-xl font-extrabold mb-3">📋 طلبات التسوية</h2>
        {settlements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-500">
            لا توجد طلبات تسوية حالياً
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {settlements.map(s => (
              <div key={s.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[180px]">
                  <p className="font-bold">{storeName(s.party_id)}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.note || "طلب تسوية"}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(s.created_at)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">المبلغ</p>
                  <p className="font-extrabold text-green-700">{formatCurrency(s.amount)}</p>
                </div>
                <div className="text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    s.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    s.status === "paid" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {s.status === "pending" ? "قيد المراجعة" :
                     s.status === "paid" ? "معتمدة" : "مرفوضة"}
                  </span>
                </div>
                {s.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => approve(s)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700">
                      ✓ اعتماد
                    </button>
                    <button onClick={() => reject(s)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700">
                      ✕ رفض
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* قسم الأرصدة */}
      <div className="mt-8">
        <h2 className="text-xl font-extrabold mb-3">💰 أرصدة التجار</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-right p-3">المتجر</th>
                <th className="text-right p-3">الطلبات</th>
                <th className="text-right p-3">العمولات</th>
                <th className="text-right p-3">المستحق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => (
                <tr key={r.store.id}>
                  <td className="p-3 font-semibold">{r.store.name}</td>
                  <td className="p-3">{r.orders}</td>
                  <td className="p-3 text-red-600">{formatCurrency(r.commission)}</td>
                  <td className="p-3 font-bold text-green-700">{formatCurrency(r.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}