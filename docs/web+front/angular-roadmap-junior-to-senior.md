# Angular — Junior to Senior Roadmap (v15–v22)

A learning roadmap of **Angular** concepts, features, and RxJS operators organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the docs.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Version highlights (v15–v22)](#version-highlights-v15v22)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Components and templates](#l1-components-and-templates)
  - [Directives and pipes](#l1-directives-and-pipes)
  - [Dependency injection basics](#l1-dependency-injection-basics)
  - [Routing basics](#l1-routing-basics)
  - [Forms basics](#l1-forms-basics)
  - [HTTP client basics](#l1-http-client-basics)
  - [Essential RxJS operators](#l1-essential-rxjs-operators)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Standalone components](#l2-standalone-components)
  - [Signals](#l2-signals)
  - [Change detection deep dive](#l2-change-detection-deep-dive)
  - [Advanced routing](#l2-advanced-routing)
  - [Reactive forms — advanced](#l2-reactive-forms--advanced)
  - [HTTP interceptors](#l2-http-interceptors)
  - [Lazy loading and code splitting](#l2-lazy-loading-and-code-splitting)
  - [Intermediate RxJS operators](#l2-intermediate-rxjs-operators)
  - [State management](#l2-state-management)
  - [Angular animations](#l2-angular-animations)
- [Level 3 — Senior](#level-3--senior)
  - [Advanced signals and reactivity](#l3-advanced-signals-and-reactivity)
  - [Custom directives and structural directives](#l3-custom-directives-and-structural-directives)
  - [Advanced DI patterns](#l3-advanced-di-patterns)
  - [Performance optimization](#l3-performance-optimization)
  - [Server-Side Rendering (SSR / Angular Universal)](#l3-server-side-rendering-ssr--angular-universal)
  - [Testing — unit and integration](#l3-testing--unit-and-integration)
  - [Advanced RxJS patterns](#l3-advanced-rxjs-patterns)
  - [Nx monorepo and architecture](#l3-nx-monorepo-and-architecture)
  - [Angular CDK and custom libraries](#l3-angular-cdk-and-custom-libraries)
  - [Security best practices](#l3-security-best-practices)
- [Quick reference table](#quick-reference-table)
- [Tasks](#tasks)
- [Answers](#answers)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each section shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Items marked with `*` are most commonly encountered in day-to-day work.
- RxJS operators are covered per level — learn the essential ones first, add advanced ones as needed.
- Version annotations show when a feature was introduced or stabilized (e.g., `[v17+]`).

---

## Version highlights (v15–v22)

| Version | Release | Key additions |
|---|---|---|
| **v15** | Nov 2022 | Standalone APIs stable, directive composition API, `NgOptimizedImage`, stack traces improved |
| **v16** | May 2023 | Signals (developer preview), required inputs, `takeUntilDestroyed`, esbuild builder preview, SSR hydration |
| **v17** | Nov 2023 | Signals stable, new `@if`/`@for`/`@switch` control flow, deferrable views `@defer`, esbuild default, new docs site |
| **v18** | May 2024 | Zoneless change detection (experimental), `@let` template variables, stable SSR hydration, `afterRenderEffect` |
| **v19** | Nov 2024 | Incremental hydration, route-level render mode, `linkedSignal`, resource API preview, HMR for templates & styles |
| **v20** | May 2025 | Signals stable (full), zoneless stable (experimental graduation), `resource()` stable, reactivity model finalized |
| **v21** | Nov 2025 | Partial hydration improvements, signal-based forms preview, enhanced HMR, standalone-first CLI defaults |
| **v22** | May 2026 | Signal-based forms stable, full zoneless support stable, deferred loading improvements, updated SSR APIs |

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single component.

| Term | What it is |
|---|---|
| **Module (`NgModule`)** | A class decorated with `@NgModule` that groups components, directives, pipes, and providers. Still used in legacy codebases; largely replaced by standalone APIs. |
| **Component** | The main building block — a TypeScript class + HTML template + optional CSS. |
| **Template** | HTML markup with Angular-specific syntax (bindings, directives). |
| **Decorator** | A TypeScript annotation (`@Component`, `@Injectable`, etc.) that attaches Angular metadata. |
| **Data binding** | The synchronisation mechanism between a component's class and its template. Four types: interpolation, property, event, two-way. |
| **Directive** | A class that manipulates the DOM. Attribute directives change appearance; structural directives change layout. |
| **Pipe** | A template function that transforms displayed values (`{{ value | date }}`). |
| **Service** | A class that holds shared logic or data, injected via DI. |
| **Dependency Injection (DI)** | Angular's built-in IoC container that creates and delivers service instances. |
| **Router** | The module that maps URL paths to components. |

> **Gotcha:** Angular has two compilation modes — **JIT** (runtime, used in development) and **AOT** (build-time, the default in production). Errors that surface only in production are almost always AOT-incompatible code.

---

### L1 Components and templates

```typescript
// minimal standalone component (v15+)  *
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,        // no NgModule needed
  template: `
    <h1>Hello, {{ name }}!</h1>
    <button (click)="greet()">Greet</button>
  `,
})
export class HelloComponent {
  name = 'World';
  greet() { alert(`Hi, ${this.name}`); }
}
```

**Binding syntax cheat-sheet:**

| Syntax | Direction | Example |
|---|---|---|
| `{{ expr }}` | Class → Template | `{{ title }}` |
| `[property]="expr"` | Class → Template | `[disabled]="isLoading"` |
| `(event)="handler()"` | Template → Class | `(click)="save()"` |
| `[(ngModel)]="prop"` | Two-way | `[(ngModel)]="username"` |

**Input / Output (v16 required inputs):** `*`

```typescript
import { Component, input, output } from '@angular/core'; // signal-based (v17+)

@Component({ selector: 'app-card', standalone: true, template: `...` })
export class CardComponent {
  title  = input.required<string>();   // required signal input [v16+]
  clicked = output<void>();            // signal output [v17+]
}
```

> **Gotcha:** `[(ngModel)]` requires `FormsModule` to be imported. Forgetting it produces a silent no-op — the binding just does nothing.

---

### L1 Directives and pipes

**Built-in structural directives (legacy syntax vs new control flow):**

```html
<!-- Legacy — requires CommonModule -->
<div *ngIf="isVisible">Visible</div>
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
<div [ngSwitch]="color">
  <span *ngSwitchCase="'red'">Red</span>
</div>

<!-- New control flow [v17+] — no imports needed  * -->
@if (isVisible) {
  <div>Visible</div>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items</li>
}

@switch (color) {
  @case ('red') { <span>Red</span> }
  @default      { <span>Other</span> }
}
```

**Built-in attribute directives:**

```html
<div [ngClass]="{ active: isActive, disabled: !enabled }">...</div>
<div [ngStyle]="{ color: textColor, fontSize: '14px' }">...</div>
```

**Built-in pipes:**

```html
{{ price   | currency:'USD' }}
{{ today   | date:'dd/MM/yyyy' }}
{{ user    | json }}
{{ 'hello' | uppercase }}
{{ longText | slice:0:100 }}
{{ obs$    | async }}     <!-- subscribes/unsubscribes automatically  * -->
```

> **Gotcha:** `async` pipe works only in templates, not in TypeScript class code. In the class, subscribe manually or use `toSignal()`.

---

### L1 Dependency injection basics

```typescript
// service  *
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // singleton across the app
export class UserService {
  getUser() { return { id: 1, name: 'Alice' }; }
}

// component consuming the service
@Component({ ... })
export class ProfileComponent {
  private userService = inject(UserService); // preferred modern syntax  *
  user = this.userService.getUser();
}
```

> **Gotcha:** `providedIn: 'root'` creates a lazy singleton — Angular only instantiates it when first injected. Avoid providing stateful services at component level unless you want a new instance per component.

---

### L1 Routing basics

```typescript
// app.routes.ts  *
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '',        component: HomeComponent },
  { path: 'about',  component: AboutComponent },
  { path: '**',     redirectTo: '' },          // wildcard
];

// main.ts bootstrap
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});
```

```html
<!-- template -->
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/about">About</a>
</nav>
<router-outlet />
```

---

### L1 Forms basics

```typescript
// Template-driven (simple forms)
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <form #f="ngForm" (ngSubmit)="submit(f)">
      <input name="email" ngModel required email />
      <button type="submit" [disabled]="f.invalid">Submit</button>
    </form>
  `,
})
export class LoginComponent {
  submit(form: NgForm) { console.log(form.value); }
}
```

```typescript
// Reactive forms (preferred for complex forms)  *
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" />
      <span *ngIf="form.get('email')?.invalid">Invalid email</span>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class LoginReactiveComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  submit() { console.log(this.form.value); }
}
```

---

### L1 HTTP client basics

```typescript
// app config
import { provideHttpClient } from '@angular/common/http';
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
});

// service  *
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);

  getPosts() {
    return this.http.get<Post[]>('/api/posts');  // returns Observable<Post[]>
  }

  createPost(post: Partial<Post>) {
    return this.http.post<Post>('/api/posts', post);
  }
}
```

---

### L1 Essential RxJS operators

These operators cover 80% of daily Angular work.

| Operator | Category | What it does |
|---|---|---|
| `map` | Transform | Transform each emitted value |
| `filter` | Filter | Pass only values matching a predicate |
| `tap` | Utility | Side-effect without altering the stream |
| `catchError` | Error | Recover from an error, return fallback observable |
| `switchMap` | Flattening | Cancel previous inner obs, switch to new one |
| `mergeMap` (flatMap) | Flattening | Run all inner obs concurrently |
| `concatMap` | Flattening | Queue inner obs, run sequentially |
| `take` | Filter | Complete after N emissions |
| `takeUntil` | Filter | Complete when a notifier emits |
| `debounceTime` | Time | Emit after silence period (search input) |
| `distinctUntilChanged` | Filter | Skip consecutive duplicate values |
| `combineLatest` | Combination | Emit when any source emits (needs all to emit once) |
| `forkJoin` | Combination | Wait for all sources to complete, emit last values |
| `of` | Creation | Create observable from static values |
| `from` | Creation | Create observable from array / promise |
| `EMPTY` | Creation | Observable that completes immediately |

```typescript
// typical search with debounce  *
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term)),
  catchError(() => of([])),
).subscribe(results => this.results = results);
```

> **Gotcha:** `switchMap` cancels the previous HTTP request on each keystroke. Use `mergeMap` if you need all requests to complete (e.g., parallel saves), or `concatMap` for strict ordering.

---

## Level 2 — Mid-level

### L2 Standalone components

Standalone components were stabilized in **v15** and are now the recommended default.

```typescript
// standalone component with explicit imports  *
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,          // or individual directives/pipes
    RouterModule,
    UserCardComponent,     // import other standalone components directly
    CurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
```

```typescript
// migrate an NgModule-based app incrementally
// Mark the component standalone, add necessary imports, remove from NgModule declarations
```

> **Gotcha:** In standalone mode you must import every directive and pipe used in the template explicitly. The `CommonModule` shortcut works but pulls in everything — import individual items (`NgIf`, `NgFor`, `AsyncPipe`) for better tree-shaking.

---

### L2 Signals

Signals are a **synchronous reactive primitive** introduced in preview in v16, stabilized in v17, and are the foundation of Angular's new reactivity model.

```typescript
import { signal, computed, effect } from '@angular/core';

// writable signal  *
const count = signal(0);
count.set(1);
count.update(v => v + 1);

// derived value — auto-recomputes when dependencies change  *
const doubled = computed(() => count() * 2);

// side-effect that re-runs when signals it reads change
const cleanup = effect(() => {
  console.log('count is', count());
});
```

**Signal inputs / outputs (v17+):**

```typescript
@Component({ ... })
export class ButtonComponent {
  label   = input<string>('Click me');       // optional with default
  disabled = input.required<boolean>();      // required [v16+]
  clicked  = output<MouseEvent>();
}
```

**`toSignal` and `toObservable` bridges:**

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// observable → signal  *
const posts = toSignal(this.postService.getPosts(), { initialValue: [] });

// signal → observable
const count$ = toObservable(count);
```

**`takeUntilDestroyed` [v16+]:** `*`

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ ... })
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef),  // auto-unsubscribes on destroy
    ).subscribe(console.log);
  }
}
```

**`linkedSignal` [v19+]:**

```typescript
import { linkedSignal } from '@angular/core';

const selectedId = signal(1);
// resets when selectedId changes
const editMode = linkedSignal(() => selectedId() !== null && false);
```

**`resource()` [v20+]:**

```typescript
import { resource } from '@angular/core';

const postResource = resource({
  request: () => ({ id: selectedId() }),
  loader: ({ request }) => fetch(`/api/posts/${request.id}`).then(r => r.json()),
});

// postResource.value()   — the loaded data (signal)
// postResource.isLoading() — loading state (signal)
// postResource.error()   — error (signal)
```

> **Gotcha:** Signals are **pull-based** — reading a signal inside `effect()` or `computed()` creates a dependency. Calling a signal outside of a reactive context (e.g., inside a `setTimeout`) reads the value but creates no subscription.

---

### L2 Change detection deep dive

| Strategy | Behavior |
|---|---|
| `Default` | Checks entire component tree on every event/timer/XHR |
| `OnPush` | Checks only when: input reference changes, event originates from the component, `markForCheck()` is called, or an async pipe emits |

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // *
  ...
})
export class ListComponent {
  private cdr = inject(ChangeDetectorRef);

  forceUpdate() {
    this.cdr.markForCheck();     // mark this branch for next CD cycle
    // this.cdr.detectChanges(); // immediate synchronous check (use sparingly)
  }
}
```

**Zoneless change detection [v18 experimental, v20+ stable]:**

```typescript
// main.ts — opt-in to zoneless
bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()],  // [v18]
});
```

Without Zone.js, Angular only updates the UI when signals change or `markForCheck()` is called explicitly — enabling massive performance wins and Angular running in environments without zone.js (Web Workers, React Native, etc.).

---

### L2 Advanced routing

```typescript
// lazy loading with standalone components  *
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then(m => m.shopRoutes),
  },
];

// route guards (functional style — v15+)  *
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

// resolvers (functional style)
export const postResolver: ResolveFn<Post> = (route) => {
  return inject(PostService).getById(Number(route.paramMap.get('id')));
};

// route definition
{
  path: 'posts/:id',
  component: PostDetailComponent,
  canActivate: [authGuard],
  resolve: { post: postResolver },
}
```

**Reading route data:**

```typescript
@Component({ ... })
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  post = this.route.snapshot.data['post'] as Post;
  // or reactively:
  id$ = this.route.paramMap.pipe(map(p => p.get('id')));
}
```

---

### L2 Reactive forms — advanced

```typescript
// FormArray  *
this.form = this.fb.group({
  title: ['', Validators.required],
  tags:  this.fb.array([]),         // dynamic list
});

get tags() { return this.form.get('tags') as FormArray; }

addTag() {
  this.tags.push(this.fb.control('', Validators.required));
}

// Custom validator
function noWhitespace(control: AbstractControl): ValidationErrors | null {
  return (control.value || '').trim() === ''
    ? { whitespace: true }
    : null;
}

// Cross-field validator (group-level)
function passwordMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value
    ? null
    : { mismatch: true };
}

// Async validator
function uniqueEmail(service: UserService): AsyncValidatorFn {
  return (control) =>
    service.checkEmail(control.value).pipe(
      map(taken => (taken ? { emailTaken: true } : null)),
      catchError(() => of(null)),
    );
}
```

---

### L2 HTTP interceptors

```typescript
// functional interceptor (v15+)  *
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(authReq);
};

// retry interceptor
export const retryInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(retry({ count: 3, delay: 1000 }));

// register
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, retryInterceptor])),
  ],
});
```

---

### L2 Lazy loading and code splitting

```typescript
// route-level lazy loading  *
{ path: 'dashboard', loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) }

// deferrable views [v17+]  *
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <div>Loading chart…</div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Failed to load.</p>
}

// defer triggers
@defer (on idle)         { ... }   // when browser is idle
@defer (on interaction)  { ... }   // on first user interaction
@defer (on timer(2s))    { ... }   // after 2 seconds
@defer (when condition)  { ... }   // when expression is truthy
@defer (prefetch on idle) { ... }  // prefetch JS, render later
```

---

### L2 Intermediate RxJS operators

| Operator | What it does |
|---|---|
| `exhaustMap` | Ignore new emissions while inner observable is active (e.g., prevent double-submit) |
| `shareReplay(1)` | Multicast and replay last N values to late subscribers |
| `startWith` | Prepend a value to a stream |
| `scan` | Like `reduce` but emits intermediate accumulated values |
| `withLatestFrom` | Combine with latest value from another observable without subscribing to it |
| `zip` | Pair emissions by index from multiple sources |
| `pairwise` | Emit `[prev, curr]` pairs |
| `buffer` / `bufferTime` | Collect emissions into arrays |
| `throttleTime` | Emit once per time window (leading edge) |
| `retry` / `retryWhen` | Re-subscribe on error |
| `expand` | Recursive flattening (tree traversal, pagination) |
| `iif` | Choose between two observables based on a condition |

```typescript
// exhaustMap for form submit  *
this.submitBtn.clicks$.pipe(
  exhaustMap(() => this.api.save(this.form.value)),
).subscribe();

// shareReplay for shared HTTP call  *
private user$ = this.http.get<User>('/api/me').pipe(shareReplay(1));
```

---

### L2 State management

| Approach | Best for |
|---|---|
| **Component signals** | Local UI state |
| **Service + signals** | Shared state across components (simple apps) |
| **NgRx Store** | Large apps, complex state, time-travel debugging |
| **NgRx ComponentStore** | Feature-level state, complex component subtrees |
| **Akita / Elf** | Lighter alternatives to NgRx |

```typescript
// lightweight signal store pattern  *
@Injectable({ providedIn: 'root' })
export class CartStore {
  private _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price, 0));

  add(item: CartItem)    { this._items.update(list => [...list, item]); }
  remove(id: string)     { this._items.update(list => list.filter(i => i.id !== id)); }
}
```

---

### L2 Angular animations

```typescript
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in')]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  template: `<div @fade *ngIf="show">Hello</div>`,
})
export class FadeComponent { show = true; }
```

---

## Level 3 — Senior

### L3 Advanced signals and reactivity

**`afterRenderEffect` [v18+]:**

```typescript
import { afterRenderEffect } from '@angular/core';

@Component({ ... })
export class ChartComponent {
  // runs after every render cycle where signals it reads have changed
  constructor() {
    afterRenderEffect(() => {
      const data = this.chartData();
      this.chart.render(data);           // DOM access is safe here
    });
  }
}
```

**Signal-based forms [v21 preview, v22 stable]:**

```typescript
import { FormField, signalForm } from '@angular/forms'; // approximate API

const loginForm = signalForm({
  email:    new FormField('', [Validators.required, Validators.email]),
  password: new FormField('', Validators.required),
});

// loginForm.email.value()    — signal
// loginForm.email.valid()    — signal
// loginForm.valid()          — computed
```

**Reactive contexts and `untracked`:**

```typescript
import { untracked } from '@angular/core';

effect(() => {
  const id = selectedId();          // tracked dependency
  const token = untracked(() => this.auth.token()); // read without tracking
  this.load(id, token);
});
```

---

### L3 Custom directives and structural directives

```typescript
// attribute directive  *
import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  color = input<string>('yellow');
  private el = inject(ElementRef);

  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.backgroundColor = this.color();
  }
  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}

// structural directive (custom *appRepeat)
@Directive({ selector: '[appRepeat]', standalone: true })
export class RepeatDirective {
  private vcr = inject(ViewContainerRef);
  private tmpl = inject(TemplateRef);

  set appRepeat(count: number) {
    this.vcr.clear();
    for (let i = 0; i < count; i++) {
      this.vcr.createEmbeddedView(this.tmpl, { $implicit: i });
    }
  }
}
// usage: <li *appRepeat="5; let i">Item {{ i }}</li>
```

**Directive composition API [v15+]:**

```typescript
@Component({
  hostDirectives: [
    { directive: CdkDrag, inputs: ['cdkDragDisabled: disabled'] },
    HighlightDirective,
  ],
})
export class DraggableCardComponent {}
```

---

### L3 Advanced DI patterns

```typescript
// injection tokens  *
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

bootstrapApplication(AppComponent, {
  providers: [{ provide: API_URL, useValue: 'https://api.example.com' }],
});

// multi providers
export const VALIDATORS = new InjectionToken<ValidatorFn[]>('VALIDATORS');
providers: [
  { provide: VALIDATORS, useValue: emailValidator, multi: true },
  { provide: VALIDATORS, useValue: uniqueValidator, multi: true },
]

// factory provider with dependencies
{ provide: LoggerService, useFactory: (env: Environment) =>
    env.production ? new NoopLogger() : new ConsoleLogger(),
  deps: [Environment] }

// hierarchical DI — component-level scope
@Component({
  providers: [{ provide: CacheService, useClass: LocalCacheService }],
})
export class FeatureComponent {}
```

---

### L3 Performance optimization

**`NgOptimizedImage` [v15+]:** `*`

```html
<img ngSrc="hero.jpg" width="800" height="400" priority />
<!-- Adds fetchpriority, lazy loading, intrinsic sizing, and preconnect hints automatically -->
```

**TrackBy in `@for` / `ngFor`:** `*`

```html
@for (item of items; track item.id) { ... }  <!-- v17+ new syntax -->
<li *ngFor="let item of items; trackBy: byId">...</li>
```

**Virtual scrolling (CDK):**

```html
<cdk-virtual-scroll-viewport itemSize="50" style="height:400px">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

**`@defer` for heavy components [v17+]:** Already covered in L2.

**Profile with Angular DevTools:**
- Component tree inspection
- Change detection profiling
- Signal dependency graph view (v17+)

**Bundle optimization:**
- Use `loadComponent` / `loadChildren` for every route
- Avoid barrel files (`index.ts`) that prevent tree-shaking
- Use `esbuild` builder (default v17+) — 2–10× faster builds than `webpack`

---

### L3 Server-Side Rendering (SSR / Angular Universal)

```bash
# add SSR to existing app
ng add @angular/ssr
```

```typescript
// render modes per route [v19+]  *
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '',          renderMode: RenderMode.Prerender },  // SSG
  { path: 'dashboard', renderMode: RenderMode.Server },     // SSR per request
  { path: 'settings',  renderMode: RenderMode.Client },     // CSR (skip SSR)
];
```

**Hydration [v16+ stable]:**

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()],
});
```

**Incremental hydration [v19+]:**

```html
@defer (hydrate on viewport) {
  <app-comments />   <!-- hydrated only when scrolled into view -->
}
```

**Transfer state (avoid double HTTP calls):**

```typescript
import { TransferState, makeStateKey } from '@angular/core';

const POSTS_KEY = makeStateKey<Post[]>('posts');

// on server: store
this.transferState.set(POSTS_KEY, posts);

// on client: read
const cached = this.transferState.get(POSTS_KEY, []);
```

> **Gotcha:** Never access `window`, `document`, or `localStorage` directly in SSR-compatible code. Use `isPlatformBrowser()` or the `PLATFORM_ID` token to guard browser-only APIs.

---

### L3 Testing — unit and integration

```typescript
// component test with TestBed  *
import { TestBed } from '@angular/core/testing';

describe('CounterComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CounterComponent],           // standalone
  }));

  it('should increment', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span').textContent).toBe('1');
  });
});

// service test with HttpClientTestingModule
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PostService', () => {
  let service: PostService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PostService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());   // ensure no outstanding requests

  it('should fetch posts', () => {
    service.getPosts().subscribe(posts => expect(posts.length).toBe(2));
    http.expectOne('/api/posts').flush([{ id: 1 }, { id: 2 }]);
  });
});
```

**Testing signals:**

```typescript
it('should compute doubled value', () => {
  const count = signal(3);
  const doubled = computed(() => count() * 2);
  expect(doubled()).toBe(6);
  count.set(5);
  expect(doubled()).toBe(10);
});
```

---

### L3 Advanced RxJS patterns

| Pattern | Operators / technique |
|---|---|
| **Polling with back-off** | `timer(0, 5000)` + `switchMap` + `retryWhen` + `delayWhen` |
| **Optimistic UI** | `switchMap` → update local state first, revert on error |
| **Request deduplication** | `shareReplay(1)` + `take(1)` |
| **WebSocket stream** | `webSocket()` from `rxjs/webSocket` + `retry` |
| **Pagination cursor** | `expand` + `takeWhile` |
| **Race condition prevention** | `switchMap` (cancel) or `exhaustMap` (ignore) |

```typescript
// polling every 10s  *
const poll$ = timer(0, 10_000).pipe(
  switchMap(() => this.api.getStatus()),
  retry({ count: 5, delay: 2000 }),
  shareReplay(1),
);

// WebSocket
import { webSocket } from 'rxjs/webSocket';

const socket$ = webSocket('wss://api.example.com/ws');
socket$.pipe(
  retry({ delay: 3000 }),
  takeUntilDestroyed(this.destroyRef),
).subscribe(msg => this.handleMessage(msg));
```

**Custom operator:**

```typescript
function retryWithDelay<T>(retries: number, delayMs: number) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      retry({ count: retries, delay: delayMs }),
    );
}

this.api.fetch().pipe(retryWithDelay(3, 1000)).subscribe();
```

---

### L3 Nx monorepo and architecture

```bash
# create workspace
npx create-nx-workspace@latest my-org --preset=angular-monorepo

# generate app and lib
nx g @nx/angular:app admin-portal
nx g @nx/angular:lib shared/ui --buildable

# affected commands — only rebuild/test what changed
nx affected --target=build
nx affected --target=test
```

**Recommended library types:**

| Type | Contents | `importProjects` |
|---|---|---|
| `feature` | Smart components, pages | `ui`, `data-access`, `util` |
| `ui` | Dumb/presentational components | `util` |
| `data-access` | Services, stores, API calls | `util` |
| `util` | Pure functions, constants, models | — |

---

### L3 Angular CDK and custom libraries

```typescript
// Overlay (tooltip, modal)
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

const overlayRef: OverlayRef = this.overlay.create({
  positionStrategy: this.overlay.position()
    .flexibleConnectedTo(origin)
    .withPositions([{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }]),
});
const portal = new ComponentPortal(TooltipComponent);
overlayRef.attach(portal);

// Focus trap
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
this.focusTrap = this.focusTrapFactory.create(this.el.nativeElement);
this.focusTrap.focusInitialElement();

// DragDrop
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.items, event.previousIndex, event.currentIndex);
}
```

**Build a publishable library:**

```bash
nx g @nx/angular:lib ui-kit --publishable --importPath=@my-org/ui-kit
nx build ui-kit
cd dist/ui-kit && npm publish
```

---

### L3 Security best practices

| Threat | Angular's protection | What you must do |
|---|---|---|
| **XSS** | Auto-escapes all interpolations | Never use `bypassSecurityTrustHtml` without server sanitization |
| **CSRF** | No built-in — use `HttpClientXsrfModule` | `imports: [HttpClientXsrfModule.withOptions({ cookieName: 'XSRF-TOKEN' })]` |
| **Injection** | DI prevents direct instantiation of untrusted classes | Keep providers explicit, avoid dynamic `require()` |
| **Route access** | `canActivate` guards | Always guard protected routes; validate on server too |
| **Sensitive data in state** | Nothing automatic | Never store tokens in signals/store that serialise to localStorage |

```typescript
// safe HTML — only when absolutely necessary  *
import { DomSanitizer } from '@angular/platform-browser';

const safe = this.sanitizer.bypassSecurityTrustHtml(htmlFromServer);
// <div [innerHTML]="safe"></div>
// ALWAYS sanitize htmlFromServer on the server before sending it
```

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Component model** | `@Component`, inputs/outputs, template binding | Standalone, signal inputs/outputs, `OnPush` | Directive composition, `afterRenderEffect`, signal forms |
| **Reactivity** | Observables, `async` pipe, `subscribe` | Signals, `toSignal`, `takeUntilDestroyed` | `resource()`, `linkedSignal`, zoneless, custom operators |
| **Routing** | `RouterModule`, `routerLink`, `router-outlet` | Lazy `loadComponent`/`loadChildren`, functional guards, resolvers | Route-level render modes, SSR strategies |
| **Forms** | Template-driven, basic reactive | FormArray, custom validators, async validators | Signal-based forms, dynamic form builders |
| **HTTP** | `HttpClient`, `get`/`post` | Functional interceptors, retry logic | Transfer state, request deduplication patterns |
| **RxJS** | `map`, `filter`, `switchMap`, `debounceTime` | `exhaustMap`, `shareReplay`, `scan`, `withLatestFrom` | Custom operators, WebSocket, polling, `expand` |
| **State** | Service with `BehaviorSubject` | Signal store, NgRx ComponentStore | NgRx Store, effects, selectors, entity patterns |
| **Performance** | `trackBy`, `OnPush` | `@defer`, `NgOptimizedImage`, virtual scroll | Bundle analysis, zoneless, `esbuild`, CDK virtualization |
| **SSR** | Awareness of SSR concept | `provideClientHydration`, `isPlatformBrowser` | Incremental hydration, render modes, Transfer State |
| **Testing** | Basic `TestBed`, `fixture.detectChanges` | `HttpTestingController`, spies, signal testing | E2E patterns, test harnesses, CDK testing utilities |
| **Architecture** | Single-app NgModule or standalone | Feature modules / libs pattern | Nx monorepo, publishable libs, module boundaries |
| **Versions** | v15 standalone | v16–v17 signals, control flow, `@defer` | v18–v22 zoneless, incremental hydration, signal forms |

---

## Tasks

### Junior tasks

**J1.** Create a standalone `TemperatureComponent` that:
- Accepts a `celsius` signal input (required, `number`)
- Displays both Celsius and Fahrenheit values in the template
- Fahrenheit is computed inside the template using a method

**J2.** Create a `CounterComponent` with:
- An internal `count` signal starting at 0
- Buttons to increment, decrement, and reset
- The reset button is disabled when `count` is already 0

**J3.** Write a `SearchComponent` that:
- Has a text input bound to a `FormControl`
- Calls a `UserService.search(term)` method (returns `Observable<string[]>`)
- Uses `debounceTime(400)` and `distinctUntilChanged` before calling the service
- Cancels the in-flight request on each new keystroke
- Shows a loading indicator while the request is in-flight
- Shows `"No results"` when the array is empty

**J4.** Explain the difference between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`. Give a real-world Angular use case for each.

**J5.** Add a route guard that redirects unauthenticated users from `/profile` to `/login`. The guard must be written as a functional `CanActivateFn`.

---

### Mid-level tasks

**M1.** Convert a `BehaviorSubject`-based service into a **signal store** that exposes:
- `items` — readonly signal
- `loading` — readonly signal
- `error` — readonly signal
- `load()` — triggers an HTTP call, updates all three signals

**M2.** Implement an HTTP interceptor that:
- Attaches a `Bearer` token to every request
- On 401 response, calls `AuthService.refresh()` and retries the original request exactly once
- On a second 401, navigates to `/login`

**M3.** Create a `@defer`-based product page where:
- The main product info loads immediately
- The reviews section loads when it enters the viewport
- A spinner is shown during the 500 ms minimum loading window
- An error state shows a "Retry" button (hint: use a template variable)

**M4.** Implement a reactive `FormArray` for a dynamic list of email addresses with:
- Add / remove controls
- Each control validated for email format
- "Submit" button disabled while any control is invalid
- Display of per-item errors

**M5.** Implement a `shareReplay`-based caching strategy for a `UserService.getCurrentUser()` call so that it executes the HTTP request only once no matter how many components inject and subscribe to the result.

---

### Senior tasks

**S1.** Design and implement a **signal-based feature store** for a shopping cart that:
- Uses `signal`, `computed`, and `effect`
- Persists to `localStorage` via an `effect` (with a `isPlatformBrowser` guard for SSR safety)
- Exposes a `resource()` for syncing with the server
- Handles optimistic add/remove with rollback on server error

**S2.** Write a **custom RxJS operator** `retryWithExponentialBackoff(maxRetries, baseDelayMs)` that doubles the delay on each retry. Use it in a service that polls a status endpoint.

**S3.** Set up **incremental hydration** for an e-commerce app:
- Home page: prerendered (SSG)
- Product detail: server-rendered (SSR)
- Cart: client-only (CSR)
- Heavy recommendation widget: hydrates on idle
Describe the file changes needed in `app.routes.ts` and `server.routes.ts`.

**S4.** Implement a **zoneless** Angular app (`v18+`):
- Remove Zone.js from `polyfills`
- Enable `provideExperimentalZonelessChangeDetection()`
- Identify two patterns in your components that would break and explain how to fix each

**S5.** Create a **structural directive** `*appPermission="'admin'"` that:
- Renders its content only when the current user has the given permission
- Accepts an optional `else` template reference
- Uses `inject(PermissionService)` internally
- Is SSR-compatible

---

## Answers

### J1 — TemperatureComponent

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-temperature',
  standalone: true,
  template: `
    <p>Celsius: {{ celsius() }}°C</p>
    <p>Fahrenheit: {{ fahrenheit() }}°F</p>
  `,
})
export class TemperatureComponent {
  celsius   = input.required<number>();
  fahrenheit = computed(() => this.celsius() * 9 / 5 + 32);
}
```

---

### J2 — CounterComponent

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">−</button>
    <button (click)="reset()" [disabled]="count() === 0">Reset</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  increment() { this.count.update(v => v + 1); }
  decrement() { this.count.update(v => v - 1); }
  reset()     { this.count.set(0); }
}
```

---

### J3 — SearchComponent

```typescript
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map, catchError, of } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgIf, NgFor],
  template: `
    <input [formControl]="searchCtrl" placeholder="Search…" />
    @if (state$ | async; as state) {
      @if (state.loading) { <p>Loading…</p> }
      @else if (state.results.length === 0) { <p>No results</p> }
      @else {
        <ul>
          @for (r of state.results; track r) { <li>{{ r }}</li> }
        </ul>
      }
    }
  `,
})
export class SearchComponent {
  private userService = inject(UserService);
  searchCtrl = new FormControl('');

  state$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(term =>
      this.userService.search(term ?? '').pipe(
        map(results => ({ loading: false, results })),
        startWith({ loading: true, results: [] as string[] }),
        catchError(() => of({ loading: false, results: [] as string[] })),
      )
    ),
  );
}
```

---

### J4 — switchMap vs mergeMap vs concatMap vs exhaustMap

| Operator | Strategy | Angular use case |
|---|---|---|
| `switchMap` | Cancel previous, start new | Live search — discard stale results when user types again |
| `mergeMap` | Run all concurrently | Upload multiple files in parallel |
| `concatMap` | Queue, run one at a time | Send analytics events in order without losing any |
| `exhaustMap` | Ignore new while current is active | Prevent double-submit on a Save button |

Key decision rule: **Are race conditions a problem?**
- Yes, only care about latest → `switchMap`
- Yes, can't overlap at all → `exhaustMap`
- No, need all results → `mergeMap` (parallel) or `concatMap` (ordered)

---

### J5 — Auth guard

```typescript
// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};

// app.routes.ts
{ path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
```

---

### M1 — Signal store

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemStore {
  private http = inject(HttpClient);

  private _items   = signal<Item[]>([]);
  private _loading = signal(false);
  private _error   = signal<string | null>(null);

  readonly items   = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();
  readonly count   = computed(() => this._items().length);

  load() {
    this._loading.set(true);
    this._error.set(null);
    this.http.get<Item[]>('/api/items').subscribe({
      next:  items => { this._items.set(items); this._loading.set(false); },
      error: err   => { this._error.set(err.message); this._loading.set(false); },
    });
  }
}
```

---

### M2 — 401 retry interceptor

```typescript
import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const withToken = (token: string) =>
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(withToken(auth.getToken())).pipe(
    catchError(err => {
      if (err.status !== HttpStatusCode.Unauthorized) return throwError(() => err);
      return auth.refresh().pipe(
        switchMap(newToken => next(withToken(newToken))),
        catchError(() => {
          router.navigate(['/login']);
          return throwError(() => err);
        }),
      );
    }),
  );
};
```

---

### M3 — Defer product page

```html
<!-- product-detail.component.html -->
<section>
  <h1>{{ product().name }}</h1>
  <p>{{ product().description }}</p>
</section>

@defer (on viewport; prefetch on idle) {
  <app-reviews [productId]="product().id" />
} @placeholder {
  <div class="reviews-placeholder">Reviews load when visible</div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Failed to load reviews. <button (click)="$event">Retry</button></p>
}
```

> For the "Retry" button in `@error`, Angular v17 does not expose a built-in retry trigger. The idiomatic approach is to wrap the component in a parent that toggles a boolean flag with `@if`, destroying and recreating the `@defer` block.

---

### M4 — FormArray with email validation

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div formArrayName="emails">
        @for (ctrl of emails.controls; track $index; let i = $index) {
          <div>
            <input [formControlName]="i" placeholder="Email" />
            @if (ctrl.invalid && ctrl.touched) {
              <span>Invalid email</span>
            }
            <button type="button" (click)="remove(i)">Remove</button>
          </div>
        }
      </div>
      <button type="button" (click)="add()">Add Email</button>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
})
export class EmailListComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({ emails: this.fb.array([this.newEmail()]) });

  get emails() { return this.form.get('emails') as FormArray; }

  private newEmail() { return this.fb.control('', [Validators.required, Validators.email]); }

  add()          { this.emails.push(this.newEmail()); }
  remove(i: number) { this.emails.removeAt(i); }
  submit()       { console.log(this.form.value); }
}
```

---

### M5 — Cached getCurrentUser

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // Executed once; all subscribers share the same HTTP call and get the cached response
  readonly currentUser$: Observable<User> = this.http
    .get<User>('/api/me')
    .pipe(shareReplay(1));
}

// Any number of components can inject UserService and subscribe to currentUser$
// The HTTP request fires only once.
```

> **Gotcha:** `shareReplay(1)` without `refCount: true` keeps the inner subscription alive even after all consumers unsubscribe. For a user profile that lives for the entire session this is intentional. For finite streams, use `shareReplay({ bufferSize: 1, refCount: true })`.

---

### S1 — Signal-based cart store with resource

```typescript
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private http        = inject(HttpClient);
  private platformId  = inject(PLATFORM_ID);

  private _items = signal<CartItem[]>(this.loadFromStorage());
  readonly items  = this._items.asReadonly();
  readonly total  = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0));

  // Persist to localStorage (browser only)
  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(this._items()));
      }
    });
  }

  // Server sync via resource
  readonly serverCart = resource({
    loader: () => firstValueFrom(this.http.get<CartItem[]>('/api/cart')),
  });

  add(item: CartItem) {
    const prev = this._items();
    this._items.update(list => [...list, item]);  // optimistic
    this.http.post('/api/cart', item).subscribe({
      error: () => this._items.set(prev),         // rollback
    });
  }

  remove(id: string) {
    const prev = this._items();
    this._items.update(list => list.filter(i => i.id !== id));  // optimistic
    this.http.delete(`/api/cart/${id}`).subscribe({
      error: () => this._items.set(prev),         // rollback
    });
  }

  private loadFromStorage(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try { return JSON.parse(localStorage.getItem('cart') ?? '[]'); }
    catch { return []; }
  }
}
```

---

### S2 — retryWithExponentialBackoff operator

```typescript
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export function retryWithExponentialBackoff<T>(maxRetries: number, baseDelayMs: number) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((err, attempt) => {
            if (attempt >= maxRetries) return throwError(() => err);
            const delayMs = baseDelayMs * 2 ** attempt;
            console.warn(`Retry ${attempt + 1}/${maxRetries} in ${delayMs}ms`);
            return timer(delayMs);
          }),
        )
      ),
    );
}

// Usage
this.http.get('/api/status').pipe(
  retryWithExponentialBackoff(4, 500),  // 500 → 1000 → 2000 → 4000 ms
).subscribe(status => this.status = status);
```

---

### S3 — Incremental hydration setup

**`app.routes.ts`:**

```typescript
export const routes: Routes = [
  { path: '',         component: HomeComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart',     component: CartComponent },
];
```

**`server.routes.ts`:**

```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '',             renderMode: RenderMode.Prerender },   // SSG
  { path: 'products/:id', renderMode: RenderMode.Server },      // SSR on demand
  { path: 'cart',         renderMode: RenderMode.Client },      // no SSR
  { path: '**',           renderMode: RenderMode.Server },      // fallback
];
```

**Template — lazy hydration for recommendations:**

```html
@defer (hydrate on idle) {
  <app-recommendations [productId]="id()" />
} @placeholder {
  <div class="rec-skeleton"></div>
}
```

**`app.config.server.ts`:**

```typescript
import { provideServerRendering } from '@angular/ssr';

export const config: ApplicationConfig = {
  providers: [provideServerRendering({ routes: serverRoutes })],
};
```

---

### S4 — Zoneless Angular

**Step 1 — remove Zone.js:**

```typescript
// angular.json — remove from polyfills array
// "polyfills": ["zone.js"]  ← delete this line
```

**Step 2 — enable zoneless:**

```typescript
// app.config.ts
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection()],
};
```

**Breaking patterns and fixes:**

| Breaking pattern | Why it breaks | Fix |
|---|---|---|
| `setTimeout(() => { this.data = result; })` | No zone to trigger CD after the callback | Use `signal`: `this.data.set(result)` or call `this.cdr.markForCheck()` |
| `EventEmitter` from a non-Angular event source (e.g., a 3rd-party lib) | Zone.js no longer patches these events | Wrap the callback: `NgZone.run()` or migrate to signal output |

---

### S5 — *appPermission structural directive

```typescript
import {
  Directive, TemplateRef, ViewContainerRef, input, effect, inject,
} from '@angular/core';
import { PermissionService } from './permission.service';

@Directive({ selector: '[appPermission]', standalone: true })
export class PermissionDirective {
  appPermission     = input.required<string>();
  appPermissionElse = input<TemplateRef<unknown> | null>(null);

  private vcr         = inject(ViewContainerRef);
  private tmpl        = inject(TemplateRef);
  private permissions = inject(PermissionService);

  constructor() {
    effect(() => {
      this.vcr.clear();
      const hasPermission = this.permissions.has(this.appPermission());
      const template = hasPermission ? this.tmpl : this.appPermissionElse();
      if (template) this.vcr.createEmbeddedView(template);
    });
  }
}

// usage
@Component({
  imports: [PermissionDirective],
  template: `
    <ng-template #noAccess><p>Access denied</p></ng-template>
    <button *appPermission="'admin'; else noAccess">Delete</button>
  `,
})
export class AdminPanelComponent {}
```

> **SSR note:** `PermissionService.has()` should read from a signal or synchronous store to be SSR-compatible. Avoid reading from `localStorage` directly — use Transfer State to hydrate permissions from the server response.
