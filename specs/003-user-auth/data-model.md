# Data Model

## Entities

### User (Managed by Supabase Auth)
- **Source**: `auth.users` system table.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `email`: String
  - `created_at`: Timestamp
  - `last_sign_in_at`: Timestamp

### SavedGraph
- **Source**: `public.saved_graphs` table.
- **Attributes**:
  - `id`: UUID (Primary Key, Default: `gen_random_uuid()`)
  - `user_id`: UUID (Foreign Key to `auth.users.id`, Not Null)
  - `title`: String (Not Null)
  - `data`: JSONB (Not Null) - Contains the serialized workspace state.
  - `created_at`: Timestamptz (Default: `now()`)
  - `updated_at`: Timestamptz (Default: `now()`)

## JSON Schema for `data` column

```json
{
  "viewport": {
    "x": { "min": number, "max": number },
    "y": { "min": number, "max": number }
  },
  "expressions": [
    {
      "id": string,
      "latex": string,
      "color": string,
      "hidden": boolean,
      "type": "expression" | "point" | ...
    }
  ],
  "variables": [
    {
      "name": string,
      "value": number,
      "min": number,
      "max": number,
      "step": number
    }
  ]
}
```

## Database Definition (SQL)

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

create policy "Users can view their own graphs"
on public.saved_graphs for select
using (auth.uid() = user_id);

create policy "Users can insert their own graphs"
on public.saved_graphs for insert
with check (auth.uid() = user_id);

create policy "Users can update their own graphs"
on public.saved_graphs for update
using (auth.uid() = user_id);

create policy "Users can delete their own graphs"
on public.saved_graphs for delete
using (auth.uid() = user_id);
```
