# Testing Guide

## Test Suite Overview

FutureForm uses a comprehensive testing strategy covering:
- **Unit Tests**: Testing individual functions and utilities
- **Component Tests**: Testing React components in isolation
- **Integration Tests**: Testing API routes and database interactions
- **E2E Tests**: Testing complete user workflows

## Testing Stack

- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end browser testing
- **MSW (Mock Service Worker)**: API mocking
- **Testing Library User Event**: User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Run E2E tests
npm test:e2e

# Run specific test file
npm test -- path/to/test.test.ts
```

## Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── lib/          # Utility function tests
│   └── utils/        # Helper function tests
├── integration/       # Integration tests
│   └── api/          # API route tests
├── components/        # Component tests
│   ├── ui/           # UI component tests
│   └── admin/        # Admin component tests
├── e2e/              # End-to-end tests
│   ├── auth/         # Authentication flows
│   ├── projects/     # Project workflows
│   └── assessments/  # Assessment workflows
├── fixtures/          # Test data and fixtures
├── helpers/           # Test utilities
└── setup/            # Test configuration
```

## Writing Tests

### Unit Tests

```typescript
// tests/unit/lib/hubspot.test.ts
import { createHubSpotContact } from '@/lib/hubspot';

describe('HubSpot Integration', () => {
  it('should create contact successfully', async () => {
    const result = await createHubSpotContact({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      organization: 'Test Corp'
    });
    
    expect(result.success).toBe(true);
    expect(result.contactId).toBeDefined();
  });
});
```

### Component Tests

```typescript
// tests/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### API Integration Tests

```typescript
// tests/integration/api/auth.test.ts
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const response = await POST({
      json: async () => ({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    expect(response.status).toBe(201);
  });
});
```

### E2E Tests

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Test Coverage Goals

- **Overall Coverage**: >80%
- **Critical Paths**: 100%
- **API Routes**: >90%
- **Utilities**: >85%
- **Components**: >75%

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Test Behavior**: Test what users see, not implementation
3. **Isolation**: Each test should be independent
4. **Descriptive Names**: Use clear test descriptions
5. **Mock External Services**: Don't hit real APIs in tests
6. **Clean Up**: Reset database state after tests

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment

## Troubleshooting

### Tests Failing Locally

```bash
# Clear Jest cache
npm test -- --clearCache

# Reset test database
npm run test:db:reset
```

### E2E Tests Failing

```bash
# Update Playwright browsers
npx playwright install

# Run in headed mode for debugging
npm test:e2e -- --headed
```
