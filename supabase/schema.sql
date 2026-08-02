-- Vivabox — schéma checkout (remplace Google Apps Script)
-- À exécuter une fois dans le SQL editor du projet Supabase.

create extension if not exists pgcrypto;

create table ventas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'reserved'
    check (status in ('reserved', 'paid', 'completed', 'expired')),

  box_slug text not null,
  quantity int not null,

  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null default '',

  delivery_type text not null check (delivery_type in ('physical', 'digital')),
  delivery_speed text,

  subtotal integer not null,
  delivery_price integer not null,
  total integer not null,

  paid_at timestamptz,

  recipient_name text,
  recipient_contact text,
  message_para text,
  message_de text,
  message_mensaje text,
  delivery_direccion text,
  delivery_ciudad text,
  delivery_detalles text,
  scheduled boolean not null default false,
  scheduled_date date,
  scheduled_time text,

  completed_at timestamptz
);

alter table ventas enable row level security;
-- Aucune policy créée volontairement : seule la service_role key (utilisée
-- uniquement côté serveur dans les routes API Next.js) peut lire/écrire.
-- Le navigateur du client n'a jamais d'accès direct à cette table.

-- Contacts capturés via le welcome shipping modal (bénéfice première commande)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  email text not null unique,
  source text not null default 'checkout',
  campaign text not null default 'first_purchase_shipping',
  consent boolean not null default false
);

alter table contacts enable row level security;
-- Même politique que ventas : accès exclusif via service_role côté serveur.

-- Codes promo générés (pour l'instant : uniquement le bénéfice envío gratis)
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  code text not null unique,
  type text not null check (type in ('free_shipping')),
  source text not null default 'first_purchase_welcome',
  contact_email text not null,

  single_use boolean not null default true,
  used boolean not null default false,
  used_at timestamptz,

  expires_at timestamptz not null
);

alter table promo_codes enable row level security;
-- Même politique que ventas : accès exclusif via service_role côté serveur.
