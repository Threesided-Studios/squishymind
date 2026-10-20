# Supabase migrations

Numbered files (`NNNN_name.sql`). Applied through the Supabase Management API (see CLAUDE.md); prod has no `supabase_migrations` history table.
## New tables need explicit Data API grants (Supabase change, Oct 30 2026)

From **2026-10-30** Supabase stops auto-granting `anon`, `authenticated` and
`service_role` on new objects in `public`. Existing tables keep their grants.
A new table without grants still exists, but supabase-js / PostgREST calls
against it fail with `42501 permission denied for table ...`.

**Rule:** every migration that creates a table, view, sequence or RPC in
`public` grants access to it in the same file. Grants decide whether a role
can touch the table at all; RLS stays the real gate on which rows it sees.
Never ship a new table without `enable row level security` and its policies.

Template for a new table (copy into the migration, swap `<t>`):

```sql
create table if not exists public.<t> (
  id uuid primary key default gen_random_uuid(),
  -- columns ...
  created_at timestamptz not null default now()
);

alter table public.<t> enable row level security;
-- create policy ... on public.<t> ...;   -- RLS policies as usual

-- Data API grants (required after 2026-10-30; RLS still gates rows)
grant select, insert, update, delete on table public.<t> to anon, authenticated, service_role;

-- Only if the table uses serial/bigserial ids (identity and uuid ids need nothing):
-- grant usage, select on sequence public.<t>_id_seq to anon, authenticated, service_role;
```

Other objects:

```sql
-- views read through the Data API
grant select on public.<view> to anon, authenticated, service_role;

-- RPCs called from the client
grant execute on function public.<fn>(<arg types>) to authenticated, service_role;
```

Narrow it when the table is not meant for the client: drop `anon` for
signed-in-only tables, and for server-only tables grant `service_role` alone
(`revoke all on public.<t> from anon, authenticated;`).

Do not edit migrations that already ran in prod; add a follow-up migration
with the grants instead.
