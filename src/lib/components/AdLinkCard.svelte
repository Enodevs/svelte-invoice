<script lang="ts">
	import type { PromoLink } from '$lib/ad-links';

	let { link }: { link: PromoLink } = $props();

	let cta = $derived(link.cta ?? 'Learn more →');
</script>

<a
	href={link.href}
	target="_blank"
	rel="noopener noreferrer sponsored"
	class="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm ring-1 ring-zinc-900/4 transition hover:border-zinc-300/90 hover:shadow-lg hover:ring-zinc-900/[0.06]"
>
	<div class="relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-100">
		<img
			src={link.imageUrl}
			alt={link.imageAlt}
			class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
			loading="lazy"
			decoding="async"
			fetchpriority="low"
		/>
		<div
			class="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-900/20 via-transparent to-transparent opacity-90"
			aria-hidden="true"
		></div>
	</div>

	<div class="flex flex-1 flex-col bg-linear-to-b from-zinc-50 to-zinc-50/90 px-4 pb-4 pt-3.5">
		<p
			class="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-violet-700"
		>
			{link.title}
		</p>
		{#if link.sponsorLine}
			<p class="mt-1 line-clamp-1 text-xs font-medium text-zinc-500">{link.sponsorLine}</p>
		{/if}

		<p class="mt-2.5 line-clamp-3 text-sm leading-relaxed text-zinc-600">
			{link.description}
		</p>

		<p class="mt-3 text-sm font-semibold text-zinc-500 transition group-hover:text-violet-600">
			{cta}
		</p>

		<p class="mt-3 text-right text-[10px] font-medium tracking-wide text-zinc-400">Sponsored</p>
	</div>
</a>
