# Express.js — Junior to Senior Roadmap

A learning roadmap of **Express.js** concepts, APIs, and patterns organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Setting up a project](#l1-setting-up-a-project)
  - [Routing basics](#l1-routing-basics)
  - [Request object](#l1-request-object)
  - [Response object](#l1-response-object)
  - [Middleware basics](#l1-middleware-basics)
  - [Serving static files](#l1-serving-static-files)
  - [Template engines](#l1-template-engines)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Router — modular routing](#l2-router--modular-routing)
  - [Middleware — intermediate patterns](#l2-middleware--intermediate-patterns)
  - [Error handling](#l2-error-handling)
  - [Body parsing and file uploads](#l2-body-parsing-and-file-uploads)
  - [Cookies and sessions](#l2-cookies-and-sessions)
  - [Environment configuration](#l2-environment-configuration)
  - [Validation and sanitization](#l2-validation-and-sanitization)
  - [Authentication — JWT and sessions](#l2-authentication--jwt-and-sessions)
  - [Database integration](#l2-database-integration)
  - [REST API design conventions](#l2-rest-api-design-conventions)
- [Level 3 — Senior](#level-3--senior)
  - [Application architecture](#l3-application-architecture)
  - [Security hardening](#l3-security-hardening)
  - [Rate limiting and throttling](#l3-rate-limiting-and-throttling)
  - [Caching strategies](#l3-caching-strategies)
  - [Logging and observability](#l3-logging-and-observability)
  - [WebSockets and real-time](#l3-websockets-and-real-time)
  - [Testing Express apps](#l3-testing-express-apps)
  - [Performance tuning](#l3-performance-tuning)
  - [Graceful shutdown and process management](#l3-graceful-shutdown-and-process-management)
  - [Deployment and production checklist](#l3-deployment-and-production-checklist)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Items marked with `*` are the most commonly used in day-to-day work.
- Framework-specific ecosystems (NestJS, Fastify, Koa) are explicitly excluded — see separate roadmaps for those.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single route.

| Term | What it is |
|---|---|
| **Express** | A minimal, unopinionated Node.js web framework for building HTTP servers and APIs. |
| **Application (`app`)** | The central Express object created by calling `express()`. Registers routes and middleware. |
| **Route** | A combination of an HTTP method + URL path + handler function. |
| **Handler** | A function `(req, res, next) => {}` that processes the incoming request. |
| **Middleware** | A function that sits in the request-response pipeline; can read/modify `req`/`res` and call `next()`. |
| **`req`** | The incoming HTTP request object — holds URL, headers, body, params, query, cookies. |
| **`res`** | The outgoing HTTP response object — used to send data back to the client. |
| **`next`** | A callback to pass control to the next middleware or route handler in the stack. |
| **Router** | A mini Express app used to group related routes and middleware. |
| **Port** | The TCP port the HTTP server listens on (e.g. `3000` for local development). |

> **Gotcha:** Express is not a full framework. It gives you routing and middleware — everything else (validation, auth, ORM) you add yourself via npm packages.

---

### L1 Setting up a project

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
```

Minimal server:

```js
// server.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

```bash
node server.js
# or with auto-restart during development:
npm install --save-dev nodemon
npx nodemon server.js
```

> **Gotcha:** `app.listen()` is a shorthand for `http.createServer(app).listen()`. You'll need the raw `http.Server` instance if you want to use WebSockets later.

---

### L1 Routing basics

| Method | What it does |
|---|---|
| `app.get(path, handler)` | Handle GET requests. * |
| `app.post(path, handler)` | Handle POST requests. * |
| `app.put(path, handler)` | Handle PUT requests. * |
| `app.patch(path, handler)` | Handle PATCH requests. * |
| `app.delete(path, handler)` | Handle DELETE requests. * |
| `app.all(path, handler)` | Handle all HTTP methods on a path. |
| `app.use(path?, handler)` | Mount middleware (optionally scoped to a path prefix). * |
| Route parameter `:id` | Dynamic segment in the path, accessible via `req.params.id`. * |
| Wildcard `*` | Matches any path segment; useful for catch-all 404 routes. |

```js
// Static route
app.get('/users', (req, res) => { /* ... */ });

// Route parameter
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

> **Gotcha:** Routes are matched in the order they are defined. Put specific routes before wildcard routes, and the 404 catch-all last.

---

### L1 Request object

| Property / Method | What it contains |
|---|---|
| `req.params` | URL route parameters (`/users/:id` → `{ id: '42' }`). * |
| `req.query` | Query string parameters (`?page=2&limit=10` → `{ page: '2', limit: '10' }`). * |
| `req.body` | Parsed request body (requires a body-parsing middleware). * |
| `req.headers` | All incoming HTTP headers (lowercase keys). * |
| `req.method` | HTTP method string: `'GET'`, `'POST'`, etc. |
| `req.url` | Request URL path + query string. |
| `req.path` | Path portion of the URL (no query string). |
| `req.hostname` | Hostname from the `Host` header. |
| `req.ip` | Remote IP address of the client. |
| `req.cookies` | Parsed cookies (requires `cookie-parser` middleware). |
| `req.get(header)` | Read a specific request header by name. |

```js
app.get('/search', (req, res) => {
  const { q, page = 1 } = req.query;
  res.json({ query: q, page: Number(page) });
});
```

> **Gotcha:** `req.query` values are always strings. Convert to numbers yourself before using them in math or database queries.

---

### L1 Response object

| Method | What it does |
|---|---|
| `res.send(body)` | Send a response (string, Buffer, or object). * |
| `res.json(obj)` | Send a JSON response with `Content-Type: application/json`. * |
| `res.status(code)` | Set the HTTP status code — chainable. * |
| `res.status(404).json({ error: 'Not found' })` | Combine status + JSON in one chain. * |
| `res.redirect(url)` | Send a 302 redirect. |
| `res.redirect(301, url)` | Send a permanent redirect. |
| `res.sendFile(path)` | Send a file as the response body. |
| `res.download(path)` | Prompt file download with `Content-Disposition: attachment`. |
| `res.set(header, value)` | Set a response header. |
| `res.cookie(name, value, options)` | Set a cookie on the response. |
| `res.clearCookie(name)` | Clear a cookie. |
| `res.end()` | End the response with no body. |

```js
app.post('/users', (req, res) => {
  const user = { id: 1, name: req.body.name };
  res.status(201).json(user);
});

app.get('/not-here', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});
```

> **Gotcha:** Only call one response method per request. Calling `res.json()` after `res.send()` throws a "headers already sent" error. Use `return res.json(...)` to be safe.

---

### L1 Middleware basics

Middleware functions run in order before the route handler. Each must either call `next()` or send a response.

```js
// Application-level middleware (runs on every request)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // pass control to the next handler
});

// Path-scoped middleware
app.use('/api', (req, res, next) => {
  console.log('API request');
  next();
});

// Third-party middleware
const express = require('express');
app.use(express.json());         // parse JSON bodies *
app.use(express.urlencoded({ extended: true })); // parse form bodies *
```

> **Gotcha:** If you forget to call `next()` and don't send a response, the request will hang indefinitely. Always do one or the other.

---

### L1 Serving static files

```js
// Serve everything in the /public folder at the root URL
app.use(express.static('public'));

// Serve at a URL prefix
app.use('/assets', express.static('public'));
```

> **Gotcha:** Place `express.static` before your API routes so static file serving short-circuits the middleware chain early.

---

### L1 Template engines

Express supports server-side rendering via template engines (EJS, Pug, Handlebars).

```bash
npm install ejs
```

```js
app.set('view engine', 'ejs');
app.set('views', './views'); // default

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', user: 'Alice' });
});
```

```html
<!-- views/index.ejs -->
<h1><%= title %></h1>
<p>Hello, <%= user %>!</p>
```

> **Gotcha:** Template engines are mostly used for full-stack apps. If you're building a JSON API consumed by a separate frontend, skip this and stick to `res.json()`.

---

## Level 2 — Mid-level

### L2 Router — modular routing

Split routes into separate files using `express.Router()`.

```js
// routes/users.js
const router = require('express').Router();

router.get('/', (req, res) => res.json({ users: [] }));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));
router.post('/', (req, res) => res.status(201).json({ created: true }));

module.exports = router;
```

```js
// server.js
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
```

> **Gotcha:** `req.params` inside a router only contains the params defined in that router's routes, not the parent mount path params — unless you pass `{ mergeParams: true }` to `Router()`.

```js
// To access parent params inside child router:
const router = express.Router({ mergeParams: true });
```

---

### L2 Middleware — intermediate patterns

| Pattern | Description |
|---|---|
| **Router-level middleware** | `router.use(fn)` — applies only to routes in that router. |
| **Route-specific middleware** | Pass middleware as extra args: `app.get('/path', authMiddleware, handler)`. * |
| **Middleware arrays** | Pass an array of middleware functions to a route. |
| **`next('route')`** | Skip remaining handlers for the current route and move to the next matching route. |

```js
// Authentication guard middleware
function requireAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Apply to a single route
app.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Apply to all routes in a router
router.use(requireAuth);
```

---

### L2 Error handling

Express has a special four-argument error middleware: `(err, req, res, next)`.

```js
// Throw errors from route handlers
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err); // pass to error handler
  }
});

// Centralized error handler — must be registered LAST
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});
```

Custom error class:

```js
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Usage in a handler
throw new AppError('User not found', 404);
```

> **Gotcha:** Async route handlers do not automatically forward thrown errors to the error middleware in Express 4. You must wrap them in `try/catch` and call `next(err)`. Express 5 (available as `express@5`) fixes this — `async` handlers automatically propagate rejections.

---

### L2 Body parsing and file uploads

```bash
npm install multer          # multipart/form-data (file uploads)
```

```js
// JSON body (built-in since Express 4.16)
app.use(express.json({ limit: '10mb' }));

// URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

// File uploads with multer
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('avatar'), (req, res) => {
  res.json({ file: req.file, body: req.body });
});

// Multiple files
app.post('/gallery', upload.array('photos', 10), (req, res) => {
  res.json({ files: req.files });
});
```

> **Gotcha:** Always validate file type and size in multer's `fileFilter` and `limits` options. Never trust the client-supplied MIME type alone — inspect the file magic bytes for critical uploads.

---

### L2 Cookies and sessions

```bash
npm install cookie-parser express-session
```

```js
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
}));

app.post('/login', (req, res) => {
  req.session.userId = 42;
  res.json({ ok: true });
});

app.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  res.json({ userId: req.session.userId });
});
```

> **Gotcha:** The default `express-session` store is in-memory and not suitable for production (it leaks memory and doesn't survive restarts). Use `connect-redis` or `connect-pg-simple` in production.

---

### L2 Environment configuration

```bash
npm install dotenv
```

```js
// Load at the very top of the entry file
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
```

```
# .env (never commit to git)
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
SESSION_SECRET=supersecret
NODE_ENV=development
```

| Practice | Why |
|---|---|
| Keep `.env` in `.gitignore` | Never leak secrets. |
| Provide a `.env.example` | Documents required variables for new contributors. |
| Validate env vars on startup | Fail fast if a required variable is missing. |

```js
// Validate on startup
['DATABASE_URL', 'SESSION_SECRET'].forEach(key => {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
});
```

---

### L2 Validation and sanitization

```bash
npm install express-validator
```

```js
const { body, param, validationResult } = require('express-validator');

const createUserRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
];

app.post('/users', createUserRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // safe to use req.body here
});
```

> **Gotcha:** Never trust client input. Validate and sanitize both at the HTTP layer (express-validator) and at the database layer (parameterized queries / ORM validation).

---

### L2 Authentication — JWT and sessions

```bash
npm install jsonwebtoken bcryptjs
```

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login — issue a token
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({ token });
});

// Auth middleware — verify token
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

> **Gotcha:** Store JWTs in `httpOnly` cookies rather than `localStorage` to prevent XSS theft. If using `Authorization` header, implement token refresh logic and short expiry times.

---

### L2 Database integration

Express has no built-in database layer. Common choices:

| Library | Use case |
|---|---|
| `pg` | Raw PostgreSQL client. Full control, more boilerplate. |
| `knex` | SQL query builder. Works with PG, MySQL, SQLite. |
| `sequelize` | Full ORM for SQL databases. |
| `mongoose` | MongoDB ODM. |
| `prisma` | Type-safe ORM with schema-first workflow (recommended for new projects). |

```js
// Example with prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
```

> **Gotcha:** Create the database client once and reuse the connection pool. Never instantiate a new client per request — you will exhaust the database connection pool.

---

### L2 REST API design conventions

| Convention | Example |
|---|---|
| Use nouns for resources, not verbs | `GET /users` not `GET /getUsers` |
| Use HTTP methods semantically | `POST` = create, `PUT` = full replace, `PATCH` = partial update, `DELETE` = remove |
| Nest related resources | `GET /users/:id/posts` |
| Return consistent response shapes | `{ data, meta, error }` |
| Use plural resource names | `/users`, `/products`, `/orders` |
| Version the API | `/api/v1/users` |
| HTTP status codes matter | 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401, 403, 404, 422, 500 |

```js
// Consistent response helper
const ok = (res, data, status = 200) => res.status(status).json({ data });
const fail = (res, message, status = 400) => res.status(status).json({ error: message });

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return fail(res, 'User not found', 404);
    ok(res, user);
  } catch (err) {
    next(err);
  }
});
```

---

## Level 3 — Senior

### L3 Application architecture

Move from a single file to a layered, maintainable structure.

```
src/
├── app.js            # Express app setup (no listen call)
├── server.js         # Entry point — calls app.listen()
├── config/           # Env vars, database config
├── routes/           # Route definitions only
├── controllers/      # Request/response logic
├── services/         # Business logic (no HTTP concerns)
├── repositories/     # Database access layer
├── middleware/        # Custom middleware
├── utils/            # Pure helper functions
└── errors/           # Custom error classes
```

Key principles:
- **Controllers** only parse `req`, call a service, and write `res`. Zero business logic.
- **Services** contain business rules. They are testable without HTTP.
- **Repositories** abstract all database queries. Swap the ORM without touching services.
- **Keep `app.js` and `server.js` separate** — `app.js` exports the Express instance so tests can import it without starting a server.

---

### L3 Security hardening

```bash
npm install helmet cors express-rate-limit
```

| Package / Practice | What it does |
|---|---|
| `helmet()` | Sets ~14 security-related HTTP headers (CSP, HSTS, X-Frame-Options, etc.). * |
| `cors()` | Configures Cross-Origin Resource Sharing with an allowlist. * |
| Disable `X-Powered-By` | `app.disable('x-powered-by')` — don't advertise the stack. |
| `express-rate-limit` | Limit repeated requests from the same IP. |
| Input validation | Validate and sanitize all user input (see express-validator). |
| Parameterized queries | Never concatenate user input into SQL strings. |
| `bcrypt` for passwords | Always hash with cost factor ≥ 12. |
| HTTPS in production | Terminate TLS at the load balancer or use `https.createServer()`. |

```js
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.disable('x-powered-by');

app.use(cors({
  origin: ['https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
```

> **Gotcha:** `helmet()` enables a strict Content-Security-Policy by default. This can break inline scripts and styles. Review each helmet option and configure for your app rather than blindly applying defaults.

---

### L3 Rate limiting and throttling

```js
const rateLimit = require('express-rate-limit');

// Global limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' },
});

app.use(globalLimiter);
app.use('/api/auth', authLimiter);
```

> **Gotcha:** The default in-memory store does not work across multiple processes or servers. Use `rate-limit-redis` for multi-instance deployments.

---

### L3 Caching strategies

| Strategy | When to use |
|---|---|
| **HTTP cache headers** | Idempotent GET responses that change infrequently. |
| **In-process cache** (`node-cache`, `lru-cache`) | Expensive computations within a single process. |
| **Redis cache** | Shared cache across multiple instances. * |
| **CDN / reverse proxy cache** | Public static or semi-static content. |

```js
const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

async function cacheMiddleware(ttlSeconds) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await client.get(key);
    if (cached) return res.json(JSON.parse(cached));
    res.sendResponse = res.json.bind(res);
    res.json = async (body) => {
      await client.setex(key, ttlSeconds, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
}

app.get('/products', await cacheMiddleware(60), async (req, res) => {
  const products = await db.getProducts();
  res.json(products);
});
```

---

### L3 Logging and observability

```bash
npm install winston morgan
```

```js
const winston = require('winston');
const morgan = require('morgan');

// Structured logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

// HTTP access log (use 'combined' in production)
app.use(morgan('dev', {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// Attach logger to req for use in handlers/services
app.use((req, res, next) => {
  req.logger = logger.child({ requestId: req.headers['x-request-id'] });
  next();
});
```

| Practice | Why |
|---|---|
| Structured JSON logs | Machine-parseable by log aggregators (Datadog, Loki, CloudWatch). |
| Correlation / request ID | Trace a single request across services and log entries. |
| Log levels | `error`, `warn`, `info`, `http`, `debug` — filter by environment. |
| Never log passwords or tokens | Scrub sensitive fields before logging. |
| Health check endpoint | `GET /health` returns 200 — used by load balancers and orchestrators. |

---

### L3 WebSockets and real-time

```bash
npm install socket.io
```

```js
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'https://myapp.com' },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('message', (data) => {
    io.emit('message', data); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000);
```

> **Gotcha:** Use `httpServer.listen()` instead of `app.listen()` when adding WebSockets — you need the underlying `http.Server` instance to attach Socket.IO.

---

### L3 Testing Express apps

```bash
npm install --save-dev jest supertest
```

```js
// app.js — export app without calling listen
const express = require('express');
const app = express();
app.use(express.json());
// ... routes
module.exports = app;

// server.js — only file that calls listen
const app = require('./app');
app.listen(process.env.PORT || 3000);
```

```js
// tests/users.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /users/:id', () => {
  it('returns a user', async () => {
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 404 for unknown user', async () => {
    const res = await request(app).get('/users/9999');
    expect(res.status).toBe(404);
  });
});
```

| Test type | Tools |
|---|---|
| Unit tests (services, utils) | `jest`, `vitest` |
| Integration tests (routes + DB) | `supertest` + test database |
| Contract tests (API shape) | `zod` schema assertions, `jest` |
| End-to-end | `playwright` against a running server |

> **Gotcha:** Don't test through HTTP for pure business logic. Test services directly as plain functions — faster, isolated, and easier to cover edge cases.

---

### L3 Performance tuning

| Technique | Impact |
|---|---|
| Use `compression` middleware | Gzip/brotli response bodies. Significant for JSON-heavy APIs. |
| Cluster mode | Spawn one worker per CPU core with Node's `cluster` module or PM2. |
| Avoid blocking the event loop | Never use sync file I/O (`fs.readFileSync`) in request handlers. |
| Connection pooling | Reuse database connections; don't open a new one per request. |
| Streaming large responses | `res.pipe()` instead of buffering the whole payload in memory. |
| `--max-old-space-size` | Tune the V8 heap for memory-intensive services. |
| Load testing | Benchmark with `autocannon` or `k6` before going to production. |

```bash
npm install compression
```

```js
const compression = require('compression');
app.use(compression());
```

---

### L3 Graceful shutdown and process management

```js
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully…`);
  server.close(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
    console.log('Connections closed. Exiting.');
    process.exit(0);
  });
  // Force exit if shutdown takes too long
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
```

> **Gotcha:** Kubernetes sends `SIGTERM` when it wants to terminate a pod. If your app doesn't handle it gracefully, in-flight requests will be dropped. `server.close()` stops accepting new connections but lets existing requests finish.

---

### L3 Deployment and production checklist

| Item | Notes |
|---|---|
| `NODE_ENV=production` | Disables Express error stack traces in responses. Enables template caching. |
| HTTPS / TLS termination | Handle at the reverse proxy (nginx, Caddy) or load balancer. |
| Reverse proxy | Put nginx or a load balancer in front of Express. Never expose Node directly on port 80. |
| Process manager | Use PM2 or run as a systemd service. Restart on crash. |
| Health check route | `GET /health` → `200 OK`. Used by k8s, ECS, and load balancers. |
| Centralized error logging | Capture unhandled rejections; send to Sentry or similar. |
| Graceful shutdown | Handle `SIGTERM` (see above). |
| Rate limiting | Protect all public endpoints. |
| Helmet security headers | Enable in production. |
| Dependency audit | Run `npm audit` regularly. Pin production dependency versions. |
| `.env` secrets management | Use Vault, AWS Secrets Manager, or k8s secrets — not plain `.env` files. |

```js
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});
```

---

## Quick reference table

| Skill | Level |
|---|---|
| Create an Express app and start a server | Junior |
| Define GET/POST/PUT/DELETE routes | Junior |
| Read `req.params`, `req.query`, `req.body` | Junior |
| Send JSON responses with correct status codes | Junior |
| Write and apply basic middleware | Junior |
| Serve static files | Junior |
| Modular routing with `express.Router()` | Mid-level |
| Route-specific and router-level middleware | Mid-level |
| Centralized error handling (`err, req, res, next`) | Mid-level |
| Parse JSON and form bodies | Mid-level |
| Handle file uploads with `multer` | Mid-level |
| Manage cookies and sessions | Mid-level |
| Load env vars with `dotenv` | Mid-level |
| Validate and sanitize input with `express-validator` | Mid-level |
| Implement JWT authentication | Mid-level |
| Integrate a database / ORM | Mid-level |
| Follow REST API design conventions | Mid-level |
| Layer application into controllers/services/repos | Senior |
| Harden security with `helmet`, CORS, HTTPS | Senior |
| Rate limit endpoints | Senior |
| Implement caching (Redis) | Senior |
| Set up structured logging and request IDs | Senior |
| Add WebSocket support with Socket.IO | Senior |
| Write integration tests with `supertest` | Senior |
| Tune performance (compression, clustering, pooling) | Senior |
| Implement graceful shutdown | Senior |
| Deploy and operate Express in production | Senior |
