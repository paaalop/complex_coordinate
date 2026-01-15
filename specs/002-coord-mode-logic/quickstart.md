# Quickstart: Coordinate System Logic

**Feature**: `002-coord-mode-logic`

## Overview
This feature enables dynamic switching between Cartesian (XY) and Complex (Re/Im) coordinates, with support for continuous curves and specialized complex mappings.

## Key Files to Modify

1.  `lib/types.ts`: Update `PlotResult` enum/type.
2.  `lib/math/evaluator.ts`: Add logic to detect `CURVE` vs `POINT` and handle `im_` prefixes.
3.  `components/graph/PlotLayer.tsx`: Implement `<Plot.OfX />` and parametric rendering for complex modes.
4.  `lib/store/useStore.ts`: Implement throttling for slider updates.

## Verification Steps

### 1. Cartesian Curve Test
- Switch to **XY Mode**.
- Enter `x^2`.
- **Expected**: A continuous parabola appears. Pan the screen; the curve should follow.

### 2. Complex Mapping Test
- Switch to **Re/Im Mode**.
- Add a variable slider named `im_a`.
- **Expected**: A horizontal line appears on the complex plane. Drag the slider; the line should move smoothly.

### 3. Error Feedback Test
- Enter `x + y` in **XY Mode**.
- Switch to **Re/Im Mode**.
- **Expected**: An error message "Undefined variable: y" appears near the input.
