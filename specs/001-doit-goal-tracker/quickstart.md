# Quickstart: doit Goal Tracker

## Prerequisites

- The Next.js application scaffold and its package manifest are present at the repository root. They are not present in the planning-only repository state observed on 2026-10-29.
- Install the current stable Node.js/npm version supported by the selected Next.js release.
- Use a current evergreen browser with local storage enabled; persistence is scoped to the current origin and browser profile.

## Start the Application

From the repository root, install the declared dependencies and start the development server:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000/` in a browser. Keep this process running during the manual walkthrough.

## Manual Walkthrough

1. Open the page with no saved goals. Confirm the `doit` heading, both goal columns, and their empty states appear after saved data has loaded.
2. Open Add goal. Submit an empty title, whitespace-only title, empty date, and past date in separate attempts; confirm each is blocked with an associated, understandable message. Submit a valid title and today or future date; confirm the dialog closes and the new current goal appears.
3. Reload the page. Confirm the goal and its current status remain.
4. Create goals due today, in three days, and in four days. Confirm the first two are highlighted, the third is not, and each displays the correct local calendar-day text. For an overdue-state walkthrough, change a disposable goal's date to yesterday in the browser's storage inspector and reload; confirm it is marked overdue and highlighted.
5. Check a current goal. Confirm Move to completed and Delete actions appear. Uncheck it and confirm the actions disappear without moving the goal. Check it again, move it to completed, and confirm the goal leaves the current column and appears in the completed column.
6. Select a current goal and activate its goal-specific Delete action. Select a completed goal and activate its goal-specific Delete action. Confirm each disappears immediately and remains absent after reload; neither action offers undo.
7. Complete the add and manage flows using only a keyboard. Confirm visible focus, dialog focus entry/containment/return, Escape dismissal, field labels and validation associations, checkbox state, goal-specific action names, and non-focus-stealing announcements for save and failure states.
8. Review contrast of text, controls, and focus indicators against WCAG 2.2 AA thresholds. Confirm pointer targets meet 24 by 24 CSS pixels or a documented exception, and that no information is conveyed by color alone.
9. At 200% text resize and 400% zoom/reflow, confirm no content or functionality is lost and no two-dimensional scrolling is needed. Apply WCAG text-spacing overrides and confirm the content remains usable.
10. Check the layout at 320px, tablet, and desktop widths. Confirm both columns remain usable and there is no horizontal scrolling.

This guide describes human-performed review only. The project constitution forbids automated or scripted checks and test tasks.
