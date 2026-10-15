import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const components = [
	'disclosure',
	'accordion',
	'tabs',
	'dialog',
	'popover',
	'nav-disclosure',
	'notification',
	'tooltip',
];

const componentEntries = Object.fromEntries(
	components.map((name) => [
		`components/${name}`,
		resolve(__dirname, `src/components/${name}/${name}.ts`),
	])
);

export default defineConfig({
	plugins: [
		dts({ insertTypesEntry: true }),
	],
	build: {
		// Ship readable ESM: consumers' bundlers minify, and class names survive for devtools and stack traces.
		minify: false,
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'src/index.ts'),
				...componentEntries,
			},
			output: {
				format: 'es',
				dir: 'dist',
				entryFileNames: '[name].js',
				chunkFileNames: 'shared/[name].js',
			},
		},
	},
});
