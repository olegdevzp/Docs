# Node.js Junior Interview Questions — Answers (Q1–Q20)

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

Source questions: [`node.js-questions - all levels.md`](node.js-questions%20-%20all%20levels.md) (Junior, Q1–Q20).

---

## Table of Contents

### Themes (chapters)

- [Ch 1 — Node.js Fundamentals](#ch-1--nodejs-fundamentals)
- [Ch 2 — Express.js Middleware](#ch-2--expressjs-middleware)

### All questions (quick jump)

- [Q1.1](#q11-what-is-nodejs) · [Q1.2](#q12-what-are-the-main-advantages-and-disadvantages-of-using-nodejs) · [Q1.3](#q13-what-kinds-of-tasks-is-nodejs-not-suitable-for) · [Q1.4](#q14-what-are-the-main-components-of-nodejs) · [Q1.5](#q15-how-can-a-nodejs-server-handle-many-concurrent-parallel-requests-from-clients-while-having-only-one-thread) · [Q1.6](#q16-is-it-possible-to-use-multiple-threads-which-modules-are-used-to-implement-this) · [Q1.7](#q17-does-nodejs-interpret-or-compile-program-code) · [Q1.8](#q18-how-do-you-read-large-files-using-nodejs)
- [Q1.9](#q19-what-are-libuv-and-v8-what-are-they-used-for) · [Q1.10](#q110-what-is-the-difference-between-microtasks-and-macrotasks-provide-examples-of-such-tasks) · [Q1.11](#q111-what-is-a-stream) · [Q1.12](#q112-what-types-of-streams-do-you-know) · [Q1.13](#q113-what-is-the-event-loop-what-components-does-it-consist-of-and-how-does-it-work) · [Q1.14](#q114-what-are-logging-and-monitoring) · [Q1.15](#q115-what-is-the-difference-between-a-monolith-and-a-microservice) · [Q1.16](#q116-what-is-the-difference-between-the-language-keywords-string-and-string)
- [Q2.1](#q21-what-is-middleware-used-for) · [Q2.2](#q22-how-do-you-move-from-one-middleware-to-another) · [Q2.3](#q23-how-do-you-prioritize-middleware) · [Q2.4](#q24-how-do-you-organize-an-error-handler)

---

## Ch 1 — Node.js Fundamentals

**Questions in this chapter**

- [Q1.1 What is Node.js?](#q11-what-is-nodejs)
- [Q1.2 What are the main advantages and disadvantages of using Node.js?](#q12-what-are-the-main-advantages-and-disadvantages-of-using-nodejs)
- [Q1.3 What kinds of tasks is Node.js not suitable for?](#q13-what-kinds-of-tasks-is-nodejs-not-suitable-for)
- [Q1.4 What are the main components of Node.js?](#q14-what-are-the-main-components-of-nodejs)
- [Q1.5 How can a Node.js server handle many concurrent parallel requests from clients while having only one thread?](#q15-how-can-a-nodejs-server-handle-many-concurrent-parallel-requests-from-clients-while-having-only-one-thread)
- [Q1.6 Is it possible to use multiple threads? Which modules are used to implement this?](#q16-is-it-possible-to-use-multiple-threads-which-modules-are-used-to-implement-this)
- [Q1.7 Does Node.js interpret or compile program code?](#q17-does-nodejs-interpret-or-compile-program-code)
- [Q1.8 How do you read large files using Node.js?](#q18-how-do-you-read-large-files-using-nodejs)
- [Q1.9 What are libuv and V8? What are they used for?](#q19-what-are-libuv-and-v8-what-are-they-used-for)
- [Q1.10 What is the difference between microtasks and macrotasks? Provide examples of such tasks.](#q110-what-is-the-difference-between-microtasks-and-macrotasks-provide-examples-of-such-tasks)
- [Q1.11 What is a stream?](#q111-what-is-a-stream)
- [Q1.12 What types of streams do you know?](#q112-what-types-of-streams-do-you-know)
- [Q1.13 What is the event loop? What components does it consist of and how does it work?](#q113-what-is-the-event-loop-what-components-does-it-consist-of-and-how-does-it-work)
- [Q1.14 What are logging and monitoring?](#q114-what-are-logging-and-monitoring)
- [Q1.15 What is the difference between a monolith and a microservice?](#q115-what-is-the-difference-between-a-monolith-and-a-microservice)
- [Q1.16 What is the difference between the language keywords `string` and `String`?](#q116-what-is-the-difference-between-the-language-keywords-string-and-string)

---

### Q1.1 What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser — typically on servers, CLIs, and tooling. It provides APIs for I/O (file system, networking, processes), a module system, and an event-driven, non-blocking architecture suited to I/O-heavy workloads such as HTTP APIs, proxies, and real-time apps.

	**Q1.1a** Is Node.js a framework or a language?

Node.js is a runtime environment, not a language. You write JavaScript (or compile TypeScript to JavaScript); Node.js executes it and exposes system-level capabilities through built-in modules like `node:fs`, `node:http`, and `node:net`.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.2 What are the main advantages and disadvantages of using Node.js?
**Advantages:**
- **Non-blocking I/O** — when a request waits on disk, network, or a database, Node starts the operation and moves on instead of blocking a thread. The OS and libuv handle the wait; when data is ready, a callback runs on the event loop. One thread can serve thousands of idle or slow connections because most time is spent waiting, not computing. This model fits chat servers, APIs, and proxies well — unlike traditional servers that tie up one thread per connection and hit memory limits sooner.
- **Single language** — JavaScript on both client and server can simplify teams and code sharing.
- **Large ecosystem** — npm provides a vast library of packages.
- **Fast iteration** — lightweight tooling and quick startup for APIs and microservices.
- **JSON-native** — natural fit for REST/JSON APIs and modern web front ends.

**Disadvantages:**
- **CPU-bound work** — JavaScript on the main thread runs synchronously; a tight loop, large JSON parse, or image resize can freeze the entire process. Other requests wait, timers slip, and latency spikes until the work finishes. Mitigations exist (`worker_threads`, queues), but they add complexity.
- **Callback/Promise complexity** — async flows spread logic across callbacks, `.then` chains, or `async/await`, which makes error handling, ordering, and debugging harder than straight sequential code. Unhandled rejections, forgotten `await`, and race conditions are common pitfalls without clear patterns.
- **Single-threaded model by default** — one Node process uses one main thread for JavaScript. A single slow route or memory spike affects every client connected to that process. Scaling usually means running multiple processes (`cluster`, containers) and handling shared state externally (Redis, DB).
- **npm dependency risk** — projects often pull in hundreds of transitive packages. That increases install size, audit surface, and exposure to abandoned, malicious, or breaking updates. Pinning versions and reviewing dependencies takes ongoing effort.
- **Less ideal for heavy computation** — workloads like video encoding, ML inference, or large matrix math are not Node's strength on a single thread. You can offload to workers or other services, but languages such as Python, Rust, or Go are often a better default for compute-heavy cores.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.3 What kinds of tasks is Node.js not suitable for?
Node.js is a poor default choice when the workload is primarily **CPU-intensive** rather than I/O-intensive: video encoding, large-scale data crunching, cryptographic brute force, complex scientific simulation, or tight real-time systems with hard latency guarantees on a single thread.

It is also less natural for **heavy multi-threaded computation** unless you explicitly use `worker_threads`, child processes, or external services. Monolithic enterprise apps with strict transactional complexity can be built in Node.js, but teams sometimes prefer ecosystems with stronger static typing and mature enterprise patterns out of the box.

	**Q1.3a** Can you still use Node.js for CPU-heavy tasks?

Yes, by offloading work to worker threads, separate processes, job queues, or specialized services (Python, Rust, GPU workers). The main process stays responsive while heavy work runs elsewhere.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.4 What are the main components of Node.js?
The main pieces are:

1. **V8** — executes JavaScript, compiles it to machine code, and manages the JS heap.
2. **libuv** — provides the event loop, thread pool, and cross-platform async I/O (files, DNS, etc.).
3. **Node.js bindings / C++ layer** — connects JavaScript APIs to libuv and OS primitives.
4. **Core modules** — built-in APIs (`node:fs`, `node:http`, `node:events`, `node:stream`, etc.).
5. **npm / package ecosystem** — dependency management and third-party libraries.

Together these form a runtime where JavaScript runs on V8 while libuv handles asynchronous system operations.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.5 How can a Node.js server handle many concurrent parallel requests from clients while having only one thread?
Node.js uses **non-blocking, event-driven I/O**. When a request needs network or disk work, Node starts the operation and registers a callback; it does not block the main thread waiting for the result. While I/O is in flight, the event loop can process other requests.

For example, reading a database or calling an external API returns control immediately; when data arrives, the callback or Promise continuation runs. This makes one thread efficient for many concurrent *waiting* connections. True parallel CPU work on multiple cores requires `worker_threads`, `cluster`, or child processes.

	**Q1.5a** Does "one thread" mean only one thing runs at a time?

JavaScript on the main thread runs one piece of synchronous code at a time, but many I/O operations can be in progress concurrently via the OS and libuv thread pool. Throughput comes from not blocking while waiting.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.6 Is it possible to use multiple threads? Which modules are used to implement this?
Yes. Common options:

- **`worker_threads`** — run JavaScript in separate threads with shared memory (`SharedArrayBuffer`) or message passing. Best for CPU-bound tasks inside one process.
- **`cluster`** — fork multiple Node processes (often one per CPU core) that share the same server port. Good for scaling HTTP servers across cores.
- **`child_process`** — spawn separate OS processes (`spawn`, `fork`, `exec`). Good for running scripts, CLIs, or isolating failures.

The default request-handling model still uses one main thread per process; these modules add parallelism when needed.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.7 Does Node.js interpret or compile program code?
Node.js **compiles** JavaScript via V8. V8 parses source code, builds an AST, and compiles hot functions to optimized machine code (JIT). It is not a line-by-line interpreter in the traditional sense.

Cold code may run in an interpreter tier first; frequently executed code is optimized further. Source you write is not ahead-of-time compiled to a separate binary by default — compilation happens at runtime inside V8.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.8 How do you read large files using Node.js?
Avoid `fs.readFile` / `fs.promises.readFile` for very large files — they load the entire file into memory. Prefer **streams**:

```javascript
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('/path/to/large.log'),
  async function* (source) {
    for await (const chunk of source) {
      // process chunk (string or Buffer)
    }
  }
);
```

Process data in chunks with a `Readable` stream, or pipe through transforms (parsing, compression, upload). This keeps memory usage bounded.

	**Q1.8a** When is `readFile` acceptable?

For small files (config, thumbnails, modest JSON payloads) where full in-memory loading is safe and simpler code is worth the trade-off.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.9 What are libuv and V8? What are they used for?
**V8** is Google's JavaScript engine. In Node.js it executes your JS, performs JIT compilation, manages the object heap, and runs the microtask queue (Promises, `queueMicrotask`).

**libuv** is a C library that powers Node's portability layer. It implements the **event loop**, async networking, file system operations (often via a **thread pool**), timers, DNS, and cross-platform abstractions (epoll, kqueue, IOCP).

In short: V8 runs JavaScript; libuv makes asynchronous I/O possible and schedules work back onto the main thread when operations complete.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.10 What is the difference between microtasks and macrotasks? Provide examples of such tasks.
**Macrotasks** (tasks) are scheduled in the event loop's main phases. Examples: `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` (Node).

**Microtasks** run after the current synchronous JS finishes and before the event loop continues to the next macrotask. Examples: Promise `.then` / `.catch` / `.finally`, `queueMicrotask`, `async/await` continuations (which use Promises internally).

Order in practice: run sync code → drain microtasks → take next macrotask → repeat. That is why `Promise.resolve().then(...)` often runs before `setTimeout(..., 0)`.

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// A, D, C, B
```

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.11 What is a stream?
A stream is an abstraction for working with data **incrementally** as a sequence of chunks instead of loading everything into memory at once. Node.js streams are `EventEmitter`-based objects you can read from, write to, or transform.

Streams are ideal for files, HTTP bodies, compression, encryption, and piping data between sources and destinations with controlled memory use.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.12 What types of streams do you know?
Node.js defines four fundamental stream types:

1. **Readable** — source of data (`fs.createReadStream`, HTTP request body).
2. **Writable** — destination (`fs.createWriteStream`, HTTP response).
3. **Duplex** — both readable and writable (TCP socket).
4. **Transform** — duplex stream that modifies data (`zlib.createGzip()`).

Utility streams like **`PassThrough`** forward data and are useful for testing or composing pipelines.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.13 What is the event loop? What components does it consist of and how does it work?
The event loop is the mechanism that lets Node.js perform non-blocking I/O by offloading operations to the system and running callbacks when work completes.

In libuv (simplified), phases include:

1. **Timers** — `setTimeout` / `setInterval` callbacks due now.
2. **Pending callbacks** — some deferred I/O callbacks.
3. **Idle, prepare** — internal use.
4. **Poll** — retrieve new I/O events; execute I/O callbacks.
5. **Check** — `setImmediate` callbacks.
6. **Close callbacks** — e.g. `socket.on('close')`.

Between phases, Node drains the **microtask queue** (Promises). If the call stack is empty, the loop picks the next phase. Blocking the call stack with long sync work delays all of this.

	**Q1.13a** What is the thread pool's role?

Some operations (parts of `fs`, DNS lookup, crypto) run in libuv's worker threads; when done, their callbacks are queued for the main thread's event loop.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.14 What are logging and monitoring?
**Logging** records application events — requests, errors, business actions, debug traces — usually as structured text or JSON (stdout, files, or log aggregators). Good logs include timestamps, severity, correlation IDs, and context for debugging.

**Monitoring** observes runtime health and behavior: CPU, memory, event loop lag, request latency, error rates, queue depth, and uptime. Tools (Prometheus, Grafana, Datadog, New Relic, Elastic, etc.) collect metrics and alert when thresholds break.

Logging answers "what happened on this request?"; monitoring answers "is the system healthy right now?"

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.15 What is the difference between a monolith and a microservice?
A **monolith** is one deployable application containing most or all business logic, often sharing one codebase and database. It is simpler to develop and deploy early but can become harder to scale teams and isolate failures as it grows.

A **microservice** architecture splits the system into many small, independently deployable services, each owning a bounded capability and often its own data store. Benefits include independent scaling and team ownership; costs include distributed complexity, networking, observability, and consistency challenges.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

### Q1.16 What is the difference between the language keywords `string` and `String`?
In JavaScript, **`string`** (lowercase) is a **primitive type** — an immutable UTF-16 value. **`String`** (uppercase) is the **wrapper object** for strings.

```javascript
const a = 'hello';        // primitive string
const b = new String('hello'); // String object (rarely used)

typeof a; // 'string'
typeof b; // 'object'

a === b;  // false
```

Primitives auto-box to `String` when you access properties like `'hi'.length`. Prefer primitives (`'text'`, template literals) for normal code; use `String` as a constructor almost never. In TypeScript, `string` is the type annotation for primitives; `String` refers to the object type and is discouraged for variables.

[↑ Ch 1 questions](#ch-1--nodejs-fundamentals) · [↑ Table of Contents](#table-of-contents)

---

## Ch 2 — Express.js Middleware

**Questions in this chapter**

- [Q2.1 What is middleware used for?](#q21-what-is-middleware-used-for)
- [Q2.2 How do you move from one middleware to another?](#q22-how-do-you-move-from-one-middleware-to-another)
- [Q2.3 How do you prioritize middleware?](#q23-how-do-you-prioritize-middleware)
- [Q2.4 How do you organize an error handler?](#q24-how-do-you-organize-an-error-handler)

---

### Q2.1 What is middleware used for?
Middleware functions sit in the request–response pipeline. They can inspect or modify `req` and `res`, end the response, or pass control to the next function. Typical uses:

- Parsing bodies (`express.json()`)
- Logging and request IDs
- Authentication and authorization
- CORS headers
- Rate limiting
- Validation
- Attaching shared context (user, db connection)

Express builds a stack of middleware per route; each piece handles a cross-cutting concern without duplicating logic in every route handler.

[↑ Ch 2 questions](#ch-2--expressjs-middleware) · [↑ Table of Contents](#table-of-contents)

---

### Q2.2 How do you move from one middleware to another?
Call **`next()`** when the current middleware is done and should not send a response. Express then runs the next matching middleware in the stack.

```javascript
function logger(req, res, next) {
  console.log(req.method, req.url);
  next(); // continue pipeline
}

function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

If you do not call `next()` or `res.send()` / `res.end()`, the request hangs. Call `next(err)` to jump to error-handling middleware.

	**Q2.2a** What happens if you call `res.json()` and then `next()`?

You should not — headers may already be sent, causing "Cannot set headers after they are sent" errors. Either respond or call `next()`, not both.

[↑ Ch 2 questions](#ch-2--expressjs-middleware) · [↑ Table of Contents](#table-of-contents)

---

### Q2.3 How do you prioritize middleware?
Order of registration is order of execution. Rules of thumb:

1. **Global early middleware** — security headers, logging, `express.json()`, CORS.
2. **Route-specific middleware** — auth, validation before handlers.
3. **Route handlers** — business logic.
4. **404 handler** — unmatched routes.
5. **Error handler last** — four-argument `(err, req, res, next)` functions.

```javascript
app.use(express.json());
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
```

More specific paths and routers can be mounted before generic catch-alls. Middleware defined on a route runs only for that route pattern, which also controls priority.

[↑ Ch 2 questions](#ch-2--expressjs-middleware) · [↑ Table of Contents](#table-of-contents)

---

### Q2.4 How do you organize an error handler?
Use a dedicated **error-handling middleware** with four parameters. Express recognizes the arity and routes `next(err)` calls to it. Place it after all routes and other middleware.

```javascript
// Async route — forward errors with next(err)
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Central error handler (last)
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  if (status >= 500) {
    console.error(err); // or structured logger
  }

  res.status(status).json({ error: message });
}
```

Good practices: normalize custom error types (`AppError` with `statusCode`), avoid leaking stack traces in production, log server errors with correlation IDs, and handle unhandled promise rejections in async routes via `next(err)` or a wrapper.

	**Q2.4a** How do you handle 404 separately from 500?

Add a 404 middleware before the error handler: `app.use((req, res) => res.status(404).json({ error: 'Not found' }))`. Operational 404s inside handlers can use `res.status(404)`; unexpected failures use `next(err)`.

[↑ Ch 2 questions](#ch-2--expressjs-middleware) · [↑ Table of Contents](#table-of-contents)

---
