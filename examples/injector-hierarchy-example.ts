// Angular Injector Hierarchy Example
import { Injectable, Component, NgModule, Injector } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// 1. Platform-level service (highest level)
@Injectable({
  providedIn: 'platform'
})
export class PlatformService {
  constructor() {
    console.log('PlatformService created - shared across all apps');
  }
  
  getPlatformInfo() {
    return 'Platform-wide service instance';
  }
}

// 2. Root/Application-level service
@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor() {
    console.log('AppService created - app singleton');
  }
  
  getAppInfo() {
    return 'Application-wide singleton service';
  }
}

// 3. Module-level service (for lazy-loaded modules)
@Injectable()
export class ModuleService {
  constructor() {
    console.log('ModuleService created - module scoped');
  }
  
  getModuleInfo() {
    return 'Module-scoped service instance';
  }
}

// 4. Component-level service
@Injectable()
export class ComponentService {
  private instanceId = Math.random().toString(36).substr(2, 9);
  
  constructor() {
    console.log(`ComponentService created - instance ${this.instanceId}`);
  }
  
  getComponentInfo() {
    return `Component-scoped service instance: ${this.instanceId}`;
  }
}

// Parent Component with its own injector
@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h2>Parent Component</h2>
      <p>Platform Service: {{ platformInfo }}</p>
      <p>App Service: {{ appInfo }}</p>
      <p>Component Service: {{ componentInfo }}</p>
      <button (click)="showInjectorHierarchy()">Show Injector Hierarchy</button>
      
      <app-child></app-child>
      <app-child></app-child>
    </div>
  `,
  providers: [
    ComponentService, // This creates a new injector for this component
    ModuleService
  ]
})
export class ParentComponent {
  platformInfo: string;
  appInfo: string;
  componentInfo: string;

  constructor(
    private platformService: PlatformService,
    private appService: AppService,
    private componentService: ComponentService,
    private injector: Injector
  ) {
    this.platformInfo = this.platformService.getPlatformInfo();
    this.appInfo = this.appService.getAppInfo();
    this.componentInfo = this.componentService.getComponentInfo();
  }

  showInjectorHierarchy() {
    console.log('=== Injector Hierarchy Demo ===');
    
    // Show current injector
    console.log('Current injector:', this.injector);
    
    // Show parent injector
    const parentInjector = this.injector.get(Injector, null, { skipSelf: true });
    console.log('Parent injector:', parentInjector);
    
    // Try to get services from different levels
    console.log('Platform service from current injector:', 
      this.injector.get(PlatformService));
    console.log('App service from current injector:', 
      this.injector.get(AppService));
    console.log('Component service from current injector:', 
      this.injector.get(ComponentService));
  }
}

// Child Component that inherits from parent's injector
@Component({
  selector: 'app-child',
  template: `
    <div style="margin-left: 20px; border-left: 2px solid #ccc; padding-left: 10px;">
      <h3>Child Component</h3>
      <p>Platform Service: {{ platformInfo }}</p>
      <p>App Service: {{ appInfo }}</p>
      <p>Component Service (inherited): {{ componentInfo }}</p>
      <p>Child Service: {{ childInfo }}</p>
    </div>
  `,
  providers: [
    // Child has its own ComponentService, but inherits ModuleService from parent
    { provide: ComponentService, useClass: ComponentService }
  ]
})
export class ChildComponent {
  platformInfo: string;
  appInfo: string;
  componentInfo: string;
  childInfo: string;

  constructor(
    private platformService: PlatformService,
    private appService: AppService,
    private componentService: ComponentService,
    private moduleService: ModuleService // This comes from parent's injector
  ) {
    this.platformInfo = this.platformService.getPlatformInfo();
    this.appInfo = this.appService.getAppInfo();
    this.componentInfo = this.componentService.getComponentInfo();
    this.childInfo = `Child uses parent's ModuleService: ${this.moduleService.getModuleInfo()}`;
  }
}

// Lazy-loaded module example
@NgModule({
  declarations: [ParentComponent, ChildComponent],
  providers: [
    ModuleService // Module-level provider
  ]
})
export class FeatureModule {}

// Root App Component
@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Angular Injector Hierarchy Example</h1>
      <app-parent></app-parent>
      
      <hr>
      <h2>Injector Resolution Rules:</h2>
      <ul>
        <li>Angular starts looking for a service in the current component's injector</li>
        <li>If not found, it moves up to the parent component's injector</li>
        <li>Continues up the component tree to module injectors</li>
        <li>Finally checks the root/application injector</li>
        <li>Lastly checks the platform injector</li>
        <li>Throws an error if service is not found anywhere</li>
      </ul>
    </div>
  `
})
export class AppComponent {}

// Bootstrap the application
bootstrapApplication(AppComponent, {
  providers: [
    // Application-level providers
    AppService,
    PlatformService
  ]
});

/*
INJECTOR HIERARCHY EXPLANATION:

1. **Platform Injector** (highest level)
   - Created once per platform
   - Shared across multiple Angular applications
   - Services: PlatformService (providedIn: 'platform')

2. **Application Injector** (app-wide)
   - Created once per application
   - Contains app-wide singletons
   - Services: AppService (providedIn: 'root')

3. **Module Injectors** (lazy-loaded modules)
   - Created for each lazy-loaded module
   - Services: ModuleService (provided in module)

4. **Component Injectors** (component-specific)
   - Created for each component that has providers
   - Services: ComponentService (provided in component)

RESOLUTION PROCESS:
When Angular needs to inject a service, it follows this hierarchy:
Component Injector → Parent Component Injector → Module Injector → App Injector → Platform Injector

KEY POINTS:
- Services are singletons within their injector scope
- Child components inherit from parent injectors
- You can override services at any level
- Use @SkipSelf() to skip the current injector level
- Use @Self() to only look in the current injector level
- Use @Optional() to make injection optional
*/
