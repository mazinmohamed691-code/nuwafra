import type { Store, Product, Order, User, Address, Category, Notification } from "../types";
export const demoUsers: User[] = [
  { id: "u-cust-1", email: "customer@nuwafra.demo", full_name: "أحمد العميل", role: "customer", phone: "+249900000001" },
  { id: "u-merch-1", email: "merchant@nuwafra.demo", full_name: "متجر التوفير", role: "merchant", phone: "+249900000002" },
  { id: "u-merch-2", email: "merchant2@nuwafra.demo", full_name: "مطعم الشرق", role: "merchant", phone: "+249900000003" },
  { id: "u-driver-1", email: "driver@nuwafra.demo", full_name: "محمد السائق", role: "driver", phone: "+249900000004" },
  { id: "u-admin-1", email: "admin@nuwafra.demo", full_name: "مدير المنصة", role: "admin", phone: "+249900000005" }
];
export const demoStores: Store[] = [
  { id: "s-1", owner_id: "u-merch-1", name: "متجر التوفير", description: "بقالة شاملة ومواد غذائية طازجة", type: "store", state: "الخرطوم", city: "الخرطوم", rating: 4.8, delivery_fee: 1500, min_order: 5000, is_active: true, commission_rate: 8 },
  { id: "s-2", owner_id: "u-merch-2", name: "مطعم الشرق", description: "أشهى الأطباق السودانية والعربية", type: "restaurant", state: "الخرطوم", city: "أم درمان", rating: 4.6, delivery_fee: 2000, min_order: 8000, is_active: true, commission_rate: 10 },
  { id: "s-3", owner_id: "u-merch-1", name: "صيدلية النيل", description: "أدوية ومستلزمات طبية معتمدة", type: "store", state: "الخرطوم", city: "بحري", rating: 4.9, delivery_fee: 1200, min_order: 0, is_active: true, commission_rate: 6 },
  { id: "s-4", owner_id: "u-merch-2", name: "مطعم البيت الدمشقي", description: "مأكولات شامية أصيلة", type: "restaurant", state: "الخرطوم", city: "الخرطوم", rating: 4.7, delivery_fee: 1800, min_order: 10000, is_active: true, commission_rate: 10 },
  { id: "s-5", owner_id: "u-merch-1", name: "سوبر ماركت الأسرة", description: "كل احتياجات الأسرة", type: "store", state: "الجزيرة", city: "ود مدني", rating: 4.5, delivery_fee: 2500, min_order: 3000, is_active: true, commission_rate: 8 }
];
export const demoCategories: Category[] = [
  { id: "c-1", name: "بقالة", icon: "🛒", type: "store", sort_order: 1 },
  { id: "c-2", name: "مطاعم", icon: "🍽️", type: "store", sort_order: 2 },
  { id: "c-3", name: "صيدليات", icon: "💊", type: "store", sort_order: 3 },
  { id: "c-4", name: "خضروات", icon: "🥬", type: "product", sort_order: 4 },
  { id: "c-5", name: "فواكه", icon: "🍎", type: "product", sort_order: 5 },
  { id: "c-6", name: "مشروبات", icon: "🥤", type: "product", sort_order: 6 },
  { id: "c-7", name: "لحوم", icon: "🥩", type: "product", sort_order: 7 },
  { id: "c-8", name: "منظفات", icon: "🧴", type: "product", sort_order: 8 }
];
const img = (s: string) => `https://images.unsplash.com/${s}?auto=format&fit=crop&w=400&h=400&q=70`;
export const demoProducts: Product[] = [
  { id: "p-1", store_id: "s-1", category_id: "c-4", name: "طماطم طازجة 1كجم", price: 2500, image_url: img("photo-1592924357228-91a4daadcfea"), stock: 100, is_active: true, is_featured: true },
  { id: "p-2", store_id: "s-1", category_id: "c-5", name: "موز 1كجم", price: 3000, image_url: img("photo-1571771894821-ce9b6c11b08e"), stock: 80, is_active: true, is_featured: true },
  { id: "p-3", store_id: "s-1", category_id: "c-6", name: "عصير برتقال 1L", price: 1800, image_url: img("photo-1600271886742-f049cd451bba"), stock: 50, is_active: true },
  { id: "p-4", store_id: "s-1", category_id: "c-8", name: "منظف أرضيات 2L", price: 4500, discount_price: 3999, image_url: img("photo-1585421514738-01798e348b17"), stock: 30, is_active: true, is_featured: true },
  { id: "p-5", store_id: "s-1", category_id: "c-4", name: "بصل 1كجم", price: 1500, image_url: img("photo-1518977956812-cd3dbadaaf31"), stock: 120, is_active: true },
  { id: "p-6", store_id: "s-1", category_id: "c-7", name: "لحم بقري 1كجم", price: 15000, image_url: img("photo-1603048297172-c92544798d5a"), stock: 20, is_active: true, is_featured: true },
  { id: "p-7", store_id: "s-2", category_id: "c-2", name: "كسرة سودانية باللحم", price: 8500, image_url: img("photo-1546069901-ba9599a7e63c"), stock: 50, is_active: true, is_featured: true },
  { id: "p-8", store_id: "s-2", category_id: "c-2", name: "شية مشوية", price: 12000, image_url: img("photo-1544025162-d76694265947"), stock: 40, is_active: true, is_featured: true },
  { id: "p-9", store_id: "s-2", category_id: "c-2", name: "مشويات مشكلة", price: 18000, discount_price: 15999, image_url: img("photo-1529692236671-f1f6cf9683ba"), stock: 30, is_active: true, is_featured: true },
  { id: "p-10", store_id: "s-2", category_id: "c-2", name: "عصير ليمون بالنعناع", price: 2500, image_url: img("photo-1622597467836-f3285f2131b8"), stock: 100, is_active: true },
  { id: "p-11", store_id: "s-3", category_id: "c-3", name: "باراسيتامول 500mg", price: 800, image_url: img("photo-1584308666744-24d5c474f2ae"), stock: 200, is_active: true },
  { id: "p-12", store_id: "s-3", category_id: "c-3", name: "كمامات طبية 50 حبة", price: 3500, image_url: img("photo-1584634731339-252c581abfc5"), stock: 100, is_active: true, is_featured: true },
  { id: "p-13", store_id: "s-4", category_id: "c-2", name: "شاورما دجاج", price: 6500, image_url: img("photo-1561651823-34feb02250e4"), stock: 60, is_active: true, is_featured: true },
  { id: "p-14", store_id: "s-4", category_id: "c-2", name: "فلافل (10 حبات)", price: 3000, image_url: img("photo-1593001874117-c99c800e3eb1"), stock: 80, is_active: true },
  { id: "p-15", store_id: "s-5", category_id: "c-1", name: "أرز بسمتي 5كجم", price: 9000, image_url: img("photo-1586201375761-83865001e31c"), stock: 40, is_active: true, is_featured: true },
  { id: "p-16", store_id: "s-5", category_id: "c-1", name: "زيت طهي 3L", price: 7500, image_url: img("photo-1474979266404-7eaacbcd87c5"), stock: 60, is_active: true }
];
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
export const demoOrders: Order[] = [
  { id: "o-1", order_number: "NF-20240001", customer_id: "u-cust-1", store_id: "s-1", driver_id: "u-driver-1", status: "delivered", product_total: 20000, delivery_fee: 1500, platform_commission: 1600, discount: 0, merchant_due: 18400, driver_due: 1500, total_amount: 21500, payment_method: "cash", settlement_status: "settled", created_at: daysAgo(5) },
  { id: "o-2", order_number: "NF-20240002", customer_id: "u-cust-1", store_id: "s-2", driver_id: "u-driver-1", status: "on_the_way", product_total: 28500, delivery_fee: 2000, platform_commission: 2850, discount: 0, merchant_due: 25650, driver_due: 2000, total_amount: 30500, payment_method: "cash", settlement_status: "pending", created_at: daysAgo(1) },
  { id: "o-3", order_number: "NF-20240003", customer_id: "u-cust-1", store_id: "s-1", status: "pending", product_total: 8000, delivery_fee: 1500, platform_commission: 640, discount: 0, merchant_due: 7360, driver_due: 1500, total_amount: 9500, payment_method: "cash", settlement_status: "pending", created_at: daysAgo(0) },
  { id: "o-4", order_number: "NF-20240004", customer_id: "u-cust-1", store_id: "s-4", driver_id: "u-driver-1", status: "preparing", product_total: 12500, delivery_fee: 1800, platform_commission: 1250, discount: 500, merchant_due: 11250, driver_due: 1800, total_amount: 13800, payment_method: "demo", settlement_status: "pending", created_at: daysAgo(0) },
  { id: "o-5", order_number: "NF-20240005", customer_id: "u-cust-1", store_id: "s-2", status: "ready_for_pickup", product_total: 16500, delivery_fee: 2000, platform_commission: 1650, discount: 0, merchant_due: 14850, driver_due: 2000, total_amount: 18500, payment_method: "cash", settlement_status: "pending", created_at: daysAgo(0) }
];
export const demoAddresses: Address[] = [
  { id: "a-1", user_id: "u-cust-1", label: "المنزل", state: "الخرطوم", city: "الخرطوم", neighborhood: "الرياض", street: "شارع 15", landmark: "بجوار مسجد الرياض", phone: "+249900000001", is_default: true },
  { id: "a-2", user_id: "u-cust-1", label: "العمل", state: "الخرطوم", city: "بحري", neighborhood: "الكلاكلة", street: "شارع الجامعة", landmark: "مقابل مستشفى الشعب", phone: "+249900000001" }
];
export const demoNotifications: Notification[] = [
  { id: "n-1", user_id: "u-cust-1", title: "تم توصيل طلبك بنجاح", body: "الطلب NF-20240001 تم توصيله", type: "success", is_read: false, link: "/customer/orders", created_at: daysAgo(5) },
  { id: "n-2", user_id: "u-cust-1", title: "طلبك في الطريق", body: "طلبك NF-20240002 في الطريق إليك", type: "info", is_read: false, link: "/customer/track/o-2", created_at: daysAgo(0) },
  { id: "n-3", user_id: "u-cust-1", title: "عرض خاص", body: "خصم 15% على المنتجات الطازجة", type: "promo", is_read: true, created_at: daysAgo(2) }
];
export const demoStats = { totalStores: 5, totalProducts: 16, totalCustomers: 128, totalOrders: 342, totalDrivers: 24, totalRevenue: 4250000, platformCommission: 340000, deliveryFees: 512000, avgOrderValue: 18500 };