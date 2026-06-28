// Angular Input Accessibility During Lifecycle - Complete Guide
import { Component, Input, OnInit, OnChanges, AfterViewInit, SimpleChanges, ElementRef, ViewChild } from '@angular/core';

/*
==========================================
INPUT ACCESSIBILITY DURING LIFECYCLE
==========================================

ANSWER: YES, @Input properties ARE accessible in ngOnInit()

LIFECYCLE ORDER:
1. Constructor          - Inputs NOT available
2. ngOnChanges          - Inputs available (first time)
3. ngOnInit             - Inputs available ✅
4. ngDoCheck            - Inputs available
5. ngAfterContentInit   - Inputs available
6. ngAfterContentChecked- Inputs available
7. ngAfterViewInit      - Inputs available
8. ngAfterViewChecked   - Inputs available

KEY POINT: ngOnInit runs AFTER Angular has set all input properties
*/

// ==========================================
// 1. DEMONSTRATION COMPONENT
// ==========================================

@Component({
  selector: 'app-child-component',
  template: `
    <div style="border: 2px solid #007bff; padding: 15px; margin: 10px;">
      <h3>Child Component</h3>
      <p><strong>User Name:</strong> {{ userName }}</p>
      <p><strong>User Age:</strong> {{ userAge }}</p>
      <p><strong>Is Active:</strong> {{ isActive }}</p>
      <p><strong>Settings:</strong> {{ settings | json }}</p>
      
      <div style="background: #e3f2fd; padding: 10px; margin: 10px 0;">
        <h4>Lifecycle Log:</h4>
        <div *ngFor="let log of lifecycleLog" [style.color]="getLogColor(log)">
          {{ log }}
        </div>
      </div>
      
      <button (click)="logCurrentInputs()">Log Current Inputs</button>
    </div>
  `
})
export class ChildComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() userName!: string;
  @Input() userAge!: number;
  @Input() isActive: boolean = false;
  @Input() settings: any = {};
  
  lifecycleLog: string[] = [];

  constructor() {
    this.addLog('🏗️ Constructor called');
    this.addLog(`   userName in constructor: ${this.userName}`);
    this.addLog(`   userAge in constructor: ${this.userAge}`);
    this.addLog(`   isActive in constructor: ${this.isActive}`);
    this.addLog(`   settings in constructor: ${JSON.stringify(this.settings)}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.addLog('🔄 ngOnChanges called');
    
    for (const propName in changes) {
      const change = changes[propName];
      this.addLog(`   ${propName}: ${change.previousValue} → ${change.currentValue}`);
    }
    
    // ✅ Inputs ARE available in ngOnChanges
    this.addLog(`   All inputs accessible: userName=${this.userName}, userAge=${this.userAge}`);
  }

  ngOnInit() {
    this.addLog('🚀 ngOnInit called');
    
    // ✅ YES! Inputs ARE accessible in ngOnInit
    this.addLog(`   ✅ userName in ngOnInit: ${this.userName}`);
    this.addLog(`   ✅ userAge in ngOnInit: ${this.userAge}`);
    this.addLog(`   ✅ isActive in ngOnInit: ${this.isActive}`);
    this.addLog(`   ✅ settings in ngOnInit: ${JSON.stringify(this.settings)}`);
    
    // You can safely use inputs here
    this.initializeComponent();
  }

  ngAfterViewInit() {
    this.addLog('👁️ ngAfterViewInit called');
    this.addLog(`   Inputs still accessible: userName=${this.userName}`);
  }

  private initializeComponent() {
    this.addLog('🔧 Initializing component with input values...');
    
    if (this.userName) {
      this.addLog(`   Setting up for user: ${this.userName}`);
    }
    
    if (this.userAge >= 18) {
      this.addLog(`   User is adult (${this.userAge} years old)`);
    }
    
    if (this.isActive) {
      this.addLog(`   User is active - enabling features`);
    }
    
    if (this.settings.theme) {
      this.addLog(`   Applying theme: ${this.settings.theme}`);
    }
  }

  logCurrentInputs() {
    this.addLog('📋 Current input values:');
    this.addLog(`   userName: ${this.userName}`);
    this.addLog(`   userAge: ${this.userAge}`);
    this.addLog(`   isActive: ${this.isActive}`);
    this.addLog(`   settings: ${JSON.stringify(this.settings)}`);
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.lifecycleLog.push(`[${timestamp}] ${message}`);
    console.log(message);
  }

  getLogColor(log: string): string {
    if (log.includes('Constructor')) return '#dc3545';
    if (log.includes('ngOnChanges')) return '#fd7e14';
    if (log.includes('ngOnInit')) return '#28a745';
    if (log.includes('ngAfterViewInit')) return '#6f42c1';
    if (log.includes('✅')) return '#20c997';
    return '#6c757d';
  }
}

// ==========================================
// 2. PARENT COMPONENT FOR TESTING
// ==========================================

@Component({
  selector: 'app-input-lifecycle-demo',
  template: `
    <div>
      <h1>📥 Input Accessibility in Lifecycle Demo</h1>
      
      <div style="background: #d4edda; padding: 20px; margin: 20px 0;">
        <h2>✅ Key Facts:</h2>
        <ul>
          <li><strong>Constructor:</strong> Inputs are NOT yet available</li>
          <li><strong>ngOnChanges:</strong> Inputs are available (first change)</li>
          <li><strong>ngOnInit:</strong> Inputs ARE available ✅</li>
          <li><strong>All later hooks:</strong> Inputs remain available</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
        <h3>🎛️ Control Panel:</h3>
        
        <div>
          <label>User Name: </label>
          <input [(ngModel)]="userName" placeholder="Enter name">
        </div>
        
        <div>
          <label>User Age: </label>
          <input type="number" [(ngModel)]="userAge" placeholder="Enter age">
        </div>
        
        <div>
          <label>
            <input type="checkbox" [(ngModel)]="isActive">
            Is Active
          </label>
        </div>
        
        <div>
          <label>Theme: </label>
          <select [(ngModel)]="settings.theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <button (click)="recreateComponent()">Recreate Component</button>
        <button (click)="updateSettings()">Update Settings</button>
      </div>

      <!-- Component will be recreated each time -->
      <app-child-component 
        *ngIf="showComponent"
        [userName]="userName"
        [userAge]="userAge"
        [isActive]="isActive"
        [settings]="settings">
      </app-child-component>
    </div>
  `
})
export class InputLifecycleDemoComponent {
  userName = 'John Doe';
  userAge = 25;
  isActive = true;
  settings = { theme: 'light', notifications: true };
  showComponent = true;

  recreateComponent() {
    console.log('\n🔄 Recreating component to see full lifecycle...\n');
    this.showComponent = false;
    
    // Recreate component after a short delay
    setTimeout(() => {
      this.showComponent = true;
    }, 100);
  }

  updateSettings() {
    this.settings = {
      ...this.settings,
      lastUpdated: new Date().toISOString(),
      randomValue: Math.random()
    };
  }
}

// ==========================================
// 3. PRACTICAL EXAMPLES
// ==========================================

// ❌ WRONG: Trying to use inputs in constructor
@Component({
  selector: 'app-wrong-usage',
  template: '<div>{{ processedData }}</div>'
})
export class WrongUsageComponent {
  @Input() data!: any[];
  processedData: any[] = [];

  constructor() {
    // ❌ This will NOT work - inputs are not available yet
    if (this.data) { // this.data is undefined here!
      this.processedData = this.data.map(item => ({ ...item, processed: true }));
    }
  }
}

// ✅ CORRECT: Using inputs in ngOnInit
@Component({
  selector: 'app-correct-usage',
  template: '<div>{{ processedData | json }}</div>'
})
export class CorrectUsageComponent implements OnInit {
  @Input() data!: any[];
  @Input() config: any = {};
  processedData: any[] = [];

  ngOnInit() {
    // ✅ This WILL work - inputs are available in ngOnInit
    if (this.data) {
      this.processedData = this.data.map(item => ({
        ...item,
        processed: true,
        processedAt: new Date(),
        config: this.config
      }));
    }
    
    // You can safely initialize based on inputs
    this.setupComponent();
  }

  private setupComponent() {
    if (this.config.enableLogging) {
      console.log('Component initialized with data:', this.data);
    }
  }
}

// ==========================================
// 4. ADVANCED PATTERNS
// ==========================================

@Component({
  selector: 'app-advanced-input-handling',
  template: `
    <div>
      <h3>Advanced Input Handling</h3>
      <p>Computed value: {{ computedValue }}</p>
      <p>Validation status: {{ validationStatus }}</p>
    </div>
  `
})
export class AdvancedInputHandlingComponent implements OnInit, OnChanges {
  @Input() value!: number;
  @Input() multiplier: number = 1;
  @Input() validator?: (value: number) => boolean;

  computedValue: number = 0;
  validationStatus: string = 'pending';

  ngOnInit() {
    // ✅ Initial computation with input values
    this.computeValue();
    this.validateValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    // ✅ Recompute when inputs change
    if (changes['value'] || changes['multiplier']) {
      this.computeValue();
    }
    
    if (changes['value'] || changes['validator']) {
      this.validateValue();
    }
  }

  private computeValue() {
    if (this.value !== undefined && this.multiplier !== undefined) {
      this.computedValue = this.value * this.multiplier;
    }
  }

  private validateValue() {
    if (this.validator && this.value !== undefined) {
      this.validationStatus = this.validator(this.value) ? 'valid' : 'invalid';
    } else {
      this.validationStatus = 'no validator';
    }
  }
}

/*
==========================================
INPUT ACCESSIBILITY SUMMARY
==========================================

LIFECYCLE STAGE          | INPUTS ACCESSIBLE | NOTES
--------------------------|-------------------|------------------
constructor()             | ❌ NO             | Too early
ngOnChanges()            | ✅ YES            | First time inputs are set
ngOnInit()               | ✅ YES            | Safe to use inputs
ngDoCheck()              | ✅ YES            | Always available
ngAfterContentInit()     | ✅ YES            | Always available
ngAfterContentChecked()  | ✅ YES            | Always available
ngAfterViewInit()        | ✅ YES            | Always available
ngAfterViewChecked()     | ✅ YES            | Always available

==========================================
BEST PRACTICES
==========================================

✅ DO:
- Use inputs in ngOnInit() for initialization
- Handle input changes in ngOnChanges()
- Validate inputs in ngOnInit() and ngOnChanges()
- Initialize component state based on inputs in ngOnInit()

❌ DON'T:
- Try to access inputs in constructor
- Assume inputs are always defined (use ! or ? appropriately)
- Forget to handle input changes in long-lived components
- Perform heavy operations on every input change

==========================================
COMMON PATTERNS
==========================================

1. **Input Validation:**
```typescript
ngOnInit() {
  if (!this.requiredInput) {
    throw new Error('requiredInput is mandatory');
  }
}
```

2. **Input-based Initialization:**
```typescript
ngOnInit() {
  this.setupService(this.config);
  this.loadData(this.userId);
}
```

3. **Computed Properties:**
```typescript
ngOnInit() {
  this.computedValue = this.processInput(this.inputValue);
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['inputValue']) {
    this.computedValue = this.processInput(this.inputValue);
  }
}
```
*/
