import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

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
};
