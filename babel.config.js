module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@': './src',
        },
      },
    ],
    '@lingui/babel-plugin-lingui-macro',
    'react-native-reanimated/plugin',
  ],
};
