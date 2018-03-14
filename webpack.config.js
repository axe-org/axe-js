const uglify = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    filename: 'axe.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new uglify()
  ]
};