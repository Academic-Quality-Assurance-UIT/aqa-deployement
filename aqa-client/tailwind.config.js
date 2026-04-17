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
		"../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"../node_modules/.pnpm/@heroui+theme@*/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
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
				card: "#ffffff",
				navbar: {
					normal: "white",
					hover: "#f1f5f9",
					"hover-foreground": "#f8fafc",
					selected: "#0891b2",
				},
				"primary-normal": "#0891b2",
				"primary-hover": "#06b6d4",
				secondary: {
					normal: "#fff",
					hover: "#f8fafc",
					active: "#f1f5f9",
					foreground: "#475569",
					ui: "#0891b2",
				},
				"page-bg": "#f8fafc",
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
						subtle: "#9ca3af", // gray-400
						DEFAULT: "#6b7280", // gray-500
						emphasis: "#374151", // gray-700
						strong: "#111827", // gray-900
						inverted: "#ffffff", // white
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
						subtle: "#9ca3af", // gray-400
						DEFAULT: "#6b7280", // gray-500
						emphasis: "#374151", // gray-700
						strong: "#111827", // gray-900
						inverted: "#ffffff", // white
					},
				},
			},
			boxShadow: {
				// light
				"tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
				"tremor-card":
					"0px 4px 20px rgba(0, 0, 0, 0.03)",
				"tremor-dropdown":
					"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
				// dark
				"dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
				"dark-tremor-card":
					"0px 4px 20px rgba(0, 0, 0, 0.03)",
				"dark-tremor-dropdown":
					"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
				"card-sm": "0px 4px 20px rgba(0, 0, 0, 0.03)",
			},
			borderRadius: {
				large: "16px",
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
						primary: {
							DEFAULT: "#0891b2",
							50: "#ecfeff",
							100: "#cffafe",
							200: "#a5f3fc",
							300: "#67e8f9",
							400: "#22d3ee",
							500: "#06b6d4",
							600: "#0891b2",
							700: "#0e7490",
							800: "#155e75",
							900: "#164e63",
							950: "#083344",
						},
						secondary: {
							DEFAULT: "#0f766e",
							50: "#f0fdfa",
							100: "#ccfbf1",
							200: "#99f6e4",
							300: "#5eead4",
							400: "#2dd4bf",
							500: "#14b8a6",
							600: "#0d9488",
							700: "#0f766e",
							800: "#115e59",
							900: "#134e4a",
							950: "#042f2e",
						},
						foreground: "#0f172a",
						default: "#ffffff",
					},
				},
				dark: {
					colors: {
						primary: {
							DEFAULT: "#0891b2",
							50: "#ecfeff",
							100: "#cffafe",
							200: "#a5f3fc",
							300: "#67e8f9",
							400: "#22d3ee",
							500: "#06b6d4",
							600: "#0891b2",
							700: "#0e7490",
							800: "#155e59",
							900: "#164e63",
							950: "#083344",
						},
						secondary: {
							DEFAULT: "#0f766e",
							50: "#f0fdfa",
							100: "#ccfbf1",
							200: "#99f6e4",
							300: "#5eead4",
							400: "#2dd4bf",
							500: "#14b8a6",
							600: "#10b981",
							700: "#117852",
							800: "#0d5c3e",
							900: "#093e29",
							950: "#041f14",
						},
						foreground: "#f8fafc",
						default: "#000000",
					},
				},
			},
		}),
	],
};
