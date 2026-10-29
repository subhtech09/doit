# Tasks: doit Goal Tracker

**Input**: Design documents from `specs/001-doit-goal-tracker/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story and ordered by priority. The repository constitution requires manual review only; this list contains no automated or scripted test tasks.

**Path convention**: Single-project Next.js App Router application under `src/`, as defined in `plan.md`.

## Phase 1: Setup

**Purpose**: Scaffold the application and establish the requested dependencies and theme foundation.

- [ ] T001 Scaffold the latest stable Next.js App Router application with TypeScript, Tailwind CSS v4, ESLint, `src/`, and the `@/*` import alias at the repository root; preserve `.specify/`, `.github/`, and `specs/` while creating `package.json`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css`.
- [ ] T002 Add `date-fns` and initialize shadcn/ui; generate only Button, Checkbox, Dialog, Input, and Label primitives in `package.json`, `components.json`, and `src/components/ui/`.
- [ ] T003 Define semantic pastel and state color tokens in top-level Tailwind `@theme` declarations in `src/app/globals.css`; ensure normal text, large text, control boundaries, and focus colors meet the plan's WCAG 2.2 AA contrast targets.

---

## Phase 2: Foundational

**Purpose**: Create shared goal types, local date operations, and validated browser persistence before story work begins.

- [ ] T004 Define the Goal type and status in `src/types/goal.ts`: `id` is a stable unique string; `title` is a trimmed, non-empty user-visible string; `endDate` is a canonical, actual `YYYY-MM-DD` date-only value in the user's local calendar; `status` is `current | completed`, starts as `current`, and may transition to `completed` only.
- [ ] T005 [P] Implement local date parsing, canonical shape and actual calendar validation, formatting, and `differenceInCalendarDays` helpers in `src/lib/goal-dates.ts`; reject creation dates before today while allowing existing records to become overdue.
- [ ] T006 Implement versioned JSON persistence under `doit:goals:v1` in `src/lib/goal-storage.ts`; validate decoded records, access storage only from browser-side callers, distinguish malformed data from an empty collection, and report read/write or storage-access failures without claiming unsaved changes were persisted.

**Checkpoint**: Shared types, date operations, and storage behavior are ready; no goal UI should read storage during server rendering or the initial hydration render.

---

## Phase 3: User Story 1 - Add and see current goals (Priority: P1)

**Goal**: Show both goal columns and allow a user to add, view, and persist current goals.

**Independent Manual Verification**: With no saved goals, open the page and confirm both empty states. Add a goal with a valid title and today or future date; confirm the modal closes and the title and correct local-calendar day count appear in Current goals. Try whitespace-only title, empty date, and past date and confirm each is blocked with an associated message. Reload and confirm the goal remains.

- [ ] T007 [P] [US1] Set the page language and `doit` metadata title/description in `src/app/layout.tsx` and load `src/app/globals.css` from the root layout.
- [ ] T008 [P] [US1] Build the accessible add-goal dialog with required Title and End date fields, associated validation messages, submit/cancel controls, Escape dismissal, and focus return in `src/components/goal-form-dialog.tsx`.
- [ ] T009 [P] [US1] Build the goal row's base presentation in `src/components/goal-item.tsx`, showing the title, end-date text, and a labeled selection checkbox while keeping long titles within the responsive layout.
- [ ] T010 [US1] Implement the client-side board in `src/components/goal-board.tsx`: render a deterministic loading state for server and initial client output, load validated storage in an effect after mount, show Current goals and Completed goals with friendly empty states, sort current goals by soonest end date, and add valid submitted goals to current state and persistence.
- [ ] T011 [US1] Render the goal board as the main content in `src/app/page.tsx` and confirm the page remains usable from 320px upward without horizontal scrolling.

**Checkpoint**: Story 1 is manually verifiable without implementing completion or urgency behavior.

---

## Phase 4: User Story 2 - Complete a goal (Priority: P2)

**Goal**: Let a user select a current goal, move it to Completed goals, or permanently delete it.

**Independent Manual Verification**: Select a current goal and confirm Move to completed and goal-specific Delete appear. Unselect it and confirm the actions disappear without moving it. Move a selected goal and confirm it leaves Current goals and appears in Completed goals. Select another current goal and activate Delete; confirm it disappears immediately and stays absent after reload.

- [ ] T012 [US2] Add current-goal selection behavior and conditionally render Move to completed and a goal-specific Delete action in `src/components/goal-item.tsx`; expose the selected state and action names accessibly, requiring checkbox selection before the separate delete action.
- [ ] T013 [US2] Implement current-goal move and permanent-delete handlers in `src/components/goal-board.tsx`; persist status/removal, clear transient selection after an action, preserve the completed list's relative order, and report persistence failures accessibly.

**Checkpoint**: Current goals can be completed or permanently deleted; completed-goal deletion is delivered in User Story 4.

---

## Phase 5: User Story 3 - Urgent goals are highlighted (Priority: P3)

**Goal**: Highlight current goals due within three local calendar days, including overdue goals, without relying on color alone.

**Independent Manual Verification**: Add goals due today, in three days, and in four days; confirm only the first two are highlighted. Confirm overdue goals show an overdue label and are highlighted. Leave the page open across local midnight and return to a backgrounded tab; confirm derived day labels refresh.

- [ ] T014 [P] [US3] Apply urgency presentation in `src/components/goal-item.tsx` when `daysLeft <= 3`, including overdue text and a non-color urgency cue while leaving completed goals unhighlighted.
- [ ] T015 [P] [US3] Refresh the board's derived local date at local midnight and when the page becomes visible in `src/components/goal-board.tsx`; clean up the timer and visibility listener when the component unmounts.

**Checkpoint**: Urgency is derived from local calendar days, refreshes during long-open sessions, and remains distinguishable without color.

---

## Phase 6: User Story 4 - Manage completed goals (Priority: P4)

**Goal**: Allow a user to select and permanently delete goals in the completed column.

**Independent Manual Verification**: Move a current goal to Completed goals. Select the completed goal and confirm its goal-specific Delete action appears; activate it and confirm it disappears immediately and remains absent after reload.

- [ ] T016 [US4] Render selection and a goal-specific Delete action for completed goal rows in `src/components/goal-item.tsx`; keep selection transient and make the action keyboard-operable and accessible by goal title.
- [ ] T017 [US4] Handle permanent deletion of selected completed goals in `src/components/goal-board.tsx`; persist removal, clear selection, and announce the result or a storage failure without offering undo.

**Checkpoint**: Current and completed goals can both be permanently removed through explicit selection followed by a separate goal-specific action.

---

## Phase 7: Polish and Cross-Cutting Review

**Purpose**: Perform the required manual review across responsive, persistence, and accessibility behavior.

- [ ] T018 Review the implemented flows against `specs/001-doit-goal-tracker/quickstart.md`; resolve any mismatch in `src/app/`, `src/components/`, or `src/lib/` and confirm keyboard operation, dialog focus, storage failure messaging, WCAG contrast and target sizing, 200% text resize, 400% reflow, text-spacing overrides, and 320px layout manually.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No phase dependencies; complete T001 before T002 and T003.
- **Foundational (Phase 2)**: Begins after setup. T005 can run alongside T004; T006 depends on T004.
- **User stories (Phases 3-6)**: Begin after foundational work. Implement in priority order for the incremental MVP sequence.
- **Polish (Phase 7)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on setup and foundation; independently delivers add, view, and persistence.
- **US2 (P2)**: Depends on US1's goal board and row; adds current-goal actions and completed-state transitions.
- **US3 (P3)**: Depends on US1's goal row and date helper. It shares `src/components/goal-item.tsx` and `src/components/goal-board.tsx` with US2, so schedule it after US2 to avoid conflicting edits.
- **US4 (P4)**: Depends on US2's completed-goal state; adds deletion from the completed column.

### Parallel Opportunities

- After setup, T004 and T005 can proceed in parallel; T006 follows T004.
- Within US1, T007, T008, and T009 can proceed in parallel after setup/foundation; T010 integrates them and T011 wires the board into the route.
- Within US3, T014 and T015 touch different files and can proceed in parallel after US1; story-level delivery is scheduled after US2 because those files are shared.
- US2 and US4 share the board and row files and should be implemented sequentially.

## Implementation Strategy

### MVP First

1. Complete setup and foundational tasks.
2. Complete US1 and manually verify adding, validation, empty states, persistence, and responsive layout.
3. Stop at the US1 checkpoint for the first usable increment; US2-US4 add value in priority order.

### Incremental Delivery

1. Deliver US1: add and see current goals.
2. Deliver US2: complete or permanently delete a current goal.
3. Deliver US3: identify urgent and overdue current goals.
4. Deliver US4: permanently delete completed goals.
5. Perform the cross-cutting manual review in the quickstart guide.
