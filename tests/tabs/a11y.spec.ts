// APG Tabs Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=tabs--default&viewMode=story',
	manual: '/iframe.html?id=tabs--manual&viewMode=story',
	vertical: '/iframe.html?id=tabs--vertical&viewMode=story',
};

function getTabs(page: import('@playwright/test').Page) {
	return page.locator('[data-tab]');
}

function getPanels(page: import('@playwright/test').Page) {
	return page.locator('[data-panel]');
}

test.describe('axe audit', () => {
	test('default variant has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await checkA11y(page);
	});

	test('manual variant has no violations', async ({ page }) => {
		await page.goto(URLS.manual);
		await checkA11y(page);
	});

	test('vertical variant has no violations', async ({ page }) => {
		await page.goto(URLS.vertical);
		await checkA11y(page);
	});
});

test.describe('ARIA structure', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('tablist has role="tablist"', async ({ page }) => {
		await expect(page.locator('[data-tablist]')).toHaveAttribute('role', 'tablist');
	});

	test('each tab has role="tab"', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();

		for (let i = 0; i < count; i++) {
			await expect(tabs.nth(i)).toHaveAttribute('role', 'tab');
		}
	});

	test('each panel has role="tabpanel"', async ({ page }) => {
		const panels = getPanels(page);
		const count = await panels.count();

		for (let i = 0; i < count; i++) {
			await expect(panels.nth(i)).toHaveAttribute('role', 'tabpanel');
		}
	});

	test('active tab has aria-selected="true"', async ({ page }) => {
		await expect(getTabs(page).first()).toHaveAttribute('aria-selected', 'true');
	});

	test('inactive tabs have aria-selected="false"', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();

		for (let i = 1; i < count; i++) {
			await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'false');
		}
	});

	test('each tab has aria-controls pointing to its panel', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();

		for (let i = 0; i < count; i++) {
			const controlsId = await tabs.nth(i).getAttribute('aria-controls');
			expect(controlsId).toBeTruthy();

			const panel = page.locator(`[id="${controlsId}"]`);
			await expect(panel).toHaveCount(1);
			await expect(panel).toHaveAttribute('role', 'tabpanel');
		}
	});

	test('each panel has aria-labelledby pointing to its tab', async ({ page }) => {
		const panels = getPanels(page);
		const count = await panels.count();

		for (let i = 0; i < count; i++) {
			const labelledBy = await panels.nth(i).getAttribute('aria-labelledby');
			expect(labelledBy).toBeTruthy();

			const tab = page.locator(`[id="${labelledBy}"]`);
			await expect(tab).toHaveCount(1);
			await expect(tab).toHaveAttribute('role', 'tab');
		}
	});

	test('active tab has tabindex="0", inactive tabs have tabindex="-1"', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();

		await expect(tabs.first()).toHaveAttribute('tabindex', '0');

		for (let i = 1; i < count; i++) {
			await expect(tabs.nth(i)).toHaveAttribute('tabindex', '-1');
		}
	});
});

test.describe('Initial state', () => {
	test('first tab is active by default', async ({ page }) => {
		await page.goto(URLS.default);

		await expect(getTabs(page).first()).toHaveAttribute('aria-selected', 'true');
		await expect(getPanels(page).first()).not.toHaveAttribute('hidden');
	});

	test('inactive panels are hidden', async ({ page }) => {
		await page.goto(URLS.default);

		const panels = getPanels(page);
		const count = await panels.count();

		for (let i = 1; i < count; i++) {
			await expect(panels.nth(i)).toHaveAttribute('hidden', '');
		}
	});
});

test.describe('Click activation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('clicking a tab activates it', async ({ page }) => {
		const tabs = getTabs(page);
		const panels = getPanels(page);

		await tabs.nth(1).click();

		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'false');
		await expect(panels.nth(1)).not.toHaveAttribute('hidden');
		await expect(panels.first()).toHaveAttribute('hidden', '');
	});
});

test.describe('Keyboard navigation — horizontal (default)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('ArrowRight moves focus and activates next tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowRight');

		await expect(tabs.nth(1)).toBeFocused();
		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	test('ArrowLeft moves focus and activates previous tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.nth(1).click();
		await page.keyboard.press('ArrowLeft');

		await expect(tabs.first()).toBeFocused();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	test('Home moves focus to first tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.nth(2).click();
		await page.keyboard.press('Home');

		await expect(tabs.first()).toBeFocused();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	test('End moves focus to last tab', async ({ page }) => {
		const tabs = getTabs(page);
		const count = await tabs.count();
		await tabs.first().focus();
		await page.keyboard.press('End');

		await expect(tabs.nth(count - 1)).toBeFocused();
		await expect(tabs.nth(count - 1)).toHaveAttribute('aria-selected', 'true');
	});

	test('ArrowDown does not navigate in horizontal mode', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowDown');

		await expect(tabs.first()).toBeFocused();
	});
});

test.describe('Keyboard navigation — vertical', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.vertical);
	});

	test('tablist has aria-orientation="vertical"', async ({ page }) => {
		await expect(page.locator('[data-tablist]')).toHaveAttribute('aria-orientation', 'vertical');
	});

	test('ArrowDown moves focus and activates next tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowDown');

		await expect(tabs.nth(1)).toBeFocused();
		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	test('ArrowUp moves focus and activates previous tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.nth(1).click();
		await page.keyboard.press('ArrowUp');

		await expect(tabs.first()).toBeFocused();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
	});

	test('ArrowRight does not navigate in vertical mode', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowRight');

		await expect(tabs.first()).toBeFocused();
	});
});

test.describe('Manual activation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.manual);
	});

	test('arrow keys move focus but do not activate', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowRight');

		await expect(tabs.nth(1)).toBeFocused();
		await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
	});

	test('Enter activates the focused tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('Enter');

		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	test('Space activates the focused tab', async ({ page }) => {
		const tabs = getTabs(page);
		await tabs.first().focus();
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press(' ');

		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});
});
