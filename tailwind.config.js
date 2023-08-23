/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
		"./app.vue",
	],
	theme: {
		extend: {
			colors: {
				"table-gray": "#F6F6F6",
				"table-header": "#E0E4EB",
				"table-text-secondary": "#586887",
			},
		},
	},

	plugins: [],
};
