// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
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
				<p>Content for tab one.</p>
			</div>
			<div data-panel>
				<p>Content for tab two.</p>
			</div>
			<div data-panel>
				<p>Content for tab three.</p>
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
				<p>Arrow keys move focus only. Press Enter or Space to activate.</p>
			</div>
			<div data-panel>
				<p>Content for tab two.</p>
			</div>
			<div data-panel>
				<p>Content for tab three.</p>
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
				<p>Use ArrowUp / ArrowDown to navigate between tabs.</p>
			</div>
			<div data-panel>
				<p>Content for tab two.</p>
			</div>
			<div data-panel>
				<p>Content for tab three.</p>
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
				<p>Arrow keys wrap around from last to first and vice versa.</p>
			</div>
			<div data-panel>
				<p>Content for tab two.</p>
			</div>
			<div data-panel>
				<p>Content for tab three.</p>
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
				<p>Inactive panels use hidden="until-found" for find-in-page support.</p>
			</div>
			<div data-panel>
				<p>Try using Ctrl+F to search for text in this hidden panel.</p>
			</div>
			<div data-panel>
				<p>Content for tab three.</p>
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
				<p>This panel has a <a href="#">focusable link</a> so the panel itself is not in the tab order.</p>
			</div>
			<div data-panel>
				<p>This panel has no focusable children, so the panel itself receives tabindex="0".</p>
			</div>
		</pari-tabs>
	`,
};
