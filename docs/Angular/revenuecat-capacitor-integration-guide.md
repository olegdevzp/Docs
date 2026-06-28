# RevenueCat Capacitor Integration Guide

A comprehensive guide for integrating RevenueCat subscription management into your Capacitor-based Angular app for iOS and Android platforms.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [RevenueCat Setup](#revenuecat-setup)
4. [Capacitor Configuration](#capacitor-configuration)
5. [Angular Service Implementation](#angular-service-implementation)
6. [Component Implementation](#component-implementation)
7. [Platform-Specific Setup](#platform-specific-setup)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

RevenueCat is a powerful subscription management platform that simplifies in-app purchases and subscription handling across iOS and Android platforms. This guide will help you integrate RevenueCat into your Capacitor-based Angular application.

### Key Features
- Cross-platform subscription management
- Receipt validation
- Analytics and insights
- Webhook integrations
- A/B testing for paywalls

## Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- Capacitor CLI installed globally: `npm install -g @capacitor/cli`
- Xcode (for iOS development)
- Android Studio (for Android development)
- RevenueCat account with configured products

## RevenueCat Setup

### 1. Create RevenueCat Account

1. Sign up at [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Create a new project
3. Configure your app details

### 2. Configure Products

1. Go to **Products** in your RevenueCat dashboard
2. Add your subscription products:
   - Weekly subscription: `weekly_premium`
   - Monthly subscription: `monthly_premium`
   - Annual subscription: `annual_premium`
   - Lifetime purchase: `lifetime_premium`

### 3. Get API Keys

1. Navigate to **API Keys** section
2. Copy your **Public API Key** (starts with `pk_`)
3. Copy your **Secret API Key** (starts with `sk_`)

## Capacitor Configuration

### 1. Install Dependencies

```bash
# Install RevenueCat SDK
npm install purchases-capacitor

# Install Capacitor (if not already installed)
npm install @capacitor/core @capacitor/cli

# Add platforms
npx cap add ios
npx cap add android
```

### 2. Update package.json

```json
{
  "dependencies": {
    "purchases-capacitor": "^6.0.0",
    "@capacitor/core": "^5.0.0",
    "@capacitor/ios": "^5.0.0",
    "@capacitor/android": "^5.0.0"
  }
}
```

### 3. Sync Capacitor

```bash
npx cap sync
```

## Angular Service Implementation

Create a comprehensive RevenueCat service for your Angular app:

```typescript
// src/app/services/revenuecat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Purchases, PurchasesOffering, CustomerInfo, PurchasesError } from 'purchases-capacitor';

export interface SubscriptionProduct {
  identifier: string;
  description: string;
  title: string;
  price: number;
  currencyCode: string;
  localizedPrice: string;
}

export interface CustomerInfoData {
  activeSubscriptions: string[];
  allPurchaseDates: { [key: string]: Date };
  firstSeen: Date;
  originalAppUserId: string;
  requestDate: Date;
  originalApplicationVersion: string;
  originalPurchaseDate: Date;
  managementURL?: string;
  nonSubscriptionTransactions: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RevenueCatService {
  private customerInfoSubject = new BehaviorSubject<CustomerInfoData | null>(null);
  private offeringsSubject = new BehaviorSubject<PurchasesOffering[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public customerInfo$ = this.customerInfoSubject.asObservable();
  public offerings$ = this.offeringsSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  private readonly REVENUECAT_API_KEY = 'pk_your_api_key_here';

  constructor() {
    this.initializeRevenueCat();
  }

  /**
   * Initialize RevenueCat SDK
   */
  private async initializeRevenueCat(): Promise<void> {
    try {
      this.isLoadingSubject.next(true);
      this.errorSubject.next(null);

      await Purchases.configure({
        apiKey: this.REVENUECAT_API_KEY,
        appUserID: undefined, // Let RevenueCat generate anonymous ID
        observerMode: false,
        userDefaultsSuiteName: undefined,
        useAmazon: false,
        shouldShowInAppMessagesAutomatically: true,
        entitlementVerificationMode: 'INFORMATIONAL'
      });

      // Set up customer info listener
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        this.customerInfoSubject.next(this.transformCustomerInfo(customerInfo));
      });

      // Load initial data
      await this.loadOfferings();
      await this.loadCustomerInfo();

    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      this.errorSubject.next('Failed to initialize RevenueCat');
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Load available offerings
   */
  public async loadOfferings(): Promise<void> {
    try {
      const offerings = await Purchases.getOfferings();
      this.offeringsSubject.next(offerings.all);
    } catch (error) {
      console.error('Failed to load offerings:', error);
      this.errorSubject.next('Failed to load subscription options');
    }
  }

  /**
   * Load current customer info
   */
  public async loadCustomerInfo(): Promise<void> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      this.customerInfoSubject.next(this.transformCustomerInfo(customerInfo));
    } catch (error) {
      console.error('Failed to load customer info:', error);
      this.errorSubject.next('Failed to load subscription status');
    }
  }

  /**
   * Purchase a subscription product
   */
  public async purchaseProduct(productId: string): Promise<Observable<CustomerInfoData>> {
    try {
      this.isLoadingSubject.next(true);
      this.errorSubject.next(null);

      const purchaseResult = await Purchases.purchaseProduct({ productIdentifier: productId });
      
      const customerInfo = this.transformCustomerInfo(purchaseResult.customerInfo);
      this.customerInfoSubject.next(customerInfo);
      
      return from([customerInfo]);
    } catch (error) {
      const purchasesError = error as PurchasesError;
      
      if (purchasesError.code === 'PURCHASES_ERROR_PURCHASE_CANCELLED') {
        this.errorSubject.next('Purchase was cancelled');
      } else if (purchasesError.code === 'PURCHASES_ERROR_PAYMENT_PENDING') {
        this.errorSubject.next('Payment is pending approval');
      } else {
        this.errorSubject.next(`Purchase failed: ${purchasesError.message}`);
      }
      
      return throwError(() => error);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Restore purchases
   */
  public async restorePurchases(): Promise<Observable<CustomerInfoData>> {
    try {
      this.isLoadingSubject.next(true);
      this.errorSubject.next(null);

      const customerInfo = await Purchases.restorePurchases();
      const transformedInfo = this.transformCustomerInfo(customerInfo);
      
      this.customerInfoSubject.next(transformedInfo);
      return from([transformedInfo]);
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      this.errorSubject.next('Failed to restore purchases');
      return throwError(() => error);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Check if user has active subscription
   */
  public hasActiveSubscription(): Observable<boolean> {
    return this.customerInfo$.pipe(
      map(customerInfo => {
        if (!customerInfo) return false;
        return customerInfo.activeSubscriptions.length > 0;
      })
    );
  }

  /**
   * Get available products from current offering
   */
  public getAvailableProducts(): Observable<SubscriptionProduct[]> {
    return this.offerings$.pipe(
      map(offerings => {
        if (offerings.length === 0) return [];
        
        const currentOffering = offerings.find(offering => offering.identifier === 'default') || offerings[0];
        
        return currentOffering.availablePackages.map(pkg => ({
          identifier: pkg.identifier,
          description: pkg.packageDescription,
          title: pkg.storeProduct.title,
          price: pkg.storeProduct.price,
          currencyCode: pkg.storeProduct.currencyCode,
          localizedPrice: pkg.storeProduct.localizedPriceString
        }));
      })
    );
  }

  /**
   * Set user ID for RevenueCat
   */
  public async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn({ appUserID: userId });
      await this.loadCustomerInfo();
    } catch (error) {
      console.error('Failed to set user ID:', error);
      this.errorSubject.next('Failed to link subscription to account');
    }
  }

  /**
   * Log out current user
   */
  public async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
      await this.loadCustomerInfo();
    } catch (error) {
      console.error('Failed to log out:', error);
      this.errorSubject.next('Failed to log out');
    }
  }

  /**
   * Transform RevenueCat CustomerInfo to our interface
   */
  private transformCustomerInfo(customerInfo: CustomerInfo): CustomerInfoData {
    return {
      activeSubscriptions: customerInfo.activeSubscriptions,
      allPurchaseDates: customerInfo.allPurchaseDates,
      firstSeen: new Date(customerInfo.firstSeen),
      originalAppUserId: customerInfo.originalAppUserId,
      requestDate: new Date(customerInfo.requestDate),
      originalApplicationVersion: customerInfo.originalApplicationVersion,
      originalPurchaseDate: new Date(customerInfo.originalPurchaseDate),
      managementURL: customerInfo.managementURL,
      nonSubscriptionTransactions: customerInfo.nonSubscriptionTransactions
    };
  }

  /**
   * Clear error state
   */
  public clearError(): void {
    this.errorSubject.next(null);
  }
}
```

## Component Implementation

Create a subscription management component:

```typescript
// src/app/components/subscription-manager.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { RevenueCatService, SubscriptionProduct } from '../services/revenuecat.service';

@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subscription-container">
      <div class="header">
        <h2>Premium Subscription</h2>
        <p>Unlock all premium features with a subscription</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Loading subscription options...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-banner">
        <p>{{ error }}</p>
        <button (click)="clearError()" class="close-btn">×</button>
      </div>

      <!-- Subscription Status -->
      <div *ngIf="hasActiveSubscription" class="active-subscription">
        <div class="success-icon">✓</div>
        <h3>Premium Active</h3>
        <p>You have an active premium subscription</p>
        <button (click)="manageSubscription()" class="manage-btn">
          Manage Subscription
        </button>
      </div>

      <!-- Subscription Options -->
      <div *ngIf="!hasActiveSubscription && !isLoading" class="subscription-options">
        <div *ngFor="let product of availableProducts" class="subscription-card">
          <div class="card-header">
            <h3>{{ product.title }}</h3>
            <div class="price">{{ product.localizedPrice }}</div>
          </div>
          <div class="card-body">
            <p>{{ product.description }}</p>
            <button 
              (click)="purchaseProduct(product.identifier)"
              [disabled]="isLoading"
              class="purchase-btn">
              Subscribe
            </button>
          </div>
        </div>

        <div class="restore-section">
          <p>Already have a subscription?</p>
          <button (click)="restorePurchases()" [disabled]="isLoading" class="restore-btn">
            Restore Purchases
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subscription-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 16px;
    }

    .loading {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-banner {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #721c24;
    }

    .active-subscription {
      text-align: center;
      padding: 40px;
      background: #d4edda;
      border-radius: 12px;
      color: #155724;
    }

    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .manage-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
    }

    .subscription-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .subscription-card {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .subscription-card:hover {
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,123,255,0.15);
    }

    .card-header h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 20px;
    }

    .price {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 20px;
    }

    .card-body p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .purchase-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
      transition: background 0.3s ease;
    }

    .purchase-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .purchase-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .restore-section {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #e9ecef;
    }

    .restore-section p {
      color: #666;
      margin-bottom: 15px;
    }

    .restore-btn {
      background: transparent;
      color: #007bff;
      border: 2px solid #007bff;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .restore-btn:hover:not(:disabled) {
      background: #007bff;
      color: white;
    }

    .restore-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .subscription-container {
        padding: 15px;
      }

      .subscription-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SubscriptionManagerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = false;
  error: string | null = null;
  hasActiveSubscription = false;
  availableProducts: SubscriptionProduct[] = [];

  constructor(private revenueCatService: RevenueCatService) {}

  ngOnInit(): void {
    // Subscribe to service observables
    combineLatest([
      this.revenueCatService.isLoading$,
      this.revenueCatService.error$,
      this.revenueCatService.hasActiveSubscription(),
      this.revenueCatService.getAvailableProducts()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([loading, error, hasSubscription, products]) => {
      this.isLoading = loading;
      this.error = error;
      this.hasActiveSubscription = hasSubscription;
      this.availableProducts = products;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async purchaseProduct(productId: string): Promise<void> {
    try {
      await this.revenueCatService.purchaseProduct(productId).toPromise();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  }

  async restorePurchases(): Promise<void> {
    try {
      await this.revenueCatService.restorePurchases().toPromise();
    } catch (error) {
      console.error('Restore failed:', error);
    }
  }

  manageSubscription(): void {
    // Open subscription management URL
    const customerInfo = this.revenueCatService.customerInfoSubject.value;
    if (customerInfo?.managementURL) {
      window.open(customerInfo.managementURL, '_blank');
    }
  }

  clearError(): void {
    this.revenueCatService.clearError();
  }
}
```

## Platform-Specific Setup

### iOS Setup

1. **Update Info.plist**:
```xml
<!-- ios/App/App/Info.plist -->
<key>NSUserTrackingUsageDescription</key>
<string>This app uses data for analytics and subscription management</string>
```

2. **Configure App Store Connect**:
   - Create your subscription products in App Store Connect
   - Set up subscription groups
   - Configure pricing and availability

3. **Add RevenueCat to iOS project**:
```bash
npx cap sync ios
```

### Android Setup

1. **Update AndroidManifest.xml**:
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="com.android.vending.BILLING" />
```

2. **Configure Google Play Console**:
   - Create subscription products in Google Play Console
   - Set up subscription management
   - Configure pricing for different regions

3. **Add RevenueCat to Android project**:
```bash
npx cap sync android
```

## Testing

### 1. Sandbox Testing

**iOS:**
- Use sandbox Apple ID
- Test on device (not simulator)
- Enable sandbox in Settings > App Store

**Android:**
- Use test accounts in Google Play Console
- Test on device with Google Play Services

### 2. Test Products

Create test products with different identifiers:
- `weekly_premium_test`
- `monthly_premium_test`
- `annual_premium_test`

### 3. Testing Checklist

- [ ] SDK initialization
- [ ] Product loading
- [ ] Purchase flow
- [ ] Receipt validation
- [ ] Subscription status checking
- [ ] Restore purchases
- [ ] Error handling

## Troubleshooting

### Common Issues

1. **"No products found"**
   - Check product identifiers match App Store/Google Play
   - Ensure products are approved and available
   - Verify API key is correct

2. **Purchase fails immediately**
   - Check sandbox/test account setup
   - Verify billing permissions
   - Check device internet connection

3. **Receipt validation fails**
   - Ensure server-side validation is set up
   - Check webhook configuration
   - Verify secret API key

### Debug Mode

Enable debug logging:
```typescript
// In your service initialization
Purchases.setLogLevel({ level: 'DEBUG' });
```

## Best Practices

### 1. Error Handling
- Always handle purchase cancellations gracefully
- Provide clear error messages to users
- Implement retry mechanisms for network issues

### 2. User Experience
- Show loading states during purchases
- Provide clear subscription benefits
- Make restore purchases easily accessible

### 3. Security
- Never store sensitive data client-side
- Use server-side receipt validation
- Implement proper user authentication

### 4. Analytics
- Track subscription events
- Monitor conversion rates
- A/B test paywall designs

### 5. Testing
- Test on real devices
- Use sandbox environments
- Test subscription lifecycle events

## Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing](https://developer.android.com/google/play/billing)

## Support

For issues specific to this integration:
1. Check RevenueCat status page
2. Review Capacitor documentation
3. Test with minimal reproduction case
4. Contact RevenueCat support with logs

---

This guide provides a complete foundation for integrating RevenueCat into your Capacitor-based Angular application. Remember to test thoroughly in sandbox environments before releasing to production.
