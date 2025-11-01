# Repository Guidelines

## Project Structure & Module Organization
The app follows the Next.js App Router layout. Core pages live in `app/` with route-specific folders (`app/login`, `app/signup`) and `layout.tsx` handling shared chrome. Reusable UI is grouped under `components/`, adopting an atomic design (`atoms`, `molecules`, `organisms`). Shared utilities, including the OpenAPI client, sit in `lib/`, while static assets belong in `public/`. Configuration files for TypeScript, ESLint, Tailwind, and Next.js remain at the repository root for quick reference.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server on port 3000 with hot reload.
- `npm run build`: generate the production build; use before deploying.
- `npm run start`: run the production bundle locally (requires a prior build).
- `npm run lint`: execute the ESLint ruleset defined in `eslint.config.mjs`.
- `npm run generate:api`: regenerate `lib/api-schema.ts` from `openapi.yaml`; run this whenever the backend contract changes.

## Coding Style & Naming Conventions
TypeScript is the default; create React components as named functions using PascalCase filenames (`components/navigation/Sidebar.tsx`). Hooks and utility modules live under `lib/` and should use camelCase exports. Indentation is two spaces, double quotes are preferred for strings, and semicolons are required—`eslint --fix` will enforce these rules. Tailwind CSS powers styling, supplemented by semantic color tokens defined in `app/globals.css`; prefer utility classes over bespoke CSS unless you need component-specific overrides.

## Testing Guidelines
No automated test harness is wired up yet. When adding tests, colocate files as `<Component>.test.tsx` using React Testing Library and Vitest or Jest. Aim to cover new UI states and API integrations, especially around optimistic updates and error handling. Document any test setup steps inside `README.md` until a dedicated testing guide exists.

## Commit & Pull Request Guidelines
Commits should follow the existing imperative, present-tense style (`Add OpenAPI specification…`). Keep changes focused and include context in the body when touching backend contracts or shared components. Pull requests must include: a concise summary of the change set, linked Linear/Jira issue or GitHub ticket, screenshots or screen recordings for UI updates, and notes about schema migrations or API client regeneration. Request reviews from domain owners (`components/` vs. `lib/`) and ensure `npm run lint` passes before assigning reviewers.
