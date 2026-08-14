# Memory Leaks in Angular — Detection, Causes, and Fixes (2026)

A practical guide for Angular 19+ applications: why components stay in memory after navigation, how to find leaks in Chrome DevTools, and modern patterns (`takeUntilDestroyed`, `DestroyRef`, `async` pipe, signal `effect` cleanup).

> **Stack:** Standalone components, RxJS 7+, signals, `inject()`, Zone.js (default) or zoneless preview.

---

## Table of Contents

1. [How Angular leaks differ from plain browser leaks](#1-how-angular-leaks-differ-from-plain-browser-leaks)
2. [Common causes in Angular apps](#2-common-causes-in-angular-apps)
3. [RxJS subscriptions — the #1 leak](#3-rxjs-subscriptions--the-1-leak)
4. [Timers, DOM APIs, and third-party libraries](#4-timers-dom-apis-and-third-party-libraries)
5. [Dynamic components and portals](#5-dynamic-components-and-portals)
6. [Services, DI scope, and singleton traps](#6-services-di-scope-and-singleton-traps)
7. [Signals and effects cleanup](#7-signals-and-effects-cleanup)
8. [Routing, guards, and reused routes](#8-routing-guards-and-reused-routes)
9. [How to detect Angular memory leaks in the browser](#9-how-to-detect-angular-memory-leaks-in-the-browser)
10. [Prevention checklist](#10-prevention-checklist)
11. [Interview quick answers](#11-interview-quick-answers)

---

## 1. How Angular leaks differ from plain browser leaks

Angular adds layers on top of the browser heap:

| Layer | What it holds | Leak symptom |
|-------|---------------|--------------|
| **Component instance** | Template, DI tree, change detector | Same component class count grows after each navigation |
| **RxJS `Subscription`** | Observer + closure over component `this` | Growing `Subscriber` / `Subscription` in heap |
| **DOM + View** | Rendered nodes, listeners (some auto-removed) | Detached `app-*` elements in Memory tab |
| **Root services** | Live forever — intentional, but can hold dead UI refs | Service holds reference to destroyed `ComponentRef` |
| **Zone.js** | Patched timers/events keep zones alive | Tasks scheduled outside proper teardown |

**Key rule:** When a component is destroyed, **everything that outlives it** must not reference the component — subscriptions, timers, global listeners, cached DOM nodes, closures in services.

---

## 2. Common causes in Angular apps

| Cause | Why it leaks | Typical location |
|-------|--------------|------------------|
| Manual `.subscribe()` without teardown | Subscription holds component in closure | `ngOnInit`, constructors |
| `interval` / `timer` RxJS not unsubscribed | Same as above | Polling, countdowns |
| `setInterval` / `setTimeout` in component | Callback captures `this` | Charts, animations |
| `window` / `document` listeners | Outlive component | Resize, scroll, keyboard shortcuts |
| Third-party widgets (maps, charts) | Library keeps DOM/JS refs | `ngAfterViewInit` init without destroy |
| Dynamic component not destroyed | `ComponentRef` stays referenced | Modals, overlays, `ViewContainerRef` |
| `@Component({ providers: [...] })` + global streams | Service dies but subscription on hot observable remains | Feature components |
| Service stores `ComponentRef` / DOM element | Singleton outlives route | Anti-pattern helpers |
| Router `events.subscribe()` | Never unsubscribed | Layout shell components |
| `form.valueChanges.subscribe()` | Form outlives component if ref kept | Reactive forms |
| `effect()` without cleanup | Signal effect re-runs, old side effects linger | Signal-based components |
| `console.log(component)` in DevTools | Browser retains object while console open | Local debugging |

---

## 3. RxJS subscriptions — the #1 leak

### BAD — manual subscribe, no cleanup

```typescript
@Component({
  selector: 'app-prices',
  template: `{{ price }}`,
})
export class PricesComponent implements OnInit {
  price = 0;

  constructor(private market: MarketService) {}

  ngOnInit() {
    // LEAK — subscription survives component destroy
    this.market.getPrice$('AAPL').subscribe((p) => (this.price = p));
  }
}
```

### GOOD — `takeUntilDestroyed()` (Angular 16+, recommended 2026)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-prices',
  template: `{{ price() }}`,
})
export class PricesComponent implements OnInit {
  private market = inject(MarketService);
  price = signal(0);

  ngOnInit() {
    this.market
      .getPrice$('AAPL')
      .pipe(takeUntilDestroyed()) // auto-unsub when component destroyed
      .subscribe((p) => this.price.set(p));
  }
}
```

**In constructor** (injection context required):

```typescript
constructor() {
  this.market
    .getPrice$('AAPL')
    .pipe(takeUntilDestroyed())
    .subscribe((p) => this.price.set(p));
}
```

### GOOD — `async` pipe (no manual subscribe)

```typescript
@Component({
  selector: 'app-prices',
  template: `{{ price$ | async }}`,
})
export class PricesComponent {
  price$ = inject(MarketService).getPrice$('AAPL');
  // Angular unsubscribes when view is destroyed
}
```

### GOOD — `DestroyRef` + `onDestroy` callback

```typescript
import { Component, DestroyRef, inject } from '@angular/core';

@Component({ /* ... */ })
export class DashboardComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private ws: WebSocketService) {
    const sub = this.ws.messages$.subscribe((msg) => this.handle(msg));

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
```

### Legacy — `takeUntil` + `Subject` (still valid in older codebases)

```typescript
export class LegacyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.data$.pipe(takeUntil(this.destroy$)).subscribe(/* ... */);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### HTTP — usually safe

`HttpClient` observables **complete after one emission** — a single `http.get().subscribe()` rarely leaks. Leaks come from **long-lived streams**: WebSockets, `interval`, `fromEvent`, shared `BehaviorSubject`, router events.

---

## 4. Timers, DOM APIs, and third-party libraries

```typescript
@Component({ /* ... */ })
export class ChartComponent implements AfterViewInit, OnDestroy {
  private chart?: ChartInstance;
  private rafId = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    this.chart = new ChartInstance(this.canvas.nativeElement);

    // LEAK if not disconnected
    this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
    this.resizeObserver.observe(this.canvas.nativeElement);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.chart?.destroy();
  }
}
```

**Global listeners — use `DestroyRef` or `HostListener`:**

```typescript
// HostListener — Angular removes on destroy (safe)
@HostListener('window:resize')
onResize() { /* ... */ }

// Manual — must clean up
private controller = new AbortController();

ngOnInit() {
  window.addEventListener('keydown', this.onKey, { signal: this.controller.signal });
}

ngOnDestroy() {
  this.controller.abort();
}
```

---

## 5. Dynamic components and portals

```typescript
// LEAK — ComponentRef kept in array after close
private refs: ComponentRef<ModalComponent>[] = [];

openModal() {
  const ref = this.vcr.createComponent(ModalComponent);
  this.refs.push(ref); // never cleared
}

// FIX — destroy and drop reference
closeModal(ref: ComponentRef<ModalComponent>) {
  ref.destroy();
  this.refs = this.refs.filter((r) => r !== ref);
}
```

**CDK Overlay / Dialog** — always call `ref.dispose()` or use `MatDialog` which handles lifecycle when closed.

**`@defer` blocks** — destroyed with template; still clean up subscriptions created inside deferred component logic.

---

## 6. Services, DI scope, and singleton traps

| Provider scope | Lifetime | Leak risk |
|----------------|----------|-----------|
| `providedIn: 'root'` | App lifetime | Service must not hold destroyed component refs |
| `@Component({ providers: [X] })` | Component subtree | New instance per component — OK if teardown is local |
| `Route` providers | Route lifetime | Dies on navigation — still unsubscribe in service if needed |

```typescript
// ANTI-PATTERN — root service holds dead component reference
@Injectable({ providedIn: 'root' })
export class UiStateService {
  activePanel?: ComponentRef<PanelComponent>; // stays after navigation
}

// BETTER — store only serializable state or use WeakRef for debugging
@Injectable({ providedIn: 'root' })
export class UiStateService {
  panelId = signal<string | null>(null);
}
```

**Event bus in root service** — subscribers must unsubscribe on destroy, or use hot observable with `takeUntilDestroyed` in the consumer.

---

## 7. Signals and effects cleanup

```typescript
@Component({ /* ... */ })
export class SearchComponent {
  query = signal('');
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect((onCleanup) => {
      const q = this.query();
      const sub = this.api.search(q).subscribe((results) => this.render(results));

      // Angular 19+ — cleanup when effect re-runs or component destroys
      onCleanup(() => sub.unsubscribe());
    });
  }
}
```

**`toSignal()`** — ties observable to component injector; unsubscribes when context is destroyed (when used in injection context):

```typescript
readonly users = toSignal(this.userService.getAll$(), { initialValue: [] });
```

**`linkedSignal` / computed** — pure derivations; no subscription leak.

---

## 8. Routing, guards, and reused routes

```typescript
// LEAK in AppComponent shell
ngOnInit() {
  this.router.events.subscribe((e) => this.log(e)); // never unsubscribed
}

// FIX
this.router.events
  .pipe(takeUntilDestroyed())
  .subscribe((e) => this.log(e));
```

**`RouteReuseStrategy`** — keeps component instances alive **by design** (e.g. tab cache). Not a leak, but memory grows — cap cached routes or implement `shouldDetach` / `shouldAttach` carefully.

**Lazy-loaded routes** — destroyed modules/components should release subscriptions; verify with heap diff after 20 navigations.

---

## 9. How to detect Angular memory leaks in the browser

### Step-by-step (Chrome DevTools)

1. Run app in **production-like mode** (`ng serve` is OK; avoid HMR noise for final check)
2. Open **DevTools → Memory**
3. Take **Heap snapshot** (baseline)
4. Navigate: open component → leave → repeat **10–20 times** (same route)
5. Click **Collect garbage** (trash icon)
6. Take second snapshot → **Comparison** view
7. Filter by:
   - **`Detached`** — look for `app-dashboard`, `mat-dialog-container`
   - **`Subscription` / `Subscriber`** — growing count = RxJS leak
   - **Your component class name** — e.g. `PricesComponent` instances should not increase
8. **Performance → Memory** — record while navigating; JS heap should plateau, not stair-step up forever

### Angular-specific heap clues

| Retained object | Likely cause |
|---------------|--------------|
| `Subscriber` | Open RxJS subscription |
| `ComponentRef` | Dynamic component not destroyed |
| `LView` / `TView` | Component view not released (rare — often subscription-related) |
| `EventEmitter` | Usually OK; check parent holding child |
| Detached `HTMLElement` with `ng-version` attr | DOM + component ref still linked |

### Optional: Angular DevTools

- **Profiler** tab — change detection cycles (not direct leak detection, but shows runaway CD from open streams)
- **Component tree** — verify components unmount after navigation

### Cypress / Playwright smoke test

Navigate in a loop; assert `performance.memory.usedJSHeapSize` plateau (Chrome only, approximate).

---

## 10. Prevention checklist

**Subscriptions**

- [ ] Prefer `async` pipe in templates
- [ ] Use `takeUntilDestroyed()` for imperative subscribe
- [ ] Use `toSignal()` instead of manual subscribe when converting observables
- [ ] Unsubscribe WebSockets, `interval`, router events, `valueChanges`

**Lifecycle**

- [ ] Implement cleanup in `ngOnDestroy` or `DestroyRef.onDestroy`
- [ ] Destroy dynamic `ComponentRef` instances
- [ ] Disconnect `ResizeObserver` / `MutationObserver`
- [ ] `clearInterval` / `cancelAnimationFrame` / `URL.revokeObjectURL`

**Architecture**

- [ ] Root services do not store component/DOM references
- [ ] Avoid `@Component({ providers })` unless you understand subtree lifetime
- [ ] Cap route reuse / tab cache size
- [ ] Third-party libs: call `.destroy()` in `ngOnDestroy`

**Verification**

- [ ] Heap snapshot diff after repeated navigation
- [ ] No growing `Subscription` count
- [ ] No detached `app-*` DOM nodes after GC

---

## 11. Interview quick answers

**Q: What causes memory leaks in Angular?**  
Unsubscribed Observables, timers, global event listeners, dynamic components not destroyed, and root services holding references to destroyed views.

**Q: Best way to prevent subscription leaks in 2026?**  
Use the `async` pipe in templates, or `takeUntilDestroyed()` / `toSignal()` for imperative code.

**Q: Does `HttpClient` leak?**  
Single requests complete and unsubscribe automatically. Long-lived streams (WebSocket, polling) need explicit teardown.

**Q: How do you detect leaks?**  
Chrome Memory heap snapshots before/after repeated navigation; compare `Subscription`, component class instances, and detached DOM nodes; force GC between snapshots.

**Q: `takeUntil` vs `takeUntilDestroyed`?**  
`takeUntilDestroyed` is built-in, less boilerplate, works with `DestroyRef`, and avoids forgetting `ngOnDestroy` cleanup.

---

## Related docs

- [Top 20 Middle JavaScript Questions — Q4 Browser memory leaks](../js/top-20-middle-javascript-questions-2026.md#4-what-causes-memory-leaks-in-javascript-and-how-do-you-prevent-them)
- [Comprehensive Angular Middle Questions — RxJS unsubscribe sections](./comprehensive_angular_middle_questions_with_links.md)
