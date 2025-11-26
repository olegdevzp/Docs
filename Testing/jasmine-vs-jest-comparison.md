# Jasmine vs Jest: Comprehensive Testing Comparison

## Table of Contents
1. [Overview](#overview)
2. [Key Differences](#key-differences)
3. [Test Writing Syntax](#test-writing-syntax)
4. [Mocking Strategies](#mocking-strategies)
5. [Async Testing](#async-testing)
6. [Matchers Comparison](#matchers-comparison)
7. [Component Testing](#component-testing)
8. [Feature Comparison](#feature-comparison)
9. [Configuration](#configuration)
10. [When to Use Which](#when-to-use-which)
11. [Migration Guide](#migration-guide)

---

## Overview

### Jasmine
- **Type**: Behavior-driven testing framework
- **Default**: Angular CLI projects
- **Environment**: Browser or Node.js
- **Test Runner**: Requires Karma (for browser testing)
- **Code Coverage**: Requires external tools (Istanbul/nyc)
- **Philosophy**: Batteries-included BDD framework

### Jest
- **Type**: All-in-one testing framework
- **Popular In**: React ecosystem, growing in Angular
- **Environment**: Node.js only
- **Test Runner**: Built-in
- **Code Coverage**: Built-in
- **Philosophy**: Zero-config, fast, developer-friendly

---

## Key Differences

| Aspect | Jasmine | Jest |
|--------|---------|------|
| **Test Runner** | Karma (separate) | Built-in |
| **Execution** | Browser-based | Node.js-based |
| **Speed** | Slower | Faster (parallel execution) |
| **Configuration** | More complex | Minimal/Zero-config |
| **Mocking** | `jasmine.createSpyObj` | `jest.fn()`, `jest.mock()` |
| **Snapshot Testing** | ❌ | ✅ |
| **Module Mocking** | Manual | Automatic |
| **Watch Mode** | Via Karma | Built-in interactive |
| **Code Coverage** | External (Istanbul) | Built-in (--coverage) |
| **Parallel Tests** | ❌ | ✅ |
| **Setup Complexity** | High | Low |
| **Community (Angular)** | Very Large | Growing |
| **Community (React)** | Small | Dominant |

---

## Test Writing Syntax

### Basic Test Structure

Both frameworks use similar describe/it syntax, but setup differs:

#### Jasmine (Angular Default)

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user by id', () => {
    const user = service.getUserById(1);
    expect(user.name).toBe('John');
    expect(user.id).toBe(1);
  });

  it('should return all users', () => {
    const users = service.getAllUsers();
    expect(users.length).toBeGreaterThan(0);
  });
});
```

#### Jest

```typescript
// user.service.spec.ts
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user by id', () => {
    const user = service.getUserById(1);
    expect(user.name).toBe('John');
    expect(user.id).toBe(1);
  });

  it('should return all users', () => {
    const users = service.getAllUsers();
    expect(users.length).toBeGreaterThan(0);
  });
});
```

### Test Lifecycle Hooks

Both frameworks provide the same lifecycle hooks:

```typescript
describe('Test Suite', () => {
  beforeAll(() => {
    // Runs once before all tests
  });

  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Runs after each test
  });

  afterAll(() => {
    // Runs once after all tests
  });

  it('test case', () => {
    // Test implementation
  });
});
```

---

## Mocking Strategies

### Jasmine Spies

```typescript
import { of, throwError } from 'rxjs';

describe('DataService with Jasmine', () => {
  let service: DataService;
  let httpMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    // Create spy object with methods
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new DataService(httpMock);
  });

  it('should fetch data successfully', () => {
    const mockData = { id: 1, name: 'Test' };
    httpMock.get.and.returnValue(of(mockData));

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    expect(httpMock.get).toHaveBeenCalledWith('/api/data');
    expect(httpMock.get).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', () => {
    const errorMessage = 'Server error';
    httpMock.get.and.returnValue(throwError(() => new Error(errorMessage)));
    
    service.getData().subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  it('should call API multiple times', () => {
    httpMock.get.and.returnValues(
      of({ id: 1 }),
      of({ id: 2 }),
      of({ id: 3 })
    );

    service.getData().subscribe();
    service.getData().subscribe();
    service.getData().subscribe();

    expect(httpMock.get).toHaveBeenCalledTimes(3);
  });

  it('should spy on existing method', () => {
    const calculator = new Calculator();
    spyOn(calculator, 'add').and.returnValue(10);

    expect(calculator.add(2, 3)).toBe(10);
    expect(calculator.add).toHaveBeenCalledWith(2, 3);
  });

  it('should call through to real implementation', () => {
    const calculator = new Calculator();
    spyOn(calculator, 'add').and.callThrough();

    expect(calculator.add(2, 3)).toBe(5); // Real implementation
    expect(calculator.add).toHaveBeenCalled();
  });
});
```

### Jest Mocks

```typescript
import { of, throwError } from 'rxjs';

describe('DataService with Jest', () => {
  let service: DataService;
  let httpMock: any;

  beforeEach(() => {
    // Create mock object
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

  it('should fetch data successfully', () => {
    const mockData = { id: 1, name: 'Test' };
    httpMock.get.mockReturnValue(of(mockData));

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    expect(httpMock.get).toHaveBeenCalledWith('/api/data');
    expect(httpMock.get).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', () => {
    const errorMessage = 'Server error';
    httpMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));
    
    service.getData().subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  it('should call API multiple times', () => {
    httpMock.get
      .mockReturnValueOnce(of({ id: 1 }))
      .mockReturnValueOnce(of({ id: 2 }))
      .mockReturnValueOnce(of({ id: 3 }));

    service.getData().subscribe();
    service.getData().subscribe();
    service.getData().subscribe();

    expect(httpMock.get).toHaveBeenCalledTimes(3);
  });

  it('should spy on existing method', () => {
    const calculator = new Calculator();
    jest.spyOn(calculator, 'add').mockReturnValue(10);

    expect(calculator.add(2, 3)).toBe(10);
    expect(calculator.add).toHaveBeenCalledWith(2, 3);
  });

  it('should call through to real implementation', () => {
    const calculator = new Calculator();
    const spy = jest.spyOn(calculator, 'add');

    expect(calculator.add(2, 3)).toBe(5); // Real implementation
    expect(spy).toHaveBeenCalled();
  });

  it('should mock implementation', () => {
    const calculator = new Calculator();
    jest.spyOn(calculator, 'add').mockImplementation((a, b) => a * b);

    expect(calculator.add(2, 3)).toBe(6); // Multiply instead of add
  });
});
```

### Module Mocking

#### Jasmine

```typescript
// Manual module mocking
import { UserService } from './user.service';

describe('Component with mocked service', () => {
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUsers',
      'getUserById',
      'createUser'
    ]);

    TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    });
  });

  it('should use mocked service', () => {
    mockUserService.getUsers.and.returnValue(of([]));
    // Test implementation
  });
});
```

#### Jest

```typescript
// Automatic module mocking
jest.mock('./user.service');

import { UserService } from './user.service';

describe('Component with mocked service', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    mockUserService.getUsers = jest.fn().mockReturnValue(of([]));
  });

  it('should use mocked service', () => {
    // Test implementation
  });
});

// Or mock specific implementations
jest.mock('./user.service', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    getUsers: jest.fn().mockReturnValue(of([])),
    getUserById: jest.fn()
  }))
}));
```

---

## Async Testing

### Callback Style (done)

Both frameworks support the `done` callback:

```typescript
// Same in both Jasmine and Jest
it('should handle async with callback', (done) => {
  service.fetchUser().subscribe(user => {
    expect(user.name).toBe('John');
    done(); // Must call done() when async operation completes
  });
});

it('should handle errors with callback', (done) => {
  service.fetchUser().subscribe({
    error: (error) => {
      expect(error).toBeDefined();
      done();
    }
  });
});
```

### Promise-based Testing

```typescript
// Same in both frameworks
it('should handle promises', async () => {
  const user = await service.getUserPromise();
  expect(user.name).toBe('John');
});

it('should handle promise rejection', async () => {
  await expect(service.failingPromise()).rejects.toThrow('Error message');
});
```

### Jasmine-specific: fakeAsync and tick

```typescript
import { fakeAsync, tick, flush } from '@angular/core/testing';

describe('AsyncService with fakeAsync', () => {
  it('should handle delayed operations', fakeAsync(() => {
    let result = '';
    
    service.delayedOperation(1000).subscribe(val => {
      result = val;
    });

    // Initially empty
    expect(result).toBe('');

    // Advance time by 1000ms
    tick(1000);

    // Now result is populated
    expect(result).toBe('done');
  }));

  it('should handle multiple timers', fakeAsync(() => {
    let results: string[] = [];

    setTimeout(() => results.push('first'), 100);
    setTimeout(() => results.push('second'), 200);
    setTimeout(() => results.push('third'), 300);

    tick(100);
    expect(results).toEqual(['first']);

    tick(100);
    expect(results).toEqual(['first', 'second']);

    tick(100);
    expect(results).toEqual(['first', 'second', 'third']);
  }));

  it('should flush all pending timers', fakeAsync(() => {
    let count = 0;

    setTimeout(() => count++, 100);
    setTimeout(() => count++, 200);
    setTimeout(() => count++, 300);

    flush(); // Fast-forward all pending timers

    expect(count).toBe(3);
  }));
});
```

### Jest Timer Mocking

```typescript
describe('AsyncService with Jest timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle delayed operations', () => {
    let result = '';
    
    service.delayedOperation(1000).subscribe(val => {
      result = val;
    });

    expect(result).toBe('');

    jest.advanceTimersByTime(1000);

    expect(result).toBe('done');
  });

  it('should handle multiple timers', () => {
    let results: string[] = [];

    setTimeout(() => results.push('first'), 100);
    setTimeout(() => results.push('second'), 200);
    setTimeout(() => results.push('third'), 300);

    jest.advanceTimersByTime(100);
    expect(results).toEqual(['first']);

    jest.advanceTimersByTime(100);
    expect(results).toEqual(['first', 'second']);

    jest.advanceTimersByTime(100);
    expect(results).toEqual(['first', 'second', 'third']);
  });

  it('should run all timers', () => {
    let count = 0;

    setTimeout(() => count++, 100);
    setTimeout(() => count++, 200);
    setTimeout(() => count++, 300);

    jest.runAllTimers(); // Run all pending timers

    expect(count).toBe(3);
  });

  it('should run only pending timers', () => {
    let count = 0;

    setTimeout(() => {
      count++;
      setTimeout(() => count++, 100); // Nested timer
    }, 100);

    jest.runOnlyPendingTimers(); // Runs only first level

    expect(count).toBe(1);
  });
});
```

---

## Matchers Comparison

### Common Matchers (Available in Both)

```typescript
// Equality
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).not.toBe(unexpected);        // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeGreaterThanOrEqual(10);
expect(value).toBeLessThan(10);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(0.3, 2);        // For floating point

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/pattern/);

// Arrays and Iterables
expect(array).toContain(item);
expect(array).toHaveSize(3);              // Jest only

// Objects
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', value);

// Exceptions
expect(fn).toThrow();
expect(fn).toThrowError('message');

// Spies/Mocks
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg1, arg2);
expect(spy).toHaveBeenCalledTimes(2);
```

### Jest-Only Matchers

```typescript
// Snapshot Testing
expect(component).toMatchSnapshot();
expect(value).toMatchInlineSnapshot(`"expected"`);

// Stricter Equality
expect(value).toStrictEqual(expected);     // Checks undefined properties

// Array/String Length
expect(array).toHaveLength(3);
expect(string).toHaveLength(5);

// Promise Matchers
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
await expect(promise).resolves.toMatchObject({ key: 'value' });

// Mock Function Matchers
expect(mock).toHaveBeenLastCalledWith(args);
expect(mock).toHaveBeenNthCalledWith(n, args);
expect(mock).toHaveReturnedWith(value);
expect(mock).toHaveReturnedTimes(n);

// Type Checking
expect(value).toBeInstanceOf(Class);

// Custom Matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () => `expected ${received} to be within ${floor}-${ceiling}`
    };
  }
});
```

### Jasmine-Only Matchers

```typescript
// Spy-specific
expect(spy).toHaveBeenCalledBefore(otherSpy);
expect(spy).toHaveBeenCalledWith(jasmine.any(String));
expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ key: 'value' }));
expect(spy).toHaveBeenCalledWith(jasmine.arrayContaining([1, 2]));

// Custom Matchers
jasmine.addMatchers({
  toBeWithinRange: () => ({
    compare: (actual, floor, ceiling) => {
      const pass = actual >= floor && actual <= ceiling;
      return {
        pass,
        message: `Expected ${actual} to be within ${floor}-${ceiling}`
      };
    }
  })
});
```

---

## Component Testing

### Jasmine with Angular Testing Utilities

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'getUserById'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const nameElement = compiled.querySelector('.user-name');
    expect(nameElement.textContent).toContain('John Doe');
  });

  it('should load users on init', () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];
    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.users).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should emit event on button click', () => {
    spyOn(component.userSelected, 'emit');
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    
    const button = fixture.nativeElement.querySelector('button.select-user');
    button.click();

    expect(component.userSelected.emit).toHaveBeenCalledWith(1);
  });

  it('should update user input', () => {
    const input = fixture.nativeElement.querySelector('input[name="username"]');
    input.value = 'NewName';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.username).toBe('NewName');
  });

  it('should handle async operations', async () => {
    userService.getUserById.and.returnValue(of({ 
      id: 1, 
      name: 'John', 
      email: 'john@example.com' 
    }));

    await component.loadUser(1);
    fixture.detectChanges();

    expect(component.currentUser?.name).toBe('John');
  });
});
```

### Jest with Angular Testing Utilities

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const userServiceMock = {
      getUsers: jest.fn(),
      getUserById: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const nameElement = compiled.querySelector('.user-name');
    expect(nameElement.textContent).toContain('John Doe');
  });

  it('should load users on init', () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];
    userService.getUsers.mockReturnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.users).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should emit event on button click', () => {
    const emitSpy = jest.spyOn(component.userSelected, 'emit');
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    
    const button = fixture.nativeElement.querySelector('button.select-user');
    button.click();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should update user input', () => {
    const input = fixture.nativeElement.querySelector('input[name="username"]');
    input.value = 'NewName';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.username).toBe('NewName');
  });

  it('should handle async operations', async () => {
    userService.getUserById.mockReturnValue(of({ 
      id: 1, 
      name: 'John', 
      email: 'john@example.com' 
    }));

    await component.loadUser(1);
    fixture.detectChanges();

    expect(component.currentUser?.name).toBe('John');
  });

  it('should match snapshot', () => {
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    fixture.detectChanges();
    
    expect(fixture).toMatchSnapshot();
  });
});
```

---

## Feature Comparison

### Performance

| Feature | Jasmine | Jest |
|---------|---------|------|
| **Execution Speed** | Slower (browser-based) | Faster (Node.js, parallel) |
| **Parallel Tests** | ❌ | ✅ (--maxWorkers) |
| **Test Isolation** | Per browser refresh | Per test file |
| **Watch Mode** | Via Karma | Built-in, interactive |
| **Cache** | ❌ | ✅ (speeds up reruns) |

### Developer Experience

| Feature | Jasmine | Jest |
|---------|---------|------|
| **Setup** | Complex (Karma config) | Simple/Zero-config |
| **Error Messages** | Good | Excellent |
| **IDE Integration** | Good | Excellent |
| **Debugging** | Browser DevTools | Node debugger, VS Code |
| **Watch Mode UX** | Basic | Interactive, filtered |

### Features

| Feature | Jasmine | Jest |
|---------|---------|------|
| **Snapshot Testing** | ❌ | ✅ |
| **Code Coverage** | Via Istanbul | Built-in |
| **Module Mocking** | Manual | Automatic |
| **Timer Mocking** | Via fakeAsync | Built-in |
| **Custom Matchers** | ✅ | ✅ |
| **Async/Await** | ✅ | ✅ |
| **beforeAll/afterAll** | ✅ | ✅ |

---

## Configuration

### Jasmine Configuration

#### karma.conf.js

```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false,
        seed: 42,
        stopSpecOnExpectationFailure: false
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    singleRun: false,
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 60000
  });
};
```

#### jasmine.json

```json
{
  "spec_dir": "src",
  "spec_files": [
    "**/*.spec.ts"
  ],
  "helpers": [
    "helpers/**/*.ts"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

#### package.json scripts

```json
{
  "scripts": {
    "test": "ng test",
    "test:headless": "ng test --browsers=ChromeHeadless --watch=false",
    "test:coverage": "ng test --code-coverage --watch=false"
  }
}
```

### Jest Configuration

#### jest.config.js

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
  coverageReporters: [
    'html',
    'text',
    'lcov',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1'
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
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  maxWorkers: '50%',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache'
};
```

#### setup-jest.ts

```typescript
import 'jest-preset-angular/setup-jest';

// Add custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`
    };
  }
});

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

#### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

## When to Use Which

### Choose Jasmine When:

✅ **Working with existing Angular projects**
- Most Angular projects already use Jasmine
- Migration might not provide enough value

✅ **Need browser-specific testing**
- Testing browser APIs extensively
- DOM manipulation testing
- Cross-browser compatibility testing

✅ **Team familiarity**
- Team is experienced with Jasmine/Karma
- Training costs outweigh benefits of switching

✅ **Mature ecosystem requirements**
- Well-established Angular testing patterns
- Extensive documentation and community support

### Choose Jest When:

✅ **Starting new projects**
- Modern setup with better DX
- Faster test execution
- Better tooling support

✅ **Want faster test execution**
- Parallel test running
- Smart test selection
- Watch mode optimization

✅ **Need snapshot testing**
- Component snapshot tests
- API response snapshots
- Configuration snapshots

✅ **Better developer experience**
- Zero/minimal configuration
- Excellent error messages
- Interactive watch mode
- Better VS Code integration

✅ **Unified testing across stack**
- Using React/Vue/Node.js elsewhere
- Consistent testing patterns
- Shared testing knowledge

✅ **CI/CD optimization**
- Faster CI builds
- Better cache utilization
- Parallel execution

---

## Migration Guide

### Jasmine to Jest Migration

#### Step 1: Install Dependencies

```bash
# Uninstall Jasmine and Karma
npm uninstall jasmine-core @types/jasmine karma karma-jasmine karma-chrome-launcher karma-coverage karma-jasmine-html-reporter

# Install Jest
npm install --save-dev jest @types/jest jest-preset-angular @angular-builders/jest
```

#### Step 2: Configuration Files

Remove:
- `karma.conf.js`
- `src/test.ts`

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts'
  ]
};
```

Create `setup-jest.ts`:

```typescript
import 'jest-preset-angular/setup-jest';
```

#### Step 3: Update package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Step 4: Update Test Files

**Replace Jasmine spies:**

```typescript
// Before (Jasmine)
const spy = jasmine.createSpyObj('Service', ['method']);
spy.method.and.returnValue(of(data));
spyOn(service, 'method').and.returnValue(of(data));

// After (Jest)
const spy = {
  method: jest.fn().mockReturnValue(of(data))
};
jest.spyOn(service, 'method').mockReturnValue(of(data));
```

**Update mock implementations:**

```typescript
// Before (Jasmine)
service.getData.and.callFake(() => of(mockData));

// After (Jest)
service.getData.mockImplementation(() => of(mockData));
```

**Update timer tests:**

```typescript
// Before (Jasmine with fakeAsync)
import { fakeAsync, tick } from '@angular/core/testing';

it('test', fakeAsync(() => {
  // test code
  tick(1000);
}));

// After (Jest)
it('test', () => {
  jest.useFakeTimers();
  // test code
  jest.advanceTimersByTime(1000);
  jest.useRealTimers();
});
```

#### Step 5: Update tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "emitDecoratorMetadata": true
  },
  "files": [
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

#### Step 6: Common Migration Patterns

| Jasmine | Jest |
|---------|------|
| `jasmine.createSpyObj()` | `{ method: jest.fn() }` |
| `spyOn(obj, 'method')` | `jest.spyOn(obj, 'method')` |
| `.and.returnValue()` | `.mockReturnValue()` |
| `.and.callFake()` | `.mockImplementation()` |
| `.and.returnValues()` | `.mockReturnValueOnce()` |
| `.and.throwError()` | `.mockImplementation(() => { throw error })` |
| `expect(spy).toHaveBeenCalled()` | Same |
| `expect(spy).toHaveBeenCalledWith()` | Same |
| `jasmine.any(Type)` | `expect.any(Type)` |

---

## Best Practices

### General Testing Best Practices

```typescript
// ✅ GOOD: Descriptive test names
it('should display error message when login fails', () => {});

// ❌ BAD: Vague test names
it('should work', () => {});

// ✅ GOOD: Arrange-Act-Assert pattern
it('should calculate total with discount', () => {
  // Arrange
  const cart = new ShoppingCart();
  cart.addItem({ price: 100, quantity: 2 });
  
  // Act
  const total = cart.calculateTotal(0.1); // 10% discount
  
  // Assert
  expect(total).toBe(180);
});

// ✅ GOOD: Test one thing at a time
it('should add item to cart', () => {
  cart.addItem(item);
  expect(cart.items).toContain(item);
});

it('should update cart total when item added', () => {
  cart.addItem(item);
  expect(cart.total).toBe(100);
});

// ❌ BAD: Testing multiple things
it('should add item and update total', () => {
  cart.addItem(item);
  expect(cart.items).toContain(item);
  expect(cart.total).toBe(100);
  expect(cart.itemCount).toBe(1);
});
```

### Jasmine-Specific Best Practices

```typescript
// ✅ Use createSpyObj for cleaner mocks
const serviceSpy = jasmine.createSpyObj('UserService', ['getUser', 'saveUser']);

// ✅ Use and.returnValue for simple returns
serviceSpy.getUser.and.returnValue(of(mockUser));

// ✅ Use and.callFake for complex logic
serviceSpy.getUser.and.callFake((id: number) => {
  return id === 1 ? of(mockUser) : throwError(() => new Error('Not found'));
});

// ✅ Clean up spies after each test
afterEach(() => {
  jasmine.clock().uninstall();
});
```

### Jest-Specific Best Practices

```typescript
// ✅ Use jest.fn() for simple mocks
const mockFn = jest.fn().mockReturnValue('result');

// ✅ Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

// ✅ Use snapshot testing for complex UI
expect(fixture).toMatchSnapshot();

// ✅ Update snapshots intentionally
// Run: jest -u

// ✅ Use mock modules for external dependencies
jest.mock('./api-service', () => ({
  fetchData: jest.fn().mockResolvedValue(mockData)
}));

// ✅ Use timer mocks properly
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
```

---

## Conclusion

Both **Jasmine** and **Jest** are excellent testing frameworks with their own strengths:

### Jasmine Strengths:
- ✅ Default in Angular ecosystem
- ✅ Mature and battle-tested
- ✅ Browser-based testing
- ✅ Large Angular community
- ✅ Excellent documentation

### Jest Strengths:
- ✅ Faster execution (parallel, caching)
- ✅ Better developer experience
- ✅ Built-in coverage and mocking
- ✅ Snapshot testing
- ✅ Zero configuration
- ✅ Excellent error messages

### Recommendation:

**For existing Angular projects**: Stick with **Jasmine** unless you have specific needs that Jest addresses.

**For new Angular projects**: Consider **Jest** for better performance and developer experience, especially if you value:
- Faster test execution
- Better tooling
- Unified testing across multiple frameworks
- Modern development workflow

The choice ultimately depends on your team's needs, existing expertise, and project requirements. Both frameworks are capable of producing high-quality, maintainable test suites.


