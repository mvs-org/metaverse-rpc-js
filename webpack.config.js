var path = require('path');

const standaloneConfig = {
    entry: './src/index',
    output: {
        filename: 'mvsd.browser.js',
        libraryTarget: 'var',
        library: 'Mvsd'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ["@babel/preset-env"]  //Preset used for env setup
            }
        }],
    }
}

module.exports = [standaloneConfig]
