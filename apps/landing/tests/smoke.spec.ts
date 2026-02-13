import { test, expect } from '@playwright/test';

const routes = [
	{ path: '/', title: 'Threadmark' },
	{ path: '/eu-merchant', title: 'EU Shopify Merchants' },
	{ path: '/mid-market', title: 'Mid-Market Brands' },
	{ path: '/thanks', title: 'Thanks' },
	{ path: '/privacy', title: 'Privacy Policy' },
];

for (const route of routes) {
	test(`${route.path} loads and has correct title`, async ({ page }) => {
		const response = await page.goto(route.path);
		expect(response?.status()).toBe(200);
		await expect(page).toHaveTitle(new RegExp(route.title));
	});
}

test('404 page returns 404 status', async ({ page }) => {
	const response = await page.goto('/nonexistent-page');
	expect(response?.status()).toBe(404);
});

test('/eu-merchant has waitlist form', async ({ page }) => {
	await page.goto('/eu-merchant');
	const form = page.locator('form[name="waitlist-eu-merchant"]');
	await expect(form).toBeVisible();
	await expect(form.locator('input[type="email"]')).toBeVisible();
	await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('/mid-market has waitlist form', async ({ page }) => {
	await page.goto('/mid-market');
	const form = page.locator('form[name="waitlist-mid-market"]');
	await expect(form).toBeVisible();
	await expect(form.locator('input[name="email"]')).toBeVisible();
	await expect(form.locator('input[name="name"]')).toBeVisible();
	await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('privacy link is in footer on all pages', async ({ page }) => {
	for (const route of routes) {
		await page.goto(route.path);
		const privacyLink = page.locator('footer a[href="/privacy"]');
		await expect(privacyLink).toBeVisible();
	}
});

test('no broken internal links', async ({ page }) => {
	for (const route of routes) {
		await page.goto(route.path);
		const links = await page.locator('a[href^="/"]').all();
		for (const link of links) {
			const href = await link.getAttribute('href');
			if (href) {
				const response = await page.request.get(href);
				expect(response.status(), `Broken link: ${href} on ${route.path}`).toBe(200);
			}
		}
	}
});
