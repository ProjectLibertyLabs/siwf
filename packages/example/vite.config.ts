import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [sveltekit(), tsconfigPaths()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    mockReset: true,
  },
  define: {
    'process.env.BASE_PATH_EXAMPLE': JSON.stringify(process.env.BASE_PATH_EXAMPLE),
    'process.env.BASE_PATH_UI': JSON.stringify(process.env.BASE_PATH_UI),
  },
  resolve: {
    alias: {
      '@dsnp/parquetjs': '../../node_modules/@dsnp/parquetjs/dist/browser/parquet.js',
    },
  },
});
