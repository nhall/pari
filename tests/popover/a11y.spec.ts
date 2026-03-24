// Popover API wrapper — keyboard and light-dismiss handled natively.
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=popover--default&viewMode=story',
	closer: '/iframe.html?id=popover--closer&viewMode=story',
};

function getTrigger(page: import('@playwright/test').Page) {
	return page.locator('[data-trigger]');
}

function getContent(page: import('@playwright/test').Page) {
	return page.locator('[data-content]');
}

test.describe('axe audit', () => {
	test('default variant has no violations', async ({ page }) => {
		await page.goto(URLS.default);
		await checkA11y(page);
	});
});

test.describe('Native popover wiring', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('trigger has popovertarget pointing to content', async ({ page }) => {
		const targetId = await getTrigger(page).getAttribute('popovertarget');
		expect(targetId).toBeTruthy();

		const content = page.locator(`[id="${targetId}"]`);
		await expect(content).toHaveCount(1);
		await expect(content).toHaveAttribute('popover', 'auto');
	});

	test('content has popover="auto"', async ({ page }) => {
		await expect(getContent(page)).toHaveAttribute('popover', 'auto');
	});
});

test.describe('Keyboard — Enter / Space', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('Enter opens the popover', async ({ page }) => {
		await getTrigger(page).focus();
		await page.keyboard.press('Enter');

		await expect(getContent(page)).toBeVisible();
	});

	test('Space opens the popover', async ({ page }) => {
		await getTrigger(page).focus();
		await page.keyboard.press(' ');

		await expect(getContent(page)).toBeVisible();
	});

	test('Enter closes an open popover', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(getContent(page)).toBeVisible();

		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(getContent(page)).toBeHidden();
	});
});

test.describe('Escape', () => {
	test('Escape closes the popover', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(getContent(page)).toBeHidden();
	});
});

test.describe('Light dismiss', () => {
	test('clicking outside closes the popover', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await page.locator('body').click({ position: { x: 0, y: 0 } });
		await expect(getContent(page)).toBeHidden();
	});
});

test.describe('Close button', () => {
	test('clicking close button closes the popover', async ({ page }) => {
		await page.goto(URLS.closer);

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await page.locator('[data-close]').click();
		await expect(getContent(page)).toBeHidden();
	});
});
