# Feature Specification: Goal Drag-and-Drop Reordering

**Feature Branch**: `[002-reorder-goals-drag-drop]`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "drag and drop - lets make so that users can reorder goals by dragging and dropping them above or below other goals in the list."

## Clarifications

### Session 2026-10-29

- Q: If the goal list changes while a user is dragging (for example, another update arrives before drop), which order should win? → A: Reject the drop, refresh to latest list, and ask the user to retry.
- Q: Should goal reordering support keyboard-only interaction in addition to pointer drag-and-drop? → A: Drag-and-drop only; no keyboard reordering support in this feature.
- Q: When goals are filtered or grouped in the UI, should users be allowed to reorder across items that are currently hidden? → A: No, only allow reordering within currently visible goals.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reorder goals in a list (Priority: P1)

As a user managing goals, I can drag a goal and drop it above or below another goal so I can prioritize what matters most.

**Why this priority**: Reordering is the primary value requested and directly impacts daily goal planning.

**Independent Test**: Can be fully validated by moving one goal to a new position and confirming the displayed order updates immediately and correctly.

**Acceptance Scenarios**:

1. **Given** a user has multiple goals in a list, **When** the user drags one goal and drops it above another goal, **Then** the moved goal appears in the new position and all other goals shift accordingly.
2. **Given** a user has multiple goals in a list, **When** the user drags one goal and drops it below another goal, **Then** the moved goal appears in the new position and all other goals shift accordingly.

---

### User Story 2 - Keep reordered goals after leaving the page (Priority: P2)

As a user, I want my reordered goal list to stay in the same order after I leave and return so my priorities are not lost.

**Why this priority**: Reordering is only useful if changes persist beyond the current view.

**Independent Test**: Can be validated by reordering goals, navigating away, returning, and confirming the same order remains.

**Acceptance Scenarios**:

1. **Given** a user has changed goal order, **When** the user reloads the page or returns later, **Then** the goals appear in the saved order.

---

### User Story 3 - Recover gracefully from invalid drops or save failures (Priority: P3)

As a user, I want clear behavior when a drag action is canceled or cannot be saved so I can trust the goal list state.

**Why this priority**: Predictable failure handling reduces confusion and prevents accidental priority changes.

**Independent Test**: Can be validated by canceling a drag action and by simulating a failed save, then confirming the list state and user feedback are clear.

**Acceptance Scenarios**:

1. **Given** a user starts dragging a goal, **When** the user drops it back to its original position or cancels the action, **Then** the list order remains unchanged.
2. **Given** a user reorders a goal, **When** the reorder cannot be saved, **Then** the user is informed that the change failed and the list returns to the last saved order.

---

### Edge Cases

- What happens when a user drags the first goal to the top or the last goal to the bottom (no positional change)?
- How does the system handle dropping a goal back into its original location?
- If the goal list changes between drag start and drop completion, the drop is rejected, the latest list order is shown, and the user is prompted to retry.
- What happens if a user performs multiple rapid reorder actions in sequence?
- Reordering applies only within currently visible goals; hidden goals outside the current filtered/grouped view are not reorder targets.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to drag any goal in their visible goal list and drop it above or below another goal.
- **FR-002**: System MUST provide clear visual feedback during drag-and-drop that indicates the currently selected goal and intended drop position.
- **FR-003**: System MUST update the displayed goal order immediately after a valid drop action.
- **FR-004**: System MUST preserve the relative order of goals not directly moved by the user.
- **FR-005**: System MUST persist the updated goal order so it remains consistent across page reloads and subsequent sessions for the same user.
- **FR-006**: System MUST treat drops that do not change position as no-op actions and keep the existing saved order unchanged.
- **FR-007**: System MUST show a clear error message when a reorder cannot be saved and revert to the most recently saved order.
- **FR-008**: System MUST apply user reorder actions in the same sequence they were completed when multiple reorder actions occur close together.
- **FR-009**: System MUST reject a drop when list order has changed since drag start, refresh to the latest saved order, and prompt the user to retry the reorder.
- **FR-010**: System MUST support reordering through pointer-based drag-and-drop only for this feature iteration.
- **FR-011**: System MUST allow reorder operations only within goals currently visible in the active list view and MUST NOT reorder hidden goals outside that view.

### Key Entities *(include if feature involves data)*

- **Goal**: A user-defined objective in the list, including a unique identity, display content, and an order position.
- **Goal Order State**: The ordered arrangement of all goals for a specific user at a point in time.
- **Reorder Action**: A user-triggered movement of a goal from one position to another, with source position, target position, and completion time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of drag-and-drop reorder attempts result in the goal appearing in the intended position on first try.
- **SC-002**: 100% of successfully completed reorder actions remain intact after page reload for the same user.
- **SC-003**: In usability validation, at least 90% of users can reorder a specified goal above or below another goal without assistance on their first attempt.
- **SC-004**: Goal-priority update tasks are completed at least 30% faster compared with manual reorder alternatives previously used in the product.

## Assumptions

- Reordering applies to the current user's own goal list and does not modify goals owned by other users.
- Goals are displayed in a single ordered list where each goal has one active position at a time.
- Real-time collaborative editing of the same goal list by multiple users is out of scope for this feature iteration.
- Existing goal creation, editing, and completion behavior remains unchanged by this feature.
- Keyboard-only reordering support is out of scope for this feature iteration.
- Cross-view/global reordering of hidden goals is out of scope for this feature iteration.
