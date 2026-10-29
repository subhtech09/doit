# Implementation Plan: doit Goal Tracker

**Branch**: `001-doit-goal-tracker` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-doit-goal-tracker/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a single-user goal tracker with current and completed goal columns, add/complete/delete flows, local-calendar due dates, and browser-local persistence. Use the latest stable Next.js App Router, React, TypeScript, Tailwind CSS `@theme` tokens, selected shadcn/ui components, `date-fns`, and `localStorage`; keep the UI responsive and conformant to WCAG 2.2 AA for the core flows.

**Workspace note**: The setup script reports feature branch `001-doit-goal-tracker`; Git currently reports checked-out branch `main`. Planning is scoped to the feature directory and does not switch branches.

## Technical Context
**Language/Version**: TypeScript; use the latest stable version supported by the selected Next.js scaffold.

**Primary Dependencies**: Latest stable Next.js and React; latest stable Tailwind CSS using `@theme`; shadcn/ui-generated Button, Checkbox, Dialog, Input, and Label components; `date-fns` for local calendar-day calculations and date formatting.

**Storage**: Versioned, namespaced browser `localStorage`; no server storage or cross-device synchronization.

**Verification**: Manual review only. Automated or scripted tests, test dependencies, test scripts, and test tasks are forbidden by Constitution Principle I.

**Target Platform**: Current evergreen desktop and mobile browsers, from 320px wide through large desktop displays.

**Project Type**: Single-project Next.js App Router web application; no backend or external API.

**Performance Goals**: No custom numeric target. Support a small personal goal list with immediate local interactions and no server round-trip.

**Constraints**: Single user and browser origin; browser storage is only available client-side and can be blocked; hydration-safe client storage loading; local calendar-day semantics refreshed at local midnight and on tab visibility; responsive layout; WCAG 2.2 AA for goal creation and management, including guarded deletion; no editing goals, restoring completed goals, or undoing deletions.

**Scale/Scope**: One primary screen, one creation dialog, one local goal collection, and a small set of focused components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Result |
|---|---|---|
| I. No Testing | Use manual walkthroughs only; add no automated/scripted tests, test packages, scripts, or test tasks. | PASS |
| II. Clean Code | Keep components and date/storage helpers small, single-purpose, and free of duplicated state logic. | PASS |
| III. Simple UI | Implement only the specified goal flows with semantic controls; omit decorative effects and unrequested features. | PASS |
| IV. Responsive Design | Use mobile-first Tailwind layout and verify manually from 320px upward without horizontal scrolling. | PASS |
| V. Minimal Dependencies | Use requested `date-fns` and only shadcn/ui component code and dependencies required by selected primitives; add no backend or unrelated packages. | PASS, justified |
| VI. Latest Stable Core Stack | Use stable Next.js, React, and Tailwind CSS releases; use Tailwind v4 `@theme` as requested. | PASS |
| VI. Latest Stable Core Stack | Use stable Next.js, React, and Tailwind CSS releases; use Tailwind v4 `@theme` as requested. | PASS |
| WCAG 2.2 AA | Use checkbox selection plus a separate goal-specific action as the deletion safeguard (WCAG G155); preserve the two-interaction target without undo. | PASS |

**Gate result**: PASS. No constitutional violations are planned. The additional date utility and shadcn-generated primitive dependencies are explicitly requested and narrowly scoped.

## Project Structure

### Documentation (this feature)

```text
specs/001-doit-goal-tracker/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
```text
src/
├── app/
│   ├── globals.css              # Tailwind import and @theme design tokens
│   ├── layout.tsx               # Root metadata and shared document layout
│   └── page.tsx                 # App entry point
├── components/
│   ├── goal-board.tsx           # Client state, columns, and goal actions
│   ├── goal-form-dialog.tsx     # Accessible add-goal dialog and validation
│   ├── goal-item.tsx            # Current/completed goal presentation and guarded actions
│   └── ui/                      # Only required generated shadcn/ui primitives
├── lib/
│   ├── goal-dates.ts            # Date-only parsing, formatting, and day counts
│   └── goal-storage.ts          # Browser persistence and stored-data validation
└── types/
  └── goal.ts                  # Goal record and status types
```

**Structure Decision**: Greenfield single-project Next.js App Router layout under `src/`. The repository currently has no application source or package manifest; this tree describes the planned implementation, not existing files. No `tests/` tree is created, per Constitution Principle I.

## Complexity Tracking

No constitution violations. The explicitly requested `date-fns` package and selected shadcn/ui primitives are justified above and in [research.md](research.md); no unrelated dependencies or architecture layers are planned.
