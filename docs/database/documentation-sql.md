# SQL and PostgreSQL — Junior Learning Guide

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

---

## Table of Contents

### Themes (chapters)

- [Ch 1 — Relational Basics and SQL](#ch-1--relational-basics-and-sql)
- [Ch 2 — Data Types, Literals, and NULL](#ch-2--data-types-literals-and-null)
- [Ch 3 — DDL: Defining and Changing Structure](#ch-3--ddl-defining-and-changing-structure)
- [Ch 4 — DML: Inserting, Updating, Deleting Rows](#ch-4--dml-inserting-updating-deleting-rows)
- [Ch 5 — Querying with SELECT](#ch-5--querying-with-select)
- [Ch 6 — JOINs and Set Operations](#ch-6--joins-and-set-operations)
- [Ch 7 — Aggregations, GROUP BY, and HAVING](#ch-7--aggregations-group-by-and-having)
- [Ch 8 — Keys, Constraints, and Relationships](#ch-8--keys-constraints-and-relationships)
- [Ch 9 — Indexes and Simple Performance Ideas](#ch-9--indexes-and-simple-performance-ideas)
- [Ch 10 — Transactions and Isolation Basics](#ch-10--transactions-and-isolation-basics)
- [Ch 11 — PostgreSQL Features Juniors Use Often](#ch-11--postgresql-features-juniors-use-often)
- [Ch 12 — From Application Code: Safety and Ergonomics](#ch-12--from-application-code-safety-and-ergonomics)

### All questions (quick jump)

- [Q1.1](#q11-what-is-sql-and-what-is-it-not) · [Q1.2](#q12-what-is-a-relational-database) · [Q1.3](#q13-what-are-tables-rows-columns-and-primary-keys) · [Q1.4](#q14-what-is-a-schema-in-the-logical-sense) · [Q1.5](#q15-how-does-declarative-style-in-sql-differ-from-imperative-code)
- [Q2.1](#q21-why-do-column-types-matter) · [Q2.2](#q22-what-is-null-and-how-is-it-different-from-zero-or-empty-string) · [Q2.3](#q23-how-do-is-null-and--differ-when-searching-for-null) · [Q2.4](#q24-what-are-common-postgresql-types-juniors-see-first)
- [Q3.1](#q31-what-is-ddl-vs-dml) · [Q3.2](#q32-how-do-you-create-a-table-in-postgresql) · [Q3.3](#q33-what-is-alter-table-used-for) · [Q3.4](#q34-what-is-drop-and-when-is-it-dangerous) · [Q3.5](#q35-what-is-if-exists--if-not-exists)
- [Q4.1](#q41-how-does-insert-work) · [Q4.2](#q42-what-is-an-upsert-in-postgresql) · [Q4.3](#q43-how-does-update-avoid-updating-everything-by-mistake) · [Q4.4](#q44-how-does-delete-differ-from-truncate)
- [Q5.1](#q51-what-is-the-logical-order-of-select-query-clauses) · [Q5.2](#q52-what-are-where-order-by-limit-and-offset) · [Q5.3](#q53-what-are-distinct-and-limit-gotchas) · [Q5.4](#q54-what-are-subqueries-and-when-are-they-useful) · [Q5.5](#q55-what-is-exists-vs-in-for-subqueries) · [Q5.6](#q56-what-are-common-expression-tools-case-casting)
- [Q6.1](#q61-what-is-an-inner-join) · [Q6.2](#q62-what-is-a-left-outer-join) · [Q6.3](#q63-when-do-you-need-right-or-full-outer-join) · [Q6.4](#q64-what-is-a-cartesian-product-and-why-avoid-accidental-cross-joins) · [Q6.5](#q65-what-are-union-intersect-and-except)
- [Q7.1](#q71-what-do-count-sum-avg-min-max-do) · [Q7.2](#q72-what-is-group-by) · [Q7.3](#q73-what-is-the-difference-between-where-and-having) · [Q7.4](#q74-what-are-common-aggregation-mistakes-with-null) · [Q7.5](#q75-what-are-window-functions-high-level)
- [Q8.1](#q81-what-is-a-foreign-key) · [Q8.2](#q82-what-do-on-delete--on-update-actions-mean) · [Q8.3](#q83-what-is-a-unique-constraint) · [Q8.4](#q84-what-is-a-check-constraint)
- [Q9.1](#q91-what-is-a-database-index) · [Q9.2](#q92-when-does-a-b-tree-index-help) · [Q9.3](#q93-what-is-explain--explain-analyze-in-postgresql)
- [Q10.1](#q101-what-is-a-transaction) · [Q10.2](#q102-what-does-acid-mean-at-a-junior-friendly-level) · [Q10.3](#q103-what-are-commit-and-rollback) · [Q10.4](#q104-what-are-isolation-anomalies-dirty-read-lost-update-in-one-sentence-each)
- [Q11.1](#q111-how-do-you-run-ad-hoc-sql-against-postgresql) · [Q11.2](#q112-what-are-schemas-public-etc) · [Q11.3](#q113-what-is-jsonb-and-when-is-it-appropriate) · [Q11.4](#q114-what-are-arrays-and-composite-types-awareness) · [Q11.5](#q115-what-are-ctes-with) · [Q11.6](#q116-what-is-full-text-search-very-short) · [Q11.7](#q117-what-are-extensions-eg-uuid-ossp-pgcrypto) · [Q11.8](#q118-how-do-roles-databases-and-connections-fit-together)
- [Q12.1](#q121-what-is-sql-injection-and-how-do-you-prevent-it) · [Q12.2](#q122-why-use-parameterized-queries--bind-parameters) · [Q12.3](#q123-what-is-the-n1-query-problem) · [Q12.4](#q124-why-do-migrations-exist-and-what-is-ordering) · [Q12.5](#q125-what-should-juniors-log-and-not-log-around-databases)

---

## Ch 1 — Relational Basics and SQL

**Questions in this chapter**

- [Q1.1 What is SQL, and what is it *not*?](#q11-what-is-sql-and-what-is-it-not)
- [Q1.2 What is a relational database?](#q12-what-is-a-relational-database)
- [Q1.3 What are tables, rows, columns, and primary keys?](#q13-what-are-tables-rows-columns-and-primary-keys)
- [Q1.4 What is a schema in the logical sense?](#q14-what-is-a-schema-in-the-logical-sense)
- [Q1.5 How does declarative style in SQL differ from imperative code?](#q15-how-does-declarative-style-in-sql-differ-from-imperative-code)

---

### Q1.1 What is SQL, and what is it *not*?
SQL (**Structured Query Language**) is a standardized language for defining, querying, and manipulating data in relational databases. You describe *what* result you want; the database engine decides *how* to retrieve it.

It is **not** a general-purpose programming language — there is no rich standard for loops, UI, or app structure. Extensions such as PL/pgSQL in PostgreSQL or T-SQL in SQL Server add procedural pieces *inside* the database, but day-to-day application SQL is mostly declarative statements.

**Typical uses:**
- Create and alter tables and constraints (**DDL**)
- Insert, update, delete rows (**DML**)
- Query and analyze data (**SELECT**)

	**Q1.1a** Is SQL the same on every database?

Core SQL is largely portable, but each engine (PostgreSQL, MySQL, SQL Server, SQLite) adds dialect-specific syntax, types, and functions. Juniors should learn standard patterns first, then read their engine's docs for differences.

[↑ Ch 1 questions](#ch-1--relational-basics-and-sql) · [↑ Table of Contents](#table-of-contents)

---

### Q1.2 What is a relational database?
A **relational database** stores data as relations (usually **tables**): each row is a fact or record, each column is an attribute with a defined type. The model is grounded in relational theory (Codd): keys, constraints, and joins express relationships *as data*, not only as pointers in application memory.

**Why teams use it:**
- **Integrity** — constraints reduce inconsistent states
- **Concurrent access** — transactions coordinate many clients
- **Ad hoc queries** — SQL supports reporting without redeploying app code

[↑ Ch 1 questions](#ch-1--relational-basics-and-sql) · [↑ Table of Contents](#table-of-contents)

---

### Q1.3 What are tables, rows, columns, and primary keys?
- **Table** — a named collection of rows sharing the same columns (a *relation* in practice)
- **Row (record)** — one item in the table; one value per column (or NULL where allowed)
- **Column (field)** — a named attribute with a single value per row, constrained by type and optional rules
- **Primary key** — a column or set of columns that **uniquely identifies** each row. No two rows may share the same primary key values. It is the main handle other tables use in **foreign keys**

	**Q1.3a** Can a primary key span multiple columns?

Yes. A **composite primary key** uses two or more columns together (for example `country_code` + `postal_code` in a junction table). Every column in the key must be NOT NULL.

[↑ Ch 1 questions](#ch-1--relational-basics-and-sql) · [↑ Table of Contents](#table-of-contents)

---

### Q1.4 What is a schema in the logical sense?
In everyday speech, **schema** means the **structure** of the data: table names, columns, types, keys, indexes, and constraints. In **PostgreSQL**, `schema` also means a **namespace** inside a database (for example `public.orders`). Juniors should know both meanings: *design* vs *SQL object namespace*.

[↑ Ch 1 questions](#ch-1--relational-basics-and-sql) · [↑ Table of Contents](#table-of-contents)

---

### Q1.5 How does declarative style in SQL differ from imperative code?
**Declarative:** you write *conditions and shapes* of the result (filters, joins, grouping). **Imperative:** you step through collections manually (`for` loops, building lists).

SQL encourages declaring **relations** ("rows that match these predicates") so the **optimizer** can choose algorithms (indexes, join order). You still need to think procedurally when debugging or tuning, but the *query text* stays declarative.

[↑ Ch 1 questions](#ch-1--relational-basics-and-sql) · [↑ Table of Contents](#table-of-contents)

---

## Ch 2 — Data Types, Literals, and NULL

**Questions in this chapter**

- [Q2.1 Why do column types matter?](#q21-why-do-column-types-matter)
- [Q2.2 What is NULL, and how is it different from zero or empty string?](#q22-what-is-null-and-how-is-it-different-from-zero-or-empty-string)
- [Q2.3 How do `IS NULL` and `=` differ when searching for NULL?](#q23-how-do-is-null-and--differ-when-searching-for-null)
- [Q2.4 What are common PostgreSQL types juniors see first?](#q24-what-are-common-postgresql-types-juniors-see-first)

---

### Q2.1 Why do column types matter?
Types enforce **valid data**, guide **storage and comparison** rules, and enable **indexes** and operators that fit the domain. Wrong types lead to subtle bugs — sorting `'10'` before `'2'` as text, losing time zones with naive timestamps, and so on.

[↑ Ch 2 questions](#ch-2--data-types-literals-and-null) · [↑ Table of Contents](#table-of-contents)

---

### Q2.2 What is NULL, and how is it different from zero or empty string?
**NULL** means *unknown* or *not applicable* — not a value. **0** is a number; **`''`** is an empty string. Aggregates like `COUNT(*)` count rows; `COUNT(column)` skips NULLs in that column.

**Important:** `NULL = NULL` is not true in SQL; use **`IS NULL`** / **`IS NOT NULL`**.

	**Q2.2a** What does `COALESCE` do?

`COALESCE(a, b, c, ...)` returns the first argument that is **not** NULL. Common for defaults: `COALESCE(nickname, first_name)`.

[↑ Ch 2 questions](#ch-2--data-types-literals-and-null) · [↑ Table of Contents](#table-of-contents)

---

### Q2.3 How do `IS NULL` and `=` differ when searching for NULL?
Standard equality does not "match" NULL because NULL is not equal to anything, including itself.

```sql
WHERE col = NULL   -- always unknown (effectively never true); wrong pattern
WHERE col IS NULL  -- correct
```

[↑ Ch 2 questions](#ch-2--data-types-literals-and-null) · [↑ Table of Contents](#table-of-contents)

---

### Q2.4 What are common PostgreSQL types juniors see first?
- **`SERIAL` / `BIGSERIAL` / `GENERATED ... AS IDENTITY`** — auto-incrementing identifiers (prefer `IDENTITY` in new PostgreSQL)
- **`INTEGER` / `BIGINT`** — whole numbers
- **`NUMERIC(p,s)`** — exact decimals (money calculations)
- **`TEXT` / `VARCHAR(n)`** — character data
- **`BOOLEAN`**
- **`TIMESTAMP WITH TIME ZONE` (`timestamptz`)** — store instants in UTC; convert at display
- **`DATE`**, **`UUID`**, **`JSONB`** — common in APIs and config

[↑ Ch 2 questions](#ch-2--data-types-literals-and-null) · [↑ Table of Contents](#table-of-contents)

---

## Ch 3 — DDL: Defining and Changing Structure

**Questions in this chapter**

- [Q3.1 What is DDL vs DML?](#q31-what-is-ddl-vs-dml)
- [Q3.2 How do you create a table in PostgreSQL?](#q32-how-do-you-create-a-table-in-postgresql)
- [Q3.3 What is `ALTER TABLE` used for?](#q33-what-is-alter-table-used-for)
- [Q3.4 What is `DROP` and when is it dangerous?](#q34-what-is-drop-and-when-is-it-dangerous)
- [Q3.5 What is `IF EXISTS` / `IF NOT EXISTS`?](#q35-what-is-if-exists--if-not-exists)

---

### Q3.1 What is DDL vs DML?
- **DDL (Data Definition Language)** — defines structure: `CREATE`, `ALTER`, `DROP`, `TRUNCATE` (often classed with DDL)
- **DML (Data Manipulation Language)** — changes or reads row data: `INSERT`, `UPDATE`, `DELETE`, **`SELECT`** (some authors treat `SELECT` as DQL; practically it is the core read path)

[↑ Ch 3 questions](#ch-3--ddl-defining-and-changing-structure) · [↑ Table of Contents](#table-of-contents)

---

### Q3.2 How do you create a table in PostgreSQL?
Use **`CREATE TABLE`** with column names, types, and optional constraints.

```sql
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

[↑ Ch 3 questions](#ch-3--ddl-defining-and-changing-structure) · [↑ Table of Contents](#table-of-contents)

---

### Q3.3 What is `ALTER TABLE` used for?
It **changes** an existing table: add/drop/rename columns, add/drop constraints, change defaults, and so on. In production, some changes are **cheap** (add nullable column) and some are **expensive or locking** (rewrite table for certain type changes) — always check migration guides for your PostgreSQL version.

[↑ Ch 3 questions](#ch-3--ddl-defining-and-changing-structure) · [↑ Table of Contents](#table-of-contents)

---

### Q3.4 What is `DROP` and when is it dangerous?
**`DROP TABLE` / `DROP SCHEMA`** removes objects and their dependent definitions. It is **destructive**; on production systems it is gated by backups, reviews, and least privilege (`DROP` not granted to app roles).

[↑ Ch 3 questions](#ch-3--ddl-defining-and-changing-structure) · [↑ Table of Contents](#table-of-contents)

---

### Q3.5 What is `IF EXISTS` / `IF NOT EXISTS`?
PostgreSQL lets scripts tolerate reruns: `DROP TABLE IF EXISTS ...`, `CREATE TABLE IF NOT EXISTS ...`. Useful in dev scripts; in **migrations**, teams often prefer explicit versioning so you know whether an object *should* already exist.

[↑ Ch 3 questions](#ch-3--ddl-defining-and-changing-structure) · [↑ Table of Contents](#table-of-contents)

---

## Ch 4 — DML: Inserting, Updating, Deleting Rows

**Questions in this chapter**

- [Q4.1 How does `INSERT` work?](#q41-how-does-insert-work)
- [Q4.2 What is an `UPSERT` in PostgreSQL?](#q42-what-is-an-upsert-in-postgresql)
- [Q4.3 How does `UPDATE` avoid updating everything by mistake?](#q43-how-does-update-avoid-updating-everything-by-mistake)
- [Q4.4 How does `DELETE` differ from `TRUNCATE`?](#q44-how-does-delete-differ-from-truncate)

---

### Q4.1 How does `INSERT` work?
**`INSERT`** adds new rows. You list target columns (recommended) and values or a `SELECT` source.

```sql
INSERT INTO orders (user_id, total_cents)
VALUES (42, 999)
RETURNING id;
```

`RETURNING` is PostgreSQL-specific convenience to get generated keys or columns without a second round trip.

[↑ Ch 4 questions](#ch-4--dml-inserting-updating-deleting-rows) · [↑ Table of Contents](#table-of-contents)

---

### Q4.2 What is an `UPSERT` in PostgreSQL?
**`INSERT ... ON CONFLICT`** either **skips**, **updates**, or **does nothing** when a unique constraint or primary key would be violated — one atomic statement for "insert or update" patterns.

```sql
INSERT INTO users (email, name)
VALUES ('a@example.com', 'Alice')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
```

[↑ Ch 4 questions](#ch-4--dml-inserting-updating-deleting-rows) · [↑ Table of Contents](#table-of-contents)

---

### Q4.3 How does `UPDATE` avoid updating everything by mistake?
Always use a **`WHERE`** clause scoped to the rows you intend. Without `WHERE`, **every row** in the table matches. In transactions, **`SELECT` the same `WHERE`** first to preview impact.

[↑ Ch 4 questions](#ch-4--dml-inserting-updating-deleting-rows) · [↑ Table of Contents](#table-of-contents)

---

### Q4.4 How does `DELETE` differ from `TRUNCATE`?
- **`DELETE`** — removes rows matching `WHERE`; logged row-by-row; can fire triggers; can **`RETURNING`** rows
- **`TRUNCATE`** — quickly removes **all** rows from a table (or set of tables); resets storage in bulk; **cannot** use a row `WHERE`; permissions and FK rules differ

[↑ Ch 4 questions](#ch-4--dml-inserting-updating-deleting-rows) · [↑ Table of Contents](#table-of-contents)

---

## Ch 5 — Querying with SELECT

**Questions in this chapter**

- [Q5.1 What is the logical order of `SELECT` query clauses?](#q51-what-is-the-logical-order-of-select-query-clauses)
- [Q5.2 What are `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET`?](#q52-what-are-where-order-by-limit-and-offset)
- [Q5.3 What are `DISTINCT` and `LIMIT` gotchas?](#q53-what-are-distinct-and-limit-gotchas)
- [Q5.4 What are subqueries and when are they useful?](#q54-what-are-subqueries-and-when-are-they-useful)
- [Q5.5 What is `EXISTS` vs `IN` for subqueries?](#q55-what-is-exists-vs-in-for-subqueries)
- [Q5.6 What are common expression tools (`CASE`, casting)?](#q56-what-are-common-expression-tools-case-casting)

---

### Q5.1 What is the logical order of `SELECT` query clauses?
*Logical* evaluation (conceptual) differs from keyword order on the page:

1. **`FROM`** (including joins) → **`WHERE`** → **`GROUP BY`** → **`HAVING`**
2. Window functions (if any) after `HAVING`
3. **`SELECT`** expressions
4. **`DISTINCT`**
5. **`ORDER BY`**
6. **`LIMIT` / `OFFSET`**

So you **cannot** refer to a `SELECT` alias in `WHERE`; use a subquery or repeat the expression.

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

### Q5.2 What are `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET`?
- **`WHERE`** — filters **rows** before grouping
- **`ORDER BY`** — sorts result rows (stable tie-breaking with extra keys is a good habit)
- **`LIMIT`** — caps rows returned (use with **`ORDER BY`** when "top N" matters)
- **`OFFSET`** — skips leading rows (cheap for tiny offsets, costly for large ones; **keyset pagination** is often better at scale)

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

### Q5.3 What are `DISTINCT` and `LIMIT` gotchas?
- **`DISTINCT`** deduplicates whole **selected row shapes**; `DISTINCT ON (col)` (PostgreSQL) picks one row per group — learn its required `ORDER BY` rules before using in production
- **`LIMIT` without `ORDER BY`** returns an **arbitrary** slice unless the plan is deterministic

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

### Q5.4 What are subqueries and when are they useful?
A **subquery** is a `SELECT` nested inside another statement. Use for **filtering** ("exists in…"), **derived tables** (`FROM (SELECT ...) AS t`), or **scalar** results (`WHERE id = (SELECT ...)` when exactly one row is guaranteed).

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

### Q5.5 What is `EXISTS` vs `IN` for subqueries?
- **`EXISTS (subquery)`** — true if the subquery returns **any** row; often stops early; handles NULL quirks less painfully than `IN` for large sets
- **`expr IN (subquery)`** — membership test; watch **NULL** behavior: `IN` with NULL in the candidate set can yield unknown results

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

### Q5.6 What are common expression tools (`CASE`, casting)?
- **`CASE WHEN ... THEN ... ELSE ... END`** — conditional expressions in queries
- **Casting** — `CAST(x AS type)` or PostgreSQL `x::type` for explicit conversions when implicit conversion is wrong or missing

```sql
SELECT
  CASE WHEN status = 'active' THEN 1 ELSE 0 END AS is_active,
  created_at::date AS created_date
FROM users;
```

[↑ Ch 5 questions](#ch-5--querying-with-select) · [↑ Table of Contents](#table-of-contents)

---

## Ch 6 — JOINs and Set Operations

**Questions in this chapter**

- [Q6.1 What is an INNER JOIN?](#q61-what-is-an-inner-join)
- [Q6.2 What is a LEFT OUTER JOIN?](#q62-what-is-a-left-outer-join)
- [Q6.3 When do you need RIGHT or FULL OUTER JOIN?](#q63-when-do-you-need-right-or-full-outer-join)
- [Q6.4 What is a Cartesian product, and why avoid accidental cross joins?](#q64-what-is-a-cartesian-product-and-why-avoid-accidental-cross-joins)
- [Q6.5 What are `UNION`, `INTERSECT`, and `EXCEPT`?](#q65-what-are-union-intersect-and-except)

---

### Q6.1 What is an INNER JOIN?
**INNER JOIN** keeps rows from both sides **only when** the join condition matches. Non-matching rows are dropped from the result.

```sql
SELECT o.id, u.email
FROM orders o
INNER JOIN users u ON u.id = o.user_id;
```

[↑ Ch 6 questions](#ch-6--joins-and-set-operations) · [↑ Table of Contents](#table-of-contents)

---

### Q6.2 What is a LEFT OUTER JOIN?
**LEFT JOIN** keeps **all** rows from the **left** table; for each, matching right rows are attached, or **NULL** right-side columns if no match. Typical for "orders with user info, including orders with missing users" (data-quality cases).

[↑ Ch 6 questions](#ch-6--joins-and-set-operations) · [↑ Table of Contents](#table-of-contents)

---

### Q6.3 When do you need RIGHT or FULL OUTER JOIN?
**RIGHT JOIN** is symmetric to LEFT — useful when table order in the query is fixed for readability; many teams **rewrite as LEFT** for consistency. **FULL OUTER JOIN** keeps **all** rows from **both** sides with NULLs where no counterpart exists — handy for diffing or reconciling two datasets.

[↑ Ch 6 questions](#ch-6--joins-and-set-operations) · [↑ Table of Contents](#table-of-contents)

---

### Q6.4 What is a Cartesian product, and why avoid accidental cross joins?
A **Cartesian product** multiplies every row of A with every row of B (`CROSS JOIN` or missing join condition). Sometimes intentional (small dimension tables); often a **bug** causing exploding row counts and wrong aggregates.

	**Q6.4a** How do you spot an accidental cross join?

Row counts jump to `|A| × |B|`, aggregates look inflated, and the query plan shows a nested loop or hash join with no selective predicate. Always verify join conditions in `FROM`/`JOIN` clauses.

[↑ Ch 6 questions](#ch-6--joins-and-set-operations) · [↑ Table of Contents](#table-of-contents)

---

### Q6.5 What are `UNION`, `INTERSECT`, and `EXCEPT`?
Set operations on **compatible** queries (same column count/types):

- **`UNION`** — combine rows; **`UNION ALL`** keeps duplicates (faster when duplicates are OK)
- **`INTERSECT`** — rows present in both
- **`EXCEPT`** — rows in first query not in second

[↑ Ch 6 questions](#ch-6--joins-and-set-operations) · [↑ Table of Contents](#table-of-contents)

---

## Ch 7 — Aggregations, GROUP BY, and HAVING

**Questions in this chapter**

- [Q7.1 What do `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` do?](#q71-what-do-count-sum-avg-min-max-do)
- [Q7.2 What is `GROUP BY`?](#q72-what-is-group-by)
- [Q7.3 What is the difference between `WHERE` and `HAVING`?](#q73-what-is-the-difference-between-where-and-having)
- [Q7.4 What are common aggregation mistakes with NULL?](#q74-what-are-common-aggregation-mistakes-with-null)
- [Q7.5 What are window functions (high level)?](#q75-what-are-window-functions-high-level)

---

### Q7.1 What do `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` do?
They **collapse** many rows into one summary value per group (or one row for the whole table if no `GROUP BY`). **`COUNT(*)`** counts rows; **`COUNT(col)`** counts non-NULL values in `col`.

[↑ Ch 7 questions](#ch-7--aggregations-group-by-and-having) · [↑ Table of Contents](#table-of-contents)

---

### Q7.2 What is `GROUP BY`?
**`GROUP BY expr-list`** partitions rows into buckets sharing the same grouping values. **Each non-aggregated** column in `SELECT` must **appear in `GROUP BY`** (or be functionally dependent on grouped columns in PostgreSQL with primary keys — an advanced edge case).

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;
```

[↑ Ch 7 questions](#ch-7--aggregations-group-by-and-having) · [↑ Table of Contents](#table-of-contents)

---

### Q7.3 What is the difference between `WHERE` and `HAVING`?
- **`WHERE`** filters **raw rows** before aggregation
- **`HAVING`** filters **groups** after `GROUP BY` (can reference aggregates, for example `HAVING COUNT(*) > 1`)

[↑ Ch 7 questions](#ch-7--aggregations-group-by-and-having) · [↑ Table of Contents](#table-of-contents)

---

### Q7.4 What are common aggregation mistakes with NULL?
Many aggregates **ignore NULL** inputs; `COUNT(*)` still counts rows with NULLs in some columns. **`AVG`** divides by the count of **non-NULL** values, not total rows — know your business rule when NULL means "zero" vs "unknown."

[↑ Ch 7 questions](#ch-7--aggregations-group-by-and-having) · [↑ Table of Contents](#table-of-contents)

---

### Q7.5 What are window functions (high level)?
**Window functions** compute per-row results **without collapsing** the result set to one row per group — for example `ROW_NUMBER()`, `RANK()`, running totals with `SUM(...) OVER (...)`. The `OVER` clause defines the **partition** and **order**.

```sql
SELECT id, total_cents,
       SUM(total_cents) OVER (PARTITION BY user_id) AS user_total
FROM orders;
```

[↑ Ch 7 questions](#ch-7--aggregations-group-by-and-having) · [↑ Table of Contents](#table-of-contents)

---

## Ch 8 — Keys, Constraints, and Relationships

**Questions in this chapter**

- [Q8.1 What is a foreign key?](#q81-what-is-a-foreign-key)
- [Q8.2 What do `ON DELETE` / `ON UPDATE` actions mean?](#q82-what-do-on-delete--on-update-actions-mean)
- [Q8.3 What is a UNIQUE constraint?](#q83-what-is-a-unique-constraint)
- [Q8.4 What is a CHECK constraint?](#q84-what-is-a-check-constraint)

---

### Q8.1 What is a foreign key?
A **foreign key (FK)** declares that values in a column (or set) **must exist** as primary key (or unique) values in a referenced table — the database **enforces** referential integrity so orphans do not appear under normal DML.

[↑ Ch 8 questions](#ch-8--keys-constraints-and-relationships) · [↑ Table of Contents](#table-of-contents)

---

### Q8.2 What do `ON DELETE` / `ON UPDATE` actions mean?
When the **parent** row changes, the FK policy decides what happens to **child** rows:

- **`RESTRICT` / `NO ACTION`** — block the parent change if children exist (PostgreSQL timing nuances exist between them)
- **`CASCADE`** — delete/update children in lockstep
- **`SET NULL` / `SET DEFAULT`** — soften the link when the column is nullable or has a default

[↑ Ch 8 questions](#ch-8--keys-constraints-and-relationships) · [↑ Table of Contents](#table-of-contents)

---

### Q8.3 What is a UNIQUE constraint?
**UNIQUE** enforces no duplicates on the column set. **Multiple NULLs** are often allowed in PostgreSQL for unique constraints (`NULL` ≠ `NULL` in uniqueness checks) — verify behavior for your version and design (`NULL` email vs "no email" sentinels).

[↑ Ch 8 questions](#ch-8--keys-constraints-and-relationships) · [↑ Table of Contents](#table-of-contents)

---

### Q8.4 What is a CHECK constraint?
**`CHECK (boolean expression)`** rejects inserts/updates that violate a row-level rule (for example non-negative totals, enum-like ranges). Complex cross-row rules may need triggers or exclusion constraints.

[↑ Ch 8 questions](#ch-8--keys-constraints-and-relationships) · [↑ Table of Contents](#table-of-contents)

---

## Ch 9 — Indexes and Simple Performance Ideas

**Questions in this chapter**

- [Q9.1 What is a database index?](#q91-what-is-a-database-index)
- [Q9.2 When does a B-tree index help?](#q92-when-does-a-b-tree-index-help)
- [Q9.3 What is `EXPLAIN` / `EXPLAIN ANALYZE` in PostgreSQL?](#q93-what-is-explain--explain-analyze-in-postgresql)

---

### Q9.1 What is a database index?
An **index** is an auxiliary structure that speeds up **lookups, joins, and ordering** on chosen columns — like a book index vs scanning every page. Trade-offs: **faster reads**, **slower writes**, **extra disk**.

[↑ Ch 9 questions](#ch-9--indexes-and-simple-performance-ideas) · [↑ Table of Contents](#table-of-contents)

---

### Q9.2 When does a B-tree index help?
PostgreSQL's default **`btree`** helps with equality and range predicates, and can support `ORDER BY` on indexed columns. It does **not** magically fix `LIKE '%text'` leading wildcards or every expression — sometimes you need pattern ops, trigram, or full-text indexes.

[↑ Ch 9 questions](#ch-9--indexes-and-simple-performance-ideas) · [↑ Table of Contents](#table-of-contents)

---

### Q9.3 What is `EXPLAIN` / `EXPLAIN ANALYZE` in PostgreSQL?
- **`EXPLAIN`** shows the **planned** operations and cost estimates
- **`EXPLAIN ANALYZE`** **runs** the query and shows **actual** timings and row counts — essential for learning why a query is slow (sequential scans, nested loops, hash joins, and so on)

[↑ Ch 9 questions](#ch-9--indexes-and-simple-performance-ideas) · [↑ Table of Contents](#table-of-contents)

---

## Ch 10 — Transactions and Isolation Basics

**Questions in this chapter**

- [Q10.1 What is a transaction?](#q101-what-is-a-transaction)
- [Q10.2 What does ACID mean at a junior-friendly level?](#q102-what-does-acid-mean-at-a-junior-friendly-level)
- [Q10.3 What are COMMIT and ROLLBACK?](#q103-what-are-commit-and-rollback)
- [Q10.4 What are isolation anomalies (dirty read, lost update) in one sentence each?](#q104-what-are-isolation-anomalies-dirty-read-lost-update-in-one-sentence-each)

---

### Q10.1 What is a transaction?
A **transaction** bundles one or more statements into an **atomic unit**: all succeed and become **durable** (`COMMIT`), or none take effect (`ROLLBACK`), from other sessions' viewpoint after commit boundaries.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

[↑ Ch 10 questions](#ch-10--transactions-and-isolation-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q10.2 What does ACID mean at a junior-friendly level?
- **Atomicity** — all-or-nothing
- **Consistency** — constraints hold after commit (constraint + business sense)
- **Isolation** — concurrent transactions do not stomp confusingly on each other, per isolation level rules
- **Durability** — committed data survives crashes (within engine guarantees / hardware)

[↑ Ch 10 questions](#ch-10--transactions-and-isolation-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q10.3 What are COMMIT and ROLLBACK?
**`COMMIT`** ends the transaction, persisting changes. **`ROLLBACK`** aborts, undoing visible work of the current transaction (within engine rules). Application code should **bound** transactions around multi-step business operations (transfer between accounts, order + inventory).

[↑ Ch 10 questions](#ch-10--transactions-and-isolation-basics) · [↑ Table of Contents](#table-of-contents)

---

### Q10.4 What are isolation anomalies (dirty read, lost update) in one sentence each?
- **Dirty read** — reading another transaction's **uncommitted** changes (rare in PostgreSQL's practical levels for normal reads)
- **Non-repeatable read** — the **same read** in one transaction sees **different** data later because another transaction **committed** changes
- **Phantom read** — a range/count **changes** between reads due to **new** rows committed by others
- **Lost update** — two transactions each read-then-write and **one update overwrites the other** without seeing its input — mitigated with locking, atomic `UPDATE`, or optimistic versioning

PostgreSQL defaults to **`READ COMMITTED`** per statement snapshot; **`REPEATABLE READ`** and **`SERIALIZABLE`** add stronger guarantees. Details belong in advanced docs; juniors should know **why** payment code uses careful transaction boundaries.

[↑ Ch 10 questions](#ch-10--transactions-and-isolation-basics) · [↑ Table of Contents](#table-of-contents)

---

## Ch 11 — PostgreSQL Features Juniors Use Often

**Questions in this chapter**

- [Q11.1 How do you run ad hoc SQL against PostgreSQL?](#q111-how-do-you-run-ad-hoc-sql-against-postgresql)
- [Q11.2 What are schemas (`public`, etc.)?](#q112-what-are-schemas-public-etc)
- [Q11.3 What is `JSONB` and when is it appropriate?](#q113-what-is-jsonb-and-when-is-it-appropriate)
- [Q11.4 What are arrays and composite types (awareness)?](#q114-what-are-arrays-and-composite-types-awareness)
- [Q11.5 What are `CTE`s (`WITH`)?](#q115-what-are-ctes-with)
- [Q11.6 What is full-text search (very short)?](#q116-what-is-full-text-search-very-short)
- [Q11.7 What are extensions (e.g. `uuid-ossp`, `pgcrypto`)?](#q117-what-are-extensions-eg-uuid-ossp-pgcrypto)
- [Q11.8 How do roles, databases, and connections fit together?](#q118-how-do-roles-databases-and-connections-fit-together)

---

### Q11.1 How do you run ad hoc SQL against PostgreSQL?
Common paths: **`psql`** CLI, GUI clients (pgAdmin, DBeaver, TablePlus), or app connection strings. **`psql`** supports `\d`, `\dt`, timing, and `\e` for editor integration — worth learning early.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.2 What are schemas (`public`, etc.)?
A **schema** is a namespace inside a database. Default **`public`** holds many objects unless you organize by module (`billing.invoice`). Search path (`SHOW search_path`) controls unqualified name resolution.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.3 What is `JSONB` and when is it appropriate?
**`JSONB`** stores JSON in a **binary** form with **indexing** (`GIN`) and operators (`->`, `->>`, `@>`). Good for **semi-structured** or evolving payloads **alongside** relational columns — not a replacement for normalizing core entities you query and join heavily.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.4 What are arrays and composite types (awareness)?
PostgreSQL supports **column types for arrays** and **row/composite** types. Useful for specialized modeling; misuse can fight relational clarity — default to tables and FKs until you know why an array wins.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.5 What are `CTE`s (`WITH`)?
**Common table expressions** name subqueries for readability and reuse within one statement. PostgreSQL also supports **`MATERIALIZED`** CTE hints and **recursive** `WITH RECURSIVE` for trees/graphs — advanced but good to recognize in codebases.

```sql
WITH recent_orders AS (
  SELECT * FROM orders WHERE created_at > now() - interval '7 days'
)
SELECT user_id, COUNT(*) FROM recent_orders GROUP BY user_id;
```

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.6 What is full-text search (very short)?
PostgreSQL has **`tsvector` / `tsquery`** and **GIN/GiST** indexes for **language-aware** search beyond naive `ILIKE '%word%'`. Reach for it when user-facing search grows past simple patterns.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.7 What are extensions (e.g. `uuid-ossp`, `pgcrypto`)?
**Extensions** bundle optional types, functions, and operators (`CREATE EXTENSION`). Examples: UUID helpers, crypto helpers, PostGIS. Require deployment discipline: same extensions in dev/stage/prod.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

### Q11.8 How do roles, databases, and connections fit together?
A **server cluster** hosts **databases** (isolated object sets). **Roles** (users/groups) authenticate and hold **privileges** (`GRANT`). App credentials should follow **least privilege** — not superuser, often not owner of all objects.

[↑ Ch 11 questions](#ch-11--postgresql-features-juniors-use-often) · [↑ Table of Contents](#table-of-contents)

---

## Ch 12 — From Application Code: Safety and Ergonomics

**Questions in this chapter**

- [Q12.1 What is SQL injection, and how do you prevent it?](#q121-what-is-sql-injection-and-how-do-you-prevent-it)
- [Q12.2 Why use parameterized queries / bind parameters?](#q122-why-use-parameterized-queries--bind-parameters)
- [Q12.3 What is the N+1 query problem?](#q123-what-is-the-n1-query-problem)
- [Q12.4 Why do migrations exist, and what is ordering?](#q124-why-do-migrations-exist-and-what-is-ordering)
- [Q12.5 What should juniors log and **not** log around databases?](#q125-what-should-juniors-log-and-not-log-around-databases)

---

### Q12.1 What is SQL injection, and how do you prevent it?
**SQL injection** is crafting user input that changes query **structure** (breaking out of string literals, stacking statements). Prevent with **parameterized queries**, **ORMs used correctly**, **least privilege** DB roles, and **never** concatenating raw user text into SQL.

```javascript
// Wrong — vulnerable
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Right — parameterized
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

[↑ Ch 12 questions](#ch-12--from-application-code-safety-and-ergonomics) · [↑ Table of Contents](#table-of-contents)

---

### Q12.2 Why use parameterized queries / bind parameters?
Bound parameters send values **separately** from the SQL text so the engine treats them **only as data**. That removes the primary injection class and often helps **plan caching**.

[↑ Ch 12 questions](#ch-12--from-application-code-safety-and-ergonomics) · [↑ Table of Contents](#table-of-contents)

---

### Q12.3 What is the N+1 query problem?
Loading a list (1 query) then **per item** fetching related rows (**N** queries) — classic ORM footgun. Fix with **joins**, **batched** loads (`WHERE id IN (...)`), or ORM **eager loading** features.

[↑ Ch 12 questions](#ch-12--from-application-code-safety-and-ergonomics) · [↑ Table of Contents](#table-of-contents)

---

### Q12.4 Why do migrations exist, and what is ordering?
**Migrations** version the **schema** like code: reproducible changes across environments. **Ordering** matters — renames, backfills, and constraint additions need **multi-step** migrations to avoid downtime or locks in large tables.

[↑ Ch 12 questions](#ch-12--from-application-code-safety-and-ergonomics) · [↑ Table of Contents](#table-of-contents)

---

### Q12.5 What should juniors log and **not** log around databases?
Log **slow queries** (with thresholds), **error codes**, and **correlation IDs** — not **passwords**, full **PAN**, or **PII** payloads. Parameter values in logs need **redaction** policy.

[↑ Ch 12 questions](#ch-12--from-application-code-safety-and-ergonomics) · [↑ Table of Contents](#table-of-contents)

---
