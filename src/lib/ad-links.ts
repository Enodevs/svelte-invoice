/**
 * Sponsor cards (single right rail in the layout).
 *
 * To use **two side rails** later: split `sponsoredLinks` into two arrays and render
 * a left `<aside>` + right `<aside>` in `+layout.svelte` (see comment there).
 *
 * Images match each site’s Open Graph metadata where available.
 */
export type PromoLink = {
	title: string;
	sponsorLine?: string;
	description: string;
	href: string;
	imageUrl: string;
	imageAlt: string;
	cta?: string;
};

export const sponsoredHeading = 'Sponsored';

export const sponsoredLinks: PromoLink[] = [
	{
		title: 'Brain Dump',
		sponsorLine: 'Capture ideas instantly',
		description:
			'A minimal, instant capture tool for your ideas, tasks, and notes—saved across your devices.',
		href: 'https://usebraindump.vercel.app',
		imageUrl: 'https://usebraindump.vercel.app/braindump.png',
		imageAlt: 'Brain Dump — instant idea capture tool',
		cta: 'Open Brain Dump →'
	},
	{
		title: 'Isiaq Abdullah',
		sponsorLine: 'Full stack developer',
		description:
			'High-quality, performant web applications with TypeScript, React, Next.js, Python, and modern tooling.',
		href: 'https://abdullahdevs.vercel.app',
		imageUrl: 'https://abdullahdevs.vercel.app/abdullah.jpg',
		imageAlt: 'Isiaq Abdullah — Full Stack Developer',
		cta: 'View portfolio →'
	}
];
