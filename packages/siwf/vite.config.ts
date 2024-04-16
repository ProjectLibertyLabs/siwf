import { defineConfig } from 'vite';
import { resolve } from 'pathe';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'siwf',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      exclude: ['src/**/*.types.ts'],
    },
    globals: true,
    environment: 'jsdom',
    mockReset: true,
  },
});
