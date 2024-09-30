import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      exclude: ['src/**/types.ts', 'src/index.ts', 'src/types/index.ts', 'src/mocks', './*.*s', 'scripts'],
    },
    mockReset: true,
  },
});
