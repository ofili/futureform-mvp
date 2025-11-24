import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Start from the home page
        await page.goto('/');
    });

    test('user can register new account', async ({ page }) => {
        // Navigate to registration page
        await page.click('text=Sign Up');
        await expect(page).toHaveURL('/auth/register');

        // Fill registration form
        await page.fill('[name="firstName"]', 'John');
        await page.fill('[name="lastName"]', 'Doe');
        await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
        await page.fill('[name="password"]', 'TestPassword123!');
        await page.fill('[name="jobTitle"]', 'Project Manager');
        await page.fill('[name="department"]', 'Operations');

        // Submit form
        await page.click('button[type="submit"]');

        // Should redirect to verification page or show success message
        await expect(page).toHaveURL(/\/auth\/verify-email|\/dashboard/);
    });

    test('user can login with valid credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('/auth/login');

        // Fill login form
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'TestPassword123!');

        // Submit form
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/dashboard');

        // Should see user name or dashboard content
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('login fails with invalid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'WrongPassword');

        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('text=/Invalid credentials|Login failed/i')).toBeVisible();

        // Should stay on login page
        await expect(page).toHaveURL('/auth/login');
    });

    test('user can logout', async ({ page }) => {
        // Login first
        await page.goto('/auth/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');

        // Logout
        await page.click('[aria-label="User menu"]');
        await page.click('text=Logout');

        // Should redirect to home or login
        await expect(page).toHaveURL(/\/|\/auth\/login/);
    });

    test('password reset flow', async ({ page }) => {
        await page.goto('/auth/forgot-password');

        // Request password reset
        await page.fill('[name="email"]', 'test@example.com');
        await page.click('button[type="submit"]');

        // Should show success message
        await expect(page.locator('text=/Check your email|Reset link sent/i')).toBeVisible();
    });
});
