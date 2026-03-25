import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect, userEvent } from 'storybook/test';

import '../src/components/tabs/tabs';

const meta: Meta = {
	title: 'Tabs',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-tabs>
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab one.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab two.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;
		const panels = canvasElement.querySelectorAll('[data-panel]') as NodeListOf<HTMLElement>;

		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
		await expect(panels[0]).not.toHaveAttribute('hidden');

		await userEvent.click(tabs[1]);
		await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
		await expect(panels[1]).not.toHaveAttribute('hidden');
		await expect(panels[0]).toHaveAttribute('hidden', '');

		await userEvent.click(tabs[0]);

		tabs[0].focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(tabs[1]).toHaveFocus();
		await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowLeft}');
		await expect(tabs[0]).toHaveFocus();
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

		await userEvent.click(tabs[2]);
		await userEvent.keyboard('{Home}');
		await expect(tabs[0]).toHaveFocus();
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{End}');
		await expect(tabs[2]).toHaveFocus();
		await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
	},
};

export const Manual: Story = {
	render: () => html`
		<pari-tabs manual>
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Arrow keys move focus only. Press Enter or Space to activate.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab two.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;

		tabs[0].focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(tabs[1]).toHaveFocus();
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
		await expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

		await userEvent.keyboard('{Enter}');
		await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

		tabs[0].focus();
		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard(' ');
		await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
	},
};

export const Vertical: Story = {
	render: () => html`
		<pari-tabs orientation="vertical">
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Use ArrowUp / ArrowDown to navigate between tabs.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab two.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;

		tabs[0].focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect(tabs[1]).toHaveFocus();
		await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowUp}');
		await expect(tabs[0]).toHaveFocus();
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowRight}');
		await expect(tabs[0]).toHaveFocus();
	},
};

export const LoopNavigation: Story = {
	render: () => html`
		<pari-tabs loop-navigation>
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Arrow keys wrap around from last to first and vice versa.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab two.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;

		await userEvent.click(tabs[2]);
		await userEvent.keyboard('{ArrowRight}');
		await expect(tabs[0]).toHaveFocus();
		await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowLeft}');
		await expect(tabs[2]).toHaveFocus();
		await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
	},
};

export const HiddenUntilFound: Story = {
	render: () => html`
		<pari-tabs hidden-until-found>
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Inactive panels use hidden="until-found" for find-in-page support.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Try using Ctrl+F to search for text in this hidden panel.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;
		const panels = canvasElement.querySelectorAll('[data-panel]') as NodeListOf<HTMLElement>;

		await expect(panels[1]).toHaveAttribute('hidden', 'until-found');
		await expect(panels[2]).toHaveAttribute('hidden', 'until-found');

		await userEvent.click(tabs[1]);
		await expect(panels[1]).not.toHaveAttribute('hidden');

		await expect(panels[0]).toHaveAttribute('hidden', 'until-found');
	},
};

export const Deeplink: Story = {
	render: () => html`
		<pari-tabs deeplink>
			<div data-tablist>
				<button data-tab aria-selected="true">Tab 1</button>
				<button data-tab>Tab 2</button>
				<button data-tab>Tab 3</button>
			</div>
			<div data-panel id="dl-tab-1">
				<div class="sb-panel">
					<p>Content for tab one.</p>
				</div>
			</div>
			<div data-panel id="dl-tab-2">
				<div class="sb-panel">
					<p>Content for tab two.</p>
				</div>
			</div>
			<div data-panel id="dl-tab-3">
				<div class="sb-panel">
					<p>Content for tab three.</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;

		await userEvent.click(tabs[1]);
		expect(window.location.hash).toBe('#dl-tab-2');

		await userEvent.click(tabs[2]);
		expect(window.location.hash).toBe('#dl-tab-3');
	},
};

export const PanelWithFocusableContent: Story = {
	render: () => html`
		<pari-tabs>
			<div data-tablist>
				<button data-tab aria-selected="true">With links</button>
				<button data-tab>No focusable content</button>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>This panel has a <a href="#">focusable link</a> so the panel itself is not in the tab order.</p>
				</div>
			</div>
			<div data-panel>
				<div class="sb-panel">
					<p>This panel has no focusable children, so the panel itself receives tabindex="0".</p>
				</div>
			</div>
		</pari-tabs>
	`,
	play: async ({ canvasElement }) => {
		const tabs = canvasElement.querySelectorAll('[data-tab]') as NodeListOf<HTMLElement>;
		const panels = canvasElement.querySelectorAll('[data-panel]') as NodeListOf<HTMLElement>;

		expect(panels[0].hasAttribute('tabindex')).toBe(false);

		await userEvent.click(tabs[1]);
		await expect(panels[1]).toHaveAttribute('tabindex', '0');
	},
};
