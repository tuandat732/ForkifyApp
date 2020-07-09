const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/js/index.js', // entry: define file bắt đầu
    output: { // define đầu ra
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
    },
    /* mode: 'development', => có thể chạy ở trong cli => package.json
        còn khi mode ở chế độ production thì webpack sẽ nén file lại, minifly code,... để tối ưu hơn        
    */
    devServer: {
        contentBase : './dist',
    },
    plugins: [ // plugin html này để tự động cop code html từ thư mục src sang dist và thêm thẻ script dẫn dến bundle.js
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
}

