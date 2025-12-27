# Micro Frontend Architecture with Angular - Best Practices Guide

## Table of Contents
1. [Introduction to Micro Frontends](#introduction)
2. [Why Micro Frontends?](#why-micro-frontends)
3. [Implementation Approaches](#implementation-approaches)
4. [Module Federation with Webpack](#module-federation)
5. [Native Federation with Vite (Angular 17+)](#native-federation-vite)
6. [Architecture Patterns](#architecture-patterns)
7. [Best Practices](#best-practices)
8. [Communication Strategies](#communication-strategies)
9. [State Management](#state-management)
10. [Routing & Navigation](#routing-navigation)
11. [Deployment Strategies](#deployment-strategies)
12. [Testing Strategies](#testing-strategies)
13. [Performance Optimization](#performance-optimization)
14. [Real-World Examples](#real-world-examples)
15. [Common Pitfalls](#common-pitfalls)

---

## Introduction to Micro Frontends

Micro frontends extend the microservices concept to frontend development, allowing teams to build, test, and deploy features independently.

### Key Concepts

```typescript
// Micro Frontend Architecture Overview
/**
 * Shell/Host App (Container)
 * ├── Authentication Module
 * ├── Shared Services
 * ├── Remote: Dashboard (Team A)
 * ├── Remote: Products (Team B)
 * └── Remote: Orders (Team C)
 */
```

### Benefits
- ✅ Independent deployment
- ✅ Team autonomy
- ✅ Technology diversity (carefully managed)
- ✅ Scalability
- ✅ Isolated failures
- ✅ Incremental upgrades

### Challenges
- ⚠️ Increased complexity
- ⚠️ Shared dependencies
- ⚠️ Performance overhead
- ⚠️ Cross-app communication
- ⚠️ Consistent UX

---

## Why Micro Frontends?

### When to Use Micro Frontends

✅ **Good Use Cases:**
- Large enterprise applications
- Multiple independent teams (3+)
- Different release cycles needed
- Feature isolation critical
- Long-term scalability required

❌ **Avoid When:**
- Small team (< 5 developers)
- Simple applications
- Tight integration required
- Shared state dominates
- Performance is critical constraint

---

## Implementation Approaches

### 1. Module Federation (★ Recommended for Angular)

**Best for:** Runtime integration, Angular-to-Angular communication

```typescript
// Webpack 5 Module Federation
// Host application webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        dashboard: 'dashboard@http://localhost:4201/remoteEntry.js',
        products: 'products@http://localhost:4202/remoteEntry.js'
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

### 2. Web Components

**Best for:** Technology-agnostic approach

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-widget',
  template: '<product-mfe [product-id]="productId"></product-mfe>',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductWidgetComponent {
  productId = input.required<string>();
}
```

### 3. iframe Approach

**Best for:** Complete isolation, legacy integration

```typescript
@Component({
  selector: 'app-legacy-iframe',
  template: `
    <iframe 
      [src]="trustedUrl()" 
      sandbox="allow-scripts allow-same-origin"
      (load)="onIframeLoad()">
    </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegacyIframeComponent {
  private sanitizer = inject(DomSanitizer);
  url = input.required<string>();
  
  trustedUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url());
  }
  
  onIframeLoad() {
    // Post message communication
    window.postMessage({ type: 'IFRAME_LOADED' }, '*');
  }
}
```

### 4. Build-Time Integration

**Best for:** Monorepo, shared build process

```typescript
// Using Nx or Angular CLI workspaces
// nx.json or angular.json
{
  "projects": {
    "shell": { "projectType": "application" },
    "mfe-dashboard": { "projectType": "application" },
    "mfe-products": { "projectType": "application" },
    "shared-ui": { "projectType": "library" }
  }
}
```

---

## Module Federation (Deep Dive)

### Project Structure

```
micro-frontend-workspace/
├── apps/
│   ├── shell/                    # Host application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   └── app.component.ts
│   │   │   └── main.ts
│   │   ├── webpack.config.js
│   │   └── angular.json
│   │
│   ├── mfe-dashboard/            # Remote application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── remote-app/
│   │   │   │   │   ├── dashboard.routes.ts
│   │   │   │   │   └── dashboard.component.ts
│   │   │   │   └── app.config.ts
│   │   │   └── bootstrap.ts
│   │   └── webpack.config.js
│   │
│   └── mfe-products/             # Another remote
│       └── ...
│
└── libs/
    ├── shared-ui/                # Shared component library
    ├── shared-data-access/       # Shared services
    └── shared-util/              # Shared utilities
```

### Shell Application Setup

#### 1. webpack.config.js (Shell)

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.base.json'),
  ['@my-org/shared-ui', '@my-org/shared-data-access']
);

module.exports = {
  output: {
    uniqueName: 'shell',
    publicPath: 'auto'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases()
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: 'module' },
      
      remotes: {
        dashboard: 'http://localhost:4201/remoteEntry.js',
        products: 'http://localhost:4202/remoteEntry.js',
        orders: 'http://localhost:4203/remoteEntry.js'
      },
      
      shared: share({
        '@angular/core': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/common': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/common/http': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/router': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/platform-browser': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto'
        },
        '@angular/platform-browser-dynamic': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto'
        },
        
        // Shared libraries
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ]
};
```

#### 2. app.routes.ts (Shell)

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => 
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.PRODUCTS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.ORDERS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
```

#### 3. app.config.ts (Shell)

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from '@my-org/shared-data-access';
import { errorHandlerInterceptor } from '@my-org/shared-util';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorHandlerInterceptor])
    ),
    provideAnimations(),
    
    // Global services
    {
      provide: 'APP_CONFIG',
      useValue: {
        apiUrl: 'https://api.example.com',
        version: '1.0.0'
      }
    }
  ]
};
```

#### 4. app.component.ts (Shell)

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@my-org/shared-data-access';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Micro Frontend Shell</h1>
        
        <nav class="main-nav">
          @for (item of navItems(); track item.path) {
            <a 
              [routerLink]="item.path" 
              routerLinkActive="active"
              class="nav-link">
              <i [class]="item.icon"></i>
              {{ item.label }}
            </a>
          }
        </nav>
        
        <div class="user-section">
          @if (isAuthenticated()) {
            <span>{{ userName() }}</span>
            <button (click)="logout()">Logout</button>
          } @else {
            <button (click)="login()">Login</button>
          }
        </div>
      </header>
      
      <main class="app-main">
        <router-outlet />
      </main>
      
      <footer class="app-footer">
        <p>Version: {{ version() }} | © 2025</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
      background: #1976d2;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .main-nav {
      display: flex;
      gap: 1rem;
      flex: 1;
    }
    
    .nav-link {
      padding: 0.5rem 1rem;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.2s;
      
      &:hover {
        background: rgba(255,255,255,0.1);
      }
      
      &.active {
        background: rgba(255,255,255,0.2);
      }
    }
    
    .app-main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }
    
    .app-footer {
      padding: 1rem 2rem;
      text-align: center;
      background: #333;
      color: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  version = signal('1.0.0');
  
  isAuthenticated = this.authService.isAuthenticated;
  userName = computed(() => this.authService.currentUser()?.name ?? 'Guest');
  
  navItems = signal<NavItem[]>([
    { path: '/home', label: 'Home', icon: 'icon-home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'icon-dashboard' },
    { path: '/products', label: 'Products', icon: 'icon-products' },
    { path: '/orders', label: 'Orders', icon: 'icon-orders' }
  ]);
  
  login() {
    this.authService.login();
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
```

### Remote Application Setup

#### 1. webpack.config.js (Remote - Dashboard)

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.base.json'),
  ['@my-org/shared-ui', '@my-org/shared-data-access']
);

module.exports = {
  output: {
    uniqueName: 'dashboard',
    publicPath: 'auto'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases()
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      
      exposes: {
        './Routes': './src/app/dashboard/dashboard.routes.ts',
        './Component': './src/app/dashboard/dashboard.component.ts'
      },
      
      shared: share({
        '@angular/core': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/common': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/common/http': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        '@angular/router': { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: 'auto' 
        },
        
        // Shared libraries
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ]
};
```

#### 2. dashboard.routes.ts (Remote)

```typescript
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];
```

#### 3. dashboard.component.ts (Remote)

```typescript
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { DashboardService } from './dashboard.service';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  orders: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>
      
      <div class="stats-grid">
        @for (stat of stats(); track stat.label) {
          <div class="stat-card">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
            <span [class]="'trend ' + stat.trend">
              {{ stat.change }}
            </span>
          </div>
        }
      </div>
      
      <div class="dashboard-content">
        <router-outlet />
      </div>
      
      @if (loading()) {
        <div class="loading">Loading dashboard data...</div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .stat-card {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      h3 {
        font-size: 2rem;
        margin: 0 0 0.5rem;
        color: #1976d2;
      }
      
      p {
        margin: 0;
        color: #666;
      }
      
      .trend {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        
        &.up {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        &.down {
          background: #ffebee;
          color: #c62828;
        }
      }
    }
    
    .dashboard-content {
      margin-top: 2rem;
    }
    
    .loading, .error {
      padding: 2rem;
      text-align: center;
    }
    
    .error {
      color: #c62828;
      background: #ffebee;
      border-radius: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  loading = signal(false);
  error = signal<string | null>(null);
  
  private rawStats = signal<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    orders: 0
  });
  
  stats = computed(() => [
    {
      label: 'Total Users',
      value: this.rawStats().totalUsers.toLocaleString(),
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Active Users',
      value: this.rawStats().activeUsers.toLocaleString(),
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Revenue',
      value: `$${this.rawStats().revenue.toLocaleString()}`,
      change: '+23%',
      trend: 'up'
    },
    {
      label: 'Orders',
      value: this.rawStats().orders.toLocaleString(),
      change: '-5%',
      trend: 'down'
    }
  ]);
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  private async loadDashboardData() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const data = await this.dashboardService.getStats();
      this.rawStats.set(data);
    } catch (err) {
      this.error.set('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
```

#### 4. dashboard.service.ts (Remote)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  orders: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com/dashboard';
  
  async getStats(): Promise<DashboardStats> {
    return firstValueFrom(
      this.http.get<DashboardStats>(`${this.apiUrl}/stats`)
    );
  }
  
  async getAnalytics(period: string = '7d') {
    return firstValueFrom(
      this.http.get(`${this.apiUrl}/analytics`, {
        params: { period }
      })
    );
  }
}
```

---

## Native Federation with Vite (Angular 17+)

### Why Native Federation?

Angular 17+ uses **Vite + esbuild** as the default build system, which is significantly faster than Webpack. However, Webpack's Module Federation doesn't work with Vite. Enter **Native Federation** - a Vite-compatible implementation of Module Federation concepts.

### Key Differences: Webpack MF vs Native Federation

| Feature | Webpack Module Federation | Native Federation (Vite) |
|---------|---------------------------|-------------------------|
| **Build Tool** | Webpack 5 | Vite + esbuild |
| **Build Speed** | Slower (30-60s) | Ultra-fast (5-10s) |
| **Dev Server** | webpack-dev-server | Vite dev server |
| **HMR Speed** | 2-5s | <100ms |
| **Package** | `webpack` | `@angular-architects/native-federation` |
| **Config File** | `webpack.config.js` | `federation.config.js` |
| **Angular Version** | All versions | Angular 16+ |
| **Runtime** | Webpack runtime | Import maps + ES modules |

### Installation

```bash
# Create new Angular project with Vite (default in Angular 17+)
ng new my-shell-app --style=scss --routing

# Install Native Federation
npm install @angular-architects/native-federation -D

# Initialize Native Federation for shell
ng g @angular-architects/native-federation:init --project my-shell-app --type host

# Create remote applications
ng generate application dashboard --style=scss --routing
ng g @angular-architects/native-federation:init --project dashboard --type remote --port 4201

ng generate application products --style=scss --routing
ng g @angular-architects/native-federation:init --project products --type remote --port 4202
```

### Project Structure with Native Federation

```
native-federation-workspace/
├── projects/
│   ├── shell/                        # Host application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   └── app.component.ts
│   │   │   └── main.ts
│   │   ├── angular.json
│   │   └── federation.config.js      # ← Native Federation config
│   │
│   ├── dashboard/                    # Remote application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard.routes.ts
│   │   │   │   └── dashboard.component.ts
│   │   │   └── bootstrap.ts
│   │   └── federation.config.js      # ← Native Federation config
│   │
│   └── products/                     # Remote application
│       └── ...
│
└── angular.json
```

### Shell Application Setup (Native Federation)

#### 1. federation.config.js (Shell)

```javascript
const {
  withNativeFederation,
  shareAll
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  
  // Define remotes
  remotes: {
    dashboard: 'http://localhost:4201/remoteEntry.json',
    products: 'http://localhost:4202/remoteEntry.json',
    orders: 'http://localhost:4203/remoteEntry.json'
  },
  
  // Shared dependencies
  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true,
      requiredVersion: 'auto',
      includeSecondaries: false 
    }),
  },
  
  // Skip specific packages
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Skip secondary entry points that cause issues
  ]
});
```

#### 2. app.routes.ts (Shell with Native Federation)

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemoteModule('dashboard', './routes').then(m => m.DASHBOARD_ROUTES),
    // Alternative syntax with error handling
    // loadChildren: () =>
    //   loadRemoteModule({
    //     remoteName: 'dashboard',
    //     exposedModule: './routes'
    //   }).then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule('products', './routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('orders', './routes').then(m => m.ORDERS_ROUTES)
  }
];
```

#### 3. main.ts (Shell - Bootstrap)

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch(err => console.error('Federation init error:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('Bootstrap error:', err));
```

#### 4. bootstrap.ts (Shell - Application Bootstrap)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Application bootstrap error:', err));
```

#### 5. app.config.ts (Shell)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    provideAnimations()
  ]
};
```

#### 6. app.component.ts (Shell)

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="shell-header">
        <div class="logo">
          <h1>Micro Frontend App</h1>
          <span class="version">v{{ version() }}</span>
        </div>
        
        <nav class="main-nav">
          @for (item of navItems(); track item.path) {
            <a 
              [routerLink]="item.path" 
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/home' }"
              class="nav-link">
              <i [class]="'icon-' + item.icon"></i>
              <span>{{ item.label }}</span>
              @if (item.badge) {
                <span class="badge">{{ item.badge }}</span>
              }
            </a>
          }
        </nav>
        
        <div class="user-section">
          <button class="btn-primary">Settings</button>
        </div>
      </header>
      
      <main class="shell-content">
        <div class="breadcrumbs">
          <span>{{ currentRoute() }}</span>
        </div>
        
        <div class="mfe-container">
          @if (loading()) {
            <div class="loading-overlay">
              <div class="spinner"></div>
              <p>Loading {{ currentMfe() }}...</p>
            </div>
          }
          
          <router-outlet />
        </div>
      </main>
      
      <footer class="shell-footer">
        <p>Powered by Native Federation | Built with Angular {{ angularVersion }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f7fa;
    }
    
    .shell-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .version {
        padding: 0.25rem 0.5rem;
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
        font-size: 0.75rem;
      }
    }
    
    .main-nav {
      display: flex;
      gap: 0.5rem;
      flex: 1;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
      position: relative;
      
      &:hover {
        background: rgba(255,255,255,0.1);
      }
      
      &.active {
        background: rgba(255,255,255,0.2);
        font-weight: 500;
      }
      
      .badge {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        padding: 0.125rem 0.375rem;
        background: #ff4757;
        border-radius: 10px;
        font-size: 0.625rem;
        font-weight: 600;
      }
    }
    
    .shell-content {
      flex: 1;
      padding: 2rem;
    }
    
    .breadcrumbs {
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 0.875rem;
    }
    
    .mfe-container {
      position: relative;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      min-height: 400px;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.95);
      border-radius: 12px;
      z-index: 1000;
      
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      p {
        margin-top: 1rem;
        color: #666;
        font-size: 0.875rem;
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .shell-footer {
      padding: 1.5rem 2rem;
      text-align: center;
      background: #2c3e50;
      color: white;
      font-size: 0.875rem;
    }
    
    .btn-primary {
      padding: 0.5rem 1rem;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #f0f0f0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private router = inject(Router);
  
  version = signal('2.0.0');
  angularVersion = '17.0.0';
  loading = signal(false);
  currentRoute = signal('Home');
  currentMfe = signal('');
  
  navItems = signal<NavItem[]>([
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', badge: 3 },
    { path: '/products', label: 'Products', icon: 'inventory' },
    { path: '/orders', label: 'Orders', icon: 'shopping-cart' }
  ]);
  
  constructor() {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute(event.url);
    });
  }
  
  private updateCurrentRoute(url: string) {
    const segments = url.split('/').filter(s => s);
    const route = segments[0] || 'home';
    
    this.currentRoute.set(
      route.charAt(0).toUpperCase() + route.slice(1)
    );
    
    // Show loading for MFE routes
    const mfeRoutes = ['dashboard', 'products', 'orders'];
    if (mfeRoutes.includes(route)) {
      this.currentMfe.set(route);
      this.loading.set(true);
      
      // Hide loading after MFE loads
      setTimeout(() => this.loading.set(false), 500);
    } else {
      this.loading.set(false);
    }
  }
}
```

### Remote Application Setup (Native Federation)

#### 1. federation.config.js (Remote - Dashboard)

```javascript
const {
  withNativeFederation,
  shareAll
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'dashboard',
  
  // Expose modules
  exposes: {
    './routes': './projects/dashboard/src/app/dashboard.routes.ts',
    './component': './projects/dashboard/src/app/dashboard/dashboard.component.ts'
  },
  
  // Shared dependencies (MUST match shell)
  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true,
      requiredVersion: 'auto',
      includeSecondaries: false 
    }),
  },
  
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket'
  ]
});
```

#### 2. dashboard.routes.ts (Remote)

```typescript
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];
```

#### 3. dashboard.component.ts (Remote)

```typescript
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="dashboard-mfe">
      <div class="dashboard-header">
        <h2>Dashboard MFE</h2>
        <p class="subtitle">Loaded via Native Federation with Vite</p>
      </div>
      
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      } @else if (error()) {
        <div class="error-message">
          <h3>⚠️ Error Loading Data</h3>
          <p>{{ error() }}</p>
          <button (click)="retryLoad()">Retry</button>
        </div>
      } @else {
        <div class="metrics-grid">
          @for (metric of metrics(); track metric.title) {
            <div class="metric-card" [attr.data-trend]="metric.trend">
              <div class="metric-icon">{{ metric.icon }}</div>
              <div class="metric-content">
                <h3>{{ metric.title }}</h3>
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-change" [class]="'trend-' + metric.trend">
                  {{ metric.change }}
                </div>
              </div>
            </div>
          }
        </div>
        
        <div class="dashboard-actions">
          <button class="btn-primary" routerLink="/dashboard/analytics">
            View Analytics
          </button>
          <button class="btn-secondary" routerLink="/dashboard/reports">
            Generate Report
          </button>
        </div>
        
        <div class="mfe-info">
          <p>🚀 <strong>Native Federation</strong> enables fast, Vite-powered micro frontends</p>
          <ul>
            <li>⚡ Lightning-fast HMR (&lt;100ms)</li>
            <li>📦 ES Module-based runtime</li>
            <li>🔧 No Webpack required</li>
            <li>🎯 Perfect for Angular 17+</li>
          </ul>
        </div>
      }
      
      <router-outlet />
    </div>
  `,
  styles: [`
    .dashboard-mfe {
      padding: 0;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
      
      h2 {
        margin: 0 0 0.5rem;
        color: #2c3e50;
        font-size: 2rem;
        font-weight: 600;
      }
      
      .subtitle {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.875rem;
      }
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .metric-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
      }
      
      &[data-trend="up"] {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      }
      
      &[data-trend="down"] {
        background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      }
    }
    
    .metric-icon {
      font-size: 3rem;
    }
    
    .metric-content {
      flex: 1;
      
      h3 {
        margin: 0 0 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0.9;
      }
      
      .metric-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      
      .metric-change {
        font-size: 0.875rem;
        opacity: 0.9;
      }
    }
    
    .dashboard-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        
        &.btn-primary {
          background: #667eea;
          color: white;
          
          &:hover {
            background: #5568d3;
          }
        }
        
        &.btn-secondary {
          background: #ecf0f1;
          color: #2c3e50;
          
          &:hover {
            background: #d5dbdb;
          }
        }
      }
    }
    
    .mfe-info {
      padding: 1.5rem;
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      border-radius: 8px;
      
      p {
        margin: 0 0 1rem;
        font-size: 1rem;
      }
      
      ul {
        margin: 0;
        padding-left: 1.5rem;
        
        li {
          margin: 0.5rem 0;
          color: #555;
        }
      }
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      p {
        margin-top: 1rem;
        color: #666;
      }
    }
    
    .error-message {
      padding: 2rem;
      text-align: center;
      background: #fff5f5;
      border: 1px solid #fc8181;
      border-radius: 8px;
      
      h3 {
        color: #c53030;
        margin-bottom: 0.5rem;
      }
      
      p {
        color: #742a2a;
        margin-bottom: 1rem;
      }
      
      button {
        padding: 0.5rem 1rem;
        background: #c53030;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          background: #9b2c2c;
        }
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  loading = signal(true);
  error = signal<string | null>(null);
  
  metrics = signal<MetricCard[]>([
    {
      title: 'Total Revenue',
      value: '$54,239',
      change: '+12.5%',
      trend: 'up',
      icon: '💰'
    },
    {
      title: 'Active Users',
      value: '8,456',
      change: '+3.2%',
      trend: 'up',
      icon: '👥'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.8%',
      trend: 'down',
      icon: '📈'
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: '+15s',
      trend: 'up',
      icon: '⏱️'
    }
  ]);
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  private async loadDashboardData() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, fetch from API
      // const data = await firstValueFrom(
      //   this.http.get('/api/dashboard/metrics')
      // );
      
      this.loading.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load dashboard data');
      this.loading.set(false);
    }
  }
  
  retryLoad() {
    this.loadDashboardData();
  }
}
```

#### 4. main.ts & bootstrap.ts (Remote)

```typescript
// main.ts
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error('Federation init error:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('Bootstrap error:', err));

// bootstrap.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { DASHBOARD_ROUTES } from './app/dashboard.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(DASHBOARD_ROUTES),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
```

### Advanced Native Federation Features

#### 1. Dynamic Remote Configuration

```typescript
// dynamic-federation.service.ts
import { Injectable, signal } from '@angular/core';
import { setRemoteDefinitions } from '@angular-architects/native-federation';

interface RemoteDefinition {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFederationService {
  private remotes = signal<Map<string, RemoteDefinition>>(new Map());
  
  async loadRemoteConfig() {
    try {
      // Fetch remote configuration from API
      const response = await fetch('/api/mfe/config');
      const config = await response.json();
      
      // Set remote definitions dynamically
      await setRemoteDefinitions(config.remotes);
      
      // Update local state
      const remoteMap = new Map(
        config.remotes.map((r: RemoteDefinition) => [r.name, r])
      );
      this.remotes.set(remoteMap);
      
      console.log('Remote configuration loaded:', config.remotes);
    } catch (error) {
      console.error('Failed to load remote configuration:', error);
      throw error;
    }
  }
  
  getRemote(name: string): RemoteDefinition | undefined {
    return this.remotes().get(name);
  }
  
  getAllRemotes(): RemoteDefinition[] {
    return Array.from(this.remotes().values());
  }
}

// Usage in main.ts
import { initFederation } from '@angular-architects/native-federation';
import { DynamicFederationService } from './app/services/dynamic-federation.service';

(async () => {
  // Initialize federation
  await initFederation();
  
  // Load dynamic configuration
  const federationService = new DynamicFederationService();
  await federationService.loadRemoteConfig();
  
  // Bootstrap application
  await import('./bootstrap');
})();
```

#### 2. Version Management with Native Federation

```typescript
// version-check.service.ts
import { Injectable, signal } from '@angular/core';
import { getRemoteVersions } from '@angular-architects/native-federation';

interface VersionInfo {
  name: string;
  version: string;
  compatible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private versions = signal<VersionInfo[]>([]);
  
  async checkVersionCompatibility() {
    try {
      // Get versions of all loaded remotes
      const remoteVersions = await getRemoteVersions();
      
      const versionInfo: VersionInfo[] = Object.entries(remoteVersions).map(
        ([name, version]) => ({
          name,
          version: version as string,
          compatible: this.isCompatible(version as string)
        })
      );
      
      this.versions.set(versionInfo);
      
      // Log incompatible versions
      const incompatible = versionInfo.filter(v => !v.compatible);
      if (incompatible.length > 0) {
        console.warn('Incompatible remote versions:', incompatible);
      }
      
      return versionInfo;
    } catch (error) {
      console.error('Failed to check version compatibility:', error);
      return [];
    }
  }
  
  private isCompatible(version: string): boolean {
    // Implement semver compatibility check
    const [major] = version.split('.');
    const expectedMajor = '1'; // Your expected major version
    
    return major === expectedMajor;
  }
  
  getVersions() {
    return this.versions.asReadonly();
  }
}
```

#### 3. Preloading Strategy for Native Federation

```typescript
// native-federation-preload.service.ts
import { Injectable } from '@angular/core';
import { preloadRemote } from '@angular-architects/native-federation';

@Injectable({
  providedIn: 'root'
})
export class NativeFederationPreloadService {
  private preloadedRemotes = new Set<string>();
  
  async preloadRemotes(remoteNames: string[]) {
    const promises = remoteNames.map(name => this.preloadRemote(name));
    await Promise.allSettled(promises);
  }
  
  async preloadRemote(remoteName: string) {
    if (this.preloadedRemotes.has(remoteName)) {
      console.log(`Remote ${remoteName} already preloaded`);
      return;
    }
    
    try {
      console.log(`Preloading remote: ${remoteName}`);
      await preloadRemote(remoteName);
      this.preloadedRemotes.add(remoteName);
      console.log(`Remote ${remoteName} preloaded successfully`);
    } catch (error) {
      console.error(`Failed to preload remote ${remoteName}:`, error);
    }
  }
  
  isPreloaded(remoteName: string): boolean {
    return this.preloadedRemotes.has(remoteName);
  }
}

// Usage in app initializer
import { APP_INITIALIZER } from '@angular/core';
import { NativeFederationPreloadService } from './services/native-federation-preload.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (preloadService: NativeFederationPreloadService) => {
        return () => {
          // Preload critical remotes on app init
          return preloadService.preloadRemotes(['dashboard', 'products']);
        };
      },
      deps: [NativeFederationPreloadService],
      multi: true
    }
  ]
};
```

#### 4. Error Boundaries for Native Federation

```typescript
// mfe-loader.service.ts
import { Injectable, signal } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

interface LoadError {
  remoteName: string;
  error: Error;
  timestamp: number;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class MfeLoaderService {
  private errors = signal<LoadError[]>([]);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;
  
  async loadRemoteWithRetry(
    remoteName: string, 
    exposedModule: string,
    retryCount = 0
  ): Promise<any> {
    try {
      console.log(`Loading ${remoteName}/${exposedModule} (attempt ${retryCount + 1})`);
      
      const module = await loadRemoteModule(remoteName, exposedModule);
      
      // Clear error if successful after retry
      if (retryCount > 0) {
        this.clearError(remoteName);
      }
      
      return module;
    } catch (error) {
      console.error(`Failed to load ${remoteName}:`, error);
      
      // Record error
      this.recordError(remoteName, error as Error, retryCount);
      
      // Retry if under max retries
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retrying ${remoteName} in ${this.RETRY_DELAY}ms...`);
        await this.delay(this.RETRY_DELAY);
        return this.loadRemoteWithRetry(remoteName, exposedModule, retryCount + 1);
      }
      
      // Max retries exceeded, load fallback
      console.error(`Max retries exceeded for ${remoteName}. Loading fallback.`);
      return this.loadFallback();
    }
  }
  
  private recordError(remoteName: string, error: Error, retryCount: number) {
    this.errors.update(errors => [
      ...errors,
      {
        remoteName,
        error,
        timestamp: Date.now(),
        retryCount
      }
    ]);
  }
  
  private clearError(remoteName: string) {
    this.errors.update(errors => 
      errors.filter(e => e.remoteName !== remoteName)
    );
  }
  
  private async loadFallback() {
    // Load fallback component
    return import('./fallback/fallback.routes').then(m => m.FALLBACK_ROUTES);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getErrors() {
    return this.errors.asReadonly();
  }
}

// Usage in routes
export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: async () => {
      const loader = inject(MfeLoaderService);
      return loader.loadRemoteWithRetry('dashboard', './routes')
        .then(m => m.DASHBOARD_ROUTES);
    }
  }
];
```

### Build & Serve Commands

```json
// package.json scripts
{
  "scripts": {
    "start:shell": "ng serve shell --port 4200",
    "start:dashboard": "ng serve dashboard --port 4201",
    "start:products": "ng serve products --port 4202",
    "start:all": "concurrently \"npm:start:shell\" \"npm:start:dashboard\" \"npm:start:products\"",
    
    "build:shell": "ng build shell --configuration production",
    "build:dashboard": "ng build dashboard --configuration production",
    "build:products": "ng build products --configuration production",
    "build:all": "npm run build:shell && npm run build:dashboard && npm run build:products"
  }
}
```

### Performance Comparison

| Metric | Webpack Module Federation | Native Federation (Vite) |
|--------|---------------------------|-------------------------|
| **Cold Start** | ~15-20s | ~2-3s | 
| **HMR** | 2-5s | <100ms |
| **Production Build** | ~45-60s | ~8-12s |
| **Bundle Size** | Larger (webpack runtime) | Smaller (native ESM) |
| **DevEx** | Good | Excellent |
| **Maturity** | Very mature | Newer (but stable) |

### Migration from Webpack Module Federation

```bash
# Step 1: Update to Angular 17+
ng update @angular/core @angular/cli

# Step 2: Install Native Federation
npm install @angular-architects/native-federation -D

# Step 3: Initialize each application
ng g @angular-architects/native-federation:init --project shell --type host
ng g @angular-architects/native-federation:init --project dashboard --type remote --port 4201

# Step 4: Convert webpack.config.js to federation.config.js
# Copy remotes, exposes, and shared config

# Step 5: Update imports
# Replace: @angular-architects/module-federation
# With: @angular-architects/native-federation

# Step 6: Test and deploy
npm run start:all
```

### Best Practices for Native Federation

1. **Shared Dependencies**
```javascript
// Always use shareAll for Angular apps
shared: {
  ...shareAll({ 
    singleton: true,     // Prevent duplicate Angular instances
    strictVersion: true, // Enforce version compatibility
    requiredVersion: 'auto'
  })
}
```

2. **Error Handling**
```typescript
// Always wrap loadRemoteModule in try-catch
try {
  const module = await loadRemoteModule('dashboard', './routes');
  return module.DASHBOARD_ROUTES;
} catch (error) {
  console.error('Failed to load remote:', error);
  return fallbackRoutes;
}
```

3. **Performance**
```typescript
// Preload critical remotes
await preloadRemote('dashboard');

// Lazy load non-critical remotes
loadRemoteModule('admin', './routes');
```

4. **Versioning**
```javascript
// federation.config.js
module.exports = withNativeFederation({
  name: 'dashboard',
  version: '1.2.0', // Explicit versioning
  exposes: { /* ... */ },
  shared: { /* ... */ }
});
```

### Troubleshooting Common Issues

#### 1. "Cannot find module" error
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build:dashboard
```

#### 2. Version mismatch
```javascript
// Ensure exact same versions in all apps
// Check package.json
{
  "@angular/core": "17.0.0", // Same everywhere
  "@angular/common": "17.0.0" // Same everywhere
}
```

#### 3. CORS issues in development
```typescript
// vite.config.ts (if needed)
export default defineConfig({
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

#### 4. Shared state not working
```typescript
// Make sure shared services are in providedIn: 'root'
@Injectable({
  providedIn: 'root' // ← Critical for shared state
})
export class GlobalStateService { }
```

---

## Architecture Patterns

### 1. Shell Pattern (Recommended)

**Single shell application loads multiple micro frontends**

```typescript
// Shell owns: Authentication, routing, shared layout
// Remotes own: Feature-specific code

/**
 * Shell Architecture
 * 
 * ┌─────────────────────────────────────┐
 * │          Shell Application          │
 * │  ┌──────────────────────────────┐  │
 * │  │   Navigation & Auth          │  │
 * │  └──────────────────────────────┘  │
 * │  ┌──────────────────────────────┐  │
 * │  │   Router Outlet              │  │
 * │  │   ┌────────────────────┐     │  │
 * │  │   │  MFE 1 (Remote)    │     │  │
 * │  │   └────────────────────┘     │  │
 * │  └──────────────────────────────┘  │
 * └─────────────────────────────────────┘
 */
```

### 2. Multi-Shell Pattern

**Multiple independent applications sharing remotes**

```typescript
/**
 * Multi-Shell Architecture
 * 
 * ┌─────────────┐     ┌─────────────┐
 * │   Shell A   │     │   Shell B   │
 * │  (Customer) │     │  (Admin)    │
 * └──────┬──────┘     └──────┬──────┘
 *        │                   │
 *        └───────┬───────────┘
 *                │
 *        ┌───────▼────────┐
 *        │  Shared MFEs   │
 *        │  ┌──────────┐  │
 *        │  │ Products │  │
 *        │  │  Orders  │  │
 *        │  │  Users   │  │
 *        │  └──────────┘  │
 *        └────────────────┘
 */
```

### 3. Independent Applications Pattern

**Completely autonomous applications**

```typescript
// Each MFE is a standalone application
// Communication via custom events or shared state

interface MicroFrontendManifest {
  name: string;
  version: string;
  entry: string;
  routes: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendRegistry {
  private registry = signal<Map<string, MicroFrontendManifest>>(new Map());
  
  register(manifest: MicroFrontendManifest) {
    this.registry.update(reg => {
      reg.set(manifest.name, manifest);
      return new Map(reg);
    });
  }
  
  get(name: string): MicroFrontendManifest | undefined {
    return this.registry().get(name);
  }
  
  getAll(): MicroFrontendManifest[] {
    return Array.from(this.registry().values());
  }
}
```

---

## Best Practices

### 1. Dependency Management

```typescript
// webpack.config.js - Strict version control
shared: {
  '@angular/core': {
    singleton: true,        // Only one version allowed
    strictVersion: true,    // Must match exactly
    requiredVersion: '17.0.0'
  },
  
  // Allow multiple versions for non-critical deps
  'lodash': {
    singleton: false,
    strictVersion: false,
    requiredVersion: '^4.17.0'
  }
}
```

### 2. Versioning Strategy

```typescript
// version.service.ts
import { Injectable, signal } from '@angular/core';

interface VersionInfo {
  app: string;
  version: string;
  buildDate: string;
  dependencies: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private versionInfo = signal<VersionInfo>({
    app: 'shell',
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    dependencies: {
      dashboard: '1.2.0',
      products: '2.1.0',
      orders: '1.5.0'
    }
  });
  
  getVersionInfo() {
    return this.versionInfo.asReadonly();
  }
  
  isCompatible(remoteName: string, remoteVersion: string): boolean {
    const expectedVersion = this.versionInfo().dependencies[remoteName];
    return this.semverSatisfies(remoteVersion, expectedVersion);
  }
  
  private semverSatisfies(version: string, range: string): boolean {
    // Implement semver comparison
    // Or use 'semver' library
    return true; // Simplified
  }
}
```

### 3. Error Boundaries

```typescript
// error-boundary.component.ts
import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-boundary',
  imports: [CommonModule],
  template: `
    @if (hasError()) {
      <div class="error-boundary">
        <h3>Something went wrong</h3>
        <p>{{ errorMessage() }}</p>
        <button (click)="retry()">Retry</button>
        <button (click)="reportError()">Report Issue</button>
      </div>
    } @else {
      <ng-content />
    }
  `,
  styles: [`
    .error-boundary {
      padding: 2rem;
      text-align: center;
      background: #ffebee;
      border: 1px solid #c62828;
      border-radius: 8px;
      
      h3 {
        color: #c62828;
        margin-bottom: 1rem;
      }
      
      button {
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:first-of-type {
          background: #1976d2;
          color: white;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorBoundaryComponent {
  errorContext = input<string>('Component');
  hasError = signal(false);
  errorMessage = signal('');
  
  errorCaught = output<Error>();
  
  catchError(error: Error) {
    this.hasError.set(true);
    this.errorMessage.set(error.message);
    this.errorCaught.emit(error);
    console.error(`Error in ${this.errorContext()}:`, error);
  }
  
  retry() {
    this.hasError.set(false);
    this.errorMessage.set('');
  }
  
  reportError() {
    // Send error to monitoring service
    console.log('Reporting error:', this.errorMessage());
  }
}

// Usage in shell
@Component({
  selector: 'app-root',
  template: `
    <app-error-boundary 
      errorContext="Dashboard MFE"
      (errorCaught)="handleMfeError($event)">
      <router-outlet />
    </app-error-boundary>
  `
})
export class AppComponent {
  handleMfeError(error: Error) {
    // Log to monitoring service (e.g., Sentry)
    console.error('MFE Error:', error);
  }
}
```

### 4. Lazy Loading & Code Splitting

```typescript
// app.routes.ts with strategic code splitting
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  // Eager load critical paths
  {
    path: 'home',
    loadComponent: () => 
      import('./home/home.component').then(m => m.HomeComponent)
  },
  
  // Lazy load heavy features
  {
    path: 'dashboard',
    loadChildren: async () => {
      try {
        const module = await loadRemoteModule({
          type: 'module',
          remoteEntry: 'http://localhost:4201/remoteEntry.js',
          exposedModule: './Routes'
        });
        return module.DASHBOARD_ROUTES;
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        // Fallback route
        return import('./fallback/fallback.routes').then(m => m.FALLBACK_ROUTES);
      }
    }
  },
  
  // Preload strategy for common paths
  {
    path: 'products',
    data: { preload: true },
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.PRODUCTS_ROUTES)
  }
];
```

### 5. Preloading Strategy

```typescript
// custom-preload-strategy.ts
import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Preload based on route data
    if (route.data?.['preload']) {
      const delay = route.data['delay'] || 0;
      console.log(`Preloading: ${route.path}`);
      
      // Delay preloading if specified
      return timer(delay).pipe(
        mergeMap(() => load())
      );
    }
    
    return of(null);
  }
}

// app.config.ts
import { provideRouter, withPreloading } from '@angular/router';
import { CustomPreloadStrategy } from './custom-preload-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(CustomPreloadStrategy)
    )
  ]
};
```

### 6. Shared Component Library

```typescript
// libs/shared-ui/button/button.component.ts
import { Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'lib-button',
  imports: [],
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="handleClick($event)">
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &.primary {
        background: #1976d2;
        color: white;
        
        &:hover:not(:disabled) {
          background: #1565c0;
        }
      }
      
      &.secondary {
        background: #f5f5f5;
        color: #333;
        
        &:hover:not(:disabled) {
          background: #e0e0e0;
        }
      }
      
      &.danger {
        background: #c62828;
        color: white;
        
        &:hover:not(:disabled) {
          background: #b71c1c;
        }
      }
      
      &.small {
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      }
      
      &.medium {
        padding: 0.5rem 1rem;
        font-size: 1rem;
      }
      
      &.large {
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
      }
      
      .spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  
  clicked = output<MouseEvent>();
  
  buttonClasses = computed(() => {
    return `${this.variant()} ${this.size()}`;
  });
  
  handleClick(event: MouseEvent) {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
```

---

## Communication Strategies

### 1. Event Bus Pattern

```typescript
// shared-data-access/event-bus.service.ts
import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<AppEvent>();
  private eventHistory = signal<AppEvent[]>([]);
  
  // Emit an event
  emit<T>(type: string, payload: T, source: string = 'unknown') {
    const event: AppEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
      source
    };
    
    this.eventSubject.next(event);
    this.eventHistory.update(history => [...history, event]);
    
    console.log(`Event emitted: ${type}`, event);
  }
  
  // Listen to specific event type
  on<T>(type: string): Observable<T> {
    return this.eventSubject.pipe(
      filter(event => event.type === type),
      map(event => event.payload as T)
    );
  }
  
  // Listen to multiple event types
  onAny(types: string[]): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => types.includes(event.type))
    );
  }
  
  // Get event history
  getHistory() {
    return this.eventHistory.asReadonly();
  }
  
  // Clear history
  clearHistory() {
    this.eventHistory.set([]);
  }
}

// Usage in Dashboard MFE
@Component({
  selector: 'app-dashboard',
  template: `...`
})
export class DashboardComponent implements OnInit {
  private eventBus = inject(EventBusService);
  
  ngOnInit() {
    // Listen for user updates from other MFEs
    this.eventBus.on<User>('user:updated').subscribe(user => {
      console.log('User updated:', user);
      this.refreshDashboard();
    });
    
    // Listen for theme changes
    this.eventBus.on<string>('theme:changed').subscribe(theme => {
      console.log('Theme changed to:', theme);
      this.applyTheme(theme);
    });
  }
  
  onUserAction() {
    // Emit event to other MFEs
    this.eventBus.emit('dashboard:action', {
      action: 'user_clicked',
      data: { /* ... */ }
    }, 'dashboard');
  }
}
```

### 2. Shared State Management

```typescript
// shared-data-access/global-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface GlobalState {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  // Private state
  private state = signal<GlobalState>({
    user: null,
    theme: 'light',
    language: 'en',
    notifications: []
  });
  
  // Public read-only selectors
  user = computed(() => this.state().user);
  theme = computed(() => this.state().theme);
  language = computed(() => this.state().language);
  notifications = computed(() => this.state().notifications);
  
  isAuthenticated = computed(() => this.state().user !== null);
  unreadNotifications = computed(() => 
    this.state().notifications.filter(n => !n.read).length
  );
  
  // State mutations
  setUser(user: User | null) {
    this.state.update(s => ({ ...s, user }));
  }
  
  setTheme(theme: 'light' | 'dark') {
    this.state.update(s => ({ ...s, theme }));
    localStorage.setItem('theme', theme);
  }
  
  setLanguage(language: string) {
    this.state.update(s => ({ ...s, language }));
    localStorage.setItem('language', language);
  }
  
  addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      timestamp: Date.now()
    };
    
    this.state.update(s => ({
      ...s,
      notifications: [...s.notifications, newNotification]
    }));
  }
  
  markNotificationRead(id: string) {
    this.state.update(s => ({
      ...s,
      notifications: s.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }
  
  clearNotifications() {
    this.state.update(s => ({ ...s, notifications: [] }));
  }
  
  // Hydrate state from storage
  hydrate() {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const language = localStorage.getItem('language') || 'en';
    
    this.state.update(s => ({ ...s, theme, language }));
  }
}

// Usage in any MFE
@Component({
  selector: 'app-products',
  template: `
    <div [attr.data-theme]="theme()">
      @if (isAuthenticated()) {
        <p>Welcome, {{ user()?.name }}!</p>
      }
      
      <div class="notifications">
        {{ unreadCount() }} unread notifications
      </div>
    </div>
  `
})
export class ProductsComponent {
  private globalState = inject(GlobalStateService);
  
  user = this.globalState.user;
  theme = this.globalState.theme;
  isAuthenticated = this.globalState.isAuthenticated;
  unreadCount = this.globalState.unreadNotifications;
}
```

### 3. Custom Events (Window)

```typescript
// shared-util/custom-events.service.ts
import { Injectable } from '@angular/core';

interface CustomEventData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomEventsService {
  // Dispatch custom event
  dispatch<T extends CustomEventData>(eventName: string, detail: T) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });
    
    window.dispatchEvent(event);
  }
  
  // Listen to custom event
  listen<T extends CustomEventData>(
    eventName: string,
    handler: (detail: T) => void
  ): () => void {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      handler(customEvent.detail);
    };
    
    window.addEventListener(eventName, listener);
    
    // Return cleanup function
    return () => {
      window.removeEventListener(eventName, listener);
    };
  }
}

// Usage in Dashboard MFE
@Component({
  selector: 'app-dashboard'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private customEvents = inject(CustomEventsService);
  private cleanupFn?: () => void;
  
  ngOnInit() {
    // Listen for events from other MFEs
    this.cleanupFn = this.customEvents.listen('product:selected', (detail) => {
      console.log('Product selected:', detail);
      this.handleProductSelection(detail);
    });
  }
  
  ngOnDestroy() {
    // Cleanup listener
    this.cleanupFn?.();
  }
  
  selectDashboardItem(item: any) {
    // Dispatch event to other MFEs
    this.customEvents.dispatch('dashboard:item-selected', {
      itemId: item.id,
      source: 'dashboard'
    });
  }
}
```

### 4. RxJS Subjects (Shared Service)

```typescript
// shared-data-access/message-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface Message<T = any> {
  channel: string;
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageBusService {
  private messageStream = new Subject<Message>();
  private channelStates = new Map<string, BehaviorSubject<any>>();
  
  // Send message to channel
  send<T>(channel: string, data: T) {
    const message: Message<T> = {
      channel,
      data,
      timestamp: Date.now()
    };
    
    this.messageStream.next(message);
    
    // Update channel state if exists
    if (this.channelStates.has(channel)) {
      this.channelStates.get(channel)!.next(data);
    }
  }
  
  // Subscribe to channel
  subscribe<T>(channel: string): Observable<T> {
    return this.messageStream.pipe(
      filter(msg => msg.channel === channel),
      map(msg => msg.data as T)
    );
  }
  
  // Create stateful channel
  createStatefulChannel<T>(channel: string, initialValue: T): Observable<T> {
    if (!this.channelStates.has(channel)) {
      this.channelStates.set(channel, new BehaviorSubject(initialValue));
    }
    
    return this.channelStates.get(channel)!.asObservable();
  }
  
  // Get current state of channel
  getChannelState<T>(channel: string): T | undefined {
    return this.channelStates.get(channel)?.value;
  }
}

// Usage example
@Component({
  selector: 'app-products'
})
export class ProductsComponent implements OnInit {
  private messageBus = inject(MessageBusService);
  
  ngOnInit() {
    // Subscribe to cart updates from other MFEs
    this.messageBus.subscribe<CartItem>('cart:item-added')
      .subscribe(item => {
        console.log('Item added to cart:', item);
        this.updateProductAvailability(item);
      });
    
    // Create stateful channel for selected product
    this.messageBus.createStatefulChannel('product:selected', null)
      .subscribe(product => {
        if (product) {
          this.highlightProduct(product);
        }
      });
  }
  
  onProductClick(product: Product) {
    // Notify other MFEs
    this.messageBus.send('product:selected', product);
    this.messageBus.send('analytics:track', {
      event: 'product_view',
      productId: product.id
    });
  }
}
```

---

## State Management

### 1. NgRx with Module Federation

```typescript
// shared-data-access/store/index.ts
import { createAction, createReducer, createSelector, on, props } from '@ngrx/store';
import { createFeature } from '@ngrx/store';

// State interface
export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  loading: false,
  error: null
};

// Actions
export const loadUser = createAction('[Auth] Load User');
export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User }>()
);
export const loadUserFailure = createAction(
  '[Auth] Load User Failure',
  props<{ error: string }>()
);
export const logout = createAction('[Auth] Logout');

// Reducer
const appReducer = createReducer(
  initialState,
  on(loadUser, state => ({ ...state, loading: true, error: null })),
  on(loadUserSuccess, (state, { user }) => ({ 
    ...state, 
    user, 
    loading: false 
  })),
  on(loadUserFailure, (state, { error }) => ({ 
    ...state, 
    error, 
    loading: false 
  })),
  on(logout, () => initialState)
);

// Feature
export const appFeature = createFeature({
  name: 'app',
  reducer: appReducer
});

// Selectors
export const {
  selectUser,
  selectLoading,
  selectError
} = appFeature;

export const selectIsAuthenticated = createSelector(
  selectUser,
  user => user !== null
);

// Store configuration in shell
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appFeature } from '@my-org/shared-data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      [appFeature.name]: appFeature.reducer
    }),
    provideEffects([AuthEffects])
  ]
};

// Usage in any MFE
@Component({
  selector: 'app-dashboard'
})
export class DashboardComponent {
  private store = inject(Store);
  
  user$ = this.store.select(selectUser);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  
  ngOnInit() {
    this.store.dispatch(loadUser());
  }
  
  logout() {
    this.store.dispatch(logout());
  }
}
```

### 2. Signal Store (Recommended for Modern Angular)

```typescript
// shared-data-access/stores/auth.store.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Private state
  private state = signal<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null
  });
  
  // Public selectors
  user = computed(() => this.state().user);
  token = computed(() => this.state().token);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  isAuthenticated = computed(() => this.state().user !== null);
  userRole = computed(() => this.state().user?.role ?? 'guest');
  
  // Computed permissions
  canAccessAdmin = computed(() => 
    ['admin', 'superadmin'].includes(this.userRole())
  );
  
  canAccessDashboard = computed(() => 
    this.isAuthenticated() && this.userRole() !== 'guest'
  );
  
  // Actions
  async login(email: string, password: string) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    
    try {
      const response = await firstValueFrom(
        this.http.post<{ user: User; token: string }>('/api/auth/login', {
          email,
          password
        })
      );
      
      this.state.update(s => ({
        ...s,
        user: response.user,
        token: response.token,
        loading: false
      }));
      
      // Store token
      localStorage.setItem('auth_token', response.token);
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
      
    } catch (error: any) {
      this.state.update(s => ({
        ...s,
        loading: false,
        error: error.message || 'Login failed'
      }));
      
      throw error;
    }
  }
  
  async logout() {
    this.state.update(s => ({ ...s, loading: true }));
    
    try {
      await firstValueFrom(this.http.post('/api/auth/logout', {}));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      this.state.set({
        user: null,
        token: null,
        loading: false,
        error: null
      });
      
      // Clear storage
      localStorage.removeItem('auth_token');
      
      // Navigate to home
      this.router.navigate(['/']);
    }
  }
  
  async refreshUser() {
    const token = this.token() || localStorage.getItem('auth_token');
    
    if (!token) {
      return;
    }
    
    this.state.update(s => ({ ...s, loading: true }));
    
    try {
      const user = await firstValueFrom(
        this.http.get<User>('/api/auth/me')
      );
      
      this.state.update(s => ({ ...s, user, loading: false }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      this.logout();
    }
  }
  
  updateUser(updates: Partial<User>) {
    this.state.update(s => ({
      ...s,
      user: s.user ? { ...s.user, ...updates } : null
    }));
  }
  
  clearError() {
    this.state.update(s => ({ ...s, error: null }));
  }
}

// Usage in any MFE
@Component({
  selector: 'app-user-profile'
})
export class UserProfileComponent {
  private authStore = inject(AuthStore);
  
  user = this.authStore.user;
  loading = this.authStore.loading;
  error = this.authStore.error;
  canAccessAdmin = this.authStore.canAccessAdmin;
  
  async updateProfile(updates: Partial<User>) {
    try {
      await this.authStore.updateUser(updates);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }
  
  logout() {
    this.authStore.logout();
  }
}
```

---

## Routing & Navigation

### 1. Dynamic Route Configuration

```typescript
// shell/app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RemoteConfigService } from './services/remote-config.service';

// Function to load routes dynamically
function loadMicroFrontend(remoteName: string, exposedModule: string = './Routes') {
  const configService = inject(RemoteConfigService);
  const config = configService.getRemoteConfig(remoteName);
  
  if (!config) {
    throw new Error(`Remote ${remoteName} not configured`);
  }
  
  return loadRemoteModule({
    type: 'module',
    remoteEntry: config.url,
    exposedModule
  });
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, featureGuard('dashboard')],
    loadChildren: () =>
      loadMicroFrontend('dashboard').then(m => m.DASHBOARD_ROUTES),
    data: {
      preload: true,
      requiredRole: 'user'
    }
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin', 'superadmin'])],
    loadChildren: () =>
      loadMicroFrontend('admin').then(m => m.ADMIN_ROUTES),
    data: {
      preload: false,
      requiredRole: 'admin'
    }
  }
];
```

### 2. Remote Configuration Service

```typescript
// services/remote-config.service.ts
import { Injectable, signal } from '@angular/core';

interface RemoteConfig {
  name: string;
  url: string;
  exposedModules: string[];
  version: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remotes = signal<Map<string, RemoteConfig>>(new Map([
    ['dashboard', {
      name: 'dashboard',
      url: this.getRemoteUrl('dashboard', 4201),
      exposedModules: ['./Routes', './Component'],
      version: '1.0.0',
      enabled: true
    }],
    ['products', {
      name: 'products',
      url: this.getRemoteUrl('products', 4202),
      exposedModules: ['./Routes'],
      version: '2.0.0',
      enabled: true
    }],
    ['admin', {
      name: 'admin',
      url: this.getRemoteUrl('admin', 4203),
      exposedModules: ['./Routes'],
      version: '1.0.0',
      enabled: true
    }]
  ]));
  
  getRemoteConfig(name: string): RemoteConfig | undefined {
    return this.remotes().get(name);
  }
  
  getAllRemotes(): RemoteConfig[] {
    return Array.from(this.remotes().values());
  }
  
  getEnabledRemotes(): RemoteConfig[] {
    return this.getAllRemotes().filter(r => r.enabled);
  }
  
  updateRemoteUrl(name: string, url: string) {
    this.remotes.update(map => {
      const remote = map.get(name);
      if (remote) {
        map.set(name, { ...remote, url });
      }
      return new Map(map);
    });
  }
  
  toggleRemote(name: string, enabled: boolean) {
    this.remotes.update(map => {
      const remote = map.get(name);
      if (remote) {
        map.set(name, { ...remote, enabled });
      }
      return new Map(map);
    });
  }
  
  private getRemoteUrl(name: string, port: number): string {
    const isProd = false; // From environment
    return isProd
      ? `https://${name}.example.com/remoteEntry.js`
      : `http://localhost:${port}/remoteEntry.js`;
  }
}
```

### 3. Navigation Service

```typescript
// services/navigation.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  remote?: string;
  requiredRole?: string;
  children?: NavigationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  
  currentUrl = signal('');
  breadcrumbs = signal<Breadcrumb[]>([]);
  
  navigationItems = signal<NavigationItem[]>([
    {
      path: '/home',
      label: 'Home',
      icon: 'home'
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      remote: 'dashboard',
      requiredRole: 'user'
    },
    {
      path: '/products',
      label: 'Products',
      icon: 'inventory',
      remote: 'products',
      children: [
        { path: '/products/list', label: 'Product List' },
        { path: '/products/categories', label: 'Categories' }
      ]
    },
    {
      path: '/admin',
      label: 'Admin',
      icon: 'admin_panel_settings',
      remote: 'admin',
      requiredRole: 'admin'
    }
  ]);
  
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.url);
      this.updateBreadcrumbs(event.url);
    });
  }
  
  navigate(path: string) {
    return this.router.navigate([path]);
  }
  
  navigateWithParams(path: string, params: Record<string, any>) {
    return this.router.navigate([path], { queryParams: params });
  }
  
  private updateBreadcrumbs(url: string) {
    const segments = url.split('/').filter(s => s);
    const breadcrumbs: Breadcrumb[] = [];
    
    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: this.formatLabel(segment),
        url: currentPath
      });
    }
    
    this.breadcrumbs.set(breadcrumbs);
  }
  
  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Breadcrumb component
@Component({
  selector: 'app-breadcrumbs',
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumbs">
      @for (crumb of breadcrumbs(); track crumb.url; let last = $last) {
        @if (!last) {
          <a [routerLink]="crumb.url">{{ crumb.label }}</a>
          <span class="separator">/</span>
        } @else {
          <span class="current">{{ crumb.label }}</span>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0;
      font-size: 0.875rem;
      
      a {
        color: #1976d2;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .separator {
        color: #999;
      }
      
      .current {
        color: #333;
        font-weight: 500;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  private navService = inject(NavigationService);
  breadcrumbs = this.navService.breadcrumbs;
}
```

---

## Deployment Strategies

### 1. Independent Deployment

```yaml
# .github/workflows/deploy-mfe.yml
name: Deploy Micro Frontend

on:
  push:
    branches: [main]
    paths:
      - 'apps/dashboard/**'
      - 'libs/shared-ui/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Dashboard MFE
        run: npm run build:dashboard -- --configuration production
      
      - name: Run tests
        run: npm run test:dashboard -- --watch=false --code-coverage
      
      - name: Deploy to CDN
        run: |
          aws s3 sync dist/dashboard s3://mfe-dashboard --delete
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
            --paths "/*"
      
      - name: Update version registry
        run: |
          curl -X POST https://api.example.com/mfe-registry \
            -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
            -d '{
              "name": "dashboard",
              "version": "${{ github.sha }}",
              "url": "https://cdn.example.com/dashboard/remoteEntry.js"
            }'
```

### 2. Version Management

```typescript
// version-registry.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MfeVersion {
  name: string;
  version: string;
  url: string;
  deployedAt: string;
  status: 'active' | 'deprecated' | 'deprecated';
}

@Injectable({
  providedIn: 'root'
})
export class VersionRegistryService {
  private http = inject(HttpClient);
  private versions = signal<Map<string, MfeVersion[]>>(new Map());
  
  async fetchVersions() {
    try {
      const response = await firstValueFrom(
        this.http.get<MfeVersion[]>('https://api.example.com/mfe-registry')
      );
      
      const versionMap = new Map<string, MfeVersion[]>();
      response.forEach(version => {
        const existing = versionMap.get(version.name) || [];
        versionMap.set(version.name, [...existing, version]);
      });
      
      this.versions.set(versionMap);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    }
  }
  
  getActiveVersion(mfeName: string): MfeVersion | undefined {
    const versions = this.versions().get(mfeName);
    return versions?.find(v => v.status === 'active');
  }
  
  getAllVersions(mfeName: string): MfeVersion[] {
    return this.versions().get(mfeName) || [];
  }
}
```

### 3. Canary Deployment

```typescript
// canary-loader.service.ts
import { Injectable, inject } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

interface CanaryConfig {
  stable: string;
  canary: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanaryLoaderService {
  private canaryConfigs = new Map<string, CanaryConfig>([
    ['dashboard', {
      stable: 'http://localhost:4201/remoteEntry.js',
      canary: 'http://localhost:4201/canary/remoteEntry.js',
      percentage: 10 // 10% traffic to canary
    }]
  ]);
  
  loadWithCanary(remoteName: string, exposedModule: string) {
    const config = this.canaryConfigs.get(remoteName);
    
    if (!config) {
      throw new Error(`No canary config for ${remoteName}`);
    }
    
    // Determine which version to load
    const useCanary = Math.random() * 100 < config.percentage;
    const remoteEntry = useCanary ? config.canary : config.stable;
    
    console.log(`Loading ${remoteName} from ${useCanary ? 'canary' : 'stable'}`);
    
    return loadRemoteModule({
      type: 'module',
      remoteEntry,
      exposedModule
    });
  }
}
```

---

## Testing Strategies

### 1. Unit Testing MFEs

```typescript
// dashboard.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DashboardService
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load dashboard stats on init', () => {
    const mockStats = {
      totalUsers: 1000,
      activeUsers: 750,
      revenue: 50000,
      orders: 250
    };
    
    component.ngOnInit();
    
    const req = httpMock.expectOne('https://api.example.com/dashboard/stats');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
    
    expect(component.rawStats()).toEqual(mockStats);
    expect(component.loading()).toBe(false);
  });
  
  it('should handle loading error', () => {
    component.ngOnInit();
    
    const req = httpMock.expectOne('https://api.example.com/dashboard/stats');
    req.error(new ProgressEvent('error'));
    
    expect(component.error()).toBeTruthy();
    expect(component.loading()).toBe(false);
  });
  
  it('should compute stats correctly', () => {
    component['rawStats'].set({
      totalUsers: 1000,
      activeUsers: 750,
      revenue: 50000,
      orders: 250
    });
    
    const stats = component.stats();
    
    expect(stats).toHaveLength(4);
    expect(stats[0].value).toBe('1,000');
    expect(stats[2].value).toBe('$50,000');
  });
});
```

### 2. Integration Testing

```typescript
// mfe-integration.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('MFE Integration', () => {
  let router: Router;
  let location: Location;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes)
      ]
    });
    
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });
  
  it('should navigate to dashboard MFE', async () => {
    await router.navigate(['/dashboard']);
    expect(location.path()).toBe('/dashboard');
  });
  
  it('should lazy load dashboard routes', async () => {
    const dashboardRoute = routes.find(r => r.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.loadChildren).toBeDefined();
  });
});
```

### 3. E2E Testing with Playwright

```typescript
// e2e/mfe-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Micro Frontend Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });
  
  test('should navigate between MFEs', async ({ page }) => {
    // Navigate to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h2')).toContainText('Dashboard');
    
    // Navigate to products
    await page.click('text=Products');
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h2')).toContainText('Products');
  });
  
  test('should load dashboard stats', async ({ page }) => {
    await page.click('text=Dashboard');
    
    // Wait for stats to load
    await page.waitForSelector('.stats-grid');
    
    // Check stats cards
    const statsCards = await page.locator('.stat-card').count();
    expect(statsCards).toBe(4);
  });
  
  test('should handle MFE load error gracefully', async ({ page }) => {
    // Mock failed MFE load
    await page.route('**/remoteEntry.js', route => route.abort());
    
    await page.click('text=Dashboard');
    
    // Should show error boundary
    await expect(page.locator('.error-boundary')).toBeVisible();
    await expect(page.locator('.error-boundary h3'))
      .toContainText('Something went wrong');
  });
});
```

### 4. Contract Testing

```typescript
// contract-tests/dashboard-contract.spec.ts
import { DashboardService } from '../dashboard.service';

describe('Dashboard Contract Tests', () => {
  let service: DashboardService;
  
  beforeEach(() => {
    service = new DashboardService(/* mock http */);
  });
  
  it('should return stats with correct structure', async () => {
    const stats = await service.getStats();
    
    // Contract: stats must have these properties
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('activeUsers');
    expect(stats).toHaveProperty('revenue');
    expect(stats).toHaveProperty('orders');
    
    // Contract: all values must be numbers
    expect(typeof stats.totalUsers).toBe('number');
    expect(typeof stats.activeUsers).toBe('number');
    expect(typeof stats.revenue).toBe('number');
    expect(typeof stats.orders).toBe('number');
  });
});
```

---

## Performance Optimization

### 1. Bundle Size Analysis

```bash
# Analyze bundle size
npx webpack-bundle-analyzer dist/dashboard/stats.json

# Set budget limits in angular.json
```

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ]
}
```

### 2. Performance Monitoring

```typescript
// performance-monitor.service.ts
import { Injectable } from '@angular/core';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metrics: PerformanceMetric[] = [];
  
  // Measure MFE load time
  measureMfeLoad(mfeName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    
    this.addMetric({
      name: `mfe_load_${mfeName}`,
      value: loadTime,
      timestamp: Date.now()
    });
    
    console.log(`${mfeName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send to analytics
    this.sendToAnalytics('mfe_load_time', {
      mfe: mfeName,
      duration: loadTime
    });
  }
  
  // Measure route change
  measureRouteChange(from: string, to: string, duration: number) {
    this.addMetric({
      name: 'route_change',
      value: duration,
      timestamp: Date.now()
    });
    
    this.sendToAnalytics('route_change', {
      from,
      to,
      duration
    });
  }
  
  // Get Core Web Vitals
  measureCoreWebVitals() {
    if ('web-vital' in window) {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.addMetric({
          name: 'lcp',
          value: lastEntry.startTime,
          timestamp: Date.now()
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.addMetric({
            name: 'fid',
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now()
          });
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // CLS (Cumulative Layout Shift)
      let clsScore = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        
        this.addMetric({
          name: 'cls',
          value: clsScore,
          timestamp: Date.now()
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }
  
  private sendToAnalytics(eventName: string, data: any) {
    // Send to your analytics service (Google Analytics, etc.)
    console.log('Analytics:', eventName, data);
  }
  
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  getAverageLoadTime(mfeName: string): number {
    const mfeMetrics = this.metrics.filter(m => 
      m.name === `mfe_load_${mfeName}`
    );
    
    if (mfeMetrics.length === 0) return 0;
    
    const sum = mfeMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / mfeMetrics.length;
  }
}
```

### 3. Caching Strategy

```typescript
// mfe-cache.service.ts
import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root'
})
export class MfeCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Cache MFE module
  cacheModule(mfeName: string, module: any) {
    this.set(`mfe_${mfeName}`, module, 10 * 60 * 1000); // 10 minutes
  }
  
  getCachedModule(mfeName: string): any | null {
    return this.get(`mfe_${mfeName}`);
  }
}
```

---

## Common Pitfalls

### 1. Version Conflicts

**Problem:** Different versions of Angular or dependencies

**Solution:**
```javascript
// webpack.config.js - Strict singleton enforcement
shared: {
  '@angular/core': {
    singleton: true,      // MUST be singleton
    strictVersion: true,  // MUST match version
    requiredVersion: '17.0.0'
  }
}
```

### 2. Memory Leaks

**Problem:** Not cleaning up subscriptions

**Solution:**
```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private eventBus = inject(EventBusService);
  
  ngOnInit() {
    // Automatically unsubscribe on destroy
    this.eventBus.on('user:updated')
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('User updated:', user);
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 3. Circular Dependencies

**Problem:** Shell depends on Remote, Remote depends on Shell

**Solution:**
```typescript
// Use event bus or shared service instead of direct imports
// DON'T: Import directly from shell in remote
// DO: Use shared library for communication

// Remote: dashboard.component.ts
import { EventBusService } from '@my-org/shared-data-access'; // ✅

// NOT this:
// import { ShellService } from '../../../../shell/src/app/shell.service'; // ❌
```

### 4. Style Conflicts

**Problem:** CSS bleeding between MFEs

**Solution:**
```typescript
// Use ViewEncapsulation
@Component({
  selector: 'app-dashboard',
  encapsulation: ViewEncapsulation.Emulated, // Default, scopes styles
  styles: [`
    /* These styles are scoped to this component */
    .dashboard { /* ... */ }
  `]
})

// Or use BEM naming convention
.mfe-dashboard__header { }
.mfe-dashboard__content { }
```

### 5. Authentication/Authorization

**Problem:** Inconsistent auth state across MFEs

**Solution:**
```typescript
// Use shared auth store in shell
import { AuthStore } from '@my-org/shared-data-access';

// All MFEs access same auth state
@Component({
  selector: 'app-any-mfe'
})
export class AnyMfeComponent {
  private authStore = inject(AuthStore);
  
  user = this.authStore.user;
  isAuthenticated = this.authStore.isAuthenticated;
}
```

---

## Real-World Example: E-Commerce Platform

```typescript
/**
 * E-Commerce Micro Frontend Architecture
 * 
 * Shell (Port 4200)
 * ├── Authentication
 * ├── Global Navigation
 * ├── Cart Badge (shared)
 * └── Layout
 * 
 * Product Catalog MFE (Port 4201)
 * ├── Product List
 * ├── Product Details
 * ├── Search & Filters
 * └── Categories
 * 
 * Shopping Cart MFE (Port 4202)
 * ├── Cart View
 * ├── Cart Management
 * └── Checkout
 * 
 * User Account MFE (Port 4203)
 * ├── Profile
 * ├── Orders History
 * └── Settings
 * 
 * Admin Dashboard MFE (Port 4204)
 * ├── Products Management
 * ├── Orders Management
 * └── Analytics
 */

// Shell: app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.CART_ROUTES)
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4204/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.ADMIN_ROUTES)
  }
];

// Communication: Cart badge updates when product added
// Products MFE emits event
this.eventBus.emit('cart:item-added', { productId, quantity });

// Shell listens and updates cart badge
this.eventBus.on('cart:item-added').subscribe(() => {
  this.cartStore.refreshCartCount();
});
```

---

## Conclusion

### Key Takeaways

1. **Module Federation is the best approach** for Angular micro frontends
2. **Native Federation with Vite is recommended for Angular 17+** (faster builds, better DX)
3. **Shared dependencies** must be carefully managed (singletons!)
4. **Communication** should use event bus or shared state
5. **Independent deployment** is the main benefit
6. **Performance monitoring** is critical
7. **Error boundaries** prevent cascade failures
8. **Testing** must include integration tests
9. **Use signals** for reactive state management

### Choosing Between Webpack and Vite Module Federation

#### Use **Native Federation (Vite)** When:
✅ Angular 17+ projects  
✅ New projects starting from scratch  
✅ Development speed is a priority  
✅ Modern ESM-based architecture preferred  
✅ Lightning-fast HMR is important  
✅ Smaller bundle sizes needed  

#### Use **Webpack Module Federation** When:
✅ Legacy Angular projects (< 16)  
✅ Existing Webpack setup you want to keep  
✅ Module Federation plugins/ecosystem needed  
✅ More mature tooling required  
✅ Specific Webpack features needed  

### Recommended Stack (2025)

#### For Angular 17+ (Modern Approach) 🚀
```
✅ Native Federation with Vite
✅ @angular-architects/native-federation
✅ Angular CLI Workspaces or Nx
✅ Signal-based state management
✅ Event bus for communication
✅ Shared component library
✅ Independent CI/CD pipelines
✅ Version registry service
✅ Performance monitoring
```

#### For Angular < 17 (Legacy Approach)
```
✅ Webpack 5 Module Federation
✅ @angular-architects/module-federation
✅ Nx or Angular CLI Workspaces
✅ Signal-based state management (if Angular 16)
✅ Event bus for communication
✅ Shared component library
✅ Independent CI/CD pipelines
```

### Performance Comparison Summary

| Aspect | Webpack MF | Native Federation |
|--------|-----------|-------------------|
| **Build Speed** | ⚡ Slow (30-60s) | 🚀 Ultra-fast (5-10s) |
| **HMR** | ⏱️ 2-5s | ⚡ <100ms |
| **Bundle Size** | 📦 Larger | 📦 Smaller |
| **Maturity** | ✅ Very mature | ⚠️ Newer (but stable) |
| **Angular 17+** | ⚠️ Not default | ✅ Perfect fit |
| **Developer Experience** | 👍 Good | 🌟 Excellent |

### When to Use Micro Frontends

✅ **Use When:**
- Large team (10+ developers)
- Multiple autonomous teams (3+)
- Different release cycles needed
- Long-term scalability required
- Domain-driven architecture
- Independent deployments critical

❌ **Avoid When:**
- Small team (< 5 developers)
- Simple application
- Tight coupling required across features
- Performance is absolute constraint
- Team lacks micro frontend experience
- Shared state dominates architecture

### Quick Start Guide

#### For New Angular 17+ Projects:
```bash
# 1. Create workspace
ng new my-mfe-workspace --style=scss --routing

# 2. Install Native Federation
npm install @angular-architects/native-federation -D

# 3. Initialize shell
ng g @angular-architects/native-federation:init --project shell --type host

# 4. Create & initialize remotes
ng generate application dashboard
ng g @angular-architects/native-federation:init --project dashboard --type remote --port 4201

# 5. Start all apps
npm run start:all
```

#### For Existing Webpack Projects:
```bash
# Stay with Webpack Module Federation
npm install @angular-architects/module-federation -D
ng g @angular-architects/module-federation:config --project shell --type host
ng g @angular-architects/module-federation:config --project dashboard --type remote --port 4201
```

### Final Recommendations

1. **Angular 17+**: Choose **Native Federation with Vite** ⭐
   - Much faster build times
   - Better developer experience
   - Modern ESM architecture
   - Angular's default build system

2. **Angular 14-16**: Consider **Native Federation** if possible, or stay with Webpack
   - Native Federation works with Angular 16+
   - Can upgrade gradually

3. **Angular < 14**: Use **Webpack Module Federation**
   - More mature for older versions
   - Better compatibility

4. **Enterprise/Legacy**: **Webpack Module Federation**
   - If existing Webpack infrastructure
   - If need specific Webpack plugins
   - If team familiar with Webpack

### Success Metrics to Track

- **Build Time**: Target <10s for Native Federation
- **HMR Speed**: Target <100ms for Native Federation
- **Bundle Size**: Monitor and set budgets
- **Load Time**: First MFE load <2s
- **Error Rate**: Track MFE load failures
- **Version Compatibility**: Automated checks

---

## Additional Resources

### Native Federation (Vite)
- [@angular-architects/native-federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Native Federation GitHub](https://github.com/angular-architects/module-federation-plugin)
- [Native Federation Tutorial](https://www.angulararchitects.io/en/blog/native-federation-1/)

### Webpack Module Federation
- [Angular Module Federation](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/)
- [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)

### General Micro Frontends
- [Nx Micro Frontends](https://nx.dev/concepts/module-federation/micro-frontend-architecture)
- [Martin Fowler - Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Micro Frontends Book](https://www.manning.com/books/micro-frontends-in-action)

### Angular Resources
- [Angular Documentation](https://angular.io/docs)
- [Angular Signals](https://angular.io/guide/signals)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)

---

**Last Updated:** November 2025  
**Angular Version:** 17+  
**Recommended:** Native Federation with Vite 🚀  
**Alternative:** Webpack 5 Module Federation (for legacy projects)

