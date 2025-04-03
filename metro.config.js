const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(withSvgTransformer(config), {
	input: "./styles/global.css",
});

function withSvgTransformer(config) {
	const { transformer, resolver } = config;
	config.resolver.assetExts.push("json");

	config.transformer = {
		...transformer,
		babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
		assetPlugins: ["expo-asset/tools/hashAssetFiles"],
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
	};
	config.resolver = {
		...resolver,
		assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
		sourceExts: [...resolver.sourceExts, "svg", "d.ts"],
	};

	return config;
}
