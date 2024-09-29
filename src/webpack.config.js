// const path = require('path');

// module.exports = {
//   // The entry point file described above
//   entry: './src/server.js',
//   // The location of the build folder described above
//   output: {
//     path: path.resolve('src', 'dist'),
//     filename: 'bundle.js'
//   },
//   // Optional and for development only. This provides the ability to
//   // map the built code back to the original source format when debugging.
//   devtool: 'eval-source-map',
// };
const path = require('path');

module.exports = {
    entry: './src/server.js',  // Adjust this to your actual entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx'], // Add other file extensions if necessary
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Ensure Babel is set up if using ES6+
                },
            },
        ],
    },
    mode: 'development', // Change to 'production' for production builds
};