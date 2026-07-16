# TypeScript — Junior to Senior Roadmap

A learning roadmap of **TypeScript** features and patterns organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the docs. Each level ends with a set of practice tasks; answers are collected at the bottom.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Why TypeScript](#l1-why-typescript)
  - [Basic types](#l1-basic-types)
  - [Functions](#l1-functions)
  - [Objects and interfaces](#l1-objects-and-interfaces)
  - [Type aliases and unions](#l1-type-aliases-and-unions)
  - [Arrays and tuples](#l1-arrays-and-tuples)
  - [Enums](#l1-enums)
  - [Type narrowing basics](#l1-type-narrowing-basics)
  - [tsconfig basics](#l1-tsconfig-basics)
  - [Level 1 tasks](#level-1-tasks)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Generics](#l2-generics)
  - [Utility types](#l2-utility-types)
  - [Intersection types](#l2-intersection-types)
  - [Type narrowing — advanced](#l2-type-narrowing--advanced)
  - [Mapped types](#l2-mapped-types)
  - [Conditional types](#l2-conditional-types)
  - [Template literal types](#l2-template-literal-types)
  - [Classes and access modifiers](#l2-classes-and-access-modifiers)
  - [Modules and declaration files](#l2-modules-and-declaration-files)
  - [Level 2 tasks](#level-2-tasks)
- [Level 3 — Senior](#level-3--senior)
  - [Advanced generics](#l3-advanced-generics)
  - [Infer keyword](#l3-infer-keyword)
  - [Recursive types](#l3-recursive-types)
  - [Variance and covariance](#l3-variance-and-covariance)
  - [Decorators](#l3-decorators)
  - [Declaration merging](#l3-declaration-merging)
  - [Module augmentation](#l3-module-augmentation)
  - [Performance and compiler internals](#l3-performance-and-compiler-internals)
  - [Architecture patterns](#l3-architecture-patterns)
  - [Level 3 tasks](#level-3-tasks)
- [Quick reference table](#quick-reference-table)
- [Answers — Junior](#answers--junior)
- [Answers — Mid-level](#answers--mid-level)
- [Answers — Senior](#answers--senior)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each section lists what to know, why it matters, and a gotcha where relevant.
- Items marked with `*` are the most commonly used in day-to-day work.
- The tasks at the end of each level test practical understanding, not just definitions.

---

## Level 1 — Junior

### L1 Why TypeScript

| Concept | What it means |
|---|---|
| **Static typing** | Types are checked at compile time, not runtime. Catches bugs before the code runs. * |
| **Type inference** | TypeScript deduces types from values — you don't always have to write them explicitly. * |
| **Structural typing** | TypeScript checks the shape of objects, not their nominal class names. If it has the right properties, it matches. |
| **Transpilation** | TypeScript compiles to plain JavaScript. The output runs in any JS runtime. * |
| **`.ts` / `.tsx`** | `.ts` for plain TypeScript files, `.tsx` for files with JSX syntax. |
| **`tsc`** | The TypeScript compiler CLI. Runs type checking and emits JS output. |

> **Gotcha:** TypeScript types are erased at runtime. `typeof` in compiled JS still returns JS primitive names (`"string"`, `"number"`, etc.), not TypeScript type names.

---

### L1 Basic types

```ts
// Primitives
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let missing: undefined = undefined;

// Special types
let anything: any = "can be reassigned to anything";  // avoid — disables type checking
let flexible: unknown = "safer than any — must narrow before use";
let noReturn: never;          // a value that never occurs (e.g. exhaustive checks)
let voidFn: void;             // return type of functions that return nothing

// Literal types
let direction: "left" | "right" = "left";
let one: 1 = 1;
```

| Type | When to use |
|---|---|
| `string`, `number`, `boolean` | Basic primitives. * |
| `null` / `undefined` | Explicit absence of value — enable `strictNullChecks` to treat them as distinct types. * |
| `any` | Last resort escape hatch — turns off type checking for that value. Avoid. |
| `unknown` | Safer `any` — forces you to narrow the type before using the value. * |
| `never` | Values that can never exist — useful for exhaustive checks and throwing functions. |
| `void` | Return type for functions that don't return a meaningful value. * |

> **Gotcha:** `any` silently disables type safety. Prefer `unknown` when the type is genuinely uncertain, then narrow it with type guards before use.

---

### L1 Functions

```ts
// Parameter and return type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const greet = (name: string): string => `Hello, ${name}`;

// Optional parameter
function log(message: string, level?: string): void {
  console.log(`[${level ?? "INFO"}] ${message}`);
}

// Default parameter
function repeat(text: string, times: number = 1): string {
  return text.repeat(times);
}

// Rest parameters
function sum(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

// Function type
type BinaryOp = (a: number, b: number) => number;
const multiply: BinaryOp = (a, b) => a * b;
```

> **Gotcha:** If you annotate the return type explicitly, TypeScript will catch missing `return` branches. Without annotation it infers `undefined` for missing branches, which can hide bugs.

---

### L1 Objects and interfaces

```ts
// Inline object type
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name}, ${user.age}`);
}

// Interface
interface User {
  id: number;
  name: string;
  email?: string;      // optional property
  readonly createdAt: Date;  // cannot be reassigned after creation
}

// Extending an interface
interface Admin extends User {
  role: "admin" | "superadmin";
}

const admin: Admin = {
  id: 1,
  name: "Alice",
  role: "admin",
  createdAt: new Date(),
};
```

| Feature | Notes |
|---|---|
| `?` (optional) | Property may be omitted. Reading it returns `T \| undefined`. * |
| `readonly` | Prevents reassignment after initialization. Does not deep-freeze. * |
| `extends` | Interfaces can extend one or multiple other interfaces. * |
| Index signatures | `[key: string]: number` — allows arbitrary string keys. |

> **Gotcha:** `readonly` only prevents reassignment of the reference, not mutation of nested objects. Use `Readonly<T>` or `as const` for deeper immutability.

---

### L1 Type aliases and unions

```ts
// Type alias
type Point = { x: number; y: number };

// Union type
type StringOrNumber = string | number;
type Status = "pending" | "success" | "error";

// Intersection (combining types)
type Timestamped = { createdAt: Date; updatedAt: Date };
type TimestampedUser = User & Timestamped;
```

| Concept | Interface vs Type alias |
|---|---|
| **Declaration merging** | Interfaces support it; type aliases do not. |
| **Extends / implements** | Both can be used with `extends`. Classes can `implement` both. |
| **Computed / complex types** | Type aliases can express unions, intersections, mapped types. Interfaces cannot. |
| **Recommended default** | Prefer `interface` for object shapes; prefer `type` for unions, intersections, and utility compositions. |

---

### L1 Arrays and tuples

```ts
// Arrays
const ids: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// Read-only array
const config: readonly string[] = ["a", "b"];

// Tuple — fixed-length, ordered types
type Pair = [string, number];
const entry: Pair = ["age", 30];
const [label, value] = entry;  // destructuring preserves types

// Tuple with optional element
type OptionalTuple = [string, number?];

// Rest elements in tuples
type StringThenNumbers = [string, ...number[]];
```

> **Gotcha:** Arrays typed as `T[]` are mutable by default. Use `readonly T[]` or `ReadonlyArray<T>` when you want to prevent push/pop/splice.

---

### L1 Enums

```ts
// Numeric enum (default)
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

// String enum
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// Const enum — inlined at compile time, no JS object emitted
const enum HttpMethod {
  GET = "GET",
  POST = "POST",
}
```

| Enum type | Use case |
|---|---|
| Numeric | Simple ordered sets; values can be flags (bitwise). |
| String | Readable serialized values — prefer for APIs and logging. * |
| `const enum` | Zero-cost abstraction — values are inlined. Cannot be iterated at runtime. |
| Union of string literals | Often preferred over enums — simpler, no runtime object, tree-shakeable. * |

> **Gotcha:** Numeric enums allow reverse mapping (`Direction[0] === "Up"`), which can lead to surprising behavior. String enums are safer and easier to debug.

---

### L1 Type narrowing basics

```ts
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());  // TypeScript knows it's string here
  } else {
    console.log(value.toFixed(2));     // TypeScript knows it's number here
  }
}

// Truthiness narrowing
function printIfDefined(value: string | null) {
  if (value) {
    console.log(value.trim());
  }
}

// Equality narrowing
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // both must be string here
    console.log(a.toUpperCase());
  }
}
```

| Guard | What it narrows |
|---|---|
| `typeof x === "string"` | Primitives: `string`, `number`, `boolean`, `symbol`, `bigint`, `function`, `object`. * |
| `x === null` / `x == null` | `null` (strict) or `null | undefined` (loose). * |
| Truthiness `if (x)` | Removes `null`, `undefined`, `0`, `""`, `NaN`, `false`. |
| `in` operator | Narrows union members by property presence. |
| `instanceof` | Narrows to a class instance. |

---

### L1 tsconfig basics

```jsonc
// tsconfig.json — recommended strict baseline
{
  "compilerOptions": {
    "target": "ES2020",           // JS version to compile to
    "module": "ESNext",           // module system
    "moduleResolution": "bundler",// how imports are resolved
    "strict": true,               // enables all strict checks *
    "noUncheckedIndexedAccess": true,  // arr[i] has type T | undefined
    "noImplicitReturns": true,    // all code paths must return a value
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,      // default imports from CommonJS modules *
    "skipLibCheck": true,         // skip type checking of .d.ts files
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

| Option | Why it matters |
|---|---|
| `strict` | Enables `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, and more. Always enable. * |
| `target` | Controls which JS syntax is emitted. Match your runtime. |
| `moduleResolution` | `"bundler"` for Vite/webpack/esbuild; `"node"` for classic Node projects. |
| `noUncheckedIndexedAccess` | Array/object index access returns `T \| undefined` — prevents off-by-one bugs. |
| `paths` | Path aliases (`@/` → `src/`) — must match your bundler config. |

---

### Level 1 Tasks

**Task J-1 — Annotate a function**

Add correct TypeScript types to this function without changing its logic. The function takes a name string and an optional age number, and returns a greeting string.

```ts
function buildGreeting(name, age) {
  if (age !== undefined) {
    return `Hello, ${name}! You are ${age} years old.`;
  }
  return `Hello, ${name}!`;
}
```

---

**Task J-2 — Define an interface**

Define a `Product` interface with: `id` (number, readonly), `name` (string), `price` (number), `category` (string, optional). Then write a function `formatProduct(p: Product): string` that returns `"name — $price"`.

---

**Task J-3 — Union and narrowing**

Write a function `stringify(value: string | number | boolean): string` that:
- if `value` is a `string`, returns it uppercased
- if `value` is a `number`, returns it with 2 decimal places
- if `value` is a `boolean`, returns `"yes"` or `"no"`

---

**Task J-4 — Tuple**

Define a type `RGB` as a tuple of three numbers (0–255). Write a function `toHex(color: RGB): string` that converts it to a hex string like `"#ff8040"`.

---

**Task J-5 — Readonly and const**

Given the array below, make it so TypeScript prevents any mutation (push, pop, direct index assignment). Show two ways to do it.

```ts
const palette = ["red", "green", "blue"];
```

---

## Level 2 — Mid-level

### L2 Generics

```ts
// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic interface
interface Repository<T> {
  findById(id: number): T | undefined;
  save(entity: T): void;
  delete(id: number): void;
}

// Generic with default type
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

// Multiple type parameters
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return a.map((item, i) => [item, b[i]]);
}
```

| Pattern | Use case |
|---|---|
| `<T>` | Single type variable — generic function or class. * |
| `<T extends U>` | Constrain T to types assignable to U. * |
| `keyof T` | Union of all property keys of T. * |
| `T[K]` | Indexed access — type of property K on T. * |
| Default type parameter | `<T = unknown>` — used when a caller doesn't provide T. |

> **Gotcha:** Avoid over-constraining generics. `<T extends object>` is so broad it adds no value. Constrain only what you actually need from T.

---

### L2 Utility types

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial — all properties optional
type UserUpdate = Partial<User>;

// Required — all properties required (removes ?)
type StrictUser = Required<User>;

// Readonly — all properties readonly
type FrozenUser = Readonly<User>;

// Pick — select subset of properties
type PublicUser = Pick<User, "id" | "name" | "email">;

// Omit — exclude subset of properties
type SafeUser = Omit<User, "password">;

// Record — key-value map
type RoleMap = Record<"admin" | "user" | "guest", string[]>;

// Exclude / Extract — filter union members
type Primitives = string | number | boolean | object;
type OnlyPrimitive = Exclude<Primitives, object>;   // string | number | boolean
type OnlyObject = Extract<Primitives, object>;       // object

// NonNullable — removes null and undefined
type DefinedString = NonNullable<string | null | undefined>; // string

// ReturnType / Parameters
function fetchUser(id: number): Promise<User> { /* ... */ return Promise.resolve({} as User); }
type FetchReturn = ReturnType<typeof fetchUser>;          // Promise<User>
type FetchParams = Parameters<typeof fetchUser>;          // [id: number]

// Awaited — unwraps Promise
type ResolvedUser = Awaited<Promise<User>>;               // User
```

> **Gotcha:** `Partial<T>` makes every property `T | undefined`. If you then read a partial property without a null-check, TypeScript will complain under `strictNullChecks`.

---

### L2 Intersection types

```ts
type Serializable = { serialize(): string };
type Loggable = { log(): void };

type SerializableAndLoggable = Serializable & Loggable;

// Mixins via intersection
type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };

type TimestampedUser = WithTimestamps<User>;
// equivalent to User & { createdAt: Date; updatedAt: Date }
```

> **Gotcha:** When intersecting two types that have the same key with incompatible types (e.g., `{ id: string } & { id: number }`), the resulting type for `id` is `never`, making it impossible to assign. This is a common silent error — use `Omit` to remove conflicting keys before intersecting.

---

### L2 Type narrowing — advanced

```ts
// User-defined type guard
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

// Assertion function
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") throw new Error("Not a string");
}

// Discriminated union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "square":    return shape.side ** 2;
    case "rectangle": return shape.width * shape.height;
  }
}
```

| Technique | Use case |
|---|---|
| `x is T` predicate | Reusable type guard in an `if` condition. * |
| `asserts x is T` | Throw if wrong type; useful for validating unknown data. * |
| Discriminated union | Shared literal discriminant field (`kind`, `type`, `tag`) — TypeScript narrows each branch precisely. * |
| Exhaustive check | `const _: never = x` at the end of a switch to ensure all variants are handled. * |

---

### L2 Mapped types

```ts
// Basic mapped type
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Readonly mapped type
type Immutable<T> = {
  readonly [K in keyof T]: T[K];
};

// Remove readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Remove optional
type Concrete<T> = {
  [K in keyof T]-?: T[K];
};

// Remapping keys with `as`
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// Getters<{ name: string }> → { getName: () => string }
```

> **Gotcha:** Mapped types create a new type for every key in `keyof T`. If T is a union, mapped types distribute over its members — use `[K in keyof T]` inside the type to avoid unintended distribution.

---

### L2 Conditional types

```ts
// Basic conditional
type IsString<T> = T extends string ? "yes" : "no";

// Distributive conditional — distributes over union members
type IsArray<T> = T extends any[] ? true : false;
// IsArray<string | number[]> → false | true (= boolean)

// Non-distributive (wrap in tuple to prevent distribution)
type IsArrayNonDist<T> = [T] extends [any[]] ? true : false;

// Extract with conditional
type Flatten<T> = T extends Array<infer Item> ? Item : T;
// Flatten<string[]> → string
// Flatten<number> → number

// Filtering union members
type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];
```

---

### L2 Template literal types

```ts
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type CssProperty = "margin" | "padding";
type CssDirection = "Top" | "Right" | "Bottom" | "Left";
type CssKey = `${CssProperty}${CssDirection}`;
// "marginTop" | "marginRight" | ... | "paddingLeft"

// Extracting parts of a string
type ExtractRoute<S extends string> =
  S extends `${infer _Method} ${infer Path}` ? Path : never;
type Path = ExtractRoute<"GET /users/:id">;  // "/users/:id"
```

---

### L2 Classes and access modifiers

```ts
class Animal {
  readonly name: string;
  protected age: number;
  private #secret: string;  // hard private (ES2022)

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
    this.#secret = "classified";
  }

  speak(): string {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  breed: string;

  // Parameter shorthand — auto-assigns constructor params to fields
  constructor(name: string, age: number, public breed: string) {
    super(name, age);
    this.breed = breed;  // redundant here due to public shorthand
  }

  override speak(): string {
    return `${this.name} barks.`;
  }
}

// Abstract class
abstract class Shape {
  abstract area(): number;
  describe(): string {
    return `This shape has area ${this.area()}`;
  }
}
```

| Modifier | Accessible from |
|---|---|
| `public` (default) | Anywhere. |
| `protected` | Class and subclasses. |
| `private` | Class only — TypeScript enforcement (still accessible via JS). |
| `#name` | Class only — true JS private field, inaccessible from outside at runtime. * |
| `readonly` | Set in constructor only; cannot be reassigned. * |
| `override` | Explicit override of a parent method — compiler error if parent doesn't have it. |

---

### L2 Modules and declaration files

```ts
// Named exports
export type { User };
export { fetchUser };

// Default export
export default class UserService {}

// Re-exports
export { parseDate } from "./utils/date";
export * from "./models";

// Ambient declarations (.d.ts)
declare module "*.svg" {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    analytics: { track(event: string): void };
  }
}
```

| Concept | Notes |
|---|---|
| `.d.ts` files | Pure type declarations — no runtime JS. Used for typing JS libraries. * |
| `declare module` | Ambient module declarations — add types for modules that have none. |
| `declare global` | Augment the global scope (e.g., extend `Window`). |
| `/// <reference types="..." />` | Triple-slash reference — adds types from a package globally. |
| `@types/...` | Community type packages for popular JS libraries (e.g., `@types/node`). * |

---

### Level 2 Tasks

**Task M-1 — Generic filter**

Write a generic function `filterByKey<T, K extends keyof T>(items: T[], key: K, value: T[K]): T[]` that returns only the items where `item[key] === value`. Do not use `any`.

---

**Task M-2 — Utility type composition**

Given this interface:

```ts
interface Config {
  host: string;
  port: number;
  debug: boolean;
  apiKey: string;
}
```

Create:
1. `PublicConfig` — all fields except `apiKey`, all required
2. `ConfigPatch` — only `host`, `port`, and `debug`, all optional

---

**Task M-3 — Discriminated union + exhaustive check**

Model a `Result<T>` type that is either `{ ok: true; value: T }` or `{ ok: false; error: string }`. Write a function `unwrap<T>(result: Result<T>): T` that returns `value` on success or throws on error. Add an exhaustive check so TypeScript errors if a new variant is added without handling it.

---

**Task M-4 — Mapped type**

Write a `Nullable<T>` mapped type that makes every property of T `null | T[K]` (not optional — just adds `null`). Apply it to `User` and verify the types are correct.

---

**Task M-5 — Conditional + template literal**

Write a type `EventHandlers<T extends string>` that turns a union of event names into an object type where each key is `on${Capitalize<T>}` and each value is `() => void`. For example:

```ts
type Handlers = EventHandlers<"click" | "focus">;
// { onClick: () => void; onFocus: () => void }
```

---

## Level 3 — Senior

### L3 Advanced generics

```ts
// Higher-kinded types simulation
type Functor<F extends <T>(x: T) => unknown> = {
  map<A, B>(fa: ReturnType<F>, f: (a: A) => B): ReturnType<F>;
};

// Variadic tuple types
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
type Result = Concat<[string, number], [boolean, Date]>;
// [string, number, boolean, Date]

// Tail and Head of tuple
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never;

// Deep partial
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Branded types
type Brand<T, B extends string> = T & { readonly _brand: B };
type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

function getUser(id: UserId): void { /* ... */ }
// getUser(42 as UserId)  ✓
// getUser(42)            ✗  — plain number not assignable
```

---

### L3 Infer keyword

```ts
// Extract return type manually
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

// Extract first argument
type FirstArg<T extends (...args: any) => any> =
  T extends (first: infer F, ...args: any) => any ? F : never;

// Unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract array element
type ElementOf<T> = T extends (infer E)[] ? E : never;

// Extract constructor parameter types
type ConstructorParams<T extends new (...args: any) => any> =
  T extends new (...args: infer P) => any ? P : never;

// Deeply infer nested shape
type UnwrapNested<T> =
  T extends { data: infer D }
    ? D extends { payload: infer P }
      ? P
      : D
    : T;
```

> **Gotcha:** `infer` only works inside the extends clause of a conditional type. Multiple `infer` positions for the same name in a contravariant position (function parameters) produce an intersection; in a covariant position they produce a union.

---

### L3 Recursive types

```ts
// JSON type
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

// Deep readonly
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// Path type (dot-separated keys)
type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? Paths<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
    : `${Prefix}${K}`;
}[keyof T & string];

// Flatten nested arrays
type Flatten<T> = T extends ReadonlyArray<infer Item>
  ? Item extends ReadonlyArray<unknown>
    ? Flatten<Item>
    : Item
  : T;
```

> **Gotcha:** Recursive types can cause the TypeScript compiler to hit recursion depth limits and slow down significantly. Add explicit depth limits for types that recurse deeply, or restructure to use iterative mapped types where possible.

---

### L3 Variance and covariance

```ts
// Covariance — function return type
type Producer<T> = () => T;
// Producer<Dog> is assignable to Producer<Animal> if Dog extends Animal ✓

// Contravariance — function parameter type
type Consumer<T> = (value: T) => void;
// Consumer<Animal> is assignable to Consumer<Dog> — NOT Consumer<Dog> to Consumer<Animal> ✓

// Bivariant — method shorthand (less safe, legacy)
interface Bivariant<T> {
  method(x: T): void;   // bivariant method — AVOID
}
interface Contravariant<T> {
  method: (x: T) => void;  // contravariant property — PREFER *
}

// Variance annotations (TS 4.7+)
type Provider<out T> = () => T;    // covariant
type Receiver<in T> = (x: T) => void; // contravariant
```

| Term | Meaning |
|---|---|
| **Covariant** | Subtype can be used where supertype is expected (return types). |
| **Contravariant** | Supertype can be used where subtype is expected (parameter types). |
| **Bivariant** | Both directions allowed — TypeScript's legacy method shorthand for compatibility. |
| **Invariant** | Exact type required — neither direction allowed. |
| `in` / `out` annotations | TS 4.7+: explicitly mark variance, improves type checking speed. |

---

### L3 Decorators

```ts
// Class decorator (TS 5.0 — uses TC39 stage 3 standard)
function sealed(target: new (...args: any[]) => object) {
  Object.seal(target);
  Object.seal(target.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;
  constructor(t: string) { this.title = t; }
}

// Method decorator
function log(target: unknown, context: ClassMethodDecoratorContext) {
  return function(this: unknown, ...args: unknown[]) {
    console.log(`Calling ${String(context.name)} with`, args);
    return (target as Function).apply(this, args);
  };
}

class Calculator {
  @log
  add(a: number, b: number) { return a + b; }
}

// Auto-accessor decorator
class Person {
  @track
  accessor name: string = "";
}
```

| Decorator type | Applied to |
|---|---|
| Class | The class constructor. |
| Method | A method of a class. |
| Field / accessor | A class field or auto-accessor. |
| Getter / setter | A getter or setter on a class. |

> **Gotcha:** TypeScript 5.0 introduced TC39-standard decorators. The older experimental decorators (`experimentalDecorators: true`) work differently and are not interchangeable. Most frameworks (NestJS, Angular) still use the legacy decorators — check framework requirements before choosing which to enable.

---

### L3 Declaration merging

```ts
// Interface merging
interface Request {
  body: unknown;
}
interface Request {
  user?: { id: number; role: string };  // merged into the same Request type
}
// Result: Request has both body and user

// Namespace merging with a function
function padLeft(value: string, padding: string | number): string {
  /* ... */
  return value;
}
namespace padLeft {
  export type PaddingType = "left" | "right" | "center";
}
// padLeft.PaddingType is now a valid type

// Enum merging
enum Fruit { Apple = 0 }
// Enums CANNOT be merged — this is a compile error
```

| What merges | Notes |
|---|---|
| Interfaces | Multiple `interface Foo { ... }` declarations are merged. * |
| Namespaces | Multiple `namespace Foo { ... }` declarations are merged. |
| Namespace + function | Add static members to a function via namespace. |
| Namespace + class | Add static namespace members to a class. |
| Namespace + enum | Extend an enum with helper functions/values via namespace. |

---

### L3 Module augmentation

```ts
// Augmenting an external module's types
import "express";

declare module "express" {
  interface Request {
    currentUser?: { id: string; role: "admin" | "user" };
  }
}

// Augmenting global types
declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}
Array.prototype.last = function () {
  return this[this.length - 1];
};

// Type-only imports (avoids importing the value)
import type { User } from "./models";
```

> **Gotcha:** Module augmentation only works when the file is treated as a module (has at least one `import` or `export`). If the file has neither, all declarations are global. Add `export {}` to force a file to be treated as a module.

---

### L3 Performance and compiler internals

| Topic | Notes |
|---|---|
| **Type instantiation depth** | TypeScript limits recursive type depth (~100 levels). Use `// @ts-ignore` sparingly or restructure the type. |
| **`skipLibCheck`** | Skips `.d.ts` type checking — faster but hides issues in dependency types. |
| **`isolatedModules`** | Each file must be transpilable independently (required by esbuild/Babel). Disables `const enum` and ambient type-only imports. * |
| **Project references** | Split a large codebase into sub-projects for incremental builds (`tsc --build`). * |
| **`incremental`** | Saves `.tsbuildinfo` file; only recompiles changed files. * |
| **Type-only exports/imports** | `import type` / `export type` — removed at emit, never load runtime values. Reduces bundle surprises. * |
| **`verbatimModuleSyntax`** | TS 5.0+: enforces `import type` for type-only imports. Replaces `importsNotUsedAsValues`. |
| **`noEmit`** | Only type-checks; lets the bundler handle transpilation. Common in Vite/Next.js setups. * |
| **Declaration maps** | `.d.ts.map` files — map declaration files back to source `.ts` for go-to-definition in monorepos. |

---

### L3 Architecture patterns

| Pattern | Description |
|---|---|
| **Branded / opaque types** | Prevent mixing semantically different IDs with the same underlying type. * |
| **Parse, don't validate** | Accept `unknown`, parse with Zod/Valibot, return a typed value — never pass raw input. * |
| **Repository pattern with generics** | `Repository<T>` interface — swap implementations without touching business logic. |
| **Builder pattern with types** | Accumulate state in type parameters — compile-time enforcement of required steps. |
| **Type-safe event emitter** | `EventEmitter<{ 'user:created': User; 'order:placed': Order }>` — fully typed emit/on. |
| **Phantom types** | Add a type-level marker to a value without affecting its runtime representation. |
| **Zod schema as source of truth** | `const userSchema = z.object(...)` → `type User = z.infer<typeof userSchema>`. * |
| **Satisfies operator** | `config satisfies Config` — validates shape without widening — TypeScript 4.9+. * |

```ts
// Satisfies — validate without widening
const palette = {
  red:   [255, 0,   0  ],
  green: [0,   255, 0  ],
  blue:  "#0000FF",     // still inferred as string, not narrowed to Config value
} satisfies Record<string, string | number[]>;

palette.red.map(x => x);   // ✓ — still typed as number[], not (string | number[])
palette.blue.toUpperCase(); // ✓ — still typed as string

// Parse, don't validate (with Zod)
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

function parseUser(raw: unknown): User {
  return UserSchema.parse(raw); // throws with structured errors if invalid
}
```

---

### Level 3 Tasks

**Task S-1 — Branded types**

Create branded types `UserId`, `OrderId`, and `ProductId` (all backed by `number`). Write functions `getUser(id: UserId)`, `getOrder(id: OrderId)`. Show that passing a plain `number` or the wrong branded type causes a compile error.

---

**Task S-2 — Deep partial**

Write a `DeepPartial<T>` utility type that makes every property at every level optional. Apply it to this deeply nested config:

```ts
interface AppConfig {
  server: { host: string; port: number; tls: { cert: string; key: string } };
  db: { url: string; poolSize: number };
}
```

---

**Task S-3 — Infer + conditional types**

Write a type `UnpackPromise<T>` that recursively unwraps nested Promises:
- `UnpackPromise<Promise<Promise<string>>>` → `string`
- `UnpackPromise<number>` → `number`

---

**Task S-4 — Builder pattern with type accumulation**

Implement a `QueryBuilder` class that accumulates selected fields into a type parameter and only allows `.execute()` when at least one field has been selected (enforced at the type level, not runtime).

---

**Task S-5 — Module augmentation**

Augment the `express` `Request` type (or create a mock module `"my-framework"`) to add a `currentUser` property of type `{ id: string; roles: string[] } | undefined`. Show that accessing `req.currentUser` in a typed handler gives correct intellisense, and that accessing a non-existent property is a compile error.

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Types** | Primitives, `any`, `unknown`, `void` | Union, intersection, literal types | Branded, phantom, opaque types |
| **Functions** | Annotations, optional/rest params | Overloads, generic functions | Variadic tuple generics, HKT simulation |
| **Objects** | `interface`, `type`, `readonly` | Utility types, mapped types | Deep mapped, recursive types |
| **Generics** | `<T>` basics, `extends` constraint | `keyof`, `T[K]`, constrained generics | Variance annotations, `infer`, multi-level inference |
| **Narrowing** | `typeof`, truthiness, `in` | Discriminated unions, type predicates | Assertion functions, exhaustive `never` checks |
| **Classes** | Public/private/protected, `readonly` | `abstract`, `implements`, `override` | Decorators (TC39), mixin patterns |
| **Modules** | `import` / `export` basics | `.d.ts`, `@types/`, `declare module` | Module augmentation, declaration merging |
| **Compiler** | `tsconfig` basics, `strict` mode | `paths`, `baseUrl`, `isolatedModules` | Project references, incremental builds, `verbatimModuleSyntax` |
| **Patterns** | — | Utility composition, Zod schemas | Builder, Repository, parse-don't-validate |
| **Runtime safety** | Type annotations | `unknown` + narrowing | Zod/Valibot runtime parsing, `satisfies` |

---

## Answers — Junior

### Answer J-1

```ts
function buildGreeting(name: string, age?: number): string {
  if (age !== undefined) {
    return `Hello, ${name}! You are ${age} years old.`;
  }
  return `Hello, ${name}!`;
}
```

The `?` after `age` makes it optional (type `number | undefined`). The return type `: string` ensures all branches return a string.

---

### Answer J-2

```ts
interface Product {
  readonly id: number;
  name: string;
  price: number;
  category?: string;
}

function formatProduct(p: Product): string {
  return `${p.name} — $${p.price}`;
}
```

`readonly id` prevents reassignment after creation. `category?` is optional so it may be omitted.

---

### Answer J-3

```ts
function stringify(value: string | number | boolean): string {
  if (typeof value === "string")  return value.toUpperCase();
  if (typeof value === "number")  return value.toFixed(2);
  return value ? "yes" : "no";
}
```

Three `typeof` checks exhaust the union. After the first two checks, TypeScript narrows `value` to `boolean` in the last branch.

---

### Answer J-4

```ts
type RGB = [number, number, number];

function toHex([r, g, b]: RGB): string {
  return "#" + [r, g, b]
    .map(n => n.toString(16).padStart(2, "0"))
    .join("");
}

// toHex([255, 128, 64]) → "#ff8040"
```

Destructuring preserves the tuple element types. `toString(16)` converts to hex; `padStart(2, "0")` ensures two characters per channel.

---

### Answer J-5

```ts
// Method 1 — readonly modifier in declaration
const palette1: readonly string[] = ["red", "green", "blue"];

// Method 2 — as const assertion
const palette2 = ["red", "green", "blue"] as const;
// palette2 is readonly ["red", "green", "blue"] — narrowed to literals
```

`readonly string[]` prevents `push`/`pop`/index writes but keeps element type as `string`. `as const` additionally narrows each element to its literal type.

---

## Answers — Mid-level

### Answer M-1

```ts
function filterByKey<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter(item => item[key] === value);
}

// Usage
interface User { id: number; role: "admin" | "user" }
const users: User[] = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
];
const admins = filterByKey(users, "role", "admin");
```

`K extends keyof T` constrains `key` to valid property names of `T`. `T[K]` ensures `value` has exactly the type of that property.

---

### Answer M-2

```ts
interface Config {
  host: string;
  port: number;
  debug: boolean;
  apiKey: string;
}

// 1. All fields except apiKey, all required
type PublicConfig = Required<Omit<Config, "apiKey">>;

// 2. Only host, port, debug — all optional
type ConfigPatch = Partial<Pick<Config, "host" | "port" | "debug">>;
```

`Omit` removes `apiKey`, then `Required` ensures no optional stragglers. `Pick` selects the three fields, then `Partial` makes them optional.

---

### Answer M-3

```ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function unwrap<T>(result: Result<T>): T {
  if (result.ok) return result.value;
  if (!result.ok) throw new Error(result.error);
  // Exhaustive check — if a new variant is added, this line errors
  const _exhaustive: never = result;
  return _exhaustive;
}
```

The discriminant field `ok` narrows each branch. The `never` assignment at the bottom tells TypeScript this code is unreachable — if a new `ok: "maybe"` variant is added, TypeScript will flag the `never` assignment.

---

### Answer M-4

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; email: string | null }
```

The mapped type iterates over `keyof T` and appends `| null` to each value type. Unlike `Partial`, properties remain present (not optional).

---

### Answer M-5

```ts
type EventHandlers<T extends string> = {
  [K in T as `on${Capitalize<K>}`]: () => void;
};

type Handlers = EventHandlers<"click" | "focus">;
// { onClick: () => void; onFocus: () => void }
```

The `as` clause in a mapped type remaps keys. `Capitalize` is a built-in TypeScript string utility type that uppercases the first character.

---

## Answers — Senior

### Answer S-1

```ts
type Brand<T, B extends string> = T & { readonly _brand: B };

type UserId    = Brand<number, "UserId">;
type OrderId   = Brand<number, "OrderId">;
type ProductId = Brand<number, "ProductId">;

function getUser(id: UserId): void { /* ... */ }
function getOrder(id: OrderId): void { /* ... */ }

declare const uid: UserId;
declare const oid: OrderId;

getUser(uid);  // ✓
getUser(oid);  // ✗ — Argument of type 'OrderId' is not assignable to 'UserId'
getUser(42);   // ✗ — Argument of type 'number' is not assignable to 'UserId'

// Casting at trust boundaries (e.g., after DB query)
const id = 1 as UserId;
getUser(id); // ✓
```

---

### Answer S-2

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface AppConfig {
  server: { host: string; port: number; tls: { cert: string; key: string } };
  db: { url: string; poolSize: number };
}

type PartialConfig = DeepPartial<AppConfig>;
// {
//   server?: {
//     host?: string;
//     port?: number;
//     tls?: { cert?: string; key?: string };
//   };
//   db?: { url?: string; poolSize?: number };
// }
```

The conditional `T extends object` routes objects through the mapped type recursively, and leaves primitives untouched.

---

### Answer S-3

```ts
type UnpackPromise<T> = T extends Promise<infer U>
  ? UnpackPromise<U>
  : T;

type A = UnpackPromise<Promise<Promise<string>>>;  // string
type B = UnpackPromise<number>;                    // number
type C = UnpackPromise<Promise<boolean[]>>;        // boolean[]
```

If `T` is a `Promise`, `infer U` captures the resolved value and the type recurses. When `T` is no longer a `Promise`, it is returned as-is.

---

### Answer S-4

```ts
// Tracks whether at least one field has been selected via a boolean type param
class QueryBuilder<HasFields extends boolean = false> {
  private fields: string[] = [];

  select<T extends string>(field: T): QueryBuilder<true> {
    this.fields.push(field);
    return this as unknown as QueryBuilder<true>;
  }

  // execute is only callable when HasFields = true
  execute(this: QueryBuilder<true>): string {
    return `SELECT ${this.fields.join(", ")}`;
  }
}

const qb = new QueryBuilder();
// qb.execute()           // ✗ — 'this' context of type 'QueryBuilder<false>' is not assignable to 'QueryBuilder<true>'
qb.select("id").execute(); // ✓ → "SELECT id"
qb.select("id").select("name").execute(); // ✓ → "SELECT id, name"
```

The `HasFields` type parameter accumulates intent. The `this: QueryBuilder<true>` parameter is a typed-`this` constraint — TypeScript checks that `this` has the correct type at the call site.

---

### Answer S-5

```ts
// types/express.d.ts
import "express";

declare module "express" {
  interface Request {
    currentUser?: { id: string; roles: string[] };
  }
}

// handler.ts
import { Request, Response } from "express";

export function meHandler(req: Request, res: Response): void {
  if (!req.currentUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // currentUser is { id: string; roles: string[] } here
  res.json({ id: req.currentUser.id, roles: req.currentUser.roles });
  // req.currentUser.foo  // ✗ — Property 'foo' does not exist
}
```

The augmentation file must import `"express"` to be treated as a module (not a global script). The `interface Request` declaration inside `declare module "express"` is merged with Express's own `Request` interface.
