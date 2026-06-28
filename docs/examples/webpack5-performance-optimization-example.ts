/**
 * Webpack 5 Performance Optimization Examples for Angular
 * 
 * This file contains practical examples of performance optimization techniques
 * using Webpack 5 with Angular applications.
 */

import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CompressionPlugin } from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/duplicates-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

// ============================================================================
// 1. ADVANCED BUNDLE OPTIMIZATION CONFIGURATION
// ============================================================================

export const optimizedProductionConfig: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  
  // Entry configuration for code splitting
  entry: {
    main: './src/main.ts',
    polyfills: './src/polyfills.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    clean: true,
    // Enable long-term caching
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },

  // Advanced optimization settings
  optimization: {
    minimize: true,
    
    // Advanced minification
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 3, // Multiple passes for better compression
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_proto: true,
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/, // Mangle private properties
            },
          },
          format: {
            comments: false,
            ascii_only: true,
          },
        },
        extractComments: false,
      }),
      
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
            },
          ],
        },
      }),
    ],

    // Advanced code splitting
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // Angular framework - separate chunks
        angularCore: {
          test: /[\\/]node_modules[\\/]@angular[\\/]core[\\/]/,
          name: 'angular-core',
          chunks: 'all',
          priority: 40,
          enforce: true,
        },
        angularCommon: {
          test: /[\\/]node_modules[\\/]@angular[\\/]common[\\/]/,
          name: 'angular-common',
          chunks: 'all',
          priority: 39,
          enforce: true,
        },
        angularForms: {
          test: /[\\/]node_modules[\\/]@angular[\\/]forms[\\/]/,
          name: 'angular-forms',
          chunks: 'all',
          priority: 38,
        },
        angularRouter: {
          test: /[\\/]node_modules[\\/]@angular[\\/]router[\\/]/,
          name: 'angular-router',
          chunks: 'all',
          priority: 37,
        },
        angularMaterial: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
          name: 'angular-material',
          chunks: 'all',
          priority: 36,
        },
        angularCDK: {
          test: /[\\/]node_modules[\\/]@angular[\\/]cdk[\\/]/,
          name: 'angular-cdk',
          chunks: 'all',
          priority: 35,
        },
        
        // RxJS - separate chunk
        rxjs: {
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          name: 'rxjs',
          chunks: 'all',
          priority: 30,
          enforce: true,
        },
        
        // UI Libraries
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          chunks: 'all',
          priority: 25,
        },
        moment: {
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          name: 'moment',
          chunks: 'all',
          priority: 24,
        },
        dateFns: {
          test: /[\\/]node_modules[\\/]date-fns[\\/]/,
          name: 'date-fns',
          chunks: 'all',
          priority: 23,
        },
        
        // Chart libraries
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|d3|highcharts)[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 20,
        },
        
        // Other vendor libraries
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          minChunks: 1,
        },
        
        // Common application code
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

    // Runtime chunk for better caching
    runtimeChunk: {
      name: 'runtime',
    },

    // Tree shaking optimization
    usedExports: true,
    sideEffects: false,
    
    // Module concatenation for better performance
    concatenateModules: true,
    
    // Remove empty chunks
    removeEmptyChunks: true,
    
    // Merge duplicate chunks
    mergeDuplicateChunks: true,
  },

  // Performance optimization
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    hints: 'warning',
    assetFilter: (assetFilename) => {
      return !assetFilename.endsWith('.map');
    },
  },

  // Advanced caching
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    compression: 'gzip',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },

  // Module resolution optimization
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
    },
    // Reduce module resolution overhead
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    // Use package.json main fields
    mainFields: ['es2015', 'browser', 'module', 'main'],
    //   for Node.js modules
    fallback: {
      "crypto": false,
      "stream": false,
      "util": false,
      "path": false,
      "fs": false,
      "buffer": false,
      "process": false,
    },
  },

  // Module rules optimization
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
              compilerOptions: {
                // Optimize TypeScript compilation
                skipLibCheck: true,
                strict: false,
              },
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
          minimize: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
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
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['cssnano', {
                    preset: ['default', {
                      discardComments: { removeAll: true },
                      normalizeWhitespace: true,
                      minifySelectors: true,
                      mergeLonghand: true,
                      mergeRules: true,
                      normalizeUnicode: true,
                      orderedValues: true,
                      reduceIdents: true,
                      zindex: false,
                    }],
                  }],
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
                includePaths: [
                  path.resolve(__dirname, 'src/styles'),
                ],
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
            maxSize: 4 * 1024, // 4kb - smaller threshold for better compression
          },
        },
        generator: {
          filename: 'assets/images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },

  // Plugins for optimization
  plugins: [
    new CleanWebpackPlugin(),
    
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),

    // Bundle analysis
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
      statsOptions: {
        source: false,
        reasons: false,
        modules: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        providedExports: false,
        optimizationBailout: false,
        errorDetails: false,
        publicPath: false,
        builtAt: false,
        version: false,
      },
    }),

    // Compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),

    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    // Duplicate detection
    new DuplicatesPlugin({
      emitErrors: false,
      emitHandler: (report) => {
        console.log('Duplicate modules detected:', report);
      },
    }),

    // Stats writer for analysis
    new StatsWriterPlugin({
      filename: 'webpack-stats.json',
      fields: ['assets', 'chunks', 'modules', 'children'],
      transform: (data) => {
        return JSON.stringify(data, null, 2);
      },
    }),

    // Define environment variables
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VERSION': JSON.stringify(require('./package.json').version),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    }),
  ],
};

// ============================================================================
// 2. DEVELOPMENT OPTIMIZATION CONFIGURATION
// ============================================================================

export const optimizedDevelopmentConfig: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  
  entry: {
    main: './src/main.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    clean: false, // Don't clean in development
  },

  // Development-specific optimization
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    usedExports: false,
    sideEffects: false,
  },

  // Development caching
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    compression: false, // No compression in development
  },

  // Development server
  devServer: {
    port: 4200,
    host: 'localhost',
    hot: true,
    liveReload: false,
    compress: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
        logLevel: 'debug',
      },
    },
    // Performance optimizations for dev server
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Add custom middleware for performance monitoring
      devServer.app.use('/api/build-stats', (req, res) => {
        res.json({
          buildTime: Date.now(),
          memoryUsage: process.memoryUsage(),
        });
      });
      return middlewares;
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
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: false, // Don't minimize in development
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Use style-loader in development
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),

    // Performance monitoring
    new SpeedMeasurePlugin({
      outputFormat: 'human',
    }),
  ],
};

// ============================================================================
// 3. PERFORMANCE MONITORING UTILITIES
// ============================================================================

export class WebpackPerformanceMonitor {
  private buildStartTime: number = 0;
  private buildEndTime: number = 0;
  private memoryUsage: NodeJS.MemoryUsage[] = [];

  startBuild(): void {
    this.buildStartTime = Date.now();
    this.memoryUsage = [];
    console.log('🚀 Build started...');
  }

  endBuild(): void {
    this.buildEndTime = Date.now();
    const buildTime = this.buildEndTime - this.buildStartTime;
    const memoryUsage = process.memoryUsage();
    
    console.log(`✅ Build completed in ${buildTime}ms`);
    console.log(`📊 Memory usage:`, {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    });
  }

  recordMemoryUsage(): void {
    this.memoryUsage.push(process.memoryUsage());
  }

  getMemoryTrend(): any {
    if (this.memoryUsage.length < 2) return null;
    
    const first = this.memoryUsage[0];
    const last = this.memoryUsage[this.memoryUsage.length - 1];
    
    return {
      rss: last.rss - first.rss,
      heapTotal: last.heapTotal - first.heapTotal,
      heapUsed: last.heapUsed - first.heapUsed,
      external: last.external - first.external,
    };
  }
}

// ============================================================================
// 4. BUNDLE ANALYSIS UTILITIES
// ============================================================================

export class BundleAnalyzer {
  private stats: any;

  constructor(stats: any) {
    this.stats = stats;
  }

  getLargestChunks(limit: number = 10): any[] {
    const chunks = this.stats.chunks || [];
    return chunks
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, limit);
  }

  getLargestModules(limit: number = 10): any[] {
    const modules = this.stats.modules || [];
    return modules
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, limit);
  }

  getDuplicateModules(): any[] {
    const modules = this.stats.modules || [];
    const moduleMap = new Map();
    
    modules.forEach((module: any) => {
      const key = module.identifier;
      if (moduleMap.has(key)) {
        moduleMap.get(key).push(module);
      } else {
        moduleMap.set(key, [module]);
      }
    });
    
    return Array.from(moduleMap.values())
      .filter((modules: any[]) => modules.length > 1);
  }

  getUnusedModules(): any[] {
    const modules = this.stats.modules || [];
    return modules.filter((module: any) => !module.used);
  }

  generateReport(): string {
    const report = {
      summary: {
        totalChunks: this.stats.chunks?.length || 0,
        totalModules: this.stats.modules?.length || 0,
        totalSize: this.stats.assets?.reduce((sum: number, asset: any) => sum + asset.size, 0) || 0,
      },
      largestChunks: this.getLargestChunks(5),
      largestModules: this.getLargestModules(5),
      duplicateModules: this.getDuplicateModules(),
      unusedModules: this.getUnusedModules(),
    };
    
    return JSON.stringify(report, null, 2);
  }
}

// ============================================================================
// 5. CUSTOM WEBPACK PLUGINS FOR PERFORMANCE
// ============================================================================

export class PerformancePlugin {
  private monitor: WebpackPerformanceMonitor;

  constructor() {
    this.monitor = new WebpackPerformanceMonitor();
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.beforeCompile.tap('PerformancePlugin', () => {
      this.monitor.startBuild();
    });

    compiler.hooks.afterCompile.tap('PerformancePlugin', () => {
      this.monitor.recordMemoryUsage();
    });

    compiler.hooks.done.tap('PerformancePlugin', (stats) => {
      this.monitor.endBuild();
      
      if (stats.compilation.errors.length > 0) {
        console.error('❌ Build failed with errors:', stats.compilation.errors);
      } else if (stats.compilation.warnings.length > 0) {
        console.warn('⚠️ Build completed with warnings:', stats.compilation.warnings);
      }
      
      // Generate bundle analysis
      const analyzer = new BundleAnalyzer(stats.toJson());
      const report = analyzer.generateReport();
      console.log('📊 Bundle Analysis Report:', report);
    });
  }
}

export class ChunkOptimizerPlugin {
  private maxChunkSize: number;

  constructor(maxChunkSize: number = 244000) {
    this.maxChunkSize = maxChunkSize;
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.compilation.tap('ChunkOptimizerPlugin', (compilation) => {
      compilation.hooks.optimizeChunks.tap('ChunkOptimizerPlugin', (chunks) => {
        chunks.forEach((chunk) => {
          if (chunk.size() > this.maxChunkSize) {
            console.warn(`⚠️ Chunk ${chunk.name} is larger than recommended size: ${chunk.size()} bytes`);
          }
        });
      });
    });
  }
}

// ============================================================================
// 6. PERFORMANCE OPTIMIZED CONFIGURATION WITH MONITORING
// ============================================================================

export const performanceMonitoredConfig: webpack.Configuration = {
  ...optimizedProductionConfig,
  plugins: [
    ...optimizedProductionConfig.plugins || [],
    new PerformancePlugin(),
    new ChunkOptimizerPlugin(200000), // 200KB max chunk size
  ],
};

// ============================================================================
// 7. TREE SHAKING OPTIMIZATION
// ============================================================================

export const treeShakingOptimizedConfig: webpack.Configuration = {
  ...optimizedProductionConfig,
  optimization: {
    ...optimizedProductionConfig.optimization,
    usedExports: true,
    sideEffects: false,
    providedExports: true,
    concatenateModules: true,
  },
  resolve: {
    ...optimizedProductionConfig.resolve,
    alias: {
      ...optimizedProductionConfig.resolve?.alias,
      // Use ES modules for better tree shaking
      'lodash': 'lodash-es',
      'rxjs': 'rxjs',
    },
  },
};

// ============================================================================
// 8. EXPORT ALL CONFIGURATIONS
// ============================================================================

export default {
  production: optimizedProductionConfig,
  development: optimizedDevelopmentConfig,
  performanceMonitored: performanceMonitoredConfig,
  treeShakingOptimized: treeShakingOptimizedConfig,
  WebpackPerformanceMonitor,
  BundleAnalyzer,
  PerformancePlugin,
  ChunkOptimizerPlugin,
};



