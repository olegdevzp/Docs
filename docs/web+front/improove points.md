Improve Points - Angular Work Sheet

## Table of Contents

### Core Features
1. [cdk-virtual-scroll-viewport](#1-cdk-virtual-scroll-viewport)
2. [Ivy Renderer](#2-ivy-renderer)
3. [@angular/cdk/scrolling](#3-angularcdkscrolling)
4. [@ViewChild() and @ContentChild() static flag](#4-viewchild-and-contentchild-static-flag)
5. [AOT (Ahead-of-Time) Compilation](#5-aot-ahead-of-time-compilation)

### Components (CDK/Material)
6. [Component Harnesses](#6-component-harnesses)
7. [YouTube Player Component](#7-youtube-player-component)
8. [Google Maps Component](#8-google-maps-component)

### Module & Internationalization
9. [CommonJS](#9-commonjs)
10. [i18n (Internationalization)](#10-i18n-internationalization)
11. [a11y (Accessibility)](#11-a11y-accessibility)

### Typed Forms
12. [Typed Reactive Forms](#12-typed-reactive-forms)
13. [Strict Null Checks in Forms](#13-strict-null-checks-in-forms)
14. [Type-safe Form Validators](#14-type-safe-form-validators)

### Directive Composition API (Angular 15+)
16. [hostDirectives](#16-hostdirectives)
17. [Directive Inheritance](#17-directive-inheritance)

### Image Optimization (Angular 15+)
18. [NgOptimizedImage](#18-ngoptimizedimage)
19. [Automatic srcset Generation](#19-automatic-srcset-generation)
20. [Lazy Loading](#20-lazy-loading)
21. [Priority Loading](#21-priority-loading)
22. [Image Preloading](#22-image-preloading)

### Angular 16+ Features
23. [Hydration](#23-hydration)
24. [DestroyRef](#24-destroyref)

### Angular 17+ Features
25. [@loading Block](#25-loading-block)
26. [@error Block](#26-error-block)
27. [Pristine in Forms](#27-pristine-in-forms)

### Angular 19+ Features
28. [Linked Signals](#28-linked-signals)
29. [Linked Signals in Forms](#29-linked-signals-in-forms)
30. [Linked Signals vs Computed vs Effect](#30-linked-signals-vs-computed-vs-effect)

---

## Detailed Answers

### 1. cdk-virtual-scroll-viewport

**What is it?**

`<cdk-virtual-scroll-viewport>` is a Component Development Kit (CDK) directive that enables efficient rendering of large lists by only rendering items currently visible in the viewport. This technique is called "virtual scrolling" or "windowing."

**Key Features:**
- Only renders visible items + buffer
- Dramatically improves performance for large datasets
- Reduces DOM nodes and memory usage
- Supports dynamic item sizes

**Basic Example:**

```typescript
import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-scroll-demo',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      @for (item of items; track item) {
        <div class="item">{{ item }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 400px;
      width: 100%;
    }
    .item {
      height: 50px;
      padding: 10px;
    }
  `]
})
export class VirtualScrollDemoComponent {
  items = Array.from({ length: 100000 }, (_, i) => `Item #${i}`);
}
```

**When to Use:**
- Lists with 100+ items
- Infinite scroll implementations
- Large datasets (thousands of rows)
- Performance-critical applications

[Back to top](#table-of-contents)

---

### 2. Ivy Renderer

**What is it?**

Ivy is Angular's modern rendering engine and compilation pipeline introduced in Angular 9. It replaced the previous View Engine and became the default renderer.

**Key Benefits:**
- **Smaller bundle sizes** - Tree-shakable, removes unused code
- **Faster compilation** - Incremental compilation support
- **Better debugging** - More readable generated code
- **Improved type checking** - Stricter template type checking
- **Locality principle** - Components compile independently

**Key Features:**

1. **Tree-shaking**: Dead code elimination
2. **Locality**: Each component compiles independently
3. **Incremental DOM**: Efficient updates
4. **Better debugging**: Cleaner generated code
5. **Template type checking**: Strict mode available

**Example - Strict Template Checking:**

```typescript
import { Component } from '@angular/core';

interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div>
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <!-- Ivy will catch type errors in templates -->
    </div>
  `
})
export class UserProfileComponent {
  user: User = {
    name: 'John Doe',
    email: 'john@example.com'
  };
}
```

**tsconfig.json Configuration:**

```json
{
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInputTypes": true,
    "strictOutputEventTypes": true
  }
}
```

[Back to top](#table-of-contents)

---

### 3. @angular/cdk/scrolling

**What is it?**

The `@angular/cdk/scrolling` package provides directives and services for handling scrolling behavior, including virtual scrolling, scroll position monitoring, and viewport detection.

**Key Components:**

1. **CdkVirtualScrollViewport** - Virtual scrolling container
2. **CdkScrollable** - Make any element scrollable
3. **ScrollDispatcher** - Service to monitor scroll events
4. **ViewportRuler** - Service to measure viewport dimensions

**Example - Virtual Scrolling with Custom Template:**

```typescript
import { Component } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport 
      itemSize="100" 
      class="viewport"
      (scrolledIndexChange)="onScrollIndexChange($event)">
      
      @for (product of products; track product.id) {
        <div class="product-item">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency }}</p>
        </div>
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 600px;
      border: 1px solid #ccc;
    }
    .product-item {
      height: 100px;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class ProductListComponent {
  products: Product[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Product ${i}`,
    price: Math.random() * 1000
  }));

  onScrollIndexChange(index: number): void {
    console.log('Scrolled to index:', index);
  }
}
```

**Example - ScrollDispatcher Service:**

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scroll-monitor',
  standalone: true,
  template: `
    <div class="content">
      <p>Scroll position: {{ scrollPosition }}</p>
    </div>
  `
})
export class ScrollMonitorComponent implements OnInit, OnDestroy {
  private scrollDispatcher = inject(ScrollDispatcher);
  private destroy$ = new Subject<void>();
  
  scrollPosition = 0;

  ngOnInit(): void {
    this.scrollDispatcher.scrolled()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollPosition = window.scrollY;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

[Back to top](#table-of-contents)

---

### 4. @ViewChild() and @ContentChild() static flag

**What is it?**

The `static` flag (introduced in Angular 8) determines when the query should be resolved - before or after change detection runs.

**Options:**
- `static: true` - Resolve before change detection (ngOnInit)
- `static: false` - Resolve after change detection (ngAfterViewInit/ngAfterContentInit)

**Example:**

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-static-query-demo',
  standalone: true,
  template: `
    <input #staticInput type="text" value="Always present">
    
    @if (showDynamic) {
      <input #dynamicInput type="text" value="Conditional">
    }
  `
})
export class StaticQueryDemoComponent implements AfterViewInit {
  // Static query - element always present in template
  @ViewChild('staticInput', { static: true }) 
  staticInput!: ElementRef<HTMLInputElement>;
  
  // Dynamic query - element might not be present initially
  @ViewChild('dynamicInput', { static: false }) 
  dynamicInput?: ElementRef<HTMLInputElement>;
  
  showDynamic = false;

  ngOnInit(): void {
    // Can access staticInput here
    console.log('Static input:', this.staticInput.nativeElement.value);
    
    // Cannot access dynamicInput here (undefined)
    console.log('Dynamic input:', this.dynamicInput); // undefined
  }

  ngAfterViewInit(): void {
    // Can access both here (if showDynamic is true)
    if (this.dynamicInput) {
      console.log('Dynamic input:', this.dynamicInput.nativeElement.value);
    }
  }
}
```

**Modern Approach (Angular 16+) - Signal Queries:**

```typescript
import { Component, viewChild, contentChild } from '@angular/core';

@Component({
  selector: 'app-signal-query-demo',
  standalone: true,
  template: `
    <input #myInput type="text">
  `
})
export class SignalQueryDemoComponent {
  // Signal-based query (recommended in modern Angular)
  myInput = viewChild<ElementRef>('myInput');
  
  ngAfterViewInit(): void {
    const input = this.myInput();
    if (input) {
      console.log('Input value:', input.nativeElement.value);
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 5. AOT (Ahead-of-Time) Compilation

**What is it?**

AOT (Ahead-of-Time) compilation converts Angular HTML and TypeScript code into efficient JavaScript code during the build process, before the browser downloads and runs the code.

**AOT vs JIT (Just-in-Time):**

| Feature | AOT | JIT |
|---------|-----|-----|
| Compilation | Build time | Runtime |
| Bundle size | Smaller | Larger |
| Performance | Faster | Slower initial load |
| Template errors | Caught early | Runtime errors |
| Production | Default | Development only |

**Benefits:**
1. **Faster rendering** - Browser downloads pre-compiled code
2. **Smaller bundles** - No compiler in bundle
3. **Early error detection** - Template errors caught at build time
4. **Better security** - Less eval() usage
5. **Tree-shaking** - Better dead code elimination

**Example - angular.json Configuration:**

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

**Example - Component with AOT:**

```typescript
import { Component } from '@angular/core';

interface Item {
  id: number;
  title: string;
}

@Component({
  selector: 'app-aot-example',
  standalone: true,
  template: `
    <div>
      @for (item of items; track item.id) {
        <p>{{ item.title }}</p>
      }
    </div>
  `
})
export class AotExampleComponent {
  // AOT will validate template at build time
  // Type errors will be caught before deployment
  items: Item[] = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' }
  ];
}
```

**Build Commands:**

```bash
# Production build with AOT (default)
ng build --configuration production

# Development build with AOT
ng build --aot

# Serve with AOT
ng serve --aot
```

[Back to top](#table-of-contents)

---

### 6. Component Harnesses

**What is it?**

Component harnesses provide a robust and maintainable API for testing Angular Material and custom components. They abstract away implementation details and provide a stable testing interface.

**Benefits:**
- **Stable API** - Tests don't break with DOM changes
- **Reusable** - Share test logic across tests
- **Type-safe** - Full TypeScript support
- **Readable** - Clear, intention-revealing API

**Example - Testing with Component Harness:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [MatButtonModule, MatInputModule],
  template: `
    <mat-form-field>
      <input matInput placeholder="Username" [(ngModel)]="username">
    </mat-form-field>
    <button mat-raised-button (click)="login()">Login</button>
  `
})
class LoginFormComponent {
  username = '';
  
  login(): void {
    console.log('Login clicked');
  }
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should interact with button using harness', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
    
    expect(await button.getText()).toBe('Login');
    expect(await button.isDisabled()).toBe(false);
    
    await button.click();
  });

  it('should interact with input using harness', async () => {
    const input = await loader.getHarness(MatInputHarness);
    
    await input.setValue('testuser');
    expect(await input.getValue()).toBe('testuser');
    expect(await input.getPlaceholder()).toBe('Username');
  });
});
```

**Creating Custom Component Harness:**

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class CustomCardHarness extends ComponentHarness {
  static hostSelector = 'app-custom-card';

  private getTitleElement = this.locatorFor('.card-title');
  private getContentElement = this.locatorFor('.card-content');

  async getTitle(): Promise<string> {
    const title = await this.getTitleElement();
    return title.text();
  }

  async getContent(): Promise<string> {
    const content = await this.getContentElement();
    return content.text();
  }

  async clickCard(): Promise<void> {
    const host = await this.host();
    return host.click();
  }
}
```

[Back to top](#table-of-contents)

---

### 7. YouTube Player Component

**What is it?**

`@angular/youtube-player` is an official Angular component that provides a type-safe wrapper around the YouTube IFrame Player API.

**Installation:**

```bash
npm install @angular/youtube-player
```

**Example:**

```typescript
import { Component, OnInit } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-demo',
  standalone: true,
  imports: [YouTubePlayerModule],
  template: `
    <div class="video-container">
      <youtube-player
        [videoId]="videoId"
        [height]="height"
        [width]="width"
        [startSeconds]="startSeconds"
        [endSeconds]="endSeconds"
        (ready)="onReady($event)"
        (stateChange)="onStateChange($event)">
      </youtube-player>
      
      <div class="controls">
        <button (click)="playVideo()">Play</button>
        <button (click)="pauseVideo()">Pause</button>
        <button (click)="stopVideo()">Stop</button>
      </div>
    </div>
  `,
  styles: [`
    .video-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .controls {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
  `]
})
export class YoutubeDemoComponent implements OnInit {
  videoId = 'dQw4w9WgXcQ';
  height = 450;
  width = 800;
  startSeconds = 10;
  endSeconds = 60;
  
  private player?: YT.Player;

  ngOnInit(): void {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  onReady(event: YT.PlayerEvent): void {
    this.player = event.target;
    console.log('Player ready');
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    console.log('Player state:', event.data);
  }

  playVideo(): void {
    this.player?.playVideo();
  }

  pauseVideo(): void {
    this.player?.pauseVideo();
  }

  stopVideo(): void {
    this.player?.stopVideo();
  }
}
```

**Advanced Example with Playlist:**

```typescript
import { Component, signal } from '@angular/core';
import { YouTubePlayerModule, YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-playlist',
  standalone: true,
  imports: [YouTubePlayerModule],
  template: `
    <youtube-player
      [videoId]="currentVideo()"
      [playerVars]="playerVars"
      (stateChange)="onStateChange($event)">
    </youtube-player>
    
    <div class="playlist">
      @for (video of playlist; track video.id) {
        <button 
          (click)="selectVideo(video.id)"
          [class.active]="currentVideo() === video.id">
          {{ video.title }}
        </button>
      }
    </div>
  `
})
export class YoutubePlaylistComponent {
  currentVideo = signal('dQw4w9WgXcQ');
  
  playlist = [
    { id: 'dQw4w9WgXcQ', title: 'Video 1' },
    { id: 'M7lc1UVf-VE', title: 'Video 2' },
    { id: '9bZkp7q19f0', title: 'Video 3' }
  ];
  
  playerVars: YT.PlayerVars = {
    autoplay: 0,
    controls: 1,
    modestbranding: 1,
    rel: 0
  };

  selectVideo(videoId: string): void {
    this.currentVideo.set(videoId);
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    if (event.data === YT.PlayerState.ENDED) {
      // Auto-play next video
      const currentIndex = this.playlist.findIndex(v => v.id === this.currentVideo());
      const nextIndex = (currentIndex + 1) % this.playlist.length;
      this.currentVideo.set(this.playlist[nextIndex].id);
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 8. Google Maps Component

**What is it?**

`@angular/google-maps` is an official Angular component library that provides Angular components for Google Maps JavaScript API.

**Installation:**

```bash
npm install @angular/google-maps
```

**Setup - index.html:**

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

**Example:**

```typescript
import { Component, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map-demo',
  standalone: true,
  imports: [GoogleMapsModule],
  template: `
    <google-map
      [height]="height"
      [width]="width"
      [center]="center()"
      [zoom]="zoom()"
      [options]="mapOptions">
      
      @for (marker of markers(); track marker.position) {
        <map-marker
          [position]="marker.position"
          [title]="marker.title"
          [options]="marker.options"
          (mapClick)="onMarkerClick(marker)">
        </map-marker>
      }
      
      <map-info-window>
        <div>{{ selectedMarker()?.title }}</div>
      </map-info-window>
    </google-map>
  `,
  styles: [`
    google-map {
      display: block;
      margin: 20px auto;
    }
  `]
})
export class MapDemoComponent {
  height = '500px';
  width = '100%';
  
  center = signal<google.maps.LatLngLiteral>({ 
    lat: 40.7128, 
    lng: -74.0060 
  });
  
  zoom = signal(12);
  
  markers = signal([
    {
      position: { lat: 40.7128, lng: -74.0060 },
      title: 'New York',
      options: { animation: google.maps.Animation.DROP }
    },
    {
      position: { lat: 40.7589, lng: -73.9851 },
      title: 'Times Square',
      options: { animation: google.maps.Animation.BOUNCE }
    }
  ]);
  
  selectedMarker = signal<{ position: google.maps.LatLngLiteral; title: string } | null>(null);
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 8,
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#193341' }]
      }
    ]
  };

  onMarkerClick(marker: { position: google.maps.LatLngLiteral; title: string }): void {
    this.selectedMarker.set(marker);
    console.log('Marker clicked:', marker.title);
  }
}
```

**Advanced Example with Directions:**

```typescript
import { Component, signal, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-directions-demo',
  standalone: true,
  imports: [GoogleMapsModule],
  template: `
    <google-map [center]="center()" [zoom]="zoom()">
      @if (directionsResults()) {
        <map-directions-renderer 
          [directions]="directionsResults()"
          [options]="directionsOptions">
        </map-directions-renderer>
      }
    </google-map>
    
    <button (click)="calculateRoute()">Show Route</button>
  `
})
export class DirectionsDemoComponent {
  private mapDirectionsService = inject(MapDirectionsService);
  
  center = signal({ lat: 40.7128, lng: -74.0060 });
  zoom = signal(13);
  
  directionsResults = signal<google.maps.DirectionsResult | null>(null);
  
  directionsOptions: google.maps.DirectionsRendererOptions = {
    polylineOptions: {
      strokeColor: '#FF0000',
      strokeWeight: 5
    }
  };

  calculateRoute(): void {
    const request: google.maps.DirectionsRequest = {
      origin: { lat: 40.7128, lng: -74.0060 },
      destination: { lat: 40.7589, lng: -73.9851 },
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.mapDirectionsService.route(request)
      .pipe(map(response => response.result))
      .subscribe(result => {
        this.directionsResults.set(result);
      });
  }
}
```

[Back to top](#table-of-contents)

---

### 9. CommonJS

**What is it?**

CommonJS is a module system originally designed for server-side JavaScript (Node.js). In Angular context, it's important to understand because:

1. Some npm packages still use CommonJS
2. Angular CLI warns about CommonJS dependencies
3. ES modules are preferred for better tree-shaking

**CommonJS vs ES Modules:**

```typescript
// CommonJS (older, Node.js style)
const express = require('express');
module.exports = myFunction;

// ES Modules (modern, preferred in Angular)
import express from 'express';
export const myFunction = () => {};
```

**Angular Warning Example:**

```bash
Warning: /path/to/project/node_modules/some-package depends on 'fs'. 
CommonJS or AMD dependencies can cause optimization bailouts.
```

**Best Practices:**

```typescript
// ❌ Avoid - CommonJS import
import * as moment from 'moment'; // CommonJS module

// ✅ Prefer - ES Module alternative
import { format, parseISO } from 'date-fns'; // ES Module

// Example Component
import { Component, signal } from '@angular/core';
import { format } from 'date-fns'; // Tree-shakable ES module

@Component({
  selector: 'app-date-display',
  standalone: true,
  template: `
    <div>
      <p>Current date: {{ formattedDate() }}</p>
    </div>
  `
})
export class DateDisplayComponent {
  currentDate = signal(new Date());
  
  formattedDate = computed(() => 
    format(this.currentDate(), 'yyyy-MM-dd')
  );
}
```

**Package.json Check:**

```json
{
  "name": "my-app",
  "dependencies": {
    "lodash-es": "^4.17.21",  // ✅ ES Module version
    "date-fns": "^2.30.0"      // ✅ ES Module friendly
  }
}
```

**Angular.json Configuration:**

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "allowedCommonJsDependencies": [
              "lodash"  // Only if absolutely necessary
            ]
          }
        }
      }
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 10. i18n (Internationalization)

**What is it?**

i18n (internationalization) is the process of designing applications to support multiple languages and locales. Angular provides built-in i18n support.

**Key Concepts:**
- **i18n** - Internationalization (preparing app for translations)
- **l10n** - Localization (actual translations)
- **Locale** - Language and regional format (en-US, de-DE, fr-FR)

**Example - Template Translation:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-i18n-demo',
  standalone: true,
  template: `
    <h1 i18n="@@homeTitle">Welcome to our application</h1>
    
    <p i18n="User greeting|Greeting message@@userGreeting">
      Hello, {{ userName }}!
    </p>
    
    <button i18n="@@loginButton">Login</button>
    
    <!-- Plural translation -->
    <p i18n>
      {itemCount, plural, 
        =0 {No items} 
        =1 {One item} 
        other {{{itemCount}} items}
      }
    </p>
    
    <!-- Select translation -->
    <p i18n>
      {gender, select, 
        male {He} 
        female {She} 
        other {They}
      } liked this post.
    </p>
  `
})
export class I18nDemoComponent {
  userName = 'John';
  itemCount = 5;
  gender = 'male';
}
```

**Extract Translations:**

```bash
# Extract translatable strings
ng extract-i18n

# Output: messages.xlf (default)
# Can also output as JSON, ARB, or XMB
ng extract-i18n --format=json
```

**messages.en.json Example:**

```json
{
  "locale": "en",
  "translations": {
    "homeTitle": "Welcome to our application",
    "userGreeting": "Hello, {userName}!",
    "loginButton": "Login"
  }
}
```

**messages.de.json Example:**

```json
{
  "locale": "de",
  "translations": {
    "homeTitle": "Willkommen in unserer Anwendung",
    "userGreeting": "Hallo, {userName}!",
    "loginButton": "Anmelden"
  }
}
```

**angular.json Configuration:**

```json
{
  "projects": {
    "my-app": {
      "i18n": {
        "sourceLocale": "en-US",
        "locales": {
          "de": {
            "translation": "src/locale/messages.de.xlf"
          },
          "fr": {
            "translation": "src/locale/messages.fr.xlf"
          }
        }
      },
      "architect": {
        "build": {
          "configurations": {
            "de": {
              "localize": ["de"]
            },
            "fr": {
              "localize": ["fr"]
            }
          }
        }
      }
    }
  }
}
```

**Build for Specific Locale:**

```bash
# Build for German
ng build --configuration=de

# Build for all locales
ng build --localize
```

**Runtime Locale with LOCALE_ID:**

```typescript
import { Component, LOCALE_ID, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { DatePipe, CurrencyPipe } from '@angular/common';

registerLocaleData(localeDe);

@Component({
  selector: 'app-locale-demo',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <p>Date: {{ today | date }}</p>
    <p>Price: {{ price | currency }}</p>
    <p>Current locale: {{ locale }}</p>
  `,
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }
  ]
})
export class LocaleDemoComponent {
  locale = inject(LOCALE_ID);
  today = new Date();
  price = 1234.56;
}
```

[Back to top](#table-of-contents)

---

### 11. a11y (Accessibility)

**What is it?**

a11y (accessibility) ensures applications are usable by people with disabilities. Angular CDK provides utilities to help build accessible applications.

**Key Concepts:**
- **ARIA** - Accessible Rich Internet Applications attributes
- **Keyboard navigation** - Full keyboard support
- **Screen readers** - Proper semantic HTML and ARIA labels
- **Focus management** - Logical focus flow

**Example - Accessible Form:**

```typescript
import { Component, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-accessible-form',
  standalone: true,
  imports: [A11yModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <!-- Live announcer for screen readers -->
      <div cdkAriaLive="polite" [attr.aria-live]="'polite'">
        @if (errorMessage()) {
          <p role="alert">{{ errorMessage() }}</p>
        }
      </div>
      
      <div>
        <label for="email">Email address</label>
        <input 
          id="email"
          type="email"
          formControlName="email"
          [attr.aria-invalid]="emailControl.invalid && emailControl.touched"
          [attr.aria-describedby]="emailControl.invalid ? 'email-error' : null"
          cdkMonitorElementFocus>
        
        @if (emailControl.invalid && emailControl.touched) {
          <span id="email-error" role="alert">
            Please enter a valid email address
          </span>
        }
      </div>
      
      <div>
        <label for="password">Password</label>
        <input 
          id="password"
          type="password"
          formControlName="password"
          [attr.aria-invalid]="passwordControl.invalid && passwordControl.touched"
          [attr.aria-describedby]="passwordControl.invalid ? 'password-error' : null">
        
        @if (passwordControl.invalid && passwordControl.touched) {
          <span id="password-error" role="alert">
            Password is required
          </span>
        }
      </div>
      
      <button 
        type="submit"
        [disabled]="loginForm.invalid"
        [attr.aria-disabled]="loginForm.invalid">
        Login
      </button>
    </form>
  `,
  styles: [`
    [aria-invalid="true"] {
      border-color: red;
    }
    [role="alert"] {
      color: red;
      font-size: 0.875rem;
    }
  `]
})
export class AccessibleFormComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  
  errorMessage = signal('');
  
  get emailControl() {
    return this.loginForm.get('email')!;
  }
  
  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted');
      this.errorMessage.set('');
    } else {
      this.errorMessage.set('Please fix the errors in the form');
    }
  }
}
```

**Focus Management Example:**

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { A11yModule, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [A11yModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="close()">
        <div 
          #modalContent
          class="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          (click)="$event.stopPropagation()"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true">
          
          <h2 id="modal-title">Confirm Action</h2>
          <p>Are you sure you want to proceed?</p>
          
          <div class="modal-actions">
            <button (click)="confirm()" cdkFocusInitial>
              Confirm
            </button>
            <button (click)="close()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 8px;
      min-width: 400px;
    }
    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class ModalDialogComponent {
  isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  confirm(): void {
    console.log('Confirmed');
    this.close();
  }
}
```

**Keyboard Navigation Example:**

```typescript
import { Component, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-keyboard-nav',
  standalone: true,
  imports: [A11yModule],
  template: `
    <div 
      class="menu"
      role="menu"
      cdkListbox
      (keydown)="onKeyDown($event)">
      
      @for (item of menuItems; track item.id) {
        <button
          class="menu-item"
          role="menuitem"
          [attr.tabindex]="selectedId() === item.id ? 0 : -1"
          [class.selected]="selectedId() === item.id"
          (click)="selectItem(item.id)"
          (focus)="selectItem(item.id)">
          {{ item.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .menu {
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
    }
    .menu-item {
      padding: 12px;
      text-align: left;
      border: none;
      background: white;
      cursor: pointer;
    }
    .menu-item:hover,
    .menu-item.selected {
      background: #e3f2fd;
    }
  `]
})
export class KeyboardNavComponent {
  selectedId = signal(1);
  
  menuItems = [
    { id: 1, label: 'Home' },
    { id: 2, label: 'About' },
    { id: 3, label: 'Services' },
    { id: 4, label: 'Contact' }
  ];

  selectItem(id: number): void {
    this.selectedId.set(id);
  }

  onKeyDown(event: KeyboardEvent): void {
    const currentIndex = this.menuItems.findIndex(
      item => item.id === this.selectedId()
    );
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % this.menuItems.length;
        this.selectedId.set(this.menuItems[nextIndex].id);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex === 0 
          ? this.menuItems.length - 1 
          : currentIndex - 1;
        this.selectedId.set(this.menuItems[prevIndex].id);
        break;
        
      case 'Home':
        event.preventDefault();
        this.selectedId.set(this.menuItems[0].id);
        break;
        
      case 'End':
        event.preventDefault();
        this.selectedId.set(this.menuItems[this.menuItems.length - 1].id);
        break;
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 12. Typed Reactive Forms

**What is it?**

Typed Reactive Forms (introduced in Angular 14) provide full type safety for form controls, groups, and arrays. This means TypeScript can catch errors at compile time instead of runtime.

**Benefits:**
- **Type safety** - Catch errors at compile time
- **Autocomplete** - Better IDE support
- **Refactoring** - Safer code changes
- **Null safety** - Explicit nullable controls

**Example - Basic Typed Form:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface UserForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number | null>;
  newsletter: FormControl<boolean>;
}

@Component({
  selector: 'app-typed-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="firstName">First Name</label>
        <input id="firstName" type="text" formControlName="firstName">
      </div>
      
      <div>
        <label for="lastName">Last Name</label>
        <input id="lastName" type="text" formControlName="lastName">
      </div>
      
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email">
      </div>
      
      <div>
        <label for="age">Age</label>
        <input id="age" type="number" formControlName="age">
      </div>
      
      <div>
        <label>
          <input type="checkbox" formControlName="newsletter">
          Subscribe to newsletter
        </label>
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
    
    <div>
      <h3>Form Value:</h3>
      <pre>{{ userForm.value | json }}</pre>
    </div>
  `
})
export class TypedFormComponent {
  private fb = inject(FormBuilder);
  
  // Typed form group
  userForm: FormGroup<UserForm> = this.fb.group({
    firstName: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    lastName: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    email: this.fb.control('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    age: this.fb.control<number | null>(null),
    newsletter: this.fb.control(false, { nonNullable: true })
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      // Type-safe access to form values
      const formValue = this.userForm.value;
      
      // TypeScript knows the types
      console.log('First Name:', formValue.firstName); // string | undefined
      console.log('Age:', formValue.age); // number | null | undefined
      console.log('Newsletter:', formValue.newsletter); // boolean | undefined
      
      // getRawValue() returns non-nullable types for nonNullable controls
      const rawValue = this.userForm.getRawValue();
      console.log('First Name (raw):', rawValue.firstName); // string
      console.log('Newsletter (raw):', rawValue.newsletter); // boolean
    }
  }
}
```

**Example - Nested Form Groups:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface AddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
}

interface ProfileForm {
  name: FormControl<string>;
  email: FormControl<string>;
  address: FormGroup<AddressForm>;
}

@Component({
  selector: 'app-nested-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Name</label>
        <input type="text" formControlName="name">
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" formControlName="email">
      </div>
      
      <fieldset formGroupName="address">
        <legend>Address</legend>
        
        <div>
          <label>Street</label>
          <input type="text" formControlName="street">
        </div>
        
        <div>
          <label>City</label>
          <input type="text" formControlName="city">
        </div>
        
        <div>
          <label>Zip Code</label>
          <input type="text" formControlName="zipCode">
        </div>
      </fieldset>
      
      <button type="submit">Submit</button>
    </form>
  `
})
export class NestedFormComponent {
  private fb = inject(FormBuilder);
  
  profileForm: FormGroup<ProfileForm> = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    address: this.fb.group<AddressForm>({
      street: this.fb.control('', { nonNullable: true }),
      city: this.fb.control('', { nonNullable: true }),
      zipCode: this.fb.control('', { nonNullable: true })
    })
  });

  onSubmit(): void {
    const value = this.profileForm.getRawValue();
    
    // Type-safe nested access
    console.log('Name:', value.name); // string
    console.log('Street:', value.address.street); // string
    console.log('City:', value.address.city); // string
  }
}
```

**Example - Form Arrays:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface PhoneForm {
  type: FormControl<'mobile' | 'home' | 'work'>;
  number: FormControl<string>;
}

interface ContactForm {
  name: FormControl<string>;
  phones: FormArray<FormGroup<PhoneForm>>;
}

@Component({
  selector: 'app-form-array',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Name</label>
        <input type="text" formControlName="name">
      </div>
      
      <div formArrayName="phones">
        <h3>Phone Numbers</h3>
        
        @for (phone of phones.controls; track $index; let i = $index) {
          <div [formGroupName]="i">
            <select formControlName="type">
              <option value="mobile">Mobile</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
            </select>
            
            <input type="tel" formControlName="number">
            
            <button type="button" (click)="removePhone(i)">Remove</button>
          </div>
        }
        
        <button type="button" (click)="addPhone()">Add Phone</button>
      </div>
      
      <button type="submit">Submit</button>
    </form>
  `
})
export class FormArrayComponent {
  private fb = inject(FormBuilder);
  
  contactForm: FormGroup<ContactForm> = this.fb.group({
    name: this.fb.control('', { nonNullable: true }),
    phones: this.fb.array<FormGroup<PhoneForm>>([
      this.createPhoneGroup()
    ])
  });
  
  get phones(): FormArray<FormGroup<PhoneForm>> {
    return this.contactForm.controls.phones;
  }

  createPhoneGroup(): FormGroup<PhoneForm> {
    return this.fb.group({
      type: this.fb.control<'mobile' | 'home' | 'work'>('mobile', { nonNullable: true }),
      number: this.fb.control('', { nonNullable: true })
    });
  }

  addPhone(): void {
    this.phones.push(this.createPhoneGroup());
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  onSubmit(): void {
    const value = this.contactForm.getRawValue();
    
    // Type-safe access
    console.log('Name:', value.name); // string
    console.log('Phones:', value.phones); // { type: 'mobile' | 'home' | 'work'; number: string; }[]
    
    value.phones.forEach(phone => {
      console.log(`${phone.type}: ${phone.number}`); // Type-safe
    });
  }
}
```

[Back to top](#table-of-contents)

---

### 13. Strict Null Checks in Forms

**What is it?**

Strict null checks in forms ensure that form control values explicitly handle `null` and `undefined` states, preventing runtime errors and improving type safety.

**Configuration - tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

**Example - Handling Nullable Values:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface SearchForm {
  query: FormControl<string | null>;
  category: FormControl<string | null>;
  minPrice: FormControl<number | null>;
  maxPrice: FormControl<number | null>;
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
      <div>
        <label>Search Query</label>
        <input type="text" formControlName="query">
      </div>
      
      <div>
        <label>Category</label>
        <select formControlName="category">
          <option [value]="null">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>
      
      <div>
        <label>Min Price</label>
        <input type="number" formControlName="minPrice">
      </div>
      
      <div>
        <label>Max Price</label>
        <input type="number" formControlName="maxPrice">
      </div>
      
      <button type="submit">Search</button>
      <button type="button" (click)="reset()">Reset</button>
    </form>
  `
})
export class SearchFormComponent {
  private fb = inject(FormBuilder);
  
  searchForm: FormGroup<SearchForm> = this.fb.group({
    query: this.fb.control<string | null>(null),
    category: this.fb.control<string | null>(null),
    minPrice: this.fb.control<number | null>(null),
    maxPrice: this.fb.control<number | null>(null)
  });

  onSearch(): void {
    const { query, category, minPrice, maxPrice } = this.searchForm.value;
    
    // Strict null checking - TypeScript enforces null checks
    const searchParams: Record<string, string> = {};
    
    if (query !== null && query !== undefined) {
      searchParams['query'] = query;
    }
    
    if (category !== null && category !== undefined) {
      searchParams['category'] = category;
    }
    
    if (minPrice !== null && minPrice !== undefined) {
      searchParams['minPrice'] = minPrice.toString();
    }
    
    if (maxPrice !== null && maxPrice !== undefined) {
      searchParams['maxPrice'] = maxPrice.toString();
    }
    
    console.log('Search params:', searchParams);
  }

  reset(): void {
    this.searchForm.reset();
    // After reset, all values are null
    console.log('Form value after reset:', this.searchForm.value);
  }
}
```

**Example - Non-Nullable Controls:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface LoginForm {
  username: FormControl<string>; // Non-nullable
  password: FormControl<string>; // Non-nullable
  rememberMe: FormControl<boolean>; // Non-nullable
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
      <div>
        <label>Username</label>
        <input type="text" formControlName="username">
      </div>
      
      <div>
        <label>Password</label>
        <input type="password" formControlName="password">
      </div>
      
      <div>
        <label>
          <input type="checkbox" formControlName="rememberMe">
          Remember Me
        </label>
      </div>
      
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  
  loginForm: FormGroup<LoginForm> = this.fb.group({
    // nonNullable: true ensures values are never null
    username: this.fb.control('', { 
      nonNullable: true, 
      validators: Validators.required 
    }),
    password: this.fb.control('', { 
      nonNullable: true, 
      validators: Validators.required 
    }),
    rememberMe: this.fb.control(false, { nonNullable: true })
  });

  onLogin(): void {
    // getRawValue() returns non-nullable values for nonNullable controls
    const { username, password, rememberMe } = this.loginForm.getRawValue();
    
    // No null checks needed - TypeScript knows these are strings and boolean
    console.log('Username:', username.toLowerCase()); // Safe
    console.log('Password length:', password.length); // Safe
    console.log('Remember me:', rememberMe); // boolean, never null
    
    // this.value might have undefined values if controls are disabled
    const formValue = this.loginForm.value;
    console.log('Username (value):', formValue.username); // string | undefined
  }
}
```

**Example - Partial Forms with Strict Nulls:**

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface UserProfileForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  bio: FormControl<string | null>;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSave()">
      <div>
        <label>First Name</label>
        <input type="text" formControlName="firstName">
      </div>
      
      <div>
        <label>Last Name</label>
        <input type="text" formControlName="lastName">
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" formControlName="email">
      </div>
      
      <div>
        <label>Bio</label>
        <textarea formControlName="bio"></textarea>
      </div>
      
      <button type="submit">Save</button>
    </form>
  `
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  profileForm: FormGroup<UserProfileForm> = this.fb.group({
    firstName: this.fb.control<string | null>(null),
    lastName: this.fb.control<string | null>(null),
    email: this.fb.control<string | null>(null),
    bio: this.fb.control<string | null>(null)
  });

  ngOnInit(): void {
    // Simulate loading user data
    const userData: UserProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      bio: 'Software developer'
    };
    
    this.profileForm.patchValue(userData);
  }

  onSave(): void {
    const formValue = this.profileForm.value;
    
    // Build updated profile with strict null handling
    const updatedProfile: Partial<UserProfile> = {};
    
    if (formValue.firstName !== null && formValue.firstName !== undefined) {
      updatedProfile.firstName = formValue.firstName;
    }
    
    if (formValue.lastName !== null && formValue.lastName !== undefined) {
      updatedProfile.lastName = formValue.lastName;
    }
    
    if (formValue.email !== null && formValue.email !== undefined) {
      updatedProfile.email = formValue.email;
    }
    
    if (formValue.bio !== null && formValue.bio !== undefined && formValue.bio.trim()) {
      updatedProfile.bio = formValue.bio;
    }
    
    console.log('Updated profile:', updatedProfile);
  }
}
```

[Back to top](#table-of-contents)

---

### 14. Type-safe Form Validators

**What is it?**

Type-safe form validators ensure that custom validators are properly typed, providing compile-time safety and better IDE support.

**Example - Custom Type-safe Validator:**

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';

// Type-safe validator function
export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value || value.length >= minLength) {
      return null;
    }
    
    return {
      minLength: {
        requiredLength: minLength,
        actualLength: value.length
      }
    };
  };
}

// Type-safe async validator
export function emailAvailableValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value as string;
    
    if (!email) {
      return of(null);
    }
    
    // Simulate API call
    return of({ emailTaken: true }).pipe(delay(1000));
  };
}

// Type-safe cross-field validator
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
```

**Example - Using Type-safe Validators:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

interface RegistrationForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  age: FormControl<number | null>;
}

// Custom validator with proper typing
function ageRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as number | null;
    
    if (value === null || value === undefined) {
      return null;
    }
    
    if (value < min || value > max) {
      return {
        ageRange: {
          min,
          max,
          actual: value
        }
      };
    }
    
    return null;
  };
}

// Username validator
function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null;
    }
    
    // Only alphanumeric and underscore
    const validPattern = /^[a-zA-Z0-9_]+$/;
    
    if (!validPattern.test(value)) {
      return { invalidUsername: true };
    }
    
    if (value.length < 3 || value.length > 20) {
      return { 
        usernameLength: {
          min: 3,
          max: 20,
          actual: value.length
        }
      };
    }
    
    return null;
  };
}

// Password strength validator
function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null;
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    
    if (!valid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar
        }
      };
    }
    
    return null;
  };
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Username</label>
        <input type="text" formControlName="username">
        
        @if (usernameControl.hasError('required') && usernameControl.touched) {
          <span class="error">Username is required</span>
        }
        @if (usernameControl.hasError('invalidUsername')) {
          <span class="error">Username can only contain letters, numbers, and underscores</span>
        }
        @if (usernameControl.hasError('usernameLength')) {
          <span class="error">
            Username must be between 
            {{ usernameControl.getError('usernameLength').min }} and 
            {{ usernameControl.getError('usernameLength').max }} characters
          </span>
        }
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" formControlName="email">
        
        @if (emailControl.hasError('required') && emailControl.touched) {
          <span class="error">Email is required</span>
        }
        @if (emailControl.hasError('email')) {
          <span class="error">Invalid email format</span>
        }
      </div>
      
      <div>
        <label>Password</label>
        <input type="password" formControlName="password">
        
        @if (passwordControl.hasError('required') && passwordControl.touched) {
          <span class="error">Password is required</span>
        }
        @if (passwordControl.hasError('minlength')) {
          <span class="error">
            Password must be at least 
            {{ passwordControl.getError('minlength').requiredLength }} characters
          </span>
        }
        @if (passwordControl.hasError('passwordStrength')) {
          <div class="error">
            <p>Password must contain:</p>
            <ul>
              <li [class.valid]="passwordControl.getError('passwordStrength').hasUpperCase">
                Uppercase letter
              </li>
              <li [class.valid]="passwordControl.getError('passwordStrength').hasLowerCase">
                Lowercase letter
              </li>
              <li [class.valid]="passwordControl.getError('passwordStrength').hasNumber">
                Number
              </li>
              <li [class.valid]="passwordControl.getError('passwordStrength').hasSpecialChar">
                Special character
              </li>
            </ul>
          </div>
        }
      </div>
      
      <div>
        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword">
        
        @if (registrationForm.hasError('passwordMismatch') && confirmPasswordControl.touched) {
          <span class="error">Passwords do not match</span>
        }
      </div>
      
      <div>
        <label>Age</label>
        <input type="number" formControlName="age">
        
        @if (ageControl.hasError('ageRange')) {
          <span class="error">
            Age must be between 
            {{ ageControl.getError('ageRange').min }} and 
            {{ ageControl.getError('ageRange').max }}
          </span>
        }
      </div>
      
      <button type="submit" [disabled]="registrationForm.invalid">Register</button>
    </form>
  `,
  styles: [`
    .error {
      color: red;
      font-size: 0.875rem;
      display: block;
      margin-top: 4px;
    }
    .valid {
      color: green;
    }
  `]
})
export class RegistrationFormComponent {
  private fb = inject(FormBuilder);
  
  registrationForm: FormGroup<RegistrationForm> = this.fb.group({
    username: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, usernameValidator()]
    }),
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: this.fb.control('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator()
      ]
    }),
    confirmPassword: this.fb.control('', {
      nonNullable: true,
      validators: Validators.required
    }),
    age: this.fb.control<number | null>(null, {
      validators: [Validators.required, ageRangeValidator(18, 100)]
    })
  }, {
    validators: passwordMatchValidator()
  });
  
  get usernameControl() {
    return this.registrationForm.controls.username;
  }
  
  get emailControl() {
    return this.registrationForm.controls.email;
  }
  
  get passwordControl() {
    return this.registrationForm.controls.password;
  }
  
  get confirmPasswordControl() {
    return this.registrationForm.controls.confirmPassword;
  }
  
  get ageControl() {
    return this.registrationForm.controls.age;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const value = this.registrationForm.getRawValue();
      console.log('Registration data:', value);
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 16. hostDirectives

**What is it?**

`hostDirectives` (introduced in Angular 15) allows you to apply directives directly to a component's host element, enabling powerful composition patterns without inheritance.

**Benefits:**
- **Composition over inheritance** - Reuse behavior without extending classes
- **Multiple directives** - Apply multiple directives to one component
- **Input/Output mapping** - Expose or hide directive inputs/outputs
- **Better encapsulation** - Clear separation of concerns

**Example - Basic hostDirectives:**

```typescript
import { Directive, HostListener, HostBinding } from '@angular/core';

// Tooltip directive
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @HostBinding('attr.title') tooltip = 'Default tooltip';
  @HostBinding('class.has-tooltip') hasTooltip = true;
  
  @HostListener('mouseenter')
  onMouseEnter(): void {
    console.log('Showing tooltip:', this.tooltip);
  }
  
  @HostListener('mouseleave')
  onMouseLeave(): void {
    console.log('Hiding tooltip');
  }
}

// Highlight directive
@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[style.backgroundColor]': 'backgroundColor'
  }
})
export class HighlightDirective {
  backgroundColor = 'transparent';
  
  onMouseEnter(): void {
    this.backgroundColor = 'yellow';
  }
  
  onMouseLeave(): void {
    this.backgroundColor = 'transparent';
  }
}

// Component using hostDirectives
@Component({
  selector: 'app-fancy-button',
  standalone: true,
  hostDirectives: [
    TooltipDirective,
    HighlightDirective
  ],
  template: `
    <button>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  `]
})
export class FancyButtonComponent {}
```

**Example - Mapping Inputs and Outputs:**

```typescript
import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Component } from '@angular/core';

// Click tracker directive
@Directive({
  selector: '[appClickTracker]',
  standalone: true
})
export class ClickTrackerDirective {
  @Input() trackingId = '';
  @Output() tracked = new EventEmitter<{id: string; timestamp: number}>();
  
  @HostListener('click')
  onClick(): void {
    this.tracked.emit({
      id: this.trackingId,
      timestamp: Date.now()
    });
  }
}

// Disabled state directive
@Directive({
  selector: '[appDisableable]',
  standalone: true,
  host: {
    '[attr.disabled]': 'isDisabled || null',
    '[class.disabled]': 'isDisabled'
  }
})
export class DisableableDirective {
  @Input() isDisabled = false;
}

// Component with mapped inputs/outputs
@Component({
  selector: 'app-tracked-button',
  standalone: true,
  hostDirectives: [
    {
      directive: ClickTrackerDirective,
      inputs: ['trackingId'],  // Expose this input
      outputs: ['tracked']      // Expose this output
    },
    {
      directive: DisableableDirective,
      inputs: ['isDisabled: disabled']  // Map to different name
    }
  ],
  template: `
    <button>
      <ng-content></ng-content>
    </button>
  `
})
export class TrackedButtonComponent {}

// Usage
@Component({
  selector: 'app-usage-example',
  standalone: true,
  imports: [TrackedButtonComponent],
  template: `
    <app-tracked-button
      trackingId="btn-submit"
      [disabled]="isSubmitting"
      (tracked)="onTracked($event)">
      Submit
    </app-tracked-button>
  `
})
export class UsageExampleComponent {
  isSubmitting = false;
  
  onTracked(event: {id: string; timestamp: number}): void {
    console.log('Button clicked:', event);
  }
}
```

**Example - Advanced Composition:**

```typescript
import { Directive, Input, HostBinding, HostListener } from '@angular/core';
import { Component, signal } from '@angular/core';

// Loading state directive
@Directive({
  selector: '[appLoading]',
  standalone: true,
  host: {
    '[class.loading]': 'isLoading',
    '[attr.aria-busy]': 'isLoading'
  }
})
export class LoadingDirective {
  @Input() isLoading = false;
}

// Click throttle directive
@Directive({
  selector: '[appThrottle]',
  standalone: true
})
export class ThrottleDirective {
  @Input() throttleMs = 1000;
  private lastClick = 0;
  private clickHandler?: () => void;
  
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    const now = Date.now();
    
    if (now - this.lastClick < this.throttleMs) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    
    this.lastClick = now;
  }
}

// Ripple effect directive
@Directive({
  selector: '[appRipple]',
  standalone: true
})
export class RippleDirective {
  @HostBinding('class.ripple-container') hasRipple = true;
  
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    const rect = target.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    target.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// Component composing multiple directives
@Component({
  selector: 'app-action-button',
  standalone: true,
  hostDirectives: [
    {
      directive: LoadingDirective,
      inputs: ['isLoading: loading']
    },
    {
      directive: ThrottleDirective,
      inputs: ['throttleMs: throttle']
    },
    RippleDirective
  ],
  template: `
    <button (click)="handleClick()">
      @if (loading()) {
        <span class="spinner"></span>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  styles: [`
    button {
      position: relative;
      overflow: hidden;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
      cursor: pointer;
    }
    
    button.loading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    :host-context(.ripple-container) ::ng-deep .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `]
})
export class ActionButtonComponent {
  loading = signal(false);
  
  async handleClick(): Promise<void> {
    this.loading.set(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.loading.set(false);
  }
}
```

[Back to top](#table-of-contents)

---

### 17. Directive Inheritance

**What is it?**

Directive inheritance allows directives and components to inherit properties, methods, and lifecycle hooks from base classes, enabling code reuse and establishing hierarchies.

**Example - Base Directive:**

```typescript
import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// Base directive with common functionality
@Directive()
export abstract class BaseComponent implements OnInit, OnDestroy {
  @Input() debug = false;
  
  protected destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    if (this.debug) {
      console.log(`${this.constructor.name} initialized`);
    }
    this.onInit();
  }
  
  ngOnDestroy(): void {
    if (this.debug) {
      console.log(`${this.constructor.name} destroyed`);
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.onDestroy();
  }
  
  // Template method pattern
  protected onInit(): void {}
  protected onDestroy(): void {}
  
  protected logError(error: unknown): void {
    console.error(`Error in ${this.constructor.name}:`, error);
  }
}

// Child component inheriting from base
@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div>
      @for (user of users; track user.id) {
        <div>{{ user.name }}</div>
      }
    </div>
  `
})
export class UserListComponent extends BaseComponent {
  users: Array<{id: number; name: string}> = [];
  
  protected override onInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(): void {
    // Component-specific initialization
    this.users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ];
  }
}
```

**Example - Form Base Component:**

```typescript
import { Directive, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

// Base form component
@Directive()
export abstract class BaseFormComponent<T> {
  @Input() formGroup!: FormGroup;
  
  submitted = false;
  
  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }
  
  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }
    
    if (field.errors['required']) {
      return 'This field is required';
    }
    
    if (field.errors['email']) {
      return 'Invalid email format';
    }
    
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    
    return 'Invalid value';
  }
  
  // Helper method to mark all fields as touched
  markAllAsTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.markAsTouched();
    });
  }
  
  // Abstract method that child classes must implement
  abstract onSubmit(): void;
  
  // Template method
  handleSubmit(): void {
    this.submitted = true;
    this.markAllAsTouched();
    
    if (this.formGroup.valid) {
      this.onSubmit();
    }
  }
}

// Child component using base form functionality
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="handleSubmit()">
      <div>
        <label>Email</label>
        <input type="email" formControlName="email">
        
        @if (isFieldInvalid('email')) {
          <span class="error">{{ getErrorMessage('email') }}</span>
        }
      </div>
      
      <div>
        <label>Password</label>
        <input type="password" formControlName="password">
        
        @if (isFieldInvalid('password')) {
          <span class="error">{{ getErrorMessage('password') }}</span>
        }
      </div>
      
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginFormComponent extends BaseFormComponent<LoginData> {
  override formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  
  onSubmit(): void {
    const loginData = this.formGroup.value as LoginData;
    console.log('Login with:', loginData);
    // Perform login
  }
}

interface LoginData {
  email: string;
  password: string;
}
```

**Example - Data Loading Base Class:**

```typescript
import { Directive, OnInit, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// Base class for components that load data
@Directive()
export abstract class BaseDataComponent<T> implements OnInit, OnDestroy {
  data = signal<T[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  protected destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Template method - subclasses must implement
  protected abstract fetchData(): Observable<T[]>;
  
  // Concrete method
  loadData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.fetchData()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.onDataLoaded(data);
        },
        error: (err) => {
          this.error.set(err.message || 'An error occurred');
          this.onDataError(err);
        }
      });
  }
  
  // Hook methods
  protected onDataLoaded(data: T[]): void {}
  protected onDataError(error: unknown): void {
    console.error('Data loading error:', error);
  }
  
  // Utility methods
  retry(): void {
    this.loadData();
  }
  
  refresh(): void {
    this.data.set([]);
    this.loadData();
  }
}

// Concrete implementation
interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  template: `
    @if (loading()) {
      <div>Loading users...</div>
    } @else if (error()) {
      <div class="error">
        {{ error() }}
        <button (click)="retry()">Retry</button>
      </div>
    } @else {
      <div>
        <button (click)="refresh()">Refresh</button>
        
        @for (user of data(); track user.id) {
          <div class="user-card">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
        }
      </div>
    }
  `
})
export class UserDashboardComponent extends BaseDataComponent<User> {
  private http = inject(HttpClient);
  
  protected override fetchData(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  protected override onDataLoaded(data: User[]): void {
    console.log(`Loaded ${data.length} users`);
  }
}
```

[Back to top](#table-of-contents)

---

### 18. NgOptimizedImage

**What is it?**

`NgOptimizedImage` is a directive (introduced in Angular 15) that optimizes image loading to improve Core Web Vitals, especially Largest Contentful Paint (LCP).

**Key Features:**
- **Automatic srcset generation** - Responsive images
- **Lazy loading** - Load images only when needed
- **Priority hints** - Prioritize critical images
- **Size validation** - Warns about missing dimensions
- **Preconnect hints** - Faster CDN connections

**Installation:**

```typescript
import { NgOptimizedImage } from '@angular/common';
```

**Example - Basic Usage:**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <!-- Priority image (above the fold) -->
    <img 
      ngSrc="hero-image.jpg"
      alt="Hero"
      width="1200"
      height="600"
      priority>
    
    <!-- Lazy loaded images (below the fold) -->
    <img 
      ngSrc="product-1.jpg"
      alt="Product 1"
      width="400"
      height="300"
      loading="lazy">
    
    <img 
      ngSrc="product-2.jpg"
      alt="Product 2"
      width="400"
      height="300"
      loading="lazy">
  `,
  styles: [`
    img {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class ImageGalleryComponent {}
```

**Example - With Image Loader (CDN):**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage, provideCloudinaryLoader } from '@angular/common';

@Component({
  selector: 'app-cdn-images',
  standalone: true,
  imports: [NgOptimizedImage],
  providers: [
    // Cloudinary loader
    provideCloudinaryLoader('https://mycloud.cloudinary.com')
  ],
  template: `
    <!-- NgOptimizedImage will automatically generate srcset -->
    <img 
      ngSrc="my-image.jpg"
      alt="Optimized"
      width="800"
      height="600"
      sizes="(max-width: 768px) 100vw, 800px">
  `
})
export class CdnImagesComponent {}
```

**Example - Custom Image Loader:**

```typescript
import { Component, inject, ENVIRONMENT_INITIALIZER } from '@angular/core';
import { NgOptimizedImage, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

// Custom loader function
export function customImageLoader(config: ImageLoaderConfig): string {
  const { src, width } = config;
  
  // Your custom CDN logic
  return `https://my-cdn.com/images/${src}?w=${width}&q=80`;
}

@Component({
  selector: 'app-custom-loader',
  standalone: true,
  imports: [NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: customImageLoader
    }
  ],
  template: `
    <img 
      ngSrc="product.jpg"
      alt="Product"
      width="600"
      height="400"
      sizes="(max-width: 600px) 100vw, 600px">
  `
})
export class CustomLoaderComponent {}
```

**Example - Fill Mode (Container Fit):**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-fill-mode',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="image-container">
      <!-- Fill mode - image fills parent container -->
      <img 
        ngSrc="background.jpg"
        alt="Background"
        fill
        priority>
    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      width: 100%;
      height: 400px;
    }
    
    img {
      object-fit: cover;
    }
  `]
})
export class FillModeComponent {}
```

**Performance Benefits:**
- **30-50% faster LCP** - Priority hints for above-fold images
- **Reduced bandwidth** - Automatic responsive images
- **Better UX** - Prevents layout shift with required dimensions
- **CDN optimization** - Automatic query parameters for image CDNs

**Configuration - app.config.ts:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideImgixLoader } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global image loader
    provideImgixLoader('https://my-domain.imgix.net')
  ]
};
```

[Back to top](#table-of-contents)

---

### 19. Automatic srcset Generation

**What is it?**

When using `NgOptimizedImage`, Angular automatically generates `srcset` attributes to serve appropriately-sized images for different screen sizes and resolutions.

**How it Works:**
1. Angular generates multiple image URLs with different widths
2. Browser selects the best image based on screen size and pixel density
3. Reduces bandwidth usage and improves load times

**Example - Automatic srcset:**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-responsive-images',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <!-- Angular generates srcset automatically -->
    <img 
      ngSrc="product.jpg"
      alt="Product"
      width="800"
      height="600"
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 50vw, 
             800px">
    
    <!-- Generated HTML (approximately):
    <img 
      src="product.jpg?w=800"
      srcset="product.jpg?w=400 400w,
              product.jpg?w=800 800w,
              product.jpg?w=1200 1200w,
              product.jpg?w=1600 1600w"
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 50vw, 
             800px"
      width="800"
      height="600"
      alt="Product">
    -->
  `
})
export class ResponsiveImagesComponent {}
```

**Example - Custom Breakpoints:**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage, IMAGE_CONFIG, ImageConfig } from '@angular/common';

@Component({
  selector: 'app-custom-breakpoints',
  standalone: true,
  imports: [NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        breakpoints: [320, 640, 768, 1024, 1280, 1920]
      } as ImageConfig
    }
  ],
  template: `
    <img 
      ngSrc="hero.jpg"
      alt="Hero"
      width="1920"
      height="1080"
      sizes="100vw"
      priority>
  `
})
export class CustomBreakpointsComponent {}
```

**Example - Art Direction (Different Images for Different Sizes):**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-art-direction',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <picture>
      <!-- Mobile version (square crop) -->
      <source 
        media="(max-width: 640px)"
        [srcset]="getMobileSrcset()">
      
      <!-- Desktop version (wide crop) -->
      <img 
        ngSrc="hero-desktop.jpg"
        alt="Hero"
        width="1920"
        height="1080"
        sizes="100vw"
        priority>
    </picture>
  `
})
export class ArtDirectionComponent {
  getMobileSrcset(): string {
    return 'hero-mobile.jpg';
  }
}
```

**Example - Responsive Image Gallery:**

```typescript
import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="gallery">
      @for (image of images(); track image.src) {
        <div class="gallery-item">
          <img 
            [ngSrc]="image.src"
            [alt]="image.alt"
            [width]="image.width"
            [height]="image.height"
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            loading="lazy">
        </div>
      }
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .gallery-item img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
  `]
})
export class GalleryComponent {
  images = signal<GalleryImage[]>([
    { src: 'photo-1.jpg', alt: 'Photo 1', width: 800, height: 600 },
    { src: 'photo-2.jpg', alt: 'Photo 2', width: 800, height: 600 },
    { src: 'photo-3.jpg', alt: 'Photo 3', width: 800, height: 600 },
    { src: 'photo-4.jpg', alt: 'Photo 4', width: 800, height: 600 }
  ]);
}
```

[Back to top](#table-of-contents)

---

### 20. Lazy Loading

**What is it?**

Lazy loading defers loading of images until they're about to enter the viewport, reducing initial page load time and bandwidth usage.

**Example - Lazy Loading Images:**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-lazy-images',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="hero">
      <!-- Hero image - load immediately -->
      <img 
        ngSrc="hero.jpg"
        alt="Hero"
        width="1920"
        height="1080"
        priority>
    </div>
    
    <div class="content">
      <h2>Products</h2>
      
      <!-- Below-fold images - lazy load -->
      @for (product of products; track product.id) {
        <div class="product">
          <img 
            [ngSrc]="product.image"
            [alt]="product.name"
            width="400"
            height="300"
            loading="lazy">
          <h3>{{ product.name }}</h3>
        </div>
      }
    </div>
  `,
  styles: [`
    .hero {
      height: 100vh;
    }
    .product {
      margin: 20px 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class LazyImagesComponent {
  products = [
    { id: 1, name: 'Product 1', image: 'product-1.jpg' },
    { id: 2, name: 'Product 2', image: 'product-2.jpg' },
    { id: 3, name: 'Product 3', image: 'product-3.jpg' }
  ];
}
```

**Example - Lazy Loading with Intersection Observer:**

```typescript
import { Component, OnInit, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-custom-lazy-load',
  standalone: true,
  template: `
    <div class="image-wrapper" #imageWrapper>
      @if (isVisible()) {
        <img [src]="imageUrl" [alt]="altText">
      } @else {
        <div class="placeholder">Loading...</div>
      }
    </div>
  `,
  styles: [`
    .image-wrapper {
      min-height: 300px;
    }
    .placeholder {
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
    }
  `]
})
export class CustomLazyLoadComponent implements OnInit {
  @ViewChild('imageWrapper') imageWrapper!: ElementRef;
  
  imageUrl = 'large-image.jpg';
  altText = 'Large Image';
  isVisible = signal(false);

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(this.imageWrapper.nativeElement);
  }
}
```

**Example - Lazy Loading Routes:**

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    // Lazy load entire feature module
    loadChildren: () => import('./products/products.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  }
];
```

[Back to top](#table-of-contents)

---

### 21. Priority Loading

**What is it?**

Priority loading marks critical images (typically above-the-fold) to be loaded with high priority, improving Largest Contentful Paint (LCP).

**Example - Priority Images:**

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-priority-loading',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <!-- Above-the-fold hero image - HIGH PRIORITY -->
    <header class="hero">
      <img 
        ngSrc="hero-banner.jpg"
        alt="Welcome Banner"
        width="1920"
        height="1080"
        priority
        fetchpriority="high">
    </header>
    
    <!-- Logo - also priority -->
    <nav>
      <img 
        ngSrc="logo.png"
        alt="Company Logo"
        width="200"
        height="50"
        priority>
    </nav>
    
    <!-- Below-fold content - lazy load -->
    <main>
      @for (item of contentItems; track item.id) {
        <article>
          <img 
            [ngSrc]="item.image"
            [alt]="item.title"
            width="600"
            height="400"
            loading="lazy">
          <h2>{{ item.title }}</h2>
        </article>
      }
    </main>
  `,
  styles: [`
    .hero {
      height: 100vh;
      position: relative;
    }
    .hero img {
      object-fit: cover;
    }
  `]
})
export class PriorityLoadingComponent {
  contentItems = [
    { id: 1, title: 'Article 1', image: 'article-1.jpg' },
    { id: 2, title: 'Article 2', image: 'article-2.jpg' },
    { id: 3, title: 'Article 3', image: 'article-3.jpg' }
  ];
}
```

**Example - Preconnect for CDN:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-preconnect',
  standalone: true,
  template: `
    <!-- Preconnect hints in component template -->
    <link rel="preconnect" href="https://cdn.example.com">
    <link rel="dns-prefetch" href="https://cdn.example.com">
    
    <img 
      src="https://cdn.example.com/hero.jpg"
      alt="Hero"
      width="1920"
      height="1080">
  `
})
export class PreconnectComponent {}
```

**index.html - Global Preconnect:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My App</title>
  <base href="/">
  
  <!-- Preconnect to critical origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.example.com">
  
  <!-- DNS prefetch for non-critical origins -->
  <link rel="dns-prefetch" href="https://analytics.example.com">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

[Back to top](#table-of-contents)

---

### 22. Image Preloading

**What is it?**

Image preloading loads critical images before they're requested by the browser, further improving LCP and user experience.

**Example - Preload with Link Tag:**

```typescript
import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-preload-images',
  standalone: true,
  template: `
    <img 
      src="/assets/hero.jpg"
      alt="Hero"
      width="1920"
      height="1080">
  `
})
export class PreloadImagesComponent implements OnInit {
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngOnInit(): void {
    // Dynamically add preload link
    this.preloadImage('/assets/hero.jpg');
  }

  private preloadImage(href: string): void {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'preload');
    this.renderer.setAttribute(link, 'as', 'image');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(this.document.head, link);
  }
}
```

**Example - Preload Multiple Images:**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

interface PreloadImage {
  href: string;
  type?: string;
  media?: string;
}

@Component({
  selector: 'app-image-preloader',
  standalone: true,
  template: `
    <div class="gallery">
      @for (image of images; track image) {
        <img [src]="image" alt="Gallery image">
      }
    </div>
  `
})
export class ImagePreloaderComponent implements OnInit {
  private meta = inject(Meta);
  
  images = [
    '/assets/image-1.jpg',
    '/assets/image-2.jpg',
    '/assets/image-3.jpg'
  ];

  ngOnInit(): void {
    // Preload first 2 images
    this.preloadImages([
      { href: this.images[0] },
      { href: this.images[1] }
    ]);
  }

  private preloadImages(images: PreloadImage[]): void {
    images.forEach(image => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = image.href;
      
      if (image.type) {
        link.type = image.type;
      }
      
      if (image.media) {
        link.media = image.media;
      }
      
      document.head.appendChild(link);
    });
  }
}
```

**Example - Responsive Image Preload:**

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-responsive-preload',
  standalone: true,
  template: `
    <picture>
      <source 
        media="(max-width: 640px)"
        srcset="/assets/hero-mobile.jpg">
      <source 
        media="(min-width: 641px)"
        srcset="/assets/hero-desktop.jpg">
      <img 
        src="/assets/hero-desktop.jpg"
        alt="Hero"
        width="1920"
        height="1080">
    </picture>
  `
})
export class ResponsivePreloadComponent implements OnInit {
  ngOnInit(): void {
    // Preload appropriate image based on screen size
    if (window.innerWidth <= 640) {
      this.preloadImage('/assets/hero-mobile.jpg', '(max-width: 640px)');
    } else {
      this.preloadImage('/assets/hero-desktop.jpg', '(min-width: 641px)');
    }
  }

  private preloadImage(href: string, media?: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    
    if (media) {
      link.media = media;
    }
    
    document.head.appendChild(link);
  }
}
```

[Back to top](#table-of-contents)

---

### 23. Hydration

**What is it?**

Hydration (introduced in Angular 16) is the process of restoring server-rendered HTML to a fully interactive Angular application in the browser. It reuses the existing DOM structure instead of destroying and recreating it.

**Benefits:**
- **Faster initial render** - Reuse server-rendered HTML
- **Better performance** - No DOM destruction/recreation
- **Improved Core Web Vitals** - Better FCP, LCP, and CLS
- **SEO friendly** - Content available immediately

**Setup - app.config.ts:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration() // Enable hydration
  ]
};
```

**Example - Hydration-friendly Component:**

```typescript
import { Component, signal, OnInit, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="profile">
      <h1>{{ user().name }}</h1>
      <p>{{ user().email }}</p>
      
      @if (isBrowser()) {
        <p>Browser-only feature: {{ browserData() }}</p>
      }
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  
  user = signal({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  browserData = signal('');

  ngOnInit(): void {
    // This runs on both server and client
    console.log('Component initialized');
    
    // Browser-only code
    afterNextRender(() => {
      // This only runs in browser
      this.browserData.set(window.navigator.userAgent);
    });
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
```

**Example - Avoiding Hydration Mismatches:**

```typescript
import { Component, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-timestamp',
  standalone: true,
  template: `
    <div>
      <p>Server rendered at: {{ serverTime() }}</p>
      
      <!-- Use ngSkipHydration for dynamic content -->
      <div ngSkipHydration>
        <p>Current browser time: {{ browserTime() }}</p>
      </div>
    </div>
  `
})
export class TimestampComponent {
  serverTime = signal(new Date().toISOString());
  browserTime = signal('');

  constructor() {
    afterNextRender(() => {
      // Update browser time after hydration
      this.browserTime.set(new Date().toISOString());
      
      // Start interval for browser time
      setInterval(() => {
        this.browserTime.set(new Date().toISOString());
      }, 1000);
    });
  }
}
```

**Example - HTTP Transfer State:**

```typescript
import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';

const USERS_KEY = makeStateKey<User[]>('users');

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <div>
      @for (user of users(); track user.id) {
        <div class="user">{{ user.name }}</div>
      }
    </div>
  `
})
export class UsersListComponent implements OnInit {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  
  users = signal<User[]>([]);

  ngOnInit(): void {
    // Check if data is available from server
    const usersFromServer = this.transferState.get(USERS_KEY, null);
    
    if (usersFromServer) {
      // Use server data (avoid duplicate HTTP call)
      this.users.set(usersFromServer);
      this.transferState.remove(USERS_KEY);
    } else {
      // Fetch data (server-side)
      this.http.get<User[]>('/api/users').subscribe(data => {
        this.users.set(data);
        // Store for transfer to client
        this.transferState.set(USERS_KEY, data);
      });
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 24. DestroyRef

**What is it?**

`DestroyRef` (introduced in Angular 16) provides a simpler way to manage cleanup logic when a component, directive, or service is destroyed. It replaces the need for `ngOnDestroy` in many cases.

**Benefits:**
- **Simpler cleanup** - No need for `OnDestroy` interface
- **Injectable** - Can be used in services and functions
- **Functional approach** - Register multiple cleanup callbacks
- **Better composition** - Works with `inject()` function

**Example - Basic DestroyRef Usage:**

```typescript
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: `
    <div>
      <p>Timer: {{ count }}</p>
    </div>
  `
})
export class TimerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  count = 0;

  ngOnInit(): void {
    const subscription = interval(1000).subscribe(() => {
      this.count++;
    });
    
    // Register cleanup callback
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      console.log('Timer cleaned up');
    });
  }
}
```

**Example - Multiple Cleanup Callbacks:**

```typescript
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  template: `
    <div>
      @if (loading) {
        <p>Loading...</p>
      } @else {
        <p>Data: {{ data }}</p>
      }
    </div>
  `
})
export class DataLoaderComponent implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  
  loading = false;
  data: any;

  ngOnInit(): void {
    this.loading = true;
    
    const subscription = this.http.get('/api/data').subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      }
    });
    
    // Cleanup HTTP subscription
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      console.log('HTTP request cleaned up');
    });
    
    // Additional cleanup
    this.destroyRef.onDestroy(() => {
      console.log('Component destroyed');
    });
  }
}
```

**Example - Reusable Cleanup Function:**

```typescript
import { DestroyRef, inject } from '@angular/core';
import { Observable } from 'rxjs';

// Reusable function for RxJS cleanup
export function takeUntilDestroyed<T>() {
  const destroyRef = inject(DestroyRef);
  
  return (source: Observable<T>) =>
    new Observable<T>(subscriber => {
      const subscription = source.subscribe(subscriber);
      
      destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
      
      return subscription;
    });
}

// Usage in component
@Component({
  selector: 'app-user-data',
  standalone: true,
  template: `<div>{{ userName }}</div>`
})
export class UserDataComponent implements OnInit {
  private http = inject(HttpClient);
  
  userName = '';

  ngOnInit(): void {
    this.http.get<{name: string}>('/api/user')
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.userName = user.name;
      });
  }
}
```

**Example - DestroyRef in Services:**

```typescript
import { Injectable, DestroyRef, inject } from '@angular/core';
import { interval } from 'rxjs';

@Injectable()
export class PollingService {
  private destroyRef = inject(DestroyRef);
  private data: any[] = [];

  startPolling(): void {
    const subscription = interval(5000).subscribe(() => {
      console.log('Polling...');
      // Fetch data
    });
    
    // Cleanup when service is destroyed
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      console.log('Polling stopped');
    });
  }

  getData(): any[] {
    return this.data;
  }
}
```

**Example - Comparing with ngOnDestroy:**

```typescript
// OLD WAY - using ngOnDestroy
@Component({
  selector: 'app-old-way',
  standalone: true,
  template: `<div>{{ data }}</div>`
})
export class OldWayComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  data = '';

  ngOnInit(): void {
    this.subscription = interval(1000).subscribe(() => {
      this.data = new Date().toISOString();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

// NEW WAY - using DestroyRef
@Component({
  selector: 'app-new-way',
  standalone: true,
  template: `<div>{{ data }}</div>`
})
export class NewWayComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  data = '';

  ngOnInit(): void {
    const subscription = interval(1000).subscribe(() => {
      this.data = new Date().toISOString();
    });
    
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
```

[Back to top](#table-of-contents)

---

### 25. @loading Block

**What is it?**

The `@loading` block (introduced in Angular 17) is part of deferrable views syntax that allows you to show a loading state while deferred content is being loaded.

**Example - Basic @loading:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-defer-demo',
  standalone: true,
  template: `
    @defer (on viewport) {
      <heavy-component></heavy-component>
    } @loading {
      <div class="loading-spinner">
        <p>Loading component...</p>
      </div>
    }
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
  `]
})
export class DeferDemoComponent {}
```

**Example - Loading with Minimum Time:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-minimum',
  standalone: true,
  template: `
    @defer (on idle) {
      <user-dashboard></user-dashboard>
    } @loading (minimum 2s) {
      <!-- Show for at least 2 seconds to avoid flicker -->
      <div class="skeleton">
        <div class="skeleton-header"></div>
        <div class="skeleton-content"></div>
      </div>
    } @placeholder {
      <div>Click to load dashboard</div>
    }
  `,
  styles: [`
    .skeleton {
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    .skeleton-header {
      height: 40px;
      background: #e0e0e0;
      margin-bottom: 16px;
      border-radius: 4px;
    }
    
    .skeleton-content {
      height: 200px;
      background: #e0e0e0;
      border-radius: 4px;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class LoadingMinimumComponent {}
```

**Example - Loading with After Time:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-after',
  standalone: true,
  template: `
    @defer (on interaction) {
      <analytics-dashboard></analytics-dashboard>
    } @loading (after 500ms; minimum 1s) {
      <!-- Only show loading after 500ms delay -->
      <!-- Keep visible for minimum 1 second once shown -->
      <div class="loading">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20"></circle>
        </svg>
        <p>Loading analytics...</p>
      </div>
    } @placeholder {
      <button>Load Analytics</button>
    }
  `,
  styles: [`
    .loading {
      text-align: center;
      padding: 60px 20px;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      animation: rotate 2s linear infinite;
    }
    
    .spinner circle {
      fill: none;
      stroke: #1976d2;
      stroke-width: 4;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dashoffset: -125px;
      }
    }
  `]
})
export class LoadingAfterComponent {}
```

**Example - Multiple Defer Blocks with Loading:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-multi-defer',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      
      <!-- Header - load immediately -->
      <header-component></header-component>
      
      <!-- Charts - defer until viewport -->
      @defer (on viewport) {
        <charts-component></charts-component>
      } @loading (minimum 1s) {
        <div class="chart-skeleton"></div>
      }
      
      <!-- User table - defer until idle -->
      @defer (on idle) {
        <user-table-component></user-table-component>
      } @loading (after 300ms) {
        <div class="table-loading">Loading users...</div>
      }
      
      <!-- Comments - defer until interaction -->
      @defer (on interaction) {
        <comments-section></comments-section>
      } @loading {
        <div class="comments-loading">Loading comments...</div>
      } @placeholder {
        <button>Load Comments</button>
      }
    </div>
  `
})
export class MultiDeferComponent {}
```

[Back to top](#table-of-contents)

---

### 26. @error Block

**What is it?**

The `@error` block (introduced in Angular 17) allows you to display error UI when a deferred dependency fails to load.

**Example - Basic @error:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-error-handling',
  standalone: true,
  template: `
    @defer (on viewport) {
      <heavy-component></heavy-component>
    } @loading {
      <p>Loading...</p>
    } @error {
      <div class="error-state">
        <p>⚠️ Failed to load component</p>
        <button (click)="retry()">Retry</button>
      </div>
    }
  `,
  styles: [`
    .error-state {
      padding: 20px;
      background: #ffebee;
      border: 1px solid #ef5350;
      border-radius: 4px;
      text-align: center;
    }
    
    .error-state button {
      margin-top: 12px;
      padding: 8px 16px;
      background: #ef5350;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ErrorHandlingComponent {
  retry(): void {
    window.location.reload();
  }
}
```

**Example - Detailed Error Handling:**

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-detailed-error',
  standalone: true,
  template: `
    <div class="content">
      @defer (on idle; prefetch on immediate) {
        <admin-dashboard></admin-dashboard>
      } @loading (after 500ms; minimum 1s) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      } @error {
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p class="error-message">
            We couldn't load the dashboard. This might be due to:
          </p>
          <ul class="error-reasons">
            <li>Network connection issues</li>
            <li>Server unavailability</li>
            <li>Missing resources</li>
          </ul>
          <div class="error-actions">
            <button (click)="reloadPage()" class="btn-primary">
              Reload Page
            </button>
            <button (click)="goHome()" class="btn-secondary">
              Go to Home
            </button>
          </div>
        </div>
      } @placeholder {
        <div class="placeholder">
          <p>Dashboard will load when browser is idle</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .error-container {
      max-width: 500px;
      margin: 60px auto;
      padding: 40px;
      text-align: center;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .error-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    .error-message {
      color: #666;
      margin: 20px 0;
    }
    
    .error-reasons {
      text-align: left;
      margin: 20px 0;
      padding-left: 30px;
      color: #666;
    }
    
    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 30px;
    }
    
    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    
    .btn-primary:hover {
      background: #1565c0;
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }
    
    .btn-secondary:hover {
      background: #e0e0e0;
    }
  `]
})
export class DetailedErrorComponent {
  reloadPage(): void {
    window.location.reload();
  }

  goHome(): void {
    window.location.href = '/';
  }
}
```

**Example - Error with Fallback Content:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-error-fallback',
  standalone: true,
  template: `
    <div class="widget-container">
      <h2>Advanced Analytics</h2>
      
      @defer (on viewport; prefetch on idle) {
        <advanced-charts></advanced-charts>
      } @loading (minimum 800ms) {
        <div class="chart-skeleton">
          <div class="skeleton-bar"></div>
          <div class="skeleton-bar"></div>
          <div class="skeleton-bar"></div>
        </div>
      } @error {
        <!-- Fallback to basic chart -->
        <div class="error-fallback">
          <p class="fallback-message">
            ⚠️ Advanced analytics unavailable
          </p>
          <basic-chart></basic-chart>
          <p class="fallback-note">
            Showing basic chart as fallback
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .widget-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
    }
    
    .chart-skeleton {
      display: flex;
      gap: 20px;
      align-items: flex-end;
      height: 300px;
      padding: 20px;
    }
    
    .skeleton-bar {
      flex: 1;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    .skeleton-bar:nth-child(1) { height: 80%; }
    .skeleton-bar:nth-child(2) { height: 60%; }
    .skeleton-bar:nth-child(3) { height: 90%; }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .error-fallback {
      padding: 20px;
      border: 2px dashed #ff9800;
      border-radius: 4px;
      background: #fff3e0;
    }
    
    .fallback-message {
      color: #e65100;
      font-weight: 500;
      margin-bottom: 16px;
    }
    
    .fallback-note {
      color: #666;
      font-size: 14px;
      margin-top: 16px;
      font-style: italic;
    }
  `]
})
export class ErrorFallbackComponent {}
```

[Back to top](#table-of-contents)

---

### 27. Pristine in Forms

**What is it?**

`pristine` is a form control property that indicates whether the user has changed the value. It's `true` initially and becomes `false` once the user modifies the value.

**States:**
- **pristine**: `true` - User hasn't changed the value
- **dirty**: `true` - User has changed the value (opposite of pristine)
- **touched**: `true` - User has focused/blurred the control
- **untouched**: `true` - User hasn't interacted with the control

**Example - Using Pristine State:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pristine-demo',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="username">Username</label>
        <input 
          id="username"
          type="text"
          formControlName="username"
          [class.modified]="usernameControl.dirty">
        
        <div class="field-status">
          <span [class.active]="usernameControl.pristine">
            ✓ Pristine: {{ usernameControl.pristine }}
          </span>
          <span [class.active]="usernameControl.dirty">
            ✓ Dirty: {{ usernameControl.dirty }}
          </span>
        </div>
        
        @if (usernameControl.invalid && usernameControl.dirty) {
          <span class="error">Username is required</span>
        }
      </div>
      
      <div class="form-field">
        <label for="email">Email</label>
        <input 
          id="email"
          type="email"
          formControlName="email"
          [class.modified]="emailControl.dirty">
        
        @if (emailControl.invalid && emailControl.dirty) {
          <span class="error">Valid email is required</span>
        }
      </div>
      
      <div class="form-actions">
        <!-- Only enable save if form is dirty and valid -->
        <button 
          type="submit"
          [disabled]="userForm.pristine || userForm.invalid">
          Save Changes
        </button>
        
        <button 
          type="button"
          (click)="reset()"
          [disabled]="userForm.pristine">
          Reset
        </button>
      </div>
      
      <div class="form-debug">
        <h3>Form State:</h3>
        <p>Pristine: {{ userForm.pristine }}</p>
        <p>Dirty: {{ userForm.dirty }}</p>
        <p>Valid: {{ userForm.valid }}</p>
      </div>
    </form>
  `,
  styles: [`
    .form-field {
      margin-bottom: 20px;
    }
    
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color 0.3s;
    }
    
    input.modified {
      border-color: #1976d2;
      background: #e3f2fd;
    }
    
    .field-status {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      font-size: 14px;
    }
    
    .field-status span {
      color: #999;
    }
    
    .field-status span.active {
      color: #1976d2;
      font-weight: 500;
    }
    
    .error {
      color: #d32f2f;
      font-size: 14px;
      display: block;
      margin-top: 4px;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    
    button[type="submit"] {
      background: #1976d2;
      color: white;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .form-debug {
      margin-top: 30px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class PristineDemoComponent {
  private fb = inject(FormBuilder);
  
  userForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  get usernameControl() {
    return this.userForm.get('username')!;
  }
  
  get emailControl() {
    return this.userForm.get('email')!;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      
      // Mark as pristine after successful save
      this.userForm.markAsPristine();
    }
  }

  reset(): void {
    this.userForm.reset();
    // After reset, form is pristine again
  }
}
```

**Example - Unsaved Changes Warning:**

```typescript
import { Component, inject, HostListener } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unsaved-warning',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="articleForm" (ngSubmit)="onSave()">
      <div>
        <label>Title</label>
        <input type="text" formControlName="title">
      </div>
      
      <div>
        <label>Content</label>
        <textarea formControlName="content" rows="10"></textarea>
      </div>
      
      @if (articleForm.dirty) {
        <div class="warning">
          ⚠️ You have unsaved changes
        </div>
      }
      
      <button type="submit" [disabled]="articleForm.invalid">
        Save Article
      </button>
    </form>
  `,
  styles: [`
    .warning {
      padding: 12px;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      margin: 16px 0;
      color: #856404;
    }
  `]
})
export class UnsavedWarningComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  articleForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });
  
  // Prevent navigation if form is dirty
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.articleForm.dirty) {
      $event.preventDefault();
      $event.returnValue = 'You have unsaved changes. Do you want to leave?';
    }
  }

  canDeactivate(): boolean {
    if (this.articleForm.dirty) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  }

  onSave(): void {
    if (this.articleForm.valid) {
      console.log('Saving:', this.articleForm.value);
      
      // Mark as pristine after save
      this.articleForm.markAsPristine();
      
      this.router.navigate(['/articles']);
    }
  }
}
```

**Example - Conditional Validation Based on Pristine:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-conditional-validation',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Current Password</label>
        <input type="password" formControlName="currentPassword">
        
        <!-- Only show error if field was touched -->
        @if (currentPasswordControl.invalid && currentPasswordControl.touched) {
          <span class="error">Current password is required</span>
        }
      </div>
      
      <div>
        <label>New Password</label>
        <input type="password" formControlName="newPassword">
        
        <!-- Only show error after user starts typing -->
        @if (newPasswordControl.invalid && newPasswordControl.dirty) {
          <span class="error">Password must be at least 8 characters</span>
        }
      </div>
      
      <div>
        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword">
        
        @if (profileForm.hasError('passwordMismatch') && confirmPasswordControl.dirty) {
          <span class="error">Passwords don't match</span>
        }
      </div>
      
      <button type="submit" [disabled]="profileForm.pristine || profileForm.invalid">
        Update Password
      </button>
    </form>
  `,
  styles: [`
    .error {
      color: #d32f2f;
      font-size: 14px;
      display: block;
      margin-top: 4px;
    }
  `]
})
export class ConditionalValidationComponent {
  private fb = inject(FormBuilder);
  
  profileForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });
  
  get currentPasswordControl() {
    return this.profileForm.get('currentPassword')!;
  }
  
  get newPasswordControl() {
    return this.profileForm.get('newPassword')!;
  }
  
  get confirmPasswordControl() {
    return this.profileForm.get('confirmPassword')!;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Password updated');
      this.profileForm.markAsPristine();
    }
  }
}
```

[Back to top](#table-of-contents)

---

### 28. Linked Signals

**What is it?**

Linked signals (introduced in Angular 19) are signals that automatically update based on changes to other signals, creating reactive dependencies with more control than `computed()`.

**Example - Basic Linked Signal:**

```typescript
import { Component, signal, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-linked-demo',
  standalone: true,
  template: `
    <div>
      <input 
        type="text"
        [value]="searchQuery()"
        (input)="searchQuery.set($event.target.value)">
      
      <p>Search: {{ searchQuery() }}</p>
      <p>Normalized: {{ normalizedQuery() }}</p>
      
      <button (click)="resetQuery()">Reset</button>
    </div>
  `
})
export class LinkedDemoComponent {
  searchQuery = signal('');
  
  // Linked signal that depends on searchQuery
  // Can be updated independently
  normalizedQuery = linkedSignal(() => 
    this.searchQuery().toLowerCase().trim()
  );

  resetQuery(): void {
    this.searchQuery.set('');
    // normalizedQuery automatically updates
  }
}
```

**Example - Linked Signal vs Computed:**

```typescript
import { Component, signal, computed, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-comparison',
  standalone: true,
  template: `
    <div>
      <input 
        type="number"
        [value]="count()"
        (input)="count.set(+$event.target.value)">
      
      <div>
        <h3>Computed (read-only):</h3>
        <p>Doubled: {{ doubled() }}</p>
        <!-- Cannot set: doubled.set(20) // ERROR! -->
      </div>
      
      <div>
        <h3>Linked Signal (writable):</h3>
        <p>Tripled: {{ tripled() }}</p>
        <button (click)="tripled.set(100)">Set to 100</button>
      </div>
    </div>
  `
})
export class ComparisonComponent {
  count = signal(5);
  
  // Computed signal - READ ONLY
  doubled = computed(() => this.count() * 2);
  
  // Linked signal - CAN BE WRITTEN TO
  tripled = linkedSignal(() => this.count() * 3);
}
```

**Example - Complex Linked Signals:**

```typescript
import { Component, signal, linkedSignal } from '@angular/core';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

@Component({
  selector: 'app-user-filter',
  standalone: true,
  template: `
    <div>
      <div class="filters">
        <input 
          type="text"
          placeholder="Search users..."
          [value]="searchTerm()"
          (input)="searchTerm.set($event.target.value)">
        
        <select 
          [value]="roleFilter()"
          (change)="roleFilter.set($event.target.value)">
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        
        <button (click)="clearFilters()">Clear Filters</button>
      </div>
      
      <div class="results">
        <p>Showing {{ filteredUsers().length }} users</p>
        
        @for (user of filteredUsers(); track user.id) {
          <div class="user-card">
            <span>{{ user.name }}</span>
            <span class="role">{{ user.role }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .user-card {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    
    .role {
      background: #e3f2fd;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  `]
})
export class UserFilterComponent {
  users = signal<User[]>([
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'admin' },
    { id: 4, name: 'David', role: 'user' }
  ]);
  
  searchTerm = signal('');
  roleFilter = signal('all');
  
  // Linked signal for filtered users
  // Updates automatically when searchTerm or roleFilter changes
  // But can also be set manually if needed
  filteredUsers = linkedSignal(() => {
    const search = this.searchTerm().toLowerCase();
    const role = this.roleFilter();
    
    return this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search);
      const matchesRole = role === 'all' || user.role === role;
      return matchesSearch && matchesRole;
    });
  });

  clearFilters(): void {
    this.searchTerm.set('');
    this.roleFilter.set('all');
    // filteredUsers automatically recalculates
  }

  // You can also manually override the filtered list
  showOnlyAdmins(): void {
    this.filteredUsers.set(
      this.users().filter(u => u.role === 'admin')
    );
  }
}
```

[Back to top](#table-of-contents)

---

### 29. Linked Signals in Forms

**What is it?**

Linked signals in forms (Angular 19+) enable reactive form state management using signals, providing better integration between forms and signal-based state.

**Example - Form with Linked Signals:**

```typescript
import { Component, signal, linkedSignal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-with-signals',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label>First Name</label>
        <input type="text" formControlName="firstName">
      </div>
      
      <div>
        <label>Last Name</label>
        <input type="text" formControlName="lastName">
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" formControlName="email">
      </div>
      
      <!-- Display name updates reactively -->
      <div class="preview">
        <h3>Preview:</h3>
        <p><strong>Full Name:</strong> {{ fullName() }}</p>
        <p><strong>Email:</strong> {{ emailPreview() }}</p>
        <p><strong>Username:</strong> {{ suggestedUsername() }}</p>
      </div>
      
      <div class="status">
        <p>Form Valid: {{ formValid() }}</p>
        <p>Form Dirty: {{ formDirty() }}</p>
      </div>
      
      <button type="submit" [disabled]="!formValid()">
        Submit
      </button>
    </form>
  `,
  styles: [`
    .preview {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 4px;
      margin: 20px 0;
    }
    
    .status {
      margin: 16px 0;
      font-size: 14px;
      color: #666;
    }
  `]
})
export class FormWithSignalsComponent {
  private fb = inject(FormBuilder);
  
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  // Linked signals that track form values
  firstName = linkedSignal(() => this.userForm.value.firstName || '');
  lastName = linkedSignal(() => this.userForm.value.lastName || '');
  emailValue = linkedSignal(() => this.userForm.value.email || '');
  
  // Computed signals derived from form values
  fullName = computed(() => 
    `${this.firstName()} ${this.lastName()}`.trim() || 'Not provided'
  );
  
  emailPreview = computed(() => 
    this.emailValue() || 'Not provided'
  );
  
  suggestedUsername = computed(() => {
    const first = this.firstName().toLowerCase();
    const last = this.lastName().toLowerCase();
    return first && last ? `${first}.${last}` : 'Not available';
  });
  
  // Form state signals
  formValid = linkedSignal(() => this.userForm.valid);
  formDirty = linkedSignal(() => this.userForm.dirty);
  
  constructor() {
    // Update signals when form changes
    this.userForm.valueChanges.subscribe(() => {
      this.firstName.set(this.userForm.value.firstName || '');
      this.lastName.set(this.userForm.value.lastName || '');
      this.emailValue.set(this.userForm.value.email || '');
      this.formValid.set(this.userForm.valid);
      this.formDirty.set(this.userForm.dirty);
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', {
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.emailValue(),
        fullName: this.fullName(),
        username: this.suggestedUsername()
      });
    }
  }
}
```

**Example - Advanced Form State Management:**

```typescript
import { Component, signal, linkedSignal, effect } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

interface Task {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm">
      <div formArrayName="tasks">
        @for (task of tasksArray.controls; track $index; let i = $index) {
          <div [formGroupName]="i" class="task-item">
            <input type="checkbox" formControlName="completed">
            <input type="text" formControlName="title">
            <button type="button" (click)="removeTask(i)">Remove</button>
          </div>
        }
      </div>
      
      <button type="button" (click)="addTask()">Add Task</button>
      
      <div class="stats">
        <h3>Statistics:</h3>
        <p>Total Tasks: {{ totalTasks() }}</p>
        <p>Completed: {{ completedTasks() }}</p>
        <p>Pending: {{ pendingTasks() }}</p>
        <p>Progress: {{ progress() }}%</p>
      </div>
    </form>
  `,
  styles: [`
    .task-item {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: center;
    }
    
    .stats {
      margin-top: 24px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 4px;
    }
  `]
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  
  taskForm = this.fb.group({
    tasks: this.fb.array<FormGroup>([])
  });
  
  get tasksArray() {
    return this.taskForm.get('tasks') as FormArray;
  }
  
  // Linked signals for reactive statistics
  allTasks = linkedSignal<Task[]>(() => this.tasksArray.value);
  
  totalTasks = computed(() => this.allTasks().length);
  
  completedTasks = computed(() => 
    this.allTasks().filter(t => t.completed).length
  );
  
  pendingTasks = computed(() => 
    this.allTasks().filter(t => !t.completed).length
  );
  
  progress = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedTasks() / total) * 100);
  });
  
  constructor() {
    // Update signals when form changes
    this.taskForm.valueChanges.subscribe(() => {
      this.allTasks.set(this.tasksArray.value);
    });
    
    // Effect to log progress changes
    effect(() => {
      console.log(`Progress updated: ${this.progress()}%`);
    });
  }

  addTask(): void {
    const taskGroup = this.fb.group({
      title: ['', Validators.required],
      completed: [false]
    });
    this.tasksArray.push(taskGroup);
  }

  removeTask(index: number): void {
    this.tasksArray.removeAt(index);
  }
}
```

[Back to top](#table-of-contents)

---

### 30. Linked Signals vs Computed vs Effect

**What are they?**

Angular signals provide three reactive primitives for managing state and side effects. Understanding when to use each is crucial for building efficient applications.

**Quick Comparison:**

| Feature | Linked Signal | Computed Signal | Effect |
|---------|--------------|-----------------|--------|
| **Purpose** | Track external state | Derive values | Execute side effects |
| **Returns value** | ✅ Yes | ✅ Yes | ❌ No |
| **Can be read** | ✅ Yes | ✅ Yes | ❌ No |
| **Can be written** | ✅ Yes | ❌ No | ❌ No |
| **Runs automatically** | When source changes | When dependencies change | When dependencies change |
| **Lazy evaluation** | ❌ No | ✅ Yes | ❌ No |
| **When introduced** | Angular 19 | Angular 16 | Angular 16 |

---

#### Linked Signals

**Definition:** Track external state sources (like forms, observables, or other non-signal values) and synchronize them with signals.

**When to use:**
- Bridge between non-signal and signal-based code
- Track form values
- Sync with observables
- Listen to DOM events

**Example - Basic Linked Signal:**

```typescript
import { Component, linkedSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-linked-example',
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="Search...">
    <p>Search term: {{ searchTerm() }}</p>
    <p>Character count: {{ searchTerm().length }}</p>
  `
})
export class LinkedExampleComponent {
  searchControl = new FormControl('');
  
  // Linked signal tracks form control value
  searchTerm = linkedSignal(() => this.searchControl.value || '');
  
  constructor() {
    // Keep signal in sync with form control
    this.searchControl.valueChanges.subscribe(value => {
      this.searchTerm.set(value || '');
    });
  }
}
```

**Key Characteristics:**
- **Writable**: Can call `.set()` and `.update()`
- **Manual sync**: You control when it updates
- **Two-way binding**: Can sync external state both ways

---

#### Computed Signals

**Definition:** Derive values from other signals automatically. Recomputes only when dependencies change.

**When to use:**
- Derive values from other signals
- Transform or combine signal values
- Memoize expensive calculations
- Create reactive derived state

**Example - Computed Signals:**

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-computed-example',
  template: `
    <div>
      <input 
        type="number" 
        [value]="price()" 
        (input)="price.set(+$any($event.target).value)">
      
      <input 
        type="number" 
        [value]="quantity()" 
        (input)="quantity.set(+$any($event.target).value)">
      
      <div class="summary">
        <p>Subtotal: ${{ subtotal() }}</p>
        <p>Tax (10%): ${{ tax() }}</p>
        <p>Total: ${{ total() }}</p>
        <p>Discount eligible: {{ isDiscountEligible() ? 'Yes' : 'No' }}</p>
      </div>
    </div>
  `
})
export class ComputedExampleComponent {
  price = signal(10);
  quantity = signal(1);
  
  // Computed signals - automatically recalculate
  subtotal = computed(() => this.price() * this.quantity());
  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());
  isDiscountEligible = computed(() => this.total() > 100);
}
```

**Key Characteristics:**
- **Read-only**: Cannot be manually set
- **Automatic**: Updates when dependencies change
- **Memoized**: Only recalculates when needed
- **Lazy**: Only computes when read
- **Pure**: No side effects allowed

---

#### Effects

**Definition:** Execute side effects when signal dependencies change. Similar to `useEffect` in React.

**When to use:**
- Logging and analytics
- DOM manipulation
- Local storage sync
- External API calls (with caution)
- Debugging signal changes

**Example - Effects:**

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-effect-example',
  template: `
    <div>
      <input 
        type="text" 
        [value]="username()" 
        (input)="username.set($any($event.target).value)">
      
      <p>Username: {{ username() }}</p>
      <p>Check the console for logs</p>
    </div>
  `
})
export class EffectExampleComponent {
  username = signal('');
  
  constructor() {
    // Effect 1: Log changes
    effect(() => {
      console.log('Username changed to:', this.username());
    });
    
    // Effect 2: Sync to localStorage
    effect(() => {
      if (this.username()) {
        localStorage.setItem('username', this.username());
      }
    });
    
    // Effect 3: Validate and show warning
    effect(() => {
      const name = this.username();
      if (name.length > 0 && name.length < 3) {
        console.warn('Username too short!');
      }
    });
  }
}
```

**Key Characteristics:**
- **No return value**: Used only for side effects
- **Automatic**: Runs when dependencies change
- **Eager**: Runs immediately on creation
- **Cleanup**: Can return cleanup function

---

#### Real-World Comparison Example

Here's a comprehensive example showing all three in action:

```typescript
import { Component, signal, computed, effect, linkedSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-shopping-cart',
  imports: [ReactiveFormsModule],
  template: `
    <div class="cart">
      <h2>Shopping Cart</h2>
      
      <!-- Search products -->
      <input 
        [formControl]="searchControl" 
        placeholder="Search products...">
      
      <p>Searching for: {{ searchQuery() }}</p>
      
      <!-- Product selection -->
      <div>
        <button (click)="addItem(1, 29.99)">Add Product 1 ($29.99)</button>
        <button (click)="addItem(2, 49.99)">Add Product 2 ($49.99)</button>
        <button (click)="addItem(3, 19.99)">Add Product 3 ($19.99)</button>
      </div>
      
      <!-- Cart summary -->
      <div class="summary">
        <h3>Cart Summary</h3>
        <p>Items: {{ itemCount() }}</p>
        <p>Subtotal: ${{ subtotal().toFixed(2) }}</p>
        <p>Tax: ${{ tax().toFixed(2) }}</p>
        <p>Shipping: ${{ shippingCost() }}</p>
        <p><strong>Total: ${{ total().toFixed(2) }}</strong></p>
        
        @if (freeShippingEligible()) {
          <p class="promo">✓ Free shipping applied!</p>
        }
      </div>
      
      <button (click)="clearCart()">Clear Cart</button>
    </div>
  `,
  styles: [`
    .cart {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .summary {
      margin-top: 20px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .promo {
      color: green;
      font-weight: bold;
    }
    
    button {
      margin: 8px;
      padding: 10px 20px;
    }
  `]
})
export class ShoppingCartComponent {
  private http = inject(HttpClient);
  
  // ===== LINKED SIGNAL =====
  // Track external form control value
  searchControl = new FormControl('');
  searchQuery = linkedSignal(() => this.searchControl.value || '');
  
  // ===== REGULAR SIGNALS =====
  // Writable state
  cartItems = signal<Array<{ id: number; price: number }>>([]);
  
  // ===== COMPUTED SIGNALS =====
  // Derived state - automatically recalculates
  itemCount = computed(() => this.cartItems().length);
  
  subtotal = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.price, 0)
  );
  
  tax = computed(() => this.subtotal() * 0.08); // 8% tax
  
  freeShippingEligible = computed(() => this.subtotal() > 50);
  
  shippingCost = computed(() => 
    this.freeShippingEligible() ? 0 : 5.99
  );
  
  total = computed(() => 
    this.subtotal() + this.tax() + this.shippingCost()
  );
  
  constructor() {
    // Sync form control with linked signal
    this.searchControl.valueChanges.subscribe(value => {
      this.searchQuery.set(value || '');
    });
    
    // ===== EFFECT 1: Logging =====
    effect(() => {
      console.log('Cart updated:', {
        items: this.itemCount(),
        total: this.total()
      });
    });
    
    // ===== EFFECT 2: localStorage sync =====
    effect(() => {
      const items = this.cartItems();
      localStorage.setItem('cart', JSON.stringify(items));
    });
    
    // ===== EFFECT 3: Analytics tracking =====
    effect(() => {
      if (this.itemCount() > 0) {
        console.log('Track analytics: cart value', this.total());
        // this.analyticsService.track('cart_updated', { value: this.total() });
      }
    });
    
    // ===== EFFECT 4: Search API call =====
    effect(() => {
      const query = this.searchQuery();
      if (query.length >= 3) {
        console.log('Searching for:', query);
        // this.http.get(`/api/search?q=${query}`).subscribe(...);
      }
    });
    
    // ===== EFFECT 5: Show notification =====
    effect(() => {
      if (this.freeShippingEligible()) {
        console.log('🎉 Free shipping unlocked!');
        // this.notificationService.show('Free shipping unlocked!');
      }
    });
  }
  
  addItem(id: number, price: number): void {
    this.cartItems.update(items => [...items, { id, price }]);
  }
  
  clearCart(): void {
    this.cartItems.set([]);
  }
}
```

---

#### Decision Tree: Which to Use?

```
Do you need to return a value?
│
├─ NO → Use EFFECT
│   └─ For side effects: logging, API calls, localStorage
│
└─ YES → Do you need to write to it manually?
    │
    ├─ YES → Use LINKED SIGNAL (or regular signal)
    │   └─ For: form values, external state, user input
    │
    └─ NO → Use COMPUTED SIGNAL
        └─ For: derived values, transformations, calculations
```

---

#### Best Practices

**Linked Signals:**
```typescript
// ✅ Good - Track external state
searchTerm = linkedSignal(() => this.formControl.value);

// ❌ Bad - Just use computed instead
doubled = linkedSignal(() => this.count() * 2); // Use computed!
```

**Computed Signals:**
```typescript
// ✅ Good - Pure derivation
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

// ❌ Bad - Side effects in computed
total = computed(() => {
  console.log('Computing...'); // Don't do this!
  return this.price() * this.quantity();
});
```

**Effects:**
```typescript
// ✅ Good - Side effects
effect(() => {
  console.log('Count:', this.count());
  localStorage.setItem('count', String(this.count()));
});

// ❌ Bad - Use computed instead
effect(() => {
  this.doubled = this.count() * 2; // Use computed!
});
```

---

#### Performance Considerations

**Computed Signals:**
- ✅ Memoized (cached until dependencies change)
- ✅ Lazy (only computes when read)
- ✅ Efficient for expensive calculations

**Effects:**
- ⚠️ Run eagerly (immediately when dependencies change)
- ⚠️ Can cause performance issues if overused
- ⚠️ Avoid heavy operations

**Linked Signals:**
- ✅ Efficient for bridging non-signal code
- ⚠️ Requires manual synchronization
- ⚠️ Can cause memory leaks if not cleaned up

---

#### Common Patterns

**Pattern 1: Form + Computed + Effect**
```typescript
// Form value (linked signal)
const email = linkedSignal(() => this.emailControl.value);

// Validation (computed)
const isValidEmail = computed(() => /\S+@\S+\.\S+/.test(email()));

// Side effect
effect(() => {
  if (isValidEmail()) {
    console.log('Valid email:', email());
  }
});
```

**Pattern 2: State + Multiple Computed**
```typescript
const users = signal<User[]>([]);

// Computed derivations
const activeUsers = computed(() => users().filter(u => u.active));
const userCount = computed(() => users().length);
const averageAge = computed(() => {
  const all = users();
  return all.reduce((sum, u) => sum + u.age, 0) / all.length;
});
```

**Pattern 3: Computed Chain**
```typescript
const price = signal(100);
const quantity = signal(2);

const subtotal = computed(() => price() * quantity());
const tax = computed(() => subtotal() * 0.1);
const total = computed(() => subtotal() + tax());
```

---

#### Migration Guide

**From RxJS to Signals:**

```typescript
// ❌ Old RxJS way
class OldComponent {
  price$ = new BehaviorSubject(100);
  quantity$ = new BehaviorSubject(1);
  
  total$ = combineLatest([this.price$, this.quantity$]).pipe(
    map(([price, quantity]) => price * quantity)
  );
}

// ✅ New signals way
class NewComponent {
  price = signal(100);
  quantity = signal(1);
  
  total = computed(() => this.price() * this.quantity());
}
```

---

#### Summary

| Use Case | Choose |
|----------|--------|
| Track form value | Linked Signal |
| Calculate derived value | Computed Signal |
| Log to console | Effect |
| Sync to localStorage | Effect |
| Transform data | Computed Signal |
| Call API on change | Effect (with caution) |
| Combine multiple signals | Computed Signal |
| Update UI automatically | All work! (signals propagate changes) |

**Remember:**
- **Linked signals** = Bridge external state
- **Computed signals** = Pure transformations
- **Effects** = Side effects only

[Back to top](#table-of-contents)

---

## Conclusion

This document covers Angular features from version 9 through 20, focusing on:

- **Performance optimization** (Virtual scrolling, NgOptimizedImage, Hydration)
- **Developer experience** (Typed forms, Signals, DestroyRef)
- **Component architecture** (Host directives, Directive inheritance)
- **Accessibility** (a11y utilities, ARIA support)
- **Modern features** (Deferred views, Linked signals)

For the latest updates and detailed documentation, visit the [official Angular documentation](https://angular.dev).

---

[Back to top](#table-of-contents)
