# Comprehensive NestJS Projects by Level

This guide provides detailed NestJS project examples for junior, middle, and advanced developers, complete with code examples, project structures, and learning objectives.

## Table of Contents
- [Junior Level Projects](#junior-level-projects)
- [Middle Level Projects](#middle-level-projects)
- [Advanced Level Projects](#advanced-level-projects)
- [General Setup Guidelines](#general-setup-guidelines)

---

## Junior Level Projects

### 1. Task Management API (To-Do List)

**Learning Objectives:**
- Basic NestJS concepts (Controllers, Services, Modules)
- CRUD operations
- Data Transfer Objects (DTOs)
- Basic validation
- In-memory data storage

**Project Structure:**
```
task-manager/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── tasks/
│   │   ├── tasks.module.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   └── interfaces/
│   │       └── task.interface.ts
│   └── common/
│       └── pipes/
│           └── validation.pipe.ts
├── package.json
└── nest-cli.json
```

**Key Files:**

**src/tasks/interfaces/task.interface.ts**
```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
```

**src/tasks/dto/create-task.dto.ts**
```typescript
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.PENDING;
}
```

**src/tasks/tasks.service.ts**
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description, status = TaskStatus.PENDING } = createTaskDto;
    
    const task: Task = {
      id: uuid(),
      title,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.getTaskById(id);
    
    Object.assign(task, updateTaskDto, { updatedAt: new Date() });
    return task;
  }

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }
}
```

**src/tasks/tasks.controller.ts**
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query('status') status?: TaskStatus): Task[] {
    if (status) {
      return this.tasksService.getTasksByStatus(status);
    }
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Task {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
}
```

### 2. Simple Blog API

**Learning Objectives:**
- Module organization
- Basic authentication concepts
- File uploads
- Query parameters and filtering
- Error handling

**Key Features:**
- CRUD operations for posts
- Basic user management
- Comment system
- File upload for images
- Search and filtering

---

## Middle Level Projects

### 1. E-Commerce API with Authentication

**Learning Objectives:**
- JWT authentication and authorization
- Database integration (TypeORM/Prisma)
- Guards and middleware
- File uploads and image processing
- Advanced validation
- Relationships between entities
- Transaction handling

**Project Structure:**
```
ecommerce-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── entities/
│   │   │   ├── product.entity.ts
│   │   │   └── category.entity.ts
│   │   └── dto/
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── entities/
│   │       ├── order.entity.ts
│   │       └── order-item.entity.ts
│   └── common/
│       ├── decorators/
│       ├── filters/
│       ├── interceptors/
│       └── pipes/
├── package.json
└── nest-cli.json
```

**Key Files:**

**src/auth/auth.service.ts**
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    return await this.usersService.findById(payload.sub);
  }
}
```

**src/products/products.service.ts**
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(filterDto: FilterProductDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = filterDto;
    
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (category) {
      query.andWhere('category.name = :category', { category });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', 
        { search: `%${search}%` });
    }

    query.skip((page - 1) * limit).take(limit);

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
```

### 2. Real-Time Chat Application

**Learning Objectives:**
- WebSocket implementation
- Real-time communication
- Room management
- Message persistence
- Online user tracking
- File sharing in chat

**Key Features:**
- Multiple chat rooms
- Private messaging
- File uploads
- Message history
- User presence indicators
- Typing indicators

---

## Advanced Level Projects

### 1. Microservices Architecture with Message Queues

**Learning Objectives:**
- Microservices communication
- Message queues (Redis/RabbitMQ)
- Service discovery
- API Gateway pattern
- Distributed logging
- Health checks
- Circuit breaker pattern
- Event sourcing

**Project Structure:**
```
microservices-ecommerce/
├── api-gateway/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/
│   │   ├── proxy/
│   │   └── middleware/
│   └── package.json
├── user-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── users/
│   │   ├── events/
│   │   └── database/
│   └── package.json
├── product-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── products/
│   │   ├── inventory/
│   │   └── events/
│   └── package.json
├── order-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── orders/
│   │   ├── payments/
│   │   └── events/
│   └── package.json
├── notification-service/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── notifications/
│   │   ├── email/
│   │   └── sms/
│   └── package.json
├── docker-compose.yml
└── k8s/
    ├── deployments/
    ├── services/
    └── configmaps/
```

**Key Implementation - API Gateway:**

**api-gateway/src/app.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { HealthModule } from './health/health.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT) || 3001,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.PRODUCT_SERVICE_PORT) || 3002,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.ORDER_SERVICE_PORT) || 3003,
        },
      },
    ]),
    AuthModule,
    ProxyModule,
    HealthModule,
    LoggingModule,
  ],
})
export class AppModule {}
```

**api-gateway/src/proxy/proxy.controller.ts**
```typescript
import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';

@Controller()
export class ProxyController {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    @Inject('ORDER_SERVICE') private orderService: ClientProxy,
  ) {}

  @All('users/*')
  @UseGuards(JwtAuthGuard)
  async proxyToUserService(@Req() req: Request, @Res() res: Response) {
    const pattern = this.createPattern(req.method, req.path);
    const data = { ...req.body, ...req.query, ...req.params, user: req.user };

    try {
      const result = await this.userService
        .send(pattern, data)
        .pipe(
          timeout(5000),
          catchError((error) => {
            if (error instanceof TimeoutError) {
              return throwError(
                new HttpException(
                  'User service timeout',
                  HttpStatus.REQUEST_TIMEOUT,
                ),
              );
            }
            return throwError(error);
          }),
        )
        .toPromise();

      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  @All('products/*')
  async proxyToProductService(@Req() req: Request, @Res() res: Response) {
    const pattern = this.createPattern(req.method, req.path);
    const data = { ...req.body, ...req.query, ...req.params };

    try {
      const result = await this.productService
        .send(pattern, data)
        .pipe(timeout(5000))
        .toPromise();

      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  @All('orders/*')
  @UseGuards(JwtAuthGuard)
  async proxyToOrderService(@Req() req: Request, @Res() res: Response) {
    const pattern = this.createPattern(req.method, req.path);
    const data = { ...req.body, ...req.query, ...req.params, user: req.user };

    try {
      const result = await this.orderService
        .send(pattern, data)
        .pipe(timeout(5000))
        .toPromise();

      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private createPattern(method: string, path: string): string {
    return `${method.toUpperCase()}_${path.replace(/\//g, '_')}`;
  }

  private handleError(error: any, res: Response) {
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal server error';
    
    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Event-Driven Architecture Example:**

**order-service/src/events/order.events.ts**
```typescript
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class OrderEventsService {
  constructor(
    @Inject('EVENT_BUS') private eventBus: ClientProxy,
  ) {}

  async emitOrderCreated(order: Order) {
    await this.eventBus.emit('order.created', {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    });
  }

  async emitOrderPaid(order: Order) {
    await this.eventBus.emit('order.paid', {
      orderId: order.id,
      userId: order.userId,
      paymentId: order.paymentId,
      total: order.total,
    });
  }

  async emitOrderShipped(order: Order) {
    await this.eventBus.emit('order.shipped', {
      orderId: order.id,
      userId: order.userId,
      trackingNumber: order.trackingNumber,
      shippedAt: order.shippedAt,
    });
  }
}
```

### 2. Multi-Tenant SaaS Platform

**Learning Objectives:**
- Multi-tenancy patterns
- Database per tenant vs shared database
- Tenant isolation
- Custom domain handling
- Subscription management
- Feature flags
- Analytics and reporting
- Background job processing

**Key Features:**
- Tenant management
- Subscription billing
- Custom domains
- Role-based access control
- API rate limiting per tenant
- Usage analytics
- White-label customization

### 3. Real-Time Analytics Dashboard

**Learning Objectives:**
- Real-time data processing
- WebSocket scaling
- Time-series databases
- Data aggregation
- Caching strategies
- Performance monitoring
- Load balancing

**Key Features:**
- Real-time metrics collection
- Interactive dashboards
- Alert system
- Data visualization APIs
- Historical data analysis
- Custom report generation

---

## General Setup Guidelines

### Prerequisites
```bash
# Install Node.js (16+ recommended)
# Install NestJS CLI
npm i -g @nestjs/cli

# Create new project
nest new project-name

# Install common dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install class-validator class-transformer
npm install @nestjs/config
npm install bcrypt uuid
```

### Common Package.json Scripts
```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate -d src/database/data-source.ts",
    "migration:run": "npm run typeorm -- migration:run -d src/database/data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/database/data-source.ts"
  }
}
```

### Environment Configuration Template
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestjs_app

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis (for caching/sessions)
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# API
PORT=3000
API_PREFIX=api/v1
```

### Docker Compose for Development
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: nestjs_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Testing Strategy

**Unit Tests Example:**
```typescript
// tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const result = service.createTask(createTaskDto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(createTaskDto.title);
      expect(result.description).toBe(createTaskDto.description);
      expect(result.status).toBe(TaskStatus.PENDING);
    });
  });

  describe('getTaskById', () => {
    it('should throw NotFoundException for invalid ID', () => {
      expect(() => {
        service.getTaskById('invalid-id');
      }).toThrow(NotFoundException);
    });
  });
});
```

### Best Practices Summary

1. **Project Structure**: Follow NestJS conventions with modules, controllers, services
2. **Validation**: Use DTOs with class-validator for input validation
3. **Error Handling**: Implement global exception filters
4. **Security**: Use guards, JWT authentication, rate limiting
5. **Testing**: Write comprehensive unit and integration tests
6. **Documentation**: Use Swagger/OpenAPI for API documentation
7. **Logging**: Implement structured logging with correlation IDs
8. **Configuration**: Use environment variables and configuration modules
9. **Database**: Use migrations and proper entity relationships
10. **Performance**: Implement caching, pagination, and query optimization

This guide provides a solid foundation for NestJS development at all levels. Start with junior projects to master the basics, then progress to more complex architectures as your skills develop.
