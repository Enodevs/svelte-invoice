/** Public site name (browser tab / sharing). */
export const siteName = 'Invoice Generator';

/** Short positioning line used in titles and OG tags. */
export const siteTagline = 'Create printable invoices in your browser';

/** Default description when a page does not override. */
export const defaultDescription =
	'Build a professional invoice with your business details, line items, and logo. Preview, print, or save as PDF—no account or database.';

/** Reference for marketing copy; not emitted as `<meta name="keywords">` (major crawlers ignore it). */
export const keywords =
	'invoice generator, printable invoice, PDF invoice, small business invoice, invoice template, free invoice maker';

/** Route-specific meta descriptions for `<meta name="description">` and social cards. */
export const metaDescription = {
	home: `${siteTagline}. Add your business details, logo, line items, and totals—then print or save as PDF.`,
	preview:
		'Print-ready invoice preview: review your business header, customer, line items, and amount due before printing or exporting to PDF.'
} as const;

export const locale = 'en';

/** Page title with brand suffix for consistency in search results. */
export function titleWithSite(pageTitle: string): string {
	return `${pageTitle} | ${siteName}`;
}

/** Safe JSON-LD string for embedding in a script tag (escapes `<` for HTML parsers). */
export function serializeJsonLd(data: Record<string, unknown>): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function webApplicationSchema(origin: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: siteName,
		description: defaultDescription,
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Any',
		url: origin + '/',
		browserRequirements: 'Requires JavaScript'
	};
}
