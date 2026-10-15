import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';

import '../src/components/dialog/dialog';

const meta: Meta = {
	title: 'Dialog',
};

export default meta;

type Story = StoryObj;

const tick = () => new Promise((r) => setTimeout(r, 50));

const MEDIA_QUERY = '(max-width: 740px)';

let fakeMediaQueryList: (EventTarget & { matches: boolean; media: string }) | null = null;

const stubMatchMedia = (matches: boolean) => {
	const original = window.matchMedia;
	const fake = Object.assign(new EventTarget(), { matches, media: MEDIA_QUERY });
	fakeMediaQueryList = fake;
	window.matchMedia = (query: string) =>
		query === MEDIA_QUERY ? (fake as unknown as MediaQueryList) : original.call(window, query);

	return () => {
		window.matchMedia = original;
		fakeMediaQueryList = null;
	};
};

const stubHashAndMatchMedia = (hash: string, matches: boolean) => {
	history.replaceState(null, '', hash);
	const restore = stubMatchMedia(matches);

	return () => {
		restore();
		history.replaceState(null, '', window.location.pathname + window.location.search);
	};
};

const setMediaMatches = (matches: boolean) => {
	fakeMediaQueryList!.matches = matches;
	fakeMediaQueryList!.dispatchEvent(new MediaQueryListEvent('change', { matches, media: MEDIA_QUERY }));
};

export const Default: Story = {
	render: () => html`
		<pari-dialog>
			<button data-trigger>Open dialog</button>
			<dialog id="default-dialog" aria-labelledby="default-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="default-dialog-title">Dialog title</h2>
					<p>This is a modal dialog. Focus is trapped inside and Escape closes it.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;
		const pariDialog = canvasElement.querySelector('pari-dialog') as any;

		await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		await expect(dialog).not.toHaveAttribute('aria-modal');
		expect(dialog.open).toBe(false);

		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);
		await expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(document.documentElement.classList.contains('state-locked')).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
		expect(dialog.open).toBe(false);
		await expect(dialog).not.toHaveAttribute('aria-modal');
		expect(document.documentElement.classList.contains('state-locked')).toBe(false);

		// No-op guards
		pariDialog.hide();
		expect(dialog.open).toBe(false);

		pariDialog.show();
		await tick();
		expect(dialog.open).toBe(true);
		pariDialog.show();
		expect(dialog.open).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
	},
};

export const BackdropClose: Story = {
	render: () => html`
		<pari-dialog close-on-backdrop>
			<button data-trigger>Open dialog</button>
			<dialog id="backdrop-dialog" aria-labelledby="backdrop-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="backdrop-dialog-title">Backdrop close</h2>
					<p>Click outside this dialog to close it.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;

		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);

		// Synthetic clicks have clientX/Y of 0 which falls outside the dialog rect,
		// so we must dispatch MouseEvents with explicit coordinates for this test.
		const insideRect = dialog.getBoundingClientRect();
		dialog.dispatchEvent(new MouseEvent('click', {
			clientX: insideRect.left + insideRect.width / 2,
			clientY: insideRect.top + insideRect.height / 2,
			bubbles: true,
		}));
		expect(dialog.open).toBe(true);

		dialog.dispatchEvent(new MouseEvent('click', {
			clientX: insideRect.left - 10,
			clientY: insideRect.top - 10,
			bubbles: true,
		}));
		await tick();
		expect(dialog.open).toBe(false);
	},
};

export const NoScrollLock: Story = {
	render: () => html`
		<pari-dialog no-scroll-lock>
			<button data-trigger>Open dialog</button>
			<dialog id="no-lock-dialog" aria-labelledby="no-lock-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="no-lock-dialog-title">No scroll lock</h2>
					<p>The page behind this dialog can still scroll.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
		<div style="block-size: 200vh;"></div>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;

		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);
		expect(document.documentElement.classList.contains('state-locked')).toBe(false);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
	},
};

export const Deeplink: Story = {
	render: () => html`
		<pari-dialog deeplink>
			<button data-trigger>Open dialog</button>
			<dialog id="dl-dialog" aria-labelledby="dl-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="dl-dialog-title">Deeplinked dialog</h2>
					<p>Navigate to #dl-dialog to open this dialog directly.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;

		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);
		expect(window.location.hash).toBe('#dl-dialog');

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
		expect(dialog.open).toBe(false);

		// Simulate hash navigation opening the dialog
		history.replaceState(null, '', '#dl-dialog');
		window.dispatchEvent(new HashChangeEvent('hashchange'));
		await tick();
		expect(dialog.open).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
	},
};

export const MediaGated: Story = {
	beforeEach: () => stubMatchMedia(false),
	render: () => html`
		<pari-dialog media=${MEDIA_QUERY}>
			<button data-trigger>Open dialog</button>
			<dialog id="media-dialog" aria-labelledby="media-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="media-dialog-title">Media gated</h2>
					<p>This dialog can only open while the media query matches.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;
		const pariDialog = canvasElement.querySelector('pari-dialog') as any;
		const isLocked = () => document.documentElement.classList.contains('state-locked');

		let closeCount = 0;
		canvasElement.addEventListener('dialog:close', () => closeCount++);

		trigger.click();
		await tick();
		expect(dialog.open).toBe(false);
		expect(isLocked()).toBe(false);

		pariDialog.show();
		await tick();
		expect(dialog.open).toBe(false);
		await expect(dialog).not.toHaveAttribute('aria-modal');

		setMediaMatches(true);
		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);
		expect(isLocked()).toBe(true);

		// Leaving the matching range force-closes through the normal close path
		setMediaMatches(false);
		await tick();
		expect(dialog.open).toBe(false);
		expect(isLocked()).toBe(false);
		expect(closeCount).toBe(1);

		// Re-entering the matching range does not reopen
		setMediaMatches(true);
		await tick();
		expect(dialog.open).toBe(false);

		// Leaving the range while already closed fires nothing
		setMediaMatches(false);
		await tick();
		expect(closeCount).toBe(1);
	},
};

export const MediaGatedDeeplink: Story = {
	beforeEach: () => stubHashAndMatchMedia('#media-dl-dialog', false),
	render: () => html`
		<pari-dialog deeplink media=${MEDIA_QUERY}>
			<button data-trigger>Open dialog</button>
			<dialog id="media-dl-dialog" aria-labelledby="media-dl-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="media-dl-dialog-title">Media gated deeplink</h2>
					<p>The URL hash only opens this dialog while the media query matches.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;

		// A matching hash on load does not open the dialog while the query does not match
		await tick();
		expect(dialog.open).toBe(false);

		window.dispatchEvent(new HashChangeEvent('hashchange'));
		await tick();
		expect(dialog.open).toBe(false);

		setMediaMatches(true);
		window.dispatchEvent(new HashChangeEvent('hashchange'));
		await tick();
		expect(dialog.open).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
	},
};

export const MediaGatedDeeplinkOnLoad: Story = {
	beforeEach: () => stubHashAndMatchMedia('#media-dl-load-dialog', true),
	render: () => html`
		<pari-dialog deeplink media=${MEDIA_QUERY}>
			<button data-trigger>Open dialog</button>
			<dialog id="media-dl-load-dialog" aria-labelledby="media-dl-load-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="media-dl-load-dialog-title">Media gated deeplink on load</h2>
					<p>The URL hash opens this dialog on load because the media query matches.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;

		// A matching hash on load opens the dialog while the query matches
		await tick();
		expect(dialog.open).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
		expect(window.location.hash).toBe('');
	},
};

export const MediaQuery: Story = {
	render: () => html`
		<style>
			@media (min-width: 741px) {
				.sb-media-dialog [data-trigger],
				.sb-media-dialog [data-close] {
					display: none;
				}

				.sb-media-dialog dialog {
					max-inline-size: 20rem;

					display: block;
					position: static;

					margin-block: 0;
					margin-inline: 0;
				}
			}
		</style>
		<pari-dialog class="sb-media-dialog" media="(max-width: 740px)">
			<button data-trigger>Show filters</button>
			<dialog id="media-demo-dialog" aria-labelledby="media-demo-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="media-demo-dialog-title">Filters</h2>
					<p>On small screens, these filters open in a modal dialog. On larger screens, the trigger hides and the filters sit inline like a sidebar. If the dialog is open when you cross the breakpoint, it closes and the page scrolls again. Resize your browser to see it switch.</p>
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
};

export const Autofocus: Story = {
	render: () => html`
		<pari-dialog>
			<button data-trigger>Open dialog</button>
			<dialog id="autofocus-dialog" aria-labelledby="autofocus-dialog-title">
				<div class="sb-dialog-body">
					<h2 id="autofocus-dialog-title">Custom initial focus</h2>
					<p>The input below receives focus when the dialog opens.</p>
					<input type="text" autofocus placeholder="I get focused" />
					<button data-close>Close</button>
				</div>
			</dialog>
		</pari-dialog>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const input = canvasElement.querySelector('[autofocus]') as HTMLElement;

		trigger.click();
		await tick();
		await expect(input).toHaveFocus();

		canvasElement.querySelector<HTMLElement>('dialog [data-close]')!.click();
		await tick();
	},
};

export const LongContent: Story = {
	render: () => html`
		<pari-dialog>
			<button data-trigger>Open dialog</button>
			<dialog id="long-dialog" aria-labelledby="long-dialog-title">
				<div class="sb-dialog-body">
					<button data-close autofocus>Close</button>
					<h2 id="long-dialog-title">Scrollable dialog</h2>
					${Array.from({ length: 20 }, (_, i) => html`<p>Paragraph ${i + 1}. Content that extends the dialog beyond the viewport to test internal scrolling.</p>`)}
				</div>
			</dialog>
		</pari-dialog>
	`,
};
