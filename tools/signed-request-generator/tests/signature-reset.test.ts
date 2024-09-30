import { expect, test } from '@playwright/test';

test('can see the signature removed when edit signature permission data', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#callbackUri')).toBeVisible();
	await page.locator('#callbackUri').fill('http://localhost:3000');
	await page.locator('#signMethod-manual').check();
	await expect(page.locator('#signerPublicKey')).toBeVisible();

	await page.locator('#signature').fill('0xabcd');

	// Change that makes the signature bad
	await page.getByText('Private Graph v1').check();
	await expect(page.locator('#signature')).toHaveValue('');
});

test('can see the signature removed when edit signature callback data', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#callbackUri')).toBeVisible();
	await page.locator('#callbackUri').fill('http://localhost:3000');
	await page.locator('#signMethod-manual').check();
	await expect(page.locator('#signerPublicKey')).toBeVisible();

	await page.locator('#signature').fill('0xabcd');

	// Change that makes the signature bad
	await page.locator('#callbackUri').fill('http://example.com');
	await expect(page.locator('#signature')).toHaveValue('');
});
