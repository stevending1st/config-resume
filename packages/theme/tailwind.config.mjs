// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		path.join(__dirname,'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'),
	],
	theme: {
		extend: {},
	},
	plugins: [],
}
