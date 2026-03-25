import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

import '../src/components/dialog/dialog';

const meta: Meta = {
	title: 'Dialog',
};

export default meta;

type Story = StoryObj;

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
