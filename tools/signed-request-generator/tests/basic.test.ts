import { expect, test } from '@playwright/test';

test('can see wallet button when I add a url', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#callbackUri')).toBeVisible();
	await page.locator('#callbackUri').fill('http://localhost:3000');
	await expect(page.locator('button', { hasText: 'Connect to Wallet' })).toBeVisible();
});
