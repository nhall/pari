// APG Disclosure Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/a11y';

const URLS = {
	default: '/iframe.html?id=disclosure--default&viewMode=story',
	startsOpen: '/iframe.html?id=disclosure--starts-open&viewMode=story',
	persistent: '/iframe.html?id=disclosure--persistent&viewMode=story',
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

	test('starts-open variant has no violations', async ({ page }) => {
		await page.goto(URLS.startsOpen);
		await checkA11y(page);
	});
});

test.describe('ARIA structure', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('trigger has aria-expanded', async ({ page }) => {
		const value = await getTrigger(page).getAttribute('aria-expanded');
		expect(['true', 'false']).toContain(value);
	});

	test('trigger has aria-controls pointing to a valid panel', async ({ page }) => {
		const controlsId = await getTrigger(page).getAttribute('aria-controls');
		expect(controlsId).toBeTruthy();

		const panel = page.locator(`[id="${controlsId}"]`);
		await expect(panel).toHaveCount(1);
	});

	test('content has hidden attribute when closed', async ({ page }) => {
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});

	test('content does not have hidden attribute when open', async ({ page }) => {
		await getTrigger(page).click();
		await expect(getContent(page)).not.toHaveAttribute('hidden');
	});
});

test.describe('Initial state', () => {
	test('default variant starts collapsed', async ({ page }) => {
		await page.goto(URLS.default);

		await expect(getTrigger(page)).toHaveAttribute('aria-expanded', 'false');
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});

	test('starts-open variant starts expanded', async ({ page }) => {
		await page.goto(URLS.startsOpen);

		await expect(getTrigger(page)).toHaveAttribute('aria-expanded', 'true');
		await expect(getContent(page)).not.toHaveAttribute('hidden');
	});
});

test.describe('Enter / Space', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(URLS.default);
	});

	test('Enter opens the panel', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(getContent(page)).not.toHaveAttribute('hidden');
	});

	test('Space opens the panel', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.focus();
		await page.keyboard.press(' ');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(getContent(page)).not.toHaveAttribute('hidden');
	});

	test('Enter closes an open panel', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Enter');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});

	test('Space closes an open panel', async ({ page }) => {
		const trigger = getTrigger(page);
		await trigger.focus();
		await page.keyboard.press(' ');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press(' ');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});
});

test.describe('Escape', () => {
	test('closes the panel', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(getContent(page)).toHaveAttribute('hidden', '');
	});

	test('returns focus to the trigger', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTrigger(page);
		await trigger.click();

		const panelLink = getContent(page).locator('a').first();

		if (await panelLink.count()) {
			await panelLink.focus();
		}

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('does not close when persistent', async ({ page }) => {
		await page.goto(URLS.persistent);

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});
});

test.describe('Outside click', () => {
	test('closes the panel', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.locator('body').click({ position: { x: 0, y: 0 } });
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('does not close when persistent', async ({ page }) => {
		await page.goto(URLS.persistent);

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.locator('body').click({ position: { x: 0, y: 0 } });
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});
});

test.describe('Focus loss', () => {
	test('closes the panel when focus moves outside', async ({ page }) => {
		await page.goto(URLS.default);

		await page.evaluate(() => {
			const el = document.createElement('button');
			el.id = 'outside-focus-target';
			el.textContent = 'Outside';
			document.body.appendChild(el);
		});

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.locator('#outside-focus-target').focus();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('does not close when persistent', async ({ page }) => {
		await page.goto(URLS.persistent);

		await page.evaluate(() => {
			const el = document.createElement('button');
			el.id = 'outside-focus-target';
			el.textContent = 'Outside';
			document.body.appendChild(el);
		});

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.locator('#outside-focus-target').focus();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});
});

test.describe('Focus management', () => {
	test('clicking the trigger to close keeps focus on the trigger', async ({ page }) => {
		await page.goto(URLS.default);

		const trigger = getTrigger(page);
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toBeFocused();
	});
});
