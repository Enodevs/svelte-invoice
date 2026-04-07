<script lang="ts">
	import type { PromoLink } from '$lib/ad-links';
	import AdLinkCard from './AdLinkCard.svelte';

	let { heading, links }: { heading: string; links: PromoLink[] } = $props();
</script>

<div class="space-y-4">
	<p class="px-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
		{heading}
	</p>
	<div class="flex flex-col gap-4">
		{#each links as link (link.href + link.title)}
			<AdLinkCard {link} />
		{/each}
	</div>
</div>
