# Tasks: Coordinate System Logic and Visualization

**Input**: Design documents from `specs/002-coord-mode-logic/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Tests are primarily handled via manual verification steps in `quickstart.md` as requested by the "Independent Test" sections in `spec.md`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure and `mafs` / `math-expression` dependencies in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update `PlotResult` type in `lib/types.ts` to include `POINT`, `CURVE`, and `ERROR` types
- [x] T003 [P] Add `viewSettings` (labels, bounds) to the state in `lib/store/useStore.ts`
- [x] T004 [P] Implement 30-60fps throttling for variable updates in `lib/store/useStore.ts`
- [x] T005 Update `lib/math/evaluator.ts` to return typed `PlotResult` objects instead of raw data
- [x] T019 [P] Implement reserved word defense (x, y, z, t, i) and variable collision detection in `lib/math/evaluator.ts` (Constitution VII)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Continuous Curve Plotting in XY Mode (Priority: P1) 🎯 MVP

**Goal**: Automatically render expressions as continuous curves using `x` in XY mode.

**Independent Test**: Enter `x^2` in XY mode. Verify that a continuous parabola is rendered across the entire visible X-axis range.

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement `x`-variable detection, implicit multiplication support (e.g., `2i`), and `CURVE` type assignment in `lib/math/evaluator.ts`
- [x] T007 [P] [US1] Extract `xMin` and `xMax` from `mafs` context for dynamic sampling in `components/graph/PlotLayer.tsx`
- [x] T008 [US1] Implement `<Plot.OfX />` rendering logic in `components/graph/PlotLayer.tsx` for `CURVE` results
- [x] T009 [US1] Add error validation for implicit forms (e.g., `x^2 + y^2 = 1`) in `lib/math/evaluator.ts`

**Checkpoint**: User Story 1 (MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Complex Plane Mapping in Re/Im Mode (Priority: P2)

**Goal**: Interpret expressions as complex mappings and handle `im_` prefix variables.

**Independent Test**: Enter a complex relationship in Re/Im mode. Verify that the resulting geometry is correctly mapped to the complex plane.

### Implementation for User Story 2

- [x] T010 [P] [US2] Update `lib/math/evaluator.ts` to detect `im_` prefix variables and generate horizontal line data
- [x] T011 [US2] Implement parametric evaluation ($z = f(t)$) logic in `lib/math/evaluator.ts` for Re/Im mode
- [x] T012 [US2] Update `components/graph/PlotLayer.tsx` to render horizontal lines and parametric curves using `<Plot.OfT />` or `<Polyline />`

**Checkpoint**: User Story 2 is functional and integrates with the complex plane visualization.

---

## Phase 5: User Story 3 - Immediate Mode Transition (Priority: P2)

**Goal**: Instantly update visualization when toggling between XY and Re/Im modes.

**Independent Test**: Enter `x^2` in XY mode, then toggle to Re/Im. Verify the plot immediately changes its interpretation.

### Implementation for User Story 3

- [x] T013 [US3] Implement global re-evaluation trigger on coordinate mode change in `app/(main)/page.tsx`
- [x] T014 [US3] Add mode-specific variable validation (e.g., error if `y` is used in Re/Im) in `lib/math/evaluator.ts`
- [x] T015 [US3] Update `components/graph/ComplexPlane.tsx` to dynamically switch grid labels based on `viewSettings.labels`

**Checkpoint**: Seamless transitions between coordinate systems are fully implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Run all verification steps in `quickstart.md` to ensure system integrity
- [x] T017 Optimize curve rendering performance for extreme zoom levels (range: 10^-6 to 10^6) and ensure sampling accuracy in `components/graph/PlotLayer.tsx`
- [x] T018 Ensure all inline error messages are correctly displayed in the input components
- [x] T020 Verify mode transition latency (<100ms) and document complex rendering/optimization logic in `docs/` or as inline comments (Constitution IX)