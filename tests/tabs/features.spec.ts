// Feature tests beyond the core APG tabs pattern.
// APG pattern tests (ARIA structure, keyboard nav, activation modes) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	default: '/iframe.html?id=tabs--default&viewMode=story',
	loopNav: '/iframe.html?id=tabs--loop-navigation&viewMode=story',
	hiddenUntilFound: '/iframe.html?id=tabs--hidden-until-found&viewMode=story',
	panelFocusable: '/iframe.html?id=tabs--panel-with-focusable-content&viewMode=story',
};

function getTabs(page: import('@playwright/test').Page) {
	return page.locator('[data-tab]');
}

function getPanels(page: import('@playwright/test').Page) {
	return page.locator('[data-panel]');
}

test.describe('Loop navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.loopNav);
	});

	test('ArrowRight wraps from last to first', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();
		await tabs.nth(count - 1).click();
		await page.keyboard.press('ArrowRight');

		await expect(tabs.first()).toBeFocused();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	test('ArrowLeft wraps from first to last', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();
		await tabs.first().focus();
		await page.keyboard.press('ArrowLeft');

		await expect(tabs.nth(count - 1)).toBeFocused();
		await expect(tabs.nth(count - 1)).toHaveAttribute('aria-selected', 'true');
	});
});

test.describe('No loop (default)', () => {
	test('ArrowRight does not wrap at last tab', async ({ page }) => {
		await page.goto(URLS.default);

		const tabs = getTabs(page);
		const count = await tabs.count();
		await tabs.nth(count - 1).click();
		await page.keyboard.press('ArrowRight');

		await expect(tabs.nth(count - 1)).toBeFocused();
	});

	test('ArrowLeft does not wrap at first tab', async ({ page }) => {
		await page.goto(URLS.default);

		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowLeft');

		await expect(tabs.first()).toBeFocused();
	});
});

test.describe('Hidden until found', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.hiddenUntilFound);
	});

	test('inactive panels use hidden="until-found"', async ({ page }) => {
		const panels = getPanels(page);
		const count = await panels.count();

		for (let i = 1; i < count; i++) {
			await expect(panels.nth(i)).toHaveAttribute('hidden', 'until-found');
		}
	});

	test('activating a tab removes hidden from its panel', async ({ page }) => {
		const tabs = getTabs(page);
		const panels = getPanels(page);

		await tabs.nth(1).click();
		await expect(panels.nth(1)).not.toHaveAttribute('hidden');
	});

	test('deactivated panel restores hidden="until-found"', async ({ page }) => {
		const tabs = getTabs(page);
		const panels = getPanels(page);

		await tabs.nth(1).click();
		await expect(panels.first()).toHaveAttribute('hidden', 'until-found');
	});
});

test.describe('Panel tabindex management', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.panelFocusable);
	});

	test('panel with focusable content does not have tabindex', async ({ page }) => {
		const panels = getPanels(page);
		await expect(panels.first()).not.toHaveAttribute('tabindex');
	});

	test('panel without focusable content gets tabindex="0"', async ({ page }) => {
		const tabs = getTabs(page);
		const panels = getPanels(page);

		await tabs.nth(1).click();
		await expect(panels.nth(1)).toHaveAttribute('tabindex', '0');
	});
});

test.describe('Tab switching', () => {
	test('only one panel is visible at a time', async ({ page }) => {
		await page.goto(URLS.default);

		const tabs = getTabs(page);
		const panels = getPanels(page);
		const count = await tabs.count();

		for (let i = 0; i < count; i++) {
			await tabs.nth(i).click();

			for (let j = 0; j < count; j++) {
				if (j === i) {
					await expect(panels.nth(j)).not.toHaveAttribute('hidden');
				} else {
					await expect(panels.nth(j)).toHaveAttribute('hidden', '');
				}
			}
		}
	});

	test('clicking active tab is a no-op', async ({ page }) => {
		await page.goto(URLS.default);

		const tabs = getTabs(page);
		const panels = getPanels(page);

		await tabs.first().click();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
		await expect(panels.first()).not.toHaveAttribute('hidden');
	});
});
