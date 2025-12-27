// Service Worker JavaScript - Comprehensive Guide and Examples
/*
==========================================
SERVICE WORKER FUNDAMENTALS
==========================================

Service Workers are scripts that run in the background, separate from web pages.
They act as a proxy between your app and the network, enabling:
- Offline functionality
- Background sync
- Push notifications
- Caching strategies
- Network interception

Key Characteristics:
- Runs on a separate thread
- No direct DOM access
- Event-driven
- Requires HTTPS (except localhost)
- Has its own lifecycle
*/

// ==========================================
// 1. BASIC SERVICE WORKER REGISTRATION
// ==========================================

// main.ts - Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/' // Controls which pages the SW controls
      });
      
      console.log('SW registered:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}

function showUpdateNotification() {
  if (confirm('New version available! Reload to update?')) {
    window.location.reload();
  }
}

// ==========================================
// 2. SERVICE WORKER LIFECYCLE EVENTS
// ==========================================

// sw.js - Service Worker file
const CACHE_NAME = 'app-cache-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Installation - happens once per SW version
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    (async () => {
      // Pre-cache essential resources
      const cache = await caches.open(CACHE_NAME);
      const urlsToCache = [
        '/',
        '/index.html',
        '/manifest.json',
        '/styles.css',
        '/main.js',
        '/offline.html'
      ];
      
      await cache.addAll(urlsToCache);
      console.log('SW: Pre-caching completed');
      
      // Skip waiting to activate immediately
      await self.skipWaiting();
    })()
  );
});

// Activation - cleanup old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
      
      // Take control of all pages
      await self.clients.claim();
      console.log('SW: Activated and claimed clients');
    })()
  );
});

// ==========================================
// 3. CACHING STRATEGIES
// ==========================================

// Fetch event - intercept network requests
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Different strategies for different resource types
  if (url.pathname.startsWith('/api/')) {
    return networkFirstStrategy(request);
  } else if (url.pathname.match(/\.(js|css|woff2?|png|jpg|svg)$/)) {
    return cacheFirstStrategy(request);
  } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    return staleWhileRevalidateStrategy(request);
  } else {
    return networkOnlyStrategy(request);
  }
}

// Strategy 1: Cache First (good for static assets)
async function cacheFirstStrategy(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first failed:', error);
    return new Response('Resource not available', { status: 503 });
  }
}

// Strategy 2: Network First (good for API calls)
async function networkFirstStrategy(request: Request): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'No network connection' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Strategy 3: Stale While Revalidate (good for HTML pages)
async function staleWhileRevalidateStrategy(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background and update cache
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  try {
    const networkResponse = await networkPromise;
    return networkResponse || await cache.match('/offline.html') || new Response('Offline');
  } catch (error) {
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Strategy 4: Network Only (for dynamic content)
async function networkOnlyStrategy(request: Request): Promise<Response> {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
}

// ==========================================
// 4. BACKGROUND SYNC
// ==========================================

// Background sync for offline actions
self.addEventListener('sync', (event: SyncEvent) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();
    
    for (const requestData of pendingRequests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          await removePendingRequest(requestData.id);
          console.log('Background sync completed for:', requestData.url);
        }
      } catch (error) {
        console.error('Background sync failed for:', requestData.url, error);
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// Mock functions for IndexedDB operations
async function getPendingRequests(): Promise<any[]> {
  // Implementation would use IndexedDB to store/retrieve pending requests
  return [];
}

async function removePendingRequest(id: string): Promise<void> {
  // Implementation would remove the request from IndexedDB
}

// ==========================================
// 5. PUSH NOTIFICATIONS
// ==========================================

// Push event handler
self.addEventListener('push', (event: PushEvent) => {
  console.log('SW: Push received');
  
  const options: NotificationOptions = {
    body: 'Default notification body',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'default',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/action-open.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/action-close.png'
      }
    ]
  };
  
  let title = 'Default Title';
  let notificationOptions = options;
  
  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      notificationOptions = { ...options, ...data.options };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(title, notificationOptions)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('SW: Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  
  if (action === 'close') {
    return;
  }
  
  // Handle notification click
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });
      
      // If app is already open, focus it
      if (clients.length > 0) {
        const client = clients[0];
        await client.focus();
        
        // Send message to client
        client.postMessage({
          type: 'NOTIFICATION_CLICKED',
          action: action,
          data: event.notification.data
        });
      } else {
        // Open new window
        await self.clients.openWindow('/');
      }
    })()
  );
});

// ==========================================
// 6. MESSAGE HANDLING
// ==========================================

// Message event handler for communication with main thread
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  console.log('SW: Message received:', event.data);
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
      
    case 'CACHE_URLS':
      cacheUrls(payload.urls).then(() => {
        event.ports[0]?.postMessage({ cached: payload.urls.length });
      });
      break;
      
    default:
      console.warn('Unknown message type:', type);
  }
});

async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

async function cacheUrls(urls: string[]): Promise<void> {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.addAll(urls);
}

// ==========================================
// 7. ANGULAR SERVICE WORKER INTEGRATION
// ==========================================

import { Injectable } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  private onlineStatus$ = new BehaviorSubject<boolean>(navigator.onLine);
  
  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush
  ) {
    this.initializeServiceWorker();
    this.monitorNetworkStatus();
  }
  
  private initializeServiceWorker(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker not enabled');
      return;
    }
    
    // Check for updates
    this.swUpdate.versionUpdates.pipe(
      filter(evt => evt.type === 'VERSION_READY')
    ).subscribe(() => {
      this.promptForUpdate();
    });
    
    // Handle unrecoverable state
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('SW in unrecoverable state:', event.reason);
      this.handleUnrecoverableState();
    });
  }
  
  private promptForUpdate(): void {
    const shouldUpdate = confirm(
      'New version available! Would you like to update now?'
    );
    
    if (shouldUpdate) {
      window.location.reload();
    }
  }
  
  private handleUnrecoverableState(): void {
    if (confirm('App needs to reload due to a critical error. Reload now?')) {
      window.location.reload();
    }
  }
  
  private monitorNetworkStatus(): void {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));
    
    merge(online$, offline$).subscribe(status => {
      this.onlineStatus$.next(status);
      console.log('Network status:', status ? 'online' : 'offline');
    });
  }
  
  // Check for updates manually
  async checkForUpdates(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) return false;
    
    try {
      const hasUpdate = await this.swUpdate.checkForUpdate();
      console.log('Update check result:', hasUpdate);
      return hasUpdate;
    } catch (error) {
      console.error('Update check failed:', error);
      return false;
    }
  }
  
  // Activate waiting SW
  async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;
    
    try {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    } catch (error) {
      console.error('Update activation failed:', error);
    }
  }
  
  // Push notifications
  async requestPushSubscription(): Promise<PushSubscription | null> {
    if (!this.swPush.isEnabled) {
      console.log('Push notifications not enabled');
      return null;
    }
    
    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: 'YOUR_VAPID_PUBLIC_KEY'
      });
      
      console.log('Push subscription:', subscription);
      // Send subscription to your server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }
  
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // Send subscription to your backend
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }
  
  // Get online status
  get isOnline$() {
    return this.onlineStatus$.asObservable();
  }
  
  get isOnline(): boolean {
    return this.onlineStatus$.value;
  }
}

// ==========================================
// 8. USAGE IN ANGULAR COMPONENT
// ==========================================

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-worker-demo',
  template: `
    <div class="sw-status">
      <h2>Service Worker Status</h2>
      
      <div class="status-indicator" [class.online]="isOnline$ | async">
        {{ (isOnline$ | async) ? 'Online' : 'Offline' }}
      </div>
      
      <div class="actions">
        <button (click)="checkForUpdates()" [disabled]="!swEnabled">
          Check for Updates
        </button>
        
        <button (click)="enablePushNotifications()" [disabled]="!swEnabled">
          Enable Push Notifications
        </button>
        
        <button (click)="clearCache()">
          Clear Cache
        </button>
      </div>
      
      <div class="info" *ngIf="updateAvailable">
        <p>New version available!</p>
        <button (click)="activateUpdate()">Update Now</button>
      </div>
    </div>
  `,
  styles: [`
    .sw-status {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 20px;
    }
    
    .status-indicator {
      padding: 10px;
      border-radius: 4px;
      background: #f44336;
      color: white;
      margin: 10px 0;
    }
    
    .status-indicator.online {
      background: #4caf50;
    }
    
    .actions button {
      margin: 5px;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      background: #2196f3;
      color: white;
      cursor: pointer;
    }
    
    .actions button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .info {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 15px;
      border-radius: 4px;
      margin-top: 15px;
    }
  `]
})
export class ServiceWorkerDemoComponent implements OnInit {
  updateAvailable = false;
  swEnabled = false;
  
  constructor(private swService: ServiceWorkerService) {}
  
  ngOnInit(): void {
    this.swEnabled = 'serviceWorker' in navigator;
  }
  
  get isOnline$() {
    return this.swService.isOnline$;
  }
  
  async checkForUpdates(): Promise<void> {
    this.updateAvailable = await this.swService.checkForUpdates();
  }
  
  async activateUpdate(): Promise<void> {
    await this.swService.activateUpdate();
  }
  
  async enablePushNotifications(): Promise<void> {
    const subscription = await this.swService.requestPushSubscription();
    if (subscription) {
      alert('Push notifications enabled!');
    } else {
      alert('Failed to enable push notifications');
    }
  }
  
  clearCache(): void {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
        alert('Cache cleared!');
      });
    }
  }
}

// ==========================================
// 9. ANGULAR PWA CONFIGURATION
// ==========================================

// ngsw-config.json - Angular Service Worker configuration
const ngswConfig = {
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": [
        "/api/performance/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 100,
        "maxAge": "3d"
      }
    },
    {
      "name": "api-freshness",
      "urls": [
        "/api/news/**",
        "/api/updates/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 50,
        "maxAge": "1h"
      }
    }
  ]
};

// ==========================================
// 10. BEST PRACTICES & TIPS
// ==========================================

/*
SERVICE WORKER BEST PRACTICES:

1. CACHE STRATEGIES:
   - Static assets: Cache First
   - API data: Network First
   - HTML pages: Stale While Revalidate
   - User data: Network Only

2. CACHE MANAGEMENT:
   - Use versioned cache names
   - Clean up old caches on activate
   - Set cache size limits
   - Implement cache expiration

3. ERROR HANDLING:
   - Always provide fallbacks
   - Handle network failures gracefully
   - Log errors for debugging
   - Show meaningful offline messages

4. PERFORMANCE:
   - Preload critical resources
   - Use efficient cache strategies
   - Minimize SW script size
   - Avoid blocking main thread

5. TESTING:
   - Test offline scenarios
   - Test cache invalidation
   - Test update flows
   - Use Chrome DevTools

6. SECURITY:
   - Require HTTPS in production
   - Validate cached responses
   - Sanitize user inputs
   - Use proper CORS headers

7. UPDATES:
   - Handle SW updates gracefully
   - Inform users about updates
   - Test update scenarios
   - Provide manual update option

COMMON PITFALLS:
- Not handling SW updates properly
- Caching everything (storage limits)
- Not providing offline fallbacks
- Blocking main thread operations
- Not testing offline scenarios
- Forgetting to clean old caches
*/

export {
  ServiceWorkerService,
  ServiceWorkerDemoComponent,
  ngswConfig
};

