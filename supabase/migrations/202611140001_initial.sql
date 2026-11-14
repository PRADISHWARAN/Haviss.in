-- Run once through the Supabase CLI. No public enquiry writes or staff self-enrolment.
create table public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);
create or replace function public.current_staff_role() returns text language sql stable security definer set search_path = '' as $$
  select role from public.staff_roles where user_id = (select auth.uid());
$$;
revoke all on function public.current_staff_role() from public;
grant execute on function public.current_staff_role() to authenticated;
alter table public.staff_roles enable row level security;
create policy staff_read_own_role on public.staff_roles for select to authenticated using (user_id = (select auth.uid()));

create table public.enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  full_name text not null check (length(full_name) between 2 and 100),
  company_name text not null check (length(company_name) between 2 and 150),
  email text not null check (length(email) <= 254),
  phone text not null check (length(phone) between 7 and 25),
  city text not null check (length(city) between 2 and 100),
  service text not null,
  manufacturer text not null default '',
  model text not null default '',
  requirement text not null check (length(requirement) between 20 and 5000),
  product text not null default '',
  attachment_path text,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','quoted','closed')),
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed'))
);
create index enquiries_service_created on public.enquiries(service, created_at desc);
alter table public.enquiries enable row level security;
create policy enquiries_staff_read on public.enquiries for select to authenticated using ((select public.current_staff_role()) in ('admin','editor','viewer'));
create policy enquiries_staff_update on public.enquiries for update to authenticated using ((select public.current_staff_role()) in ('admin','editor')) with check ((select public.current_staff_role()) in ('admin','editor'));
-- Column privilege limits staff changes to workflow status; submissions are immutable.
revoke all on public.enquiries from anon, authenticated;
grant select on public.enquiries to authenticated;
grant update (status) on public.enquiries to authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  category text not null default 'used-cmm' check (category in ('used-cmm','modular-fixtures','accessories','consultation')),
  manufacturer text not null default '',
  model text not null default '',
  machine_type text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  condition text not null default '',
  availability text not null default 'Contact us for current availability',
  description text not null default '',
  image_url text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy products_public_read on public.products for select to anon,authenticated using (published = true);
create policy products_staff_read on public.products for select to authenticated using ((select public.current_staff_role()) in ('admin','editor','viewer'));
create policy products_staff_insert on public.products for insert to authenticated with check ((select public.current_staff_role()) in ('admin','editor'));
create policy products_staff_update on public.products for update to authenticated using ((select public.current_staff_role()) in ('admin','editor')) with check ((select public.current_staff_role()) in ('admin','editor'));
create policy products_admin_delete on public.products for delete to authenticated using ((select public.current_staff_role()) = 'admin');
grant select on public.products to anon,authenticated;
grant insert,update,delete on public.products to authenticated;

create table public.site_content (
  key text primary key check (key ~ '^[a-z0-9:-]+$'),
  value jsonb not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy content_public_read on public.site_content for select to anon,authenticated using (published = true);
create policy content_staff_read on public.site_content for select to authenticated using ((select public.current_staff_role()) in ('admin','editor','viewer'));
create policy content_staff_insert on public.site_content for insert to authenticated with check ((select public.current_staff_role()) in ('admin','editor'));
create policy content_staff_update on public.site_content for update to authenticated using ((select public.current_staff_role()) in ('admin','editor')) with check ((select public.current_staff_role()) in ('admin','editor'));
grant select on public.site_content to anon,authenticated;
grant insert,update on public.site_content to authenticated;
grant select on public.staff_roles to authenticated;

create table public.enquiry_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  attempts integer not null default 1
);
alter table public.enquiry_rate_limits enable row level security;
revoke all on public.enquiry_rate_limits from anon,authenticated;
create or replace function public.take_enquiry_rate_limit(p_key text) returns boolean language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  insert into public.enquiry_rate_limits as current (key,window_start,attempts)
  values (p_key,date_trunc('hour',now()),1)
  on conflict (key) do update set
    window_start = date_trunc('hour',now()),
    attempts = case when current.window_start = date_trunc('hour',now()) then current.attempts + 1 else 1 end
  returning attempts into n;
  return n <= 5;
end;
$$;
revoke all on function public.take_enquiry_rate_limit(text) from public,anon,authenticated;
grant execute on function public.take_enquiry_rate_limit(text) to service_role;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values
('enquiry-attachments','enquiry-attachments',false,5242880,array['application/pdf','image/jpeg','image/png']),
('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy attachment_staff_read on storage.objects for select to authenticated using (bucket_id = 'enquiry-attachments' and (select public.current_staff_role()) in ('admin','editor','viewer'));
create policy product_images_staff_insert on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select public.current_staff_role()) in ('admin','editor'));
create policy product_images_staff_update on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select public.current_staff_role()) in ('admin','editor')) with check (bucket_id = 'product-images' and (select public.current_staff_role()) in ('admin','editor'));
create policy product_images_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select public.current_staff_role()) = 'admin');

-- Bootstrap an existing Auth user through a trusted SQL session, never the browser:
-- insert into public.staff_roles(user_id,role) values ('AUTH_USER_UUID','admin');
