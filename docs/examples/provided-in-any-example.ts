// Angular providedIn: 'any' Explanation and Examples
import { Injectable, NgModule, Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

/*
==========================================
providedIn: 'any' EXPLANATION
==========================================

The 'any' option creates a separate instance of the service in:
- The root injector (if no lazy-loaded modules exist)
- Each lazy-loaded module's injector (if lazy-loaded modules exist)

This is different from:
- 'root': Always creates ONE singleton instance in the root injector
- 'platform': Creates ONE singleton instance in the platform injector
- null/undefined: Must be explicitly provided in modules/components

KEY BEHAVIOR:
- If there are NO lazy-loaded modules → behaves like 'root' (single instance)
- If there ARE lazy-loaded modules → creates separate instances per lazy module
*/

// Example service using providedIn: 'any'
@Injectable({
  providedIn: 'any'
})
export class AnyProviderService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  private createdAt = new Date().toLocaleTimeString();

  constructor() {
    console.log(`🔵 AnyProviderService created - ID: ${this.instanceId} at ${this.createdAt}`);
  }

  getInstanceInfo() {
    return {
      id: this.instanceId,
      createdAt: this.createdAt,
      message: 'Service with providedIn: any'
    };
  }

  logAccess(from: string) {
    console.log(`📍 AnyProviderService (${this.instanceId}) accessed from: ${from}`);
  }
}

// Comparison service using providedIn: 'root'
@Injectable({
  providedIn: 'root'
})
export class RootProviderService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  private createdAt = new Date().toLocaleTimeString();

  constructor() {
    console.log(`🟢 RootProviderService created - ID: ${this.instanceId} at ${this.createdAt}`);
  }

  getInstanceInfo() {
    return {
      id: this.instanceId,
      createdAt: this.createdAt,
      message: 'Service with providedIn: root (always singleton)'
    };
  }

  logAccess(from: string) {
    console.log(`📍 RootProviderService (${this.instanceId}) accessed from: ${from}`);
  }
}

// Main App Component
@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>providedIn: 'any' vs 'root' Demo</h1>
      
      <div style="background: #f0f0f0; padding: 15px; margin: 10px 0;">
        <h3>Main App Services:</h3>
        <p><strong>Any Provider Service:</strong> {{ anyServiceInfo.message }}</p>
        <p>Instance ID: {{ anyServiceInfo.id }}</p>
        <p>Created at: {{ anyServiceInfo.createdAt }}</p>
        
        <p><strong>Root Provider Service:</strong> {{ rootServiceInfo.message }}</p>
        <p>Instance ID: {{ rootServiceInfo.id }}</p>
        <p>Created at: {{ rootServiceInfo.createdAt }}</p>
      </div>

      <button (click)="loadLazyModule()" [disabled]="lazyModuleLoaded">
        Load Lazy Module
      </button>
      
      <div *ngIf="lazyModuleLoaded" id="lazy-content">
        <!-- Lazy module content will be inserted here -->
      </div>

      <div style="background: #e8f4f8; padding: 15px; margin: 20px 0;">
        <h3>📚 Understanding providedIn: 'any'</h3>
        <ul>
          <li><strong>No lazy modules:</strong> Behaves like 'root' - single instance</li>
          <li><strong>With lazy modules:</strong> Creates separate instances per lazy module</li>
          <li><strong>Use case:</strong> When you need different instances for different feature modules</li>
          <li><strong>Memory consideration:</strong> More instances = more memory usage</li>
        </ul>
      </div>
    </div>
  `
})
export class AppComponent {
  anyServiceInfo: any;
  rootServiceInfo: any;
  lazyModuleLoaded = false;

  constructor(
    private anyService: AnyProviderService,
    private rootService: RootProviderService
  ) {
    this.anyService.logAccess('Main App Component');
    this.rootService.logAccess('Main App Component');
    
    this.anyServiceInfo = this.anyService.getInstanceInfo();
    this.rootServiceInfo = this.rootService.getInstanceInfo();
  }

  async loadLazyModule() {
    try {
      // Simulate lazy loading a module
      const { LazyFeatureModule } = await import('./lazy-feature.module');
      console.log('🚀 Lazy module loaded!');
      this.lazyModuleLoaded = true;
      
      // Create lazy component manually (in real app, this would be done by router)
      this.createLazyComponent();
    } catch (error) {
      console.error('Failed to load lazy module:', error);
    }
  }

  private createLazyComponent() {
    // This is a simplified demonstration
    // In real applications, lazy loading happens through routing
    const lazyContent = document.getElementById('lazy-content');
    if (lazyContent) {
      lazyContent.innerHTML = `
        <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border: 1px solid #ffeaa7;">
          <h3>🔄 Lazy Loaded Module Content</h3>
          <p>Check the console to see if new service instances were created!</p>
          <p><em>In a real app, this would be a proper Angular component from the lazy module.</em></p>
        </div>
      `;
    }
  }
}

// Lazy-loaded module (separate file in real application)
@Component({
  selector: 'app-lazy-feature',
  template: `
    <div>
      <h3>Lazy Feature Component</h3>
      <p>Any Service ID: {{ anyServiceInfo.id }}</p>
      <p>Root Service ID: {{ rootServiceInfo.id }}</p>
    </div>
  `
})
export class LazyFeatureComponent {
  anyServiceInfo: any;
  rootServiceInfo: any;

  constructor(
    private anyService: AnyProviderService,
    private rootService: RootProviderService
  ) {
    this.anyService.logAccess('Lazy Feature Component');
    this.rootService.logAccess('Lazy Feature Component');
    
    this.anyServiceInfo = this.anyService.getInstanceInfo();
    this.rootServiceInfo = this.rootService.getInstanceInfo();
  }
}

@NgModule({
  declarations: [LazyFeatureComponent],
  exports: [LazyFeatureComponent]
})
export class LazyFeatureModule {}

// Bootstrap the application
bootstrapApplication(AppComponent);

/*
==========================================
DETAILED EXPLANATION OF providedIn: 'any'
==========================================

1. **Basic Behavior:**
   - Creates a service instance in each injector that needs it
   - Different from 'root' which creates only ONE instance

2. **Without Lazy Modules:**
   ```typescript
   @Injectable({ providedIn: 'any' })
   class MyService {} 
   // Behaves exactly like providedIn: 'root'
   // Creates single instance in root injector
   ```

3. **With Lazy Modules:**
   ```typescript
   @Injectable({ providedIn: 'any' })
   class MyService {}
   // Creates separate instance for each lazy-loaded module
   // Root app gets one instance
   // Each lazy module gets its own instance
   ```

4. **Memory Implications:**
   - More instances = more memory usage
   - Each lazy module holds its own service state
   - Useful for feature-specific configurations

5. **Use Cases:**
   - Feature-specific configurations
   - When you need isolated service state per module
   - Analytics services that need per-module tracking
   - Caching services with module-specific data

6. **Comparison Table:**
   
   | providedIn | Instances Created | Shared Across |
   |------------|------------------|---------------|
   | 'root'     | 1 singleton      | Entire app    |
   | 'platform' | 1 singleton      | All apps      |
   | 'any'      | 1 per injector   | Per module    |
   | null       | Manual provision | Depends on provider |

7. **Real-World Example:**
   ```typescript
   @Injectable({ providedIn: 'any' })
   export class FeatureConfigService {
     private config = new Map();
     
     setFeatureConfig(key: string, value: any) {
       this.config.set(key, value);
     }
     
     getFeatureConfig(key: string) {
       return this.config.get(key);
     }
   }
   
   // Each lazy module gets its own config instance
   // No interference between modules
   ```

8. **Testing Considerations:**
   - Each test module might get separate instances
   - Need to consider this in unit tests
   - May need to provide mock instances differently
*/
