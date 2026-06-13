# React for Angular developers

## Table of contents

### Chapter 01 — Core mental model
- [Ch 01 Q01 How is React different from Angular at the platform level](#ch-01-q01-how-is-react-different-from-angular-at-the-platform-level)
	- Ch 01 Q01a Where do decorators dependency injection and NgModule fit
	- Ch 01 Q01b Is there still a concept of a bootstrap entry
- [Ch 01 Q02 How does React rendering relate to Angular change detection](#ch-01-q02-how-does-react-rendering-relate-to-angular-change-detection)
	- Ch 01 Q02a What is the closest analogy to OnPush
- [Ch 01 Q03 JSX versus Angular templates what moves where](#ch-01-q03-jsx-versus-angular-templates-what-moves-where)

### Chapter 02 — Components composition and communication
- [Ch 02 Q01 What are props compared to Angular inputs](#ch-02-q01-what-are-props-compared-to-angular-inputs)
- [Ch 02 Q02 How do you emit events to parents without Output EventEmitter](#ch-02-q02-how-do-you-emit-events-to-parents-without-output-eventemitter)
- [Ch 02 Q03 How do you project content like ng-content](#ch-02-q03-how-do-you-project-content-like-ng-content)
- [Ch 02 Q04 What replaces structural directives like ngIf and ngFor](#ch-02-q04-what-replaces-structural-directives-like-ngif-and-ngfor)

### Chapter 03 — State hooks and side effects
- [Ch 03 Q01 Where does local component state live](#ch-03-q01-where-does-local-component-state-live)
	- Ch 03 Q01a How does this compare to Angular signals
- [Ch 03 Q02 What is useEffect in Angular terms](#ch-03-q02-what-is-useeffect-in-angular-terms)
- [Ch 03 Q03 When do you use useMemo and useCallback](#ch-03-q03-when-do-you-use-usememo-and-usecallback)
- [Ch 03 Q04 How do you share state without a service](#ch-03-q04-how-do-you-share-state-without-a-service)

### Chapter 04 — Routing
- [Ch 04 Q01 What is the React Router mental model versus Angular Router](#ch-04-q01-what-is-the-react-router-mental-model-versus-angular-router)
- [Ch 04 Q02 Where are route guards and resolvers](#ch-04-q02-where-are-route-guards-and-resolvers)
- [Ch 04 Q03 How does lazy loading work](#ch-04-q03-how-does-lazy-loading-work)

### Chapter 05 — Forms and validation
- [Ch 05 Q01 What is a controlled input](#ch-05-q01-what-is-a-controlled-input)
- [Ch 05 Q02 How does validation compare to reactive forms](#ch-05-q02-how-does-validation-compare-to-reactive-forms)

### Chapter 06 — Data fetching and async
- [Ch 06 Q01 How do you call HTTP APIs without HttpClient](#ch-06-q01-how-do-you-call-http-apis-without-httpclient)
- [Ch 06 Q02 What problem do TanStack Query and SWR solve](#ch-06-q02-what-problem-do-tanstack-query-and-swr-solve)

### Chapter 07 — Styling and encapsulation
- [Ch 07 Q01 What replaces view encapsulation and host styles](#ch-07-q01-what-replaces-view-encapsulation-and-host-styles)
- [Ch 07 Q02 How do Angular developers usually organize CSS in React apps](#ch-07-q02-how-do-angular-developers-usually-organize-css-in-react-apps)

### Chapter 08 — Testing
- [Ch 08 Q01 What replaces TestBed for components](#ch-08-q01-what-replaces-testbed-for-components)
- [Ch 08 Q02 How do you query the DOM and assert like DebugElement](#ch-08-q02-how-do-you-query-the-dom-and-assert-like-debugelement)

### Chapter 09 — Tooling and project shape
- [Ch 09 Q01 What is the usual React toolchain compared to Angular CLI](#ch-09-q01-what-is-the-usual-react-toolchain-compared-to-angular-cli)
- [Ch 09 Q02 How strict is TypeScript by default](#ch-09-q02-how-strict-is-typescript-by-default)

### Chapter 10 — Migration mindset and pitfalls
- [Ch 10 Q01 What habits from Angular hurt most in React](#ch-10-q01-what-habits-from-angular-hurt-most-in-react)
- [Ch 10 Q02 When is a state library actually warranted](#ch-10-q02-when-is-a-state-library-actually-warranted)

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 01 — Core mental model

## Ch 01 Q01 How is React different from Angular at the platform level

> **Ch 01 · Q01.** How is React different from Angular at the platform level?

	> **Ch 01 · Q01a.** Where do decorators, dependency injection, and `NgModule` fit?

	> **Ch 01 · Q01b.** Is there still a concept of a bootstrap entry?

Angular is a **framework**: it ships a router, forms, HTTP, DI, compiler-linked templates, and a zone-based or signal-driven change detection story. **React is a UI library**: it focuses on describing UI as a function of state and reconciling a tree of elements to the DOM (or another host). Routing, forms, data fetching, and global state are usually **separate packages** you compose.

- **Decorators and DI**: React has no `@Injectable()` or constructor injection. Shared logic is usually plain functions, custom hooks, or module singletons you import. “Inject a service” often becomes “import a client object or hook.”
- **`NgModule`**: no module graph. Boundaries are **files and folders**, plus ES modules (`import` / `export`). Some apps use feature folders (`features/users/UserList.tsx`).
- **Bootstrap**: instead of `bootstrapApplication(AppComponent, config)`, a typical Vite or CRA entry mounts the root:

```tsx
// main.tsx (conceptual)
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

[↑ Back to table of contents](#table-of-contents)

## Ch 01 Q02 How does React rendering relate to Angular change detection

> **Ch 01 · Q02.** How does React rendering relate to Angular change detection?

	> **Ch 01 · Q02a.** What is the closest analogy to `OnPush`?

React re-renders a component when **its state or props change** (or when a parent re-renders and passes new props). During a render, React calls your function component body again and diffs the **virtual tree** against the previous one. There is no separate “change detection pass” over the whole app tree like zone.js triggering checks.

- **`OnPush` analogy**: memoization. Wrapping a child with `React.memo` skips re-rendering that child if **props are shallow-equal** to the last render. It is not automatic; you opt in where it helps.

```tsx
import { memo } from 'react';

export const UserCard = memo(function UserCard(props: { userId: string }) {
  // ...
});
```

[↑ Back to table of contents](#table-of-contents)

## Ch 01 Q03 JSX versus Angular templates what moves where

> **Ch 01 · Q03.** JSX versus Angular templates: what moves where?

Angular templates are HTML with structural directives and binding syntax compiled into views. **JSX** is JavaScript syntax that returns plain **element objects** (`React.createElement` under the hood). That means:

- **Conditionals** are JavaScript (`&&`, ternary), not `*ngIf`.
- **Lists** are `array.map`, not `*ngFor`.
- **Pipes** have no direct built-in; you call functions or use small helpers.
- **Bindings** are JavaScript expressions in `{}`, not `[]` / `()` attributes, though naming is similar conceptually (`className` instead of `class`, `htmlFor` instead of `for` on labels).

```tsx
// JSX sketch
return (
  <section>
    {items.length === 0 ? <p>No items</p> : null}
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  </section>
);
```

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 02 — Components composition and communication

## Ch 02 Q01 What are props compared to Angular inputs

> **Ch 02 · Q01.** What are props compared to Angular `@Input()`?

Props are **the only inputs** to a function component (plus closure over imports). They are a single object argument, conventionally named `props`, or destructured. There is no `input()` signal API in core React; you read values directly during render.

```tsx
type Props = { userId: string; showAvatar?: boolean };

export function ProfileHeader({ userId, showAvatar = true }: Props) {
  return <header>{showAvatar ? <Avatar id={userId} /> : null}</header>;
}
```

Unlike Angular, props are **read-only** from the child’s perspective; mutating props objects in place is an anti-pattern.

[↑ Back to table of contents](#table-of-contents)

## Ch 02 Q02 How do you emit events to parents without Output EventEmitter

> **Ch 02 · Q02.** How do you emit events to parents without `@Output()` / `EventEmitter`?

Pass **callback props**. The parent owns the state; the child calls the function when something happens.

```tsx
// Parent
function Parent() {
  const [query, setQuery] = useState('');
  return <SearchBar onSearch={(q) => setQuery(q)} />;
}

// Child
function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  return <button type="button" onClick={() => onSearch('reset')}>Reset</button>;
}
```

Naming often follows `onX` in props and `handleX` in the parent, similar to Angular’s template binding names but without a framework event bus.

[↑ Back to table of contents](#table-of-contents)

## Ch 02 Q03 How do you project content like ng-content

> **Ch 02 · Q03.** How do you project content like `ng-content`?

Use the **`children` prop** or explicit **render props / slots as components**.

```tsx
// Card.tsx — like a single default ng-content
export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article>
      <h2>{title}</h2>
      <div>{children}</div>
    </article>
  );
}

// Usage
<Card title="Summary">
  <p>Projected body</p>
</Card>
```

For multiple projection slots, pass **named React nodes** or small subcomponents as props instead of `select="..."` attributes.

[↑ Back to table of contents](#table-of-contents)

## Ch 02 Q04 What replaces structural directives like ngIf and ngFor

> **Ch 02 · Q04.** What replaces structural directives like `*ngIf` and `*ngFor`?

Use JavaScript control flow inside JSX. Always give list roots a stable **`key`** (like a trackBy function in Angular).

```tsx
{isAdmin && <AdminToolbar />}
{users.map((u) => <UserRow key={u.id} user={u} />)}
```

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 03 — State hooks and side effects

## Ch 03 Q01 Where does local component state live

> **Ch 03 · Q01.** Where does local component state live?

In function components, **`useState`** (or `useReducer`) returns state and a setter. Each call is tied to the component **instance** by call order on every render—hooks must not be conditional.

```tsx
const [count, setCount] = useState(0);
```

	> **Ch 03 · Q01a.** How does this compare to Angular signals?

Angular **signals** (`signal()`, `computed()`, `effect()`) are a first-class reactive primitive in the framework. React **`useState`** is a hook storing a value in Fiber state; updates trigger a re-render. **`useMemo`** / **`useCallback`** help stabilize references, somewhat like memoizing derived values, but there is no exact `computed()` in core React—you derive during render or memoize manually.

[↑ Back to table of contents](#table-of-contents)

## Ch 03 Q02 What is useEffect in Angular terms

> **Ch 03 · Q02.** What is `useEffect` in Angular terms?

`useEffect` runs **after paint** (by default) when its dependencies change. It covers many Angular cases: `ngOnInit` + subscription setup, reacting to input changes, and cleanup on destroy via a returned function.

```tsx
useEffect(() => {
  const sub = stream.subscribe(setValue);
  return () => sub.unsubscribe();
}, [stream]);
```

**Rule of thumb**: prefer **no effect** when you can compute during render or push logic into event handlers. Use `useEffect` for real **synchronization** with the outside world (DOM APIs, timers, subscriptions, logging).

[↑ Back to table of contents](#table-of-contents)

## Ch 03 Q03 When do you use useMemo and useCallback

> **Ch 03 · Q03.** When do you use `useMemo` and `useCallback`?

Use them to **preserve referential equality** across renders when that matters for child memoization or stable dependency arrays—not by default on every value.

- **`useMemo`**: expensive pure derivations, or stable object/array references passed to memoized children.
- **`useCallback`**: stable function references passed to memoized children or listed as dependencies in other hooks.

[↑ Back to table of contents](#table-of-contents)

## Ch 03 Q04 How do you share state without a service

> **Ch 03 · Q04.** How do you share state without a service?

Common patterns:

1. **Lift state up** to the nearest common parent and pass props down.
2. **`React.createContext`** for mid-range shared state (theme, auth snapshot, current user).
3. **External stores** (Zustand, Redux, Jotai, signals via custom libraries) when many distant components need the same data or you want devtools/time travel.

There is nothing like Angular’s hierarchical injectors; context is **not** scoped to a subtree unless you design separate providers per subtree.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 04 — Routing

## Ch 04 Q01 What is the React Router mental model versus Angular Router

> **Ch 04 · Q01.** What is the React Router mental model versus Angular Router?

**React Router** maps URLs to **element trees** (routes are components), often with nested `<Outlet />` layouts. Configuration can be JSX (`<Routes>`, `<Route />`) or data APIs in newer versions. Navigation is imperative (`useNavigate`) or declarative (`<Link />`), similar in spirit to `RouterLink` but without Angular’s DI-integrated router events service.

[↑ Back to table of contents](#table-of-contents)

## Ch 04 Q02 Where are route guards and resolvers

> **Ch 04 · Q02.** Where are route guards and resolvers?

There is no single built-in guard API. Typical patterns:

- **Loader functions** (data routers) fetch before render.
- **Wrapper components** check auth inside `useEffect` or during render and redirect.
- **Higher-order route elements** that return `<Navigate />` when forbidden.

You compose authorization the same way you compose UI—there is no `CanActivate` interface from the framework.

[↑ Back to table of contents](#table-of-contents)

## Ch 04 Q03 How does lazy loading work

> **Ch 04 · Q03.** How does lazy loading work?

Use `React.lazy` + `Suspense` with dynamic `import()`:

```tsx
const Reports = React.lazy(() => import('./features/Reports'));

export function App() {
  return (
    <React.Suspense fallback={<p>Loading…</p>}>
      <Reports />
    </React.Suspense>
  );
}
```

This is conceptually similar to `loadComponent` in Angular route config, though error and loading boundaries are explicit.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 05 — Forms and validation

## Ch 05 Q01 What is a controlled input

> **Ch 05 · Q01.** What is a controlled input?

A controlled input’s **value comes from React state**; `onChange` updates that state. This mirrors reactive forms where the model drives the view, but wiring is manual unless you adopt a form library.

```tsx
const [email, setEmail] = useState('');
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

[↑ Back to table of contents](#table-of-contents)

## Ch 05 Q02 How does validation compare to reactive forms

> **Ch 05 · Q02.** How does validation compare to reactive forms?

Core React has **no `FormBuilder`**. You validate in handlers or derive error objects during render. Libraries like **React Hook Form** or **Formik** recreate ergonomics closer to Angular reactive forms (field state, schemas with Zod/Yup).

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 06 — Data fetching and async

## Ch 06 Q01 How do you call HTTP APIs without HttpClient

> **Ch 06 · Q01.** How do you call HTTP APIs without `HttpClient`?

Use **`fetch`**, **axios**, or wrappers. Interceptors are not built-in; you wrap the client or use framework-specific data libraries.

```tsx
useEffect(() => {
  let cancelled = false;
  (async () => {
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (!cancelled) setProfile(data);
  })();
  return () => {
    cancelled = true;
  };
}, []);
```

[↑ Back to table of contents](#table-of-contents)

## Ch 06 Q02 What problem do TanStack Query and SWR solve

> **Ch 06 · Q02.** What problem do TanStack Query and SWR solve?

They add a **cache + request lifecycle** layer: deduping, background refresh, stale-while-revalidate, pagination helpers, and error/retry policies. That overlaps with patterns Angular devs sometimes solve with RxJS streams, `HttpClient` interceptors, and manual subscription management—here the library owns caching and synchronization.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 07 — Styling and encapsulation

## Ch 07 Q01 What replaces view encapsulation and host styles

> **Ch 07 · Q01.** What replaces view encapsulation and `:host` styles?

React does not compile shadow DOM encapsulation for you. Common replacements:

- **CSS Modules** (local class names at build time).
- **CSS-in-JS** (scoped styles via libraries).
- **Utility CSS** (Tailwind) with disciplined component boundaries.
- Plain CSS with BEM or a namespace convention.

Component “host” styling is usually the **outermost DOM element** you return.

[↑ Back to table of contents](#table-of-contents)

## Ch 07 Q02 How do Angular developers usually organize CSS in React apps

> **Ch 07 · Q02.** How do Angular developers usually organize CSS in React apps?

Colocate **`Component.module.css`** next to `Component.tsx`, or use Tailwind class strings inline. The mental shift is that **style files are not registered in a component decorator**—you import them explicitly.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 08 — Testing

## Ch 08 Q01 What replaces TestBed for components

> **Ch 08 · Q01.** What replaces `TestBed` for components?

**React Testing Library** mounts components with **`render`** from a real DOM test environment (usually **jsdom**). You test **behavior and accessible output**, not implementation details of the component class.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

[↑ Back to table of contents](#table-of-contents)

## Ch 08 Q02 How do you query the DOM and assert like DebugElement

> **Ch 08 · Q02.** How do you query the DOM and assert like Angular’s `DebugElement` probes?

Prefer **role-based queries** (`getByRole`, `getByLabelText`) over CSS selectors. Assertions often use **jest-dom** matchers (`toBeInTheDocument`, `toBeDisabled`). This is closer to how users interact with the app than probing private DOM structure.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 09 — Tooling and project shape

## Ch 09 Q01 What is the usual React toolchain compared to Angular CLI

> **Ch 09 · Q01.** What is the usual React toolchain compared to Angular CLI?

Many teams use **Vite** + **TypeScript** + **ESLint** + **Prettier**. Framework-specific CLIs exist (for example Next.js, Remix) that also shape routing and data loading. There is no single `ng generate` equivalent baked into core React; scaffolding is via CLI templates or community starters.

[↑ Back to table of contents](#table-of-contents)

## Ch 09 Q02 How strict is TypeScript by default

> **Ch 09 · Q02.** How strict is TypeScript by default?

It depends on the template. **Turn on `strict`** in `tsconfig` the same way you would in Angular. Typing **`children`** and event handlers explicitly avoids a class of JSX issues early.

[↑ Back to table of contents](#table-of-contents)

---

## Chapter 10 — Migration mindset and pitfalls

## Ch 10 Q01 What habits from Angular hurt most in React

> **Ch 10 · Q01.** What habits from Angular hurt most in React?

- **Assuming a single global DI graph** for everything—React favors explicit data flow and module imports.
- **Over-using `useEffect`** to mirror “I put everything in `ngOnInit`”—many effects can be event-driven or derived state.
- **Mutating objects in place** instead of immutable updates when storing them in state.
- **Forgetting `key` on lists**, leading to subtle reconciliation bugs.

[↑ Back to table of contents](#table-of-contents)

## Ch 10 Q02 When is a state library actually warranted

> **Ch 10 · Q02.** When is a state library actually warranted?

When **many distant components** share fast-changing data, you need **devtools or middleware**, or async/cache concerns outgrow hand-rolled context. For small apps, **context + reducers** or colocated server cache (TanStack Query) often suffices—mirroring the Angular guideline not to import NgRx on day one unless complexity demands it.

[↑ Back to table of contents](#table-of-contents)
