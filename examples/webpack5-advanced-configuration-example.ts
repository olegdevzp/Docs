/**
 * Advanced Webpack 5 Configuration Examples for Angular
 * 
 * This file contains practical examples of Webpack 5 configurations
 * for complex Angular applications.
 */

// ============================================================================
// 1. COMPLETE WEBPACK CONFIGURATION FOR PRODUCTION
// ============================================================================

import * as path from 'path';
import * as webpack from 'webpack';
import { ModuleFederationPlugin } from '@module-federation/webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';

// Base configuration that can be extended
export const baseConfig: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@core': path.resolve(__dirname, 'src/app/core'),
      '@features': path.resolve(__dirname, 'src/app/features'),
    },
    fallback: {
      "crypto": false,
      "stream": false,
      "util": false,
      "path": false,
      "fs": false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              configFile: 'tsconfig.app.json',
            },
          },
          {
            loader: '@angular-devkit/build-optimizer/webpack-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true,
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['cssnano', { preset: 'default' }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                precision: 8,
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: 'assets/images/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.VERSION': JSON.stringify(require('./package.json').version),
    }),
  ],
};

// Development configuration
export const developmentConfig: webpack.Configuration = {
  ...baseConfig,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
  },
  devServer: {
    port: 4200,
    host: 'localhost',
    historyApiFallback: true,
    hot: true,
    compress: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [
    ...baseConfig.plugins || [],
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};

// Production configuration
export const productionConfig: webpack.Configuration = {
  ...baseConfig,
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
    publicPath: process.env.CDN_URL || '/',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
            passes: 2,
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        // Angular framework chunks
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          chunks: 'all',
          priority: 20,
        },
        // RxJS chunks
        rxjs: {
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          name: 'rxjs',
          chunks: 'all',
          priority: 15,
        },
        // Other vendor chunks
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Common application chunks
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    usedExports: true,
    sideEffects: false,
  },
  plugins: [
    ...baseConfig.plugins || [],
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};

// ============================================================================
// 2. MODULE FEDERATION CONFIGURATION
// ============================================================================

// Host application configuration
export const hostConfig: webpack.Configuration = {
  ...baseConfig,
  mode: 'development',
  devServer: {
    port: 4200,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    ...baseConfig.plugins || [],
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        mfe1: 'mfe1@http://localhost:4201/remoteEntry.js',
        mfe2: 'mfe2@http://localhost:4202/remoteEntry.js',
        sharedComponents: 'sharedComponents@http://localhost:4203/remoteEntry.js',
      },
      shared: {
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        '@angular/router': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        '@angular/forms': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        'rxjs': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '^7.5.0',
        },
        'rxjs/operators': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '^7.5.0',
        },
      },
    }),
  ],
};

// Remote application configuration
export const remoteConfig: webpack.Configuration = {
  ...baseConfig,
  mode: 'development',
  devServer: {
    port: 4201,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    ...baseConfig.plugins || [],
    new ModuleFederationPlugin({
      name: 'mfe1',
      filename: 'remoteEntry.js',
      exposes: {
        './Component': './src/app/mfe1.component.ts',
        './Module': './src/app/mfe1.module.ts',
        './Service': './src/app/services/mfe1.service.ts',
      },
      shared: {
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^15.0.0',
        },
        'rxjs': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '^7.5.0',
        },
      },
    }),
  ],
};

// ============================================================================
// 3. CUSTOM LOADERS AND PLUGINS
// ============================================================================

// Custom markdown loader
export class MarkdownLoader {
  static loader(source: string): string {
    const marked = require('marked');
    const html = marked(source);
    
    return `
      export default ${JSON.stringify(html)};
      export const raw = ${JSON.stringify(source)};
    `;
  }
}

// Custom version plugin
export class VersionPlugin {
  private options: { filename?: string };

  constructor(options: { filename?: string } = {}) {
    this.options = { filename: 'version.js', ...options };
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.emit.tapAsync('VersionPlugin', (compilation, callback) => {
      const packageJson = require('./package.json');
      const version = packageJson.version;
      const buildTime = new Date().toISOString();
      
      const content = `
        export const VERSION = '${version}';
        export const BUILD_TIME = '${buildTime}';
        export const GIT_HASH = '${process.env.GIT_HASH || 'unknown'}';
      `;
      
      compilation.assets[this.options.filename!] = {
        source: () => content,
        size: () => content.length,
      };
      
      callback();
    });
  }
}

// Custom webpack configuration with custom loaders and plugins
export const customConfig: webpack.Configuration = {
  ...baseConfig,
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module?.rules || [],
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader',
          },
          {
            loader: path.resolve(__dirname, 'custom-loaders/markdown-loader.js'),
          },
        ],
      },
    ],
  },
  plugins: [
    ...baseConfig.plugins || [],
    new VersionPlugin({ filename: 'version-info.js' }),
  ],
};

// ============================================================================
// 4. ADVANCED OPTIMIZATION CONFIGURATIONS
// ============================================================================

// Configuration for large applications
export const largeAppConfig: webpack.Configuration = {
  ...productionConfig,
  optimization: {
    ...productionConfig.optimization,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // Framework chunks
        angularCore: {
          test: /[\\/]node_modules[\\/]@angular[\\/]core[\\/]/,
          name: 'angular-core',
          chunks: 'all',
          priority: 30,
        },
        angularCommon: {
          test: /[\\/]node_modules[\\/]@angular[\\/]common[\\/]/,
          name: 'angular-common',
          chunks: 'all',
          priority: 29,
        },
        angularForms: {
          test: /[\\/]node_modules[\\/]@angular[\\/]forms[\\/]/,
          name: 'angular-forms',
          chunks: 'all',
          priority: 28,
        },
        angularRouter: {
          test: /[\\/]node_modules[\\/]@angular[\\/]router[\\/]/,
          name: 'angular-router',
          chunks: 'all',
          priority: 27,
        },
        // RxJS chunks
        rxjs: {
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          name: 'rxjs',
          chunks: 'all',
          priority: 25,
        },
        // UI Library chunks
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
          name: 'angular-material',
          chunks: 'all',
          priority: 20,
        },
        // Utility libraries
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          chunks: 'all',
          priority: 15,
        },
        moment: {
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          name: 'moment',
          chunks: 'all',
          priority: 14,
        },
        // Other vendor chunks
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Common chunks
        common: {
          name: 'common',
          minChunks: 3,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
};

// ============================================================================
// 5. ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================

export const getEnvironmentConfig = (env: string): webpack.Configuration => {
  const base = baseConfig;
  
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'production':
      return productionConfig;
    case 'staging':
      return {
        ...productionConfig,
        mode: 'production',
        devtool: 'source-map',
        output: {
          ...productionConfig.output,
          publicPath: process.env.STAGING_CDN_URL || '/',
        },
        plugins: [
          ...productionConfig.plugins || [],
          new webpack.DefinePlugin({
            'process.env.ENVIRONMENT': JSON.stringify('staging'),
          }),
        ],
      };
    case 'testing':
      return {
        ...baseConfig,
        mode: 'development',
        devtool: 'inline-source-map',
        optimization: {
          splitChunks: false,
        },
        plugins: [
          ...baseConfig.plugins || [],
          new webpack.DefinePlugin({
            'process.env.ENVIRONMENT': JSON.stringify('testing'),
          }),
        ],
      };
    default:
      return base;
  }
};

// ============================================================================
// 6. UTILITY FUNCTIONS FOR WEBPACK CONFIGURATION
// ============================================================================

export class WebpackConfigBuilder {
  private config: webpack.Configuration = {};

  static create(): WebpackConfigBuilder {
    return new WebpackConfigBuilder();
  }

  setMode(mode: 'development' | 'production' | 'none'): this {
    this.config.mode = mode;
    return this;
  }

  setEntry(entry: webpack.Entry): this {
    this.config.entry = entry;
    return this;
  }

  setOutput(output: webpack.Output): this {
    this.config.output = output;
    return this;
  }

  addPlugin(plugin: webpack.WebpackPluginInstance): this {
    if (!this.config.plugins) {
      this.config.plugins = [];
    }
    this.config.plugins.push(plugin);
    return this;
  }

  addRule(rule: webpack.RuleSetRule): this {
    if (!this.config.module) {
      this.config.module = { rules: [] };
    }
    if (!this.config.module.rules) {
      this.config.module.rules = [];
    }
    this.config.module.rules.push(rule);
    return this;
  }

  setOptimization(optimization: webpack.Optimization): this {
    this.config.optimization = optimization;
    return this;
  }

  setResolve(resolve: webpack.ResolveOptions): this {
    this.config.resolve = resolve;
    return this;
  }

  setDevServer(devServer: webpack.DevServerConfiguration): this {
    this.config.devServer = devServer;
    return this;
  }

  build(): webpack.Configuration {
    return this.config;
  }
}

// Example usage of the builder
export const builderExample = WebpackConfigBuilder
  .create()
  .setMode('production')
  .setEntry('./src/main.ts')
  .setOutput({
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  })
  .addPlugin(new CleanWebpackPlugin())
  .addPlugin(new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
  }))
  .build();

// ============================================================================
// 7. EXPORT ALL CONFIGURATIONS
// ============================================================================

export default {
  base: baseConfig,
  development: developmentConfig,
  production: productionConfig,
  host: hostConfig,
  remote: remoteConfig,
  custom: customConfig,
  largeApp: largeAppConfig,
  getEnvironmentConfig,
  WebpackConfigBuilder,
};



