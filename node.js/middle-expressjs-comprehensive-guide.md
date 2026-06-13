# Middle Node.js Express.js Comprehensive Guide

## Table of Contents

### [1. Advanced Express.js Architecture](#1-advanced-expressjs-architecture)
- [1.1. How to structure a scalable Express.js application?](#11-how-to-structure-a-scalable-expressjs-application)
- [1.2. What are the best practices for organizing routes in large applications?](#12-what-are-the-best-practices-for-organizing-routes-in-large-applications)
- [1.3. How to implement layered architecture (Controller-Service-Repository)?](#13-how-to-implement-layered-architecture-controller-service-repository)
- [1.4. What is dependency injection and how to implement it in Express?](#14-what-is-dependency-injection-and-how-to-implement-it-in-express)
- [1.5. How to organize middleware in a modular way?](#15-how-to-organize-middleware-in-a-modular-way)
- [1.6. What are the patterns for configuration management?](#16-what-are-the-patterns-for-configuration-management)

### [2. Advanced Middleware Patterns](#2-advanced-middleware-patterns)
- [2.1. How to create custom middleware for complex scenarios?](#21-how-to-create-custom-middleware-for-complex-scenarios)
- [2.2. What is middleware composition and chaining?](#22-what-is-middleware-composition-and-chaining)
- [2.3. How to implement error handling middleware properly?](#23-how-to-implement-error-handling-middleware-properly)
- [2.4. What are async middleware patterns?](#24-what-are-async-middleware-patterns)
- [2.5. How to create reusable middleware factories?](#25-how-to-create-reusable-middleware-factories)
- [2.6. What is middleware for request validation and sanitization?](#26-what-is-middleware-for-request-validation-and-sanitization)

### [3. Request Validation & Data Handling](#3-request-validation--data-handling)
- [3.1. How to use Joi for schema validation?](#31-how-to-use-joi-for-schema-validation)
- [3.2. What is Zod and how does it compare to Joi?](#32-what-is-zod-and-how-does-it-compare-to-joi)
- [3.3. How to implement class-validator with express-validator?](#33-how-to-implement-class-validator-with-express-validator)
- [3.4. What are best practices for file upload validation?](#34-what-are-best-practices-for-file-upload-validation)
- [3.5. How to handle multipart/form-data with Multer?](#35-how-to-handle-multipartform-data-with-multer)
- [3.6. What is request sanitization and XSS prevention?](#36-what-is-request-sanitization-and-xss-prevention)

### [4. Database Integration & ORMs](#4-database-integration--orms)
- [4.1. How to use Prisma ORM with Express.js?](#41-how-to-use-prisma-orm-with-expressjs)
	- [4.1.1. What are Prisma schema best practices?](#411-what-are-prisma-schema-best-practices)
	- [4.1.2. How to handle migrations in production?](#412-how-to-handle-migrations-in-production)
	- [4.1.3. What are Prisma performance optimization techniques?](#413-what-are-prisma-performance-optimization-techniques)
- [4.2. How to use TypeORM with Express.js?](#42-how-to-use-typeorm-with-expressjs)
	- [4.2.1. What are decorators and entity patterns?](#421-what-are-decorators-and-entity-patterns)
	- [4.2.2. How to implement repository pattern with TypeORM?](#422-how-to-implement-repository-pattern-with-typeorm)
- [4.3. How to use Sequelize effectively?](#43-how-to-use-sequelize-effectively)
- [4.4. What are database connection pooling strategies?](#44-what-are-database-connection-pooling-strategies)
- [4.5. How to implement database transactions?](#45-how-to-implement-database-transactions)
- [4.6. What are query optimization techniques?](#46-what-are-query-optimization-techniques)

### [5. Advanced Authentication & Authorization](#5-advanced-authentication--authorization)
- [5.1. How to implement JWT authentication properly?](#51-how-to-implement-jwt-authentication-properly)
	- [5.1.1. What are access and refresh token patterns?](#511-what-are-access-and-refresh-token-patterns)
	- [5.1.2. How to handle token rotation and revocation?](#512-how-to-handle-token-rotation-and-revocation)
	- [5.1.3. What is token storage security?](#513-what-is-token-storage-security)
- [5.2. How to implement OAuth 2.0 with Passport.js?](#52-how-to-implement-oauth-20-with-passportjs)
- [5.3. What are RBAC and ABAC patterns?](#53-what-are-rbac-and-abac-patterns)
- [5.4. How to implement API key authentication?](#54-how-to-implement-api-key-authentication)
- [5.5. What is session management with Redis?](#55-what-is-session-management-with-redis)
- [5.6. How to implement rate limiting per user?](#56-how-to-implement-rate-limiting-per-user)

### [6. API Design & Best Practices](#6-api-design--best-practices)
- [6.1. How to design RESTful APIs following best practices?](#61-how-to-design-restful-apis-following-best-practices)
- [6.2. What is API versioning and how to implement it?](#62-what-is-api-versioning-and-how-to-implement-it)
- [6.3. How to implement HATEOAS?](#63-how-to-implement-hateoas)
- [6.4. What are pagination strategies (cursor vs offset)?](#64-what-are-pagination-strategies-cursor-vs-offset)
- [6.5. How to implement filtering, sorting, and searching?](#65-how-to-implement-filtering-sorting-and-searching)
- [6.6. What is GraphQL integration with Express?](#66-what-is-graphql-integration-with-express)
- [6.7. How to document APIs with Swagger/OpenAPI?](#67-how-to-document-apis-with-swaggeropenapi)

### [7. Caching Strategies](#7-caching-strategies)
- [7.1. How to implement Redis caching?](#71-how-to-implement-redis-caching)
	- [7.1.1. What are cache invalidation strategies?](#711-what-are-cache-invalidation-strategies)
	- [7.1.2. How to implement cache-aside pattern?](#712-how-to-implement-cache-aside-pattern)
	- [7.1.3. What is write-through vs write-behind caching?](#713-what-is-write-through-vs-write-behind-caching)
- [7.2. How to use in-memory caching with node-cache?](#72-how-to-use-in-memory-caching-with-node-cache)
- [7.3. What is HTTP caching with ETags and Cache-Control?](#73-what-is-http-caching-with-etags-and-cache-control)
- [7.4. How to implement distributed caching?](#74-how-to-implement-distributed-caching)

### [8. Real-time Communication](#8-real-time-communication)
- [8.1. How to integrate Socket.io with Express?](#81-how-to-integrate-socketio-with-express)
	- [8.1.1. What are room and namespace patterns?](#811-what-are-room-and-namespace-patterns)
	- [8.1.2. How to implement authentication for Socket.io?](#812-how-to-implement-authentication-for-socketio)
	- [8.1.3. What is scaling Socket.io with Redis adapter?](#813-what-is-scaling-socketio-with-redis-adapter)
- [8.2. How to implement Server-Sent Events (SSE)?](#82-how-to-implement-server-sent-events-sse)
- [8.3. What is WebSocket implementation without libraries?](#83-what-is-websocket-implementation-without-libraries)

### [9. Message Queues & Background Jobs](#9-message-queues--background-jobs)
- [9.1. How to use Bull queue for background jobs?](#91-how-to-use-bull-queue-for-background-jobs)
	- [9.1.1. What are job priorities and retry strategies?](#911-what-are-job-priorities-and-retry-strategies)
	- [9.1.2. How to implement job scheduling?](#912-how-to-implement-job-scheduling)
	- [9.1.3. What is queue monitoring and metrics?](#913-what-is-queue-monitoring-and-metrics)
- [9.2. How to integrate RabbitMQ with Express?](#92-how-to-integrate-rabbitmq-with-express)
- [9.3. What are pub/sub patterns with Redis?](#93-what-are-pubsub-patterns-with-redis)
- [9.4. How to implement event-driven architecture?](#94-how-to-implement-event-driven-architecture)

### [10. File Storage & Management](#10-file-storage--management)
- [10.1. How to integrate AWS S3 for file storage?](#101-how-to-integrate-aws-s3-for-file-storage)
- [10.2. What is file streaming and processing?](#102-what-is-file-streaming-and-processing)
- [10.3. How to implement image optimization and resizing?](#103-how-to-implement-image-optimization-and-resizing)
- [10.4. What are signed URLs and presigned uploads?](#104-what-are-signed-urls-and-presigned-uploads)
- [10.5. How to handle large file uploads efficiently?](#105-how-to-handle-large-file-uploads-efficiently)

### [11. Security Best Practices](#11-security-best-practices)
- [11.1. How to implement Helmet.js properly?](#111-how-to-implement-helmetjs-properly)
- [11.2. What is CORS configuration for production?](#112-what-is-cors-configuration-for-production)
- [11.3. How to prevent SQL injection with ORMs?](#113-how-to-prevent-sql-injection-with-orms)
- [11.4. What are rate limiting strategies?](#114-what-are-rate-limiting-strategies)
- [11.5. How to implement request signing and verification?](#115-how-to-implement-request-signing-and-verification)
- [11.6. What is secure session management?](#116-what-is-secure-session-management)
- [11.7. How to handle sensitive data encryption?](#117-how-to-handle-sensitive-data-encryption)
- [11.8. What are security headers best practices?](#118-what-are-security-headers-best-practices)

### [12. Testing Strategies](#12-testing-strategies)
- [12.1. How to write unit tests with Jest?](#121-how-to-write-unit-tests-with-jest)
	- [12.1.1. What are mocking strategies for dependencies?](#1211-what-are-mocking-strategies-for-dependencies)
	- [12.1.2. How to test middleware functions?](#1212-how-to-test-middleware-functions)
- [12.2. How to write integration tests with Supertest?](#122-how-to-write-integration-tests-with-supertest)
- [12.3. What is E2E testing with Playwright or Cypress?](#123-what-is-e2e-testing-with-playwright-or-cypress)
- [12.4. How to implement test databases and fixtures?](#124-how-to-implement-test-databases-and-fixtures)
- [12.5. What are API contract testing strategies?](#125-what-are-api-contract-testing-strategies)
- [12.6. How to achieve good test coverage?](#126-how-to-achieve-good-test-coverage)

### [13. Performance Optimization](#13-performance-optimization)
- [13.1. How to implement compression middleware?](#131-how-to-implement-compression-middleware)
- [13.2. What are database query optimization techniques?](#132-what-are-database-query-optimization-techniques)
- [13.3. How to use clustering with Node.js?](#133-how-to-use-clustering-with-nodejs)
- [13.4. What is load balancing with PM2?](#134-what-is-load-balancing-with-pm2)
- [13.5. How to optimize memory usage?](#135-how-to-optimize-memory-usage)
- [13.6. What are profiling and benchmarking tools?](#136-what-are-profiling-and-benchmarking-tools)
- [13.7. How to implement lazy loading and code splitting?](#137-how-to-implement-lazy-loading-and-code-splitting)

### [14. Logging & Monitoring](#14-logging--monitoring)
- [14.1. How to implement structured logging with Winston?](#141-how-to-implement-structured-logging-with-winston)
- [14.2. What is Pino and why is it faster?](#142-what-is-pino-and-why-is-it-faster)
- [14.3. How to integrate with ELK stack?](#143-how-to-integrate-with-elk-stack)
- [14.4. What is distributed tracing with OpenTelemetry?](#144-what-is-distributed-tracing-with-opentelemetry)
- [14.5. How to implement application monitoring with Prometheus?](#145-how-to-implement-application-monitoring-with-prometheus)
- [14.6. What are health check endpoints?](#146-what-are-health-check-endpoints)
- [14.7. How to track custom metrics?](#147-how-to-track-custom-metrics)

### [15. Error Handling & Debugging](#15-error-handling--debugging)
- [15.1. How to implement centralized error handling?](#151-how-to-implement-centralized-error-handling)
- [15.2. What are custom error classes and error codes?](#152-what-are-custom-error-classes-and-error-codes)
- [15.3. How to handle async errors properly?](#153-how-to-handle-async-errors-properly)
- [15.4. What is error reporting with Sentry?](#154-what-is-error-reporting-with-sentry)
- [15.5. How to debug memory leaks?](#155-how-to-debug-memory-leaks)
- [15.6. What are debugging tools and techniques?](#156-what-are-debugging-tools-and-techniques)

### [16. Docker & Containerization](#16-docker--containerization)
- [16.1. How to create production-ready Dockerfiles?](#161-how-to-create-production-ready-dockerfiles)
- [16.2. What is multi-stage Docker builds?](#162-what-is-multi-stage-docker-builds)
- [16.3. How to use Docker Compose for development?](#163-how-to-use-docker-compose-for-development)
- [16.4. What are Docker networking best practices?](#164-what-are-docker-networking-best-practices)
- [16.5. How to optimize Docker image size?](#165-how-to-optimize-docker-image-size)
- [16.6. What is container orchestration basics?](#166-what-is-container-orchestration-basics)

### [17. Microservices Architecture](#17-microservices-architecture)
- [17.1. How to design microservices with Express?](#171-how-to-design-microservices-with-express)
- [17.2. What are service discovery patterns?](#172-what-are-service-discovery-patterns)
- [17.3. How to implement API Gateway pattern?](#173-how-to-implement-api-gateway-pattern)
- [17.4. What is inter-service communication?](#174-what-is-inter-service-communication)
- [17.5. How to handle distributed transactions?](#175-how-to-handle-distributed-transactions)
- [17.6. What are circuit breaker patterns?](#176-what-are-circuit-breaker-patterns)

### [18. CI/CD & Deployment](#18-cicd--deployment)
- [18.1. How to set up CI/CD with GitHub Actions?](#181-how-to-set-up-cicd-with-github-actions)
- [18.2. What are deployment strategies (blue-green, canary)?](#182-what-are-deployment-strategies-blue-green-canary)
- [18.3. How to deploy to AWS (EC2, ECS, Lambda)?](#183-how-to-deploy-to-aws-ec2-ecs-lambda)
- [18.4. What is deployment to Heroku best practices?](#184-what-is-deployment-to-heroku-best-practices)
- [18.5. How to implement zero-downtime deployments?](#185-how-to-implement-zero-downtime-deployments)
- [18.6. What are environment configuration strategies?](#186-what-are-environment-configuration-strategies)

### [19. TypeScript Integration](#19-typescript-integration)
- [19.1. How to set up TypeScript with Express?](#191-how-to-set-up-typescript-with-express)
- [19.2. What are type-safe request/response patterns?](#192-what-are-type-safe-requestresponse-patterns)
- [19.3. How to create custom type definitions?](#193-how-to-create-custom-type-definitions)
- [19.4. What is strict mode configuration?](#194-what-is-strict-mode-configuration)
- [19.5. How to handle decorators and metadata?](#195-how-to-handle-decorators-and-metadata)
- [19.6. What are advanced TypeScript patterns for Express?](#196-what-are-advanced-typescript-patterns-for-express)

### [20. Email & Notifications](#20-email--notifications)
- [20.1. How to integrate Nodemailer for email sending?](#201-how-to-integrate-nodemailer-for-email-sending)
- [20.2. What are email template engines (Handlebars, Pug)?](#202-what-are-email-template-engines-handlebars-pug)
- [20.3. How to use SendGrid or AWS SES?](#203-how-to-use-sendgrid-or-aws-ses)
- [20.4. What is notification system design?](#204-what-is-notification-system-design)
- [20.5. How to implement push notifications?](#205-how-to-implement-push-notifications)

### [21. Payment Integration](#21-payment-integration)
- [21.1. How to integrate Stripe with Express?](#211-how-to-integrate-stripe-with-express)
- [21.2. What is webhook handling for payments?](#212-what-is-webhook-handling-for-payments)
- [21.3. How to handle payment security?](#213-how-to-handle-payment-security)
- [21.4. What are subscription management patterns?](#214-what-are-subscription-management-patterns)
- [21.5. How to implement refund logic?](#215-how-to-implement-refund-logic)

### [22. Search Implementation](#22-search-implementation)
- [22.1. How to integrate Elasticsearch?](#221-how-to-integrate-elasticsearch)
- [22.2. What is full-text search with PostgreSQL?](#222-what-is-full-text-search-with-postgresql)
- [22.3. How to implement autocomplete functionality?](#223-how-to-implement-autocomplete-functionality)
- [22.4. What are search optimization strategies?](#224-what-are-search-optimization-strategies)

### [23. Third-party API Integration](#23-third-party-api-integration)
- [23.1. How to structure API client modules?](#231-how-to-structure-api-client-modules)
- [23.2. What are retry and timeout strategies with Axios?](#232-what-are-retry-and-timeout-strategies-with-axios)
- [23.3. How to handle API rate limits?](#233-how-to-handle-api-rate-limits)
- [23.4. What is request/response transformation?](#234-what-is-requestresponse-transformation)
- [23.5. How to mock external APIs in tests?](#235-how-to-mock-external-apis-in-tests)

### [24. Advanced Design Patterns](#24-advanced-design-patterns)
- [24.1. What is Repository pattern implementation?](#241-what-is-repository-pattern-implementation)
- [24.2. How to implement Factory pattern?](#242-how-to-implement-factory-pattern)
- [24.3. What is Strategy pattern for business logic?](#243-what-is-strategy-pattern-for-business-logic)
- [24.4. How to use Observer pattern for events?](#244-how-to-use-observer-pattern-for-events)
- [24.5. What is Decorator pattern for middleware?](#245-what-is-decorator-pattern-for-middleware)
- [24.6. How to implement Chain of Responsibility?](#246-how-to-implement-chain-of-responsibility)

### [25. Production Best Practices](#25-production-best-practices)
- [25.1. How to handle graceful shutdown?](#251-how-to-handle-graceful-shutdown)
- [25.2. What is process management with PM2?](#252-what-is-process-management-with-pm2)
- [25.3. How to implement backup and disaster recovery?](#253-how-to-implement-backup-and-disaster-recovery)
- [25.4. What are scaling strategies?](#254-what-are-scaling-strategies)
- [25.5. How to monitor production metrics?](#255-how-to-monitor-production-metrics)
- [25.6. What is incident response planning?](#256-what-is-incident-response-planning)

---

## 1. Advanced Express.js Architecture

### **1.1. How to structure a scalable Express.js application?**

**Answer:**

A scalable Express.js application should follow a modular, layered architecture. Here's a recommended structure:

```
project-root/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   └── auth.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── error.middleware.js
│   │   └── routes/
│   │       ├── index.js
│   │       ├── user.routes.js
│   │       └── auth.routes.js
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── index.js
│   ├── services/
│   │   ├── user.service.js
│   │   └── auth.service.js
│   ├── repositories/
│   │   ├── user.repository.js
│   │   └── base.repository.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── index.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── cache.js
│   │   └── helpers.js
│   ├── validators/
│   │   └── user.validator.js
│   ├── jobs/
│   │   └── email.job.js
│   ├── events/
│   │   └── user.events.js
│   └── app.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env
├── .env.example
├── package.json
└── server.js
```

**Key Principles:**

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Modularity**: Features are organized into self-contained modules
3. **Dependency Injection**: Dependencies are passed in, not imported directly
4. **Single Responsibility**: Each file/class does one thing well

**Example Implementation:**

```javascript
// src/server.js
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const routes = require('./api/routes');
const errorMiddleware = require('./api/middlewares/error.middleware');

const app = express();

// Security & Performance
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorMiddleware);

module.exports = app;
```

**Benefits:**
- Easy to test individual components
- Simple to add new features without affecting existing code
- Clear code organization makes onboarding easier
- Supports horizontal scaling

[Back to Table of Contents](#table-of-contents)

### **1.2. What are the best practices for organizing routes in large applications?**

**Answer:**

Organizing routes properly is crucial for maintainability. Here are best practices with examples:

**1. Use Express Router for Modular Routes**

```javascript
// src/api/routes/index.js
const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
```

**2. Feature-Based Route Organization**

```javascript
// src/api/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validation.middleware');
const userValidator = require('../../validators/user.validator');

const router = express.Router();

// Public routes
router.post(
  '/register',
  validateRequest(userValidator.register),
  userController.register
);

// Protected routes
router.use(authMiddleware.authenticate);

router.get(
  '/',
  userController.getAllUsers
);

router.get(
  '/:id',
  validateRequest(userValidator.getUserById),
  userController.getUserById
);

router.put(
  '/:id',
  validateRequest(userValidator.updateUser),
  authMiddleware.authorize(['admin', 'user']),
  userController.updateUser
);

router.delete(
  '/:id',
  authMiddleware.authorize(['admin']),
  userController.deleteUser
);

module.exports = router;
```

**3. Versioned API Routes**

```javascript
// src/api/routes/index.js
const express = require('express');
const v1Routes = require('./v1');
const v2Routes = require('./v2');

const router = express.Router();

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

// Default to latest version
router.use('/', v2Routes);

module.exports = router;

// src/api/routes/v1/index.js
const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;
```

**4. Route Documentation with JSDoc**

```javascript
// src/api/routes/user.routes.js
const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with pagination
 * @access  Private (Admin)
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Items per page (default: 10)
 * @query   {string} sort - Sort field (default: createdAt)
 * @query   {string} order - Sort order (asc/desc, default: desc)
 */
router.get('/', authMiddleware.requireAdmin, userController.getAllUsers);

/**
 * @route   POST /api/v1/users
 * @desc    Create new user
 * @access  Private (Admin)
 * @body    {string} email - User email
 * @body    {string} password - User password
 * @body    {string} name - User full name
 */
router.post('/', authMiddleware.requireAdmin, userController.createUser);

module.exports = router;
```

**5. Nested Resource Routes**

```javascript
// src/api/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const postController = require('../controllers/post.controller');

const router = express.Router();

// User routes
router.get('/:userId', userController.getUser);

// Nested resource: User's posts
router.get('/:userId/posts', postController.getUserPosts);
router.post('/:userId/posts', postController.createUserPost);
router.get('/:userId/posts/:postId', postController.getUserPost);
router.put('/:userId/posts/:postId', postController.updateUserPost);
router.delete('/:userId/posts/:postId', postController.deleteUserPost);

module.exports = router;
```

**6. Route Grouping with Middleware**

```javascript
// src/api/routes/product.routes.js
const express = require('express');
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const cache = require('../middlewares/cache.middleware');

const router = express.Router();

// Public routes (cached)
router.get(
  '/',
  cache.set(300), // 5 minutes
  productController.getAllProducts
);

router.get(
  '/:id',
  cache.set(300),
  productController.getProduct
);

// Admin-only routes (grouped)
const adminRouter = express.Router();
adminRouter.use(authenticate);
adminRouter.use(authorize(['admin']));

adminRouter.post('/', productController.createProduct);
adminRouter.put('/:id', productController.updateProduct);
adminRouter.delete('/:id', productController.deleteProduct);

router.use('/admin', adminRouter);

module.exports = router;
```

**7. Route Parameter Validation**

```javascript
// src/api/routes/user.routes.js
const express = require('express');
const { param } = require('express-validator');

const router = express.Router();

// Validate MongoDB ObjectId
router.param('id', [
  param('id').isMongoId().withMessage('Invalid user ID format')
]);

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
```

**Best Practices Summary:**
- ✅ One route file per resource
- ✅ Use Express Router for modularity
- ✅ Group related routes together
- ✅ Apply middleware at appropriate levels
- ✅ Version your APIs
- ✅ Use clear, RESTful naming conventions
- ✅ Document routes with comments or Swagger
- ✅ Validate parameters and payloads

[Back to Table of Contents](#table-of-contents)

### **1.3. How to implement layered architecture (Controller-Service-Repository)?**

**Answer:**

The layered architecture (Controller-Service-Repository pattern) separates concerns into distinct layers:

**Architecture Layers:**

```
┌─────────────────────────────────────┐
│         Controllers Layer           │  ← HTTP handling, request/response
├─────────────────────────────────────┤
│          Services Layer             │  ← Business logic
├─────────────────────────────────────┤
│        Repositories Layer           │  ← Data access
├─────────────────────────────────────┤
│           Models Layer              │  ← Data structure
└─────────────────────────────────────┘
```

**1. Controller Layer (HTTP/Request Handling)**

```javascript
// src/api/controllers/user.controller.js
const userService = require('../../services/user.service');
const logger = require('../../utils/logger');

class UserController {
  /**
   * Get all users with pagination
   */
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await userService.getAllUsers(options);
      
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      
      logger.info(`User created: ${user.id}`);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await userService.updateUser(id, updateData);
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

**2. Service Layer (Business Logic)**

```javascript
// src/services/user.service.js
const userRepository = require('../repositories/user.repository');
const emailService = require('./email.service');
const cacheService = require('./cache.service');
const { hashPassword, comparePassword } = require('../utils/crypto');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

class UserService {
  /**
   * Get all users with pagination
   */
  async getAllUsers(options) {
    const { page, limit, sort } = options;
    
    // Try cache first
    const cacheKey = `users:list:${page}:${limit}:${JSON.stringify(sort)}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      logger.debug('Returning cached users list');
      return cached;
    }

    const result = await userRepository.findAll(options);
    
    // Cache for 5 minutes
    await cacheService.set(cacheKey, result, 300);
    
    return result;
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    // Try cache first
    const cacheKey = `user:${id}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const user = await userRepository.findById(id);
    
    if (user) {
      await cacheService.set(cacheKey, user, 600); // 10 minutes
    }
    
    return user;
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    // Business logic: Check if email exists
    const existingUser = await userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    // Business logic: Hash password
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    // Business logic: Set default role
    userData.role = userData.role || 'user';
    userData.isActive = true;

    const user = await userRepository.create(userData);

    // Business logic: Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    // Invalidate cache
    await cacheService.del('users:list:*');

    return this.sanitizeUser(user);
  }

  /**
   * Update user
   */
  async updateUser(id, updateData) {
    const user = await userRepository.findById(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Business logic: Don't allow email change if already verified
    if (updateData.email && user.isEmailVerified && updateData.email !== user.email) {
      throw new AppError('Cannot change verified email', 400);
    }

    // Business logic: Hash password if changed
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const updatedUser = await userRepository.update(id, updateData);

    // Invalidate cache
    await cacheService.del(`user:${id}`);
    await cacheService.del('users:list:*');

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await userRepository.findById(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Business logic: Soft delete
    await userRepository.update(id, { 
      isActive: false,
      deletedAt: new Date()
    });

    // Invalidate cache
    await cacheService.del(`user:${id}`);
    await cacheService.del('users:list:*');

    logger.info(`User deleted: ${id}`);
  }

  /**
   * Authenticate user
   */
  async authenticate(email, password) {
    const user = await userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Business logic: Update last login
    await userRepository.update(user.id, {
      lastLoginAt: new Date()
    });

    return this.sanitizeUser(user);
  }

  /**
   * Helper: Remove sensitive data
   */
  sanitizeUser(user) {
    const sanitized = { ...user.toObject() };
    delete sanitized.password;
    return sanitized;
  }
}

module.exports = new UserService();
```

**3. Repository Layer (Data Access)**

```javascript
// src/repositories/user.repository.js
const User = require('../models/user.model');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await this.model.findOne({ email, isActive: true });
  }

  /**
   * Find all users with pagination
   */
  async findAll(options) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.model
        .find({ isActive: true })
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments({ isActive: true })
    ]);

    return {
      users,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Find users by role
   */
  async findByRole(role) {
    return await this.model
      .find({ role, isActive: true })
      .select('-password')
      .lean();
  }

  /**
   * Update user's last login
   */
  async updateLastLogin(id) {
    return await this.model.findByIdAndUpdate(
      id,
      { lastLoginAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new UserRepository();

// src/repositories/base.repository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    return await this.model.findById(id).lean();
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async findOne(query) {
    return await this.model.findOne(query).lean();
  }

  async find(query, options = {}) {
    return await this.model
      .find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip)
      .lean();
  }
}

module.exports = BaseRepository;
```

**4. Model Layer (Data Structure)**

```javascript
// src/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
```

**Benefits of Layered Architecture:**

✅ **Separation of Concerns**: Each layer has a single responsibility
✅ **Testability**: Easy to unit test each layer independently
✅ **Maintainability**: Changes in one layer don't affect others
✅ **Reusability**: Services can be used by multiple controllers
✅ **Scalability**: Easy to add new features without breaking existing code
✅ **Clear Data Flow**: Request → Controller → Service → Repository → Database

[Back to Table of Contents](#table-of-contents)

### **1.4. What is dependency injection and how to implement it in Express?**

**Answer:**

Dependency Injection (DI) is a design pattern where dependencies are provided to a class/function rather than created within it. This improves testability, maintainability, and loose coupling.

**1. Manual Dependency Injection**

```javascript
// src/services/user.service.js
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.info(`User created: ${user.id}`);
    return user;
  }
}

module.exports = UserService;

// src/services/index.js (Service Factory)
const UserRepository = require('../repositories/user.repository');
const EmailService = require('./email.service');
const logger = require('../utils/logger');
const UserService = require('./user.service');

// Create instances with dependencies
const userRepository = new UserRepository();
const emailService = new EmailService();
const userService = new UserService(userRepository, emailService, logger);

module.exports = {
  userService,
  emailService
};
```

**2. Using a DI Container (awilix)**

```javascript
// npm install awilix

// src/container.js
const { createContainer, asClass, asFunction, asValue } = require('awilix');
const UserService = require('./services/user.service');
const UserRepository = require('./repositories/user.repository');
const EmailService = require('./services/email.service');
const logger = require('./utils/logger');
const config = require('./config');

const container = createContainer();

// Register dependencies
container.register({
  // Configuration
  config: asValue(config),
  logger: asValue(logger),
  
  // Repositories (singleton)
  userRepository: asClass(UserRepository).singleton(),
  
  // Services (singleton)
  userService: asClass(UserService).singleton(),
  emailService: asClass(EmailService).singleton(),
  
  // Controllers (scoped per request)
  userController: asClass(UserController).scoped()
});

module.exports = container;

// src/services/user.service.js
class UserService {
  constructor({ userRepository, emailService, logger }) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.info(`User created: ${user.id}`);
    return user;
  }
}

module.exports = UserService;

// src/app.js
const express = require('express');
const container = require('./container');
const { scopePerRequest } = require('awilix-express');

const app = express();

// Middleware to inject container into request
app.use(scopePerRequest(container));

// Routes now have access to container
app.use('/api/users', (req, res, next) => {
  const { userController } = req.container.cradle;
  userController.handleRequest(req, res, next);
});

module.exports = app;
```

**3. Constructor Injection with Factory Pattern**

```javascript
// src/factories/service.factory.js
class ServiceFactory {
  constructor() {
    this.services = new Map();
  }

  register(name, ServiceClass, dependencies) {
    this.services.set(name, { ServiceClass, dependencies });
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not registered`);
    }

    const { ServiceClass, dependencies } = this.services.get(name);
    const resolvedDeps = dependencies.map(dep => this.get(dep));
    
    return new ServiceClass(...resolvedDeps);
  }
}

// Usage
const factory = new ServiceFactory();

// Register services
factory.register('logger', Logger, []);
factory.register('userRepository', UserRepository, []);
factory.register('emailService', EmailService, ['logger']);
factory.register('userService', UserService, ['userRepository', 'emailService', 'logger']);

// Get service with all dependencies injected
const userService = factory.get('userService');

module.exports = factory;
```

**4. Middleware Injection Pattern**

```javascript
// src/middlewares/inject.middleware.js
const container = require('../container');

/**
 * Inject dependencies into request object
 */
function injectDependencies(req, res, next) {
  req.services = {
    userService: container.resolve('userService'),
    emailService: container.resolve('emailService'),
    authService: container.resolve('authService')
  };
  
  next();
}

module.exports = injectDependencies;

// src/api/controllers/user.controller.js
class UserController {
  async createUser(req, res, next) {
    try {
      const { userService } = req.services;
      const user = await userService.createUser(req.body);
      
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

// src/app.js
const express = require('express');
const injectDependencies = require('./middlewares/inject.middleware');
const userRoutes = require('./api/routes/user.routes');

const app = express();

app.use(injectDependencies);
app.use('/api/users', userRoutes);

module.exports = app;
```

**5. Using TypeScript with InversifyJS**

```typescript
// npm install inversify reflect-metadata

// src/types/index.ts
const TYPES = {
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  EmailService: Symbol.for('EmailService'),
  Logger: Symbol.for('Logger')
};

export { TYPES };

// src/services/user.service.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IUserRepository } from '../repositories/user.repository';
import { IEmailService } from './email.service';
import { ILogger } from '../utils/logger';

@injectable()
class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  async createUser(userData: any) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.info(`User created: ${user.id}`);
    return user;
  }
}

export { UserService };

// src/container.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { EmailService } from './services/email.service';
import { Logger } from './utils/logger';

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.EmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.UserService).to(UserService).inSingletonScope();

export { container };

// src/api/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { UserService } from '../../services/user.service';
import { controller, httpPost } from 'inversify-express-utils';

@controller('/api/users')
class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  @httpPost('/')
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
```

**6. Simple Function-Based DI**

```javascript
// src/utils/di.js
class DIContainer {
  constructor() {
    this.dependencies = {};
    this.singletons = {};
  }

  register(name, factory, options = {}) {
    this.dependencies[name] = {
      factory,
      singleton: options.singleton || false
    };
  }

  resolve(name) {
    const dependency = this.dependencies[name];
    
    if (!dependency) {
      throw new Error(`Dependency ${name} not found`);
    }

    // Return cached singleton
    if (dependency.singleton && this.singletons[name]) {
      return this.singletons[name];
    }

    // Create instance
    const instance = dependency.factory(this);

    // Cache if singleton
    if (dependency.singleton) {
      this.singletons[name] = instance;
    }

    return instance;
  }
}

// Usage
const container = new DIContainer();

// Register dependencies
container.register('logger', () => require('../utils/logger'), { singleton: true });

container.register('userRepository', (c) => {
  const UserRepository = require('../repositories/user.repository');
  return new UserRepository();
}, { singleton: true });

container.register('userService', (c) => {
  const UserService = require('../services/user.service');
  const userRepository = c.resolve('userRepository');
  const logger = c.resolve('logger');
  return new UserService(userRepository, logger);
}, { singleton: true });

module.exports = container;
```

**Benefits of Dependency Injection:**

✅ **Testability**: Easy to mock dependencies in tests
✅ **Loose Coupling**: Components don't depend on concrete implementations
✅ **Flexibility**: Easy to swap implementations
✅ **Maintainability**: Clear dependency graph
✅ **Reusability**: Components can be reused in different contexts

**Example Test with DI:**

```javascript
// tests/services/user.service.test.js
const UserService = require('../../src/services/user.service');

describe('UserService', () => {
  let userService;
  let mockUserRepository;
  let mockEmailService;
  let mockLogger;

  beforeEach(() => {
    // Mock dependencies
    mockUserRepository = {
      create: jest.fn()
    };
    
    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };
    
    mockLogger = {
      info: jest.fn()
    };

    // Inject mocks
    userService = new UserService(
      mockUserRepository,
      mockEmailService,
      mockLogger
    );
  });

  it('should create user and send welcome email', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const createdUser = { id: '123', ...userData };

    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(userData);

    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result).toEqual(createdUser);
  });
});
```

[Back to Table of Contents](#table-of-contents)

### **1.5. How to organize middleware in a modular way?**

**Answer:**

Organizing middleware in a modular, reusable way improves code maintainability and testability.

**1. Middleware Directory Structure**

```
src/api/middlewares/
├── index.js                 # Middleware aggregator
├── auth.middleware.js       # Authentication
├── validation.middleware.js # Request validation
├── error.middleware.js      # Error handling
├── logging.middleware.js    # Request logging
├── cache.middleware.js      # Caching
├── rateLimit.middleware.js  # Rate limiting
└── upload.middleware.js     # File uploads
```

**2. Authentication Middleware**

```javascript
// src/api/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../../utils/errors');
const config = require('../../config');

class AuthMiddleware {
  /**
   * Verify JWT token
   */
  authenticate(req, res, next) {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        throw new AppError('No token provided', 401);
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        next(new AppError('Invalid token', 401));
      } else if (error.name === 'TokenExpiredError') {
        next(new AppError('Token expired', 401));
      } else {
        next(error);
      }
    }
  }

  /**
   * Check user roles
   */
  authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    };
  }

  /**
   * Optional authentication (doesn't fail if no token)
   */
  optionalAuth(req, res, next) {
    try {
      const token = this.extractToken(req);
      
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
      }
    } catch (error) {
      // Silently fail for optional auth
    }
    
    next();
  }

  /**
   * Check resource ownership
   */
  checkOwnership(resourceIdParam = 'id') {
    return async (req, res, next) => {
      try {
        const resourceId = req.params[resourceIdParam];
        const userId = req.user.id;

        // Admin can access everything
        if (req.user.role === 'admin') {
          return next();
        }

        // Check if user owns the resource
        const resource = await this.getResource(resourceId);
        
        if (resource.userId !== userId) {
          return next(new AppError('Access denied', 403));
        }

        req.resource = resource;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Extract token from header
   */
  extractToken(req) {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return null;
  }
}

module.exports = new AuthMiddleware();
```

**3. Validation Middleware**

```javascript
// src/api/middlewares/validation.middleware.js
const { validationResult } = require('express-validator');
const { AppError } = require('../../utils/errors');

/**
 * Validate request using express-validator
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    return next(new AppError('Validation failed', 400, formattedErrors));
  }
  
  next();
}

/**
 * Validate schema using Joi
 */
function validateSchema(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(new AppError('Validation failed', 400, errors));
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
}

/**
 * Sanitize input data
 */
function sanitizeInput(req, res, next) {
  // Remove XSS attempts
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
}

module.exports = {
  validateRequest,
  validateSchema,
  sanitizeInput
};
```

**4. Error Handling Middleware**

```javascript
// src/api/middlewares/error.middleware.js
const logger = require('../../utils/logger');
const { AppError } = require('../../utils/errors');

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    error = new AppError('Validation Error', 400, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = new AppError('Invalid ID format', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * 404 Not Found handler
 */
function notFound(req, res, next) {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
}

/**
 * Async handler wrapper
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
```

**5. Logging Middleware**

```javascript
// src/api/middlewares/logging.middleware.js
const logger = require('../../utils/logger');
const morgan = require('morgan');

/**
 * Request logging
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    });
  });

  next();
}

/**
 * Morgan integration
 */
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  }
);

module.exports = {
  requestLogger,
  morganMiddleware
};
```

**6. Rate Limiting Middleware**

```javascript
// src/api/middlewares/rateLimit.middleware.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../../config/redis');

/**
 * General rate limiter
 */
const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
});

/**
 * Strict rate limiter for auth endpoints
 */
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later'
});

/**
 * Per-user rate limiter
 */
function createUserLimiter(maxRequests = 50) {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:user:'
    }),
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => req.user?.role === 'admin'
  });
}

module.exports = {
  generalLimiter,
  authLimiter,
  createUserLimiter
};
```

**7. Cache Middleware**

```javascript
// src/api/middlewares/cache.middleware.js
const redis = require('../../config/redis');
const logger = require('../../utils/logger');

/**
 * Cache GET requests
 */
function cache(duration = 300) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      
      if (cached) {
        logger.debug(`Cache hit: ${key}`);
        return res.json(JSON.parse(cached));
      }

      // Store original send function
      const originalSend = res.json.bind(res);

      // Override send function
      res.json = (body) => {
        // Cache successful responses
        if (res.statusCode === 200) {
          redis.setex(key, duration, JSON.stringify(body));
        }
        
        return originalSend(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
}

/**
 * Invalidate cache by pattern
 */
async function invalidateCache(pattern) {
  const keys = await redis.keys(`cache:${pattern}`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

module.exports = {
  cache,
  invalidateCache
};
```

**8. Middleware Aggregator**

```javascript
// src/api/middlewares/index.js
const auth = require('./auth.middleware');
const { validateRequest, validateSchema, sanitizeInput } = require('./validation.middleware');
const { errorHandler, notFound, asyncHandler } = require('./error.middleware');
const { requestLogger, morganMiddleware } = require('./logging.middleware');
const { generalLimiter, authLimiter, createUserLimiter } = require('./rateLimit.middleware');
const { cache, invalidateCache } = require('./cache.middleware');

module.exports = {
  // Auth
  authenticate: auth.authenticate.bind(auth),
  authorize: auth.authorize.bind(auth),
  optionalAuth: auth.optionalAuth.bind(auth),
  checkOwnership: auth.checkOwnership.bind(auth),
  
  // Validation
  validateRequest,
  validateSchema,
  sanitizeInput,
  
  // Error handling
  errorHandler,
  notFound,
  asyncHandler,
  
  // Logging
  requestLogger,
  morganMiddleware,
  
  // Rate limiting
  generalLimiter,
  authLimiter,
  createUserLimiter,
  
  // Caching
  cache,
  invalidateCache
};
```

**9. Using Middleware in Routes**

```javascript
// src/api/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const { 
  authenticate, 
  authorize, 
  validateSchema,
  cache,
  asyncHandler 
} = require('../middlewares');
const userValidator = require('../../validators/user.validator');

const router = express.Router();

// Public routes with caching
router.get(
  '/',
  cache(300),
  asyncHandler(userController.getAllUsers)
);

// Protected routes
router.use(authenticate);

router.post(
  '/',
  authorize('admin'),
  validateSchema(userValidator.createUser),
  asyncHandler(userController.createUser)
);

router.put(
  '/:id',
  validateSchema(userValidator.updateUser),
  checkOwnership('id'),
  asyncHandler(userController.updateUser)
);

module.exports = router;
```

**Benefits of Modular Middleware:**

✅ **Reusability**: Use middleware across multiple routes
✅ **Testability**: Test middleware in isolation
✅ **Separation of Concerns**: Each middleware has one job
✅ **Composability**: Combine middleware easily
✅ **Maintainability**: Easy to update or replace middleware

[Back to Table of Contents](#table-of-contents)

### **1.6. What are the patterns for configuration management?**

**Answer:**

Proper configuration management is essential for security, maintainability, and deployment across different environments.

**1. Environment-Based Configuration**

```javascript
// src/config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'myapp',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    ssl: process.env.DB_SSL === 'true'
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10)
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  // AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET
  },
  
  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },
  
  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 min
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
    }
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
};

// Validate required configuration
function validateConfig() {
  const required = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_NAME'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = config;
```

**2. Multiple Environment Files**

```bash
# .env.example (Template for developers)
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USERNAME=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d

# AWS (optional for development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=
EMAIL_PASSWORD=

# .env.development
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_NAME=myapp_dev
LOG_LEVEL=debug

# .env.production
NODE_ENV=production
PORT=8080
DB_HOST=prod-db.example.com
DB_NAME=myapp_prod
DB_SSL=true
LOG_LEVEL=error
RATE_LIMIT_MAX=50
```

**3. Config Module with Getters**

```javascript
// src/config/config.js
class Config {
  constructor() {
    this.values = this.loadConfig();
  }

  loadConfig() {
    return {
      server: {
        port: this.getNumber('PORT', 3000),
        host: this.getString('HOST', '0.0.0.0')
      },
      database: {
        url: this.getRequired('DATABASE_URL'),
        maxConnections: this.getNumber('DB_MAX_CONNECTIONS', 10)
      },
      jwt: {
        secret: this.getRequired('JWT_SECRET'),
        expiresIn: this.getString('JWT_EXPIRES_IN', '1d')
      }
    };
  }

  getString(key, defaultValue = '') {
    return process.env[key] || defaultValue;
  }

  getNumber(key, defaultValue = 0) {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
  }

  getBoolean(key, defaultValue = false) {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  getArray(key, separator = ',', defaultValue = []) {
    const value = process.env[key];
    return value ? value.split(separator).map(v => v.trim()) : defaultValue;
  }

  getRequired(key) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required`);
    }
    return value;
  }

  get(path, defaultValue) {
    const keys = path.split('.');
    let value = this.values;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return defaultValue;
    }

    return value;
  }

  isDevelopment() {
    return this.getString('NODE_ENV') === 'development';
  }

  isProduction() {
    return this.getString('NODE_ENV') === 'production';
  }

  isTest() {
    return this.getString('NODE_ENV') === 'test';
  }
}

module.exports = new Config();
```

**4. Configuration with Validation (using Joi)**

```javascript
// src/config/config.validation.js
const Joi = require('joi');

const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  
  PORT: Joi.number()
    .default(3000),
  
  DB_HOST: Joi.string()
    .required(),
  
  DB_PORT: Joi.number()
    .default(5432),
  
  DB_NAME: Joi.string()
    .required(),
  
  DB_USERNAME: Joi.string()
    .required(),
  
  DB_PASSWORD: Joi.string()
    .required()
    .min(8),
  
  JWT_SECRET: Joi.string()
    .required()
    .min(32),
  
  JWT_EXPIRES_IN: Joi.string()
    .default('1d'),
  
  REDIS_HOST: Joi.string()
    .default('localhost'),
  
  REDIS_PORT: Joi.number()
    .default(6379),
  
  AWS_REGION: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  
  CORS_ORIGIN: Joi.string()
    .default('*')
})
  .unknown()
  .required();

function validateConfig() {
  const { error, value } = configSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => detail.message).join(', ');
    throw new Error(`Config validation error: ${errors}`);
  }

  return value;
}

module.exports = { validateConfig };

// Usage in config/index.js
const { validateConfig } = require('./config.validation');

const validatedEnv = validateConfig();

module.exports = {
  env: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  database: {
    host: validatedEnv.DB_HOST,
    port: validatedEnv.DB_PORT,
    name: validatedEnv.DB_NAME,
    username: validatedEnv.DB_USERNAME,
    password: validatedEnv.DB_PASSWORD
  },
  // ... rest of config
};
```

**5. Configuration per Module**

```javascript
// src/config/database.js
module.exports = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'myapp_dev',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// src/config/redis.js
const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET'];
    return targetErrors.some(targetError => err.message.includes(targetError));
  }
};

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

module.exports = redis;
```

**6. Secrets Management**

```javascript
// src/config/secrets.js
const AWS = require('aws-sdk');
const logger = require('../utils/logger');

class SecretsManager {
  constructor() {
    this.client = new AWS.SecretsManager({
      region: process.env.AWS_REGION
    });
    this.cache = new Map();
  }

  async getSecret(secretName) {
    // Check cache first
    if (this.cache.has(secretName)) {
      return this.cache.get(secretName);
    }

    try {
      const data = await this.client.getSecretValue({
        SecretId: secretName
      }).promise();

      let secret;
      if ('SecretString' in data) {
        secret = JSON.parse(data.SecretString);
      } else {
        secret = Buffer.from(data.SecretBinary, 'base64').toString('ascii');
      }

      // Cache for 5 minutes
      this.cache.set(secretName, secret);
      setTimeout(() => this.cache.delete(secretName), 5 * 60 * 1000);

      return secret;
    } catch (error) {
      logger.error(`Error fetching secret ${secretName}:`, error);
      throw error;
    }
  }

  async loadSecrets() {
    if (process.env.NODE_ENV === 'production') {
      const secrets = await this.getSecret(process.env.SECRET_NAME);
      
      // Merge secrets into process.env
      Object.assign(process.env, secrets);
    }
  }
}

module.exports = new SecretsManager();
```

**7. Configuration Best Practices**

```javascript
// src/config/index.js
const config = {
  // Use descriptive names
  server: {
    port: process.env.SERVER_PORT || 3000,
    host: process.env.SERVER_HOST || '0.0.0.0',
    timeout: parseInt(process.env.SERVER_TIMEOUT || '30000')
  },

  // Group related configs
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || []
  },

  // Provide sensible defaults
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT || '10'),
    maxLimit: parseInt(process.env.MAX_PAGE_LIMIT || '100')
  },

  // Type casting
  features: {
    enableCache: process.env.ENABLE_CACHE === 'true',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
  },

  // Computed values
  get isDevelopment() {
    return this.env === 'development';
  },

  get isProduction() {
    return this.env === 'production';
  },

  get databaseUrl() {
    return `postgresql://${this.database.username}:${this.database.password}@${this.database.host}:${this.database.port}/${this.database.name}`;
  }
};

// Freeze config in production
if (config.isProduction) {
  Object.freeze(config);
}

module.exports = config;
```

**Configuration Best Practices Summary:**

✅ **Never commit secrets** - Use .env files (git ignored)
✅ **Validate on startup** - Fail fast if config is invalid
✅ **Use environment variables** - 12-factor app methodology
✅ **Provide defaults** - Sensible defaults for development
✅ **Type safety** - Cast strings to appropriate types
✅ **Centralize config** - Single source of truth
✅ **Document variables** - Use .env.example as template
✅ **Use secrets management** - AWS Secrets Manager, Vault for production

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 2. Advanced Middleware Patterns

### **2.1. How to create custom middleware for complex scenarios?**

[Back to Table of Contents](#table-of-contents)

### **2.2. What is middleware composition and chaining?**

[Back to Table of Contents](#table-of-contents)

### **2.3. How to implement error handling middleware properly?**

[Back to Table of Contents](#table-of-contents)

### **2.4. What are async middleware patterns?**

[Back to Table of Contents](#table-of-contents)

### **2.5. How to create reusable middleware factories?**

[Back to Table of Contents](#table-of-contents)

### **2.6. What is middleware for request validation and sanitization?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 3. Request Validation & Data Handling

### **3.1. How to use Joi for schema validation?**

[Back to Table of Contents](#table-of-contents)

### **3.2. What is Zod and how does it compare to Joi?**

[Back to Table of Contents](#table-of-contents)

### **3.3. How to implement class-validator with express-validator?**

[Back to Table of Contents](#table-of-contents)

### **3.4. What are best practices for file upload validation?**

[Back to Table of Contents](#table-of-contents)

### **3.5. How to handle multipart/form-data with Multer?**

[Back to Table of Contents](#table-of-contents)

### **3.6. What is request sanitization and XSS prevention?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 4. Database Integration & ORMs

### **4.1. How to use Prisma ORM with Express.js?**

#### **4.1.1. What are Prisma schema best practices?**

[Back to Table of Contents](#table-of-contents)

#### **4.1.2. How to handle migrations in production?**

[Back to Table of Contents](#table-of-contents)

#### **4.1.3. What are Prisma performance optimization techniques?**

[Back to Table of Contents](#table-of-contents)

### **4.2. How to use TypeORM with Express.js?**

#### **4.2.1. What are decorators and entity patterns?**

[Back to Table of Contents](#table-of-contents)

#### **4.2.2. How to implement repository pattern with TypeORM?**

[Back to Table of Contents](#table-of-contents)

### **4.3. How to use Sequelize effectively?**

[Back to Table of Contents](#table-of-contents)

### **4.4. What are database connection pooling strategies?**

[Back to Table of Contents](#table-of-contents)

### **4.5. How to implement database transactions?**

[Back to Table of Contents](#table-of-contents)

### **4.6. What are query optimization techniques?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 5. Advanced Authentication & Authorization

### **5.1. How to implement JWT authentication properly?**

#### **5.1.1. What are access and refresh token patterns?**

[Back to Table of Contents](#table-of-contents)

#### **5.1.2. How to handle token rotation and revocation?**

[Back to Table of Contents](#table-of-contents)

#### **5.1.3. What is token storage security?**

[Back to Table of Contents](#table-of-contents)

### **5.2. How to implement OAuth 2.0 with Passport.js?**

[Back to Table of Contents](#table-of-contents)

### **5.3. What are RBAC and ABAC patterns?**

[Back to Table of Contents](#table-of-contents)

### **5.4. How to implement API key authentication?**

[Back to Table of Contents](#table-of-contents)

### **5.5. What is session management with Redis?**

[Back to Table of Contents](#table-of-contents)

### **5.6. How to implement rate limiting per user?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 6. API Design & Best Practices

### **6.1. How to design RESTful APIs following best practices?**

[Back to Table of Contents](#table-of-contents)

### **6.2. What is API versioning and how to implement it?**

[Back to Table of Contents](#table-of-contents)

### **6.3. How to implement HATEOAS?**

[Back to Table of Contents](#table-of-contents)

### **6.4. What are pagination strategies (cursor vs offset)?**

[Back to Table of Contents](#table-of-contents)

### **6.5. How to implement filtering, sorting, and searching?**

[Back to Table of Contents](#table-of-contents)

### **6.6. What is GraphQL integration with Express?**

[Back to Table of Contents](#table-of-contents)

### **6.7. How to document APIs with Swagger/OpenAPI?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 7. Caching Strategies

### **7.1. How to implement Redis caching?**

#### **7.1.1. What are cache invalidation strategies?**

[Back to Table of Contents](#table-of-contents)

#### **7.1.2. How to implement cache-aside pattern?**

[Back to Table of Contents](#table-of-contents)

#### **7.1.3. What is write-through vs write-behind caching?**

[Back to Table of Contents](#table-of-contents)

### **7.2. How to use in-memory caching with node-cache?**

[Back to Table of Contents](#table-of-contents)

### **7.3. What is HTTP caching with ETags and Cache-Control?**

[Back to Table of Contents](#table-of-contents)

### **7.4. How to implement distributed caching?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 8. Real-time Communication

### **8.1. How to integrate Socket.io with Express?**

#### **8.1.1. What are room and namespace patterns?**

[Back to Table of Contents](#table-of-contents)

#### **8.1.2. How to implement authentication for Socket.io?**

[Back to Table of Contents](#table-of-contents)

#### **8.1.3. What is scaling Socket.io with Redis adapter?**

[Back to Table of Contents](#table-of-contents)

### **8.2. How to implement Server-Sent Events (SSE)?**

[Back to Table of Contents](#table-of-contents)

### **8.3. What is WebSocket implementation without libraries?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 9. Message Queues & Background Jobs

### **9.1. How to use Bull queue for background jobs?**

#### **9.1.1. What are job priorities and retry strategies?**

[Back to Table of Contents](#table-of-contents)

#### **9.1.2. How to implement job scheduling?**

[Back to Table of Contents](#table-of-contents)

#### **9.1.3. What is queue monitoring and metrics?**

[Back to Table of Contents](#table-of-contents)

### **9.2. How to integrate RabbitMQ with Express?**

[Back to Table of Contents](#table-of-contents)

### **9.3. What are pub/sub patterns with Redis?**

[Back to Table of Contents](#table-of-contents)

### **9.4. How to implement event-driven architecture?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 10. File Storage & Management

### **10.1. How to integrate AWS S3 for file storage?**

[Back to Table of Contents](#table-of-contents)

### **10.2. What is file streaming and processing?**

[Back to Table of Contents](#table-of-contents)

### **10.3. How to implement image optimization and resizing?**

[Back to Table of Contents](#table-of-contents)

### **10.4. What are signed URLs and presigned uploads?**

[Back to Table of Contents](#table-of-contents)

### **10.5. How to handle large file uploads efficiently?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 11. Security Best Practices

### **11.1. How to implement Helmet.js properly?**

[Back to Table of Contents](#table-of-contents)

### **11.2. What is CORS configuration for production?**

[Back to Table of Contents](#table-of-contents)

### **11.3. How to prevent SQL injection with ORMs?**

[Back to Table of Contents](#table-of-contents)

### **11.4. What are rate limiting strategies?**

[Back to Table of Contents](#table-of-contents)

### **11.5. How to implement request signing and verification?**

[Back to Table of Contents](#table-of-contents)

### **11.6. What is secure session management?**

[Back to Table of Contents](#table-of-contents)

### **11.7. How to handle sensitive data encryption?**

[Back to Table of Contents](#table-of-contents)

### **11.8. What are security headers best practices?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 12. Testing Strategies

### **12.1. How to write unit tests with Jest?**

#### **12.1.1. What are mocking strategies for dependencies?**

[Back to Table of Contents](#table-of-contents)

#### **12.1.2. How to test middleware functions?**

[Back to Table of Contents](#table-of-contents)

### **12.2. How to write integration tests with Supertest?**

[Back to Table of Contents](#table-of-contents)

### **12.3. What is E2E testing with Playwright or Cypress?**

[Back to Table of Contents](#table-of-contents)

### **12.4. How to implement test databases and fixtures?**

[Back to Table of Contents](#table-of-contents)

### **12.5. What are API contract testing strategies?**

[Back to Table of Contents](#table-of-contents)

### **12.6. How to achieve good test coverage?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 13. Performance Optimization

### **13.1. How to implement compression middleware?**

[Back to Table of Contents](#table-of-contents)

### **13.2. What are database query optimization techniques?**

[Back to Table of Contents](#table-of-contents)

### **13.3. How to use clustering with Node.js?**

[Back to Table of Contents](#table-of-contents)

### **13.4. What is load balancing with PM2?**

[Back to Table of Contents](#table-of-contents)

### **13.5. How to optimize memory usage?**

[Back to Table of Contents](#table-of-contents)

### **13.6. What are profiling and benchmarking tools?**

[Back to Table of Contents](#table-of-contents)

### **13.7. How to implement lazy loading and code splitting?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 14. Logging & Monitoring

### **14.1. How to implement structured logging with Winston?**

[Back to Table of Contents](#table-of-contents)

### **14.2. What is Pino and why is it faster?**

[Back to Table of Contents](#table-of-contents)

### **14.3. How to integrate with ELK stack?**

[Back to Table of Contents](#table-of-contents)

### **14.4. What is distributed tracing with OpenTelemetry?**

[Back to Table of Contents](#table-of-contents)

### **14.5. How to implement application monitoring with Prometheus?**

[Back to Table of Contents](#table-of-contents)

### **14.6. What are health check endpoints?**

[Back to Table of Contents](#table-of-contents)

### **14.7. How to track custom metrics?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 15. Error Handling & Debugging

### **15.1. How to implement centralized error handling?**

[Back to Table of Contents](#table-of-contents)

### **15.2. What are custom error classes and error codes?**

[Back to Table of Contents](#table-of-contents)

### **15.3. How to handle async errors properly?**

[Back to Table of Contents](#table-of-contents)

### **15.4. What is error reporting with Sentry?**

[Back to Table of Contents](#table-of-contents)

### **15.5. How to debug memory leaks?**

[Back to Table of Contents](#table-of-contents)

### **15.6. What are debugging tools and techniques?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 16. Docker & Containerization

### **16.1. How to create production-ready Dockerfiles?**

[Back to Table of Contents](#table-of-contents)

### **16.2. What is multi-stage Docker builds?**

[Back to Table of Contents](#table-of-contents)

### **16.3. How to use Docker Compose for development?**

[Back to Table of Contents](#table-of-contents)

### **16.4. What are Docker networking best practices?**

[Back to Table of Contents](#table-of-contents)

### **16.5. How to optimize Docker image size?**

[Back to Table of Contents](#table-of-contents)

### **16.6. What is container orchestration basics?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 17. Microservices Architecture

### **17.1. How to design microservices with Express?**

[Back to Table of Contents](#table-of-contents)

### **17.2. What are service discovery patterns?**

[Back to Table of Contents](#table-of-contents)

### **17.3. How to implement API Gateway pattern?**

[Back to Table of Contents](#table-of-contents)

### **17.4. What is inter-service communication?**

[Back to Table of Contents](#table-of-contents)

### **17.5. How to handle distributed transactions?**

[Back to Table of Contents](#table-of-contents)

### **17.6. What are circuit breaker patterns?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 18. CI/CD & Deployment

### **18.1. How to set up CI/CD with GitHub Actions?**

[Back to Table of Contents](#table-of-contents)

### **18.2. What are deployment strategies (blue-green, canary)?**

[Back to Table of Contents](#table-of-contents)

### **18.3. How to deploy to AWS (EC2, ECS, Lambda)?**

[Back to Table of Contents](#table-of-contents)

### **18.4. What is deployment to Heroku best practices?**

[Back to Table of Contents](#table-of-contents)

### **18.5. How to implement zero-downtime deployments?**

[Back to Table of Contents](#table-of-contents)

### **18.6. What are environment configuration strategies?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 19. TypeScript Integration

### **19.1. How to set up TypeScript with Express?**

[Back to Table of Contents](#table-of-contents)

### **19.2. What are type-safe request/response patterns?**

[Back to Table of Contents](#table-of-contents)

### **19.3. How to create custom type definitions?**

[Back to Table of Contents](#table-of-contents)

### **19.4. What is strict mode configuration?**

[Back to Table of Contents](#table-of-contents)

### **19.5. How to handle decorators and metadata?**

[Back to Table of Contents](#table-of-contents)

### **19.6. What are advanced TypeScript patterns for Express?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 20. Email & Notifications

### **20.1. How to integrate Nodemailer for email sending?**

[Back to Table of Contents](#table-of-contents)

### **20.2. What are email template engines (Handlebars, Pug)?**

[Back to Table of Contents](#table-of-contents)

### **20.3. How to use SendGrid or AWS SES?**

[Back to Table of Contents](#table-of-contents)

### **20.4. What is notification system design?**

[Back to Table of Contents](#table-of-contents)

### **20.5. How to implement push notifications?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 21. Payment Integration

### **21.1. How to integrate Stripe with Express?**

[Back to Table of Contents](#table-of-contents)

### **21.2. What is webhook handling for payments?**

[Back to Table of Contents](#table-of-contents)

### **21.3. How to handle payment security?**

[Back to Table of Contents](#table-of-contents)

### **21.4. What are subscription management patterns?**

[Back to Table of Contents](#table-of-contents)

### **21.5. How to implement refund logic?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 22. Search Implementation

### **22.1. How to integrate Elasticsearch?**

[Back to Table of Contents](#table-of-contents)

### **22.2. What is full-text search with PostgreSQL?**

[Back to Table of Contents](#table-of-contents)

### **22.3. How to implement autocomplete functionality?**

[Back to Table of Contents](#table-of-contents)

### **22.4. What are search optimization strategies?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 23. Third-party API Integration

### **23.1. How to structure API client modules?**

[Back to Table of Contents](#table-of-contents)

### **23.2. What are retry and timeout strategies with Axios?**

[Back to Table of Contents](#table-of-contents)

### **23.3. How to handle API rate limits?**

[Back to Table of Contents](#table-of-contents)

### **23.4. What is request/response transformation?**

[Back to Table of Contents](#table-of-contents)

### **23.5. How to mock external APIs in tests?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 24. Advanced Design Patterns

### **24.1. What is Repository pattern implementation?**

[Back to Table of Contents](#table-of-contents)

### **24.2. How to implement Factory pattern?**

[Back to Table of Contents](#table-of-contents)

### **24.3. What is Strategy pattern for business logic?**

[Back to Table of Contents](#table-of-contents)

### **24.4. How to use Observer pattern for events?**

[Back to Table of Contents](#table-of-contents)

### **24.5. What is Decorator pattern for middleware?**

[Back to Table of Contents](#table-of-contents)

### **24.6. How to implement Chain of Responsibility?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

## 25. Production Best Practices

### **25.1. How to handle graceful shutdown?**

[Back to Table of Contents](#table-of-contents)

### **25.2. What is process management with PM2?**

[Back to Table of Contents](#table-of-contents)

### **25.3. How to implement backup and disaster recovery?**

[Back to Table of Contents](#table-of-contents)

### **25.4. What are scaling strategies?**

[Back to Table of Contents](#table-of-contents)

### **25.5. How to monitor production metrics?**

[Back to Table of Contents](#table-of-contents)

### **25.6. What is incident response planning?**

[Back to Table of Contents](#table-of-contents)

[⬆ Back to Top](#middle-nodejs-expressjs-comprehensive-guide)

---

**Note:** This guide covers middle-level Node.js development with Express.js and modern tools. Answers will be added in subsequent updates. For NestJS-specific content, please refer to the dedicated NestJS guide.

