/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {};
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ...['react-native-worklets/plugin', workletsPluginOptions],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
