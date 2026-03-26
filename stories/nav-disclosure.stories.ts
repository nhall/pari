import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'storybook/test';

import '../src/components/nav-disclosure/nav-disclosure';
import '../src/components/disclosure/disclosure';

const meta: Meta = {
	title: 'Nav Disclosure',
	decorators: [
		(story) => html`<div style="min-block-size: 16rem;">${story()}</div>`,
	],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-nav-disclosure>
			<pari-disclosure persistent>
				<div class="sb-nav-item">
					<a href="#" class="sb-nav-link">Products</a>
					<button data-trigger aria-label="Products submenu">
						<span class="sb-nav-chevron"></span>
					</button>
				</div>
				<div data-content hidden>
					<div class="sb-panel">
						<a href="#" data-item>Software</a>
						<a href="#" data-item>Hardware</a>
						<a href="#" data-item>Services</a>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<div class="sb-nav-item">
					<a href="#" class="sb-nav-link">Company</a>
					<button data-trigger aria-label="Company submenu">
						<span class="sb-nav-chevron"></span>
					</button>
				</div>
				<div data-content hidden>
					<div class="sb-panel">
						<a href="#" data-item>About</a>
						<a href="#" data-item>Careers</a>
						<a href="#" data-item>Contact</a>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<div class="sb-nav-item">
					<a href="#" class="sb-nav-link">Resources</a>
					<button data-trigger aria-label="Resources submenu">
						<span class="sb-nav-chevron"></span>
					</button>
				</div>
				<div data-content hidden>
					<div class="sb-panel">
						<a href="#" data-item>Documentation</a>
						<a href="#" data-item>Blog</a>
					</div>
				</div>
			</pari-disclosure>
		</pari-nav-disclosure>
	`,
	play: async ({ canvasElement }) => {
		const triggers = Array.from(canvasElement.querySelectorAll('[data-trigger]')) as HTMLElement[];
		const disclosures = Array.from(canvasElement.querySelectorAll('pari-disclosure')) as HTMLElement[];
		const navEl = canvasElement.querySelector('pari-nav-disclosure') as HTMLElement;
		const items = canvasElement.querySelectorAll('pari-disclosure:first-child [data-item]') as NodeListOf<HTMLElement>;

		for (const trigger of triggers) {
			await expect(trigger).toHaveAttribute('aria-haspopup', 'true');
			await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		}

		triggers[0].click();
		await expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');

		triggers[1].click();
		await expect(disclosures[1]).toHaveAttribute('open');
		await expect(disclosures[0]).not.toHaveAttribute('open');

		triggers[1].click();
		await expect(disclosures[1]).not.toHaveAttribute('open');

		// ArrowDown opens and focuses first child, ArrowUp focuses last
		triggers[0].focus();
		triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		await expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
		await expect(items[0]).toHaveFocus();

		items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		await expect(items[1]).toHaveFocus();

		items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
		await expect(items[0]).toHaveFocus();

		items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
		await expect(items[2]).toHaveFocus();

		items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		await expect(items[0]).toHaveFocus();

		// No wrap at boundary
		items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
		await expect(items[0]).toHaveFocus();

		navEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await new Promise((r) => setTimeout(r, 50));
		await expect(disclosures[0]).not.toHaveAttribute('open');
		await expect(triggers[0]).toHaveFocus();

		triggers[0].focus();
		triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
		await expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
		await expect(items[2]).toHaveFocus();

		// Hover open/close with debounce
		disclosures[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await expect(disclosures[1]).toHaveAttribute('open');
		await expect(disclosures[0]).not.toHaveAttribute('open');

		disclosures[1].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
		await expect(disclosures[1]).not.toHaveAttribute('open');

		// Re-entering before debounce fires cancels the close
		disclosures[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await expect(disclosures[2]).toHaveAttribute('open');
		disclosures[2].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		disclosures[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
		await expect(disclosures[2]).toHaveAttribute('open');

		disclosures[2].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 200));
	},
};
