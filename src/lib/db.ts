import { supabase, isSupabaseConfigured } from "./supabase";
import { demoStores, demoProducts, demoOrders, demoCategories, demoUsers, demoAddresses, demoNotifications } from "./demoData";
import type { Store, Product, Order, Category, User, Address, Notification, OrderItem } from "../types";

const USE_DB = isSupabaseConfigured;

export async function getStores(filters?: { type?: "store" | "restaurant"; q?: string }): Promise<Store[]> {
  if (!USE_DB) return demoStores.filter(s => { if (filters?.type && s.type !== filters.type) return false; if (filters?.q && !s.name.includes(filters.q)) return false; return true; });
  let q = supabase!.from("stores").select("*").eq("is_active", true);
  if (filters?.type) q = q.eq("type", filters.type);
  if (filters?.q) q = q.ilike("name", `%${filters.q}%`);
  const { data } = await q;
  return (data || []) as Store[];
}

export async function getStore(id: string): Promise<Store | null> {
  if (!USE_DB) return demoStores.find(s => s.id === id) || null;
  const { data } = await supabase!.from("stores").select("*").eq("id", id).single();
  return (data as Store) || null;
}

export async function getMerchantStore(ownerId: string): Promise<Store | null> {
  console.log('🔍 [getMerchantStore]');
  console.log('   USE_DB:', USE_DB);
  console.log('   ownerId:', ownerId);

  if (!USE_DB) {
    console.log('⚠️  Fallback to DEMO mode');
    return demoStores.find(s => s.owner_id === ownerId) || demoStores[0];
  }

  try {
    const { data, error } = await supabase!
      .from("stores")
      .select("*")
      .eq("owner_id", ownerId)
      .limit(1);

    console.log('   📦 data:', data);
    console.log('   ❌ error:', error);

    if (error) {
      console.error('   → Supabase error:', error.message, error.code);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn('   → No store found');
      return null;
    }

    console.log('   ✅ Found store:', data[0]);
    return (data[0] as Store) || null;
  } catch (e) {
    console.error('   → Exception:', e);
    return null;
  }
}

export async function getProducts(filters?: { storeId?: string; categoryId?: string; q?: string; featured?: boolean; }): Promise<Product[]> {
  if (!USE_DB) return demoProducts.filter(p => { if (filters?.storeId && p.store_id !== filters.storeId) return false; if (filters?.categoryId && p.category_id !== filters.categoryId) return false; if (filters?.q && !p.name.includes(filters.q)) return false; if (filters?.featured && !p.is_featured) return false; return true; });
  let q = supabase!.from("products").select("*").eq("is_active", true);
  if (filters?.storeId) q = q.eq("store_id", filters.storeId);
  if (filters?.categoryId) q = q.eq("category_id", filters.categoryId);
  if (filters?.q) q = q.ilike("name", `%${filters.q}%`);
  if (filters?.featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return (data || []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!USE_DB) return demoProducts.find(p => p.id === id) || null;
  const { data } = await supabase!.from("products").select("*").eq("id", id).single();
  return (data as Product) || null;
}

export async function createProduct(p: Omit<Product, "id">): Promise<Product | null> {
  if (!USE_DB) return { ...p, id: "p-" + Date.now() } as Product;
  const { data } = await supabase!.from("products").insert(p).select().single();
  return (data as Product) || null;
}

export async function updateProduct(id: string, p: Partial<Product>): Promise<void> {
  if (!USE_DB) return;
  await supabase!.from("products").update(p).eq("id", id);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!USE_DB) return;
  await supabase!.from("products").delete().eq("id", id);
}

export async function getCategories(type?: "store" | "product"): Promise<Category[]> {
  if (!USE_DB) return demoCategories.filter(c => !type || c.type === type);
  let q = supabase!.from("categories").select("*").eq("is_active", true);
  if (type) q = q.eq("type", type);
  const { data } = await q.order("sort_order");
  return (data || []) as Category[];
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_orders");
    const local: Order[] = raw ? JSON.parse(raw) : [];
    const mine = local.filter(o => o.customer_id === customerId);
    return [...mine, ...demoOrders.filter(o => o.customer_id === customerId)];
  }
  const { data } = await supabase!.from("orders").select("*").eq("customer_id", customerId).order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function getStoreOrders(storeId: string): Promise<Order[]> {
  if (!USE_DB) return demoOrders.filter(o => o.store_id === storeId);
  const { data } = await supabase!.from("orders").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function getDriverOrders(driverId: string): Promise<Order[]> {
  if (!USE_DB) return demoOrders.filter(o => o.driver_id === driverId);
  const { data } = await supabase!.from("orders").select("*").eq("driver_id", driverId).order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function getAvailableOrders(): Promise<Order[]> {
  if (!USE_DB) return demoOrders.filter(o => !o.driver_id && o.status !== "delivered" && o.status !== "cancelled");
  const { data } = await supabase!.from("orders").select("*").is("driver_id", null).in("status", ["pending","accepted","preparing","ready_for_pickup"]);
  return (data || []) as Order[];
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_orders");
    const local: Order[] = raw ? JSON.parse(raw) : [];
    return local.find(o => o.id === id) || demoOrders.find(o => o.id === id) || null;
  }
  const { data } = await supabase!.from("orders").select("*").eq("id", id).single();
  return (data as Order) || null;
}

export async function createOrder(order: Omit<Order, "id" | "created_at">, items: Omit<OrderItem, "id" | "order_id">[]): Promise<Order | null> {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_orders");
    const arr = raw ? JSON.parse(raw) : [];
    const newOrder = { ...order, id: "o-" + Date.now(), created_at: new Date().toISOString() } as Order;
    arr.unshift(newOrder);
    localStorage.setItem("nuwafra_orders", JSON.stringify(arr));
    return newOrder;
  }
  const { data, error } = await supabase!.from("orders").insert(order).select().single();
  if (error) throw error;
  const orderId = data.id;
  if (items.length) await supabase!.from("order_items").insert(items.map(it => ({ ...it, order_id: orderId })));
  await supabase!.from("order_status_history").insert({ order_id: orderId, status: order.status, note: "تم إنشاء الطلب" });
  return data as Order;
}

export async function updateOrderStatus(orderId: string, status: string, changedBy?: string) {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_orders");
    const arr = raw ? JSON.parse(raw) : [];
    const i = arr.findIndex((o: Order) => o.id === orderId);
    if (i >= 0) { arr[i].status = status; localStorage.setItem("nuwafra_orders", JSON.stringify(arr)); }
    return;
  }
  await supabase!.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  await supabase!.from("order_status_history").insert({ order_id: orderId, status, changed_by: changedBy });
}

export async function assignOrderToDriver(orderId: string, driverId: string) {
  if (!USE_DB) return;
  await supabase!.from("orders").update({ driver_id: driverId, status: "assigned_to_driver", updated_at: new Date().toISOString() }).eq("id", orderId);
}

export async function getAddresses(userId: string): Promise<Address[]> {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_addresses");
    const local: Address[] = raw ? JSON.parse(raw) : [];
    return [...local.filter(a => a.user_id === userId), ...demoAddresses.filter(a => a.user_id === userId)];
  }
  const { data } = await supabase!.from("addresses").select("*").eq("user_id", userId);
  return (data || []) as Address[];
}

export async function saveAddress(a: Omit<Address, "id"> & { id?: string }): Promise<Address | null> {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_addresses");
    const arr: Address[] = raw ? JSON.parse(raw) : [];
    if (a.id) { const i = arr.findIndex(x => x.id === a.id); if (i >= 0) arr[i] = a as Address; }
    else arr.push({ ...a, id: "a-" + Date.now() } as Address);
    localStorage.setItem("nuwafra_addresses", JSON.stringify(arr));
    return { ...a, id: a.id || "a-" + Date.now() } as Address;
  }
  const { data } = await supabase!.from("addresses").upsert(a).select().single();
  return (data as Address) || null;
}

export async function deleteAddress(id: string) {
  if (!USE_DB) {
    const raw = localStorage.getItem("nuwafra_addresses");
    const arr: Address[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem("nuwafra_addresses", JSON.stringify(arr.filter(a => a.id !== id)));
    return;
  }
  await supabase!.from("addresses").delete().eq("id", id);
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (!USE_DB) return demoNotifications.filter(n => n.user_id === userId);
  const { data } = await supabase!.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return (data || []) as Notification[];
}

export async function markNotificationsRead(userId: string) {
  if (!USE_DB) return;
  await supabase!.from("notifications").update({ is_read: true }).eq("user_id", userId);
}

export async function getAllUsers(): Promise<User[]> {
  if (!USE_DB) return demoUsers;
  const { data } = await supabase!.from("users").select("*");
  return (data || []) as User[];
}