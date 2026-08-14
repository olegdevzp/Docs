# Mock Case Study — Bet Slip with Live Odds (90 min)

> **Simulates:** Frontend Chapter case study · Angular · GitLab · 2.5 h format  
> **Your role:** Senior Frontend Developer candidate  
> **Work time:** 90 minutes (presentation debrief separate)  
> **Complements:** [Game Lobby mock](./mock-case-study-game-lobby-90min.md) — that one drilled lists/filters/detail; this one drills **real-time RxJS** and **reactive forms**.

---

## Panel intro (read this, then start the timer)

> "Welcome back. Today you'll build a small **Bet Slip** — the panel where a sportsbook player reviews selections, enters stakes, and places a bet while **odds keep changing in real time**.
>
> There's no real backend. We'll give you a mock odds feed contract — you simulate it with RxJS. You have **90 minutes** of independent work, then **30 minutes** to present.
>
> We're most interested in how you handle **streams that outlive user actions**, **form state vs server state**, and the UX of **data changing under the user's feet**. Pixel-perfection doesn't matter.
>
> Start when you're ready."

---

## Starter repo (simulate locally)

```bash
# Option A — fresh project
ng new betslip-case-study --routing --style=css --ssr=false
cd betslip-case-study

# Option B — reuse your practice repo
cd rxjs-multi-timer-test   # replace app content; keep toolchain
```

Create branch: `feature/bet-slip`

---

## Requirements

### User story

> As a **player**, I want to **add selections to a bet slip**, **enter stakes**, and **place a bet**, and I want to be **clearly warned when odds change** before I confirm, so I never bet at odds I didn't agree to.

### Functional — MVP (must have for presentation)

| # | Requirement | Notes |
|---|---|---|
| F1 | Show a list of **available events/markets** (mock) with current odds | Simple list is fine — this is not the lobby exercise |
| F2 | **Add / remove selections** to the bet slip (max 5) | Adding same market twice replaces the selection |
| F3 | **Live odds updates** — odds on the list *and* in the slip tick every 2–5 s | Simulated stream, see contract below |
| F4 | **Stake input per selection** + total stake and **potential payout** | Payout = Σ(stake × odds); recompute live |
| F5 | **Odds-change guard:** if odds changed since the selection was added, highlight it and require **"Accept new odds"** before Place Bet enables | The core UX challenge |
| F6 | **Place Bet** → simulated async call (1 s delay, ~20 % random failure) with loading / success / error states | On success, clear slip |

### Validation rules (reactive forms territory)

- Stake: required, numeric, **min 5 SEK**, **max 10 000 SEK** per selection
- Total stake across slip: **max 20 000 SEK** (cross-field / form-level validator)
- Place Bet disabled while: any invalid stake, empty slip, pending odds acceptance, or request in flight

### Non-functional (senior signals)

| # | Expectation |
|---|---|
| N1 | Odds feed lives in a **service**, exposed as one shared stream (`shareReplay` / signal) — not one interval per component |
| N2 | **No leaks**: streams stop when slip/component is destroyed; prove it in the presentation |
| N3 | **Typed** models — selections, odds updates, bet request/response |
| N4 | Clear separation: **server state** (odds) vs **form state** (stakes) vs **derived state** (payout) |
| N5 | 2–3+ commits with clear messages |
| N6 | Short README: run instructions, assumptions, next steps |

### Stretch (only if MVP is solid)

- [ ] Odds direction indicator (▲ green / ▼ red, fades after 2 s)
- [ ] `debounceTime` on stake input before recomputing payout
- [ ] "Odds format" toggle: decimal ↔ fractional (pure pipe or computed)
- [ ] One unit test: payout calculation or the odds-change guard logic
- [ ] Retry with backoff on bet placement failure (`retry({ count: 2, delay })`)
- [ ] Accessibility: `aria-live="polite"` on odds changes, labels on stake inputs

### Out of scope (don't spend time here)

- Real WebSocket / backend
- Authentication, wallet balance
- NgRx / state library
- Multi-leg accumulator (combo) odds math — singles only
- E2E tests

---

## Mock odds feed contract

Implement `OddsFeedService`. No backend — generate updates with RxJS.

```typescript
export interface MarketSelection {
  marketId: string;      // e.g. 'm1'
  eventName: string;     // 'Malmö FF vs AIK'
  selectionName: string; // 'Home Win'
  odds: number;          // decimal, e.g. 2.35
}

export interface OddsUpdate {
  marketId: string;
  odds: number;          // new decimal odds
  timestamp: number;
}
```

**Seed data (put in the service):**

```typescript
const SEED: MarketSelection[] = [
  { marketId: 'm1', eventName: 'Malmö FF vs AIK',        selectionName: 'Home Win',   odds: 2.35 },
  { marketId: 'm2', eventName: 'Malmö FF vs AIK',        selectionName: 'Draw',       odds: 3.10 },
  { marketId: 'm3', eventName: 'Malmö FF vs AIK',        selectionName: 'Away Win',   odds: 2.90 },
  { marketId: 'm4', eventName: 'Hammarby vs Djurgården', selectionName: 'Home Win',   odds: 1.85 },
  { marketId: 'm5', eventName: 'Hammarby vs Djurgården', selectionName: 'Over 2.5',   odds: 1.95 },
  { marketId: 'm6', eventName: 'Frölunda vs Färjestad',  selectionName: 'Home Win',   odds: 2.10 },
];
```

**Feed behaviour to simulate:**

- Every **2–5 s** (randomized), pick a random market and nudge odds by **±5–10 %** (round to 2 decimals, clamp to min 1.01).
- Expose:
  - `getMarkets(): Observable<MarketSelection[]>` (or a signal) — current snapshot, updated live
  - `oddsUpdates$: Observable<OddsUpdate>` — the raw tick stream (useful for the change guard)
- One underlying interval shared by all consumers (`shareReplay(1)` on the snapshot, `share()` on ticks).

**Bet placement mock:**

```typescript
placeBet(req: BetRequest): Observable<BetResponse> {
  // delay(1000), then ~20 % of the time throwError(() => new Error('Bet rejected: odds changed'))
}
```

---

## Clarification questions (ask these in the first 5 min)

Practice saying these out loud:

1. *"Singles only, or do I need accumulator odds math?"* → **Singles only**
2. *"When odds change on a selection in the slip — freeze the old odds until the user accepts, or auto-update?"* → **Freeze + explicit accept (F5)**
3. *"Should the events list and the slip be separate routes or one screen?"* → **One screen, two panels is fine**
4. *"Currency formatting — real i18n or just 'SEK' suffix?"* → **Suffix is fine**
5. *"Is signals + RxJS mix OK, or do you prefer pure RxJS?"* → **Your choice — explain it**

---

## Suggested architecture

```text
src/app/
  betting/
    models/
      market.model.ts        # MarketSelection, OddsUpdate, BetRequest/Response
    services/
      odds-feed.service.ts   # shared stream, seed data, placeBet
      bet-slip.store.ts      # selections, accepted odds, derived payout (signals)
    components/
      market-list/           # available markets, live odds, "Add" buttons
      bet-slip/              # form array of stakes, odds-change banners, Place Bet
      selection-row/         # presentational: one slip row
    pages/
      betting-page/
```

**The key data-flow decision (be ready to defend it):**

```text
OddsFeedService (one shared tick stream)
   ├→ market-list renders live odds
   └→ bet-slip.store compares tick.marketId against slip selections:
        selection.acceptedOdds ≠ currentOdds → mark "odds changed"
Form (stakes) stays in a FormArray / signal — never mixed into the feed stream
Payout = computed(selections, stakes) — derived, never stored
```

---

## 90-minute time checkpoints

| Elapsed | You should have… |
|---|---|
| **10 min** | Project boots, models defined, `OddsFeedService` emitting fake ticks (verify with console.log) |
| **25 min** | Market list rendering with live-updating odds |
| **40 min** | Add/remove to slip working; stake inputs with validation |
| **55 min** | Payout computing live; odds-change detection + accept flow |
| **70 min** | Place Bet with loading/success/error; slip clears on success |
| **85 min** | README, commits, leak check (open DevTools, destroy component, confirm ticks stop) |
| **90 min** | Stop coding — prepare presentation |

**Triage rule:** if you're behind at 55 min, cut F6 to a `console.log` stub and keep F5 — the odds-change guard is the differentiator; a fake submit is not.

---

## GitLab workflow (simulate)

```bash
git checkout -b feature/bet-slip
git add -A && git commit -m "feat: odds feed service with simulated live ticks"
# ... more commits ...
git push -u origin feature/bet-slip
# Open MR: "feat: bet slip with live odds MVP"
```

**Good commit messages for this task:**

- `feat: odds feed service with shared simulated tick stream`
- `feat: market list with live odds display`
- `feat: bet slip with stake validation and payout calc`
- `feat: odds-change guard requiring explicit acceptance`
- `feat: bet placement with loading and error states`

---

## Presentation script (30 min — use after coding)

### 1. Problem recap (1 min)

> "I built a bet slip against a simulated live odds feed. The core challenge is that server state changes underneath user input — I never place a bet at odds the user didn't explicitly see and accept."

### 2. Architecture (3 min)

Show the folder tree. Emphasize: **one shared feed stream**, slip store separate from the form, payout as derived state.

### 3. Live demo (7 min)

1. Odds ticking on the market list
2. Add 2–3 selections, enter stakes → payout updates
3. Invalid stake (3 SEK) → validation message, button disabled
4. Wait for an odds change on a slip selection → banner → Accept → button re-enables
5. Place Bet → loading → success (or retry on the random failure)
6. **Leak proof:** navigate away / destroy the slip, show ticks stop (console or Angular DevTools)

### 4. Trade-offs (3 min)

| Decision | Why |
|---|---|
| Freeze odds until accepted vs auto-update | Regulatory/UX: user must consent to worse odds; auto-update risks accidental bets |
| One shared stream + `shareReplay` | N intervals for N subscribers = drift and waste; single source of truth |
| Signals for slip state, RxJS for the feed | Feed is inherently push/time-based → RxJS; UI state and derivations → signals `computed` |
| FormArray vs per-row `ngModel` | Cross-field total-stake validator needs form-level access |
| No NgRx | One feature, one store service — a library adds ceremony without payoff |

### 5. If I had more time (2 min)

- Real WebSocket with reconnect/backoff and `bufferTime` batching for burst updates
- Optimistic UI on placement with server reconciliation
- Accumulator odds math, wallet balance check, Spelpaus/RG limits before placement

### 6. Q&A — panel may ask

- "Your feed ticks 10×/sec in production — how do you stop change detection melting down?" (batch with `bufferTime` / `auditTime`, OnPush, update only changed rows, `runOutsideAngular` for the socket)
- "What happens if the bet request succeeds on the server but the response is lost?" (idempotency key on `BetRequest`)
- "How do you test the odds-change guard?" (marble test or `TestScheduler`; pure function `hasOddsChanged(selection, currentOdds)` tested directly)
- "Why not put stakes in the same store as odds?" (form state is transient and user-owned; mixing causes cursor jumps and lost input on ticks)
- "How would you share the slip between sportsbook and a mini-slip widget in the header?" (store service at root / Nx data-access lib)

---

## Self-evaluation rubric (score yourself 1–5)

| Area | 1 | 3 | 5 |
|---|---|---|---|
| **Real-time handling** | New interval per component / leaks | One shared stream, cleaned up | Shared stream + batching awareness + leak proof in demo |
| **Odds-change UX (F5)** | Odds silently auto-update | Change detected and highlighted | Freeze + explicit accept + Place Bet gating |
| **Forms** | `ngModel` soup, no validation | Reactive form with per-field validators | + cross-field total validator, clean error UX |
| **State separation** | Everything in component fields | Service holds odds, form holds stakes | Server / form / derived state clearly separated and explained |
| **Async submit** | No loading/error states | Loading + error handled | + disabled-while-pending, retry or idempotency discussion |
| **Communication** | Can't explain choices | Explains main decisions | Trade-offs framed in iGaming/regulatory context |

**Passing senior bar:** mostly 4–5, no area below 3. **F5 below 3 = fail** — it is the exercise.

---

## Model solution outline (read AFTER your attempt)

<details>
<summary>Spoiler — expand only after you finish</summary>

```typescript
// odds-feed.service.ts
@Injectable({ providedIn: 'root' })
export class OddsFeedService {
  private readonly marketsSubject = new BehaviorSubject<MarketSelection[]>(SEED);

  readonly oddsUpdates$ = timer(2000, 0).pipe(
    // randomized cadence: expand/concatMap over timer(rand(2000, 5000))
    switchMap(() => timer(2000 + Math.random() * 3000)),
    repeat(),
    map(() => this.nudgeRandomMarket()),
    share(),
  );

  readonly markets$ = this.marketsSubject.pipe(shareReplay(1));

  private nudgeRandomMarket(): OddsUpdate {
    const markets = this.marketsSubject.value;
    const m = markets[Math.floor(Math.random() * markets.length)];
    const factor = 1 + (Math.random() * 0.1 - 0.05) * 2;   // ±5–10 %
    const odds = Math.max(1.01, Math.round(m.odds * factor * 100) / 100);
    this.marketsSubject.next(
      markets.map(x => x.marketId === m.marketId ? { ...x, odds } : x),
    );
    return { marketId: m.marketId, odds, timestamp: Date.now() };
  }

  placeBet(req: BetRequest): Observable<BetResponse> {
    return timer(1000).pipe(
      map(() => {
        if (Math.random() < 0.2) throw new Error('Bet rejected: odds changed');
        return { betId: crypto.randomUUID(), status: 'accepted' as const };
      }),
    );
  }
}

// bet-slip.store.ts (signals)
// selections = signal<SlipSelection[]>([])
//   SlipSelection = { market: MarketSelection; acceptedOdds: number }
// currentOdds = toSignal(feed.markets$)
// changedIds = computed(() => selections where acceptedOdds !== current market odds)
// acceptNewOdds(marketId) → update acceptedOdds to current
// payout = computed(() => Σ stake(marketId) * acceptedOdds)

// bet-slip.component.ts
// FormArray of stake controls, keyed parallel to selections()
// form-level validator: totalStake <= 20_000
// placeBet(): sets pending signal, calls service, catchError → error signal
// canPlace = computed(() => form.valid && selections().length > 0
//                        && changedIds().length === 0 && !pending())
```

**Senior talking points:**

- `acceptedOdds` snapshot on the selection is the whole trick — the guard is just `acceptedOdds !== currentOdds`, a pure comparison, trivially testable.
- The feed subject lives in a root service, so nothing leaks per-component; components consuming via `toSignal`/`async` pipe unsubscribe automatically.
- Stake `FormArray` is never rebuilt on odds ticks — only odds/payout re-render — so user input is never disturbed by the stream. That's the "server state vs form state" separation in practice.
- In production: WebSocket + `retryWhen`/`repeat` reconnect, `bufferTime(250)` to coalesce bursts, idempotency key on placement.

</details>

---

*Pair with [IGS technical prep](./igs-sweden-senior-frontend-developer-technical-prep.md) Sections 4 (RxJS & Real-Time), 12 (iGaming scenarios), 14 (live coding).*
