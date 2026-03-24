// Feature tests beyond the core APG dialog pattern.
// APG pattern tests (ARIA structure, focus, Escape) are in a11y.spec.ts.
import { test, expect } from '@playwright/test';

const URLS = {
	default: '/iframe.html?id=dialog--default&viewMode=story',
	backdropClose: '/iframe.html?id=dialog--backdrop-close&viewMode=story',
	noScrollLock: '/iframe.html?id=dialog--no-scroll-lock&viewMode=story',
	longContent: '/iframe.html?id=dialog--long-content&viewMode=story',
};

function getTrigger(page: import('@playwright/test').Page) {
	return page.locator('[data-trigger]');
}

function getDialog(page: import('@playwright/test').Page) {
	return page.locator('dialog');
}

test.describe('Backdrop click', () => {
	test('default does not close on backdrop click', async ({ page }) => {
		await page.goto(URLS.default);

		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.mouse.click(5, 5);
		await expect(getDialog(page)).toHaveJSProperty('open', true);
	});

	test('close-on-backdrop closes on backdrop click', async ({ page }) => {
		await page.goto(URLS.backdropClose);

		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.mouse.click(5, 5);
		await expect(getDialog(page)).toHaveJSProperty('open', false);
	});

	test('clicking inside dialog content does not close', async ({ page }) => {
		await page.goto(URLS.backdropClose);

		await getTrigger(page).click();
		const dialog = getDialog(page);

		await dialog.locator('p').click();
		await expect(dialog).toHaveJSProperty('open', true);
	});
});

test.describe('Scroll lock', () => {
	test('scroll is locked when dialog opens', async ({ page }) => {
		await page.goto(URLS.longContent);

		await getTrigger(page).click();

		const isLocked = await page.evaluate(() =>
			document.documentElement.classList.contains('state-locked')
		);
		expect(isLocked).toBe(true);
	});

	test('scroll is unlocked when dialog closes', async ({ page }) => {
		await page.goto(URLS.longContent);

		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);

		await page.keyboard.press('Escape');
		await expect(getDialog(page)).toHaveJSProperty('open', false);

		const isLocked = await page.evaluate(() =>
			document.documentElement.classList.contains('state-locked')
		);
		expect(isLocked).toBe(false);
	});

	test('no-scroll-lock disables scroll locking', async ({ page }) => {
		await page.goto(URLS.noScrollLock);

		await getTrigger(page).click();

		const isLocked = await page.evaluate(() =>
			document.documentElement.classList.contains('state-locked')
		);
		expect(isLocked).toBe(false);
	});
});

test.describe('Custom events', () => {
	test('fires dialog:open when opened', async ({ page }) => {
		await page.goto(URLS.default);
		await page.waitForSelector('pari-dialog');

		const eventPromise = page.evaluate(() => {
			return new Promise<boolean>((resolve) => {
				document.querySelector('pari-dialog')!.addEventListener('dialog:open', () => {
					resolve(true);
				});
				setTimeout(() => resolve(false), 2000);
			});
		});

		await getTrigger(page).click();
		expect(await eventPromise).toBe(true);
	});

	test('fires dialog:close when closed', async ({ page }) => {
		await page.goto(URLS.default);
		await page.waitForSelector('pari-dialog');

		// Set up listener, open, then close — listener must be attached before close
		await page.evaluate(() => {
			(window as any).__dialogCloseFired = false;
			document.querySelector('pari-dialog')!.addEventListener('dialog:close', () => {
				(window as any).__dialogCloseFired = true;
			});
		});

		await getTrigger(page).click();
		await page.keyboard.press('Escape');

		const fired = await page.evaluate(() => (window as any).__dialogCloseFired);
		expect(fired).toBe(true);
	});
});

test.describe('Open state', () => {
	test('dialog is closed initially', async ({ page }) => {
		await page.goto(URLS.default);
		await expect(getDialog(page)).toHaveJSProperty('open', false);
	});

	test('trigger opens the dialog', async ({ page }) => {
		await page.goto(URLS.default);
		await getTrigger(page).click();
		await expect(getDialog(page)).toHaveJSProperty('open', true);
	});
});
