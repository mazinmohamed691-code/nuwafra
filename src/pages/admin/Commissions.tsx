import { useEffect, useState } from "react";
import { Percent } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useToast } from "../../context/ToastContext";
import { demoStats } from "../../lib/demoData";
import { formatCurrency } from "../../lib/format";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
export default function Commissions() {
  const [rate, setRate] = useState(8);
  const { push } = useToast();
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.from("settings").select("value").eq("key","default_commission_rate").single().then(({ data }) => { if (data) setRate(Number(data.value)); });
    }
  }, []);
  const save = async () => {
    if (isSupabaseConfigured && supabase) await supabase.from("settings").upsert({ key: "default_commission_rate", value: String(rate) });
    push("تم حفظ النسبة", "success");
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">العمولات</h1>
      <p className="text-gray-500 mt-1">تحكم في نسبة العمولة الافتراضية</p>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard title="النسبة الحالية" value={`${rate}%`} icon={<Percent/>} color="gold"/>
        <StatCard title="إجمالي العمولات" value={formatCurrency(demoStats.platformCommission)} color="red"/>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-bold mb-3">تعديل النسبة</h2>
        <div className="flex items-end gap-3">
          <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 mb-1.5">النسبة (%)</label><input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))} min={0} max={50} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-sm"/></div>
          <button onClick={save} className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700">حفظ</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">تُخزَّن النسبة في جدول settings في Supabase.</p>
      </div>
    </div>
  );
}