// Angular Immutable Data Patterns - Complete Guide and Examples
import { Injectable, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
==========================================
IMMUTABLE DATA PATTERNS EXPLAINED
==========================================

Immutable data patterns involve treating data as read-only after creation.
Instead of modifying existing objects/arrays, you create new ones with changes.

WHY USE IMMUTABLE PATTERNS?
✅ Predictable state changes
✅ Better change detection performance
✅ Easier debugging and testing
✅ Prevents accidental mutations
✅ Time-travel debugging possible
✅ Concurrent programming safety

CORE PRINCIPLE:
Instead of: object.property = newValue
Do: object = { ...object, property: newValue }
*/

// ==========================================
// 1. BASIC IMMUTABLE OPERATIONS
// ==========================================

interface User {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

// ❌ MUTABLE (BAD) - Modifies original data
class MutableUserService {
  private user: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    preferences: { theme: 'light', notifications: true }
  };

  // BAD: Mutates the original object
  updateUserName(newName: string) {
    this.user.name = newName; // ❌ Direct mutation
    return this.user;
  }

  // BAD: Mutates nested object
  updateTheme(theme: string) {
    this.user.preferences.theme = theme; // ❌ Nested mutation
    return this.user;
  }
}

// ✅ IMMUTABLE (GOOD) - Creates new data structures
@Injectable({ providedIn: 'root' })
export class ImmutableUserService {
  private userSubject = new BehaviorSubject<User>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    preferences: { theme: 'light', notifications: true }
  });

  public user$ = this.userSubject.asObservable();

  // ✅ GOOD: Creates new object with spread operator
  updateUserName(newName: string) {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      name: newName
    };
    this.userSubject.next(updatedUser);
  }

  // ✅ GOOD: Creates new nested object
  updateTheme(theme: string) {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        theme: theme
      }
    };
    this.userSubject.next(updatedUser);
  }

  // ✅ GOOD: Updates multiple properties immutably
  updateUser(updates: Partial<User>) {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      ...updates,
      // Handle nested objects properly
      preferences: updates.preferences 
        ? { ...currentUser.preferences, ...updates.preferences }
        : currentUser.preferences
    };
    this.userSubject.next(updatedUser);
  }
}

// ==========================================
// 2. IMMUTABLE ARRAY OPERATIONS
// ==========================================

@Injectable({ providedIn: 'root' })
export class ImmutableTodoService {
  private todosSubject = new BehaviorSubject<TodoItem[]>([
    { id: 1, text: 'Learn Angular', completed: false, priority: 'high', tags: ['learning', 'angular'] },
    { id: 2, text: 'Build app', completed: false, priority: 'medium', tags: ['development'] },
    { id: 3, text: 'Deploy app', completed: false, priority: 'low', tags: ['deployment'] }
  ]);

  public todos$ = this.todosSubject.asObservable();

  // ✅ ADD: Creates new array with new item
  addTodo(text: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const currentTodos = this.todosSubject.value;
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      tags: []
    };
    
    // Create new array with spread operator
    const updatedTodos = [...currentTodos, newTodo];
    this.todosSubject.next(updatedTodos);
  }

  // ✅ UPDATE: Creates new array with updated item
  updateTodo(id: number, updates: Partial<TodoItem>) {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates } // Create new object for matching item
        : todo                    // Keep original object for non-matching items
    );
    this.todosSubject.next(updatedTodos);
  }

  // ✅ DELETE: Creates new array without deleted item
  deleteTodo(id: number) {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== id);
    this.todosSubject.next(updatedTodos);
  }

  // ✅ TOGGLE: Immutable toggle completion
  toggleTodo(id: number) {
    this.updateTodo(id, { completed: !this.getTodoById(id)?.completed });
  }

  // ✅ ADD TAG: Immutable array addition
  addTag(id: number, tag: string) {
    const todo = this.getTodoById(id);
    if (todo && !todo.tags.includes(tag)) {
      this.updateTodo(id, { 
        tags: [...todo.tags, tag] // Create new tags array
      });
    }
  }

  // ✅ REMOVE TAG: Immutable array removal
  removeTag(id: number, tag: string) {
    const todo = this.getTodoById(id);
    if (todo) {
      this.updateTodo(id, {
        tags: todo.tags.filter(t => t !== tag) // Create new tags array
      });
    }
  }

  // ✅ REORDER: Immutable array reordering
  reorderTodos(fromIndex: number, toIndex: number) {
    const currentTodos = this.todosSubject.value;
    const newTodos = [...currentTodos]; // Create copy
    const [movedItem] = newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedItem);
    this.todosSubject.next(newTodos);
  }

  private getTodoById(id: number): TodoItem | undefined {
    return this.todosSubject.value.find(todo => todo.id === id);
  }
}

// ==========================================
// 3. IMMUTABLE HELPER UTILITIES
// ==========================================

export class ImmutableHelpers {
  
  // Deep clone utility for complex objects
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const cloned = {} as any;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  // Update nested property immutably
  static updateNestedProperty<T>(obj: T, path: string[], value: any): T {
    if (path.length === 0) return value;
    
    const [head, ...tail] = path;
    return {
      ...obj as any,
      [head]: this.updateNestedProperty((obj as any)[head] || {}, tail, value)
    };
  }

  // Merge objects immutably
  static mergeDeep<T>(target: T, source: Partial<T>): T {
    const result = { ...target as any };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = result[key];
        
        if (this.isObject(sourceValue) && this.isObject(targetValue)) {
          result[key] = this.mergeDeep(targetValue, sourceValue);
        } else {
          result[key] = sourceValue;
        }
      }
    }
    
    return result;
  }

  private static isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}

// ==========================================
// 4. COMPONENT WITH IMMUTABLE PATTERNS
// ==========================================

@Component({
  selector: 'app-immutable-demo',
  template: `
    <div>
      <h1>🔒 Immutable Data Patterns Demo</h1>
      
      <!-- User Management -->
      <div style="border: 2px solid #007bff; padding: 20px; margin: 20px 0;">
        <h2>👤 User Management (Immutable)</h2>
        <div *ngIf="user$ | async as user">
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Theme:</strong> {{ user.preferences.theme }}</p>
          <p><strong>Notifications:</strong> {{ user.preferences.notifications }}</p>
          
          <div>
            <input #nameInput [value]="user.name" placeholder="Name">
            <button (click)="updateName(nameInput.value)">Update Name</button>
          </div>
          
          <div>
            <select #themeSelect [value]="user.preferences.theme" (change)="updateTheme(themeSelect.value)">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
            <label>Theme</label>
          </div>
        </div>
      </div>

      <!-- Todo Management -->
      <div style="border: 2px solid #28a745; padding: 20px; margin: 20px 0;">
        <h2>📝 Todo Management (Immutable)</h2>
        
        <div>
          <input #todoInput placeholder="New todo text">
          <select #prioritySelect>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button (click)="addTodo(todoInput.value, prioritySelect.value); todoInput.value = ''">
            Add Todo
          </button>
        </div>

        <div *ngFor="let todo of todos$ | async; trackBy: trackByTodoId" 
             style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
          
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" 
                   [checked]="todo.completed"
                   (change)="toggleTodo(todo.id)">
            
            <span [style.text-decoration]="todo.completed ? 'line-through' : 'none'">
              {{ todo.text }}
            </span>
            
            <span class="priority" [style.color]="getPriorityColor(todo.priority)">
              {{ todo.priority }}
            </span>
            
            <button (click)="deleteTodo(todo.id)" style="background: #dc3545; color: white;">
              Delete
            </button>
          </div>

          <div style="margin-top: 10px;">
            <strong>Tags:</strong>
            <span *ngFor="let tag of todo.tags" 
                  style="background: #e9ecef; padding: 2px 8px; margin: 2px; border-radius: 12px;">
              {{ tag }}
              <button (click)="removeTag(todo.id, tag)" style="background: none; border: none; color: #dc3545;">
                ×
              </button>
            </span>
            
            <input #tagInput placeholder="Add tag" style="margin-left: 10px;">
            <button (click)="addTag(todo.id, tagInput.value); tagInput.value = ''">
              Add Tag
            </button>
          </div>
        </div>
      </div>

      <!-- Immutable Patterns Explanation -->
      <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>🔍 Immutable Patterns Used:</h2>
        <ul>
          <li><strong>Spread Operator:</strong> <code>{ ...obj, newProp: value }</code></li>
          <li><strong>Array Methods:</strong> <code>map(), filter(), concat()</code> instead of <code>push(), splice()</code></li>
          <li><strong>Nested Updates:</strong> <code>{ ...obj, nested: { ...obj.nested, prop: value } }</code></li>
          <li><strong>State Management:</strong> BehaviorSubject with immutable updates</li>
          <li><strong>Change Detection:</strong> OnPush strategy for better performance</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ OnPush works great with immutable data
})
export class ImmutableDemoComponent implements OnInit {
  user$: Observable<User>;
  todos$: Observable<TodoItem[]>;

  constructor(
    private userService: ImmutableUserService,
    private todoService: ImmutableTodoService
  ) {
    this.user$ = this.userService.user$;
    this.todos$ = this.todoService.todos$;
  }

  ngOnInit() {
    console.log('🚀 Immutable Demo Component initialized');
  }

  // User operations
  updateName(name: string) {
    if (name.trim()) {
      this.userService.updateUserName(name.trim());
    }
  }

  updateTheme(theme: string) {
    this.userService.updateTheme(theme);
  }

  // Todo operations
  addTodo(text: string, priority: 'low' | 'medium' | 'high') {
    if (text.trim()) {
      this.todoService.addTodo(text.trim(), priority);
    }
  }

  toggleTodo(id: number) {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }

  addTag(id: number, tag: string) {
    if (tag.trim()) {
      this.todoService.addTag(id, tag.trim());
    }
  }

  removeTag(id: number, tag: string) {
    this.todoService.removeTag(id, tag);
  }

  // Helper methods
  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id; // ✅ Efficient tracking for immutable objects
  }

  getPriorityColor(priority: string): string {
    const colors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  }
}

/*
==========================================
IMMUTABLE PATTERNS CHEAT SHEET
==========================================

1. **Object Updates:**
   ❌ obj.prop = value
   ✅ obj = { ...obj, prop: value }

2. **Nested Object Updates:**
   ❌ obj.nested.prop = value
   ✅ obj = { ...obj, nested: { ...obj.nested, prop: value } }

3. **Array Add:**
   ❌ arr.push(item)
   ✅ arr = [...arr, item]

4. **Array Remove:**
   ❌ arr.splice(index, 1)
   ✅ arr = arr.filter((_, i) => i !== index)

5. **Array Update:**
   ❌ arr[index] = newValue
   ✅ arr = arr.map((item, i) => i === index ? newValue : item)

6. **Array Insert:**
   ❌ arr.splice(index, 0, item)
   ✅ arr = [...arr.slice(0, index), item, ...arr.slice(index)]

==========================================
BENEFITS OF IMMUTABLE PATTERNS
==========================================

✅ **Predictable State Changes**
   - No unexpected mutations
   - Clear data flow

✅ **Better Performance**
   - OnPush change detection works perfectly
   - Reference equality checks are fast

✅ **Easier Debugging**
   - State history is preserved
   - Time-travel debugging possible

✅ **Safer Concurrent Programming**
   - No race conditions from mutations
   - Thread-safe operations

✅ **Better Testing**
   - Predictable test scenarios
   - No hidden state mutations

==========================================
WHEN TO USE IMMUTABLE PATTERNS
==========================================

🎯 **Always Use For:**
- State management (Redux, NgRx)
- Component state updates
- Form data handling
- API response processing

⚠️ **Consider Performance For:**
- Very large datasets
- High-frequency updates
- Memory-constrained environments

💡 **Libraries That Help:**
- Immer (draft-based mutations)
- Immutable.js (persistent data structures)
- Lodash/fp (functional utilities)
- Ramda (functional programming)
*/
