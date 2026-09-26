import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Wallet, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getMerchantStore, getStoreOrders } from "../../lib/db";
import { formatCurrency } from "../../lib/format";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Order } from "../../types";

export default function WalletPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const s = await getMerchantStore(user.id);
      if (s) {
        setStoreId(s.id);
        setOrders(await getStoreOrders(s.id));
      }
    })();
  }, [user]);

  // الرصيد المتاح = الطلبات المُسلّمة
  const settled = orders
    .filter(o => o.status === "delivered")
    .reduce((s, o) => s + o.merchant_due, 0);

  // قيد التسوية = الطلبات قيد التنفيذ
  const pending = orders
    .filter(o => o.status !== "delivered" && o.status !== "cancelled")
    .reduce((s, o) => s + o.merchant_due, 0);

  const requestSettlement = async () => {
    if (!user || !storeId) {
      push("لا يمكن طلب تسوية الآن", "error");
      return;
    }

    if (settled <= 0) {
      push("لا يوجد رصيد متاح للتسوية حالياً", "error");
      return;
    }

    const confirmed = confirm(
      `هل تريد طلب تسوية بمبلغ ${formatCurrency(settled)}؟\n\nسيتم مراجعة الطلب من الإدارة.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("settlements").insert({
          party_type: "merchant",
          party_id: storeId,
          amount: settled,
          status: "pending",
          note: `طلب تسوية من ${user.full_name || user.email}`
        });
        if (error) throw error;

        await supabase.from("merchant_transactions").insert({
          store_id: storeId,
          type: "settlement",
          amount: -settled,
          description: "طلب تسوية جديد"
        });
      }

      const raw = localStorage.getItem("nuwafra_settlements");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({
        id: "st-" + Date.now(),
        store_id: storeId,
        amount: settled,
        status: "pending",
        created_at: new Date().toISOString()
      });
      localStorage.setItem("nuwafra_settlements", JSON.stringify(arr));

      push("✅ تم إرسال طلب التسوية بنجاح", "success");
    } catch (e: any) {
      console.error(e);
      push(e?.message || "فشل إرسال طلب التسوية", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">المحفظة والرصيد</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="الرصيد المتاح" value={formatCurrency(settled)} icon={<Wallet/>}/>
        <StatCard title="قيد التسوية" value={formatCurrency(pending)} icon={<Clock/>} color="gold"/>
        <StatCard title="إجمالي الأرباح" value={formatCurrency(settled + pending)} icon={<TrendingUp/>} color="ink"/>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-bold mb-3">طلب تسوية</h2>
        <p className="text-sm text-gray-600">
          يمكنك طلب تسوية الرصيد المتاح. سيتم مراجعة الطلب من الإدارة وإشعارك بالنتيجة.
        </p>
        <button
          onClick={requestSettlement}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "جاري الإرسال..." : "طلب تسوية"}
        </button>
      </div>
    </div>
  );
}