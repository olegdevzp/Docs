// CouchDB Deep Dive - Complete Guide with Angular Integration
import { Injectable, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/*
==========================================
COUCHDB DEEP DIVE
==========================================

CouchDB (Cluster Of Unreliable Commodity Hardware DataBase) is:
- Document-oriented NoSQL database
- Written in Erlang for high concurrency
- Uses HTTP REST API for all operations
- ACID compliant with MVCC (Multi-Version Concurrency Control)
- Built-in replication and clustering
- Map-Reduce views for complex queries
- JSON document storage with attachments
- Conflict-free eventual consistency
- Web-based administration interface (Fauxton)

KEY FEATURES:
✅ Document-oriented storage
✅ RESTful HTTP API
✅ Multi-master replication
✅ Incremental replication
✅ ACID properties
✅ Map-Reduce queries
✅ Full-text search (with plugins)
✅ Attachment support
✅ Conflict resolution
✅ Horizontal scaling
*/

// ==========================================
// 1. COUCHDB DOCUMENT INTERFACES
// ==========================================

interface CouchDBResponse {
  ok: boolean;
  id: string;
  rev: string;
}

interface CouchDBError {
  error: string;
  reason: string;
}

interface CouchDBDocument {
  _id?: string;
  _rev?: string;
  _deleted?: boolean;
  _attachments?: { [key: string]: CouchDBAttachment };
}

interface CouchDBAttachment {
  content_type: string;
  data?: string; // Base64 encoded
  digest?: string;
  encoded_length?: number;
  encoding?: string;
  follows?: boolean;
  length?: number;
  revpos?: number;
  stub?: boolean;
}

interface UserDocument extends CouchDBDocument {
  type: 'user';
  username: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
    privacy: {
      profileVisible: boolean;
      emailVisible: boolean;
    };
  };
  roles: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostDocument extends CouchDBDocument {
  type: 'blog_post';
  title: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  publishedAt?: string;
  isDraft: boolean;
  viewCount: number;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// ==========================================
// 2. COUCHDB SERVICE WITH FULL API
// ==========================================

@Injectable({ providedIn: 'root' })
export class CouchDBService {
  private baseUrl = 'http://localhost:5984';
  private dbName = 'myapp';
  private dbUrl = `${this.baseUrl}/${this.dbName}`;
  private credentials = { username: 'admin', password: 'admin' };

  constructor(private http: HttpClient) {
    console.log('🗄️ CouchDB Service initialized');
    console.log('   Server URL:', this.baseUrl);
    console.log('   Database:', this.dbName);
  }

  // ==========================================
  // AUTHENTICATION & SECURITY
  // ==========================================

  private getAuthHeaders(): HttpHeaders {
    const auth = btoa(`${this.credentials.username}:${this.credentials.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  async authenticate(username: string, password: string): Promise<any> {
    console.log('🔐 Authenticating with CouchDB...');
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post(`${this.baseUrl}/_session`, {
        name: username,
        password: password
      }, { headers }).toPromise();

      console.log('✅ Authentication successful');
      this.credentials = { username, password };
      return response;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/_session`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      return response;
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      throw error;
    }
  }

  // ==========================================
  // DATABASE MANAGEMENT
  // ==========================================

  async createDatabase(dbName?: string): Promise<any> {
    const targetDb = dbName || this.dbName;
    console.log('🔨 Creating CouchDB database:', targetDb);
    
    try {
      const response = await this.http.put(`${this.baseUrl}/${targetDb}`, {}, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Database created successfully');
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

  async deleteDatabase(dbName?: string): Promise<any> {
    const targetDb = dbName || this.dbName;
    console.log('🗑️ Deleting CouchDB database:', targetDb);
    
    try {
      const response = await this.http.delete(`${this.baseUrl}/${targetDb}`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Database deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to delete database:', error);
      throw error;
    }
  }

  async getDatabaseInfo(dbName?: string): Promise<any> {
    const targetDb = dbName || this.dbName;
    
    try {
      const info = await this.http.get(`${this.baseUrl}/${targetDb}`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('📊 Database info:', info);
      return info;
    } catch (error) {
      console.error('❌ Failed to get database info:', error);
      throw error;
    }
  }

  async listAllDatabases(): Promise<string[]> {
    try {
      const databases = await this.http.get<string[]>(`${this.baseUrl}/_all_dbs`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('📋 All databases:', databases);
      return databases || [];
    } catch (error) {
      console.error('❌ Failed to list databases:', error);
      throw error;
    }
  }

  // ==========================================
  // DOCUMENT OPERATIONS (CRUD)
  // ==========================================

  async createDocument<T extends CouchDBDocument>(doc: Omit<T, '_id' | '_rev'>): Promise<T> {
    console.log('📝 Creating document in CouchDB');
    
    const docWithMeta = {
      ...doc,
      _id: this.generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response: any = await this.http.post(this.dbUrl, docWithMeta, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Document created:', response.id);
      
      return {
        ...docWithMeta,
        _id: response.id,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to create document:', error);
      throw error;
    }
  }

  async getDocument<T extends CouchDBDocument>(id: string, rev?: string): Promise<T> {
    console.log('📖 Getting document from CouchDB:', id);
    
    let url = `${this.dbUrl}/${encodeURIComponent(id)}`;
    if (rev) {
      url += `?rev=${rev}`;
    }

    try {
      const doc = await this.http.get<T>(url, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Document retrieved:', doc?._id);
      return doc!;
    } catch (error) {
      console.error('❌ Failed to get document:', error);
      throw error;
    }
  }

  async updateDocument<T extends CouchDBDocument>(doc: T): Promise<T> {
    console.log('✏️ Updating document in CouchDB:', doc._id);
    
    if (!doc._id || !doc._rev) {
      throw new Error('Document must have _id and _rev for update');
    }

    const updatedDoc = {
      ...doc,
      updatedAt: new Date().toISOString()
    };

    try {
      const response: any = await this.http.put(`${this.dbUrl}/${encodeURIComponent(doc._id)}`, updatedDoc, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Document updated:', response.rev);
      
      return {
        ...updatedDoc,
        _rev: response.rev
      } as T;
    } catch (error) {
      console.error('❌ Failed to update document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string, rev: string): Promise<CouchDBResponse> {
    console.log('🗑️ Deleting document from CouchDB:', id);
    
    try {
      const response = await this.http.delete(`${this.dbUrl}/${encodeURIComponent(id)}?rev=${rev}`, {
        headers: this.getAuthHeaders()
      }).toPromise() as CouchDBResponse;
      
      console.log('✅ Document deleted:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  }

  async bulkDocuments<T extends CouchDBDocument>(docs: T[], allOrNothing: boolean = false): Promise<any[]> {
    console.log('📦 Bulk operation with', docs.length, 'documents');
    
    const bulkData = {
      docs: docs.map(doc => ({
        ...doc,
        updatedAt: new Date().toISOString()
      })),
      all_or_nothing: allOrNothing
    };

    try {
      const response = await this.http.post(`${this.dbUrl}/_bulk_docs`, bulkData, {
        headers: this.getAuthHeaders()
      }).toPromise() as any[];
      
      console.log('✅ Bulk operation completed:', response.length, 'results');
      return response;
    } catch (error) {
      console.error('❌ Bulk operation failed:', error);
      throw error;
    }
  }

  // ==========================================
  // QUERYING & VIEWS
  // ==========================================

  async getAllDocuments<T extends CouchDBDocument>(options: any = {}): Promise<T[]> {
    console.log('📋 Getting all documents from CouchDB');
    
    const params = new URLSearchParams({
      include_docs: 'true',
      ...options
    });

    try {
      const response: any = await this.http.get(`${this.dbUrl}/_all_docs?${params}`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      const docs = response.rows
        .map((row: any) => row.doc)
        .filter((doc: any) => doc && !doc._id.startsWith('_design'));
      
      console.log('✅ Retrieved documents:', docs.length);
      return docs;
    } catch (error) {
      console.error('❌ Failed to get all documents:', error);
      throw error;
    }
  }

  async findDocuments<T extends CouchDBDocument>(selector: any, options: any = {}): Promise<T[]> {
    console.log('🔍 Finding documents with selector:', selector);
    
    const findQuery = {
      selector,
      limit: options.limit || 100,
      skip: options.skip || 0,
      sort: options.sort,
      fields: options.fields,
      use_index: options.use_index
    };

    try {
      const response: any = await this.http.post(`${this.dbUrl}/_find`, findQuery, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Found documents:', response.docs.length);
      return response.docs;
    } catch (error) {
      console.error('❌ Failed to find documents:', error);
      throw error;
    }
  }

  async createIndex(indexDef: any): Promise<any> {
    console.log('📇 Creating index:', indexDef);
    
    try {
      const response = await this.http.post(`${this.dbUrl}/_index`, indexDef, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Index created:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to create index:', error);
      throw error;
    }
  }

  async getIndexes(): Promise<any> {
    try {
      const response = await this.http.get(`${this.dbUrl}/_index`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('📇 Database indexes:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get indexes:', error);
      throw error;
    }
  }

  // ==========================================
  // MAP-REDUCE VIEWS
  // ==========================================

  async createDesignDocument(designDoc: any): Promise<any> {
    console.log('🎨 Creating design document:', designDoc._id);
    
    try {
      const response = await this.http.put(`${this.dbUrl}/${designDoc._id}`, designDoc, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Design document created');
      return response;
    } catch (error) {
      console.error('❌ Failed to create design document:', error);
      throw error;
    }
  }

  async queryView<T>(designDoc: string, viewName: string, options: any = {}): Promise<T[]> {
    console.log('🗺️ Querying view:', `${designDoc}/${viewName}`);
    
    const params = new URLSearchParams(options);
    
    try {
      const response: any = await this.http.get(`${this.dbUrl}/_design/${designDoc}/_view/${viewName}?${params}`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ View query completed:', response.rows.length, 'rows');
      return response.rows;
    } catch (error) {
      console.error('❌ View query failed:', error);
      throw error;
    }
  }

  // ==========================================
  // ATTACHMENTS
  // ==========================================

  async addAttachment(docId: string, docRev: string, attachmentName: string, data: Blob, contentType: string): Promise<any> {
    console.log('📎 Adding attachment:', attachmentName, 'to document:', docId);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${this.credentials.username}:${this.credentials.password}`)}`,
      'Content-Type': contentType
    });

    try {
      const response = await this.http.put(
        `${this.dbUrl}/${encodeURIComponent(docId)}/${encodeURIComponent(attachmentName)}?rev=${docRev}`,
        data,
        { headers }
      ).toPromise();
      
      console.log('✅ Attachment added successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to add attachment:', error);
      throw error;
    }
  }

  async getAttachment(docId: string, attachmentName: string): Promise<Blob> {
    console.log('📎 Getting attachment:', attachmentName, 'from document:', docId);
    
    try {
      const response = await this.http.get(
        `${this.dbUrl}/${encodeURIComponent(docId)}/${encodeURIComponent(attachmentName)}`,
        {
          headers: this.getAuthHeaders(),
          responseType: 'blob'
        }
      ).toPromise();
      
      console.log('✅ Attachment retrieved');
      return response!;
    } catch (error) {
      console.error('❌ Failed to get attachment:', error);
      throw error;
    }
  }

  // ==========================================
  // REPLICATION
  // ==========================================

  async startReplication(source: string, target: string, options: any = {}): Promise<any> {
    console.log('🔄 Starting replication from', source, 'to', target);
    
    const replicationDoc = {
      source,
      target,
      ...options
    };

    try {
      const response = await this.http.post(`${this.baseUrl}/_replicate`, replicationDoc, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Replication started:', response);
      return response;
    } catch (error) {
      console.error('❌ Replication failed:', error);
      throw error;
    }
  }

  async getActiveReplications(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/_active_tasks`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('🔄 Active replications:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get active replications:', error);
      throw error;
    }
  }

  // ==========================================
  // CHANGES FEED
  // ==========================================

  getChanges(options: any = {}): Observable<any> {
    console.log('📡 Setting up changes feed');
    
    const params = new URLSearchParams({
      feed: 'continuous',
      heartbeat: '60000',
      include_docs: 'true',
      ...options
    });

    return new Observable(observer => {
      const eventSource = new EventSource(`${this.dbUrl}/_changes?${params}`);
      
      eventSource.onmessage = (event) => {
        try {
          const change = JSON.parse(event.data);
          observer.next(change);
        } catch (error) {
          console.error('❌ Error parsing change:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('❌ Changes feed error:', error);
        observer.error(error);
      };
      
      return () => {
        eventSource.close();
      };
    });
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async compact(): Promise<any> {
    console.log('🗜️ Compacting database');
    
    try {
      const response = await this.http.post(`${this.dbUrl}/_compact`, {}, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      console.log('✅ Database compaction started');
      return response;
    } catch (error) {
      console.error('❌ Failed to compact database:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/_stats`, {
        headers: this.getAuthHeaders()
      }).toPromise();
      
      return response;
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      throw error;
    }
  }
}

// ==========================================
// 3. DEMO COMPONENT
// ==========================================

@Component({
  selector: 'app-couchdb-demo',
  template: `
    <div>
      <h1>🗄️ CouchDB Deep Dive Demo</h1>
      
      <div style="background: #e3f2fd; padding: 20px; margin: 20px 0;">
        <h2>🔑 CouchDB Key Features:</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3>📄 Document Storage</h3>
            <ul>
              <li>✅ JSON documents with schema flexibility</li>
              <li>✅ Automatic versioning (_rev field)</li>
              <li>✅ MVCC (Multi-Version Concurrency Control)</li>
              <li>✅ Binary attachments support</li>
            </ul>
          </div>
          <div>
            <h3>🌐 HTTP API</h3>
            <ul>
              <li>✅ RESTful interface</li>
              <li>✅ Standard HTTP methods (GET, POST, PUT, DELETE)</li>
              <li>✅ JSON request/response</li>
              <li>✅ Built-in web interface (Fauxton)</li>
            </ul>
          </div>
          <div>
            <h3>🔄 Replication</h3>
            <ul>
              <li>✅ Multi-master replication</li>
              <li>✅ Incremental sync</li>
              <li>✅ Conflict detection and resolution</li>
              <li>✅ Filtered replication</li>
            </ul>
          </div>
          <div>
            <h3>🗺️ Querying</h3>
            <ul>
              <li>✅ Map-Reduce views</li>
              <li>✅ Mango queries (MongoDB-style)</li>
              <li>✅ Full-text search (with plugins)</li>
              <li>✅ Secondary indexes</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
        <h2>🧪 Live Demo:</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h3>🗄️ Database Operations</h3>
            <button (click)="testDatabaseOperations()" [disabled]="loading">
              {{ loading ? 'Testing...' : 'Test Database Ops' }}
            </button>
            <div *ngIf="dbResult" [innerHTML]="dbResult" style="background: #d4edda; padding: 10px; margin: 10px 0; white-space: pre-line;"></div>
          </div>
          
          <div>
            <h3>📄 Document Operations</h3>
            <button (click)="testDocumentOperations()" [disabled]="loading">
              {{ loading ? 'Testing...' : 'Test Document Ops' }}
            </button>
            <div *ngIf="docResult" [innerHTML]="docResult" style="background: #d1ecf1; padding: 10px; margin: 10px 0; white-space: pre-line;"></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3>🔍 Query Operations</h3>
            <button (click)="testQueryOperations()" [disabled]="loading">
              {{ loading ? 'Testing...' : 'Test Queries' }}
            </button>
            <div *ngIf="queryResult" [innerHTML]="queryResult" style="background: #fff3cd; padding: 10px; margin: 10px 0; white-space: pre-line;"></div>
          </div>
          
          <div>
            <h3>🔄 Advanced Features</h3>
            <button (click)="testAdvancedFeatures()" [disabled]="loading">
              {{ loading ? 'Testing...' : 'Test Advanced' }}
            </button>
            <div *ngIf="advancedResult" [innerHTML]="advancedResult" style="background: #f8d7da; padding: 10px; margin: 10px 0; white-space: pre-line;"></div>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0;">
        <h2>🎯 CouchDB Use Cases:</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div>
            <h4>📱 Mobile Applications</h4>
            <ul>
              <li>Offline-first architecture</li>
              <li>Sync when connected</li>
              <li>Conflict resolution</li>
            </ul>
          </div>
          <div>
            <h4>📊 Content Management</h4>
            <ul>
              <li>Flexible document schemas</li>
              <li>Version control</li>
              <li>Binary attachments</li>
            </ul>
          </div>
          <div>
            <h4>🌐 Distributed Systems</h4>
            <ul>
              <li>Multi-master replication</li>
              <li>Geographic distribution</li>
              <li>Eventual consistency</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: #e2e3e5; padding: 20px; margin: 20px 0;">
        <h2>⚙️ CouchDB Configuration Tips:</h2>
        
        <h3>🔧 Installation & Setup:</h3>
        <pre style="background: #f8f9fa; padding: 15px; overflow-x: auto;"><code># Docker installation
docker run -p 5984:5984 -d --name couchdb \\
  -e COUCHDB_USER=admin \\
  -e COUCHDB_PASSWORD=admin \\
  couchdb:latest

# Access web interface
http://localhost:5984/_utils

# Test connection
curl http://admin:admin@localhost:5984/</code></pre>

        <h3>🛡️ Security Configuration:</h3>
        <pre style="background: #f8f9fa; padding: 15px; overflow-x: auto;"><code># Enable authentication
curl -X PUT http://admin:admin@localhost:5984/_config/chttpd/require_valid_user \\
  -d '"true"'

# Create user
curl -X PUT http://admin:admin@localhost:5984/_users/org.couchdb.user:john \\
  -H "Content-Type: application/json" \\
  -d '{"name": "john", "password": "secret", "roles": [], "type": "user"}'</code></pre>
      </div>
    </div>
  `
})
export class CouchDBDemoComponent implements OnInit {
  loading = false;
  dbResult = '';
  docResult = '';
  queryResult = '';
  advancedResult = '';

  constructor(private couchDB: CouchDBService) {}

  ngOnInit() {
    console.log('🚀 CouchDB Demo Component initialized');
  }

  async testDatabaseOperations() {
    this.loading = true;
    this.dbResult = '';
    
    try {
      let result = '🧪 <strong>Testing Database Operations:</strong>\n\n';
      
      // Create database
      result += '1️⃣ Creating database...\n';
      await this.couchDB.createDatabase();
      result += '✅ Database created successfully\n\n';
      
      // Get database info
      result += '2️⃣ Getting database info...\n';
      const info = await this.couchDB.getDatabaseInfo();
      result += `✅ Database info: ${info.doc_count} documents, ${info.doc_del_count} deleted\n\n`;
      
      // List all databases
      result += '3️⃣ Listing all databases...\n';
      const databases = await this.couchDB.listAllDatabases();
      result += `✅ Found ${databases.length} databases: ${databases.slice(0, 5).join(', ')}\n\n`;
      
      this.dbResult = result;
      
    } catch (error: any) {
      this.dbResult = `❌ Database operations failed: ${error.message}`;
    } finally {
      this.loading = false;
    }
  }

  async testDocumentOperations() {
    this.loading = true;
    this.docResult = '';
    
    try {
      let result = '🧪 <strong>Testing Document Operations:</strong>\n\n';
      
      // Create user document
      result += '1️⃣ Creating user document...\n';
      const userData: Omit<UserDocument, '_id' | '_rev'> = {
        type: 'user',
        username: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Doe',
        dateOfBirth: '1990-01-15',
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
          zipCode: '10001'
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          privacy: {
            profileVisible: true,
            emailVisible: false
          }
        },
        roles: ['user'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const createdUser = await this.couchDB.createDocument<UserDocument>(userData);
      result += `✅ User created: ${createdUser._id}\n\n`;
      
      // Read document
      result += '2️⃣ Reading document...\n';
      const retrievedUser = await this.couchDB.getDocument<UserDocument>(createdUser._id!);
      result += `✅ Retrieved user: ${retrievedUser.fullName} (${retrievedUser.email})\n\n`;
      
      // Update document
      result += '3️⃣ Updating document...\n';
      retrievedUser.preferences.theme = 'light';
      retrievedUser.lastLogin = new Date().toISOString();
      const updatedUser = await this.couchDB.updateDocument(retrievedUser);
      result += `✅ User updated: theme changed to ${updatedUser.preferences.theme}\n\n`;
      
      this.docResult = result;
      
    } catch (error: any) {
      this.docResult = `❌ Document operations failed: ${error.message}`;
    } finally {
      this.loading = false;
    }
  }

  async testQueryOperations() {
    this.loading = true;
    this.queryResult = '';
    
    try {
      let result = '🧪 <strong>Testing Query Operations:</strong>\n\n';
      
      // Create sample blog posts
      result += '1️⃣ Creating sample blog posts...\n';
      const blogPosts: Omit<BlogPostDocument, '_id' | '_rev'>[] = [
        {
          type: 'blog_post',
          title: 'Getting Started with CouchDB',
          content: 'CouchDB is a powerful NoSQL database...',
          author: 'johndoe',
          tags: ['couchdb', 'nosql', 'database'],
          category: 'Technology',
          publishedAt: new Date().toISOString(),
          isDraft: false,
          viewCount: 150,
          likes: 25,
          comments: [],
          seo: {
            metaTitle: 'CouchDB Tutorial',
            metaDescription: 'Learn CouchDB basics',
            keywords: ['couchdb', 'tutorial', 'nosql']
          }
        },
        {
          type: 'blog_post',
          title: 'Advanced CouchDB Queries',
          content: 'Learn advanced querying techniques...',
          author: 'johndoe',
          tags: ['couchdb', 'queries', 'advanced'],
          category: 'Technology',
          publishedAt: new Date().toISOString(),
          isDraft: false,
          viewCount: 89,
          likes: 12,
          comments: [],
          seo: {
            metaTitle: 'Advanced CouchDB',
            metaDescription: 'Advanced CouchDB techniques',
            keywords: ['couchdb', 'advanced', 'queries']
          }
        }
      ];
      
      const bulkResult = await this.couchDB.bulkDocuments(blogPosts);
      result += `✅ Created ${bulkResult.length} blog posts\n\n`;
      
      // Create index for better query performance
      result += '2️⃣ Creating index...\n';
      await this.couchDB.createIndex({
        index: {
          fields: ['type', 'category', 'publishedAt']
        },
        name: 'blog-posts-index'
      });
      result += '✅ Index created successfully\n\n';
      
      // Query documents
      result += '3️⃣ Querying blog posts...\n';
      const foundPosts = await this.couchDB.findDocuments<BlogPostDocument>({
        type: 'blog_post',
        category: 'Technology',
        isDraft: false
      }, {
        sort: [{ publishedAt: 'desc' }],
        limit: 10
      });
      
      result += `✅ Found ${foundPosts.length} published blog posts:\n`;
      foundPosts.forEach(post => {
        result += `   - "${post.title}" (${post.viewCount} views, ${post.likes} likes)\n`;
      });
      result += '\n';
      
      // Get all documents
      result += '4️⃣ Getting all documents...\n';
      const allDocs = await this.couchDB.getAllDocuments();
      result += `✅ Total documents in database: ${allDocs.length}\n\n`;
      
      this.queryResult = result;
      
    } catch (error: any) {
      this.queryResult = `❌ Query operations failed: ${error.message}`;
    } finally {
      this.loading = false;
    }
  }

  async testAdvancedFeatures() {
    this.loading = true;
    this.advancedResult = '';
    
    try {
      let result = '🧪 <strong>Testing Advanced Features:</strong>\n\n';
      
      // Get database stats
      result += '1️⃣ Getting database statistics...\n';
      try {
        const stats = await this.couchDB.getStats();
        result += '✅ Database stats retrieved\n\n';
      } catch (error) {
        result += '⚠️ Stats not available (might need admin privileges)\n\n';
      }
      
      // Get indexes
      result += '2️⃣ Getting database indexes...\n';
      const indexes = await this.couchDB.getIndexes();
      result += `✅ Found ${indexes.indexes?.length || 0} indexes\n\n`;
      
      // Test changes feed (just setup, not continuous)
      result += '3️⃣ Setting up changes feed...\n';
      const changes$ = this.couchDB.getChanges({ limit: 5 });
      result += '✅ Changes feed configured (check console for real-time updates)\n\n';
      
      // Subscribe to a few changes for demo
      const subscription = changes$.subscribe({
        next: (change) => {
          console.log('📡 Database change detected:', change);
        },
        error: (error) => {
          console.error('❌ Changes feed error:', error);
        }
      });
      
      // Clean up subscription after 5 seconds
      setTimeout(() => {
        subscription.unsubscribe();
        console.log('🛑 Changes feed subscription closed');
      }, 5000);
      
      // Compact database
      result += '4️⃣ Starting database compaction...\n';
      try {
        await this.couchDB.compact();
        result += '✅ Database compaction started\n\n';
      } catch (error) {
        result += '⚠️ Compaction failed (might be in progress or need admin privileges)\n\n';
      }
      
      this.advancedResult = result;
      
    } catch (error: any) {
      this.advancedResult = `❌ Advanced features test failed: ${error.message}`;
    } finally {
      this.loading = false;
    }
  }
}

/*
==========================================
COUCHDB SUMMARY
==========================================

WHAT IS COUCHDB:
- Document-oriented NoSQL database
- Written in Erlang for high concurrency
- HTTP REST API for all operations
- ACID compliant with MVCC
- Built-in replication and clustering

KEY FEATURES:
✅ Schema-free JSON documents
✅ RESTful HTTP API
✅ Multi-master replication
✅ Map-Reduce views
✅ Full-text search (with plugins)
✅ Binary attachments
✅ Conflict resolution
✅ Web-based admin interface (Fauxton)
✅ Horizontal scaling
✅ ACID properties

ARCHITECTURE:
- Documents stored as JSON with _id and _rev
- MVCC ensures no locks during reads
- B+ tree storage for fast access
- Append-only writes for reliability
- Views computed incrementally

QUERYING OPTIONS:
1. Key-based lookup (fastest)
2. Mango queries (MongoDB-style)
3. Map-Reduce views (most flexible)
4. Full-text search (with plugins)

REPLICATION:
- Master-master replication
- Incremental synchronization
- Conflict detection and resolution
- Filtered replication
- Continuous or one-time sync

USE CASES:
✅ Content management systems
✅ Mobile applications (offline-first)
✅ Distributed systems
✅ Document storage and versioning
✅ Real-time applications
✅ Multi-tenant applications

WHEN TO CHOOSE COUCHDB:
✅ Need offline-first capabilities
✅ Require multi-master replication
✅ Have flexible/evolving schemas
✅ Need built-in conflict resolution
✅ Want HTTP API without middleware
✅ Require geographic distribution

WHEN NOT TO CHOOSE:
❌ Need complex relational queries
❌ Require strong consistency (ACID transactions)
❌ Have highly normalized data
❌ Need real-time analytics
❌ Require complex aggregations

PERFORMANCE CHARACTERISTICS:
- Excellent read performance
- Good write performance (append-only)
- Scales horizontally well
- Memory usage grows with working set
- Compaction needed periodically
*/
