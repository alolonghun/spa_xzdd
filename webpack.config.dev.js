var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var isProduction = function() {
    return process.env.NODE_ENV === 'production';
}

var HtmlWebpackPlugin = require("html-webpack-plugin");
var vuxLoader = require('vux-loader');

//webpack插件
var plugins = [
    //提公用js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    //将样式统一发布到style.css中
    new ExtractTextPlugin("style.css", {
        allChunks: true,
        disable: false
    }),
    // 使用 ProvidePlugin 加载使用率高的依赖库
    new webpack.ProvidePlugin({
        $: 'webpack-zepto',
        'zepto': 'webpack-zepto'
    }),
    new webpack.DefinePlugin({
        'require.specified': 'require.resolve'
    })
];

var entry = ['./src/app'],
    cdnPrefix = "",
    buildPath = "/dist/",
    publishPath = cdnPrefix + buildPath;

console.log("build " + (!process.env.NODE_ENV ? "production" : process.env.NODE_ENV));

//编译输出路径
var webpackConfig = {
    debug: false,
    entry: entry,
    output: {
        path: path.resolve('build'),
        publicPath: "/build/",
        filename: "build.js?[hash]",
        chunkFilename: "[id].build.js?[chunkhash]"
    },
    module: {
        loaders: [
            // 加载vue组件，并将css全部整合到一个style.css里面
            // 但是使用这种方式后 原先可以在vue组件中 在style里面加入 scoped 就不能用了,
            // 好处是使用了cssnext，那么样式按照标准的来写就行了，会自动生成兼容代码 http://cssnext.io/playground/
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery!expose?$'
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(scss|sass)$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!cssnext-loader")
            },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            }, //es6转es5
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[hash].[ext]'
            }, // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: "file-loader"
            }
        ]
    },
    babel: {
        "presets": ["es2015", "stage-2"],
        "plugins": ["transform-runtime"],
        "comments": false
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue', '.json'],
        //别名
        alias: {
            filter: path.join(__dirname, 'src/filters')
        }
    },
    devServer: {
     disableHostCheck: true
    },
    plugins: plugins,
    devtool: '#source-map'
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    {
        name: 'duplicate-style'
    }
  ]
})