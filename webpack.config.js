const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin"); // 提供带 Content-Encoding 编码的压缩版的资源
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");  // 提取 css 到单独文件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");  // js 代码压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //  css代码压缩

module.exports = {
  entry: {
    app: './src/index.js'
  }, // 入口文件，src下的 index.js
  output: {
    publicPath: '', // js 引用的路径
    path: path.resolve(__dirname, 'dist'), // 出口目录，dist 文件
    filename: 'static/js/[name].[chunkhash].js', // 打包出来的文件名
    chunkFilename: 'static/js/[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      '@css': path.resolve(__dirname, 'src/css'),
    }
  },
  devtool: false, // eval-source-map
  // 开发服务器配置
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 静态文件根目录
    hot: true, // 启用热模块替换功能
    port: 3001, // 端口
    open: true, // 服务器启动后打开默认浏览器
    host: 'localhost', // 指定使用的 host，默认情况下是 localhost
    overlay: true,  //  当存在编译器错误或警告时，在浏览器中显示全屏覆盖 boolean object: { boolean errors, boolean warnings }
    compress: true, // 服务器返回浏览器的时候是否启动 gzip 压缩
  },
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/,
        include: path.resolve(__dirname, 'src'), // 限制范围，提高打包速度
        exclude: /(node_modules|bower_components)/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/assets/[name].[hash:8].[ext]',
          }
        }
      }]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 启用文件缓存
        parallel: true, // 使用多进程并行运行来改进构建
      }),
      new OptimizeCSSAssetsPlugin()
    ],
    splitChunks: {
      automaticNameDelimiter: '.',
      chunks: 'all',
      cacheGroups: {
        common: {
          name: 'common',     // 提取出来的文件命名
          chunks: 'initial',  // initial表示提取入口文件的公共部分
          minChunks: 2,       // 表示提取公共部分最少的文件数
          minSize: 0          // 表示提取公共部分最小的大小
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          minSize: 30000,
          minChunks: 1,
          priority: 2
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new BundleAnalyzerPlugin(), // 展示出打包后的各个 bundle 所依赖的模块
    new webpack.ProvidePlugin({ // 自动加载模块，而不必到处 import 或 require 。
      _: 'lodash'
    }),
    // new webpack.HotModuleReplacementPlugin(), // 热更新插件 使用[chunkhash] ，不能启用
    new webpack.ProgressPlugin(), // 统计打包进度
    new CleanWebpackPlugin(), // 在每次打包时都会将之前的旧文件清除掉
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        collapseWhitespace: true
      }, // 压缩代码
      template: './src/index.html', // 表示模板路径
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].css'
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
