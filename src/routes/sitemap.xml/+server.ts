import type { RequestHandler } from '@sveltejs/kit';

/** Sitemap URLs; `url.origin` reflects the deployed host when live. */
export const GET: RequestHandler = ({ url }) => {
	const base = url.origin;
	const urls = ['/', '/preview'];

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
		urls
			.map(
				(path) =>
					`<url><loc>${escapeXml(base + path)}</loc>` +
					`<changefreq>monthly</changefreq>` +
					`<priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`
			)
			.join('') +
		`</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
