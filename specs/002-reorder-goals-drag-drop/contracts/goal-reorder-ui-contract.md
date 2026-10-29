# UI Contract: Goal Reorder Interaction

## Scope

Defines the user-facing interaction contract for drag-and-drop reordering of current goals in the board UI.

## Inputs

- Pointer drag start on a current-goal list item.
- Pointer drag move across visible current-goal list.
- Pointer drop above/below a visible current-goal list item.

## Preconditions

- User is viewing the goal board with at least two current goals.
- Reorder applies only to goals visible in the active list context.
- Completed goals are not reorder targets.

## Behavior Contract

1. On drag start:
   - The dragged item is visually distinguished as active.
   - A list snapshot version token is captured.
2. During drag:
   - The intended insertion position is visually indicated.
3. On drop:
   - If dropped to same position, no persistent change is made.
   - If list version has changed since drag start, drop is rejected, latest order is restored, and user receives retry guidance.
   - If position is valid and version unchanged, list order updates immediately and save is attempted.
4. On save success:
   - Updated order remains visible and persists on reload.
   - Status message confirms successful reorder.
5. On save failure:
   - Order reverts to last saved state.
   - Status message explains save failure.

## Error/Edge Handling Contract

- Invalid drop target: action is canceled with no order change.
- Stale list snapshot at drop: action rejected with refresh and retry message.
- Storage unavailable/error: revert and show failure message.
- Rapid sequential drops: apply in completion order.

## Non-Goals / Out of Scope

- Keyboard-only reordering.
- Reordering hidden goals not in active visible list.
- Reordering completed goals.
- Multi-user real-time collaborative reorder.

## Observable Outcomes

- Users can move goals above or below other visible goals via pointer drag-and-drop.
- Persisted goal order remains stable across page reload.
- Conflict and failure conditions never silently overwrite or lose last saved order.
