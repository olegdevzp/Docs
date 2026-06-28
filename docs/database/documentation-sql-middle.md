# SQL and PostgreSQL — Middle Level Learning Guide

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

Prerequisite: [Junior SQL guide](documentation-sql.md).

---

## Table of Contents

### Themes (chapters)

- [Ch 1 — Data Modeling and Normalization](#ch-1--data-modeling-and-normalization)
- [Ch 2 — Advanced SELECT and Subquery Patterns](#ch-2--advanced-select-and-subquery-patterns)
- [Ch 3 — Window Functions in Depth](#ch-3--window-functions-in-depth)
- [Ch 4 — Index Design Beyond Basics](#ch-4--index-design-beyond-basics)
- [Ch 5 — Query Planning and Optimization](#ch-5--query-planning-and-optimization)
- [Ch 6 — Transactions, Isolation, and Locking](#ch-6--transactions-isolation-and-locking)
- [Ch 7 — Views, Materialized Views, and Derived Data](#ch-7--views-materialized-views-and-derived-data)
- [Ch 8 — Server-Side Logic: Functions and Triggers](#ch-8--server-side-logic-functions-and-triggers)
- [Ch 9 — JSONB and Semi-Structured Data](#ch-9--jsonb-and-semi-structured-data)
- [Ch 10 — Full-Text Search and Pattern Matching](#ch-10--full-text-search-and-pattern-matching)
- [Ch 11 — Schema Migrations and Zero-Downtime Changes](#ch-11--schema-migrations-and-zero-downtime-changes)
- [Ch 12 — Operations and Production Concerns](#ch-12--operations-and-production-concerns)
- [Ch 13 — Security and Access Control](#ch-13--security-and-access-control)

### All questions (quick jump)

- [Q1.1](#q11-what-is-normalization-and-why-use-it) · [Q1.2](#q12-what-are-1nf-2nf-and-3nf-at-a-practical-level) · [Q1.3](#q13-when-is-denormalization-justified) · [Q1.4](#q14-how-do-you-model-one-to-many-and-many-to-many-relationships) · [Q1.5](#q15-surrogate-keys-vs-natural-keys)
- [Q2.1](#q21-what-are-correlated-subqueries) · [Q2.2](#q22-what-problem-do-lateral-joins-solve) · [Q2.3](#q23-cte-vs-subquery-vs-temporary-table) · [Q2.4](#q24-recursive-ctes-for-trees-and-graphs) · [Q2.5](#q25-distinct-on-practical-use-cases)
- [Q3.1](#q31-partition-by-vs-group-by) · [Q3.2](#q32-row_number-vs-rank-vs-dense_rank) · [Q3.3](#q33-lead-lag-and-running-aggregates) · [Q3.4](#q34-filter-clause-on-aggregates) · [Q3.5](#q35-frame-clauses-rows-vs-range)
- [Q4.1](#q41-composite-indexes-and-column-order) · [Q4.2](#q42-partial-indexes) · [Q4.3](#q43-covering-indexes-and-index-only-scans) · [Q4.4](#q44-gin-vs-gist-vs-brin) · [Q4.5](#q45-when-does-adding-an-index-hurt)
- [Q5.1](#q51-how-do-you-read-explain-analyze-output) · [Q5.2](#q52-nested-loop-vs-hash-join-vs-merge-join) · [Q5.3](#q53-statistics-and-analyze) · [Q5.4](#q54-common-causes-of-sequential-scans) · [Q5.5](#q55-prepared-statements-and-plan-caching)
- [Q6.1](#q61-isolation-levels-in-postgresql-in-depth) · [Q6.2](#q62-row-level-locking-and-select-for-update) · [Q6.3](#q63-deadlocks-how-they-happen-and-prevention) · [Q6.4](#q64-serializable-isolation-and-serialization-failures) · [Q6.5](#q65-optimistic-vs-pessimistic-concurrency)
- [Q7.1](#q71-views-vs-materialized-views) · [Q7.2](#q72-refresh-strategies-for-materialized-views) · [Q7.3](#q73-updatable-views-and-limitations) · [Q7.4](#q74-generated-and-computed-columns)
- [Q8.1](#q81-when-to-use-database-functions-vs-app-code) · [Q8.2](#q82-plpgsql-function-basics) · [Q8.3](#q83-triggers-use-cases-and-pitfalls) · [Q8.4](#q84-deferrable-constraints)
- [Q9.1](#q91-jsonb-operators-and-path-queries) · [Q9.2](#q92-gin-indexes-on-jsonb) · [Q9.3](#q93-jsonb-vs-normalized-columns) · [Q9.4](#q94-updating-nested-jsonb)
- [Q10.1](#q101-tsvectortsquery-pipeline) · [Q10.2](#q102-ranking-and-highlighting) · [Q10.3](#q103-pg_trgm-for-fuzzy-and-prefix-search) · [Q10.4](#q104-ilike-vs-full-text-vs-trigram)
- [Q11.1](#q111-expand-contract-migration-pattern) · [Q11.2](#q112-backfilling-data-safely) · [Q11.3](#q113-adding-constraints-without-long-locks) · [Q11.4](#q114-table-partitioning-introduction)
- [Q12.1](#q121-connection-pooling-and-pgbouncer-modes) · [Q12.2](#q122-vacuum-bloat-and-autovacuum) · [Q12.3](#q123-monitoring-slow-queries) · [Q12.4](#q124-backup-types-and-pitr-awareness) · [Q12.5](#q125-read-replicas-and-consistency)
- [Q13.1](#q131-grantrevoke-and-role-inheritance) · [Q13.2](#q132-row-level-security-rls) · [Q13.3](#q133-column-level-privileges) · [Q13.4](#q134-auditing-sensitive-access)

---

## Ch 1 — Data Modeling and Normalization

**Questions in this chapter**

- [Q1.1 What is normalization, and why use it?](#q11-what-is-normalization-and-why-use-it)
- [Q1.2 What are 1NF, 2NF, and 3NF at a practical level?](#q12-what-are-1nf-2nf-and-3nf-at-a-practical-level)
- [Q1.3 When is denormalization justified?](#q13-when-is-denormalization-justified)
- [Q1.4 How do you model one-to-many and many-to-many relationships?](#q14-how-do-you-model-one-to-many-and-many-to-many-relationships)
- [Q1.5 Surrogate keys vs natural keys?](#q15-surrogate-keys-vs-natural-keys)

---

### Q1.1 What is normalization, and why use it?
**Normalization** organizes columns and tables to reduce **redundancy** and **update anomalies**. When the same fact is stored in multiple places, an update in one row can leave others stale; deletes can orphan related facts; inserts can require duplicating data you do not yet have.

Normalized designs make **constraints** express business rules directly (FKs, UNIQUE) and keep writes predictable. The trade-off is more joins at read time — which indexes and careful query design usually handle.

[↑ Ch 1 questions](#ch-1--data-modeling-and-normalization) · [↑ Table of Contents](#table-of-contents)

---

### Q1.2 What are 1NF, 2NF, and 3NF at a practical level?
- **1NF** — atomic column values; no repeating groups (no `tags` column holding `'a,b,c'` when tags are queried independently — use a `tags` table)
- **2NF** — every non-key column depends on the **whole** primary key (matters for composite keys; a line-item table should not store `order_date` if it depends only on `order_id`)
- **3NF** — no non-key column depends on **another non-key column** (do not store `city` and `country` on `users` if `city → country` — use a `cities` reference or store only `city_id`)

Most OLTP schemas target **3NF** unless a measured read pattern justifies controlled denormalization.

	**Q1.2a** Do you need BCNF and higher normal forms daily?

Rarely at application level. Know they exist for edge cases (overlapping candidate keys). 3NF plus clear FK design covers most product schemas.

[↑ Ch 1 questions](#ch-1--data-modeling-and-normalization) · [↑ Table of Contents](#table-of-contents)

---

### Q1.3 When is denormalization justified?
Denormalize when **measured** read cost outweighs write complexity:

- **Read-heavy dashboards** — precomputed counters, summary tables, materialized views
- **Stable derived values** — `order_total` cached if recomputing from line items on every list view is too expensive
- **Audit snapshots** — store `price_at_purchase` even though catalog price changes

Always document **how** denormalized data stays consistent (triggers, batch jobs, event handlers) and prefer **derived tables** over scattered duplicate columns.

[↑ Ch 1 questions](#ch-1--data-modeling-and-normalization) · [↑ Table of Contents](#table-of-contents)

---

### Q1.4 How do you model one-to-many and many-to-many relationships?
- **One-to-many** — FK on the "many" side: `orders.user_id → users.id`
- **Many-to-many** — **junction table** with FKs to both sides, often a composite PK or surrogate PK plus UNIQUE on the pair:

```sql
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id),
  role_id BIGINT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
```

Add columns on the junction table for relationship-specific data (`granted_at`, `granted_by`).

[↑ Ch 1 questions](#ch-1--data-modeling-and-normalization) · [↑ Table of Contents](#table-of-contents)

---

### Q1.5 Surrogate keys vs natural keys?
- **Surrogate key** — artificial identifier (`BIGINT IDENTITY`, UUID) with no business meaning; stable when business identifiers change
- **Natural key** — business identifier (`email`, `country_code`, ISBN) used as PK or UNIQUE

**Surrogate keys** simplify FKs and ORM mapping. **Natural keys** as UNIQUE constraints preserve business rules. Composite natural keys work but make FKs verbose — many teams use surrogate PK + UNIQUE on natural columns.

[↑ Ch 1 questions](#ch-1--data-modeling-and-normalization) · [↑ Table of Contents](#table-of-contents)

---

## Ch 2 — Advanced SELECT and Subquery Patterns

**Questions in this chapter**

- [Q2.1 What are correlated subqueries?](#q21-what-are-correlated-subqueries)
- [Q2.2 What problem do LATERAL joins solve?](#q22-what-problem-do-lateral-joins-solve)
- [Q2.3 CTE vs subquery vs temporary table?](#q23-cte-vs-subquery-vs-temporary-table)
- [Q2.4 Recursive CTEs for trees and graphs](#q24-recursive-ctes-for-trees-and-graphs)
- [Q2.5 `DISTINCT ON` practical use cases](#q25-distinct-on-practical-use-cases)

---

### Q2.1 What are correlated subqueries?
A **correlated subquery** references columns from the outer query. It runs **per outer row** (conceptually), which can be slow at scale but expresses "for each row, find related rows" clearly.

```sql
SELECT u.id, u.email
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id
    AND o.created_at > now() - interval '30 days'
);
```

Often rewrite as **JOIN** or **LATERAL** for performance; keep correlated form when readability wins and volume is small.

[↑ Ch 2 questions](#ch-2--advanced-select-and-subquery-patterns) · [↑ Table of Contents](#table-of-contents)

---

### Q2.2 What problem do LATERAL joins solve?
**`LATERAL`** lets a subquery in `FROM` reference columns from preceding tables — "for each user, get their **latest** order" without a window function in the outer query.

```sql
SELECT u.id, latest.*
FROM users u
JOIN LATERAL (
  SELECT o.id, o.total_cents, o.created_at
  FROM orders o
  WHERE o.user_id = u.id
  ORDER BY o.created_at DESC
  LIMIT 1
) latest ON true;
```

Equivalent patterns: `DISTINCT ON`, `ROW_NUMBER()` in a subquery. Pick the one the team reads fastest.

[↑ Ch 2 questions](#ch-2--advanced-select-and-subquery-patterns) · [↑ Table of Contents](#table-of-contents)

---

### Q2.3 CTE vs subquery vs temporary table?
- **CTE (`WITH`)** — readability, reuse in one statement; PostgreSQL may inline or materialize depending on version and hints (`MATERIALIZED` / `NOT MATERIALIZED`)
- **Subquery in `FROM`** — same engine treatment; sometimes clearer for one-off derived tables
- **Temporary table (`CREATE TEMP TABLE ... AS SELECT`)** — persists for the session; good for **multi-step** ETL, heavy intermediate results, or when you need indexes on intermediate data

Rule of thumb: CTE for clarity in one query; temp table when intermediate data is large and reused across several statements.

[↑ Ch 2 questions](#ch-2--advanced-select-and-subquery-patterns) · [↑ Table of Contents](#table-of-contents)

---

### Q2.4 Recursive CTEs for trees and graphs
**`WITH RECURSIVE`** walks hierarchical data: org charts, comment threads, category trees.

```sql
WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 1 AS depth
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.depth + 1
  FROM categories c
  JOIN category_tree t ON c.parent_id = t.id
)
SELECT * FROM category_tree;
```

Guard against cycles with a **visited set** or **max depth** in production graphs.

[↑ Ch 2 questions](#ch-2--advanced-select-and-subquery-patterns) · [↑ Table of Contents](#table-of-contents)

---

### Q2.5 `DISTINCT ON` practical use cases
PostgreSQL **`DISTINCT ON (expr)`** returns the **first row per group** after `ORDER BY` — ideal for "latest row per key":

```sql
SELECT DISTINCT ON (user_id) user_id, total_cents, created_at
FROM orders
ORDER BY user_id, created_at DESC;
```

**Required:** leading `ORDER BY` keys must start with the `DISTINCT ON` expressions. Without correct `ORDER BY`, results are arbitrary.

[↑ Ch 2 questions](#ch-2--advanced-select-and-subquery-patterns) · [↑ Table of Contents](#table-of-contents)

---

## Ch 3 — Window Functions in Depth

**Questions in this chapter**

- [Q3.1 `PARTITION BY` vs `GROUP BY`](#q31-partition-by-vs-group-by)
- [Q3.2 `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`](#q32-row_number-vs-rank-vs-dense_rank)
- [Q3.3 `LEAD`/`LAG` and running aggregates](#q33-lead-lag-and-running-aggregates)
- [Q3.4 `FILTER` clause on aggregates](#q34-filter-clause-on-aggregates)
- [Q3.5 Frame clauses: `ROWS` vs `RANGE`](#q35-frame-clauses-rows-vs-range)

---

### Q3.1 `PARTITION BY` vs `GROUP BY`
**`GROUP BY`** collapses rows into one row per group. **`PARTITION BY`** (in window functions) keeps all rows and computes a value **per partition** alongside each row.

```sql
-- One row per user (collapsed)
SELECT user_id, SUM(total_cents) FROM orders GROUP BY user_id;

-- Every order row plus user running total (not collapsed)
SELECT id, user_id, total_cents,
       SUM(total_cents) OVER (PARTITION BY user_id) AS user_total
FROM orders;
```

[↑ Ch 3 questions](#ch-3--window-functions-in-depth) · [↑ Table of Contents](#table-of-contents)

---

### Q3.2 `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`
All assign an order within a partition; they differ on **ties**:

- **`ROW_NUMBER()`** — unique sequential numbers (ties get arbitrary order unless tie-break columns in `ORDER BY`)
- **`RANK()`** — ties share rank; next rank skips (`1, 2, 2, 4`)
- **`DENSE_RANK()`** — ties share rank; no gap (`1, 2, 2, 3`)

Use **`ROW_NUMBER()`** for deduplication; **`RANK`/`DENSE_RANK`** for leaderboards with ties.

[↑ Ch 3 questions](#ch-3--window-functions-in-depth) · [↑ Table of Contents](#table-of-contents)

---

### Q3.3 `LEAD`/`LAG` and running aggregates
- **`LAG(col, n)`** / **`LEAD(col, n)`** — previous/next row value in partition order (compare period-over-period, detect gaps)
- **Running total** — `SUM(amount) OVER (ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`

```sql
SELECT created_at, total_cents,
       LAG(total_cents) OVER (ORDER BY created_at) AS prev_total
FROM orders
WHERE user_id = 42;
```

[↑ Ch 3 questions](#ch-3--window-functions-in-depth) · [↑ Table of Contents](#table-of-contents)

---

### Q3.4 `FILTER` clause on aggregates
**`FILTER (WHERE ...)`** computes conditional aggregates in one pass without subqueries:

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'paid')   AS paid_count,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_count
FROM orders;
```

Cleaner than multiple `SUM(CASE WHEN ...)` blocks for simple conditions.

[↑ Ch 3 questions](#ch-3--window-functions-in-depth) · [↑ Table of Contents](#table-of-contents)

---

### Q3.5 Frame clauses: `ROWS` vs `RANGE`
The **`OVER`** frame defines which rows contribute to the window calculation:

- **`ROWS`** — physical row offsets (`1 PRECEDING`, `CURRENT ROW`)
- **`RANGE`** — logical peers sharing the same `ORDER BY` value (peer groups)

Moving averages and rolling sums need explicit frames; default frames differ by function (`ROW_NUMBER` vs `SUM`). Always verify with `EXPLAIN` and sample data when frames matter.

[↑ Ch 3 questions](#ch-3--window-functions-in-depth) · [↑ Table of Contents](#table-of-contents)

---

## Ch 4 — Index Design Beyond Basics

**Questions in this chapter**

- [Q4.1 Composite indexes and column order](#q41-composite-indexes-and-column-order)
- [Q4.2 Partial indexes](#q42-partial-indexes)
- [Q4.3 Covering indexes and index-only scans](#q43-covering-indexes-and-index-only-scans)
- [Q4.4 GIN vs GiST vs BRIN](#q44-gin-vs-gist-vs-brin)
- [Q4.5 When does adding an index hurt?](#q45-when-does-adding-an-index-hurt)

---

### Q4.1 Composite indexes and column order
A **composite (multicolumn) index** `(a, b, c)` supports queries filtering on **leading prefixes**:

- `WHERE a = ?` — yes
- `WHERE a = ? AND b = ?` — yes
- `WHERE b = ?` alone — **no** (generally cannot use index efficiently for `b` alone)

Put **most selective** or **most common filter** columns first, aligned with actual query patterns — not alphabetical column order.

[↑ Ch 4 questions](#ch-4--index-design-beyond-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q4.2 Partial indexes
**Partial indexes** index a **subset** of rows via `WHERE`:

```sql
CREATE INDEX orders_open_idx ON orders (created_at)
WHERE status IN ('pending', 'processing');
```

Smaller index, faster writes, targeted for hot queries (active records, non-deleted rows, recent data).

[↑ Ch 4 questions](#ch-4--index-design-beyond-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q4.3 Covering indexes and index-only scans
An **index-only scan** reads only the index when all needed columns are present. **`INCLUDE`** columns (PostgreSQL 11+) store extra payload without sort key overhead:

```sql
CREATE INDEX orders_user_covering ON orders (user_id)
INCLUDE (total_cents, created_at);
```

Reduces heap fetches for list queries that need only indexed + included columns.

[↑ Ch 4 questions](#ch-4--index-design-beyond-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q4.4 GIN vs GiST vs BRIN
- **`btree`** — equality, ranges, sorting (default)
- **`GIN`** — composite values: `JSONB`, full-text, arrays, `@>` containment
- **`GiST`** — geometric, full-text (older/alternate), nearest-neighbor patterns
- **`BRIN`** — very large, naturally ordered tables (time-series logs) with minimal index size

Match index type to **operator class** used in predicates (`jsonb_path_ops` vs default GIN ops changes size and operators supported).

[↑ Ch 4 questions](#ch-4--index-design-beyond-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q4.5 When does adding an index hurt?
Every index slows **INSERT/UPDATE/DELETE** on covered columns and consumes **disk**. Too many overlapping indexes confuse the planner and increase maintenance (autovacuum, replication lag).

Remove unused indexes after monitoring (`pg_stat_user_indexes`, `idx_scan = 0` over weeks). Do not index every column "just in case."

[↑ Ch 4 questions](#ch-4--index-design-beyond-basics) · [↑ Table of Contents](#table-of-contents)

---

## Ch 5 — Query Planning and Optimization

**Questions in this chapter**

- [Q5.1 How do you read EXPLAIN ANALYZE output?](#q51-how-do-you-read-explain-analyze-output)
- [Q5.2 Nested loop vs hash join vs merge join](#q52-nested-loop-vs-hash-join-vs-merge-join)
- [Q5.3 Statistics and ANALYZE](#q53-statistics-and-analyze)
- [Q5.4 Common causes of sequential scans](#q54-common-causes-of-sequential-scans)
- [Q5.5 Prepared statements and plan caching](#q55-prepared-statements-and-plan-caching)

---

### Q5.1 How do you read EXPLAIN ANALYZE output?
Read **bottom-up** (inner nodes first). Key fields:

- **`Seq Scan`** vs **`Index Scan` / `Index Only Scan`** — table access method
- **`rows=`** estimated vs actual — large mismatch suggests stale stats or correlated predicates
- **`actual time=`** — where time is spent
- **`Buffers:`** — shared hit/read (I/O pressure)
- **`Loops=`** — nested loop iterations (small mis-estimate × many loops = disaster)

Use `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)` in dev/staging, not blindly in prod under load.

[↑ Ch 5 questions](#ch-5--query-planning-and-optimization) · [↑ Table of Contents](#table-of-contents)

---

### Q5.2 Nested loop vs hash join vs merge join
- **Nested loop** — for each outer row, scan inner (often with index). Good for **small** outer sets or highly selective joins
- **Hash join** — build hash table on one side, probe with other. Good for **equality joins** on medium/large sets without helpful indexes
- **Merge join** — both inputs sorted on join key. Good when data already ordered or indexes provide order

The planner picks based on **statistics**, **cost settings**, and available indexes — not your preference.

[↑ Ch 5 questions](#ch-5--query-planning-and-optimization) · [↑ Table of Contents](#table-of-contents)

---

### Q5.3 Statistics and ANALYZE
PostgreSQL stores **histograms and distinct counts** per column. **`ANALYZE`** (or autovacuum's analyze phase) refreshes them. Bad stats → wrong row estimates → wrong join order → slow queries.

After large bulk loads or skew changes, run **`ANALYZE table`** or increase **`default_statistics_target`** for problematic columns (trade-off: longer analyze, better plans).

[↑ Ch 5 questions](#ch-5--query-planning-and-optimization) · [↑ Table of Contents](#table-of-contents)

---

### Q5.4 Common causes of sequential scans
- Missing or wrong **index** for predicate/join columns
- **Low selectivity** — planner correctly chooses seq scan (large fraction of table)
- **Function on column** — `WHERE lower(email) = ?` cannot use plain btree on `email` (use expression index or citext)
- **Implicit cast** — comparing `text` column to integer may disable index use
- **Stale statistics** or **`work_mem`** too low forcing hash spills

Fix the model and predicates before reaching for planner hints.

[↑ Ch 5 questions](#ch-5--query-planning-and-optimization) · [↑ Table of Contents](#table-of-contents)

---

### Q5.5 Prepared statements and plan caching
**Prepared statements** (`PREPARE`, driver bind params) let the server parse once and reuse plans. Benefits: less parse overhead, safer parameter binding.

Caveat: first execution may choose a plan optimized for **initial** parameter values; PostgreSQL 12+ improved **adaptive** behavior for generic plans. For wildly varying parameter skew, test with representative values.

[↑ Ch 5 questions](#ch-5--query-planning-and-optimization) · [↑ Table of Contents](#table-of-contents)

---

## Ch 6 — Transactions, Isolation, and Locking

**Questions in this chapter**

- [Q6.1 Isolation levels in PostgreSQL in depth](#q61-isolation-levels-in-postgresql-in-depth)
- [Q6.2 Row-level locking and `SELECT FOR UPDATE`](#q62-row-level-locking-and-select-for-update)
- [Q6.3 Deadlocks — how they happen and prevention](#q63-deadlocks-how-they-happen-and-prevention)
- [Q6.4 Serializable isolation and serialization failures](#q64-serializable-isolation-and-serialization-failures)
- [Q6.5 Optimistic vs pessimistic concurrency](#q65-optimistic-vs-pessimistic-concurrency)

---

### Q6.1 Isolation levels in PostgreSQL in depth
PostgreSQL supports **`READ UNCOMMITTED`** (behaves as READ COMMITTED), **`READ COMMITTED`** (default), **`REPEATABLE READ`**, **`SERIALIZABLE`**.

- **READ COMMITTED** — each statement sees a fresh snapshot; non-repeatable reads possible within one transaction
- **REPEATABLE READ** — snapshot taken at transaction start; phantom behavior handled differently than SQL standard in PG (uses predicate locking for some cases)
- **SERIALIZABLE** — true serializable isolation via **SSI**; may raise **`40001 serialization_failure`**

Choose level by business tolerance for retries vs anomaly prevention.

[↑ Ch 6 questions](#ch-6--transactions-isolation-and-locking) · [↑ Table of Contents](#table-of-contents)

---

### Q6.2 Row-level locking and `SELECT FOR UPDATE`
**`SELECT ... FOR UPDATE`** locks selected rows until transaction end — **pessimistic** concurrency for inventory, balances, seat booking.

```sql
BEGIN;
SELECT quantity FROM inventory WHERE sku = 'ABC' FOR UPDATE;
-- check quantity, then update
UPDATE inventory SET quantity = quantity - 1 WHERE sku = 'ABC';
COMMIT;
```

Variants: **`FOR NO KEY UPDATE`**, **`FOR SHARE`**, **`SKIP LOCKED`** (job queues), **`NOWAIT`** (fail fast).

[↑ Ch 6 questions](#ch-6--transactions-isolation-and-locking) · [↑ Table of Contents](#table-of-contents)

---

### Q6.3 Deadlocks — how they happen and prevention
A **deadlock** is two transactions waiting on each other's locks. PostgreSQL detects and aborts one with **`deadlock detected`**.

Prevention:
- **Consistent lock order** — always lock rows in same key order
- **Short transactions** — hold locks minimally
- **Retry** on deadlock error in app code
- Avoid user prompts **inside** open transactions

[↑ Ch 6 questions](#ch-6--transactions-isolation-and-locking) · [↑ Table of Contents](#table-of-contents)

---

### Q6.4 Serializable isolation and serialization failures
**`SERIALIZABLE`** prevents anomalies that READ COMMITTED allows, but concurrent conflicting transactions may fail with **`serialization_failure`**. Application must **retry** the whole transaction.

Good for short, critical financial operations; expensive under high contention — measure before defaulting globally.

[↑ Ch 6 questions](#ch-6--transactions-isolation-and-locking) · [↑ Table of Contents](#table-of-contents)

---

### Q6.5 Optimistic vs pessimistic concurrency
- **Pessimistic** — lock rows (`FOR UPDATE`) before change; prevents conflicts upfront; risk of blocking
- **Optimistic** — read without lock, update with **version check**:

```sql
UPDATE accounts
SET balance = balance - 100, version = version + 1
WHERE id = 1 AND version = 5;
-- rows affected 0 → someone else won; retry or fail
```

Optimistic scales better for low collision rates; pessimistic simplifies "must succeed now" flows.

[↑ Ch 6 questions](#ch-6--transactions-isolation-and-locking) · [↑ Table of Contents](#table-of-contents)

---

## Ch 7 — Views, Materialized Views, and Derived Data

**Questions in this chapter**

- [Q7.1 Views vs materialized views](#q71-views-vs-materialized-views)
- [Q7.2 Refresh strategies for materialized views](#q72-refresh-strategies-for-materialized-views)
- [Q7.3 Updatable views and limitations](#q73-updatable-views-and-limitations)
- [Q7.4 Generated and computed columns](#q74-generated-and-computed-columns)

---

### Q7.1 Views vs materialized views
- **View** — saved query; always **current**; no extra storage for data (plan runs on base tables)
- **Materialized view** — stores **snapshot** of results; fast reads; **stale** until refreshed

Use views for abstraction and security; materialized views for expensive aggregations tolerating lag.

[↑ Ch 7 questions](#ch-7--views-materialized-views-and-derived-data) · [↑ Table of Contents](#table-of-contents)

---

### Q7.2 Refresh strategies for materialized views
- **`REFRESH MATERIALIZED VIEW`** — blocks reads on the view (exclusive lock)
- **`REFRESH MATERIALIZED VIEW CONCURRENTLY`** — needs **UNIQUE index** on view; allows reads during refresh; slower

Schedule refreshes via cron/job queue; for near-real-time dashboards, consider incremental maintenance or streaming pipelines instead of full refresh.

[↑ Ch 7 questions](#ch-7--views-materialized-views-and-derived-data) · [↑ Table of Contents](#table-of-contents)

---

### Q7.3 Updatable views and limitations
Simple views (single table, no aggregates/distinct) may be **updatable** — INSERT/UPDATE/DELETE pass through to base table. **`WITH CHECK OPTION`** enforces that new rows remain visible through the view.

Complex views need **`INSTEAD OF` triggers** for write support. Many teams treat views as **read-only** in apps.

[↑ Ch 7 questions](#ch-7--views-materialized-views-and-derived-data) · [↑ Table of Contents](#table-of-contents)

---

### Q7.4 Generated and computed columns
**Generated columns** store values derived from other columns (stored) or compute on read (virtual in some engines; PostgreSQL supports **STORED**):

```sql
ALTER TABLE line_items
ADD COLUMN line_total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED;
```

Keeps derived values consistent without app duplication; indexable when STORED.

[↑ Ch 7 questions](#ch-7--views-materialized-views-and-derived-data) · [↑ Table of Contents](#table-of-contents)

---

## Ch 8 — Server-Side Logic: Functions and Triggers

**Questions in this chapter**

- [Q8.1 When to use database functions vs app code?](#q81-when-to-use-database-functions-vs-app-code)
- [Q8.2 PL/pgSQL function basics](#q82-plpgsql-function-basics)
- [Q8.3 Triggers — use cases and pitfalls](#q83-triggers-use-cases-and-pitfalls)
- [Q8.4 Deferrable constraints](#q84-deferrable-constraints)

---

### Q8.1 When to use database functions vs app code?
**Prefer app code** for business logic needing external APIs, complex branching, and team test workflows.

**Prefer database** for:
- **Constraint enforcement** close to data
- **Atomic multi-table rules** that must not be bypassed by any client
- **Performance-critical** set operations on large datasets already in DB

Avoid scattering critical rules in both layers without clear ownership.

[↑ Ch 8 questions](#ch-8--server-side-logic-functions-and-triggers) · [↑ Table of Contents](#table-of-contents)

---

### Q8.2 PL/pgSQL function basics
PL/pgSQL adds variables, control flow, and SQL inside functions:

```sql
CREATE OR REPLACE FUNCTION deactivate_stale_users(days int)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE affected int;
BEGIN
  UPDATE users
  SET active = false
  WHERE active = true
    AND last_login_at < now() - (days || ' days')::interval;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
```

Mark functions **`STABLE`/`IMMUTABLE`** when accurate — helps optimization. Be careful with **`SECURITY DEFINER`** (runs as owner — privilege escalation risk).

[↑ Ch 8 questions](#ch-8--server-side-logic-functions-and-triggers) · [↑ Table of Contents](#table-of-contents)

---

### Q8.3 Triggers — use cases and pitfalls
**Triggers** run on INSERT/UPDATE/DELETE (or TRUNCATE). Uses: audit log, maintain derived counters, enforce cross-row rules.

**Pitfalls:**
- Hidden logic hard to debug and test
- Unexpected **cascade** of writes (trigger updates another table that triggers again)
- ORM bypass confusion if devs forget triggers exist

Prefer constraints and explicit app transactions when possible; document triggers heavily.

[↑ Ch 8 questions](#ch-8--server-side-logic-functions-and-triggers) · [↑ Table of Contents](#table-of-contents)

---

### Q8.4 Deferrable constraints
**`DEFERRABLE INITIALLY DEFERRED`** FK/CHECK constraints are checked at **COMMIT**, not per statement — allows temporary inconsistency within a transaction (load parent and child in either order).

```sql
SET CONSTRAINTS ALL DEFERRED;
-- multi-step load
COMMIT; -- constraints validated here
```

Useful for bulk loads and complex migrations; rare in everyday OLTP.

[↑ Ch 8 questions](#ch-8--server-side-logic-functions-and-triggers) · [↑ Table of Contents](#table-of-contents)

---

## Ch 9 — JSONB and Semi-Structured Data

**Questions in this chapter**

- [Q9.1 JSONB operators and path queries](#q91-jsonb-operators-and-path-queries)
- [Q9.2 GIN indexes on JSONB](#q92-gin-indexes-on-jsonb)
- [Q9.3 JSONB vs normalized columns](#q93-jsonb-vs-normalized-columns)
- [Q9.4 Updating nested JSONB](#q94-updating-nested-jsonb)

---

### Q9.1 JSONB operators and path queries
Common operators:

- **`->`** — JSON object field (JSON result)
- **`->>`** — field as text
- **`#>`** / **`#>>`** — path by array of keys
- **`@>`** — left contains right JSON
- **`?` / `?|` / `?&`** — key existence

```sql
SELECT id FROM events
WHERE payload @> '{"type": "click"}';

SELECT payload #>> '{user,email}' AS email FROM events;
```

[↑ Ch 9 questions](#ch-9--jsonb-and-semi-structured-data) · [↑ Table of Contents](#table-of-contents)

---

### Q9.2 GIN indexes on JSONB
**GIN** accelerates `@>`, `?`, and path queries:

```sql
CREATE INDEX events_payload_gin ON events USING GIN (payload jsonb_path_ops);
-- or default jsonb_ops for broader operator support
```

`jsonb_path_ops` is smaller/faster for containment; fewer operators supported than default ops class.

[↑ Ch 9 questions](#ch-9--jsonb-and-semi-structured-data) · [↑ Table of Contents](#table-of-contents)

---

### Q9.3 JSONB vs normalized columns
**Normalize** when you filter/join/aggregate on fields regularly, need FK integrity, or report across entities.

**JSONB** when schema evolves quickly, payload is mostly opaque blob, or attributes are sparse/variable. Hybrid is common: core columns relational + `metadata JSONB` for extras.

[↑ Ch 9 questions](#ch-9--jsonb-and-semi-structured-data) · [↑ Table of Contents](#table-of-contents)

---

### Q9.4 Updating nested JSONB
Use **`jsonb_set`**, **`||` merge**, or path updates:

```sql
UPDATE users
SET profile = jsonb_set(profile, '{theme}', '"dark"', true)
WHERE id = 1;

UPDATE users
SET profile = profile || '{"notifications": {"email": true}}'::jsonb
WHERE id = 1;
```

Concurrent updates to same JSON document can **lost-update** — use row versioning or atomic jsonb operators on specific keys.

[↑ Ch 9 questions](#ch-9--jsonb-and-semi-structured-data) · [↑ Table of Contents](#table-of-contents)

---

## Ch 10 — Full-Text Search and Pattern Matching

**Questions in this chapter**

- [Q10.1 `tsvector`/`tsquery` pipeline](#q101-tsvectortsquery-pipeline)
- [Q10.2 Ranking and highlighting](#q102-ranking-and-highlighting)
- [Q10.3 `pg_trgm` for fuzzy and prefix search](#q103-pg_trgm-for-fuzzy-and-prefix-search)
- [Q10.4 `ILIKE` vs full-text vs trigram](#q104-ilike-vs-full-text-vs-trigram)

---

### Q10.1 `tsvector`/`tsquery` pipeline
1. **`to_tsvector('english', text)`** — normalized tokens + positions
2. **`to_tsquery('english', 'postgres & search')`** — search expression (`&`, `|`, `!`, phrase `<->`)
3. Match: **`tsvector @@ tsquery`**

Store **`tsvector`** in a column maintained by trigger or generated column; index with **GIN**.

[↑ Ch 10 questions](#ch-10--full-text-search-and-pattern-matching) · [↑ Table of Contents](#table-of-contents)

---

### Q10.2 Ranking and highlighting
**`ts_rank`** / **`ts_rank_cd`** score matches; **`ts_headline`** returns snippet with `<b>` markers for UI.

```sql
SELECT id, ts_headline('english', body, query) AS snippet,
       ts_rank(to_tsvector('english', body), query) AS rank
FROM articles, to_tsquery('english', 'sql & index') query
WHERE to_tsvector('english', body) @@ query
ORDER BY rank DESC;
```

Tune weights (`setweight`) for title vs body.

[↑ Ch 10 questions](#ch-10--full-text-search-and-pattern-matching) · [↑ Table of Contents](#table-of-contents)

---

### Q10.3 `pg_trgm` for fuzzy and prefix search
**`pg_trgm`** extension supports **`similarity()`**, **`%` operator**, and **`LIKE '%foo%'`** acceleration via GIN/GiST trigram indexes — useful for autocomplete and typo-tolerant name search.

Not a replacement for linguistic full-text (stemming, stop words) — complementary.

[↑ Ch 10 questions](#ch-10--full-text-search-and-pattern-matching) · [↑ Table of Contents](#table-of-contents)

---

### Q10.4 `ILIKE` vs full-text vs trigram
- **`ILIKE '%term%'`** — simple; **no index** unless trigram index; scans large tables
- **Full-text** — token-based, language-aware; best for documents and word queries
- **Trigram** — substring/fuzzy; best for short labels, names, SKUs

Pick by query shape and data size; measure with `EXPLAIN ANALYZE`.

[↑ Ch 10 questions](#ch-10--full-text-search-and-pattern-matching) · [↑ Table of Contents](#table-of-contents)

---

## Ch 11 — Schema Migrations and Zero-Downtime Changes

**Questions in this chapter**

- [Q11.1 Expand-contract migration pattern](#q111-expand-contract-migration-pattern)
- [Q11.2 Backfilling data safely](#q112-backfilling-data-safely)
- [Q11.3 Adding constraints without long locks](#q113-adding-constraints-without-long-locks)
- [Q11.4 Table partitioning introduction](#q114-table-partitioning-introduction)

---

### Q11.1 Expand-contract migration pattern
For breaking schema changes without downtime:

1. **Expand** — add new column/table; deploy app writing both old and new
2. **Migrate** — backfill data
3. **Switch** — deploy app reading new; stop writing old
4. **Contract** — drop old column/table

Never rename-in-place on live systems — treat rename as add+copy+drop.

[↑ Ch 11 questions](#ch-11--schema-migrations-and-zero-downtime-changes) · [↑ Table of Contents](#table-of-contents)

---

### Q11.2 Backfilling data safely
Large **`UPDATE ... SET new_col = ...`** locks rows and generates WAL. Safer approach:

- Batch by primary key ranges (`WHERE id BETWEEN ... LIMIT n`)
- Run during low traffic with **`sleep`** between batches
- Use **`NOT VALID`** constraints then validate later (see Q11.3)
- Track progress; make backfill **idempotent**

[↑ Ch 11 questions](#ch-11--schema-migrations-and-zero-downtime-changes) · [↑ Table of Contents](#table-of-contents)

---

### Q11.3 Adding constraints without long locks
PostgreSQL supports:

```sql
ALTER TABLE orders ADD CONSTRAINT orders_total_nonneg
  CHECK (total_cents >= 0) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_total_nonneg;
```

**`NOT VALID`** adds constraint metadata without scanning existing rows (fast); **`VALIDATE`** scans with **`SHARE UPDATE EXCLUSIVE`** lock (allows reads/writes, blocks schema changes).

For FKs: **`NOT VALID`** then validate similarly.

[↑ Ch 11 questions](#ch-11--schema-migrations-and-zero-downtime-changes) · [↑ Table of Contents](#table-of-contents)

---

### Q11.4 Table partitioning introduction
**Partitioning** splits one logical table into **physical chunks** (often by date or tenant). Benefits: prune partitions in queries, drop old data by **`DROP PARTITION`**, maintenance parallelism.

PostgreSQL **declarative partitioning** (RANGE, LIST, HASH). Middle-level awareness: choose partition key aligned with queries; avoid over-partitioning tiny tables.

[↑ Ch 11 questions](#ch-11--schema-migrations-and-zero-downtime-changes) · [↑ Table of Contents](#table-of-contents)

---

## Ch 12 — Operations and Production Concerns

**Questions in this chapter**

- [Q12.1 Connection pooling and PgBouncer modes](#q121-connection-pooling-and-pgbouncer-modes)
- [Q12.2 VACUUM, bloat, and autovacuum](#q122-vacuum-bloat-and-autovacuum)
- [Q12.3 Monitoring slow queries](#q123-monitoring-slow-queries)
- [Q12.4 Backup types and PITR awareness](#q124-backup-types-and-pitr-awareness)
- [Q12.5 Read replicas and consistency](#q125-read-replicas-and-consistency)

---

### Q12.1 Connection pooling and PgBouncer modes
Each PostgreSQL connection consumes memory. **PgBouncer** (or RDS proxy) multiplexes app connections to fewer server connections.

Modes:
- **Session pooling** — connection assigned for client session duration (safest for prepared statements, temp tables)
- **Transaction pooling** — connection returned after each transaction (highest multiplexing; breaks session state)
- **Statement pooling** — rare; per statement

Match pool mode to app features (migrations often need direct session connection).

[↑ Ch 12 questions](#ch-12--operations-and-production-concerns) · [↑ Table of Contents](#table-of-contents)

---

### Q12.2 VACUUM, bloat, and autovacuum
**UPDATE/DELETE** leave dead tuples; **`VACUUM`** marks space reusable. **Autovacuum** runs automatically; if it falls behind, tables **bloat**, indexes swell, queries slow.

Watch **`n_dead_tup`**, **`last_autovacuum`**, long transactions blocking vacuum (open idle transactions holding old snapshots). **`VACUUM FULL`** rewrites table — locks exclusively; last resort.

[↑ Ch 12 questions](#ch-12--operations-and-production-concerns) · [↑ Table of Contents](#table-of-contents)

---

### Q12.3 Monitoring slow queries
Enable **`log_min_duration_statement`**, use **`pg_stat_statements`** extension for aggregated query stats (total time, calls, mean). Correlate with **`EXPLAIN (ANALYZE)`** in staging.

Alert on rising p95 latency, lock waits, replication lag — not just CPU.

[↑ Ch 12 questions](#ch-12--operations-and-production-concerns) · [↑ Table of Contents](#table-of-contents)

---

### Q12.4 Backup types and PITR awareness
- **Logical backup (`pg_dump`)** — portable SQL/custom format; slower restore; good for subsets
- **Physical base backup + WAL archiving** — supports **point-in-time recovery (PITR)**

Test restores regularly. Backups without tested restore are wishful thinking.

[↑ Ch 12 questions](#ch-12--operations-and-production-concerns) · [↑ Table of Contents](#table-of-contents)

---

### Q12.5 Read replicas and consistency
**Streaming replicas** apply WAL asynchronously (or synchronously with quorum). Reads from replica may lag **seconds** behind primary — **replication lag**.

Do not read-your-writes on replica immediately after write to primary unless app handles staleness or uses synchronous commit (latency cost). Route reporting to replicas; critical reads to primary.

[↑ Ch 12 questions](#ch-12--operations-and-production-concerns) · [↑ Table of Contents](#table-of-contents)

---

## Ch 13 — Security and Access Control

**Questions in this chapter**

- [Q13.1 GRANT/REVOKE and role inheritance](#q131-grantrevoke-and-role-inheritance)
- [Q13.2 Row-level security (RLS)](#q132-row-level-security-rls)
- [Q13.3 Column-level privileges](#q133-column-level-privileges)
- [Q13.4 Auditing sensitive access](#q134-auditing-sensitive-access)

---

### Q13.1 GRANT/REVOKE and role inheritance
PostgreSQL uses **roles** (can be users or groups). **`GRANT SELECT ON table TO app_read`**, **`GRANT USAGE ON SCHEMA`**, **`ALTER DEFAULT PRIVILEGES`** for future objects.

**Role inheritance:** `GRANT read_role TO app_user` — user gets member privileges. App DB user should have **minimal** privileges: DML on needed tables, no **`SUPERUSER`**, no **`BYPASSRLS`**.

[↑ Ch 13 questions](#ch-13--security-and-access-control) · [↑ Table of Contents](#table-of-contents)

---

### Q13.2 Row-level security (RLS)
**RLS** filters rows per session policy — multi-tenant apps where all tenants share tables:

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
```

App sets **`SET app.tenant_id = ...`** per request. Test thoroughly — misconfiguration leaks data across tenants.

[↑ Ch 13 questions](#ch-13--security-and-access-control) · [↑ Table of Contents](#table-of-contents)

---

### Q13.3 Column-level privileges
**`GRANT SELECT (id, name) ON users TO reporter`** hides sensitive columns (`ssn`, `password_hash`) without separate views. Updates can be column-scoped too.

Complement — not replace — app-layer field filtering and encryption for secrets.

[↑ Ch 13 questions](#ch-13--security-and-access-control) · [↑ Table of Contents](#table-of-contents)

---

### Q13.4 Auditing sensitive access
Options: **`pgaudit`** extension, trigger-based audit tables, logical decoding, external SIEM from logs. Log **who** accessed **which** rows/columns for regulated data — not full row payloads unless required.

Balance compliance with log volume and PII in audit trails.

[↑ Ch 13 questions](#ch-13--security-and-access-control) · [↑ Table of Contents](#table-of-contents)

---
