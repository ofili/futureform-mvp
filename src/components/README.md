# Component Structure Documentation

## Overview

This document describes the component organization in the FutureForm MVP frontend application after the refactoring project.

## Directory Structure

```
src/components/
├── shared/          # Shared/reusable components (4 components)
├── landing/         # Landing page components (12 components)
├── auth/            # Authentication components (5 components)
├── dashboard/       # Dashboard components (8 components)
├── projects/        # Projects page components (6 components)
├── assessments/     # Assessments page components (4 components)
├── settings/        # Settings page components (4 components)
├── ui/              # Base UI components (shadcn/ui)
└── layouts/         # Layout components
```

## Component Categories

### Shared Components (`src/components/shared/`)
Reusable components used across multiple features:
- `PageHeader` - Standard page header with title, description, and actions
- `EmptyState` - Consistent empty state display
- `StatCard` - Metric display card with variants
- `StatusBadge` - Status indicator with predefined styles

**Usage**: Import from `@/components/shared`

### Landing Page (`src/components/landing/`)
Components for the public landing page:
- `Navbar`, `Hero`, `ProblemSection`, `TrustFramework`
- `HowItWorks`, `ProofPoints`, `SampleQuestions`
- `AudienceSection`, `FrameworkOrigin`, `Pricing`
- `CTASection`, `Footer`

**Usage**: Import from `@/components/landing`

### Authentication (`src/components/auth/`)
Authentication flow components:
- `AuthLayout` - Shared layout for auth pages
- `AuthCard` - Card wrapper for auth forms
- `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`

**Usage**: Import from `@/components/auth`

### Dashboard (`src/components/dashboard/`)
Dashboard page components:
- `DashboardHeader`, `SystemHealthPanel`, `KPICards`
- `NextActionsPanel`, `TrustLayerChart`, `TrustTrendChart`
- `RecentActivity`, `AnalyticsTabs`

**Usage**: Import from `@/components/dashboard`

### Projects (`src/components/projects/`)
Project management components:
- `ProjectsHeader`, `ProjectFilters`, `ProjectCard`
- `ProjectsGrid`, `ProjectsTable`, `ProjectsEmptyState`

**Usage**: Import from `@/components/projects`

### Assessments (`src/components/assessments/`)
Assessment tracking components:
- `AssessmentsHeader`, `AssessmentCard`
- `AssessmentsList`, `AssessmentsEmptyState`

**Usage**: Import from `@/components/assessments`

### Settings (`src/components/settings/`)
Settings page components:
- `SettingsHeader`, `ProfileSettings`
- `PasswordSettings`, `DangerZone`

**Usage**: Import from `@/components/settings`

## Import Patterns

### Using Index Files
Components can be imported using barrel exports:

```typescript
// Instead of:
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

// Use:
import { PageHeader, EmptyState } from '@/components/shared';
```

### Direct Imports
For single component imports, direct imports are also fine:

```typescript
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
```

## Component Principles

### Single Responsibility
Each component has one clear purpose and handles one specific UI concern.

### Composition
Components are designed to be composed together to build complex UIs.

### Type Safety
All components use TypeScript with proper prop interfaces.

### Reusability
Shared components are designed to work across different features.

## Deprecated Directories

### `components/` (root level)
The root-level `components` directory contains old landing page components and should be considered deprecated. All new development should use `src/components/`.

**Migration**: Components from the root-level directory have been recreated in `src/components/landing/` with improved structure.

## Best Practices

1. **Feature Organization**: Keep feature-specific components in their respective directories
2. **Shared Components**: Extract common patterns to `shared/` directory
3. **Index Files**: Use index files for cleaner imports
4. **TypeScript**: Always define prop interfaces
5. **Naming**: Use PascalCase for component names, kebab-case for file names

## Maintenance

When adding new components:
1. Place in appropriate feature directory
2. Update the index file if creating multiple related components
3. Consider if the component should be shared
4. Follow existing naming and structure patterns
