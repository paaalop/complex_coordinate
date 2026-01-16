# Implementation Plan: User Authentication & Cloud Save

**Branch**: `003-user-auth` | **Date**: 2026-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-user-auth/spec.md`

## Summary

Implement user authentication via Google OAuth using Supabase Auth and enable cloud persistence for graph workspaces. Authenticated users can save their current session (expressions, variables, viewport) to a `saved_graphs` table in Supabase and load them later. The feature includes client-side state management updates to support saving/loading and a UI for authentication and file management.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14/15 App Router)
**Primary Dependencies**: 
- `@supabase/ssr` (for Next.js App Router integration)
- `@supabase/supabase-js`
- `zustand` (State Management)
**Storage**: Supabase (PostgreSQL) - `auth.users` (managed), `public.saved_graphs`
**Testing**: `jest` (Unit), Manual E2E for Auth flows
**Target Platform**: Web (Next.js)
**Project Type**: Web Application
**Performance Goals**: 
- Auth state load < 1s
- Save/Load operations < 200ms visual feedback
**Constraints**: 
- RLS must be strictly enforced.
- No page reloads on Auth state change.
**Scale/Scope**: ~10-20 saved graphs per user initially (MVP).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 1.1 Visual First & 2.1 Immediate Feedback
- **Check**: Auth and Save/Load actions are asynchronous.
- **Plan**: Implement optimistic UI updates or immediate loading indicators (skeletons/spinners) as per spec SC-004.

### 2.2 Natural Input & 2.3 Fluid Interaction
- **Check**: Overlaying Auth UI or Load dialogs might interrupt flow.
- **Plan**: Use non-blocking UI (toasts, sidebars) where possible. Ensure "Logout" doesn't clear work immediately (clarified in spec).

### 3.2 Robustness
- **Check**: Network failures during save.
- **Plan**: Error handling with retry options or clear messages.

### 3.3 Extensibility
- **Check**: Data model for `saved_graphs` needs to be flexible.
- **Plan**: Use `JSONB` for the `data` column to allow schema evolution of the graph state (e.g., adding color later) without DB migrations.

**Result**: PASS. The plan aligns with constitutional principles by prioritizing feedback and robustness.

## Project Structure

### Documentation (this feature)

```text
specs/003-user-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Supabase Interactions)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
├── (main)/
│   ├── graph/
│   │   └── [id]/
│   │       └── page.tsx      # Dynamic route for loading saved graphs
│   └── page.tsx              # Existing main page (updates for auth wrapper?)
├── auth/
│   └── callback/
│       └── route.ts          # OAuth callback handler
components/
├── auth/
│   ├── AuthButton.tsx        # Login/Logout logic
│   ├── UserProfile.tsx       # Avatar/Name display
│   └── SaveLoadControls.tsx  # Save/Load UI buttons & Modals
lib/
├── supabase/
│   ├── client.ts             # Browser client
│   ├── server.ts             # Server client (cookies)
│   └── middleware.ts         # Middleware for session refresh
├── hooks/
│   └── useAuth.ts            # Custom hook for auth state
└── store/
    └── useStore.ts           # Update for hydration from JSON
```

**Structure Decision**: Added `app/auth/callback` for OAuth, `lib/supabase` for client configuration, and new components in `components/auth`. Dynamic route `app/(main)/graph/[id]` added for deep linking.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `JSONB` column | Future flexibility for graph state | Fixed schema requires migration for every visual property change |