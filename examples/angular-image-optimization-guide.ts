// Angular Image Optimization - Complete Guide and Implementation
import { Component, OnInit, ViewChild, ElementRef, Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/*
==========================================
ANGULAR IMAGE OPTIMIZATION
==========================================

Angular provides several built-in image optimization features:

1. **NgOptimizedImage Directive** (Angular 14.2+)
   - Automatic lazy loading
   - Responsive images with srcset
   - Priority loading for above-the-fold images
   - Preconnect to image CDNs
   - Automatic WebP format detection
   - Built-in performance warnings

2. **Manual Optimization Techniques**
   - Lazy loading implementation
   - Progressive image loading
   - Image compression
   - Responsive images
   - CDN integration

3. **Performance Best Practices**
   - Image format optimization
   - Size optimization
   - Loading strategies
   - Caching strategies
*/

// ==========================================
// 1. NgOptimizedImage DIRECTIVE (BUILT-IN)
// ==========================================

@Component({
  selector: 'app-optimized-images',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div>
      <h2>🖼️ Angular NgOptimizedImage Examples</h2>
      
      <!-- Basic optimized image -->
      <div style="margin: 20px 0;">
        <h3>1. Basic Optimized Image</h3>
        <img 
          ngSrc="https://picsum.photos/800/600?random=1"
          alt="Sample image"
          width="800" 
          height="600"
          style="max-width: 100%; height: auto;">
      </div>

      <!-- Priority image (above the fold) -->
      <div style="margin: 20px 0;">
        <h3>2. Priority Image (Above the Fold)</h3>
        <img 
          ngSrc="https://picsum.photos/800/600?random=2"
          alt="Hero image"
          width="800" 
          height="600"
          priority
          style="max-width: 100%; height: auto;">
      </div>

      <!-- Responsive image with sizes -->
      <div style="margin: 20px 0;">
        <h3>3. Responsive Image</h3>
        <img 
          ngSrc="https://picsum.photos/1200/800?random=3"
          alt="Responsive image"
          width="1200" 
          height="800"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style="max-width: 100%; height: auto;">
      </div>

      <!-- Image with placeholder -->
      <div style="margin: 20px 0;">
        <h3>4. Image with Placeholder</h3>
        <img 
          ngSrc="https://picsum.photos/800/600?random=4"
          alt="Image with placeholder"
          width="800" 
          height="600"
          placeholder="https://via.placeholder.com/800x600/e0e0e0/999999?text=Loading..."
          style="max-width: 100%; height: auto;">
      </div>

      <!-- Fill mode image -->
      <div style="margin: 20px 0;">
        <h3>5. Fill Mode Image</h3>
        <div style="position: relative; width: 400px; height: 300px; border: 2px solid #ddd;">
          <img 
            ngSrc="https://picsum.photos/800/600?random=5"
            alt="Fill mode image"
            fill
            style="object-fit: cover;">
        </div>
      </div>

      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h3>✅ NgOptimizedImage Features:</h3>
        <ul>
          <li>🚀 <strong>Automatic lazy loading</strong> for better performance</li>
          <li>📱 <strong>Responsive images</strong> with automatic srcset generation</li>
          <li>⚡ <strong>Priority loading</strong> for above-the-fold images</li>
          <li>🌐 <strong>Preconnect hints</strong> for external image domains</li>
          <li>🖼️ <strong>Placeholder support</strong> during loading</li>
          <li>⚠️ <strong>Built-in warnings</strong> for performance issues</li>
          <li>🎯 <strong>Fill mode</strong> for container-sized images</li>
        </ul>
      </div>
    </div>
  `
})
export class OptimizedImagesComponent {
  constructor() {
    console.log('🖼️ OptimizedImagesComponent initialized with NgOptimizedImage');
  }
}

// ==========================================
// 2. MANUAL LAZY LOADING DIRECTIVE
// ==========================================

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad!: string; // Image source
  @Input() placeholder: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';

  private intersectionObserver?: IntersectionObserver;

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    this.createIntersectionObserver();
  }

  private createIntersectionObserver() {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, options);

    // Set placeholder initially
    const img = this.elementRef.nativeElement;
    img.src = this.placeholder;
    img.classList.add('lazy-loading');

    // Start observing
    this.intersectionObserver.observe(img);
  }

  private loadImage() {
    const img = this.elementRef.nativeElement;
    
    console.log('🖼️ Loading image:', this.appLazyLoad);
    
    // Create new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = this.appLazyLoad;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      console.log('✅ Image loaded successfully');
    };
    
    imageLoader.onerror = () => {
      console.error('❌ Failed to load image:', this.appLazyLoad);
      img.classList.add('lazy-error');
    };
    
    imageLoader.src = this.appLazyLoad;
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// ==========================================
// 3. PROGRESSIVE IMAGE LOADING COMPONENT
// ==========================================

@Component({
  selector: 'app-progressive-image',
  standalone: true,
  template: `
    <div class="progressive-image-container" [style.width.px]="width" [style.height.px]="height">
      <img 
        #lowResImg
        [src]="lowResSrc"
        [alt]="alt"
        class="progressive-image low-res"
        [class.loaded]="lowResLoaded"
        (load)="onLowResLoad()">
      
      <img 
        #highResImg
        [src]="highResSrc"
        [alt]="alt"
        class="progressive-image high-res"
        [class.loaded]="highResLoaded"
        (load)="onHighResLoad()"
        [style.display]="highResLoaded ? 'block' : 'none'">
      
      <div class="loading-indicator" *ngIf="!highResLoaded">
        <div class="spinner"></div>
        <p>Loading high quality image...</p>
      </div>
    </div>
  `,
  styles: [`
    .progressive-image-container {
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0;
    }
    
    .progressive-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }
    
    .progressive-image.low-res {
      filter: blur(2px);
      opacity: 0;
    }
    
    .progressive-image.low-res.loaded {
      opacity: 1;
    }
    
    .progressive-image.high-res {
      opacity: 0;
    }
    
    .progressive-image.high-res.loaded {
      opacity: 1;
    }
    
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ProgressiveImageComponent implements OnInit {
  @Input() lowResSrc!: string;   // Low resolution placeholder
  @Input() highResSrc!: string;  // High resolution image
  @Input() alt: string = '';
  @Input() width: number = 400;
  @Input() height: number = 300;

  lowResLoaded = false;
  highResLoaded = false;

  ngOnInit() {
    console.log('🖼️ Progressive image component initialized');
    console.log('   Low res:', this.lowResSrc);
    console.log('   High res:', this.highResSrc);
  }

  onLowResLoad() {
    this.lowResLoaded = true;
    console.log('✅ Low resolution image loaded');
  }

  onHighResLoad() {
    this.highResLoaded = true;
    console.log('✅ High resolution image loaded');
  }
}

// ==========================================
// 4. RESPONSIVE IMAGE SERVICE
// ==========================================

export interface ImageBreakpoint {
  breakpoint: number;
  width: number;
  quality?: number;
}

export interface ResponsiveImageConfig {
  baseUrl: string;
  breakpoints: ImageBreakpoint[];
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

@Component({
  selector: 'app-responsive-image',
  standalone: true,
  template: `
    <picture>
      <!-- WebP sources for modern browsers -->
      <source 
        *ngFor="let source of webpSources"
        [srcset]="source.srcset"
        [media]="source.media"
        type="image/webp">
      
      <!-- Fallback sources -->
      <source 
        *ngFor="let source of fallbackSources"
        [srcset]="source.srcset"
        [media]="source.media">
      
      <!-- Default image -->
      <img 
        [src]="defaultSrc"
        [alt]="alt"
        [style.width.%]="100"
        [style.height]="'auto'"
        (load)="onImageLoad()"
        (error)="onImageError()">
    </picture>
    
    <div *ngIf="showDebugInfo" style="background: #f0f0f0; padding: 10px; margin: 10px 0; font-size: 12px;">
      <strong>Debug Info:</strong><br>
      Current viewport: {{ currentViewportWidth }}px<br>
      Selected image: {{ selectedImageUrl }}<br>
      Supports WebP: {{ supportsWebP }}
    </div>
  `,
  imports: [CommonModule]
})
export class ResponsiveImageComponent implements OnInit {
  @Input() config!: ResponsiveImageConfig;
  @Input() alt: string = '';
  @Input() showDebugInfo: boolean = false;

  webpSources: { srcset: string; media: string }[] = [];
  fallbackSources: { srcset: string; media: string }[] = [];
  defaultSrc: string = '';
  currentViewportWidth: number = 0;
  selectedImageUrl: string = '';
  supportsWebP: boolean = false;

  ngOnInit() {
    this.checkWebPSupport();
    this.generateSources();
    this.updateViewportWidth();
    
    // Listen for viewport changes
    fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(() => this.updateViewportWidth());
  }

  private async checkWebPSupport(): Promise<void> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.supportsWebP = webP.height === 2;
        resolve();
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  private generateSources() {
    // Sort breakpoints by size (largest first for media queries)
    const sortedBreakpoints = [...this.config.breakpoints].sort((a, b) => b.breakpoint - a.breakpoint);
    
    // Generate WebP sources
    this.webpSources = sortedBreakpoints.map(bp => ({
      srcset: this.generateImageUrl(bp.width, bp.quality, 'webp'),
      media: `(min-width: ${bp.breakpoint}px)`
    }));

    // Generate fallback sources
    this.fallbackSources = sortedBreakpoints.map(bp => ({
      srcset: this.generateImageUrl(bp.width, bp.quality, this.config.format),
      media: `(min-width: ${bp.breakpoint}px)`
    }));

    // Default source (smallest breakpoint)
    const smallestBreakpoint = sortedBreakpoints[sortedBreakpoints.length - 1];
    this.defaultSrc = this.generateImageUrl(
      smallestBreakpoint.width,
      smallestBreakpoint.quality,
      this.config.format
    );
  }

  private generateImageUrl(width: number, quality?: number, format?: string): string {
    const baseUrl = this.config.baseUrl;
    const finalQuality = quality || this.config.quality || 80;
    const finalFormat = format || this.config.format || 'jpeg';
    
    // This is a generic URL pattern - adjust based on your CDN
    // Examples: Cloudinary, ImageKit, or custom image service
    const url = `${baseUrl}?w=${width}&q=${finalQuality}&f=${finalFormat}`;
    
    return url;
  }

  private updateViewportWidth() {
    this.currentViewportWidth = window.innerWidth;
    this.updateSelectedImage();
  }

  private updateSelectedImage() {
    const matchingBreakpoint = this.config.breakpoints
      .sort((a, b) => a.breakpoint - b.breakpoint)
      .find(bp => this.currentViewportWidth >= bp.breakpoint);
    
    if (matchingBreakpoint) {
      this.selectedImageUrl = this.generateImageUrl(
        matchingBreakpoint.width,
        matchingBreakpoint.quality,
        this.supportsWebP ? 'webp' : this.config.format
      );
    }
  }

  onImageLoad() {
    console.log('✅ Responsive image loaded:', this.selectedImageUrl);
  }

  onImageError() {
    console.error('❌ Failed to load responsive image');
  }
}

// ==========================================
// 5. IMAGE OPTIMIZATION SERVICE
// ==========================================

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

@Component({
  selector: 'app-image-optimization-service',
  standalone: true,
  template: `
    <div>
      <h3>🛠️ Image Optimization Service Demo</h3>
      
      <div style="margin: 20px 0;">
        <h4>Original Image:</h4>
        <img [src]="originalImageUrl" alt="Original" style="max-width: 300px; border: 2px solid #ddd;">
      </div>

      <div style="margin: 20px 0;">
        <h4>Optimized Images:</h4>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div *ngFor="let optimized of optimizedImages">
            <h5>{{ optimized.label }}</h5>
            <img [src]="optimized.url" [alt]="optimized.label" style="max-width: 200px; border: 2px solid #ddd;">
            <p style="font-size: 12px; color: #666;">{{ optimized.description }}</p>
          </div>
        </div>
      </div>

      <div style="background: #f0f0f0; padding: 15px; margin: 20px 0;">
        <h4>🔧 Optimization Controls:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
          <div>
            <label>Quality: {{ quality }}%</label>
            <input type="range" min="10" max="100" [(ngModel)]="quality" (input)="updateOptimizations()">
          </div>
          <div>
            <label>Width: {{ width }}px</label>
            <input type="range" min="100" max="800" [(ngModel)]="width" (input)="updateOptimizations()">
          </div>
          <div>
            <label>Format:</label>
            <select [(ngModel)]="format" (change)="updateOptimizations()">
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
              <option value="png">PNG</option>
              <option value="avif">AVIF</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule]
})
export class ImageOptimizationServiceComponent implements OnInit {
  originalImageUrl = 'https://picsum.photos/800/600?random=10';
  optimizedImages: Array<{ label: string; url: string; description: string }> = [];
  
  quality = 80;
  width = 400;
  format: 'webp' | 'jpeg' | 'png' | 'avif' = 'webp';

  ngOnInit() {
    this.updateOptimizations();
  }

  updateOptimizations() {
    this.optimizedImages = [
      {
        label: 'High Quality',
        url: this.optimizeImage(this.originalImageUrl, { quality: 90, width: this.width, format: this.format }),
        description: `${this.format.toUpperCase()} - 90% quality`
      },
      {
        label: 'Medium Quality',
        url: this.optimizeImage(this.originalImageUrl, { quality: 70, width: this.width, format: this.format }),
        description: `${this.format.toUpperCase()} - 70% quality`
      },
      {
        label: 'Low Quality',
        url: this.optimizeImage(this.originalImageUrl, { quality: 40, width: this.width, format: this.format }),
        description: `${this.format.toUpperCase()} - 40% quality`
      },
      {
        label: 'Thumbnail',
        url: this.optimizeImage(this.originalImageUrl, { quality: 80, width: 150, format: this.format }),
        description: `150px width - Thumbnail size`
      }
    ];
  }

  private optimizeImage(url: string, options: ImageOptimizationOptions): string {
    // This is a mock implementation - in real applications, you'd use:
    // 1. Cloudinary: https://res.cloudinary.com/demo/image/fetch/q_80,w_400,f_webp/https://example.com/image.jpg
    // 2. ImageKit: https://ik.imagekit.io/demo/tr:q-80,w-400,f-webp/https://example.com/image.jpg
    // 3. Your own image optimization service
    
    const params = new URLSearchParams();
    if (options.quality) params.set('q', options.quality.toString());
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.format) params.set('f', options.format);
    if (options.fit) params.set('fit', options.fit);
    
    // Mock URL - replace with your actual image optimization service
    return `${url}&${params.toString()}`;
  }
}

// ==========================================
// 6. MAIN DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-image-optimization-demo',
  standalone: true,
  imports: [
    CommonModule,
    OptimizedImagesComponent,
    LazyLoadDirective,
    ProgressiveImageComponent,
    ResponsiveImageComponent,
    ImageOptimizationServiceComponent
  ],
  template: `
    <div>
      <h1>🖼️ Angular Image Optimization Guide</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>📋 Angular Image Optimization Features:</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3>✅ Built-in Features (Angular 14.2+):</h3>
            <ul>
              <li>🚀 <strong>NgOptimizedImage directive</strong></li>
              <li>📱 <strong>Responsive images with srcset</strong></li>
              <li>⚡ <strong>Automatic lazy loading</strong></li>
              <li>🎯 <strong>Priority loading</strong> for critical images</li>
              <li>🌐 <strong>Preconnect hints</strong> for external domains</li>
              <li>⚠️ <strong>Performance warnings</strong> in dev mode</li>
            </ul>
          </div>
          <div>
            <h3>🛠️ Manual Optimization Techniques:</h3>
            <ul>
              <li>📡 <strong>Custom lazy loading</strong> with Intersection Observer</li>
              <li>🎭 <strong>Progressive loading</strong> (blur-up effect)</li>
              <li>📐 <strong>Responsive images</strong> with picture element</li>
              <li>🗜️ <strong>Format optimization</strong> (WebP, AVIF)</li>
              <li>☁️ <strong>CDN integration</strong></li>
              <li>💾 <strong>Caching strategies</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- NgOptimizedImage Examples -->
      <app-optimized-images></app-optimized-images>

      <!-- Manual Lazy Loading -->
      <div style="margin: 40px 0;">
        <h2>🔄 Manual Lazy Loading</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <img 
            appLazyLoad="https://picsum.photos/400/300?random=6"
            alt="Lazy loaded image 1"
            style="width: 100%; height: 200px; object-fit: cover; border: 2px solid #ddd;">
          
          <img 
            appLazyLoad="https://picsum.photos/400/300?random=7"
            alt="Lazy loaded image 2"
            style="width: 100%; height: 200px; object-fit: cover; border: 2px solid #ddd;">
          
          <img 
            appLazyLoad="https://picsum.photos/400/300?random=8"
            alt="Lazy loaded image 3"
            style="width: 100%; height: 200px; object-fit: cover; border: 2px solid #ddd;">
        </div>
      </div>

      <!-- Progressive Loading -->
      <div style="margin: 40px 0;">
        <h2>🎭 Progressive Image Loading</h2>
        <app-progressive-image
          lowResSrc="https://picsum.photos/50/38?random=9"
          highResSrc="https://picsum.photos/800/600?random=9"
          alt="Progressive loading demo"
          [width]="400"
          [height]="300">
        </app-progressive-image>
      </div>

      <!-- Responsive Images -->
      <div style="margin: 40px 0;">
        <h2>📱 Responsive Images</h2>
        <app-responsive-image
          [config]="responsiveConfig"
          alt="Responsive image demo"
          [showDebugInfo]="true">
        </app-responsive-image>
      </div>

      <!-- Image Optimization Service -->
      <app-image-optimization-service></app-image-optimization-service>

      <!-- Best Practices -->
      <div style="background: #fff3cd; padding: 20px; margin: 40px 0;">
        <h2>💡 Image Optimization Best Practices</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3>📐 Size & Format:</h3>
            <ul>
              <li>✅ Use appropriate dimensions (don't load 4K for thumbnails)</li>
              <li>✅ Choose optimal formats: WebP > JPEG > PNG</li>
              <li>✅ Consider AVIF for cutting-edge optimization</li>
              <li>✅ Compress images (70-80% quality usually sufficient)</li>
              <li>✅ Use SVG for simple graphics and icons</li>
            </ul>
          </div>
          <div>
            <h3>⚡ Loading Strategy:</h3>
            <ul>
              <li>✅ Lazy load images below the fold</li>
              <li>✅ Priority load above-the-fold images</li>
              <li>✅ Preconnect to image CDN domains</li>
              <li>✅ Use progressive JPEG for large images</li>
              <li>✅ Implement proper fallbacks</li>
            </ul>
          </div>
        </div>

        <h3>🛠️ Implementation Checklist:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4>Development:</h4>
            <ul>
              <li>☑️ Use NgOptimizedImage for new projects</li>
              <li>☑️ Add width/height attributes to prevent layout shift</li>
              <li>☑️ Implement responsive images for different screen sizes</li>
              <li>☑️ Add proper alt text for accessibility</li>
              <li>☑️ Test on slow connections</li>
            </ul>
          </div>
          <div>
            <h4>Production:</h4>
            <ul>
              <li>☑️ Set up image CDN (Cloudinary, ImageKit, etc.)</li>
              <li>☑️ Configure proper caching headers</li>
              <li>☑️ Monitor Core Web Vitals (LCP, CLS)</li>
              <li>☑️ Implement error handling for failed loads</li>
              <li>☑️ Use service worker for offline caching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lazy-loading {
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }
    
    .lazy-loaded {
      opacity: 1;
    }
    
    .lazy-error {
      background-color: #f8d7da;
      border: 2px solid #f5c6cb;
    }
  `]
})
export class ImageOptimizationDemoComponent {
  responsiveConfig: ResponsiveImageConfig = {
    baseUrl: 'https://picsum.photos/1200/800',
    breakpoints: [
      { breakpoint: 1200, width: 1200, quality: 85 },
      { breakpoint: 768, width: 800, quality: 80 },
      { breakpoint: 480, width: 480, quality: 75 },
      { breakpoint: 0, width: 320, quality: 70 }
    ],
    format: 'webp',
    quality: 80
  };

  constructor() {
    console.log('🖼️ Image Optimization Demo initialized');
  }
}

/*
==========================================
ANGULAR IMAGE OPTIMIZATION SUMMARY
==========================================

BUILT-IN FEATURES (Angular 14.2+):
✅ NgOptimizedImage directive
✅ Automatic lazy loading
✅ Responsive images with srcset
✅ Priority loading for critical images
✅ Preconnect hints for external domains
✅ Built-in performance warnings
✅ WebP format detection
✅ Placeholder support

MANUAL OPTIMIZATION TECHNIQUES:
✅ Custom lazy loading with Intersection Observer
✅ Progressive loading (blur-up effect)
✅ Responsive images with picture element
✅ Format optimization (WebP, AVIF)
✅ CDN integration
✅ Caching strategies

PERFORMANCE IMPACT:
- Lazy loading can reduce initial page load by 50-70%
- WebP format reduces file size by 25-35% vs JPEG
- Responsive images prevent loading oversized images
- Priority loading improves LCP (Largest Contentful Paint)
- Proper sizing prevents Cumulative Layout Shift (CLS)

BEST PRACTICES:
1. Use NgOptimizedImage for new projects (Angular 14.2+)
2. Always specify width and height attributes
3. Implement responsive images for different screen sizes
4. Use appropriate image formats (WebP > JPEG > PNG)
5. Lazy load images below the fold
6. Priority load above-the-fold images
7. Compress images appropriately (70-80% quality)
8. Use CDN for image delivery
9. Implement proper error handling
10. Monitor Core Web Vitals

RECOMMENDED TOOLS:
- Cloudinary (comprehensive image management)
- ImageKit (real-time image optimization)
- Sharp (Node.js image processing)
- Squoosh (Google's image compression tool)
- WebPageTest (performance testing)

ANGULAR CLI OPTIMIZATION:
- ng build --optimization enables image optimization
- Angular Universal supports image optimization
- Service Worker can cache optimized images
- Bundle analyzer helps identify large images
*/
