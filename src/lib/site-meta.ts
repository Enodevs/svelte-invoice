/** Public site name (browser tab / sharing). */
export const siteName = "Zap";

/** Short positioning line used in titles and OG tags. */
export const siteTagline =
  "Blazing fast invoice generator — create, preview & print PDF invoices";

/** Default description when a page does not override. */
export const defaultDescription =
  "Zap lets you create professional invoices instantly. Add your business details, logo, line items, and totals. Preview, print, or save as PDF, no sign-up required, no data is stored.";

/** Reference for marketing copy; not emitted as `<meta name="keywords">` (major crawlers ignore it). */
export const keywords =
  "invoice generator, free invoice maker, PDF invoice, printable invoice template, small business invoice, invoice creator, zap invoice, invoice builder, create invoice online, billing generator";

/** Route-specific meta descriptions for `<meta name="description">` and social cards. */
export const metaDescription = {
  home: `Create a professional invoice in seconds with Zap. Add your business info, logo, line items, and totals — then print or save as PDF. Free, no account needed.`,
  preview:
    "Preview your invoice before printing. Review business details, line items, and amount due, then print or export to PDF with one click.",
} as const;

export const locale = "en";

/** Page title with brand suffix for consistency in search results. */
export function titleWithSite(pageTitle: string): string {
  return `${pageTitle} | ${siteName}`;
}

/** Safe JSON-LD string for embedding in a script tag (escapes `<` for HTML parsers). */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function webApplicationSchema(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    description: defaultDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: origin + "/",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: siteName,
    },
  };
}
