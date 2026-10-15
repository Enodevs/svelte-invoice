import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'invoice-draft-v1';

export type LineItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
};

export type Currency = {
	code: string;
	symbol: string;
	name: string;
};

export const currencies: Currency[] = [
	{ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
	{ code: 'USD', symbol: '$', name: 'US Dollar' },
	{ code: 'EUR', symbol: '€', name: 'Euro' },
	{ code: 'GBP', symbol: '£', name: 'British Pound' },
	{ code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
	{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
	{ code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
	{ code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan' },
	{ code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
	{ code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
	{ code: 'ZAR', symbol: 'R', name: 'South African Rand' },
	{ code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
];

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
	currency: string;
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
	currency: 'NGN',
	items: [newItem()]
});

function loadInvoice(): InvoiceData {
	const fallback = defaultInvoiceData();
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw) as Partial<InvoiceData>;
		// merge so new fields added later don't break old saved drafts
		const merged = { ...fallback, ...parsed };
		if (!Array.isArray(merged.items) || merged.items.length === 0) {
			merged.items = fallback.items;
		}
		return merged;
	} catch {
		return fallback;
	}
}

function createInvoiceStore() {
	const store = writable<InvoiceData>(loadInvoice());

	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			} catch {
				// quota exceeded (usually a big logo) or storage blocked; fail silently
			}
		});
	}

	return {
		...store,
		reset() {
			store.set(defaultInvoiceData());
			if (browser) localStorage.removeItem(STORAGE_KEY);
		}
	};
}

export const invoiceStore = createInvoiceStore();

export function lineTotal(item: LineItem): number {
	return item.quantity * item.price;
}

export function invoiceTotal(data: InvoiceData): number {
	return data.items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function formatMoney(n: number, currencyCode = 'NGN'): string {
	try {
		return n.toLocaleString(undefined, { style: 'currency', currency: currencyCode });
	} catch {
		return `${currencyCode} ${n.toFixed(2)}`;
	}
}

export function currencySymbol(code: string): string {
	return currencies.find((c) => c.code === code)?.symbol ?? code;
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
