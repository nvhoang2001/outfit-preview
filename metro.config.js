const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const extendConfig = {
  resolver: {
    /* Fix dual-package error from lingui and react native
        https://github.com/lingui/js-lingui/issues/2231
    */
    unstable_enablePackageExports: false,
  },
};
const svgConfig = withSvgTransformer();

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(mergeConfig(defaultConfig, svgConfig, extendConfig), {
    input: './src/styles/global.css',
  })
);

function withSvgTransformer() {
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'd.ts'],
    },
  };
}
