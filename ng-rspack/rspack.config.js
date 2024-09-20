const { composePlugins, withNx, withWeb } = require('@nx/rspack');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const { HtmlRspackPlugin, CopyRspackPlugin } = require('@rspack/core');
const { DedupeModuleResolvePlugin } = require('@angular-devkit/build-angular/src/webpack/plugins/dedupe-module-resolve-plugin');
const {
  NamedChunksPlugin
} = require('@angular-devkit/build-angular/src/webpack/plugins/named-chunks-plugin');
const {
  OccurrencesPlugin
} = require('@angular-devkit/build-angular/src/webpack/plugins/occurrences-plugin');
const {
  JavaScriptOptimizerPlugin,
} = require('@angular-devkit/build-angular/src/tools/webpack/plugins/javascript-optimizer-plugin');
const {
  TransferSizePlugin,
} = require('@angular-devkit/build-angular/src/tools/webpack/plugins/transfer-size-plugin');
const {
  CssOptimizerPlugin,
} = require('@angular-devkit/build-angular/src/tools/webpack/plugins/css-optimizer-plugin');

module.exports = composePlugins(withNx(), withWeb(), (baseConfig, ctx) => {
  const config = {
    ...baseConfig,

    mode: 'production',
    devtool: false,
    target: ['web', 'es2015'],
    entry: {
      polyfills: ['zone.js'],
      main: ['./src/main.ts'],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      uniqueName: 'nx-rspack',
      hashFunction: 'xxhash64',
      clean: true,
      path: ctx.options.outputPath,
      publicPath: '',
      filename: '[name].[contenthash:20].js',
      chunkFilename: '[name].[contenthash:20].js',
      crossOriginLoading: false,
      trustedTypes: 'angular#bundler',
      scriptType: 'module',
    },
    watch: false,
    performance: { hints: false },
    experiments: {
      backCompat: false,
      syncWebAssembly: true,
      asyncWebAssembly: true
    },
    optimization: {
      minimize: true,
      minimizer: [
        new JavaScriptOptimizerPlugin({
          advanced: true,
          define: {
            ngDevMode: false,
            ngI18nClosureMode: false,
            ngJitMode: false,
          },
          keepIdentifierNames: false,
          removeLicenses: true,
          sourcemap: false,
        }),
        new TransferSizePlugin(),
        new CssOptimizerPlugin(),
      ],
    },
    builtins: {
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      html: [
        {
          template: './src/index.html'
        }
      ]
    },
    module: {
      parser: {
        javascript: {
          requireContext: false,
          // Disable auto URL asset module creation. This doesn't effect `new Worker(new URL(...))`
          // https://webpack.js.org/guides/asset-modules/#url-assets
          url: false
        }
      },
      rules: [
        // {
        // 	// ! THIS IS FOR TESTING ANGULAR HMR !
        // 	include: [path.resolve('./src/main.ts')],
        // 	use: [
        // 		{
        // 			loader: require.resolve(
        // 				'@angular-devkit/build-angular/src/webpack/plugins/hmr/hmr-loader.js'
        // 			)
        // 		}
        // 	]
        // },
        {
          test: /\.?(svg|html)$/,
          resourceQuery: /\?ngResource/,
          type: 'asset/source'
        },
        {
          test: /\.?(scss)$/,
          resourceQuery: /\?ngResource/,
          use: [{ loader: 'raw-loader' }, { loader: 'sass-loader' }]
        },
        { test: /[/\\]rxjs[/\\]add[/\\].+\.js$/, sideEffects: true },
        {
          test: /\.[cm]?[tj]sx?$/,
          exclude: [
            /[\\/]node_modules[/\\](?:core-js|@babel|tslib|web-animations-js|web-streams-polyfill|whatwg-url)[/\\]/
          ],
          use: [
            {
              loader: require.resolve(
                '@angular-devkit/build-angular/src/babel/webpack-loader.js'
              ),
              options: {
                cacheDirectory: false,
                aot: true,
                optimize: true,
                supportedBrowsers: [
                  'chrome 111',
                  'chrome 110',
                  'edge 111',
                  'edge 110',
                  'firefox 111',
                  'firefox 102',
                  'ios_saf 16.3',
                  'ios_saf 16.2',
                  'ios_saf 16.1',
                  'ios_saf 16.0',
                  'ios_saf 15.6',
                  'ios_saf 15.5',
                  'ios_saf 15.4',
                  'ios_saf 15.2-15.3',
                  'ios_saf 15.0-15.1',
                  'safari 16.3',
                  'safari 16.2',
                  'safari 16.1',
                  'safari 16.0',
                  'safari 15.6',
                  'safari 15.5',
                  'safari 15.4',
                  'safari 15.2-15.3',
                  'safari 15.1',
                  'safari 15'
                ]
              }
            }
          ]
        },
        {
          test: /\.[cm]?tsx?$/,
          use: [{ loader: require.resolve('@ngtools/webpack/src/ivy/index.js') }],
          exclude: [
            /[\\/]node_modules[/\\](?:css-loader|mini-css-extract-plugin|webpack-dev-server|webpack)[/\\]/
          ]
        }
      ]
    },
    plugins: [
      new DedupeModuleResolvePlugin(),
      new NamedChunksPlugin(),
      new OccurrencesPlugin({
        aot: true,
        scriptsOptimization: false
      }),
      new CopyRspackPlugin({
        patterns: [
          {
            from: 'src/assets',
            to: '.',
            globOptions: {
              dot: false,
            },
            noErrorOnMissing: true,
          },
          {
            from: 'src/favicon.ico',
            to: '.',
          },
        ],
      }),
      new ProgressPlugin(),
      new CssExtractRspackPlugin(),
      new HtmlRspackPlugin({
        minify: false,
        inject: 'body',
        scriptLoading: 'module',
        template: 'src/index.html',
      }),
      new AngularWebpackPlugin({
        tsconfig: './tsconfig.app.json',
        emitClassMetadata: false,
        emitNgModuleScope: false,
        jitMode: false,
        fileReplacements: {},
        substitutions: {},
        directTemplateLoading: true,
        compilerOptions: {
          sourceMap: false,
          declaration: false,
          declarationMap: false,
          preserveSymlinks: false
        },
        inlineStyleFileExtension: 'scss'
      })
    ]
  };

  return config;
});
