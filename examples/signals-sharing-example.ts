/*
==========================================
SHARING SIGNALS BETWEEN COMPONENTS
==========================================

This comprehensive example demonstrates various patterns for sharing 
signals between components in Angular, including:

1. Service-based signal sharing
2. Parent-child signal communication
3. Sibling component communication
4. Global state management with signals
5. Signal composition patterns
6. Best practices and pitfalls

==========================================
*/

import { 
  Component, 
  Injectable, 
  signal, 
  computed, 
  effect,
  input,
  output,
  viewChild,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ==========================================
// 1. SERVICE-BASED SIGNAL SHARING
// ==========================================

/**
 * Shared service that manages signals accessible by multiple components
 * This is the most common and recommended pattern for sharing signals
 */
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  // Private writable signals
  private _counter = signal(0);
  private _user = signal<{ name: string; email: string } | null>(null);
  private _notifications = signal<string[]>([]);
  private _theme = signal<'light' | 'dark'>('light');
  
  // Public readonly signals - prevents external mutation
  readonly counter = this._counter.asReadonly();
  readonly user = this._user.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly theme = this._theme.asReadonly();
  
  // Computed signals based on state
  readonly isUserLoggedIn = computed(() => this.user() !== null);
  readonly notificationCount = computed(() => this.notifications().length);
  readonly counterIsEven = computed(() => this.counter() % 2 === 0);
  
  // Public methods to update state
  incrementCounter(): void {
    this._counter.update(count => count + 1);
  }
  
  decrementCounter(): void {
    this._counter.update(count => count - 1);
  }
  
  setCounter(value: number): void {
    this._counter.set(value);
  }
  
  setUser(user: { name: string; email: string }): void {
    this._user.set(user);
  }
  
  logout(): void {
    this._user.set(null);
  }
  
  addNotification(message: string): void {
    this._notifications.update(notifications => [...notifications, message]);
  }
  
  removeNotification(index: number): void {
    this._notifications.update(notifications => 
      notifications.filter((_, i) => i !== index)
    );
  }
  
  clearNotifications(): void {
    this._notifications.set([]);
  }
  
  toggleTheme(): void {
    this._theme.update(theme => theme === 'light' ? 'dark' : 'light');
  }
}

/**
 * Example of a specialized service for specific domain
 */
@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private _items = signal<Array<{ id: number; name: string; price: number; quantity: number }>>([]);
  
  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly totalPrice = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  readonly isEmpty = computed(() => this.items().length === 0);
  
  addItem(item: { id: number; name: string; price: number }): void {
    this._items.update(items => {
      const existingItem = items.find(i => i.id === item.id);
      if (existingItem) {
        return items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...item, quantity: 1 }];
    });
  }
  
  removeItem(id: number): void {
    this._items.update(items => items.filter(item => item.id !== id));
  }
  
  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    
    this._items.update(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }
  
  clear(): void {
    this._items.set([]);
  }
}

// ==========================================
// 2. COMPONENTS USING SHARED SIGNALS
// ==========================================

/**
 * Component that displays and manages the shared counter
 */
@Component({
  selector: 'app-counter-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-display">
      <h3>Counter Display Component</h3>
      <p>Current Count: <strong>{{sharedState.counter()}}</strong></p>
      <p>Is Even: <span [class.even]="sharedState.counterIsEven()">
        {{sharedState.counterIsEven() ? 'Yes' : 'No'}}
      </span></p>
      
      <div class="controls">
        <button (click)="sharedState.decrementCounter()" [disabled]="sharedState.counter() <= 0">
          -
        </button>
        <button (click)="sharedState.incrementCounter()">
          +
        </button>
        <button (click)="reset()">Reset</button>
      </div>
    </div>
  `,
  styles: [`
    .counter-display {
      border: 2px solid #007bff;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .controls button {
      margin: 0 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }
    .controls button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .even {
      color: green;
      font-weight: bold;
    }
  `]
})
export class CounterDisplayComponent {
  protected sharedState = inject(SharedStateService);
  
  reset(): void {
    this.sharedState.setCounter(0);
  }
}

/**
 * Another component that also uses the shared counter
 */
@Component({
  selector: 'app-counter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="counter-controls">
      <h3>Counter Controls Component</h3>
      <p>Shared Counter Value: {{sharedState.counter()}}</p>
      
      <div class="input-group">
        <label>Set specific value:</label>
        <input type="number" [(ngModel)]="inputValue" />
        <button (click)="setSpecificValue()">Set</button>
      </div>
      
      <div class="quick-actions">
        <button (click)="sharedState.setCounter(10)">Set to 10</button>
        <button (click)="sharedState.setCounter(100)">Set to 100</button>
        <button (click)="addFive()">Add 5</button>
      </div>
    </div>
  `,
  styles: [`
    .counter-controls {
      border: 2px solid #28a745;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .input-group {
      margin: 1rem 0;
    }
    .input-group input {
      margin: 0 0.5rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .quick-actions button {
      margin: 0.25rem;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      background: #28a745;
      color: white;
      cursor: pointer;
    }
  `]
})
export class CounterControlsComponent {
  protected sharedState = inject(SharedStateService);
  inputValue = 0;
  
  setSpecificValue(): void {
    this.sharedState.setCounter(this.inputValue);
  }
  
  addFive(): void {
    for (let i = 0; i < 5; i++) {
      this.sharedState.incrementCounter();
    }
  }
}

/**
 * User management component
 */
@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-manager">
      <h3>User Manager Component</h3>
      
      <div *ngIf="!sharedState.isUserLoggedIn(); else loggedIn">
        <p>No user logged in</p>
        <div class="login-form">
          <input [(ngModel)]="userName" placeholder="Name" />
          <input [(ngModel)]="userEmail" placeholder="Email" />
          <button (click)="login()">Login</button>
        </div>
      </div>
      
      <ng-template #loggedIn>
        <div class="user-info">
          <p>Welcome, <strong>{{sharedState.user()?.name}}</strong>!</p>
          <p>Email: {{sharedState.user()?.email}}</p>
          <button (click)="sharedState.logout()">Logout</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .user-manager {
      border: 2px solid #dc3545;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .login-form input {
      margin: 0.25rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .login-form button, .user-info button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #dc3545;
      color: white;
      cursor: pointer;
    }
  `]
})
export class UserManagerComponent {
  protected sharedState = inject(SharedStateService);
  userName = '';
  userEmail = '';
  
  login(): void {
    if (this.userName && this.userEmail) {
      this.sharedState.setUser({
        name: this.userName,
        email: this.userEmail
      });
      this.userName = '';
      this.userEmail = '';
    }
  }
}

/**
 * Notification component that shows shared notifications
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notifications">
      <h3>Notifications ({{sharedState.notificationCount()}})</h3>
      
      <div class="add-notification">
        <input [(ngModel)]="newNotification" placeholder="Add notification..." />
        <button (click)="addNotification()">Add</button>
      </div>
      
      <div class="notification-list">
        <div *ngFor="let notification of sharedState.notifications(); let i = index" 
             class="notification-item">
          <span>{{notification}}</span>
          <button (click)="removeNotification(i)">×</button>
        </div>
      </div>
      
      <button *ngIf="sharedState.notificationCount() > 0" 
              (click)="sharedState.clearNotifications()" 
              class="clear-all">
        Clear All
      </button>
    </div>
  `,
  styles: [`
    .notifications {
      border: 2px solid #ffc107;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .add-notification input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    .add-notification {
      display: flex;
      margin-bottom: 1rem;
    }
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      margin: 0.25rem 0;
      background: #fff3cd;
      border-radius: 4px;
    }
    .notification-item button {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .clear-all {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class NotificationsComponent {
  protected sharedState = inject(SharedStateService);
  newNotification = '';
  
  addNotification(): void {
    if (this.newNotification.trim()) {
      this.sharedState.addNotification(this.newNotification.trim());
      this.newNotification = '';
    }
  }
  
  removeNotification(index: number): void {
    this.sharedState.removeNotification(index);
  }
}

// ==========================================
// 3. PARENT-CHILD SIGNAL COMMUNICATION
// ==========================================

/**
 * Parent component that manages signals and passes them to children
 */
@Component({
  selector: 'app-parent-child-demo',
  standalone: true,
  imports: [CommonModule, ChildComponentA, ChildComponentB],
  template: `
    <div class="parent-child-demo">
      <h3>Parent-Child Signal Communication</h3>
      <p>Parent Message: {{parentMessage()}}</p>
      <p>Shared Counter: {{sharedCounter()}}</p>
      
      <div class="parent-controls">
        <button (click)="updateMessage()">Update Message</button>
        <button (click)="incrementSharedCounter()">Increment Shared</button>
      </div>
      
      <div class="children">
        <app-child-a 
          [message]="parentMessage()" 
          [counter]="sharedCounter()"
          (messageChange)="onChildMessageChange($event)"
          (counterIncrement)="incrementSharedCounter()" />
          
        <app-child-b 
          [message]="parentMessage()" 
          [counter]="sharedCounter()"
          (counterDecrement)="decrementSharedCounter()" />
      </div>
    </div>
  `,
  styles: [`
    .parent-child-demo {
      border: 2px solid #6f42c1;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .children {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .parent-controls button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #6f42c1;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ParentChildDemoComponent {
  // Parent's own signals
  parentMessage = signal('Hello from Parent');
  sharedCounter = signal(0);
  
  updateMessage(): void {
    this.parentMessage.set(`Updated at ${new Date().toLocaleTimeString()}`);
  }
  
  incrementSharedCounter(): void {
    this.sharedCounter.update(count => count + 1);
  }
  
  decrementSharedCounter(): void {
    this.sharedCounter.update(count => Math.max(0, count - 1));
  }
  
  onChildMessageChange(newMessage: string): void {
    this.parentMessage.set(newMessage);
  }
}

/**
 * Child component A
 */
@Component({
  selector: 'app-child-a',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="child-a">
      <h4>Child A</h4>
      <p>Received Message: {{message}}</p>
      <p>Received Counter: {{counter}}</p>
      
      <div class="child-controls">
        <input [(ngModel)]="newMessage" placeholder="New message..." />
        <button (click)="sendMessageToParent()">Send to Parent</button>
        <button (click)="incrementCounter()">Increment Counter</button>
      </div>
    </div>
  `,
  styles: [`
    .child-a {
      border: 2px solid #17a2b8;
      padding: 1rem;
      border-radius: 8px;
      flex: 1;
    }
    .child-controls input {
      width: 100%;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .child-controls button {
      margin: 0.25rem;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      background: #17a2b8;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ChildComponentA {
  // Input signals (Angular 17+)
  message = input.required<string>();
  counter = input.required<number>();
  
  // Output events
  messageChange = output<string>();
  counterIncrement = output<void>();
  
  newMessage = '';
  
  sendMessageToParent(): void {
    if (this.newMessage.trim()) {
      this.messageChange.emit(this.newMessage.trim());
      this.newMessage = '';
    }
  }
  
  incrementCounter(): void {
    this.counterIncrement.emit();
  }
}

/**
 * Child component B
 */
@Component({
  selector: 'app-child-b',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="child-b">
      <h4>Child B</h4>
      <p>Message Length: {{messageLength()}}</p>
      <p>Counter × 2: {{doubledCounter()}}</p>
      <p>Is Counter Even: {{isCounterEven()}}</p>
      
      <button (click)="decrementCounter()">Decrement Counter</button>
    </div>
  `,
  styles: [`
    .child-b {
      border: 2px solid #fd7e14;
      padding: 1rem;
      border-radius: 8px;
      flex: 1;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #fd7e14;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ChildComponentB {
  message = input.required<string>();
  counter = input.required<number>();
  
  counterDecrement = output<void>();
  
  // Computed values based on inputs
  messageLength = computed(() => this.message().length);
  doubledCounter = computed(() => this.counter() * 2);
  isCounterEven = computed(() => this.counter() % 2 === 0);
  
  decrementCounter(): void {
    this.counterDecrement.emit();
  }
}

// ==========================================
// 4. SHOPPING CART DEMO COMPONENTS
// ==========================================

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-list">
      <h3>Products</h3>
      <div class="products">
        <div *ngFor="let product of products" class="product-card">
          <h4>{{product.name}}</h4>
          <p class="price">\${{product.price}}</p>
          <button (click)="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-list {
      border: 2px solid #20c997;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .products {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .product-card {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }
    .price {
      font-size: 1.2em;
      font-weight: bold;
      color: #28a745;
    }
    button {
      background: #20c997;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ProductListComponent {
  private cart = inject(ShoppingCartService);
  
  products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 },
    { id: 4, name: 'Monitor', price: 299 }
  ];
  
  addToCart(product: { id: number; name: string; price: number }): void {
    this.cart.addItem(product);
  }
}

/**
 * Shopping cart display component
 */
@Component({
  selector: 'app-cart-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-display">
      <h3>Shopping Cart ({{cart.totalItems()}} items)</h3>
      
      <div *ngIf="cart.isEmpty(); else cartItems" class="empty-cart">
        <p>Your cart is empty</p>
      </div>
      
      <ng-template #cartItems>
        <div class="cart-items">
          <div *ngFor="let item of cart.items()" class="cart-item">
            <span class="item-name">{{item.name}}</span>
            <span class="item-price">\${{item.price}}</span>
            <div class="quantity-controls">
              <button (click)="decreaseQuantity(item.id)">-</button>
              <span class="quantity">{{item.quantity}}</span>
              <button (click)="increaseQuantity(item.id)">+</button>
            </div>
            <button (click)="removeItem(item.id)" class="remove-btn">Remove</button>
          </div>
        </div>
        
        <div class="cart-summary">
          <p class="total">Total: <strong>\${{cart.totalPrice()}}</strong></p>
          <button (click)="cart.clear()" class="clear-cart">Clear Cart</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-display {
      border: 2px solid #e83e8c;
      padding: 1rem;
      margin: 1rem;
      border-radius: 8px;
    }
    .cart-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .quantity-controls button {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }
    .remove-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .cart-summary {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid #eee;
    }
    .total {
      font-size: 1.2em;
    }
    .clear-cart {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .empty-cart {
      text-align: center;
      color: #666;
      font-style: italic;
    }
  `]
})
export class CartDisplayComponent {
  protected cart = inject(ShoppingCartService);
  
  increaseQuantity(id: number): void {
    const item = this.cart.items().find(i => i.id === id);
    if (item) {
      this.cart.updateQuantity(id, item.quantity + 1);
    }
  }
  
  decreaseQuantity(id: number): void {
    const item = this.cart.items().find(i => i.id === id);
    if (item) {
      this.cart.updateQuantity(id, item.quantity - 1);
    }
  }
  
  removeItem(id: number): void {
    this.cart.removeItem(id);
  }
}

// ==========================================
// 5. MAIN DEMO COMPONENT
// ==========================================

/**
 * Main demo component that showcases all signal sharing patterns
 */
@Component({
  selector: 'app-signals-sharing-demo',
  standalone: true,
  imports: [
    CommonModule,
    CounterDisplayComponent,
    CounterControlsComponent,
    UserManagerComponent,
    NotificationsComponent,
    ParentChildDemoComponent,
    ProductListComponent,
    CartDisplayComponent
  ],
  template: `
    <div class="signals-demo">
      <h1>🔗 Sharing Signals Between Components</h1>
      
      <div class="theme-toggle">
        <button (click)="sharedState.toggleTheme()">
          Switch to {{sharedState.theme() === 'light' ? 'Dark' : 'Light'}} Theme
        </button>
      </div>
      
      <div class="demo-section" [attr.data-theme]="sharedState.theme()">
        <h2>1. Service-Based Signal Sharing</h2>
        <p>Multiple components sharing state through a service:</p>
        
        <div class="components-grid">
          <app-counter-display />
          <app-counter-controls />
          <app-user-manager />
          <app-notifications />
        </div>
      </div>
      
      <div class="demo-section">
        <h2>2. Parent-Child Communication</h2>
        <p>Parent and child components sharing signals directly:</p>
        <app-parent-child-demo />
      </div>
      
      <div class="demo-section">
        <h2>3. Shopping Cart Example</h2>
        <p>Complex state management with multiple related components:</p>
        <div class="shopping-demo">
          <app-product-list />
          <app-cart-display />
        </div>
      </div>
      
      <div class="best-practices">
        <h2>🎯 Best Practices for Sharing Signals</h2>
        <div class="practices-grid">
          <div class="practice-card">
            <h3>✅ Use Services for Global State</h3>
            <p>Create injectable services with readonly signals for shared state across multiple components.</p>
          </div>
          
          <div class="practice-card">
            <h3>✅ Expose Readonly Signals</h3>
            <p>Use <code>asReadonly()</code> to prevent external components from directly mutating state.</p>
          </div>
          
          <div class="practice-card">
            <h3>✅ Provide Update Methods</h3>
            <p>Create specific methods for state updates rather than exposing writable signals.</p>
          </div>
          
          <div class="practice-card">
            <h3>✅ Use Computed for Derived State</h3>
            <p>Create computed signals for values derived from other signals.</p>
          </div>
          
          <div class="practice-card">
            <h3>✅ Parent-Child for Local State</h3>
            <p>Use input/output signals for communication between parent and child components.</p>
          </div>
          
          <div class="practice-card">
            <h3>✅ Effects for Side Effects</h3>
            <p>Use effects to react to signal changes and perform side effects.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signals-demo {
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .theme-toggle {
      text-align: right;
      margin-bottom: 2rem;
    }
    
    .theme-toggle button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #6c757d;
      color: white;
      cursor: pointer;
    }
    
    .demo-section {
      margin: 2rem 0;
      padding: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .demo-section[data-theme="dark"] {
      background: #2d3748;
      color: white;
    }
    
    .demo-section[data-theme="light"] {
      background: #f8f9fa;
      color: #333;
    }
    
    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .shopping-demo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .best-practices {
      margin-top: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }
    
    .practices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .practice-card {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    
    .practice-card h3 {
      margin-top: 0;
      color: #ffd700;
    }
    
    .practice-card code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    
    @media (max-width: 768px) {
      .components-grid,
      .shopping-demo,
      .practices-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SignalsSharingDemoComponent implements OnInit {
  protected sharedState = inject(SharedStateService);
  
  ngOnInit(): void {
    // Example of using effect to react to state changes
    effect(() => {
      const user = this.sharedState.user();
      if (user) {
        this.sharedState.addNotification(`Welcome back, ${user.name}!`);
      }
    });
    
    effect(() => {
      const theme = this.sharedState.theme();
      document.body.setAttribute('data-theme', theme);
    });
  }
}

/*
==========================================
KEY TAKEAWAYS FOR SHARING SIGNALS
==========================================

1. **Service-Based Sharing (Recommended)**:
   - Create injectable services with signals
   - Expose readonly signals to prevent external mutation
   - Provide methods for state updates
   - Use computed signals for derived state

2. **Parent-Child Communication**:
   - Use input() for passing signals down
   - Use output() for emitting events up
   - Computed signals work great with inputs

3. **Global State Management**:
   - Services with providedIn: 'root' for app-wide state
   - Multiple specialized services for different domains
   - Compose services for complex state management

4. **Performance Benefits**:
   - Fine-grained reactivity - only affected components update
   - Automatic dependency tracking
   - No manual subscription management
   - Better change detection performance

5. **Best Practices**:
   - Keep signals simple and focused
   - Use computed for derived values
   - Effects for side effects only
   - Document your signal contracts
   - Test signal interactions

6. **Common Patterns**:
   - State service + multiple consumer components
   - Parent manages signals, children consume
   - Sibling communication through shared service
   - Event-driven updates through signal methods

==========================================
*/




