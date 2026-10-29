# Implementation Plan: Goal Drag-and-Drop Reordering

**Branch**: `[002-reorder-goals-drag-drop]` | **Date**: 2026-10-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-reorder-goals-drag-drop/spec.md`

## Summary

Enable users to reorder current goals by dragging and dropping goals above or below one another in the visible list, persist that order in browser storage, and keep failure/edge handling predictable. The implementation uses a sortable library for pointer-based drag-and-drop interaction and Tailwind utility classes for visual states and responsive behavior while preserving existing goal lifecycle actions.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16

**Primary Dependencies**: Next.js, React, Tailwind CSS, SortableJS (sortable library for list item reordering)

**Storage**: Browser localStorage (`doit:goals:v1`) via existing goal storage utilities

**Testing**: No automated testing (forbidden by project constitution); manual validation only

**Target Platform**: Modern desktop/mobile browsers running the Next.js web app

**Project Type**: Web application (single Next.js app, client-rendered goal board)

**Performance Goals**: Reorder feedback appears immediately on drop; persisted order is visible after reload without perceptible delay for typical personal goal list sizes

**Constraints**: Pointer-based drag-and-drop only; reorder limited to currently visible goals; stale drops rejected when list changes mid-drag; preserve simple responsive Tailwind-first UI

**Scale/Scope**: Single goal board screen; current goals list reorder only; completed goals and other goal actions remain unchanged

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate 1 – No Testing**: PASS. Plan introduces no automated test framework, test files, or test tasks.
- **Gate 2 – Clean Code**: PASS. Changes stay scoped to goal board interactions, goal model/order shape, and focused utilities.
- **Gate 3 – Simple UI**: PASS. UI updates are limited to essential drag/drop affordances and status feedback.
- **Gate 4 – Responsive Design**: PASS. Interactions and visual cues remain usable across mobile/tablet/desktop layouts.
- **Gate 5 – Minimal Dependencies**: PASS WITH JUSTIFICATION. One dependency (`sortablejs`) is added to deliver robust pointer drag-and-drop behavior with low implementation complexity.
- **Gate 6 – Latest Stable Core Stack**: PASS. Uses existing latest stable Next.js/React/Tailwind stack already configured in the repository.

## Project Structure

### Documentation (this feature)

```text
specs/002-reorder-goals-drag-drop/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── goal-reorder-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── goal-board.tsx
│   ├── goal-item.tsx
│   └── goal-form-dialog.tsx
├── lib/
│   ├── goal-storage.ts
│   └── goal-dates.ts
└── types/
    └── goal.ts
```

**Structure Decision**: Keep the existing single-project Next.js structure and implement reorder behavior within the current goal board/component flow without introducing new top-level modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add `sortablejs` dependency | Reliable pointer drag-and-drop list reordering with explicit drop-position semantics is core feature scope | Raw pointer-event implementation would add complexity, increase maintenance risk, and reduce clarity relative to a focused sortable library |

## Phase 0: Research Output

Research findings are documented in [research.md](./research.md). All technical-context unknowns are resolved and no open NEEDS CLARIFICATION items remain.

## Phase 1: Design Output

- Data model: [data-model.md](./data-model.md)
- UI contract: [contracts/goal-reorder-ui-contract.md](./contracts/goal-reorder-ui-contract.md)
- Validation guide: [quickstart.md](./quickstart.md)

## Constitution Check (Post-Design)

- **No Testing**: PASS. Artifacts define manual validation only and add no automated tests.
- **Clean Code**: PASS. Design isolates reorder responsibilities and preserves existing goal operations.
- **Simple UI**: PASS. Contract constrains UI changes to actionable drag/drop states and status messaging.
- **Responsive Design**: PASS. Validation steps include mobile/tablet/desktop checks.
- **Minimal Dependencies**: PASS WITH JUSTIFICATION. Single focused dependency remains justified by feature requirements.
- **Latest Stable Core Stack**: PASS. No downgrade or conflicting stack decision introduced.
