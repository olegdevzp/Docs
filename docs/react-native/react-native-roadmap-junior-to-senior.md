# React Native — Junior to Senior Roadmap

A learning roadmap of **React Native** concepts, APIs, and practices organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the docs.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Environment setup](#l1-environment-setup)
  - [Core components](#l1-core-components)
  - [Styling and Flexbox](#l1-styling-and-flexbox)
  - [User interaction](#l1-user-interaction)
  - [Navigation basics](#l1-navigation-basics)
  - [State and lifecycle](#l1-state-and-lifecycle)
  - [Networking basics](#l1-networking-basics)
  - [Debugging basics](#l1-debugging-basics)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Advanced components](#l2-advanced-components)
  - [Navigation — intermediate](#l2-navigation--intermediate)
  - [State management](#l2-state-management)
  - [Data persistence](#l2-data-persistence)
  - [Networking — intermediate](#l2-networking--intermediate)
  - [Device APIs and permissions](#l2-device-apis-and-permissions)
  - [Animations](#l2-animations)
  - [Platform-specific code](#l2-platform-specific-code)
  - [Performance basics](#l2-performance-basics)
  - [Testing](#l2-testing)
- [Level 3 — Senior](#level-3--senior)
  - [New Architecture](#l3-new-architecture)
  - [Native modules and JSI](#l3-native-modules-and-jsi)
  - [Performance profiling and optimization](#l3-performance-profiling-and-optimization)
  - [Security](#l3-security)
  - [Accessibility](#l3-accessibility)
  - [CI/CD and release management](#l3-cicd-and-release-management)
  - [OTA updates and CodePush](#l3-ota-updates-and-codepush)
  - [Monorepo and code sharing](#l3-monorepo-and-code-sharing)
  - [Advanced TypeScript patterns](#l3-advanced-typescript-patterns)
  - [Architecture and scalability](#l3-architecture-and-scalability)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each section lists what to know, why it matters, and a gotcha where relevant.
- Items marked with `*` are the most commonly used in day-to-day work.
- Framework-specific alternatives (Flutter, Capacitor, NativeScript) are excluded — see separate guides for those.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing a single component.

| Term | What it is |
|---|---|
| **React Native** | A framework that lets you build iOS and Android apps using React and JavaScript. It renders to real native UI components, not a WebView. |
| **Bridge** | The (old) communication layer between the JavaScript thread and the native thread. Replaced by JSI in the New Architecture. |
| **Metro** | The JavaScript bundler used by React Native (similar to webpack). It watches files and serves the JS bundle to the device. |
| **Hermes** | A lightweight JavaScript engine optimized for React Native. Faster startup and lower memory than V8/JavaScriptCore. |
| **Expo** | A platform and set of tools built on top of React Native that simplifies setup, builds, and device APIs. |
| **Expo Go** | A pre-built app you install on a device to run Expo projects instantly without compiling native code. |
| **EAS (Expo Application Services)** | Cloud build and submission service from Expo — replaces manual Xcode/Gradle builds. |
| **RCT / RN CLI** | The official React Native CLI for projects that need full native access (`npx react-native init`). |
| **JavaScriptCore (JSC)** | The JS engine used on iOS (and Android before Hermes). |
| **Bundle** | The compiled JS file (usually `index.bundle`) loaded by the native runtime on the device. |
| **Hot Reload / Fast Refresh** | Automatically applies code changes to the running app without a full restart. |
| **Native thread** | The thread responsible for rendering UI and handling gestures — runs separately from JS. |
| **JS thread** | Where your React and application logic runs. |

> **Gotcha:** React Native does not use the DOM. There are no `div`, `span`, or CSS files. Every UI primitive maps to a native component (`<View>` → `UIView`/`android.view.View`, `<Text>` → `UILabel`/`TextView`).

---

### L1 Environment setup

| Tool / Step | Purpose |
|---|---|
| **Node.js (LTS)** | Runtime for Metro and CLI tools. * |
| **Watchman** | File watcher used by Metro for fast reloads (macOS/Linux). * |
| **Android Studio + SDK** | Required to build and run Android apps (emulator, adb, Gradle). * |
| **Xcode** | Required to build and run iOS apps (simulator, code signing). macOS only. * |
| **CocoaPods** | iOS dependency manager. Run `pod install` after adding native packages. * |
| **JDK 17** | Required by Gradle for Android builds. |
| **Expo CLI** | `npm install -g expo-cli` — scaffold and run Expo projects. |
| **RN CLI** | `npx react-native init` — scaffold bare React Native projects. |

```bash
# Expo (recommended for beginners)
npx create-expo-app MyApp
cd MyApp && npx expo start

# Bare React Native
npx react-native@latest init MyApp
cd MyApp
npx react-native run-android   # or run-ios
```

> **Gotcha:** On macOS you need Xcode Command Line Tools installed (`xcode-select --install`) before anything iOS-related works. On Windows, iOS builds are impossible — you need a Mac or a cloud build service.

---

### L1 Core components

| Component | What it does |
|---|---|
| `<View>` | The basic layout container. Equivalent to a `div`. * |
| `<Text>` | Displays text. All text must be inside `<Text>`. * |
| `<Image>` | Renders images from local or remote sources. * |
| `<TextInput>` | Text input field. * |
| `<ScrollView>` | Scrollable container. Renders all children at once — use for short lists. * |
| `<FlatList>` | Virtualized list — only renders visible items. Use for long lists. * |
| `<SectionList>` | Like `FlatList` but with section headers. |
| `<TouchableOpacity>` | Pressable wrapper with opacity feedback. * |
| `<Pressable>` | More flexible pressable with fine-grained state (pressed, hovered). * |
| `<Button>` | Simple native button — limited styling. Use `TouchableOpacity` for custom design. |
| `<Modal>` | Renders content over the current screen. |
| `<ActivityIndicator>` | Spinning loading indicator. * |
| `<StatusBar>` | Controls the device status bar (color, visibility, style). |
| `<SafeAreaView>` | Respects notches, home indicators, and system insets. Always wrap root screens. * |

```tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

const items = [{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }];

export default function List() {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

> **Gotcha:** `ScrollView` renders every child immediately. On lists with 100+ items this causes severe performance issues. Always prefer `FlatList` for lists of unknown length.

---

### L1 Styling and Flexbox

React Native uses a subset of CSS properties via JavaScript objects. No stylesheets, no class names.

| Concept | Notes |
|---|---|
| `StyleSheet.create({})` | Validates styles at dev time and optimizes at runtime. Always prefer over inline objects. * |
| `style` prop | Accepts a style object, a `StyleSheet` reference, or an array of both. * |
| **Flexbox** | The only layout system in React Native. Default `flexDirection` is `column` (unlike web where it's `row`). * |
| `flex: 1` | Makes a component fill available space in the flex direction. * |
| `alignItems` | Aligns children on the cross axis. |
| `justifyContent` | Aligns children on the main axis. |
| `padding` / `margin` | No shorthand `10px 20px` — use `paddingHorizontal`, `paddingVertical`, etc. |
| `width` / `height` | Numbers are density-independent pixels (dp), not CSS pixels. |
| `%` sizes | Percentages are supported for `width` and `height`. |
| `Platform.select()` | Apply different styles per platform. |

```tsx
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,       // Android shadow
  },
});
```

> **Gotcha:** `shadow*` props work on iOS only. On Android you need `elevation`. Use a library like `react-native-shadow-2` for cross-platform shadows.

---

### L1 User interaction

| API / Component | What it does |
|---|---|
| `onPress` | Basic tap handler on `TouchableOpacity`, `Pressable`, `Button`. * |
| `onChangeText` | Fires on every keystroke in `TextInput`. * |
| `onSubmitEditing` | Fires when the user presses the keyboard "return" key. |
| `onBlur` / `onFocus` | TextInput focus events. |
| `onScroll` | Fires as the user scrolls a `ScrollView` or `FlatList`. |
| `onEndReached` | `FlatList` prop — fires when the user scrolls near the end (pagination). * |
| `onRefresh` / `refreshing` | Pull-to-refresh in `FlatList`. |
| `Keyboard.dismiss()` | Programmatically close the keyboard. * |
| `KeyboardAvoidingView` | Adjusts layout when keyboard appears so inputs stay visible. * |

```tsx
import { TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  <TextInput
    placeholder="Search..."
    onChangeText={(text) => setQuery(text)}
    onSubmitEditing={Keyboard.dismiss}
    returnKeyType="search"
  />
</KeyboardAvoidingView>
```

---

### L1 Navigation basics

The standard navigation library is **React Navigation** (`@react-navigation/native`).

| Concept | What it does |
|---|---|
| `NavigationContainer` | Root wrapper that manages navigation state. Must wrap the entire app. * |
| `createNativeStackNavigator` | Stack-based navigation (push/pop screens). * |
| `createBottomTabNavigator` | Bottom tab bar navigation. * |
| `navigation.navigate('ScreenName')` | Navigate to a screen. * |
| `navigation.goBack()` | Go back to the previous screen. * |
| `route.params` | Access params passed to the current screen. * |
| `navigation.setOptions({})` | Dynamically set header title, buttons, etc. |

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Navigate and pass params
navigation.navigate('Detail', { id: 42 });

// Read params
const { id } = route.params;
```

> **Gotcha:** Every screen that needs navigation access must either receive `navigation` and `route` as props (automatic when registered in a navigator) or use `useNavigation()` and `useRoute()` hooks.

---

### L1 State and lifecycle

React Native uses standard React hooks — nothing platform-specific here.

| Hook / Pattern | Use case |
|---|---|
| `useState` | Local component state. * |
| `useEffect` | Side effects — fetch on mount, subscriptions, cleanup. * |
| `useRef` | Reference to a component instance or mutable value without re-render. * |
| `useCallback` | Memoize a function reference — important for `FlatList` `renderItem`. |
| `useMemo` | Memoize a computed value. |
| `useContext` | Consume a React context value. |
| `AppState` | Detect when the app moves to background, foreground, or inactive state. |
| `useAppState` (community hook) | Wrapper around `AppState` with cleaner API. |

```tsx
import { AppState } from 'react-native';
import { useEffect, useRef } from 'react';

const appState = useRef(AppState.currentState);

useEffect(() => {
  const sub = AppState.addEventListener('change', (next) => {
    if (appState.current.match(/inactive|background/) && next === 'active') {
      // app came to foreground — refresh data
    }
    appState.current = next;
  });
  return () => sub.remove();
}, []);
```

---

### L1 Networking basics

| API | Notes |
|---|---|
| `fetch` | Built-in. Works exactly as on the web. * |
| `async/await` | Preferred over `.then()` chains for readability. * |
| `AbortController` | Cancel in-flight requests (e.g., when a component unmounts). |
| `axios` | Third-party library with interceptors, automatic JSON parsing, and better error handling. |

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      const res = await fetch('https://api.example.com/data', {
        signal: controller.signal,
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e);
    }
  }

  load();
  return () => controller.abort();
}, []);
```

> **Gotcha:** On Android, `http://` requests are blocked by default (cleartext traffic policy). Use `https://` or configure `android:usesCleartextTraffic="true"` in `AndroidManifest.xml` for dev environments only.

---

### L1 Debugging basics

| Tool | Purpose |
|---|---|
| **Fast Refresh** | Auto-applies JS changes without restarting the app. * |
| **Shake gesture / Cmd+D (iOS) / Cmd+M (Android)** | Opens the in-app developer menu. * |
| `console.log` | Logs to Metro terminal and browser DevTools. * |
| **React DevTools** | Inspect component tree, props, and state. `npx react-devtools`. * |
| **Flipper** | Desktop debugger — network inspector, crash reporter, layout inspector. |
| **Expo DevTools** | Web-based dashboard for Expo projects with QR code, logs, and device controls. |
| `__DEV__` | Boolean — `true` in development, `false` in production builds. Use to guard debug-only code. |

---

## Level 2 — Mid-level

### L2 Advanced components

| Component / API | What it does |
|---|---|
| `FlatList` — `getItemLayout` | Pre-calculate item height for instant scroll-to-index. Required for `scrollToIndex` to work. |
| `FlatList` — `windowSize` | Controls how many screens worth of items are rendered above/below the viewport. |
| `FlatList` — `initialNumToRender` | Items rendered on the first paint — keep low to speed up initial render. |
| `SectionList` | Grouped list with sticky section headers. |
| `VirtualizedList` | The base virtualized list — use when data is not a plain array. |
| `Animated.FlatList` | FlatList wrapped in Animated for scroll-driven animations. |
| `InteractionManager.runAfterInteractions` | Defer expensive work until after animations/transitions finish. |
| `useWindowDimensions` | Reactive hook for screen width/height — rerenders on orientation change. * |
| `Dimensions` | Static API for screen/window dimensions. Prefer `useWindowDimensions` in components. |

```tsx
// Defer heavy computation until after screen transition
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    fetchHeavyData();
  });
  return () => task.cancel();
}, []);
```

---

### L2 Navigation — intermediate

| Concept | Notes |
|---|---|
| **Nested navigators** | A tab navigator with a stack inside each tab. Manage `initialRouteName` carefully to avoid stale screens. * |
| **Deep linking** | Map a URL scheme (`myapp://detail/42`) or universal link (`https://example.com/detail/42`) to a screen. * |
| `Linking.addEventListener` | React to incoming links when the app is already open. |
| **Navigation state persistence** | Save and restore nav state across app restarts. |
| `createDrawerNavigator` | Side-drawer navigation. |
| `navigation.replace` | Replace current screen (no back button). |
| `navigation.reset` | Reset the entire navigation state (useful after login/logout). * |
| `useFocusEffect` | Run an effect every time the screen gains focus (not just on mount). * |
| `useIsFocused` | Boolean — true when the screen is currently active. |
| `screenOptions` | Apply options to every screen in a navigator at once. |
| **Header customization** | `headerRight`, `headerLeft`, `headerBackground` in `screenOptions`. |

```tsx
// Reset nav stack after logout
navigation.reset({
  index: 0,
  routes: [{ name: 'Login' }],
});

// Re-fetch when screen comes back into focus
useFocusEffect(
  useCallback(() => {
    fetchProfile();
  }, [])
);
```

---

### L2 State management

| Library / Pattern | When to use |
|---|---|
| **useState + useContext** | Small to medium apps, shared state for a subtree (theme, auth user). * |
| **Zustand** | Simple global state without boilerplate. Preferred for most mid-size apps. * |
| **Redux Toolkit (RTK)** | Large teams, complex state with many slices and RTK Query for data fetching. |
| **Jotai** | Atomic state — good fit when different parts of the UI subscribe to fine-grained slices. |
| **React Query / TanStack Query** | Server state management — caching, background refetching, optimistic updates. * |

```tsx
// Zustand store
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// In a component
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);
```

> **Gotcha:** React Query and Zustand solve different problems — React Query manages *server* state (async, stale), Zustand manages *client* state (synchronous, local). Use both together, not one instead of the other.

---

### L2 Data persistence

| Library / API | What it stores |
|---|---|
| `@react-native-async-storage/async-storage` | Key-value string store. Async, cross-platform. Use for settings, tokens, small blobs. * |
| **MMKV** (`react-native-mmkv`) | Same concept as AsyncStorage but synchronous and 30× faster. Preferred for auth tokens and frequent reads. * |
| **SQLite** (`expo-sqlite` / `op-sqlite`) | Relational data. Use for large structured datasets — offline-first apps, local search. |
| **Realm** | Object database with real-time sync via Atlas. Good for complex offline-first apps. |
| **WatermelonDB** | High-performance lazy database built on SQLite — used in apps with thousands of records. |
| **Expo SecureStore** | Encrypted key-value store backed by Keychain (iOS) and Keystore (Android). Use for sensitive data. * |

```tsx
import * as SecureStore from 'expo-secure-store';

// Store
await SecureStore.setItemAsync('authToken', token);

// Read
const token = await SecureStore.getItemAsync('authToken');

// Delete
await SecureStore.deleteItemAsync('authToken');
```

> **Gotcha:** `AsyncStorage` has no encryption. Never store auth tokens, passwords, or PII in it. Use `expo-secure-store` or MMKV with encryption enabled.

---

### L2 Networking — intermediate

| Library / Pattern | Notes |
|---|---|
| **axios** | Interceptors for auth headers, refresh token logic, global error handling. * |
| **TanStack Query** | `useQuery`, `useMutation`, `useInfiniteQuery` — handles loading, error, caching, and refetch. * |
| **WebSocket** | `new WebSocket('wss://...')` — real-time bidirectional communication. |
| **EventSource / SSE** | Not natively supported — use `react-native-sse` or a polyfill. |
| Pagination | Implement with `FlatList` `onEndReached` + `useInfiniteQuery`. |
| Offline support | Detect with `@react-native-community/netinfo`, queue mutations with React Query. |

```tsx
import { useQuery } from '@tanstack/react-query';

function Profile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getProfile(userId),
    staleTime: 5 * 60 * 1000,   // 5 minutes
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading profile</Text>;
  return <Text>{data.name}</Text>;
}
```

---

### L2 Device APIs and permissions

| Library / API | What it accesses |
|---|---|
| `expo-camera` | Camera preview, photo capture, QR scanning. |
| `expo-image-picker` | Photo/video picker from camera roll or camera. * |
| `expo-location` | GPS coordinates, geofencing, background location. |
| `expo-notifications` | Local and push notifications (via APNs / FCM). * |
| `expo-media-library` | Read/write device photo library. |
| `expo-sensors` | Accelerometer, gyroscope, barometer. |
| `expo-haptics` | Haptic feedback (vibration patterns). |
| `expo-clipboard` | Read/write clipboard. |
| `@react-native-community/netinfo` | Network connectivity status (wifi, cellular, offline). * |
| **Permissions** | Must request at runtime on both platforms. Use `expo-permissions` or module-specific `requestPermissionsAsync()`. * |

```tsx
import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied');
    return;
  }
  const loc = await Location.getCurrentPositionAsync({});
  console.log(loc.coords.latitude, loc.coords.longitude);
}
```

> **Gotcha:** iOS requires a privacy usage description in `Info.plist` for every sensitive API (camera, location, contacts, etc.). Without it the app crashes on access. Expo's config plugins handle this automatically.

---

### L2 Animations

| API / Library | When to use |
|---|---|
| `Animated` (core) | Basic animations — opacity, translateX/Y, scale. Good for simple, one-off animations. * |
| `Animated.timing` | Animate to a value over time with an easing function. * |
| `Animated.spring` | Physics-based spring animation. |
| `Animated.sequence` / `Animated.parallel` | Chain or run animations together. |
| `LayoutAnimation` | Animate layout changes automatically (add/remove items). Simple but less control. |
| **Reanimated 3** (`react-native-reanimated`) | Runs animations on the UI thread — no bridge jank. Required for gesture-driven and complex animations. * |
| **Gesture Handler** (`react-native-gesture-handler`) | Smooth swipe, pan, pinch gestures that run on the native thread. * |
| **Moti** | Declarative animation library built on Reanimated. Simple API for common patterns. |

```tsx
// Reanimated 3 — fade in
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 400 });
}, []);

const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

return <Animated.View style={[styles.box, style]} />;
```

> **Gotcha:** The original `Animated` API runs on the JS thread. Any JS work (state updates, re-renders) can stall or drop frames mid-animation. For any gesture-driven or 60+ fps animation, use Reanimated.

---

### L2 Platform-specific code

| Pattern | When to use |
|---|---|
| `Platform.OS === 'ios'` | Simple one-liner conditional. * |
| `Platform.select({ ios: ..., android: ... })` | Pick a value based on platform inside a style or config. * |
| `Platform.Version` | Check the OS version number for feature availability. |
| **File extensions** | `Component.ios.tsx` and `Component.android.tsx` — Metro picks the right file automatically. Use for large platform differences. |
| `Platform.isPad` | Detect iPad specifically. |
| `Platform.isTV` | Detect tvOS / Android TV. |

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.select({ ios: 50, android: 24 }),
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
});
```

---

### L2 Performance basics

| Practice | Why it matters |
|---|---|
| `React.memo` | Prevents re-render of a component when its props haven't changed. * |
| `useCallback` on `renderItem` | Stable function reference so `FlatList` doesn't re-render all items on every parent render. * |
| `keyExtractor` | Stable unique key — avoid using array index. * |
| Avoid anonymous functions in JSX | Creates a new reference on every render; causes unnecessary re-renders of children. |
| `removeClippedSubviews` | `FlatList` prop — unmounts items outside the viewport on Android (use with caution on iOS). |
| Lazy imports | `React.lazy` + `Suspense` for heavy screens, or `import()` in route config. |
| Image optimization | Use `expo-image` instead of `<Image>` — it has caching, blurhash placeholders, and faster decode. * |
| Avoid large state in context | Splitting contexts prevents unrelated consumers from re-rendering. |

---

### L2 Testing

| Tool | What it tests |
|---|---|
| **Jest** | Unit tests, snapshot tests, mocking. Pre-configured in Expo and RN CLI projects. * |
| **React Native Testing Library (RNTL)** | Component and integration tests — query by role, text, testID. * |
| `jest.mock(...)` | Mock native modules (camera, location, etc.) that can't run in Node.js. * |
| **Detox** | End-to-end tests running on a real simulator/device. |
| **Maestro** | YAML-based E2E testing — simpler setup than Detox. |

```tsx
// RNTL example
import { render, fireEvent, screen } from '@testing-library/react-native';
import Counter from './Counter';

test('increments count on press', () => {
  render(<Counter />);
  fireEvent.press(screen.getByText('+'));
  expect(screen.getByText('1')).toBeTruthy();
});
```

---

## Level 3 — Senior

### L3 New Architecture

The New Architecture (stable since RN 0.74) replaces the async Bridge with synchronous JSI and TurboModules.

| Concept | What it is |
|---|---|
| **JSI (JavaScript Interface)** | C++ layer that lets JS call native functions synchronously without serialization. |
| **TurboModules** | Lazy-loaded native modules using JSI. Faster startup, type-safe via CodeGen. |
| **Fabric** | New rendering system — synchronous, concurrent-aware, removes shadow thread. |
| **Codegen** | Auto-generates C++/Java/ObjC glue code from TypeScript type definitions (`NativeModule` spec). |
| **Concurrent React** | React 18 features (Suspense, transitions, `useTransition`) now work correctly with Fabric. |
| **Bridgeless mode** | Fully removes the legacy bridge (opt-in). Required for the full New Architecture benefit. |
| `interopLayer` | Compatibility layer that lets old (bridge-based) libraries work alongside TurboModules during migration. |

> **Gotcha:** Many community libraries still don't support the New Architecture. Before upgrading, audit all dependencies with the [React Native Directory](https://reactnative.directory/) "New Architecture" filter.

---

### L3 Native modules and JSI

| Concept | When needed |
|---|---|
| **TurboModule (New Arch)** | The modern way to write native code callable from JS. Define a TypeScript spec, implement in Swift/Kotlin, Codegen generates the glue. |
| **Legacy NativeModule (Old Arch)** | `RCTBridgeModule` (iOS) / `ReactContextBaseJavaModule` (Android). Still works with the interop layer. |
| **Native Component (Fabric)** | Custom native UI component rendered via Fabric — use for advanced UI not possible in JS. |
| **Nitro Modules** | Third-party alternative to TurboModules with zero-overhead JSI bindings. Used by libraries like `react-native-mmkv`. |
| **ExpoModules API** | Expo's abstraction for writing native modules that work on iOS, Android, and web with one API. Recommended for Expo projects. |
| **React Native Worklets** | Run JS functions on a separate background thread via JSI (used by Reanimated internals). |

```kotlin
// Android TurboModule (Kotlin)
class NativeToastModule(reactContext: ReactApplicationContext) :
    NativeToastModuleSpec(reactContext) {

  override fun show(message: String, duration: Double) {
    Toast.makeText(reactContext, message, Toast.LENGTH_SHORT).show()
  }
}
```

---

### L3 Performance profiling and optimization

| Tool / Technique | What it measures |
|---|---|
| **Flipper — Performance** | JS and UI frame rates, native method calls. |
| **React DevTools Profiler** | Component render time, wasted renders. * |
| **Systrace** | Android-level trace of all threads (JS, UI, render). Captured via `adb`. |
| **Instruments (Xcode)** | iOS-level CPU, memory, GPU profiling. |
| **Hermes Sampling Profiler** | JS-level CPU flame graph. Enable in Flipper → Hermes debugger. |
| `why-did-you-render` | Library that logs unnecessary re-renders in development. |
| **RAM Bundles + Inline Requires** | Load JS modules only when first accessed — reduces TTI on large apps. |
| **Hermes bytecode** | Hermes pre-compiles JS to bytecode at build time — faster startup, no JIT warm-up needed. |
| Memory leaks | Profile with Instruments (iOS) or Android Studio Memory Profiler. Common sources: unremoved event listeners, closures holding large objects. |

**FlatList optimization checklist:**
- Set `getItemLayout` if item heights are fixed.
- Use `React.memo` on the `renderItem` component.
- Pass `keyExtractor` returning stable unique IDs.
- Set `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `windowSize` based on item complexity.
- Avoid in-line arrow functions for `renderItem` and `keyExtractor`.

---

### L3 Security

| Practice | Why |
|---|---|
| **Secure storage for tokens** | Use `expo-secure-store` (Keychain/Keystore) — never AsyncStorage. * |
| **Certificate pinning** | Reject TLS certificates not matching your server's fingerprint. Prevents MITM attacks. Use `react-native-ssl-pinning`. |
| **Obfuscation / minification** | Hermes + Metro minification makes reverse engineering harder, but JS source is still extractable from the bundle. |
| **Avoid storing secrets in source** | API keys baked into the bundle are extractable. Use a backend proxy or signed short-lived tokens. |
| **Root / jailbreak detection** | Use `react-native-device-info` (`isRooted`, `isEmulator`) to limit access on compromised devices. |
| **Deep link validation** | Validate every param received via deep links — treat them as untrusted external input. |
| **Disable log in production** | Override `console.log` to a no-op in production or use a logging library that respects `__DEV__`. |
| **Network security config** | Lock down `android:networkSecurityConfig` in Android to enforce HTTPS only. |
| **Code signing** | Ensure your release builds are signed with the correct production certificates and provisioning profiles. |

---

### L3 Accessibility

| API / Practice | Notes |
|---|---|
| `accessible` prop | Marks a component as an accessibility element (groups children for screen readers). |
| `accessibilityLabel` | Text read aloud by VoiceOver (iOS) / TalkBack (Android) when the element is focused. * |
| `accessibilityHint` | Describes the result of performing the action on the element. |
| `accessibilityRole` | Semantic role: `button`, `link`, `header`, `image`, `checkbox`, etc. * |
| `accessibilityState` | Communicates state: `{ checked, disabled, selected, busy, expanded }`. |
| `accessibilityValue` | Numeric or text value for sliders, progress bars. |
| `importantForAccessibility` | Android only — `'no-hide-descendants'` hides an entire subtree from TalkBack. |
| `AccessibilityInfo` | Query screen reader state, announce strings, set focus. |
| **Minimum touch target** | Apple and Google guidelines recommend at least 44×44pt / 48×48dp. |
| **Color contrast** | WCAG AA requires 4.5:1 for normal text, 3:1 for large text. |
| **Testing** | VoiceOver (iOS): Cmd+F5 in Simulator. TalkBack (Android): Settings → Accessibility. |

```tsx
<TouchableOpacity
  accessible
  accessibilityRole="button"
  accessibilityLabel="Add to cart"
  accessibilityHint="Adds the selected item to your shopping cart"
  onPress={addToCart}
>
  <Text>+</Text>
</TouchableOpacity>
```

---

### L3 CI/CD and release management

| Tool / Concept | Purpose |
|---|---|
| **EAS Build** | Cloud builds for iOS and Android without needing a Mac in CI. * |
| **EAS Submit** | Automates uploading builds to App Store Connect and Google Play. * |
| **EAS Update** | OTA JS updates (see next section). |
| **Fastlane** | Ruby-based automation — screenshots, signing, TestFlight/Play Store upload. Common in bare RN projects. |
| **GitHub Actions / Bitrise / CircleCI** | Run tests, lint, and trigger EAS Build on push. |
| **Code signing** | iOS: Distribution certificate + provisioning profile. Android: keystore `.jks`. Never commit these to git. * |
| **Environment configs** | Use `app.config.js` (Expo) or `.env` + `react-native-config` to switch API URLs, feature flags, and keys per environment. |
| **Semantic versioning** | `version` (human-readable) and `buildNumber` / `versionCode` (auto-incremented integer). |
| **TestFlight / Firebase App Distribution** | Distribute beta builds to testers before production release. |

```yaml
# .github/workflows/build.yml (simplified)
- name: Build iOS
  run: eas build --platform ios --non-interactive
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

### L3 OTA updates and CodePush

| Tool | Notes |
|---|---|
| **EAS Update** | Expo's OTA update service. Publishes a new JS bundle + assets to a channel; devices fetch it silently. * |
| **CodePush** (App Center) | Microsoft's OTA service. Works with bare React Native. Being deprecated in favor of EAS Update / custom solutions. |
| **expo-updates** | The client-side library that checks for and applies EAS updates. |
| **Update policies** | `UpdatesConfig` controls `checkOnLaunch`, `fallbackToCacheTimeout`, manual `checkForUpdateAsync()`. |
| **Channels** | Map branches (`production`, `staging`, `preview`) to different update channels. |
| **Limitations** | OTA updates can only change JS and assets. Native code changes (new permissions, native modules) always require a full app store release. * |
| **Rollbacks** | EAS Update supports promoting and rolling back to a previous publication. |

```tsx
import * as Updates from 'expo-updates';

async function checkForUpdate() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();  // restart app with new bundle
  }
}
```

> **Gotcha:** App stores (especially Apple) have strict rules about what OTA updates can change. JS-only changes are allowed; changing core functionality or native behavior requires going through review.

---

### L3 Monorepo and code sharing

| Tool / Pattern | Use case |
|---|---|
| **Turborepo** | Monorepo task runner with caching — runs builds, tests, lint in parallel. * |
| **pnpm workspaces** | Efficient shared `node_modules` across packages in a monorepo. |
| **Yarn workspaces** | Alternative to pnpm, commonly used with Expo monorepos. |
| **Shared packages** | Extract business logic, API clients, and types into a shared package consumed by the RN app and a web app. |
| **React Native Web** | Run RN components in the browser — share code across web and native. |
| **Expo Router** | File-based routing that works on iOS, Android, and Web from a single codebase. |
| **Metro config for monorepo** | Configure `watchFolders` and `resolver.nodeModulesPaths` to resolve cross-package dependencies. |

```js
// metro.config.js for monorepo
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const monorepoRoot = path.resolve(__dirname, '../..');

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

---

### L3 Advanced TypeScript patterns

| Pattern | Use case |
|---|---|
| **Typed navigation** | Define a `RootStackParamList` type map and pass it to navigators for fully type-safe `navigation.navigate()`. * |
| **Typed stores** | Zustand with `create<State>()(...)` for fully inferred state and actions. |
| **Branded types** | `type UserId = string & { _brand: 'UserId' }` — prevent accidentally mixing IDs of different entities. |
| **Discriminated unions** | Model loading states: `{ status: 'idle' } | { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: Error }`. |
| **Generic components** | `FlatList<T>`, typed `renderItem`, typed `keyExtractor`. |
| **Codegen types** | Native module specs defined in TypeScript, consumed by Codegen to produce native type-safe bindings. |
| **`satisfies` operator** | Validate an object against a type without widening it. Useful for navigation param maps. |

```tsx
// Typed navigation
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { section?: 'notifications' | 'privacy' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Type-safe navigate — TS will error on wrong screen name or missing params
navigation.navigate('Profile', { userId: '123' });
```

---

### L3 Architecture and scalability

| Pattern / Concept | When to apply |
|---|---|
| **Feature-sliced / module-based folder structure** | Organize by feature (`/features/auth`, `/features/profile`) rather than by type (`/components`, `/hooks`). Scales better in large teams. |
| **Repository pattern** | Abstract data sources (API, SQLite, MMKV) behind interfaces — swap implementations without touching business logic. |
| **Error boundaries** | Wrap feature screens in `<ErrorBoundary>` — prevents a crash in one feature from taking down the entire app. |
| **Crash reporting** | Integrate Sentry (`@sentry/react-native`) or Firebase Crashlytics. Capture JS and native crashes with stack traces. * |
| **Analytics** | Segment, Amplitude, Firebase Analytics — track screen views, events, user properties. Separate analytics calls from business logic. |
| **Feature flags** | Remote config (Firebase Remote Config, LaunchDarkly) to toggle features without a release. |
| **Schema-driven forms** | `react-hook-form` + Zod for validation — derive TypeScript types from the Zod schema. |
| **Offline-first architecture** | Optimistic UI updates + mutation queue + conflict resolution strategy. |
| **App modularization** | Split the app into independently buildable modules to reduce build times in very large projects. |

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| **Setup** | Expo Go, RN CLI init | Bare workflow, custom native config | Monorepo, EAS, CI/CD pipeline |
| **Components** | Core RN primitives | SectionList, VirtualizedList, Modal | Custom native components (Fabric) |
| **Styling** | StyleSheet, Flexbox | Platform.select, responsive layouts | Design tokens, theme system |
| **Navigation** | Stack + Tab basics | Nested nav, deep linking, useFocusEffect | Typed navigation, complex flows |
| **State** | useState, useEffect | Zustand, Context, React Query | Optimistic updates, offline-first |
| **Persistence** | AsyncStorage | MMKV, SQLite, SecureStore | Encrypted DB, conflict resolution |
| **Networking** | fetch, axios basics | TanStack Query, pagination, WebSocket | Certificate pinning, offline queue |
| **Animations** | Animated (core) | Reanimated 3, Gesture Handler | Worklets, custom gesture recognizers |
| **Testing** | Jest basics | RNTL, mocks | Detox / Maestro E2E, coverage gates |
| **Performance** | memo, keyExtractor | FlatList tuning, InteractionManager | Hermes profiler, RAM bundles, Systrace |
| **Native** | None | Expo modules (pre-built) | TurboModules, JSI, Codegen, Nitro |
| **Security** | HTTPS, no secrets in code | SecureStore, deep link validation | SSL pinning, root detection, obfuscation |
| **Accessibility** | accessibilityLabel | WCAG contrast, touch targets | Full screen reader support, AccessibilityInfo |
| **Releases** | Expo Go / manual | EAS Build basics | EAS Update, OTA strategy, Fastlane |
| **Architecture** | Single App.tsx | Feature folders, custom hooks | Repository pattern, error boundaries, feature flags |
