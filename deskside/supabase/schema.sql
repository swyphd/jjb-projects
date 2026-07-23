-- Deskside database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  category text,
  brand text,
  model text,
  specs text,
  confidence text check (confidence in ('high', 'medium', 'low')),
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  verdict text check (verdict in ('Compatible', 'Not compatible', 'Depends', 'Need more info')),
  created_at timestamptz default now()
);

-- Keep devices.updated_at current on every update.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists devices_set_updated_at on devices;
create trigger devices_set_updated_at
  before update on devices
  for each row execute function set_updated_at();

-- Populate the `users` row automatically when someone signs up via Supabase Auth.
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- Row Level Security: every table is scoped to the owning user.
alter table users enable row level security;
alter table devices enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Users can view their own row"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own row"
  on users for update
  using (auth.uid() = id);

create policy "Users can view their own devices"
  on devices for select
  using (auth.uid() = user_id);

create policy "Users can insert their own devices"
  on devices for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own devices"
  on devices for update
  using (auth.uid() = user_id);

create policy "Users can delete their own devices"
  on devices for delete
  using (auth.uid() = user_id);

create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Users can create their own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can view messages in their own conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their own conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Storage: private bucket for device photos, one folder per user (folder name = auth.uid()).
insert into storage.buckets (id, name, public)
values ('device-photos', 'device-photos', false)
on conflict (id) do nothing;

create policy "Users can read their own device photos"
  on storage.objects for select
  using (bucket_id = 'device-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload their own device photos"
  on storage.objects for insert
  with check (bucket_id = 'device-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own device photos"
  on storage.objects for update
  using (bucket_id = 'device-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own device photos"
  on storage.objects for delete
  using (bucket_id = 'device-photos' and (storage.foldername(name))[1] = auth.uid()::text);
