// CouchDB vs PouchDB - Complete Comparison and Integration Guide
import { Injectable, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

/*
==========================================
CouchDB vs PouchDB COMPARISON
==========================================

CouchDB:
- Server-side NoSQL database
- Runs on server (Node.js, Apache, etc.)
- HTTP/REST API interface
- Multi-version concurrency control (MVCC)
- Map-Reduce views for querying
- Replication and clustering support
- Document-oriented storage

PouchDB:
- Client-side JavaScript database
- Runs in browser or Node.js
- Compatible with CouchDB protocol
- Offline-first approach
- Bidirectional sync with CouchDB
- IndexedDB/WebSQL storage in browser
- Same API as CouchDB but client-side

KEY RELATIONSHIP:
PouchDB is designed to sync with CouchDB, creating offline-first applications
that can work without internet and sync when connected.
*/

// ==========================================
// 1. DOCUMENT INTERFACES
// ==========================================

interface BaseDocument {
  _id?: string;
  _rev?: string;
}

interface UserDocument extends BaseDocument {
  type: 'user';
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface TodoDocument extends BaseDocument {
  type: 'todo';
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface SyncInfo {
  direction: 'push' | 'pull' | 'bidirectional';
  status: 'active' | 'paused' | 'complete' | 'error';
  docsWritten: number;
  docsRead: number;
  lastSeq: string;
}

// ==========================================
// 2. COUCHDB SERVICE (Server-side database)
// ==========================================

@Injectable({ providedIn: 'root' })
export class CouchDBService {
  private baseUrl = 'http://localhost:5984'; // CouchDB server URL
  private dbName = 'myapp_db';
  private dbUrl = `${this.baseUrl}/${this.dbName}`;

  constructor(private http: HttpClient) {
    console.log('🗄️ CouchDB Service initialized');
    console.log('   Server URL:', this.baseUrl);
    console.log('   Database:', this.dbName);
  }

  // ==========================================
  // DATABASE MANAGEMENT
  // ==========================================

  async createDatabase(): Promise<any> {
    console.log('🔨 Creating CouchDB database...');
    try {
      const response = await this.http.put(this.dbUrl, {}).toPromise();
      console.log('✅ Database created:', response);
      return response;
    } catch (error: any) {
      if (error.status === 412) {
        console.log('ℹ️ Database already exists');
        return { ok: true, exists: true };
      }
      console.error('❌ Failed to create database:', error);
      throw error;
    }
  }

  async getDatabaseInfo(): Promise<any> {
    try {
      const info = await this.http.get(this.dbUrl).toPromise();
      console.log('📊 Database info:', info);
      return info;
    } catch (error) {
      console.error('❌ Failed to get database info:', error);
      throw error;
    }
  }

  // ==========================================
  // DOCUMENT OPERATIONS
  // ==========================================

  async createDocument<T extends BaseDocument>(doc: Omit<T, '_id' | '_rev'>): Promise<T> {
    console.log('📝 Creating document in CouchDB:', doc);
    
    const docWithId = {
      ...doc,
      _id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const response: any = await this.http.post(this.dbUrl, docWithId).toPromise();
      console.log('✅ Document created:', response);
      
      return {
        ...docWithId,
        _id: response.id,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to create document:', error);
      throw error;
    }
  }

  async getDocument<T extends BaseDocument>(id: string): Promise<T> {
    console.log('📖 Getting document from CouchDB:', id);
    
    try {
      const doc = await this.http.get<T>(`${this.dbUrl}/${id}`).toPromise();
      console.log('✅ Document retrieved:', doc);
      return doc!;
    } catch (error) {
      console.error('❌ Failed to get document:', error);
      throw error;
    }
  }

  async updateDocument<T extends BaseDocument>(doc: T): Promise<T> {
    console.log('✏️ Updating document in CouchDB:', doc._id);
    
    const updatedDoc = {
      ...doc,
      updatedAt: new Date()
    };

    try {
      const response: any = await this.http.put(`${this.dbUrl}/${doc._id}`, updatedDoc).toPromise();
      console.log('✅ Document updated:', response);
      
      return {
        ...updatedDoc,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to update document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string, rev: string): Promise<any> {
    console.log('🗑️ Deleting document from CouchDB:', id);
    
    try {
      const response = await this.http.delete(`${this.dbUrl}/${id}?rev=${rev}`).toPromise();
      console.log('✅ Document deleted:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  }

  // ==========================================
  // QUERYING
  // ==========================================

  async getAllDocuments<T extends BaseDocument>(params: any = {}): Promise<T[]> {
    console.log('📋 Getting all documents from CouchDB');
    
    const queryParams = new URLSearchParams({
      include_docs: 'true',
      ...params
    });

    try {
      const response: any = await this.http.get(`${this.dbUrl}/_all_docs?${queryParams}`).toPromise();
      const docs = response.rows.map((row: any) => row.doc).filter((doc: any) => !doc._id.startsWith('_design'));
      
      console.log('✅ Retrieved documents:', docs.length);
      return docs;
    } catch (error) {
      console.error('❌ Failed to get documents:', error);
      throw error;
    }
  }

  async findDocuments<T extends BaseDocument>(selector: any): Promise<T[]> {
    console.log('🔍 Finding documents in CouchDB with selector:', selector);
    
    try {
      const response: any = await this.http.post(`${this.dbUrl}/_find`, {
        selector,
        limit: 100
      }).toPromise();
      
      console.log('✅ Found documents:', response.docs.length);
      return response.docs;
    } catch (error) {
      console.error('❌ Failed to find documents:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// ==========================================
// 3. POUCHDB SERVICE (Client-side database)
// ==========================================

declare global {
  interface Window {
    PouchDB: any;
  }
}

@Injectable({ providedIn: 'root' })
export class PouchDBService {
  private db: any;
  private remoteDb: any;
  private syncHandler: any;
  private syncInfo$ = new BehaviorSubject<SyncInfo | null>(null);

  constructor() {
    console.log('💾 PouchDB Service initialized');
    this.initializeDatabase();
  }

  // ==========================================
  // DATABASE INITIALIZATION
  // ==========================================

  private async initializeDatabase() {
    if (typeof window !== 'undefined' && window.PouchDB) {
      console.log('🔧 Initializing PouchDB...');
      
      // Local database (stored in browser)
      this.db = new window.PouchDB('myapp_local', {
        adapter: 'idb' // Use IndexedDB adapter
      });
      
      // Remote database (CouchDB server)
      this.remoteDb = new window.PouchDB('http://localhost:5984/myapp_db');
      
      console.log('✅ PouchDB initialized');
      console.log('   Local DB:', this.db.name);
      console.log('   Remote DB:', this.remoteDb.name);
      
      // Set up change listener
      this.setupChangeListener();
    } else {
      console.warn('⚠️ PouchDB not available in this environment');
    }
  }

  private setupChangeListener() {
    if (this.db) {
      this.db.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', (change: any) => {
        console.log('🔄 Local database change detected:', change);
      }).on('error', (err: any) => {
        console.error('❌ Change listener error:', err);
      });
    }
  }

  // ==========================================
  // DOCUMENT OPERATIONS
  // ==========================================

  async createDocument<T extends BaseDocument>(doc: Omit<T, '_id' | '_rev'>): Promise<T> {
    console.log('📝 Creating document in PouchDB:', doc);
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    const docWithMeta = {
      ...doc,
      _id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const response = await this.db.put(docWithMeta);
      console.log('✅ Document created in PouchDB:', response);
      
      return {
        ...docWithMeta,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to create document in PouchDB:', error);
      throw error;
    }
  }

  async getDocument<T extends BaseDocument>(id: string): Promise<T> {
    console.log('📖 Getting document from PouchDB:', id);
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    try {
      const doc = await this.db.get(id);
      console.log('✅ Document retrieved from PouchDB:', doc);
      return doc;
    } catch (error) {
      console.error('❌ Failed to get document from PouchDB:', error);
      throw error;
    }
  }

  async updateDocument<T extends BaseDocument>(doc: T): Promise<T> {
    console.log('✏️ Updating document in PouchDB:', doc._id);
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    const updatedDoc = {
      ...doc,
      updatedAt: new Date()
    };

    try {
      const response = await this.db.put(updatedDoc);
      console.log('✅ Document updated in PouchDB:', response);
      
      return {
        ...updatedDoc,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to update document in PouchDB:', error);
      throw error;
    }
  }

  async deleteDocument(doc: BaseDocument): Promise<any> {
    console.log('🗑️ Deleting document from PouchDB:', doc._id);
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    try {
      const response = await this.db.remove(doc);
      console.log('✅ Document deleted from PouchDB:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to delete document from PouchDB:', error);
      throw error;
    }
  }

  // ==========================================
  // QUERYING
  // ==========================================

  async getAllDocuments<T extends BaseDocument>(): Promise<T[]> {
    console.log('📋 Getting all documents from PouchDB');
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    try {
      const response = await this.db.allDocs({
        include_docs: true
      });
      
      const docs = response.rows
        .map((row: any) => row.doc)
        .filter((doc: any) => !doc._id.startsWith('_design'));
      
      console.log('✅ Retrieved documents from PouchDB:', docs.length);
      return docs;
    } catch (error) {
      console.error('❌ Failed to get documents from PouchDB:', error);
      throw error;
    }
  }

  async findDocuments<T extends BaseDocument>(selector: any): Promise<T[]> {
    console.log('🔍 Finding documents in PouchDB with selector:', selector);
    
    if (!this.db) {
      throw new Error('PouchDB not initialized');
    }

    try {
      const response = await this.db.find({
        selector,
        limit: 100
      });
      
      console.log('✅ Found documents in PouchDB:', response.docs.length);
      return response.docs;
    } catch (error) {
      console.error('❌ Failed to find documents in PouchDB:', error);
      throw error;
    }
  }

  // ==========================================
  // SYNCHRONIZATION
  // ==========================================

  startSync(direction: 'push' | 'pull' | 'bidirectional' = 'bidirectional'): void {
    console.log('🔄 Starting synchronization:', direction);
    
    if (!this.db || !this.remoteDb) {
      console.error('❌ Databases not initialized for sync');
      return;
    }

    // Stop existing sync if running
    this.stopSync();

    let syncOptions = {
      live: true,
      retry: true,
      back_off_function: (delay: number) => {
        if (delay === 0) {
          return 1000;
        }
        return delay * 3;
      }
    };

    switch (direction) {
      case 'push':
        this.syncHandler = this.db.replicate.to(this.remoteDb, syncOptions);
        break;
      case 'pull':
        this.syncHandler = this.db.replicate.from(this.remoteDb, syncOptions);
        break;
      case 'bidirectional':
        this.syncHandler = this.db.sync(this.remoteDb, syncOptions);
        break;
    }

    this.syncHandler
      .on('change', (info: any) => {
        console.log('🔄 Sync change:', info);
        this.updateSyncInfo(direction, 'active', info);
      })
      .on('paused', (err: any) => {
        console.log('⏸️ Sync paused:', err);
        this.updateSyncInfo(direction, 'paused');
      })
      .on('active', () => {
        console.log('▶️ Sync resumed');
        this.updateSyncInfo(direction, 'active');
      })
      .on('denied', (err: any) => {
        console.error('🚫 Sync denied:', err);
      })
      .on('complete', (info: any) => {
        console.log('✅ Sync complete:', info);
        this.updateSyncInfo(direction, 'complete', info);
      })
      .on('error', (err: any) => {
        console.error('❌ Sync error:', err);
        this.updateSyncInfo(direction, 'error');
      });
  }

  stopSync(): void {
    if (this.syncHandler) {
      console.log('⏹️ Stopping synchronization');
      this.syncHandler.cancel();
      this.syncHandler = null;
      this.syncInfo$.next(null);
    }
  }

  getSyncInfo(): Observable<SyncInfo | null> {
    return this.syncInfo$.asObservable();
  }

  private updateSyncInfo(direction: string, status: string, info?: any) {
    const syncInfo: SyncInfo = {
      direction: direction as any,
      status: status as any,
      docsWritten: info?.docs_written || 0,
      docsRead: info?.docs_read || 0,
      lastSeq: info?.last_seq || ''
    };
    
    this.syncInfo$.next(syncInfo);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// ==========================================
// 4. COMPARISON DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-database-comparison',
  template: `
    <div>
      <h1>🗄️ CouchDB vs PouchDB Comparison</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>🔑 Key Differences:</h2>
        
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1; background: #fff3e0; padding: 15px;">
            <h3>🗄️ CouchDB</h3>
            <ul>
              <li>✅ Server-side NoSQL database</li>
              <li>✅ HTTP/REST API interface</li>
              <li>✅ Horizontal scaling & clustering</li>
              <li>✅ Multi-version concurrency control</li>
              <li>✅ Map-Reduce views</li>
              <li>✅ Built-in web interface (Fauxton)</li>
              <li>⚠️ Requires server infrastructure</li>
            </ul>
          </div>
          
          <div style="flex: 1; background: #e8f5e9; padding: 15px;">
            <h3>💾 PouchDB</h3>
            <ul>
              <li>✅ Client-side JavaScript database</li>
              <li>✅ Works offline (IndexedDB/WebSQL)</li>
              <li>✅ Syncs with CouchDB</li>
              <li>✅ Same API as CouchDB</li>
              <li>✅ No server setup required</li>
              <li>✅ Perfect for mobile apps</li>
              <li>⚠️ Limited by browser storage</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
        <h2>🧪 Live Demo:</h2>
        
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1;">
            <h3>🗄️ CouchDB Operations</h3>
            <button (click)="testCouchDB()" [disabled]="couchDbLoading">
              {{ couchDbLoading ? 'Testing...' : 'Test CouchDB' }}
            </button>
            <div *ngIf="couchDbResult" style="background: #d4edda; padding: 10px; margin: 10px 0;">
              {{ couchDbResult }}
            </div>
          </div>
          
          <div style="flex: 1;">
            <h3>💾 PouchDB Operations</h3>
            <button (click)="testPouchDB()" [disabled]="pouchDbLoading">
              {{ pouchDbLoading ? 'Testing...' : 'Test PouchDB' }}
            </button>
            <div *ngIf="pouchDbResult" style="background: #d1ecf1; padding: 10px; margin: 10px 0;">
              {{ pouchDbResult }}
            </div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <h3>🔄 Synchronization</h3>
          <div>
            <button (click)="startBidirectionalSync()" [disabled]="!canSync">Start Sync</button>
            <button (click)="stopSync()" [disabled]="!syncActive">Stop Sync</button>
          </div>
          
          <div *ngIf="syncInfo" style="background: #fff3cd; padding: 10px; margin: 10px 0;">
            <strong>Sync Status:</strong> {{ syncInfo.status }}<br>
            <strong>Direction:</strong> {{ syncInfo.direction }}<br>
            <strong>Docs Written:</strong> {{ syncInfo.docsWritten }}<br>
            <strong>Docs Read:</strong> {{ syncInfo.docsRead }}
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0;">
        <h2>🎯 When to Use Each:</h2>
        
        <h3>Use CouchDB when:</h3>
        <ul>
          <li>✅ Building server-side applications</li>
          <li>✅ Need horizontal scaling</li>
          <li>✅ Require complex querying (Map-Reduce)</li>
          <li>✅ Multiple clients need shared data</li>
          <li>✅ Need robust backup and replication</li>
        </ul>
        
        <h3>Use PouchDB when:</h3>
        <ul>
          <li>✅ Building offline-first applications</li>
          <li>✅ Need client-side data storage</li>
          <li>✅ Want to sync with CouchDB</li>
          <li>✅ Building mobile/PWA applications</li>
          <li>✅ Need to work without internet</li>
        </ul>

        <h3>Use Both Together when:</h3>
        <ul>
          <li>🎯 Building offline-capable applications</li>
          <li>🎯 Need data synchronization</li>
          <li>🎯 Want the best of both worlds</li>
        </ul>
      </div>
    </div>
  `
})
export class DatabaseComparisonComponent implements OnInit {
  couchDbLoading = false;
  pouchDbLoading = false;
  couchDbResult = '';
  pouchDbResult = '';
  syncInfo: SyncInfo | null = null;
  syncActive = false;
  canSync = false;

  constructor(
    private couchDbService: CouchDBService,
    private pouchDbService: PouchDBService
  ) {}

  ngOnInit() {
    // Check if PouchDB is available
    this.canSync = typeof window !== 'undefined' && window.PouchDB;
    
    // Subscribe to sync info
    this.pouchDbService.getSyncInfo().subscribe(info => {
      this.syncInfo = info;
      this.syncActive = info?.status === 'active';
    });
  }

  async testCouchDB() {
    this.couchDbLoading = true;
    this.couchDbResult = '';
    
    try {
      // Test CouchDB operations
      console.log('🧪 Testing CouchDB operations...');
      
      // Create database
      await this.couchDbService.createDatabase();
      
      // Create a test document
      const testUser: Omit<UserDocument, '_id' | '_rev'> = {
        type: 'user',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      const createdUser = await this.couchDbService.createDocument<UserDocument>(testUser);
      
      // Read the document back
      const retrievedUser = await this.couchDbService.getDocument<UserDocument>(createdUser._id!);
      
      this.couchDbResult = `✅ CouchDB test successful! Created user: ${retrievedUser.name} (${retrievedUser._id})`;
      
    } catch (error: any) {
      console.error('❌ CouchDB test failed:', error);
      this.couchDbResult = `❌ CouchDB test failed: ${error.message || 'Unknown error'}`;
    } finally {
      this.couchDbLoading = false;
    }
  }

  async testPouchDB() {
    this.pouchDbLoading = true;
    this.pouchDbResult = '';
    
    try {
      console.log('🧪 Testing PouchDB operations...');
      
      // Create a test document
      const testTodo: Omit<TodoDocument, '_id' | '_rev'> = {
        type: 'todo',
        title: 'Test PouchDB',
        description: 'Testing PouchDB functionality',
        completed: false,
        userId: 'test-user',
        createdAt: new Date(),
        priority: 'medium'
      };
      
      const createdTodo = await this.pouchDbService.createDocument<TodoDocument>(testTodo);
      
      // Read the document back
      const retrievedTodo = await this.pouchDbService.getDocument<TodoDocument>(createdTodo._id!);
      
      // Get all documents
      const allDocs = await this.pouchDbService.getAllDocuments();
      
      this.pouchDbResult = `✅ PouchDB test successful! Created todo: ${retrievedTodo.title} (${retrievedTodo._id}). Total docs: ${allDocs.length}`;
      
    } catch (error: any) {
      console.error('❌ PouchDB test failed:', error);
      this.pouchDbResult = `❌ PouchDB test failed: ${error.message || 'Unknown error'}`;
    } finally {
      this.pouchDbLoading = false;
    }
  }

  startBidirectionalSync() {
    console.log('🔄 Starting bidirectional sync...');
    this.pouchDbService.startSync('bidirectional');
  }

  stopSync() {
    console.log('⏹️ Stopping sync...');
    this.pouchDbService.stopSync();
  }
}

/*
==========================================
COUCHDB vs POUCHDB SUMMARY
==========================================

ARCHITECTURE:
CouchDB: Server-side NoSQL database
PouchDB: Client-side JavaScript database

STORAGE:
CouchDB: File system, runs on server
PouchDB: IndexedDB/WebSQL in browser, LevelDB in Node.js

API:
CouchDB: HTTP/REST API
PouchDB: JavaScript API (same interface as CouchDB)

SYNCHRONIZATION:
- PouchDB can sync with CouchDB
- Bidirectional replication
- Offline-first approach
- Conflict resolution

USE CASES:

CouchDB alone:
- Traditional web applications
- Server-side data storage
- Multi-user systems
- APIs and microservices

PouchDB alone:
- Offline-only applications
- Client-side data storage
- Single-user applications
- No server requirements

CouchDB + PouchDB together:
- Offline-first applications
- Mobile applications
- Progressive Web Apps (PWAs)
- Sync-enabled applications
- Multi-device applications

BENEFITS OF COMBINATION:
✅ Work offline completely
✅ Automatic synchronization
✅ Conflict resolution
✅ Eventually consistent
✅ No data loss
✅ Better user experience

CHALLENGES:
⚠️ Conflict resolution complexity
⚠️ Storage limitations (browser)
⚠️ Sync performance with large datasets
⚠️ Learning curve for replication
⚠️ Browser compatibility considerations

BEST PRACTICES:
1. Design for offline-first
2. Handle conflicts gracefully
3. Implement proper error handling
4. Monitor sync performance
5. Test across different browsers
6. Plan for data migration
7. Implement user feedback for sync status
*/
