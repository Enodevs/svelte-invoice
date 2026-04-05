<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		invoiceStore,
		invoiceTotal,
		lineTotal,
		formatMoney,
		type InvoiceData,
		type LineItem
	} from '$lib/invoiceStore';
	import { metaDescription, titleWithSite } from '$lib/site-meta';

	const MAX_LOGO_BYTES = 2 * 1024 * 1024;

	let logoHint = $state('');
	let logoInput = $state<HTMLInputElement | null>(null);

	function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
		invoiceStore.update((d) => ({ ...d, [key]: value }));
	}

	function updateItem(index: number, patch: Partial<LineItem>) {
		invoiceStore.update((d) => {
			const items = d.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
			return { ...d, items };
		});
	}

	function addItem() {
		invoiceStore.update((d) => ({
			...d,
			items: [
				...d.items,
				{ id: crypto.randomUUID(), name: '', quantity: 1, price: 0 }
			]
		}));
	}

	function removeItem(index: number) {
		invoiceStore.update((d) => {
			if (d.items.length <= 1) return d;
			return { ...d, items: d.items.filter((_, i) => i !== index) };
		});
	}

	function onLogoSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		logoHint = '';
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			logoHint = 'Please choose an image file.';
			input.value = '';
			return;
		}
		if (file.size > MAX_LOGO_BYTES) {
			logoHint = 'Image must be 2MB or smaller.';
			input.value = '';
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result === 'string') update('logoDataUrl', result);
		};
		reader.readAsDataURL(file);
	}

	function clearLogo() {
		update('logoDataUrl', null);
		logoHint = '';
		if (logoInput) logoInput.value = '';
	}

	function goPreview() {
		goto('/preview');
	}
</script>

<svelte:head>
	<title>{titleWithSite('Create invoices')}</title>
	<meta name="description" content={metaDescription.home} />
	<meta property="og:title" content={titleWithSite('Create invoices')} />
	<meta property="og:description" content={metaDescription.home} />
	<meta name="twitter:title" content={titleWithSite('Create invoices')} />
	<meta name="twitter:description" content={metaDescription.home} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<header class="mb-8">
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-900">Invoice</h1>
		<p class="mt-1 text-sm text-zinc-500">
			Fill in the details, then open the preview to print or save as PDF.
		</p>
	</header>

	<section class="mb-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
		<h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Business</h2>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-start">
			<div class="flex items-center gap-4">
				{#if $invoiceStore.logoDataUrl}
					<img
						src={$invoiceStore.logoDataUrl}
						alt="Business logo preview"
						class="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-zinc-100"
					/>
				{:else}
					<div
						class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-400 ring-2 ring-zinc-100"
					>
						Logo
					</div>
				{/if}
				<div class="flex flex-col gap-2">
					<label
						class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
					>
						<span>Upload logo</span>
						<input
							type="file"
							accept="image/*"
							class="sr-only"
							onchange={onLogoSelected}
							bind:this={logoInput}
						/>
					</label>
					{#if $invoiceStore.logoDataUrl}
						<button
							type="button"
							class="text-left text-sm text-red-600 hover:underline"
							onclick={clearLogo}
						>
							Remove logo
						</button>
					{/if}
				</div>
			</div>
			{#if logoHint}
				<p class="text-sm text-amber-700 sm:ml-auto">{logoHint}</p>
			{/if}
		</div>

		<div class="grid gap-3 sm:grid-cols-2">
			<label class="block sm:col-span-2">
				<span class="mb-1 block text-sm text-zinc-600">Business name</span>
				<input
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
					value={$invoiceStore.businessName}
					oninput={(e) => update('businessName', e.currentTarget.value)}
				/>
			</label>
			<label class="block sm:col-span-2">
				<span class="mb-1 block text-sm text-zinc-600">Phone / email</span>
				<input
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
					value={$invoiceStore.phoneEmail}
					oninput={(e) => update('phoneEmail', e.currentTarget.value)}
				/>
			</label>
			<label class="block sm:col-span-2">
				<span class="mb-1 block text-sm text-zinc-600">Address</span>
				<textarea
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
					rows="3"
					value={$invoiceStore.address}
					oninput={(e) => update('address', e.currentTarget.value)}
				></textarea>
			</label>
		</div>
	</section>

	<section class="mb-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
		<h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Invoice details</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="block">
				<span class="mb-1 block text-sm text-zinc-600">Invoice number</span>
				<input
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
					value={$invoiceStore.invoiceNumber}
					oninput={(e) => update('invoiceNumber', e.currentTarget.value)}
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm text-zinc-600">Date due</span>
				<input
					type="date"
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
					value={$invoiceStore.dueDate}
					oninput={(e) => update('dueDate', e.currentTarget.value)}
				/>
			</label>
		</div>
		<label class="block">
			<span class="mb-1 block text-sm text-zinc-600">Customer name</span>
			<input
				class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
				value={$invoiceStore.customerName}
				oninput={(e) => update('customerName', e.currentTarget.value)}
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm text-zinc-600">Customer email</span>
			<input
				type="email"
				class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
				placeholder="name@company.com"
				value={$invoiceStore.customerEmail}
				oninput={(e) => update('customerEmail', e.currentTarget.value)}
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm text-zinc-600">Payment link (optional)</span>
			<input
				type="url"
				class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
				placeholder="https://…"
				value={$invoiceStore.payOnlineUrl}
				oninput={(e) => update('payOnlineUrl', e.currentTarget.value.trim())}
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm text-zinc-600">Memo / description</span>
			<textarea
				class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm"
				rows="2"
				value={$invoiceStore.description}
				oninput={(e) => update('description', e.currentTarget.value)}
			></textarea>
		</label>

		<div class="pt-2">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-medium text-zinc-600">Line items</span>
				<button
					type="button"
					class="text-sm font-medium text-violet-600 hover:text-violet-700"
					onclick={addItem}
				>
					Add item
				</button>
			</div>
			<div class="space-y-3">
				{#each $invoiceStore.items as item, i (item.id)}
					<div
						class="grid gap-2 rounded-lg border border-zinc-100 bg-zinc-50/80 p-3 sm:grid-cols-12 sm:items-end"
					>
						<label class="sm:col-span-5">
							<span class="mb-1 block text-xs text-zinc-500">Description</span>
							<input
								class="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
								value={item.name}
								oninput={(e) => updateItem(i, { name: e.currentTarget.value })}
							/>
						</label>
						<label class="sm:col-span-2">
							<span class="mb-1 block text-xs text-zinc-500">Qty</span>
							<input
								type="number"
								min="0"
								step="1"
								class="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
								value={item.quantity}
								oninput={(e) =>
									updateItem(i, { quantity: Number(e.currentTarget.value) || 0 })}
							/>
						</label>
						<label class="sm:col-span-3">
							<span class="mb-1 block text-xs text-zinc-500">Unit price</span>
							<input
								type="number"
								min="0"
								step="0.01"
								class="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
								value={item.price}
								oninput={(e) =>
									updateItem(i, { price: Number(e.currentTarget.value) || 0 })}
							/>
						</label>
						<div class="flex items-center justify-between gap-2 sm:col-span-2">
							<span class="text-sm text-zinc-600">{formatMoney(lineTotal(item))}</span>
							<button
								type="button"
								class="text-sm text-red-600 hover:underline disabled:opacity-40"
								disabled={$invoiceStore.items.length <= 1}
								onclick={() => removeItem(i)}
							>
								Remove
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<p class="border-t border-zinc-200 pt-4 text-right text-lg font-semibold text-zinc-900">
			Total: {formatMoney(invoiceTotal($invoiceStore))}
		</p>
	</section>

	<button
		type="button"
		class="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
		onclick={goPreview}
	>
		Preview invoice
	</button>
</div>
