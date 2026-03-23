// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

import '../src/components/disclosure/disclosure';

const meta: Meta = {
	title: 'Disclosure',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => html`
		<ui-disclosure>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<p>Panel content with a <a href="#">link inside</a>.</p>
			</div>
		</ui-disclosure>
	`,
};

export const StartsOpen: Story = {
	render: () => html`
		<ui-disclosure open>
			<button data-trigger>Toggle details</button>
			<div data-content>
				<p>This panel starts open.</p>
			</div>
		</ui-disclosure>
	`,
};

export const Persistent: Story = {
	render: () => html`
		<ui-disclosure persistent>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<p>Escape, blur, and outside click will not close this panel.</p>
			</div>
		</ui-disclosure>
	`,
};

export const HiddenUntilFound: Story = {
	render: () => html`
		<ui-disclosure hidden-until-found>
			<button data-trigger>Toggle details</button>
			<div data-content hidden="until-found">
				<p>This content is searchable via find-in-page even when collapsed.</p>
			</div>
		</ui-disclosure>
	`,
};

export const MediaQuery: Story = {
	render: () => html`
		<ui-disclosure media="(min-width: 740px)">
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<p>This disclosure only activates above 740px.</p>
			</div>
		</ui-disclosure>
	`,
};

export const KeyboardNavigation: Story = {
	render: () => html`
		<ui-disclosure keyboard-navigation loop-navigation>
			<button data-trigger>Toggle menu</button>
			<div data-content hidden>
				<a href="#" data-item>Item one</a>
				<a href="#" data-item>Item two</a>
				<a href="#" data-item>Item three</a>
				<a href="#" data-item>Item four</a>
			</div>
		</ui-disclosure>
	`,
};

export const Closer: Story = {
	render: () => html`
		<ui-disclosure>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<p>Panel with an internal close button.</p>
				<button data-close>Close</button>
			</div>
		</ui-disclosure>
	`,
};
