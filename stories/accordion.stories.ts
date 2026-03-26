import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { expect, userEvent } from 'storybook/test';

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
	play: async ({ canvasElement }) => {
		const triggers = canvasElement.querySelectorAll('[data-trigger]') as NodeListOf<HTMLElement>;
		const disclosures = canvasElement.querySelectorAll('pari-disclosure');

		await userEvent.click(triggers[0]);
		await userEvent.click(triggers[1]);
		await expect(disclosures[0]).toHaveAttribute('open');
		await expect(disclosures[1]).toHaveAttribute('open');

		triggers[0].focus();
		await expect(triggers[0]).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect(triggers[1]).toHaveFocus();

		await userEvent.keyboard('{ArrowUp}');
		await expect(triggers[0]).toHaveFocus();

		triggers[2].focus();
		await userEvent.keyboard('{Home}');
		await expect(triggers[0]).toHaveFocus();

		await userEvent.keyboard('{End}');
		await expect(triggers[2]).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		await expect(triggers[2]).toHaveFocus();

		triggers[0].focus();
		await userEvent.keyboard('{ArrowUp}');
		await expect(triggers[0]).toHaveFocus();
	},
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
	play: async ({ canvasElement }) => {
		const triggers = canvasElement.querySelectorAll('[data-trigger]') as NodeListOf<HTMLElement>;
		const disclosures = canvasElement.querySelectorAll('pari-disclosure');

		await expect(disclosures[0]).toHaveAttribute('open');

		await userEvent.click(triggers[1]);
		await expect(disclosures[1]).toHaveAttribute('open');
		await expect(disclosures[0]).not.toHaveAttribute('open');

		await userEvent.click(triggers[2]);
		await expect(disclosures[2]).toHaveAttribute('open');
		await expect(disclosures[1]).not.toHaveAttribute('open');
		await expect(disclosures[0]).not.toHaveAttribute('open');
	},
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
	play: async ({ canvasElement }) => {
		const triggers = canvasElement.querySelectorAll('[data-trigger]') as NodeListOf<HTMLElement>;
		const disclosures = canvasElement.querySelectorAll('pari-disclosure');

		await expect(disclosures[0]).toHaveAttribute('open');

		await userEvent.click(triggers[0]);
		await expect(disclosures[0]).toHaveAttribute('open');

		await userEvent.click(triggers[1]);
		await expect(disclosures[1]).toHaveAttribute('open');
		await expect(disclosures[0]).not.toHaveAttribute('open');

		await userEvent.click(triggers[1]);
		await expect(disclosures[1]).toHaveAttribute('open');
	},
};

export const AlwaysOpenNoDefault: Story = {
	render: () => html`
		<pari-accordion always-open>
			<pari-disclosure persistent>
				<button data-trigger>Section 1</button>
				<div data-content hidden>
					<div class="sb-panel">
						<p>No section starts open, so the first one opens automatically.</p>
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
	play: async ({ canvasElement }) => {
		const disclosures = canvasElement.querySelectorAll('pari-disclosure');

		await new Promise((r) => setTimeout(r, 50));
		await expect(disclosures[0]).toHaveAttribute('open');
	},
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
	play: async ({ canvasElement }) => {
		const triggers = canvasElement.querySelectorAll('[data-trigger]') as NodeListOf<HTMLElement>;

		triggers[0].focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(triggers[1]).toHaveFocus();

		await userEvent.keyboard('{ArrowLeft}');
		await expect(triggers[0]).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		await expect(triggers[0]).toHaveFocus();
	},
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
	play: async ({ canvasElement }) => {
		const triggers = canvasElement.querySelectorAll('[data-trigger]') as NodeListOf<HTMLElement>;

		triggers[2].focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect(triggers[0]).toHaveFocus();

		await userEvent.keyboard('{ArrowUp}');
		await expect(triggers[2]).toHaveFocus();
	},
};
