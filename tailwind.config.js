import colors from "./styles/themes/color.mjs";
import typography from "./styles/themes/typography.mjs";
import spacing from "./styles/themes/spacing.mjs";

/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			colors,
			typography,
			fontSize: {},
			space: spacing,
			spacing: {},
			minWidth: {},
		},
	},
	presets: [require("nativewind/preset")],
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./modules/**/*.{js,jsx,ts,tsx}",
	],
	plugins: [],
};
