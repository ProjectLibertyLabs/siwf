import { expect, test } from '@playwright/test';

test('can see an output  when I add a url and signature data', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#callbackUri')).toBeVisible();
	await page.locator('#callbackUri').fill('http://localhost:3000');
	await page.locator('#signMethod-manual').check();
	await expect(page.locator('#signerPublicKey')).toBeVisible();

	await page.locator('#signerPublicKey').fill('f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH');
	await page.locator('#signature').fill('0xabcd');
	await expect(page.getByText('Mainnet/Production URL')).toBeVisible();
	await expect(page.getByText('Signed Request (JSON)')).toBeVisible();
});
