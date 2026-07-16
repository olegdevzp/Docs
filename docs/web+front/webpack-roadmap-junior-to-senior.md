# Webpack — Junior to Senior Roadmap

A learning roadmap of **Webpack** concepts, configuration, and features organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Installation and basic setup](#l1-installation-and-basic-setup)
  - [Entry and output](#l1-entry-and-output)
  - [Loaders — basics](#l1-loaders--basics)
  - [Plugins — basics](#l1-plugins--basics)
  - [Mode and environment](#l1-mode-and-environment)
  - [Dev server](#l1-dev-server)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Asset modules](#l2-asset-modules)
  - [Loaders — intermediate](#l2-loaders--intermediate)
  - [Code splitting](#l2-code-splitting)
  - [Tree shaking](#l2-tree-shaking)
  - [Source maps](#l2-source-maps)
  - [Caching and content hashing](#l2-caching-and-content-hashing)
  - [Resolve configuration](#l2-resolve-configuration)
  - [Environment variables and DefinePlugin](#l2-environment-variables-and-defineplugin)
  - [Multiple configs and targets](#l2-multiple-configs-and-targets)
- [Level 3 — Senior](#level-3--senior)
  - [Module Federation](#l3-module-federation)
  - [Custom loaders](#l3-custom-loaders)
  - [Custom plugins](#l3-custom-plugins)
  - [Build performance optimization](#l3-build-performance-optimization)
  - [Bundle analysis and profiling](#l3-bundle-analysis-and-profiling)
  - [Persistent caching](#l3-persistent-caching)
  - [Advanced code splitting](#l3-advanced-code-splitting)
  - [Security and supply chain](#l3-security-and-supply-chain)
  - [CI/CD integration](#l3-cicd-integration)
  - [Webpack internals and the compilation lifecycle](#l3-webpack-internals-and-the-compilation-lifecycle)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Items marked with `*` are the most commonly encountered in day-to-day work.
- Framework-specific CLIs (Create React App, Next.js, Vue CLI, Vite) are explicitly excluded — this roadmap focuses on raw Webpack configuration.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single line of config.

| Term | What it is |
|---|---|
| **Bundle** | A single output file (or a few) that combines many source modules into one deliverable for the browser. |
| **Module** | Any file Webpack can process — JS, CSS, images, fonts, JSON, etc. Everything is a module. |
| **Entry point** | The file(s) Webpack starts from when building its dependency graph. |
| **Output** | Where and how Webpack writes the finished bundles to disk. |
| **Loader** | A transformer that converts a non-JS file (e.g., CSS, TypeScript, images) into a module Webpack understands. |
| **Plugin** | An object that hooks into the Webpack compiler lifecycle to do things loaders cannot — HTML generation, env injection, bundle analysis, etc. |
| **Dependency graph** | The tree of `import`/`require` relationships Webpack resolves starting from the entry point(s). |
| **Chunk** | A piece of the bundle. Webpack can split output into multiple chunks for lazy loading or caching. |
| **Mode** | A built-in Webpack switch (`development` \| `production` \| `none`) that toggles dozens of defaults. |
| **webpack.config.js** | The configuration file Webpack reads by default when you run the CLI. |

> **Gotcha:** Webpack only understands JavaScript and JSON natively. Any other file type requires a loader. Forgetting this is the most common source of "You may need an appropriate loader" errors.

---

### L1 Installation and basic setup

```bash
# install Webpack and its CLI (always both)
npm install --save-dev webpack webpack-cli

# run a one-off build
npx webpack

# run with a named config file
npx webpack --config webpack.prod.js
```

Minimal `webpack.config.js`:

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

> **Gotcha:** Always use `path.resolve(__dirname, 'dist')` for the `output.path`. Relative strings will cause subtle issues depending on where you run the CLI.

---

### L1 Entry and output

| Config key | What it controls |
|---|---|
| `entry` | One or many starting modules. Can be a string, array, or object. |
| `output.filename` | Name of the main bundle file. Supports substitutions like `[name]`, `[contenthash]`. |
| `output.path` | Absolute path to the output directory. |
| `output.publicPath` | URL prefix prepended to every asset URL in the HTML/CSS. Critical for CDN deployments. |
| `output.clean` | Set to `true` to wipe the output folder before each build (replaces `CleanWebpackPlugin`). |

```js
module.exports = {
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
};
```

> **Gotcha:** When using multiple entry points, `output.filename` must include `[name]` otherwise both chunks overwrite the same file.

---

### L1 Loaders — basics

Loaders are applied **right-to-left** (or bottom-to-top in array form) under `module.rules`.

```js
module.exports = {
  module: {
    rules: [
      // JavaScript with Babel *
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // CSS *
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // css-loader first, then style-loader
      },
    ],
  },
};
```

| Loader | What it does |
|---|---|
| **babel-loader** `*` | Transpiles modern JS/JSX via Babel. |
| **css-loader** `*` | Resolves `@import` and `url()` in CSS files. |
| **style-loader** `*` | Injects processed CSS into the DOM via `<style>` tags (dev only). |
| **ts-loader** | Compiles TypeScript. |
| **sass-loader** | Compiles Sass/SCSS to CSS (needs `sass` package too). |
| **file-loader** | Copies files to output and returns the URL (superseded by Asset Modules in Webpack 5). |

> **Gotcha:** `style-loader` and `css-loader` must appear in the correct order: `['style-loader', 'css-loader']`. Reversing them is one of the most frequent config mistakes.

---

### L1 Plugins — basics

Plugins receive the whole compiler; they can do anything a loader cannot.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    // generates dist/index.html and injects <script> tags automatically *
    new HtmlWebpackPlugin({ template: './src/index.html' }),

    // extracts CSS into separate files instead of injecting via style-loader
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],
};
```

| Plugin | What it does |
|---|---|
| **HtmlWebpackPlugin** `*` | Creates an HTML file in `dist/` and auto-injects bundle `<script>` tags. |
| **MiniCssExtractPlugin** `*` | Emits CSS as separate `.css` files (use in production instead of `style-loader`). |
| **DefinePlugin** | Replaces tokens in source code at compile time (e.g., `process.env.NODE_ENV`). |
| **CopyWebpackPlugin** | Copies static files to `dist/` without bundling them. |
| **ESLintWebpackPlugin** | Runs ESLint as part of the build. |

---

### L1 Mode and environment

```js
module.exports = {
  mode: 'development', // 'production' | 'development' | 'none'
};
```

| Mode | What it enables automatically |
|---|---|
| `development` | Readable output, fast rebuilds, `eval` source maps, no minification. |
| `production` | Minification (Terser), scope hoisting, tree shaking, content-hashed filenames. |
| `none` | No defaults applied — useful for debugging Webpack's own behavior. |

```bash
# override mode from the CLI without editing the config
npx webpack --mode production
```

> **Gotcha:** Forgetting to set `mode: 'production'` in your build pipeline is a very common source of bloated bundles in deployed apps.

---

### L1 Dev server

```bash
npm install --save-dev webpack-dev-server
```

```js
module.exports = {
  devServer: {
    static: './dist',   // serve files from dist/
    port: 3000,
    open: true,         // open browser on start
    hot: true,          // Hot Module Replacement
    historyApiFallback: true, // SPA routing: serve index.html for 404s
  },
};
```

```bash
npx webpack serve
```

| Option | What it does |
|---|---|
| `hot` `*` | Enables Hot Module Replacement — updates modules in the browser without a full reload. |
| `historyApiFallback` `*` | Required for client-side routing (React Router, Vue Router). |
| `proxy` | Forwards API requests to a backend server to avoid CORS issues in dev. |
| `https` | Runs the dev server with a self-signed cert (needed for secure context APIs). |

> **Gotcha:** The dev server serves bundles **from memory**, not from `dist/`. Files in `dist/` are not updated during development unless you run a separate build.

---

## Level 2 — Mid-level

### L2 Asset modules

Webpack 5 replaced `file-loader`, `url-loader`, and `raw-loader` with native **Asset Modules**. No extra packages needed.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',             // auto: inline if < 8 KB, else emit file
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',    // always emit as a separate file
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',      // always inline as base64 data URL
      },
      {
        test: /\.txt$/,
        type: 'asset/source',      // export raw file contents as a string
      },
    ],
  },
};
```

| Type | Behavior |
|---|---|
| `asset/resource` | Emits a file; exports the URL. Equivalent to `file-loader`. |
| `asset/inline` | Inlines as base64 data URL. Equivalent to `url-loader` with no size limit. |
| `asset/source` | Exports the raw source as a string. Equivalent to `raw-loader`. |
| `asset` | Automatically chooses between `resource` and `inline` based on a size threshold (default 8 KB). |

---

### L2 Loaders — intermediate

| Loader | When to use it |
|---|---|
| **postcss-loader** | Runs PostCSS plugins (autoprefixer, CSS Modules, nesting) on CSS files. |
| **MiniCssExtractPlugin.loader** | Use instead of `style-loader` in production to emit separate `.css` files. |
| **thread-loader** | Runs heavy loaders (Babel, TypeScript) in a worker pool for faster builds. |
| **cache-loader** | Caches loader results to disk (largely replaced by Webpack 5 persistent cache). |
| **svg-react-loader / @svgr/webpack** | Transforms SVG files into React components. |

PostCSS chain example:

```js
{
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader, // production
    { loader: 'css-loader', options: { modules: true } }, // CSS Modules
    'postcss-loader',
  ],
}
```

---

### L2 Code splitting

Split your bundle so the browser only downloads what it needs for the current page.

**1. Entry-point splitting** — multiple entry points produce multiple initial chunks (see L1 entry/output).

**2. Dynamic imports** — split at runtime with `import()`:

```js
// route-based splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));

// manual splitting
button.addEventListener('click', async () => {
  const { heavyLib } = await import('./heavyLib');
  heavyLib.run();
});
```

**3. SplitChunksPlugin** — automatic vendor and shared chunk extraction:

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',        // split async AND sync chunks *
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

> **Gotcha:** Dynamic `import()` requires `@babel/plugin-syntax-dynamic-import` in your Babel config (or it's included automatically with `@babel/preset-env` targeting modern browsers).

---

### L2 Tree shaking

Removes dead (unused) code from the final bundle.

Requirements:
1. Use ES module syntax (`import`/`export`) — CommonJS (`require`) is **not** tree-shakeable.
2. Set `mode: 'production'` (enables Terser which performs DCE).
3. Mark the package as side-effect-free if applicable.

```json
// package.json — tell Webpack your package has no side effects
{
  "sideEffects": false
}
```

```json
// or allowlist files that DO have side effects (e.g., global CSS)
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

> **Gotcha:** Many CSS-in-JS libraries and CSS imports are side-effectful. Setting `"sideEffects": false` globally without whitelisting CSS will cause styles to disappear in production.

---

### L2 Source maps

Control how Webpack maps output code back to your original source.

```js
module.exports = {
  devtool: 'eval-cheap-module-source-map', // fast, good for development
  // devtool: 'source-map',               // full, separate .map files for production
  // devtool: false,                       // no source maps (fastest production build)
};
```

| `devtool` value | Build speed | Quality | Use case |
|---|---|---|---|
| `eval` | Fastest | Transformed | Dev — fastest rebuilds |
| `eval-cheap-module-source-map` `*` | Fast | Original lines | Dev — recommended default |
| `source-map` `*` | Slow | Original | Prod — best quality, external `.map` files |
| `hidden-source-map` | Slow | Original | Prod — maps exist but not referenced in bundle (for error monitoring services) |
| `nosources-source-map` | Slow | Stack traces only | Prod — no source exposure in browser |
| `false` | Fastest | None | Prod — smallest bundle, no debugging |

> **Gotcha:** Never ship `eval-*` source maps to production — they bundle your original source code into the output.

---

### L2 Caching and content hashing

Make browsers cache bundles long-term while forcing re-download only when content changes.

```js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  optimization: {
    // extract Webpack runtime into its own tiny chunk
    // prevents vendor hash changing when only app code changes
    runtimeChunk: 'single',
    moduleIds: 'deterministic', // stable module IDs across builds
  },
};
```

| Substitution | Value |
|---|---|
| `[name]` | Chunk name (from entry key or dynamic import `/* webpackChunkName */`). |
| `[contenthash]` `*` | Hash of the chunk's content. Changes only when the file changes. |
| `[chunkhash]` | Hash of the whole chunk graph (less precise than `contenthash`). |
| `[hash]` | Hash of the entire build — changes on every build. Avoid for long-term caching. |

> **Gotcha:** Without `runtimeChunk: 'single'`, Webpack embeds its runtime into every entry chunk. This causes the vendor hash to change even when only app code changes.

---

### L2 Resolve configuration

Control how Webpack resolves module paths.

```js
module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], // try these extensions in order *
    alias: {
      '@components': path.resolve(__dirname, 'src/components'), // short import paths *
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
    modules: ['node_modules', 'src'], // look in src/ before node_modules
  },
};
```

| Option | What it does |
|---|---|
| `extensions` | Auto-appended extensions when importing without one. |
| `alias` `*` | Replaces import prefixes with absolute paths. Avoids `../../` hell. |
| `modules` | Directories Webpack searches for modules. |
| `mainFields` | Which `package.json` field to use as the module entry (`browser`, `module`, `main`). |
| `symlinks` | Set to `false` to improve performance when using `npm link` or monorepos. |

---

### L2 Environment variables and DefinePlugin

```js
const { DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      __DEV__: process.env.NODE_ENV !== 'production',
    }),
  ],
};
```

```bash
# pass env vars at build time
API_URL=https://api.example.com npx webpack --mode production
```

> **Gotcha:** `DefinePlugin` does a **literal text replacement** before parsing. Always wrap string values with `JSON.stringify()`, otherwise `'production'` becomes the identifier `production` (a syntax error).

---

### L2 Multiple configs and targets

```js
// webpack.config.js — export an array for multiple builds
module.exports = [
  { ...commonConfig, target: 'web', output: { filename: 'client.js' } },
  { ...commonConfig, target: 'node', output: { filename: 'server.js' } },
];
```

```js
// or export a function to receive env and argv
module.exports = (env, argv) => ({
  mode: argv.mode,
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
});
```

```bash
npx webpack --env production --env apiUrl=https://api.example.com
```

---

## Level 3 — Senior

### L3 Module Federation

**Module Federation** (Webpack 5) allows multiple separate Webpack builds to share code at runtime — the foundation of micro-frontend architectures.

```js
// app-shell/webpack.config.js — host
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        checkout: 'checkout@https://checkout.example.com/remoteEntry.js',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
```

```js
// checkout/webpack.config.js — remote
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './CheckoutPage': './src/CheckoutPage',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
```

| Concept | What it means |
|---|---|
| **Host** | The app that consumes remote modules at runtime. |
| **Remote** | The app that exposes modules via a `remoteEntry.js` manifest. |
| **Shared** | Packages that should be deduplicated across host and remotes (e.g., React). |
| **singleton** | Enforce that only one version of a shared package is loaded. Critical for React. |
| **eager** | Load the shared module eagerly (synchronously) instead of lazily. |

> **Gotcha:** Every federated module is loaded asynchronously. Your entry point must be an async bootstrap file (wrap `import('./bootstrap')` in `index.js`) otherwise shared modules will fail to initialize.

---

### L3 Custom loaders

A loader is a Node.js module that exports a function. Webpack calls it with the raw source string.

```js
// loaders/strip-console-loader.js
module.exports = function (source) {
  // `this` is the Webpack loader context
  const result = source.replace(/console\.\w+\(.*?\);?/g, '');
  return result;
};

// async loader example
module.exports = function (source) {
  const callback = this.async();
  doAsyncTransform(source).then(result => callback(null, result));
};
```

```js
// webpack.config.js — register local loader
module.exports = {
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  module: {
    rules: [{ test: /\.js$/, use: 'strip-console-loader' }],
  },
};
```

Loader context APIs to know:

| API | Purpose |
|---|---|
| `this.async()` | Switch to async mode; returns a `callback(err, result)`. |
| `this.emitFile(name, content)` | Emit an additional output file from a loader. |
| `this.addDependency(path)` | Tell Webpack to watch an extra file for changes. |
| `this.getOptions(schema)` | Retrieve and validate loader options (Webpack 5+). |
| `this.cacheable(false)` | Opt out of loader result caching. |

---

### L3 Custom plugins

A plugin is a class with an `apply(compiler)` method. Hooks into the compilation lifecycle via Tapable.

```js
class BuildTimestampPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('BuildTimestampPlugin', (compilation, callback) => {
      const timestamp = new Date().toISOString();
      compilation.assets['build-info.json'] = {
        source: () => JSON.stringify({ builtAt: timestamp }),
        size: () => JSON.stringify({ builtAt: timestamp }).length,
      };
      callback();
    });
  }
}

module.exports = { BuildTimestampPlugin };
```

Key compiler and compilation hooks:

| Hook | Stage | Use case |
|---|---|---|
| `compiler.hooks.environment` | Before config read | Modify environment |
| `compiler.hooks.compile` | Build starts | Notify CI, start timers |
| `compiler.hooks.emit` | Before writing to disk | Add/modify output assets |
| `compiler.hooks.afterEmit` | After writing to disk | Copy files, notify services |
| `compiler.hooks.done` | Build complete | Report stats, send Slack alerts |
| `compilation.hooks.optimizeModules` | Optimization phase | Custom module transforms |
| `compilation.hooks.buildModule` | Before each module is built | Instrument or skip modules |

| Tap type | When to use |
|---|---|
| `.tap()` | Synchronous hook |
| `.tapAsync()` | Async hook with Node.js callback |
| `.tapPromise()` | Async hook returning a Promise |

---

### L3 Build performance optimization

Slow builds kill developer productivity. Measure before optimizing.

```bash
# measure build time by phase
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json
```

| Technique | Impact | How |
|---|---|---|
| **Persistent cache** | Very high | `cache: { type: 'filesystem' }` (see L3 persistent caching) |
| **thread-loader** | High (large codebases) | Wrap `babel-loader` or `ts-loader` in `thread-loader` |
| **Narrow `include`** | High | Add `include: path.resolve(__dirname, 'src')` to every rule |
| **`resolve.symlinks: false`** | Medium | Disables symlink resolution — speeds up monorepos |
| **DLL plugin** | Medium (legacy) | Pre-compile stable vendor code (largely replaced by persistent cache) |
| **`experiments.lazyCompilation`** | High (dev only) | Only compile routes when first navigated to |
| **`stats: 'errors-only'`** | Low | Reduce terminal noise, slightly faster logging |

```js
module.exports = {
  cache: { type: 'filesystem' },
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: path.resolve(__dirname, 'src'),
      use: ['thread-loader', 'babel-loader'],
    }],
  },
  experiments: {
    lazyCompilation: process.env.NODE_ENV === 'development',
  },
};
```

---

### L3 Bundle analysis and profiling

Always analyze your bundle before shipping to production.

```bash
npm install --save-dev webpack-bundle-analyzer
```

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
};
```

```bash
ANALYZE=true npx webpack --mode production
```

Other tools:

| Tool | What it shows |
|---|---|
| **webpack-bundle-analyzer** `*` | Interactive treemap of every module and its size. |
| **source-map-explorer** | Similar to analyzer but works from the `.map` file. |
| `webpack --profile --json > stats.json` | Raw stats for upload to [webpack.jakoblind.no](https://webpack.jakoblind.no/optimize/) or [statoscope.tech](https://statoscope.tech). |
| **Statoscope** | Deep diff between two builds — spots regressions. |
| `stats.chunks` in output | See which modules landed in which chunks. |

What to look for:

- Duplicate packages at different versions (especially `lodash`, `moment`, `react`).
- Unexpectedly large dependencies — consider lazy-loading or lighter alternatives.
- Source maps or test files accidentally included in the production bundle.
- All code in a single chunk — hints that code splitting is not configured.

---

### L3 Persistent caching

Webpack 5's filesystem cache dramatically speeds up cold and warm builds.

```js
module.exports = {
  cache: {
    type: 'filesystem',                          // persist to disk
    buildDependencies: {
      config: [__filename],                      // invalidate cache when webpack.config.js changes
    },
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    version: '1.0',                              // bump to manually invalidate
  },
};
```

| Option | What it controls |
|---|---|
| `type` | `'memory'` (default) or `'filesystem'`. |
| `buildDependencies.config` | Files that, when changed, invalidate the entire cache. Always include your config files. |
| `cacheDirectory` | Where cache files are written. Default: `node_modules/.cache/webpack`. |
| `version` | A string; change it to force full cache invalidation without deleting files. |
| `maxAge` | How long unused cache entries survive (default: 2 weeks). |

> **Gotcha:** In CI, cache the `cacheDirectory` between pipeline runs to get the full benefit. Without this, the cache is rebuilt from scratch on every CI run.

---

### L3 Advanced code splitting

Go beyond basic `splitChunks` to achieve granular chunk control.

```js
// named chunks with dynamic import
const UserDashboard = () => import(
  /* webpackChunkName: "dashboard" */
  /* webpackPrefetch: true */        // browser fetches in idle time
  './pages/UserDashboard'
);

const HeavyChart = () => import(
  /* webpackChunkName: "charts" */
  /* webpackPreload: true */         // browser fetches in parallel with parent
  './components/HeavyChart'
);
```

```js
// granular splitChunks for large apps
optimization: {
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 30,
    maxAsyncRequests: 30,
    minSize: 20_000,
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react-vendor',
        chunks: 'all',
        priority: 20,
      },
      commons: {
        name: 'commons',
        minChunks: 2,        // only split if used in 2+ chunks
        priority: 10,
        reuseExistingChunk: true,
      },
    },
  },
}
```

| Magic comment | What it does |
|---|---|
| `webpackChunkName` | Names the generated chunk file. |
| `webpackPrefetch` | Hints browser to fetch chunk during idle time (future navigation). |
| `webpackPreload` | Hints browser to fetch chunk in parallel with the current chunk (imminent need). |
| `webpackLazy` | (Default) Load the chunk only when the import is called. |
| `webpackEager` | Include the module in the current chunk — no splitting. |

---

### L3 Security and supply chain

| Practice | How |
|---|---|
| **Subresource Integrity (SRI)** | Use `webpack-subresource-integrity` plugin to add `integrity` attributes to `<script>` and `<link>` tags. |
| **Content Security Policy** | Emit a CSP nonce via `HtmlWebpackPlugin` and use `output.crossOriginLoading: 'anonymous'`. |
| **Lock dependency versions** | Use `package-lock.json` or `yarn.lock`; audit with `npm audit`. |
| **No source exposure** | Use `devtool: 'hidden-source-map'` or `'nosources-source-map'` in production. |
| **Secrets never in bundles** | Never put API keys in source. Use runtime env injection or a secrets manager. |
| **Analyze third-party chunks** | Regularly inspect vendor bundles for unexpected packages introduced by transitive deps. |

---

### L3 CI/CD integration

```yaml
# GitHub Actions example
- name: Cache Webpack build
  uses: actions/cache@v4
  with:
    path: .webpack-cache
    key: webpack-${{ hashFiles('webpack.config.js', 'package-lock.json') }}

- name: Build
  run: npx webpack --mode production

- name: Analyze bundle size
  run: npx bundlesize  # fail CI if chunks exceed configured limits
```

```json
// bundlesize config in package.json
{
  "bundlesize": [
    { "path": "./dist/main.*.js", "maxSize": "200 kB" },
    { "path": "./dist/vendors.*.js", "maxSize": "500 kB" }
  ]
}
```

| Tool / practice | Purpose |
|---|---|
| **bundlesize / size-limit** | Fail CI when bundle grows beyond a threshold. |
| **Statoscope** | Diff bundle stats between the base branch and PR branch. |
| **Webpack `--bail`** | Stop the build on the first error (recommended for CI). |
| **`--no-color`** | Disable ANSI codes in CI logs for cleaner output. |
| **`stats: 'errors-warnings'`** | Only print errors and warnings — reduces CI log noise. |

---

### L3 Webpack internals and the compilation lifecycle

Understanding Webpack's internals lets you debug complex issues and contribute custom tooling.

| Concept | What it is |
|---|---|
| **Tapable** | The event/hook system Webpack is built on. Plugins and loaders tap into hooks to extend behavior. |
| **Compiler** | The top-level object representing a configured Webpack environment. Lives for the process lifetime. |
| **Compilation** | Created per build (and per watch rebuild). Holds modules, chunks, assets, and errors. |
| **NormalModule** | Represents a single processed source file in the module graph. |
| **ChunkGraph** | Data structure mapping modules → chunks → entry points. |
| **Resolver** | The sub-system that turns `import` strings into absolute file paths (enhanced-resolve). |
| **Parser** | Webpack's JS parser (acorn-based) that finds `import`, `require`, `define` calls. |
| **Template** | The code generator that produces the final bundle wrapper (IIFE, ESM, etc.). |

Build lifecycle (simplified):

```
initialize → make (resolve & build modules) → seal (assign chunks) → emit (write to disk)
```

```js
// reading compilation stats programmatically
const webpack = require('webpack');
const config = require('./webpack.config');

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(stats.toString({ colors: true }));
    process.exit(1);
  }
  console.log(stats.toString({ assets: true, chunks: false }));
});
```

> **Gotcha:** Never call `compiler.run()` inside a plugin's `apply()` method — it creates a new compilation and causes infinite recursion. Tap hooks instead.

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Core concepts** | Entry, output, loader, plugin, mode, chunk | Asset Modules, code splitting, tree shaking | Module Federation, custom loaders/plugins, Tapable |
| **Configuration** | Basic `webpack.config.js`, mode | Multiple configs, env functions, targets | Programmatic API, config factories, inheritance patterns |
| **Loaders** | babel-loader, css-loader, style-loader | postcss-loader, thread-loader, MiniCssExtractPlugin.loader | Custom loader authoring, loader context API |
| **Plugins** | HtmlWebpackPlugin, MiniCssExtractPlugin, DefinePlugin | SplitChunksPlugin, BundleAnalyzerPlugin, CopyPlugin | Custom plugin authoring, compiler/compilation hooks |
| **Performance** | `mode: 'production'` | Source maps, content hashing, runtimeChunk | Persistent cache, thread-loader, lazy compilation, bundle analysis |
| **Code splitting** | None / basic entry splitting | Dynamic `import()`, SplitChunksPlugin | Magic comments (prefetch/preload), granular cacheGroups |
| **Dev experience** | webpack-dev-server, HMR | Proxy, `historyApiFallback`, path aliases | Lazy compilation, custom middleware, overlay errors |
| **Security** | — | No source map exposure in prod | SRI, CSP nonces, supply chain auditing |
| **CI/CD** | `npm run build` | `--bail`, `--mode production` | Bundle size gates, stats diffing, cache across runs |
| **Internals** | — | Stats output, `--profile` | Compiler/Compilation lifecycle, Tapable hooks, Resolver |
