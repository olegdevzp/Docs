
# Capital.com Senior Angular/Ionic & System Architect Interview Questions

## Table of Contents
1. [Angular Architecture & Internals](#1-angular-architecture--internals)
2. [Ionic & Hybrid Mobile Development](#2-ionic--hybrid-mobile-development)
3. [RxJS & Reactive Programming](#3-rxjs--reactive-programming)
   - [RxJS Operators for Trading Platforms](#36-what-rxjs-operators-are-most-useful-when-working-with-trading-platforms-like-capitalcom)
4. [State Management & Data Flow](#4-state-management--data-flow)
5. [System Design & Performance (FinTech Context)](#5-system-design--performance-fintech-context)
6. [Testing, CI/CD & Best Practices](#6-testing-cicd--best-practices)

---

## 1. Angular Architecture & Internals

**1.1. How does Angular's Dependency Injection (DI) system work under the hood, and how would you optimize the injector hierarchy in a large-scale application?**  
[Link to Answer](#11-how-does-angulars-dependency-injection-di-system-work-under-the-hood-and-how-would-you-optimize-the-injector-hierarchy-in-a-large-scale-application)

**1.2. Explain the evolution of Angular's rendering engine from View Engine to Ivy. What specific architectural benefits does Ivy bring to a high-performance trading application?**  
[Link to Answer](#12-explain-the-evolution-of-angulars-rendering-engine-from-view-engine-to-ivy-what-specific-architectural-benefits-does-ivy-bring-to-a-high-performance-trading-application)

**1.3. Compare and contrast `ChangeDetectionStrategy.Default` and `ChangeDetectionStrategy.OnPush`. How do Angular Signals change this paradigm in recent versions?**  
[Link to Answer](#13-compare-and-contrast-changedetectionstrategydefault-and-changedetectionstrategyonpush-how-do-angular-signals-change-this-paradigm-in-recent-versions)
	**1.3.1. How would you debug a scenario where the UI is not updating despite the data changing in an `OnPush` component?**  
	[Link to Answer](#131-how-would-you-debug-a-scenario-where-the-ui-is-not-updating-despite-the-data-changing-in-an-onpush-component)

**1.4. In a large-scale enterprise application, how would you structure modules and lazy loading to ensure the fastest possible Time to First Byte (TTFB) and First Contentful Paint (FCP)?**  
[Link to Answer](#14-in-a-large-scale-enterprise-application-how-would-you-structure-modules-and-lazy-loading-to-ensure-the-fastest-possible-time-to-first-byte-ttfb-and-first-contentful-paint-fcp)

**1.5. Describe the concept of Micro-frontends in Angular using Module Federation. What are the trade-offs when implementing this in a financial platform?**  
[Link to Answer](#15-describe-the-concept-of-micro-frontends-in-angular-using-module-federation-what-are-the-trade-offs-when-implementing-this-in-a-financial-platform)

[Back to Table of Contents](#table-of-contents)

---

## 2. Ionic & Hybrid Mobile Development

**2.1. Explain the bridge mechanism in Capacitor vs. Cordova. How does communication between the JavaScript layer and the Native layer impact performance?**  
[Link to Answer](#21-explain-the-bridge-mechanism-in-capacitor-vs-cordova-how-does-communication-between-the-javascript-layer-and-the-native-layer-impact-performance)

**2.2. How do you handle complex navigation state in an Ionic application that mirrors a web platform?**  
[Link to Answer](#22-how-do-you-handle-complex-navigation-state-in-an-ionic-application-that-mirrors-a-web-platform)

**2.3. What strategies would you employ to optimize the startup time of an Ionic application on older Android devices?**  
[Link to Answer](#23-what-strategies-would-you-employ-to-optimize-the-startup-time-of-an-ionic-application-on-older-android-devices)

**2.4. Discuss the differences between running an app as a PWA vs. a native store app. How do you handle offline capabilities and data synchronization in a trading context?**  
[Link to Answer](#24-discuss-the-differences-between-running-an-app-as-a-pwa-vs-a-native-store-app-how-do-you-handle-offline-capabilities-and-data-synchronization-in-a-trading-context)
	**2.4.1. How would you resolve data conflicts when a user performs trades offline and then reconnects?**  
	[Link to Answer](#241-how-would-you-resolve-data-conflicts-when-a-user-performs-trades-offline-and-then-reconnects)

**2.5. How do you manage hardware-specific features (biometrics, secure storage) securely in an Ionic app?**  
[Link to Answer](#25-how-do-you-manage-hardware-specific-features-biometrics-secure-storage-securely-in-an-ionic-app)

[Back to Table of Contents](#table-of-contents)

---

## 3. RxJS & Reactive Programming

**3.1. Real-time data is critical for Capital.com. How would you manage multiple WebSocket streams for different financial instruments using RxJS to ensure memory safety and performance?**  
[Link to Answer](#31-real-time-data-is-critical-for-capitalcom-how-would-you-manage-multiple-websocket-streams-for-different-financial-instruments-using-rxjs-to-ensure-memory-safety-and-performance)

**3.2. Explain the difference between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`. Give a concrete example of when to use each in a trading application.**  
[Link to Answer](#32-explain-the-difference-between-switchmap-mergemap-concatmap-and-exhaustmap-give-a-concrete-example-of-when-to-use-each-in-a-trading-application)

**3.3. How do you handle error isolation in nested observable streams? If one stock ticker stream fails, how do you ensure the entire dashboard doesn't crash?**  
[Link to Answer](#33-how-do-you-handle-error-isolation-in-nested-observable-streams-if-one-stock-ticker-stream-fails-how-do-you-ensure-the-entire-dashboard-doesnt-crash)

**3.4. What are "Hot" and "Cold" Observables? Why is this distinction crucial when implementing a multicasted data store?**  
[Link to Answer](#34-what-are-hot-and-cold-observables-why-is-this-distinction-crucial-when-implementing-a-multicasted-data-store)

**3.5. Describe how you would implement a retry strategy with exponential backoff for failed network requests using RxJS operators.**  
[Link to Answer](#35-describe-how-you-would-implement-a-retry-strategy-with-exponential-backoff-for-failed-network-requests-using-rxjs-operators)

**3.6. What RxJS operators are most useful when working with trading platforms like Capital.com?**  
[Link to Answer](#36-what-rxjs-operators-are-most-useful-when-working-with-trading-platforms-like-capitalcom)

[Back to Table of Contents](#table-of-contents)

---

## 4. State Management & Data Flow

**4.1. Compare NgRx, Akita, and Elf. Which would you choose for a high-frequency trading dashboard and why?**  
[Link to Answer](#41-compare-ngrx-akita-and-elf-which-would-you-choose-for-a-high-frequency-trading-dashboard-and-why)

**4.2. How do you prevent "state bloat" in a long-running Single Page Application?**  
[Link to Answer](#42-how-do-you-prevent-state-bloat-in-a-long-running-single-page-application)

**4.3. Explain the concept of Selectors in NgRx. How can memoization optimization impact the performance of a grid rendering thousands of live prices?**  
[Link to Answer](#43-explain-the-concept-of-selectors-in-ngrx-how-can-memoization-optimization-impact-the-performance-of-a-grid-rendering-thousands-of-live-prices)

**4.4. How would you architect the state management to handle multi-tab synchronization (e.g., user changes theme or language in one tab, and it updates in others)?**  
[Link to Answer](#44-how-would-you-architect-the-state-management-to-handle-multi-tab-synchronization-eg-user-changes-theme-or-language-in-one-tab-and-it-updates-in-others)

[Back to Table of Contents](#table-of-contents)

---

## 5. System Design & Performance (FinTech Context)

**5.1. Design a high-level architecture for a real-time trading frontend that consumes millions of price updates per second. How do you handle throttling and debouncing without losing critical last-price accuracy?**  
[Link to Answer](#51-design-a-high-level-architecture-for-a-real-time-trading-frontend-that-consumes-millions-of-price-updates-per-second-how-do-you-handle-throttling-and-debouncing-without-losing-critical-last-price-accuracy)

**5.2. How do you secure a frontend application against XSS and CSRF attacks, specifically when dealing with financial transactions and JWT tokens?**  
[Link to Answer](#52-how-do-you-secure-a-frontend-application-against-xss-and-csrf-attacks-specifically-when-dealing-with-financial-transactions-and-jwt-tokens)

**5.3. Explain how you would implement a robust logging and monitoring system for client-side errors that respects user privacy and GDPR regulations.**  
[Link to Answer](#53-explain-how-you-would-implement-a-robust-logging-and-monitoring-system-for-client-side-errors-that-respects-user-privacy-and-gdpr-regulations)

**5.4. What is your approach to handling "Race Conditions" in the frontend when multiple asynchronous processes depend on shared resources?**  
[Link to Answer](#54-what-is-your-approach-to-handling-race-conditions-in-the-frontend-when-multiple-asynchronous-processes-depend-on-shared-resources)

**5.5. How would you design a feature-flagging system to roll out a new trading interface to 5% of high-net-worth users first?**  
[Link to Answer](#55-how-would-you-design-a-feature-flagging-system-to-roll-out-a-new-trading-interface-to-5-of-high-net-worth-users-first)

[Back to Table of Contents](#table-of-contents)

---

## 6. Testing, CI/CD & Best Practices

**6.1. Differentiate between Unit, Integration, and E2E testing in the context of an Angular/Ionic app. What is your preferred stack (e.g., Jest vs. Jasmine, Cypress vs. Playwright)?**  
[Link to Answer](#61-differentiate-between-unit-integration-and-e2e-testing-in-the-context-of-an-angularionic-app-what-is-your-preferred-stack-eg-jest-vs-jasmine-cypress-vs-playwright)

**6.2. How do you verify the correctness of financial calculations on the frontend?**  
[Link to Answer](#62-how-do-you-verify-the-correctness-of-financial-calculations-on-the-frontend)

**6.3. Describe a CI/CD pipeline for a hybrid Ionic app. How do you automate deployments to both the Apple App Store and Google Play Store?**  
[Link to Answer](#63-describe-a-cicd-pipeline-for-a-hybrid-ionic-app-how-do-you-automate-deployments-to-both-the-apple-app-store-and-google-play-store)

**6.4. How do you enforce code quality and architectural standards in a team of 20+ frontend developers?**  
[Link to Answer](#64-how-do-you-enforce-code-quality-and-architectural-standards-in-a-team-of-20-frontend-developers)
	**6.4.1. What automated tools would you include in the pre-commit hooks?**  
	[Link to Answer](#641-what-automated-tools-would-you-include-in-the-pre-commit-hooks)

[Back to Table of Contents](#table-of-contents)


## Answers

### 1. Angular Architecture & Internals

### 1.1. How does Angular's Dependency Injection (DI) system work under the hood, and how would you optimize the injector hierarchy in a large-scale application?

**Under the Hood:**
Angular's DI system is hierarchical and based on a tree of injectors that mirrors the component tree.
- **ElementInjector:** Created for each DOM element with a directive/component. It prioritizes local providers (`providers` array in Component/Directive decorator).
- **EnvironmentInjector (formerly ModuleInjector):** Configured via `NgModule` or `standalone` routes. It acts as the fallback if the ElementInjector doesn't find the token.
- **Resolution:** When a dependency is requested, Angular searches the current `ElementInjector`. If not found, it bubbles up to the parent `ElementInjector`. If it reaches the root Component without success, it switches to the `EnvironmentInjector` hierarchy, eventually reaching the `NullInjector` (which throws an error).

**Optimization in Large-Scale Apps:**
- **Tree-Shakable Providers:** Always prefer `{ providedIn: 'root' }` for services. This creates a singleton at the root level and allows unused services to be removed from the final bundle.
- **Avoid Component Providers:** Avoid adding services to a component's `providers` array unless you specifically need a separate instance for that component subtree. This prevents memory leaks and unintended state isolation.
- **Injection Tokens:** Use `InjectionToken` for configuration and primitive values to avoid collisions.
- **`inject()` function:** Use the modern `inject()` function for clearer, type-safe injection without constructor boilerplate.

[Back to Question](#1-angular-architecture--internals)

### 1.2. Explain the evolution of Angular's rendering engine from View Engine to Ivy. What specific architectural benefits does Ivy bring to a high-performance trading application?

**Evolution:**
- **View Engine (Legacy):** Compiled templates into separate `ngfactory.js` files. The compilation was slower, and the runtime required a larger framework core to interpret these factories.
- **Ivy (Current):** The "Locality" principle is key. Ivy compiles templates into instructions directly inside the component class (`ɵcmp`). This removes the need for separate factory files and allows for better static analysis.

**Benefits for Trading Apps:**
- **Bundle Size:** Because Ivy instructions are tree-shakable, the framework itself becomes smaller. Unused Angular features are stripped out, resulting in faster initial loads (TTFB/FCP).
- **Memory Efficiency:** Ivy generates DOM nodes more efficiently and allocates less memory for component metadata. In a trading dashboard with hundreds of blinking tickers, this reduces garbage collection pressure, leading to smoother 60fps animations.
- **Debugging:** Ivy enables standard browser console debugging (e.g., accessing component state via `ng.getComponent($0)`), crucial for diagnosing real-time data flow issues.

[Back to Question](#1-angular-architecture--internals)

### 1.3. Compare and contrast `ChangeDetectionStrategy.Default` and `ChangeDetectionStrategy.OnPush`. How do Angular Signals change this paradigm in recent versions?

**Comparison:**
- **Default:** Angular checks every component in the tree, from top to bottom, whenever *any* async event occurs (click, timer, XHR). This guarantees UI consistency but is computationally expensive for frequent updates.
- **OnPush:** Angular only checks the component if:
  1. An `@Input()` reference changes (requires immutability).
  2. An event originates from the component or its children.
  3. The `AsyncPipe` emits a new value.
  4. `ChangeDetectorRef.markForCheck()` is manually called.

**Impact of Signals:**
Signals shift the paradigm from **"Check everything to see what changed"** to **"Tell exactly what changed"**.
- **Fine-Grained Reactivity:** Signals establish a direct dependency graph. When a signal updates, only the specific DOM nodes (text, classes) that depend on it are updated.
- **Zoneless:** Signals pave the way for removing `zone.js`. This eliminates the overhead of monkey-patching global browser APIs, significantly improving performance in data-heavy apps where `zone.js` often triggers unnecessary change detection cycles.

[Back to Question](#1-angular-architecture--internals)

### 1.3.1. How would you debug a scenario where the UI is not updating despite the data changing in an `OnPush` component?

**Debugging Steps:**
1. **Check Object Mutability:** The most common cause is mutating an object (e.g., `user.name = 'New'`) instead of creating a new reference. `OnPush` relies on reference equality (`===`).
2. **Verify Trigger Source:** Did the update happen outside Angular's zone (e.g., a third-party WebSocket library callback)? If so, Angular doesn't know it happened. Wrap the update in `NgZone.run()` or manually call `ChangeDetectorRef.markForCheck()`.
3. **Angular DevTools:** Use the profiler to see if the change detection cycle actually ran for that component.
4. **Console Log in Template:** A temporary hack is to call a function in the template `{{ logRender() }}` to see if the view is being re-evaluated.

[Back to Question](#1-angular-architecture--internals)

### 1.4. In a large-scale enterprise application, how would you structure modules and lazy loading to ensure the fastest possible Time to First Byte (TTFB) and First Contentful Paint (FCP)?

**Structure & Optimization:**
- **Feature-Based Architecture:** Group code by domain (e.g., `TradeModule`, `PortfolioModule`) rather than type (e.g., `Components`, `Services`).
- **Lazy Loading:** strictly lazy load all non-critical routes using `loadChildren` or standalone component lazy routes.
- **Deferrable Views (`@defer`):** Use the new `@defer` block to delay loading heavy components (like complex trading charts) until they are in the viewport or interacted with.
- **Preloading Strategy:** Implement a custom `PreloadingStrategy` to load critical feature chunks in the background *immediately after* the initial render, ensuring instant navigation later without blocking the initial paint.
- **Standalone Components:** Migrating to standalone components reduces the overhead of `NgModule` compilation and enables more granular code-splitting.

[Back to Question](#1-angular-architecture--internals)

### 1.5. Describe the concept of Micro-frontends in Angular using Module Federation. What are the trade-offs when implementing this in a financial platform?

**Concept:**
Micro-frontends allow splitting a monolithic app into smaller, independently deployable applications. Webpack Module Federation allows these apps to share a single runtime (e.g., a single instance of Angular Core and RxJS) to avoid payload duplication, while still loading code dynamically at runtime.

**Trade-offs in FinTech:**
- **Pros:**
  - **Independent Deployment:** Different teams (e.g., "Payments", "Trading", "KYC") can deploy at their own pace without coordinating a massive release.
  - **Fault Isolation:** A bug in the "News Feed" widget is less likely to crash the critical "Trading Ticket".
- **Cons:**
  - **Complexity:** Orchestrating version compatibility (e.g., ensuring all remotes use compatible Angular versions) is difficult.
  - **Performance:** Initial load can suffer due to the overhead of fetching remote entry files and negotiating shared dependencies.
  - **State Management:** Sharing global state (like a WebSocket connection for prices) between isolated micro-frontends requires a well-designed, neutral communication layer (e.g., a shared library or window-based bus), which adds architectural complexity.

[Back to Question](#1-angular-architecture--internals)

### 2. Ionic & Hybrid Mobile Development

### 2.1. Explain the bridge mechanism in Capacitor vs. Cordova. How does communication between the JavaScript layer and the Native layer impact performance?

**The Bridge Mechanism:**
- **Cordova:** Relies on a web view bridge that serializes messages between JavaScript and Native code. Historically, this involved URL-scheme hacking or `iframe` bridges, which introduced significant latency. Every plugin call is an asynchronous message passing event.
- **Capacitor:** Modernizes this by injecting a native JavaScript interface directly into the WebView (`window.Capacitor`). It uses a more efficient message-passing channel that allows for batched execution and faster data serialization. Capacitor also runs more "native" code by default, keeping the JS layer thinner.

**Performance Impact:**
The communication bridge is a bottleneck. Frequent crossing of this bridge (e.g., streaming accelerometer data at 60Hz) causes serialization/deserialization overhead on the main thread, leading to UI jank.
- **Mitigation:** Batch native calls where possible, or write a custom native plugin that handles high-frequency data (like price ticks) entirely on the native side and only sends summarized updates to the WebView.

[Back to Question](#2-ionic--hybrid-mobile-development)

### 2.2. How do you handle complex navigation state in an Ionic application that mirrors a web platform?

**Handling Navigation:**
Ionic uses `IonRouterOutlet` which integrates with the Angular Router but adds a stack-based navigation history (Push/Pop) typical of native apps, unlike the browser's linear history.
- **Synchronization:** The challenge is keeping the URL in sync with the native stack. Use absolute paths for top-level tabs and relative paths for drill-down details.
- **State Preservation:** Use `RouteReuseStrategy` to detach and store the state of complex views (like a trading dashboard) when navigating forward, and reattach it when navigating back, preserving scroll position and filled forms.
- **Split Pane:** For tablet/desktop, use `ion-split-pane` to map side-menus to auxiliary routes, ensuring deep-linking works correctly (e.g., `/market/crypto/BTC` opens the market tab, crypto category, and BTC details).

[Back to Question](#2-ionic--hybrid-mobile-development)

### 2.3. What strategies would you employ to optimize the startup time of an Ionic application on older Android devices?

**Optimization Strategies:**
1. **Reduce Bundle Size:** Aggressive tree-shaking and lazy loading of modules. Ensure the initial chunk only contains the login/splash screen and core vendors.
2. **Server-Side Rendering (SSR) / Static Site Generation (SSG):** While harder in a hybrid app, pre-rendering the app shell (App Shell Pattern) ensures the user sees the UI structure immediately while JS downloads.
3. **Native Splash Screen:** Use the Capacitor Splash Screen API to hide the WebView initialization flickering. Configure `launchShowDuration: 0` and manually call `SplashScreen.hide()` only after the Angular app has fully rendered the first view (using `AfterViewInit`).
4. **Web View Warm-up:** Ensure the WebView is instantiated as early as possible in the native activity lifecycle.

[Back to Question](#2-ionic--hybrid-mobile-development)

### 2.4. Discuss the differences between running an app as a PWA vs. a native store app. How do you handle offline capabilities and data synchronization in a trading context?

**PWA vs. Native:**
- **PWA:** Distribution via URL, instant updates (no app store review), limited access to native APIs (no FaceID, limited background processing), storage quotas are stricter.
- **Native (Capacitor):** Full access to Native SDKs, better performance (warm webview), persistent storage, push notifications reliability.

**Offline & Sync:**
- **Storage:** Use `SQLite` (via Capacitor community plugin) instead of LocalStorage/IndexedDB for reliable, persistent, relational data storage on the device.
- **Queueing Pattern:** When offline, trading actions (buy/sell) are validated locally (optimistic UI) and added to a persisted Redux/NgRx "Outbox" queue.
- **Sync:** Monitor `Network.addListener()`. When connection is restored, replay the queue sequentially.

[Back to Question](#2-ionic--hybrid-mobile-development)

### 2.4.1. How would you resolve data conflicts when a user performs trades offline and then reconnects?

**Conflict Resolution:**
In trading, "Last Write Wins" is dangerous.
1. **Optimistic Updates:** Show the trade as "Pending" in the UI immediately.
2. **Version Vectors / Timestamps:** Send the trade with the client-side timestamp.
3. **Server Validation:** The server rejects the trade if the price has moved significantly beyond the user's "slippage tolerance" during the offline period.
4. **User Feedback:** If rejected, notify the user: "Market moved while you were offline. Trade for BTC at $50k failed. Current price: $52k. Retry?" Never automatically execute an old trade at a new price.

[Back to Question](#2-ionic--hybrid-mobile-development)

### 2.5. How do you manage hardware-specific features (biometrics, secure storage) securely in an Ionic app?

**Security Implementation:**
- **Biometrics:** Use `capacitor-community/native-biometric`. Never store passwords directly. Instead, store a refresh token or a session encryption key in the device's **Secure Enclave** (Keychain on iOS, Keystore on Android). The biometric prompt simply unlocks this secure storage.
- **Secure Storage:** Do not use LocalStorage (it's plain text). Use `ionic-secure-storage` or `capacitor-secure-storage-plugin` which wraps the native OS secure storage mechanisms.
- **Memory Hygiene:** Clear sensitive variables from memory (JS garbage collection is lazy) when the app goes to the background (`App.addListener('appStateChange')`) to prevent data leakage in task switcher snapshots.

[Back to Question](#2-ionic--hybrid-mobile-development)

### 3. RxJS & Reactive Programming

### 3.1. Real-time data is critical for Capital.com. How would you manage multiple WebSocket streams for different financial instruments using RxJS to ensure memory safety and performance?

**Management Strategy:**
- ** :** Instead of opening a unique WebSocket connection for every financial instrument (which kills the browser limit), use a single socket connection and "multiplex" messages.
- **RxJS Implementation:** Use `webSocket` from `rxjs/webSocket`. Create a central `socket$` subject.
- **Operator `multiplex()`:** Use the `multiplex` operator to filter messages for specific tickers. It handles sending the "subscribe" message when the first observer subscribes and the "unsubscribe" message when the last one unsubscribes.
- **Memory Safety:** Ensure strict unsubscription logic. In Angular components, use the `AsyncPipe` (which unsubscribes automatically) or `takeUntil(destroy$)`.
- **Performance:** Use `shareReplay({ bufferSize: 1, refCount: true })`. This multicasts the latest price to all subscribers (e.g., chart, order book, header ticker) without creating redundant socket subscriptions/connections.

[Back to Question](#3-rxjs--reactive-programming)

### 3.2. Explain the difference between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`. Give a concrete example of when to use each in a trading application.

**Operator Comparison:**
- **`switchMap` (The "Latest" Strategy):** Cancels the previous inner observable if a new value arrives.
  - *Example:* **Typeahead Search.** If the user types "APP" and then "APPLE", you want to cancel the request for "APP" and only show results for "APPLE".
- **`mergeMap` (The "Parallel" Strategy):** Subscribes to every new inner observable immediately and handles them concurrently.
  - *Example:* **Price Tickers.** If you receive price updates for AAPL, TSLA, and BTC simultaneously, you want to process and display all of them, not cancel one for the other.
- **`concatMap` (The "Queue" Strategy):** Waits for the previous inner observable to complete before starting the next.
  - *Example:* **Order Execution.** You must process "Approve Wallet" before "Execute Trade". Order matters strictly.
- **`exhaustMap` (The "Ignore" Strategy):** Ignores new emissions while the current inner observable is active.
  - *Example:* **"Buy" Button.** If a user frantically clicks "Buy", you execute the first click and ignore the rest until the trade confirms, preventing accidental double-spending.

[Back to Question](#3-rxjs--reactive-programming)

### 3.3. How do you handle error isolation in nested observable streams? If one stock ticker stream fails, how do you ensure the entire dashboard doesn't crash?

**Error Isolation:**
In RxJS, if an error reaches the main subscriber, the entire stream completes (dies). To prevent a single failing ticker from killing the whole dashboard:
- **Strategy:** Catch errors **inside** the inner observable (flattening operator).
- **Implementation:**
  ```typescript
  const dashboard$ = tickerIds$.pipe(
    mergeMap(id => getPriceStream(id).pipe(
      // Isolate error here!
      catchError(err => {
        console.error(`Ticker ${id} failed`, err);
        return of({ id, status: 'unavailable' }); // Return a safe fallback value
      })
    ))
  );
  ```
- **Result:** If `getPriceStream('BTC')` fails, only that specific inner stream is replaced by the fallback. The main `dashboard$` stream continues to process `AAPL`, `GOOG`, etc.

[Back to Question](#3-rxjs--reactive-programming)

### 3.4. What are "Hot" and "Cold" Observables? Why is this distinction crucial when implementing a multicasted data store?

**Distinction:**
- **Cold Observable:** The producer is created *inside* the observable for *each* subscriber.
  - *Example:* `HttpClient.get()`. If 3 components subscribe to `get('/prices')`, the browser sends 3 separate network requests.
- **Hot Observable:** The producer is created *outside* and shared.
  - *Example:* `new Subject()`, DOM events, WebSocket. If 3 components subscribe, they all listen to the *same* running stream.

**Crucial for Data Store:**
A state management store (like NgRx or a Service-with-Subject) must be **Hot**.
- If your store selects state as a Cold Observable, every component (Header, Sidebar, Dashboard) that subscribes to `selectUser()` would trigger the underlying calculation or API call again.
- You must use `shareReplay` or `BehaviorSubject` to ensure the state is calculated once and multicasted to all consumers to avoid performance degradation and inconsistent state.

[Back to Question](#3-rxjs--reactive-programming)

### 3.5. Describe how you would implement a retry strategy with exponential backoff for failed network requests using RxJS operators.

**Strategy:**
Instead of a simple `retry(3)` which retries immediately, use `retryWhen` (or `retry` with config in RxJS 7+) to delay the attempts.

**Implementation (RxJS 7+):**
```typescript
data$.pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
       // Exponential backoff: 1s, 2s, 4s...
       return timer(Math.pow(2, retryCount) * 1000); 
    }
  })
);
```

**Implementation (Legacy `retryWhen`):**
```typescript
data$.pipe(
  retryWhen(errors =>
    errors.pipe(
      // Merge map to use the index (i) for exponential calculation
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        if (retryAttempt > 3) {
          throw error; // Give up after 3 tries
        }
        return timer(Math.pow(2, retryAttempt) * 1000);
      })
    )
  )
);
```
This prevents hammering the server during an outage (Thundering Herd problem).

[Back to Question](#3-rxjs--reactive-programming)

### 3.6. What RxJS operators are most useful when working with trading platforms like Capital.com?

Trading platforms require handling high-frequency real-time data, multiple concurrent streams, error resilience, and optimal performance. Here's a comprehensive breakdown of the most critical RxJS operators:

#### **1. Core Real-time Data Operators**

**Data Streaming & WebSocket Management:**
- **`switchMap`** - Switch to the latest price stream when switching instruments. Cancels previous stream to prevent memory leaks.
- **`mergeMap`** - Handle multiple concurrent order requests without canceling them.
- **`exhaustMap`** - Prevent duplicate order submissions while one is processing (critical for preventing double-spending).
- **`concatMap`** - Maintain strict order execution sequence for dependent operations.

**Rate Control & Performance:**
- **`throttleTime`** - Limit chart updates to avoid overwhelming the UI (e.g., max 60 updates/sec).
- **`debounceTime`** - Delay search/filter inputs for instrument selection to reduce API calls.
- **`auditTime`** - Sample price ticks at regular intervals while preserving the last value.
- **`sampleTime`** - Regular sampling of high-frequency data for analysis.
- **`bufferTime`** - Batch multiple price updates for efficient rendering (e.g., combine 100 ticks into one update).
- **`bufferCount`** - Collect N ticks before processing (useful for candle generation).

**Data Comparison & Change Detection:**
- **`distinctUntilChanged`** - Only emit when price actually changes (reduces unnecessary updates).
- **`pairwise`** - Compare current vs previous tick for price direction indicators (↑/↓).
- **`scan`** - Calculate running totals (P&L accumulation, volume, moving averages).

#### **2. Combining Multiple Data Streams**

- **`combineLatest`** - Combine prices from multiple instruments for correlation analysis or portfolio calculations.
- **`withLatestFrom`** - Add latest account balance when placing orders.
- **`merge`** - Merge multiple WebSocket streams into a single observable.
- **`forkJoin`** - Wait for all initial data loads (user profile, positions, market data) before showing UI.
- **`zip`** - Pair bid/ask prices together for spread calculations.

#### **3. Error Handling & Resilience**

- **`catchError`** - Handle failed API calls gracefully without killing the stream.
- **`retry`** - Retry failed WebSocket connections automatically.
- **`retryWhen`** - Custom reconnection logic with exponential backoff.
- **`timeout`** - Cancel stale requests (critical in fast-moving markets).

#### **4. State Management**

- **`shareReplay`** - Cache and share latest instrument data across components (prevents duplicate API calls).
- **`share`** - Share WebSocket connection across multiple subscribers.
- **`startWith`** - Provide initial/default values for loading states.

#### **5. Filtering & Conditional Logic**

- **`filter`** - Filter trades by criteria (size, instrument, status).
- **`takeUntil`** - Stop streaming when user closes position or navigates away.
- **`takeWhile`** - Continue until condition met (e.g., until order is filled).
- **`skip` / `take`** - Skip initial values or limit emissions.

#### **6. Time-based Operations**

- **`interval`** - Periodic health checks or data refreshes.
- **`timer`** - Delayed actions (e.g., auto-logout timer).
- **`delay`** - Artificial delays for rate limiting API calls.

#### **Practical Trading Platform Examples**

**Example 1: Price Streaming with Throttling**
```typescript
// Update UI efficiently without losing last price
priceStream$.pipe(
  distinctUntilChanged(),
  throttleTime(100, undefined, { leading: true, trailing: true }),
  map(price => formatPrice(price))
).subscribe(displayPrice);
```

**Example 2: Order Submission with Duplicate Prevention**
```typescript
// Prevent double-submission during API latency
submitOrder$.pipe(
  exhaustMap(order => 
    this.api.placeOrder(order).pipe(
      catchError(err => this.handleOrderError(err)),
      retry(3)
    )
  )
).subscribe();
```

**Example 3: Real-time P&L Calculation**
```typescript
// Combine position data with live prices
combineLatest([
  positionStream$,
  priceStream$
]).pipe(
  map(([position, price]) => ({
    instrument: position.instrument,
    pnl: (price - position.openPrice) * position.volume
  })),
  scan((acc, current) => acc + current.pnl, 0)
).subscribe(totalPnL => this.updateDisplay(totalPnL));
```

**Example 4: WebSocket Reconnection with Exponential Backoff**
```typescript
// Resilient WebSocket connection
const websocket$ = webSocket(config).pipe(
  retryWhen(errors => 
    errors.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        if (retryAttempt > 10) {
          return throwError(() => error);
        }
        const delayMs = Math.min(1000 * Math.pow(2, retryAttempt), 30000);
        console.log(`Reconnecting in ${delayMs}ms...`);
        return timer(delayMs);
      })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);
```

**Example 5: Bid/Ask Spread Calculation**
```typescript
// Combine bid and ask streams
combineLatest([bidStream$, askStream$]).pipe(
  map(([bid, ask]) => ({
    bid,
    ask,
    spread: ask - bid,
    spreadPercent: ((ask - bid) / bid) * 100
  })),
  filter(data => data.spread > 0)
).subscribe(spreadData => this.displaySpread(spreadData));
```

**Example 6: Debounced Instrument Search**
```typescript
// Efficient search with cancellation
searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => 
    query.length >= 2 
      ? this.api.searchInstruments(query)
      : of([])
  ),
  catchError(() => of([]))
).subscribe(results => this.updateSearchResults(results));
```

**Example 7: Candle Generation from Ticks**
```typescript
// Buffer price ticks into time-based candles
priceStream$.pipe(
  bufferTime(1000), // 1-second candles
  filter(ticks => ticks.length > 0),
  map(ticks => ({
    open: ticks[0].price,
    high: Math.max(...ticks.map(t => t.price)),
    low: Math.min(...ticks.map(t => t.price)),
    close: ticks[ticks.length - 1].price,
    volume: ticks.reduce((sum, t) => sum + t.volume, 0),
    timestamp: Date.now()
  }))
).subscribe(candle => this.addCandleToChart(candle));
```

**Example 8: Multiplexed WebSocket for Multiple Instruments**
```typescript
// Single WebSocket connection, multiple instrument subscriptions
const socket$ = webSocket<Message>('wss://api.capital.com/prices');

function subscribeToInstrument(instrumentId: string): Observable<Price> {
  return socket$.pipe(
    // Subscribe on first observer
    tap(() => socket$.next({ 
      action: 'subscribe', 
      instrument: instrumentId 
    })),
    // Filter messages for this instrument
    filter(msg => msg.instrument === instrumentId),
    map(msg => msg.price),
    // Unsubscribe when no more observers
    finalize(() => socket$.next({ 
      action: 'unsubscribe', 
      instrument: instrumentId 
    })),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

// Usage: Each component gets its own stream, but shares the socket
const btcPrice$ = subscribeToInstrument('BTC/USD');
const ethPrice$ = subscribeToInstrument('ETH/USD');
```

**Key Considerations for Trading Platforms:**

1. **Memory Management**: Always unsubscribe using `takeUntil(destroy$)` or `AsyncPipe` to prevent memory leaks in long-running sessions.

2. **Performance**: Use `throttleTime` with `{ leading: true, trailing: true }` to ensure the latest value is always processed while limiting update frequency.

3. **Error Isolation**: Catch errors inside `mergeMap` operators to prevent one failed stream from killing the entire observable chain.

4. **Data Accuracy**: Use `auditTime` instead of `debounceTime` for prices—debouncing might never emit in volatile markets.

5. **Backpressure**: Implement `bufferTime` or `bufferCount` when receiving data faster than you can process it.

6. **Multicasting**: Use `shareReplay({ bufferSize: 1, refCount: true })` for expensive operations (WebSockets, API calls) that multiple components need to subscribe to.

[Back to Question](#3-rxjs--reactive-programming)

### 4. State Management & Data Flow

### 4.1. Compare NgRx, Akita, and Elf. Which would you choose for a high-frequency trading dashboard and why?

**Comparison:**
- **NgRx:** The industry standard. Uses Redux pattern (Actions, Reducers, Effects, Selectors). Extremely robust, boilerplate-heavy, best for complex enterprise apps where traceability is key.
- **Akita:** OOP-based state management. Easier for developers coming from backend backgrounds. Less boilerplate, supports entities and queries out of the box. Deprecated in favor of Elf.
- **Elf:** The successor to Akita. Built on top of RxJS, tree-shakable, modular. Very lightweight.

**Choice for High-Frequency Trading (HFT):**
I would choose **Elf** or a custom **Service-with-Subject** architecture (using `BehaviorSubject` and `scan` operator).
- **Reason:** NgRx adds a significant overhead (action dispatch -> reducer -> selector) for every single price tick. In HFT with 100 updates/sec, this CPU overhead adds up. Elf or raw RxJS services offer a "thinner" abstraction layer, allowing for faster updates and less garbage collection, which is critical for maintaining 60fps in a data-intensive grid.

[Back to Question](#4-state-management--data-flow)

### 4.2. How do you prevent "state bloat" in a long-running Single Page Application?

**Prevention Strategies:**
1. **Local State vs. Global State:** Don't put everything in the store. Form state, open/close UI toggles, and temporary filters should remain in the component or a local `ComponentStore`. Only shared data belongs in the global store.
2. **Entity Management:** Use `@ngrx/entity` to normalize data. Store objects by ID in a dictionary `{ [id]: entity }` rather than an array. This prevents duplication and makes updates O(1).
3. **Cache Invalidation:** Implement a meta-reducer or effect that clears specific state slices on logout or module destruction.
4. **Pagination/Infinite Scroll:** Never store "all history". Store only the currently viewed window of data.

[Back to Question](#4-state-management--data-flow)

### 4.3. Explain the concept of Selectors in NgRx. How can memoization optimization impact the performance of a grid rendering thousands of live prices?

**Selectors & Memoization:**
Selectors are pure functions that slice a piece of state from the store.
- **Memoization:** NgRx selectors cache the last result. If the input arguments (the state slice) haven't changed (reference check), the selector returns the cached calculation immediately without re-executing the transformation logic.

**Impact on Trading Grid:**
Imagine a grid calculating `Profit/Loss = (CurrentPrice - OpenPrice) * Volume`.
- Without memoization: Every time *any* part of the state changes (e.g., a unrelated notification arrives), the P/L calculation would re-run for all 1000 rows.
- With memoization: The calculation only re-runs if `CurrentPrice` or `OpenPrice` specifically changes for that row. This prevents thousands of unnecessary mathematical operations per second, keeping the UI responsive.

[Back to Question](#4-state-management--data-flow)

### 4.4. How would you architect the state management to handle multi-tab synchronization (e.g., user changes theme or language in one tab, and it updates in others)?

**Architecture:**
1. **Storage Event:** The `localStorage` API fires a `storage` event in other tabs whenever a key is modified.
2. **Implementation:**
   - Create a `CrossTabSyncService`.
   - Listen to `window.addEventListener('storage', (event) => { ... })`.
   - When the "Theme" action is dispatched in Tab A, save it to LocalStorage.
   - Tab B receives the storage event.
   - The service in Tab B reads the new value and dispatches a `[Theme] Update from Storage` action to its own internal store.
3. **Broadcast Channel API:** For more complex data (not just strings), use the `BroadcastChannel` API, which allows sending structured JSON objects between browsing contexts (tabs/windows/iframes) on the same origin.

[Back to Question](#4-state-management--data-flow)

### 5. System Design & Performance (FinTech Context)

### 5.1. Design a high-level architecture for a real-time trading frontend that consumes millions of price updates per second. How do you handle throttling and debouncing without losing critical last-price accuracy?

**Architecture:**
1.  **Transport Layer:** WebSockets (using `protobuf` for binary data serialization to reduce payload size).
2.  **Worker Layer:** A dedicated **Web Worker** parses the incoming binary stream. This keeps the main thread free for rendering/user interaction.
3.  **State Layer:** The Worker posts processed updates to a shared `SharedArrayBuffer` or sends batched updates (e.g., every 16ms/60fps) to the main thread.

**Throttling vs. Debouncing:**
-   **Never Debounce Prices:** Debouncing waits for a pause. In a volatile market, prices change constantly, so a debouncer might never emit!
-   **Throttling (AuditTime):** Use `auditTime(16)` or `animationFrameScheduler`. This ignores intermediate values but guarantees that the *very last* emitted value in that time window is the one processed.
-   **Visual Throttling:** The internal data model can update 1000 times/sec, but the UI grid only re-renders when `requestAnimationFrame` fires, ensuring the user always sees the latest price on the next paint without freezing the browser.

[Back to Question](#5-system-design--performance-fintech-context)

### 5.2. How do you secure a frontend application against XSS and CSRF attacks, specifically when dealing with financial transactions and JWT tokens?

**Security Measures:**
-   **XSS (Cross-Site Scripting):**
    -   **Angular's Default Sanitization:** Angular automatically sanitizes values in property binding. Never use `bypassSecurityTrustHtml` unless absolutely necessary and audited.
    -   **Content Security Policy (CSP):** Implement a strict CSP header (`script-src 'self'`) to prevent execution of unauthorized scripts injected via malicious ads or compromised CDNs.
-   **CSRF (Cross-Site Request Forgery):**
    -   **SameSite Cookies:** Set the `SameSite=Strict` attribute on authentication cookies.
    -   **Anti-CSRF Tokens:** The backend injects a unique token in the cookie; Angular's `HttpClient` automatically reads this token (e.g., `XSRF-TOKEN`) and sends it back in a custom header (`X-XSRF-TOKEN`) for mutation requests.
-   **JWT Storage:**
    -   **Ideally:** Do NOT store JWTs in `localStorage` (accessible by XSS). Store them in **HttpOnly, Secure Cookies**.
    -   **If LocalStorage is mandatory:** Use short-lived tokens (5 min) and implement a sliding session with a refresh token rotation mechanism.

[Back to Question](#5-system-design--performance-fintech-context)

### 5.3. Explain how you would implement a robust logging and monitoring system for client-side errors that respects user privacy and GDPR regulations.

**Implementation:**
1.  **Global a Handler:** Implement Angular's `ErrorHandler` class to catch all unhandled exceptions.
2.  **PII Scrubbing:** Before sending the error report:
    -   Redact sensitive patterns (Credit Card Regex, Email Regex).
    -   Do not send the entire `store` state if it contains user balances or names.
    -   Use anonymized User IDs, not real names.
3.  **Sampling:** For high-traffic apps, don't log *every* error. Use a sampling rate (e.g., log 10% of errors) to prevent flooding the logs, unless it's a critical "Blocker" severity.
4.  **Tools:** Use Sentry or Datadog with "Data Scrubbing" rules configured on the server-side as a fail-safe.

[Back to Question](#5-system-design--performance-fintech-context)

### 5.4. What is your approach to handling "Race Conditions" in the frontend when multiple asynchronous processes depend on shared resources?

**Approach:**
1.  **SwitchMap:** The "Silver Bullet" for most race conditions (e.g., autocomplete). It cancels the previous pending request when a new one starts.
2.  **Locks / Mutexes:** For critical operations (like "Place Order"), implement a simple boolean lock:
    ```typescript
    if (this.isPlacingOrder) return;
    this.isPlacingOrder = true;
    this.tradeService.placeOrder().pipe(
      finalize(() => this.isPlacingOrder = false)
    ).subscribe();
    ```
3.  **Versioning:** When displaying data, the server should return a version number. If the frontend tries to update a trade with `version: 5` but the server has `version: 6`, the server rejects it (Optimistic Concurrency Control), and the frontend must re-fetch and re-prompt the user.

[Back to Question](#5-system-design--performance-fintech-context)

### 5.5. How would you design a feature-flagging system to roll out a new trading interface to 5% of high-net-worth users first?

**Design:**
1.  **Service:** Create a `FeatureFlagService` that initializes *before* the app bootstraps (`APP_INITIALIZER`).
2.  **Resolution:**
    -   Fetch flags from an API endpoint: `GET /api/flags`.
    -   The backend determines the user's segment ("High Net Worth") and returns: `{ "new-trading-ui": true }`.
3.  **Directive:** Create a structural directive `*appFeature="'new-trading-ui'"`:
    ```typescript
    @Input() set appFeature(flag: string) {
      if (this.featureService.isEnabled(flag)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
    ```
4.  **Route Guards:** Use `CanMatch` (Angular 14+) guards to load entirely different lazy-loaded modules based on the flag, keeping the bundle size small for users who don't have the feature.

[Back to Question](#5-system-design--performance-fintech-context)

### 6. Testing, CI/CD & Best Practices

### 6.1. Differentiate between Unit, Integration, and E2E testing in the context of an Angular/Ionic app. What is your preferred stack (e.g., Jest vs. Jasmine, Cypress vs. Playwright)?

**Differentiation:**
- **Unit Testing:** Tests individual components, services, or functions in isolation. All external dependencies are mocked.
  - *Example:* Testing a `PriceCalculatorService.calculateProfit()` method with mocked input data.
  - *Goal:* Verify business logic correctness. Fast (milliseconds), no DOM, no network.
- **Integration Testing:** Tests how multiple units work together. Some real dependencies, some mocked (e.g., real Angular DI but mocked HTTP).
  - *Example:* Testing a `TradingTicketComponent` that injects `OrderService` (real) and `HttpClient` (mocked via `HttpClientTestingModule`).
  - *Goal:* Verify component-service interaction. Medium speed.
- **E2E (End-to-End) Testing:** Tests the entire application from the user's perspective in a real browser. No mocks.
  - *Example:* Opening the app, logging in, navigating to "BTC/USD", placing a buy order, and verifying the order appears in the "Portfolio" tab.
  - *Goal:* Verify critical user flows work. Slow (seconds per test).

**Preferred Stack:**
- **Unit/Integration:** **Jest** over Jasmine. Jest is 3-5x faster due to parallel test execution and better caching. It has a superior mocking API (`jest.mock()`) and built-in code coverage.
- **E2E:** **Playwright** over Cypress. 
  - *Reasons:*
    - True multi-browser support (Chromium, Firefox, WebKit) vs. Cypress's limited Firefox/Edge support.
    - Better network interception (service workers, WebSockets).
    - Native mobile browser testing (critical for Ionic).
    - Faster and more reliable auto-waiting mechanism.

[Back to Question](#6-testing-cicd--best-practices)

### 6.2. How do you verify the correctness of financial calculations on the frontend?

**Verification Strategy:**
1. **Property-Based Testing:** Use libraries like `fast-check` to generate thousands of random inputs and verify invariants (e.g., `profit + loss === 0` for closed positions).
2. **Test Against Known Values:** For critical formulas (leverage, margin requirements), hard-code test cases with values verified by the finance team or regulatory documentation.
3. **Backend Parity Tests:** Run the same calculation in both frontend (TypeScript) and backend (e.g., Python). Assert that `frontend.calculate(X) === backend.calculate(X)` within a floating-point epsilon (`0.0001`).
4. **Precision Libraries:** Use `decimal.js` or `big.js` instead of JavaScript's native `Number` for currency calculations to avoid floating-point errors (e.g., `0.1 + 0.2 !== 0.3`).
5. **Snapshot Testing:** For complex UI outputs (like a P/L report table), use Jest snapshots. Any unintended change in the rendered calculation output will fail the test.

**Example Test:**
```typescript
import Decimal from 'decimal.js';

describe('Profit Calculation', () => {
  it('should calculate profit with precision', () => {
    const openPrice = new Decimal('1.23456');
    const closePrice = new Decimal('1.23789');
    const volume = new Decimal('1000');
    
    const profit = closePrice.minus(openPrice).times(volume);
    
    expect(profit.toFixed(2)).toBe('3.33'); // Expected: $3.33
  });
});
```

[Back to Question](#6-testing-cicd--best-practices)

### 6.3. Describe a CI/CD pipeline for a hybrid Ionic app. How do you automate deployments to both the Apple App Store and Google Play Store?

**CI/CD Pipeline Architecture:**

**Stage 1: Build & Test (GitHub Actions / GitLab CI)**
1. **Trigger:** Push to `main` or `release/*` branch.
2. **Steps:**
   - Install dependencies (`npm ci`).
   - Lint (`eslint`, `stylelint`).
   - Unit tests (`npm run test:ci` with Jest, headless, code coverage > 80%).
   - Build web app (`ionic build --prod`).
   - Build native apps:
     - Android: `ionic capacitor build android --release`
     - iOS: `ionic capacitor build ios --release`

**Stage 2: E2E Testing**
- Run Playwright tests against the built web app (`npm run e2e`).
- For native: Use **Appium** or **Detox** to run critical smoke tests on emulators/simulators.

**Stage 3: Code Signing & Deployment**

**Android (Google Play Store):**
1. **Keystore Secret:** Store the signing keystore (`.jks` file) and passwords in CI environment secrets.
2. **Build Signed APK/AAB:**
   ```bash
   ./gradlew bundleRelease \
     -Pandroid.injected.signing.store.file=$KEYSTORE_FILE \
     -Pandroid.injected.signing.store.password=$KEYSTORE_PASSWORD \
     -Pandroid.injected.signing.key.alias=$KEY_ALIAS \
     -Pandroid.injected.signing.key.password=$KEY_PASSWORD
   ```
3. **Upload to Play Store:** Use **Fastlane** (`supply` action):
   ```ruby
   lane :deploy_android do
     supply(
       track: 'internal', # internal → alpha → beta → production
       aab: 'android/app/build/outputs/bundle/release/app-release.aab'
     )
   end
   ```

**iOS (App Store):**
1. **Certificates & Provisioning Profiles:** Use **Fastlane Match** to sync signing certificates from a private Git repo (encrypted).
2. **Build & Archive:**
   ```bash
   fastlane gym --scheme "App" --export_method app-store
   ```
3. **Upload to App Store Connect:**
   ```ruby
   lane :deploy_ios do
     pilot( # TestFlight
       ipa: 'App.ipa',
       skip_waiting_for_build_processing: true
     )
   end
   ```
4. **Auto-Submit for Review (Optional):** Use `deliver` to automatically submit the build for App Store review after TestFlight validation.

**Stage 4: Notifications**
- Send Slack/Teams notification with build status and version number.
- Tag the Git commit with the release version (`v1.2.3`).

[Back to Question](#6-testing-cicd--best-practices)

### 6.4. How do you enforce code quality and architectural standards in a team of 20+ frontend developers?

**Enforcement Strategy:**

**1. Automated Code Quality Gates (Non-Negotiable)**
- **PR-Required Checks:** GitHub/GitLab branch protection rules mandate that all automated checks pass before merging.
- **SonarQube:** Integrate with CI to enforce:
  - Code Coverage: Minimum 80% line coverage.
  - Code Smells: Maximum "Technical Debt" threshold (e.g., no "A" rated issues unresolved).
  - Security: Zero critical vulnerabilities (dependency scanning with `npm audit`, Snyk).

**2. Architectural Decision Records (ADRs)**
- Document major architectural decisions (e.g., "Why we chose NgRx over Akita") in Markdown files in the repo (`docs/adr/001-state-management.md`).
- Enforce a rule: Any deviation from established patterns requires a new ADR, reviewed in an architecture guild meeting.

**3. Mono-repo with Nx (if applicable)**
- Use **Nx** to enforce module boundaries (e.g., `trading` module cannot import from `kyc` module).
- CI fails if a developer violates the dependency graph.

**4. Code Reviews with Checklists**
- Use GitHub PR templates with a checklist:
  - [ ] No `any` types (enforce `strict: true` in `tsconfig.json`).
  - [ ] All observables unsubscribed (or use `AsyncPipe`).
  - [ ] Unit tests added for new logic.
  - [ ] No hardcoded API URLs (use environment files).

**5. Pair Programming for Critical Features**
- For high-risk changes (e.g., payment flows), mandate pair programming or "mob" code reviews with 2+ senior engineers.

[Back to Question](#6-testing-cicd--best-practices)

### 6.4.1. What automated tools would you include in the pre-commit hooks?

**Pre-Commit Hook Tools (via Husky + lint-staged):**

**Setup:**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{scss,css}": [
      "stylelint --fix"
    ],
    "*.{ts,spec.ts}": [
      "jest --bail --findRelatedTests"
    ]
  }
}
```

**Tools:**
1. **ESLint (`eslint --fix`):**
   - Auto-fix formatting issues (trailing commas, semicolons).
   - Enforce rules: `no-console`, `@typescript-eslint/no-explicit-any`, `rxjs/no-ignored-subscription`.
2. **Prettier (`prettier --write`):**
   - Enforce consistent code formatting (line width, tabs vs. spaces).
   - Non-negotiable: Code is auto-formatted, no debates about style.
3. **Stylelint (`stylelint --fix`):**
   - Enforce SCSS/CSS best practices (e.g., no `!important`, BEM naming convention).
4. **Jest (Related Tests Only):**
   - Run unit tests *only* for the files being committed (`--findRelatedTests`).
   - Prevents committing broken code without slowing down every commit.
5. **Commitlint:**
   - Enforce conventional commit messages: `feat:`, `fix:`, `chore:`.
   - Enables automated changelog generation.
6. **Type Checking (`tsc --noEmit`):**
   - Run TypeScript compiler in no-emit mode to catch type errors before commit.

**Why Pre-Commit (not Pre-Push)?**
Catching issues *before* the commit is pushed prevents polluting the shared branch history with "fix lint" commits. It's faster feedback for the developer.

[Back to Question](#6-testing-cicd--best-practices)


