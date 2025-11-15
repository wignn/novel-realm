import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Set cache headers untuk static assets
	if (event.url.pathname.startsWith('/static/')) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}
	
	// Set cache headers untuk pages (revalidate setelah 1 jam)
	if (!event.url.pathname.startsWith('/_app/')) {
		response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
	}
	
	return response;
};
