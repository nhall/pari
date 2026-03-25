import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect, userEvent } from 'storybook/test';

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
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		await expect(trigger).toHaveAttribute('popovertarget');
		await expect(content).toHaveAttribute('popover', 'auto');

		trigger.click();
		expect(content.matches(':popover-open')).toBe(true);

		trigger.click();
		expect(content.matches(':popover-open')).toBe(false);
	},
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
