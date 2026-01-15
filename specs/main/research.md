# Research: Complex Coordinate Graphing

## 1. Graphing Library Selection

### Problem
We need a library that renders 2D mathematical graphs, supports complex coordinate systems (Re/Im axes), and handles high-frequency updates (60fps) from sliders.

### Alternatives
1.  **Mafs (Recommended)**:
    *   **Pros**: built for React, declarative, interactive, uses SVG/Canvas hybrid, highly optimized for "explorable explanations".
    *   **Cons**: Newer ecosystem than D3.
2.  **Function-plot**:
    *   **Pros**: Mature, D3-based.
    *   **Cons**: Imperative API, harder to integrate deeply with React state for 60fps React-driven animations.
3.  **Raw Canvas/WebGL**:
    *   **Pros**: Max performance.
    *   **Cons**: High development effort, reinventing the wheel for axes, grids, labels, interactions.

### Decision
**Use Mafs**.
*   **Rationale**: It aligns perfectly with the "Exploratory Learning" principle. It provides built-in components for Cartesian coordinates (which can be styled as Complex), movable points, and vectors. It handles the animation loop efficiently.

## 2. Math Parsing & Implicit Multiplication

### Problem
User input like `2i` or `z(1+i)` must be parsed correctly. Standard `eval()` is unsafe and doesn't support this.

### Decision
**Use `mathjs`**.
*   **Rationale**: Robust support for complex numbers.
*   **Implementation**:
    *   Use `math.evaluate(expression, scope)`.
    *   Enable implicit multiplication? `mathjs` doesn't support implicit multiplication out of the box in the default parser without some configuration or preprocessing, OR we accept explicit `*` preference but try to support `2i` via regex preprocessing if standard parsing fails, OR verify `mathjs` rule set.
    *   *Correction*: `mathjs` *does* support implicit multiplication if configured. We need to check docs or test.
    *   *Fallback*: If `mathjs` is strict, we will use a pre-processor to insert `*` between number and variable (e.g., `2x` -> `2*x`).

## 3. State Management

### Problem
Syncing the Slider UI (React) with the Graph (Canvas/SVG) at 60fps without re-rendering the entire app tree.

### Decision
**Use `zustand` with transient updates**.
*   **Rationale**: Zustand allows subscriptions to state changes without triggering re-renders of subscribers that don't need it. We can bind the slider `onChange` directly to the `store.setState`, and the Graph component can subscribe to the values.
*   **Data Structure**:
    *   Variables: `Record<string, number>` (Real numbers only for sliders usually).
    *   Complex Result: `{ re: number, im: number }`.

## 4. Web Workers

### Decision
**Defer to Phase 2**.
*   **Rationale**: For simple expressions (points, lines), main thread is sufficient. If we implement "Domain Coloring" or massive vector fields later, we will move evaluation to a Worker. For MVP (Scenario 1 & 2), main thread `math.evaluate` is likely fast enough (<1ms).
