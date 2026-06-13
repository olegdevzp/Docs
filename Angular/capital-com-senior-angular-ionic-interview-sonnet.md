# Capital.com Senior Angular/Ionic Developer & System Architect - Technical Interview Questions

## Table of Contents
1. [Angular Core Architecture & Performance](#1-angular-core-architecture--performance)
2. [Ionic Framework & Capacitor Integration](#2-ionic-framework--capacitor-integration)
3. [RxJS & Reactive Programming Patterns](#3-rxjs--reactive-programming-patterns)
4. [State Management at Scale](#4-state-management-at-scale)
5. [Real-Time Data & WebSocket Management](#5-real-time-data--websocket-management)
6. [System Architecture & Design Patterns](#6-system-architecture--design-patterns)
7. [Security & Compliance (FinTech Focus)](#7-security--compliance-fintech-focus)
8. [Performance Optimization & Monitoring](#8-performance-optimization--monitoring)
9. [Testing Strategies & Quality Assurance](#9-testing-strategies--quality-assurance)
10. [DevOps, CI/CD & Mobile Deployment](#10-devops-cicd--mobile-deployment)
11. [Team Leadership & Code Quality](#11-team-leadership--code-quality)

---

## 1. Angular Core Architecture & Performance

**1.1. Explain how Angular's Dependency Injection (DI) system has evolved from Angular 2 to Angular 17+. How do you leverage the new inject() function and providedIn strategies?**

**1.2. What are the key differences between View Engine and Ivy compilation? How does Ivy's incremental DOM and locality principle improve bundle sizes?**

**1.3. Describe the Angular Change Detection mechanism in detail:**
	**1.3.1. How does Zone.js intercept asynchronous operations?**
	**1.3.2. When would you use `ChangeDetectionStrategy.OnPush` and what are its gotchas?**
	**1.3.3. How do Angular Signals (introduced in v16+) fundamentally change the change detection model?**

**1.4. Design the module architecture for a large-scale trading platform:**
	**1.4.1. How would you structure lazy-loaded modules to minimize initial bundle size?**
	**1.4.2. What strategies would you use for shared modules and preventing circular dependencies?**
	**1.4.3. Explain preloading strategies and when to use custom preloading logic.**

**1.5. What are Standalone Components in Angular 14+? How do they simplify architecture compared to NgModules?**

**1.6. Explain Angular's new Control Flow syntax (@if, @for, @switch) vs structural directives. What performance benefits do they offer?**

**1.7. How do you implement Micro-frontends in Angular using:**
	**1.7.1. Module Federation with Webpack 5?**
	**1.7.2. What are the challenges in sharing state between micro-frontends in a trading dashboard?**

**1.8. Describe Angular's compilation modes (JIT vs AOT). Why is AOT critical for production applications?**

[Back to Table of Contents](#table-of-contents)

---

## 2. Ionic Framework & Capacitor Integration

**2.1. Compare Capacitor vs Cordova architecture. Why has Ionic shifted to Capacitor as the preferred native runtime?**

**2.2. Explain the JavaScript-to-Native bridge in Capacitor:**
	**2.2.1. How does Capacitor handle asynchronous communication with native plugins?**
	**2.2.2. What are the performance implications of frequent bridge calls?**

**2.3. How would you optimize an Ionic Angular app for older Android devices (Android 7-8) with limited memory?**

**2.4. Design a navigation system for an Ionic app that maintains:**
	**2.4.1. Deep linking support**
	**2.4.2. State persistence across app restarts**
	**2.4.3. Browser-like back button behavior**

**2.5. Explain the differences in deployment strategies:**
	**2.5.1. Progressive Web App (PWA)**
	**2.5.2. Native iOS/Android via App Stores**
	**2.5.3. Hybrid approach with Capacitor**

**2.6. How do you handle platform-specific code in Ionic? Provide examples of using Platform API for iOS vs Android differences.**

**2.7. Implement secure storage for sensitive data (auth tokens, user credentials) in an Ionic app:**
	**2.7.1. How do you use Capacitor Secure Storage or Keychain/Keystore?**
	**2.7.2. What are the security considerations for biometric authentication?**

**2.8. How would you implement offline-first functionality for a trading app:**
	**2.8.1. Data synchronization strategies when connectivity returns**
	**2.8.2. Conflict resolution for user actions performed offline**
	**2.8.3. Handling critical real-time data that cannot be stale**

**2.9. What strategies would you use to reduce the initial load time of an Ionic app from 3-4 seconds to under 1 second?**

[Back to Table of Contents](#table-of-contents)

---

## 3. RxJS & Reactive Programming Patterns

**3.1. Explain the difference between Cold and Hot Observables. Why is this critical for real-time trading data streams?**

**3.2. Compare and contrast the following operators with real-world trading examples:**
	**3.2.1. `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`**
	**3.2.2. When would you use each for API calls or user interactions?**

**3.3. Design a solution to handle multiple WebSocket streams for 100+ financial instruments:**
	**3.3.1. How do you prevent memory leaks?**
	**3.3.2. How do you manage subscription lifecycle?**
	**3.3.3. How do you handle reconnection logic?**

**3.4. Implement error handling in nested observable chains:**
	**3.4.1. What's the difference between `catchError` placement (inner vs outer)?**
	**3.4.2. How do you isolate errors so one failed stream doesn't crash the entire dashboard?**

**3.5. Explain multicasting operators:**
	**3.5.1. `share()` vs `shareReplay()` vs `publish()` vs `multicast()`**
	**3.5.2. When would you use `refCount()` with a Subject?**

**3.6. Design a retry strategy with exponential backoff for failed API requests:**
	**3.6.1. Implement using `retry`, `retryWhen`, and `delay`**
	**3.6.2. How do you cap maximum retry attempts?**

**3.7. How would you implement debouncing and throttling for:**
	**3.7.1. Search input (user typing)**
	**3.7.2. Real-time price updates (preventing UI thrashing)**
	**3.7.3. Scroll events for infinite loading**

**3.8. What are Higher-Order Observables? Provide an example where you need to flatten nested observables.**

**3.9. Explain the role of Schedulers in RxJS. When would you use `asyncScheduler`, `animationFrameScheduler`, or `queueScheduler`?**

[Back to Table of Contents](#table-of-contents)

---

## 4. State Management at Scale

**4.1. Compare state management solutions for Angular:**
	**4.1.1. NgRx (Redux pattern)**
	**4.1.2. Akita (Entity-based)**
	**4.1.3. Elf (Modern functional approach)**
	**4.1.4. Signal-based state (Angular 16+)**
	**4.1.5. Which would you choose for a high-frequency trading dashboard and why?**

**4.2. Explain the NgRx architecture:**
	**4.2.1. Actions, Reducers, Effects, Selectors**
	**4.2.2. How does immutability impact performance?**
	**4.2.3. What is the role of the Entity Adapter?**

**4.3. Design a selector strategy that efficiently updates only changed components:**
	**4.3.1. How does memoization work in createSelector?**
	**4.3.2. How do you prevent unnecessary selector recalculations?**

**4.4. How would you prevent "state bloat" in a long-running SPA that's open for 8+ hours?**

**4.5. Implement a state synchronization mechanism across multiple browser tabs:**
	**4.5.1. Using BroadcastChannel API**
	**4.5.2. Using localStorage events**
	**4.5.3. What are the security implications?**

**4.6. How do you handle optimistic updates in state management:**
	**4.6.1. User places a trade**
	**4.6.2. Backend confirms or rejects**
	**4.6.3. How do you rollback state on failure?**

**4.7. Explain the concept of normalized state. Why is it important for relational data in trading applications?**

[Back to Table of Contents](#table-of-contents)

---

## 5. Real-Time Data & WebSocket Management

**5.1. Design a WebSocket service that handles:**
	**5.1.1. Automatic reconnection with exponential backoff**
	**5.1.2. Heartbeat/ping-pong mechanism**
	**5.1.3. Message queuing during disconnection**

**5.2. How would you handle 10,000 price updates per second without overwhelming the UI?**
	**5.2.1. Throttling strategies**
	**5.2.2. Virtual scrolling for large lists**
	**5.2.3. RequestAnimationFrame optimization**

**5.3. Implement a subscription management system:**
	**5.3.1. User subscribes to instruments**
	**5.3.2. Automatic unsubscribe when navigating away**
	**5.3.3. Handling duplicate subscriptions**

**5.4. How do you ensure data consistency when receiving updates from multiple sources (WebSocket, REST API, Cache)?**

**5.5. Design a failover mechanism if the primary WebSocket connection fails:**
	**5.5.1. Fallback to Server-Sent Events (SSE)**
	**5.5.2. Fallback to polling**
	**5.5.3. How do you prevent duplicate data?**

**5.6. Explain the trade-offs between:**
	**5.6.1. Full snapshot updates**
	**5.6.2. Delta/incremental updates**
	**5.6.3. Which is better for a real-time order book?**

[Back to Table of Contents](#table-of-contents)

---

## 6. System Architecture & Design Patterns

**6.1. Design the frontend architecture for a multi-platform trading application (Web, iOS, Android) with maximum code reuse.**

**6.2. Explain the following architectural patterns and when to use them:**
	**6.2.1. Smart vs Presentational Components**
	**6.2.2. Facade Pattern for API abstraction**
	**6.2.3. Repository Pattern for data layer**
	**6.2.4. Observer Pattern (already using RxJS)**

**6.3. How would you implement Feature Flags/Toggle system:**
	**6.3.1. For gradual rollouts (5% → 25% → 100%)**
	**6.3.2. For A/B testing new trading interfaces**
	**6.3.3. For instant kill-switch capabilities**

**6.4. Design a plugin/extension architecture that allows third-party widgets in the trading dashboard.**

**6.5. Explain how you would handle versioning of:**
	**6.5.1. API contracts**
	**6.5.2. Shared component libraries**
	**6.5.3. Native mobile app updates (mandatory vs optional)**

**6.6. How do you handle race conditions when:**
	**6.6.1. Multiple API calls modify the same resource**
	**6.6.2. User actions overlap with background sync**
	**6.6.3. WebSocket update arrives before API response**

**6.7. Design a caching strategy:**
	**6.7.1. In-memory cache for frequently accessed data**
	**6.7.2. IndexedDB for offline support**
	**6.7.3. Service Worker cache for static assets**
	**6.7.4. Cache invalidation strategies**

[Back to Table of Contents](#table-of-contents)

---

## 7. Security & Compliance (FinTech Focus)

**7.1. Explain common security vulnerabilities and mitigation:**
	**7.1.1. XSS (Cross-Site Scripting) - How does Angular's sanitization help?**
	**7.1.2. CSRF (Cross-Site Request Forgery) - Token strategies**
	**7.1.3. Clickjacking - X-Frame-Options and CSP**
	**7.1.4. Man-in-the-Middle attacks - TLS/SSL pinning**

**7.2. How do you securely handle JWT tokens:**
	**7.2.1. Storage (Memory vs LocalStorage vs HttpOnly Cookies)**
	**7.2.2. Refresh token rotation**
	**7.2.3. Token expiration handling**
	**7.2.4. Preventing token theft**

**7.3. Implement Content Security Policy (CSP) for a trading application:**
	**7.3.1. What directives are critical?**
	**7.3.2. How do you handle inline scripts/styles?**
	**7.3.3. Nonce vs Hash strategies**

**7.4. How would you secure WebSocket connections:**
	**7.4.1. WSS (WebSocket Secure)**
	**7.4.2. Authentication/Authorization**
	**7.4.3. Message encryption**

**7.5. Explain GDPR compliance requirements for client-side:**
	**7.5.1. Cookie consent**
	**7.5.2. Data minimization in logs**
	**7.5.3. Right to be forgotten**

**7.6. How do you prevent sensitive financial data from appearing in:**
	**7.6.1. Console logs**
	**7.6.2. Error reporting tools**
	**7.6.3. Browser DevTools Network tab**

**7.7. Implement multi-factor authentication (MFA) flow in the frontend:**
	**7.7.1. TOTP (Time-based One-Time Password)**
	**7.7.2. SMS/Email verification**
	**7.7.3. Biometric (Face ID, Touch ID)**

[Back to Table of Contents](#table-of-contents)

---

## 8. Performance Optimization & Monitoring

**8.1. Explain the key Web Vitals metrics:**
	**8.1.1. LCP (Largest Contentful Paint) - How to optimize?**
	**8.1.2. FID (First Input Delay) / INP (Interaction to Next Paint)**
	**8.1.3. CLS (Cumulative Layout Shift) - Common causes in SPAs**

**8.2. How would you optimize bundle size:**
	**8.2.1. Lazy loading modules**
	**8.2.2. Tree-shaking unused code**
	**8.2.3. Code splitting strategies**
	**8.2.4. Dynamic imports**

**8.3. Implement performance budgets in your build pipeline:**
	**8.3.1. What metrics would you track?**
	**8.3.2. How do you enforce them in CI/CD?**

**8.4. Optimize rendering performance:**
	**8.4.1. Virtual scrolling for large lists (e.g., 10,000 order history)**
	**8.4.2. trackBy functions in *ngFor**
	**8.4.3. Pure pipes vs impure pipes**
	**8.4.4. Detaching Change Detection for static content**

**8.5. How would you diagnose and fix a memory leak in Angular:**
	**8.5.1. Using Chrome DevTools Memory profiler**
	**8.5.2. Common causes (unsubscribed observables, event listeners)**
	**8.5.3. Using takeUntil pattern**

**8.6. Implement client-side monitoring:**
	**8.6.1. Error tracking (Sentry, Rollbar)**
	**8.6.2. Performance monitoring (New Relic, Datadog)**
	**8.6.3. Custom metrics for business KPIs**
	**8.6.4. Session replay tools**

**8.7. How do you optimize images and media:**
	**8.7.1. Lazy loading images**
	**8.7.2. Responsive images (srcset)**
	**8.7.3. Modern formats (WebP, AVIF)**
	**8.7.4. CDN strategies**

**8.8. Explain how you would use Service Workers:**
	**8.8.1. For offline functionality**
	**8.8.2. For background sync**
	**8.8.3. For push notifications**

[Back to Table of Contents](#table-of-contents)

---

## 9. Testing Strategies & Quality Assurance

**9.1. Design a comprehensive testing strategy:**
	**9.1.1. Unit tests - What percentage coverage target?**
	**9.1.2. Integration tests - Testing component interactions**
	**9.1.3. E2E tests - Critical user journeys**
	**9.1.4. Visual regression tests**

**9.2. Compare testing frameworks:**
	**9.2.1. Jasmine vs Jest - Pros/cons for Angular**
	**9.2.2. Karma vs Jest as test runners**
	**9.2.3. When to choose one over the other?**

**9.3. How do you test Angular components:**
	**9.3.1. Testing with TestBed**
	**9.3.2. Shallow vs Deep component testing**
	**9.3.3. Mocking dependencies and services**
	**9.3.4. Testing OnPush components**

**9.4. How do you test RxJS observables:**
	**9.4.1. Using marble testing**
	**9.4.2. Testing async behavior with fakeAsync and tick**
	**9.4.3. Testing WebSocket streams**

**9.5. How would you verify financial calculations in tests:**
	**9.5.1. Decimal precision issues**
	**9.5.2. Edge cases (negative values, zero, infinity)**
	**9.5.3. Currency conversion accuracy**

**9.6. E2E testing for Ionic apps:**
	**9.6.1. Cypress vs Playwright vs Appium**
	**9.6.2. Testing on real iOS/Android devices**
	**9.6.3. Simulating native gestures**

**9.7. How do you implement:**
	**9.7.1. Smoke tests for critical paths**
	**9.7.2. Contract testing for APIs**
	**9.7.3. Performance testing (load testing)**

**9.8. What is your approach to TDD (Test-Driven Development) in Angular?**

[Back to Table of Contents](#table-of-contents)

---

## 10. DevOps, CI/CD & Mobile Deployment

**10.1. Design a CI/CD pipeline for an Ionic Angular application:**
	**10.1.1. Build stages (lint, test, build, deploy)**
	**10.1.2. Parallel execution for web, iOS, Android**
	**10.1.3. Environment-specific configurations (dev, staging, prod)**

**10.2. How do you automate iOS and Android app deployment:**
	**10.2.1. Fastlane for App Store Connect and Google Play Console**
	**10.2.2. Handling certificates and provisioning profiles**
	**10.2.3. Beta distribution (TestFlight, Firebase App Distribution)**

**10.3. Explain environment configuration strategies:**
	**10.3.1. environment.ts files in Angular**
	**10.3.2. Runtime configuration (loading config from API)**
	**10.3.3. Secrets management**

**10.4. How do you implement:**
	**10.4.1. Blue-Green deployments**
	**10.4.2. Canary releases**
	**10.4.3. Rolling updates with rollback capabilities**

**10.5. What monitoring do you implement in production:**
	**10.5.1. Application Performance Monitoring (APM)**
	**10.5.2. Real User Monitoring (RUM)**
	**10.5.3. Crash reporting**
	**10.5.4. Analytics (user behavior)**

**10.6. How do you handle app versioning:**
	**10.6.1. Semantic versioning (major.minor.patch)**
	**10.6.2. Build numbers vs version codes**
	**10.6.3. Forced update mechanism**

**10.7. Explain over-the-air (OTA) updates:**
	**10.7.1. Using Capacitor Live Updates or Ionic Appflow**
	**10.7.2. When can you use OTA vs requiring app store update?**
	**10.7.3. Regulatory considerations for financial apps**

[Back to Table of Contents](#table-of-contents)

---

## 11. Team Leadership & Code Quality

**11.1. How do you enforce code quality standards across a team of 20+ developers:**
	**11.1.1. ESLint configuration and custom rules**
	**11.1.2. Prettier for code formatting**
	**11.1.3. Pre-commit hooks (Husky)**
	**11.1.4. Code review best practices**

**11.2. What architectural documentation would you create:**
	**11.2.1. System architecture diagrams (C4 model)**
	**11.2.2. Component interaction flows**
	**11.2.3. API contracts and data models**
	**11.2.4. Decision logs (ADRs - Architecture Decision Records)**

**11.3. How do you manage technical debt:**
	**11.3.1. Identifying and tracking technical debt**
	**11.3.2. Allocating time for refactoring**
	**11.3.3. Balancing new features vs debt reduction**

**11.4. Explain your approach to:**
	**11.4.1. Code reviews - What do you look for?**
	**11.4.2. Pair programming for complex features**
	**11.4.3. Knowledge sharing (tech talks, documentation)**

**11.5. How do you onboard new developers to a complex Angular/Ionic codebase:**
	**11.5.1. Documentation structure**
	**11.5.2. Starter tasks**
	**11.5.3. Mentorship approach**

**11.6. What metrics do you track for team performance:**
	**11.6.1. Code quality metrics (cyclomatic complexity, code coverage)**
	**11.6.2. Deployment frequency**
	**11.6.3. Mean time to recovery (MTTR)**
	**11.6.4. Bug escape rate**

**11.7. How do you handle disagreements about technical direction within the team?**

**11.8. Explain your approach to staying current with Angular ecosystem:**
	**11.8.1. Following Angular roadmap**
	**11.8.2. Evaluating new libraries**
	**11.8.3. Planning migration to new versions**

[Back to Table of Contents](#table-of-contents)











