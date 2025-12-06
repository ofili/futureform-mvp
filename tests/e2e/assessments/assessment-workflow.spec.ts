import { test, expect } from '@playwright/test';

test.describe('Assessment Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Login and navigate to a project
        await page.goto('/auth/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('user can create new assessment', async ({ page }) => {
        // Navigate to assessments
        await page.goto('/assessments/new');

        // Select project
        await page.click('[name="projectId"]');
        await page.locator('[role="option"]').first().click();

        // Fill partner information
        await page.fill('[name="partnerName"]', 'Tech Solutions Ltd');
        await page.fill('[name="partnerType"]', 'Technology Vendor');
        await page.fill('[name="partnerAdminEmail"]', 'admin@techsol.com');

        // Select assessment type
        await page.click('[name="type"]');
        await page.click('text=Due Diligence');

        // Select depth
        await page.click('[name="depth"]');
        await page.click('text=Standard');

        // Set deadline
        await page.fill('[name="deadline"]', '2025-12-31');

        // Submit
        await page.click('button[type="submit"]');

        // Should show success message or redirect
        await expect(page.locator('text=/Assessment created|Invitation sent/i')).toBeVisible();
    });

    test('user can view assessment list', async ({ page }) => {
        await page.goto('/assessments');

        // Should see assessments table
        await expect(page.locator('text=/Assessments|No assessments/i')).toBeVisible();
    });

    test('user can respond to assessment questions', async ({ page }) => {
        // Navigate to assessment response page (using token)
        await page.goto('/assessments/test-token');

        // Should see questions
        await expect(page.locator('text=/Question|Domain/i')).toBeVisible();

        // Answer first question
        await page.locator('[name="response"]').first().click();
        await page.click('text=Yes');

        // Upload evidence (if file input exists)
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.isVisible()) {
            await fileInput.setInputFiles({
                name: 'test-document.pdf',
                mimeType: 'application/pdf',
                buffer: Buffer.from('test content'),
            });
        }

        // Save progress
        await page.click('text=Save Progress');

        // Should show success message
        await expect(page.locator('text=/Saved|Progress saved/i')).toBeVisible();
    });

    test('user can submit completed assessment', async ({ page }) => {
        await page.goto('/assessments/test-token');

        // Fill all required questions (simplified for test)
        const questions = page.locator('[data-testid="question"]');
        const count = await questions.count();

        for (let i = 0; i < Math.min(count, 3); i++) {
            await questions.nth(i).locator('[name="response"]').click();
            await page.click('text=Yes');
        }

        // Submit assessment
        await page.click('button:has-text("Submit Assessment")');

        // Confirm submission
        await page.click('button:has-text("Confirm")');

        // Should show success message
        await expect(page.locator('text=/Submitted|Thank you/i')).toBeVisible();
    });

    test('user can view assessment results', async ({ page }) => {
        // Navigate to completed assessment
        await page.goto('/assessments/completed-assessment-id');

        // Should see scores
        await expect(page.locator('text=/Overall Score|Trust Score/i')).toBeVisible();

        // Should see domain scores
        await expect(page.locator('text=/Governance|Financial|Operational/i')).toBeVisible();

        // Should see red flags (if any)
        await expect(page.locator('text=/Red Flags|Issues/i')).toBeVisible();
    });

    test('user can export assessment as PDF', async ({ page }) => {
        await page.goto('/assessments/completed-assessment-id');

        // Click export button
        const downloadPromise = page.waitForEvent('download');
        await page.click('text=Export PDF');
        const download = await downloadPromise;

        // Verify download
        expect(download.suggestedFilename()).toContain('.pdf');
    });
});
