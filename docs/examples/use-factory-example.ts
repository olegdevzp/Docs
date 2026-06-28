// Angular useFactory - Complete Guide and Examples
import { Injectable, InjectionToken, NgModule, Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
==========================================
useFactory EXPLAINED
==========================================

useFactory is a provider option that allows you to create service instances
using a factory function instead of a class constructor.

WHEN TO USE:
✅ Dynamic service creation based on conditions
✅ Complex initialization logic
✅ Creating instances with runtime dependencies
✅ Conditional service provision
✅ Integration with third-party libraries
✅ Creating configured instances

SYNTAX:
{
  provide: TOKEN,
  useFactory: (dep1, dep2) => new Service(dep1, dep2),
  deps: [Dep1, Dep2]
}
*/

// ==========================================
// 1. BASIC useFactory EXAMPLES
// ==========================================

// Simple service that needs dynamic configuration
@Injectable()
export class ApiService {
  constructor(
    private baseUrl: string,
    private apiKey: string,
    private httpClient: HttpClient
  ) {
    console.log(`ApiService created with baseUrl: ${baseUrl}, apiKey: ${apiKey}`);
  }

  get(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}${endpoint}?apiKey=${this.apiKey}`;
    return this.httpClient.get(url);
  }
}

// Factory function to create ApiService with dynamic configuration
export function createApiService(http: HttpClient): ApiService {
  const environment = getEnvironment();
  const config = getApiConfig(environment);
  
  console.log('🏭 Factory creating ApiService for environment:', environment);
  
  return new ApiService(config.baseUrl, config.apiKey, http);
}

function getEnvironment(): string {
  return (window as any)['environment'] || 'development';
}

function getApiConfig(environment: string) {
  const configs = {
    development: {
      baseUrl: 'https://dev-api.example.com/',
      apiKey: 'dev-key-123'
    },
    staging: {
      baseUrl: 'https://staging-api.example.com/',
      apiKey: 'staging-key-456'
    },
    production: {
      baseUrl: 'https://api.example.com/',
      apiKey: 'prod-key-789'
    }
  };
  
  return configs[environment as keyof typeof configs] || configs.development;
}

// ==========================================
// 2. CONDITIONAL SERVICE CREATION
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

@Injectable()
export class RemoteLogger implements Logger {
  constructor(private apiUrl: string) {}
  
  log(message: string) {
    // Send to remote logging service
    console.log(`[REMOTE LOG] ${message} -> ${this.apiUrl}`);
  }
  
  error(message: string) {
    // Send error to remote service
    console.error(`[REMOTE ERROR] ${message} -> ${this.apiUrl}`);
  }
}

@Injectable()
export class NoOpLogger implements Logger {
  log(message: string) {
    // Do nothing in production
  }
  
  error(message: string) {
    // Only log errors in production
    console.error(message);
  }
}

// Factory function that creates different loggers based on environment
export function createLogger(): Logger {
  const environment = getEnvironment();
  const isProduction = environment === 'production';
  const enableRemoteLogging = (window as any)['enableRemoteLogging'] || false;
  
  console.log('🏭 Factory creating Logger for:', { environment, enableRemoteLogging });
  
  if (isProduction && enableRemoteLogging) {
    return new RemoteLogger('https://logging.example.com/api');
  } else if (isProduction) {
    return new NoOpLogger();
  } else {
    return new ConsoleLogger();
  }
}

// ==========================================
// 3. COMPLEX DEPENDENCY INJECTION
// ==========================================

// Tokens for configuration
export const APP_CONFIG = new InjectionToken<any>('Application Configuration');
export const FEATURE_FLAGS = new InjectionToken<any>('Feature Flags');
export const USER_PREFERENCES = new InjectionToken<any>('User Preferences');

interface NotificationConfig {
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  provider: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private config: NotificationConfig,
    private logger: Logger
  ) {
    this.logger.log(`NotificationService initialized with config: ${JSON.stringify(config)}`);
  }

  sendNotification(message: string, type: 'push' | 'email' | 'sms') {
    this.logger.log(`Sending ${type} notification: ${message}`);
    
    switch (type) {
      case 'push':
        if (this.config.enablePush) {
          this.sendPushNotification(message);
        }
        break;
      case 'email':
        if (this.config.enableEmail) {
          this.sendEmailNotification(message);
        }
        break;
      case 'sms':
        if (this.config.enableSMS) {
          this.sendSMSNotification(message);
        }
        break;
    }
  }

  private sendPushNotification(message: string) {
    console.log(`📱 Push: ${message} via ${this.config.provider}`);
  }

  private sendEmailNotification(message: string) {
    console.log(`📧 Email: ${message} via ${this.config.provider}`);
  }

  private sendSMSNotification(message: string) {
    console.log(`📱 SMS: ${message} via ${this.config.provider}`);
  }
}

// Complex factory function with multiple dependencies
export function createNotificationService(
  appConfig: any,
  featureFlags: any,
  userPreferences: any,
  logger: Logger
): NotificationService {
  
  console.log('🏭 Factory creating NotificationService with dependencies:', {
    appConfig: !!appConfig,
    featureFlags: !!featureFlags,
    userPreferences: !!userPreferences,
    logger: !!logger
  });

  // Build configuration based on multiple sources
  const config: NotificationConfig = {
    enablePush: featureFlags.pushNotifications && userPreferences.allowPush,
    enableEmail: featureFlags.emailNotifications && userPreferences.allowEmail,
    enableSMS: featureFlags.smsNotifications && userPreferences.allowSMS,
    provider: appConfig.notificationProvider || 'default'
  };

  logger.log(`Notification config resolved: ${JSON.stringify(config)}`);
  
  return new NotificationService(config, logger);
}

// ==========================================
// 4. THIRD-PARTY LIBRARY INTEGRATION
// ==========================================

// Wrapper for third-party analytics library
export interface AnalyticsService {
  track(event: string, properties?: any): void;
  identify(userId: string, properties?: any): void;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    mixpanel?: any;
    analytics?: any;
  }
}

@Injectable()
export class GoogleAnalyticsService implements AnalyticsService {
  constructor(private trackingId: string) {
    console.log('📊 Google Analytics initialized with tracking ID:', trackingId);
  }

  track(event: string, properties?: any) {
    if (window.gtag) {
      window.gtag('event', event, properties);
    }
  }

  identify(userId: string, properties?: any) {
    if (window.gtag) {
      window.gtag('config', this.trackingId, {
        user_id: userId,
        custom_map: properties
      });
    }
  }
}

@Injectable()
export class MixpanelService implements AnalyticsService {
  constructor() {
    console.log('📊 Mixpanel Analytics initialized');
  }

  track(event: string, properties?: any) {
    if (window.mixpanel) {
      window.mixpanel.track(event, properties);
    }
  }

  identify(userId: string, properties?: any) {
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      if (properties) {
        window.mixpanel.people.set(properties);
      }
    }
  }
}

@Injectable()
export class NoOpAnalyticsService implements AnalyticsService {
  track(event: string, properties?: any) {
    console.log('📊 NoOp Analytics - would track:', event, properties);
  }

  identify(userId: string, properties?: any) {
    console.log('📊 NoOp Analytics - would identify:', userId, properties);
  }
}

// Factory function to create appropriate analytics service
export function createAnalyticsService(appConfig: any): AnalyticsService {
  const analyticsProvider = appConfig.analyticsProvider;
  const trackingId = appConfig.trackingId;
  
  console.log('🏭 Factory creating AnalyticsService:', { analyticsProvider, trackingId });
  
  switch (analyticsProvider) {
    case 'google':
      return new GoogleAnalyticsService(trackingId);
    case 'mixpanel':
      return new MixpanelService();
    case 'none':
    default:
      return new NoOpAnalyticsService();
  }
}

// ==========================================
// 5. ASYNC FACTORY FUNCTIONS
// ==========================================

@Injectable()
export class ConfigService {
  constructor(private config: any) {
    console.log('⚙️ ConfigService initialized with config:', Object.keys(config));
  }

  get(key: string): any {
    return this.config[key];
  }

  getAll(): any {
    return { ...this.config };
  }
}

// Async factory function that loads configuration from server
export function createConfigService(http: HttpClient): Promise<ConfigService> {
  console.log('🏭 Factory loading configuration from server...');
  
  return http.get('/api/config').toPromise()
    .then(config => {
      console.log('✅ Configuration loaded:', config);
      return new ConfigService(config);
    })
    .catch(error => {
      console.error('❌ Failed to load configuration:', error);
      // Return default configuration
      const defaultConfig = {
        apiUrl: 'https://api.example.com',
        features: { newUI: false, analytics: true }
      };
      return new ConfigService(defaultConfig);
    });
}

// ==========================================
// 6. DEMONSTRATION COMPONENT
// ==========================================

@Component({
  selector: 'app-use-factory-demo',
  template: `
    <div>
      <h1>🏭 useFactory Demonstration</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>🔧 What is useFactory?</h2>
        <p>useFactory allows you to create service instances using custom factory functions instead of class constructors.</p>
        
        <h3>Benefits:</h3>
        <ul>
          <li>✅ Dynamic service creation based on runtime conditions</li>
          <li>✅ Complex initialization logic</li>
          <li>✅ Integration with third-party libraries</li>
          <li>✅ Conditional service provision</li>
          <li>✅ Multiple dependencies coordination</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
        <h2>🧪 Live Examples:</h2>
        
        <div>
          <h3>1. Dynamic API Service</h3>
          <p>Environment: {{ currentEnvironment }}</p>
          <button (click)="testApiService()">Test API Service</button>
          <p *ngIf="apiResult">{{ apiResult }}</p>
        </div>

        <div>
          <h3>2. Conditional Logger</h3>
          <button (click)="testLogger()">Test Logger</button>
          <p>Check console for logger output</p>
        </div>

        <div>
          <h3>3. Complex Notification Service</h3>
          <button (click)="testNotificationService()">Test Notifications</button>
          <p>Check console for notification output</p>
        </div>

        <div>
          <h3>4. Analytics Service</h3>
          <button (click)="testAnalytics()">Test Analytics</button>
          <p>Check console for analytics output</p>
        </div>

        <div>
          <h3>5. Configuration Service</h3>
          <button (click)="testConfigService()">Test Config Service</button>
          <p *ngIf="configResult">Config: {{ configResult | json }}</p>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0;">
        <h2>💡 Factory Function Patterns:</h2>
        
        <h3>1. Basic Factory:</h3>
        <pre><code>{{basicFactoryExample}}</code></pre>

        <h3>2. Factory with Dependencies:</h3>
        <pre><code>{{factoryWithDepsExample}}</code></pre>

        <h3>3. Conditional Factory:</h3>
        <pre><code>{{conditionalFactoryExample}}</code></pre>
      </div>
    </div>
  `
})
export class UseFactoryDemoComponent {
  currentEnvironment = getEnvironment();
  apiResult = '';
  configResult: any = null;

  basicFactoryExample = `{
  provide: MyService,
  useFactory: () => new MyService('config'),
  deps: []
}`;

  factoryWithDepsExample = `{
  provide: ApiService,
  useFactory: (http: HttpClient) => createApiService(http),
  deps: [HttpClient]
}`;

  conditionalFactoryExample = `{
  provide: Logger,
  useFactory: () => {
    return isProd() ? new NoOpLogger() : new ConsoleLogger();
  },
  deps: []
}`;

  constructor(
    private apiService: ApiService,
    private logger: Logger,
    private notificationService: NotificationService,
    private analyticsService: AnalyticsService,
    private configService: ConfigService
  ) {}

  testApiService() {
    this.logger.log('Testing API service...');
    this.apiResult = `API service configured for ${this.currentEnvironment} environment`;
    
    // In a real app, you'd make an actual HTTP call
    // this.apiService.get('/test').subscribe(result => {
    //   this.apiResult = JSON.stringify(result);
    // });
  }

  testLogger() {
    this.logger.log('This is a test log message');
    this.logger.error('This is a test error message');
  }

  testNotificationService() {
    this.notificationService.sendNotification('Hello from factory!', 'push');
    this.notificationService.sendNotification('Email notification test', 'email');
    this.notificationService.sendNotification('SMS notification test', 'sms');
  }

  testAnalytics() {
    this.analyticsService.identify('user123', { name: 'John Doe', plan: 'premium' });
    this.analyticsService.track('button_clicked', { button: 'test_analytics', page: 'demo' });
  }

  testConfigService() {
    this.configResult = this.configService.getAll();
  }
}

// ==========================================
// 7. MODULE WITH FACTORY PROVIDERS
// ==========================================

@NgModule({
  providers: [
    // Basic factory
    {
      provide: ApiService,
      useFactory: createApiService,
      deps: [HttpClient]
    },
    
    // Conditional factory
    {
      provide: Logger,
      useFactory: createLogger,
      deps: []
    },
    
    // Complex factory with multiple dependencies
    {
      provide: NotificationService,
      useFactory: createNotificationService,
      deps: [APP_CONFIG, FEATURE_FLAGS, USER_PREFERENCES, Logger]
    },
    
    // Third-party integration factory
    {
      provide: AnalyticsService,
      useFactory: createAnalyticsService,
      deps: [APP_CONFIG]
    },
    
    // Async factory (requires APP_INITIALIZER)
    {
      provide: ConfigService,
      useFactory: createConfigService,
      deps: [HttpClient]
    },
    
    // Configuration tokens
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'https://api.example.com',
        notificationProvider: 'firebase',
        analyticsProvider: 'google',
        trackingId: 'GA-123456789'
      }
    },
    
    {
      provide: FEATURE_FLAGS,
      useValue: {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false
      }
    },
    
    {
      provide: USER_PREFERENCES,
      useValue: {
        allowPush: true,
        allowEmail: true,
        allowSMS: false
      }
    }
  ]
})
export class UseFactoryDemoModule {}

/*
==========================================
useFactory PATTERNS SUMMARY
==========================================

1. **Basic Factory:**
   - Simple service creation with configuration
   - No dependencies required

2. **Factory with Dependencies:**
   - Inject other services into factory function
   - Use deps array to specify dependencies

3. **Conditional Factory:**
   - Create different service implementations
   - Based on environment or feature flags

4. **Complex Factory:**
   - Multiple dependencies coordination
   - Complex initialization logic

5. **Async Factory:**
   - Load configuration from server
   - Requires APP_INITIALIZER for proper timing

6. **Third-party Integration:**
   - Wrap external libraries
   - Conditional loading based on availability

==========================================
BEST PRACTICES
==========================================

✅ DO:
- Use factories for complex initialization
- Handle errors in factory functions
- Keep factory functions pure when possible
- Use TypeScript for better type safety
- Document factory behavior

❌ DON'T:
- Overuse factories for simple cases
- Make factories too complex
- Forget to handle dependency injection properly
- Ignore error handling in factories
- Create side effects in factory functions

==========================================
WHEN TO USE useFactory vs OTHER OPTIONS
==========================================

Use useFactory when:
✅ Need dynamic service creation
✅ Complex initialization logic required
✅ Conditional service provision needed
✅ Multiple dependencies must be coordinated
✅ Integrating third-party libraries

Use useClass when:
✅ Simple service substitution
✅ Implementation swapping

Use useValue when:
✅ Providing constant values
✅ Simple configuration objects

Use useExisting when:
✅ Creating aliases for existing services
✅ Multiple tokens for same instance
*/
