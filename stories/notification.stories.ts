import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';

import '../src/components/notification/notification';

const meta: Meta = {
	title: 'Notification',
};

export default meta;

type Story = StoryObj;

const tick = () => new Promise((r) => setTimeout(r, 50));

export const Default: Story = {
	render: () => html`
		<pari-notification>
			<div data-content popover="manual">
				<p>Your changes have been saved.</p>
				<button data-close>Dismiss</button>
			</div>
		</pari-notification>
	`,
	play: async ({ canvasElement }) => {
		const pariNotification = canvasElement.querySelector('pari-notification') as any;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		// ARIA attributes set correctly on [data-content]
		await expect(content).toHaveAttribute('role', 'status');
		await expect(content).toHaveAttribute('aria-atomic', 'true');
		await expect(content).toHaveAttribute('aria-live', 'polite');
		await expect(content).toHaveAttribute('popover', 'manual');

		expect(pariNotification.open).toBe(false);

		// Show
		pariNotification.show();
		await tick();
		expect(pariNotification.open).toBe(true);
		expect(content.matches(':popover-open')).toBe(true);

		// No-op guard — show when already open
		pariNotification.show();
		expect(pariNotification.open).toBe(true);

		// Dismiss via close button
		content.querySelector<HTMLElement>('[data-close]')!.click();
		await tick();
		expect(pariNotification.open).toBe(false);

		// No-op guard — hide when already closed
		pariNotification.hide();
		expect(pariNotification.open).toBe(false);

		// Events fire in order
		const events: string[] = [];
		pariNotification.addEventListener('notification:open', () => events.push('open'));
		pariNotification.addEventListener('notification:close', () => events.push('close'));

		pariNotification.show();
		await tick();
		pariNotification.hide();
		await tick();

		expect(events).toEqual(['open', 'close']);
	},
};

export const Alert: Story = {
	render: () => html`
		<pari-notification role="alert">
			<div data-content popover="manual">
				<p>Error: unable to save your changes. Please try again.</p>
				<button data-close>Dismiss</button>
			</div>
		</pari-notification>
	`,
	play: async ({ canvasElement }) => {
		const pariNotification = canvasElement.querySelector('pari-notification') as any;
		const content = canvasElement.querySelector('[data-content]') as HTMLElement;

		// Alert role produces assertive live region
		await expect(content).toHaveAttribute('role', 'alert');
		await expect(content).toHaveAttribute('aria-atomic', 'true');
		await expect(content).toHaveAttribute('aria-live', 'assertive');

		pariNotification.show();
		await tick();
		expect(pariNotification.open).toBe(true);

		pariNotification.hide();
		await tick();
		expect(pariNotification.open).toBe(false);
	},
};

export const NoCloseButton: Story = {
	render: () => html`
		<pari-notification>
			<div data-content popover="manual">
				<p>Draft saved automatically.</p>
			</div>
		</pari-notification>
	`,
	play: async ({ canvasElement }) => {
		const pariNotification = canvasElement.querySelector('pari-notification') as any;

		// Works without a close button — dismiss programmatically
		pariNotification.show();
		await tick();
		expect(pariNotification.open).toBe(true);

		pariNotification.hide();
		await tick();
		expect(pariNotification.open).toBe(false);
	},
};
