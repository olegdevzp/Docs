## Questions for Angular Middle Developer

### Quick links

1. [Explain Angular change detection and when to use `OnPush`.](#1-explain-angular-change-detection-and-when-to-use-onpush)
2. [What is Zone.js and how does zone-less Angular work?](#2-what-is-zonejs-and-how-does-zone-less-angular-work)
3. [Compare `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` with real use cases.](#3-compare-switchmap-mergemap-concatmap-and-exhaustmap-with-real-use-cases)
4. [Cold vs hot observables; how to multicast with `shareReplay` safely?](#4-cold-vs-hot-observables-how-to-multicast-with-sharereplay-safely)
5. [Preventing RxJS memory leaks in components/services.](#5-preventing-rxjs-memory-leaks-in-componentsservices)
6. [Signals vs Observables: when to use each?](#6-signals-vs-observables-when-to-use-each)
7. [Standalone components vs NgModules; provider scoping differences.](#7-standalone-components-vs-ngmodules-provider-scoping-differences)
8. [Dependency Injection tokens (`InjectionToken`), multi providers, and injector hierarchy.](#8-dependency-injection-tokens-injectiontoken-multi-providers-and-injector-hierarchy)
9. [`providedIn: root` vs `any` vs `platform`; duplication in lazy modules.](#9-providedin-root-vs-any-vs-platform-duplication-in-lazy-modules)
10. [Routing with standalone APIs; `CanMatch` vs `CanLoad` vs `CanActivate`.](#10-routing-with-standalone-apis-canmatch-vs-canload-vs-canactivate)
11. [Preloading strategies and implementing a custom preloader.](#11-preloading-strategies-and-implementing-a-custom-preloader)
12. [Implementing `ControlValueAccessor` for reusable form controls.](#12-implementing-controlvalueaccessor-for-reusable-form-controls)
13. [Reactive Forms: sync vs async validators; performance tips.](#13-reactive-forms-sync-vs-async-validators-performance-tips)
14. [List rendering performance: `trackBy`, `@for`, and virtualization.](#14-list-rendering-performance-trackby-for-and-virtualization)
15. [`*ngIf` vs `[hidden]`; `ng-template`, `ng-container`, and `@if`.](#15-ngif-vs-hidden-ng-template-ng-container-and-if)
16. [Content projection (single/multi-slot) and `ng-content select`.](#16-content-projection-singlemulti-slot-and-ng-content-select)
17. [Immutable patterns with `OnPush`; `markForCheck` vs `detectChanges`.](#17-immutable-patterns-with-onpush-markforcheck-vs-detectchanges)
18. [HTTP interceptors: auth, retry/backoff, error handling, cancelation.](#18-http-interceptors-auth-retrybackoff-error-handling-cancelation)
19. [Global error handling with `ErrorHandler` and router errors.](#19-global-error-handling-with-errorhandler-and-router-errors)
20. [i18n with `$localize` and ICU; runtime vs build-time.](#20-i18n-with-localize-and-icu-runtime-vs-build-time)
21. [Testing standalone components; `TestBed`, `fakeAsync`, and Http testing.](#21-testing-standalone-components-testbed-fakeasync-and-http-testing)
22. [Build optimization: budgets, source maps, and strict TypeScript.](#22-build-optimization-budgets-source-maps-and-strict-typescript)
23. [SSR and hydration with Angular Universal; `TransferState`.](#23-ssr-and-hydration-with-angular-universal-transferstate)
24. [PWA with Angular Service Worker: caching strategies and updates.](#24-pwa-with-angular-service-worker-caching-strategies-and-updates)
25. [NgRx/ComponentStore vs service-with-RxJS vs Signals Store.](#25-ngrxcomponentstore-vs-service-with-rxjs-vs-signals-store)
26. [View queries vs content queries; `@ViewChild` options.](#26-view-queries-vs-content-queries-viewchild-options)
27. [Angular 17 control flow: `@if`, `@for`, `@defer` vs structural directives.](#27-angular-17-control-flow-if-for-defer-vs-structural-directives)
28. [Accessibility: CDK a11y utilities (`FocusMonitor`, `LiveAnnouncer`).](#28-accessibility-cdk-a11y-utilities-focusmonitor-liveannouncer)
29. [CDK Overlay/Portals: positioning and scroll strategies.](#29-cdk-overlayportals-positioning-and-scroll-strategies)
30. [Angular Elements and `CUSTOM_ELEMENTS_SCHEMA`.](#30-angular-elements-and-custom_elements_schema)
31. [Profiling performance with Angular DevTools; CD cycles analysis.](#31-profiling-performance-with-angular-devtools-cd-cycles-analysis)
32. [Using `takeUntilDestroyed` and `DestroyRef` for cleanup.](#32-using-takeuntildestroyed-and-destroyref-for-cleanup)
33. [`CanMatch` vs `CanLoad`: differences and migration advice.](#33-canmatch-vs-canload-differences-and-migration-advice)
34. [Route resolvers: pros/cons vs fetching in components/effects.](#34-route-resolvers-proscons-vs-fetching-in-componentseffects)
35. [Dynamic forms with `FormArray` and nested `FormGroup`s.](#35-dynamic-forms-with-formarray-and-nested-formgroups)
36. [Directive input coercion and best practices (`coerceBooleanProperty`).](#36-directive-input-coercion-and-best-practices-coercebooleanproperty)
37. [Pure vs impure pipes; when to use and performance impact.](#37-pure-vs-impure-pipes-when-to-use-and-performance-impact)
38. [`AsyncPipe` behavior and OnPush; scheduling and auto-unsubscribe.](#38-asyncpipe-behavior-and-onpush-scheduling-and-auto-unsubscribe)
39. [View encapsulation modes; `:host`, `::ng-deep`, and Shadow DOM.](#39-view-encapsulation-modes-host-ng-deep-and-shadow-dom)
40. [Component communication: `@Input`/`@Output` vs RxJS services vs signals.](#40-component-communication-inputoutput-vs-rxjs-services-vs-signals)

---

### 1. Explain Angular change detection and when to use `OnPush`.

- Default strategy runs after many async events (Zone.js): setTimeout, XHR, click, etc.
- Traverses the component tree, checking bindings; expensive in large trees.
- `OnPush` limits checks to when: input reference changes, an event originates in the component/view, an observable/signal/async pipe emits, or `markForCheck()` is called.
- Works best with immutable data and pure computations; avoid mutating arrays/objects.
- For heavy child trees, combine `OnPush` + `trackBy` + pure pipes to minimize work.

```ts
@Component({
  selector: 'user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li *ngFor="let u of users; trackBy: trackById">{{ u.name }}</li>
  `
})
export class UserListComponent {
  @Input() users: ReadonlyArray<{ id: number; name: string }>; // new ref to update
  trackById = (_: number, u: { id: number }) => u.id;
}
```

### 2. What is Zone.js and how does zone-less Angular work?

- Zone.js monkey-patches async APIs to know when tasks finish and trigger CD automatically.
- Pros: easy mental model; Cons: extra overhead and sometimes redundant checks.
- Zone-less removes Zone.js; CD must be triggered by signals/async pipe or explicitly.
- In modern Angular, you can bootstrap without zones and rely on signals and fine-grained triggers.

```ts
bootstrapApplication(AppComponent /*, { providers: [provideZoneChangeDetection(/* zoneless */)] } */);
// Drive updates via signals/async pipe, or inject ChangeDetectorRef and call markForCheck() as needed.
```

### 3. Compare `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` with real use cases.

- `switchMap`: cancel previous, keep latest. Typeahead, route param changes.
- `mergeMap`: run concurrently. Websocket fan-out, fire-and-forget events.
- `concatMap`: queue sequentially. Save operations that must preserve order.
- `exhaustMap`: ignore new until current completes. Prevent double-submit.

```ts
// Typeahead
term$.pipe(
  debounceTime(200),
  distinctUntilChanged(),
  switchMap(t => this.http.get(`/api/search?q=${t}`))
);

// Sequential saves
saveClicks$.pipe(concatMap(() => this.http.post('/api/save', model)));

// Login button spam safety
loginClicks$.pipe(exhaustMap(() => this.auth.login(credentials)));
```

### 4. Cold vs hot observables; how to multicast with `shareReplay` safely?

- Cold: new producer per subscriber (e.g., `http.get`). Hot: shared producer (Subject/DOM events).
- Multicast with `share()` or cache with `shareReplay` to avoid duplicate work.
- Safer caching: `shareReplay({ bufferSize: 1, refCount: true })` so it disconnects when unused.
- Consider resetting cache on error/complete or invalidating manually.

```ts
const user$ = this.http.get('/api/user').pipe(
  shareReplay({ bufferSize: 1, refCount: true })
);
```

### 5. Preventing RxJS memory leaks in components/services.

- Prefer `AsyncPipe` or `toSignal()` over manual `subscribe()`.
- In components/directives, use `takeUntilDestroyed()`.
- Scope shared streams with `shareReplay({ refCount: true })` or complete subjects.
- Avoid nested subscriptions; use higher-order mapping (`switchMap` et al.).

```ts
@Component({ /* ... */ })
export class Cmp {
  data$ = this.api.getData(); // template uses | async
  constructor() {
    this.api.events$.pipe(takeUntilDestroyed()).subscribe();
  }
}
```

### 6. Signals vs Observables: when to use each?

- Signals: synchronous, fine-grained UI state, computed values, template-friendly.
- Observables: async streams, events, websockets, retries/backpressure, operators.
- Bridge: `toSignal(observable)` for UI; `toObservable(signal)` for RxJS pipelines.

```ts
const selectedId = signal<number | null>(null);
const item$ = this.http.get<Item>('/api/item').pipe(shareReplay(1));
const itemSig = toSignal(item$, { initialValue: null });
```

### 7. Standalone components vs NgModules; provider scoping differences.

- Standalone components remove the need for NgModules; import dependencies per-component/route.
- Provider scopes: platform → application (root) → route/lazy → component.
- Providing at route level isolates instances across lazy boundaries.

```ts
@Component({
  standalone: true,
  selector: 'user-card',
  imports: [CommonModule],
  template: `...`
})
export class UserCard {}
```

### 8. Dependency Injection tokens (`InjectionToken`), multi providers, and injector hierarchy.

- Use `InjectionToken<T>` for interface-like injection or config values.
- Multi providers collect arrays of providers under one token.
- The nearest provider in the injector tree wins.

```ts
export interface Logger { log(msg: string): void }
export const LOGGER = new InjectionToken<Logger>('LOGGER');

providers: [
  { provide: LOGGER, useClass: ConsoleLogger },
  { provide: LOGGER, useClass: RemoteLogger, multi: true } // array of loggers
]
```

### 9. `providedIn: root` vs `any` vs `platform`; duplication in lazy modules.

- `root`: single app-wide instance.
- `any`: new instance per lazy-loaded injector; useful for route-scoped services.
- `platform`: one per platform (multiple apps on same page share it).
- Beware `any` if you expect a singleton shared across lazy modules.

```ts
@Injectable({ providedIn: 'any' }) export class FeatureState {}
```

### 10. Routing with standalone APIs; `CanMatch` vs `CanLoad` vs `CanActivate`.

- Standalone routes use `loadComponent`/`loadChildren`.
- `CanMatch`: decides if a route should match; can replace many `CanLoad` cases.
- `CanLoad`: blocks loading the lazy bundle; not re-run once loaded.
- `CanActivate`: runs after match; controls navigation.

```ts
export const routes: Routes = [
  { path: 'admin', canMatch: [authCanMatch], loadChildren: () => import('./admin.routes') }
];
```

### 11. Preloading strategies and implementing a custom preloader.

- Built-in strategies: `NoPreloading`, `PreloadAllModules`.
- Custom strategy implements `PreloadingStrategy` and uses route data to decide.

```ts
@Injectable({ providedIn: 'root' })
export class SelectivePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>) {
    return route.data?.['preload'] ? load() : of(null);
  }
}
```

### 12. Implementing `ControlValueAccessor` for reusable form controls.

- Implement `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`.
- Provide `NG_VALUE_ACCESSOR` and call `onChange`/`onTouched` at the right times.

```ts
@Component({
  selector: 'rating-input',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RatingInput), multi: true }],
  template: `<button (click)="set(5)">5</button>`
})
export class RatingInput implements ControlValueAccessor {
  private _value = 0; onChange = (_: number) => {}; onTouched = () => {};
  writeValue(v: number) { this._value = v ?? 0; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(disabled: boolean) { /* update UI */ }
  set(v: number) { this._value = v; this.onChange(v); this.onTouched(); }
}
```

### 13. Reactive Forms: sync vs async validators; performance tips.

- Sync validators return errors synchronously; async validators return `Observable<ValidationErrors | null>`.
- Use `updateOn: 'blur'|'submit'` to reduce validation frequency.
- Debounce `valueChanges` for expensive async checks.

```ts
const usernameTaken: AsyncValidatorFn = (c: AbstractControl) =>
  timer(300).pipe(switchMap(() => http.get(`/api/u/${c.value}`)), map(exists => exists ? { taken: true } : null));

new FormControl('', { validators: [Validators.required], asyncValidators: [usernameTaken], updateOn: 'blur' });
```

### 14. List rendering performance: `trackBy`, `@for`, and virtualization.

- Always provide a stable `trackBy` (e.g., id) to minimize DOM churn.
- Use Angular 17 `@for` for improved performance and clearer syntax.
- Virtualize large lists with `CdkVirtualScrollViewport`.

```html
@for (item of items; track item.id) {
  <app-row [item]="item" />
}
```

### 15. `*ngIf` vs `[hidden]`; `ng-template`, `ng-container`, and `@if`.

- `*ngIf` adds/removes DOM; `[hidden]` toggles visibility via CSS only.
- `ng-template` defines a template block; `ng-container` groups nodes without extra DOM.
- `@if` (Angular 17+) is the new control flow alternative.

```html
@if (isLoggedIn()) { <app-profile/> } @else { <a routerLink="/login">Login</a> }
```

### 16. Content projection (single/multi-slot) and `ng-content select`.

- Single slot: `<ng-content></ng-content>`.
- Multi-slot uses selectors to target projected nodes.

```html
<!-- child -->
<header><ng-content select="[slot=header]"></ng-content></header>
<main><ng-content></ng-content></main>
<footer><ng-content select="[slot=footer]"></ng-content></footer>
```

### 17. Immutable patterns with `OnPush`; `markForCheck` vs `detectChanges`.

- Emit new references (spread/concat) to trigger `OnPush` updates.
- `markForCheck()`: schedule check up the tree; preferred.
- `detectChanges()`: run CD immediately for current view; use sparingly.

```ts
this.todos = [...this.todos, newTodo]; // triggers OnPush
this.cdr.markForCheck();
```

### 18. HTTP interceptors: auth, retry/backoff, error handling, cancelation.

- Clone and modify requests (tokens/headers), centralize error mapping.
- Use `retry`/`retryWhen` with backoff; beware idempotency.
- Cancel by unsubscribing; consider `takeUntil` for in-flight cancellation.

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const auth = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(auth).pipe(retry(1), catchError(err => throwError(() => mapErr(err))));
  }
}
```

### 19. Global error handling with `ErrorHandler` and router errors.

- Provide a custom `ErrorHandler` to capture/log unexpected errors.
- Subscribe to `router.events` and handle `NavigationError`.

```ts
@Injectable()
export class GlobalErrors implements ErrorHandler {
  handleError(error: any): void { report(error); }
}

router.events.pipe(filter(e => e instanceof NavigationError)).subscribe(e => showToast('Navigation failed'));
```

### 20. i18n with `$localize` and ICU; runtime vs build-time.

- Build-time i18n produces separate locale bundles; best performance.
- `$localize` enables runtime translations with tagged templates; more flexible.
- Use ICU for plurals/gender.

```ts
const count = 3;
const msg = $localize`You have ${count}:plural: =0 {no messages} =1 {one message} other {${count} messages}}`;
```

### 21. Testing standalone components; `TestBed`, `fakeAsync`, and Http testing.

- Import the standalone component in the testing module.
- Use `fakeAsync`/`tick` for timers and microtasks.
- Mock HTTP with `HttpTestingController`.

```ts
await TestBed.configureTestingModule({ imports: [MyCmp] }).compileComponents();
const http = TestBed.inject(HttpTestingController);
http.expectOne('/api').flush({ ok: true });
```

### 22. Build optimization: budgets, source maps, and strict TypeScript.

- Set budgets in `angular.json` to catch size regressions.
- Disable prod source maps; enable strict mode and strict templates.

```json
{
  "budgets": [{ "type": "bundle", "name": "main", "maximumWarning": "500kb", "maximumError": "1mb" }]
}
```

### 23. SSR and hydration with Angular Universal; `TransferState`.

- SSR renders HTML on server; hydration reuses it on client to avoid re-render.
- Use `TransferState` to pass fetched data from server to client.

```ts
// server: set
this.transferState.set(MAKE_STATE_KEY('user'), user);
// browser: get
const user = this.transferState.get(MAKE_STATE_KEY<User>('user'), null);
```

### 24. PWA with Angular Service Worker: caching strategies and updates.

- `ng add @angular/pwa` to enable SW; configure `ngsw-config.json`.
- Use `SwUpdate` to detect updates and prompt reload.

```ts
this.swUpdate.versionUpdates.subscribe(() => this.promptReload());
```

### 25. NgRx/ComponentStore vs service-with-RxJS vs Signals Store.

- Service + RxJS: minimal boilerplate; great for small/medium features.
- ComponentStore: easy local feature state with updaters/effects.
- NgRx Store: global state, strict patterns, time-travel, devtools.
- Signals stores: ergonomic computed state for components; bridge to RxJS for async.

### 26. View queries vs content queries; `@ViewChild` options.

- View queries search within component template; content queries search projected content.
- Options: `{ static: true|false }`, `read: ElementRef|TemplateRef|...`.

```ts
@ViewChild('tpl', { static: true }) tpl!: TemplateRef<any>;
@ContentChild(ChildDirective) child!: ChildDirective;
```

### 27. Angular 17 control flow: `@if`, `@for`, `@defer` vs structural directives.

- `@if/@else` replaces `*ngIf`; `@for` replaces `*ngFor` with better DX/perf.
- `@defer` lazily renders blocks on triggers (on viewport, on idle, after timer).

```html
@defer (on viewport) { <heavy-widget/> } @placeholder { Loading… }
```

### 28. Accessibility: CDK a11y utilities (`FocusMonitor`, `LiveAnnouncer`).

- `FocusMonitor` lets you style focus differently for keyboard vs mouse.
- `LiveAnnouncer` announces updates to screen readers.

```ts
constructor(fm: FocusMonitor, el: ElementRef, la: LiveAnnouncer) {
  fm.monitor(el).subscribe(origin => this.origin = origin);
  la.announce('Saved successfully');
}
```

### 29. CDK Overlay/Portals: positioning and scroll strategies.

- Create dynamic floating panels (menus/dialogs/tooltips) with `Overlay`.
- Use `FlexibleConnectedPositionStrategy` with fallbacks; set scroll strategies.

```ts
const overlayRef = this.overlay.create({ hasBackdrop: true, positionStrategy: this.overlay.position().flexibleConnectedTo(btn) });
overlayRef.attach(new ComponentPortal(MenuComponent));
```

### 30. Angular Elements and `CUSTOM_ELEMENTS_SCHEMA`.

- Wrap Angular components as Web Components for non-Angular hosts.
- Add `CUSTOM_ELEMENTS_SCHEMA` to allow custom tags.

```ts
const MyEl = createCustomElement(MyCmp, { injector });
customElements.define('my-el', MyEl);
```

### 31. Profiling performance with Angular DevTools; CD cycles analysis.

- Use the profiler to see CD cycles, render time, and hot components.
- Optimize by switching heavy components to `OnPush`, adding `trackBy`, memoizing computed values, and removing impure pipes.

### 32. Using `takeUntilDestroyed` and `DestroyRef` for cleanup.

- Built-in utility to auto-unsubscribe in components/directives.
- For services, pair with `DestroyRef` or manage your own teardown.

```ts
this.stream$.pipe(takeUntilDestroyed()).subscribe();
```

### 33. `CanMatch` vs `CanLoad`: differences and migration advice.

- `CanMatch` guards matching; can prevent activation without blocking preloading.
- `CanLoad` prevents fetching the lazy bundle; not re-run once loaded.
- Prefer `CanMatch`; keep `CanLoad` for strict bundle-load prevention.

```ts
export const authMatch: CanMatchFn = () => inject(Auth).hasAccess() ? true : createUrlTree(['/login']);
```

### 34. Route resolvers: pros/cons vs fetching in components/effects.

- Resolvers guarantee data before navigation at cost of slower first paint.
- Component-level fetching enables skeletons/progressive rendering.
- Use resolvers for critical data that must exist before showing the page.

```ts
export const userResolver: ResolveFn<User> = () => inject(Api).getUser();
```

### 35. Dynamic forms with `FormArray` and nested `FormGroup`s.

- Model nested data with groups and arrays; use `trackBy` in templates.
- Use `patchValue`/`setControl` for updates; avoid recreating entire forms.

```ts
const form = fb.group({ items: fb.array([fb.group({ name: '', qty: 1 })]) });
(items(form).push(fb.group({ name: '', qty: 0 })));
```

### 36. Directive input coercion and best practices (`coerceBooleanProperty`).

- Coerce string/bare attributes to booleans/numbers robustly.

```ts
@Input() set disabled(v: BooleanInput) { this._disabled = coerceBooleanProperty(v); }
```

### 37. Pure vs impure pipes; when to use and performance impact.

- Pure pipes run only when input reference changes; impure run every CD cycle.
- Avoid impure pipes except for small lists or debug.

```ts
@Pipe({ name: 'filterImpure', pure: false }) export class FilterImpurePipe { /* … */ }
```

### 38. `AsyncPipe` behavior and OnPush; scheduling and auto-unsubscribe.

- `AsyncPipe` subscribes/unsubscribes automatically and marks view for check.
- Use `| async as value` to avoid repeated evaluations.

```html
<div *ngIf="user$ | async as user">Hello, {{ user.name }}</div>
```

### 39. View encapsulation modes; `:host`, `::ng-deep`, and Shadow DOM.

- Encapsulation: `Emulated` (scoped attributes), `ShadowDom` (real shadow root), `None` (global styles).
- Use `:host` to style the host; avoid `::ng-deep` (deprecated).

```css
:host { display: block }
:host-context(.dark) { color: white }
```

### 40. Component communication: `@Input`/`@Output` vs RxJS services vs signals.

- Local parent-child: `@Input`/`@Output` or template outputs.
- Cross-cutting: shared service with Subjects/Observables.
- Signals: local state; convert to/from observables when needed.

```ts
@Output() saved = new EventEmitter<void>();
this.eventsBus.notify$.next({ type: 'SAVED' });
```
