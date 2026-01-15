# Feature Specification: Coordinate System Logic and Visualization

**Feature Branch**: `002-coord-mode-logic`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "좌표계 모드(Cartesian XY vs Complex Re/Im)에 따른 수식 해석 및 시각화 로직 구체화..."

## Clarifications

### Session 2026-01-15

- Q: 사용자가 음함수(예: x^2 + y^2 = 1)를 입력했을 때 처리 방식은? → A: 에러 메시지를 표시하고 y = f(x) 형태 입력을 유도함.
- Q: 슬라이더 드래그 시 업데이트 주기 방식은? → A: 성능과 반응성 균형을 위해 Throttle(30-60fps 타겟)을 적용함.
- Q: XY 모드 곡선 렌더링 범위 결정 방식은? → A: 현재 뷰포트에 보이는 영역을 기준으로 실시간 동적 샘플링을 수행함.
- Q: 복소수 모드에서 여러 im_ 변수가 있을 때 렌더링 방식은? → A: 모든 im_ 접두사 변수를 각각의 수평선으로 동시에 렌더링함.
- Q: 모드 전환 시 수식이 유효하지 않을 경우 처리 방식은? → A: 모드는 전환하되, 입력창에 구체적인 에러 메시지를 표시하고 해당 요소의 렌더링을 중단함.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Continuous Curve Plotting in XY Mode (Priority: P1)

As a user in Cartesian (XY) mode, I want the system to automatically render my expression as a continuous curve when I use the variable 'x', so that I can see the global behavior of the function rather than just discrete points.

**Why this priority**: Core functionality for standard mathematical visualization. It transitions the app from a simple point plotter to a functional grapher.

**Independent Test**: Enter `x^2` in XY mode. Verify that a continuous parabola is rendered across the entire visible X-axis range.

**Acceptance Scenarios**:

1. **Given** the app is in "XY" mode, **When** the user enters `x^2`, **Then** the system should render a continuous curve representing $y = x^2$.
2. **Given** a curve is rendered, **When** the user pans the view, **Then** the curve should dynamically extend to cover the new visible X-axis range.

---

### User Story 2 - Complex Plane Mapping in Re/Im Mode (Priority: P2)

As a user in Complex (Re/Im) mode, I want my expressions to be interpreted as complex numbers or relationships ($z = f(t)$ or $z = x + iy$), so that I can visualize complex mappings and locus of points.

**Why this priority**: Essential for the "Complex" part of the Complex Coordinate project.

**Independent Test**: Enter a complex relationship in Re/Im mode. Verify that the resulting geometry is correctly mapped to the complex plane.

**Acceptance Scenarios**:

1. **Given** the app is in "Re/Im" mode, **When** the user enters an expression representing a complex relationship, **Then** the system should render the corresponding complex geometry.
2. **Given** a variable slider `x` is active, **When** the user chooses to treat it as an imaginary component, **Then** the system should render a line parallel to the real axis at $z = t + i  f(x)$.

---

### User Story 3 - Immediate Mode Transition (Priority: P2)

As a user, I want the visualization to instantly update when I switch between Cartesian and Complex coordinate systems, so that I can compare how the same formula is interpreted in different mathematical contexts.

**Why this priority**: Ensures a seamless user experience and highlights the relationship between different coordinate systems.

**Independent Test**: Enter `x^2` in XY mode (showing a parabola), then toggle the coordinate system to Re/Im. Verify the plot immediately changes to its complex interpretation.

**Acceptance Scenarios**:

1. **Given** an expression is already entered, **When** the user toggles the coordinate system labels, **Then** the plot should re-render according to the new mode's logic without requiring the user to re-submit the expression.

---

### Edge Cases

- **Variable Ambiguity**: What happens if an expression contains both `x` and `z`?
- **Undefined Values**: How does the system render a curve where the function is undefined (e.g., $1/x$ at $x=0$)?
- **Extreme Zooms**: Does the curve rendering remain performant and accurate at very high or very low zoom levels?
- **Mode Toggle with Error**: If an expression becomes invalid after switching modes (e.g., contains 'y' in Re/Im mode), the system MUST display a specific inline error message in the input field and stop rendering that specific element until corrected.

## Requirements *(mandatory)*

### Assumptions

- **A-001**: The system has access to a math evaluator capable of symbolic or numerical function sampling.
- **A-002**: The UI library (`mafs`) supports efficient rendering of continuous functions via `<Plot.OfX />`.
- **A-003**: User variable sliders provide real-time numeric updates that can be injected into the evaluation context.
- **A-004**: Range for curve sampling is dynamically determined based on the current visible viewport bounds to optimize performance and responsiveness.

### Functional Requirements

- **FR-001**: System MUST identify the active coordinate system based on `viewSettings.labels` (XY vs Re/Im).
- **FR-002**: In XY mode, if an expression contains `x` but no explicit `y` definition, system MUST treat it as a function $y = f(x)$. If the expression cannot be interpreted as $y = f(x)$ (e.g., implicit forms like $x^2 + y^2 = 1$), the system MUST display an error message guiding the user to use the $y = f(x)$ format.
- **FR-003**: System MUST support a `CURVE` plot result type to distinguish between discrete points and continuous functions.
- **FR-004**: System MUST use specialized rendering logic (e.g., `<Plot.OfX />`) for continuous curves in the UI.
- **FR-005**: In Re/Im mode, system MUST default to interpreting expressions as complex relationships ($z = f(t)$ or $z = x + iy$).
- **FR-006**: System MUST support rendering horizontal lines ($z = t + i \cdot \text{expr}$) for each variable mapped to the imaginary component. This mode is triggered automatically for all variables using the `im_` prefix, and multiple lines MUST be rendered simultaneously if multiple such variables exist.
- **FR-007**: Expression evaluation MUST return data structures appropriate for the mode (e.g., a function for curves, a list of points for discrete values).

### Key Entities

- **Coordinate System**: Defines the interpretation context (Cartesian XY vs Complex Re/Im).
- **Plot Result**: The data structure returned by the evaluator, now including `CURVE` type for continuous functions.
- **Expression**: The mathematical formula provided by the user, interpreted differently based on the active Coordinate System.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Continuous curves (e.g., parabolas) are rendered without visible gaps or aliasing across the entire viewport.
- **SC-002**: Visualization update latency when switching modes is under 100ms for standard expressions.
- **SC-003**: 100% of expressions containing `x` are correctly identified as functions in XY mode when no `y` is defined.
- **SC-004**: The system correctly switches between discrete point rendering and continuous curve rendering based on the expression type and active mode.
- **SC-005**: Variable slider updates are throttled to maintain 30-60fps rendering performance during interactions.