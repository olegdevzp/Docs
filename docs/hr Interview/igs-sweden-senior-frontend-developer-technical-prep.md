# IGS Sweden — Senior Frontend Developer — Technical Interview Preparation Guide

> **Position:** [Senior Frontend Developer](https://igsswedenab.bamboohr.com/careers/25?source=linkedin?uid=5c6uikk1) at IGS Sweden AB  
> **Purpose:** Technical screening / live coding / architecture discussion (~60–90 min). Expect Angular depth, API integration, performance, and iGaming-domain scenarios.  
> **Prerequisite:** Read the [HR prep guide](./igs-sweden-senior-frontend-developer-hr-prep.md) first — especially [Section 12 (iGaming context)](./igs-sweden-senior-frontend-developer-hr-prep.md#12-igaming--gambling-provider-context).  
> **Customize:** Replace `[bracketed placeholders]` with your real project details.

---

## Table of Contents

1. [What to Expect — Interview Formats](#1-what-to-expect--interview-formats)
2. [Tech Stack & Architecture Context](#2-tech-stack--architecture-context)
3. [Angular — Core Senior Topics](#3-angular--core-senior-topics)
4. [RxJS & Real-Time Data](#4-rxjs--real-time-data)
5. [TypeScript & JavaScript Fundamentals](#5-typescript--javascript-fundamentals)
6. [REST API Integration (Angular ↔ Java/Spring)](#6-rest-api-integration-angular--javaspring)
7. [Performance & Bundle Optimization](#7-performance--bundle-optimization)
8. [Shared Libraries & Nx Monorepo](#8-shared-libraries--nx-monorepo)
9. [Testing Strategy](#9-testing-strategy)
10. [Security & OAuth2](#10-security--oauth2)
11. [SEO, SSR & Public Pages](#11-seo-ssr--public-pages)
12. [iGaming Technical Scenarios](#12-igaming-technical-scenarios)
13. [System Design Exercises](#13-system-design-exercises)
14. [Live Coding Practice Problems](#14-live-coding-practice-problems)
15. [Code Review Scenarios](#15-code-review-scenarios)
16. [Map Your Resume to Technical Answers](#16-map-your-resume-to-technical-answers)
17. [Questions to Ask Interviewers](#17-questions-to-ask-interviewers)
18. [Pre-Interview Checklist](#18-pre-interview-checklist)

---

## 1. What to Expect — Interview Formats

Small agencies like IGS often combine several formats in one or two technical rounds:

| Format | Duration | What they test | How to prepare |
|---|---|---|---|
| **Technical screen** | 45–60 min | Angular, RxJS, REST, past projects | Sections 3–6, 16 |
| **Live coding** | 45–60 min | Component + service, RxJS, forms | Section 14 |
| **Architecture / system design** | 30–45 min | White-label lobby, real-time odds, libs | Sections 8, 12, 13 |
| **Code review** | 20–30 min | Spot bugs, suggest improvements | Section 15 |
| **Take-home** (less common) | 2–4 hours | Small feature end-to-end | Sections 9, 12 |

**Senior signal they look for:** you explain **trade-offs**, not just syntax — when to use Signals vs RxJS, when NgRx is overkill, how you'd structure libs for multiple brands.

**Opening line when a question is domain-specific:**

> "I haven't built a casino lobby in production, but I've solved the same class of problem — [real-time streams / payment reconciliation / multi-surface libs]. Here's how I'd approach it in iGaming…"

---

## 2. Tech Stack & Architecture Context

### IGS frontend stack (from job posting + backend hiring context)

| Layer | Technology | Your talking point |
|---|---|---|
| **Framework** | Angular, TypeScript | 10+ years, Nx monorepos, standalone components |
| **Async / state** | RxJS (primary), Signals (modern) | WebSocket batching, `takeUntilDestroyed` |
| **API** | RESTful HTTP | NestJS experience maps to Spring REST contracts |
| **Backend (collaboration)** | Java 17+, Spring, Kafka, WebFlux | Understand DTOs, pagination, OAuth2, event-driven updates |
| **Integrations** | Payment PSPs, game providers | Stripe idempotency → wallet/deposit flows |
| **Infra awareness** | Docker, Kubernetes | CI bundle budgets, environment configs |
| **SEO / analytics** | Public marketing pages | SSR/prerender, GA4 events |

### Typical iGaming frontend architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Angular Shell (multi-brand theming, routing, auth guard)   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Lobby / CMS │  Sportsbook  │  Wallet/KYC  │  RG/compliance │
│  (lazy route)│  (WebSocket) │  (REST)      │  (REST + UX)   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│  Shared UI lib │ Data-access libs │ Feature libs (Nx)       │
├─────────────────────────────────────────────────────────────┤
│  Java/Spring PAM API │ Game aggregator API │ Spelpaus API    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Angular — Core Senior Topics

### 3.1 Change detection — must know cold

**Q: Explain Angular change detection. How do you optimize a data-heavy screen?**

**Answer structure:**

1. **Default strategy** — Zone.js patches async APIs; CD runs top-down on entire tree (unless `OnPush`).
2. **OnPush** — CD runs when `@Input` reference changes, events originate in component, observables via `async` pipe emit, or signals update.
3. **Optimizations:** OnPush everywhere feasible, `trackBy` on `*ngFor`, avoid mutating arrays in place, virtual scroll (CDK) for long game lists, detach CD for off-screen panels if needed.

```typescript
@Component({
  selector: 'app-game-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (game of games(); track game.id) {
      <app-game-card [game]="game" />
    }
  `,
})
export class GameGridComponent {
  games = input.required<Game[]>();
}
```

**iGaming hook:** Live odds updating 10×/sec on a sportsbook — batch updates, update only changed rows, never re-render the entire slip.

---

### 3.2 Standalone components vs NgModules

**Q: How do you structure a modern Angular app?**

> Default to **standalone components** with `import: [...]` in `@Component`. Use **lazy `loadComponent`** for route-level code splitting. Keep **NgModules** only where a legacy lib requires it. Shared code lives in **publishable Nx libraries**, not fat `SharedModule` barrels.

---

### 3.3 Signals vs RxJS — when to use which

| Use Signals | Use RxJS |
|---|---|
| Local component state | WebSocket / SSE streams |
| Derived UI state (`computed`) | Complex async orchestration (`switchMap`, `forkJoin`) |
| Simple service state | Debouncing, retry, cancellation |
| Interop with templates (no async pipe) | Multi-source merging (odds + wallet + user prefs) |

**Pattern — bridge RxJS → Signal:**

```typescript
private odds$ = this.sportsbookService.oddsStream(eventId);
odds = toSignal(this.odds$, { initialValue: [] });
```

**Senior answer:** "Signals simplify local reactivity; RxJS stays the tool for event streams. I'd migrate hot paths incrementally, not rewrite the sportsbook layer on day one."

---

### 3.4 Dependency injection & scoping

**Q: When would you provide a service at component level vs root?**

| Scope | Use case | iGaming example |
|---|---|---|
| `providedIn: 'root'` | Singleton app services | `AuthService`, `ThemeService` |
| `@Component({ providers: [...] })` | Per-instance state | Bet slip state per route instance |
| `Route` providers | Feature-isolated services | `GameSessionService` for `/play/:id` |

**Trap question:** Singleton service holding a `Subscription` to a component-specific stream → memory leak. Service must not reference destroyed components.

---

### 3.5 Routing & guards

**Q: Design auth + compliance guards for an iGaming app.**

```typescript
export const routes: Routes = [
  {
    path: 'lobby',
    canActivate: [authGuard, spelpausGuard, ageVerifiedGuard],
    loadComponent: () => import('./lobby/lobby.component'),
  },
  {
    path: 'play/:gameId',
    canActivate: [authGuard, spelpausGuard, kycCompleteGuard],
    loadComponent: () => import('./game-launcher/game-launcher.component'),
  },
];
```

**Key points:**
- **Guards return `UrlTree`** for redirects (e.g. to `/login` or `/self-excluded`).
- **Resolvers** prefetch wallet balance or game metadata — show skeleton, not blank screen.
- **Lazy loading** — lobby, sportsbook, wallet are separate chunks.

---

### 3.6 Forms — registration / KYC

**Q: Multi-step registration with async validators (email unique, age check).**

```typescript
email: ['', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [uniqueEmailValidator(this.userApi)],
  updateOn: 'blur',
}],
```

**Senior points:**
- Wizard state in a **facade service** or signal store — survive step navigation.
- **Disable submit** until async validators complete (`statusChanges`).
- Never store full SSN/passport in client state longer than needed.
- BankID redirect flow — handle return URL, poll or callback for verification result.

---

### 3.7 Memory leaks — iGaming apps run for hours

Long casino sessions = long-lived subscriptions. Know:

- `takeUntilDestroyed()` (preferred)
- `async` pipe (auto cleanup)
- Cleanup for **WebSocket**, **setInterval** (session timer), **iFrame message listeners**

See: `docs/Angular/angular-memory-leaks-guide.md`

**Interview one-liner:**

> "In a session that lasts hours, every manual `subscribe()` in a lobby or odds component is a leak candidate. I default to `takeUntilDestroyed` or the async pipe, and I verify with Chrome DevTools heap snapshots after route navigation."

---

## 4. RxJS & Real-Time Data

### 4.1 Sportsbook odds stream — canonical iGaming problem

**Q: Hundreds of odds updates per minute. Keep UI smooth.**

```typescript
@Injectable({ providedIn: 'root' })
export class OddsFacade {
  private raw$ = this.ws.connect<OddsUpdate>('wss://api/odds');

  readonly displayOdds$ = this.raw$.pipe(
    bufferTime(100),                    // batch every 100ms
    filter(batch => batch.length > 0),
    scan((acc, batch) => this.mergeOdds(acc, batch), {} as OddsMap),
    distinctUntilChanged((a, b) => shallowEqual(a, b)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
```

**Explain:**
- **`bufferTime` / `auditTime`** — decouple network frequency from render frequency.
- **`scan`** — incremental merge, don't replace entire state.
- **`shareReplay`** — one WebSocket, many subscribers.
- **OnPush + immutable updates** — only changed selections re-render.

**Your hook:** Supply Chain Dashboard — same pattern for asset tracking bursts.

---

### 4.2 `switchMap` vs `mergeMap` vs `exhaustMap`

| Operator | Behavior | iGaming use |
|---|---|---|
| `switchMap` | Cancel previous inner obs | Game search as user types |
| `mergeMap` | Parallel inner obs | Multiple independent deposit methods |
| `exhaustMap` | Ignore new until current completes | Prevent double-submit on "Place Bet" |
| `concatMap` | Queue sequentially | Withdrawal requests one at a time |

**Bet placement — use `exhaustMap`:**

```typescript
placeBet$ = this.placeBetClick$.pipe(
  exhaustMap(selection => this.betApi.place(selection)),
  catchError(err => of({ error: err })),
);
```

---

### 4.3 Error handling & retry

```typescript
this.walletService.getBalance().pipe(
  retry({ count: 2, delay: 1000 }),
  catchError(() => of(null)),
  tap(balance => {
    if (balance === null) this.showOfflineBanner();
  }),
);
```

**Senior point:** Retry **idempotent GETs**, not POST deposits. Show stale balance with warning rather than wrong balance.

---

## 5. TypeScript & JavaScript Fundamentals

Quick-fire topics likely in any senior frontend round:

| Topic | What to say |
|---|---|
| **`interface` vs `type`** | `interface` for object shapes (extendable); `type` for unions/intersections |
| **Generics** | `ApiResponse<T>`, typed HTTP client, reusable grid column defs |
| **Utility types** | `Partial<T>`, `Pick<T,K>`, `Omit<T,K>`, `Record<K,V>` for DTO mapping |
| **`structuredClone` vs spread** | Deep clone for nested bet slip; spread is shallow |
| **Event loop** | Microtasks (Promises) before macrotasks (setTimeout) — explain UI freeze from sync work |
| **Closure** | RxJS subscription captures component `this` — leak source |
| **`===` vs `==`** | Always `===`; especially for currency comparisons |
| **Immutability** | OnPush depends on reference changes — `[...arr, item]` not `arr.push(item)` |

### 5.1 Topic breakdown

**`interface` vs `type`**

- `interface` — object shapes you may extend: `interface User extends BaseUser { ... }`
- `type` — unions, intersections, primitives: `type Status = 'open' | 'suspended'`

> Interview line: "I use `interface` for public API shapes, `type` for unions and computed types."

**Generics**

Reusable types/functions where the **shape stays the same** but the **inner type changes**:

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}

getBalance(): Observable<ApiResponse<BalanceDto>>
```

**Utility types**

| Type | Meaning | Example use |
|---|---|---|
| `Partial<T>` | all fields optional | patch/update forms |
| `Pick<T, K>` | keep selected fields | slim DTO for a list view |
| `Omit<T, K>` | remove selected fields | hide internal fields from UI |
| `Record<K, V>` | keyed object | `Record<string, Odds>` |

**`structuredClone` vs spread**

- `{ ...obj }` / `[...arr]` — **shallow** copy; nested objects are still shared
- `structuredClone(obj)` — **deep** copy; safe for nested bet slip / cart state

**Event loop**

JS runs on one thread. Order of execution:

1. Sync code
2. **Microtasks** — Promises, `queueMicrotask`
3. **Macrotasks** — `setTimeout`, I/O, DOM events

Heavy sync work blocks rendering. Senior point: "Don't parse 10k odds synchronously on the main thread."

**Closure**

A function that **remembers variables** from where it was created.

RxJS leak example: a `subscribe` callback closes over component `this` → subscription keeps the component alive after destroy. Fix with `takeUntilDestroyed()` or the async pipe.

**`===` vs `==`**

- `===` — strict, no type coercion
- `==` — coerces types (`0 == false` is `true`)

Always `===`, especially for currency/odds comparisons.

**Immutability**

OnPush detects changes when **references** change:

```typescript
// ❌ same reference — OnPush may not update
arr.push(item);

// ✅ new reference — OnPush sees the change
arr = [...arr, item];
```

Same for objects: `{ ...obj, price: 2.5 }` not `obj.price = 2.5`.

---

### 5.2 Coding question — debounce

**Q: Implement debounce. When would you use it?**

**What it does:** Run `fn` only after the caller **stops** triggering it for `ms` milliseconds. Classic use: game search — wait until typing pauses, then call the API.

```typescript
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
```

**Line-by-line:**

| Line | Meaning |
|---|---|
| `<T extends (...args: unknown[]) => void>` | Generic preserves the original function's type |
| `let timer: ReturnType<typeof setTimeout>` | One shared timer ID; `ReturnType<typeof setTimeout>` = whatever `setTimeout` returns |
| `clearTimeout(timer)` | Cancel the previous scheduled call — user is still active |
| `setTimeout(() => fn(...args), ms)` | Schedule a new call after `ms` with the **latest** args |
| `as T` | Tell TypeScript the wrapper matches the original function type |

**Flow example** (search input, `ms = 300`):

```
User types "a"     → schedule call in 300ms
User types "ab"    → cancel previous, schedule new call
User types "abc"   → cancel previous, schedule new call
... 300ms silence → fn("abc") runs once ✅
```

Without debounce: 3 API calls. With debounce: 1 call.

**Senior answer:** "In Angular I'd usually reach for RxJS `debounceTime` on a `Subject`, but the underlying pattern is the same: cancel pending work and only act after the burst ends."

---

## 6. REST API Integration (Angular ↔ Java/Spring)

IGS backend uses **Java/Spring**. You have **NestJS** experience — frame it as same REST contract discipline.

### 6.1 Typed HTTP layer

```typescript
@Injectable({ providedIn: 'root' })
export class WalletApi {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  getBalance(): Observable<BalanceDto> {
    return this.http.get<BalanceDto>(`${this.base}/wallet/balance`);
  }

  deposit(request: DepositRequest): Observable<DepositResult> {
    return this.http.post<DepositResult>(`${this.base}/wallet/deposit`, request);
  }
}
```

### 6.2 Error mapping

```typescript
export function mapApiError(err: HttpErrorResponse): UserFacingError {
  if (err.status === 403) return { code: 'SELF_EXCLUDED', message: 'Account restricted' };
  if (err.status === 402) return { code: 'LIMIT_EXCEEDED', message: 'Deposit limit reached' };
  if (err.status === 0) return { code: 'OFFLINE', message: 'Connection lost' };
  return { code: 'UNKNOWN', message: 'Something went wrong' };
}
```

### 6.3 Pagination (Spring Page format)

Spring often returns:

```json
{ "content": [...], "totalElements": 240, "number": 0, "size": 20 }
```

Map to infinite scroll or paginated game catalog. Discuss **`totalElements` for UI**, **`content` for current page**.

### 6.4 Idempotency keys (deposits / bets)

```typescript
deposit(amount: number): Observable<DepositResult> {
  const idempotencyKey = crypto.randomUUID();
  return this.http.post<DepositResult>(
    `${this.base}/wallet/deposit`,
    { amount },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  );
}
```

**Your hook:** Stripe payment intents — same pattern.

### 6.5 Interceptors

| Interceptor | Purpose |
|---|---|
| **Auth** | Attach Bearer token; refresh on 401 |
| **Correlation ID** | `X-Request-Id` for tracing across Java services |
| **Error** | Global toast vs silent fail for background polls |
| **Loading** | Optional spinner for mutating requests only |

---

## 7. Performance & Bundle Optimization

### 7.1 Load performance checklist

- [ ] Lazy routes per feature (lobby, sportsbook, account)
- [ ] `webpack-bundle-analyzer` / source-map-explorer
- [ ] `splitChunks` — vendor vs common vs feature
- [ ] Avoid barrel `index.ts` re-exports that break tree-shaking
- [ ] Buildable/publishable libs in Nx
- [ ] Bundle budgets in CI (`initial` < threshold)
- [ ] Preload critical routes; defer analytics scripts
- [ ] WebP/AVIF game thumbnails; responsive `srcset`

### 7.2 Runtime performance checklist

- [ ] OnPush + immutable data
- [ ] Virtual scroll for game grids (1000+ titles)
- [ ] Web Worker for heavy bet slip calculations (optional senior bonus)
- [ ] Defer non-visible carousel slides
- [ ] `NgOptimizedImage` for hero banners

### 7.3 Your 14% TTI story — technical breakdown

Use when they ask "walk me through a performance optimization":

| Step | Action | Result |
|---|---|---|
| 1 | Measure with Lighthouse + Webpack Analyzer | Identified 400KB in main bundle |
| 2 | Lazy routes for heavy modules | −180KB initial |
| 3 | Buildable Nx libs + dynamic imports | Better caching |
| 4 | `splitChunks` vendor chunk | Long-term cache hit |
| 5 | Removed barrel imports | Tree-shaking restored |
| 6 | CI bundle budget | Prevent regression |

**Numbers:** TTI ~4.2s → ~3.6s (~14%); initial JS ~1.9 → ~1.6 MB gzip.

---

## 8. Shared Libraries & Nx Monorepo

### 8.1 Library taxonomy

```text
apps/
  operator-a-shell/
  operator-b-shell/
libs/
  ui/              → presentational (GameCard, OddsRow, Button)
  feature-lobby/   → smart containers (GameCatalogContainer)
  data-access/     → API services, DTOs, mappers
  util/            → formatters (currency, odds display)
  theme/           → CSS variables, design tokens per brand
```

### 8.2 Nx boundary rules

```json
// eslint boundary tags
// feature-lobby → can import data-access, ui, util
// ui → can import util only (no API calls in presentational components)
```

**Interview answer:** "UI libs are dumb — inputs/outputs only. Data-access owns HTTP. Feature libs compose them. Boundaries enforced by ESLint, not convention."

### 8.3 Multi-brand theming

```typescript
// theme.config.ts per operator
export const operatorATheme = {
  '--color-primary': '#e11d48',
  '--font-display': 'Inter, sans-serif',
  '--logo-url': '/assets/operator-a/logo.svg',
};

// Applied at bootstrap
document.documentElement.style.setProperty('--color-primary', theme['--color-primary']);
```

**Alternatives to discuss:**
- CSS variables (runtime switch, one build)
- Separate shell apps per brand (separate builds, stricter isolation)
- Tailwind with per-brand preset configs

**Your hook:** Nx web/mobile adapters — same data-access lib, different UI shells.

---

## 9. Testing Strategy

### 9.1 Testing pyramid for iGaming frontend

| Level | What to test | Examples |
|---|---|---|
| **Unit** | Services, pipes, RxJS logic, mappers | Odds formatter, `mergeOdds()`, error mapper |
| **Component** | UI states, form validation | Deposit form disabled states, empty lobby |
| **Integration** | HTTP mocking | `HttpClientTestingModule` + wallet API |
| **E2E (selective)** | Critical money paths | Login → deposit → launch game → logout |

### 9.2 Test a RxJS odds facade

```typescript
it('batches rapid odds updates', fakeAsync(() => {
  const results: OddsMap[] = [];
  facade.displayOdds$.subscribe(v => results.push(v));

  raw$.next({ id: '1', price: 1.5 });
  raw$.next({ id: '1', price: 1.6 });
  tick(100);

  expect(results.length).toBe(1);
  expect(results[0]['1'].price).toBe(1.6);
}));
```

### 9.3 What to test for compliance UX

- Guard redirects self-excluded user
- Deposit button disabled when limit reached (from server state)
- Session timer modal appears at threshold
- No bet submit when balance insufficient (UI + server validation)

**Senior stance:** "E2E on every slot game is impossible. Unit-test business logic, component-test state matrices, E2E only on money and compliance paths."

---

## 10. Security & OAuth2

### 10.1 OAuth2 / OIDC flow (Angular SPA)

```text
User → Login redirect → IdP (BankID/OAuth) → Callback with code
     → Backend exchanges code for tokens → Frontend gets session cookie or BFF tokens
```

**Senior points:**
- Prefer **BFF pattern** or **HttpOnly cookies** over long-lived tokens in `localStorage`.
- **PKCE** for public clients.
- **Refresh token rotation** handled server-side.
- Angular `authGuard` checks session; never trust JWT claims for **balance or limits**.

### 10.2 XSS & dynamic content

- Angular sanitizes by default — avoid `bypassSecurityTrustHtml` for CMS promo HTML unless server sanitizes.
- **CSP headers** — restrict script sources; critical when embedding game iFrames.

### 10.3 iFrame / game provider security

```typescript
// Validate message origin before acting on postMessage
window.addEventListener('message', (event) => {
  if (event.origin !== TRUSTED_GAME_ORIGIN) return;
  if (event.data.type === 'GAME_EXIT') this.router.navigate(['/lobby']);
});
```

- Whitelist game provider origins.
- Never pass auth tokens into iFrame URL query params.
- Use short-lived **game session tokens** from backend.

### 10.4 OWASP frontend checklist

| Risk | Mitigation |
|---|---|
| XSS | Default sanitization; CSP |
| CSRF | SameSite cookies; anti-CSRF tokens on mutating requests |
| Sensitive data exposure | No PII in logs/analytics; mask account numbers |
| Auth failures | Generic error messages; rate-limit login UI feedback |

---

## 11. SEO, SSR & Public Pages

IGS posting mentions **SEO** — applies to **marketing/CMS pages**, not authenticated lobby.

| Page type | Strategy |
|---|---|
| Landing / promo / blog | **SSR or prerender** (Angular SSR), meta tags, structured data |
| Game lobby (auth) | CSR fine; SEO irrelevant |
| Sitemap / robots | Public routes only |

**Q: How would you add SEO to an Angular iGaming marketing site?**

> Prerender or SSR public routes. Per-route `Title` and `Meta` services. Semantic HTML (`h1`, `article`). Lazy-load heavy JS below fold. Core Web Vitals — LCP on hero image via `NgOptimizedImage`. Hreflang if multi-market. Analytics via GTM with consent banner (GDPR).

---

## 12. iGaming Technical Scenarios

### 12.1 Game launch flow

```text
1. User clicks game tile
2. Frontend → POST /games/launch { gameId } (+ auth header)
3. Backend → aggregator API → returns { launchUrl, sessionToken, expiresAt }
4. Frontend → navigate to /play/:id OR open iFrame with launchUrl
5. Loading / error / timeout states throughout
6. On exit → POST /games/session/end → return to lobby
```

**Frontend responsibilities:**
- Disable double-click launch (`exhaustMap`)
- Loading skeleton while launch URL pending
- iFrame sandbox attributes (`allow-scripts allow-same-origin`)
- Handle session expiry — prompt re-auth or return to lobby
- Mobile: full-screen mode, orientation lock optional

---

### 12.2 Wallet & deposit flow

```text
Select amount → Client validation (min/max/format)
             → POST /deposit (Idempotency-Key)
             → Redirect to PSP (Trustly, card) OR embedded flow
             → Return URL callback
             → Poll GET /deposit/{id}/status OR WebSocket balance update
             → Show confirmed balance from server
```

**Never:** Optimistically add deposit amount to displayed balance before server confirmation.

---

### 12.3 Spelpaus (Sweden self-exclusion) integration

```typescript
@Injectable({ providedIn: 'root' })
export class SpelpausGuard implements CanActivate {
  private api = inject(ComplianceApi);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.api.checkSpelpaus().pipe(
      map(result =>
        result.isExcluded
          ? this.router.createUrlTree(['/self-excluded'])
          : true,
      ),
      catchError(() => of(this.router.createUrlTree(['/compliance-error']))),
    );
  }
}
```

**Rules:**
- Check on **login** and **registration** (login API).
- Separate **marketing API** check before promo emails — backend concern, but UI must not offer promos to excluded users.
- Fail **closed** — if API down, block gambling routes.

---

### 12.4 Responsible gambling UI

| Feature | Frontend behavior | Source of truth |
|---|---|---|
| Deposit limit | Show limit, remaining, block over-limit submit | Server |
| Session timer | Modal at 60/30/0 min; non-dismissable at hard limit | Server config |
| Reality check | Overlay with time spent + net result | Server push or poll |
| Self-exclusion link | Prominent link to Spelpaus.se | Static + compliance review |

---

### 12.5 Bet slip state management

```typescript
@Injectable()
export class BetSlipStore {
  private selections = signal<Selection[]>([]);
  readonly totalStake = computed(() =>
    this.selections().reduce((sum, s) => sum + s.stake, 0),
  );
  readonly potentialReturn = computed(() =>
    this.selections().reduce((sum, s) => sum + s.stake * s.odds, 0),
  );

  add(selection: Selection) {
    this.selections.update(list => [...list, selection]);
  }

  remove(id: string) {
    this.selections.update(list => list.filter(s => s.id !== id));
  }
}
```

Discuss: signal store vs NgRx — for bet slip, **local/feature-scoped service with signals** is enough; NgRx if time-travel debugging or cross-tab sync needed.

---

## 13. System Design Exercises

### 13.1 "Design a white-label casino lobby"

**Requirements:** 3 operators, 2000+ games, search/filter, favorites, mobile-first, fast first paint.

**Proposed answer:**

1. **Nx monorepo** — `shell-operator-{a,b,c}` apps + shared `ui`, `data-access-games`, `feature-lobby`.
2. **Theming** — CSS variables loaded per shell at bootstrap; optional Tailwind preset per brand.
3. **Data** — `GET /games?category&search&page` with virtual scroll; cache with stale-while-revalidate.
4. **Routing** — lazy `feature-lobby`; game tiles use intersection observer for lazy image load.
5. **Favorites** — optimistic UI with server sync; rollback on error.
6. **Launch** — separate lazy `feature-game-play` route with iFrame host component.
7. **CI** — bundle budget per shell; Lighthouse on marketing pages.

---

### 13.2 "Design real-time sportsbook odds UI"

1. Single WebSocket connection per tab (`shareReplay`).
2. `bufferTime(100ms)` before state merge.
3. Component tree: `League → Event → Market → Selection` all OnPush.
4. Highlight price changes (flash green/red 300ms) — CSS class, not re-mount.
5. Disconnect/reconnect with exponential backoff; show connection badge.
6. Separate **bet slip** state from odds display — slip uses latest odds at submit time (server validates).

---

### 13.3 "Design shared component library for iGaming"

1. **Presentational only** in `libs/ui` — Storybook with brand theme toolbar.
2. **Accessibility** — WCAG 2.1 AA; keyboard nav for bet slip; focus trap in modals.
3. **Versioning** — semver; breaking changes documented; consumers pin in Nx.
4. **Testing** — visual regression (optional); unit tests on inputs/outputs.
5. **No business logic** in UI lib — odds formatting in `util`, not in `GameCard`.

---

## 14. Live Coding Practice Problems

Practice these in 30–40 min each on [StackBlitz Angular](https://stackblitz.com/) or local IDE.

### Problem 1 — Game search with debounce

> Build a `GameSearchComponent`: input debounced 300ms, calls API, shows loading/error/empty/results.

**Key points:** `switchMap`, `catchError`, `debounceTime`, unsubscribe, trackBy.

---

### Problem 2 — Odds display with batching

> Given a `Subject<OddsUpdate>`, expose `displayOdds$` that batches updates every 100ms.

**Key points:** `bufferTime`, `scan`, immutable merge.

---

### Problem 3 — Deposit form

> Reactive form: amount (required, min 100, max from server), method select, submit disabled while pending, show server errors.

**Key points:** validators, async max from API, `exhaustMap` on submit.

---

### Problem 4 — Auth guard + redirect

> Implement `canActivate` that checks `AuthService.isLoggedIn()`; redirect to `/login?returnUrl=...`.

---

### Problem 5 — Simple bet slip

> Add/remove selections; computed total stake; prevent duplicate game IDs.

**Key points:** signals or reactive approach, immutability.

---

## 15. Code Review Scenarios

### 15.1 Leaky subscription

```typescript
// ❌ FIND THE BUG
ngOnInit() {
  this.oddsService.stream().subscribe(o => this.odds = o);
}
```

**Fix:** `takeUntilDestroyed()`, `async` pipe, or `DestroyRef.onDestroy`.

---

### 15.2 Mutating state breaks OnPush

```typescript
// ❌
this.games.push(newGame);

// ✅
this.games = [...this.games, newGame];
// or signal: this.games.update(list => [...list, newGame]);
```

---

### 15.3 Trusting client balance

```typescript
// ❌
onDepositSuccess(amount: number) {
  this.balance += amount;
}

// ✅
onDepositSuccess() {
  this.walletApi.getBalance().subscribe(b => this.balance.set(b.available));
}
```

---

### 15.4 Missing iFrame origin check

Flag any `window.addEventListener('message', ...)` without `event.origin` validation.

---

### 15.5 How to deliver a code review verbally

Structure: **praise → issue → reason → suggestion → offer to pair**.

> "Nice extraction of the API mapper. One concern: this subscribe in the component will leak on navigation — I'd use `takeUntilDestroyed` here because lobby users switch routes often. Happy to show an example after the review."

---

## 16. Map Your Resume to Technical Answers

| They ask about… | Lead with… | Technical detail |
|---|---|---|
| Shared libraries | Shipment Company Nx monorepo | Feature/ui/data-access split, boundary tags, adapters |
| Performance | 14% TTI optimization | Lazy routes, splitChunks, bundle budgets, OnPush |
| Real-time UI | Supply Chain Dashboard | WebSocket, `auditTime`, virtual scroll, connection state |
| Payments / money | Insurance Stripe integration | Idempotency, reconciliation, E2E success/failure |
| REST APIs | NestJS collaboration | DTO mapping, error states, pagination |
| Testing | Ergonized Playwright E2E | Critical path coverage, regression on bug fixes |
| Multi-surface | Web + Android shared lib | Adapters, presentation vs feature libs |

---

## 17. Questions to Ask Interviewers

1. *"What's the current Angular version and are you on standalone components or migrating?"*
2. *"Monorepo with Nx, or single-app structure?"*
3. *"How do you integrate games — aggregator API, direct iFrame, or both?"*
4. *"Real-time data — WebSocket, SSE, or polling?"*
5. *"Multi-brand: one codebase with theming or separate apps per operator?"*
6. *"Where does SSR/prerender sit — marketing site only or broader?"*
7. *"Testing expectations — unit coverage targets, E2E tooling?"*
8. *"How does frontend consume Kafka-backed events — via REST poll, WebSocket gateway, or SSE?"*

---

## 18. Pre-Interview Checklist

- [ ] Re-read [HR prep Section 12 — iGaming context](./igs-sweden-senior-frontend-developer-hr-prep.md#12-igaming--gambling-provider-context)
- [ ] Review **change detection, OnPush, signals vs RxJS** (Section 3)
- [ ] Practice **one live coding problem** (Section 14) out loud
- [ ] Prepare **14% performance story** with numbers (Section 7.3)
- [ ] Prepare **WebSocket batching story** from Supply Chain project (Section 4.1)
- [ ] Prepare **Stripe/idempotency story** for wallet questions (Section 6.4)
- [ ] Skim **Spelpaus + responsible gambling** frontend rules (Section 12.3–12.4)
- [ ] Review **one system design** — white-label lobby (Section 13.1)
- [ ] Have **StackBlitz / local Angular** ready if remote live coding
- [ ] Prepare **3 questions** for interviewers (Section 17)

**Related docs in this repo:**

| Doc | Use for |
|---|---|
| [HR prep guide](./igs-sweden-senior-frontend-developer-hr-prep.md) | Motivation, logistics, project scripts |
| [Senior Angular questions](../Angular/comprehensive_senior_angular_questions_with_links.md) | Deep Angular Q&A |
| [Angular memory leaks](../Angular/angular-memory-leaks-guide.md) | Leak detection & fixes |
| [Nx monorepo roadmap](../web+front/nx-monorepo-roadmap-junior-to-senior.md) | Monorepo architecture |
| [Angular roadmap](../web+front/angular-roadmap-junior-to-senior.md) | Broader Angular topics |
| [Top 20 senior JS questions](../js/top-20-senior-javascript-questions-2026.md) | JS fundamentals |

---

## Quick Reference — Top 20 Technical Questions

| # | Question | Section |
|---|---|---|
| 1 | Change detection & OnPush | [3.1](#31-change-detection--must-know-cold) |
| 2 | Signals vs RxJS | [3.3](#33-signals-vs-rxjs--when-to-use-which) |
| 3 | Memory leaks in long sessions | [3.7](#37-memory-leaks--igaming-apps-run-for-hours) |
| 4 | Lazy loading & route guards | [3.5](#35-routing--guards) |
| 5 | RxJS batching for odds | [4.1](#41-sportsbook-odds-stream--canonical-igaming-problem) |
| 6 | switchMap vs exhaustMap | [4.2](#42-switchmap-vs-mergemap-vs-exhaustmap) |
| 7 | REST error handling | [6.2](#62-error-mapping) |
| 8 | Idempotency for deposits | [6.4](#64-idempotency-keys-deposits--bets) |
| 9 | Bundle optimization | [7.1](#71-load-performance-checklist) |
| 10 | Nx library boundaries | [8.2](#82-nx-boundary-rules) |
| 11 | Multi-brand theming | [8.3](#83-multi-brand-theming) |
| 12 | Testing money paths | [9.1](#91-testing-pyramid-for-igaming-frontend) |
| 13 | OAuth2 / session security | [10.1](#101-oauth2--oidc-flow-angular-spa) |
| 14 | iFrame game security | [10.3](#103-iframe--game-provider-security) |
| 15 | SSR for marketing SEO | [11](#11-seo-ssr--public-pages) |
| 16 | Game launch flow | [12.1](#121-game-launch-flow) |
| 17 | Spelpaus guard | [12.3](#123-spelpaus-sweden-self-exclusion-integration) |
| 18 | Design white-label lobby | [13.1](#131-design-a-white-label-casino-lobby) |
| 19 | Design odds UI | [13.2](#132-design-real-time-sportsbook-odds-ui) |
| 20 | Code review leak | [15.1](#151-leaky-subscription) |

---

*Last updated: August 2026. Pair with the [HR prep guide](./igs-sweden-senior-frontend-developer-hr-prep.md) for the full interview process.*
