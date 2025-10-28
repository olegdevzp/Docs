# Testing: E2E vs Unit vs Integration

A comprehensive guide to understanding and implementing the three main testing types in software development, with a focus on Angular applications.

---

## Table of Contents

1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [End-to-End (E2E) Testing](#end-to-end-e2e-testing)
4. [Testing Pyramid](#testing-pyramid)
5. [Comparison Table](#comparison-table)
6. [Best Practices](#best-practices)
7. [Angular-Specific Tips](#angular-specific-tips)

---

## Unit Testing

### What it is
Tests individual units of code (functions, methods, classes, components) in **complete isolation** from dependencies.

### Characteristics
- **Fastest** to run (milliseconds)
- **Most granular** - tests smallest pieces of code
- **Mocks/stubs** all external dependencies
- **Highest volume** - you should have the most unit tests (70% of all tests)
- **Easy to debug** - failures pinpoint exact issues
- **Low maintenance** - isolated changes don't break tests

### Angular Tools
- **Jasmine** + **Karma** (default Angular setup)
- **Jest** (popular alternative, faster)

### Example - Angular Component Unit Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { UserProfileComponent } from './user-profile.component';
import { UserService } from './user.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    // Mock the service - this is UNIT testing
    mockUserService = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
    
    TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    });

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name when user is loaded', () => {
    // Arrange
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockUserService.getUser.and.returnValue(of(mockUser));

    // Act
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain('John Doe');
  });

  it('should compute full name correctly', () => {
    // Test pure logic without any dependencies
    component.firstName = signal('John');
    component.lastName = signal('Doe');
    
    expect(component.fullName()).toBe('John Doe');
  });

  it('should call updateUser when save button is clicked', () => {
    // Arrange
    const updatedUser = { id: 1, name: 'Jane Doe', email: 'jane@example.com' };
    mockUserService.updateUser.and.returnValue(of(updatedUser));
    component.user.set(updatedUser);

    // Act
    component.saveUser();

    // Assert
    expect(mockUserService.updateUser).toHaveBeenCalledWith(updatedUser);
  });
});
```

### Example - Service Unit Test

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch user by id', () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle error when user not found', () => {
    service.getUserById(999).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('/api/users/999');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
```

### Example - Pure Function Unit Test

```typescript
// utils/array.utils.ts
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// utils/array.utils.spec.ts
import { removeDuplicates, groupBy } from './array.utils';

describe('Array Utils', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicate numbers', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should remove duplicate strings', () => {
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('should group objects by key', () => {
      const users = [
        { name: 'John', role: 'admin' },
        { name: 'Jane', role: 'user' },
        { name: 'Bob', role: 'admin' }
      ];

      const result = groupBy(users, 'role');

      expect(result['admin'].length).toBe(2);
      expect(result['user'].length).toBe(1);
    });
  });
});
```

### When to Use Unit Tests
- Testing business logic in services
- Testing utility functions and helpers
- Testing component logic (without DOM interaction)
- Testing pipes and directives in isolation
- Testing state transformations with signals
- Testing validators and form controls
- Testing guards and interceptors

---

## Integration Testing

### What it is
Tests how **multiple units work together** - testing the integration between components, services, and modules. It verifies that different parts of your application work correctly when combined.

### Characteristics
- **Medium speed** - slower than unit tests (seconds)
- Tests **real interactions** between components
- May use **real dependencies** or partial mocks
- Tests **contracts** between modules
- **Medium maintenance** - changes can affect multiple tests
- Tests data flow and communication

### Angular Context
- Testing component + service interaction
- Testing parent-child component communication
- Testing routing and navigation
- Testing form validation with services
- Testing state management integration

### Example - Component + Service Integration Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';

describe('UserListComponent Integration', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpMock: HttpTestingController;
  let userService: UserService; // Real service instance

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        HttpClientTestingModule // Testing HTTP interactions
      ],
      providers: [UserService] // Use REAL service
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load users through service and display them', () => {
    // Arrange
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    // Act
    fixture.detectChanges(); // Triggers ngOnInit

    // Simulate HTTP response
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    fixture.detectChanges();

    // Assert - test the integration between component and service
    expect(component.users()).toEqual(mockUsers);
    const compiled = fixture.nativeElement;
    const userElements = compiled.querySelectorAll('.user-item');
    expect(userElements.length).toBe(2);
    expect(userElements[0].textContent).toContain('User 1');
  });

  it('should handle errors from service', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/users');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();

    expect(component.errorMessage()).toBeTruthy();
    expect(component.users().length).toBe(0);
  });

  it('should delete user and refresh list', () => {
    const initialUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    fixture.detectChanges();

    // Initial load
    const loadReq = httpMock.expectOne('/api/users');
    loadReq.flush(initialUsers);
    fixture.detectChanges();

    // Delete user
    component.deleteUser(1);

    const deleteReq = httpMock.expectOne('/api/users/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    // Verify refresh
    const refreshReq = httpMock.expectOne('/api/users');
    refreshReq.flush([{ id: 2, name: 'User 2', email: 'user2@example.com' }]);

    fixture.detectChanges();
    expect(component.users().length).toBe(1);
  });
});
```

### Example - Parent-Child Component Integration

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentComponent } from './parent.component';
import { ChildComponent } from './child.component';
import { By } from '@angular/platform-browser';

describe('Parent-Child Component Integration', () => {
  let parentFixture: ComponentFixture<ParentComponent>;
  let parentComponent: ParentComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ParentComponent, ChildComponent]
    });

    parentFixture = TestBed.createComponent(ParentComponent);
    parentComponent = parentFixture.componentInstance;
  });

  it('should pass data from parent to child', () => {
    // Arrange
    const testData = { id: 1, name: 'Test' };
    parentComponent.data.set(testData);

    // Act
    parentFixture.detectChanges();

    // Assert
    const childDebugElement = parentFixture.debugElement.query(By.directive(ChildComponent));
    const childComponent = childDebugElement.componentInstance as ChildComponent;
    
    expect(childComponent.data()).toEqual(testData);
  });

  it('should handle events from child to parent', () => {
    // Arrange
    parentFixture.detectChanges();
    const childDebugElement = parentFixture.debugElement.query(By.directive(ChildComponent));
    const childComponent = childDebugElement.componentInstance as ChildComponent;

    // Act
    childComponent.itemClicked.emit({ id: 1, action: 'edit' });
    parentFixture.detectChanges();

    // Assert
    expect(parentComponent.selectedAction()).toBe('edit');
    expect(parentComponent.selectedId()).toBe(1);
  });
});
```

### Example - Router Integration Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

describe('Navigation Integration', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let component: NavigationComponent;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavigationComponent, HomeComponent, AboutComponent],
      providers: [
        provideRouter([
          { path: '', component: HomeComponent },
          { path: 'about', component: AboutComponent }
        ])
      ]
    });

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to about page', async () => {
    fixture.detectChanges();

    await component.navigateToAbout();
    
    expect(location.path()).toBe('/about');
  });

  it('should navigate back to home', async () => {
    await router.navigate(['/about']);
    expect(location.path()).toBe('/about');

    await component.navigateToHome();
    
    expect(location.path()).toBe('/');
  });
});
```

### When to Use Integration Tests
- Testing feature modules with multiple components
- Testing data flow between parent and child components
- Testing services with HTTP interactions
- Testing router navigation flows
- Testing forms with validation services
- Testing guards and resolvers with services
- Testing state management with multiple components

---

## End-to-End (E2E) Testing

### What it is
Tests the **entire application flow** from the user's perspective, simulating real user interactions in a browser environment. E2E tests validate complete user journeys.

### Characteristics
- **Slowest** to run (seconds to minutes)
- **Most realistic** - tests the whole system as users would
- Tests **user workflows** and scenarios
- Runs in a **real browser** environment
- **Fewest in number** - only critical user paths (10% of tests)
- **Highest confidence** - catches issues other tests miss
- **Most expensive** to maintain

### Angular Tools
- **Playwright** (recommended, modern, fast)
- **Cypress** (popular, great DX)
- **Protractor** (deprecated, no longer maintained)

### Example - Playwright E2E Test

```typescript
// e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should complete full registration process', async ({ page }) => {
    // Navigate to registration
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*\/register/);

    // Fill out the form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    
    // Select from dropdown
    await page.selectOption('select[name="country"]', 'USA');
    
    // Check terms and conditions
    await page.check('input[name="terms"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Registration successful');

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Verify user is logged in
    await expect(page.locator('.user-profile')).toContainText('test@example.com');
    await expect(page.locator('.user-name')).toContainText('John Doe');
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.click('text=Sign Up');
    
    // Try to submit without filling form
    await page.click('button[type="submit"]');
    
    // Check validation messages appear
    await expect(page.locator('.error-email')).toContainText('Email is required');
    await expect(page.locator('.error-password')).toContainText('Password is required');
    
    // Fill invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-email')).toContainText('Email must be valid');
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    await page.click('text=Sign Up');
    
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.check('input[name="terms"]');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-banner')).toContainText('Email already exists');
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/register', route => 
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
    );

    await page.click('text=Sign Up');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.check('input[name="terms"]');
    await page.click('button[type="submit"]');

    // Verify error handling
    await expect(page.locator('.error-banner')).toContainText('Registration failed');
  });
});
```

### Example - Cypress E2E Test

```typescript
// cypress/e2e/shopping-cart.cy.ts
describe('Shopping Cart Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('user@example.com', 'password123'); // Custom command
  });

  it('should add items to cart and complete checkout', () => {
    // Browse products
    cy.get('.product-card').first().click();
    
    // Add to cart
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('.cart-badge').should('contain', '1');
    
    // Continue shopping
    cy.get('[data-testid="continue-shopping"]').click();
    
    // Add another item
    cy.get('.product-card').eq(1).click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('.cart-badge').should('contain', '2');
    
    // View cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');
    
    // Verify items in cart
    cy.get('.cart-item').should('have.length', 2);
    
    // Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    // Fill shipping information
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="city"]').type('New York');
    cy.get('input[name="zipCode"]').type('10001');
    
    // Fill payment information
    cy.get('input[name="cardNumber"]').type('4111111111111111');
    cy.get('input[name="expiry"]').type('12/25');
    cy.get('input[name="cvv"]').type('123');
    
    // Place order
    cy.get('[data-testid="place-order"]').click();
    
    // Verify success
    cy.get('.order-confirmation').should('be.visible');
    cy.get('.order-number').should('exist');
    cy.url().should('include', '/order-confirmation');
  });

  it('should update cart quantities', () => {
    // Add item to cart
    cy.get('.product-card').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Increase quantity
    cy.get('[data-testid="increase-quantity"]').click();
    cy.get('.item-quantity').should('contain', '2');
    
    // Verify total price updated
    cy.get('.total-price').invoke('text').then((text) => {
      const total = parseFloat(text.replace('$', ''));
      expect(total).to.be.greaterThan(0);
    });
    
    // Decrease quantity
    cy.get('[data-testid="decrease-quantity"]').click();
    cy.get('.item-quantity').should('contain', '1');
  });

  it('should remove items from cart', () => {
    // Add item
    cy.get('.product-card').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Remove item
    cy.get('[data-testid="remove-item"]').click();
    
    // Verify cart is empty
    cy.get('.empty-cart-message').should('be.visible');
    cy.get('.cart-badge').should('not.exist');
  });
});
```

### Example - Playwright Page Object Pattern

```typescript
// e2e/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:4200/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return await this.page.locator('.error-message').textContent();
  }

  async isLoggedIn() {
    return await this.page.locator('.user-profile').isVisible();
  }
}

// e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('user@example.com', 'Password123!');
    
    expect(await loginPage.isLoggedIn()).toBe(true);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('user@example.com', 'wrongpassword');
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });
});
```

### When to Use E2E Tests
- Testing critical user journeys (login, registration, checkout)
- Testing complete workflows that span multiple pages
- Testing cross-browser compatibility
- Testing responsive design on different devices
- Testing complex user interactions and animations
- Smoke testing after deployment
- Testing integrations with third-party services
- Regression testing for critical features

---

## Testing Pyramid

```
           /\
          /  \     E2E (10-20%)
         /____\    Slowest, Most Expensive
        /      \   High Confidence
       /        \  Integration (20-30%)
      /__________\ Medium Speed & Cost
     /            \ Medium Confidence
    /              \ Unit (50-70%)
   /________________\ Fastest, Cheapest
                      Low Confidence
```

### Recommended Distribution

| Test Type | Percentage | Quantity | Speed | Focus |
|-----------|-----------|----------|-------|-------|
| **Unit** | 50-70% | Hundreds to thousands | Milliseconds | Individual functions/components |
| **Integration** | 20-30% | Dozens to hundreds | Seconds | Component interactions |
| **E2E** | 10-20% | A few dozen | Seconds to minutes | User workflows |

### Why This Distribution?

**Bottom-heavy pyramid is ideal because:**

1. **Fast Feedback** - Unit tests run in milliseconds, giving instant feedback
2. **Easy Debugging** - Failures pinpoint exact problems
3. **Low Cost** - Cheap to write and maintain
4. **Stability** - Less flaky than E2E tests
5. **Confidence** - Combined with integration and E2E, provides full coverage

**Anti-pattern: Ice Cream Cone** 🍦 (Avoid!)
```
   ________      Too many E2E tests
  /        \     Slow, expensive, flaky
 /          \    Integration
/__________\     Few unit tests
    Unit         Hard to debug
```

---

## Comparison Table

| Aspect | Unit | Integration | E2E |
|--------|------|-------------|-----|
| **Speed** | ⚡ Very Fast (ms) | 🏃 Medium (seconds) | 🐢 Slow (seconds to minutes) |
| **Scope** | Single function/component | Multiple components/services | Entire application |
| **Dependencies** | All mocked | Some real, some mocked | All real |
| **Confidence** | 🔸 Low (isolated) | 🔸🔸 Medium | 🔸🔸🔸 High (realistic) |
| **Maintenance** | ✅ Easy | 🟡 Medium | ❌ Hard |
| **Cost** | 💰 Low | 💰💰 Medium | 💰💰💰 High |
| **Debugging** | ✅ Easy to pinpoint | 🟡 Moderate effort | ❌ Difficult, multiple layers |
| **Flakiness** | Stable | Mostly stable | Can be flaky |
| **Environment** | Test environment | Test environment | Real browser |
| **Code Coverage** | High, granular | Medium | Low, high-level |
| **When to Run** | Every commit | Before merge/PR | Before deploy/scheduled |
| **CI/CD Time** | < 1 minute | 1-5 minutes | 5-30+ minutes |

---

## Best Practices

### Unit Testing Best Practices

#### 1. Follow AAA Pattern
```typescript
it('should calculate total price with discount', () => {
  // Arrange - Set up test data
  const cart = { items: [{ price: 100 }, { price: 50 }], discount: 0.1 };
  
  // Act - Execute the function
  const total = calculateTotal(cart);
  
  // Assert - Verify the result
  expect(total).toBe(135); // (100 + 50) * 0.9
});
```

#### 2. Test One Thing at a Time
```typescript
// ❌ Bad - Testing multiple things
it('should handle user operations', () => {
  expect(service.createUser()).toBeTruthy();
  expect(service.updateUser()).toBeTruthy();
  expect(service.deleteUser()).toBeTruthy();
});

// ✅ Good - Separate tests
it('should create user', () => {
  expect(service.createUser()).toBeTruthy();
});

it('should update user', () => {
  expect(service.updateUser()).toBeTruthy();
});

it('should delete user', () => {
  expect(service.deleteUser()).toBeTruthy();
});
```

#### 3. Use Descriptive Test Names
```typescript
// ❌ Bad
it('test1', () => { });
it('should work', () => { });

// ✅ Good
it('should return empty array when no users exist', () => { });
it('should throw error when email is invalid', () => { });
it('should calculate discount correctly for premium users', () => { });
```

#### 4. Mock All External Dependencies
```typescript
// ✅ Good - All dependencies mocked
beforeEach(() => {
  mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  mockLogger = jasmine.createSpyObj('Logger', ['log', 'error']);
  mockConfig = { apiUrl: 'http://test.com' };
  
  service = new UserService(mockHttpClient, mockLogger, mockConfig);
});
```

#### 5. Test Edge Cases and Error Scenarios
```typescript
describe('divide', () => {
  it('should divide two positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow();
  });

  it('should handle decimals', () => {
    expect(divide(10, 3)).toBeCloseTo(3.33, 2);
  });
});
```

#### 6. Aim for High Coverage (80%+)
- Focus on business logic
- Don't obsess over 100% coverage
- Some code (like Angular lifecycle hooks) may not need tests
- Use coverage reports to find untested paths

#### 7. Keep Tests Fast
- Avoid setTimeout/setInterval
- Mock time-dependent functions
- Use `fakeAsync` and `tick()` in Angular

```typescript
it('should debounce search input', fakeAsync(() => {
  component.search.set('test');
  
  tick(299); // Just before debounce time
  expect(searchService.search).not.toHaveBeenCalled();
  
  tick(1); // Complete debounce time (300ms)
  expect(searchService.search).toHaveBeenCalledWith('test');
}));
```

---

### Integration Testing Best Practices

#### 1. Test Realistic Scenarios
```typescript
it('should complete user registration flow', () => {
  // Real service interactions
  component.registerUser({
    email: 'test@example.com',
    password: 'Pass123!',
    name: 'John Doe'
  });

  // Verify service was called
  const req = httpMock.expectOne('/api/register');
  req.flush({ id: 1, email: 'test@example.com' });

  // Verify component updated
  expect(component.registrationSuccess()).toBe(true);
  
  // Verify navigation
  expect(router.url).toBe('/dashboard');
});
```

#### 2. Use Real Services Where Possible
```typescript
// ✅ Good - Use real services for integration
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [
    UserService,        // Real service
    AuthService,        // Real service
    { provide: ConfigService, useValue: mockConfig } // Mock only infrastructure
  ]
});
```

#### 3. Test Component Communication
```typescript
it('should emit event from child to parent', () => {
  const parentFixture = TestBed.createComponent(ParentComponent);
  const parent = parentFixture.componentInstance;
  
  parentFixture.detectChanges();
  
  const childDebug = parentFixture.debugElement.query(By.directive(ChildComponent));
  const child = childDebug.componentInstance;
  
  // Trigger child event
  child.itemSelected.emit({ id: 1, name: 'Test' });
  
  // Verify parent received it
  expect(parent.selectedItem()).toEqual({ id: 1, name: 'Test' });
});
```

#### 4. Test Router Navigation
```typescript
it('should navigate to detail page when clicking item', async () => {
  await router.navigate(['/items']);
  fixture.detectChanges();
  
  const firstItem = fixture.nativeElement.querySelector('.item');
  firstItem.click();
  
  await fixture.whenStable();
  
  expect(location.path()).toBe('/items/1');
});
```

#### 5. Test Form Validation with Services
```typescript
it('should validate email using validation service', () => {
  const form = component.form;
  const emailControl = form.get('email');
  
  // Invalid email
  emailControl?.setValue('invalid-email');
  expect(emailControl?.hasError('email')).toBe(true);
  
  // Valid email
  emailControl?.setValue('valid@example.com');
  expect(emailControl?.valid).toBe(true);
  
  // Check if service was called for async validation
  tick(300);
  expect(validationService.checkEmail).toHaveBeenCalledWith('valid@example.com');
});
```

---

### E2E Testing Best Practices

#### 1. Test Critical User Paths Only
Focus on:
- Login/Registration
- Payment flows
- Core business workflows
- Critical features that generate revenue

Avoid testing:
- Every possible navigation path
- Minor UI variations
- Features well-covered by unit/integration tests

#### 2. Use Page Object Pattern
```typescript
// pages/checkout.page.ts
export class CheckoutPage {
  constructor(private page: Page) {}

  async fillShippingInfo(address: Address) {
    await this.page.fill('[name="street"]', address.street);
    await this.page.fill('[name="city"]', address.city);
    await this.page.fill('[name="zip"]', address.zip);
  }

  async fillPaymentInfo(payment: Payment) {
    await this.page.fill('[name="cardNumber"]', payment.cardNumber);
    await this.page.fill('[name="expiry"]', payment.expiry);
  }

  async placeOrder() {
    await this.page.click('[data-testid="place-order"]');
  }

  async getOrderNumber() {
    return await this.page.locator('.order-number').textContent();
  }
}

// tests/checkout.spec.ts
test('should complete checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  await checkoutPage.fillShippingInfo({
    street: '123 Main St',
    city: 'New York',
    zip: '10001'
  });
  
  await checkoutPage.fillPaymentInfo({
    cardNumber: '4111111111111111',
    expiry: '12/25'
  });
  
  await checkoutPage.placeOrder();
  
  const orderNumber = await checkoutPage.getOrderNumber();
  expect(orderNumber).toBeTruthy();
});
```

#### 3. Keep Tests Independent
```typescript
// ✅ Good - Each test is independent
test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page, 'admin@example.com', 'password');
  });

  test('should create user', async ({ page }) => {
    // Create user
    // Don't depend on other tests
  });

  test('should update user', async ({ page }) => {
    // Create user first, then update
    // Don't assume user exists from previous test
  });
});
```

#### 4. Use Data Attributes for Stable Selectors
```typescript
// ❌ Bad - Fragile selectors
await page.click('.btn-primary.submit-button.large');

// ✅ Good - Stable data attributes
await page.click('[data-testid="submit-button"]');
```

```html
<!-- In your Angular template -->
<button data-testid="submit-button" class="btn btn-primary">
  Submit
</button>
```

#### 5. Handle Async Operations Properly
```typescript
// ✅ Good - Wait for specific conditions
await page.click('[data-testid="load-data"]');
await expect(page.locator('.data-loaded')).toBeVisible();

// Or wait for network
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/data')),
  page.click('[data-testid="load-data"]')
]);
```

#### 6. Use Fixtures for Test Data
```typescript
// fixtures/users.json
{
  "testUser": {
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  },
  "adminUser": {
    "email": "admin@example.com",
    "password": "Admin123!",
    "name": "Admin User"
  }
}

// test
import users from '../fixtures/users.json';

test('should login as test user', async ({ page }) => {
  await loginPage.login(users.testUser.email, users.testUser.password);
});
```

#### 7. Run E2E Tests in CI/CD
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build app
        run: npm run build
      
      - name: Run E2E tests
        run: npm run e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

#### 8. Test on Multiple Browsers
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

---

## Angular-Specific Tips

### Testing Signals

```typescript
describe('Signal State Management', () => {
  it('should update computed signal when input changes', () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);
    const tripled = computed(() => count() * 3);
    
    expect(doubled()).toBe(0);
    expect(tripled()).toBe(0);
    
    count.set(5);
    
    expect(doubled()).toBe(10);
    expect(tripled()).toBe(15);
  });

  it('should use update method for transformations', () => {
    const items = signal<string[]>([]);
    
    items.update(current => [...current, 'item1']);
    expect(items()).toEqual(['item1']);
    
    items.update(current => [...current, 'item2']);
    expect(items()).toEqual(['item1', 'item2']);
  });

  it('should batch signal updates', () => {
    const firstName = signal('John');
    const lastName = signal('Doe');
    const fullName = computed(() => `${firstName()} ${lastName()}`);
    
    let computeCount = 0;
    effect(() => {
      fullName();
      computeCount++;
    });
    
    // Batch updates
    firstName.set('Jane');
    lastName.set('Smith');
    
    // Computed should only run once despite two changes
    expect(fullName()).toBe('Jane Smith');
  });
});
```

### Testing with inject()

```typescript
describe('Service with inject()', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);
  });
});
```

### Testing Standalone Components

```typescript
describe('Standalone Component', () => {
  let component: MyStandaloneComponent;
  let fixture: ComponentFixture<MyStandaloneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MyStandaloneComponent, // Import component directly
        HttpClientTestingModule,
        // Other imports the component needs
      ]
    });

    fixture = TestBed.createComponent(MyStandaloneComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Testing Async Pipes

```typescript
it('should display data from observable', () => {
  const mockData = { id: 1, name: 'Test' };
  component.data$ = of(mockData);
  
  fixture.detectChanges();
  
  const element = fixture.nativeElement.querySelector('.data-display');
  expect(element.textContent).toContain('Test');
});
```

### Testing with fakeAsync

```typescript
it('should debounce search', fakeAsync(() => {
  const searchSpy = spyOn(service, 'search');
  
  component.searchTerm.set('a');
  tick(100);
  expect(searchSpy).not.toHaveBeenCalled();
  
  component.searchTerm.set('ab');
  tick(100);
  expect(searchSpy).not.toHaveBeenCalled();
  
  component.searchTerm.set('abc');
  tick(300); // Debounce time
  expect(searchSpy).toHaveBeenCalledWith('abc');
}));
```

### Testing OnPush Components

```typescript
it('should update OnPush component', () => {
  // Component with ChangeDetectionStrategy.OnPush
  component.data.set({ id: 1, name: 'New Data' });
  
  // Must call detectChanges for OnPush
  fixture.detectChanges();
  
  const element = fixture.nativeElement.querySelector('.data');
  expect(element.textContent).toContain('New Data');
});
```

### Testing Input/Output Functions

```typescript
describe('Component with input/output functions', () => {
  it('should receive input', () => {
    // New input() function syntax
    fixture.componentRef.setInput('userId', 123);
    expect(component.userId()).toBe(123);
  });

  it('should emit output', () => {
    let emittedValue: any;
    component.userSelected.subscribe((value: any) => {
      emittedValue = value;
    });
    
    component.selectUser({ id: 1, name: 'John' });
    
    expect(emittedValue).toEqual({ id: 1, name: 'John' });
  });
});
```

---

## Summary

### Quick Decision Guide

**Choose Unit Tests when:**
- Testing business logic
- Testing utility functions
- Testing individual components in isolation
- You need fast feedback
- You want easy debugging

**Choose Integration Tests when:**
- Testing component + service interaction
- Testing parent-child communication
- Testing routing flows
- Testing form validation with services
- You need moderate confidence

**Choose E2E Tests when:**
- Testing critical user workflows
- Testing complete user journeys
- Testing cross-browser compatibility
- Testing before production deployment
- You need highest confidence

### Key Takeaways

1. **Follow the testing pyramid** - Most unit tests, some integration, few E2E
2. **Start with unit tests** - They're fastest and easiest to write
3. **Add integration tests** for critical flows
4. **Reserve E2E tests** for critical user paths only
5. **Test behavior, not implementation** - Focus on what, not how
6. **Keep tests maintainable** - Use page objects, clear naming, DRY principle
7. **Run tests in CI/CD** - Automate everything
8. **Aim for meaningful coverage** - Not just high percentages

### Resources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Jest Documentation](https://jestjs.io/)

---

*Last Updated: October 21, 2025*


