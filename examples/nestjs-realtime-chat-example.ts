/**
 * NestJS Real-Time Chat Application
 * Middle Level Project Example
 * 
 * This file demonstrates a complete real-time chat application using WebSockets,
 * room management, message persistence, and advanced features like typing indicators.
 */

// ==================== INTERFACES & TYPES ====================

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: RoomType;
  ownerId: string;
  participants: RoomParticipant[];
  settings: RoomSettings;
  createdAt: Date;
  updatedAt: Date;
}

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE'
}

export interface RoomParticipant {
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  isMuted: boolean;
  permissions: string[];
}

export enum ParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}

export interface RoomSettings {
  maxParticipants: number;
  allowFileUploads: boolean;
  messageRetentionDays: number;
  requireApproval: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  metadata?: MessageMetadata;
  replyToId?: string;
  editedAt?: Date;
  deletedAt?: Date;
  reactions: MessageReaction[];
  createdAt: Date;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
  VOICE = 'VOICE'
}

export interface MessageMetadata {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number; // for voice messages
  imageWidth?: number;
  imageHeight?: number;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  roomId: string;
  startedAt: Date;
}

// ==================== DTOs ====================

import { IsNotEmpty, IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(1000)
  maxParticipants?: number = 100;

  @IsOptional()
  @IsBoolean()
  allowFileUploads?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  messageRetentionDays?: number = 30;
}

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType = MessageType.TEXT;

  @IsOptional()
  @IsString()
  replyToId?: string;

  @IsOptional()
  metadata?: MessageMetadata;
}

export class JoinRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(1000)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  allowFileUploads?: boolean;
}

// ==================== WEBSOCKET GATEWAY ====================

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { socketId: string; userId: string; rooms: Set<string> }>();
  private typingUsers = new Map<string, Set<string>>(); // roomId -> Set of userIds

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  afterInit(server: Server) {
    console.log('Chat WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Authenticate user from JWT token
      const token = client.handshake.auth.token;
      const user = await this.userService.validateToken(token);
      
      if (!user) {
        client.disconnect();
        return;
      }

      // Store connection
      this.connectedUsers.set(client.id, {
        socketId: client.id,
        userId: user.id,
        rooms: new Set(),
      });

      // Update user online status
      await this.userService.updateOnlineStatus(user.id, true);

      // Join user to their rooms
      const userRooms = await this.chatService.getUserRooms(user.id);
      for (const room of userRooms) {
        client.join(room.id);
        this.connectedUsers.get(client.id)?.rooms.add(room.id);
        
        // Notify room members that user is online
        client.to(room.id).emit('user-online', {
          userId: user.id,
          username: user.username,
        });
      }

      console.log(`User ${user.username} connected with socket ${client.id}`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const connection = this.connectedUsers.get(client.id);
    if (!connection) return;

    try {
      // Update user offline status
      await this.userService.updateOnlineStatus(connection.userId, false);

      // Remove from typing indicators
      for (const roomId of connection.rooms) {
        this.removeTypingIndicator(roomId, connection.userId);
      }

      // Notify room members that user is offline
      for (const roomId of connection.rooms) {
        client.to(roomId).emit('user-offline', {
          userId: connection.userId,
        });
      }

      this.connectedUsers.delete(client.id);
      console.log(`User disconnected: ${client.id}`);
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  }

  @SubscribeMessage('join-room')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const connection = this.connectedUsers.get(client.id);
      if (!connection) return;

      const room = await this.chatService.joinRoom(connection.userId, data.roomId, data.password);
      
      client.join(data.roomId);
      connection.rooms.add(data.roomId);

      // Send recent messages to the user
      const recentMessages = await this.messageService.getRecentMessages(data.roomId, 50);
      client.emit('room-messages', {
        roomId: data.roomId,
        messages: recentMessages,
      });

      // Notify other room members
      client.to(data.roomId).emit('user-joined', {
        userId: connection.userId,
        roomId: data.roomId,
      });

      return { success: true, room };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const connection = this.connectedUsers.get(client.id);
    if (!connection) return;

    client.leave(data.roomId);
    connection.rooms.delete(data.roomId);

    // Remove typing indicator if exists
    this.removeTypingIndicator(data.roomId, connection.userId);

    // Notify other room members
    client.to(data.roomId).emit('user-left', {
      userId: connection.userId,
      roomId: data.roomId,
    });

    await this.chatService.leaveRoom(connection.userId, data.roomId);
  }

  @SubscribeMessage('send-message')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const connection = this.connectedUsers.get(client.id);
      if (!connection) return;

      // Check if user is in the room
      if (!connection.rooms.has(data.roomId)) {
        throw new Error('User is not in this room');
      }

      // Save message to database
      const message = await this.messageService.createMessage({
        ...data,
        senderId: connection.userId,
      });

      // Remove typing indicator
      this.removeTypingIndicator(data.roomId, connection.userId);

      // Broadcast message to room members
      this.server.to(data.roomId).emit('new-message', message);

      return { success: true, message };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('edit-message')
  async handleEditMessage(
    @MessageBody() data: { messageId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const connection = this.connectedUsers.get(client.id);
      if (!connection) return;

      const editedMessage = await this.messageService.editMessage(
        data.messageId,
        connection.userId,
        data.content,
      );

      // Broadcast edited message
      this.server.to(editedMessage.roomId).emit('message-edited', editedMessage);

      return { success: true, message: editedMessage };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('delete-message')
  async handleDeleteMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const connection = this.connectedUsers.get(client.id);
      if (!connection) return;

      const deletedMessage = await this.messageService.deleteMessage(
        data.messageId,
        connection.userId,
      );

      // Broadcast message deletion
      this.server.to(deletedMessage.roomId).emit('message-deleted', {
        messageId: data.messageId,
        roomId: deletedMessage.roomId,
      });

      return { success: true };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('add-reaction')
  async handleAddReaction(
    @MessageBody() data: { messageId: string; emoji: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const connection = this.connectedUsers.get(client.id);
      if (!connection) return;

      const updatedMessage = await this.messageService.addReaction(
        data.messageId,
        connection.userId,
        data.emoji,
      );

      // Broadcast reaction update
      this.server.to(updatedMessage.roomId).emit('reaction-added', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId: connection.userId,
      });

      return { success: true };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing-start')
  async handleTypingStart(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const connection = this.connectedUsers.get(client.id);
    if (!connection || !connection.rooms.has(data.roomId)) return;

    // Add to typing indicators
    if (!this.typingUsers.has(data.roomId)) {
      this.typingUsers.set(data.roomId, new Set());
    }
    this.typingUsers.get(data.roomId)?.add(connection.userId);

    // Broadcast typing indicator to others in the room
    client.to(data.roomId).emit('user-typing', {
      userId: connection.userId,
      roomId: data.roomId,
    });

    // Auto-remove typing indicator after 3 seconds
    setTimeout(() => {
      this.removeTypingIndicator(data.roomId, connection.userId);
    }, 3000);
  }

  @SubscribeMessage('typing-stop')
  async handleTypingStop(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const connection = this.connectedUsers.get(client.id);
    if (!connection) return;

    this.removeTypingIndicator(data.roomId, connection.userId);
  }

  private removeTypingIndicator(roomId: string, userId: string) {
    const typingInRoom = this.typingUsers.get(roomId);
    if (typingInRoom && typingInRoom.has(userId)) {
      typingInRoom.delete(userId);
      
      // Broadcast that user stopped typing
      this.server.to(roomId).emit('user-stopped-typing', {
        userId,
        roomId,
      });

      // Clean up empty sets
      if (typingInRoom.size === 0) {
        this.typingUsers.delete(roomId);
      }
    }
  }
}

// ==================== CHAT SERVICE ====================

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private roomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(RoomParticipantEntity)
    private participantRepository: Repository<RoomParticipantEntity>,
  ) {}

  async createRoom(ownerId: string, createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const room = this.roomRepository.create({
      ...createRoomDto,
      ownerId,
      settings: {
        maxParticipants: createRoomDto.maxParticipants || 100,
        allowFileUploads: createRoomDto.allowFileUploads ?? true,
        messageRetentionDays: createRoomDto.messageRetentionDays || 30,
        requireApproval: false,
      },
    });

    const savedRoom = await this.roomRepository.save(room);

    // Add owner as participant
    await this.addParticipant(savedRoom.id, ownerId, ParticipantRole.OWNER);

    return savedRoom;
  }

  async joinRoom(userId: string, roomId: string, password?: string): Promise<ChatRoom> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['participants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is already in the room
    const existingParticipant = room.participants.find(p => p.userId === userId);
    if (existingParticipant) {
      return room;
    }

    // Check room capacity
    if (room.participants.length >= room.settings.maxParticipants) {
      throw new ForbiddenException('Room is full');
    }

    // Add user as participant
    await this.addParticipant(roomId, userId, ParticipantRole.MEMBER);

    return room;
  }

  async leaveRoom(userId: string, roomId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { userId, roomId },
    });

    if (participant) {
      await this.participantRepository.remove(participant);
    }
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    const participants = await this.participantRepository.find({
      where: { userId },
      relations: ['room'],
    });

    return participants.map(p => p.room);
  }

  async getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
    const participants = await this.participantRepository.find({
      where: { roomId },
      relations: ['user'],
    });

    return participants;
  }

  async updateRoom(roomId: string, userId: string, updateRoomDto: UpdateRoomDto): Promise<ChatRoom> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['participants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user has permission to update room
    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || ![ParticipantRole.OWNER, ParticipantRole.ADMIN].includes(participant.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    Object.assign(room, updateRoomDto, { updatedAt: new Date() });
    return await this.roomRepository.save(room);
  }

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['participants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Only owner can delete room
    if (room.ownerId !== userId) {
      throw new ForbiddenException('Only room owner can delete the room');
    }

    await this.roomRepository.remove(room);
  }

  private async addParticipant(roomId: string, userId: string, role: ParticipantRole): Promise<void> {
    const participant = this.participantRepository.create({
      roomId,
      userId,
      role,
      joinedAt: new Date(),
      isMuted: false,
      permissions: this.getDefaultPermissions(role),
    });

    await this.participantRepository.save(participant);
  }

  private getDefaultPermissions(role: ParticipantRole): string[] {
    switch (role) {
      case ParticipantRole.OWNER:
        return ['send_messages', 'delete_messages', 'manage_participants', 'manage_room'];
      case ParticipantRole.ADMIN:
        return ['send_messages', 'delete_messages', 'manage_participants'];
      case ParticipantRole.MODERATOR:
        return ['send_messages', 'delete_messages'];
      case ParticipantRole.MEMBER:
        return ['send_messages'];
      default:
        return [];
    }
  }
}

// ==================== MESSAGE SERVICE ====================

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(MessageReactionEntity)
    private reactionRepository: Repository<MessageReactionEntity>,
  ) {}

  async createMessage(data: SendMessageDto & { senderId: string }): Promise<Message> {
    const message = this.messageRepository.create({
      ...data,
      reactions: [],
      createdAt: new Date(),
    });

    return await this.messageRepository.save(message);
  }

  async getRecentMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { roomId, deletedAt: null },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['reactions', 'sender'],
    });
  }

  async getMessageHistory(
    roomId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ messages: Message[]; total: number; hasMore: boolean }> {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { roomId, deletedAt: null },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['reactions', 'sender'],
    });

    return {
      messages: messages.reverse(), // Return in chronological order
      total,
      hasMore: page * limit < total,
    };
  }

  async editMessage(messageId: string, userId: string, newContent: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, senderId: userId, deletedAt: null },
    });

    if (!message) {
      throw new NotFoundException('Message not found or cannot be edited');
    }

    message.content = newContent;
    message.editedAt = new Date();

    return await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['room', 'room.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user can delete message (own message or has permissions)
    const canDelete = message.senderId === userId || 
                     message.room.participants.some(p => 
                       p.userId === userId && 
                       p.permissions.includes('delete_messages')
                     );

    if (!canDelete) {
      throw new ForbiddenException('Cannot delete this message');
    }

    message.deletedAt = new Date();
    return await this.messageRepository.save(message);
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, deletedAt: null },
      relations: ['reactions'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.userId === userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      await this.reactionRepository.remove(existingReaction);
      message.reactions = message.reactions.filter(r => r !== existingReaction);
    } else {
      // Add new reaction
      const reaction = this.reactionRepository.create({
        messageId,
        userId,
        emoji,
        createdAt: new Date(),
      });

      const savedReaction = await this.reactionRepository.save(reaction);
      message.reactions.push(savedReaction);
    }

    return message;
  }

  async searchMessages(
    roomId: string,
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ messages: Message[]; total: number }> {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: {
        roomId,
        content: Like(`%${query}%`),
        deletedAt: null,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['reactions', 'sender'],
    });

    return { messages, total };
  }
}

// ==================== FILE UPLOAD SERVICE ====================

import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  getMulterOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuid()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp3|wav|mp4|webm/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && extName) {
          return callback(null, true);
        } else {
          callback(new Error('Only specific file types are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    };
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
  }> {
    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/chat/${file.filename}`,
    };
  }
}

// ==================== CHAT MODULE ====================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoomEntity,
      RoomParticipantEntity,
      MessageEntity,
      MessageReactionEntity,
      UserEntity,
    ]),
    MulterModule.registerAsync({
      useFactory: (fileUploadService: FileUploadService) => fileUploadService.getMulterOptions(),
      inject: [FileUploadService],
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    MessageService,
    UserService,
    FileUploadService,
  ],
  exports: [ChatService, MessageService],
})
export class ChatModule {}

// ==================== USAGE EXAMPLES ====================

/**
 * Frontend Integration Examples:
 * 
 * 1. Socket.IO Client Setup:
 * 
 * import io from 'socket.io-client';
 * 
 * const socket = io('http://localhost:3000/chat', {
 *   auth: {
 *     token: localStorage.getItem('jwt-token')
 *   }
 * });
 * 
 * 2. Join Room:
 * 
 * socket.emit('join-room', { roomId: 'room-123' });
 * 
 * 3. Send Message:
 * 
 * socket.emit('send-message', {
 *   roomId: 'room-123',
 *   content: 'Hello everyone!',
 *   type: 'TEXT'
 * });
 * 
 * 4. Listen for Messages:
 * 
 * socket.on('new-message', (message) => {
 *   console.log('New message:', message);
 *   // Update UI with new message
 * });
 * 
 * 5. Typing Indicators:
 * 
 * // Start typing
 * socket.emit('typing-start', { roomId: 'room-123' });
 * 
 * // Stop typing
 * socket.emit('typing-stop', { roomId: 'room-123' });
 * 
 * // Listen for typing
 * socket.on('user-typing', ({ userId, roomId }) => {
 *   console.log(`User ${userId} is typing in room ${roomId}`);
 * });
 * 
 * 6. File Upload:
 * 
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('roomId', 'room-123');
 * 
 * fetch('/api/chat/upload', {
 *   method: 'POST',
 *   body: formData,
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 */

/**
 * Key Learning Points from this Chat Implementation:
 * 
 * 1. **WebSocket Integration**: Real-time bidirectional communication
 * 2. **Room Management**: Creating, joining, and managing chat rooms
 * 3. **Message Persistence**: Storing messages with relationships
 * 4. **User Presence**: Online/offline status and typing indicators
 * 5. **File Uploads**: Handling multimedia messages
 * 6. **Message Features**: Editing, deleting, reactions, replies
 * 7. **Permission System**: Role-based access control
 * 8. **Error Handling**: Comprehensive WebSocket error management
 * 9. **Performance**: Message pagination and efficient queries
 * 10. **Security**: Authentication and authorization for WebSocket connections
 * 
 * This example demonstrates intermediate to advanced NestJS concepts
 * and is perfect for middle-level developers learning real-time applications.
 */

