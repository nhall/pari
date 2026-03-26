import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';

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
		const pariPopover = canvasElement.querySelector('pari-popover') as any;

		await expect(trigger).toHaveAttribute('popovertarget');
		await expect(content).toHaveAttribute('popover', 'auto');

		trigger.click();
		expect(content.matches(':popover-open')).toBe(true);
		expect(pariPopover.open).toBe(true);

		trigger.click();
		expect(content.matches(':popover-open')).toBe(false);
		expect(pariPopover.open).toBe(false);

		// No-op guards, prevents native InvalidStateError
		pariPopover.show();
		expect(pariPopover.open).toBe(true);

		pariPopover.hide();
		expect(pariPopover.open).toBe(false);

		pariPopover.hide();
		expect(pariPopover.open).toBe(false);
		pariPopover.show();
		pariPopover.show();
		expect(pariPopover.open).toBe(true);
		pariPopover.hide();
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
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		// Hover mode bypasses popovertarget to avoid click-toggle conflicts
		expect(trigger.hasAttribute('popovertarget')).toBe(false);

		trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		expect(content.matches(':popover-open')).toBe(true);

		trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
		expect(content.matches(':popover-open')).toBe(false);

		// Moving from trigger to content cancels the close debounce
		trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		expect(content.matches(':popover-open')).toBe(true);

		trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		content.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

		await new Promise((r) => setTimeout(r, 200));
		expect(content.matches(':popover-open')).toBe(true);

		content.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
	},
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
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		trigger.click();
		expect(content.matches(':popover-open')).toBe(true);

		// Focus inside popover should keep it open
		content.querySelector<HTMLElement>('a')!.focus();
		await new Promise((r) => setTimeout(r, 50));
		expect(content.matches(':popover-open')).toBe(true);

		// Focus outside closes
		const outsideBtn = document.createElement('button');
		outsideBtn.textContent = 'outside';
		document.body.appendChild(outsideBtn);
		outsideBtn.focus();
		await new Promise((r) => setTimeout(r, 50));
		expect(content.matches(':popover-open')).toBe(false);
		outsideBtn.remove();
	},
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
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		trigger.click();
		expect(content.matches(':popover-open')).toBe(true);

		content.querySelector<HTMLElement>('[data-close]')!.click();
		expect(content.matches(':popover-open')).toBe(false);
	},
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
