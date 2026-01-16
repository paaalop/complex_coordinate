# Phase 0: Research

## Decisions & Rationale

### 1. Supabase Integration for Next.js 14/15 App Router
- **Decision**: Use `@supabase/ssr` and `@supabase/supabase-js`.
- **Rationale**: `@supabase/ssr` is the currently recommended library for Next.js App Router (replacing the older `auth-helpers`), providing better cookie handling for server-side rendering and middleware integration.
- **Dependencies**: Need to install `@supabase/ssr` and `@supabase/supabase-js` as they are missing from `package.json`.

### 2. State Persistence Strategy
- **Decision**: Serialize Zustand store state to `JSONB` in Postgres.
- **Rationale**: The graph state (expressions, variables, viewport) is hierarchical and variable in structure. `JSONB` allows flexible schema evolution without complex table joins or migration overhead for every new visual property.
- **Alternatives Considered**: 
  - *Relational Tables (Graphs -> Expressions, Graphs -> Variables)*: Rejected due to complexity in saving/loading atomic snapshots and higher query cost.
  - *File Storage (Storage Buckets)*: Rejected because the data size is small (<10KB text), and database storage allows for easier metadata querying and RLS enforcement.

### 3. Row Level Security (RLS)
- **Decision**: Enable RLS on `saved_graphs` table.
- **Policy**: `auth.uid() = user_id` for all operations (SELECT, INSERT, UPDATE, DELETE).
- **Rationale**: Ensures strict data isolation per user.

### 4. Deep Linking & Routing
- **Decision**: Use Dynamic Routes `app/(main)/graph/[id]/page.tsx`.
- **Rationale**: Matches Next.js standard patterns. The page component will fetch data server-side (optional) or client-side via `useEffect` depending on auth state, but client-side fetching is preferred for consistency with the interactive editor nature.

## Unknowns Resolved
- **Supabase Dependencies**: Verified they are not currently installed.
- **Project Structure**: Verified `supabase` CLI is present in devDependencies, indicating local dev support is possible if initialized.
