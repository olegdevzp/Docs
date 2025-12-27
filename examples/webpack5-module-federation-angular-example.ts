/**
 * Module Federation with Angular - Complete Implementation Examples
 * 
 * This file demonstrates how to implement Module Federation with Angular
 * for micro-frontend architectures.
 */

import { NgModule, Component, Injectable, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { BehaviorSubject, Observable } from 'rxjs';

// ============================================================================
// 1. MODULE FEDERATION SERVICE
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ModuleFederationService {
  private loadedModules = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  constructor() {}

  /**
   * Load a remote module dynamically
   */
  async loadRemoteModule(remoteName: string, exposedModule: string): Promise<any> {
    const moduleKey = `${remoteName}/${exposedModule}`;
    
    // Return cached module if already loaded
    if (this.loadedModules.has(moduleKey)) {
      return this.loadedModules.get(moduleKey);
    }

    // Return existing promise if module is currently loading
    if (this.loadingPromises.has(moduleKey)) {
      return this.loadingPromises.get(moduleKey);
    }

    // Create new loading promise
    const loadingPromise = this.loadModule(remoteName, exposedModule);
    this.loadingPromises.set(moduleKey, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.set(moduleKey, module);
      this.loadingPromises.delete(moduleKey);
      return module;
    } catch (error) {
      this.loadingPromises.delete(moduleKey);
      throw error;
    }
  }

  private async loadModule(remoteName: string, exposedModule: string): Promise<any> {
    try {
      const module = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.getRemoteEntryUrl(remoteName),
        remoteName: remoteName,
        exposedModule: exposedModule,
      });
      
      return module;
    } catch (error) {
      console.error(`Error loading remote module ${remoteName}/${exposedModule}:`, error);
      throw error;
    }
  }

  private getRemoteEntryUrl(remoteName: string): string {
    // Configuration for different environments
    const baseUrl = process.env['NODE_ENV'] === 'production' 
      ? process.env['CDN_URL'] || 'https://your-cdn.com'
      : 'http://localhost';
    
    const ports = {
      'mfe1': '4201',
      'mfe2': '4202',
      'sharedComponents': '4203',
      'userModule': '4204',
      'adminModule': '4205',
    };

    const port = ports[remoteName] || '4200';
    const protocol = process.env['NODE_ENV'] === 'production' ? 'https' : 'http';
    
    return `${protocol}://${baseUrl}:${port}/remoteEntry.js`;
  }

  /**
   * Preload remote modules for better performance
   */
  async preloadModules(modules: Array<{remoteName: string, exposedModule: string}>): Promise<void> {
    const preloadPromises = modules.map(module => 
      this.loadRemoteModule(module.remoteName, module.exposedModule)
        .catch(error => {
          console.warn(`Failed to preload ${module.remoteName}/${module.exposedModule}:`, error);
          return null;
        })
    );

    await Promise.all(preloadPromises);
  }

  /**
   * Check if a module is loaded
   */
  isModuleLoaded(remoteName: string, exposedModule: string): boolean {
    const moduleKey = `${remoteName}/${exposedModule}`;
    return this.loadedModules.has(moduleKey);
  }

  /**
   * Clear cached modules (useful for testing or development)
   */
  clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// ============================================================================
// 2. FEDERATED STATE MANAGEMENT SERVICE
// ============================================================================

export interface FederatedState {
  user: any;
  theme: 'light' | 'dark';
  language: string;
  notifications: any[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FederatedStateService {
  private stateSubject = new BehaviorSubject<FederatedState>({
    user: null,
    theme: 'light',
    language: 'en',
    notifications: [],
  });

  get state$(): Observable<FederatedState> {
    return this.stateSubject.asObservable();
  }

  get currentState(): FederatedState {
    return this.stateSubject.value;
  }

  updateState(updates: Partial<FederatedState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
    
    // Persist state to localStorage for cross-tab communication
    this.persistState(newState);
  }

  updateUser(user: any): void {
    this.updateState({ user });
  }

  updateTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  }

  updateLanguage(language: string): void {
    this.updateState({ language });
  }

  addNotification(notification: any): void {
    const notifications = [...this.currentState.notifications, notification];
    this.updateState({ notifications });
  }

  removeNotification(notificationId: string): void {
    const notifications = this.currentState.notifications.filter(n => n.id !== notificationId);
    this.updateState({ notifications });
  }

  private persistState(state: FederatedState): void {
    try {
      localStorage.setItem('federated-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist federated state:', error);
    }
  }

  private loadPersistedState(): FederatedState | null {
    try {
      const persisted = localStorage.getItem('federated-state');
      return persisted ? JSON.parse(persisted) : null;
    } catch (error) {
      console.warn('Failed to load persisted federated state:', error);
      return null;
    }
  }

  constructor() {
    // Load persisted state on initialization
    const persistedState = this.loadPersistedState();
    if (persistedState) {
      this.stateSubject.next(persistedState);
    }

    // Listen for cross-tab state changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'federated-state' && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          this.stateSubject.next(newState);
        } catch (error) {
          console.warn('Failed to parse cross-tab state update:', error);
        }
      }
    });
  }
}

// ============================================================================
// 3. DYNAMIC COMPONENT LOADER COMPONENT
// ============================================================================

export interface DynamicComponentConfig {
  remoteName: string;
  exposedModule: string;
  componentName?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, Function>;
}

@Component({
  selector: 'app-dynamic-component-loader',
  template: `
    <div class="dynamic-component-container">
      <div *ngIf="loading" class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading component...</span>
      </div>
      <div *ngIf="error" class="error-message">
        <h3>Error loading component</h3>
        <p>{{ error }}</p>
        <button (click)="retry()">Retry</button>
      </div>
      <div #dynamicComponent></div>
    </div>
  `,
  styles: [`
    .dynamic-component-container {
      position: relative;
      min-height: 100px;
    }
    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #666;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 10px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error-message {
      padding: 20px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }
    .error-message button {
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class DynamicComponentLoaderComponent {
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) 
  dynamicComponent!: ViewContainerRef;

  @Input() config!: DynamicComponentConfig;
  @Input() preload = false;

  componentRef?: ComponentRef<any>;
  loading = false;
  error: string | null = null;

  constructor(
    private moduleFederationService: ModuleFederationService,
    private federatedStateService: FederatedStateService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.preload) {
      await this.preloadComponent();
    }
  }

  async ngOnChanges(): Promise<void> {
    if (this.config && this.dynamicComponent) {
      await this.loadComponent();
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.destroyComponent();
  }

  async preloadComponent(): Promise<void> {
    try {
      await this.moduleFederationService.loadRemoteModule(
        this.config.remoteName,
        this.config.exposedModule
      );
    } catch (error) {
      console.warn('Failed to preload component:', error);
    }
  }

  async loadComponent(): Promise<void> {
    if (!this.config) return;

    this.loading = true;
    this.error = null;

    try {
      // Clear existing component
      this.destroyComponent();

      // Load remote module
      const module = await this.moduleFederationService.loadRemoteModule(
        this.config.remoteName,
        this.config.exposedModule
      );

      // Get component class
      const componentClass = this.config.componentName 
        ? module[this.config.componentName] 
        : module.default || module;

      if (!componentClass) {
        throw new Error(`Component not found in module ${this.config.remoteName}/${this.config.exposedModule}`);
      }

      // Create component
      this.componentRef = this.dynamicComponent.createComponent(componentClass);

      // Set inputs
      if (this.config.inputs) {
        Object.entries(this.config.inputs).forEach(([key, value]) => {
          if (this.componentRef && this.componentRef.instance[key] !== undefined) {
            this.componentRef.instance[key] = value;
          }
        });
      }

      // Subscribe to outputs
      if (this.config.outputs) {
        Object.entries(this.config.outputs).forEach(([key, handler]) => {
          if (this.componentRef && this.componentRef.instance[key]) {
            this.componentRef.instance[key].subscribe(handler);
          }
        });
      }

      // Subscribe to federated state changes
      this.subscribeToStateChanges();

      this.loading = false;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error';
      this.loading = false;
      console.error('Error loading dynamic component:', error);
    }
  }

  async retry(): Promise<void> {
    await this.loadComponent();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

  private subscribeToStateChanges(): void {
    if (!this.componentRef) return;

    // Subscribe to federated state and update component inputs
    this.federatedStateService.state$.subscribe(state => {
      if (this.componentRef && this.componentRef.instance.onStateChange) {
        this.componentRef.instance.onStateChange(state);
      }
    });
  }

  // Public method to update component inputs dynamically
  updateInputs(inputs: Record<string, any>): void {
    if (this.componentRef) {
      Object.entries(inputs).forEach(([key, value]) => {
        if (this.componentRef.instance[key] !== undefined) {
          this.componentRef.instance[key] = value;
        }
      });
    }
  }
}

// ============================================================================
// 4. FEDERATED ROUTING MODULE
// ============================================================================

const federatedRoutes: Routes = [
  {
    path: 'mfe1',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'mfe1',
        exposedModule: './Module',
      }).then(m => m.Mfe1Module)
        .catch(error => {
          console.error('Failed to load MFE1 module:', error);
          // Return a fallback module or redirect
          return import('./fallback/fallback.module').then(m => m.FallbackModule);
        })
  },
  {
    path: 'mfe2',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        remoteName: 'mfe2',
        exposedModule: './Module',
      }).then(m => m.Mfe2Module)
  },
  {
    path: 'user',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4204/remoteEntry.js',
        remoteName: 'userModule',
        exposedModule: './UserModule',
      }).then(m => m.UserModule)
  },
  {
    path: 'admin',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        remoteName: 'adminModule',
        exposedModule: './AdminModule',
      }).then(m => m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(federatedRoutes, {
    preloadingStrategy: FederatedPreloadingStrategy,
    enableTracing: false,
  })],
  exports: [RouterModule],
  providers: [
    FederatedPreloadingStrategy,
  ],
})
export class FederatedRoutingModule {}

// ============================================================================
// 5. CUSTOM PRELOADING STRATEGY
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class FederatedPreloadingStrategy implements PreloadingStrategy {
  private preloadedModules = new Set<string>();

  constructor(
    private moduleFederationService: ModuleFederationService,
    private federatedStateService: FederatedStateService
  ) {}

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const routePath = route.path || '';
    
    // Check if module should be preloaded based on route data
    const shouldPreload = route.data?.['preload'] === true;
    const preloadCondition = route.data?.['preloadCondition'];
    
    if (shouldPreload && this.shouldPreloadRoute(routePath, preloadCondition)) {
      // Preload the federated module
      this.preloadFederatedModule(routePath);
      return load();
    }
    
    return of(null);
  }

  private shouldPreloadRoute(routePath: string, condition?: Function): boolean {
    if (this.preloadedModules.has(routePath)) {
      return false;
    }

    if (condition && typeof condition === 'function') {
      return condition(this.federatedStateService.currentState);
    }

    // Default preloading conditions
    const preloadConditions = {
      'user': (state: FederatedState) => !!state.user,
      'admin': (state: FederatedState) => state.user?.role === 'admin',
      'mfe1': () => true, // Always preload
      'mfe2': () => true, // Always preload
    };

    const conditionFn = preloadConditions[routePath];
    return conditionFn ? conditionFn(this.federatedStateService.currentState) : false;
  }

  private async preloadFederatedModule(routePath: string): Promise<void> {
    const moduleConfigs = {
      'mfe1': { remoteName: 'mfe1', exposedModule: './Module' },
      'mfe2': { remoteName: 'mfe2', exposedModule: './Module' },
      'user': { remoteName: 'userModule', exposedModule: './UserModule' },
      'admin': { remoteName: 'adminModule', exposedModule: './AdminModule' },
    };

    const config = moduleConfigs[routePath];
    if (config) {
      try {
        await this.moduleFederationService.loadRemoteModule(
          config.remoteName,
          config.exposedModule
        );
        this.preloadedModules.add(routePath);
      } catch (error) {
        console.warn(`Failed to preload module for route ${routePath}:`, error);
      }
    }
  }
}

// ============================================================================
// 6. MODULE FEDERATION GUARD
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ModuleFederationGuard implements CanActivate {
  constructor(
    private moduleFederationService: ModuleFederationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const remoteName = route.data?.['remoteName'];
    const exposedModule = route.data?.['exposedModule'];

    if (!remoteName || !exposedModule) {
      console.error('Module Federation Guard: Missing remoteName or exposedModule in route data');
      return false;
    }

    return this.moduleFederationService.loadRemoteModule(remoteName, exposedModule)
      .then(() => true)
      .catch(error => {
        console.error('Module Federation Guard: Failed to load remote module:', error);
        this.router.navigate(['/error'], { 
          queryParams: { 
            message: 'Failed to load module',
            code: 'MODULE_LOAD_ERROR'
          }
        });
        return false;
      });
  }
}

// ============================================================================
// 7. MODULE FEDERATION INTERCEPTOR
// ============================================================================

@Injectable()
export class ModuleFederationInterceptor implements HttpInterceptor {
  constructor(private moduleFederationService: ModuleFederationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Handle requests to remote modules
    if (req.url.includes('/remoteEntry.js')) {
      return this.handleRemoteEntryRequest(req, next);
    }

    return next.handle(req);
  }

  private handleRemoteEntryRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add caching headers for remote entries
    const modifiedReq = req.clone({
      setHeaders: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'If-None-Match': this.getETag(req.url),
      }
    });

    return next.handle(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 304) {
          // Not modified, return cached version
          return of(new HttpResponse({ status: 200, body: this.getCachedRemoteEntry(req.url) }));
        }
        throw error;
      })
    );
  }

  private getETag(url: string): string {
    // Generate ETag based on URL and version
    const version = require('../../package.json').version;
    return `"${btoa(url + version)}"`;
  }

  private getCachedRemoteEntry(url: string): any {
    // Return cached remote entry if available
    const cacheKey = `remote-entry-${btoa(url)}`;
    return localStorage.getItem(cacheKey);
  }
}

// ============================================================================
// 8. MODULE FEDERATION ERROR HANDLER
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ModuleFederationErrorHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
    private moduleFederationService: ModuleFederationService
  ) {}

  handleError(error: any): void {
    console.error('Module Federation Error:', error);

    // Handle specific module federation errors
    if (error.message?.includes('Loading chunk') || error.message?.includes('Loading CSS chunk')) {
      this.handleChunkLoadError(error);
    } else if (error.message?.includes('remoteEntry')) {
      this.handleRemoteEntryError(error);
    } else {
      // Handle other errors normally
      console.error('Application Error:', error);
    }
  }

  private handleChunkLoadError(error: any): void {
    console.warn('Chunk load error detected, clearing cache and reloading...');
    
    // Clear module federation cache
    this.moduleFederationService.clearCache();
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  private handleRemoteEntryError(error: any): void {
    console.error('Remote entry error:', error);
    
    // Navigate to error page or show fallback UI
    const router = this.injector.get(Router);
    router.navigate(['/error'], {
      queryParams: {
        message: 'Failed to load remote module',
        code: 'REMOTE_ENTRY_ERROR'
      }
    });
  }
}

// ============================================================================
// 9. MODULE FEDERATION MODULE
// ============================================================================

@NgModule({
  declarations: [
    DynamicComponentLoaderComponent,
  ],
  imports: [
    CommonModule,
    FederatedRoutingModule,
  ],
  providers: [
    ModuleFederationService,
    FederatedStateService,
    FederatedPreloadingStrategy,
    ModuleFederationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ModuleFederationInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: ModuleFederationErrorHandler,
    },
  ],
  exports: [
    DynamicComponentLoaderComponent,
  ],
})
export class ModuleFederationModule {}

// ============================================================================
// 10. USAGE EXAMPLES
// ============================================================================

@Component({
  selector: 'app-example-usage',
  template: `
    <div class="example-container">
      <h2>Module Federation Examples</h2>
      
      <!-- Basic dynamic component loading -->
      <div class="example-section">
        <h3>Basic Dynamic Component</h3>
        <app-dynamic-component-loader 
          [config]="basicComponentConfig">
        </app-dynamic-component-loader>
      </div>

      <!-- Component with inputs and outputs -->
      <div class="example-section">
        <h3>Component with Inputs/Outputs</h3>
        <app-dynamic-component-loader 
          [config]="advancedComponentConfig">
        </app-dynamic-component-loader>
      </div>

      <!-- Multiple components -->
      <div class="example-section">
        <h3>Multiple Components</h3>
        <div class="component-grid">
          <app-dynamic-component-loader 
            *ngFor="let config of multipleComponentConfigs"
            [config]="config"
            [preload]="true">
          </app-dynamic-component-loader>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
    }
    .example-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .component-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
  `]
})
export class ExampleUsageComponent implements OnInit {
  basicComponentConfig: DynamicComponentConfig = {
    remoteName: 'sharedComponents',
    exposedModule: './ButtonComponent',
  };

  advancedComponentConfig: DynamicComponentConfig = {
    remoteName: 'mfe1',
    exposedModule: './UserCardComponent',
    componentName: 'UserCardComponent',
    inputs: {
      user: { name: 'John Doe', email: 'john@example.com' },
      showActions: true,
    },
    outputs: {
      onUserClick: (user: any) => console.log('User clicked:', user),
      onActionClick: (action: string) => console.log('Action clicked:', action),
    },
  };

  multipleComponentConfigs: DynamicComponentConfig[] = [
    {
      remoteName: 'mfe1',
      exposedModule: './ChartComponent',
    },
    {
      remoteName: 'mfe2',
      exposedModule: './TableComponent',
    },
    {
      remoteName: 'sharedComponents',
      exposedModule: './ModalComponent',
    },
  ];

  constructor(
    private moduleFederationService: ModuleFederationService,
    private federatedStateService: FederatedStateService
  ) {}

  async ngOnInit(): Promise<void> {
    // Preload commonly used modules
    await this.preloadCommonModules();
    
    // Subscribe to state changes
    this.federatedStateService.state$.subscribe(state => {
      console.log('Federated state updated:', state);
    });
  }

  private async preloadCommonModules(): Promise<void> {
    const modulesToPreload = [
      { remoteName: 'sharedComponents', exposedModule: './ButtonComponent' },
      { remoteName: 'mfe1', exposedModule: './UserCardComponent' },
    ];

    try {
      await this.moduleFederationService.preloadModules(modulesToPreload);
      console.log('Common modules preloaded successfully');
    } catch (error) {
      console.warn('Some modules failed to preload:', error);
    }
  }
}



