// Angular Parameter Decorators: @Optional and @Self - Complete Guide
import { Injectable, Component, Optional, Self, SkipSelf, Host, Inject, InjectionToken } from '@angular/core';

/*
==========================================
PARAMETER DECORATORS EXPLAINED
==========================================

Parameter decorators modify how Angular's dependency injection system
resolves dependencies in constructor parameters.

@Optional() - Makes dependency optional (won't throw if not found)
@Self()     - Only look in current injector level
@SkipSelf() - Skip current injector, look in parent injectors
@Host()     - Only look up to the host component's injector
@Inject()   - Explicitly specify what to inject
*/

// ==========================================
// 1. @Optional() DECORATOR
// ==========================================

interface Logger {
  log(message: string): void;
  error(message: string): void;
}

@Injectable()
export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}

// ❌ WITHOUT @Optional - Will throw error if Logger not provided
@Injectable()
export class UserServiceWithoutOptional {
  constructor(
    private logger: Logger // Error: No provider for Logger!
  ) {}
  
  getUser(id: number) {
    this.logger.log(`Getting user ${id}`); // Will crash if logger is null
    return { id, name: 'John' };
  }
}

// ✅ WITH @Optional - Won't throw error if Logger not provided
@Injectable({ providedIn: 'root' })
export class UserServiceWithOptional {
  constructor(
    @Optional() private logger?: Logger // ? makes it optional in TypeScript too
  ) {
    console.log('Logger injected:', !!this.logger);
  }
  
  getUser(id: number) {
    // Safe to call - check if logger exists
    this.logger?.log(`Getting user ${id}`);
    return { id, name: 'John' };
  }
  
  createUser(userData: any) {
    if (this.logger) {
      this.logger.log('Creating new user');
    } else {
      console.log('No logger available, using console.log');
    }
    return { id: Date.now(), ...userData };
  }
}

// ==========================================
// 2. @Self() DECORATOR
// ==========================================

@Injectable()
export class DataService {
  private data = new Map<string, any>();
  private instanceId = Math.random().toString(36).substr(2, 9);
  
  constructor() {
    console.log(`DataService created with ID: ${this.instanceId}`);
  }
  
  set(key: string, value: any) {
    this.data.set(key, value);
  }
  
  get(key: string) {
    return this.data.get(key);
  }
  
  getInstanceId() {
    return this.instanceId;
  }
}

// Component that provides its own DataService
@Component({
  selector: 'app-parent-with-service',
  template: `
    <div style="border: 2px solid #007bff; padding: 15px; margin: 10px;">
      <h3>Parent Component (provides DataService)</h3>
      <p>DataService Instance ID: {{ dataServiceId }}</p>
      <button (click)="setData()">Set Data in Parent</button>
      
      <app-child-with-self></app-child-with-self>
      <app-child-without-self></app-child-without-self>
    </div>
  `,
  providers: [DataService] // Parent provides DataService
})
export class ParentWithServiceComponent {
  dataServiceId: string;
  
  constructor(private dataService: DataService) {
    this.dataServiceId = dataService.getInstanceId();
  }
  
  setData() {
    this.dataService.set('parentData', 'Data from parent');
  }
}

// ❌ Child WITHOUT @Self - Gets DataService from parent injector
@Component({
  selector: 'app-child-without-self',
  template: `
    <div style="border: 1px solid #28a745; padding: 10px; margin: 10px; background: #f8f9fa;">
      <h4>Child WITHOUT @Self</h4>
      <p>DataService Instance ID: {{ dataServiceId }}</p>
      <p>Gets parent's DataService instance</p>
      <button (click)="getData()">Get Parent Data</button>
      <p *ngIf="retrievedData">Retrieved: {{ retrievedData }}</p>
    </div>
  `
})
export class ChildWithoutSelfComponent {
  dataServiceId: string;
  retrievedData: string = '';
  
  constructor(
    private dataService: DataService // Gets parent's DataService
  ) {
    this.dataServiceId = dataService.getInstanceId();
  }
  
  getData() {
    this.retrievedData = this.dataService.get('parentData') || 'No data found';
  }
}

// ✅ Child WITH @Self - Only looks in its own injector
@Component({
  selector: 'app-child-with-self',
  template: `
    <div style="border: 1px solid #dc3545; padding: 10px; margin: 10px; background: #f8f9fa;">
      <h4>Child WITH @Self</h4>
      <p>DataService Instance ID: {{ dataServiceId }}</p>
      <p>Has its own DataService instance</p>
      <button (click)="setOwnData()">Set Own Data</button>
      <button (click)="getOwnData()">Get Own Data</button>
      <p *ngIf="retrievedData">Retrieved: {{ retrievedData }}</p>
    </div>
  `,
  providers: [DataService] // Child provides its own DataService
})
export class ChildWithSelfComponent {
  dataServiceId: string;
  retrievedData: string = '';
  
  constructor(
    @Self() private dataService: DataService // Only looks in own injector
  ) {
    this.dataServiceId = dataService.getInstanceId();
  }
  
  setOwnData() {
    this.dataService.set('childData', 'Data from child');
  }
  
  getOwnData() {
    this.retrievedData = this.dataService.get('childData') || 'No data found';
  }
}

// ==========================================
// 3. COMPARISON: @Self vs @SkipSelf vs @Host
// ==========================================

@Injectable()
export class ConfigService {
  private config: any;
  private level: string;
  
  constructor(level: string) {
    this.level = level;
    this.config = { level, timestamp: Date.now() };
    console.log(`ConfigService created at ${level} level`);
  }
  
  getConfig() {
    return this.config;
  }
  
  getLevel() {
    return this.level;
  }
}

// Host component that provides ConfigService
@Component({
  selector: 'app-host',
  template: `
    <div style="border: 3px solid #6f42c1; padding: 20px; margin: 20px;">
      <h2>Host Component</h2>
      <p>Config Level: {{ configLevel }}</p>
      
      <app-intermediate></app-intermediate>
    </div>
  `,
  providers: [{ provide: ConfigService, useValue: new ConfigService('HOST') }]
})
export class HostComponent {
  configLevel: string;
  
  constructor(private configService: ConfigService) {
    this.configLevel = configService.getLevel();
  }
}

// Intermediate component (also provides ConfigService)
@Component({
  selector: 'app-intermediate',
  template: `
    <div style="border: 2px solid #20c997; padding: 15px; margin: 15px;">
      <h3>Intermediate Component</h3>
      <p>Config Level: {{ configLevel }}</p>
      
      <app-decorator-demo></app-decorator-demo>
    </div>
  `,
  providers: [{ provide: ConfigService, useValue: new ConfigService('INTERMEDIATE') }]
})
export class IntermediateComponent {
  configLevel: string;
  
  constructor(private configService: ConfigService) {
    this.configLevel = configService.getLevel();
  }
}

// Component demonstrating different parameter decorators
@Component({
  selector: 'app-decorator-demo',
  template: `
    <div style="border: 1px solid #fd7e14; padding: 10px; margin: 10px; background: #fff3cd;">
      <h4>Parameter Decorator Demo</h4>
      <p><strong>@Self():</strong> {{ selfConfig || 'Not found' }}</p>
      <p><strong>@SkipSelf():</strong> {{ skipSelfConfig }}</p>
      <p><strong>@Host():</strong> {{ hostConfig }}</p>
      <p><strong>Normal:</strong> {{ normalConfig }}</p>
      <p><strong>@Optional():</strong> {{ optionalConfig || 'Not provided' }}</p>
    </div>
  `,
  providers: [{ provide: ConfigService, useValue: new ConfigService('SELF') }]
})
export class DecoratorDemoComponent {
  selfConfig: string;
  skipSelfConfig: string;
  hostConfig: string;
  normalConfig: string;
  optionalConfig: string;
  
  constructor(
    @Self() private selfConfigService: ConfigService,
    @SkipSelf() private skipSelfConfigService: ConfigService,
    @Host() private hostConfigService: ConfigService,
    private normalConfigService: ConfigService,
    @Optional() @Inject('OPTIONAL_CONFIG') private optionalService?: any
  ) {
    this.selfConfig = selfConfigService.getLevel();           // Gets 'SELF'
    this.skipSelfConfig = skipSelfConfigService.getLevel();   // Gets 'INTERMEDIATE'
    this.hostConfig = hostConfigService.getLevel();           // Gets 'HOST'
    this.normalConfig = normalConfigService.getLevel();       // Gets 'SELF' (closest)
    this.optionalConfig = optionalService;                    // Gets undefined (not provided)
  }
}

// ==========================================
// 4. PRACTICAL EXAMPLES
// ==========================================

// Custom injection tokens
export const API_CONFIG = new InjectionToken<string>('API Configuration');
export const FEATURE_FLAGS = new InjectionToken<any>('Feature Flags');

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    @Inject(API_CONFIG) private apiUrl: string,
    @Optional() @Inject(FEATURE_FLAGS) private featureFlags?: any,
    @Optional() private logger?: Logger
  ) {
    console.log('ApiService initialized with:');
    console.log('- API URL:', this.apiUrl);
    console.log('- Feature flags:', this.featureFlags);
    console.log('- Logger available:', !!this.logger);
  }
  
  get(endpoint: string) {
    this.logger?.log(`GET request to ${this.apiUrl}${endpoint}`);
    
    if (this.featureFlags?.enableCaching) {
      console.log('Caching enabled for this request');
    }
    
    // Simulate API call
    return Promise.resolve({ data: `Data from ${endpoint}` });
  }
}

// ==========================================
// 5. MAIN DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-parameter-decorators-demo',
  template: `
    <div>
      <h1>🏷️ Parameter Decorators Demo</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>📚 Parameter Decorators Explained:</h2>
        
        <h3>@Optional()</h3>
        <p>Makes dependency optional - won't throw error if not found</p>
        <pre><code>constructor(@Optional() private logger?: Logger) {}</code></pre>
        
        <h3>@Self()</h3>
        <p>Only looks in the current component's injector</p>
        <pre><code>constructor(@Self() private service: DataService) {}</code></pre>
        
        <h3>@SkipSelf()</h3>
        <p>Skips current injector, looks in parent injectors</p>
        <pre><code>constructor(@SkipSelf() private service: DataService) {}</code></pre>
        
        <h3>@Host()</h3>
        <p>Only looks up to the host component's injector</p>
        <pre><code>constructor(@Host() private service: DataService) {}</code></pre>
      </div>

      <div>
        <h2>🧪 Live Examples:</h2>
        
        <h3>1. @Optional() Example:</h3>
        <button (click)="testOptionalService()">Test Optional Service</button>
        <p *ngIf="optionalResult">{{ optionalResult }}</p>
        
        <h3>2. @Self() vs Normal Injection:</h3>
        <app-parent-with-service></app-parent-with-service>
        
        <h3>3. @Self() vs @SkipSelf() vs @Host():</h3>
        <app-host></app-host>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0;">
        <h2>🎯 When to Use Each:</h2>
        
        <h3>@Optional()</h3>
        <ul>
          <li>✅ Optional logging services</li>
          <li>✅ Feature flags or configuration</li>
          <li>✅ Third-party integrations that might not be available</li>
        </ul>
        
        <h3>@Self()</h3>
        <ul>
          <li>✅ Component-specific services</li>
          <li>✅ When you want to ensure isolation</li>
          <li>✅ Preventing inheritance of parent services</li>
        </ul>
        
        <h3>@SkipSelf()</h3>
        <ul>
          <li>✅ Accessing parent component services</li>
          <li>✅ Avoiding circular dependencies</li>
          <li>✅ Getting shared ancestor services</li>
        </ul>
        
        <h3>@Host()</h3>
        <ul>
          <li>✅ Directive communication with host component</li>
          <li>✅ Template-driven forms</li>
          <li>✅ Content projection scenarios</li>
        </ul>
      </div>
    </div>
  `,
  providers: [
    { provide: API_CONFIG, useValue: 'https://api.example.com' },
    ConsoleLogger,
    { provide: Logger, useExisting: ConsoleLogger }
  ]
})
export class ParameterDecoratorsDemo {
  optionalResult = '';
  
  constructor(
    private userService: UserServiceWithOptional,
    private apiService: ApiService
  ) {}
  
  testOptionalService() {
    const user = this.userService.getUser(123);
    this.optionalResult = `User retrieved: ${JSON.stringify(user)}`;
    
    this.apiService.get('/users/123').then(response => {
      console.log('API Response:', response);
    });
  }
}

/*
==========================================
PARAMETER DECORATORS SUMMARY
==========================================

@Optional():
- Makes dependency optional
- Returns null/undefined if not found
- Prevents injection errors
- Use for: optional services, feature flags

@Self():
- Only looks in current injector
- Doesn't check parent injectors
- Ensures component isolation
- Use for: component-specific services

@SkipSelf():
- Skips current injector
- Looks in parent injectors
- Avoids circular dependencies
- Use for: accessing parent services

@Host():
- Stops at host component
- Used in directives/content projection
- Limits injection scope
- Use for: directive-host communication

@Inject():
- Explicitly specifies injection token
- Required for non-class tokens
- Use for: primitive values, interfaces

==========================================
BEST PRACTICES
==========================================

1. **Use @Optional() for truly optional dependencies**
2. **Combine decorators: @Optional() @Self()**
3. **Be explicit with @Inject() for tokens**
4. **Document why you're using specific decorators**
5. **Test both presence and absence of optional dependencies**
*/
