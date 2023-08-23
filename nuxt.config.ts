// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@element-plus/nuxt", "@pinia/nuxt"],
	devtools: { enabled: true },
	css: ["@/assets/css/app.css"],
	pinia: {
		autoImports: [
			// automatically imports `defineStore`
			"defineStore", // import { defineStore } from 'pinia'
			["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
		],
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
