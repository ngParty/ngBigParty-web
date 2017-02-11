const webpack = require('webpack')
const { CommonsChunkPlugin, UglifyJsPlugin } = webpack.optimize;
const { resolve } = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ProgressBarPlugin = require( 'progress-bar-webpack-plugin' );
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const cssnext = require( 'postcss-cssnext' );
const postcssReporter = require( 'postcss-reporter' );
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = (env) => {
  const { ifDev, ifNotDev, ifProd, ifNotProd } = getIfUtils(env);
  return {
    context: resolve(__dirname,'src'),
    entry: {
      polyfills: './polyfills.ts',
      main: './main.tsx'
    },
    output: {
      path: '/dist',
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    devtool: 'source-map',
    module:{
      rules:[
        // Typescript
        {
          test: /\.tsx?$/,
          include: /src/,
          use: [ 'awesome-typescript-loader' ]
        },
        // Fonts Loading
        {
          test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          use: 'file-loader'
        },
      ]
    },
    plugins: removeEmpty( [

      new webpack.LoaderOptionsPlugin( {
        // The UglifyJsPlugin will no longer put loaders into minimize mode, and the debug option has been deprecated.
        // These options are simply moved into a new plugin, LoaderOptionsPlugin, for separation of concerns reasons.
        // Default webpack build options saves a couple of kBs
        minimize: ifProd( true ),
        debug: ifProd( false ),
        quiet: ifProd( true ),

        // Legacy loader plugin configs ( for plugins not yet ready for WebPack 2 Api )
        options: {
          context: __dirname,
          postcss: {
            plugins: [
              // Allow future CSS features to be used, also auto-prefixes the CSS...
              cssnext( {
                // ...based on this browser list
                browsers: [ 'last 2 versions', 'IE > 10' ],
              } ),
              postcssReporter()
            ]
          }
        }
      } ),

      /**
       * Use the HtmlWebpackPlugin plugin to make index.html a template so css and js can dynamically be added to the page.
       * This will also take care of moving the index.html file to the build directory using the index.html in src as a template.
       * https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin( {
        template: resolve( 'src', 'index.html' ),
        // https://github.com/kangax/html-minifier#options-quick-reference
        // will minify html
        minify: ifProd(
          {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            keepClosingSlash: true,
            minifyURLs: true
          },
          false
        )
      } ),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       */
      new CopyWebpackPlugin( [
        {
          from: './assets',
          to: 'assets',
        }
      ] ),

      // Set NODE_ENV to enable production react version
      new webpack.DefinePlugin( {
        'process.env': { NODE_ENV: ifProd( '"production"', '"development"' ) }
      } ),

      // Add nice progress bar
      new ProgressBarPlugin(),

      // prints more readable module names in the browser console on HMR updates
      ifNotProd( new webpack.NamedModulesPlugin() ),

      /*
       * Plugin: ForkCheckerPlugin
       * Description: Do type checking in a separate process, so webpack don't need to wait.
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      ifNotProd( new CheckerPlugin() ),

      // We use ExtractTextPlugin so we get a seperate CSS file instead
      // of the CSS being in the JS and injected as a style tag
      ifProd( new ExtractTextPlugin( {
        filename: '[name].[contenthash].css',
        allChunks: true,
      } ) ),


      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      // This enables tree shaking of the vendor modules
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: (module, count) => /node_modules\//.test(module.resource)
      }),
      // Specify the correct order the scripts will be injected in
      new CommonsChunkPlugin({
        name: ['vendor','polyfills']
      }),

      // A plugin for a more aggressive chunk merging strategy.
      ifProd( new webpack.optimize.AggressiveMergingPlugin() ),

      // Uglify bundles
      ifProd( new webpack.optimize.UglifyJsPlugin( {
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        output: { comments: false }
      } ) )

    ] ),
  }
}
