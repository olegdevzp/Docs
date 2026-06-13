# Node.js Junior Interview Questions — Answers (Q21–Q40)

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

Source questions: [`node.js-questions - all levels.md`](node.js-questions%20-%20all%20levels.md) (Junior, Q21–Q40).

---

## Table of Contents

### Themes (chapters)

- [Ch 3 — JavaScript](#ch-3--javascript)
- [Ch 4 — Databases](#ch-4--databases)

### All questions (quick jump)

- [Q3.1](#q31-what-are-asynchrony-and-asynchronous-code) · [Q3.2](#q32-what-is-the-difference-between-var-let-and-const-why-should-you-use-const-if-a-variable-will-not-change-later-in-the-code) · [Q3.3](#q33-how-do-you-delay-the-execution-of-a-function-for-a-specific-amount-of-time) · [Q3.4](#q34-what-ways-of-declaring-a-function-do-you-know) · [Q3.5](#q35-what-is-an-anonymous-function) · [Q3.6](#q36-provide-examples-of-a-self-invoking-function) · [Q3.7](#q37-what-is-the-difference-between-a-function-expression-and-a-function-declaration) · [Q3.8](#q38-how-do-you-get-a-new-array-from-a-js-array-of-numbers-that-contains-only-numbers-greater-than-10-which-array-method-should-you-use) · [Q3.9](#q39-how-do-you-remove-an-element-from-an-array-and-an-object) · [Q3.10](#q310-what-is-the-void-type-used-for)
- [Q3.11](#q311-where-and-why-is-super-used) · [Q3.12](#q312-what-is-this-used-for-and-in-which-cases-should-you-use-it) · [Q3.13](#q313-what-is-nan-and-how-is-it-used) · [Q3.14](#q314-what-is-npm-what-alternatives-do-you-know) · [Q3.15](#q315-what-are-the-advantages-and-disadvantages-of-npm-compared-to-yarnpnpm) · [Q3.16](#q316-what-promise-api-methods-do-you-know-what-is-the-difference-between-them) · [Q3.17](#q317-describe-the-structure-of-an-http-requestresponse) · [Q3.18](#q318-what-are-new-set-and-new-map) · [Q3.19](#q319-what-are-the-logical-operators--and--and-how-do-they-differ-from-the-logical-operator-)
- [Q4.1](#q41-why-are-databases-needed-in-applications)

---

## Ch 3 — JavaScript

**Questions in this chapter**

- [Q3.1 What are asynchrony and asynchronous code?](#q31-what-are-asynchrony-and-asynchronous-code)
- [Q3.2 What is the difference between `var`, `let`, and `const`? Why should you use `const` if a variable will not change later in the code?](#q32-what-is-the-difference-between-var-let-and-const-why-should-you-use-const-if-a-variable-will-not-change-later-in-the-code)
- [Q3.3 How do you delay the execution of a function for a specific amount of time?](#q33-how-do-you-delay-the-execution-of-a-function-for-a-specific-amount-of-time)
- [Q3.4 What ways of declaring a function do you know?](#q34-what-ways-of-declaring-a-function-do-you-know)
- [Q3.5 What is an anonymous function?](#q35-what-is-an-anonymous-function)
- [Q3.6 Provide examples of a self-invoking function.](#q36-provide-examples-of-a-self-invoking-function)
- [Q3.7 What is the difference between a function expression and a function declaration?](#q37-what-is-the-difference-between-a-function-expression-and-a-function-declaration)
- [Q3.8 How do you get a new array from a JS array of numbers that contains only numbers greater than 10? Which array method should you use?](#q38-how-do-you-get-a-new-array-from-a-js-array-of-numbers-that-contains-only-numbers-greater-than-10-which-array-method-should-you-use)
- [Q3.9 How do you remove an element from an array and an object?](#q39-how-do-you-remove-an-element-from-an-array-and-an-object)
- [Q3.10 What is the `void` type used for?](#q310-what-is-the-void-type-used-for)
- [Q3.11 Where and why is `super()` used?](#q311-where-and-why-is-super-used)
- [Q3.12 What is `this` used for and in which cases should you use it?](#q312-what-is-this-used-for-and-in-which-cases-should-you-use-it)
- [Q3.13 What is `NaN` and how is it used?](#q313-what-is-nan-and-how-is-it-used)
- [Q3.14 What is NPM? What alternatives do you know?](#q314-what-is-npm-what-alternatives-do-you-know)
- [Q3.15 What are the advantages and disadvantages of NPM compared to Yarn/PNPM?](#q315-what-are-the-advantages-and-disadvantages-of-npm-compared-to-yarnpnpm)
- [Q3.16 What Promise API methods do you know? What is the difference between them?](#q316-what-promise-api-methods-do-you-know-what-is-the-difference-between-them)
- [Q3.17 Describe the structure of an HTTP request/response.](#q317-describe-the-structure-of-an-http-requestresponse)
- [Q3.18 What are `new Set()` and `new Map()`?](#q318-what-are-new-set-and-new-map)
- [Q3.19 What are the logical operators `&&` and `||`, and how do they differ from the logical operator `??`?](#q319-what-are-the-logical-operators--and--and-how-do-they-differ-from-the-logical-operator-)

---

### Q3.1 What are asynchrony and asynchronous code?
**Asynchrony** means an operation does not block the rest of your program while waiting for a result. The caller starts the work, continues other tasks, and handles the outcome later via a callback, Promise, or `async/await`.

**Asynchronous code** is code structured around deferred completion: timers, HTTP requests, file I/O, database queries. In Node.js this is central — the event loop processes many in-flight operations without waiting on each one synchronously.

```javascript
// synchronous — blocks until done
const data = fs.readFileSync('file.txt');

// asynchronous — returns immediately; result handled later
const data = await fs.promises.readFile('file.txt');
```

	**Q3.1a** Is async the same as parallel?

Not always. Async often means concurrent *waiting* on one thread. Parallel means multiple computations at the same time (multiple threads/processes). Node.js async I/O is usually concurrent, not parallel, unless you use workers or clustering.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.2 What is the difference between `var`, `let`, and `const`? Why should you use `const` if a variable will not change later in the code?
| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function (or global) | Block | Block |
| Hoisting | Hoisted, initialized `undefined` | Temporal dead zone until declaration | Temporal dead zone until declaration |
| Reassignment | Allowed | Allowed | Not allowed (binding is constant) |
| Re-declaration in same scope | Allowed | Not allowed | Not allowed |

Use **`const` by default** when the binding should not be reassigned. That signals intent, prevents accidental reassignment, and helps tooling optimize. Note: `const` does not make objects immutable — you can still mutate object properties; you just cannot reassign the variable itself.

```javascript
const user = { name: 'Ann' };
user.name = 'Bob'; // OK — mutating object
user = {};         // Error — rebinding
```

Use **`let`** when you need reassignment (counters, loop variables with changing values). Avoid **`var`** in modern code due to confusing scoping and hoisting behavior.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.3 How do you delay the execution of a function for a specific amount of time?
Use **`setTimeout`** for a one-time delay or **`setInterval`** for repeated execution:

```javascript
setTimeout(() => {
  console.log('runs once after 2 seconds');
}, 2000);

const id = setInterval(() => {
  console.log('runs every second');
}, 1000);
clearInterval(id); // stop repeating
```

In `async/await` code, wrap `setTimeout` in a Promise:

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await delay(500);
```

`setTimeout` schedules a macrotask; exact timing is not guaranteed if the event loop is busy.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.4 What ways of declaring a function do you know?
Common forms in modern JavaScript:

1. **Function declaration** — `function foo() {}`
2. **Function expression** — `const foo = function() {}`
3. **Arrow function** — `const foo = () => {}`
4. **Method shorthand** (in objects/classes) — `{ foo() {} }`
5. **Generator** — `function* gen() {}`
6. **Async function** — `async function foo() {}` / `const foo = async () => {}`
7. **Constructor** (legacy) — `function Foo() {}` with `new`

Each differs in hoisting, `this` binding, and whether it can be used as a constructor.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.5 What is an anonymous function?
An **anonymous function** is a function without a name in its declaration. It is often assigned to a variable or passed as an argument.

```javascript
const double = function (x) { return x * 2; };

[1, 2, 3].map(function (n) { return n * 2; });

setTimeout(() => console.log('done'), 1000);
```

Arrow functions are usually anonymous too. Names matter for debugging (stack traces) and recursion — named function expressions can help.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.6 Provide examples of a self-invoking function.
A **self-invoking** (IIFE — Immediately Invoked Function Expression) function runs as soon as it is defined:

```javascript
(function () {
  console.log('runs immediately');
})();

(() => {
  console.log('arrow IIFE');
})();

(function (a, b) {
  return a + b;
})(2, 3); // 5
```

Historically, IIFEs created private scope before block-scoped `let`/`const`. Today they are less common but still useful for isolating variables or one-off initialization.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.7 What is the difference between a function expression and a function declaration?
**Function declaration:**
```javascript
foo(); // works — hoisted
function foo() {}
```

**Function expression:**
```javascript
bar(); // ReferenceError (const) or undefined call on var
const bar = function () {};
```

Key differences:
- Declarations are **hoisted** entirely; expressions are not available before their line runs.
- Expressions can be **anonymous** or assigned to `const`/`let`.
- Only declarations (and some named expressions) are reliably usable before definition in the same scope.

Arrow functions are always expressions and have no own `this`, `arguments`, or `new` capability.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.8 How do you get a new array from a JS array of numbers that contains only numbers greater than 10? Which array method should you use?
Use **`filter`** — it returns a new array with elements that pass a test:

```javascript
const numbers = [3, 11, 7, 25, 10];
const overTen = numbers.filter(n => n > 10);
// [11, 25]
```

`filter` does not mutate the original array. Related methods: `map` (transform each item), `reduce` (aggregate), `find` (first match).

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.9 How do you remove an element from an array and an object?
**Array — by index (mutating):**
```javascript
const arr = ['a', 'b', 'c'];
arr.splice(1, 1); // removes 'b' → ['a', 'c']
```

**Array — by value (new array, non-mutating):**
```javascript
const arr = ['a', 'b', 'c'];
const next = arr.filter(x => x !== 'b'); // ['a', 'c']
```

**Object — delete a property:**
```javascript
const obj = { a: 1, b: 2 };
delete obj.b;
// or
const { b, ...rest } = obj; // rest without b
```

`delete` mutates the object. Destructuring with rest creates a shallow copy without the removed key.

	**Q3.9a** Does `delete` work on array indices?

Yes, but it leaves a **hole** (sparse array) — `length` stays the same. Prefer `splice` or `filter` for arrays.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.10 What is the `void` type used for?
In JavaScript, **`void` operator** evaluates an expression and returns `undefined`:

```javascript
void 0;        // undefined
void console.log('x'); // logs 'x', returns undefined
```

It is rarely needed in application code. In TypeScript, **`void`** as a return type means a function does not return a useful value. Some teams use `void fn()` in arrow callbacks to explicitly ignore a return value and satisfy linters.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.11 Where and why is `super()` used?
`super()` is called inside a **subclass constructor** to invoke the parent class constructor before using `this`:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // must run before this.breed
    this.breed = breed;
  }
}
```

Without `super()` in a derived class, `this` is unavailable and a `ReferenceError` is thrown. `super.method()` can also call parent methods from the child class.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.12 What is `this` used for and in which cases should you use it?
`this` refers to the **execution context** — the object or environment a function was called with. Its value depends on **how** the function is invoked:

- **Method call** — `obj.foo()` → `this` is `obj`
- **Standalone / strict mode** — `this` is `undefined` (strict) or global (sloppy)
- **Constructor** — `new Foo()` → `this` is the new instance
- **Arrow function** — `this` is lexically inherited from enclosing scope (not re-bound)
- **`call` / `apply` / `bind`** — explicitly set `this`

Use `this` in classes and object methods to access instance state. Prefer arrow functions for callbacks when you need outer `this`, or use `bind`.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.13 What is `NaN` and how is it used?
`NaN` means **Not a Number** — a numeric value representing an invalid or undefined numeric result (e.g. `0 / 0`, `parseInt('abc')`).

```javascript
Number.isNaN(NaN);     // true
Number.isNaN('text');  // false — not converted

isNaN('text');         // true — coerces first (avoid)
```

`NaN` is not equal to anything, including itself: `NaN === NaN` is `false`. Use `Number.isNaN()` to test. In practice you check parsing results and validate user input rather than "using" `NaN` intentionally.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.14 What is NPM? What alternatives do you know?
**npm** (Node Package Manager) is the default package manager for Node.js. It installs dependencies, runs scripts, and publishes packages to the [npm registry](https://www.npmjs.com/).

**Alternatives:**
- **Yarn** (Classic and Berry/modern) — lockfile-focused, Plug'n'Play option in Berry
- **pnpm** — content-addressable store, hard links, disk-efficient `node_modules`
- **Bun** — runtime + package manager with fast installs
- **Deno** — uses URLs and cache instead of traditional `node_modules` (different model)

All solve dependency resolution, versioning, and reproducible installs via lockfiles.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.15 What are the advantages and disadvantages of NPM compared to Yarn/PNPM?
**npm advantages:**
- Ships with Node.js — no extra install
- Mature ecosystem and widest documentation
- `package-lock.json` for reproducible installs
- Workspaces support for monorepos

**npm disadvantages:**
- Historically slower installs than pnpm/Yarn (improved in recent versions)
- Flat `node_modules` can hide dependency issues (phantom dependencies)
- Larger disk usage compared to pnpm's linking model

**Yarn / PNPM advantages:**
- Often faster, stricter, or more disk-efficient (especially pnpm)
- pnpm prevents undeclared dependency access via isolated `node_modules`

**Trade-off:** Team consistency matters more than tool choice — pick one, commit the lockfile, enforce it in CI.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.16 What Promise API methods do you know? What is the difference between them?
| Method | Behavior |
|--------|----------|
| `Promise.all(iterable)` | Waits for all; rejects immediately on first rejection |
| `Promise.allSettled(iterable)` | Waits for all; never rejects — each result is `{ status, value/reason }` |
| `Promise.race(iterable)` | Settles with the first promise that settles (fulfill or reject) |
| `Promise.any(iterable)` | Fulfills with first fulfillment; rejects only if all reject (`AggregateError`) |
| `Promise.resolve(value)` | Returns a fulfilled Promise |
| `Promise.reject(reason)` | Returns a rejected Promise |

```javascript
await Promise.all([fetchA(), fetchB()]);           // both must succeed
await Promise.allSettled([fetchA(), fetchB()]);    // inspect each outcome
await Promise.race([fetch(), timeout(5000)]);      // first to finish wins
await Promise.any([cdn1(), cdn2()]);               // first success wins
```

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.17 Describe the structure of an HTTP request/response.
**HTTP Request:**
1. **Request line** — method, path, HTTP version (`GET /api/users HTTP/1.1`)
2. **Headers** — metadata (`Host`, `Authorization`, `Content-Type`, `User-Agent`)
3. **Blank line** — separator
4. **Body** (optional) — payload for POST/PUT/PATCH

**HTTP Response:**
1. **Status line** — version, status code, reason (`HTTP/1.1 200 OK`)
2. **Headers** — metadata (`Content-Type`, `Set-Cookie`, `Cache-Control`)
3. **Blank line**
4. **Body** (optional) — HTML, JSON, file bytes, etc.

In Node.js/Express, `req.method`, `req.url`, `req.headers`, `req.body` map to the request; `res.status()`, `res.set()`, `res.json()` build the response.

	**Q3.17a** What are common methods and status codes?

Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Status families: 2xx success, 3xx redirect, 4xx client error, 5xx server error.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.18 What are `new Set()` and `new Map()`?
**`Set`** — collection of **unique** values (primitives or objects by reference):

```javascript
const ids = new Set([1, 2, 2, 3]);
ids.size;        // 3
ids.has(2);      // true
ids.add(4);
```

**`Map`** — key–value store where keys can be **any type** (unlike plain objects, which stringify keys):

```javascript
const map = new Map();
map.set('user:1', { name: 'Ann' });
map.set(objKey, 42);
map.get('user:1');
map.has(objKey);
```

Both preserve insertion order. Use `Set` for deduplication; use `Map` when keys are not strings or you need frequent add/delete with size tracking.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

### Q3.19 What are the logical operators `&&` and `||`, and how do they differ from the logical operator `??`?
`&&` and `||` return the **first operand that determines the outcome** (short-circuit), not strictly booleans:

```javascript
0 || 'default';   // 'default' (0 is falsy)
'' && 'skipped';  // '' (falsy, short-circuits)
```

**Falsy values:** `false`, `0`, `''`, `null`, `undefined`, `NaN`.

**Nullish coalescing `??`** returns the right side only when the left is **`null` or `undefined`**:

```javascript
0 ?? 100;        // 0  (0 is valid)
null ?? 100;     // 100
undefined ?? 100; // 100
```

Use `??` when `0`, `''`, or `false` are meaningful values you must not overwrite. Use `||` when any falsy value should trigger a fallback.

[↑ Ch 3 questions](#ch-3--javascript) · [↑ Table of Contents](#table-of-contents)

---

## Ch 4 — Databases

**Questions in this chapter**

- [Q4.1 Why are databases needed in applications?](#q41-why-are-databases-needed-in-applications)

---

### Q4.1 Why are databases needed in applications?
Applications need **durable, structured storage** that survives process restarts and supports reliable queries at scale. Databases provide:

- **Persistence** — data outlives server memory
- **Structured access** — schemas, indexes, and query languages (SQL or document APIs)
- **Consistency and integrity** — constraints, transactions, foreign keys
- **Concurrency** — many users reading/writing safely
- **Performance** — indexes and optimized storage engines for large datasets
- **Security** — access control, backups, replication

Without a database, you would rely on files or in-memory state — fine for prototypes, but poor for multi-user production apps that need search, reporting, and data safety.

	**Q4.1a** When might you skip a database?

Static sites, ephemeral caches, or tiny prototypes can use files or in-memory stores. Production apps with users, auth, and business data almost always need a real database.

[↑ Ch 4 questions](#ch-4--databases) · [↑ Table of Contents](#table-of-contents)

---
