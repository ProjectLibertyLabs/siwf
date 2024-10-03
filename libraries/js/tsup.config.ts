import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: 'cjs',
  platform: 'node',
  outDir: 'dist/cjs',
  noExternal: [/digitalbazaar/, /base64url/, /base58/, /base-x/, 'bs58'],
  outExtension() {
    return {
      js: `.js`,
    };
  },
});
