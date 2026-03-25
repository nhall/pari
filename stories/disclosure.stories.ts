import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect, userEvent } from 'storybook/test';

import '../src/components/disclosure/disclosure';

const meta: Meta = {
	title: 'Disclosure',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-disclosure>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>Panel content with a <a href="#">link inside</a>.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle details' });

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toHaveAttribute('aria-controls');

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		trigger.focus();
		await userEvent.keyboard('{Enter}');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await userEvent.keyboard('{Escape}');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toHaveFocus();
	},
};

export const StartsOpen: Story = {
	render: () => html`
		<pari-disclosure open>
			<button data-trigger>Toggle details</button>
			<div data-content>
				<div class="sb-panel">
					<p>This panel starts open.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle details' });

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	},
};

export const Persistent: Story = {
	render: () => html`
		<pari-disclosure persistent>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>Escape, blur, and outside click will not close this panel.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle details' });

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await userEvent.keyboard('{Escape}');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	},
};

export const HiddenUntilFound: Story = {
	render: () => html`
		<pari-disclosure hidden-until-found>
			<button data-trigger>Toggle details</button>
			<div data-content hidden="until-found">
				<div class="sb-panel">
					<p>This content is searchable via find-in-page even when collapsed.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvasElement }) => {
		const content = canvasElement.querySelector('[data-content]')!;

		await expect(content).toHaveAttribute('hidden', 'until-found');

		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		await userEvent.click(trigger);
		expect(content.hasAttribute('hidden')).toBe(false);

		await userEvent.click(trigger);
		await expect(content).toHaveAttribute('hidden', 'until-found');
	},
};

export const MediaQuery: Story = {
	render: () => html`
		<pari-disclosure media="(max-width: 740px)">
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>This disclosure only activates below 740px. Resize your browser to see it enable/disable.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
};

export const KeyboardNavigation: Story = {
	render: () => html`
		<pari-disclosure keyboard-navigation loop-navigation>
			<button data-trigger>Toggle menu</button>
			<div data-content hidden>
				<div class="sb-panel">
					<a href="#" data-item>Item one</a>
					<a href="#" data-item>Item two</a>
					<a href="#" data-item>Item three</a>
					<a href="#" data-item>Item four</a>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector('[data-trigger]') as HTMLElement;
		await userEvent.click(trigger);

		const items = canvasElement.querySelectorAll('[data-item]');

		(items[0] as HTMLElement).focus();
		await expect(items[0]).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		await expect(items[1]).toHaveFocus();

		await userEvent.keyboard('{ArrowUp}');
		await expect(items[0]).toHaveFocus();

		await userEvent.keyboard('{ArrowUp}');
		await expect(items[3]).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		await expect(items[0]).toHaveFocus();

		(items[2] as HTMLElement).focus();
		await userEvent.keyboard('{Home}');
		await expect(items[0]).toHaveFocus();

		await userEvent.keyboard('{End}');
		await expect(items[3]).toHaveFocus();
	},
};

export const Deeplink: Story = {
	render: () => html`
		<pari-disclosure deeplink>
			<button data-trigger>Toggle details</button>
			<div data-content id="deeplink-panel" hidden>
				<div class="sb-panel">
					<p>This disclosure syncs with the URL hash.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle details' });

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(window.location.hash).toBe('#deeplink-panel');

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(window.location.hash).toBe('');
	},
};

export const Closer: Story = {
	render: () => html`
		<pari-disclosure>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>Panel with an internal close button.</p>
					<button data-close>Close</button>
				</div>
			</div>
		</pari-disclosure>
	`,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle details' });

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		const closer = canvas.getByRole('button', { name: 'Close' });
		await userEvent.click(closer);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toHaveFocus();
	},
};
