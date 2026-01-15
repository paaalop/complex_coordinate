# Quickstart: Complex Coordinate Graphing Feature

## Prerequisites

- Node.js 18+
- npm or pnpm

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install mathjs mafs zustand lucide-react
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Access Feature**:
    Navigate to `http://localhost:3000/complex-graph` (or the root if this is the main page).

## Key Commands

- **Test**: `npm run test` (Runs jest tests including math logic)
- **Lint**: `npm run lint`

## Troubleshooting

- **Graph not rendering?**: Check console for `mathjs` parsing errors. Ensure `mafs` CSS is imported in `layout.tsx` or `page.tsx`.
- **Performance issues?**: Verify that `zustand` transient updates are working and that `MainGraph` component is NOT re-rendering on every slider change (use React DevTools Profiler).
