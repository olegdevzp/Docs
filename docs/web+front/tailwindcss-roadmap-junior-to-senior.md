# Tailwind CSS — Junior to Senior Roadmap

A learning roadmap of **Tailwind CSS** concepts, utilities, and features organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Installation and setup](#l1-installation-and-setup)
  - [Layout utilities](#l1-layout-utilities)
  - [Spacing — margin and padding](#l1-spacing--margin-and-padding)
  - [Typography](#l1-typography)
  - [Colors and backgrounds](#l1-colors-and-backgrounds)
  - [Borders and rounded corners](#l1-borders-and-rounded-corners)
  - [Sizing — width and height](#l1-sizing--width-and-height)
  - [Flexbox basics](#l1-flexbox-basics)
  - [Responsive design — breakpoints](#l1-responsive-design--breakpoints)
  - [State variants — hover, focus, active](#l1-state-variants--hover-focus-active)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Grid system](#l2-grid-system)
  - [Flexbox advanced](#l2-flexbox-advanced)
  - [Dark mode](#l2-dark-mode)
  - [Arbitrary values](#l2-arbitrary-values)
  - [Transitions and animations](#l2-transitions-and-animations)
  - [Transforms](#l2-transforms)
  - [Shadows and opacity](#l2-shadows-and-opacity)
  - [Z-index and positioning](#l2-z-index-and-positioning)
  - [Overflow and clipping](#l2-overflow-and-clipping)
  - [Object fit and aspect ratio](#l2-object-fit-and-aspect-ratio)
  - [Forms and input styling](#l2-forms-and-input-styling)
  - [Custom configuration — tailwind.config](#l2-custom-configuration--tailwindconfig)
  - [@apply and component extraction](#l2-apply-and-component-extraction)
  - [JIT mode and on-demand generation](#l2-jit-mode-and-on-demand-generation)
- [Level 3 — Senior](#level-3--senior)
  - [Plugin system](#l3-plugin-system)
  - [Design tokens and theme extension](#l3-design-tokens-and-theme-extension)
  - [CSS custom properties integration](#l3-css-custom-properties-integration)
  - [Multi-theme support](#l3-multi-theme-support)
  - [Content configuration and purging](#l3-content-configuration-and-purging)
  - [Layers — base, components, utilities](#l3-layers--base-components-utilities)
  - [Tailwind with CSS Modules and frameworks](#l3-tailwind-with-css-modules-and-frameworks)
  - [Performance and bundle optimization](#l3-performance-and-bundle-optimization)
  - [Accessibility utilities](#l3-accessibility-utilities)
  - [Tailwind v4 — new architecture](#l3-tailwind-v4--new-architecture)
  - [Design system architecture](#l3-design-system-architecture)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Utilities marked with `*` are the most commonly used in day-to-day work.
- Framework-specific tooling (Headless UI, shadcn/ui, Flowbite) is explicitly excluded — this roadmap focuses on raw Tailwind CSS.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single class.

| Term | What it is |
|---|---|
| **Utility class** | A single-purpose CSS class that applies one specific style rule, e.g. `text-center` applies `text-align: center`. |
| **Utility-first** | A design methodology where you compose styles by stacking small utility classes instead of writing custom CSS. |
| **Responsive prefix** | A screen-size modifier prepended to a utility: `md:flex` applies `display: flex` only at the `md` breakpoint and above. |
| **State variant** | A modifier that applies a utility under a specific condition: `hover:bg-blue-500`, `focus:ring-2`. |
| **JIT (Just-in-Time)** | Tailwind's compiler that generates only the CSS classes actually used in your source files. Default since v3. |
| **tailwind.config.js** | The configuration file where you extend the default theme, add plugins, and define content paths. |
| **Purging / content** | The process of scanning source files to determine which classes to include in the final CSS build. |
| **Design tokens** | Named values (colors, spacing, fonts) defined in the theme that map to CSS output. |
| **`@layer`** | A CSS at-rule Tailwind uses to organize styles into three buckets: `base`, `components`, `utilities`. |
| **Preflight** | Tailwind's CSS reset (based on modern-normalize) injected into the `base` layer automatically. |

> **Gotcha:** Tailwind does not work by scanning a CSS file for classes — it scans your **source code** (HTML, JSX, Vue, etc.) for class names. Dynamically constructing partial class names like `` `text-${color}-500` `` will break purging because the full string never appears in source.

---

### L1 Installation and setup

```bash
# install Tailwind and its peer dependencies (v3)
npm install --save-dev tailwindcss postcss autoprefixer

# generate config files
npx tailwindcss init -p
```

**Minimal `tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`src/index.css` — add the three directives:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Run the build watcher:**
```bash
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

> **Gotcha:** If you skip the `content` paths, Tailwind generates an empty CSS file in production because JIT finds no classes to emit. The most common cause of "where did all my styles go?" in deployment.

---

### L1 Layout utilities

Control how elements participate in layout flow.

| Class | CSS output | Notes |
|---|---|---|
| `block` `*` | `display: block` | Default for most HTML elements |
| `inline-block` `*` | `display: inline-block` | |
| `inline` | `display: inline` | |
| `flex` `*` | `display: flex` | Enables flexbox on container |
| `grid` `*` | `display: grid` | Enables grid on container |
| `hidden` `*` | `display: none` | Hides element, removes from flow |
| `invisible` | `visibility: hidden` | Hides but preserves space |
| `static` `relative` `absolute` `fixed` `sticky` `*` | `position: …` | Position modes |
| `inset-0` `top-0` `right-0` `bottom-0` `left-0` `*` | `inset: 0` etc. | Positioning offsets |
| `container` `*` | Centers content with responsive `max-width` | Needs `mx-auto` to actually center |

```html
<!-- centered page wrapper -->
<div class="container mx-auto px-4">…</div>

<!-- absolutely positioned overlay -->
<div class="relative">
  <div class="absolute inset-0 bg-black/50">…</div>
</div>
```

> **Gotcha:** `container` only sets `max-width` — it does **not** add `margin: auto`. You must add `mx-auto` yourself to center it.

---

### L1 Spacing — margin and padding

Tailwind uses a **4px base unit** by default. `1` = `0.25rem` = `4px`.

| Pattern | Example | CSS |
|---|---|---|
| `p-{n}` `*` | `p-4` | `padding: 1rem` |
| `px-{n}` `*` | `px-6` | `padding-left: 1.5rem; padding-right: 1.5rem` |
| `py-{n}` `*` | `py-2` | `padding-top: 0.5rem; padding-bottom: 0.5rem` |
| `pt-` `pr-` `pb-` `pl-` | `pt-8` | Individual sides |
| `m-{n}` `*` | `m-4` | `margin: 1rem` |
| `mx-auto` `*` | | `margin-left: auto; margin-right: auto` |
| `my-{n}` | `my-6` | Vertical margin |
| `-m-{n}` | `-m-2` | Negative margin |
| `space-x-{n}` `*` | `space-x-4` | Adds `margin-left` to all children except first (using `* + *` selector) |
| `space-y-{n}` `*` | `space-y-2` | Vertical gap between children |

```html
<div class="px-6 py-4 mt-8 space-y-4">
  <p class="mb-0">First</p>
  <p>Second</p>
</div>
```

> **Gotcha:** `space-x-*` and `space-y-*` work via a CSS `> * + *` selector and break when children are wrapped in fragments or conditionally rendered. Use `gap-*` on a flex/grid container instead when possible.

---

### L1 Typography

| Class | What it does |
|---|---|
| `text-xs` `text-sm` `text-base` `text-lg` `text-xl` `text-2xl` … `text-9xl` `*` | Font size |
| `font-thin` `font-normal` `font-medium` `font-semibold` `font-bold` `font-extrabold` `*` | Font weight |
| `italic` `not-italic` | Font style |
| `text-left` `text-center` `text-right` `text-justify` `*` | Text alignment |
| `leading-none` `leading-tight` `leading-snug` `leading-normal` `leading-relaxed` `leading-loose` `*` | Line height |
| `tracking-tighter` `tracking-tight` `tracking-normal` `tracking-wide` `tracking-wider` `tracking-widest` | Letter spacing |
| `uppercase` `lowercase` `capitalize` `normal-case` | Text transform |
| `truncate` `*` | Single-line overflow with ellipsis |
| `line-clamp-{n}` `*` | Multi-line clamp with ellipsis (built-in since v3.3) |
| `underline` `no-underline` `line-through` | Text decoration |
| `antialiased` `subpixel-antialiased` | Font smoothing |
| `font-sans` `font-serif` `font-mono` `*` | Font family stack |

```html
<h1 class="text-3xl font-bold tracking-tight text-gray-900">Heading</h1>
<p class="text-base leading-relaxed text-gray-600 line-clamp-3">Long paragraph…</p>
```

---

### L1 Colors and backgrounds

Tailwind ships with a full palette where each color has shades `50`–`950`.

| Class | What it does |
|---|---|
| `text-{color}-{shade}` `*` | Text color, e.g. `text-blue-600` |
| `bg-{color}-{shade}` `*` | Background color, e.g. `bg-gray-100` |
| `bg-white` `bg-black` `bg-transparent` `*` | Named background colors |
| `text-white` `text-black` | Named text colors |
| `bg-opacity-{amount}` | Background opacity (legacy; prefer slash syntax) |
| `bg-blue-500/75` `*` | Background color with `75%` opacity (slash syntax, v3+) |
| `text-blue-600/80` | Text color with opacity |

**Available palette colors:** `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`.

```html
<div class="bg-indigo-600 text-white px-4 py-2 rounded">Button</div>
<div class="bg-gray-900/80 text-gray-100">Dark overlay</div>
```

> **Gotcha:** Shades go up to `950` since Tailwind v3.3. If you reference `gray-900` you may still want `gray-950` for true near-black.

---

### L1 Borders and rounded corners

| Class | What it does |
|---|---|
| `border` `*` | `border-width: 1px` |
| `border-{n}` | `border-0` `border-2` `border-4` `border-8` |
| `border-t` `border-r` `border-b` `border-l` | Single-side border |
| `border-{color}-{shade}` `*` | Border color, e.g. `border-gray-300` |
| `border-transparent` | |
| `rounded` `*` | `border-radius: 0.25rem` |
| `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-3xl` `rounded-full` `*` | Border radius scale |
| `rounded-t-*` `rounded-r-*` `rounded-b-*` `rounded-l-*` | Per-side rounding |
| `divide-x-{n}` `divide-y-{n}` `*` | Adds borders between children |
| `divide-{color}-{shade}` | Divider color |

```html
<input class="border border-gray-300 rounded-md px-3 py-2 focus:border-indigo-500">
<ul class="divide-y divide-gray-200">
  <li class="py-3">Item</li>
  <li class="py-3">Item</li>
</ul>
```

---

### L1 Sizing — width and height

| Class | CSS | Notes |
|---|---|---|
| `w-{n}` `*` | `width: {n * 0.25}rem` | e.g. `w-16` = `4rem` |
| `w-full` `*` | `width: 100%` | |
| `w-screen` | `width: 100vw` | |
| `w-auto` | `width: auto` | |
| `w-1/2` `w-1/3` `w-2/3` `w-1/4` … `*` | Percentage widths | |
| `max-w-sm` `max-w-md` `max-w-lg` `max-w-xl` `max-w-2xl` `max-w-screen-xl` `*` | `max-width` | |
| `max-w-none` | Removes max-width | |
| `min-w-0` `min-w-full` | `min-width` | `min-w-0` is crucial inside flex to allow shrinking |
| `h-{n}` `*` | `height: {n * 0.25}rem` | |
| `h-full` `*` | `height: 100%` | Parent must have explicit height |
| `h-screen` | `height: 100vh` | |
| `h-svh` `h-dvh` `h-lvh` | Viewport units for mobile | Available since v3.4 |
| `min-h-screen` `*` | `min-height: 100vh` | |
| `size-{n}` `*` | Sets both `width` and `height` | Shorthand since v3.4 |

---

### L1 Flexbox basics

Apply `flex` to a container, then control its children.

| Class | CSS | Applied to |
|---|---|---|
| `flex` `*` | `display: flex` | Container |
| `flex-row` `*` | `flex-direction: row` | Container |
| `flex-col` `*` | `flex-direction: column` | Container |
| `flex-row-reverse` `flex-col-reverse` | | Container |
| `flex-wrap` `flex-nowrap` `*` | `flex-wrap: …` | Container |
| `justify-start` `justify-center` `justify-end` `justify-between` `justify-around` `justify-evenly` `*` | `justify-content: …` | Container |
| `items-start` `items-center` `items-end` `items-stretch` `items-baseline` `*` | `align-items: …` | Container |
| `gap-{n}` `*` | `gap: …` | Container |
| `gap-x-{n}` `gap-y-{n}` | Column/row gap | Container |
| `flex-1` `*` | `flex: 1 1 0%` | Child — grow and shrink equally |
| `flex-auto` | `flex: 1 1 auto` | Child |
| `flex-none` `*` | `flex: none` | Child — prevent grow/shrink |
| `grow` `grow-0` `*` | `flex-grow: 1 / 0` | Child |
| `shrink` `shrink-0` `*` | `flex-shrink: 1 / 0` | Child |
| `order-{n}` `order-first` `order-last` | `order: …` | Child |
| `self-auto` `self-start` `self-center` `self-end` | `align-self: …` | Child |

```html
<!-- centered card -->
<div class="flex items-center justify-center min-h-screen">
  <div class="flex flex-col gap-4 w-full max-w-md">…</div>
</div>

<!-- navigation bar -->
<nav class="flex items-center justify-between px-6 h-16">
  <span class="flex-none font-bold">Logo</span>
  <ul class="flex gap-6">…</ul>
</nav>
```

> **Gotcha:** `flex-1` sets `flex-basis: 0` — the element ignores its content size when distributing space. `flex-auto` uses `flex-basis: auto` and respects content size. Use `flex-1` for equal-width columns, `flex-auto` when content size should matter.

---

### L1 Responsive design — breakpoints

Tailwind uses a **mobile-first** approach. Unprefixed utilities apply to all screen sizes; prefixed ones apply at that breakpoint **and above**.

| Prefix | Min-width | Typical target |
|---|---|---|
| _(none)_ | `0px` | Mobile (base) |
| `sm:` | `640px` | Large phones / landscape |
| `md:` `*` | `768px` | Tablets |
| `lg:` `*` | `1024px` | Small laptops |
| `xl:` | `1280px` | Desktops |
| `2xl:` | `1536px` | Large desktops |

```html
<!-- stack on mobile, side-by-side from md upward -->
<div class="flex flex-col md:flex-row gap-6">
  <aside class="w-full md:w-64 shrink-0">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>

<!-- hide on mobile, show from lg upward -->
<nav class="hidden lg:flex gap-4">…</nav>
```

> **Gotcha:** There is no `xs:` prefix and there is no "max-width" prefix in vanilla Tailwind v3. To apply styles **only** on mobile, set them as the base and override at `sm:`. For true max-width logic use `max-sm:hidden` (available in v3.2+).

---

### L1 State variants — hover, focus, active

Prepend a variant to any utility to scope it to a state.

| Variant | Triggers when |
|---|---|
| `hover:` `*` | Mouse is over the element |
| `focus:` `*` | Element has keyboard/programmatic focus |
| `focus-visible:` `*` | Focus is from keyboard only (not mouse click) — accessibility best practice |
| `active:` | Mouse button is held down |
| `visited:` | Link has been visited |
| `disabled:` `*` | Element has `disabled` attribute |
| `checked:` | Checkbox/radio is checked |
| `placeholder:` | `::placeholder` pseudo-element |
| `first:` `last:` `odd:` `even:` | Positional child selectors |
| `group-hover:` `*` | When ancestor with `group` class is hovered |
| `peer-focus:` `*` | When sibling with `peer` class is focused |

```html
<!-- button with hover and focus-visible states -->
<button class="bg-indigo-600 text-white px-4 py-2 rounded
               hover:bg-indigo-700 active:bg-indigo-800
               focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500
               disabled:opacity-50 disabled:cursor-not-allowed">
  Submit
</button>

<!-- group: hover parent to style child -->
<div class="group flex items-center gap-2 cursor-pointer">
  <span class="text-gray-700 group-hover:text-indigo-600">Label</span>
  <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-600">…</svg>
</div>
```

> **Gotcha:** Prefer `focus-visible:` over `focus:` for custom focus rings. `focus:` triggers on mouse clicks too, which makes rings appear unnecessarily. `focus-visible:` only shows the ring for keyboard navigation.

---

## Level 2 — Mid-level

### L2 Grid system

| Class | CSS | Notes |
|---|---|---|
| `grid` `*` | `display: grid` | Enable grid on container |
| `grid-cols-{n}` `*` | `grid-template-columns: repeat(n, minmax(0,1fr))` | `n` = 1–12 |
| `grid-cols-none` | Removes column definition | |
| `col-span-{n}` `*` | `grid-column: span n / span n` | Child spans n columns |
| `col-span-full` | Span all columns | |
| `col-start-{n}` `col-end-{n}` | Explicit grid placement | |
| `grid-rows-{n}` | `grid-template-rows: repeat(n, minmax(0,1fr))` | |
| `row-span-{n}` | `grid-row: span n` | |
| `gap-{n}` `gap-x-{n}` `gap-y-{n}` `*` | Grid/flex gap | |
| `auto-cols-auto` `auto-cols-min` `auto-cols-max` `auto-cols-fr` | Implicit column sizing | |
| `grid-flow-row` `grid-flow-col` `grid-flow-dense` `*` | `grid-auto-flow` | `dense` fills holes |
| `place-items-center` `*` | Centers both axes | Shorthand for `items-center justify-items-center` |
| `place-content-center` | | |
| `justify-items-start` `justify-items-center` `justify-items-end` `justify-items-stretch` | Horizontal alignment of items within their cell | |

```html
<!-- responsive image grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="col-span-1">…</div>
  <div class="col-span-2">…</div><!-- wide card -->
</div>

<!-- dashboard layout -->
<div class="grid grid-cols-12 gap-4">
  <aside class="col-span-12 md:col-span-3">Sidebar</aside>
  <main  class="col-span-12 md:col-span-9">Main</main>
</div>
```

> **Gotcha:** `grid-cols-{n}` creates equal `1fr` columns — they expand to fill available space. If you want content-sized columns use `grid-cols-[auto_1fr]` (arbitrary value syntax).

---

### L2 Flexbox advanced

| Class | What it does |
|---|---|
| `basis-{n}` `*` | `flex-basis` — starting size before grow/shrink |
| `basis-full` `basis-1/2` `basis-1/3` | Fractional flex-basis |
| `content-start` `content-center` `content-between` | `align-content` — controls row packing in multi-line flex |
| `flex-wrap` + `gap-{n}` `*` | Responsive wrapping with even spacing |
| `order-first` `order-last` `order-{n}` | Reorder children visually |

```html
<!-- tag cloud that wraps -->
<div class="flex flex-wrap gap-2">
  <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Tag A</span>
  <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Tag B</span>
</div>
```

---

### L2 Dark mode

Tailwind supports `dark:` variant driven by either a media query or a class.

**`tailwind.config.js`:**
```js
module.exports = {
  darkMode: 'class', // 'media' | 'class' | ['class', '[data-theme="dark"]']
  // …
}
```

| Variant | Triggers when |
|---|---|
| `dark:` (media) | OS prefers dark color scheme |
| `dark:` (class) | Ancestor has `dark` class applied |

```html
<html class="dark"> <!-- toggle this class with JS -->
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      …
    </div>
  </body>
</html>
```

> **Gotcha:** When using `darkMode: 'class'`, the `dark` class must be on the `<html>` element (or whichever ancestor you define) — not just anywhere in the DOM.

---

### L2 Arbitrary values

Square brackets let you escape the design system for one-off values.

```html
<!-- arbitrary color -->
<div class="bg-[#1da1f2] text-[#fff]">Twitter blue</div>

<!-- arbitrary size -->
<div class="w-[37.5rem] h-[calc(100vh-4rem)]">…</div>

<!-- arbitrary grid template -->
<div class="grid grid-cols-[1fr_2fr_1fr]">…</div>

<!-- arbitrary CSS property via a bracket utility -->
<div class="[mask-image:linear-gradient(to_bottom,black,transparent)]">…</div>

<!-- arbitrary variant (CSS selector or media query) -->
<div class="[&:nth-child(3)]:bg-indigo-100">…</div>
<div class="[@media(min-width:900px)]:flex">…</div>
```

> **Gotcha:** Spaces inside arbitrary values must be replaced with underscores `_`. Tailwind converts underscores to spaces during compilation. This is why `grid-cols-[1fr_2fr]` works but `grid-cols-[1fr 2fr]` does not.

---

### L2 Transitions and animations

| Class | CSS |
|---|---|
| `transition` `*` | `transition-property: color, background-color, …; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms` |
| `transition-all` | Transitions every property |
| `transition-colors` `*` | Transitions only color-related properties |
| `transition-opacity` `transition-shadow` `transition-transform` | Specific property transitions |
| `duration-{n}` `*` | `transition-duration` — 75, 100, 150, 200, 300, 500, 700, 1000 ms |
| `ease-linear` `ease-in` `ease-out` `ease-in-out` `*` | `transition-timing-function` |
| `delay-{n}` | `transition-delay` |
| `animate-spin` `*` | Infinite rotation (loader icons) |
| `animate-ping` | Ripple/ping effect |
| `animate-pulse` `*` | Opacity fade (skeleton loaders) |
| `animate-bounce` | Bounce effect |
| `animate-none` | Disable animation |

```html
<!-- smooth hover button -->
<button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded
               transition-colors duration-200 ease-in-out">
  Hover me
</button>

<!-- loading spinner -->
<svg class="animate-spin h-5 w-5 text-indigo-600" …>…</svg>

<!-- skeleton loader -->
<div class="animate-pulse bg-gray-200 rounded h-4 w-3/4"></div>
```

---

### L2 Transforms

| Class | CSS |
|---|---|
| `scale-{n}` `*` | `transform: scale(n/100)` — e.g. `scale-110` = `1.1` |
| `scale-x-{n}` `scale-y-{n}` | Axis-specific scale |
| `rotate-{n}` `*` | `transform: rotate(ndeg)` — 0, 1, 2, 3, 6, 12, 45, 90, 180 |
| `-rotate-{n}` | Negative rotation |
| `translate-x-{n}` `translate-y-{n}` `*` | `transform: translateX/Y` |
| `skew-x-{n}` `skew-y-{n}` | `transform: skewX/Y` |
| `origin-center` `origin-top` `origin-top-left` … | `transform-origin` |

```html
<!-- hover lift card effect -->
<div class="transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02]
            rounded-xl shadow-md p-6 bg-white cursor-pointer">
  Card
</div>
```

---

### L2 Shadows and opacity

| Class | What it does |
|---|---|
| `shadow-sm` `shadow` `shadow-md` `shadow-lg` `shadow-xl` `shadow-2xl` `*` | Box shadow scale |
| `shadow-none` | Remove shadow |
| `shadow-inner` | Inward shadow |
| `shadow-{color}-{shade}/{opacity}` | Colored shadow (v3.1+) |
| `drop-shadow-{size}` | CSS `filter: drop-shadow()` — works on `<svg>` and transparent PNGs |
| `opacity-{n}` `*` | `opacity: n/100` — 0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100 |
| `ring-{n}` `*` | `box-shadow` based focus ring — 1, 2, 4, 8 |
| `ring-{color}-{shade}` `*` | Ring color |
| `ring-offset-{n}` | Space between element and ring |
| `ring-inset` | Draw ring inward |

```html
<input class="border rounded-md px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
```

---

### L2 Z-index and positioning

| Class | CSS |
|---|---|
| `z-0` `z-10` `z-20` `z-30` `z-40` `z-50` `z-auto` `*` | `z-index` |
| `z-[100]` | Arbitrary z-index |
| `top-{n}` `right-{n}` `bottom-{n}` `left-{n}` `*` | Offset utilities |
| `inset-{n}` `*` | All-sides offset shorthand |
| `inset-x-{n}` `inset-y-{n}` | Axis shortcuts |

```html
<!-- fixed overlay modal backdrop -->
<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
  <div class="relative z-50 bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
    …
  </div>
</div>
```

---

### L2 Overflow and clipping

| Class | CSS |
|---|---|
| `overflow-hidden` `*` | `overflow: hidden` |
| `overflow-auto` `*` | `overflow: auto` |
| `overflow-scroll` | Force scrollbars |
| `overflow-x-auto` `overflow-y-auto` `*` | Axis-specific |
| `overflow-x-hidden` `*` | Hide horizontal overflow |
| `truncate` `*` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `text-ellipsis` `text-clip` | `text-overflow` only |
| `whitespace-nowrap` `*` | `white-space: nowrap` |
| `whitespace-pre` `whitespace-pre-wrap` | Preserve whitespace |

---

### L2 Object fit and aspect ratio

| Class | CSS |
|---|---|
| `object-cover` `*` | `object-fit: cover` |
| `object-contain` | `object-fit: contain` |
| `object-fill` | `object-fit: fill` |
| `object-none` `object-scale-down` | |
| `object-center` `object-top` `object-bottom` `*` | `object-position` |
| `aspect-square` `*` | `aspect-ratio: 1 / 1` |
| `aspect-video` `*` | `aspect-ratio: 16 / 9` |
| `aspect-auto` | `aspect-ratio: auto` |
| `aspect-[n/m]` | Arbitrary aspect ratio |

```html
<!-- responsive image that fills card without distortion -->
<div class="aspect-video overflow-hidden rounded-xl">
  <img class="w-full h-full object-cover object-center" src="…" alt="…">
</div>
```

---

### L2 Forms and input styling

Tailwind applies Preflight which strips default browser styles. Add `@tailwindcss/forms` plugin for better base form styles.

```bash
npm install --save-dev @tailwindcss/forms
```
```js
// tailwind.config.js
plugins: [require('@tailwindcss/forms')]
```

Common form patterns:
```html
<!-- text input -->
<input type="text"
  class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
         placeholder:text-gray-400
         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
         disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500">

<!-- select -->
<select class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500">
  <option>Option A</option>
</select>

<!-- checkbox with peer label -->
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="peer rounded border-gray-300 text-indigo-600
                                focus:ring-indigo-500">
  <span class="text-sm text-gray-700 peer-checked:text-indigo-700 peer-checked:font-medium">
    Accept terms
  </span>
</label>
```

---

### L2 Custom configuration — tailwind.config

**Extending (safe — merges with defaults):**
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          500: '#6366f1',
          900: '#1e1b4b',
        },
      },
      fontFamily: {
        display: ['Inter var', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
}
```

**Overriding (replaces defaults entirely — use carefully):**
```js
module.exports = {
  theme: {
    // ⚠️ This REMOVES all default colors — only 'brand' will exist
    colors: {
      brand: '#6366f1',
    },
  },
}
```

> **Gotcha:** Keys inside `theme.extend` are **merged** with defaults. Keys directly inside `theme` (outside `extend`) **replace** defaults entirely. A common mistake is putting `colors` inside `theme` instead of `theme.extend` and losing the entire default palette.

---

### L2 @apply and component extraction

`@apply` lets you compose utilities into a reusable CSS class.

```css
/* src/components.css */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-4 py-2
           rounded-md text-sm font-medium transition-colors duration-150
           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
  }

  .btn-primary {
    @apply btn bg-indigo-600 text-white hover:bg-indigo-700
           focus-visible:outline-indigo-600;
  }

  .btn-ghost {
    @apply btn bg-transparent text-gray-700 hover:bg-gray-100;
  }
}
```

Usage:
```html
<button class="btn-primary">Save</button>
<button class="btn-ghost">Cancel</button>
```

> **Gotcha:** Overuse of `@apply` re-introduces the problems utility-first CSS is designed to solve: you lose colocation and make styles harder to trace. Reserve it for genuine component abstractions (buttons, badges, form controls) that appear hundreds of times across the codebase.

---

### L2 JIT mode and on-demand generation

JIT (Just-in-Time) is the default compiler since Tailwind v3. Key behaviours to understand:

- Generates **only used classes** — the final CSS file can be as small as a few KB.
- Supports **arbitrary values** out of the box (`w-[37px]`, `bg-[#abc]`).
- Supports **stacking of multiple variants** (`dark:sm:hover:bg-indigo-600`).
- Requires accurate **`content` paths** — missed paths = missing styles.

```js
// tailwind.config.js — critical to get right
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    // if you use a component library that adds classes, include its paths:
    './node_modules/@myorg/ui/dist/**/*.js',
  ],
}
```

> **Gotcha:** Do not generate class names dynamically from variables (e.g., `` `bg-${color}-500` ``). JIT scans for static strings. The full class name must appear as a complete literal somewhere in your source files. Use an object lookup map instead:
> ```js
> const colorMap = { primary: 'bg-indigo-500', danger: 'bg-red-500' }
> <div class={colorMap[variant]}>…</div>
> ```

---

## Level 3 — Senior

### L3 Plugin system

Tailwind's plugin API lets you add utilities, components, base styles, and variants programmatically.

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    // 1. Add a custom utility
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgb(0 0 0 / 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgb(0 0 0 / 0.15)',
        },
      })
    }),

    // 2. Add a custom component with theme values
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.md'),
        },
      })
    }),

    // 3. Add a custom variant
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus-visible'])
      addVariant('not-last', '&:not(:last-child)')
    }),
  ],
}
```

Usage after defining the variant:
```html
<button class="hocus:bg-indigo-700 not-last:border-b">…</button>
```

**First-party plugins:**

| Package | Adds |
|---|---|
| `@tailwindcss/forms` | Better base styles for form elements |
| `@tailwindcss/typography` | `prose` classes for rich text from CMS/markdown |
| `@tailwindcss/aspect-ratio` | Legacy aspect-ratio support (built-in since v3) |
| `@tailwindcss/container-queries` | `@container` query variants (`@sm:`, `@lg:`, etc.) |

---

### L3 Design tokens and theme extension

Structure your `tailwind.config` as the single source of truth for all design decisions.

```js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        // Semantic aliases point to palette colors
        primary: {
          DEFAULT: colors.indigo[600],
          hover:   colors.indigo[700],
          light:   colors.indigo[50],
          dark:    colors.indigo[900],
        },
        surface: {
          DEFAULT: colors.white,
          muted:   colors.gray[50],
          subtle:  colors.gray[100],
        },
        danger:  colors.red,
        success: colors.green,
        warning: colors.amber,
      },
      // Typography scale
      fontSize: {
        'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem',    { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      // Consistent easing curves
      transitionTimingFunction: {
        'in-expo':  'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
}
```

Benefits of semantic tokens:
- `bg-primary` instead of `bg-indigo-600` — rebrand by changing one token.
- Dark mode swaps become one mapping, not thousands of `dark:` overrides.

---

### L3 CSS custom properties integration

Connect Tailwind tokens to CSS custom properties for runtime theming.

```css
/* globals.css */
@layer base {
  :root {
    --color-primary: theme('colors.indigo.600');
    --color-surface: theme('colors.white');
    --radius-card: theme('borderRadius.xl');
  }

  [data-theme='dark'] {
    --color-primary: theme('colors.indigo.400');
    --color-surface: theme('colors.gray.900');
  }
}
```

Reference in config:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Tailwind class reads the CSS var at runtime
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
}
```

```html
<div class="bg-surface text-primary rounded-card p-6">
  Changes with theme switch without rebuilding CSS
</div>
```

---

### L3 Multi-theme support

**Strategy 1 — class-based themes:**
```js
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
}
```

**Strategy 2 — multiple CSS variable sets:**
```css
[data-theme='light'] { --bg: #ffffff; --fg: #111827; }
[data-theme='dark']  { --bg: #111827; --fg: #f9fafb; }
[data-theme='ocean'] { --bg: #0f172a; --fg: #e2e8f0; }
```

**Strategy 3 — Tailwind config presets (shared configs):**
```js
// packages/design-tokens/tailwind.preset.js
module.exports = {
  theme: {
    extend: { /* shared tokens */ },
  },
}

// apps/web/tailwind.config.js
module.exports = {
  presets: [require('@myorg/design-tokens/tailwind.preset')],
  theme: {
    extend: { /* app-specific overrides */ },
  },
}
```

---

### L3 Content configuration and purging

Fine-grained control over what Tailwind scans and what it keeps.

```js
module.exports = {
  content: {
    files: [
      './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
      './node_modules/@myorg/ui/dist/**/*.{js,cjs,mjs}',
    ],
    // Transform file content before scanning (e.g. extract from JSON data files)
    transform: {
      'js': (content) => content.replace(/clsx\(([^)]*)\)/g, '$1'),
    },
    // Manually safelist classes that are assembled dynamically
    safelist: [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      { pattern: /bg-(red|yellow|green)-(100|500|900)/ },
      { pattern: /^(mt|mb|ml|mr|mx|my)-/, variants: ['sm', 'md'] },
    ],
  },
}
```

> **Gotcha:** When using the `safelist` pattern option, the regex matches the full class string including variant prefixes — so `pattern: /^text-/` does NOT match `hover:text-red-500`. Use `variants` array to cover variants explicitly.

---

### L3 Layers — base, components, utilities

Understanding Tailwind's three-layer cascade is essential for writing maintainable CSS.

| Layer | Purpose | Specificity |
|---|---|---|
| `@layer base` | Global resets and HTML element defaults (`h1`, `a`, `body`, etc.) | Lowest |
| `@layer components` | Reusable component classes (`.btn`, `.card`, `.badge`) | Medium |
| `@layer utilities` | Single-purpose utility overrides | Highest |

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight text-gray-900;
  }
  a {
    @apply text-indigo-600 underline hover:text-indigo-800;
  }
}

@layer components {
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
  }
  .badge-green  { @apply badge bg-green-100 text-green-800; }
  .badge-red    { @apply badge bg-red-100 text-red-800; }
}

@layer utilities {
  /* safe to add custom one-off utilities here */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
}
```

> **Gotcha:** Styles added outside of `@layer` have a higher specificity than Tailwind utilities and cannot be overridden by utility classes in HTML. Always place custom CSS inside a `@layer` directive.

---

### L3 Tailwind with CSS Modules and frameworks

**With Next.js (App Router):**
- Install `tailwindcss` and configure `postcss.config.js` — Next.js handles the rest.
- Use `cn()` / `clsx` + `tailwind-merge` to safely merge conditional classes:

```bash
npm install clsx tailwind-merge
```
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
```tsx
<div className={cn('px-4 py-2 bg-gray-100', isActive && 'bg-indigo-600 text-white')}>
```

**With CSS Modules:** Use `@apply` inside `.module.css` files — Tailwind processes them through PostCSS.

```css
/* Button.module.css */
.root {
  @apply inline-flex items-center px-4 py-2 rounded-md font-medium
         transition-colors duration-150;
}
```

**`tailwind-merge` — why it matters:**

Without merge: `"px-4 px-6"` — both classes exist, last one wins (fragile).  
With merge: `twMerge('px-4', 'px-6')` → `"px-6"` — earlier conflicting utilities are removed.

---

### L3 Performance and bundle optimization

1. **Audit content paths** — run `npx tailwindcss --content '…' --minify` and check output size.
2. **Disable unused core plugins** to reduce JIT scanning work:
```js
module.exports = {
  corePlugins: {
    float: false,       // rarely used
    clear: false,
    skew: false,
  },
}
```
3. **Enable `cssnano`** for production minification:
```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
```
4. **Avoid `@apply` in hot paths** — each `@apply` call resolves at build time but adds CSS weight. Prefer utility classes in markup for components rendered thousands of times.
5. **Use `@tailwindcss/typography` selectively** — the `prose` class adds ~10 KB. Apply it only to actual content areas.

---

### L3 Accessibility utilities

| Class | What it does |
|---|---|
| `sr-only` `*` | Visually hidden but readable by screen readers (`position: absolute; width: 1px; height: 1px; …`) |
| `not-sr-only` | Reverses `sr-only` |
| `focus-visible:ring-2` `*` | Show focus ring only for keyboard navigation |
| `motion-reduce:transition-none` | Disables transitions when OS has reduced motion enabled |
| `motion-reduce:animate-none` | Disables animations for motion-sensitive users |
| `forced-colors:border` | Adds border in Windows High Contrast mode |
| `print:hidden` `print:block` | Control visibility during printing |
| `aria-*` variants | Style based on ARIA attributes: `aria-checked:bg-indigo-600` |

```html
<!-- screen reader only label -->
<button>
  <svg …>…</svg>
  <span class="sr-only">Close menu</span>
</button>

<!-- safe animation for all users -->
<div class="animate-spin motion-reduce:animate-none">…</div>

<!-- ARIA-driven styling -->
<li role="option" aria-selected="true"
    class="px-3 py-2 aria-selected:bg-indigo-600 aria-selected:text-white">
  Option
</li>
```

---

### L3 Tailwind v4 — new architecture

Tailwind v4 (released 2025) introduces a fundamentally new engine.

| Change | v3 | v4 |
|---|---|---|
| Config format | `tailwind.config.js` | CSS-first: `@import "tailwindcss"` in your CSS file |
| Theme definition | JS object in config | CSS custom properties via `@theme` |
| PostCSS dependency | Required | Optional — has a native Vite plugin |
| `@tailwind` directives | `@tailwind base/components/utilities` | Replaced by `@import "tailwindcss"` |
| Arbitrary properties | `[mask:…]` | Same, plus `:` as alternative to `_` for spaces |
| Container queries | Plugin | Built-in |
| 3D transforms | Not included | Built-in |
| Performance | Fast | ~5× faster full builds, ~100× faster incremental |

**v4 CSS-first config:**
```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.5 0.2 260);
  --font-display: "Inter var", sans-serif;
  --radius-card: 1rem;
}
```

> **Gotcha:** v4 uses OKLCH color space by default for its palette. Colors defined in `@theme` as hex or rgb still work, but new generated palette colors use OKLCH. This affects `opacity-*` modifiers and color mixing.

---

### L3 Design system architecture

Senior-level usage means treating Tailwind as infrastructure, not just a styling tool.

**Monorepo token package:**
```
packages/
  tokens/
    tailwind.preset.js   ← shared config preset
    tokens.css           ← CSS custom properties
  ui/
    src/
      Button/Button.tsx
      Button/Button.stories.tsx
apps/
  web/
    tailwind.config.js   ← extends preset
  mobile-web/
    tailwind.config.js   ← extends preset with overrides
```

**Key architectural decisions at this level:**

| Decision | Considerations |
|---|---|
| `@apply` vs utility classes | Prefer utilities in markup; `@apply` only for stable design-system primitives |
| Semantic tokens vs raw palette | Semantic tokens (`bg-primary`) enable theming; raw palette (`bg-indigo-600`) is faster to prototype |
| `tailwind-merge` + `clsx` | Mandatory in any component library to handle variant merging safely |
| CSS variables vs JS theme | CSS variables enable runtime theming; JS theme is build-time only |
| Single config vs presets | Use presets in monorepos; single config for single apps |
| Design token source of truth | Keep tokens in one place — either Tailwind config or a design tool export (Style Dictionary, Tokens Studio) |

**Production checklist:**
- [ ] `content` paths cover all source files including third-party components
- [ ] `safelist` covers all dynamically assembled class names
- [ ] `darkMode` strategy is explicitly defined
- [ ] Focus styles pass WCAG 2.1 AA (visible, 3:1 contrast ratio minimum)
- [ ] `motion-reduce:` variants applied to all transitions and animations
- [ ] Bundle size audited with `npx tailwindcss --minify` output
- [ ] No dynamic class name construction without a safelist or lookup map

---

## Quick reference table

| Concept | Junior | Mid | Senior |
|---|---|---|---|
| Utility-first mental model | ✅ | ✅ | ✅ |
| Responsive prefixes (`md:`, `lg:`) | ✅ | ✅ | ✅ |
| Flexbox utilities | ✅ | ✅ | ✅ |
| State variants (`hover:`, `focus:`) | ✅ | ✅ | ✅ |
| Spacing and sizing scale | ✅ | ✅ | ✅ |
| Color palette and opacity | ✅ | ✅ | ✅ |
| Grid system | | ✅ | ✅ |
| Dark mode | | ✅ | ✅ |
| Arbitrary values `[…]` | | ✅ | ✅ |
| Transitions and transforms | | ✅ | ✅ |
| `tailwind.config` — extending theme | | ✅ | ✅ |
| `@apply` and component extraction | | ✅ | ✅ |
| JIT content paths | | ✅ | ✅ |
| `@tailwindcss/forms` and `@tailwindcss/typography` | | ✅ | ✅ |
| Plugin authoring | | | ✅ |
| Design tokens and semantic aliases | | | ✅ |
| CSS custom properties integration | | | ✅ |
| Multi-theme architecture | | | ✅ |
| `tailwind-merge` + `clsx` patterns | | | ✅ |
| `@layer` cascade management | | | ✅ |
| Safelist and content transforms | | | ✅ |
| Accessibility utilities (`sr-only`, `motion-reduce:`, `aria-*`) | | | ✅ |
| Performance and bundle auditing | | | ✅ |
| Tailwind v4 — CSS-first config | | | ✅ |
| Monorepo preset architecture | | | ✅ |
