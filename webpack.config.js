'use strict';
var webpack = require('webpack'),
  path = require('path'),
  fs = require('fs');

// var libDir = 'lib',
var pageDir = 'src';

// var libPath = path.join(__dirname, '/' , libDir);
var pagePath = path.join(__dirname, '/' , pageDir);

var entry = {};
// var alias = {
//   jquery: libPath + "/lib-common/build/jquery.js"
// };

var pages = fs.readdirSync(pagePath);
pages.forEach(function(me){
  var stat = fs.lstatSync(pagePath + '/' + me);
  if(stat.isDirectory()) entry[me] = './'+ pageDir +'/' + me + '/index.js';
});

// var libs = fs.readdirSync(libPath);
// libs.forEach(function(me){
//   var matchName = me.match(/^lib-(.+)/i);
//   if(matchName){
//     var libName = matchName[1];
//     var libRealPath = libPath + '/' + me + '/build/' + libName + '.js';
//     var stat = fs.existsSync(libRealPath);
//     if(stat && !alias[libName]) alias[libName] = libRealPath;
//   }
// });

module.exports = {
  context: __dirname,
  entry: entry,
  output: {
    path: './build/',
    filename: '[name].js', /* 这里的[name]对应entry里的属性名 */
    publicPath: 'build/'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!raw'
    }, {
      test: /\.html$/,
      loader: 'html'
    },{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015']
      }
    },{
      test: /\.glsl$/,
      loader: 'shader'
    }]
  },
  // resolve: {
  //   extensions: ['', '.js', '.html', '.css'],
  //   alias: alias
  // },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: 2
    })
  ]
};