# React.js — Comprehensive Guide (Junior to Intermediate)

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

---

## Table of Contents

### Themes (chapters)

- [Ch 1 — What React Is and How to Think About It](#ch-1--what-react-is-and-how-to-think-about-it)
- [Ch 2 — JSX and Rendering Basics](#ch-2--jsx-and-rendering-basics)
- [Ch 3 — Components, Props, and Composition](#ch-3--components-props-and-composition)
- [Ch 4 — State and the useState Hook](#ch-4--state-and-the-usestate-hook)
- [Ch 5 — Side Effects and useEffect](#ch-5--side-effects-and-useeffect)
- [Ch 6 — Refs, useRef, and the DOM](#ch-6--refs-useref-and-the-dom)
- [Ch 7 — Context and Avoiding Prop Drilling](#ch-7--context-and-avoiding-prop-drilling)
- [Ch 8 — Hooks Rules, useReducer, and Custom Hooks](#ch-8--hooks-rules-usereducer-and-custom-hooks)
- [Ch 9 — Lists, Keys, and Reconciliation](#ch-9--lists-keys-and-reconciliation)
- [Ch 10 — Events and Forms](#ch-10--events-and-forms)
- [Ch 11 — Performance](#ch-11--performance)
- [Ch 12 — Error Boundaries and Suspense (Overview)](#ch-12--error-boundaries-and-suspense-overview)
- [Ch 13 — Testing Mindset](#ch-13--testing-mindset)
- [Ch 14 — TypeScript and React](#ch-14--typescript-and-react)
- [Ch 15 — Ecosystem and Production Patterns](#ch-15--ecosystem-and-production-patterns)
- [Ch 16 — Pitfalls and Review Checklist](#ch-16--pitfalls-and-review-checklist)

### All questions (quick jump)

- [Q1.1](#q11-what-is-react-and-what-is-it-not) · [Q1.2](#q12-what-is-declarative-ui-and-unidirectional-data-flow) · [Q1.3](#q13-what-happens-on-a-re-render-at-a-high-level)
- [Q2.1](#q21-what-is-jsx-and-how-does-it-relate-to-javascript) · [Q2.2](#q22-how-do-you-conditionally-render-ui) · [Q2.3](#q23-what-are-fragments-and-when-should-you-use-them)
- [Q3.1](#q31-should-you-use-class-or-function-components) · [Q3.2](#q32-are-props-mutable-why-or-why-not) · [Q3.3](#q33-how-do-children-and-composition-work)
- [Q4.1](#q41-when-should-state-live-in-a-component) · [Q4.2](#q42-why-use-functional-updates-with-setstate) · [Q4.3](#q43-should-you-copy-props-into-state)
- [Q5.1](#q51-when-is-useeffect-the-right-tool) · [Q5.2](#q52-how-do-you-choose-effect-dependencies) · [Q5.3](#q53-why-do-you-need-cleanup-functions)
- [Q6.1](#q61-when-do-you-reach-for-useref) · [Q6.2](#q62-how-is-a-ref-different-from-state)
- [Q7.1](#q71-when-is-context-appropriate) · [Q7.2](#q72-what-are-common-context-mistakes)
- [Q8.1](#q81-what-are-the-rules-of-hooks) · [Q8.2](#q82-when-is-usereducer-preferable-to-usestate) · [Q8.3](#q83-how-do-you-build-a-custom-hook-safely)
- [Q9.1](#q91-why-does-react-need-keys-in-lists) · [Q9.2](#q92-is-using-the-array-index-as-a-key-ever-ok)
- [Q10.1](#q101-how-do-react-events-differ-from-dom-events) · [Q10.2](#q102-what-is-a-controlled-input)
- [Q11.1](#q111-when-should-you-use-reactmemo-usememo-and-usecallback) · [Q11.2](#q112-what-causes-unnecessary-re-renders)
- [Q12.1](#q121-what-is-an-error-boundary-and-what-does-it-not-catch)
- [Q13.1](#q131-what-should-a-junior-test-first-in-react)
- [Q14.1](#q141-how-do-you-type-component-props-and-events)
- [Q15.1](#q151-how-do-routing-and-data-fetching-usually-fit-with-react)
- [Q16.1](#q161-what-are-the-most-common-react-footguns-to-audit)

---

## Ch 1 — What React Is and How to Think About It

**Questions in this chapter**

- [Q1.1 What is React, and what is it not?](#q11-what-is-react-and-what-is-it-not)
- [Q1.2 What is declarative UI and unidirectional data flow?](#q12-what-is-declarative-ui-and-unidirectional-data-flow)
- [Q1.3 What happens on a re-render at a high level?](#q13-what-happens-on-a-re-render-at-a-high-level)

---

### Q1.1 What is React, and what is it not?
React is a library focused on building user interfaces from composable pieces (components). You describe UI as a function of application state; React updates the screen when that state changes. React is not a full MVC framework by itself: routing, global data fetching architecture, and styling systems are usually layered on with other libraries or frameworks (for example React Router, TanStack Query, CSS Modules, Tailwind, or meta-frameworks like Next.js or Remix).

	**Q1.1a** Is React tied to the browser?

Most learning paths target the DOM, but React can render to other hosts (for example React Native). The mental model (elements, reconciliation, hooks) stays similar; the renderer changes.

[↑ Ch 1 questions](#ch-1--what-react-is-and-how-to-think-about-it) · [↑ Table of Contents](#table-of-contents)

---

### Q1.2 What is declarative UI and unidirectional data flow?
Declarative UI means you write what the UI should look like for given inputs instead of manually issuing imperative DOM instructions step by step. Unidirectional data flow means readable data tends to flow downward through props, while user intentions flow upward through event callbacks (for example `onSubmit`, `onChange`). That predictability makes large trees easier to reason about than ad hoc bidirectional bindings everywhere.

	**Q1.2a** Where does global mutable singleton state fit?

Avoid unconstrained global mutation for UI state. Prefer lifting state, explicit context, or dedicated stores with clear update paths so renders stay traceable.

[↑ Ch 1 questions](#ch-1--what-react-is-and-how-to-think-about-it) · [↑ Table of Contents](#table-of-contents)

---

### Q1.3 What happens on a re-render at a high level?
When state or props relevant to a component change, React schedules an update. Your component function runs again, producing a new element tree. React compares (“reconciles”) this tree with the previous one and computes minimal DOM updates. Child components re-render when their parent re-renders unless memoization prevents it.

	**Q1.3a** Does every state change re-render the whole app?

Not necessarily. Updates start from the component whose state changed and propagate downward by default. Patterns like `React.memo`, splitting state, and selectors reduce wasted work.

[↑ Ch 1 questions](#ch-1--what-react-is-and-how-to-think-about-it) · [↑ Table of Contents](#table-of-contents)

---

## Ch 2 — JSX and Rendering Basics

**Questions in this chapter**

- [Q2.1 What is JSX, and how does it relate to JavaScript?](#q21-what-is-jsx-and-how-does-it-relate-to-javascript)
- [Q2.2 How do you conditionally render UI?](#q22-how-do-you-conditionally-render-ui)
- [Q2.3 What are fragments, and when should you use them?](#q23-what-are-fragments-and-when-should-you-use-them)

---

### Q2.1 What is JSX, and how does it relate to JavaScript?
JSX is a syntax extension that looks like HTML inside JavaScript. It compiles to `React.createElement` calls (or the modern JSX runtime equivalent). Each JSX tag becomes an element description: type, props, and children. JavaScript expressions inside JSX use curly braces `{expression}`.

	**Q2.1a** Why `className` instead of `class`?

`class` is a reserved word in JavaScript; JSX maps to DOM properties consistently via `className`, matching the DOM API naming.

[↑ Ch 2 questions](#ch-2--jsx-and-rendering-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q2.2 How do you conditionally render UI?
Common patterns: logical AND (`condition && <Thing />`), ternary (`condition ? <A /> : <B />`), early `return null` from the component, or extracting helpers for readability. Prefer clarity over clever one-liners when conditions grow.

	**Q2.2b** How do you render lists?

Use `array.map` to produce elements and supply a stable `key` per item (see Ch 9).

[↑ Ch 2 questions](#ch-2--jsx-and-rendering-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q2.3 What are fragments, and when should you use them?
Fragments (`<>...</>` or `<React.Fragment>...</React.Fragment>`) group multiple sibling nodes without adding an extra DOM element. Use them when a component must return multiple siblings or when avoiding wrapper `div` elements matters for layout or semantics.

[↑ Ch 2 questions](#ch-2--jsx-and-rendering-basics) · [↑ Table of Contents](#table-of-contents)

---

## Ch 3 — Components, Props, and Composition

**Questions in this chapter**

- [Q3.1 Should you use class or function components?](#q31-should-you-use-class-or-function-components)
- [Q3.2 Are props mutable? Why or why not?](#q32-are-props-mutable-why-or-why-not)
- [Q3.3 How do `children` and composition work?](#q33-how-do-children-and-composition-work)

---

### Q3.1 Should you use class or function components?
For new code, prefer function components with hooks. Class components remain supported for legacy codebases but are not the recommended authoring style on greenfield projects.

[↑ Ch 3 questions](#ch-3--components-props-and-composition) · [↑ Table of Contents](#table-of-contents)

---

### Q3.2 Are props mutable? Why or why not?
Treat props as read-only. Mutating props or nested objects received from parents breaks React’s expectations about purity and predictability, causes subtle bugs, and defeats memoization. If you need editable values, copy into local state intentionally or route updates through callbacks.

	**Q3.2a** What about mutating local state objects?

Still avoid in-place mutation; replace with new object or array references so React can detect changes reliably.

[↑ Ch 3 questions](#ch-3--components-props-and-composition) · [↑ Table of Contents](#table-of-contents)

---

### Q3.3 How do `children` and composition work?
`children` is a special prop representing nested JSX between opening and closing tags. Composition (layouts, slots, wrappers) scales better than deep inheritance trees. Pass render functions or elements as props when you need multiple insertion points.

[↑ Ch 3 questions](#ch-3--components-props-and-composition) · [↑ Table of Contents](#table-of-contents)

---

## Ch 4 — State and the useState Hook

**Questions in this chapter**

- [Q4.1 When should state live in a component?](#q41-when-should-state-live-in-a-component)
- [Q4.2 Why use functional updates with `setState`?](#q42-why-use-functional-updates-with-setstate)
- [Q4.3 Should you copy props into state?](#q43-should-you-copy-props-into-state)

---

### Q4.1 When should state live in a component?
Keep state as close as possible to where it is used while still satisfying sharing needs. If two siblings need the same mutable value, lift state to their closest common parent and pass props downward along with updaters.

	**Q4.1a** What about remote server state?

Server-derived data often benefits from dedicated caching libraries or framework loaders rather than only local `useState`, especially for deduplication, staleness, and refetch rules.

[↑ Ch 4 questions](#ch-4--state-and-the-usestate-hook) · [↑ Table of Contents](#table-of-contents)

---

### Q4.2 Why use functional updates with `setState`?
React may batch multiple updates. When the next state depends on the previous state (for example counters or toggles), use the updater form `setCount((c) => c + 1)` to avoid stale reads from closures captured during an earlier render.

[↑ Ch 4 questions](#ch-4--state-and-the-usestate-hook) · [↑ Table of Contents](#table-of-contents)

---

### Q4.3 Should you copy props into state?
Generally no. Prefer deriving values during render (`const fullName = first + ' ' + last`). Mirroring props into state causes duplication and drift unless you have a deliberate pattern (for example fully controlled vs uncontrolled hybrids) with clear synchronization rules.

[↑ Ch 4 questions](#ch-4--state-and-the-usestate-hook) · [↑ Table of Contents](#table-of-contents)

---

## Ch 5 — Side Effects and useEffect

**Questions in this chapter**

- [Q5.1 When is `useEffect` the right tool?](#q51-when-is-useeffect-the-right-tool)
- [Q5.2 How do you choose effect dependencies?](#q52-how-do-you-choose-effect-dependencies)
- [Q5.3 Why do you need cleanup functions?](#q53-why-do-you-need-cleanup-functions)

---

### Q5.1 When is `useEffect` the right tool?
Use effects to synchronize React with external systems: subscriptions, timers, imperative widgets, non-React DOM APIs, or aligning work to committed UI when props or state change. Prefer event handlers for user-driven logic (`onClick`, `onSubmit`) and framework loaders or focused data libraries for many fetch-on-navigation scenarios.

	**Q5.1a** What about fetching inside effects?

It can work, but handle races (ignore stale responses), cancellation or AbortController where applicable, and duplicate mounts under Strict Mode during development.

[↑ Ch 5 questions](#ch-5--side-effects-and-useeffect) · [↑ Table of Contents](#table-of-contents)

---

### Q5.2 How do you choose effect dependencies?
List every reactive value read inside the effect that comes from the component scope (props, state, and derived values from them). The `react-hooks/exhaustive-deps` lint rule catches many mistakes. If adding deps causes unwanted reruns, fix by stabilizing callbacks (`useCallback`), moving logic out of the effect, or restructuring—not by silently omitting deps.

[↑ Ch 5 questions](#ch-5--side-effects-and-useeffect) · [↑ Table of Contents](#table-of-contents)

---

### Q5.3 Why do you need cleanup functions?
Cleanup prevents leaks and stale subscriptions: remove listeners, clear timers, abort requests. React runs cleanup before re-running the effect when dependencies change and again on unmount.

```tsx
useEffect(() => {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}, [tick]);
```

[↑ Ch 5 questions](#ch-5--side-effects-and-useeffect) · [↑ Table of Contents](#table-of-contents)

---

## Ch 6 — Refs, useRef, and the DOM

**Questions in this chapter**

- [Q6.1 When do you reach for `useRef`?](#q61-when-do-you-reach-for-useref)
- [Q6.2 How is a ref different from state?](#q62-how-is-a-ref-different-from-state)

---

### Q6.1 When do you reach for `useRef`?
Common cases: holding a mutable box that does not need to trigger re-render (timer ids, previous value comparisons), focusing inputs imperatively, integrating third-party DOM libraries, or measuring elements.

[↑ Ch 6 questions](#ch-6--refs-useref-and-the-dom) · [↑ Table of Contents](#table-of-contents)

---

### Q6.2 How is a ref different from state?
Updating `ref.current` does not schedule a render. State updates enqueue renders so the UI can reflect changes. Use refs when mutation should not flash intermediate UI or when integrating imperative APIs.

[↑ Ch 6 questions](#ch-6--refs-useref-and-the-dom) · [↑ Table of Contents](#table-of-contents)

---

## Ch 7 — Context and Avoiding Prop Drilling

**Questions in this chapter**

- [Q7.1 When is context appropriate?](#q71-when-is-context-appropriate)
- [Q7.2 What are common context mistakes?](#q72-what-are-common-context-mistakes)

---

### Q7.1 When is context appropriate?
Use context for data many distant components need without threading props through every layer: themes, locale, authentication session summaries, feature flags. Keep provider values stable when possible to avoid widespread re-renders.

[↑ Ch 7 questions](#ch-7--context-and-avoiding-prop-drilling) · [↑ Table of Contents](#table-of-contents)

---

### Q7.2 What are common context mistakes?
Putting rapidly changing objects inline in provider `value` without memoization, stuffing unrelated concerns into one mega-context, and using context as a substitute for proper server-state tooling are frequent issues. Split contexts by concern and profile before micro-optimizing.

[↑ Ch 7 questions](#ch-7--context-and-avoiding-prop-drilling) · [↑ Table of Contents](#table-of-contents)

---

## Ch 8 — Hooks Rules, useReducer, and Custom Hooks

**Questions in this chapter**

- [Q8.1 What are the Rules of Hooks?](#q81-what-are-the-rules-of-hooks)
- [Q8.2 When is `useReducer` preferable to `useState`?](#q82-when-is-usereducer-preferable-to-usestate)
- [Q8.3 How do you build a custom hook safely?](#q83-how-do-you-build-a-custom-hook-safely)

---

### Q8.1 What are the Rules of Hooks?
Only call hooks at the top level of React functions (components or custom hooks), not inside loops, conditions, or nested helpers. Only call them from React functions, not random utilities. This preserves consistent hook order across renders so React can associate state with calls.

[↑ Ch 8 questions](#ch-8--hooks-rules-usereducer-and-custom-hooks) · [↑ Table of Contents](#table-of-contents)

---

### Q8.2 When is `useReducer` preferable to `useState`?
When multiple sub-values change together, transitions involve complex logic, or you want event-log-like updates with predictable reduction steps. Pair with TypeScript discriminated unions for action shapes when scaling.

[↑ Ch 8 questions](#ch-8--hooks-rules-usereducer-and-custom-hooks) · [↑ Table of Contents](#table-of-contents)

---

### Q8.3 How do you build a custom hook safely?
Prefix with `use`, call other hooks only at the custom hook’s top level, return stable APIs (often memoized callbacks when exposed), and document lifecycle assumptions (for example subscriptions cleaned up internally).

[↑ Ch 8 questions](#ch-8--hooks-rules-usereducer-and-custom-hooks) · [↑ Table of Contents](#table-of-contents)

---

## Ch 9 — Lists, Keys, and Reconciliation

**Questions in this chapter**

- [Q9.1 Why does React need keys in lists?](#q91-why-does-react-need-keys-in-lists)
- [Q9.2 Is using the array index as a key ever OK?](#q92-is-using-the-array-index-as-a-key-ever-ok)

---

### Q9.1 Why does React need keys in lists?
Keys let React match elements across renders so stateful children move correctly when items reorder, insert, or delete. Unstable or duplicate keys cause incorrect preservation of component state and inefficient patching.

[↑ Ch 9 questions](#ch-9--lists-keys-and-reconciliation) · [↑ Table of Contents](#table-of-contents)

---

### Q9.2 Is using the array index as a key ever OK?
Only when the list is static (no reordering), items lack stable ids, and elements have no meaningful local state tied to row identity. Prefer database ids or natural composite keys otherwise.

[↑ Ch 9 questions](#ch-9--lists-keys-and-reconciliation) · [↑ Table of Contents](#table-of-contents)

---

## Ch 10 — Events and Forms

**Questions in this chapter**

- [Q10.1 How do React events differ from DOM events?](#q101-how-do-react-events-differ-from-dom-events)
- [Q10.2 What is a controlled input?](#q102-what-is-a-controlled-input)

---

### Q10.1 How do React events differ from DOM events?
React wraps native events for consistent behavior across browsers and aligns naming with camelCase props (`onClick`). Attach handlers with references (`onClick={handler}`), not immediate invocation (`onClick={handler()}`), unless wrapping factories intentionally.

[↑ Ch 10 questions](#ch-10--events-and-forms) · [↑ Table of Contents](#table-of-contents)

---

### Q10.2 What is a controlled input?
The input’s displayed value comes from React state (`value` + `onChange`). React remains the source of truth. For large forms, structured libraries reduce boilerplate while preserving validation patterns.

[↑ Ch 10 questions](#ch-10--events-and-forms) · [↑ Table of Contents](#table-of-contents)

---

## Ch 11 — Performance

**Questions in this chapter**

- [Q11.1 When should you use `React.memo`, `useMemo`, and `useCallback`?](#q111-when-should-you-use-reactmemo-usememo-and-usecallback)
- [Q11.2 What causes unnecessary re-renders?](#q112-what-causes-unnecessary-re-renders)

---

### Q11.1 When should you use `React.memo`, `useMemo`, and `useCallback`?
Apply after measuring or clear reasoning: memoize expensive subtrees receiving stable props (`React.memo`), cache costly pure computations (`useMemo`), and stabilize function identities passed to memoized children (`useCallback`). Blanket use everywhere adds complexity without guaranteed wins.

[↑ Ch 11 questions](#ch-11--performance) · [↑ Table of Contents](#table-of-contents)

---

### Q11.2 What causes unnecessary re-renders?
Parent updates cascading broadly, inline object or function props breaking memo equality, unstable context values, derived props recreated each render, and lifting state too high without decomposition.

[↑ Ch 11 questions](#ch-11--performance) · [↑ Table of Contents](#table-of-contents)

---

## Ch 12 — Error Boundaries and Suspense (Overview)

**Questions in this chapter**

- [Q12.1 What is an error boundary, and what does it not catch?](#q121-what-is-an-error-boundary-and-what-does-it-not-catch)

---

### Q12.1 What is an error boundary, and what does it not catch?
Class-based error boundaries (or future/stable APIs your stack provides) catch rendering errors in descendants and allow fallback UI. They do not catch errors inside asynchronous code unless that code surfaces through React’s pathways, nor event handler errors unless you handle them manually.

	**Q12.1a** What about Suspense?

Suspense coordinates async UI readiness (for example lazy components or concurrent patterns depending on version and data layer). Treat details as framework-specific and consult current docs for data-fetching Suspense boundaries.

[↑ Ch 12 questions](#ch-12--error-boundaries-and-suspense-overview) · [↑ Table of Contents](#table-of-contents)

---

## Ch 13 — Testing Mindset

**Questions in this chapter**

- [Q13.1 What should a junior test first in React?](#q131-what-should-a-junior-test-first-in-react)

---

### Q13.1 What should a junior test first in React?
Start with behavior users observe: render labels, fire events, assert outcomes. Prefer queries resembling accessibility roles (`getByRole`). Isolate flaky network calls with mocks or MSW. Snapshot tests help detect accidental markup churn but rarely replace behavioral assertions.

[↑ Ch 13 questions](#ch-13--testing-mindset) · [↑ Table of Contents](#table-of-contents)

---

## Ch 14 — TypeScript and React

**Questions in this chapter**

- [Q14.1 How do you type component props and events?](#q141-how-do-you-type-component-props-and-events)

---

### Q14.1 How do you type component props and events?
Define explicit prop interfaces or type aliases; avoid implicit `any`. Narrow unions for variants (`variant: 'primary' | 'ghost'`). Type event handlers with `React.ChangeEvent<HTMLInputElement>` etc. Use `children?: React.ReactNode` thoughtfully—tighten when you only accept specific shapes.

[↑ Ch 14 questions](#ch-14--typescript-and-react) · [↑ Table of Contents](#table-of-contents)

---

## Ch 15 — Ecosystem and Production Patterns

**Questions in this chapter**

- [Q15.1 How do routing and data fetching usually fit with React?](#q151-how-do-routing-and-data-fetching-usually-fit-with-react)

---

### Q15.1 How do routing and data fetching usually fit with React?
Client routers map URLs to component trees; loaders or hooks fetch data per route or component. Libraries like TanStack Query standardize caching, retries, and deduplication. SSR frameworks embed React into request/response lifecycles for SEO and latency tradeoffs.

[↑ Ch 15 questions](#ch-15--ecosystem-and-production-patterns) · [↑ Table of Contents](#table-of-contents)

---

## Ch 16 — Pitfalls and Review Checklist

**Questions in this chapter**

- [Q16.1 What are the most common React footguns to audit?](#q161-what-are-the-most-common-react-footguns-to-audit)

---

### Q16.1 What are the most common React footguns to audit?
Mutating state in place; incorrect or omitted effect dependencies; accidental infinite loops from unstable deps; unstable keys; mirroring props; deriving expensive values without memoization only after profiling; ignoring accessibility attributes; missing loading and error UI for async paths.

	**Q16.1b** Where to deepen knowledge?

Use the official [React documentation](https://react.dev/learn) as the canonical reference; revisit hooks and concurrency notes when upgrading major versions.

[↑ Ch 16 questions](#ch-16--pitfalls-and-review-checklist) · [↑ Table of Contents](#table-of-contents)

---

_End of guide._ · [↑ Table of Contents](#table-of-contents)
