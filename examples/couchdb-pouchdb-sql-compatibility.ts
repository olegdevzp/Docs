// CouchDB/PouchDB vs SQL Databases - Compatibility and Integration Guide
import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
==========================================
CouchDB/PouchDB vs SQL - COMPATIBILITY
==========================================

DIRECT ANSWER: NO, CouchDB and PouchDB do NOT work with SQL

CouchDB/PouchDB are:
❌ NOT SQL databases
❌ NOT relational databases  
❌ Do NOT use SQL syntax
✅ NoSQL document databases
✅ Use JSON documents
✅ Use Map-Reduce for queries
✅ Use Mango queries (similar to MongoDB)

HOWEVER, you can:
✅ Integrate with SQL databases
✅ Sync data between CouchDB and SQL
✅ Use both in the same application
✅ Migrate data between them
*/

// ==========================================
// 1. CouchDB/PouchDB QUERY SYNTAX
// ==========================================

interface UserDocument {
  _id?: string;
  _rev?: string;
  type: 'user';
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  isActive: boolean;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class CouchDBQueryExamples {
  
  constructor(private http: HttpClient) {}

  // ==========================================
  // COUCHDB QUERIES (NOT SQL!)
  // ==========================================

  // ❌ This is NOT how CouchDB works (SQL syntax)
  /*
  SELECT * FROM users WHERE age > 25 AND department = 'Engineering';
  SELECT name, email FROM users ORDER BY salary DESC LIMIT 10;
  JOIN users u ON orders.user_id = u.id;
  */

  // ✅ This is how CouchDB actually works (Mango queries)
  async findUsersByAge(minAge: number): Promise<UserDocument[]> {
    const mangoQuery = {
      selector: {
        type: 'user',
        age: { $gt: minAge }  // Greater than minAge
      },
      fields: ['_id', 'name', 'email', 'age'],
      sort: [{ age: 'desc' }],
      limit: 10
    };

    console.log('🔍 CouchDB Mango Query:', mangoQuery);
    
    try {
      const response: any = await this.http.post('/db/_find', mangoQuery).toPromise();
      return response.docs;
    } catch (error) {
      console.error('Query failed:', error);
      return [];
    }
  }

  // ✅ Complex CouchDB query (equivalent to SQL JOIN-like operation)
  async findActiveUsersInDepartment(department: string): Promise<UserDocument[]> {
    const mangoQuery = {
      selector: {
        $and: [
          { type: 'user' },
          { department: department },
          { isActive: true },
          { salary: { $gte: 50000 } }  // Greater than or equal
        ]
      },
      sort: [{ salary: 'desc' }]
    };

    console.log('🔍 Complex CouchDB Query:', mangoQuery);
    
    try {
      const response: any = await this.http.post('/db/_find', mangoQuery).toPromise();
      return response.docs;
    } catch (error) {
      console.error('Complex query failed:', error);
      return [];
    }
  }

  // ✅ Map-Reduce view (CouchDB's way of complex queries)
  async getUsersByDepartmentMapReduce(): Promise<any[]> {
    // This would be defined as a design document in CouchDB
    const mapFunction = `
      function(doc) {
        if (doc.type === 'user') {
          emit(doc.department, {
            name: doc.name,
            salary: doc.salary,
            age: doc.age
          });
        }
      }
    `;

    const reduceFunction = `
      function(keys, values, rereduce) {
        if (rereduce) {
          return sum(values);
        } else {
          return values.length;
        }
      }
    `;

    console.log('🗺️ Map-Reduce Query (not SQL!)');
    
    try {
      // This would query a view in CouchDB
      const response: any = await this.http.get('/db/_design/users/_view/by_department?group=true').toPromise();
      return response.rows;
    } catch (error) {
      console.error('Map-Reduce query failed:', error);
      return [];
    }
  }
}

// ==========================================
// 2. POUCHDB QUERY SYNTAX
// ==========================================

declare global {
  interface Window {
    PouchDB: any;
  }
}

@Injectable({ providedIn: 'root' })
export class PouchDBQueryExamples {
  private db: any;

  constructor() {
    if (typeof window !== 'undefined' && window.PouchDB) {
      this.db = new window.PouchDB('myapp');
    }
  }

  // ✅ PouchDB Mango queries (same as CouchDB, NOT SQL)
  async findUsersPouchDB(criteria: any): Promise<UserDocument[]> {
    if (!this.db) return [];

    // ❌ NOT SQL: SELECT * FROM users WHERE age > 25
    // ✅ PouchDB Mango query:
    const query = {
      selector: {
        type: 'user',
        age: { $gt: 25 },
        isActive: true
      },
      sort: ['name']
    };

    console.log('🔍 PouchDB Query (Mango syntax):', query);

    try {
      const result = await this.db.find(query);
      return result.docs;
    } catch (error) {
      console.error('PouchDB query failed:', error);
      return [];
    }
  }

  // ✅ PouchDB complex query
  async searchUsersPouchDB(searchTerm: string): Promise<UserDocument[]> {
    if (!this.db) return [];

    const query = {
      selector: {
        $and: [
          { type: 'user' },
          {
            $or: [
              { name: { $regex: new RegExp(searchTerm, 'i') } },
              { email: { $regex: new RegExp(searchTerm, 'i') } }
            ]
          }
        ]
      }
    };

    console.log('🔍 PouchDB Search Query:', query);

    try {
      const result = await this.db.find(query);
      return result.docs;
    } catch (error) {
      console.error('PouchDB search failed:', error);
      return [];
    }
  }
}

// ==========================================
// 3. SQL vs NoSQL COMPARISON
// ==========================================

@Component({
  selector: 'app-sql-nosql-comparison',
  template: `
    <div>
      <h1>🗄️ SQL vs CouchDB/PouchDB Comparison</h1>
      
      <div style="background: #f8d7da; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>❌ CouchDB/PouchDB DO NOT Support SQL</h2>
        <p><strong>They are NoSQL document databases, not relational databases!</strong></p>
      </div>

      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <div style="flex: 1; background: #e3f2fd; padding: 15px; border-radius: 8px;">
          <h3>🔤 SQL Database (MySQL, PostgreSQL)</h3>
          <pre><code>-- SQL Syntax
SELECT u.name, u.email, d.department_name
FROM users u
JOIN departments d ON u.dept_id = d.id
WHERE u.age > 25 AND u.is_active = true
ORDER BY u.salary DESC
LIMIT 10;</code></pre>
          
          <h4>Features:</h4>
          <ul>
            <li>✅ Structured data (tables, rows, columns)</li>
            <li>✅ ACID transactions</li>
            <li>✅ Complex JOINs</li>
            <li>✅ Mature ecosystem</li>
            <li>✅ Strong consistency</li>
          </ul>
        </div>

        <div style="flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;">
          <h3>📄 CouchDB/PouchDB (NoSQL)</h3>
          <pre><code>// Mango Query Syntax
{
  "selector": {
    "type": "user",
    "age": { "$gt": 25 },
    "isActive": true
  },
  "sort": [{"salary": "desc"}],
  "limit": 10
}</code></pre>
          
          <h4>Features:</h4>
          <ul>
            <li>✅ Flexible JSON documents</li>
            <li>✅ Built-in replication</li>
            <li>✅ Offline-first capability</li>
            <li>✅ Horizontal scaling</li>
            <li>✅ Eventual consistency</li>
          </ul>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>🔄 Integration Strategies</h2>
        
        <h3>1. Hybrid Architecture (Use Both)</h3>
        <ul>
          <li>✅ SQL for complex business logic and reporting</li>
          <li>✅ CouchDB/PouchDB for offline-first features</li>
          <li>✅ Sync data between systems</li>
        </ul>

        <h3>2. Data Migration</h3>
        <ul>
          <li>✅ Convert SQL data to JSON documents</li>
          <li>✅ ETL processes to sync data</li>
          <li>✅ API bridges between systems</li>
        </ul>

        <h3>3. Use Case Separation</h3>
        <ul>
          <li>✅ SQL for transactional data</li>
          <li>✅ NoSQL for user-generated content</li>
          <li>✅ NoSQL for caching and sessions</li>
        </ul>
      </div>

      <div>
        <h2>🧪 Query Examples:</h2>
        <button (click)="showQueryComparison()">Show SQL vs NoSQL Examples</button>
        
        <div *ngIf="showComparison" style="margin-top: 20px;">
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <h4>❌ SQL (Not supported in CouchDB)</h4>
              <pre style="background: #f8d7da; padding: 10px;">{{ sqlExamples }}</pre>
            </div>
            <div style="flex: 1;">
              <h4>✅ CouchDB/PouchDB (Actual syntax)</h4>
              <pre style="background: #d4edda; padding: 10px;">{{ nosqlExamples }}</pre>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #e2e3e5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>🎯 Decision Guide:</h2>
        
        <h3>Choose SQL Database when:</h3>
        <ul>
          <li>✅ Complex relationships between data</li>
          <li>✅ Need ACID transactions</li>
          <li>✅ Strong consistency required</li>
          <li>✅ Complex reporting and analytics</li>
          <li>✅ Team familiar with SQL</li>
        </ul>

        <h3>Choose CouchDB/PouchDB when:</h3>
        <ul>
          <li>✅ Need offline-first applications</li>
          <li>✅ Flexible, evolving data schemas</li>
          <li>✅ Horizontal scaling required</li>
          <li>✅ Multi-device synchronization</li>
          <li>✅ Document-oriented data</li>
        </ul>

        <h3>Use Both when:</h3>
        <ul>
          <li>🎯 Building complex applications</li>
          <li>🎯 Need both online and offline capabilities</li>
          <li>🎯 Different parts have different requirements</li>
        </ul>
      </div>
    </div>
  `
})
export class SqlNoSqlComparisonComponent {
  showComparison = false;
  
  sqlExamples = `-- These DON'T work in CouchDB/PouchDB:

SELECT * FROM users 
WHERE age > 25;

SELECT u.name, d.department_name
FROM users u
JOIN departments d ON u.dept_id = d.id;

UPDATE users 
SET salary = salary * 1.1 
WHERE department = 'Engineering';

DELETE FROM users 
WHERE last_login < '2023-01-01';`;

  nosqlExamples = `// These DO work in CouchDB/PouchDB:

// Find users older than 25
{
  "selector": {
    "type": "user",
    "age": { "$gt": 25 }
  }
}

// Complex query with multiple conditions
{
  "selector": {
    "$and": [
      { "type": "user" },
      { "department": "Engineering" },
      { "isActive": true }
    ]
  }
}

// Update document (get, modify, put)
const user = await db.get('user123');
user.salary = user.salary * 1.1;
await db.put(user);

// Delete document
const user = await db.get('user123');
await db.remove(user);`;

  showQueryComparison() {
    this.showComparison = !this.showComparison;
  }
}

// ==========================================
// 4. INTEGRATION PATTERNS
// ==========================================

@Injectable({ providedIn: 'root' })
export class HybridDatabaseService {
  
  constructor(private http: HttpClient) {}

  // ==========================================
  // PATTERN 1: SQL + CouchDB HYBRID
  // ==========================================
  
  async saveUserHybrid(userData: any): Promise<void> {
    console.log('💾 Saving user data in hybrid architecture');
    
    try {
      // Save core user data in SQL database
      const sqlUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        department_id: userData.departmentId
      };
      
      await this.http.post('/api/sql/users', sqlUser).toPromise();
      console.log('✅ User saved to SQL database');
      
      // Save user preferences and documents in CouchDB
      const couchUser = {
        _id: `user_${userData.id}`,
        type: 'user_profile',
        preferences: userData.preferences,
        documents: userData.documents,
        settings: userData.settings
      };
      
      await this.http.post('/api/couchdb/users', couchUser).toPromise();
      console.log('✅ User profile saved to CouchDB');
      
    } catch (error) {
      console.error('❌ Hybrid save failed:', error);
      throw error;
    }
  }

  // ==========================================
  // PATTERN 2: DATA SYNCHRONIZATION
  // ==========================================
  
  async syncSqlToCouchDB(): Promise<void> {
    console.log('🔄 Syncing SQL data to CouchDB');
    
    try {
      // Get data from SQL database
      const sqlUsers: any = await this.http.get('/api/sql/users').toPromise();
      
      // Transform and save to CouchDB
      for (const sqlUser of sqlUsers) {
        const couchDoc = {
          _id: `sql_user_${sqlUser.id}`,
          type: 'synced_user',
          originalId: sqlUser.id,
          name: sqlUser.name,
          email: sqlUser.email,
          syncedAt: new Date().toISOString()
        };
        
        await this.http.put(`/api/couchdb/users/${couchDoc._id}`, couchDoc).toPromise();
      }
      
      console.log('✅ SQL to CouchDB sync completed');
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      throw error;
    }
  }

  // ==========================================
  // PATTERN 3: API BRIDGE
  // ==========================================
  
  async queryBothDatabases(criteria: any): Promise<any> {
    console.log('🌉 Querying both SQL and CouchDB');
    
    try {
      // Query SQL database
      const sqlQuery = `
        SELECT id, name, email, department_id 
        FROM users 
        WHERE age > ? AND is_active = true
      `;
      const sqlResults: any = await this.http.post('/api/sql/query', {
        query: sqlQuery,
        params: [criteria.minAge]
      }).toPromise();
      
      // Query CouchDB
      const couchQuery = {
        selector: {
          type: 'user_profile',
          'preferences.theme': criteria.theme
        }
      };
      const couchResults: any = await this.http.post('/api/couchdb/_find', couchQuery).toPromise();
      
      // Combine results
      const combinedResults = {
        sqlUsers: sqlResults,
        couchProfiles: couchResults.docs,
        totalCount: sqlResults.length + couchResults.docs.length
      };
      
      console.log('✅ Combined query results:', combinedResults);
      return combinedResults;
      
    } catch (error) {
      console.error('❌ Bridge query failed:', error);
      throw error;
    }
  }
}

/*
==========================================
SUMMARY: SQL vs CouchDB/PouchDB
==========================================

DIRECT ANSWER: NO - CouchDB and PouchDB do NOT support SQL

WHAT THEY ARE:
- CouchDB/PouchDB are NoSQL document databases
- They use JSON documents, not tables
- They use Mango queries, not SQL
- They use Map-Reduce for complex queries

QUERY COMPARISON:
SQL:        SELECT * FROM users WHERE age > 25
CouchDB:    { "selector": { "age": { "$gt": 25 } } }

INTEGRATION OPTIONS:
1. Hybrid Architecture - Use both SQL and CouchDB
2. Data Synchronization - Sync between systems
3. API Bridges - Query both systems
4. Migration - Convert from SQL to NoSQL or vice versa

WHEN TO USE EACH:
SQL:
✅ Complex relationships
✅ ACID transactions
✅ Strong consistency
✅ Complex reporting

CouchDB/PouchDB:
✅ Offline-first apps
✅ Flexible schemas
✅ Horizontal scaling
✅ Multi-device sync

BOTTOM LINE:
CouchDB/PouchDB are NOT SQL databases, but you can integrate them
with SQL databases in hybrid architectures for the best of both worlds.
*/
