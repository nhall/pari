// Feature tests beyond the core APG accordion pattern.
// APG pattern tests (ARIA structure, Enter/Space, keyboard nav) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	default: '/iframe.html?id=accordion--default&viewMode=story',
	grouped: '/iframe.html?id=accordion--grouped&viewMode=story',
	alwaysOpen: '/iframe.html?id=accordion--always-open&viewMode=story',
	horizontal: '/iframe.html?id=accordion--horizontal&viewMode=story',
	loopNav: '/iframe.html?id=accordion--loop-navigation&viewMode=story',
};

function getTriggers(page: import('@playwright/test').Page) {
	return page.locator('pari-accordion > pari-disclosure [data-trigger]');
}

function getDisclosures(page: import('@playwright/test').Page) {
	return page.locator('pari-accordion > pari-disclosure');
}

test.describe('Grouped behavior', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.grouped);
	});

	test('opening one section closes the others', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await expect(disclosures.first()).toHaveAttribute('open');

		await triggers.nth(1).click();
		await expect(disclosures.nth(1)).toHaveAttribute('open');
		await expect(disclosures.first()).not.toHaveAttribute('open');
	});

	test('only one section is open at a time', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);
		const count = await triggers.count();

		for (let i = 0; i < count; i++) {
			await triggers.nth(i).click();

			for (let j = 0; j < count; j++) {
				if (j === i) {
					await expect(disclosures.nth(j)).toHaveAttribute('open');
				} else {
					await expect(disclosures.nth(j)).not.toHaveAttribute('open');
				}
			}
		}
	});
});

test.describe('Always open', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.alwaysOpen);
	});

	test('first section starts open', async ({ page }) => {
		await expect(getDisclosures(page).first()).toHaveAttribute('open');
	});

	test('open section cannot be collapsed', async ({ page }) => {
		const triggers = getTriggers(page);

		await triggers.first().click();
		await expect(getDisclosures(page).first()).toHaveAttribute('open');
	});

	test('opening another section closes the previous', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.nth(1).click();
		await expect(disclosures.nth(1)).toHaveAttribute('open');
		await expect(disclosures.first()).not.toHaveAttribute('open');
	});

	test('newly opened section cannot be collapsed', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.nth(1).click();
		await expect(disclosures.nth(1)).toHaveAttribute('open');

		await triggers.nth(1).click();
		await expect(disclosures.nth(1)).toHaveAttribute('open');
	});
});

test.describe('Horizontal orientation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.horizontal);
	});

	test('ArrowRight moves focus to next trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.first().focus();
		await page.keyboard.press('ArrowRight');
		await expect(triggers.nth(1)).toBeFocused();
	});

	test('ArrowLeft moves focus to previous trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.nth(1).focus();
		await page.keyboard.press('ArrowLeft');
		await expect(triggers.first()).toBeFocused();
	});

	test('ArrowDown does not navigate between triggers', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.first().focus();
		await page.keyboard.press('ArrowDown');
		await expect(triggers.first()).toBeFocused();
	});
});

test.describe('Loop navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.loopNav);
	});

	test('ArrowDown wraps from last to first', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();
		await triggers.nth(count - 1).focus();
		await page.keyboard.press('ArrowDown');
		await expect(triggers.first()).toBeFocused();
	});

	test('ArrowUp wraps from first to last', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();
		await triggers.first().focus();
		await page.keyboard.press('ArrowUp');
		await expect(triggers.nth(count - 1)).toBeFocused();
	});
});

test.describe('Independent panels (default, no grouping)', () => {
	test('multiple sections can be open simultaneously', async ({ page }) => {
		await page.goto(URLS.default);

		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.first().click();
		await triggers.nth(1).click();

		await expect(disclosures.first()).toHaveAttribute('open');
		await expect(disclosures.nth(1)).toHaveAttribute('open');
	});
});
