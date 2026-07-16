# SQL Operators & Functions — Junior to Senior Roadmap

A learning roadmap of **standard SQL** operators and functions organized by seniority level. Everything listed here is defined in the SQL standard (SQL:1992 through SQL:2016) and works across major databases (PostgreSQL, MySQL, SQL Server, Oracle, SQLite) unless noted. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

Related guides: [Junior SQL](documentation-sql.md) · [Middle SQL](documentation-sql-middle.md) · [Window Functions](documentation-sql-window-functions.md)

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Comparison operators](#l1-comparison-operators)
  - [Logical operators](#l1-logical-operators)
  - [Arithmetic operators](#l1-arithmetic-operators)
  - [NULL-specific operators](#l1-null-specific-operators)
  - [Range and set membership](#l1-range-and-set-membership)
  - [Pattern matching — LIKE](#l1-pattern-matching--like)
  - [String functions](#l1-string-functions)
  - [Numeric functions](#l1-numeric-functions)
  - [Date / time values and functions](#l1-date--time-values-and-functions)
  - [Aggregate functions](#l1-aggregate-functions)
  - [Conditional expressions](#l1-conditional-expressions)
  - [Type casting](#l1-type-casting)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Set operators](#l2-set-operators)
  - [Subquery operators](#l2-subquery-operators)
  - [More string functions](#l2-more-string-functions)
  - [More date / time functions](#l2-more-date--time-functions)
  - [Aggregates with modifiers](#l2-aggregates-with-modifiers)
  - [Window functions — the `OVER` clause](#l2-window-functions--the-over-clause)
  - [Window functions — ranking](#l2-window-functions--ranking)
  - [Window functions — offset](#l2-window-functions--offset)
  - [Window functions — aggregate over](#l2-window-functions--aggregate-over)
  - [CTEs and recursion](#l2-ctes-and-recursion)
  - [LATERAL joins](#l2-lateral-joins)
  - [MERGE (upsert)](#l2-merge-upsert)
- [Level 3 — Senior](#level-3--senior)
  - [Window functions — advanced frames](#l3-window-functions--advanced-frames)
  - [Window functions — distribution](#l3-window-functions--distribution)
  - [Ordered-set and hypothetical aggregates](#l3-ordered-set-and-hypothetical-aggregates)
  - [GROUPING SETS, ROLLUP, CUBE](#l3-grouping-sets-rollup-cube)
  - [Standard regex functions](#l3-standard-regex-functions)
  - [SIMILAR TO — SQL pattern matching](#l3-similar-to--sql-pattern-matching)
  - [Standard JSON functions (SQL:2016)](#l3-standard-json-functions-sql2016)
  - [Row locking](#l3-row-locking)
  - [SQL/PSM — stored procedures and triggers](#l3-sqlpsm--stored-procedures-and-triggers)
  - [INFORMATION_SCHEMA](#l3-information_schema)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it returns**, a **minimal SQL example**, and a **gotcha** where relevant.
- Standard version is specified in parentheses where relevant: `(SQL:1992)`, `(SQL:2003)`, etc.
- Vendor-specific helpers (e.g. `NOW()`, `ILIKE`, `::` cast) are explicitly excluded — look for them in the PostgreSQL or MySQL-specific guides.
- Cross-references link to the deeper guides for topics that deserve their own chapter.

---

## Level 1 — Junior

### L1 Comparison operators

Building blocks of every `WHERE` and `HAVING` clause.

| Operator | Meaning | Example |
|---|---|---|
| `=` | equal | `WHERE status = 'active'` |
| `<>` | not equal (standard form) | `WHERE role <> 'admin'` |
| `<` | less than | `WHERE age < 18` |
| `>` | greater than | `WHERE price > 100` |
| `<=` | less than or equal | `WHERE score <= 60` |
| `>=` | greater than or equal | `WHERE quantity >= 1` |

> **Gotcha:** `=` never matches `NULL` — use `IS NULL` instead (see below). `!=` works on most databases but `<>` is the SQL-standard form.

---

### L1 Logical operators

| Operator | Meaning | Example |
|---|---|---|
| `AND` | both conditions true | `WHERE active = TRUE AND age > 18` |
| `OR` | at least one true | `WHERE role = 'admin' OR role = 'owner'` |
| `NOT` | negation | `WHERE NOT is_deleted` |

> **Gotcha:** `AND` binds tighter than `OR`. Use parentheses: `WHERE (a OR b) AND c`.

---

### L1 Arithmetic operators

| Operator | Meaning | Example |
|---|---|---|
| `+` | addition | `SELECT price + tax AS total` |
| `-` | subtraction | `SELECT salary - deduction AS net` |
| `*` | multiplication | `SELECT quantity * unit_price` |
| `/` | division | `SELECT total / count` — **integer division truncates in most databases** |

> The standard does not include `%` for modulo — use the `MOD(n, m)` function instead. Exponentiation uses `POWER(base, exp)`, not `^`.

---

### L1 NULL-specific operators

| Operator | Meaning | Example |
|---|---|---|
| `IS NULL` | value is NULL | `WHERE deleted_at IS NULL` |
| `IS NOT NULL` | value is not NULL | `WHERE email IS NOT NULL` |

---

### L1 Range and set membership

| Operator | Meaning | Example |
|---|---|---|
| `BETWEEN a AND b` | inclusive range check | `WHERE age BETWEEN 18 AND 65` |
| `NOT BETWEEN a AND b` | outside range | `WHERE price NOT BETWEEN 10 AND 50` |
| `IN (list)` | value matches any in list | `WHERE status IN ('active', 'pending')` |
| `NOT IN (list)` | value matches none | `WHERE country NOT IN ('US', 'CA')` |

> **Gotcha:** `NOT IN` with a subquery that returns any `NULL` silently returns no rows. Prefer `NOT EXISTS` when the subquery might produce NULLs.

---

### L1 Pattern matching — LIKE

| Operator | Meaning | Wildcards |
|---|---|---|
| `LIKE 'pattern'` | case-sensitive match (behavior depends on collation) | `%` = any sequence, `_` = single char |
| `NOT LIKE 'pattern'` | negation | same |

```sql
-- names starting with 'An'
WHERE name LIKE 'An%'

-- codes with exactly 3 characters
WHERE code LIKE '___'

-- escape a literal percent sign with ESCAPE
WHERE path LIKE '100\%' ESCAPE '\'
```

> Case sensitivity of `LIKE` depends on the column's collation, not on the database engine. `ILIKE` (case-insensitive) is a PostgreSQL extension and is not standard SQL.

---

### L1 String functions

| Function | Returns | Standard | Example |
|---|---|---|---|
| `UPPER(s)` | uppercase | SQL:1992 | `UPPER('hello')` → `'HELLO'` |
| `LOWER(s)` | lowercase | SQL:1992 | `LOWER('WORLD')` → `'world'` |
| `CHAR_LENGTH(s)` | character count | SQL:1992 | `CHAR_LENGTH('abc')` → `3` |
| `TRIM(s)` | strip leading/trailing spaces | SQL:1992 | `TRIM('  hi  ')` → `'hi'` |
| `TRIM(LEADING 'x' FROM s)` | strip leading chars | SQL:1992 | `TRIM(LEADING '0' FROM '007')` → `'7'` |
| `TRIM(TRAILING 'x' FROM s)` | strip trailing chars | SQL:1992 | `TRIM(TRAILING '.' FROM 'end.')` |
| `TRIM(BOTH 'x' FROM s)` | strip from both sides | SQL:1992 | `TRIM(BOTH ' ' FROM s)` |
| `SUBSTRING(s FROM pos)` | extract from position | SQL:1992 | `SUBSTRING('abcdef' FROM 3)` → `'cdef'` |
| `SUBSTRING(s FROM pos FOR len)` | extract with length | SQL:1992 | `SUBSTRING('abcdef' FROM 2 FOR 3)` → `'bcd'` |
| `POSITION(sub IN s)` | 1-based index of first match | SQL:1992 | `POSITION('@' IN email)` |
| `CONCAT(a, b, ...)` | join strings | SQL:2003 | `CONCAT('foo', '-', 'bar')` → `'foo-bar'` |
| `\|\|` operator | concatenate two strings | SQL:1992 | `'Hello' \|\| ', ' \|\| name` |
| `OVERLAY(s PLACING repl FROM pos FOR len)` | replace substring | SQL:1999 | `OVERLAY('abcdef' PLACING 'XY' FROM 3 FOR 2)` → `'abXYef'` |
| `TRANSLATE(s, from_chars, to_chars)` | character-by-character substitution | SQL:1992 | `TRANSLATE('abc', 'abc', 'ABC')` → `'ABC'` |
| `REPLACE(s, from_sub, to_sub)` | replace all occurrences | widely supported | `REPLACE('a.b.c', '.', '-')` → `'a-b-c'` |
| `COALESCE(a, b, ...)` | first non-NULL value | SQL:1992 | `COALESCE(nickname, first_name, 'Unknown')` |
| `NULLIF(a, b)` | NULL if a = b, else a | SQL:1992 | `NULLIF(discount, 0)` — avoids divide-by-zero |

> `CHAR_LENGTH` is the standard form; `LENGTH` is widely accepted but not in the SQL standard. `COALESCE` and `NULLIF` are the two most important nullable-value tools — master them early.

---

### L1 Numeric functions

| Function | Returns | Standard | Example |
|---|---|---|---|
| `ABS(n)` | absolute value | SQL:1992 | `ABS(-5)` → `5` |
| `MOD(n, m)` | remainder (modulo) | SQL:1992 | `MOD(10, 3)` → `1` |
| `ROUND(n, d)` | round to d decimal places | SQL:1992 | `ROUND(3.14159, 2)` → `3.14` |
| `CEILING(n)` | smallest integer ≥ n | SQL:2003 | `CEILING(1.1)` → `2` |
| `FLOOR(n)` | largest integer ≤ n | SQL:2003 | `FLOOR(1.9)` → `1` |
| `POWER(base, exp)` | exponentiation | SQL:2003 | `POWER(2, 8)` → `256` |
| `SQRT(n)` | square root | SQL:2003 | `SQRT(25)` → `5` |
| `EXP(n)` | e raised to the power n | SQL:2003 | `EXP(1)` → `2.718...` |
| `LN(n)` | natural logarithm | SQL:2003 | `LN(EXP(1))` → `1` |
| `LOG(base, n)` | logarithm with base | SQL:2003 | `LOG(10, 1000)` → `3` |
| `SIN(n)` / `COS(n)` / `TAN(n)` | trigonometric | SQL:2003 | — |

---

### L1 Date / time values and functions

| Value / function | Returns | Standard | Example |
|---|---|---|---|
| `CURRENT_DATE` | today's date | SQL:1992 | `WHERE created_on = CURRENT_DATE` |
| `CURRENT_TIME` | current time with time zone | SQL:1992 | `SELECT CURRENT_TIME` |
| `CURRENT_TIMESTAMP` | current date + time with time zone | SQL:1992 | `DEFAULT CURRENT_TIMESTAMP` |
| `LOCALTIME` | current time without time zone | SQL:1999 | — |
| `LOCALTIMESTAMP` | current date + time without time zone | SQL:1999 | — |
| `EXTRACT(field FROM val)` | numeric field from date/time | SQL:1992 | `EXTRACT(YEAR FROM order_date)` |
| `date + INTERVAL 'n unit'` | add duration to date | SQL:1992 | `due_date + INTERVAL '30' DAY` |
| `date - INTERVAL 'n unit'` | subtract duration | SQL:1992 | `NOW() - INTERVAL '7' DAY` |
| `CAST(s AS DATE)` | parse string to date | SQL:1992 | `CAST('2024-01-15' AS DATE)` |

`EXTRACT` field names: `YEAR`, `MONTH`, `DAY`, `HOUR`, `MINUTE`, `SECOND`, `DOW` (day of week), `DOY` (day of year), `EPOCH`.

```sql
-- rows from the last 30 days
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30' DAY

-- extract the year from a date column
SELECT EXTRACT(YEAR FROM hire_date) AS hire_year FROM employees;
```

> `NOW()`, `DATE_TRUNC()`, `TO_CHAR()`, and `TO_DATE()` are not standard SQL — they are vendor extensions. Use `CURRENT_TIMESTAMP` and `EXTRACT` instead.

---

### L1 Aggregate functions

Used with `GROUP BY`. See [Junior SQL Ch 7](documentation-sql.md).

| Function | Returns | Example |
|---|---|---|
| `COUNT(*)` | total row count | `SELECT COUNT(*) FROM orders` |
| `COUNT(col)` | non-NULL count | `COUNT(email)` — excludes NULLs |
| `COUNT(DISTINCT col)` | distinct non-NULL count | `COUNT(DISTINCT user_id)` |
| `SUM(col)` | sum of values | `SUM(amount)` |
| `AVG(col)` | arithmetic mean (ignores NULLs) | `AVG(score)` |
| `MIN(col)` | smallest value | `MIN(created_at)` |
| `MAX(col)` | largest value | `MAX(price)` |
| `STDDEV_SAMP(col)` | sample standard deviation | `STDDEV_SAMP(response_ms)` |
| `VAR_SAMP(col)` | sample variance | `VAR_SAMP(score)` |
| `STDDEV_POP(col)` | population standard deviation | whole-population variant |
| `VAR_POP(col)` | population variance | whole-population variant |

> **Gotcha:** `AVG` ignores NULLs in the numerator AND denominator, so it is the mean of non-NULL values only. `SUM` returns `NULL` if all values are `NULL` — wrap with `COALESCE(SUM(col), 0)` defensively.

---

### L1 Conditional expressions

| Expression | Behavior | Standard |
|---|---|---|
| `CASE WHEN … THEN … ELSE … END` | multi-branch conditional | SQL:1992 |
| `CASE col WHEN val THEN … END` | simple equality switch | SQL:1992 |

```sql
SELECT
  order_id,
  CASE
    WHEN total > 1000 THEN 'large'
    WHEN total > 100  THEN 'medium'
    ELSE 'small'
  END AS order_size
FROM orders;
```

> The `ELSE` clause is optional. If omitted and no branch matches, the result is `NULL`.

---

### L1 Type casting

| Syntax | Standard | Example |
|---|---|---|
| `CAST(val AS type)` | SQL:1992 | `CAST('42' AS INTEGER)`, `CAST(price AS NUMERIC)` |

```sql
-- Avoid integer division by casting first
SELECT CAST(total AS NUMERIC) / count AS avg_value
FROM summary;
```

> The `::type` shorthand (e.g. `price::numeric`) is a PostgreSQL extension and not standard SQL. Always use `CAST()` for portable code.

---

## Level 2 — Mid-level

### L2 Set operators

Combine result sets from multiple `SELECT` statements. Column count and compatible types must match.

| Operator | Behavior | Standard |
|---|---|---|
| `UNION` | merge, remove duplicates | SQL:1992 |
| `UNION ALL` | merge, keep duplicates — faster | SQL:1992 |
| `INTERSECT` | rows present in both result sets | SQL:1992 |
| `INTERSECT ALL` | with duplicates | SQL:1992 |
| `EXCEPT` | rows in first but not second | SQL:1992 |
| `EXCEPT ALL` | with duplicates | SQL:1992 |

```sql
SELECT user_id FROM premium_subscribers
UNION ALL
SELECT user_id FROM trial_users;
```

---

### L2 Subquery operators

| Operator | Returns | Example |
|---|---|---|
| `EXISTS (subquery)` | `TRUE` if subquery has ≥ 1 row | `WHERE EXISTS (SELECT 1 FROM orders WHERE orders.user_id = u.id)` |
| `NOT EXISTS (subquery)` | `TRUE` if subquery returns 0 rows | useful for "has no related rows" |
| `= ANY (subquery)` | `TRUE` if equal to any returned value | `WHERE score = ANY (SELECT score FROM top_scores)` |
| `= SOME (subquery)` | same as `= ANY` — `SOME` is the standard alias | SQL:1992 |
| `> ALL (subquery)` | `TRUE` if greater than every returned value | `WHERE salary > ALL (SELECT salary FROM contractors)` |
| `IN (subquery)` | shorthand for `= ANY` | `WHERE id IN (SELECT user_id FROM banned)` |

> Prefer `EXISTS` over `IN` when the subquery can return NULLs or large result sets — it stops scanning on the first matching row.

---

### L2 More string functions

| Function | Returns | Standard | Example |
|---|---|---|---|
| `CHAR_LENGTH(s)` | character count | SQL:1992 | already in L1 — use everywhere `LENGTH` would be tempting |
| `OCTET_LENGTH(s)` | byte count | SQL:1992 | `OCTET_LENGTH('€')` → `3` (UTF-8) |
| `BIT_LENGTH(s)` | bit count | SQL:1992 | `BIT_LENGTH('A')` → `8` |
| `LPAD(s, len, pad)` | pad string on the left | SQL:2016 | `LPAD('42', 5, '0')` → `'00042'` |
| `RPAD(s, len, pad)` | pad string on the right | SQL:2016 | `RPAD('hi', 5, '.')` → `'hi...'` |
| `LEFT(s, n)` | first n characters | widely supported | `LEFT('hello', 3)` → `'hel'` |
| `RIGHT(s, n)` | last n characters | widely supported | `RIGHT('hello', 3)` → `'llo'` |
| `REPEAT(s, n)` | repeat string n times | widely supported | `REPEAT('ha', 3)` → `'hahaha'` |
| `REVERSE(s)` | reversed string | widely supported | `REVERSE('abc')` → `'cba'` |
| `SUBSTRING(s FROM pat)` | first match of regex pattern | SQL:1999 | `SUBSTRING(phone FROM '[0-9]+')` |
| `NORMALIZE(s)` | Unicode normalization (NFC by default) | SQL:2016 | `NORMALIZE(name)` |

> `LPAD`, `RPAD`, `LEFT`, `RIGHT`, `REPEAT`, `REVERSE` are technically vendor extensions in older SQL versions but are supported in all major databases and were formally standardized in SQL:2016. Prefer the `SQL:1992` forms when strict portability matters.

---

### L2 More date / time functions

| Function / operator | Returns | Standard | Example |
|---|---|---|---|
| `(start, end) OVERLAPS (start2, end2)` | `TRUE` if two periods overlap | SQL:1992 | `(hire_date, term_date) OVERLAPS (CURRENT_DATE, CURRENT_DATE)` |
| `val AT TIME ZONE 'zone'` | convert between time zones | SQL:1999 | `CURRENT_TIMESTAMP AT TIME ZONE 'UTC'` |
| `CAST(s AS DATE)` / `CAST(s AS TIMESTAMP)` | parse string to date/time | SQL:1992 | `CAST('2024-06-01' AS DATE)` |
| `EXTRACT(EPOCH FROM ts)` | seconds since 1970-01-01 | SQL:2003 | `EXTRACT(EPOCH FROM created_at)` |

```sql
-- Interval arithmetic — portable forms
SELECT hire_date + INTERVAL '1' YEAR  AS one_year_in;
SELECT hire_date + INTERVAL '90' DAY  AS probation_end;

-- Normalize to a "month bucket" without DATE_TRUNC
SELECT
  EXTRACT(YEAR  FROM created_at) AS yr,
  EXTRACT(MONTH FROM created_at) AS mo,
  SUM(amount)
FROM orders
GROUP BY 1, 2
ORDER BY 1, 2;
```

> `DATE_TRUNC` is a PostgreSQL extension. The standard way to group by month is to `EXTRACT` year and month separately, or `CAST` to a truncated string using vendor-appropriate syntax.

---

### L2 Aggregates with modifiers

| Pattern | Meaning | Standard | Example |
|---|---|---|---|
| `AGG(...) FILTER (WHERE cond)` | only aggregate rows where cond is true | SQL:2003 | `COUNT(*) FILTER (WHERE status = 'error')` |
| `LISTAGG(col, delim) WITHIN GROUP (ORDER BY col)` | concatenate strings in order | SQL:2016 | `LISTAGG(name, ', ') WITHIN GROUP (ORDER BY name)` |
| `ARRAY_AGG(col)` | collect values into an array | SQL:2003 | `ARRAY_AGG(tag ORDER BY tag)` |
| `EVERY(cond)` | `TRUE` if condition is true for every row | SQL:1999 | `EVERY(is_verified)` |
| `ANY(cond)` / `SOME(cond)` | `TRUE` if condition is true for any row | SQL:1999 | `ANY(score > 90)` — as aggregate |

```sql
-- Conditional counts in one pass (no UNION)
SELECT
  COUNT(*) FILTER (WHERE status = 'ok')    AS ok_count,
  COUNT(*) FILTER (WHERE status = 'error') AS error_count,
  COUNT(*) FILTER (WHERE status = 'warn')  AS warn_count
FROM events;

-- Ordered string concatenation
SELECT department, LISTAGG(name, ', ') WITHIN GROUP (ORDER BY name) AS members
FROM employees
GROUP BY department;
```

> `STRING_AGG` is a widely used PostgreSQL/SQL Server extension for `LISTAGG`. The SQL:2016 standard form is `LISTAGG`. Use `LISTAGG` for portable code.

---

### L2 Window functions — the `OVER` clause

See [Window Functions guide Ch 1](documentation-sql-window-functions.md). Introduced in SQL:2003.

A **window function** computes a value for **each row** using a related set of rows called the **window**. Unlike `GROUP BY`, it does **not collapse** the result set — every input row stays in the output with the computed value as an extra column.

The **`OVER`** clause turns a function into a window function. Append it after any aggregate (`SUM`, `COUNT`, `AVG`…) or dedicated window function (`ROW_NUMBER`, `LAG`, `RANK`…):

```sql
function(args) OVER (
  [ PARTITION BY partition_expression [, ...] ]
  [ ORDER BY sort_expression [ASC | DESC] [, ...] ]
  [ frame_clause ]   -- advanced; see Level 3
)
```

| Part | Role | Omit when… |
|---|---|---|
| `PARTITION BY` | splits rows into independent groups; the function resets per group | you want one window over the whole result set |
| `ORDER BY` | sequences rows within each partition | ranking/offset functions need it; partition-wide totals often do not |
| `frame_clause` | limits which rows in the partition count for this row | defaults apply; see [Level 3 — advanced frames](#l3-window-functions--advanced-frames) |

**`GROUP BY` vs `OVER`**

```sql
-- GROUP BY: one row per user
SELECT user_id, SUM(total_cents) AS user_total
FROM orders
GROUP BY user_id;

-- Window: every order row, plus per-user total alongside each row
SELECT id, user_id, total_cents,
       SUM(total_cents) OVER (PARTITION BY user_id) AS user_total
FROM orders;
```

Both can group by the same expressions, but only `GROUP BY` reduces row count. `PARTITION BY` only **scopes** the window calculation.

**Common `OVER` shapes**

| Pattern | Meaning | Example |
|---|---|---|
| `OVER ()` | one partition (all rows), no internal order | `SUM(amount) OVER ()` — grand total on every row |
| `OVER (PARTITION BY col)` | separate window per group, no internal order | `COUNT(*) OVER (PARTITION BY user_id)` — user row count |
| `OVER (ORDER BY col)` | one partition, globally ordered | `ROW_NUMBER() OVER (ORDER BY created_at)` |
| `OVER (PARTITION BY a ORDER BY b)` | ordered independently within each group | `LAG(price, 1) OVER (PARTITION BY symbol ORDER BY trade_date)` |

**Where `OVER` is allowed**

Window functions may appear in the **`SELECT`** list and **`ORDER BY`**. They are **not** allowed in `WHERE`, `GROUP BY`, or `HAVING` — those clauses run **before** window values exist. To filter on a window result, use a subquery or CTE:

```sql
SELECT id, user_id, total_cents
FROM (
  SELECT id, user_id, total_cents,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders
) t
WHERE rn = 1;
```

**Logical evaluation order** (simplified): `FROM` → `WHERE` → `GROUP BY` → `HAVING` → **window functions** → `SELECT` → `DISTINCT` → `ORDER BY` → `LIMIT`.

> **Gotcha:** `ORDER BY` inside `OVER` is **not** the query's final `ORDER BY`. The inner one defines row sequence within the window; the outer one only sorts the output. Ranking, `LAG`/`LEAD`, and running totals depend on the inner `ORDER BY`.

---

### L2 Window functions — ranking

See [Window Functions guide Ch 2](documentation-sql-window-functions.md). All introduced in SQL:2003.

All four require **`ORDER BY` inside `OVER`** — see [the `OVER` clause](#l2-window-functions--the-over-clause) above. Use **`PARTITION BY`** to rank within groups (e.g. per department); omit it to rank across the whole result set.

| Function | Returns | Ties | Gaps after tie | Typical use |
|---|---|---|---|---|
| `ROW_NUMBER() OVER (...)` | unique integer 1, 2, 3… per partition | breaks ties arbitrarily | — | top-N per group, deduplication, stable row labels |
| `RANK() OVER (...)` | rank 1, 2, 3…; tied rows share rank | same rank for tied rows | yes (1, 2, 2, **4**) | leaderboards, competition standings |
| `DENSE_RANK() OVER (...)` | rank 1, 2, 3…; tied rows share rank | same rank for tied rows | no (1, 2, 2, **3**) | consecutive tier labels, distinct score levels |
| `NTILE(n) OVER (...)` | bucket number 1 through `n` | rows in same bucket may differ in value | — | quartiles/deciles, A/B cohorts, stratified sampling |

**How ties differ** — same four rows ordered by `score DESC` (100, 90, 90, 80):

| score | `ROW_NUMBER()` | `RANK()` | `DENSE_RANK()` | `NTILE(2)` |
|---|---|---|---|---|
| 100 | 1 | 1 | 1 | 1 |
| 90 | 2 or 3 * | 2 | 2 | 1 |
| 90 | 2 or 3 * | 2 | 2 | 2 |
| 80 | 4 | 4 | 3 | 2 |

\* `ROW_NUMBER()` assigns different numbers to tied rows, but **which tied row gets which number is undefined** unless you add tie-break columns to `ORDER BY` (e.g. `ORDER BY score DESC, id ASC`).

**`ROW_NUMBER()`** — assigns a unique sequential integer within each partition. The standard tool for **"latest row per key"** and **top-N per group** — wrap in a subquery/CTE and filter `WHERE rn = 1` or `WHERE rn <= 3`.

**`RANK()`** — competition ranking (Olympic-style): tied values share a rank, then the next rank **skips** positions. Two people tied for 2nd both get rank 2; the next person gets rank 4, not 3.

**`DENSE_RANK()`** — like `RANK()` for ties, but ranks stay **consecutive** after a tie (1, 2, 2, 3). Use when "rank 3" should mean "third distinct level," not "fourth row position."

**`NTILE(n)`** — splits the ordered partition into **`n` buckets** numbered 1…`n`. Rows are distributed as evenly as possible; when the count does not divide evenly, **lower-numbered buckets get the extra rows** (10 rows, `NTILE(3)` → bucket sizes 4, 3, 3).

```sql
-- Top earner per department + company-wide quartiles
SELECT
  name,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC, id) AS dept_row_num,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC)     AS dept_rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)     AS dept_dense_rank,
  NTILE(4)     OVER (ORDER BY salary DESC)                             AS salary_quartile
FROM employees;

-- Latest order per user (deduplication pattern)
SELECT id, user_id, total_cents
FROM (
  SELECT id, user_id, total_cents,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC, id) AS rn
  FROM orders
) t
WHERE rn = 1;
```

> **Gotcha:** For stable `ROW_NUMBER()` on ties, always add a **unique tie-break column** to `ORDER BY` (`id`, `created_at`, or both). Without it, two runs may assign different row numbers to tied rows.

---

### L2 Window functions — offset

Introduced in SQL:2003.

| Function | Returns |
|---|---|
| `LAG(col, offset, default) OVER (...)` | value from a row `offset` positions before current row |
| `LEAD(col, offset, default) OVER (...)` | value from a row `offset` positions after current row |

```sql
SELECT
  sale_date,
  revenue,
  LAG(revenue, 1, 0) OVER (ORDER BY sale_date) AS prev_revenue,
  revenue - LAG(revenue, 1, 0) OVER (ORDER BY sale_date) AS delta
FROM daily_sales;
```

---

### L2 Window functions — aggregate over

Any aggregate function can be turned into a window function by appending `OVER (...)`. SQL:2003.

```sql
SELECT
  id,
  amount,
  SUM(amount) OVER ()                          AS grand_total,
  SUM(amount) OVER (PARTITION BY user_id)      AS user_total,
  SUM(amount) OVER (ORDER BY sale_date)        AS running_total,
  AVG(amount) OVER (PARTITION BY category)     AS category_avg,
  COUNT(*)    OVER (PARTITION BY user_id)      AS user_order_count
FROM orders;
```

---

### L2 CTEs and recursion

SQL:1999 for `WITH`, SQL:1999 for `WITH RECURSIVE`.

```sql
-- Non-recursive CTE — name a subquery
WITH monthly AS (
  SELECT
    EXTRACT(YEAR  FROM created_at) AS yr,
    EXTRACT(MONTH FROM created_at) AS mo,
    SUM(amount) AS total
  FROM orders
  GROUP BY 1, 2
)
SELECT * FROM monthly WHERE total > 10000;

-- Recursive CTE — traverse a parent/child tree
WITH RECURSIVE category_path AS (
  -- anchor: root nodes
  SELECT id, parent_id, name, 1 AS depth
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- recursive step: join children
  SELECT c.id, c.parent_id, c.name, p.depth + 1
  FROM categories c
  JOIN category_path p ON c.parent_id = p.id
)
SELECT * FROM category_path ORDER BY depth, name;
```

> Add a `WHERE depth < 50` guard (or a `CYCLE` clause, SQL:1999) to prevent infinite loops in graphs with cycles.

---

### L2 LATERAL joins

SQL:1999. A `LATERAL` subquery can reference columns from tables listed earlier in the `FROM` clause.

```sql
-- Most recent order per user
SELECT u.id, u.name, recent.amount, recent.created_at
FROM users u
LEFT JOIN LATERAL (
  SELECT amount, created_at
  FROM orders
  WHERE user_id = u.id
  ORDER BY created_at DESC
  FETCH FIRST 1 ROW ONLY
) recent ON TRUE;
```

> Without `LATERAL`, a subquery in `FROM` is evaluated independently and cannot see `u.id`. `LATERAL` enables per-row correlation, similar to a correlated subquery but usable as a table source.

---

### L2 MERGE (upsert)

SQL:2003. `MERGE` combines `INSERT`, `UPDATE`, and `DELETE` in one statement, driven by a match condition.

```sql
MERGE INTO users AS target
USING (VALUES (42, 'Alice', 'alice@example.com')) AS src(id, name, email)
  ON target.id = src.id
WHEN MATCHED THEN
  UPDATE SET name = src.name, email = src.email
WHEN NOT MATCHED THEN
  INSERT (id, name, email) VALUES (src.id, src.name, src.email);
```

> Common use cases: idempotent data loads, upserts from staging tables, synchronizing dimension tables in a data warehouse.

---

## Level 3 — Senior

### L3 Window functions — advanced frames

See [Window Functions guide Ch 6](documentation-sql-window-functions.md). Frame clauses `ROWS`/`RANGE` are SQL:2003; `GROUPS` and `EXCLUDE` are SQL:2011.

```sql
-- ROWS frame — count by physical row positions
SUM(amount) OVER (
  ORDER BY sale_date
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW   -- rolling 7-row sum
)

-- RANGE frame — logical value range (requires ORDER BY on a numeric/date col)
SUM(amount) OVER (
  ORDER BY sale_date
  RANGE BETWEEN INTERVAL '6' DAY PRECEDING AND CURRENT ROW
)

-- GROUPS frame — peer-group aware (SQL:2011)
SUM(amount) OVER (
  ORDER BY week_number
  GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING
)

-- EXCLUDE — remove certain rows from the frame (SQL:2011)
SUM(amount) OVER (
  ORDER BY sale_date
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  EXCLUDE CURRENT ROW
)
```

Frame boundary keywords: `UNBOUNDED PRECEDING` · `n PRECEDING` · `CURRENT ROW` · `n FOLLOWING` · `UNBOUNDED FOLLOWING`

`EXCLUDE` options: `EXCLUDE NO OTHERS` (default) · `EXCLUDE CURRENT ROW` · `EXCLUDE GROUP` · `EXCLUDE TIES`

---

### L3 Window functions — distribution

All are SQL:2003.

| Function | Returns |
|---|---|
| `PERCENT_RANK() OVER (...)` | relative rank as a fraction in `[0, 1]`: `(rank - 1) / (rows - 1)` |
| `CUME_DIST() OVER (...)` | cumulative distribution: fraction of rows with value ≤ current row |
| `FIRST_VALUE(col) OVER (...)` | first value in the window frame |
| `LAST_VALUE(col) OVER (...)` | last value in the window frame — beware the default frame |
| `NTH_VALUE(col, n) OVER (...)` | nth value in the window frame |

```sql
SELECT
  name,
  score,
  PERCENT_RANK() OVER (ORDER BY score) AS pct_rank,
  CUME_DIST()    OVER (ORDER BY score) AS cum_dist,
  FIRST_VALUE(score) OVER (ORDER BY score ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS min_score,
  LAST_VALUE(score)  OVER (ORDER BY score ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS max_score
FROM test_results;
```

> `LAST_VALUE` with the default frame (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`) returns the current row's value, not the last in the partition. Always specify an explicit frame extending to `UNBOUNDED FOLLOWING`.

---

### L3 Ordered-set and hypothetical aggregates

These aggregate functions accept an `ORDER BY` clause inside their own argument — they are called **ordered-set aggregate functions** in the standard (SQL:2003).

| Function | Returns | Example |
|---|---|---|
| `PERCENTILE_CONT(f) WITHIN GROUP (ORDER BY col)` | interpolated percentile — the value that would fall at fraction `f` | `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)` — median |
| `PERCENTILE_DISC(f) WITHIN GROUP (ORDER BY col)` | discrete percentile — the first actual row value at or above fraction `f` | `PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY response_ms)` |

**Hypothetical-set aggregate functions** (SQL:2003) compute what the rank of a hypothetical value *would be* in the aggregated set:

| Function | Returns | Example |
|---|---|---|
| `RANK(val) WITHIN GROUP (ORDER BY col)` | rank a given value would receive | `RANK(50000) WITHIN GROUP (ORDER BY salary)` |
| `DENSE_RANK(val) WITHIN GROUP (ORDER BY col)` | dense rank a value would receive | — |
| `PERCENT_RANK(val) WITHIN GROUP (ORDER BY col)` | percent rank a value would receive | — |
| `CUME_DIST(val) WITHIN GROUP (ORDER BY col)` | cumulative distribution a value would receive | — |

---

### L3 GROUPING SETS, ROLLUP, CUBE

Produce multiple aggregation levels in a single pass — replacing several `UNION ALL` queries. SQL:1999.

```sql
-- GROUPING SETS: explicitly list the combinations you want
SELECT region, category, SUM(sales)
FROM orders
GROUP BY GROUPING SETS (
  (region, category),   -- subtotal by region + category
  (region),             -- subtotal by region only
  (category),           -- subtotal by category only
  ()                    -- grand total
);

-- ROLLUP: hierarchical subtotals, left to right
GROUP BY ROLLUP (year, quarter, month)
-- produces: (year, quarter, month), (year, quarter), (year), ()

-- CUBE: every combination of the listed columns
GROUP BY CUBE (region, category)
-- produces: (region, category), (region), (category), ()

-- GROUPING(col): returns 1 if the column was rolled up (its NULL is synthetic)
SELECT
  CASE WHEN GROUPING(region) = 1 THEN 'ALL REGIONS' ELSE region END AS region_label,
  SUM(sales) AS total
FROM orders
GROUP BY ROLLUP (region);
```

---

### L3 Standard regex functions

SQL:2008 introduced four standard regex functions using POSIX ERE syntax.

| Function | Returns | Example |
|---|---|---|
| `REGEXP_LIKE(s, pat)` | `TRUE` if string matches pattern | `WHERE REGEXP_LIKE(phone, '^[0-9]{10}$')` |
| `REGEXP_LIKE(s, pat, flags)` | with flags: `'i'` = case-insensitive | `REGEXP_LIKE(email, '^admin', 'i')` |
| `REGEXP_REPLACE(s, pat, repl)` | replace first match | `REGEXP_REPLACE(phone, '[^0-9]', '')` |
| `REGEXP_REPLACE(s, pat, repl, flags)` | `'g'` flag = replace all | `REGEXP_REPLACE(phone, '[^0-9]', '', 'g')` |
| `REGEXP_SUBSTR(s, pat)` | extract first matching substring | `REGEXP_SUBSTR(text, '[A-Z]{2,}')` |
| `REGEXP_SUBSTR(s, pat, start, occurrence)` | nth match from position | — |
| `REGEXP_COUNT(s, pat)` | count of non-overlapping matches | `REGEXP_COUNT(text, '\bword\b')` |

```sql
-- Keep only rows where the code is exactly 3 uppercase letters
WHERE REGEXP_LIKE(code, '^[A-Z]{3}$')

-- Strip all non-digit characters from a phone number
SELECT REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS clean_phone
FROM contacts;
```

> PostgreSQL uses `~` / `~*` for regex matching; MySQL uses `REGEXP` / `RLIKE`. These are vendor extensions. `REGEXP_LIKE`, `REGEXP_REPLACE`, `REGEXP_SUBSTR`, and `REGEXP_COUNT` are the standard SQL:2008 forms.

---

### L3 SIMILAR TO — SQL pattern matching

`SIMILAR TO` is a SQL standard (SQL:1999) pattern language that blends `LIKE` wildcards with regex alternation.

| Metacharacter | Meaning |
|---|---|
| `%` | any sequence of characters (like `LIKE`) |
| `_` | any single character (like `LIKE`) |
| `\|` | alternation (like regex `\|`) |
| `*` | zero or more of the preceding element |
| `+` | one or more of the preceding element |
| `?` | zero or one of the preceding element |
| `{n}` / `{m,n}` | exact / range repetition |
| `(...)` | grouping |
| `[...]` | character class |

```sql
-- Phone number: exactly 10 digits
WHERE phone SIMILAR TO '[0-9]{10}'

-- Country code: 2 or 3 uppercase letters
WHERE country_code SIMILAR TO '[A-Z]{2,3}'

-- Match 'color' or 'colour'
WHERE word SIMILAR TO 'colou?r'
```

> `SIMILAR TO` is slower than `LIKE` for simple patterns. Prefer `LIKE` when `%` and `_` are sufficient. `SIMILAR TO` is not supported in all databases (notably, SQLite does not support it).

---

### L3 Standard JSON functions (SQL:2016)

SQL:2016 standardized JSON support. These are the portable forms — vendor implementations (PostgreSQL operators `->`, `->>`, etc.) are extensions.

| Function | Returns | Example |
|---|---|---|
| `JSON_VALUE(doc, path)` | scalar value at JSONPath | `JSON_VALUE(data, '$.name')` |
| `JSON_VALUE(doc, path RETURNING type)` | typed scalar | `JSON_VALUE(data, '$.age' RETURNING INTEGER)` |
| `JSON_QUERY(doc, path)` | JSON fragment (object or array) | `JSON_QUERY(data, '$.address')` |
| `JSON_EXISTS(doc, path)` | `TRUE` if path matches | `WHERE JSON_EXISTS(data, '$.email')` |
| `JSON_ARRAY(val, ...)` | build a JSON array | `JSON_ARRAY(1, 'hello', NULL)` |
| `JSON_OBJECT(key: val, ...)` | build a JSON object | `JSON_OBJECT('id': id, 'name': name)` |
| `JSON_ARRAYAGG(col)` | aggregate rows into a JSON array | `JSON_ARRAYAGG(name ORDER BY name)` |
| `JSON_OBJECTAGG(key: val)` | aggregate key-value pairs into a JSON object | `JSON_OBJECTAGG(code: name)` |
| `IS JSON` predicate | validate that a string is valid JSON | `WHERE data IS JSON` |
| `IS JSON VALUE` / `IS JSON ARRAY` / `IS JSON OBJECT` | type-specific validation | `WHERE data IS JSON OBJECT` |

```sql
-- Extract a scalar value
SELECT JSON_VALUE(profile, '$.city') AS city
FROM users
WHERE JSON_EXISTS(profile, '$.email');

-- Build a JSON object from columns
SELECT JSON_OBJECT('id': id, 'name': name, 'role': role) AS user_json
FROM users;

-- Aggregate rows into a JSON array
SELECT JSON_ARRAYAGG(
  JSON_OBJECT('id': id, 'name': name)
  ORDER BY name
) AS members
FROM employees
WHERE department_id = 5;
```

> PostgreSQL's `->` / `->>` operators and `jsonb_*` functions are not standard SQL. Use `JSON_VALUE`, `JSON_QUERY`, and `JSON_EXISTS` for portable code. Support across databases: SQL Server 2016+, Oracle 12c+, MySQL 8.0+, PostgreSQL 15+ (partial). SQLite does not support SQL:2016 JSON functions.

---

### L3 Row locking

Used inside transactions to coordinate concurrent writes.

| Clause | Behavior | Standard |
|---|---|---|
| `FOR UPDATE` | exclusive row lock — other transactions block on this row | SQL:1992 |
| `FOR SHARE` / `FOR READ ONLY` | shared lock — allows concurrent reads but not updates | SQL:1992 |
| `NOWAIT` | raise an error immediately if a lock cannot be acquired | SQL:2003 |
| `SKIP LOCKED` | skip rows that are already locked (queue processing) | SQL:2008 |

```sql
-- Lock a row for update; other writers wait
SELECT * FROM orders WHERE id = 42 FOR UPDATE;

-- Fail immediately if the row is already locked
SELECT * FROM orders WHERE id = 42 FOR UPDATE NOWAIT;

-- Process a queue: grab up to 10 unlocked jobs
SELECT * FROM job_queue
WHERE status = 'pending'
ORDER BY created_at
FETCH FIRST 10 ROWS ONLY
FOR UPDATE SKIP LOCKED;
```

---

### L3 SQL/PSM — stored procedures and triggers

SQL/PSM (Persistent Stored Modules, SQL:1996) is the standard for procedural code inside the database. Vendor implementations differ in syntax (`PL/pgSQL` in PostgreSQL, `T-SQL` in SQL Server, `PL/SQL` in Oracle) but the conceptual model is the same.

**Standard stored procedure structure:**

```sql
-- Standard syntax (SQL/PSM)
CREATE PROCEDURE update_user_tier(IN p_user_id INTEGER)
LANGUAGE SQL
BEGIN
  DECLARE v_spend NUMERIC DEFAULT 0;

  SELECT SUM(amount) INTO v_spend
  FROM orders WHERE user_id = p_user_id;

  UPDATE users
  SET tier = CASE
    WHEN v_spend > 10000 THEN 'gold'
    WHEN v_spend > 1000  THEN 'silver'
    ELSE 'bronze'
  END
  WHERE id = p_user_id;
END;

-- Call it
CALL update_user_tier(42);
```

**Standard trigger structure:**

```sql
-- Fire before every update on users
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
REFERENCING NEW ROW AS new_row
FOR EACH ROW
SET new_row.updated_at = CURRENT_TIMESTAMP;
```

| Construct | Purpose |
|---|---|
| `DECLARE var type DEFAULT val` | declare a local variable |
| `SELECT ... INTO var` | read a scalar into a variable |
| `SET var = expr` | assign a variable |
| `IF cond THEN ... ELSEIF ... ELSE ... END IF` | conditional |
| `WHILE cond DO ... END WHILE` | loop |
| `FOR row AS cursor DO ... END FOR` | cursor loop |
| `SIGNAL SQLSTATE '...' SET MESSAGE_TEXT = '...'` | raise an error |
| `CALL proc(args)` | call a stored procedure |

> Standard SQL/PSM is rarely used verbatim. Learn the standard concepts, then apply them in your database's procedural language (PL/pgSQL, T-SQL, PL/SQL). The logic maps directly; only syntax differs.

---

### L3 INFORMATION_SCHEMA

`INFORMATION_SCHEMA` is a set of read-only views defined by the SQL standard (SQL:1992) that expose metadata about every database object. It is supported by all major SQL databases.

| View | What it lists |
|---|---|
| `INFORMATION_SCHEMA.TABLES` | all tables and views in the catalog |
| `INFORMATION_SCHEMA.COLUMNS` | all columns with data types and defaults |
| `INFORMATION_SCHEMA.TABLE_CONSTRAINTS` | PRIMARY KEY, UNIQUE, CHECK, FOREIGN KEY constraints |
| `INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS` | foreign key relationships |
| `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` | which columns belong to a constraint |
| `INFORMATION_SCHEMA.CHECK_CONSTRAINTS` | CHECK constraint expressions |
| `INFORMATION_SCHEMA.VIEWS` | view definitions |
| `INFORMATION_SCHEMA.ROUTINES` | stored procedures and functions |
| `INFORMATION_SCHEMA.TRIGGERS` | trigger definitions |
| `INFORMATION_SCHEMA.SCHEMATA` | available schemas / catalogs |

```sql
-- List all tables in the current schema
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- List columns for a specific table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Find all foreign keys in the schema
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name  AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

---

## Quick reference table

| Operator / function | Level | Category | Standard |
|---|---|---|---|
| `=`, `<>`, `<`, `>`, `<=`, `>=` | Junior | Comparison | SQL:1992 |
| `AND`, `OR`, `NOT` | Junior | Logical | SQL:1992 |
| `IS NULL`, `IS NOT NULL` | Junior | NULL | SQL:1992 |
| `BETWEEN`, `IN`, `NOT IN` | Junior | Range / set | SQL:1992 |
| `LIKE`, `NOT LIKE` | Junior | Pattern | SQL:1992 |
| `COALESCE`, `NULLIF` | Junior | NULL handling | SQL:1992 |
| `UPPER`, `LOWER`, `CHAR_LENGTH`, `TRIM` | Junior | String | SQL:1992 |
| `SUBSTRING`, `POSITION`, `OVERLAY`, `TRANSLATE` | Junior | String | SQL:1992/1999 |
| `CONCAT`, `\|\|` | Junior | String | SQL:2003 / SQL:1992 |
| `REPLACE` | Junior | String | widely supported |
| `ABS`, `MOD`, `ROUND`, `CEILING`, `FLOOR` | Junior | Numeric | SQL:1992/2003 |
| `POWER`, `SQRT`, `EXP`, `LN`, `LOG` | Junior | Numeric | SQL:2003 |
| `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `LOCALTIME` | Junior | Date/time | SQL:1992/1999 |
| `EXTRACT`, `INTERVAL`, `CAST(s AS DATE)` | Junior | Date/time | SQL:1992 |
| `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` | Junior | Aggregate | SQL:1992 |
| `STDDEV_SAMP`, `VAR_SAMP`, `STDDEV_POP`, `VAR_POP` | Junior | Aggregate | SQL:2003 |
| `CASE WHEN` | Junior | Conditional | SQL:1992 |
| `CAST(val AS type)` | Junior | Type | SQL:1992 |
| `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT` | Mid | Set ops | SQL:1992 |
| `EXISTS`, `NOT EXISTS`, `ANY`/`SOME`, `ALL` | Mid | Subquery | SQL:1992 |
| `LPAD`, `RPAD` | Mid | String | SQL:2016 |
| `OCTET_LENGTH`, `BIT_LENGTH` | Mid | String | SQL:1992 |
| `AT TIME ZONE`, `OVERLAPS` | Mid | Date/time | SQL:1999/1992 |
| `FILTER (WHERE ...)` | Mid | Aggregate | SQL:2003 |
| `LISTAGG ... WITHIN GROUP` | Mid | Aggregate | SQL:2016 |
| `ARRAY_AGG`, `EVERY` | Mid | Aggregate | SQL:2003/1999 |
| `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE` | Mid | Window-rank | SQL:2003 |
| `LAG`, `LEAD` | Mid | Window-offset | SQL:2003 |
| Aggregate `OVER (PARTITION BY ... ORDER BY ...)` | Mid | Window-agg | SQL:2003 |
| `WITH`, `WITH RECURSIVE` | Mid | CTE | SQL:1999 |
| `LATERAL` | Mid | Join | SQL:1999 |
| `MERGE` | Mid | DML | SQL:2003 |
| `ROWS/RANGE/GROUPS BETWEEN`, `EXCLUDE` | Senior | Window-frame | SQL:2003/2011 |
| `PERCENT_RANK`, `CUME_DIST`, `FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE` | Senior | Window-dist | SQL:2003 |
| `PERCENTILE_CONT`, `PERCENTILE_DISC` | Senior | Ordered-set agg | SQL:2003 |
| `RANK/DENSE_RANK/PERCENT_RANK/CUME_DIST ... WITHIN GROUP` | Senior | Hypothetical agg | SQL:2003 |
| `ROLLUP`, `CUBE`, `GROUPING SETS`, `GROUPING()` | Senior | Multi-level agg | SQL:1999 |
| `REGEXP_LIKE`, `REGEXP_REPLACE`, `REGEXP_SUBSTR`, `REGEXP_COUNT` | Senior | Regex | SQL:2008 |
| `SIMILAR TO` | Senior | Pattern | SQL:1999 |
| `JSON_VALUE`, `JSON_QUERY`, `JSON_EXISTS` | Senior | JSON | SQL:2016 |
| `JSON_ARRAYAGG`, `JSON_OBJECTAGG`, `IS JSON` | Senior | JSON | SQL:2016 |
| `FOR UPDATE`, `NOWAIT`, `SKIP LOCKED` | Senior | Locking | SQL:1992/2003/2008 |
| SQL/PSM: `DECLARE`, `IF`, `WHILE`, `SIGNAL`, triggers | Senior | Procedural | SQL:1996 |
| `INFORMATION_SCHEMA.*` views | Senior | Metadata | SQL:1992 |
