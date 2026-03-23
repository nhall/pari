import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Pari',
      formats: ['es', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'components.js';
        return 'components.iife.js';
      },
    },
  },
});
