# Mock Case Study — Game Lobby (90 min)

> **Simulates:** Frontend Chapter case study · Angular · GitLab · 2.5 h format  
> **Your role:** Senior Frontend Developer candidate  
> **Work time:** 90 minutes (presentation debrief separate)

---

## Panel intro (read this, then start the timer)

> "Welcome. We're three frontend engineers from the chapter. Today you'll build a small **Game Lobby** feature — the kind of screen players see before launching a casino game.
>
> We've pushed a starter repo to GitLab. You have **90 minutes** of independent work, then **30 minutes** to present. You can ask us questions anytime during the work block.
>
> We're **not** grading pixel-perfect design or 100% test coverage. We want to see how you **clarify requirements**, **structure Angular code**, handle **async data**, and **communicate trade-offs**.
>
> Good luck — start when you're ready."

---

## Starter repo (simulate locally)

```bash
# Option A — fresh project
ng new game-lobby-case-study --routing --style=css --ssr=false
cd game-lobby-case-study

# Option B — reuse your practice repo
cd rxjs-multi-timer-test   # replace app content; keep toolchain
```

Create branch: `feature/game-lobby`

---

## Requirements

### User story

> As a **player**, I want to **browse available games**, **filter and search**, and **see game details** before launching, so I can find something I want to play quickly.

### Functional — MVP (must have for presentation)

| # | Requirement | Notes |
|---|---|---|
| F1 | Display games in a **grid or list** | Thumbnail, title, provider, category |
| F2 | **Search** by game title (case-insensitive) | Debounce optional but appreciated |
| F3 | **Filter** by at least one dimension | Category *or* provider (both = stretch) |
| F4 | **Loading**, **error**, and **empty** states | User must never see a blank screen |
| F5 | Click a game → **detail view** | Route or modal — your choice; explain why |
| F6 | **Launch** action on detail | Can be a stub (`console.log` or toast) |

### Non-functional (senior signals)

| # | Expectation |
|---|---|
| N1 | Sensible **folder structure** (feature / ui / data-access or equivalent) |
| N2 | **Typed** models — no `any` on API data |
| N3 | Data fetching in a **service**, not bloated components |
| N4 | **No subscription leaks** — `async` pipe, `takeUntilDestroyed`, or signals |
| N5 | At least **2–3 commits** with clear messages |
| N6 | Short **README**: how to run, assumptions, "next steps" |

### Stretch (only if MVP is solid)

- [ ] Favorites (localStorage or in-memory signal store)
- [ ] Sort (A–Z, provider)
- [ ] `OnPush` on list items
- [ ] One unit test (service filter logic or component)
- [ ] Simulated **slow network** (delay in service)
- [ ] Accessibility: keyboard focus on cards, `aria-label` on search

### Out of scope (don't spend time here)

- Real authentication
- Real game iFrame integration
- NgRx / full state management library
- E2E tests
- Custom design system / animations

---

## Mock API

No real backend. Implement `GameCatalogService` that returns this data (copy to `assets/games.json` or inline in service with `of(...).pipe(delay(800))`).

```json
[
  {
    "id": "g1",
    "title": "Starburst",
    "provider": "NetEnt",
    "category": "slots",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Starburst",
    "rtp": 96.1,
    "isNew": false
  },
  {
    "id": "g2",
    "title": "Book of Dead",
    "provider": "Play'n GO",
    "category": "slots",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Book+of+Dead",
    "rtp": 96.2,
    "isNew": false
  },
  {
    "id": "g3",
    "title": "Lightning Roulette",
    "provider": "Evolution",
    "category": "live-casino",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Lightning+Roulette",
    "rtp": 97.3,
    "isNew": true
  },
  {
    "id": "g4",
    "title": "Gonzo's Quest",
    "provider": "NetEnt",
    "category": "slots",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Gonzo",
    "rtp": 95.8,
    "isNew": false
  },
  {
    "id": "g5",
    "title": "Blackjack Classic",
    "provider": "Evolution",
    "category": "table-games",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Blackjack",
    "rtp": 99.5,
    "isNew": false
  },
  {
    "id": "g6",
    "title": "Mega Moolah",
    "provider": "Microgaming",
    "category": "jackpots",
    "thumbnailUrl": "https://placehold.co/200x120/1a1a2e/eee?text=Mega+Moolah",
    "rtp": 88.1,
    "isNew": false
  }
]
```

**Categories for filter chips:** `slots`, `live-casino`, `table-games`, `jackpots`

**Error simulation tip:** add `?fail=true` query param or a dev toggle that makes the service throw.

---

## Clarification questions (ask these in the first 5 min)

Practice saying these out loud before coding:

1. *"For detail view — modal or dedicated route? I'll default to route for deep-linking unless you prefer modal."*
2. *"Is local mock JSON acceptable, or should I simulate HTTP with `HttpClient`?"* → **Answer: HttpClient + JSON asset is preferred**
3. *"Launch game — stub is fine?"* → **Yes**
4. *"Mobile-responsive required?"* → **Basic responsive is enough; desktop-first OK**
5. *"Filter: one active category or multi-select?"* → **Single category filter is enough for MVP**

---

## Suggested architecture

```text
src/app/
  game-lobby/
    models/
      game.model.ts
    services/
      game-catalog.service.ts
    components/
      game-card/              # presentational
      game-filters/           # search + category chips
      game-detail/
    pages/
      lobby-page/
    game-lobby.routes.ts
```

**Data flow:**

```text
LobbyPage → GameCatalogService.getGames() → signal/computed for filtered list
         → GameFiltersComponent (outputs: search, category)
         → GameCardComponent[] 
         → route /games/:id → GameDetailComponent → launchGame()
```

---

## 90-minute time checkpoints

| Elapsed | You should have… |
|---|---|
| **15 min** | Project boots, models, service returning mock data, empty lobby shell |
| **30 min** | Games visible in list/grid |
| **45 min** | Search + filter working |
| **60 min** | Detail view + launch stub |
| **75 min** | Loading / error / empty states |
| **85 min** | README, commits pushed, quick demo rehearsal |
| **90 min** | Stop coding — prepare presentation |

---

## GitLab workflow (simulate)

```bash
git checkout -b feature/game-lobby
git add -A && git commit -m "feat: add game models and catalog service"
# ... more commits ...
git push -u origin feature/game-lobby
# Open MR: "feat: game lobby MVP"
```

**Good commit messages for this task:**
- `feat: add game catalog service with HttpClient`
- `feat: lobby page with search and category filter`
- `feat: game detail route and launch stub`
- `fix: empty state when filter matches nothing`

---

## Presentation script (30 min — use after coding)

### 1. Problem recap (1 min)

> "I built a game lobby where players browse, search, filter by category, open details, and trigger a launch action."

### 2. Architecture (3 min)

Show folder tree. Explain smart vs presentational split.

### 3. Live demo (7 min)

1. Loading state (refresh with network throttle if you added delay)
2. Search "book" → one result
3. Filter `live-casino`
4. Open detail → Launch
5. Break filter → empty state
6. (Optional) trigger error state

### 4. Trade-offs (3 min)

| Decision | Why |
|---|---|
| Route vs modal for detail | Deep links, browser back |
| Signals vs RxJS | Signals for UI filter state; Observable from HTTP |
| No NgRx | Scope fits service + computed signal |
| Stub launch | Real iFrame needs provider contract + origin checks |

### 5. If I had more time (2 min)

- Favorites, unit tests, virtual scroll for 500+ games, Spelpaus guard integration

### 6. Q&A — panel may ask

- "How would you swap mock JSON for a real REST API?"
- "How would odds or jackpot values update in real time?"
- "How do you prevent memory leaks if user navigates away during loading?"
- "How would you structure this in an Nx monorepo for multiple brands?"

---

## Self-evaluation rubric (score yourself 1–5)

| Area | 1 | 3 | 5 |
|---|---|---|---|
| **Requirements** | MVP incomplete | MVP done | MVP + stretch |
| **Angular structure** | Everything in one component | Service + components | Clear smart/dumb split |
| **Async / RxJS** | Leaks or nested subscribes | async pipe or takeUntilDestroyed | Signals + clean HTTP |
| **UX states** | Missing loading/error | Loading + one edge case | All three polished |
| **Communication** | Can't explain choices | Explains main decisions | Trade-offs + iGaming context |
| **Git hygiene** | One big commit | 2 commits | Small, readable commits |

**Passing senior bar:** mostly 4–5, no area below 3.

---

## Model solution outline (read AFTER your attempt)

<details>
<summary>Spoiler — expand only after you finish</summary>

```typescript
// game.model.ts
export interface Game {
  id: string;
  title: string;
  provider: string;
  category: GameCategory;
  thumbnailUrl: string;
  rtp: number;
  isNew: boolean;
}
export type GameCategory = 'slots' | 'live-casino' | 'table-games' | 'jackpots';

// game-catalog.service.ts — HttpClient.get<Game[]>('assets/games.json')
// Optional: delay(800), catchError → throwError

// lobby-page — signals:
// games = toSignal(service.getGames(), { initialValue: [] });
// searchQuery = signal('');
// category = signal<GameCategory | 'all'>('all');
// filteredGames = computed(() => filter logic);

// game-card — @Input() game, @Output() selected
// OnPush, no subscriptions

// routes: '' → LobbyPage, 'games/:id' → GameDetailPage
```

**Senior talking points:**
- Filter logic in `computed()` keeps template dumb
- `HttpClient` now → swap URL later; mapper if API shape differs
- Detail resolver optional; `switchMap` on route param for reload
- Launch → postMessage to iFrame with origin check in production

</details>

---

*Pair with [IGS technical prep](./igs-sweden-senior-frontend-developer-technical-prep.md) Sections 3, 4, 12.*
