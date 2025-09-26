# Comprehensive Angular GraphQL Integration Guide

This guide provides a complete overview of integrating GraphQL with Angular applications using Apollo Client, covering everything from basic setup to advanced patterns and production best practices.

## Table of Contents
- [Introduction to GraphQL](#introduction-to-graphql)
- [Setting Up Apollo Angular](#setting-up-apollo-angular)
- [Basic Queries and Mutations](#basic-queries-and-mutations)
- [Subscriptions and Real-time Updates](#subscriptions-and-real-time-updates)
- [Code Generation and Type Safety](#code-generation-and-type-safety)
- [Advanced Patterns](#advanced-patterns)
- [Caching Strategies](#caching-strategies)
- [Error Handling](#error-handling)
- [Testing GraphQL](#testing-graphql)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

---

## Introduction to GraphQL

GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need. Unlike REST APIs, GraphQL provides:

- **Single endpoint** for all data operations
- **Strongly typed schema** with introspection capabilities
- **Flexible queries** that prevent over-fetching and under-fetching
- **Real-time subscriptions** for live data updates
- **Powerful developer tools** for debugging and exploration

### GraphQL vs REST Comparison

| Feature | REST | GraphQL |
|---------|------|---------|
| Endpoints | Multiple endpoints | Single endpoint |
| Data Fetching | Fixed data structure | Flexible, client-specified |
| Over/Under-fetching | Common issue | Eliminated |
| Versioning | URL or header versioning | Schema evolution |
| Caching | HTTP-level caching | Normalized caching |
| Real-time | WebSockets/SSE | Built-in subscriptions |

---

## Setting Up Apollo Angular

### Installation

#### Option 1: Using Angular Schematics (Recommended)

```bash
# Install Apollo Angular with automatic configuration
ng add apollo-angular

# This automatically:
# - Installs necessary packages
# - Sets up GraphQL module
# - Configures basic Apollo Client
# - Creates example queries
```

#### Option 2: Manual Installation

```bash
# Install core packages
npm install apollo-angular @apollo/client graphql

# Install development dependencies
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript
npm install --save-dev @graphql-codegen/typescript-operations
npm install --save-dev @graphql-codegen/typescript-apollo-angular
```

### Basic Configuration

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { AppComponent } from './app.component';

const uri = 'http://localhost:4000/graphql'; // GraphQL endpoint

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Advanced Configuration with Authentication

**graphql.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, from } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

const uri = 'http://localhost:4000/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // Authentication link
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      
      // Handle 401 errors
      if (networkError.statusCode === 401) {
        localStorage.removeItem('token');
        // Redirect to login or refresh token
      }
    }
  });

  // Retry link for failed requests
  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => !!error,
    },
  });

  // HTTP link
  const httpLinkInstance = httpLink.create({ uri });

  return {
    link: from([
      errorLink,
      retryLink,
      authLink,
      httpLinkInstance,
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            posts: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
```

---

## Basic Queries and Mutations

### Defining GraphQL Operations

**graphql/queries.ts**
```typescript
import { gql } from 'apollo-angular';

// Query to fetch users
export const GET_USERS = gql`
  query GetUsers($first: Int, $after: String) {
    users(first: $first, after: $after) {
      edges {
        node {
          id
          name
          email
          avatar
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Query to fetch a single user
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      avatar
      bio
      posts {
        id
        title
        content
        createdAt
        likes
        comments {
          id
          content
          author {
            id
            name
          }
        }
      }
    }
  }
`;

// Query with fragments
export const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
    avatar
  }
`;

export const GET_USERS_WITH_FRAGMENT = gql`
  ${USER_FRAGMENT}
  query GetUsersWithFragment {
    users {
      edges {
        node {
          ...UserInfo
          postsCount
        }
      }
    }
  }
`;
```

**graphql/mutations.ts**
```typescript
import { gql } from 'apollo-angular';

// Create user mutation
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        name
        email
        avatar
      }
      errors {
        field
        message
      }
    }
  }
`;

// Update user mutation
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      user {
        id
        name
        email
        bio
        avatar
      }
      errors {
        field
        message
      }
    }
  }
`;

// Delete user mutation
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

// Upload file mutation
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      id
      filename
      mimetype
      encoding
      url
    }
  }
`;
```

### Using Queries in Components

**user-list.component.ts**
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GET_USERS, GetUsersQuery, GetUsersQueryVariables } from '../graphql/generated';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list">
      <div class="loading" *ngIf="loading">Loading users...</div>
      
      <div class="error" *ngIf="error">
        Error: {{ error.message }}
        <button (click)="refetch()">Retry</button>
      </div>

      <div class="users" *ngIf="users?.length">
        <div 
          class="user-card" 
          *ngFor="let user of users; trackBy: trackByUserId"
          [routerLink]="['/users', user.id]"
        >
          <img [src]="user.avatar || 'default-avatar.png'" [alt]="user.name">
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="pageInfo">
        <button 
          [disabled]="!pageInfo.hasPreviousPage || loading"
          (click)="loadPrevious()"
        >
          Previous
        </button>
        
        <span>{{ totalCount }} total users</span>
        
        <button 
          [disabled]="!pageInfo.hasNextPage || loading"
          (click)="loadMore()"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-list {
      padding: 20px;
    }
    
    .user-card {
      display: flex;
      align-items: center;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .user-card:hover {
      background-color: #f5f5f5;
    }
    
    .user-card img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 15px;
    }
    
    .loading, .error {
      text-align: center;
      padding: 20px;
    }
    
    .error {
      color: #d32f2f;
    }
    
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error: any;
  pageInfo: any;
  totalCount = 0;
  
  private queryRef!: QueryRef<GetUsersQuery, GetUsersQueryVariables>;
  private destroy$ = new Subject<void>();
  private pageSize = 10;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(after?: string, before?: string): void {
    this.queryRef = this.apollo.watchQuery<GetUsersQuery, GetUsersQueryVariables>({
      query: GET_USERS,
      variables: {
        first: after ? this.pageSize : before ? undefined : this.pageSize,
        after,
        last: before ? this.pageSize : undefined,
        before,
      },
      notifyOnNetworkStatusChange: true,
    });

    this.queryRef.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data, loading, error }) => {
          this.loading = loading;
          this.error = error;
          
          if (data?.users) {
            this.users = data.users.edges.map(edge => edge.node);
            this.pageInfo = data.users.pageInfo;
            this.totalCount = data.users.totalCount;
          }
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  loadMore(): void {
    if (this.pageInfo?.hasNextPage) {
      this.loadUsers(this.pageInfo.endCursor);
    }
  }

  loadPrevious(): void {
    if (this.pageInfo?.hasPreviousPage) {
      this.loadUsers(undefined, this.pageInfo.startCursor);
    }
  }

  refetch(): void {
    this.queryRef.refetch();
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
```

### Using Mutations in Components

**user-form.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { CREATE_USER, UPDATE_USER, CreateUserMutation, UpdateUserMutation } from '../graphql/generated';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
      <h2>{{ isEditing ? 'Edit User' : 'Create User' }}</h2>
      
      <div class="form-group">
        <label for="name">Name *</label>
        <input 
          id="name"
          type="text" 
          formControlName="name"
          [class.error]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
        >
        <div class="error-message" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
          Name is required
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          id="email"
          type="email" 
          formControlName="email"
          [class.error]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
        >
        <div class="error-message" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
          Valid email is required
        </div>
      </div>

      <div class="form-group">
        <label for="bio">Bio</label>
        <textarea 
          id="bio"
          formControlName="bio"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="avatar">Avatar</label>
        <input 
          id="avatar"
          type="file" 
          accept="image/*"
          (change)="onFileSelect($event)"
        >
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          (click)="cancel.emit()"
          [disabled]="loading"
        >
          Cancel
        </button>
        
        <button 
          type="submit" 
          [disabled]="userForm.invalid || loading"
          class="primary"
        >
          {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
        </button>
      </div>

      <div class="server-errors" *ngIf="serverErrors?.length">
        <div class="error-message" *ngFor="let error of serverErrors">
          {{ error.field }}: {{ error.message }}
        </div>
      </div>
    </form>
  `,
  styles: [`
    .user-form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .form-group input.error,
    .form-group textarea.error {
      border-color: #d32f2f;
    }
    
    .error-message {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    .form-actions button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .form-actions button.primary {
      background-color: #1976d2;
      color: white;
    }
    
    .form-actions button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .server-errors {
      margin-top: 20px;
      padding: 15px;
      background-color: #ffebee;
      border-radius: 4px;
    }
  `]
})
export class UserFormComponent {
  @Input() user: any = null;
  @Input() isEditing = false;
  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  loading = false;
  serverErrors: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
    });
  }

  ngOnInit(): void {
    if (this.user && this.isEditing) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        bio: this.user.bio,
      });
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.serverErrors = [];

    try {
      let avatarUrl = '';
      
      // Upload file if selected
      if (this.selectedFile) {
        avatarUrl = await this.uploadFile(this.selectedFile);
      }

      const formData = {
        ...this.userForm.value,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      if (this.isEditing) {
        await this.updateUser(formData);
      } else {
        await this.createUser(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async createUser(userData: any): Promise<void> {
    const result = await this.apollo.mutate<CreateUserMutation>({
      mutation: CREATE_USER,
      variables: {
        input: userData,
      },
      update: (cache, { data }) => {
        if (data?.createUser?.user) {
          // Update cache to include new user
          const existingUsers = cache.readQuery({ query: GET_USERS });
          if (existingUsers) {
            cache.writeQuery({
              query: GET_USERS,
              data: {
                users: {
                  ...existingUsers.users,
                  edges: [
                    {
                      node: data.createUser.user,
                      cursor: data.createUser.user.id,
                    },
                    ...existingUsers.users.edges,
                  ],
                  totalCount: existingUsers.users.totalCount + 1,
                },
              },
            });
          }
        }
      },
    }).toPromise();

    if (result?.data?.createUser?.errors?.length) {
      this.serverErrors = result.data.createUser.errors;
    } else if (result?.data?.createUser?.user) {
      this.saved.emit(result.data.createUser.user);
    }
  }

  private async updateUser(userData: any): Promise<void> {
    const result = await this.apollo.mutate<UpdateUserMutation>({
      mutation: UPDATE_USER,
      variables: {
        id: this.user.id,
        input: userData,
      },
    }).toPromise();

    if (result?.data?.updateUser?.errors?.length) {
      this.serverErrors = result.data.updateUser.errors;
    } else if (result?.data?.updateUser?.user) {
      this.saved.emit(result.data.updateUser.user);
    }
  }

  private async uploadFile(file: File): Promise<string> {
    const result = await this.apollo.mutate({
      mutation: UPLOAD_FILE,
      variables: { file },
      context: {
        useMultipart: true,
      },
    }).toPromise();

    return result?.data?.uploadFile?.url || '';
  }
}
```

---

## Subscriptions and Real-time Updates

### WebSocket Setup

**graphql.module.ts** (Updated with WebSocket support)
```typescript
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpUri = 'http://localhost:4000/graphql';
const wsUri = 'ws://localhost:4000/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // Create HTTP link
  const http = httpLink.create({ uri: httpUri });

  // Create WebSocket link
  const ws = new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true,
      connectionParams: () => {
        const token = localStorage.getItem('token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    },
  });

  // Split link based on operation type
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    ws,
    http
  );

  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
```

### Subscription Definitions

**graphql/subscriptions.ts**
```typescript
import { gql } from 'apollo-angular';

// Subscribe to new messages
export const MESSAGE_ADDED = gql`
  subscription MessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
      chatId
    }
  }
`;

// Subscribe to user status changes
export const USER_STATUS_CHANGED = gql`
  subscription UserStatusChanged {
    userStatusChanged {
      id
      isOnline
      lastSeen
    }
  }
`;

// Subscribe to notifications
export const NOTIFICATION_ADDED = gql`
  subscription NotificationAdded($userId: ID!) {
    notificationAdded(userId: $userId) {
      id
      type
      title
      message
      read
      createdAt
      data
    }
  }
`;
```

### Using Subscriptions in Components

**chat.component.ts**
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  GET_MESSAGES, 
  MESSAGE_ADDED, 
  SEND_MESSAGE,
  GetMessagesQuery,
  MessageAddedSubscription 
} from '../graphql/generated';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="messages" #messagesContainer>
        <div 
          class="message" 
          *ngFor="let message of messages; trackBy: trackByMessageId"
          [class.own-message]="message.author.id === currentUserId"
        >
          <div class="message-header">
            <img [src]="message.author.avatar" [alt]="message.author.name">
            <span class="author">{{ message.author.name }}</span>
            <span class="timestamp">{{ message.createdAt | date:'short' }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>

      <div class="message-input">
        <input 
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Type a message..."
          [disabled]="sending"
        >
        <button 
          (click)="sendMessage()"
          [disabled]="!newMessage.trim() || sending"
        >
          {{ sending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 600px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    
    .message {
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }
    
    .message.own-message {
      background-color: #e3f2fd;
      margin-left: 50px;
    }
    
    .message-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
      font-size: 12px;
      color: #666;
    }
    
    .message-header img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    
    .message-content {
      font-size: 14px;
    }
    
    .message-input {
      display: flex;
      padding: 20px;
      border-top: 1px solid #ddd;
      gap: 10px;
    }
    
    .message-input input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .message-input button {
      padding: 10px 20px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .message-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage = '';
  sending = false;
  currentUserId = 'current-user-id'; // Get from auth service
  chatId = 'chat-room-1'; // Get from route params

  private destroy$ = new Subject<void>();

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.loadMessages();
    this.subscribeToNewMessages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMessages(): void {
    this.apollo.watchQuery<GetMessagesQuery>({
      query: GET_MESSAGES,
      variables: { chatId: this.chatId },
    }).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          if (data?.messages) {
            this.messages = [...data.messages];
            this.scrollToBottom();
          }
        },
        error: (error) => console.error('Error loading messages:', error),
      });
  }

  subscribeToNewMessages(): void {
    this.apollo.subscribe<MessageAddedSubscription>({
      query: MESSAGE_ADDED,
      variables: { chatId: this.chatId },
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          if (data?.messageAdded) {
            this.messages.push(data.messageAdded);
            this.scrollToBottom();
          }
        },
        error: (error) => console.error('Subscription error:', error),
      });
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim()) return;

    this.sending = true;
    const messageContent = this.newMessage;
    this.newMessage = '';

    try {
      await this.apollo.mutate({
        mutation: SEND_MESSAGE,
        variables: {
          input: {
            chatId: this.chatId,
            content: messageContent,
          },
        },
      }).toPromise();
    } catch (error) {
      console.error('Error sending message:', error);
      this.newMessage = messageContent; // Restore message on error
    } finally {
      this.sending = false;
    }
  }

  trackByMessageId(index: number, message: any): string {
    return message.id;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
}
```

---

## Code Generation and Type Safety

### GraphQL Code Generator Setup

**codegen.yml**
```yaml
overwrite: true
schema: "http://localhost:4000/graphql"
documents: "src/**/*.graphql"
generates:
  src/app/graphql/generated.ts:
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-apollo-angular"
    config:
      addExplicitOverride: true
      withHooks: false
      withHOC: false
      withComponent: false
      apolloAngularPackage: "apollo-angular"
      gqlImport: "apollo-angular#gql"
      
  src/app/graphql/introspection.json:
    plugins:
      - "introspection"
```

**package.json scripts**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.yml",
    "codegen:watch": "graphql-codegen --config codegen.yml --watch",
    "build": "npm run codegen && ng build"
  }
}
```

### Generated Types Example

**src/app/graphql/generated.ts** (Generated file)
```typescript
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Upload: any;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  isOnline: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  posts: Array<Post>;
};

export type CreateUserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  bio?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
};

export type GetUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;

export type GetUsersQuery = { 
  __typename?: 'Query', 
  users: { 
    __typename?: 'UserConnection', 
    totalCount: number, 
    pageInfo: { 
      __typename?: 'PageInfo', 
      hasNextPage: boolean, 
      hasPreviousPage: boolean, 
      startCursor?: string | null, 
      endCursor?: string | null 
    }, 
    edges: Array<{ 
      __typename?: 'UserEdge', 
      cursor: string, 
      node: { 
        __typename?: 'User', 
        id: string, 
        name: string, 
        email: string, 
        avatar?: string | null, 
        createdAt: any 
      } 
    }> 
  } 
};

export const GetUsersDocument = gql`
  query GetUsers($first: Int, $after: String) {
    users(first: $first, after: $after) {
      edges {
        node {
          id
          name
          email
          avatar
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class GetUsersGQL extends Apollo.Query<GetUsersQuery, GetUsersQueryVariables> {
  override document = GetUsersDocument;
}
```

### Using Generated Services

**user-list.component.ts** (Using generated services)
```typescript
import { Component, OnInit } from '@angular/core';
import { GetUsersGQL, GetUsersQuery, User } from '../graphql/generated';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list">
      <div *ngFor="let user of users$ | async" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users$ = this.getUsersGQL.watch()
    .valueChanges
    .pipe(
      map(result => result.data?.users?.edges.map(edge => edge.node) || [])
    );

  constructor(private getUsersGQL: GetUsersGQL) {}

  ngOnInit(): void {
    // Component automatically subscribes to users$ in template
  }
}
```

---

## Advanced Patterns

### Custom Apollo Service

**apollo.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApolloService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apollo: Apollo) {}

  /**
   * Enhanced query method with loading state management
   */
  query<T, V = {}>(
    query: DocumentNode,
    variables?: V,
    options: any = {}
  ): Observable<QueryState<T>> {
    this.loadingSubject.next(true);

    return this.apollo.query<T>({
      query,
      variables,
      ...options,
    }).pipe(
      map(result => ({
        data: result.data,
        loading: result.loading,
        error: result.error || null,
      })),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Enhanced watchQuery with automatic loading management
   */
  watchQuery<T, V = {}>(
    query: DocumentNode,
    variables?: V,
    options: any = {}
  ): Observable<QueryState<T>> {
    const queryRef: QueryRef<T, V> = this.apollo.watchQuery<T, V>({
      query,
      variables,
      notifyOnNetworkStatusChange: true,
      ...options,
    });

    return queryRef.valueChanges.pipe(
      map(result => ({
        data: result.data,
        loading: result.loading,
        error: result.error || null,
      })),
      tap(state => this.loadingSubject.next(state.loading))
    );
  }

  /**
   * Enhanced mutation with optimistic updates
   */
  mutate<T, V = {}>(
    mutation: DocumentNode,
    variables?: V,
    optimisticResponse?: T,
    updateQueries?: any
  ): Observable<T> {
    this.loadingSubject.next(true);

    return this.apollo.mutate<T>({
      mutation,
      variables,
      optimisticResponse,
      update: updateQueries,
    }).pipe(
      map(result => result.data as T),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Subscription with automatic cleanup
   */
  subscribe<T, V = {}>(
    subscription: DocumentNode,
    variables?: V
  ): Observable<T> {
    return this.apollo.subscribe<T>({
      query: subscription,
      variables,
    }).pipe(
      map(result => result.data as T)
    );
  }

  /**
   * Clear all Apollo caches
   */
  clearCache(): Promise<void> {
    return this.apollo.client.clearStore();
  }

  /**
   * Reset Apollo store
   */
  resetStore(): Promise<any> {
    return this.apollo.client.resetStore();
  }
}
```

### GraphQL Interceptor

**graphql.interceptor.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable()
export class GraphQLInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only intercept GraphQL requests
    if (!req.url.includes('/graphql')) {
      return next.handle(req);
    }

    // Add common headers
    const graphqlReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    return next.handle(graphqlReq).pipe(
      retry(2), // Retry failed requests twice
      catchError(error => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      // Handle authentication errors
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      this.notificationService.error('Session expired. Please login again.');
    } else if (error.status === 403) {
      // Handle authorization errors
      this.notificationService.error('You do not have permission to perform this action.');
    } else if (error.status >= 500) {
      // Handle server errors
      this.notificationService.error('Server error. Please try again later.');
    } else if (error.networkError) {
      // Handle network errors
      this.notificationService.error('Network error. Please check your connection.');
    }
  }
}
```

### Pagination Helper

**pagination.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface PaginatedData<T> {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: PaginationInfo;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private paginationState = new BehaviorSubject<{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  }>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  });

  public paginationState$ = this.paginationState.asObservable();

  updatePaginationState(data: PaginatedData<any>, pageSize: number = 10): void {
    const totalPages = Math.ceil(data.totalCount / pageSize);
    const currentPage = this.getCurrentPage(data.pageInfo, pageSize);

    this.paginationState.next({
      currentPage,
      pageSize,
      totalPages,
      totalCount: data.totalCount,
    });
  }

  private getCurrentPage(pageInfo: PaginationInfo, pageSize: number): number {
    // Calculate current page based on cursors (simplified)
    return 1; // This would need actual implementation based on your cursor logic
  }

  getVariablesForPage(page: number, pageSize: number = 10): any {
    if (page === 1) {
      return { first: pageSize };
    }
    
    // This would need to be implemented based on your cursor pagination logic
    return { first: pageSize, after: 'cursor-for-page' };
  }
}
```

---

## Caching Strategies

### Cache Configuration

**cache.config.ts**
```typescript
import { InMemoryCache, TypePolicies } from '@apollo/client/core';

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      users: {
        keyArgs: ['filter', 'sort'],
        merge(existing, incoming, { args }) {
          if (args?.after) {
            // Pagination: append new results
            return {
              ...incoming,
              edges: [...(existing?.edges || []), ...incoming.edges],
            };
          }
          // Replace existing results
          return incoming;
        },
      },
      posts: {
        keyArgs: ['authorId'],
        merge(existing = [], incoming) {
          return [...existing, ...incoming];
        },
      },
    },
  },
  User: {
    fields: {
      posts: {
        merge(existing = [], incoming) {
          // Merge posts arrays, avoiding duplicates
          const existingIds = existing.map((post: any) => post.id);
          const newPosts = incoming.filter((post: any) => !existingIds.includes(post.id));
          return [...existing, ...newPosts];
        },
      },
    },
  },
  Post: {
    fields: {
      comments: {
        merge(existing = [], incoming) {
          return [...existing, ...incoming];
        },
      },
    },
  },
};

export function createCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies,
    addTypename: true,
    resultCaching: true,
  });
}
```

### Cache Management Service

**cache.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor(private apollo: Apollo) {}

  /**
   * Read data from cache
   */
  readQuery<T>(query: DocumentNode, variables?: any): T | null {
    try {
      return this.apollo.client.readQuery<T>({
        query,
        variables,
      });
    } catch (error) {
      console.warn('Cache read failed:', error);
      return null;
    }
  }

  /**
   * Write data to cache
   */
  writeQuery<T>(query: DocumentNode, data: T, variables?: any): void {
    try {
      this.apollo.client.writeQuery({
        query,
        data,
        variables,
      });
    } catch (error) {
      console.error('Cache write failed:', error);
    }
  }

  /**
   * Update cache after mutation
   */
  updateCache<T>(
    query: DocumentNode,
    updater: (data: T | null) => T,
    variables?: any
  ): void {
    try {
      const existingData = this.readQuery<T>(query, variables);
      const updatedData = updater(existingData);
      this.writeQuery(query, updatedData, variables);
    } catch (error) {
      console.error('Cache update failed:', error);
    }
  }

  /**
   * Remove item from cache
   */
  evictFromCache(id: string): void {
    this.apollo.client.cache.evict({ id });
    this.apollo.client.cache.gc();
  }

  /**
   * Clear specific query from cache
   */
  evictQuery(query: DocumentNode, variables?: any): void {
    this.apollo.client.cache.evict({
      fieldName: 'ROOT_QUERY',
      args: variables,
    });
  }

  /**
   * Refetch all active queries
   */
  refetchQueries(): Promise<any> {
    return this.apollo.client.refetchQueries({
      include: 'active',
    });
  }

  /**
   * Clear entire cache
   */
  clearCache(): Promise<void> {
    return this.apollo.client.clearStore();
  }
}
```

---

## Error Handling

### Global Error Handler

**graphql-error.handler.ts**
```typescript
import { Injectable, ErrorHandler } from '@angular/core';
import { GraphQLError } from 'graphql';
import { NotificationService } from './notification.service';

export interface GraphQLFormattedError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: {
    code?: string;
    exception?: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GraphQLErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) {}

  handleError(error: any): void {
    if (this.isGraphQLError(error)) {
      this.handleGraphQLErrors(error.graphQLErrors);
    } else if (this.isNetworkError(error)) {
      this.handleNetworkError(error.networkError);
    } else {
      this.handleGenericError(error);
    }
  }

  private isGraphQLError(error: any): boolean {
    return error && error.graphQLErrors && Array.isArray(error.graphQLErrors);
  }

  private isNetworkError(error: any): boolean {
    return error && error.networkError;
  }

  private handleGraphQLErrors(errors: GraphQLFormattedError[]): void {
    errors.forEach(error => {
      const { message, extensions } = error;
      const code = extensions?.code;

      switch (code) {
        case 'UNAUTHENTICATED':
          this.notificationService.error('Please login to continue');
          this.redirectToLogin();
          break;
        
        case 'FORBIDDEN':
          this.notificationService.error('You do not have permission for this action');
          break;
        
        case 'BAD_USER_INPUT':
          this.notificationService.warning(`Invalid input: ${message}`);
          break;
        
        case 'INTERNAL_SERVER_ERROR':
          this.notificationService.error('Server error occurred');
          break;
        
        default:
          this.notificationService.error(message || 'An error occurred');
      }

      // Log error for debugging
      console.error('GraphQL Error:', error);
    });
  }

  private handleNetworkError(networkError: any): void {
    if (networkError.status === 0) {
      this.notificationService.error('Network connection failed');
    } else if (networkError.status >= 500) {
      this.notificationService.error('Server is temporarily unavailable');
    } else {
      this.notificationService.error(`Network error: ${networkError.message}`);
    }

    console.error('Network Error:', networkError);
  }

  private handleGenericError(error: any): void {
    this.notificationService.error('An unexpected error occurred');
    console.error('Generic Error:', error);
  }

  private redirectToLogin(): void {
    // Implement redirect logic
    window.location.href = '/login';
  }
}
```

### Component Error Handling

**error-boundary.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApolloError } from '@apollo/client/core';

@Component({
  selector: 'app-error-boundary',
  template: `
    <div class="error-boundary" *ngIf="error">
      <div class="error-content">
        <h3>{{ errorTitle }}</h3>
        <p>{{ errorMessage }}</p>
        
        <div class="error-actions">
          <button 
            class="retry-button" 
            (click)="onRetry()"
            *ngIf="showRetry"
          >
            Try Again
          </button>
          
          <button 
            class="details-button" 
            (click)="showDetails = !showDetails"
          >
            {{ showDetails ? 'Hide' : 'Show' }} Details
          </button>
        </div>

        <div class="error-details" *ngIf="showDetails">
          <pre>{{ errorDetails | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-boundary {
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #f44336;
      border-radius: 8px;
      background-color: #ffebee;
    }
    
    .error-content h3 {
      color: #d32f2f;
      margin: 0 0 10px 0;
    }
    
    .error-content p {
      color: #666;
      margin: 0 0 15px 0;
    }
    
    .error-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .error-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .retry-button {
      background-color: #1976d2;
      color: white;
    }
    
    .details-button {
      background-color: #666;
      color: white;
    }
    
    .error-details {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      overflow-x: auto;
    }
  `]
})
export class ErrorBoundaryComponent {
  @Input() error: ApolloError | null = null;
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();

  showDetails = false;

  get errorTitle(): string {
    if (!this.error) return '';
    
    if (this.error.networkError) {
      return 'Network Error';
    } else if (this.error.graphQLErrors?.length) {
      return 'GraphQL Error';
    }
    return 'Error';
  }

  get errorMessage(): string {
    if (!this.error) return '';
    
    if (this.error.networkError) {
      return 'Unable to connect to the server. Please check your internet connection.';
    } else if (this.error.graphQLErrors?.length) {
      return this.error.graphQLErrors[0].message;
    }
    return this.error.message || 'An unexpected error occurred.';
  }

  get errorDetails(): any {
    if (!this.error) return null;
    
    return {
      message: this.error.message,
      graphQLErrors: this.error.graphQLErrors,
      networkError: this.error.networkError,
      extraInfo: this.error.extraInfo,
    };
  }

  onRetry(): void {
    this.retry.emit();
  }
}
```

---

## Testing GraphQL

### Testing Setup

**apollo-testing.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { ApolloTestingModule, ApolloTestingController, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  imports: [ApolloTestingModule],
  providers: [
    {
      provide: APOLLO_TESTING_CACHE,
      useValue: new InMemoryCache(),
    },
  ],
})
export class ApolloTestingModuleConfig {}
```

### Component Testing

**user-list.component.spec.ts**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { UserListComponent } from './user-list.component';
import { GET_USERS } from '../graphql/queries';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [ApolloTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should load users on init', () => {
    const mockUsers = {
      users: {
        edges: [
          {
            node: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: null,
              createdAt: '2023-01-01T00:00:00Z',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
        totalCount: 1,
      },
    };

    component.ngOnInit();

    const op = controller.expectOne(GET_USERS);
    expect(op.operation.variables).toEqual({
      first: 10,
      after: undefined,
      last: undefined,
      before: undefined,
    });

    op.flush({ data: mockUsers });

    expect(component.users).toHaveLength(1);
    expect(component.users[0].name).toBe('John Doe');
    expect(component.totalCount).toBe(1);
  });

  it('should handle errors', () => {
    component.ngOnInit();

    const op = controller.expectOne(GET_USERS);
    op.graphqlErrors([{ message: 'Error loading users' }]);

    expect(component.error).toBeTruthy();
    expect(component.error.message).toContain('Error loading users');
  });

  it('should load more users', () => {
    component.pageInfo = {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: 'cursor1',
      endCursor: 'cursor1',
    };

    component.loadMore();

    const op = controller.expectOne(GET_USERS);
    expect(op.operation.variables.after).toBe('cursor1');
  });
});
```

### Service Testing

**apollo.service.spec.ts**
```typescript
import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { ApolloService } from './apollo.service';
import { GET_USERS } from '../graphql/queries';

describe('ApolloService', () => {
  let service: ApolloService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [ApolloService],
    });

    service = TestBed.inject(ApolloService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should execute query and return data', (done) => {
    const mockData = { users: [] };

    service.query(GET_USERS).subscribe((result) => {
      expect(result.data).toEqual(mockData);
      expect(result.loading).toBeFalse();
      expect(result.error).toBeNull();
      done();
    });

    const op = controller.expectOne(GET_USERS);
    op.flush({ data: mockData });
  });

  it('should handle query errors', (done) => {
    service.query(GET_USERS).subscribe({
      next: (result) => {
        expect(result.error).toBeTruthy();
        done();
      },
    });

    const op = controller.expectOne(GET_USERS);
    op.graphqlErrors([{ message: 'Query failed' }]);
  });
});
```

### E2E Testing

**users.e2e-spec.ts**
```typescript
import { browser, by, element } from 'protractor';

describe('Users Page', () => {
  beforeEach(() => {
    browser.get('/users');
  });

  it('should display users list', async () => {
    // Wait for GraphQL query to complete
    await browser.wait(() => {
      return element.all(by.css('.user-card')).count().then(count => count > 0);
    }, 5000);

    const userCards = element.all(by.css('.user-card'));
    expect(await userCards.count()).toBeGreaterThan(0);
  });

  it('should load more users on pagination', async () => {
    const initialCount = await element.all(by.css('.user-card')).count();
    
    const nextButton = element(by.css('.pagination button:last-child'));
    await nextButton.click();

    // Wait for new users to load
    await browser.wait(() => {
      return element.all(by.css('.user-card')).count().then(count => count > initialCount);
    }, 5000);

    const newCount = await element.all(by.css('.user-card')).count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
```

---

## Performance Optimization

### Query Optimization Strategies

**query-optimizer.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class QueryOptimizerService {
  constructor(private apollo: Apollo) {}

  /**
   * Batch multiple queries into a single request
   */
  batchQueries<T>(queries: Array<{ query: DocumentNode; variables?: any }>): Promise<T[]> {
    return Promise.all(
      queries.map(({ query, variables }) =>
        this.apollo.query<T>({ query, variables }).toPromise()
      )
    );
  }

  /**
   * Prefetch data for better performance
   */
  prefetchQuery<T>(query: DocumentNode, variables?: any): Promise<void> {
    return this.apollo.query<T>({
      query,
      variables,
      fetchPolicy: 'cache-first',
    }).toPromise().then(() => void 0);
  }

  /**
   * Use cache-first strategy for frequently accessed data
   */
  getCachedQuery<T>(query: DocumentNode, variables?: any) {
    return this.apollo.watchQuery<T>({
      query,
      variables,
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
    });
  }

  /**
   * Implement query deduplication
   */
  dedupeQuery<T>(query: DocumentNode, variables?: any) {
    return this.apollo.watchQuery<T>({
      query,
      variables,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    });
  }
}
```

### Lazy Loading with GraphQL

**lazy-load.directive.ts**
```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad!: DocumentNode;
  @Input() lazyLoadVariables: any = {};
  @Input() lazyLoadThreshold = 200;

  private observer!: IntersectionObserver;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.createObserver();
  }

  private createObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadData();
            this.observer.disconnect();
          }
        });
      },
      {
        rootMargin: `${this.lazyLoadThreshold}px`,
      }
    );

    const placeholder = this.viewContainer.createEmbeddedView(this.templateRef);
    this.observer.observe(placeholder.rootNodes[0]);
  }

  private loadData(): void {
    this.apollo.query({
      query: this.appLazyLoad,
      variables: this.lazyLoadVariables,
    }).subscribe({
      next: (result) => {
        // Update template with loaded data
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: result.data,
          loading: false,
        });
      },
      error: (error) => {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: null,
          loading: false,
          error,
        });
      }
    });
  }
}
```

---

## Best Practices

### 1. Query Organization

```typescript
// ✅ Good: Organize queries by feature
// users/graphql/user.queries.ts
export const USER_QUERIES = {
  GET_USERS: gql`...`,
  GET_USER: gql`...`,
  SEARCH_USERS: gql`...`,
};

// users/graphql/user.mutations.ts
export const USER_MUTATIONS = {
  CREATE_USER: gql`...`,
  UPDATE_USER: gql`...`,
  DELETE_USER: gql`...`,
};

// users/graphql/user.subscriptions.ts
export const USER_SUBSCRIPTIONS = {
  USER_UPDATED: gql`...`,
  USER_ONLINE_STATUS: gql`...`,
};
```

### 2. Fragment Usage

```typescript
// ✅ Good: Use fragments for reusable fields
export const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
    avatar
  }
`;

export const GET_USERS = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users {
      ...UserInfo
      postsCount
    }
  }
`;
```

### 3. Error Handling Strategy

```typescript
// ✅ Good: Centralized error handling
@Injectable()
export class GraphQLErrorService {
  handleError(error: ApolloError): void {
    if (error.networkError) {
      this.handleNetworkError(error.networkError);
    }
    
    if (error.graphQLErrors?.length) {
      this.handleGraphQLErrors(error.graphQLErrors);
    }
  }
}
```

### 4. Type Safety

```typescript
// ✅ Good: Use generated types
import { GetUsersQuery, GetUsersQueryVariables } from '../generated/graphql';

class UserService {
  getUsers(variables: GetUsersQueryVariables): Observable<GetUsersQuery> {
    return this.apollo.query<GetUsersQuery>({
      query: GET_USERS,
      variables,
    });
  }
}
```

### 5. Caching Strategy

```typescript
// ✅ Good: Configure appropriate cache policies
const typePolicies = {
  User: {
    keyFields: ['id'],
    fields: {
      posts: {
        merge: true, // Merge arrays
      },
    },
  },
  Query: {
    fields: {
      users: {
        keyArgs: ['filter'], // Cache by filter
      },
    },
  },
};
```

### 6. Performance Monitoring

```typescript
// ✅ Good: Monitor GraphQL performance
@Injectable()
export class GraphQLMonitoringService {
  logQuery(operationName: string, duration: number): void {
    if (duration > 1000) {
      console.warn(`Slow query detected: ${operationName} took ${duration}ms`);
    }
  }
}
```

---

## Conclusion

This comprehensive guide covers all aspects of integrating GraphQL with Angular applications. Key takeaways:

1. **Setup**: Use Apollo Angular for robust GraphQL integration
2. **Type Safety**: Implement code generation for better developer experience
3. **Caching**: Configure intelligent caching strategies for performance
4. **Error Handling**: Implement comprehensive error handling patterns
5. **Testing**: Write thorough tests for GraphQL operations
6. **Performance**: Optimize queries and implement lazy loading
7. **Best Practices**: Follow established patterns for maintainable code

By following these patterns and practices, you'll build scalable, maintainable Angular applications with efficient GraphQL integration.

