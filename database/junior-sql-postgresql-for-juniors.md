# SQL and PostgreSQL for junior developers

---

## Table of contents

- [Chapter 1: Relational basics and SQL](#chapter-1-relational-basics-and-sql)
- [Chapter 2: Data types, literals, and NULL](#chapter-2-data-types-literals-and-null)
- [Chapter 3: DDL — defining and changing structure](#chapter-3-ddl-defining-and-changing-structure)
- [Chapter 4: DML — inserting, updating, deleting rows](#chapter-4-dml-inserting-updating-deleting-rows)
- [Chapter 5: Querying with SELECT](#chapter-5-querying-with-select)
- [Chapter 6: JOINs and set operations](#chapter-6-joins-and-set-operations)
- [Chapter 7: Aggregations, GROUP BY, and HAVING](#chapter-7-aggregations-group-by-and-having)
- [Chapter 8: Keys, constraints, and relationships](#chapter-8-keys-constraints-and-relationships)
- [Chapter 9: Indexes and simple performance ideas](#chapter-9-indexes-and-simple-performance-ideas)
- [Chapter 10: Transactions and isolation basics](#chapter-10-transactions-and-isolation-basics)
- [Chapter 11: PostgreSQL features juniors use often](#chapter-11-postgresql-features-juniors-use-often)
- [Chapter 12: From application code — safety and ergonomics](#chapter-12-from-application-code-safety-and-ergonomics)

---

## Chapter 1: Relational basics and SQL

**Question index**

- [**1.1** What is SQL, and what is it *not*?](#11-what-is-sql-and-what-is-it-not)
- [**1.2** What is a relational database?](#12-what-is-a-relational-database)
- [**1.3** What are tables, rows, columns, and primary keys?](#13-what-are-tables-rows-columns-and-primary-keys)
- [**1.4** What is a schema in the logical sense?](#14-what-is-a-schema-in-the-logical-sense)
- [**1.5** How does declarative style in SQL differ from imperative code?](#15-how-does-declarative-style-in-sql-differ-from-imperative-code)

### 1.1 What is SQL, and what is it *not*?

> **Question 1.1** (Chapter 1)

**Answer:** SQL (**Structured Query Language**) is a standardized language for defining, querying, and manipulating data in relational databases. You describe *what* result you want; the database engine decides *how* to retrieve it.

It is **not** a general-purpose programming language (no rich standard for loops, UI, or app structure). Extensions (PL/pgSQL in PostgreSQL, T-SQL in SQL Server) add procedural pieces *inside* the database, but day-to-day “app SQL” is mostly declarative statements.

**Typical uses**
	- Create and alter tables and constraints (**DDL**)
	- Insert, update, delete rows (**DML**)
	- Query and analyze data (**SELECT**)

[↑ Table of contents](#table-of-contents)

### 1.2 What is a relational database?

> **Question 1.2** (Chapter 1)

**Answer:** A **relational database** stores data as relations (usually **tables**): each row is a fact or record, each column is an attribute with a defined type. The model is grounded in relational theory (Codd): keys, constraints, and joins express relationships *as data*, not only as pointers in application memory.

**Why teams use it**
	- **Integrity:** constraints reduce inconsistent states
	- **Concurrent access:** transactions coordinate many clients
	- **Ad hoc queries:** SQL supports reporting without redeploying app code

[↑ Table of contents](#table-of-contents)

### 1.3 What are tables, rows, columns, and primary keys?

> **Question 1.3** (Chapter 1)

**Answer:**

- **Table:** A named collection of rows sharing the same columns (a *relation* in practice).
- **Row (record):** One item in the table; one value per column (or NULL where allowed).
- **Column (field):** A named attribute with a single value per row, constrained by type and optional rules.
- **Primary key:** A column or set of columns that **uniquely identifies** each row. No two rows may share the same primary key values. It is the main handle other tables use in **foreign keys**.

[↑ Table of contents](#table-of-contents)

### 1.4 What is a schema in the logical sense?

> **Question 1.4** (Chapter 1)

**Answer:** In everyday speech, **schema** means the **structure** of the data: table names, columns, types, keys, indexes, and constraints. In **PostgreSQL**, `schema` also means a **namespace** inside a database (e.g. `public.orders`); juniors should know both meanings: *design* vs *SQL object namespace*.

[↑ Table of contents](#table-of-contents)

### 1.5 How does declarative style in SQL differ from imperative code?

> **Question 1.5** (Chapter 1)

**Answer:** **Declarative:** you write *conditions and shapes* of the result (filters, joins, grouping). **Imperative:** you step through collections manually (`for` loops, building lists).

SQL encourages declaring **relations** (“rows that match these predicates”) so the **optimizer** can choose algorithms (indexes, join order). You still need to think procedurally when debugging or tuning, but the *query text* stays declarative.

[↑ Table of contents](#table-of-contents)

---

## Chapter 2: Data types, literals, and NULL

**Question index**

- [**2.1** Why do column types matter?](#21-why-do-column-types-matter)
- [**2.2** What is NULL, and how is it different from zero or empty string?](#22-what-is-null-and-how-is-it-different-from-zero-or-empty-string)
- [**2.3** How do `IS NULL` and `=` differ when searching for NULL?](#23-how-do-is-null-and-differ-when-searching-for-null)
- [**2.4** What are common PostgreSQL types juniors see first?](#24-what-are-common-postgresql-types-juniors-see-first)

### 2.1 Why do column types matter?

> **Question 2.1** (Chapter 2)

**Answer:** Types enforce **valid data**, guide **storage and comparison** rules, and enable **indexes** and operators that fit the domain. Wrong types lead to subtle bugs (sorting `'10'` before `'2'` as text, losing time zones with naive timestamps, etc.).

[↑ Table of contents](#table-of-contents)

### 2.2 What is NULL, and how is it different from zero or empty string?

> **Question 2.2** (Chapter 2)

**Answer:** **NULL** means *unknown* or *not applicable* — not a value. **0** is a number; **`''`** is an empty string. Aggregates like `COUNT(*)` count rows; `COUNT(column)` skips NULLs in that column.

**Important:** `NULL = NULL` is not true in SQL; use **`IS NULL`** / **`IS NOT NULL`**.

[↑ Table of contents](#table-of-contents)

### 2.3 How do `IS NULL` and `=` differ when searching for NULL?

> **Question 2.3** (Chapter 2)

**Answer:** Standard equality does not “match” NULL because NULL is not equal to anything, including itself.

```sql
WHERE col = NULL   -- always unknown (effectively never true); wrong pattern
WHERE col IS NULL  -- correct
```

[↑ Table of contents](#table-of-contents)

### 2.4 What are common PostgreSQL types juniors see first?

> **Question 2.4** (Chapter 2)

**Answer:**

- **`SERIAL` / `BIGSERIAL` / `GENERATED ... AS IDENTITY`** — auto-incrementing identifiers (prefer `IDENTITY` in new PostgreSQL).
- **`INTEGER` / `BIGINT`** — whole numbers.
- **`NUMERIC(p,s)`** — exact decimals (money calculations).
- **`TEXT` / `VARCHAR(n)`** — character data.
- **`BOOLEAN`**
- **`TIMESTAMP WITH TIME ZONE` (`timestamptz`)** — store instants in UTC; convert at display.
- **`DATE`**, **`UUID`**, **`JSONB`** — common in APIs and config.

[↑ Table of contents](#table-of-contents)

---

## Chapter 3: DDL — defining and changing structure

**Question index**

- [**3.1** What is DDL vs DML?](#31-what-is-ddl-vs-dml)
- [**3.2** How do you create a table in PostgreSQL?](#32-how-do-you-create-a-table-in-postgresql)
- [**3.3** What is `ALTER TABLE` used for?](#33-what-is-alter-table-used-for)
- [**3.4** What is `DROP` and when is it dangerous?](#34-what-is-drop-and-when-is-it-dangerous)
- [**3.5** What is `IF EXISTS` / `IF NOT EXISTS`?](#35-what-is-if-exists-if-not-exists)

### 3.1 What is DDL vs DML?

> **Question 3.1** (Chapter 3)

**Answer:**

- **DDL (Data Definition Language):** defines structure — `CREATE`, `ALTER`, `DROP`, `TRUNCATE` (often classed with DDL).
- **DML (Data Manipulation Language):** changes or reads row data — `INSERT`, `UPDATE`, `DELETE`, **`SELECT`** (some authors treat `SELECT` as DQL; practically it is the core read path).

[↑ Table of contents](#table-of-contents)

### 3.2 How do you create a table in PostgreSQL?

> **Question 3.2** (Chapter 3)

**Answer:** Use **`CREATE TABLE`** with column names, types, and optional constraints.

```sql
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

[↑ Table of contents](#table-of-contents)

### 3.3 What is `ALTER TABLE` used for?

> **Question 3.3** (Chapter 3)

**Answer:** It **changes** an existing table: add/drop/rename columns, add/drop constraints, change defaults, etc. In production, some changes are **cheap** (add nullable column) and some are **expensive or locking** (rewrite table for certain type changes) — always check migration guides for your PostgreSQL version.

[↑ Table of contents](#table-of-contents)

### 3.4 What is `DROP` and when is it dangerous?

> **Question 3.4** (Chapter 3)

**Answer:** **`DROP TABLE` / `DROP SCHEMA`** removes objects and their dependent definitions. It is **destructive**; on production systems it is gated by backups, reviews, and least privilege (`DROP` not granted to app roles).

[↑ Table of contents](#table-of-contents)

### 3.5 What is `IF EXISTS` / `IF NOT EXISTS`?

> **Question 3.5** (Chapter 3)

**Answer:** PostgreSQL lets scripts tolerate reruns: `DROP TABLE IF EXISTS ...`, `CREATE TABLE IF NOT EXISTS ...`. Useful in dev scripts; in **migrations**, teams often prefer explicit versioning so you know whether an object *should* already exist.

[↑ Table of contents](#table-of-contents)

---

## Chapter 4: DML — inserting, updating, deleting rows

**Question index**

- [**4.1** How does `INSERT` work?](#41-how-does-insert-work)
- [**4.2** What is an `UPSERT` in PostgreSQL?](#42-what-is-an-upsert-in-postgresql)
- [**4.3** How does `UPDATE` avoid updating everything by mistake?](#43-how-does-update-avoid-updating-everything-by-mistake)
- [**4.4** How does `DELETE` differ from `TRUNCATE`?](#44-how-does-delete-differ-from-truncate)

### 4.1 How does `INSERT` work?

> **Question 4.1** (Chapter 4)

**Answer:** **`INSERT`** adds new rows. You list target columns (recommended) and values or a `SELECT` source.

```sql
INSERT INTO orders (user_id, total_cents)
VALUES (42, 999)
RETURNING id;
```

`RETURNING` is PostgreSQL-specific convenience to get generated keys or columns without a second round trip.

[↑ Table of contents](#table-of-contents)

### 4.2 What is an `UPSERT` in PostgreSQL?

> **Question 4.2** (Chapter 4)

**Answer:** **`INSERT ... ON CONFLICT`** either **skips**, **updates**, or **does nothing** when a unique constraint or primary key would be violated — one atomic statement for “insert or update” patterns.

[↑ Table of contents](#table-of-contents)

### 4.3 How does `UPDATE` avoid updating everything by mistake?

> **Question 4.3** (Chapter 4)

**Answer:** Always use a **`WHERE`** clause scoped to the rows you intend. Without `WHERE`, **every row** in the table matches. In transactions, **`SELECT` the same `WHERE`** first to preview impact.

[↑ Table of contents](#table-of-contents)

### 4.4 How does `DELETE` differ from `TRUNCATE`?

> **Question 4.4** (Chapter 4)

**Answer:**

- **`DELETE`** removes rows matching `WHERE`; logged row-by-row; can fire triggers; can **`RETURNING`** rows.
- **`TRUNCATE`** quickly removes **all** rows from a table (or set of tables); resets storage in bulk; **cannot** use a row `WHERE`; permissions and FK rules differ.

[↑ Table of contents](#table-of-contents)

---

## Chapter 5: Querying with SELECT

**Question index**

- [**5.1** What is the logical order of `SELECT` query clauses?](#51-what-is-the-logical-order-of-select-query-clauses)
- [**5.2** What are `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET`?](#52-what-are-where-order-by-limit-and-offset)
- [**5.3** What are `DISTINCT` and `LIMIT` gotchas?](#53-what-are-distinct-and-limit-gotchas)
- [**5.4** What are subqueries and when are they useful?](#54-what-are-subqueries-and-when-are-they-useful)
- [**5.5** What is `EXISTS` vs `IN` for subqueries?](#55-what-is-exists-vs-in-for-subqueries)
- [**5.6** What are common expression tools (`CASE`, casting)?](#56-what-are-common-expression-tools-case-casting)

### 5.1 What is the logical order of `SELECT` query clauses?

> **Question 5.1** (Chapter 5)

**Answer:** *Logical* evaluation (conceptual) differs from keyword order on the page:

1. **`FROM`** (including joins) → **`WHERE`** → **`GROUP BY`** → **`HAVING`**
2. Window functions (if any) after `HAVING`
3. **`SELECT`** expressions
4. **`DISTINCT`**
5. **`ORDER BY`**
6. **`LIMIT` / `OFFSET`**

So you **cannot** refer to a `SELECT` alias in `WHERE`; use a subquery or repeat the expression.

[↑ Table of contents](#table-of-contents)

### 5.2 What are `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET`?

> **Question 5.2** (Chapter 5)

**Answer:**

- **`WHERE`** — filters **rows** before grouping.
- **`ORDER BY`** — sorts result rows (stable tie-breaking with extra keys is a good habit).
- **`LIMIT`** — caps rows returned (use with **`ORDER BY`** when “top N” matters).
- **`OFFSET`** — skips leading rows (cheap for tiny offsets, costly for large ones; **keyset pagination** is often better at scale).

[↑ Table of contents](#table-of-contents)

### 5.3 What are `DISTINCT` and `LIMIT` gotchas?

> **Question 5.3** (Chapter 5)

**Answer:**

- **`DISTINCT`** deduplicates whole **selected row shapes**; `DISTINCT ON (col)` (PostgreSQL) picks one row per group — learn its required `ORDER BY` rules before using in production.
- **`LIMIT` without `ORDER BY`** returns an **arbitrary** slice unless the plan is deterministic.

[↑ Table of contents](#table-of-contents)

### 5.4 What are subqueries and when are they useful?

> **Question 5.4** (Chapter 5)

**Answer:** A **subquery** is a `SELECT` nested inside another statement. Use for **filtering** (“exists in…”), **derived tables** (`FROM (SELECT ...) AS t`), or **scalar** results (`WHERE id = (SELECT ...)` when exactly one row is guaranteed).

[↑ Table of contents](#table-of-contents)

### 5.5 What is `EXISTS` vs `IN` for subqueries?

> **Question 5.5** (Chapter 5)

**Answer:**

- **`EXISTS (subquery)`** — true if the subquery returns **any** row; often stops early; handles NULL quirks less painfully than `IN` for large sets.
- **`expr IN (subquery)`** — membership test; watch **NULL** behavior: `IN` with NULL in the candidate set can yield unknown results.

[↑ Table of contents](#table-of-contents)

### 5.6 What are common expression tools (`CASE`, casting)?

> **Question 5.6** (Chapter 5)

**Answer:**

- **`CASE WHEN ... THEN ... ELSE ... END`** — conditional expressions in queries.
- **Casting** — `CAST(x AS type)` or PostgreSQL `x::type` for explicit conversions when implicit conversion is wrong or missing.

[↑ Table of contents](#table-of-contents)

---

## Chapter 6: JOINs and set operations

**Question index**

- [**6.1** What is an INNER JOIN?](#61-what-is-an-inner-join)
- [**6.2** What is a LEFT OUTER JOIN?](#62-what-is-a-left-outer-join)
- [**6.3** When do you need RIGHT or FULL OUTER JOIN?](#63-when-do-you-need-right-or-full-outer-join)
- [**6.4** What is a Cartesian product, and why avoid accidental cross joins?](#64-what-is-a-cartesian-product-and-why-avoid-accidental-cross-joins)
- [**6.5** What are `UNION`, `INTERSECT`, and `EXCEPT`?](#65-what-are-union-intersect-and-except)

### 6.1 What is an INNER JOIN?

> **Question 6.1** (Chapter 6)

**Answer:** **INNER JOIN** keeps rows from both sides **only when** the join condition matches. Non-matching rows are dropped from the result.

[↑ Table of contents](#table-of-contents)

### 6.2 What is a LEFT OUTER JOIN?

> **Question 6.2** (Chapter 6)

**Answer:** **LEFT JOIN** keeps **all** rows from the **left** table; for each, matching right rows are attached, or **NULL** right-side columns if no match. Typical for “orders with user info, including orders with missing users” (data-quality cases).

[↑ Table of contents](#table-of-contents)

### 6.3 When do you need RIGHT or FULL OUTER JOIN?

> **Question 6.3** (Chapter 6)

**Answer:** **RIGHT JOIN** is symmetric to LEFT — useful when table order in the query is fixed for readability; many teams **rewrite as LEFT** for consistency. **FULL OUTER JOIN** keeps **all** rows from **both** sides with NULLs where no counterpart exists — handy for diffing or reconciling two datasets.

[↑ Table of contents](#table-of-contents)

### 6.4 What is a Cartesian product, and why avoid accidental cross joins?

> **Question 6.4** (Chapter 6)

**Answer:** A **Cartesian product** multiplies every row of A with every row of B (`CROSS JOIN` or missing join condition). Sometimes intentional (small dimension tables); often a **bug** causing exploding row counts and wrong aggregates.

[↑ Table of contents](#table-of-contents)

### 6.5 What are `UNION`, `INTERSECT`, and `EXCEPT`?

> **Question 6.5** (Chapter 6)

**Answer:** Set operations on **compatible** queries (same column count/types):

- **`UNION`** — combine rows; **`UNION ALL`** keeps duplicates (faster when duplicates are OK)
- **`INTERSECT`** — rows present in both
- **`EXCEPT`** — rows in first query not in second

[↑ Table of contents](#table-of-contents)

---

## Chapter 7: Aggregations, GROUP BY, and HAVING

**Question index**

- [**7.1** What do `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` do?](#71-what-do-count-sum-avg-min-max-do)
- [**7.2** What is `GROUP BY`?](#72-what-is-group-by)
- [**7.3** What is the difference between `WHERE` and `HAVING`?](#73-what-is-the-difference-between-where-and-having)
- [**7.4** What are common aggregation mistakes with NULL?](#74-what-are-common-aggregation-mistakes-with-null)
- [**7.5** What are window functions (high level)?](#75-what-are-window-functions-high-level)

### 7.1 What do `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` do?

> **Question 7.1** (Chapter 7)

**Answer:** They **collapse** many rows into one summary value per group (or one row for the whole table if no `GROUP BY`). **`COUNT(*)`** counts rows; **`COUNT(col)`** counts non-NULL values in `col`.

[↑ Table of contents](#table-of-contents)

### 7.2 What is `GROUP BY`?

> **Question 7.2** (Chapter 7)

**Answer:** **`GROUP BY expr-list`** partitions rows into buckets sharing the same grouping values. **Each non-aggregated** column in `SELECT` must **appear in `GROUP BY`** (or be functionally dependent on grouped columns in PostgreSQL with primary keys — an advanced edge case).

[↑ Table of contents](#table-of-contents)

### 7.3 What is the difference between `WHERE` and `HAVING`?

> **Question 7.3** (Chapter 7)

**Answer:**

- **`WHERE`** filters **raw rows** before aggregation.
- **`HAVING`** filters **groups** after `GROUP BY` (can reference aggregates, e.g. `HAVING COUNT(*) > 1`).

[↑ Table of contents](#table-of-contents)

### 7.4 What are common aggregation mistakes with NULL?

> **Question 7.4** (Chapter 7)

**Answer:** Many aggregates **ignore NULL** inputs; `COUNT(*)` still counts rows with NULLs in some columns. **`AVG`** divides by the count of **non-NULL** values, not total rows — know your business rule when NULL means “zero” vs “unknown.”

[↑ Table of contents](#table-of-contents)

### 7.5 What are window functions (high level)?

> **Question 7.5** (Chapter 7)

**Answer:** **Window functions** compute per-row results **without collapsing** the result set to one row per group — e.g. `ROW_NUMBER()`, `RANK()`, running totals with `SUM(...) OVER (...)`. The `OVER` clause defines the **partition** and **order**.

[↑ Table of contents](#table-of-contents)

---

## Chapter 8: Keys, constraints, and relationships

**Question index**

- [**8.1** What is a foreign key?](#81-what-is-a-foreign-key)
- [**8.2** What do `ON DELETE` / `ON UPDATE` actions mean?](#82-what-do-on-delete-on-update-actions-mean)
- [**8.3** What is a UNIQUE constraint?](#83-what-is-a-unique-constraint)
- [**8.4** What is a CHECK constraint?](#84-what-is-a-check-constraint)

### 8.1 What is a foreign key?

> **Question 8.1** (Chapter 8)

**Answer:** A **foreign key (FK)** declares that values in a column (or set) **must exist** as primary key (or unique) values in a referenced table — the database **enforces** referential integrity so orphans do not appear under normal DML.

[↑ Table of contents](#table-of-contents)

### 8.2 What do `ON DELETE` / `ON UPDATE` actions mean?

> **Question 8.2** (Chapter 8)

**Answer:** When the **parent** row changes, the FK policy decides what happens to **child** rows:

- **`RESTRICT` / `NO ACTION`** — block the parent change if children exist (PostgreSQL timing nuances exist between them)
- **`CASCADE`** — delete/update children in lockstep
- **`SET NULL` / `SET DEFAULT`** — soften the link when the column is nullable or has a default

[↑ Table of contents](#table-of-contents)

### 8.3 What is a UNIQUE constraint?

> **Question 8.3** (Chapter 8)

**Answer:** **UNIQUE** enforces no duplicates on the column set. **Multiple NULLs** are often allowed in PostgreSQL for unique constraints (`NULL` ≠ `NULL` in uniqueness checks) — verify behavior for your version and design (`NULL` email vs “no email” sentinels).

[↑ Table of contents](#table-of-contents)

### 8.4 What is a CHECK constraint?

> **Question 8.4** (Chapter 8)

**Answer:** **`CHECK (boolean expression)`** rejects inserts/updates that violate a row-level rule (e.g. non-negative totals, enum-like ranges). Complex cross-row rules may need triggers or exclusion constraints.

[↑ Table of contents](#table-of-contents)

---

## Chapter 9: Indexes and simple performance ideas

**Question index**

- [**9.1** What is a database index?](#91-what-is-a-database-index)
- [**9.2** When does a B-tree index help?](#92-when-does-a-b-tree-index-help)
- [**9.3** What is `EXPLAIN` / `EXPLAIN ANALYZE` in PostgreSQL?](#93-what-is-explain-explain-analyze-in-postgresql)

### 9.1 What is a database index?

> **Question 9.1** (Chapter 9)

**Answer:** An **index** is an auxiliary structure that speeds up **lookups, joins, and ordering** on chosen columns — like a book index vs scanning every page. Trade-offs: **faster reads**, **slower writes**, **extra disk**.

[↑ Table of contents](#table-of-contents)

### 9.2 When does a B-tree index help?

> **Question 9.2** (Chapter 9)

**Answer:** PostgreSQL’s default **`btree`** helps with equality and range predicates, and can support `ORDER BY` on indexed columns. It does **not** magically fix `LIKE '%text'` leading wildcards or every expression — sometimes you need pattern ops, trigram, or full-text indexes.

[↑ Table of contents](#table-of-contents)

### 9.3 What is `EXPLAIN` / `EXPLAIN ANALYZE` in PostgreSQL?

> **Question 9.3** (Chapter 9)

**Answer:**

- **`EXPLAIN`** shows the **planned** operations and cost estimates.
- **`EXPLAIN ANALYZE`** **runs** the query and shows **actual** timings and row counts — essential for learning why a query is slow (sequential scans, nested loops, hash joins, etc.).

[↑ Table of contents](#table-of-contents)

---

## Chapter 10: Transactions and isolation basics

**Question index**

- [**10.1** What is a transaction?](#101-what-is-a-transaction)
- [**10.2** What does ACID mean at a junior-friendly level?](#102-what-does-acid-mean-at-a-junior-friendly-level)
- [**10.3** What are COMMIT and ROLLBACK?](#103-what-are-commit-and-rollback)
- [**10.4** What are isolation anomalies (dirty read, lost update) in one sentence each?](#104-what-are-isolation-anomalies-dirty-read-lost-update-in-one-sentence-each)

### 10.1 What is a transaction?

> **Question 10.1** (Chapter 10)

**Answer:** A **transaction** bundles one or more statements into an **atomic unit**: all succeed and become **durable** (`COMMIT`), or none take effect (`ROLLBACK`), from other sessions’ viewpoint after commit boundaries.

[↑ Table of contents](#table-of-contents)

### 10.2 What does ACID mean at a junior-friendly level?

> **Question 10.2** (Chapter 10)

**Answer:**

- **Atomicity** — all-or-nothing
- **Consistency** — constraints hold after commit (constraint + business sense)
- **Isolation** — concurrent transactions do not stomp confusingly on each other, per isolation level rules
- **Durability** — committed data survives crashes (within engine guarantees / hardware)

[↑ Table of contents](#table-of-contents)

### 10.3 What are COMMIT and ROLLBACK?

> **Question 10.3** (Chapter 10)

**Answer:** **`COMMIT`** ends the transaction, persisting changes. **`ROLLBACK`** aborts, undoing visible work of the current transaction (within engine rules). Application code should **bound** transactions around multi-step business operations (transfer between accounts, order + inventory).

[↑ Table of contents](#table-of-contents)

### 10.4 What are isolation anomalies (dirty read, lost update) in one sentence each?

> **Question 10.4** (Chapter 10 — overview only)

**Answer:**

- **Dirty read** — reading another transaction’s **uncommitted** changes (rare in PostgreSQL’s practical levels for normal reads)
- **Non-repeatable read** — the **same read** in one transaction sees **different** data later because another transaction **committed** changes
- **Phantom read** — a range/count **changes** between reads due to **new** rows committed by others
- **Lost update** — two transactions each read-then-write and **one update overwrites the other** without seeing its input — mitigated with locking, atomic `UPDATE`, or optimistic versioning

PostgreSQL defaults to **`READ COMMITTED`** per statement snapshot; **`REPEATABLE READ`** and **`SERIALIZABLE`** add stronger guarantees. Details belong in advanced docs; juniors should know **why** payment code uses careful transaction boundaries.

[↑ Table of contents](#table-of-contents)

---

## Chapter 11: PostgreSQL features juniors use often

**Question index**

- [**11.1** How do you run ad hoc SQL against PostgreSQL?](#111-how-do-you-run-ad-hoc-sql-against-postgresql)
- [**11.2** What are schemas (`public`, etc.)?](#112-what-are-schemas-public-etc)
- [**11.3** What is `JSONB` and when is it appropriate?](#113-what-is-jsonb-and-when-is-it-appropriate)
- [**11.4** What are arrays and composite types (awareness)?](#114-what-are-arrays-and-composite-types-awareness)
- [**11.5** What are `CTE`s (`WITH`)?](#115-what-are-ctes-with)
- [**11.6** What is full-text search (very short)?](#116-what-is-full-text-search-very-short)
- [**11.7** What are extensions (e.g. `uuid-ossp`, `pgcrypto`)?](#117-what-are-extensions-eg-uuid-ossp-pgcrypto)
- [**11.8** How do roles, databases, and connections fit together?](#118-how-do-roles-databases-and-connections-fit-together)

### 11.1 How do you run ad hoc SQL against PostgreSQL?

> **Question 11.1** (Chapter 11)

**Answer:** Common paths: **`psql`** CLI, GUI clients (pgAdmin, DBeaver, TablePlus), or app connection strings. **`psql`** supports `\d`, `\dt`, timing, and `\e` for editor integration — worth learning early.

[↑ Table of contents](#table-of-contents)

### 11.2 What are schemas (`public`, etc.)?

> **Question 11.2** (Chapter 11)

**Answer:** A **schema** is a namespace inside a database. Default **`public`** holds many objects unless you organize by module (`billing.invoice`). Search path (`SHOW search_path`) controls unqualified name resolution.

[↑ Table of contents](#table-of-contents)

### 11.3 What is `JSONB` and when is it appropriate?

> **Question 11.3** (Chapter 11)

**Answer:** **`JSONB`** stores JSON in a **binary** form with **indexing** (`GIN`) and operators (`->`, `->>`, `@>`). Good for **semi-structured** or evolving payloads **alongside** relational columns — not a replacement for normalizing core entities you query and join heavily.

[↑ Table of contents](#table-of-contents)

### 11.4 What are arrays and composite types (awareness)?

> **Question 11.4** (Chapter 11)

**Answer:** PostgreSQL supports **column types for arrays** and **row/composite** types. Useful for specialized modeling; misuse can fight relational clarity — default to tables and FKs until you know why an array wins.

[↑ Table of contents](#table-of-contents)

### 11.5 What are `CTE`s (`WITH`)?

> **Question 11.5** (Chapter 11)

**Answer:** **Common table expressions** name subqueries for readability and reuse within one statement. PostgreSQL also supports **`MATERIALIZED`** CTE hints and **recursive** `WITH RECURSIVE` for trees/graphs — advanced but good to recognize in codebases.

[↑ Table of contents](#table-of-contents)

### 11.6 What is full-text search (very short)?

> **Question 11.6** (Chapter 11)

**Answer:** PostgreSQL has **`tsvector` / `tsquery`** and **GIN/GiST** indexes for **language-aware** search beyond naive `ILIKE '%word%'`. Reach for it when user-facing search grows past simple patterns.

[↑ Table of contents](#table-of-contents)

### 11.7 What are extensions (e.g. `uuid-ossp`, `pgcrypto`)?

> **Question 11.7** (Chapter 11)

**Answer:** **Extensions** bundle optional types, functions, and operators (`CREATE EXTENSION`). Examples: UUID helpers, crypto helpers, PostGIS. Require deployment discipline: same extensions in dev/stage/prod.

[↑ Table of contents](#table-of-contents)

### 11.8 How do roles, databases, and connections fit together?

> **Question 11.8** (Chapter 11)

**Answer:** A **server cluster** hosts **databases** (isolated object sets). **Roles** (users/groups) authenticate and hold **privileges** (`GRANT`). App credentials should follow **least privilege** — not superuser, often not owner of all objects.

[↑ Table of contents](#table-of-contents)

---

## Chapter 12: From application code — safety and ergonomics

**Question index**

- [**12.1** What is SQL injection, and how do you prevent it?](#121-what-is-sql-injection-and-how-do-you-prevent-it)
- [**12.2** Why use parameterized queries / bind parameters?](#122-why-use-parameterized-queries-bind-parameters)
- [**12.3** What is the N+1 query problem?](#123-what-is-the-n1-query-problem)
- [**12.4** Why do migrations exist, and what is ordering?](#124-why-do-migrations-exist-and-what-is-ordering)
- [**12.5** What should juniors log and **not** log around databases?](#125-what-should-juniors-log-and-not-log-around-databases)

### 12.1 What is SQL injection, and how do you prevent it?

> **Question 12.1** (Chapter 12)

**Answer:** **SQL injection** is crafting user input that changes query **structure** (breaking out of string literals, stacking statements). Prevent with **parameterized queries**, **ORMs used correctly**, **least privilege** DB roles, and **never** concatenating raw user text into SQL.

[↑ Table of contents](#table-of-contents)

### 12.2 Why use parameterized queries / bind parameters?

> **Question 12.2** (Chapter 12)

**Answer:** Bound parameters send values **separately** from the SQL text so the engine treats them **only as data**. That removes the primary injection class and often helps **plan caching**.

[↑ Table of contents](#table-of-contents)

### 12.3 What is the N+1 query problem?

> **Question 12.3** (Chapter 12)

**Answer:** Loading a list (1 query) then **per item** fetching related rows (**N** queries) — classic ORM footgun. Fix with **joins**, **batched** loads (`WHERE id IN (...)`), or ORM **eager loading** features.

[↑ Table of contents](#table-of-contents)

### 12.4 Why do migrations exist, and what is ordering?

> **Question 12.4** (Chapter 12)

**Answer:** **Migrations** version the **schema** like code: reproducible changes across environments. **Ordering** matters — renames, backfills, and constraint additions need **multi-step** migrations to avoid downtime or locks in large tables.

[↑ Table of contents](#table-of-contents)

### 12.5 What should juniors log and **not** log around databases?

> **Question 12.5** (Chapter 12)

**Answer:** Log **slow queries** (with thresholds), **error codes**, and **correlation IDs** — not **passwords**, full **PAN**, or **PII** payloads. Parameter values in logs need **redaction** policy.

[↑ Table of contents](#table-of-contents)

---

[↑ Top — Table of contents](#table-of-contents)
