# Top 10 SCSS Questions for Senior Frontend Developers

## 1. What are the key differences between @use and @import, and why is @use preferred?

### Answer

**@import (Deprecated)**
- Global namespace - all variables, mixins, and functions become globally accessible
- Multiple imports of the same file create duplicate CSS
- No namespace control, leading to naming conflicts
- Will be removed from Sass in the future

**@use (Modern Approach)**
- Modular system with namespaces
- Only loads files once, regardless of how many times they're used
- Members are private by default (prefix with `-` or `_`)
- Explicit namespace control

```scss
// Old way with @import
@import 'variables';
@import 'mixins';

.element {
  color: $primary-color; // Global variable
}

// Modern way with @use
@use 'variables' as vars;
@use 'mixins' as mx;

.element {
  color: vars.$primary-color; // Namespaced
  @include mx.flex-center;
}

// Custom namespace
@use 'sass:math' as *; // Use without namespace
@use 'theme' as t;
```

**Key Benefits of @use:**
- Prevents naming conflicts through namespacing
- Better performance (files loaded once)
- Clear dependencies and origin of variables/mixins
- Encapsulation and modularity
- Works with `@forward` for creating public APIs

---

## 2. Explain the @forward directive and how to build a proper SCSS architecture with it

### Answer

`@forward` creates public APIs by re-exposing members from other files. It's essential for building scalable SCSS architectures.

```scss
// _variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$spacing-unit: 8px;

// _functions.scss
@function spacing($multiplier) {
  @return $spacing-unit * $multiplier;
}

// _mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// index.scss (Public API)
@forward 'variables';
@forward 'functions';
@forward 'mixins';

// You can also control what gets forwarded:
@forward 'variables' hide $internal-variable;
@forward 'theme' show $primary-*, $secondary-*;
@forward 'helpers' as helper-*; // Prefix all members

// Usage in components
@use 'styles' as *; // Now has access to all forwarded members

.component {
  color: $primary-color;
  padding: spacing(2);
  @include flex-center;
}
```

**Architecture Pattern:**
```
styles/
  ├── _index.scss          # Main entry (forwards everything)
  ├── abstracts/
  │   ├── _index.scss      # Forwards abstracts
  │   ├── _variables.scss
  │   ├── _mixins.scss
  │   └── _functions.scss
  ├── base/
  │   ├── _index.scss
  │   ├── _reset.scss
  │   └── _typography.scss
  └── components/
      └── _button.scss

// styles/_index.scss
@forward 'abstracts';
@forward 'base';
@forward 'components';
```

---

## 3. How do you implement theming in SCSS using CSS Custom Properties and Sass features?

### Answer

Modern theming combines SCSS power with CSS Custom Properties for runtime flexibility:

```scss
// _theme-config.scss
$themes: (
  light: (
    primary: #007bff,
    background: #ffffff,
    text: #333333,
    surface: #f5f5f5
  ),
  dark: (
    primary: #66b3ff,
    background: #1a1a1a,
    text: #e0e0e0,
    surface: #2d2d2d
  )
);

// _theme-mixin.scss
@mixin generate-theme($theme-name, $theme-map) {
  .theme-#{$theme-name} {
    @each $key, $value in $theme-map {
      --color-#{$key}: #{$value};
    }
  }
}

// Generate all themes
@each $theme-name, $theme-map in $themes {
  @include generate-theme($theme-name, $theme-map);
}

// _theme-functions.scss
@function theme-color($key) {
  @return var(--color-#{$key});
}

// Usage in components
.button {
  background-color: theme-color(primary);
  color: theme-color(text);
  
  &:hover {
    background-color: color-mix(
      in srgb,
      theme-color(primary) 80%,
      black
    );
  }
}

// Advanced: Typed theme system
@mixin apply-theme($property, $color-key, $fallback: null) {
  @if $fallback {
    #{$property}: $fallback;
  }
  #{$property}: var(--color-#{$color-key});
}

.card {
  @include apply-theme(background-color, surface, #fff);
  @include apply-theme(color, text, #000);
}
```

**Runtime Theme Switching (TypeScript/Angular):**
```typescript
export class ThemeService {
  private currentTheme = signal<'light' | 'dark'>('light');

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
    document.documentElement.className = `theme-${newTheme}`;
  }
}
```

---

## 4. Explain the difference between @mixin/@include and @extend, including performance implications

### Answer

**@mixin/@include** - Generates code copies:
```scss
@mixin button-base {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
}

.btn-primary {
  @include button-base;
  background: blue;
}

.btn-secondary {
  @include button-base;
  background: gray;
}

// Compiled CSS (code duplication)
.btn-primary {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  background: blue;
}

.btn-secondary {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  background: gray;
}
```

**@extend** - Groups selectors:
```scss
.button-base {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
}

.btn-primary {
  @extend .button-base;
  background: blue;
}

.btn-secondary {
  @extend .button-base;
  background: gray;
}

// Compiled CSS (selector grouping)
.button-base, .btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
}

.btn-primary {
  background: blue;
}

.btn-secondary {
  background: gray;
}
```

**Performance & Best Practices:**

| Feature | @mixin | @extend |
|---------|--------|---------|
| CSS Size | Larger (duplication) | Smaller (grouped) |
| Specificity | Predictable | Can be unpredictable |
| Parameters | Yes | No |
| Gzip Impact | Compresses well | Less repetition |
| Maintainability | Better | Can be complex |

**Recommendations:**
- Use `@mixin` when you need parameters or dynamic values
- Use `@extend` with placeholders (`%`) for static style groups
- Avoid `@extend` across media queries (doesn't work)
- Prefer `@mixin` for component-based architectures

```scss
// Good use of @extend with placeholder
%card-base {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card {
  @extend %card-base;
}

// Good use of @mixin with parameters
@mixin responsive-font($min, $max, $min-vw: 320px, $max-vw: 1200px) {
  font-size: clamp(#{$min}, calc(#{$min} + (#{$max} - #{$min}) * ((100vw - #{$min-vw}) / (#{$max-vw} - #{$min-vw}))), #{$max});
}
```

---

## 5. How do you handle responsive design with advanced SCSS techniques?

### Answer

**1. Breakpoint Management System:**
```scss
// _breakpoints.scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

@function breakpoint($key) {
  @return map-get($breakpoints, $key);
}

@mixin respond-to($breakpoint, $direction: 'up') {
  @if $direction == 'up' {
    @media (min-width: breakpoint($breakpoint)) {
      @content;
    }
  } @else if $direction == 'down' {
    @media (max-width: breakpoint($breakpoint) - 0.02px) {
      @content;
    }
  } @else if $direction == 'only' {
    $next-breakpoint: null;
    $breakpoint-keys: map-keys($breakpoints);
    $index: index($breakpoint-keys, $breakpoint);
    
    @if $index < length($breakpoint-keys) {
      $next-breakpoint: nth($breakpoint-keys, $index + 1);
    }
    
    @if $next-breakpoint {
      @media (min-width: breakpoint($breakpoint)) and (max-width: breakpoint($next-breakpoint) - 0.02px) {
        @content;
      }
    }
  }
}

// Usage
.container {
  padding: 16px;
  
  @include respond-to(md) {
    padding: 24px;
  }
  
  @include respond-to(lg) {
    padding: 32px;
  }
}
```

**2. Fluid Typography:**
```scss
@function strip-unit($number) {
  @if type-of($number) == 'number' and not unitless($number) {
    @return math.div($number, $number * 0 + 1);
  }
  @return $number;
}

@mixin fluid-type($min-size, $max-size, $min-vw: 320px, $max-vw: 1200px) {
  $u1: unit($min-vw);
  $u2: unit($max-vw);
  $u3: unit($min-size);
  $u4: unit($max-size);
  
  @if $u1 == $u2 and $u1 == $u3 and $u1 == $u4 {
    font-size: clamp(
      #{$min-size},
      calc(#{$min-size} + #{strip-unit($max-size - $min-size)} * ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})),
      #{$max-size}
    );
  }
}

h1 {
  @include fluid-type(24px, 48px);
}
```

**3. Container Queries (Modern SCSS):**
```scss
@mixin container-query($min-width) {
  @container (min-width: #{$min-width}) {
    @content;
  }
}

.card {
  container-type: inline-size;
  
  .card-title {
    font-size: 1.25rem;
    
    @include container-query(400px) {
      font-size: 1.5rem;
    }
    
    @include container-query(600px) {
      font-size: 2rem;
    }
  }
}
```

**4. Responsive Grid System:**
```scss
@mixin grid-columns($columns: 12, $gap: 20px) {
  display: grid;
  gap: $gap;
  grid-template-columns: repeat($columns, 1fr);
}

@mixin grid-span($span, $total: 12) {
  grid-column: span $span;
}

.container {
  @include grid-columns(4, 16px);
  
  @include respond-to(md) {
    @include grid-columns(8, 20px);
  }
  
  @include respond-to(lg) {
    @include grid-columns(12, 24px);
  }
}

.item {
  @include grid-span(4, 4);
  
  @include respond-to(md) {
    @include grid-span(4, 8);
  }
  
  @include respond-to(lg) {
    @include grid-span(3, 12);
  }
}
```

---

## 6. How do you optimize SCSS for performance and maintainability at scale?

### Answer

**1. Architecture Organization (7-1 Pattern):**
```scss
// Main entry point: styles.scss
@use 'abstracts';
@use 'vendors';
@use 'base';
@use 'layout';
@use 'components';
@use 'pages';
@use 'themes';

// Directory structure:
// abstracts/  - variables, functions, mixins
// vendors/    - 3rd party CSS
// base/       - reset, typography, global styles
// layout/     - header, footer, grid
// components/ - buttons, cards, forms
// pages/      - page-specific styles
// themes/     - theme variations
```

**2. Performance Optimization Techniques:**
```scss
// Avoid deep nesting (max 3-4 levels)
// Bad
.header {
  .nav {
    .menu {
      .item {
        .link {  // Too deep!
          color: blue;
        }
      }
    }
  }
}

// Good - Use BEM or flat structure
.header-nav {}
.header-nav__item {}
.header-nav__link {
  color: blue;
}

// Optimize selector performance
// Bad - Universal selector
* {
  box-sizing: border-box;
}

// Good - Specific targeting
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

// Use @mixin wisely to avoid bloat
// Bad - Simple property in mixin
@mixin red-text {
  color: red;
}

// Good - Complex reusable pattern
@mixin card-elevation($level) {
  @if $level == 1 {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  } @else if $level == 2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  } @else if $level == 3 {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19);
  }
}
```

**3. Code Splitting & Lazy Loading:**
```scss
// Critical CSS (inline in <head>)
@use 'abstracts/variables';
@use 'base/reset';
@use 'base/typography';
@use 'layout/header';

// Non-critical CSS (async loaded)
// components.scss
@use 'components/button';
@use 'components/card';
@use 'components/modal';
```

**4. Utility Class Generation:**
```scss
// Generate utility classes programmatically
$spacing-values: (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64);
$sides: (
  't': 'top',
  'r': 'right',
  'b': 'bottom',
  'l': 'left'
);

@each $value in $spacing-values {
  .m-#{$value} {
    margin: #{$value}px;
  }
  
  .p-#{$value} {
    padding: #{$value}px;
  }
  
  @each $abbr, $side in $sides {
    .m#{$abbr}-#{$value} {
      margin-#{$side}: #{$value}px;
    }
    
    .p#{$abbr}-#{$value} {
      padding-#{$side}: #{$value}px;
    }
  }
}

// Generates: .m-0, .m-4, .mt-8, .pr-16, etc.
```

**5. CSS Output Optimization:**
```scss
// Avoid duplicate styles with placeholders
%button-reset {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-button {
  @extend %button-reset;
  // specific styles
}

.text-button {
  @extend %button-reset;
  // specific styles
}
```

---

## 7. Explain advanced SCSS functions and when to use them

### Answer

**1. Custom Functions for Color Manipulation:**
```scss
@use 'sass:color';
@use 'sass:math';

// Smart contrast function
@function contrast-color($bg-color, $light: #fff, $dark: #000) {
  $luminance: color.lightness($bg-color);
  @return if($luminance > 50%, $dark, $light);
}

// Tint and Shade functions
@function tint($color, $percentage) {
  @return color.mix(white, $color, $percentage);
}

@function shade($color, $percentage) {
  @return color.mix(black, $color, $percentage);
}

// Usage
.button {
  $bg: #007bff;
  background-color: $bg;
  color: contrast-color($bg);
  
  &:hover {
    background-color: shade($bg, 20%);
  }
}

// Advanced color palette generation
@function generate-palette($base-color) {
  @return (
    50: tint($base-color, 90%),
    100: tint($base-color, 80%),
    200: tint($base-color, 60%),
    300: tint($base-color, 40%),
    400: tint($base-color, 20%),
    500: $base-color,
    600: shade($base-color, 20%),
    700: shade($base-color, 40%),
    800: shade($base-color, 60%),
    900: shade($base-color, 80%)
  );
}

$primary-palette: generate-palette(#007bff);
```

**2. Math Functions:**
```scss
@use 'sass:math';

@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

@function em($px, $context: 16px) {
  @return math.div($px, $context) * 1em;
}

// Fibonacci sequence for spacing
@function fibonacci($n) {
  @if $n <= 2 {
    @return 1;
  }
  @return fibonacci($n - 1) + fibonacci($n - 2);
}

$spacing: ();
@for $i from 1 through 8 {
  $spacing: map-merge($spacing, ($i: fibonacci($i) * 4px));
}

// Golden ratio
@function golden-ratio($value, $increment: 1) {
  $phi: 1.618;
  @return $value * math.pow($phi, $increment);
}

.title {
  font-size: rem(16px);
  line-height: golden-ratio(1);
  margin-bottom: rem(map-get($spacing, 3));
}
```

**3. String Manipulation:**
```scss
@use 'sass:string';

@function str-replace($string, $search, $replace: '') {
  $index: string.index($string, $search);
  
  @if $index {
    @return string.slice($string, 1, $index - 1) + 
            $replace + 
            str-replace(string.slice($string, $index + string.length($search)), $search, $replace);
  }
  
  @return $string;
}

// URL encoding function
@function url-encode($string) {
  $map: (
    ' ': '%20',
    '!': '%21',
    '#': '%23',
    '$': '%24',
    '&': '%26',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
    '+': '%2B',
    ',': '%2C',
    '/': '%2F',
    ':': '%3A',
    ';': '%3B',
    '=': '%3D',
    '?': '%3F',
    '@': '%40',
    '[': '%5B',
    ']': '%5D'
  );
  
  $result: $string;
  @each $char, $encoded in $map {
    $result: str-replace($result, $char, $encoded);
  }
  @return $result;
}
```

**4. List & Map Functions:**
```scss
@use 'sass:list';
@use 'sass:map';

// Deep map get
@function deep-map-get($map, $keys...) {
  $value: $map;
  @each $key in $keys {
    $value: map.get($value, $key);
  }
  @return $value;
}

$theme: (
  colors: (
    primary: (
      base: #007bff,
      light: #66b3ff,
      dark: #0056b3
    )
  )
);

$primary-light: deep-map-get($theme, colors, primary, light);

// Map merge deep
@function map-deep-merge($map1, $map2) {
  $result: $map1;
  
  @each $key, $value in $map2 {
    @if type-of($value) == 'map' and type-of(map.get($result, $key)) == 'map' {
      $result: map.set($result, $key, map-deep-merge(map.get($result, $key), $value));
    } @else {
      $result: map.set($result, $key, $value);
    }
  }
  
  @return $result;
}
```

---

## 8. How do you implement a design token system in SCSS?

### Answer

Design tokens are a scalable way to manage design decisions across applications.

**1. Token Structure:**
```scss
// _tokens.scss

// Primitive tokens (design primitives)
$primitive-colors: (
  blue-50: #e3f2fd,
  blue-100: #bbdefb,
  blue-500: #2196f3,
  blue-900: #0d47a1,
  gray-50: #fafafa,
  gray-500: #9e9e9e,
  gray-900: #212121,
  red-500: #f44336,
  green-500: #4caf50
);

$primitive-spacing: (
  0: 0,
  1: 4px,
  2: 8px,
  3: 12px,
  4: 16px,
  5: 20px,
  6: 24px,
  8: 32px,
  10: 40px,
  12: 48px,
  16: 64px
);

$primitive-typography: (
  font-sizes: (
    xs: 12px,
    sm: 14px,
    base: 16px,
    lg: 18px,
    xl: 20px,
    2xl: 24px,
    3xl: 30px,
    4xl: 36px
  ),
  font-weights: (
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  ),
  line-heights: (
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  )
);

// Semantic tokens (context-specific)
$semantic-colors: (
  text: (
    primary: map-get($primitive-colors, gray-900),
    secondary: map-get($primitive-colors, gray-500),
    disabled: map-get($primitive-colors, gray-50)
  ),
  background: (
    primary: #ffffff,
    secondary: map-get($primitive-colors, gray-50),
    elevated: #ffffff
  ),
  border: (
    default: map-get($primitive-colors, gray-500),
    focus: map-get($primitive-colors, blue-500)
  ),
  status: (
    error: map-get($primitive-colors, red-500),
    success: map-get($primitive-colors, green-500),
    info: map-get($primitive-colors, blue-500)
  )
);

// Component tokens
$button-tokens: (
  padding: (
    sm: map-get($primitive-spacing, 2) map-get($primitive-spacing, 4),
    md: map-get($primitive-spacing, 3) map-get($primitive-spacing, 6),
    lg: map-get($primitive-spacing, 4) map-get($primitive-spacing, 8)
  ),
  font-size: (
    sm: map-get(map-get($primitive-typography, font-sizes), sm),
    md: map-get(map-get($primitive-typography, font-sizes), base),
    lg: map-get(map-get($primitive-typography, font-sizes), lg)
  ),
  border-radius: 4px,
  variants: (
    primary: (
      background: map-get($primitive-colors, blue-500),
      color: #ffffff,
      hover-background: map-get($primitive-colors, blue-900)
    ),
    secondary: (
      background: map-get($primitive-colors, gray-500),
      color: #ffffff,
      hover-background: map-get($primitive-colors, gray-900)
    )
  )
);
```

**2. Token Functions & Mixins:**
```scss
// Token getter functions
@function token($category, $keys...) {
  $value: null;
  
  @if $category == 'primitive-color' {
    $value: map-get($primitive-colors, nth($keys, 1));
  } @else if $category == 'semantic-color' {
    $value: deep-map-get($semantic-colors, $keys...);
  } @else if $category == 'spacing' {
    $value: map-get($primitive-spacing, nth($keys, 1));
  } @else if $category == 'typography' {
    $value: deep-map-get($primitive-typography, $keys...);
  } @else if $category == 'button' {
    $value: deep-map-get($button-tokens, $keys...);
  }
  
  @return $value;
}

// Typography mixin using tokens
@mixin typography($variant) {
  $variants: (
    h1: (
      font-size: token(typography, font-sizes, 4xl),
      font-weight: token(typography, font-weights, bold),
      line-height: token(typography, line-heights, tight)
    ),
    h2: (
      font-size: token(typography, font-sizes, 3xl),
      font-weight: token(typography, font-weights, semibold),
      line-height: token(typography, line-heights, tight)
    ),
    body: (
      font-size: token(typography, font-sizes, base),
      font-weight: token(typography, font-weights, regular),
      line-height: token(typography, line-heights, normal)
    )
  );
  
  $config: map-get($variants, $variant);
  font-size: map-get($config, font-size);
  font-weight: map-get($config, font-weight);
  line-height: map-get($config, line-height);
}

// Component generator using tokens
@mixin button($size: 'md', $variant: 'primary') {
  padding: token(button, padding, $size);
  font-size: token(button, font-size, $size);
  border-radius: token(button, border-radius);
  
  background-color: token(button, variants, $variant, background);
  color: token(button, variants, $variant, color);
  
  &:hover {
    background-color: token(button, variants, $variant, hover-background);
  }
}

// Usage
.heading {
  @include typography(h1);
  color: token(semantic-color, text, primary);
  margin-bottom: token(spacing, 6);
}

.btn-primary {
  @include button(md, primary);
}

.btn-small {
  @include button(sm, secondary);
}
```

**3. CSS Custom Properties Integration:**
```scss
// Generate CSS custom properties from tokens
:root {
  // Colors
  @each $name, $value in $primitive-colors {
    --color-#{$name}: #{$value};
  }
  
  // Spacing
  @each $name, $value in $primitive-spacing {
    --spacing-#{$name}: #{$value};
  }
  
  // Typography
  @each $name, $value in map-get($primitive-typography, font-sizes) {
    --font-size-#{$name}: #{$value};
  }
}

// Function to use CSS custom properties
@function css-var($name, $fallback: null) {
  @if $fallback {
    @return var(--#{$name}, #{$fallback});
  }
  @return var(--#{$name});
}

.element {
  color: css-var(color-blue-500);
  padding: css-var(spacing-4);
  font-size: css-var(font-size-base);
}
```

---

## 9. How do you handle complex state-based styling and component variants in SCSS?

### Answer

**1. BEM with Modifiers for State:**
```scss
// Block Element Modifier pattern
.button {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  // Element
  &__icon {
    margin-right: 8px;
  }
  
  &__text {
    flex: 1;
  }
  
  // Modifiers - Size variants
  &--small {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 16px 32px;
    font-size: 18px;
  }
  
  // Modifiers - Color variants
  &--primary {
    background-color: #007bff;
    color: white;
    
    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }
  
  &--secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: darken(#6c757d, 10%);
    }
  }
  
  // State modifiers
  &--loading {
    pointer-events: none;
    opacity: 0.6;
    
    .button__icon {
      animation: spin 1s linear infinite;
    }
  }
  
  &--disabled,
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // Combined modifiers
  &--primary#{&}--loading {
    background-color: lighten(#007bff, 20%);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**2. Variant Mixin System:**
```scss
// Define variant configuration
$button-variants: (
  primary: (
    background: #007bff,
    color: #ffffff,
    border: #007bff,
    states: (
      hover: (background: #0056b3, border: #0056b3),
      active: (background: #004085, border: #004085),
      focus: (box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25))
    )
  ),
  outline: (
    background: transparent,
    color: #007bff,
    border: #007bff,
    states: (
      hover: (background: #007bff, color: #ffffff),
      active: (background: #0056b3, border: #0056b3, color: #ffffff)
    )
  ),
  ghost: (
    background: transparent,
    color: #007bff,
    border: transparent,
    states: (
      hover: (background: rgba(0, 123, 255, 0.1)),
      active: (background: rgba(0, 123, 255, 0.2))
    )
  )
);

@mixin button-variant($variant-name) {
  $variant: map-get($button-variants, $variant-name);
  
  background-color: map-get($variant, background);
  color: map-get($variant, color);
  border: 1px solid map-get($variant, border);
  
  $states: map-get($variant, states);
  
  &:hover {
    $hover: map-get($states, hover);
    @each $prop, $value in $hover {
      #{$prop}: $value;
    }
  }
  
  &:active {
    $active: map-get($states, active);
    @each $prop, $value in $active {
      #{$prop}: $value;
    }
  }
  
  &:focus-visible {
    $focus: map-get($states, focus);
    @each $prop, $value in $focus {
      #{$prop}: $value;
    }
  }
}

// Usage
.btn-primary {
  @include button-variant(primary);
}

.btn-outline {
  @include button-variant(outline);
}

.btn-ghost {
  @include button-variant(ghost);
}
```

**3. Data Attribute Selectors for States:**
```scss
// Component with multiple states
.card {
  padding: 20px;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
  
  // State using data attributes
  &[data-state='loading'] {
    pointer-events: none;
    opacity: 0.6;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  &[data-state='error'] {
    border: 2px solid #dc3545;
    background-color: #f8d7da;
  }
  
  &[data-state='success'] {
    border: 2px solid #28a745;
    background-color: #d4edda;
  }
  
  // Variant using data attributes
  &[data-variant='elevated'] {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    &:hover {
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
  
  &[data-variant='outlined'] {
    border: 1px solid #dee2e6;
    box-shadow: none;
  }
  
  // Combine state and variant
  &[data-variant='elevated'][data-state='loading'] {
    transform: none;
  }
}
```

**4. CSS-in-JS Style with SCSS:**
```scss
// Generate classes programmatically
$states: (
  'hover': ':hover',
  'focus': ':focus',
  'active': ':active',
  'disabled': ':disabled'
);

$variants: (
  'primary': #007bff,
  'secondary': #6c757d,
  'success': #28a745,
  'danger': #dc3545
);

@each $variant-name, $color in $variants {
  .btn-#{$variant-name} {
    background-color: $color;
    color: white;
    
    @each $state-name, $state-selector in $states {
      &#{$state-selector} {
        @if $state-name == 'disabled' {
          opacity: 0.5;
          cursor: not-allowed;
        } @else {
          background-color: darken($color, 10%);
        }
      }
    }
  }
}
```

---

## 10. What are advanced SCSS debugging and optimization techniques?

### Answer

**1. Debugging Techniques:**
```scss
// Debug and error handling
@use 'sass:meta';

// Custom debug function
@function debug($value, $label: 'Debug') {
  @debug '#{$label}: #{meta.inspect($value)} (#{meta.type-of($value)})';
  @return $value;
}

// Type checking function
@function ensure-type($value, $type, $var-name: 'variable') {
  @if meta.type-of($value) != $type {
    @error '#{$var-name} must be of type #{$type}, got #{meta.type-of($value)}';
  }
  @return $value;
}

// Usage
$spacing: ensure-type(16px, 'number', 'spacing');

// Warn for deprecated features
@mixin old-button {
  @warn 'old-button mixin is deprecated. Use button-variant instead.';
  padding: 10px;
  background: blue;
}

// Source maps comment
@function trace($message) {
  // This will show in source maps
  /* DEBUG: #{$message} */
  @return null;
}
```

**2. Performance Monitoring:**
```scss
// Measure compilation impact
@function measure-impact($label) {
  $start: meta.module-functions('sass:meta');
  @debug 'Measuring: #{$label}';
  @debug 'Available functions: #{length($start)}';
  @return true;
}

// Check selector specificity
@function calc-specificity($selector) {
  // Simplified specificity calculator
  $ids: str-count($selector, '#');
  $classes: str-count($selector, '.') + str-count($selector, '[');
  $elements: str-count($selector, ' ') + 1;
  
  @return ($ids * 100) + ($classes * 10) + $elements;
}

@function str-count($string, $search) {
  $count: 0;
  $index: string.index($string, $search);
  
  @while $index {
    $count: $count + 1;
    $string: string.slice($string, $index + string.length($search));
    $index: string.index($string, $search);
  }
  
  @return $count;
}
```

**3. Output Optimization:**
```scss
// Conditional compilation
$env: 'production'; // or 'development'

@if $env == 'development' {
  // Include debug styles
  .debug-grid {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(255,0,0,0.1) 7px, rgba(255,0,0,0.1) 8px),
      repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,255,0.1) 7px, rgba(0,0,255,0.1) 8px);
    pointer-events: none;
  }
} @else {
  // Production optimizations
  // Remove debug classes
}

// Dead code elimination
$features: (
  'legacy-support': false,
  'animations': true,
  'grid-system': true
);

@if map-get($features, 'legacy-support') {
  // Legacy browser support
  .flex-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

@if map-get($features, 'animations') {
  @import 'animations';
}
```

**4. Build Optimization:**
```scss
// Partial compilation with @use
// Only compile what's needed

// _config.scss
$breakpoints: ( ... );
$colors: ( ... );

// _mixins.scss
@use 'config';

// component.scss
@use 'config';
@use 'mixins'; // This won't duplicate config

// Mixin that generates CSS only when used
@mixin optional-animation($name) {
  @if $name == 'fade' {
    @keyframes fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }
  animation: $name 0.3s;
}

// Tree-shaking friendly exports
@mixin export-if-needed($feature, $content) {
  @if global-variable-exists('exported-features') {
    @if not index($exported-features, $feature) {
      $exported-features: append($exported-features, $feature) !global;
      #{$content};
    }
  }
}
```

**5. Sourcemap & Documentation:**
```scss
/// Button component mixin
/// @group components
/// @param {String} $variant - Button variant (primary, secondary)
/// @param {String} $size - Button size (sm, md, lg)
/// @example scss
///   .my-button {
///     @include button(primary, lg);
///   }
@mixin button($variant: 'primary', $size: 'md') {
  // Implementation
}

// Inline documentation for generated CSS
@mixin documented-grid($columns) {
  /* Grid with #{$columns} columns */
  display: grid;
  grid-template-columns: repeat($columns, 1fr);
}

// Generate documentation
@function generate-docs($module-name) {
  /* 
   * Module: #{$module-name}
   * Generated: #{meta.inspect(meta.module-functions($module-name))}
   */
  @return null;
}
```

**6. Performance Best Practices:**
```scss
// 1. Avoid expensive selectors
// Bad
[class*='icon-'] { }
div > * + * { }

// Good
.icon { }
.stack > * + * { } // Specific parent

// 2. Limit nesting depth
// Use max 3 levels
.component {
  .element {
    .modifier { } // Stop here
  }
}

// 3. Use placeholder selectors for @extend
%card-base {
  border-radius: 8px;
  padding: 16px;
}

.card {
  @extend %card-base;
}

// 4. Optimize media queries
// Bad - Multiple separate queries
.header {
  @media (min-width: 768px) { }
}
.footer {
  @media (min-width: 768px) { }
}

// Good - Group same queries
@media (min-width: 768px) {
  .header { }
  .footer { }
}

// 5. Use CSS containment
.component {
  contain: layout style paint;
  // Tells browser this is isolated
}
```

---

## Summary

These top 10 questions cover:

1. **Module System** - @use vs @import, modern SCSS architecture
2. **@forward Directive** - Building scalable SCSS architectures
3. **Theming** - CSS Custom Properties + SCSS integration
4. **@mixin vs @extend** - Performance and use cases
5. **Responsive Design** - Advanced breakpoint systems, fluid typography
6. **Performance & Scale** - Architecture, optimization, code splitting
7. **Advanced Functions** - Color manipulation, math, string operations
8. **Design Tokens** - Systematic design system implementation
9. **State & Variants** - Complex component styling patterns
10. **Debugging & Optimization** - Build performance and troubleshooting

Each topic reflects real-world senior-level challenges in maintaining large-scale SCSS codebases while ensuring performance, maintainability, and developer experience.

