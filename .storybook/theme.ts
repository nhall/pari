import { create } from 'storybook/theming';

/**
 * Storybook's internal styling (polished.js) cannot parse oklch.
 * Hex values are required here. oklch is used in preview.css where
 * the browser handles color parsing directly.
 */

export default create({
	base: 'light',

	// Brand
	brandTitle: 'Pari',
	brandUrl: '/',
	brandImage: 'pari-logo.svg',
	brandTarget: '_self',

	// Typography
	fontBase: '"Inter", system-ui, -apple-system, sans-serif',
	fontCode: '"JetBrains Mono", "Fira Code", monospace',

	// Colors — accessible variants for text/interactive use
	colorPrimary: '#C85200', // Accessible Orange
	colorSecondary: '#CC4559', // Accessible Coral (pink-warm)

	// UI
	appBg: '#FDF8F5', // Soft Cream
	appContentBg: '#FFFFFF',
	appPreviewBg: '#FFFFFF',
	appBorderColor: '#DAD8D6',
	appBorderRadius: 6,

	// Text
	textColor: '#1E293B', // Deep Indigo
	textInverseColor: '#FDF8F5', // Soft Cream
	textMutedColor: '#706E6C',

	// Toolbar
	barTextColor: '#706E6C',
	barSelectedColor: '#C85200', // Accessible Orange
	barHoverColor: '#1E293B', // Deep Indigo
	barBg: '#FDF8F5', // Soft Cream

	// Form
	inputBg: '#FFFFFF',
	inputBorder: '#DAD8D6',
	inputTextColor: '#1E293B',
	inputBorderRadius: 6,

	// Booleans
	booleanBg: '#DAD8D6',
	booleanSelectedBg: '#C85200'
});
