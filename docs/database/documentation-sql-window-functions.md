# SQL Window Functions — Comprehensive Guide

This document follows the structure rules in [`.cursor/rules/documentation.mdc`](.cursor/rules/documentation.mdc): numbered chapters and questions, internal links only, highlighted questions, tab-indented sub-questions, and backlinks to the chapter list and table of contents.

Prerequisites: [Junior SQL guide](documentation-sql.md) · [Middle SQL guide](documentation-sql-middle.md) (Ch 3 overview).

---

## Table of Contents

### Themes (chapters)

- [Ch 1 — Window Function Foundations](#ch-1--window-function-foundations)
- [Ch 2 — Ranking Window Functions](#ch-2--ranking-window-functions)
- [Ch 3 — Offset Window Functions (`LAG` / `LEAD`)](#ch-3--offset-window-functions-lag--lead)
- [Ch 4 — Value Window Functions (`FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE`)](#ch-4--value-window-functions-first_value--last_value--nth_value)
- [Ch 5 — Aggregate Functions as Window Functions](#ch-5--aggregate-functions-as-window-functions)
- [Ch 6 — Frame Clauses (`ROWS`, `RANGE`, `GROUPS`, `EXCLUDE`)](#ch-6--frame-clauses-rows-range-groups-exclude)
- [Ch 7 — Practical Patterns and Recipes](#ch-7--practical-patterns-and-recipes)
- [Ch 8 — PostgreSQL Notes, Performance, and Portability](#ch-8--postgresql-notes-performance-and-portability)

### All questions (quick jump)

- [Q1.1](#q11-what-is-a-window-function-and-how-is-it-different-from-group-by) · [Q1.2](#q12-what-is-the-over-clause-and-its-basic-syntax) · [Q1.3](#q13-what-does-partition-by-do) · [Q1.4](#q14-what-does-order-by-inside-over-do) · [Q1.5](#q15-what-is-the-window-clause-for-named-window-definitions) · [Q1.6](#q16-where-can-window-functions-appear-in-a-query-and-where-can-they-not) · [Q1.7](#q17-how-do-nulls-affect-window-function-results)
- [Q2.1](#q21-row_number) · [Q2.2](#q22-rank) · [Q2.3](#q23-dense_rank) · [Q2.4](#q24-percent_rank) · [Q2.5](#q25-cume_dist) · [Q2.6](#q26-ntile)
- [Q3.1](#q31-lag) · [Q3.2](#q32-lead) · [Q3.3](#q33-offset-and-default-arguments-for-lag-and-lead)
- [Q4.1](#q41-first_value) · [Q4.2](#q42-last_value) · [Q4.3](#q43-nth_value) · [Q4.4](#q44-why-last_value-often-surprises-people-default-frame-behavior)
- [Q5.1](#q51-count-over) · [Q5.2](#q52-sum-over) · [Q5.3](#q53-avg-over) · [Q5.4](#q54-min-and-max-over) · [Q5.5](#q55-string_agg-and-array_agg-over-postgresql) · [Q5.6](#q56-json-aggregation-over-postgresql) · [Q5.7](#q57-filter-clause-with-window-aggregates)
- [Q6.1](#q61-what-is-a-window-frame-and-what-are-the-defaults) · [Q6.2](#q62-rows-frame) · [Q6.3](#q63-range-frame) · [Q6.4](#q64-groups-frame) · [Q6.5](#q65-exclude-clause) · [Q6.6](#q66-common-frame-patterns-running-totals-moving-averages)
- [Q7.1](#q71-top-n-per-group) · [Q7.2](#q72-running-totals-and-cumulative-metrics) · [Q7.3](#q73-period-over-period-comparison-with-lag-and-lead) · [Q7.4](#q74-deduplication-and-latest-row-per-key) · [Q7.5](#q75-gaps-and-islands) · [Q7.6](#q76-percentiles-distribution-and-bucketing-with-ranking-functions)
- [Q8.1](#q81-window-functions-vs-distinct-on-postgresql) · [Q8.2](#q82-window-functions-in-subqueries-ctes-and-nested-queries) · [Q8.3](#q83-performance-and-indexing-for-window-queries) · [Q8.4](#q84-portability-across-sql-databases)

---

## Ch 1 — Window Function Foundations

**Questions in this chapter**

- [Q1.1 What is a window function, and how is it different from `GROUP BY`?](#q11-what-is-a-window-function-and-how-is-it-different-from-group-by)
- [Q1.2 What is the `OVER` clause and its basic syntax?](#q12-what-is-the-over-clause-and-its-basic-syntax)
- [Q1.3 What does `PARTITION BY` do?](#q13-what-does-partition-by-do)
- [Q1.4 What does `ORDER BY` inside `OVER` do?](#q14-what-does-order-by-inside-over-do)
- [Q1.5 What is the `WINDOW` clause for named window definitions?](#q15-what-is-the-window-clause-for-named-window-definitions)
- [Q1.6 Where can window functions appear in a query, and where can they not?](#q16-where-can-window-functions-appear-in-a-query-and-where-can-they-not)
- [Q1.7 How do `NULL`s affect window function results?](#q17-how-do-nulls-affect-window-function-results)

---

### Q1.1 What is a window function, and how is it different from `GROUP BY`?

> **Q1.1** (Ch 1) What is a window function, and how is it different from `GROUP BY`?

A **window function** computes a value for **each row** using a defined set of related rows called the **window**. Unlike `GROUP BY`, it does **not collapse** the result set — every input row stays in the output, with the computed value attached as an extra column.

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

	**Q1.1a** Can aggregate functions be used both with `GROUP BY` and as window functions?

	Yes. Functions like `SUM`, `COUNT`, and `AVG` are **aggregate functions**. With `GROUP BY` they produce one row per group; with `OVER (...)` they become **window aggregates** and return a value on every row. Dedicated window-only functions (`ROW_NUMBER`, `LAG`, `FIRST_VALUE`, etc.) require `OVER` and cannot replace `GROUP BY` on their own.

	**Q1.1b** What does "the window" mean in everyday terms?

	The window is the **slice of rows** the function looks at when computing the result for the current row. You define it with `PARTITION BY` (which groups rows), `ORDER BY` (which sequences them), and optionally a **frame** (`ROWS` / `RANGE` / `GROUPS`) that limits which rows in the partition count for this calculation.

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.2 What is the `OVER` clause and its basic syntax?

> **Q1.2** (Ch 1) What is the `OVER` clause and its basic syntax?

The **`OVER`** clause turns a function into a window function. It specifies how rows are grouped, ordered, and framed:

```sql
function(args) OVER (
  [ PARTITION BY partition_expression [, ...] ]
  [ ORDER BY sort_expression [ASC | DESC] [, ...] ]
  [ frame_clause ]
)
```

Examples:

```sql
ROW_NUMBER() OVER (ORDER BY created_at)
SUM(amount) OVER (PARTITION BY customer_id ORDER BY created_at)
LAG(price, 1) OVER (PARTITION BY symbol ORDER BY trade_date)
```

	**Q1.2a** What is the difference between `OVER ()` and `OVER (PARTITION BY … ORDER BY …)`?

	`OVER ()` means **no partition** (the whole result set is one window) and **no order** inside the window. Every row sees the same set of peer rows. Adding `PARTITION BY` splits rows into independent windows; adding `ORDER BY` defines sequence within each partition (required for ranking, offset, and many frame calculations).

	**Q1.2b** Is `OVER` required for every window function?

	Yes. Without `OVER`, `SUM(x)` in a query without `GROUP BY` aggregates the **entire table** to a single scalar (or errors). `ROW_NUMBER()` and `LAG()` **must** have `OVER` — they have no non-window meaning.

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.3 What does `PARTITION BY` do?

> **Q1.3** (Ch 1) What does `PARTITION BY` do?

**`PARTITION BY`** divides rows into **non-overlapping groups** (partitions). The window function is evaluated **separately within each partition**; rows in partition A never affect calculations for partition B.

```sql
SELECT user_id, created_at, total_cents,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS order_seq
FROM orders;
```

Each `user_id` gets its own `1, 2, 3, …` sequence.

	**Q1.3a** How is `PARTITION BY` similar to and different from `GROUP BY`?

	Similar: both group rows by expressions. Different: `GROUP BY` **reduces** row count; `PARTITION BY` **preserves** every row and only scopes the window calculation. You can `PARTITION BY` the same columns you might otherwise `GROUP BY`, but the query shape differs.

	**Q1.3b** Can you partition by multiple expressions or columns?

	Yes: `PARTITION BY user_id, status` creates one partition per distinct `(user_id, status)` pair. Expressions are allowed: `PARTITION BY date_trunc('month', created_at)`.

	**Q1.3c** What happens when `PARTITION BY` is omitted?

	All rows form a **single partition**. The function still runs per row, but every row shares the same window (unless a frame clause further restricts it).

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.4 What does `ORDER BY` inside `OVER` do?

> **Q1.4** (Ch 1) What does `ORDER BY` inside `OVER` do?

**`ORDER BY`** inside `OVER` defines the **sequence of rows** within each partition. It controls ranking (`ROW_NUMBER`), which row is "previous" or "next" (`LAG`/`LEAD`), and the direction of running aggregates. It is **not** the same as the query's final `ORDER BY` — that only sorts the output.

```sql
SUM(amount) OVER (
  PARTITION BY account_id
  ORDER BY posted_at
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_balance
```

	**Q1.4a** Which window functions require `ORDER BY` in `OVER`?

	**Ranking** (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `PERCENT_RANK`, `CUME_DIST`, `NTILE`), **offset** (`LAG`, `LEAD`), and **value** functions (`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`) require `ORDER BY` for meaningful results. **Aggregates** without `ORDER BY` still work — they use the whole partition (or default frame) — but ordered running calculations need `ORDER BY` plus an explicit frame.

	**Q1.4b** How does `NULLS FIRST` / `NULLS LAST` affect window ordering?

	`NULL` sort keys are ordered like any other value: `ORDER BY col NULLS FIRST` puts nulls at the start of the partition sequence; `NULLS LAST` puts them at the end. This changes ranks, `LAG`/`LEAD` neighbors, and frame membership. Default null ordering depends on the database (`NULLS LAST` for `DESC` in PostgreSQL by default).

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.5 What is the `WINDOW` clause for named window definitions?

> **Q1.5** (Ch 1) What is the `WINDOW` clause for named window definitions?

The **`WINDOW`** clause defines a reusable window specification that multiple functions can reference:

```sql
SELECT
  user_id,
  created_at,
  total_cents,
  ROW_NUMBER() OVER w AS rn,
  SUM(total_cents) OVER w AS running_total
FROM orders
WINDOW w AS (PARTITION BY user_id ORDER BY created_at);
```

This avoids repeating `PARTITION BY user_id ORDER BY created_at` and keeps `OVER` clauses consistent.

	**Q1.5a** When is reusing a named window worth the extra syntax?

	When you compute **several** window functions over the **same** partition and order — e.g. `ROW_NUMBER`, `SUM`, and `LAG` all per user ordered by date. For a single function, inline `OVER (...)` is usually clearer.

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.6 Where can window functions appear in a query, and where can they not?

> **Q1.6** (Ch 1) Where can window functions appear in a query, and where can they not?

Window functions are allowed in the **`SELECT`** list and **`ORDER BY`** (PostgreSQL and others). They are **not** allowed in `WHERE`, `GROUP BY`, or `HAVING` because those clauses are evaluated **before** window functions run.

To filter on a window result, wrap the query:

```sql
SELECT * FROM (
  SELECT id, user_id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders
) t
WHERE rn = 1;
```

Or use a CTE with the same pattern.

	**Q1.6a** Why can't you use a window function directly in `WHERE` or `GROUP BY`?

	`WHERE` and `GROUP BY` operate on **input rows** before window values exist. Window functions need the grouped/ filtered row set first, then compute per-row window columns. SQL's logical evaluation order places window functions after `WHERE`, `GROUP BY`, and `HAVING`, but before `ORDER BY`.

	**Q1.6b** What is the logical evaluation order relative to `SELECT`, `WHERE`, `GROUP BY`, `HAVING`, and `ORDER BY`?

	1. `FROM` / `JOIN`
	2. `WHERE`
	3. `GROUP BY`
	4. `HAVING`
	5. Window functions (`SELECT` list and `WINDOW` clause)
	6. `SELECT` projections (non-window)
	7. `DISTINCT`
	8. `ORDER BY`
	9. `LIMIT` / `OFFSET`

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

### Q1.7 How do `NULL`s affect window function results?

> **Q1.7** (Ch 1) How do `NULL`s affect window function results?

Effects vary by function:

- **Aggregates** — `COUNT(column)` ignores nulls; `SUM`/`AVG` skip null inputs; `COUNT(*)` counts all rows.
- **`LAG`/`LEAD`** — return `NULL` if the offset row's expression is null, or if no offset row exists (unless `DEFAULT` is set).
- **Ranking** — nulls in `ORDER BY` follow `NULLS FIRST` / `NULLS LAST` rules.
- **`PARTITION BY`** — `NULL` partition keys group together (all nulls in one partition).

	**Q1.7a** Do ranking functions treat `NULL` order-by values consistently across databases?

	Not always. SQL standard allows implementation-defined null ordering when `NULLS FIRST`/`LAST` is omitted. PostgreSQL defaults: `NULLS FIRST` for `DESC`, `NULLS LAST` for `ASC`. Always specify `NULLS FIRST` or `NULLS LAST` explicitly when null ordering matters for ranks or offsets.

[↑ Ch 1 questions](#ch-1--window-function-foundations) · [↑ Table of Contents](#table-of-contents)

---

## Ch 2 — Ranking Window Functions

**Questions in this chapter**

- [Q2.1 `ROW_NUMBER()`](#q21-row_number)
- [Q2.2 `RANK()`](#q22-rank)
- [Q2.3 `DENSE_RANK()`](#q23-dense_rank)
- [Q2.4 `PERCENT_RANK()`](#q24-percent_rank)
- [Q2.5 `CUME_DIST()`](#q25-cume_dist)
- [Q2.6 `NTILE()`](#q26-ntile)

---

### Q2.1 `ROW_NUMBER()`

> **Q2.1** (Ch 2) `ROW_NUMBER()`

**`ROW_NUMBER()`** assigns a unique integer to each row within its partition, starting at 1, following the `ORDER BY` in `OVER`. It is the standard tool for **deduplication** and **top-N per group**.

```sql
SELECT id, user_id, total_cents,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
FROM orders;
```

	**Q2.1a** How does `ROW_NUMBER()` handle ties?

	Ties receive **different** numbers — no shared rank. Which tied row gets which number is **undefined** unless you add tie-break columns to `ORDER BY` (e.g. `ORDER BY score DESC, id ASC`).

	**Q2.1b** What tie-break columns should you add in `ORDER BY` for stable deduplication?

	Add a **unique** or **deterministic** column: primary key `id`, `created_at`, or `(created_at, id)`. Without this, two runs may assign different row numbers to tied rows.

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q2.2 `RANK()`

> **Q2.2** (Ch 2) `RANK()`

**`RANK()`** assigns a rank within the partition ordered by `ORDER BY`. **Tied rows share the same rank**; the next rank **skips** positions after a tie (competition ranking: 1, 2, 2, 4).

```sql
SELECT player, score,
       RANK() OVER (ORDER BY score DESC) AS rank
FROM game_scores;
```

	**Q2.2a** How does `RANK()` differ from `ROW_NUMBER()` on tied values?

	`ROW_NUMBER()` gives 1, 2, 3 even when scores tie. `RANK()` gives 1, 2, 2, 4 for two players tied for second.

	**Q2.2b** When is `RANK()` the right choice for leaderboards?

	When **ties should be visible** and share placement — sports standings, exam rankings, "top 3" where tied third places both count as third (and fourth is fifth in `RANK`).

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q2.3 `DENSE_RANK()`

> **Q2.3** (Ch 2) `DENSE_RANK()`

**`DENSE_RANK()`** is like `RANK()` for ties, but **does not skip** ranks after a tie (1, 2, 2, 3).

```sql
SELECT player, score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM game_scores;
```

	**Q2.3a** How does `DENSE_RANK()` differ from `RANK()` after a tie?

	After two rows at rank 2, `RANK()` jumps to 4; `DENSE_RANK()` continues with 3.

	**Q2.3b** When should you prefer `DENSE_RANK()` over `RANK()`?

	When you need **consecutive** rank integers — tier labels ("tier 1, tier 2, tier 3"), bucketing by distinct score levels, or reports where "rank 4" should mean "fourth distinct level" not "fourth row position."

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q2.4 `PERCENT_RANK()`

> **Q2.4** (Ch 2) `PERCENT_RANK()`

**`PERCENT_RANK()`** returns the **relative rank** of a row within its partition as a value from **0 to 1** (SQL standard; some clients display as percentage). Tied rows get the same value.

	**Q2.4a** What is the formula for `PERCENT_RANK()` in the SQL standard?

	`(rank - 1) / (total_rows_in_partition - 1)` where `rank` is the same as `RANK()` for that row. If the partition has only one row, the result is 0.

	**Q2.4b** How is `PERCENT_RANK()` related to `RANK()` and partition size?

	It normalizes rank against partition size. Row with `RANK() = 1` in a partition of 100 rows gets `PERCENT_RANK() = 0`; the last rank gets `1`. Middle ranks map proportionally.

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q2.5 `CUME_DIST()`

> **Q2.5** (Ch 2) `CUME_DIST()`

**`CUME_DIST()`** (cumulative distribution) returns the **fraction of rows in the partition whose sort value is less than or equal to** the current row's value — again 0 to 1, with ties sharing the same value.

	**Q2.5a** What does `CUME_DIST()` measure compared to `PERCENT_RANK()`?

	`PERCENT_RANK()` is based on **rank position** (ordinal). `CUME_DIST()` is based on **how many rows are at or below** the current value (cumulative proportion). For ties at the top, `CUME_DIST()` can be greater than `PERCENT_RANK()` for the same row.

	**Q2.5b** How are ties handled in `CUME_DIST()`?

	All tied rows receive the **same** `CUME_DIST()` — the cumulative proportion through the **end** of the tie group.

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q2.6 `NTILE()`

> **Q2.6** (Ch 2) `NTILE()`

**`NTILE(n)`** splits the ordered partition into **`n` buckets** (groups) numbered **1 through n**. Rows are distributed as evenly as possible; when the count does not divide evenly, earlier buckets may get one extra row.

```sql
SELECT customer_id, revenue,
       NTILE(4) OVER (ORDER BY revenue DESC) AS revenue_quartile
FROM customer_totals;
```

	**Q2.6a** How does `NTILE(n)` distribute rows when the partition size is not divisible by `n`?

	PostgreSQL and standard SQL assign extras to **lower-numbered** buckets. Example: 10 rows, `NTILE(3)` → buckets of sizes 4, 3, 3 (bucket 1 gets the remainder).

	**Q2.6b** What are practical uses for `NTILE()` (quartiles, A/B buckets, stratified sampling)?

	Quartile/decile reports, splitting users into N test cohorts, stratified sampling ("take bucket 1 for control"), and capacity planning tiers without hand-writing case expressions.

[↑ Ch 2 questions](#ch-2--ranking-window-functions) · [↑ Table of Contents](#table-of-contents)

---

## Ch 3 — Offset Window Functions (`LAG` / `LEAD`)

**Questions in this chapter**

- [Q3.1 `LAG()`](#q31-lag)
- [Q3.2 `LEAD()`](#q32-lead)
- [Q3.3 `OFFSET` and `DEFAULT` arguments for `LAG` and `LEAD`](#q33-offset-and-default-arguments-for-lag-and-lead)

---

### Q3.1 `LAG()`

> **Q3.1** (Ch 3) `LAG()`

**`LAG(value [, offset [, default]])`** returns the value of **`value`** from a row **offset rows before** the current row within the partition (default offset **1**).

```sql
SELECT trade_date, close_price,
       LAG(close_price) OVER (ORDER BY trade_date) AS prev_close
FROM daily_prices
WHERE symbol = 'AAPL';
```

	**Q3.1a** What row does `LAG(expr)` read relative to the current row?

	The **immediately preceding** row in partition order (offset 1). With offset 2, the row two positions back.

	**Q3.1b** Why is `ORDER BY` inside `OVER` critical for `LAG()`?

	Without `ORDER BY`, row order is undefined — "previous" has no meaning. Always define the sequence (usually time or sequence id) that defines "before."

[↑ Ch 3 questions](#ch-3--offset-window-functions-lag--lead) · [↑ Table of Contents](#table-of-contents)

---

### Q3.2 `LEAD()`

> **Q3.2** (Ch 3) `LEAD()`

**`LEAD(value [, offset [, default]])`** returns the value from a row **offset rows after** the current row (default offset **1**). Mirror of `LAG` for forward-looking comparisons.

```sql
SELECT session_id, event_at,
       LEAD(event_at) OVER (PARTITION BY session_id ORDER BY event_at) AS next_event_at
FROM events;
```

	**Q3.2a** What row does `LEAD(expr)` read relative to the current row?

	The **next** row in partition order (offset 1), or further ahead with a larger offset.

	**Q3.2b** Common use cases: next event time, forward-looking comparisons, session boundaries.

	Compute **time to next event** (`LEAD(event_at) - event_at`), detect **session end** (`LEAD(session_id) IS DISTINCT FROM session_id`), compare to **next period's** metric, or find **gaps** where the next row is too far in time.

[↑ Ch 3 questions](#ch-3--offset-window-functions-lag--lead) · [↑ Table of Contents](#table-of-contents)

---

### Q3.3 `OFFSET` and `DEFAULT` arguments for `LAG` and `LEAD`

> **Q3.3** (Ch 3) `OFFSET` and `DEFAULT` arguments for `LAG` and `LEAD`

	**Q3.3a** Syntax: `LAG(value, offset, default)` and `LEAD(value, offset, default)`

	- **`value`** — expression to return (column or calculation).
	- **`offset`** — integer distance (default 1).
	- **`default`** — returned when no row exists at that offset (optional).

	```sql
LAG(revenue, 12, 0) OVER (ORDER BY month_date)  -- year-over-year, 0 if no row 12 months back
LEAD(status, 1, 'none') OVER (ORDER BY step_no)
	```

	**Q3.3b** What is returned when there is no preceding or following row and no `DEFAULT` is supplied?

	**`NULL`**. First row has no `LAG`; last row has no `LEAD` unless you provide a default.

[↑ Ch 3 questions](#ch-3--offset-window-functions-lag--lead) · [↑ Table of Contents](#table-of-contents)

---

## Ch 4 — Value Window Functions (`FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE`)

**Questions in this chapter**

- [Q4.1 `FIRST_VALUE()`](#q41-first_value)
- [Q4.2 `LAST_VALUE()`](#q42-last_value)
- [Q4.3 `NTH_VALUE()`](#q43-nth_value)
- [Q4.4 Why `LAST_VALUE()` often surprises people (default frame behavior)](#q44-why-last_value-often-surprises-people-default-frame-behavior)

---

### Q4.1 `FIRST_VALUE()`

> **Q4.1** (Ch 4) `FIRST_VALUE()`

**`FIRST_VALUE(expr)`** returns **`expr`** from the **first row** of the **current frame** (not always the first row of the partition — see frame defaults).

```sql
SELECT user_id, created_at, total_cents,
       FIRST_VALUE(total_cents) OVER (
         PARTITION BY user_id ORDER BY created_at
       ) AS first_order_amount
FROM orders;
```

	**Q4.1a** What value does `FIRST_VALUE(expr)` return within the current frame?

	The `expr` value from the row at the **start** of the frame. With default frame `RANGE UNBOUNDED PRECEDING` to `CURRENT ROW`, that is the first row of the partition (for value functions with `ORDER BY`).

	**Q4.1b** How is `FIRST_VALUE()` different from `MIN()` as a window aggregate?

	`MIN(expr)` over the partition returns the **minimum** value, which may come from any row — not necessarily the first row in sort order. `FIRST_VALUE(expr)` returns the value on the **first row in order**, even if it is not the minimum.

[↑ Ch 4 questions](#ch-4--value-window-functions-first_value--last_value--nth_value) · [↑ Table of Contents](#table-of-contents)

---

### Q4.2 `LAST_VALUE()`

> **Q4.2** (Ch 4) `LAST_VALUE()`

**`LAST_VALUE(expr)`** returns **`expr`** from the **last row of the current frame**.

```sql
SELECT user_id, created_at, status,
       LAST_VALUE(status) OVER (
         PARTITION BY user_id ORDER BY created_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS final_status
FROM status_history;
```

	**Q4.2a** What value does `LAST_VALUE(expr)` return within the current frame?

	The `expr` from the row at the **end** of the frame — with a full partition frame, that is the true last row in order.

	**Q4.2b** Why might `LAST_VALUE()` not return the last row of the partition by default?

	Default frame for `ORDER BY` is often `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — the frame **ends at the current row**, so `LAST_VALUE` returns the **current row's** value, not the partition's last row. See Q4.4.

[↑ Ch 4 questions](#ch-4--value-window-functions-first_value--last_value--nth_value) · [↑ Table of Contents](#table-of-contents)

---

### Q4.3 `NTH_VALUE()`

> **Q4.3** (Ch 4) `NTH_VALUE()`

**`NTH_VALUE(expr, n)`** returns **`expr`** from the **nth row** of the frame ( **`n` starts at 1** ).

```sql
SELECT team_id, player_name, points,
       NTH_VALUE(player_name, 2) OVER (
         PARTITION BY team_id ORDER BY points DESC
       ) AS second_best_player
FROM game_stats;
```

	**Q4.3a** Syntax: `NTH_VALUE(expr, n)` — what does `n` mean?

	**1** = first row in frame, **2** = second, etc. — by sort order within the partition/frame.

	**Q4.3b** How does `NTH_VALUE()` behave when `n` is out of range?

	Returns **NULL** if the frame has fewer than `n` rows.

[↑ Ch 4 questions](#ch-4--value-window-functions-first_value--last_value--nth_value) · [↑ Table of Contents](#table-of-contents)

---

### Q4.4 Why `LAST_VALUE()` often surprises people (default frame behavior)

> **Q4.4** (Ch 4) Why `LAST_VALUE()` often surprises people (default frame behavior)

The **default frame** differs by function category:

| Category | Default frame (with `ORDER BY`) |
|----------|--------------------------------|
| Aggregate window (`SUM`, `COUNT`, …) | `RANGE UNBOUNDED PRECEDING` to `CURRENT ROW` |
| Ranking, offset, value (`LAST_VALUE`, …) | `RANGE UNBOUNDED PRECEDING` to `CURRENT ROW` |

For **`LAST_VALUE`**, that means each row's frame ends at **itself** — so `LAST_VALUE(col)` usually equals **`col` on the current row**, not the partition's last value.

	**Q4.4a** What is the default frame for value functions vs aggregate window functions?

	Both use the same default when `ORDER BY` is present: from start of partition through **current row** (`RANGE` mode, peers included).

	**Q4.4b** What frame clause makes `LAST_VALUE()` return the true last row of a partition?

	```sql
LAST_VALUE(expr) OVER (
  PARTITION BY ... ORDER BY ...
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
	```

	Or compute once in a subquery/CTE where you only need the final value per partition.

[↑ Ch 4 questions](#ch-4--value-window-functions-first_value--last_value--nth_value) · [↑ Table of Contents](#table-of-contents)

---

## Ch 5 — Aggregate Functions as Window Functions

**Questions in this chapter**

- [Q5.1 `COUNT()` OVER](#q51-count-over)
- [Q5.2 `SUM()` OVER](#q52-sum-over)
- [Q5.3 `AVG()` OVER](#q53-avg-over)
- [Q5.4 `MIN()` and `MAX()` OVER](#q54-min-and-max-over)
- [Q5.5 `STRING_AGG()` and `ARRAY_AGG()` OVER (PostgreSQL)](#q55-string_agg-and-array_agg-over-postgresql)
- [Q5.6 JSON aggregation OVER (PostgreSQL)](#q56-json-aggregation-over-postgresql)
- [Q5.7 `FILTER` clause with window aggregates](#q57-filter-clause-with-window-aggregates)

---

### Q5.1 `COUNT()` OVER

> **Q5.1** (Ch 5) `COUNT()` OVER

**`COUNT(...) OVER (...)`** counts rows in the window frame and attaches the count to each row.

```sql
SELECT user_id, id,
       COUNT(*) OVER (PARTITION BY user_id) AS orders_per_user
FROM orders;
```

	**Q5.1a** `COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT column)` in a window context

	- **`COUNT(*)`** — all rows in the frame.
	- **`COUNT(column)`** — rows where `column` is not null.
	- **`COUNT(DISTINCT column)`** — distinct non-null values in the frame (PostgreSQL supports distinct window counts).

	**Q5.1b** Partition-level row counts vs running counts within a frame

	`COUNT(*) OVER (PARTITION BY user_id)` — total orders per user on every row. Running count: `COUNT(*) OVER (PARTITION BY user_id ORDER BY created_at ROWS UNBOUNDED PRECEDING)` — grows as you move through each user's timeline.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.2 `SUM()` OVER

> **Q5.2** (Ch 5) `SUM()` OVER

**`SUM(expr) OVER (...)`** sums `expr` over the frame. Classic use: **partition totals** and **running (cumulative) sums**.

```sql
SELECT posted_at, amount,
       SUM(amount) OVER (ORDER BY posted_at) AS running_total,
       SUM(amount) OVER () AS grand_total
FROM ledger_entries;
```

	**Q5.2a** Partition total vs running (cumulative) `SUM`

	Partition total: `SUM(x) OVER (PARTITION BY g)` — same total on every row in group `g`. Running sum: add `ORDER BY` and frame `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.

	**Q5.2b** How frame clauses change what `SUM()` includes

	A **3-row moving sum**: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`. **Full partition**: `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` or omit `ORDER BY` for whole-partition sum.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.3 `AVG()` OVER

> **Q5.3** (Ch 5) `AVG()` OVER

**`AVG(expr) OVER (...)`** averages non-null `expr` values in the frame — partition average, moving average, etc.

```sql
SELECT trade_date, close_price,
       AVG(close_price) OVER (
         ORDER BY trade_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS ma_7
FROM prices;
```

	**Q5.3a** Moving average with an explicit `ROWS` frame

	`ROWS BETWEEN n PRECEDING AND CURRENT ROW` gives an **n+1** point moving average (including current row). Centered: `ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING`.

	**Q5.3b** How `NULL` inputs affect `AVG()` in windows

	Null values are **excluded** from the average (same as non-window `AVG`). `AVG` over a frame of rows where all values are null returns null.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.4 `MIN()` and `MAX()` OVER

> **Q5.4** (Ch 5) `MIN()` and `MAX()` OVER

**`MIN(expr)`** / **`MAX(expr)` OVER (...)`** return the minimum or maximum in the frame.

```sql
SELECT user_id, created_at, total_cents,
       MAX(total_cents) OVER (PARTITION BY user_id) AS user_max_order
FROM orders;
```

	**Q5.4a** Running min/max vs partition-wide min/max

	Partition-wide: `MAX(x) OVER (PARTITION BY g)` — constant per group. Running max: `MAX(x) OVER (ORDER BY t ROWS UNBOUNDED PRECEDING)` — highest value seen so far in order.

	**Q5.4b** When to use `MIN`/`MAX` OVER vs `FIRST_VALUE`/`LAST_VALUE`

	Use **MIN/MAX** when you care about the **extreme value** regardless of which row held it. Use **FIRST_VALUE/LAST_VALUE** when you need the value **on the first/last row in sort order**, which may not be the min/max.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.5 `STRING_AGG()` and `ARRAY_AGG()` OVER (PostgreSQL)

> **Q5.5** (Ch 5) `STRING_AGG()` and `ARRAY_AGG()` OVER (PostgreSQL)

PostgreSQL allows **ordered aggregates** as window functions:

```sql
SELECT user_id, tag,
       STRING_AGG(tag, ', ' ORDER BY tag) OVER (
         PARTITION BY user_id
         ORDER BY created_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS tags_so_far
FROM order_tags;
```

	**Q5.5a** Ordered aggregation inside `OVER` with `ORDER BY` in the aggregate call

	The `ORDER BY` **inside** `STRING_AGG(... ORDER BY ...)` controls concatenation order within each aggregation step; the `ORDER BY` in `OVER` controls window row sequence and frame.

	**Q5.5b** Building running lists or concatenated history per partition

	Use a growing frame (`ROWS UNBOUNDED PRECEDING`) to build cumulative string or array history. Watch payload size — long running `STRING_AGG` can become expensive and huge.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.6 JSON aggregation OVER (PostgreSQL)

> **Q5.6** (Ch 5) JSON aggregation OVER (PostgreSQL)

PostgreSQL supports **`JSON_AGG`**, **`JSONB_AGG`**, **`JSON_OBJECT_AGG`**, and **`JSONB_OBJECT_AGG`** with `OVER`, same as other aggregates:

```sql
SELECT line_id, item_name,
       JSONB_AGG(to_jsonb(item_name) ORDER BY line_no) OVER (
         PARTITION BY order_id ORDER BY line_no
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS items_json
FROM order_lines;
```

	**Q5.6a** `JSON_AGG()`, `JSONB_AGG()`, `JSON_OBJECT_AGG()`, `JSONB_OBJECT_AGG()` as window functions

	All work as window aggregates when combined with `OVER`. Use `JSONB` for indexing and operators; `JSON_OBJECT_AGG` builds key-value objects per aggregation step.

	**Q5.6b** Practical limits and alternatives for large aggregated payloads

	Running JSON arrays grow **quadratically** in work and memory. For large histories, prefer storing rows and aggregating in a final `GROUP BY`, or limit frame size. Consider `jsonb_set` / append in application code for very long streams.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

### Q5.7 `FILTER` clause with window aggregates

> **Q5.7** (Ch 5) `FILTER` clause with window aggregates

**`FILTER (WHERE condition)`** restricts which rows contribute to an aggregate — works with window aggregates too:

```sql
SELECT user_id, status, total_cents,
       SUM(total_cents) FILTER (WHERE status = 'paid')
         OVER (PARTITION BY user_id) AS paid_total
FROM orders;
```

	**Q5.7a** Syntax: `SUM(amount) FILTER (WHERE status = 'paid') OVER (…)`

	`FILTER` applies **before** aggregation within each frame; `OVER` defines partition and frame. Order: filter rows in frame → aggregate → attach to current row.

	**Q5.7b** Comparison with conditional `CASE` inside the aggregate

	`SUM(CASE WHEN status = 'paid' THEN amount END)` is equivalent. `FILTER` is often clearer for simple conditions. `CASE` is more flexible for multiple different conditions in one expression.

[↑ Ch 5 questions](#ch-5--aggregate-functions-as-window-functions) · [↑ Table of Contents](#table-of-contents)

---

## Ch 6 — Frame Clauses (`ROWS`, `RANGE`, `GROUPS`, `EXCLUDE`)

**Questions in this chapter**

- [Q6.1 What is a window frame, and what are the defaults?](#q61-what-is-a-window-frame-and-what-are-the-defaults)
- [Q6.2 `ROWS` frame](#q62-rows-frame)
- [Q6.3 `RANGE` frame](#q63-range-frame)
- [Q6.4 `GROUPS` frame](#q64-groups-frame)
- [Q6.5 `EXCLUDE` clause](#q65-exclude-clause)
- [Q6.6 Common frame patterns (running totals, moving averages)](#q66-common-frame-patterns-running-totals-moving-averages)

---

### Q6.1 What is a window frame, and what are the defaults?

> **Q6.1** (Ch 6) What is a window frame, and what are the defaults?

A **frame** is the subset of rows in the partition that participate in the calculation for the **current row**. Syntax:

```sql
{ ROWS | RANGE | GROUPS } BETWEEN frame_start AND frame_end [ EXCLUDE ... ]
```

Frame bounds: **`UNBOUNDED PRECEDING`**, **`n PRECEDING`**, **`CURRENT ROW`**, **`n FOLLOWING`**, **`UNBOUNDED FOLLOWING`**.

	**Q6.1a** Frame bounds: `UNBOUNDED PRECEDING`, `n PRECEDING`, `CURRENT ROW`, `n FOLLOWING`, `UNBOUNDED FOLLOWING`

	Define the **start** and **end** of the window relative to the current row (or peer group in `RANGE`/`GROUPS`). `BETWEEN frame_start AND frame_end` must be valid (start cannot follow end).

	**Q6.1b** Default frames for ranking, offset, value, and aggregate window functions

	- **No `ORDER BY` in `OVER`**: entire partition is the frame.
	- **With `ORDER BY`**: default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` (ranking/offset/value and aggregates). Ranking functions effectively use the whole partition up to current row for peer handling.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

### Q6.2 `ROWS` frame

> **Q6.2** (Ch 6) `ROWS` frame

**`ROWS`** counts **physical row offsets** — exact positions in the ordered partition, regardless of duplicate sort keys.

```sql
AVG(amount) OVER (
  ORDER BY posted_at
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)
```

	**Q6.2a** Physical row offsets: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`

	Includes the current row plus the two immediately preceding rows in sort order — always **3 rows** (or fewer at the start of the partition).

	**Q6.2b** When `ROWS` is the right choice

	Moving averages by **row count**, cumulative sums, "last 5 events" — whenever you mean **number of rows**, not "same timestamp" peers.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

### Q6.3 `RANGE` frame

> **Q6.3** (Ch 6) `RANGE` frame

**`RANGE`** uses **logical offsets** based on the `ORDER BY` type. Rows with the **same sort key** (peers) are treated as a group at the same position.

```sql
SUM(amount) OVER (
  ORDER BY posted_at
  RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
)
```

	**Q6.3a** Logical peers: rows with the same `ORDER BY` value in the partition

	With `RANGE`, all rows sharing the current sort key are **peers** — frame endpoints often include the full peer group at the boundary.

	**Q6.3b** `RANGE` with numeric offsets vs datetime offsets

	For numeric order keys, `RANGE 1 PRECEDING` means sort value ≥ current − 1. For timestamps, use interval offsets (`INTERVAL '1 day' PRECEDING`). `RANGE` requires a single `ORDER BY` column in PostgreSQL for offset frames.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

### Q6.4 `GROUPS` frame

> **Q6.4** (Ch 6) `GROUPS` frame

**`GROUPS`** (SQL:2011, PostgreSQL 11+) frames by **peer groups** — consecutive rows with equal `ORDER BY` values count as one group; offsets count **groups**, not rows.

```sql
SUM(score) OVER (
  ORDER BY match_date
  GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW
)
```

	**Q6.4a** What is a "peer group" in the `GROUPS` sense?

	All rows with the **same** `ORDER BY` value form one group. `1 PRECEDING` means one peer group before the current group's position.

	**Q6.4b** When `GROUPS` solves problems that `ROWS` and `RANGE` handle awkwardly

	Aggregating over **distinct sort levels** (e.g. sum scores per match date group, including tied dates as one unit), or moving windows that should step by **event** rather than by row when duplicates exist.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

### Q6.5 `EXCLUDE` clause

> **Q6.5** (Ch 6) `EXCLUDE` clause

**`EXCLUDE`** (PostgreSQL 11+, SQL:2016) removes rows from the frame after bounds are computed:

- **`EXCLUDE CURRENT ROW`** — omit the current row
- **`EXCLUDE GROUP`** — omit all peers of the current row
- **`EXCLUDE TIES`** — omit peers but keep current row
- **`EXCLUDE NO OTHERS`** — default; include all rows in frame

```sql
AVG(score) OVER (
  ORDER BY score
  ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
  EXCLUDE CURRENT ROW
) AS centered_avg_without_self
```

	**Q6.5a** `EXCLUDE CURRENT ROW`, `EXCLUDE GROUP`, `EXCLUDE TIES`, `EXCLUDE NO OTHERS`

	See above — controls peer and self inclusion for centered averages, rankings excluding self, etc.

	**Q6.5b** Use cases: rankings that skip self, centered windows

	Centered moving average without the current point; comparing a row to its neighbors only; analytics where self should not bias the window statistic.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

### Q6.6 Common frame patterns (running totals, moving averages)

> **Q6.6** (Ch 6) Common frame patterns (running totals, moving averages)

	**Q6.6a** Cumulative sum: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`

	```sql
SUM(amount) OVER (ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
	```

	**Q6.6b** Centered moving average: `ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING`

	```sql
AVG(value) OVER (ORDER BY ts ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING)
	```

	**Q6.6c** Sliding window with `RANGE` for time-series data

	```sql
SUM(volume) OVER (
  ORDER BY ts
  RANGE BETWEEN INTERVAL '30 minutes' PRECEDING AND CURRENT ROW
)
	```

	Useful when events share timestamps or you want a **time-based** window rather than a row-count window.

[↑ Ch 6 questions](#ch-6--frame-clauses-rows-range-groups-exclude) · [↑ Table of Contents](#table-of-contents)

---

## Ch 7 — Practical Patterns and Recipes

**Questions in this chapter**

- [Q7.1 Top-N per group](#q71-top-n-per-group)
- [Q7.2 Running totals and cumulative metrics](#q72-running-totals-and-cumulative-metrics)
- [Q7.3 Period-over-period comparison with `LAG` and `LEAD`](#q73-period-over-period-comparison-with-lag-and-lead)
- [Q7.4 Deduplication and "latest row per key"](#q74-deduplication-and-latest-row-per-key)
- [Q7.5 Gaps and islands](#q75-gaps-and-islands)
- [Q7.6 Percentiles, distribution, and bucketing with ranking functions](#q76-percentiles-distribution-and-bucketing-with-ranking-functions)

---

### Q7.1 Top-N per group

> **Q7.1** (Ch 7) Top-N per group

Classic pattern: rank within partition, filter in outer query.

```sql
SELECT * FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS rn
  FROM products
) t
WHERE rn <= 3;
```

For **ties at the N boundary**, use `RANK()` or `DENSE_RANK()` instead of `ROW_NUMBER()` — e.g. `WHERE RANK() OVER (...) <= 3` includes all rows tied for third place.

	**Q7.1a** `ROW_NUMBER()` + filter in outer query vs `RANK()` for ties

	`ROW_NUMBER` gives exactly N rows per group (arbitrary among ties). `RANK` may return more than N rows when ties cross the cutoff.

	**Q7.1b** Comparison with `DISTINCT ON` and lateral subqueries (PostgreSQL)

	`DISTINCT ON (category) ... ORDER BY category, sales DESC` — simpler for **top 1** per group in PostgreSQL. `LATERAL` subquery with `ORDER BY ... LIMIT N` is clear and often fast. Window functions are more portable and handle top-N with ties flexibly.

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

### Q7.2 Running totals and cumulative metrics

> **Q7.2** (Ch 7) Running totals and cumulative metrics

	**Q7.2a** Running `SUM` ordered by time

	```sql
SELECT day, revenue,
       SUM(revenue) OVER (ORDER BY day) AS cumulative_revenue
FROM daily_sales;
	```

	Explicit frame (recommended): `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.

	**Q7.2b** Running share of partition: `SUM(x) / SUM(x) OVER (PARTITION BY …)`

	```sql
SELECT user_id, total_cents,
       total_cents / SUM(total_cents) OVER (PARTITION BY user_id) AS pct_of_user_spend
FROM orders;
	```

	Each row's share of the partition total; running share uses cumulative sum divided by partition total.

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

### Q7.3 Period-over-period comparison with `LAG` and `LEAD`

> **Q7.3** (Ch 7) Period-over-period comparison with `LAG` and `LEAD`

	**Q7.3a** Absolute and percentage change from previous row

	```sql
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       (revenue - LAG(revenue) OVER (ORDER BY month))
         / LAG(revenue) OVER (ORDER BY month) AS pct_change
FROM monthly_revenue;
	```

	Guard division with `NULLIF` or `CASE` when previous revenue is zero or null.

	**Q7.3b** Comparing rows N periods apart with offset argument

	```sql
LAG(revenue, 12) OVER (ORDER BY month) AS revenue_12_months_ago
	```

	Year-over-year: offset 12 on monthly data; offset 7 for weekly comparisons, etc.

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

### Q7.4 Deduplication and "latest row per key"

> **Q7.4** (Ch 7) Deduplication and "latest row per key"

```sql
SELECT * FROM (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY user_id
           ORDER BY updated_at DESC, id DESC
         ) AS rn
  FROM profiles
) t
WHERE rn = 1;
```

	**Q7.4a** `ROW_NUMBER() = 1` pattern with tie-break columns

	`ORDER BY updated_at DESC, id DESC` ensures deterministic pick when timestamps tie.

	**Q7.4b** Keeping one arbitrary row per duplicate key vs the "best" row

	For **any** one row per key, `ROW_NUMBER()` without meaningful `ORDER BY` works but is nondeterministic. For **best** row (latest, highest score), `ORDER BY` encodes the rule. Wrong `ORDER BY` silently keeps the wrong row.

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

### Q7.5 Gaps and islands

> **Q7.5** (Ch 7) Gaps and islands

**Islands** — contiguous runs of related rows. **Gaps** — missing values in a sequence.

	**Q7.5a** Detecting contiguous sequences with `ROW_NUMBER()` and grouping tricks

	```sql
SELECT grp, MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days
FROM (
  SELECT day,
         day - (ROW_NUMBER() OVER (ORDER BY day))::int AS grp
  FROM daily_logins
) s
GROUP BY grp;
	```

	When dates are consecutive, `day - row_number` is constant within each island.

	**Q7.5b** Finding missing dates or IDs in ordered series

	Use `LEAD` to find gaps: `LEAD(day) OVER (ORDER BY day) - day > 1`. Or generate a full date series and `LEFT JOIN` to find absent dates (often easier than pure window logic).

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

### Q7.6 Percentiles, distribution, and bucketing with ranking functions

> **Q7.6** (Ch 7) Percentiles, distribution, and bucketing with ranking functions

	**Q7.6a** Using `PERCENT_RANK()` and `CUME_DIST()` for distribution analysis

	`PERCENT_RANK()` — where a value sits on a 0–1 rank scale. `CUME_DIST()` — what fraction of rows are at or below this value. Useful for outlier screens and cohort plots without exporting to analytics tools.

	**Q7.6b** `NTILE()` for quartiles and deciles vs dedicated percentile functions

	`NTILE(4)` buckets into quartiles by **row count**, not exact statistical quartile boundaries. For precise percentiles use `PERCENTILE_CONT` / `PERCENTILE_DISC` as aggregates (`GROUP BY`) or PostgreSQL ordered-set aggregates. Choose based on whether you need **equal-sized buckets** (`NTILE`) or **value-based thresholds** (percentile functions).

[↑ Ch 7 questions](#ch-7--practical-patterns-and-recipes) · [↑ Table of Contents](#table-of-contents)

---

## Ch 8 — PostgreSQL Notes, Performance, and Portability

**Questions in this chapter**

- [Q8.1 Window functions vs `DISTINCT ON` (PostgreSQL)](#q81-window-functions-vs-distinct-on-postgresql)
- [Q8.2 Window functions in subqueries, CTEs, and nested queries](#q82-window-functions-in-subqueries-ctes-and-nested-queries)
- [Q8.3 Performance and indexing for window queries](#q83-performance-and-indexing-for-window-queries)
- [Q8.4 Portability across SQL databases](#q84-portability-across-sql-databases)

---

### Q8.1 Window functions vs `DISTINCT ON` (PostgreSQL)

> **Q8.1** (Ch 8) Window functions vs `DISTINCT ON` (PostgreSQL)

	**Q8.1a** When `DISTINCT ON` is simpler for "pick one row per group"

	```sql
SELECT DISTINCT ON (user_id) *
FROM orders
ORDER BY user_id, created_at DESC;
	```

	Best for **one row per key** in PostgreSQL when you only need the first row per group after sort — compact and often fast.

	**Q8.1b** When window functions are more expressive or portable

	Top-N per group, ties handling, running metrics, and **multiple** window columns in one pass. `DISTINCT ON` is PostgreSQL-specific; window SQL works across major databases.

[↑ Ch 8 questions](#ch-8--postgresql-notes-performance-and-portability) · [↑ Table of Contents](#table-of-contents)

---

### Q8.2 Window functions in subqueries, CTEs, and nested queries

> **Q8.2** (Ch 8) Window functions in subqueries, CTEs, and nested queries

	**Q8.2a** Filtering on window results via subquery or CTE

	```sql
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn <= 5;
	```

	Required because `WHERE` cannot reference window columns from the same query level.

	**Q8.2b** Multiple window functions sharing the same `OVER` clause

	PostgreSQL can optimize identical `OVER` definitions. Use the `WINDOW` clause (Q1.5) for clarity. Different frames or partitions need separate `OVER` clauses.

[↑ Ch 8 questions](#ch-8--postgresql-notes-performance-and-portability) · [↑ Table of Contents](#table-of-contents)

---

### Q8.3 Performance and indexing for window queries

> **Q8.3** (Ch 8) Performance and indexing for window queries

Window execution typically **sorts** (or uses presorted input) per partition. Large partitions increase memory and CPU.

	**Q8.3a** Sort cost and memory for large partitions

	`WindowAgg` in `EXPLAIN` shows window steps. `work_mem` bounds in-memory sort; spills to disk if exceeded. Fewer columns, smaller partitions, or pre-aggregating reduce cost.

	**Q8.3b** Indexes that align with `PARTITION BY` and `ORDER BY`

	Index on `(partition_cols, order_cols)` can enable **ordered scans** and avoid explicit sorts — e.g. `INDEX ON orders (user_id, created_at)`. Filter in `WHERE` first to shrink input. Not every window query benefits; verify with `EXPLAIN (ANALYZE, BUFFERS)`.

[↑ Ch 8 questions](#ch-8--postgresql-notes-performance-and-portability) · [↑ Table of Contents](#table-of-contents)

---

### Q8.4 Portability across SQL databases

> **Q8.4** (Ch 8) Portability across SQL databases

	**Q8.4a** Standard SQL window functions vs vendor gaps (`GROUPS`, `EXCLUDE`, `FILTER`)

	**SQL standard** (widely supported): `OVER`, `PARTITION BY`, ranking (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `PERCENT_RANK`, `CUME_DIST`, `NTILE`), offset (`LAG`, `LEAD`), value functions, aggregate windows, `ROWS`/`RANGE` frames.

	**PostgreSQL extras / newer standard**: `GROUPS`, `EXCLUDE`, aggregate `FILTER`, rich ordered-set aggregates.

	**Q8.4b** Quick reference: PostgreSQL, MySQL, SQL Server, SQLite, Oracle support notes

	| Engine | Notes |
	|--------|-------|
	| **PostgreSQL** | Full support including `GROUPS`, `EXCLUDE`, `FILTER`, `WINDOW` clause |
	| **MySQL 8+** | Window functions supported; check `GROUPS`/`EXCLUDE` version docs |
	| **SQL Server** | Window functions since 2005; `FILTER` not supported — use `CASE` |
	| **SQLite 3.25+** | Window functions supported; simpler frame feature set |
	| **Oracle** | Mature window support; syntax similar; verify `EXCLUDE`/`GROUPS` versions |

	For cross-database apps, stick to core ranking, `LAG`/`LEAD`, aggregate `OVER`, and `ROWS` frames; test edge cases (null ordering, default frames) per engine.

[↑ Ch 8 questions](#ch-8--postgresql-notes-performance-and-portability) · [↑ Table of Contents](#table-of-contents)
