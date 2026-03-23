// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

import '../src/components/accordion/accordion';
import '../src/components/disclosure/disclosure';

const meta: Meta = {
	title: 'Accordion',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<pari-accordion>
			<pari-disclosure persistent>
				<button data-trigger>Section 1</button>
				<div data-content hidden>
					<p>Content for section one.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<p>Content for section two.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<p>Content for section three.</p>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};

export const Grouped: Story = {
	render: () => html`
		<pari-accordion grouped>
			<pari-disclosure persistent open>
				<button data-trigger>Section 1</button>
				<div data-content>
					<p>Content for section one. Opening another section closes this one.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<p>Content for section two.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<p>Content for section three.</p>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};

export const AlwaysOpen: Story = {
	render: () => html`
		<pari-accordion always-open>
			<pari-disclosure persistent open>
				<button data-trigger>Section 1</button>
				<div data-content>
					<p>One section must always remain open. Try closing this one.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<p>Content for section two.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<p>Content for section three.</p>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};

export const Horizontal: Story = {
	render: () => html`
		<pari-accordion orientation="horizontal" grouped>
			<pari-disclosure persistent open>
				<button data-trigger>Tab 1</button>
				<div data-content>
					<p>Use ArrowLeft / ArrowRight to navigate between triggers.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Tab 2</button>
				<div data-content hidden>
					<p>Content for tab two.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Tab 3</button>
				<div data-content hidden>
					<p>Content for tab three.</p>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};

export const LoopNavigation: Story = {
	render: () => html`
		<pari-accordion grouped loop-navigation>
			<pari-disclosure persistent open>
				<button data-trigger>Section 1</button>
				<div data-content>
					<p>Arrow keys wrap around from last to first and vice versa.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<p>Content for section two.</p>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<p>Content for section three.</p>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};
