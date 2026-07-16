# RxJS — Junior to Senior Roadmap

A learning roadmap of **RxJS** features, operators, and patterns organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Creating Observables](#l1-creating-observables)
  - [Subscribing and unsubscribing](#l1-subscribing-and-unsubscribing)
  - [Pipeable operators — basics](#l1-pipeable-operators--basics)
  - [Error handling — basics](#l1-error-handling--basics)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Transformation operators](#l2-transformation-operators)
  - [Filtering operators](#l2-filtering-operators)
  - [Combination operators](#l2-combination-operators)
  - [Error handling — intermediate](#l2-error-handling--intermediate)
  - [Subjects](#l2-subjects)
  - [Hot vs Cold Observables](#l2-hot-vs-cold-observables)
- [Level 3 — Senior](#level-3--senior)
  - [Multicasting operators](#l3-multicasting-operators)
  - [Schedulers](#l3-schedulers)
  - [Custom operators](#l3-custom-operators)
  - [Testing with TestScheduler](#l3-testing-with-testscheduler)
  - [Memory management and leak prevention](#l3-memory-management-and-leak-prevention)
  - [Higher-order Observables and flattening strategies](#l3-higher-order-observables-and-flattening-strategies)
  - [Real-world patterns](#l3-real-world-patterns)
- [Quick reference table](#quick-reference-table)
- [Tasks](#tasks)
  - [Level 1 — Junior tasks](#level-1--junior-tasks)
  - [Level 2 — Mid tasks](#level-2--mid-tasks)
  - [Level 3 — Senior tasks](#level-3--senior-tasks)
- [Answers](#answers)
  - [Answers — Junior](#answers--junior)
  - [Answers — Mid](#answers--mid)
  - [Answers — Senior](#answers--senior)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Operators marked with `*` are the most commonly encountered in day-to-day work.
- Angular-specific integrations (`AsyncPipe`, `HttpClient`) are referenced but not the primary focus — this roadmap covers raw RxJS.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single observable.

| Term | What it is |
|---|---|
| **Observable** | A lazy push-based data source. Emits zero or more values over time and then optionally completes or errors. Nothing happens until something subscribes. |
| **Observer** | An object with `next`, `error`, and `complete` callbacks that reacts to values emitted by an Observable. |
| **Subscription** | The result of calling `.subscribe()`. Represents the execution of an Observable and holds a reference you can use to cancel it. |
| **Operator** | A pure function that takes an Observable and returns a new Observable with transformed behaviour. Operators are composed with `.pipe()`. |
| **Subject** | Both an Observable and an Observer. Values pushed to a Subject are multicast to all current subscribers. |
| **Scheduler** | Controls when a subscription starts and when notifications are delivered (e.g., async, animationFrame). |
| **Marble diagram** | A visual notation for describing Observable timelines: `-` = time, values are letters, `|` = complete, `#` = error. |

> **Gotcha:** Observables are **lazy** — the function body does not run until `.subscribe()` is called. Two separate `.subscribe()` calls create two independent executions (for cold Observables).

---

### L1 Creating Observables

Creation operators produce a new Observable from a static value, iterable, promise, or event.

| Operator * | What it emits | Example |
|---|---|---|
| `of(...values)` | Each argument synchronously, then completes | `of(1, 2, 3)` |
| `from(iterable \| promise \| observable)` | Each item of an array / each resolved value of a Promise | `from([10, 20, 30])` |
| `interval(ms)` | An incrementing integer every `ms` milliseconds, forever | `interval(1000)` |
| `timer(delay, period?)` | First emission after `delay`, then optionally every `period` | `timer(2000, 500)` |
| `fromEvent(target, event)` | Each DOM or Node.js event | `fromEvent(btn, 'click')` |
| `EMPTY` | Nothing — completes immediately | `EMPTY` |
| `NEVER` | Nothing — never completes or errors | `NEVER` |
| `throwError(() => err)` | Nothing — errors immediately | `throwError(() => new Error('oops'))` |
| `defer(() => observable)` | Creates a fresh Observable for each subscriber at subscribe-time | `defer(() => of(Date.now()))` |

```ts
import { of, from, interval, timer, fromEvent } from 'rxjs';

// synchronous sequence
of(1, 2, 3).subscribe(console.log); // 1, 2, 3

// from array
from([10, 20, 30]).subscribe(console.log); // 10, 20, 30

// from Promise
from(fetch('/api/data')).subscribe(console.log);

// ticker — emits 0, 1, 2, 3 … every second
const tick$ = interval(1000);

// first emission after 3 s, then every 1 s
const delayed$ = timer(3000, 1000);

// DOM events
const clicks$ = fromEvent<MouseEvent>(document, 'click');
```

> **Gotcha:** `interval` and `timer` do not start until subscribed. If you subscribe twice you get two independent counters.

---

### L1 Subscribing and unsubscribing

```ts
import { interval } from 'rxjs';

const counter$ = interval(500);

// full observer object
const sub = counter$.subscribe({
  next:     (value) => console.log('value:', value),
  error:    (err)   => console.error('error:', err),
  complete: ()      => console.log('completed'),
});

// shorthand — only next handler
const sub2 = counter$.subscribe((value) => console.log(value));

// cancel to avoid memory leaks
sub.unsubscribe();
sub2.unsubscribe();
```

| Method | What it does |
|---|---|
| `.subscribe(observer \| nextFn)` | Starts execution; returns a `Subscription`. |
| `.unsubscribe()` | Cancels the subscription; cleans up resources. |
| `subscription.add(inner)` | Add a child subscription — unsubscribing the parent also cancels children. |
| `subscription.closed` | `true` after `unsubscribe()` has been called. |

> **Gotcha:** If you never call `.unsubscribe()` on a long-lived Observable (like `interval`), it runs until the page reloads. Always store and clean up subscriptions.

---

### L1 Pipeable operators — basics

Operators are composed with `.pipe()`. Each operator returns a new Observable — the source is never mutated.

#### `map` *

Transforms each emitted value.

```ts
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 10)
).subscribe(console.log); // 10, 20, 30
```

#### `filter` *

Passes only values that satisfy the predicate.

```ts
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log); // 2, 4
```

#### `take`

Completes after emitting `n` values.

```ts
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(500).pipe(take(3)).subscribe(console.log); // 0, 1, 2
```

#### `first`

Emits only the first value (or the first value matching a predicate), then completes.

```ts
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

of(5, 10, 15).pipe(first()).subscribe(console.log);        // 5
of(5, 10, 15).pipe(first(x => x > 7)).subscribe(console.log); // 10
```

#### `last`

Emits only the last value when the source completes.

```ts
import { of } from 'rxjs';
import { last } from 'rxjs/operators';

of(1, 2, 3).pipe(last()).subscribe(console.log); // 3
```

#### `tap` *

Side-effect operator — passes values through unchanged; useful for logging.

```ts
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  tap(x => console.log('before map:', x)),
  map(x => x * 2),
  tap(x => console.log('after map:', x)),
).subscribe();
```

#### `skip`

Discards the first `n` values.

```ts
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';

of(1, 2, 3, 4).pipe(skip(2)).subscribe(console.log); // 3, 4
```

#### `scan` *

Like `Array.reduce` but emits the accumulator after every value.

```ts
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

of(1, 2, 3).pipe(
  scan((acc, val) => acc + val, 0)
).subscribe(console.log); // 1, 3, 6
```

> **Gotcha:** Don't confuse `scan` with `reduce`. `reduce` only emits the final accumulated value after the source completes; `scan` emits intermediate values.

---

### L1 Error handling — basics

#### `catchError`

Intercepts an error and replaces the errored Observable with a fallback.

```ts
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

throwError(() => new Error('something went wrong')).pipe(
  catchError(err => of('fallback value'))
).subscribe(console.log); // 'fallback value'
```

> **Gotcha:** `catchError` must return an Observable. Returning `EMPTY` completes silently; throwing inside it re-throws the error downstream.

---

## Level 2 — Mid-level

### L2 Transformation operators

These operators project each source value to an inner Observable and then **flatten** the result. The flattening strategy determines behaviour when multiple inner Observables are active simultaneously.

#### `mergeMap` (alias `flatMap`) *

Subscribes to every inner Observable **concurrently**. Order is not preserved.

```ts
import { of, interval } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

of('a', 'b', 'c').pipe(
  mergeMap(letter => interval(Math.random() * 1000).pipe(
    take(1),
    map(() => letter)
  ))
).subscribe(console.log); // a, b, c in arbitrary order
```

**Use when:** HTTP requests can run in parallel and order does not matter (e.g., bulk delete).

#### `switchMap` *

Cancels the previous inner Observable when a new source value arrives. Only the **latest** inner Observable is active.

```ts
import { fromEvent } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

fromEvent(searchInput, 'input').pipe(
  debounceTime(300),
  switchMap(event => fetch(`/api/search?q=${event.target.value}`))
).subscribe(console.log);
```

**Use when:** Search / autocomplete — you only care about the result for the latest query.

> **Gotcha:** Switched-away inner Observables are unsubscribed. If you use `switchMap` for a save action, a rapid second click cancels the first HTTP request — use `exhaustMap` or `concatMap` instead.

#### `concatMap`

Queues inner Observables and subscribes to each one only after the previous completes. **Order is preserved.**

```ts
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

of(1, 2, 3).pipe(
  concatMap(n => of(n).pipe(delay(500)))
).subscribe(console.log); // 1 (after 0.5s), 2 (after 1s), 3 (after 1.5s)
```

**Use when:** Sequential operations where order matters (e.g., wizard steps, ordered saves).

#### `exhaustMap`

Ignores new source values while an inner Observable is still active.

```ts
import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

fromEvent(submitBtn, 'click').pipe(
  exhaustMap(() => from(fetch('/api/submit')))
).subscribe(console.log);
```

**Use when:** Prevent duplicate form submissions — ignore clicks while the request is in flight.

#### `concatMap` vs `mergeMap` vs `switchMap` vs `exhaustMap` at a glance

| Operator | Concurrent inner? | Cancels previous? | Ignores new? |
|---|---|---|---|
| `mergeMap` | Yes (all) | No | No |
| `switchMap` | No (1 at a time) | Yes | No |
| `concatMap` | No (queues) | No | No |
| `exhaustMap` | No (1 at a time) | No | Yes |

---

### L2 Filtering operators

#### `debounceTime` *

Emits a value only if a given interval has passed without another value arriving.

```ts
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

fromEvent<InputEvent>(input, 'input').pipe(
  debounceTime(400),
  map(e => (e.target as HTMLInputElement).value)
).subscribe(query => console.log('search:', query));
```

#### `throttleTime`

Emits a value, then ignores all following values for a given interval.

```ts
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

fromEvent(window, 'scroll').pipe(
  throttleTime(200)
).subscribe(() => console.log('scrolled'));
```

#### `distinctUntilChanged` *

Filters out consecutive duplicate values.

```ts
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 3, 1).pipe(
  distinctUntilChanged()
).subscribe(console.log); // 1, 2, 3, 1
```

#### `distinctUntilKeyChanged`

Like `distinctUntilChanged` but compares a specific object property.

```ts
import { of } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

of({ id: 1, name: 'Alice' }, { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }).pipe(
  distinctUntilKeyChanged('id')
).subscribe(console.log); // { id: 1 }, { id: 2 }
```

#### `takeUntil` *

Completes when a notifier Observable emits.

```ts
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const destroy$ = new Subject<void>();

interval(500).pipe(
  takeUntil(destroy$)
).subscribe(console.log);

// later — complete the interval cleanly
destroy$.next();
destroy$.complete();
```

#### `takeWhile`

Completes as soon as the predicate returns `false`.

```ts
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

interval(500).pipe(
  takeWhile(n => n < 5)
).subscribe(console.log); // 0, 1, 2, 3, 4
```

#### `skipUntil`

Ignores values until a notifier Observable emits, then passes all subsequent values.

```ts
import { interval, timer } from 'rxjs';
import { skipUntil } from 'rxjs/operators';

interval(200).pipe(
  skipUntil(timer(1000))
).subscribe(console.log); // values from ~index 5 onwards
```

#### `auditTime` / `sampleTime`

| Operator | Behaviour |
|---|---|
| `auditTime(ms)` | After a value arrives, waits `ms` then emits the **latest** value seen in that window. |
| `sampleTime(ms)` | Emits the **latest** value every `ms` regardless of source activity. |

---

### L2 Combination operators

#### `combineLatest` *

Emits an array of the **latest** value from each input Observable every time any input emits. Requires all inputs to have emitted at least once.

```ts
import { combineLatest, BehaviorSubject } from 'rxjs';

const user$ = new BehaviorSubject({ name: 'Alice' });
const perms$ = new BehaviorSubject(['read']);

combineLatest([user$, perms$]).subscribe(([user, perms]) => {
  console.log(user.name, perms);
});
```

#### `forkJoin` *

Waits for all input Observables to **complete**, then emits one array of their last values. The RxJS equivalent of `Promise.all`.

```ts
import { forkJoin, from } from 'rxjs';

forkJoin({
  user:    from(fetch('/api/user').then(r => r.json())),
  profile: from(fetch('/api/profile').then(r => r.json())),
}).subscribe(({ user, profile }) => console.log(user, profile));
```

> **Gotcha:** If any input errors or never completes, `forkJoin` never emits. Use `catchError` on each inner stream if partial failure is acceptable.

#### `merge`

Subscribes to all inputs concurrently and forwards every value as it arrives.

```ts
import { merge, interval } from 'rxjs';
import { map } from 'rxjs/operators';

merge(
  interval(500).pipe(map(() => 'A')),
  interval(800).pipe(map(() => 'B')),
).subscribe(console.log); // A, A, B, A, B, A …
```

#### `concat`

Subscribes to inputs **sequentially** — the next input only starts after the previous completes.

```ts
import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';

concat(
  of('first').pipe(delay(1000)),
  of('second')
).subscribe(console.log); // 'first' (after 1s), 'second' (immediately after)
```

#### `zip`

Pairs the nth value from each input into a tuple. Useful when values correspond positionally.

```ts
import { zip, of } from 'rxjs';

zip(
  of('Alice', 'Bob'),
  of(30, 25)
).subscribe(([name, age]) => console.log(name, age));
// Alice 30 / Bob 25
```

#### `withLatestFrom` *

When the source emits, combines it with the **latest** value from another Observable. The other Observable is a silent passenger — it does not drive emissions.

```ts
import { fromEvent } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

fromEvent(saveBtn, 'click').pipe(
  withLatestFrom(formValue$),
  map(([_, form]) => form)
).subscribe(formValue => saveToServer(formValue));
```

---

### L2 Error handling — intermediate

#### `retry(count)`

Resubscribes to the source up to `count` times when an error occurs.

```ts
import { from } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';

from(fetch('/api/data')).pipe(
  retry(3)
).subscribe({ next: console.log, error: console.error });
```

#### `retryWhen` / `retry({ delay })` (RxJS 7+)

Retry with exponential back-off:

```ts
import { from, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

from(fetch('/api/data')).pipe(
  retry({
    count: 4,
    delay: (error, retryCount) => timer(2 ** retryCount * 1000) // 2s, 4s, 8s, 16s
  })
).subscribe({ next: console.log, error: console.error });
```

#### `finalize`

Runs a callback when the Observable completes, errors, or is unsubscribed from — the Observable equivalent of `finally`.

```ts
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';

of(1, 2, 3).pipe(
  finalize(() => console.log('cleanup'))
).subscribe(console.log);
// 1, 2, 3, then 'cleanup'
```

---

### L2 Subjects

A Subject is both an Observable and an Observer — it is a hot multicast source.

#### `Subject`

Plain multicast. New subscribers only see values emitted **after** they subscribe.

```ts
import { Subject } from 'rxjs';

const subject$ = new Subject<number>();

subject$.subscribe(v => console.log('A:', v));
subject$.next(1);
subject$.subscribe(v => console.log('B:', v));
subject$.next(2);
// A: 1 / A: 2 / B: 2
```

#### `BehaviorSubject` *

Stores the **latest** value. New subscribers receive the current value immediately upon subscribe.

```ts
import { BehaviorSubject } from 'rxjs';

const state$ = new BehaviorSubject({ count: 0 });

state$.subscribe(s => console.log('count:', s.count));
state$.next({ count: 1 });
state$.next({ count: 2 });
// count: 0 → count: 1 → count: 2

// Access the current value synchronously
console.log(state$.getValue()); // { count: 2 }
```

#### `ReplaySubject`

Replays the last `n` values (and optionally within a time window) to new subscribers.

```ts
import { ReplaySubject } from 'rxjs';

const replay$ = new ReplaySubject<number>(3); // buffer last 3

replay$.next(1);
replay$.next(2);
replay$.next(3);
replay$.next(4);

replay$.subscribe(console.log); // 2, 3, 4  (last 3)
```

#### `AsyncSubject`

Emits only the **last** value and only when the source calls `.complete()`.

```ts
import { AsyncSubject } from 'rxjs';

const async$ = new AsyncSubject<number>();

async$.subscribe(console.log);
async$.next(1);
async$.next(2);
async$.next(3);
async$.complete(); // now emits 3
```

| Subject type | Replays on subscribe? | How many values? |
|---|---|---|
| `Subject` | No | — |
| `BehaviorSubject` | Yes | Latest 1 |
| `ReplaySubject(n)` | Yes | Last n |
| `AsyncSubject` | Yes (on complete) | Last 1 |

---

### L2 Hot vs Cold Observables

| | Cold Observable | Hot Observable |
|---|---|---|
| **Execution** | Starts fresh for each subscriber | Shared single execution |
| **Typical source** | `of`, `from`, `interval`, HTTP requests | `fromEvent`, `Subject`, `share()` |
| **Late subscriber** | Sees all values from the start | Misses past values |
| **Example** | A video file download | A live TV broadcast |

```ts
// Cold — each subscriber gets its own timer
const cold$ = interval(1000);
cold$.subscribe(v => console.log('Sub1:', v));
setTimeout(() => cold$.subscribe(v => console.log('Sub2:', v)), 2000);
// Sub1: 0,1,2,3 … Sub2 starts from 0 independently

// Hot — share a single timer
import { share } from 'rxjs/operators';
const hot$ = cold$.pipe(share());
hot$.subscribe(v => console.log('Sub1:', v));
setTimeout(() => hot$.subscribe(v => console.log('Sub2:', v)), 2000);
// Sub1: 0,1,2 … Sub2 joins mid-stream at ~2
```

---

## Level 3 — Senior

### L3 Multicasting operators

Multicasting converts a cold Observable into a hot one so multiple subscribers share a single subscription.

#### `share` *

Multicasts to multiple subscribers using a regular `Subject` under the hood. Refcounts: subscribes to source when the first subscriber arrives, unsubscribes when the last leaves.

```ts
import { interval } from 'rxjs';
import { share } from 'rxjs/operators';

const shared$ = interval(1000).pipe(share());

const sub1 = shared$.subscribe(v => console.log('A:', v));
const sub2 = shared$.subscribe(v => console.log('B:', v));
// Both share one interval
```

#### `shareReplay(bufferSize)` *

Like `share` but uses a `ReplaySubject` internally — replays the last `bufferSize` values to late subscribers. The `refCount` option controls whether the source is torn down when subscriber count reaches zero.

```ts
import { from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const config$ = from(fetch('/api/config').then(r => r.json())).pipe(
  shareReplay(1) // cache last response; subsequent subscribers skip the HTTP call
);

// First subscription fires HTTP request
config$.subscribe(console.log);
// Second subscription gets cached value instantly
config$.subscribe(console.log);
```

> **Gotcha:** `shareReplay(1)` without `{ refCount: true }` keeps the source alive even after all subscribers unsubscribe (until the source completes or errors). This can cause memory leaks or keep an HTTP connection open. Use `shareReplay({ bufferSize: 1, refCount: true })` in most cases.

#### `publish` / `multicast` / `connect`

Lower-level multicasting primitives. `publish()` wraps `multicast(new Subject())`. You call `.connect()` manually to start the shared execution.

```ts
import { interval } from 'rxjs';
import { publish, take } from 'rxjs/operators';

const source$ = interval(1000).pipe(take(5), publish()) as ConnectableObservable<number>;

source$.subscribe(v => console.log('A:', v));
source$.subscribe(v => console.log('B:', v));

const connection = source$.connect(); // start the clock
setTimeout(() => connection.unsubscribe(), 6000);
```

---

### L3 Schedulers

Schedulers control the execution context and timing of Observable emissions.

| Scheduler | Context | Use case |
|---|---|---|
| `queueScheduler` | Synchronous, queued | Recursive operations; prevents stack overflows |
| `asapScheduler` | Microtask queue (like `Promise.resolve`) | Execute ASAP but after the current synchronous code |
| `asyncScheduler` | `setInterval` / `setTimeout` | Default for time-based operators |
| `animationFrameScheduler` | `requestAnimationFrame` | Smooth UI animations synchronized with browser paint |

```ts
import { of, asyncScheduler } from 'rxjs';
import { observeOn, subscribeOn } from 'rxjs/operators';

// observeOn — affects where notifications are delivered (next/error/complete)
of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(console.log); // delivered asynchronously

// subscribeOn — affects where the subscription logic (setup) runs
of(1, 2, 3).pipe(
  subscribeOn(asyncScheduler)
).subscribe(console.log);
```

> **Gotcha:** Most time-based operators (`interval`, `debounceTime`, `delay`, etc.) accept an optional `scheduler` parameter. Passing a `TestScheduler` makes them synchronously controllable in tests.

---

### L3 Custom operators

A custom operator is a function that takes an Observable and returns an Observable. Compose existing operators inside `pipe` or use `new Observable`.

```ts
import { Observable, OperatorFunction } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Composing existing operators
function filterAndDouble<T extends number>(): OperatorFunction<T, T> {
  return (source$: Observable<T>) => source$.pipe(
    filter(x => x > 0),
    map(x => (x * 2) as T),
  );
}

of(-1, 0, 2, 5).pipe(filterAndDouble()).subscribe(console.log); // 4, 10


// Custom operator from scratch
function logAndPass<T>(label: string): OperatorFunction<T, T> {
  return (source$: Observable<T>) => new Observable<T>(subscriber => {
    const subscription = source$.subscribe({
      next:     value => { console.log(`[${label}]`, value); subscriber.next(value); },
      error:    err   => subscriber.error(err),
      complete: ()    => subscriber.complete(),
    });
    return () => subscription.unsubscribe();
  });
}

of(1, 2, 3).pipe(logAndPass('debug')).subscribe();
```

---

### L3 Testing with TestScheduler

`TestScheduler` lets you write synchronous, deterministic tests for time-based Observables using marble syntax.

```ts
import { TestScheduler } from 'rxjs/testing';
import { debounceTime, map } from 'rxjs/operators';

describe('debounceTime', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('debounces rapid emissions', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b--c------|', { a: 1, b: 2, c: 3 });
      const result$ = source$.pipe(debounceTime(3, scheduler));

      expectObservable(result$).toBe('--------c---|', { c: 3 });
    });
  });
});
```

**Marble syntax cheat sheet:**

| Symbol | Meaning |
|---|---|
| `-` | 1 virtual frame of time |
| `a`–`z` | Emission (mapped to values object) |
| `\|` | Completion |
| `#` | Error |
| `(abc)` | Multiple synchronous emissions in a single frame |
| `^` | Subscription point (in expected marble of hot Observables) |
| `!` | Unsubscription point |

---

### L3 Memory management and leak prevention

Common patterns for avoiding subscription leaks.

#### Pattern 1 — `takeUntil` with a destroy Subject

The idiomatic Angular pattern. Works for any component/service lifecycle.

```ts
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class MyComponent {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(500).pipe(
      takeUntil(this.destroy$)
    ).subscribe(console.log);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Pattern 2 — `Subscription` container

Collect all subscriptions and unsubscribe in bulk.

```ts
import { Subscription, interval } from 'rxjs';

class MyService {
  private subs = new Subscription();

  start() {
    this.subs.add(interval(500).subscribe(console.log));
    this.subs.add(interval(1000).subscribe(console.log));
  }

  destroy() {
    this.subs.unsubscribe();
  }
}
```

#### Pattern 3 — `async` pipe (Angular)

The template handles subscribe and unsubscribe automatically.

```html
<div>{{ data$ | async }}</div>
```

#### Common leak sources

| Cause | Fix |
|---|---|
| `interval` / `timer` without `takeUntil` | Add `takeUntil(destroy$)` |
| `fromEvent` without `takeUntil` | Add `takeUntil(destroy$)` or call `.unsubscribe()` |
| `shareReplay(n)` without `refCount: true` | Use `shareReplay({ bufferSize: 1, refCount: true })` |
| `BehaviorSubject` inside a service never completed | Call `.complete()` in `ngOnDestroy` |

---

### L3 Higher-order Observables and flattening strategies

A **higher-order Observable** is one that emits Observables. The four flattening operators (`mergeMap`, `switchMap`, `concatMap`, `exhaustMap`) each deal with higher-order Observables differently.

Knowing which to reach for is a senior-level skill:

| Scenario | Operator |
|---|---|
| HTTP GET — results independent, parallel is fine | `mergeMap` |
| Search / typeahead — only latest query matters | `switchMap` |
| Sequential wizard steps / ordered saves | `concatMap` |
| Prevent double-submit / double-login | `exhaustMap` |
| Group a stream into windows of time | `windowTime` |
| Group a stream into buffers | `bufferTime` / `bufferCount` |

```ts
import { interval } from 'rxjs';
import { bufferCount, windowCount, mergeAll } from 'rxjs/operators';

// Batch process 5 at a time
interval(200).pipe(
  bufferCount(5)
).subscribe(batch => console.log('batch:', batch));
// [0,1,2,3,4], [5,6,7,8,9] …

// windowCount creates Observable windows
interval(200).pipe(
  windowCount(5),
  mergeAll()
).subscribe(console.log);
```

---

### L3 Real-world patterns

#### Polling with exponential back-off on error

```ts
import { timer, Subject } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';

const poll$ = timer(0, 5000).pipe(
  switchMap(() => from(fetch('/api/status').then(r => r.json()))),
  retry({ count: 3, delay: (_, n) => timer(n * 2000) }),
  share()
);
```

#### Request caching

```ts
import { from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const cache = new Map<string, Observable<unknown>>();

function cachedFetch<T>(url: string): Observable<T> {
  if (!cache.has(url)) {
    cache.set(url, from(fetch(url).then(r => r.json())).pipe(
      shareReplay(1)
    ));
  }
  return cache.get(url) as Observable<T>;
}
```

#### State management with `BehaviorSubject` + `scan`

```ts
import { Subject } from 'rxjs';
import { scan, startWith, shareReplay } from 'rxjs/operators';

type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

interface State { count: number }

const action$ = new Subject<Action>();

const state$ = action$.pipe(
  scan((state: State, action: Action): State => {
    switch (action.type) {
      case 'INCREMENT': return { count: state.count + 1 };
      case 'DECREMENT': return { count: state.count - 1 };
      case 'RESET':     return { count: 0 };
    }
  }, { count: 0 }),
  startWith({ count: 0 }),
  shareReplay(1)
);

state$.subscribe(s => console.log('state:', s));

action$.next({ type: 'INCREMENT' }); // count: 1
action$.next({ type: 'INCREMENT' }); // count: 2
action$.next({ type: 'RESET' });     // count: 0
```

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Core concepts** | Observable, Observer, Subscription, pipe | Hot vs Cold, Subject types | Schedulers, ConnectableObservable |
| **Creation** | `of`, `from`, `interval`, `fromEvent` | `defer`, `EMPTY`, `throwError` | Custom Observable constructor |
| **Transformation** | `map`, `scan` | `mergeMap`, `switchMap`, `concatMap`, `exhaustMap` | `buffer*`, `window*`, higher-order patterns |
| **Filtering** | `filter`, `take`, `first`, `skip` | `debounceTime`, `distinctUntilChanged`, `takeUntil` | `audit`, `sample`, `throttle` with config |
| **Combination** | — | `combineLatest`, `forkJoin`, `merge`, `concat`, `withLatestFrom` | `zip`, `race`, `partition` |
| **Error handling** | `catchError` | `retry`, `retryWhen`, `finalize` | Exponential back-off, `onErrorResumeNext` |
| **Subjects** | — | `Subject`, `BehaviorSubject`, `ReplaySubject`, `AsyncSubject` | `shareReplay`, `publish`, manual `connect` |
| **Multicasting** | — | `share` | `shareReplay`, `publish`, `multicast` |
| **Testing** | — | Basic marble tests | `TestScheduler`, virtual time, cold/hot test Observables |
| **Memory** | `.unsubscribe()` | `takeUntil`, `Subscription` container | Leak detection, `shareReplay` + `refCount`, `async` pipe |
| **Patterns** | Simple reactive forms | Typeahead, HTTP retry | Polling, caching, mini state management with `scan` |

---

## Tasks

### Level 1 — Junior tasks

#### Task J-1 — Create and subscribe

Create an Observable using `of` that emits the numbers `10`, `20`, `30`. Log each value, then log `'done'` when the stream completes.

---

#### Task J-2 — map and filter

Create an Observable that emits integers `1` through `10` using `from`. Apply `filter` to keep only even numbers, then apply `map` to double them. Print the results.

---

#### Task J-3 — take and interval

Create an Observable using `interval(500)` and use `take(5)` so it completes after 5 emissions. Print each emitted value.

---

#### Task J-4 — scan (running total)

Given an Observable that emits `[3, 5, 2, 8, 1]` using `from`, use `scan` to compute a running total and print each intermediate sum.

---

#### Task J-5 — tap for debugging

Using `of(1, 2, 3)`, use `tap` to log `'before: <value>'`, then use `map` to multiply by 5, then use another `tap` to log `'after: <value>'`. Subscribe with no callbacks and observe the logs.

---

#### Task J-6 — catchError fallback

Create an Observable that immediately errors using `throwError(() => new Error('network error'))`. Use `catchError` to return `of('default data')` as a fallback. Subscribe and print the value.

---

#### Task J-7 — fromEvent with takeUntil

Create a `Subject` called `stop$`. Listen to `document` click events using `fromEvent`. Stop the stream when `stop$` emits. After 5 clicks, call `stop$.next()` and observe that further clicks are ignored.

---

#### Task J-8 — first and last

Given `from([100, 200, 300, 400, 500])`:
1. Print only the **first** value.
2. Print only the **last** value.

---

#### Task J-9 — skip

Given `from([1, 2, 3, 4, 5, 6])`, skip the first 3 values and print the rest.

---

#### Task J-10 — timer

Use `timer(1000, 500)` to emit 4 values starting after a 1-second delay with 0.5-second intervals between them. Use `take(4)` to complete the stream. Print each value.

---

### Level 2 — Mid tasks

#### Task M-1 — switchMap for search

Simulate a search box: create a `Subject<string>` called `query$`. Every time a new query is pushed, use `switchMap` to "fetch" results with a `timer(300)` delay (simulating network latency) that maps to `'results for: <query>'`. Push `'cat'`, then immediately `'catfish'`. Observe that only `catfish` produces a result.

---

#### Task M-2 — concatMap for ordered saves

Create an Observable emitting `['step1', 'step2', 'step3']` using `from`. Use `concatMap` to simulate saving each step with a `timer(500)` delay. Verify the steps are saved in order.

---

#### Task M-3 — exhaustMap for submit prevention

Simulate a submit button: create a `Subject<void>()` called `clicks$`. Use `exhaustMap` to perform a `timer(2000)` operation (simulating a slow save). Emit 3 rapid clicks. Verify only the first click triggers the operation.

---

#### Task M-4 — combineLatest for form state

Create two `BehaviorSubject`s: `username$` initialized to `''` and `password$` initialized to `''`. Use `combineLatest` to derive an `isValid$` Observable that emits `true` only when both have a length > 0. Update the subjects and print the validity.

---

#### Task M-5 — forkJoin for parallel calls

Use `forkJoin` to combine three Observables: `of('user').pipe(delay(300))`, `of('orders').pipe(delay(100))`, and `of('profile').pipe(delay(200))`. Print the combined result.

---

#### Task M-6 — BehaviorSubject as state

Create a `BehaviorSubject<number>(0)`. Subscribe to it and print every value. Emit `10`, then `20`, then subscribe a **second** subscriber — it should immediately receive `20`. Emit `30` — both subscribers receive it.

---

#### Task M-7 — debounceTime

Simulate user input: push values `'h'`, `'he'`, `'hel'`, `'hell'`, `'hello'` to a `Subject<string>` with 100 ms intervals between each. Apply `debounceTime(250)`. Observe that only `'hello'` is emitted (after the burst stops).

---

#### Task M-8 — retry on error

Create an Observable that fails twice before succeeding:

```ts
let attempt = 0;
const source$ = new Observable<string>(subscriber => {
  attempt++;
  if (attempt < 3) { subscriber.error(new Error(`fail attempt ${attempt}`)); }
  else { subscriber.next('success'); subscriber.complete(); }
});
```

Apply `retry(3)` and subscribe. Verify `'success'` is printed.

---

#### Task M-9 — withLatestFrom

Create a `Subject<void>()` called `save$` and a `BehaviorSubject<string>('initial')` called `data$`. Each time `save$` emits, use `withLatestFrom(data$)` to capture the current data value and print `'saving: <value>'`. Mutate `data$` several times before triggering `save$`.

---

#### Task M-10 — ReplaySubject

Create a `ReplaySubject<number>(2)`. Emit `1`, `2`, `3`. Now subscribe — verify you receive `2` and `3` (the last 2). Emit `4` — verify the new subscriber only sees `3` and `4` the next time a fresh subscription is made.

---

### Level 3 — Senior tasks

#### Task S-1 — Custom operator

Write a custom operator `filterMap<T, R>(predicate: (v: T) => boolean, project: (v: T) => R): OperatorFunction<T, R>` that filters values by the predicate and then maps the passing values. Apply it to `from([1, 2, 3, 4, 5])` keeping only even numbers and doubling them.

---

#### Task S-2 — shareReplay for HTTP caching

Simulate an expensive fetch: wrap `timer(1000).pipe(mapTo('response'))` in `shareReplay({ bufferSize: 1, refCount: true })`. Subscribe twice within 200 ms and verify the source timer fires **only once**, with both subscribers receiving `'response'`.

---

#### Task S-3 — TestScheduler marble test

Write a `TestScheduler`-based test for an operator chain of `debounceTime(30)` followed by `map(x => x * 2)`. Use cold marble `'a-b-c------|'` with values `{ a: 1, b: 2, c: 3 }`. Assert the expected output marble and values.

---

#### Task S-4 — Polling with error handling

Create a polling Observable that fetches a resource every 5 seconds and retries up to 3 times with exponential back-off (1s, 2s, 4s) on error. Use `timer`, `switchMap`, `retry` with `delay`, and `share`. The polling should stop when a `stop$` Subject emits.

---

#### Task S-5 — State management with scan

Implement a minimal counter store:
- Actions: `{ type: 'INCREMENT' }`, `{ type: 'DECREMENT' }`, `{ type: 'SET'; value: number }`
- Use a `Subject<Action>` + `scan` + `startWith` + `shareReplay(1)`.
- Subscribe and dispatch 5 actions, verifying the state after each.

---

#### Task S-6 — Higher-order: bufferCount + mergeMap

You have a stream of 20 user IDs emitted by `from([...Array(20).keys()])`. Buffer them into groups of 5 using `bufferCount(5)`. For each batch, simulate a bulk API call with `of(batch).pipe(delay(500))`. Use `mergeMap` to run all batches in parallel. Print each batch result when it resolves.

---

#### Task S-7 — exhaustMap vs switchMap decision

Given a stream of login button clicks (`clicks$` Subject), decide whether to use `switchMap` or `exhaustMap` for the login HTTP call and justify the choice. Implement it so rapid clicks do not send duplicate requests.

---

#### Task S-8 — Avoiding a shareReplay leak

Explain the memory-leak risk with `shareReplay(1)` (no `refCount`). Implement a `cachedRequest$` Observable using `shareReplay({ bufferSize: 1, refCount: true })` and demonstrate that the source re-executes after all subscribers unsubscribe and a new one appears.

---

#### Task S-9 — Custom operator from scratch (new Observable)

Write a `takeEveryNth<T>(n: number): OperatorFunction<T, T>` operator that emits every nth value (1st, (n+1)th, (2n+1)th …) from the source using the `new Observable` constructor. Test with `from([0,1,2,3,4,5,6,7,8,9])` and `n = 3`.

---

#### Task S-10 — Compose a typeahead pipeline

Build a full typeahead pipeline:
1. Source: `fromEvent<InputEvent>(input, 'input')` — extract the input value.
2. Apply `debounceTime(300)`.
3. Apply `distinctUntilChanged()`.
4. Use `switchMap` to call a `searchAPI(query: string): Observable<string[]>` (stub it as `of([`result for ${query}`]).pipe(delay(400))`).
5. Use `catchError` per-inner-stream so a failing search does not kill the pipeline.
6. Add `takeUntil(destroy$)` to clean up on component destroy.
7. Subscribe and print results.

---

## Answers

### Answers — Junior

#### Answer J-1

```ts
import { of } from 'rxjs';

of(10, 20, 30).subscribe({
  next:     v  => console.log(v),
  complete: () => console.log('done'),
});
// 10, 20, 30, 'done'
```

---

#### Answer J-2

```ts
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
  filter(n => n % 2 === 0),
  map(n => n * 2),
).subscribe(console.log);
// 4, 8, 12, 16, 20
```

---

#### Answer J-3

```ts
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(500).pipe(
  take(5)
).subscribe(console.log);
// 0, 1, 2, 3, 4
```

---

#### Answer J-4

```ts
import { from } from 'rxjs';
import { scan } from 'rxjs/operators';

from([3, 5, 2, 8, 1]).pipe(
  scan((acc, val) => acc + val, 0)
).subscribe(console.log);
// 3, 8, 10, 18, 19
```

---

#### Answer J-5

```ts
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  tap(v  => console.log('before:', v)),
  map(v  => v * 5),
  tap(v  => console.log('after:', v)),
).subscribe();
// before: 1 / after: 5 / before: 2 / after: 10 / before: 3 / after: 15
```

---

#### Answer J-6

```ts
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

throwError(() => new Error('network error')).pipe(
  catchError(() => of('default data'))
).subscribe(console.log);
// 'default data'
```

---

#### Answer J-7

```ts
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const stop$ = new Subject<void>();
let clickCount = 0;

fromEvent(document, 'click').pipe(
  takeUntil(stop$)
).subscribe(() => {
  clickCount++;
  console.log('click', clickCount);
  if (clickCount >= 5) {
    stop$.next();
    stop$.complete();
  }
});
```

---

#### Answer J-8

```ts
import { from } from 'rxjs';
import { first, last } from 'rxjs/operators';

const source$ = from([100, 200, 300, 400, 500]);

source$.pipe(first()).subscribe(v => console.log('first:', v)); // 100
source$.pipe(last()).subscribe(v  => console.log('last:', v));  // 500
```

---

#### Answer J-9

```ts
import { from } from 'rxjs';
import { skip } from 'rxjs/operators';

from([1, 2, 3, 4, 5, 6]).pipe(
  skip(3)
).subscribe(console.log);
// 4, 5, 6
```

---

#### Answer J-10

```ts
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

timer(1000, 500).pipe(
  take(4)
).subscribe(console.log);
// 0 (at 1s), 1 (at 1.5s), 2 (at 2s), 3 (at 2.5s)
```

---

### Answers — Mid

#### Answer M-1

```ts
import { Subject, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

const query$ = new Subject<string>();

query$.pipe(
  switchMap(q => timer(300).pipe(map(() => `results for: ${q}`)))
).subscribe(console.log);

query$.next('cat');
query$.next('catfish'); // cancels 'cat' — only 'results for: catfish' is printed
```

---

#### Answer M-2

```ts
import { from, timer } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

from(['step1', 'step2', 'step3']).pipe(
  concatMap(step => timer(500).pipe(map(() => `saved: ${step}`)))
).subscribe(console.log);
// saved: step1 (0.5s), saved: step2 (1s), saved: step3 (1.5s)
```

---

#### Answer M-3

```ts
import { Subject, timer } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

const clicks$ = new Subject<void>();

clicks$.pipe(
  exhaustMap(() => timer(2000).pipe(map(() => 'save complete')))
).subscribe(console.log);

clicks$.next(); // triggers save
clicks$.next(); // ignored — save still in progress
clicks$.next(); // ignored — save still in progress
// only one 'save complete' is printed
```

---

#### Answer M-4

```ts
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const username$ = new BehaviorSubject('');
const password$ = new BehaviorSubject('');

const isValid$ = combineLatest([username$, password$]).pipe(
  map(([u, p]) => u.length > 0 && p.length > 0)
);

isValid$.subscribe(valid => console.log('valid:', valid));

username$.next('alice');   // valid: false (no password yet)
password$.next('secret');  // valid: true
password$.next('');        // valid: false
```

---

#### Answer M-5

```ts
import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';

forkJoin({
  user:    of('user').pipe(delay(300)),
  orders:  of('orders').pipe(delay(100)),
  profile: of('profile').pipe(delay(200)),
}).subscribe(result => console.log(result));
// { user: 'user', orders: 'orders', profile: 'profile' } — emitted after ~300ms
```

---

#### Answer M-6

```ts
import { BehaviorSubject } from 'rxjs';

const state$ = new BehaviorSubject<number>(0);

const sub1 = state$.subscribe(v => console.log('Sub1:', v)); // immediately: Sub1: 0

state$.next(10); // Sub1: 10
state$.next(20); // Sub1: 20

const sub2 = state$.subscribe(v => console.log('Sub2:', v)); // immediately: Sub2: 20

state$.next(30); // Sub1: 30, Sub2: 30

sub1.unsubscribe();
sub2.unsubscribe();
```

---

#### Answer M-7

```ts
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const input$ = new Subject<string>();

input$.pipe(debounceTime(250)).subscribe(console.log);

const chars = ['h', 'he', 'hel', 'hell', 'hello'];
chars.forEach((char, i) => setTimeout(() => input$.next(char), i * 100));
// Only 'hello' is printed (after the burst stops)
```

---

#### Answer M-8

```ts
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

let attempt = 0;
const source$ = new Observable<string>(subscriber => {
  attempt++;
  if (attempt < 3) {
    subscriber.error(new Error(`fail attempt ${attempt}`));
  } else {
    subscriber.next('success');
    subscriber.complete();
  }
});

source$.pipe(retry(3)).subscribe({
  next:  v   => console.log(v),   // 'success'
  error: err => console.error(err),
});
```

---

#### Answer M-9

```ts
import { Subject, BehaviorSubject } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

const save$ = new Subject<void>();
const data$ = new BehaviorSubject<string>('initial');

save$.pipe(
  withLatestFrom(data$),
  map(([_, data]) => data)
).subscribe(data => console.log('saving:', data));

data$.next('version 1');
data$.next('version 2');
save$.next(); // saving: version 2

data$.next('version 3');
save$.next(); // saving: version 3
```

---

#### Answer M-10

```ts
import { ReplaySubject } from 'rxjs';

const replay$ = new ReplaySubject<number>(2);

replay$.next(1);
replay$.next(2);
replay$.next(3);

// First subscription — receives last 2 buffered values
replay$.subscribe(v => console.log('first sub:', v)); // 2, 3

replay$.next(4);

// Second subscription — receives last 2 values at time of subscribe
replay$.subscribe(v => console.log('second sub:', v)); // 3, 4
```

---

### Answers — Senior

#### Answer S-1

```ts
import { Observable, OperatorFunction, from } from 'rxjs';

function filterMap<T, R>(
  predicate: (v: T) => boolean,
  project:   (v: T) => R
): OperatorFunction<T, R> {
  return (source$: Observable<T>) => new Observable<R>(subscriber => {
    return source$.subscribe({
      next:     v  => { if (predicate(v)) subscriber.next(project(v)); },
      error:    e  => subscriber.error(e),
      complete: () => subscriber.complete(),
    });
  });
}

from([1, 2, 3, 4, 5]).pipe(
  filterMap(n => n % 2 === 0, n => n * 2)
).subscribe(console.log); // 4, 8
```

---

#### Answer S-2

```ts
import { timer, Observable } from 'rxjs';
import { mapTo, shareReplay } from 'rxjs/operators';

const expensive$ = timer(1000).pipe(
  mapTo('response'),
  shareReplay({ bufferSize: 1, refCount: true })
);

// Both subscribers share the single timer execution
expensive$.subscribe(v => console.log('Sub1:', v));
expensive$.subscribe(v => console.log('Sub2:', v));
// Timer fires once; after ~1s: Sub1: response, Sub2: response
```

---

#### Answer S-3

```ts
import { TestScheduler } from 'rxjs/testing';
import { debounceTime, map } from 'rxjs/operators';

const scheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

scheduler.run(({ cold, expectObservable }) => {
  const source$   = cold('a-b-c------|', { a: 1, b: 2, c: 3 });
  const result$   = source$.pipe(
    debounceTime(3, scheduler),
    map(x => x * 2)
  );

  // 'c' (value 3) passes debounce after 3 frames idle; mapped to 6
  expectObservable(result$).toBe('--------f---|', { f: 6 });
});
```

---

#### Answer S-4

```ts
import { timer, Subject, from } from 'rxjs';
import { switchMap, retry, share, takeUntil } from 'rxjs/operators';

const stop$ = new Subject<void>();

const poll$ = timer(0, 5000).pipe(
  switchMap(() => from(fetch('/api/status').then(r => r.json()))),
  retry({
    count: 3,
    delay: (_, retryIndex) => timer(2 ** (retryIndex - 1) * 1000) // 1s, 2s, 4s
  }),
  takeUntil(stop$),
  share()
);

const sub = poll$.subscribe({
  next:  data => console.log('status:', data),
  error: err  => console.error('polling failed:', err),
});

// Stop after 30 seconds
setTimeout(() => stop$.next(), 30_000);
```

---

#### Answer S-5

```ts
import { Subject } from 'rxjs';
import { scan, startWith, shareReplay } from 'rxjs/operators';

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; value: number };

interface State { count: number }

const action$ = new Subject<Action>();

const state$ = action$.pipe(
  scan((state: State, action: Action): State => {
    switch (action.type) {
      case 'INCREMENT': return { count: state.count + 1 };
      case 'DECREMENT': return { count: state.count - 1 };
      case 'SET':       return { count: action.value };
    }
  }, { count: 0 }),
  startWith({ count: 0 }),
  shareReplay(1)
);

state$.subscribe(s => console.log('state:', s.count));

action$.next({ type: 'INCREMENT' }); // 1
action$.next({ type: 'INCREMENT' }); // 2
action$.next({ type: 'SET', value: 10 }); // 10
action$.next({ type: 'DECREMENT' }); // 9
action$.next({ type: 'DECREMENT' }); // 8
```

---

#### Answer S-6

```ts
import { from } from 'rxjs';
import { bufferCount, mergeMap, delay, map } from 'rxjs/operators';

const ids = [...Array(20).keys()]; // 0..19

from(ids).pipe(
  bufferCount(5),
  mergeMap(batch =>
    from([batch]).pipe(
      delay(500),
      map(b => `processed batch: [${b}]`)
    )
  )
).subscribe(console.log);
// Four batches in parallel, each printing after ~500ms
```

---

#### Answer S-7

```ts
import { Subject, from } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

const clicks$ = new Subject<void>();

// exhaustMap is correct here:
// - While a login request is in flight, all subsequent clicks are ignored.
// - switchMap would cancel an in-flight login if the user clicked again — dangerous.
// - concatMap would queue clicks and send multiple login requests.

clicks$.pipe(
  exhaustMap(() =>
    from(fetch('/api/login', { method: 'POST' }).then(r => r.json())).pipe(
      map(res => res.token)
    )
  )
).subscribe({
  next:  token => console.log('logged in, token:', token),
  error: err   => console.error('login failed:', err),
});

// Rapid clicks — only the first triggers a request
clicks$.next();
clicks$.next();
clicks$.next();
```

---

#### Answer S-8

```ts
import { timer } from 'rxjs';
import { mapTo, shareReplay, tap } from 'rxjs/operators';

// BAD: shareReplay(1) without refCount keeps the source alive forever
const leaky$ = timer(1000).pipe(
  tap(() => console.log('source executed')),
  mapTo('data'),
  shareReplay(1) // source never torn down even when all subscribers unsubscribe
);

// GOOD: refCount: true — source is torn down when subscriber count reaches 0
const safe$ = timer(1000).pipe(
  tap(() => console.log('source executed')),
  mapTo('data'),
  shareReplay({ bufferSize: 1, refCount: true })
);

// First subscription — source fires
const sub1 = safe$.subscribe(v => console.log('sub1:', v));
sub1.unsubscribe(); // subscriber count → 0 → source torn down

// New subscription — source re-executes (no stale cache)
const sub2 = safe$.subscribe(v => console.log('sub2:', v));
// 'source executed' printed again
```

---

#### Answer S-9

```ts
import { Observable, OperatorFunction, from } from 'rxjs';

function takeEveryNth<T>(n: number): OperatorFunction<T, T> {
  return (source$: Observable<T>) => new Observable<T>(subscriber => {
    let index = 0;
    return source$.subscribe({
      next: value => {
        if (index % n === 0) subscriber.next(value);
        index++;
      },
      error:    e  => subscriber.error(e),
      complete: () => subscriber.complete(),
    });
  });
}

from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipe(
  takeEveryNth(3)
).subscribe(console.log); // 0, 3, 6, 9
```

---

#### Answer S-10

```ts
import { fromEvent, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil, map } from 'rxjs/operators';

const destroy$ = new Subject<void>();
const input = document.querySelector<HTMLInputElement>('#search')!;

function searchAPI(query: string) {
  return of([`result for ${query}`]).pipe(delay(400));
}

fromEvent<InputEvent>(input, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query =>
    searchAPI(query).pipe(
      catchError(() => of([])) // isolate inner-stream errors
    )
  ),
  takeUntil(destroy$)
).subscribe(results => console.log('results:', results));

// Cleanup
window.addEventListener('beforeunload', () => {
  destroy$.next();
  destroy$.complete();
});
```

---

*[Back to Table of Contents](#table-of-contents)*
