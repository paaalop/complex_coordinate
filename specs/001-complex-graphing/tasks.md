# Tasks: Complex Coordinate Graphing

**Branch**: `001-complex-graphing` | **Spec**: [specs/001-complex-graphing/spec.md](../001-complex-graphing/spec.md)

## Phase 1: Setup (프로젝트 초기화)

- [x] T001 필수 의존성 패키지 설치 (`mathjs`, `mafs`, `zustand`, `lucide-react`)
- [x] T002 `mafs` 스타일시트 적용 및 전역 CSS 설정 (`app/globals.css`, `app/layout.tsx`)
- [x] T003 [P] 기본 폴더 구조 생성 (`components/graph`, `components/input`, `lib/math`, `lib/store`)

## Phase 2: Foundation (핵심 로직 구현)

- [x] T004 `lib/math/parser.ts` 구현: `mathjs` 인스턴스 설정 및 암시적 곱셈 지원 파싱 로직
- [x] T005 [P] `lib/math/evaluator.ts` 구현: 컴파일된 수식과 변수 스코프를 이용한 복소수 계산 로직 (에러 핸들링 포함)
- [x] T006 `lib/store/useStore.ts` 구현: Zustand 스토어 기본 구조 (Expression, Variable, ViewSettings 슬라이스) 정의
- [x] T007 `lib/types.ts` 구현: `data-model.md`에 정의된 핵심 인터페이스 (`Expression`, `Variable`, `PlotResult`, `ViewSettings`) 정의

## Phase 3: User Story 1 - 복소수 수식 시각화

**Goal**: 사용자가 입력한 복소수 수식이 즉시 2D 평면에 그래프로 그려져야 합니다.

- [x] T008 [US1] `components/input/ExpressionInput.tsx` 구현: 수식 입력 필드 및 유효성 검사 피드백 UI
- [x] T009 [P] [US1] `lib/store/useStore.ts` 업데이트: `setExpression` 액션 구현 (수식 파싱 및 의존성 추출 포함)
- [x] T010 [US1] `components/graph/ComplexPlane.tsx` 구현: `Mafs` 기반의 복소평면 캔버스 기본 설정
- [x] T011 [US1] `components/graph/PlotLayer.tsx` 구현: 스토어의 수식 데이터를 구독하여 점/벡터를 렌더링 (마우스 오버 시 툴팁 표시 포함 - FR-011)
- [x] T012 [US1] `app/(main)/page.tsx` 구현: 좌측 입력 패널과 우측 그래프 캔버스 레이아웃 통합

## Phase 4: User Story 2 - 동적 변수 탐색

**Goal**: 수식 내 변수를 자동으로 감지하고, 슬라이더를 통해 값을 실시간으로 변경하며 애니메이션할 수 있어야 합니다.

- [x] T013 [P] [US2] `lib/store/useStore.ts` 업데이트: 변수 자동 감지 로직 및 `updateVariable` 액션 구현 (Transient Update 최적화)
- [x] T014 [US2] `components/input/VariableSlider.tsx` 구현: 범위(Min/Max), 간격(Step) 설정이 가능한 슬라이더 UI
- [x] T015 [US2] `components/input/VariableList.tsx` 구현: 감지된 변수 목록을 렌더링하고 슬라이더 컴포넌트 매핑
- [x] T016 [US2] `lib/hooks/useAnimation.ts` 구현: `requestAnimationFrame`을 이용한 슬라이더 값 자동 변경 로직
- [x] T017 [US2] `components/input/AnimationControls.tsx` 구현: 재생/일시정지 버튼 및 애니메이션 속도 조절 UI
- [x] T018 [US2] `components/graph/PlotLayer.tsx` 최적화: 변수 변경 시 전체 리렌더링 방지 (Zustand subscribe 활용)

## Phase 5: User Story 3 - 좌표계 분석 및 전환

**Goal**: 복소평면과 직교좌표 간 뷰를 전환하고 극좌표 그리드를 활용할 수 있어야 합니다.

- [x] T019 [US3] `lib/store/useStore.ts` 업데이트: `ViewSettings` 관련 액션 (`toggleMode`, `toggleGrid` 등) 구현
- [x] T020 [US3] `components/graph/ViewControls.tsx` 구현: 좌표계 모드(Re/Im vs XY) 및 그리드 토글 버튼 UI
- [x] T021 [US3] `components/graph/ComplexPlane.tsx` 업데이트: `ViewSettings` 상태에 따라 축 라벨 및 그리드 스타일 동적 변경
- [x] T022 [US3] `components/graph/PolarGrid.tsx` 구현: 극좌표계(원형 그리드) 오버레이 컴포넌트

## Phase 6: Polish & Cross-Cutting (마무리 및 공통 관심사)

- [x] T023 `lib/store/persistence.ts` 구현: URL 파라미터(Query Params)와 스토어 상태 양방향 동기화
- [x] T024 [P] 에러 핸들링 강화: 0으로 나누기, 정의되지 않은 연산 시 그래프 렌더링 안전 처리 (`PlotLayer.tsx`)
- [x] T025 반응형 디자인 적용: 모바일 환경에서 패널 배치 및 터치 인터랙션 최적화
- [x] T026 최종 통합 테스트: 시나리오 기반 수동 테스트 및 성능(FPS) 확인

## Dependencies

- **Phase 1 & 2**는 모든 User Story의 선행 조건입니다.
- **T009 (Store Update)**는 **T004 (Parser)**에 의존합니다.
- **T011 (PlotLayer)**는 **T005 (Evaluator)** 및 **T010 (ComplexPlane)**에 의존합니다.
- **Phase 4 (US2)**는 **Phase 3 (US1)**가 완료된 후 진행하는 것을 권장하지만, UI 컴포넌트(T014, T015)는 병렬 개발 가능합니다.
- **T023 (Persistence)**는 모든 스토어 구조가 확정된 후 구현하는 것이 효율적입니다.

## Implementation Strategy

1. **MVP (Phase 1-3)**: 가장 먼저 `z = 1 + i`와 같은 고정된 복소수 수식을 입력하고 그래프에 점을 찍는 기능을 완성합니다. 이것이 핵심 가치입니다.
2. **Interactive (Phase 4)**: 변수 슬라이더를 추가하여 `z = a + i`와 같은 동적 탐험 기능을 구현합니다. 성능(60fps) 최적화가 중요합니다.
3. **Advanced (Phase 5-6)**: 뷰 모드 전환, 저장 기능, 예외 처리를 추가하여 제품의 완성도를 높입니다.
