create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    fabric_id uuid not null references public.fabrics(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    rating smallint not null check (rating between 1 and 5),
    title text check (char_length(title) <= 120),
    body text not null check (char_length(body) between 10 and 2000),
    display_name text not null default 'Customer' check (char_length(display_name) between 1 and 80),
    created_at timestamptz not null default timezone('utc', now()),
    unique (fabric_id, user_id)
);

create index if not exists reviews_fabric_id_idx on public.reviews(fabric_id);
create index if not exists reviews_user_id_idx on public.reviews(user_id);

create or replace function public.can_review_fabric(p_fabric_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.orders o
        join public.order_items oi on oi.order_id = o.id
        where o.user_id = auth.uid()
          and oi.fabric_id = p_fabric_id
          and o.status = 'delivered'
    );
$$;

revoke all on function public.can_review_fabric(uuid) from public;
grant execute on function public.can_review_fabric(uuid) to authenticated;

grant select on public.reviews to anon, authenticated;
grant insert, delete on public.reviews to authenticated;

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
    on public.reviews for select
    using (true);

create policy "Verified buyers can create reviews"
    on public.reviews for insert
    to authenticated
    with check (
        user_id = auth.uid()
        and public.can_review_fabric(fabric_id)
    );

create policy "Users can delete their own reviews"
    on public.reviews for delete
    to authenticated
    using (user_id = auth.uid());
