# React Learning Roadmap for Angular Developers

## Introduction
This roadmap is designed for Angular developers transitioning to React. It maps Angular concepts to their React equivalents and guides you through the learning journey.

**How to use this guide:**
- Follow the roadmap phases in order
- Click on any question to jump to its detailed answer
- Questions are organized by learning phase and complexity
- Answers include side-by-side React and Angular comparisons

---

## Table of Contents
- [Phase 1: Core Fundamentals](#phase-1-core-fundamentals)
- [Phase 2: State Management & Data Flow](#phase-2-state-management--data-flow)
- [Phase 3: Advanced Hooks & Side Effects](#phase-3-advanced-hooks--side-effects)
- [Phase 4: Forms & Validation](#phase-4-forms--validation)
- [Phase 5: Routing & Navigation](#phase-5-routing--navigation)
- [Phase 6: HTTP & Async Operations](#phase-6-http--async-operations)
- [Phase 7: State Management Solutions](#phase-7-state-management-solutions)
- [Phase 8: Styling in React](#phase-8-styling-in-react)
- [Phase 9: Performance Optimization](#phase-9-performance-optimization)
- [Phase 10: Testing](#phase-10-testing)
- [Phase 11: TypeScript with React](#phase-11-typescript-with-react)
- [Phase 12: Build Tools & Project Setup](#phase-12-build-tools--project-setup)
- [Phase 13: Advanced Patterns](#phase-13-advanced-patterns)
- [Phase 14: Server-Side Rendering & Frameworks](#phase-14-server-side-rendering--frameworks)
- [Phase 15: Mobile Development](#phase-15-mobile-development)
- [Phase 16: Real-World Application Development](#phase-16-real-world-application-development)
- [Phase 17: Deployment & DevOps](#phase-17-deployment--devops)
- [Phase 18: Migration Strategies](#phase-18-migration-strategies)
- [Answers](#answers)

---

# ROADMAP

## Phase 1: Core Fundamentals

### 1.1 Understanding React Philosophy
- [What is the main difference between Angular's opinionated framework and React's library approach?](#11-what-is-the-main-difference-between-angulars-opinionated-framework-and-reacts-library-approach)
- [How does React's "UI as a function of state" philosophy differ from Angular's component-based architecture?](#12-how-does-reacts-ui-as-a-function-of-state-philosophy-differ-from-angulars-component-based-architecture)
- [What is the Virtual DOM and how does it compare to Angular's change detection?](#13-what-is-the-virtual-dom-and-how-does-it-compare-to-angulars-change-detection)
- [What is JSX and how does it differ from Angular templates?](#14-what-is-jsx-and-how-does-it-differ-from-angular-templates)

### 1.2 Components Basics
- [What are function components in React? How do they compare to Angular standalone components?](#15-what-are-function-components-in-react-how-do-they-compare-to-angular-standalone-components)
- [What is the difference between class components and function components?](#16-what-is-the-difference-between-class-components-and-function-components)
- [How do you define a React component without decorators like `@Component`?](#17-how-do-you-define-a-react-component-without-decorators-like-component)
- [What is the component lifecycle in React and how does it map to Angular lifecycle hooks?](#18-what-is-the-component-lifecycle-in-react-and-how-does-it-map-to-angular-lifecycle-hooks)
- [How do you handle component composition in React vs Angular?](#19-how-do-you-handle-component-composition-in-react-vs-angular)

### 1.3 JSX Deep Dive
- [How do you write conditional rendering in JSX (vs Angular's `@if`)?](#110-how-do-you-write-conditional-rendering-in-jsx-vs-angulars-if)
- [How do you iterate over lists in JSX (vs Angular's `@for`)?](#111-how-do-you-iterate-over-lists-in-jsx-vs-angulars-for)
- [What are JSX expressions and how do they work with template interpolation?](#112-what-are-jsx-expressions-and-how-do-they-work-with-template-interpolation)
- [How do you handle dynamic CSS classes in React (vs Angular's class bindings)?](#113-how-do-you-handle-dynamic-css-classes-in-react-vs-angulars-class-bindings)
- [How do you apply inline styles in JSX?](#114-how-do-you-apply-inline-styles-in-jsx)

---

## Phase 2: State Management & Data Flow

### 2.1 Component State
- What is the `useState` hook and how does it compare to Angular signals?
- How do you update state immutably in React?
- What are the rules of hooks in React?
- How do you manage complex state objects?
- What is the difference between state and props?

### 2.2 Props & Data Flow
- How do you pass data from parent to child components (vs Angular's `input()`)?
- How is one-way data flow enforced in React?
- What is prop drilling and how do you avoid it?
- How do you handle default props?
- What is prop validation with PropTypes or TypeScript?

### 2.3 Event Handling
- How do you handle events in React (vs Angular's event bindings)?
- How do you pass data from child to parent (vs Angular's `output()`)?
- What are synthetic events in React?
- How do you prevent default behavior and stop propagation?
- How do you handle form submissions?

### 2.4 Lifting State Up
- When should you lift state up to a parent component?
- How do you share state between sibling components?
- What is the difference between local and shared state?

---

## Phase 3: Advanced Hooks & Side Effects

### 3.1 useEffect Hook
- What is `useEffect` and how does it relate to Angular lifecycle hooks (`ngOnInit`, `ngOnDestroy`)?
- How do you handle side effects in React?
- What is the dependency array and why is it important?
- How do you clean up effects (vs Angular's `ngOnDestroy`)?
- What are the common pitfalls with `useEffect`?

### 3.2 Additional Hooks
- What is `useContext` and how does it compare to Angular's dependency injection?
- What is `useReducer` and when should you use it over `useState`?
- What is `useRef` and how does it compare to Angular's `ViewChild` and `ElementRef`?
- What is `useMemo` and how does it relate to Angular's `computed()`?
- What is `useCallback` and when should you use it?
- What is `useLayoutEffect` and how does it differ from `useEffect`?

### 3.3 Custom Hooks
- What are custom hooks and how do they compare to Angular services?
- How do you create reusable logic with custom hooks?
- What are the naming conventions for custom hooks?
- How do you share stateful logic between components?

---

## Phase 4: Forms & Validation

### 4.1 Controlled Components
- What are controlled components in React?
- How do you handle form inputs (vs Angular's Reactive Forms)?
- How do you manage multiple form fields?
- What is two-way data binding in React (vs Angular's `[(ngModel)]`)?

### 4.2 Form Libraries
- What are popular form libraries in React (Formik, React Hook Form)?
- How do these libraries compare to Angular's Reactive Forms?
- How do you handle form validation?
- How do you display validation errors?

### 4.3 Uncontrolled Components
- What are uncontrolled components?
- When should you use refs instead of state for forms?
- How do you access form values with refs?

---

## Phase 5: Routing & Navigation

### 5.1 React Router Basics
- What is React Router and how does it compare to Angular Router?
- How do you set up routing in a React application?
- How do you define routes and nested routes?
- How do you handle route parameters (vs Angular's ActivatedRoute)?
- How do you navigate programmatically (vs Angular's Router.navigate)?

### 5.2 Advanced Routing
- How do you implement lazy loading (code splitting) in React?
- How do you handle route guards (vs Angular's CanActivate)?
- How do you implement redirects?
- How do you handle 404 pages?
- What are search params and how do you access them?

### 5.3 Navigation Patterns
- How do you create navigation links (vs Angular's RouterLink)?
- How do you handle active link styling?
- How do you pass state through navigation?

---

## Phase 6: HTTP & Async Operations

### 6.1 Data Fetching
- How do you make HTTP requests in React (vs Angular's HttpClient)?
- What is the Fetch API and how do you use it?
- How do you handle loading states?
- How do you handle errors in async operations?
- Where should data fetching happen in the component lifecycle?

### 6.2 Data Fetching Libraries
- What are popular data fetching libraries (React Query, SWR, Apollo Client)?
- How do they compare to Angular's HttpClient and observables?
- What is data caching and how do these libraries handle it?
- What are optimistic updates?

### 6.3 Async Patterns
- How do you handle multiple concurrent requests?
- How do you cancel requests on component unmount?
- How do you implement retry logic?
- How do you handle race conditions?

---

## Phase 7: State Management Solutions

### 7.1 Context API
- What is React Context and when should you use it?
- How do you create and provide context?
- How do you consume context in components?
- What are the performance implications of Context?
- How does Context compare to Angular's dependency injection?

### 7.2 Redux
- What is Redux and how does it compare to NgRx?
- What are actions, reducers, and the store?
- How do you connect React components to Redux?
- What is Redux Toolkit and why should you use it?
- What are Redux middlewares (thunk, saga)?

### 7.3 Other State Management
- What is Zustand and how does it simplify state management?
- What is Jotai and how does it use atoms for state?
- What is Recoil and how does it handle derived state?
- When should you use each state management solution?

---

## Phase 8: Styling in React

### 8.1 CSS Approaches
- How do you import and use CSS files in React?
- What are CSS Modules and how do they provide scoping (vs Angular's component styles)?
- How do you handle global styles?
- What is the className prop?

### 8.2 CSS-in-JS
- What is CSS-in-JS and why would you use it?
- What are popular CSS-in-JS libraries (styled-components, Emotion)?
- How do you create styled components?
- How do you handle dynamic styles?
- How do you create themes?

### 8.3 Utility-First CSS
- What is Tailwind CSS and how do you use it with React?
- How does it compare to utility classes in Angular?
- How do you handle responsive design?
- How do you create custom utilities?

### 8.4 SASS/SCSS
- How do you use SASS in React applications?
- How do you structure SASS files in a React project?
- What are the differences in using SASS with React vs Angular?

---

## Phase 9: Performance Optimization

### 9.1 React Performance
- How does React's reconciliation algorithm work?
- What is the difference between re-rendering and re-mounting?
- How do you profile React applications?
- What are the common performance bottlenecks?

### 9.2 Optimization Techniques
- What is `React.memo` and when should you use it?
- How do `useMemo` and `useCallback` prevent unnecessary re-renders?
- What is the `key` prop and why is it important (vs Angular's `trackBy`)?
- How do you optimize list rendering?
- What is code splitting and lazy loading in React?

### 9.3 Suspense & Concurrent Features
- What is React Suspense and how does it work?
- How do you implement lazy loading with Suspense?
- What are transitions in React 18+?
- What is concurrent rendering?

---

## Phase 10: Testing

### 10.1 Testing Basics
- What is Jest and how does it compare to Jasmine/Karma?
- What is React Testing Library?
- How do you write unit tests for React components?
- What is the difference between shallow and full rendering?

### 10.2 Component Testing
- How do you test component rendering?
- How do you test user interactions?
- How do you test async behavior?
- How do you mock API calls?
- How do you test hooks?

### 10.3 E2E Testing
- What are popular E2E testing tools for React (Cypress, Playwright)?
- How do they compare to Protractor/Cypress in Angular projects?
- How do you write E2E tests?
- How do you handle test data and fixtures?

---

## Phase 11: TypeScript with React

### 11.1 TypeScript Fundamentals
- How do you set up TypeScript in a React project?
- How do you type React components?
- What is `React.FC` and should you use it?
- How do you type props and state?

### 11.2 Advanced TypeScript
- How do you type hooks (`useState`, `useEffect`, etc.)?
- How do you type events and event handlers?
- How do you type Context API?
- How do you create generic components?
- What are utility types for React (`ComponentProps`, `PropsWithChildren`, etc.)?

### 11.3 Type Safety Best Practices
- How do you avoid the `any` type in React?
- How do you type third-party libraries without types?
- How do you handle union types in props?
- How do you type higher-order components?

---

## Phase 12: Build Tools & Project Setup

### 12.1 Build Tools
- What is Vite and how does it compare to Angular CLI?
- What is Create React App (CRA) and when should you use it?
- What is webpack and how does it work?
- How do you configure custom build processes?

### 12.2 Development Environment
- How do you set up ESLint for React?
- How do you set up Prettier?
- What are React DevTools and how do you use them?
- How do you configure VS Code for React development?

### 12.3 Project Structure
- How do you structure a React application?
- What are common folder structures (feature-based, layer-based)?
- How do you organize components, hooks, and utilities?
- How do you handle environment variables?

---

## Phase 13: Advanced Patterns

### 13.1 Component Patterns
- What are Higher-Order Components (HOCs)?
- What are Render Props?
- What is the Compound Component pattern?
- What is the Provider pattern?
- How do these patterns compare to Angular's structural directives and services?

### 13.2 Code Organization
- How do you create presentational vs container components?
- What is the difference between smart and dumb components?
- How do you implement component composition effectively?
- How do you create layout components?

### 13.3 Error Handling
- What are Error Boundaries and how do they work?
- How do you handle errors globally?
- How do you create fallback UIs?
- How does this compare to Angular's ErrorHandler?

---

## Phase 14: Server-Side Rendering & Frameworks

### 14.1 Next.js Basics
- What is Next.js and how does it compare to Angular Universal?
- What are the benefits of server-side rendering?
- How do you create pages in Next.js?
- What is the App Router vs Pages Router?
- How do you handle routing in Next.js?

### 14.2 Next.js Features
- What is Static Site Generation (SSG)?
- What is Server-Side Rendering (SSR)?
- What is Incremental Static Regeneration (ISR)?
- How do you fetch data in Next.js?
- How do you create API routes?

### 14.3 Other Frameworks
- What is Remix and how does it differ from Next.js?
- What is Gatsby and when should you use it?
- How do these frameworks compare to Angular's approach?

---

## Phase 15: Mobile Development

### 15.1 React Native
- What is React Native and how does it compare to Ionic/Capacitor?
- How much React knowledge transfers to React Native?
- What are the differences between web and native components?
- How do you handle platform-specific code?

### 15.2 Mobile Patterns
- How do you handle navigation in React Native?
- How do you access native device features?
- How do you handle styling in React Native?
- What are the performance considerations?

---

## Phase 16: Real-World Application Development

### 16.1 Architecture
- How do you structure a large-scale React application?
- How do you implement feature modules (vs Angular modules)?
- How do you handle dependency management?
- How do you implement micro-frontends with React?

### 16.2 Authentication & Authorization
- How do you implement authentication in React?
- How do you handle JWT tokens?
- How do you protect routes?
- How do you manage user sessions?

### 16.3 Accessibility
- How do you make React applications accessible?
- What are ARIA attributes and how do you use them?
- How do you handle keyboard navigation?
- How do you test for accessibility?

### 16.4 Internationalization
- How do you implement i18n in React?
- What are popular i18n libraries (react-i18next, react-intl)?
- How does this compare to Angular's i18n?
- How do you handle pluralization and formatting?

### 16.5 SEO
- How do you optimize React apps for SEO?
- What are meta tags and how do you manage them?
- How do you implement structured data?
- What is the role of SSR/SSG for SEO?

---

## Phase 17: Deployment & DevOps

### 17.1 Build & Deployment
- How do you build React apps for production?
- What are environment variables and how do you use them?
- How do you optimize bundle size?
- How do you deploy React apps to different platforms?

### 17.2 CI/CD
- How do you set up continuous integration for React?
- How do you automate testing and deployment?
- How do you handle versioning?
- How do you implement feature flags?

### 17.3 Monitoring & Analytics
- How do you implement error tracking?
- How do you implement analytics?
- How do you monitor performance in production?
- How do you handle logging?

---

## Phase 18: Migration Strategies

### 18.1 Incremental Migration
- Can you run React and Angular side by side?
- How do you gradually migrate from Angular to React?
- What are micro-frontend approaches for migration?
- How do you handle shared state during migration?

### 18.2 Code Reuse
- What Angular code can be reused in React?
- How do you port Angular services to React?
- How do you migrate Angular components to React?
- How do you handle routing during migration?

---

## Key Differences Summary

### Angular vs React Cheat Sheet
- Components: Class decorators → Function components
- State: Signals → useState/useReducer
- Derived state: computed() → useMemo/computed values
- DI: Services with @Injectable → Custom hooks/Context
- Templates: HTML with directives → JSX
- Styling: Component styles → CSS Modules/CSS-in-JS
- Forms: Reactive Forms → Controlled components/form libraries
- HTTP: HttpClient + RxJS → Fetch + Promises/async-await
- Routing: Angular Router → React Router
- Lifecycle: Lifecycle hooks → useEffect
- Change Detection: Zone.js → Re-render on state change
- Testing: Jasmine/Karma → Jest/React Testing Library
- CLI: Angular CLI → Vite/CRA/custom webpack

---

## Learning Tips for Angular Developers

1. **Embrace the paradigm shift**: React is less opinionated than Angular
2. **Unlearn decorators**: React uses functions and hooks instead
3. **Think in functional programming**: Embrace immutability and pure functions
4. **JSX is not templates**: It's JavaScript with XML-like syntax
5. **State management is explicit**: No magic, you control when components re-render
6. **Ecosystem freedom**: You choose your libraries (routing, forms, state management)
7. **Component composition**: Build small, reusable pieces
8. **Props are read-only**: Unlike Angular where you can modify inputs (but shouldn't)
9. **One-way data flow**: Strictly enforced, no two-way binding by default
10. **Learn the ecosystem**: React has more third-party solutions than Angular

---

## Recommended Learning Path Order

1. Start with fundamentals (Phase 1-2)
2. Master hooks and effects (Phase 3)
3. Learn forms and routing (Phase 4-5)
4. Understand HTTP and state management (Phase 6-7)
5. Style your applications (Phase 8)
6. Optimize and test (Phase 9-10)
7. Add TypeScript expertise (Phase 11)
8. Explore advanced topics (Phase 12-15)
9. Build real-world applications (Phase 16)
10. Learn deployment (Phase 17)
11. Optionally explore migration (Phase 18)

---

# ANSWERS

## Phase 1: Core Fundamentals - Answers

### 1.1 What is the main difference between Angular's opinionated framework and React's library approach?

**Answer:**

Angular is a complete, opinionated framework that provides everything you need out of the box: routing, forms, HTTP client, dependency injection, CLI tools, and more. It enforces a specific way of structuring your application.

React, on the other hand, is a library focused solely on building user interfaces. It doesn't include:
- A built-in router (you choose: React Router, TanStack Router, etc.)
- A forms solution (you choose: controlled components, Formik, React Hook Form, etc.)
- HTTP client (you use Fetch API, Axios, or data fetching libraries)
- State management beyond component state (you choose: Context, Redux, Zustand, etc.)

**Key differences:**
- **Angular**: "One way to do things" - framework provides the solution
- **React**: "Many ways to do things" - you pick from the ecosystem

**Pros of React's approach:**
- Smaller bundle size (only include what you need)
- Flexibility to choose best-fit libraries
- Easier to understand core concepts
- Can integrate into existing projects gradually

**Cons of React's approach:**
- Decision fatigue (which library to use?)
- Need to research and learn multiple libraries
- Less standardization across projects
- More setup required initially

[↑ Back to Roadmap](#11-understanding-react-philosophy)

---

### 1.2 How does React's "UI as a function of state" philosophy differ from Angular's component-based architecture?

**Answer:**

React treats components as pure functions that take inputs (props and state) and return UI:

```typescript
// React: UI = f(state)
function UserProfile({ name, age }) {
  const [isOnline, setIsOnline] = useState(false);
  
  // UI is directly derived from props and state
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
}
```

Angular also has component-based architecture, but with more ceremony and framework-specific patterns:

```typescript
// Angular: More class-based, decorator-driven
@Component({
  selector: 'app-user-profile',
  template: `
    <div>
      <h1>{{ name }}</h1>
      <p>Age: {{ age }}</p>
      <p>Status: {{ isOnline() ? 'Online' : 'Offline' }}</p>
    </div>
  `
})
export class UserProfileComponent {
  name = input.required<string>();
  age = input.required<number>();
  isOnline = signal(false);
}
```

**Key philosophical differences:**

1. **React**: Emphasizes functional programming
   - Components are functions
   - State transformations are explicit
   - Immutability is expected
   - Re-renders when state/props change

2. **Angular**: Embraces OOP and decorators
   - Components are classes (though standalone components simplify this)
   - Change detection is automatic
   - Signals provide reactive updates
   - More "magical" updates via Zone.js (or signal-based change detection)

**React's mental model:**
- When state changes → component function re-runs → new UI is computed
- Previous UI vs new UI are compared (reconciliation) → DOM updates

**Angular's mental model:**
- When state changes → change detection runs → bindings update
- With signals → dependencies tracked → only affected parts update

[↑ Back to Roadmap](#11-understanding-react-philosophy)

---

### 1.3 What is the Virtual DOM and how does it compare to Angular's change detection?

**Answer:**

**Virtual DOM (React):**
The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React's rendering process:

1. **Initial Render**: Create Virtual DOM tree from components
2. **State Change**: Component re-renders, creating new Virtual DOM tree
3. **Diffing**: React compares new Virtual DOM with previous one
4. **Reconciliation**: Determines minimal changes needed
5. **DOM Update**: Only changed parts are updated in real DOM

```typescript
// When this component re-renders
function Counter() {
  const [count, setCount] = useState(0);
  
  // Entire function runs again, creating new Virtual DOM
  return (
    <div>
      <p>Count: {count}</p>  {/* Only this text node updates in real DOM */}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Angular's Change Detection:**
Angular traditionally uses Zone.js to detect changes, then checks bindings:

1. **Zone.js intercepts** async operations (events, timers, HTTP)
2. **Change detection runs** from root to leaves
3. **Checks bindings** in each component
4. **Updates DOM** where values changed

**Modern Angular with Signals:**
- Tracks dependencies automatically
- Only updates components that depend on changed signals
- More efficient, similar to fine-grained reactivity

```typescript
@Component({
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1); // Only this binding updates
  }
}
```

**Comparison:**

| Aspect | React (Virtual DOM) | Angular (Traditional) | Angular (Signals) |
|--------|-------------------|---------------------|------------------|
| Approach | Diffing algorithm | Dirty checking | Fine-grained reactivity |
| Granularity | Component-level | Component-level | Binding-level |
| When runs | On state change | On any async event | On signal change |
| Performance | Good with optimization | Can be slower | Very efficient |
| Developer control | Manual (memo, useMemo) | Change detection strategy | Automatic |

**Key takeaway for Angular devs:**
- React re-runs component functions (but only updates changed DOM)
- Angular checks bindings (or with signals, tracks dependencies)
- Both achieve similar results with different mechanisms

[↑ Back to Roadmap](#11-understanding-react-philosophy)

---

### 1.4 What is JSX and how does it differ from Angular templates?

**Answer:**

**JSX (JavaScript XML):**
JSX is a syntax extension for JavaScript that looks like HTML but is actually JavaScript. It gets transpiled to JavaScript function calls.

```jsx
// This JSX
const element = (
  <div className="container">
    <h1>Hello, {name}!</h1>
    <button onClick={handleClick}>Click me</button>
  </div>
);

// Gets transpiled to this JavaScript
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello, ', name, '!'),
  React.createElement('button', { onClick: handleClick }, 'Click me')
);
```

**Angular Templates:**
HTML-like templates with special syntax for Angular directives and bindings:

```html
<div class="container">
  <h1>Hello, {{ name }}!</h1>
  <button (click)="handleClick()">Click me</button>
</div>
```

**Key Differences:**

1. **JSX is JavaScript**

```jsx
// You can use any JavaScript expression
const element = (
  <div>
    {/* JavaScript expressions in curly braces */}
    {items.map(item => <li key={item.id}>{item.name}</li>)}
    {isLoggedIn ? <UserMenu /> : <LoginButton />}
    {count > 10 && <Warning />}
  </div>
);
```

**Angular templates use directives:**

```html
<div>
  <!-- Angular-specific syntax -->
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  }
  @if (isLoggedIn) {
    <app-user-menu />
  } @else {
    <app-login-button />
  }
  @if (count > 10) {
    <app-warning />
  }
</div>
```

2. **Attribute naming**

```jsx
// JSX uses camelCase for attributes
<div 
  className="container"        // not "class"
  htmlFor="input"              // not "for"
  onClick={handler}            // not "onclick"
  tabIndex={0}                 // not "tabindex"
/>
```

```html
<!-- Angular uses standard HTML attributes -->
<div 
  class="container"
  for="input"
  (click)="handler()"
  tabindex="0"
/>
```

3. **Event handling**

```jsx
// JSX: Pass function reference
<button onClick={handleClick}>Click</button>
<button onClick={(e) => handleClick(e, id)}>Click</button>
```

```html
<!-- Angular: String with expression -->
<button (click)="handleClick()">Click</button>
<button (click)="handleClick($event, id)">Click</button>
```

4. **Conditional rendering**

```jsx
// JSX: Use JavaScript operators
{isVisible && <Component />}
{isLoggedIn ? <UserPanel /> : <LoginPanel />}
```

```html
<!-- Angular: Use directives -->
@if (isVisible) {
  <app-component />
}
@if (isLoggedIn) {
  <app-user-panel />
} @else {
  <app-login-panel />
}
```

5. **Styles**

```jsx
// JSX: Style object with camelCase properties
<div style={{ 
  backgroundColor: 'blue',    // camelCase
  fontSize: '14px',
  marginTop: 10               // numbers add 'px'
}}>
```

```html
<!-- Angular: Standard CSS -->
<div [style.background-color]="'blue'"
     [style.font-size.px]="14"
     [style.margin-top.px]="10">
```

**Advantages of JSX:**
- Full JavaScript power in templates
- Type checking of templates with TypeScript
- Better IDE support (autocomplete, refactoring)
- Can extract complex logic into variables

**Advantages of Angular Templates:**
- Clearer separation of concerns
- More familiar to HTML developers
- Special syntax prevents accidental side effects
- Async pipe for automatic subscription management

[↑ Back to Roadmap](#11-understanding-react-philosophy)

---

### 1.5 What are function components in React? How do they compare to Angular standalone components?

**Answer:**

**React Function Components:**
A function component is simply a JavaScript function that returns JSX. It's the modern, recommended way to write React components.

```typescript
// Basic function component
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function variant
const Welcome = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>;
};

// With state and effects
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Angular Standalone Components:**
Standalone components are classes with decorators, but don't require NgModule declarations:

```typescript
import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: '<h1>Hello, {{ name() }}!</h1>'
})
export class WelcomeComponent {
  name = input.required<string>();
}

// With state and lifecycle
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class CounterComponent implements OnInit, OnDestroy {
  count = signal(0);
  
  ngOnInit() {
    console.log('Component initialized');
  }
  
  ngOnDestroy() {
    console.log('Component destroyed');
  }
  
  increment() {
    this.count.update(c => c + 1);
  }
}
```

**Similarities:**
- Both create reusable UI components
- Both can manage local state
- Both can accept inputs/props
- Both have lifecycle capabilities
- Both support composition

**Differences:**

| Aspect | React Function Components | Angular Standalone Components |
|--------|------------------------|------------------------------|
| Syntax | Plain functions | Classes with decorators |
| State | `useState` hook | `signal()` or class properties |
| Props/Inputs | Function parameters | `input()` function |
| Lifecycle | `useEffect` hook | Lifecycle interface methods |
| Side effects | `useEffect` | `ngOnInit`, `ngOnDestroy`, etc. |
| Logic reuse | Custom hooks | Services or directives |
| Template | JSX returned from function | Separate template or inline |
| No boilerplate | Just a function | Decorator required |

**Key mental shift for Angular devs:**
- React: Component = function that runs on every render
- Angular: Component = class instance that lives through renders

[↑ Back to Roadmap](#12-components-basics)

---

### 1.6 What is the difference between class components and function components?

**Answer:**

**Class Components (Legacy, but still valid):**

```typescript
import React, { Component } from 'react';

interface Props {
  initialCount: number;
}

interface State {
  count: number;
}

class Counter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: props.initialCount };
    
    // Need to bind methods
    this.handleClick = this.handleClick.bind(this);
  }
  
  // Lifecycle methods
  componentDidMount() {
    console.log('Component mounted');
  }
  
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.count !== this.state.count) {
      console.log('Count changed');
    }
  }
  
  componentWillUnmount() {
    console.log('Component will unmount');
  }
  
  // Event handler
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>Increment</button>
      </div>
    );
  }
}
```

**Function Components (Modern, recommended):**

```typescript
import { useState, useEffect } from 'react';

interface Props {
  initialCount: number;
}

function Counter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  
  // Lifecycle with useEffect
  useEffect(() => {
    console.log('Component mounted');
    
    return () => {
      console.log('Component will unmount');
    };
  }, []);
  
  useEffect(() => {
    console.log('Count changed');
  }, [count]);
  
  // Event handler (no binding needed)
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

**Key Differences:**

1. **Syntax & Verbosity:**
   - Class: More boilerplate, need constructor, `this` keyword
   - Function: Cleaner, less code

2. **State Management:**
   - Class: `this.state` and `this.setState()`
   - Function: `useState` hook

3. **Lifecycle:**
   - Class: Multiple lifecycle methods
   - Function: `useEffect` hook handles all cases

4. **Method Binding:**
   - Class: Need to bind methods or use arrow functions
   - Function: No binding issues

5. **Logic Reuse:**
   - Class: HOCs (Higher-Order Components) or render props
   - Function: Custom hooks (much cleaner)

6. **Performance:**
   - Both perform similarly
   - Function components slightly smaller bundle size

**Lifecycle Mapping:**

```typescript
// Class component lifecycle
class Example extends Component {
  componentDidMount() {
    // Runs after first render
  }
  
  componentDidUpdate(prevProps, prevState) {
    // Runs after every update
  }
  
  componentWillUnmount() {
    // Runs before component is destroyed
  }
}

// Function component equivalent
function Example() {
  // componentDidMount
  useEffect(() => {
    // Runs after first render
  }, []);
  
  // componentDidUpdate
  useEffect(() => {
    // Runs after every render
  });
  
  // componentWillUnmount
  useEffect(() => {
    return () => {
      // Cleanup function runs before unmount
    };
  }, []);
}
```

**When to use each:**
- **Function components**: Always, for new code
- **Class components**: Only when maintaining legacy code

**For Angular developers:**
- Angular components are similar to React class components (both use classes)
- React function components are more different from Angular's approach
- Function components + hooks are closer to Angular's new signal-based approach

[↑ Back to Roadmap](#12-components-basics)

---

### 1.7 How do you define a React component without decorators like `@Component`?

**Answer:**

React doesn't use decorators at all. Components are defined as plain functions or classes (for legacy):

**1. Basic Function Component:**

```typescript
// Simple component with no props
function HelloWorld() {
  return <h1>Hello, World!</h1>;
}

// Export for use in other files
export default HelloWorld;
```

**2. Component with Props:**

```typescript
// Props defined with TypeScript interface
interface UserCardProps {
  name: string;
  email: string;
  age?: number;  // optional prop
}

function UserCard({ name, email, age }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

export default UserCard;
```

**3. Component with State and Effects:**

```typescript
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
```

**4. Component with Children:**

```typescript
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;  // For nested content
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="My Card">
      <p>This is the content inside the card.</p>
      <button>Click me</button>
    </Card>
  );
}
```

**5. Arrow Function Components:**

```typescript
// Single-line return
const Greeting = ({ name }: { name: string }) => (
  <h1>Hello, {name}!</h1>
);

// Multi-line with logic
const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};
```

**Comparison to Angular:**

```typescript
// Angular: Requires decorator
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="user-card">
      <h2>{{ name() }}</h2>
      <p>{{ email() }}</p>
      @if (age()) {
        <p>Age: {{ age() }}</p>
      }
    </div>
  `,
  styles: [`
    .user-card { padding: 20px; }
  `]
})
export class UserCardComponent {
  name = input.required<string>();
  email = input.required<string>();
  age = input<number>();
}

// React: Just a function
interface UserCardProps {
  name: string;
  email: string;
  age?: number;
}

function UserCard({ name, email, age }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// Styles in separate CSS file or CSS-in-JS
```

**Key Points for Angular Developers:**
- No `@Component` decorator needed
- No `selector` - use the function name
- No `template` property - return JSX directly
- No `imports` array - use ES6 imports
- Props are function parameters, not `input()`
- Much less boilerplate

[↑ Back to Roadmap](#12-components-basics)

---

### 1.8 What is the component lifecycle in React and how does it map to Angular lifecycle hooks?

**Answer:**

**React Lifecycle with Hooks:**

```typescript
import { useState, useEffect } from 'react';

function LifecycleExample({ userId }: { userId: number }) {
  const [data, setData] = useState(null);
  
  // Equivalent to ngOnInit (runs once after mount)
  useEffect(() => {
    console.log('Component mounted');
    // Initial setup
  }, []); // Empty dependency array
  
  // Equivalent to ngOnChanges (runs when userId changes)
  useEffect(() => {
    console.log('userId changed:', userId);
    fetchUserData(userId);
  }, [userId]); // Runs when userId changes
  
  // Equivalent to ngOnDestroy (cleanup)
  useEffect(() => {
    const subscription = subscribeToUpdates();
    
    return () => {
      console.log('Component will unmount');
      subscription.unsubscribe();
    };
  }, []);
  
  // Runs after every render
  useEffect(() => {
    console.log('Component updated');
  }); // No dependency array
  
  return <div>{/* JSX */}</div>;
}
```

**Lifecycle Mapping:**

| Angular | React (Hooks) | Description |
|---------|---------------|-------------|
| `constructor` | `useState` initialization | Initial state setup |
| `ngOnChanges` | `useEffect(() => {}, [prop])` | React to prop changes |
| `ngOnInit` | `useEffect(() => {}, [])` | After first render |
| `ngDoCheck` | `useEffect(() => {})` | After every render |
| `ngAfterContentInit` | No direct equivalent | Use refs if needed |
| `ngAfterContentChecked` | No direct equivalent | Rarely needed |
| `ngAfterViewInit` | `useEffect(() => {}, [])` + refs | After DOM ready |
| `ngAfterViewChecked` | `useLayoutEffect` | After DOM updates |
| `ngOnDestroy` | `useEffect` cleanup function | Before unmount |

**Detailed Examples:**

**1. Component Initialization (ngOnInit):**

```typescript
// Angular
@Component({...})
export class UserComponent implements OnInit {
  userId = input.required<number>();
  user = signal<User | null>(null);
  
  ngOnInit() {
    this.loadUser();
  }
  
  loadUser() {
    this.http.get(`/api/users/${this.userId()}`)
      .subscribe(user => this.user.set(user));
  }
}

// React
function UserComponent({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Runs once after mount
  
  return <div>{/* JSX */}</div>;
}
```

**2. Reacting to Input/Prop Changes (ngOnChanges):**

```typescript
// Angular
@Component({...})
export class UserComponent implements OnChanges {
  userId = input.required<number>();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId']) {
      this.loadUser(changes['userId'].currentValue);
    }
  }
}

// React
function UserComponent({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Runs when userId changes
  
  return <div>{/* JSX */}</div>;
}
```

**3. Cleanup (ngOnDestroy):**

```typescript
// Angular
@Component({...})
export class TimerComponent implements OnInit, OnDestroy {
  private intervalId?: number;
  
  ngOnInit() {
    this.intervalId = setInterval(() => {
      console.log('Tick');
    }, 1000);
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// React
function TimerComponent() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup function (like ngOnDestroy)
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <div>{/* JSX */}</div>;
}
```

**4. Multiple Effects for Different Concerns:**

```typescript
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Effect 1: Load user data
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Effect 2: Load user posts
  useEffect(() => {
    fetch(`/api/users/${userId}/posts`)
      .then(res => res.json())
      .then(setPosts);
  }, [userId]);
  
  // Effect 3: Update document title
  useEffect(() => {
    if (user) {
      document.title = user.name;
    }
  }, [user]);
  
  // Effect 4: Setup WebSocket
  useEffect(() => {
    const ws = new WebSocket(`/ws/users/${userId}`);
    
    ws.onmessage = (event) => {
      console.log('Message:', event.data);
    };
    
    return () => ws.close();
  }, [userId]);
  
  return <div>{/* JSX */}</div>;
}
```

**Key Differences:**
- Angular: Separate lifecycle methods for each phase
- React: One hook (`useEffect`) handles all lifecycle needs
- React: Can have multiple `useEffect` calls for different concerns
- React: Dependency array determines when effect runs
- React: Return function from effect for cleanup

[↑ Back to Roadmap](#12-components-basics)

---

### 1.9 How do you handle component composition in React vs Angular?

**Answer:**

Component composition is the practice of building complex UIs by combining simpler components.

**1. Basic Composition - Children:**

```typescript
// React: children prop
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="Welcome">
      <p>This is the card content.</p>
      <button>Click me</button>
    </Card>
  );
}
```

```typescript
// Angular: ng-content
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h2>{{ title() }}</h2>
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `
})
export class CardComponent {
  title = input.required<string>();
}

// Usage
@Component({
  template: `
    <app-card title="Welcome">
      <p>This is the card content.</p>
      <button>Click me</button>
    </app-card>
  `
})
export class AppComponent {}
```

**2. Multiple Slots (Named Slots):**

```typescript
// React: Multiple props for different slots
interface ModalProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

function Modal({ header, footer, children }: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-header">{header}</div>
      <div className="modal-body">{children}</div>
      <div className="modal-footer">{footer}</div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Modal
      header={<h2>Modal Title</h2>}
      footer={
        <>
          <button>Cancel</button>
          <button>Save</button>
        </>
      }
    >
      <p>Modal content goes here</p>
    </Modal>
  );
}
```

```typescript
// Angular: Named ng-content with select
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal">
      <div class="modal-header">
        <ng-content select="[header]" />
      </div>
      <div class="modal-body">
        <ng-content />
      </div>
      <div class="modal-footer">
        <ng-content select="[footer]" />
      </div>
    </div>
  `
})
export class ModalComponent {}

// Usage
@Component({
  template: `
    <app-modal>
      <h2 header>Modal Title</h2>
      <p>Modal content goes here</p>
      <div footer>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </app-modal>
  `
})
export class AppComponent {}
```

**3. Compound Components Pattern:**

```typescript
// React: Context for shared state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  const isActive = context?.activeTab === id;
  
  return (
    <button
      className={isActive ? 'active' : ''}
      onClick={() => context?.setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }: { children: React.ReactNode }) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  
  if (context?.activeTab !== id) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Compose the compound component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage - Very flexible and intuitive
function App() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
        <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panels>
        <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
        <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
        <Tabs.Panel id="tab3">Content 3</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

**Key Takeaways:**
- React: Composition through props (especially `children`)
- Angular: Composition through `ng-content` projection
- React: More flexible with render props and compound components
- Angular: More structured with directives
- Both: Support nested component hierarchies
- React: Compound components pattern for complex UI kits
- Angular: Services + content projection for sharing logic

[↑ Back to Roadmap](#12-components-basics)

---

### 1.10 How do you write conditional rendering in JSX (vs Angular's `@if`)?

**Answer:**

React doesn't have special template directives. Instead, you use JavaScript operators for conditionals.

**1. Ternary Operator (? :):**

```typescript
// React
function UserGreeting({ isLoggedIn, username }: Props) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {username}!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}
```

```typescript
// Angular
@Component({
  template: `
    <div>
      @if (isLoggedIn()) {
        <h1>Welcome back, {{ username() }}!</h1>
      } @else {
        <h1>Please sign in</h1>
      }
    </div>
  `
})
export class UserGreetingComponent {
  isLoggedIn = input.required<boolean>();
  username = input.required<string>();
}
```

**2. Logical AND (&&) - Show if true:**

```typescript
// React: Show component only if condition is true
function Notifications({ count }: { count: number }) {
  return (
    <div>
      <h2>Notifications</h2>
      {count > 0 && (
        <span className="badge">{count}</span>
      )}
    </div>
  );
}

// Multiple conditions
function UserPanel({ user, isAdmin }: Props) {
  return (
    <div>
      {user && <p>Name: {user.name}</p>}
      {user && isAdmin && <AdminControls />}
    </div>
  );
}
```

```typescript
// Angular
@Component({
  template: `
    <div>
      <h2>Notifications</h2>
      @if (count() > 0) {
        <span class="badge">{{ count() }}</span>
      }
    </div>
  `
})
export class NotificationsComponent {
  count = input.required<number>();
}
```

**3. If-else with variables:**

```typescript
// React: Assign JSX to variables
function StatusMessage({ status }: { status: string }) {
  let message;
  
  if (status === 'success') {
    message = <div className="success">Operation successful!</div>;
  } else if (status === 'error') {
    message = <div className="error">Something went wrong</div>;
  } else {
    message = <div className="info">Processing...</div>;
  }
  
  return <div>{message}</div>;
}
```

```typescript
// Angular: Use @if with @else if
@Component({
  template: `
    <div>
      @if (status() === 'success') {
        <div class="success">Operation successful!</div>
      } @else if (status() === 'error') {
        <div class="error">Something went wrong</div>
      } @else {
        <div class="info">Processing...</div>
      }
    </div>
  `
})
export class StatusMessageComponent {
  status = input.required<string>();
}
```

**4. Switch statements:**

```typescript
// React: Use switch or object lookup
function StatusIcon({ status }: { status: string }) {
  // Method 1: Switch statement
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  return <div>{getIcon()}</div>;
}

// Method 2: Object lookup (cleaner)
function StatusIcon({ status }: { status: string }) {
  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />
  };
  
  return <div>{icons[status] || icons.info}</div>;
}
```

```typescript
// Angular: @switch
@Component({
  template: `
    <div>
      @switch (status()) {
        @case ('success') {
          <app-success-icon />
        }
        @case ('error') {
          <app-error-icon />
        }
        @case ('warning') {
          <app-warning-icon />
        }
        @default {
          <app-info-icon />
        }
      }
    </div>
  `
})
export class StatusIconComponent {
  status = input.required<string>();
}
```

**5. Early returns:**

```typescript
// React: Return early for cleaner code
function UserProfile({ user }: { user?: User }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  if (user.isBanned) {
    return <div>This user has been banned</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**Common Pitfalls:**

```typescript
// ❌ Bad: 0 will be rendered (falsy but not null/undefined)
{count && <div>Count: {count}</div>}  // Shows "0" when count is 0

// ✅ Good: Explicitly check
{count > 0 && <div>Count: {count}</div>}

// ❌ Bad: Multiple elements without wrapper
{isVisible && 
  <div>First</div>
  <div>Second</div>
}

// ✅ Good: Wrap in fragment
{isVisible && (
  <>
    <div>First</div>
    <div>Second</div>
  </>
)}
```

[↑ Back to Roadmap](#13-jsx-deep-dive)

---

### 1.11 How do you iterate over lists in JSX (vs Angular's `@for`)?

**Answer:**

In React, you use JavaScript's array methods (primarily `.map()`) to render lists.

**1. Basic List Rendering:**

```typescript
// React: Use .map()
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

```typescript
// Angular: Use @for
@Component({
  template: `
    <ul>
      @for (user of users(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `
})
export class UserListComponent {
  users = input.required<User[]>();
}
```

**2. The `key` Prop (Required!):**

```typescript
// React: key helps React identify which items changed
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>  {/* ✅ Unique key */}
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}

// ❌ Bad: Using index as key (only if list never reorders)
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>
))}

// ✅ Good: Use unique ID
{todos.map(todo => (
  <li key={todo.id}>{todo.text}</li>
))}
```

**3. Empty List Handling:**

```typescript
// React: Conditional rendering
function UserList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return <p>No users found</p>;
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

```typescript
// Angular: @empty block
@Component({
  template: `
    <ul>
      @for (user of users(); track user.id) {
        <li>{{ user.name }}</li>
      } @empty {
        <p>No users found</p>
      }
    </ul>
  `
})
export class UserListComponent {
  users = input.required<User[]>();
}
```

**4. Filtering Lists:**

```typescript
// React: Chain array methods
function ActiveUserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users
        .filter(user => user.isActive)
        .map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
    </ul>
  );
}

// Better: Use useMemo for expensive operations
function ActiveUserList({ users }: { users: User[] }) {
  const activeUsers = useMemo(
    () => users.filter(user => user.isActive),
    [users]
  );
  
  return (
    <ul>
      {activeUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**5. Nested Lists:**

```typescript
// React: Nested maps
function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

**Key Differences:**
- **React**: Use `.map()` method (JavaScript)
- **Angular**: Use `@for` directive (template syntax)
- **React**: `key` prop for identity
- **Angular**: `track` expression for identity
- **React**: Chain methods for filter/sort/map
- **Angular**: Use pipes or computed signals
- **React**: No special `@empty` - use conditional rendering
- **Angular**: Built-in `@empty` block

[↑ Back to Roadmap](#13-jsx-deep-dive)

---

### 1.12 What are JSX expressions and how do they work with template interpolation?

**Answer:**

JSX expressions are JavaScript code embedded in JSX using curly braces `{}`. Anything inside curly braces is evaluated as JavaScript.

**1. Basic Expressions:**

```typescript
// React: Any JavaScript expression in {}
function Greeting({ firstName, lastName, age }: Props) {
  return (
    <div>
      {/* Variables */}
      <h1>{firstName} {lastName}</h1>
      
      {/* Arithmetic */}
      <p>Next year you'll be {age + 1}</p>
      
      {/* String concatenation/template literals */}
      <p>{`Hello, ${firstName}!`}</p>
      
      {/* Function calls */}
      <p>{formatDate(new Date())}</p>
      
      {/* Method calls */}
      <p>{user.getName()}</p>
      
      {/* Object property access */}
      <p>{user.profile.bio}</p>
    </div>
  );
}
```

```typescript
// Angular: Similar but different syntax
@Component({
  template: `
    <div>
      <!-- Variables -->
      <h1>{{ firstName() }} {{ lastName() }}</h1>
      
      <!-- Arithmetic -->
      <p>Next year you'll be {{ age() + 1 }}</p>
      
      <!-- Function calls -->
      <p>{{ formatDate(currentDate) }}</p>
    </div>
  `
})
export class GreetingComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  age = input.required<number>();
}
```

**2. Array Methods:**

```typescript
// React: map, filter, reduce, etc.
function Stats({ numbers }: { numbers: number[] }) {
  return (
    <div>
      {/* Map */}
      <ul>
        {numbers.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
      
      {/* Filter and map */}
      <p>Even numbers: {numbers.filter(n => n % 2 === 0).join(', ')}</p>
      
      {/* Reduce */}
      <p>Sum: {numbers.reduce((sum, n) => sum + n, 0)}</p>
      
      {/* Length */}
      <p>Count: {numbers.length}</p>
    </div>
  );
}
```

**3. What You CAN'T Use in JSX Expressions:**

```typescript
// ❌ Statements (if, for, while, switch)
function BadExample() {
  return (
    <div>
      {if (condition) { return <p>True</p> }}  // ❌ Syntax error
      {for (let i = 0; i < 10; i++) { }}       // ❌ Syntax error
    </div>
  );
}

// ✅ Use expressions instead
function GoodExample({ condition }: Props) {
  return (
    <div>
      {condition && <p>True</p>}  // ✅ Logical AND
      {condition ? <p>True</p> : <p>False</p>}  // ✅ Ternary
      {Array.from({ length: 10 }, (_, i) => <div key={i}>{i}</div>)}  // ✅ Array methods
    </div>
  );
}
```

**4. Comments in JSX:**

```typescript
// React: Comments inside {} using /* */
function Example() {
  return (
    <div>
      {/* This is a JSX comment */}
      <h1>Hello</h1>
      
      {
        // Single line comment (need braces)
      }
      
      {/*
        Multi-line
        comment
      */}
    </div>
  );
}
```

**Key Differences from Angular:**
- **React**: Single curly braces `{expression}`
- **Angular**: Double curly braces `{{ expression }}`
- **React**: Can use any JavaScript expression
- **Angular**: Limited to template expressions (no assignments)
- **React**: Full TypeScript checking in templates
- **Angular**: Separate template type checking

[↑ Back to Roadmap](#13-jsx-deep-dive)

---

### 1.13 How do you handle dynamic CSS classes in React (vs Angular's class bindings)?

**Answer:**

React uses the `className` prop (not `class`) and JavaScript for dynamic classes.

**1. Basic className:**

```typescript
// React: className prop (not class!)
function Button() {
  return <button className="btn btn-primary">Click me</button>;
}
```

```typescript
// Angular: class attribute
@Component({
  template: `<button class="btn btn-primary">Click me</button>`
})
export class ButtonComponent {}
```

**2. Conditional Classes with Template Literals:**

```typescript
// React: Template literals
function Button({ isPrimary, isLarge, isDisabled }: Props) {
  return (
    <button 
      className={`
        btn
        ${isPrimary ? 'btn-primary' : 'btn-secondary'}
        ${isLarge ? 'btn-lg' : ''}
        ${isDisabled ? 'disabled' : ''}
      `.trim()}
    >
      Click me
    </button>
  );
}

// Cleaner with array and filter
function Button({ isPrimary, isLarge, isDisabled }: Props) {
  const classes = [
    'btn',
    isPrimary ? 'btn-primary' : 'btn-secondary',
    isLarge && 'btn-lg',
    isDisabled && 'disabled'
  ].filter(Boolean).join(' ');
  
  return <button className={classes}>Click me</button>;
}
```

```typescript
// Angular: Class bindings
@Component({
  template: `
    <button 
      class="btn"
      [class.btn-primary]="isPrimary()"
      [class.btn-secondary]="!isPrimary()"
      [class.btn-lg]="isLarge()"
      [class.disabled]="isDisabled()"
    >
      Click me
    </button>
  `
})
export class ButtonComponent {
  isPrimary = input(false);
  isLarge = input(false);
  isDisabled = input(false);
}
```

**3. Using classnames Library (Popular):**

```bash
npm install classnames
npm install --save-dev @types/classnames
```

```typescript
// React: classnames library
import classNames from 'classnames';

function Button({ isPrimary, isLarge, isDisabled, className }: Props) {
  return (
    <button 
      className={classNames(
        'btn',
        {
          'btn-primary': isPrimary,
          'btn-secondary': !isPrimary,
          'btn-lg': isLarge,
          'disabled': isDisabled
        },
        className  // Allow additional classes from props
      )}
    >
      Click me
    </button>
  );
}

// Usage
<Button isPrimary isLarge className="my-custom-class" />
```

**4. CSS Modules:**

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.primary {
  background-color: blue;
  color: white;
}

.secondary {
  background-color: gray;
  color: white;
}

.large {
  font-size: 18px;
  padding: 15px 30px;
}
```

```typescript
// React: Import CSS Module
import styles from './Button.module.css';
import classNames from 'classnames';

function Button({ variant, size }: Props) {
  return (
    <button 
      className={classNames(
        styles.button,
        styles[variant],      // styles.primary or styles.secondary
        size === 'large' && styles.large
      )}
    >
      Click me
    </button>
  );
}
```

**Key Takeaways:**
- **React**: `className` prop (not `class`)
- **Angular**: `class` attribute with bindings
- **React**: Use JavaScript for logic (template literals, objects, arrays)
- **Angular**: Use template syntax `[class.name]="condition"`
- **React**: `classnames` library is popular
- **Angular**: Object binding `[class]="{ ... }"` built-in
- **React**: CSS Modules or CSS-in-JS for scoping
- **Angular**: Component styles are scoped by default

[↑ Back to Roadmap](#13-jsx-deep-dive)

---

### 1.14 How do you apply inline styles in JSX?

**Answer:**

React uses the `style` prop with JavaScript objects (not strings). Property names are camelCased.

**1. Basic Inline Styles:**

```typescript
// React: style prop with object
function Box() {
  return (
    <div style={{
      backgroundColor: 'blue',    // camelCase!
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      fontSize: '16px',
      marginTop: '10px'
    }}>
      Box content
    </div>
  );
}
```

```typescript
// Angular: [style] binding or style.property
@Component({
  template: `
    <div [style]="{
      'background-color': 'blue',
      'color': 'white',
      'padding': '20px',
      'border-radius': '8px',
      'font-size': '16px',
      'margin-top': '10px'
    }">
      Box content
    </div>
    
    <!-- Or individual bindings -->
    <div
      [style.background-color]="'blue'"
      [style.color]="'white'"
      [style.padding]="'20px'"
    >
      Box content
    </div>
  `
})
export class BoxComponent {}
```

**2. Dynamic Styles:**

```typescript
// React: Computed styles
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px'
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        backgroundColor: progress > 75 ? 'green' : 'blue',
        borderRadius: '10px',
        transition: 'width 0.3s ease'
      }} />
    </div>
  );
}
```

**3. Style Objects from Variables:**

```typescript
// React: Extract to variables
function Card({ isHighlighted }: { isHighlighted: boolean }) {
  const cardStyles: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: isHighlighted ? '#fffbcc' : 'white',
    boxShadow: isHighlighted ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
  };
  
  return <div style={cardStyles}>Card content</div>;
}
```

**4. Units:**

```typescript
// React: Numbers automatically get 'px'
function Box() {
  return (
    <div style={{
      width: 200,              // Becomes '200px'
      height: '100px',         // String value
      padding: '1rem',         // Any CSS unit
      margin: '10px 20px',     // Multiple values as string
      fontSize: 16,            // Becomes '16px'
      lineHeight: 1.5,         // Unitless (stays as number)
      flex: 1,                 // Unitless properties
      zIndex: 100              // Unitless
    }}>
      Content
    </div>
  );
}
```

**5. CSS Variables (Custom Properties):**

```typescript
// React: Use CSS variables
function ThemedComponent({ primaryColor }: { primaryColor: string }) {
  return (
    <div style={{
      '--primary-color': primaryColor,
      '--secondary-color': '#gray'
    } as React.CSSProperties}>
      <button style={{
        backgroundColor: 'var(--primary-color)',
        color: 'white'
      }}>
        Themed Button
      </button>
    </div>
  );
}
```

**6. Merging Styles:**

```typescript
// React: Merge multiple style objects
interface BoxProps {
  style?: React.CSSProperties;
  isHighlighted?: boolean;
}

function Box({ style, isHighlighted }: BoxProps) {
  const defaultStyles: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #ccc'
  };
  
  const highlightStyles: React.CSSProperties = isHighlighted ? {
    borderColor: 'blue',
    boxShadow: '0 0 10px rgba(0,0,255,0.3)'
  } : {};
  
  // Merge: later properties override earlier ones
  const finalStyles = {
    ...defaultStyles,
    ...highlightStyles,
    ...style  // Allow parent to override
  };
  
  return <div style={finalStyles}>Content</div>;
}

// Usage
<Box 
  style={{ backgroundColor: 'yellow' }}
  isHighlighted
/>
```

**When to Use Inline Styles:**
- ✅ Dynamic values (colors, positions, sizes from props/state)
- ✅ Programmatically calculated styles
- ✅ Animation values
- ✅ CSS variables
- ❌ Static styles (use CSS classes)
- ❌ Pseudo-selectors (:hover, :focus) - use CSS
- ❌ Media queries - use CSS
- ❌ Keyframe animations - use CSS

**Key Differences from Angular:**
- **React**: JavaScript object with camelCase properties
- **Angular**: Object or string with kebab-case properties
- **React**: Numbers automatically get `px` (except unitless props)
- **Angular**: Need to specify units explicitly `[style.width.px]="200"`
- **React**: No direct media query support
- **Angular**: Similar limitations with inline styles

[↑ Back to Roadmap](#13-jsx-deep-dive)

---

**Congratulations!** You've completed Phase 1: Core Fundamentals. You now understand:
- React's philosophy and how it differs from Angular
- Function components and JSX
- Component lifecycle with hooks
- Conditional rendering and lists
- Dynamic classes and inline styles

Next, move on to Phase 2 to learn about state management and data flow!

---

Good luck on your React journey! Remember, your Angular experience gives you a strong foundation in component-based architecture, TypeScript, and web development best practices. React will feel different but familiar.
