var LiveReloadPlugin = require('webpack-livereload-plugin');
 
module.exports = {
    entry: './public/lib/main.js',
    output: {
         path: './public',
         filename: 'index.js'
     },
    plugins: [
        new LiveReloadPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel', // 'babel-loader' is also a valid name to reference
            query: {
                presets: ['es2015', 'react']
                }
        }]
    }
}