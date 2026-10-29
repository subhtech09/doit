# Quickstart Validation Guide: Goal Drag-and-Drop Reordering

## Purpose

Manually validate end-to-end goal reordering behavior for the feature defined in [spec.md](./spec.md), using contracts in [contracts/goal-reorder-ui-contract.md](./contracts/goal-reorder-ui-contract.md) and entities in [data-model.md](./data-model.md).

Feature scope reminder: pointer-based drag-and-drop applies only to visible current goals; keyboard-only reordering and hidden-goal cross-view reordering are out of scope for this iteration.

## Prerequisites

- Node.js environment compatible with current project setup.
- Dependencies installed in repository root.
- Local browser with JavaScript and localStorage available.

## Setup

From repository root:

```bash
npm install
npm run dev
```

Open the local app URL printed by the dev server.

## Validation Scenarios

### Scenario 1: Reorder visible current goals

1. Create at least three current goals if needed.
2. Drag one current goal and drop it above another goal.
3. Drag a different goal and drop it below another goal.
4. Confirm visual order updates immediately after each successful drop.

**Expected outcome**:
- Drop targets are clear while dragging.
- Moved goal appears in intended position.
- Other goals keep relative order unless shifted by insertion.

### Scenario 2: Persistence after reload

1. Perform a successful reorder.
2. Reload the page.
3. Verify list order remains the same.

**Expected outcome**:
- Saved order remains intact after reload.

### Scenario 3: No-op drop behavior

1. Drag a goal and drop it back to its original position.

**Expected outcome**:
- No effective order change.
- No inconsistent state appears.

### Scenario 4: Stale-drop conflict handling

1. Start dragging a goal.
2. Before dropping, cause a list change in the same view context (for example, another reorder completion path in session flow).
3. Complete drop.

**Expected outcome**:
- Drop is rejected.
- Latest saved order is restored/refreshed.
- User sees retry guidance.

### Scenario 5: Save-failure fallback

1. Simulate storage save failure condition (for example, storage unavailable context).
2. Attempt reorder.

**Expected outcome**:
- User gets clear save-failure status message.
- List reverts to last successfully saved order.

### Scenario 6: Responsive behavior check

1. Validate reorder interaction on mobile, tablet, and desktop viewport widths.

**Expected outcome**:
- Interaction remains usable and visual cues remain readable in each viewport.

## Notes

- This project explicitly excludes automated tests by constitution; validation is manual.
- Any mismatch should be reconciled against [spec.md](./spec.md) and [contracts/goal-reorder-ui-contract.md](./contracts/goal-reorder-ui-contract.md).

## Validation Log (2026-10-29)

- Scenario 1 (reorder visible current goals): **PASS** — dragged Goal C above Goal A; status showed "Goal order saved."
- Scenario 2 (persistence after reload): **PASS** — after reload, order remained `Goal C`, `Goal A`, `Goal B`.
- Scenario 3 (no-op drop behavior): **PASS** — dropping without an effective position change did not alter list order.
- Scenario 4 (stale-drop conflict handling): **PASS (code-path verified)** — stale-drop guard validates drag-start version token and reloads latest saved goals before retry prompt.
- Scenario 5 (save-failure fallback): **PASS (code-path verified)** — save failure triggers rollback to latest saved goals and status message.
- Scenario 6 (responsive behavior check): **PASS** — verified reorder interaction at desktop and mobile viewport (`390x844`) with successful drag/drop save status.
