# Comprehensive Angular Antipatterns Guide

A complete guide to common Angular antipatterns, their problems, and better alternatives.

## Table of Contents

1. [Component Architecture Antipatterns](#component-architecture-antipatterns)
2. [State Management Antipatterns](#state-management-antipatterns)
3. [Performance Antipatterns](#performance-antipatterns)
4. [RxJS and Observable Antipatterns](#rxjs-and-observable-antipatterns)
5. [Dependency Injection Antipatterns](#dependency-injection-antipatterns)
6. [Template and Data Binding Antipatterns](#template-and-data-binding-antipatterns)
7. [Service and HTTP Antipatterns](#service-and-http-antipatterns)
8. [Testing Antipatterns](#testing-antipatterns)
9. [Security Antipatterns](#security-antipatterns)
10. [Build and Deployment Antipatterns](#build-and-deployment-antipatterns)
11. [Modern Angular Migration Antipatterns](#modern-angular-migration-antipatterns)

---

## Component Architecture Antipatterns

### 1. God Components (Monolithic Components)

**❌ Antipattern:**
Creating components that handle too many responsibilities, contain hundreds of lines of code, and manage multiple unrelated concerns.

```typescript
// BAD: God component handling everything
@Component({
  selector: 'app-dashboard',
  template: `
    <!-- Hundreds of lines of template -->
    <!-- User management -->
    <!-- Analytics -->
    <!-- Settings -->
    <!-- Notifications -->
    <!-- Reports -->
  `
})
export class DashboardComponent {
  // 50+ properties
  // 20+ methods handling different concerns
  // Direct HTTP calls
  // Complex business logic
  // DOM manipulation
}
```

**✅ Better Approach:**
```typescript
// GOOD: Focused components with single responsibility
@Component({
  selector: 'app-dashboard',
  template: `
    <app-user-summary></app-user-summary>
    <app-analytics-widget></app-analytics-widget>
    <app-settings-panel></app-settings-panel>
    <app-notifications></app-notifications>
  `
})
export class DashboardComponent {}
```

**Resources:**
- [Angular Style Guide - Single Responsibility](https://angular.io/guide/styleguide#single-responsibility)
- [Component Best Practices](https://angular.io/guide/component-overview)

### 2. Tight Coupling Between Components

**❌ Antipattern:**
Components directly accessing and manipulating other components or their internal state.

```typescript
// BAD: Tight coupling
@Component({
  template: `<app-child #child></app-child>`
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('child') child!: ChildComponent;
  
  ngAfterViewInit() {
    // Directly manipulating child component
    this.child.someInternalProperty = 'modified';
    this.child.someInternalMethod();
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Loose coupling with inputs/outputs
@Component({
  template: `
    <app-child 
      [data]="childData" 
      (dataChange)="onChildDataChange($event)">
    </app-child>
  `
})
export class ParentComponent {
  childData = signal('initial');
  
  onChildDataChange(newData: string) {
    this.childData.set(newData);
  }
}
```

**Resources:**
- [Component Interaction](https://angular.io/guide/component-interaction)
- [Angular Signals](https://angular.io/guide/signals)

### 3. Mixing Presentation and Business Logic

**❌ Antipattern:**
Embedding complex business logic directly in components instead of separating concerns.

```typescript
// BAD: Business logic in component
@Component({...})
export class OrderComponent {
  processOrder(order: Order) {
    // Complex validation logic
    if (order.items.length === 0) return;
    
    // Tax calculation
    const tax = order.subtotal * 0.08;
    
    // Discount calculation
    let discount = 0;
    if (order.customer.isPremium) {
      discount = order.subtotal * 0.1;
    }
    
    // Payment processing
    this.http.post('/api/payments', {
      amount: order.subtotal + tax - discount,
      // ... more logic
    }).subscribe();
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Business logic in services
@Component({...})
export class OrderComponent {
  constructor(
    private orderService = inject(OrderService),
    private paymentService = inject(PaymentService)
  ) {}
  
  processOrder(order: Order) {
    const processedOrder = this.orderService.calculateOrder(order);
    this.paymentService.processPayment(processedOrder);
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  calculateOrder(order: Order): ProcessedOrder {
    // Business logic here
  }
}
```

**Resources:**
- [Angular Architecture Overview](https://angular.io/guide/architecture)
- [Service Workers](https://angular.io/guide/service-worker-intro)

---

## State Management Antipatterns

### 4. Shared Mutable State

**❌ Antipattern:**
Sharing mutable objects between components leading to unpredictable state changes.

```typescript
// BAD: Shared mutable state
@Injectable({ providedIn: 'root' })
export class StateService {
  public user = { name: 'John', preferences: { theme: 'dark' } };
  public settings = { notifications: true, language: 'en' };
}

@Component({...})
export class ComponentA {
  constructor(private state = inject(StateService)) {}
  
  updateUser() {
    // Direct mutation - dangerous!
    this.state.user.name = 'Jane';
    this.state.user.preferences.theme = 'light';
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Immutable state with signals
@Injectable({ providedIn: 'root' })
export class StateService {
  private _user = signal({ name: 'John', preferences: { theme: 'dark' } });
  private _settings = signal({ notifications: true, language: 'en' });
  
  user = this._user.asReadonly();
  settings = this._settings.asReadonly();
  
  updateUser(updates: Partial<User>) {
    this._user.update(current => ({ ...current, ...updates }));
  }
  
  updateUserPreferences(prefs: Partial<UserPreferences>) {
    this._user.update(current => ({
      ...current,
      preferences: { ...current.preferences, ...prefs }
    }));
  }
}
```

**Resources:**
- [Angular Signals](https://angular.io/guide/signals)
- [State Management Anti-patterns](https://www.sourceallies.com/2020/11/state-management-anti-patterns/)

### 5. Stateful Streams

**❌ Antipattern:**
Storing state outside of observable streams, leading to race conditions and unpredictable behavior.

```typescript
// BAD: State outside streams
@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser: User | null = null;
  
  getCurrentUser(): Observable<User | null> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    
    return this.http.get<User>('/api/user').pipe(
      tap(user => this.currentUser = user) // Race condition risk
    );
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: State in streams
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  
  loadUser(): void {
    this.http.get<User>('/api/user').pipe(
      takeUntilDestroyed()
    ).subscribe(user => this.userSubject.next(user));
  }
  
  updateUser(updates: Partial<User>): void {
    const current = this.userSubject.value;
    if (current) {
      this.userSubject.next({ ...current, ...updates });
    }
  }
}
```

**Resources:**
- [RxJS Best Practices](https://blog.angular-university.io/rxjs-error-handling/)
- [Observable Data Services](https://angular.io/guide/observables-in-angular)

---

## Performance Antipatterns

### 6. Not Using OnPush Change Detection

**❌ Antipattern:**
Using default change detection strategy for all components, causing unnecessary re-renders.

```typescript
// BAD: Default change detection
@Component({
  selector: 'app-expensive-component',
  // No changeDetection specified = Default strategy
  template: `
    <div>{{ expensiveCalculation() }}</div>
    <div *ngFor="let item of items">{{ item.name }}</div>
  `
})
export class ExpensiveComponent {
  @Input() items: Item[] = [];
  
  expensiveCalculation() {
    // This runs on every change detection cycle!
    return this.items.reduce((sum, item) => sum + item.value, 0);
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: OnPush with computed values
@Component({
  selector: 'app-expensive-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>{{ totalValue() }}</div>
    <div *ngFor="let item of items(); trackBy: trackByFn">
      {{ item.name }}
    </div>
  `
})
export class ExpensiveComponent {
  items = input<Item[]>([]);
  totalValue = computed(() => 
    this.items().reduce((sum, item) => sum + item.value, 0)
  );
  
  trackByFn = (index: number, item: Item) => item.id;
}
```

**Resources:**
- [OnPush Change Detection](https://angular.io/api/core/ChangeDetectionStrategy)
- [Angular Performance Best Practices](https://angular.io/guide/performance-guide)

### 7. Missing TrackBy Functions

**❌ Antipattern:**
Not using trackBy functions with `*ngFor`, causing unnecessary DOM manipulations.

```typescript
// BAD: No trackBy function
@Component({
  template: `
    <div *ngFor="let item of items">
      <expensive-component [data]="item"></expensive-component>
    </div>
  `
})
export class ListComponent {
  items = signal<Item[]>([]);
  
  updateItems() {
    // Even if items are the same, DOM will be recreated
    this.items.set([...this.items(), newItem]);
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: With trackBy function
@Component({
  template: `
    <div *ngFor="let item of items(); trackBy: trackByFn">
      <expensive-component [data]="item"></expensive-component>
    </div>
  `
})
export class ListComponent {
  items = signal<Item[]>([]);
  
  trackByFn = (index: number, item: Item) => item.id;
  
  updateItems() {
    this.items.set([...this.items(), newItem]);
  }
}
```

**Resources:**
- [NgFor TrackBy](https://angular.io/api/common/NgForOf#trackByFn)
- [List Performance](https://angular.io/guide/performance-guide#trackby)

### 8. Overusing ngOnChanges

**❌ Antipattern:**
Using `ngOnChanges` excessively for input property changes instead of more efficient alternatives.

```typescript
// BAD: Overusing ngOnChanges
@Component({...})
export class UserProfileComponent implements OnChanges {
  @Input() user!: User;
  @Input() settings!: Settings;
  @Input() preferences!: Preferences;
  
  displayName = '';
  theme = '';
  notifications = false;
  
  ngOnChanges(changes: SimpleChanges) {
    // Complex logic runs for any input change
    if (changes['user']) {
      this.displayName = this.user.firstName + ' ' + this.user.lastName;
    }
    
    if (changes['settings']) {
      this.theme = this.settings.theme;
    }
    
    if (changes['preferences']) {
      this.notifications = this.preferences.notifications;
    }
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Using computed signals
@Component({...})
export class UserProfileComponent {
  user = input.required<User>();
  settings = input.required<Settings>();
  preferences = input.required<Preferences>();
  
  displayName = computed(() => 
    `${this.user().firstName} ${this.user().lastName}`
  );
  
  theme = computed(() => this.settings().theme);
  notifications = computed(() => this.preferences().notifications);
}
```

**Resources:**
- [Angular Signals](https://angular.io/guide/signals)
- [Component Lifecycle](https://angular.io/guide/lifecycle-hooks)

---

## RxJS and Observable Antipatterns

### 9. Memory Leaks from Unsubscribed Observables

**❌ Antipattern:**
Not properly unsubscribing from observables, causing memory leaks.

```typescript
// BAD: Memory leaks
@Component({...})
export class LeakyComponent implements OnInit {
  ngOnInit() {
    // These subscriptions will never be cleaned up!
    this.dataService.getData().subscribe(data => {
      this.processData(data);
    });
    
    interval(1000).subscribe(tick => {
      this.updateCounter(tick);
    });
    
    this.userService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Proper subscription management
@Component({...})
export class CleanComponent implements OnInit {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    // Using takeUntil pattern
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.processData(data);
    });
    
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(tick => {
      this.updateCounter(tick);
    });
    
    this.userService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// EVEN BETTER: Using takeUntilDestroyed (Angular 16+)
@Component({...})
export class ModernCleanComponent implements OnInit {
  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntilDestroyed()
    ).subscribe(data => {
      this.processData(data);
    });
  }
}
```

**Resources:**
- [RxJS Memory Leaks](https://blog.angular-university.io/rxjs-error-handling/)
- [takeUntilDestroyed](https://angular.io/api/core/rxjs-interop/takeUntilDestroyed)

### 10. Nested Subscriptions (Callback Hell)

**❌ Antipattern:**
Nesting subscriptions inside other subscriptions, creating callback hell and race conditions.

```typescript
// BAD: Nested subscriptions
@Component({...})
export class NestedSubscriptionsComponent {
  loadUserData(userId: string) {
    this.userService.getUser(userId).subscribe(user => {
      this.user = user;
      
      // Nested subscription - BAD!
      this.settingsService.getSettings(user.id).subscribe(settings => {
        this.settings = settings;
        
        // Even more nesting - WORSE!
        this.preferencesService.getPreferences(user.id).subscribe(prefs => {
          this.preferences = prefs;
          this.initializeComponent();
        });
      });
    });
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Using RxJS operators
@Component({...})
export class FlattenedSubscriptionsComponent {
  loadUserData(userId: string) {
    this.userService.getUser(userId).pipe(
      switchMap(user => {
        this.user = user;
        return forkJoin({
          settings: this.settingsService.getSettings(user.id),
          preferences: this.preferencesService.getPreferences(user.id)
        });
      }),
      takeUntilDestroyed()
    ).subscribe(({ settings, preferences }) => {
      this.settings = settings;
      this.preferences = preferences;
      this.initializeComponent();
    });
  }
}

// EVEN BETTER: Using signals and effects
@Component({...})
export class SignalBasedComponent {
  userId = input.required<string>();
  
  user = toSignal(
    toObservable(this.userId).pipe(
      switchMap(id => this.userService.getUser(id))
    )
  );
  
  settings = toSignal(
    toObservable(this.user).pipe(
      filter(user => !!user),
      switchMap(user => this.settingsService.getSettings(user!.id))
    )
  );
}
```

**Resources:**
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Angular Signals with RxJS](https://angular.io/guide/signals#rxjs-interoperability)

### 11. Overusing Subject Instead of Purpose-Built Operators

**❌ Antipattern:**
Using Subject for everything instead of appropriate RxJS operators.

```typescript
// BAD: Overusing Subject
@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new Subject<string>();
  private resultsSubject = new Subject<SearchResult[]>();
  
  search$ = this.searchSubject.asObservable();
  results$ = this.resultsSubject.asObservable();
  
  search(term: string) {
    this.searchSubject.next(term);
    
    // Manual debouncing and switching - reinventing the wheel!
    setTimeout(() => {
      this.http.get<SearchResult[]>(`/api/search?q=${term}`)
        .subscribe(results => {
          this.resultsSubject.next(results);
        });
    }, 300);
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Using appropriate operators
@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new Subject<string>();
  
  results$ = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => 
      term ? this.http.get<SearchResult[]>(`/api/search?q=${term}`) : of([])
    ),
    shareReplay(1)
  );
  
  search(term: string) {
    this.searchSubject.next(term);
  }
}
```

**Resources:**
- [RxJS Best Practices](https://blog.angular-university.io/rxjs-error-handling/)
- [Common RxJS Patterns](https://rxjs.dev/guide/operators)

---

## Dependency Injection Antipatterns

### 12. Overusing Singleton Services

**❌ Antipattern:**
Making every service a singleton when component-level or feature-level services would be more appropriate.

```typescript
// BAD: Everything is a singleton
@Injectable({ providedIn: 'root' }) // Global singleton
export class ModalService {
  private modals: Modal[] = [];
  
  openModal(config: ModalConfig) {
    // This affects ALL components globally
    this.modals.push(new Modal(config));
  }
}

@Injectable({ providedIn: 'root' }) // Another global singleton
export class FormValidationService {
  private currentForm: FormGroup | null = null;
  
  setCurrentForm(form: FormGroup) {
    // Global state - problematic with multiple forms
    this.currentForm = form;
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Appropriate service scoping
@Injectable() // Component-level service
export class ModalService {
  private modals = signal<Modal[]>([]);
  
  openModal(config: ModalConfig) {
    // Scoped to component tree
    this.modals.update(modals => [...modals, new Modal(config)]);
  }
}

@Component({
  providers: [ModalService] // Scoped to this component
})
export class FeatureComponent {
  constructor(private modalService = inject(ModalService)) {}
}

// For truly global services
@Injectable({ providedIn: 'root' })
export class AuthService {
  // This should be global
}
```

**Resources:**
- [Dependency Injection in Angular](https://angular.io/guide/dependency-injection)
- [Hierarchical Injectors](https://angular.io/guide/hierarchical-dependency-injection)

### 13. Constructor Injection Overload

**❌ Antipattern:**
Injecting too many dependencies in the constructor, violating single responsibility principle.

```typescript
// BAD: Too many dependencies
@Component({...})
export class OverloadedComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private validator: ValidatorService,
    private logger: LoggerService,
    private analytics: AnalyticsService,
    private notification: NotificationService,
    private auth: AuthService,
    private cache: CacheService,
    private config: ConfigService,
    private theme: ThemeService
  ) {}
}
```

**✅ Better Approach:**
```typescript
// GOOD: Focused dependencies with inject()
@Component({...})
export class FocusedComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  
  // Or create a facade service
  private componentFacade = inject(ComponentFacadeService);
}

// Better: Create facade services for related functionality
@Injectable()
export class UserManagementFacade {
  private http = inject(HttpClient);
  private validator = inject(ValidatorService);
  private notification = inject(NotificationService);
  
  // Combine related operations
  async updateUser(user: User): Promise<void> {
    const isValid = this.validator.validate(user);
    if (!isValid) return;
    
    await this.http.put('/api/users', user).toPromise();
    this.notification.success('User updated');
  }
}
```

**Resources:**
- [Angular inject() Function](https://angular.io/api/core/inject)
- [Service Composition](https://angular.io/guide/architecture-services)

---

## Template and Data Binding Antipatterns

### 14. Complex Template Logic

**❌ Antipattern:**
Embedding complex logic directly in templates instead of using component properties or methods.

```typescript
// BAD: Complex template logic
@Component({
  template: `
    <div *ngIf="user && user.role === 'admin' && user.permissions.includes('write') && !user.suspended">
      <button 
        [disabled]="!form.valid || isSubmitting || (user.lastLogin && (Date.now() - user.lastLogin.getTime()) > 86400000)"
        (click)="submitForm()">
        {{ isSubmitting ? 'Saving...' : (form.dirty ? 'Save Changes' : 'Save') }}
      </button>
    </div>
    
    <div class="{{ user.isPremium ? 'premium-badge gold' : user.isVerified ? 'verified-badge blue' : 'standard-badge gray' }}">
      {{ user.firstName + ' ' + user.lastName + (user.title ? ' (' + user.title + ')' : '') }}
    </div>
  `
})
export class ComplexTemplateComponent {
  // Template logic is hard to test and maintain
}
```

**✅ Better Approach:**
```typescript
// GOOD: Logic in component with computed properties
@Component({
  template: `
    <div *ngIf="canEditUser()">
      <button 
        [disabled]="isButtonDisabled()"
        [class]="buttonClass()"
        (click)="submitForm()">
        {{ buttonText() }}
      </button>
    </div>
    
    <div [class]="userBadgeClass()">
      {{ userDisplayName() }}
    </div>
  `
})
export class CleanTemplateComponent {
  user = input.required<User>();
  form = input.required<FormGroup>();
  isSubmitting = signal(false);
  
  canEditUser = computed(() => {
    const user = this.user();
    return user && 
           user.role === 'admin' && 
           user.permissions.includes('write') && 
           !user.suspended;
  });
  
  isButtonDisabled = computed(() => {
    const form = this.form();
    const user = this.user();
    const lastLoginExpired = user.lastLogin && 
      (Date.now() - user.lastLogin.getTime()) > 86400000;
    
    return !form.valid || this.isSubmitting() || lastLoginExpired;
  });
  
  buttonText = computed(() => {
    if (this.isSubmitting()) return 'Saving...';
    return this.form().dirty ? 'Save Changes' : 'Save';
  });
  
  userDisplayName = computed(() => {
    const user = this.user();
    const fullName = `${user.firstName} ${user.lastName}`;
    return user.title ? `${fullName} (${user.title})` : fullName;
  });
  
  userBadgeClass = computed(() => {
    const user = this.user();
    if (user.isPremium) return 'premium-badge gold';
    if (user.isVerified) return 'verified-badge blue';
    return 'standard-badge gray';
  });
}
```

**Resources:**
- [Angular Template Syntax](https://angular.io/guide/template-syntax)
- [Computed Signals](https://angular.io/guide/signals#computed-signals)

### 15. Overusing Two-Way Data Binding

**❌ Antipattern:**
Using two-way data binding (`[(ngModel)]`) excessively, causing performance issues and making data flow hard to track.

```typescript
// BAD: Excessive two-way binding
@Component({
  template: `
    <form>
      <input [(ngModel)]="user.firstName" name="firstName">
      <input [(ngModel)]="user.lastName" name="lastName">
      <input [(ngModel)]="user.email" name="email">
      <input [(ngModel)]="user.phone" name="phone">
      <select [(ngModel)]="user.country" name="country">
        <option *ngFor="let country of countries" [value]="country.code">
          {{ country.name }}
        </option>
      </select>
      <textarea [(ngModel)]="user.bio" name="bio"></textarea>
    </form>
  `
})
export class TwoWayBindingComponent {
  user: User = {}; // Direct mutation of user object
  countries: Country[] = [];
}
```

**✅ Better Approach:**
```typescript
// GOOD: Reactive forms with controlled updates
@Component({
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName">
      <input formControlName="lastName">
      <input formControlName="email">
      <input formControlName="phone">
      <select formControlName="country">
        <option *ngFor="let country of countries()" [value]="country.code">
          {{ country.name }}
        </option>
      </select>
      <textarea formControlName="bio"></textarea>
    </form>
  `
})
export class ReactiveFormComponent {
  private fb = inject(FormBuilder);
  
  countries = signal<Country[]>([]);
  
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    country: [''],
    bio: ['']
  });
  
  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      // Handle form submission with immutable data
    }
  }
}
```

**Resources:**
- [Reactive Forms](https://angular.io/guide/reactive-forms)
- [Form Validation](https://angular.io/guide/form-validation)

### 16. Direct DOM Manipulation

**❌ Antipattern:**
Manipulating the DOM directly instead of using Angular's declarative approach.

```typescript
// BAD: Direct DOM manipulation
@Component({
  template: `<div #container></div>`
})
export class DirectDOMComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  
  ngAfterViewInit() {
    // Direct DOM manipulation - BAD!
    this.container.nativeElement.innerHTML = '<p>Dynamic content</p>';
    this.container.nativeElement.style.backgroundColor = 'red';
    this.container.nativeElement.addEventListener('click', () => {
      alert('Clicked!');
    });
    
    // jQuery-style manipulation
    const element = document.getElementById('someId');
    if (element) {
      element.classList.add('active');
    }
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Angular declarative approach
@Component({
  template: `
    <div 
      [style.backgroundColor]="backgroundColor()"
      [class.active]="isActive()"
      (click)="handleClick()">
      <p>{{ dynamicContent() }}</p>
    </div>
  `
})
export class DeclarativeComponent {
  dynamicContent = signal('Dynamic content');
  backgroundColor = signal('red');
  isActive = signal(false);
  
  handleClick() {
    this.isActive.update(active => !active);
  }
}

// For complex DOM operations, use Renderer2
@Component({...})
export class SafeDOMComponent {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  
  updateElement() {
    // Safe DOM manipulation when necessary
    this.renderer.addClass(this.elementRef.nativeElement, 'updated');
  }
}
```

**Resources:**
- [Angular Renderer2](https://angular.io/api/core/Renderer2)
- [Template Reference Variables](https://angular.io/guide/template-reference-variables)

---

## Service and HTTP Antipatterns

### 17. Not Handling HTTP Errors Properly

**❌ Antipattern:**
Not implementing proper error handling for HTTP requests.

```typescript
// BAD: No error handling
@Injectable({ providedIn: 'root' })
export class BadHttpService {
  private http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    // No error handling - errors will bubble up unhandled
    return this.http.get<User[]>('/api/users');
  }
  
  createUser(user: User): Observable<User> {
    // No error handling or loading states
    return this.http.post<User>('/api/users', user);
  }
}

@Component({...})
export class BadHttpComponent {
  users: User[] = [];
  
  loadUsers() {
    this.badHttpService.getUsers().subscribe(users => {
      this.users = users;
      // What happens if this fails? User never knows!
    });
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Proper error handling
@Injectable({ providedIn: 'root' })
export class GoodHttpService {
  private http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      retry(2),
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user).pipe(
      catchError(this.handleError<User>('createUser'))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}

@Component({...})
export class GoodHttpComponent {
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    
    this.goodHttpService.getUsers().pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed()
    ).subscribe({
      next: users => this.users.set(users),
      error: error => this.error.set('Failed to load users')
    });
  }
}
```

**Resources:**
- [HTTP Error Handling](https://angular.io/guide/http#error-handling)
- [RxJS Error Handling](https://blog.angular-university.io/rxjs-error-handling/)

### 18. Creating Fat Services

**❌ Antipattern:**
Creating services that handle too many responsibilities, violating the Single Responsibility Principle.

```typescript
// BAD: Fat service doing everything
@Injectable({ providedIn: 'root' })
export class FatUserService {
  private http = inject(HttpClient);
  
  // User CRUD
  getUsers(): Observable<User[]> { /* ... */ }
  createUser(user: User): Observable<User> { /* ... */ }
  updateUser(user: User): Observable<User> { /* ... */ }
  deleteUser(id: string): Observable<void> { /* ... */ }
  
  // Authentication
  login(credentials: LoginCredentials): Observable<AuthResponse> { /* ... */ }
  logout(): void { /* ... */ }
  isAuthenticated(): boolean { /* ... */ }
  
  // Profile management
  updateProfile(profile: UserProfile): Observable<UserProfile> { /* ... */ }
  uploadAvatar(file: File): Observable<string> { /* ... */ }
  
  // Settings
  getUserSettings(): Observable<UserSettings> { /* ... */ }
  updateSettings(settings: UserSettings): Observable<void> { /* ... */ }
  
  // Notifications
  getNotifications(): Observable<Notification[]> { /* ... */ }
  markAsRead(id: string): Observable<void> { /* ... */ }
  
  // Analytics
  trackUserAction(action: string): void { /* ... */ }
  getUserAnalytics(): Observable<Analytics> { /* ... */ }
  
  // File management
  uploadFile(file: File): Observable<string> { /* ... */ }
  deleteFile(url: string): Observable<void> { /* ... */ }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Focused services with single responsibilities
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
  
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`/api/users/${user.id}`, user);
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials);
  }
  
  logout(): void {
    // Handle logout logic
  }
  
  isAuthenticated(): boolean {
    // Check authentication status
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private http = inject(HttpClient);
  
  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>('/api/profile', profile);
  }
  
  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<string>('/api/profile/avatar', formData);
  }
}

// Use composition when services need to work together
@Injectable({ providedIn: 'root' })
export class UserManagementFacade {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private profileService = inject(UserProfileService);
  
  async createUserWithProfile(user: User, profile: UserProfile): Promise<User> {
    const createdUser = await this.userService.createUser(user).toPromise();
    await this.profileService.updateProfile({
      ...profile,
      userId: createdUser.id
    }).toPromise();
    return createdUser;
  }
}
```

**Resources:**
- [Single Responsibility Principle](https://angular.io/guide/styleguide#single-responsibility)
- [Angular Services](https://angular.io/guide/architecture-services)

---

## Testing Antipatterns

### 19. Not Testing Components in Isolation

**❌ Antipattern:**
Testing components with all their dependencies, making tests slow and brittle.

```typescript
// BAD: Integration test disguised as unit test
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [
        HttpClientModule,
        RouterModule.forRoot([]),
        MatTableModule,
        MatButtonModule,
        // ... many more modules
      ],
      providers: [
        UserService,
        AuthService,
        NotificationService,
        // ... many real services
      ]
    });
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });
  
  it('should load users', fakeAsync(() => {
    // This test depends on real HTTP calls, routing, etc.
    component.ngOnInit();
    tick();
    expect(component.users.length).toBeGreaterThan(0);
  }));
});
```

**✅ Better Approach:**
```typescript
// GOOD: Isolated unit test with mocks
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  
  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });
  
  it('should load users successfully', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' }
    ];
    
    mockUserService.getUsers.and.returnValue(of(mockUsers));
    
    component.ngOnInit();
    
    expect(component.users()).toEqual(mockUsers);
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });
  
  it('should handle error when loading users fails', () => {
    mockUserService.getUsers.and.returnValue(throwError('API Error'));
    
    component.ngOnInit();
    
    expect(component.users()).toEqual([]);
    expect(mockNotificationService.showError).toHaveBeenCalledWith('Failed to load users');
  });
});
```

**Resources:**
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Testing Components](https://angular.io/guide/testing-components)

### 20. Testing Implementation Details Instead of Behavior

**❌ Antipattern:**
Testing internal implementation details rather than user-facing behavior.

```typescript
// BAD: Testing implementation details
describe('SearchComponent', () => {
  it('should call debounceTime with 300ms', () => {
    spyOn(component.searchSubject, 'pipe').and.returnValue(of([]));
    
    component.ngOnInit();
    
    // Testing internal implementation
    expect(component.searchSubject.pipe).toHaveBeenCalledWith(
      debounceTime(300),
      distinctUntilChanged(),
      // ... more implementation details
    );
  });
  
  it('should set loading to true when searching', () => {
    component.search('test');
    
    // Testing internal state instead of user experience
    expect(component.isLoading).toBe(true);
  });
});
```

**✅ Better Approach:**
```typescript
// GOOD: Testing user behavior and outcomes
describe('SearchComponent', () => {
  it('should display search results when user types', fakeAsync(() => {
    const mockResults = [{ id: 1, title: 'Test Result' }];
    mockSearchService.search.and.returnValue(of(mockResults));
    
    // Simulate user behavior
    const searchInput = fixture.debugElement.query(By.css('input[type="search"]'));
    searchInput.nativeElement.value = 'test query';
    searchInput.nativeElement.dispatchEvent(new Event('input'));
    
    tick(300); // Wait for debounce
    fixture.detectChanges();
    
    // Test what user sees
    const resultElements = fixture.debugElement.queryAll(By.css('.search-result'));
    expect(resultElements.length).toBe(1);
    expect(resultElements[0].nativeElement.textContent).toContain('Test Result');
  }));
  
  it('should show loading indicator while searching', fakeAsync(() => {
    mockSearchService.search.and.returnValue(timer(1000).pipe(map(() => [])));
    
    const searchInput = fixture.debugElement.query(By.css('input[type="search"]'));
    searchInput.nativeElement.value = 'test';
    searchInput.nativeElement.dispatchEvent(new Event('input'));
    
    tick(300);
    fixture.detectChanges();
    
    // Test what user sees
    const loadingIndicator = fixture.debugElement.query(By.css('.loading'));
    expect(loadingIndicator).toBeTruthy();
    
    tick(1000);
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('.loading'))).toBeFalsy();
  }));
});
```

**Resources:**
- [Testing Best Practices](https://angular.io/guide/testing)
- [Component Testing](https://angular.io/guide/testing-components)

---

## Security Antipatterns

### 21. Not Sanitizing User Input

**❌ Antipattern:**
Displaying user-generated content without proper sanitization, leading to XSS vulnerabilities.

```typescript
// BAD: Unsanitized user input
@Component({
  template: `
    <div [innerHTML]="userContent"></div>
    <div>{{ userComment }}</div>
    <img [src]="userImageUrl" alt="User image">
  `
})
export class UnsafeComponent {
  userContent = '<script>alert("XSS")</script><p>User content</p>';
  userComment = '<img src="x" onerror="alert(\'XSS\')">';
  userImageUrl = 'javascript:alert("XSS")';
}
```

**✅ Better Approach:**
```typescript
// GOOD: Proper sanitization
@Component({
  template: `
    <div [innerHTML]="sanitizedContent()"></div>
    <div>{{ sanitizedComment() }}</div>
    <img [src]="sanitizedImageUrl()" alt="User image">
  `
})
export class SafeComponent {
  private sanitizer = inject(DomSanitizer);
  
  rawUserContent = signal('<script>alert("XSS")</script><p>User content</p>');
  rawUserComment = signal('<img src="x" onerror="alert(\'XSS\')">');
  rawImageUrl = signal('https://example.com/image.jpg');
  
  sanitizedContent = computed(() => 
    this.sanitizer.sanitize(SecurityContext.HTML, this.rawUserContent()) || ''
  );
  
  sanitizedComment = computed(() => 
    this.sanitizer.sanitize(SecurityContext.HTML, this.rawUserComment()) || ''
  );
  
  sanitizedImageUrl = computed(() => {
    const url = this.rawImageUrl();
    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return url;
      }
    } catch {
      // Invalid URL
    }
    return '/assets/default-image.jpg';
  });
}
```

**Resources:**
- [Angular Security](https://angular.io/guide/security)
- [DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer)

### 22. Exposing Sensitive Data in Client-Side Code

**❌ Antipattern:**
Storing sensitive information like API keys, secrets, or internal URLs in client-side code.

```typescript
// BAD: Sensitive data in client code
@Injectable({ providedIn: 'root' })
export class BadApiService {
  private apiKey = 'sk-1234567890abcdef'; // Exposed to all users!
  private internalApiUrl = 'https://internal-api.company.com'; // Internal URL exposed
  private adminPassword = 'admin123'; // Password in source code!
  
  private http = inject(HttpClient);
  
  getData() {
    return this.http.get(`${this.internalApiUrl}/data`, {
      headers: {
        'X-API-Key': this.apiKey,
        'Authorization': `Bearer ${this.adminPassword}`
      }
    });
  }
}

// BAD: Environment files with secrets committed to git
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  secretKey: 'super-secret-key-123', // This will be in the bundle!
  databaseUrl: 'mongodb://user:password@internal-db:27017/app'
};
```

**✅ Better Approach:**
```typescript
// GOOD: Proper handling of sensitive data
@Injectable({ providedIn: 'root' })
export class SecureApiService {
  private http = inject(HttpClient);
  
  // Use environment variables for non-sensitive config only
  private apiUrl = environment.apiUrl;
  
  getData() {
    // Let the backend handle authentication
    // Include credentials if needed for CORS
    return this.http.get(`${this.apiUrl}/data`, {
      withCredentials: true
    });
  }
  
  // For APIs requiring keys, use a proxy endpoint
  getExternalData() {
    return this.http.get(`${this.apiUrl}/proxy/external-service`);
    // Backend handles the actual API key
  }
}

// GOOD: Environment without secrets
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  appVersion: '1.0.0',
  features: {
    analytics: true,
    debugging: false
  }
};

// GOOD: Use backend for sensitive operations
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  login(credentials: LoginCredentials) {
    // Backend handles password verification
    return this.http.post<AuthResponse>('/api/auth/login', credentials);
  }
  
  // Use secure HTTP-only cookies for tokens
  // No JWT tokens stored in localStorage
}
```

**Resources:**
- [Angular Security Best Practices](https://angular.io/guide/security)
- [Environment Configuration](https://angular.io/guide/build#configuring-application-environments)

---

## Build and Deployment Antipatterns

### 23. Not Optimizing Bundle Size

**❌ Antipattern:**
Importing entire libraries when only small parts are needed, leading to large bundle sizes.

```typescript
// BAD: Importing entire libraries
import * as _ from 'lodash'; // Entire lodash library
import { Observable } from 'rxjs'; // Entire rxjs library
import * as moment from 'moment'; // Entire moment.js library

@Component({...})
export class UnoptimizedComponent {
  processData(data: any[]) {
    // Using only one lodash function but importing everything
    return _.uniq(data);
  }
  
  formatDate(date: Date) {
    // Using entire moment.js for simple formatting
    return moment(date).format('YYYY-MM-DD');
  }
}

// BAD: Not using lazy loading
const routes: Routes = [
  { path: 'feature1', component: Feature1Component },
  { path: 'feature2', component: Feature2Component },
  { path: 'feature3', component: Feature3Component },
  // All components loaded upfront
];
```

**✅ Better Approach:**
```typescript
// GOOD: Tree-shakable imports
import { uniq } from 'lodash-es'; // Only import what you need
import { Observable, map, filter } from 'rxjs'; // Specific operators

@Component({...})
export class OptimizedComponent {
  processData(data: any[]) {
    // Tree-shakable import
    return uniq(data);
  }
  
  formatDate(date: Date) {
    // Use native Intl API instead of moment.js
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }
}

// GOOD: Lazy loading routes
const routes: Routes = [
  {
    path: 'feature1',
    loadComponent: () => import('./feature1/feature1.component').then(m => m.Feature1Component)
  },
  {
    path: 'feature2',
    loadComponent: () => import('./feature2/feature2.component').then(m => m.Feature2Component)
  },
  {
    path: 'feature3',
    loadChildren: () => import('./feature3/feature3.routes').then(m => m.feature3Routes)
  }
];

// GOOD: Bundle analysis and optimization
// package.json
{
  "scripts": {
    "build:analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/app/stats.json"
  }
}
```

**Resources:**
- [Angular Bundle Optimization](https://angular.io/guide/performance-guide)
- [Tree Shaking](https://angular.io/guide/build#tree-shaking)
- [Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)

### 24. Not Implementing Proper Error Boundaries

**❌ Antipattern:**
Not handling runtime errors gracefully, causing the entire application to crash.

```typescript
// BAD: No error handling
@Component({
  template: `
    <div>
      <h1>{{ user.name }}</h1>
      <p>{{ user.profile.bio }}</p>
      <img [src]="user.avatar.url" alt="Avatar">
    </div>
  `
})
export class FragileComponent {
  user: User | null = null;
  
  ngOnInit() {
    this.loadUser();
  }
  
  loadUser() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      // If user.profile or user.avatar is null, template will crash
    });
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Proper error handling and safe navigation
@Component({
  template: `
    <div *ngIf="user(); else loading">
      <h1>{{ user()?.name || 'Unknown User' }}</h1>
      <p>{{ user()?.profile?.bio || 'No bio available' }}</p>
      <img 
        [src]="user()?.avatar?.url || '/assets/default-avatar.jpg'" 
        alt="Avatar"
        (error)="onImageError($event)">
    </div>
    
    <ng-template #loading>
      <div *ngIf="loading(); else errorState">Loading...</div>
    </ng-template>
    
    <ng-template #errorState>
      <div class="error">
        Failed to load user data. 
        <button (click)="retry()">Retry</button>
      </div>
    </ng-template>
  `
})
export class RobustComponent {
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit() {
    this.loadUser();
  }
  
  loadUser() {
    this.loading.set(true);
    this.error.set(null);
    
    this.userService.getUser().pipe(
      catchError(error => {
        this.error.set('Failed to load user');
        return of(null);
      }),
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed()
    ).subscribe(user => {
      this.user.set(user);
    });
  }
  
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-avatar.jpg';
  }
  
  retry() {
    this.loadUser();
  }
}

// GOOD: Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);
  
  handleError(error: Error): void {
    this.logger.error('Global error:', error);
    
    // Show user-friendly message
    this.notificationService.showError(
      'Something went wrong. Please try again.'
    );
    
    // Report to monitoring service
    this.reportError(error);
  }
  
  private reportError(error: Error) {
    // Send to monitoring service like Sentry
  }
}

// Register in main.ts
bootstrapApplication(AppComponent, {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
});
```

**Resources:**
- [Error Handling](https://angular.io/guide/error-handling)
- [Global Error Handler](https://angular.io/api/core/ErrorHandler)

---

## Modern Angular Migration Antipatterns

### 25. Not Migrating to Standalone Components

**❌ Antipattern:**
Continuing to use NgModules for new components when standalone components are available.

```typescript
// BAD: Still using NgModules for new features
@NgModule({
  declarations: [
    NewFeatureComponent,
    NewFeatureChildComponent,
    NewFeaturePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule
  ],
  exports: [NewFeatureComponent]
})
export class NewFeatureModule {}

@Component({
  selector: 'app-new-feature',
  template: '...'
})
export class NewFeatureComponent {}
```

**✅ Better Approach:**
```typescript
// GOOD: Using standalone components
@Component({
  selector: 'app-new-feature',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    NewFeatureChildComponent,
    NewFeaturePipe
  ],
  template: '...'
})
export class NewFeatureComponent {}

@Component({
  selector: 'app-new-feature-child',
  standalone: true,
  imports: [CommonModule],
  template: '...'
})
export class NewFeatureChildComponent {}

@Pipe({
  name: 'newFeature',
  standalone: true
})
export class NewFeaturePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
```

**Resources:**
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Migration Guide](https://angular.io/guide/standalone-migration)

### 26. Not Using Modern Angular Features

**❌ Antipattern:**
Sticking to older patterns when modern Angular provides better alternatives.

```typescript
// BAD: Using old patterns
@Component({
  template: `
    <div *ngIf="isVisible">
      <div *ngFor="let item of items; trackBy: trackByFn">
        {{ item.name }}
      </div>
    </div>
    
    <div [ngSwitch]="status">
      <div *ngSwitchCase="'loading'">Loading...</div>
      <div *ngSwitchCase="'error'">Error occurred</div>
      <div *ngSwitchDefault>Content</div>
    </div>
  `
})
export class OldPatternsComponent implements OnInit, OnDestroy {
  @Input() data!: any[];
  @Output() itemClick = new EventEmitter<any>();
  
  isVisible = false;
  items: any[] = [];
  status = 'loading';
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.items = data;
      this.cdr.markForCheck();
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  trackByFn(index: number, item: any) {
    return item.id;
  }
}
```

**✅ Better Approach:**
```typescript
// GOOD: Using modern Angular features
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div>
        @for (item of items(); track item.id) {
          <div (click)="itemClick.emit(item)">
            {{ item.name }}
          </div>
        }
      </div>
    }
    
    @switch (status()) {
      @case ('loading') {
        <div>Loading...</div>
      }
      @case ('error') {
        <div>Error occurred</div>
      }
      @default {
        <div>Content</div>
      }
    }
  `
})
export class ModernPatternsComponent {
  // Modern input/output functions
  data = input.required<any[]>();
  itemClick = output<any>();
  
  // Signals for reactive state
  isVisible = signal(false);
  items = signal<any[]>([]);
  status = signal<'loading' | 'error' | 'success'>('loading');
  
  private dataService = inject(DataService);
  
  constructor() {
    // Automatic cleanup with takeUntilDestroyed
    this.dataService.getData().pipe(
      takeUntilDestroyed()
    ).subscribe(data => {
      this.items.set(data);
      this.status.set('success');
    });
    
    // React to input changes
    effect(() => {
      const data = this.data();
      if (data.length > 0) {
        this.isVisible.set(true);
      }
    });
  }
}
```

**Resources:**
- [Modern Angular Features](https://angular.io/guide/signals)
- [Control Flow Syntax](https://angular.io/guide/templates/control-flow)
- [Input/Output Functions](https://angular.io/guide/components/inputs)

---

## Additional Resources

### Official Angular Documentation
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Best Practices](https://angular.io/guide/architecture)
- [Performance Guide](https://angular.io/guide/performance-guide)
- [Security Guide](https://angular.io/guide/security)

### Community Resources
- [Angular ESLint Rules](https://github.com/angular-eslint/angular-eslint)
- [RxJS Best Practices](https://blog.angular-university.io/rxjs-error-handling/)
- [Angular Testing Best Practices](https://testing-angular.com/)
- [Bundle Analysis Tools](https://github.com/webpack-contrib/webpack-bundle-analyzer)

### Tools for Avoiding Antipatterns
- [Angular CLI](https://angular.io/cli) - Scaffolding with best practices
- [ESLint Angular Rules](https://github.com/angular-eslint/angular-eslint) - Linting rules
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks for quality checks
- [Angular DevTools](https://angular.io/guide/devtools) - Debugging and profiling

---

## Summary

Angular antipatterns can significantly impact application performance, maintainability, and developer experience. By understanding these common pitfalls and their solutions, you can:

1. **Write more maintainable code** by following single responsibility principles
2. **Improve performance** through proper change detection strategies and bundle optimization
3. **Enhance security** by properly handling user input and sensitive data
4. **Create better user experiences** through proper error handling and loading states
5. **Leverage modern Angular features** for cleaner, more efficient code

Remember: The goal is not to avoid all complexity, but to manage it properly through good architectural decisions and modern Angular patterns.










