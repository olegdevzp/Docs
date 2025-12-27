# REST Standards Guide

## What is REST?

REST (Representational State Transfer) is an architectural style for designing networked applications. It was introduced by Roy Fielding in his 2000 doctoral dissertation and has become the standard for web APIs.

## Core Principles

### 1. Stateless
- Each request from client to server must contain all information needed to understand the request
- Server should not store any client context between requests
- Session state is kept entirely on the client

### 2. Client-Server Architecture
- Separation of concerns between client and server
- Client handles user interface and user state
- Server handles data storage and business logic
- They can evolve independently

### 3. Uniform Interface
- Standardized way of communication between client and server
- Four constraints:
  - Resource identification in requests
  - Resource manipulation through representations
  - Self-descriptive messages
  - Hypermedia as the engine of application state (HATEOAS)

### 4. Cacheable
- Responses must define themselves as cacheable or non-cacheable
- Improves performance and scalability
- Reduces server load

### 5. Layered System
- Architecture can be composed of hierarchical layers
- Each layer cannot see beyond the immediate layer
- Enables load balancing and shared caches

### 6. Code on Demand (Optional)
- Server can temporarily extend client functionality
- Executable code can be sent to client

## HTTP Methods

### GET
- **Purpose**: Retrieve data
- **Idempotent**: Yes
- **Safe**: Yes
- **Body**: No
- **Example**: `GET /api/users/123`

### POST
- **Purpose**: Create new resources
- **Idempotent**: No
- **Safe**: No
- **Body**: Yes
- **Example**: `POST /api/users`

### PUT
- **Purpose**: Update entire resource
- **Idempotent**: Yes
- **Safe**: No
- **Body**: Yes
- **Example**: `PUT /api/users/123`

### PATCH
- **Purpose**: Partial update of resource
- **Idempotent**: No
- **Safe**: No
- **Body**: Yes
- **Example**: `PATCH /api/users/123`

### DELETE
- **Purpose**: Remove resource
- **Idempotent**: Yes
- **Safe**: No
- **Body**: No
- **Example**: `DELETE /api/users/123`

### HEAD
- **Purpose**: Get headers only
- **Idempotent**: Yes
- **Safe**: Yes
- **Body**: No
- **Example**: `HEAD /api/users/123`

### OPTIONS
- **Purpose**: Get allowed methods
- **Idempotent**: Yes
- **Safe**: Yes
- **Body**: No
- **Example**: `OPTIONS /api/users`

## HTTP Status Codes

### 2xx Success
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **202 Accepted**: Request accepted for processing
- **204 No Content**: Request successful, no content returned

### 3xx Redirection
- **301 Moved Permanently**: Resource moved permanently
- **302 Found**: Resource temporarily moved
- **304 Not Modified**: Resource not modified since last request

### 4xx Client Error
- **400 Bad Request**: Invalid request syntax
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Server refuses to authorize
- **404 Not Found**: Resource not found
- **405 Method Not Allowed**: HTTP method not allowed
- **409 Conflict**: Request conflicts with current state
- **422 Unprocessable Entity**: Well-formed request but semantic errors
- **429 Too Many Requests**: Rate limit exceeded

### 5xx Server Error
- **500 Internal Server Error**: Generic server error
- **501 Not Implemented**: Server doesn't support functionality
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Server temporarily unavailable
- **504 Gateway Timeout**: Upstream server timeout

## URL Design Best Practices

### Resource Naming
- Use nouns, not verbs
- Use plural nouns for collections
- Use lowercase with hyphens or underscores
- Be consistent

**Good Examples:**
```
GET /api/users
GET /api/users/123
GET /api/users/123/orders
POST /api/users
PUT /api/users/123
DELETE /api/users/123
```

**Bad Examples:**
```
GET /api/getUsers
GET /api/user/123
GET /api/users/123/getOrders
POST /api/createUser
```

### Hierarchical Structure
- Use forward slashes to indicate hierarchy
- Don't go too deep (max 2-3 levels)
- Use query parameters for filtering, sorting, pagination

**Examples:**
```
GET /api/users/123/orders
GET /api/users/123/orders?status=completed
GET /api/users/123/orders?page=1&limit=10
```

## Request/Response Format

### Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
Cache-Control: no-cache
```

### Request Body (JSON)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### Response Body (JSON)
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2023-01-01T00:00:00Z",
    "request_id": "req_123456"
  }
}
```

### Common Error Patterns
- Use appropriate HTTP status codes
- Provide meaningful error messages
- Include error codes for programmatic handling
- Log errors with request IDs for debugging

## Pagination

### Query Parameters
```
GET /api/users?page=1&limit=10&sort=name&order=asc
```

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

## Versioning

### URL Versioning
```
GET /api/v1/users
GET /api/v2/users
```

### Header Versioning
```
Accept: application/vnd.api+json;version=1
```

### Query Parameter Versioning
```
GET /api/users?version=1
```

## Security Best Practices

### Authentication
- Use HTTPS for all communications
- Implement proper authentication (JWT, OAuth2)
- Never expose sensitive data in URLs

### Authorization
- Implement role-based access control
- Validate permissions for each request
- Use principle of least privilege

### Input Validation
- Validate all input data
- Sanitize user inputs
- Use proper data types

## Performance Considerations

### Caching
- Use appropriate cache headers
- Implement ETags for conditional requests
- Cache static resources

### Compression
- Use gzip compression
- Compress response bodies when appropriate

### Rate Limiting
- Implement rate limiting
- Return appropriate headers
- Provide clear error messages

## HATEOAS (Hypermedia as the Engine of Application State)

### Example Response
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": {
      "href": "/api/users/123"
    },
    "orders": {
      "href": "/api/users/123/orders"
    },
    "update": {
      "href": "/api/users/123",
      "method": "PUT"
    },
    "delete": {
      "href": "/api/users/123",
      "method": "DELETE"
    }
  }
}
```

## Common Anti-Patterns to Avoid

### 1. Using Verbs in URLs
```
❌ GET /api/getUser/123
✅ GET /api/users/123
```

### 2. Inconsistent Naming
```
❌ GET /api/Users
❌ GET /api/user_list
✅ GET /api/users
```

### 3. Ignoring HTTP Status Codes
```
❌ Always returning 200 OK
✅ Using appropriate status codes
```

### 4. Exposing Internal Implementation
```
❌ GET /api/getUserFromDatabase/123
✅ GET /api/users/123
```

### 5. Not Handling Errors Properly
```
❌ Generic error responses
✅ Specific, actionable error messages
```

## Testing REST APIs

### Unit Testing
- Test individual endpoints
- Mock external dependencies
- Test error scenarios

### Integration Testing
- Test complete request/response cycles
- Test with real database
- Test authentication flows

### Load Testing
- Test performance under load
- Identify bottlenecks
- Validate rate limiting

## Tools and Frameworks

### API Documentation
- OpenAPI/Swagger
- Postman
- Insomnia

### Testing Tools
- Postman
- Newman
- REST Assured
- Jest

### Monitoring
- Application Performance Monitoring (APM)
- Log aggregation tools
- Error tracking services

## Conclusion

REST is a powerful architectural style that provides a standardized way to build web APIs. By following these standards and best practices, you can create APIs that are:

- **Scalable**: Can handle growth and increased load
- **Maintainable**: Easy to understand and modify
- **Reliable**: Consistent behavior and error handling
- **Secure**: Proper authentication and authorization
- **Performant**: Optimized for speed and efficiency

Remember that REST is not just about HTTP methods and status codes—it's about creating a consistent, intuitive interface that developers can easily understand and use.






