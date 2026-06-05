import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';

import '../src/components/tooltip/tooltip';

const meta: Meta = {
	title: 'Tooltip',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-tooltip>
			<button data-trigger>Hover or focus me</button>
			<div data-content>Helpful context for this action</div>
		</pari-tooltip>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;
		const pariTooltip = canvasElement.querySelector('pari-tooltip') as any;

		// ARIA wiring
		await expect(trigger).toHaveAttribute('aria-describedby', content.id);
		await expect(content).toHaveAttribute('role', 'tooltip');
		await expect(content).toHaveAttribute('popover', 'manual');

		// Focus shows immediately
		trigger.focus();
		expect(pariTooltip.open).toBe(true);
		expect(content.matches(':popover-open')).toBe(true);

		// Escape hides without moving focus
		trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(pariTooltip.open).toBe(false);
		expect(document.activeElement).toBe(trigger);

		// Blur fully (Escape kept focus on the trigger), then refocus to retrigger show
		trigger.blur();
		trigger.focus();
		expect(pariTooltip.open).toBe(true);

		trigger.blur();
		expect(pariTooltip.open).toBe(false);

		// Hover-shown tooltip is dismissable via Escape (APG requirement)
		trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
		expect(pariTooltip.open).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(pariTooltip.open).toBe(false);

		trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));

		// No-op guards
		pariTooltip.hide();
		expect(pariTooltip.open).toBe(false);
		pariTooltip.show();
		expect(pariTooltip.open).toBe(true);
		pariTooltip.show();
		expect(pariTooltip.open).toBe(true);
		pariTooltip.hide();
		expect(pariTooltip.open).toBe(false);
	},
};

export const CustomDelay: Story = {
	render: () => html`
		<pari-tooltip delay="600">
			<button data-trigger>Hover me (600ms delay)</button>
			<div data-content>This tooltip has a longer hover delay</div>
		</pari-tooltip>
	`,
	play: async ({ canvasElement }) => {
		const pariTooltip = canvasElement.querySelector('pari-tooltip') as any;
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;

		// Focus still shows immediately even with a custom delay
		trigger.focus();
		expect(pariTooltip.open).toBe(true);
		trigger.blur();
		expect(pariTooltip.open).toBe(false);
	},
};

export const OnIcon: Story = {
	render: () => html`
		<pari-tooltip>
			<button data-trigger aria-label="Delete item">
				<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div data-content>Delete item</div>
		</pari-tooltip>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;
		const pariTooltip = canvasElement.querySelector('pari-tooltip') as any;

		// aria-describedby supplements the aria-label with tooltip text
		await expect(trigger).toHaveAttribute('aria-describedby', content.id);

		trigger.focus();
		expect(pariTooltip.open).toBe(true);
		trigger.blur();
	},
};
