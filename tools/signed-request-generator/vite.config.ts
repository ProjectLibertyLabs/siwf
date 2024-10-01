import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'esnext', // Ensure modern output
		minify: true, // Minify the JS and CSS
		assetsInlineLimit: 100000000, // Large limit to inline all assets
		chunkSizeWarningLimit: 100000000
	},
	resolve: {
		alias: {
			// https://github.com/digitalcredentials/open-badges-context/issues/10
			'@digitalcredentials/open-badges-context': path.resolve(
				__dirname,
				'node_modules/@digitalcredentials/open-badges-context/dist/context.js'
			)
		}
	}
});
