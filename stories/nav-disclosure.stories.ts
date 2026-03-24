// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

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
};
