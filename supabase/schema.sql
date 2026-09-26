create extension if not exists "uuid-ossp";
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text, phone text,
  role text not null default 'customer' check (role in ('customer','merchant','driver','admin')),
  avatar_url text, is_active boolean default true,
  created_at timestamptz default now()
);
create table if not exists public.stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.users(id) on delete set null,
  name text not null, description text,
  type text not null default 'store' check (type in ('store','restaurant')),
  logo_url text, cover_url text, phone text, address text, state text, city text,
  is_active boolean default true, rating numeric(2,1) default 4.5,
  delivery_fee numeric(10,2) default 1000, min_order numeric(10,2) default 0,
  commission_rate numeric(5,2) default 8,
  created_at timestamptz default now()
);
create table if not exists public.drivers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  vehicle_type text default 'motorcycle', vehicle_plate text,
  is_available boolean default true, is_verified boolean default false,
  rating numeric(2,1) default 5.0, created_at timestamptz default now()
);
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null, icon text,
  type text default 'product' check (type in ('product','store')),
  sort_order int default 0, is_active boolean default true,
  created_at timestamptz default now()
);
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null, description text,
  price numeric(10,2) not null, discount_price numeric(10,2),
  image_url text, stock int default 100,
  is_active boolean default true, is_featured boolean default false,
  created_at timestamptz default now()
);
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  label text default 'المنزل',
  state text not null, city text not null,
  neighborhood text, street text, landmark text, extra_description text,
  phone text not null,
  gps_lat numeric(10,7), gps_lng numeric(10,7),
  is_default boolean default false,
  created_at timestamptz default now()
);
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid references public.users(id) on delete set null,
  store_id uuid references public.stores(id) on delete set null,
  driver_id uuid references public.users(id) on delete set null,
  address_id uuid references public.addresses(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','accepted','preparing','ready_for_pickup','assigned_to_driver','picked_up','on_the_way','delivered','cancelled')),
  product_total numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  platform_commission numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  merchant_due numeric(10,2) not null default 0,
  driver_due numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  payment_method text default 'cash' check (payment_method in ('cash','demo')),
  settlement_status text default 'pending' check (settlement_status in ('pending','settled','cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null, unit_price numeric(10,2) not null,
  quantity int not null default 1, subtotal numeric(10,2) not null,
  created_at timestamptz default now()
);
create table if not exists public.order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  status text not null, changed_by uuid references public.users(id) on delete set null,
  note text, created_at timestamptz default now()
);
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null, body text, type text default 'info',
  is_read boolean default false, link text,
  created_at timestamptz default now()
);
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  store_id uuid references public.stores(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating int check (rating between 1 and 5), comment text,
  created_at timestamptz default now()
);
create table if not exists public.settings (
  key text primary key, value text,
  updated_at timestamptz default now()
);
insert into public.settings(key, value) values
  ('default_commission_rate', '8'),
  ('default_delivery_fee', '1000'),
  ('platform_name', 'نوفرها'),
  ('platform_currency', 'SDG')
on conflict (key) do nothing;
create index if not exists idx_products_store on public.products(store_id);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_store on public.orders(store_id);
create index if not exists idx_orders_driver on public.orders(driver_id);
create index if not exists idx_orders_status on public.orders(status);
alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
drop policy if exists "users_read" on public.users;
create policy "users_read" on public.users for select using (true);
drop policy if exists "users_self_update" on public.users;
create policy "users_self_update" on public.users for update using (auth.uid() = id);
drop policy if exists "users_self_insert" on public.users;
create policy "users_self_insert" on public.users for insert with check (auth.uid() = id);
drop policy if exists "stores_read" on public.stores;
create policy "stores_read" on public.stores for select using (true);
drop policy if exists "stores_owner_write" on public.stores;
create policy "stores_owner_write" on public.stores for all using (auth.uid() = owner_id);
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products for select using (true);
drop policy if exists "products_owner_write" on public.products;
create policy "products_owner_write" on public.products for all using (exists(select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "orders_read" on public.orders;
create policy "orders_read" on public.orders for select using (auth.uid() = customer_id or auth.uid() = driver_id or exists(select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders for insert with check (auth.uid() = customer_id);
drop policy if exists "orders_update" on public.orders;
create policy "orders_update" on public.orders for update using (auth.uid() = customer_id or auth.uid() = driver_id or exists(select 1 from public.stores s where s.id = store_id and s.owner_id = auth.uid()));
drop policy if exists "order_items_read" on public.order_items;
create policy "order_items_read" on public.order_items for select using (true);
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items for insert with check (true);
drop policy if exists "addresses_owner" on public.addresses;
create policy "addresses_owner" on public.addresses for all using (auth.uid() = user_id);
drop policy if exists "notif_owner" on public.notifications;
create policy "notif_owner" on public.notifications for all using (auth.uid() = user_id);
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews for select using (true);
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), coalesce(new.raw_user_meta_data->>'role', 'customer'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();