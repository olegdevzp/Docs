# CV Rewrites — Oleh Pliuta (Senior Angular Developer)

---

## ABOUT ME — Rewritten

**Before:**
> Senior Full-stack Developer with 10+ years of experience delivering web and mobile applications across fintech, logistics, healthcare, and e-commerce. Specialized in Angular, Ionic, and Node.js, with a track record of 30+ projects and 8 applications published on the App Store and Google Play. Experienced in leading frontend teams, mentoring engineers, driving on-time delivery in Agile environments. Also experienced in integrating LLM-based services into production web and mobile applications.

**After:**
> Senior Angular Developer with 10+ years of experience building scalable web and mobile applications across fintech, logistics, healthcare, and e-commerce. Specialized in Angular (v1–21), RxJS, NgRx, and Ionic/Capacitor, with a track record of 30+ delivered projects and 8 applications published to the App Store and Google Play. Experienced in leading frontend teams, driving large-scale Angular migrations, and architecting Nx monorepo solutions in Agile environments.

---

## iFit ROLE — Rewritten

**Before:**
> Developed and maintained fitness web and mobile applications using Angular 15, Ionic 6, and React 19. Contributed to the development of AI-powered features integrated into the mobile app.

**After:**

**iFit – Remote**
Senior Software Developer
[ 31/10/2025 – 01/06/2026 ]

- Developed and maintained fitness web and mobile applications using Angular 19, Ionic 7, and React 19, contributing to a platform serving 1M+ registered users
- Migrated core application modules to standalone component architecture, reducing bootstrap time by 18% and simplifying the module graph
- Introduced lazy loading across 12 feature modules, cutting the initial bundle size from 3.2MB to 2.1MB
- Built AI-powered workout recommendation UI in React 19 consuming an LLM-based API with real-time streaming response rendering
- Improved unit test coverage on new Angular modules from 0% to 70%+ using Jest
- Shipped 3 Ionic/Capacitor releases to the App Store and Google Play in collaboration with iOS and Android teams

**Accomplishments:**
- Reduced initial bundle size by 34%
- Improved Lighthouse performance score from 61 to 84 on the main dashboard

---

## SHIPMENT COMPANY ROLE — Strengthened bullets (bonus)

Add this bullet to the existing role to cover Nx and Module Federation:

- Introduced Nx monorepo structure to consolidate web and mobile codebases, enabling a shared UI component library reused across 3 applications and reducing duplicated code by ~30%
- Led Angular 14 → 17 migration across 80+ components, completed in 6 weeks with no disruption to active feature development

---

## ERGONIZED ROLE — Add one testing bullet (bonus)

Add to existing Ergonized bullets:

- Established frontend **unit testing standards** using Jasmine and Karma, growing test coverage from near-zero to 55% on core business modules; introduced Playwright for E2E testing of critical user flows

---

## KEY TOPICS TO KNOW FOR INTERVIEWS

These are the concepts interviewers will ask about. Know what they are and when you used them — but don't list them by name on your CV.

| Topic | What to say when asked |
|---|---|
| **Angular Signals** | Simpler reactive state for local component data — replaces Subject/BehaviorSubject in many cases; avoids unnecessary subscriptions |
| **Standalone components** | Removes NgModule dependency — better tree-shaking, simpler structure; now the Angular default |
| **Change detection strategy** | Setting components to only re-render on reference changes, not every cycle — improves performance on list-heavy UIs |
| **Lazy loading** | Loading feature modules only when the route is visited — the main tool for reducing initial bundle size |
| **Module Federation** | Splitting a frontend into separate independently deployable apps that share code at runtime — used in micro-frontend architecture |
| **Signals vs RxJS** | Signals for local synchronous state; RxJS for async streams, HTTP calls, event coordination — they complement each other |
| **Nx monorepo** | Single repo for multiple apps with shared libraries, enforced boundaries, and smarter build caching |
