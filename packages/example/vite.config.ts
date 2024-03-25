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
  define: { 'process.env.BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET) },
});
