var path = require('path');
var webpack = require( "webpack" );
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var isProduction = function() {
    return process.env.NODE_ENV === 'production';
}
var HtmlWebpackPlugin = require("html-webpack-plugin");
//webpack插件
var plugins = [
    //提公用js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('/dist/common/common.js'),
    //将样式统一发布到style.css中
    new ExtractTextPlugin("/dist/common/style.css", {
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
    // cdnPrefix = "http://dev.xstatic.xiaozhangbang.org",//正式去掉dev
    buildPath = "/dist";

var vuxLoader = require('vux-loader');

//生产环境js压缩和图片cdn
if (isProduction()) {
    var cdnPrefix = "http://xstatic.xiaozhangbang.org";//正式去掉dev
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}else{
    var cdnPrefix = "http://dev.xstatic.xiaozhangbang.org";//测试地址dev
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}

var publishPath = cdnPrefix;

plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html', //会生成pub_index.html在根目录下,并注入脚本
    template: './src/index.html',
    inject: true //此参数必须加上，不加不注入
}));

//编译输出路径
var webpackConfig = {
    debug: true,
    entry: entry,
    output: {
        path: __dirname + buildPath,
        filename: '/dist/common/build.js?[hash]',
        publicPath: publishPath,
        chunkFilename: "/dist/common/[id].build.js?[chunkhash]"
    },
    module: {
        loaders: [
            // 加载vue组件，并将css全部整合到一个style.css里面
            // 但是使用这种方式后 原先可以在vue组件中 在style里面加入 scoped 就不能用了,
            // 好处是使用了cssnext，那么样式按照标准的来写就行了，会自动生成兼容代码 http://cssnext.io/playground/
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
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=20000&name=images/[name].[hash:8].[ext]'
            }, // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: "file-loader?name=fonts/[name].[ext]"
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
    plugins: plugins
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui']
})