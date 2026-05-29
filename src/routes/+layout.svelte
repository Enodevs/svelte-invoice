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
	import { sponsoredHeading, sponsoredLinks } from '$lib/ad-links';
	import AdColumn from '$lib/components/AdColumn.svelte';
	import AdLinkCard from '$lib/components/AdLinkCard.svelte';

	let { children } = $props();

	let canonical = $derived(`${page.url.origin}${page.url.pathname}`);
	let jsonLdRaw = $derived(serializeJsonLd(webApplicationSchema(page.url.origin)));

	/**
	 * Layout is **main + right rail** only. For two rails later:
	 * - Split `sponsoredLinks` in ad-links.ts into e.g. `sponsoredLinksLeft` / `sponsoredLinksRight`
	 * - Use `xl:grid-cols-[minmax(0,1fr)_18rem_minmax(0,1fr)]` or `[18rem_1fr_18rem]` with main in the center.
	 */
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#18181b" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonical} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={locale} />
	<meta property="og:url" content={canonical} />

	<meta name="twitter:card" content="summary" />

	{@html `<script type="application/ld+json">${jsonLdRaw}</script>`}
</svelte:head>

<div class="min-h-dvh bg-zinc-100 font-sans text-zinc-900 antialiased print:bg-white">
	<div
		class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:py-8 xl:max-w-[88rem] xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:items-start xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_19rem]"
	>
		<div class="min-w-0 w-full">
			{@render children()}
		</div>

		<aside class="no-print hidden xl:block xl:sticky xl:top-6 xl:self-start">
			<AdColumn heading={sponsoredHeading} links={sponsoredLinks} />
		</aside>
	</div>

	<section
		class="no-print border-t border-zinc-200/80 bg-linear-to-b from-zinc-100 via-zinc-50/90 to-zinc-100 py-8 xl:hidden"
		aria-label="Sponsored links"
	>
		<div class="mx-auto max-w-lg px-4 sm:max-w-2xl">
			<p
				class="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
			>
				{sponsoredHeading}
			</p>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{#each sponsoredLinks as link (link.href + link.title)}
					<AdLinkCard {link} />
				{/each}
			</div>
		</div>
	</section>
</div>
