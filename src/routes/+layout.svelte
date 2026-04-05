<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import {
		serializeJsonLd,
		siteName,
		webApplicationSchema,
		locale
	} from '$lib/site-meta';

	let { children } = $props();

	let canonical = $derived(`${page.url.origin}${page.url.pathname}`);
	let jsonLdRaw = $derived(serializeJsonLd(webApplicationSchema(page.url.origin)));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#18181b" />
	<link rel="canonical" href={canonical} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={locale} />
	<meta property="og:url" content={canonical} />

	<meta name="twitter:card" content="summary" />

	{@html `<script type="application/ld+json">${jsonLdRaw}</script>`}
</svelte:head>

<div class="min-h-dvh font-sans text-zinc-900 antialiased">
	{@render children()}
</div>
