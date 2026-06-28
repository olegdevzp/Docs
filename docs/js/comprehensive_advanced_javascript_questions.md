# Comprehensive Advanced JavaScript Questions

## Table of Contents
1. [Closures and Scope](#closures-and-scope)
2. [Prototypal Inheritance](#prototypal-inheritance)
3. [Asynchronous JavaScript](#asynchronous-javascript)
4. [Event Loop and Concurrency](#event-loop-and-concurrency)
5. [Memory Management](#memory-management)
6. [Advanced Functions](#advanced-functions)
7. [Modules and Bundling](#modules-and-bundling)
8. [Performance Optimization](#performance-optimization)
9. [Design Patterns](#design-patterns)
10. [Browser APIs](#browser-apis)
11. [ES6+ Features](#es6-features)
12. [Security](#security)
13. [Testing](#testing)
14. [Metaprogramming](#metaprogramming)
15. [Advanced Object Manipulation](#advanced-object-manipulation)

---

## Closures and Scope

### 1. Explain the difference between lexical scoping and dynamic scoping
**Answer:** Understanding scoping mechanisms is fundamental to mastering JavaScript's execution model and closure behavior.

**Lexical Scoping (Static Scoping)** - Used by JavaScript:
Lexical scoping means that variable access is determined by where variables and functions are declared in the source code structure, not where they are called from. The scope is "lexical" because it's determined at parse time (when the code is read), creating a static scope chain that doesn't change during execution.

**Key Characteristics:**
- Scope is determined by the physical placement of variables and functions in the code
- Inner functions have access to variables in their outer (enclosing) scope
- The scope chain is established when the function is defined, not when it's called
- Provides predictable variable resolution and enables closures

**Dynamic Scoping** - Not used by JavaScript:
In dynamic scoping, variable access would be determined by the calling context at runtime. Variables would be resolved based on the execution stack rather than the lexical structure.

**Practical Example:**
```javascript
let globalVar = 'global';

function outerFunction() {
  let outerVar = 'outer';
  
  function innerFunction() {
    let innerVar = 'inner';
    
    // Lexical scoping: can access variables from all enclosing scopes
    console.log(innerVar);  // 'inner' - own scope
    console.log(outerVar);  // 'outer' - parent scope
    console.log(globalVar); // 'global' - global scope
    
    // The scope chain is: innerFunction -> outerFunction -> global
  }
  
  return innerFunction;
}

function anotherFunction() {
  let outerVar = 'different outer'; // This won't affect innerFunction
  
  const inner = outerFunction();
  inner(); // Still logs 'outer', not 'different outer'
  // This proves lexical scoping - innerFunction remembers its original scope
}

anotherFunction();
```

**Why Lexical Scoping Matters:**
1. **Predictability**: You can determine variable access by reading the code structure
2. **Closures**: Enables functions to "remember" their lexical environment
3. **Optimization**: JavaScript engines can optimize variable access at compile time
4. **Debugging**: Easier to trace variable resolution and scope-related issues

### 2. What happens when you create a closure inside a loop?
**Answer:** Creating closures inside loops is a classic JavaScript pitfall that demonstrates the interaction between closures, variable hoisting, and scope. This issue occurs because all closures created in the loop share the same reference to the loop variable, not separate copies of its value.

**The Problem Explained:**
When you create a closure inside a loop using `var`, all the closures capture a reference to the same variable in the outer scope. Since `var` is function-scoped and hoisted, there's only one loop variable that gets updated on each iteration. By the time any of the closures execute, the loop has completed and the variable holds its final value.

**Root Causes:**
1. **Variable Hoisting**: `var` declarations are hoisted to the function scope
2. **Shared Reference**: All closures reference the same variable, not individual values
3. **Asynchronous Execution**: Closures often execute after the loop completes
4. **Scope Chain**: The closure's scope chain points to the same outer environment

```javascript
// Problem Demonstration
console.log('=== Problem with var ===');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var result:', i), 100); // Prints 3, 3, 3
  // All closures reference the same 'i' variable
  // When setTimeout executes, the loop has finished and i = 3
}

// What actually happens (conceptually):
var i; // Hoisted to function scope
for (i = 0; i < 3; i++) {
  // Each setTimeout closure captures reference to the same 'i'
  setTimeout(() => console.log('var result:', i), 100);
}
// After loop: i = 3, all closures execute with i = 3

console.log('=== Solutions ===');

// Solution 1: Block-scoped let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log('let result:', i), 100); // Prints 0, 1, 2
  // Each iteration creates a new binding of 'i'
  // Each closure captures its own copy of the variable
}

// Solution 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function(capturedValue) {
    // Create new scope with parameter that captures current value
    setTimeout(() => console.log('IIFE result:', capturedValue), 100);
  })(i); // Pass current value of i
}

// Solution 3: bind method
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, 'bind result:', i), 100);
  // bind creates new function with 'i' value bound at creation time
}

// Solution 4: Additional parameter in setTimeout
for (var i = 0; i < 3; i++) {
  setTimeout((index) => console.log('param result:', index), 100, i);
  // Pass 'i' as parameter to the callback function
}

// Solution 5: Array methods (modern approach)
Array.from({length: 3}, (_, i) => {
  setTimeout(() => console.log('array result:', i), 100);
});

// Solution 6: Using closures properly
function createLogger(index) {
  return function() {
    console.log('closure result:', index);
  };
}

for (var i = 0; i < 3; i++) {
  setTimeout(createLogger(i), 100);
}
```

**Detailed Analysis of Solutions:**

**1. Block-scoped `let`** (Recommended):
- Creates a new binding for each iteration
- Temporal Dead Zone prevents access before declaration
- Most readable and intuitive solution

**2. IIFE (Immediately Invoked Function Expression)**:
- Creates new execution context for each iteration
- Parameter captures the current value by creating a copy
- Classic solution before ES6

**3. Function.prototype.bind()**:
- Creates new function with pre-bound arguments
- Arguments are captured at bind time, not execution time
- Useful for method binding scenarios

**Understanding the Memory Implications:**
```javascript
// Memory consideration: each solution creates separate closures
const closures = [];

// This creates memory leaks if closures aren't cleaned up
for (let i = 0; i < 1000; i++) {
  closures.push(() => console.log(i)); // Each closure holds reference to 'i'
}

// Clean up when done
closures.length = 0;
```

### 3. How do you create a private variable in JavaScript without using classes?
**Answer:** Creating truly private variables in JavaScript without classes relies on closures and the principle of lexical scoping. Since JavaScript doesn't have built-in access modifiers like `private` (except in modern class syntax), we use function scopes to create encapsulation and data hiding.

**The Closure-Based Privacy Pattern:**
Closures allow inner functions to access variables from their outer scope even after the outer function has finished executing. By returning functions that have access to variables in the outer scope, we can create a controlled interface to private data.

**Key Concepts:**
1. **Encapsulation**: Hide internal implementation details
2. **Controlled Access**: Provide specific methods to interact with private data
3. **Data Integrity**: Prevent direct manipulation of internal state
4. **Scope Protection**: Use function scope as a privacy boundary

```javascript
// Basic Counter Example
function createCounter() {
  let count = 0; // Private variable - not accessible from outside
  
  // Return public interface (methods that have access to private variables)
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count; // Read-only access
    },
    reset() {
      count = 0;
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
// console.log(counter.count); // undefined - private variable not accessible

// Advanced Example: Bank Account with Validation
function createBankAccount(initialBalance = 0, accountHolder = 'Anonymous') {
  // Private variables
  let balance = initialBalance;
  let transactionHistory = [];
  const accountNumber = Math.random().toString(36).substr(2, 9);
  let isActive = true;
  
  // Private helper functions
  function validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
  }
  
  function addTransaction(type, amount, description = '') {
    transactionHistory.push({
      id: Date.now(),
      type,
      amount,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: balance
    });
  }
  
  function checkAccountStatus() {
    if (!isActive) {
      throw new Error('Account is closed');
    }
  }
  
  // Public interface
  return {
    // Deposit money
    deposit(amount, description = 'Deposit') {
      checkAccountStatus();
      validateAmount(amount);
      
      balance += amount;
      addTransaction('credit', amount, description);
      
      return {
        success: true,
        newBalance: balance,
        transactionId: transactionHistory[transactionHistory.length - 1].id
      };
    },
    
    // Withdraw money
    withdraw(amount, description = 'Withdrawal') {
      checkAccountStatus();
      validateAmount(amount);
      
      if (amount > balance) {
        throw new Error('Insufficient funds');
      }
      
      balance -= amount;
      addTransaction('debit', amount, description);
      
      return {
        success: true,
        newBalance: balance,
        transactionId: transactionHistory[transactionHistory.length - 1].id
      };
    },
    
    // Get current balance (read-only)
    getBalance() {
      checkAccountStatus();
      return balance;
    },
    
    // Get account information
    getAccountInfo() {
      return {
        accountNumber,
        accountHolder,
        isActive,
        balance: balance,
        transactionCount: transactionHistory.length
      };
    },
    
    // Get transaction history (returns copy, not reference)
    getTransactionHistory(limit = 10) {
      checkAccountStatus();
      return transactionHistory
        .slice(-limit)
        .map(transaction => ({ ...transaction })); // Return copies, not references
    },
    
    // Close account
    closeAccount() {
      checkAccountStatus();
      isActive = false;
      addTransaction('system', 0, 'Account closed');
      return { success: true, message: 'Account closed successfully' };
    }
  };
}

// Usage
const account = createBankAccount(1000, 'John Doe');
console.log(account.getBalance()); // 1000
account.deposit(500, 'Salary');
account.withdraw(200, 'Groceries');
console.log(account.getAccountInfo());

// Module Pattern for Multiple Private Variables
const userManager = (function() {
  // Private variables and functions
  const users = new Map();
  let nextId = 1;
  
  function validateUser(userData) {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      throw new Error('Invalid email format');
    }
  }
  
  function generateId() {
    return nextId++;
  }
  
  // Public API
  return {
    createUser(userData) {
      validateUser(userData);
      const id = generateId();
      const user = {
        id,
        ...userData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      users.set(id, user);
      return { id, success: true };
    },
    
    getUser(id) {
      const user = users.get(id);
      return user ? { ...user } : null; // Return copy
    },
    
    updateUser(id, updates) {
      const user = users.get(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      users.set(id, updatedUser);
      return { success: true };
    },
    
    deleteUser(id) {
      return users.delete(id);
    },
    
    getUserCount() {
      return users.size;
    },
    
    // Method to access private function (controlled access)
    isValidEmail(email) {
      try {
        validateUser({ name: 'test', email });
        return true;
      } catch {
        return false;
      }
    }
  };
})();

// WeakMap Pattern for True Privacy (ES6+)
const createSecureObject = (() => {
  const privateData = new WeakMap();
  
  return function(initialData) {
    // Store private data in WeakMap
    privateData.set(this, {
      secret: initialData.secret,
      internalState: 'initialized',
      accessCount: 0
    });
    
    return {
      // Public methods that access private data
      getPublicInfo() {
        const data = privateData.get(this);
        data.accessCount++;
        return {
          hasSecret: !!data.secret,
          accessCount: data.accessCount
        };
      },
      
      verifySecret(inputSecret) {
        const data = privateData.get(this);
        return data.secret === inputSecret;
      },
      
      updateSecret(newSecret, oldSecret) {
        const data = privateData.get(this);
        if (data.secret !== oldSecret) {
          throw new Error('Invalid old secret');
        }
        data.secret = newSecret;
        return { success: true };
      }
    };
  };
})();

// Symbol-based Privacy (ES6+)
function createSymbolBasedPrivacy() {
  // Create unique symbols for private properties
  const _balance = Symbol('balance');
  const _transactions = Symbol('transactions');
  const _validateAmount = Symbol('validateAmount');
  
  return {
    [_balance]: 0,
    [_transactions]: [],
    
    [_validateAmount](amount) {
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Invalid amount');
      }
    },
    
    deposit(amount) {
      this[_validateAmount](amount);
      this[_balance] += amount;
      this[_transactions].push({ type: 'deposit', amount, timestamp: Date.now() });
      return this[_balance];
    },
    
    getBalance() {
      return this[_balance];
    },
    
    getTransactionCount() {
      return this[_transactions].length;
    }
  };
}
```

**Comparison of Privacy Patterns:**

| Pattern | Privacy Level | Performance | Browser Support | Use Case |
|---------|---------------|-------------|-----------------|----------|
| Closures | High | Good | All browsers | General purpose |
| WeakMap | Highest | Excellent | ES6+ | Memory-sensitive |
| Symbols | Medium | Excellent | ES6+ | Semi-private data |
| IIFE Module | High | Good | All browsers | Singletons |

**Best Practices:**
1. **Use closures for true privacy** when you need complete encapsulation
2. **Return copies, not references** to prevent external mutation
3. **Validate inputs** in public methods to maintain data integrity
4. **Use WeakMap** for memory-efficient privacy in modern environments
5. **Consider performance implications** of closure-based patterns in hot code paths

### 4. Explain the module pattern and its variations
**Answer:** The Module Pattern is a fundamental design pattern in JavaScript that leverages closures to create encapsulation, mimicking the concept of modules with public and private methods and variables. It's particularly important in JavaScript because the language traditionally lacked built-in module systems (before ES6 modules).

**Core Concepts of the Module Pattern:**
1. **Encapsulation**: Hide implementation details and expose only necessary functionality
2. **Namespace Protection**: Avoid global namespace pollution
3. **Singleton Behavior**: Usually creates a single instance
4. **Immediate Execution**: Often uses IIFE (Immediately Invoked Function Expression)
5. **Controlled Access**: Provides specific interface to interact with private data

**1. Basic Module Pattern (IIFE):**
```javascript
const BasicModule = (function() {
  // Private variables and functions
  let privateCounter = 0;
  const privateArray = [];
  
  function privateMethod() {
    console.log('This is a private method');
    return privateCounter++;
  }
  
  function validateInput(input) {
    return typeof input === 'string' && input.length > 0;
  }
  
  // Public API - returned object becomes the module interface
  return {
    // Public methods
    increment() {
      return privateMethod();
    },
    
    getCounter() {
      return privateCounter;
    },
    
    addItem(item) {
      if (validateInput(item)) {
        privateArray.push(item);
        return true;
      }
      return false;
    },
    
    getItems() {
      // Return copy to prevent external modification
      return [...privateArray];
    },
    
    reset() {
      privateCounter = 0;
      privateArray.length = 0;
    }
  };
})();

// Usage
console.log(BasicModule.increment()); // 0
console.log(BasicModule.getCounter()); // 1
BasicModule.addItem('test');
console.log(BasicModule.getItems()); // ['test']
```

**2. Revealing Module Pattern:**
This variation explicitly defines what to expose, making the public API more clear and organized.

```javascript
const RevealingModule = (function() {
  // Private variables
  let config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  };
  
  let cache = new Map();
  let requestCount = 0;
  
  // Private functions
  function makeRequest(endpoint, options = {}) {
    requestCount++;
    console.log(`Making request ${requestCount} to ${config.apiUrl}${endpoint}`);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          const data = { endpoint, timestamp: Date.now(), id: requestCount };
          cache.set(endpoint, data);
          resolve(data);
        } else {
          reject(new Error('Request failed'));
        }
      }, Math.random() * 1000);
    });
  }
  
  function getCachedData(endpoint) {
    return cache.get(endpoint);
  }
  
  function clearCache() {
    cache.clear();
    console.log('Cache cleared');
  }
  
  function updateConfig(newConfig) {
    config = { ...config, ...newConfig };
    console.log('Configuration updated:', config);
  }
  
  function getStats() {
    return {
      totalRequests: requestCount,
      cacheSize: cache.size,
      currentConfig: { ...config }
    };
  }
  
  // Explicitly reveal public methods
  return {
    // Public API - clearly defined interface
    request: makeRequest,
    getFromCache: getCachedData,
    clearCache: clearCache,
    configure: updateConfig,
    getStatistics: getStats
  };
})();

// Usage
RevealingModule.configure({ timeout: 10000 });
RevealingModule.request('/users/1').then(data => console.log(data));
console.log(RevealingModule.getStatistics());
```

**3. Module Pattern with Parameters:**
Allows passing dependencies and configuration during module creation.

```javascript
const ParameterizedModule = (function(global, $, config) {
  // Private variables initialized with parameters
  const settings = {
    debug: false,
    version: '1.0.0',
    ...config
  };
  
  const dependencies = {
    global: global,
    jquery: $
  };
  
  let moduleState = 'initialized';
  
  // Private functions
  function log(message, level = 'info') {
    if (settings.debug) {
      console[level](`[${settings.version}] ${message}`);
    }
  }
  
  function checkDependencies() {
    const missing = [];
    if (!dependencies.global) missing.push('global');
    if (!dependencies.jquery) missing.push('jquery');
    
    if (missing.length > 0) {
      throw new Error(`Missing dependencies: ${missing.join(', ')}`);
    }
  }
  
  function initialize() {
    checkDependencies();
    moduleState = 'ready';
    log('Module initialized successfully');
  }
  
  // Auto-initialize
  initialize();
  
  return {
    getVersion() {
      return settings.version;
    },
    
    getState() {
      return moduleState;
    },
    
    enableDebug() {
      settings.debug = true;
      log('Debug mode enabled');
    },
    
    disableDebug() {
      settings.debug = false;
    },
    
    getDependencies() {
      return Object.keys(dependencies).filter(key => dependencies[key]);
    }
  };
})(window, window.jQuery, { debug: true, version: '2.0.0' });
```

**4. Namespace Module Pattern:**
Creates hierarchical module structure to organize related functionality.

```javascript
// Create namespace
const MyApp = MyApp || {};

// Add modules to namespace
MyApp.Utils = (function() {
  function formatDate(date) {
    return date.toLocaleDateString();
  }
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  return {
    formatDate,
    debounce
  };
})();

MyApp.EventManager = (function() {
  const events = new Map();
  
  function subscribe(eventName, callback) {
    if (!events.has(eventName)) {
      events.set(eventName, []);
    }
    events.get(eventName).push(callback);
    
    // Return unsubscribe function
    return function unsubscribe() {
      const callbacks = events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  function publish(eventName, data) {
    const callbacks = events.get(eventName) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${eventName}:`, error);
      }
    });
  }
  
  return {
    on: subscribe,
    emit: publish,
    getEventCount: () => events.size
  };
})();

// Usage
const unsubscribe = MyApp.EventManager.on('user-login', (user) => {
  console.log('User logged in:', MyApp.Utils.formatDate(new Date()));
});
```

**5. Augmenting Module Pattern:**
Allows extending existing modules with additional functionality.

```javascript
// Original module
const ExtendableModule = (function() {
  let data = [];
  
  return {
    add(item) {
      data.push(item);
    },
    
    getAll() {
      return [...data];
    },
    
    getCount() {
      return data.length;
    }
  };
})();

// Augment the module with new functionality
const ExtendableModule = (function(module) {
  // Private variables for the extension
  let filters = new Map();
  
  // Add new methods to existing module
  module.addFilter = function(name, filterFn) {
    filters.set(name, filterFn);
  };
  
  module.getFiltered = function(filterName) {
    const filterFn = filters.get(filterName);
    if (!filterFn) {
      throw new Error(`Filter '${filterName}' not found`);
    }
    return module.getAll().filter(filterFn);
  };
  
  module.getAvailableFilters = function() {
    return Array.from(filters.keys());
  };
  
  return module;
})(ExtendableModule);

// Usage
ExtendableModule.add({ name: 'John', age: 30 });
ExtendableModule.add({ name: 'Jane', age: 25 });
ExtendableModule.addFilter('adults', person => person.age >= 18);
console.log(ExtendableModule.getFiltered('adults'));
```

**6. Loose Augmentation (Safe Extension):**
Handles cases where the module might not exist yet.

```javascript
const SafeModule = (function(module) {
  // Private variables for this augmentation
  let enhancementData = {
    version: '1.1.0',
    features: ['enhancement1', 'enhancement2']
  };
  
  // Safely add new functionality
  module = module || {}; // Create module if it doesn't exist
  
  module.getEnhancementInfo = function() {
    return { ...enhancementData };
  };
  
  module.hasFeature = function(featureName) {
    return enhancementData.features.includes(featureName);
  };
  
  return module;
})(window.SafeModule || {});
```

**Modern Alternatives and Evolution:**

**ES6 Modules (Recommended for new projects):**
```javascript
// math-utils.js
const PI = 3.14159;
let calculations = 0;

function add(a, b) {
  calculations++;
  return a + b;
}

function getCalculationCount() {
  return calculations;
}

export { add, PI, getCalculationCount };
export default function multiply(a, b) {
  calculations++;
  return a * b;
}

// main.js
import multiply, { add, PI, getCalculationCount } from './math-utils.js';
```

**Comparison of Module Patterns:**

| Pattern | Pros | Cons | Use Case |
|---------|------|------|----------|
| Basic IIFE | Simple, immediate execution | Static, can't be extended | Small utilities |
| Revealing | Clear public API | More verbose | Complex modules |
| Parameterized | Flexible, configurable | More complex setup | Configurable libraries |
| Namespace | Organized, hierarchical | Global namespace dependency | Large applications |
| Augmenting | Extensible, modular | Can be confusing | Plugin systems |
| ES6 Modules | Native, tree-shakable | Requires build tools/modern browsers | Modern applications |

**Best Practices:**
1. **Use ES6 modules** for new projects when possible
2. **Keep public API minimal** - expose only what's necessary
3. **Return copies of data** to prevent external mutation
4. **Use consistent naming conventions** for private vs public members
5. **Document your module's API** clearly
6. **Consider memory implications** of closures in large applications
7. **Handle errors gracefully** in public methods
8. **Use TypeScript** for better module interfaces and type safety

---

## Prototypal Inheritance

### 5. How does prototypal inheritance differ from classical inheritance?
**Answer:** Understanding the fundamental difference between prototypal and classical inheritance is crucial for mastering JavaScript's object model. This difference affects how you structure code, create reusable components, and think about object relationships.

**Classical Inheritance (Class-Based):**
Found in languages like Java, C#, and C++, classical inheritance is based on the concept of classes as blueprints or templates that define the structure and behavior of objects.

**Key Characteristics of Classical Inheritance:**
1. **Classes as Templates**: Classes define what properties and methods objects will have
2. **Instantiation**: Objects are created by instantiating classes using constructors
3. **Inheritance Hierarchy**: Classes inherit from other classes, forming a rigid hierarchy
4. **Compile-Time Definition**: Class relationships are typically defined at compile time
5. **Abstract Classes/Interfaces**: Support for abstract concepts and contracts

**Prototypal Inheritance (Prototype-Based):**
JavaScript's approach where objects inherit directly from other objects without the need for classes as intermediaries.

**Key Characteristics of Prototypal Inheritance:**
1. **Objects Inherit from Objects**: Direct object-to-object inheritance
2. **Dynamic Nature**: Prototypes can be modified at runtime
3. **Flexible Hierarchy**: More flexible and dynamic inheritance chains
4. **Delegation Model**: Objects delegate property/method lookups to their prototype
5. **No Class Requirement**: Can create objects without defining classes first

**Detailed Comparison with Examples:**

```javascript
// === CLASSICAL INHERITANCE SIMULATION ===
// Traditional approach (pre-ES6) - simulating classical inheritance

// "Class" definition using constructor function
function Animal(name, species) {
  this.name = name;
  this.species = species;
  this.isAlive = true;
}

// Adding methods to the "class" prototype
Animal.prototype.eat = function(food) {
  console.log(`${this.name} is eating ${food}`);
  return this;
};

Animal.prototype.sleep = function() {
  console.log(`${this.name} is sleeping`);
  return this;
};

Animal.prototype.getInfo = function() {
  return {
    name: this.name,
    species: this.species,
    isAlive: this.isAlive
  };
};

// "Subclass" definition
function Dog(name, breed) {
  // Call parent constructor
  Animal.call(this, name, 'Canine');
  this.breed = breed;
  this.loyalty = 100;
}

// Set up inheritance chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add specific methods to subclass
Dog.prototype.bark = function() {
  console.log(`${this.name} says: Woof! Woof!`);
  return this;
};

Dog.prototype.wagTail = function() {
  console.log(`${this.name} is wagging tail happily`);
  return this;
};

// Override parent method
Dog.prototype.getInfo = function() {
  const parentInfo = Animal.prototype.getInfo.call(this);
  return {
    ...parentInfo,
    breed: this.breed,
    loyalty: this.loyalty
  };
};

// Usage
const myDog = new Dog('Buddy', 'Golden Retriever');
myDog.eat('kibble').bark().wagTail();
console.log(myDog.getInfo());

// === PURE PROTOTYPAL INHERITANCE ===
// Direct object-to-object inheritance

// Create base object (prototype)
const animalPrototype = {
  init(name, species) {
    this.name = name;
    this.species = species;
    this.isAlive = true;
    return this;
  },
  
  eat(food) {
    console.log(`${this.name} is eating ${food}`);
    return this;
  },
  
  sleep() {
    console.log(`${this.name} is sleeping`);
    return this;
  },
  
  getInfo() {
    return {
      name: this.name,
      species: this.species,
      isAlive: this.isAlive
    };
  }
};

// Create more specific prototype that inherits from animalPrototype
const dogPrototype = Object.create(animalPrototype);

// Add dog-specific methods
dogPrototype.initDog = function(name, breed) {
  this.init(name, 'Canine');
  this.breed = breed;
  this.loyalty = 100;
  return this;
};

dogPrototype.bark = function() {
  console.log(`${this.name} says: Woof! Woof!`);
  return this;
};

dogPrototype.wagTail = function() {
  console.log(`${this.name} is wagging tail happily`);
  return this;
};

// Override parent method
dogPrototype.getInfo = function() {
  const parentInfo = animalPrototype.getInfo.call(this);
  return {
    ...parentInfo,
    breed: this.breed,
    loyalty: this.loyalty
  };
};

// Create instances directly from prototypes
const myPrototypalDog = Object.create(dogPrototype).initDog('Max', 'Labrador');
myPrototypalDog.eat('treat').bark().wagTail();
console.log(myPrototypalDog.getInfo());

// === MODERN ES6 CLASS SYNTAX ===
// Syntactic sugar over prototypal inheritance

class ModernAnimal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.isAlive = true;
  }
  
  eat(food) {
    console.log(`${this.name} is eating ${food}`);
    return this;
  }
  
  sleep() {
    console.log(`${this.name} is sleeping`);
    return this;
  }
  
  getInfo() {
    return {
      name: this.name,
      species: this.species,
      isAlive: this.isAlive
    };
  }
}

class ModernDog extends ModernAnimal {
  constructor(name, breed) {
    super(name, 'Canine');
    this.breed = breed;
    this.loyalty = 100;
  }
  
  bark() {
    console.log(`${this.name} says: Woof! Woof!`);
    return this;
  }
  
  wagTail() {
    console.log(`${this.name} is wagging tail happily`);
    return this;
  }
  
  getInfo() {
    const parentInfo = super.getInfo();
    return {
      ...parentInfo,
      breed: this.breed,
      loyalty: this.loyalty
    };
  }
}

// Usage (same interface as classical approach)
const modernDog = new ModernDog('Charlie', 'Beagle');
modernDog.eat('bone').bark().wagTail();
```

**Advanced Prototypal Patterns:**

```javascript
// Factory Pattern with Prototypal Inheritance
const createAnimal = (function() {
  // Shared prototype for all animals
  const animalMethods = {
    eat(food) {
      console.log(`${this.name} eats ${food}`);
      this.energy += 10;
      return this;
    },
    
    rest() {
      console.log(`${this.name} is resting`);
      this.energy += 5;
      return this;
    },
    
    getStatus() {
      return `${this.name} (${this.species}) - Energy: ${this.energy}`;
    }
  };
  
  return function(name, species, specialAbilities = {}) {
    // Create object with animalMethods as prototype
    const animal = Object.create(animalMethods);
    
    // Initialize properties
    animal.name = name;
    animal.species = species;
    animal.energy = 50;
    animal.createdAt = new Date();
    
    // Add special abilities
    Object.assign(animal, specialAbilities);
    
    return animal;
  };
})();

// Create animals with different abilities
const eagle = createAnimal('Eagle', 'Bird', {
  fly() {
    console.log(`${this.name} soars through the sky`);
    this.energy -= 5;
    return this;
  }
});

const fish = createAnimal('Nemo', 'Fish', {
  swim() {
    console.log(`${this.name} swims gracefully`);
    this.energy -= 3;
    return this;
  }
});

// Mixin Pattern for Multiple Inheritance
const flyingMixin = {
  fly() {
    console.log(`${this.name} is flying`);
    return this;
  },
  
  land() {
    console.log(`${this.name} has landed`);
    return this;
  }
};

const swimmingMixin = {
  swim() {
    console.log(`${this.name} is swimming`);
    return this;
  },
  
  dive() {
    console.log(`${this.name} dives deep`);
    return this;
  }
};

// Create a duck that can both fly and swim
function createDuck(name) {
  const duck = createAnimal(name, 'Duck');
  
  // Mix in abilities
  Object.assign(duck, flyingMixin, swimmingMixin);
  
  // Override methods for duck-specific behavior
  const originalFly = duck.fly;
  duck.fly = function() {
    console.log(`${this.name} flaps wings and takes off`);
    return originalFly.call(this);
  };
  
  return duck;
}

const duck = createDuck('Donald');
duck.eat('bread').swim().fly().land();
```

**Key Differences Summary:**

| Aspect | Classical Inheritance | Prototypal Inheritance |
|--------|----------------------|------------------------|
| **Foundation** | Classes as blueprints | Objects as prototypes |
| **Creation** | `new ClassName()` | `Object.create()` or direct cloning |
| **Flexibility** | Rigid hierarchy | Dynamic, flexible chains |
| **Runtime Changes** | Limited | Full prototype modification |
| **Memory Usage** | Methods in class prototype | Methods can be anywhere in chain |
| **Complexity** | More structured | More flexible but potentially confusing |
| **Performance** | Slightly faster method lookup | Slightly slower due to delegation |

**Advantages of Prototypal Inheritance:**
1. **Greater Flexibility**: Can modify inheritance chains at runtime
2. **Less Boilerplate**: No need for complex class hierarchies
3. **Natural to JavaScript**: Works with the language's native behavior
4. **Dynamic Composition**: Easy to mix and match behaviors
5. **Memory Efficiency**: Can share methods across many objects efficiently

**Disadvantages of Prototypal Inheritance:**
1. **Learning Curve**: Can be confusing for developers from classical languages
2. **Less Structured**: Can lead to inconsistent object creation patterns
3. **Debugging Complexity**: Prototype chains can be harder to trace
4. **Tool Support**: Some IDEs provide better support for class-based patterns

**Best Practices:**
1. **Use ES6 classes** for familiar syntax while leveraging prototypal inheritance underneath
2. **Understand the prototype chain** to debug effectively
3. **Use `Object.create()`** when you need pure prototypal inheritance
4. **Consider composition over inheritance** for complex behaviors
5. **Use mixins** for multiple inheritance scenarios
6. **Be consistent** in your approach within a project

### 6. What's the difference between `__proto__` and `prototype`?
**Answer:** The distinction between `__proto__` and `prototype` is one of the most confusing aspects of JavaScript for developers coming from other languages. Understanding this difference is crucial for mastering JavaScript's inheritance model and debugging prototype-related issues.

**`prototype` Property:**
- **Only exists on functions** (constructor functions and regular functions)
- **Used as a template** for creating the `__proto__` property of instances
- **Set at function definition time** and typically modified to add methods
- **Not part of the prototype chain** itself - it's a property that points to an object
- **Accessed directly** as `functionName.prototype`

**`__proto__` Property:**
- **Exists on all objects** (except objects created with `Object.create(null)`)
- **The actual link** in the prototype chain used for property lookup
- **Points to the prototype** of the constructor function that created the object
- **Part of the inheritance mechanism** - used during property resolution
- **Deprecated in favor of** `Object.getPrototypeOf()` and `Object.setPrototypeOf()`

**Detailed Explanation with Examples:**

```javascript
// === CONSTRUCTOR FUNCTION EXAMPLE ===
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to the prototype (this is what gets inherited)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

Person.prototype.species = 'Homo sapiens'; // Shared property

// Create instances
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

// === UNDERSTANDING THE RELATIONSHIPS ===

console.log('=== Function.prototype vs Instance.__proto__ ===');
console.log(Person.prototype); // Object with greet, getAge methods
console.log(john.__proto__); // Same object as Person.prototype
console.log(john.__proto__ === Person.prototype); // true

console.log('=== Property Lookup Chain ===');
// When accessing john.greet(), JavaScript looks:
// 1. john object directly - not found
// 2. john.__proto__ (which is Person.prototype) - found!
console.log(john.greet()); // "Hello, I'm John"

console.log('=== Prototype Chain Visualization ===');
console.log('john object:', john);
console.log('john.__proto__:', john.__proto__);
console.log('john.__proto__.__proto__:', john.__proto__.__proto__); // Object.prototype
console.log('john.__proto__.__proto__.__proto__:', john.__proto__.__proto__.__proto__); // null

// === MODIFYING PROTOTYPES AT RUNTIME ===
console.log('=== Runtime Prototype Modification ===');

// Add new method to prototype - affects all instances
Person.prototype.sayGoodbye = function() {
  return `Goodbye from ${this.name}`;
};

// Both existing and new instances get the method
console.log(john.sayGoodbye()); // "Goodbye from John"
console.log(jane.sayGoodbye()); // "Goodbye from Jane"

// === CONSTRUCTOR PROPERTY ===
console.log('=== Constructor Property ===');
console.log(john.constructor === Person); // true
console.log(john.constructor === john.__proto__.constructor); // true
console.log(Person.prototype.constructor === Person); // true

// === DEEPER PROTOTYPE CHAIN EXAMPLE ===
function Employee(name, age, jobTitle) {
  Person.call(this, name, age); // Call parent constructor
  this.jobTitle = jobTitle;
}

// Set up inheritance
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// Add Employee-specific methods
Employee.prototype.work = function() {
  return `${this.name} is working as a ${this.jobTitle}`;
};

Employee.prototype.greet = function() {
  // Override parent method
  return `Hello, I'm ${this.name} and I work as a ${this.jobTitle}`;
};

const developer = new Employee('Alice', 28, 'Developer');

console.log('=== Inheritance Chain ===');
console.log(developer.greet()); // Uses Employee's version
console.log(developer.getAge()); // Inherited from Person
console.log(developer.work()); // Employee-specific method

// Prototype chain: developer -> Employee.prototype -> Person.prototype -> Object.prototype -> null
console.log('developer.__proto__ === Employee.prototype:', developer.__proto__ === Employee.prototype);
console.log('Employee.prototype.__proto__ === Person.prototype:', Employee.prototype.__proto__ === Person.prototype);
console.log('Person.prototype.__proto__ === Object.prototype:', Person.prototype.__proto__ === Object.prototype);

// === PRACTICAL DIFFERENCES DEMONSTRATION ===
console.log('=== Practical Differences ===');

// prototype is a property of functions
console.log('typeof Person.prototype:', typeof Person.prototype); // "object"
console.log('Person.hasOwnProperty("prototype"):', Person.hasOwnProperty('prototype')); // true

// __proto__ is a property of objects (instances)
console.log('john.hasOwnProperty("__proto__"):', john.hasOwnProperty('__proto__')); // false (it's inherited)
console.log('john.__proto__ !== undefined:', john.__proto__ !== undefined); // true

// Functions also have __proto__ (they're objects too)
console.log('Person.__proto__ === Function.prototype:', Person.__proto__ === Function.prototype); // true

// === MODERN ALTERNATIVES ===
console.log('=== Modern Alternatives to __proto__ ===');

// Instead of using __proto__ directly, use these methods:
const prototypeOfJohn = Object.getPrototypeOf(john);
console.log('Object.getPrototypeOf(john) === Person.prototype:', prototypeOfJohn === Person.prototype);

// Setting prototype (not recommended for performance reasons)
const newObj = {};
Object.setPrototypeOf(newObj, Person.prototype);
console.log('Object.getPrototypeOf(newObj) === Person.prototype:', Object.getPrototypeOf(newObj) === Person.prototype);

// Better: use Object.create()
const betterObj = Object.create(Person.prototype);
console.log('Object.getPrototypeOf(betterObj) === Person.prototype:', Object.getPrototypeOf(betterObj) === Person.prototype);

// === COMMON PITFALLS AND DEBUGGING ===
console.log('=== Common Pitfalls ===');

// Mistake 1: Assigning to prototype instead of prototype properties
// Wrong:
// Person.prototype = { someMethod: function() {} }; // Breaks constructor property

// Right:
Person.prototype.someMethod = function() {
  return 'This is the correct way';
};

// Mistake 2: Modifying __proto__ directly (performance impact)
// Wrong:
// john.__proto__ = someOtherPrototype; // Avoid this

// Right:
// Use Object.setPrototypeOf() if absolutely necessary, or better yet, Object.create()

// === DEBUGGING PROTOTYPE CHAINS ===
function debugPrototypeChain(obj, objName = 'object') {
  console.log(`\n=== Prototype Chain for ${objName} ===`);
  let current = obj;
  let level = 0;
  
  while (current !== null) {
    const constructor = current.constructor ? current.constructor.name : 'Unknown';
    const ownProps = Object.getOwnPropertyNames(current).filter(prop => 
      prop !== '__proto__' && prop !== 'constructor'
    );
    
    console.log(`Level ${level}: ${constructor}`);
    console.log(`  Own properties: [${ownProps.join(', ')}]`);
    console.log(`  Object:`, current);
    
    current = Object.getPrototypeOf(current);
    level++;
    
    if (level > 10) { // Prevent infinite loops
      console.log('  ... (stopping to prevent infinite loop)');
      break;
    }
  }
}

// Debug the prototype chains
debugPrototypeChain(john, 'john');
debugPrototypeChain(developer, 'developer');
debugPrototypeChain(Person, 'Person function');

// === ES6 CLASS COMPARISON ===
console.log('=== ES6 Classes (Same Prototype Mechanism) ===');

class ModernPerson {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

const modernJohn = new ModernPerson('John', 30);

// Same relationships apply!
console.log('modernJohn.__proto__ === ModernPerson.prototype:', modernJohn.__proto__ === ModernPerson.prototype);
console.log('ModernPerson.prototype.constructor === ModernPerson:', ModernPerson.prototype.constructor === ModernPerson);

// Classes are just syntactic sugar over the prototype system
console.log('typeof ModernPerson:', typeof ModernPerson); // "function"
console.log('ModernPerson.prototype:', ModernPerson.prototype);
```

**Visual Representation:**
```
Constructor Function:     Person
                         ↓ (has property)
Function.prototype → Person.prototype ← (points to) john.__proto__
                         ↑                              ↑
                    (constructor)                 (instance of)
                         ↑                              ↑
                    Person.prototype.constructor    john (object)
```

**Key Takeaways:**

1. **`prototype`** is a property of constructor functions that serves as a template
2. **`__proto__`** is the actual link in the inheritance chain for instances
3. **When you call `new`**, the new object's `__proto__` is set to the constructor's `prototype`
4. **Method lookup** follows the `__proto__` chain, not the `prototype` property
5. **Modifying `Constructor.prototype`** affects all instances created from that constructor
6. **Use modern methods** like `Object.getPrototypeOf()` instead of `__proto__`

**Common Interview Questions Clarified:**
- **Q: Why does `john.__proto__ === Person.prototype`?**
  A: Because `new Person()` sets the new object's `__proto__` to `Person.prototype`

- **Q: What happens when you modify `Person.prototype`?**
  A: All existing and future instances inherit the changes through their `__proto__` link

- **Q: Why shouldn't you modify `__proto__` directly?**
  A: It can cause performance issues and is deprecated; use `Object.setPrototypeOf()` or `Object.create()`

### 7. How do you implement inheritance without ES6 classes?
**Answer:** Using constructor functions and prototype chain:

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};
```

### 8. Explain the prototype pollution vulnerability
**Answer:** Prototype pollution occurs when an attacker can modify the prototype of base objects, affecting all objects in the application:

```javascript
// Vulnerable code
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  return target;
}

// Attack
merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
console.log({}.isAdmin); // true - all objects now have isAdmin
```

---

## Asynchronous JavaScript

### 9. Explain the difference between microtasks and macrotasks
**Answer:** 
- **Microtasks**: Promises, queueMicrotask, MutationObserver (higher priority)
- **Macrotasks**: setTimeout, setInterval, I/O operations (lower priority)

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

### 10. How do you handle errors in async/await vs Promises?
**Answer:**

```javascript
// Promises
promise
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Async/await
try {
  const result = await promise;
  console.log(result);
} catch (error) {
  console.error(error);
}

// Multiple async operations
const results = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
]);
```

### 11. What's the difference between Promise.all() and Promise.allSettled()?
**Answer:**
- `Promise.all()`: Fails fast - rejects if any promise rejects
- `Promise.allSettled()`: Waits for all promises to complete, regardless of outcome

### 12. How do you implement a custom Promise?
**Answer:**

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = [];
      }
    };
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.handlers.forEach(this.handle.bind(this));
        this.handlers = [];
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve,
        reject
      });
    });
  }
  
  handle(handler) {
    if (this.state === 'pending') {
      this.handlers.push(handler);
      return;
    }
    
    if (this.state === 'fulfilled' && handler.onFulfilled) {
      try {
        const result = handler.onFulfilled(this.value);
        handler.resolve(result);
      } catch (error) {
        handler.reject(error);
      }
    }
    
    if (this.state === 'rejected' && handler.onRejected) {
      try {
        const result = handler.onRejected(this.value);
        handler.resolve(result);
      } catch (error) {
        handler.reject(error);
      }
    }
  }
}
```

---

## Event Loop and Concurrency

### 13. Explain how the JavaScript event loop works
**Answer:** The event loop continuously checks the call stack and task queues:
1. Execute all synchronous code (call stack)
2. Process all microtasks
3. Process one macrotask
4. Repeat

### 14. What's the difference between setTimeout(fn, 0) and setImmediate()?
**Answer:** 
- `setTimeout(fn, 0)`: Minimum 1ms delay, macrotask queue
- `setImmediate()`: Node.js only, executes after I/O events

### 15. How do you implement a debounce function?
**Answer:**

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);
```

### 16. How do you implement a throttle function?
**Answer:**

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

---

## Memory Management

### 17. What are memory leaks and how do you prevent them?
**Answer:** Memory leaks occur when objects are no longer needed but still referenced, preventing garbage collection:

```javascript
// Common memory leaks and solutions

// 1. Global variables - avoid or clean up
window.myGlobalVar = new Array(1000000);
// Solution: Use modules or clean up when done
delete window.myGlobalVar;

// 2. Event listeners not removed
const handler = () => console.log('clicked');
element.addEventListener('click', handler);
// Solution: Always remove listeners
element.removeEventListener('click', handler);

// 3. Closures holding unnecessary references
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  const smallData = 'needed';
  
  // Bad: closure keeps reference to largeData
  return function badHandler() {
    console.log(smallData);
    // largeData is accessible but not used
  };
  
  // Good: explicitly null unused references
  largeData = null;
  return function goodHandler() {
    console.log(smallData);
  };
}

// 4. Timers and intervals not cleared
const intervalId = setInterval(() => {
  // Do something with DOM elements
  updateUI();
}, 1000);
// Solution: Clear when component unmounts
clearInterval(intervalId);

// 5. DOM references after removal
let detachedNodes = [];
function createNodes() {
  const parent = document.getElementById('container');
  for (let i = 0; i < 1000; i++) {
    const node = document.createElement('div');
    parent.appendChild(node);
    detachedNodes.push(node); // Keeps reference after removal
  }
}
// Solution: Clear references
detachedNodes = [];

// 6. Circular references (less common in modern JS)
function createCircularRef() {
  const obj1 = {};
  const obj2 = {};
  obj1.ref = obj2;
  obj2.ref = obj1;
  return obj1;
}
```

**Memory Leak Detection Tools:**
```javascript
// Performance API for memory monitoring
function monitorMemory() {
  if (performance.memory) {
    const memory = performance.memory;
    console.log({
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    });
  }
}

// Memory leak detector utility
class MemoryLeakDetector {
  constructor() {
    this.snapshots = [];
    this.threshold = 10 * 1024 * 1024; // 10MB
  }
  
  takeSnapshot() {
    if (performance.memory) {
      this.snapshots.push({
        timestamp: Date.now(),
        used: performance.memory.usedJSHeapSize
      });
      
      if (this.snapshots.length > 2) {
        this.checkForLeaks();
      }
    }
  }
  
  checkForLeaks() {
    const recent = this.snapshots.slice(-3);
    const growth = recent[2].used - recent[0].used;
    
    if (growth > this.threshold) {
      console.warn('Potential memory leak detected:', {
        growth: `${(growth / 1024 / 1024).toFixed(2)}MB`,
        timespan: recent[2].timestamp - recent[0].timestamp
      });
    }
  }
}
```

### 18. How does garbage collection work in JavaScript?
**Answer:** JavaScript uses automatic memory management with several GC algorithms:

**Mark-and-Sweep Algorithm (Primary):**
```javascript
// 1. Mark Phase: Start from roots (global objects, stack variables)
const roots = [window, document, stack_variables];

// 2. Mark all reachable objects
function markReachable(obj, visited = new Set()) {
  if (visited.has(obj)) return;
  visited.add(obj);
  
  // Mark object as reachable
  obj.__marked = true;
  
  // Recursively mark referenced objects
  for (const prop in obj) {
    if (typeof obj[prop] === 'object' && obj[prop] !== null) {
      markReachable(obj[prop], visited);
    }
  }
}

// 3. Sweep Phase: Delete unmarked objects
function sweep(heap) {
  heap.forEach(obj => {
    if (!obj.__marked) {
      delete obj; // Free memory
    } else {
      delete obj.__marked; // Clean mark for next cycle
    }
  });
}
```

**Generational Garbage Collection:**
```javascript
// Modern engines use generational hypothesis:
// "Most objects die young"

class GenerationalGC {
  constructor() {
    this.youngGeneration = new Set(); // Eden space
    this.oldGeneration = new Set();   // Tenured space
    this.survivorCount = new Map();
  }
  
  allocateObject(obj) {
    this.youngGeneration.add(obj);
    this.survivorCount.set(obj, 0);
  }
  
  minorGC() {
    // Collect young generation frequently
    const survivors = new Set();
    
    this.youngGeneration.forEach(obj => {
      if (this.isReachable(obj)) {
        const count = this.survivorCount.get(obj) + 1;
        this.survivorCount.set(obj, count);
        
        if (count > 2) {
          // Promote to old generation
          this.oldGeneration.add(obj);
        } else {
          survivors.add(obj);
        }
      }
    });
    
    this.youngGeneration = survivors;
  }
  
  majorGC() {
    // Collect old generation less frequently
    const survivors = new Set();
    
    this.oldGeneration.forEach(obj => {
      if (this.isReachable(obj)) {
        survivors.add(obj);
      }
    });
    
    this.oldGeneration = survivors;
  }
}
```

**Incremental and Concurrent GC:**
```javascript
// Modern engines use incremental GC to avoid blocking
class IncrementalGC {
  constructor() {
    this.workQueue = [];
    this.timeSlice = 5; // 5ms per slice
  }
  
  scheduleGC() {
    // Break GC work into small chunks
    const startTime = performance.now();
    
    while (this.workQueue.length > 0 && 
           performance.now() - startTime < this.timeSlice) {
      const work = this.workQueue.shift();
      this.processGCWork(work);
    }
    
    if (this.workQueue.length > 0) {
      // Schedule next slice
      setTimeout(() => this.scheduleGC(), 0);
    }
  }
}
```

**GC Optimization Strategies:**
```javascript
// Object pooling to reduce GC pressure
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.maxSize = maxSize;
  }
  
  acquire() {
    return this.pool.length > 0 ? 
           this.pool.pop() : 
           this.createFn();
  }
  
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Usage example
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (obj) => { obj.x = 0; obj.y = 0; }
);

function processVectors(count) {
  const vectors = [];
  
  // Acquire from pool instead of creating new
  for (let i = 0; i < count; i++) {
    vectors.push(vectorPool.acquire());
  }
  
  // Process vectors...
  
  // Return to pool
  vectors.forEach(v => vectorPool.release(v));
}
```

### 19. What's the difference between WeakMap, WeakSet, Map, and Set?
**Answer:** Understanding weak references is crucial for memory management:

```javascript
// Map vs WeakMap
let obj = { name: 'John' };

// Map - strong references
const map = new Map();
map.set(obj, 'metadata');
map.set('key', 'value');

console.log(map.size); // 2
console.log(map.has(obj)); // true

// WeakMap - weak references (keys only)
const weakMap = new WeakMap();
weakMap.set(obj, 'metadata');
// weakMap.set('key', 'value'); // TypeError: key must be object

// No size property, not enumerable
// console.log(weakMap.size); // undefined
// console.log([...weakMap]); // TypeError

obj = null; // WeakMap entry can be garbage collected
// Map entry keeps the original object alive

// Set vs WeakSet
let user = { id: 1, name: 'John' };

// Set - strong references
const set = new Set();
set.add(user);
set.add('string');
console.log(set.size); // 2

// WeakSet - weak references (values must be objects)
const weakSet = new WeakSet();
weakSet.add(user);
// weakSet.add('string'); // TypeError: value must be object

user = null; // WeakSet entry can be garbage collected
```

**Practical Use Cases:**
```javascript
// 1. Private data using WeakMap
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name;
    // Store sensitive data privately
    privateData.set(this, { ssn });
  }
  
  getSSN() {
    return privateData.get(this).ssn;
  }
}

// When User instance is deleted, private data is also cleaned up

// 2. DOM event cleanup tracking
const elementListeners = new WeakMap();

function addListener(element, event, handler) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Map());
  }
  
  element.addEventListener(event, handler);
  elementListeners.get(element).set(event, handler);
}

function removeAllListeners(element) {
  const listeners = elementListeners.get(element);
  if (listeners) {
    listeners.forEach((handler, event) => {
      element.removeEventListener(event, handler);
    });
    elementListeners.delete(element);
  }
}

// 3. Visited objects tracking
const visitedObjects = new WeakSet();

function processObject(obj) {
  if (visitedObjects.has(obj)) {
    return; // Already processed
  }
  
  visitedObjects.add(obj);
  // Process object...
}

// 4. Cache with automatic cleanup
class Cache {
  constructor() {
    this.cache = new WeakMap();
  }
  
  get(obj) {
    return this.cache.get(obj);
  }
  
  set(obj, value) {
    this.cache.set(obj, value);
  }
  
  // No need for manual cleanup - when obj is GC'd, cache entry is too
}
```

### 20. How do you optimize memory usage in JavaScript applications?
**Answer:** Memory optimization involves multiple strategies:

**1. Efficient Data Structures:**
```javascript
// Use appropriate data structures
// Array vs Set for uniqueness checks
const items = ['a', 'b', 'c', 'd', 'e'];

// Inefficient - O(n) lookup
function hasItemArray(item) {
  return items.indexOf(item) !== -1;
}

// Efficient - O(1) lookup
const itemsSet = new Set(items);
function hasItemSet(item) {
  return itemsSet.has(item);
}

// Typed arrays for numeric data
const regularArray = new Array(1000000).fill(0);     // ~8MB
const typedArray = new Float32Array(1000000);        // ~4MB
const intArray = new Int16Array(1000000);            // ~2MB

// Sparse arrays - only store defined indices
const sparseArray = [];
sparseArray[1000000] = 'value'; // Only stores one element
```

**2. Memory-Efficient Algorithms:**
```javascript
// Streaming data processing instead of loading all
function* processLargeDataset(data) {
  for (let i = 0; i < data.length; i += 1000) {
    const chunk = data.slice(i, i + 1000);
    yield processChunk(chunk);
  }
}

// Use generators for lazy evaluation
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take only what you need
const first10Fib = Array.from(
  { length: 10 }, 
  (_, i) => fibonacci().next().value
);

// String interning for repeated strings
class StringInterner {
  constructor() {
    this.pool = new Map();
  }
  
  intern(str) {
    if (!this.pool.has(str)) {
      this.pool.set(str, str);
    }
    return this.pool.get(str);
  }
}

const interner = new StringInterner();
// Multiple references to same string instance
const str1 = interner.intern('common string');
const str2 = interner.intern('common string');
console.log(str1 === str2); // true - same reference
```

**3. DOM Memory Management:**
```javascript
// Efficient DOM manipulation
class DOMManager {
  constructor() {
    this.elementCache = new Map();
    this.observers = new Set();
  }
  
  // Reuse elements instead of creating new ones
  getElement(tag, className) {
    const key = `${tag}.${className}`;
    
    if (!this.elementCache.has(key)) {
      const element = document.createElement(tag);
      element.className = className;
      this.elementCache.set(key, [element]);
    }
    
    const cache = this.elementCache.get(key);
    return cache.length > 0 ? cache.pop() : this.createElement(tag, className);
  }
  
  releaseElement(element) {
    const key = `${element.tagName.toLowerCase()}.${element.className}`;
    const cache = this.elementCache.get(key) || [];
    
    // Clean element before returning to pool
    element.innerHTML = '';
    element.removeAttribute('style');
    
    cache.push(element);
  }
  
  // Clean up observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.elementCache.clear();
  }
}

// Virtual scrolling for large lists
class VirtualList {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.visibleItems = new Map();
    this.setupScrolling();
  }
  
  setupScrolling() {
    this.container.addEventListener('scroll', () => {
      this.updateVisibleItems();
    });
  }
  
  updateVisibleItems() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
    
    // Remove items that are no longer visible
    this.visibleItems.forEach((element, index) => {
      if (index < startIndex || index > endIndex) {
        element.remove();
        this.visibleItems.delete(index);
      }
    });
    
    // Add newly visible items
    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        const element = this.renderItem(i);
        element.style.position = 'absolute';
        element.style.top = `${i * this.itemHeight}px`;
        this.container.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
}
```

**4. Memory Profiling and Monitoring:**
```javascript
// Memory usage monitoring
class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.isMonitoring = false;
  }
  
  start(interval = 1000) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.intervalId = setInterval(() => {
      this.takeMeasurement();
    }, interval);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isMonitoring = false;
    }
  }
  
  takeMeasurement() {
    if (!performance.memory) return;
    
    const measurement = {
      timestamp: Date.now(),
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    };
    
    this.measurements.push(measurement);
    
    // Keep only last 100 measurements
    if (this.measurements.length > 100) {
      this.measurements.shift();
    }
    
    this.checkForLeaks(measurement);
  }
  
  checkForLeaks(current) {
    if (this.measurements.length < 10) return;
    
    const baseline = this.measurements[this.measurements.length - 10];
    const growth = current.used - baseline.used;
    const timespan = current.timestamp - baseline.timestamp;
    
    // Alert if memory grows more than 5MB in 10 seconds
    if (growth > 5 * 1024 * 1024 && timespan < 10000) {
      console.warn('Potential memory leak detected:', {
        growth: `${(growth / 1024 / 1024).toFixed(2)}MB`,
        rate: `${(growth / timespan * 1000).toFixed(2)}B/s`
      });
    }
  }
  
  getReport() {
    if (this.measurements.length === 0) return null;
    
    const latest = this.measurements[this.measurements.length - 1];
    const oldest = this.measurements[0];
    
    return {
      current: {
        used: `${(latest.used / 1024 / 1024).toFixed(2)}MB`,
        total: `${(latest.total / 1024 / 1024).toFixed(2)}MB`,
        utilization: `${(latest.used / latest.total * 100).toFixed(1)}%`
      },
      trend: {
        growth: `${((latest.used - oldest.used) / 1024 / 1024).toFixed(2)}MB`,
        timespan: `${((latest.timestamp - oldest.timestamp) / 1000).toFixed(1)}s`
      }
    };
  }
}

// Usage
const monitor = new MemoryMonitor();
monitor.start();

// Later...
console.log(monitor.getReport());
```

### 21. How do you handle memory in Worker threads and SharedArrayBuffer?
**Answer:** Modern JavaScript provides advanced memory sharing capabilities:

```javascript
// SharedArrayBuffer for zero-copy data sharing
if (typeof SharedArrayBuffer !== 'undefined') {
  // Create shared memory buffer
  const sharedBuffer = new SharedArrayBuffer(1024);
  const sharedArray = new Int32Array(sharedBuffer);
  
  // Main thread
  const worker = new Worker('worker.js');
  worker.postMessage({ sharedBuffer });
  
  // Write to shared memory
  sharedArray[0] = 42;
  
  // Atomic operations for thread safety
  Atomics.store(sharedArray, 1, 100);
  const value = Atomics.load(sharedArray, 1);
  
  // Atomic wait/notify for synchronization
  Atomics.wait(sharedArray, 2, 0); // Wait until index 2 is not 0
  Atomics.notify(sharedArray, 2, 1); // Wake up one waiter
}

// worker.js
self.onmessage = function(e) {
  const { sharedBuffer } = e.data;
  const sharedArray = new Int32Array(sharedBuffer);
  
  // Read from shared memory
  console.log('Shared value:', sharedArray[0]); // 42
  
  // Atomic increment
  Atomics.add(sharedArray, 1, 1);
  
  // Signal completion
  Atomics.store(sharedArray, 2, 1);
  Atomics.notify(sharedArray, 2, 1);
};

// Memory-efficient worker communication
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.taskQueue = [];
    this.availableWorkers = [];
    
    // Create shared buffer for large data
    this.sharedBuffer = new SharedArrayBuffer(1024 * 1024); // 1MB
    this.sharedArray = new Float32Array(this.sharedBuffer);
    
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.handleWorkerMessage(worker, e);
      worker.postMessage({ sharedBuffer: this.sharedBuffer });
      
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }
  
  async processData(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      
      if (this.availableWorkers.length > 0) {
        this.assignTask(task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }
  
  assignTask(task) {
    const worker = this.availableWorkers.pop();
    
    // Copy data to shared buffer instead of postMessage
    const dataArray = new Float32Array(task.data);
    this.sharedArray.set(dataArray, 0);
    
    worker.postMessage({
      type: 'process',
      dataLength: dataArray.length,
      taskId: Date.now()
    });
    
    worker.currentTask = task;
  }
  
  handleWorkerMessage(worker, event) {
    const { type, result, error } = event.data;
    
    if (type === 'complete') {
      const task = worker.currentTask;
      worker.currentTask = null;
      
      if (error) {
        task.reject(new Error(error));
      } else {
        task.resolve(result);
      }
      
      this.availableWorkers.push(worker);
      
      // Process next task if available
      if (this.taskQueue.length > 0) {
        this.assignTask(this.taskQueue.shift());
      }
    }
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
  }
}
```

---

## Advanced Functions

### 20. Explain currying and provide a practical example
**Answer:**

```javascript
// Manual currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Usage
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

### 21. What's function composition and how do you implement it?
**Answer:**

```javascript
const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

// Usage
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composedFn = compose(square, double, addOne);
console.log(composedFn(3)); // ((3 + 1) * 2)^2 = 64

const pipedFn = pipe(addOne, double, square);
console.log(pipedFn(3)); // ((3 + 1) * 2)^2 = 64
```

### 22. How do you implement memoization?
**Answer:**

```javascript
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
const fibonacci = memoize(function(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

### 23. Explain partial application vs currying
**Answer:**
- **Currying**: Transform function to take one argument at a time
- **Partial application**: Fix some arguments, return function with remaining parameters

```javascript
// Partial application
function partial(fn, ...presetArgs) {
  return function(...remainingArgs) {
    return fn(...presetArgs, ...remainingArgs);
  };
}

const add = (a, b, c) => a + b + c;
const addFiveAndTwo = partial(add, 5, 2);
console.log(addFiveAndTwo(3)); // 10
```

---

## Modules and Bundling

### 24. What's the difference between CommonJS and ES modules?
**Answer:**
- **CommonJS**: Synchronous, `require()`/`module.exports`, Node.js default
- **ES Modules**: Asynchronous, `import`/`export`, browser native, static analysis

```javascript
// CommonJS
const fs = require('fs');
module.exports = { myFunction };

// ES Modules
import fs from 'fs';
export { myFunction };
export default myClass;
```

### 25. How do dynamic imports work?
**Answer:**

```javascript
// Dynamic import returns a Promise
async function loadModule() {
  try {
    const module = await import('./myModule.js');
    module.default();
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}

// Conditional loading
if (condition) {
  import('./heavyModule.js').then(module => {
    module.initializeFeature();
  });
}
```

### 26. Explain tree shaking and how it works
**Answer:** Tree shaking eliminates dead code by analyzing ES module imports/exports statically:

```javascript
// utils.js
export const usedFunction = () => 'used';
export const unusedFunction = () => 'unused'; // Will be removed

// main.js
import { usedFunction } from './utils.js'; // Only this will be bundled
```

---

## Performance Optimization

### 27. How do you optimize JavaScript performance?
**Answer:**
1. **Minimize DOM manipulation**
2. **Use efficient algorithms and data structures**
3. **Implement lazy loading**
4. **Use Web Workers for heavy computations**
5. **Optimize memory usage**
6. **Use requestAnimationFrame for animations**

```javascript
// Efficient DOM manipulation
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const element = document.createElement('div');
  element.textContent = item;
  fragment.appendChild(element);
});
container.appendChild(fragment);

// Web Worker example
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataSet });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

### 28. What's the difference between `requestAnimationFrame` and `setTimeout`?
**Answer:**
- `requestAnimationFrame`: Syncs with display refresh rate (~60fps), paused when tab inactive
- `setTimeout`: Fixed interval, continues when tab inactive

### 29. How do you measure JavaScript performance?
**Answer:**

```javascript
// Performance API
const start = performance.now();
expensiveOperation();
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);

// Memory usage
console.log(performance.memory);

// User Timing API
performance.mark('start-operation');
expensiveOperation();
performance.mark('end-operation');
performance.measure('operation-duration', 'start-operation', 'end-operation');
```

---

## Design Patterns

### 30. Implement the Observer pattern
**Answer:**

```javascript
class Observable {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }
  
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

// Usage
const observable = new Observable();
const unsubscribe = observable.subscribe(data => console.log('Observer 1:', data));
observable.notify('Hello World');
```

### 31. Implement the Singleton pattern
**Answer:**

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.data = {};
    Singleton.instance = this;
  }
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// Usage
const instance1 = new Singleton();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

### 32. Implement the Factory pattern
**Answer:**

```javascript
class AnimalFactory {
  static createAnimal(type, name) {
    switch (type) {
      case 'dog':
        return new Dog(name);
      case 'cat':
        return new Cat(name);
      default:
        throw new Error('Unknown animal type');
    }
  }
}

class Dog {
  constructor(name) {
    this.name = name;
    this.type = 'dog';
  }
  
  speak() {
    return `${this.name} barks`;
  }
}

class Cat {
  constructor(name) {
    this.name = name;
    this.type = 'cat';
  }
  
  speak() {
    return `${this.name} meows`;
  }
}
```

---

## Browser APIs

### 33. How do you use the Intersection Observer API?
**Answer:**

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is visible
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
});

// Observe elements
document.querySelectorAll('.lazy-load').forEach(el => {
  observer.observe(el);
});
```

### 34. How do you implement service workers?
**Answer:**

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}

// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 35. How do you use the Fetch API with advanced options?
**Answer:**

```javascript
const controller = new AbortController();

fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ data: 'value' }),
  signal: controller.signal,
  credentials: 'include',
  cache: 'no-cache'
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => {
  if (error.name === 'AbortError') {
    console.log('Request was aborted');
  } else {
    console.error('Fetch error:', error);
  }
});

// Cancel request after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

---

## ES6+ Features

### 36. Explain Symbols and their use cases
**Answer:**

```javascript
// Creating symbols
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false

// Use cases
// 1. Object property keys (non-enumerable)
const obj = {
  [Symbol('hidden')]: 'secret value',
  visible: 'public value'
};

console.log(Object.keys(obj)); // ['visible']
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(hidden)]

// 2. Well-known symbols
class MyArray extends Array {
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        done: index >= this.length,
        value: this[index++]
      })
    };
  }
}
```

### 37. How do Proxy and Reflect work together?
**Answer:**

```javascript
const target = { name: 'John', age: 30 };

const handler = {
  get(target, property, receiver) {
    console.log(`Getting ${property}`);
    return Reflect.get(target, property, receiver);
  },
  
  set(target, property, value, receiver) {
    console.log(`Setting ${property} to ${value}`);
    if (property === 'age' && value < 0) {
      throw new Error('Age cannot be negative');
    }
    return Reflect.set(target, property, value, receiver);
  },
  
  has(target, property) {
    console.log(`Checking if ${property} exists`);
    return Reflect.has(target, property);
  }
};

const proxy = new Proxy(target, handler);
proxy.name; // Getting name
proxy.age = 25; // Setting age to 25
'name' in proxy; // Checking if name exists
```

### 38. Explain generators and their practical applications
**Answer:**

```javascript
// Basic generator
function* numberGenerator() {
  let num = 0;
  while (true) {
    yield num++;
  }
}

const gen = numberGenerator();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1

// Practical applications
// 1. Async iteration
function* fetchPages() {
  let page = 1;
  while (true) {
    const data = yield fetch(`/api/data?page=${page++}`);
    if (!data.hasMore) break;
  }
}

// 2. State machines
function* stateMachine() {
  while (true) {
    const action = yield 'waiting';
    switch (action) {
      case 'start':
        yield 'running';
        break;
      case 'stop':
        yield 'stopped';
        break;
    }
  }
}

// 3. Infinite sequences
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
```

### 39. How do you use async generators?
**Answer:**

```javascript
async function* asyncGenerator() {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield `Value ${i}`;
  }
}

// Usage with for-await-of
async function consumeAsyncGenerator() {
  for await (const value of asyncGenerator()) {
    console.log(value);
  }
}

// Manual iteration
async function manualIteration() {
  const gen = asyncGenerator();
  let result = await gen.next();
  
  while (!result.done) {
    console.log(result.value);
    result = await gen.next();
  }
}
```

---

## Security

### 40. How do you prevent XSS attacks in JavaScript?
**Answer:**

```javascript
// 1. Input sanitization
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// 2. Content Security Policy
// Set CSP headers: Content-Security-Policy: script-src 'self'

// 3. Use textContent instead of innerHTML
element.textContent = userInput; // Safe
// element.innerHTML = userInput; // Dangerous

// 4. Validate and escape data
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 41. How do you implement secure authentication?
**Answer:**

```javascript
// JWT handling
class AuthService {
  static setToken(token) {
    // Store in httpOnly cookie, not localStorage
    document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
  }
  
  static async refreshToken() {
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      return response.json();
    } catch (error) {
      this.logout();
      throw error;
    }
  }
  
  static logout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  }
}

// Request interceptor for automatic token refresh
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch(...args);
  
  if (response.status === 401) {
    try {
      await AuthService.refreshToken();
      return originalFetch(...args);
    } catch (error) {
      AuthService.logout();
    }
  }
  
  return response;
};
```

---

## Testing

### 42. How do you test asynchronous code?
**Answer:**

```javascript
// Testing Promises
describe('Async function tests', () => {
  test('should resolve with data', async () => {
    const data = await fetchData();
    expect(data).toEqual({ id: 1, name: 'John' });
  });
  
  test('should reject with error', async () => {
    await expect(fetchDataWithError()).rejects.toThrow('Network error');
  });
  
  test('should handle timeout', async () => {
    jest.setTimeout(10000);
    const result = await longRunningOperation();
    expect(result).toBeDefined();
  });
});

// Mocking async functions
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' }),
  fetchPosts: jest.fn().mockRejectedValue(new Error('API Error'))
}));
```

### 43. How do you mock modules and dependencies?
**Answer:**

```javascript
// Module mocking
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

// Partial mocking
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  expensiveFunction: jest.fn(() => 'mocked result')
}));

// Dynamic mocking
const mockCallback = jest.fn();
mockCallback.mockReturnValue(42);
mockCallback.mockReturnValueOnce(10);
mockCallback.mockImplementation((x) => x * 2);

// Spy on methods
const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
expect(Math.random()).toBe(0.5);
spy.mockRestore();
```

---

## Metaprogramming

### 44. How do you use Reflect API for metaprogramming?
**Answer:**

```javascript
// Property manipulation
const obj = { name: 'John', age: 30 };

// Get property descriptor
const descriptor = Reflect.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);

// Define property with custom descriptor
Reflect.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});

// Check if property exists
console.log(Reflect.has(obj, 'name')); // true

// Get all property keys
console.log(Reflect.ownKeys(obj)); // ['name', 'age', 'id']

// Function calls
function greet(name, age) {
  return `Hello ${name}, you are ${age} years old`;
}

const result = Reflect.apply(greet, null, ['John', 30]);
console.log(result);
```

### 45. How do you create a dynamic class factory?
**Answer:**

```javascript
function createClass(name, properties, methods) {
  const ClassConstructor = {
    [name]: function(props) {
      Object.assign(this, props);
    }
  }[name];
  
  // Add properties
  properties.forEach(prop => {
    Object.defineProperty(ClassConstructor.prototype, prop, {
      get() { return this[`_${prop}`]; },
      set(value) { this[`_${prop}`] = value; },
      enumerable: true,
      configurable: true
    });
  });
  
  // Add methods
  Object.assign(ClassConstructor.prototype, methods);
  
  return ClassConstructor;
}

// Usage
const User = createClass('User', ['name', 'email'], {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  
  getEmail() {
    return this.email;
  }
});

const user = new User({ name: 'John', email: 'john@example.com' });
console.log(user.greet()); // Hello, I'm John
```

### 46. Explain private, public, and readonly class members in JavaScript
**Answer:**

JavaScript supports various access control mechanisms for class members, each serving different purposes in encapsulation and data protection.

**Private Fields and Methods (#)**:
```javascript
class BankAccount {
  // Private fields
  #balance = 0;
  #accountNumber;
  
  // Private method
  #validateAmount(amount) {
    return amount > 0 && typeof amount === 'number';
  }
  
  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    if (this.#validateAmount(initialBalance)) {
      this.#balance = initialBalance;
    }
  }
  
  // Public method accessing private members
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      return this.#balance;
    }
    throw new Error('Invalid amount');
  }
  
  getBalance() {
    return this.#balance;
  }
  
  // This would cause a syntax error if uncommented:
  // console.log(this.#balance); // SyntaxError outside class
}

const account = new BankAccount('123456', 1000);
console.log(account.getBalance()); // 1000
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

**Public Fields and Methods**:
```javascript
class User {
  // Public field (class field proposal)
  name = '';
  email = '';
  
  // Public method
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // Public method
  getFullInfo() {
    return `${this.name} (${this.email})`;
  }
  
  // Public static field
  static userCount = 0;
  
  // Public static method
  static incrementUserCount() {
    this.userCount++;
  }
}

const user = new User('John', 'john@example.com');
console.log(user.name); // John - accessible
console.log(User.userCount); // 0 - accessible
```

**Readonly-like Behavior with Object.defineProperty**:
```javascript
class Configuration {
  constructor(config) {
    // Make properties readonly using defineProperty
    Object.defineProperty(this, 'apiUrl', {
      value: config.apiUrl,
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    Object.defineProperty(this, 'version', {
      value: config.version,
      writable: false,
      enumerable: true,
      configurable: false
    });
  }
  
  // Alternative: using getter without setter for readonly
  get environment() {
    return this._environment;
  }
  
  constructor(config) {
    this._environment = config.environment;
  }
}

const config = new Configuration({
  apiUrl: 'https://api.example.com',
  version: '1.0.0',
  environment: 'production'
});

// These will fail silently in non-strict mode, throw in strict mode
config.apiUrl = 'https://malicious.com'; // No effect
config.version = '2.0.0'; // No effect
console.log(config.apiUrl); // https://api.example.com
```

### 47. How do private static fields and methods work?
**Answer:**

Private static members belong to the class itself, not instances, and can only be accessed within the class definition.

```javascript
class DatabaseConnection {
  // Private static fields
  static #instances = new Map();
  static #maxConnections = 5;
  static #connectionCount = 0;
  
  // Private instance field
  #connectionId;
  
  // Private static method
  static #generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  static #canCreateConnection() {
    return this.#connectionCount < this.#maxConnections;
  }
  
  constructor(host, port) {
    if (!DatabaseConnection.#canCreateConnection()) {
      throw new Error('Maximum connections reached');
    }
    
    this.#connectionId = DatabaseConnection.#generateId();
    this.host = host;
    this.port = port;
    
    DatabaseConnection.#connectionCount++;
    DatabaseConnection.#instances.set(this.#connectionId, this);
  }
  
  // Public static method accessing private static members
  static getConnectionCount() {
    return this.#connectionCount;
  }
  
  static getMaxConnections() {
    return this.#maxConnections;
  }
  
  // Public method accessing private instance field
  getId() {
    return this.#connectionId;
  }
  
  close() {
    DatabaseConnection.#instances.delete(this.#connectionId);
    DatabaseConnection.#connectionCount--;
  }
  
  // Public static method accessing private static field
  static getAllConnections() {
    return Array.from(this.#instances.values()).map(conn => ({
      id: conn.#connectionId,
      host: conn.host,
      port: conn.port
    }));
  }
}

// Usage
const conn1 = new DatabaseConnection('localhost', 5432);
const conn2 = new DatabaseConnection('remote', 5432);

console.log(DatabaseConnection.getConnectionCount()); // 2
console.log(DatabaseConnection.getAllConnections());
// console.log(DatabaseConnection.#connectionCount); // SyntaxError
```

### 48. What are the differences between private fields and WeakMap for encapsulation?
**Answer:**

Both approaches provide encapsulation, but they have different characteristics and use cases.

**Private Fields (#) Approach**:
```javascript
class PrivateFieldExample {
  #secret = 'private data';
  #counter = 0;
  
  #privateMethod() {
    return 'private method result';
  }
  
  publicMethod() {
    this.#counter++;
    return this.#privateMethod() + ' ' + this.#secret;
  }
  
  getCounter() {
    return this.#counter;
  }
}

// Pros:
// - Native syntax, clear intent
// - Better performance (direct property access)
// - Static analysis friendly
// - Type checking support
// - Syntax error if accessed outside class

// Cons:
// - Newer feature (ES2022)
// - Less browser support
// - Cannot be accessed via reflection
```

**WeakMap Approach**:
```javascript
const privateData = new WeakMap();

class WeakMapExample {
  constructor() {
    privateData.set(this, {
      secret: 'private data',
      counter: 0,
      privateMethod: () => 'private method result'
    });
  }
  
  publicMethod() {
    const data = privateData.get(this);
    data.counter++;
    return data.privateMethod() + ' ' + data.secret;
  }
  
  getCounter() {
    return privateData.get(this).counter;
  }
}

// Pros:
// - Better browser support
// - Can be used with any object
// - Memory efficient (WeakMap allows GC)
// - Dynamic privacy (can be added at runtime)

// Cons:
// - More verbose syntax
// - Slight performance overhead
// - Less clear intent
// - Additional WeakMap needed
```

**Comparison Example**:
```javascript
// Performance comparison
class PerformanceTest {
  #privateField = 'test';
  
  constructor() {
    this.weakMapData = new WeakMap();
    this.weakMapData.set(this, { field: 'test' });
  }
  
  accessPrivateField() {
    return this.#privateField; // Direct access
  }
  
  accessWeakMapField() {
    return this.weakMapData.get(this).field; // Lookup required
  }
}

// Memory behavior
const instances = [];
for (let i = 0; i < 1000; i++) {
  instances.push(new PerformanceTest());
}

// Both allow garbage collection when instances are removed
instances.length = 0; // Both private fields and WeakMap data can be GC'd
```

### 49. How do you implement readonly properties with different strategies?
**Answer:**

JavaScript offers several approaches to create readonly properties, each with different characteristics and use cases.

**1. Object.defineProperty with writable: false**:
```javascript
class ReadonlyWithDefineProperty {
  constructor(value) {
    Object.defineProperty(this, 'readonlyValue', {
      value: value,
      writable: false,
      enumerable: true,
      configurable: false
    });
  }
}

const obj1 = new ReadonlyWithDefineProperty('immutable');
obj1.readonlyValue = 'new value'; // Silently fails in non-strict mode
console.log(obj1.readonlyValue); // 'immutable'
```

**2. Getter without Setter**:
```javascript
class ReadonlyWithGetter {
  constructor(value) {
    this._value = value;
  }
  
  get readonlyValue() {
    return this._value;
  }
  
  // No setter defined - attempts to set will be ignored
}

const obj2 = new ReadonlyWithGetter('immutable');
obj2.readonlyValue = 'new value'; // Silently ignored
console.log(obj2.readonlyValue); // 'immutable'
```

**3. Private Field with Public Getter**:
```javascript
class ReadonlyWithPrivateField {
  #value;
  
  constructor(value) {
    this.#value = value;
  }
  
  get readonlyValue() {
    return this.#value;
  }
  
  // Private field cannot be accessed from outside
}

const obj3 = new ReadonlyWithPrivateField('immutable');
console.log(obj3.readonlyValue); // 'immutable'
// obj3.#value = 'new'; // SyntaxError
```

**4. Object.freeze for Deep Readonly**:
```javascript
class ReadonlyWithFreeze {
  constructor(data) {
    this.data = Object.freeze({ ...data });
    Object.freeze(this); // Make entire object readonly
  }
}

const obj4 = new ReadonlyWithFreeze({ name: 'John', age: 30 });
obj4.data.name = 'Jane'; // Silently fails
obj4.newProp = 'value'; // Silently fails
console.log(obj4.data.name); // 'John'
```

**5. Proxy for Advanced Readonly Behavior**:
```javascript
function createReadonly(target) {
  return new Proxy(target, {
    set(target, property, value, receiver) {
      throw new Error(`Cannot set property '${property}' on readonly object`);
    },
    
    defineProperty(target, property, descriptor) {
      throw new Error(`Cannot define property '${property}' on readonly object`);
    },
    
    deleteProperty(target, property) {
      throw new Error(`Cannot delete property '${property}' on readonly object`);
    }
  });
}

class ReadonlyWithProxy {
  constructor(data) {
    Object.assign(this, data);
    return createReadonly(this);
  }
}

const obj5 = new ReadonlyWithProxy({ name: 'John', age: 30 });
// obj5.name = 'Jane'; // Error: Cannot set property 'name' on readonly object
```

**6. TypeScript-style Readonly (Runtime Implementation)**:
```javascript
class ReadonlyCollection {
  #items = [];
  
  constructor(items = []) {
    this.#items = [...items];
  }
  
  // Readonly array interface
  get length() {
    return this.#items.length;
  }
  
  get(index) {
    return this.#items[index];
  }
  
  forEach(callback) {
    this.#items.forEach(callback);
  }
  
  map(callback) {
    return this.#items.map(callback);
  }
  
  filter(callback) {
    return this.#items.filter(callback);
  }
  
  // No mutating methods exposed
  // push, pop, splice, etc. are not available
  
  toArray() {
    return [...this.#items]; // Return copy
  }
}

const readonly = new ReadonlyCollection([1, 2, 3, 4, 5]);
console.log(readonly.get(0)); // 1
console.log(readonly.map(x => x * 2)); // [2, 4, 6, 8, 10]
// readonly.push(6); // TypeError: readonly.push is not a function
```

**Comparison Table**:

| Method | Performance | Flexibility | Error Handling | Browser Support |
|--------|-------------|-------------|----------------|-----------------|
| defineProperty | High | Medium | Silent/Strict | Excellent |
| Getter Only | High | High | Silent | Excellent |
| Private Field | Highest | Medium | Syntax Error | Modern |
| Object.freeze | Medium | Low | Silent/Strict | Excellent |
| Proxy | Lower | Highest | Custom | Good |

---

## Advanced Object Manipulation

### 46. How do you deep clone objects with circular references?
**Answer:**

```javascript
function deepClone(obj, visited = new WeakMap()) {
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
    return new RegExp(obj);
  }
  
  // Handle Arrays
  if (Array.isArray(obj)) {
    const cloned = [];
    visited.set(obj, cloned);
    obj.forEach((item, index) => {
      cloned[index] = deepClone(item, visited);
    });
    return cloned;
  }
  
  // Handle Objects
  const cloned = {};
  visited.set(obj, cloned);
  
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key], visited);
  });
  
  return cloned;
}

// Test with circular reference
const obj = { name: 'John' };
obj.self = obj;
const cloned = deepClone(obj);
console.log(cloned.self === cloned); // true
```

### 47. How do you implement object immutability?
**Answer:**

```javascript
// Shallow immutability
const shallowFreeze = (obj) => {
  Object.freeze(obj);
  return obj;
};

// Deep immutability
const deepFreeze = (obj) => {
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] !== null && typeof obj[prop] === 'object') {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
};

// Immutable update patterns
const updateObject = (obj, updates) => ({
  ...obj,
  ...updates
});

const updateNestedObject = (obj, path, value) => {
  const [head, ...tail] = path;
  
  if (tail.length === 0) {
    return { ...obj, [head]: value };
  }
  
  return {
    ...obj,
    [head]: updateNestedObject(obj[head], tail, value)
  };
};

// Usage
const user = { name: 'John', address: { city: 'NYC', zip: '10001' } };
const updated = updateNestedObject(user, ['address', 'city'], 'LA');
```

### 48. How do you implement a fluent interface?
**Answer:**

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: '',
      where: [],
      orderBy: [],
      limit: null
    };
  }
  
  select(...fields) {
    this.query.select.push(...fields);
    return this;
  }
  
  from(table) {
    this.query.from = table;
    return this;
  }
  
  where(condition) {
    this.query.where.push(condition);
    return this;
  }
  
  orderBy(field, direction = 'ASC') {
    this.query.orderBy.push(`${field} ${direction}`);
    return this;
  }
  
  limit(count) {
    this.query.limit = count;
    return this;
  }
  
  build() {
    let sql = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
    
    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    
    if (this.query.orderBy.length > 0) {
      sql += ` ORDER BY ${this.query.orderBy.join(', ')}`;
    }
    
    if (this.query.limit) {
      sql += ` LIMIT ${this.query.limit}`;
    }
    
    return sql;
  }
}

// Usage
const query = new QueryBuilder()
  .select('name', 'email')
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);
// SELECT name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name LIMIT 10
```

### 49. How do you implement custom iterators?
**Answer:**

```javascript
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;
    
    return {
      next() {
        if (current < end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Usage
const range = new Range(0, 10, 2);
for (const num of range) {
  console.log(num); // 0, 2, 4, 6, 8
}

// Convert to array
const numbers = [...range]; // [0, 2, 4, 6, 8]
```

### 50. How do you implement a custom error class hierarchy?
**Answer:**

```javascript
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.resource = resource;
  }
}

class DatabaseError extends AppError {
  constructor(message, query) {
    super(message, 500);
    this.query = query;
  }
}

// Usage
try {
  throw new ValidationError('Email is required', 'email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation error in field ${error.field}: ${error.message}`);
  }
}

// Global error handler
process.on('uncaughtException', (error) => {
  if (error instanceof AppError && error.isOperational) {
    console.log('Operational error:', error.message);
  } else {
    console.log('Programming error:', error);
    process.exit(1);
  }
});
```

---

## Bonus Advanced Questions

### 51. How do you implement a JavaScript virtual machine?
**Answer:** A simplified VM would include:
- Lexer/Parser for tokenization
- Abstract Syntax Tree (AST) generation
- Bytecode compiler
- Stack-based execution engine

### 52. Explain JavaScript's internal representation of numbers
**Answer:** JavaScript uses IEEE 754 double-precision floating-point format:
- 1 sign bit
- 11 exponent bits
- 52 mantissa bits
- Special values: NaN, Infinity, -Infinity

### 53. How do you implement a reactive programming system?
**Answer:** Create observables with operators like map, filter, merge:

```javascript
class Observable {
  constructor(subscribe) {
    this.subscribe = subscribe;
  }
  
  static create(subscribe) {
    return new Observable(subscribe);
  }
  
  map(transform) {
    return Observable.create(observer => {
      return this.subscribe({
        next: value => observer.next(transform(value)),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
    });
  }
  
  filter(predicate) {
    return Observable.create(observer => {
      return this.subscribe({
        next: value => predicate(value) && observer.next(value),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
    });
  }
}
```

### 54. How do you implement compile-time optimizations in JavaScript?
**Answer:** Use AST transformations:
- Dead code elimination
- Constant folding
- Inlining
- Tree shaking

### 55. Explain the difference between structural and nominal typing
**Answer:** 
- **Structural**: Compatibility based on structure (TypeScript)
- **Nominal**: Compatibility based on explicit declarations (Java, C#)

---

## Conclusion

This comprehensive list covers advanced JavaScript concepts that senior developers should master. Each question builds upon fundamental knowledge while exploring edge cases, performance implications, and real-world applications.

**Key Areas for Continued Learning:**
- WebAssembly integration
- Advanced browser APIs
- Performance profiling
- Security best practices
- Architectural patterns
- Testing strategies

**Practice Recommendations:**
1. Implement each pattern from scratch
2. Build real projects using these concepts
3. Read JavaScript engine source code
4. Contribute to open-source projects
5. Stay updated with ECMAScript proposals

Remember: Advanced JavaScript mastery comes from understanding not just how to use features, but why they exist and when to apply them appropriately.
