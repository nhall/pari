// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
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
				<h2 id="default-dialog-title">Dialog title</h2>
				<p>This is a modal dialog. Focus is trapped inside and Escape closes it.</p>
				<button data-close>Close</button>
			</dialog>
		</pari-dialog>
	`,
};

export const BackdropClose: Story = {
	render: () => html`
		<pari-dialog close-on-backdrop>
			<button data-trigger>Open dialog</button>
			<dialog id="backdrop-dialog" aria-labelledby="backdrop-dialog-title">
				<h2 id="backdrop-dialog-title">Backdrop close</h2>
				<p>Click outside this dialog to close it.</p>
				<button data-close>Close</button>
			</dialog>
		</pari-dialog>
	`,
};

export const NoScrollLock: Story = {
	render: () => html`
		<pari-dialog no-scroll-lock>
			<button data-trigger>Open dialog</button>
			<dialog id="no-lock-dialog" aria-labelledby="no-lock-dialog-title">
				<h2 id="no-lock-dialog-title">No scroll lock</h2>
				<p>The page behind this dialog can still scroll.</p>
				<button data-close>Close</button>
			</dialog>
		</pari-dialog>
		<div style="block-size: 200vh;"></div>
	`,
};

export const Autofocus: Story = {
	render: () => html`
		<pari-dialog>
			<button data-trigger>Open dialog</button>
			<dialog id="autofocus-dialog" aria-labelledby="autofocus-dialog-title">
				<h2 id="autofocus-dialog-title">Custom initial focus</h2>
				<p>The input below receives focus when the dialog opens.</p>
				<input type="text" autofocus placeholder="I get focused" />
				<button data-close>Close</button>
			</dialog>
		</pari-dialog>
	`,
};

export const LongContent: Story = {
	render: () => html`
		<pari-dialog>
			<button data-trigger>Open dialog</button>
			<dialog id="long-dialog" aria-labelledby="long-dialog-title">
				<h2 id="long-dialog-title">Scrollable dialog</h2>
				${Array.from({ length: 20 }, (_, i) => html`<p>Paragraph ${i + 1}. Content that extends the dialog beyond the viewport to test internal scrolling.</p>`)}
				<button data-close>Close</button>
			</dialog>
		</pari-dialog>
	`,
};
