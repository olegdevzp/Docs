# Junior Express.js Developer Interview Questions

## Table of Contents
1. [Express.js Fundamentals](#expressjs-fundamentals)
2. [Routing & HTTP Methods](#routing--http-methods)
3. [Middleware](#middleware)
4. [Request & Response Objects](#request--response-objects)
5. [Error Handling](#error-handling)
6. [Static Files & Templates](#static-files--templates)
7. [Security Basics](#security-basics)
8. [Database Integration](#database-integration)
9. [Testing Express Apps](#testing-express-apps)
10. [Deployment & Production](#deployment--production)

---

## Express.js Fundamentals

### 1. What is Express.js and why is it popular?

**Answer:** Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It's popular because:

- **Minimalist**: Lightweight and unopinionated
- **Fast**: Built on top of Node.js with minimal overhead
- **Flexible**: Can be used for web apps, APIs, mobile backends
- **Middleware**: Rich ecosystem of middleware functions
- **Easy to learn**: Simple API and clear documentation
- **Large community**: Extensive third-party packages
- **RESTful**: Great for building REST APIs

**Links:**
- [Express.js Official Site](https://expressjs.com/)
- [Why Express.js is Popular](https://expressjs.com/en/guide/why-express.html)

### 2. How do you create a basic Express application?

**Answer:** Here's how to create a basic Express app:

```javascript
// 1. Install Express
// npm install express

// 2. Create app.js
const express = require('express');
const app = express();
const PORT = 3000;

// 3. Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 4. Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key Steps:**
1. Import Express module
2. Create Express application instance
3. Define routes with HTTP methods
4. Start server with `app.listen()`

**Links:**
- [Express Getting Started](https://expressjs.com/en/starter/hello-world.html)
- [Express Installation Guide](https://expressjs.com/en/starter/installing.html)

### 3. What is the difference between Express and vanilla Node.js HTTP server?

**Answer:**

**Vanilla Node.js:**
```javascript
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
  }
  // Need to handle all routing manually
});
```

**Express.js:**
```javascript
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```

**Key Differences:**
- **Routing**: Express provides built-in routing, Node.js requires manual URL parsing
- **Middleware**: Express has middleware system, Node.js requires manual implementation
- **Request/Response**: Express extends req/res objects with helpful methods
- **Code Organization**: Express makes code more organized and maintainable
- **Development Speed**: Express significantly faster for development

### 4. What is the Express application object and what methods does it have?

**Answer:** The Express application object (`app`) is the main object that represents your Express application. Key methods include:

**Server Methods:**
- `app.listen(port, callback)` - Start server
- `app.set(name, value)` - Set application settings
- `app.get(name)` - Get application settings

**Routing Methods:**
- `app.get(path, callback)` - Handle GET requests
- `app.post(path, callback)` - Handle POST requests
- `app.put(path, callback)` - Handle PUT requests
- `app.delete(path, callback)` - Handle DELETE requests
- `app.all(path, callback)` - Handle all HTTP methods

**Middleware Methods:**
- `app.use(path, middleware)` - Use middleware
- `app.use(middleware)` - Use middleware for all routes

**Example:**
```javascript
const express = require('express');
const app = express();

// Set application settings
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// Use middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Home page');
});

// Start server
app.listen(app.get('port'), () => {
  console.log('Server started');
});
```

---

## Routing & HTTP Methods

### 5. How do you define routes in Express?

**Answer:** Routes are defined using the Express app object with HTTP method functions:

```javascript
const express = require('express');
const app = express();

// Basic route
app.get('/', (req, res) => {
  res.send('Home page');
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

// Multiple HTTP methods
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.json({ message: 'User created' });
});

// Route with multiple callbacks
app.get('/example', (req, res, next) => {
  console.log('First callback');
  next();
}, (req, res) => {
  res.send('Second callback');
});
```

**Route Structure:**
- `app.METHOD(path, callback)`
- `METHOD`: HTTP method (get, post, put, delete, etc.)
- `path`: URL path pattern
- `callback`: Function to execute when route matches

### 6. What are route parameters and how do you access them?

**Answer:** Route parameters are named URL segments that capture values at their position in the URL. They're defined with `:` and accessed via `req.params`.

```javascript
// Define route with parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  
  res.json({
    userId: userId,
    postId: postId,
    message: `User ${userId}, Post ${postId}`
  });
});

// Example URLs that match:
// /users/123/posts/456
// /users/john/posts/my-first-post
```

**Parameter Rules:**
- Parameters are named URL segments
- Access via `req.params.parameterName`
- All parameters are strings
- Use `?` for optional parameters: `/users/:id?`

**Links:**
- [Express Route Parameters](https://expressjs.com/en/guide/routing.html#route-parameters)

### 7. How do you handle query strings in Express?

**Answer:** Query strings are accessed through `req.query` object, which contains the parsed query string parameters.

```javascript
// URL: /search?q=javascript&category=programming&page=1
app.get('/search', (req, res) => {
  const query = req.query.q;           // 'javascript'
  const category = req.query.category; // 'programming'
  const page = req.query.page;         // '1'
  
  res.json({
    searchTerm: query,
    category: category,
    page: parseInt(page) || 1
  });
});

// Multiple values for same parameter
// URL: /tags?tag=javascript&tag=nodejs&tag=express
app.get('/tags', (req, res) => {
  const tags = req.query.tag; // ['javascript', 'nodejs', 'express']
  res.json({ tags: tags });
});
```

**Query String Features:**
- Automatically parsed by Express
- Available as `req.query` object
- Handles multiple values as arrays
- All values are strings (convert as needed)

### 8. What are the different HTTP methods and when to use them?

**Answer:** HTTP methods indicate the desired action to be performed on a resource:

**GET** - Retrieve data
```javascript
app.get('/api/users', (req, res) => {
  // Return list of users
  res.json(users);
});
```

**POST** - Create new resource
```javascript
app.post('/api/users', (req, res) => {
  // Create new user
  const newUser = req.body;
  res.status(201).json(newUser);
});
```

**PUT** - Update entire resource
```javascript
app.put('/api/users/:id', (req, res) => {
  // Update entire user
  const userId = req.params.id;
  const updatedUser = req.body;
  res.json(updatedUser);
});
```

**PATCH** - Partial update
```javascript
app.patch('/api/users/:id', (req, res) => {
  // Update specific fields
  const userId = req.params.id;
  const updates = req.body;
  res.json(updates);
});
```

**DELETE** - Remove resource
```javascript
app.delete('/api/users/:id', (req, res) => {
  // Delete user
  const userId = req.params.id;
  res.status(204).send();
});
```

**Method Guidelines:**
- **GET**: Safe, idempotent, cacheable
- **POST**: Not idempotent, creates resources
- **PUT**: Idempotent, replaces entire resource
- **PATCH**: Idempotent, partial updates
- **DELETE**: Idempotent, removes resources

---

## Middleware

### 9. What is middleware in Express and how does it work?

**Answer:** Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the next middleware function in the application's request-response cycle.

**Middleware Structure:**
```javascript
function middleware(req, res, next) {
  // Do something with req and res
  next(); // Call next middleware
}
```

**Basic Example:**
```javascript
const express = require('express');
const app = express();

// Custom middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Route handler
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```

**Middleware Execution Order:**
1. Middleware functions execute in the order they are defined
2. Each middleware can modify `req` and `res` objects
3. Call `next()` to pass control to next middleware
4. Don't call `next()` to end the request-response cycle

### 10. What are the different types of middleware in Express?

**Answer:** There are several types of middleware in Express:

**1. Application-level middleware:**
```javascript
// Runs for every request
app.use((req, res, next) => {
  console.log('Request received');
  next();
});

// Runs for specific path
app.use('/api', (req, res, next) => {
  console.log('API request');
  next();
});
```

**2. Router-level middleware:**
```javascript
const router = express.Router();
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});
```

**3. Error-handling middleware:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

**4. Built-in middleware:**
```javascript
app.use(express.json());       // Parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files
```

**5. Third-party middleware:**
```javascript
const cors = require('cors');
app.use(cors());
```

### 11. How do you create custom middleware?

**Answer:** Custom middleware can be created as functions and used with `app.use()`:

```javascript
// Simple logging middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Verify token logic here
  req.user = { id: 1, name: 'John' }; // Add user to request
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// Use middleware
app.use(logger);
app.use('/api/protected', authenticate);
app.use(errorHandler);
```

**Middleware Best Practices:**
- Always call `next()` unless ending the request
- Handle errors appropriately
- Keep middleware focused on single responsibility
- Use meaningful names for middleware functions

### 12. What is the difference between app.use() and app.get()?

**Answer:**

**app.use()** - Middleware for all HTTP methods:
```javascript
// Runs for ALL HTTP methods on matching path
app.use('/api', (req, res, next) => {
  console.log('API middleware');
  next();
});

// Runs for ALL requests
app.use((req, res, next) => {
  console.log('Global middleware');
  next();
});
```

**app.get()** - Route handler for GET method only:
```javascript
// Only runs for GET requests to exact path
app.get('/api/users', (req, res) => {
  res.json(users);
});
```

**Key Differences:**
- `app.use()`: Middleware, all HTTP methods, path matching
- `app.get()`: Route handler, GET method only, exact path matching
- `app.use()`: Usually calls `next()`
- `app.get()`: Usually sends response

---

## Request & Response Objects

### 13. What are the main properties and methods of the request object?

**Answer:** The request object (`req`) represents the HTTP request and has properties and methods for accessing request data:

**Properties:**
```javascript
app.get('/example', (req, res) => {
  // URL and path
  console.log(req.url);        // '/example?name=john'
  console.log(req.path);       // '/example'
  console.log(req.baseUrl);    // '/api' (if mounted on /api)
  console.log(req.originalUrl); // '/api/example?name=john'
  
  // HTTP method and headers
  console.log(req.method);     // 'GET'
  console.log(req.headers);    // Object with all headers
  console.log(req.get('Content-Type')); // Get specific header
  
  // Parameters and query
  console.log(req.params);     // Route parameters
  console.log(req.query);      // Query string parameters
  console.log(req.body);       // Request body (with body-parser)
  
  // IP and host
  console.log(req.ip);         // Client IP
  console.log(req.hostname);   // Hostname
});
```

**Common Methods:**
- `req.get(headerName)` - Get specific header
- `req.is(type)` - Check if request is of specific type
- `req.param(name)` - Get parameter from params, body, or query

### 14. What are the main methods of the response object?

**Answer:** The response object (`res`) represents the HTTP response and provides methods to send data back to the client:

**Sending Data:**
```javascript
app.get('/example', (req, res) => {
  // Send text
  res.send('Hello World!');
  
  // Send JSON
  res.json({ message: 'Hello', data: [] });
  
  // Send file
  res.sendFile('/path/to/file.html');
  
  // Send status code
  res.status(404).send('Not Found');
  
  // Redirect
  res.redirect('/new-path');
  
  // Set headers
  res.set('Content-Type', 'text/plain');
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
});
```

**Response Methods:**
- `res.send(data)` - Send response
- `res.json(data)` - Send JSON response
- `res.sendFile(path)` - Send file
- `res.redirect(url)` - Redirect to URL
- `res.status(code)` - Set status code
- `res.set(header, value)` - Set response header
- `res.cookie(name, value)` - Set cookie
- `res.end()` - End response

### 15. How do you handle different content types in requests and responses?

**Answer:** Express handles different content types through middleware and response methods:

**Parsing Request Bodies:**
```javascript
const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse raw bodies
app.use(express.raw({ type: 'application/octet-stream' }));

// Parse text bodies
app.use(express.text({ type: 'text/plain' }));
```

**Sending Different Response Types:**
```javascript
// JSON response
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// HTML response
app.get('/home', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send('<h1>Welcome</h1>');
});

// XML response
app.get('/data.xml', (req, res) => {
  res.set('Content-Type', 'application/xml');
  res.send('<data><item>value</item></data>');
});

// CSV response
app.get('/export.csv', (req, res) => {
  res.set('Content-Type', 'text/csv');
  res.send('name,age\nJohn,25\nJane,30');
});
```

**Content Type Detection:**
```javascript
app.post('/upload', (req, res) => {
  if (req.is('json')) {
    console.log('JSON data received');
  } else if (req.is('multipart/form-data')) {
    console.log('Form data received');
  }
  
  res.json({ received: true });
});
```

---

## Error Handling

### 16. How do you handle errors in Express applications?

**Answer:** Express provides several ways to handle errors:

**1. Try-Catch in Route Handlers:**
```javascript
app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});
```

**2. Error Handling Middleware:**
```javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

**3. Async Error Wrapper:**
```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
}));
```

**4. Custom Error Classes:**
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

app.get('/users/:id', (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }
  // ... rest of handler
});
```

### 17. What is the difference between operational and programmer errors?

**Answer:**

**Operational Errors:**
- Expected errors that occur during normal operation
- Can be handled gracefully
- Examples: validation errors, network timeouts, file not found

```javascript
// Operational error - handled gracefully
app.get('/users/:id', (req, res, next) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.json(user);
});
```

**Programmer Errors:**
- Bugs in the code
- Should not occur in production
- Examples: syntax errors, undefined variables, type errors

```javascript
// Programmer error - bug in code
app.get('/users', (req, res) => {
  const users = undefined; // Bug: should be defined
  res.json(users.length); // This will throw an error
});
```

**Error Handling Strategy:**
- **Operational errors**: Handle gracefully, return appropriate HTTP status
- **Programmer errors**: Log and return generic error message
- **Never expose internal errors** to clients in production

---

## Static Files & Templates

### 18. How do you serve static files in Express?

**Answer:** Use the built-in `express.static` middleware to serve static files:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from 'public' directory
app.use(express.static('public'));

// Serve static files from multiple directories
app.use(express.static('public'));
app.use(express.static('files'));

// Mount static files at specific path
app.use('/static', express.static('public'));

// Serve static files with options
app.use(express.static('public', {
  index: false,           // Disable directory indexing
  dotfiles: 'ignore',     // Ignore dotfiles
  etag: false,           // Disable ETag
  lastModified: false,   // Disable Last-Modified
  setHeaders: (res, path) => {
    res.set('x-timestamp', Date.now());
  }
}));
```

**File Structure:**
```
project/
  public/
    css/
      style.css
    js/
      app.js
    images/
      logo.png
  app.js
```

**Accessing Files:**
- `http://localhost:3000/css/style.css`
- `http://localhost:3000/images/logo.png`
- `http://localhost:3000/static/css/style.css` (if mounted at /static)

### 19. What are template engines and how do you use them with Express?

**Answer:** Template engines allow you to use static template files with dynamic data. Express supports many template engines:

**Setting up EJS (Embedded JavaScript):**
```javascript
const express = require('express');
const app = express();

// Set template engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', './views');

// Render template
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    users: ['John', 'Jane', 'Bob']
  });
});
```

**EJS Template (views/index.ejs):**
```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <ul>
        <% users.forEach(user => { %>
            <li><%= user %></li>
        <% }); %>
    </ul>
</body>
</html>
```

**Other Popular Template Engines:**
- **Handlebars**: `app.set('view engine', 'hbs');`
- **Pug**: `app.set('view engine', 'pug');`
- **Mustache**: `app.set('view engine', 'mustache');`

**Template Engine Features:**
- Dynamic content insertion
- Loops and conditionals
- Layout inheritance
- Partial templates
- Data binding

---

## Security Basics

### 20. What are common security vulnerabilities in Express applications?

**Answer:** Common security issues and how to prevent them:

**1. Cross-Site Scripting (XSS):**
```javascript
// Vulnerable - don't do this
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Search results for: ${query}</h1>`);
});

// Safe - escape output
const escapeHtml = (text) => {
  return text.replace(/[&<>"']/g, (match) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escape[match];
  });
};
```

**2. SQL Injection:**
```javascript
// Vulnerable - don't do this
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
  // This is dangerous!
});

// Safe - use parameterized queries
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users WHERE name = ?';
  db.query(query, [req.query.name], (err, results) => {
    // Safe
  });
});
```

**3. Cross-Site Request Forgery (CSRF):**
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

**4. Helmet.js for Security Headers:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 21. How do you implement basic authentication in Express?

**Answer:** Here are common authentication approaches:

**1. Basic Authentication:**
```javascript
const auth = require('express-basic-auth');

app.use(auth({
  users: { 'admin': 'password123' },
  challenge: true,
  realm: 'My App'
}));
```

**2. Session-based Authentication:**
```javascript
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true for HTTPS
}));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials (in real app, check database)
  if (username === 'admin' && password === 'password123') {
    req.session.userId = 1;
    req.session.username = username;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route
app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.json({ message: 'Welcome to dashboard' });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});
```

**3. JWT Authentication:**
```javascript
const jwt = require('jsonwebtoken');

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign(
      { userId: 1, username },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Protected route
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to dashboard', user: req.user });
});
```

---

## Database Integration

### 22. How do you connect to a database in Express?

**Answer:** Here are examples for different databases:

**MongoDB with Mongoose:**
```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

// Use in routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**MySQL with mysql2:**
```javascript
const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use in routes
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
```

**PostgreSQL with pg:**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'myapp',
  password: 'password',
  port: 5432,
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 23. How do you handle database errors in Express?

**Answer:** Proper error handling for database operations:

```javascript
// Error handling middleware
const handleDatabaseError = (err, req, res, next) => {
  console.error('Database error:', err);
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'Referenced record not found' });
  }
  
  res.status(500).json({ error: 'Database error occurred' });
};

// Route with error handling
app.post('/users', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
});

// Use error handling middleware
app.use(handleDatabaseError);
```

---

## Testing Express Apps

### 24. How do you test Express applications?

**Answer:** Testing Express apps with Jest and Supertest:

**Setup:**
```bash
npm install --save-dev jest supertest
```

**Test file:**
```javascript
const request = require('supertest');
const app = require('../app'); // Your Express app

describe('GET /users', () => {
  test('should return list of users', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);
    
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});

describe('POST /users', () => {
  test('should create new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const response = await request(app)
      .post('/users')
      .send(userData)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(userData.name);
  });
  
  test('should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({}) // Empty data
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
});
```

**Testing with Database:**
```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clean up database after each test
  await User.deleteMany({});
});
```

---

## Deployment & Production

### 25. How do you prepare an Express app for production?

**Answer:** Key steps for production deployment:

**1. Environment Configuration:**
```javascript
// Use environment variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

// Different configs for different environments
if (nodeEnv === 'production') {
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip compression
}
```

**2. Error Handling:**
```javascript
// Production error handler
if (nodeEnv === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
}
```

**3. Process Management with PM2:**
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start app.js --name "my-app"

# Monitor
pm2 monit

# Restart
pm2 restart my-app
```

**4. Docker Configuration:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

**5. Health Checks:**
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## Additional Resources

### Documentation & Learning
- [Express.js Official Documentation](https://expressjs.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Express Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)

### Popular Middleware
- [Helmet.js](https://helmetjs.github.io/) - Security headers
- [CORS](https://github.com/expressjs/cors) - Cross-Origin Resource Sharing
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Compression](https://github.com/expressjs/compression) - Gzip compression

### Testing
- [Supertest](https://github.com/visionmedia/supertest) - HTTP assertions
- [Jest](https://jestjs.io/) - Testing framework
- [Mocha](https://mochajs.org/) - Alternative testing framework

---

*This comprehensive guide covers the essential Express.js concepts that junior developers should understand. Each question includes practical examples and links to official documentation for further learning.*

