# Tasks: User Authentication & Cloud Save

**Feature Branch**: `003-user-auth`
**Status**: Pending
**Spec**: [spec.md](spec.md)

## Dependencies

- **Phase 1 (Setup)**: Must be completed first to enable Supabase connectivity.
- **Phase 2 (Foundational)**: Prerequisite for all User Stories (Types & Auth Hook).
- **Phase 3 (US1)**: Prerequisite for US2 & US3 (Need auth to save/load).
- **Phase 4 (US2)**: Can be developed in parallel with US3, but Save is needed to generate data for Load testing.
- **Phase 5 (US3)**: Depends on US2 for meaningful data, but UI can be built with mock data.

## Phase 1: Setup

**Goal**: Initialize Supabase project connection and dependencies.

- [x] T001 Install Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] T002 Create `.env.local` with Supabase URL and Anon Key (see quickstart.md)
- [x] T003 Create Supabase browser client utility in `lib/supabase/client.ts`
- [x] T004 Create Supabase server client utility in `lib/supabase/server.ts`
- [x] T005 Create Supabase middleware in `lib/supabase/middleware.ts` for session refreshing
- [x] T006 Register Supabase middleware in `middleware.ts` (root)

## Phase 2: Foundational

**Goal**: Establish core types, auth hook, and database schema.

- [x] T007 [P] Create `lib/types.ts` (or update existing) with `SavedGraph` and `GraphState` interfaces
- [x] T008 Implement `useAuth` hook in `lib/hooks/useAuth.ts` to expose user session and sign-in/out methods
- [x] T009 [Manual] Execute SQL from `quickstart.md` in Supabase Dashboard to create `saved_graphs` table and RLS policies

## Phase 3: User Story 1 - Authenticate with Google

**Goal**: Users can log in/out via Google OAuth and see their profile.

**Independent Test**: Click "Login", complete Google flow, see Avatar/Logout. Refresh page -> still logged in.

- [x] T010 [US1] Create OAuth callback route handler in `app/auth/callback/route.ts`
- [x] T011 [P] [US1] Create `UserProfile.tsx` component in `components/auth/UserProfile.tsx` (Avatar + Name)
- [x] T012 [P] [US1] Create `AuthButton.tsx` component in `components/auth/AuthButton.tsx` (Login/Logout logic)
- [x] T013 [US1] Integrate `AuthButton` and `UserProfile` into the main Sidebar or Header (e.g., `components/graph/ViewControls.tsx` or new layout component)
- [x] T014 [US1] Verify Auth state persistence on page reload (Manual Test)

## Phase 4: User Story 2 - Save Workspace

**Goal**: Authenticated users can save current graph state (Create New or Update Existing).

**Independent Test**: Save a graph -> Verify entry in Supabase `saved_graphs` table via dashboard or subsequent load.

- [x] T015 [US2] Implement `serializeGraphState` helper in `lib/store/useStore.ts` (or `lib/utils.ts`) to extract current state
- [x] T016 [US2] Create `saveGraph` service function in `lib/services/graphService.ts` (Handle Insert/Update logic)
- [x] T017 [P] [US2] Create `SaveModal.tsx` in `components/auth/SaveModal.tsx` (Title input)
- [x] T018 [US2] Implement "Save" button in `components/auth/SaveLoadControls.tsx` connecting to `SaveModal` and `saveGraph` service
- [x] T019 [US2] Add optimistic UI/Loading state handling during save operation in `SaveLoadControls.tsx`

## Phase 5: User Story 3 - Load Workspace

**Goal**: Users can list saved graphs and load them into the workspace.

**Independent Test**: Save "Graph A" -> Clear Board -> Load "Graph A" -> Verify matching state.

- [x] T020 [US3] Implement `deserializeAndLoad` action in `lib/store/useStore.ts` to hydrate Zustand store
- [x] T021 [US3] Create `fetchGraphs` service function in `lib/services/graphService.ts`
- [x] T022 [P] [US3] Create `LoadModal.tsx` in `components/auth/LoadModal.tsx` (List of saved graphs with timestamps)
- [x] T023 [US3] Implement "Load" button in `components/auth/SaveLoadControls.tsx` to open `LoadModal`
- [x] T024 [US3] Create dynamic route `app/(main)/graph/[id]/page.tsx` for deep linking
- [x] T025 [US3] Implement logic in `page.tsx` (or wrapper) to fetch graph data by ID and hydrate store on mount

## Final Phase: Polish & Cross-Cutting

**Goal**: Refine UX and ensure robust error handling.

- [x] T026 Update URL on successful save/load (using `window.history` or Next.js router) without reload
- [x] T027 Add error toast notifications for failed Save/Load/Auth actions
- [x] T028 [Manual] Verify RLS: Try to fetch a graph ID belonging to another user (should fail)

## Implementation Strategy

1. **Setup & Auth (Phase 1-3)**: First, get the user authenticated. This is the foundation for everything else.
2. **Data Logic (Phase 2 & 4)**: Build the serialization and database interaction layer.
3. **Save UI (Phase 4)**: Allow creating data.
4. **Load & Routing (Phase 5)**: Allow consuming data and sharing via URL.