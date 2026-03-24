// APG Dialog (Modal) Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=dialog--default&viewMode=story',
	autofocus: '/iframe.html?id=dialog--autofocus&viewMode=story',
};

function getTrigger(page: import('@playwright/test').Page) {
	return page.locator('[data-trigger]');
}

function getDialog(page: import('@playwright/test').Page) {
	return page.locator('dialog');
}

test.describe('axe audit', () => {
	test('closed state has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await checkA11y(page);
	});

	test('open state has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await getTrigger(page).click();
		await checkA11y(page);
	});
});

test.describe('ARIA structure', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('dialog has aria-modal="true"', async ({ page }) => {
		await expect(getDialog(page)).toHaveAttribute('aria-modal', 'true');
	});

	test('dialog has aria-labelledby', async ({ page }) => {
		const labelledBy = await getDialog(page).getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();

		const heading = page.locator(`[id="${labelledBy}"]`);
		await expect(heading).toHaveCount(1);
	});

	test('trigger has aria-haspopup="dialog"', async ({ page }) => {
		await expect(getTrigger(page)).toHaveAttribute('aria-haspopup', 'dialog');
	});
});

test.describe('Focus management', () => {
	test('dialog receives focus when opened', async ({ page }) => {
		await page.goto(URLS.default);
		await getTrigger(page).click();

		const focused = page.locator(':focus');
		const dialog = getDialog(page);

		const focusedTag = await focused.evaluate((el) => el.tagName.toLowerCase());
		const isInsideDialog = await focused.evaluate((el) => !!el.closest('dialog'));

		expect(focusedTag === 'dialog' || isInsideDialog).toBe(true);
	});

	test('autofocus element receives focus', async ({ page }) => {
		await page.goto(URLS.autofocus);
		await getTrigger(page).click();

		await expect(page.locator('[autofocus]')).toBeFocused();
	});

	test('focus returns to trigger after close', async ({ page }) => {
		await page.goto(URLS.default);
		const trigger = getTrigger(page);

		await trigger.click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.locator('[data-close]').click();
		await expect(trigger).toBeFocused();
	});

	// Focus trapping is handled by the native <dialog> element.
	// Not tested here — it's a browser responsibility.
});

test.describe('Escape key', () => {
	test('Escape closes the dialog', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.keyboard.press('Escape');
		await expect(getDialog(page)).toHaveJSProperty('open', false);
	});

	test('focus returns to trigger after Escape', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await page.keyboard.press('Escape');

		await expect(getTrigger(page)).toBeFocused();
	});
});

test.describe('Close button', () => {
	test('clicking close button closes the dialog', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.locator('[data-close]').click();
		await expect(getDialog(page)).toHaveJSProperty('open', false);
	});
});
