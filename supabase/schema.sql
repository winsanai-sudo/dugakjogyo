create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  phone text not null,
  school text not null default '',
  birth_year text not null default '',
  address text not null check (char_length(address) between 1 and 220),
  introduction text not null default '',
  lesson_types text[] not null default '{}'::text[],
  mbti text not null check (mbti in (
    'INTJ','INTP','ENTJ','ENTP',
    'INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ',
    'ISTP','ISFP','ESTP','ESFP'
  )),
  resume_path text not null unique,
  original_file_name text not null,
  solution_path text not null unique,
  original_solution_file_name text not null,
  created_at timestamptz not null default now()
);

alter table public.applications
  add column if not exists school text not null default '';

alter table public.applications
  add column if not exists birth_year text not null default '';

alter table public.applications
  add column if not exists introduction text not null default '';

alter table public.applications
  add column if not exists lesson_types text[] not null default '{}'::text[];

alter table public.applications
  add column if not exists solution_path text;

alter table public.applications
  add column if not exists original_solution_file_name text;

create unique index if not exists applications_solution_path_idx
  on public.applications (solution_path)
  where solution_path is not null;

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_mbti_idx on public.applications (mbti);

alter table public.applications enable row level security;

create policy "No public reads" on public.applications
  for select using (false);

create policy "No public inserts" on public.applications
  for insert with check (false);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/haansofthwp',
    'application/x-hwp',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
