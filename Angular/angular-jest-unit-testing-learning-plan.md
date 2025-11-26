# Angular Unit Testing with Jest - Learning Plan

A comprehensive, step-by-step learning roadmap for mastering unit testing in Angular applications using Jest.

---

## Table of Contents

1. [Learning Path Overview](#learning-path-overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Testing Fundamentals (Week 1)](#phase-1-testing-fundamentals-week-1)
4. [Phase 2: Jest Basics (Week 2)](#phase-2-jest-basics-week-2)
5. [Phase 3: Angular Testing with Jest (Week 3-4)](#phase-3-angular-testing-with-jest-week-3-4)
6. [Phase 4: Testing Components (Week 5-6)](#phase-4-testing-components-week-5-6)
7. [Phase 5: Testing Services & Dependencies (Week 7)](#phase-5-testing-services--dependencies-week-7)
8. [Phase 6: Advanced Testing Patterns (Week 8-9)](#phase-6-advanced-testing-patterns-week-8-9)
9. [Phase 7: Real-World Application (Week 10-12)](#phase-7-real-world-application-week-10-12)
10. [Resources & References](#resources--references)
11. [Practice Projects](#practice-projects)
12. [Common Pitfalls & Solutions](#common-pitfalls--solutions)

---

## Learning Path Overview

```
Week 1-2:   Foundations → Testing concepts + Jest syntax
Week 3-4:   Angular + Jest → Setup, TestBed, fixtures, debugging
Week 5-6:   Components → Isolated & integrated component tests
Week 7:     Services → HTTP, state management, dependencies
Week 8-9:   Advanced → Pipes, directives, signals, routing, snapshots
Week 10-12: Real-World → Complete application testing
```

**Time Commitment**: 10-15 hours per week  
**Total Duration**: 12 weeks  
**Final Goal**: Confidently write comprehensive unit tests for any Angular application using Jest

---

## Prerequisites

### Required Knowledge
- ✅ TypeScript fundamentals (types, interfaces, classes)
- ✅ Angular basics (components, services, dependency injection)
- ✅ RxJS fundamentals (observables, operators)
- ✅ Command line basics

### Setup Requirements
```bash
# Angular CLI
npm install -g @angular/cli

# Create test project
ng new angular-jest-practice --routing=false --style=scss

# Navigate to project
cd angular-jest-practice

# Remove Jasmine/Karma
npm uninstall jasmine-core @types/jasmine karma karma-jasmine karma-chrome-launcher karma-coverage karma-jasmine-html-reporter

# Install Jest
npm install --save-dev jest @types/jest jest-preset-angular @angular-builders/jest

# Verify Jest is installed
npm list jest jest-preset-angular
```

---

## Phase 1: Testing Fundamentals (Week 1)

### Learning Objectives
- Understand why testing matters
- Learn the testing pyramid concept
- Grasp unit vs integration vs E2E testing
- Understand test-driven development (TDD) basics

### Topics to Study

#### 1.1 Why Test? (Day 1)
**Concept**: Understanding the value of automated testing

**The Problem Without Testing**:
Imagine you're building a banking application. You implement a transfer function that works perfectly during manual testing. Two months later, a colleague modifies the currency conversion logic. They test their changes, but unknowingly break the transfer function. This bug goes unnoticed until a customer loses money in production. 

**Automated tests prevent this scenario.**

**Detailed Benefits**:

1. **Catch Bugs Early in Development**
   - Tests act as a safety net, catching issues before code review
   - Finding a bug in development costs ~$100, in production it can cost $10,000+
   - Tests run in seconds, giving instant feedback on code changes

2. **Enable Confident Refactoring**
   - Without tests: "I want to refactor this, but what if I break something?"
   - With tests: "I'll refactor, and tests will tell me immediately if anything breaks"
   - This leads to cleaner, more maintainable code over time

3. **Document Code Behavior**
   - Tests serve as executable documentation
   - `it('should reject invalid email formats')` is clearer than a comment
   - New team members can read tests to understand how code should work

4. **Reduce Manual Testing Time**
   - Manual testing the same features repeatedly wastes developer time
   - Automated tests run thousands of scenarios in minutes
   - Frees you to focus on building features instead of clicking buttons

5. **Improve Code Quality and Design**
   - Writing testable code naturally leads to better architecture
   - Forces you to think about separation of concerns
   - Hard-to-test code is often poorly designed code

**Real-World Example**:
```typescript
// Read and analyze this buggy code
export class Calculator {
  add(a: number, b: number): number {
    return a - b; // Bug: should be addition (using subtraction!)
  }
}

// Without tests: Bug ships to production
// Developer manually tests: calculator.add(5, 3) = 2
// Developer thinks: "That looks right... wait, that's wrong!"
// But they might not test all combinations

// With tests: Bug caught immediately
describe('Calculator', () => {
  it('should add two positive numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 2)).toBe(4); // FAILS! Returns 0
    // Test fails immediately, bug never reaches production
  });
  
  it('should handle negative numbers', () => {
    expect(calc.add(-5, 3)).toBe(-2); // FAILS! Returns -8
  });
});
```

**The ROI (Return on Investment)**:
- Time to write test: 2 minutes
- Time saved finding bug later: 30+ minutes
- Customer trust preserved: Priceless

**Mindset Shift**: Don't think "I don't have time to write tests." Think "I don't have time to NOT write tests."

**Exercise**: 
Take 10 minutes to document a real bug you've encountered. How would a test have caught it? Write that test.

#### 1.2 Testing Pyramid (Day 2)
**Concept**: Balance different types of tests

```
        /\
       /E2E\       10% - End-to-End (slow, brittle)
      /------\
     /Integr.\    20% - Integration (moderate)
    /----------\
   /   Unit     \ 70% - Unit Tests (fast, reliable)
  /--------------\
```

**Key Principle**: Write more unit tests, fewer E2E tests

**Why This Distribution**:

**Unit Tests (70%)** - Foundation
- Fast: Run in milliseconds
- Isolated: Test one thing at a time
- Reliable: Minimal dependencies
- Easy to debug: Failures point to exact issue
- Example: Testing a single method in a service

**Integration Tests (20%)** - Middle Layer
- Moderate speed: Run in seconds
- Test multiple units working together
- More realistic: Uses real dependencies
- Example: Testing component + service + HTTP client

**E2E Tests (10%)** - Top
- Slow: Run in minutes
- Brittle: Can break for many reasons
- Full system test: Tests entire user flow
- Example: User logs in, navigates to dashboard, makes purchase

**Real-World Analogy**:
Building a car:
- Unit tests: Test each bolt, wire, piston individually
- Integration tests: Test engine assembly, transmission
- E2E tests: Test drive the entire car

**Exercise**:
List 5 scenarios from your current project. Classify each as unit, integration, or E2E test.

#### 1.3 Arrange-Act-Assert Pattern (Day 3-4)
**Concept**: Structure every test consistently

**Why AAA Matters**:
The AAA pattern is like a recipe - it provides consistent structure that makes tests easy to read and maintain. Any developer can look at an AAA test and immediately understand what's being tested, even without prior context.

**The Three Phases Explained**:

**1. ARRANGE (Setup)**
- Create the test data and objects you need
- Think: "What ingredients do I need?"
- Set up the initial state of the system
- This is usually the longest section

**2. ACT (Execute)**
- Call the method/function you're testing
- Think: "What am I actually testing?"
- This should usually be ONE line (testing one thing)
- The actual behavior under test

**3. ASSERT (Verify)**
- Check that the result matches expectations
- Think: "Did it do what I expected?"
- Can have multiple assertions, but they should all relate to the same act

**Basic Example with Detailed Explanation**:
```typescript
it('should calculate total with tax', () => {
  // ARRANGE - Set up test data
  // We need: a price, a tax rate, and a calculator
  const price = 100;        // Base price
  const taxRate = 0.1;      // 10% tax
  const calculator = new TaxCalculator();  // Our system under test
  
  // ACT - Execute the function being tested
  // This is the ONE thing we're testing
  const result = calculator.calculateTotal(price, taxRate);
  
  // ASSERT - Verify the outcome
  // 100 + (100 * 0.1) = 110
  expect(result).toBe(110);
});
```

**Complex Example with Dependencies**:
```typescript
describe('UserService', () => {
  it('should fetch user and transform data', async () => {
    // ARRANGE - More complex setup
    // Mock HTTP client
    const mockHttp = {
      get: jest.fn().mockReturnValue(of({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }))
    };
    
    // Create service with mock dependency
    const service = new UserService(mockHttp as any);
    const userId = 1;
    
    // ACT - Call the method
    const user = await service.getUserById(userId).toPromise();
    
    // ASSERT - Verify multiple related outcomes
    expect(user.id).toBe(1);
    expect(user.fullName).toBe('John Doe');  // Transformed data
    expect(user.email).toBe('john@example.com');
    expect(mockHttp.get).toHaveBeenCalledWith(`/api/users/${userId}`);
  });
});
```

**Common Mistakes**:

❌ **BAD - Mixed phases**:
```typescript
it('should process order', () => {
  const order = new Order();  // Arrange
  order.addItem({id: 1, price: 100});  // Still arranging
  const total = order.getTotal();  // Act
  expect(total).toBe(100);  // Assert
  order.addItem({id: 2, price: 50});  // ??? Arranging again?
  expect(order.getTotal()).toBe(150);  // Another act+assert
});
```

✅ **GOOD - Clear separation**:
```typescript
it('should calculate total for single item', () => {
  // ARRANGE
  const order = new Order();
  order.addItem({id: 1, price: 100});
  
  // ACT
  const total = order.getTotal();
  
  // ASSERT
  expect(total).toBe(100);
});

it('should calculate total for multiple items', () => {
  // ARRANGE
  const order = new Order();
  order.addItem({id: 1, price: 100});
  order.addItem({id: 2, price: 50});
  
  // ACT
  const total = order.getTotal();
  
  // ASSERT
  expect(total).toBe(150);
});
```

**Exercise**:
Write 3 tests using AAA pattern for a `ShoppingCart` class:
1. Adding items
2. Removing items
3. Calculating total with discount

---

## Phase 2: Jest Basics (Week 2)

### Learning Objectives
- Master Jest's core API and syntax
- Understand Jest's test structure and lifecycle
- Learn Jest's powerful mocking capabilities
- Practice writing assertions with matchers

### Topics to Study

#### 2.1 Jest Setup and Configuration (Day 1-2)

**What is Jest?**
- Zero-configuration testing framework created by Facebook
- Built for JavaScript/TypeScript projects
- Fast parallel test execution
- Built-in code coverage
- Excellent developer experience with watch mode
- Snapshot testing capabilities

**Why Jest for Angular?**
- **Speed**: Runs tests in parallel using Node.js (no browser needed)
- **Developer Experience**: Interactive watch mode, clear error messages
- **All-in-one**: No need for separate test runner (Karma) or mocking library
- **Modern**: Active development, used by React, Vue, and increasingly Angular
- **Snapshot Testing**: Easy UI regression testing

**Setting Up Jest in Angular Project**:

**Step 1: Remove Jasmine/Karma**:
```bash
npm uninstall jasmine-core @types/jasmine karma karma-jasmine \
  karma-chrome-launcher karma-coverage karma-jasmine-html-reporter

# Delete karma.conf.js and src/test.ts
rm karma.conf.js src/test.ts
```

**Step 2: Install Jest**:
```bash
npm install --save-dev jest @types/jest \
  jest-preset-angular @angular-builders/jest
```

**Step 3: Create jest.config.js**:
```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/environments/**'
  ],
  coverageReporters: ['html', 'text', 'lcov', 'json'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1'
  },
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs']
};
```

**Step 4: Create setup-jest.ts**:
```typescript
import 'jest-preset-angular/setup-jest';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
```

**Step 5: Update tsconfig.spec.json**:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

**Step 6: Update package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

**Verify Installation**:
```bash
npm test
```

**Exercise**:
1. Set up Jest in a new Angular project
2. Run the default tests
3. Add `--coverage` flag and examine the report

#### 2.2 Jest Test Structure (Day 3)

**Basic Test Anatomy**:
```typescript
// calculator.spec.ts

// 1. Imports
import { Calculator } from './calculator';

// 2. Test Suite
describe('Calculator', () => {
  
  // 3. Test Case
  it('should add two numbers', () => {
    // 4. Test Implementation
    const calculator = new Calculator();
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });
  
  it('should subtract two numbers', () => {
    const calculator = new Calculator();
    const result = calculator.subtract(5, 3);
    expect(result).toBe(2);
  });
});
```

**describe() - Test Suites**:
Groups related tests together

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when ID exists', () => {});
    it('should throw error when ID does not exist', () => {});
  });
  
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should reject invalid email', () => {});
  });
});
```

**it() / test() - Test Cases**:
Define individual test cases (they're aliases)

```typescript
// These are identical
it('should work', () => {});
test('should work', () => {});

// Use 'it' for BDD style (behavior-driven)
it('should calculate tax correctly', () => {});

// Use 'test' for more direct style
test('calculates tax correctly', () => {});
```

**Test Lifecycle Hooks**:

```typescript
describe('Database Operations', () => {
  // Runs once before all tests in this suite
  beforeAll(() => {
    console.log('Connect to database');
  });
  
  // Runs before each test
  beforeEach(() => {
    console.log('Clear database tables');
  });
  
  // Runs after each test
  afterEach(() => {
    console.log('Clean up test data');
  });
  
  // Runs once after all tests in this suite
  afterAll(() => {
    console.log('Close database connection');
  });
  
  it('test 1', () => {});
  it('test 2', () => {});
});
```

**Execution Order**:
```
beforeAll
  beforeEach
    test 1
  afterEach
  beforeEach
    test 2
  afterEach
afterAll
```

**Real-World Example**:
```typescript
describe('ShoppingCart', () => {
  let cart: ShoppingCart;
  
  // Create fresh cart before each test
  beforeEach(() => {
    cart = new ShoppingCart();
  });
  
  // Clean up after each test (optional, but good practice)
  afterEach(() => {
    cart.clear();
  });
  
  it('should start empty', () => {
    expect(cart.getItemCount()).toBe(0);
  });
  
  it('should add items', () => {
    cart.addItem({ id: 1, name: 'Widget', price: 10 });
    expect(cart.getItemCount()).toBe(1);
  });
  
  it('should calculate total', () => {
    cart.addItem({ id: 1, name: 'Widget', price: 10 });
    cart.addItem({ id: 2, name: 'Gadget', price: 20 });
    expect(cart.getTotal()).toBe(30);
  });
});
```

**Skipping and Focusing Tests**:

```typescript
// Skip a test
it.skip('should do something', () => {
  // This won't run
});

// Only run this test (all others skipped)
it.only('should do something important', () => {
  // Only this runs
});

// Skip entire suite
describe.skip('Feature X', () => {
  it('test 1', () => {});
  it('test 2', () => {});
});

// Only run this suite
describe.only('Feature Y', () => {
  it('test 1', () => {});
});
```

**Warning**: Don't commit `.only` or `.skip` - they're for local debugging only!

**Exercise**:
1. Create a `MathOperations` class with add, subtract, multiply, divide methods
2. Write a test suite with proper describe/it structure
3. Use beforeEach to create a fresh instance
4. Test all four methods

#### 2.3 Jest Matchers (Day 4)

**What are Matchers?**
Matchers let you test values in different ways. They're like assertions but more powerful and readable.

**Equality Matchers**:
```typescript
// Strict equality (===)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');
expect(true).toBe(true);

// Deep equality for objects/arrays
expect({ name: 'John', age: 30 }).toEqual({ name: 'John', age: 30 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// toBe vs toEqual
const obj1 = { value: 1 };
const obj2 = { value: 1 };
expect(obj1).not.toBe(obj2);  // Different references
expect(obj1).toEqual(obj2);   // Same content

// Strict equality (checks undefined properties)
expect({ a: undefined, b: 2 }).not.toStrictEqual({ b: 2 });
expect({ b: 2 }).toStrictEqual({ b: 2 });
```

**Truthiness Matchers**:
```typescript
// Truthy/Falsy
expect(true).toBeTruthy();
expect(1).toBeTruthy();
expect('hello').toBeTruthy();

expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();
expect(null).toBeFalsy();
expect(undefined).toBeFalsy();

// Specific checks
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('value').toBeDefined();
```

**Number Matchers**:
```typescript
const value = 5;

expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(5);
expect(value).toBeLessThan(10);
expect(value).toBeLessThanOrEqual(5);

// Floating point comparison
expect(0.1 + 0.2).toBeCloseTo(0.3);  // Handles floating point precision
expect(0.1 + 0.2).not.toBe(0.3);     // This would fail due to precision
```

**String Matchers**:
```typescript
const email = 'john.doe@example.com';

// Contains substring
expect(email).toContain('john');
expect(email).toContain('@');

// Regular expressions
expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
expect('hello world').toMatch(/hello/);
expect('HELLO').toMatch(/hello/i);  // Case-insensitive

// Length
expect(email).toHaveLength(21);
expect('test').toHaveLength(4);
```

**Array and Iterable Matchers**:
```typescript
const fruits = ['apple', 'banana', 'orange'];

// Contains item
expect(fruits).toContain('banana');

// Length
expect(fruits).toHaveLength(3);

// Every item matches
expect([2, 4, 6]).toEqual(expect.arrayContaining([4, 2]));

// Specific array content
expect(['a', 'b']).toEqual(expect.arrayContaining(['a', 'b']));
```

**Object Matchers**:
```typescript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30
};

// Has property
expect(user).toHaveProperty('name');
expect(user).toHaveProperty('name', 'John');
expect(user).toHaveProperty('age', 30);

// Partial match
expect(user).toMatchObject({
  name: 'John',
  age: 30
});

// Instance check
expect(new Date()).toBeInstanceOf(Date);
expect([]).toBeInstanceOf(Array);
```

**Exception Matchers**:
```typescript
function throwError() {
  throw new Error('Something went wrong');
}

function throwTypeError() {
  throw new TypeError('Type error occurred');
}

// Function throws
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow(Error);
expect(() => throwError()).toThrow('Something went wrong');
expect(() => throwError()).toThrow(/went wrong/);

expect(() => throwTypeError()).toThrow(TypeError);

// Function doesn't throw
expect(() => 1 + 1).not.toThrow();
```

**Promise Matchers**:
```typescript
// Resolves
await expect(Promise.resolve('success')).resolves.toBe('success');
await expect(getUserAsync(1)).resolves.toMatchObject({ id: 1 });

// Rejects
await expect(Promise.reject(new Error('fail'))).rejects.toThrow('fail');
await expect(getInvalidUser()).rejects.toThrow(Error);

// Real-world example
it('should fetch user data', async () => {
  await expect(userService.getUser(1)).resolves.toMatchObject({
    id: 1,
    name: expect.any(String),
    email: expect.stringContaining('@')
  });
});
```

**Negation with .not**:
```typescript
expect(2 + 2).not.toBe(5);
expect('hello').not.toContain('goodbye');
expect([1, 2, 3]).not.toContain(4);
expect(null).not.toBeDefined();
```

**Type Matchers**:
```typescript
// Any type
expect('hello').toEqual(expect.any(String));
expect(123).toEqual(expect.any(Number));
expect(true).toEqual(expect.any(Boolean));
expect(new Date()).toEqual(expect.any(Date));

// Useful in object matching
expect({
  id: 1,
  createdAt: new Date(),
  name: 'John'
}).toEqual({
  id: 1,
  createdAt: expect.any(Date),
  name: expect.any(String)
});
```

**Advanced Matchers**:
```typescript
// String contains (case-insensitive)
expect('Hello World').toEqual(expect.stringContaining('world'));

// String matches
expect('Hello World').toEqual(expect.stringMatching(/world/i));

// Array containing
expect([1, 2, 3, 4, 5]).toEqual(expect.arrayContaining([3, 1]));

// Object containing
expect({
  id: 1,
  name: 'John',
  email: 'john@example.com'
}).toEqual(expect.objectContaining({
  name: 'John',
  email: 'john@example.com'
}));
```

**Comprehensive Example**:
```typescript
describe('User Registration', () => {
  it('should validate user data', () => {
    const user = {
      id: 123,
      username: 'johndoe',
      email: 'john@example.com',
      createdAt: new Date(),
      isActive: true,
      roles: ['user', 'admin']
    };
    
    // Multiple matchers
    expect(user.id).toEqual(expect.any(Number));
    expect(user.id).toBeGreaterThan(0);
    expect(user.username).toHaveLength(7);
    expect(user.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.isActive).toBeTruthy();
    expect(user.roles).toContain('admin');
    expect(user.roles).toHaveLength(2);
    
    // Combined matchers
    expect(user).toMatchObject({
      username: expect.any(String),
      email: expect.stringContaining('@'),
      createdAt: expect.any(Date),
      roles: expect.arrayContaining(['user'])
    });
  });
});
```

**Exercise**:
Create tests for a `validateEmail` function using various matchers:
```typescript
function validateEmail(email: string): boolean {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

// Write tests using:
// - toBe / toBeTruthy / toBeFalsy
// - toThrow (test with null/undefined input)
// - Different email formats
```

#### 2.4 Jest Mocking Basics (Day 5-7)

**Why Mock?**
- Isolate the unit under test
- Control external dependencies
- Test edge cases and error scenarios
- Make tests faster (no real API calls)
- Make tests deterministic (same result every time)

**Mock Functions with jest.fn()**:

**Basic Mock**:
```typescript
// Create a mock function
const mockCallback = jest.fn();

// Use it
[1, 2, 3].forEach(mockCallback);

// Test it was called
expect(mockCallback).toHaveBeenCalled();
expect(mockCallback).toHaveBeenCalledTimes(3);
expect(mockCallback).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
```

**Mock Return Values**:
```typescript
// Single return value
const mockFn = jest.fn().mockReturnValue(42);
expect(mockFn()).toBe(42);
expect(mockFn()).toBe(42);  // Always returns 42

// Different values for each call
const mockMultiple = jest.fn()
  .mockReturnValueOnce(1)
  .mockReturnValueOnce(2)
  .mockReturnValueOnce(3);

expect(mockMultiple()).toBe(1);
expect(mockMultiple()).toBe(2);
expect(mockMultiple()).toBe(3);
expect(mockMultiple()).toBeUndefined();  // No more defined returns
```

**Mock Implementations**:
```typescript
// Custom implementation
const mockCalculate = jest.fn().mockImplementation((a, b) => a + b);
expect(mockCalculate(2, 3)).toBe(5);

// Or shorthand
const mockCalculate = jest.fn((a, b) => a + b);

// Different implementations for each call
const mockFn = jest.fn()
  .mockImplementationOnce(() => 'first')
  .mockImplementationOnce(() => 'second')
  .mockImplementation(() => 'default');

expect(mockFn()).toBe('first');
expect(mockFn()).toBe('second');
expect(mockFn()).toBe('default');
expect(mockFn()).toBe('default');
```

**Mock Promise Returns**:
```typescript
// Resolved promise
const mockAsync = jest.fn().mockResolvedValue('success');
await expect(mockAsync()).resolves.toBe('success');

// Rejected promise
const mockError = jest.fn().mockRejectedValue(new Error('failed'));
await expect(mockError()).rejects.toThrow('failed');

// Multiple calls
const mockApi = jest.fn()
  .mockResolvedValueOnce({ id: 1 })
  .mockResolvedValueOnce({ id: 2 })
  .mockRejectedValueOnce(new Error('Server error'));

await expect(mockApi()).resolves.toEqual({ id: 1 });
await expect(mockApi()).resolves.toEqual({ id: 2 });
await expect(mockApi()).rejects.toThrow('Server error');
```

**Spying on Methods**:
```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  
  multiply(a: number, b: number): number {
    return a * b;
  }
}

describe('Calculator', () => {
  it('should spy on add method', () => {
    const calc = new Calculator();
    const addSpy = jest.spyOn(calc, 'add');
    
    // Call the real method
    const result = calc.add(2, 3);
    
    // Verify call and result
    expect(result).toBe(5);
    expect(addSpy).toHaveBeenCalledWith(2, 3);
    expect(addSpy).toHaveBeenCalledTimes(1);
  });
  
  it('should mock method return value', () => {
    const calc = new Calculator();
    jest.spyOn(calc, 'add').mockReturnValue(100);
    
    // Now returns mocked value
    expect(calc.add(2, 3)).toBe(100);
  });
  
  it('should mock method implementation', () => {
    const calc = new Calculator();
    jest.spyOn(calc, 'add').mockImplementation((a, b) => a * b);
    
    // Now multiplies instead of adding
    expect(calc.add(2, 3)).toBe(6);
  });
});
```

**Mock Matchers**:
```typescript
const mockFn = jest.fn();

mockFn('hello', 42, { key: 'value' });

// Called with specific arguments
expect(mockFn).toHaveBeenCalledWith('hello', 42, { key: 'value' });

// Called with any number
expect(mockFn).toHaveBeenCalledWith('hello', expect.any(Number), expect.any(Object));

// Called with object containing
expect(mockFn).toHaveBeenCalledWith(
  'hello',
  42,
  expect.objectContaining({ key: 'value' })
);

// Check specific call (0-indexed)
expect(mockFn).toHaveBeenNthCalledWith(1, 'hello', 42, expect.any(Object));

// Last call
expect(mockFn).toHaveBeenLastCalledWith('hello', 42, expect.any(Object));
```

**Mock Return Values**:
```typescript
const mockFn = jest.fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second');

expect(mockFn()).toBe('first');
expect(mockFn()).toBe('second');
expect(mockFn()).toBe('default');
expect(mockFn()).toBe('default');

// Check return values
expect(mockFn).toHaveReturnedWith('default');
expect(mockFn).toHaveReturnedTimes(4);
expect(mockFn).toHaveNthReturnedWith(1, 'first');
expect(mockFn).toHaveLastReturnedWith('default');
```

**Accessing Mock Properties**:
```typescript
const mockFn = jest.fn().mockReturnValue('result');

mockFn('arg1', 'arg2');
mockFn('arg3');

// Access call information
console.log(mockFn.mock.calls);
// [['arg1', 'arg2'], ['arg3']]

console.log(mockFn.mock.results);
// [{ type: 'return', value: 'result' }, { type: 'return', value: 'result' }]

// First call arguments
expect(mockFn.mock.calls[0]).toEqual(['arg1', 'arg2']);

// All calls
expect(mockFn.mock.calls).toHaveLength(2);
```

**Clearing and Resetting Mocks**:
```typescript
const mockFn = jest.fn().mockReturnValue(42);

mockFn();
mockFn();

expect(mockFn).toHaveBeenCalledTimes(2);

// Clear call history but keep mock implementation
mockFn.mockClear();
expect(mockFn).toHaveBeenCalledTimes(0);
expect(mockFn()).toBe(42);  // Still returns 42

// Reset mock to initial state (clears history and implementation)
mockFn.mockReset();
expect(mockFn()).toBeUndefined();  // No implementation

// Restore original implementation (for spies)
const obj = { method: () => 'real' };
const spy = jest.spyOn(obj, 'method').mockReturnValue('mocked');
expect(obj.method()).toBe('mocked');

spy.mockRestore();
expect(obj.method()).toBe('real');
```

**Best Practices**:
```typescript
describe('Service Tests', () => {
  let mockDependency: jest.Mock;
  
  beforeEach(() => {
    mockDependency = jest.fn();
  });
  
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });
  
  it('test 1', () => {
    mockDependency.mockReturnValue('value1');
    // Test implementation
  });
  
  it('test 2', () => {
    // mockDependency is fresh (cleared in afterEach)
    mockDependency.mockReturnValue('value2');
    // Test implementation
  });
});
```

**Real-World Example - HTTP Service**:
```typescript
import { of, throwError } from 'rxjs';

class DataService {
  constructor(private http: HttpClient) {}
  
  getData(id: number) {
    return this.http.get(`/api/data/${id}`);
  }
  
  saveData(data: any) {
    return this.http.post('/api/data', data);
  }
}

describe('DataService', () => {
  let service: DataService;
  let httpMock: any;
  
  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    service = new DataService(httpMock);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getData', () => {
    it('should fetch data successfully', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      httpMock.get.mockReturnValue(of(mockData));
      
      // Act
      const result = await service.getData(1).toPromise();
      
      // Assert
      expect(result).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('/api/data/1');
      expect(httpMock.get).toHaveBeenCalledTimes(1);
    });
    
    it('should handle errors', async () => {
      // Arrange
      const errorMessage = 'Server error';
      httpMock.get.mockReturnValue(
        throwError(() => new Error(errorMessage))
      );
      
      // Act & Assert
      await expect(service.getData(1).toPromise()).rejects.toThrow(errorMessage);
      expect(httpMock.get).toHaveBeenCalledWith('/api/data/1');
    });
  });
  
  describe('saveData', () => {
    it('should post data successfully', async () => {
      // Arrange
      const dataToSave = { name: 'New Item' };
      const savedData = { id: 1, ...dataToSave };
      httpMock.post.mockReturnValue(of(savedData));
      
      // Act
      const result = await service.saveData(dataToSave).toPromise();
      
      // Assert
      expect(result).toEqual(savedData);
      expect(httpMock.post).toHaveBeenCalledWith('/api/data', dataToSave);
    });
  });
});
```

**Exercise**:
1. Create a `UserService` with methods: `getUser(id)`, `createUser(user)`, `deleteUser(id)`
2. Mock HttpClient dependency
3. Test success cases
4. Test error scenarios
5. Verify HTTP methods are called with correct parameters

---

## Phase 3: Angular Testing with Jest (Week 3-4)

### Learning Objectives
- Understand Angular's testing utilities with Jest
- Master TestBed configuration
- Learn component fixture API
- Practice debugging techniques
- Use Jest's unique features (snapshots, parallel execution)

### Topics to Study

#### 3.1 TestBed and Dependency Injection (Day 1-3)

**What is TestBed?**
TestBed is Angular's primary testing utility. It creates a dynamically-constructed Angular testing module that emulates an Angular @NgModule.

**Why TestBed?**
- Sets up Angular's dependency injection
- Compiles components and templates
- Creates component fixtures
- Provides Angular services
- Manages change detection

**Basic TestBed Setup**:
```typescript
import { TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]  // For standalone components
    }).compileComponents();
  });
  
  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

**TestBed Configuration Options**:
```typescript
await TestBed.configureTestingModule({
  // Import standalone components, pipes, directives
  imports: [
    MyComponent,
    CommonModule,
    FormsModule
  ],
  
  // Provide services (for dependency injection)
  providers: [
    MyService,
    { provide: ApiService, useValue: mockApiService },
    { provide: APP_CONFIG, useValue: testConfig }
  ],
  
  // Override component providers
  declarations: [],  // For non-standalone components (legacy)
  
  // Import schemas
  schemas: [NO_ERRORS_SCHEMA]  // Ignore unknown elements/attributes
}).compileComponents();
```

**Dependency Injection in Tests**:

**Option 1: Constructor Injection (Component)**:
```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [UserService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });
  
  it('should use injected service', () => {
    jest.spyOn(userService, 'getUser').mockReturnValue(of({ id: 1, name: 'John' }));
    component.loadUser();
    expect(userService.getUser).toHaveBeenCalled();
  });
});
```

**Option 2: TestBed.inject()**:
```typescript
it('should inject service', () => {
  const service = TestBed.inject(UserService);
  expect(service).toBeDefined();
});
```

**Option 3: Mock Providers**:
```typescript
describe('Component with mocked service', () => {
  let mockUserService: jest.Mocked<UserService>;
  
  beforeEach(async () => {
    // Create mock
    mockUserService = {
      getUser: jest.fn(),
      saveUser: jest.fn(),
      deleteUser: jest.fn()
    } as any;
    
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();
  });
  
  it('should use mocked service', () => {
    mockUserService.getUser.mockReturnValue(of({ id: 1, name: 'John' }));
    // Test implementation
  });
});
```

**Provider Strategies**:
```typescript
// useValue - provide exact value
{ provide: ApiService, useValue: mockApiService }

// useClass - provide different class
{ provide: ApiService, useClass: MockApiService }

// useFactory - create with factory function
{
  provide: ConfigService,
  useFactory: () => new ConfigService({ env: 'test' })
}

// useExisting - alias to another provider
{ provide: 'API_TOKEN', useExisting: ApiService }
```

**Testing Hierarchical DI**:
```typescript
@Component({
  selector: 'app-child',
  template: '{{ value }}',
  providers: [ValueService]  // Component-level provider
})
class ChildComponent {
  value = inject(ValueService).getValue();
}

describe('ChildComponent', () => {
  it('should use component-level provider', () => {
    const fixture = TestBed.createComponent(ChildComponent);
    const component = fixture.componentInstance;
    
    // Gets value from component's own provider
    expect(component.value).toBeDefined();
  });
  
  it('should override component provider', () => {
    const mockService = { getValue: jest.fn().mockReturnValue('test') };
    
    TestBed.configureTestingModule({
      imports: [ChildComponent]
    })
    .overrideComponent(ChildComponent, {
      set: {
        providers: [
          { provide: ValueService, useValue: mockService }
        ]
      }
    });
    
    const fixture = TestBed.createComponent(ChildComponent);
    expect(mockService.getValue).toHaveBeenCalled();
  });
});
```

**compileComponents() - When to Use**:
```typescript
// Always use with async and await
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent]
  }).compileComponents();  // Compiles templates and styles
});

// Why async?
// - Loads external templates (templateUrl)
// - Loads external styles (styleUrls)
// - With inline templates/styles, technically optional but recommended
```

**TestBed.inject() vs Constructor Injection**:
```typescript
describe('Service Tests', () => {
  // Method 1: TestBed.inject (recommended)
  it('should inject service via TestBed', () => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    
    const service = TestBed.inject(UserService);
    expect(service).toBeDefined();
  });
  
  // Method 2: Direct instantiation (for simple services)
  it('should create service directly', () => {
    const service = new UserService(mockHttp);
    expect(service).toBeDefined();
  });
});
```

**Real-World Example**:
```typescript
// user-profile.component.ts
@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="profile">
      <h1>{{ user().name }}</h1>
      <p>{{ user().email }}</p>
      <button (click)="updateProfile()">Update</button>
    </div>
  `
})
export class UserProfileComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  
  user = signal<User | null>(null);
  
  ngOnInit() {
    this.loadUser();
  }
  
  loadUser() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user.set(user);
    });
  }
  
  updateProfile() {
    this.router.navigate(['/profile/edit']);
  }
}

// user-profile.component.spec.ts
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;
  
  beforeEach(async () => {
    // Create mocks
    mockUserService = {
      getCurrentUser: jest.fn()
    } as any;
    
    mockRouter = {
      navigate: jest.fn()
    } as any;
    
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load user on init', () => {
    // Arrange
    const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
    mockUserService.getCurrentUser.mockReturnValue(of(mockUser));
    
    // Act
    fixture.detectChanges();  // Triggers ngOnInit
    
    // Assert
    expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    expect(component.user()).toEqual(mockUser);
  });
  
  it('should navigate on update button click', () => {
    // Arrange
    const button = fixture.nativeElement.querySelector('button');
    
    // Act
    button.click();
    
    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile/edit']);
  });
});
```

**Exercise**:
1. Create a component that depends on 2-3 services
2. Set up TestBed with mocked providers
3. Test that services are injected correctly
4. Test component methods that use these services

#### 3.2 ComponentFixture and DebugElement (Day 4-5)

**What is ComponentFixture?**
A wrapper around a component instance that provides access to the component, its DOM, and change detection control.

**ComponentFixture API**:
```typescript
const fixture = TestBed.createComponent(MyComponent);

// Component instance
const component = fixture.componentInstance;

// Native DOM element
const element: HTMLElement = fixture.nativeElement;

// Debug element (Angular wrapper)
const debugElement: DebugElement = fixture.debugElement;

// Trigger change detection
fixture.detectChanges();

// Check if changes are pending
const pending = fixture.isStable();

// Wait for async operations
await fixture.whenStable();

// Destroy component
fixture.destroy();
```

**Accessing Component Properties**:
```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div>
      <span class="count">{{ count }}</span>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  count = 0;
  
  increment() {
    this.count++;
  }
}

describe('CounterComponent', () => {
  it('should increment count', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;
    
    // Access and modify properties
    expect(component.count).toBe(0);
    
    component.increment();
    expect(component.count).toBe(1);
    
    component.count = 10;
    expect(component.count).toBe(10);
  });
});
```

**nativeElement vs debugElement**:

**nativeElement** - Direct DOM access:
```typescript
it('should access DOM via nativeElement', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  const element: HTMLElement = fixture.nativeElement;
  
  // Standard DOM APIs
  const span = element.querySelector('.count');
  const button = element.querySelector('button');
  
  expect(span?.textContent).toBe('0');
  button?.click();
});
```

**debugElement** - Angular's wrapper with extra features:
```typescript
import { By } from '@angular/platform-browser';

it('should access DOM via debugElement', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  const debugElement = fixture.debugElement;
  
  // Query by CSS
  const span = debugElement.query(By.css('.count'));
  const button = debugElement.query(By.css('button'));
  
  // Query by directive
  const ngIfElements = debugElement.queryAll(By.directive(NgIf));
  
  // Trigger events
  button.triggerEventHandler('click', null);
  
  // Access native element
  expect(span.nativeElement.textContent).toBe('1');
});
```

**Query Strategies**:
```typescript
// Single element
const element = fixture.debugElement.query(By.css('.my-class'));

// Multiple elements
const elements = fixture.debugElement.queryAll(By.css('li'));

// By directive
const ngIfElements = fixture.debugElement.queryAll(By.directive(NgIf));

// By component
const childComponents = fixture.debugElement.queryAll(By.directive(ChildComponent));

// Nested query
const parent = fixture.debugElement.query(By.css('.parent'));
const child = parent?.query(By.css('.child'));
```

**Change Detection Control**:

**Automatic Change Detection** (default in tests):
```typescript
it('should auto-detect changes', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  
  // Changes detected automatically in tests
  // (Unlike production where CD runs on events)
  fixture.componentInstance.count = 5;
  
  // Must manually trigger to see in DOM
  fixture.detectChanges();
  
  const span = fixture.nativeElement.querySelector('.count');
  expect(span.textContent).toBe('5');
});
```

**Manual Change Detection**:
```typescript
it('should handle manual change detection', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  
  // Set property
  fixture.componentInstance.count = 10;
  
  // DOM not updated yet
  let span = fixture.nativeElement.querySelector('.count');
  expect(span.textContent).toBe('0');
  
  // Trigger change detection
  fixture.detectChanges();
  
  // Now DOM is updated
  span = fixture.nativeElement.querySelector('.count');
  expect(span.textContent).toBe('10');
});
```

**Async Operations with whenStable()**:
```typescript
it('should wait for async operations', async () => {
  const fixture = TestBed.createComponent(AsyncComponent);
  component.loadData();  // Triggers setTimeout or HTTP call
  
  // Wait for all async operations to complete
  await fixture.whenStable();
  
  fixture.detectChanges();
  expect(component.data).toBeDefined();
});
```

**Event Triggering**:

**Method 1: Native DOM Events**:
```typescript
it('should trigger click via native element', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  fixture.detectChanges();
  
  const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  button.click();  // Native click
  
  fixture.detectChanges();
  expect(fixture.componentInstance.count).toBe(1);
});
```

**Method 2: triggerEventHandler**:
```typescript
it('should trigger click via debugElement', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  fixture.detectChanges();
  
  const button = fixture.debugElement.query(By.css('button'));
  button.triggerEventHandler('click', null);
  
  fixture.detectChanges();
  expect(fixture.componentInstance.count).toBe(1);
});
```

**Method 3: dispatchEvent** (for complex events):
```typescript
it('should trigger custom event', () => {
  const fixture = TestBed.createComponent(InputComponent);
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
  
  // Create and dispatch event
  input.value = 'new value';
  input.dispatchEvent(new Event('input'));
  
  fixture.detectChanges();
  expect(fixture.componentInstance.inputValue).toBe('new value');
});
```

**Comprehensive Example**:
```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  template: `
    <div class="todo-item" [class.completed]="completed()">
      <input 
        type="checkbox" 
        [checked]="completed()"
        (change)="toggleComplete()"
      />
      <span class="title">{{ title }}</span>
      <button class="delete" (click)="delete()">Delete</button>
    </div>
  `
})
export class TodoItemComponent {
  @Input() title = '';
  completed = signal(false);
  @Output() deleted = new EventEmitter<void>();
  
  toggleComplete() {
    this.completed.update(v => !v);
  }
  
  delete() {
    this.deleted.emit();
  }
}

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display title', () => {
    // Arrange
    component.title = 'Buy groceries';
    
    // Act
    fixture.detectChanges();
    
    // Assert
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Buy groceries');
  });
  
  it('should toggle completed state', () => {
    // Arrange
    fixture.detectChanges();
    expect(component.completed()).toBe(false);
    
    // Act
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.click();
    fixture.detectChanges();
    
    // Assert
    expect(component.completed()).toBe(true);
    expect(checkbox.checked).toBe(true);
  });
  
  it('should apply completed class when checked', () => {
    // Arrange
    component.completed.set(true);
    
    // Act
    fixture.detectChanges();
    
    // Assert
    const todoItem = fixture.nativeElement.querySelector('.todo-item');
    expect(todoItem.classList.contains('completed')).toBe(true);
  });
  
  it('should emit deleted event', () => {
    // Arrange
    const deleteSpy = jest.fn();
    component.deleted.subscribe(deleteSpy);
    fixture.detectChanges();
    
    // Act
    const deleteButton = fixture.nativeElement.querySelector('.delete');
    deleteButton.click();
    
    // Assert
    expect(deleteSpy).toHaveBeenCalled();
  });
  
  it('should query elements with debugElement', () => {
    fixture.detectChanges();
    
    // Query by CSS
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox).toBeTruthy();
    
    // Query all buttons
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons).toHaveLength(1);
  });
});
```

**Exercise**:
1. Create a form component with input, checkbox, and submit button
2. Test input value changes
3. Test checkbox toggle
4. Test form submission
5. Practice both nativeElement and debugElement approaches

#### 3.3 Jest Snapshot Testing (Day 6-7)

**What is Snapshot Testing?**
Snapshot testing captures the rendered output of a component and saves it. Future test runs compare against this saved snapshot to detect unexpected changes.

**Why Snapshots?**
- Catch unintended UI changes
- Document component output
- Quick regression testing
- Easy to update when changes are intentional

**Basic Snapshot Test**:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `<h1>Hello, {{ name }}!</h1>`
})
export class GreetingComponent {
  name = 'World';
}

describe('GreetingComponent', () => {
  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(GreetingComponent);
    fixture.detectChanges();
    
    expect(fixture).toMatchSnapshot();
  });
});
```

**First Run** - Creates snapshot file:
```
// __snapshots__/greeting.component.spec.ts.snap

exports[`GreetingComponent should match snapshot 1`] = `
<app-greeting>
  <h1>Hello, World!</h1>
</app-greeting>
`;
```

**Subsequent Runs** - Compares against snapshot:
- ✅ Pass: Output matches snapshot
- ❌ Fail: Output differs from snapshot

**Updating Snapshots**:
```bash
# When changes are intentional
npm test -- -u
# or
jest --updateSnapshot
```

**Inline Snapshots**:
```typescript
it('should match inline snapshot', () => {
  const user = { id: 1, name: 'John', email: 'john@example.com' };
  
  expect(user).toMatchInlineSnapshot(`
    {
      "email": "john@example.com",
      "id": 1,
      "name": "John",
    }
  `);
});
```

**Property Matchers** (for dynamic data):
```typescript
it('should match snapshot with dynamic data', () => {
  const user = {
    id: Math.random(),
    createdAt: new Date(),
    name: 'John'
  };
  
  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date)
  });
});
```

**Snapshot Best Practices**:

✅ **GOOD - Small, focused snapshots**:
```typescript
it('should render user card', () => {
  component.user = { id: 1, name: 'John', email: 'john@example.com' };
  fixture.detectChanges();
  
  const userCard = fixture.nativeElement.querySelector('.user-card');
  expect(userCard).toMatchSnapshot();
});
```

❌ **BAD - Large, complex snapshots**:
```typescript
it('should render entire page', () => {
  fixture.detectChanges();
  // Snapshots entire page with hundreds of lines
  expect(fixture).toMatchSnapshot();
});
```

✅ **GOOD - Snapshot specific parts**:
```typescript
describe('UserListComponent', () => {
  it('should render empty state', () => {
    component.users = [];
    fixture.detectChanges();
    
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toMatchSnapshot();
  });
  
  it('should render user list', () => {
    component.users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    fixture.detectChanges();
    
    const userList = fixture.nativeElement.querySelector('.user-list');
    expect(userList).toMatchSnapshot();
  });
});
```

**Snapshot with Signals**:
```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  
  increment() {
    this.count.update(v => v + 1);
  }
}

describe('CounterComponent Snapshots', () => {
  it('should match initial state snapshot', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.counter')).toMatchSnapshot();
  });
  
  it('should match incremented state snapshot', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.componentInstance.count.set(5);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.counter')).toMatchSnapshot();
  });
});
```

**Testing Multiple States**:
```typescript
@Component({
  selector: 'app-loading-button',
  template: `
    <button 
      [disabled]="loading()"
      [class.loading]="loading()"
      (click)="handleClick()"
    >
      @if (loading()) {
        <span class="spinner"></span>
      } @else {
        {{ label }}
      }
    </button>
  `
})
export class LoadingButtonComponent {
  @Input() label = 'Submit';
  loading = signal(false);
  @Output() clicked = new EventEmitter();
  
  handleClick() {
    this.clicked.emit();
  }
}

describe('LoadingButtonComponent Snapshots', () => {
  let fixture: ComponentFixture<LoadingButtonComponent>;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingButtonComponent);
  });
  
  it('should match idle state', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
  
  it('should match loading state', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
  
  it('should match custom label', () => {
    fixture.componentInstance.label = 'Save Changes';
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
```

**When to Use Snapshots**:

✅ **Good Use Cases**:
- Testing rendered HTML structure
- Catching unintended CSS changes
- Testing various component states
- Quick regression testing
- Testing error messages and alerts

❌ **Avoid Snapshots For**:
- Business logic (use regular assertions)
- Dynamic content (timestamps, random IDs)
- External API responses
- Large components (break into smaller tests)

**Snapshot Testing with Dynamic Content**:
```typescript
it('should handle dynamic timestamps', () => {
  const post = {
    id: 1,
    title: 'My Post',
    createdAt: new Date(),
    author: 'John'
  };
  
  // Use property matcher for dynamic fields
  expect(post).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date)
  });
});
```

**Reviewing Snapshot Failures**:

When a snapshot test fails:
1. **Review the diff** - Jest shows what changed
2. **Determine if change is intentional**:
   - Yes: Update snapshot (`jest -u`)
   - No: Fix the code
3. **Commit updated snapshots** with meaningful commit message

**Example Workflow**:
```bash
# Test fails after UI change
npm test
# Output shows diff

# Review changes in snapshot file
# If correct, update:
npm test -- -u

# Commit both code and snapshot
git add .
git commit -m "Update button styling and snapshots"
```

**Real-World Example**:
```typescript
@Component({
  selector: 'app-alert',
  template: `
    <div class="alert alert-{{ type }}" role="alert">
      <span class="icon">{{ getIcon() }}</span>
      <div class="content">
        <h4 class="title">{{ title }}</h4>
        <p class="message">{{ message }}</p>
      </div>
      @if (dismissible) {
        <button class="close" (click)="close()">×</button>
      }
    </div>
  `
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() dismissible = false;
  @Output() closed = new EventEmitter();
  
  getIcon() {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.type];
  }
  
  close() {
    this.closed.emit();
  }
}

describe('AlertComponent Snapshots', () => {
  let fixture: ComponentFixture<AlertComponent>;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
  });
  
  it('should match success alert snapshot', () => {
    fixture.componentInstance.type = 'success';
    fixture.componentInstance.title = 'Success!';
    fixture.componentInstance.message = 'Your changes have been saved.';
    fixture.detectChanges();
    
    expect(fixture.nativeElement).toMatchSnapshot();
  });
  
  it('should match error alert snapshot', () => {
    fixture.componentInstance.type = 'error';
    fixture.componentInstance.title = 'Error!';
    fixture.componentInstance.message = 'Something went wrong.';
    fixture.detectChanges();
    
    expect(fixture.nativeElement).toMatchSnapshot();
  });
  
  it('should match dismissible alert snapshot', () => {
    fixture.componentInstance.type = 'warning';
    fixture.componentInstance.title = 'Warning';
    fixture.componentInstance.message = 'Please review your input.';
    fixture.componentInstance.dismissible = true;
    fixture.detectChanges();
    
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
```

**Exercise**:
1. Create a card component with different states (loading, success, error)
2. Write snapshot tests for each state
3. Intentionally change the template
4. Review the diff and update snapshots
5. Practice with inline snapshots

---

## Phase 4: Testing Components (Week 5-6)

### Learning Objectives
- Test component inputs and outputs
- Test user interactions and events
- Test conditional rendering (@if, @for, @switch)
- Test forms (reactive and template-driven)
- Test component lifecycle hooks

### Topics to Study

#### 4.1 Testing Component Inputs and Outputs (Day 1-2)

**Testing @Input() Properties**:

**Modern Signal Inputs**:
```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <button (click)="selectUser()">Select</button>
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>();
  selected = output<User>();
  
  selectUser() {
    this.selected.emit(this.user());
  }
}

describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>;
  let component: UserCardComponent;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should display user name', () => {
    // Arrange
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.componentRef.setInput('user', user);
    
    // Act
    fixture.detectChanges();
    
    // Assert
    const heading = fixture.nativeElement.querySelector('h3');
    expect(heading.textContent).toBe('John Doe');
  });
  
  it('should display user email', () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    
    const email = fixture.nativeElement.querySelector('p');
    expect(email.textContent).toBe('john@example.com');
  });
  
  it('should emit selected user on button click', () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    
    const emitSpy = jest.fn();
    component.selected.subscribe(emitSpy);
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(emitSpy).toHaveBeenCalledWith(user);
  });
});
```

**Legacy @Input() Decorator**:
```typescript
@Component({
  selector: 'app-message',
  template: '<div class="message">{{ text }}</div>'
})
export class MessageComponent {
  @Input() text = '';
  @Input() type: 'info' | 'warning' | 'error' = 'info';
}

describe('MessageComponent', () => {
  it('should accept input properties', () => {
    const fixture = TestBed.createComponent(MessageComponent);
    const component = fixture.componentInstance;
    
    // Set inputs directly
    component.text = 'Hello';
    component.type = 'warning';
    
    fixture.detectChanges();
    
    expect(component.text).toBe('Hello');
    expect(component.type).toBe('warning');
  });
});
```

**Testing Input Changes**:
```typescript
@Component({
  selector: 'app-price',
  template: `
    <div class="price">
      <span class="amount">{{ formattedPrice }}</span>
    </div>
  `
})
export class PriceComponent {
  @Input() price = 0;
  @Input() currency = 'USD';
  
  get formattedPrice(): string {
    return `${this.currency} ${this.price.toFixed(2)}`;
  }
}

describe('PriceComponent', () => {
  it('should format price with currency', () => {
    const fixture = TestBed.createComponent(PriceComponent);
    const component = fixture.componentInstance;
    
    component.price = 99.99;
    component.currency = 'EUR';
    fixture.detectChanges();
    
    const amount = fixture.nativeElement.querySelector('.amount');
    expect(amount.textContent).toBe('EUR 99.99');
  });
  
  it('should update when price changes', () => {
    const fixture = TestBed.createComponent(PriceComponent);
    const component = fixture.componentInstance;
    
    component.price = 10;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('USD 10.00');
    
    component.price = 20;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('USD 20.00');
  });
});
```

**Testing @Output() Events**:

**Modern Signal Outputs**:
```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <button class="decrement" (click)="decrement()">-</button>
      <span>{{ count() }}</span>
      <button class="increment" (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  countChanged = output<number>();
  
  increment() {
    this.count.update(v => v + 1);
    this.countChanged.emit(this.count());
  }
  
  decrement() {
    this.count.update(v => v - 1);
    this.countChanged.emit(this.count());
  }
}

describe('CounterComponent Outputs', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let component: CounterComponent;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should emit countChanged on increment', () => {
    const emitSpy = jest.fn();
    component.countChanged.subscribe(emitSpy);
    
    const button = fixture.nativeElement.querySelector('.increment');
    button.click();
    
    expect(emitSpy).toHaveBeenCalledWith(1);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
  
  it('should emit countChanged on decrement', () => {
    const emitSpy = jest.fn();
    component.countChanged.subscribe(emitSpy);
    
    const button = fixture.nativeElement.querySelector('.decrement');
    button.click();
    
    expect(emitSpy).toHaveBeenCalledWith(-1);
  });
  
  it('should emit multiple times', () => {
    const emitSpy = jest.fn();
    component.countChanged.subscribe(emitSpy);
    
    const incrementBtn = fixture.nativeElement.querySelector('.increment');
    incrementBtn.click();
    incrementBtn.click();
    incrementBtn.click();
    
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy).toHaveBeenNthCalledWith(1, 1);
    expect(emitSpy).toHaveBeenNthCalledWith(2, 2);
    expect(emitSpy).toHaveBeenNthCalledWith(3, 3);
  });
});
```

**Legacy @Output() Decorator**:
```typescript
@Component({
  selector: 'app-search',
  template: `
    <input 
      type="text" 
      (input)="onInput($event)"
      (keyup.enter)="onSearch()"
    />
    <button (click)="onSearch()">Search</button>
  `
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  @Output() inputChanged = new EventEmitter<string>();
  
  query = '';
  
  onInput(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    this.inputChanged.emit(this.query);
  }
  
  onSearch() {
    this.search.emit(this.query);
  }
}

describe('SearchComponent Outputs', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should emit inputChanged on input', () => {
    const inputSpy = jest.fn();
    component.inputChanged.subscribe(inputSpy);
    
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test query';
    input.dispatchEvent(new Event('input'));
    
    expect(inputSpy).toHaveBeenCalledWith('test query');
  });
  
  it('should emit search on button click', () => {
    const searchSpy = jest.fn();
    component.search.subscribe(searchSpy);
    
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'angular testing';
    input.dispatchEvent(new Event('input'));
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(searchSpy).toHaveBeenCalledWith('angular testing');
  });
  
  it('should emit search on Enter key', () => {
    const searchSpy = jest.fn();
    component.search.subscribe(searchSpy);
    
    const input = fixture.nativeElement.querySelector('input');
    component.query = 'quick search';
    
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    
    expect(searchSpy).toHaveBeenCalledWith('quick search');
  });
});
```

**Testing Complex Outputs**:
```typescript
@Component({
  selector: 'app-file-upload',
  template: `
    <input 
      type="file" 
      (change)="onFileSelected($event)"
      accept="image/*"
      multiple
    />
  `
})
export class FileUploadComponent {
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() uploadError = new EventEmitter<string>();
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    if (files.length === 0) {
      return;
    }
    
    const invalidFiles = files.filter(f => !f.type.startsWith('image/'));
    
    if (invalidFiles.length > 0) {
      this.uploadError.emit('Only image files are allowed');
      return;
    }
    
    this.filesSelected.emit(files);
  }
}

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should emit filesSelected with valid files', () => {
    const filesSpy = jest.fn();
    component.filesSelected.subscribe(filesSpy);
    
    const file1 = new File([''], 'image1.png', { type: 'image/png' });
    const file2 = new File([''], 'image2.jpg', { type: 'image/jpeg' });
    
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file1);
    dataTransfer.items.add(file2);
    input.files = dataTransfer.files;
    
    input.dispatchEvent(new Event('change'));
    
    expect(filesSpy).toHaveBeenCalledWith([file1, file2]);
  });
  
  it('should emit uploadError for invalid files', () => {
    const errorSpy = jest.fn();
    component.uploadError.subscribe(errorSpy);
    
    const invalidFile = new File([''], 'document.pdf', { type: 'application/pdf' });
    
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(invalidFile);
    input.files = dataTransfer.files;
    
    input.dispatchEvent(new Event('change'));
    
    expect(errorSpy).toHaveBeenCalledWith('Only image files are allowed');
  });
});
```

**Exercise**:
1. Create a `RatingComponent` with star input (1-5) and rated output
2. Create a `FilterComponent` with multiple filter inputs and filtered output
3. Test all inputs are rendered correctly
4. Test all outputs are emitted with correct data

