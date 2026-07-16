# PostgreSQL Features — Junior to Senior Roadmap

A learning roadmap of **PostgreSQL-specific** features, operators, and functions. Nothing here is standard SQL — everything on this list either extends the standard or is unique to PostgreSQL. Use this alongside the [SQL standard roadmap](sql-operators-functions-roadmap.md).

Related guides: [Junior SQL](documentation-sql.md) · [Middle SQL](documentation-sql-middle.md) · [Window Functions](documentation-sql-window-functions.md)

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Type system extras](#l1-type-system-extras)
  - [Cast shorthand](#l1-cast-shorthand)
  - [ILIKE — case-insensitive LIKE](#l1-ilike--case-insensitive-like)
  - [RETURNING clause](#l1-returning-clause)
  - [ON CONFLICT — upsert](#l1-on-conflict--upsert)
  - [Date and time helpers](#l1-date-and-time-helpers)
  - [String helpers](#l1-string-helpers)
  - [EXPLAIN basics](#l1-explain-basics)
  - [psql essentials](#l1-psql-essentials)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [JSONB operators](#l2-jsonb-operators)
  - [JSONB build and aggregate functions](#l2-jsonb-build-and-aggregate-functions)
  - [Array operators and functions](#l2-array-operators-and-functions)
  - [Regex operators](#l2-regex-operators)
  - [Advanced string functions](#l2-advanced-string-functions)
  - [Advanced date and time functions](#l2-advanced-date-and-time-functions)
  - [GENERATE_SERIES](#l2-generate_series)
  - [DISTINCT ON](#l2-distinct-on)
  - [Aggregate functions (PostgreSQL extras)](#l2-aggregate-functions-postgresql-extras)
  - [Index types overview](#l2-index-types-overview)
  - [Partial and expression indexes](#l2-partial-and-expression-indexes)
  - [EXPLAIN ANALYZE](#l2-explain-analyze)
  - [Materialized views](#l2-materialized-views)
  - [Sequences](#l2-sequences)
  - [Custom types and domains](#l2-custom-types-and-domains)
- [Level 3 — Senior](#level-3--senior)
  - [Advanced JSONB functions](#l3-advanced-jsonb-functions)
  - [JSONPath queries](#l3-jsonpath-queries)
  - [Full-text search](#l3-full-text-search)
  - [pg_trgm — trigram similarity](#l3-pg_trgm--trigram-similarity)
  - [PL/pgSQL — functions](#l3-plpgsql--functions)
  - [PL/pgSQL — triggers](#l3-plpgsql--triggers)
  - [Row-level security (RLS)](#l3-row-level-security-rls)
  - [Table partitioning](#l3-table-partitioning)
  - [Covering indexes and INCLUDE](#l3-covering-indexes-and-include)
  - [Advisory locks](#l3-advisory-locks)
  - [LISTEN / NOTIFY](#l3-listen--notify)
  - [COPY — bulk data transfer](#l3-copy--bulk-data-transfer)
  - [Extensions](#l3-extensions)
  - [System functions and catalog views](#l3-system-functions-and-catalog-views)
  - [Roles, grants, and security](#l3-roles-grants-and-security)
  - [Vacuuming and bloat](#l3-vacuuming-and-bloat)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal SQL example**, and a **gotcha** where relevant.
- Prerequisites: you should already know the standard SQL roadmap at the same level before adding the PostgreSQL extras listed here.

---

## Level 1 — Junior

### L1 Type system extras

PostgreSQL ships with many types that go well beyond the SQL standard.

| Type | Description | Example |
|---|---|---|
| `TEXT` | unlimited-length string — no length limit, no padding | `name TEXT` |
| `VARCHAR(n)` | string up to n characters (same storage as TEXT in PG) | `code VARCHAR(10)` |
| `BOOLEAN` | `TRUE` / `FALSE` / `NULL`; also accepts `'t'`, `'f'`, `'yes'`, `'no'`, `1`, `0` | `is_active BOOLEAN DEFAULT TRUE` |
| `SERIAL` | auto-incrementing 4-byte integer (shorthand for sequence + `DEFAULT nextval(...)`) | `id SERIAL PRIMARY KEY` |
| `BIGSERIAL` | auto-incrementing 8-byte integer | `id BIGSERIAL PRIMARY KEY` |
| `UUID` | 128-bit universally unique identifier | `id UUID DEFAULT gen_random_uuid()` |
| `JSONB` | binary JSON — indexed, order not preserved | `profile JSONB` |
| `JSON` | text JSON — order preserved, slower than JSONB | `raw_payload JSON` |
| `NUMERIC(p,s)` | exact decimal of precision p and scale s | `price NUMERIC(10,2)` |
| `TIMESTAMPTZ` | timestamp with time zone (stores in UTC, displays in session TZ) | `created_at TIMESTAMPTZ DEFAULT NOW()` |
| `INTERVAL` | duration | `expires_in INTERVAL DEFAULT '30 days'` |
| `ARRAY` | any type can become an array: `INTEGER[]`, `TEXT[]` | `tags TEXT[]` |
| `ENUM` | fixed set of ordered labels | `CREATE TYPE mood AS ENUM ('happy','sad')` |

> Prefer `TIMESTAMPTZ` over `TIMESTAMP` for anything that has timezone relevance. Prefer `TEXT` over `VARCHAR(n)` in PostgreSQL — there is no storage or performance difference.

---

### L1 Cast shorthand

PostgreSQL allows `::type` as a shorthand for `CAST(val AS type)`.

```sql
SELECT '42'::INTEGER;                      -- integer 42
SELECT '2024-06-01'::DATE;                 -- date
SELECT '3.14'::NUMERIC;                    -- exact decimal
SELECT NOW()::DATE;                        -- strip time from timestamp
SELECT ARRAY['a','b','c']::TEXT[];         -- explicit array cast
SELECT '{"key":"val"}'::JSONB;             -- parse JSON string
```

> `::` is shorter and widely used in PostgreSQL codebases. Use `CAST()` if you ever need to write code that runs on multiple database engines.

---

### L1 ILIKE — case-insensitive LIKE

```sql
-- Match any email ending in @gmail.com regardless of case
WHERE email ILIKE '%@gmail.com'

-- NOT ILIKE
WHERE name NOT ILIKE 'admin%'
```

> `ILIKE` is a PostgreSQL extension. The SQL-standard way is `LIKE` combined with `LOWER()`: `WHERE LOWER(email) LIKE '%@gmail.com'`.

---

### L1 RETURNING clause

PostgreSQL allows `RETURNING` on `INSERT`, `UPDATE`, and `DELETE` to get back the affected rows without a separate `SELECT`.

```sql
-- Get the generated ID after INSERT
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com')
RETURNING id, created_at;

-- Get the old and new value after UPDATE
UPDATE products
SET price = price * 1.1
WHERE category = 'electronics'
RETURNING id, name, price AS new_price;

-- Confirm which rows were deleted
DELETE FROM sessions
WHERE expires_at < NOW()
RETURNING user_id, expires_at;
```

> `RETURNING *` gives back all columns. This is one of the most useful PostgreSQL-only features for application code — it saves a round-trip.

---

### L1 ON CONFLICT — upsert

PostgreSQL's extension to `INSERT` for handling duplicate-key conflicts.

```sql
-- Silently ignore a duplicate
INSERT INTO tags (name)
VALUES ('sql')
ON CONFLICT DO NOTHING;

-- Update on conflict with the specific conflicting column
INSERT INTO users (id, email, login_count)
VALUES (42, 'alice@example.com', 1)
ON CONFLICT (id) DO UPDATE
  SET email       = EXCLUDED.email,
      login_count = users.login_count + 1;

-- Conflict on a unique constraint by name
INSERT INTO ...
ON CONFLICT ON CONSTRAINT users_email_key DO NOTHING;
```

> `EXCLUDED` is a special table alias that refers to the row that was proposed for insertion but conflicted. It is only available inside `ON CONFLICT DO UPDATE`.

---

### L1 Date and time helpers

PostgreSQL-specific date/time functions that extend the SQL standard.

| Function | Returns | Example |
|---|---|---|
| `NOW()` | current `TIMESTAMPTZ` | `DEFAULT NOW()` |
| `CURRENT_TIMESTAMP` | same as `NOW()` — standard form, prefer this in portable code | — |
| `DATE_TRUNC(unit, ts)` | timestamp truncated to the given unit | `DATE_TRUNC('month', NOW())` → first of month |
| `DATE_PART(field, ts)` | numeric field value — same as `EXTRACT` | `DATE_PART('dow', NOW())` — day of week 0-6 |
| `AGE(ts)` | interval from ts to now | `AGE(birth_date)` → `'25 years 3 mons'` |
| `AGE(ts1, ts2)` | interval between two timestamps | `AGE(NOW(), hire_date)` |
| `MAKE_DATE(y, m, d)` | build a date from parts | `MAKE_DATE(2024, 12, 31)` |
| `MAKE_TIMESTAMP(y,m,d,h,mi,s)` | build a timestamp | `MAKE_TIMESTAMP(2024,1,1,0,0,0)` |
| `MAKE_INTERVAL(...)` | build an interval from named parts | `MAKE_INTERVAL(days => 7, hours => 3)` |
| `TO_TIMESTAMP(epoch)` | Unix epoch to `TIMESTAMPTZ` | `TO_TIMESTAMP(1700000000)` |
| `TO_CHAR(ts, fmt)` | format timestamp/date as string | `TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI')` |
| `TO_DATE(s, fmt)` | parse string to date | `TO_DATE('01/06/2024', 'DD/MM/YYYY')` |
| `TO_TIMESTAMP(s, fmt)` | parse string to timestamp | `TO_TIMESTAMP('2024-06-01 14:30', 'YYYY-MM-DD HH24:MI')` |
| `ISFINITE(ts)` | `FALSE` for `±infinity` timestamps | `WHERE ISFINITE(expires_at)` |
| `JUSTIFY_DAYS(interval)` | normalize excess days to months | `JUSTIFY_DAYS('35 days')` → `1 mon 5 days` |
| `TIMEZONE(zone, ts)` | convert timezone — same as `AT TIME ZONE` | `TIMEZONE('UTC', NOW())` |

`DATE_TRUNC` unit strings: `'microsecond'`, `'millisecond'`, `'second'`, `'minute'`, `'hour'`, `'day'`, `'week'`, `'month'`, `'quarter'`, `'year'`, `'decade'`, `'century'`, `'millennium'`.

```sql
-- First day of current month
SELECT DATE_TRUNC('month', NOW());

-- Age in years only
SELECT EXTRACT(YEAR FROM AGE(birth_date)) AS age_years FROM users;

-- Format a date for display
SELECT TO_CHAR(created_at, 'Mon DD, YYYY') FROM orders;
```

---

### L1 String helpers

PostgreSQL-specific string functions not in the SQL standard.

| Function | Returns | Example |
|---|---|---|
| `INITCAP(s)` | title-case each word | `INITCAP('hello world')` → `'Hello World'` |
| `LEFT(s, n)` | first n characters | `LEFT('hello', 3)` → `'hel'` |
| `RIGHT(s, n)` | last n characters | `RIGHT('hello', 3)` → `'llo'` |
| `REPEAT(s, n)` | repeat string n times | `REPEAT('ab', 3)` → `'ababab'` |
| `REVERSE(s)` | reversed string | `REVERSE('abc')` → `'cba'` |
| `SPLIT_PART(s, delim, n)` | nth token after splitting (1-indexed) | `SPLIT_PART('a.b.c', '.', 2)` → `'b'` |
| `STRPOS(s, substr)` | 1-based index of first match | `STRPOS('hello', 'ell')` → `2` |
| `FORMAT(fmt, args…)` | sprintf-style string formatting | `FORMAT('Hello %s, you are %s years old', name, age)` |
| `LPAD(s, len, pad)` | pad left to reach length | `LPAD('7', 3, '0')` → `'007'` |
| `RPAD(s, len, pad)` | pad right to reach length | `RPAD('ok', 5, '.')` → `'ok...'` |
| `MD5(s)` | MD5 hex digest of string | `MD5('hello')` → `'5d41402abc4b...'` |
| `QUOTE_IDENT(s)` | safely quote an identifier | `QUOTE_IDENT('my table')` → `'"my table"'` |
| `QUOTE_LITERAL(s)` | safely quote a literal value | `QUOTE_LITERAL("O'Brien")` → `'''O''Brien'''` |
| `CHR(n)` | character from ASCII/Unicode code point | `CHR(65)` → `'A'` |
| `ASCII(s)` | code point of first character | `ASCII('A')` → `65` |
| `ENCODE(data, fmt)` | encode bytea as text | `ENCODE(digest, 'base64')` |
| `DECODE(s, fmt)` | decode text to bytea | `DECODE(b64string, 'base64')` |

---

### L1 EXPLAIN basics

`EXPLAIN` shows the query plan without executing the query. Essential for understanding performance.

```sql
-- Show estimated plan (no execution)
EXPLAIN SELECT * FROM orders WHERE user_id = 42;

-- Execute and show actual timing
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
```

Key plan nodes to recognise:

| Node | Meaning |
|---|---|
| `Seq Scan` | reads every row — no useful index |
| `Index Scan` | uses an index but still fetches heap rows |
| `Index Only Scan` | satisfies query entirely from the index |
| `Bitmap Heap Scan` | uses index bitmap then fetches matching heap pages |
| `Hash Join` | builds hash table from smaller relation |
| `Nested Loop` | for each outer row, scans inner — good for small sets |
| `Merge Join` | merge two pre-sorted streams |
| `Sort` | explicit sort step — look for it before Merge Join |

---

### L1 psql essentials

Commands for the `psql` command-line client.

| Command | Action |
|---|---|
| `\l` | list databases |
| `\c dbname` | connect to a database |
| `\dt` | list tables in current schema |
| `\dt schema.*` | list tables in a specific schema |
| `\d tablename` | describe a table (columns, indexes, constraints) |
| `\di` | list indexes |
| `\dv` | list views |
| `\df` | list functions |
| `\dn` | list schemas |
| `\du` | list roles |
| `\timing` | toggle query execution time display |
| `\x` | toggle expanded (vertical) output |
| `\i file.sql` | execute SQL from a file |
| `\copy table FROM 'file.csv' CSV HEADER` | import CSV |
| `\e` | open query in $EDITOR |
| `\q` | quit |

---

## Level 2 — Mid-level

### L2 JSONB operators

JSONB is PostgreSQL's primary semi-structured data type. See [Middle SQL Ch 9](documentation-sql-middle.md).

| Operator | Returns | Example |
|---|---|---|
| `col -> 'key'` | JSONB value at key | `data -> 'name'` — returns `"Alice"` (JSONB) |
| `col ->> 'key'` | text value at key | `data ->> 'email'` — returns `alice@x.com` (text) |
| `col -> n` | JSONB value at array index (0-based) | `items -> 0` |
| `col ->> n` | text value at array index | `items ->> 0` |
| `col #> '{a,b}'` | JSONB value at nested path | `data #> '{address,city}'` |
| `col #>> '{a,b}'` | text value at nested path | `data #>> '{address,city}'` |
| `col @> '{"k":"v"}'` | `TRUE` if left contains right (GIN-indexable) | `data @> '{"role":"admin"}'` |
| `col <@ '{"k":"v"}'` | `TRUE` if left is contained by right | `data <@ '{"a":1,"b":2}'` |
| `col ? 'key'` | `TRUE` if key exists at top level | `data ? 'email'` |
| `col ?| ARRAY['k1','k2']` | `TRUE` if any key exists | `data ?| ARRAY['email','phone']` |
| `col ?& ARRAY['k1','k2']` | `TRUE` if all keys exist | `data ?& ARRAY['id','name']` |
| `col || '{"k":"v"}'` | merge two JSONB values (right overrides left) | `settings || '{"theme":"dark"}'` |
| `col - 'key'` | delete key from JSONB | `data - 'password'` |
| `col - ARRAY['k1','k2']` | delete multiple keys | `data - ARRAY['tmp','debug']` |
| `col - n` | delete array element by index | `arr - 0` |
| `col #- '{a,b}'` | delete value at nested path | `data #- '{address,old_field}'` |

```sql
-- Filter by a nested JSON field
SELECT id, data ->> 'name' AS name
FROM users
WHERE data @> '{"role": "admin"}';

-- Access nested path
SELECT data #>> '{address, city}' AS city
FROM users;
```

> Use `@>` with a GIN index on the JSONB column for fast containment checks. `->>`  always returns `TEXT` — cast explicitly for comparisons: `(data ->> 'age')::INTEGER > 18`.

---

### L2 JSONB build and aggregate functions

| Function | Returns | Example |
|---|---|---|
| `JSONB_BUILD_OBJECT(k, v, ...)` | JSONB object from pairs | `JSONB_BUILD_OBJECT('id', id, 'name', name)` |
| `JSONB_BUILD_ARRAY(v, ...)` | JSONB array from values | `JSONB_BUILD_ARRAY(1, 'two', TRUE)` |
| `JSON_BUILD_OBJECT(k, v, ...)` | JSON (text) object | same syntax, returns `json` not `jsonb` |
| `TO_JSONB(val)` | convert any PostgreSQL value to JSONB | `TO_JSONB(ROW(1, 'hello'))` |
| `ROW_TO_JSON(row)` | entire row as JSON | `ROW_TO_JSON(t)` — use in CTEs |
| `JSONB_AGG(expr)` | aggregate rows into a JSONB array | `JSONB_AGG(name ORDER BY name)` |
| `JSON_AGG(expr)` | aggregate rows into a JSON array | same but returns `json` |
| `JSONB_OBJECT_AGG(k, v)` | aggregate key-value pairs into a JSONB object | `JSONB_OBJECT_AGG(code, label)` |
| `JSON_OBJECT_AGG(k, v)` | same, returns `json` | — |

```sql
-- Build a JSON object per row in SELECT
SELECT JSONB_BUILD_OBJECT('id', id, 'email', email, 'role', role) AS user_json
FROM users;

-- Aggregate a result set into a single JSON array
SELECT JSONB_AGG(
  JSONB_BUILD_OBJECT('id', id, 'name', name)
  ORDER BY name
) AS members
FROM employees
WHERE department_id = 5;
```

---

### L2 Array operators and functions

PostgreSQL arrays are a first-class type. Any base type can be made into an array by adding `[]`.

| Operator / function | Returns | Example |
|---|---|---|
| `ARRAY[1, 2, 3]` | array literal | `SELECT ARRAY[1,2,3]` |
| `'{1,2,3}'::INT[]` | array from string literal | `WHERE ids = '{1,2,3}'::INT[]` |
| `col[n]` | nth element (1-based) | `tags[1]` |
| `col[m:n]` | slice from index m to n | `tags[1:3]` |
| `col @> ARRAY[val]` | array contains element (GIN-indexable) | `tags @> ARRAY['sql']` |
| `col <@ ARRAY[...]` | array is contained by | — |
| `col && ARRAY[val]` | arrays overlap (share any element) | `skills && ARRAY['python','sql']` |
| `col = ARRAY[...]` | exact array equality | `tags = ARRAY['a','b']` |
| `ARRAY_LENGTH(arr, dim)` | length of dimension | `ARRAY_LENGTH(tags, 1)` |
| `CARDINALITY(arr)` | total element count (all dimensions) | `CARDINALITY(tags)` |
| `ARRAY_APPEND(arr, val)` | new array with element appended | `ARRAY_APPEND(tags, 'new')` |
| `ARRAY_PREPEND(val, arr)` | new array with element prepended | `ARRAY_PREPEND('first', tags)` |
| `ARRAY_REMOVE(arr, val)` | remove all occurrences of val | `ARRAY_REMOVE(tags, 'old')` |
| `ARRAY_REPLACE(arr, from, to)` | replace elements | `ARRAY_REPLACE(tags, 'old', 'new')` |
| `ARRAY_CAT(a, b)` | concatenate two arrays | `ARRAY_CAT(a, b)` |
| `a || b` | concatenate arrays (or append/prepend element) | `tags || ARRAY['extra']` |
| `ARRAY_POSITION(arr, val)` | index of first occurrence | `ARRAY_POSITION(tags, 'sql')` |
| `ARRAY_POSITIONS(arr, val)` | all indexes of val | `ARRAY_POSITIONS(tags, 'sql')` |
| `UNNEST(arr)` | expand array to a set of rows | `SELECT UNNEST(tags) AS tag` |
| `UNNEST(a, b)` | expand multiple arrays in parallel | `SELECT UNNEST(names), UNNEST(scores)` |
| `ARRAY_AGG(col)` | aggregate values into an array | `ARRAY_AGG(tag ORDER BY tag)` |
| `ARRAY_AGG(DISTINCT col)` | deduplicated aggregate | `ARRAY_AGG(DISTINCT status)` |
| `ARRAY_TO_STRING(arr, delim)` | join array elements to a string | `ARRAY_TO_STRING(tags, ', ')` |
| `STRING_TO_ARRAY(s, delim)` | split string to array | `STRING_TO_ARRAY('a,b,c', ',')` |
| `ARRAY_DIMS(arr)` | dimension string | `ARRAY_DIMS(ARRAY[[1,2],[3,4]])` → `'[1:2][1:2]'` |

```sql
-- Rows where any of a user's skills overlap with requirements
SELECT user_id FROM profiles
WHERE skills && ARRAY['python','sql','data'];

-- Expand an array column to individual rows (with source ID)
SELECT id, UNNEST(tags) AS tag FROM posts;

-- Aggregate tags per post into an array
SELECT post_id, ARRAY_AGG(tag ORDER BY tag) AS tags
FROM post_tags
GROUP BY post_id;
```

---

### L2 Regex operators

PostgreSQL uses POSIX regular expressions for its regex operators.

| Operator | Meaning | Example |
|---|---|---|
| `s ~ 'pattern'` | matches regex (case-sensitive) | `WHERE name ~ '^Alice'` |
| `s ~* 'pattern'` | matches regex (case-insensitive) | `WHERE email ~* '@gmail\.com$'` |
| `s !~ 'pattern'` | does NOT match (case-sensitive) | `WHERE code !~ '[^A-Z]'` |
| `s !~* 'pattern'` | does NOT match (case-insensitive) | — |

| Function | Returns | Example |
|---|---|---|
| `REGEXP_MATCH(s, pat)` | text array of first match's capture groups | `REGEXP_MATCH('2024-06-01', '(\d{4})-(\d{2})-(\d{2})')` |
| `REGEXP_MATCH(s, pat, flags)` | same with flags (`'i'` = case-insensitive) | — |
| `REGEXP_MATCHES(s, pat, 'g')` | set of text arrays — one per match | `SELECT REGEXP_MATCHES(text, '\d+', 'g')` |
| `REGEXP_REPLACE(s, pat, repl)` | replace first match | `REGEXP_REPLACE(phone, '\D', '')` |
| `REGEXP_REPLACE(s, pat, repl, flags)` | `'g'` replaces all matches | `REGEXP_REPLACE(phone, '\D', '', 'g')` |
| `REGEXP_SPLIT_TO_ARRAY(s, pat)` | split string by regex delimiter | `REGEXP_SPLIT_TO_ARRAY('a1b2c', '\d')` |
| `REGEXP_SPLIT_TO_TABLE(s, pat)` | split string to a set of rows | `SELECT REGEXP_SPLIT_TO_TABLE(csv, ',')` |
| `REGEXP_COUNT(s, pat)` | count of non-overlapping matches | `REGEXP_COUNT(text, '\bword\b')` |
| `REGEXP_SUBSTR(s, pat)` | extract first match | `REGEXP_SUBSTR(text, '[A-Z]+')` |
| `REGEXP_INSTR(s, pat)` | position of first match | `REGEXP_INSTR(text, '\d+')` |
| `REGEXP_LIKE(s, pat)` | boolean match test | `REGEXP_LIKE(code, '^[A-Z]{3}$')` |

```sql
-- Extract year, month, day from a date string
SELECT REGEXP_MATCH('2024-06-01', '(\d{4})-(\d{2})-(\d{2})');
-- Returns: {2024,06,01}

-- Clean a phone number to digits only
SELECT REGEXP_REPLACE(phone, '\D', '', 'g') AS clean_phone FROM contacts;

-- All numbers found in a text column
SELECT word FROM REGEXP_SPLIT_TO_TABLE('one 1 two 2 three 3', '\s+') AS t(word)
WHERE word ~ '^\d+$';
```

---

### L2 Advanced string functions

| Function | Returns | Example |
|---|---|---|
| `STRING_AGG(col, delim)` | concatenate into a delimited string | `STRING_AGG(name, ', ' ORDER BY name)` |
| `STRING_AGG(col, delim ORDER BY ...)` | ordered concatenation | — |
| `CONCAT_WS(sep, a, b, ...)` | join with separator, skipping NULLs | `CONCAT_WS(' ', first, middle, last)` |
| `SUBSTRING(s FROM regex)` | extract first match of POSIX pattern | `SUBSTRING(path FROM '[^/]+$')` — filename |
| `SUBSTRING(s FROM regex FOR escape)` | extract SQL-regex match | — |
| `LENGTH(s)` | character count (PG synonym for `CHAR_LENGTH`) | `LENGTH('hello')` → `5` |
| `STARTS_WITH(s, prefix)` | boolean prefix check | `STARTS_WITH(name, 'Al')` |
| `NORMALIZE(s, form)` | Unicode normalization | `NORMALIZE(name, NFC)` |

---

### L2 Advanced date and time functions

| Function | Returns | Example |
|---|---|---|
| `DATE_TRUNC('week', ts)` | start of the ISO week | `DATE_TRUNC('week', NOW())` |
| `DATE_TRUNC('quarter', ts)` | start of the quarter | `DATE_TRUNC('quarter', sale_date)` |
| `ts AT TIME ZONE 'tz'` | convert between time zones | `NOW() AT TIME ZONE 'America/New_York'` |
| `NOW() AT TIME ZONE 'UTC'` | display current time in UTC | returns `TIMESTAMP` (no TZ) |
| `CLOCK_TIMESTAMP()` | real-time clock (changes during a transaction, unlike `NOW()`) | useful in long-running procedures |
| `TRANSACTION_TIMESTAMP()` | same as `NOW()` — start of current transaction | — |
| `STATEMENT_TIMESTAMP()` | start of the current SQL statement | — |
| `TIMEOFDAY()` | wall-clock as formatted text string | `SELECT TIMEOFDAY()` |
| `pg_sleep(s)` | pause execution for s seconds | `SELECT pg_sleep(2)` — useful in tests |

```sql
-- Group sales by quarter
SELECT DATE_TRUNC('quarter', sale_date) AS quarter, SUM(amount)
FROM orders
GROUP BY 1
ORDER BY 1;

-- Convert stored UTC timestamp to user's timezone
SELECT created_at AT TIME ZONE 'Europe/Warsaw' AS local_time
FROM events;
```

---

### L2 GENERATE_SERIES

`GENERATE_SERIES` produces a set of values and is unique to PostgreSQL. It is often used for filling in time-series gaps.

```sql
-- Integer series
SELECT GENERATE_SERIES(1, 5);          -- 1, 2, 3, 4, 5
SELECT GENERATE_SERIES(0, 10, 2);      -- 0, 2, 4, 6, 8, 10

-- Date series — every day of June 2024
SELECT day::DATE
FROM GENERATE_SERIES(
  '2024-06-01'::TIMESTAMP,
  '2024-06-30',
  '1 day'
) AS t(day);

-- Fill gaps in daily sales data with 0 for missing days
SELECT
  d.day::DATE,
  COALESCE(s.total, 0) AS total
FROM GENERATE_SERIES('2024-01-01'::DATE, '2024-01-31', '1 day') AS d(day)
LEFT JOIN (
  SELECT sale_date, SUM(amount) AS total
  FROM orders GROUP BY sale_date
) s ON s.sale_date = d.day;
```

---

### L2 DISTINCT ON

`DISTINCT ON (expr)` keeps only the first row for each unique value of the expression, using the `ORDER BY` to determine which row is "first".

```sql
-- Most recent order per user
SELECT DISTINCT ON (user_id)
  user_id, id AS order_id, created_at, amount
FROM orders
ORDER BY user_id, created_at DESC;

-- Cheapest product per category
SELECT DISTINCT ON (category)
  category, name, price
FROM products
ORDER BY category, price ASC;
```

> The expression in `DISTINCT ON (...)` must appear first in the `ORDER BY` clause. This is a PostgreSQL-only feature — the standard equivalent uses `ROW_NUMBER()` in a subquery.

---

### L2 Aggregate functions (PostgreSQL extras)

| Function | Returns | Example |
|---|---|---|
| `STRING_AGG(col, delim)` | delimited string | `STRING_AGG(name, ', ' ORDER BY name)` |
| `ARRAY_AGG(col)` | PostgreSQL array | `ARRAY_AGG(tag ORDER BY tag)` |
| `JSON_AGG(expr)` | JSON array of values | `JSON_AGG(ROW_TO_JSON(t))` |
| `JSONB_AGG(expr)` | JSONB array of values | `JSONB_AGG(t ORDER BY id)` |
| `JSONB_OBJECT_AGG(k, v)` | JSONB object from key-value pairs | `JSONB_OBJECT_AGG(code, label)` |
| `BOOL_AND(cond)` | `TRUE` if all rows satisfy condition | `BOOL_AND(is_verified)` |
| `BOOL_OR(cond)` | `TRUE` if any row satisfies condition | `BOOL_OR(has_error)` |
| `BIT_AND(n)` / `BIT_OR(n)` / `BIT_XOR(n)` | bitwise aggregation | `BIT_OR(permission_flags)` |

---

### L2 Index types overview

| Type | Best for | Creation |
|---|---|---|
| `BTREE` (default) | equality, range, `ORDER BY`, `<`, `>`, `BETWEEN`, `LIKE 'prefix%'` | `CREATE INDEX ON t (col)` |
| `HASH` | equality only — slightly faster than B-tree for `=`, no range | `CREATE INDEX ON t USING HASH (col)` |
| `GIN` | array containment (`@>`), JSONB key existence (`?`), full-text search (`@@`), `pg_trgm` | `CREATE INDEX ON t USING GIN (col)` |
| `GIST` | geometric types, range types, full-text, `pg_trgm`, overlapping intervals | `CREATE INDEX ON t USING GIST (col)` |
| `BRIN` | very large tables where the physical order correlates with the column (timestamps in append-only logs) | `CREATE INDEX ON t USING BRIN (col)` |
| `SP-GIST` | non-balanced tree structures: IP ranges, polygon containment | `CREATE INDEX ON t USING SPGIST (col)` |

---

### L2 Partial and expression indexes

```sql
-- Partial index: only index rows matching a WHERE condition
-- Much smaller, queries that match the condition run faster
CREATE INDEX ON orders (user_id)
WHERE status = 'pending';

-- Expression index: index a computed value
-- Enables WHERE LOWER(email) = ... to use the index
CREATE INDEX ON users (LOWER(email));

-- Multi-column index: column order matters
-- Use (a, b) when queries filter on a, or both a and b
CREATE INDEX ON events (user_id, created_at DESC);

-- Create index without locking writes (safe for production)
CREATE INDEX CONCURRENTLY ON orders (product_id);
```

---

### L2 EXPLAIN ANALYZE

Full form of `EXPLAIN` with actual execution statistics.

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;
```

Key output fields:

| Field | Meaning |
|---|---|
| `cost=x..y` | estimated start cost and total cost (arbitrary planner units) |
| `rows=n` | estimated row count |
| `actual time=x..y` | real start and end time in ms |
| `actual rows=n` | real row count — compare with `rows` to spot bad estimates |
| `loops=n` | how many times this node ran (multiply actual by loops) |
| `Buffers: shared hit=n read=n` | pages from cache vs disk — high `read` means missing buffer cache |
| `Planning time` | time to build the plan |
| `Execution time` | total wall time |

```sql
-- Save explain output to a file from psql
\o /tmp/plan.txt
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;
\o
```

---

### L2 Materialized views

A materialized view stores the query result physically and must be refreshed manually.

```sql
-- Create
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS total
FROM orders
GROUP BY 1;

-- Query it like a table
SELECT * FROM monthly_sales ORDER BY month;

-- Refresh (blocks reads by default)
REFRESH MATERIALIZED VIEW monthly_sales;

-- Refresh without locking reads (requires a UNIQUE index on the view)
CREATE UNIQUE INDEX ON monthly_sales (month);
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;

-- Drop
DROP MATERIALIZED VIEW monthly_sales;
```

> Materialized views are ideal for expensive aggregations queried frequently. The trade-off is stale data between refreshes.

---

### L2 Sequences

Sequences generate unique, gap-tolerant integer values. `SERIAL` / `BIGSERIAL` column types create sequences automatically.

```sql
-- Create a standalone sequence
CREATE SEQUENCE order_number_seq START 1000 INCREMENT 1;

-- Get the next value
SELECT NEXTVAL('order_number_seq');

-- Get the current value (in the same session — no new value)
SELECT CURRVAL('order_number_seq');

-- Peek at the last value without advancing (for diagnostics)
SELECT LAST_VALUE FROM order_number_seq;

-- Reset a sequence
SELECT SETVAL('order_number_seq', 5000);

-- Use in INSERT
INSERT INTO orders (order_number) VALUES (NEXTVAL('order_number_seq'));
```

> Sequences are never rolled back, even if the transaction aborts. That is by design — it prevents deadlocks from gap-free requirements. Gaps are normal.

---

### L2 Custom types and domains

```sql
-- Enum type
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');
ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';

-- Add a new value to an existing enum
ALTER TYPE order_status ADD VALUE 'refunded' AFTER 'shipped';

-- Composite type
CREATE TYPE address AS (
  street TEXT,
  city   TEXT,
  zip    TEXT
);

-- Domain — a type with a constraint
CREATE DOMAIN positive_numeric AS NUMERIC CHECK (VALUE > 0);
CREATE DOMAIN email_text AS TEXT CHECK (VALUE ~ '^[^@]+@[^@]+\.[^@]+$');

ALTER TABLE products ADD COLUMN price positive_numeric;
```

---

## Level 3 — Senior

### L3 Advanced JSONB functions

| Function | Returns | Example |
|---|---|---|
| `JSONB_SET(doc, path, val)` | updated JSONB — replace value at path | `JSONB_SET(data, '{address,city}', '"Berlin"')` |
| `JSONB_SET(doc, path, val, create)` | with `TRUE`, creates path if missing | `JSONB_SET(data, '{new_key}', '"val"', TRUE)` |
| `JSONB_INSERT(doc, path, val)` | insert before the path (arrays) | `JSONB_INSERT(arr, '{0}', '"first"')` |
| `JSONB_INSERT(doc, path, val, TRUE)` | insert after the path | — |
| `JSONB_DELETE_PATH(doc, path)` | delete value at path | `JSONB_DELETE_PATH(data, '{sensitive,token}')` |
| `JSONB_EACH(col)` | set of `(key text, value jsonb)` rows | `SELECT key, value FROM JSONB_EACH(data)` |
| `JSONB_EACH_TEXT(col)` | set of `(key text, value text)` rows | — |
| `JSONB_OBJECT_KEYS(col)` | set of top-level text keys | `SELECT JSONB_OBJECT_KEYS(data)` |
| `JSONB_ARRAY_ELEMENTS(arr)` | set of JSONB array elements | `SELECT val FROM JSONB_ARRAY_ELEMENTS(data -> 'items')` |
| `JSONB_ARRAY_ELEMENTS_TEXT(arr)` | set of text array elements | — |
| `JSONB_ARRAY_LENGTH(arr)` | count of array elements | `JSONB_ARRAY_LENGTH(data -> 'tags')` |
| `JSONB_TYPEOF(val)` | type string: `'object'`, `'array'`, `'string'`, `'number'`, `'boolean'`, `'null'` | `JSONB_TYPEOF(data -> 'count')` |
| `JSONB_STRIP_NULLS(doc)` | remove all null-valued keys recursively | `JSONB_STRIP_NULLS(data)` |
| `JSONB_PRETTY(doc)` | human-readable indented JSON text | `SELECT JSONB_PRETTY(large_blob)` |
| `JSONB_TO_RECORD(doc)` | single row as a record | `SELECT * FROM JSONB_TO_RECORD(doc) AS t(id INT, name TEXT)` |
| `JSONB_TO_RECORDSET(arr)` | JSON array of objects as a table | `SELECT * FROM JSONB_TO_RECORDSET(data) AS t(id INT, name TEXT)` |
| `JSONB_POPULATE_RECORD(base, doc)` | populate a composite type from JSONB | — |

```sql
-- Update a nested key
UPDATE users
SET profile = JSONB_SET(profile, '{address,city}', '"Warsaw"')
WHERE id = 42;

-- Expand a JSONB array of objects into rows
SELECT t.id, t.name
FROM users u,
  JSONB_TO_RECORDSET(u.profile -> 'contacts') AS t(id INT, name TEXT);

-- Remove all null values before storing
INSERT INTO events (data)
VALUES (JSONB_STRIP_NULLS('{"a":1,"b":null,"c":3}'::JSONB));
-- stores {"a":1,"c":3}
```

---

### L3 JSONPath queries

PostgreSQL 12+ supports the SQL:2016 JSONPath language for querying JSONB.

| Function | Returns | Example |
|---|---|---|
| `JSONB_PATH_EXISTS(doc, path)` | `TRUE` if path matches | `JSONB_PATH_EXISTS(data, '$.tags[*] ? (@ == "urgent")')` |
| `JSONB_PATH_QUERY(doc, path)` | set of matching JSONB values | `JSONB_PATH_QUERY(data, '$.items[*].price')` |
| `JSONB_PATH_QUERY_ARRAY(doc, path)` | matching values as a JSONB array | `JSONB_PATH_QUERY_ARRAY(data, '$.items[*].price')` |
| `JSONB_PATH_QUERY_FIRST(doc, path)` | first matching value | — |
| `JSONB_PATH_MATCH(doc, path)` | `TRUE`/`FALSE` for a predicate path | `JSONB_PATH_MATCH(data, '$.score > 90')` |
| `@?` operator | same as `JSONB_PATH_EXISTS` | `data @? '$.tags[*] ? (@ == "urgent")'` |
| `@@` operator | same as `JSONB_PATH_MATCH` | `data @@ '$.score > 90'` |

```sql
-- Items with price > 100
SELECT JSONB_PATH_QUERY(cart, '$.items[*] ? (@.price > 100)')
FROM orders;

-- Shorthand with operator
SELECT * FROM products
WHERE data @? '$.variants[*] ? (@.stock > 0)';
```

---

### L3 Full-text search

PostgreSQL's built-in full-text search uses `TSVECTOR` (a document's lexemes) and `TSQUERY` (a parsed search query).

| Function / operator | Returns | Example |
|---|---|---|
| `TO_TSVECTOR(config, text)` | normalized lexeme vector | `TO_TSVECTOR('english', body)` |
| `TO_TSVECTOR(text)` | uses `default_text_search_config` | `TO_TSVECTOR(body)` |
| `TO_TSQUERY(config, query)` | tsquery from tsquery syntax | `TO_TSQUERY('english', 'sql & window')` |
| `PLAINTO_TSQUERY(config, text)` | plain text → AND of all words | `PLAINTO_TSQUERY('english', 'window functions')` |
| `PHRASETO_TSQUERY(config, text)` | phrase search (word order matters) | `PHRASETO_TSQUERY('english', 'window function')` |
| `WEBSEARCH_TO_TSQUERY(config, text)` | Google-like syntax: `+`, `-`, `"phrase"` | `WEBSEARCH_TO_TSQUERY('english', '"sql join" -cross')` |
| `tsvec @@ tsquery` | document matches query | `WHERE to_tsvector('english', body) @@ query` |
| `TS_RANK(vec, query)` | relevance score (0–1) | `ORDER BY TS_RANK(search_vec, query) DESC` |
| `TS_RANK_CD(vec, query)` | rank with cover density (considers proximity) | — |
| `TS_HEADLINE(config, text, query)` | highlighted excerpt with matched terms | `TS_HEADLINE('english', body, query, 'MaxFragments=3')` |
| `TSVECTOR \|\| TSVECTOR` | combine vectors | `TO_TSVECTOR(title) \|\| TO_TSVECTOR(body)` |
| `SETWEIGHT(vec, weight)` | assign weight A–D to vector | `SETWEIGHT(TO_TSVECTOR(title), 'A')` |
| `TSQUERY && TSQUERY` | AND two queries | — |
| `TSQUERY \|\| TSQUERY` | OR two queries | — |
| `!! TSQUERY` | NOT a query | — |

```sql
-- Generated stored tsvector column (update automatically)
ALTER TABLE articles ADD COLUMN search_vec TSVECTOR
  GENERATED ALWAYS AS (
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(title,'')), 'A') ||
    SETWEIGHT(TO_TSVECTOR('english', COALESCE(body,'')), 'B')
  ) STORED;

CREATE INDEX ON articles USING GIN (search_vec);

-- Search
SELECT id, title, TS_RANK(search_vec, query) AS rank
FROM articles, WEBSEARCH_TO_TSQUERY('english', 'window functions tutorial') query
WHERE search_vec @@ query
ORDER BY rank DESC
LIMIT 10;

-- Highlighted excerpt
SELECT TS_HEADLINE('english', body, TO_TSQUERY('english', 'window'), 'MaxFragments=2')
FROM articles WHERE id = 1;
```

---

### L3 pg_trgm — trigram similarity

`pg_trgm` provides fuzzy string matching using trigrams (sequences of 3 characters). Install once per database: `CREATE EXTENSION pg_trgm`.

| Function / operator | Returns | Example |
|---|---|---|
| `SIMILARITY(a, b)` | 0–1 similarity score | `SIMILARITY('hello', 'helo')` → `0.5` |
| `SHOW_TRGM(s)` | array of all trigrams | `SHOW_TRGM('hello')` |
| `WORD_SIMILARITY(word, text)` | best similarity of word in text | `WORD_SIMILARITY('sql', 'learn sql fast')` |
| `a % b` | `TRUE` if `SIMILARITY >= pg_trgm.similarity_threshold` (default 0.3) | `WHERE name % 'postgresql'` |
| `a <% b` | `TRUE` if `WORD_SIMILARITY(a, b) >= threshold` | `WHERE 'sql' <% description` |
| `a %> b` | same as `b <% a` | — |
| `a <-> b` | trigram distance `1 - SIMILARITY` — use in `ORDER BY` | `ORDER BY name <-> 'postgresql' LIMIT 10` |
| `a <<-> b` | word-similarity distance | — |

```sql
-- Fuzzy name search — "did you mean?"
SELECT name, SIMILARITY(name, 'postgresql') AS sim
FROM products
WHERE name % 'postgresql'
ORDER BY sim DESC;

-- Fast LIKE '%pattern%' with a GIN trigram index
CREATE INDEX ON articles USING GIN (body gin_trgm_ops);
SELECT * FROM articles WHERE body ILIKE '%window function%';
```

---

### L3 PL/pgSQL — functions

PL/pgSQL is PostgreSQL's built-in procedural language for stored functions and procedures.

```sql
-- Simple function returning a scalar
CREATE OR REPLACE FUNCTION get_user_tier(p_user_id INT)
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  v_spend NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO v_spend
  FROM orders
  WHERE user_id = p_user_id;

  RETURN CASE
    WHEN v_spend > 10000 THEN 'gold'
    WHEN v_spend > 1000  THEN 'silver'
    ELSE                      'bronze'
  END;
END;
$$;

-- Function returning a table
CREATE OR REPLACE FUNCTION top_customers(n INT DEFAULT 10)
RETURNS TABLE(user_id INT, total NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
    SELECT o.user_id, SUM(o.amount) AS total
    FROM orders o
    GROUP BY o.user_id
    ORDER BY total DESC
    LIMIT n;
END;
$$;

-- Call
SELECT * FROM top_customers(5);
```

Key PL/pgSQL constructs:

| Construct | Purpose |
|---|---|
| `DECLARE var type := val` | declare and optionally initialize |
| `SELECT ... INTO var` | read a scalar into a variable |
| `SELECT ... INTO STRICT var` | raises error if 0 or >1 rows |
| `PERFORM query` | run a query and discard results |
| `EXECUTE 'sql'` | run dynamic SQL |
| `EXECUTE 'sql' USING val1, val2` | dynamic SQL with parameters |
| `RETURN expr` | return a scalar |
| `RETURN QUERY SELECT ...` | return a result set |
| `RETURN NEXT expr` | accumulate rows in a set-returning function |
| `IF cond THEN ... ELSIF ... ELSE ... END IF` | conditional |
| `CASE WHEN ... THEN ... END CASE` | case in procedural context |
| `LOOP ... EXIT WHEN cond; END LOOP` | unconditional loop |
| `WHILE cond LOOP ... END LOOP` | while loop |
| `FOR i IN 1..10 LOOP ... END LOOP` | integer for loop |
| `FOR rec IN SELECT ... LOOP ... END LOOP` | cursor-style row loop |
| `FOREACH val IN ARRAY arr LOOP` | array iteration |
| `RAISE NOTICE 'msg: %', val` | log message |
| `RAISE EXCEPTION 'msg: %', val` | abort with error |
| `RAISE EXCEPTION ... USING ERRCODE = '23505'` | raise with SQLSTATE |
| `GET DIAGNOSTICS n = ROW_COUNT` | rows affected by last DML |
| `FOUND` | boolean — TRUE if last query returned rows |

---

### L3 PL/pgSQL — triggers

A trigger function runs automatically in response to a table event.

```sql
-- Trigger function: auto-set updated_at
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Audit trigger: log every deletion to an audit table
CREATE OR REPLACE FUNCTION trg_audit_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_log (table_name, old_data, deleted_at)
  VALUES (TG_TABLE_NAME, ROW_TO_JSON(OLD), NOW());
  RETURN OLD;
END;
$$;

CREATE TRIGGER audit_users_delete
AFTER DELETE ON users
FOR EACH ROW EXECUTE FUNCTION trg_audit_delete();
```

| Variable | Available in | Value |
|---|---|---|
| `NEW` | `INSERT`, `UPDATE` (`BEFORE`/`AFTER`) | the new row |
| `OLD` | `UPDATE`, `DELETE` (`BEFORE`/`AFTER`) | the old row |
| `TG_OP` | all | `'INSERT'`, `'UPDATE'`, `'DELETE'`, `'TRUNCATE'` |
| `TG_TABLE_NAME` | all | name of the triggering table |
| `TG_WHEN` | all | `'BEFORE'` or `'AFTER'` |
| `TG_LEVEL` | all | `'ROW'` or `'STATEMENT'` |

Trigger timing combinations:

| Timing | Level | Use case |
|---|---|---|
| `BEFORE` `FOR EACH ROW` | Row | Modify `NEW` before it is written |
| `AFTER` `FOR EACH ROW` | Row | React to changes, write to audit tables |
| `BEFORE` `FOR EACH STATEMENT` | Statement | Prevent bulk operations |
| `AFTER` `FOR EACH STATEMENT` | Statement | Batch notifications, deferred actions |
| `INSTEAD OF` `FOR EACH ROW` | Row (views only) | Make a view writable |

---

### L3 Row-level security (RLS)

RLS restricts which rows each role can see or modify, enforced at the storage layer.

```sql
-- Enable RLS on a table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own rows
CREATE POLICY own_rows ON documents
  FOR ALL
  USING (owner_id = CURRENT_USER::INT);

-- Policy: admins see everything
CREATE POLICY admin_all ON documents
  FOR ALL
  TO admin_role
  USING (TRUE);

-- Separate read and write policies
CREATE POLICY read_own ON messages
  FOR SELECT USING (recipient_id = current_user_id());

CREATE POLICY write_own ON messages
  FOR INSERT WITH CHECK (sender_id = current_user_id());

-- Superusers and table owners bypass RLS by default
-- Force RLS even for the table owner:
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

-- Temporarily disable RLS (e.g. for admin functions)
SET LOCAL row_security = OFF;
```

---

### L3 Table partitioning

Partition a large table into smaller physical pieces that can be queried, maintained, and dropped independently.

```sql
-- Range partitioning by date (common for time-series data)
CREATE TABLE orders (
  id          BIGSERIAL,
  created_at  TIMESTAMPTZ NOT NULL,
  amount      NUMERIC
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- List partitioning (e.g. by country)
CREATE TABLE events (
  id      BIGSERIAL,
  country TEXT NOT NULL
) PARTITION BY LIST (country);

CREATE TABLE events_eu PARTITION OF events
  FOR VALUES IN ('DE', 'FR', 'PL', 'UK');

CREATE TABLE events_us PARTITION OF events
  FOR VALUES IN ('US', 'CA', 'MX');

-- Hash partitioning (evenly distribute by a key)
CREATE TABLE users (
  id BIGSERIAL
) PARTITION BY HASH (id);

CREATE TABLE users_0 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE users_1 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 1);
-- ... etc

-- Drop old data instantly (no DELETE scan)
DROP TABLE orders_2024_q1;

-- Detach a partition for maintenance
ALTER TABLE orders DETACH PARTITION orders_2024_q2;
```

> Indexes, constraints, and `DEFAULT` partitions (`FOR VALUES DEFAULT`) work on partitioned tables. Constraint exclusion lets the planner skip irrelevant partitions automatically.

---

### L3 Covering indexes and INCLUDE

A covering index stores extra columns so that queries can be satisfied entirely from the index without reading heap pages.

```sql
-- Without INCLUDE: queries on (user_id) that also need email must hit the heap
CREATE INDEX ON users (user_id);

-- With INCLUDE: email is stored in the index leaf — no heap fetch needed
CREATE INDEX ON users (user_id) INCLUDE (email, name);

-- Covering index for a common lookup + display pattern
CREATE UNIQUE INDEX ON orders (id) INCLUDE (status, created_at, amount);

-- Partial covering index
CREATE INDEX ON orders (user_id) INCLUDE (amount, status)
WHERE status IN ('pending', 'processing');
```

---

### L3 Advisory locks

Application-level locks identified by a 64-bit integer. They do not automatically correlate with any table or row — the application decides what the number means.

```sql
-- Session-level: held until explicitly released or session ends
SELECT PG_ADVISORY_LOCK(12345);
-- ... do protected work ...
SELECT PG_ADVISORY_UNLOCK(12345);

-- Non-blocking: returns FALSE if lock is already taken
SELECT PG_TRY_ADVISORY_LOCK(12345);

-- Transaction-level: auto-released at end of transaction
SELECT PG_ADVISORY_XACT_LOCK(12345);
SELECT PG_TRY_ADVISORY_XACT_LOCK(12345);  -- non-blocking

-- Shared (read) advisory locks — multiple holders allowed
SELECT PG_ADVISORY_LOCK_SHARED(12345);
SELECT PG_ADVISORY_UNLOCK_SHARED(12345);

-- View current advisory locks
SELECT * FROM PG_LOCKS WHERE locktype = 'advisory';
```

> Common use case: ensuring only one process runs a scheduled job at a time. Use a consistent naming convention — e.g. hash the job name: `HASHTEXT('billing_sync')::BIGINT`.

---

### L3 LISTEN / NOTIFY

PostgreSQL's built-in pub/sub mechanism for inter-session and inter-process communication.

```sql
-- Publisher: send a notification on a named channel
NOTIFY order_created, '{"order_id": 123}';

-- Inside a trigger: notify on every insert
CREATE OR REPLACE FUNCTION trg_notify_order()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM PG_NOTIFY('order_created', ROW_TO_JSON(NEW)::TEXT);
  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_on_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION trg_notify_order();

-- Subscriber: listen on a channel
LISTEN order_created;

-- Receive notifications (psql blocks and prints each notification)
-- Application code uses the driver's async notification API
```

> The payload is limited to 8000 bytes. The notification is delivered when the sending transaction commits — if it rolls back, no notification is sent. Applications use this for cache invalidation, job queue signalling, and real-time dashboards.

---

### L3 COPY — bulk data transfer

`COPY` is the fastest way to move large amounts of data in or out of PostgreSQL.

```sql
-- Export a table to CSV
COPY orders TO '/tmp/orders.csv' CSV HEADER;

-- Export a query result
COPY (SELECT id, amount FROM orders WHERE status = 'paid')
TO '/tmp/paid_orders.csv' CSV HEADER DELIMITER ',';

-- Import from CSV
COPY orders (id, user_id, amount, created_at)
FROM '/tmp/orders.csv' CSV HEADER;

-- Binary format — fastest, non-portable
COPY orders TO '/tmp/orders.bin' BINARY;

-- From psql client (uses client-side file path)
\copy orders TO '/local/path/orders.csv' CSV HEADER
\copy orders FROM '/local/path/orders.csv' CSV HEADER

-- From application code: use COPY ... FROM STDIN / TO STDOUT
-- and stream data through the driver (e.g. pg_copy_to / pg_copy_from in drivers)
```

> `COPY` is 10–100x faster than bulk `INSERT`. It bypasses triggers and constraints during the copy (for `FROM`) unless you use `COPY ... WITH (...)` options. Check constraints are still enforced.

---

### L3 Extensions

Extensions add types, functions, operators, and index access methods to a database.

```sql
-- Install an extension (once per database, requires superuser or CREATE privilege)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- List installed extensions
SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE installed_version IS NOT NULL;
```

| Extension | What it adds |
|---|---|
| `uuid-ossp` | `UUID_GENERATE_V4()` and other UUID generation functions |
| `pgcrypto` | `GEN_RANDOM_UUID()`, `CRYPT()`, `DIGEST()`, `PGP_*` encryption |
| `pg_trgm` | trigram similarity (`%`, `<->`, `SIMILARITY`) and GIN/GiST trgm indexes |
| `hstore` | key-value pairs as a column type: `'a=>1, b=>2'::hstore` |
| `pg_stat_statements` | aggregate query performance stats across all executions |
| `postgis` | geographic and spatial types, operators, and indexes |
| `ltree` | label tree type for hierarchical data with fast path queries |
| `citext` | case-insensitive text type |
| `intarray` | array operators optimised for integer arrays |
| `tablefunc` | `CROSSTAB` (pivot), `NORMAL_RAND`, `CONNECTBY` |
| `unaccent` | text search dictionary that strips accents |
| `pg_partman` | automated partition management |

---

### L3 System functions and catalog views

| Function / view | Returns | Example |
|---|---|---|
| `PG_SIZE_PRETTY(bytes)` | human-readable size | `PG_SIZE_PRETTY(PG_TOTAL_RELATION_SIZE('orders'))` |
| `PG_TOTAL_RELATION_SIZE(rel)` | bytes for table + all indexes + TOAST | `PG_TOTAL_RELATION_SIZE('orders')` |
| `PG_RELATION_SIZE(rel)` | bytes for main fork only | — |
| `PG_INDEXES_SIZE(rel)` | total size of all indexes on the table | — |
| `PG_TYPEOF(val)` | data type name as text | `PG_TYPEOF(NOW())` → `'timestamp with time zone'` |
| `PG_SLEEP(s)` | pause for s seconds | `SELECT PG_SLEEP(2)` |
| `PG_CANCEL_BACKEND(pid)` | cancel current query in the session | safe; only stops the query |
| `PG_TERMINATE_BACKEND(pid)` | kill the session entirely | forceful; use `PG_CANCEL_BACKEND` first |
| `PG_NOTIFY(channel, payload)` | send a NOTIFY | `PERFORM PG_NOTIFY('events', '{}')` |
| `VERSION()` | PostgreSQL version string | `SELECT VERSION()` |
| `CURRENT_DATABASE()` | name of the current database | `SELECT CURRENT_DATABASE()` |
| `CURRENT_SCHEMA()` | current search-path schema | `SELECT CURRENT_SCHEMA()` |
| `CURRENT_USER` / `SESSION_USER` | current role / login role | — |
| `CURRENT_SETTING(param)` | value of a GUC parameter | `CURRENT_SETTING('work_mem')` |
| `SET_CONFIG(param, val, local)` | change a GUC (`local` = transaction only) | `SET_CONFIG('search_path', 'myschema,public', FALSE)` |

Important system catalog views:

| View | Shows |
|---|---|
| `PG_STAT_USER_TABLES` | sequential/index scans, live/dead tuples per table |
| `PG_STAT_USER_INDEXES` | index scans, tuples read, size |
| `PG_STAT_STATEMENTS` | aggregate query stats (requires extension) |
| `PG_LOCKS` | current lock holders and waiters |
| `PG_STAT_ACTIVITY` | currently running queries, blocking info |
| `PG_INDEXES` | index definitions in human-readable form |
| `PG_TABLES` | table owner, schema, tablespace |
| `PG_VIEWS` | view definitions |
| `PG_SEQUENCES` | all sequences and their current state |
| `PG_ROLES` | all roles (users and groups) |

```sql
-- Find the 10 largest tables
SELECT
  relname AS table,
  PG_SIZE_PRETTY(PG_TOTAL_RELATION_SIZE(relid)) AS total_size
FROM PG_STAT_USER_TABLES
ORDER BY PG_TOTAL_RELATION_SIZE(relid) DESC
LIMIT 10;

-- Find queries currently blocked
SELECT pid, query, wait_event, wait_event_type, state
FROM PG_STAT_ACTIVITY
WHERE wait_event IS NOT NULL
  AND state = 'active';

-- Find unused indexes (0 scans since last statistics reset)
SELECT indexrelname, relname, idx_scan
FROM PG_STAT_USER_INDEXES
WHERE idx_scan = 0
ORDER BY PG_RELATION_SIZE(indexrelid) DESC;
```

---

### L3 Roles, grants, and security

```sql
-- Create a role (login role = user)
CREATE ROLE alice LOGIN PASSWORD 'secret';

-- Create a group role (no login)
CREATE ROLE readonly_role;

-- Grant group membership
GRANT readonly_role TO alice;

-- Grant privileges on objects
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;
GRANT SELECT, INSERT, UPDATE ON orders TO app_role;
GRANT USAGE ON SCHEMA analytics TO analytics_role;
GRANT EXECUTE ON FUNCTION get_user_tier(INT) TO app_role;

-- Revoke
REVOKE INSERT ON orders FROM app_role;

-- Default privileges — apply to future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO readonly_role;

-- SECURITY DEFINER: function runs as its owner, not the caller
CREATE FUNCTION admin_action()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  -- Runs with the privilege of the function owner
  DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$;

-- Search path control (prevent search-path injection in SECURITY DEFINER)
CREATE FUNCTION safe_fn() RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp AS $$
BEGIN ... END;
$$;
```

---

### L3 Vacuuming and bloat

PostgreSQL uses MVCC — old row versions are kept until cleaned up. `VACUUM` reclaims them.

```sql
-- Basic vacuum (reclaims dead tuples, does NOT return space to OS)
VACUUM orders;

-- Full vacuum (rewrites the table, returns space — locks the table)
VACUUM FULL orders;

-- Analyze: update statistics used by the query planner
ANALYZE orders;

-- Vacuum + analyze in one pass
VACUUM ANALYZE orders;

-- See table bloat estimate
SELECT
  relname,
  n_live_tup,
  n_dead_tup,
  ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS dead_pct,
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Autovacuum tuning parameters (set per table)
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,   -- vacuum when 1% of rows are dead
  autovacuum_analyze_scale_factor = 0.005
);
```

> High `n_dead_tup` or `dead_pct` means autovacuum is falling behind — common after heavy `UPDATE`/`DELETE` workloads. Check `pg_stat_activity` for long-running transactions that prevent vacuuming.

---

## Quick reference table

| Feature | Level | Category |
|---|---|---|
| `TEXT`, `BOOLEAN`, `SERIAL`, `BIGSERIAL`, `UUID`, `JSONB`, `TIMESTAMPTZ` | Junior | Types |
| `val::type` cast shorthand | Junior | Syntax |
| `ILIKE`, `NOT ILIKE` | Junior | Pattern |
| `RETURNING` clause | Junior | DML |
| `ON CONFLICT DO NOTHING / DO UPDATE` | Junior | Upsert |
| `NOW()`, `DATE_TRUNC`, `DATE_PART`, `AGE`, `TO_CHAR`, `TO_DATE` | Junior | Date/time |
| `INITCAP`, `SPLIT_PART`, `FORMAT`, `STRPOS`, `MD5`, `LPAD`, `RPAD` | Junior | String |
| `EXPLAIN` (basic plan reading) | Junior | Performance |
| `\dt`, `\d`, `\l`, `\x`, `\timing` (psql) | Junior | Tooling |
| `->`, `->>`, `#>`, `@>`, `?`, `||` (JSONB) | Mid | JSONB ops |
| `JSONB_BUILD_OBJECT`, `JSONB_AGG`, `JSON_AGG` | Mid | JSONB build |
| `ARRAY[...]`, `@>`, `&&`, `UNNEST`, `ARRAY_AGG`, `ARRAY_LENGTH` | Mid | Arrays |
| `~`, `~*`, `!~`, `REGEXP_MATCH`, `REGEXP_REPLACE('g')` | Mid | Regex |
| `STRING_AGG`, `BOOL_AND`, `BOOL_OR`, `JSONB_OBJECT_AGG` | Mid | Aggregates |
| `GENERATE_SERIES` | Mid | Utility |
| `DISTINCT ON` | Mid | Query |
| B-tree, Hash, GIN, GiST, BRIN index types | Mid | Indexes |
| Partial indexes, expression indexes, `CONCURRENTLY` | Mid | Indexes |
| `EXPLAIN (ANALYZE, BUFFERS)` | Mid | Performance |
| `CREATE MATERIALIZED VIEW`, `REFRESH` | Mid | Views |
| `CREATE SEQUENCE`, `NEXTVAL`, `SETVAL` | Mid | Sequences |
| `CREATE TYPE AS ENUM`, `CREATE DOMAIN` | Mid | Types |
| `JSONB_SET`, `JSONB_INSERT`, `JSONB_EACH`, `JSONB_TO_RECORDSET` | Senior | JSONB adv |
| `JSONB_PATH_QUERY`, `@?`, `@@` (JSONPath) | Senior | JSONPath |
| `TO_TSVECTOR`, `TO_TSQUERY`, `@@`, `TS_RANK`, `TS_HEADLINE` | Senior | Full-text |
| `SIMILARITY`, `%`, `<->` (pg_trgm) | Senior | Trigram |
| PL/pgSQL functions, `RETURN QUERY`, `EXECUTE`, `RAISE` | Senior | Procedural |
| Triggers: `BEFORE`/`AFTER`, `NEW`/`OLD`, `TG_OP` | Senior | Triggers |
| `ENABLE ROW LEVEL SECURITY`, `CREATE POLICY` | Senior | Security |
| `PARTITION BY RANGE / LIST / HASH` | Senior | Partitioning |
| `INCLUDE` covering indexes | Senior | Indexes |
| `PG_ADVISORY_LOCK`, `PG_TRY_ADVISORY_LOCK` | Senior | Locking |
| `LISTEN`, `NOTIFY`, `PG_NOTIFY` | Senior | Pub/sub |
| `COPY TO / FROM`, `\copy` | Senior | Bulk I/O |
| `uuid-ossp`, `pgcrypto`, `pg_trgm`, `pg_stat_statements` | Senior | Extensions |
| `PG_SIZE_PRETTY`, `PG_STAT_USER_TABLES`, `PG_STAT_ACTIVITY`, `PG_LOCKS` | Senior | Catalog |
| `GRANT`, `REVOKE`, `ALTER DEFAULT PRIVILEGES`, `SECURITY DEFINER` | Senior | Security |
| `VACUUM`, `ANALYZE`, `AUTOVACUUM` tuning | Senior | Maintenance |
