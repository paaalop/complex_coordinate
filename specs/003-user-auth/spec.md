# Feature Specification: User Authentication & Cloud Save

**Feature Branch**: `003-user-auth`  
**Created**: 2026-01-16  
**Status**: Draft  
**Input**: User description: "Implement Supabase Google Login and Cloud Save/Load functionality."

## Clarifications

### Session 2026-01-16
- Q: 기존 그래프 저장 시 동작 방식은? → A: **덮어쓰기 (Update)**: 현재 편집 중인 그래프(ID 보유)는 업데이트하고, 새 작업은 새로 생성합니다.
- Q: 저장된 그래프 로드 시 URL 구조는? → A: **URL 라우팅 (/graph/[id])**: 저장된 그래프를 열면 고유 URL로 이동하여 공유 및 새로고침 시 복구를 지원합니다.
- Q: 로그아웃 시 현재 작업 중인 데이터 처리 방식은? → A: **데이터 유지**: 로그아웃 후에도 현재 화면의 수식과 변수 데이터는 초기화하지 않고 유지합니다.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticate with Google (Priority: P1)

A user wants to log in using their Google account so they can identify themselves and access personalized storage.

**Why this priority**: Core prerequisite for cloud storage features.

**Independent Test**: Can be fully tested by clicking "Login with Google", completing the OAuth flow, and verifying the UI updates to show the user's profile.

**Acceptance Scenarios**:

1. **Given** a guest user on the main page, **When** they click "Login with Google" in the sidebar, **Then** they are redirected to Google OAuth or a popup opens.
2. **Given** a successful Google login, **When** the flow completes, **Then** the sidebar displays the user's name/avatar and a "Logout" button instead of the login button.
3. **Given** an authenticated user, **When** they click "Logout", **Then** the UI reverts to the guest state (Login button shown) but the current graph data remains on screen.

---

### User Story 2 - Save Workspace (Priority: P1)

An authenticated user wants to save their current graph configuration (expressions, variables, viewport) to the cloud so they can access it later.

**Why this priority**: Primary value proposition for logged-in users.

**Independent Test**: Create a unique graph setup, save it, and verify the data exists in the database (or via the Load list).

**Acceptance Scenarios**:

1. **Given** an authenticated user with a new graph (at root `/`), **When** they trigger the "Save" action and provide a title, **Then** a new record is created, the system stores the returned ID, and the URL updates to `/graph/[new-id]`.
2. **Given** a user is editing an existing saved graph (`/graph/[id]`), **When** they click "Save", **Then** the existing record is updated (overwritten) without creating a duplicate.
3. **Given** a successful save, **When** the operation finishes, **Then** a success notification is shown and the loading indicator disappears.
4. **Given** a network error, **When** saving fails, **Then** an error message is displayed.

---

### User Story 3 - Load Workspace (Priority: P1)

An authenticated user wants to browse and load their previously saved graphs.

**Why this priority**: Completes the persistence loop.

**Independent Test**: Save a specific known state, clear the board, then load the saved state and verify exact match.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they request to load a graph, **Then** a list of their saved graphs (titles) is displayed.
2. **Given** the list of graphs, **When** they select one, **Then** the browser navigates to `/graph/[id]` and the workspace (expressions, variables, viewport) is replaced with the saved data.
3. **Given** a direct visit to `/graph/[id]`, **When** the page loads, **Then** the system fetches the graph data and restores the state automatically.
4. **Given** a loading process, **When** data is being fetched, **Then** the UI remains responsive but indicates activity.

### Edge Cases

- **Session Expiry**: User attempts to save after their session token expires. System should prompt to re-login or handle the error gracefully.
- **Empty/Invalid State**: User tries to save a completely empty workspace. System should allow it or warn (policy decision: allow).
- **Concurrency**: User saves a graph with the same title as an existing one but a different ID. System treats it as a separate new graph (Duplicate title allowed).
- **Network Latency**: Slow connection during auth or save/load. System must show consistent loading states.
- **Invalid ID**: User visits `/graph/[invalid-id]`. System should show a "Not Found" error and offer to create a new graph.
- **Post-Logout State**: User logs out while viewing `/graph/[id]`. System retains data but disables "Save" functionality until re-login.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrate with an Authentication Provider (specifically Supabase Auth) to support Google OAuth login.
- **FR-002**: System MUST display a "Login with Google" button in the sidebar for unauthenticated users.
- **FR-003**: System MUST display the user's name and avatar (if available) and a "Logout" button for authenticated users.
- **FR-004**: System MUST persist graph data in a cloud database, storing the following information per graph:
    - Unique Identifier
    - Owner Identifier (User ID)
    - Title
    - Graph Configuration Data (Expressions, Variables, Viewport settings)
    - Creation and Modification Timestamps
- **FR-005**: System MUST enforce access control policies ensuring users can ONLY access and modify their own saved graphs.
- **FR-006**: System MUST serialize the current Application Client State (active expressions, variable values, viewport) into a structured format for saving.
- **FR-007**: System MUST deserialize the structured data from the storage and restore the Application Client State to exact previous configuration.
- **FR-008**: System MUST provide immediate visual feedback (loading spinners/skeletons) for all asynchronous operations (Login, Save, Load).
- **FR-009**: Authentication state changes MUST NOT cause a full page reload.
- **FR-010**: System MUST support deep linking to saved graphs via URL path `/graph/[id]`.
- **FR-011**: System MUST preserve client-side workspace state across authentication status changes (Login/Logout).

### Key Entities

- **User**: A registered identity authenticated via the provider.
- **SavedGraph**: A persistent record containing the complete state of a user's workspace.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the login process and see their profile within 5 seconds (assuming standard network conditions).
- **SC-002**: Saved graphs are retrievable and restore the workspace to an identical state (100% data fidelity for expressions and variables).
- **SC-003**: A user cannot access or list graphs saved by another user (Verified via access control security tests).
- **SC-004**: "Save" and "Load" interactions show visual feedback within 200ms of user input.
- **SC-005**: Auth state transitions (Login -> Logout -> Login) occur without any full browser refresh.
- **SC-006**: Users navigating directly to a valid `/graph/[id]` URL see the correct graph state restored within 3 seconds.

## Assumptions

- Users have a valid Google account.
- The project has a valid Supabase project configured with Google OAuth enabled.
- Modern browser support for WebSocket/LocalStorage (for Auth/State).