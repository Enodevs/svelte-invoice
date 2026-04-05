<script lang="ts">
	import { titleWithSite } from '$lib/site-meta';

	let { status } = $props();
</script>

<svelte:head>
	<title
		>{status === 404
			? titleWithSite('Page not found')
			: titleWithSite('Something went wrong')}</title
	>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 text-center">
	<p class="text-sm font-medium text-zinc-500">{status}</p>
	<h1 class="mt-2 text-2xl font-semibold text-zinc-900">
		{status === 404 ? 'Page not found' : 'Something went wrong'}
	</h1>
	<p class="mt-3 text-sm text-zinc-600">
		{status === 404
			? 'That URL does not exist. Head back to the invoice editor.'
			: 'Please try again or return to the home page.'}
	</p>
	<a
		href="/"
		class="mt-8 inline-flex justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
	>
		Go home
	</a>
</div>
