// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'MostlyRight',
			description: 'API documentation for Therminal — Kalshi temperature prediction markets + NWS weather data',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Tarabcak' },
			],
			sidebar: [
				{ label: 'Quickstart', slug: 'quickstart' },
				{ label: 'Authentication', slug: 'authentication' },
				{
					label: 'API Reference',
					items: [
						{ label: 'Health', slug: 'api/health' },
						{ label: 'Series', slug: 'api/series' },
						{ label: 'Markets', slug: 'api/markets' },
						{ label: 'Candles', slug: 'api/candles' },
						{ label: 'Observations', slug: 'api/observations' },
						{ label: 'Climate', slug: 'api/climate' },
						{ label: 'Analysis', slug: 'api/analysis' },
					],
				},
				{ label: 'Data Sources', slug: 'data-sources' },
				{ label: 'Python SDK', slug: 'sdk' },
				{ label: 'Rate Limits & Errors', slug: 'errors' },
				{ label: 'Changelog', slug: 'changelog' },
			],
		}),
	],
});
