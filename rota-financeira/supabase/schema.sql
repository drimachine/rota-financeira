-- ============================================================
-- Rota Financeira — Schema Supabase (PostgreSQL)
-- Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: profiles
-- Estende auth.users com dados de onboarding
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  vehicle_type text check (vehicle_type in ('moto', 'bike', 'carro')),
  city text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuários veem o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuários atualizam o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuários criam o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Cria o perfil automaticamente quando um novo usuário se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- Tabela: revenues (receitas)
-- ------------------------------------------------------------
create table if not exists public.revenues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  platform text not null check (platform in ('iFood', 'Keeta', '99', 'Outro')),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists revenues_user_date_idx on public.revenues (user_id, date desc);

alter table public.revenues enable row level security;

create policy "Usuários gerenciam as próprias receitas"
  on public.revenues for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Tabela: costs (custos)
-- ------------------------------------------------------------
create table if not exists public.costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  category text not null check (category in ('Combustível', 'Manutenção', 'Seguro', 'Alimentação', 'Outros')),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists costs_user_date_idx on public.costs (user_id, date desc);

alter table public.costs enable row level security;

create policy "Usuários gerenciam os próprios custos"
  on public.costs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Tabela: goals (metas)
-- ------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric(10, 2) not null check (target_amount > 0),
  current_amount numeric(10, 2) not null default 0 check (current_amount >= 0),
  deadline date,
  created_at timestamptz not null default now()
);

create index if not exists goals_user_idx on public.goals (user_id, created_at desc);

alter table public.goals enable row level security;

create policy "Usuários gerenciam as próprias metas"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Opcional: mantém current_amount da meta mais recente em sincronia
-- com o lucro líquido acumulado do usuário. Ajuste conforme a regra
-- de negócio desejada (aqui fica como sugestão, não é ativado).
-- ------------------------------------------------------------
-- Sugestão: calcular e atualizar goals.current_amount via um job
-- agendado (Supabase Edge Function / cron) ou no backend FastAPI
-- sempre que uma receita/custo for criado.
