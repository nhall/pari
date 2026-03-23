// Feature tests beyond the core APG disclosure pattern.
// APG pattern tests (ARIA structure, Enter/Space, Escape) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	hiddenUntilFound: '/iframe.html?id=disclosure--hidden-until-found&viewMode=story',
	mediaQuery: '/iframe.html?id=disclosure--media-query&viewMode=story',
	keyboardNav: '/iframe.html?id=disclosure--keyboard-navigation&viewMode=story',
	closer: '/iframe.html?id=disclosure--closer&viewMode=story',
};

function getTrigger(page: import('@playwright/test').Page) {
	return page.locator('[data-trigger]');
}

function getContent(page: import('@playwright/test').Page) {
	return page.locator('[data-content]');
}

test.describe('Hidden until found', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.hiddenUntilFound);
	});

	test('collapsed panel uses hidden="until-found"', async ({ page }) => {
		await expect(getContent(page)).toHaveAttribute('hidden', 'until-found');
	});

	test('opening removes hidden attribute', async ({ page }) => {
		await getTrigger(page).click();
		await expect(getContent(page)).not.toHaveAttribute('hidden');
	});

	test('closing restores hidden="until-found"', async ({ page }) => {
		await getTrigger(page).click();
		await getTrigger(page).click();
		await expect(getContent(page)).toHaveAttribute('hidden', 'until-found');
	});
});

test.describe('Media query', () => {
	test('disclosure is active at wide viewport', async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 768 });
		await page.goto(URLS.mediaQuery);

		const trigger = getTrigger(page);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	test('disclosure is disabled below media query breakpoint', async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 768 });
		await page.goto(URLS.mediaQuery);

		const trigger = getTrigger(page);
		await expect(trigger).not.toHaveAttribute('aria-expanded');
	});

	test('disclosure disables when viewport shrinks below breakpoint', async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 768 });
		await page.goto(URLS.mediaQuery);

		const trigger = getTrigger(page);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await page.setViewportSize({ width: 500, height: 768 });
		await expect(trigger).not.toHaveAttribute('aria-expanded');
	});

	test('disclosure re-enables when viewport grows above breakpoint', async ({ page }) => {
		await page.setViewportSize({ width: 500, height: 768 });
		await page.goto(URLS.mediaQuery);

		const trigger = getTrigger(page);
		await expect(trigger).not.toHaveAttribute('aria-expanded');

		await page.setViewportSize({ width: 1024, height: 768 });
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});

test.describe('Keyboard navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.keyboardNav);
		await getTrigger(page).click();
	});

	test('ArrowDown moves focus to next item', async ({ page }) => {
		const items = page.locator('[data-item]');
		await items.first().focus();
		await page.keyboard.press('ArrowDown');
		await expect(items.nth(1)).toBeFocused();
	});

	test('ArrowUp moves focus to previous item', async ({ page }) => {
		const items = page.locator('[data-item]');
		await items.nth(1).focus();
		await page.keyboard.press('ArrowUp');
		await expect(items.first()).toBeFocused();
	});

	test('ArrowDown wraps from last to first (loop)', async ({ page }) => {
		const items = page.locator('[data-item]');
		const count = await items.count();
		await items.nth(count - 1).focus();
		await page.keyboard.press('ArrowDown');
		await expect(items.first()).toBeFocused();
	});

	test('ArrowUp wraps from first to last (loop)', async ({ page }) => {
		const items = page.locator('[data-item]');
		const count = await items.count();
		await items.first().focus();
		await page.keyboard.press('ArrowUp');
		await expect(items.nth(count - 1)).toBeFocused();
	});

	test('Home moves focus to first item', async ({ page }) => {
		const items = page.locator('[data-item]');
		await items.nth(2).focus();
		await page.keyboard.press('Home');
		await expect(items.first()).toBeFocused();
	});

	test('End moves focus to last item', async ({ page }) => {
		const items = page.locator('[data-item]');
		const count = await items.count();
		await items.first().focus();
		await page.keyboard.press('End');
		await expect(items.nth(count - 1)).toBeFocused();
	});
});

test.describe('Closer element', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.closer);
	});

	test('clicking the close button closes the disclosure', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.locator('[data-close]').click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});

	test('closing via closer restores focus to the trigger', async ({ page }) => {
		await getTrigger(page).click();
		await page.locator('[data-close]').click();
		await expect(getTrigger(page)).toBeFocused();
	});
});
