# Research: Coordinate System Logic and Visualization

**Feature**: `002-coord-mode-logic`

## Decision: `mafs` Curve Rendering Strategy
**Decision**: Use `<Plot.OfX />` for Cartesian curves and a custom wrapper around `<Plot.OfT />` or `<Polyline />` for complex mappings.
**Rationale**: 
- `<Plot.OfX />` is highly optimized for functions of the form $y=f(x)$, providing efficient adaptive sampling.
- Complex mappings $z = f(t)$ or $z = x + iy$ require parametric plotting which `mafs` supports via `<Plot.OfT />`.
- This aligns with the "Visual First" and "Fluid Interaction" constitution principles.
**Alternatives considered**: 
- Manually calculating point arrays: Rejected due to lower performance and lack of adaptive sampling (aliasing risk).
- Canvas-based rendering: Rejected as it would bypass the declarative React-based `mafs` API already in use.

## Decision: Mathematical Evaluation Strategy
**Decision**: Extend the current `math-expression` evaluator to support complex numbers and return typed `PlotResult` objects (POINT vs CURVE).
**Rationale**: 
- Reusing the existing parser maintains consistency.
- Adding a `CURVE` type to `PlotResult` allows the UI to decide whether to use `<Point />` or `<Plot.OfX />`.
- Complex number support is essential for the Re/Im mode.
**Alternatives considered**: 
- Switching to `mathjs`: Considered if the internal parser becomes too complex, but deferred to keep dependencies minimal for now.

## Decision: Real-time Update Throttling
**Decision**: Implement throttling (30-60fps) in `useStore.ts` or at the component level using `requestAnimationFrame`.
**Rationale**: 
- Directly maps to the "Fluid Interaction" goal of 60fps.
- Prevents redundant calculations on every mouse move while maintaining visual smoothness.
**Alternatives considered**: 
- Debouncing: Rejected as it feels "laggy" during active exploration.

## Decision: Viewport-based Dynamic Sampling
**Decision**: Extract `xMin` and `xMax` from the `mafs` view context to drive the evaluator's sampling range for curves.
**Rationale**: 
- Minimizes computation for non-visible areas.
- Allows infinite panning without pre-calculating a fixed range.
**Alternatives considered**: 
- Fixed range (e.g., -100 to 100): Rejected as it limits exploration.
