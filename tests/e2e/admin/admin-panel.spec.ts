import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/auth/login');
        await page.fill('[name="email"]', 'admin@futureform.com');
        await page.fill('[name="password"]', 'AdminPassword123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('admin can access admin panel', async ({ page }) => {
        await page.goto('/admin');

        // Should see admin dashboard
        await expect(page.locator('text=/Admin|Dashboard/i')).toBeVisible();

        // Should see statistics
        await expect(page.locator('text=/Users|Organizations|Assessments/i')).toBeVisible();
    });

    test('admin can view users list', async ({ page }) => {
        await page.goto('/admin/users');

        // Should see users table
        await expect(page.locator('text=/Users|Email/i')).toBeVisible();

        // Should have search functionality
        await expect(page.locator('[placeholder*="Search"]')).toBeVisible();
    });

    test('admin can edit user role', async ({ page }) => {
        await page.goto('/admin/users');

        // Click on first user
        await page.locator('[data-testid="user-row"]').first().click();

        // Change role
        await page.click('[name="role"]');
        await page.click('text=ADMIN');

        // Save changes
        await page.click('button:has-text("Save")');

        // Should show success message
        await expect(page.locator('text=/Updated|Success/i')).toBeVisible();
    });

    test('admin can view organizations', async ({ page }) => {
        await page.goto('/admin/organizations');

        // Should see organizations table
        await expect(page.locator('text=/Organizations|Name/i')).toBeVisible();
    });

    test('admin can manage platform settings', async ({ page }) => {
        await page.goto('/admin/settings');

        // Should see settings tabs
        await expect(page.locator('text=/General|Billing|Email/i')).toBeVisible();

        // Click on a setting
        await page.click('text=General');

        // Should see configuration options
        await expect(page.locator('[role="switch"]')).toBeVisible();
    });

    test('admin can view HubSpot sync status', async ({ page }) => {
        await page.goto('/admin/settings');

        // Click HubSpot Integration tab
        await page.click('text=HubSpot Integration');

        // Should see sync statistics
        await expect(page.locator('text=/Total Leads|Synced|Failed/i')).toBeVisible();

        // Should see retry button if there are failures
        const retryButton = page.locator('text=Retry');
        if (await retryButton.isVisible()) {
            await retryButton.click();
            await expect(page.locator('text=/Retrying|Success/i')).toBeVisible();
        }
    });

    test('admin can view support tickets', async ({ page }) => {
        await page.goto('/admin/support');

        // Should see tickets list
        await expect(page.locator('text=/Tickets|Status/i')).toBeVisible();

        // Should be able to filter by status
        await page.click('[aria-label="Filter tickets"]');
        await page.click('text=Open');
    });

    test('admin can respond to support ticket', async ({ page }) => {
        await page.goto('/admin/support');

        // Click on first ticket
        await page.locator('[data-testid="ticket-row"]').first().click();

        // Type response
        await page.fill('[name="message"]', 'Thank you for contacting support. We will look into this.');

        // Send response
        await page.click('button:has-text("Send")');

        // Should show success
        await expect(page.locator('text=/Sent|Message sent/i')).toBeVisible();
    });
});
