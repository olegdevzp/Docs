# Frontend Interview JavaScript Questions - Quick Reference List

## Table of Contents

### Core JavaScript Concepts
1. [JavaScript Fundamentals](#javascript-fundamentals) - Questions 1-7
   - What is JavaScript and its key features?
   - Difference between `==` and `===`
   - JavaScript data types
   - `var`, `let`, and `const` differences
   - Hoisting in JavaScript
   - `null` vs `undefined`
   - Type coercion

2. [Functions](#functions) - Questions 8-14
   - Different ways to create functions
   - Function declarations vs expressions
   - Arrow functions
   - The `this` keyword
   - Higher-order functions
   - Function currying
   - `call`, `apply`, and `bind`

3. [Scope and Closures](#scope-and-closures) - Questions 15-19
   - JavaScript scope types
   - Closures and their importance
   - Global, function, and block scope
   - Temporal dead zone
   - Variable shadowing

4. [Objects and Arrays](#objects-and-arrays) - Questions 20-25
   - Object creation and manipulation
   - Common array methods
   - Shallow vs deep copy
   - Object cloning techniques
   - Destructuring assignment
   - Spread operator and rest parameters

5. [Prototypes and Inheritance](#prototypes-and-inheritance) - Questions 26-30
   - JavaScript prototypes
   - Prototypal inheritance
   - `__proto__` vs `prototype`
   - ES6 classes and prototypes
   - Prototype chain

### Asynchronous Programming
6. [Asynchronous JavaScript](#asynchronous-javascript) - Questions 31-37
   - Callbacks and callback hell
   - Promises and their methods
   - async/await syntax
   - Event Loop mechanism
   - Microtasks vs macrotasks
   - Error handling in async code
   - Promise.all(), Promise.race(), Promise.allSettled()

### DOM and Browser APIs
7. [Event Handling](#event-handling) - Questions 38-42
   - JavaScript event handling
   - Event bubbling and capturing
   - Event delegation
   - Preventing default behavior
   - addEventListener vs onclick

8. [DOM Manipulation](#dom-manipulation) - Questions 43-47
   - DOM element selection
   - Creating, modifying, removing elements
   - innerHTML vs textContent vs innerText
   - Form validation
   - document.ready vs window.onload

9. [Browser APIs](#browser-apis) - Questions 70-74
   - localStorage vs sessionStorage vs cookies
   - Fetch API
   - Web Workers
   - Geolocation API
   - History API

### Modern JavaScript
10. [ES6+ Features](#es6-features) - Questions 48-54
    - Template literals
    - Default parameters
    - Modules and import/export
    - Sets and Maps
    - Symbols
    - Generators and iterators
    - for...of vs for...in loops

11. [Modern JavaScript Tools](#modern-javascript-tools) - Questions 83-87
    - npm and package.json
    - Build tools (Webpack, Vite)
    - Babel transpiler
    - ESLint linting
    - Development vs production builds

### Error Handling and Performance
12. [Error Handling](#error-handling) - Questions 55-58
    - JavaScript error handling
    - Throwing and catching errors
    - Error types in JavaScript
    - Custom error types

13. [Performance and Optimization](#performance-and-optimization) - Questions 59-63
    - Performance optimization techniques
    - Memory leak prevention
    - Debouncing and throttling
    - DOM optimization
    - Lazy loading

### Advanced Topics
14. [Advanced Concepts](#advanced-concepts) - Questions 64-69
    - Memoization
    - Design patterns (Singleton, Observer, Module)
    - Functional programming
    - Immutability
    - Pure functions
    - Recursion

15. [Security](#security) - Questions 75-78
    - Cross-Site Scripting (XSS)
    - Cross-Site Request Forgery (CSRF)
    - Input sanitization
    - Content Security Policy (CSP)

16. [Testing](#testing) - Questions 79-82
    - Unit testing in JavaScript
    - Test-driven development (TDD)
    - Mocks and stubs
    - Testing asynchronous code

### Data Handling
17. [Regular Expressions](#regular-expressions) - Questions 88-90
    - Using regex in JavaScript
    - Common validation patterns
    - match, search, replace, test methods

18. [JSON and Data Handling](#json-and-data-handling) - Questions 91-94
    - Working with JSON
    - JSON.parse() vs JSON.stringify()
    - API response handling
    - CORS handling

### Practical Applications
19. [Miscellaneous](#miscellaneous) - Questions 95-100
    - Synchronous vs asynchronous code
    - Array checking methods
    - typeof operator limitations
    - String to number conversion
    - slice, splice, split differences
    - Array and object sorting

20. [Coding Challenges](#coding-challenges-common-interview-questions) - Questions 101-110
    - String reversal
    - Palindrome checking
    - Array duplicate finding
    - Array flattening
    - Calculator implementation
    - Function debouncing
    - Promise implementation
    - Array method implementations

21. [Framework-Agnostic Frontend Concepts](#framework-agnostic-frontend-concepts) - Questions 111-120
    - Virtual DOM
    - Component-based architecture
    - State management
    - Client-side routing
    - SSR vs CSR
    - Progressive Web Apps
    - Responsive design
    - Accessibility (a11y)
    - Micro-frontends
    - SPA vs MPA vs SSG

---

## JavaScript Fundamentals

### 1. What is JavaScript and what are its key features?

**JavaScript** is a high-level, interpreted, dynamically-typed programming language that enables interactive web pages and is an essential part of web applications. Originally created for client-side scripting, it now runs on servers, mobile apps, and desktop applications.

**Key Features:**
- **Dynamic Typing**: Variables don't need explicit type declarations
- **First-class Functions**: Functions can be assigned to variables, passed as arguments, and returned from other functions
- **Prototype-based Object Orientation**: Objects can inherit directly from other objects
- **Event-driven Programming**: Responds to user interactions and system events
- **Interpreted Language**: No compilation step required
- **Weak Typing**: Automatic type conversion when needed
- **Multi-paradigm**: Supports procedural, object-oriented, and functional programming

**Example:**
```javascript
// Dynamic typing
let variable = "Hello"; // String
variable = 42;          // Now a number
variable = true;        // Now a boolean

// First-class functions
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Event-driven
document.addEventListener('click', function() {
    console.log('Page clicked!');
});
```

**Related Questions:** [Data Types](#3-what-are-the-different-data-types-in-javascript), [Type Coercion](#7-what-is-type-coercion-in-javascript)

[⬆️ Back to Top](#table-of-contents)

---

### 2. What's the difference between `==` and `===`?

The main difference lies in **type checking** and **type coercion**:

**`==` (Loose Equality/Abstract Equality):**
- Performs type coercion before comparison
- Converts operands to the same type if they're different
- Can lead to unexpected results

**`===` (Strict Equality):**
- No type coercion
- Compares both value and type
- Recommended for most comparisons

**Examples:**
```javascript
// Loose equality (==) - with type coercion
console.log(5 == '5');        // true (string '5' converted to number)
console.log(true == 1);       // true (boolean converted to number)
console.log(false == 0);      // true
console.log(null == undefined); // true (special case)
console.log(0 == '');         // true (empty string converted to 0)

// Strict equality (===) - no type coercion
console.log(5 === '5');       // false (different types)
console.log(true === 1);      // false
console.log(false === 0);     // false
console.log(null === undefined); // false
console.log(0 === '');        // false

// Safe comparisons
const userInput = '42';
if (parseInt(userInput) === 42) {
    console.log('Valid number!');
}
```

**Best Practice:** Always use `===` unless you specifically need type coercion.

**Related Questions:** [Type Coercion](#7-what-is-type-coercion-in-javascript), [Data Types](#3-what-are-the-different-data-types-in-javascript)

[⬆️ Back to Top](#table-of-contents)

---

### 3. What are the different data types in JavaScript?

JavaScript has **8 data types** divided into two categories:

**Primitive Types (7):**
1. **`undefined`** - Variable declared but not assigned
2. **`null`** - Intentional absence of value
3. **`boolean`** - true or false
4. **`number`** - Integers and floating-point numbers
5. **`string`** - Text data
6. **`symbol`** - Unique identifiers (ES6+)
7. **`bigint`** - Large integers (ES2020+)

**Non-Primitive Type (1):**
8. **`object`** - Collections of key-value pairs (including arrays, functions, dates)

**Examples:**
```javascript
// Primitive types
let undefinedVar;                    // undefined
let nullVar = null;                  // null
let boolVar = true;                  // boolean
let numVar = 42;                     // number
let floatVar = 3.14;                 // number
let strVar = "Hello World";          // string
let symVar = Symbol('id');           // symbol
let bigIntVar = 123456789012345678901234567890n; // bigint

// Non-primitive type
let objVar = { name: "John", age: 30 }; // object
let arrVar = [1, 2, 3];             // object (array)
let funcVar = function() {};        // object (function)
let dateVar = new Date();           // object

// Type checking
console.log(typeof undefinedVar);   // "undefined"
console.log(typeof nullVar);        // "object" (known quirk!)
console.log(typeof boolVar);        // "boolean"
console.log(typeof numVar);         // "number"
console.log(typeof strVar);         // "string"
console.log(typeof symVar);         // "symbol"
console.log(typeof bigIntVar);      // "bigint"
console.log(typeof objVar);         // "object"
console.log(typeof arrVar);         // "object"
console.log(typeof funcVar);        // "function"

// Better type checking for arrays
console.log(Array.isArray(arrVar)); // true
console.log(Array.isArray(objVar)); // false
```

**Important Notes:**
- `typeof null` returns `"object"` (historical bug that can't be fixed)
- Arrays are objects in JavaScript
- Functions are objects but `typeof` returns `"function"`
- Use `Array.isArray()` to check for arrays

**Related Questions:** [null vs undefined](#6-what-is-the-difference-between-null-and-undefined), [Type Coercion](#7-what-is-type-coercion-in-javascript)

[⬆️ Back to Top](#table-of-contents)

---

### 4. What's the difference between `var`, `let`, and `const`?

The three keywords for variable declaration have different behaviors regarding **scope**, **hoisting**, **redeclaration**, and **reassignment**:

**Comparison Table:**

| Feature | var | let | const |
|---------|-----|-----|-------|
| **Scope** | Function/Global | Block | Block |
| **Hoisting** | Yes (initialized with undefined) | Yes (Temporal Dead Zone) | Yes (Temporal Dead Zone) |
| **Redeclaration** | Allowed | Not allowed | Not allowed |
| **Reassignment** | Allowed | Allowed | Not allowed* |
| **Initialization** | Optional | Optional | Required |

*Objects and arrays declared with `const` can be mutated, but not reassigned.

**Examples:**

**Scope Differences:**
```javascript
function scopeExample() {
    if (true) {
        var varVariable = 'I am var';
        let letVariable = 'I am let';
        const constVariable = 'I am const';
    }
    
    console.log(varVariable);    // 'I am var' - accessible
    // console.log(letVariable); // ReferenceError - not accessible
    // console.log(constVariable); // ReferenceError - not accessible
}

// Global scope pollution with var
var globalVar = 'global';
console.log(window.globalVar); // 'global' (in browsers)

let globalLet = 'global';
console.log(window.globalLet); // undefined
```

**Best Practices:**
1. Use `const` by default
2. Use `let` when you need to reassign the variable
3. Avoid `var` in modern JavaScript (ES6+)

**Related Questions:** [Hoisting](#5-what-is-hoisting-in-javascript), [Scope](#scope-and-closures)

[⬆️ Back to Top](#table-of-contents)

---

### 5. What is hoisting in JavaScript?

**Hoisting** is JavaScript's behavior of moving variable and function declarations to the top of their containing scope during the compilation phase, before code execution.

**Key Points:**
- Only **declarations** are hoisted, not **initializations**
- Variables are hoisted but initialized with `undefined`
- Function declarations are fully hoisted
- `let` and `const` are hoisted but in a "Temporal Dead Zone"

**Variable Hoisting:**
```javascript
// What you write:
console.log(myVar); // undefined (not ReferenceError)
var myVar = 5;
console.log(myVar); // 5

// How JavaScript interprets it:
var myVar; // Declaration hoisted
console.log(myVar); // undefined
myVar = 5; // Initialization stays in place
console.log(myVar); // 5
```

**Function Hoisting:**
```javascript
// Function declarations are fully hoisted
console.log(sayHello()); // "Hello!" - works before declaration

function sayHello() {
    return "Hello!";
}

// Function expressions are not hoisted
// console.log(sayGoodbye()); // TypeError: sayGoodbye is not a function
var sayGoodbye = function() {
    return "Goodbye!";
};
```

**Best Practices:**
1. Declare variables at the top of their scope
2. Use `let` and `const` instead of `var`
3. Declare functions before using them
4. Initialize variables when declaring them

**Related Questions:** [var, let, const](#4-whats-the-difference-between-var-let-and-const), [Scope](#scope-and-closures)

[⬆️ Back to Top](#table-of-contents)

---

### 6. What is the difference between `null` and `undefined`?

Both `null` and `undefined` represent "no value," but they have different meanings and use cases:

**`undefined`:**
- **Meaning**: Variable has been declared but not assigned a value
- **Type**: `undefined`
- **Automatic**: JavaScript assigns this automatically
- **Default**: Default value for uninitialized variables, missing function parameters, and missing object properties

**`null`:**
- **Meaning**: Intentional absence of any value
- **Type**: `object` (this is a known bug in JavaScript)
- **Intentional**: Explicitly assigned by the programmer
- **Purpose**: Represents "nothing," "empty," or "value unknown"

**Examples:**
```javascript
// undefined scenarios
let declaredButNotAssigned;
console.log(declaredButNotAssigned); // undefined

function testFunction(param) {
    console.log(param); // undefined if no argument passed
}
testFunction(); // undefined

const obj = { name: 'John' };
console.log(obj.age); // undefined (property doesn't exist)

// null scenarios
let intentionallyEmpty = null;
console.log(intentionallyEmpty); // null

// API responses often use null
const user = {
    name: 'John',
    avatar: null, // User has no avatar
    lastLogin: null // User never logged in
};
```

**Type Checking:**
```javascript
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (historical bug)

// Better null checking
console.log(null === null);           // true
console.log(undefined === undefined); // true
console.log(null === undefined);      // false
console.log(null == undefined);       // true (loose equality)
```

**Best Practices:**
1. Use `undefined` for uninitialized variables (JavaScript default)
2. Use `null` to explicitly represent "no value" or "empty"
3. Use `==` to check for both null and undefined: `if (value == null)`
4. Use `===` for strict checking: `if (value === null)`

**Related Questions:** [Type Coercion](#7-what-is-type-coercion-in-javascript), [Data Types](#3-what-are-the-different-data-types-in-javascript)

[⬆️ Back to Top](#table-of-contents)

---

### 7. What is type coercion in JavaScript?

**Type coercion** is the automatic or implicit conversion of values from one data type to another. JavaScript performs coercion when operators or functions expect a certain type but receive a different type.

**Types of Coercion:**
1. **Implicit Coercion** - Automatic conversion by JavaScript
2. **Explicit Coercion** - Manual conversion by the programmer

**String Coercion:**
```javascript
// Implicit string coercion (+ operator with strings)
console.log(5 + '3');        // '53' (number 5 becomes string '5')
console.log('Hello' + 42);   // 'Hello42'
console.log(true + ' story'); // 'true story'

// Explicit string coercion
console.log(String(123));    // '123'
console.log(String(true));   // 'true'
console.log(String(null));   // 'null'
console.log(String(undefined)); // 'undefined'
```

**Numeric Coercion:**
```javascript
// Implicit numeric coercion
console.log('5' - 2);        // 3 (string '5' becomes number 5)
console.log('10' * 2);       // 20
console.log('15' / 3);       // 5
console.log(+'42');          // 42 (unary + converts to number)

// Explicit numeric coercion
console.log(Number('123'));  // 123
console.log(Number(''));     // 0
console.log(Number('abc'));  // NaN
console.log(Number(true));   // 1
console.log(Number(false));  // 0
```

**Boolean Coercion:**
```javascript
// Falsy values (convert to false)
console.log(Boolean(0));         // false
console.log(Boolean(''));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false

// Everything else is truthy (converts to true)
console.log(Boolean(1));         // true
console.log(Boolean('hello'));   // true
console.log(Boolean([]));        // true (empty array is truthy)
console.log(Boolean({}));        // true (empty object is truthy)
```

**Best Practices:**
```javascript
// Avoid implicit coercion - be explicit
// Instead of:
if (value) { /* ... */ }

// Be explicit about what you're checking:
if (value !== null && value !== undefined) { /* ... */ }
if (value !== '') { /* ... */ }
if (value !== 0) { /* ... */ }

// Use strict equality
if (x === y) { /* ... */ } // Instead of x == y

// Explicit conversions
const num = Number(stringValue);
const str = String(numberValue);
const bool = Boolean(value);
```

**Related Questions:** [Equality Operators](#2-whats-the-difference-between--and-), [Data Types](#3-what-are-the-different-data-types-in-javascript)

[⬆️ Back to Top](#table-of-contents)

## Functions

### 8. What are the different ways to create functions in JavaScript?

JavaScript provides several ways to create functions, each with different characteristics:

**1. Function Declaration:**
```javascript
function add(a, b) {
    return a + b;
}
```

**2. Function Expression:**
```javascript
const multiply = function(a, b) {
    return a * b;
};
```

**3. Arrow Function (ES6+):**
```javascript
const divide = (a, b) => a / b;
const square = x => x * x;
const greet = () => "Hello!";
```

**4. Method Definition (in objects):**
```javascript
const calculator = {
    add(a, b) { return a + b; },
    multiply: function(a, b) { return a * b; }
};
```

**5. Function Constructor (rarely used):**
```javascript
const subtract = new Function('a', 'b', 'return a - b');
```

**6. Generator Function:**
```javascript
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}
```

**7. Async Function:**
```javascript
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
}
```

**Key Differences:**
- **Hoisting**: Function declarations are fully hoisted, expressions are not
- **`this` binding**: Arrow functions inherit `this`, others have dynamic `this`
- **Constructor**: Arrow functions cannot be used as constructors

**Related Questions:** [Function Declarations vs Expressions](#9-whats-the-difference-between-function-declarations-and-function-expressions), [Arrow Functions](#10-what-are-arrow-functions-and-how-do-they-differ-from-regular-functions)

[⬆️ Back to Top](#table-of-contents)

---

### 9. What's the difference between function declarations and function expressions?

The key differences lie in **hoisting behavior**, **naming**, and **when they can be called**:

**Function Declaration:**
```javascript
function declarationFunction() {
    return "I'm a declaration";
}
```

**Function Expression:**
```javascript
const expressionFunction = function() {
    return "I'm an expression";
};
```

**Key Differences:**

**1. Hoisting Behavior:**
```javascript
// This works - function declaration is hoisted
console.log(hoistedDeclaration()); // "I'm hoisted!"

function hoistedDeclaration() {
    return "I'm hoisted!";
}

// This doesn't work - function expression is not hoisted
console.log(notHoisted()); // TypeError: notHoisted is not a function

var notHoisted = function() {
    return "I'm not hoisted";
};
```

**2. Conditional Creation:**
```javascript
let condition = true;

if (condition) {
    // Function declaration - behavior varies by environment
    function conditionalDeclaration() {
        return "Declaration in block";
    }
    
    // Function expression - safer approach
    var conditionalExpression = function() {
        return "Expression in block";
    };
}
```

**3. Recursion:**
```javascript
// Function declaration - can call itself by name
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Named function expression - can use internal name
const factorialExpr = function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
};
```

**When to Use Each:**
- **Function Declarations**: Main functions, utilities, when you need hoisting
- **Function Expressions**: Conditional functions, callbacks, when you want to prevent hoisting

**Related Questions:** [Hoisting](#5-what-is-hoisting-in-javascript), [Arrow Functions](#10-what-are-arrow-functions-and-how-do-they-differ-from-regular-functions)

[⬆️ Back to Top](#table-of-contents)

---

### 10. What are arrow functions and how do they differ from regular functions?

**Arrow functions** (introduced in ES6) provide a concise syntax for writing functions, but they have important behavioral differences from regular functions.

**Basic Syntax:**
```javascript
// Regular function
function regularFunction(a, b) {
    return a + b;
}

// Arrow function - full syntax
const arrowFunction = (a, b) => {
    return a + b;
};

// Arrow function - concise syntax (implicit return)
const conciseArrow = (a, b) => a + b;

// Single parameter (parentheses optional)
const singleParam = x => x * 2;

// No parameters (parentheses required)
const noParams = () => "Hello World";
```

**Key Differences:**

**1. `this` Binding - Most Important Difference:**
```javascript
const obj = {
    name: 'MyObject',
    
    // Regular function - has its own 'this'
    regularMethod: function() {
        console.log(this.name); // 'MyObject'
        
        setTimeout(function() {
            console.log(this.name); // undefined (global object)
        }, 100);
    },
    
    // Arrow function - inherits 'this' from enclosing scope
    arrowMethod: () => {
        console.log(this.name); // undefined (inherits from global)
    },
    
    // Regular function with arrow function inside
    mixedMethod: function() {
        console.log(this.name); // 'MyObject'
        
        setTimeout(() => {
            console.log(this.name); // 'MyObject' (inherits from mixedMethod)
        }, 100);
    }
};
```

**2. Arguments Object:**
```javascript
// Regular function - has 'arguments' object
function regularFunction() {
    console.log(arguments); // [1, 2, 3]
}
regularFunction(1, 2, 3);

// Arrow function - no 'arguments' object
const arrowFunction = (...args) => {
    console.log(args); // [1, 2, 3] - use rest parameters instead
};
arrowFunction(1, 2, 3);
```

**3. Constructor Usage:**
```javascript
// Regular function - can be used as constructor
function RegularConstructor(name) {
    this.name = name;
}
const instance1 = new RegularConstructor('John'); // Works

// Arrow function - cannot be used as constructor
const ArrowConstructor = (name) => {
    this.name = name;
};
// const instance2 = new ArrowConstructor('Jane'); // TypeError
```

**When to Use Arrow Functions:**
```javascript
// ✅ Good use cases:
// 1. Short utility functions
const double = x => x * 2;

// 2. Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// 3. Callbacks where you want to preserve 'this'
class Timer {
    constructor() {
        this.seconds = 0;
        setInterval(() => {
            this.seconds++; // 'this' refers to Timer instance
        }, 1000);
    }
}

// ❌ Avoid arrow functions for:
// 1. Object methods
const obj = {
    name: 'Object',
    getName: () => this.name // 'this' won't be the object
};

// 2. Event handlers when you need the element as 'this'
// button.addEventListener('click', () => {
//     this.style.color = 'red'; // 'this' won't be the button
// });
```

**Best Practices:**
1. Use arrow functions for short, simple functions
2. Use arrow functions in callbacks when you need to preserve `this`
3. Use regular functions for object methods
4. Use regular functions for constructors

**Related Questions:** [this keyword](#11-what-is-the-this-keyword-and-how-does-it-work), [Function Expressions](#9-whats-the-difference-between-function-declarations-and-function-expressions)

[⬆️ Back to Top](#table-of-contents)

---

### 11. What is the `this` keyword and how does it work?

The `this` keyword refers to the context object that a function is called with. Its value depends on **how** a function is called, not where it's defined.

**The Four Binding Rules:**

**1. Default Binding (Global Context):**
```javascript
function globalFunction() {
    console.log(this); // Window object (browser) or global (Node.js)
}

globalFunction(); // 'this' is the global object

// In strict mode
'use strict';
function strictFunction() {
    console.log(this); // undefined
}
strictFunction();
```

**2. Implicit Binding (Object Method):**
```javascript
const person = {
    name: 'John',
    greet: function() {
        console.log(this.name); // 'John' - 'this' is the person object
    }
};

person.greet(); // 'this' refers to person object

// Lost binding
const greetFunction = person.greet;
greetFunction(); // 'this' is global object (or undefined in strict mode)
```

**3. Explicit Binding (call, apply, bind):**
```javascript
const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

function introduce() {
    console.log(`Hi, I'm ${this.name}`);
}

// call() - arguments passed individually
introduce.call(person1); // "Hi, I'm Alice"
introduce.call(person2); // "Hi, I'm Bob"

// apply() - arguments passed as array
function greet(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

greet.apply(person1, ['Hello', '!']); // "Hello, I'm Alice!"

// bind() - creates new function with bound 'this'
const boundGreet = greet.bind(person2);
boundGreet('Hi', '.'); // "Hi, I'm Bob."
```

**4. New Binding (Constructor):**
```javascript
function Person(name) {
    this.name = name;
    this.greet = function() {
        console.log(`Hello, I'm ${this.name}`);
    };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John" - 'this' refers to new instance
```

**Arrow Functions and `this`:**
```javascript
const obj = {
    name: 'Object',
    
    regularMethod() {
        console.log(this.name); // 'Object'
        
        // Regular function - loses 'this'
        setTimeout(function() {
            console.log(this.name); // undefined
        }, 100);
        
        // Arrow function - preserves 'this'
        setTimeout(() => {
            console.log(this.name); // 'Object'
        }, 200);
    }
};
```

**Common Pitfalls:**
```javascript
// 1. Method assignment
const obj = {
    name: 'Test',
    getName() { return this.name; }
};

const getName = obj.getName;
console.log(getName()); // undefined - lost binding

// Solution: bind the method
const boundGetName = obj.getName.bind(obj);
console.log(boundGetName()); // 'Test'

// 2. Event handlers
class Button {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        
        // Wrong - 'this' will be the DOM element
        this.element.addEventListener('click', this.handleClick);
        
        // Right - bind the method
        this.element.addEventListener('click', this.handleClick.bind(this));
        
        // Or use arrow function
        this.element.addEventListener('click', () => this.handleClick());
    }
    
    handleClick() {
        this.clickCount++;
        console.log(`Clicked ${this.clickCount} times`);
    }
}
```

**Related Questions:** [Arrow Functions](#10-what-are-arrow-functions-and-how-do-they-differ-from-regular-functions), [call, apply, bind](#14-what-is-the-difference-between-call-apply-and-bind)

[⬆️ Back to Top](#table-of-contents)

---

### 12. What are higher-order functions?

**Higher-order functions** are functions that either:
1. Take one or more functions as arguments, OR
2. Return a function as their result

They enable **functional programming** patterns and code reusability.

**Functions as Arguments:**
```javascript
// Basic example
function greet(name) {
    return `Hello, ${name}!`;
}

function processUserInput(callback) {
    const name = 'John';
    return callback(name);
}

console.log(processUserInput(greet)); // "Hello, John!"

// Array methods are higher-order functions
const numbers = [1, 2, 3, 4, 5];

// map() takes a function as argument
const doubled = numbers.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter() takes a function as argument
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]

// reduce() takes a function as argument
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15
```

**Functions Returning Functions:**
```javascript
// Function factory
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Practical example: Event handler creator
function createEventHandler(eventType) {
    return function(element, callback) {
        element.addEventListener(eventType, callback);
    };
}

const addClickHandler = createEventHandler('click');
const addHoverHandler = createEventHandler('mouseenter');

// Usage
addClickHandler(button, () => console.log('Clicked!'));
addHoverHandler(div, () => console.log('Hovered!'));
```

**Common Higher-Order Functions:**

**1. Array Methods:**
```javascript
const users = [
    { name: 'Alice', age: 25, active: true },
    { name: 'Bob', age: 30, active: false },
    { name: 'Charlie', age: 35, active: true }
];

// map - transform each element
const names = users.map(user => user.name); // ['Alice', 'Bob', 'Charlie']

// filter - select elements based on condition
const activeUsers = users.filter(user => user.active);

// find - get first matching element
const alice = users.find(user => user.name === 'Alice');

// some - check if any element matches
const hasActiveUsers = users.some(user => user.active); // true

// every - check if all elements match
const allActive = users.every(user => user.active); // false

// sort - sort with custom comparator
const sortedByAge = users.sort((a, b) => a.age - b.age);
```

**2. Custom Higher-Order Functions:**
```javascript
// Retry function
function retry(fn, maxAttempts) {
    return function(...args) {
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw error;
                }
            }
        }
    };
}

// Usage
const unreliableFunction = () => {
    if (Math.random() < 0.7) throw new Error('Failed');
    return 'Success!';
};

const reliableFunction = retry(unreliableFunction, 3);

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Usage
const debouncedSearch = debounce((query) => {
    console.log(`Searching for: ${query}`);
}, 300);

// Memoization
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Usage
const expensiveFunction = (n) => {
    console.log(`Computing for ${n}`);
    return n * n;
};

const memoizedFunction = memoize(expensiveFunction);
console.log(memoizedFunction(5)); // Computing for 5, returns 25
console.log(memoizedFunction(5)); // Returns 25 (from cache)
```

**Function Composition:**
```javascript
// Compose functions together
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

// Individual functions
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Compose them
const composedFunction = compose(square, double, addOne);
console.log(composedFunction(3)); // ((3 + 1) * 2)^2 = 64

// Pipe (left-to-right composition)
function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

const pipedFunction = pipe(addOne, double, square);
console.log(pipedFunction(3)); // ((3 + 1) * 2)^2 = 64
```

**Benefits of Higher-Order Functions:**
1. **Code Reusability**: Write generic functions that work with different behaviors
2. **Abstraction**: Hide complex logic behind simple interfaces
3. **Composition**: Build complex functionality from simple parts
4. **Functional Programming**: Enable declarative programming style

**Related Questions:** [Function Currying](#13-what-is-function-currying), [Array Methods](#objects-and-arrays)

[⬆️ Back to Top](#table-of-contents)

---

### 13. What is function currying?

**Currying** is a functional programming technique that transforms a function with multiple arguments into a sequence of functions, each taking a single argument.

**Basic Concept:**
```javascript
// Regular function
function add(a, b, c) {
    return a + b + c;
}

console.log(add(1, 2, 3)); // 6

// Curried version
function curriedAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Arrow function version
const curriedAddArrow = a => b => c => a + b + c;
console.log(curriedAddArrow(1)(2)(3)); // 6
```

**Manual Currying Examples:**
```javascript
// Multiplication example
function multiply(a, b, c) {
    return a * b * c;
}

// Curried version
function curriedMultiply(a) {
    return function(b) {
        return function(c) {
            return a * b * c;
        };
    };
}

// Partial application
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);

console.log(multiplyBy2And3(4)); // 24
console.log(multiplyBy2(5)(6)); // 60

// String formatting example
function formatString(prefix) {
    return function(suffix) {
        return function(content) {
            return `${prefix}${content}${suffix}`;
        };
    };
}

const addBrackets = formatString('[')(']');
const addParens = formatString('(')(')');

console.log(addBrackets('Hello')); // [Hello]
console.log(addParens('World')); // (World)
```

**Generic Curry Function:**
```javascript
// Curry function that works with any function
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...nextArgs) {
                return curried.apply(this, args.concat(nextArgs));
            };
        }
    };
}

// Usage
function sum(a, b, c, d) {
    return a + b + c + d;
}

const curriedSum = curry(sum);

// All these work:
console.log(curriedSum(1)(2)(3)(4)); // 10
console.log(curriedSum(1, 2)(3)(4)); // 10
console.log(curriedSum(1)(2, 3, 4)); // 10
console.log(curriedSum(1, 2, 3, 4)); // 10
```

**Practical Applications:**

**1. Event Handling:**
```javascript
function addEventListener(element) {
    return function(eventType) {
        return function(handler) {
            element.addEventListener(eventType, handler);
        };
    };
}

const button = document.getElementById('myButton');
const addButtonEvent = addEventListener(button);
const addClickEvent = addButtonEvent('click');

addClickEvent(() => console.log('Button clicked!'));
addClickEvent(() => console.log('Another click handler!'));

// Or chain them
addEventListener(button)('mouseover')(() => console.log('Hovered!'));
```

**2. API Configuration:**
```javascript
function apiCall(baseUrl) {
    return function(endpoint) {
        return function(method) {
            return function(data) {
                return fetch(`${baseUrl}${endpoint}`, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            };
        };
    };
}

// Create specialized functions
const myApi = apiCall('https://api.example.com');
const usersEndpoint = myApi('/users');
const postToUsers = usersEndpoint('POST');

// Use it
postToUsers({ name: 'John', email: 'john@example.com' })
    .then(response => response.json())
    .then(data => console.log(data));

// Or create even more specific functions
const getUsersApi = myApi('/users')('GET');
const createUserApi = myApi('/users')('POST');
const updateUserApi = myApi('/users')('PUT');
```

**3. Validation:**
```javascript
function validate(rule) {
    return function(errorMessage) {
        return function(value) {
            if (rule(value)) {
                return { valid: true, value };
            } else {
                return { valid: false, error: errorMessage };
            }
        };
    };
}

// Create validation rules
const isRequired = validate(val => val !== null && val !== undefined && val !== '');
const isEmail = validate(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
const minLength = min => validate(val => val.length >= min);

// Create specific validators
const requiredField = isRequired('This field is required');
const validEmail = isEmail('Please enter a valid email');
const minPassword = minLength(8)('Password must be at least 8 characters');

// Usage
console.log(requiredField('John')); // { valid: true, value: 'John' }
console.log(validEmail('invalid')); // { valid: false, error: 'Please enter a valid email' }
console.log(minPassword('12345678')); // { valid: true, value: '12345678' }
```

**4. Functional Composition:**
```javascript
const compose = (f, g) => x => f(g(x));
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Curried utility functions
const add = a => b => a + b;
const multiply = a => b => a * b;
const subtract = a => b => a - b;

// Create specialized functions
const add10 = add(10);
const multiplyBy3 = multiply(3);
const subtract5 = subtract(5);

// Compose them
const complexOperation = pipe(
    add10,      // x + 10
    multiplyBy3, // (x + 10) * 3
    subtract5   // ((x + 10) * 3) - 5
);

console.log(complexOperation(5)); // ((5 + 10) * 3) - 5 = 40
```

**Benefits of Currying:**
1. **Partial Application**: Create specialized functions from general ones
2. **Function Composition**: Easier to compose functions together
3. **Code Reusability**: Create configurable, reusable functions
4. **Functional Programming**: Enables point-free programming style

**When to Use Currying:**
- When you frequently call a function with some of the same arguments
- When building configurable functions or APIs
- When working with functional programming patterns
- When you need to create specialized versions of generic functions

**Related Questions:** [Higher-Order Functions](#12-what-are-higher-order-functions), [Function Composition](#advanced-concepts)

[⬆️ Back to Top](#table-of-contents)

---

### 14. What is the difference between `call`, `apply`, and `bind`?

These three methods allow you to **explicitly set the value of `this`** in a function call, but they work differently:

**`call()` - Invoke immediately with individual arguments:**
```javascript
function greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

// call(thisArg, arg1, arg2, ...)
const result = greet.call(person, 'Hello', '!');
console.log(result); // "Hello, I'm Alice!"
```

**`apply()` - Invoke immediately with arguments array:**
```javascript
function greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'Bob' };

// apply(thisArg, [argsArray])
const result = greet.apply(person, ['Hi', '.']);
console.log(result); // "Hi, I'm Bob."

// Useful with arrays
const numbers = [1, 5, 3, 9, 2];
const max = Math.max.apply(null, numbers); // 9
// Modern equivalent: Math.max(...numbers)
```

**`bind()` - Create new function with bound `this`:**
```javascript
function greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'Charlie' };

// bind(thisArg, arg1, arg2, ...) - returns new function
const boundGreet = greet.bind(person);
console.log(boundGreet('Hey', '?')); // "Hey, I'm Charlie?"

// Partial application with bind
const boundGreetWithHello = greet.bind(person, 'Hello');
console.log(boundGreetWithHello('!!!')); // "Hello, I'm Charlie!!!"
```

**Comparison Table:**

| Method | Invocation | Arguments | Returns | Use Case |
|--------|------------|-----------|---------|----------|
| `call` | Immediate | Individual | Function result | Direct function call |
| `apply` | Immediate | Array | Function result | Arguments in array form |
| `bind` | Deferred | Individual | New function | Event handlers, callbacks |

**Practical Examples:**

**1. Borrowing Methods:**
```javascript
const person1 = {
    name: 'John',
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

const person2 = { name: 'Jane' };

// Borrow method from person1 for person2
console.log(person1.greet.call(person2)); // "Hello, I'm Jane"
console.log(person1.greet.apply(person2)); // "Hello, I'm Jane"

const boundGreet = person1.greet.bind(person2);
console.log(boundGreet()); // "Hello, I'm Jane"
```

**2. Array-like Objects:**
```javascript
function showArguments() {
    // arguments is array-like but not a real array
    console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
    
    // Convert to real array using call
    const argsArray = Array.prototype.slice.call(arguments);
    console.log(argsArray); // [1, 2, 3]
    
    // Or using apply
    const argsArray2 = Array.prototype.slice.apply(arguments);
    console.log(argsArray2); // [1, 2, 3]
    
    // Modern way
    const argsArray3 = Array.from(arguments);
    const argsArray4 = [...arguments];
}

showArguments(1, 2, 3);

// NodeList example
const divs = document.querySelectorAll('div');
// divs is NodeList, not Array

// Convert to array to use array methods
const divsArray = Array.prototype.slice.call(divs);
// Or: const divsArray = Array.from(divs);
// Or: const divsArray = [...divs];
```

**3. Event Handlers:**
```javascript
class Button {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        
        // Problem: 'this' will be the DOM element in the handler
        // this.element.addEventListener('click', this.handleClick);
        
        // Solution 1: bind
        this.element.addEventListener('click', this.handleClick.bind(this));
        
        // Solution 2: arrow function (preserves 'this')
        // this.element.addEventListener('click', () => this.handleClick());
    }
    
    handleClick() {
        this.clickCount++;
        console.log(`Clicked ${this.clickCount} times`);
    }
}

// Removing event listeners with bind
class Component {
    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
    }
    
    addListener() {
        document.addEventListener('click', this.boundHandleClick);
    }
    
    removeListener() {
        document.removeEventListener('click', this.boundHandleClick);
    }
    
    handleClick() {
        console.log('Component clicked');
    }
}
```

**4. Function Composition and Partial Application:**
```javascript
// Partial application with bind
function multiply(a, b, c) {
    return a * b * c;
}

const multiplyBy2 = multiply.bind(null, 2);
const multiplyBy2And3 = multiply.bind(null, 2, 3);

console.log(multiplyBy2(5, 6)); // 60
console.log(multiplyBy2And3(4)); // 24

// Creating utility functions
function log(level, message) {
    console.log(`[${level}] ${message}`);
}

const logError = log.bind(null, 'ERROR');
const logWarning = log.bind(null, 'WARNING');
const logInfo = log.bind(null, 'INFO');

logError('Something went wrong'); // [ERROR] Something went wrong
logWarning('Be careful'); // [WARNING] Be careful
logInfo('All good'); // [INFO] All good
```

**5. Constructor Borrowing:**
```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

function Student(name, age, grade) {
    // Borrow Person constructor
    Person.call(this, name, age);
    this.grade = grade;
}

const student = new Student('John', 20, 'A');
console.log(student); // { name: 'John', age: 20, grade: 'A' }

// Modern equivalent with classes
class PersonClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

class StudentClass extends PersonClass {
    constructor(name, age, grade) {
        super(name, age); // calls parent constructor
        this.grade = grade;
    }
}
```

**Performance Considerations:**
```javascript
// bind creates a new function each time
class Component {
    constructor() {
        // ❌ Creates new function on every render
        this.onClick = this.handleClick.bind(this);
    }
    
    render() {
        // ❌ Creates new function on every render
        return `<button onclick="${this.handleClick.bind(this)}">Click</button>`;
    }
    
    handleClick() {
        console.log('Clicked');
    }
}

// ✅ Better approach
class BetterComponent {
    constructor() {
        // ✅ Create bound function once
        this.boundHandleClick = this.handleClick.bind(this);
    }
    
    render() {
        return `<button onclick="${this.boundHandleClick}">Click</button>`;
    }
    
    handleClick() {
        console.log('Clicked');
    }
}
```

**When to Use Each:**
- **`call`**: When you know the exact arguments and want immediate execution
- **`apply`**: When arguments are in an array or you're working with variable arguments
- **`bind`**: When you need a reusable function with a specific `this` context (event handlers, callbacks)

**Related Questions:** [this keyword](#11-what-is-the-this-keyword-and-how-does-it-work), [Arrow Functions](#10-what-are-arrow-functions-and-how-do-they-differ-from-regular-functions)

[⬆️ Back to Top](#table-of-contents)

## Scope and Closures

### 15. What is scope in JavaScript?

**Scope** determines the accessibility and visibility of variables, functions, and objects in different parts of your code during runtime.

**Types of Scope:**

**1. Global Scope:**
```javascript
var globalVar = 'I am global';
let globalLet = 'I am also global';

function testGlobal() {
    console.log(globalVar); // Accessible
}
```

**2. Function Scope:**
```javascript
function functionScope() {
    var functionVar = 'Function scoped';
    console.log(functionVar); // Accessible
}
// console.log(functionVar); // ReferenceError
```

**3. Block Scope (ES6+):**
```javascript
function blockScopeExample() {
    if (true) {
        var blockVar = 'Function scoped'; // var ignores block
        let blockLet = 'Block scoped';
        const blockConst = 'Also block scoped';
    }
    
    console.log(blockVar); // Accessible (var ignores block)
    // console.log(blockLet); // ReferenceError
}
```

**Scope Chain:**
```javascript
const globalVar = 'Global';

function outerFunction() {
    const outerVar = 'Outer';
    
    function innerFunction() {
        const innerVar = 'Inner';
        console.log(innerVar);  // 'Inner'
        console.log(outerVar);  // 'Outer' - from enclosing scope
        console.log(globalVar); // 'Global' - from global scope
    }
    
    innerFunction();
}
```

**Common Issues:**
```javascript
// Loop variable problem with var
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Solution with let
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 100); // 0, 1, 2
}
```

**Related Questions:** [var, let, const](#4-whats-the-difference-between-var-let-and-const), [Closures](#16-what-are-closures-and-why-are-they-important)

[⬆️ Back to Top](#table-of-contents)

---

### 16. What are closures and why are they important?

A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope. In JavaScript, closures are created every time a function is created, at function creation time.

**Basic Example:**
```javascript
function outerFunction(x) {
    const outerVariable = x;
    
    function innerFunction(y) {
        return outerVariable + y; // Access to outer variable
    }
    
    return innerFunction;
}

const closure = outerFunction(10);
console.log(closure(5)); // 15
```

**Practical Applications:**

**1. Data Privacy:**
```javascript
function createCounter() {
    let count = 0; // Private variable
    
    return function() {
        count++;
        return count;
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)
```

**2. Module Pattern:**
```javascript
const Calculator = (function() {
    let result = 0; // Private variable
    
    return {
        add(x) { result += x; return this; },
        subtract(x) { result -= x; return this; },
        getResult() { return result; },
        clear() { result = 0; return this; }
    };
})();

const finalResult = Calculator.add(10).subtract(5).getResult(); // 5
```

**3. Function Factories:**
```javascript
function createMultiplier(multiplier) {
    return function(x) {
        return x * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**Common Pitfall - Loops:**
```javascript
// Problem: All functions reference the same variable
const functions = [];
for (var i = 0; i < 3; i++) {
    functions.push(function() {
        return i; // All closures reference the same 'i'
    });
}
functions.forEach(fn => console.log(fn())); // 3, 3, 3

// Solution: Use let or IIFE
for (let i = 0; i < 3; i++) {
    functions.push(function() {
        return i; // Each closure gets its own 'i'
    });
}
```

**Benefits:**
1. **Data Privacy**: Create private variables
2. **Function Factories**: Generate specialized functions  
3. **Module Pattern**: Organize code
4. **State Preservation**: Maintain state in callbacks

**Related Questions:** [Scope](#15-what-is-scope-in-javascript), [Higher-Order Functions](#12-what-are-higher-order-functions)

[⬆️ Back to Top](#table-of-contents)

---

### 17. What is the difference between global, function, and block scope?

The three main types of scope in JavaScript have different rules for variable accessibility and lifetime:

**Global Scope:**
Variables declared outside any function or block have global scope.

```javascript
// Global scope
var globalVar = 'Global with var';
let globalLet = 'Global with let';
const globalConst = 'Global with const';

// Global variables are accessible everywhere
function anyFunction() {
    console.log(globalVar);   // Accessible
    console.log(globalLet);   // Accessible
    console.log(globalConst); // Accessible
}

// In browsers, var creates properties on window object
console.log(window.globalVar); // 'Global with var'
console.log(window.globalLet); // undefined (let/const don't create window properties)
```

**Function Scope:**
Variables declared inside a function are only accessible within that function.

```javascript
function functionScopeExample() {
    // Function scoped variables
    var functionVar = 'Function scoped var';
    let functionLet = 'Function scoped let';
    const functionConst = 'Function scoped const';
    
    // All are accessible within the function
    console.log(functionVar);   // Works
    console.log(functionLet);   // Works
    console.log(functionConst); // Works
    
    // Nested function can access parent function's variables
    function nestedFunction() {
        console.log(functionVar); // Accessible from parent scope
    }
    
    nestedFunction();
}

functionScopeExample();

// Not accessible outside the function
// console.log(functionVar); // ReferenceError
// console.log(functionLet); // ReferenceError
// console.log(functionConst); // ReferenceError
```

**Block Scope (ES6+):**
Variables declared with `let` and `const` inside a block `{}` are only accessible within that block.

```javascript
function blockScopeExample() {
    // Block scope with if statement
    if (true) {
        var blockVar = 'var ignores block scope';
        let blockLet = 'let respects block scope';
        const blockConst = 'const respects block scope';
        
        console.log(blockVar);   // Accessible
        console.log(blockLet);   // Accessible
        console.log(blockConst); // Accessible
    }
    
    // Outside the block
    console.log(blockVar);   // Accessible (var ignores block)
    // console.log(blockLet);   // ReferenceError
    // console.log(blockConst); // ReferenceError
    
    // Block scope with for loop
    for (let i = 0; i < 3; i++) {
        let loopVar = `Iteration ${i}`;
        console.log(loopVar); // Accessible within loop
    }
    
    // console.log(i);       // ReferenceError (let is block scoped)
    // console.log(loopVar); // ReferenceError
    
    // Compare with var in loop
    for (var j = 0; j < 3; j++) {
        var loopVarVar = `Iteration ${j}`;
    }
    
    console.log(j);          // 3 (var is function scoped)
    console.log(loopVarVar); // 'Iteration 2' (var is function scoped)
}

blockScopeExample();
```

**Scope Comparison Table:**

| Scope Type | Declaration | Accessible From | Hoisted | Creates Window Property |
|------------|-------------|----------------|---------|------------------------|
| **Global** | Outside functions/blocks | Everywhere | Yes | var: Yes, let/const: No |
| **Function** | Inside functions | Within function and nested functions | Yes | N/A |
| **Block** | Inside blocks `{}` | Within block only (let/const) | let/const: TDZ, var: ignores blocks | N/A |

**Practical Examples:**

**1. Loop Scope Issues:**
```javascript
// Problem with var (function scoped)
console.log('--- var in loop ---');
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(`var i: ${i}`); // 3, 3, 3 (all reference same variable)
    }, 100);
}

// Solution with let (block scoped)
console.log('--- let in loop ---');
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(`let i: ${i}`); // 0, 1, 2 (each iteration has own variable)
    }, 100);
}

// Solution with var using IIFE
console.log('--- var with IIFE ---');
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(() => {
            console.log(`IIFE i: ${index}`); // 0, 1, 2
        }, 100);
    })(i);
}
```

**2. Switch Statement Block Scope:**
```javascript
function switchScopeExample(value) {
    switch (value) {
        case 1: {
            let caseVar = 'Case 1';
            console.log(caseVar); // Accessible
            break;
        }
        case 2: {
            let caseVar = 'Case 2'; // Different variable (different block)
            console.log(caseVar); // Accessible
            break;
        }
        default: {
            // console.log(caseVar); // ReferenceError - not accessible
        }
    }
}

switchScopeExample(1);
switchScopeExample(2);
```

**3. Try-Catch Block Scope:**
```javascript
function tryCatchScope() {
    try {
        let tryVar = 'In try block';
        throw new Error('Test error');
    } catch (error) {
        let catchVar = 'In catch block';
        console.log(catchVar); // Accessible
        // console.log(tryVar); // ReferenceError - not accessible
    } finally {
        let finallyVar = 'In finally block';
        console.log(finallyVar); // Accessible
        // console.log(catchVar); // ReferenceError - not accessible
    }
    
    // None of the block variables are accessible here
    // console.log(tryVar);     // ReferenceError
    // console.log(catchVar);   // ReferenceError
    // console.log(finallyVar); // ReferenceError
}

tryCatchScope();
```

**4. Object and Array Destructuring Scope:**
```javascript
function destructuringScope() {
    const obj = { a: 1, b: 2 };
    const arr = [3, 4, 5];
    
    if (true) {
        // Destructuring creates block-scoped variables
        const { a, b } = obj;
        const [first, second] = arr;
        
        console.log(a, b);        // 1, 2 - accessible in block
        console.log(first, second); // 3, 4 - accessible in block
    }
    
    // console.log(a);     // ReferenceError - not accessible outside block
    // console.log(first); // ReferenceError - not accessible outside block
}

destructuringScope();
```

**Best Practices:**
1. **Use `let` and `const`** instead of `var` to avoid scope confusion
2. **Minimize global variables** to avoid pollution and conflicts
3. **Use block scope** to limit variable lifetime and improve readability
4. **Declare variables as close to their usage** as possible
5. **Use IIFE or modules** to create private scope when needed

**Common Mistakes:**
```javascript
// Mistake 1: Accidental global
function accidentalGlobal() {
    myVar = 'I am accidentally global'; // Missing declaration
}
accidentalGlobal();
console.log(myVar); // 'I am accidentally global' - oops!

// Mistake 2: Expecting block scope with var
if (true) {
    var shouldBeBlockScoped = 'But I am not';
}
console.log(shouldBeBlockScoped); // 'But I am not' - var ignores blocks

// Mistake 3: Loop variable confusion
const clickHandlers = [];
for (var i = 0; i < 3; i++) {
    clickHandlers.push(() => console.log(i)); // All will log 3
}
clickHandlers[0](); // 3 (not 0 as expected)
```

**Related Questions:** [var, let, const](#4-whats-the-difference-between-var-let-and-const), [Hoisting](#5-what-is-hoisting-in-javascript), [Closures](#16-what-are-closures-and-why-are-they-important)

[⬆️ Back to Top](#table-of-contents)

---

### 18. What is the temporal dead zone?

The **Temporal Dead Zone (TDZ)** is the period between entering scope and being declared where `let` and `const` variables exist but cannot be accessed.

**Basic Concept:**
```javascript
console.log(typeof myVar);   // 'undefined' - var is hoisted and initialized
console.log(typeof myLet);   // ReferenceError - let is in TDZ
console.log(typeof myConst); // ReferenceError - const is in TDZ

var myVar = 'var variable';
let myLet = 'let variable';
const myConst = 'const variable';
```

**How TDZ Works:**
```javascript
function temporalDeadZoneExample() {
    // TDZ starts here for 'letVar' and 'constVar'
    
    console.log(varVar);    // undefined (hoisted and initialized)
    // console.log(letVar);    // ReferenceError: Cannot access 'letVar' before initialization
    // console.log(constVar);  // ReferenceError: Cannot access 'constVar' before initialization
    
    var varVar = 'var value';
    let letVar = 'let value';     // TDZ ends here for letVar
    const constVar = 'const value'; // TDZ ends here for constVar
    
    console.log(letVar);    // 'let value' - now accessible
    console.log(constVar);  // 'const value' - now accessible
}

temporalDeadZoneExample();
```

**TDZ in Different Contexts:**

**1. Function Parameters:**
```javascript
// TDZ with default parameters
function defaultParamTDZ(a = b, b = 2) {
    return [a, b];
}

// defaultParamTDZ(); // ReferenceError: Cannot access 'b' before initialization

// Correct order
function correctDefaultParam(a = 1, b = a) {
    return [a, b];
}

console.log(correctDefaultParam()); // [1, 1]
```

**2. Block Scope:**
```javascript
function blockTDZ() {
    let x = 'outer';
    
    if (true) {
        // TDZ starts here for inner 'x'
        // console.log(x); // ReferenceError - inner 'x' is in TDZ
        let x = 'inner'; // TDZ ends here
        console.log(x); // 'inner'
    }
    
    console.log(x); // 'outer'
}

blockTDZ();
```

**3. Class Declarations:**
```javascript
// Classes are also subject to TDZ
// const instance = new MyClass(); // ReferenceError

class MyClass {
    constructor(name) {
        this.name = name;
    }
}

const instance = new MyClass('Test'); // Works
```

**4. Import Statements:**
```javascript
// This would cause TDZ error
// console.log(importedFunction()); // ReferenceError

import { importedFunction } from './module.js';

console.log(importedFunction()); // Works after import
```

**TDZ with typeof:**
```javascript
// typeof with undeclared variables
console.log(typeof undeclaredVar); // 'undefined' - safe

// typeof with TDZ variables
// console.log(typeof letInTDZ); // ReferenceError - not safe
let letInTDZ = 'value';

// This is why checking for variable existence changed in ES6
function safeCheck() {
    try {
        return typeof someLetVariable !== 'undefined';
    } catch (e) {
        return false; // Variable is in TDZ or doesn't exist
    }
}
```

**Practical Examples:**

**1. Loop Variables:**
```javascript
// TDZ in for loop
for (let i = 0; i < 3; i++) {
    // Each iteration creates new binding
    setTimeout(() => {
        console.log(i); // 0, 1, 2 - each closure has its own 'i'
    }, 100);
}

// TDZ prevents this common mistake
// for (let i = 0; i < i; i++) { // ReferenceError: Cannot access 'i' before initialization
//     console.log(i);
// }
```

**2. Function Declarations vs Expressions:**
```javascript
// Function declaration - no TDZ
console.log(declaredFunction()); // Works - 'I am declared'

function declaredFunction() {
    return 'I am declared';
}

// Function expression with let/const - TDZ applies
// console.log(expressionFunction()); // ReferenceError

const expressionFunction = function() {
    return 'I am an expression';
};

console.log(expressionFunction()); // Works after declaration
```

**3. Switch Statement TDZ:**
```javascript
function switchTDZ(value) {
    switch (value) {
        case 1:
            // console.log(switchVar); // ReferenceError - TDZ
            let switchVar = 'Case 1';
            console.log(switchVar); // Works
            break;
        case 2:
            // switchVar is still in TDZ here because let is block-scoped
            // console.log(switchVar); // ReferenceError
            switchVar = 'Case 2'; // ReferenceError - cannot assign before declaration
            break;
    }
}

// Better approach with separate blocks
function betterSwitchTDZ(value) {
    switch (value) {
        case 1: {
            let switchVar = 'Case 1';
            console.log(switchVar);
            break;
        }
        case 2: {
            let switchVar = 'Case 2'; // Different variable in different block
            console.log(switchVar);
            break;
        }
    }
}
```

**Why TDZ Exists:**
1. **Catch errors early**: Prevents using variables before they're properly initialized
2. **Consistent behavior**: Makes `let` and `const` behavior more predictable
3. **Avoid confusion**: Prevents the weird `undefined` behavior of `var` hoisting
4. **Better debugging**: Errors occur at the line where variable is accessed, not declared

**TDZ vs Hoisting Comparison:**
```javascript
function hoistingComparison() {
    // var: Hoisted and initialized with undefined
    console.log(varVariable); // undefined
    var varVariable = 'var value';
    
    // let: Hoisted but not initialized (TDZ)
    // console.log(letVariable); // ReferenceError
    let letVariable = 'let value';
    
    // const: Hoisted but not initialized (TDZ)
    // console.log(constVariable); // ReferenceError
    const constVariable = 'const value';
    
    // Function declaration: Fully hoisted
    console.log(hoistedFunction()); // 'I work!'
    
    function hoistedFunction() {
        return 'I work!';
    }
}
```

**Best Practices:**
1. **Declare variables before use** - even though hoisting exists
2. **Use `let` and `const`** instead of `var` for better error catching
3. **Initialize variables at declaration** when possible
4. **Group declarations** at the top of their scope for clarity
5. **Use linters** that catch TDZ violations

**Related Questions:** [var, let, const](#4-whats-the-difference-between-var-let-and-const), [Hoisting](#5-what-is-hoisting-in-javascript), [Block Scope](#17-what-is-the-difference-between-global-function-and-block-scope)

[⬆️ Back to Top](#table-of-contents)

---

### 19. How does variable shadowing work?

**Variable shadowing** occurs when a variable declared in an inner scope has the same name as a variable in an outer scope, effectively "hiding" or "shadowing" the outer variable.

**Basic Example:**
```javascript
let name = 'Global'; // Outer scope

function shadowExample() {
    let name = 'Function'; // Shadows global 'name'
    console.log(name); // 'Function' - inner variable wins
    
    if (true) {
        let name = 'Block'; // Shadows function 'name'
        console.log(name); // 'Block' - innermost variable wins
    }
    
    console.log(name); // 'Function' - back to function scope
}

shadowExample();
console.log(name); // 'Global' - original variable unchanged
```

**Shadowing with Different Declaration Types:**
```javascript
var globalVar = 'Global var';

function mixedShadowing() {
    console.log(globalVar); // 'Global var' - accessible
    
    if (true) {
        var globalVar = 'Shadowed var'; // Shadows global
        let blockLet = 'Block let';
        
        console.log(globalVar); // 'Shadowed var'
        console.log(blockLet);  // 'Block let'
        
        if (true) {
            const globalVar = 'Shadowed const'; // Shadows function var
            const blockLet = 'Nested const';   // Shadows block let
            
            console.log(globalVar); // 'Shadowed const'
            console.log(blockLet);  // 'Nested const'
        }
        
        console.log(globalVar); // 'Shadowed var' - const didn't affect function scope
        console.log(blockLet);  // 'Block let'
    }
    
    console.log(globalVar); // 'Shadowed var' - var is function scoped
}

mixedShadowing();
console.log(globalVar); // 'Global var' - function didn't affect global
```

**Function Parameter Shadowing:**
```javascript
let x = 'Global x';
let y = 'Global y';

function parameterShadowing(x, y) {
    // Parameters shadow global variables
    console.log(x); // Parameter value, not global
    console.log(y); // Parameter value, not global
    
    // Can still create more shadows
    if (true) {
        let x = 'Block x';
        console.log(x); // 'Block x' - shadows parameter
    }
    
    console.log(x); // Back to parameter value
}

parameterShadowing('Param x', 'Param y');
console.log(x); // 'Global x' - unchanged
```

**Shadowing in Loops:**
```javascript
let counter = 'Global counter';

function loopShadowing() {
    console.log(counter); // 'Global counter'
    
    for (let counter = 0; counter < 3; counter++) {
        console.log(`Loop counter: ${counter}`); // 0, 1, 2
        
        if (counter === 1) {
            let counter = 'Nested loop counter';
            console.log(`Nested: ${counter}`); // 'Nested loop counter'
        }
    }
    
    console.log(counter); // 'Global counter'
}

loopShadowing();
```

**Accidental Shadowing:**
```javascript
let config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};

function processData(data) {
    // Accidentally shadowing global config
    let config = validateData(data); // Oops! This shadows global config
    
    // This won't work as expected
    // fetch(config.apiUrl); // TypeError: config.apiUrl is undefined
    
    function validateData(data) {
        return { isValid: true, errors: [] };
    }
}

// Better approach - use different names
function processDataBetter(data) {
    let validationResult = validateData(data);
    
    // Now can access global config
    fetch(config.apiUrl, { timeout: config.timeout });
    
    function validateData(data) {
        return { isValid: true, errors: [] };
    }
}
```

**Intentional Shadowing for Encapsulation:**
```javascript
const DatabaseConnection = (function() {
    let connection = null; // Private variable
    
    return {
        connect(connectionString) {
            // Shadow outer connection intentionally
            let connection = establishConnection(connectionString);
            
            if (connection.isValid) {
                // Update outer connection
                connection = connection;
                return true;
            }
            return false;
            
            function establishConnection(str) {
                return { isValid: true, connectionString: str };
            }
        },
        
        getConnection() {
            return connection;
        }
    };
})();
```

**Shadowing with Arrow Functions:**
```javascript
let value = 'Global';

const outerFunction = () => {
    let value = 'Outer';
    
    const innerFunction = () => {
        let value = 'Inner';
        console.log(value); // 'Inner'
        
        // Arrow functions don't have their own 'arguments'
        // so they don't shadow it
        const showArgs = (...args) => {
            console.log(args); // Rest parameters, not arguments object
        };
        
        showArgs(1, 2, 3);
    };
    
    innerFunction();
    console.log(value); // 'Outer'
};

outerFunction();
console.log(value); // 'Global'
```

**Shadowing with Destructuring:**
```javascript
const user = { name: 'John', age: 30 };
let name = 'Global name';

function destructuringShadowing() {
    console.log(name); // 'Global name'
    
    // Destructuring creates new variables that shadow
    const { name, age } = user;
    console.log(name); // 'John' - shadows global name
    console.log(age);  // 30
    
    if (true) {
        // Can shadow destructured variables too
        const name = 'Block name';
        console.log(name); // 'Block name'
    }
    
    console.log(name); // 'John' - back to destructured value
}

destructuringShadowing();
console.log(name); // 'Global name' - unchanged
```

**Shadowing Best Practices:**

**1. Avoid Accidental Shadowing:**
```javascript
// Bad - accidental shadowing
let data = 'Important global data';

function processItems(items) {
    let data = items.map(item => item.value); // Accidentally shadows global
    
    // Later in function, expecting global data
    // console.log(data.length); // Error if global data doesn't have length
}

// Good - use descriptive names
function processItemsBetter(items) {
    let processedData = items.map(item => item.value);
    
    // Can still access global data
    console.log(data); // 'Important global data'
}
```

**2. Use Linting Rules:**
```javascript
// ESLint rule: no-shadow
// This would be flagged by linter
function shadowingWarning() {
    let x = 1;
    
    if (true) {
        let x = 2; // ESLint warning: 'x' is already declared in the upper scope
        console.log(x);
    }
}
```

**3. Intentional Shadowing for Privacy:**
```javascript
const Module = (function() {
    let privateVar = 'Private';
    
    return {
        publicMethod() {
            // Intentionally shadow to create local scope
            let privateVar = 'Local private';
            
            function helperFunction() {
                // This privateVar is the local one
                console.log(privateVar); // 'Local private'
            }
            
            helperFunction();
            
            // Can still access outer private if needed
            console.log(privateVar); // Still 'Local private' due to shadowing
        }
    };
})();
```

**Common Pitfalls:**
1. **Unintended behavior** when expecting outer variable
2. **Debugging confusion** when wrong variable is accessed
3. **Code maintenance issues** when shadowed variables are renamed
4. **Performance implications** in some JavaScript engines

**Benefits of Understanding Shadowing:**
1. **Better debugging** - know which variable is being accessed
2. **Intentional encapsulation** - create private scopes
3. **Avoid naming conflicts** - understand scope resolution
4. **Code clarity** - write more predictable code

**Related Questions:** [Scope](#15-what-is-scope-in-javascript), [var, let, const](#4-whats-the-difference-between-var-let-and-const), [Closures](#16-what-are-closures-and-why-are-they-important)

[⬆️ Back to Top](#table-of-contents)

## Objects and Arrays

### 20. How do you create and manipulate objects in JavaScript?

JavaScript provides multiple ways to create and manipulate objects:

**Object Creation Methods:**

**1. Object Literal (Most Common):**
```javascript
const person = {
    name: 'John',
    age: 30,
    greet() { return `Hello, I'm ${this.name}`; }
};

// Computed property names
const prop = 'dynamicProperty';
const obj = {
    [prop]: 'dynamic value',
    [`${prop}2`]: 'another value'
};
```

**2. Object Constructor:**
```javascript
const person = new Object();
person.name = 'John';
person.age = 30;

// Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const john = new Person('John', 30);
```

**3. Object.create():**
```javascript
const personPrototype = {
    greet() { return `Hello, I'm ${this.name}`; }
};

const person = Object.create(personPrototype);
person.name = 'John';
```

**Object Manipulation:**

**Adding/Modifying Properties:**
```javascript
const obj = {};

// Dot and bracket notation
obj.name = 'John';
obj['age'] = 30;

// Object.assign
Object.assign(obj, { city: 'NYC', country: 'USA' });

// Spread operator
const updated = { ...obj, age: 31, job: 'Developer' };
```

**Property Access:**
```javascript
// Safe access with optional chaining
console.log(person.address?.street);

// Default values
const city = person.city || 'Unknown';
const country = person.country ?? 'Unknown';
```

**Object Iteration:**
```javascript
const person = { name: 'John', age: 30 };

// Object.keys(), Object.values(), Object.entries()
Object.keys(person).forEach(key => console.log(key));
Object.values(person).forEach(value => console.log(value));
Object.entries(person).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});
```

**Related Questions:** [Destructuring](#24-what-is-destructuring-assignment), [Spread Operator](#25-what-is-the-spread-operator-and-rest-parameters)

[⬆️ Back to Top](#table-of-contents)

---

### 21. What are the most common array methods?

JavaScript arrays come with many built-in methods for manipulation and iteration:

**Mutating Methods (Modify Original Array):**

**Adding/Removing Elements:**
```javascript
const fruits = ['apple', 'banana'];

// push/pop - end of array
fruits.push('orange'); // ['apple', 'banana', 'orange']
const last = fruits.pop(); // 'orange'

// unshift/shift - beginning of array  
fruits.unshift('mango'); // ['mango', 'apple', 'banana']
const first = fruits.shift(); // 'mango'

// splice - remove/insert anywhere
fruits.splice(1, 1, 'grape', 'kiwi'); // Remove 1, add 2 at index 1
```

**Non-Mutating Methods:**

**Transformation:**
```javascript
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - select elements
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]

// reduce - aggregate to single value
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15
```

**Search Methods:**
```javascript
const fruits = ['apple', 'banana', 'orange'];

// find/findIndex - first match
const found = fruits.find(f => f.startsWith('b')); // 'banana'
const index = fruits.findIndex(f => f.startsWith('b')); // 1

// includes - check existence
console.log(fruits.includes('apple')); // true

// indexOf/lastIndexOf - get index
console.log(fruits.indexOf('banana')); // 1
```

**Testing Methods:**
```javascript
const numbers = [2, 4, 6, 8];

// every - all elements pass test
console.log(numbers.every(x => x % 2 === 0)); // true

// some - at least one passes test
console.log(numbers.some(x => x > 5)); // true
```

**Array Utilities:**
```javascript
// slice - extract portion
const slice = numbers.slice(1, 3); // [2, 3] (from index 1 to 3)

// concat - join arrays
const combined = [1, 2].concat([3, 4]); // [1, 2, 3, 4]

// join - convert to string
const str = ['Hello', 'World'].join(' '); // 'Hello World'

// flat - flatten nested arrays
const nested = [1, [2, 3], [4, 5]];
const flattened = nested.flat(); // [1, 2, 3, 4, 5]
```

**Practical Examples:**
```javascript
// Method chaining
const result = [1, 2, 3, 4, 5, 6]
    .filter(x => x % 2 === 0)  // [2, 4, 6]
    .map(x => x * x)           // [4, 16, 36]
    .reduce((sum, x) => sum + x, 0); // 56

// Remove duplicates
const unique = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]
```

**Related Questions:** [Higher-Order Functions](#12-what-are-higher-order-functions), [Spread Operator](#25-what-is-the-spread-operator-and-rest-parameters)

[⬆️ Back to Top](#table-of-contents)

---

### 22. What is the difference between shallow copy and deep copy?

**Shallow Copy** creates a new object but inserts references to the objects found in the original. **Deep Copy** creates a new object and recursively copies all nested objects.

**Shallow Copy:**
```javascript
const original = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA'
    },
    hobbies: ['reading', 'swimming']
};

// Shallow copy methods
const shallow1 = { ...original };
const shallow2 = Object.assign({}, original);
const shallow3 = Object.create(original);

// Modifying nested objects affects original
shallow1.address.city = 'Boston';
console.log(original.address.city); // 'Boston' - original changed!

shallow1.hobbies.push('cycling');
console.log(original.hobbies); // ['reading', 'swimming', 'cycling']

// But primitive values are independent
shallow1.name = 'Jane';
console.log(original.name); // 'John' - original unchanged
```

**Deep Copy Methods:**

**1. JSON.parse(JSON.stringify()) - Simple but Limited:**
```javascript
const original = {
    name: 'John',
    age: 30,
    address: { city: 'NYC' },
    hobbies: ['reading']
};

const deepCopy = JSON.parse(JSON.stringify(original));

deepCopy.address.city = 'Boston';
console.log(original.address.city); // 'NYC' - original unchanged

// Limitations:
const problematic = {
    date: new Date(),
    func: () => 'hello',
    undef: undefined,
    symbol: Symbol('test'),
    regex: /test/g
};

const copied = JSON.parse(JSON.stringify(problematic));
console.log(copied);
// {
//   date: "2023-01-01T00:00:00.000Z", // becomes string
//   // func: missing (functions are ignored)
//   // undef: missing (undefined is ignored)
//   // symbol: missing (symbols are ignored)
//   regex: {} // becomes empty object
// }
```

**2. structuredClone() - Modern Native Method (ES2022):**
```javascript
const original = {
    name: 'John',
    date: new Date(),
    regex: /test/g,
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3]),
    buffer: new ArrayBuffer(8)
};

const deepCopy = structuredClone(original);

// Works with most built-in types
deepCopy.date.setFullYear(2024);
console.log(original.date.getFullYear()); // Original year unchanged

// Limitations: functions, symbols, DOM nodes not supported
```

**3. Custom Deep Copy Function:**
```javascript
function deepCopy(obj, visited = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    
    // Handle Arrays
    if (Array.isArray(obj)) {
        const copy = [];
        visited.set(obj, copy);
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i], visited);
        }
        return copy;
    }
    
    // Handle Objects
    const copy = {};
    visited.set(obj, copy);
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key], visited);
        }
    }
    
    return copy;
}

// Usage
const original = {
    name: 'John',
    date: new Date(),
    nested: { value: 42 }
};

const copy = deepCopy(original);
copy.nested.value = 100;
console.log(original.nested.value); // 42 - unchanged
```

**4. Using Lodash:**
```javascript
const _ = require('lodash');

const original = {
    name: 'John',
    address: { city: 'NYC' },
    hobbies: ['reading']
};

const deepCopy = _.cloneDeep(original);
deepCopy.address.city = 'Boston';
console.log(original.address.city); // 'NYC' - unchanged
```

**Array Copying:**
```javascript
const originalArray = [1, [2, 3], { a: 4 }];

// Shallow copy methods
const shallow1 = [...originalArray];
const shallow2 = originalArray.slice();
const shallow3 = Array.from(originalArray);

// Deep copy methods
const deep1 = JSON.parse(JSON.stringify(originalArray));
const deep2 = structuredClone(originalArray);

// Test shallow copy
shallow1[1][0] = 999;
console.log(originalArray[1][0]); // 999 - original changed

// Test deep copy
deep1[1][0] = 888;
console.log(originalArray[1][0]); // Still 999 - original unchanged
```

**Performance Comparison:**
```javascript
const largeObject = {
    // ... large nested object
};

console.time('JSON method');
const copy1 = JSON.parse(JSON.stringify(largeObject));
console.timeEnd('JSON method');

console.time('structuredClone');
const copy2 = structuredClone(largeObject);
console.timeEnd('structuredClone');

console.time('custom deep copy');
const copy3 = deepCopy(largeObject);
console.timeEnd('custom deep copy');
```

**When to Use Each:**

**Shallow Copy:**
- When you only need to copy the top-level properties
- When nested objects are immutable
- For performance reasons with large objects
- When you want to preserve references to shared objects

**Deep Copy:**
- When you need complete independence from the original
- When dealing with nested mutable objects
- When implementing undo/redo functionality
- When creating templates or default configurations

**Best Practices:**
1. Use `structuredClone()` for modern browsers
2. Use `JSON.parse(JSON.stringify())` for simple objects
3. Use libraries like Lodash for complex scenarios
4. Be aware of performance implications with large objects
5. Consider immutable data structures for frequent copying

**Related Questions:** [Object Cloning](#23-how-do-you-clone-an-object-in-javascript), [Spread Operator](#25-what-is-the-spread-operator-and-rest-parameters)

[⬆️ Back to Top](#table-of-contents)

---

### 23. How do you clone an object in JavaScript?

Object cloning can be **shallow** (copying only the first level) or **deep** (copying all nested levels). Here are the most common methods:

**Shallow Cloning Methods:**

**1. Spread Operator (ES2018) - Recommended:**
```javascript
const original = { name: 'John', age: 30, city: 'NYC' };
const clone = { ...original };

clone.name = 'Jane';
console.log(original.name); // 'John' - unchanged
```

**2. Object.assign():**
```javascript
const original = { name: 'John', age: 30 };
const clone = Object.assign({}, original);

// Can also merge multiple objects
const clone2 = Object.assign({}, original, { country: 'USA' });
```

**3. Object.create() with Property Descriptors:**
```javascript
const original = { name: 'John', age: 30 };
const clone = Object.create(
    Object.getPrototypeOf(original),
    Object.getOwnPropertyDescriptors(original)
);
```

**Deep Cloning Methods:**

**1. structuredClone() - Modern Native (ES2022):**
```javascript
const original = {
    name: 'John',
    address: { city: 'NYC', zip: 10001 },
    hobbies: ['reading', 'swimming'],
    date: new Date(),
    regex: /test/gi
};

const deepClone = structuredClone(original);
deepClone.address.city = 'Boston';
console.log(original.address.city); // 'NYC' - unchanged

// Supports most built-in types
console.log(deepClone.date instanceof Date); // true
console.log(deepClone.regex instanceof RegExp); // true
```

**2. JSON Methods - Simple but Limited:**
```javascript
const original = {
    name: 'John',
    address: { city: 'NYC' },
    numbers: [1, 2, 3]
};

const deepClone = JSON.parse(JSON.stringify(original));

// Limitations - these will be lost or changed:
const problematic = {
    func: () => 'hello',        // Functions ignored
    undef: undefined,           // undefined ignored  
    symbol: Symbol('test'),     // Symbols ignored
    date: new Date(),          // Becomes string
    regex: /test/g,            // Becomes {}
    infinity: Infinity,        // Becomes null
    nan: NaN                   // Becomes null
};
```

**3. Custom Deep Clone Function:**
```javascript
function deepClone(obj, visited = new WeakMap()) {
    // Handle null and primitives
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    
    // Handle built-in object types
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Map) {
        const clonedMap = new Map();
        visited.set(obj, clonedMap);
        for (const [key, value] of obj) {
            clonedMap.set(deepClone(key, visited), deepClone(value, visited));
        }
        return clonedMap;
    }
    if (obj instanceof Set) {
        const clonedSet = new Set();
        visited.set(obj, clonedSet);
        for (const value of obj) {
            clonedSet.add(deepClone(value, visited));
        }
        return clonedSet;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
        const clonedArray = [];
        visited.set(obj, clonedArray);
        for (let i = 0; i < obj.length; i++) {
            clonedArray[i] = deepClone(obj[i], visited);
        }
        return clonedArray;
    }
    
    // Handle plain objects
    const clonedObj = {};
    visited.set(obj, clonedObj);
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key], visited);
        }
    }
    
    return clonedObj;
}
```

**Specialized Cloning Scenarios:**

**1. Array Cloning:**
```javascript
const originalArray = [1, 2, [3, 4], { a: 5 }];

// Shallow cloning
const shallow1 = [...originalArray];
const shallow2 = originalArray.slice();
const shallow3 = Array.from(originalArray);

// Deep cloning
const deep1 = structuredClone(originalArray);
const deep2 = JSON.parse(JSON.stringify(originalArray));
```

**2. Function Cloning (Advanced):**
```javascript
function cloneFunction(fn) {
    // For named functions
    if (fn.name) {
        return eval(`(${fn.toString()})`);
    }
    
    // For anonymous functions
    return new Function('return ' + fn.toString())();
}

const original = function multiply(a, b) { return a * b; };
const cloned = cloneFunction(original);
console.log(cloned(3, 4)); // 12
```

**3. Class Instance Cloning:**
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

function cloneInstance(instance) {
    const cloned = Object.create(Object.getPrototypeOf(instance));
    return Object.assign(cloned, instance);
}

const john = new Person('John', 30);
const johnClone = cloneInstance(john);
console.log(johnClone.greet()); // "Hello, I'm John"
```

**Performance Considerations:**
```javascript
const testObject = {
    // Large nested object for testing
    data: Array.from({length: 1000}, (_, i) => ({
        id: i,
        nested: { value: i * 2 }
    }))
};

// Benchmark different methods
console.time('Spread (shallow)');
const spread = { ...testObject };
console.timeEnd('Spread (shallow)');

console.time('JSON method');
const jsonClone = JSON.parse(JSON.stringify(testObject));
console.timeEnd('JSON method');

console.time('structuredClone');
const structuredClone = structuredClone(testObject);
console.timeEnd('structuredClone');
```

**Library Solutions:**
```javascript
// Lodash
const _ = require('lodash');
const deepClone = _.cloneDeep(original);

// Ramda
const R = require('ramda');
const clone = R.clone(original); // shallow
const deepClone2 = R.clone(original); // Ramda's clone is actually deep
```

**Choosing the Right Method:**

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| `{...obj}` | Simple shallow copy | Fast, readable | Only shallow |
| `Object.assign()` | Shallow with merge | Can merge objects | Only shallow |
| `JSON.parse(JSON.stringify())` | Simple deep copy | Works everywhere | Limited types |
| `structuredClone()` | Modern deep copy | Handles most types | New API |
| Custom function | Complex requirements | Full control | More code |
| Libraries | Production apps | Battle-tested | Extra dependency |

**Best Practices:**
1. Use spread operator for shallow copying
2. Use `structuredClone()` for deep copying in modern environments
3. Be aware of the limitations of JSON methods
4. Consider performance implications for large objects
5. Handle circular references in custom implementations
6. Use libraries for complex production scenarios

**Related Questions:** [Shallow vs Deep Copy](#22-what-is-the-difference-between-shallow-copy-and-deep-copy), [Spread Operator](#25-what-is-the-spread-operator-and-rest-parameters)

[⬆️ Back to Top](#table-of-contents)

---

### 24. What is destructuring assignment?

**Destructuring assignment** is a JavaScript expression that makes it possible to unpack values from arrays or properties from objects into distinct variables.

**Array Destructuring:**

**Basic Array Destructuring:**
```javascript
const numbers = [1, 2, 3, 4, 5];

// Traditional way
const first = numbers[0];
const second = numbers[1];

// Destructuring way
const [a, b, c] = numbers;
console.log(a, b, c); // 1, 2, 3

// Skip elements
const [first, , third] = numbers;
console.log(first, third); // 1, 3

// Rest elements
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

**Object Destructuring:**

**Basic Object Destructuring:**
```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'New York',
    country: 'USA'
};

// Traditional way
const name = person.name;
const age = person.age;

// Destructuring way
const { name, age, city } = person;
console.log(name, age, city); // 'John', 30, 'New York'

// Rename variables
const { name: fullName, age: years } = person;
console.log(fullName, years); // 'John', 30

// Default values
const { name, profession = 'Unknown' } = person;
console.log(profession); // 'Unknown'
```

**Advanced Destructuring Patterns:**

**1. Nested Destructuring:**
```javascript
const user = {
    id: 1,
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York',
        coordinates: {
            lat: 40.7128,
            lng: -74.0060
        }
    },
    hobbies: ['reading', 'swimming', 'coding']
};

// Nested object destructuring
const {
    name,
    address: {
        city,
        coordinates: { lat, lng }
    },
    hobbies: [firstHobby, secondHobby]
} = user;

console.log(name);        // 'John'
console.log(city);        // 'New York'
console.log(lat, lng);    // 40.7128, -74.0060
console.log(firstHobby);  // 'reading'
```

**2. Function Parameter Destructuring:**
```javascript
// Object parameter destructuring
function greetUser({ name, age, city = 'Unknown' }) {
    return `Hello ${name}, you are ${age} years old from ${city}`;
}

const user = { name: 'John', age: 30 };
console.log(greetUser(user)); // "Hello John, you are 30 years old from Unknown"

// Array parameter destructuring
function calculateTotal([price, tax, discount = 0]) {
    return price + tax - discount;
}

console.log(calculateTotal([100, 10, 5])); // 105

// Mixed destructuring
function processOrder({ items: [firstItem], customer: { name } }) {
    return `Processing ${firstItem} for ${name}`;
}

const order = {
    items: ['laptop', 'mouse'],
    customer: { name: 'John', email: 'john@example.com' }
};

console.log(processOrder(order)); // "Processing laptop for John"
```

**3. Swapping Variables:**
```javascript
let a = 1;
let b = 2;

// Traditional swap
let temp = a;
a = b;
b = temp;

// Destructuring swap
[a, b] = [b, a];
console.log(a, b); // 2, 1

// Multiple variable swap
let x = 1, y = 2, z = 3;
[x, y, z] = [z, x, y];
console.log(x, y, z); // 3, 1, 2
```

**4. Extracting Multiple Values from Functions:**
```javascript
function getCoordinates() {
    return [40.7128, -74.0060];
}

function getUserInfo() {
    return {
        name: 'John',
        age: 30,
        email: 'john@example.com'
    };
}

// Array destructuring from function return
const [latitude, longitude] = getCoordinates();

// Object destructuring from function return
const { name, email } = getUserInfo();
```

**5. Rest Pattern in Destructuring:**
```javascript
// Array rest
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Object rest
const person = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA',
    profession: 'Developer'
};

const { name, age, ...otherInfo } = person;
console.log(name, age);    // 'John', 30
console.log(otherInfo);    // { city: 'NYC', country: 'USA', profession: 'Developer' }
```

**Practical Use Cases:**

**1. API Response Handling:**
```javascript
// Typical API response
const apiResponse = {
    data: {
        users: [
            { id: 1, name: 'John', email: 'john@example.com' },
            { id: 2, name: 'Jane', email: 'jane@example.com' }
        ]
    },
    status: 'success',
    message: 'Data retrieved successfully'
};

// Extract what you need
const {
    data: { users },
    status,
    message
} = apiResponse;

// Process first user
const [{ name: firstName, email: firstEmail }] = users;
console.log(firstName, firstEmail); // 'John', 'john@example.com'
```

**2. Configuration Objects:**
```javascript
function createServer(options = {}) {
    const {
        port = 3000,
        host = 'localhost',
        ssl = false,
        middleware = [],
        routes = {}
    } = options;
    
    console.log(`Server starting on ${host}:${port}`);
    console.log(`SSL: ${ssl ? 'enabled' : 'disabled'}`);
    
    return { port, host, ssl, middleware, routes };
}

// Usage
const server = createServer({
    port: 8080,
    ssl: true
});
```

**3. Module Imports:**
```javascript
// ES6 modules
import { useState, useEffect, useCallback } from 'react';
import { map, filter, reduce } from 'lodash';

// CommonJS
const { readFile, writeFile } = require('fs').promises;
const { join, resolve } = require('path');
```

**4. Event Handling:**
```javascript
// DOM event destructuring
document.addEventListener('click', ({ target, clientX, clientY }) => {
    console.log(`Clicked on ${target.tagName} at (${clientX}, ${clientY})`);
});

// Custom event data
function handleUserAction({ type, payload: { userId, action } }) {
    console.log(`User ${userId} performed ${action} of type ${type}`);
}

const eventData = {
    type: 'USER_ACTION',
    payload: {
        userId: 123,
        action: 'login'
    }
};

handleUserAction(eventData);
```

**5. Array Processing:**
```javascript
const users = [
    ['John', 'Doe', 30],
    ['Jane', 'Smith', 25],
    ['Bob', 'Johnson', 35]
];

// Process each user
users.forEach(([firstName, lastName, age]) => {
    console.log(`${firstName} ${lastName} is ${age} years old`);
});

// Transform data
const userObjects = users.map(([firstName, lastName, age]) => ({
    firstName,
    lastName,
    age,
    fullName: `${firstName} ${lastName}`
}));
```

**Common Patterns and Tricks:**

**1. Computed Property Names:**
```javascript
const key = 'dynamicKey';
const obj = {
    [key]: 'value',
    staticKey: 'static'
};

const { [key]: dynamicValue, staticKey } = obj;
console.log(dynamicValue); // 'value'
```

**2. Conditional Destructuring:**
```javascript
const data = { name: 'John', age: 30 };

// Only destructure if object exists
const { name, age } = data || {};

// With default object
function processUser(user = {}) {
    const { name = 'Anonymous', age = 0 } = user;
    return `${name} (${age})`;
}
```

**3. Aliasing with Defaults:**
```javascript
const config = {
    api: {
        baseUrl: 'https://api.example.com'
    }
};

const {
    api: { baseUrl: apiUrl = 'http://localhost:3000' } = {},
    timeout = 5000
} = config;

console.log(apiUrl);  // 'https://api.example.com'
console.log(timeout); // 5000
```

**Best Practices:**
1. Use destructuring for cleaner, more readable code
2. Provide default values to prevent undefined errors
3. Use meaningful variable names when aliasing
4. Don't over-nest destructuring (keep it readable)
5. Use rest patterns to collect remaining properties
6. Combine with other ES6+ features for powerful patterns

**Related Questions:** [Spread Operator](#25-what-is-the-spread-operator-and-rest-parameters), [Object Manipulation](#20-how-do-you-create-and-manipulate-objects-in-javascript)

[⬆️ Back to Top](#table-of-contents)

---

### 25. What is the spread operator and rest parameters?

The **spread operator (`...`)** and **rest parameters** use the same syntax but serve opposite purposes: spread expands elements, while rest collects them.

**Spread Operator:**

**1. Array Spreading:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Insert elements
const inserted = [...arr1, 'middle', ...arr2];
console.log(inserted); // [1, 2, 3, 'middle', 4, 5, 6]

// Copy array (shallow)
const copy = [...arr1];
copy.push(4);
console.log(arr1); // [1, 2, 3] - original unchanged

// Convert string to array
const letters = [...'hello'];
console.log(letters); // ['h', 'e', 'l', 'l', 'o']

// Find max/min
const numbers = [1, 5, 3, 9, 2];
const max = Math.max(...numbers);
const min = Math.min(...numbers);
console.log(max, min); // 9, 1
```

**2. Object Spreading:**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combine objects
const combined = { ...obj1, ...obj2 };
console.log(combined); // { a: 1, b: 2, c: 3, d: 4 }

// Override properties
const overridden = { ...obj1, b: 'new value', e: 5 };
console.log(overridden); // { a: 1, b: 'new value', e: 5 }

// Copy object (shallow)
const copy = { ...obj1 };
copy.a = 10;
console.log(obj1.a); // 1 - original unchanged

// Conditional properties
const includeOptional = true;
const result = {
    required: 'value',
    ...(includeOptional && { optional: 'included' })
};
console.log(result); // { required: 'value', optional: 'included' }
```

**3. Function Call Spreading:**
```javascript
function sum(a, b, c) {
    return a + b + c;
}

const numbers = [1, 2, 3];

// Traditional way
const result1 = sum.apply(null, numbers);

// Spread way
const result2 = sum(...numbers);
console.log(result2); // 6

// With mixed arguments
const result3 = sum(...numbers.slice(0, 2), 10);
console.log(result3); // 1 + 2 + 10 = 13
```

**Rest Parameters:**

**1. Function Rest Parameters:**
```javascript
// Collect remaining parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum(10, 20));         // 30
console.log(sum());               // 0

// Mixed parameters
function greet(greeting, ...names) {
    return `${greeting} ${names.join(', ')}!`;
}

console.log(greet('Hello', 'John', 'Jane', 'Bob')); 
// "Hello John, Jane, Bob!"

// Rest must be last parameter
function invalidFunction(...rest, last) {} // SyntaxError
```

**2. Array Rest in Destructuring:**
```javascript
const numbers = [1, 2, 3, 4, 5];

// Collect remaining elements
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Skip elements
const [, , ...remaining] = numbers;
console.log(remaining); // [3, 4, 5]

// Empty rest
const [a, b, c, d, e, ...empty] = numbers;
console.log(empty); // []
```

**3. Object Rest in Destructuring:**
```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA',
    profession: 'Developer'
};

// Collect remaining properties
const { name, age, ...otherInfo } = person;
console.log(name, age);    // 'John', 30
console.log(otherInfo);    // { city: 'NYC', country: 'USA', profession: 'Developer' }

// Exclude specific properties
const { profession, ...personalInfo } = person;
console.log(personalInfo); // { name: 'John', age: 30, city: 'NYC', country: 'USA' }
```

**Practical Applications:**

**1. Function Overloading Pattern:**
```javascript
function createUser(name, ...options) {
    const [age, email, role = 'user'] = options;
    
    return {
        name,
        age: age || null,
        email: email || null,
        role
    };
}

// Different ways to call
console.log(createUser('John'));                    // Basic user
console.log(createUser('Jane', 25));                // With age
console.log(createUser('Bob', 30, 'bob@example.com')); // With age and email
console.log(createUser('Alice', 28, 'alice@example.com', 'admin')); // Full info
```

**2. Array Manipulation:**
```javascript
const originalArray = [1, 2, 3];

// Add elements immutably
const addToStart = [0, ...originalArray];
const addToEnd = [...originalArray, 4];
const addToMiddle = [...originalArray.slice(0, 2), 2.5, ...originalArray.slice(2)];

console.log(addToStart);  // [0, 1, 2, 3]
console.log(addToEnd);    // [1, 2, 3, 4]
console.log(addToMiddle); // [1, 2, 2.5, 3]

// Remove duplicates
const withDuplicates = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(withDuplicates)];
console.log(unique); // [1, 2, 3, 4]

// Flatten one level
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = [].concat(...nested);
console.log(flattened); // [1, 2, 3, 4, 5, 6]
```

**3. Object Updates (Immutable):**
```javascript
const user = {
    id: 1,
    name: 'John',
    settings: {
        theme: 'dark',
        notifications: true
    }
};

// Update top-level property
const updatedUser = {
    ...user,
    name: 'John Doe',
    lastLogin: new Date()
};

// Update nested property (careful - need deep spread)
const updatedSettings = {
    ...user,
    settings: {
        ...user.settings,
        theme: 'light'
    }
};

// Remove property
const { settings, ...userWithoutSettings } = user;
console.log(userWithoutSettings); // { id: 1, name: 'John' }
```

**4. Component Props (React-style):**
```javascript
function Button({ children, className, ...otherProps }) {
    return {
        type: 'button',
        className: `btn ${className || ''}`,
        children,
        ...otherProps // Pass through all other props
    };
}

// Usage
const buttonProps = Button({
    children: 'Click me',
    className: 'primary',
    onClick: () => console.log('clicked'),
    disabled: false,
    'data-testid': 'submit-button'
});
```

**5. API Data Processing:**
```javascript
function processApiResponse(response) {
    const { data, meta, ...otherFields } = response;
    
    return {
        items: data || [],
        pagination: meta?.pagination || {},
        additionalInfo: otherFields
    };
}

// Transform user data
function transformUsers(users) {
    return users.map(({ password, ...safeUser }) => ({
        ...safeUser,
        displayName: `${safeUser.firstName} ${safeUser.lastName}`
    }));
}
```

**Advanced Patterns:**

**1. Conditional Spreading:**
```javascript
const baseConfig = { host: 'localhost', port: 3000 };
const isDevelopment = true;

const config = {
    ...baseConfig,
    ...(isDevelopment && { debug: true, verbose: true }),
    ...(process.env.SSL && { ssl: true, port: 443 })
};
```

**2. Function Composition:**
```javascript
const pipe = (...functions) => (value) => 
    functions.reduce((acc, fn) => fn(acc), value);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = pipe(addOne, double, square);
console.log(transform(3)); // ((3 + 1) * 2)^2 = 64
```

**3. Dynamic Object Creation:**
```javascript
function createObject(keys, values) {
    return keys.reduce((obj, key, index) => ({
        ...obj,
        [key]: values[index]
    }), {});
}

const keys = ['name', 'age', 'city'];
const values = ['John', 30, 'NYC'];
const person = createObject(keys, values);
console.log(person); // { name: 'John', age: 30, city: 'NYC' }
```

**Performance Considerations:**
```javascript
// Spread creates new objects/arrays - consider performance
const largeArray = Array.from({length: 100000}, (_, i) => i);

console.time('spread');
const spreadCopy = [...largeArray];
console.timeEnd('spread');

console.time('slice');
const sliceCopy = largeArray.slice();
console.timeEnd('slice');

// For objects, spread is generally fast for shallow copying
const largeObject = Object.fromEntries(
    Array.from({length: 1000}, (_, i) => [`key${i}`, i])
);

console.time('object spread');
const objectCopy = { ...largeObject };
console.timeEnd('object spread');
```

**Best Practices:**
1. Use spread for immutable updates
2. Use rest parameters for flexible function signatures
3. Be careful with nested objects - spread is shallow
4. Use meaningful names for rest parameters
5. Consider performance with very large data structures
6. Combine with destructuring for powerful patterns

**Related Questions:** [Destructuring](#24-what-is-destructuring-assignment), [Array Methods](#21-what-are-the-most-common-array-methods), [Object Manipulation](#20-how-do-you-create-and-manipulate-objects-in-javascript)

[⬆️ Back to Top](#table-of-contents)

## Prototypes and Inheritance

### 26. What are prototypes in JavaScript?

**Prototypes** are the mechanism by which JavaScript objects inherit features from one another. Every object in JavaScript has a prototype, which is another object that the original object inherits properties and methods from.

**Understanding Prototypes:**

**1. Every Object Has a Prototype:**
```javascript
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(obj)); // Object.prototype (preferred method)

// Functions have Function.prototype
function myFunc() {}
console.log(myFunc.__proto__); // Function.prototype

// Arrays have Array.prototype
const arr = [];
console.log(arr.__proto__); // Array.prototype
```

**2. Prototype Chain:**
```javascript
const person = {
    name: 'John',
    age: 30
};

// person inherits from Object.prototype
console.log(person.toString()); // "[object Object]" - inherited method
console.log(person.hasOwnProperty('name')); // true - inherited method

// The chain: person -> Object.prototype -> null
console.log(Object.getPrototypeOf(person) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

**3. Function Prototypes:**
```javascript
function Person(name) {
    this.name = name;
}

// Functions have a special 'prototype' property
console.log(Person.prototype); // Person.prototype object
console.log(typeof Person.prototype); // "object"

// This prototype is used when creating instances with 'new'
const john = new Person('John');
console.log(john.__proto__ === Person.prototype); // true
```

**4. Adding Methods to Prototypes:**
```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Add methods to the prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
    return this.age;
};

// All instances share the same prototype methods
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.greet()); // "Hello, I'm John"
console.log(jane.greet()); // "Hello, I'm Jane"

// Methods are shared, not duplicated
console.log(john.greet === jane.greet); // true
```

**5. Prototype Properties vs Instance Properties:**
```javascript
function Person(name) {
    this.name = name; // Instance property
}

Person.prototype.species = 'Homo sapiens'; // Prototype property

const john = new Person('John');

console.log(john.name); // "John" - instance property
console.log(john.species); // "Homo sapiens" - prototype property

// hasOwnProperty checks instance properties only
console.log(john.hasOwnProperty('name')); // true
console.log(john.hasOwnProperty('species')); // false

// Check if property exists in prototype chain
console.log('species' in john); // true
```

**6. Built-in Object Prototypes:**
```javascript
// Array prototype
const arr = [1, 2, 3];
console.log(arr.push); // function - from Array.prototype
console.log(arr.toString); // function - from Object.prototype

// String prototype
const str = 'hello';
console.log(str.toUpperCase); // function - from String.prototype
console.log(str.charAt); // function - from String.prototype

// Number prototype
const num = 42;
console.log(num.toFixed); // function - from Number.prototype
```

**7. Creating Objects with Specific Prototypes:**
```javascript
// Using Object.create()
const animal = {
    type: 'animal',
    makeSound() {
        return 'Some sound';
    }
};

const dog = Object.create(animal);
dog.breed = 'Golden Retriever';
dog.makeSound = function() {
    return 'Woof!';
};

console.log(dog.type); // "animal" - inherited
console.log(dog.makeSound()); // "Woof!" - overridden
console.log(dog.breed); // "Golden Retriever" - own property
```

**8. Prototype Inspection:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

// Check prototype
console.log(Object.getPrototypeOf(john) === Person.prototype); // true

// List prototype properties
console.log(Object.getOwnPropertyNames(Person.prototype));
// ['constructor', 'greet']

// Check if property exists in prototype chain
console.log('greet' in john); // true
console.log('toString' in john); // true (from Object.prototype)
```

**Best Practices:**
1. Use `Object.getPrototypeOf()` instead of `__proto__`
2. Add methods to prototypes, not instances
3. Use `hasOwnProperty()` to check instance properties
4. Be careful when modifying built-in prototypes
5. Use `Object.create()` for clean inheritance

**Related Questions:** [Prototypal Inheritance](#27-how-does-prototypal-inheritance-work), [Prototype Chain](#30-what-is-the-prototype-chain)

[⬆️ Back to Top](#table-of-contents)

---

### 27. How does prototypal inheritance work?

**Prototypal inheritance** is JavaScript's mechanism for object inheritance where objects can inherit properties and methods from other objects through the prototype chain.

**How It Works:**

**1. Basic Prototype Chain:**
```javascript
// Parent object
const animal = {
    type: 'animal',
    makeSound() {
        return 'Some generic sound';
    },
    eat() {
        return 'Eating food';
    }
};

// Child object inherits from animal
const dog = Object.create(animal);
dog.breed = 'Golden Retriever';
dog.makeSound = function() {
    return 'Woof! Woof!';
};

console.log(dog.type); // "animal" - inherited
console.log(dog.eat()); // "Eating food" - inherited
console.log(dog.makeSound()); // "Woof! Woof!" - overridden
console.log(dog.breed); // "Golden Retriever" - own property
```

**2. Constructor Function Inheritance:**
```javascript
// Parent constructor
function Animal(name) {
    this.name = name;
    this.type = 'animal';
}

Animal.prototype.makeSound = function() {
    return 'Some generic sound';
};

Animal.prototype.eat = function() {
    return `${this.name} is eating`;
};

// Child constructor
function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add child-specific methods
Dog.prototype.makeSound = function() {
    return 'Woof! Woof!';
};

Dog.prototype.fetch = function() {
    return `${this.name} is fetching the ball`;
};

// Create instances
const buddy = new Dog('Buddy', 'Golden Retriever');
console.log(buddy.name); // "Buddy"
console.log(buddy.type); // "animal" - inherited
console.log(buddy.makeSound()); // "Woof! Woof!" - overridden
console.log(buddy.eat()); // "Buddy is eating" - inherited
console.log(buddy.fetch()); // "Buddy is fetching the ball" - own method
```

**3. ES6 Class Inheritance:**
```javascript
// Parent class
class Animal {
    constructor(name) {
        this.name = name;
        this.type = 'animal';
    }
    
    makeSound() {
        return 'Some generic sound';
    }
    
    eat() {
        return `${this.name} is eating`;
    }
}

// Child class
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    makeSound() {
        return 'Woof! Woof!';
    }
    
    fetch() {
        return `${this.name} is fetching the ball`;
    }
}

const buddy = new Dog('Buddy', 'Golden Retriever');
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true
```

**4. Property Lookup Process:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

// Property lookup process:
// 1. Check instance properties
console.log(john.name); // "John" - found in instance

// 2. Check prototype properties
console.log(john.species); // "Homo sapiens" - found in Person.prototype

// 3. Check prototype's prototype (Object.prototype)
console.log(john.toString); // function - found in Object.prototype

// 4. Continue up the chain until null
console.log(john.nonExistent); // undefined - not found anywhere
```

**5. Method Overriding:**
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.makeSound = function() {
    return 'Some generic sound';
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override parent method
Dog.prototype.makeSound = function() {
    return 'Woof! Woof!';
};

// Call parent method from child
Dog.prototype.makeSoundAndEat = function() {
    return `${this.makeSound()} and ${Animal.prototype.eat.call(this)}`;
};

const buddy = new Dog('Buddy');
console.log(buddy.makeSound()); // "Woof! Woof!" - overridden
```

**6. Multiple Inheritance (Mixins):**
```javascript
// Mixin objects
const Flyable = {
    fly() {
        return `${this.name} is flying`;
    }
};

const Swimmable = {
    swim() {
        return `${this.name} is swimming`;
    }
};

// Base class
function Animal(name) {
    this.name = name;
}

// Mix in capabilities
Object.assign(Animal.prototype, Flyable);

function Duck(name) {
    Animal.call(this, name);
}

Duck.prototype = Object.create(Animal.prototype);
Duck.prototype.constructor = Duck;

// Mix in additional capabilities
Object.assign(Duck.prototype, Swimmable);

const donald = new Duck('Donald');
console.log(donald.fly()); // "Donald is flying"
console.log(donald.swim()); // "Donald is swimming"
```

**7. Prototype Chain Inspection:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// Check the prototype chain
let current = john;
let level = 0;

while (current !== null) {
    console.log(`Level ${level}:`, current.constructor.name);
    console.log('Properties:', Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
    level++;
}

// Output:
// Level 0: Person
// Properties: ['name']
// Level 1: Object
// Properties: ['constructor', 'species', 'greet', ...]
// Level 2: null
```

**Key Concepts:**
1. **Delegation**: Objects delegate property access to their prototype
2. **Dynamic**: Prototype chain is checked at runtime
3. **Mutable**: Prototypes can be modified after creation
4. **Flexible**: Multiple inheritance through mixins
5. **Efficient**: Methods are shared, not duplicated

**Best Practices:**
1. Use `Object.create()` for clean inheritance
2. Always set `constructor` property when overriding prototypes
3. Use `call()` or `apply()` to invoke parent constructors
4. Prefer composition over deep inheritance chains
5. Use ES6 classes for cleaner syntax
6. Be careful with prototype pollution

**Related Questions:** [Prototypes](#26-what-are-prototypes-in-javascript), [ES6 Classes](#29-how-do-es6-classes-relate-to-prototypes), [Prototype Chain](#30-what-is-the-prototype-chain)

[⬆️ Back to Top](#table-of-contents)

---

### 28. What's the difference between `__proto__` and `prototype`?

The key difference is that **`__proto__`** is a property of object instances that points to their prototype, while **`prototype`** is a property of constructor functions that defines what prototype new instances will have.

**`__proto__` - Instance Property:**
```javascript
const obj = {};
console.log(obj.__proto__); // Object.prototype

const arr = [];
console.log(arr.__proto__); // Array.prototype

function Person(name) {
    this.name = name;
}

const john = new Person('John');
console.log(john.__proto__); // Person.prototype
console.log(john.__proto__ === Person.prototype); // true
```

**`prototype` - Constructor Property:**
```javascript
function Person(name) {
    this.name = name;
}

// prototype is a property of the constructor function
console.log(Person.prototype); // Person.prototype object
console.log(typeof Person.prototype); // "object"

// Only functions have prototype property
console.log(Person.prototype.constructor === Person); // true
```

**Key Differences:**

**1. What They Are:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// __proto__ is on the instance
console.log(john.__proto__); // Person.prototype

// prototype is on the constructor
console.log(Person.prototype); // Person.prototype

// They point to the same object
console.log(john.__proto__ === Person.prototype); // true
```

**2. When They're Used:**
```javascript
function Animal(name) {
    this.name = name;
}

// prototype is used when creating new instances
Animal.prototype.makeSound = function() {
    return 'Some sound';
};

const dog = new Animal('Buddy');

// __proto__ is used for property lookup
console.log(dog.makeSound()); // "Some sound" - found via __proto__
console.log(dog.__proto__.makeSound()); // "Some sound" - same thing
```

**3. Modifying Prototypes:**
```javascript
function Person(name) {
    this.name = name;
}

const john = new Person('John');

// Modify constructor's prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

// This affects all instances (existing and new)
console.log(john.greet()); // "Hello, I'm John"

// Modify instance's __proto__ (not recommended)
john.__proto__.sayGoodbye = function() {
    return `Goodbye, ${this.name}`;
};

// This affects all instances of the same constructor
const jane = new Person('Jane');
console.log(jane.sayGoodbye()); // "Goodbye, Jane"
```

**4. Modern vs Legacy:**
```javascript
const obj = {};

// Legacy way (deprecated)
console.log(obj.__proto__); // Object.prototype

// Modern way (recommended)
console.log(Object.getPrototypeOf(obj)); // Object.prototype

// Setting prototype
const newProto = { newMethod: () => 'new method' };

// Legacy way (deprecated)
obj.__proto__ = newProto;

// Modern way (recommended)
Object.setPrototypeOf(obj, newProto);
```

**5. Function vs Object:**
```javascript
function Person(name) {
    this.name = name;
}

// Functions have BOTH __proto__ and prototype
console.log(Person.__proto__); // Function.prototype
console.log(Person.prototype); // Person.prototype object

// Regular objects only have __proto__
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(obj.prototype); // undefined
```

**6. Inheritance Setup:**
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    return `${this.name} is eating`;
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

// Set up inheritance using prototype
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    return 'Woof!';
};

const buddy = new Dog('Buddy', 'Golden Retriever');

// __proto__ chain: buddy -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(buddy.__proto__ === Dog.prototype); // true
console.log(buddy.__proto__.__proto__ === Animal.prototype); // true
```

**7. Property Lookup:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// Property lookup process:
// 1. Check instance properties
console.log(john.name); // "John" - found in instance

// 2. Check __proto__ (Person.prototype)
console.log(john.species); // "Homo sapiens" - found in __proto__

// 3. Check __proto__.__proto__ (Object.prototype)
console.log(john.toString); // function - found in __proto__.__proto__

// Manual lookup using __proto__
console.log(john.__proto__.species); // "Homo sapiens"
console.log(john.__proto__.__proto__.toString); // function
```

**8. Common Mistakes:**
```javascript
function Person(name) {
    this.name = name;
}

const john = new Person('John');

// WRONG: Trying to access prototype on instance
console.log(john.prototype); // undefined

// CORRECT: Access prototype via __proto__ or Object.getPrototypeOf
console.log(john.__proto__); // Person.prototype
console.log(Object.getPrototypeOf(john)); // Person.prototype

// WRONG: Modifying __proto__ directly
john.__proto__ = { newMethod: () => 'new' }; // Not recommended

// CORRECT: Modify constructor's prototype
Person.prototype.newMethod = () => 'new';
```

**9. ES6 Classes:**
```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

const john = new Person('John');

// ES6 classes still use prototypes under the hood
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.greet); // function

// The class syntax is just syntactic sugar
console.log(typeof Person); // "function"
```

**10. Prototype Chain Visualization:**
```javascript
function Animal(name) {
    this.name = name;
}

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const buddy = new Dog('Buddy', 'Golden Retriever');

// Visualize the chain
console.log('buddy.__proto__ === Dog.prototype:', buddy.__proto__ === Dog.prototype);
console.log('Dog.prototype.__proto__ === Animal.prototype:', Dog.prototype.__proto__ === Animal.prototype);
console.log('Animal.prototype.__proto__ === Object.prototype:', Animal.prototype.__proto__ === Object.prototype);
console.log('Object.prototype.__proto__ === null:', Object.prototype.__proto__ === null);
```

**Summary Table:**

| Aspect | `__proto__` | `prototype` |
|--------|-------------|-------------|
| **Location** | On object instances | On constructor functions |
| **Purpose** | Points to object's prototype | Defines prototype for new instances |
| **Access** | `obj.__proto__` | `Constructor.prototype` |
| **Modification** | `obj.__proto__ = newProto` | `Constructor.prototype = newProto` |
| **Modern Alternative** | `Object.getPrototypeOf(obj)` | Still `Constructor.prototype` |
| **Available On** | All objects | Only functions |
| **Used For** | Property lookup | Inheritance setup |

**Best Practices:**
1. Use `Object.getPrototypeOf()` instead of `__proto__`
2. Use `Object.setPrototypeOf()` instead of `__proto__ =`
3. Modify `prototype` for inheritance setup
4. Don't modify `__proto__` directly
5. Understand that ES6 classes use prototypes under the hood

**Related Questions:** [Prototypes](#26-what-are-prototypes-in-javascript), [Prototypal Inheritance](#27-how-does-prototypal-inheritance-work), [ES6 Classes](#29-how-do-es6-classes-relate-to-prototypes)

[⬆️ Back to Top](#table-of-contents)

---

### 29. How do ES6 classes relate to prototypes?

ES6 classes are **syntactic sugar** over JavaScript's existing prototype-based inheritance. They provide a cleaner syntax but still use prototypes under the hood.

**Class Syntax vs Prototype:**

**1. Basic Class Declaration:**
```javascript
// ES6 Class
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    getAge() {
        return this.age;
    }
}

// Equivalent Constructor Function
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
    return this.age;
};

// Both create the same prototype structure
const john1 = new Person('John', 30); // Class
const john2 = new Person('John', 30); // Constructor

console.log(john1.__proto__ === Person.prototype); // true
console.log(john2.__proto__ === Person.prototype); // true
console.log(john1.greet === john2.greet); // true
```

**2. Class Inheritance:**
```javascript
// ES6 Class Inheritance
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    makeSound() {
        return 'Some generic sound';
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    makeSound() {
        return 'Woof! Woof!';
    }
    
    fetch() {
        return `${this.name} is fetching`;
    }
}

// Equivalent Prototype Inheritance
function Animal(name) {
    this.name = name;
}

Animal.prototype.makeSound = function() {
    return 'Some generic sound';
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.makeSound = function() {
    return 'Woof! Woof!';
};

Dog.prototype.fetch = function() {
    return `${this.name} is fetching`;
};
```

**3. Static Methods:**
```javascript
// ES6 Class with Static Methods
class MathUtils {
    static add(a, b) {
        return a + b;
    }
    
    static multiply(a, b) {
        return a * b;
    }
}

// Equivalent Constructor Function
function MathUtils() {}

MathUtils.add = function(a, b) {
    return a + b;
};

MathUtils.multiply = function(a, b) {
    return a * b;
};

// Usage is identical
console.log(MathUtils.add(2, 3)); // 5
console.log(MathUtils.multiply(4, 5)); // 20
```

**4. Getters and Setters:**
```javascript
// ES6 Class with Getters/Setters
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    set fullName(name) {
        [this.firstName, this.lastName] = name.split(' ');
    }
}

// Equivalent with Object.defineProperty
function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
}

Object.defineProperty(Person.prototype, 'fullName', {
    get: function() {
        return `${this.firstName} ${this.lastName}`;
    },
    set: function(name) {
        [this.firstName, this.lastName] = name.split(' ');
    },
    enumerable: true,
    configurable: true
});

const person = new Person('John', 'Doe');
console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
```

**5. Private Fields (ES2022):**
```javascript
// ES6 Class with Private Fields
class BankAccount {
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        this.#balance += amount;
        return this.#balance;
    }
    
    getBalance() {
        return this.#balance;
    }
}

// Private fields are not accessible outside the class
const account = new BankAccount('12345', 1000);
console.log(account.getBalance()); // 1000
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

**6. Class Methods vs Prototype Methods:**
```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    // Instance method (goes to prototype)
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    // Static method (goes to constructor)
    static createAnonymous() {
        return new Person('Anonymous');
    }
}

const john = new Person('John');

// Instance method is on prototype
console.log(john.greet); // function - from Person.prototype
console.log(john.__proto__.greet); // function - same thing

// Static method is on constructor
console.log(Person.createAnonymous); // function - from Person
console.log(john.createAnonymous); // undefined - not on instance
```

**7. Class Hoisting:**
```javascript
// Classes are NOT hoisted like functions
// console.log(MyClass); // ReferenceError: Cannot access 'MyClass' before initialization

class MyClass {
    constructor() {
        this.value = 42;
    }
}

// Functions ARE hoisted
console.log(MyFunction); // function MyFunction() { ... }

function MyFunction() {
    this.value = 42;
}
```

**8. Class vs Constructor Function:**
```javascript
// Class
class Person {
    constructor(name) {
        this.name = name;
    }
}

// Constructor Function
function Person(name) {
    this.name = name;
}

// Both create similar objects, but classes have stricter behavior
const classInstance = new Person('John');
const funcInstance = new Person('John');

console.log(classInstance instanceof Person); // true
console.log(funcInstance instanceof Person); // true

// Classes must be called with 'new'
// Person('John'); // TypeError: Class constructor Person cannot be invoked without 'new'

// Constructor functions can be called without 'new' (though not recommended)
const funcInstance2 = Person('Jane'); // Works, but 'this' refers to global object
```

**9. Class Inheritance Chain:**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}

const buddy = new Dog('Buddy', 'Golden Retriever');

// Prototype chain: buddy -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(buddy.__proto__ === Dog.prototype); // true
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true

// instanceof works with classes
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true
```

**10. Mixins with Classes:**
```javascript
// Mixin functions
const Flyable = {
    fly() {
        return `${this.name} is flying`;
    }
};

const Swimmable = {
    swim() {
        return `${this.name} is swimming`;
    }
};

// Mixin helper function
function mixin(target, ...sources) {
    Object.assign(target.prototype, ...sources);
}

class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Duck extends Animal {
    constructor(name) {
        super(name);
    }
}

// Apply mixins
mixin(Duck, Flyable, Swimmable);

const donald = new Duck('Donald');
console.log(donald.fly()); // "Donald is flying"
console.log(donald.swim()); // "Donald is swimming"
```

**Key Differences:**

| Feature | ES6 Classes | Constructor Functions |
|---------|-------------|----------------------|
| **Syntax** | Clean, familiar | Verbose |
| **Hoisting** | Not hoisted | Hoisted |
| **Strict Mode** | Always in strict mode | Depends on context |
| **Call without `new`** | Throws error | Works (but problematic) |
| **Private Fields** | Supported (ES2022) | Not supported |
| **Super** | Built-in `super` keyword | Manual `Parent.call(this)` |
| **Prototype** | Still uses prototypes | Uses prototypes |

**Best Practices:**
1. Use classes for cleaner syntax
2. Remember that classes are still prototypes under the hood
3. Use `super()` in child constructors
4. Prefer composition over deep inheritance
5. Use private fields for encapsulation
6. Don't forget that classes are not hoisted

**Related Questions:** [Prototypes](#26-what-are-prototypes-in-javascript), [Prototypal Inheritance](#27-how-does-prototypal-inheritance-work), [Prototype Chain](#30-what-is-the-prototype-chain)

[⬆️ Back to Top](#table-of-contents)

---

### 30. What is the prototype chain?

The **prototype chain** is the mechanism by which JavaScript objects inherit properties and methods from other objects. When a property is accessed on an object, JavaScript searches up the prototype chain until it finds the property or reaches the end of the chain.

**How the Prototype Chain Works:**

**1. Basic Chain Structure:**
```javascript
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(obj.__proto__.__proto__); // null

// Chain: obj -> Object.prototype -> null
```

**2. Property Lookup Process:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

// Property lookup follows this order:
// 1. Check instance properties
console.log(john.name); // "John" - found in instance

// 2. Check Person.prototype
console.log(john.species); // "Homo sapiens" - found in prototype

// 3. Check Object.prototype
console.log(john.toString); // function - found in Object.prototype

// 4. Continue until null
console.log(john.nonExistent); // undefined - not found anywhere
```

**3. Inheritance Chain:**
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    return `${this.name} is eating`;
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    return 'Woof!';
};

const buddy = new Dog('Buddy', 'Golden Retriever');

// Chain: buddy -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(buddy.breed); // "Golden Retriever" - instance property
console.log(buddy.bark()); // "Woof!" - Dog.prototype
console.log(buddy.eat()); // "Buddy is eating" - Animal.prototype
console.log(buddy.toString()); // "[object Object]" - Object.prototype
```

**4. Chain Visualization:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// Visualize the entire chain
let current = john;
let level = 0;

while (current !== null) {
    console.log(`Level ${level}:`, current.constructor.name);
    console.log('Own properties:', Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
    level++;
}

// Output:
// Level 0: Person
// Own properties: ['name']
// Level 1: Object
// Own properties: ['constructor', 'species', 'greet', ...]
// Level 2: null
```

**5. Method Overriding:**
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.makeSound = function() {
    return 'Some generic sound';
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override parent method
Dog.prototype.makeSound = function() {
    return 'Woof! Woof!';
};

const buddy = new Dog('Buddy');

// JavaScript finds the method in Dog.prototype first
console.log(buddy.makeSound()); // "Woof! Woof!" - from Dog.prototype

// Access parent method explicitly
console.log(Animal.prototype.makeSound.call(buddy)); // "Some generic sound"
```

**6. Property Shadowing:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// Instance property shadows prototype property
john.species = 'Alien';

console.log(john.species); // "Alien" - instance property
console.log(john.__proto__.species); // "Homo sapiens" - prototype property

// Check if property is own or inherited
console.log(john.hasOwnProperty('species')); // true - own property
console.log(john.hasOwnProperty('name')); // true - own property
console.log(john.hasOwnProperty('toString')); // false - inherited
```

**7. Chain Modification:**
```javascript
const obj = { a: 1 };
const proto = { b: 2 };
const grandProto = { c: 3 };

// Set up chain: obj -> proto -> grandProto -> Object.prototype -> null
Object.setPrototypeOf(obj, proto);
Object.setPrototypeOf(proto, grandProto);

console.log(obj.a); // 1 - own property
console.log(obj.b); // 2 - from proto
console.log(obj.c); // 3 - from grandProto
console.log(obj.toString); // function - from Object.prototype
```

**8. Built-in Object Chains:**
```javascript
const arr = [1, 2, 3];

// Array prototype chain
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

// String prototype chain
const str = 'hello';
console.log(str.__proto__ === String.prototype); // true
console.log(String.prototype.__proto__ === Object.prototype); // true

// Function prototype chain
function fn() {}
console.log(fn.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
```

**9. Chain Inspection Methods:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const john = new Person('John');

// Check if property exists in chain
console.log('name' in john); // true - own property
console.log('species' in john); // true - inherited
console.log('toString' in john); // true - inherited from Object.prototype

// Get property descriptor
console.log(Object.getOwnPropertyDescriptor(john, 'name'));
// { value: 'John', writable: true, enumerable: true, configurable: true }

// List all properties in chain
function getAllProperties(obj) {
    const props = [];
    let current = obj;
    
    while (current !== null) {
        props.push(...Object.getOwnPropertyNames(current));
        current = Object.getPrototypeOf(current);
    }
    
    return [...new Set(props)]; // Remove duplicates
}

console.log(getAllProperties(john));
// ['name', 'constructor', 'species', 'greet', 'toString', 'valueOf', ...]
```

**10. Performance Considerations:**
```javascript
// Deep prototype chains can impact performance
function createDeepChain(depth) {
    let current = {};
    
    for (let i = 0; i < depth; i++) {
        const newObj = { [`level${i}`]: i };
        Object.setPrototypeOf(newObj, current);
        current = newObj;
    }
    
    return current;
}

const deepObj = createDeepChain(1000);

// Accessing properties deep in the chain is slower
console.time('deep property access');
for (let i = 0; i < 10000; i++) {
    deepObj.level999; // Access property deep in chain
}
console.timeEnd('deep property access');

// Shallow chains are faster
const shallowObj = { a: 1, b: 2, c: 3 };
console.time('shallow property access');
for (let i = 0; i < 10000; i++) {
    shallowObj.a; // Access own property
}
console.timeEnd('shallow property access');
```

**11. Common Chain Patterns:**

**Single Inheritance:**
```javascript
function Vehicle(make, model) {
    this.make = make;
    this.model = model;
}

Vehicle.prototype.start = function() {
    return `${this.make} ${this.model} is starting`;
};

function Car(make, model, doors) {
    Vehicle.call(this, make, model);
    this.doors = doors;
}

Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.honk = function() {
    return 'Beep! Beep!';
};
```

**Multiple Inheritance (Mixins):**
```javascript
const Flyable = {
    fly() {
        return `${this.name} is flying`;
    }
};

const Swimmable = {
    swim() {
        return `${this.name} is swimming`;
    }
};

function Duck(name) {
    this.name = name;
}

// Mix in capabilities
Object.assign(Duck.prototype, Flyable, Swimmable);

const donald = new Duck('Donald');
console.log(donald.fly()); // "Donald is flying"
console.log(donald.swim()); // "Donald is swimming"
```

**12. Chain Debugging:**
```javascript
function debugPrototypeChain(obj, name = 'Object') {
    console.log(`\n=== ${name} Prototype Chain ===`);
    
    let current = obj;
    let level = 0;
    
    while (current !== null) {
        console.log(`Level ${level}:`, current.constructor.name);
        console.log('Properties:', Object.getOwnPropertyNames(current));
        
        if (level > 10) { // Prevent infinite loops
            console.log('... (chain too deep, stopping)');
            break;
        }
        
        current = Object.getPrototypeOf(current);
        level++;
    }
    
    console.log('=== End Chain ===\n');
}

const testObj = { test: 'value' };
debugPrototypeChain(testObj, 'Test Object');
```

**Key Concepts:**
1. **Delegation**: Objects delegate property access to their prototype
2. **Search Order**: Instance → Prototype → Prototype's prototype → ... → null
3. **Shadowing**: Instance properties override prototype properties
4. **Dynamic**: Chain is checked at runtime
5. **Mutable**: Chain can be modified (though not recommended)

**Best Practices:**
1. Keep prototype chains shallow for better performance
2. Use `hasOwnProperty()` to check for own properties
3. Avoid modifying built-in prototype chains
4. Use `Object.getPrototypeOf()` instead of `__proto__`
5. Prefer composition over deep inheritance
6. Be careful with circular references

**Related Questions:** [Prototypes](#26-what-are-prototypes-in-javascript), [Prototypal Inheritance](#27-how-does-prototypal-inheritance-work), [__proto__ vs prototype](#28-whats-the-difference-between-__proto__-and-prototype)

[⬆️ Back to Top](#table-of-contents)

---

## Asynchronous JavaScript
31. What are callbacks and what is callback hell?
32. What are Promises and how do they work?
33. What is async/await and how does it differ from Promises?
34. What is the Event Loop?
35. What's the difference between microtasks and macrotasks?
36. How do you handle errors in asynchronous code?
37. What is Promise.all() vs Promise.race() vs Promise.allSettled()?

[⬆️ Back to Top](#table-of-contents)

## Event Handling
38. How does event handling work in JavaScript?
39. What is event bubbling and capturing?
40. What is event delegation?
41. How do you prevent default behavior and stop event propagation?
42. What's the difference between `addEventListener` and `onclick`?

[⬆️ Back to Top](#table-of-contents)

## DOM Manipulation
43. How do you select DOM elements?
44. How do you create, modify, and remove DOM elements?
45. What's the difference between `innerHTML`, `textContent`, and `innerText`?
46. How do you handle form validation in JavaScript?
47. What is the difference between `document.ready` and `window.onload`?

[⬆️ Back to Top](#table-of-contents)

## ES6+ Features
48. What are template literals?
49. What are default parameters?
50. What are modules and how do you use import/export?
51. What are Sets and Maps?
52. What are Symbols?
53. What are generators and iterators?
54. What is the `for...of` vs `for...in` loop?

[⬆️ Back to Top](#table-of-contents)

## Error Handling
55. How do you handle errors in JavaScript?
56. What is the difference between throwing and catching errors?
57. What are the different types of errors in JavaScript?
58. How do you create custom error types?

[⬆️ Back to Top](#table-of-contents)

## Performance and Optimization
59. What are some JavaScript performance optimization techniques?
60. How do you avoid memory leaks in JavaScript?
61. What is debouncing and throttling?
62. How do you optimize DOM manipulation?
63. What is lazy loading?

[⬆️ Back to Top](#table-of-contents)

## Advanced Concepts
64. What is memoization?
65. What are design patterns in JavaScript (Singleton, Observer, Module)?
66. What is functional programming in JavaScript?
67. What is immutability and why is it important?
68. What are pure functions?
69. What is recursion and when would you use it?

[⬆️ Back to Top](#table-of-contents)

## Browser APIs
70. What is localStorage vs sessionStorage vs cookies?
71. What is the Fetch API?
72. What are Web Workers?
73. What is the Geolocation API?
74. What is the History API?

[⬆️ Back to Top](#table-of-contents)

## Security
75. What is Cross-Site Scripting (XSS)?
76. What is Cross-Site Request Forgery (CSRF)?
77. How do you sanitize user input?
78. What is Content Security Policy (CSP)?

[⬆️ Back to Top](#table-of-contents)

## Testing
79. How do you write unit tests in JavaScript?
80. What is test-driven development (TDD)?
81. What are mocks and stubs?
82. How do you test asynchronous code?

[⬆️ Back to Top](#table-of-contents)

## Modern JavaScript Tools
83. What is npm and package.json?
84. What are build tools like Webpack, Vite?
85. What is Babel and why is it used?
86. What are linters like ESLint?
87. What is the difference between development and production builds?

[⬆️ Back to Top](#table-of-contents)

## Regular Expressions
88. How do you use regular expressions in JavaScript?
89. What are common regex patterns for validation?
90. What's the difference between `match`, `search`, `replace`, and `test`?

[⬆️ Back to Top](#table-of-contents)

## JSON and Data Handling
91. How do you work with JSON in JavaScript?
92. What's the difference between `JSON.parse()` and `JSON.stringify()`?
93. How do you handle API responses?
94. What is CORS and how do you handle it?

[⬆️ Back to Top](#table-of-contents)

## Miscellaneous
95. What is the difference between synchronous and asynchronous code?
96. How do you check if a variable is an array?
97. What is the `typeof` operator and its limitations?
98. How do you convert strings to numbers and vice versa?
99. What is the difference between `slice`, `splice`, and `split`?
100. How do you sort arrays and objects?

[⬆️ Back to Top](#table-of-contents)

## Coding Challenges (Common Interview Questions)
101. How do you reverse a string?
102. How do you check if a string is a palindrome?
103. How do you find duplicates in an array?
104. How do you flatten a nested array?
105. How do you implement a simple calculator?
106. How do you debounce a function?
107. How do you implement a simple Promise?
108. How do you find the largest/smallest number in an array?
109. How do you remove duplicates from an array?
110. How do you implement array methods like `map`, `filter`, `reduce` from scratch?

[⬆️ Back to Top](#table-of-contents)

## Framework-Agnostic Frontend Concepts
111. What is the Virtual DOM?
112. What is component-based architecture?
113. What is state management?
114. What is client-side routing?
115. What is server-side rendering vs client-side rendering?
116. What are Progressive Web Apps (PWAs)?
117. What is responsive design and how do you implement it?
118. What is accessibility (a11y) and why is it important?
119. What are micro-frontends?
120. What is the difference between SPA, MPA, and SSG?

[⬆️ Back to Top](#table-of-contents)

---

*This list covers the most frequently asked JavaScript questions in frontend interviews. Each topic builds upon fundamental JavaScript concepts and progresses to more advanced frontend development scenarios.*
