# Comprehensive NestJS Projects by Level

This guide outlines NestJS portfolio and learning projects for junior, middle, and advanced developers. Each entry includes a project description, learning goals, a recommended tech stack, and practical recommendations—without implementation details.

## Table of Contents
- [Junior Level Projects](#junior-level-projects)
- [Middle Level Projects](#middle-level-projects)
- [Advanced Level Projects](#advanced-level-projects)

---

## Junior Level Projects

### 1. Task Management API (To-Do List)

**Description:**  
Build a REST API that manages personal or team tasks end to end: create, list, update, and delete items, with a small status workflow (e.g. pending → in progress → completed). Use in-memory storage first so you can focus on NestJS modules, DTOs, validation, and HTTP semantics before introducing PostgreSQL or auth.

**Recommendations:**
- Enable a **global `ValidationPipe`** in `main.ts` once; avoid repeating `@UsePipes` on every route.
- Add **pagination** (`?page=&limit=`) on `GET /tasks` early—it teaches query DTOs without a database.
- Use **`PartialType`** from `@nestjs/mapped-types` for update DTOs instead of duplicating fields.
- Defer auth, Swagger, and a database until CRUD and unit tests for `TasksService` are solid.
- **Portfolio tip:** Ship with a short README (endpoints, sample curl, how to run tests)—that matters more than extra features at this level.

**Learning Objectives:**
- Basic NestJS concepts (controllers, services, modules)
- CRUD operations
- Data Transfer Objects (DTOs)
- Basic validation
- In-memory data storage

**Tech Stack:**
- NestJS
- TypeScript
- `class-validator` / `class-transformer`
- `uuid` (task IDs)
- Jest (unit tests)

**Key Features:**
- Full task CRUD
- Status enum and filter by status
- Request validation via DTOs
- `NotFoundException` for missing resources

---

### 2. Simple Blog API

**Description:**  
A content-focused API with three bounded areas: **users** (authors), **posts** (title, body, publish state), and **comments** (nested under posts). Authors create and edit their own posts; comments are public read, authenticated write. Optional image URLs or uploads attach to posts. Query posts by keyword, date, or author without building full JWT flows yet—use a simple API key or “author id in header” only if you need a gentle auth preview.

**Recommendations:**
- Split **`UsersModule`**, **`PostsModule`**, and **`CommentsModule`** from day one; avoid a single “god” module.
- Model **post status** (`draft` / `published`) explicitly—teaches state and filtered lists.
- For uploads, start with **stored file path + URL in DB**; add Sharp or S3 only after basic Multer works.
- Add a **global exception filter** and consistent error shape (`statusCode`, `message`, `path`) before adding features.
- **Scope cut for v1:** Skip nested comment threads (replies-to-replies); flat comments per post are enough.
- **Portfolio tip:** Document module boundaries in the README so reviewers see you understand Nest structure.

**Learning Objectives:**
- Module organization
- Basic authentication concepts
- File uploads
- Query parameters and filtering
- Error handling

**Tech Stack:**
- NestJS
- TypeScript
- `class-validator` / `class-transformer`
- Multer or `@nestjs/platform-express` (file uploads)
- Local or cloud file storage (e.g. local disk for learning)
- Jest

**Key Features:**
- CRUD for posts
- Basic user management
- Comment system
- Image upload for posts
- Search and filtering

---

## Middle Level Projects

### 1. E-Commerce API with Authentication

**Description:**  
A backend for a small online shop: customers register and log in, browse a product catalog (categories, search, pagination), and place orders that snapshot line items and prices at checkout. Admins manage products and order status. Emphasize **correct relational modeling** (user → orders → order items → products), **JWT + role guards**, and **transactions** so order creation does not leave half-written rows if stock or payment validation fails.

**Recommendations:**
- Implement **auth + one resource (products)** before orders; orders depend on stable users and inventory rules.
- Use **`QueryBuilder` or Prisma `include`** for list endpoints with filters—avoid N+1 queries on category relations.
- On checkout, run **order + order items + stock decrement** in a single DB transaction.
- Return **`409 Conflict`** for duplicate email on register, not `401 Unauthorized`.
- Add **`@ApiTags` + Swagger** when routes stabilize; it helps you test and impress interviewers.
- **Scope cut for v1:** No payment gateway—mark orders `pending` / `paid` manually or via a mock webhook.
- **Portfolio tip:** Include an e2e test for “register → login → create order” as your flagship demo path.

**Learning Objectives:**
- JWT authentication and authorization
- Database integration (TypeORM or Prisma)
- Guards and middleware
- File uploads and image processing
- Advanced validation
- Entity relationships
- Transaction handling

**Tech Stack:**
- NestJS
- TypeScript
- PostgreSQL
- TypeORM or Prisma
- `@nestjs/jwt`, `@nestjs/passport`, Passport JWT strategy
- `bcrypt` (password hashing)
- `@nestjs/config`
- `class-validator` / `class-transformer`
- Optional: Multer, Sharp (image processing)
- Jest, Supertest (e2e)

**Key Features:**
- Register, login, JWT-protected routes
- Products, categories, inventory
- Orders and order items
- Role-based guards (e.g. admin, customer)
- Product search, pagination, price filters
- Optional product images

---

### 2. Real-Time Chat Application

**Description:**  
A dual-protocol app: **HTTP** for registration, login, room list, and message history; **WebSockets** for live messaging, join/leave rooms, typing indicators, and optional presence. Messages and room membership persist in PostgreSQL so reconnecting clients can load history. Design for one server first; note where Redis pub/sub would be needed for multiple instances.

**Recommendations:**
- Authenticate the **socket handshake** (JWT in auth payload or cookie)—do not trust client-sent `userId` in message bodies.
- Implement **join room → send message → broadcast to room** before DMs, files, or typing indicators.
- Persist messages **before** broadcasting so a crash does not lose chat history.
- Use **Socket.IO namespaces or rooms** aligned with your DB room IDs; keep naming consistent.
- Add **rate limiting** on message events early to prevent spam in demos.
- **Scope cut for v1:** Public rooms + history only; add private DMs and file uploads in v2.
- **Portfolio tip:** Record a 30-second screen capture of two browser tabs chatting—stronger than architecture diagrams alone.

**Learning Objectives:**
- WebSocket implementation
- Real-time communication
- Room management
- Message persistence
- Online user tracking
- File sharing in chat

**Tech Stack:**
- NestJS
- `@nestjs/websockets`, `@nestjs/platform-socket.io` (or native `ws`)
- Socket.IO or `ws` adapter
- PostgreSQL (or MongoDB) for messages and rooms
- TypeORM or Prisma
- JWT (HTTP + WebSocket handshake / guards)
- Redis (optional: presence, pub/sub across instances)
- Multer or object storage (S3-compatible) for attachments
- Jest

**Key Features:**
- Multiple chat rooms
- Private messaging
- File uploads
- Message history
- User presence indicators
- Typing indicators

---

## Advanced Level Projects

### 1. Microservices Architecture with Message Queues

**Description:**  
Split a fictional e-commerce domain into **user**, **product**, **order**, and **notification** services, with a single **API gateway** as the public entry point. Synchronous calls (RPC/TCP or HTTP) suit request/response paths; **async events** (order created, payment confirmed) suit email, SMS, and inventory updates via Redis, RabbitMQ, or NATS. Run everything locally with Docker Compose; treat Kubernetes as an optional stretch goal after one happy-path purchase flow works.

**Recommendations:**
- Start as a **modular monolith** with clear bounded contexts, then extract **one service** (e.g. notifications)—premature microservices waste time.
- Define **versioned event contracts** (`order.created.v1`) and idempotent consumers before adding more events.
- Put **auth and rate limiting only at the gateway**; services trust internal network or mTLS in production, not public exposure.
- Add **`@nestjs/terminus` health checks** per service before Docker Compose orchestration.
- Introduce **timeouts and structured errors** on gateway → service calls; log a **correlation ID** across hops.
- **Scope cut for v1:** TCP or HTTP between two services + one queue consumer; defer service discovery, circuit breakers, and K8s until stable.
- **Portfolio tip:** A diagram (gateway → services → broker) plus `docker compose up` instructions beats five half-finished repos.

**Learning Objectives:**
- Microservices communication
- Message queues (Redis, RabbitMQ, or NATS)
- Service discovery
- API Gateway pattern
- Distributed logging
- Health checks
- Circuit breaker pattern
- Event-driven workflows

**Tech Stack:**
- NestJS (multiple apps / monorepo)
- `@nestjs/microservices` (TCP, Redis, RabbitMQ, or NATS transport)
- API Gateway (NestJS HTTP app or dedicated gateway)
- PostgreSQL per service (or shared DB with clear boundaries)
- TypeORM or Prisma
- Redis and/or RabbitMQ (events, queues)
- Docker, Docker Compose
- Kubernetes (optional: deployments, services, configmaps)
- `@nestjs/terminus` (health checks)
- JWT at gateway
- Optional: OpenTelemetry, structured logging (Pino, Winston)
- Jest per service

**Key Features:**
- API gateway routing and auth
- User, product, order, notification services
- Async events (order created, paid, shipped)
- Timeouts and error handling between services
- Health and readiness probes
- Containerized local development

---

### 2. Multi-Tenant SaaS Platform

**Description:**  
A B2B backend where every API call runs in the context of a **tenant** (organization). Tenants have members, roles, subscription plans, and usage limits. Data isolation uses either a shared database with `tenantId` on every row (simplest to learn) or schema-per-tenant (harder ops). Billing webhooks from Stripe update entitlements; background jobs handle emails, reports, and trial expiry.

**Recommendations:**
- Pick **shared DB + `tenantId` + global guard/interceptor** first; document why you did not choose DB-per-tenant yet.
- Never accept **`tenantId` from the client body** on mutating routes—resolve tenant from JWT or subdomain.
- Use **Stripe test mode + webhook signature verification** as a dedicated milestone before custom billing UI.
- Enforce **tenant scope in repositories** (base query filter or Prisma middleware), not only in controllers.
- Add **per-tenant rate limits** (Redis) when you expose a public API—good interview talking point.
- **Scope cut for v1:** Two plans (free/pro), manual tenant admin, no custom domains; add white-label later.
- **Portfolio tip:** Explain your isolation model and one “cross-tenant leak” test you wrote (e.g. user A cannot read tenant B’s data).

**Learning Objectives:**
- Multi-tenancy patterns (shared DB with tenant ID vs database-per-tenant)
- Tenant isolation
- Custom domain handling
- Subscription management
- Feature flags
- Analytics and reporting
- Background job processing

**Tech Stack:**
- NestJS
- TypeScript
- PostgreSQL (row-level tenant isolation or separate schemas/databases)
- TypeORM or Prisma
- `@nestjs/jwt`, Passport, RBAC guards
- Redis (caching, rate limits, sessions)
- Bull or BullMQ (`@nestjs/bull`) for background jobs
- Stripe or similar (billing webhooks)
- `@nestjs/config`
- Optional: feature flag service (LaunchDarkly, Unleash, or DB-backed flags)
- Optional: SendGrid / SES for email
- Jest, e2e tests with tenant fixtures

**Key Features:**
- Tenant onboarding and management
- Subscription billing and webhooks
- Custom domains (routing / SSL at infra layer)
- Role-based access control per tenant
- API rate limiting per tenant
- Usage analytics
- White-label / branding settings

---

### 3. Real-Time Analytics Dashboard

**Description:**  
An observability-style backend: clients or services **emit events** (page views, API latency, errors); an ingestion layer validates and stores raw events; **aggregation jobs** roll up counts and percentiles into buckets (per minute/hour); a **query API** serves dashboards; **WebSockets** push live metric updates to connected browsers. Separate the write-heavy ingestion path from read-heavy dashboard queries to avoid one database doing both jobs poorly.

**Recommendations:**
- Define a **small event schema** (`eventType`, `timestamp`, `tenantId`, `payload`) and reject unknown types at the edge.
- Use **batch inserts** or a buffer (Redis Stream, queue) before writing to TimescaleDB/ClickHouse—do not insert one row per HTTP request at scale.
- Precompute **rollups in scheduled jobs**; dashboards read aggregates, not raw events, for default views.
- Keep **PostgreSQL for users, dashboards, alert rules**; use a time-series store only for metrics volume.
- Add **one alert rule** (threshold → notification) to show you understand ops use cases, not only charts.
- **Scope cut for v1:** Single metric (e.g. requests/min) + live counter; defer custom reports and Kafka.
- **Portfolio tip:** State expected throughput (“designed for X events/sec with batching”) even if you only load-test lightly.

**Learning Objectives:**
- Real-time data processing
- WebSocket scaling
- Time-series and aggregation patterns
- Caching strategies
- Performance monitoring
- Load balancing

**Tech Stack:**
- NestJS (ingestion API, WebSocket gateway, query API)
- `@nestjs/websockets` / Socket.IO or `ws`
- PostgreSQL (metadata, users, config)
- TimescaleDB, InfluxDB, or ClickHouse (time-series / analytics)
- Redis (caching, rate limiting, pub/sub for live updates)
- Optional: Kafka or Redis Streams (event ingestion pipeline)
- `@nestjs/schedule` or Bull for batch aggregation jobs
- `@nestjs/terminus`, Prometheus client (metrics)
- JWT or API keys for dashboard clients
- Jest, load testing (k6, Artillery) optional

**Key Features:**
- Real-time metrics collection
- Interactive dashboards over WebSockets
- Alert rules and notifications
- Data visualization APIs
- Historical data analysis
- Custom report generation

---

## How to Use This Guide

Start with junior projects to internalize NestJS structure and HTTP patterns. Move to middle projects for persistence, auth, and real-time features. Advanced projects are best tackled after you are comfortable with a single deployable app and basic testing.

Pick **one project per level**, ship a **v1 with explicit scope cuts** (see Recommendations), then iterate. Descriptions and tech stacks are the specification; your repository is the proof.
