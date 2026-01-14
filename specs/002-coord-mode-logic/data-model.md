# Data Model: Coordinate System Logic

**Feature**: `002-coord-mode-logic`

## Entities

### `PlotResult` (Enhanced)
Represents the evaluated output of a mathematical expression.

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | `POINT` \| `CURVE` \| `ERROR` | The visualization type |
| `data` | `Point[]` \| `Function` \| `string` | The actual data or formula to render |
| `color` | `string` | UI stroke/fill color |
| `metadata` | `object` | Additional info (e.g., specific error details) |

### `ViewSettings` (Context)
Global state affecting interpretation.

| Field | Type | Description |
| :--- | :--- | :--- |
| `labels` | `XY` \| `ReIm` | The active coordinate system |
| `bounds` | `{ xMin, xMax, yMin, yMax }` | Current viewport boundaries |

### `Expression`
User input and its mapping.

| Field | Type | Description |
| :--- | :--- | :--- |
| `raw` | `string` | The string entered by the user |
| `isImaginaryMapping` | `boolean` | Derived from `im_` prefix |

## State Transitions

### Coordinate Mode Toggle
1. User changes `viewSettings.labels`.
2. All active `Expressions` are re-evaluated using the new context.
3. If an expression contains invalid variables for the new mode (e.g., `y` in `ReIm`), the `PlotResult` type transitions to `ERROR`.

### Expression Input
1. User types `x^2`.
2. Evaluator detects `x` and no `y`.
3. `PlotResult` type is set to `CURVE`.
4. UI renders `<Plot.OfX />`.

### Variable Slider Interaction
1. User drags slider for `im_a`.
2. Update is throttled (30-60fps).
3. Evaluator generates a horizontal line relationship $z = t + i \cdot a$.
