module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Outros plugins ficam aqui.
    'react-native-reanimated/plugin', // Este deverá ser o último da lista.
  ]
};
