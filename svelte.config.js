import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build', // Output directory for static files
      assets: 'build',
      fallback: 'index.html', // Fallback for SPA routing
    }),
    paths: {
      base: '/simple-current-app',
    },
  },
};

export default config;
