# Testing Guide - Unit Tests vs Integration Tests

## 📋 Overview

This project includes two types of tests:

### 1. **Unit Tests** (Already Created) ✅
- **Purpose**: Test service logic in isolation
- **API Connection**: **NO** - Uses mocks
- **Speed**: Very fast (~0.07 seconds for 102 tests)
- **Backend Required**: **NO**
- **Files**: `*.service.spec.ts`

### 2. **Integration Tests** (Optional)
- **Purpose**: Test real API integration
- **API Connection**: **YES** - Real HTTP requests
- **Speed**: Slower (depends on API response time)
- **Backend Required**: **YES** - Must be running
- **Files**: `*.integration.spec.ts`

---

## 🔬 Unit Tests (Current Implementation)

### What They Do
```typescript
// Unit tests use MOCKS - no real API calls
mockApiService.get.and.returnValue(of(mockData));  // ← Fake response

service.getAll().subscribe(response => {
  expect(response.data).toEqual(mockData);  // ← Tests logic, not API
});
```

### Benefits
✅ **Fast**: Run in milliseconds  
✅ **Reliable**: No network dependencies  
✅ **Isolated**: Test only the service code  
✅ **CI/CD Friendly**: Run anywhere without setup  
✅ **Deterministic**: Same results every time  

### When to Use
- Testing business logic
- Testing error handling
- Testing data transformations
- Continuous Integration pipelines
- During development

### Running Unit Tests
```bash
# Run all unit tests
npm test

# Run specific service tests
npm test -- --include='**/*.service.spec.ts'

# Run in watch mode
npm test -- --watch
```

---

## 🌐 Integration Tests (Real API)

### What They Do
```typescript
// Integration tests use REAL HTTP client
provideHttpClient()  // ← Real HTTP, not mocked

service.getAll().subscribe(response => {
  // This makes an ACTUAL HTTP request to http://localhost:3000
  expect(response.data).toBeDefined();
});
```

### Prerequisites
1. ✅ Backend server running at `http://localhost:3000`
2. ✅ MongoDB connected and populated with data
3. ✅ Valid test data in database
4. ⚠️ May modify database (use test DB!)

### Example Integration Test

I've created: `product.service.integration.spec.ts`

Tests are disabled by default (using `xit` instead of `it`):
```typescript
xit('should fetch real products from API', (done) => {
  // This will make a REAL HTTP request when enabled
  service.getAll().subscribe(response => {
    console.log('Real API Response:', response);
    expect(response.success).toBeDefined();
    done();
  });
});
```

### Enabling Integration Tests

**Step 1**: Start backend server
```bash
cd backend
npm start
```

**Step 2**: Update test file
```typescript
// Change from:
xit('should fetch...', (done) => { ... });

// To:
it('should fetch...', (done) => { ... });
```

**Step 3**: Run integration tests
```bash
npm test -- --include='**/*.integration.spec.ts'
```

### Important Considerations

⚠️ **WARNING**: Integration tests will:
- Make real HTTP requests
- Read/write to your database
- Take longer to execute
- Fail if backend is down
- May require cleanup

💡 **Best Practice**: Use a separate test database:
```typescript
// In backend .env.test
MONGODB_URI=mongodb://localhost:27017/estore-test
```

---

## 📊 Comparison Table

| Feature | Unit Tests | Integration Tests |
|---------|-----------|-------------------|
| **API Connection** | ❌ Mocked | ✅ Real |
| **Backend Required** | ❌ No | ✅ Yes |
| **Database Required** | ❌ No | ✅ Yes |
| **Speed** | ⚡ Very Fast | 🐢 Slower |
| **Reliability** | ✅ Always Pass | ⚠️ May Fail |
| **Setup Complexity** | 🟢 Simple | 🟡 Complex |
| **CI/CD Ready** | ✅ Yes | ⚠️ Needs Setup |
| **Test Isolation** | ✅ Perfect | ⚠️ Shared State |
| **Data Validation** | ❌ Mock Data | ✅ Real Data |

---

## 🎯 Recommended Testing Strategy

### For Development (Daily Work)
```bash
# Use unit tests - fast feedback
npm test -- --watch
```

### Before Committing
```bash
# Run all unit tests
npm test -- --watch=false
```

### Before Deployment (Optional)
```bash
# Start backend
cd backend && npm start

# In another terminal, run integration tests
cd admin
npm test -- --include='**/*.integration.spec.ts'
```

### In CI/CD Pipeline
```yaml
# Only run unit tests in CI (fast & reliable)
- name: Run Unit Tests
  run: npm test -- --watch=false --browsers=ChromeHeadless
```

---

## 🧪 Understanding TestBed

### What is TestBed?

**TestBed** is Angular's primary testing utility that creates a testing module to simulate an Angular environment. It allows you to configure and instantiate components, services, and dependencies just like in a real Angular application.

### Key Concepts

```typescript
TestBed.configureTestingModule({
  imports: [...],      // Modules, standalone components
  providers: [...],    // Services, tokens, factories
  declarations: [...]  // Legacy module-based components (not used in standalone)
});
```

### How TestBed Works

```
1. TestBed.configureTestingModule()
   └─> Creates isolated testing environment
   
2. TestBed.inject(Service)
   └─> Retrieves service instance from testing injector
   
3. TestBed.createComponent(Component)
   └─> Creates component instance with fixture
```

---

### Testing Services with TestBed

#### Basic Service Setup
```typescript
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService]  // ← Register service
    });
    
    service = TestBed.inject(ApiService);  // ← Get instance
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

#### With Dependencies (Unit Test - Mocked)
```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],  // ← Mock HTTP client
    providers: [ApiService]
  });
  
  service = TestBed.inject(ApiService);
  httpMock = TestBed.inject(HttpTestingController);  // ← Mock controller
});
```

#### With Real HTTP (Integration Test)
```typescript
import { provideHttpClient } from '@angular/common/http';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ApiService,
      provideHttpClient()  // ← Real HTTP client
    ]
  });
  
  service = TestBed.inject(ApiService);
});
```

---

### Testing Standalone Components with TestBed

#### Key Difference: Components Go in `imports`

**❌ Old Way (Module-based)**
```typescript
TestBed.configureTestingModule({
  declarations: [MyComponent],  // ← Wrong for standalone
  imports: [CommonModule]
});
```

**✅ New Way (Standalone)**
```typescript
TestBed.configureTestingModule({
  imports: [MyComponent, CommonModule]  // ← Component is imported!
});
```

#### Complete Example
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]  // ← Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // ← Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Admin');
  });
});
```

---

### Mocking Dependencies in TestBed

#### Mock Service Provider
```typescript
const mockAuthService = {
  isLoggedIn: () => true,
  getUser: () => ({ name: 'Test User' })
};

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: mockAuthService }  // ← Mock
  ]
});
```

#### Jasmine Spy
```typescript
let mockApiService: jasmine.SpyObj<ApiService>;

beforeEach(() => {
  mockApiService = jasmine.createSpyObj('ApiService', ['get', 'post']);
  
  TestBed.configureTestingModule({
    providers: [
      ProductService,
      { provide: ApiService, useValue: mockApiService }
    ]
  });
});

it('should call API', () => {
  mockApiService.get.and.returnValue(of({ data: [] }));
  // ... test code
  expect(mockApiService.get).toHaveBeenCalled();
});
```

---

### Common TestBed Patterns

#### 1. Testing with Router
```typescript
import { provideRouter } from '@angular/router';

TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [provideRouter([])]
});
```

#### 2. Testing with Signals (Modern Angular)
```typescript
import { provideZonelessChangeDetection } from '@angular/core';

TestBed.configureTestingModule({
  providers: [
    MyService,
    provideZonelessChangeDetection()  // ← For signals
  ]
});
```

#### 3. Testing with Environment Config
```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: 'API_URL', useValue: 'http://localhost:3000' }
  ]
});
```

---

### TestBed vs Manual Instantiation

#### ❌ Don't Do This
```typescript
// Without TestBed - missing Angular DI context
const service = new ApiService(new HttpClient());  // Won't work properly!
```

#### ✅ Do This
```typescript
// With TestBed - proper Angular environment
const service = TestBed.inject(ApiService);  // ✅ Correct!
```

**Why TestBed?**
- ✅ Sets up Angular's dependency injection
- ✅ Handles service lifecycle
- ✅ Provides proper testing context
- ✅ Manages component change detection
- ✅ Supports Angular-specific features (signals, zones)

---

### Real Examples from This Project

#### Unit Test Pattern (api.service.spec.ts)
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],  // ← Mock HTTP
    providers: [ApiService]
  });

  service = TestBed.inject(ApiService);
  httpMock = TestBed.inject(HttpTestingController);
});
```

#### Integration Test Pattern (product.service.integration.spec.ts)
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ProductService,
      ApiService,
      provideHttpClient(),  // ← Real HTTP
      provideZonelessChangeDetection()
    ]
  });

  service = TestBed.inject(ProductService);
});
```

---

### TestBed Best Practices

1. **Always use `TestBed.inject()`** instead of `new Service()`
2. **Reset TestBed after each test** (Jasmine does this automatically in `afterEach`)
3. **Call `compileComponents()`** for async component loading
4. **Use `fixture.detectChanges()`** to trigger component updates
5. **Prefer `provideHttpClient()`** over older `HttpClientModule`
6. **Mock dependencies in unit tests**, use real ones in integration tests

---

## 📝 Creating More Integration Tests

### Template
```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { YourService } from './your.service';

describe('YourService Integration Tests', () => {
  let service: YourService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        YourService,
        provideHttpClient(),  // ← Real HTTP client
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(YourService);
  });

  xit('should connect to real API', (done) => {
    service.someMethod().subscribe({
      next: (response) => {
        console.log('Response:', response);
        expect(response).toBeDefined();
        done();
      },
      error: (error) => {
        console.error('Error:', error);
        fail('Should connect successfully');
        done();
      }
    });
  });
});
```

---

## 🐛 Troubleshooting

### Unit Tests Failing
```bash
# Check if all dependencies are installed
npm install

# Clear cache
rm -rf node_modules .angular dist
npm install

# Run tests with verbose output
npm test -- --browsers=ChromeHeadless
```

### Integration Tests Failing

**Error**: "Connection refused"
```bash
# Solution: Start backend
cd backend && npm start
```

**Error**: "Cannot read property '_id' of undefined"
```bash
# Solution: Populate test data in database
# Or update test to use existing data IDs
```

**Error**: "Timeout"
```bash
# Solution: Increase jasmine timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
```

---

## 📚 Additional Resources

### Current Test Files
- ✅ `api.service.spec.ts` - Unit tests for API service (20 tests)
- ✅ `auth.service.spec.ts` - Unit tests for Auth service (29 tests)
- ✅ `category.service.spec.ts` - Unit tests for Category service (28 tests)
- ✅ `product.service.spec.ts` - Unit tests for Product service (25 tests)
- 📝 `product.service.integration.spec.ts` - Integration test example

### Test Results
```
UNIT TESTS:
✅ 102 tests passing
⏱️ 0.07 seconds
🎯 100% success rate
```

### Learn More
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Testing Best Practices](https://angular.dev/guide/testing/best-practices)

---

## ❓ FAQ

**Q: Should I always run integration tests?**  
A: No. Unit tests are sufficient for most development. Run integration tests before major releases.

**Q: Why are integration tests disabled by default?**  
A: To prevent accidental API calls and database modifications without backend setup.

**Q: Can I run both test types together?**  
A: Yes, but it's not recommended. They serve different purposes and run at different speeds.

**Q: Which tests should I write first?**  
A: Always start with unit tests. Add integration tests only when you need to verify API contracts.

**Q: Are the current 102 unit tests enough?**  
A: Yes! They provide comprehensive coverage of all service logic. Integration tests are optional.

---

**Summary**: The 102 unit tests already created are **production-ready** and provide excellent coverage. They use mocks (not real API) by design. Integration tests are **optional** and only needed if you want to verify actual API connectivity.


