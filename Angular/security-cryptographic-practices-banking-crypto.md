# Security and Cryptographic Best Practices for Angular/Ionic Apps in Banking & Crypto Domain

## Table of Contents
1. [Authentication & Authorization](#1-authentication--authorization)
2. [Data Encryption](#2-data-encryption)
3. [Cryptographic Best Practices](#3-cryptographic-best-practices)
4. [Angular-Specific Security](#4-angular-specific-security)
5. [API Security](#5-api-security)
6. [Mobile-Specific Security (Ionic)](#6-mobile-specific-security-ionic)
7. [Session Management](#7-session-management)
8. [Transaction Security](#8-transaction-security)
9. [Compliance & Auditing](#9-compliance--auditing)
10. [Code Security](#10-code-security)
11. [Biometric Authentication](#11-biometric-authentication)
12. [Security Checklist](#12-security-checklist-for-bankingcrypto-apps)

---

## 1. Authentication & Authorization

### JWT Token Management

**Best Practices:**
- Store tokens in memory (service variables) or secure storage plugins
- **NEVER** store tokens in localStorage for sensitive financial apps
- Implement token refresh mechanism with short-lived access tokens (5-15 minutes)
- Use HTTP-only, Secure, SameSite cookies for web applications when possible
- Implement automatic logout on token expiration
- Clear all tokens and sensitive data on logout

```typescript
// Secure token storage for Ionic
import { SecureStorage } from '@ionic-native/secure-storage';

export class TokenService {
  private secureStorage: SecureStorageObject;
  
  async init() {
    this.secureStorage = await SecureStorage.create('bank_app');
  }
  
  async storeToken(token: string): Promise<void> {
    await this.secureStorage.set('access_token', token);
  }
  
  async getToken(): Promise<string> {
    return await this.secureStorage.get('access_token');
  }
  
  async clearTokens(): Promise<void> {
    await this.secureStorage.clear();
  }
}
```

```typescript
// In-memory token storage for Angular web
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
  }
  
  getAccessToken(): string | null {
    return this.accessToken;
  }
  
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
```

### Multi-Factor Authentication (MFA)

**Implementation Strategies:**
- **TOTP (Time-based One-Time Password)** - Google Authenticator, Authy
- **Biometric authentication** - Fingerprint, Face ID for mobile
- **SMS/Email OTP** - As fallback mechanism
- **Hardware tokens** - YubiKey, U2F devices
- **Device fingerprinting** - Trusted device management
- **Push notifications** - Approve/deny authentication requests

```typescript
import { TOTP } from '@ionic-native/totp';

export class MFAService {
  async generateTOTP(secret: string): Promise<string> {
    return await TOTP.generate(secret);
  }
  
  async verifyTOTP(token: string, secret: string): Promise<boolean> {
    const generated = await this.generateTOTP(secret);
    return token === generated;
  }
}
```

### Authorization Patterns

```typescript
// Role-Based Access Control (RBAC)
export interface UserRoles {
  roles: string[];
  permissions: string[];
}

@Injectable()
export class AuthorizationService {
  hasRole(role: string): boolean {
    return this.currentUser.roles.includes(role);
  }
  
  hasPermission(permission: string): boolean {
    return this.currentUser.permissions.includes(permission);
  }
}

// Route Guard
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    
    if (this.authService.hasRole(requiredRole)) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
```

---

## 2. Data Encryption

### Encryption At Rest

**Mobile Storage (Ionic):**
- Use `@ionic-native/secure-storage` (iOS Keychain, Android Keystore)
- Encrypt sensitive data before storing in IndexedDB/SQLite
- Use AES-256-GCM for symmetric encryption
- Never store sensitive data in plain text

```typescript
import * as CryptoJS from 'crypto-js';

export class EncryptionService {
  private readonly key: string;
  
  constructor() {
    // Key should be derived from user password or stored in secure storage
    this.key = this.deriveKey();
  }
  
  private deriveKey(): string {
    // In production, use PBKDF2 or Argon2 with proper salt
    return CryptoJS.PBKDF2(
      'user-password',
      'salt-from-secure-storage',
      { keySize: 256/32, iterations: 10000 }
    ).toString();
  }
  
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.key).toString();
  }
  
  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  
  encryptObject(obj: any): string {
    return this.encrypt(JSON.stringify(obj));
  }
  
  decryptObject<T>(ciphertext: string): T {
    return JSON.parse(this.decrypt(ciphertext));
  }
}
```

**Web Storage (Angular):**

```typescript
export class SecureStorageService {
  private encryptionService: EncryptionService;
  
  setItem(key: string, value: any): void {
    const encrypted = this.encryptionService.encryptObject(value);
    sessionStorage.setItem(key, encrypted); // Use sessionStorage, not localStorage
  }
  
  getItem<T>(key: string): T | null {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    return this.encryptionService.decryptObject<T>(encrypted);
  }
  
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
  
  clear(): void {
    sessionStorage.clear();
  }
}
```

### Encryption In Transit

**HTTPS/TLS Requirements:**
- **ALWAYS** use HTTPS/TLS 1.3 (minimum TLS 1.2)
- Implement certificate pinning to prevent MITM attacks
- Use Public Key Pinning or Certificate Transparency
- Disable insecure protocols (SSLv3, TLS 1.0, TLS 1.1)

```typescript
// Certificate pinning in Ionic using HTTP plugin
import { HTTP } from '@ionic-native/http';

@Injectable()
export class SecureHttpService {
  constructor(private http: HTTP) {
    this.setupCertificatePinning();
  }
  
  private setupCertificatePinning(): void {
    // Set pinned mode
    this.http.setServerTrustMode('pinned');
    
    // Add certificates (place .cer files in www/certificates/)
    this.http.setSSLCertMode('pinned', [
      'certificates/api-cert.cer',
      'certificates/backup-cert.cer'
    ]);
  }
  
  async secureGet(url: string, params?: any): Promise<any> {
    try {
      const response = await this.http.get(url, params, {
        'Content-Type': 'application/json'
      });
      return JSON.parse(response.data);
    } catch (error) {
      this.handleSecureConnectionError(error);
      throw error;
    }
  }
  
  private handleSecureConnectionError(error: any): void {
    if (error.status === -1) {
      // Certificate pinning failed - possible MITM attack
      console.error('Certificate verification failed!');
      // Alert user and lock app
    }
  }
}
```

**Angular HTTP Interceptor for Secure Communication:**

```typescript
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ensure HTTPS
    if (!req.url.startsWith('https://')) {
      throw new Error('Insecure HTTP request blocked');
    }
    
    // Add security headers
    const secureReq = req.clone({
      setHeaders: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });
    
    return next.handle(secureReq);
  }
}
```

---

## 3. Cryptographic Best Practices

### Key Management

**Critical Rules:**
- ❌ **NEVER** hardcode keys in source code
- ✅ Use Hardware Security Modules (HSM) or cloud KMS (AWS KMS, Azure Key Vault, Google Cloud KMS)
- ✅ Rotate encryption keys regularly (quarterly or after suspected compromise)
- ✅ Use key derivation functions (PBKDF2, Argon2, scrypt) for password-based keys
- ✅ Store keys separately from encrypted data
- ✅ Implement key versioning for rotation without data loss

```typescript
export class KeyManagementService {
  private keyVersion = 'v1';
  
  async rotateKey(oldKey: string, newKey: string): Promise<void> {
    // Re-encrypt all data with new key
    const encryptedItems = await this.getAllEncryptedData();
    
    for (const item of encryptedItems) {
      const decrypted = this.decrypt(item.data, oldKey);
      const reEncrypted = this.encrypt(decrypted, newKey);
      await this.updateEncryptedData(item.id, reEncrypted);
    }
    
    this.keyVersion = 'v2';
  }
  
  async deriveKeyFromPassword(password: string, salt: string): Promise<string> {
    // Use PBKDF2 with sufficient iterations
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 100000, // Adjust based on performance requirements
      hasher: CryptoJS.algo.SHA256
    }).toString();
  }
}
```

### Web Crypto API (Modern Approach)

**Advantages:**
- Hardware-accelerated
- More secure than JavaScript implementations
- Native browser support
- Supports async operations

```typescript
export class WebCryptoService {
  // Generate encryption key
  async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }
  
  // Encrypt data
  async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: ArrayBuffer, iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV (never reuse!)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      dataBuffer
    );
    
    return { encrypted, iv };
  }
  
  // Decrypt data
  async decrypt(encrypted: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
  
  // Export key for storage
  async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await window.crypto.subtle.exportKey('raw', key);
  }
  
  // Import key from storage
  async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
```

### Digital Signatures

**Use Cases:**
- Transaction signing
- API request authentication
- Document verification
- Smart contract interactions (crypto domain)

```typescript
export class DigitalSignatureService {
  // Generate key pair for signing
  async generateKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );
  }
  
  // Sign data
  async sign(data: string, privateKey: CryptoKey): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    return await window.crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' }
      },
      privateKey,
      dataBuffer
    );
  }
  
  // Verify signature
  async verify(
    data: string,
    signature: ArrayBuffer,
    publicKey: CryptoKey
  ): Promise<boolean> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    return await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' }
      },
      publicKey,
      signature,
      dataBuffer
    );
  }
}
```

### Hash Functions

```typescript
export class HashService {
  // SHA-256 hash
  async sha256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // HMAC (for API request signing)
  async hmac(message: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    
    const key = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await window.crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );
    
    const signatureArray = Array.from(new Uint8Array(signature));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
```

---

## 4. Angular-Specific Security

### Content Security Policy (CSP)

**Strict CSP Configuration:**

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self';
               script-src 'self' 'nonce-{random}';
               style-src 'self' 'nonce-{random}';
               img-src 'self' https: data:;
               font-src 'self' data:;
               connect-src 'self' https://api.yourbank.com;
               frame-ancestors 'none';
               base-uri 'self';
               form-action 'self';">

<!-- Stricter version for banking apps -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none';
               script-src 'self';
               style-src 'self';
               img-src 'self';
               font-src 'self';
               connect-src 'self' https://api.yourbank.com;
               frame-ancestors 'none';
               base-uri 'self';
               form-action 'self';
               upgrade-insecure-requests;">
```

**CSP in Angular:**

```typescript
// app.component.ts
export class AppComponent implements OnInit {
  ngOnInit() {
    // Add CSP meta tag programmatically if needed
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.getCSPContent();
    document.head.appendChild(meta);
  }
  
  private getCSPContent(): string {
    return `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      connect-src 'self' ${environment.apiUrl};
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();
  }
}
```

### XSS Prevention

**Built-in Protection:**
- Angular's sanitizer automatically escapes values in templates
- **NEVER** use `innerHTML` with user content
- Avoid `bypassSecurityTrust*` methods

```typescript
// ❌ DANGEROUS - Never do this
template: '<div [innerHTML]="userContent"></div>'

// ✅ SAFE - Let Angular handle it
template: '<div>{{ userContent }}</div>'

// If you must use innerHTML, sanitize first
export class SafeContentComponent {
  constructor(private sanitizer: DomSanitizer) {}
  
  getSafeHtml(html: string): SafeHtml {
    // Sanitize before marking as safe
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
```

**Input Validation:**

```typescript
export class InputValidationService {
  // Whitelist-based validation
  sanitizeInput(input: string, type: 'email' | 'number' | 'alphanumeric'): string {
    switch(type) {
      case 'email':
        return input.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)?.[0] || '';
      case 'number':
        return input.replace(/[^0-9]/g, '');
      case 'alphanumeric':
        return input.replace(/[^a-zA-Z0-9]/g, '');
      default:
        return '';
    }
  }
  
  // Prevent SQL injection in search queries
  sanitizeSearchQuery(query: string): string {
    return query
      .replace(/[';--]/g, '') // Remove SQL special chars
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .trim();
  }
}
```

### Dependency Security

**Regular Security Audits:**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force

# Use Snyk for advanced scanning
npm install -g snyk
snyk auth
snyk test
snyk monitor

# Alternative: use npm-check-updates
npm install -g npm-check-updates
ncu -u
npm install
```

**Package.json Security:**

```json
{
  "scripts": {
    "preinstall": "npx npm-force-resolutions",
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "security:check": "snyk test"
  },
  "resolutions": {
    "lodash": "^4.17.21",
    "minimist": "^1.2.6"
  }
}
```

### CSRF Protection

```typescript
// Angular HttpClient includes CSRF token support by default
// Configure in app.module.ts
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    })
  ]
})
export class AppModule { }
```

---

## 5. API Security

### Request Signing with HMAC

**Purpose:**
- Verify request authenticity
- Prevent tampering
- Prevent replay attacks

```typescript
@Injectable()
export class ApiSecurityService {
  private readonly apiSecret = environment.apiSecret;
  
  // Sign API request
  signRequest(payload: any, timestamp: number): string {
    const message = JSON.stringify(payload) + timestamp;
    return CryptoJS.HmacSHA256(message, this.apiSecret).toString();
  }
  
  // Make secure API request
  makeSecureRequest(endpoint: string, method: string, data?: any): Observable<any> {
    const timestamp = Date.now();
    const nonce = this.generateNonce();
    const signature = this.signRequest(data || {}, timestamp);
    
    const headers = new HttpHeaders({
      'X-Timestamp': timestamp.toString(),
      'X-Nonce': nonce,
      'X-Signature': signature,
      'X-Request-ID': this.generateUUID(),
      'Content-Type': 'application/json'
    });
    
    return this.http.request(method, endpoint, {
      headers,
      body: data
    });
  }
  
  // Verify response signature
  verifyResponse(response: any, signature: string, timestamp: number): boolean {
    const expectedSignature = this.signRequest(response, timestamp);
    return signature === expectedSignature;
  }
  
  private generateNonce(): string {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  }
  
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
```

### Rate Limiting

```typescript
@Injectable()
export class RateLimitService {
  private requestCounts = new Map<string, number[]>();
  private readonly maxRequests = 10; // Max requests
  private readonly timeWindow = 60000; // Per 60 seconds
  
  canMakeRequest(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.requestCounts.get(endpoint) || [];
    
    // Remove old requests outside time window
    const recentRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requestCounts.set(endpoint, recentRequests);
    return true;
  }
  
  getRetryAfter(endpoint: string): number {
    const requests = this.requestCounts.get(endpoint) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    const timeToWait = this.timeWindow - (Date.now() - oldestRequest);
    return Math.max(0, timeToWait);
  }
}

// HTTP Interceptor for rate limiting
@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  constructor(private rateLimitService: RateLimitService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const endpoint = req.url;
    
    if (!this.rateLimitService.canMakeRequest(endpoint)) {
      const retryAfter = this.rateLimitService.getRetryAfter(endpoint);
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter}ms`);
    }
    
    return next.handle(req);
  }
}
```

### Exponential Backoff

```typescript
@Injectable()
export class RetryService {
  retryWithBackoff<T>(
    request: () => Observable<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Observable<T> {
    return request().pipe(
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= maxRetries) {
              throw error;
            }
            
            const delay = initialDelay * Math.pow(2, retryCount);
            console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
            return retryCount + 1;
          }, 0),
          delayWhen(retryCount => timer(initialDelay * Math.pow(2, retryCount - 1)))
        )
      )
    );
  }
}
```

### Request/Response Encryption

```typescript
@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
  constructor(
    private encryptionService: WebCryptoService,
    private keyService: KeyManagementService
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Encrypt sensitive requests
    if (this.isSensitiveEndpoint(req.url)) {
      return from(this.encryptRequest(req)).pipe(
        switchMap(encryptedReq => next.handle(encryptedReq)),
        switchMap(event => this.decryptResponse(event))
      );
    }
    
    return next.handle(req);
  }
  
  private async encryptRequest(req: HttpRequest<any>): Promise<HttpRequest<any>> {
    const key = await this.keyService.getEncryptionKey();
    const { encrypted, iv } = await this.encryptionService.encrypt(
      JSON.stringify(req.body),
      key
    );
    
    return req.clone({
      body: {
        encrypted: this.arrayBufferToBase64(encrypted),
        iv: this.arrayBufferToBase64(iv)
      },
      setHeaders: {
        'X-Encrypted': 'true'
      }
    });
  }
  
  private async decryptResponse(event: HttpEvent<any>): Promise<HttpEvent<any>> {
    if (event instanceof HttpResponse && event.headers.get('X-Encrypted') === 'true') {
      const key = await this.keyService.getEncryptionKey();
      const encrypted = this.base64ToArrayBuffer(event.body.encrypted);
      const iv = this.base64ToUint8Array(event.body.iv);
      
      const decrypted = await this.encryptionService.decrypt(encrypted, key, iv);
      
      return event.clone({
        body: JSON.parse(decrypted)
      });
    }
    
    return event;
  }
  
  private isSensitiveEndpoint(url: string): boolean {
    const sensitiveEndpoints = [
      '/api/transactions',
      '/api/accounts',
      '/api/payments',
      '/api/user/profile'
    ];
    return sensitiveEndpoints.some(endpoint => url.includes(endpoint));
  }
  
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
```

---

## 6. Mobile-Specific Security (Ionic)

### Root/Jailbreak Detection

```typescript
import { JailbreakRootDetection } from '@ionic-native/jailbreak-root-detection';

@Injectable()
export class DeviceSecurityService {
  constructor(private jailbreakDetection: JailbreakRootDetection) {}
  
  async checkDeviceSecurity(): Promise<boolean> {
    try {
      const isCompromised = await this.jailbreakDetection.check();
      
      if (isCompromised) {
        this.handleCompromisedDevice();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to check device security:', error);
      return false;
    }
  }
  
  private handleCompromisedDevice(): void {
    // Options:
    // 1. Show warning and restrict functionality
    // 2. Prevent app from running
    // 3. Enable restricted mode with limited features
    // 4. Log security event
    
    alert('Device security compromised. App functionality will be limited.');
  }
}
```

### Prevent Screenshots and Screen Recording

```typescript
// For Capacitor
import { App } from '@capacitor/app';
import { ScreenShield } from '@capacitor/screen-shield';

@Injectable()
export class ScreenProtectionService {
  async enableScreenProtection(): Promise<void> {
    if (this.platform.is('android')) {
      await this.enableAndroidScreenProtection();
    } else if (this.platform.is('ios')) {
      await this.enableIOSScreenProtection();
    }
  }
  
  private async enableAndroidScreenProtection(): Promise<void> {
    // Prevent screenshots on sensitive screens
    await ScreenShield.enable();
  }
  
  private async enableIOSScreenProtection(): Promise<void> {
    // iOS - Add overlay when app goes to background
    App.addListener('appStateChange', (state) => {
      if (!state.isActive) {
        this.showSecurityOverlay();
      } else {
        this.hideSecurityOverlay();
      }
    });
  }
  
  private showSecurityOverlay(): void {
    // Show overlay to hide sensitive content in app switcher
    const overlay = document.createElement('div');
    overlay.id = 'security-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    overlay.innerHTML = '<img src="assets/logo.png" alt="App Logo">';
    document.body.appendChild(overlay);
  }
  
  private hideSecurityOverlay(): void {
    const overlay = document.getElementById('security-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}
```

### Secure Storage

```typescript
import { SecureStoragePlugin } from '@ionic-native/secure-storage';

@Injectable()
export class SecureStorageService {
  private storage: SecureStorageObject;
  
  async init(): Promise<void> {
    this.storage = await SecureStoragePlugin.create('banking_app');
  }
  
  async set(key: string, value: any): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.storage.set(key, jsonValue);
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.storage.get(key);
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  
  async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }
  
  async clear(): Promise<void> {
    await this.storage.clear();
  }
  
  // Store sensitive user data
  async storeUserCredentials(username: string, encryptedPassword: string): Promise<void> {
    await this.set('user_credentials', {
      username,
      password: encryptedPassword,
      timestamp: Date.now()
    });
  }
  
  // Store encryption keys
  async storeEncryptionKey(key: string): Promise<void> {
    await this.set('encryption_key', key);
  }
}
```

### App Integrity and Tampering Detection

```typescript
@Injectable()
export class AppIntegrityService {
  private readonly expectedChecksum = environment.appChecksum;
  
  async verifyAppIntegrity(): Promise<boolean> {
    // Check if app is running in debug mode
    if (this.isDebugMode()) {
      console.warn('App is running in debug mode');
      return false;
    }
    
    // Verify app signature (requires native plugin)
    const isValid = await this.verifySignature();
    
    if (!isValid) {
      this.handleTamperedApp();
      return false;
    }
    
    return true;
  }
  
  private isDebugMode(): boolean {
    // Check various debug indicators
    return (window as any).__CORDOVA_DEBUG__ === true ||
           (window as any).__DEV__ === true;
  }
  
  private async verifySignature(): Promise<boolean> {
    // Use native plugin to verify app signature
    // This is platform-specific and requires custom plugin
    return true;
  }
  
  private handleTamperedApp(): void {
    // Prevent app from running if tampered
    alert('App integrity check failed. Please reinstall from official store.');
    
    // Optionally, close the app
    if (this.platform.is('android')) {
      navigator['app'].exitApp();
    }
  }
}
```

### SSL Pinning Implementation

```typescript
import { HTTP } from '@ionic-native/http';

@Injectable()
export class SSLPinningService {
  constructor(private http: HTTP) {}
  
  setupSSLPinning(): void {
    // Set SSL certificate mode to pinned
    this.http.setServerTrustMode('pinned');
    
    // Add certificates (place .cer files in www/certificates/)
    this.http.setSSLCertMode('pinned', [
      'certificates/api-prod.cer',
      'certificates/api-backup.cer'
    ]);
  }
  
  async makeSecureRequest(url: string, data: any): Promise<any> {
    try {
      const response = await this.http.post(url, data, {
        'Content-Type': 'application/json'
      });
      
      return JSON.parse(response.data);
    } catch (error) {
      if (error.status === -1) {
        // SSL pinning failed - possible MITM attack
        this.handleSSLPinningFailure();
      }
      throw error;
    }
  }
  
  private handleSSLPinningFailure(): void {
    // Log security incident
    console.error('SSL Pinning verification failed - possible MITM attack!');
    
    // Alert user
    alert('Secure connection could not be established. Please check your network.');
    
    // Lock app or prevent sensitive operations
    this.lockApp();
  }
  
  private lockApp(): void {
    // Implement app locking logic
    // Redirect to security warning page
    // Clear sensitive data
  }
}
```

---

## 7. Session Management

### Session Timeout Implementation

```typescript
@Injectable()
export class SessionService {
  private idleTimeout = 5 * 60 * 1000; // 5 minutes of inactivity
  private absoluteTimeout = 30 * 60 * 1000; // 30 minutes total
  private warningTime = 60 * 1000; // Warn 1 minute before timeout
  
  private lastActivity: number;
  private sessionStart: number;
  private idleTimer: any;
  private absoluteTimer: any;
  private warningTimer: any;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.initSession();
  }
  
  private initSession(): void {
    this.lastActivity = Date.now();
    this.sessionStart = Date.now();
    
    this.setupActivityListeners();
    this.startMonitoring();
  }
  
  private setupActivityListeners(): void {
    const events = ['mousedown', 'keypress', 'touchstart', 'scroll', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });
  }
  
  private updateActivity(): void {
    this.lastActivity = Date.now();
    this.resetIdleTimer();
  }
  
  private startMonitoring(): void {
    this.resetIdleTimer();
    this.setAbsoluteTimeout();
  }
  
  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    
    // Set warning timer
    this.warningTimer = setTimeout(() => {
      this.showTimeoutWarning();
    }, this.idleTimeout - this.warningTime);
    
    // Set idle timeout
    this.idleTimer = setTimeout(() => {
      this.logout('idle_timeout');
    }, this.idleTimeout);
  }
  
  private setAbsoluteTimeout(): void {
    this.absoluteTimer = setTimeout(() => {
      this.logout('session_expired');
    }, this.absoluteTimeout);
  }
  
  private showTimeoutWarning(): void {
    // Show modal warning user about impending timeout
    const dialogRef = this.dialog.open(TimeoutWarningComponent, {
      data: { remainingTime: this.warningTime / 1000 }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'extend') {
        this.updateActivity();
      }
    });
  }
  
  private async logout(reason: string): Promise<void> {
    console.log(`Logging out due to: ${reason}`);
    
    // Clear all timers
    clearTimeout(this.idleTimer);
    clearTimeout(this.absoluteTimer);
    clearTimeout(this.warningTimer);
    
    // Clear sensitive data
    await this.authService.logout();
    
    // Redirect to login with reason
    this.router.navigate(['/login'], {
      queryParams: { reason }
    });
  }
  
  // Extend session (after re-authentication)
  extendSession(): void {
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
    this.startMonitoring();
  }
  
  // Get remaining session time
  getRemainingTime(): number {
    const now = Date.now();
    const idleRemaining = this.idleTimeout - (now - this.lastActivity);
    const absoluteRemaining = this.absoluteTimeout - (now - this.sessionStart);
    
    return Math.min(idleRemaining, absoluteRemaining);
  }
}
```

### Concurrent Session Detection

```typescript
@Injectable()
export class ConcurrentSessionService {
  private readonly sessionKey = 'current_session_id';
  private currentSessionId: string;
  private checkInterval = 5000; // Check every 5 seconds
  
  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}
  
  startSession(): void {
    this.currentSessionId = this.generateSessionId();
    this.registerSession();
    this.startMonitoring();
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async registerSession(): Promise<void> {
    await this.http.post('/api/sessions/register', {
      sessionId: this.currentSessionId,
      deviceInfo: this.getDeviceInfo()
    }).toPromise();
  }
  
  private startMonitoring(): void {
    setInterval(async () => {
      const isValid = await this.checkSession();
      
      if (!isValid) {
        this.handleConcurrentSession();
      }
    }, this.checkInterval);
  }
  
  private async checkSession(): Promise<boolean> {
    try {
      const response: any = await this.http.get('/api/sessions/validate', {
        params: { sessionId: this.currentSessionId }
      }).toPromise();
      
      return response.isValid;
    } catch (error) {
      return false;
    }
  }
  
  private handleConcurrentSession(): void {
    alert('Your account has been accessed from another device. You will be logged out.');
    this.sessionService.logout('concurrent_session');
  }
  
  private getDeviceInfo(): any {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`
    };
  }
  
  async endSession(): Promise<void> {
    await this.http.post('/api/sessions/end', {
      sessionId: this.currentSessionId
    }).toPromise();
  }
}
```

---

## 8. Transaction Security

### Transaction Signing

```typescript
@Injectable()
export class TransactionService {
  constructor(
    private signatureService: DigitalSignatureService,
    private keyService: KeyManagementService,
    private http: HttpClient
  ) {}
  
  async createTransaction(
    from: string,
    to: string,
    amount: number,
    currency: string
  ): Promise<any> {
    // Create transaction object
    const transaction = {
      from,
      to,
      amount,
      currency,
      timestamp: Date.now(),
      nonce: this.generateNonce()
    };
    
    // Sign transaction
    const privateKey = await this.keyService.getPrivateKey();
    const signature = await this.signatureService.sign(
      JSON.stringify(transaction),
      privateKey
    );
    
    // Send signed transaction
    return await this.submitTransaction(transaction, signature);
  }
  
  private async submitTransaction(
    transaction: any,
    signature: ArrayBuffer
  ): Promise<any> {
    return this.http.post('/api/transactions', {
      transaction,
      signature: this.arrayBufferToHex(signature)
    }).toPromise();
  }
  
  private generateNonce(): string {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
  }
  
  private arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
```

### Transaction Verification

```typescript
@Injectable()
export class TransactionVerificationService {
  async verifyTransaction(
    transaction: any,
    signature: string,
    publicKey: CryptoKey
  ): Promise<boolean> {
    const signatureBuffer = this.hexToArrayBuffer(signature);
    
    return await this.signatureService.verify(
      JSON.stringify(transaction),
      signatureBuffer,
      publicKey
    );
  }
  
  // Additional verification checks
  async performSecurityChecks(transaction: any): Promise<boolean> {
    // 1. Check transaction limits
    if (!this.checkTransactionLimits(transaction)) {
      return false;
    }
    
    // 2. Verify recipient (not on blacklist)
    if (!await this.verifyRecipient(transaction.to)) {
      return false;
    }
    
    // 3. Check for duplicate transaction (replay attack)
    if (await this.isDuplicateTransaction(transaction.nonce)) {
      return false;
    }
    
    // 4. Verify timestamp (not too old or future)
    if (!this.verifyTimestamp(transaction.timestamp)) {
      return false;
    }
    
    return true;
  }
  
  private checkTransactionLimits(transaction: any): boolean {
    const dailyLimit = 10000; // Example limit
    const singleTransactionLimit = 5000;
    
    if (transaction.amount > singleTransactionLimit) {
      return false;
    }
    
    // Check daily limit (would need to query API)
    return true;
  }
  
  private async verifyRecipient(address: string): Promise<boolean> {
    // Check against blacklist
    const response: any = await this.http.get('/api/verify-recipient', {
      params: { address }
    }).toPromise();
    
    return response.isValid;
  }
  
  private async isDuplicateTransaction(nonce: string): Promise<boolean> {
    const response: any = await this.http.get('/api/check-nonce', {
      params: { nonce }
    }).toPromise();
    
    return response.exists;
  }
  
  private verifyTimestamp(timestamp: number): boolean {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const maxFuture = 60 * 1000; // 1 minute
    
    return (now - timestamp) < maxAge && (timestamp - now) < maxFuture;
  }
  
  private hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }
}
```

### Multi-Signature Support

```typescript
@Injectable()
export class MultiSigTransactionService {
  async createMultiSigTransaction(
    transaction: any,
    requiredSignatures: number,
    signers: string[]
  ): Promise<any> {
    const transactionId = this.generateTransactionId();
    
    // Store pending transaction
    await this.storePendingTransaction({
      id: transactionId,
      transaction,
      requiredSignatures,
      signers,
      signatures: [],
      status: 'pending'
    });
    
    return { transactionId };
  }
  
  async signTransaction(
    transactionId: string,
    signature: string,
    signerPublicKey: string
  ): Promise<any> {
    const pending = await this.getPendingTransaction(transactionId);
    
    // Verify signer is authorized
    if (!pending.signers.includes(signerPublicKey)) {
      throw new Error('Unauthorized signer');
    }
    
    // Verify signature hasn't been added already
    const existingSignature = pending.signatures.find(
      (s: any) => s.signer === signerPublicKey
    );
    
    if (existingSignature) {
      throw new Error('Signature already provided');
    }
    
    // Add signature
    pending.signatures.push({
      signer: signerPublicKey,
      signature,
      timestamp: Date.now()
    });
    
    // Check if we have enough signatures
    if (pending.signatures.length >= pending.requiredSignatures) {
      pending.status = 'ready';
      await this.executeTransaction(pending);
    }
    
    await this.updatePendingTransaction(transactionId, pending);
    
    return pending;
  }
  
  private async executeTransaction(pending: any): Promise<void> {
    // Verify all signatures
    for (const sig of pending.signatures) {
      const isValid = await this.verifySignature(
        pending.transaction,
        sig.signature,
        sig.signer
      );
      
      if (!isValid) {
        throw new Error('Invalid signature detected');
      }
    }
    
    // Submit transaction to blockchain/backend
    await this.http.post('/api/transactions/execute', {
      transactionId: pending.id,
      transaction: pending.transaction,
      signatures: pending.signatures
    }).toPromise();
    
    pending.status = 'executed';
  }
  
  private generateTransactionId(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async storePendingTransaction(pending: any): Promise<void> {
    await this.http.post('/api/transactions/pending', pending).toPromise();
  }
  
  private async getPendingTransaction(id: string): Promise<any> {
    return await this.http.get(`/api/transactions/pending/${id}`).toPromise();
  }
  
  private async updatePendingTransaction(id: string, pending: any): Promise<void> {
    await this.http.put(`/api/transactions/pending/${id}`, pending).toPromise();
  }
  
  private async verifySignature(
    transaction: any,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    // Implement signature verification logic
    return true;
  }
}
```

---

## 9. Compliance & Auditing

### Audit Logging

```typescript
export interface AuditLog {
  timestamp: string;
  userId: string;
  eventType: string;
  action: string;
  resource: string;
  ipAddress: string;
  deviceId: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
  metadata?: any;
}

@Injectable()
export class AuditService {
  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}
  
  async logEvent(event: Partial<AuditLog>): Promise<void> {
    const auditLog: AuditLog = {
      timestamp: new Date().toISOString(),
      userId: this.hashPII(event.userId || ''),
      eventType: event.eventType || 'unknown',
      action: event.action || '',
      resource: event.resource || '',
      ipAddress: await this.getClientIP(),
      deviceId: this.getDeviceId(),
      userAgent: navigator.userAgent,
      success: event.success !== undefined ? event.success : true,
      errorMessage: event.errorMessage,
      metadata: event.metadata
    };
    
    // Send to secure logging service
    await this.sendToLoggingService(auditLog);
  }
  
  // Log authentication events
  async logAuthentication(userId: string, success: boolean, method: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: 'authentication',
      action: 'login',
      resource: method,
      success
    });
  }
  
  // Log transaction events
  async logTransaction(transaction: any, success: boolean): Promise<void> {
    await this.logEvent({
      userId: transaction.userId,
      eventType: 'transaction',
      action: 'create',
      resource: 'transaction',
      success,
      metadata: {
        amount: transaction.amount,
        currency: transaction.currency,
        to: this.hashPII(transaction.to)
      }
    });
  }
  
  // Log security events
  async logSecurityEvent(
    eventType: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    await this.logEvent({
      eventType: 'security',
      action: eventType,
      resource: 'security',
      success: true,
      metadata: {
        description,
        severity
      }
    });
    
    // Alert on critical events
    if (severity === 'critical') {
      await this.alertSecurityTeam(eventType, description);
    }
  }
  
  // Log data access
  async logDataAccess(
    userId: string,
    dataType: string,
    action: 'read' | 'write' | 'delete'
  ): Promise<void> {
    await this.logEvent({
      userId,
      eventType: 'data_access',
      action,
      resource: dataType,
      success: true
    });
  }
  
  private hashPII(data: string): string {
    // Hash PII data before logging (GDPR compliance)
    return CryptoJS.SHA256(data).toString();
  }
  
  private async getClientIP(): Promise<string> {
    try {
      const response: any = await this.http.get('https://api.ipify.org?format=json').toPromise();
      return response.ip;
    } catch (error) {
      return 'unknown';
    }
  }
  
  private getDeviceId(): string {
    // Generate or retrieve device ID
    let deviceId = localStorage.getItem('deviceId');
    
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem('deviceId', deviceId);
    }
    
    return deviceId;
  }
  
  private generateDeviceId(): string {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async sendToLoggingService(log: AuditLog): Promise<void> {
    // Send to centralized logging service (e.g., ELK, Splunk, CloudWatch)
    await this.http.post('/api/audit/log', log).toPromise();
  }
  
  private async alertSecurityTeam(eventType: string, description: string): Promise<void> {
    // Send alert to security team
    await this.http.post('/api/security/alert', {
      eventType,
      description,
      timestamp: new Date().toISOString()
    }).toPromise();
  }
}
```

### GDPR Compliance

```typescript
@Injectable()
export class GDPRService {
  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}
  
  // Right to access - User can request their data
  async requestUserData(userId: string): Promise<any> {
    const response = await this.http.get(`/api/gdpr/user-data/${userId}`).toPromise();
    return response;
  }
  
  // Right to be forgotten - Delete user data
  async deleteUserData(userId: string): Promise<void> {
    await this.http.delete(`/api/gdpr/user-data/${userId}`).toPromise();
    
    // Clear local data
    this.clearLocalUserData(userId);
  }
  
  // Right to data portability - Export user data
  async exportUserData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<Blob> {
    const response = await this.http.get(
      `/api/gdpr/export/${userId}?format=${format}`,
      { responseType: 'blob' }
    ).toPromise();
    
    return response as Blob;
  }
  
  // Consent management
  async recordConsent(userId: string, consentType: string, granted: boolean): Promise<void> {
    await this.http.post('/api/gdpr/consent', {
      userId,
      consentType,
      granted,
      timestamp: new Date().toISOString()
    }).toPromise();
  }
  
  // Data breach notification
  async notifyDataBreach(userId: string, breachDetails: any): Promise<void> {
    await this.http.post('/api/gdpr/breach-notification', {
      userId,
      breachDetails,
      timestamp: new Date().toISOString()
    }).toPromise();
  }
  
  private clearLocalUserData(userId: string): void {
    // Clear all local storage related to user
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(userId)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear indexed DB
    this.clearIndexedDB();
  }
  
  private clearIndexedDB(): void {
    if (window.indexedDB) {
      indexedDB.deleteDatabase('app-database');
    }
  }
}
```

### PCI DSS Compliance

```typescript
@Injectable()
export class PCIDSSService {
  // Never store full PAN (Primary Account Number)
  // Only store masked version
  maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 16) return '';
    
    // Show only last 4 digits
    return `****-****-****-${cardNumber.slice(-4)}`;
  }
  
  // Tokenize card data
  async tokenizeCard(cardData: any): Promise<string> {
    // Send to PCI-compliant tokenization service
    const response: any = await this.http.post('/api/payment/tokenize', {
      cardNumber: cardData.number,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv // Never store CVV!
    }).toPromise();
    
    return response.token;
  }
  
  // Process payment with token
  async processPayment(token: string, amount: number): Promise<any> {
    return await this.http.post('/api/payment/process', {
      token,
      amount
    }).toPromise();
  }
  
  // Validate card number (Luhn algorithm)
  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
  
  // Clear sensitive card data from memory
  clearSensitiveData(obj: any): void {
    if (obj) {
      Object.keys(obj).forEach(key => {
        if (key.toLowerCase().includes('card') || 
            key.toLowerCase().includes('cvv') ||
            key.toLowerCase().includes('pin')) {
          delete obj[key];
        }
      });
    }
  }
}
```

---

## 10. Code Security

### Environment Variables & Secrets Management

```typescript
// environment.ts - Development
export const environment = {
  production: false,
  apiUrl: 'https://dev-api.example.com',
  // Never commit real secrets!
  encryptionKey: 'dev-key-12345',
  hmacSecret: 'dev-secret-12345'
};

// environment.prod.ts - Production
export const environment = {
  production: true,
  // Load from environment variables at build time
  apiUrl: process.env['API_URL'] || '',
  encryptionKey: process.env['ENCRYPTION_KEY'] || '',
  hmacSecret: process.env['HMAC_SECRET'] || ''
};
```

**Better approach - Runtime configuration:**

```typescript
// config.service.ts
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;
  
  async loadConfig(): Promise<void> {
    // Load config from secure backend endpoint
    this.config = await this.http.get('/api/config').toPromise();
  }
  
  get(key: string): any {
    return this.config?.[key];
  }
}

// app.initializer.ts
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ]
})
export class AppModule { }
```

### Code Obfuscation

```bash
# Install webpack obfuscator
npm install --save-dev webpack-obfuscator

# Install terser for minification
npm install --save-dev terser-webpack-plugin
```

```javascript
// webpack.config.js
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs in production
          },
        },
      }),
    ],
  },
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75
    }, [])
  ]
};
```

### Security Headers

```typescript
// Set security headers in Angular (for dev server)
// For production, set these on your web server (Nginx, Apache, CloudFront)

@Injectable()
export class SecurityHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // These should be set by backend, but verify
          this.verifySecurityHeaders(event.headers);
        }
      })
    );
  }
  
  private verifySecurityHeaders(headers: HttpHeaders): void {
    const requiredHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
    
    Object.keys(requiredHeaders).forEach(header => {
      if (!headers.has(header)) {
        console.warn(`Missing security header: ${header}`);
      }
    });
  }
}
```

### Input Validation & Sanitization

```typescript
@Injectable()
export class ValidationService {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  // Phone number validation
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
  
  // Amount validation for banking
  isValidAmount(amount: string | number): boolean {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(numAmount) && numAmount > 0 && numAmount < 1000000;
  }
  
  // IBAN validation
  isValidIBAN(iban: string): boolean {
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;
    if (!ibanRegex.test(iban)) return false;
    
    // Perform modulo 97 check
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numerical = rearranged
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? code - 55 : char;
      })
      .join('');
    
    return this.mod97(numerical) === 1;
  }
  
  private mod97(string: string): number {
    let remainder = string;
    while (remainder.length > 2) {
      const block = remainder.slice(0, 9);
      remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
    }
    return parseInt(remainder, 10) % 97;
  }
  
  // Sanitize string input
  sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  // Sanitize SQL-like input
  sanitizeSQLInput(input: string): string {
    return input
      .replace(/['";]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove multi-line comment start
      .trim();
  }
}
```

---

## 11. Biometric Authentication

### Fingerprint/Face ID Implementation

```typescript
import { BiometricAuth, BiometryType } from '@capacitor/biometric-auth';

@Injectable()
export class BiometricService {
  async isAvailable(): Promise<{ available: boolean; biometryType: BiometryType }> {
    try {
      const result = await BiometricAuth.checkBiometry();
      return {
        available: result.isAvailable,
        biometryType: result.biometryType
      };
    } catch (error) {
      return { available: false, biometryType: BiometryType.none };
    }
  }
  
  async authenticate(reason: string = 'Authenticate to access your account'): Promise<boolean> {
    try {
      const result = await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use Passcode',
        androidTitle: 'Biometric Authentication',
        androidSubtitle: 'Log in using your biometric credential',
        androidConfirmationRequired: false
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }
  
  async setupBiometric(): Promise<boolean> {
    const { available, biometryType } = await this.isAvailable();
    
    if (!available) {
      alert('Biometric authentication is not available on this device');
      return false;
    }
    
    // Inform user about biometric type
    const biometryName = this.getBiometryName(biometryType);
    const confirmed = confirm(`Enable ${biometryName} authentication?`);
    
    if (!confirmed) return false;
    
    // Test biometric authentication
    const success = await this.authenticate(`Enable ${biometryName}`);
    
    if (success) {
      // Store preference
      await this.storeBiometricPreference(true);
    }
    
    return success;
  }
  
  private getBiometryName(type: BiometryType): string {
    switch (type) {
      case BiometryType.fingerprintAuthentication:
        return 'Fingerprint';
      case BiometryType.faceAuthentication:
        return 'Face ID';
      case BiometryType.irisAuthentication:
        return 'Iris';
      default:
        return 'Biometric';
    }
  }
  
  private async storeBiometricPreference(enabled: boolean): Promise<void> {
    localStorage.setItem('biometric_enabled', enabled.toString());
  }
  
  async isBiometricEnabled(): Promise<boolean> {
    return localStorage.getItem('biometric_enabled') === 'true';
  }
  
  async disableBiometric(): Promise<void> {
    await this.storeBiometricPreference(false);
  }
}
```

### Biometric Login Flow

```typescript
@Component({
  selector: 'app-login',
  template: `
    <ion-content>
      <div class="login-container">
        <h1>Login</h1>
        
        <ion-button *ngIf="biometricAvailable" 
                    (click)="loginWithBiometric()"
                    expand="block">
          <ion-icon name="finger-print"></ion-icon>
          Login with {{ biometryType }}
        </ion-button>
        
        <form [formGroup]="loginForm" (ngSubmit)="loginWithPassword()">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input formControlName="email" type="email"></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input formControlName="password" type="password"></ion-input>
          </ion-item>
          
          <ion-button type="submit" expand="block">
            Login with Password
          </ion-button>
        </form>
      </div>
    </ion-content>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  biometricAvailable = false;
  biometryType = '';
  
  constructor(
    private fb: FormBuilder,
    private biometricService: BiometricService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  async ngOnInit() {
    const { available, biometryType } = await this.biometricService.isAvailable();
    this.biometricAvailable = available && await this.biometricService.isBiometricEnabled();
    this.biometryType = this.getBiometryName(biometryType);
  }
  
  async loginWithBiometric() {
    const success = await this.biometricService.authenticate('Login to your account');
    
    if (success) {
      // Retrieve stored credentials (encrypted)
      const credentials = await this.getStoredCredentials();
      
      if (credentials) {
        await this.performLogin(credentials.email, credentials.password);
      }
    }
  }
  
  async loginWithPassword() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      const success = await this.performLogin(email, password);
      
      if (success && !this.biometricAvailable) {
        // Offer to enable biometric
        const enable = confirm('Would you like to enable biometric login?');
        if (enable) {
          await this.setupBiometric(email, password);
        }
      }
    }
  }
  
  private async performLogin(email: string, password: string): Promise<boolean> {
    try {
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error) {
      alert('Login failed');
      return false;
    }
  }
  
  private async setupBiometric(email: string, password: string): Promise<void> {
    const success = await this.biometricService.setupBiometric();
    
    if (success) {
      // Store encrypted credentials
      await this.storeCredentials(email, password);
    }
  }
  
  private async storeCredentials(email: string, password: string): Promise<void> {
    // Encrypt and store credentials securely
    const encrypted = await this.encryptionService.encrypt(JSON.stringify({ email, password }));
    await this.secureStorage.set('biometric_credentials', encrypted);
  }
  
  private async getStoredCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const encrypted = await this.secureStorage.get('biometric_credentials');
      const decrypted = await this.encryptionService.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }
  
  private getBiometryName(type: any): string {
    // Implementation from BiometricService
    return 'Biometric';
  }
}
```

---

## 12. Security Checklist for Banking/Crypto Apps

### ✅ Authentication & Authorization
- [ ] Multi-factor authentication (MFA) implemented
- [ ] Biometric authentication available on mobile
- [ ] Password complexity requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow
- [ ] Session timeout (idle & absolute)
- [ ] Concurrent session detection
- [ ] JWT tokens with short expiry (5-15 min)
- [ ] Token refresh mechanism
- [ ] Role-based access control (RBAC)

### ✅ Data Protection
- [ ] All sensitive data encrypted at rest (AES-256)
- [ ] TLS 1.3 for all communications
- [ ] Certificate pinning implemented
- [ ] No sensitive data in logs
- [ ] No sensitive data in URL parameters
- [ ] Secure storage for tokens (SecureStorage/Keychain)
- [ ] Data wiped on logout
- [ ] Memory cleared after sensitive operations

### ✅ API Security
- [ ] HMAC request signing implemented
- [ ] Request/response encryption for sensitive endpoints
- [ ] Rate limiting on client side
- [ ] Exponential backoff for retries
- [ ] Input validation on all endpoints
- [ ] Output encoding
- [ ] CSRF protection
- [ ] API versioning

### ✅ Mobile Security (Ionic)
- [ ] Root/jailbreak detection
- [ ] Screenshot prevention on sensitive screens
- [ ] Clipboard access controlled
- [ ] SSL pinning
- [ ] App integrity checks
- [ ] Secure storage plugin used
- [ ] Biometric authentication
- [ ] Background app security overlay

### ✅ Code Security
- [ ] No secrets hardcoded in source
- [ ] Environment variables properly managed
- [ ] Code obfuscation in production
- [ ] Regular dependency audits (`npm audit`)
- [ ] SAST tools integrated
- [ ] Security code reviews
- [ ] Penetration testing performed
- [ ] Debug mode disabled in production

### ✅ Transaction Security
- [ ] Transaction signing implemented
- [ ] Transaction verification
- [ ] Transaction limits enforced
- [ ] Multi-signature support (if applicable)
- [ ] Replay attack prevention
- [ ] Transaction confirmation (OTP/2FA)
- [ ] Audit trail for all transactions

### ✅ Compliance
- [ ] PCI DSS compliance (if handling cards)
- [ ] GDPR compliance
- [ ] Data retention policies
- [ ] Right to be forgotten implemented
- [ ] Data portability supported
- [ ] Consent management
- [ ] Privacy policy displayed
- [ ] Terms & conditions acceptance

### ✅ Monitoring & Logging
- [ ] Security event logging
- [ ] Audit trail for all critical operations
- [ ] PII hashed in logs
- [ ] Centralized logging system
- [ ] Real-time security alerts
- [ ] Intrusion detection
- [ ] Anomaly detection
- [ ] Incident response plan

### ✅ UI/UX Security
- [ ] Content Security Policy (CSP)
- [ ] XSS prevention
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] Clickjacking prevention (X-Frame-Options)
- [ ] MIME type sniffing prevention
- [ ] Secure error messages (no info disclosure)

### ✅ Cryptographic Practices
- [ ] Use industry-standard algorithms (AES-256, RSA-2048+)
- [ ] Proper key management
- [ ] Key rotation policy
- [ ] Random IV/nonce generation
- [ ] Hardware-backed keystores (mobile)
- [ ] Web Crypto API used where possible
- [ ] No deprecated crypto algorithms

---

## Additional Resources

### Security Tools & Libraries

**NPM Packages:**
- `crypto-js` - Cryptographic functions
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT handling
- `helmet` - Security headers (backend)
- `express-rate-limit` - Rate limiting (backend)
- `csurf` - CSRF protection (backend)

**Ionic/Capacitor Plugins:**
- `@ionic-native/secure-storage` - Secure storage
- `@ionic-native/fingerprint-aio` - Biometric auth
- `@capacitor/biometric-auth` - Modern biometric API
- `@ionic-native/http` - SSL pinning
- `@ionic-native/jailbreak-root-detection` - Device security

**Security Testing:**
- `Snyk` - Vulnerability scanning
- `OWASP ZAP` - Penetration testing
- `SonarQube` - Code quality & security
- `Burp Suite` - Web security testing

### Standards & Frameworks

- **OWASP Top 10** - Top security risks
- **PCI DSS** - Payment card security
- **GDPR** - Data privacy (EU)
- **CCPA** - Data privacy (California)
- **ISO 27001** - Information security management
- **SOC 2** - Security controls audit

### Best Practices Documentation

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [OWASP Web Security](https://owasp.org/www-project-web-security-testing-guide/)
- [Angular Security Guide](https://angular.io/guide/security)
- [Ionic Security Best Practices](https://ionicframework.com/docs/techniques/security)

---

## Conclusion

Security in banking and cryptocurrency applications is **critical** and **non-negotiable**. This guide covers the essential security practices, but remember:

1. **Security is a process, not a product** - Continuously monitor, audit, and improve
2. **Defense in depth** - Implement multiple layers of security
3. **Assume breach** - Plan for when (not if) security is compromised
4. **Stay updated** - New vulnerabilities are discovered regularly
5. **Security by design** - Build security in from the start, not as an afterthought

**Always consult with security professionals** and conduct regular security audits before deploying financial applications to production.










