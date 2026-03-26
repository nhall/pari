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

		await expect(dialog).toHaveAttribute('aria-modal', 'true');
		await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(dialog.open).toBe(false);

		trigger.click();
		await tick();
		expect(dialog.open).toBe(true);
		expect(document.documentElement.classList.contains('state-locked')).toBe(true);

		dialog.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
		expect(dialog.open).toBe(false);
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
	},
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
