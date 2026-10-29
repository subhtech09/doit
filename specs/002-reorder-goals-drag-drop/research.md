# Phase 0 Research: Goal Drag-and-Drop Reordering

## Decision 1: Use SortableJS for pointer drag-and-drop ordering

- **Decision**: Implement list reordering with the SortableJS library for current-goal items.
- **Rationale**: The feature requires reliable drag-and-drop placement above/below list items. SortableJS provides mature list reordering behavior, drop-position handling, and predictable event sequencing with less custom interaction code.
- **Alternatives considered**:
  - Build custom pointer-event reorder logic: rejected due to higher complexity and higher risk of edge-case bugs.
  - Use another drag library with broader scope: rejected because current need is narrow list sorting behavior.

## Decision 2: Keep Tailwind CSS as the only styling mechanism for reorder states

- **Decision**: Style drag, placeholder, and drop-target feedback using existing Tailwind utility patterns in component markup.
- **Rationale**: Tailwind is already adopted and constitution guidance prefers simple utility-first styling with minimal extra abstractions.
- **Alternatives considered**:
  - Add custom CSS module/theme layer for drag states: rejected to avoid additional complexity.
  - Add a new styling dependency: rejected by minimal-dependency principle.

## Decision 3: Persist explicit list order in existing localStorage goal records

- **Decision**: Extend goal persistence shape to preserve user-defined order for current goals across reloads.
- **Rationale**: The specification requires persistence of reordered goals and currently uses browser localStorage for goal state. Keeping persistence in the same storage path avoids introducing external services.
- **Alternatives considered**:
  - Keep date-based derived sort only: rejected because it conflicts with user-driven custom order.
  - Persist order in a separate storage key: rejected to avoid split-source state drift.

## Decision 4: Resolve mid-drag list change conflicts by rejecting stale drop

- **Decision**: If the list changes between drag start and drop, reject the drop, refresh to latest saved order, and prompt retry.
- **Rationale**: This matches spec clarification and avoids silently overwriting newer list state.
- **Alternatives considered**:
  - Force apply stale drop over latest list: rejected due to overwrite risk.
  - Attempt automatic merge against hidden/latest state: rejected due to ambiguous behavior and higher complexity.

## Decision 5: Keep interaction scope pointer-only for this feature iteration

- **Decision**: Deliver pointer-based drag-and-drop reordering only; keyboard reordering remains out of scope.
- **Rationale**: Explicit clarification defines this boundary and keeps implementation focused for current iteration.
- **Alternatives considered**:
  - Add keyboard reorder controls now: rejected as scope expansion beyond clarified requirement.
  - Disable reorder on some view modes entirely: rejected because visible-list scoped reordering is already clarified.
