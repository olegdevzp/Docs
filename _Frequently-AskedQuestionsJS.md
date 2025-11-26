# Frequently Asked Questions - JavaScript & Angular

## Table of Contents

### General Web Questions
- [Web Page Loading](#web-page-loading)
- [Image Optimization](#image-optimization)
- [Performance Challenges in Frontend Applications](#performance-challenges)
- [XSS Attacks](#xss-attacks)
- [CDN (Content Delivery Network)](#cdn)
- [Microfrontends](#microfrontends)

### JavaScript
- [Event Loop](#event-loop)
- [Design Patterns](#design-patterns)
- [Call, Bind, Apply](#call-bind-apply)
- [Lexical Environment](#lexical-environment)
- [Closures](#closures)
- [This Keyword](#this-keyword)
- [How JavaScript Loads](#how-js-loads)
- [OOP Principles & SOLID](#oop-solid)
- [Different Methods to Create Objects in JavaScript](#create-objects-js)

### TypeScript
- [TypeScript Basics](#typescript-basics)
- [Interface vs Abstract Class](#interface-vs-abstract-class)

### Angular
- [Angular Evolution (14-20)](#angular-evolution)
- [Standalone vs Module](#standalone-module)
- [Angular Material](#angular-material)
- [Service in Modal Window](#service-in-modal)
- [Accessibility of Services in Parent Modules](#service-accessibility)
- [Async Pipe](#async-pipe)
- [Signals Deep Dive](#signals)
    - [Signals vs LinkedSignal vs Computed Signals](#signals-comparison)
- [Modificators of Injectors](#injector-modificators)
- [Directive vs Component](#directive-vs-component)
- [Get Component Instance with Directive](#component-instance-directive)
- [Component Interaction Types](#component-interaction)

### CSS
- [CSS Features (Last 5 Years)](#css-last-years)

---

## General Web Questions

### <a name="web-page-loading"></a>Web Page Loading

**How does a web page load?**

1. **DNS Resolution**: Browser resolves domain to IP address
2. **TCP Connection**: Establishes connection with server (3-way handshake)
3. **HTTP Request**: Browser sends GET request
4. **Server Response**: Server sends HTML document
5. **HTML Parsing**: Browser parses HTML and builds DOM tree
6. **Resource Discovery**: Parser discovers linked resources (CSS, JS, images)
7. **CSS Parsing**: CSSOM (CSS Object Model) is built
8. **Render Tree**: DOM + CSSOM = Render Tree
9. **Layout**: Browser calculates positions and sizes
10. **Paint**: Pixels are drawn to screen
11. **JavaScript Execution**: JS can modify DOM/CSSOM

**Critical Rendering Path Optimization:**
- Minimize critical resources
- Minimize critical bytes
- Minimize critical path length
- Use async/defer for scripts
- Inline critical CSS

[Back to Top](#table-of-contents)

---

### <a name="image-optimization"></a>Image Optimization

**Best Practices:**

1. **Format Selection**:
   - WebP: Modern format, excellent compression
   - AVIF: Best compression, growing support
   - JPEG: Photos with many colors
   - PNG: Images with transparency
   - SVG: Icons and simple graphics

2. **Techniques**:
   - Lazy loading (`loading="lazy"`)
   - Responsive images (`srcset`, `sizes`)
   - Image compression tools
   - CDN delivery
   - Angular: Use `NgOptimizedImage` directive

3. **NgOptimizedImage Benefits**:
   - Automatic `srcset` generation
   - Priority hints for LCP images
   - Lazy loading by default
   - Prevents layout shift

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="hero.jpg" width="400" height="300" priority>
  `
})
export class HeroComponent {}
```

[Back to Top](#table-of-contents)

---

### <a name="performance-challenges"></a>Performance Challenges in Frontend Applications

**Common Issues:**

1. **Large Bundle Sizes**
   - Solution: Code splitting, lazy loading, tree shaking

2. **Unoptimized Images**
   - Solution: Compression, modern formats, lazy loading

3. **Too Many HTTP Requests**
   - Solution: Bundling, HTTP/2, resource hints

4. **Blocking JavaScript**
   - Solution: async/defer, code splitting

5. **Poor Caching Strategy**
   - Solution: Cache-Control headers, service workers

6. **Memory Leaks**
   - Solution: Proper cleanup, unsubscribe from observables

7. **Unnecessary Re-renders**
   - Solution: OnPush change detection, signals, memoization

**Angular-Specific:**
- Use OnPush change detection
- Implement trackBy with *ngFor
- Use signals for reactive state
- Lazy load modules
- Use pure pipes

[Back to Top](#table-of-contents)

---

### <a name="xss-attacks"></a>XSS Attacks

**Cross-Site Scripting (XSS)** allows attackers to inject malicious scripts.

**Types:**
1. **Stored XSS**: Malicious script stored on server
2. **Reflected XSS**: Script in URL parameters
3. **DOM-based XSS**: Vulnerability in client-side code

**Prevention:**
- Sanitize user input
- Escape output
- Use Content Security Policy (CSP)
- HttpOnly cookies
- Angular automatically sanitizes values

**Angular Protection:**
```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

[Back to Top](#table-of-contents)

---

### <a name="cdn"></a>CDN (Content Delivery Network)

**What is CDN?**
Distributed network of servers that deliver content based on geographic location.

**Benefits:**
- Reduced latency
- Improved load times
- Reduced bandwidth costs
- DDoS protection
- Scalability

**Use Cases:**
- Static assets (images, CSS, JS)
- Libraries (Angular, RxJS)
- Videos
- API responses (with caching)

**Popular CDNs:**
- Cloudflare
- AWS CloudFront
- Akamai
- Google Cloud CDN

[Back to Top](#table-of-contents)

---

### <a name="microfrontends"></a>Microfrontends

**Architecture pattern** where frontend is decomposed into smaller, independent applications.

**Benefits:**
- Independent deployment
- Team autonomy
- Technology flexibility
- Incremental upgrades

**Implementation Approaches:**
1. **Module Federation** (Webpack 5)
2. **iframes**
3. **Web Components**
4. **Single-SPA framework**

**Angular Example (Module Federation):**
```typescript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    mfe1: 'mfe1@http://localhost:4201/remoteEntry.js'
  }
})
```

[Back to Top](#table-of-contents)

---

## JavaScript

### <a name="event-loop"></a>Event Loop

**How JavaScript handles asynchronous operations.**

**Components:**
1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Browser APIs (setTimeout, fetch, DOM events)
3. **Callback Queue**: Holds callbacks from Web APIs
4. **Microtask Queue**: Promises, queueMicrotask
5. **Event Loop**: Moves tasks from queues to call stack

**Execution Order:**
```javascript
console.log('1'); // Synchronous

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4'); // Synchronous

// Output: 1, 4, 3, 2
```

**Priority:**
1. Synchronous code
2. Microtasks (Promises)
3. Macrotasks (setTimeout, setInterval)

[Back to Top](#table-of-contents)

---

### <a name="design-patterns"></a>Design Patterns

**Common JavaScript Patterns:**

**1. Singleton**
```typescript
class ConfigService {
  private static instance: ConfigService;
  
  private constructor() {}
  
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
}
```

**2. Observer (Publish/Subscribe)**
```typescript
class EventEmitter {
  private events = new Map<string, Function[]>();
  
  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  emit(event: string, data: any) {
    this.events.get(event)?.forEach(cb => cb(data));
  }
}
```

**3. Factory**
```typescript
class UserFactory {
  createUser(type: 'admin' | 'regular') {
    return type === 'admin' ? new AdminUser() : new RegularUser();
  }
}
```

**4. Module Pattern**
```typescript
const Calculator = (() => {
  const privateValue = 0;
  
  return {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b
  };
})();
```

[Back to Top](#table-of-contents)

---

### <a name="call-bind-apply"></a>Call, Bind, Apply

**Methods to control `this` context.**

**call()**: Invokes function immediately with specified `this`
```javascript
function greet(greeting: string) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'John' };
greet.call(user, 'Hello'); // "Hello, John"
```

**apply()**: Like call(), but takes arguments as array
```javascript
function sum(a: number, b: number) {
  return a + b + this.base;
}

const obj = { base: 10 };
sum.apply(obj, [5, 3]); // 18
```

**bind()**: Returns new function with bound `this`
```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};

const greetFunc = person.greet.bind(person);
setTimeout(greetFunc, 1000); // "Hi, I'm Alice"
```

[Back to Top](#table-of-contents)

---

### <a name="lexical-environment"></a>Lexical Environment

**Structure that holds identifier-variable mapping.**

**Components:**
1. **Environment Record**: Stores variables and functions
2. **Reference to outer environment**: For scope chain

**Types:**
- **Global Environment**: Outermost scope
- **Function Environment**: Created on function invocation
- **Block Environment**: Created by let/const blocks

```javascript
const global = 'global'; // Global Environment

function outer() { // Function Environment
  const outerVar = 'outer';
  
  function inner() { // Function Environment
    const innerVar = 'inner';
    console.log(innerVar, outerVar, global); // Access all scopes
  }
  
  inner();
}
```

[Back to Top](#table-of-contents)

---

### <a name="closures"></a>Closures

**Function that retains access to outer scope variables.**

```typescript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount(); // 2
```

**Use Cases:**
- Data privacy
- Factory functions
- Event handlers
- Memoization
- Currying

**Angular Service Example:**
```typescript
export class CacheService {
  private createCache<T>() {
    const cache = new Map<string, T>();
    
    return {
      get: (key: string) => cache.get(key),
      set: (key: string, value: T) => cache.set(key, value),
      has: (key: string) => cache.has(key)
    };
  }
}
```

[Back to Top](#table-of-contents)

---

### <a name="this-keyword"></a>This Keyword

**Context depends on how function is called.**

**Rules:**
1. **Global context**: `window` (browser) or `global` (Node)
2. **Object method**: The object
3. **Constructor**: New instance
4. **Arrow function**: Lexical `this`
5. **Explicit binding**: call/bind/apply

```typescript
const obj = {
  name: 'Object',
  
  regularFunction() {
    console.log(this.name); // 'Object'
  },
  
  arrowFunction: () => {
    console.log(this.name); // undefined (lexical scope)
  },
  
  nestedExample() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
    
    setTimeout(() => {
      console.log(this.name); // 'Object' (arrow function)
    }, 100);
  }
};
```

**Angular Component:**
```typescript
export class MyComponent {
  name = 'Component';
  
  ngOnInit() {
    // Arrow function preserves 'this'
    setTimeout(() => {
      console.log(this.name); // 'Component'
    }, 1000);
  }
}
```

[Back to Top](#table-of-contents)

---

### <a name="how-js-loads"></a>How JavaScript Loads

**Script Loading:**

**1. Normal `<script>`**
- Blocks HTML parsing
- Executes immediately
- Maintains order

**2. `async`**
- Downloads in parallel
- Executes when ready
- May execute out of order
- Good for independent scripts

**3. `defer`**
- Downloads in parallel
- Executes after HTML parsing
- Maintains order
- Good for scripts needing DOM

```html
<script src="blocking.js"></script>
<script src="independent.js" async></script>
<script src="needs-dom.js" defer></script>
```

**Module Scripts:**
```html
<script type="module" src="module.js"></script>
<!-- Deferred by default, maintains order -->
```

[Back to Top](#table-of-contents)

---

### <a name="oop-solid"></a>OOP Principles & SOLID

**OOP Principles:**
1. **Encapsulation**: Hide internal details
2. **Abstraction**: Expose only necessary interfaces
3. **Inheritance**: Reuse code through parent-child relationships
4. **Polymorphism**: Same interface, different implementations

**SOLID Principles:**

**S - Single Responsibility**
```typescript
// ❌ Bad
class User {
  saveToDatabase() {}
  sendEmail() {}
  generateReport() {}
}

// ✅ Good
class User {}
class UserRepository {
  save(user: User) {}
}
class EmailService {
  send(to: string) {}
}
```

**O - Open/Closed**
```typescript
// ✅ Open for extension, closed for modification
interface PaymentMethod {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentMethod {
  pay(amount: number) {}
}

class PayPalPayment implements PaymentMethod {
  pay(amount: number) {}
}
```

**L - Liskov Substitution**
```typescript
// Subtypes must be substitutable for base types
class Bird {
  fly() {}
}

class Penguin extends Bird {
  // ❌ Violates LSP - penguins can't fly
  fly() { throw new Error('Cannot fly'); }
}
```

**I - Interface Segregation**
```typescript
// ❌ Fat interface
interface Worker {
  work(): void;
  eat(): void;
}

// ✅ Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}
```

**D - Dependency Inversion**
```typescript
// ✅ Depend on abstractions
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}

class UserService {
  constructor(private logger: Logger) {}
}
```

[Back to Top](#table-of-contents)

---

### <a name="create-objects-js"></a>Different Methods to Create Objects in JavaScript

JavaScript provides multiple ways to create objects, each with its own use cases and advantages.

---

#### Method 1: Object Literal

**Most common and simplest way.**

```javascript
const user = {
  name: 'John',
  age: 30,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet(); // "Hello, I'm John"
```

**Pros:**
- Simple and readable
- Fast to create
- Good for single objects

**Cons:**
- No reusability
- No privacy
- Must create each object manually

---

#### Method 2: Constructor Function

**Traditional OOP approach (pre-ES6).**

```javascript
function User(name, age) {
  this.name = name;
  this.age = age;
  
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const user1 = new User('John', 30);
const user2 = new User('Jane', 25);

user1.greet(); // "Hello, I'm John"
```

**Better with Prototype:**
```javascript
function User(name, age) {
  this.name = name;
  this.age = age;
}

// Methods on prototype (shared across instances)
User.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const user = new User('John', 30);
```

**Pros:**
- Can create multiple instances
- Prototype sharing saves memory
- instanceof works

**Cons:**
- Must remember `new` keyword
- Less intuitive syntax
- No private properties (before # syntax)

---

#### Method 3: ES6 Classes

**Modern syntactic sugar over constructor functions.**

```typescript
class User {
  constructor(public name: string, private age: number) {
    // TypeScript public/private modifiers
  }
  
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  getAge() {
    return this.age;
  }
}

const user = new User('John', 30);
user.greet(); // "Hello, I'm John"
console.log(user.name); // "John"
// console.log(user.age); // Error: private property
```

**With Inheritance:**
```typescript
class Admin extends User {
  constructor(name: string, age: number, public role: string) {
    super(name, age);
  }
  
  greet() {
    super.greet();
    console.log(`I'm an ${this.role}`);
  }
}

const admin = new Admin('Alice', 28, 'administrator');
admin.greet();
// "Hello, I'm Alice"
// "I'm an administrator"
```

**Pros:**
- Clean, readable syntax
- Inheritance with `extends`
- Private fields with `#`
- Static methods/properties

**Cons:**
- Still uses prototypes under the hood
- Can be misleading if you expect class-based OOP

---

#### Method 4: Object.create()

**Creates object with specified prototype.**

```javascript
const personPrototype = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const user = Object.create(personPrototype);
user.name = 'John';
user.age = 30;

user.greet(); // "Hello, I'm John"
```

**With Prototype Chain:**
```javascript
const personPrototype = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const employeePrototype = Object.create(personPrototype);
employeePrototype.work = function() {
  console.log(`${this.name} is working`);
};

const employee = Object.create(employeePrototype);
employee.name = 'John';

employee.greet(); // "Hello, I'm John"
employee.work(); // "John is working"
```

**Pros:**
- Direct control over prototype chain
- No constructor needed
- True prototypal inheritance

**Cons:**
- Less common pattern
- Properties must be added after creation
- Can be confusing for beginners

---

#### Method 5: Factory Functions

**Functions that return objects.**

```javascript
function createUser(name, age) {
  // Private variables
  let password = 'secret';
  
  return {
    name,
    age,
    greet() {
      console.log(`Hello, I'm ${this.name}`);
    },
    authenticate(pwd) {
      return pwd === password;
    },
    changePassword(oldPwd, newPwd) {
      if (oldPwd === password) {
        password = newPwd;
        return true;
      }
      return false;
    }
  };
}

const user = createUser('John', 30);
user.greet(); // "Hello, I'm John"
console.log(user.authenticate('secret')); // true
console.log(user.password); // undefined (private!)
```

**Pros:**
- True privacy via closures
- No `new` keyword needed
- Can return different object types
- Flexible

**Cons:**
- Each instance gets new function copies (memory overhead)
- No instanceof checking
- No prototype sharing

---

#### Method 6: Singleton Pattern

**Ensure only one instance exists.**

```typescript
class Database {
  private static instance: Database;
  private constructor(private connectionString: string) {}
  
  static getInstance(connectionString: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(connectionString);
    }
    return Database.instance;
  }
  
  query(sql: string) {
    console.log(`Querying: ${sql}`);
  }
}

const db1 = Database.getInstance('mongodb://localhost');
const db2 = Database.getInstance('postgresql://localhost');

console.log(db1 === db2); // true (same instance)
```

**Using Object Literal (Simpler):**
```javascript
const database = {
  connectionString: 'mongodb://localhost',
  query(sql) {
    console.log(`Querying: ${sql}`);
  }
};

// Can't create another instance
export default database;
```

---

#### Method 7: Using Object.assign()

**Merge objects or clone.**

```javascript
const defaults = {
  theme: 'light',
  language: 'en'
};

const userSettings = {
  language: 'fr',
  notifications: true
};

const settings = Object.assign({}, defaults, userSettings);
// { theme: 'light', language: 'fr', notifications: true }
```

**Create with Mixins:**
```javascript
const canEat = {
  eat() {
    console.log('Eating...');
  }
};

const canWalk = {
  walk() {
    console.log('Walking...');
  }
};

const canSwim = {
  swim() {
    console.log('Swimming...');
  }
};

const person = Object.assign(
  {},
  canEat,
  canWalk
);

const duck = Object.assign(
  {},
  canEat,
  canWalk,
  canSwim
);

person.eat(); // "Eating..."
duck.swim(); // "Swimming..."
```

---

#### Method 8: Spread Operator (ES6+)

**Modern way to create objects.**

```typescript
const user = {
  name: 'John',
  age: 30
};

// Clone
const clone = { ...user };

// Merge
const employee = {
  ...user,
  role: 'developer',
  salary: 80000
};

// Override properties
const updatedUser = {
  ...user,
  age: 31
};
```

**Compose Objects:**
```typescript
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

const withName: Named = { name: 'John' };
const withAge: Aged = { age: 30 };

const person = { ...withName, ...withAge };
// { name: 'John', age: 30 }
```

---

#### Comparison Table

| Method | Use Case | Reusability | Privacy | Inheritance | Memory |
|--------|----------|-------------|---------|-------------|--------|
| Object Literal | Single objects | ❌ | ❌ | ❌ | Efficient |
| Constructor | Multiple instances | ✅ | ⚠️ (with #) | ✅ | Good (with prototype) |
| ES6 Class | OOP patterns | ✅ | ✅ (with #) | ✅ | Good |
| Object.create() | Prototype chain | ✅ | ❌ | ✅ | Efficient |
| Factory Function | Privacy needed | ✅ | ✅ | ❌ | Less efficient |
| Singleton | One instance | ✅ | ✅ | ✅ | Very efficient |
| Object.assign() | Merging/Cloning | ⚠️ | ❌ | ❌ | Depends |
| Spread Operator | Modern merging | ⚠️ | ❌ | ❌ | Depends |

---

#### Angular Context Examples

**Service (Singleton with Class):**
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>([]);
  
  getUsers() {
    return this.users.asReadonly();
  }
  
  addUser(user: User) {
    this.users.update(users => [...users, user]);
  }
}
```

**Factory Function for Configuration:**
```typescript
export function createApiConfig(environment: 'dev' | 'prod') {
  const baseUrls = {
    dev: 'http://localhost:3000',
    prod: 'https://api.production.com'
  };
  
  return {
    baseUrl: baseUrls[environment],
    timeout: environment === 'dev' ? 5000 : 30000,
    retries: environment === 'dev' ? 1 : 3
  };
}
```

**Object Literal for Constants:**
```typescript
export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;
```

**Class for Components:**
```typescript
@Component({
  selector: 'app-user',
  template: `<div>{{ user().name }}</div>`
})
export class UserComponent {
  user = input.required<User>();
  
  onClick() {
    console.log('Clicked:', this.user().name);
  }
}
```

---

#### Best Practices

**Use Object Literals for:**
- Configuration objects
- Single-use objects
- Simple data structures

**Use Classes for:**
- Components
- Services
- Models with methods
- When you need inheritance

**Use Factory Functions for:**
- Complex object creation
- When privacy is critical
- Conditional object creation
- Dependency injection setup

**Use Object.create() for:**
- Custom prototype chains
- When you need precise control
- Implementing prototypal inheritance

**Use Spread/Object.assign() for:**
- Cloning objects
- Merging configurations
- Creating variations of objects
- Immutable updates

---

#### Common Pitfalls

**1. Forgetting `new` keyword:**
```javascript
function User(name) {
  this.name = name;
}

const user = User('John'); // ❌ this = window/undefined
const user = new User('John'); // ✅ this = new instance
```

**2. Method duplication in factory:**
```javascript
// ❌ Bad - method created for each instance
function createUser(name) {
  return {
    name,
    greet() {
      console.log(`Hello, ${this.name}`);
    }
  };
}

// ✅ Better - shared method
const userPrototype = {
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

function createUser(name) {
  return Object.assign(Object.create(userPrototype), { name });
}
```

**3. Shallow cloning with spread:**
```javascript
const user = {
  name: 'John',
  address: { city: 'NYC' }
};

const clone = { ...user };
clone.address.city = 'LA';

console.log(user.address.city); // "LA" (mutated original!)

// ✅ Deep clone
const deepClone = structuredClone(user);
```

[Back to Top](#table-of-contents)

---

## TypeScript

### <a name="typescript-basics"></a>TypeScript Basics

**Key Features:**

**1. Static Typing**
```typescript
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
```

**2. Interfaces**
```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  readonly createdAt: Date; // Readonly
}
```

**3. Type Aliases**
```typescript
type ID = string | number;
type UserRole = 'admin' | 'user' | 'guest';
```

**4. Generics**
```typescript
function identity<T>(value: T): T {
  return value;
}

class DataStore<T> {
  private data: T[] = [];
  
  add(item: T) {
    this.data.push(item);
  }
}
```

**5. Union & Intersection Types**
```typescript
type Status = 'pending' | 'approved' | 'rejected';

interface Named {
  name: string;
}

interface Aged {
  age: number;
}

type Person = Named & Aged;
```

**6. Type Guards**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(input)) {
  console.log(input.toUpperCase());
}
```

**7. Utility Types**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>; // All optional
type ReadonlyUser = Readonly<User>; // All readonly
type UserWithoutEmail = Omit<User, 'email'>; // Exclude email
type UserEmail = Pick<User, 'email'>; // Pick only email
```

[Back to Top](#table-of-contents)

---

### <a name="interface-vs-abstract-class"></a>Interface vs Abstract Class

**Interface:**
- Contract for object structure
- Cannot contain implementation
- Supports multiple inheritance
- Compiled away (no runtime footprint)

```typescript
interface Drawable {
  draw(): void;
}

interface Resizable {
  resize(scale: number): void;
}

class Shape implements Drawable, Resizable {
  draw() {}
  resize(scale: number) {}
}
```

**Abstract Class:**
- Can contain implementation
- Can have constructors
- Single inheritance only
- Exists at runtime

```typescript
abstract class Animal {
  constructor(protected name: string) {}
  
  // Concrete method
  move() {
    console.log(`${this.name} is moving`);
  }
  
  // Abstract method
  abstract makeSound(): void;
}

class Dog extends Animal {
  makeSound() {
    console.log('Woof!');
  }
}
```

**When to Use:**
- **Interface**: Pure contracts, multiple inheritance needed
- **Abstract Class**: Shared implementation, constructor logic needed

[Back to Top](#table-of-contents)

---

## Angular

### <a name="angular-evolution"></a>Angular Evolution (14-20)

**Angular 14 (June 2022)**
- Standalone components (developer preview)
- Typed forms
- Streamlined page title accessibility
- `inject()` function

**Angular 15 (November 2022)**
- Standalone APIs stable
- Directive composition API
- Image directive (`NgOptimizedImage`)
- Router improvements

**Angular 16 (May 2023)**
- **Signals** (developer preview)
- Required inputs
- Router input binding
- Hydration support
- Improved SSR

**Angular 17 (November 2023)**
- **Signals stable**
- New control flow (`@if`, `@for`, `@switch`)
- Deferred views (`@defer`)
- New build system (esbuild + vite)
- Renaissance rebrand

**Angular 18 (May 2024)**
- Zoneless change detection (developer preview)
- Material 3 components
- Server-side rendering improvements
- Improved hydration

**Angular 19 (November 2024)**
- Incremental hydration
- Improved signals debugging
- Better SSR performance

**Key Trends:**
- Move toward standalone components
- Signals for reactive programming
- Performance optimizations
- Better DX (developer experience)

[Back to Top](#table-of-contents)

---

### <a name="standalone-module"></a>Standalone vs Module

**Standalone Components (Recommended):**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterModule],
  template: `<div>User Component</div>`
})
export class UserComponent {}
```

**Benefits:**
- Simpler mental model
- Better tree-shaking
- Easier testing
- No need for NgModules

**Module-Based (Legacy):**
```typescript
@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, RouterModule],
  exports: [UserComponent]
})
export class UserModule {}
```

**Migration:**
```bash
ng generate @angular/core:standalone
```

**Routing with Standalone:**
```typescript
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./user.component').then(m => m.UserComponent)
  }
];
```

[Back to Top](#table-of-contents)

---

### <a name="angular-material"></a>Angular Material

**UI component library** following Material Design.

**Installation:**
```bash
ng add @angular/material
```

**Usage:**
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-content>
        Content here
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary">Click</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class MyComponent {}
```

**Theming:**
```scss
@use '@angular/material' as mat;

$my-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,
  )
));

html {
  @include mat.all-component-themes($my-theme);
}
```

**Common Components:**
- Buttons: `mat-button`, `mat-raised-button`
- Forms: `mat-form-field`, `mat-input`
- Layout: `mat-toolbar`, `mat-sidenav`
- Data: `mat-table`, `mat-paginator`
- Dialogs: `MatDialog`

[Back to Top](#table-of-contents)

---

### <a name="service-in-modal"></a>Service in Modal Window

**Injecting services into Material Dialog:**

```typescript
// Dialog Component
@Component({
  selector: 'app-user-dialog',
  template: `
    <h2 mat-dialog-title>User Details</h2>
    <mat-dialog-content>
      {{ user().name }}
    </mat-dialog-content>
  `
})
export class UserDialogComponent {
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);
  
  user = signal<User | null>(null);
  
  ngOnInit() {
    this.userService.getUser(this.data.userId).subscribe(
      user => this.user.set(user)
    );
  }
  
  close() {
    this.dialogRef.close();
  }
}

// Opening Dialog
export class ParentComponent {
  private dialog = inject(MatDialog);
  
  openDialog() {
    this.dialog.open(UserDialogComponent, {
      data: { userId: 123 },
      width: '400px'
    });
  }
}
```

**Service Scoping:**
- Services are available in dialogs by default
- Can provide dialog-specific services using `providers` in dialog component

[Back to Top](#table-of-contents)

---

### <a name="service-accessibility"></a>Accessibility of Services in Parent Modules

**Service Visibility Rules:**

**1. Root-Level Services:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // Available everywhere
}
```

**2. Module-Level (Legacy):**
```typescript
@NgModule({
  providers: [ModuleService]
})
export class FeatureModule {}
// Service available to all components in module and its children
```

**3. Component-Level:**
```typescript
@Component({
  providers: [ComponentService]
})
export class MyComponent {
  // New instance for this component and its children
}
```

**Hierarchy:**
```
Root Injector (providedIn: 'root')
  ├── Platform Injector
  └── Module Injector (lazy loaded modules)
      └── Component Injector
          └── Child Component Injector
```

**Key Points:**
- Child components can access parent services
- Lazy-loaded modules get separate injector
- Services bubble up the injector tree

[Back to Top](#table-of-contents)

---

### <a name="async-pipe"></a>Async Pipe

**Subscribes to Observables/Promises and unwraps values.**

**Benefits:**
- Automatic subscription management
- Automatic unsubscription on destroy
- Cleaner templates
- Works with OnPush change detection

```typescript
@Component({
  template: `
    @if (user$ | async; as user) {
      <div>{{ user.name }}</div>
    }
    
    <ul>
      @for (item of items$ | async; track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
  `
})
export class UserComponent {
  user$ = this.http.get<User>('/api/user');
  items$ = this.http.get<Item[]>('/api/items');
  
  constructor(private http: HttpClient) {}
}
```

**With Signals (Modern Approach):**
```typescript
export class UserComponent {
  private http = inject(HttpClient);
  
  user = signal<User | null>(null);
  
  ngOnInit() {
    this.http.get<User>('/api/user').subscribe(
      user => this.user.set(user)
    );
  }
}

// Template
<div>{{ user()?.name }}</div>
```

[Back to Top](#table-of-contents)

---

### <a name="signals"></a>Signals Deep Dive

**Fine-grained reactive primitives** for Angular.

**Core Concepts:**

**1. Writable Signals:**
```typescript
const count = signal(0);
count.set(5);  // Set value
count.update(n => n + 1);  // Update based on current
console.log(count());  // Read value (5)
```

**2. Computed Signals:**
```typescript
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName());  // "John Doe"
firstName.set('Jane');
console.log(fullName());  // "Jane Doe" (automatically updated)
```

**3. Effects:**
```typescript
effect(() => {
  console.log(`Count is: ${count()}`);
  // Runs whenever count changes
});
```

**Component Example:**
```typescript
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(n => n + 1);
  }
  
  constructor() {
    effect(() => {
      console.log(`Count changed to: ${this.count()}`);
    });
  }
}

// Template
<div>Count: {{ count() }}</div>
<div>Double: {{ doubleCount() }}</div>
<button (click)="increment()">Increment</button>
```

**Signals vs RxJS:**

| Feature | Signals | RxJS |
|---------|---------|------|
| Synchronous | ✅ Yes | ❌ No |
| Complexity | Simple | Complex |
| Operators | Limited | 100+ |
| Async operations | Limited | Excellent |
| Change detection | Automatic | async pipe needed |
| Learning curve | Low | High |

**When to Use:**
- **Signals**: Local state, derived values, simple reactivity
- **RxJS**: HTTP, complex async flows, operator composition

**Combining Both:**
```typescript
export class UserComponent {
  private http = inject(HttpClient);
  
  userId = signal(1);
  user = signal<User | null>(null);
  
  constructor() {
    effect(() => {
      this.http.get<User>(`/api/users/${this.userId()}`).subscribe(
        user => this.user.set(user)
      );
    });
  }
}
```

---

#### <a name="signals-comparison"></a>Signals vs LinkedSignal vs Computed Signals

**Understanding the three types of reactive primitives in Angular.**

**1. Writable Signal:**

Basic mutable signal that can be read and written.

```typescript
const count = signal(0);

// Read
console.log(count()); // 0

// Write
count.set(10);
count.update(n => n + 1);
```

**Characteristics:**
- ✅ Can read and write
- ✅ Manually controlled
- ✅ No dependencies
- ✅ Full control over updates

**Use Case:** Managing independent state that changes based on user actions.

```typescript
export class FormComponent {
  // User-controlled state
  username = signal('');
  password = signal('');
  
  updateUsername(value: string) {
    this.username.set(value);
  }
}
```

---

**2. Computed Signal:**

Read-only signal that derives its value from other signals. Automatically updates when dependencies change.

```typescript
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "John Doe"
firstName.set('Jane');
console.log(fullName()); // "Jane Doe" (auto-updated)

// fullName.set('...'); // ❌ Error: read-only
```

**Characteristics:**
- ✅ Read-only
- ✅ Automatically recomputes when dependencies change
- ✅ Memoized (caches result)
- ✅ Lazy evaluation
- ❌ Cannot be manually updated

**Use Case:** Deriving values from other state.

```typescript
export class ShoppingCartComponent {
  items = signal<CartItem[]>([]);
  
  // Derived values
  totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  hasDiscount = computed(() => this.totalPrice() > 100);
  
  finalPrice = computed(() =>
    this.hasDiscount() ? this.totalPrice() * 0.9 : this.totalPrice()
  );
}
```

---

**3. LinkedSignal (Angular 19+):**

A signal that tracks another signal but can be independently updated. It combines characteristics of both writable and computed signals.

```typescript
const source = signal(10);

// LinkedSignal tracks source but can be overridden
const derived = linkedSignal(() => source() * 2);

console.log(derived()); // 20

// Source changes → derived updates
source.set(15);
console.log(derived()); // 30

// Can be manually updated (unlike computed)
derived.set(100);
console.log(derived()); // 100

// Source changes again → derived updates again
source.set(20);
console.log(derived()); // 40 (resyncs with source)
```

**Characteristics:**
- ✅ Tracks source signal(s)
- ✅ Can be manually updated
- ✅ Resyncs when source changes
- ✅ Writable and reactive

**Use Case:** Managing state that should follow a source but can be temporarily overridden.

```typescript
export class ThemeComponent {
  // System theme preference
  systemTheme = signal<'light' | 'dark'>('light');
  
  // User can override, but follows system by default
  userTheme = linkedSignal(() => this.systemTheme());
  
  // User manually sets theme
  setTheme(theme: 'light' | 'dark') {
    this.userTheme.set(theme);
  }
  
  // Reset to system theme
  resetToSystem() {
    // Next time systemTheme changes, userTheme will update
    this.systemTheme.set(this.detectSystemTheme());
  }
}
```

**Advanced LinkedSignal Example:**

```typescript
export class SearchComponent {
  searchQuery = signal('');
  
  // Debounced search that can be manually triggered
  debouncedQuery = linkedSignal({
    source: () => this.searchQuery(),
    computation: (source) => source,
  });
  
  // Auto-updates from searchQuery, but can trigger immediately
  forceSearch() {
    this.debouncedQuery.set(this.searchQuery());
  }
}

// Real-world form synchronization
export class FormSyncComponent {
  // Server data
  serverData = signal({ name: 'John', email: 'john@example.com' });
  
  // Form data that syncs with server but can be edited
  formData = linkedSignal(() => ({ ...this.serverData() }));
  
  // User edits form
  updateForm(field: string, value: string) {
    this.formData.update(data => ({ ...data, [field]: value }));
  }
  
  // Server sends new data → form resyncs
  refreshFromServer(newData: UserData) {
    this.serverData.set(newData);
    // formData automatically updates
  }
  
  // Check if form has unsaved changes
  hasChanges = computed(() => 
    JSON.stringify(this.formData()) !== JSON.stringify(this.serverData())
  );
}
```

---

#### Comparison Table

| Feature | Writable Signal | Computed Signal | LinkedSignal |
|---------|----------------|-----------------|--------------|
| **Read** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Write** | ✅ Yes | ❌ No | ✅ Yes |
| **Auto-update** | ❌ No | ✅ Yes | ✅ Yes |
| **Dependencies** | None | Tracks signals | Tracks source |
| **Override** | N/A | ❌ Cannot | ✅ Can override |
| **Resync** | N/A | Always synced | Resyncs on source change |
| **Memoization** | No | ✅ Yes | ✅ Yes |
| **Use Case** | Independent state | Derived values | Trackable + writable |
| **Angular Version** | 16+ | 16+ | 19+ |

---

#### When to Use Each

**Use Writable Signal When:**
- Managing independent component state
- Handling user input
- No relationship with other signals
- Need full manual control

```typescript
// ✅ Good use case
isLoading = signal(false);
selectedTab = signal(0);
formValue = signal({ name: '', email: '' });
```

---

**Use Computed Signal When:**
- Value derives from other signals
- Need automatic updates
- Value is read-only
- Want memoization benefits

```typescript
// ✅ Good use case
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
isValid = computed(() => this.errors().length === 0);
filteredItems = computed(() => 
  this.items().filter(item => item.name.includes(this.searchTerm()))
);
```

---

**Use LinkedSignal When:**
- Need to track a source but allow manual override
- Implementing "reset to default" behavior
- Synchronizing with external state
- Form fields that follow server data but can be edited
- Temporary user overrides of computed values

```typescript
// ✅ Good use case
// Volume that follows system but can be manually adjusted
systemVolume = signal(50);
userVolume = linkedSignal(() => this.systemVolume());

// Sort order that has default but can be customized
defaultSort = signal<SortOrder>('date');
currentSort = linkedSignal(() => this.defaultSort());

// Theme that follows system preference but allows override
systemTheme = signal<Theme>('light');
activeTheme = linkedSignal(() => this.systemTheme());
```

---

#### Common Patterns

**Pattern 1: Computed with Manual Override (LinkedSignal)**

```typescript
export class VideoPlayerComponent {
  // Auto-calculated from video metadata
  suggestedQuality = signal<Quality>('720p');
  
  // User can override, but resets on new video
  playbackQuality = linkedSignal(() => this.suggestedQuality());
  
  setQuality(quality: Quality) {
    this.playbackQuality.set(quality);
  }
}
```

**Pattern 2: Cascading Computed**

```typescript
export class DataTableComponent {
  rawData = signal<Item[]>([]);
  searchTerm = signal('');
  sortColumn = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Chain of computed signals
  filteredData = computed(() =>
    this.rawData().filter(item => 
      item.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
  
  sortedData = computed(() => {
    const data = [...this.filteredData()];
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    return data.sort((a, b) => {
      const compare = a[column] > b[column] ? 1 : -1;
      return direction === 'asc' ? compare : -compare;
    });
  });
  
  paginatedData = computed(() => {
    const page = this.currentPage();
    const pageSize = this.pageSize();
    const start = page * pageSize;
    return this.sortedData().slice(start, start + pageSize);
  });
}
```

**Pattern 3: Writable State Management**

```typescript
export class TodoComponent {
  // Independent writable signals
  todos = signal<Todo[]>([]);
  filter = signal<Filter>('all');
  
  // Computed signals derived from writable ones
  activeTodos = computed(() => 
    this.todos().filter(t => !t.completed)
  );
  
  completedTodos = computed(() =>
    this.todos().filter(t => t.completed)
  );
  
  filteredTodos = computed(() => {
    const filter = this.filter();
    const todos = this.todos();
    
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });
  
  // Actions that update writable signals
  addTodo(text: string) {
    this.todos.update(todos => [...todos, { id: Date.now(), text, completed: false }]);
  }
  
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
}
```

---

#### Performance Considerations

**Computed Signals:**
- ✅ Only recompute when dependencies change
- ✅ Memoized (cached) results
- ✅ Lazy evaluation (only when accessed)
- ⚠️ Avoid heavy computations without memoization helpers

**LinkedSignal:**
- ✅ Tracks source efficiently
- ✅ Only updates when source changes or manually set
- ⚠️ Slight overhead compared to writable signals

**Writable Signals:**
- ✅ Minimal overhead
- ✅ Direct updates
- ⚠️ No automatic dependency tracking

---

#### Migration Guide

**From RxJS BehaviorSubject to Signal:**

```typescript
// ❌ Old (RxJS)
private countSubject = new BehaviorSubject(0);
count$ = this.countSubject.asObservable();

increment() {
  this.countSubject.next(this.countSubject.value + 1);
}

// ✅ New (Signal)
count = signal(0);

increment() {
  this.count.update(n => n + 1);
}
```

**From RxJS combineLatest to Computed:**

```typescript
// ❌ Old (RxJS)
fullName$ = combineLatest([
  this.firstName$,
  this.lastName$
]).pipe(
  map(([first, last]) => `${first} ${last}`)
);

// ✅ New (Computed Signal)
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

[Back to Top](#table-of-contents)

---

### <a name="injector-modificators"></a>Modificators of Injectors

**Control dependency resolution.**

**1. `@Optional()`**: Service can be null
```typescript
constructor(@Optional() private logger?: LoggerService) {
  this.logger?.log('Initialized');
}
```

**2. `@Self()`**: Only look in current injector
```typescript
constructor(@Self() private service: MyService) {}
```

**3. `@SkipSelf()`**: Skip current injector, look in parent
```typescript
constructor(@SkipSelf() private service: MyService) {}
```

**4. `@Host()`**: Look up to host component
```typescript
constructor(@Host() private parent: ParentComponent) {}
```

**Modern Approach with `inject()`:**
```typescript
export class MyComponent {
  private logger = inject(LoggerService, { optional: true });
  private service = inject(MyService, { self: true });
  private parent = inject(ParentService, { skipSelf: true });
  private host = inject(HostService, { host: true });
}
```

[Back to Top](#table-of-contents)

---

### <a name="directive-vs-component"></a>Directive vs Component

**Directive**: Adds behavior to existing elements

**Types of Directives:**
1. **Attribute Directives**: Change appearance/behavior
2. **Structural Directives**: Change DOM structure
3. **Components**: Directive with template

**Attribute Directive:**
```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
  private el = inject(ElementRef);
  
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
  
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}

// Usage: <p appHighlight>Hover me</p>
```

**Component:**
```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}

// Usage: <app-card>Content</app-card>
```

**Key Differences:**
- Component has template, directive doesn't
- Component creates new view, directive modifies existing
- One component per element, multiple directives possible

[Back to Top](#table-of-contents)

---

### <a name="component-instance-directive"></a>Get Component Instance with Directive

**Yes, using `ViewChild` or `ContentChild`:**

```typescript
// Component
@Component({
  selector: 'app-user',
  template: `<div>{{ name }}</div>`
})
export class UserComponent {
  name = 'John';
  
  greet() {
    console.log(`Hello, ${this.name}`);
  }
}

// Parent Component
@Component({
  template: `
    <app-user #userComp></app-user>
    <button (click)="callGreet()">Greet</button>
  `
})
export class ParentComponent {
  @ViewChild('userComp') userComponent!: UserComponent;
  
  callGreet() {
    this.userComponent.greet();
  }
}
```

**With Directive:**
```typescript
@Directive({
  selector: '[appMonitor]'
})
export class MonitorDirective {
  private component = inject(UserComponent, { optional: true });
  
  ngOnInit() {
    console.log('Monitoring component:', this.component);
  }
}

// Usage
<app-user appMonitor></app-user>
```

[Back to Top](#table-of-contents)

---

### <a name="component-interaction"></a>Component Interaction Types

**1. Input/Output (Parent ↔ Child):**
```typescript
// Child
export class ChildComponent {
  name = input.required<string>();
  notify = output<string>();
  
  sendMessage() {
    this.notify.emit('Hello from child');
  }
}

// Parent
<app-child [name]="parentName" (notify)="handleMessage($event)" />
```

**2. ViewChild (Parent → Child):**
```typescript
export class ParentComponent {
  @ViewChild(ChildComponent) child!: ChildComponent;
  
  ngAfterViewInit() {
    this.child.someMethod();
  }
}
```

**3. Service (Any ↔ Any):**
```typescript
@Injectable({ providedIn: 'root' })
export class SharedService {
  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();
  
  sendMessage(message: string) {
    this.messageSource.next(message);
  }
}

// Component A
this.sharedService.sendMessage('Hello');

// Component B
this.sharedService.message$.subscribe(msg => console.log(msg));
```

**4. Content Projection:**
```typescript
// Container
@Component({
  selector: 'app-container',
  template: `
    <div class="header"><ng-content select="[header]"></ng-content></div>
    <div class="body"><ng-content></ng-content></div>
  `
})
export class ContainerComponent {}

// Usage
<app-container>
  <h1 header>Title</h1>
  <p>Content</p>
</app-container>
```

**5. Router (Navigation):**
```typescript
this.router.navigate(['/users', userId], {
  queryParams: { tab: 'profile' },
  state: { data: userData }
});
```

**6. Signals (Shared State):**
```typescript
// Shared signal
export const globalCount = signal(0);

// Component A
globalCount.update(n => n + 1);

// Component B
count = globalCount; // Read the same signal
```

[Back to Top](#table-of-contents)

---

## CSS

### <a name="css-last-years"></a>CSS Features (Last 5 Years)

**Overview:**

Modern CSS has evolved significantly in recent years, introducing powerful features that eliminate the need for many JavaScript workarounds and preprocessor techniques. This section covers the most impactful CSS features from 2019-2024 that every frontend developer should know.

**Key improvements include:**
- **Layout & Responsiveness**: Container queries, subgrid, aspect-ratio
- **Selectors & Logic**: `:has()` (parent selector), `:is()`, `:where()`
- **Design System Tools**: Cascade layers, custom properties with `@property`
- **Colors & Theming**: `color-mix()` for dynamic color manipulation
- **Responsive Typography**: `clamp()` for fluid sizing
- **Internationalization**: Logical properties (inline/block instead of left/right)
- **User Experience**: Scroll snap, accent-color for native form styling

These features improve code maintainability, reduce bundle sizes, and enhance performance by leveraging native browser capabilities.

---

**Container Queries (2023)**
```css
@container (min-width: 400px) {
  .card { 
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

**`:has()` Selector (2023)**
```css
/* Parent selector */
.card:has(img) {
  display: grid;
}

/* Form validation */
form:has(input:invalid) {
  border: 2px solid red;
}
```

**Subgrid (2023)**
```css
.parent {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.child {
  display: grid;
  grid-template-columns: subgrid;
}
```

**Cascade Layers (2022)**
```css
@layer reset, base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .btn { padding: 1rem; }
}
```

**`color-mix()` (2023)**
```css
.element {
  background: color-mix(in srgb, blue 50%, red);
}
```

**Logical Properties (2020-2021)**
```css
.element {
  margin-inline-start: 1rem;  /* instead of margin-left */
  padding-block: 2rem;        /* instead of padding-top/bottom */
  border-inline-end: 1px solid; /* instead of border-right */
}
```

**`aspect-ratio` (2021)**
```css
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

**`gap` for Flexbox (2021)**
```css
.flex-container {
  display: flex;
  gap: 1rem;
}
```

**`:is()` and `:where()` (2021)**
```css
/* Instead of: h1, h2, h3 { ... } */
:is(h1, h2, h3) {
  margin-block: 1rem;
}

/* Zero specificity */
:where(.btn, .link) {
  padding: 0.5rem;
}
```

**`clamp()` (2020)**
```css
.text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  /* min, preferred, max */
}
```

**CSS Grid Level 3 Features:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

**`@property` (Custom Properties) (2021)**
```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.element {
  --angle: 45deg;
  transform: rotate(var(--angle));
  transition: --angle 0.3s;
}
```

**Scroll Snap (2019-2020)**
```css
.container {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
}

.item {
  scroll-snap-align: center;
}
```

**`accent-color` (2021)**
```css
input[type="checkbox"] {
  accent-color: blue;
}
```

[Back to Top](#table-of-contents)

---

## Summary

This FAQ covers essential topics for JavaScript and Angular developers:

- **Web Fundamentals**: Loading, optimization, security
- **JavaScript Core**: Event loop, closures, this, OOP
- **TypeScript**: Types, interfaces, generics
- **Angular Modern**: Signals, standalone components, best practices
- **CSS Modern**: Container queries, :has(), cascade layers

For deeper dives into specific topics, refer to the linked sections above.

[Back to Top](#table-of-contents)
