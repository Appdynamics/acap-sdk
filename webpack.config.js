var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase:true
    },
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'ACAP',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            { test: /\.(html)$/, loader: 'html-loader', options: { minimize: false } },
            {
                test: /\.(png|jpg|svg|eot|woff|woff2|ttf)$/,
                loader: 'url-loader'
            },
            { test: /\.(css)$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            bb: 'bb',
            d3: 'd3'
        })
    ]

    // ,
    // externals: {
    //     jquery: 'jQuery'
    // }
}