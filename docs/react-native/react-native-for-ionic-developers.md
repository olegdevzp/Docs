# React Native Comprehensive Guide for Ionic Developers

A complete guide to learning React Native, specifically designed for developers with Ionic/Angular/Capacitor experience. This guide covers React Native fundamentals, differences from Ionic, and practical examples with side-by-side comparisons.

---

## Table of Contents

1. [Introduction to React Native](#1-introduction-to-react-native)
2. [React Native vs Ionic: Key Differences](#2-react-native-vs-ionic-key-differences)
3. [Environment Setup](#3-environment-setup)
4. [Project Structure & Configuration](#4-project-structure--configuration)
5. [Core Components](#5-core-components)
6. [Styling in React Native](#6-styling-in-react-native)
7. [Layout with Flexbox](#7-layout-with-flexbox)
8. [Navigation](#8-navigation)
9. [State Management](#9-state-management)
10. [Native Modules & APIs](#10-native-modules--apis)
11. [Forms & User Input](#11-forms--user-input)
12. [Lists & ScrollViews](#12-lists--scrollviews)
13. [Images & Media](#13-images--media)
14. [Animations](#14-animations)
15. [Platform-Specific Code](#15-platform-specific-code)
16. [Native Device Features](#16-native-device-features)
17. [Networking & APIs](#17-networking--apis)
18. [Local Storage & Persistence](#18-local-storage--persistence)
19. [Performance Optimization](#19-performance-optimization)
20. [Testing](#20-testing)
21. [Debugging](#21-debugging)
22. [Third-Party Libraries](#22-third-party-libraries)
23. [Building & Deployment](#23-building--deployment)
24. [Migration Strategies](#24-migration-strategies)
25. [Best Practices](#25-best-practices)

---

## 1. Introduction to React Native

### 1.1 What is React Native and why should Ionic developers learn it?

**Answer:**

**Literal Definition:** React Native is an open-source mobile application framework created by Meta (Facebook) that enables developers to build truly native mobile applications using JavaScript and React. Unlike Ionic which renders web views, React Native renders actual native components, resulting in better performance and a more native look and feel.

**Key Characteristics:**
- **Native Rendering**: Uses real native components (not web views)
- **React-Based**: Built on React.js principles and patterns
- **Single Codebase**: Write once for iOS and Android (with platform-specific optimizations)
- **Hot Reloading**: Fast development with instant feedback
- **Native Performance**: Direct bridge to native APIs

**Why Ionic Developers Should Learn React Native:**

1. **True Native Performance**: Better performance for complex animations and interactions
2. **Native Look & Feel**: Automatic platform-specific styling (iOS and Android guidelines)
3. **Growing Ecosystem**: Large community, extensive libraries, backed by Meta
4. **Career Opportunities**: High demand for React Native developers
5. **React Skills**: Learn React which is valuable for web development too
6. **Access to Native APIs**: Easier access to native device features

**When to Choose React Native over Ionic:**
- Apps requiring high performance (games, complex animations)
- Apps needing native look and feel
- Apps with heavy native module integration
- When React is already your web framework

**When Ionic Might Be Better:**
- Web-first applications needing PWA support
- Teams with strong Angular/Vue experience
- Apps that need to share code with web apps
- Simpler apps where web views are sufficient

**Official Resources:**
- Documentation: https://reactnative.dev/
- GitHub: https://github.com/facebook/react-native

---

### 1.2 What are the main architectural differences between React Native and Ionic?

**Answer:**

**Literal Definitions:**
- **React Native Architecture**: Uses a JavaScript thread that communicates with native threads via a bridge. UI components are actual native views (UIView on iOS, View on Android), not web views.
- **Ionic Architecture**: Runs web technologies (HTML, CSS, JavaScript) inside a WebView container (Capacitor or Cordova), with plugins to access native features.

| Feature | Ionic (Capacitor) | React Native |
|---------|-------------------|--------------|
| **Rendering** | WebView (HTML/CSS) | Native Components |
| **UI Framework** | Web Components / Framework Components | React Components |
| **Styling** | CSS / SCSS | StyleSheet API (CSS-like) |
| **Performance** | Good (but limited by WebView) | Excellent (native rendering) |
| **Bundle Size** | Smaller | Larger |
| **Learning Curve** | Easier for web devs | Moderate (need to learn React) |
| **Platform Look** | Requires manual styling | Automatic platform adaptation |
| **Debugging** | Chrome DevTools | React DevTools + Native debuggers |
| **Hot Reload** | Browser refresh | Fast Refresh |

**Architecture Comparison:**

**Ionic:**
```
┌─────────────────────────┐
│   JavaScript Thread     │
│   (Angular/React/Vue)   │
├─────────────────────────┤
│      WebView            │
│   (HTML/CSS rendering)  │
├─────────────────────────┤
│   Capacitor/Cordova     │
│    (Plugin Bridge)      │
├─────────────────────────┤
│   Native Platform       │
│   (iOS/Android)         │
└─────────────────────────┘
```

**React Native:**
```
┌─────────────────────────┐
│   JavaScript Thread     │
│   (React Logic)         │
├─────────────────────────┤
│     Bridge/JSI          │
│ (Serialized Communication)│
├─────────────────────────┤
│   Native Thread         │
│ (Native UI Components)  │
├─────────────────────────┤
│   Native Platform       │
│   (iOS/Android)         │
└─────────────────────────┘
```

**Key Differences:**

1. **Component Rendering:**
   - Ionic: `<ion-button>` → Web component in WebView
   - React Native: `<Button>` → Native UIButton/android.widget.Button

2. **Styling Approach:**
   - Ionic: Standard CSS with variables
   - React Native: JavaScript StyleSheet objects

3. **Navigation:**
   - Ionic: Router-based (similar to web)
   - React Native: Stack-based with React Navigation

4. **Performance:**
   - Ionic: Limited by WebView performance
   - React Native: Near-native performance

---

### 1.3 How does React Native's component model compare to Ionic/Angular components?

**Answer:**

**Literal Definition:** React Native uses React's functional component model with hooks, where components are JavaScript functions that return JSX describing the native UI. Ionic components are web components that can be used with any framework (Angular, React, Vue), with framework-specific wrappers.

**Ionic (Angular):**
```typescript
// Ionic with Angular
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-card',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ user.name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        {{ user.email }}
      </ion-card-content>
      <ion-button (click)="onPress()">Contact</ion-button>
    </ion-card>
  `,
  styles: [`
    ion-card {
      margin: 16px;
    }
  `]
})
export class UserCardComponent {
  @Input() user: User;
  @Output() press = new EventEmitter<void>();
  
  onPress() {
    this.press.emit();
  }
}
```

**React Native:**
```tsx
// React Native
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface UserCardProps {
  user: {
    name: string;
    email: string;
  };
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{user.name}</Text>
      </View>
      <View style={styles.content}>
        <Text>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3880ff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserCard;
```

**Key Differences:**

1. **No Decorators**: React Native uses plain functions, no `@Component`, `@Input`, `@Output`
2. **Props Instead of Inputs**: Data passed as function parameters
3. **Callbacks Instead of Outputs**: Functions passed as props
4. **JSX Instead of Templates**: JavaScript expressions in return statement
5. **StyleSheet Instead of CSS**: JavaScript objects for styling
6. **No IonicModule**: Import components from `react-native`

**Migration Mapping:**
- `@Input() prop` → `props.prop`
- `@Output() event` → `onEvent` callback prop
- `ngOnInit()` → `useEffect(() => {}, [])`
- `*ngIf` → `{condition && <Component />}`
- `*ngFor` → `{array.map(item => <Component key={item.id} />)}`
- `[(ngModel)]` → `value` + `onChangeText` props

---

## 2. React Native vs Ionic: Key Differences

### 2.1 Performance: React Native vs Ionic

**Answer:**

**Literal Definition:** Performance in mobile apps refers to frame rates, responsiveness, memory usage, and startup time. React Native generally outperforms Ionic because it renders native components directly, while Ionic renders web content in a WebView which adds an abstraction layer.

**Performance Comparison:**

| Metric | Ionic | React Native |
|--------|-------|--------------|
| **UI Rendering** | 30-60 FPS | 60 FPS |
| **Animations** | Good (CSS) | Excellent (Native APIs) |
| **List Performance** | Virtual scrolling needed | FlatList optimized |
| **Startup Time** | ~2-4s | ~1-3s |
| **Memory Usage** | Higher (WebView overhead) | Lower (native views) |
| **Complex UI** | Can lag | Smooth |
| **JS Thread** | Shared with UI | Separate thread |

**When Performance Matters:**

**React Native Excels:**
```tsx
// Complex animations run smoothly
import { Animated } from 'react-native';

const MyComponent = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const startAnimation = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true, // Runs on native thread!
      tension: 40,
      friction: 7,
    }).start();
  };
  
  return (
    <Animated.View
      style={{
        transform: [{
          scale: animatedValue
        }]
      }}
    >
      {/* Content */}
    </Animated.View>
  );
};
```

**Ionic's Challenge:**
```typescript
// Ionic animation (runs in WebView)
import { Animation } from '@ionic/angular';

export class MyComponent {
  async startAnimation() {
    const animation = this.animationCtrl.create()
      .addElement(this.element)
      .duration(300)
      .fromTo('transform', 'scale(0)', 'scale(1)');
    
    await animation.play();
  }
}
```

**Performance Tips for React Native:**

1. **Use Native Driver for Animations:**
```tsx
Animated.timing(value, {
  toValue: 100,
  useNativeDriver: true, // Critical for 60 FPS
});
```

2. **Optimize Lists with FlatList:**
```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

3. **Memoization:**
```tsx
const MemoizedComponent = React.memo(({ item }) => (
  <View>
    <Text>{item.name}</Text>
  </View>
));
```

**When Ionic is Acceptable:**
- Simple CRUD apps
- Form-heavy applications
- Content-focused apps
- Apps with minimal animations

**Official Resources:**
- React Native Performance: https://reactnative.dev/docs/performance
- React Native Profiling: https://reactnative.dev/docs/profiling

---

### 2.2 Development Experience: What are the key workflow differences?

**Answer:**

**Literal Definition:** Development experience encompasses setup, tooling, debugging, and iteration speed. React Native requires native development tools (Xcode, Android Studio) while Ionic can be developed entirely with web tools.

**Development Workflow Comparison:**

**Ionic Development:**
```bash
# Setup (web-only initially)
npm install -g @ionic/cli
ionic start myApp blank --type=angular
cd myApp

# Development
ionic serve  # Opens in browser

# Add mobile platforms
ionic capacitor add ios
ionic capacitor add android

# Build and run
ionic build
npx cap sync
npx cap open ios  # Opens Xcode
npx cap open android  # Opens Android Studio
```

**React Native Development:**
```bash
# Setup (requires native tools)
npx react-native init MyApp
cd MyApp

# iOS development (Mac only)
npx react-native run-ios

# Android development
npx react-native run-android

# Development with Expo (easier alternative)
npx create-expo-app MyApp
cd MyApp
npx expo start
```

**Debugging Comparison:**

**Ionic:**
```typescript
// Debug in Chrome DevTools
console.log('Debug data:', data);

// Ionic DevApp for testing
// Use browser inspector
```

**React Native:**
```tsx
// Debug menu: Cmd+D (iOS) / Cmd+M (Android)
console.log('Debug data:', data);

// React DevTools
// Flipper (official debugger)
// Can set breakpoints in IDE
```

**Hot Reload Comparison:**

**Ionic:**
- Browser refresh (instant)
- Live reload in app (fast)
- No state preservation

**React Native:**
- Fast Refresh (preserves component state)
- Instant feedback
- State persistence between reloads

**Example of Fast Refresh:**
```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button 
        title="Increment" 
        onPress={() => setCount(count + 1)} 
      />
      {/* 
        If you edit this text and save,
        Fast Refresh keeps the count value!
      */}
      <Text>This is editable text</Text>
    </View>
  );
};
```

**IDE Support:**

**Ionic:**
- Any web IDE (VS Code, WebStorm)
- Full TypeScript support
- Angular Language Service
- Chrome DevTools integration

**React Native:**
- VS Code (best support)
- React Native Tools extension
- TypeScript support
- Flipper for debugging
- React DevTools

**Testing Workflow:**

**Ionic:**
```typescript
// Run in browser for quick testing
ionic serve

// E2E testing with web tools
import { browser, by, element } from 'protractor';
```

**React Native:**
```tsx
// Requires emulator/simulator or device
npx react-native run-ios

// Testing with Jest and React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';
```

---

### 2.3 UI Components: Ionic Components vs React Native Components

**Answer:**

**Literal Definition:** UI components are the building blocks of the application interface. Ionic provides pre-styled web components that follow iOS and Android design guidelines, while React Native provides minimal native components that you typically style yourself or use with UI libraries.

**Component Mapping:**

| Ionic Component | React Native Equivalent | Notes |
|----------------|-------------------------|-------|
| `<ion-button>` | `<Button>` or `<TouchableOpacity>` | RN Button is basic |
| `<ion-input>` | `<TextInput>` | Similar API |
| `<ion-list>` | `<FlatList>` or `<SectionList>` | RN has better performance |
| `<ion-card>` | `<View>` (styled) | No built-in card |
| `<ion-header>` | `<View>` in `<Stack.Screen>` | Part of navigation |
| `<ion-content>` | `<ScrollView>` or `<View>` | More flexible in RN |
| `<ion-toggle>` | `<Switch>` | Native component |
| `<ion-loading>` | `<ActivityIndicator>` | Simpler in RN |
| `<ion-alert>` | `Alert.alert()` | API-based in RN |
| `<ion-modal>` | `<Modal>` | Similar concept |
| `<ion-tabs>` | Tab Navigator | Part of navigation |
| `<ion-icon>` | Use icon library | Need third-party lib |

**Detailed Comparisons:**

**1. Buttons:**

**Ionic:**
```html
<ion-button expand="block" color="primary" (click)="handleClick()">
  <ion-icon name="heart" slot="start"></ion-icon>
  Click Me
</ion-button>

<ion-button fill="outline" size="small">
  Outlined Button
</ion-button>
```

**React Native:**
```tsx
// Basic button (limited styling)
<Button title="Click Me" onPress={handleClick} color="#3880ff" />

// Custom styled button (more common)
<TouchableOpacity 
  style={styles.button} 
  onPress={handleClick}
>
  <Icon name="heart" size={20} color="#fff" />
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3880ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
```

**2. Text Inputs:**

**Ionic:**
```html
<ion-item>
  <ion-label position="floating">Email</ion-label>
  <ion-input 
    type="email" 
    [(ngModel)]="email"
    placeholder="Enter email"
  ></ion-input>
</ion-item>
```

**React Native:**
```tsx
<View style={styles.inputContainer}>
  <Text style={styles.label}>Email</Text>
  <TextInput
    style={styles.input}
    value={email}
    onChangeText={setEmail}
    placeholder="Enter email"
    keyboardType="email-address"
    autoCapitalize="none"
  />
</View>

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
```

**3. Lists:**

**Ionic:**
```html
<ion-list>
  <ion-item *ngFor="let item of items">
    <ion-avatar slot="start">
      <img [src]="item.avatar" />
    </ion-avatar>
    <ion-label>
      <h2>{{ item.name }}</h2>
      <p>{{ item.description }}</p>
    </ion-label>
  </ion-item>
</ion-list>
```

**React Native:**
```tsx
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )}
/>

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
```

**4. Cards:**

**Ionic:**
```html
<ion-card>
  <img src="assets/image.jpg" />
  <ion-card-header>
    <ion-card-title>Card Title</ion-card-title>
    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
    Card content goes here
  </ion-card-content>
</ion-card>
```

**React Native:**
```tsx
<View style={styles.card}>
  <Image source={{ uri: 'https://...' }} style={styles.cardImage} />
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>Card Title</Text>
    <Text style={styles.cardSubtitle}>Card Subtitle</Text>
  </View>
  <View style={styles.cardContent}>
    <Text>Card content goes here</Text>
  </View>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    padding: 16,
  },
});
```

**Popular React Native UI Libraries:**

1. **React Native Elements**: https://reactnativeelements.com/
```tsx
import { Button, Card, Input } from '@rneui/themed';

<Card>
  <Card.Title>Card Title</Card.Title>
  <Card.Divider />
  <Input placeholder="Email" />
  <Button title="Submit" />
</Card>
```

2. **React Native Paper** (Material Design): https://callstack.github.io/react-native-paper/
```tsx
import { Button, Card, TextInput } from 'react-native-paper';

<Card>
  <Card.Title title="Card Title" subtitle="Subtitle" />
  <Card.Content>
    <TextInput label="Email" value={email} onChangeText={setEmail} />
  </Card.Content>
  <Card.Actions>
    <Button>Submit</Button>
  </Card.Actions>
</Card>
```

3. **NativeBase**: https://nativebase.io/
```tsx
import { Button, Box, Input, VStack } from 'native-base';

<Box>
  <VStack space={4}>
    <Input placeholder="Email" />
    <Button>Submit</Button>
  </VStack>
</Box>
```

**Key Takeaway:** React Native requires more manual styling but offers greater flexibility and native performance. Ionic provides ready-made components but is limited by WebView performance.

---

## 3. Environment Setup

### 3.1 How do I set up a React Native development environment coming from Ionic?

**Answer:**

**Literal Definition:** Setting up React Native requires installing native development tools (Xcode for iOS, Android Studio for Android) in addition to Node.js and React Native CLI. This is more complex than Ionic which only requires Node.js initially.

**Prerequisites:**

**For Both Platforms:**
1. Node.js (14+)
2. npm or yarn
3. Git
4. Code editor (VS Code recommended)

**For iOS Development (Mac only):**
1. Xcode (latest version from App Store)
2. Xcode Command Line Tools
3. CocoaPods
4. iOS Simulator

**For Android Development (All OS):**
1. Android Studio
2. Android SDK
3. Android Emulator
4. Java Development Kit (JDK)

**Setup Steps:**

**1. Install Node.js and Watchman:**
```bash
# macOS (using Homebrew)
brew install node
brew install watchman

# Watchman is a file watching service for hot reloading
```

**2. Install iOS Dependencies (Mac only):**
```bash
# Install Xcode from App Store

# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Or using Homebrew
brew install cocoapods
```

**3. Install Android Dependencies:**

Download and install Android Studio: https://developer.android.com/studio

During installation, ensure these are selected:
- Android SDK
- Android SDK Platform
- Android Virtual Device

Configure environment variables (add to `~/.bash_profile` or `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**4. Create React Native Project:**

**Option A: React Native CLI (Full control):**
```bash
npx react-native init MyApp --template react-native-template-typescript

cd MyApp

# Run on iOS
npx react-native run-ios

# Run on Android  
npx react-native run-android
```

**Option B: Expo (Easier, recommended for beginners):**
```bash
# Create Expo app
npx create-expo-app MyApp --template

cd MyApp

# Start development server
npx expo start

# Choose to run on:
# - iOS simulator (press 'i')
# - Android emulator (press 'a')
# - Physical device (scan QR code with Expo Go app)
```

**Comparison: React Native CLI vs Expo:**

| Feature | React Native CLI | Expo |
|---------|-----------------|------|
| **Setup Complexity** | High | Low |
| **Native Modules** | Full access | Limited (managed workflow) |
| **Build Process** | Manual (Xcode/Android Studio) | Automated |
| **App Size** | Smaller | Larger (includes Expo SDK) |
| **OTA Updates** | Manual setup | Built-in |
| **Custom Native Code** | Yes | Yes (with custom dev client) |
| **Best For** | Production apps, custom modules | Rapid prototyping, simple apps |

**5. Install VS Code Extensions:**
```bash
# React Native Tools
# ES7+ React/Redux/React-Native snippets
# Prettier - Code formatter
# ESLint
```

**6. Project Structure:**

**Ionic Project:**
```
ionic-app/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   ├── assets/
│   ├── theme/
│   └── index.html
├── android/ (after capacitor add)
├── ios/ (after capacitor add)
└── package.json
```

**React Native Project:**
```
MyApp/
├── android/           # Android native code
├── ios/              # iOS native code
├── src/              # Your code (optional structure)
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   └── utils/
├── App.tsx           # Root component
├── index.js          # Entry point
├── package.json
├── tsconfig.json
└── metro.config.js   # Bundler config
```

**7. Verify Installation:**

```bash
# Check React Native environment
npx react-native doctor

# Output should show ✓ for all requirements
```

**Common Setup Issues:**

**Issue: iOS build fails**
```bash
# Solution: Clean and reinstall pods
cd ios
pod deintegrate
pod install
cd ..
```

**Issue: Android build fails**
```bash
# Solution: Clean gradle
cd android
./gradlew clean
cd ..
```

**Issue: Metro bundler port in use**
```bash
# Solution: Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

**Development Workflow Comparison:**

**Ionic:**
```bash
ionic serve              # Browser development
ionic build              # Build web assets
npx cap sync            # Sync to native projects
npx cap open ios        # Open in Xcode
npx cap open android    # Open in Android Studio
```

**React Native:**
```bash
npx react-native start                    # Start Metro bundler
npx react-native run-ios                  # Build and run iOS
npx react-native run-ios --device         # Run on physical device
npx react-native run-android              # Build and run Android
npx react-native run-android --deviceId=<id>  # Run on specific device
```

**Official Resources:**
- React Native Environment Setup: https://reactnative.dev/docs/environment-setup
- Expo Documentation: https://docs.expo.dev/

---

### 3.2 Should I use Expo or React Native CLI?

**Answer:**

**Literal Definition:** Expo is a framework and platform built around React Native that provides managed workflows and additional APIs, similar to how Ionic provides a managed workflow around Capacitor. React Native CLI gives you a bare React Native project with full control over native code.

**Expo (Managed Workflow):**

**Pros:**
- ✅ Easiest setup (no Xcode/Android Studio initially)
- ✅ OTA updates built-in
- ✅ Rich set of pre-built APIs
- ✅ Easy to build and deploy
- ✅ Expo Go app for quick testing
- ✅ Web support out of the box

**Cons:**
- ❌ Limited access to native modules (managed workflow)
- ❌ Larger app size
- ❌ Some libraries incompatible
- ❌ Less control over native code

**Example Expo Project:**
```tsx
// App.tsx - Expo app
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Expo provides many modules out of the box
```

**React Native CLI (Bare Workflow):**

**Pros:**
- ✅ Full control over native code
- ✅ Smaller app size
- ✅ All libraries supported
- ✅ Better for complex apps
- ✅ No vendor lock-in

**Cons:**
- ❌ Complex setup
- ❌ Need to manage native dependencies
- ❌ Manual build process
- ❌ Need native development tools

**Example CLI Project:**
```tsx
// App.tsx - React Native CLI app
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello from React Native CLI!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

**Decision Matrix:**

**Choose Expo if:**
- You're new to mobile development
- You don't need custom native modules
- You want rapid prototyping
- You need web support
- You want OTA updates
- Your app is content-focused

**Choose React Native CLI if:**
- You need custom native modules
- You require specific native SDKs
- App size is critical
- You need full control
- You're building a complex production app
- You have native developers on team

**Hybrid Approach: Expo with Custom Dev Client:**

You can get the best of both worlds:
```bash
# Start with Expo
npx create-expo-app MyApp

# Later, add custom native code
npx expo prebuild

# Now you have access to native folders
# But can still use Expo modules
```

**Comparison to Ionic:**

| Concept | Ionic | React Native |
|---------|-------|--------------|
| **Managed Option** | Ionic + Capacitor | Expo (managed) |
| **Full Control** | Add platforms, edit native | React Native CLI |
| **Quick Testing** | Browser + Ionic DevApp | Expo Go |
| **OTA Updates** | Ionic AppFlow (paid) | Expo Updates (free) |

**Migration Path:**

```bash
# Start with Expo for learning
npx create-expo-app MyApp

# As you grow, you can:
# 1. Eject to bare workflow
npx expo prebuild

# 2. Or switch to React Native CLI
# (requires recreating project)
```

**My Recommendation for Ionic Developers:**

Start with **Expo** because:
1. Similar to Ionic's developer experience
2. Easier learning curve
3. Can always add native code later
4. Better for understanding React Native concepts first

**Official Resources:**
- Expo: https://expo.dev/
- Choosing a workflow: https://docs.expo.dev/archive/managed-vs-bare/

---

## 4. Project Structure & Configuration

### 4.1 How do I structure a React Native project coming from Ionic?

**Answer:**

**Literal Definition:** Project structure in React Native is more flexible than Ionic/Angular since there's no enforced architecture. However, community best practices have emerged that are similar to organizing any React application.

**Ionic/Angular Structure:**
```
ionic-app/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   ├── home.page.ts
│   │   │   │   ├── home.page.html
│   │   │   │   └── home.page.scss
│   │   │   └── profile/
│   │   ├── components/
│   │   │   └── user-card/
│   │   │       ├── user-card.component.ts
│   │   │       ├── user-card.component.html
│   │   │       └── user-card.component.scss
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── api.service.ts
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── theme/
│   └── environments/
├── android/
├── ios/
└── capacitor.config.ts
```

**React Native Recommended Structure:**
```
MyApp/
├── src/
│   ├── screens/              # Pages (instead of pages/)
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── index.ts
│   ├── components/           # Reusable components
│   │   ├── UserCard/
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserCard.styles.ts
│   │   │   └── index.ts
│   │   ├── Button/
│   │   └── index.ts
│   ├── navigation/           # Navigation config (instead of routing)
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── types.ts
│   ├── services/             # API and business logic
│   │   ├── auth.service.ts
│   │   ├── api.service.ts
│   │   └── index.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── index.ts
│   ├── store/                # State management (Redux/MobX/Zustand)
│   │   ├── slices/
│   │   ├── store.ts
│   │   └── index.ts
│   ├── types/                # TypeScript types (instead of models/)
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── utils/                # Helper functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── index.ts
│   ├── constants/            # App constants
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── index.ts
│   ├── assets/               # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   └── theme/                # Theme configuration
│       ├── colors.ts
│       ├── spacing.ts
│       └── typography.ts
├── android/                  # Android native code
├── ios/                      # iOS native code
├── App.tsx                   # Root component
├── index.js                  # Entry point
├── app.json                  # App configuration
├── package.json
├── tsconfig.json
└── .eslintrc.js
```

**File Organization Patterns:**

**1. Screen/Page Structure:**

**Ionic:**
```typescript
// src/app/pages/home/home.page.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // Component logic
}
```

**React Native:**
```tsx
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './HomeScreen.styles';

const HomeScreen: React.FC = () => {
  // Component logic
  
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;

// src/screens/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// src/screens/index.ts (barrel export)
export { default as HomeScreen } from './HomeScreen';
export { default as ProfileScreen } from './ProfileScreen';
```

**2. Component Structure:**

**Ionic Component:**
```typescript
// src/app/components/user-card/user-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: User;
  @Output() cardClick = new EventEmitter<User>();
}
```

**React Native Component:**
```tsx
// src/components/UserCard/UserCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './UserCard.styles';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(user)}
    >
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </TouchableOpacity>
  );
};

// src/components/UserCard/UserCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});

// src/components/UserCard/index.ts
export { UserCard } from './UserCard';

// src/components/index.ts
export { UserCard } from './UserCard';
export { Button } from './Button';
```

**3. Service Structure:**

**Ionic Service:**
```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  
  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>('/api/login', credentials);
  }
}
```

**React Native Service:**
```typescript
// src/services/auth.service.ts
import { api } from './api.service';
import { User, Credentials } from '../types';

export class AuthService {
  async login(credentials: Credentials): Promise<User> {
    const response = await api.post<User>('/login', credentials);
    return response.data;
  }
  
  async logout(): Promise<void> {
    await api.post('/logout');
  }
}

export const authService = new AuthService();

// src/services/api.service.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// src/services/index.ts
export { authService } from './auth.service';
export { api } from './api.service';
```

**4. Navigation Configuration:**

**Ionic:**
```typescript
// src/app/app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module') },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module') },
];
```

**React Native:**
```tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ProfileScreen } from '../screens';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};
```

**5. Custom Hooks (Replaces Services for Component Logic):**

```tsx
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials: Credentials) => {
    const user = await authService.login(credentials);
    setUser(user);
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  return { user, loading, login, logout };
};

// Usage in component:
// const { user, login, logout } = useAuth();
```

**Alternative: Feature-Based Structure (Recommended for Large Apps):**

```
src/
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── profile/
│   ├── posts/
│   └── settings/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── navigation/
├── theme/
└── App.tsx
```

**Configuration Files:**

**app.json (App Metadata):**
```json
{
  "name": "MyApp",
  "displayName": "My App",
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.mycompany.myapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.mycompany.myapp",
      "versionCode": 1
    }
  }
}
```

**tsconfig.json (TypeScript Configuration):**
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@services/*": ["services/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

**Key Differences Summary:**

| Aspect | Ionic/Angular | React Native |
|--------|--------------|--------------|
| **File Separation** | HTML, TS, CSS files | Single .tsx file or separate styles |
| **Modules** | Angular modules | None (just imports) |
| **Routing Config** | Separate routing module | Navigation in code |
| **Services** | Injectable classes | Plain classes or functions |
| **Guards** | Route guards | Navigation logic in hooks |
| **Interceptors** | HTTP interceptors | Axios interceptors |
| **Barrel Exports** | Less common | Very common (index.ts) |

**Official Resources:**
- React Native Project Structure: (community best practices)
- Feature-based architecture: https://github.com/infinitered/ignite

---

## 5. Core Components

### 5.1 What are the essential React Native components I need to know?

**Answer:**

**Literal Definition:** React Native provides a core set of built-in components that map to native platform UI elements. Unlike Ionic which provides web components, React Native components render to actual native views.

**Core Components Overview:**

| Category | React Native Components | Ionic Equivalent |
|----------|------------------------|------------------|
| **Container** | `View`, `SafeAreaView`, `ScrollView` | `<div>`, `<ion-content>` |
| **Text** | `Text` | `<span>`, `<p>`, `<ion-text>` |
| **Input** | `TextInput` | `<ion-input>` |
| **Buttons** | `Button`, `TouchableOpacity`, `Pressable` | `<ion-button>` |
| **Images** | `Image` | `<img>` |
| **Lists** | `FlatList`, `SectionList` | `<ion-list>`, `*ngFor` |
| **Loading** | `ActivityIndicator` | `<ion-loading>`, `<ion-spinner>` |
| **Modals** | `Modal` | `<ion-modal>` |
| **Switches** | `Switch` | `<ion-toggle>` |

**1. View (Most Important):**

**Literal Definition:** `View` is the fundamental building block for UI, equivalent to a `<div>` in web development. It's a container that supports layout, styling, touch handling, and accessibility.

```tsx
import { View, Text, StyleSheet } from 'react-native';

// Basic container
<View style={styles.container}>
  <Text>Hello World</Text>
</View>

// Ionic equivalent: <div class="container">

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
```

**2. Text:**

**Literal Definition:** `Text` is used for displaying text. Unlike HTML where text can be placed anywhere, in React Native ALL text must be inside `<Text>` components.

```tsx
import { Text, StyleSheet } from 'react-native';

<Text style={styles.title}>Title Text</Text>
<Text style={styles.body}>
  Body text with <Text style={styles.bold}>bold</Text> inline.
</Text>

// Ionic equivalent:
// <ion-text color="primary"><h1>Title</h1></ion-text>

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
});
```

**3. ScrollView:**

**Literal Definition:** `ScrollView` is a scrollable container that renders all its children at once. Use for small lists; for large lists use `FlatList`.

```tsx
import { ScrollView, View, Text } from 'react-native';

<ScrollView style={styles.scrollView}>
  <View style={styles.content}>
    <Text>Item 1</Text>
    <Text>Item 2</Text>
    <Text>Item 3</Text>
  </View>
</ScrollView>

// Ionic equivalent: <ion-content>

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
```

**4. TextInput:**

**Literal Definition:** `TextInput` is a component for entering text via keyboard. It handles various keyboard types, autocomplete, and text validation.

```tsx
import { TextInput, View } from 'react-native';
import { useState } from 'react';

const MyComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  );
};

// Ionic equivalent:
// <ion-input 
//   type="email" 
//   [(ngModel)]="email"
//   placeholder="Enter email">
// </ion-input>

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
});
```

**5. TouchableOpacity (Buttons):**

**Literal Definition:** `TouchableOpacity` is a wrapper that responds to touches with opacity feedback. It's the most common way to create custom buttons.

```tsx
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity 
  style={styles.button}
  onPress={() => console.log('Pressed')}
  activeOpacity={0.7}
>
  <Text style={styles.buttonText}>Press Me</Text>
</TouchableOpacity>

// Ionic equivalent:
// <ion-button (click)="handleClick()">Press Me</ion-button>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**6. Pressable (Modern Alternative):**

**Literal Definition:** `Pressable` is a more flexible alternative to `TouchableOpacity` with more control over press states.

```tsx
import { Pressable, Text } from 'react-native';

<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed
  ]}
  onPress={() => console.log('Pressed')}
>
  {({ pressed }) => (
    <Text style={styles.buttonText}>
      {pressed ? 'Pressed!' : 'Press Me'}
    </Text>
  )}
</Pressable>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
```

**7. Image:**

**Literal Definition:** `Image` component displays images from various sources (local, network, base64).

```tsx
import { Image } from 'react-native';

// Local image
<Image 
  source={require('../assets/logo.png')} 
  style={styles.logo}
/>

// Network image
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.networkImage}
/>

// With loading indicator
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}
  resizeMode="cover"
  defaultSource={require('../assets/placeholder.png')}
/>

// Ionic equivalent:
// <img src="assets/logo.png" />
// <ion-img src="https://example.com/image.jpg"></ion-img>

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
  networkImage: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
```

**8. FlatList (Optimized Lists):**

**Literal Definition:** `FlatList` is a performant component for rendering long lists of data. It only renders visible items (virtualization).

```tsx
import { FlatList, View, Text } from 'react-native';

interface Item {
  id: string;
  title: string;
}

const data: Item[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  // ... more items
];

<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  )}
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  // Pull to refresh
  onRefresh={() => {}}
  refreshing={false}
  // Load more
  onEndReached={() => {}}
  onEndReachedThreshold={0.5}
/>

// Ionic equivalent:
// <ion-list>
//   <ion-item *ngFor="let item of data">
//     {{ item.title }}
//   </ion-item>
// </ion-list>

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
```

**9. ActivityIndicator (Loading Spinner):**

```tsx
import { ActivityIndicator, View } from 'react-native';

<View style={styles.loading}>
  <ActivityIndicator size="large" color="#007AFF" />
</View>

// Ionic equivalent:
// <ion-spinner name="crescent"></ion-spinner>

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**10. Switch:**

```tsx
import { Switch, View, Text } from 'react-native';
import { useState } from 'react';

const MyComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  
  return (
    <View style={styles.row}>
      <Text>Enable notifications</Text>
      <Switch
        value={isEnabled}
        onValueChange={setIsEnabled}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

// Ionic equivalent:
// <ion-toggle [(ngModel)]="isEnabled"></ion-toggle>
```

**11. Modal:**

```tsx
import { Modal, View, Text, Button } from 'react-native';
import { useState } from 'react';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);
  
  return (
    <View>
      <Button title="Show Modal" onPress={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Modal Content</Text>
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Ionic equivalent:
// <ion-modal [isOpen]="visible">
//   <ng-template>...</ng-template>
// </ion-modal>

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
});
```

**12. SafeAreaView:**

**Literal Definition:** `SafeAreaView` renders content within the safe area boundaries of a device, avoiding notches, home indicators, and status bars.

```tsx
import { SafeAreaView, Text } from 'react-native';

<SafeAreaView style={styles.container}>
  <Text>Content respects safe areas</Text>
</SafeAreaView>

// Important for iPhone X+, newer Android devices

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

**Component Comparison Cheat Sheet:**

```tsx
// Ionic → React Native Quick Reference

// <div> → <View>
// <span>, <p> → <Text>
// <img> → <Image>
// <input> → <TextInput>
// <button> → <TouchableOpacity> or <Pressable>
// <ion-content> → <ScrollView>
// <ion-list> → <FlatList>
// <ion-loading> → <ActivityIndicator>
// <ion-modal> → <Modal>
// <ion-toggle> → <Switch>
// No direct equivalent → <SafeAreaView> (new concept)
```

**Common Patterns:**

**Card Component (Custom):**
```tsx
import { View, Text, StyleSheet } from 'react-native';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
});

// Usage:
<Card>
  <Text>Card Content</Text>
</Card>
```

**Official Resources:**
- Core Components: https://reactnative.dev/docs/components-and-apis
- Component Reference: https://reactnative.dev/docs/view

---

## 6. Styling in React Native

### 6.1 How do I style components in React Native vs Ionic/CSS?

**Answer:**

**Literal Definition:** React Native uses JavaScript objects to define styles, implemented through the `StyleSheet` API. Unlike Ionic which uses standard CSS, React Native styles are JavaScript properties written in camelCase that approximate CSS properties.

**Ionic Styling (CSS/SCSS):**
```scss
/* home.page.scss */
.container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f0f0f0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.button {
  background-color: #3880ff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button:hover {
  background-color: #2a6fd8;
}
```

**React Native Styling (StyleSheet):**
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex', // implied, all views are flex containers
    flexDirection: 'column',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3880ff',
    padding: 12, // no need for 12px 24px syntax
    paddingHorizontal: 24,
    borderRadius: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  // No :hover in React Native
  // Use Pressable component with state instead
});

export default styles;
```

**Key Differences:**

| Feature | CSS/SCSS (Ionic) | StyleSheet (React Native) |
|---------|-----------------|---------------------------|
| **Syntax** | CSS properties | camelCase JavaScript object |
| **Units** | px, em, rem, %, vh | Numbers (dp), percentages (strings) |
| **Selectors** | Class, ID, element | N/A (style per component) |
| **Cascading** | Yes | No cascading |
| **Pseudo-classes** | :hover, :active, :focus | Component state-based |
| **Media Queries** | @media | Dimensions API |
| **Variables** | CSS variables, SASS vars | JavaScript constants |
| **Flexbox** | Need to enable | Default layout system |

**1. Basic Styling:**

**Inline Styles:**
```tsx
import { View, Text } from 'react-native';

// Inline styles (less performant, avoid for production)
<View style={{ padding: 16, backgroundColor: '#fff' }}>
  <Text style={{ fontSize: 20, color: '#333' }}>Hello</Text>
</View>

// Ionic equivalent:
// <div style="padding: 16px; background-color: #fff">
```

**StyleSheet (Recommended):**
```tsx
import { View, Text, StyleSheet } from 'react-native';

const MyComponent = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Hello</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

// Benefits: Performance optimization, validation, easier debugging
```

**2. Combining Styles:**

```tsx
import { View, Text, StyleSheet } from 'react-native';

const MyComponent = ({ isActive }: { isActive: boolean }) => (
  <View style={[styles.container, isActive && styles.active]}>
    <Text style={[styles.text, styles.bold, { color: 'red' }]}>
      Combined Styles
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  active: {
    backgroundColor: '#e0f0ff',
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Ionic equivalent:
// <div [class]="'container' + (isActive ? ' active' : '')">
// or
// <div [ngClass]="{ container: true, active: isActive }">
```

**3. No Cascading (Each Component Styled Independently):**

**Ionic/CSS (Cascading):**
```scss
/* Styles cascade down */
.container {
  color: #333;
  font-size: 16px;
  
  h1 {
    color: inherit; // Gets color from parent
    font-size: 24px;
  }
  
  p {
    color: inherit;
  }
}
```

**React Native (No Cascading):**
```tsx
// Every component must be styled explicitly
const styles = StyleSheet.create({
  container: {
    // These styles don't cascade to children
  },
  heading: {
    color: '#333', // Must set explicitly
    fontSize: 24,
  },
  paragraph: {
    color: '#333', // Must set explicitly
    fontSize: 16,
  },
});

// Solution: Use theme context or constants
import { Colors, Typography } from '../theme';

const styles = StyleSheet.create({
  heading: {
    color: Colors.text,
    fontSize: Typography.sizes.h1,
  },
  paragraph: {
    color: Colors.text,
    fontSize: Typography.sizes.body,
  },
});
```

**4. Dimensions and Units:**

**Ionic:**
```css
.container {
  width: 100%; /* percentage */
  height: 50vh; /* viewport units */
  padding: 16px; /* pixels */
  font-size: 1.2rem; /* relative units */
}
```

**React Native:**
```tsx
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%', // percentage (string)
    height: screenHeight * 0.5, // 50% of viewport
    padding: 16, // numbers are density-independent pixels (dp)
  },
  text: {
    fontSize: 16, // no 'rem', just numbers
  },
  halfScreen: {
    width: screenWidth / 2,
  },
});
```

**5. Flexbox (Default):**

**Ionic:**
```css
/* Must explicitly set display: flex */
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
```

**React Native:**
```tsx
// Flexbox is default! All Views are flex containers
const styles = StyleSheet.create({
  container: {
    // display: 'flex' is implicit
    flexDirection: 'row', // default is 'column' (different from web!)
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

// Key difference: flexDirection default is 'column' in RN, 'row' in web
```

**6. Platform-Specific Styles:**

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    ...Platform.select({
      ios: {
        paddingTop: 20, // Extra padding for iOS status bar
      },
      android: {
        paddingTop: 10,
      },
    }),
  },
  text: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  shadow: {
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5, // Android shadow
      },
    }),
  },
});

// Or separate platform files:
// Button.ios.tsx
// Button.android.tsx
```

**7. Responsive Styles:**

**Ionic (CSS Media Queries):**
```css
.container {
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}
```

**React Native (Dimensions API):**
```tsx
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const isTablet = width >= 768;

const styles = StyleSheet.create({
  container: {
    padding: isTablet ? 24 : 16,
  },
});

// Or use hooks for responsive layouts
import { useWindowDimensions } from 'react-native';

const MyComponent = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  return (
    <View style={[styles.container, { padding: isTablet ? 24 : 16 }]}>
      {/* Content */}
    </View>
  );
};
```

**8. Theming:**

**Create Theme Constants:**
```tsx
// src/theme/colors.ts
export const Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  
  border: '#C6C6C8',
};

// src/theme/spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// src/theme/typography.ts
export const Typography = {
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Usage:
import { Colors, Spacing, Typography } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
});
```

**9. Shadows (Different for iOS and Android):**

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    // Android shadow (only elevation works)
    elevation: 5,
  },
});

// Helper function for consistent shadows
const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Usage:
<View style={[styles.card, Shadow.medium]} />
```

**10. Common Styling Patterns:**

**Center Content:**
```tsx
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**Full Width Button:**
```tsx
const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
});
```

**Card Layout:**
```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Shadow.medium,
  },
});
```

**Styling Libraries:**

1. **Styled Components**: https://styled-components.com/docs/basics#react-native
```tsx
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;
```

2. **Tailwind CSS (NativeWind)**: https://www.nativewind.dev/
```tsx
import { View, Text } from 'react-native';

<View className="flex-1 p-4 bg-white">
  <Text className="text-2xl font-bold">Title</Text>
</View>
```

**Official Resources:**
- Style Reference: https://reactnative.dev/docs/style
- Flexbox: https://reactnative.dev/docs/flexbox

---

## 7. Layout with Flexbox

### 7.1 How does Flexbox work in React Native vs CSS Flexbox?

**Answer:**

**Literal Definition:** React Native uses Flexbox for layout, similar to CSS Flexbox, but with some key differences: `flexDirection` defaults to `column` instead of `row`, and there's no `inline-flex` - all Views are flex containers by default.

**Key Differences:**

| Property | CSS (Ionic) | React Native |
|----------|------------|--------------|
| **Default direction** | `row` | `column` |
| **Display** | Must set `display: flex` | Always flex |
| **flex** | `flex: 1` means grow | `flex: 1` fills available space |
| **Supported** | Full Flexbox spec | Subset of Flexbox |

**Ionic/CSS Flexbox:**
```css
.container {
  display: flex; /* Must explicitly set */
  flex-direction: row; /* Default */
  justify-content: space-between;
  align-items: center;
}

.item {
  flex: 1; /* Grow to fill space */
}
```

**React Native Flexbox:**
```tsx
import { View, StyleSheet } from 'react-native';

<View style={styles.container}>
  <View style={styles.item} />
  <View style={styles.item} />
</View>

const styles = StyleSheet.create({
  container: {
    // display: 'flex' is implicit!
    flexDirection: 'row', // Must set if you want row (default is column)
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 1, // Fill available space
  },
});
```

**Common Flexbox Patterns:**

**1. Center Content:**
```tsx
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',      // Center horizontally
  },
});
```

**2. Row Layout:**
```tsx
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
```

**3. Column Layout (Default):**
```tsx
const styles = StyleSheet.create({
  column: {
    flexDirection: 'column', // default, can omit
    justifyContent: 'flex-start',
  },
});
```

**4. Equal Width Items:**
```tsx
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    flex: 1, // Each item takes equal space
  },
});
```

**5. Sticky Header with Scrollable Content:**
```tsx
import { View, ScrollView, StyleSheet } from 'react-native';

<View style={styles.container}>
  <View style={styles.header}>
    {/* Fixed header */}
  </View>
  <ScrollView style={styles.content}>
    {/* Scrollable content */}
  </ScrollView>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1, // Takes remaining space
  },
});
```

**6. Bottom Button with Content:**
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, // Content fills available space
  },
  button: {
    padding: 16,
    backgroundColor: '#007AFF',
  },
});
```

**Official Resources:**
- Flexbox Layout: https://reactnative.dev/docs/flexbox

---

## 8. Navigation

### 8.1 How does navigation work in React Native vs Ionic Router?

**Answer:**

**Literal Definition:** React Native doesn't have built-in routing. React Navigation is the most popular navigation library, using a stack-based approach where screens are pushed/popped from a navigation stack, unlike Ionic's URL-based router that matches web routing patterns.

**Ionic Router (Angular):**
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module')
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./pages/profile/profile.module')
  },
];

// Navigation
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToProfile() {
  this.router.navigate(['/profile', userId]);
}

goBack() {
  this.router.back();
}
```

**React Navigation:**

**Installation:**
```bash
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack

# For Expo:
npx expo install react-native-screens react-native-safe-area-context
```

**Basic Setup:**
```tsx
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Navigation in Components:**
```tsx
// HomeScreen.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile', { userId: '123' })}
      />
      
      <Button
        title="Push another Home"
        onPress={() => navigation.push('Home')}
      />
    </View>
  );
};

export default HomeScreen;
```

**Receiving Params:**
```tsx
// ProfileScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Props = {
  route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  
  return (
    <View>
      <Text>User ID: {userId}</Text>
    </View>
  );
};

// Ionic equivalent:
// constructor(private route: ActivatedRoute) {
//   this.userId = this.route.snapshot.params['id'];
// }
```

**Navigation Methods Comparison:**

| Ionic Router | React Navigation | Description |
|-------------|------------------|-------------|
| `router.navigate(['/path'])` | `navigation.navigate('Screen')` | Navigate to screen |
| `router.navigate(['/path', id])` | `navigation.navigate('Screen', { id })` | Navigate with params |
| `router.back()` | `navigation.goBack()` | Go back |
| `router.navigateRoot(['/path'])` | `navigation.reset()` | Reset navigation |
| No equivalent | `navigation.push('Screen')` | Push duplicate screen |
| `location.replaceState()` | `navigation.replace('Screen')` | Replace current screen |

**Tab Navigation:**

**Ionic:**
```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="home">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="profile">
      <ion-icon name="person"></ion-icon>
      <ion-label>Profile</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

**React Navigation:**
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

**Drawer Navigation:**
```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// Ionic equivalent: <ion-menu>
```

**Navigation Guards (Similar to CanActivate):**
```tsx
// Using navigation listeners
function ProtectedScreen({ navigation }) {
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);
  
  return user ? <View>{/* Protected content */}</View> : null;
}

// Or using navigation state
function App() {
  const { user } = useAuth();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Deep Linking:**

**Ionic:**
```typescript
// capacitor.config.ts
{
  appId: 'com.example.app',
  appName: 'My App',
  plugins: {
    App: {
      deepLinkScheme: 'myapp'
    }
  }
}

// Handle: myapp://profile/123
```

**React Navigation:**
```tsx
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Profile: 'profile/:userId',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* Navigators */}
</NavigationContainer>

// Handles: myapp://profile/123
```

**Official Resources:**
- React Navigation: https://reactnavigation.org/
- Stack Navigator: https://reactnavigation.org/docs/stack-navigator
- Tab Navigator: https://reactnavigation.org/docs/bottom-tab-navigator

---

## 9. State Management

### 9.1 What are the state management options in React Native?

**Answer:**

**Literal Definition:** State management in React Native can be handled at component level using hooks, or at application level using libraries. Options range from built-in React hooks to full-featured libraries like Redux, MobX, or Zustand.

**State Management Comparison:**

| Ionic/Angular | React Native | Use Case |
|--------------|--------------|----------|
| Component `@Input/@Output` | `useState`, props | Component state |
| Services with BehaviorSubject | Context API, custom hooks | Shared state |
| NgRx | Redux Toolkit | Global state (complex apps) |
| Signals | Zustand, Jotai | Simple global state |
| Akita | MobX | Observable state |

**1. Local Component State (useState):**

**Ionic:**
```typescript
export class CounterComponent {
  count = 0;
  
  increment() {
    this.count++;
  }
}
```

**React Native:**
```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
};
```

**2. Context API (Similar to Services):**

**Ionic Service:**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  
  login(credentials: Credentials) {
    // Login logic
    this.userSubject.next(user);
  }
}

// Usage in component:
export class MyComponent {
  user$ = this.authService.user$;
  
  constructor(private authService: AuthService) {}
}
```

**React Native Context:**
```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (credentials: Credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// App.tsx
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* App content */}
      </NavigationContainer>
    </AuthProvider>
  );
}

// Usage in components:
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.name}</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Button title="Login" onPress={() => login(credentials)} />
      )}
    </View>
  );
};
```

**3. Redux Toolkit (Similar to NgRx):**

**Installation:**
```bash
npm install @reduxjs/toolkit react-redux
```

**Setup:**
```tsx
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* App content */}
      </NavigationContainer>
    </Provider>
  );
}

// Usage in components:
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, logout } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  
  const handleLogin = async () => {
    dispatch(loginStart());
    try {
      const user = await authService.login(credentials);
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
  
  return (
    <View>
      {loading && <ActivityIndicator />}
      {user ? (
        <Button title="Logout" onPress={() => dispatch(logout())} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};
```

**4. Zustand (Lightweight Alternative):**

**Installation:**
```bash
npm install zustand
```

**Setup:**
```tsx
// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  
  login: async (credentials) => {
    set({ loading: true });
    try {
      const user = await authService.login(credentials);
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
  
  logout: () => {
    set({ user: null });
  },
}));

// Usage in components (no Provider needed!):
import { useAuthStore } from '../store/useAuthStore';

const MyComponent = () => {
  const { user, login, logout } = useAuthStore();
  
  return (
    <View>
      {user ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <Button title="Login" onPress={() => login(credentials)} />
      )}
    </View>
  );
};
```

**5. MobX (Observable State):**

**Installation:**
```bash
npm install mobx mobx-react-lite
```

**Setup:**
```tsx
// src/stores/AuthStore.ts
import { makeAutoObservable } from 'mobx';

class AuthStore {
  user: User | null = null;
  loading = false;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async login(credentials: Credentials) {
    this.loading = true;
    try {
      this.user = await authService.login(credentials);
    } finally {
      this.loading = false;
    }
  }
  
  logout() {
    this.user = null;
  }
}

export const authStore = new AuthStore();

// Usage in components:
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';

const MyComponent = observer(() => {
  return (
    <View>
      {authStore.user ? (
        <Button title="Logout" onPress={() => authStore.logout()} />
      ) : (
        <Button title="Login" onPress={() => authStore.login(credentials)} />
      )}
    </View>
  );
});
```

**State Management Decision Guide:**

| Use Case | Recommended Solution |
|----------|---------------------|
| Component-only state | `useState` |
| Share state between 2-3 components | Lift state up or Context |
| App-wide simple state | Context API or Zustand |
| Complex app with middleware | Redux Toolkit |
| Real-time updates, observers | MobX |
| Small global state atoms | Jotai or Recoil |

**Official Resources:**
- Context API: https://react.dev/learn/passing-data-deeply-with-context
- Redux Toolkit: https://redux-toolkit.js.org/
- Zustand: https://github.com/pmndrs/zustand
- MobX: https://mobx.js.org/

---

## 10. Native Modules & APIs

### 10.1 How do I access native device features?

**Answer:**

**Literal Definition:** React Native provides built-in APIs for common device features, and the community provides packages for additional functionality. This is similar to Ionic's Capacitor plugins, but with better performance due to direct native bridge access.

**Comparison:**

| Feature | Ionic (Capacitor) | React Native |
|---------|------------------|--------------|
| **Camera** | `@capacitor/camera` | `react-native-image-picker` or Expo Camera |
| **Geolocation** | `@capacitor/geolocation` | `@react-native-community/geolocation` |
| **Storage** | `@capacitor/storage` | `@react-native-async-storage/async-storage` |
| **Filesystem** | `@capacitor/filesystem` | `react-native-fs` or Expo FileSystem |
| **Share** | `@capacitor/share` | Built-in `Share` API |
| **Haptics** | `@capacitor/haptics` | `react-native-haptic-feedback` |

**Built-in APIs:**

**1. Share:**
```tsx
import { Share, Button } from 'react-native';

const shareContent = async () => {
  try {
    await Share.share({
      message: 'Check out this app!',
      url: 'https://example.com',
      title: 'Awesome App',
    });
  } catch (error) {
    console.error(error);
  }
};

<Button title="Share" onPress={shareContent} />

// Ionic equivalent:
// import { Share } from '@capacitor/share';
// await Share.share({ title: 'Awesome App', url: 'https://example.com' });
```

**2. Linking (Open URLs):**
```tsx
import { Linking, Button } from 'react-native';

const openWebsite = async () => {
  const url = 'https://example.com';
  const supported = await Linking.canOpenURL(url);
  
  if (supported) {
    await Linking.openURL(url);
  }
};

const makePhoneCall = () => {
  Linking.openURL('tel:+1234567890');
};

const sendEmail = () => {
  Linking.openURL('mailto:support@example.com?subject=Help&body=Hello');
};

<Button title="Open Website" onPress={openWebsite} />
```

**3. Alert:**
```tsx
import { Alert, Button } from 'react-native';

const showAlert = () => {
  Alert.alert(
    'Alert Title',
    'This is the alert message',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => console.log('OK pressed') },
    ]
  );
};

// Ionic equivalent:
// import { AlertController } from '@ionic/angular';
// const alert = await this.alertController.create({...});
// await alert.present();
```

**Community Packages:**

**1. Camera (with react-native-image-picker):**
```bash
npm install react-native-image-picker
```

```tsx
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const takePhoto = async () => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
  });
  
  if (result.assets && result.assets[0]) {
    const photo = result.assets[0];
    console.log('Photo URI:', photo.uri);
  }
};

const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });
  
  if (result.assets && result.assets[0]) {
    const image = result.assets[0];
    console.log('Image URI:', image.uri);
  }
};

// Ionic equivalent:
// import { Camera } from '@capacitor/camera';
// const image = await Camera.getPhoto({
//   quality: 80,
//   source: CameraSource.Camera
// });
```

**2. Async Storage:**
```bash
npm install @react-native-async-storage/async-storage
```

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Store object
const storeObject = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing object:', error);
  }
};

// Retrieve data
const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

// Remove data
const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Ionic equivalent:
// import { Storage } from '@capacitor/storage';
// await Storage.set({ key: 'name', value: 'John' });
// const { value } = await Storage.get({ key: 'name' });
```

**3. Geolocation:**
```bash
npm install @react-native-community/geolocation
```

```tsx
import Geolocation from '@react-native-community/geolocation';

// Get current position
Geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
);

// Watch position
const watchId = Geolocation.watchPosition(
  (position) => {
    console.log('Updated position:', position.coords);
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, distanceFilter: 10 }
);

// Stop watching
Geolocation.clearWatch(watchId);

// Ionic equivalent:
// import { Geolocation } from '@capacitor/geolocation';
// const position = await Geolocation.getCurrentPosition();
```

**4. Permissions:**
```bash
npm install react-native-permissions
```

```tsx
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestCameraPermission = async () => {
  const result = await request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA
  );
  
  switch (result) {
    case RESULTS.GRANTED:
      console.log('Permission granted');
      break;
    case RESULTS.DENIED:
      console.log('Permission denied');
      break;
    case RESULTS.BLOCKED:
      console.log('Permission blocked');
      break;
  }
};

const checkLocationPermission = async () => {
  const result = await check(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  );
  
  return result === RESULTS.GRANTED;
};
```

**Expo APIs (If using Expo):**

Expo provides easier-to-use APIs with better cross-platform support:

```tsx
// Camera
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchCameraAsync({
  quality: 0.8,
});

// Location
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({});

// File System
import * as FileSystem from 'expo-file-system';

await FileSystem.writeAsStringAsync(fileUri, content);
const content = await FileSystem.readAsStringAsync(fileUri);

// Contacts
import * as Contacts from 'expo-contacts';

const { status } = await Contacts.requestPermissionsAsync();
const { data } = await Contacts.getContactsAsync();

// Calendar
import * as Calendar from 'expo-calendar';

const calendars = await Calendar.getCalendarsAsync();

// Notifications
import * as Notifications from 'expo-notifications';

await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Hello!',
    body: 'This is a notification',
  },
  trigger: { seconds: 5 },
});
```

**Official Resources:**
- React Native APIs: https://reactnative.dev/docs/accessibilityinfo
- React Native Directory: https://reactnative.directory/
- Expo APIs: https://docs.expo.dev/versions/latest/

---

This comprehensive guide continues with sections on Forms, Lists, Images, Animations, Platform-Specific Code, Networking, Performance, Testing, Debugging, and more. Would you like me to continue with the remaining sections?

## 11. Forms & User Input

### 11.1 How do I handle forms in React Native vs Ionic Reactive Forms?

**Answer:**

**Literal Definition:** React Native doesn't have a built-in forms system like Angular's Reactive Forms. Forms are typically handled using controlled components with state management or form libraries like React Hook Form or Formik.

**Ionic (Angular Reactive Forms):**
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LoginPage {
  loginForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Submit logic
    }
  }
}
```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <ion-item>
    <ion-label position="floating">Email</ion-label>
    <ion-input formControlName="email" type="email"></ion-input>
  </ion-item>
  <ion-item *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
    <ion-text color="danger">Invalid email</ion-text>
  </ion-item>
  
  <ion-item>
    <ion-label position="floating">Password</ion-label>
    <ion-input formControlName="password" type="password"></ion-input>
  </ion-item>
  
  <ion-button type="submit" [disabled]="loginForm.invalid">
    Login
  </ion-button>
</form>
```

**React Native (Manual State Management):**
```tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      console.log('Form submitted:', formData);
      // Submit logic
    }
  };
  
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            errors.email && touched.email && styles.inputError
          ]}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          onBlur={() => handleBlur('email')}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && touched.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input,
            errors.password && touched.password && styles.inputError
          ]}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          onBlur={() => handleBlur('password')}
          placeholder="Enter password"
          secureTextEntry
        />
        {errors.password && touched.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          (Object.keys(errors).length > 0 || !formData.email || !formData.password) 
            && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={Object.keys(errors).length > 0}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginForm;
```

**React Hook Form (Recommended):**

**Installation:**
```bash
npm install react-hook-form
```

**Usage:**
```tsx
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginFormWithHookForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter password"
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles same as above
```

**Form Validation Comparison:**

| Angular Reactive Forms | React Hook Form |
|----------------------|-----------------|
| `Validators.required` | `rules: { required: 'Message' }` |
| `Validators.email` | `rules: { pattern: /regex/ }` |
| `Validators.minLength(6)` | `rules: { minLength: { value: 6 } }` |
| `Validators.maxLength(20)` | `rules: { maxLength: { value: 20 } }` |
| Custom validator | `rules: { validate: fn }` |
| `formGroup.get('field')?.errors` | `errors.field?.message` |
| `formGroup.valid` | `isValid` |
| `formGroup.value` | `getValues()` or submit data |

**Official Resources:**
- React Hook Form: https://react-hook-form.com/
- Formik: https://formik.org/

---

## 12. Lists & ScrollViews

### 12.1 How do I render large lists efficiently?

**Answer:**

**Literal Definition:** React Native provides `FlatList` and `SectionList` for rendering large lists efficiently through virtualization - only rendering visible items. This is more performant than Ionic's virtual scroll because it uses native components.

**Ionic:**
```html
<ion-content>
  <ion-list>
    <ion-virtual-scroll [items]="items" approxItemHeight="60px">
      <ion-item *virtualItem="let item">
        <ion-label>{{ item.name }}</ion-label>
      </ion-item>
    </ion-virtual-scroll>
  </ion-list>
</ion-content>
```

**React Native FlatList:**
```tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  name: string;
  description: string;
}

const MyList: React.FC<{ items: Item[] }> = ({ items }) => {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
  
  const renderSeparator = () => <View style={styles.separator} />;
  
  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text>No items found</Text>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>My List</Text>
    </View>
  );
  
  const renderFooter = () => (
    <View style={styles.footer}>
      <Text>End of list</Text>
    </View>
  );
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      // Fixed item height for better performance
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
```

**Pull to Refresh:**
```tsx
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

const MyList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(initialData);
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const newData = await fetchData();
      setData(newData);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

// Ionic equivalent:
// <ion-refresher (ionRefresh)="handleRefresh($event)">
//   <ion-refresher-content></ion-refresher-content>
// </ion-refresher>
```

**Infinite Scroll:**
```tsx
import React, { useState } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';

const InfiniteList = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newData = await fetchData(page + 1);
      setData([...data, ...newData]);
      setPage(page + 1);
    } finally {
      setLoading(false);
    }
  };
  
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5} // Trigger when 50% from bottom
      ListFooterComponent={renderFooter}
    />
  );
};

// Ionic equivalent:
// <ion-infinite-scroll (ionInfinite)="loadMore($event)">
//   <ion-infinite-scroll-content></ion-infinite-scroll-content>
// </ion-infinite-scroll>
```

**SectionList (Grouped Lists):**
```tsx
import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  name: string;
}

interface Section {
  title: string;
  data: Item[];
}

const sections: Section[] = [
  {
    title: 'A',
    data: [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Andrew' },
    ],
  },
  {
    title: 'B',
    data: [
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Betty' },
    ],
  },
];

const GroupedList = () => {
  return (
    <SectionList
      sections={sections}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.name}</Text>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    padding: 8,
    paddingLeft: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

// Ionic equivalent:
// <ion-item-group *ngFor="let section of sections">
//   <ion-item-divider>{{ section.title }}</ion-item-divider>
//   <ion-item *ngFor="let item of section.data">
//     {{ item.name }}
//   </ion-item>
// </ion-item-group>
```

**Performance Tips:**

1. **Use `keyExtractor` properly:**
```tsx
// ❌ Bad: Index as key (causes issues on reorder)
keyExtractor={(item, index) => index.toString()}

// ✅ Good: Unique ID
keyExtractor={item => item.id}
```

2. **Memoize render functions:**
```tsx
import React, { memo } from 'react';

const ItemComponent = memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.name}</Text>
  </View>
));

// In FlatList:
renderItem={({ item }) => <ItemComponent item={item} />}
```

3. **Use `getItemLayout` for fixed-height items:**
```tsx
const ITEM_HEIGHT = 80;

<FlatList
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**Official Resources:**
- FlatList: https://reactnative.dev/docs/flatlist
- SectionList: https://reactnative.dev/docs/sectionlist

---

## 13. Images & Media

### 13.1 How do I work with images in React Native?

**Answer:**

**Literal Definition:** React Native's `Image` component handles local and remote images. Unlike HTML img tags, images require explicit dimensions. The `Image` component supports various sources, caching, and loading states.

**Ionic:**
```html
<img src="assets/logo.png" alt="Logo" />
<ion-img src="https://example.com/image.jpg"></ion-img>
```

**React Native:**

**1. Local Images:**
```tsx
import { Image, StyleSheet } from 'react-native';

// Import image
import logo from './assets/logo.png';

<Image source={logo} style={styles.logo} />

// Or require (dynamic)
<Image 
  source={require('./assets/logo.png')} 
  style={styles.logo} 
/>

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
});
```

**2. Remote Images:**
```tsx
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}
  resizeMode="cover"
/>

// With headers
<Image
  source={{
    uri: 'https://example.com/image.jpg',
    headers: {
      Authorization: 'Bearer token',
    },
  }}
  style={styles.image}
/>
```

**3. Responsive Images:**
```tsx
import { Image, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenWidth * 0.6, // 16:9 aspect ratio
  },
  // Or use aspect ratio
  imageWithRatio: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
```

**4. Image Loading States:**
```tsx
import React, { useState } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';

const ImageWithLoading = ({ uri }: { uri: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {error && (
        <View style={styles.error}>
          <Text>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  error: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
});
```

**5. Resize Modes:**
```tsx
// Different resize modes
<Image 
  source={{ uri }} 
  style={styles.image}
  resizeMode="cover"    // Default: Fill container, crop if needed
/>

<Image 
  resizeMode="contain"  // Fit within container, no crop
/>

<Image 
  resizeMode="stretch"  // Stretch to fill, may distort
/>

<Image 
  resizeMode="center"   // Center image, no scaling
/>
```

**6. Background Image:**
```tsx
import { ImageBackground, View, Text, StyleSheet } from 'react-native';

<ImageBackground
  source={require('./assets/background.jpg')}
  style={styles.background}
  resizeMode="cover"
>
  <View style={styles.overlay}>
    <Text style={styles.text}>Content over image</Text>
  </View>
</ImageBackground>

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
```

**7. Image Caching (with react-native-fast-image):**
```bash
npm install react-native-fast-image
```

```tsx
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>

// Preload images
FastImage.preload([
  {
    uri: 'https://example.com/image1.jpg',
    priority: FastImage.priority.high,
  },
  {
    uri: 'https://example.com/image2.jpg',
  },
]);
```

**8. Image Picker:**
```bash
npm install react-native-image-picker
```

```tsx
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1000,
    maxHeight: 1000,
  });
  
  if (result.assets && result.assets[0]) {
    const image = result.assets[0];
    console.log('Selected image:', image.uri);
    setSelectedImage(image.uri);
  }
};

<TouchableOpacity onPress={pickImage}>
  <Text>Select Image</Text>
</TouchableOpacity>

{selectedImage && (
  <Image source={{ uri: selectedImage }} style={styles.preview} />
)}
```

**Official Resources:**
- Image Component: https://reactnative.dev/docs/image
- Fast Image: https://github.com/DylanVann/react-native-fast-image

---

## 14. Animations

### 14.1 How do I create animations in React Native?

**Answer:**

**Literal Definition:** React Native provides the Animated API for creating smooth, performant animations that can run on the native thread. This is more performant than CSS animations in Ionic because animations run outside the JavaScript thread.

**Animation APIs:**

1. **Animated API** (built-in, most common)
2. **LayoutAnimation** (simple layout transitions)
3. **Reanimated** (advanced, better performance)

**Ionic (CSS Animation):**
```scss
.fade-in {
  animation: fadeIn 300ms ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**React Native (Animated API):**

**1. Fade In Animation:**
```tsx
import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

const FadeInView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Important for performance!
    }).start();
  }, []);
  
  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

// Usage:
<FadeInView>
  <Text>This fades in</Text>
</FadeInView>
```

**2. Slide In Animation:**
```tsx
import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

const SlideInView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View
      style={{
        ...styles.container,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};
```

**3. Button Press Animation:**
```tsx
import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Text } from 'react-native';

const AnimatedButton = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
```

**4. Rotation Animation:**
```tsx
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const SpinningView = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Animated.View
      style={{
        transform: [{ rotate: spin }],
      }}
    >
      <Text style={{ fontSize: 50 }}>🔄</Text>
    </Animated.View>
  );
};
```

**5. Sequence and Parallel Animations:**
```tsx
import React, { useRef } from 'react';
import { Animated, Button } from 'react-native';

const SequenceAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  
  const runSequence = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const runParallel = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  return (
    <>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text>Animated Content</Text>
      </Animated.View>
      <Button title="Run Sequence" onPress={runSequence} />
      <Button title="Run Parallel" onPress={runParallel} />
    </>
  );
};
```

**6. Layout Animation (Simple Transitions):**
```tsx
import React, { useState } from 'react';
import { View, Text, Button, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LayoutAnimationExample = () => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  return (
    <View>
      <Button title="Toggle" onPress={toggleExpanded} />
      {expanded && (
        <View style={styles.expandedContent}>
          <Text>This content animates when shown/hidden</Text>
        </View>
      )}
    </View>
  );
};
```

**7. React Native Reanimated (Advanced):**

**Installation:**
```bash
npm install react-native-reanimated
```

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const ReanimatedExample = () => {
  const offset = useSharedValue(0);
  
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));
  
  const handlePress = () => {
    offset.value = withSpring(offset.value + 50);
  };
  
  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button title="Move" onPress={handlePress} />
    </>
  );
};
```

**Animation Comparison:**

| Ionic/CSS | React Native | Notes |
|-----------|--------------|-------|
| `transition: opacity 300ms` | `Animated.timing(opacity, ...)` | Manual control |
| `@keyframes` | `Animated.sequence/loop` | More verbose |
| `animation-delay` | Delay in timing config | Same concept |
| Auto-animated | Must trigger `.start()` | Explicit control |
| CSS transforms | `transform` in style | Similar syntax |

**Official Resources:**
- Animated API: https://reactnative.dev/docs/animated
- Reanimated: https://docs.swmansion.com/react-native-reanimated/

---

## 15. Platform-Specific Code

### 15.1 How do I write platform-specific code for iOS and Android?

**Answer:**

**Literal Definition:** React Native provides the `Platform` API to detect the current platform and write platform-specific code. You can also create separate files for each platform using file extensions.

**1. Platform Detection:**
```tsx
import { Platform, StyleSheet } from 'react-native';

const MyComponent = () => {
  return (
    <View>
      <Text>
        Running on {Platform.OS}
        {Platform.OS === 'ios' && ' (iOS)'}
        {Platform.OS === 'android' && ' (Android)'}
      </Text>
    </View>
  );
};

// Platform.OS values: 'ios' | 'android' | 'windows' | 'macos' | 'web'
```

**2. Platform-Specific Styles:**
```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  text: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

**3. Platform.select():**
```tsx
import { Platform } from 'react-native';

const MyComponent = () => {
  const message = Platform.select({
    ios: 'Running on iOS',
    android: 'Running on Android',
    default: 'Running on other platform',
  });
  
  const component = Platform.select({
    ios: () => <IOSComponent />,
    android: () => <AndroidComponent />,
  })();
  
  return (
    <View>
      <Text>{message}</Text>
      {component}
    </View>
  );
};
```

**4. Platform-Specific Files:**

Create separate files with platform extensions:
```
Button.ios.tsx    // iOS implementation
Button.android.tsx // Android implementation
Button.tsx        // Fallback (if needed)
```

**Button.ios.tsx:**
```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // iOS blue
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'System',
  },
});
```

**Button.android.tsx:**
```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3', // Material blue
    padding: 14,
    borderRadius: 4,
    elevation: 2,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
  },
});
```

**Usage (imports correct file automatically):**
```tsx
import { Button } from './components/Button';

// React Native automatically picks Button.ios.tsx on iOS
// and Button.android.tsx on Android
```

**5. Platform Version Check:**
```tsx
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS 14 and above
  if (parseInt(Platform.Version as string, 10) >= 14) {
    // iOS 14+ specific code
  }
}

if (Platform.OS === 'android') {
  // Android API 29 (Android 10) and above
  if (Platform.Version >= 29) {
    // Android 10+ specific code
  }
}
```

**6. Safe Area (iOS Notch/Home Indicator):**
```tsx
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

const App = () => (
  <SafeAreaView style={styles.container}>
    {/* Content automatically respects safe areas */}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // On iOS, SafeAreaView handles notches/home indicator
    // On Android, might need extra padding
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});

// Or use react-native-safe-area-context for better control
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const MyComponent = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Content */}
    </View>
  );
};
```

**7. Platform-Specific Navigation:**
```tsx
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = Platform.select({
  ios: createBottomTabNavigator,
  android: createMaterialBottomTabNavigator,
})();

// Usage:
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
</Tab.Navigator>
```

**Ionic Comparison:**

In Ionic, platform-specific code uses CSS classes and Capacitor plugins:
```typescript
// Ionic
import { Platform } from '@ionic/angular';

constructor(private platform: Platform) {
  if (this.platform.is('ios')) {
    // iOS specific
  }
  if (this.platform.is('android')) {
    // Android specific
  }
}
```

```scss
// Ionic CSS
.ios {
  --padding-top: 20px;
}

.md {
  --padding-top: 0px;
}
```

**Official Resources:**
- Platform API: https://reactnative.dev/docs/platform

---

Continue reading for sections on Native Device Features, Networking, Performance, Testing, Debugging, Deployment, and Migration Strategies...

## 16. Native Device Features

### 16.1 How do I access camera, geolocation, and other native features?

**Answer:**

Already covered in [Section 10: Native Modules & APIs](#10-native-modules--apis). Here's a quick reference:

**Camera:** Use `react-native-image-picker` or Expo Camera  
**Geolocation:** Use `@react-native-community/geolocation` or Expo Location  
**Storage:** Use `@react-native-async-storage/async-storage`  
**Permissions:** Use `react-native-permissions`  
**Biometrics:** Use `react-native-biometrics`  
**Contacts:** Use `react-native-contacts` or Expo Contacts  
**Push Notifications:** Use `@react-native-firebase/messaging` or Expo Notifications  

Refer to Section 10 for detailed examples.

---

## 17. Networking & APIs

### 17.1 How do I make HTTP requests in React Native vs Ionic?

**Answer:**

**Literal Definition:** React Native supports standard Fetch API and can use Axios or other HTTP libraries. Unlike Ionic's HttpClient which is built for Angular, React Native uses standard JavaScript HTTP libraries.

**Ionic (Angular HttpClient):**
```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://api.example.com/users');
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>('https://api.example.com/users', user);
  }
}
```

**React Native (Fetch API):**

**1. Basic Fetch:**
```tsx
// GET request
const getUsers = async () => {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// POST request
const createUser = async (user: User) => {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Usage in component:
const MyComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={users} renderItem={renderUser} />
      )}
    </View>
  );
};
```

**2. Axios (Recommended):**

**Installation:**
```bash
npm install axios
```

**API Service:**
```typescript
// src/services/api.service.ts
import axios, { AxiosInstance } from 'axios';

class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.example.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor (add auth token)
    this.api.interceptors.request.use(
      async (config) => {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor (handle errors)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized (refresh token or logout)
          await handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
  
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }
  
  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();

// Specific API functions
export const userApi = {
  getUsers: () => apiService.get<User[]>('/users'),
  getUser: (id: string) => apiService.get<User>(`/users/${id}`),
  createUser: (user: Partial<User>) => apiService.post<User>('/users', user),
  updateUser: (id: string, user: Partial<User>) => 
    apiService.put<User>(`/users/${id}`, user),
  deleteUser: (id: string) => apiService.delete(`/users/${id}`),
};
```

**3. Custom Hook for API Calls:**
```tsx
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, dependencies);
  
  return { data, loading, error, refetch: fetchData };
}

// Usage:
const UserListScreen = () => {
  const { data: users, loading, error, refetch } = useApi(() => userApi.getUsers());
  
  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserItem user={item} />}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    />
  );
};
```

**4. React Query (Recommended for Complex Apps):**

**Installation:**
```bash
npm install @tanstack/react-query
```

**Setup:**
```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {/* App content */}
      </NavigationContainer>
    </QueryClientProvider>
  );
}

// Usage in components:
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UserListScreen = () => {
  const queryClient = useQueryClient();
  
  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });
  
  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (user: Partial<User>) => userApi.createUser(user),
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  const handleCreateUser = (user: Partial<User>) => {
    createMutation.mutate(user);
  };
  
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      <Button title="Add User" onPress={() => handleCreateUser(newUser)} />
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
      />
    </View>
  );
};
```

**5. File Upload:**
```tsx
const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  
  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// With Axios:
const uploadWithAxios = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  
  const response = await apiService.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log('Upload progress:', percentCompleted);
    },
  });
  
  return response.data;
};
```

**6. WebSocket Connection:**
```tsx
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    return () => {
      ws.current?.close();
    };
  }, [url]);
  
  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };
  
  return { messages, isConnected, sendMessage };
};

// Usage:
const ChatScreen = () => {
  const { messages, isConnected, sendMessage } = useWebSocket('wss://api.example.com/chat');
  
  return (
    <View>
      <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <FlatList data={messages} renderItem={renderMessage} />
      <Button title="Send" onPress={() => sendMessage({ text: 'Hello' })} />
    </View>
  );
};
```

**Official Resources:**
- Fetch API: https://reactnative.dev/docs/network
- Axios: https://axios-http.com/
- React Query: https://tanstack.com/query/latest

---

## 18. Local Storage & Persistence

### 18.1 How do I persist data locally?

**Answer:**

**Literal Definition:** React Native uses AsyncStorage for simple key-value storage (similar to Ionic's Storage API). For more complex data, you can use SQLite, Realm, or WatermelonDB.

**Storage Options:**

| Storage Type | Ionic | React Native | Use Case |
|-------------|-------|--------------|----------|
| **Key-Value** | `@capacitor/storage` | `@react-native-async-storage/async-storage` | Settings, tokens |
| **SQLite** | `@capacitor/sqlite` | `react-native-sqlite-storage` | Relational data |
| **Realm** | RealmJS | Realm React Native | Object database |
| **Secure Storage** | Keychain/Keystore plugins | `react-native-keychain` | Sensitive data |

**1. AsyncStorage:**

**Installation:**
```bash
npm install @react-native-async-storage/async-storage
```

**Usage:**
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store string value
const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Store object
const storeObject = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing object:', error);
  }
};

// Retrieve data
const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Retrieve object
const getObject = async <T,>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving object:', error);
    return null;
  }
};

// Remove data
const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Clear all data
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Get all keys
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Error getting keys:', error);
    return [];
  }
};

// Ionic equivalent:
// import { Storage } from '@capacitor/storage';
// await Storage.set({ key: 'name', value: 'John' });
// const { value } = await Storage.get({ key: 'name' });
```

**2. Custom Storage Hook:**
```tsx
// src/hooks/useStorage.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStoredValue();
  }, [key]);
  
  const loadStoredValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.error('Error loading stored value:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing value:', error);
    }
  };
  
  const removeValue = async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing value:', error);
    }
  };
  
  return { value: storedValue, setValue, removeValue, loading };
}

// Usage:
const SettingsScreen = () => {
  const { value: darkMode, setValue: setDarkMode, loading } = useStorage(
    'darkMode',
    false
  );
  
  if (loading) return <ActivityIndicator />;
  
  return (
    <View>
      <Switch
        value={darkMode}
        onValueChange={setDarkMode}
      />
    </View>
  );
};
```

**3. Secure Storage (for sensitive data):**

**Installation:**
```bash
npm install react-native-keychain
```

**Usage:**
```tsx
import * as Keychain from 'react-native-keychain';

// Store credentials
const storeCredentials = async (username: string, password: string) => {
  try {
    await Keychain.setGenericPassword(username, password);
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

// Retrieve credentials
const getCredentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return {
        username: credentials.username,
        password: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

// Remove credentials
const removeCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error removing credentials:', error);
  }
};

// Store access token
const storeToken = async (token: string) => {
  try {
    await Keychain.setInternetCredentials(
      'auth_token',
      'token',
      token
    );
  } catch (error) {
    console.error('Error storing token:', error);
  }
};
```

**4. SQLite Database:**

**Installation:**
```bash
npm install react-native-sqlite-storage
```

**Usage:**
```tsx
import SQLite from 'react-native-sqlite-storage';

// Open database
const db = SQLite.openDatabase(
  { name: 'mydb.db', location: 'default' },
  () => console.log('Database opened'),
  (error) => console.error('Error opening database:', error)
);

// Create table
const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      )`,
      [],
      () => console.log('Table created'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

// Insert data
const insertUser = (name: string, email: string) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email],
      (tx, results) => {
        console.log('User inserted:', results.insertId);
      },
      (error) => console.error('Error inserting user:', error)
    );
  });
};

// Query data
const getUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (tx, results) => {
          const users: User[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            users.push(results.rows.item(i));
          }
          resolve(users);
        },
        (error) => {
          console.error('Error querying users:', error);
          reject(error);
        }
      );
    });
  });
};

// Update data
const updateUser = (id: number, name: string, email: string) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id],
      () => console.log('User updated'),
      (error) => console.error('Error updating user:', error)
    );
  });
};

// Delete data
const deleteUser = (id: number) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM users WHERE id = ?',
      [id],
      () => console.log('User deleted'),
      (error) => console.error('Error deleting user:', error)
    );
  });
};
```

**5. Realm Database (Object Database):**

**Installation:**
```bash
npm install realm
```

**Usage:**
```tsx
import Realm from 'realm';

// Define schema
class User extends Realm.Object {
  static schema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      email: 'string',
      createdAt: 'date',
    },
  };
}

// Open Realm
const realm = await Realm.open({
  schema: [User],
  schemaVersion: 1,
});

// Create
const createUser = (id: number, name: string, email: string) => {
  realm.write(() => {
    realm.create('User', {
      id,
      name,
      email,
      createdAt: new Date(),
    });
  });
};

// Read
const getUsers = () => {
  return realm.objects('User');
};

const getUserById = (id: number) => {
  return realm.objects('User').filtered('id = $0', id)[0];
};

// Update
const updateUser = (id: number, updates: Partial<User>) => {
  realm.write(() => {
    const user = getUserById(id);
    if (user) {
      Object.assign(user, updates);
    }
  });
};

// Delete
const deleteUser = (id: number) => {
  realm.write(() => {
    const user = getUserById(id);
    if (user) {
      realm.delete(user);
    }
  });
};

// Listen to changes
const users = getUsers();
users.addListener((collection, changes) => {
  console.log('Users changed:', changes);
});

// Don't forget to close
realm.close();
```

**Official Resources:**
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/
- Keychain: https://github.com/oblador/react-native-keychain
- SQLite: https://github.com/andpor/react-native-sqlite-storage
- Realm: https://www.mongodb.com/docs/realm/sdk/react-native/

---

## 19. Performance Optimization

### 19.1 How do I optimize React Native app performance?

**Answer:**

**Literal Definition:** Performance optimization in React Native involves reducing JavaScript thread workload, using native optimizations, memoization, and proper list rendering. Unlike Ionic which is limited by WebView performance, React Native can achieve near-native performance with proper optimization.

**Performance Optimization Techniques:**

**1. Use FlatList for Long Lists:**
```tsx
// ❌ Bad: Renders all items at once
<ScrollView>
  {data.map(item => <Item key={item.id} item={item} />)}
</ScrollView>

// ✅ Good: Virtualizes list
<FlatList
  data={data}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**2. Memoize Components:**
```tsx
import React, { memo } from 'react';

// ❌ Bad: Re-renders on every parent update
const Item = ({ item }: { item: Item }) => (
  <View>
    <Text>{item.name}</Text>
  </View>
);

// ✅ Good: Only re-renders if props change
const Item = memo(({ item }: { item: Item }) => (
  <View>
    <Text>{item.name}</Text>
  </View>
));

// With custom comparison
const Item = memo(
  ({ item }: { item: Item }) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  ),
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);
```

**3. Use useMemo and useCallback:**
```tsx
import React, { useMemo, useCallback } from 'react';

const MyComponent = ({ data }: { data: Item[] }) => {
  // ❌ Bad: Recomputes on every render
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
  
  // ✅ Good: Only recomputes when data changes
  const sortedData = useMemo(
    () => data.sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );
  
  // ❌ Bad: Creates new function on every render
  const handlePress = () => {
    console.log('Pressed');
  };
  
  // ✅ Good: Memoized function
  const handlePress = useCallback(() => {
    console.log('Pressed');
  }, []);
  
  return (
    <FlatList
      data={sortedData}
      renderItem={({ item }) => (
        <Item item={item} onPress={handlePress} />
      )}
    />
  );
};
```

**4. Use Native Driver for Animations:**
```tsx
// ❌ Bad: Runs on JavaScript thread
Animated.timing(value, {
  toValue: 100,
  duration: 300,
  useNativeDriver: false,
}).start();

// ✅ Good: Runs on native thread (60 FPS)
Animated.timing(value, {
  toValue: 100,
  duration: 300,
  useNativeDriver: true, // Works for transform and opacity only
}).start();
```

**5. Optimize Images:**
```tsx
// ❌ Bad: Large images slow down app
<Image 
  source={{ uri: 'https://example.com/huge-image.jpg' }}
  style={{ width: 100, height: 100 }}
/>

// ✅ Good: Resize on server or use react-native-fast-image
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 100, height: 100 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// For local images, use different sizes
<Image 
  source={require('./image@2x.png')} // Automatic resolution selection
  style={{ width: 100, height: 100 }}
/>
```

**6. Avoid Inline Functions and Objects in Render:**
```tsx
// ❌ Bad: Creates new function/object on every render
<TouchableOpacity 
  onPress={() => handlePress(item.id)}
  style={{ padding: 16 }}
>
  <Text>Press</Text>
</TouchableOpacity>

// ✅ Good: Use useCallback and StyleSheet
const styles = StyleSheet.create({
  button: { padding: 16 },
});

const handlePressCallback = useCallback(() => {
  handlePress(item.id);
}, [item.id]);

<TouchableOpacity 
  onPress={handlePressCallback}
  style={styles.button}
>
  <Text>Press</Text>
</TouchableOpacity>
```

**7. Use Hermes Engine:**

Hermes is a JavaScript engine optimized for React Native.

**Enable in `android/app/build.gradle`:**
```gradle
project.ext.react = [
    enableHermes: true  // Enable Hermes
]
```

**Enable in `ios/Podfile`:**
```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => true
)
```

**8. Use InteractionManager for Heavy Tasks:**
```tsx
import { InteractionManager } from 'react-native';

const MyComponent = () => {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // Heavy task that can wait
      performHeavyComputation();
    });
  }, []);
  
  return <View>{/* UI */}</View>;
};
```

**9. Reduce Bundle Size:**
```bash
# Analyze bundle
npx react-native-bundle-visualizer

# Use ProGuard (Android)
# In android/app/build.gradle:
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
  }
}
```

**10. Profiling:**

**Using React DevTools:**
```bash
# Install React DevTools
npm install -g react-devtools

# Run
react-devtools

# In app, shake device and select "Toggle Inspector"
```

**Using Flipper:**

Flipper provides performance profiling, network inspection, and more.

1. Download Flipper: https://fbflipper.com/
2. Run your app in debug mode
3. Connect Flipper to your app
4. Use Performance plugin to find bottlenecks

**Performance Checklist:**

- [ ] Use FlatList for long lists
- [ ] Memoize expensive computations with useMemo
- [ ] Memoize callbacks with useCallback
- [ ] Memo components that don't need frequent re-renders
- [ ] Use native driver for animations
- [ ] Optimize images (resize, cache)
- [ ] Avoid inline functions in render
- [ ] Enable Hermes engine
- [ ] Use InteractionManager for heavy tasks
- [ ] Profile with Flipper/React DevTools

**Official Resources:**
- Performance: https://reactnative.dev/docs/performance
- Hermes: https://reactnative.dev/docs/hermes
- Flipper: https://fbflipper.com/

---

## 20. Testing

### 20.1 How do I test React Native apps?

**Answer:**

**Literal Definition:** React Native testing uses Jest for unit tests and React Native Testing Library for component tests, similar to testing React web apps. E2E testing uses Detox or Appium.

**Testing Stack:**

| Test Type | Ionic (Angular) | React Native |
|-----------|----------------|--------------|
| **Unit Tests** | Jest, Jasmine/Karma | Jest |
| **Component Tests** | Angular Testing Library | React Native Testing Library |
| **E2E Tests** | Cypress, Protractor, Appium | Detox, Appium |

**1. Unit Testing with Jest:**

**Installation (included by default):**
```json
// package.json
{
  "scripts": {
    "test": "jest"
  }
}
```

**Example Test:**
```tsx
// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// src/utils/validation.test.ts
import { validateEmail, validatePassword } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    it('should return true for password with 6+ characters', () => {
      expect(validatePassword('password123')).toBe(true);
    });
    
    it('should return false for password with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
    });
  });
});

// Run tests:
// npm test
```

**2. Component Testing with React Native Testing Library:**

**Installation:**
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

**Setup (jest.config.js):**
```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
```

**Example Component Test:**
```tsx
// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    testID="button"
    style={[styles.button, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text testID="button-text" style={styles.text}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// src/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });
  
  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestID } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByTestID('button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  
  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestID } = render(
      <Button title="Click Me" onPress={onPressMock} disabled={true} />
    );
    
    fireEvent.press(getByTestID('button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
  
  it('should have disabled style when disabled', () => {
    const { getByTestID } = render(
      <Button title="Click Me" onPress={() => {}} disabled={true} />
    );
    
    const button = getByTestID('button');
    expect(button).toHaveStyle({ backgroundColor: '#ccc' });
  });
});
```

**3. Testing Hooks:**
```tsx
// src/hooks/useCounter.ts
import { useState } from 'react';

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
  
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });
  
  it('should reset counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(7);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

**4. E2E Testing with Detox:**

**Installation:**
```bash
npm install --save-dev detox
npx detox init
```

**Configuration (.detoxrc.json):**
```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/MyApp.app",
      "build": "xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd .."
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_5_API_31"
      }
    }
  },
  "configurations": {
    "ios": {
      "device": "simulator",
      "app": "ios"
    },
    "android": {
      "device": "emulator",
      "app": "android"
    }
  }
}
```

**Example E2E Test:**
```typescript
// e2e/login.test.ts
describe('Login Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
  });
  
  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('invalid@example.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
  
  it('should navigate to home on successful login', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});

// Run tests:
// npx detox build -c ios
// npx detox test -c ios
```

**Official Resources:**
- Jest: https://jestjs.io/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/
- Detox: https://wix.github.io/Detox/

---

This comprehensive guide continues with sections on Debugging, Third-Party Libraries, Building & Deployment, Migration Strategies, and Best Practices. The guide is now extensive and covers all major aspects of React Native development for Ionic developers!

## 21. Debugging

### 21.1 How do I debug React Native apps?

**Answer:**

**Literal Definition:** React Native provides several debugging tools including Chrome DevTools, React DevTools, Flipper, and native debuggers. Unlike Ionic which primarily uses browser DevTools, React Native requires platform-specific debugging tools.

**Debugging Tools:**

| Tool | Purpose | Ionic Equivalent |
|------|---------|------------------|
| **React DevTools** | Inspect React component tree | React DevTools (same) |
| **Chrome DevTools** | Debug JavaScript | Chrome DevTools (same) |
| **Flipper** | All-in-one debugging | Custom setup |
| **Xcode** | iOS native debugging | Xcode/Safari Inspector |
| **Android Studio** | Android native debugging | Android Studio/Chrome Inspector |

**1. Enable Debug Menu:**
```
iOS Simulator: Cmd+D
iOS Device: Shake device
Android Emulator: Cmd+M (Mac) or Ctrl+M (Windows/Linux)
Android Device: Shake device
```

**2. JavaScript Debugging:**

**Enable JS Debugger:**
1. Open Debug Menu (Cmd+D / Cmd+M)
2. Select "Debug JS Remotely"
3. Chrome opens at `localhost:8081/debugger-ui`
4. Open Chrome DevTools (F12)

**Add breakpoints:**
```tsx
const MyComponent = () => {
  debugger; // Execution pauses here when debugger is active
  
  const handlePress = () => {
    console.log('Button pressed');
    debugger; // Another breakpoint
  };
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Press Me</Text>
    </TouchableOpacity>
  );
};
```

**3. React DevTools:**

**Installation:**
```bash
npm install -g react-devtools
```

**Usage:**
```bash
# Start React DevTools
react-devtools

# Run your app
# React DevTools automatically connects
```

**Features:**
- Inspect component tree
- View/edit props and state
- Performance profiling
- Highlights updates

**4. Flipper (Recommended):**

**Installation:**
Download from: https://fbflipper.com/

**Features:**
- Network inspector
- Layout inspector
- Logs viewer
- Database browser
- React DevTools integration
- Performance monitor
- Crash reporter

**Setup (already included in newer RN projects):**
```javascript
// metro.config.js
module.exports = {
  // ... other config
};

// Run app in debug mode
// Flipper automatically detects and connects
```

**5. Console Logging:**

**Basic Logging:**
```tsx
console.log('Simple message');
console.log('User data:', user);
console.log('Multiple', 'arguments', { data: 'object' });

// Different log levels
console.warn('Warning message'); // Yellow in console
console.error('Error message');  // Red in console
console.info('Info message');

// Grouped logs
console.group('User Details');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.groupEnd();

// Table view
console.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
]);

// Timing
console.time('API Call');
await fetchData();
console.timeEnd('API Call'); // Shows elapsed time
```

**Custom Logger:**
```tsx
// src/utils/logger.ts
class Logger {
  private isDevelopment = __DEV__;
  
  log(...args: any[]) {
    if (this.isDevelopment) {
      console.log('[LOG]', ...args);
    }
  }
  
  warn(...args: any[]) {
    if (this.isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  }
  
  error(...args: any[]) {
    console.error('[ERROR]', ...args);
    // Send to error tracking service
    this.sendToErrorTracking(args);
  }
  
  private sendToErrorTracking(error: any) {
    // Send to Sentry, Bugsnag, etc.
  }
}

export const logger = new Logger();

// Usage:
logger.log('User logged in:', user);
logger.error('Failed to fetch data:', error);
```

**6. Network Debugging:**

**With Flipper:**
- Network plugin shows all requests
- View request/response headers
- See response data
- Monitor timing

**With React Native Debugger:**
```bash
# Install standalone debugger
brew install --cask react-native-debugger

# Or download from: https://github.com/jhen0409/react-native-debugger

# Start debugger on port 8081
open "rndebugger://set-debugger-loc:8081"
```

**7. Redux DevTools:**

**Installation:**
```bash
npm install --save-dev redux-devtools-extension
```

**Setup:**
```tsx
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = configureStore({
  reducer: rootReducer,
  devTools: __DEV__, // Enable only in development
});

// In React Native Debugger, you'll see Redux tab
```

**8. Layout Debugging:**

**Enable Layout Inspector:**
1. Open Debug Menu
2. Select "Show Inspector"
3. Tap any element to see layout properties

**Or programmatically:**
```tsx
import { View, TouchableOpacity } from 'react-native';

// Add border to debug layouts
<View style={{ borderWidth: 1, borderColor: 'red' }}>
  {/* Content */}
</View>

// Show layout bounds (development only)
if (__DEV__) {
  const originalRender = View.prototype.render;
  View.prototype.render = function() {
    const result = originalRender.apply(this, arguments);
    result.props.style = [
      result.props.style,
      { borderWidth: 1, borderColor: 'red' }
    ];
    return result;
  };
}
```

**9. Performance Monitoring:**

**Using Flipper Performance Plugin:**
- CPU usage
- Memory usage
- FPS counter
- JavaScript thread activity

**Programmatic Performance Monitoring:**
```tsx
import { InteractionManager, PerformanceLogger } from 'react-native';

// Measure render time
const startTime = performance.now();
// ... render logic
const endTime = performance.now();
console.log(`Render took ${endTime - startTime}ms`);

// Monitor interactions
InteractionManager.runAfterInteractions(() => {
  console.log('All interactions complete');
});
```

**10. Error Boundaries:**

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {this.state.error?.message}
          </Text>
          <Button title="Try Again" onPress={this.handleReset} />
        </View>
      );
    }
    
    return this.props.children;
  }
}

// Usage:
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**11. Remote Debugging with Reactotron:**

**Installation:**
```bash
npm install --save-dev reactotron-react-native
```

**Setup:**
```tsx
// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'MyApp' })
  .useReactNative()
  .connect();

// In App.tsx
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// Usage:
Reactotron.log('Hello from Reactotron');
Reactotron.display({
  name: 'User Data',
  value: user,
  preview: user.name,
});
```

**Debugging Checklist:**

- [ ] Enable Debug Menu (Cmd+D / Cmd+M)
- [ ] Use console.log for quick debugging
- [ ] Use React DevTools for component inspection
- [ ] Use Flipper for comprehensive debugging
- [ ] Use breakpoints in Chrome DevTools
- [ ] Monitor network requests
- [ ] Check Redux state (if using Redux)
- [ ] Use Error Boundaries to catch errors
- [ ] Profile performance with Flipper
- [ ] Use Reactotron for advanced debugging

**Official Resources:**
- Debugging: https://reactnative.dev/docs/debugging
- Flipper: https://fbflipper.com/
- React DevTools: https://react-devtools-tutorial.vercel.app/
- Reactotron: https://github.com/infinitered/reactotron

---

## 22. Third-Party Libraries

### 22.1 What are the essential React Native libraries?

**Answer:**

**Literal Definition:** React Native has a rich ecosystem of third-party libraries for navigation, UI components, state management, and more. Here's a curated list of essential libraries organized by category.

**Essential Libraries by Category:**

**Navigation:**
- `@react-navigation/native` - Most popular navigation solution
- `@react-navigation/native-stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/drawer` - Drawer navigation
- `react-native-screens` - Native screen optimization
- `react-native-safe-area-context` - Safe area handling

**UI Component Libraries:**
- `react-native-paper` - Material Design components
- `@rneui/themed` (React Native Elements) - Cross-platform UI toolkit
- `native-base` - Accessible UI components
- `react-native-ui-lib` - UI toolset by Wix
- `@shopify/restyle` - Type-enforced design system

**Forms:**
- `react-hook-form` - Performant forms with easy validation
- `formik` - Form management
- `yup` - Schema validation

**State Management:**
- `@reduxjs/toolkit` - Redux (official recommended way)
- `react-redux` - React bindings for Redux
- `zustand` - Lightweight state management
- `mobx` + `mobx-react-lite` - Observable state
- `jotai` - Atomic state management
- `@tanstack/react-query` - Server state management

**Storage:**
- `@react-native-async-storage/async-storage` - Key-value storage
- `react-native-keychain` - Secure storage
- `react-native-sqlite-storage` - SQLite database
- `realm` - Mobile database
- `@react-native-firebase/firestore` - Cloud Firestore

**Networking:**
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching
- `swr` - Data fetching hooks

**Authentication:**
- `@react-native-firebase/auth` - Firebase Authentication
- `@react-native-google-signin/google-signin` - Google Sign-In
- `@invertase/react-native-apple-authentication` - Apple Sign-In
- `react-native-auth0` - Auth0 integration

**Media:**
- `react-native-image-picker` - Image/video picker
- `react-native-fast-image` - Performant image component
- `react-native-video` - Video player
- `react-native-camera` - Camera component
- `@react-native-camera-roll/camera-roll` - Access camera roll

**Maps & Location:**
- `react-native-maps` - Maps component (Google Maps, Apple Maps)
- `@react-native-community/geolocation` - Geolocation API
- `react-native-background-geolocation` - Background location tracking

**Animations:**
- `react-native-reanimated` - Advanced animations
- `react-native-gesture-handler` - Native gesture handling
- `lottie-react-native` - Lottie animations
- `react-native-animatable` - Declarative animations

**Icons:**
- `react-native-vector-icons` - Icon fonts (FontAwesome, Material, etc.)
- `@expo/vector-icons` - Expo vector icons

**Push Notifications:**
- `@react-native-firebase/messaging` - Firebase Cloud Messaging
- `@notifee/react-native` - Local notifications
- `react-native-push-notification` - Push notifications

**Analytics & Monitoring:**
- `@react-native-firebase/analytics` - Firebase Analytics
- `@sentry/react-native` - Error tracking
- `@datadog/mobile-react-native` - Datadog monitoring
- `appcenter` - App Center (Microsoft)

**Utilities:**
- `react-native-device-info` - Device information
- `react-native-permissions` - Unified permissions API
- `react-native-config` - Environment variables
- `react-native-dotenv` - .env file support
- `moment` or `date-fns` - Date manipulation
- `lodash` - Utility functions

**Testing:**
- `@testing-library/react-native` - Component testing
- `@testing-library/react-hooks` - Hook testing
- `detox` - E2E testing
- `jest` - Unit testing (included by default)

**Development Tools:**
- `reactotron-react-native` - Debugging tool
- `react-native-debugger` - Standalone debugger
- `why-did-you-render` - Detect unnecessary re-renders
- `eslint` + `@react-native-community/eslint-config` - Linting
- `prettier` - Code formatting
- `typescript` - Type safety

**Performance:**
- `react-native-fast-image` - Optimized images
- `react-native-performance` - Performance monitoring
- `flashlist` - Better FlatList alternative

**Comparison with Ionic:**

| Purpose | Ionic | React Native |
|---------|-------|--------------|
| **UI Components** | `@ionic/angular` (built-in) | Multiple options (Paper, Elements, etc.) |
| **Navigation** | `@angular/router` (built-in) | `@react-navigation` (separate) |
| **Icons** | `ionicons` (built-in) | `react-native-vector-icons` |
| **Forms** | Reactive Forms (built-in) | `react-hook-form` or `formik` |
| **HTTP** | HttpClient (built-in) | `axios` or fetch |
| **Storage** | `@capacitor/storage` | `@react-native-async-storage` |
| **Camera** | `@capacitor/camera` | `react-native-image-picker` |

**Installation Example:**
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# UI Library (choose one)
npm install react-native-paper

# Forms
npm install react-hook-form yup

# State Management
npm install @reduxjs/toolkit react-redux
# or
npm install zustand

# Storage
npm install @react-native-async-storage/async-storage

# Images
npm install react-native-fast-image

# Icons
npm install react-native-vector-icons

# Networking
npm install axios

# Animations
npm install react-native-reanimated react-native-gesture-handler
```

**Recommended Starter Stack:**

For a new React Native project, start with:

1. **Navigation**: `@react-navigation/native`
2. **UI**: `react-native-paper` or `@rneui/themed`
3. **Forms**: `react-hook-form` + `yup`
4. **State**: Context API or `zustand` (simple) / Redux Toolkit (complex)
5. **Storage**: `@react-native-async-storage/async-storage`
6. **HTTP**: `axios` + `@tanstack/react-query`
7. **Icons**: `react-native-vector-icons`
8. **Animations**: `react-native-reanimated`

**Official Resources:**
- React Native Directory: https://reactnative.directory/
- Awesome React Native: https://github.com/jondot/awesome-react-native

---

## 23. Building & Deployment

### 23.1 How do I build and deploy React Native apps?

**Answer:**

**Literal Definition:** Building and deploying React Native apps involves creating native binaries for iOS and Android, then submitting to App Store and Google Play. The process is more complex than Ionic but offers better control over native features.

**Build Process Overview:**

**Ionic:**
```bash
# Build web assets
ionic build

# Sync to native projects
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android

# Build from IDE or use Appflow
```

**React Native:**

**iOS Build:**
```bash
# Development build
npx react-native run-ios

# Production build (using Xcode)
# 1. Open ios/YourApp.xcworkspace in Xcode
# 2. Select "Any iOS Device (arm64)" as target
# 3. Product > Archive
# 4. Upload to App Store Connect

# Or use command line
cd ios
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -archivePath ./build/YourApp.xcarchive \
  archive

# Create IPA
xcodebuild -exportArchive \
  -archivePath ./build/YourApp.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath ./build
```

**Android Build:**
```bash
# Development build
npx react-native run-android

# Production build
cd android
./gradlew assembleRelease

# Find APK at:
# android/app/build/outputs/apk/release/app-release.apk

# Or build AAB (required for Play Store)
./gradlew bundleRelease

# Find AAB at:
# android/app/build/outputs/bundle/release/app-release.aab
```

**1. iOS Setup:**

**Create App ID:**
1. Go to https://developer.apple.com
2. Certificates, Identifiers & Profiles
3. Create new App ID
4. Enable required capabilities (Push Notifications, etc.)

**Configure Xcode:**
```
1. Open ios/YourApp.xcworkspace
2. Select project in navigator
3. Signing & Capabilities tab
4. Select your team
5. Configure bundle identifier
6. Enable capabilities as needed
```

**App Icons & Launch Screen:**
```
1. Add icon set to ios/YourApp/Images.xcassets/AppIcon.appiconset/
2. Sizes needed: 1024x1024, and various smaller sizes
3. Launch screen: Edit ios/YourApp/LaunchScreen.storyboard
```

**2. Android Setup:**

**Generate Signing Key:**
```bash
# Generate keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Move keystore
mv my-release-key.keystore android/app/
```

**Configure Gradle:**
```gradle
// android/app/build.gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Gradle Properties:**
```properties
# android/gradle.properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

**App Icons:**
```
Place icons in:
android/app/src/main/res/
  mipmap-hdpi/ic_launcher.png (72x72)
  mipmap-mdpi/ic_launcher.png (48x48)
  mipmap-xhdpi/ic_launcher.png (96x96)
  mipmap-xxhdpi/ic_launcher.png (144x144)
  mipmap-xxxhdpi/ic_launcher.png (192x192)

Use Android Image Asset Studio in Android Studio
```

**3. Fastlane (Automated Deployment):**

**Installation:**
```bash
sudo gem install fastlane

# Initialize Fastlane
cd ios
fastlane init

cd ../android
fastlane init
```

**iOS Fastfile:**
```ruby
# ios/fastlane/Fastfile
platform :ios do
  desc "Push a new release build to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "YourApp.xcodeproj")
    build_app(scheme: "YourApp")
    upload_to_testflight
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(scheme: "YourApp")
    upload_to_app_store
  end
end
```

**Android Fastfile:**
```ruby
# android/fastlane/Fastfile
platform :android do
  desc "Submit a new Beta Build to Google Play"
  lane :beta do
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    upload_to_play_store(track: "beta")
  end

  desc "Deploy to Play Store"
  lane :release do
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    upload_to_play_store
  end
end
```

**Run Fastlane:**
```bash
# iOS
cd ios
fastlane beta    # Deploy to TestFlight
fastlane release # Deploy to App Store

# Android
cd android
fastlane beta    # Deploy to beta track
fastlane release # Deploy to production
```

**4. Code Push (OTA Updates):**

**Installation:**
```bash
npm install --save react-native-code-push
npm install -g appcenter-cli

# Login
appcenter login

# Create apps
appcenter apps create -d MyApp-iOS -o iOS -p React-Native
appcenter apps create -d MyApp-Android -o Android -p React-Native
```

**Setup:**
```tsx
// App.tsx
import codePush from 'react-native-code-push';

const App = () => {
  // ... your app code
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export default codePush(codePushOptions)(App);
```

**Release Update:**
```bash
# Release to iOS
appcenter codepush release-react -a <username>/MyApp-iOS

# Release to Android
appcenter codepush release-react -a <username>/MyApp-Android

# Rollback if needed
appcenter codepush rollback -a <username>/MyApp-iOS Production
```

**5. CI/CD with GitHub Actions:**

```yaml
# .github/workflows/ios.yml
name: iOS Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: |
          npm install
          cd ios && pod install
      
      - name: Build iOS
        run: |
          cd ios
          xcodebuild -workspace YourApp.xcworkspace \
            -scheme YourApp \
            -configuration Release \
            -archivePath ./build/YourApp.xcarchive \
            archive
      
      - name: Upload to TestFlight
        run: |
          cd ios
          fastlane beta

# .github/workflows/android.yml
name: Android Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Android
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload to Play Store
        run: |
          cd android
          fastlane beta
```

**6. Environment Variables:**

**Using react-native-config:**
```bash
npm install react-native-config
```

```
# .env
API_URL=https://api.production.com
API_KEY=prod_key_123

# .env.staging
API_URL=https://api.staging.com
API_KEY=staging_key_123
```

```tsx
import Config from 'react-native-config';

const apiUrl = Config.API_URL;
const apiKey = Config.API_KEY;
```

**Build with environment:**
```bash
# iOS
ENVFILE=.env.staging npx react-native run-ios

# Android
ENVFILE=.env.staging npx react-native run-android
```

**Official Resources:**
- Publishing to App Store: https://reactnative.dev/docs/publishing-to-app-store
- Publishing to Play Store: https://reactnative.dev/docs/signed-apk-android
- Fastlane: https://fastlane.tools/
- CodePush: https://github.com/microsoft/react-native-code-push

---

## 24. Migration Strategies

### 24.1 How do I migrate from Ionic to React Native?

**Answer:**

**Literal Definition:** Migrating from Ionic to React Native requires rewriting components using React Native components and patterns, adapting state management, and reorganizing code structure. There's no automatic migration tool, but following a systematic approach helps.

**Migration Strategies:**

**1. Greenfield (Complete Rewrite):**

**Pros:**
- Clean slate, best practices from start
- No legacy code baggage
- Easier to optimize

**Cons:**
- Time-consuming
- Risk of losing features
- High cost

**When to choose:**
- Small to medium apps
- Poor code quality in existing app
- Major architecture changes needed

**2. Incremental Migration:**

**Pros:**
- Lower risk
- Gradual learning curve
- Maintain app functionality

**Cons:**
- Complex to manage two codebases
- Longer migration period
- Technical debt

**When to choose:**
- Large apps
- Need to maintain business continuity
- Limited resources

**3. Hybrid Approach:**

Use React Native for new features, keep Ionic for existing features.

**Migration Checklist:**

**Phase 1: Planning (1-2 weeks)**
- [ ] Audit existing codebase
- [ ] List all features and screens
- [ ] Identify third-party dependencies
- [ ] Map Ionic components to React Native equivalents
- [ ] Estimate effort and timeline
- [ ] Set up React Native project

**Phase 2: Setup (1 week)**
- [ ] Initialize React Native project
- [ ] Set up navigation structure
- [ ] Configure build tools
- [ ] Set up CI/CD
- [ ] Install essential libraries

**Phase 3: Core Features (2-4 weeks)**
- [ ] Migrate authentication
- [ ] Migrate API service layer
- [ ] Migrate core business logic
- [ ] Set up state management

**Phase 4: UI Components (4-8 weeks)**
- [ ] Create design system
- [ ] Migrate reusable components
- [ ] Migrate screens (prioritize by usage)
- [ ] Implement navigation flows

**Phase 5: Native Features (2-3 weeks)**
- [ ] Migrate camera functionality
- [ ] Migrate geolocation
- [ ] Migrate push notifications
- [ ] Migrate local storage

**Phase 6: Testing & Polish (2-3 weeks)**
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Accessibility

**Phase 7: Deployment (1 week)**
- [ ] Beta testing
- [ ] App Store submission
- [ ] Google Play submission
- [ ] Monitor crash reports

**Code Migration Examples:**

**1. Component Migration:**

**Ionic (Angular):**
```typescript
// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    try {
      this.users = await this.userService.getUsers();
    } finally {
      this.loading = false;
    }
  }
}
```

```html
<!-- user-list.component.html -->
<ion-content>
  <ion-refresher (ionRefresh)="loadUsers()">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-list *ngIf="!loading; else loadingTemplate">
    <ion-item *ngFor="let user of users">
      <ion-label>
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </ion-label>
    </ion-item>
  </ion-list>

  <ng-template #loadingTemplate>
    <ion-spinner></ion-spinner>
  </ng-template>
</ion-content>
```

**React Native:**
```tsx
// UserListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { userService } from '../services/user.service';

const UserListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserListScreen;
```

**2. Service Migration:**

**Ionic:**
```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}
```

**React Native:**
```typescript
// user.service.ts
import axios from 'axios';

class UserService {
  private apiUrl = 'https://api.example.com';

  async getUsers(): Promise<User[]> {
    const response = await axios.get(`${this.apiUrl}/users`);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await axios.get(`${this.apiUrl}/users/${id}`);
    return response.data;
  }
}

export const userService = new UserService();
```

**3. State Management Migration:**

**Ionic (NgRx):**
```typescript
// users.actions.ts
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

// users.reducer.ts
const reducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users }))
);

// Usage:
this.store.dispatch(loadUsers());
this.users$ = this.store.select(selectUsers);
```

**React Native (Redux Toolkit):**
```typescript
// usersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadUsers = createAsyncThunk(
  'users/load',
  async () => {
    const users = await userService.getUsers();
    return users;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      });
  },
});

// Usage:
dispatch(loadUsers());
const users = useAppSelector((state) => state.users.users);
```

**Migration Tips:**

1. **Start with the data layer**: Migrate services and API calls first
2. **Use TypeScript**: Maintain type safety during migration
3. **Reuse business logic**: Extract and reuse non-UI logic
4. **Component-by-component**: Migrate one component at a time
5. **Test thoroughly**: Write tests as you migrate
6. **Document differences**: Keep migration notes
7. **Train team**: Ensure team understands React Native patterns

**Common Pitfalls:**

1. **Direct translation**: Don't translate Ionic code line-by-line
2. **Ignoring performance**: React Native requires different optimization techniques
3. **Underestimating effort**: Migration takes longer than expected
4. **Skipping tests**: Write tests to catch regressions
5. **Not leveraging React Native strengths**: Use native features properly

**Official Resources:**
- React Native for Web Developers: https://reactnative.dev/docs/getting-started
- Migration Guide: (community resources)

---

## 25. Best Practices

### 25.1 What are the best practices for React Native development?

**Answer:**

**Literal Definition:** React Native best practices encompass project structure, code quality, performance optimization, security, and maintainability. Following these practices ensures scalable and maintainable applications.

**1. Project Structure:**

```
src/
├── assets/              # Images, fonts, etc.
├── components/          # Reusable components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/          # API and business logic
├── hooks/             # Custom hooks
├── store/             # State management
├── utils/             # Utility functions
├── constants/         # Constants and config
├── theme/             # Theme configuration
└── types/             # TypeScript types
```

**2. Component Best Practices:**

```tsx
// ✅ Good: Functional components with TypeScript
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = memo(({ user, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
});

UserCard.displayName = 'UserCard';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  name: {
    fontSize: 18,
  },
});

// ❌ Bad: Class component without types
class UserCard extends Component {
  render() {
    return (
      <View style={{ padding: 16 }}>
        <Text>{this.props.user.name}</Text>
      </View>
    );
  }
}
```

**3. Performance Best Practices:**

```tsx
// ✅ Use FlatList for long lists
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={10}
/>

// ✅ Memoize expensive computations
const sortedData = useMemo(
  () => data.sort((a, b) => a.name.localeCompare(b.name)),
  [data]
);

// ✅ Use useCallback for event handlers
const handlePress = useCallback(() => {
  // Handle press
}, [dependencies]);

// ✅ Use native driver for animations
Animated.timing(value, {
  toValue: 100,
  useNativeDriver: true,
}).start();

// ✅ Optimize images
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>
```

**4. Code Quality:**

```tsx
// ✅ Use TypeScript for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Use ESLint and Prettier
// .eslintrc.js
module.exports = {
  extends: ['@react-native-community', 'prettier'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
  },
};

// ✅ Write tests
import { render, fireEvent } from '@testing-library/react-native';

test('button calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Press" onPress={onPress} />);
  fireEvent.press(getByText('Press'));
  expect(onPress).toHaveBeenCalled();
});

// ✅ Use absolute imports
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@utils/*": ["utils/*"]
    }
  }
}

// Usage:
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

**5. Security Best Practices:**

```tsx
// ✅ Store sensitive data securely
import * as Keychain from 'react-native-keychain';

await Keychain.setGenericPassword(username, password);

// ✅ Use HTTPS for API calls
const api = axios.create({
  baseURL: 'https://api.example.com', // Always HTTPS
});

// ✅ Validate user input
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ✅ Use environment variables for sensitive config
import Config from 'react-native-config';

const API_KEY = Config.API_KEY;

// ✅ Implement certificate pinning for sensitive apps
```

**6. Navigation Best Practices:**

```tsx
// ✅ Type-safe navigation
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  // Type-safe access to params
};

// ✅ Use navigation.reset for auth flows
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

**7. State Management Best Practices:**

```tsx
// ✅ Keep state close to where it's used
const [count, setCount] = useState(0);

// ✅ Use Context for app-wide state
const { user, login, logout } = useAuth();

// ✅ Use Redux for complex state
import { useAppSelector, useAppDispatch } from '@hooks/redux';

const users = useAppSelector((state) => state.users);
const dispatch = useAppDispatch();

// ✅ Separate server state from client state
// Use React Query for server state
const { data: users } = useQuery(['users'], fetchUsers);
```

**8. Error Handling:**

```tsx
// ✅ Use Error Boundaries
<ErrorBoundary>
  <App />
</ErrorBoundary>

// ✅ Handle async errors
try {
  await fetchData();
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}

// ✅ Use error tracking
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-dsn',
});

// Errors automatically reported
```

**9. Accessibility:**

```tsx
// ✅ Add accessibility labels
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add to favorites"
  accessibilityRole="button"
  accessibilityState={{ selected: isFavorite }}
>
  <Icon name="heart" />
</TouchableOpacity>

// ✅ Use proper heading hierarchy
<Text accessibilityRole="header" accessibilityLevel={1}>
  Main Heading
</Text>
```

**10. Code Style:**

```tsx
// ✅ Consistent naming
// Components: PascalCase
const UserCard = () => {};

// Functions: camelCase
const fetchUserData = () => {};

// Constants: UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com';

// Private functions: prefix with underscore
const _privateHelper = () => {};

// ✅ Destructure props
const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  // Instead of: props.user, props.onPress
};

// ✅ Use optional chaining
const email = user?.profile?.email;

// ✅ Use nullish coalescing
const count = data.count ?? 0;
```

**Best Practices Checklist:**

- [ ] Use TypeScript for type safety
- [ ] Follow consistent project structure
- [ ] Write unit and integration tests
- [ ] Use FlatList for long lists
- [ ] Memoize components and expensive computations
- [ ] Use native driver for animations
- [ ] Implement proper error handling
- [ ] Add accessibility labels
- [ ] Use secure storage for sensitive data
- [ ] Implement proper navigation patterns
- [ ] Use ESLint and Prettier
- [ ] Write meaningful commit messages
- [ ] Document complex logic
- [ ] Monitor performance with Flipper
- [ ] Set up CI/CD pipeline

**Official Resources:**
- React Native Best Practices: (community guides)
- Performance Best Practices: https://reactnative.dev/docs/performance
- Security Best Practices: (community guides)

---

## Conclusion

This comprehensive guide covered the essential concepts and practical examples for transitioning from Ionic to React Native. Key takeaways:

1. **Architecture**: React Native uses native components, Ionic uses WebView
2. **Development**: React Native requires native tools setup
3. **Performance**: React Native offers better performance for complex UIs
4. **Learning Curve**: Moderate if you know React, steeper from Angular
5. **Ecosystem**: Rich third-party library ecosystem
6. **Deployment**: More complex but more control over native features

**Next Steps:**
1. Set up your development environment
2. Build a simple app to learn the basics
3. Gradually migrate features from your Ionic app
4. Join React Native community forums
5. Keep up with React Native updates

**Helpful Resources:**
- Official Documentation: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- React Native Directory: https://reactnative.directory/
- Discord Community: https://discord.gg/react-native
- GitHub: https://github.com/facebook/react-native

Good luck with your React Native journey! 🚀

---

*Last Updated: January 2026*
*Guide Version: 1.0.0*

