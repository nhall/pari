// Feature tests beyond native Popover API behavior.
// Native behavior tests (Enter/Space, Escape, light dismiss) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	default: '/iframe.html?id=popover--default&viewMode=story',
	hover: '/iframe.html?id=popover--hover&viewMode=story',
	closeOnBlur: '/iframe.html?id=popover--close-on-blur&viewMode=story',
	closer: '/iframe.html?id=popover--closer&viewMode=story',
};

function getTrigger(page: import('@playwright/test').Page) {
	return page.locator('[data-trigger]');
}

function getContent(page: import('@playwright/test').Page) {
	return page.locator('[data-content]');
}

test.describe('Custom events', () => {
	test('fires popover:open when opened', async ({ page }) => {
		await page.goto(URLS.default);
		await page.waitForSelector('pari-popover');

		const eventPromise = page.evaluate(() => {
			return new Promise<boolean>((resolve) => {
				document.querySelector('pari-popover')!.addEventListener('popover:open', () => {
					resolve(true);
				});
				setTimeout(() => resolve(false), 2000);
			});
		});

		await getTrigger(page).click();
		expect(await eventPromise).toBe(true);
	});

	test('fires popover:close when closed', async ({ page }) => {
		await page.goto(URLS.default);
		await page.waitForSelector('pari-popover');

		await page.evaluate(() => {
			(window as any).__popoverCloseFired = false;
			document.querySelector('pari-popover')!.addEventListener('popover:close', () => {
				(window as any).__popoverCloseFired = true;
			});
		});

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await page.keyboard.press('Escape');

		const fired = await page.evaluate(() => (window as any).__popoverCloseFired);
		expect(fired).toBe(true);
	});
});

test.describe('Hover mode', () => {
	test('opens on mouseenter', async ({ page }) => {
		await page.goto(URLS.hover);

		await getTrigger(page).hover({ force: true });
		await expect(getContent(page)).toBeVisible();
	});

	test('closes on mouseleave after debounce', async ({ page }) => {
		await page.goto(URLS.hover);

		await getTrigger(page).hover({ force: true });
		await expect(getContent(page)).toBeVisible();

		// Move mouse away from both trigger and content
		await page.mouse.move(0, 0);

		// Wait for 150ms debounce + buffer
		await page.waitForTimeout(300);
		await expect(getContent(page)).toBeHidden();
	});

	test('stays open when moving from trigger to content', async ({ page }) => {
		await page.goto(URLS.hover);

		await getTrigger(page).hover({ force: true });
		await expect(getContent(page)).toBeVisible();

		// Move to the popover content
		await getContent(page).hover({ force: true });
		await page.waitForTimeout(300);

		await expect(getContent(page)).toBeVisible();
	});
});

test.describe('Close on blur', () => {
	test('closes when focus moves outside', async ({ page }) => {
		await page.goto(URLS.closeOnBlur);

		await page.evaluate(() => {
			const el = document.createElement('button');
			el.id = 'outside-focus-target';
			el.textContent = 'Outside';
			document.body.appendChild(el);
		});

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await page.locator('#outside-focus-target').focus();
		await expect(getContent(page)).toBeHidden();
	});

	test('stays open when focus remains inside', async ({ page }) => {
		await page.goto(URLS.closeOnBlur);

		await getTrigger(page).click();
		await expect(getContent(page)).toBeVisible();

		await getContent(page).locator('a').first().focus();
		await expect(getContent(page)).toBeVisible();
	});
});

test.describe('Initial state', () => {
	test('popover is closed initially', async ({ page }) => {
		await page.goto(URLS.default);
		await expect(getContent(page)).toBeHidden();
	});
});
