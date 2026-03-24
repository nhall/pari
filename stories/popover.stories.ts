// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

import '../src/components/popover/popover';

const meta: Meta = {
	title: 'Popover',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-popover>
			<button data-trigger>Toggle popover</button>
			<div data-content popover="auto">
				<p>Popover content. Click outside or press Escape to close.</p>
			</div>
		</pari-popover>
	`,
};

export const Hover: Story = {
	render: () => html`
		<pari-popover hover>
			<button data-trigger>Hover me</button>
			<div data-content popover="auto">
				<p>Opens on hover with a 150ms debounce on close.</p>
			</div>
		</pari-popover>
	`,
};

export const CloseOnBlur: Story = {
	render: () => html`
		<pari-popover close-on-blur>
			<button data-trigger>Toggle popover</button>
			<div data-content popover="auto">
				<p>Closes when focus moves outside. Tab away to close.</p>
				<a href="#">A focusable link</a>
			</div>
		</pari-popover>
	`,
};

export const Closer: Story = {
	render: () => html`
		<pari-popover>
			<button data-trigger>Toggle popover</button>
			<div data-content popover="auto">
				<p>Popover with an internal close button.</p>
				<button data-close>Close</button>
			</div>
		</pari-popover>
	`,
};

export const WithFocusableContent: Story = {
	render: () => html`
		<pari-popover>
			<button data-trigger>Toggle popover</button>
			<div data-content popover="auto">
				<nav>
					<a href="#">Link one</a>
					<a href="#">Link two</a>
					<a href="#">Link three</a>
				</nav>
			</div>
		</pari-popover>
	`,
};
