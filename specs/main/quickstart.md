# Quickstart: Complex Coordinate Graphing

## Prerequisites
- Node.js 18+
- npm

## Setup
1.  **Install Dependencies**:
    ```bash
    npm install mathjs mafs zustand lucide-react
    npm install -D @types/mathjs
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

## Architecture Overview
- **`components/graph/GraphCanvas.tsx`**: The main Mafs wrapper. Subscribes to `useStore` to get the latest coordinates.
- **`lib/math/parser.ts`**: Contains the logic to parse user strings into `mathjs` nodes and extract dependencies.

## Adding a New Feature
1.  **New Math Function**:
    - Update `lib/math/parser.ts` configuration if needed.
2.  **New Visualization Type**:
    - Add a new renderer in `components/graph/` (e.g. `VectorField.tsx`).
    - Add logic in `page.tsx` or `GraphCanvas.tsx` to conditionally render it.

## Testing
- Run unit tests for math parsing:
    ```bash
    npm test
    ```
