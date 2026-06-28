# Java Comprehensive Guide for JavaScript/TypeScript Developers

A comprehensive guide to learning Java, specifically tailored for developers with JavaScript/TypeScript experience. This guide covers Java fundamentals, differences from JavaScript, and practical examples with comparisons.

---

## Table of Contents

1. [Introduction to Java](#1-introduction-to-java)
2. [Java vs JavaScript/TypeScript: Key Differences](#2-java-vs-javascripttypescript-key-differences)
3. [Java Installation & Setup](#3-java-installation--setup)
4. [Basic Syntax & Data Types](#4-basic-syntax--data-types)
5. [Variables & Scope](#5-variables--scope)
6. [Control Flow](#6-control-flow)
7. [Functions (Methods)](#7-functions-methods)
8. [Arrays & Collections](#8-arrays--collections)
9. [Object-Oriented Programming](#9-object-oriented-programming)
10. [Interfaces & Abstract Classes](#10-interfaces--abstract-classes)
11. [Packages & Imports](#11-packages--imports)
12. [Exception Handling](#12-exception-handling)
13. [File Operations](#13-file-operations)
14. [Streams & Lambda Expressions](#14-streams--lambda-expressions)
15. [Generics](#15-generics)
16. [Annotations](#16-annotations)
17. [Working with JSON](#17-working-with-json)
18. [HTTP Requests & APIs](#18-http-requests--apis)
19. [Database Operations (JDBC)](#19-database-operations-jdbc)
20. [Testing in Java](#20-testing-in-java)
21. [Build Tools (Maven & Gradle)](#21-build-tools-maven--gradle)
22. [Dependency Management](#22-dependency-management)
23. [Multithreading & Concurrency](#23-multithreading--concurrency)
24. [Common Patterns & Best Practices](#24-common-patterns--best-practices)
25. [Performance Optimization](#25-performance-optimization)
26. [Debugging & Development Tools](#26-debugging--development-tools)

---

## 1. Introduction to Java

### 1.1 What is Java and why should JavaScript developers learn it?

**Answer:**

**Literal Definition:** Java is a high-level, statically-typed, object-oriented programming language designed to be platform-independent through the use of the Java Virtual Machine (JVM). Unlike JavaScript which is primarily interpreted, Java code is compiled to bytecode that runs on the JVM, following the principle "Write Once, Run Anywhere" (WORA).

Java is a mature, enterprise-grade programming language widely used in:

- **Enterprise Applications**: Spring Boot, Java EE, microservices
- **Android Development**: Native Android apps
- **Big Data**: Hadoop, Apache Spark, Apache Kafka
- **Backend Services**: REST APIs, web services
- **Financial Systems**: Trading platforms, banking applications
- **Cloud Services**: AWS, Google Cloud, Azure

**Why JavaScript Developers Should Learn Java:**

1. **Enterprise Opportunities**: Many large companies use Java for backend systems
2. **Strong Typing**: Catch errors at compile-time (similar to TypeScript)
3. **Performance**: Generally faster than JavaScript for CPU-intensive tasks
4. **Android Development**: Primary language for Android apps
5. **Career Growth**: High demand for Java developers in enterprise sector
6. **Better Understanding**: Learn OOP principles deeply

**Key Characteristics:**
- **Compiled**: Java code is compiled to bytecode before execution
- **Statically Typed**: Types are checked at compile-time (like TypeScript)
- **Object-Oriented**: Everything is an object (except primitives)
- **Platform-Independent**: Runs on any system with JVM installed
- **Strongly Typed**: Type conversions must be explicit

### 1.2 What are the main differences between Java and JavaScript?

**Answer:**

**Literal Definitions:**
- **Java**: A statically-typed, compiled, object-oriented programming language that runs on the Java Virtual Machine (JVM). Despite the similar names, Java and JavaScript are fundamentally different languages with different design goals.
- **JavaScript**: A dynamically-typed, interpreted programming language originally designed for web browsers but now used in many environments including Node.js.

| Feature | JavaScript/TypeScript | Java |
|---------|---------------------|------|
| **Type System** | Dynamic (TypeScript adds static types) | Static, strongly typed |
| **Compilation** | Interpreted (JIT compiled) | Compiled to bytecode |
| **Variable Declaration** | `let`, `const`, `var` | Type declarations required |
| **Semicolons** | Optional | Required |
| **String Quotes** | Single, double, or backticks | Double quotes only |
| **Null/Undefined** | `null` and `undefined` | `null` only |
| **Equality** | `==` (loose) and `===` (strict) | `==` (value) and `equals()` method |
| **Functions** | First-class citizens | Methods belong to classes |
| **Classes** | ES6 classes (prototypal inheritance) | True class-based OOP |
| **Package Manager** | npm/yarn | Maven/Gradle |
| **Runtime** | Node.js, Browser | JVM (Java Virtual Machine) |

### 1.3 What is the Java philosophy and design principles?

**Answer:**

**Literal Definition:** Java's design principles emphasize simplicity, object orientation, robustness, security, platform independence, and high performance. The language was designed with the motto "Write Once, Run Anywhere" (WORA), meaning compiled Java code can run on any platform that has a JVM without recompilation.

Java follows these key principles:

1. **Simple, Object-Oriented, and Familiar**: Easy to learn for programmers
2. **Robust and Secure**: Strong memory management and security features
3. **Platform-Independent**: Runs on any system with JVM
4. **High Performance**: JIT compilation provides near-native performance
5. **Interpreted, Threaded, and Dynamic**: Supports multithreading natively
6. **Explicit is Better**: Everything must be declared explicitly

**JavaScript Comparison:**
- **JavaScript**: "Flexible and forgiving" (runtime errors, dynamic typing)
- **Java**: "Strict and explicit" (compile-time errors, static typing)

---

## 2. Java vs JavaScript/TypeScript: Key Differences

### 2.1 How does Java's static typing differ from JavaScript's dynamic typing?

**Answer:**

**JavaScript (Dynamic Typing):**
```javascript
// No type declaration needed
let name = "John";
name = 42; // OK - can change type

// TypeScript (Static Typing)
let name: string = "John";
// name = 42; // Error at compile time
```

**Java (Static Typing):**
```java
// Type must be declared
String name = "John";
// name = 42; // Compilation error

// Type inference with 'var' (Java 10+)
var name = "John"; // Inferred as String
// name = 42; // Still a compilation error
```

**Key Differences:**
- **JavaScript**: Types are determined at runtime
- **TypeScript**: Types are checked at compile-time but erased at runtime
- **Java**: Types are checked at compile-time and preserved at runtime
- **Java**: No implicit type coercion (must cast explicitly)

**Common Mistakes:**
```java
// ❌ Wrong - type mismatch
String name = 42;

// ❌ Wrong - cannot reassign different type
String value = "hello";
value = 123;

// ✅ Correct - explicit type conversion
String value = "hello";
int number = Integer.parseInt(value); // If value was "123"
```

### 2.2 How do variable declarations differ between JavaScript and Java?

**Answer:**

**JavaScript/TypeScript:**
```javascript
// JavaScript
let name = "John";
const age = 30;
var city = "NYC"; // Avoid in modern JS

// TypeScript
let count: number = 10;
const isActive: boolean = true;
```

**Java:**
```java
// Explicit type declarations
String name = "John";
int age = 30;
final String CITY = "NYC"; // final = constant

// Type inference (Java 10+)
var count = 10;           // Inferred as int
var isActive = true;      // Inferred as boolean

// Constants
final int MAX_SIZE = 100; // Cannot be reassigned
static final int CONSTANT = 42; // Class-level constant
```

**Key Differences:**
- **JavaScript**: `let`, `const`, `var` keywords
- **Java**: Type comes first, then variable name
- **Java**: `final` keyword for constants (like `const`)
- **Java**: Variables must be initialized before use
- **Java**: No `undefined` - uninitialized variables cause compilation error

**Naming Conventions:**
```java
// ✅ Variables: camelCase
String firstName = "John";
int userAge = 30;

// ✅ Constants: UPPER_SNAKE_CASE
final int MAX_USERS = 100;
static final String API_KEY = "abc123";

// ✅ Classes: PascalCase
class UserService {}
```

### 2.3 What is the difference between `null` in JavaScript and Java?

**Answer:**

**Literal Definitions:**
- **null (Java)**: A special literal value that can be assigned to any reference type (objects) to indicate no object. Primitive types (int, boolean, etc.) cannot be null. Accessing methods on null throws a `NullPointerException`.
- **null (JavaScript)**: An intentional absence of any object value.
- **undefined (JavaScript)**: A variable that has been declared but not assigned a value.

**JavaScript:**
```javascript
let value1 = null;        // Explicitly set to null
let value2 = undefined;   // Default for uninitialized
let value3;               // undefined

// Checking
if (value1 === null) { }
if (value2 === undefined) { }
if (value1 == null) { }   // Checks both null and undefined
```

**Java:**
```java
// Only reference types can be null
String value1 = null;     // OK
Integer value2 = null;    // OK
// int value3 = null;     // Error - primitives can't be null

// Checking for null
if (value1 == null) {
    // Handle null case
}

// Java 8+ Optional to avoid null
Optional<String> optional = Optional.ofNullable(value1);
if (optional.isPresent()) {
    String value = optional.get();
}

// Java 14+ NullPointerException with helpful messages
String name = null;
System.out.println(name.length()); // NPE with message indicating 'name' is null
```

**Key Differences:**
- **JavaScript**: Two null-like values (`null` and `undefined`)
- **Java**: One null value (only for reference types)
- **Java**: Primitives cannot be null (use wrapper classes)
- **Java**: NullPointerException is a common runtime error

**Best Practices:**
```java
// ✅ Use Optional to avoid null checks
public Optional<User> findUser(int id) {
    User user = database.find(id);
    return Optional.ofNullable(user);
}

// ✅ Use Objects.requireNonNull for validation
public void setName(String name) {
    this.name = Objects.requireNonNull(name, "Name cannot be null");
}

// ✅ Initialize collections to empty rather than null
List<String> items = new ArrayList<>(); // Not null
```

### 2.4 How does equality comparison differ between JavaScript and Java?

**Answer:**

**JavaScript:**
```javascript
// Loose equality (type coercion)
"5" == 5;   // true
0 == false; // true

// Strict equality (no coercion)
"5" === 5;   // false
0 === false; // false

// Object comparison (reference)
const obj1 = { a: 1 };
const obj2 = { a: 1 };
obj1 === obj2; // false (different references)
```

**Java:**
```java
// Primitive comparison (value)
int a = 5;
int b = 5;
a == b;  // true (compares values)

// String comparison (special case)
String s1 = "hello";
String s2 = "hello";
s1 == s2;        // true (string interning)
s1.equals(s2);   // true (value comparison)

// Object comparison (reference)
String s3 = new String("hello");
String s4 = new String("hello");
s3 == s4;        // false (different objects)
s3.equals(s4);   // true (same content)

// Custom object comparison
class Person {
    String name;
    int age;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}
```

**Key Differences:**
- **JavaScript**: `==` does type coercion, `===` does not
- **Java**: `==` compares references for objects, values for primitives
- **Java**: `.equals()` method compares object contents
- **Java**: Must override `equals()` and `hashCode()` for custom equality

**Best Practices:**
```java
// ✅ Use equals() for objects
String name1 = "John";
String name2 = "John";
if (name1.equals(name2)) { } // Correct

// ✅ Use Objects.equals() to handle null safely
if (Objects.equals(name1, name2)) { } // Safe even if name1 is null

// ✅ Use == for primitives and enums
int a = 5, b = 5;
if (a == b) { } // Correct for primitives

// ✅ Always override equals() and hashCode() together
```

---

## 3. Java Installation & Setup

### 3.1 How do you install Java (JDK)?

**Answer:**

**Literal Definition:** The JDK (Java Development Kit) is a software development environment used for developing Java applications. It includes the JRE (Java Runtime Environment), compiler (javac), debugger, and development tools. For running Java applications, only the JRE is needed, but for development, the full JDK is required.

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc

# Verify installation
java --version
javac --version
```

**Linux (Ubuntu/Debian):**
```bash
# Install OpenJDK
sudo apt update
sudo apt install openjdk-17-jdk

# Verify installation
java --version
javac --version

# Set JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

**Windows:**
1. Download JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. Run installer
3. Set JAVA_HOME environment variable
4. Add `%JAVA_HOME%\bin` to PATH
5. Verify: `java --version`

**Using SDKMAN (Version Manager - Similar to nvm):**
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash

# Install Java version
sdk install java 17.0.5-tem

# List available versions
sdk list java

# Switch versions
sdk use java 17.0.5-tem

# Set default version
sdk default java 17.0.5-tem
```

**JavaScript Comparison:**
- **Node.js**: `nvm install node` or download installer
- **Java**: `sdk install java` or system package manager

### 3.2 What is the difference between JDK, JRE, and JVM?

**Answer:**

**Literal Definitions:**
- **JVM (Java Virtual Machine)**: The runtime engine that executes Java bytecode. It provides platform independence by abstracting the underlying operating system. The JVM is responsible for memory management, garbage collection, and security.
- **JRE (Java Runtime Environment)**: Contains the JVM plus class libraries needed to run Java applications. End-users need JRE to run Java programs.
- **JDK (Java Development Kit)**: Contains JRE plus development tools like the compiler (javac), debugger, and other utilities needed to develop Java applications.

```
┌─────────────────────────────────┐
│            JDK                  │
│  ┌──────────────────────────┐   │
│  │         JRE              │   │
│  │  ┌────────────────────┐  │   │
│  │  │       JVM          │  │   │
│  │  └────────────────────┘  │   │
│  │  + Class Libraries      │   │
│  └──────────────────────────┘   │
│  + Development Tools            │
│    (javac, javadoc, etc.)       │
└─────────────────────────────────┘
```

**Components:**
- **JVM**: Runtime execution environment
- **JRE**: JVM + standard libraries (to run applications)
- **JDK**: JRE + development tools (to develop applications)

**For Developers:** Install JDK
**For End Users:** Install JRE (though modern Java distributions often include JDK)

### 3.3 How do you set up a Java project structure?

**Answer:**

**Basic Project Structure (Maven):**
```
my-project/
├── src/
│   ├── main/
│   │   ├── java/              # Java source files
│   │   │   └── com/company/app/
│   │   │       └── Main.java
│   │   └── resources/         # Config files, properties
│   │       └── application.properties
│   └── test/
│       ├── java/              # Test files
│       │   └── com/company/app/
│       │       └── MainTest.java
│       └── resources/
├── target/                    # Compiled classes (generated)
├── pom.xml                    # Maven dependencies
└── README.md
```

**JavaScript Comparison:**
```
my-project/
├── node_modules/         # Dependencies (gitignored)
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── package.json          # Dependencies
└── README.md
```

**pom.xml (Maven - like package.json):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.company</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <dependencies>
        <!-- Like npm dependencies -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.9.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

**Creating a New Project:**
```bash
# Maven
mvn archetype:generate -DgroupId=com.company -DartifactId=my-app

# Gradle
gradle init --type java-application

# Spring Boot (for web applications)
curl https://start.spring.io/starter.zip \
  -d dependencies=web \
  -d name=my-app \
  -o my-app.zip
```

---

## 4. Basic Syntax & Data Types

### 4.1 What are Java's primitive data types and how do they compare to JavaScript?

**Answer:**

**JavaScript (All numbers are floating-point):**
```javascript
let integer = 42;
let float = 3.14;
let bigInt = 9007199254740991n;
let boolean = true;
let string = "Hello";
```

**Java (Explicit Primitive Types):**
```java
// Integer types (different sizes)
byte smallNum = 127;        // 8-bit: -128 to 127
short mediumNum = 32767;    // 16-bit: -32,768 to 32,767
int number = 42;            // 32-bit: -2^31 to 2^31-1 (most common)
long bigNum = 123456789L;   // 64-bit: -2^63 to 2^63-1 (note: L suffix)

// Floating-point types
float decimal = 3.14f;      // 32-bit (note: f suffix)
double precise = 3.14159;   // 64-bit (default for decimals)

// Other types
boolean isTrue = true;      // true or false (not 0/1)
char letter = 'A';          // 16-bit Unicode character (single quotes)

// Wrapper classes (for use with collections)
Integer wrappedInt = 42;    // Can be null
Double wrappedDouble = 3.14;
Boolean wrappedBoolean = true;

// Type checking
System.out.println(((Object)number).getClass().getName()); // java.lang.Integer
```

**Key Differences:**
- **JavaScript**: One number type (64-bit float)
- **Java**: Multiple numeric types with different sizes
- **Java**: char is a distinct type (not a string)
- **Java**: Primitives cannot be null (use wrapper classes)
- **Java**: Primitives have default values (0, false, '\u0000')

**Type Ranges:**
```java
// Integer limits
System.out.println(Integer.MIN_VALUE); // -2147483648
System.out.println(Integer.MAX_VALUE); // 2147483647

// Overflow behavior
int max = Integer.MAX_VALUE;
int overflow = max + 1; // -2147483648 (wraps around)

// To prevent overflow, use long or check before operation
long bigNumber = Integer.MAX_VALUE + 1L;
```

### 4.2 How do you work with Strings in Java?

**Answer:**

**Literal Definition:** In Java, String is an immutable class representing a sequence of characters. Once created, a String object cannot be changed. For mutable string operations, use StringBuilder or StringBuffer. String literals are stored in a special memory region called the String Pool for memory efficiency.

**String Creation:**

**JavaScript:**
```javascript
let single = 'Hello';
let double = "World";
let template = `Hello ${name}`;
let multiline = `Line 1  
Line 2`;  
```

**Java:**
```java
// String literals (recommended)
String single = "Hello";
String world = "World";

// String concatenation
String message = "Hello " + name; // Simple but inefficient in loops

// String formatting (like template literals)
String formatted = String.format("Hello %s", name);

// Java 15+ Text Blocks (multiline strings)
String multiline = """
    Line 1
    Line 2
    Line 3
    """;

// StringBuilder for efficient concatenation
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString(); // "Hello World"
```

**String Methods:**
```java
String text = "  Hello World  ";

// Length
text.length();              // 15

// Trimming whitespace
text.trim();                // "Hello World"
text.strip();               // Java 11+ (handles Unicode whitespace)

// Case conversion
"hello".toUpperCase();      // "HELLO"
"HELLO".toLowerCase();      // "hello"

// Finding and checking
"hello world".indexOf("world");      // 6
"hello world".contains("world");     // true
"hello".startsWith("he");           // true
"hello".endsWith("lo");             // true

// Replacing
"hello world".replace("world", "Java"); // "hello Java"
"hello world".replaceAll("l", "L");    // "heLLo worLd"

// Splitting
String[] parts = "a,b,c".split(",");   // ["a", "b", "c"]

// Joining (Java 8+)
String joined = String.join(",", "a", "b", "c"); // "a,b,c"

// Character at index
"hello".charAt(0);          // 'h'

// Substring
"hello".substring(1, 4);    // "ell" (start inclusive, end exclusive)

// Comparison
"hello".equals("hello");    // true (content comparison)
"hello".equalsIgnoreCase("HELLO"); // true
"hello".compareTo("world"); // < 0 (lexicographic)
```

**String Immutability:**
```java
String original = "Hello";
String modified = original.concat(" World");
System.out.println(original); // "Hello" (unchanged)
System.out.println(modified); // "Hello World"

// This creates multiple String objects (inefficient)
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i; // Creates new String each iteration
}

// Use StringBuilder instead (efficient)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

**JavaScript Comparison:**
```javascript
// JavaScript
const text = "  Hello World  ";
text.trim();                    // "Hello World"
text.toUpperCase();             // "  HELLO WORLD  "
text.toLowerCase();             // "  hello world  "
text.replace("world", "JavaScript"); // "  Hello JavaScript  "
text.split(",");                // ["  Hello World  "]
["a", "b", "c"].join(",");      // "a,b,c"
```

### 4.3 How does Java's type system compare to TypeScript?

**Answer:**

**Literal Definition:** Java has a static, strongly-typed type system where all variable types must be known at compile-time and are enforced by the compiler. Unlike TypeScript's structural typing, Java uses nominal typing where type compatibility is based on explicit declarations. Java also distinguishes between primitive types (stored by value) and reference types (stored by reference).

**TypeScript:**
```typescript
// Type annotations
function greet(name: string): string {
    return `Hello, ${name}!`;
}

let age: number = 30;
const isActive: boolean = true;

// Interfaces
interface User {
    name: string;
    age: number;
}

function getUser(): User {
    return { name: "John", age: 30 };
}

// Union types
function process(value: string | number): string {
    return value.toString();
}

// Generics
function identity<T>(arg: T): T {
    return arg;
}
```

**Java:**
```java
// Type annotations (required)
public String greet(String name) {
    return "Hello, " + name + "!";
}

int age = 30;
final boolean isActive = true;

// Interfaces (more formal)
public interface User {
    String getName();
    int getAge();
}

// Implementation
public class UserImpl implements User {
    private String name;
    private int age;
    
    @Override
    public String getName() { return name; }
    
    @Override
    public int getAge() { return age; }
}

// No union types - use method overloading or common supertype
public String process(String value) {
    return value;
}

public String process(int value) {
    return String.valueOf(value);
}

// Generics
public <T> T identity(T arg) {
    return arg;
}
```

**Key Differences:**
- **TypeScript**: Types are erased at runtime (transpiled to JavaScript)
- **Java**: Types are preserved and checked at runtime
- **TypeScript**: Structural typing (duck typing)
- **Java**: Nominal typing (explicit type declarations)
- **TypeScript**: Union types (`string | number`)
- **Java**: No union types (use method overloading or supertype)
- **TypeScript**: Optional type annotations
- **Java**: Required type declarations (except `var` inference)

**Type Inference:**
```java
// Java 10+ var keyword (local variable type inference)
var name = "John";       // Inferred as String
var age = 30;            // Inferred as int
var list = new ArrayList<String>(); // Inferred as ArrayList<String>

// Still statically typed - cannot reassign different type
// name = 42; // Compilation error
```

---

## 5. Variables & Scope

### 5.1 How does variable scope work in Java compared to JavaScript?

**Answer:**

**JavaScript:**
```javascript
// Global scope
let global = "I'm global";

function outer() {
    // Function scope
    let outerVar = "I'm in outer";
    
    function inner() {
        // Inner function scope
        let innerVar = "I'm in inner";
        console.log(global);    // Can access global
        console.log(outerVar);  // Can access outer
        console.log(innerVar);  // Can access inner
    }
    
    inner();
}

// Block scope (let/const)
if (true) {
    let blockVar = "I'm in block";
}
// console.log(blockVar); // ReferenceError
```

**Java:**
```java
public class ScopeExample {
    // Class-level (instance) variables
    private String instanceVar = "I'm an instance variable";
    
    // Class-level (static) variables
    private static String staticVar = "I'm a static variable";
    
    public void outer() {
        // Method-level variables
        String outerVar = "I'm in outer";
        
        // Block scope
        if (true) {
            String blockVar = "I'm in block";
            System.out.println(outerVar);  // Can access method variable
            System.out.println(blockVar);  // Can access block variable
        }
        // System.out.println(blockVar); // Error - out of scope
        
        // Inner classes can access outer class variables
        class Inner {
            void innerMethod() {
                System.out.println(instanceVar); // Can access instance var
                System.out.println(outerVar);    // Can access method var
            }
        }
    }
}
```

**Key Differences:**
- **JavaScript**: Function and block scope (`let`/`const`)
- **Java**: Method and block scope
- **Java**: No nested function scope (use inner classes)
- **Java**: Instance variables (per object) vs static variables (per class)
- **JavaScript**: Closures are common
- **Java**: Inner classes serve similar purpose

**Variable Shadowing:**
```java
public class Shadowing {
    private int value = 10; // Instance variable
    
    public void method() {
        int value = 20; // Local variable shadows instance variable
        System.out.println(value);       // 20 (local)
        System.out.println(this.value);  // 10 (instance)
    }
    
    public void blockExample() {
        int x = 10;
        if (true) {
            int x = 20; // Error - cannot redeclare in inner scope
        }
    }
}
```

### 5.2 What are instance variables vs static variables in Java?

**Answer:**

**Literal Definitions:**
- **Instance Variables**: Variables declared at the class level without the `static` keyword. Each object (instance) of the class has its own copy of instance variables. They are stored in the heap and exist as long as the object exists.
- **Static Variables**: Variables declared with the `static` keyword at the class level. They belong to the class itself rather than to any specific instance. There is only one copy of a static variable shared by all instances of the class. They are stored in the method area and exist for the lifetime of the program.

**Java:**
```java
public class User {
    // Instance variables (each object has its own copy)
    private String name;
    private int age;
    
    // Static variable (shared by all instances)
    private static int userCount = 0;
    
    public User(String name, int age) {
        this.name = name;
        this.age = age;
        userCount++; // Increment for each new instance
    }
    
    // Instance method (can access both instance and static variables)
    public void printInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Total users: " + userCount);
    }
    
    // Static method (can only access static variables)
    public static int getUserCount() {
        // System.out.println(name); // Error - cannot access instance variable
        return userCount;
    }
}

// Usage
User user1 = new User("John", 30);
User user2 = new User("Jane", 25);

user1.printInfo(); // Name: John, Age: 30, Total users: 2
user2.printInfo(); // Name: Jane, Age: 25, Total users: 2

System.out.println(User.getUserCount()); // 2 (accessed via class)
```

**JavaScript Comparison:**
```javascript
class User {
    // Instance properties
    constructor(name, age) {
        this.name = name;
        this.age = age;
        User.userCount++; // Access static via class name
    }
    
    // Instance method
    printInfo() {
        console.log(`Name: ${this.name}`);
        console.log(`Age: ${this.age}`);
        console.log(`Total users: ${User.userCount}`);
    }
    
    // Static property (ES2022+)
    static userCount = 0;
    
    // Static method
    static getUserCount() {
        return User.userCount;
    }
}
```

**Key Differences:**
- **Instance Variables**: Tied to objects, accessed via `object.variable`
- **Static Variables**: Tied to class, accessed via `ClassName.variable`
- **Static Methods**: Cannot access instance variables
- **Memory**: Instance variables per object, static variables once per class

---

## 6. Control Flow

### 6.1 How do if/else statements differ between JavaScript and Java?

**Answer:**

**JavaScript:**
```javascript
if (condition) {
    // code
} else if (anotherCondition) {
    // code
} else {
    // code
}

// Ternary
const result = condition ? "yes" : "no";
```

**Java:**
```java
if (condition) {
    // code
} else if (anotherCondition) {  // Note: else if (two words)
    // code
} else {
    // code
}

// Ternary (same as JavaScript)
String result = condition ? "yes" : "no";

// Java 14+ Switch Expressions
String result = switch (value) {
    case 1 -> "one";
    case 2 -> "two";
    default -> "other";
};
```

**Key Differences:**
- **Java**: Condition must be boolean (no truthy/falsy values)
- **Java**: Braces recommended even for single statements
- **Java**: Semicolons required

**Truthy/Falsy Differences:**
```javascript
// JavaScript - many truthy/falsy values
if (0) { }          // false
if ("") { }         // false
if ([]) { }         // true
if ({}) { }         // true
if (null) { }       // false
if (undefined) { } // false
```

```java
// Java - only boolean values allowed
// if (0) { }        // Error - int is not boolean
// if ("") { }       // Error - String is not boolean
// if (null) { }     // Error - null is not boolean

// Must explicitly check
if (value != 0) { }
if (!str.isEmpty()) { }
if (obj != null) { }
```

### 6.2 How do loops work in Java compared to JavaScript?

**Answer:**

**For Loops:**

**JavaScript:**
```javascript
// Traditional for loop
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// for...of (iterates values)
const items = [1, 2, 3];
for (const item of items) {
    console.log(item);
}

// for...in (iterates keys/indices)
for (const index in items) {
    console.log(index, items[index]);
}

// forEach method
items.forEach((item, index) => {
    console.log(index, item);
});
```

**Java:**
```java
// Traditional for loop (same as JavaScript)
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// Enhanced for loop (for-each)
int[] items = {1, 2, 3};
for (int item : items) {
    System.out.println(item);
}

// Lists
List<String> names = Arrays.asList("John", "Jane", "Bob");
for (String name : names) {
    System.out.println(name);
}

// With index (using traditional for)
for (int i = 0; i < names.size(); i++) {
    System.out.println(i + ": " + names.get(i));
}

// Java 8+ Stream forEach
names.forEach(name -> System.out.println(name));
names.forEach(System.out::println); // Method reference
```

**While Loops:**

**JavaScript:**
```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

do {
    console.log(i);
    i++;
} while (i < 5);
```

**Java:**
```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

do {
    System.out.println(i);
    i++;
} while (i < 5); // Semicolon required
```

**Loop Control:**

**Both JavaScript and Java:**
```java
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;  // Skip iteration
    if (i == 7) break;     // Exit loop
    System.out.println(i);
}

// Labeled loops (Java)
outer: for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break outer; // Break outer loop
        System.out.println(i + "," + j);
    }
}
```

### 6.3 How does the switch statement work in Java?

**Answer:**

**Literal Definition:** The switch statement in Java provides multi-way branching based on the value of an expression. Java 12+ introduced switch expressions that can return values, and Java 14+ added pattern matching. Unlike JavaScript, Java historically required `break` statements to prevent fall-through, though switch expressions eliminate this need.

**Traditional Switch (Java 7+):**
```java
String day = "Monday";

// Old style (requires break statements)
switch (day) {
    case "Monday":
        System.out.println("Start of week");
        break;
    case "Friday":
        System.out.println("End of week");
        break;
    case "Saturday":
    case "Sunday":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Midweek");
        break;
}

// Fall-through (if break omitted)
int number = 1;
switch (number) {
    case 1:
        System.out.println("One");
        // No break - falls through to next case
    case 2:
        System.out.println("Two"); // This also executes!
        break;
}
```

**Switch Expressions (Java 14+):**
```java
// Returns a value, no break needed
String result = switch (day) {
    case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> "Weekday";
    case "Saturday", "Sunday" -> "Weekend";
    default -> "Unknown";
};

// Multi-line cases
String message = switch (day) {
    case "Monday" -> {
        String prefix = "Start of";
        yield prefix + " week"; // yield returns value from block
    }
    case "Friday" -> "End of week";
    default -> "Other day";
};

// Pattern Matching (Java 17+)
Object obj = "Hello";
String result = switch (obj) {
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    case null -> "Null";
    default -> "Unknown";
};
```

**JavaScript Comparison:**
```javascript
// JavaScript switch
switch (day) {
    case "Monday":
        console.log("Start of week");
        break;
    case "Friday":
        console.log("End of week");
        break;
    default:
        console.log("Other day");
}

// JavaScript doesn't have switch expressions
// Use object mapping or ternary instead
const result = {
    "Monday": "Start of week",
    "Friday": "End of week"
}[day] || "Other day";
```

---

## 7. Functions (Methods)

### 7.1 How do you define methods in Java compared to JavaScript functions?

**Answer:**

**Literal Definitions:**
- **Method**: In Java, a function defined inside a class is called a method. All code must exist within classes, so all functions are methods. Methods can be instance methods (require an object) or static methods (can be called on the class).
- **Method Signature**: The combination of a method's name and parameter types (not including return type). Method signatures must be unique within a class for overloading to work.

**JavaScript:**
```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Function expression
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Arrow function
const greet = (name) => {
    return `Hello, ${name}!`;
};

// Arrow function (implicit return)
const greet = (name) => `Hello, ${name}!`;

// Default parameters
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
```

**Java:**
```java
public class Greeter {
    // Instance method
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    // Static method (like class method)
    public static String greetStatic(String name) {
        return "Hello, " + name + "!";
    }
    
    // Default parameters (Java doesn't have - use overloading)
    public String greet() {
        return greet("Guest"); // Call overloaded method
    }
    
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    // Variable arguments (varargs - like rest parameters)
    public int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    // Usage:
    // sum(1, 2, 3, 4) or sum(new int[]{1, 2, 3, 4})
}

// Lambda expressions (Java 8+)
// Can only be used with functional interfaces
Function<String, String> greet = name -> "Hello, " + name + "!";

// Multi-line lambda
Function<String, String> greetLong = name -> {
    String greeting = "Hello";
    return greeting + ", " + name + "!";
};
```

**Key Differences:**
- **JavaScript**: Standalone functions or methods in objects/classes
- **Java**: All functions must be methods in classes
- **JavaScript**: Arrow functions, function expressions
- **Java**: Lambda expressions (Java 8+) limited to functional interfaces
- **JavaScript**: Default parameters
- **Java**: Method overloading for default behavior
- **Java**: Must specify return type
- **Java**: Must declare access modifiers (public, private, etc.)

### 7.2 What is method overloading and how does it compare to JavaScript?

**Answer:**

**Literal Definition:** Method overloading is the ability to define multiple methods with the same name but different parameter lists (different number or types of parameters) in the same class. Java resolves which method to call based on the arguments provided at compile-time. JavaScript doesn't support traditional overloading; the last definition overwrites previous ones.

**Java (Method Overloading):**
```java
public class Calculator {
    // Overloaded methods - same name, different parameters
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
    
    public String add(String a, String b) {
        return a + b;
    }
}

// Usage
Calculator calc = new Calculator();
calc.add(5, 10);           // Calls int version
calc.add(5.5, 10.2);       // Calls double version
calc.add(1, 2, 3);         // Calls three-parameter version
calc.add("Hello", "World"); // Calls String version
```

**JavaScript (No Overloading - Last Definition Wins):**
```javascript
class Calculator {
    // Only the last definition is used
    add(a, b) {
        return a + b;
    }
    
    add(a, b, c) {
        return a + b + c; // This overwrites the first definition
    }
}

// Workaround: Check parameter count or types
class Calculator {
    add(...args) {
        if (args.length === 2) {
            return args[0] + args[1];
        } else if (args.length === 3) {
            return args[0] + args[1] + args[2];
        }
    }
}
```

**Overloading Rules in Java:**
```java
public class OverloadExample {
    // ✅ Valid - different number of parameters
    public void method(int a) { }
    public void method(int a, int b) { }
    
    // ✅ Valid - different parameter types
    public void method(int a) { }
    public void method(String a) { }
    
    // ✅ Valid - different parameter order
    public void method(int a, String b) { }
    public void method(String a, int b) { }
    
    // ❌ Invalid - return type alone doesn't distinguish
    public void method(int a) { }
    // public int method(int a) { } // Compilation error
    
    // ❌ Invalid - parameter names don't matter
    public void method(int a) { }
    // public void method(int b) { } // Compilation error
}
```

### 7.3 What are Java lambda expressions and how do they compare to JavaScript arrow functions?

**Answer:**

**Literal Definition:** Lambda expressions in Java (introduced in Java 8) are anonymous functions that can be used to implement functional interfaces (interfaces with a single abstract method). They provide a concise way to represent instances of functional interfaces. Unlike JavaScript arrow functions, Java lambdas can only be used where a functional interface is expected.

**JavaScript (Arrow Functions):**
```javascript
// Can be used anywhere
const greet = (name) => `Hello, ${name}!`;

// With arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// Multi-line
const complex = (a, b) => {
    const sum = a + b;
    return sum * 2;
};

// No parameters
const sayHello = () => console.log("Hello");

// Single parameter (parentheses optional)
const square = x => x * x;
```

**Java (Lambda Expressions):**
```java
// Must use with functional interface
@FunctionalInterface
interface Greeting {
    String greet(String name);
}

// Lambda implementation
Greeting greeting = name -> "Hello, " + name + "!";
String result = greeting.greet("John");

// Built-in functional interfaces
import java.util.function.*;

// Function<T, R> - takes T, returns R
Function<String, Integer> length = s -> s.length();
Integer len = length.apply("Hello"); // 5

// Predicate<T> - takes T, returns boolean
Predicate<Integer> isEven = n -> n % 2 == 0;
boolean result = isEven.test(4); // true

// Consumer<T> - takes T, returns void
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hello");

// Supplier<T> - takes nothing, returns T
Supplier<Double> randomValue = () -> Math.random();
Double value = randomValue.get();

// BiFunction<T, U, R> - takes T and U, returns R
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
Integer sum = add.apply(5, 10); // 15

// With collections (Streams)
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> doubled = numbers.stream()
    .map(n -> n * 2)
    .collect(Collectors.toList());

List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());

// Multi-line lambda
Function<String, String> complex = s -> {
    String upper = s.toUpperCase();
    return upper + "!";
};

// Method reference (shorthand for lambda)
Consumer<String> printer = System.out::println;
Function<String, Integer> length = String::length;
```

**Key Differences:**
- **JavaScript**: Arrow functions can be used anywhere
- **Java**: Lambdas only work with functional interfaces
- **JavaScript**: Arrow functions have different `this` binding
- **Java**: Lambdas don't have `this` (use enclosing class's `this`)
- **Java**: Method references (`::`) as shorthand
- **Java**: More verbose functional interface types

**Common Functional Interfaces:**
```java
// Predicate<T> - boolean test
Predicate<String> isEmpty = String::isEmpty;

// Function<T, R> - transform T to R
Function<String, Integer> parse = Integer::parseInt;

// Consumer<T> - consume T (void)
Consumer<String> print = System.out::println;

// Supplier<T> - supply T
Supplier<String> uuid = UUID.randomUUID()::toString;

// UnaryOperator<T> - T -> T
UnaryOperator<Integer> square = x -> x * x;

// BinaryOperator<T> - (T, T) -> T
BinaryOperator<Integer> add = (a, b) -> a + b;
```

---

## 8. Arrays & Collections

### 8.1 What are Java arrays and how do they compare to JavaScript arrays?

**Answer:**

**Literal Definition:** Arrays in Java are fixed-size, ordered collections of elements of the same type. Once created, an array's size cannot be changed. Unlike JavaScript arrays, Java arrays are strongly typed and cannot hold mixed types unless using a common supertype like `Object[]`. For dynamic sizing, use collections like `ArrayList`.

**JavaScript (Dynamic Arrays):**
```java
// JavaScript arrays are dynamic and flexible
const arr = [1, 2, 3];
arr.push(4);              // [1, 2, 3, 4]
arr.pop();                // [1, 2, 3]
arr.length = 2;           // [1, 2]
arr[10] = 100;            // [1, 2, empty × 8, 100]

// Mixed types allowed
const mixed = [1, "hello", true, {name: "John"}];
```

**Java (Fixed-Size Arrays):**
```java
// Array declaration and initialization
int[] numbers = new int[5];           // [0, 0, 0, 0, 0]
int[] numbers = {1, 2, 3, 4, 5};      // Array literal
int[] numbers = new int[]{1, 2, 3};   // Explicit initialization

// Accessing elements
int first = numbers[0];               // 1
numbers[0] = 10;                      // Modify element

// Array length (property, not method)
int length = numbers.length;          // 5 (not length())

// Arrays are fixed size
// numbers[5] = 6; // ArrayIndexOutOfBoundsException

// Multi-dimensional arrays
int[][] matrix = new int[3][3];
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Accessing multi-dimensional
int value = matrix[0][0];             // 1

// Common array operations
import java.util.Arrays;

// Printing
System.out.println(Arrays.toString(numbers));
// [1, 2, 3, 4, 5]

// Sorting
Arrays.sort(numbers);

// Searching (binary search on sorted array)
int index = Arrays.binarySearch(numbers, 3);

// Copying
int[] copy = Arrays.copyOf(numbers, numbers.length);

// Filling
Arrays.fill(numbers, 0); // [0, 0, 0, 0, 0]

// Comparing
boolean equal = Arrays.equals(numbers, copy);

// Converting to List
List<Integer> list = Arrays.asList(1, 2, 3);
```

**Key Differences:**
- **JavaScript**: Dynamic size, can grow/shrink
- **Java**: Fixed size once created
- **JavaScript**: Mixed types allowed
- **Java**: Single type only (or common supertype)
- **JavaScript**: `.length` is a property that can be modified
- **Java**: `.length` is a final property (read-only)
- **JavaScript**: Many built-in methods (`.map()`, `.filter()`, etc.)
- **Java**: Limited methods, use `Arrays` utility class or Collections

### 8.2 What are Java Collections and how do they compare to JavaScript data structures?

**Answer:**

**Literal Definition:** The Java Collections Framework is a unified architecture for representing and manipulating collections of objects. It includes interfaces (List, Set, Map, Queue) and implementations (ArrayList, HashSet, HashMap, etc.) that provide dynamic, resizable data structures with rich APIs. Unlike arrays, collections can grow and shrink dynamically and provide more functionality.

**List (ArrayList - like JavaScript arrays):**

**JavaScript:**
```javascript
const list = [1, 2, 3];
list.push(4);              // [1, 2, 3, 4]
list.pop();                // [1, 2, 3]
list.unshift(0);           // [0, 1, 2, 3]
list[0];                   // 0
list.includes(2);          // true
list.indexOf(2);           // 2
```

**Java:**
```java
import java.util.*;

// ArrayList (most common List implementation)
List<Integer> list = new ArrayList<>();
list.add(1);                // [1]
list.add(2);                // [1, 2]
list.add(0, 0);             // [0, 1, 2] (insert at index)
list.get(0);                // 0
list.set(0, 10);            // [10, 1, 2] (replace)
list.remove(0);             // [1, 2] (remove by index)
list.remove(Integer.valueOf(2)); // [1] (remove by value)
list.contains(1);           // true
list.indexOf(1);            // 0
list.size();                // 1 (not length)
list.isEmpty();             // false
list.clear();               // []

// LinkedList (for frequent insertions/deletions)
List<String> linkedList = new LinkedList<>();
linkedList.addFirst("first");
linkedList.addLast("last");
```

**Set (HashSet - like JavaScript Set):**

**JavaScript:**
```javascript
const set = new Set([1, 2, 3, 3]);
set.add(4);
set.has(2);           // true
set.delete(2);
set.size;             // 3
```

**Java:**
```java
// HashSet (unordered, no duplicates)
Set<Integer> set = new HashSet<>();
set.add(1);
set.add(2);
set.add(2);           // Ignored (no duplicates)
set.contains(2);      // true
set.remove(2);
set.size();           // 1

// TreeSet (sorted, no duplicates)
Set<Integer> sortedSet = new TreeSet<>();
sortedSet.add(3);
sortedSet.add(1);
sortedSet.add(2);
// [1, 2, 3] (automatically sorted)

// LinkedHashSet (insertion order, no duplicates)
Set<String> orderedSet = new LinkedHashSet<>();
```

**Map (HashMap - like JavaScript objects/Map):**

**JavaScript:**
```javascript
// Object
const obj = { name: "John", age: 30 };
obj.name;             // "John"
obj["age"];           // 30

// Map
const map = new Map();
map.set("name", "John");
map.set("age", 30);
map.get("name");      // "John"
map.has("age");       // true
map.delete("age");
map.size;             // 1
```

**Java:**
```java
// HashMap (unordered key-value pairs)
Map<String, Integer> map = new HashMap<>();
map.put("John", 30);
map.put("Jane", 25);
map.get("John");      // 30
map.containsKey("John");  // true
map.containsValue(30);    // true
map.remove("John");
map.size();           // 1

// Iterating over map
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// TreeMap (sorted by keys)
Map<String, Integer> sortedMap = new TreeMap<>();

// LinkedHashMap (insertion order)
Map<String, Integer> orderedMap = new LinkedHashMap<>();
```

**Queue:**
```java
// Queue (FIFO)
Queue<String> queue = new LinkedList<>();
queue.offer("first");   // Add to queue
queue.offer("second");
queue.peek();           // "first" (view without removing)
queue.poll();           // "first" (remove and return)

// Stack (LIFO) - use Deque instead of deprecated Stack
Deque<String> stack = new ArrayDeque<>();
stack.push("first");
stack.push("second");
stack.peek();           // "second"
stack.pop();            // "second"
```

**Key Differences:**
- **JavaScript**: Arrays are dynamic by default
- **Java**: Use ArrayList for dynamic arrays
- **JavaScript**: Objects and Map for key-value
- **Java**: HashMap for key-value
- **Java**: Strong typing (generics)
- **Java**: More specialized collections (TreeSet, LinkedHashSet, etc.)

### 8.3 What are Java Generics and how do they compare to TypeScript generics?

**Answer:**

**Literal Definition:** Generics in Java provide compile-time type safety by allowing classes, interfaces, and methods to operate on types specified by the user. They eliminate the need for type casting and catch type errors at compile-time. Unlike TypeScript generics which are erased at runtime, Java generics use type erasure but still maintain some type information for runtime checks.

**TypeScript:**
```typescript
// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Generic class
class Box<T> {
    private value: T;
    
    constructor(value: T) {
        this.value = value;
    }
    
    getValue(): T {
        return this.value;
    }
}

// Generic interface
interface Pair<K, V> {
    key: K;
    value: V;
}

// Usage
const num = identity<number>(42);
const box = new Box<string>("Hello");
const pair: Pair<string, number> = { key: "age", age: 30 };
```

**Java:**
```java
// Generic class
public class Box<T> {
    private T value;
    
    public Box(T value) {
        this.value = value;
    }
    
    public T getValue() {
        return value;
    }
    
    public void setValue(T value) {
        this.value = value;
    }
}

// Usage
Box<String> stringBox = new Box<>("Hello");
String value = stringBox.getValue(); // No casting needed

Box<Integer> intBox = new Box<>(42);
Integer number = intBox.getValue();

// Generic method
public class Utils {
    public static <T> T identity(T arg) {
        return arg;
    }
    
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }
}

// Usage
String result = Utils.identity("Hello");
Utils.printArray(new String[]{"a", "b", "c"});

// Generic interface
public interface Pair<K, V> {
    K getKey();
    V getValue();
}

// Implementation
public class SimplePair<K, V> implements Pair<K, V> {
    private K key;
    private V value;
    
    public SimplePair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    @Override
    public K getKey() { return key; }
    
    @Override
    public V getValue() { return value; }
}

// Bounded type parameters
public class NumberBox<T extends Number> {
    private T value;
    
    public NumberBox(T value) {
        this.value = value;
    }
    
    public double doubleValue() {
        return value.doubleValue(); // Can call Number methods
    }
}

// Usage
NumberBox<Integer> intBox = new NumberBox<>(42);
NumberBox<Double> doubleBox = new NumberBox<>(3.14);
// NumberBox<String> stringBox = new NumberBox<>("test"); // Error

// Multiple bounds
public class Box<T extends Comparable<T> & Serializable> {
    // T must implement both Comparable and Serializable
}

// Wildcards
public void printList(List<?> list) {
    // ? means unknown type
    for (Object item : list) {
        System.out.println(item);
    }
}

// Bounded wildcards
public void addNumbers(List<? super Integer> list) {
    // Can add Integer or its subclasses
    list.add(42);
}

public void processNumbers(List<? extends Number> list) {
    // Can read as Number or its subclasses
    for (Number num : list) {
        System.out.println(num.doubleValue());
    }
}
```

**Key Differences:**
- **TypeScript**: Generics erased at runtime
- **Java**: Type erasure but with some runtime information
- **Java**: Bounded type parameters (`extends`)
- **Java**: Wildcards (`?`, `? extends`, `? super`)
- **Java**: Cannot use primitives with generics (use wrapper classes)
- **Java**: Cannot create arrays of generic types

**Type Erasure:**
```java
// After compilation, this:
List<String> list = new ArrayList<String>();

// Becomes this:
List list = new ArrayList();

// But type checking happens at compile-time
```

---

## 9. Object-Oriented Programming

### 9.1 How do classes work in Java compared to JavaScript?

**Answer:**

**Literal Definitions:**
- **Class**: A blueprint for creating objects that defines attributes (fields) and behaviors (methods). In Java, classes are the fundamental building blocks and all code must exist within classes.
- **Constructor**: A special method with the same name as the class that is called when creating a new object. It initializes the object's state.
- **this**: A reference to the current object instance, used to access instance variables and methods.

**JavaScript (ES6 Classes):**
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    static createAdult(name) {
        return new Person(name, 18);
    }
}

class Student extends Person {
    constructor(name, age, school) {
        super(name, age);
        this.school = school;
    }
    
    study() {
        return `${this.name} is studying`;
    }
}
```

**Java:**
```java
public class Person {
    // Instance variables (fields)
    private String name;
    private int age;
    
    // Static variable (class variable)
    private static int personCount = 0;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        personCount++;
    }
    
    // Constructor overloading
    public Person(String name) {
        this(name, 0); // Call other constructor
    }
    
    // Instance method
    public String greet() {
        return "Hello, I'm " + this.name;
    }
    
    // Getters and setters (encapsulation)
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
    
    // Static method
    public static Person createAdult(String name) {
        return new Person(name, 18);
    }
    
    // Static method to access static variable
    public static int getPersonCount() {
        return personCount;
    }
}

// Inheritance
public class Student extends Person {
    private String school;
    
    // Constructor
    public Student(String name, int age, String school) {
        super(name, age); // Call parent constructor
        this.school = school;
    }
    
    // Method
    public String study() {
        return getName() + " is studying";
    }
    
    // Method overriding
    @Override
    public String greet() {
        return super.greet() + " and I'm a student";
    }
    
    // Getters and setters
    public String getSchool() {
        return school;
    }
    
    public void setSchool(String school) {
        this.school = school;
    }
}

// Usage
Person person = new Person("John", 30);
System.out.println(person.greet());

Student student = new Student("Jane", 20, "MIT");
System.out.println(student.study());

Person adult = Person.createAdult("Bob");
```

**Key Differences:**
- **Java**: Explicit access modifiers (`public`, `private`, `protected`)
- **Java**: Getters and setters convention
- **Java**: Constructor overloading
- **Java**: `@Override` annotation for clarity
- **Java**: Cannot have standalone functions (all must be in classes)
- **Java**: `super()` must be first statement in constructor

**Access Modifiers:**
```java
public class Example {
    public int publicField;        // Accessible everywhere
    private int privateField;      // Only within this class
    protected int protectedField;  // Within package and subclasses
    int packagePrivateField;       // Within package only (default)
    
    public void publicMethod() { }
    private void privateMethod() { }
    protected void protectedMethod() { }
    void packagePrivateMethod() { }
}
```

### 9.2 What is encapsulation and why use getters/setters?

**Answer:**

**Literal Definition:** Encapsulation is the OOP principle of bundling data (fields) and methods that operate on that data within a single unit (class) and hiding the internal state from outside access. In Java, this is achieved by making fields private and providing public getter and setter methods to control access, allowing for validation, computed properties, and maintaining class invariants.

**Without Encapsulation (Bad Practice):**
```java
public class Person {
    public String name;
    public int age;
}

// Direct field access
Person person = new Person();
person.name = "John";
person.age = -5; // Invalid age, but no validation!
```

**With Encapsulation (Best Practice):**
```java
public class Person {
    private String name;  // Private fields
    private int age;
    
    // Getter
    public String getName() {
        return name;
    }
    
    // Setter with validation
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Invalid age");
        }
        this.age = age;
    }
    
    // Computed property
    public boolean isAdult() {
        return age >= 18;
    }
    
    // Read-only property (no setter)
    public String getFullInfo() {
        return name + " (" + age + " years old)";
    }
}

// Usage
Person person = new Person();
person.setName("John");
person.setAge(30);
System.out.println(person.getName()); // "John"
// person.age = -5; // Compilation error - field is private
```

**Benefits:**
1. **Validation**: Control what values can be set
2. **Flexibility**: Change internal implementation without affecting users
3. **Computed Properties**: Derive values from other fields
4. **Read-Only/Write-Only**: Control access level
5. **Debugging**: Add logging or breakpoints in setters/getters

**JavaScript Comparison:**
```javascript
class Person {
    #name; // Private field (ES2022+)
    #age;
    
    constructor(name, age) {
        this.name = name; // Uses setter
        this.age = age;
    }
    
    get name() {
        return this.#name;
    }
    
    set name(value) {
        if (!value || value.trim() === '') {
            throw new Error("Name cannot be empty");
        }
        this.#name = value;
    }
    
    get age() {
        return this.#age;
    }
    
    set age(value) {
        if (value < 0 || value > 150) {
            throw new Error("Invalid age");
        }
        this.#age = value;
    }
    
    get isAdult() {
        return this.#age >= 18;
    }
}
```

### 9.3 What is inheritance and polymorphism in Java?

**Answer:**

**Literal Definitions:**
- **Inheritance**: A mechanism where a new class (subclass/child) derives properties and behaviors from an existing class (superclass/parent). Java supports single inheritance (a class can extend only one class) but multiple interface implementation.
- **Polymorphism**: The ability of objects of different classes to respond to the same method call in different ways. In Java, this is achieved through method overriding (runtime polymorphism) and method overloading (compile-time polymorphism).

**Inheritance:**
```java
// Parent class (superclass)
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Child class (subclass)
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    // Method overriding
    @Override
    public void eat() {
        System.out.println(name + " is eating dog food");
    }
    
    // New method specific to Dog
    public void bark() {
        System.out.println(name + " is barking");
    }
}

public class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }
    
    @Override
    public void eat() {
        System.out.println(name + " is eating cat food");
    }
    
    public void meow() {
        System.out.println(name + " is meowing");
    }
}
```

**Polymorphism:**
```java
public class PolymorphismExample {
    public static void main(String[] args) {
        // Polymorphism - parent reference to child object
        Animal animal1 = new Dog("Buddy", "Golden Retriever");
        Animal animal2 = new Cat("Whiskers");
        
        // Calls overridden methods
        animal1.eat(); // "Buddy is eating dog food"
        animal2.eat(); // "Whiskers is eating cat food"
        
        // Common method from parent
        animal1.sleep(); // "Buddy is sleeping"
        animal2.sleep(); // "Whiskers is sleeping"
        
        // Cannot call child-specific methods without casting
        // animal1.bark(); // Compilation error
        
        // Type checking and casting
        if (animal1 instanceof Dog) {
            Dog dog = (Dog) animal1;
            dog.bark(); // Now we can call Dog-specific methods
        }
        
        // Java 14+ pattern matching
        if (animal1 instanceof Dog dog) {
            dog.bark(); // Automatically cast
        }
        
        // Array/List of polymorphic objects
        Animal[] animals = {
            new Dog("Buddy", "Golden Retriever"),
            new Cat("Whiskers"),
            new Dog("Max", "Labrador")
        };
        
        // Process all animals uniformly
        for (Animal animal : animals) {
            animal.eat(); // Calls appropriate overridden method
        }
    }
}
```

**Method Overriding Rules:**
```java
public class Parent {
    public void method() { }
    
    public final void finalMethod() { } // Cannot be overridden
    
    public static void staticMethod() { } // Not overridden, but hidden
}

public class Child extends Parent {
    // ✅ Valid override
    @Override
    public void method() { }
    
    // ❌ Cannot override final method
    // public void finalMethod() { } // Compilation error
    
    // ✅ Valid but hides, doesn't override static method
    public static void staticMethod() { }
    
    // ❌ Cannot reduce visibility
    // protected void method() { } // Error - must be public or more visible
    
    // ✅ Can increase visibility
    @Override
    public void method() { } // OK if parent was protected
    
    // ❌ Cannot change return type (except covariant)
    // public String method() { } // Error
    
    // ✅ Covariant return type OK
    @Override
    public String toString() { // Object returns Object, String is subtype
        return "Child";
    }
}
```

**JavaScript Comparison:**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        console.log(`${this.name} is eating`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    eat() {
        console.log(`${this.name} is eating dog food`);
    }
    
    bark() {
        console.log(`${this.name} is barking`);
    }
}

// Polymorphism
const animal = new Dog("Buddy", "Golden Retriever");
animal.eat(); // "Buddy is eating dog food"
```

**Key Differences:**
- **Java**: Single inheritance (one superclass only)
- **JavaScript**: Prototype-based, single prototype chain
- **Java**: Must explicitly mark overridden methods with `@Override`
- **Java**: Access modifiers control visibility
- **Java**: `super()` must be first in constructor
- **Java**: Final methods cannot be overridden

---

## 10. Interfaces & Abstract Classes

### 10.1 What are interfaces in Java and how do they compare to TypeScript interfaces?

**Answer:**

**Literal Definition:** An interface in Java is a reference type that defines a contract of methods that implementing classes must provide. Interfaces can contain method signatures, default methods (Java 8+), static methods, and constants. Unlike TypeScript interfaces which are purely for compile-time type checking, Java interfaces exist at runtime and can be used for polymorphism.

**TypeScript (Structural Typing):**
```typescript
interface User {
    name: string;
    age: number;
    greet(): string;
}

// Any object with matching structure is compatible
const user: User = {
    name: "John",
    age: 30,
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Duck typing - structure matters, not declaration
function printUser(user: User) {
    console.log(user.greet());
}

printUser({ name: "Jane", age: 25, greet: () => "Hi" }); // OK
```

**Java (Nominal Typing):**
```java
// Interface definition
public interface User {
    // Abstract methods (no body)
    String getName();
    int getAge();
    String greet();
    
    // Default method (Java 8+)
    default boolean isAdult() {
        return getAge() >= 18;
    }
    
    // Static method (Java 8+)
    static User createGuest() {
        return new UserImpl("Guest", 0);
    }
    
    // Constants (implicitly public static final)
    int MAX_AGE = 150;
}

// Implementation
public class UserImpl implements User {
    private String name;
    private int age;
    
    public UserImpl(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public int getAge() {
        return age;
    }
    
    @Override
    public String greet() {
        return "Hello, I'm " + name;
    }
    
    // Can override default method
    @Override
    public boolean isAdult() {
        return age >= 21; // Custom implementation
    }
}

// Usage
User user = new UserImpl("John", 30);
System.out.println(user.greet());
System.out.println(user.isAdult());
System.out.println(User.MAX_AGE);

User guest = User.createGuest();

// Multiple interface implementation
public class Employee implements User, Comparable<Employee> {
    // Implement all interface methods
    
    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.getAge(), other.getAge());
    }
}
```

**Functional Interfaces:**
```java
// Interface with single abstract method (SAM)
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);
    
    // Can have default and static methods
    default int square(int n) {
        return calculate(n, n);
    }
}

// Can be implemented with lambda
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

int result = add.calculate(5, 10); // 15
```

**Key Differences:**
- **TypeScript**: Structural typing (shape matters)
- **Java**: Nominal typing (explicit implementation required)
- **TypeScript**: Interfaces erased at compile-time
- **Java**: Interfaces exist at runtime
- **Java**: Can have default and static methods
- **Java**: Multiple interface implementation allowed
- **Java**: Functional interfaces can be implemented with lambdas

### 10.2 What are abstract classes and how do they differ from interfaces?

**Answer:**

**Literal Definition:** An abstract class is a class that cannot be instantiated and may contain abstract methods (methods without implementation) that must be implemented by subclasses. Unlike interfaces, abstract classes can have constructors, instance variables, and concrete methods. A class can extend only one abstract class (single inheritance) but implement multiple interfaces.

**Abstract Class:**
```java
public abstract class Shape {
    // Instance variables
    protected String color;
    protected double x, y;
    
    // Constructor
    public Shape(String color, double x, double y) {
        this.color = color;
        this.x = x;
        this.y = y;
    }
    
    // Abstract methods (must be implemented by subclasses)
    public abstract double getArea();
    public abstract double getPerimeter();
    
    // Concrete methods (inherited by subclasses)
    public void move(double dx, double dy) {
        this.x += dx;
        this.y += dy;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    // Can have default implementation
    public String describe() {
        return "A " + color + " shape at (" + x + ", " + y + ")";
    }
}

// Concrete subclass
public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double x, double y, double radius) {
        super(color, x, y); // Call parent constructor
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
    
    // Can add own methods
    public double getRadius() {
        return radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double x, double y, double width, double height) {
        super(color, x, y);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}

// Usage
// Shape shape = new Shape("red", 0, 0); // Error - cannot instantiate abstract class
Shape circle = new Circle("red", 0, 0, 5);
Shape rectangle = new Rectangle("blue", 10, 10, 4, 6);

System.out.println(circle.getArea());      // Uses Circle's implementation
System.out.println(rectangle.getArea());   // Uses Rectangle's implementation
circle.move(5, 5);                         // Uses inherited method
```

**Interface vs Abstract Class:**

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| **Methods** | Abstract (default/static allowed) | Abstract and concrete |
| **Variables** | Only constants (public static final) | Any type of variables |
| **Constructor** | No | Yes |
| **Inheritance** | Multiple (implements many) | Single (extends one) |
| **Access Modifiers** | All methods public | Any access modifier |
| **When to Use** | Define capability/contract | Share code, common base |

**When to Use Each:**

**Use Interface When:**
```java
// Defining a capability
public interface Flyable {
    void fly();
}

// Multiple unrelated classes can implement
public class Bird implements Flyable {
    public void fly() { /* ... */ }
}

public class Airplane implements Flyable {
    public void fly() { /* ... */ }
}
```

**Use Abstract Class When:**
```java
// Sharing common implementation
public abstract class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    // Common method
    public String getInfo() {
        return brand + " (" + year + ")";
    }
    
    // Must be implemented by subclasses
    public abstract void start();
    public abstract void stop();
}

public class Car extends Vehicle {
    public Car(String brand, int year) {
        super(brand, year);
    }
    
    @Override
    public void start() {
        System.out.println("Car starting...");
    }
    
    @Override
    public void stop() {
        System.out.println("Car stopping...");
    }
}
```

**Combining Both:**
```java
// Best practice: interface + abstract class
public interface Drawable {
    void draw();
}

public abstract class Shape implements Drawable {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    public abstract double getArea();
    
    // Default implementation of interface method
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " shape");
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle");
    }
}
```

---

*[Continuing with remaining sections... Due to length, I'll provide the complete guide structure. Would you like me to continue with the remaining sections 11-26?]*

## 11. Packages & Imports
- Package structure
- Import statements
- Access modifiers and packages

## 12. Exception Handling
- try-catch-finally
- Checked vs unchecked exceptions
- Custom exceptions

## 13. File Operations
- Reading and writing files
- try-with-resources
- NIO.2 (java.nio.file)

## 14. Streams & Lambda Expressions
- Stream API
- Filter, map, reduce
- Method references

## 15. Generics
- Generic classes and methods
- Bounded type parameters
- Wildcards

## 16. Annotations
- Built-in annotations
- Creating custom annotations

## 17. Working with JSON
- Jackson
- Gson
- JSON parsing

## 18. HTTP Requests & APIs
- HttpClient (Java 11+)
- REST API calls
- Async requests

## 19. Database Operations (JDBC)
- JDBC basics
- Connection pooling
- JPA/Hibernate

## 20. Testing in Java
- JUnit 5
- Mockito
- Test-driven development

## 21. Build Tools (Maven & Gradle)
- Maven basics
- Gradle basics
- Dependency management

## 22. Dependency Management
- Maven repositories
- Version management
- Transitive dependencies

## 23. Multithreading & Concurrency
- Threads
- Synchronization
- ExecutorService
- CompletableFuture

## 24. Common Patterns & Best Practices
- SOLID principles
- Design patterns
- Code style (Google/Oracle)

## 25. Performance Optimization
- JVM tuning
- Memory management
- Profiling

## 26. Debugging & Development Tools
- IntelliJ IDEA
- Eclipse
- JDB debugger
- Logging frameworks

---

## Summary: Key Takeaways for JavaScript Developers

### Syntax Differences
- **Static typing** instead of dynamic
- **Explicit types** required
- **Semicolons** required
- **Compilation** before execution
- **Main method** as entry point

### Object-Oriented
- **True class-based** OOP
- **Interfaces** and abstract classes
- **Strong encapsulation** with access modifiers
- **Single inheritance** but multiple interface implementation

### Best Practices
- Use **Maven or Gradle** for dependency management
- Follow **naming conventions** strictly
- Use **interfaces** for contracts
- **Encapsulate** with getters/setters
- Use **Streams** for collections
- Prefer **composition over inheritance**

### Common Pitfalls
- **NullPointerException** - always check for null
- **Type casting** - be careful with casting
- **Immutable strings** - use StringBuilder for concatenation
- **Checked exceptions** - must handle or declare

---

## Additional Resources

### Official Documentation
- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [Java SE API Documentation](https://docs.oracle.com/en/java/javase/17/docs/api/)

### Learning Resources
- [Java Tutorial (Oracle)](https://docs.oracle.com/javase/tutorial/)
- [Baeldung](https://www.baeldung.com/)
- [Spring Framework](https://spring.io/)

### Tools
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Maven](https://maven.apache.org/)
- [Gradle](https://gradle.org/)
- [JUnit 5](https://junit.org/junit5/)

---

*This guide provides a comprehensive overview of Java for JavaScript/TypeScript developers. Practice regularly and refer back to specific sections as needed.*



