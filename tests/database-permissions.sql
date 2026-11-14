-- Run after the initial migration, using a trusted postgres/admin SQL session.
-- This is read-only: it checks grants, RLS and function access, not live row policies.
do $$
declare table_name text;
begin
  foreach table_name in array array['staff_roles','enquiries','products','site_content','enquiry_rate_limits'] loop
    if not (select c.relrowsecurity from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=table_name) then
      raise exception 'RLS is missing on public.%', table_name;
    end if;
    if has_table_privilege('anon',format('public.%I',table_name),'TRUNCATE') or has_table_privilege('authenticated',format('public.%I',table_name),'TRUNCATE') then
      raise exception 'Unexpected TRUNCATE access on public.%', table_name;
    end if;
  end loop;
  if has_table_privilege('anon','public.enquiries','SELECT') or has_table_privilege('anon','public.enquiries','INSERT') then
    raise exception 'Anonymous access to enquiries must be denied';
  end if;
  if not has_table_privilege('authenticated','public.enquiries','SELECT') or not has_column_privilege('authenticated','public.enquiries','status','UPDATE') or has_column_privilege('authenticated','public.enquiries','notification_status','UPDATE') then
    raise exception 'Staff enquiry grants are incorrect';
  end if;
  if not has_table_privilege('service_role','public.enquiries','SELECT') or not has_table_privilege('service_role','public.enquiries','INSERT') or not has_column_privilege('service_role','public.enquiries','notification_status','UPDATE') then
    raise exception 'Service role cannot persist enquiries or track notifications';
  end if;
  if has_table_privilege('anon','public.staff_roles','SELECT') or not has_table_privilege('authenticated','public.staff_roles','SELECT') or not has_table_privilege('service_role','public.staff_roles','SELECT') then
    raise exception 'Staff role lookup grants are incorrect';
  end if;
  if not has_table_privilege('anon','public.products','SELECT') or not has_table_privilege('anon','public.site_content','SELECT') then
    raise exception 'Published product and content reads must be available to anonymous users under RLS';
  end if;
  if has_function_privilege('anon','public.take_enquiry_rate_limit(text)','EXECUTE') or has_function_privilege('authenticated','public.take_enquiry_rate_limit(text)','EXECUTE') or not has_function_privilege('service_role','public.take_enquiry_rate_limit(text)','EXECUTE') then
    raise exception 'Rate-limit function must be callable only by the service role';
  end if;
  if has_function_privilege('anon','public.current_staff_role()','EXECUTE') or not has_function_privilege('authenticated','public.current_staff_role()','EXECUTE') then
    raise exception 'Staff role helper function grants are incorrect';
  end if;
end $$;
select 'Role grants, function access and RLS flags passed' as result;
