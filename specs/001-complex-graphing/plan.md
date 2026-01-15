# Implementation Plan: Complex Coordinate Graphing

**Branch**: `001-complex-graphing` | **Date**: 2026-01-15 | **Spec**: [specs/001-complex-graphing/spec.md](../001-complex-graphing/spec.md)
**Input**: Feature specification from `specs/001-complex-graphing/spec.md`

## Summary

This feature implements an interactive complex number graphing tool. It allows users to input mathematical expressions involving complex numbers (e.g., `z = x + iy`), defines variables via sliders, and visualizes the results on a 2D complex plane. The system prioritizes immediate visual feedback and smooth 60fps animations.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14/15 App Router)
**Primary Dependencies**: 
- `mathjs`: For parsing and evaluating complex number expressions with implicit multiplication.
- `mafs`: For high-performance, interactive 2D math visualization.
- `zustand`: For efficient client-side state management (syncing sliders and graph).
- `lucide-react`: For UI icons.
**Storage**: Client-side only state, persisted via URL query parameters.
**Testing**: `jest` and `react-testing-library` for unit/integration tests.
**Target Platform**: Modern Web Browsers (Chrome, Edge, Firefox, Safari).
**Project Type**: Web application (Next.js).
**Performance Goals**: 
- Graph rendering at 60fps during slider interaction.
- Expression parsing < 10ms.
- Initial load < 1.5s (LCP).
**Constraints**: 
- Must handle mathematical errors gracefully (e.g., division by zero).
- Responsive design (desktop focus but mobile usable).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Visual First**: The UI layout mimics a graphing calculator with the graph taking prominence. Input changes trigger immediate updates.
- **Exploratory Learning**: Sliders are first-class citizens, automatically generated from free variables.
- **Immediate Feedback**: `mathjs` evaluation is fast; Web Workers will be used if calculation blocks the UI.
- **Natural Input**: Implicit multiplication support is a key requirement for the parser configuration.
- **Fluid Interaction**: `mafs` (or Canvas) is chosen specifically for 60fps capabilities.
- **Robustness**: Error boundaries and safe evaluation contexts will be used.

## Project Structure

### Documentation (this feature)

```text
specs/001-complex-graphing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
├── (main)/
│   └── page.tsx         # Main entry point for the calculator
├── components/
│   ├── graph/           # Graphing components (Mafs wrappers)
│   ├── input/           # Expression input and slider controls
│   └── ui/              # Shared UI components
├── lib/
│   ├── math/            # Math parsing and evaluation logic
│   ├── store/           # Zustand stores
│   └── hooks/           # Custom hooks (useAnimation, etc.)
```

**Structure Decision**: Standard Next.js App Router structure with feature-based component colocation where possible, but `lib/math` separated for pure logic testability.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Web Workers | To ensure 60fps UI thread while calculating points | Single-thread blocks UI during heavy math ops |
