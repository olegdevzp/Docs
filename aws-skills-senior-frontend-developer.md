# Comprehensive AWS Skills for Senior Frontend Developer

## Table of Contents
1. [Core Hosting & Deployment](#1-core-hosting--deployment)
2. [Content Delivery & Performance](#2-content-delivery--performance)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Storage Solutions](#4-storage-solutions)
5. [Serverless & APIs](#5-serverless--apis)
6. [CI/CD & DevOps](#6-cicd--devops)
7. [Monitoring & Logging](#7-monitoring--logging)
8. [Security](#8-security)
9. [Database Services](#9-database-services)
10. [Advanced Services](#10-advanced-services)
11. [Cost Optimization](#11-cost-optimization)
12. [Infrastructure as Code](#12-infrastructure-as-code)

---

## 1. Core Hosting & Deployment

### **Amazon S3 (Simple Storage Service)**
**Skill Level Required:** Advanced

**Key Concepts:**
- Static website hosting configuration
- Bucket policies and access control
- Versioning and lifecycle policies
- Cross-Origin Resource Sharing (CORS) configuration
- Event notifications and triggers
- Object metadata and tags
- Transfer acceleration
- Intelligent tiering for cost optimization

**Practical Applications:**
```bash
# S3 bucket policy example for public website
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-website-bucket/*"
    }
  ]
}

# AWS CLI commands you should know
aws s3 sync ./dist s3://my-bucket --delete
aws s3 cp ./dist s3://my-bucket --recursive --cache-control max-age=31536000
aws s3api put-bucket-website --bucket my-bucket --website-configuration file://website-config.json
```

**Interview Questions:**
- How do you configure S3 for optimal static website hosting?
- Explain S3 caching strategies for different file types
- How do you handle S3 bucket versioning in production?

---

### **AWS Amplify**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:** 
- Amplify Hosting for automatic deployments
- Git-based workflows (GitHub, GitLab, Bitbucket)
- Preview deployments for pull requests
- Custom domain setup with SSL/TLS certificates
- Environment variables and secrets management
- Build specifications and custom build settings
- Monorepo support
- Server-side rendering (SSR) support
- Redirects and rewrites configuration

**Practical Applications:**
```yaml
# amplify.yml configuration
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build:prod
  artifacts:
    baseDirectory: dist/my-app
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*.js'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
    - pattern: '**/*.html'
      headers:
        - key: 'Cache-Control'
          value: 'no-cache'
```

**Best Practices:**
- Use feature branch deployments for testing
- Implement atomic deployments with instant rollback
- Configure custom headers for security and caching
- Use environment-specific configurations

---

### **Amazon CloudFront**
**Skill Level Required:** Advanced

**Key Concepts:**
- Distribution configuration and origins
- Edge locations and regional edge caches
- Cache behaviors and TTL management
- Lambda@Edge for edge computing
- CloudFront Functions (lightweight edge functions)
- Origin Access Identity (OAI) for S3 integration
- Custom SSL certificates
- Geo-restriction and geo-targeting
- Compression and HTTP/2 support
- Real-time logs and monitoring

**Practical Applications:**
```javascript
// CloudFront Function example for URL rewriting
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Redirect to index.html for SPA routing
    if (!uri.includes('.')) {
        request.uri = '/index.html';
    }
    
    return request;
}

// Lambda@Edge example for security headers
exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;
    
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubdomains; preload'
    }];
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    return response;
};
```

**Cache Optimization Strategy:**
```
/index.html              -> Cache-Control: no-cache
/assets/*.css            -> Cache-Control: max-age=31536000, immutable
/assets/*.js             -> Cache-Control: max-age=31536000, immutable
/assets/images/*         -> Cache-Control: max-age=86400
/api/*                   -> Cache-Control: no-cache
```

---

## 2. Content Delivery & Performance

### **CloudFront Edge Optimization**
**Advanced Techniques:**

**1. Origin Shield:**
- Additional caching layer between CloudFront and origin
- Reduces load on origin servers
- Improves cache hit ratio

**2. Response Timeout Configuration:**
```json
{
  "OriginReadTimeout": 30,
  "OriginKeepaliveTimeout": 5,
  "OriginConnectionAttempts": 3,
  "OriginConnectionTimeout": 10
}
```

**3. Field-Level Encryption:**
- Encrypt sensitive data at edge locations
- Additional security layer for PII

**4. CloudFront Functions Use Cases:**
- URL redirects and rewrites
- Header manipulation
- A/B testing
- Request validation
- Geographic routing

---

### **AWS Global Accelerator**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Static anycast IP addresses
- Automatic failover and health checks
- Improved performance for global users
- DDoS protection integration

**When to Use:**
- WebSocket connections
- Real-time applications
- Global user base
- Need for static IP addresses

---

## 3. Authentication & Authorization

### **Amazon Cognito**
**Skill Level Required:** Advanced

**Key Concepts:**
- User Pools for authentication
- Identity Pools for AWS resource access
- Social identity providers (Google, Facebook, Apple)
- SAML and OpenID Connect integration
- Multi-factor authentication (MFA)
- Custom authentication flows
- Lambda triggers for custom logic
- JWT token management
- User migration strategies
- Hosted UI customization

**Practical Implementation:**
```typescript
// Cognito User Pool configuration
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_XXXXXXXXX',
  ClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX'
};

const userPool = new CognitoUserPool(poolData);

// Sign in function
export function signIn(username: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        resolve({ accessToken, idToken, refreshToken });
      },
      onFailure: (err) => {
        reject(err);
      },
      mfaRequired: (codeDeliveryDetails) => {
        // Handle MFA
      }
    });
  });
}

// Refresh token function
export function refreshSession(): Promise<string> {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
        } else {
          cognitoUser.refreshSession(session.getRefreshToken(), (err, session) => {
            if (err) {
              reject(err);
            } else {
              resolve(session.getIdToken().getJwtToken());
            }
          });
        }
      });
    }
  });
}
```

**Advanced Features:**
```typescript
// Lambda trigger example - Pre-authentication
exports.handler = async (event) => {
  // Custom validation before authentication
  if (event.request.userAttributes.email.includes('blocked-domain.com')) {
    throw new Error('User from blocked domain');
  }
  
  return event;
};

// Lambda trigger - Post-authentication
exports.handler = async (event) => {
  // Log successful authentication
  console.log('User authenticated:', event.request.userAttributes.email);
  
  // Update user attributes
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      'custom:loginCount': String(parseInt(event.request.userAttributes['custom:loginCount'] || '0') + 1)
    }
  };
  
  return event;
};
```

---

### **AWS IAM (Identity and Access Management)**
**Skill Level Required:** Advanced

**Key Concepts:**
- IAM policies and permissions
- Roles and temporary credentials
- Service Control Policies (SCPs)
- Permission boundaries
- Cross-account access
- Policy evaluation logic
- Least privilege principle
- Resource-based policies vs identity-based policies

**Frontend-Relevant IAM Knowledge:**
```json
// Example: IAM policy for frontend S3 deployment
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-frontend-bucket/*",
        "arn:aws:s3:::my-frontend-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

---

## 4. Storage Solutions

### **Amazon S3 Advanced Features**
**Deep Dive:**

**1. S3 Storage Classes:**
- **S3 Standard:** Frequently accessed data
- **S3 Intelligent-Tiering:** Automatic cost optimization
- **S3 Standard-IA:** Infrequently accessed data
- **S3 One Zone-IA:** Lower-cost infrequent access
- **S3 Glacier:** Long-term archive
- **S3 Glacier Deep Archive:** Lowest cost archive

**2. S3 Event Notifications:**
```json
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "ImageUploadNotification",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789:function:ProcessImage",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "uploads/images/"
            },
            {
              "Name": "suffix",
              "Value": ".jpg"
            }
          ]
        }
      }
    }
  ]
}
```

**3. S3 Presigned URLs:**
```typescript
// Generate presigned URL for secure upload
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: 'us-east-1',
  signatureVersion: 'v4'
});

export function generatePresignedUploadUrl(fileName: string): Promise<string> {
  const params = {
    Bucket: 'my-upload-bucket',
    Key: `uploads/${Date.now()}-${fileName}`,
    Expires: 60 * 5, // 5 minutes
    ContentType: 'image/jpeg',
    ACL: 'private'
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
}

// Frontend usage
async function uploadFile(file: File) {
  const presignedUrl = await generatePresignedUploadUrl(file.name);
  
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
  
  if (response.ok) {
    console.log('Upload successful');
  }
}
```

---

### **AWS S3 Transfer Acceleration**
**Use Cases:**
- Large file uploads from global users
- Reduced latency for uploads
- Consistent upload performance

**Implementation:**
```javascript
const s3 = new AWS.S3({
  region: 'us-east-1',
  useAccelerateEndpoint: true
});
```

---

## 5. Serverless & APIs

### **AWS Lambda**
**Skill Level Required:** Advanced

**Key Concepts:**
- Function configuration and runtime selection
- Event sources and triggers
- Environment variables and secrets
- Cold starts and warm starts optimization
- Layers for shared dependencies
- Concurrency and throttling
- Error handling and retry logic
- Async invocation patterns
- Provisioned concurrency
- Lambda SnapStart (for Java)

**Frontend Integration:**
```typescript
// Invoke Lambda from frontend using AWS SDK
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({
  region: 'us-east-1',
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken
  }
});

export async function invokeLambda(functionName: string, payload: any) {
  const params = {
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(payload)
  };

  const response = await lambda.invoke(params).promise();
  return JSON.parse(response.Payload as string);
}
```

**Lambda Best Practices for Frontend Developers:**
- Keep functions small and focused
- Use environment variables for configuration
- Implement proper error handling
- Monitor cold start metrics
- Use Lambda Layers for large dependencies
- Implement idempotency for critical operations

---

### **Amazon API Gateway**
**Skill Level Required:** Advanced

**Key Concepts:**
- REST APIs vs HTTP APIs vs WebSocket APIs
- API stages and deployment
- Request/response transformations
- API throttling and rate limiting
- CORS configuration
- API keys and usage plans
- Request validation
- Caching strategies
- Custom domain names
- API Gateway Lambda authorizers
- API Gateway JWT authorizers

**Practical Configuration:**
```javascript
// CORS configuration for API Gateway
const corsConfig = {
  AllowOrigins: ['https://myapp.com'],
  AllowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  AllowHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
  MaxAge: 3600,
  AllowCredentials: true
};

// Request validation model
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "UserRequest",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    }
  },
  "required": ["email", "name"]
}
```

**API Gateway Integration Patterns:**
```typescript
// Custom authorizer example
export const handler = async (event: any) => {
  const token = event.authorizationToken;
  
  try {
    const decoded = verifyToken(token);
    
    return {
      principalId: decoded.userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      },
      context: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
```

---

### **AWS AppSync (GraphQL)**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- GraphQL schema design
- Resolvers (Lambda, DynamoDB, HTTP, RDS)
- Real-time subscriptions over WebSocket
- Offline sync capabilities
- Conflict resolution strategies
- Caching at the API level
- Fine-grained access control
- Data source mapping
- Pipeline resolvers
- VTL (Velocity Template Language)

**Implementation Example:**
```typescript
// AppSync client configuration
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql',
  headers: {
    'x-api-key': 'your-api-key'
  }
});

const wsLink = new WebSocketLink({
  uri: 'wss://your-appsync-endpoint.appsync-realtime-api.us-east-1.amazonaws.com/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-api-key': 'your-api-key'
      }
    }
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

// GraphQL subscription
const CHAT_SUBSCRIPTION = gql`
  subscription OnNewMessage($roomId: ID!) {
    onNewMessage(roomId: $roomId) {
      id
      content
      author
      timestamp
    }
  }
`;
```

---

## 6. CI/CD & DevOps

### **AWS CodePipeline**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Pipeline stages and actions
- Source providers (GitHub, CodeCommit, S3)
- Build integration (CodeBuild, Jenkins)
- Deploy integration (S3, CloudFront, ECS, Lambda)
- Manual approval stages
- Cross-region deployments
- Artifact storage
- Pipeline execution history

**Example Pipeline for Frontend:**
```yaml
# Pipeline stages
Stages:
  - Name: Source
    Actions:
      - Name: SourceAction
        ActionTypeId:
          Category: Source
          Owner: ThirdParty
          Provider: GitHub
          Version: 1
  
  - Name: Build
    Actions:
      - Name: BuildAction
        ActionTypeId:
          Category: Build
          Owner: AWS
          Provider: CodeBuild
          Version: 1
  
  - Name: Deploy
    Actions:
      - Name: DeployToS3
        ActionTypeId:
          Category: Deploy
          Owner: AWS
          Provider: S3
          Version: 1
      - Name: InvalidateCloudFront
        ActionTypeId:
          Category: Invoke
          Owner: AWS
          Provider: Lambda
          Version: 1
```

---

### **AWS CodeBuild**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- Build specifications (buildspec.yml)
- Docker images and custom build environments
- Environment variables and parameter store integration
- Artifact generation and storage
- Build caching for faster builds
- Build phases (install, pre_build, build, post_build)
- Build badges
- VPC configuration for private resources

**Buildspec Example:**
```yaml
version: 0.2

env:
  variables:
    NODE_ENV: production
  parameter-store:
    API_KEY: /production/api-key
  secrets-manager:
    DATABASE_URL: prod/db:connection-string

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo "Installing dependencies..."
      - npm ci
      
  pre_build:
    commands:
      - echo "Running linters..."
      - npm run lint
      - echo "Running unit tests..."
      - npm run test:ci
      
  build:
    commands:
      - echo "Building application..."
      - npm run build:prod
      - echo "Running e2e tests..."
      - npm run test:e2e
      
  post_build:
    commands:
      - echo "Build completed"
      - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"

artifacts:
  files:
    - '**/*'
  base-directory: dist
  name: frontend-build-$(date +%Y%m%d-%H%M%S)

cache:
  paths:
    - 'node_modules/**/*'
    - '.npm/**/*'

reports:
  test-reports:
    files:
      - 'coverage/lcov.info'
    file-format: 'CLOVERXML'
  coverage-reports:
    files:
      - 'coverage/**/*'
    file-format: 'COBERTURAXML'
```

---

### **AWS CodeDeploy**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Deployment types (in-place, blue/green)
- Deployment configurations
- Application specifications (appspec.yml)
- Lifecycle event hooks
- Automatic rollback
- Deployment groups
- Integration with Auto Scaling

---

### **AWS CodeCommit**
**Skill Level Required:** Basic to Intermediate

**Key Concepts:**
- Git repository hosting
- Branch and merge strategies
- Pull request reviews
- Triggers and notifications
- IAM integration for access control
- CodeGuru integration for code reviews

---

## 7. Monitoring & Logging

### **Amazon CloudWatch**
**Skill Level Required:** Advanced

**Key Concepts:**
- Metrics collection and custom metrics
- CloudWatch Logs and log groups
- Log Insights queries
- CloudWatch Alarms and notifications
- Dashboard creation
- CloudWatch Events (EventBridge)
- CloudWatch Synthetics for synthetic monitoring
- Real User Monitoring (RUM)
- Application Insights
- ServiceLens for distributed tracing

**Frontend Monitoring Setup:**
```typescript
// CloudWatch RUM setup
import { AwsRum } from 'aws-rum-web';

const config = {
  sessionSampleRate: 1,
  guestRoleArn: 'arn:aws:iam::123456789:role/RUM-Monitor-Role',
  identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
  telemetries: ['performance', 'errors', 'http'],
  allowCookies: true,
  enableXRay: true
};

const APPLICATION_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const APPLICATION_VERSION = '1.0.0';
const APPLICATION_REGION = 'us-east-1';

const awsRum = new AwsRum(
  APPLICATION_ID,
  APPLICATION_VERSION,
  APPLICATION_REGION,
  config
);

// Custom events
awsRum.recordEvent('user_action', {
  action: 'button_click',
  component: 'checkout',
  value: 'purchase'
});

// Error tracking
awsRum.recordError(new Error('Custom error message'));
```

**CloudWatch Logs Insights Queries:**
```sql
-- Find errors in the last hour
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100

-- Analyze API response times
fields @timestamp, responseTime
| filter requestType = "API"
| stats avg(responseTime), max(responseTime), min(responseTime) by bin(5m)

-- Find slow page loads
fields @timestamp, pageLoadTime, url
| filter pageLoadTime > 3000
| sort pageLoadTime desc
| limit 50
```

**Custom Metrics from Frontend:**
```typescript
import AWS from 'aws-sdk';

const cloudwatch = new AWS.CloudWatch({ region: 'us-east-1' });

export async function publishMetric(
  metricName: string,
  value: number,
  unit: string = 'None'
) {
  const params = {
    Namespace: 'Frontend/Performance',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
        Dimensions: [
          {
            Name: 'Environment',
            Value: process.env.NODE_ENV || 'production'
          },
          {
            Name: 'AppVersion',
            Value: process.env.APP_VERSION || '1.0.0'
          }
        ]
      }
    ]
  };

  try {
    await cloudwatch.putMetricData(params).promise();
  } catch (error) {
    console.error('Failed to publish metric:', error);
  }
}

// Usage
publishMetric('PageLoadTime', 1234, 'Milliseconds');
publishMetric('ApiResponseTime', 456, 'Milliseconds');
publishMetric('ErrorCount', 1, 'Count');
```

---

### **AWS X-Ray**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- Distributed tracing
- Service maps
- Trace analysis
- Annotations and metadata
- Sampling rules
- X-Ray daemon
- Integration with Lambda, API Gateway, AppSync
- Performance bottleneck identification

**Frontend Integration:**
```typescript
// X-Ray tracing for API calls
import AWSXRay from 'aws-xray-sdk-core';

// Instrument fetch requests
const tracedFetch = AWSXRay.captureAsyncFunc('fetch', async (url, options) => {
  return fetch(url, options);
});

// Usage
async function fetchUserData(userId: string) {
  const segment = AWSXRay.getSegment();
  const subsegment = segment.addNewSubsegment('getUserData');
  
  try {
    subsegment.addAnnotation('userId', userId);
    const response = await tracedFetch(`/api/users/${userId}`);
    const data = await response.json();
    subsegment.addMetadata('userRole', data.role);
    return data;
  } catch (error) {
    subsegment.addError(error);
    throw error;
  } finally {
    subsegment.close();
  }
}
```

---

### **AWS CloudTrail**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Audit logging for AWS API calls
- Event history
- Insights for unusual activity
- Integration with CloudWatch Logs
- Multi-region trails
- Organization trails
- Compliance and governance

**Use Cases for Frontend Developers:**
- Track who deployed frontend changes
- Audit S3 bucket access
- Monitor IAM policy changes
- Investigate security incidents

---

## 8. Security

### **AWS WAF (Web Application Firewall)**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- Web ACLs and rules
- Rate-based rules for DDoS protection
- Managed rule groups (OWASP Top 10, bot control)
- Custom rules with conditions
- IP set and regex pattern sets
- Geo-blocking
- Integration with CloudFront and API Gateway
- Request sampling and logging

**Common Rules Configuration:**
```json
{
  "Rules": [
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      }
    },
    {
      "Name": "GeoBlockRule",
      "Priority": 2,
      "Statement": {
        "GeoMatchStatement": {
          "CountryCodes": ["CN", "RU"]
        }
      },
      "Action": {
        "Block": {}
      }
    },
    {
      "Name": "SQLInjectionRule",
      "Priority": 3,
      "Statement": {
        "SqliMatchStatement": {
          "FieldToMatch": {
            "QueryString": {}
          },
          "TextTransformations": [
            {
              "Priority": 0,
              "Type": "URL_DECODE"
            }
          ]
        }
      },
      "Action": {
        "Block": {}
      }
    }
  ]
}
```

---

### **AWS Shield**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Shield Standard (automatic, free)
- Shield Advanced (paid, enhanced protection)
- DDoS protection for CloudFront, Route 53, ELB
- DDoS Response Team (DRT)
- Cost protection
- Attack notifications

---

### **AWS Secrets Manager**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Secure secret storage
- Automatic secret rotation
- Fine-grained access control
- Version management
- Cross-region replication
- Integration with RDS, Redshift, DocumentDB
- Secret retrieval in Lambda and ECS

**Usage in Build Process:**
```typescript
// Retrieve secrets during build
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName
      })
    );
    
    return response.SecretString || '';
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

// Usage in build script
const apiKey = await getSecret('prod/api-key');
process.env.API_KEY = apiKey;
```

---

### **AWS Systems Manager Parameter Store**
**Skill Level Required:** Basic to Intermediate

**Key Concepts:**
- Hierarchical parameter storage
- SecureString parameters (encrypted with KMS)
- Parameter versioning
- Parameter policies (expiration, notifications)
- Cost-effective alternative to Secrets Manager
- Integration with CI/CD pipelines

**Example Usage:**
```bash
# Store parameter
aws ssm put-parameter \
  --name "/myapp/prod/api-endpoint" \
  --value "https://api.production.com" \
  --type "String"

# Store encrypted parameter
aws ssm put-parameter \
  --name "/myapp/prod/api-key" \
  --value "super-secret-key" \
  --type "SecureString" \
  --key-id "alias/aws/ssm"

# Retrieve parameter
aws ssm get-parameter \
  --name "/myapp/prod/api-endpoint" \
  --query "Parameter.Value" \
  --output text

# Retrieve encrypted parameter
aws ssm get-parameter \
  --name "/myapp/prod/api-key" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text
```

---

### **AWS KMS (Key Management Service)**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Customer Master Keys (CMKs)
- Data encryption keys
- Envelope encryption
- Key policies and grants
- Automatic key rotation
- Multi-region keys
- Integration with S3, EBS, RDS, etc.

**Common Use Cases:**
- Encrypt environment variables
- Encrypt artifacts in S3
- Encrypt logs in CloudWatch
- Encrypt secrets in Secrets Manager

---

## 9. Database Services

### **Amazon DynamoDB**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- NoSQL database fundamentals
- Primary keys (partition key, sort key)
- Global Secondary Indexes (GSI)
- Local Secondary Indexes (LSI)
- DynamoDB Streams
- Time to Live (TTL)
- On-demand vs provisioned capacity
- DynamoDB Accelerator (DAX) for caching
- Transactions and batch operations
- PartiQL query language

**Frontend Integration:**
```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Put item
export async function saveUser(user: any) {
  const command = new PutCommand({
    TableName: 'Users',
    Item: {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString()
    }
  });
  
  await docClient.send(command);
}

// Get item
export async function getUser(userId: string) {
  const command = new GetCommand({
    TableName: 'Users',
    Key: { userId }
  });
  
  const response = await docClient.send(command);
  return response.Item;
}

// Query with GSI
export async function getUsersByEmail(email: string) {
  const command = new QueryCommand({
    TableName: 'Users',
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  });
  
  const response = await docClient.send(command);
  return response.Items;
}

// Update item
export async function updateUserName(userId: string, newName: string) {
  const command = new UpdateCommand({
    TableName: 'Users',
    Key: { userId },
    UpdateExpression: 'set #name = :name, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': newName,
      ':updatedAt': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  });
  
  const response = await docClient.send(command);
  return response.Attributes;
}
```

**DynamoDB Best Practices:**
- Design tables for access patterns, not normalization
- Use composite keys for flexible queries
- Leverage GSIs for additional query patterns
- Implement conditional writes for consistency
- Use batch operations for efficiency
- Monitor and optimize read/write capacity
- Implement caching layer (DAX or ElastiCache)

---

### **Amazon RDS (Relational Database Service)**
**Skill Level Required:** Basic to Intermediate

**Key Concepts:**
- Managed relational databases (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server)
- Multi-AZ deployments for high availability
- Read replicas for scaling
- Automated backups and snapshots
- Parameter groups and option groups
- RDS Proxy for connection pooling
- Performance Insights

**Frontend Developer Relevance:**
- Understanding database endpoints
- Connection string management
- Query performance optimization
- Database migration strategies

---

### **Amazon Aurora Serverless**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Auto-scaling database
- Pay per use pricing
- Automatic pause and resume
- Data API for HTTP-based access
- Compatible with MySQL and PostgreSQL

---

## 10. Advanced Services

### **Amazon EventBridge (formerly CloudWatch Events)**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- Event-driven architecture
- Event buses (default, custom, SaaS)
- Event rules and patterns
- Event transformations
- Schema registry
- Archive and replay
- Integration with AWS services and SaaS applications

**Example Use Cases:**
```json
// Event rule for frontend deployments
{
  "source": ["aws.codepipeline"],
  "detail-type": ["CodePipeline Pipeline Execution State Change"],
  "detail": {
    "state": ["SUCCEEDED"],
    "pipeline": ["frontend-pipeline"]
  }
}

// Custom event from frontend
{
  "source": "my-app.frontend",
  "detail-type": "UserAction",
  "detail": {
    "action": "purchase",
    "userId": "12345",
    "amount": 99.99
  }
}
```

---

### **Amazon SQS (Simple Queue Service)**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Standard queues vs FIFO queues
- Message visibility timeout
- Dead letter queues
- Long polling vs short polling
- Message attributes
- Queue policies
- Integration with Lambda

**Frontend Use Cases:**
- Asynchronous job processing
- Event queueing
- Decoupling microservices
- Background task handling

---

### **Amazon SNS (Simple Notification Service)**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Pub/Sub messaging
- Topics and subscriptions
- Message filtering
- Fanout pattern
- Mobile push notifications
- Email and SMS notifications
- HTTP/HTTPS endpoints

**Integration Example:**
```typescript
// Subscribe frontend to SNS topic via HTTP endpoint
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const client = new SNSClient({ region: 'us-east-1' });

export async function sendNotification(message: string, subject: string) {
  const command = new PublishCommand({
    TopicArn: 'arn:aws:sns:us-east-1:123456789:frontend-notifications',
    Message: message,
    Subject: subject,
    MessageAttributes: {
      priority: {
        DataType: 'String',
        StringValue: 'high'
      }
    }
  });
  
  await client.send(command);
}
```

---

### **Amazon ElastiCache**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Redis and Memcached support
- Cluster mode vs non-cluster mode
- Caching strategies (write-through, lazy loading)
- Session storage
- Real-time analytics
- Pub/Sub messaging with Redis

**Frontend Relevance:**
- API response caching
- Session management
- Rate limiting implementation
- Real-time features (with Redis Pub/Sub)

---

### **AWS Step Functions**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- State machines and workflows
- Standard vs Express workflows
- Task states, choice states, parallel states
- Error handling and retries
- Human approval steps
- Integration with Lambda, ECS, Batch, etc.
- Visual workflow designer

**Use Cases:**
- Complex deployment workflows
- Multi-step data processing
- Order processing pipelines
- Approval workflows

---

## 11. Cost Optimization

### **AWS Cost Management Skills**
**Essential Knowledge:**

**1. AWS Cost Explorer:**
- Visualize and analyze costs
- Create custom reports
- Forecast future costs
- Identify cost trends
- Tag-based cost allocation

**2. AWS Budgets:**
- Set custom budgets
- Alert notifications
- Cost and usage thresholds
- Budget actions (automated responses)

**3. AWS Trusted Advisor:**
- Cost optimization recommendations
- Idle resource identification
- Reserved instance recommendations
- Right-sizing suggestions

**4. Cost Optimization Strategies:**

```javascript
// S3 lifecycle policy for cost optimization
{
  "Rules": [
    {
      "Id": "MoveToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "STANDARD_IA"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}

// CloudFront cost optimization
// - Enable compression
// - Use Price Class (exclude expensive regions)
// - Implement proper caching
// - Use Origin Shield
```

**5. Reserved Capacity:**
- Reserved Instances for predictable workloads
- Savings Plans
- Spot Instances for flexible workloads

**6. Tagging Strategy:**
```json
{
  "Project": "MyApp",
  "Environment": "Production",
  "Owner": "FrontendTeam",
  "CostCenter": "Engineering",
  "Application": "WebApp"
}
```

---

## 12. Infrastructure as Code

### **AWS CloudFormation**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- Templates (JSON/YAML)
- Stacks and stack sets
- Parameters and outputs
- Conditions and mappings
- Nested stacks
- Change sets
- Drift detection
- Custom resources
- Stack policies

**Example Template:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Frontend Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues:
      - development
      - staging
      - production
  
  DomainName:
    Type: String
    Description: Custom domain name

Resources:
  # S3 Bucket for static hosting
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${Environment}-frontend-bucket'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      Tags:
        - Key: Environment
          Value: !Ref Environment

  # CloudFront Origin Access Identity
  CloudFrontOAI:
    Type: AWS::CloudFront::CloudFrontOriginAccessIdentity
    Properties:
      CloudFrontOriginAccessIdentityConfig:
        Comment: !Sub 'OAI for ${Environment} frontend'

  # Bucket Policy
  WebsiteBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref WebsiteBucket
      PolicyDocument:
        Statement:
          - Sid: AllowCloudFrontOAI
            Effect: Allow
            Principal:
              CanonicalUser: !GetAtt CloudFrontOAI.S3CanonicalUserId
            Action: 's3:GetObject'
            Resource: !Sub '${WebsiteBucket.Arn}/*'

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        HttpVersion: http2
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt WebsiteBucket.RegionalDomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CloudFrontOAI}'
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          CachedMethods:
            - GET
            - HEAD
          Compress: true
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none
          DefaultTTL: 86400
          MaxTTL: 31536000
          MinTTL: 0
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
          - ErrorCode: 403
            ResponseCode: 200
            ResponsePagePath: /index.html
        Aliases:
          - !Ref DomainName
        ViewerCertificate:
          AcmCertificateArn: !Ref ACMCertificate
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021

  # ACM Certificate
  ACMCertificate:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: !Ref DomainName
      ValidationMethod: DNS
      Tags:
        - Key: Environment
          Value: !Ref Environment

Outputs:
  BucketName:
    Description: S3 Bucket Name
    Value: !Ref WebsiteBucket
    Export:
      Name: !Sub '${AWS::StackName}-BucketName'
  
  CloudFrontDomain:
    Description: CloudFront Distribution Domain
    Value: !GetAtt CloudFrontDistribution.DomainName
    Export:
      Name: !Sub '${AWS::StackName}-CloudFrontDomain'
  
  DistributionId:
    Description: CloudFront Distribution ID
    Value: !Ref CloudFrontDistribution
    Export:
      Name: !Sub '${AWS::StackName}-DistributionId'
```

---

### **AWS CDK (Cloud Development Kit)**
**Skill Level Required:** Advanced

**Key Concepts:**
- Infrastructure as code using programming languages
- Constructs (L1, L2, L3)
- Stacks and apps
- Context and environment configuration
- Asset handling
- Custom constructs
- CDK Pipelines for CI/CD

**Example CDK Stack (TypeScript):**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

interface FrontendStackProps extends cdk.StackProps {
  domainName: string;
  hostedZoneId: string;
  certificateArn: string;
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // S3 bucket for website
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `${props.domainName}-frontend`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      lifecycleRules: [
        {
          noncurrentVersionExpiration: cdk.Duration.days(30)
        }
      ]
    });

    // CloudFront Origin Access Identity
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${props.domainName}`
    });

    websiteBucket.grantRead(oai);

    // Import existing certificate
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn
    );

    // CloudFront function for SPA routing
    const rewriteFunction = new cloudfront.Function(this, 'RewriteFunction', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;
          
          if (!uri.includes('.')) {
            request.uri = '/index.html';
          }
          
          return request;
        }
      `)
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: oai
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: rewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
          }
        ]
      },
      domainNames: [props.domainName],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0)
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0)
        }
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableLogging: true,
      logBucket: new s3.Bucket(this, 'LogsBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true
      })
    });

    // Deploy website files
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./dist')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
      cacheControl: [
        s3deploy.CacheControl.fromString('public, max-age=31536000, immutable')
      ],
      prune: true
    });

    // Route53 DNS record
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'HostedZone',
      {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.domainName
      }
    );

    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      )
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name'
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID'
    });

    new cdk.CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Domain Name'
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${props.domainName}`,
      description: 'Website URL'
    });
  }
}
```

---

### **AWS SAM (Serverless Application Model)**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Serverless infrastructure templates
- Lambda functions and APIs
- Event sources
- Local testing with SAM CLI
- Simplified CloudFormation syntax
- Built-in best practices

**Example SAM Template:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Serverless API for Frontend

Globals:
  Function:
    Runtime: nodejs18.x
    Timeout: 30
    Environment:
      Variables:
        STAGE: !Ref Stage
  Api:
    Cors:
      AllowOrigin: "'*'"
      AllowHeaders: "'Content-Type,Authorization'"
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"

Parameters:
  Stage:
    Type: String
    Default: prod

Resources:
  # API Gateway
  FrontendApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: !Ref Stage
      Auth:
        DefaultAuthorizer: CognitoAuthorizer
        Authorizers:
          CognitoAuthorizer:
            UserPoolArn: !GetAtt UserPool.Arn

  # Lambda Functions
  GetUsersFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: functions/get-users/
      Handler: index.handler
      Events:
        GetUsers:
          Type: Api
          Properties:
            RestApiId: !Ref FrontendApi
            Path: /users
            Method: GET
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref UsersTable

  CreateUserFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: functions/create-user/
      Handler: index.handler
      Events:
        CreateUser:
          Type: Api
          Properties:
            RestApiId: !Ref FrontendApi
            Path: /users
            Method: POST
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable

  # DynamoDB Table
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Stage}-users'
      AttributeDefinitions:
        - AttributeName: userId
          AttributeType: S
      KeySchema:
        - AttributeName: userId
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES

  # Cognito User Pool
  UserPool:
    Type: AWS::Cognito::UserPool
    Properties:
      UserPoolName: !Sub '${Stage}-user-pool'
      AutoVerifiedAttributes:
        - email
      Schema:
        - Name: email
          Required: true
          Mutable: false

  UserPoolClient:
    Type: AWS::Cognito::UserPoolClient
    Properties:
      ClientName: !Sub '${Stage}-client'
      UserPoolId: !Ref UserPool
      ExplicitAuthFlows:
        - ALLOW_USER_PASSWORD_AUTH
        - ALLOW_REFRESH_TOKEN_AUTH

Outputs:
  ApiEndpoint:
    Description: API Gateway endpoint URL
    Value: !Sub 'https://${FrontendApi}.execute-api.${AWS::Region}.amazonaws.com/${Stage}'
  
  UserPoolId:
    Description: Cognito User Pool ID
    Value: !Ref UserPool
  
  UserPoolClientId:
    Description: Cognito User Pool Client ID
    Value: !Ref UserPoolClient
```

---

### **Terraform for AWS (Alternative IaC)**
**Skill Level Required:** Intermediate to Advanced

**Key Concepts:**
- HCL (HashiCorp Configuration Language)
- State management
- Providers and modules
- Variables and outputs
- Workspaces
- Remote state backends
- Import existing resources

**Example Terraform Configuration:**
```hcl
# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# main.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "frontend/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = "Frontend"
    }
  }
}

# S3 bucket
resource "aws_s3_bucket" "website" {
  bucket = "${var.environment}-${var.domain_name}-frontend"
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront
resource "aws_cloudfront_origin_access_identity" "website" {
  comment = "OAI for ${var.domain_name}"
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = [var.domain_name]

  origin {
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.website.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.website.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# outputs.tf
output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.website.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}
```

---

## Additional Essential Skills

### **AWS CLI**
**Skill Level Required:** Intermediate

**Essential Commands:**
```bash
# S3 operations
aws s3 ls s3://my-bucket
aws s3 sync ./dist s3://my-bucket --delete --cache-control "max-age=31536000"
aws s3 cp file.txt s3://my-bucket/file.txt --acl public-read

# CloudFront operations
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
aws cloudfront list-distributions
aws cloudfront get-distribution --id DISTRIBUTION_ID

# Lambda operations
aws lambda invoke --function-name my-function --payload '{"key":"value"}' response.json
aws lambda list-functions
aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip

# CodeBuild operations
aws codebuild start-build --project-name my-project
aws codebuild batch-get-builds --ids BUILD_ID

# Systems Manager Parameter Store
aws ssm get-parameter --name "/myapp/config/api-key" --with-decryption
aws ssm put-parameter --name "/myapp/config/endpoint" --value "https://api.example.com" --type "String"

# Secrets Manager
aws secretsmanager get-secret-value --secret-id my-secret
aws secretsmanager create-secret --name my-secret --secret-string '{"key":"value"}'

# CloudWatch Logs
aws logs tail /aws/lambda/my-function --follow
aws logs filter-log-events --log-group-name /aws/lambda/my-function --filter-pattern "ERROR"

# Cognito
aws cognito-idp list-users --user-pool-id us-east-1_XXXXXXXXX
aws cognito-idp admin-create-user --user-pool-id POOL_ID --username user@example.com
```

---

### **AWS SDK for JavaScript**
**Skill Level Required:** Advanced

**Modern SDK v3 Usage:**
```typescript
// AWS SDK v3 - Modular imports
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Upload file
export async function uploadToS3(file: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'max-age=31536000',
    Metadata: {
      uploadedAt: new Date().toISOString()
    }
  });

  try {
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Generate presigned URL
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: key
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
```

---

### **AWS Organizations & Multi-Account Strategy**
**Skill Level Required:** Intermediate

**Key Concepts:**
- Organizational units (OUs)
- Service Control Policies (SCPs)
- Consolidated billing
- Cross-account access
- Resource sharing with AWS RAM
- Multi-account best practices

**Use Cases:**
- Separate dev, staging, production accounts
- Cost allocation by team/project
- Security isolation
- Compliance requirements

---

### **AWS Well-Architected Framework**
**Skill Level Required:** Advanced

**Six Pillars:**

1. **Operational Excellence:**
   - IaC implementation
   - CI/CD pipelines
   - Monitoring and observability
   - Incident response

2. **Security:**
   - IAM best practices
   - Data encryption
   - Network security
   - Compliance

3. **Reliability:**
   - High availability design
   - Disaster recovery
   - Auto-scaling
   - Backup strategies

4. **Performance Efficiency:**
   - Right-sizing resources
   - CDN usage
   - Caching strategies
   - Database optimization

5. **Cost Optimization:**
   - Resource rightsizing
   - Reserved capacity
   - Monitoring and analysis
   - Lifecycle policies

6. **Sustainability:**
   - Efficient resource usage
   - Minimize idle resources
   - Optimize data storage
   - Use managed services

---

## Interview Preparation

### **Common AWS Interview Questions for Senior Frontend Developers**

**Architecture & Design:**
1. How would you architect a highly available, globally distributed frontend application?
2. Explain your approach to implementing blue-green deployments for a frontend app
3. How do you handle cache invalidation in a CloudFront + S3 setup?
4. Design a CI/CD pipeline for a microf frontend architecture
5. How would you implement feature flags using AWS services?

**Security:**
1. Explain your strategy for securing API endpoints accessed from frontend
2. How do you implement authentication using Cognito?
3. What security headers would you configure in CloudFront?
4. How do you protect against DDoS attacks?
5. Explain the principle of least privilege in IAM

**Performance:**
1. How do you optimize CloudFront caching for a SPA?
2. Explain your strategy for reducing cold start times in Lambda
3. How do you implement lazy loading with S3 and CloudFront?
4. What metrics do you monitor for frontend performance?
5. How do you optimize bundle sizes and delivery?

**Cost Optimization:**
1. How do you reduce CloudFront costs?
2. Explain S3 storage class optimization
3. How do you monitor and control AWS costs?
4. What's your approach to right-sizing resources?

**Troubleshooting:**
1. How do you debug 403 errors from CloudFront?
2. Explain your approach to troubleshooting slow API responses
3. How do you diagnose S3 permission issues?
4. What tools do you use for log analysis?

---

## Learning Resources

### **Official AWS Resources:**
- AWS Documentation
- AWS Training and Certification
- AWS Well-Architected Labs
- AWS Solutions Library
- AWS Workshops
- AWS Architecture Center

### **Hands-on Practice:**
- AWS Free Tier (12 months free)
- AWS Cloud Quest (gamified learning)
- AWS Skill Builder
- A Cloud Guru / Linux Academy
- Udemy AWS courses

### **Certifications (Recommended Order):**
1. **AWS Certified Cloud Practitioner** (Entry level)
2. **AWS Certified Solutions Architect - Associate** (Essential)
3. **AWS Certified Developer - Associate** (Highly relevant)
4. **AWS Certified Solutions Architect - Professional** (Advanced)

### **Community & Forums:**
- AWS re:Post
- AWS Subreddit
- Stack Overflow AWS tags
- AWS User Groups
- AWS Summit and re:Invent conferences

---

## Practical Projects to Build Your Skills

### **Project 1: Static Website with CI/CD**
**Technologies:** S3, CloudFront, CodePipeline, CodeBuild
**Skills:** Static hosting, CDN, automated deployment
**Complexity:** Beginner

### **Project 2: Serverless SPA with Authentication**
**Technologies:** S3, CloudFront, Cognito, API Gateway, Lambda, DynamoDB
**Skills:** Authentication, serverless architecture, NoSQL
**Complexity:** Intermediate

### **Project 3: Real-time Chat Application**
**Technologies:** AppSync, Cognito, DynamoDB, S3, CloudFront
**Skills:** GraphQL, subscriptions, real-time updates
**Complexity:** Intermediate

### **Project 4: Multi-region, HA Frontend**
**Technologies:** S3, CloudFront, Route 53, Lambda@Edge, WAF
**Skills:** High availability, disaster recovery, edge computing
**Complexity:** Advanced

### **Project 5: Micro-frontend Architecture**
**Technologies:** Multiple S3 buckets, CloudFront, API Gateway, Lambda, ECS
**Skills:** Micro-frontends, orchestration, independent deployments
**Complexity:** Advanced

### **Project 6: Full-stack Serverless E-commerce**
**Technologies:** Amplify, AppSync, Cognito, Lambda, DynamoDB, S3, CloudFront, SQS, SNS
**Skills:** Complex serverless architecture, event-driven design, payment processing
**Complexity:** Advanced

---

## Summary: Core AWS Services Priority List

### **Must Know (Critical):**
1. S3 (Static hosting, presigned URLs)
2. CloudFront (CDN, caching, edge functions)
3. IAM (Policies, roles, permissions)
4. AWS CLI (Deployment, management)
5. CloudWatch (Monitoring, logging)
6. Cognito (Authentication)

### **Should Know (Important):**
1. API Gateway (REST/HTTP APIs)
2. Lambda (Serverless functions)
3. DynamoDB (NoSQL database)
4. CodePipeline (CI/CD)
5. CodeBuild (Build automation)
6. Amplify (Full-stack deployment)
7. Secrets Manager / Parameter Store
8. Route 53 (DNS)

### **Nice to Have (Beneficial):**
1. AppSync (GraphQL)
2. X-Ray (Distributed tracing)
3. WAF (Web Application Firewall)
4. CloudFormation / CDK (IaC)
5. ElastiCache (Caching layer)
6. SQS/SNS (Messaging)
7. Step Functions (Workflows)
8. EventBridge (Event-driven architecture)

---

## Final Tips for Senior Frontend Developers

1. **Think Beyond Frontend:**
   - Understand full architecture
   - Consider backend implications
   - Think about operations and maintenance

2. **Automation First:**
   - Automate everything possible
   - Use IaC for reproducibility
   - Implement comprehensive CI/CD

3. **Security by Default:**
   - Apply principle of least privilege
   - Encrypt sensitive data
   - Regular security audits
   - Keep dependencies updated

4. **Monitor Everything:**
   - Application performance
   - Error rates and patterns
   - Cost metrics
   - User experience metrics

5. **Optimize Continuously:**
   - Performance optimization
   - Cost optimization
   - User experience improvements
   - Code quality and maintainability

6. **Stay Current:**
   - Follow AWS updates
   - Attend conferences and webinars
   - Participate in communities
   - Experiment with new services

7. **Document Everything:**
   - Architecture decisions
   - Deployment procedures
   - Troubleshooting guides
   - Best practices

8. **Be Cost-Conscious:**
   - Understand pricing models
   - Implement proper monitoring
   - Optimize resource usage
   - Use appropriate service tiers

---

**Remember:** AWS is vast and constantly evolving. Focus on mastering core services first, then expand your knowledge based on your specific needs and interests. Hands-on practice is the best way to learn – build real projects and experiment with different services!






