# Node.js Learning Plan for Junior Developers

A comprehensive, structured guide to mastering Node.js fundamentals and building production-ready backend applications.

---

## Table of Contents

1. [Introduction to Node.js](#1-introduction-to-nodejs)
2. [JavaScript Foundations for Node.js](#2-javascript-foundations-for-nodejs)
3. [Node.js Core Concepts](#3-nodejs-core-concepts)
4. [Working with NPM](#4-working-with-npm)
5. [File System Operations](#5-file-system-operations)
6. [Asynchronous Programming](#6-asynchronous-programming)
7. [Building HTTP Servers](#7-building-http-servers)
8. [Express.js Framework](#8-expressjs-framework)
9. [RESTful API Development](#9-restful-api-development)
10. [Middleware Patterns](#10-middleware-patterns)
11. [Error Handling](#11-error-handling)
12. [Working with Databases](#12-working-with-databases)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Validation & Security](#14-validation--security)
15. [Testing in Node.js](#15-testing-in-nodejs)
16. [Environment Configuration](#16-environment-configuration)
17. [Logging & Debugging](#17-logging--debugging)
18. [File Uploads & Processing](#18-file-uploads--processing)
19. [Real-time Communication](#19-real-time-communication)
20. [Email & Notifications](#20-email--notifications)
21. [Task Scheduling & Background Jobs](#21-task-scheduling--background-jobs)
22. [API Documentation](#22-api-documentation)
23. [Performance Optimization](#23-performance-optimization)
24. [Deployment & DevOps](#24-deployment--devops)
25. [Best Practices & Design Patterns](#25-best-practices--design-patterns)

---

## 1. Introduction to Node.js

### Learning Objectives
- Understand what Node.js is and why it's used
- Learn about the V8 JavaScript engine
- Understand the event-driven, non-blocking I/O model
- Set up Node.js development environment

### Topics to Cover

#### What is Node.js?
- Runtime environment vs framework
- JavaScript on the server-side
- Use cases and when to use Node.js
- Node.js vs traditional server technologies

#### Installation & Setup
- Installing Node.js (LTS vs Current versions)
- Node Version Manager (NVM)
- Verifying installation
- IDE setup (VS Code recommended)
- Essential VS Code extensions

#### Your First Node.js Program
- Creating a simple script
- Running Node.js files
- Using `console.log()` and other console methods
- Node.js REPL (Read-Eval-Print Loop)

### Practice Exercises
1. Install Node.js and verify installation
2. Create and run a "Hello World" program
3. Explore the Node.js REPL
4. Write a script that performs basic calculations

### Detailed Answers & Explanations

#### What is Node.js? - Detailed Explanation

**Node.js as a Runtime Environment**

Node.js is a JavaScript runtime environment built on Chrome's V8 JavaScript engine. Unlike a framework (which provides a structure for building applications), Node.js is a runtime that allows JavaScript to execute outside of a browser.

```javascript
// This JavaScript code can now run on a server, not just in a browser
console.log('Hello from the server!');
```

**Key Characteristics:**

1. **Server-Side JavaScript**: Before Node.js, JavaScript was primarily a browser language. Node.js brought JavaScript to the server-side, enabling full-stack JavaScript development.

2. **Event-Driven Architecture**: Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

3. **Single-Threaded**: Node.js operates on a single thread but can handle many concurrent connections through its event loop.

**When to Use Node.js:**

✅ **Good Use Cases:**
- Real-time applications (chat, live updates)
- API servers and microservices
- Streaming applications
- Single-page applications (SPAs)
- IoT applications
- Command-line tools

❌ **Not Ideal For:**
- CPU-intensive operations (image/video processing, complex calculations)
- Applications requiring heavy server-side computation

**Node.js vs Traditional Server Technologies:**

| Feature | Node.js | Traditional (PHP/Ruby) |
|---------|---------|------------------------|
| Language | JavaScript | PHP/Ruby/Python |
| Architecture | Event-driven, non-blocking | Blocking, multi-threaded |
| Concurrency | Single thread + event loop | Multiple threads |
| Performance | Excellent for I/O operations | Better for CPU operations |
| Learning Curve | Moderate (async programming) | Generally easier |

#### Installation & Setup - Step by Step

**1. Installing Node.js**

There are two versions:
- **LTS (Long Term Support)**: Stable, recommended for most users
- **Current**: Latest features, may have bugs

**Installation Steps:**

**On macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version  # Should show v18.x.x or similar
npm --version   # Should show 9.x.x or similar
```

**On Windows:**
1. Download installer from nodejs.org
2. Run the installer
3. Follow installation wizard
4. Restart your terminal

**On Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**2. Node Version Manager (NVM)**

NVM allows you to install and switch between multiple Node.js versions.

**Installing NVM:**

```bash
# On macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm --version

# Install Node.js LTS
nvm install --lts

# Install specific version
nvm install 18.17.0

# Switch between versions
nvm use 18.17.0

# List installed versions
nvm ls

# Set default version
nvm alias default 18.17.0
```

**3. VS Code Setup**

**Essential Extensions:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Node.js Extension Pack** - Collection of Node.js tools
- **REST Client** - Test APIs without Postman
- **JavaScript (ES6) code snippets** - Quick code generation
- **Path Intellisense** - Autocomplete file paths
- **npm Intellisense** - Autocomplete npm modules

**VS Code Settings for Node.js:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

#### Your First Node.js Program

**1. Hello World Program**

Create a file called `app.js`:

```javascript
// app.js
console.log('Hello, Node.js!');
console.log('Welcome to server-side JavaScript');
```

Run it:

```bash
node app.js
```

**Output:**
```
Hello, Node.js!
Welcome to server-side JavaScript
```

**2. Console Methods**

```javascript
// Different console methods
console.log('Standard log message');
console.info('Informational message');
console.warn('Warning message');
console.error('Error message');

// Formatting
console.log('My name is %s and I am %d years old', 'John', 30);

// Object logging
const user = { name: 'Alice', age: 25 };
console.log('User:', user);
console.table(user); // Display as table

// Timing
console.time('process');
// Some operation
console.timeEnd('process'); // Shows elapsed time

// Grouping
console.group('User Details');
console.log('Name: John');
console.log('Age: 30');
console.groupEnd();
```

**3. Node.js REPL (Read-Eval-Print Loop)**

The REPL is an interactive shell for testing JavaScript code.

```bash
# Start REPL
node

# You'll see:
> 

# Try commands:
> 2 + 2
4
> const greeting = 'Hello'
undefined
> greeting
'Hello'
> console.log(greeting)
Hello
undefined

# Multi-line code
> function add(a, b) {
... return a + b;
... }
undefined
> add(5, 3)
8

# Special REPL commands
.help    # Show all commands
.clear   # Clear context
.save filename  # Save session to file
.load filename  # Load JavaScript file
.exit    # Exit REPL (or Ctrl+D twice)
```

**4. Command-Line Arguments**

```javascript
// args.js
console.log('Process arguments:', process.argv);

// Get arguments
const args = process.argv.slice(2); // Skip first 2 elements
console.log('Your arguments:', args);

// Example: node args.js name=John age=30
```

**5. Simple Calculator Example**

```javascript
// calculator.js
const operation = process.argv[2];
const num1 = parseFloat(process.argv[3]);
const num2 = parseFloat(process.argv[4]);

if (!operation || isNaN(num1) || isNaN(num2)) {
  console.log('Usage: node calculator.js <operation> <num1> <num2>');
  console.log('Operations: add, subtract, multiply, divide');
  process.exit(1);
}

let result;

switch (operation) {
  case 'add':
    result = num1 + num2;
    break;
  case 'subtract':
    result = num1 - num2;
    break;
  case 'multiply':
    result = num1 * num2;
    break;
  case 'divide':
    if (num2 === 0) {
      console.error('Error: Cannot divide by zero');
      process.exit(1);
    }
    result = num1 / num2;
    break;
  default:
    console.error('Invalid operation');
    process.exit(1);
}

console.log(`${num1} ${operation} ${num2} = ${result}`);
```

**Usage:**
```bash
node calculator.js add 10 5      # Output: 10 add 5 = 15
node calculator.js multiply 4 7  # Output: 4 multiply 7 = 28
```

#### Practice Exercise Solutions

**Exercise 1: Verify Installation**

```bash
# Check Node.js version
node --version
# Should show: v18.x.x or v20.x.x

# Check npm version
npm --version
# Should show: 9.x.x or 10.x.x

# Check installation path
which node    # On macOS/Linux
where node    # On Windows
```

**Exercise 2: Hello World**

```javascript
// hello.js
const name = 'World';
const message = `Hello, ${name}!`;

console.log(message);
console.log('Current time:', new Date().toLocaleString());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
```

**Exercise 3: REPL Exploration**

```javascript
// In REPL, try:
> const PI = 3.14159
> const radius = 5
> const area = PI * radius * radius
> console.log(`Circle area: ${area}`)

// Try built-in modules
> const os = require('os')
> os.platform()
> os.cpus().length
> os.totalmem()
```

**Exercise 4: Advanced Calculator**

```javascript
// advanced-calculator.js
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculate(num1, operator, num2) {
  const a = parseFloat(num1);
  const b = parseFloat(num2);
  
  if (isNaN(a) || isNaN(b)) {
    return 'Invalid numbers';
  }
  
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Cannot divide by zero';
    case '%': return a % b;
    case '**': return a ** b;
    default: return 'Invalid operator';
  }
}

function askQuestion() {
  rl.question('Enter calculation (e.g., 5 + 3) or "exit": ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }
    
    const parts = answer.split(' ');
    if (parts.length !== 3) {
      console.log('Format: number operator number');
      askQuestion();
      return;
    }
    
    const [num1, operator, num2] = parts;
    const result = calculate(num1, operator, num2);
    console.log(`Result: ${result}\n`);
    
    askQuestion();
  });
}

console.log('=== Advanced Calculator ===');
console.log('Supported operators: +, -, *, /, %, **');
askQuestion();
```

**Key Takeaways:**
- Node.js brings JavaScript to the server-side
- It's event-driven and non-blocking, making it efficient for I/O operations
- The REPL is great for testing code quickly
- `process.argv` provides command-line arguments
- Always validate user input in real applications

---

## 2. JavaScript Foundations for Node.js

### Learning Objectives
- Master ES6+ features essential for Node.js
- Understand JavaScript's async nature
- Learn modern JavaScript syntax

### Topics to Cover

#### ES6+ Features
- `let`, `const` vs `var`
- Arrow functions
- Template literals
- Destructuring (objects and arrays)
- Spread and rest operators
- Default parameters
- Enhanced object literals

#### Advanced JavaScript Concepts
- Closures and scope
- Higher-order functions
- Array methods (`map`, `filter`, `reduce`, `forEach`)
- Promises basics
- `this` keyword behavior
- Modules (import/export)

#### Modern JavaScript
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- `async`/`await` syntax
- Class syntax
- Modules (CommonJS vs ES Modules)

### Practice Exercises
1. Rewrite traditional functions using arrow functions
2. Practice destructuring complex objects
3. Use array methods to transform data
4. Create utility functions using closures

### Detailed Answers & Explanations

#### ES6+ Features - Comprehensive Guide

**1. `let`, `const` vs `var`**

```javascript
// var - function scoped, hoisted, can be redeclared
var x = 1;
var x = 2; // No error
console.log(x); // 2

// let - block scoped, not hoisted, cannot be redeclared
let y = 1;
// let y = 2; // Error: y has already been declared
y = 3; // OK - reassignment is allowed
console.log(y); // 3

// const - block scoped, not hoisted, cannot be reassigned
const z = 1;
// z = 2; // Error: Assignment to constant variable
// const z = 3; // Error: z has already been declared

// const with objects (properties can be modified)
const user = { name: 'John' };
user.name = 'Jane'; // OK
user.age = 30; // OK
// user = {}; // Error: Assignment to constant variable
```

**Block Scoping Example:**

```javascript
// var is function-scoped
function varExample() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 - accessible outside block
}

// let is block-scoped
function letExample() {
  if (true) {
    let y = 10;
  }
  // console.log(y); // Error: y is not defined
}

// Practical use case
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is shared)

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2 (let creates new binding each iteration)
```

**2. Arrow Functions**

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With single parameter (parentheses optional)
const square = x => x * x;

// With no parameters
const greet = () => console.log('Hello!');

// With block body (explicit return needed)
const calculate = (a, b) => {
  const result = a + b;
  return result * 2;
};

// Returning objects (must wrap in parentheses)
const createUser = (name, age) => ({ name, age });

console.log(createUser('John', 30)); // { name: 'John', age: 30 }
```

**Arrow Functions and `this`:**

```javascript
// Traditional functions have their own 'this'
const obj1 = {
  name: 'Object 1',
  greet: function() {
    console.log('Hello from', this.name);
  }
};
obj1.greet(); // Hello from Object 1

// Arrow functions inherit 'this' from parent scope
const obj2 = {
  name: 'Object 2',
  greet: () => {
    console.log('Hello from', this.name); // 'this' refers to global scope
  }
};

// Practical example: callbacks
class Timer {
  constructor() {
    this.seconds = 0;
  }
  
  // Wrong: traditional function
  startWrong() {
    setInterval(function() {
      this.seconds++; // 'this' is undefined or global object
      console.log(this.seconds);
    }, 1000);
  }
  
  // Correct: arrow function
  startCorrect() {
    setInterval(() => {
      this.seconds++; // 'this' refers to Timer instance
      console.log(this.seconds);
    }, 1000);
  }
}
```

**3. Template Literals**

```javascript
// Traditional string concatenation
const name = 'John';
const age = 30;
const message1 = 'My name is ' + name + ' and I am ' + age + ' years old.';

// Template literal
const message2 = `My name is ${name} and I am ${age} years old.`;

// Expression evaluation
const price = 19.99;
const quantity = 3;
console.log(`Total: $${(price * quantity).toFixed(2)}`); // Total: $59.97

// Multi-line strings
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Tagged templates (advanced)
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ''}</strong>`;
  }, '');
}

const product = 'laptop';
const priceTag = 999;
console.log(highlight`Product: ${product}, Price: $${priceTag}`);
// Product: <strong>laptop</strong>, Price: $<strong>999</strong>
```

**4. Destructuring**

**Object Destructuring:**

```javascript
// Basic object destructuring
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// Extract properties
const { name, age } = user;
console.log(name, age); // John 30

// Rename variables
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // John 30

// Default values
const { name, phone = 'N/A' } = user;
console.log(phone); // N/A

// Nested destructuring
const { address: { city, country } } = user;
console.log(city, country); // New York USA

// Function parameters
function printUser({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
printUser(user); // John is 30 years old

// Rest operator
const { name, ...rest } = user;
console.log(rest); // { age: 30, email: 'john@example.com', address: {...} }
```

**Array Destructuring:**

```javascript
// Basic array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second] = numbers;
console.log(first, second); // 1 2

// Skip elements
const [, , third] = numbers;
console.log(third); // 3

// Default values
const [a, b, c, d, e, f = 0] = numbers;
console.log(f); // 0

// Rest operator
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Swapping variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1

// Function return values
function getCoordinates() {
  return [10, 20];
}
const [x, y] = getCoordinates();
```

**5. Spread and Rest Operators**

```javascript
// Spread operator with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] - unchanged

// Spread operator with objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// Override properties
const defaults = { theme: 'light', language: 'en' };
const userSettings = { language: 'es' };
const settings = { ...defaults, ...userSettings };
console.log(settings); // { theme: 'light', language: 'es' }

// Rest operator in functions
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Combine with regular parameters
function multiply(multiplier, ...numbers) {
  return numbers.map(num => num * multiplier);
}
console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]
```

**6. Default Parameters**

```javascript
// Without default parameters
function greetOld(name, greeting) {
  greeting = greeting || 'Hello';
  console.log(`${greeting}, ${name}!`);
}

// With default parameters
function greet(name, greeting = 'Hello') {
  console.log(`${greeting}, ${name}!`);
}

greet('John'); // Hello, John!
greet('John', 'Hi'); // Hi, John!

// Default parameters with expressions
function createArray(length = 0, value = 0) {
  return new Array(length).fill(value);
}

// Default parameters can reference earlier parameters
function calculatePrice(price, tax = price * 0.1) {
  return price + tax;
}
console.log(calculatePrice(100)); // 110
console.log(calculatePrice(100, 5)); // 105
```

**7. Enhanced Object Literals**

```javascript
const name = 'John';
const age = 30;

// Property shorthand
const user = {
  name,  // same as name: name
  age    // same as age: age
};

// Method shorthand
const calculator = {
  // Old way
  add: function(a, b) {
    return a + b;
  },
  // New way
  subtract(a, b) {
    return a - b;
  }
};

// Computed property names
const propName = 'email';
const user2 = {
  name: 'Jane',
  [propName]: 'jane@example.com',
  ['is' + 'Admin']: true
};
console.log(user2); // { name: 'Jane', email: 'jane@example.com', isAdmin: true }
```

#### Advanced JavaScript Concepts

**1. Closures and Scope**

```javascript
// Closure: Inner function has access to outer function's variables
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
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
// console.log(counter.count); // undefined - private variable

// Practical example: Creating private variables
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return `Deposited: $${amount}. New balance: $${balance}`;
      }
      return 'Invalid amount';
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return `Withdrew: $${amount}. New balance: $${balance}`;
      }
      return 'Insufficient funds or invalid amount';
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.deposit(500)); // Deposited: $500. New balance: $1500
console.log(account.withdraw(200)); // Withdrew: $200. New balance: $1300
console.log(account.getBalance()); // 1300
```

**2. Higher-Order Functions**

```javascript
// Function that takes a function as argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// Output: 0, 1, 2

// Function that returns a function
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// Practical example: Function composition
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const compose = (f, g) => x => f(g(x));

const add5ThenMultiply2 = compose(multiply2, add5);
console.log(add5ThenMultiply2(10)); // (10 + 5) * 2 = 30
```

**3. Array Methods**

```javascript
const numbers = [1, 2, 3, 4, 5];
const users = [
  { name: 'John', age: 30, active: true },
  { name: 'Jane', age: 25, active: false },
  { name: 'Bob', age: 35, active: true }
];

// map - transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const names = users.map(user => user.name);
console.log(names); // ['John', 'Jane', 'Bob']

// filter - select elements that meet condition
const even = numbers.filter(num => num % 2 === 0);
console.log(even); // [2, 4]

const activeUsers = users.filter(user => user.active);
console.log(activeUsers); // [{ name: 'John', ... }, { name: 'Bob', ... }]

// reduce - combine all elements into single value
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

const totalAge = users.reduce((total, user) => total + user.age, 0);
console.log(totalAge); // 90

// Chaining methods
const result = users
  .filter(user => user.active)
  .map(user => user.name)
  .join(', ');
console.log(result); // John, Bob

// forEach - execute function for each element
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});

// find - return first element that matches
const found = users.find(user => user.age > 30);
console.log(found); // { name: 'Bob', age: 35, active: true }

// some - check if at least one element matches
const hasActive = users.some(user => user.active);
console.log(hasActive); // true

// every - check if all elements match
const allActive = users.every(user => user.active);
console.log(allActive); // false

// sort - sort elements
const sortedByAge = [...users].sort((a, b) => a.age - b.age);
console.log(sortedByAge); // Sorted by age ascending
```

#### Modern JavaScript Features

**1. Optional Chaining (`?.`)**

```javascript
const user = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

// Without optional chaining
const city1 = user && user.address && user.address.city;

// With optional chaining
const city2 = user?.address?.city;
console.log(city2); // New York

// If property doesn't exist
const zipCode = user?.address?.zipCode;
console.log(zipCode); // undefined (no error)

// With arrays
const firstUser = users?.[0]?.name;

// With function calls
const result = obj.method?.();
```

**2. Nullish Coalescing (`??`)**

```javascript
// || returns right side if left is falsy (0, '', false, null, undefined)
const value1 = 0 || 'default';
console.log(value1); // 'default'

// ?? only returns right side if left is null or undefined
const value2 = 0 ?? 'default';
console.log(value2); // 0

const value3 = null ?? 'default';
console.log(value3); // 'default'

const value4 = undefined ?? 'default';
console.log(value4); // 'default'

// Practical use
function greet(name) {
  const displayName = name ?? 'Guest';
  console.log(`Hello, ${displayName}!`);
}

greet('John'); // Hello, John!
greet(null); // Hello, Guest!
greet(''); // Hello, ! (empty string is not null/undefined)
```

**3. Class Syntax**

```javascript
// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Method
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  // Getter
  get info() {
    return `${this.name} (${this.age})`;
  }
  
  // Setter
  set birthYear(year) {
    this.age = new Date().getFullYear() - year;
  }
  
  // Static method
  static create(name, age) {
    return new Person(name, age);
  }
}

const person = new Person('John', 30);
person.greet(); // Hello, I'm John
console.log(person.info); // John (30)

// Inheritance
class Employee extends Person {
  constructor(name, age, jobTitle) {
    super(name, age); // Call parent constructor
    this.jobTitle = jobTitle;
  }
  
  greet() {
    super.greet(); // Call parent method
    console.log(`I work as a ${this.jobTitle}`);
  }
}

const employee = new Employee('Jane', 25, 'Developer');
employee.greet();
// Hello, I'm Jane
// I work as a Developer
```

#### Practice Exercise Solutions

**Exercise 1: Arrow Functions**

```javascript
// Traditional functions converted to arrow functions

// Before
function multiply(a, b) {
  return a * b;
}

// After
const multiply = (a, b) => a * b;

// Before
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});

// After
const doubled = numbers.map(num => num * 2);
```

**Exercise 2: Destructuring Practice**

```javascript
const company = {
  name: 'Tech Corp',
  location: {
    country: 'USA',
    city: 'San Francisco'
  },
  employees: [
    { name: 'John', role: 'Developer' },
    { name: 'Jane', role: 'Designer' }
  ]
};

// Extract nested properties
const { 
  name: companyName, 
  location: { city },
  employees: [firstEmployee, secondEmployee]
} = company;

console.log(companyName); // Tech Corp
console.log(city); // San Francisco
console.log(firstEmployee); // { name: 'John', role: 'Developer' }
```

**Exercise 3: Array Methods**

```javascript
const products = [
  { name: 'Laptop', price: 999, category: 'Electronics' },
  { name: 'Phone', price: 699, category: 'Electronics' },
  { name: 'Desk', price: 299, category: 'Furniture' },
  { name: 'Chair', price: 199, category: 'Furniture' }
];

// Get all electronics
const electronics = products.filter(p => p.category === 'Electronics');

// Get product names
const productNames = products.map(p => p.name);

// Calculate total price
const total = products.reduce((sum, p) => sum + p.price, 0);

// Find expensive products (> 500)
const expensive = products.filter(p => p.price > 500);

console.log('Electronics:', electronics);
console.log('Product names:', productNames);
console.log('Total price:', total);
console.log('Expensive products:', expensive);
```

**Exercise 4: Closures**

```javascript
// Create a function factory for generating ID numbers
function createIdGenerator(prefix = 'ID') {
  let currentId = 0;
  
  return {
    next() {
      currentId++;
      return `${prefix}-${String(currentId).padStart(4, '0')}`;
    },
    reset() {
      currentId = 0;
    }
  };
}

const userIdGenerator = createIdGenerator('USER');
console.log(userIdGenerator.next()); // USER-0001
console.log(userIdGenerator.next()); // USER-0002
console.log(userIdGenerator.next()); // USER-0003

const orderIdGenerator = createIdGenerator('ORDER');
console.log(orderIdGenerator.next()); // ORDER-0001
console.log(orderIdGenerator.next()); // ORDER-0002
```

**Key Takeaways:**
- Modern JavaScript features make code more concise and readable
- Arrow functions are great for callbacks but have different `this` behavior
- Destructuring simplifies extracting values from objects and arrays
- Array methods (`map`, `filter`, `reduce`) are essential for data transformation
- Closures enable private variables and function factories
- Optional chaining and nullish coalescing improve null/undefined handling

---

## 3. Node.js Core Concepts

### Learning Objectives
- Understand the Node.js architecture
- Learn about the event loop
- Work with global objects
- Understand modules and require system

### Topics to Cover

#### Node.js Architecture
- Single-threaded event loop
- Non-blocking I/O operations
- Event-driven architecture
- Call stack, callback queue, event loop

#### Global Objects
- `__dirname` and `__filename`
- `process` object
- `console` object
- `Buffer` class
- `setTimeout`, `setInterval`, `setImmediate`

#### Module System
- CommonJS modules (`require`, `module.exports`)
- ES Modules (`import`, `export`)
- Creating custom modules
- Module caching
- Module wrapper function

#### Core Modules Overview
- `path` - file path operations
- `os` - operating system information
- `url` - URL parsing and formatting
- `querystring` - query string parsing
- `util` - utility functions

### Practice Exercises
1. Create a custom module and import it
2. Use `process.argv` to accept command-line arguments
3. Build a module that exports multiple functions
4. Explore the `process` object properties

### Detailed Answers & Explanations

#### Node.js Architecture - Deep Dive

**1. Single-Threaded Event Loop**

Node.js uses a single-threaded event loop model, which means it can handle many concurrent operations without creating new threads for each request.

```javascript
// Example: Non-blocking operations
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Output:
// Start
// End
// Timeout 1
// Timeout 2
```

**The Event Loop Phases:**

1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare**: Internal use only
4. **Poll**: Retrieve new I/O events; execute I/O related callbacks
5. **Check**: `setImmediate()` callbacks are invoked here
6. **Close Callbacks**: e.g., `socket.on('close', ...)`

```javascript
// Understanding event loop order
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));

console.log('Synchronous');

// Output:
// Synchronous
// nextTick
// Promise
// setTimeout
// setImmediate
```

**2. Non-Blocking I/O**

```javascript
const fs = require('fs');

// Blocking (synchronous) - bad for performance
console.log('Start reading file (sync)');
const data = fs.readFileSync('file.txt', 'utf8');
console.log('File content:', data);
console.log('End');

// Non-blocking (asynchronous) - recommended
console.log('Start reading file (async)');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});
console.log('End - other operations can continue');
```

#### Global Objects in Node.js

**1. `__dirname` and `__filename`**

```javascript
// __dirname: Directory name of the current module
console.log(__dirname); // /Users/username/project

// __filename: File name of the current module
console.log(__filename); // /Users/username/project/app.js

// Practical use: constructing paths
const path = require('path');
const configPath = path.join(__dirname, 'config', 'database.js');
console.log(configPath); // /Users/username/project/config/database.js
```

**2. `process` Object**

```javascript
// Process information
console.log('Node version:', process.version); // v18.17.0
console.log('Platform:', process.platform); // darwin, linux, win32
console.log('Architecture:', process.arch); // x64, arm64
console.log('Process ID:', process.pid); // 12345
console.log('Current directory:', process.cwd()); // /Users/username/project

// Environment variables
console.log('NODE_ENV:', process.env.NODE_ENV); // development, production
console.log('PATH:', process.env.PATH);

// Command-line arguments
// node app.js arg1 arg2 --flag
console.log('Arguments:', process.argv);
// ['node', '/path/to/app.js', 'arg1', 'arg2', '--flag']

// Memory usage
console.log('Memory usage:', process.memoryUsage());
// {
//   rss: 32104448,      // Resident Set Size
//   heapTotal: 4526080,  // Total heap size
//   heapUsed: 2715616,   // Used heap size
//   external: 1321456    // C++ objects
// }

// Exit process
// process.exit(0); // Success
// process.exit(1); // Failure

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown...');
  process.exit(0);
});
```

**3. `Buffer` Class**

```javascript
// Buffers handle binary data
const buf1 = Buffer.from('Hello'); // From string
const buf2 = Buffer.from([72, 101, 108, 108, 111]); // From array
const buf3 = Buffer.alloc(10); // Allocate 10 bytes (filled with 0)
const buf4 = Buffer.allocUnsafe(10); // Faster but may contain old data

console.log(buf1); // <Buffer 48 65 6c 6c 6f>
console.log(buf1.toString()); // Hello
console.log(buf1.length); // 5

// Writing to buffer
const buf = Buffer.alloc(10);
buf.write('Hello');
console.log(buf.toString()); // Hello

// Buffer operations
const buf5 = Buffer.concat([buf1, buf2]);
const sliced = buf1.slice(0, 2);
```

**4. Timers**

```javascript
// setTimeout - execute once after delay
const timeoutId = setTimeout(() => {
  console.log('Executed after 1 second');
}, 1000);

// Clear timeout
clearTimeout(timeoutId);

// setInterval - execute repeatedly
const intervalId = setInterval(() => {
  console.log('Executed every 2 seconds');
}, 2000);

// Clear interval
setTimeout(() => {
  clearInterval(intervalId);
}, 10000); // Stop after 10 seconds

// setImmediate - execute on next event loop iteration
setImmediate(() => {
  console.log('Executed immediately on next tick');
});

// process.nextTick - execute before next event loop phase
process.nextTick(() => {
  console.log('Executed on next tick (highest priority)');
});
```

#### Module System

**1. CommonJS Modules**

```javascript
// math.js - Creating a module
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

const PI = 3.14159;

// Export single item
module.exports = add;

// Export multiple items
module.exports = {
  add,
  subtract,
  PI
};

// Or use exports shorthand
exports.add = add;
exports.subtract = subtract;
exports.PI = PI;

// app.js - Using the module
const math = require('./math');
console.log(math.add(5, 3)); // 8
console.log(math.PI); // 3.14159

// Destructuring import
const { add, subtract } = require('./math');
console.log(add(10, 5)); // 15
```

**2. ES Modules (ESM)**

```javascript
// math.mjs or (package.json has "type": "module")
// math.js

// Named exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Default export
export default function multiply(a, b) {
  return a * b;
}

// app.js - Importing
import multiply, { add, subtract, PI } from './math.js';

console.log(add(5, 3)); // 8
console.log(multiply(5, 3)); // 15

// Import everything
import * as math from './math.js';
console.log(math.add(5, 3)); // 8
```

**3. Module Caching**

```javascript
// counter.js
let count = 0;

module.exports = {
  increment() {
    count++;
    return count;
  },
  getCount() {
    return count;
  }
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

console.log(counter1.increment()); // 1
console.log(counter2.increment()); // 2 (same instance!)
console.log(counter1.getCount()); // 2 (cached module)

// Clear cache (rarely needed)
delete require.cache[require.resolve('./counter')];
```

**4. Module Wrapper Function**

Every module is wrapped in a function:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // Your module code here
  console.log('Module arguments:', {
    exports,
    require,
    module,
    __filename,
    __dirname
  });
});
```

#### Core Modules

**1. Path Module**

```javascript
const path = require('path');

// Join paths
const filePath = path.join('users', 'john', 'documents', 'file.txt');
console.log(filePath); // users/john/documents/file.txt

// Resolve absolute path
const absolutePath = path.resolve('users', 'john', 'file.txt');
console.log(absolutePath); // /current/working/directory/users/john/file.txt

// Get file extension
console.log(path.extname('file.txt')); // .txt
console.log(path.extname('archive.tar.gz')); // .gz

// Get base name
console.log(path.basename('/users/john/file.txt')); // file.txt
console.log(path.basename('/users/john/file.txt', '.txt')); // file

// Get directory name
console.log(path.dirname('/users/john/file.txt')); // /users/john

// Parse path
const parsed = path.parse('/users/john/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/john',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Platform-specific separator
console.log('Path separator:', path.sep); // / on Unix, \ on Windows
```

**2. OS Module**

```javascript
const os = require('os');

// System information
console.log('Platform:', os.platform()); // darwin, linux, win32
console.log('Architecture:', os.arch()); // x64, arm64
console.log('CPUs:', os.cpus().length); // Number of CPU cores
console.log('Total memory:', os.totalmem() / 1024 / 1024 / 1024, 'GB');
console.log('Free memory:', os.freemem() / 1024 / 1024 / 1024, 'GB');
console.log('Uptime:', os.uptime() / 3600, 'hours');
console.log('Hostname:', os.hostname());
console.log('Home directory:', os.homedir());
console.log('Temp directory:', os.tmpdir());

// Network interfaces
console.log('Network interfaces:', os.networkInterfaces());

// OS constants
console.log('EOL:', JSON.stringify(os.EOL)); // \n on Unix, \r\n on Windows
```

**3. URL Module**

```javascript
const url = require('url');

// Parse URL
const myUrl = new URL('https://example.com:8080/path?name=John&age=30#section');

console.log('Protocol:', myUrl.protocol); // https:
console.log('Hostname:', myUrl.hostname); // example.com
console.log('Port:', myUrl.port); // 8080
console.log('Pathname:', myUrl.pathname); // /path
console.log('Search:', myUrl.search); // ?name=John&age=30
console.log('Hash:', myUrl.hash); // #section

// Get search params
console.log('Name:', myUrl.searchParams.get('name')); // John
console.log('Age:', myUrl.searchParams.get('age')); // 30

// Modify URL
myUrl.searchParams.append('city', 'NewYork');
myUrl.searchParams.set('age', '31');
console.log(myUrl.toString());
```

**4. Util Module**

```javascript
const util = require('util');
const fs = require('fs');

// Promisify callback-based functions
const readFile = util.promisify(fs.readFile);

async function readData() {
  try {
    const data = await readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Format strings
console.log(util.format('%s is %d years old', 'John', 30));
// John is 30 years old

// Inspect objects
const obj = { name: 'John', nested: { value: 42 } };
console.log(util.inspect(obj, { depth: null, colors: true }));

// Type checking
console.log(util.types.isDate(new Date())); // true
console.log(util.types.isPromise(Promise.resolve())); // true
```

#### Practice Exercise Solutions

**Exercise 1: Custom Module**

```javascript
// calculator.js
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  },
  power: (a, b) => Math.pow(a, b)
};

module.exports = operations;

// app.js
const calc = require('./calculator');

console.log('Add:', calc.add(10, 5)); // 15
console.log('Subtract:', calc.subtract(10, 5)); // 5
console.log('Multiply:', calc.multiply(10, 5)); // 50
console.log('Divide:', calc.divide(10, 5)); // 2
console.log('Power:', calc.power(2, 3)); // 8
```

**Exercise 2: Command-Line Arguments**

```javascript
// greet.js
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node greet.js <name> [greeting]');
  process.exit(1);
}

const name = args[0];
const greeting = args[1] || 'Hello';

console.log(`${greeting}, ${name}!`);

// Additional: Parse named arguments
const namedArgs = {};
args.forEach(arg => {
  if (arg.includes('=')) {
    const [key, value] = arg.split('=');
    namedArgs[key] = value;
  }
});

console.log('Named arguments:', namedArgs);

// Usage:
// node greet.js John
// node greet.js John Hi
// node greet.js name=John greeting=Hello
```

**Exercise 3: Multi-Export Module**

```javascript
// utils.js
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverseString(cleaned);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const VERSION = '1.0.0';

module.exports = {
  capitalize,
  reverseString,
  isPalindrome,
  randomNumber,
  VERSION
};

// app.js
const utils = require('./utils');

console.log(utils.capitalize('hello')); // Hello
console.log(utils.reverseString('hello')); // olleh
console.log(utils.isPalindrome('racecar')); // true
console.log(utils.randomNumber(1, 10)); // Random between 1-10
console.log('Version:', utils.VERSION); // 1.0.0
```

**Exercise 4: Process Object Exploration**

```javascript
// process-info.js
console.log('=== Process Information ===\n');

console.log('Node Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Process ID:', process.pid);
console.log('Current Directory:', process.cwd());
console.log('Executable Path:', process.execPath);

console.log('\n=== Memory Usage ===');
const memUsage = process.memoryUsage();
Object.keys(memUsage).forEach(key => {
  console.log(`${key}:`, (memUsage[key] / 1024 / 1024).toFixed(2), 'MB');
});

console.log('\n=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PATH:', process.env.PATH);

console.log('\n=== Command Line Arguments ===');
console.log('All arguments:', process.argv);
console.log('Script arguments:', process.argv.slice(2));

console.log('\n=== CPU Usage ===');
const startUsage = process.cpuUsage();
// Simulate some work
for (let i = 0; i < 1000000; i++) {}
const endUsage = process.cpuUsage(startUsage);
console.log('CPU time used:', endUsage);

console.log('\n=== Uptime ===');
console.log('Process uptime:', process.uptime(), 'seconds');
```

**Key Takeaways:**
- Node.js uses a single-threaded event loop for efficiency
- The event loop handles asynchronous operations without blocking
- Global objects like `process` and `Buffer` are available everywhere
- CommonJS (`require`/`module.exports`) is the traditional module system
- ES Modules (`import`/`export`) are the modern standard
- Core modules provide essential functionality without external dependencies
- Modules are cached after first load for performance

---

## 4. Working with NPM

### Learning Objectives
- Understand NPM and package management
- Learn to install and manage dependencies
- Create and publish packages
- Work with package.json

### Topics to Cover

#### NPM Basics
- What is NPM?
- `package.json` structure and purpose
- Semantic versioning (SemVer)
- `package-lock.json` importance

#### Installing Packages
- Local vs global installation
- `npm install` command options
- Development dependencies vs production dependencies
- `npm install --save-dev`
- Installing specific versions

#### NPM Scripts
- Creating custom scripts
- Pre and post hooks
- Running multiple scripts
- Cross-platform scripts

#### Popular Packages
- `nodemon` - auto-restart during development
- `dotenv` - environment variables
- `lodash` - utility functions
- `moment`/`date-fns` - date manipulation
- `axios` - HTTP client

#### Package Management
- Updating packages
- Removing packages
- Auditing for vulnerabilities
- Alternative package managers (Yarn, pnpm)

### Practice Exercises
1. Initialize a new project with `package.json`
2. Install and use popular packages
3. Create custom NPM scripts
4. Set up `nodemon` for development

### Detailed Answers & Explanations

#### NPM Basics - Complete Guide

**1. What is NPM?**

NPM (Node Package Manager) is the default package manager for Node.js. It's the world's largest software registry with over 1.5 million packages.

**Three main purposes:**
- Install and manage project dependencies
- Share your own packages
- Manage project scripts and configuration

**2. Initializing a Project**

```bash
# Interactive initialization
npm init

# Quick initialization with defaults
npm init -y

# This creates package.json:
```

**package.json Structure:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["nodejs", "example"],
  "author": "Your Name <your.email@example.com>",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**3. Semantic Versioning (SemVer)**

Version format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

**Version Symbols:**

```json
{
  "dependencies": {
    "express": "4.18.2",      // Exact version
    "lodash": "^4.17.21",     // Compatible (4.x.x, < 5.0.0)
    "axios": "~1.4.0",        // Approximately (1.4.x)
    "moment": "*",            // Latest (not recommended)
    "chalk": ">=4.0.0",       // Greater than or equal
    "dotenv": "4.x",          // Any 4.x.x version
    "joi": "latest"           // Latest version (not recommended)
  }
}
```

**4. package-lock.json**

- Locks exact versions of all dependencies and sub-dependencies
- Ensures consistent installs across different environments
- Should be committed to version control
- Automatically generated/updated when installing packages

#### Installing Packages

**1. Local vs Global Installation**

```bash
# Local installation (project-specific)
npm install express
npm i express  # shorthand

# Global installation (system-wide, available everywhere)
npm install -g nodemon
npm i -g typescript

# Check global packages
npm list -g --depth=0

# Find global installation path
npm root -g
```

**2. Production vs Development Dependencies**

```bash
# Production dependencies (required for app to run)
npm install express mongoose dotenv
npm i express mongoose dotenv

# Development dependencies (only needed for development)
npm install --save-dev nodemon eslint jest
npm i -D nodemon eslint jest  # shorthand

# Install all dependencies
npm install

# Install only production dependencies
npm install --production
npm i --omit=dev
```

**3. Installing Specific Versions**

```bash
# Install latest version
npm install lodash

# Install specific version
npm install lodash@4.17.21

# Install latest minor/patch within major version
npm install lodash@4

# Install from GitHub
npm install github:user/repo

# Install from local path
npm install ../my-local-package

# Install from tarball
npm install https://example.com/package.tgz
```

**4. Updating and Removing Packages**

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update lodash

# Update all packages
npm update

# Update to latest (even breaking changes)
npm install lodash@latest

# Remove package
npm uninstall express
npm un express  # shorthand
npm remove express
npm rm express

# Remove and update package.json
npm uninstall express --save
```

#### NPM Scripts

**1. Defining Scripts**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.js\"",
    "clean": "rm -rf dist"
  }
}
```

**2. Running Scripts**

```bash
# Special scripts (can omit 'run')
npm start
npm test
npm stop
npm restart

# Custom scripts (need 'run')
npm run dev
npm run build
npm run lint
```

**3. Pre and Post Hooks**

```json
{
  "scripts": {
    "prebuild": "npm run clean",
    "build": "webpack",
    "postbuild": "npm run test",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo 'Tests completed!'"
  }
}
```

Running `npm run build` executes:
1. `prebuild` (clean)
2. `build` (webpack)
3. `postbuild` (test)

**4. Passing Arguments**

```bash
# Pass arguments with --
npm run build -- --watch
npm test -- --verbose

# In package.json
{
  "scripts": {
    "serve": "http-server -p ${PORT:-8080}"
  }
}

# Run with custom port
PORT=3000 npm run serve
```

**5. Running Multiple Scripts**

```json
{
  "scripts": {
    "start": "npm run build && npm run serve",
    "dev": "npm run clean && npm run build:dev && npm run watch",
    
    "// Parallel execution (requires npm-run-all)": "",
    "dev:parallel": "npm-run-all --parallel watch:js watch:css"
  }
}
```

#### Popular Packages

**1. nodemon - Auto-restart Application**

```bash
npm install --save-dev nodemon
```

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "dev:debug": "nodemon --inspect server.js"
  }
}
```

**nodemon.json Configuration:**

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node server.js",
  "delay": 2000
}
```

**2. dotenv - Environment Variables**

```bash
npm install dotenv
```

```javascript
// Load environment variables at app start
require('dotenv').config();

// Access variables
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

**.env file:**

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=your-secret-key
NODE_ENV=development
```

**3. lodash - Utility Functions**

```bash
npm install lodash
```

```javascript
const _ = require('lodash');

// Array operations
const numbers = [1, 2, 3, 4, 5];
console.log(_.chunk(numbers, 2)); // [[1, 2], [3, 4], [5]]
console.log(_.shuffle(numbers)); // Random order

// Object operations
const user = { name: 'John', age: 30, email: 'john@example.com' };
console.log(_.pick(user, ['name', 'email']));
// { name: 'John', email: 'john@example.com' }

// Collection operations
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];
console.log(_.sortBy(users, 'age'));
console.log(_.groupBy(users, 'age'));

// Debounce/Throttle
const debouncedFunc = _.debounce(() => {
  console.log('Executed after delay');
}, 1000);
```

**4. axios - HTTP Client**

```bash
npm install axios
```

```javascript
const axios = require('axios');

// GET request
async function getUsers() {
  try {
    const response = await axios.get('https://api.example.com/users');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// POST request
async function createUser(userData) {
  try {
    const response = await axios.post('https://api.example.com/users', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Configure defaults
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
axios.defaults.timeout = 5000;
```

**5. date-fns - Date Manipulation**

```bash
npm install date-fns
```

```javascript
const { 
  format, 
  addDays, 
  subDays, 
  differenceInDays,
  isAfter,
  parseISO 
} = require('date-fns');

const now = new Date();

// Format dates
console.log(format(now, 'yyyy-MM-dd')); // 2024-01-15
console.log(format(now, 'MMMM do, yyyy')); // January 15th, 2024

// Date arithmetic
const nextWeek = addDays(now, 7);
const lastWeek = subDays(now, 7);

// Date comparison
const futureDate = new Date('2024-12-31');
console.log(isAfter(futureDate, now)); // true
console.log(differenceInDays(futureDate, now)); // days until
```

#### Package Management Best Practices

**1. Security Auditing**

```bash
# Check for vulnerabilities
npm audit

# Get detailed report
npm audit --json

# Fix vulnerabilities automatically
npm audit fix

# Fix including breaking changes
npm audit fix --force

# Install specific vulnerability fix
npm install lodash@latest
```

**2. Cleaning and Maintenance**

```bash
# Clear npm cache
npm cache clean --force

# Verify cache integrity
npm cache verify

# Remove node_modules
rm -rf node_modules

# Fresh install
rm -rf node_modules package-lock.json
npm install

# Prune unused packages
npm prune

# Deduplicate packages
npm dedupe
```

**3. Alternative Package Managers**

**Yarn:**

```bash
# Install Yarn
npm install -g yarn

# Initialize project
yarn init

# Install packages
yarn add express
yarn add --dev nodemon

# Install all dependencies
yarn install

# Remove package
yarn remove express

# Update packages
yarn upgrade
```

**pnpm (faster, more efficient):**

```bash
# Install pnpm
npm install -g pnpm

# Install packages
pnpm install express
pnpm add -D nodemon

# Saves disk space by using hard links
```

#### Practice Exercise Solutions

**Exercise 1: Initialize Project**

```bash
# Create project directory
mkdir my-node-project
cd my-node-project

# Initialize with default values
npm init -y

# Modify package.json
```

```json
{
  "name": "my-node-project",
  "version": "1.0.0",
  "description": "Learning Node.js and NPM",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Tests not yet implemented\" && exit 0"
  },
  "keywords": ["nodejs", "learning"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Exercise 2: Install and Use Packages**

```bash
# Install production dependencies
npm install express dotenv

# Install dev dependencies
npm install --save-dev nodemon

# Create index.js
```

```javascript
// index.js
require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from NPM packages!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

```bash
# Create .env file
echo "PORT=3000" > .env

# Run with nodemon
npm run dev
```

**Exercise 3: Custom NPM Scripts**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "dev:debug": "nodemon --inspect server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.js\"",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean && npm run lint",
    "build": "webpack --mode production",
    "postbuild": "echo 'Build complete!'",
    "deploy": "npm run build && npm run deploy:server",
    "deploy:server": "scp -r dist/ user@server:/path/"
  }
}
```

**Exercise 4: Complete nodemon Setup**

```bash
# Install nodemon
npm install --save-dev nodemon

# Create nodemon.json
```

```json
{
  "watch": ["src", "server.js"],
  "ext": "js,json,html",
  "ignore": ["src/**/*.test.js", "node_modules/**"],
  "exec": "node server.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": 2000,
  "verbose": true
}
```

```json
// package.json scripts
{
  "scripts": {
    "dev": "nodemon",
    "dev:inspect": "nodemon --inspect",
    "dev:legacy": "nodemon --legacy-watch"
  }
}
```

**Key Takeaways:**
- NPM is essential for managing Node.js dependencies
- `package.json` is the project's configuration file
- Semantic versioning ensures compatibility
- `package-lock.json` ensures consistent installs
- NPM scripts automate common tasks
- Always audit packages for security vulnerabilities
- Use dev dependencies for development-only packages

---

## 5. File System Operations

### Learning Objectives
- Read and write files synchronously and asynchronously
- Work with directories
- Handle file paths
- Understand streams

### Topics to Cover

#### File System Module (`fs`)
- Reading files (`readFile`, `readFileSync`)
- Writing files (`writeFile`, `writeFileSync`)
- Appending to files
- Deleting files (`unlink`)
- Checking file existence

#### Working with Directories
- Creating directories (`mkdir`)
- Reading directory contents (`readdir`)
- Removing directories (`rmdir`)
- Recursive operations

#### Path Module
- Joining paths (`path.join`)
- Resolving paths (`path.resolve`)
- Getting file extensions (`path.extname`)
- Parsing paths (`path.parse`)
- Platform-independent paths

#### Streams
- What are streams?
- Types of streams (Readable, Writable, Duplex, Transform)
- Reading from streams
- Writing to streams
- Piping streams
- Stream events

### Practice Exercises
1. Create a file reader/writer utility
2. Build a directory listing tool
3. Implement a file copy function
4. Use streams to process large files

### Detailed Answers & Explanations

#### File System Module (fs) - Complete Guide

**1. Reading Files**

```javascript
const fs = require('fs');

// Asynchronous (callback-based) - Recommended
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

// Synchronous - Blocks execution
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error reading file:', err);
}

// Promise-based (modern approach)
const fs = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

// Reading binary files
fs.readFile('image.png', (err, data) => {
  if (err) throw err;
  console.log('Buffer:', data); // <Buffer ...>
  console.log('Size:', data.length, 'bytes');
});
```

**2. Writing Files**

```javascript
const fs = require('fs');

// Write text file (overwrites existing)
fs.writeFile('output.txt', 'Hello, Node.js!', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});

// Write synchronously
try {
  fs.writeFileSync('output.txt', 'Hello, Node.js!', 'utf8');
  console.log('File written successfully');
} catch (err) {
  console.error('Error writing file:', err);
}

// Promise-based
const fs = require('fs').promises;

async function writeFileAsync() {
  try {
    await fs.writeFile('output.txt', 'Hello, Node.js!', 'utf8');
    console.log('File written successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

// Write JSON data
const data = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

fs.writeFile('user.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
  if (err) throw err;
  console.log('JSON file written');
});
```

**3. Appending to Files**

```javascript
const fs = require('fs');

// Append text to file (creates if doesn't exist)
fs.appendFile('log.txt', 'New log entry\n', (err) => {
  if (err) throw err;
  console.log('Data appended');
});

// Append synchronously
fs.appendFileSync('log.txt', 'New log entry\n');

// Logging example
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFile('app.log', logEntry, (err) => {
    if (err) console.error('Logging error:', err);
  });
}

log('Application started');
log('User logged in');
```

**4. Deleting Files**

```javascript
const fs = require('fs');

// Delete file
fs.unlink('file.txt', (err) => {
  if (err) {
    console.error('Error deleting file:', err);
    return;
  }
  console.log('File deleted successfully');
});

// Delete synchronously
try {
  fs.unlinkSync('file.txt');
  console.log('File deleted successfully');
} catch (err) {
  console.error('Error deleting file:', err);
}

// Promise-based
const fs = require('fs').promises;

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log('File deleted:', filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist');
    } else {
      console.error('Error deleting file:', err);
    }
  }
}
```

**5. Checking File Existence and Stats**

```javascript
const fs = require('fs');

// Check if file exists
fs.access('file.txt', fs.constants.F_OK, (err) => {
  if (err) {
    console.log('File does not exist');
  } else {
    console.log('File exists');
  }
});

// Check file permissions
fs.access('file.txt', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.log('File is not readable/writable');
  } else {
    console.log('File is readable and writable');
  }
});

// Get file statistics
fs.stat('file.txt', (err, stats) => {
  if (err) {
    console.error('Error getting stats:', err);
    return;
  }
  
  console.log('File size:', stats.size, 'bytes');
  console.log('Is file:', stats.isFile());
  console.log('Is directory:', stats.isDirectory());
  console.log('Created:', stats.birthtime);
  console.log('Modified:', stats.mtime);
  console.log('Mode:', stats.mode);
});

// Promise-based
const fs = require('fs').promises;

async function getFileInfo(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}
```

#### Working with Directories

**1. Creating Directories**

```javascript
const fs = require('fs');

// Create directory
fs.mkdir('new-folder', (err) => {
  if (err) {
    console.error('Error creating directory:', err);
    return;
  }
  console.log('Directory created');
});

// Create directory recursively (with subdirectories)
fs.mkdir('parent/child/grandchild', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Nested directories created');
});

// Synchronous
fs.mkdirSync('new-folder', { recursive: true });

// Promise-based
const fs = require('fs').promises;

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log('Directory created:', dirPath);
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}
```

**2. Reading Directory Contents**

```javascript
const fs = require('fs');
const path = require('path');

// Read directory contents
fs.readdir('./my-folder', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  console.log('Files:', files);
  // ['file1.txt', 'file2.txt', 'subfolder']
});

// Read with file types
fs.readdir('./my-folder', { withFileTypes: true }, (err, entries) => {
  if (err) throw err;
  
  entries.forEach(entry => {
    console.log(entry.name, entry.isFile() ? 'File' : 'Directory');
  });
});

// Promise-based with async/await
const fs = require('fs').promises;

async function listFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
}

// Recursive directory listing
async function listAllFiles(dirPath, arrayOfFiles = []) {
  const files = await fs.readdir(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      arrayOfFiles = await listAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }
  
  return arrayOfFiles;
}
```

**3. Removing Directories**

```javascript
const fs = require('fs');

// Remove empty directory
fs.rmdir('folder-name', (err) => {
  if (err) {
    console.error('Error removing directory:', err);
    return;
  }
  console.log('Directory removed');
});

// Remove directory and its contents (Node.js 14.14+)
fs.rm('folder-name', { recursive: true, force: true }, (err) => {
  if (err) {
    console.error('Error removing directory:', err);
    return;
  }
  console.log('Directory and contents removed');
});

// Promise-based
const fs = require('fs').promises;

async function removeDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log('Directory removed:', dirPath);
  } catch (err) {
    console.error('Error removing directory:', err);
  }
}
```

#### Path Module - Working with File Paths

```javascript
const path = require('path');

// Join path segments
const filePath = path.join('users', 'john', 'documents', 'file.txt');
console.log(filePath); // users/john/documents/file.txt (Unix)
                       // users\john\documents\file.txt (Windows)

// Resolve to absolute path
const absolutePath = path.resolve('users', 'john', 'file.txt');
console.log(absolutePath); // /current/working/directory/users/john/file.txt

// Get file extension
console.log(path.extname('file.txt')); // .txt
console.log(path.extname('archive.tar.gz')); // .gz

// Get base name (file name with extension)
console.log(path.basename('/users/john/file.txt')); // file.txt
console.log(path.basename('/users/john/file.txt', '.txt')); // file

// Get directory name
console.log(path.dirname('/users/john/file.txt')); // /users/john

// Parse path into object
const parsed = path.parse('/users/john/documents/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/john/documents',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Format path from object
const formatted = path.format({
  dir: '/users/john',
  base: 'file.txt'
});
console.log(formatted); // /users/john/file.txt

// Normalize path (resolves .. and .)
console.log(path.normalize('/users/john/../jane/./file.txt'));
// /users/jane/file.txt

// Check if path is absolute
console.log(path.isAbsolute('/users/john')); // true
console.log(path.isAbsolute('users/john')); // false

// Get relative path
const from = '/users/john/documents';
const to = '/users/jane/pictures';
console.log(path.relative(from, to)); // ../../jane/pictures
```

#### Streams - Efficient File Processing

**1. Why Use Streams?**

Streams are ideal for processing large files because they:
- Process data in chunks (don't load entire file into memory)
- Enable efficient memory usage
- Allow piping data between operations

**2. Reading with Streams**

```javascript
const fs = require('fs');

// Create read stream
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16384 // Chunk size (16KB)
});

// Handle stream events
readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
  // Process chunk
});

readStream.on('end', () => {
  console.log('Finished reading file');
});

readStream.on('error', (err) => {
  console.error('Error reading stream:', err);
});

// Pause and resume
readStream.on('data', (chunk) => {
  console.log('Chunk received');
  readStream.pause();
  
  // Process chunk asynchronously
  setTimeout(() => {
    console.log('Processing complete, resuming...');
    readStream.resume();
  }, 1000);
});
```

**3. Writing with Streams**

```javascript
const fs = require('fs');

// Create write stream
const writeStream = fs.createWriteStream('output.txt');

// Write data
writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.write('Third line\n');

// End stream
writeStream.end(() => {
  console.log('Finished writing');
});

// Handle events
writeStream.on('finish', () => {
  console.log('All data written');
});

writeStream.on('error', (err) => {
  console.error('Error writing stream:', err);
});

// Check if can write more
if (writeStream.writable) {
  writeStream.write('More data\n');
}
```

**4. Piping Streams**

```javascript
const fs = require('fs');

// Copy file using streams
const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully');
});

// Multiple pipes (chaining)
const zlib = require('zlib');

fs.createReadStream('file.txt')
  .pipe(zlib.createGzip()) // Compress
  .pipe(fs.createWriteStream('file.txt.gz'))
  .on('finish', () => {
    console.log('File compressed');
  });

// Decompress
fs.createReadStream('file.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('file-decompressed.txt'));
```

**5. Transform Streams**

```javascript
const { Transform } = require('stream');
const fs = require('fs');

// Create custom transform stream
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const upperCased = chunk.toString().toUpperCase();
    this.push(upperCased);
    callback();
  }
}

// Use transform stream
fs.createReadStream('input.txt')
  .pipe(new UpperCaseTransform())
  .pipe(fs.createWriteStream('output.txt'))
  .on('finish', () => {
    console.log('Transformation complete');
  });

// Line-by-line processing
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('large-file.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log('Line:', line);
});

rl.on('close', () => {
  console.log('Finished reading file');
});
```

#### Practice Exercise Solutions

**Exercise 1: File Reader/Writer Utility**

```javascript
// fileManager.js
const fs = require('fs').promises;
const path = require('path');

class FileManager {
  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
      return { success: true, message: 'File written successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async appendFile(filePath, content) {
    try {
      await fs.appendFile(filePath, content, 'utf8');
      return { success: true, message: 'Content appended' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return { success: true, message: 'File deleted' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        success: true,
        info: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory()
        }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

// Usage
const fileManager = new FileManager();

(async () => {
  await fileManager.writeFile('test.txt', 'Hello, World!');
  const result = await fileManager.readFile('test.txt');
  console.log(result.data); // Hello, World!
})();

module.exports = FileManager;
```

**Exercise 2: Directory Listing Tool**

```javascript
// directoryLister.js
const fs = require('fs').promises;
const path = require('path');

async function listDirectory(dirPath, options = {}) {
  const { recursive = false, includeHidden = false } = options;
  const results = [];
  
  async function scan(currentPath, level = 0) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip hidden files if option is false
        if (!includeHidden && entry.name.startsWith('.')) {
          continue;
        }
        
        const fullPath = path.join(currentPath, entry.name);
        const stats = await fs.stat(fullPath);
        
        const item = {
          name: entry.name,
          path: fullPath,
          type: entry.isFile() ? 'file' : 'directory',
          size: stats.size,
          modified: stats.mtime,
          level
        };
        
        results.push(item);
        
        // Recursively scan subdirectories
        if (recursive && entry.isDirectory()) {
          await scan(fullPath, level + 1);
        }
      }
    } catch (err) {
      console.error(`Error scanning ${currentPath}:`, err.message);
    }
  }
  
  await scan(dirPath);
  return results;
}

// Pretty print directory tree
function printTree(items) {
  items.forEach(item => {
    const indent = '  '.repeat(item.level);
    const icon = item.type === 'file' ? '📄' : '📁';
    const size = item.type === 'file' ? `(${(item.size / 1024).toFixed(2)} KB)` : '';
    console.log(`${indent}${icon} ${item.name} ${size}`);
  });
}

// Usage
(async () => {
  const items = await listDirectory('.', { recursive: true, includeHidden: false });
  printTree(items);
})();

module.exports = { listDirectory, printTree };
```

**Exercise 3: File Copy Function**

```javascript
// fileCopy.js
const fs = require('fs').promises;
const path = require('path');

async function copyFile(source, destination) {
  try {
    // Check if source exists
    await fs.access(source);
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destination);
    await fs.mkdir(destDir, { recursive: true });
    
    // Copy file
    await fs.copyFile(source, destination);
    
    console.log(`Copied: ${source} -> ${destination}`);
    return { success: true };
  } catch (err) {
    console.error('Copy error:', err.message);
    return { success: false, error: err.message };
  }
}

async function copyDirectory(source, destination) {
  try {
    // Create destination directory
    await fs.mkdir(destination, { recursive: true });
    
    // Read source directory
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively copy subdirectory
        await copyDirectory(sourcePath, destPath);
      } else {
        // Copy file
        await fs.copyFile(sourcePath, destPath);
        console.log(`Copied: ${sourcePath}`);
      }
    }
    
    return { success: true, message: 'Directory copied successfully' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Usage
(async () => {
  await copyFile('source.txt', 'backup/source.txt');
  await copyDirectory('my-folder', 'backup/my-folder');
})();

module.exports = { copyFile, copyDirectory };
```

**Exercise 4: Stream Processing for Large Files**

```javascript
// streamProcessor.js
const fs = require('fs');
const readline = require('readline');

// Count lines in large file
async function countLines(filePath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });
    
    rl.on('line', () => {
      lineCount++;
    });
    
    rl.on('close', () => {
      resolve(lineCount);
    });
    
    rl.on('error', reject);
  });
}

// Search for text in large file
async function searchInFile(filePath, searchText) {
  return new Promise((resolve, reject) => {
    const results = [];
    let lineNumber = 0;
    
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
      lineNumber++;
      if (line.includes(searchText)) {
        results.push({ lineNumber, content: line });
      }
    });
    
    rl.on('close', () => {
      resolve(results);
    });
    
    rl.on('error', reject);
  });
}

// Process CSV file in chunks
function processLargeCSV(filePath, processRow) {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  });
  
  let isFirstLine = true;
  let headers = [];
  
  rl.on('line', (line) => {
    if (isFirstLine) {
      headers = line.split(',');
      isFirstLine = false;
      return;
    }
    
    const values = line.split(',');
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    processRow(row);
  });
  
  rl.on('close', () => {
    console.log('Finished processing CSV');
  });
}

// Usage
(async () => {
  const lineCount = await countLines('large-file.txt');
  console.log('Total lines:', lineCount);
  
  const results = await searchInFile('large-file.txt', 'error');
  console.log('Found', results.length, 'matches');
  
  processLargeCSV('data.csv', (row) => {
    console.log('Processing row:', row);
  });
})();

module.exports = { countLines, searchInFile, processLargeCSV };
```

**Key Takeaways:**
- Always use asynchronous file operations to avoid blocking
- The `fs.promises` API is cleaner than callbacks
- Streams are essential for processing large files efficiently
- The `path` module ensures cross-platform compatibility
- Always handle errors when working with the file system
- Use `recursive: true` when creating nested directories
- Streams allow processing data in chunks, saving memory

---

## 6. Asynchronous Programming

### Learning Objectives
- Master callbacks, promises, and async/await
- Understand asynchronous patterns
- Handle errors in async code
- Avoid callback hell

### Topics to Cover

#### Callbacks
- Callback function pattern
- Error-first callbacks
- Callback hell problem
- Managing nested callbacks

#### Promises
- Creating promises
- `.then()` and `.catch()`
- Promise chaining
- `Promise.all()`, `Promise.race()`, `Promise.allSettled()`
- Converting callbacks to promises (`util.promisify`)

#### Async/Await
- `async` function declaration
- `await` keyword usage
- Error handling with try/catch
- Parallel execution with `Promise.all()`
- Sequential vs parallel async operations

#### Advanced Async Patterns
- Async iteration
- Event emitters
- Async queue patterns
- Throttling and debouncing

### Practice Exercises
1. Convert callback-based code to promises
2. Refactor promises to async/await
3. Handle multiple async operations
4. Build an async data processing pipeline

---

## 7. Building HTTP Servers

### Learning Objectives
- Create HTTP servers with Node.js
- Handle HTTP requests and responses
- Understand HTTP methods and status codes
- Parse request data

### Topics to Cover

#### HTTP Module
- Creating a basic server (`http.createServer`)
- Request object properties
- Response object methods
- Setting headers
- Sending responses

#### HTTP Methods
- GET requests
- POST requests
- PUT/PATCH requests
- DELETE requests
- HEAD, OPTIONS

#### HTTP Status Codes
- 2xx Success codes
- 3xx Redirection codes
- 4xx Client error codes
- 5xx Server error codes

#### Request/Response Handling
- Reading request URL and headers
- Parsing query strings
- Handling POST data
- Setting response headers
- Content negotiation

#### Routing Basics
- URL parsing
- Route matching
- Handling different endpoints
- Basic routing without frameworks

### Practice Exercises
1. Create a simple HTTP server
2. Build a server that handles different routes
3. Parse and respond with JSON data
4. Create a simple REST endpoint

---

## 8. Express.js Framework

### Learning Objectives
- Set up Express applications
- Create routes and handle requests
- Use Express middleware
- Serve static files

### Topics to Cover

#### Express Basics
- Installing Express
- Creating an Express app
- Basic routing
- Request and response objects
- Starting the server

#### Routing in Express
- Route parameters
- Query parameters
- Route methods (`.get()`, `.post()`, etc.)
- Route chaining
- `express.Router()`

#### Request Handling
- Accessing request data
- Request body parsing
- File uploads
- Cookie parsing
- Session management

#### Response Methods
- `res.send()`, `res.json()`
- `res.status()`
- `res.redirect()`
- `res.render()` (for templates)
- Setting headers

#### Static Files
- Serving static files
- `express.static()` middleware
- Public directories
- File organization

### Practice Exercises
1. Create a basic Express server
2. Build routes with parameters
3. Handle form submissions
4. Serve static HTML/CSS/JS files

---

## 9. RESTful API Development

### Learning Objectives
- Understand REST architecture
- Design RESTful endpoints
- Implement CRUD operations
- Handle API versioning

### Topics to Cover

#### REST Principles
- Resource-based architecture
- HTTP methods mapping to CRUD
- Stateless communication
- URI design best practices
- Response format conventions

#### CRUD Operations
- Create (POST)
- Read (GET - single and multiple)
- Update (PUT/PATCH)
- Delete (DELETE)
- Status code conventions

#### API Design
- Resource naming conventions
- Nested resources
- Filtering, sorting, pagination
- API versioning strategies
- HATEOAS principles (optional)

#### Request Validation
- Input validation
- Data sanitization
- Error responses
- Validation libraries (`joi`, `express-validator`)

#### Response Formatting
- JSON response structure
- Success responses
- Error responses
- Consistent response format
- Metadata inclusion

### Practice Exercises
1. Design a RESTful API for a blog
2. Implement CRUD operations for users
3. Add pagination to list endpoints
4. Create nested resource endpoints

---

## 10. Middleware Patterns

### Learning Objectives
- Understand middleware concept
- Create custom middleware
- Use third-party middleware
- Implement middleware chains

### Topics to Cover

#### Middleware Fundamentals
- What is middleware?
- Middleware execution flow
- `next()` function
- Application-level vs router-level middleware
- Error-handling middleware

#### Built-in Middleware
- `express.json()` - JSON body parser
- `express.urlencoded()` - URL-encoded body parser
- `express.static()` - static file serving

#### Popular Third-Party Middleware
- `cors` - Cross-Origin Resource Sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `compression` - Response compression
- `cookie-parser` - Cookie parsing

#### Custom Middleware
- Creating middleware functions
- Request/response modification
- Authentication middleware
- Logging middleware
- Rate limiting middleware

#### Error Handling Middleware
- Error middleware signature
- Catching errors
- Async error handling
- Centralized error handling

### Practice Exercises
1. Create authentication middleware
2. Build a request logging middleware
3. Implement rate limiting
4. Create error handling middleware

---

## 11. Error Handling

### Learning Objectives
- Handle errors effectively
- Create custom error classes
- Implement global error handlers
- Debug application errors

### Topics to Cover

#### Error Types
- Synchronous errors
- Asynchronous errors
- Operational vs programmer errors
- Uncaught exceptions

#### Try-Catch Blocks
- Using try-catch with sync code
- Try-catch with async/await
- Error propagation
- Finally blocks

#### Custom Error Classes
- Extending Error class
- Creating domain-specific errors
- Error properties (name, message, stack)
- Error metadata

#### Express Error Handling
- Error-handling middleware
- Async error handling
- Express async errors package
- 404 handling

#### Production Error Handling
- Error logging
- Error monitoring services
- Graceful shutdown
- Process-level error handling

### Practice Exercises
1. Create custom error classes
2. Implement centralized error handler
3. Handle async errors properly
4. Add error logging

---

## 12. Working with Databases

### Learning Objectives
- Connect to databases
- Perform CRUD operations
- Use ORMs and ODMs
- Handle database errors

### Topics to Cover

#### Database Types
- SQL vs NoSQL
- Relational databases (PostgreSQL, MySQL)
- Document databases (MongoDB)
- When to use which type

#### MongoDB with Mongoose
- Installing MongoDB and Mongoose
- Connecting to MongoDB
- Creating schemas and models
- CRUD operations
- Validation
- Relationships and population
- Query building
- Indexing

#### PostgreSQL with Sequelize/Prisma
- Installing PostgreSQL
- Setting up Sequelize/Prisma
- Defining models
- Migrations
- CRUD operations
- Associations
- Transactions
- Raw queries

#### Database Best Practices
- Connection pooling
- Error handling
- Query optimization
- Data validation
- Indexing strategies
- Avoiding N+1 queries

### Practice Exercises
1. Connect to MongoDB and perform CRUD
2. Create Mongoose schemas with validation
3. Implement relationships between models
4. Build a data access layer

---

## 13. Authentication & Authorization

### Learning Objectives
- Implement user authentication
- Secure passwords
- Use JWT tokens
- Implement authorization

### Topics to Cover

#### Authentication Basics
- Authentication vs authorization
- Session-based vs token-based auth
- Password security principles

#### Password Hashing
- Using bcrypt
- Salt and hash passwords
- Comparing passwords
- Password strength validation

#### JSON Web Tokens (JWT)
- What are JWTs?
- JWT structure (header, payload, signature)
- Creating JWTs
- Verifying JWTs
- JWT best practices
- Token expiration and refresh

#### Session Management
- Express sessions
- Session stores
- Cookie security
- Session expiration

#### Authentication Strategies
- Local authentication
- OAuth 2.0 basics
- Social login (Google, Facebook)
- Passport.js library

#### Authorization
- Role-based access control (RBAC)
- Permission middleware
- Protecting routes
- Resource ownership

### Practice Exercises
1. Implement user registration and login
2. Create JWT authentication
3. Build protected routes
4. Implement role-based access control

---

## 14. Validation & Security

### Learning Objectives
- Validate user input
- Implement security best practices
- Protect against common vulnerabilities
- Secure API endpoints

### Topics to Cover

#### Input Validation
- Using `joi` for validation
- Using `express-validator`
- Schema validation
- Custom validators
- Error messages

#### Security Best Practices
- HTTPS enforcement
- Security headers (helmet)
- CORS configuration
- Rate limiting
- Request size limits

#### Common Vulnerabilities
- SQL injection prevention
- NoSQL injection prevention
- XSS (Cross-Site Scripting) protection
- CSRF (Cross-Site Request Forgery)
- Clickjacking protection

#### Data Sanitization
- Input sanitization
- Output encoding
- HTML sanitization
- Preventing code injection

#### API Security
- API key authentication
- OAuth 2.0 implementation
- Secure token storage
- API rate limiting

### Practice Exercises
1. Implement input validation with joi
2. Add security headers to Express app
3. Implement rate limiting
4. Sanitize user input

---

## 15. Testing in Node.js

### Learning Objectives
- Write unit tests
- Create integration tests
- Use testing frameworks
- Implement test coverage

### Topics to Cover

#### Testing Fundamentals
- Why testing matters
- Types of tests (unit, integration, e2e)
- Test-driven development (TDD)
- Arrange-Act-Assert pattern

#### Jest Testing Framework
- Installing and configuring Jest
- Writing test cases
- Test suites and describe blocks
- Matchers and assertions
- Setup and teardown
- Mocking and spies

#### Testing Express APIs
- Supertest library
- Testing routes
- Testing middleware
- Mocking database operations
- Testing error handling

#### Mocking
- Mocking modules
- Mocking functions
- Mocking HTTP requests
- Database mocking

#### Test Coverage
- Code coverage reports
- Istanbul/nyc
- Coverage thresholds
- CI/CD integration

### Practice Exercises
1. Write unit tests for utility functions
2. Test Express routes with Supertest
3. Mock database operations
4. Achieve 80%+ code coverage

---

## 16. Environment Configuration

### Learning Objectives
- Manage environment variables
- Configure different environments
- Secure sensitive data
- Use configuration files

### Topics to Cover

#### Environment Variables
- What are environment variables?
- `process.env` object
- Setting environment variables
- Platform differences

#### dotenv Package
- Installing dotenv
- Creating `.env` files
- Loading environment variables
- `.env.example` files
- Multiple environment files

#### Configuration Management
- Development vs production configs
- Configuration file patterns
- Using `config` package
- Configuration validation

#### Secrets Management
- Never commit secrets
- `.gitignore` configuration
- Secret rotation
- Using secret management services

### Practice Exercises
1. Set up dotenv in your project
2. Create different environment configs
3. Secure database credentials
4. Use config package for settings

---

## 17. Logging & Debugging

### Learning Objectives
- Implement application logging
- Use debugging tools
- Monitor application health
- Troubleshoot issues

### Topics to Cover

#### Logging Basics
- Why logging is important
- Log levels (error, warn, info, debug)
- What to log
- Log formatting

#### Logging Libraries
- Winston logger
- Pino logger
- Morgan for HTTP logging
- Log transports
- Log rotation

#### Debugging Tools
- Node.js debugger
- VS Code debugging
- Chrome DevTools
- `debug` package
- Breakpoints and inspection

#### Error Tracking
- Error monitoring services
- Sentry integration
- Application monitoring
- Performance monitoring

#### Health Checks
- Health check endpoints
- Readiness probes
- Liveness probes
- Monitoring metrics

### Practice Exercises
1. Set up Winston logger
2. Configure different log levels
3. Debug with VS Code
4. Create health check endpoint

---

## 18. File Uploads & Processing

### Learning Objectives
- Handle file uploads
- Process uploaded files
- Validate file types and sizes
- Store files securely

### Topics to Cover

#### File Upload Basics
- Multipart form data
- `multer` middleware
- Upload limits
- File filtering

#### File Storage
- Local file storage
- Cloud storage (AWS S3, Google Cloud)
- File naming strategies
- Directory organization

#### File Validation
- File type validation
- File size limits
- MIME type checking
- Security considerations

#### Image Processing
- `sharp` library
- Image resizing
- Image optimization
- Thumbnail generation

### Practice Exercises
1. Implement file upload endpoint
2. Validate uploaded files
3. Process and resize images
4. Store files in cloud storage

---

## 19. Real-time Communication

### Learning Objectives
- Implement WebSocket communication
- Use Socket.IO
- Build real-time features
- Handle real-time events

### Topics to Cover

#### WebSockets Basics
- What are WebSockets?
- WebSocket vs HTTP
- Use cases for real-time communication
- WebSocket protocol

#### Socket.IO
- Installing Socket.IO
- Server setup
- Client setup
- Emitting events
- Listening to events
- Broadcasting

#### Real-time Patterns
- Rooms and namespaces
- Private messaging
- Presence detection
- Acknowledgements

#### Scaling Real-time Apps
- Multiple server instances
- Redis adapter
- Load balancing
- Connection management

### Practice Exercises
1. Create a basic chat application
2. Implement real-time notifications
3. Build a collaborative tool
4. Handle disconnections gracefully

---

## 20. Email & Notifications

### Learning Objectives
- Send emails from Node.js
- Use email templates
- Handle email errors
- Implement notification systems

### Topics to Cover

#### Email Basics
- SMTP protocol
- Email providers
- `nodemailer` library
- Email configuration

#### Sending Emails
- Creating transporter
- Sending plain text emails
- Sending HTML emails
- Attachments
- Inline images

#### Email Templates
- Template engines (Handlebars, EJS)
- Dynamic content
- Template organization
- Styling emails

#### Email Services
- SendGrid
- Mailgun
- AWS SES
- Postmark

#### Push Notifications
- Firebase Cloud Messaging
- Web push notifications
- Mobile push notifications

### Practice Exercises
1. Send welcome emails
2. Create email templates
3. Implement password reset emails
4. Set up transactional emails

---

## 21. Task Scheduling & Background Jobs

### Learning Objectives
- Schedule recurring tasks
- Process background jobs
- Use job queues
- Handle long-running tasks

### Topics to Cover

#### Task Scheduling
- `node-cron` package
- Cron syntax
- Scheduled tasks
- Task management

#### Job Queues
- Bull queue library
- Redis for queues
- Job processors
- Job priorities
- Delayed jobs

#### Background Processing
- Worker processes
- Queue patterns
- Retry logic
- Dead letter queues

#### Use Cases
- Email sending
- Report generation
- Data cleanup
- Batch processing

### Practice Exercises
1. Schedule daily cleanup tasks
2. Implement email queue
3. Process background jobs
4. Handle job failures

---

## 22. API Documentation

### Learning Objectives
- Document API endpoints
- Use documentation tools
- Generate interactive docs
- Maintain documentation

### Topics to Cover

#### Documentation Importance
- Why document APIs?
- Documentation best practices
- Keeping docs up-to-date

#### Swagger/OpenAPI
- OpenAPI specification
- Swagger UI
- `swagger-jsdoc` package
- `swagger-ui-express`
- API annotations

#### Postman
- Creating collections
- Environment variables
- Example requests
- Automated documentation

#### Other Tools
- API Blueprint
- RAML
- Docusaurus for docs sites

### Practice Exercises
1. Document existing API with Swagger
2. Create Postman collection
3. Generate interactive documentation
4. Add example requests and responses

---

## 23. Performance Optimization

### Learning Objectives
- Profile Node.js applications
- Optimize code performance
- Implement caching strategies
- Scale applications

### Topics to Cover

#### Performance Profiling
- Node.js profiler
- Chrome DevTools profiling
- Identifying bottlenecks
- Memory leak detection

#### Code Optimization
- Avoiding blocking operations
- Efficient algorithms
- Stream usage
- Worker threads

#### Caching
- In-memory caching
- Redis caching
- Cache strategies (LRU, TTL)
- Cache invalidation

#### Database Optimization
- Query optimization
- Indexing
- Connection pooling
- Caching query results

#### Load Balancing
- Clustering module
- PM2 process manager
- Nginx load balancing
- Horizontal scaling

### Practice Exercises
1. Profile your application
2. Implement Redis caching
3. Optimize database queries
4. Set up clustering

---

## 24. Deployment & DevOps

### Learning Objectives
- Deploy Node.js applications
- Use cloud platforms
- Implement CI/CD
- Monitor production apps

### Topics to Cover

#### Deployment Basics
- Production vs development
- Environment setup
- Process managers (PM2)
- Server configuration

#### Cloud Platforms
- Heroku deployment
- AWS (EC2, Elastic Beanstalk)
- Google Cloud Platform
- DigitalOcean
- Vercel/Netlify

#### Containerization
- Docker basics
- Creating Dockerfiles
- Docker Compose
- Container orchestration

#### CI/CD
- GitHub Actions
- GitLab CI
- Automated testing
- Automated deployment

#### Monitoring
- Application monitoring
- Error tracking
- Performance monitoring
- Log aggregation

### Practice Exercises
1. Deploy app to Heroku
2. Create a Dockerfile
3. Set up CI/CD pipeline
4. Configure monitoring

---

## 25. Best Practices & Design Patterns

### Learning Objectives
- Follow Node.js best practices
- Implement design patterns
- Write maintainable code
- Structure large applications

### Topics to Cover

#### Code Organization
- Project structure
- Separation of concerns
- MVC pattern
- Layered architecture

#### Design Patterns
- Singleton pattern
- Factory pattern
- Observer pattern
- Middleware pattern
- Repository pattern
- Service layer pattern

#### Best Practices
- Error handling conventions
- Async best practices
- Security best practices
- Code style and linting (ESLint)
- Code formatting (Prettier)

#### Code Quality
- Code reviews
- Static analysis
- Type checking with TypeScript
- Documentation standards

#### Scalability Patterns
- Microservices basics
- API Gateway pattern
- Event-driven architecture
- Message queues

### Practice Exercises
1. Refactor code using design patterns
2. Set up ESLint and Prettier
3. Implement repository pattern
4. Structure a large application

---

## Learning Path Recommendations

### Beginner Track (Weeks 1-4)
1. Introduction to Node.js
2. JavaScript Foundations
3. Node.js Core Concepts
4. Working with NPM
5. File System Operations
6. Basic HTTP Servers

### Intermediate Track (Weeks 5-10)
1. Asynchronous Programming
2. Express.js Framework
3. RESTful API Development
4. Middleware Patterns
5. Error Handling
6. Working with Databases
7. Authentication & Authorization

### Advanced Track (Weeks 11-16)
1. Validation & Security
2. Testing in Node.js
3. Logging & Debugging
4. Real-time Communication
5. Task Scheduling
6. Performance Optimization
7. Deployment & DevOps

---

## Recommended Resources

### Online Courses
- Node.js - The Complete Guide (Udemy)
- Learn Node by Wes Bos
- Node.js API Masterclass (Udemy)
- FreeCodeCamp Node.js tutorials

### Books
- "Node.js Design Patterns" by Mario Casciaro
- "Learning Node" by Shelley Powers
- "Node.js in Action" by Alex Young
- "Node.js 8 the Right Way" by Jim Wilson

### Documentation
- Official Node.js Documentation
- Express.js Documentation
- MDN Web Docs (JavaScript)
- npm Documentation

### Practice Platforms
- Node School workshops
- HackerRank (Node.js track)
- LeetCode
- Build your own projects

---

## Project Ideas for Practice

### Beginner Projects
1. **CLI Todo App** - File-based task manager
2. **Weather API Client** - Fetch and display weather data
3. **Simple Blog API** - CRUD operations for blog posts
4. **URL Shortener** - Create short URLs

### Intermediate Projects
1. **E-commerce API** - Products, cart, orders
2. **Social Media API** - Users, posts, likes, comments
3. **Task Management System** - Projects, tasks, assignments
4. **Real-time Chat Application** - Messaging with Socket.IO

### Advanced Projects
1. **Microservices Architecture** - Multiple interconnected services
2. **Video Streaming Platform** - Upload, process, stream videos
3. **Payment Processing System** - Integration with payment gateways
4. **GraphQL API** - Alternative to REST

---

## Tips for Success

### Daily Practice
- Code for at least 1-2 hours daily
- Build projects, not just follow tutorials
- Read other people's code
- Contribute to open source

### Learning Strategy
- Follow the plan sequentially
- Don't skip fundamentals
- Practice after each section
- Build real projects
- Review and refactor old code

### Problem-Solving
- Debug errors yourself first
- Use documentation extensively
- Ask questions on Stack Overflow
- Join Node.js communities

### Stay Updated
- Follow Node.js blog
- Subscribe to Node Weekly
- Watch conference talks
- Read technical articles

---

## Conclusion

This comprehensive learning plan covers everything a junior developer needs to master Node.js. Remember that consistency is key - regular practice and building real projects will solidify your understanding far better than just reading or watching tutorials.

Start with the fundamentals, progress through intermediate topics, and gradually tackle advanced concepts. Each section builds upon the previous one, so avoid skipping ahead. Most importantly, write code every day and build projects that interest you.

Good luck on your Node.js journey! 🚀

