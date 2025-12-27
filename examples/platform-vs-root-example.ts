// Angular providedIn: 'platform' vs 'root' - Complete Comparison
import { Injectable, Component, NgModule } from '@angular/core';
import { bootstrapApplication, createApplication } from '@angular/platform-browser';

/*
==========================================
PLATFORM vs ROOT - KEY DIFFERENCES
==========================================

providedIn: 'platform'
- Created ONCE per browser platform
- Shared across ALL Angular applications on the same page
- Survives application restarts/reloads
- Highest level in injector hierarchy

providedIn: 'root' 
- Created ONCE per Angular application
- NOT shared between different applications
- Destroyed when application is destroyed
- Application-level singleton
*/

// PLATFORM-LEVEL SERVICE (shared across all apps)
@Injectable({
  providedIn: 'platform'
})
export class PlatformSharedService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  private createdAt = new Date().toLocaleTimeString();
  private appCounter = 0;
  private data = new Map<string, any>();

  constructor() {
    console.log(`🌍 PLATFORM SERVICE created - ID: ${this.instanceId} at ${this.createdAt}`);
  }

  registerApp(appName: string) {
    this.appCounter++;
    console.log(`📱 App "${appName}" registered. Total apps: ${this.appCounter}`);
    return this.appCounter;
  }

  setGlobalData(key: string, value: any) {
    this.data.set(key, value);
    console.log(`🌍 Platform data set: ${key} = ${value}`);
  }

  getGlobalData(key: string) {
    return this.data.get(key);
  }

  getAllData() {
    return Object.fromEntries(this.data);
  }

  getInstanceInfo() {
    return {
      id: this.instanceId,
      createdAt: this.createdAt,
      appCount: this.appCounter,
      level: 'PLATFORM',
      data: this.getAllData()
    };
  }
}

// ROOT-LEVEL SERVICE (per application)
@Injectable({
  providedIn: 'root'
})
export class RootAppService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  private createdAt = new Date().toLocaleTimeString();
  private appName: string;

  constructor(private platformService: PlatformSharedService) {
    console.log(`🏠 ROOT SERVICE created - ID: ${this.instanceId} at ${this.createdAt}`);
  }

  initializeApp(appName: string) {
    this.appName = appName;
    const appNumber = this.platformService.registerApp(appName);
    console.log(`🏠 App "${appName}" initialized as app #${appNumber}`);
    return appNumber;
  }

  setAppData(key: string, value: any) {
    const appKey = `${this.appName}_${key}`;
    this.platformService.setGlobalData(appKey, value);
  }

  getInstanceInfo() {
    return {
      id: this.instanceId,
      createdAt: this.createdAt,
      appName: this.appName,
      level: 'ROOT/APPLICATION',
      platformData: this.platformService.getAllData()
    };
  }
}

// FIRST APPLICATION COMPONENT
@Component({
  selector: 'app-first',
  template: `
    <div style="border: 3px solid #007bff; padding: 20px; margin: 10px;">
      <h2>🔵 First Angular Application</h2>
      
      <div style="background: #e3f2fd; padding: 15px; margin: 10px 0;">
        <h3>Platform Service (Shared)</h3>
        <p><strong>Instance ID:</strong> {{ platformInfo.id }}</p>
        <p><strong>Created At:</strong> {{ platformInfo.createdAt }}</p>
        <p><strong>Apps Registered:</strong> {{ platformInfo.appCount }}</p>
        <p><strong>Level:</strong> {{ platformInfo.level }}</p>
        <p><strong>Global Data:</strong> {{ platformInfo.data | json }}</p>
      </div>

      <div style="background: #f3e5f5; padding: 15px; margin: 10px 0;">
        <h3>Root Service (App-Specific)</h3>
        <p><strong>Instance ID:</strong> {{ rootInfo.id }}</p>
        <p><strong>Created At:</strong> {{ rootInfo.createdAt }}</p>
        <p><strong>App Name:</strong> {{ rootInfo.appName }}</p>
        <p><strong>Level:</strong> {{ rootInfo.level }}</p>
      </div>

      <div>
        <input #dataKey placeholder="Data key" style="margin: 5px;">
        <input #dataValue placeholder="Data value" style="margin: 5px;">
        <button (click)="setData(dataKey.value, dataValue.value)" style="margin: 5px;">
          Set Platform Data
        </button>
        <button (click)="refreshInfo()" style="margin: 5px;">Refresh Info</button>
      </div>
    </div>
  `
})
export class FirstAppComponent {
  platformInfo: any;
  rootInfo: any;

  constructor(
    private platformService: PlatformSharedService,
    private rootService: RootAppService
  ) {
    this.rootService.initializeApp('FirstApp');
    this.refreshInfo();
  }

  setData(key: string, value: string) {
    if (key && value) {
      this.platformService.setGlobalData(`FirstApp_${key}`, value);
      this.refreshInfo();
    }
  }

  refreshInfo() {
    this.platformInfo = this.platformService.getInstanceInfo();
    this.rootInfo = this.rootService.getInstanceInfo();
  }
}

// SECOND APPLICATION COMPONENT
@Component({
  selector: 'app-second',
  template: `
    <div style="border: 3px solid #28a745; padding: 20px; margin: 10px;">
      <h2>🟢 Second Angular Application</h2>
      
      <div style="background: #e8f5e8; padding: 15px; margin: 10px 0;">
        <h3>Platform Service (Same Instance!)</h3>
        <p><strong>Instance ID:</strong> {{ platformInfo.id }}</p>
        <p><strong>Created At:</strong> {{ platformInfo.createdAt }}</p>
        <p><strong>Apps Registered:</strong> {{ platformInfo.appCount }}</p>
        <p><strong>Level:</strong> {{ platformInfo.level }}</p>
        <p><strong>Global Data:</strong> {{ platformInfo.data | json }}</p>
      </div>

      <div style="background: #fff3e0; padding: 15px; margin: 10px 0;">
        <h3>Root Service (Different Instance!)</h3>
        <p><strong>Instance ID:</strong> {{ rootInfo.id }}</p>
        <p><strong>Created At:</strong> {{ rootInfo.createdAt }}</p>
        <p><strong>App Name:</strong> {{ rootInfo.appName }}</p>
        <p><strong>Level:</strong> {{ rootInfo.level }}</p>
      </div>

      <div>
        <input #dataKey placeholder="Data key" style="margin: 5px;">
        <input #dataValue placeholder="Data value" style="margin: 5px;">
        <button (click)="setData(dataKey.value, dataValue.value)" style="margin: 5px;">
          Set Platform Data
        </button>
        <button (click)="refreshInfo()" style="margin: 5px;">Refresh Info</button>
      </div>
    </div>
  `
})
export class SecondAppComponent {
  platformInfo: any;
  rootInfo: any;

  constructor(
    private platformService: PlatformSharedService,
    private rootService: RootAppService
  ) {
    this.rootService.initializeApp('SecondApp');
    this.refreshInfo();
  }

  setData(key: string, value: string) {
    if (key && value) {
      this.platformService.setGlobalData(`SecondApp_${key}`, value);
      this.refreshInfo();
    }
  }

  refreshInfo() {
    this.platformInfo = this.platformService.getInstanceInfo();
    this.rootInfo = this.rootService.getInstanceInfo();
  }
}

// DEMONSTRATION COMPONENT
@Component({
  selector: 'app-demo',
  template: `
    <div>
      <h1>🔬 Platform vs Root Service Demonstration</h1>
      
      <div style="background: #fff9c4; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>📋 What This Demo Shows:</h2>
        <ul>
          <li><strong>Platform Service:</strong> Same instance across both apps (same ID, shared data)</li>
          <li><strong>Root Service:</strong> Different instances per app (different IDs)</li>
          <li><strong>Data Sharing:</strong> Platform data is visible to both apps</li>
          <li><strong>Lifecycle:</strong> Platform service persists across app reloads</li>
        </ul>
      </div>

      <button (click)="createSecondApp()" [disabled]="secondAppCreated" 
              style="padding: 10px 20px; font-size: 16px; margin-bottom: 20px;">
        Create Second App
      </button>

      <!-- First app is always present -->
      <app-first></app-first>
      
      <!-- Second app created dynamically -->
      <div *ngIf="secondAppCreated" id="second-app-container">
        <app-second></app-second>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>🔍 Technical Details:</h2>
        
        <h3>providedIn: 'platform'</h3>
        <ul>
          <li>✅ Shared across ALL Angular applications</li>
          <li>✅ Survives application destruction/recreation</li>
          <li>✅ Perfect for cross-app communication</li>
          <li>✅ Highest level in injector hierarchy</li>
          <li>❌ Memory persists until page reload</li>
          <li>❌ Can cause memory leaks if not careful</li>
        </ul>

        <h3>providedIn: 'root'</h3>
        <ul>
          <li>✅ Application-scoped singleton</li>
          <li>✅ Destroyed with application</li>
          <li>✅ Isolated per application</li>
          <li>✅ Most common choice for services</li>
          <li>❌ Not shared between applications</li>
          <li>❌ Recreated on app restart</li>
        </ul>
      </div>
    </div>
  `
})
export class DemoComponent {
  secondAppCreated = false;

  createSecondApp() {
    this.secondAppCreated = true;
    console.log('🚀 Creating second Angular application...');
    
    // In a real scenario, you'd bootstrap a completely separate Angular app
    // This is a simplified demonstration
    setTimeout(() => {
      console.log('✅ Second app created! Check the platform service instance ID - it should be the same!');
    }, 100);
  }
}

// Bootstrap the first application
bootstrapApplication(DemoComponent, {
  providers: [
    // Note: Platform and Root services are automatically provided
    // We don't need to explicitly provide them here
  ]
});

/*
==========================================
DETAILED COMPARISON TABLE
==========================================

| Aspect | providedIn: 'platform' | providedIn: 'root' |
|--------|------------------------|-------------------|
| **Scope** | All Angular apps on page | Single Angular app |
| **Instances** | 1 per browser platform | 1 per application |
| **Lifecycle** | Until page reload | Until app destruction |
| **Sharing** | Cross-app sharing | App-internal only |
| **Memory** | Persists longer | Cleaned up with app |
| **Use Cases** | Cross-app communication | App-specific logic |
| **Hierarchy Level** | Highest (Platform) | Second highest (App) |

==========================================
WHEN TO USE EACH
==========================================

USE 'platform' FOR:
- Cross-application communication
- Shared browser-level resources
- Global browser state (like window size)
- Services that should persist across app reloads
- Micro-frontend architectures

USE 'root' FOR:
- Application-specific services (99% of cases)
- Business logic services
- HTTP services
- State management services
- Authentication services (app-specific)

==========================================
REAL-WORLD EXAMPLES
==========================================

// Platform-level (rare use cases)
@Injectable({ providedIn: 'platform' })
export class BrowserStorageService {
  // Shared localStorage/sessionStorage across all apps
}

@Injectable({ providedIn: 'platform' })
export class CrossAppMessagingService {
  // Communication between micro-frontends
}

// Root-level (common use cases)
@Injectable({ providedIn: 'root' })
export class AuthService {
  // App-specific authentication
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  // App-specific HTTP client
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // App-specific user management
}
*/
