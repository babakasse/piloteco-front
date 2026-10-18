# PilotEco Frontend - Project-Specific Instructions

Keep this file limited to context and rules specific to this repository.

## Product Context

- Carbon footprint assessment app (React + TypeScript + Vite).
- Business domain is emissions tracking across Scope 1, Scope 2, and Scope 3.
- Core unit for emission values is `tCO₂e`.

## Non-Negotiable Project Rules

### i18n

- All user-facing text must go through `useLanguage()` and `t('translation-key')`.
- Any new translation key must be added in both `src/locales/en.ts` and `src/locales/fr.ts`.
- Translation keys use kebab-case and domain prefixes (example: `assessment-details`, `scope-1-direct`).

### Emissions Domain

- Display emissions in `tCO₂e`.
- Scopes mapping is fixed: Scope 1=direct, Scope 2=electricity, Scope 3=indirect.
- Scope color mapping is fixed: Scope 1=success, Scope 2=info, Scope 3=warning.

### Auth and API Integration

- Frontend JWT token key in localStorage is `serviceToken`.
- Axios auth flow and interceptors are centralized in `src/utils/axios`.
- API service modules under `src/api/` must use the shared axios instance from `src/utils/axios`.
- Unauthorized flow currently routes to `/maintenance/500` on 401.
- API base URL comes from `VITE_APP_API_URL` (default `http://localhost:3010/`).

### Routing and Assessment Flow

- Protected routes are configured in `src/routes/MainRoutes.tsx`; public routes in `src/routes/LoginRoutes.tsx`.
- Default post-login route is `/dashboard`.
- Assessment flow: create assessment, add emissions, then review aggregated dashboards and history.

## Project Reference Points

- `src/App.tsx`: provider hierarchy and app structure.
- `src/components/EmissionForm.tsx`: emissions form behavior.
- `src/api/carbonAssessment.ts`: carbon assessment API conventions.
- `src/contexts/LanguageContext.tsx`: translation usage.
- `docs/TRANSLATION_SYSTEM.md`: translation system details.

## Pull Request Handling

Apply this section when the user asks for PR summary, PR review, merge readiness, CI debugging, or change understanding.

### Request Type

- PR summary: what changed, why, impacted areas, risks.
- PR review: findings by severity first (Critical/High/Medium/Low), with file references.
- Merge readiness: verdict (`ready` / `ready-with-follow-ups` / `not-ready`) and blocking items.
- CI debugging: failing check, likely cause, reproduction, minimal fix.
- Change understanding: explain specific files/flows and side effects.

### PR Inspection Order

1. PR title and description.
2. Commits and branch scope.
3. Changed files grouped by area (auth, API, routing, UI, config, tests).
4. CI/check statuses and failures.
5. Existing comments and unresolved threads.

### Review Priorities

1. Correctness/regressions.
2. Security and permissions.
3. API/data contract compatibility.
4. Test coverage for changed behavior.
5. Maintainability.

High-risk files to inspect first:

- `src/contexts/JWTContext.tsx`, `src/hooks/useAuth.ts`, `src/utils/axios*`
- `src/routes/MainRoutes.tsx`, `src/routes/LoginRoutes.tsx`
- `src/api/*.ts`, `src/config.ts`, `public/config.js`

### Scope Noise and Security Checks

- Flag unrelated formatting-only changes, temporary/debug artifacts, and unrelated generated churn as scope noise.
- For security-sensitive PRs, explicitly check token handling, CORS/trust boundaries, secrets exposure, route protection, and external endpoint/base URL changes.

### Merge Readiness Rules

Mark `not-ready` if any of these apply:

- Required CI is failing.
- Unresolved high-severity correctness/security issue.
- Critical missing tests for modified behavior.
- PR scope is unclear due to unrelated noisy changes.
