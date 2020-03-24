const path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/index.js'
        
    },
    optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
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