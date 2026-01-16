# Quickstart: User Auth & Cloud Save

## Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project created.
2. **Environment Variables**:
   Create a `.env.local` file in the root directory with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Google OAuth**:
   - Enable Google Provider in Supabase Authentication -> Providers.
   - Configure Client ID and Secret from Google Cloud Console.
   - Add the Supabase callback URL to Google Console (`https://<project-ref>.supabase.co/auth/v1/callback`).

## Installation

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Database Setup

Run the following SQL in your Supabase SQL Editor to create the table and policies:

```sql
create table public.saved_graphs (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.saved_graphs enable row level security;

create policy "Users can view their own graphs" on public.saved_graphs for select using (auth.uid() = user_id);
create policy "Users can insert their own graphs" on public.saved_graphs for insert with check (auth.uid() = user_id);
create policy "Users can update their own graphs" on public.saved_graphs for update using (auth.uid() = user_id);
create policy "Users can delete their own graphs" on public.saved_graphs for delete using (auth.uid() = user_id);
```

## Usage

1. **Login**: Click the "Login with Google" button in the sidebar.
2. **Save**: Once logged in, click "Save" to persist your current graph.
3. **Load**: Click "Load" to view your saved graphs and restore one.
