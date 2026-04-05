import { writable } from 'svelte/store';

export type LineItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
};

export type InvoiceData = {
	logoDataUrl: string | null;
	businessName: string;
	phoneEmail: string;
	address: string;
	invoiceNumber: string;
	dueDate: string;
	customerName: string;
	customerEmail: string;
	payOnlineUrl: string;
	description: string;
	items: LineItem[];
};

function newItem(): LineItem {
	return {
		id: crypto.randomUUID(),
		name: '',
		quantity: 1,
		price: 0
	};
}

function draftInvoiceNumber(): string {
	const part = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
	return `${part}-DRAFT`;
}

export const defaultInvoiceData = (): InvoiceData => ({
	logoDataUrl: null,
	businessName: '',
	phoneEmail: '',
	address: '',
	invoiceNumber: draftInvoiceNumber(),
	dueDate: '',
	customerName: '',
	customerEmail: '',
	payOnlineUrl: '',
	description: '',
	items: [newItem()]
});

export const invoiceStore = writable<InvoiceData>(defaultInvoiceData());

export function lineTotal(item: LineItem): number {
	return item.quantity * item.price;
}

export function invoiceTotal(data: InvoiceData): number {
	return data.items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function formatMoney(n: number): string {
	return n.toLocaleString(undefined, { style: 'currency', currency: 'NGN' });
}

/** `iso` is `yyyy-mm-dd` from `<input type="date">` */
export function formatDueDate(iso: string): string {
	const t = iso.trim();
	if (!t) return '—';
	const [y, m, d] = t.split('-').map(Number);
	if (!y || !m || !d) return t;
	return new Date(y, m - 1, d).toLocaleDateString(undefined, {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}
