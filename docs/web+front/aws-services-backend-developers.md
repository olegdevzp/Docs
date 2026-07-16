# Most Popular AWS Services for Backend Developers

A practical reference guide to the AWS services you will encounter most often as a backend engineer — what each service does, when to use it, key concepts, and common patterns.

Related guides: [AWS Skills for Senior Frontend Developer](aws-skills-senior-frontend-developer.md) · [AWS Learning Roadmap (Frontend)](aws-learning-roadmap-frontend.md)

---

## Table of Contents

1. [Compute](#1-compute)
   - [EC2 — Elastic Compute Cloud](#ec2--elastic-compute-cloud)
   - [AWS Lambda](#aws-lambda)
   - [ECS — Elastic Container Service](#ecs--elastic-container-service)
   - [EKS — Elastic Kubernetes Service](#eks--elastic-kubernetes-service)
   - [Elastic Beanstalk](#elastic-beanstalk)
2. [Storage](#2-storage)
   - [S3 — Simple Storage Service](#s3--simple-storage-service)
   - [EBS — Elastic Block Store](#ebs--elastic-block-store)
   - [EFS — Elastic File System](#efs--elastic-file-system)
3. [Databases](#3-databases)
   - [RDS — Relational Database Service](#rds--relational-database-service)
   - [Aurora](#aurora)
   - [DynamoDB](#dynamodb)
   - [ElastiCache](#elasticache)
   - [DocumentDB](#documentdb)
4. [Networking & API](#4-networking--api)
   - [VPC — Virtual Private Cloud](#vpc--virtual-private-cloud)
   - [API Gateway](#api-gateway)
   - [Elastic Load Balancing](#elastic-load-balancing)
   - [Route 53](#route-53)
   - [CloudFront](#cloudfront)
5. [Messaging & Event-Driven](#5-messaging--event-driven)
   - [SQS — Simple Queue Service](#sqs--simple-queue-service)
   - [SNS — Simple Notification Service](#sns--simple-notification-service)
   - [EventBridge](#eventbridge)
   - [Kinesis](#kinesis)
6. [Security & Identity](#6-security--identity)
   - [IAM — Identity and Access Management](#iam--identity-and-access-management)
   - [Secrets Manager](#secrets-manager)
   - [KMS — Key Management Service](#kms--key-management-service)
   - [Cognito](#cognito)
7. [Monitoring & Observability](#7-monitoring--observability)
   - [CloudWatch](#cloudwatch)
   - [X-Ray](#x-ray)
   - [CloudTrail](#cloudtrail)
8. [CI/CD & Developer Tools](#8-cicd--developer-tools)
   - [CodePipeline](#codepipeline)
   - [CodeBuild](#codebuild)
   - [CodeDeploy](#codedeploy)
   - [ECR — Elastic Container Registry](#ecr--elastic-container-registry)
9. [Infrastructure as Code](#9-infrastructure-as-code)
   - [CloudFormation](#cloudformation)
   - [CDK — Cloud Development Kit](#cdk--cloud-development-kit)
10. [Serverless & Orchestration](#10-serverless--orchestration)
    - [Step Functions](#step-functions)
    - [EventBridge Pipes](#eventbridge-pipes)
11. [Search & Analytics](#11-search--analytics)
    - [OpenSearch Service](#opensearch-service)
12. [Quick comparison tables](#quick-comparison-tables)

---

## 1. Compute

### EC2 — Elastic Compute Cloud

**What it is:** Virtual machines in the cloud. You choose OS, CPU, RAM, storage, and networking.

**When to use it:**
- Long-running services that need persistent processes
- Apps with specific OS/runtime requirements
- When you need full control over the environment
- Lift-and-shift from on-premise servers

**Key concepts:**

| Concept | Description |
|---|---|
| AMI | Amazon Machine Image — OS + pre-installed software snapshot |
| Instance type | Hardware profile (e.g. `t3.micro`, `c6g.2xlarge`) |
| Security Group | Stateful firewall — controls inbound/outbound traffic |
| Key Pair | SSH access credentials |
| User Data | Bootstrap script that runs on first launch |
| Auto Scaling Group | Automatically add/remove instances based on load |
| Spot Instances | Unused capacity at up to 90% discount (can be interrupted) |
| Reserved Instances | 1- or 3-year commitment for up to 72% savings |

**Common patterns:**
```bash
# Launch instance via CLI
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --user-data file://startup.sh

# SSH into instance
ssh -i ~/.ssh/my-key.pem ec2-user@<public-ip>

# Describe running instances
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"
```

**Instance family cheat-sheet:**

| Family | Optimized for | Example use case |
|---|---|---|
| `t3` / `t4g` | Burstable general purpose | Dev/staging, low-traffic APIs |
| `m6i` / `m7g` | Balanced compute/memory | Most production workloads |
| `c6i` / `c7g` | Compute-intensive | CPU-heavy processing, game servers |
| `r6i` / `r7g` | Memory-intensive | In-memory databases, caches |
| `i3` / `i4i` | Storage I/O | High-throughput databases |

**Gotchas:**
- Security Groups are stateful — if you allow inbound port 443, the response traffic is automatically allowed outbound.
- Stopping an instance does **not** reset the root EBS volume — storage costs continue.
- Spot Instance interruptions give only a 2-minute warning; design workloads to tolerate this.

---

### AWS Lambda

**What it is:** Serverless compute — run code without provisioning servers. You pay per invocation and execution duration.

**When to use it:**
- Event-driven workloads (S3 uploads, SQS messages, API calls)
- Infrequent or unpredictable traffic
- Background jobs, data processing pipelines
- Microservices with short execution times

**Key concepts:**

| Concept | Description |
|---|---|
| Handler | Entry point function called on each invocation |
| Event | JSON payload passed to the handler |
| Context | Runtime metadata (timeout, request ID, etc.) |
| Layers | Shared libraries / dependencies across functions |
| Provisioned Concurrency | Pre-warmed instances to eliminate cold starts |
| Dead Letter Queue | Destination for failed async invocations |
| Function URL | Built-in HTTPS endpoint (no API Gateway needed) |
| Destinations | Route async invocation results to SQS, SNS, EventBridge |

**Supported runtimes:** Node.js, Python, Java, Go, .NET, Ruby, custom runtime (any language via Lambda Runtime API)

**Example — Node.js handler:**
```javascript
// handler.js
export const handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event));

  // Process SQS records
  for (const record of event.Records ?? []) {
    const body = JSON.parse(record.body);
    await processMessage(body);
  }

  return { statusCode: 200, body: 'OK' };
};
```

**Limits to know:**

| Limit | Value |
|---|---|
| Max execution timeout | 15 minutes |
| Memory | 128 MB – 10 GB |
| Ephemeral storage (`/tmp`) | 512 MB – 10 GB |
| Deployment package size | 50 MB zipped / 250 MB unzipped |
| Concurrent executions (default) | 1000 per region (soft limit) |

**Gotchas:**
- Cold starts add latency, especially for JVM-based runtimes — use Provisioned Concurrency for latency-sensitive workloads.
- Lambda is **not** suitable for long-running tasks > 15 min — use ECS/Fargate or Step Functions instead.
- VPC-attached Lambdas incur additional cold start latency; use Lambda PrivateLink if possible.

---

### ECS — Elastic Container Service

**What it is:** Managed container orchestration service. Run Docker containers without managing a control plane. Supports two launch types: **EC2** (you manage the servers) and **Fargate** (serverless containers).

**When to use it:**
- Containerised microservices
- When you want Docker but not the complexity of Kubernetes
- Batch processing with containers

**Key concepts:**

| Concept | Description |
|---|---|
| Cluster | Logical grouping of tasks/services |
| Task Definition | Blueprint (image, CPU, memory, env vars, ports) |
| Task | Running instance of a Task Definition |
| Service | Keeps N tasks running, handles rolling deploys |
| Fargate | Serverless compute for containers — no EC2 management |
| Service Discovery | Auto-registers tasks in Route 53 / AWS Cloud Map |

**Example task definition (simplified):**
```json
{
  "family": "api-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/api:latest",
      "portMappings": [{ "containerPort": 3000 }],
      "environment": [{ "name": "NODE_ENV", "value": "production" }],
      "secrets": [
        { "name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/api-server",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Gotchas:**
- Fargate charges per vCPU-second and GB-second of memory — profile your container sizes carefully.
- Each Fargate task gets its own ENI (Elastic Network Interface); account-level ENI limits can become a bottleneck at scale.

---

### EKS — Elastic Kubernetes Service

**What it is:** Managed Kubernetes control plane. AWS handles etcd, API server, and control-plane upgrades. You manage worker nodes (EC2 or Fargate).

**When to use it:**
- Large-scale microservices already using Kubernetes
- Need advanced scheduling, custom operators, or Helm charts
- Multi-cloud strategy where Kubernetes portability matters

**Key concepts:**
- **Node Group** — pool of EC2 instances registered to the cluster
- **Managed Node Groups** — AWS handles node lifecycle (patch, replace)
- **Fargate Profile** — run pods serverlessly without managing nodes
- **Add-ons** — AWS-managed plugins (VPC CNI, CoreDNS, kube-proxy, EBS CSI driver)
- **IRSA** — IAM Roles for Service Accounts (pod-level IAM permissions)

**Gotchas:**
- EKS is significantly more complex to operate than ECS — only choose it if you genuinely need Kubernetes.
- Control plane costs ~$0.10/hr regardless of workload size.

---

### Elastic Beanstalk

**What it is:** PaaS layer on top of EC2, ELB, and Auto Scaling. Upload your code and Beanstalk handles provisioning, deployment, and health monitoring.

**When to use it:**
- Simple web apps / APIs where you want AWS-managed infrastructure
- Teams that don't have DevOps capacity for custom IaC
- Supported platforms: Node.js, Python, Java, .NET, PHP, Ruby, Go, Docker

**Gotchas:**
- Less flexible than raw EC2/ECS — can be hard to customise.
- Falling out of favour in greenfield projects; ECS/Fargate + CDK is usually preferred today.

---

## 2. Storage

### S3 — Simple Storage Service

**What it is:** Object storage with virtually unlimited capacity and 11 nines (99.999999999%) durability.

**When to use it (backend context):**
- File uploads from users (images, PDFs, videos)
- Static assets, build artefacts, deployment packages
- Data lake / data warehouse staging area
- Backup and archival
- Storing Lambda deployment packages and Layer zips

**Key concepts:**

| Concept | Description |
|---|---|
| Bucket | Top-level namespace; globally unique name |
| Object | Any file + its metadata |
| Prefix | Folder-like path segment (no real directories) |
| Storage Class | Tradeoff between cost and retrieval speed |
| Presigned URL | Time-limited URL to upload/download without AWS credentials |
| Lifecycle Policy | Auto-transition or delete objects based on age |
| S3 Event Notifications | Trigger Lambda/SQS/SNS on object events |
| Object Lock | WORM (Write Once Read Many) for compliance |
| Multipart Upload | Required for objects > 5 GB |

**Storage classes:**

| Class | Use case | Retrieval |
|---|---|---|
| Standard | Frequently accessed data | Instant |
| Intelligent-Tiering | Unknown access patterns | Instant |
| Standard-IA | Infrequently accessed, critical | Instant |
| One Zone-IA | Infrequent, non-critical | Instant |
| Glacier Instant Retrieval | Archives accessed ~once a quarter | Instant |
| Glacier Flexible Retrieval | Long-term archives | Minutes–hours |
| Glacier Deep Archive | Compliance / rarely accessed | Hours |

**Common patterns:**
```bash
# Generate a presigned URL (valid 1 hour) for a user upload
aws s3 presign s3://my-bucket/uploads/user-123/photo.jpg --expires-in 3600

# Server-side upload with metadata
aws s3 cp ./report.pdf s3://my-bucket/reports/ \
  --content-type application/pdf \
  --metadata "author=backend-service,version=1.2"

# Sync a directory (useful for deployment artefacts)
aws s3 sync ./dist s3://my-bucket/releases/v1.2.3/ --delete

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-bucket \
  --versioning-configuration Status=Enabled
```

---

### EBS — Elastic Block Store

**What it is:** Persistent block storage volumes attached to EC2 instances. Think of it as a network-attached SSD/HDD.

**When to use it:** Databases, file systems, or any workload that needs a traditional filesystem on EC2.

**Volume types:**

| Type | IOPS | Latency | Best for |
|---|---|---|---|
| `gp3` | Up to 16,000 | Low | General purpose (default choice) |
| `io2 Block Express` | Up to 256,000 | Sub-millisecond | High-performance databases |
| `st1` | Up to 500 MB/s throughput | Moderate | Big data, log processing |
| `sc1` | Up to 250 MB/s throughput | Higher | Cold data, backups |

**Gotchas:**
- EBS volumes exist in a single AZ — snapshots are needed for cross-AZ or cross-region recovery.
- `gp3` gives you 3,000 IOPS and 125 MB/s baseline without extra cost; prefer it over `gp2` for new volumes.

---

### EFS — Elastic File System

**What it is:** Managed NFS file system that can be mounted simultaneously by thousands of EC2 instances or Lambda functions across multiple AZs.

**When to use it:**
- Shared file storage between multiple instances (e.g. media files, shared configs)
- Lambda functions that need a persistent writable filesystem
- CMS or legacy apps that expect a shared NFS mount

**Gotchas:**
- EFS is priced per GB stored and is significantly more expensive per GB than S3 or EBS. Use only when you genuinely need shared POSIX filesystem semantics.

---

## 3. Databases

### RDS — Relational Database Service

**What it is:** Managed relational databases. AWS handles backups, patching, failover, and replication. Supported engines: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server.

**When to use it:** Traditional relational workloads — structured data, complex joins, ACID transactions.

**Key concepts:**

| Concept | Description |
|---|---|
| DB Instance | Single database server |
| Multi-AZ | Synchronous standby replica in a different AZ for automatic failover |
| Read Replica | Asynchronous read-only copy (can be cross-region) |
| Parameter Group | Database configuration settings |
| Subnet Group | VPC subnets where RDS can place instances |
| Automated Backups | Daily snapshot + transaction logs, retained up to 35 days |
| Performance Insights | Query-level performance monitoring |
| RDS Proxy | Connection pooler — reduces connection overhead for Lambda |

**Gotchas:**
- Always place RDS in **private subnets** — never expose it directly to the internet.
- Lambda → RDS connections can exhaust the database's connection limit at scale; use **RDS Proxy** to pool connections.
- Multi-AZ failover takes 60–120 seconds — design your app to retry on disconnect.

---

### Aurora

**What it is:** AWS-built cloud-native relational database. Compatible with MySQL and PostgreSQL. Offers significantly higher throughput and faster failover than standard RDS.

**When to use it:** Production relational workloads that need better performance, higher availability, or global distribution.

**Key advantages over RDS:**
- Storage auto-scales up to 128 TB in 10 GB increments
- Up to 15 read replicas (vs. 5 for RDS)
- Sub-10-second failover (vs. 60–120 s for RDS Multi-AZ)
- Aurora Serverless v2 — auto-scales capacity in fine-grained increments (0.5 ACU steps)
- Global Database — cross-region replication with < 1 second replication lag

**Aurora Serverless v2** is particularly useful for:
- Dev/test environments (scales to zero when idle)
- Unpredictable workloads
- Multi-tenant SaaS where each tenant has low, variable traffic

---

### DynamoDB

**What it is:** Fully managed, serverless NoSQL key-value and document database. Single-digit millisecond latency at any scale.

**When to use it:**
- High-throughput, low-latency applications (gaming, IoT, session stores)
- Flexible schemas or nested/hierarchical data
- Serverless architectures (scales automatically, no connection limits)
- Simple access patterns (look up by key)

**Key concepts:**

| Concept | Description |
|---|---|
| Table | Top-level container |
| Partition Key | Primary key used to distribute data across partitions |
| Sort Key | Optional secondary dimension; enables range queries |
| GSI (Global Secondary Index) | Index on non-key attributes; supports alternative access patterns |
| LSI (Local Secondary Index) | Alternative sort key; must be defined at table creation |
| On-Demand Capacity | Pay per request — good for unpredictable traffic |
| Provisioned Capacity | Fixed RCU/WCU — cheaper at predictable load |
| DynamoDB Streams | Change data capture — triggers Lambda on item changes |
| TTL | Auto-delete expired items (e.g. sessions, cache entries) |
| Transactions | ACID transactions across up to 100 items |

**Access pattern example:**
```javascript
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

// Write
await client.send(new PutItemCommand({
  TableName: 'Users',
  Item: marshall({ userId: 'u1', email: 'alice@example.com', createdAt: Date.now() }),
}));

// Read
const { Item } = await client.send(new GetItemCommand({
  TableName: 'Users',
  Key: marshall({ userId: 'u1' }),
}));
console.log(unmarshall(Item));
```

**Gotchas:**
- DynamoDB's access patterns must be designed **upfront** — adding new access patterns later requires new GSIs (which cost money) or table re-design.
- Hot partition keys cause throttling — never use timestamps or sequential IDs as partition keys without adding a random suffix.
- Each GSI replicates the entire table — storage and write costs multiply.

---

### ElastiCache

**What it is:** Managed in-memory caching. Supports two engines: **Redis** (most common) and **Memcached**.

**When to use it:**
- Session storage
- Database query result caching
- Rate limiting counters
- Pub/sub messaging (Redis)
- Leaderboards, sorted sets (Redis)

**Redis vs Memcached:**

| Feature | Redis | Memcached |
|---|---|---|
| Data structures | Rich (strings, lists, sets, sorted sets, hashes) | Strings only |
| Persistence | Optional (RDB/AOF) | No |
| Replication & failover | Yes (Cluster mode, Multi-AZ) | No |
| Pub/Sub | Yes | No |
| Scripting (Lua) | Yes | No |

**Gotchas:**
- ElastiCache clusters live inside your VPC — Lambda functions must also be VPC-attached to reach them (adds cold start latency).
- Redis Cluster mode changes how keys are distributed — some commands that span multiple keys break in cluster mode.

---

### DocumentDB

**What it is:** Managed MongoDB-compatible document database. Not built on MongoDB — it emulates the MongoDB 4.0 API on an Aurora-like storage engine.

**When to use it:** Teams migrating from MongoDB who want a managed AWS service. Be aware that it does not support all MongoDB features.

**Gotchas:**
- DocumentDB does not support the full MongoDB API — test your queries carefully before migrating.
- If you are starting fresh, DynamoDB or Aurora PostgreSQL (with JSONB) are often more cost-effective.

---

## 4. Networking & API

### VPC — Virtual Private Cloud

**What it is:** Your private, isolated network inside AWS. All other backend services live inside (or connect to) a VPC.

**Key concepts:**

| Concept | Description |
|---|---|
| Subnet | IP range within a VPC, scoped to one AZ |
| Public Subnet | Has a route to an Internet Gateway |
| Private Subnet | No route to the internet; access via NAT Gateway |
| Internet Gateway (IGW) | Allows public subnet resources to reach the internet |
| NAT Gateway | Allows private subnet resources to initiate outbound internet connections |
| Security Group | Stateful instance-level firewall |
| NACL | Stateless subnet-level firewall |
| VPC Peering | Direct private network connection between two VPCs |
| PrivateLink | Privately access AWS services / your services from another VPC |

**Standard 3-tier VPC layout:**
```
VPC (10.0.0.0/16)
├── Public Subnet AZ-a  (10.0.1.0/24)  → Load Balancer, NAT Gateway
├── Public Subnet AZ-b  (10.0.2.0/24)
├── Private Subnet AZ-a (10.0.11.0/24) → Application Servers (EC2 / ECS)
├── Private Subnet AZ-b (10.0.12.0/24)
├── Isolated Subnet AZ-a (10.0.21.0/24) → Databases (RDS, ElastiCache)
└── Isolated Subnet AZ-b (10.0.22.0/24)
```

**Gotchas:**
- NAT Gateway costs ~$0.045/hr + $0.045/GB — can be surprisingly expensive for data-heavy workloads. Use VPC Endpoints for S3 and DynamoDB to avoid NAT charges.
- Security Groups are the first line of defence — always apply the principle of least privilege.

---

### API Gateway

**What it is:** Managed service to create, publish, and secure HTTP/REST/WebSocket APIs. Often used as the frontend for Lambda functions or as a reverse proxy.

**Variants:**

| Type | Best for |
|---|---|
| REST API | Full-featured, supports usage plans, throttling, caching |
| HTTP API | Simpler, lower latency, 70% cheaper than REST API |
| WebSocket API | Persistent bi-directional connections (chat, real-time updates) |

**Common pattern — Lambda proxy integration:**
```javascript
// Lambda handler receiving API Gateway event
export const handler = async (event) => {
  const { httpMethod, path, body, queryStringParameters, headers } = event;

  const data = body ? JSON.parse(body) : {};

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'OK', received: data }),
  };
};
```

**Gotchas:**
- HTTP API v2 lacks some REST API features: no built-in response transformation, no AWS WAF integration (needs CloudFront in front), no caching.
- Default throttling: 10,000 requests/second per region (adjustable).
- Authorizers (Lambda or JWT) add latency on each request — use caching where possible.

---

### Elastic Load Balancing

**What it is:** Distribute traffic across multiple targets. Three types:

| Type | Operates at | Best for |
|---|---|---|
| ALB (Application) | HTTP/HTTPS (L7) | Microservices, path/host-based routing, gRPC |
| NLB (Network) | TCP/UDP (L4) | Ultra-low latency, millions of req/s, static IPs |
| GLB (Gateway) | IP (L3) | Inline network appliances (firewalls, IDS/IPS) |

**ALB key features:**
- Path-based routing (`/api/*` → Service A, `/admin/*` → Service B)
- Host-based routing (multi-tenant by subdomain)
- Native integration with ECS, EKS, Lambda, Cognito
- HTTP to HTTPS redirect
- Sticky sessions (via cookies)

**Gotchas:**
- ALB supports HTTP/2 between client and ALB, but proxies as HTTP/1.1 to targets by default.
- NLB preserves client IP; ALB adds it as `X-Forwarded-For`.

---

### Route 53

**What it is:** Highly available DNS service with health checks and traffic routing policies.

**Key routing policies:**

| Policy | Use case |
|---|---|
| Simple | Single resource |
| Weighted | A/B testing, gradual traffic migration |
| Latency | Route to lowest-latency region |
| Failover | Primary / standby active-passive |
| Geolocation | Serve different content by country |
| Geoproximity | Shift traffic between regions with a bias |
| Multivalue Answer | Return multiple IPs (basic load balancing) |

**Gotchas:**
- Route 53 health checks only work with public endpoints — use CloudWatch Alarms for private resources.
- TTL changes take time to propagate — lower TTLs before planned migrations.

---

### CloudFront

**What it is:** Global CDN with 450+ PoPs. Caches and serves content from edge locations close to users.

**Backend use cases:**
- Cache API responses (reduce origin load)
- Protect your origin (ALB or API Gateway stays private, only CloudFront has public access)
- DDoS mitigation via AWS Shield Standard (included free)
- Edge compute via **CloudFront Functions** or **Lambda@Edge**

---

## 5. Messaging & Event-Driven

### SQS — Simple Queue Service

**What it is:** Fully managed message queue. Producers write messages; consumers poll and process them.

**Queue types:**

| Type | Ordering | Deduplication | Throughput |
|---|---|---|---|
| Standard | Best-effort | Best-effort | Nearly unlimited |
| FIFO | Strict | Exactly-once | 3,000 msg/s with batching |

**Key concepts:**

| Concept | Description |
|---|---|
| Visibility Timeout | Period during which a received message is hidden from other consumers |
| Dead Letter Queue (DLQ) | Receives messages that fail processing after N attempts |
| Long Polling | Consumer waits up to 20 s for messages — reduces empty responses |
| Message Retention | 1 minute to 14 days (default 4 days) |
| Delay Queue | Delay message delivery by 0–900 seconds |

**Gotchas:**
- Standard queues can deliver a message **more than once** — make your consumers idempotent.
- Increasing `VisibilityTimeout` is essential for slow processors; if the timeout expires before processing finishes, the message becomes visible again and another consumer picks it up.

---

### SNS — Simple Notification Service

**What it is:** Managed pub/sub messaging. One message from a publisher fans out to multiple subscribers simultaneously.

**Supported subscribers:** SQS, Lambda, HTTP/HTTPS endpoints, Email, SMS, Mobile push

**Fan-out pattern (SNS → multiple SQS queues):**
```
Publisher → SNS Topic
              ├── SQS Queue A (Email service)
              ├── SQS Queue B (Analytics service)
              └── SQS Queue C (Audit log service)
```

This is the recommended pattern for durable fan-out: SNS delivers to SQS, and each service processes at its own pace with DLQ support.

---

### EventBridge

**What it is:** Serverless event bus. Routes events from AWS services, SaaS providers, or your own apps to targets based on rules.

**When to use it over SNS/SQS:**
- Content-based filtering (route events based on event payload fields)
- Integrating with AWS services and third-party SaaS (Stripe, Zendesk, etc.)
- Scheduled events (cron jobs) via **Scheduler**
- Event replay from archives

**Example rule — route only failed payments to a Lambda:**
```json
{
  "source": ["com.myapp.payments"],
  "detail-type": ["PaymentProcessed"],
  "detail": {
    "status": ["FAILED"]
  }
}
```

---

### Kinesis

**What it is:** Real-time data streaming service. Sub-second latency, ordered records per shard.

**Services in the Kinesis family:**

| Service | Description |
|---|---|
| Kinesis Data Streams | Low-level stream; consumers read raw records |
| Kinesis Data Firehose | Managed ETL pipeline → S3, Redshift, OpenSearch, Splunk |
| Kinesis Data Analytics | SQL/Flink queries on streaming data |

**When to use Kinesis vs SQS:**

| | Kinesis | SQS |
|---|---|---|
| Retention | 1–365 days | Up to 14 days |
| Multiple consumers | Yes (each reads independently) | No (message deleted after consume) |
| Ordering | Per shard | FIFO queue only |
| Latency | ~200 ms | ~1 s |
| Use case | Analytics, log ingestion, event sourcing | Task queues, job processing |

---

## 6. Security & Identity

### IAM — Identity and Access Management

**What it is:** Controls who (identity) can do what (permissions) on which AWS resources.

**Core entities:**

| Entity | Description |
|---|---|
| User | Long-term credential for a person or application |
| Group | Collection of users sharing the same policies |
| Role | Temporary credentials assumed by services, Lambda, EC2, etc. |
| Policy | JSON document defining Allow/Deny permissions |
| Instance Profile | Container that attaches a Role to an EC2 instance |

**Principle of least privilege:** every service, Lambda function, and EC2 instance should have **only** the permissions it needs — nothing more.

**Example — Lambda execution role policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
      "Resource": "arn:aws:sqs:us-east-1:123456789012:my-queue"
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

**Gotchas:**
- Never embed IAM access keys in application code or commit them to git — use IAM Roles instead.
- Use **IAM Access Analyzer** to identify overly permissive policies.
- Rotate access keys regularly; prefer short-lived credentials (Roles) wherever possible.

---

### Secrets Manager

**What it is:** Store, rotate, and retrieve secrets (database passwords, API keys, tokens) securely.

**Key features:**
- Automatic secret rotation via Lambda (built-in support for RDS, Redshift, DocumentDB)
- Cross-account access
- Fine-grained IAM policies per secret
- Encryption via KMS

**Retrieving a secret in Node.js:**
```javascript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

const { SecretString } = await client.send(
  new GetSecretValueCommand({ SecretId: 'prod/db/postgres' })
);
const { username, password } = JSON.parse(SecretString);
```

**Gotchas:**
- Each call to `GetSecretValue` costs money — cache secrets in memory (with a TTL) rather than fetching on every request.
- Secrets Manager vs **SSM Parameter Store**: Parameter Store is cheaper (free for standard parameters) but lacks built-in automatic rotation. Use Secrets Manager for credentials that rotate.

---

### KMS — Key Management Service

**What it is:** Managed service for creating and controlling encryption keys.

**When to use it:**
- Encrypt data in S3, RDS, EBS, DynamoDB, Secrets Manager (all integrate natively with KMS)
- Encrypt application-level data (envelope encryption)
- Meet compliance requirements (HIPAA, PCI-DSS, SOC 2)

**Key types:**
- **AWS Managed Keys** — AWS creates and manages on your behalf, free, but less control
- **Customer Managed Keys (CMK)** — You control rotation, access policy; $1/month per key
- **Data Keys** — Generated by KMS, used to encrypt actual data (envelope encryption pattern)

---

### Cognito

**What it is:** Managed user identity and authentication service.

**Two components:**
- **User Pools** — User directory with sign-up, sign-in, MFA, social login (Google, Facebook, Apple), SAML/OIDC federation. Issues JWT tokens.
- **Identity Pools** — Exchange tokens (from User Pools, Google, Facebook, etc.) for temporary AWS credentials. Use when users need to call AWS services directly (e.g. upload to S3).

**Backend integration pattern:**
```
Client → POST /login → Cognito User Pool → JWT tokens
Client → API Gateway (with Cognito Authorizer) → Lambda
```

---

## 7. Monitoring & Observability

### CloudWatch

**What it is:** Central observability service — metrics, logs, alarms, dashboards.

**Key sub-services:**

| Feature | Description |
|---|---|
| Metrics | Time-series data from AWS services + custom metrics |
| Logs | Centralised log storage; Log Groups → Log Streams |
| Log Insights | SQL-like query language for log analysis |
| Alarms | Alert and trigger actions when metrics cross thresholds |
| Dashboards | Visualise metrics and logs |
| Events / EventBridge | React to AWS service events |
| Container Insights | Enhanced metrics for ECS, EKS |
| Lambda Insights | Enhanced function-level metrics (duration, memory, cold starts) |

**Essential alarm pattern — Lambda error rate:**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "lambda-errors-high" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --dimensions Name=FunctionName,Value=my-function \
  --statistic Sum \
  --period 60 \
  --evaluation-periods 5 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
```

**Gotchas:**
- CloudWatch Logs charges for ingestion and storage — use log retention policies to avoid unbounded costs.
- Custom metrics cost $0.30 per metric per month — aggregate where possible.

---

### X-Ray

**What it is:** Distributed tracing service. Trace requests end-to-end across Lambda, API Gateway, ECS, RDS, DynamoDB, SQS, and more.

**When to use it:**
- Debugging latency issues across microservices
- Identifying bottlenecks in distributed systems
- Understanding which downstream calls are slowest

**Concepts:**
- **Trace** — End-to-end journey of a single request
- **Segment** — Work done by one service
- **Subsegment** — Finer-grained unit within a segment (e.g. a DB query)
- **Service Map** — Visual graph of all services and their connections

---

### CloudTrail

**What it is:** Records every API call made in your AWS account (who, what, when, from where).

**When to use it:**
- Security auditing and compliance
- Investigating unexpected changes to infrastructure
- Detecting compromised credentials

**Gotchas:**
- CloudTrail logs are stored in S3 — set up a CloudWatch Alarm on specific events (e.g. root account login, security group changes) for real-time alerting.

---

## 8. CI/CD & Developer Tools

### CodePipeline

**What it is:** Fully managed CI/CD pipeline orchestration. Connects source (CodeCommit, GitHub, S3) → build (CodeBuild) → deploy (CodeDeploy, ECS, Lambda, CloudFormation).

**When to use it:** When you want an entirely AWS-native CI/CD without managing Jenkins or GitHub Actions runners.

---

### CodeBuild

**What it is:** Managed build service. Runs your `buildspec.yml`, compiles code, runs tests, and produces artefacts.

**Example `buildspec.yml`:**
```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci
  build:
    commands:
      - npm run test
      - npm run build
artifacts:
  files:
    - '**/*'
  base-directory: dist
```

---

### CodeDeploy

**What it is:** Automates application deployments to EC2, on-premises servers, Lambda, and ECS.

**Deployment strategies:**

| Strategy | Description |
|---|---|
| In-Place | Stop → deploy → restart on same instances |
| Blue/Green | New instances receive traffic; old instances remain as rollback target |
| Canary | Route small % to new version, then 100% if successful |
| Linear | Shift traffic in equal increments over time |

---

### ECR — Elastic Container Registry

**What it is:** Managed Docker container image registry (like Docker Hub, but private and inside AWS).

**Common commands:**
```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build, tag, and push
docker build -t my-api .
docker tag my-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-api:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-api:latest
```

**Gotchas:**
- Enable **image scanning** (ECR Basic Scanning or Inspector) to catch vulnerabilities in dependencies.
- Set **lifecycle policies** to delete untagged/old images automatically — ECR storage is billed per GB.

---

## 9. Infrastructure as Code

### CloudFormation

**What it is:** AWS-native IaC. Define your infrastructure in YAML/JSON templates; CloudFormation creates and manages stacks.

**Key concepts:**

| Concept | Description |
|---|---|
| Stack | Deployed instance of a template |
| Change Set | Preview changes before applying |
| Parameters | Input values passed at deploy time |
| Outputs | Values exported from a stack (e.g. ARN, URL) |
| Nested Stacks | Reuse templates by embedding them |
| Stack Sets | Deploy a stack to multiple accounts/regions |

---

### CDK — Cloud Development Kit

**What it is:** Write your infrastructure in TypeScript, Python, Java, or Go. CDK synthesises CloudFormation templates under the hood.

**When to prefer CDK over raw CloudFormation:**
- You want loops, conditions, and abstractions (CloudFormation templates become very verbose)
- Your team is more comfortable with code than YAML
- You want to share infrastructure constructs as npm/pip packages

**Example — ECS Fargate service in CDK (TypeScript):**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });
const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'ApiService', {
  cluster,
  cpu: 512,
  memoryLimitMiB: 1024,
  taskImageOptions: {
    image: ecs.ContainerImage.fromAsset('./app'),
    containerPort: 3000,
  },
  desiredCount: 2,
  publicLoadBalancer: true,
});
```

---

## 10. Serverless & Orchestration

### Step Functions

**What it is:** Serverless workflow orchestration. Coordinate Lambda functions, ECS tasks, and other AWS services into multi-step workflows with built-in error handling, retries, and parallel execution.

**When to use it:**
- Long-running processes that exceed Lambda's 15-minute limit
- Workflows with conditional branching, parallel steps, or retries
- Order fulfilment, document processing, data pipelines

**State types:**

| State | Description |
|---|---|
| Task | Invoke a Lambda, ECS task, API, etc. |
| Choice | Conditional branching |
| Parallel | Run branches concurrently |
| Map | Iterate over an array |
| Wait | Pause for a duration or until a timestamp |
| Pass | Pass input to output (useful for transformations) |
| Succeed / Fail | Terminate the execution |

**Workflow modes:**
- **Standard** — Durable, exactly-once, up to 1 year; charged per state transition
- **Express** — High-throughput, at-least-once, up to 5 minutes; charged per execution duration

---

### EventBridge Pipes

**What it is:** Simplified point-to-point integration between event sources (SQS, DynamoDB Streams, Kinesis) and targets (Lambda, Step Functions, SQS, HTTP endpoints) with optional filtering and enrichment.

**When to use it over writing glue Lambda functions:** When you just need to forward/filter events between two services without custom business logic — Pipes handles the plumbing with zero code.

---

## 11. Search & Analytics

### OpenSearch Service

**What it is:** Managed OpenSearch (formerly Elasticsearch) cluster. Full-text search, log analytics, and dashboards (OpenSearch Dashboards / Kibana).

**When to use it:**
- Full-text search with relevance scoring
- Log aggregation and analysis (ELK-style stack)
- Time-series analytics
- Anomaly detection

**Common ingestion pattern:**
```
Application → CloudWatch Logs → Kinesis Firehose → OpenSearch
Application → Kinesis Data Streams → Lambda → OpenSearch
```

---

## Quick Comparison Tables

### Compute: When to choose what

| Scenario | Service |
|---|---|
| Full control, long-running, stateful process | EC2 |
| Event-driven, short functions, no server management | Lambda |
| Docker containers, no K8s overhead | ECS + Fargate |
| Kubernetes, multi-cloud, advanced scheduling | EKS |
| Simple web app, minimal DevOps | Elastic Beanstalk |

### Database: When to choose what

| Scenario | Service |
|---|---|
| Relational, complex queries, ACID | RDS (PostgreSQL / MySQL) |
| Relational, high throughput, auto-scaling storage | Aurora |
| Key-value / document, massive scale, serverless | DynamoDB |
| In-memory cache / session store | ElastiCache (Redis) |
| Full-text search, log analytics | OpenSearch |

### Messaging: When to choose what

| Scenario | Service |
|---|---|
| Decouple producer/consumer (task queue) | SQS |
| Fan-out to multiple subscribers | SNS |
| Content-based routing, SaaS events, scheduled jobs | EventBridge |
| Real-time data streaming, multiple consumers, ordering | Kinesis |
| Complex multi-step workflow with branching | Step Functions |

### Storage: When to choose what

| Scenario | Service |
|---|---|
| Object / file storage, user uploads | S3 |
| Block storage for EC2 (database, OS disk) | EBS |
| Shared file system across many instances | EFS |

---

*Last updated: July 2026*
