# Webpack 5 with Angular - Setup Guide

This guide provides step-by-step instructions for setting up Webpack 5 with Angular for complex applications.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Angular CLI >= 17.0.0

## Step 1: Create New Angular Project

```bash
ng new my-webpack-app --routing --style=scss --skip-git
cd my-webpack-app
```

## Step 2: Install Required Dependencies

```bash
# Core webpack dependencies
npm install --save-dev webpack webpack-cli webpack-dev-server

# Angular webpack integration
npm install --save-dev @angular-builders/custom-webpack

# Module Federation (optional)
npm install --save-dev @module-federation/webpack @angular-architects/module-federation

# Performance optimization
npm install --save-dev webpack-bundle-analyzer compression-webpack-plugin brotli-webpack-plugin
npm install --save-dev clean-webpack-plugin mini-css-extract-plugin css-minimizer-webpack-plugin
npm install --save-dev terser-webpack-plugin speed-measure-webpack-plugin

# Loaders
npm install --save-dev css-loader style-loader sass-loader postcss-loader html-loader
npm install --save-dev image-webpack-loader image-minimizer-webpack-plugin

# PostCSS plugins
npm install --save-dev postcss autoprefixer cssnano

# Type definitions
npm install --save-dev @types/webpack @types/node

# Service Worker (optional)
npm install --save-dev workbox-webpack-plugin
```

## Step 3: Create Webpack Configuration Files

### 3.1 Base Configuration (`webpack.config.base.js`)

```javascript
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
    },
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
};
```

### 3.2 Development Configuration (`webpack.config.dev.js`)

```javascript
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 4200,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

### 3.3 Production Configuration (`webpack.config.prod.js`)

```javascript
const baseConfig = require('./webpack.config.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  ...baseConfig,
  mode: 'production',
  devtool: 'source-map',
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
```

## Step 4: Update angular.json

Replace the default builders with custom webpack builders:

```json
{
  "projects": {
    "my-webpack-app": {
      "architect": {
        "build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": {
              "path": "./webpack.config.prod.js"
            },
            "outputPath": "dist/my-webpack-app",
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
              "path": "./webpack.config.dev.js"
            }
          }
        }
      }
    }
  }
}
```

## Step 5: Update package.json Scripts

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "serve:prod": "ng serve --configuration production",
    "analyze": "npm run build:prod && npx webpack-bundle-analyzer dist/my-webpack-app/main*.js",
    "test": "ng test",
    "webpack:dev": "webpack --config webpack.config.dev.js",
    "webpack:prod": "webpack --config webpack.config.prod.js",
    "webpack:serve": "webpack serve --config webpack.config.dev.js"
  }
}
```

## Step 6: Create Environment-Specific Configurations

### 6.1 Development Environment (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  webpackMode: 'development',
};
```

### 6.2 Production Environment (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.myapp.com',
  webpackMode: 'production',
};
```

## Step 7: Module Federation Setup (Optional)

### 7.1 Host Application Configuration

```javascript
// webpack.config.host.js
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
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true },
      },
    }),
  ],
};
```

### 7.2 Remote Application Configuration

```javascript
// webpack.config.remote.js
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
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        'rxjs': { singleton: true },
      },
    }),
  ],
};
```

## Step 8: Performance Optimization Setup

### 8.1 Bundle Analysis Script

```javascript
// analyze-bundle.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./webpack.config.prod');

config.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    openAnalyzer: true,
  })
);

module.exports = config;
```

### 8.2 Performance Monitoring

```javascript
// webpack.config.perf.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const config = require('./webpack.config.prod');
module.exports = smp.wrap(config);
```

## Step 9: Testing the Setup

### 9.1 Development Server

```bash
npm run start
# or
npm run webpack:serve
```

### 9.2 Production Build

```bash
npm run build:prod
# or
npm run webpack:prod
```

### 9.3 Bundle Analysis

```bash
npm run analyze
```

## Step 10: Advanced Features

### 10.1 Custom Loaders

Create custom loaders in `custom-loaders/` directory:

```javascript
// custom-loaders/markdown-loader.js
module.exports = function(source) {
  const marked = require('marked');
  const html = marked(source);
  return `export default ${JSON.stringify(html)};`;
};
```

### 10.2 Custom Plugins

Create custom plugins in `custom-plugins/` directory:

```javascript
// custom-plugins/version-plugin.js
class VersionPlugin {
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

## Troubleshooting

### Common Issues

1. **Module not found errors**: Check alias configurations in webpack config
2. **Build performance issues**: Enable caching and use appropriate devtool
3. **Bundle size too large**: Implement code splitting and tree shaking
4. **HMR not working**: Ensure HotModuleReplacementPlugin is configured

### Debug Commands

```bash
# Debug webpack configuration
npx webpack --config webpack.config.dev.js --verbose

# Check bundle contents
npx webpack-bundle-analyzer dist/stats.json

# Profile build performance
npm run webpack:prod -- --profile --json > stats.json
```

## Next Steps

1. Implement Module Federation for micro-frontends
2. Set up advanced caching strategies
3. Configure Service Workers for offline support
4. Implement custom optimization plugins
5. Set up CI/CD with webpack optimizations

## Resources

- [Webpack 5 Documentation](https://webpack.js.org/)
- [Angular CLI Custom Webpack](https://github.com/just-jeb/angular-builders)
- [Module Federation Guide](https://webpack.js.org/concepts/module-federation/)
- [Angular Performance Guide](https://angular.io/guide/performance-checklist)



