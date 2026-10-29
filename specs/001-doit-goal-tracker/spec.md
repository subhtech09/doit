# Feature Specification: doit Goal Tracker

**Feature Branch**: `001-doit-goal-tracker`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Initial page setup = this application should be a goal tracking web app called "doit". There should be 2 columns - a left one where current goals are shown, alongwith how many days left for the user to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Lets use a modern light theme with pastel colours."

## Clarifications

### Session 2026-10-29

- Q: What accessibility level should the goal creation and goal management flows meet? → A: Meet WCAG 2.2 AA for the core flows, including keyboard access, accessible names, focus handling, and contrast.

## User Scenarios & Testing *(mandatory)*

<!--
  Per the project constitution (Principle I), no automated tests are written. Scenarios below
  are verified manually.
-->

### User Story 1 - Add and see current goals (Priority: P1)

A user opens "doit" and sees a two-column page. The left column lists current goals, each
showing its title and how many days are left until its end date. The user clicks an "Add goal"
button, a modal opens with a title field and an end date field, and after submitting, the new
goal appears in the left column.

**Why this priority**: Without the ability to add and view goals, the app has no value. This is
the minimum viable product.

**Independent Verification**: Open the page, add a goal with a title and a future end date, and
confirm it appears in the left column with the correct days left.

**Acceptance Scenarios**:

1. **Given** the page is open, **When** the user clicks the add-goal button, **Then** a modal
   opens with a title field and an end date field.
2. **Given** the modal is open with a valid title and a future end date, **When** the user
   submits, **Then** the modal closes and the goal appears in the current goals column with
   its days left.
3. **Given** the modal is open, **When** the user cancels or dismisses it, **Then** the modal
   closes and no goal is added.
4. **Given** there are no goals, **When** the page loads, **Then** both columns show a
   friendly empty state.

---

### User Story 2 - Complete a goal (Priority: P2)

A user checks the checkbox on a current goal. The user is then offered two choices: move the
goal to the completed column, or permanently delete it.

**Why this priority**: Completing goals is the core purpose of tracking them, and it
populates the right-hand column.

**Independent Verification**: Check a goal, choose "move to completed", and confirm it
appears in the right column and is gone from the left column.

**Acceptance Scenarios**:

1. **Given** a current goal, **When** the user checks its checkbox, **Then** the options
   "Move to completed" and "Delete" become available for that goal.
2. **Given** a checked goal, **When** the user chooses "Move to completed", **Then** the goal
   leaves the current column and appears in the completed column.
3. **Given** a checked goal, **When** the user chooses "Delete", **Then** the goal is
   permanently removed from the page and appears in neither column.
4. **Given** a checked goal, **When** the user unchecks it, **Then** the options disappear
   and the goal stays in the current column unchanged.

---

### User Story 3 - Urgent goals are highlighted (Priority: P3)

Goals whose end date is within the next 3 days are visually highlighted in the current column
so the user can spot what needs attention first.

**Why this priority**: It improves usefulness but the app works without it.

**Independent Verification**: Add goals ending today, in 3 days, and in 4 days; confirm only
the first two are highlighted.

**Acceptance Scenarios**:

1. **Given** a current goal with 3 or fewer days left, **When** the column is displayed,
   **Then** that goal is visually highlighted.
2. **Given** a current goal with more than 3 days left, **When** the column is displayed,
   **Then** it is not highlighted.
3. **Given** a goal whose end date has passed, **When** the column is displayed, **Then** it
   is highlighted and shows that it is overdue.

---

### User Story 4 - Manage completed goals (Priority: P4)

A user views completed goals in the right column and can permanently delete any of them.

**Why this priority**: It keeps the completed list tidy but is secondary to tracking goals.

**Independent Verification**: Move a goal to completed, then delete it from the right column.

**Acceptance Scenarios**:

1. **Given** a completed goal, **When** the user chooses to delete it, **Then** it is
   permanently removed.

---

### Edge Cases

- Title is empty or only whitespace: submission is blocked with a clear message.
- End date is empty or in the past: submission is blocked with a clear message.
- Very long titles: the title wraps or truncates without breaking the layout.
- Goal ends today: shows "0 days left" (or "Due today") and is highlighted.
- Goal is past its end date: shows an overdue indicator and is highlighted.
- Many goals: each column scrolls or grows without breaking the page layout.
- Page reloaded or closed and reopened: all goals and their state are still present.
- Narrow (mobile) screens: the two columns stack so that both remain usable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST be named "doit" and display that name on the page.
- **FR-002**: The page MUST show two columns: current goals on the left and completed goals
  on the right.
- **FR-003**: Each current goal MUST show its title and the number of days left until its end
  date.
- **FR-004**: The page MUST provide a button that opens a modal form for creating a new goal.
- **FR-005**: The new goal form MUST contain a title field and an end date field, and both
  MUST be required.
- **FR-006**: The system MUST reject a goal with an empty title or an end date in the past,
  and tell the user why.
- **FR-007**: Each current goal MUST have a checkbox.
- **FR-008**: When a goal is checked, the user MUST be able to either move it to the
  completed column or permanently delete it.
- **FR-009**: Unchecking a goal MUST return it to its normal unchecked state without changing
  its column.
- **FR-010**: Goals with 3 or fewer days left (including overdue goals) MUST be visually
  highlighted in the current column.
- **FR-011**: Completed goals MUST be shown in the right column and MUST be deletable.
- **FR-012**: Deleting a goal MUST be permanent.
- **FR-013**: Goals and their completed state MUST persist across page reloads on the same
  device and browser.
- **FR-014**: The interface MUST use a modern light theme with pastel colours.
- **FR-015**: The interface MUST be simple and MUST remain usable on mobile, tablet and
  desktop screen sizes.
- **FR-016**: The goal creation and goal management flows MUST conform to WCAG 2.2 AA,
  including keyboard access, accessible names, focus handling, and contrast.

### Key Entities *(include if feature involves data)*

- **Goal**: A target the user wants to achieve. Attributes: title, end date, status (current
  or completed). Days left is derived from the end date and today's date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new goal in under 15 seconds from the main page.
- **SC-002**: A user can complete (move) or delete a goal in no more than 2 interactions
  after locating it.
- **SC-003**: 100% of goals with 3 or fewer days left are highlighted, and 0% of goals with
  more than 3 days left are.
- **SC-004**: 100% of goals remain after reloading the page.
- **SC-005**: The full interface is usable without horizontal scrolling on screens from 320px
  wide up to large desktop displays.
- **SC-006**: A first-time user can add and complete a goal without any instructions.
- **SC-007**: The goal creation and goal management flows conform to WCAG 2.2 AA, including
  keyboard access, accessible names, focus handling, and contrast.

## Assumptions

- The app is for a single user with no accounts or login; goals are stored on the user's own
  device and browser and are not synced across devices.
- "Days left" is counted in whole calendar days relative to the user's local date.
- "Within 3 days" means 3 or fewer days left, including today and overdue goals.
- Goals cannot be edited after creation in this version.
- Moving a completed goal back to the current column is out of scope.
- Deleting is immediate and permanent once the user chooses Delete, with no undo.
- Current goals are ordered by soonest end date first.
- The visual details of the pastel palette are left to design, within the light theme.
- Per the project constitution, the feature is verified manually; no automated tests are
  part of the scope.
