// Angular NgZone Deep Dive - Complete Breakdown and Examples
import { Injectable, Component, NgZone, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Subject, interval, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
==========================================
NgZone DEEP BREAKDOWN
==========================================

NgZone is Angular's execution context that:
1. **Patches async APIs** (setTimeout, Promise, EventTarget, etc.)
2. **Triggers change detection** when async operations complete
3. **Provides zone-aware execution context**
4. **Manages when Angular should check for changes**

CORE CONCEPT:
Zone.js monkey-patches browser APIs to know when async operations start/end.
NgZone extends Zone.js to trigger Angular's change detection cycle.

THE FLOW:
1. User clicks button → Event captured by patched addEventListener
2. NgZone detects async operation completion
3. NgZone triggers change detection across entire app
4. Angular updates DOM if any bindings changed
*/

// ==========================================
// 1. NgZone INTERNAL MECHANICS
// ==========================================

@Injectable({ providedIn: 'root' })
export class NgZoneAnalysisService {
  private destroy$ = new Subject<void>();
  
  constructor(private ngZone: NgZone) {
    this.setupZoneMonitoring();
  }

  private setupZoneMonitoring() {
    console.log('🔍 Setting up NgZone monitoring...');
    
    // Monitor when NgZone becomes stable/unstable
    this.ngZone.onUnstable.pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('⚡ NgZone became UNSTABLE - async operation started');
    });

    this.ngZone.onStable.pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('✅ NgZone became STABLE - async operation completed, change detection triggered');
    });

    this.ngZone.onError.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      console.error('❌ NgZone Error:', error);
    });

    // Monitor microtask queue
    this.ngZone.onMicrotaskEmpty.pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('🔄 Microtask queue empty - change detection cycle complete');
    });
  }

  // Demonstrate different async operations and their NgZone behavior
  demonstrateAsyncOperations() {
    console.log('\n🚀 Starting NgZone async operations demonstration...\n');

    // 1. setTimeout - Patched by Zone.js
    console.log('1️⃣ Scheduling setTimeout...');
    setTimeout(() => {
      console.log('   ⏰ setTimeout callback executed');
    }, 1000);

    // 2. Promise - Patched by Zone.js  
    console.log('2️⃣ Creating Promise...');
    Promise.resolve('Promise resolved').then(result => {
      console.log(`   🎯 Promise callback: ${result}`);
    });

    // 3. Fetch API - Patched by Zone.js
    console.log('3️⃣ Making fetch request...');
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(data => {
        console.log('   🌐 Fetch completed:', data.title);
      })
      .catch(error => {
        console.log('   🌐 Fetch completed with error:', error.message);
      });

    // 4. setInterval - Patched by Zone.js
    console.log('4️⃣ Starting setInterval...');
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      console.log(`   🔄 Interval tick: ${counter}`);
      if (counter >= 3) {
        clearInterval(intervalId);
        console.log('   🛑 Interval cleared');
      }
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ==========================================
// 2. RUNNING OUTSIDE NgZone
// ==========================================

@Component({
  selector: 'app-zone-performance',
  template: `
    <div style="border: 2px solid #17a2b8; padding: 20px; margin: 20px 0;">
      <h3>🚀 NgZone Performance Optimization</h3>
      
      <div>
        <h4>High-frequency operations:</h4>
        <p>Mouse position: ({{ mouseX }}, {{ mouseY }})</p>
        <p>Animation frame: {{ animationFrame }}</p>
        <p>Heavy computation result: {{ computationResult }}</p>
      </div>

      <div>
        <button (click)="startMouseTracking()">Start Mouse Tracking (Inside Zone)</button>
        <button (click)="startMouseTrackingOutside()">Start Mouse Tracking (Outside Zone)</button>
        <button (click)="stopMouseTracking()">Stop Mouse Tracking</button>
      </div>

      <div>
        <button (click)="startAnimation()">Start Animation (Inside Zone)</button>
        <button (click)="startAnimationOutside()">Start Animation (Outside Zone)</button>
        <button (click)="stopAnimation()">Stop Animation</button>
      </div>

      <div>
        <button (click)="runHeavyComputation()">Heavy Computation (Inside Zone)</button>
        <button (click)="runHeavyComputationOutside()">Heavy Computation (Outside Zone)</button>
      </div>

      <div style="background: #fff3cd; padding: 15px; margin: 15px 0;">
        <h4>🔍 Performance Analysis:</h4>
        <p><strong>Inside Zone:</strong> Every operation triggers change detection</p>
        <p><strong>Outside Zone:</strong> No change detection triggered, manual update needed</p>
        <p><strong>Change Detection Count:</strong> {{ changeDetectionCount }}</p>
      </div>
    </div>
  `
})
export class ZonePerformanceComponent implements OnInit, OnDestroy {
  mouseX = 0;
  mouseY = 0;
  animationFrame = 0;
  computationResult = 0;
  changeDetectionCount = 0;

  private destroy$ = new Subject<void>();
  private mouseSubscription?: () => void;
  private animationId?: number;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Count change detection cycles
    this.ngZone.onMicrotaskEmpty.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.changeDetectionCount++;
    });
  }

  // ✅ Mouse tracking INSIDE zone - triggers change detection on every move
  startMouseTracking() {
    console.log('🖱️ Starting mouse tracking INSIDE zone');
    this.stopMouseTracking();
    
    const mouseMoveHandler = (event: MouseEvent) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      // This will trigger change detection on EVERY mouse move!
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    this.mouseSubscription = () => document.removeEventListener('mousemove', mouseMoveHandler);
  }

  // 🚀 Mouse tracking OUTSIDE zone - no change detection, better performance
  startMouseTrackingOutside() {
    console.log('🖱️ Starting mouse tracking OUTSIDE zone');
    this.stopMouseTracking();
    
    this.ngZone.runOutsideAngular(() => {
      const mouseMoveHandler = (event: MouseEvent) => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        
        // Manually trigger change detection only occasionally
        if (event.clientX % 50 === 0) { // Every 50px movement
          this.ngZone.run(() => {
            // This will update the UI
          });
        }
      };
      
      document.addEventListener('mousemove', mouseMoveHandler);
      this.mouseSubscription = () => document.removeEventListener('mousemove', mouseMoveHandler);
    });
  }

  stopMouseTracking() {
    if (this.mouseSubscription) {
      this.mouseSubscription();
      this.mouseSubscription = undefined;
    }
  }

  // ✅ Animation INSIDE zone - triggers change detection on every frame
  startAnimation() {
    console.log('🎬 Starting animation INSIDE zone');
    this.stopAnimation();
    
    const animate = () => {
      this.animationFrame++;
      this.animationId = requestAnimationFrame(animate);
      // This will trigger change detection 60 times per second!
    };
    
    animate();
  }

  // 🚀 Animation OUTSIDE zone - better performance
  startAnimationOutside() {
    console.log('🎬 Starting animation OUTSIDE zone');
    this.stopAnimation();
    
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationFrame++;
        
        // Update UI only every 10 frames
        if (this.animationFrame % 10 === 0) {
          this.ngZone.run(() => {
            // Triggers change detection only every 10 frames
          });
        }
        
        this.animationId = requestAnimationFrame(animate);
      };
      
      animate();
    });
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }

  // ✅ Heavy computation INSIDE zone
  runHeavyComputation() {
    console.log('💻 Running heavy computation INSIDE zone');
    console.time('Heavy Computation Inside Zone');
    
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    this.computationResult = Math.round(result);
    
    console.timeEnd('Heavy Computation Inside Zone');
    // Change detection will run after this completes
  }

  // 🚀 Heavy computation OUTSIDE zone
  runHeavyComputationOutside() {
    console.log('💻 Running heavy computation OUTSIDE zone');
    console.time('Heavy Computation Outside Zone');
    
    this.ngZone.runOutsideAngular(() => {
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
      }
      
      // Manually trigger change detection when done
      this.ngZone.run(() => {
        this.computationResult = Math.round(result);
      });
    });
    
    console.timeEnd('Heavy Computation Outside Zone');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopMouseTracking();
    this.stopAnimation();
  }
}

// ==========================================
// 3. NgZone API METHODS DEMONSTRATION
// ==========================================

@Component({
  selector: 'app-zone-api',
  template: `
    <div style="border: 2px solid #28a745; padding: 20px; margin: 20px 0;">
      <h3>🛠️ NgZone API Methods</h3>
      
      <div>
        <h4>Zone Status:</h4>
        <p>Is in Angular Zone: {{ isInAngularZone }}</p>
        <p>Has pending macrotasks: {{ hasPendingMacrotasks }}</p>
        <p>Has pending microtasks: {{ hasPendingMicrotasks }}</p>
      </div>

      <div>
        <button (click)="runInsideZone()">run() - Execute inside zone</button>
        <button (click)="runOutsideZone()">runOutsideAngular() - Execute outside zone</button>
        <button (click)="runGuarded()">runGuarded() - Execute with error handling</button>
        <button (click)="runTask()">runTask() - Execute as task</button>
      </div>

      <div>
        <p>Counter (will update): {{ counter }}</p>
        <p>Outside counter (won't update): {{ outsideCounter }}</p>
      </div>

      <div style="background: #d4edda; padding: 15px; margin: 15px 0;">
        <h4>📊 Method Explanations:</h4>
        <ul>
          <li><strong>run():</strong> Execute inside Angular zone, triggers change detection</li>
          <li><strong>runOutsideAngular():</strong> Execute outside zone, no change detection</li>
          <li><strong>runGuarded():</strong> Execute with automatic error handling</li>
          <li><strong>runTask():</strong> Execute as a task with lifecycle hooks</li>
        </ul>
      </div>
    </div>
  `
})
export class ZoneApiComponent implements OnInit {
  counter = 0;
  outsideCounter = 0;
  isInAngularZone = false;
  hasPendingMacrotasks = false;
  hasPendingMicrotasks = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.updateZoneStatus();
    
    // Monitor zone status changes
    setInterval(() => {
      this.updateZoneStatus();
    }, 1000);
  }

  updateZoneStatus() {
    this.isInAngularZone = NgZone.isInAngularZone();
    this.hasPendingMacrotasks = this.ngZone.hasPendingMacrotasks;
    this.hasPendingMicrotasks = this.ngZone.hasPendingMicrotasks;
  }

  // 1. ngZone.run() - Execute inside Angular zone
  runInsideZone() {
    console.log('🏃 Executing inside Angular zone...');
    
    this.ngZone.run(() => {
      console.log('   🔍 Inside zone:', NgZone.isInAngularZone());
      
      setTimeout(() => {
        this.counter++;
        console.log('   ✅ Counter updated inside zone, change detection will trigger');
      }, 1000);
    });
  }

  // 2. ngZone.runOutsideAngular() - Execute outside Angular zone
  runOutsideZone() {
    console.log('🚫 Executing outside Angular zone...');
    
    this.ngZone.runOutsideAngular(() => {
      console.log('   🔍 Inside zone:', NgZone.isInAngularZone());
      
      setTimeout(() => {
        this.outsideCounter++;
        console.log('   ⚠️ Outside counter updated, but UI won\'t update automatically');
        
        // Need to manually trigger change detection
        this.ngZone.run(() => {
          console.log('   ✅ Manually triggered change detection');
        });
      }, 1000);
    });
  }

  // 3. ngZone.runGuarded() - Execute with error handling
  runGuarded() {
    console.log('🛡️ Executing with error handling...');
    
    this.ngZone.runGuarded(() => {
      console.log('   🔍 Inside guarded zone:', NgZone.isInAngularZone());
      
      // This error will be caught by NgZone's error handling
      setTimeout(() => {
        if (Math.random() > 0.5) {
          throw new Error('Simulated error in guarded zone');
        } else {
          this.counter++;
          console.log('   ✅ Guarded operation completed successfully');
        }
      }, 500);
    });
  }

  // 4. ngZone.runTask() - Execute as a task
  runTask() {
    console.log('📋 Executing as a task...');
    
    this.ngZone.runTask(() => {
      console.log('   🔍 Inside task zone:', NgZone.isInAngularZone());
      
      return new Promise(resolve => {
        setTimeout(() => {
          this.counter++;
          console.log('   ✅ Task completed');
          resolve(this.counter);
        }, 1000);
      });
    }).then(result => {
      console.log('   🎯 Task result:', result);
    });
  }
}

// ==========================================
// 4. MAIN DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-ngzone-demo',
  template: `
    <div>
      <h1>🌐 NgZone Deep Dive Demonstration</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>🔍 What is NgZone?</h2>
        <p>NgZone is Angular's wrapper around Zone.js that:</p>
        <ul>
          <li>Patches async APIs (setTimeout, Promise, events, etc.)</li>
          <li>Detects when async operations complete</li>
          <li>Triggers change detection automatically</li>
          <li>Provides control over when change detection runs</li>
        </ul>
      </div>

      <button (click)="demonstrateAsyncOperations()">
        🚀 Demonstrate Async Operations
      </button>

      <app-zone-performance></app-zone-performance>
      <app-zone-api></app-zone-api>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
        <h2>🎯 Key NgZone Concepts:</h2>
        
        <h3>1. Automatic Change Detection</h3>
        <pre><code>// Zone.js patches these APIs:
setTimeout(() => { /* change detection triggered */ });
element.addEventListener('click', () => { /* change detection triggered */ });
fetch('/api').then(() => { /* change detection triggered */ });</code></pre>

        <h3>2. Performance Optimization</h3>
        <pre><code>// Run outside zone for performance
ngZone.runOutsideAngular(() => {
  // High-frequency operations
  setInterval(() => { /* no change detection */ }, 16);
});</code></pre>

        <h3>3. Manual Control</h3>
        <pre><code>// Manually trigger change detection
ngZone.run(() => {
  // This will trigger change detection
});</code></pre>
      </div>
    </div>
  `
})
export class NgZoneDemoComponent {
  constructor(
    private ngZoneAnalysis: NgZoneAnalysisService
  ) {}

  demonstrateAsyncOperations() {
    this.ngZoneAnalysis.demonstrateAsyncOperations();
  }
}

/*
==========================================
NgZone INTERNAL ARCHITECTURE
==========================================

1. **Zone.js Foundation:**
   - Monkey-patches async APIs
   - Creates execution contexts
   - Tracks async operation lifecycle

2. **NgZone Layer:**
   - Extends Zone.js functionality
   - Adds Angular-specific behavior
   - Manages change detection triggering

3. **Patched APIs:**
   - setTimeout/setInterval
   - Promise/async-await
   - EventTarget.addEventListener
   - XMLHttpRequest/fetch
   - MutationObserver
   - requestAnimationFrame

4. **Zone States:**
   - **Stable:** No pending async operations
   - **Unstable:** Has pending async operations
   - **Error:** An error occurred in the zone

==========================================
PERFORMANCE CONSIDERATIONS
==========================================

✅ **Use runOutsideAngular() for:**
- High-frequency events (mouse move, scroll)
- Animation loops
- Heavy computations
- Third-party library integrations

❌ **Don't use runOutsideAngular() for:**
- User interactions that need UI updates
- API calls that update component state
- Operations that are infrequent

⚡ **Performance Tips:**
1. Batch DOM updates
2. Use OnPush change detection strategy
3. Debounce high-frequency events
4. Use runOutsideAngular() for animations
5. Consider using Web Workers for heavy tasks

==========================================
DEBUGGING NgZone ISSUES
==========================================

🔍 **Common Issues:**
1. **UI not updating:** Code running outside zone
2. **Performance problems:** Too many change detection cycles
3. **Memory leaks:** Forgetting to clean up outside-zone operations

🛠️ **Debugging Tools:**
- ngZone.onStable/onUnstable subscriptions
- Angular DevTools
- Performance profiler
- Console logging in zone callbacks

💡 **Best Practices:**
1. Understand when change detection runs
2. Use runOutsideAngular() for performance-critical code
3. Always clean up subscriptions and timers
4. Test both inside and outside zone scenarios
5. Monitor change detection frequency in development
*/
