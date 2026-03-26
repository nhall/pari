import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'Pari',
			formats: ['iife'],
			fileName: () => 'components.iife.js',
		},
		outDir: 'dist',
		emptyOutDir: false,
	},
});
