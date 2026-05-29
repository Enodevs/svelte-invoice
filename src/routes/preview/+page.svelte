<script lang="ts">
	import { browser } from "$app/environment";
	import {
		invoiceStore,
		invoiceTotal,
		lineTotal,
		formatMoney,
		formatDueDate,
		currencySymbol,
	} from "$lib/invoiceStore";
	import { metaDescription, titleWithSite } from "$lib/site-meta";

	function printInvoice() {
		if (browser) window.print();
	}

	let data = $derived($invoiceStore);
	let total = $derived(invoiceTotal(data));
	let dueLabel = $derived(formatDueDate(data.dueDate));
	let showPayLink = $derived(/^https?:\/\//i.test(data.payOnlineUrl.trim()));

	function brandInitial(name: string): string {
		const t = name.trim();
		if (!t) return "B";
		return t[0]!.toUpperCase();
	}
</script>

<svelte:head>
	<title>{titleWithSite("Invoice preview")}</title>
	<meta name="description" content={metaDescription.preview} />
	<meta property="og:title" content={titleWithSite("Invoice preview")} />
	<meta property="og:description" content={metaDescription.preview} />
	<meta name="twitter:title" content={titleWithSite("Invoice preview")} />
	<meta name="twitter:description" content={metaDescription.preview} />
</svelte:head>

<div class="px-4 py-10 print:px-0 print:py-0">
	<div class="no-print mx-auto mb-6 flex max-w-160 flex-wrap gap-3">
		<a
			href="/"
			class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
		>
			← Edit invoice
		</a>
		<button
			type="button"
			class="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
			onclick={printInvoice}
		>
			Download / Print
		</button>
	</div>

	<article
		class="invoice-sheet mx-auto max-w-160 rounded-2xl border border-zinc-200/80 bg-white p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] print:max-w-none print:rounded-none print:border-0 print:p-12 print:shadow-none"
	>
		<!-- Header: title + logo -->
		<header class="flex items-start justify-between gap-6">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-zinc-900">
					Invoice
				</h1>
				<div class="mt-5 space-y-1.5 text-sm text-zinc-700">
					<p>
						<span class="font-semibold text-zinc-900"
							>Invoice number</span
						>
						<span class="ml-2">{data.invoiceNumber || "—"}</span>
					</p>
					<p>
						<span class="font-semibold text-zinc-900">Date due</span
						>
						<span class="ml-2">{dueLabel}</span>
					</p>
				</div>
			</div>
			<div class="shrink-0">
				{#if data.logoDataUrl}
					<img
						src={data.logoDataUrl}
						alt=""
						class="h-14 w-14 rounded-full object-cover ring-1 ring-zinc-200/80"
					/>
				{:else}
					<div
						class="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-lg font-semibold text-white shadow-sm ring-1 ring-violet-700/20"
						aria-hidden="true"
					>
						{brandInitial(data.businessName)}
					</div>
				{/if}
			</div>
		</header>

		<!-- From / Bill to -->
		<div class="mt-12 grid gap-10 sm:grid-cols-2">
			<div class="text-sm leading-relaxed text-zinc-700">
				{#if data.businessName}
					<p class="text-base font-semibold text-zinc-900">
						{data.businessName}
					</p>
				{:else}
					<p class="text-base font-semibold text-zinc-400">
						Your business
					</p>
				{/if}
				{#if data.phoneEmail}
					<p class="mt-1">{data.phoneEmail}</p>
				{/if}
				{#if data.address}
					<p class="mt-2 whitespace-pre-line">{data.address}</p>
				{/if}
			</div>
			<div class="text-sm sm:text-right">
				<p class="font-semibold text-zinc-900">Bill to</p>
				{#if data.customerName}
					<p class="mt-2 text-base font-medium text-zinc-900">
						{data.customerName}
					</p>
				{:else}
					<p class="mt-2 text-base font-medium text-zinc-400">
						Customer name
					</p>
				{/if}
				{#if data.customerEmail}
					<p class="mt-1 text-zinc-600">{data.customerEmail}</p>
				{/if}
				{#if data.description.trim()}
					<p
						class="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600"
					>
						{data.description}
					</p>
				{/if}
			</div>
		</div>

		<!-- Amount due + thanks -->
		<div class="mt-12 border-y border-zinc-200 py-8">
			<p class="text-2xl font-semibold tracking-tight text-zinc-900">
				{formatMoney(total, data.currency)}
			</p>
			{#if showPayLink}
				<p class="mt-2">
					<a
						href={data.payOnlineUrl.trim()}
						class="text-sm font-medium text-violet-600 underline decoration-violet-600/40 underline-offset-2 hover:text-violet-700"
						target="_blank"
						rel="noopener noreferrer"
					>
						Pay online
					</a>
				</p>
			{/if}
			<p class="mt-6 text-sm text-zinc-600">Thanks for your business!</p>
		</div>

		<!-- {#if data.description.trim()}
			<p class="mt-8 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
				{data.description}
			</p>
		{/if} -->

		<!-- Line items -->
		<div class="mt-10">
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-y border-zinc-900/10">
						<th
							class="py-3 pr-4 text-left font-semibold text-zinc-900"
							>Description</th
						>
						<th
							class="w-14 py-3 pr-4 text-right font-semibold text-zinc-900"
							>Qty</th
						>
						<th
							class="w-28 py-3 pr-4 text-right font-semibold text-zinc-900"
							>Unit price</th
						>
						<th
							class="w-28 py-3 text-right font-semibold text-zinc-900"
							>Amount</th
						>
					</tr>
				</thead>
				<tbody>
					{#each data.items as item (item.id)}
						<tr class="border-b border-zinc-100">
							<td class="py-4 pr-4 font-semibold text-zinc-900"
								>{item.name || "—"}</td
							>
							<td
								class="py-4 pr-4 text-right tabular-nums text-zinc-700"
								>{item.quantity}</td
							>
							<td
								class="py-4 pr-4 text-right tabular-nums text-zinc-700"
							>
								{formatMoney(item.price, data.currency)}
							</td>
							<td
								class="py-4 text-right tabular-nums font-medium text-zinc-900"
							>
								{formatMoney(lineTotal(item), data.currency)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Totals (right) -->
		<div class="mt-8 flex justify-end">
			<table class="w-full max-w-56 border-collapse text-sm">
				<tbody>
					<tr>
						<td class="py-1.5 pr-6 text-right text-zinc-600"
							>Subtotal</td
						>
						<td
							class="py-1.5 text-right tabular-nums font-medium text-zinc-900"
						>
							{formatMoney(total, data.currency)}
						</td>
					</tr>
					<tr>
						<td class="py-1.5 pr-6 text-right text-zinc-600"
							>Total</td
						>
						<td
							class="py-1.5 text-right tabular-nums font-medium text-zinc-900"
						>
							{formatMoney(total, data.currency)}
						</td>
					</tr>
					<tr class="border-t border-zinc-200">
						<td
							class="py-3 pr-6 text-right font-semibold text-zinc-900"
							>Amount due</td
						>
						<td
							class="py-3 text-right text-base font-semibold tabular-nums text-zinc-900"
						>
							{formatMoney(total, data.currency)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Payment instructions placeholder
		<div class="mt-14 text-sm leading-relaxed text-zinc-700">
			<p class="font-semibold text-zinc-900">Pay with ACH or wire transfer</p>
			<p class="mt-2 text-zinc-600">
				Use the reference below so we can match your payment. Contact your bank if you need help
				with transfers.
			</p>
			<dl class="mt-6 space-y-2">
				<div class="flex flex-wrap gap-x-2">
					<dt class="font-medium text-zinc-900">Bank name</dt>
					<dd class="text-zinc-500">—</dd>
				</div>
				<div class="flex flex-wrap gap-x-2">
					<dt class="font-medium text-zinc-900">Routing number</dt>
					<dd class="text-zinc-500">—</dd>
				</div>
				<div class="flex flex-wrap gap-x-2">
					<dt class="font-medium text-zinc-900">Account number</dt>
					<dd class="text-zinc-500">—</dd>
				</div>
				<div class="flex flex-wrap gap-x-2">
					<dt class="font-medium text-zinc-900">SWIFT code</dt>
					<dd class="text-zinc-500">—</dd>
				</div>
			</dl>
		</div> -->

		<p class="mt-12 text-center text-xs text-zinc-400">
			{data.invoiceNumber || "Invoice"}
			<span class="mx-1.5">•</span>
			{formatMoney(total, data.currency)} due{data.dueDate.trim() ? ` ${dueLabel}` : ""}
		</p>
	</article>
</div>

<style>
	@media print {
		:global(html) {
			background: white !important;
		}
		:global(body) {
			background: white !important;
		}
		.no-print {
			display: none !important;
		}
	}
</style>
