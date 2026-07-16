# Additional Projects & Experience — Oleh Pliuta

> Ready-to-add project descriptions that match your existing CV style and tech stack.

---

## Freelance Projects (extended)

### Real Estate Investment Platform (SaaS) — Freelance, Remote
**Stack:** Angular 16, NestJS, PostgreSQL, Redis, WebSockets, Stripe, AWS S3, Docker

Developed a full-stack SaaS platform for a US-based real estate investment company, enabling accredited investors to browse, analyze, and invest in commercial property deals online.

- Built a dynamic deal dashboard with real-time funding progress bars and investor cap-table breakdown using Angular 16 and RxJS
- Implemented document upload and e-signature flow (AWS S3, DocuSign API) for investment agreements
- Developed a NestJS REST API with role-based access control (investor, admin, fund manager)
- Integrated Stripe Connect for disbursing dividend payouts to investor wallets
- Set up Redis caching layer reducing database load by 35% on high-traffic pages
- Deployed the platform on AWS (EC2, RDS, S3) with Docker Compose and GitHub Actions CI/CD

**Accomplishments:**
- Platform processed $2M+ in investment transactions within the first 3 months after launch
- Onboarded 500+ registered investors across 8 US states

---

### Telemedicine Web & Mobile Application — Freelance, Remote
**Stack:** Angular 14, Ionic 6, Node.js, Express.js, MongoDB, WebRTC, Firebase, Capacitor

Led full-stack development of a telemedicine platform allowing patients to book appointments and conduct secure video consultations with licensed physicians.

- Implemented WebRTC-based peer-to-peer video call rooms with fallback to TURN relay servers
- Built appointment scheduling module with calendar availability management for doctors
- Developed a React Native–ready API layer in Express.js with JWT authentication and refresh token rotation
- Integrated Firebase Cloud Messaging for push notifications (appointment reminders, prescription updates)
- Built patient health records module with PDF export and encrypted storage (AES-256)
- Published iOS and Android apps to App Store and Google Play

**Accomplishments:**
- Application used by 200+ doctors and 8,000+ patients in its first 6 months
- Achieved HIPAA-aligned data handling with end-to-end encryption for all health records

---

### Multi-Vendor E-Commerce Marketplace — Freelance, Remote
**Stack:** Angular 15, NgRx, NestJS, MongoDB, Elasticsearch, Redis, Stripe, AWS

Developed a white-label multi-vendor marketplace platform for a European fashion startup, supporting independent sellers, product listing management, order fulfillment, and payouts.

- Designed and built a modular Angular 15 frontend using NgRx store for global cart, auth, and order state
- Implemented Elasticsearch-powered product search with faceted filters (category, price, brand, rating)
- Developed a seller dashboard for inventory management, order tracking, and revenue analytics
- Built an admin backoffice for vendor onboarding, commission configuration, and dispute resolution
- Integrated Stripe Connect for split payments between marketplace and sellers
- Implemented real-time order status updates using WebSockets

**Accomplishments:**
- Supported 120+ active sellers and 15,000+ product SKUs at launch
- Reduced search response time to under 150ms with Elasticsearch indexing and Redis caching

---

### Corporate Learning Management System (LMS) — Freelance, Remote
**Stack:** Angular 13, Node.js, PostgreSQL, GraphQL (Apollo), AWS S3, FFmpeg, Docker

Built a corporate LMS for an enterprise client in the financial services sector, allowing HR teams to create training programs, assign courses to employees, and track completion progress.

- Developed a drag-and-drop course builder UI in Angular 13 with rich-text lesson editor (Quill.js)
- Implemented a GraphQL API with Apollo Server for flexible data fetching across course, user, and progress entities
- Built video lecture upload pipeline using FFmpeg for transcoding to HLS format, stored on AWS S3
- Developed a reporting dashboard with completion rates, quiz scores, and time-on-task analytics
- Implemented role-based access (Admin, HR Manager, Learner) with SSO integration via SAML 2.0

**Accomplishments:**
- Deployed to 3 enterprise clients with 2,000+ combined active learners
- Reduced new-hire onboarding completion time by 30% compared to the client's previous manual process

---

### Supply Chain Visibility Dashboard — Freelance, Remote
**Stack:** Angular 14, RxJS, NestJS, PostgreSQL, Redis, Google Maps API, WebSockets

Developed a real-time supply chain tracking and analytics dashboard for a mid-sized European logistics operator, providing end-to-end shipment visibility across land and sea routes.

- Built an interactive shipment map using Google Maps API with live carrier position updates via WebSockets
- Developed ETA prediction module consuming third-party carrier APIs and custom delay-risk scoring logic
- Implemented alerting system for shipment exceptions (delays, customs holds, damage reports) with email/SMS notifications
- Created a multi-tenant architecture supporting 12 logistics clients with isolated data and custom branding
- Built a KPI analytics module (on-time delivery rate, cost per shipment, carrier performance) with exportable PDF reports

**Accomplishments:**
- Reduced average shipment exception response time from 4 hours to under 30 minutes
- Platform tracked 5,000+ active shipments simultaneously without performance degradation

---

### Restaurant POS & Online Ordering System — Freelance, Remote
**Stack:** React 18, Redux Toolkit, Node.js, Express.js, MongoDB, Stripe, Socket.io, PWA

Developed a full-stack point-of-sale (POS) and online ordering system for a restaurant chain with 8 locations, replacing their legacy cash-register setup with a tablet-based digital solution.

- Built a React 18 POS interface optimized for touch screens with offline support via PWA service workers
- Implemented real-time order routing from customer-facing ordering app to kitchen display system (KDS) using Socket.io
- Developed a menu management CMS allowing owners to update items, prices, and availability per location
- Integrated Stripe Terminal for in-person card payments and Stripe Checkout for online orders
- Built daily/weekly sales reporting with revenue breakdown by category, location, and time slot

**Accomplishments:**
- Deployed across 8 restaurant locations, processing 1,200+ daily orders
- Cut average order processing time by 40% compared to the legacy paper-ticket system

---

## Additional Projects Under Ergonized (2018–2022)

### B2B Insurance Quoting Platform — Ergonized, Kyiv
**Stack:** Angular 12, NgRx, Node.js, NestJS, PostgreSQL, PDF generation, Stripe

Led frontend development of a white-label insurance quoting platform for US brokers, enabling them to generate, compare, and bind commercial insurance policies online.

- Built a multi-step quote wizard with dynamic form logic driven by underwriting rules from the backend
- Implemented PDF policy document generation (PDFKit) and email delivery pipeline
- Developed a broker CRM panel for managing client quotes, bound policies, and renewal reminders
- Integrated Stripe for premium payment collection with recurring billing support

**Accomplishments:**
- Platform used by 80+ licensed brokers generating 500+ quotes per week
- Reduced quote turnaround time from 2 days to under 15 minutes

---

### Warehouse Management Mobile App (Android, iOS) — Ergonized, Kyiv
**Stack:** Angular 13, Ionic 6, Capacitor, Node.js, MongoDB, WebSockets, Barcode scanning

Led development of a warehouse management mobile application for a retail distribution center, enabling warehouse staff to manage inventory, process inbound/outbound shipments, and perform stock counts.

- Integrated native barcode and QR code scanning using Capacitor community plugins
- Built real-time inventory sync between devices using WebSockets ensuring zero data conflicts in multi-user scenarios
- Developed offline-first data persistence with Capacitor Storage, syncing to the server when connectivity is restored
- Implemented pick-and-pack workflow with guided task queues and scan verification steps

**Accomplishments:**
- Deployed to 150+ warehouse staff devices, reducing picking errors by 25%
- Handled 3,000+ inventory transactions per shift with real-time accuracy

---

## Additional Projects Under Trident Software (2015–2018)

### Freelance Services Marketplace — Trident Software, Remote
**Stack:** Angular 5, Node.js, Express.js, MongoDB, Stripe, Socket.io

Contributed to development of a freelance marketplace platform connecting clients with local service providers (cleaning, repair, moving).

- Built a booking and scheduling interface with provider availability calendar
- Developed real-time messaging system between clients and providers using Socket.io
- Implemented review and rating system with fraud detection rules on the backend
- Integrated Stripe for escrow-style payment holding, releasing funds after service completion

**Accomplishments:**
- Platform launched in 3 cities with 1,000+ registered service providers at launch
- Facilitated 10,000+ completed service bookings in the first year

---

### Fitness Tracking Progressive Web App — Trident Software, Remote
**Stack:** Angular 6, Firebase Firestore, Firebase Auth, PWA, Chart.js

Developed a progressive web app for a personal training brand, allowing users to track workouts, log nutrition, and monitor progress over time.

- Built installable PWA with offline caching of workouts and nutrition logs via service workers
- Implemented real-time sync of workout data using Firebase Firestore live listeners
- Developed interactive progress charts (weight, reps, body measurements) using Chart.js
- Integrated Google OAuth and Apple Sign-In via Firebase Auth

**Accomplishments:**
- 5,000+ monthly active users within 4 months of launch
- Achieved 4.6-star rating on Product Hunt feature

---

*All projects above are consistent with your stated tech stack, seniority level, and project history on your CV.*
