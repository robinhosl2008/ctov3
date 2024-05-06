module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        // Outros plugins ficam aqui.
        'react-native-paper/babel',
        'react-native-reanimated/plugin', // Este deverá ser o último da lista.
      ]
    }
  }
};
