# JavaScript — Junior to Senior Roadmap

A learning roadmap of **JavaScript** features, patterns, and practices organized by seniority level. Use this as a checklist — tick off items as you can explain and use them confidently without looking up the docs.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core types and variables](#l1-core-types-and-variables)
  - [Operators and expressions](#l1-operators-and-expressions)
  - [Control flow](#l1-control-flow)
  - [Functions](#l1-functions)
  - [Objects and arrays](#l1-objects-and-arrays)
  - [ES6+ essentials](#l1-es6-essentials)
  - [DOM basics](#l1-dom-basics)
  - [Error handling basics](#l1-error-handling-basics)
  - [Modules](#l1-modules)
  - [Promises and async/await basics](#l1-promises-and-asyncawait-basics)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Scope and closures](#l2-scope-and-closures)
  - [The `this` keyword](#l2-the-this-keyword)
  - [Prototypes and inheritance](#l2-prototypes-and-inheritance)
  - [Advanced array and object methods](#l2-advanced-array-and-object-methods)
  - [Iterators and generators](#l2-iterators-and-generators)
  - [Symbols, WeakMap, WeakSet](#l2-symbols-weakmap-weakset)
  - [Advanced async patterns](#l2-advanced-async-patterns)
  - [The event loop in depth](#l2-the-event-loop-in-depth)
  - [Regular expressions](#l2-regular-expressions)
  - [Custom errors and error types](#l2-custom-errors-and-error-types)
- [Level 3 — Senior](#level-3--senior)
  - [Metaprogramming — Proxy and Reflect](#l3-metaprogramming--proxy-and-reflect)
  - [Design patterns](#l3-design-patterns)
  - [Memory management and leaks](#l3-memory-management-and-leaks)
  - [V8 internals and performance](#l3-v8-internals-and-performance)
  - [Web Workers and concurrency](#l3-web-workers-and-concurrency)
  - [Service Workers and caching](#l3-service-workers-and-caching)
  - [Security](#l3-security)
  - [Advanced TypeScript patterns](#l3-advanced-typescript-patterns)
  - [Module systems deep dive](#l3-module-systems-deep-dive)
  - [Architecture and code quality](#l3-architecture-and-code-quality)
- [Quick reference table](#quick-reference-table)
- [Tasks — Junior](#tasks--junior)
- [Tasks — Mid-level](#tasks--mid-level)
- [Tasks — Senior](#tasks--senior)
- [Answers — Junior](#answers--junior)
- [Answers — Mid-level](#answers--mid-level)
- [Answers — Senior](#answers--senior)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each section lists what to know, why it matters, a code example, and a gotcha where relevant.
- Items marked with `*` are the most commonly used in day-to-day work.
- TypeScript and framework-specific knowledge (React, Angular, etc.) are covered in separate guides.

---

## Level 1 — Junior

### L1 Core types and variables

| Concept | What it is |
|---|---|
| **`var`** | Function-scoped variable declaration. Hoisted to the top of the function. Avoid in modern code. |
| **`let`** `*` | Block-scoped variable that can be reassigned. Preferred for mutable values. |
| **`const`** `*` | Block-scoped binding that cannot be reassigned. Preferred by default. Does NOT freeze objects. |
| **`typeof`** | Runtime operator that returns a string name of the type: `'string'`, `'number'`, `'boolean'`, `'undefined'`, `'object'`, `'function'`, `'symbol'`, `'bigint'`. |
| **Primitive types** | `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, `bigint`. Immutable, passed by value. |
| **Reference types** | Objects (including arrays and functions). Passed by reference. |
| **`null` vs `undefined`** | `undefined` means a variable was declared but not assigned. `null` is an intentional empty value. |
| **Type coercion** | JS silently converts types in certain expressions: `'5' + 1 === '51'` but `'5' - 1 === 4`. |

```js
let count = 0;          // mutable number
const name = 'Alice';   // immutable binding
const user = {};        // const, but properties are still mutable
user.age = 30;          // valid!

console.log(typeof null);       // 'object' — historical bug, not fixable
console.log(typeof undefined);  // 'undefined'
console.log(typeof []);         // 'object' — use Array.isArray() to detect arrays
```

> **Gotcha:** `const` only prevents reassignment of the binding, not mutation of the value. `const arr = []; arr.push(1)` is perfectly valid. Use `Object.freeze()` if you need a truly immutable object.

---

### L1 Operators and expressions

| Operator | Behaviour |
|---|---|
| **`==`** | Loose equality — performs type coercion before comparing. Avoid. |
| **`===`** `*` | Strict equality — compares value AND type. Prefer always. |
| **`??`** (nullish coalescing) `*` | Returns the right-hand side only if the left is `null` or `undefined`. |
| **`\|\|`** (logical OR) | Returns right-hand side if left is falsy (`0`, `''`, `false`, `null`, `undefined`, `NaN`). |
| **`&&`** (logical AND) `*` | Short-circuits: returns left side if falsy, otherwise right side. |
| **`?.`** (optional chaining) `*` | Safely access nested properties — returns `undefined` instead of throwing. |
| **`!`** (logical NOT) | Converts to boolean and negates. `!!value` converts to boolean. |
| **`+`** with strings | Concatenates: `'Hello ' + 'world'`. Prefer template literals. |

```js
console.log(0 == false);    // true  — coercion, avoid!
console.log(0 === false);   // false — strict, correct

const port = process.env.PORT ?? 3000;   // 3000 only if env is null/undefined
const label = user.name || 'Anonymous'; // 'Anonymous' if name is falsy

const street = user?.address?.street;   // undefined, not a TypeError
```

> **Gotcha:** `0 || 'default'` returns `'default'` because `0` is falsy. If `0` is a valid value, use `??` instead.

---

### L1 Control flow

```js
// if / else
if (score >= 90) {
  grade = 'A';
} else if (score >= 75) {
  grade = 'B';
} else {
  grade = 'C';
}

// switch
switch (day) {
  case 'Mon':
  case 'Tue':
    console.log('Weekday');
    break;
  case 'Sat':
  case 'Sun':
    console.log('Weekend');
    break;
  default:
    console.log('Other');
}

// ternary
const label = isLoggedIn ? 'Logout' : 'Login';

// for, while, do...while
for (let i = 0; i < 5; i++) { /* ... */ }

for (const item of items) { /* ... */ }      // iterates values
for (const key in obj) { /* ... */ }         // iterates own + inherited keys — use hasOwnProperty or Object.keys

while (queue.length > 0) { /* ... */ }
```

> **Gotcha:** `for...in` also iterates over inherited enumerable properties from the prototype chain. Prefer `for...of` for arrays and `Object.keys()` / `Object.entries()` for plain objects.

---

### L1 Functions

| Form | When to use |
|---|---|
| **Function declaration** `*` | Hoisted — can be called before it appears in source. Good for top-level utilities. |
| **Function expression** | Not hoisted. Useful for callbacks and conditional assignment. |
| **Arrow function** `*` | No own `this`, no `arguments`. Ideal for callbacks, array methods, and one-liners. |
| **Default parameters** `*` | `function greet(name = 'World')` — provide fallback values. |
| **Rest parameters** `*` | `function sum(...nums)` — collect remaining args into an array. |

```js
// declaration — hoisted
function double(n) {
  return n * 2;
}

// expression — not hoisted
const triple = function(n) {
  return n * 3;
};

// arrow — concise, no own this
const square = n => n * n;
const add = (a, b) => a + b;

// default + rest
function tag(label = 'info', ...messages) {
  console.log(`[${label}]`, ...messages);
}
tag('warn', 'disk', 'full'); // [warn] disk full
tag('hello');                // [info] hello — default used
```

> **Gotcha:** Arrow functions cannot be used as constructors (`new arrowFn()` throws). They also do not have their own `arguments` object — use rest parameters instead.

---

### L1 Objects and arrays

```js
// Object literal
const user = {
  name: 'Alice',
  age: 30,
  greet() {                  // shorthand method
    return `Hi, I'm ${this.name}`;
  },
};

// Access
user.name;          // dot notation
user['name'];       // bracket notation — required for dynamic keys

// Array
const nums = [1, 2, 3];
nums.push(4);       // add to end
nums.pop();         // remove from end
nums.shift();       // remove from start
nums.unshift(0);    // add to start
nums.slice(1, 3);   // [2, 3] — does NOT mutate
nums.splice(1, 1);  // mutates — removes 1 element at index 1
nums.indexOf(2);    // index or -1
nums.includes(2);   // boolean

// Common iteration
nums.forEach(n => console.log(n));
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const sum = nums.reduce((acc, n) => acc + n, 0);
```

> **Gotcha:** `splice` mutates the original array and returns the removed elements. `slice` does NOT mutate — it returns a new array. Mixing them up is one of the most common bugs.

---

### L1 ES6+ essentials

| Feature | What it does |
|---|---|
| **Template literals** `*` | `` `Hello ${name}` `` — embed expressions in strings, support multi-line. |
| **Destructuring — object** `*` | `const { name, age } = user` — unpack object properties into variables. |
| **Destructuring — array** `*` | `const [first, second] = arr` — unpack array elements. |
| **Spread operator** `*` | `[...a, ...b]` or `{ ...obj, extra: true }` — shallow copy / merge. |
| **Rest in destructuring** `*` | `const { a, ...rest } = obj` — collect remaining properties. |
| **Computed property names** | `const key = 'foo'; const obj = { [key]: 1 }` — dynamic object keys. |
| **Shorthand property names** | `const obj = { name, age }` instead of `{ name: name, age: age }`. |
| **`for...of`** `*` | Iterates over iterable values (arrays, strings, Maps, Sets, generators). |

```js
// destructuring with rename and default
const { name: username = 'Guest', role = 'user' } = session;

// swap variables
let a = 1, b = 2;
[a, b] = [b, a];

// spread — shallow copy
const copy = { ...original, updatedAt: Date.now() };
const merged = [...arrA, ...arrB];

// rest in params
const [head, ...tail] = [1, 2, 3, 4]; // head=1, tail=[2,3,4]
```

> **Gotcha:** Spread performs a **shallow** copy. Nested objects are still shared by reference: `const copy = { ...obj }; copy.nested.x = 1` also mutates `obj.nested.x`.

---

### L1 DOM basics

```js
// Selecting elements
const el = document.querySelector('#app');          // single element (CSS selector)
const items = document.querySelectorAll('.item');   // NodeList

// Modifying
el.textContent = 'Hello';           // safe — no HTML parsing
el.innerHTML = '<b>Hello</b>';      // parses HTML — XSS risk if user-controlled!
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.setAttribute('data-id', '42');

// Creating and inserting
const div = document.createElement('div');
div.textContent = 'New item';
document.body.appendChild(div);
el.insertAdjacentHTML('beforeend', '<li>item</li>');

// Events
el.addEventListener('click', (event) => {
  event.preventDefault();    // stop default browser action
  event.stopPropagation();   // stop event bubbling up
  console.log(event.target); // element that was clicked
});
```

> **Gotcha:** `innerHTML` is a common XSS vector. Never set it with unsanitised user input. Use `textContent` for plain text and `DOMPurify` if you must render rich HTML from external sources.

---

### L1 Error handling basics

```js
// try / catch / finally
try {
  const data = JSON.parse(rawInput);
  processData(data);
} catch (err) {
  console.error('Parsing failed:', err.message);
} finally {
  cleanup(); // always runs
}

// throw
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// catching async errors
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
```

> **Gotcha:** An uncaught `Promise` rejection does NOT trigger a `try/catch` around the `Promise` constructor. You must either `await` the promise inside a `try/catch` or attach a `.catch()` handler.

---

### L1 Modules

```js
// math.js — named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Default export
export default class Calculator { /* ... */ }

// Importing
import Calculator from './math.js';          // default import
import { add, subtract } from './math.js';   // named imports
import * as Math from './math.js';           // namespace import
import { add as sum } from './math.js';      // rename on import

// Dynamic import (lazy loading)
const module = await import('./heavy-feature.js');
module.init();
```

> **Gotcha:** ESM `import` statements are **static** and hoisted — they cannot be placed inside conditions. Use `await import()` (dynamic import) for conditional or lazy loading.

---

### L1 Promises and async/await basics

```js
// Creating a promise
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Consuming with .then / .catch / .finally
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));

// async / await — syntactic sugar over promises *
async function loadUser(id) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  return user;
}

// await only works inside an async function (or top-level in modules)
const user = await loadUser(1); // top-level await — ESM only
```

> **Gotcha:** `async` functions always return a `Promise`, even if you return a plain value. Forgetting this when calling async functions from non-async contexts is a common source of bugs.

---

## Level 2 — Mid-level

### L2 Scope and closures

| Term | What it means |
|---|---|
| **Global scope** | Variables declared outside any function/block — accessible everywhere. Avoid polluting it. |
| **Function scope** | `var` declarations are scoped to the enclosing function. |
| **Block scope** | `let`/`const` declarations are scoped to the enclosing `{}` block. |
| **Lexical scope** | A function can access variables from its outer scope at the time it was **defined**, not called. |
| **Closure** `*` | A function that captures and retains access to its outer scope even after the outer function has returned. |
| **Temporal Dead Zone (TDZ)** | The period between entering a block and the `let`/`const` declaration — accessing the variable throws a `ReferenceError`. |

```js
// Classic closure — counter factory
function makeCounter(start = 0) {
  let count = start;           // captured in closure
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    value()     { return count; },
  };
}

const c1 = makeCounter();
const c2 = makeCounter(10);
c1.increment(); // 1
c1.increment(); // 2
c2.value();     // 10 — separate state!
```

```js
// Closure in async loops — classic gotcha
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3 — var is shared!
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0, 1, 2 — let creates new binding
}
```

> **Gotcha:** Closures holding large objects or DOM nodes prevent garbage collection. Always clean up event listeners and stored references when components unmount.

---

### L2 The `this` keyword

| Context | Value of `this` |
|---|---|
| **Global scope (non-strict)** | `window` (browser) / `global` (Node). |
| **Global scope (strict mode)** | `undefined`. |
| **Regular function call** | `undefined` in strict mode; global object in sloppy mode. |
| **Method call** `*` | The object before the dot: `user.greet()` → `this === user`. |
| **Arrow function** | Inherited from the enclosing lexical scope — **no own `this`**. |
| **Constructor (`new`)** | The newly created instance. |
| **`call` / `apply` / `bind`** | Explicitly set value. |
| **Event listener** | The element that received the event (unless arrow function). |

```js
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'Alice' — method call
  },
  greetArrow: () => {
    console.log(this?.name); // undefined — arrow inherits outer this
  },
};

// Explicit binding
function introduce(greeting) {
  return `${greeting}, I'm ${this.name}`;
}
const bound = introduce.bind({ name: 'Bob' });
bound('Hello');             // "Hello, I'm Bob"
introduce.call({ name: 'Carol' }, 'Hi'); // "Hi, I'm Carol"
introduce.apply({ name: 'Dave' }, ['Hey']); // "Hey, I'm Dave"
```

> **Gotcha:** Passing a method as a callback **loses** its `this` binding. Fix: `setTimeout(obj.greet.bind(obj), 100)` or use an arrow wrapper `setTimeout(() => obj.greet(), 100)`.

---

### L2 Prototypes and inheritance

| Concept | What it is |
|---|---|
| **Prototype chain** `*` | When you access a property JS looks up the prototype chain until found or `null` reached. |
| **`__proto__`** | The internal prototype link of an object. Use `Object.getPrototypeOf()` instead in code. |
| **`prototype`** | The `.prototype` property on a constructor function — it becomes the `__proto__` of instances. |
| **`Object.create(proto)`** | Creates a new object with `proto` as its prototype. Useful for prototype-based inheritance. |
| **`class`** `*` | Syntactic sugar over prototype-based inheritance. Introduced in ES6. |
| **`instanceof`** | Checks if an object's prototype chain includes the constructor's `.prototype`. |
| **`hasOwnProperty`** | Returns `true` only if the property exists directly on the object, not on a prototype. |

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks.`;
  }
}

const d = new Dog('Rex');
d.speak();                          // "Rex barks."
d instanceof Dog;                   // true
d instanceof Animal;                // true
Object.getPrototypeOf(d) === Dog.prototype; // true

// same thing without class syntax
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, ${this.name}`; };
```

> **Gotcha:** Adding a method to a class in the constructor (`this.method = () => {}`) creates a new function per instance, increasing memory usage. Methods defined in the class body are shared on the prototype.

---

### L2 Advanced array and object methods

```js
// Array methods
const users = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob',   age: 25, active: false },
  { name: 'Carol', age: 35, active: true },
];

users
  .filter(u => u.active)              // keep active users
  .map(u => u.name)                   // extract names
  .sort((a, b) => a.localeCompare(b)); // ['Alice', 'Carol']

// reduce — build a lookup map
const byName = users.reduce((acc, u) => {
  acc[u.name] = u;
  return acc;
}, {});

// flat and flatMap
[[1, 2], [3, 4]].flat();             // [1, 2, 3, 4]
['a b', 'c d'].flatMap(s => s.split(' ')); // ['a', 'b', 'c', 'd']

// find, findIndex, some, every
users.find(u => u.age > 28);         // first match or undefined
users.findIndex(u => u.name === 'Bob'); // 1
users.some(u => u.age > 34);         // true
users.every(u => u.active);          // false

// Object methods *
Object.keys(byName);                 // ['Alice', 'Bob', 'Carol']
Object.values(byName);               // [{ ... }, ...]
Object.entries(byName);              // [['Alice', { ... }], ...]
Object.assign({}, a, b);             // shallow merge (mutates first arg!)
Object.freeze(obj);                  // deep-freeze needs recursion
Object.fromEntries(entries);         // convert entries back to object
```

> **Gotcha:** `sort` mutates the original array and defaults to lexicographic order — `[10, 9, 2].sort()` gives `[10, 2, 9]`. Always pass a comparator for numbers.

---

### L2 Iterators and generators

| Concept | What it is |
|---|---|
| **Iterable** | An object with a `[Symbol.iterator]()` method that returns an iterator. Arrays, strings, Maps, Sets are built-in iterables. |
| **Iterator** | An object with a `next()` method returning `{ value, done }`. |
| **Generator function** | Declared with `function*`. Returns a generator (an iterator that is also an iterable). Pauses at each `yield`. |
| **`yield`** | Pauses the generator and emits a value. Execution resumes on the next `next()` call. |
| **`yield*`** | Delegates to another iterable. |
| **Infinite sequences** | Generators can produce values lazily — they only compute the next value on demand. |

```js
// Custom iterable
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
[...range]; // [1, 2, 3, 4, 5]

// Generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2

// Async generator
async function* paginate(url) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page++}`).then(r => r.json());
    if (!data.length) return;
    yield data;
  }
}

for await (const batch of paginate('/api/items')) {
  processBatch(batch);
}
```

> **Gotcha:** A generator holds state until it is fully consumed or garbage collected. If you break out of a `for...of` loop over a generator, call `.return()` to allow the generator to clean up via `finally` blocks.

---

### L2 Symbols, WeakMap, WeakSet

| Feature | Use case |
|---|---|
| **`Symbol()`** | Creates a globally unique, non-string key. Useful for object properties that should not appear in `for...in`, `Object.keys()`, or JSON. |
| **Well-known Symbols** | `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag` — customise built-in JS behaviour. |
| **`WeakMap`** | Map with weak (non-preventing) references to object keys. Keys must be objects. Not iterable. |
| **`WeakSet`** | Set with weak references to objects. Not iterable. |
| **`WeakRef`** | Holds a weak reference to an object — does not prevent GC. Access with `.deref()`. |

```js
// Symbol as unique property key
const ID = Symbol('id');
const user = { name: 'Alice', [ID]: 42 };
Object.keys(user);       // ['name'] — Symbol not included
user[ID];                // 42

// WeakMap for private data
const _cache = new WeakMap();
class Component {
  constructor(data) {
    _cache.set(this, { data, computedAt: Date.now() });
  }
  getData() { return _cache.get(this).data; }
}
// When the Component instance is GC'd, the WeakMap entry is too

// Symbol.toPrimitive
const money = {
  amount: 100,
  currency: 'USD',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    return `${this.amount} ${this.currency}`;
  },
};
+money;         // 100
`${money}`;     // "100 USD"
```

> **Gotcha:** `WeakMap` and `WeakSet` are not iterable and have no `.size` property by design — if they were iterable, iterating them could observe garbage collection timing, which is non-deterministic.

---

### L2 Advanced async patterns

```js
// Promise.all — run in parallel, fail fast *
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);

// Promise.allSettled — run in parallel, collect all outcomes *
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(result => {
  if (result.status === 'fulfilled') console.log(result.value);
  else console.error(result.reason);
});

// Promise.race — first to settle wins
const winner = await Promise.race([fetch('/fast'), fetch('/slow')]);

// Promise.any — first to fulfil (ignores rejections)
const first = await Promise.any([p1, p2, p3]); // throws AggregateError if ALL reject

// Timeout pattern
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// Retry with exponential backoff
async function retry(fn, retries = 3, delay = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay * 2 ** attempt));
    }
  }
}
```

> **Gotcha:** `Promise.all` rejects as soon as **one** promise rejects, but the other promises still run — they're just ignored. Use `Promise.allSettled` when you want all results regardless of individual failures.

---

### L2 The event loop in depth

| Concept | What it is |
|---|---|
| **Call stack** | Synchronous execution context. One frame per function call. LIFO. |
| **Heap** | Where objects are allocated in memory. |
| **Web APIs / Node APIs** | Where async ops actually run (timers, I/O, fetch). Not part of the JS engine. |
| **Task queue (macrotask)** | Where callbacks from `setTimeout`, `setInterval`, `I/O` wait. |
| **Microtask queue** `*` | Where `.then()` callbacks, `await` continuations, and `queueMicrotask()` wait. **Drained completely before the next macrotask.** |
| **`requestAnimationFrame`** | Runs before the next paint — between tasks. |
| **`queueMicrotask(fn)`** | Schedules a microtask explicitly. |

```js
console.log('1');

setTimeout(() => console.log('2'), 0);      // macrotask

Promise.resolve().then(() => console.log('3')); // microtask

queueMicrotask(() => console.log('4'));     // microtask

console.log('5');

// Output order: 1, 5, 3, 4, 2
```

```
Event loop cycle:
1. Dequeue one macrotask from the task queue and run it on the call stack.
2. After the call stack is empty, drain the ENTIRE microtask queue.
3. Render (if needed).
4. Go to step 1.
```

> **Gotcha:** Microtasks run before the next macrotask, so a microtask that schedules another microtask can starve rendering and I/O indefinitely. Break work into macrotasks (`setTimeout`) if you need the browser to remain responsive.

---

### L2 Regular expressions

```js
// Literals and constructors
const reDate = /\d{4}-\d{2}-\d{2}/;
const reDynamic = new RegExp(`\\b${keyword}\\b`, 'gi'); // dynamic pattern

// Methods
'2025-07-01'.match(reDate);            // ['2025-07-01'] or null
'hello world'.replace(/\bworld\b/, 'JS'); // 'hello JS'
'a,b,,c'.split(/,+/);                 // ['a', 'b', 'c']
/^\d+$/.test('123');                  // true

// Named capture groups
const m = '2025-07-01'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
m?.groups; // { year: '2025', month: '07', day: '01' }

// Flags
// g — global (find all matches)
// i — case-insensitive
// m — multiline (^ and $ match line boundaries)
// s — dotAll (. matches newlines)
// u — Unicode mode
// d — generate indices for match positions

// replaceAll with a function
const result = 'foo bar baz'.replaceAll(/\b\w+\b/g, word => word.toUpperCase());
// 'FOO BAR BAZ'
```

> **Gotcha:** A regex literal with the `g` flag is stateful — it stores `lastIndex` after each match when used with `.exec()` or `.test()`. Calling `.test(str)` on the same regex object multiple times without resetting `lastIndex` gives unexpected results. Use `.match()` or create a new regex each time.

---

### L2 Custom errors and error types

```js
// Built-in error types
new TypeError('Expected a number');
new RangeError('Index out of bounds');
new ReferenceError('Variable not defined');
new SyntaxError('Unexpected token');
new URIError('Invalid URI');

// Custom error class *
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'AppError';    // important for correct .name
    this.code = code;
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError); // V8 — cleaner stack trace
    }
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

// Usage
try {
  throw new NotFoundError('User');
} catch (err) {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    throw err; // re-throw unknown errors
  }
}
```

> **Gotcha:** Always set `this.name` in custom error subclasses. Without it, `error.name` falls back to `'Error'`, making `instanceof` checks and logging confusing.

---

## Level 3 — Senior

### L3 Metaprogramming — Proxy and Reflect

| Concept | What it is |
|---|---|
| **`Proxy`** | Wraps an object and intercepts fundamental operations: property access, assignment, function calls, `in` checks, `delete`, etc. |
| **Handler traps** | Methods on the handler object: `get`, `set`, `has`, `deleteProperty`, `apply`, `construct`, `ownKeys`, etc. |
| **`Reflect`** | A companion API with the same traps as Proxy. Lets you perform the default behaviour inside a trap. |
| **Revocable proxy** | `Proxy.revocable()` — returns a proxy and a `revoke()` function. After revocation all traps throw. |

```js
// Validation proxy
function createValidated(target, schema) {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (schema[prop] && !schema[prop](value)) {
        throw new TypeError(`Invalid value for '${prop}': ${value}`);
      }
      return Reflect.set(obj, prop, value); // default behaviour
    },
  });
}

const user = createValidated({}, {
  age: v => Number.isInteger(v) && v >= 0 && v <= 150,
  name: v => typeof v === 'string' && v.length > 0,
});

user.name = 'Alice';  // OK
user.age = 30;        // OK
user.age = -1;        // TypeError: Invalid value for 'age': -1

// Observable / reactive system (simplified Vue reactivity concept)
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);               // dependency tracking
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);             // notify watchers
      return result;
    },
  });
}
```

> **Gotcha:** Proxy only intercepts operations on the proxy itself, not on nested objects. To make a deep reactive system you need to return a new `Proxy` from the `get` trap when the accessed value is itself an object (as Vue 3 does).

---

### L3 Design patterns

| Pattern | Intent | JS idiom |
|---|---|---|
| **Module** `*` | Encapsulate private state, expose a public API. | IIFE / ES module / closure. |
| **Factory** `*` | Create objects without exposing construction logic. | Function that returns objects. |
| **Singleton** | Ensure only one instance of a class exists. | Module-level variable, or a class with a static instance check. |
| **Observer / EventEmitter** `*` | Decouple publishers from subscribers. | `EventTarget`, custom `EventEmitter`, `RxJS`. |
| **Strategy** `*` | Swap algorithms at runtime without changing callers. | Pass functions as parameters. |
| **Decorator** | Add behaviour to objects/functions without modifying them. | Higher-order functions, TC39 decorators (`@decorator`). |
| **Facade** | Provide a simplified interface to a complex subsystem. | Wrapper module/class. |
| **Command** | Encapsulate a request as an object (supports undo/redo). | Object with `execute()` / `undo()` methods. |

```js
// Strategy pattern — sorting with swappable comparator
function sortUsers(users, strategy) {
  return [...users].sort(strategy);
}
const byAge  = (a, b) => a.age - b.age;
const byName = (a, b) => a.name.localeCompare(b.name);
sortUsers(users, byAge);
sortUsers(users, byName);

// Observer pattern — tiny EventEmitter
class EventEmitter {
  #listeners = new Map();
  on(event, fn)  { (this.#listeners.get(event) ?? this.#listeners.set(event, new Set()).get(event)).add(fn); }
  off(event, fn) { this.#listeners.get(event)?.delete(fn); }
  emit(event, ...args) { this.#listeners.get(event)?.forEach(fn => fn(...args)); }
}

// Factory with validation
function createUser({ name, role = 'user' }) {
  if (!name) throw new TypeError('name is required');
  return Object.freeze({ id: crypto.randomUUID(), name, role, createdAt: new Date() });
}
```

---

### L3 Memory management and leaks

| Concept | What it means |
|---|---|
| **Garbage collection (GC)** | JS engine automatically frees memory for objects with no live references. V8 uses a generational mark-and-sweep. |
| **Memory leak** | A reference to an object is kept alive longer than needed, preventing GC. |
| **Common leak sources** | Forgotten event listeners, global variables, detached DOM nodes, closures over large objects, timers not cleared. |
| **`FinalizationRegistry`** | Register a callback that runs after an object is GC'd. Useful for debugging, not flow control. |
| **Detached DOM nodes** | A DOM node removed from the tree but still referenced in JS — stays in memory. |

```js
// Leak: event listener not removed
class Widget {
  constructor() {
    this.handleResize = () => this.render(); // closure holds `this`
    window.addEventListener('resize', this.handleResize);
  }
  destroy() {
    window.removeEventListener('resize', this.handleResize); // MUST clean up
  }
}

// Leak: timer not cleared
class Poller {
  start() {
    this.intervalId = setInterval(() => this.poll(), 1000);
  }
  stop() {
    clearInterval(this.intervalId); // MUST clean up
  }
}

// Diagnosing leaks
// 1. Chrome DevTools → Memory tab → Heap Snapshot
// 2. Compare snapshots before and after a suspected leak
// 3. Look for unexpectedly retained objects in the retainer tree
// 4. Use the Allocation Instrumentation timeline to find the allocation site
```

> **Gotcha:** Storing a reference to a large array or DOM subtree inside a closure that is then passed as a callback to a long-lived object (like `window`) is a guaranteed leak. Always consider the **lifetime** of every reference you create.

---

### L3 V8 internals and performance

| Concept | What it means |
|---|---|
| **Hidden classes (Shapes)** | V8 creates an internal "shape" for each object based on its property layout. Objects with the same shape share compiled code. |
| **Deoptimisation** | V8 speculates a variable is always one type. If that changes, it bails out to slower interpreted mode. |
| **Inline caching (IC)** | V8 caches the result of property lookups for a specific shape — very fast on hot paths. |
| **JIT compilation** | Frequently executed code ("hot code") is compiled to optimised machine code by Turbofan. |
| **`--trace-opt` / `--trace-deopt`** | Node.js flags to observe V8 optimisation and deoptimisation decisions. |

```js
// Good — consistent shape, V8 optimises
function Point(x, y) { this.x = x; this.y = y; }
const points = Array.from({ length: 10000 }, (_, i) => new Point(i, i * 2));

// Bad — different property orders create different hidden classes
const p1 = { x: 1, y: 2 };
const p2 = { y: 2, x: 1 }; // different shape!

// Bad — adding properties after construction changes the shape mid-loop
function makeUser(name) {
  const u = {};
  u.name = name; // shape 1
  u.age = 0;     // shape 2 — avoid; define all properties up front
  return u;
}

// Performance measurement
console.time('label');
heavyComputation();
console.timeEnd('label');

// Profiling in Node
// node --prof script.js
// node --prof-process isolate-*.log > profile.txt
```

> **Gotcha:** `delete obj.property` is one of the worst things for V8 performance — it invalidates the hidden class and can push the object into "dictionary mode" (hash table), making property access much slower. Instead, set the property to `null` or `undefined`.

---

### L3 Web Workers and concurrency

| Concept | What it is |
|---|---|
| **Web Worker** | A script running in a background thread. No DOM access. Communicates via `postMessage`. |
| **Dedicated Worker** | One-to-one with a page. Created with `new Worker('./worker.js')`. |
| **Shared Worker** | Shared across tabs/iframes from the same origin. |
| **Service Worker** | Intercepts network requests. Lifecycle-managed by the browser. (See next section.) |
| **`transferable` objects** | `ArrayBuffer`, `MessagePort`, `ImageBitmap` — transferred (ownership moved), not copied. Zero-copy. |
| **`SharedArrayBuffer`** | Shared memory between the main thread and workers. Requires COOP/COEP headers. |
| **`Atomics`** | Low-level synchronisation primitives for `SharedArrayBuffer` — `Atomics.wait`, `Atomics.notify`, `Atomics.add`. |

```js
// main.js
const worker = new Worker('./worker.js', { type: 'module' });

worker.postMessage({ type: 'PROCESS', payload: largeArray.buffer }, [largeArray.buffer]);
// largeArray.buffer is now detached in main thread — transferred to worker

worker.onmessage = ({ data }) => {
  console.log('Worker result:', data.result);
};
worker.onerror = console.error;

// worker.js
self.onmessage = ({ data }) => {
  const arr = new Float64Array(data.payload);
  const sum = arr.reduce((a, b) => a + b, 0);
  self.postMessage({ result: sum });
};

// Inline worker via Blob (no separate file needed)
const blob = new Blob([`self.onmessage = e => self.postMessage(e.data * 2);`]);
const inlineWorker = new Worker(URL.createObjectURL(blob));
```

> **Gotcha:** All `postMessage` data is serialised via the Structured Clone Algorithm. Functions, DOM nodes, and prototype methods are **not** cloneable. For large binary data, use transferable `ArrayBuffer`s instead.

---

### L3 Service Workers and caching

```js
// Registering
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('SW registered, scope:', reg.scope);
  });
}

// sw.js — lifecycle events
const CACHE_NAME = 'app-v1';
const PRECACHE_URLS = ['/', '/index.html', '/app.js', '/styles.css'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy: Cache First with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ?? fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return response;
      })
    )
  );
});
```

| Caching strategy | When to use |
|---|---|
| **Cache First** | Static assets (JS, CSS, images) — fast, tolerate stale. |
| **Network First** | API calls where freshness matters; fall back to cache if offline. |
| **Stale While Revalidate** | Serve cached immediately, update cache in background. |
| **Cache Only** | Fully offline-first assets pre-cached at install. |
| **Network Only** | Analytics, payments — never cache. |

> **Gotcha:** A Service Worker update is only activated after **all** controlled tabs are closed (unless you call `skipWaiting()` + `clients.claim()`). Users can be stuck on old SW versions for hours. Always version your cache name.

---

### L3 Security

| Vulnerability | Description | Mitigation |
|---|---|---|
| **XSS (Cross-Site Scripting)** | Attacker injects malicious scripts into pages viewed by other users. | Sanitise user input. Use `textContent` not `innerHTML`. Implement CSP headers. |
| **CSRF (Cross-Site Request Forgery)** | Tricks a user's browser into making authenticated requests to another site. | CSRF tokens. `SameSite=Strict` cookies. Check `Origin`/`Referer` headers. |
| **Prototype pollution** | Attacker injects properties onto `Object.prototype` via merge functions. | Use `Object.create(null)` for maps. Validate input keys. Use `structuredClone`. |
| **`eval` / `new Function`** | Executes arbitrary strings as code — massive injection risk. | Never use with user input. Use JSON.parse for data. |
| **Supply chain attacks** | Malicious packages in `node_modules`. | Lock dependencies. Use `npm audit`. Pin exact versions in CI. |
| **Secrets in source** | API keys committed to repos or bundled in client JS. | Use `.env` files + secrets managers. Never log sensitive values. |

```js
// Prototype pollution example and defence
const config = {};
const payload = JSON.parse('{"__proto__": {"admin": true}}');

// Vulnerable merge
Object.assign(config, payload); // pollutes Object.prototype.admin!
({}).admin; // true — dangerous!

// Safe: use Object.create(null) for data maps
const safeMap = Object.create(null);

// Safe: use structuredClone (strips prototype)
const safeConfig = structuredClone(payload);
safeConfig.admin; // undefined — prototype not carried

// Content Security Policy (HTTP header)
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM'
```

> **Gotcha:** Prototype pollution is especially dangerous in server-side Node.js code where a polluted `Object.prototype` affects all objects globally in the process. Libraries like `lodash.merge` and `deepmerge` have historically been vulnerable — always keep dependencies updated.

---

### L3 Advanced TypeScript patterns

| Pattern | When to use |
|---|---|
| **Generics** `*` | Write type-safe functions and classes that work over multiple types. |
| **Conditional types** | `T extends U ? X : Y` — compute types based on conditions. |
| **Mapped types** | Transform every property of a type: `Readonly<T>`, `Partial<T>`, `Record<K, V>`. |
| **Template literal types** | `type Event = `on${Capitalize<string>}`` — build string types programmatically. |
| **`infer`** | Extract a type from a generic position: `ReturnType<T>`, `Parameters<T>`. |
| **`satisfies` operator** | Validate a value against a type without widening it. |
| **Discriminated unions** `*` | Union members with a shared literal property for exhaustive narrowing. |
| **Branded / opaque types** | Prevent mixing structurally identical but semantically different types (e.g. `UserId` vs `OrderId`). |

```ts
// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Conditional type
type IsArray<T> = T extends any[] ? true : false;

// Discriminated union — exhaustive switch
type Result<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handle<T>(r: Result<T>): string {
  switch (r.status) {
    case 'idle':    return 'Waiting';
    case 'loading': return 'Loading...';
    case 'success': return JSON.stringify(r.data);
    case 'error':   return r.error.message;
    // TS will error if any branch is missing — exhaustiveness check
  }
}

// Branded type
type UserId = string & { _brand: 'UserId' };
const toUserId = (id: string): UserId => id as UserId;
```

> **Gotcha:** Overusing `as` (type assertions) defeats the purpose of TypeScript. Prefer type narrowing via `typeof`, `instanceof`, and discriminated union checks. Reserve `as` for genuine coercion, not silencing errors.

---

### L3 Module systems deep dive

| System | Syntax | Load time | Tree-shakeable | Common use |
|---|---|---|---|---|
| **ESM** (ES Modules) | `import`/`export` | Static (compile-time) | Yes | Browsers, modern Node, bundlers |
| **CJS** (CommonJS) | `require()`/`module.exports` | Dynamic (runtime) | No | Legacy Node.js |
| **AMD** | `define()`/`require()` | Dynamic, async | No | Legacy browsers (RequireJS) |
| **UMD** | Wraps AMD + CJS + global | — | No | Legacy universal bundles |
| **IIFE** | Self-executing function | — | No | Script tags, legacy bundles |

```js
// ESM — top-level await, live bindings
export let count = 0;
export function increment() { count++; }
// Consumers see the updated `count` — live binding, not a copy!

// CJS — cached after first require
let count = 0;
function increment() { count++; }
module.exports = { count, increment };
// `count` is a snapshot — re-importing does NOT get updated value

// Dual package (ESM + CJS) in package.json
// {
//   "exports": {
//     "import": "./dist/index.mjs",
//     "require": "./dist/index.cjs"
//   }
// }

// Interop gotcha — default import from CJS in ESM
import pkg from 'some-cjs-module';           // default = module.exports
import { helper } from 'some-cjs-module';    // named — bundler-dependent
```

> **Gotcha:** ESM `import` bindings are **live** — they reflect the current value of the export. CJS `require` copies the value at the time of import. This difference causes subtle bugs when migrating from CJS to ESM.

---

### L3 Architecture and code quality

| Practice | Why it matters |
|---|---|
| **SOLID principles** | Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — guides maintainable OO design. |
| **Functional programming** | Pure functions, immutability, function composition reduce side effects and make code easier to test. |
| **Dependency injection** | Pass dependencies as parameters instead of importing them directly — enables testing and decoupling. |
| **Feature-sliced design** | Organise code by feature (`/features/auth`) rather than type (`/components`) — scales in large teams. |
| **Error boundaries** | Catch errors at boundaries, not everywhere. Let unexpected errors propagate to a top-level handler. |
| **Observability** | Structured logging, distributed tracing, and metrics — know what your code does in production. |
| **Code review checklist** | Security, performance, correctness, readability, test coverage, breaking changes. |

```js
// Dependency injection — testable by design
class UserService {
  constructor(db, emailService) { // inject deps
    this.db = db;
    this.emailService = emailService;
  }
  async createUser(data) {
    const user = await this.db.users.create(data);
    await this.emailService.sendWelcome(user.email);
    return user;
  }
}

// In tests — swap real deps for fakes
const service = new UserService(fakDb, fakeEmail);

// Function composition
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe    = (...fns) => x => fns.reduce((v, f) => f(v), x);

const process = pipe(
  validate,
  normalise,
  transform,
  persist,
);
```

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Variables** | `var`/`let`/`const`, coercion | TDZ, hoisting, scope chain | Hidden class impact of mutation |
| **Functions** | Declarations, expressions, arrow, defaults, rest | Closures, `this` binding, `call`/`apply`/`bind` | Generators, async generators, memoisation |
| **Objects** | Literals, dot/bracket access, methods | Prototypes, class inheritance, `Object.*` | Proxy/Reflect, metaprogramming, mixins |
| **Arrays** | `push`/`pop`/`slice`/`splice`, `forEach`/`map`/`filter` | `reduce`/`flatMap`/`find`/`some`, immutable patterns | Typed arrays, `SharedArrayBuffer`, Atomics |
| **Async** | Promises, `.then/.catch`, `async/await` | Event loop, microtasks, `Promise.all/allSettled/race` | Abort controller, retry patterns, concurrency control |
| **Modules** | `import`/`export`, default vs named | Dynamic `import()`, tree shaking | ESM vs CJS interop, dual packages, live bindings |
| **Types** | Primitives vs reference, `typeof` | Symbols, `WeakMap`/`WeakSet`, iterables | TypeScript generics, discriminated unions, branded types |
| **Error handling** | `try/catch/finally`, `throw` | Custom error classes, error types | Error boundaries, structured error propagation |
| **Performance** | Avoid unnecessary re-renders, use DevTools | Event delegation, debounce/throttle | V8 hidden classes, avoid `delete`, workers |
| **Security** | Avoid `innerHTML` with user input | Custom errors without info leakage | XSS/CSRF/prototype pollution prevention, CSP |
| **Patterns** | — | Strategy, Observer, Factory | Proxy, Decorator, SOLID, DI, functional composition |
| **Concurrency** | — | `Promise.all`, cancellation | Web Workers, `SharedArrayBuffer`, Atomics |
| **Testing** | Manual testing, console.log | Jest/Vitest unit tests, mocking | Integration tests, property-based testing, fuzzing |

---

## Tasks — Junior

### Task J-1 — Nullish coalescing vs logical OR

You have a user settings object. Write a function `getTimeout(settings)` that returns `settings.timeout` if it is defined (including `0`), otherwise returns `5000`. **Do not use `if` statements.**

---

### Task J-2 — Destructuring with defaults

Given:
```js
const response = { data: { items: [1, 2, 3] }, status: 200 };
```
In one destructuring statement, extract: `items` (default to `[]`), `status`, and rename `status` to `httpStatus`.

---

### Task J-3 — Closure counter

Write a factory function `createCounter(initial)` that returns an object with three methods: `increment()`, `decrement()`, and `reset()`. Each method should return the current count. The internal count must not be accessible from outside.

---

### Task J-4 — Promise chain

Write an `async` function `getUserPosts(userId)` that:
1. Fetches `/api/users/:id`.
2. If the response is not OK, throws an error with the HTTP status code.
3. Fetches `/api/posts?userId=:id`.
4. Returns an object `{ user, posts }`.
Handle all errors with a single `try/catch`.

---

### Task J-5 — Array transformation

Given an array of product objects `{ name, price, category }`, write a single chained expression that returns a sorted array of names (A→Z) of products in category `'electronics'` with `price < 500`.

---

### Task J-6 — Custom error

Create a `ValidationError` class that extends `Error`. It should accept a `field` name and a `message`. Instances should have `name === 'ValidationError'`, a `field` property, and a correct stack trace.

---

### Task J-7 — Event delegation

Given a `<ul id="list">` with many `<li>` children added dynamically, attach a **single** event listener on the `<ul>` that logs the text content of whichever `<li>` was clicked.

---

### Task J-8 — Module design

You are writing a `cart` module. Export: a `addItem(item)` function, a `removeItem(id)` function, and a `getTotal()` function. The items array must be private (not exported). Use ES module syntax.

---

## Tasks — Mid-level

### Task M-1 — Event loop order

Predict the exact console output order for the following code and explain why:

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
setTimeout(() => console.log('D'), 0);
Promise.resolve().then(() => console.log('E'));
console.log('F');
```

---

### Task M-2 — Debounce

Implement a `debounce(fn, delay)` function. It should return a new function that calls `fn` only after `delay` ms have elapsed since the last invocation. Also implement a `cancel()` method on the returned function.

---

### Task M-3 — Deep clone without libraries

Implement a `deepClone(value)` function that handles: plain objects, arrays, `Date`, `RegExp`, `null`, and primitives. (Do not use `structuredClone` or `JSON.parse/stringify`.)

---

### Task M-4 — Memoisation

Implement `memoize(fn)` that caches results by all arguments. Handle the case where arguments may be objects (use a multi-key cache strategy). The cache should be inspectable via a `.cache` property.

---

### Task M-5 — Generator — paginator

Write an async generator function `fetchPages(baseUrl)` that yields arrays of items fetched from `${baseUrl}?page=1`, `?page=2`, etc., stopping when the API returns an empty array.

---

### Task M-6 — Prototype chain

Without using `class`, create a `Shape` "class" and a `Circle` "class" that inherits from it using only `function` constructors and prototype assignment. `Shape` should have an `area()` method (returns 0), and `Circle` should override it to return `π * r²`.

---

### Task M-7 — Proxy — read-only object

Use `Proxy` to create a `readOnly(obj)` function that returns a proxy which throws a `TypeError` on any write, delete, or defineProperty operation.

---

### Task M-8 — Promise.allSettled retry

Given an array of async functions `tasks`, write a function `runWithRetry(tasks, retries)` that runs all tasks in parallel and retries any that fail up to `retries` times before giving up. Return an array of results (values for successes, errors for permanent failures).

---

## Tasks — Senior

### Task S-1 — Throttle with leading and trailing edge

Implement `throttle(fn, interval, { leading, trailing })`. The function should call `fn` at most once per `interval`. If `leading` is `true`, call it on the first invocation. If `trailing` is `true`, call it once more after the interval if any calls were made during the throttle window.

---

### Task S-2 — Observable from scratch

Implement a minimal `Observable` class compatible with the ReactiveX observable protocol:
- `Observable.create(subscriber)` — creates an observable.
- `observable.subscribe({ next, error, complete })` — subscribes.
- `observable.pipe(...operators)` — applies operators.
- Implement one operator: `map(fn)`.

---

### Task S-3 — Scheduler with concurrency limit

Implement a `Scheduler` class with a method `add(asyncFn)` that queues tasks. At most `N` tasks should run concurrently (N passed to the constructor). Return a promise from `add()` that resolves/rejects when the individual task completes.

---

### Task S-4 — Prototype pollution defence

Write a `safeMerge(target, source)` function that performs a deep merge but **ignores** any key that is `__proto__`, `constructor`, or `prototype`. Demonstrate how an undefended merge can pollute `Object.prototype` and how your version prevents it.

---

### Task S-5 — Virtual DOM diffing (concept)

Write a `diff(oldTree, newTree)` function where each tree node is `{ type, props, children }`. Return an array of patch operations (`{ op: 'replace'|'insert'|'remove', path, node }`). You do not need to apply the patches — just compute them.

---

### Task S-6 — Memory leak audit

Review the following code, identify all memory leaks, and rewrite it correctly:

```js
class Dashboard {
  constructor() {
    this.data = new Array(100000).fill({ value: Math.random() });
    window.addEventListener('resize', this.onResize);
    this.timer = setInterval(this.refresh, 5000);
  }

  onResize = () => this.render();
  refresh  = () => this.fetchData();

  destroy() {
    this.data = null;
  }
}
```

---

### Task S-7 — Custom iterator protocol

Implement a `LinkedList` class that:
1. Has `push(value)` and `pop()` methods.
2. Is iterable via `for...of`.
3. Has a custom `[Symbol.toStringTag]` of `'LinkedList'`.
4. Supports destructuring: `const [first, second] = list`.

---

### Task S-8 — TypeScript: conditional and mapped types

Write these TypeScript utility types without using built-ins:
1. `MyPartial<T>` — all properties optional.
2. `MyReadonly<T>` — all properties readonly.
3. `MyPick<T, K extends keyof T>` — pick subset of properties.
4. `DeepReadonly<T>` — recursively make all nested properties readonly.

---

---

## Answers — Junior

### Answer J-1

```js
function getTimeout(settings) {
  return settings.timeout ?? 5000;
}
// ?? only falls back for null/undefined, not for 0 or false
// getTimeout({ timeout: 0 })    → 0   ✓
// getTimeout({ timeout: null })  → 5000 ✓
// getTimeout({})                 → 5000 ✓
```

---

### Answer J-2

```js
const { data: { items = [] }, status: httpStatus } = response;
// items → [1, 2, 3]
// httpStatus → 200
```

---

### Answer J-3

```js
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    reset()     { count = initial; return count; },
  };
}

const c = createCounter(10);
c.increment(); // 11
c.increment(); // 12
c.reset();     // 10
// count is not accessible from outside — closure protects it
```

---

### Answer J-4

```js
async function getUserPosts(userId) {
  try {
    const userRes = await fetch(`/api/users/${userId}`);
    if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);
    const user = await userRes.json();

    const postsRes = await fetch(`/api/posts?userId=${userId}`);
    if (!postsRes.ok) throw new Error(`HTTP ${postsRes.status}`);
    const posts = await postsRes.json();

    return { user, posts };
  } catch (err) {
    console.error('getUserPosts failed:', err.message);
    throw err; // re-throw so callers know it failed
  }
}
```

---

### Answer J-5

```js
const result = products
  .filter(p => p.category === 'electronics' && p.price < 500)
  .map(p => p.name)
  .sort((a, b) => a.localeCompare(b));
```

---

### Answer J-6

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

const err = new ValidationError('email', 'Invalid email format');
err.name;    // 'ValidationError'
err.field;   // 'email'
err.message; // 'Invalid email format'
err instanceof ValidationError; // true
err instanceof Error;           // true
```

---

### Answer J-7

```js
document.getElementById('list').addEventListener('click', event => {
  const li = event.target.closest('li');
  if (li) {
    console.log(li.textContent);
  }
});
// One listener handles all current and future <li> children.
// closest('li') handles clicks on nested elements inside <li>.
```

---

### Answer J-8

```js
// cart.js
const items = []; // private — not exported

export function addItem(item) {
  items.push(item);
}

export function removeItem(id) {
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) items.splice(index, 1);
}

export function getTotal() {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

---

## Answers — Mid-level

### Answer M-1

**Output:** `A`, `F`, `C`, `E`, `B`, `D`

**Explanation:**
1. `'A'` — synchronous, runs immediately.
2. `'F'` — synchronous, runs immediately.
3. `'C'` and `'E'` — microtasks (Promise.resolve().then). The microtask queue is drained **completely** before the first macrotask fires.
4. `'B'` and `'D'` — macrotasks (setTimeout). Executed in order after the microtask queue is empty.

---

### Answer M-2

```js
function debounce(fn, delay) {
  let timerId;

  function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  }

  debounced.cancel = () => clearTimeout(timerId);

  return debounced;
}
```

---

### Answer M-3

```js
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value; // primitives
  if (value instanceof Date)   return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (Array.isArray(value))    return value.map(deepClone);

  const clone = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}
```

---

### Answer M-4

```js
function memoize(fn) {
  const cache = new Map();

  function memoized(...args) {
    // Build a cache key from all arguments
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  return memoized;
}
// Note: JSON.stringify key fails for circular refs and non-serialisable types.
// For those cases, use a recursive Map / WeakMap trie per argument.
```

---

### Answer M-5

```js
async function* fetchPages(baseUrl) {
  let page = 1;
  while (true) {
    const res = await fetch(`${baseUrl}?page=${page}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    if (!items.length) return; // stop when empty page
    yield items;
    page++;
  }
}

// Usage
for await (const page of fetchPages('/api/items')) {
  console.log('Page:', page);
}
```

---

### Answer M-6

```js
// Shape constructor
function Shape(color) {
  this.color = color;
}
Shape.prototype.area = function() { return 0; };
Shape.prototype.toString = function() { return `Shape(color=${this.color})`; };

// Circle inherits from Shape
function Circle(color, radius) {
  Shape.call(this, color); // borrow constructor
  this.radius = radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle; // fix constructor reference
Circle.prototype.area = function() { return Math.PI * this.radius ** 2; };

const c = new Circle('red', 5);
c.area();              // 78.53...
c instanceof Circle;   // true
c instanceof Shape;    // true
```

---

### Answer M-7

```js
function readOnly(obj) {
  const handler = {
    set(_, prop) {
      throw new TypeError(`Cannot set property '${prop}' — object is read-only`);
    },
    deleteProperty(_, prop) {
      throw new TypeError(`Cannot delete property '${prop}' — object is read-only`);
    },
    defineProperty(_, prop) {
      throw new TypeError(`Cannot define property '${prop}' — object is read-only`);
    },
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      // Recursively wrap nested objects
      if (value !== null && typeof value === 'object') return readOnly(value);
      return value;
    },
  };
  return new Proxy(obj, handler);
}
```

---

### Answer M-8

```js
async function runWithRetry(tasks, retries) {
  async function runOne(task) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await task();
      } catch (err) {
        if (attempt === retries) return { status: 'error', error: err };
        await new Promise(r => setTimeout(r, 200 * 2 ** attempt)); // backoff
      }
    }
  }

  return Promise.all(tasks.map(task =>
    runOne(task).then(
      value => (value?.status === 'error' ? value : { status: 'success', value }),
    )
  ));
}
```

---

## Answers — Senior

### Answer S-1

```js
function throttle(fn, interval, { leading = true, trailing = true } = {}) {
  let lastCallTime = 0;
  let trailingTimer = null;
  let lastArgs = null;

  return function throttled(...args) {
    const now = Date.now();
    lastArgs = args;

    if (leading && now - lastCallTime >= interval) {
      lastCallTime = now;
      clearTimeout(trailingTimer);
      trailingTimer = null;
      return fn.apply(this, args);
    }

    if (trailing) {
      clearTimeout(trailingTimer);
      const remaining = interval - (now - lastCallTime);
      trailingTimer = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0;
        trailingTimer = null;
        fn.apply(this, lastArgs);
      }, remaining);
    }
  };
}
```

---

### Answer S-2

```js
class Observable {
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;
  }

  static create(subscribeFn) {
    return new Observable(subscribeFn);
  }

  subscribe(observer) {
    let completed = false;
    const safeObserver = {
      next:     v => !completed && observer.next?.(v),
      error:    e => { if (!completed) { completed = true; observer.error?.(e); } },
      complete: () => { if (!completed) { completed = true; observer.complete?.(); } },
    };
    this._subscribeFn(safeObserver);
    return { unsubscribe: () => { completed = true; } };
  }

  pipe(...operators) {
    return operators.reduce((obs, op) => op(obs), this);
  }
}

// map operator
function map(fn) {
  return source => Observable.create(observer =>
    source.subscribe({
      next:     v => observer.next(fn(v)),
      error:    e => observer.error(e),
      complete: () => observer.complete(),
    })
  );
}

// Usage
const obs = Observable.create(observer => {
  observer.next(1);
  observer.next(2);
  observer.complete();
}).pipe(map(x => x * 10));

obs.subscribe({ next: console.log }); // 10, 20
```

---

### Answer S-3

```js
class Scheduler {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject });
      this._run();
    });
  }

  _run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { asyncFn, resolve, reject } = this.queue.shift();
      this.running++;
      asyncFn()
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this._run();
        });
    }
  }
}

// Usage
const scheduler = new Scheduler(3); // max 3 concurrent
tasks.forEach(task => scheduler.add(task));
```

---

### Answer S-4

```js
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.has(key)) continue; // skip dangerous keys

    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null
    ) {
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Demo: unsafe merge
const payload = JSON.parse('{"__proto__": {"polluted": true}}');
Object.assign({}, payload);  // Object.prototype.polluted === true!

// Safe merge
const safe = safeMerge({}, payload);
({}).polluted; // undefined — prototype not polluted
```

---

### Answer S-5

```js
function diff(oldTree, newTree, path = []) {
  const patches = [];

  if (!oldTree && newTree) {
    patches.push({ op: 'insert', path, node: newTree });
    return patches;
  }
  if (oldTree && !newTree) {
    patches.push({ op: 'remove', path, node: oldTree });
    return patches;
  }
  if (!oldTree && !newTree) return patches;

  if (oldTree.type !== newTree.type) {
    patches.push({ op: 'replace', path, node: newTree });
    return patches; // no point diffing children of different types
  }

  // Diff props (shallow for brevity)
  const oldProps = oldTree.props ?? {};
  const newProps = newTree.props ?? {};
  const allPropKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
  for (const key of allPropKeys) {
    if (oldProps[key] !== newProps[key]) {
      patches.push({ op: 'replace', path: [...path, 'props', key], node: newProps[key] });
    }
  }

  // Diff children
  const oldChildren = oldTree.children ?? [];
  const newChildren = newTree.children ?? [];
  const len = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < len; i++) {
    patches.push(...diff(oldChildren[i], newChildren[i], [...path, 'children', i]));
  }

  return patches;
}
```

---

### Answer S-6

**Identified leaks:**
1. `window.addEventListener('resize', this.onResize)` — listener never removed on destroy.
2. `setInterval(this.refresh, 5000)` — interval never cleared on destroy.
3. `this.data = null` in `destroy()` — data is cleared but the other two leaks remain; the `Dashboard` instance itself cannot be GC'd because `window` holds a reference to `this.onResize` (which holds a reference to `this`).

```js
class Dashboard {
  constructor() {
    this.data = new Array(100000).fill({ value: Math.random() });
    // store bound reference so we can remove the exact same function
    this._onResize = () => this.render();
    window.addEventListener('resize', this._onResize);
    this._timerId = setInterval(() => this.fetchData(), 5000);
  }

  render()    { /* ... */ }
  fetchData() { /* ... */ }

  destroy() {
    window.removeEventListener('resize', this._onResize); // remove listener
    clearInterval(this._timerId);                         // clear interval
    this.data = null;                                     // release large array
    this._onResize = null;                                // release closure
  }
}
```

---

### Answer S-7

```js
class LinkedList {
  #head = null;
  #size = 0;

  push(value) {
    this.#head = { value, next: this.#head };
    this.#size++;
  }

  pop() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    this.#size--;
    return value;
  }

  [Symbol.iterator]() {
    let current = this.#head;
    // Collect into array first so iteration goes in push order (optional)
    const values = [];
    while (current) { values.unshift(current.value); current = current.next; }
    return values[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() { return 'LinkedList'; }

  get size() { return this.#size; }
}

const list = new LinkedList();
list.push(1); list.push(2); list.push(3);
[...list];                          // [1, 2, 3]
const [first, second] = list;       // first=1, second=2
Object.prototype.toString.call(list); // '[object LinkedList]'
```

---

### Answer S-8

```ts
// 1. MyPartial
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// 2. MyReadonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 3. MyPick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 4. DeepReadonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Demo
interface Config {
  host: string;
  db: {
    port: number;
    name: string;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// ReadonlyConfig['db']['port'] is readonly — TS will error on assignment
```

---

*[Back to Table of Contents](#table-of-contents)*
