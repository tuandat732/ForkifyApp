const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

/*
    In webpack, there are four core concepts:
        + entry point
        + output
        + loader
        + plugins

    - Using webpack => can import/ export in js file
*/

module.exports = {
    entry: ['@babel/polyfill', './src/js/index.js'], // entry: where webpack will start the bundle
    // polyfile: có những code là của riêng es6+ mà es5 ko có => ko convert dc => polyfile để thêm các code es6+ vào mà es5 ko có
    output: { // define đầu ra - absolute path
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
    },
    /* mode: 'development', => có thể chạy ở trong cli => package.json
        còn khi mode ở chế độ production thì webpack sẽ nén file lại, minifly code,... để tối ưu hơn        
    */
    devServer: {
        contentBase : './dist', // đường dẫn để webpack-server chạy file
    },
    plugins: [ // plugin html này để tự động cop code html từ thư mục src sang dist và thêm thẻ script dẫn dến bundle.js
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    /*
        Loaders in webpack allow to import or load all kinds of different files. And more importantly
        to also process them. Like converting SASS to CSS or ES6+ to ES5
    */
   module: {
       rules: [{
           test: /\.js$/, // test all js file for change ES6+ to 5
           exclude: /node_modules/, 
           use: {
               loader: 'babel-loader',
           }
       }]
   }
}

