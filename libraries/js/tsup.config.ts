import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: 'cjs',
  platform: 'node',
  outDir: 'dist/cjs',
  noExternal: [/digitalbazaar/],
  outExtension() {
    return {
      js: `.js`,
    };
  },
});
