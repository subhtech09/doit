# UI Contract: doit Goal Tracker

## Surface

- Route: `/`.
- The page identifies the app as `doit` and presents Current goals and Completed goals.
- The columns sit side by side where space allows and stack on narrow viewports without horizontal scrolling at 320px.
- No network API or external service is exposed by this feature.

## Goal Creation

- The Add goal button opens a modal dialog containing required Title and End date fields, plus submit and cancel controls.
- The end-date input accepts today or a future local date; empty, malformed, or past dates prevent submission with an understandable field-level message.
- A blank or whitespace-only title prevents submission with an understandable field-level message.
- Successful submission creates a current goal, persists it, closes the dialog, and shows the goal in the current list.
- Cancel, Escape, or dialog dismissal closes the dialog without creating a goal.

## Goal Actions

- Current goals display title, local calendar days remaining, and a checkbox.
- Checking a goal reveals Move to completed and Delete actions for that goal. Unchecking hides those actions without changing the goal.
- Completed goals display a checkbox that reveals a goal-specific Delete action; unchecking hides the action without changing the goal.
- Move to completed changes the status and moves the goal to the completed column.
- Delete permanently removes the selected goal immediately when its goal-specific Delete action is activated; no undo or extra confirmation step is added. Requiring selection plus a separate goal-specific action provides a deletion safeguard within the two-interaction success target.
- Completed goals remain visible and can be selected for permanent deletion.
- Current goals are sorted by soonest end date. Completed goals keep their current relative order.
- Goals at or past their end date show an overdue state; goals due today show Due today; other goals show a whole-calendar-day count.
- A current goal is highlighted when its remaining-day count is three or fewer. Meaning is also conveyed in text, not color alone.

## Accessibility

- Use semantic headings, lists, buttons, labels, and form controls with accessible names.
- Dialog open/close behavior supports keyboard operation, moves focus into the dialog, contains focus while open, and returns focus to the opener when dismissed.
- Validation messages are associated with their fields and announced to assistive technology.
- Goal-specific actions have names that identify the affected goal; state changes are announced through an appropriate polite status region.
- All actions are keyboard operable with a visible focus indicator.
- Pointer targets are at least 24 by 24 CSS pixels unless a WCAG 2.5.8 exception applies.
- Core flows meet WCAG 2.2 AA, including at least 4.5:1 contrast for normal text, 3:1 for large text, and 3:1 for meaningful control boundaries and focus indicators. Layout remains usable at 200% text resize, 400% zoom/reflow, and WCAG text-spacing overrides without losing content or functionality.

## Persistence and Loading

- Existing goals load from the current origin's versioned local-storage collection before empty states are shown.
- Add, complete, and delete operations persist to local storage.
- If stored data is malformed or storage is unavailable, show a clear recovery or persistence message; never report an unsaved change as saved.
