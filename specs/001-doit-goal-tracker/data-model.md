# Data Model: doit Goal Tracker

## Goal

One user's goal stored in the browser's local storage.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable, unique identifier generated with the browser's `crypto.randomUUID()` when a goal is created. |
| `title` | string | Trimmed, non-empty user-visible title. |
| `endDate` | string | Canonical, actual date-only ISO value (`YYYY-MM-DD`), interpreted in the user's local calendar with date-fns `parseISO`. Creation rejects a date before today; an existing goal can become overdue as time passes. |
| `status` | `current \| completed` | Starts as `current`; can transition to `completed`; completed goals cannot transition back in this version. |

No account, user ID, server record, completion timestamp, or sensitive credential is required. The checkbox selection used to reveal current-goal actions is transient UI state and is not part of the persisted entity.
No account, user ID, server record, completion timestamp, or sensitive credential is required. Checkbox selection used to reveal a goal's actions is transient UI state for either status and is not part of the persisted entity.

## Derived Values

- `daysLeft` is `differenceInCalendarDays(endDate, today)` using the user's local calendar date. It is not stored. Refresh `today` at local midnight and when the page becomes visible after being backgrounded.
- `daysLeft <= 3` marks a current goal as urgent, including overdue goals.
- Display text distinguishes overdue, due today, and future dates. Completed goals do not receive current-goal urgency styling.
- Current goals are ordered by ascending end date; ties retain their existing relative order. Completed goals retain their existing relative order.

## Lifecycle

1. Creation validates the trimmed title and local date, assigns a unique ID, and adds a `current` record.
2. Checking a current or completed goal selects it for actions without changing the persisted record.
3. Unchecking clears that transient selection.
4. Moving a selected current goal sets its status to `completed`.
5. Deleting a current or completed goal removes its record permanently.

Editing and restoring completed goals are out of scope.

## Persistence

- Store the goal array as JSON under a namespaced, versioned key such as `doit:goals:v1`.
- Read only in the browser after the client surface mounts; do not access `window` or `localStorage` during server rendering.
- Validate the stored JSON and record shape before rendering it. Do not silently overwrite malformed data.
- Catch storage access and write failures. Keep the interface usable where possible, but clearly tell the user when data could not be loaded or saved; do not claim a failed write was persisted.
- A schema change requires an explicit migration or a new storage-key version.
- Persistence is isolated to the same browser profile and origin; no synchronization is provided.
