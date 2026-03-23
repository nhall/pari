// APG Accordion Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=accordion--default&viewMode=story',
	grouped: '/iframe.html?id=accordion--grouped&viewMode=story',
	alwaysOpen: '/iframe.html?id=accordion--always-open&viewMode=story',
};

function getTriggers(page: import('@playwright/test').Page) {
	return page.locator('pari-accordion > pari-disclosure [data-trigger]');
}

function getContents(page: import('@playwright/test').Page) {
	return page.locator('pari-accordion > pari-disclosure [data-content]');
}

test.describe('axe audit', () => {
	test('default variant has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await checkA11y(page);
	});

	test('grouped variant has no violations', async ({ page }) => {
		await page.goto(URLS.grouped);
		await checkA11y(page);
	});

	test('always-open variant has no violations', async ({ page }) => {
		await page.goto(URLS.alwaysOpen);
		await checkA11y(page);
	});
});

test.describe('ARIA structure', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('each trigger has aria-expanded', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();

		for (let i = 0; i < count; i++) {
			const value = await triggers.nth(i).getAttribute('aria-expanded');
			expect(['true', 'false']).toContain(value);
		}
	});

	test('each trigger has aria-controls pointing to its content', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();

		for (let i = 0; i < count; i++) {
			const controlsId = await triggers.nth(i).getAttribute('aria-controls');
			expect(controlsId).toBeTruthy();

			const panel = page.locator(`[id="${controlsId}"]`);
			await expect(panel).toHaveCount(1);
		}
	});
});

test.describe('Enter / Space', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('Enter opens a panel', async ({ page }) => {
		const trigger = getTriggers(page).first();
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(getContents(page).first()).not.toHaveAttribute('hidden');
	});

	test('Space opens a panel', async ({ page }) => {
		const trigger = getTriggers(page).first();
		await trigger.focus();
		await page.keyboard.press(' ');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(getContents(page).first()).not.toHaveAttribute('hidden');
	});
});

test.describe('Keyboard navigation — vertical', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('ArrowDown moves focus to next trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.first().focus();
		await page.keyboard.press('ArrowDown');
		await expect(triggers.nth(1)).toBeFocused();
	});

	test('ArrowUp moves focus to previous trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.nth(1).focus();
		await page.keyboard.press('ArrowUp');
		await expect(triggers.first()).toBeFocused();
	});

	test('Home moves focus to first trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.nth(2).focus();
		await page.keyboard.press('Home');
		await expect(triggers.first()).toBeFocused();
	});

	test('End moves focus to last trigger', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();
		await triggers.first().focus();
		await page.keyboard.press('End');
		await expect(triggers.nth(count - 1)).toBeFocused();
	});

	test('ArrowDown does not wrap without loop-navigation', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();
		await triggers.nth(count - 1).focus();
		await page.keyboard.press('ArrowDown');
		await expect(triggers.nth(count - 1)).toBeFocused();
	});

	test('ArrowUp does not wrap without loop-navigation', async ({ page }) => {
		const triggers = getTriggers(page);
		await triggers.first().focus();
		await page.keyboard.press('ArrowUp');
		await expect(triggers.first()).toBeFocused();
	});
});
