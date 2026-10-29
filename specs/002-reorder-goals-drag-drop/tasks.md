# Tasks: Goal Drag-and-Drop Reordering

**Input**: Design documents from `/specs/002-reorder-goals-drag-drop/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/goal-reorder-ui-contract.md](./contracts/goal-reorder-ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: No automated test tasks are included. This feature uses manual validation only per constitution and plan.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`) for story-phase tasks only
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependency and planning baseline for sortable drag-and-drop feature work.

- [X] T001 Add sortable dependency in package manifests by updating package.json and package-lock.json
- [X] T002 Record feature execution scope and no-testing rule in specs/002-reorder-goals-drag-drop/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared data shape and reorder primitives required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Update Goal model in src/types/goal.ts to include orderIndex with constraint "orderIndex must be an integer >= 0"
- [X] T004 [P] Add reorder helper utilities in src/lib/goal-order.ts for index moves, visible-list targeting, and version-token generation
- [X] T005 Update goal persistence validation and normalization in src/lib/goal-storage.ts with constraints "id must be non-empty and unique per user goal list", "title must be non-empty after trimming", "endDate must be canonical date format accepted by current date utility", "status must be one of allowed lifecycle values", and "orderIndex must be an integer >= 0"
- [X] T006 Update initial load and migration logic in src/components/goal-board.tsx to assign stable orderIndex values for legacy goals missing orderIndex

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Reorder goals in a list (Priority: P1) 🎯 MVP

**Goal**: Allow pointer drag-and-drop reordering of visible current goals above/below other goals with immediate visual feedback and correct list sequencing.

**Independent Test**: From the current-goals list, drag one goal above another and drag a second goal below another; confirm immediate visible order update and proper shifting.

### Implementation for User Story 1

- [X] T007 [US1] Integrate SortableJS lifecycle setup/teardown for current-goal list in src/components/goal-board.tsx
- [X] T008 [P] [US1] Add drag-state visual affordances using Tailwind classes in src/components/goal-item.tsx
- [X] T009 [US1] Implement drop-to-index reordering flow in src/components/goal-board.tsx using only currently visible goals and preserving relative order of unaffected goals
- [X] T010 [US1] Implement no-op handling in src/components/goal-board.tsx so drops to original index do not mutate persisted order
- [X] T011 [US1] Ensure rapid sequential drop handling in src/components/goal-board.tsx applies reorder actions in completion order

**Checkpoint**: User Story 1 is functionally complete and manually verifiable.

---

## Phase 4: User Story 2 - Keep reordered goals after leaving the page (Priority: P2)

**Goal**: Persist reordered goal order so users see the same order after reload/return.

**Independent Test**: Reorder current goals, reload page, and verify order remains unchanged.

### Implementation for User Story 2

- [X] T012 [US2] Persist successful reorder operations in src/components/goal-board.tsx through existing saveGoals flow
- [X] T013 [P] [US2] Update current-goal list derivation in src/components/goal-board.tsx to prioritize explicit orderIndex over derived date sorting
- [X] T014 [US2] Update load normalization in src/lib/goal-storage.ts so persisted goals restore in saved order with valid orderIndex values
- [X] T015 [US2] Update reload status messaging in src/components/goal-board.tsx to confirm saved order restoration without changing non-reorder behaviors

**Checkpoint**: User Stories 1 and 2 are independently functional and persist correctly.

---

## Phase 5: User Story 3 - Recover gracefully from invalid drops or save failures (Priority: P3)

**Goal**: Reject stale/invalid reorder attempts, recover to last saved order, and show clear user messaging.

**Independent Test**: Trigger stale-drop and simulated save-failure paths; verify revert behavior and clear retry/failure messages.

### Implementation for User Story 3

- [X] T016 [US3] Capture drag-start version token and validate on drop in src/components/goal-board.tsx using stale-drop rejection rule from contract
- [X] T017 [P] [US3] Add stale-drop recovery messaging in src/components/goal-board.tsx that refreshes to latest saved order and prompts retry
- [X] T018 [US3] Implement save-failure rollback path in src/components/goal-board.tsx to restore most recently saved order on persistence errors
- [X] T019 [US3] Enforce visible-scope boundaries in src/components/goal-board.tsx so hidden goals cannot be reorder targets

**Checkpoint**: All user stories are complete with conflict/failure handling and scoped reorder behavior.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency pass and manual validation artifacts.

- [X] T020 [P] Align drag/drop accessibility labels and status text clarity in src/components/goal-item.tsx and src/components/goal-board.tsx
- [X] T021 Update manual validation scenarios and expected outcomes in specs/002-reorder-goals-drag-drop/quickstart.md for final implemented behavior
- [X] T022 Run end-to-end manual validation pass from specs/002-reorder-goals-drag-drop/quickstart.md and log outcomes in specs/002-reorder-goals-drag-drop/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2; MVP phase
- **Phase 4 (US2)**: Depends on Phase 3 for reorder behavior baseline
- **Phase 5 (US3)**: Depends on Phase 3 and integrates with persistence behavior from Phase 4
- **Final Phase**: Depends on completion of all user story phases

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational completion
- **US2 (P2)**: Depends on US1 reorder mechanics
- **US3 (P3)**: Depends on US1 reorder mechanics and uses persisted-state behavior established in US2

### Parallel Opportunities

- **Setup**: T002 can run while T001 is in progress once feature folder exists
- **Foundational**: T004 can run in parallel with T003, then joins T005/T006
- **US1**: T008 can run in parallel with T007; merge before T009
- **US2**: T013 can run in parallel with T012; merge before T014/T015
- **US3**: T017 can run in parallel with T016; merge before T018/T019
- **Polish**: T020 and T021 can run in parallel, then T022 executes last

---

## Parallel Example: User Story 1

```bash
# In parallel after foundational phase:
Task: "T007 [US1] Integrate SortableJS lifecycle setup/teardown in src/components/goal-board.tsx"
Task: "T008 [US1] Add drag-state visual affordances in src/components/goal-item.tsx"

# Then continue with ordered US1 tasks:
Task: "T009 [US1] Implement drop-to-index reordering flow in src/components/goal-board.tsx"
Task: "T010 [US1] Implement no-op handling in src/components/goal-board.tsx"
Task: "T011 [US1] Ensure rapid sequential drop handling in src/components/goal-board.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. Run manual validation for US1 reorder behaviors
4. Demo/deploy MVP if acceptable

### Incremental Delivery

1. Deliver MVP (US1)
2. Add persistence increment (US2), validate independently
3. Add failure/conflict handling increment (US3), validate independently
4. Complete final polish and full manual validation

### Team Parallel Strategy

1. Team completes Setup + Foundational together
2. After Phase 2:
   - Developer A drives US1 core board integration
   - Developer B prepares persistence enhancements for US2
   - Developer C prepares conflict/failure handling for US3
3. Integrate in priority order with manual validation at each checkpoint

---

## Notes

- All tasks follow required checklist format with task ID, optional `[P]`, optional story label, and exact file path.
- No automated test tasks are included by design (constitution and plan constraint).
- Manual validation is defined in quickstart and executed in T022.
