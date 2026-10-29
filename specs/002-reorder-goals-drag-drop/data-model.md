# Data Model: Goal Drag-and-Drop Reordering

## Entity: Goal

- **Purpose**: Represents a single user goal item displayed in the board.
- **Fields**:
  - `id` (string): Unique goal identifier.
  - `title` (string): User-visible goal text.
  - `endDate` (string): Canonical goal date used for status context.
  - `status` (`current` | `completed`): Lifecycle state.
  - `orderIndex` (number): Explicit user-defined ordering position within the `current` goals list.
- **Validation Rules**:
  - `id` must be non-empty and unique per user goal list.
  - `title` must be non-empty after trimming.
  - `endDate` must be canonical date format accepted by current date utility.
  - `status` must be one of allowed lifecycle values.
  - `orderIndex` must be an integer `>= 0`.

## Entity: Goal Order State

- **Purpose**: Represents persisted ordering arrangement for a user’s visible current goals.
- **Fields**:
  - `goalIdsInOrder` (array of string): Ordered sequence of current-goal IDs in active view.
  - `versionToken` (string): Snapshot token used to detect list changes between drag start and drop.
  - `updatedAt` (timestamp-like string): Last successful order save marker for user messaging and conflict handling.
- **Validation Rules**:
  - `goalIdsInOrder` contains only unique IDs.
  - All IDs in sequence refer to existing `current` goals in active list context.
  - Hidden/out-of-view goals are excluded from reorder operation scope.

## Entity: Reorder Action

- **Purpose**: Captures one user drag-drop reorder attempt and its outcome.
- **Fields**:
  - `draggedGoalId` (string): Goal being moved.
  - `sourceIndex` (number): Original index in current visible list.
  - `targetIndex` (number): Intended drop index in current visible list.
  - `startedWithVersionToken` (string): List version seen at drag start.
  - `applied` (boolean): Whether reorder was accepted and saved.
  - `failureReason` (string, optional): User-displayable reason when action is rejected.
- **Validation Rules**:
  - `sourceIndex` and `targetIndex` must map to visible-list boundaries.
  - No-op moves (`sourceIndex == targetIndex`) are accepted as non-mutating actions.
  - Action is rejected if `startedWithVersionToken` differs from latest saved version at drop.

## Relationships

- One `Goal Order State` references many `Goal` items through ordered ID sequence.
- One `Reorder Action` references exactly one `Goal`.
- A successful `Reorder Action` updates `Goal.orderIndex` values and refreshes `Goal Order State.versionToken`.

## State Transitions

- **Goal lifecycle**:
  - `current` → `completed` (unchanged behavior from existing board actions).
- **Reorder action lifecycle**:
  - `started` → `dropped`
  - `dropped` → `applied` (if version and position checks pass)
  - `dropped` → `rejected` (if stale list, invalid target, or save failure)

## Notes

- Reordering is scoped to visible current-goal list only.
- Completed goals are excluded from draggable reorder operations.
