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
		<pari-disclosure>
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>Panel content with a <a href="#">link inside</a>.</p>
				</div>
			</div>
		</pari-disclosure>
	`,
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
};

export const MediaQuery: Story = {
	render: () => html`
		<pari-disclosure media="(min-width: 740px)">
			<button data-trigger>Toggle details</button>
			<div data-content hidden>
				<div class="sb-panel">
					<p>This disclosure only activates above 740px.</p>
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
};
