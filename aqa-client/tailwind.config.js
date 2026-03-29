/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		transparent: "transparent",
		current: "currentColor",
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				grid: "url('/src/assets/grid.svg')",
			},
			colors: {
				card: "#f7f7f7cc",
				navbar: {
					normal: "white",
					hover: "oklch(92.2% 0 0)",
					"hover-foreground": "oklch(96.8% 0.007 247.896)",
					selected: "oklch(12.9% 0.042 264.695)",
				},
				"primary-normal": "#ffd85f",
				"primary-hover": "#fae296cc",
				secondary: {
					normal: "#fff",
					hover: "oklch(96.8% 0.007 247.896)",
					active: "oklch(92.9% 0.013 255.508)",
					foreground: "oklch(55.4% 0.046 257.417)",
					ui: "#148d82",
				},
				// light mode
				tremor: {
					brand: {
						faint: "#eff6ff", // blue-50
						muted: "#bfdbfe", // blue-200
						subtle: "#60a5fa", // blue-400
						DEFAULT: "#3b82f6", // blue-500
						emphasis: "#1d4ed8", // blue-700
						inverted: "#ffffff", // white
					},
					background: {
						muted: "#f9fafb", // gray-50
						subtle: "#f3f4f6", // gray-100
						DEFAULT: "#ffffff", // white
						emphasis: "#374151", // gray-700
					},
					border: {
						DEFAULT: "#e5e7eb", // gray-200
					},
					ring: {
						DEFAULT: "#e5e7eb", // gray-200
					},
					content: {
						subtle: "#000", // gray-400
						DEFAULT: "#000", // gray-500
						emphasis: "#000", // gray-700
						strong: "#000", // gray-900
						inverted: "#000", // white
					},
				},
				// dark mode
				"dark-tremor": {
					brand: {
						faint: "#eff6ff", // blue-50
						muted: "#bfdbfe", // blue-200
						subtle: "#60a5fa", // blue-400
						DEFAULT: "#3b82f6", // blue-500
						emphasis: "#1d4ed8", // blue-700
						inverted: "#ffffff", // white
					},
					background: {
						muted: "#f9fafb", // gray-50
						subtle: "#f3f4f6", // gray-100
						DEFAULT: "#ffffff", // white
						emphasis: "#374151", // gray-700
					},
					border: {
						DEFAULT: "#e5e7eb", // gray-200
					},
					ring: {
						DEFAULT: "#e5e7eb", // gray-200
					},
					content: {
						subtle: "#000", // gray-400
						DEFAULT: "#000", // gray-500
						emphasis: "#000", // gray-700
						strong: "#000", // gray-900
						inverted: "#000", // white
					},
				},
			},
			borderRadius: {
				large: "16px",
			},
			boxShadow: {
				// light
				"tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
				"tremor-card":
					"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
				"tremor-dropdown":
					"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
				// dark
				"dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
				"dark-tremor-card":
					"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
				"dark-tremor-dropdown":
					"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
			},
			borderRadius: {
				"tremor-small": "0.375rem",
				"tremor-default": "0.5rem",
				"tremor-full": "9999px",
			},
			fontSize: {
				"tremor-label": ["0.85rem", { lineHeight: "1.5rem" }],
				"tremor-default": ["0.95rem", { lineHeight: "1.5rem" }],
				"tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
				"tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
			},
		},
	},
	safelist: [
		{
			pattern:
				/^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ["hover", "ui-selected"],
		},
		{
			pattern:
				/^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ["hover", "ui-selected"],
		},
		{
			pattern:
				/^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
			variants: ["hover", "ui-selected"],
		},
		{
			pattern:
				/^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
		{
			pattern:
				/^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
		{
			pattern:
				/^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
	],
	// darkMode: "class",
	darkMode: "class",
	media: false,
	// plugins: [heroui(), require("@headlessui/tailwindcss")],
	plugins: [
		heroui({
			themes: {
				light: {
					colors: {
						primary: "#ffd85f", // Your custom primary color for light theme
						secondary: "#148d82",
						foreground: "#000",
						default: "#fff",
					},
				},
				dark: {
					colors: {
						primary: "#ffd85f", // Your custom primary color for light theme
						secondary: "#148d82",
						foreground: "#000",
						default: "#fff",
					},
				},
			},
		}),
	],
};
