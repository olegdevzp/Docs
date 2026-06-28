# Common Problems Mid-Level Backend Developers Face with Node.js

A comprehensive guide to challenges, solutions, and best practices for mid-level Node.js backend developers.

## Table of Contents

1. [Asynchronous Programming Challenges](#asynchronous-programming-challenges)
2. [Error Handling and Debugging](#error-handling-and-debugging)
3. [Memory Management and Leaks](#memory-management-and-leaks)
4. [Performance and Scalability](#performance-and-scalability)
5. [Database Management](#database-management)
6. [API Design and Architecture](#api-design-and-architecture)
7. [Security Concerns](#security-concerns)
8. [Testing and Quality Assurance](#testing-and-quality-assurance)
9. [Deployment and DevOps](#deployment-and-devops)
10. [Package Management and Dependencies](#package-management-and-dependencies)

---

## Asynchronous Programming Challenges

### 1. Callback Hell and Promise Chaining Issues

**Problem:** Managing multiple nested asynchronous operations leads to unreadable and unmaintainable code.

```javascript
// Callback Hell (Anti-pattern)
getUserData(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      // More nesting...
    });
  });
});

// Solution: Use async/await
async function getUserOrders(userId) {
  try {
    const user = await getUserData(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    return details;
  } catch (error) {
    handleError(error);
  }
}
```

**Best Practices:**
- Use async/await for cleaner asynchronous code
- Avoid mixing callbacks and promises
- Use Promise.all() for parallel operations
- Implement proper error boundaries

**Links:**
- [Node.js Async Best Practices](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
- [Async/Await Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

### 2. Understanding the Event Loop and Blocking Operations

**Problem:** CPU-intensive operations block the event loop, causing server unresponsiveness.

```javascript
// Problem: Blocking operation
app.get('/compute', (req, res) => {
  const result = expensiveComputation(); // Blocks event loop
  res.json({ result });
});

// Solution 1: Use Worker Threads
const { Worker } = require('worker_threads');

app.get('/compute', (req, res) => {
  const worker = new Worker('./compute-worker.js');
  
  worker.on('message', (result) => {
    res.json({ result });
  });
  
  worker.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });
});

// Solution 2: Break into smaller chunks
async function processInChunks(data) {
  for (let i = 0; i < data.length; i += 1000) {
    const chunk = data.slice(i, i + 1000);
    await processChunk(chunk);
    await setImmediate(); // Yield to event loop
  }
}
```

**Best Practices:**
- Use Worker Threads for CPU-intensive tasks
- Implement job queues (Bull, BeeQueue)
- Monitor event loop lag
- Use process.nextTick() and setImmediate() appropriately

**Links:**
- [Understanding Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Worker Threads Documentation](https://nodejs.org/api/worker_threads.html)

### 3. Race Conditions and Concurrent Operations

**Problem:** Multiple asynchronous operations accessing shared resources can lead to data inconsistency.

```javascript
// Problem: Race condition
let counter = 0;

async function incrementCounter() {
  const current = counter;
  await someAsyncOperation();
  counter = current + 1; // Race condition!
}

// Solution: Use proper locking mechanisms
const { Mutex } = require('async-mutex');
const mutex = new Mutex();

async function incrementCounterSafe() {
  const release = await mutex.acquire();
  try {
    const current = counter;
    await someAsyncOperation();
    counter = current + 1;
  } finally {
    release();
  }
}

// Solution for databases: Use transactions
async function transferMoney(fromId, toId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await Account.findByIdAndUpdate(fromId, { $inc: { balance: -amount } }, { session });
    await Account.findByIdAndUpdate(toId, { $inc: { balance: amount } }, { session });
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

**Best Practices:**
- Use mutex/semaphore for critical sections
- Implement database transactions
- Use atomic operations when possible
- Consider event sourcing for complex scenarios

**Links:**
- [Async Mutex Library](https://www.npmjs.com/package/async-mutex)
- [MongoDB Transactions](https://docs.mongodb.com/manual/core/transactions/)

---

## Error Handling and Debugging

### 4. Unhandled Promise Rejections

**Problem:** Unhandled promise rejections can crash Node.js applications (in newer versions).

```javascript
// Problem: Unhandled rejection
async function fetchData() {
  throw new Error('API Error');
}

fetchData(); // Unhandled rejection!

// Solution 1: Always handle rejections
async function main() {
  try {
    await fetchData();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Solution 2: Global handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to error monitoring service
  logger.error('Unhandled Rejection', { reason, promise });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Graceful shutdown
  process.exit(1);
});

// Solution 3: Use error middleware (Express)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});
```

**Best Practices:**
- Always use try-catch with async/await
- Add .catch() to all promises
- Implement global error handlers
- Use error monitoring tools (Sentry, Rollbar)
- Never ignore errors silently

**Links:**
- [Node.js Error Handling](https://nodejs.org/api/errors.html)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)

### 5. Debugging Async Stack Traces

**Problem:** Stack traces in asynchronous code are difficult to trace back to the source.

```javascript
// Problem: Lost stack trace
async function level1() {
  await level2();
}

async function level2() {
  await level3();
}

async function level3() {
  throw new Error('Something went wrong');
}

// Solution 1: Use --async-stack-traces flag
// node --async-stack-traces app.js

// Solution 2: Custom error wrapper
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Solution 3: Add context to errors
async function fetchUserData(userId) {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user;
  } catch (error) {
    throw new AppError(
      `Failed to fetch user data for userId: ${userId}`,
      500
    );
  }
}

// Solution 4: Use logging libraries with context
const winston = require('winston');
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: 'error.log' })]
});
```

**Best Practices:**
- Use Node.js async stack traces in development
- Implement structured logging
- Add context to error messages
- Use APM tools (New Relic, DataDog)

**Links:**
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Winston Logger](https://github.com/winstonjs/winston)

### 6. Error Classification and Handling Strategy

**Problem:** Not distinguishing between operational and programmer errors.

```javascript
// Error classification
class OperationalError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
  }
}

// Operational errors (expected, can be handled)
throw new OperationalError('User not found', 404);
throw new OperationalError('Invalid input', 400);
throw new OperationalError('Database connection failed', 503);

// Programmer errors (bugs, should crash)
// - Null reference errors
// - Type errors
// - Syntax errors

// Error handling middleware
function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    // Operational error - send response
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }
  
  // Programmer error - log and crash
  console.error('PROGRAMMER ERROR:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
  
  // Graceful shutdown for programmer errors
  process.exit(1);
}

// Centralized error handling
class ErrorHandler {
  async handleError(error) {
    await logger.error('Error occurred', {
      message: error.message,
      stack: error.stack
    });
    
    await this.sendAlertToOps(error);
  }
  
  isTrustedError(error) {
    return error.isOperational;
  }
  
  async sendAlertToOps(error) {
    // Send to Slack, PagerDuty, etc.
  }
}

const errorHandler = new ErrorHandler();

process.on('uncaughtException', async (error) => {
  if (!errorHandler.isTrustedError(error)) {
    await errorHandler.handleError(error);
    process.exit(1);
  }
});
```

**Best Practices:**
- Distinguish operational vs programmer errors
- Don't catch programmer errors
- Implement graceful shutdown
- Use centralized error handling
- Monitor and alert on errors

**Links:**
- [Error Handling Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#handle-errors)
- [Joyent Error Handling](https://www.joyent.com/node-js/production/design/errors)

---

## Memory Management and Leaks

### 7. Memory Leaks in Long-Running Processes

**Problem:** Node.js applications suffer from memory leaks causing crashes and performance degradation.

```javascript
// Common memory leak patterns

// Problem 1: Global variables accumulation
global.cache = {};
function addToCache(key, value) {
  global.cache[key] = value; // Never cleaned up!
}

// Solution: Use proper caching with TTL
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes TTL

// Problem 2: Event listeners not removed
class DataProcessor extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }
  
  setupListeners() {
    // Memory leak - never removed!
    process.on('data', this.handleData.bind(this));
  }
}

// Solution: Remove listeners
class DataProcessorFixed extends EventEmitter {
  constructor() {
    super();
    this.handler = this.handleData.bind(this);
    process.on('data', this.handler);
  }
  
  cleanup() {
    process.removeListener('data', this.handler);
  }
}

// Problem 3: Closures retaining references
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  
  return function handler() {
    // largeData is kept in memory!
    console.log('Handler called');
  };
}

// Solution: Don't capture unnecessary variables
function createHandlerFixed() {
  return function handler() {
    // largeData not captured
    console.log('Handler called');
  };
}

// Monitoring memory usage
function monitorMemory() {
  const used = process.memoryUsage();
  console.log({
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
  });
}

setInterval(monitorMemory, 10000);
```

**Best Practices:**
- Use memory profiling tools (Chrome DevTools, clinic.js)
- Implement proper cleanup in destructors
- Use WeakMap/WeakSet for caching
- Monitor memory usage in production
- Implement memory limits

**Links:**
- [Memory Profiling](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Finding Memory Leaks](https://www.npmjs.com/package/memwatch-next)

### 8. Stream Management and Backpressure

**Problem:** Not handling streams properly causes memory buildup.

```javascript
// Problem: Not handling backpressure
const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.on('data', (chunk) => {
  writeStream.write(chunk); // Ignores backpressure!
});

// Solution 1: Use pipe (handles backpressure automatically)
readStream.pipe(writeStream);

// Solution 2: Manual backpressure handling
readStream.on('data', (chunk) => {
  const canContinue = writeStream.write(chunk);
  
  if (!canContinue) {
    readStream.pause();
    
    writeStream.once('drain', () => {
      readStream.resume();
    });
  }
});

// Solution 3: Use pipeline (with error handling)
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

async function processFile() {
  try {
    await pipelineAsync(
      fs.createReadStream('input.txt'),
      transformStream(),
      fs.createWriteStream('output.txt')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}

// Custom transform stream with proper memory management
const { Transform } = require('stream');

class ChunkProcessor extends Transform {
  constructor(options) {
    super(options);
    this.chunkSize = options.chunkSize || 1024 * 16; // 16KB chunks
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const processed = this.processChunk(chunk);
      this.push(processed);
      callback();
    } catch (error) {
      callback(error);
    }
  }
  
  processChunk(chunk) {
    // Process chunk without loading entire file into memory
    return chunk;
  }
}
```

**Best Practices:**
- Always use pipe() or pipeline() for streams
- Handle backpressure explicitly
- Set highWaterMark appropriately
- Monitor stream memory usage
- Clean up stream resources

**Links:**
- [Stream API Documentation](https://nodejs.org/api/stream.html)
- [Stream Handbook](https://github.com/substack/stream-handbook)

---

## Performance and Scalability

### 9. Inefficient Database Queries and N+1 Problem

**Problem:** Multiple database queries in loops cause severe performance issues.

```javascript
// Problem: N+1 query issue
async function getUsersWithPosts() {
  const users = await User.find(); // 1 query
  
  for (const user of users) {
    user.posts = await Post.find({ userId: user.id }); // N queries!
  }
  
  return users;
}

// Solution 1: Use joins/populate
async function getUsersWithPostsOptimized() {
  // MongoDB with Mongoose
  const users = await User.find().populate('posts');
  
  // SQL with JOIN
  const users = await db.query(`
    SELECT u.*, p.*
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
  `);
  
  return users;
}

// Solution 2: Use DataLoader for batching
const DataLoader = require('dataloader');

const postLoader = new DataLoader(async (userIds) => {
  const posts = await Post.find({ userId: { $in: userIds } });
  
  // Group posts by userId
  const postsByUserId = {};
  posts.forEach(post => {
    if (!postsByUserId[post.userId]) {
      postsByUserId[post.userId] = [];
    }
    postsByUserId[post.userId].push(post);
  });
  
  return userIds.map(id => postsByUserId[id] || []);
});

async function getUsersWithPostsBatched() {
  const users = await User.find();
  
  // This batches all requests into a single query
  await Promise.all(
    users.map(async user => {
      user.posts = await postLoader.load(user.id);
    })
  );
  
  return users;
}

// Query optimization best practices
async function optimizedQuery() {
  // Use indexing
  await User.createIndex({ email: 1 });
  
  // Select only needed fields
  const users = await User.find({}, 'name email');
  
  // Use pagination
  const page = 1;
  const limit = 20;
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);
  
  // Use query caching
  const cachedResult = await cache.get('users:all');
  if (cachedResult) return cachedResult;
  
  const users = await User.find();
  await cache.set('users:all', users, 300); // 5 min cache
  
  return users;
}
```

**Best Practices:**
- Use DataLoader for batching queries
- Implement proper database indexing
- Use connection pooling
- Cache frequently accessed data
- Monitor slow queries

**Links:**
- [DataLoader](https://github.com/graphql/dataloader)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)

### 10. Blocking the Event Loop with Synchronous Operations

**Problem:** Using synchronous file operations or CPU-intensive tasks blocks the entire server.

```javascript
// Problem: Blocking operations
const fs = require('fs');
const crypto = require('crypto');

app.get('/bad-endpoint', (req, res) => {
  // Blocks event loop!
  const file = fs.readFileSync('large-file.txt', 'utf8');
  
  // Blocks event loop!
  const hash = crypto.pbkdf2Sync('password', 'salt', 100000, 512, 'sha512');
  
  res.send('Done');
});

// Solution: Use async alternatives
app.get('/good-endpoint', async (req, res) => {
  try {
    // Non-blocking
    const file = await fs.promises.readFile('large-file.txt', 'utf8');
    
    // Non-blocking
    const hash = await new Promise((resolve, reject) => {
      crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
    
    res.send('Done');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// For CPU-intensive tasks, use Worker Threads
const { Worker } = require('worker_threads');

function runHeavyComputation(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavy-computation.js', {
      workerData: data
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Monitor event loop lag
const eventLoopLag = require('event-loop-lag');
const lag = eventLoopLag(1000); // Check every second

setInterval(() => {
  const currentLag = lag();
  if (currentLag > 100) {
    console.warn(`Event loop lag: ${currentLag}ms`);
  }
}, 5000);
```

**Best Practices:**
- Never use sync methods in production
- Use Worker Threads for CPU-intensive operations
- Monitor event loop lag
- Implement request timeouts
- Use clustering for multi-core utilization

**Links:**
- [Don't Block the Event Loop](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
- [Worker Threads](https://nodejs.org/api/worker_threads.html)

### 11. Clustering and Load Balancing

**Problem:** Single-threaded Node.js doesn't utilize all CPU cores by default.

```javascript
// Solution: Use clustering
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  
  console.log(`Master process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker crashes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
  
} else {
  // Worker process
  const app = express();
  
  app.get('/', (req, res) => {
    res.send(`Handled by worker ${process.pid}`);
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}

// Alternative: Use PM2 for process management
// pm2 start app.js -i max // Start with all CPU cores

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    // Close database connections, etc.
    process.exit(0);
  });
});

// Load balancing strategies
// 1. Round-robin (default in cluster module)
// 2. Least connections
// 3. IP hash
// 4. Use reverse proxy (Nginx, HAProxy)

// Nginx configuration for load balancing
/*
upstream backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
*/
```

**Best Practices:**
- Use PM2 or clustering for production
- Implement graceful shutdown
- Use load balancers (Nginx, AWS ALB)
- Monitor worker health
- Implement circuit breakers

**Links:**
- [Cluster Module](https://nodejs.org/api/cluster.html)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## Database Management

### 12. Connection Pool Management

**Problem:** Not managing database connection pools properly causes connection exhaustion.

```javascript
// Problem: Creating new connections for each query
async function badDatabaseQuery() {
  const connection = await mysql.createConnection(dbConfig); // New connection each time!
  const [rows] = await connection.query('SELECT * FROM users');
  await connection.end();
  return rows;
}

// Solution: Use connection pooling
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

async function goodDatabaseQuery() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } finally {
    connection.release(); // Return connection to pool
  }
}

// MongoDB connection pooling
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4
});

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// PostgreSQL with pg-pool
const { Pool } = require('pg');

const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Monitor pool health
pgPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function queryWithPool() {
  const client = await pgPool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    return result.rows;
  } finally {
    client.release();
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await pool.end();
  await pgPool.end();
  await mongoose.connection.close();
  process.exit(0);
});
```

**Best Practices:**
- Always use connection pooling
- Set appropriate pool size (10-20 for most apps)
- Monitor pool metrics
- Implement connection retry logic
- Handle connection errors gracefully

**Links:**
- [MySQL Connection Pooling](https://github.com/mysqljs/mysql#pooling-connections)
- [PostgreSQL Pool](https://node-postgres.com/features/pooling)

### 13. Transaction Management

**Problem:** Not properly managing transactions leads to data inconsistency.

```javascript
// Problem: No transaction management
async function transferMoneyBad(fromUserId, toUserId, amount) {
  // If this succeeds but next fails, money is lost!
  await User.updateOne(
    { _id: fromUserId },
    { $inc: { balance: -amount } }
  );
  
  // What if this fails?
  await User.updateOne(
    { _id: toUserId },
    { $inc: { balance: amount } }
  );
}

// Solution 1: MongoDB transactions
async function transferMoneyMongo(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const sender = await User.findById(fromUserId).session(session);
    if (sender.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    await User.updateOne(
      { _id: fromUserId },
      { $inc: { balance: -amount } },
      { session }
    );
    
    await User.updateOne(
      { _id: toUserId },
      { $inc: { balance: amount } },
      { session }
    );
    
    await session.commitTransaction();
    console.log('Transaction committed');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction aborted:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// Solution 2: SQL transactions
async function transferMoneySql(fromUserId, toUserId, amount) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [sender] = await connection.query(
      'SELECT balance FROM users WHERE id = ? FOR UPDATE',
      [fromUserId]
    );
    
    if (sender[0].balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    await connection.query(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, fromUserId]
    );
    
    await connection.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [amount, toUserId]
    );
    
    await connection.commit();
    console.log('Transaction committed');
  } catch (error) {
    await connection.rollback();
    console.error('Transaction rolled back:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Solution 3: Transaction wrapper utility
class TransactionManager {
  static async runInTransaction(callback) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

// Usage
await TransactionManager.runInTransaction(async (session) => {
  await User.updateOne({ _id: fromUserId }, { $inc: { balance: -amount } }, { session });
  await User.updateOne({ _id: toUserId }, { $inc: { balance: amount } }, { session });
});
```

**Best Practices:**
- Use transactions for critical operations
- Keep transactions short
- Handle deadlocks and retries
- Use appropriate isolation levels
- Test transaction rollback scenarios

**Links:**
- [MongoDB Transactions](https://docs.mongodb.com/manual/core/transactions/)
- [PostgreSQL Transactions](https://node-postgres.com/features/transactions)

---

## API Design and Architecture

### 14. RESTful API Design Issues

**Problem:** Inconsistent API design, poor error responses, and lack of standards.

```javascript
// Problem: Inconsistent API design
app.get('/user', getUser); // Singular
app.get('/posts', getPosts); // Plural
app.post('/createComment', createComment); // Verb in URL
app.delete('/deletePost/123', deletePost); // Redundant

// Solution: Follow RESTful conventions
const express = require('express');
const router = express.Router();

// Resource naming (plural nouns)
router.get('/users', getUsers);           // GET /api/users
router.get('/users/:id', getUserById);    // GET /api/users/123
router.post('/users', createUser);        // POST /api/users
router.put('/users/:id', updateUser);     // PUT /api/users/123
router.patch('/users/:id', patchUser);    // PATCH /api/users/123
router.delete('/users/:id', deleteUser);  // DELETE /api/users/123

// Nested resources
router.get('/users/:userId/posts', getUserPosts);
router.post('/users/:userId/posts', createUserPost);

// Filtering, sorting, pagination
router.get('/users', async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    status,
    search
  } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (search) query.$text = { $search: search };
  
  const users = await User.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments(query);
  
  res.json({
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Consistent error responses
class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      status: 'success',
      message,
      data
    };
  }
  
  static error(message, statusCode = 500, errors = null) {
    return {
      status: 'error',
      message,
      ...(errors && { errors })
    };
  }
}

// Middleware for consistent responses
app.use((req, res, next) => {
  res.success = (data, message) => {
    res.json(ApiResponse.success(data, message));
  };
  
  res.error = (message, statusCode = 500) => {
    res.status(statusCode).json(ApiResponse.error(message, statusCode));
  };
  
  next();
});

// Usage
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.success(users, 'Users retrieved successfully');
  } catch (error) {
    res.error('Failed to retrieve users', 500);
  }
});

// API versioning
app.use('/api/v1', require('./routes/v1'));
app.use('/api/v2', require('./routes/v2'));

// Request validation
const { body, param, query, validationResult } = require('express-validator');

router.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Create user...
  }
);
```

**Best Practices:**
- Use plural nouns for resources
- Use HTTP methods correctly
- Implement proper status codes
- Version your API
- Validate input
- Document with OpenAPI/Swagger

**Links:**
- [RESTful API Design](https://restfulapi.net/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### 15. Rate Limiting and Throttling

**Problem:** APIs vulnerable to abuse, DDoS attacks, and resource exhaustion.

```javascript
// Solution: Implement rate limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// General API rate limiter
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.'
  }
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

// Custom rate limiter per user
const createUserLimiter = (maxRequests, windowMs) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return next();
    
    const key = `rl:user:${userId}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, windowMs / 1000);
    }
    
    if (current > maxRequests) {
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded'
      });
    }
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - current);
    
    next();
  };
};

// Apply user-specific limits
app.use('/api/expensive-operation', createUserLimiter(10, 60000));

// Request throttling
const slowDown = require('express-slow-down');

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: 500 // Add 500ms delay per request above delayAfter
});

app.use('/api/', speedLimiter);

// Token bucket algorithm (custom implementation)
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  
  refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / 1000) * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  tryConsume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
}

// Usage
const bucket = new TokenBucket(100, 10); // 100 capacity, refill 10/second

app.use((req, res, next) => {
  if (bucket.tryConsume(1)) {
    next();
  } else {
    res.status(429).json({ error: 'Too many requests' });
  }
});
```

**Best Practices:**
- Use Redis for distributed rate limiting
- Implement different limits for different endpoints
- Add rate limit headers
- Use token bucket or leaky bucket algorithms
- Monitor rate limit violations

**Links:**
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Rate Limiting Algorithms](https://en.wikipedia.org/wiki/Rate_limiting)

---

## Security Concerns

### 16. Authentication and Authorization Issues

**Problem:** Insecure authentication, weak session management, and improper authorization.

```javascript
// Problem: Storing plain text passwords
await User.create({
  email: 'user@example.com',
  password: 'password123' // NEVER DO THIS!
});

// Solution: Proper password hashing
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });
    
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Store refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    next();
  };
};

// Usage
router.get('/admin/users', 
  authenticate, 
  authorize('admin'), 
  async (req, res) => {
    const users = await User.find();
    res.json(users);
  }
);

// Resource-based authorization
const canModifyPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  if (post.authorId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  req.post = post;
  next();
};

router.put('/posts/:id', authenticate, canModifyPost, updatePost);
```

**Best Practices:**
- Always hash passwords (bcrypt, argon2)
- Use JWTs for stateless authentication
- Implement refresh tokens
- Use HTTPS in production
- Implement 2FA for sensitive operations
- Use security headers (helmet.js)

**Links:**
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### 17. SQL Injection and NoSQL Injection

**Problem:** Vulnerable to injection attacks through unsanitized user input.

```javascript
// Problem: SQL Injection vulnerability
app.get('/users', async (req, res) => {
  const { username } = req.query;
  
  // VULNERABLE!
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  const users = await db.query(query);
  
  res.json(users);
});
// Attack: ?username=' OR '1'='1

// Solution 1: Parameterized queries
app.get('/users', async (req, res) => {
  const { username } = req.query;
  
  // Safe with parameterized query
  const query = 'SELECT * FROM users WHERE username = ?';
  const users = await db.query(query, [username]);
  
  res.json(users);
});

// Problem: NoSQL Injection
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABLE!
  const user = await User.findOne({
    username: username,
    password: password
  });
  
  // Attack: { "username": {"$gt": ""}, "password": {"$gt": ""} }
});

// Solution 1: Sanitize input
const mongoSanitize = require('express-mongo-sanitize');

app.use(mongoSanitize({
  replaceWith: '_'
}));

// Solution 2: Validate input types
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Ensure strings
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate token...
});

// Solution 3: Use validation libraries
const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required()
});

app.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Use validated data
  const { username, password } = value;
  // ... rest of login logic
});

// Input sanitization for all requests
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(mongoSanitize());

// XSS protection
const xss = require('xss-clean');
app.use(xss());

// Security headers
const helmet = require('helmet');
app.use(helmet());

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}));
```

**Best Practices:**
- Always use parameterized queries
- Validate and sanitize all user input
- Use ORM/ODM with built-in protections
- Implement security headers
- Use HTTPS
- Regular security audits

**Links:**
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection)

---

## Testing and Quality Assurance

### 18. Insufficient Test Coverage

**Problem:** Lack of proper testing leads to bugs in production.

```javascript
// Unit testing with Jest
const { calculateTotal, processOrder } = require('./orderService');

describe('Order Service', () => {
  describe('calculateTotal', () => {
    it('should calculate total with tax', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 }
      ];
      
      const total = calculateTotal(items, 0.1); // 10% tax
      expect(total).toBe(38.5); // (20 + 15) * 1.1
    });
    
    it('should handle empty items', () => {
      const total = calculateTotal([], 0.1);
      expect(total).toBe(0);
    });
    
    it('should throw error for negative prices', () => {
      const items = [{ price: -10, quantity: 1 }];
      expect(() => calculateTotal(items, 0.1)).toThrow();
    });
  });
});

// Integration testing
const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('userId');
      expect(response.body.message).toBe('User created successfully');
      
      const user = await User.findById(response.body.userId);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });
    
    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      };
      
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });
  });
});

// Mocking external services
jest.mock('./emailService');
const emailService = require('./emailService');

describe('User Registration', () => {
  it('should send welcome email after registration', async () => {
    emailService.sendWelcomeEmail.mockResolvedValue(true);
    
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Test User'
    );
  });
});

// E2E testing with supertest
describe('Complete User Flow', () => {
  it('should register, login, and access protected route', async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'e2e@example.com',
        password: 'password123',
        name: 'E2E User'
      })
      .expect(201);
    
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'e2e@example.com',
        password: 'password123'
      })
      .expect(200);
    
    const token = loginResponse.body.token;
    
    // Access protected route
    await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

// Test utilities
class TestUtils {
  static async createTestUser(overrides = {}) {
    const defaultUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    const user = await User.create({ ...defaultUser, ...overrides });
    return user;
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

// Coverage configuration in package.json
/*
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
*/
```

**Best Practices:**
- Aim for 80%+ code coverage
- Write unit, integration, and E2E tests
- Mock external dependencies
- Test error cases
- Use CI/CD for automated testing

**Links:**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)

---

## Deployment and DevOps

### 19. Environment Configuration Management

**Problem:** Hardcoded configuration, exposed secrets, inconsistent environments.

```javascript
// Problem: Hardcoded values
const dbConnection = 'mongodb://localhost:27017/myapp'; // BAD!
const apiKey = 'sk_live_abc123'; // NEVER DO THIS!

// Solution: Use environment variables
require('dotenv').config();

const config = {
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'myapp',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DATABASE_URL
  },
  
  // Server
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development'
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET
  },
  
  // External Services
  services: {
    stripeKey: process.env.STRIPE_SECRET_KEY,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET_NAME
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  }
};

// Validate required config
function validateConfig() {
  const required = [
    'JWT_SECRET',
    'DATABASE_URL',
    'STRIPE_SECRET_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

module.exports = config;

// .env file (NEVER commit this!)
/*
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://user:pass@localhost:5432/myapp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

REDIS_HOST=localhost
REDIS_PORT=6379

STRIPE_SECRET_KEY=sk_test_xxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
*/

// .env.example (commit this for reference)
/*
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://user:pass@localhost:5432/myapp
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-key
*/

// Different configs per environment
const environments = {
  development: {
    logging: true,
    corsOrigin: '*'
  },
  production: {
    logging: false,
    corsOrigin: 'https://yourdomain.com'
  },
  test: {
    logging: false,
    corsOrigin: '*'
  }
};

const envConfig = environments[config.server.env];

// Using config in application
const mongoose = require('mongoose');
mongoose.connect(config.db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Docker environment variables
/*
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env.production
*/
```

**Best Practices:**
- Use .env files for local development
- Never commit secrets to version control
- Use secret management (AWS Secrets Manager, Vault)
- Validate configuration on startup
- Use different configs per environment

**Links:**
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [12 Factor App Config](https://12factor.net/config)

### 20. Logging and Monitoring

**Problem:** Insufficient logging makes debugging production issues difficult.

```javascript
// Problem: Basic console.log
console.log('User created'); // Not structured, hard to search
console.log(user); // No context, no timestamp

// Solution: Structured logging with Winston
const winston = require('winston');
const { combine, timestamp, json, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: {
    service: 'api-service',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Write all logs to files
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      devFormat
    )
  }));
}

// Request logging middleware
const morgan = require('morgan');
const stream = {
  write: (message) => logger.http(message.trim())
};

app.use(morgan('combined', { stream }));

// Usage in application
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  ip: req.ip
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack
});

logger.warn('High memory usage detected', {
  memoryUsage: process.memoryUsage(),
  uptime: process.uptime()
});

// Context-aware logging
class Logger {
  constructor(context) {
    this.context = context;
  }
  
  log(level, message, meta = {}) {
    logger.log(level, message, {
      ...meta,
      context: this.context
    });
  }
  
  info(message, meta) {
    this.log('info', message, meta);
  }
  
  error(message, meta) {
    this.log('error', message, meta);
  }
  
  warn(message, meta) {
    this.log('warn', message, meta);
  }
}

// Usage
const userLogger = new Logger('UserService');
userLogger.info('User created', { userId: newUser.id });

// Performance monitoring
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
  logger.info('Request completed', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${time}ms`
  });
  
  // Alert on slow requests
  if (time > 1000) {
    logger.warn('Slow request detected', {
      method: req.method,
      url: req.url,
      responseTime: `${time}ms`
    });
  }
}));

// Application metrics
const promClient = require('prom-client');

// Collect default metrics
promClient.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: 'OK',
      redis: 'OK'
    }
  };
  
  try {
    // Check database
    await mongoose.connection.db.admin().ping();
    
    // Check Redis
    await redis.ping();
    
    res.json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.checks.error = error.message;
    res.status(503).json(healthcheck);
  }
});

// Error tracking with Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Best Practices:**
- Use structured logging (JSON)
- Include context in logs
- Implement log levels
- Use centralized logging (ELK, CloudWatch)
- Monitor application metrics
- Set up alerts for errors

**Links:**
- [Winston Logger](https://github.com/winstonjs/winston)
- [Prometheus Client](https://github.com/siimon/prom-client)
- [Sentry Documentation](https://docs.sentry.io/platforms/node/)

---

## Package Management and Dependencies

### 21. Dependency Management Issues

**Problem:** Outdated packages, security vulnerabilities, and dependency conflicts.

```javascript
// Check for outdated packages
// npm outdated
// yarn outdated

// Update packages safely
// npm update
// npm audit fix

// package.json - Use specific versions in production
{
  "dependencies": {
    "express": "4.18.2",      // Exact version (production)
    "mongoose": "^7.0.0",     // Minor updates allowed
    "lodash": "~4.17.21"      // Patch updates only
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.20"
  }
}

// Use npm ci in CI/CD (respects package-lock.json exactly)
// npm ci

// Security auditing
// npm audit
// npm audit fix
// npm audit fix --force

// .npmrc configuration
/*
package-lock=true
save-exact=true
audit-level=moderate
*/

// Automated dependency updates with Dependabot
// .github/dependabot.yml
/*
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
*/

// Lock file integrity check
app.use((req, res, next) => {
  const { execSync } = require('child_process');
  try {
    execSync('npm ls', { stdio: 'pipe' });
    next();
  } catch (error) {
    logger.error('Dependency tree validation failed');
    res.status(500).send('Server configuration error');
  }
});

// Monitoring dependencies at runtime
const pkg = require('./package.json');

logger.info('Application started', {
  version: pkg.version,
  nodeVersion: process.version,
  dependencies: Object.keys(pkg.dependencies).length
});

// Graceful handling of optional dependencies
let optionalModule;
try {
  optionalModule = require('optional-module');
} catch (error) {
  logger.warn('Optional module not available', {
    module: 'optional-module'
  });
}
```

**Best Practices:**
- Regular dependency updates
- Use npm audit regularly
- Lock dependency versions in production
- Use Dependabot or Renovate
- Review security advisories
- Remove unused dependencies

**Links:**
- [npm Security Best Practices](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)

---

## Additional Resources

### Recommended Tools and Libraries

**Development Tools:**
- [Nodemon](https://nodemon.io/) - Auto-restart during development
- [PM2](https://pm2.keymetrics.io/) - Production process manager
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

**Testing:**
- [Jest](https://jestjs.io/) - Testing framework
- [Supertest](https://github.com/visionmedia/supertest) - HTTP assertions
- [Sinon](https://sinonjs.org/) - Mocking and spies

**Monitoring:**
- [New Relic](https://newrelic.com/) - APM
- [DataDog](https://www.datadoghq.com/) - Monitoring
- [Sentry](https://sentry.io/) - Error tracking
- [Prometheus](https://prometheus.io/) - Metrics

**Documentation:**
- [Swagger/OpenAPI](https://swagger.io/) - API documentation
- [JSDoc](https://jsdoc.app/) - Code documentation

**Best Practice Resources:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

## Conclusion

Mid-level Node.js backend developers commonly face challenges in:
- Asynchronous programming patterns
- Performance optimization and scalability
- Security implementation
- Error handling and debugging
- Database management
- Testing and code quality

Success in Node.js backend development requires:
- Deep understanding of async patterns
- Security-first mindset
- Comprehensive testing strategy
- Performance monitoring
- Continuous learning and staying updated

Remember: The best way to overcome these problems is through hands-on experience, code reviews, and learning from production issues. Always test thoroughly, monitor in production, and iterate based on real-world feedback.

Happy coding! 🚀




