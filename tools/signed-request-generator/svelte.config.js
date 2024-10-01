import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		{
			// Remove the announcer as for this app as there is no navigation
			name: 'strip-announcer',
			markup: ({ content: code }) => {
				code = code.replace(
					/<div id="svelte-announcer" [\s\S]*?<\/div>/,
					'<svelte:component this={null} />'
				);

				return { code };
			}
		}
	],

	kit: {
		// this is an adapter for  statically-rendered, single page application.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			precompress: false,
			strict: true
		}),
		files: {
			appTemplate: process.env.NODE_ENV === 'production' ? 'src/app.html' : 'src/app.dev.html'
		}
	}
};

export default config;
