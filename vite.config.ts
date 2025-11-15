import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		// Disable source maps in production untuk menyembunyikan source code
		sourcemap: false,
		// Minify code untuk membuat lebih sulit dibaca
		minify: 'terser'
	}
});
