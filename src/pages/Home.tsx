import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Store, Truck, ShieldCheck, Users, CheckCircle2, Search, ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";
import StoreCard from "../components/StoreCard";
import ProductCard from "../components/ProductCard";
import AnimatedBackground from "../components/AnimatedBackground";
import { demoStores, demoProducts, demoCategories, demoStats } from "../lib/demoData";
import { formatCurrency } from "../lib/format";
export default function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const featuredStores = demoStores.slice(0, 4);
  const featuredProducts = demoProducts.filter(p => p.is_featured).slice(0, 8);
  return (
    <div>
      <section className="relative bg-gradient-to-bl from-green-50 via-white to-yellow-50 border-b border-gray-100 overflow-hidden">
        <AnimatedBackground intensity="strong" grid gold />
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mb-4">منصة سودانية 🇸🇩</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">كل الدايرة.. <span className="text-green-600">نوفرها</span></h1>
            <p className="text-gray-600 mt-4 text-base md:text-lg leading-relaxed">منصة رقمية واحدة تجمع المتاجر والمطاعم والعملاء والسائقين والإدارة، لتمنحك تجربة تسوق متكاملة من مكان واحد.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/stores" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700"><ShoppingBag size={18}/> جرّب المنصة</Link>
              <Link to="/register" className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-green-50">انضم كتاجر</Link>
            </div>
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter" && nav(`/stores?q=${q}`)} placeholder="ابحث عن متجر، مطعم، أو منتج..." className="w-full px-4 py-4 pr-12 rounded-xl border border-gray-200 focus:border-green-500 outline-none shadow-sm"/>
            </div>
          </div>
          <div className="flex justify-center"><div className="bg-white rounded-3xl shadow-xl p-8 md:p-12"><Logo size="xl" /></div></div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="متجر ومطعم" value={demoStats.totalStores} />
          <StatBox label="منتج متوفر" value={demoStats.totalProducts} />
          <StatBox label="عميل مسجل" value={demoStats.totalCustomers} />
          <StatBox label="طلب مكتمل" value={demoStats.totalOrders} />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">تصنيفات</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {demoCategories.map(c => (
            <Link key={c.id} to={`/stores?category=${c.id}`} className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="text-xs font-bold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">متاجر ومطاعم مميزة</h2>
          <Link to="/stores" className="text-green-700 font-semibold text-sm flex items-center gap-1">عرض الكل <ArrowLeft size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{featuredStores.map(s => <StoreCard key={s.id} store={s} />)}</div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">منتجات وعروض</h2>
          <Link to="/stores" className="text-green-700 font-semibold text-sm flex items-center gap-1">عرض الكل <ArrowLeft size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map(p => {
            const store = demoStores.find(s => s.id === p.store_id);
            return <ProductCard key={p.id} product={p} storeName={store?.name}/>;
          })}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 text-center">كيف تعمل المنصة؟</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <HowCard icon={<Users />} title="العميل" text="يتصفح المتاجر والمنتجات، يضيف للسلة، يطلب ويتابع حالته لحظة بلحظة." />
          <HowCard icon={<Store />} title="التاجر" text="يدير المنتجات والطلبات والمبيعات وأرصدته المستحقة من لوحة تحكم بسيطة." />
          <HowCard icon={<Truck />} title="السائق" text="يستعرض الطلبات المتاحة، يقبلها، ويحدّث حالة التوصيل خطوة بخطوة." />
          <HowCard icon={<ShieldCheck />} title="الإدارة" text="تشرف على العملاء والمتاجر والسائقين والعمولات والأرصدة والتقارير." />
        </div>
      </section>
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">نموذج الإيرادات</h2>
            <p className="text-gray-300 leading-relaxed">تعتمد المنصة على عمولة على كل طلب (قابلة للتعديل من الإدارة)، بالإضافة إلى رسوم التوصيل.</p>
            <ul className="mt-5 space-y-2 text-gray-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={18}/> عمولة 8% افتراضية (قابلة للتعديل)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={18}/> رسوم توصيل متغيّرة حسب الولاية</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-yellow-400" size={18}/> إمكانية إضافة اشتراكات مستقبلاً</li>
            </ul>
          </div>
          <div className="bg-white text-gray-900 rounded-2xl p-6">
            <p className="text-sm font-semibold text-gray-500">مثال توضيحي</p>
            <div className="mt-3 space-y-2 text-sm">
              <Row label="قيمة المنتجات" value={formatCurrency(20000)} />
              <Row label="عمولة المنصة (8%)" value={formatCurrency(1600)} />
              <Row label="رسوم التوصيل" value={formatCurrency(1500)} />
              <div className="border-t border-gray-200 pt-2">
                <Row label="مستحق التاجر" value={formatCurrency(18400)} bold />
                <Row label="مستحق السائق" value={formatCurrency(1500)} bold />
                <Row label="الإجمالي على العميل" value={formatCurrency(21500)} bold />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-14 text-center">
        <div className="bg-gradient-to-bl from-green-600 to-green-700 text-white rounded-2xl p-10">
          <h2 className="text-2xl md:text-4xl font-extrabold">جاهز تجرب المنصة؟</h2>
          <p className="mt-3 text-green-50 max-w-2xl mx-auto">سجّل دخولك بحساب تجريبي واستكشف المنصة كعميل أو تاجر أو سائق أو مدير.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/login" className="bg-white text-green-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-green-50">جرّب المنصة</Link>
            <Link to="/register" className="border-2 border-white text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-white/10">أنشئ حسابك</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
function StatBox({ label, value }: { label: string; value: number | string }) {
  return <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center"><p className="text-2xl md:text-3xl font-extrabold text-green-700">{value}</p><p className="text-xs md:text-sm text-gray-500 mt-1">{label}</p></div>;
}
function HowCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="bg-white rounded-2xl border border-gray-100 p-5"><div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-3">{icon}</div><h3 className="font-bold mb-1">{title}</h3><p className="text-sm text-gray-600 leading-relaxed">{text}</p></div>;
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className="flex justify-between"><span className={bold ? "font-bold" : "text-gray-600"}>{label}</span><span className={bold ? "font-extrabold text-green-700" : ""}>{value}</span></div>;
}