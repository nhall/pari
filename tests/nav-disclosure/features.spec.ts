// Feature tests — hover behavior and panel persistence.
// APG pattern tests (ARIA, keyboard, Escape, blur) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	default: '/iframe.html?id=nav-disclosure--default&viewMode=story',
};

function getDisclosures(page: import('@playwright/test').Page) {
	return page.locator('pari-nav-disclosure > pari-disclosure');
}

test.describe('Hover behavior', () => {
	test('hover opens the panel', async ({ page }) => {
		await page.goto(URLS.default);

		const disclosure = getDisclosures(page).first();
		await disclosure.hover({ force: true });

		await expect(disclosure).toHaveAttribute('open');
	});

	test('leaving closes the panel after debounce', async ({ page }) => {
		await page.goto(URLS.default);

		const disclosure = getDisclosures(page).first();
		await disclosure.hover({ force: true });
		await expect(disclosure).toHaveAttribute('open');

		await page.mouse.move(0, 0);
		await page.waitForTimeout(300);

		await expect(disclosure).not.toHaveAttribute('open');
	});

	test('hovering a sibling closes the previous', async ({ page }) => {
		await page.goto(URLS.default);

		const disclosures = getDisclosures(page);

		await disclosures.first().hover({ force: true });
		await expect(disclosures.first()).toHaveAttribute('open');

		await disclosures.nth(1).hover({ force: true });
		await expect(disclosures.nth(1)).toHaveAttribute('open');
		await expect(disclosures.first()).not.toHaveAttribute('open');
	});
});
