begin;

lock table public.fabrics in access exclusive mode;

do $$
declare
  expected_ids uuid[] := array[
    'ee5a6d24-283c-491d-bb1d-0684c8ab7b19'::uuid,
    '3e6b643c-64a3-48f4-81e9-ca7a91da50b9'::uuid,
    '4c5c37d5-398a-44c2-8dc3-78c5d882300b'::uuid,
    '5063d394-f1ee-4d43-be67-e0537bb0dab7'::uuid,
    'dc916a00-2638-458f-9339-715ec596a096'::uuid,
    '392aa527-0902-495b-98e6-a050e9c5ce47'::uuid,
    '762e630f-e453-4347-9c6f-317adbb581e8'::uuid,
    'df6a86d2-eab6-4ff5-bf43-33b7b3a526a9'::uuid,
    'e47798d0-2474-4600-8789-558786b85ef5'::uuid
  ];
  fabric_count integer;
  matching_count integer;
  dependent_count integer;
  foreign_key record;
begin
  select count(*) into fabric_count from public.fabrics;
  select count(*) into matching_count from public.fabrics where id = any(expected_ids);

  if fabric_count <> 9 or matching_count <> 9 then
    raise exception 'Fabric cleanup aborted: the catalog no longer contains exactly the nine inspected placeholder rows';
  end if;

  for foreign_key in
    select
      constraint_schema,
      table_schema,
      table_name,
      column_name
    from information_schema.constraint_column_usage target
    join information_schema.referential_constraints reference
      on reference.unique_constraint_schema = target.constraint_schema
     and reference.unique_constraint_name = target.constraint_name
    join information_schema.key_column_usage source
      on source.constraint_schema = reference.constraint_schema
     and source.constraint_name = reference.constraint_name
    where target.table_schema = 'public'
      and target.table_name = 'fabrics'
      and target.column_name = 'id'
  loop
    execute format(
      'select count(*) from %I.%I where %I = any($1)',
      foreign_key.table_schema,
      foreign_key.table_name,
      foreign_key.column_name
    ) into dependent_count using expected_ids;

    if dependent_count > 0 then
      raise exception 'Fabric cleanup aborted: %.% contains % dependent row(s)',
        foreign_key.table_schema,
        foreign_key.table_name,
        dependent_count;
    end if;
  end loop;
end
$$;

delete from public.fabrics
where id = any(array[
  'ee5a6d24-283c-491d-bb1d-0684c8ab7b19'::uuid,
  '3e6b643c-64a3-48f4-81e9-ca7a91da50b9'::uuid,
  '4c5c37d5-398a-44c2-8dc3-78c5d882300b'::uuid,
  '5063d394-f1ee-4d43-be67-e0537bb0dab7'::uuid,
  'dc916a00-2638-458f-9339-715ec596a096'::uuid,
  '392aa527-0902-495b-98e6-a050e9c5ce47'::uuid,
  '762e630f-e453-4347-9c6f-317adbb581e8'::uuid,
  'df6a86d2-eab6-4ff5-bf43-33b7b3a526a9'::uuid,
  'e47798d0-2474-4600-8789-558786b85ef5'::uuid
]);

create sequence if not exists public.fabrics_sku_seq
  as bigint
  start with 1
  increment by 1
  minvalue 1
  no cycle;

select setval('public.fabrics_sku_seq', 1, false);

create or replace function public.assign_fabric_sku()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  sku_number bigint;
  sku_digits text;
begin
  sku_number := nextval('public.fabrics_sku_seq');
  sku_digits := sku_number::text;
  new.sku := 'RAY-' || lpad(sku_digits, greatest(4, length(sku_digits)), '0');
  return new;
end;
$$;

drop trigger if exists fabrics_assign_sku_before_insert on public.fabrics;

create trigger fabrics_assign_sku_before_insert
before insert on public.fabrics
for each row
execute function public.assign_fabric_sku();

do $$
begin
  if not exists (
    select 1
    from pg_constraint constraint_record
    join pg_class table_record on table_record.oid = constraint_record.conrelid
    join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
    where schema_record.nspname = 'public'
      and table_record.relname = 'fabrics'
      and constraint_record.contype = 'u'
      and constraint_record.conkey = array[
        (select attnum from pg_attribute where attrelid = table_record.oid and attname = 'sku')
      ]::smallint[]
  ) then
    alter table public.fabrics
      add constraint fabrics_sku_key unique (sku);
  end if;
end
$$;

commit;
