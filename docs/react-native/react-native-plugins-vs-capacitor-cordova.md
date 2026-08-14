# React Native Plugins vs Capacitor / Cordova Plugins

A reference guide to the **most widely used React Native libraries** for native device features, with **side-by-side comparisons** to their Capacitor and Cordova equivalents. Written for developers moving between hybrid (WebView) and React Native stacks.

---

## Table of Contents

1. [How plugin models differ](#1-how-plugin-models-differ)
2. [Quick lookup table](#2-quick-lookup-table)
3. [Navigation & UI shell](#3-navigation--ui-shell)
4. [Storage & persistence](#4-storage--persistence)
5. [Camera, media & files](#5-camera-media--files)
6. [Location & maps](#6-location--maps)
7. [Network, HTTP & offline](#7-network-http--offline)
8. [Push notifications & local alerts](#8-push-notifications--local-alerts)
9. [Authentication & secure storage](#9-authentication--secure-storage)
10. [Device, permissions & system UI](#10-device-permissions--system-ui)
11. [Share, clipboard, browser & deep links](#11-share-clipboard-browser--deep-links)
12. [Analytics, crash reporting & monitoring](#12-analytics-crash-reporting--monitoring)
13. [Animations, gestures & performance](#13-animations-gestures--performance)
14. [Payments, Bluetooth & specialized hardware](#14-payments-bluetooth--specialized-hardware)
15. [Expo equivalents](#15-expo-equivalents)
16. [Choosing the right stack](#16-choosing-the-right-stack)
17. [Migration cheat sheet](#17-migration-cheatsheet)

---

## 1. How plugin models differ

### Capacitor

- **Official plugins** ship as `@capacitor/<name>` npm packages maintained by the Ionic team.
- **Bridge**: JavaScript in the WebView calls native code through a thin plugin bridge.
- **Install**: `npm install @capacitor/camera` → `npx cap sync`.
- **API style**: Promise-based, consistent across plugins (`Camera.getPhoto()`, `Storage.get()`).
- **Config**: `capacitor.config.ts` for plugin options (e.g. push, splash screen).

### Cordova

- **Legacy model**: thousands of `cordova-plugin-*` packages on npm; quality varies widely.
- **Same bridge idea** as Capacitor, but older API surface and more fragmentation.
- **Capacitor can run many Cordova plugins** via `@capacitor-community/*` or compatibility layers — new Ionic projects should prefer Capacitor official plugins.
- **Typical install**: `cordova plugin add cordova-plugin-camera` (Cordova CLI) or npm + config.xml.

### React Native

- **No single “plugin registry”** — libraries are normal npm packages that link native iOS/Android code into your app.
- **Bridge**: JS thread ↔ native modules (legacy bridge, JSI, or Turbo Modules in the New Architecture).
- **Install**: `npm install <package>` → often requires **pod install** (iOS) and **Gradle sync** (Android). Some packages need manual native edits.
- **API style**: varies by library — callbacks, Promises, or hooks. Less uniform than Capacitor.
- **Built-in APIs**: many common features (`Share`, `Linking`, `Alert`, `Vibration`) are in **core React Native** with no extra install.

### Mental model for Ionic developers

| Concept | Capacitor / Cordova | React Native |
|---------|---------------------|--------------|
| “Official” device API | `@capacitor/camera` | Core `Share` API or community npm package |
| Adding native code | `npx cap sync` | `pod install`, rebuild, sometimes edit Xcode/Gradle |
| WebView | Required (your app *is* the WebView) | None — UI is native components |
| Plugin discovery | [capacitorjs.com/docs/plugins](https://capacitorjs.com/docs/plugins) | [reactnative.directory](https://reactnative.directory/) |
| Permissions | Often handled inside plugin | Often separate: `react-native-permissions` |

---

## 2. Quick lookup table

Most common **feature → library** mapping across stacks:

| Feature | Capacitor (official) | Cordova (common) | React Native (popular) |
|---------|---------------------|------------------|------------------------|
| **Key-value storage** | `@capacitor/preferences` | `cordova-plugin-nativestorage` | `@react-native-async-storage/async-storage` |
| **Secure storage** | Community / custom | `cordova-plugin-secure-storage` | `react-native-keychain` |
| **SQLite** | `@capacitor-community/sqlite` | `cordova-sqlite-storage` | `op-sqlite` / `@op-engineering/op-sqlite` |
| **Camera / gallery** | `@capacitor/camera` | `cordova-plugin-camera` | `react-native-image-picker` |
| **Filesystem** | `@capacitor/filesystem` | `cordova-plugin-file` | `react-native-fs` |
| **Geolocation** | `@capacitor/geolocation` | `cordova-plugin-geolocation` | `@react-native-community/geolocation` |
| **Maps** | Google Maps JS + plugin | `cordova-plugin-googlemaps` | `react-native-maps` |
| **Push (FCM/APNs)** | `@capacitor/push-notifications` | `phonegap-plugin-push` | `@react-native-firebase/messaging` + `@notifee/react-native` |
| **Local notifications** | `@capacitor/local-notifications` | `cordova-plugin-local-notification` | `@notifee/react-native` |
| **Share sheet** | `@capacitor/share` | `cordova-plugin-x-socialsharing` | Built-in `Share` API |
| **Clipboard** | `@capacitor/clipboard` | `cordova-plugin-clipboard` | `@react-native-clipboard/clipboard` |
| **In-app browser** | `@capacitor/browser` | `cordova-plugin-inappbrowser` | `react-native-inappbrowser-reborn` |
| **Haptics** | `@capacitor/haptics` | `cordova-plugin-vibration` | `react-native-haptic-feedback` |
| **Device info** | `@capacitor/device` | `cordova-plugin-device` | `react-native-device-info` |
| **Network status** | `@capacitor/network` | `cordova-plugin-network-information` | `@react-native-community/netinfo` |
| **App state / background** | `@capacitor/app` | `cordova-plugin-background-mode` | `AppState` (built-in) + `@react-native-community/background-fetch` |
| **Biometrics** | `@capacitor-community/biometric-auth` | `cordova-plugin-fingerprint-aio` | `react-native-biometrics` |
| **Deep links** | `@capacitor/app` + config | `cordova-plugin-customurlscheme` | Built-in `Linking` + `@react-navigation/native` |
| **Status bar** | `@capacitor/status-bar` | `cordova-plugin-statusbar` | `react-native-status-bar` (built-in) + `expo-status-bar` |
| **Splash screen** | `@capacitor/splash-screen` | `cordova-plugin-splashscreen` | `react-native-bootsplash` |
| **Keyboard** | `@capacitor/keyboard` | `cordova-plugin-ionic-keyboard` | `Keyboard` API (built-in) + `react-native-keyboard-controller` |
| **HTTP (native)** | `@capacitor-community/http` | `cordova-plugin-advanced-http` | `fetch` / `axios` (JS); native TLS pinning via custom native code |
| **Firebase Auth** | `@capacitor-firebase/authentication` | `cordova-plugin-firebase-authentication` | `@react-native-firebase/auth` |
| **Google Sign-In** | `@codetrix-studio/capacitor-google-auth` | `cordova-plugin-googleplus` | `@react-native-google-signin/google-signin` |
| **Apple Sign-In** | `@capacitor-community/apple-sign-in` | `cordova-plugin-sign-in-with-apple` | `@invertase/react-native-apple-authentication` |
| **Crash reporting** | `@capacitor-community/firebase-crashlytics` | `cordova-plugin-firebase-crash` | `@react-native-firebase/crashlytics` / `@sentry/react-native` |
| **Analytics** | `@capacitor-community/firebase-analytics` | `cordova-plugin-firebase-analytics` | `@react-native-firebase/analytics` |
| **Bluetooth LE** | `@capacitor-community/bluetooth-le` | `cordova-plugin-ble-central` | `react-native-ble-plx` |
| **Navigation (app screens)** | `@angular/router` / Ionic router | Same | `@react-navigation/native` |

> **Note:** Capacitor renamed `@capacitor/storage` to **`@capacitor/preferences`** in v4+. Cordova plugin names are legacy but still appear in older codebases.

---

## 3. Navigation & UI shell

React Native has **no Capacitor equivalent** — navigation is an app concern, not a native bridge plugin.

| | Capacitor / Ionic | React Native |
|--|-------------------|--------------|
| **Primary choice** | `@ionic/angular` router, `ion-router-outlet` | `@react-navigation/native` + stack / tab / drawer navigators |
| **Install** | Built into Ionic | `npm install @react-navigation/native react-native-screens react-native-safe-area-context` |
| **Native stack animations** | Ionic transitions (WebView) | `@react-navigation/native-stack` uses native screen containers |
| **Deep linking** | Angular `Router` + `@capacitor/app` | `Linking` + React Navigation linking config |

```tsx
// React Native — stack navigator (conceptual)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

```typescript
// Ionic / Capacitor — Angular routing (conceptual)
// app.routes.ts
export const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'details/:id', component: DetailsPage },
];
```

**Popular RN UI libraries** (no single Ionic equivalent — you pick one):

| Library | Style | npm downloads / adoption |
|---------|-------|--------------------------|
| `react-native-paper` | Material Design 3 | Very high |
| `@rneui/themed` | Cross-platform toolkit | High |
| `react-native-elements` | Legacy name → use `@rneui/themed` | High |
| `@shopify/restyle` | Design-system primitives | Medium (teams building design systems) |
| `native-base` | Accessible components | Medium |

---

## 4. Storage & persistence

### Key-value storage

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/preferences` | `cordova-plugin-nativestorage` | `@react-native-async-storage/async-storage` |
| **Sync model** | Async (Promises) | Async callbacks / Promises | Async (Promises) |
| **Size limit** | Suitable for settings, tokens | Same | Same — not for large blobs |
| **Web fallback** | `localStorage` on web | N/A in pure Cordova | N/A |

```typescript
// Capacitor
import { Preferences } from '@capacitor/preferences';
await Preferences.set({ key: 'token', value: jwt });
const { value } = await Preferences.get({ key: 'token' });
```

```typescript
// React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('token', jwt);
const value = await AsyncStorage.getItem('token');
```

### Secure storage (Keychain / Keystore)

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor-community/secure-storage` or custom | `cordova-plugin-secure-storage` | `react-native-keychain` |
| **Use case** | Refresh tokens, credentials | Same | Same |
| **Biometric gate** | Via biometric plugin | Via fingerprint plugin | Built-in options in `react-native-keychain` |

### SQLite & local databases

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor-community/sqlite` | `cordova-sqlite-storage` | `op-sqlite`, `react-native-quick-sqlite`, `realm` |
| **ORM layer** | TypeORM, custom SQL | Same | Drizzle, WatermelonDB, Realm |
| **Performance** | Good for hybrid apps | Good | **Better** for heavy queries (direct native, no WebView) |

**WatermelonDB** (`@nozbe/watermelon-db`) is popular in React Native for reactive, synced offline-first apps — no direct Capacitor counterpart at the same maturity.

### MMKV (RN-only high-performance option)

`react-native-mmkv` — synchronous, ~30× faster than AsyncStorage. Common for auth tokens and feature flags. **No Capacitor equivalent**; Capacitor apps typically use Preferences or SQLite.

---

## 5. Camera, media & files

### Camera & image picker

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/camera` | `cordova-plugin-camera` | `react-native-image-picker` |
| **Returns** | Base64, file URI, or `webPath` | File URI / base64 | Asset URI + metadata |
| **Video** | Supported | Supported | Supported |
| **Permissions** | Handled in plugin | Handled in plugin | Often paired with `react-native-permissions` |

```typescript
// Capacitor
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
const photo = await Camera.getPhoto({
  quality: 90,
  resultType: CameraResultType.Uri,
  source: CameraSource.Camera,
});
// photo.webPath
```

```typescript
// React Native
import { launchCamera } from 'react-native-image-picker';
const result = await launchCamera({ mediaType: 'photo', quality: 0.9 });
const uri = result.assets?.[0]?.uri;
```

### Image display & caching

| React Native | Capacitor / Cordova |
|--------------|---------------------|
| `react-native-fast-image` — disk/memory cache, priority loading | Standard `<img>` in WebView; browser cache |
| `@react-native-camera-roll/camera-roll` — save to gallery | `@capacitor/camera` / Media plugin patterns |

### Video playback

| React Native | Hybrid |
|--------------|--------|
| `react-native-video` — native player, controls, streaming | `<video>` HTML5 or `@capacitor-community/video-recorder` |

### Filesystem

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/filesystem` | `cordova-plugin-file` | `react-native-fs` |
| **Read/write** | `Filesystem.readFile`, `writeFile` | `resolveLocalFileSystemURL` (verbose API) | `RNFS.readFile`, `writeFile` |
| **Paths** | `Directory.Data`, `Directory.Cache` | `cordova.file.*` constants | `RNFS.DocumentDirectoryPath`, etc. |

**Gotcha:** In Capacitor, paths are often **web-friendly URIs** (`webPath`). In React Native, you work with **native file paths** (`file://...`) — upload and display code differs.

---

## 6. Location & maps

### Geolocation

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/geolocation` | `cordova-plugin-geolocation` | `@react-native-community/geolocation` |
| **Background tracking** | Limited / community plugins | `cordova-plugin-background-geolocation` (paid options common) | `react-native-background-geolocation` (TransistorSoft, commercial) |
| **Permissions** | Built into plugin | Built into plugin | `react-native-permissions` recommended |

```typescript
// Capacitor
import { Geolocation } from '@capacitor/geolocation';
const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
```

```typescript
// React Native
import Geolocation from '@react-native-community/geolocation';
Geolocation.getCurrentPosition(
  (position) => console.log(position.coords),
  (error) => console.error(error),
  { enableHighAccuracy: true }
);
```

### Maps

| | Capacitor / Ionic | React Native |
|--|-------------------|--------------|
| **Approach** | Google Maps JavaScript API in WebView, or `@capacitor/google-maps` | `react-native-maps` — **native** MapView (Google Maps on Android, Apple Maps or Google on iOS) |
| **Performance** | Good for simple maps; heavy markers can lag in WebView | Better for many markers, custom overlays, native gestures |
| **Install complexity** | API keys in web config | API keys in `AndroidManifest.xml`, `AppDelegate`, plus npm linking |

---

## 7. Network, HTTP & offline

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Typical HTTP** | Angular `HttpClient`, `fetch` | Same | `fetch`, `axios` |
| **Native HTTP (CORS bypass, cookies)** | `@capacitor-community/http` | `cordova-plugin-advanced-http` | Usually unnecessary — RN is not bound by browser CORS |
| **Network status** | `@capacitor/network` | `cordova-plugin-network-information` | `@react-native-community/netinfo` |
| **Offline cache / sync** | Service workers (PWA), custom | Same | `@tanstack/react-query`, WatermelonDB, Redux Persist |

```typescript
// Capacitor — network listener
import { Network } from '@capacitor/network';
const status = await Network.getStatus();
Network.addListener('networkStatusChange', (s) => console.log(s.connected));
```

```typescript
// React Native
import NetInfo from '@react-native-community/netinfo';
const state = await NetInfo.fetch();
NetInfo.addEventListener((s) => console.log(s.isConnected));
```

**Key difference:** Hybrid apps may need **`@capacitor-community/http`** to avoid CORS when calling third-party APIs from the WebView. React Native calls APIs **directly from JS** like Node.js — no CORS wall.

---

## 8. Push notifications & local alerts

### Remote push (FCM / APNs)

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/push-notifications` | `phonegap-plugin-push` (legacy) | `@react-native-firebase/messaging` |
| **Display when app in foreground** | Custom handler | Custom handler | `@notifee/react-native` or `@react-native-firebase/messaging` |
| **Token registration** | `PushNotifications.register()` | Plugin callback | `messaging().getToken()` |
| **Setup** | Firebase config in native projects + `cap sync` | `google-services.json`, `GoogleService-Info.plist` | Same native files + Gradle/Pods for RN Firebase |

```typescript
// Capacitor
import { PushNotifications } from '@capacitor/push-notifications';
await PushNotifications.requestPermissions();
await PushNotifications.register();
PushNotifications.addListener('registration', (token) => { /* ... */ });
```

```typescript
// React Native (Firebase)
import messaging from '@react-native-firebase/messaging';
await messaging().requestPermission();
const token = await messaging().getToken();
```

### Local notifications

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/local-notifications` | `cordova-plugin-local-notification` | `@notifee/react-native` |
| **Channels (Android)** | Supported | Supported | `@notifee/react-native` — excellent channel API |
| **Rich notifications** | Basic | Varies | Notifee — images, actions, grouped |

`@notifee/react-native` (by Invertase, same team as RN Firebase) is the **de facto standard** for displaying notifications in React Native.

---

## 9. Authentication & secure storage

| Feature | Capacitor | Cordova | React Native |
|---------|-----------|---------|--------------|
| **Firebase Auth** | `@capacitor-firebase/authentication` | `cordova-plugin-firebase-authentication` | `@react-native-firebase/auth` |
| **Google Sign-In** | `@codetrix-studio/capacitor-google-auth` | `cordova-plugin-googleplus` | `@react-native-google-signin/google-signin` |
| **Apple Sign-In** | `@capacitor-community/apple-sign-in` | `cordova-plugin-sign-in-with-apple` | `@invertase/react-native-apple-authentication` |
| **Auth0 / Okta** | Web OAuth in browser / `@capacitor/browser` | InAppBrowser plugins | `react-native-auth0`, `react-native-app-auth` |
| **Biometrics** | `@capacitor-community/biometric-auth` | `cordova-plugin-fingerprint-aio` | `react-native-biometrics` |
| **Store tokens** | Secure Storage plugin | `cordova-plugin-secure-storage` | `react-native-keychain` |

**Pattern difference:**

- **Capacitor:** OAuth often opens **`@capacitor/browser`** for the login page, then deep-links back with a token.
- **React Native:** Same flow with **`react-native-inappbrowser-reborn`** or native SDKs (Google, Apple) that avoid WebView where possible.

---

## 10. Device, permissions & system UI

### Permissions

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Model** | Each plugin requests its own | Same | Centralized: **`react-native-permissions`** |
| **Unified API** | No single package | No | `check`, `request`, `PERMISSIONS.IOS.CAMERA`, etc. |

Capacitor plugins often call `requestPermissions()` internally. In React Native, you frequently **request permission explicitly** before using camera, location, or notifications.

### Device information

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/device` | `cordova-plugin-device` | `react-native-device-info` |
| **Data** | `deviceId`, `model`, `platform`, `osVersion` | UUID, model, version | Extensive: battery, carrier, notch, emulator detection, etc. |

### Haptics & vibration

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/haptics` | `cordova-plugin-vibration` | `react-native-haptic-feedback` or built-in `Vibration` |
| **Impact styles** | `ImpactStyle.Light/Medium/Heavy` | Basic vibrate duration | iOS `impactLight`, Android patterns |

### Status bar & splash screen

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Status bar** | `@capacitor/status-bar` | `cordova-plugin-statusbar` | React Native `StatusBar` component |
| **Splash** | `@capacitor/splash-screen` | `cordova-plugin-splashscreen` | `react-native-bootsplash` (most popular) |

### Keyboard

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/keyboard` | `cordova-plugin-ionic-keyboard` | Built-in `Keyboard` module |
| **Advanced control** | `keyboardWillShow` events | Ionic keyboard resize | **`react-native-keyboard-controller`** — avoids layout jumps |

---

## 11. Share, clipboard, browser & deep links

### Share

| | Capacitor | React Native |
|--|-----------|--------------|
| **Package** | `@capacitor/share` | **Built-in** `Share` from `react-native` |
| **Install** | npm + sync | None |

```typescript
// Capacitor
import { Share } from '@capacitor/share';
await Share.share({ title: 'App', url: 'https://example.com', dialogTitle: 'Share' });
```

```typescript
// React Native — no extra package
import { Share } from 'react-native';
await Share.share({ message: 'Check this out', url: 'https://example.com', title: 'App' });
```

### Clipboard

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/clipboard` | `cordova-plugin-clipboard` | `@react-native-clipboard/clipboard` |

### In-app browser

| | Capacitor | Cordova | React Native |
|--|-----------|---------|--------------|
| **Package** | `@capacitor/browser` | `cordova-plugin-inappbrowser` | `react-native-inappbrowser-reborn` |
| **Use case** | OAuth, external links | Same | Same |
| **Chrome Custom Tabs / SFSafariViewController** | Yes | Yes | Yes (via library) |

### Deep linking & universal links

| | Capacitor | React Native |
|--|-----------|--------------|
| **API** | `@capacitor/app` → `appUrlOpen` | `Linking.addEventListener('url', ...)` |
| **Config** | `android/intent-filter`, Apple Associated Domains in Xcode | Same native config + React Navigation `linking` prop |

---

## 12. Analytics, crash reporting & monitoring

| Feature | Capacitor | Cordova | React Native |
|---------|-----------|---------|--------------|
| **Firebase Analytics** | `@capacitor-community/firebase-analytics` | `cordova-plugin-firebase-analytics` | `@react-native-firebase/analytics` |
| **Crashlytics** | `@capacitor-community/firebase-crashlytics` | `cordova-plugin-firebase-crash` | `@react-native-firebase/crashlytics` |
| **Sentry** | `@sentry/capacitor` | `sentry-cordova` | `@sentry/react-native` |
| **Performance** | Firebase web SDK (limited) | Same | `@react-native-firebase/perf`, `react-native-performance` |

**React Native advantage:** Native crash symbolication and closer-to-metal performance traces. Hybrid crash reports often blend WebView JS errors with native shell crashes.

---

## 13. Animations, gestures & performance

These categories have **no Capacitor plugin equivalent** — they are core to how React Native apps feel native.

| Library | Purpose | Capacitor / Ionic analog |
|---------|---------|--------------------------|
| `react-native-reanimated` | UI-thread animations, shared values | CSS animations (WebView — lower ceiling) |
| `react-native-gesture-handler` | Native-driven gestures | `@ionic/angular` gestures / Hammer.js |
| `@shopify/flash-list` | High-performance lists | Virtual scroll in web (`cdk-virtual-scroll`) |
| `lottie-react-native` | Lottie animations | `lottie-web` in WebView |
| `react-native-screens` | Native screen containers | N/A |

For Ionic developers: if you hit **animation jank in a WebView**, the RN stack (`reanimated` + `gesture-handler`) is the usual migration motivator — not a plugin swap.

---

## 14. Payments, Bluetooth & specialized hardware

| Feature | Capacitor | Cordova | React Native |
|---------|-----------|---------|--------------|
| **In-app purchases** | `@capacitor-community/in-app-purchases` | `cordova-plugin-purchase` | `react-native-iap` |
| **Stripe payments** | Web Stripe.js | `cordova-plugin-stripe` | `@stripe/stripe-react-native` |
| **Bluetooth LE** | `@capacitor-community/bluetooth-le` | `cordova-plugin-ble-central` | `react-native-ble-plx` |
| **NFC** | Community plugins | `phonegap-nfc` | `react-native-nfc-manager` |
| **Barcode scan** | `@capacitor-community/barcode-scanner` | `phonegap-plugin-barcodescanner` | `react-native-vision-camera` + frame processors |

Specialized hardware plugins in **Cordova** are often older and unmaintained — verify last publish date before use. **Capacitor Community** and **React Native** ecosystems are more active for BLE, NFC, and camera-based scanning.

---

## 15. Expo equivalents

Many teams use **Expo** on top of React Native. Expo provides **managed modules** that mirror community packages with easier setup:

| Need | Bare RN (npm) | Expo module |
|------|---------------|-------------|
| Camera | `react-native-image-picker` | `expo-camera`, `expo-image-picker` |
| Location | `@react-native-community/geolocation` | `expo-location` |
| File system | `react-native-fs` | `expo-file-system` |
| Notifications | RN Firebase + Notifee | `expo-notifications` |
| Secure store | `react-native-keychain` | `expo-secure-store` |
| Haptics | `react-native-haptic-feedback` | `expo-haptics` |
| Clipboard | `@react-native-clipboard/clipboard` | `expo-clipboard` |
| SQLite | `op-sqlite` | `expo-sqlite` |

**Compared to Capacitor:** Expo’s model is closer to Capacitor’s “batteries included” official plugins — consistent API, documented config — but targets **native UI apps**, not WebView hybrid apps.

**Expo vs bare workflow:** If a library requires custom native code not in Expo’s module set, you **eject** or use **Expo dev client** — similar to adding a Cordova plugin that needs manual `config.xml` edits.

---

## 16. Choosing the right stack

| Scenario | Prefer |
|----------|--------|
| Share web codebase with existing Angular/React web app | **Capacitor / Ionic** |
| PWA + app store presence from one web app | **Capacitor** |
| Heavy animations, maps, camera, 60fps lists | **React Native** |
| Need one official plugin per feature, minimal native tinkering | **Capacitor** (hybrid) or **Expo** (RN) |
| Mature npm ecosystem for a specific native SDK | **React Native** (usually more options) |
| Legacy enterprise app on Cordova | Migrate toward **Capacitor** first; RN is a larger rewrite |

### Install & maintenance burden

| Task | Capacitor | React Native (bare) |
|------|-----------|---------------------|
| Add a device feature | `npm i` + `cap sync` | `npm i` + pods + rebuild; read linking docs |
| Upgrade iOS/Android SDK | Ionic + Capacitor CLI guides | React Native upgrade helper + per-library compatibility |
| Debug native bridge | Safari Web Inspector (iOS WebView) | Flipper, React Native DevTools, Xcode / Android Studio |

---

## 17. Migration cheat sheet

When porting from Capacitor to React Native, map imports feature by feature:

```typescript
// BEFORE (Capacitor)
import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { PushNotifications } from '@capacitor/push-notifications';

// AFTER (React Native)
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { Share } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
```

| Capacitor import | React Native replacement |
|------------------|-------------------------|
| `@capacitor/preferences` | `@react-native-async-storage/async-storage` or `react-native-mmkv` |
| `@capacitor/camera` | `react-native-image-picker` or `expo-image-picker` |
| `@capacitor/filesystem` | `react-native-fs` or `expo-file-system` |
| `@capacitor/geolocation` | `@react-native-community/geolocation` or `expo-location` |
| `@capacitor/share` | `Share` (built-in) |
| `@capacitor/haptics` | `react-native-haptic-feedback` or `expo-haptics` |
| `@capacitor/push-notifications` | `@react-native-firebase/messaging` + `@notifee/react-native` |
| `@capacitor/local-notifications` | `@notifee/react-native` |
| `@capacitor/browser` | `react-native-inappbrowser-reborn` |
| `@capacitor/clipboard` | `@react-native-clipboard/clipboard` |
| `@capacitor/network` | `@react-native-community/netinfo` |
| `@capacitor/device` | `react-native-device-info` |
| `@capacitor/status-bar` | `StatusBar` (built-in) |
| `@capacitor/splash-screen` | `react-native-bootsplash` |
| `@capacitor/app` (lifecycle / URL) | `AppState`, `Linking` (built-in) |
| `@capacitor/keyboard` | `Keyboard` (built-in) + optional `react-native-keyboard-controller` |

---

## Official resources

- **React Native Directory** (search libraries by category): https://reactnative.directory/
- **Capacitor plugins**: https://capacitorjs.com/docs/plugins
- **Capacitor Community plugins**: https://github.com/capacitor-community
- **Cordova plugin search**: https://cordova.apache.org/plugins/
- **Expo modules**: https://docs.expo.dev/versions/latest/
- **Awesome React Native**: https://github.com/jondot/awesome-react-native

---

## Related docs in this repo

- [`react-native-for-ionic-developers.md`](./react-native-for-ionic-developers.md) — full migration guide with code comparisons
- [`react-native-roadmap-junior-to-senior.md`](./react-native-roadmap-junior-to-senior.md) — learning roadmap including libraries by level
- [`../react.js/mobile-developer-services-guide.md`](../react.js/mobile-developer-services-guide.md) — BaaS, analytics, and tooling for mobile developers
