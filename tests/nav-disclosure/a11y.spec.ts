// APG Disclosure Navigation (Hybrid) Pattern
// https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=nav-disclosure--default&viewMode=story',
};

function getTriggers(page: import('@playwright/test').Page) {
	return page.locator('pari-nav-disclosure > pari-disclosure [data-trigger]');
}

function getDisclosures(page: import('@playwright/test').Page) {
	return page.locator('pari-nav-disclosure > pari-disclosure');
}

function getItems(page: import('@playwright/test').Page, index: number) {
	return page.locator(`pari-nav-disclosure > pari-disclosure:nth-child(${index + 1}) [data-item]`);
}

test.describe('axe audit', () => {
	test('default variant has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await checkA11y(page);
	});
});

test.describe('ARIA structure', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('each trigger has aria-haspopup="true"', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();

		for (let i = 0; i < count; i++) {
			await expect(triggers.nth(i)).toHaveAttribute('aria-haspopup', 'true');
		}
	});

	test('each trigger has aria-expanded', async ({ page }) => {
		const triggers = getTriggers(page);
		const count = await triggers.count();

		for (let i = 0; i < count; i++) {
			const value = await triggers.nth(i).getAttribute('aria-expanded');
			expect(['true', 'false']).toContain(value);
		}
	});
});

test.describe('Click activation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('clicking a trigger opens the panel', async ({ page }) => {
		const trigger = getTriggers(page).first();
		await trigger.click();

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	test('panel stays open until another is opened', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.first().click();
		await expect(disclosures.first()).toHaveAttribute('open');

		// Focus a child link — panel should stay open
		await getItems(page, 0).first().focus();
		await expect(disclosures.first()).toHaveAttribute('open');
	});

	test('opening another panel closes the previous', async ({ page }) => {
		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.first().click();
		await expect(disclosures.first()).toHaveAttribute('open');

		await triggers.nth(1).click();
		await expect(disclosures.nth(1)).toHaveAttribute('open');
		await expect(disclosures.first()).not.toHaveAttribute('open');
	});
});

test.describe('Escape', () => {
	test('closes the open panel', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTriggers(page).first();
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('returns focus to the trigger', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTriggers(page).first();
		await trigger.click();

		// Move focus into the submenu
		await getItems(page, 0).first().focus();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});
});

test.describe('Focus leaving nav', () => {
	test('all panels close when focus moves outside the nav', async ({ page }) => {
		await page.goto(URLS.default);

		await page.evaluate(() => {
			const el = document.createElement('button');
			el.id = 'outside-focus-target';
			el.textContent = 'Outside';
			document.body.appendChild(el);
		});

		const triggers = getTriggers(page);
		const disclosures = getDisclosures(page);

		await triggers.first().click();
		await expect(disclosures.first()).toHaveAttribute('open');

		await page.locator('#outside-focus-target').focus();
		await expect(disclosures.first()).not.toHaveAttribute('open');
	});
});

test.describe('Keyboard — trigger level', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('ArrowDown opens panel and focuses first child', async ({ page }) => {
		const trigger = getTriggers(page).first();
		await trigger.focus();
		await page.keyboard.press('ArrowDown');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(getItems(page, 0).first()).toBeFocused();
	});

	test('ArrowUp opens panel and focuses last child', async ({ page }) => {
		const trigger = getTriggers(page).first();
		await trigger.focus();
		await page.keyboard.press('ArrowUp');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		const items = getItems(page, 0);
		const count = await items.count();
		await expect(items.nth(count - 1)).toBeFocused();
	});
});

test.describe('Keyboard — child level', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
		await getTriggers(page).first().click();
	});

	test('ArrowDown moves focus to next child', async ({ page }) => {
		const items = getItems(page, 0);
		await items.first().focus();
		await page.keyboard.press('ArrowDown');

		await expect(items.nth(1)).toBeFocused();
	});

	test('ArrowUp moves focus to previous child', async ({ page }) => {
		const items = getItems(page, 0);
		await items.nth(1).focus();
		await page.keyboard.press('ArrowUp');

		await expect(items.first()).toBeFocused();
	});

	test('Home moves focus to first child', async ({ page }) => {
		const items = getItems(page, 0);
		await items.nth(2).focus();
		await page.keyboard.press('Home');

		await expect(items.first()).toBeFocused();
	});

	test('End moves focus to last child', async ({ page }) => {
		const items = getItems(page, 0);
		const count = await items.count();
		await items.first().focus();
		await page.keyboard.press('End');

		await expect(items.nth(count - 1)).toBeFocused();
	});
});
