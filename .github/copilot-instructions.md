# PilotEco Frontend - AI Coding Agent Instructions

## Project Overview

This is a **carbon footprint assessment application** built with React + TypeScript + Vite, based on the Able Pro Material UI template. The app helps companies track and analyze their carbon emissions across Scope 1, 2, and 3 categories.

## Core Architecture Patterns

### Context-Based State Management

- **Language/i18n**: Use `LanguageContext` with `useLanguage()` hook for all text. All user-facing strings must use `t('translation-key')` pattern
- **Authentication**: `JWTContext` handles auth state with bearer token storage in localStorage
- **Theme**: Material-UI theme system with custom configurations in `src/themes/`

### API Integration Pattern

```typescript
// Follow this pattern in src/api/
import axios from '../utils/axios'; // Pre-configured with auth interceptors
export const getResource = async () => {
  const response = await axios.get('/endpoint');
  return response.data || [];
};
```

### Component Structure

- **MainCard**: Wrap all page content in `<MainCard title={t('page-title')}>` for consistent layout
- **Charts**: Use recharts with custom tooltips that display emissions in `tCO₂e` units
- **Forms**: Follow `EmissionForm.tsx` pattern with Material-UI components and validation

## Carbon Emissions Domain Logic

### Unit Standards

- **Always use `tCO₂e`** (tonnes CO₂ equivalent) for all emission displays
- Scopes: Scope 1 (direct), Scope 2 (electricity), Scope 3 (indirect)
- Color coding: Scope 1=success, Scope 2=info, Scope 3=warning

### Assessment Flow

1. Companies create assessments (`/assessment-create`)
2. Add emissions to assessments (`EmissionForm` component)
3. View aggregated data on dashboard with charts
4. Historical comparison across multiple assessment years

## Development Workflows

### Local Development

```bash
npm run dev     # Starts Vite dev server on port 3000
npm run build   # Production build
npm run preview # Preview production build
```

### File Organization Conventions

- **Pages**: `src/pages/` - Route components, always wrapped in MainCard
- **API**: `src/api/` - Service functions with axios, one file per domain
- **Components**: Reusable UI in `src/components/`, domain-specific in subdirs
- **Types**: TypeScript interfaces in `src/types/` by domain
- **Utils**: Pure functions in `src/utils/`

### Translation System

- Add new keys to both `src/locales/fr.ts` and `src/locales/en.ts`
- Use parameter interpolation: `t('welcome-user', { firstName: user.firstName })`
- Key naming: kebab-case with domain prefixes (e.g., `assessment-details`, `scope-1-direct`)

## Critical Integration Points

### Authentication Flow

- JWT stored as `serviceToken` in localStorage
- Axios interceptor auto-adds Bearer token to requests
- 401 responses redirect to `/maintenance/500`
- Login state managed via `JWTContext`

### API Base Configuration

- Base URL: `VITE_APP_API_URL` env var (default: `http://localhost:3010/`)
- API expects JSON:API format in some endpoints
- Assessment relationships: `/assessment/{id}` includes emissions array

### Routing Structure

- Auth-protected routes in `MainRoutes.tsx`
- Public routes in `LoginRoutes.tsx`
- Default redirect: `/dashboard`
- Route parameters: Assessment ID as string, convert for API calls

## Component Patterns to Follow

### Data Fetching Pattern

```typescript
const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData()
    .then(setData)
    .finally(() => setLoading(false));
}, []);

if (loading) return <CircularProgress />;
```

### Chart Components

- All charts use recharts library with custom tooltips
- Emissions data formatted with `tCO₂e` units
- Color scheme matches Material-UI theme colors
- Responsive design with Grid layout

### Form Validation

- Material-UI components with controlled inputs
- Error states handled at component level
- Success callbacks trigger page reloads or navigation

## Key Files for Reference

- `src/App.tsx` - Provider hierarchy and app structure
- `src/pages/dashboard.tsx` - Main data visualization patterns
- `src/components/EmissionForm.tsx` - Complex form handling
- `src/api/carbonAssessment.ts` - API service patterns
- `src/contexts/LanguageContext.tsx` - i18n implementation
- `docs/TRANSLATION_SYSTEM.md` - Detailed translation guide
