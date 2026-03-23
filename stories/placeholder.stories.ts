// NOTE: `lit` is used in story files ONLY for Storybook's html template tag.
// It is a devDependency and must never be imported in component source (src/).
// Component source is vanilla TypeScript with zero runtime dependencies.
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Placeholder',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<p>Component library scaffolded. Add components in src/.</p>`,
};
