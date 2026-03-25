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
					<div class="sb-panel">
						<p>Content for section one.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section two.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section three.</p>
					</div>
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
					<div class="sb-panel">
						<p>Content for section one. Opening another section closes this one.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section two.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section three.</p>
					</div>
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
					<div class="sb-panel">
						<p>One section must always remain open. Try closing this one.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section two.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section three.</p>
					</div>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};

export const Horizontal: Story = {
	render: () => html`
		<pari-accordion orientation="horizontal" always-open>
			<pari-disclosure persistent open>
				<button data-trigger>Section 1</button>
				<div data-content>
					<div class="sb-panel">
						<p>Use ArrowLeft / ArrowRight to navigate between triggers.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section two.</p>
					</div>
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
					<div class="sb-panel">
						<p>Arrow keys wrap around from last to first and vice versa.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 2</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section two.</p>
					</div>
				</div>
			</pari-disclosure>
			<pari-disclosure persistent>
				<button data-trigger>Section 3</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>Content for section three.</p>
					</div>
				</div>
			</pari-disclosure>
		</pari-accordion>
	`,
};
