import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib'),
			$components: resolve(__dirname, 'src/components'),
			$routes: resolve(__dirname, 'src/routes')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
