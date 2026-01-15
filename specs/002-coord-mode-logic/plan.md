# Implementation Plan: Coordinate System Logic and Visualization

**Branch**: `002-coord-mode-logic` | **Date**: 2026-01-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification for coordinate mode-dependent expression evaluation and visualization.

## Summary
Implement a responsive coordinate system switcher that toggles between Cartesian (XY) and Complex (Re/Im) logic. The system will automatically detect when an expression represents a continuous curve ($y=f(x)$) or a complex mapping (e.g., $z=t+i \cdot im\_a$) and render them using `mafs` optimized components.

## Technical Context

**Language/Version**: TypeScript / Next.js  
**Primary Dependencies**: `mafs` (rendering), `math-expression` (parsing/evaluation)  
**Storage**: Client-side state (Zustand/Context)  
**Testing**: Vitest (evaluator logic), Playwright/Cypress (UI transitions)  
**Target Platform**: Web (Responsive)
**Project Type**: single/web  
**Performance Goals**: 60fps interaction (throttled sliders), <100ms mode transition  
**Constraints**: No server-side evaluation, must handle mathematical edge cases (NaN, Infinity)  
**Scale/Scope**: Real-time graphing with dynamic viewport sampling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Visual First**: All changes prioritize immediate visual feedback upon coordinate toggle. (PASS)
- **Immediate Feedback**: Throttled updates and inline error messages ensure the user is never stuck. (PASS)
- **Fluid Interaction**: 60fps target for sliders is explicitly planned. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/002-coord-mode-logic/
├── plan.md              # This file
├── research.md          # Decision log (mafs integration, evaluation strategy)
├── data-model.md        # PlotResult enhancement, ViewSettings
├── quickstart.md        # Dev guide and verification steps
└── tasks.md             # (To be generated)
```

### Source Code

```text
app/
└── (main)/
    └── page.tsx         # Layout-level mode detection

components/
└── graph/
    ├── PlotLayer.tsx    # ADD: <Plot.OfX />, <Plot.OfT /> support
    └── ComplexPlane.tsx # Update coordinate grid based on labels

lib/
├── types.ts             # Update PlotResult type
├── math/
│   └── evaluator.ts     # Update for mode-aware evaluation + CURVE detection
└── store/
    └── useStore.ts      # Add throttling for variable updates
```

**Structure Decision**: Single project (Web). Leveraging existing Next.js structure.