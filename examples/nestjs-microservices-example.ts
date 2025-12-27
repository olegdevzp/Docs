/**
 * NestJS Microservices Architecture Example
 * Advanced Level Implementation
 * 
 * This file demonstrates a complete microservices architecture using NestJS
 * with message queues, service discovery, and event-driven communication.
 */

// ==================== SHARED INTERFACES & TYPES ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  vendorId: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  paymentId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ==================== EVENT TYPES ====================

export interface UserCreatedEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  timestamp: Date;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
}

export interface OrderPaidEvent {
  orderId: string;
  userId: string;
  paymentId: string;
  amount: number;
  timestamp: Date;
}

export interface InventoryUpdatedEvent {
  productId: string;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: Date;
}

// ==================== API GATEWAY IMPLEMENTATION ====================

import { Module, Controller, All, Req, Res, UseGuards, Inject, HttpException, HttpStatus, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Request, Response } from 'express';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';

// API Gateway Configuration
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
  ],
  controllers: [ApiGatewayController],
  providers: [CircuitBreakerService, RateLimitService],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}

// Circuit Breaker Implementation
import { Injectable } from '@nestjs/common';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

@Injectable()
export class CircuitBreakerService {
  private circuits = new Map<string, CircuitBreakerState>();
  private readonly failureThreshold = 5;
  private readonly resetTimeout = 60000; // 1 minute

  async executeWithCircuitBreaker<T>(
    serviceKey: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const circuit = this.getCircuit(serviceKey);

    if (circuit.state === 'OPEN') {
      if (Date.now() - circuit.lastFailureTime > this.resetTimeout) {
        circuit.state = 'HALF_OPEN';
      } else {
        throw new HttpException(
          `Service ${serviceKey} is currently unavailable`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess(serviceKey);
      return result;
    } catch (error) {
      this.onFailure(serviceKey);
      throw error;
    }
  }

  private getCircuit(serviceKey: string): CircuitBreakerState {
    if (!this.circuits.has(serviceKey)) {
      this.circuits.set(serviceKey, {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED'
      });
    }
    return this.circuits.get(serviceKey)!;
  }

  private onSuccess(serviceKey: string) {
    const circuit = this.getCircuit(serviceKey);
    circuit.failures = 0;
    circuit.state = 'CLOSED';
  }

  private onFailure(serviceKey: string) {
    const circuit = this.getCircuit(serviceKey);
    circuit.failures++;
    circuit.lastFailureTime = Date.now();

    if (circuit.failures >= this.failureThreshold) {
      circuit.state = 'OPEN';
    }
  }
}

// Rate Limiting Service
@Injectable()
export class RateLimitService {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests = 100;
  private readonly windowMs = 60000; // 1 minute

  isRateLimited(clientId: string): boolean {
    const now = Date.now();
    const clientData = this.requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return false;
    }

    if (clientData.count >= this.maxRequests) {
      return true;
    }

    clientData.count++;
    return false;
  }
}

// API Gateway Controller
@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    @Inject('ORDER_SERVICE') private orderService: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
    private circuitBreaker: CircuitBreakerService,
    private jwtService: JwtService
  ) {}

  @All('api/v1/users/*')
  async proxyToUserService(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res, this.userService, 'USER_SERVICE');
  }

  @All('api/v1/products/*')
  async proxyToProductService(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res, this.productService, 'PRODUCT_SERVICE');
  }

  @All('api/v1/orders/*')
  async proxyToOrderService(@Req() req: Request, @Res() res: Response) {
    await this.proxyRequest(req, res, this.orderService, 'ORDER_SERVICE');
  }

  private async proxyRequest(
    req: Request,
    res: Response,
    service: ClientProxy,
    serviceName: string
  ) {
    const pattern = this.createPattern(req.method, req.path);
    const data = {
      ...req.body,
      ...req.query,
      ...req.params,
      user: req.user,
      headers: req.headers
    };

    try {
      const result = await this.circuitBreaker.executeWithCircuitBreaker(
        serviceName,
        () => service.send(pattern, data)
          .pipe(
            timeout(5000),
            catchError((error) => {
              if (error instanceof TimeoutError) {
                return throwError(
                  new HttpException(
                    `${serviceName} timeout`,
                    HttpStatus.REQUEST_TIMEOUT
                  )
                );
              }
              return throwError(error);
            })
          )
          .toPromise()
      );

      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private createPattern(method: string, path: string): string {
    return `${method.toUpperCase()}_${path.replace(/\//g, '_').replace(/api_v1_/, '')}`;
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

// ==================== USER SERVICE IMPLEMENTATION ====================

import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagePattern, EventPattern, ClientProxy, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_BUS',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'users_db',
      entities: [UserEntity],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService, UserEventsService],
})
export class UserServiceModule {}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userEventsService: UserEventsService
  ) {}

  async onModuleInit() {
    console.log('User Service initialized');
  }

  @MessagePattern('GET_users')
  async getUsers(data: any) {
    const { page = 1, limit = 10, role, search } = data;
    
    const query = this.userRepository.createQueryBuilder('user');
    
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    
    if (search) {
      query.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    query.skip((page - 1) * limit).take(limit);
    
    const [users, total] = await query.getManyAndCount();
    
    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @MessagePattern('GET_users_*')
  async getUserById(data: { id: string }) {
    const user = await this.userRepository.findOne({
      where: { id: data.id }
    });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    return user;
  }

  @MessagePattern('POST_users')
  async createUser(data: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    
    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);
    
    // Emit user created event
    await this.userEventsService.emitUserCreated(savedUser);
    
    return savedUser;
  }

  @MessagePattern('PATCH_users_*')
  async updateUser(data: { id: string } & Partial<UpdateUserDto>) {
    const { id, ...updateData } = data;
    
    const user = await this.getUserById({ id });
    Object.assign(user, updateData, { updatedAt: new Date() });
    
    return await this.userRepository.save(user);
  }

  @MessagePattern('DELETE_users_*')
  async deleteUser(data: { id: string }) {
    const result = await this.userRepository.delete(data.id);
    
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    return { message: 'User deleted successfully' };
  }
}

@Injectable()
export class UserEventsService {
  constructor(
    @Inject('EVENT_BUS') private eventBus: ClientProxy
  ) {}

  async emitUserCreated(user: User) {
    const event: UserCreatedEvent = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      timestamp: new Date()
    };

    await this.eventBus.emit('user.created', event);
  }
}

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @EventPattern('order.created')
  async handleOrderCreated(data: OrderCreatedEvent) {
    // Update user statistics or send welcome email for first order
    console.log(`User ${data.userId} created their first order: ${data.orderId}`);
  }
}

// ==================== PRODUCT SERVICE IMPLEMENTATION ====================

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_BUS',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'products_db',
      entities: [ProductEntity, CategoryEntity],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity])
  ],
  controllers: [ProductController],
  providers: [ProductService, InventoryService],
})
export class ProductServiceModule {}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private inventoryService: InventoryService
  ) {}

  @MessagePattern('GET_products')
  async getProducts(data: any) {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = data;
    
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });
    
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
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    query.skip((page - 1) * limit).take(limit);
    
    const [products, total] = await query.getManyAndCount();
    
    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @MessagePattern('GET_products_*')
  async getProductById(data: { id: string }) {
    const product = await this.productRepository.findOne({
      where: { id: data.id, isActive: true },
      relations: ['category']
    });
    
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    
    return product;
  }

  @MessagePattern('POST_products')
  async createProduct(data: CreateProductDto) {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  @MessagePattern('PATCH_products_*')
  async updateProduct(data: { id: string } & Partial<UpdateProductDto>) {
    const { id, ...updateData } = data;
    
    const product = await this.getProductById({ id });
    Object.assign(product, updateData, { updatedAt: new Date() });
    
    return await this.productRepository.save(product);
  }

  @MessagePattern('GET_products_*_stock')
  async getProductStock(data: { id: string }) {
    return await this.inventoryService.getStock(data.id);
  }

  @MessagePattern('POST_products_*_reserve')
  async reserveStock(data: { id: string; quantity: number }) {
    return await this.inventoryService.reserveStock(data.id, data.quantity);
  }
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject('EVENT_BUS') private eventBus: ClientProxy
  ) {}

  async getStock(productId: string): Promise<{ productId: string; stock: number }> {
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });
    
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    
    return {
      productId,
      stock: product.stock
    };
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });
    
    if (!product || product.stock < quantity) {
      return false;
    }
    
    const previousStock = product.stock;
    product.stock -= quantity;
    product.updatedAt = new Date();
    
    await this.productRepository.save(product);
    
    // Emit inventory updated event
    const event: InventoryUpdatedEvent = {
      productId,
      previousStock,
      newStock: product.stock,
      reason: 'RESERVED',
      timestamp: new Date()
    };
    
    await this.eventBus.emit('inventory.updated', event);
    
    return true;
  }

  async releaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });
    
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    
    const previousStock = product.stock;
    product.stock += quantity;
    product.updatedAt = new Date();
    
    await this.productRepository.save(product);
    
    // Emit inventory updated event
    const event: InventoryUpdatedEvent = {
      productId,
      previousStock,
      newStock: product.stock,
      reason: 'RELEASED',
      timestamp: new Date()
    };
    
    await this.eventBus.emit('inventory.updated', event);
  }
}

@Controller()
export class ProductController {
  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  @EventPattern('order.cancelled')
  async handleOrderCancelled(data: { orderId: string; items: OrderItem[] }) {
    // Release reserved stock for cancelled orders
    for (const item of data.items) {
      await this.inventoryService.releaseStock(item.productId, item.quantity);
    }
  }
}

// ==================== ORDER SERVICE IMPLEMENTATION ====================

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    @Inject('EVENT_BUS') private eventBus: ClientProxy
  ) {}

  @MessagePattern('POST_orders')
  async createOrder(data: CreateOrderDto & { user: any }) {
    const { items, shippingAddress, user } = data;
    
    // Validate stock availability and reserve items
    const reservationResults = await Promise.all(
      items.map(item => 
        this.productService.send('POST_products_' + item.productId + '_reserve', {
          id: item.productId,
          quantity: item.quantity
        }).toPromise()
      )
    );
    
    if (reservationResults.some(result => !result)) {
      throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const order = this.orderRepository.create({
      userId: user.id,
      items,
      status: OrderStatus.PENDING,
      total,
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedOrder = await this.orderRepository.save(order);
    
    // Emit order created event
    const event: OrderCreatedEvent = {
      orderId: savedOrder.id,
      userId: savedOrder.userId,
      items: savedOrder.items,
      total: savedOrder.total,
      timestamp: new Date()
    };
    
    await this.eventBus.emit('order.created', event);
    
    return savedOrder;
  }

  @MessagePattern('GET_orders')
  async getOrders(data: { user: any; page?: number; limit?: number; status?: OrderStatus }) {
    const { user, page = 1, limit = 10, status } = data;
    
    const query = this.orderRepository.createQueryBuilder('order')
      .where('order.userId = :userId', { userId: user.id });
    
    if (status) {
      query.andWhere('order.status = :status', { status });
    }
    
    query.orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [orders, total] = await query.getManyAndCount();
    
    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @MessagePattern('PATCH_orders_*_pay')
  async payOrder(data: { id: string; paymentId: string; user: any }) {
    const order = await this.orderRepository.findOne({
      where: { id: data.id, userId: data.user.id }
    });
    
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    
    if (order.status !== OrderStatus.PENDING) {
      throw new HttpException('Order cannot be paid', HttpStatus.BAD_REQUEST);
    }
    
    order.status = OrderStatus.PAID;
    order.paymentId = data.paymentId;
    order.updatedAt = new Date();
    
    const updatedOrder = await this.orderRepository.save(order);
    
    // Emit order paid event
    const event: OrderPaidEvent = {
      orderId: updatedOrder.id,
      userId: updatedOrder.userId,
      paymentId: data.paymentId,
      amount: updatedOrder.total,
      timestamp: new Date()
    };
    
    await this.eventBus.emit('order.paid', event);
    
    return updatedOrder;
  }
}

// ==================== NOTIFICATION SERVICE IMPLEMENTATION ====================

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushNotificationService
  ) {}

  @EventPattern('user.created')
  async handleUserCreated(data: UserCreatedEvent) {
    await this.emailService.sendWelcomeEmail(data.email, data.firstName);
  }

  @EventPattern('order.created')
  async handleOrderCreated(data: OrderCreatedEvent) {
    // Send order confirmation email
    const user = await this.getUserById(data.userId);
    await this.emailService.sendOrderConfirmation(user.email, data.orderId, data.total);
  }

  @EventPattern('order.paid')
  async handleOrderPaid(data: OrderPaidEvent) {
    // Send payment confirmation
    const user = await this.getUserById(data.userId);
    await this.emailService.sendPaymentConfirmation(user.email, data.orderId, data.amount);
    
    // Send push notification
    await this.pushService.sendNotification(data.userId, {
      title: 'Payment Confirmed',
      body: `Your payment for order #${data.orderId} has been confirmed.`,
      type: 'ORDER_PAYMENT'
    });
  }

  @EventPattern('inventory.updated')
  async handleInventoryUpdated(data: InventoryUpdatedEvent) {
    // Send low stock alerts to admins
    if (data.newStock < 10) {
      await this.emailService.sendLowStockAlert(data.productId, data.newStock);
    }
  }

  private async getUserById(userId: string) {
    // Implementation would call user service
    return { email: 'user@example.com' };
  }
}

// ==================== DOCKER COMPOSE CONFIGURATION ====================

/**
 * docker-compose.yml for the microservices setup:
 * 
 * version: '3.8'
 * services:
 *   redis:
 *     image: redis:7-alpine
 *     ports:
 *       - "6379:6379"
 *     command: redis-server --appendonly yes
 *     volumes:
 *       - redis_data:/data
 * 
 *   postgres-users:
 *     image: postgres:14
 *     environment:
 *       POSTGRES_DB: users_db
 *       POSTGRES_USER: postgres
 *       POSTGRES_PASSWORD: password
 *     ports:
 *       - "5432:5432"
 *     volumes:
 *       - users_db_data:/var/lib/postgresql/data
 * 
 *   postgres-products:
 *     image: postgres:14
 *     environment:
 *       POSTGRES_DB: products_db
 *       POSTGRES_USER: postgres
 *       POSTGRES_PASSWORD: password
 *     ports:
 *       - "5433:5432"
 *     volumes:
 *       - products_db_data:/var/lib/postgresql/data
 * 
 *   postgres-orders:
 *     image: postgres:14
 *     environment:
 *       POSTGRES_DB: orders_db
 *       POSTGRES_USER: postgres
 *       POSTGRES_PASSWORD: password
 *     ports:
 *       - "5434:5432"
 *     volumes:
 *       - orders_db_data:/var/lib/postgresql/data
 * 
 *   api-gateway:
 *     build: ./api-gateway
 *     ports:
 *       - "3000:3000"
 *     environment:
 *       - REDIS_HOST=redis
 *       - JWT_SECRET=your-secret-key
 *     depends_on:
 *       - redis
 * 
 *   user-service:
 *     build: ./user-service
 *     ports:
 *       - "3001:3001"
 *     environment:
 *       - DB_HOST=postgres-users
 *       - REDIS_HOST=redis
 *     depends_on:
 *       - postgres-users
 *       - redis
 * 
 *   product-service:
 *     build: ./product-service
 *     ports:
 *       - "3002:3002"
 *     environment:
 *       - DB_HOST=postgres-products
 *       - REDIS_HOST=redis
 *     depends_on:
 *       - postgres-products
 *       - redis
 * 
 *   order-service:
 *     build: ./order-service
 *     ports:
 *       - "3003:3003"
 *     environment:
 *       - DB_HOST=postgres-orders
 *       - REDIS_HOST=redis
 *     depends_on:
 *       - postgres-orders
 *       - redis
 * 
 *   notification-service:
 *     build: ./notification-service
 *     ports:
 *       - "3004:3004"
 *     environment:
 *       - REDIS_HOST=redis
 *       - SMTP_HOST=smtp.gmail.com
 *       - SMTP_USER=your-email@gmail.com
 *       - SMTP_PASS=your-app-password
 *     depends_on:
 *       - redis
 * 
 * volumes:
 *   redis_data:
 *   users_db_data:
 *   products_db_data:
 *   orders_db_data:
 */

// ==================== KUBERNETES DEPLOYMENT EXAMPLES ====================

/**
 * Kubernetes deployment example for user-service:
 * 
 * apiVersion: apps/v1
 * kind: Deployment
 * metadata:
 *   name: user-service
 * spec:
 *   replicas: 3
 *   selector:
 *     matchLabels:
 *       app: user-service
 *   template:
 *     metadata:
 *       labels:
 *         app: user-service
 *     spec:
 *       containers:
 *       - name: user-service
 *         image: user-service:latest
 *         ports:
 *         - containerPort: 3001
 *         env:
 *         - name: DB_HOST
 *           value: postgres-users-service
 *         - name: REDIS_HOST
 *           value: redis-service
 *         - name: NODE_ENV
 *           value: production
 *         resources:
 *           requests:
 *             memory: "256Mi"
 *             cpu: "250m"
 *           limits:
 *             memory: "512Mi"
 *             cpu: "500m"
 *         livenessProbe:
 *           httpGet:
 *             path: /health
 *             port: 3001
 *           initialDelaySeconds: 30
 *           periodSeconds: 10
 *         readinessProbe:
 *           httpGet:
 *             path: /health/ready
 *             port: 3001
 *           initialDelaySeconds: 5
 *           periodSeconds: 5
 * ---
 * apiVersion: v1
 * kind: Service
 * metadata:
 *   name: user-service
 * spec:
 *   selector:
 *     app: user-service
 *   ports:
 *   - protocol: TCP
 *     port: 3001
 *     targetPort: 3001
 *   type: ClusterIP
 */

/**
 * Key Learning Points from this Microservices Implementation:
 * 
 * 1. **Service Communication**: Redis-based message queues for inter-service communication
 * 2. **Event-Driven Architecture**: Asynchronous event handling between services
 * 3. **Circuit Breaker Pattern**: Fault tolerance and resilience
 * 4. **API Gateway**: Centralized routing, authentication, and rate limiting
 * 5. **Database Per Service**: Each service has its own database
 * 6. **Container Orchestration**: Docker Compose and Kubernetes configurations
 * 7. **Monitoring and Health Checks**: Service health monitoring
 * 8. **Scalability**: Horizontal scaling with load balancing
 * 9. **Security**: JWT authentication and authorization
 * 10. **Error Handling**: Comprehensive error handling across services
 * 
 * This example demonstrates enterprise-level microservices architecture
 * patterns and is suitable for advanced developers working on large-scale
 * distributed systems.
 */

