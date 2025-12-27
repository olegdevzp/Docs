/**
 * Complete NestJS Task Manager Implementation
 * Junior Level Project Example
 * 
 * This file contains a complete implementation of a task management API
 * demonstrating basic NestJS concepts for junior developers.
 */

// ==================== INTERFACES ====================

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// ==================== DTOs ====================

import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsArray, ArrayMinSize } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  @IsOptional()
  @IsDateString()
  dueAfter?: string;
}

// ==================== SERVICE ====================

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    // Sample data for demonstration
    {
      id: '1',
      title: 'Setup development environment',
      description: 'Install Node.js, NestJS CLI, and configure database',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: ['setup', 'development'],
      dueDate: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Implement user authentication',
      description: 'Add JWT authentication with login and registration',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-10'),
      tags: ['auth', 'security'],
      dueDate: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all endpoints using Swagger',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      tags: ['documentation', 'api']
    }
  ];

  getAllTasks(filterDto: FilterTasksDto = {}): {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let filteredTasks = [...this.tasks];

    // Apply filters
    if (filterDto.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filterDto.status);
    }

    if (filterDto.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filterDto.priority);
    }

    if (filterDto.search) {
      const searchLower = filterDto.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    if (filterDto.tag) {
      filteredTasks = filteredTasks.filter(task =>
        task.tags.includes(filterDto.tag)
      );
    }

    if (filterDto.dueBefore) {
      const dueBeforeDate = new Date(filterDto.dueBefore);
      filteredTasks = filteredTasks.filter(task =>
        task.dueDate && task.dueDate <= dueBeforeDate
      );
    }

    if (filterDto.dueAfter) {
      const dueAfterDate = new Date(filterDto.dueAfter);
      filteredTasks = filteredTasks.filter(task =>
        task.dueDate && task.dueDate >= dueAfterDate
      );
    }

    // Apply sorting
    const { sortBy = 'createdAt', sortOrder = 'DESC' } = filterDto;
    filteredTasks.sort((a, b) => {
      let aValue = a[sortBy as keyof Task];
      let bValue = b[sortBy as keyof Task];

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const { page = 1, limit = 10 } = filterDto;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total: filteredTasks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTasks.length / limit)
    };
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {
      title,
      description = '',
      status = TaskStatus.PENDING,
      priority = TaskPriority.MEDIUM,
      dueDate,
      tags = []
    } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.getTaskById(id);
    
    // Validate status transition
    if (updateTaskDto.status && !this.isValidStatusTransition(task.status, updateTaskDto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${task.status} to ${updateTaskDto.status}`
      );
    }

    // Update task properties
    Object.keys(updateTaskDto).forEach(key => {
      if (updateTaskDto[key as keyof UpdateTaskDto] !== undefined) {
        if (key === 'dueDate') {
          task.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined;
        } else {
          (task as any)[key] = updateTaskDto[key as keyof UpdateTaskDto];
        }
      }
    });

    task.updatedAt = new Date();
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

  getTasksByPriority(priority: TaskPriority): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== TaskStatus.COMPLETED
    );
  }

  getTaskStatistics(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    overdue: number;
  } {
    const stats = {
      total: this.tasks.length,
      byStatus: {
        [TaskStatus.PENDING]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.COMPLETED]: 0
      },
      byPriority: {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0
      },
      overdue: this.getOverdueTasks().length
    };

    this.tasks.forEach(task => {
      stats.byStatus[task.status]++;
      stats.byPriority[task.priority]++;
    });

    return stats;
  }

  bulkUpdateTasks(ids: string[], updateDto: Partial<UpdateTaskDto>): Task[] {
    const updatedTasks: Task[] = [];
    
    ids.forEach(id => {
      try {
        const updatedTask = this.updateTask(id, updateDto);
        updatedTasks.push(updatedTask);
      } catch (error) {
        // Continue with other tasks if one fails
        console.error(`Failed to update task ${id}:`, error.message);
      }
    });

    return updatedTasks;
  }

  private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.PENDING, TaskStatus.COMPLETED],
      [TaskStatus.COMPLETED]: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]
    };

    return validTransitions[currentStatus].includes(newStatus);
  }
}

// ==================== CONTROLLER ====================

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
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Put,
  ParseArrayPipe
} from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: FilterTasksDto) {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get('/statistics')
  getStatistics() {
    return this.tasksService.getTaskStatistics();
  }

  @Get('/overdue')
  getOverdueTasks() {
    return this.tasksService.getOverdueTasks();
  }

  @Get('/status/:status')
  getTasksByStatus(@Param('status') status: TaskStatus) {
    return this.tasksService.getTasksByStatus(status);
  }

  @Get('/priority/:priority')
  getTasksByPriority(@Param('priority') priority: TaskPriority) {
    return this.tasksService.getTasksByPriority(priority);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Put('/bulk-update')
  @UsePipes(ValidationPipe)
  bulkUpdateTasks(
    @Body('ids', new ParseArrayPipe({ items: String })) ids: string[],
    @Body('updates') updates: Partial<UpdateTaskDto>
  ) {
    return this.tasksService.bulkUpdateTasks(ids, updates);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id') id: string) {
    this.tasksService.deleteTask(id);
  }
}

// ==================== MODULE ====================

import { Module } from '@nestjs/common';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService] // Export service if needed by other modules
})
export class TasksModule {}

// ==================== APP MODULE ====================

import { Module } from '@nestjs/common';

@Module({
  imports: [TasksModule],
})
export class AppModule {}

// ==================== MAIN.TS ====================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('A simple task management API built with NestJS')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true
  });

  await app.listen(3000);
  console.log('Task Manager API is running on http://localhost:3000');
  console.log('API Documentation available at http://localhost:3000/api-docs');
}

bootstrap();

// ==================== USAGE EXAMPLES ====================

/**
 * API Endpoints Usage Examples:
 * 
 * 1. Get all tasks with filtering:
 *    GET /tasks?status=PENDING&priority=HIGH&page=1&limit=10
 * 
 * 2. Create a new task:
 *    POST /tasks
 *    {
 *      "title": "New Task",
 *      "description": "Task description",
 *      "priority": "HIGH",
 *      "dueDate": "2024-02-01T10:00:00Z",
 *      "tags": ["urgent", "feature"]
 *    }
 * 
 * 3. Update a task:
 *    PATCH /tasks/123
 *    {
 *      "status": "IN_PROGRESS",
 *      "description": "Updated description"
 *    }
 * 
 * 4. Get task statistics:
 *    GET /tasks/statistics
 * 
 * 5. Get overdue tasks:
 *    GET /tasks/overdue
 * 
 * 6. Bulk update tasks:
 *    PUT /tasks/bulk-update
 *    {
 *      "ids": ["1", "2", "3"],
 *      "updates": { "status": "COMPLETED" }
 *    }
 * 
 * 7. Search tasks:
 *    GET /tasks?search=authentication&sortBy=dueDate&sortOrder=ASC
 */

/**
 * Key Learning Points from this Implementation:
 * 
 * 1. **NestJS Architecture**: Demonstrates the modular structure with controllers, services, and modules
 * 2. **DTOs and Validation**: Shows how to use class-validator for input validation
 * 3. **Error Handling**: Implements proper error handling with custom exceptions
 * 4. **Filtering and Pagination**: Advanced querying capabilities
 * 5. **Business Logic**: Status transitions and validation rules
 * 6. **API Design**: RESTful endpoints with proper HTTP status codes
 * 7. **Documentation**: Swagger integration for API documentation
 * 8. **TypeScript**: Strong typing throughout the application
 * 
 * This example serves as a comprehensive foundation for junior developers
 * to understand NestJS fundamentals and best practices.
 */

