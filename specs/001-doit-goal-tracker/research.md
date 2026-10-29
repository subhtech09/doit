# Research: doit Goal Tracker

**Feature**: `001-doit-goal-tracker`  
**Date**: 2026-10-29

## Decisions

### Application architecture

- **Decision**: Use the Next.js App Router with React and TypeScript, following the latest stable versions supported by the project scaffold at implementation time.
- **Rationale**: The repository constitution requires the current stable Next.js and React stack and recommends App Router conventions. There is no existing application source or package manifest to preserve. Keep the page server-rendered where practical and isolate browser state in a small client-side goal board.
- **Alternatives considered**: A separate backend or client-side router would add infrastructure without serving a single-user, browser-local feature.
- **Source**: [Next.js App Router documentation](https://nextjs.org/docs/app)

### Styling and theme tokens

- **Decision**: Use the current stable Tailwind CSS and define the app's semantic palette in top-level `@theme` variables in `src/app/globals.css`.
- **Rationale**: Tailwind's `--color-*` theme variables generate corresponding utility classes. Define semantic tokens for page/surface, text, border, focus, urgent, completed, and destructive states; choose pastel surfaces with foregrounds that meet WCAG 2.2 AA contrast. Keep custom CSS limited to what utilities cannot express.
- **Alternatives considered**: Plain `:root` variables would not create Tailwind utilities; a separate theme package is unnecessary.
- **Source**: [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)

### UI components

- **Decision**: Use shadcn/ui-generated, editable components only for the required primitives: Button, Checkbox, Dialog, Input, and Label (plus any primitive needed for an accessible validation message).
- **Rationale**: shadcn/ui distributes source code rather than requiring a runtime component-library dependency, enabling focused styling and accessibility review. Include only the dependencies generated for selected components; do not add unrelated components or animation packages.
- **Alternatives considered**: Hand-building modal and form controls would duplicate interaction and focus behavior; a full component library would add unnecessary breadth.
- **Source**: [shadcn/ui introduction](https://ui.shadcn.com/docs)

### Goal persistence

- **Decision**: Persist a versioned goal collection to a namespaced `localStorage` key, accessed only in the browser after the client component mounts. Validate decoded records before use and catch storage access and write failures.
- **Rationale**: `localStorage` persists by origin across browser sessions and matches the spec's single-device, single-browser assumption. It is unavailable during server rendering and may throw when browser policy blocks persistence, so the UI must not claim saved data was persisted when a read or write fails. Next.js prerenders Client Components on the first load, so render the same deterministic loading view on the server and initial client render, then read storage in an effect after mount. Malformed stored data must produce a recoverable visible error rather than being silently overwritten.
- **Alternatives considered**: A server database, account system, or cross-device sync conflicts with the explicit no-account/local-only scope. `sessionStorage` does not persist across browser sessions.
- **Source**: [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Date representation and calculations

- **Decision**: Store each end date as a date-only ISO string (`YYYY-MM-DD`), validate its canonical shape and actual calendar validity, parse it with date-fns `parseISO` into local time, use `differenceInCalendarDays` for days remaining, and use `format` for display.
- **Rationale**: The spec defines whole calendar days in the user's local date, not elapsed 24-hour periods. Calendar-day operations avoid daylight-saving and time-of-day errors. Keep the stored value date-only; do not pass it through UTC serialization or JavaScript's date-only string parser. Refresh the derived local day after a local-midnight timer and when the page becomes visible again, so a long-open tab does not keep stale due labels. The `date-fns` dependency is explicitly requested and is used only for date parsing, calendar arithmetic, validation, and formatting.
- **Alternatives considered**: Raw millisecond division can be wrong around daylight-saving transitions; a larger date/time framework is unnecessary.
- **Source**: [date-fns documentation](https://date-fns.org/docs/Getting-Started) and [calendar-day helpers](https://date-fns.org/v4.4.0/docs/differenceInCalendarDays)

### Manual verification and scope

- **Decision**: Verify the shipped flows through the manual scenarios in `quickstart.md`; do not add automated test files, test dependencies, test scripts, or test tasks. Pair each goal's selection checkbox with a separate, goal-specific action. This documented WCAG G155 technique guards deletion without undo or an extra confirmation step and keeps deletion within the two-interaction success target.
- **Rationale**: Constitution Principle I prohibits automated or scripted tests and requires manual review only. The quickstart therefore documents a human walkthrough and app launch, not an automated suite.
- **Alternatives considered**: Automated unit, integration, or browser suites are expressly forbidden by the project constitution.

## Resolved Technical Unknowns

- **Application type**: Single-project Next.js web app using the App Router.
- **Language**: TypeScript, using the stable version supported by the selected Next.js scaffold.
- **Persistence boundary**: Browser origin and profile only; no server, accounts, or sync.
- **External interfaces**: No network API or third-party service. The UI behavior contract is documented in `contracts/ui.md`.
- **Scale**: A small, single-user goal list; no pagination or server-side scaling requirement.
- **Automated verification**: None; manual review only, as required by the constitution.

## Sources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)
- [shadcn/ui introduction](https://ui.shadcn.com/docs)
- [date-fns Getting Started](https://date-fns.org/docs/Getting-Started)
- [date-fns `differenceInCalendarDays`](https://date-fns.org/v4.4.0/docs/differenceInCalendarDays)
- [date-fns `parseISO`](https://date-fns.org/v4.4.0/docs/parseISO)
- [date-fns `differenceInCalendarDays`](https://date-fns.org/v4.4.0/docs/differenceInCalendarDays)
- [WCAG G155 checkbox safeguard](https://www.w3.org/WAI/WCAG22/Techniques/general/G155)
- [MDN `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
