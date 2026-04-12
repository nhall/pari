import type { Preview } from '@storybook/web-components';
import './preview.css';

const preview: Preview = {
	tags: ['autodocs'],
	parameters: {
		options: {
			storySort: {
				order: [
					'Introduction',
					'Disclosure',
					'Accordion',
					'Tabs',
					'Dialog',
					'Popover',
					'Nav Disclosure',
				],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'error',
			config: {
				rules: [
					{ id: 'landmark-one-main', enabled: false },
					{ id: 'page-has-heading-one', enabled: false },
					{ id: 'region', enabled: false },
				],
			},
		},
	},
};

export default preview;
