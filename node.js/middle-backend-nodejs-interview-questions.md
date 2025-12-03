# Meiddle Level Backend Node.js Interview Questions

## Table of Contents
1. [Event Loop & Async Programming](#event-loop--async-programming)
2. [Streams & Buffers](#streams--buffers)
3. [Performance & Optimization](#performance--optimization)
4. [Clustering & Worker Threads](#clustering--worker-threads)
5. [Security](#security)
6. [Express.js & Web Frameworks](#expressjs--web-frameworks)
7. [Database & ORM](#database--orm)
8. [Testing](#testing)
9. [Design Patterns](#design-patterns)
10. [Microservices](#microservices)
11. [Error Handling](#error-handling)
12. [Authentication & Authorization](#authentication--authorization)
13. [API Design](#api-design)
14. [Memory Management](#memory-management)
15. [Real-world Scenarios](#real-world-scenarios)

---

## Event Loop & Async Programming

### 1. Explain the phases of the Node.js event loop in detail
**Answer:**
The Node.js event loop has six main phases:

1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, prepare**: 
   - **Idle**: Internal phase where idle handles are run. These are used by Node.js internals for housekeeping tasks
   - **Prepare**: Internal phase that prepares for the poll phase. Node.js uses this to set up internal data structures
   - Both phases are not exposed to JavaScript developers and are used exclusively by libuv (Node.js's async I/O library) for internal operations
4. **Poll**: Retrieves new I/O events; executes I/O related callbacks
5. **Check**: `setImmediate()` callbacks are invoked here
6. **Close callbacks**: Executes close event callbacks (e.g., `socket.on('close')`)

Between each phase, Node.js checks for pending async operations or timers.

```javascript
console.log('Start');

setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Output:
// Start
// End
// nextTick
// Promise
// setTimeout
// setImmediate
```

### 2. What is the microtask queue and how does it differ from the macrotask queue?
**Answer:**
- **Microtasks**: `process.nextTick()`, Promises, `queueMicrotask()`
- **Macrotasks**: `setTimeout()`, `setInterval()`, `setImmediate()`, I/O operations

Microtasks are executed after the current operation completes and before any macrotasks. All microtasks in the queue are processed before moving to the next macrotask.

```javascript
setTimeout(() => console.log('Timeout 1'), 0);
Promise.resolve().then(() => {
  console.log('Promise 1');
  Promise.resolve().then(() => console.log('Promise 2'));
});
setTimeout(() => console.log('Timeout 2'), 0);

// Output:
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2
```

### 3. How would you handle concurrent API calls efficiently?
**Answer:**
```javascript
// Using Promise.all for concurrent execution
async function fetchMultipleResources() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('/api/users'),
      fetch('/api/posts'),
      fetch('/api/comments')
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    console.error('One or more requests failed:', error);
  }
}

// Using Promise.allSettled to handle partial failures
async function fetchWithFallback() {
  const results = await Promise.allSettled([
    fetch('/api/primary'),
    fetch('/api/secondary'),
    fetch('/api/tertiary')
  ]);
  
  return results.filter(r => r.status === 'fulfilled').map(r => r.value);
}

// Rate limiting with p-limit
const pLimit = require('p-limit');
const limit = pLimit(3);

async function processWithRateLimit(items) {
  return Promise.all(
    items.map(item => limit(() => processItem(item)))
  );
}
```

### 4. Explain async context tracking with AsyncLocalStorage
**Answer:**
```javascript
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

// Middleware to store request context
function requestContextMiddleware(req, res, next) {
  const store = { 
    requestId: req.headers['x-request-id'] || generateId(),
    userId: req.user?.id 
  };
  
  asyncLocalStorage.run(store, () => {
    next();
  });
}

// Access context anywhere in the async chain
function logger(message) {
  const context = asyncLocalStorage.getStore();
  console.log(`[${context?.requestId}] ${message}`);
}

// Usage in service
async function processOrder(orderId) {
  logger('Processing order'); // Logs with request ID
  await database.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  logger('Order processed');
}
```

---

## Streams & Buffers

### 5. Explain the different types of streams and when to use each
**Answer:**
1. **Readable**: Source of data (e.g., `fs.createReadStream()`)
2. **Writable**: Destination for data (e.g., `fs.createWriteStream()`)
3. **Duplex**: Both readable and writable (e.g., TCP socket)
4. **Transform**: Duplex stream that can modify data as it's read/written (e.g., compression)

```javascript
const { Transform } = require('stream');
const fs = require('fs');

// Transform stream to uppercase
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

// Pipeline example
const { pipeline } = require('stream/promises');

async function processLargeFile() {
  await pipeline(
    fs.createReadStream('input.txt'),
    new UpperCaseTransform(),
    fs.createWriteStream('output.txt')
  );
}
```

### 6. How do you handle backpressure in streams?
**Answer:**
```javascript
const fs = require('fs');

// Improper way (can cause memory issues)
function copyFileBad(source, destination) {
  const readable = fs.createReadStream(source);
  const writable = fs.createWriteStream(destination);
  
  readable.on('data', (chunk) => {
    writable.write(chunk); // Ignoring backpressure
  });
}

// Proper way (handling backpressure)
function copyFileGood(source, destination) {
  const readable = fs.createReadStream(source);
  const writable = fs.createWriteStream(destination);
  
  readable.on('data', (chunk) => {
    const canContinue = writable.write(chunk);
    if (!canContinue) {
      readable.pause(); // Pause reading when buffer is full
    }
  });
  
  writable.on('drain', () => {
    readable.resume(); // Resume when buffer is drained
  });
}

// Best way (using pipe)
function copyFileBest(source, destination) {
  fs.createReadStream(source)
    .pipe(fs.createWriteStream(destination));
}
```

### 7. What are Buffers and how do they work in Node.js?
**Answer:**
```javascript
// Creating buffers
const buf1 = Buffer.from('Hello', 'utf8');
const buf2 = Buffer.alloc(10); // Safe, filled with zeros
const buf3 = Buffer.allocUnsafe(10); // Fast but uninitialized

// Buffer operations
buf1.toString('hex'); // Convert to hex
buf1.slice(0, 2); // Create view (not copy)
Buffer.concat([buf1, buf2]); // Concatenate buffers

// Working with binary data
function parseHeader(buffer) {
  return {
    version: buffer.readUInt8(0),
    type: buffer.readUInt16BE(1),
    length: buffer.readUInt32BE(3),
    data: buffer.slice(7)
  };
}

// Buffer pooling for performance
class BufferPool {
  constructor(size = 8192) {
    this.buffer = Buffer.allocUnsafe(size);
    this.offset = 0;
  }
  
  allocate(size) {
    if (this.offset + size > this.buffer.length) {
      this.buffer = Buffer.allocUnsafe(Math.max(size, 8192));
      this.offset = 0;
    }
    
    const result = this.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return result;
  }
}
```

---

## Performance & Optimization

### 8. How do you profile and optimize Node.js applications?
**Answer:**
```javascript
// 1. Using built-in profiler
// Run: node --prof app.js
// Process: node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt

// 2. Using clinic.js
// npm install -g clinic
// clinic doctor -- node app.js

// 3. Memory profiling
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot() {
  const snapshot = v8.writeHeapSnapshot();
  console.log('Heap snapshot written to', snapshot);
}

// 4. Performance hooks
const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ['measure'] });

performance.mark('start-operation');
// ... operation
performance.mark('end-operation');
performance.measure('My Operation', 'start-operation', 'end-operation');

// 5. Common optimization techniques
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (item) {
      // LRU: Move to end
      this.cache.delete(key);
      this.cache.set(key, item);
      return item.value;
    }
    return null;
  }
  
  set(key, value, ttl = 60000) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, item);
  }
}
```

### 9. Explain connection pooling and its importance
**Answer:**
```javascript
// Database connection pooling
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Good: Uses pool
async function queryWithPool() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows; // Connection automatically released
}

// HTTP connection pooling
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50
});

// Use with axios or fetch
const axios = require('axios');
const client = axios.create({
  httpAgent,
  httpsAgent
});
```

### 10. How would you implement caching strategies?
**Answer:**
```javascript
// 1. In-memory caching
class InMemoryCache {
  constructor() {
    this.cache = new Map();
  }
  
  async getOrSet(key, factory, ttl = 60000) {
    const cached = this.cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    
    const value = await factory();
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
    
    return value;
  }
}

// 2. Redis caching
const redis = require('redis');
const client = redis.createClient();

async function cacheAside(key, factory, ttl = 3600) {
  // Try to get from cache
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss: fetch from source
  const data = await factory();
  
  // Store in cache
  await client.setEx(key, ttl, JSON.stringify(data));
  
  return data;
}

// 3. Cache invalidation patterns
class CacheManager {
  constructor(redis) {
    this.redis = redis;
  }
  
  // Tag-based invalidation
  async setWithTags(key, value, tags, ttl) {
    await this.redis.setEx(key, ttl, JSON.stringify(value));
    
    for (const tag of tags) {
      await this.redis.sAdd(`tag:${tag}`, key);
    }
  }
  
  async invalidateByTag(tag) {
    const keys = await this.redis.sMembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
      await this.redis.del(`tag:${tag}`);
    }
  }
}

// 4. Memoization
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = memoize((n) => {
  // Complex calculation
  return n * n;
});
```

---

## Clustering & Worker Threads

### 11. Explain the difference between cluster and worker threads
**Answer:**
```javascript
// CLUSTER: Multiple processes, separate V8 instances
// Good for: CPU-intensive tasks, utilizing all CPU cores
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace dead worker
  });
} else {
  // Workers share the same port
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}

// WORKER THREADS: Single process, shared memory
// Good for: Parallel processing, shared data
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  const worker = new Worker(__filename, {
    workerData: { num: 5 }
  });
  
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
  
  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });
} else {
  // Worker thread
  const result = calculateSomething(workerData.num);
  parentPort.postMessage(result);
}
```

### 12. How do you implement a worker pool?
**Answer:**
```javascript
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
  constructor(workerPath, poolSize = os.cpus().length) {
    this.workerPath = workerPath;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    
    this.initializeWorkers();
  }
  
  initializeWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerPath);
      
      worker.on('message', (result) => {
        if (worker.currentTask) {
          worker.currentTask.resolve(result);
          worker.currentTask = null;
        }
        this.processQueue();
      });
      
      worker.on('error', (error) => {
        if (worker.currentTask) {
          worker.currentTask.reject(error);
          worker.currentTask = null;
        }
        this.processQueue();
      });
      
      this.workers.push(worker);
    }
  }
  
  exec(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      this.queue.push(task);
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.currentTask);
    if (!availableWorker) return;
    
    const task = this.queue.shift();
    availableWorker.currentTask = task;
    availableWorker.postMessage(task.data);
  }
  
  terminate() {
    return Promise.all(this.workers.map(w => w.terminate()));
  }
}

// Usage
const pool = new WorkerPool('./heavy-task-worker.js', 4);

async function processItems(items) {
  const results = await Promise.all(
    items.map(item => pool.exec(item))
  );
  return results;
}
```

---

## Security

### 13. What are the common security vulnerabilities in Node.js and how to prevent them?
**Answer:**
```javascript
// 1. SQL Injection Prevention
const mysql = require('mysql2/promise');

// Bad
async function getUserBad(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return await db.query(query);
}

// Good: Use parameterized queries
async function getUserGood(userId) {
  const query = 'SELECT * FROM users WHERE id = ?';
  return await db.query(query, [userId]);
}

// 2. XSS Prevention
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeInput(dirty) {
  return DOMPurify.sanitize(dirty);
}

// 3. CSRF Prevention
const csrf = require('csurf');
const express = require('express');

const app = express();
const csrfProtection = csrf({ cookie: true });

app.post('/api/transfer', csrfProtection, (req, res) => {
  // Protected route
});

// 4. Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// 5. Input Validation
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(0).max(120)
});

function validateUser(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
}

// 6. Secure Headers
const helmet = require('helmet');
app.use(helmet());

// 7. Environment Variables
require('dotenv').config();

const config = {
  dbPassword: process.env.DB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  apiKey: process.env.API_KEY
};

// Never commit .env files or hardcode secrets

// 8. Dependency Security
// Run regularly: npm audit
// Run: npm audit fix
```

### 14. How do you implement secure authentication?
**Answer:**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  // Password hashing
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
  
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  // JWT tokens
  generateAccessToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }
  
  generateRefreshToken(userId) {
    const token = crypto.randomBytes(40).toString('hex');
    // Store refresh token in database with expiry
    return token;
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  // Middleware
  authenticateMiddleware() {
    return async (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      try {
        const decoded = this.verifyToken(token);
        req.userId = decoded.userId;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }
  
  // Token refresh
  async refreshAccessToken(refreshToken) {
    // Verify refresh token from database
    const userId = await this.verifyRefreshToken(refreshToken);
    
    if (!userId) {
      throw new Error('Invalid refresh token');
    }
    
    return this.generateAccessToken(userId);
  }
}

// Session-based authentication
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const redisClient = createClient();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Prevents XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));
```

---

## Express.js & Web Frameworks

### 15. Explain middleware patterns and execution flow in Express
**Answer:**
```javascript
const express = require('express');
const app = express();

// 1. Application-level middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 2. Router-level middleware
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

// 3. Error-handling middleware (4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 4. Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 5. Third-party middleware
const morgan = require('morgan');
app.use(morgan('combined'));

// 6. Conditional middleware
function conditionalMiddleware(condition) {
  return (req, res, next) => {
    if (condition(req)) {
      // Apply middleware logic
      next();
    } else {
      next(); // Skip
    }
  };
}

// 7. Async middleware with error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
}));

// 8. Composable middleware
function compose(...middlewares) {
  return (req, res, next) => {
    let index = 0;
    
    function dispatch(i) {
      if (i >= middlewares.length) return next();
      
      const middleware = middlewares[i];
      middleware(req, res, () => dispatch(i + 1));
    }
    
    dispatch(0);
  };
}
```

### 16. How do you structure a large Express application?
**Answer:**
```javascript
// Project structure:
// src/
//   ├── config/
//   │   ├── database.js
//   │   └── env.js
//   ├── middleware/
//   │   ├── auth.js
//   │   ├── validation.js
//   │   └── error-handler.js
//   ├── routes/
//   │   ├── users.js
//   │   ├── posts.js
//   │   └── index.js
//   ├── controllers/
//   │   ├── user.controller.js
//   │   └── post.controller.js
//   ├── services/
//   │   ├── user.service.js
//   │   └── post.service.js
//   ├── models/
//   │   ├── user.model.js
//   │   └── post.model.js
//   ├── utils/
//   │   ├── logger.js
//   │   └── helpers.js
//   └── app.js

// src/app.js
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/error-handler');

function createApp() {
  const app = express();
  
  // Global middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api/v1', routes);
  
  // Error handling
  app.use(errorHandler);
  
  return app;
}

module.exports = createApp;

// src/routes/index.js
const express = require('express');
const userRoutes = require('./users');
const postRoutes = require('./posts');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;

// src/routes/users.js
const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.post('/', validateUser, userController.createUser);
router.put('/:id', authenticate, validateUser, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;

// src/controllers/user.controller.js
const userService = require('../services/user.service');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.findAll(req.query);
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }
  
  async getUserById(req, res, next) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }
  
  async createUser(req, res, next) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

// src/services/user.service.js
const User = require('../models/user.model');

class UserService {
  async findAll(filters) {
    return await User.find(filters);
  }
  
  async findById(id) {
    return await User.findById(id);
  }
  
  async create(data) {
    const user = new User(data);
    return await user.save();
  }
  
  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
  
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
```

---

## Database & ORM

### 17. Explain database transactions and ACID properties
**Answer:**
```javascript
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password');

// Transaction example
async function transferMoney(fromAccountId, toAccountId, amount) {
  const t = await sequelize.transaction();
  
  try {
    // Debit from account
    const fromAccount = await Account.findByPk(fromAccountId, {
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    
    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    await fromAccount.update(
      { balance: fromAccount.balance - amount },
      { transaction: t }
    );
    
    // Credit to account
    const toAccount = await Account.findByPk(toAccountId, {
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    
    await toAccount.update(
      { balance: toAccount.balance + amount },
      { transaction: t }
    );
    
    // Commit transaction
    await t.commit();
    
    return { success: true };
  } catch (error) {
    // Rollback on error
    await t.rollback();
    throw error;
  }
}

// ACID Properties:
// Atomicity: All or nothing (transaction commits or rolls back)
// Consistency: Database remains in valid state
// Isolation: Concurrent transactions don't interfere
// Durability: Committed changes persist

// Isolation levels
const transaction = await sequelize.transaction({
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
});

// ISOLATION_LEVELS:
// - READ_UNCOMMITTED
// - READ_COMMITTED
// - REPEATABLE_READ
// - SERIALIZABLE
```

### 18. How do you optimize database queries?
**Answer:**
```javascript
// 1. Indexing
// CREATE INDEX idx_email ON users(email);
// CREATE INDEX idx_user_created ON users(user_id, created_at);

// 2. N+1 Query Problem
// Bad: N+1 queries
async function getUsersWithPostsBad() {
  const users = await User.findAll();
  
  for (const user of users) {
    user.posts = await Post.findAll({ where: { userId: user.id } });
  }
  
  return users;
}

// Good: Single query with join
async function getUsersWithPostsGood() {
  return await User.findAll({
    include: [{
      model: Post,
      as: 'posts'
    }]
  });
}

// 3. Select only needed fields
async function getUserNames() {
  return await User.findAll({
    attributes: ['id', 'name', 'email'],
    where: { active: true }
  });
}

// 4. Pagination
async function getPaginatedUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    users: rows,
    pagination: {
      total: count,
      page,
      pages: Math.ceil(count / limit)
    }
  };
}

// 5. Query caching
const cache = new Map();

async function getCachedUser(id) {
  const cacheKey = `user:${id}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const user = await User.findByPk(id);
  cache.set(cacheKey, user);
  
  return user;
}

// 6. Bulk operations
async function createManyUsers(usersData) {
  return await User.bulkCreate(usersData, {
    validate: true,
    ignoreDuplicates: true
  });
}

// 7. Raw queries for complex operations
async function getComplexReport() {
  const [results] = await sequelize.query(`
    SELECT 
      u.id,
      u.name,
      COUNT(p.id) as post_count,
      AVG(p.views) as avg_views
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id
    WHERE u.active = true
    GROUP BY u.id
    HAVING COUNT(p.id) > 10
    ORDER BY avg_views DESC
    LIMIT 100
  `);
  
  return results;
}

// 8. Connection pooling
const sequelize = new Sequelize('database', 'username', 'password', {
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});
```

---

## Testing

### 19. How do you write effective unit and integration tests?
**Answer:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

// Unit test example
// user.service.test.js
const UserService = require('../services/user.service');
const User = require('../models/user.model');

jest.mock('../models/user.model');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'John' };
      User.findByPk.mockResolvedValue(mockUser);
      
      const result = await UserService.findById(1);
      
      expect(result).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith(1);
    });
    
    it('should return null when user not found', async () => {
      User.findByPk.mockResolvedValue(null);
      
      const result = await UserService.findById(999);
      
      expect(result).toBeNull();
    });
  });
  
  describe('create', () => {
    it('should create user with hashed password', async () => {
      const userData = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, ...userData };
      
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);
      
      const result = await UserService.create(userData);
      
      expect(result.password).not.toBe('password123');
      expect(User.prototype.save).toHaveBeenCalled();
    });
  });
});

// Integration test example
// user.routes.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');

describe('User Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data).not.toHaveProperty('password');
    });
    
    it('should return 400 for invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      });
      
      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .expect(200);
      
      expect(response.body.data.id).toBe(user.id);
      expect(response.body.data.email).toBe(user.email);
    });
    
    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/999999')
        .expect(404);
    });
  });
});

// Test helpers
// test/helpers/test-helpers.js
class TestHelper {
  static async createUser(data = {}) {
    return await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      ...data
    });
  }
  
  static async getAuthToken(user) {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'password123'
      });
    
    return response.body.token;
  }
}

module.exports = TestHelper;
```

---

## Design Patterns

### 20. Explain common Node.js design patterns
**Answer:**
```javascript
// 1. Singleton Pattern
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    DatabaseConnection.instance = this;
  }
  
  async connect() {
    if (!this.connection) {
      this.connection = await createConnection();
    }
    return this.connection;
  }
}

// 2. Factory Pattern
class UserFactory {
  static create(type, data) {
    switch (type) {
      case 'admin':
        return new AdminUser(data);
      case 'moderator':
        return new ModeratorUser(data);
      case 'regular':
        return new RegularUser(data);
      default:
        throw new Error('Invalid user type');
    }
  }
}

// 3. Repository Pattern
class UserRepository {
  constructor(database) {
    this.db = database;
  }
  
  async findById(id) {
    return await this.db.users.findOne({ id });
  }
  
  async findAll(filters) {
    return await this.db.users.find(filters);
  }
  
  async save(user) {
    if (user.id) {
      return await this.db.users.update(user.id, user);
    }
    return await this.db.users.insert(user);
  }
  
  async delete(id) {
    return await this.db.users.delete(id);
  }
}

// 4. Dependency Injection
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }
  
  async createUser(data) {
    this.logger.info('Creating user');
    const user = await this.userRepository.save(data);
    await this.emailService.sendWelcomeEmail(user);
    return user;
  }
}

// DI Container
class Container {
  constructor() {
    this.services = new Map();
  }
  
  register(name, factory) {
    this.services.set(name, factory);
  }
  
  resolve(name) {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory(this);
  }
}

const container = new Container();
container.register('userRepository', () => new UserRepository(db));
container.register('emailService', () => new EmailService());
container.register('userService', (c) => 
  new UserService(
    c.resolve('userRepository'),
    c.resolve('emailService'),
    logger
  )
);

// 5. Observer Pattern (EventEmitter)
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  async createOrder(orderData) {
    const order = await this.saveOrder(orderData);
    
    this.emit('orderCreated', order);
    
    return order;
  }
}

const orderService = new OrderService();

orderService.on('orderCreated', (order) => {
  emailService.sendOrderConfirmation(order);
});

orderService.on('orderCreated', (order) => {
  inventoryService.reserveItems(order);
});

// 6. Middleware/Chain of Responsibility
class ValidationMiddleware {
  constructor(next) {
    this.next = next;
  }
  
  async handle(request) {
    if (!this.validate(request)) {
      throw new Error('Validation failed');
    }
    return this.next?.handle(request);
  }
}

class AuthenticationMiddleware {
  constructor(next) {
    this.next = next;
  }
  
  async handle(request) {
    if (!request.user) {
      throw new Error('Not authenticated');
    }
    return this.next?.handle(request);
  }
}

class RequestHandler {
  async handle(request) {
    // Process request
    return { success: true };
  }
}

// Chain them
const handler = new ValidationMiddleware(
  new AuthenticationMiddleware(
    new RequestHandler()
  )
);

// 7. Strategy Pattern
class PaymentStrategy {
  pay(amount) {
    throw new Error('Method must be implemented');
  }
}

class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paying ${amount} with credit card`);
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paying ${amount} with PayPal`);
  }
}

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  processPayment(amount) {
    this.strategy.pay(amount);
  }
}
```

---

## Microservices

### 21. How do you design microservices architecture?
**Answer:**
```javascript
// 1. Service Structure
// user-service/
//   src/
//     api/
//       routes.js
//       controllers.js
//     domain/
//       user.js
//       repository.js
//     infrastructure/
//       database.js
//       messaging.js
//     app.js
//   package.json
//   Dockerfile

// 2. Inter-service Communication: REST
const axios = require('axios');

class OrderService {
  constructor() {
    this.userServiceUrl = process.env.USER_SERVICE_URL;
    this.inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL;
  }
  
  async createOrder(userId, items) {
    // Get user details
    const user = await axios.get(`${this.userServiceUrl}/users/${userId}`);
    
    // Check inventory
    const availability = await axios.post(
      `${this.inventoryServiceUrl}/check`,
      { items }
    );
    
    if (!availability.data.available) {
      throw new Error('Items not available');
    }
    
    // Create order
    const order = await this.saveOrder({ userId, items });
    
    return order;
  }
}

// 3. Inter-service Communication: Message Queue
const amqp = require('amqplib');

class MessageBroker {
  constructor() {
    this.connection = null;
    this.channel = null;
  }
  
  async connect() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
  }
  
  async publish(exchange, routingKey, message) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }
  
  async subscribe(queue, exchange, pattern, handler) {
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, pattern);
    
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        
        try {
          await handler(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg, false, true); // Requeue
        }
      }
    });
  }
}

// Usage
const broker = new MessageBroker();
await broker.connect();

// Publish event
await broker.publish('orders', 'order.created', {
  orderId: 123,
  userId: 456,
  total: 99.99
});

// Subscribe to events
await broker.subscribe(
  'inventory-service-queue',
  'orders',
  'order.created',
  async (message) => {
    await inventoryService.reserveItems(message.orderId);
  }
);

// 4. Service Discovery
const Consul = require('consul');

class ServiceRegistry {
  constructor() {
    this.consul = new Consul();
    this.serviceName = process.env.SERVICE_NAME;
    this.serviceId = `${this.serviceName}-${process.pid}`;
  }
  
  async register(port) {
    await this.consul.agent.service.register({
      id: this.serviceId,
      name: this.serviceName,
      address: 'localhost',
      port,
      check: {
        http: `http://localhost:${port}/health`,
        interval: '10s',
        timeout: '5s'
      }
    });
  }
  
  async deregister() {
    await this.consul.agent.service.deregister(this.serviceId);
  }
  
  async discover(serviceName) {
    const result = await this.consul.health.service({
      service: serviceName,
      passing: true
    });
    
    return result.map(entry => ({
      address: entry.Service.Address,
      port: entry.Service.Port
    }));
  }
}

// 5. Circuit Breaker Pattern
class CircuitBreaker {
  constructor(request, options = {}) {
    this.request = request;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000;
  }
  
  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await this.request(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }
  
  onFailure() {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Usage
const breaker = new CircuitBreaker(
  async (userId) => {
    return await axios.get(`${userServiceUrl}/users/${userId}`);
  },
  { failureThreshold: 3, timeout: 30000 }
);
```

---

## Error Handling

### 22. What are the best practices for error handling in Node.js?
**Answer:**
```javascript
// 1. Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// 2. Global Error Handler
function errorHandler(err, req, res, next) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    code: err.code,
    url: req.url,
    method: req.method
  });
  
  // Operational errors: send to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err.errors && { errors: err.errors })
      }
    });
  }
  
  // Programming errors: don't leak details
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
}

app.use(errorHandler);

// 3. Async Error Handling
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json({ data: user });
}));

// 4. Unhandled Rejections and Exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  // Graceful shutdown
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Graceful shutdown
  process.exit(1);
});

// 5. Graceful Shutdown
let server;

function startServer() {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

function gracefulShutdown(signal) {
  console.log(`Received ${signal}, starting graceful shutdown`);
  
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connections
    database.close(() => {
      console.log('Database connections closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 6. Error Recovery
class RetryableOperation {
  static async execute(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          await this.sleep(delay * attempt);
          console.log(`Retry attempt ${attempt}/${maxRetries}`);
        }
      }
    }
    
    throw lastError;
  }
  
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const result = await RetryableOperation.execute(
  async () => await externalAPI.call(),
  3,
  1000
);
```

---

## Authentication & Authorization

### 23. Implement role-based access control (RBAC)
**Answer:**
```javascript
// 1. Role and Permission Models
const roles = {
  ADMIN: ['user:read', 'user:write', 'user:delete', 'post:read', 'post:write', 'post:delete'],
  MODERATOR: ['user:read', 'post:read', 'post:write', 'post:delete'],
  USER: ['user:read', 'post:read', 'post:write']
};

// 2. Authorization Middleware
function authorize(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const userPermissions = roles[req.user.role] || [];
    
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Usage
app.delete('/api/users/:id',
  authenticate,
  authorize('user:delete'),
  userController.deleteUser
);

// 3. Advanced RBAC with Resource Ownership
class AuthorizationService {
  canAccess(user, resource, action) {
    // Check role permissions
    const permissions = roles[user.role] || [];
    const permission = `${resource}:${action}`;
    
    if (permissions.includes(permission)) {
      return true;
    }
    
    return false;
  }
  
  canAccessResource(user, resource, resourceData) {
    // Owner can always access their own resources
    if (resourceData.ownerId === user.id) {
      return true;
    }
    
    // Check role permissions
    return this.canAccess(user, resource, 'read');
  }
}

// Middleware
function authorizeResource(resource, action) {
  return async (req, res, next) => {
    const resourceData = await getResourceData(resource, req.params.id);
    
    if (!resourceData) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const authService = new AuthorizationService();
    
    if (!authService.canAccessResource(req.user, resource, resourceData)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    req.resourceData = resourceData;
    next();
  };
}

// 4. Policy-Based Authorization
class Policy {
  static canUpdatePost(user, post) {
    // Owner can update
    if (post.authorId === user.id) {
      return true;
    }
    
    // Admin and moderator can update
    if (['ADMIN', 'MODERATOR'].includes(user.role)) {
      return true;
    }
    
    return false;
  }
  
  static canDeletePost(user, post) {
    // Owner can delete within 24 hours
    if (post.authorId === user.id) {
      const hoursSinceCreation = (Date.now() - post.createdAt) / (1000 * 60 * 60);
      return hoursSinceCreation < 24;
    }
    
    // Admin can always delete
    return user.role === 'ADMIN';
  }
}

app.put('/api/posts/:id', authenticate, async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!Policy.canUpdatePost(req.user, post)) {
    return res.status(403).json({ error: 'Cannot update this post' });
  }
  
  await post.update(req.body);
  res.json({ data: post });
});
```

---

## API Design

### 24. What are REST API best practices?
**Answer:**
```javascript
// 1. RESTful Resource Naming
// Good
GET    /api/v1/users              // List users
GET    /api/v1/users/:id          // Get user
POST   /api/v1/users              // Create user
PUT    /api/v1/users/:id          // Update user (full)
PATCH  /api/v1/users/:id          // Update user (partial)
DELETE /api/v1/users/:id          // Delete user

// Nested resources
GET    /api/v1/users/:id/posts    // User's posts
POST   /api/v1/users/:id/posts    // Create post for user

// Bad
GET    /api/v1/getAllUsers
POST   /api/v1/createUser
GET    /api/v1/user-delete/:id

// 2. Response Format
class APIResponse {
  static success(data, meta = {}) {
    return {
      success: true,
      data,
      meta
    };
  }
  
  static error(message, errors = null) {
    return {
      success: false,
      error: {
        message,
        ...(errors && { details: errors })
      }
    };
  }
  
  static paginated(data, pagination) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit)
      }
    };
  }
}

// Usage
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(APIResponse.success(users));
});

// 3. Versioning
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Or header-based
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});

// 4. Filtering, Sorting, Pagination
class QueryBuilder {
  static buildQuery(req) {
    const query = {};
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: (parseInt(req.query.page) || 1 - 1) * (parseInt(req.query.limit) || 20)
    };
    
    // Filtering
    if (req.query.filter) {
      const filters = JSON.parse(req.query.filter);
      Object.assign(query, filters);
    }
    
    // Sorting
    if (req.query.sort) {
      options.order = req.query.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.slice(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
    }
    
    // Field selection
    if (req.query.fields) {
      options.attributes = req.query.fields.split(',');
    }
    
    return { query, options };
  }
}

// Usage
app.get('/api/users', async (req, res) => {
  const { query, options } = QueryBuilder.buildQuery(req);
  const { count, rows } = await User.findAndCountAll({ where: query, ...options });
  
  res.json(APIResponse.paginated(rows, {
    page: req.query.page || 1,
    limit: options.limit,
    total: count
  }));
});

// Example: GET /api/users?filter={"active":true}&sort=-createdAt&fields=id,name,email&page=2&limit=10

// 5. Rate Limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient()
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP',
  headers: true
});

app.use('/api/', limiter);

// 6. HATEOAS (Hypermedia)
function addLinks(resource, baseUrl) {
  return {
    ...resource,
    _links: {
      self: { href: `${baseUrl}/${resource.id}` },
      update: { href: `${baseUrl}/${resource.id}`, method: 'PUT' },
      delete: { href: `${baseUrl}/${resource.id}`, method: 'DELETE' }
    }
  };
}
```

---

## Memory Management

### 25. How do you detect and fix memory leaks?
**Answer:**
```javascript
// 1. Common Memory Leak Causes

// Bad: Global variables
global.cache = []; // Never cleared
function addToCache(item) {
  global.cache.push(item);
}

// Good: Use proper data structures with limits
class LRUCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Bad: Event listeners not removed
class BadService {
  start() {
    process.on('message', this.handleMessage);
  }
  // Memory leak: listener never removed
}

// Good: Cleanup event listeners
class GoodService {
  start() {
    this.handleMessage = this.handleMessage.bind(this);
    process.on('message', this.handleMessage);
  }
  
  stop() {
    process.removeListener('message', this.handleMessage);
  }
}

// Bad: Closures holding references
function createClosure() {
  const largeData = new Array(1000000);
  
  return function() {
    console.log(largeData.length); // Holds reference
  };
}

// Good: Clear references when done
function createClosure() {
  let largeData = new Array(1000000);
  
  return function() {
    const length = largeData.length;
    largeData = null; // Clear reference
    console.log(length);
  };
}

// 2. Memory Monitoring
const v8 = require('v8');

function getMemoryUsage() {
  const usage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();
  
  return {
    rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(usage.external / 1024 / 1024)} MB`,
    heapLimit: `${Math.round(heapStats.heap_size_limit / 1024 / 1024)} MB`
  };
}

// Monitor memory every minute
setInterval(() => {
  const memory = getMemoryUsage();
  console.log('Memory usage:', memory);
  
  // Alert if memory is high
  const heapUsed = parseFloat(memory.heapUsed);
  const heapLimit = parseFloat(memory.heapLimit);
  
  if (heapUsed / heapLimit > 0.9) {
    console.warn('WARNING: High memory usage!');
  }
}, 60000);

// 3. Heap Snapshots
function takeHeapSnapshot() {
  const filename = `heap-${Date.now()}.heapsnapshot`;
  v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${filename}`);
  // Load in Chrome DevTools to analyze
}

// 4. WeakMap and WeakSet for preventing leaks
// Bad: Regular Map holds references
const cache = new Map();
function cacheUserData(user) {
  cache.set(user, user.data);
  // User object can't be garbage collected
}

// Good: WeakMap allows garbage collection
const cache = new WeakMap();
function cacheUserData(user) {
  cache.set(user, user.data);
  // User object can be garbage collected when no other references exist
}

// 5. Stream properly to avoid buffering
// Bad: Buffering entire file
app.get('/download', async (req, res) => {
  const file = await fs.promises.readFile('large-file.zip');
  res.send(file); // Loads entire file in memory
});

// Good: Streaming
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('large-file.zip');
  stream.pipe(res);
});
```

---

## Real-world Scenarios

### 26. How would you design a real-time notification system?
**Answer:**
```javascript
// Architecture: WebSocket + Redis Pub/Sub + Queue

// 1. WebSocket Server
const WebSocket = require('ws');
const redis = require('redis');

class NotificationServer {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();
    this.connections = new Map(); // userId -> WebSocket[]
    
    this.initialize();
  }
  
  initialize() {
    // Handle WebSocket connections
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });
    
    // Subscribe to Redis notifications
    this.subscriber.subscribe('notifications');
    this.subscriber.on('message', (channel, message) => {
      this.broadcastNotification(JSON.parse(message));
    });
  }
  
  handleConnection(ws, req) {
    const userId = this.authenticateUser(req);
    
    if (!userId) {
      ws.close(4001, 'Unauthorized');
      return;
    }
    
    // Store connection
    if (!this.connections.has(userId)) {
      this.connections.set(userId, []);
    }
    this.connections.get(userId).push(ws);
    
    // Send pending notifications
    this.sendPendingNotifications(userId, ws);
    
    // Handle disconnection
    ws.on('close', () => {
      const userConnections = this.connections.get(userId);
      const index = userConnections.indexOf(ws);
      if (index > -1) {
        userConnections.splice(index, 1);
      }
      if (userConnections.length === 0) {
        this.connections.delete(userId);
      }
    });
    
    // Heartbeat
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  }
  
  broadcastNotification(notification) {
    const userConnections = this.connections.get(notification.userId);
    
    if (userConnections) {
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(notification));
        }
      });
    } else {
      // User offline: store for later
      this.storeNotification(notification);
    }
  }
  
  async storeNotification(notification) {
    await this.publisher.rPush(
      `notifications:${notification.userId}`,
      JSON.stringify(notification)
    );
    
    // Set expiry
    await this.publisher.expire(
      `notifications:${notification.userId}`,
      86400 // 24 hours
    );
  }
  
  async sendPendingNotifications(userId, ws) {
    const notifications = await this.publisher.lRange(
      `notifications:${userId}`,
      0,
      -1
    );
    
    notifications.forEach(notification => {
      ws.send(notification);
    });
    
    // Clear pending notifications
    await this.publisher.del(`notifications:${userId}`);
  }
}

// 2. Notification Service
class NotificationService {
  constructor(redis) {
    this.redis = redis;
  }
  
  async send(userId, notification) {
    const message = {
      userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      timestamp: Date.now()
    };
    
    // Publish to Redis
    await this.redis.publish('notifications', JSON.stringify(message));
    
    // Store in database
    await this.saveToDatabase(message);
  }
  
  async saveToDatabase(notification) {
    await Notification.create({
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      read: false
    });
  }
}

// 3. Client Usage
class NotificationClient {
  connect(token) {
    this.ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    
    this.ws.on('open', () => {
      console.log('Connected to notification server');
    });
    
    this.ws.on('message', (data) => {
      const notification = JSON.parse(data);
      this.handleNotification(notification);
    });
    
    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    this.ws.on('close', () => {
      console.log('Disconnected from notification server');
      // Reconnect after delay
      setTimeout(() => this.connect(token), 5000);
    });
  }
  
  handleNotification(notification) {
    console.log('New notification:', notification);
    // Show UI notification
  }
}
```

### 27. Design a file upload system with progress tracking
**Answer:**
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// 1. Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', req.userId);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// 2. Upload Endpoint
app.post('/api/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Save file metadata
  const file = await File.create({
    userId: req.userId,
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
  
  res.json({
    success: true,
    data: {
      id: file.id,
      name: file.originalName,
      size: file.size
    }
  });
});

// 3. Chunked Upload for Large Files
class ChunkedUploadService {
  constructor() {
    this.uploads = new Map();
  }
  
  async initiate(userId, filename, fileSize, totalChunks) {
    const uploadId = crypto.randomBytes(16).toString('hex');
    const uploadDir = path.join(__dirname, 'temp', uploadId);
    
    await fs.promises.mkdir(uploadDir, { recursive: true });
    
    this.uploads.set(uploadId, {
      userId,
      filename,
      fileSize,
      totalChunks,
      uploadedChunks: new Set(),
      uploadDir
    });
    
    return uploadId;
  }
  
  async uploadChunk(uploadId, chunkIndex, chunk) {
    const upload = this.uploads.get(uploadId);
    
    if (!upload) {
      throw new Error('Upload not found');
    }
    
    const chunkPath = path.join(upload.uploadDir, `chunk-${chunkIndex}`);
    await fs.promises.writeFile(chunkPath, chunk);
    
    upload.uploadedChunks.add(chunkIndex);
    
    // Check if all chunks uploaded
    if (upload.uploadedChunks.size === upload.totalChunks) {
      return await this.completeUpload(uploadId);
    }
    
    return {
      progress: (upload.uploadedChunks.size / upload.totalChunks) * 100
    };
  }
  
  async completeUpload(uploadId) {
    const upload = this.uploads.get(uploadId);
    const finalPath = path.join(__dirname, 'uploads', upload.userId, upload.filename);
    
    // Merge chunks
    const writeStream = fs.createWriteStream(finalPath);
    
    for (let i = 0; i < upload.totalChunks; i++) {
      const chunkPath = path.join(upload.uploadDir, `chunk-${i}`);
      const chunk = await fs.promises.readFile(chunkPath);
      writeStream.write(chunk);
    }
    
    writeStream.end();
    
    // Cleanup temp files
    await fs.promises.rm(upload.uploadDir, { recursive: true });
    this.uploads.delete(uploadId);
    
    return { success: true, path: finalPath };
  }
}

// 4. Progress Tracking with SSE
app.get('/api/upload/:uploadId/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const uploadId = req.params.uploadId;
  
  const interval = setInterval(() => {
    const upload = uploadService.uploads.get(uploadId);
    
    if (!upload) {
      clearInterval(interval);
      res.end();
      return;
    }
    
    const progress = (upload.uploadedChunks.size / upload.totalChunks) * 100;
    
    res.write(`data: ${JSON.stringify({ progress })}\n\n`);
    
    if (progress === 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});
```

---

## Additional Questions

### 28. Explain Node.js event emitters and custom events
### 29. How do you implement cron jobs in Node.js?
### 30. What is the difference between `spawn`, `exec`, `execFile`, and `fork`?
### 31. How do you implement WebSockets for real-time communication?
### 32. Explain process management with PM2
### 33. How do you implement server-side caching strategies?
### 34. What are the best practices for logging in Node.js?
### 35. How do you handle file system operations efficiently?
### 36. Explain the difference between SQL and NoSQL databases
### 37. How do you implement GraphQL with Node.js?
### 38. What are the best practices for Docker and containerization?
### 39. How do you implement rate limiting and throttling?
### 40. Explain the concept of idempotency in APIs

---

## System Design Questions

### 41. Design a URL shortener service
### 42. Design a rate-limited API gateway
### 43. Design a job queue system
### 44. Design a caching layer for a high-traffic application
### 45. Design a logging and monitoring system

---

## Performance Questions

### 46. How would you optimize a slow API endpoint?
### 47. What tools do you use for monitoring Node.js applications?
### 48. How do you handle memory leaks in production?
### 49. Explain the N+1 query problem and solutions
### 50. How do you optimize database queries?

---

This comprehensive guide covers middle-level Node.js backend interview topics. Practice implementing these concepts and understanding the underlying principles for a successful interview.

