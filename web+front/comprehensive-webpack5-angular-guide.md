# Comprehensive Guide: Using Webpack 5 with Angular for Complex Tasks

## Table of Contents
1. [Introduction](#introduction)
2. [Webpack 5 Fundamentals](#webpack-5-fundamentals)
3. [Angular CLI and Webpack Integration](#angular-cli-and-webpack-integration)
4. [Advanced Configuration Techniques](#advanced-configuration-techniques)
5. [Module Federation](#module-federation)
6. [Performance Optimization](#performance-optimization)
7. [Code Splitting and Lazy Loading](#code-splitting-and-lazy-loading)
8. [Asset Management](#asset-management)
9. [Development Tools Integration](#development-tools-integration)
10. [Production Optimization](#production-optimization)
11. [Troubleshooting Common Issues](#troubleshooting-common-issues)
12. [Best Practices](#best-practices)

## Introduction

Webpack 5 brings significant improvements and new features that can greatly enhance Angular applications. This comprehensive guide covers advanced techniques for leveraging Webpack 5 with Angular to handle complex tasks including module federation, performance optimization, advanced code splitting, and custom build configurations.

### Key Benefits of Webpack 5 with Angular
- **Module Federation**: Build micro-frontend architectures
- **Improved Tree Shaking**: Better dead code elimination
- **Persistent Caching**: Faster rebuilds during development
- **Asset Modules**: Simplified asset handling
- **Enhanced Performance**: Better bundle optimization

## Webpack 5 Fundamentals

### Core Concepts

Webpack 5 introduces several new concepts and improvements:

#### 1. Module Federation
Allows runtime integration of separately compiled applications.

#### 2. Persistent Caching
Webpack 5 includes a persistent file system cache that can significantly speed up rebuilds.

#### 3. Asset Modules
Replaces url-loader, file-loader, and raw-loader with built-in asset modules.

#### 4. Tree Shaking Improvements
Better elimination of unused code with enhanced algorithms.

### Basic Webpack 5 Configuration

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
```

## Angular CLI and Webpack Integration

### Understanding Angular Build System

Angular CLI uses Webpack internally but abstracts the configuration. To customize Webpack behavior, you need to use custom builders.

### Setting Up Custom Webpack Builder

#### 1. Install Required Dependencies

```bash
npm install --save-dev @angular-builders/custom-webpack webpack
npm install --save-dev @types/webpack
```

#### 2. Create Custom Webpack Configuration

Create `webpack.config.js` in your project root:

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Custom webpack configuration
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
    }),
  ],
};
```

#### 3. Update angular.json

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path": "./webpack.config.js"
            },
            "outputPath": "dist/your-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json"
          }
        },
        "serve": {
          "builder": "@angular-builders/custom-webpack:dev-server",
          "options": {
            "customWebpackConfig": {
              "path": "./webpack.config.js"
            }
          }
        }
      }
    }
  }
}
```

## Advanced Configuration Techniques

### Environment-Specific Configurations

#### 1. Multiple Webpack Configurations

Create separate configurations for different environments:

```javascript
// webpack.config.base.js
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
    },
  },
};

// webpack.config.dev.js
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    ...baseConfig.plugins || [],
    new webpack.HotModuleReplacementPlugin(),
  ],
};

// webpack.config.prod.js
const baseConfig = require('./webpack.config.base');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  ...baseConfig,
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    ...baseConfig.plugins || [],
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
```

#### 2. Dynamic Configuration Loading

```javascript
// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: argv.mode,
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src/app'),
      },
    },
    optimization: {
      splitChunks: isProduction ? {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      } : false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  };
};
```

### Custom Loaders and Plugins

#### 1. Custom Loader Example

```javascript
// custom-loaders/markdown-loader.js
module.exports = function(source) {
  // Transform markdown to HTML
  const marked = require('marked');
  const html = marked(source);
  
  return `
    export default ${JSON.stringify(html)};
  `;
};
```

#### 2. Custom Plugin Example

```javascript
// custom-plugins/version-plugin.js
class VersionPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  
  apply(compiler) {
    compiler.hooks.emit.tapAsync('VersionPlugin', (compilation, callback) => {
      const version = require('./package.json').version;
      const content = `export const VERSION = '${version}';`;
      
      compilation.assets['version.js'] = {
        source: () => content,
        size: () => content.length,
      };
      
      callback();
    });
  }
}

module.exports = VersionPlugin;
```

#### 3. Using Custom Loaders and Plugins

```javascript
// webpack.config.js
const path = require('path');
const VersionPlugin = require('./custom-plugins/version-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: path.resolve(__dirname, 'custom-loaders/markdown-loader.js'),
          },
        ],
      },
    ],
  },
  plugins: [
    new VersionPlugin(),
  ],
};
```

## Module Federation

Module Federation is one of the most powerful features of Webpack 5, enabling micro-frontend architectures.

### Setting Up Module Federation

#### 1. Install Module Federation Plugin

```bash
npm install --save-dev webpack webpack-cli
```

#### 2. Host Application Configuration

```javascript
// webpack.config.js (Host)
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 4200,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        mfe1: 'mfe1@http://localhost:4201/remoteEntry.js',
        mfe2: 'mfe2@http://localhost:4202/remoteEntry.js',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true },
      },
    }),
  ],
};
```

#### 3. Remote Application Configuration

```javascript
// webpack.config.js (Remote)
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 4201,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe1',
      filename: 'remoteEntry.js',
      exposes: {
        './Component': './src/app/mfe1.component.ts',
        './Module': './src/app/mfe1.module.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true },
      },
    }),
  ],
};
```

#### 4. Angular Service for Dynamic Loading

```typescript
// src/app/services/module-federation.service.ts
import { Injectable, Injector } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Injectable({
  providedIn: 'root'
})
export class ModuleFederationService {
  constructor(private injector: Injector) {}

  async loadRemoteComponent(remoteName: string, exposedModule: string) {
    try {
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: `${remoteName}/remoteEntry.js`,
        remoteName: remoteName,
        exposedModule: exposedModule,
      });
      
      return module;
    } catch (error) {
      console.error('Error loading remote module:', error);
      throw error;
    }
  }
}
```

#### 5. Dynamic Component Loading

```typescript
// src/app/components/dynamic-loader.component.ts
import { Component, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { ModuleFederationService } from '../services/module-federation.service';

@Component({
  selector: 'app-dynamic-loader',
  template: `
    <div>
      <button (click)="loadRemoteComponent('mfe1', './Component')">
        Load MFE1 Component
      </button>
      <button (click)="loadRemoteComponent('mfe2', './Component')">
        Load MFE2 Component
      </button>
      <div #dynamicComponent></div>
    </div>
  `,
})
export class DynamicLoaderComponent {
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) 
  dynamicComponent!: ViewContainerRef;
  
  private componentRef?: ComponentRef<any>;

  constructor(private moduleFederationService: ModuleFederationService) {}

  async loadRemoteComponent(remoteName: string, exposedModule: string) {
    try {
      // Clear existing component
      if (this.componentRef) {
        this.componentRef.destroy();
      }

      // Load remote module
      const module = await this.moduleFederationService.loadRemoteComponent(
        remoteName, 
        exposedModule
      );

      // Create component
      this.componentRef = this.dynamicComponent.createComponent(module.default);
      
    } catch (error) {
      console.error('Failed to load remote component:', error);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
```

### Advanced Module Federation Patterns

#### 1. Shared State Management

```typescript
// src/app/services/federated-state.service.ts
import { Injectable, BehaviorSubject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FederatedStateService {
  private stateSubject = new BehaviorSubject<any>({});
  
  get state$(): Observable<any> {
    return this.stateSubject.asObservable();
  }

  updateState(newState: any) {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...newState });
  }

  getState(): any {
    return this.stateSubject.value;
  }
}
```

#### 2. Federated Routing

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'mfe1',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'mfe1',
        exposedModule: './Module',
      }).then(m => m.Mfe1Module)
  },
  {
    path: 'mfe2',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        remoteName: 'mfe2',
        exposedModule: './Module',
      }).then(m => m.Mfe2Module)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Performance Optimization

### Bundle Analysis and Optimization

#### 1. Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};
```

#### 2. Advanced Code Splitting

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunks
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Angular specific chunks
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          chunks: 'all',
          priority: 20,
        },
        // Common chunks
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
};
```

#### 3. Tree Shaking Optimization

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "module": "es2020",
    "moduleResolution": "node",
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
  resolve: {
    alias: {
      'lodash': 'lodash-es',
    },
  },
};
```

### Caching Strategies

#### 1. Persistent Caching

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
  },
};
```

#### 2. Long-term Caching

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
};
```

## Code Splitting and Lazy Loading

### Advanced Lazy Loading Patterns

#### 1. Route-based Code Splitting

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { preload: true }
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    data: { preload: false }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

#### 2. Custom Preloading Strategy

```typescript
// src/app/services/custom-preloading-strategy.service.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}
```

#### 3. Dynamic Component Loading

```typescript
// src/app/components/dynamic-component-loader.component.ts
import { Component, ViewChild, ViewContainerRef, ComponentRef, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-component-loader',
  template: `<div #dynamicComponent></div>`,
})
export class DynamicComponentLoaderComponent {
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) 
  dynamicComponent!: ViewContainerRef;
  
  @Input() componentPath!: string;
  
  private componentRef?: ComponentRef<any>;

  async ngAfterViewInit() {
    if (this.componentPath) {
      await this.loadComponent();
    }
  }

  async ngOnChanges() {
    if (this.dynamicComponent && this.componentPath) {
      await this.loadComponent();
    }
  }

  private async loadComponent() {
    try {
      // Clear existing component
      if (this.componentRef) {
        this.componentRef.destroy();
      }

      // Dynamically import component
      const componentModule = await import(this.componentPath);
      const componentClass = componentModule.default;
      
      // Create component
      this.componentRef = this.dynamicComponent.createComponent(componentClass);
      
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
```

### Webpack Magic Comments for Advanced Splitting

```typescript
// Dynamic imports with webpack magic comments
const loadAdminModule = () => import(
  /* webpackChunkName: "admin" */
  /* webpackPrefetch: true */
  './admin/admin.module'
).then(m => m.AdminModule);

const loadDashboardModule = () => import(
  /* webpackChunkName: "dashboard" */
  /* webpackPreload: true */
  './dashboard/dashboard.module'
).then(m => m.DashboardModule);
```

## Asset Management

### Modern Asset Handling

#### 1. Asset Modules Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
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
};
```

#### 2. Advanced Image Optimization

```javascript
// webpack.config.js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          ['svgo', {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          }],
        ],
      },
    }),
  ],
};
```

#### 3. CSS and Style Optimization

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
```

## Development Tools Integration

### Hot Module Replacement (HMR)

#### 1. Angular HMR Setup

```bash
npm install --save-dev @angularclass/hmr
```

```typescript
// src/app/app.module.ts
import { NgModuleRef } from '@angular/core';
import { HmrState } from '@angularclass/hmr';

@NgModule({
  // ... your module configuration
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}

  hmrOnInit(store: HmrState) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data);
  }

  hmrOnDestroy(store: HmrState) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    store.disposeOldHosts = createNewHosts(cmpLocation);
    delete store.state;
    store.state = null;
  }

  hmrAfterDestroy(store: HmrState) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
```

#### 2. Webpack HMR Configuration

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true,
    liveReload: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

### Development Source Maps

```javascript
// webpack.config.js
module.exports = {
  devtool: 'eval-cheap-module-source-map', // Fast rebuilds
  // For production: 'source-map' or false
};
```

### Development Server Configuration

```javascript
// webpack.config.js
module.exports = {
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
  },
};
```

## Production Optimization

### Advanced Production Configuration

#### 1. Production Webpack Configuration

```javascript
// webpack.config.prod.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};
```

#### 2. Bundle Optimization

```javascript
// webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

### Service Worker Integration

```javascript
// webpack.config.js
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
      ],
    }),
  ],
};
```

## Troubleshooting Common Issues

### Common Webpack 5 Issues

#### 1. Module Federation Issues

```javascript
// Troubleshooting Module Federation
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // Use absolute URLs in development
        mfe1: process.env.NODE_ENV === 'development' 
          ? 'mfe1@http://localhost:4201/remoteEntry.js'
          : 'mfe1@https://your-cdn.com/mfe1/remoteEntry.js',
      },
      shared: {
        // Ensure singleton and strictVersion for Angular
        '@angular/core': { 
          singleton: true, 
          strictVersion: true,
          requiredVersion: '^15.0.0'
        },
        // Handle version mismatches gracefully
        'rxjs': { 
          singleton: true,
          strictVersion: false,
          version: '^7.5.0'
        },
      },
    }),
  ],
};
```

#### 2. Asset Loading Issues

```javascript
// Fix for asset path issues
module.exports = {
  output: {
    publicPath: process.env.NODE_ENV === 'production' 
      ? 'https://your-cdn.com/' 
      : '/',
  },
};
```

#### 3. Build Performance Issues

```javascript
// Optimize build performance
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};
```

### Angular-Specific Issues

#### 1. Ivy Compilation Issues

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "enableIvy": true,
    "strictTemplates": true,
    "strictInputAccessModifiers": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDomLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictDomEventTypes": true,
    "strictContextGenerics": true,
    "strictLiteralTypes": true
  }
}
```

#### 2. AOT Compilation Issues

```javascript
// webpack.config.js
module.exports = {
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
    ],
  },
};
```

## Best Practices

### 1. Configuration Organization

```
project/
├── webpack/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   ├── webpack.prod.js
│   └── webpack.analyze.js
├── custom-loaders/
├── custom-plugins/
└── webpack.config.js
```

### 2. Environment Variables

```javascript
// webpack.config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.ENVIRONMENT': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
```

### 3. Performance Monitoring

```javascript
// webpack.config.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // your webpack configuration
});
```

### 4. Bundle Size Monitoring

```json
// package.json
{
  "scripts": {
    "analyze": "webpack-bundle-analyzer dist/stats.json",
    "build:analyze": "webpack --config webpack.analyze.js"
  }
}
```

### 5. Security Considerations

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "util": false,
    },
  },
};
```

## Conclusion

This comprehensive guide covers the essential aspects of using Webpack 5 with Angular for complex tasks. From basic configuration to advanced features like Module Federation, the techniques outlined here will help you build scalable, performant Angular applications.

Key takeaways:
- Use custom webpack builders to extend Angular CLI functionality
- Implement Module Federation for micro-frontend architectures
- Optimize bundle sizes with advanced code splitting strategies
- Leverage persistent caching for faster development builds
- Monitor and analyze bundle performance regularly

Remember to always test your configurations thoroughly and keep up with the latest Angular and Webpack updates for the best results.



