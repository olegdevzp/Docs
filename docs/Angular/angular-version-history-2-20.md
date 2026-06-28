# Comprehensive Angular Version History: Angular 2-20

## Table of Contents

1. [Angular 2 (September 2016)](#angular-2-september-2016)
2. [Angular 4 (March 2017)](#angular-4-march-2017)
3. [Angular 5 (November 2017)](#angular-5-november-2017)
4. [Angular 6 (May 2018)](#angular-6-may-2018)
5. [Angular 7 (October 2018)](#angular-7-october-2018)
6. [Angular 8 (May 2019)](#angular-8-may-2019)
7. [Angular 9 (February 2020)](#angular-9-february-2020)
8. [Angular 10 (June 2020)](#angular-10-june-2020)
9. [Angular 11 (November 2020)](#angular-11-november-2020)
10. [Angular 12 (May 2021)](#angular-12-may-2021)
11. [Angular 13 (November 2021)](#angular-13-november-2021)
12. [Angular 14 (June 2022)](#angular-14-june-2022)
13. [Angular 15 (November 2022)](#angular-15-november-2022)
14. [Angular 16 (May 2023)](#angular-16-may-2023)
15. [Angular 17 (November 2023)](#angular-17-november-2023)
16. [Angular 18 (May 2024)](#angular-18-may-2024)
17. [Angular 19 (November 2024)](#angular-19-november-2024)
18. [Angular 20 (Expected May 2025)](#angular-20-expected-may-2025)

---

## Angular 2 (September 2016)

### Major Features Added

#### Core Architecture
- **Complete rewrite from AngularJS (1.x)** - Built from the ground up using TypeScript
- **Component-based architecture** - Move away from controllers and scope to components
- **Zone.js integration** - Automatic change detection tracking
- **Dependency Injection (DI) system** - Hierarchical injector system
- **Decorators** - `@Component`, `@Directive`, `@Injectable`, `@NgModule`, `@Input`, `@Output`

#### Modules & Components
- **NgModules** - Modular system for organizing application
- **Component lifecycle hooks** - `ngOnInit`, `ngOnDestroy`, `ngOnChanges`, etc.
- **ViewChild & ContentChild** - Query and access child components/elements
- **Template reference variables** - `#variable` syntax
- **Local template variables** - `let` keyword in templates

#### Templating
- **Property binding** - `[property]="value"`
- **Event binding** - `(event)="handler()"`
- **Two-way binding** - `[(ngModel)]="property"`
- **Structural directives** - `*ngIf`, `*ngFor`, `*ngSwitch`
- **Attribute directives** - `ngClass`, `ngStyle`
- **Template expressions** - Interpolation with `{{ }}`
- **Safe navigation operator** - `?.` for null-safe property access
- **Pipes** - Built-in: `date`, `uppercase`, `lowercase`, `currency`, `async`, etc.

#### Forms
- **Template-driven forms** - Form handling with `ngModel`
- **Reactive forms (Model-driven)** - `FormControl`, `FormGroup`, `FormBuilder`
- **Form validation** - Built-in validators and custom validators
- **Form states** - `pristine`, `dirty`, `touched`, `untouched`, `valid`, `invalid`

#### Routing
- **Angular Router** - Component-based routing
- **Route guards** - `CanActivate`, `CanDeactivate`, `Resolve`, `CanLoad`
- **Lazy loading** - Load modules on demand
- **Child routes** - Nested routing support
- **Route parameters** - Dynamic route segments
- **Query parameters** - URL query string handling
- **Router outlets** - `<router-outlet>` for rendering routed components
- **Router events** - Navigation lifecycle events

#### HTTP
- **HTTP module** - `@angular/http` for making HTTP requests
- **Observable-based HTTP** - Using RxJS Observables
- **HTTP interceptors** - Request/response interception (added in 2.3)

#### Testing
- **TestBed** - Testing utility for configuring and initializing environment
- **Jasmine & Karma** - Default testing framework and test runner
- **Component testing** - `ComponentFixture` for testing components
- **Service testing** - Dependency injection testing
- **Async testing utilities** - `async`, `fakeAsync`, `tick`

#### Performance
- **Ahead-of-Time (AOT) compilation** - Compile templates during build
- **Tree shaking** - Remove unused code
- **Lazy loading support** - Load modules on demand
- **Change detection strategy** - `OnPush` for optimized change detection

#### Additional Features
- **Animations** - `@angular/animations` (initially `@angular/core`)
- **Internationalization (i18n)** - Built-in i18n support
- **Server-Side Rendering (SSR)** - Angular Universal for pre-rendering
- **RxJS integration** - Reactive programming with Observables
- **TypeScript support** - First-class TypeScript support
- **CLI (Angular CLI)** - Command-line interface for scaffolding and building

### Removed Features (from AngularJS 1.x)
- **$scope** - Replaced with component properties
- **Controllers** - Replaced with component classes
- **DDO (Directive Definition Object)** - Replaced with decorator-based directives
- **$http** - Replaced with new HTTP module
- **Promises** - Replaced with Observables (RxJS)
- **angular.module()** - Replaced with `@NgModule`
- **$watch** - Replaced with Zone.js automatic change detection
- **Two-way data binding by default** - Now explicit with `[(ngModel)]`
- **jqLite** - No built-in DOM manipulation library

---

## Angular 4 (March 2017)

**Note:** Angular 3 was skipped to align router versioning.

### Features Added

#### Core Improvements
- **Smaller & faster** - Reduced bundle sizes by hundreds of KB
- **View Engine improvements** - Faster rendering and smaller generated code
- **Animation package** - Moved to `@angular/animations` (separate package)
- **TypeScript 2.1+ support** - Better type inference and strictness

#### Templates
- **`as` keyword in templates** - Local template variables: `*ngIf="observable$ | async as value"`
- **Email validator** - Built-in email validation for forms
- **Titlecase pipe** - New built-in pipe for title casing strings

#### Forms
- **`updateOn` option** - Control when form validation runs (`change`, `blur`, `submit`)
- **Improved form validation** - Better validator composition

#### Router
- **`ParamMap`** - Type-safe way to access route parameters
- **`CanDeactivate` improvements** - Better guard interface

#### HTTP
- **Search parameter improvements** - Better URL parameter handling

#### Animations
- **`@angular/platform-browser/animations`** - New animation module structure
- **Animation query improvements** - Better animation control

#### Internationalization
- **Improved i18n** - Better translation support and tools

#### Other
- **Universal improvements** - Better server-side rendering support
- **Source maps** - Improved debugging with source maps

### Deprecated
- **`OpaqueToken`** - Deprecated in favor of `InjectionToken`
- **Old HTTP module** - `@angular/http` deprecated (removed later)
- **Template `<template>` tag** - Deprecated in favor of `<ng-template>`

---

## Angular 5 (November 2017)

### Features Added

#### Build & Performance
- **Build optimizer** - Further reduce bundle sizes
- **Angular Universal State Transfer API** - Transfer state from server to client
- **Improved AOT compilation** - Faster builds
- **Incremental compilation** - Faster rebuilds during development
- **Preserve whitespace flag** - `preserveWhitespaces: false` to remove unnecessary whitespace

#### Compiler
- **Compiler improvements** - Faster compilation times
- **Lambda support in decorators** - Better decorator support
- **Watch mode improvements** - Better incremental compilation

#### Forms
- **`updateOn` for FormGroup/FormArray** - Extended form update control
- **Better form validation messages** - Improved validation error handling

#### Router
- **Router lifecycle events** - New events for navigation tracking
- **`ChildActivationStart` and `ChildActivationEnd`** - New router events

#### HTTP Client
- **New `HttpClient`** - Modern HTTP client in `@angular/common/http`
- **Typed HTTP responses** - Generic types for type-safe responses
- **HTTP interceptors** - Standardized interceptor API
- **Request/response progress events** - Track upload/download progress
- **JSON default response** - Automatic JSON parsing
- **Testability improvements** - `HttpClientTestingModule`

#### Pipes
- **`number` pipe improvements** - Better internationalization support
- **`currency` pipe improvements** - Better currency formatting
- **`date` pipe improvements** - More date format options

#### Service Workers
- **`@angular/service-worker`** - PWA support with service workers
- **App shell** - Generate app shell for better initial load

#### CLI
- **Angular CLI 1.5** - Improved CLI with better defaults
- **`ng update`** - Update dependencies automatically (initial version)
- **`ng generate guard`** - Generate route guards

#### Other
- **RxJS 5.5+** - Pipeable operators support
- **TypeScript 2.4+ support** - Latest TypeScript features
- **Improved internationalization** - Better i18n tooling
- **Zone speed improvements** - Faster change detection
- **Export multiple declarations with same name** - Better export handling

### Deprecated
- **`@angular/http`** - Old HTTP module (use `HttpClient` instead)
- **`Renderer`** - Deprecated in favor of `Renderer2`
- **Old `i18n` tools** - Deprecated in favor of new i18n tools

---

## Angular 6 (May 2018)

### Features Added

#### CLI & Tooling
- **Angular CLI 6.0** - Major CLI update with `angular.json`
- **`ng update`** - Automated update tool
- **`ng add`** - Add libraries with schematics
- **Schematics** - Code generation and transformation tool
- **CLI Workspaces** - Support for multiple projects in one workspace
- **Library support** - `ng generate library` for creating libraries
- **`angular.json`** - New configuration file (replaces `.angular-cli.json`)

#### Build & Bundling
- **Webpack 4** - Updated to Webpack 4 for better builds
- **Tree-shakeable providers** - `providedIn` syntax for services
- **Smaller bundles** - Further bundle size reductions

#### Core
- **`providedIn: 'root'`** - Tree-shakeable providers
- **`providedIn: 'any'`** - Provider scope control
- **RxJS 6** - Updated to RxJS 6 (with breaking changes)
- **TypeScript 2.7+** - Support for latest TypeScript

#### Elements
- **Angular Elements** - `@angular/elements` for creating custom elements/web components
- **Custom elements schema** - Support for custom HTML elements

#### Animations
- **Animation improvements** - Better animation performance
- **`:increment` and `:decrement` aliases** - Animation aliases

#### Router
- **Router improvements** - Better performance and features
- **`NavigationStart` restoration** - Restore navigation state

#### Service Workers
- **Service worker improvements** - Better PWA support
- **Service worker debugging** - Better debugging tools

#### Bazel
- **Bazel support (experimental)** - Google's build tool support

#### Forms
- **`AbstractControl` improvements** - Better form control types
- **Native validation** - Better HTML5 validation integration

#### i18n
- **Runtime i18n (experimental)** - Load translations at runtime
- **Better i18n tooling** - Improved translation workflow

#### Other
- **Ivy renderer (experimental)** - Next-generation rendering engine (opt-in)
- **`ngModelChange` timing** - Better timing for ngModelChange events

### Deprecated
- **`<template>`** - Use `<ng-template>` instead
- **Old RxJS import paths** - Use new RxJS 6 import paths
- **`@angular/http`** - Further deprecation notices

### Removed
- **Template `<template>` element** - Removed in favor of `<ng-template>`

---

## Angular 7 (October 2018)

### Features Added

#### Performance
- **Bundle budgets** - Set size budgets for bundles in CLI
- **Virtual scrolling** - `@angular/cdk/scrolling` for efficient large list rendering
- **Drag and drop** - `@angular/cdk/drag-drop` for drag-and-drop functionality

#### CLI & Tooling
- **CLI prompts** - Interactive prompts for `ng new` and `ng add`
- **`ng update` improvements** - Better update experience
- **CLI performance improvements** - Faster builds
- **Improved error messages** - Better compilation error messages

#### Core
- **TypeScript 3.1 support** - Updated TypeScript support
- **Node 10 support** - Support for Node.js 10
- **Ivy renderer improvements** - Continued Ivy development (experimental)

#### Material
- **Angular Material 7** - Updated Material Design components
- **New Material components** - Additional components

#### Forms
- **`selectionChange` event** - New event for mat-select

#### Router
- **Router improvements** - Better performance

#### Compiler
- **Compiler performance** - Faster compilation
- **Reflected metadata improvements** - Better metadata handling

#### Documentation
- **Improved documentation** - Better API docs and guides
- **StackBlitz examples** - Interactive examples in docs

#### Other
- **Angular Console** - Visual UI for Angular CLI (separate tool)
- **Content projection improvements** - Better slot handling
- **Application performance improvements** - Various optimizations

### Deprecated
- **`ReflectiveInjector`** - Deprecated in favor of `StaticInjector`

---

## Angular 8 (May 2019)

### Features Added

#### Ivy (Opt-in)
- **Ivy preview** - Next-generation rendering engine (opt-in)
- **Smaller bundle sizes with Ivy** - Significantly smaller applications
- **Faster compilation with Ivy** - Improved build times
- **Better debugging with Ivy** - Access to component instances in console
- **Improved type checking with Ivy** - Better template type checking

#### Differential Loading
- **Differential loading** - Separate bundles for modern and legacy browsers
- **ES2015 bundles** - Modern JavaScript for modern browsers
- **ES5 bundles** - Legacy JavaScript for older browsers
- **Automatic browser targeting** - Based on browserslist

#### CLI & Tooling
- **Builders API** - Extensible CLI builders
- **Web Workers** - `ng generate web-worker` support
- **Lazy loading with import()** - Standard dynamic import syntax
- **CLI analytics** - Opt-in CLI usage analytics
- **Workspace API** - Programmatic workspace manipulation

#### Forms
- **`MarkAsTouched` for FormArray** - Better form array handling

#### Router
- **Backwards compatibility mode** - Better routing compatibility
- **Router improvements** - Performance enhancements

#### Service Workers
- **Service worker improvements** - Better PWA support
- **Stability improvements** - More reliable service workers

#### Bazel
- **Opt-in Bazel support** - Improved Bazel integration

#### Core
- **TypeScript 3.4 support** - Latest TypeScript version
- **Node 12 support** - Support for Node.js 12
- **Location service improvements** - Better URL handling

#### Deprecation Practices
- **Deprecation guide** - Clear deprecation documentation
- **Migration schematics** - Automated migrations

#### SVG
- **SVG as templates** - Use SVG files as component templates

#### Other
- **Firebase deploy support** - `ng deploy` for Firebase
- **Angular Compatibility Compiler (ngcc)** - Compile node_modules to Ivy

### Deprecated
- **`@ViewChild()` and `@ContentChild()` static flag** - Required static flag (temporary)
- **`platform-webworker`** - Web worker platform deprecated
- **Old service worker config** - Deprecated configuration format

---

## Angular 9 (February 2020)

### Features Added

#### Ivy (Default)
- **Ivy by default** - Ivy is now the default rendering engine
- **Smaller bundles** - Up to 40% smaller production bundles
- **Faster compilation** - Faster development and production builds
- **Improved debugging** - Better debugging experience
- **Better template type checking** - Strict template checking
- **`ng.getComponent()`** - Access component instances from DOM

#### Compiler
- **AOT by default** - AOT compilation for development and production
- **Faster incremental builds** - Near-instant rebuilds
- **Better error messages** - More helpful compilation errors
- **Template type checking** - `strictTemplates` flag for strict checking

#### Core
- **TypeScript 3.7 support** - Latest TypeScript features
- **`TestBed.inject()`** - Better testing API
- **Improved dependency injection** - Better DI error messages
- **Improved CSS class and style binding** - Better performance

#### Forms
- **`AbstractControl.parent` type** - Better form control types

#### i18n
- **Improved internationalization** - Better i18n build process
- **`@angular/localize`** - Runtime internationalization
- **Better i18n tooling** - Improved translation workflow

#### Service Workers
- **Service worker improvements** - More stable PWA support

#### CLI
- **Intelligent build defaults** - Better default configurations
- **IDE integration** - Better editor support
- **Migration schematics** - Automated Ivy migration

#### Components (CDK/Material)
- **Component harnesses** - Better component testing
- **New Material components** - Additional components

#### Other
- **`ng update` improvements** - Better update process
- **YouTube player component** - `@angular/youtube-player`
- **Google Maps component** - `@angular/google-maps`

### Deprecated
- **View Engine** - Old rendering engine (still available via compatibility)
- **`entryComponents`** - No longer needed with Ivy
- **`ModuleWithProviders` without generic** - Requires generic type

### Removed
- **`@angular/http`** - Old HTTP module removed (use `HttpClient`)
- **`platform-webworker`** - Web worker platform removed

---

## Angular 10 (June 2020)

### Features Added

#### CLI & Tooling
- **New Date Range Picker** - Material date range picker
- **Warnings about CommonJS imports** - Bundle size warnings
- **Optional stricter settings** - Stricter TypeScript and Angular configs
- **New default browser configuration** - Updated browserslist

#### Compiler
- **Compiler improvements** - Better error messages
- **Async/await in components** - Better async support
- **Dependency information in `ng build`** - Show size contribution

#### Core
- **TypeScript 3.9 support** - Updated TypeScript version
- **TSLib updates** - Updated TypeScript helpers

#### Router
- **Router improvements** - Better route configuration warnings
- **CanLoad guard with UrlTree** - Better guard return types

#### Forms
- **Better form validation messages** - Improved validation errors

#### Service Workers
- **Service worker improvements** - Better caching strategies

#### Bazel
- **Experimental Bazel support** - Continued Bazel improvements

#### i18n
- **Message ID customization** - Custom message IDs for translations

#### Compiler-CLI
- **Propagate type information** - Better template type checking

#### Platform-Browser
- **Better sanitization** - Improved security

#### Language Service
- **Improved Angular Language Service** - Better IDE support
- **Better autocompletion** - Improved code completion

#### Other
- **Ecosystem improvements** - Updated dependencies
- **Bug fixes** - Various bug fixes

### Deprecated
- **`WrappedValue`** - No longer needed
- **Legacy i18n message IDs** - Use new message ID format

### Removed
- **IE 9, 10, and IE mobile support** - Dropped older browser support
- **`esm5` and `fesm5` formats** - Dropped from `@angular/*` packages

---

## Angular 11 (November 2020)

### Features Added

#### Performance
- **Faster builds** - Improved build performance
- **Font inlining** - Automatic font inlining for better performance
- **Improved Hot Module Replacement (HMR)** - Better HMR support
- **Faster CLI** - Performance improvements

#### CLI & Tooling
- **Automatic font inlining** - Inline fonts during build
- **Stricter types** - Opt-in stricter settings
- **Updated language service preview** - Better IDE support (Ivy-based)
- **Report build progress** - Show build progress in terminal
- **CLI 11.0** - Updated CLI with new features

#### Core
- **TypeScript 4.0 support** - Updated TypeScript
- **Webpack 5 (experimental)** - Opt-in Webpack 5 support
- **ESLint support** - Transition from TSLint to ESLint
- **`ng generate component --inline-template`** - Better component generation

#### Router
- **Router improvements** - Better performance and features

#### Forms
- **Form validation improvements** - Better error handling

#### Platform-Browser
- **Better error messages** - Improved debugging

#### Testing
- **TestBed improvements** - Better testing API
- **Teardown behavior** - Better test cleanup options

#### Language Service
- **Ivy-based language service** - Better IDE support
- **Better type checking** - Improved template checking
- **Improved autocompletion** - Better IntelliSense

#### Logging
- **Better logging** - Improved log output format

#### Other
- **Updated dependencies** - Latest dependencies
- **Bug fixes and improvements** - Various fixes

### Deprecated
- **TSLint** - Use ESLint instead
- **View Engine** - Further deprecation notices
- **`ResourceLoader.get()`** - Use `ResourceLoader.resolve()` instead

### Removed
- **IE 9, 10, and IE mobile** - Official removal
- **Deprecated APIs** - Various deprecated APIs removed

---

## Angular 12 (May 2021)

### Features Added

#### Ivy Everywhere
- **View Engine removed** - Ivy is the only engine
- **Libraries must use Ivy** - All libraries must be Ivy-compatible
- **Better compilation** - Improved Ivy compiler

#### Performance
- **Faster builds** - Continued build improvements
- **Smaller bundles** - Further size reductions
- **Improved styling** - Better style processing
- **Inline critical CSS** - Critical CSS inlining

#### CLI & Tooling
- **Webpack 5 by default** - Webpack 5 as default bundler
- **ESLint by default** - ESLint for new projects
- **Nullish coalescing in templates** - `??` operator support
- **Strict mode by default** - Strict TypeScript and Angular settings
- **Better error messages** - Improved error reporting
- **Production by default** - `ng build` defaults to production

#### Core
- **TypeScript 4.2 support** - Updated TypeScript
- **Sass module system** - Support for Sass modules
- **`ng.applyChanges()`** - Trigger change detection from console
- **Null-safe navigation improvements** - Better null handling

#### Router
- **Router improvements** - Better route handling

#### Forms
- **Forms improvements** - Better form handling
- **Min/max validators** - Built-in min/max validators

#### HTTP
- **HTTP improvements** - Better HTTP client

#### Internationalization
- **Better i18n** - Improved internationalization support
- **Message extraction improvements** - Better extraction tools

#### Testing
- **Better TestBed** - Improved testing utilities

#### Language Service
- **Improved language service** - Better IDE integration
- **Faster analysis** - Improved performance

#### CDK & Material
- **Material 12** - Updated Material Design components
- **New CDK features** - Additional CDK utilities

#### Other
- **Deprecated API removal** - Cleaned up deprecated APIs
- **Better documentation** - Improved docs

### Deprecated
- **View Engine libraries** - Must migrate to Ivy
- **`@angular/platform-webworker`** - Deprecated
- **Old APIs** - Various old APIs deprecated

### Removed
- **View Engine** - Completely removed
- **`@angular/platform-webworker`** - Removed
- **`@angular/platform-webworker-dynamic`** - Removed
- **Legacy i18n message IDs** - Removed
- **IE 11 support in Material** - Dropped from Material

---

## Angular 13 (November 2021)

### Features Added

#### Performance
- **Faster compilation** - Improved compilation speed
- **Smaller bundle sizes** - Further size reductions
- **Persistent build cache** - Faster rebuilds
- **100% Ivy** - Complete Ivy migration

#### CLI & Tooling
- **No need for `.enableProdMode()`** - Automatic in production
- **Improved CLI output** - Better error messages
- **Better caching** - Persistent build cache enabled by default
- **Modern JavaScript** - ES2020 output by default

#### Core
- **TypeScript 4.4 support** - Updated TypeScript
- **Node 16 support** - Support for Node.js 16
- **RxJS 7.4** - Updated RxJS
- **Ergonomic code changes** - Better developer experience
- **Dynamic component creation** - Easier dynamic components via `ViewContainerRef.createComponent()`

#### Components & CDK
- **Material 13** - Updated components
- **Accessibility improvements** - Better a11y support
- **New CDK primitives** - Additional utilities

#### Forms
- **Typed Forms (experimental)** - Type-safe reactive forms
- **`FormControlStatus` type** - Better form status typing

#### Router
- **Router improvements** - Better performance

#### Testing
- **Better TestBed APIs** - Simplified testing
- **`TestBed.inject()` improvements** - Better type inference

#### Package Format
- **APF v13** - Updated Angular Package Format
- **Removed legacy View Engine specific metadata** - Cleaner packages

#### Internationalization
- **Better i18n** - Continued improvements

#### Service Workers
- **Service worker improvements** - Better PWA support

#### Other
- **No more `ng xi18n` in IE** - IE-specific code removed
- **Adobe Fonts support** - Better font loading

### Deprecated
- **Old component factory resolvers** - Use new dynamic component API

### Removed
- **View Engine remnants** - All View Engine code removed
- **IE 11 support** - Official IE 11 support removed
- **`Component.entryComponents`** - Removed (not needed with Ivy)
- **Legacy message ID support** - Removed from i18n

---

## Angular 14 (June 2022)

### Features Added

#### Standalone Components (Developer Preview)
- **Standalone components** - Components without NgModules
- **Standalone directives** - Directives without NgModules
- **Standalone pipes** - Pipes without NgModules
- **`imports` in components** - Import dependencies directly
- **Simplified bootstrapping** - `bootstrapApplication()` function

#### Typed Forms
- **Typed Reactive Forms** - Fully typed forms (stable)
- **Strict null checks in forms** - Better type safety
- **Type-safe form validators** - Typed validators

#### CLI & Tooling
- **`ng completion`** - Autocomplete for Angular CLI
- **Simplified page title binding** - `Title` service improvements
- **Better build analytics** - Improved build reports
- **Protected component members in templates** - Use protected members in templates

#### Core
- **TypeScript 4.7 support** - Updated TypeScript
- **Inject in more places** - Use `inject()` in more contexts
- **Better error messages** - Improved debugging

#### Router
- **Router standalone APIs** - Router without NgModules
- **`provideRouter()`** - Functional router setup
- **Route guards as functions** - Functional guards (not just classes)
- **Router title strategy** - Built-in title management
- **Bind route info to component inputs** - Automatic route data binding

#### HTTP
- **HttpClient standalone APIs** - HttpClient without NgModules

#### Forms
- **Forms standalone APIs** - Forms without NgModules
- **Strictly typed forms** - Production-ready typed forms

#### Animations
- **Animations improvements** - Better performance

#### Extended Diagnostics
- **Extended template diagnostics** - Catch common mistakes
- **Warnings for common errors** - Proactive error detection

#### CDK & Material
- **Material 14** - Updated components
- **MDC-based components** - Migration to Material Design Components

#### Other
- **Better tree-shaking** - Smaller bundles
- **Streamlined configuration** - Simpler setup

### Deprecated
- **NgModule-based approach (soft deprecation)** - Standalone is preferred
- **Class-based guards** - Functional guards preferred
- **Class-based resolvers** - Functional resolvers preferred

---

## Angular 15 (November 2022)

### Features Added

#### Standalone APIs (Stable)
- **Standalone components stable** - Production-ready standalone APIs
- **`bootstrapApplication()`** - Standalone bootstrap
- **Router standalone APIs** - Complete standalone routing
- **HttpClient standalone APIs** - Standalone HTTP
- **Standalone directive composition** - Compose directives
- **Functional router guards** - Guards as functions (stable)
- **Functional resolvers** - Resolvers as functions (stable)
- **Functional interceptors** - Interceptors as functions

#### Directive Composition API
- **`hostDirectives`** - Compose directives on components
- **Directive inheritance** - Reuse directive functionality

#### Image Optimization
- **NgOptimizedImage (stable)** - Optimized image directive
- **Automatic srcset generation** - Responsive images
- **Lazy loading** - Built-in lazy loading
- **Priority loading** - LCP optimization
- **Image preloading** - Faster image loading

#### Router
- **Router improvements** - Better performance
- **Tree-shakeable router** - Smaller router bundles
- **Functional guards stable** - Production-ready functional guards
- **Better route typing** - Type-safe routes

#### CLI & Tooling
- **esbuild developer preview** - Faster builds (experimental)
- **Better error messages** - Improved diagnostics
- **MDC migration schematics** - Automatic Material migration
- **Stable CLI improvements** - Better DX

#### Core
- **TypeScript 4.8 support** - Updated TypeScript
- **Inject in providers** - Use `inject()` in providers
- **Better stack traces** - Improved debugging

#### Forms
- **Forms improvements** - Better typed forms

#### CDK & Material
- **Material 15** - Updated to MDC-based components
- **MDC-based components** - New Material implementations
- **Component accessibility** - Better a11y

#### Language Service
- **Auto-imports** - Automatic import statements
- **Better IntelliSense** - Improved code completion

#### Testing
- **Better testing utilities** - Improved TestBed

#### Other
- **Multiple exports with same name** - Better module support
- **Better SSR** - Improved server-side rendering

### Deprecated
- **NgModule-based APIs (soft)** - Standalone preferred
- **Old Material components** - MDC-based preferred
- **Class-based DI tokens** - Functional approach preferred

---

## Angular 16 (May 2023)

### Features Added

#### Signals (Developer Preview)
- **Signals** - New reactivity primitive
- **`signal()`** - Create reactive values
- **`computed()`** - Derived reactive values
- **`effect()`** - Side effects from signals
- **Fine-grained reactivity** - Granular change detection

#### Reactivity
- **New reactivity model** - Signals-based reactivity
- **Better performance** - More efficient change detection
- **RxJS interop** - Convert between signals and observables
- **`toSignal()` and `toObservable()`** - Interop utilities

#### Server-Side Rendering
- **Complete SSR story** - Full SSR and hydration support
- **Non-destructive hydration (developer preview)** - Reuse server-rendered DOM
- **Hydration support** - Better SSR performance
- **`provideClientHydration()`** - Enable hydration

#### CLI & Tooling
- **esbuild improvements** - Faster experimental builder
- **Vite developer preview** - Vite-based dev server (experimental)
- **Jest support (experimental)** - Jest as test runner
- **Better CLI performance** - Faster commands

#### Router
- **Router inputs** - Bind router data directly to component inputs (stable)
- **Router improvements** - Better functionality

#### Core
- **TypeScript 5.0 support** - Latest TypeScript
- **ES2022 by default** - Modern JavaScript output
- **Required inputs** - `@Input({ required: true })`
- **Self-closing tags** - `<component />` syntax
- **DestroyRef** - Unified component cleanup
- **`takeUntilDestroyed()` operator** - RxJS cleanup helper

#### Forms
- **Forms improvements** - Better functionality

#### Testing
- **Component harnesses improvements** - Better testing

#### Tooling
- **Improved autocomplete** - Better IDE support
- **Extract to component/directive** - Refactoring tools

#### Other
- **Content Security Policy** - Better CSP support with nonces
- **Better debugging** - Improved DevTools integration

### Deprecated
- **Untyped forms** - Typed forms preferred

---

## Angular 17 (November 2023)

### Features Added

#### New Syntax & Control Flow
- **Built-in control flow** - `@if`, `@for`, `@switch`, `@else`
- **New template syntax** - Declarative control flow
- **`@for` with track** - Better list rendering
- **`@defer` (deferred loading)** - Lazy load template chunks
- **`@placeholder`** - Show content before defer loads
- **`@loading`** - Show loading state
- **`@error`** - Handle loading errors

#### Deferrable Views
- **`@defer` blocks** - Lazy load view chunks
- **Trigger conditions** - `on viewport`, `on idle`, `on timer`, etc.
- **Prefetch strategies** - Pre-load deferred content
- **Nested defer blocks** - Compose deferred views

#### Signals (Stable)
- **Signals stable** - Production-ready reactive primitives
- **`signal()` stable** - Create signals
- **`computed()` stable** - Computed values
- **`effect()` stable** - Side effects
- **Signal inputs (developer preview)** - `input()` function
- **Signal queries (developer preview)** - `viewChild()`, `contentChild()`

#### Hydration
- **Full hydration support (stable)** - Non-destructive hydration stable
- **Partial hydration** - Hydrate parts of the app
- **Event replay** - Capture events before hydration
- **Better SSR performance** - Faster hydration

#### CLI & Build
- **esbuild + Vite dev server (stable)** - New build system
- **Faster builds** - Up to 87% faster builds
- **Faster dev server** - Instant server startup
- **Application builder** - New Vite/esbuild-based builder
- **SSR/SSG support in new builder** - Better server builds

#### Performance
- **Lazy loading improvements** - Better code splitting
- **Defer views** - Lazy load view chunks
- **Better tree-shaking** - Smaller bundles

#### Router
- **Router improvements** - Better functionality
- **View transitions** - Smooth page transitions

#### Documentation
- **New angular.dev site** - Modern documentation site
- **Interactive tutorials** - Built-in tutorials
- **Better examples** - Improved code samples
- **Local playground** - Practice in docs

#### Branding
- **New Angular logo** - Refreshed branding
- **New documentation site** - angular.dev

#### Other
- **Improved debugging** - Better DevTools
- **Better error messages** - More helpful errors
- **Style and styleUrl as arrays** - Multiple stylesheets

### Deprecated
- **Old control flow** - `*ngIf`, `*ngFor`, `*ngSwitch` (soft deprecation)
- **Old decorators for inputs/queries (soft)** - Signal-based preferred

---

## Angular 18 (May 2024)

### Features Added

#### Signals Everywhere
- **Signal inputs (stable)** - `input()`, `input.required()`
- **Signal queries (stable)** - `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`
- **Model inputs** - Two-way binding with `model()`
- **Signal-based components** - Full signal support in components
- **`output()` function (stable)** - Functional outputs

#### Zoneless Applications (Experimental)
- **Zoneless change detection** - Run Angular without Zone.js
- **`provideExperimentalZonelessChangeDetection()`** - Enable zoneless mode
- **Signals-based reactivity** - Replace Zone.js with signals
- **Better performance** - More efficient change detection
- **Smaller bundles** - Remove Zone.js dependency

#### Hydration
- **Event replay (stable)** - Capture events before hydration
- **Full hydration support** - Complete SSR/hydration story
- **i18n hydration support** - Hydration with internationalization
- **Better hydration debugging** - DevTools support

#### Material 3
- **Material 3 (stable)** - New Material Design
- **M3 components** - Updated component designs
- **M3 theming** - New theming system

#### Forms
- **Events in forms** - New form events
- **`touched` and `pristine` events** - Fine-grained form events

#### Router
- **Router inputs with component inputs** - Better integration
- **Redirect commands** - Functional redirects
- **Router events improvements** - Better event handling

#### CLI & Build
- **Build improvements** - Faster builds
- **esbuild stable** - Production-ready esbuild
- **Server-side rendering improvements** - Better SSR builds

#### SSR & Server Routes
- **Server routing** - Hybrid rendering (SSR + SSG + CSR)
- **Route-level rendering modes** - Mix SSR/SSG per route

#### Performance
- **Defer improvements** - Better lazy loading
- **Change detection improvements** - More efficient CD

#### DevTools
- **Hydration debugging** - Debug hydration issues
- **Signal debugging** - Debug signal values

#### Core
- **TypeScript 5.4 support** - Latest TypeScript
- **Fallback content for `ng-content`** - Default content projection

#### Testing
- **Testing improvements** - Better testing utilities
- **Signal testing** - Test signal-based components

#### Other
- **Coalesced events** - Better event handling
- **Better debugging** - Improved error messages

### Deprecated
- **`@Input()` decorator (soft)** - Signal inputs preferred
- **`@Output()` decorator (soft)** - `output()` function preferred
- **`@ViewChild()`/`@ContentChild()` (soft)** - Signal queries preferred
- **Zone.js (soft)** - Zoneless mode emerging

---

## Angular 19 (November 2024)

### Features Added

#### Incremental Hydration (Experimental)
- **Incremental hydration** - Hydrate components on demand
- **`@defer` with hydration** - Lazy hydrate deferred blocks
- **Trigger-based hydration** - Hydrate on interaction/viewport
- **Better TTI (Time to Interactive)** - Faster interactivity

#### Signals Maturity
- **Linked signals** - Signals that depend on other signals
- **Resource API (developer preview)** - Async data loading with signals
- **Signal effects improvements** - Better effect scheduling
- **Signal debugging improvements** - Better DevTools

#### SSR & Server Rendering
- **Server route config** - Declarative server rendering
- **Route-level rendering modes** - Mix SSR/SSG/CSR per route
- **Streaming SSR improvements** - Better streaming support
- **Server event handlers** - Handle events on server

#### Hydration
- **Full application hydration** - Complete hydration support
- **Partial hydration (experimental)** - Selectively hydrate
- **Hydration performance** - Faster hydration

#### Forms
- **Linked signals in forms** - Better reactive forms with signals

#### Router
- **Router improvements** - Better functionality
- **View transitions API** - Smooth page transitions (stable)
- **`withNavigationErrorHandler`** - Better error handling

#### Input Transforms
- **Native input transform** - Built-in transform functions
- **Boolean transforms** - Automatic boolean coercion

#### CLI & Build
- **Build optimizations** - Faster builds
- **HMR improvements** - Better hot module replacement
- **SSR build improvements** - Better server builds

#### Testing
- **Signal testing improvements** - Better signal testing
- **Hydration testing** - Test hydrated applications

#### Performance
- **Defer improvements** - Better performance
- **Change detection optimizations** - More efficient CD
- **Bundle size reductions** - Smaller apps

#### Hot Module Replacement
- **Stable HMR** - Better development experience
- **HMR with styles** - Update styles without reload
- **HMR with templates** - Update templates without reload

#### Developer Experience
- **Better error messages** - More actionable errors
- **Improved DevTools** - Better debugging experience
- **Better IDE support** - Enhanced language service

#### Other
- **Experimental APIs stabilized** - Various APIs moved to stable
- **TypeScript 5.5 support** - Latest TypeScript

### Deprecated
- **NgModules (soft)** - Standalone strongly preferred
- **Zone.js-based CD (soft)** - Zoneless gaining traction

---

## Angular 20 (Expected May 2025)

**Note:** Angular 20 is not yet released. This section contains expected features based on the roadmap and community discussions.

### Expected Features

#### Zoneless by Default (Possible)
- **Zoneless as default** - Potentially remove Zone.js requirement
- **Signal-based change detection** - Signals as primary reactivity
- **Migration tools** - Automated zoneless migration

#### Full Hydration & SSR
- **Universal rendering strategies** - Complete SSR/SSG/CSR support
- **Islands architecture** - Partial hydration patterns
- **Edge rendering** - Deploy to edge runtimes

#### Signals Completion
- **Complete signal API** - All APIs signal-based
- **Signal components everywhere** - Full migration guide
- **RxJS interop finalization** - Seamless signal/observable integration

#### Performance
- **Further size reductions** - Continued bundle optimization
- **Lazy compilation** - Compile only what's needed
- **Streaming improvements** - Better streaming SSR

#### Developer Experience
- **Improved CLI** - Better tooling
- **Better debugging** - Enhanced debugging tools
- **Improved documentation** - More comprehensive guides

#### Possible Features
- **Signals maturity** - Complete signal system
- **Standalone as default** - NgModules legacy
- **Modern JavaScript** - ES2023+ features
- **Build improvements** - Faster builds
- **TypeScript 5.6+ support** - Latest TypeScript

### Expected Deprecations
- **NgModules (stronger signal)** - Push toward standalone
- **Zone.js** - Potentially fully deprecated
- **Old APIs** - Legacy APIs cleanup

### Note
The actual features and timeline for Angular 20 may vary. Check the [official Angular blog](https://blog.angular.io/) and [roadmap](https://angular.io/guide/roadmap) for updates.

---

## Summary of Major Trends

### Angular 2-8: Foundation & Growth
- Component architecture
- TypeScript integration
- RxJS & reactive programming
- Forms & routing
- AOT compilation
- Performance optimization
- Ivy renderer development

### Angular 9-13: Ivy Era
- Ivy becomes default (v9)
- View Engine removal (v12)
- Better compilation & bundles
- Improved developer experience
- ESLint adoption
- IE 11 support dropped

### Angular 14-16: Modern Angular
- Standalone components
- Typed forms
- Functional APIs (guards, interceptors)
- Signals introduction
- SSR & hydration
- esbuild/Vite adoption

### Angular 17-19: Renaissance
- New control flow (`@if`, `@for`, `@defer`)
- Signals stable & everywhere
- Zoneless applications
- New documentation site (angular.dev)
- Material 3
- Incremental hydration
- Modern build system

### Angular 20+: Future (Expected)
- Zoneless by default
- Complete signal migration
- Islands architecture
- Edge rendering
- Continued performance improvements

---

## Key Breaking Changes Timeline

1. **Angular 2**: Complete rewrite from AngularJS
2. **Angular 4**: Animation package separated
3. **Angular 5**: New HttpClient
4. **Angular 6**: RxJS 6 (import changes)
5. **Angular 8**: Ivy opt-in, differential loading
6. **Angular 9**: Ivy by default
7. **Angular 12**: View Engine removed, IE11 dropped
8. **Angular 13**: IE11 officially removed, APF changes
9. **Angular 14**: Typed forms, standalone APIs
10. **Angular 15**: Standalone stable
11. **Angular 17**: New control flow syntax
12. **Angular 18**: Zoneless experimental

---

## Resources

- [Angular Official Docs](https://angular.dev/)
- [Angular Blog](https://blog.angular.io/)
- [Angular GitHub](https://github.com/angular/angular)
- [Angular Update Guide](https://update.angular.io/)
- [Angular Roadmap](https://angular.io/guide/roadmap)
- [Angular CLI](https://cli.angular.io/)

---

**Last Updated:** November 2024  
**Document Version:** 1.0








