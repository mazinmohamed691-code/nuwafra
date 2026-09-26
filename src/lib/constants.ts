export const APP_NAME = "نوفرها";
export const APP_NAME_EN = "NUWAFRA";
export const CURRENCY = "SDG";
export const SLOGAN = "كل الدايرة.. نوفرها";
export const ORDER_STATUS: Record<string, { label: string; color: string; step: number }> = {
  pending: { label: "قيد الانتظار", color: "bg-gray-100 text-gray-700", step: 0 },
  accepted: { label: "تم القبول", color: "bg-blue-100 text-blue-700", step: 1 },
  preparing: { label: "قيد التحضير", color: "bg-amber-100 text-amber-700", step: 2 },
  ready_for_pickup: { label: "جاهز للاستلام", color: "bg-indigo-100 text-indigo-700", step: 3 },
  assigned_to_driver: { label: "أُسند لسائق", color: "bg-purple-100 text-purple-700", step: 4 },
  picked_up: { label: "تم الاستلام", color: "bg-cyan-100 text-cyan-700", step: 5 },
  on_the_way: { label: "في الطريق", color: "bg-yellow-100 text-yellow-700", step: 6 },
  delivered: { label: "تم التوصيل", color: "bg-green-100 text-green-700", step: 7 },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-700", step: -1 }
};
export const SUDAN_STATES = ["الخرطوم","الجزيرة","البحر الأحمر","كسلا","القضارف","سنار","النيل الأزرق","النيل الأبيض","شمال كردفان","جنوب كردفان","غرب كردفان","شمال دارفور","جنوب دارفور","غرب دارفور","شرق دارفور","وسط دارفور","نهر النيل","الشمالية"];
export const DEMO_ACCOUNTS = [
  { role: "customer", label: "عميل", email: "customer@nuwafra.demo", password: "demo1234", icon: "👤", color: "bg-green-600" },
  { role: "merchant", label: "تاجر", email: "merchant@nuwafra.demo", password: "demo1234", icon: "🏪", color: "bg-yellow-500" },
  { role: "driver", label: "سائق", email: "driver@nuwafra.demo", password: "demo1234", icon: "🛵", color: "bg-gray-800" },
  { role: "admin", label: "الإدارة", email: "admin@nuwafra.demo", password: "demo1234", icon: "⚙️", color: "bg-red-600" }
] as const;