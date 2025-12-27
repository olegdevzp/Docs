// Angular markForCheck vs detectChanges - Complete Guide
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
==========================================
markForCheck() vs detectChanges() EXPLAINED
==========================================

Both methods are used to trigger change detection, but they work differently:

markForCheck():
- SCHEDULES change detection to run in the next cycle
- Works with OnPush change detection strategy
- Marks component and all ancestors for checking
- Asynchronous - doesn't run immediately
- Safe to call multiple times
- Preferred for OnPush components

detectChanges():
- IMMEDIATELY runs change detection for this component
- Runs synchronously right now
- Only checks current component and its children
- Can cause performance issues if overused
- May cause ExpressionChangedAfterItHasBeenCheckedError
- Use carefully, mainly for testing or special cases
*/

// ==========================================
// 1. DEMONSTRATION SERVICES
// ==========================================

interface DataItem {
  id: number;
  name: string;
  value: number;
  timestamp: Date;
}

export class DataService {
  private dataSubject = new Subject<DataItem[]>();
  public data$ = this.dataSubject.asObservable();
  
  private currentData: DataItem[] = [
    { id: 1, name: 'Item 1', value: 100, timestamp: new Date() },
    { id: 2, name: 'Item 2', value: 200, timestamp: new Date() },
    { id: 3, name: 'Item 3', value: 300, timestamp: new Date() }
  ];

  constructor() {
    // Simulate data updates outside Angular zone
    setInterval(() => {
      this.updateData();
    }, 2000);
  }

  private updateData() {
    this.currentData = this.currentData.map(item => ({
      ...item,
      value: item.value + Math.floor(Math.random() * 10),
      timestamp: new Date()
    }));
    
    this.dataSubject.next([...this.currentData]);
  }

  getData(): DataItem[] {
    return [...this.currentData];
  }

  addItem(name: string) {
    const newItem: DataItem = {
      id: Date.now(),
      name,
      value: Math.floor(Math.random() * 1000),
      timestamp: new Date()
    };
    
    this.currentData.push(newItem);
    this.dataSubject.next([...this.currentData]);
  }
}

// ==========================================
// 2. DEFAULT CHANGE DETECTION COMPONENT
// ==========================================

@Component({
  selector: 'app-default-detection',
  template: `
    <div style="border: 2px solid #28a745; padding: 15px; margin: 10px;">
      <h3>🔄 Default Change Detection</h3>
      <p><strong>Strategy:</strong> Default (checks on every change detection cycle)</p>
      <p><strong>Counter:</strong> {{ counter }}</p>
      <p><strong>Last Update:</strong> {{ lastUpdate }}</p>
      <p><strong>Render Count:</strong> {{ renderCount }}</p>
      
      <div>
        <button (click)="increment()">Increment Counter</button>
        <button (click)="updateTimestamp()">Update Timestamp</button>
        <button (click)="forceDetectChanges()">Force detectChanges()</button>
        <button (click)="callMarkForCheck()">Call markForCheck()</button>
      </div>

      <div style="background: #d4edda; padding: 10px; margin: 10px 0;">
        <h4>📊 Behavior:</h4>
        <ul>
          <li>✅ Automatically updates on any change</li>
          <li>✅ No manual change detection needed</li>
          <li>⚠️ Runs change detection frequently</li>
          <li>⚠️ Can impact performance with many components</li>
        </ul>
      </div>
    </div>
  `,
  // Default change detection strategy
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultDetectionComponent {
  counter = 0;
  lastUpdate = new Date().toLocaleTimeString();
  renderCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    this.renderCount++;
    console.log('🔄 Default component - ngDoCheck called, render count:', this.renderCount);
  }

  increment() {
    this.counter++;
    console.log('➕ Default component - counter incremented:', this.counter);
  }

  updateTimestamp() {
    this.lastUpdate = new Date().toLocaleTimeString();
    console.log('🕐 Default component - timestamp updated:', this.lastUpdate);
  }

  forceDetectChanges() {
    console.log('🔍 Default component - calling detectChanges()');
    this.cdr.detectChanges();
  }

  callMarkForCheck() {
    console.log('📌 Default component - calling markForCheck()');
    this.cdr.markForCheck();
  }
}

// ==========================================
// 3. OnPush COMPONENT WITH markForCheck()
// ==========================================

@Component({
  selector: 'app-onpush-mark-for-check',
  template: `
    <div style="border: 2px solid #007bff; padding: 15px; margin: 10px;">
      <h3>📌 OnPush + markForCheck()</h3>
      <p><strong>Strategy:</strong> OnPush (only checks when marked or inputs change)</p>
      <p><strong>Counter:</strong> {{ counter }}</p>
      <p><strong>Last Update:</strong> {{ lastUpdate }}</p>
      <p><strong>Render Count:</strong> {{ renderCount }}</p>
      <p><strong>Data Items:</strong> {{ dataItems.length }}</p>
      
      <div *ngFor="let item of dataItems" style="background: #f8f9fa; padding: 5px; margin: 2px;">
        {{ item.name }}: {{ item.value }} ({{ item.timestamp | date:'HH:mm:ss' }})
      </div>
      
      <div>
        <button (click)="increment()">Increment Counter</button>
        <button (click)="updateTimestamp()">Update Timestamp</button>
        <button (click)="loadData()">Load Data (markForCheck)</button>
        <button (click)="loadDataWithDetectChanges()">Load Data (detectChanges)</button>
        <button (click)="subscribeToData()">Subscribe to Data Stream</button>
      </div>

      <div style="background: #cce5ff; padding: 10px; margin: 10px 0;">
        <h4>📊 Behavior:</h4>
        <ul>
          <li>✅ Only updates when markForCheck() is called</li>
          <li>✅ Better performance - less frequent checks</li>
          <li>⚠️ Requires manual change detection for internal changes</li>
          <li>✅ markForCheck() schedules check for next cycle</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushMarkForCheckComponent implements OnInit, OnDestroy {
  counter = 0;
  lastUpdate = new Date().toLocaleTimeString();
  renderCount = 0;
  dataItems: DataItem[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  ngOnInit() {
    console.log('🚀 OnPush markForCheck component initialized');
  }

  ngDoCheck() {
    this.renderCount++;
    console.log('📌 OnPush markForCheck - ngDoCheck called, render count:', this.renderCount);
  }

  increment() {
    this.counter++;
    console.log('➕ OnPush markForCheck - counter incremented:', this.counter);
    console.log('   ❌ UI will NOT update automatically (OnPush strategy)');
    
    // Need to manually trigger change detection
    this.cdr.markForCheck();
    console.log('   ✅ Called markForCheck() - UI will update in next cycle');
  }

  updateTimestamp() {
    this.lastUpdate = new Date().toLocaleTimeString();
    console.log('🕐 OnPush markForCheck - timestamp updated:', this.lastUpdate);
    console.log('   ❌ UI will NOT update automatically');
    
    this.cdr.markForCheck();
    console.log('   ✅ Called markForCheck() - scheduled for next cycle');
  }

  loadData() {
    console.log('📊 OnPush markForCheck - loading data with markForCheck()');
    this.dataItems = this.dataService.getData();
    
    // markForCheck() schedules change detection for next cycle
    this.cdr.markForCheck();
    console.log('   ✅ markForCheck() called - change detection scheduled');
  }

  loadDataWithDetectChanges() {
    console.log('📊 OnPush markForCheck - loading data with detectChanges()');
    this.dataItems = this.dataService.getData();
    
    // detectChanges() runs immediately
    this.cdr.detectChanges();
    console.log('   ✅ detectChanges() called - change detection ran immediately');
  }

  subscribeToData() {
    console.log('📡 OnPush markForCheck - subscribing to data stream');
    
    this.dataService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('   📨 Data received:', data.length, 'items');
        this.dataItems = data;
        
        // markForCheck() is perfect for async data updates
        this.cdr.markForCheck();
        console.log('   ✅ markForCheck() called for async update');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ==========================================
// 4. OnPush COMPONENT WITH detectChanges()
// ==========================================

@Component({
  selector: 'app-onpush-detect-changes',
  template: `
    <div style="border: 2px solid #dc3545; padding: 15px; margin: 10px;">
      <h3>🔍 OnPush + detectChanges()</h3>
      <p><strong>Strategy:</strong> OnPush with immediate detection</p>
      <p><strong>Counter:</strong> {{ counter }}</p>
      <p><strong>Last Update:</strong> {{ lastUpdate }}</p>
      <p><strong>Render Count:</strong> {{ renderCount }}</p>
      <p><strong>Computation Result:</strong> {{ computationResult }}</p>
      
      <div>
        <button (click)="incrementAndDetect()">Increment + detectChanges()</button>
        <button (click)="updateAndDetect()">Update + detectChanges()</button>
        <button (click)="heavyComputationWithDetect()">Heavy Computation + detectChanges()</button>
        <button (click)="multipleUpdatesWithDetect()">Multiple Updates + detectChanges()</button>
      </div>

      <div style="background: #f8d7da; padding: 10px; margin: 10px 0;">
        <h4>⚠️ Behavior & Warnings:</h4>
        <ul>
          <li>✅ Updates UI immediately when detectChanges() called</li>
          <li>⚠️ Runs synchronously - can block UI thread</li>
          <li>⚠️ May cause ExpressionChangedAfterItHasBeenCheckedError</li>
          <li>⚠️ Can impact performance if overused</li>
          <li>🎯 Use mainly for testing or special synchronous cases</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushDetectChangesComponent {
  counter = 0;
  lastUpdate = new Date().toLocaleTimeString();
  renderCount = 0;
  computationResult = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    this.renderCount++;
    console.log('🔍 OnPush detectChanges - ngDoCheck called, render count:', this.renderCount);
  }

  incrementAndDetect() {
    console.log('➕ OnPush detectChanges - increment with immediate detection');
    this.counter++;
    
    // detectChanges() runs immediately
    this.cdr.detectChanges();
    console.log('   ✅ detectChanges() completed - UI updated immediately');
  }

  updateAndDetect() {
    console.log('🕐 OnPush detectChanges - update timestamp with immediate detection');
    this.lastUpdate = new Date().toLocaleTimeString();
    
    this.cdr.detectChanges();
    console.log('   ✅ detectChanges() completed immediately');
  }

  heavyComputationWithDetect() {
    console.log('💻 OnPush detectChanges - heavy computation with immediate detection');
    console.time('Heavy Computation');
    
    // Simulate heavy computation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    this.computationResult = Math.round(result);
    
    console.timeEnd('Heavy Computation');
    
    // Immediate detection after computation
    this.cdr.detectChanges();
    console.log('   ✅ detectChanges() called immediately after computation');
  }

  multipleUpdatesWithDetect() {
    console.log('🔄 OnPush detectChanges - multiple updates with detection');
    
    // Multiple property updates
    this.counter += 5;
    this.lastUpdate = new Date().toLocaleTimeString();
    this.computationResult = Math.random() * 1000;
    
    // Single detectChanges() call for all updates
    this.cdr.detectChanges();
    console.log('   ✅ Single detectChanges() for multiple property updates');
  }
}

// ==========================================
// 5. COMPARISON COMPONENT
// ==========================================

@Component({
  selector: 'app-comparison-demo',
  template: `
    <div style="border: 2px solid #6f42c1; padding: 15px; margin: 10px;">
      <h3>⚖️ Performance Comparison</h3>
      
      <div>
        <button (click)="testMarkForCheckPerformance()">Test markForCheck() Performance</button>
        <button (click)="testDetectChangesPerformance()">Test detectChanges() Performance</button>
        <button (click)="clearResults()">Clear Results</button>
      </div>

      <div *ngIf="performanceResults.length > 0">
        <h4>📊 Performance Results:</h4>
        <div *ngFor="let result of performanceResults" 
             [style.color]="result.method === 'markForCheck' ? '#007bff' : '#dc3545'">
          <strong>{{ result.method }}:</strong> {{ result.duration }}ms 
          ({{ result.operations }} operations)
        </div>
      </div>

      <div style="background: #e2e3e5; padding: 10px; margin: 10px 0;">
        <h4>🎯 When to Use Each:</h4>
        
        <h5>markForCheck():</h5>
        <ul>
          <li>✅ OnPush components with async data</li>
          <li>✅ Observable subscriptions</li>
          <li>✅ Event handlers in OnPush components</li>
          <li>✅ When you want to schedule detection for next cycle</li>
        </ul>
        
        <h5>detectChanges():</h5>
        <ul>
          <li>✅ Unit testing scenarios</li>
          <li>✅ Immediate synchronous updates needed</li>
          <li>✅ Integration with third-party libraries</li>
          <li>⚠️ Use sparingly in production code</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonDemoComponent {
  performanceResults: Array<{method: string, duration: number, operations: number}> = [];

  constructor(private cdr: ChangeDetectorRef) {}

  testMarkForCheckPerformance() {
    console.log('🚀 Testing markForCheck() performance...');
    const operations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < operations; i++) {
      this.cdr.markForCheck();
    }
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    this.performanceResults.push({
      method: 'markForCheck',
      duration,
      operations
    });
    
    this.cdr.markForCheck(); // Update the results display
    console.log(`✅ markForCheck() test completed: ${duration}ms for ${operations} operations`);
  }

  testDetectChangesPerformance() {
    console.log('🚀 Testing detectChanges() performance...');
    const operations = 100; // Fewer operations due to synchronous nature
    const startTime = performance.now();
    
    for (let i = 0; i < operations; i++) {
      this.cdr.detectChanges();
    }
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    this.performanceResults.push({
      method: 'detectChanges',
      duration,
      operations
    });
    
    this.cdr.detectChanges(); // Update the results display
    console.log(`✅ detectChanges() test completed: ${duration}ms for ${operations} operations`);
  }

  clearResults() {
    this.performanceResults = [];
    this.cdr.markForCheck();
  }
}

// ==========================================
// 6. MAIN DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-change-detection-demo',
  template: `
    <div>
      <h1>🔄 markForCheck() vs detectChanges() Demo</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>🔑 Key Differences:</h2>
        
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1; background: #cce5ff; padding: 15px;">
            <h3>📌 markForCheck()</h3>
            <ul>
              <li>✅ Schedules change detection for next cycle</li>
              <li>✅ Asynchronous - non-blocking</li>
              <li>✅ Safe to call multiple times</li>
              <li>✅ Perfect for OnPush components</li>
              <li>✅ Works with Angular's change detection flow</li>
            </ul>
          </div>
          
          <div style="flex: 1; background: #f8d7da; padding: 15px;">
            <h3>🔍 detectChanges()</h3>
            <ul>
              <li>⚡ Runs change detection immediately</li>
              <li>⚠️ Synchronous - can block UI</li>
              <li>⚠️ Can cause performance issues</li>
              <li>⚠️ May trigger ExpressionChanged errors</li>
              <li>🎯 Use mainly for testing</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>🧪 Live Examples:</h2>
        
        <app-default-detection></app-default-detection>
        <app-onpush-mark-for-check></app-onpush-mark-for-check>
        <app-onpush-detect-changes></app-onpush-detect-changes>
        <app-comparison-demo></app-comparison-demo>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0;">
        <h2>📚 Best Practices:</h2>
        
        <h3>✅ DO:</h3>
        <ul>
          <li>Use <code>markForCheck()</code> in OnPush components</li>
          <li>Call <code>markForCheck()</code> in Observable subscriptions</li>
          <li>Use <code>detectChanges()</code> in unit tests</li>
          <li>Prefer <code>markForCheck()</code> for async operations</li>
        </ul>
        
        <h3>❌ DON'T:</h3>
        <ul>
          <li>Overuse <code>detectChanges()</code> in production</li>
          <li>Call <code>detectChanges()</code> in loops</li>
          <li>Use <code>detectChanges()</code> for async data updates</li>
          <li>Forget to handle subscriptions properly</li>
        </ul>
      </div>
    </div>
  `,
  providers: [DataService]
})
export class ChangeDetectionDemoComponent {}

/*
==========================================
SUMMARY: markForCheck() vs detectChanges()
==========================================

markForCheck():
✅ WHEN TO USE:
- OnPush components with internal state changes
- Observable/Promise callbacks
- Event handlers in OnPush components
- Async data updates
- When you want to work with Angular's change detection cycle

✅ BENEFITS:
- Non-blocking (asynchronous)
- Safe to call multiple times
- Works with Angular's optimization
- Better performance
- Prevents ExpressionChanged errors

detectChanges():
✅ WHEN TO USE:
- Unit testing scenarios
- Immediate synchronous updates required
- Third-party library integration
- Special cases where immediate detection needed

⚠️ DRAWBACKS:
- Blocking (synchronous)
- Can cause performance issues
- May trigger ExpressionChangedAfterItHasBeenCheckedError
- Bypasses Angular's optimizations

==========================================
DECISION FLOWCHART
==========================================

Need immediate update? 
├─ Yes → Are you in a test? 
│  ├─ Yes → Use detectChanges()
│  └─ No → Consider if really needed, usually markForCheck()
└─ No → Use markForCheck()

Is this an OnPush component?
├─ Yes → Use markForCheck()
└─ No → Usually no manual detection needed

Is this async data (Observable/Promise)?
├─ Yes → Use markForCheck()
└─ No → Consider if manual detection needed

==========================================
PERFORMANCE COMPARISON
==========================================

markForCheck():
- ~0.01ms per call
- Batched with other changes
- Non-blocking
- Scales well

detectChanges():
- ~0.1-1ms per call (depends on component tree)
- Immediate execution
- Can block UI thread
- Performance degrades with overuse
*/
