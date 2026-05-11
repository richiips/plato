-- ============================================================
-- PLATO — Initial schema
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type public.user_role as enum ('super_admin', 'restaurant_owner');
create type public.member_role as enum ('owner', 'manager', 'staff');
create type public.currency_code as enum ('CLP', 'USD', 'EUR', 'PEN', 'ARS', 'MXN');
create type public.modifier_type as enum ('single', 'multiple');

-- ------------------------------------------------------------
-- HELPER: updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- TABLE: profiles
-- Mirrors auth.users — auto-created via trigger on signup.
-- ------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  avatar_url    text,
  role          public.user_role not null default 'restaurant_owner',
  phone         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger trg_auth_users_new_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- TABLE: restaurants
-- ------------------------------------------------------------
create table public.restaurants (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  legal_name          text,
  description         text,
  logo_url            text,
  cover_image_url     text,
  primary_color       text not null default '#000000',
  secondary_color     text not null default '#ffffff',
  accent_color        text not null default '#ff6b35',
  font_heading        text not null default 'Inter',
  font_body           text not null default 'Inter',
  address             text,
  phone               text,
  email               text,
  instagram_handle    text,
  website_url         text,
  google_maps_url     text,
  reservation_url     text,
  opening_hours       jsonb,
  timezone            text not null default 'America/Santiago',
  default_currency    public.currency_code not null default 'CLP',
  default_language    text not null default 'es',
  supported_languages text[] not null default array['es'],
  is_active           boolean not null default true,
  is_published        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint chk_slug check (slug ~ '^[a-z0-9-]+$')
);

create trigger trg_restaurants_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TABLE: restaurant_members
-- ------------------------------------------------------------
create table public.restaurant_members (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  role          public.member_role not null default 'staff',
  invited_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),

  unique (restaurant_id, profile_id)
);

create index idx_restaurant_members_profile on public.restaurant_members(profile_id);

-- ------------------------------------------------------------
-- TABLE: menu_categories
-- ------------------------------------------------------------
create table public.menu_categories (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants(id) on delete cascade,
  name           jsonb not null default '{}',
  description    jsonb,
  icon           text,
  position       integer not null default 0,
  is_active      boolean not null default true,
  available_from time,     -- e.g. 08:00 — null means always
  available_until time,    -- e.g. 12:00 — null means always
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_menu_categories_restaurant on public.menu_categories(restaurant_id, position);

create trigger trg_menu_categories_updated_at
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TABLE: menu_items
-- ------------------------------------------------------------
create table public.menu_items (
  id                    uuid primary key default gen_random_uuid(),
  restaurant_id         uuid not null references public.restaurants(id) on delete cascade,
  category_id           uuid not null references public.menu_categories(id) on delete cascade,
  name                  jsonb not null default '{}',
  description           jsonb,
  ingredients           jsonb,
  price                 integer not null default 0,   -- stored in minor units (CLP = pesos, no decimals)
  compare_at_price      integer,
  currency              public.currency_code not null default 'CLP',
  main_image_url        text,
  gallery_image_urls    text[],
  dietary_tags          text[] not null default '{}',
  allergens             text[] not null default '{}',
  is_available          boolean not null default true,
  is_chef_recommendation boolean not null default false,
  prep_time_minutes     integer,
  calories              integer,
  position              integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_menu_items_category on public.menu_items(category_id, position);
create index idx_menu_items_restaurant on public.menu_items(restaurant_id);

create trigger trg_menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TABLE: menu_modifiers
-- ------------------------------------------------------------
create table public.menu_modifiers (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants(id) on delete cascade,
  name           jsonb not null default '{}',
  type           public.modifier_type not null default 'single',
  is_required    boolean not null default false,
  min_selections integer not null default 0,
  max_selections integer not null default 1,
  created_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TABLE: modifier_options
-- ------------------------------------------------------------
create table public.modifier_options (
  id           uuid primary key default gen_random_uuid(),
  modifier_id  uuid not null references public.menu_modifiers(id) on delete cascade,
  name         jsonb not null default '{}',
  price_delta  integer not null default 0,
  is_available boolean not null default true,
  position     integer not null default 0
);

-- ------------------------------------------------------------
-- TABLE: menu_item_modifiers  (junction)
-- ------------------------------------------------------------
create table public.menu_item_modifiers (
  item_id     uuid not null references public.menu_items(id) on delete cascade,
  modifier_id uuid not null references public.menu_modifiers(id) on delete cascade,
  position    integer not null default 0,
  primary key (item_id, modifier_id)
);

-- ------------------------------------------------------------
-- TABLE: analytics_events
-- Append-only. No UPDATE/DELETE by design.
-- ------------------------------------------------------------
create table public.analytics_events (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  event_type    text not null,
  event_data    jsonb not null default '{}',
  session_id    text,
  created_at    timestamptz not null default now()
);

create index idx_analytics_events_restaurant_time
  on public.analytics_events(restaurant_id, created_at desc);

-- ============================================================
-- HELPER FUNCTIONS (SECURITY DEFINER — bypass RLS for checks)
-- ============================================================

create or replace function public.is_super_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function public.is_member_of(rid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.restaurant_members
    where restaurant_id = rid and profile_id = auth.uid()
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles -----------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles: own row or super_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_super_admin());

create policy "profiles: insert own row"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles: update own row or super_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_super_admin());

-- restaurants --------------------------------------------
alter table public.restaurants enable row level security;

-- Public carta view: published restaurants visible to anyone
create policy "restaurants: public can read published"
  on public.restaurants for select
  using (is_published = true or public.is_super_admin() or public.is_member_of(id));

create policy "restaurants: super_admin insert"
  on public.restaurants for insert
  with check (public.is_super_admin());

create policy "restaurants: super_admin or member update"
  on public.restaurants for update
  using (public.is_super_admin() or public.is_member_of(id));

create policy "restaurants: super_admin delete"
  on public.restaurants for delete
  using (public.is_super_admin());

-- restaurant_members -------------------------------------
alter table public.restaurant_members enable row level security;

create policy "members: visible to members of same restaurant or super_admin"
  on public.restaurant_members for select
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "members: super_admin insert"
  on public.restaurant_members for insert
  with check (public.is_super_admin());

create policy "members: super_admin update"
  on public.restaurant_members for update
  using (public.is_super_admin());

create policy "members: super_admin delete"
  on public.restaurant_members for delete
  using (public.is_super_admin());

-- menu_categories ----------------------------------------
alter table public.menu_categories enable row level security;

create policy "menu_categories: public read"
  on public.menu_categories for select using (true);

create policy "menu_categories: member or super_admin write"
  on public.menu_categories for insert
  with check (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "menu_categories: member or super_admin update"
  on public.menu_categories for update
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "menu_categories: member or super_admin delete"
  on public.menu_categories for delete
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

-- menu_items ---------------------------------------------
alter table public.menu_items enable row level security;

create policy "menu_items: public read"
  on public.menu_items for select using (true);

create policy "menu_items: member or super_admin write"
  on public.menu_items for insert
  with check (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "menu_items: member or super_admin update"
  on public.menu_items for update
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "menu_items: member or super_admin delete"
  on public.menu_items for delete
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

-- menu_modifiers / modifier_options / menu_item_modifiers
alter table public.menu_modifiers enable row level security;
alter table public.modifier_options enable row level security;
alter table public.menu_item_modifiers enable row level security;

create policy "menu_modifiers: public read" on public.menu_modifiers for select using (true);
create policy "menu_modifiers: member write" on public.menu_modifiers for insert with check (public.is_super_admin() or public.is_member_of(restaurant_id));
create policy "menu_modifiers: member update" on public.menu_modifiers for update using (public.is_super_admin() or public.is_member_of(restaurant_id));
create policy "menu_modifiers: member delete" on public.menu_modifiers for delete using (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "modifier_options: public read" on public.modifier_options for select using (true);
create policy "modifier_options: auth write" on public.modifier_options for insert with check (auth.role() = 'authenticated');
create policy "modifier_options: auth update" on public.modifier_options for update using (auth.role() = 'authenticated');
create policy "modifier_options: auth delete" on public.modifier_options for delete using (auth.role() = 'authenticated');

create policy "menu_item_modifiers: public read" on public.menu_item_modifiers for select using (true);
create policy "menu_item_modifiers: auth write" on public.menu_item_modifiers for insert with check (auth.role() = 'authenticated');
create policy "menu_item_modifiers: auth delete" on public.menu_item_modifiers for delete using (auth.role() = 'authenticated');

-- analytics_events ---------------------------------------
alter table public.analytics_events enable row level security;

-- Anyone can insert (fire-and-forget from public carta)
create policy "analytics_events: public insert"
  on public.analytics_events for insert
  with check (true);

create policy "analytics_events: member or super_admin read"
  on public.analytics_events for select
  using (public.is_super_admin() or public.is_member_of(restaurant_id));

create policy "analytics_events: super_admin delete"
  on public.analytics_events for delete
  using (public.is_super_admin());
