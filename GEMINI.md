# complex_coordinate Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-15

## Active Technologies
- TypeScript 5.x (Next.js 14/15 App Router)
- mathjs (Math Parsing)
- mafs (Graphing)
- zustand (State Management)
- lucide-react (Icons)
- TypeScript / Next.js + `mafs` (rendering), `math-expression` (parsing/evaluation) (002-coord-mode-logic)
- Client-side state (Zustand/Context) (002-coord-mode-logic)
- Supabase (PostgreSQL) - `auth.users` (managed), `public.saved_graphs` (003-user-auth)

## Project Structure

```text
app/
├── (main)/
│   └── page.tsx
├── components/
│   ├── graph/
│   ├── input/
│   └── ui/
├── lib/
│   ├── math/
│   ├── store/
│   └── hooks/
```

## Commands

- Test: `npm run test`
- Lint: `npm run lint`
- Dev: `npm run dev`

## Code Style

- **Functional Components**: Use React Functional Components with Hooks.
- **State**: Use `zustand` for global/transient state, `useState` for local UI state.
- **Math**: Use `mathjs` for all complex number calculations.
- **Visualization**: Use `mafs` components (`<Mafs>`, `<CartesianCoordinates>`, etc.).

## Recent Changes
- 003-user-auth: Added TypeScript 5.x (Next.js 14/15 App Router)
- 002-coord-mode-logic: Added TypeScript / Next.js + `mafs` (rendering), `math-expression` (parsing/evaluation)
- 001-complex-graphing: Initial setup with Next.js, mathjs, mafs, zustand.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
