import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/auth/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('user can create new project', async ({ page }) => {
        // Navigate to projects
        await page.click('text=Projects');
        await expect(page).toHaveURL('/projects');

        // Click create project
        await page.click('text=New Project');
        await expect(page).toHaveURL('/projects/new');

        // Fill project form
        await page.fill('[name="name"]', 'Test Project');
        await page.fill('[name="description"]', 'This is a test project');

        // Select project type
        await page.click('[name="type"]');
        await page.click('text=Pre-investment due diligence');

        // Fill other fields
        await page.fill('[name="sector"]', 'Technology');
        await page.fill('[name="region"]', 'Africa');
        await page.fill('[name="country"]', 'Nigeria');
        await page.fill('[name="objectives"]', 'Test objectives');

        // Submit form
        await page.click('button[type="submit"]');

        // Should redirect to project page
        await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9]+/);

        // Should see project name
        await expect(page.locator('text=Test Project')).toBeVisible();
    });

    test('user can view project list', async ({ page }) => {
        await page.goto('/projects');

        // Should see projects table/list
        await expect(page.locator('text=/Projects|No projects/i')).toBeVisible();
    });

    test('user can view project details', async ({ page }) => {
        await page.goto('/projects');

        // Click on first project (if exists)
        const firstProject = page.locator('[data-testid="project-row"]').first();
        if (await firstProject.isVisible()) {
            await firstProject.click();

            // Should see project details
            await expect(page.locator('text=/Description|Assessments|Team/i')).toBeVisible();
        }
    });

    test('user can filter projects by status', async ({ page }) => {
        await page.goto('/projects');

        // Click filter dropdown
        await page.click('[aria-label="Filter projects"]');

        // Select ACTIVE status
        await page.click('text=Active');

        // Should update URL or table
        await expect(page).toHaveURL(/status=ACTIVE/);
    });
});
