-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  completed boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policy: users can only see their own tasks
create policy "Users can view own tasks"
  on public.tasks
  for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own tasks
create policy "Users can insert own tasks"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own tasks
create policy "Users can update own tasks"
  on public.tasks
  for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own tasks
create policy "Users can delete own tasks"
  on public.tasks
  for delete
  using (auth.uid() = user_id);

-- Index for better query performance
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_created_at_idx on public.tasks(created_at desc);