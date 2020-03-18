const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app:['./src/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'ACAP',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            { test: /\.(html)$/, use: 'html-loader'},
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
            bb:'bb'
        })
    ]
    
    // ,
    // externals: {
    //     jquery: 'jQuery'
    // }
}