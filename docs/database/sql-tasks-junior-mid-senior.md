# SQL Practice Tasks — Junior / Mid / Senior

30 tasks across three levels, all based on the same e-commerce schema.  
Each section has 10 tasks. Answers with full SQL are collected at the bottom.

---

## Schema used in every task

```sql
-- customers
CREATE TABLE customers (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT UNIQUE,
    city       TEXT,
    created_at DATE DEFAULT CURRENT_DATE
);

-- products
CREATE TABLE products (
    id       SERIAL PRIMARY KEY,
    name     TEXT NOT NULL,
    category TEXT,
    price    NUMERIC(10, 2)
);

-- orders
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    status      TEXT,          -- 'pending' | 'paid' | 'shipped' | 'cancelled'
    created_at  DATE
);

-- order_items
CREATE TABLE order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity   INT,
    unit_price NUMERIC(10, 2)
);

-- employees  (for senior tasks)
CREATE TABLE employees (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    department_id INT,
    salary        NUMERIC(10, 2),
    manager_id    INT REFERENCES employees(id),
    hired_at      DATE
);

-- departments  (for senior tasks)
CREATE TABLE departments (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
```

---

## Table of Contents

- [Level 1 — Junior](#level-1--junior)
- [Level 2 — Mid](#level-2--mid)
- [Level 3 — Senior](#level-3--senior)
- [Answers — Junior](#answers--junior)
- [Answers — Mid](#answers--mid)
- [Answers — Senior](#answers--senior)

---

## Level 1 — Junior

### Task J-1 — Filter and sort

Return the `name` and `city` of all customers from `'Kyiv'`, sorted alphabetically by name.

---

### Task J-2 — LIMIT with ORDER BY

Return the 5 most expensive products (show `name`, `category`, `price`), most expensive first.

---

### Task J-3 — COUNT and GROUP BY

Count how many orders exist per `status`. Show `status` and the count, ordered by count descending.

---

### Task J-4 — SUM + HAVING

Show each `customer_id` whose orders have a combined `unit_price × quantity` total greater than 1000.  
(Use the `order_items` table; include the total in the result.)

---

### Task J-5 — INNER JOIN

List all orders together with the customer's name. Show `orders.id`, `orders.status`, `customers.name`.

---

### Task J-6 — LEFT JOIN and NULL check

Find customers who have **never placed an order**. Return their `id` and `name`.

---

### Task J-7 — NULL handling with COALESCE

Return every product's `name` and `category`. Where `category` is NULL replace it with the string `'Uncategorised'`.

---

### Task J-8 — String functions

Return each customer's `name` in uppercase and their `email` domain (the part after `@`).  
Name the columns `upper_name` and `email_domain`.

---

### Task J-9 — Date / EXTRACT

Return the number of customers who registered (`created_at`) in each calendar year.  
Show `year` and `total_customers`, ordered by year ascending.

---

### Task J-10 — CASE expression

Add a column `price_tier` to the products list:
- `'Budget'` when price < 50
- `'Standard'` when price is between 50 and 199.99
- `'Premium'` when price ≥ 200

Return `name`, `price`, and `price_tier`.

---

## Level 2 — Mid

### Task M-1 — Subquery in WHERE

Find all customers who have placed at least one `'cancelled'` order. Use a subquery (not a join). Return `id` and `name`.

---

### Task M-2 — CTE

Using a CTE, first calculate the total revenue per customer  
(`SUM(quantity * unit_price)` from `order_items` joined with `orders`),  
then return only customers with revenue above the overall average.  
Show `customer_id` and `total_revenue`.

---

### Task M-3 — ROW_NUMBER — top-1 product per category

For each product `category`, return the single most expensive product.  
Use `ROW_NUMBER()`. Show `category`, `name`, and `price`.

---

### Task M-4 — RANK vs DENSE_RANK

List all products with their `RANK()` and `DENSE_RANK()` by price descending.  
Show a row where the two values differ and explain in a comment why.

---

### Task M-5 — LAG — month-over-month orders

Calculate the number of orders placed per month. For each month also show the previous month's count.  
Use `LAG()`. Show `month`, `order_count`, and `prev_month_count`.

---

### Task M-6 — Running total

For each order (ordered by `created_at`), show a running total of `quantity * unit_price` across all order items.  
Show `order_id`, `item total` for that order, and `running_total`.

---

### Task M-7 — EXISTS

Return the names of products that appear in **at least one** order item with `quantity >= 5`.  
Use `EXISTS`.

---

### Task M-8 — EXCEPT

Return customers who placed a `'paid'` order but have **never** placed a `'shipped'` order.  
Use `EXCEPT`. Return `customer_id`.

---

### Task M-9 — Multi-table JOIN

Show each order item's details: `order_id`, customer `name`, product `name`, `quantity`, `unit_price`.  
Join `order_items` → `orders` → `customers` and `order_items` → `products`.

---

### Task M-10 — Self-join

List every employee alongside their manager's name.  
Show `employee_name` and `manager_name`. Employees with no manager should still appear (show NULL for manager name).

---

## Level 3 — Senior

### Task S-1 — Recursive CTE

Using a recursive CTE, build the full management chain for a given employee  
(e.g. `employee_id = 5`): traverse `manager_id` upward until reaching the root.  
Return `level` (0 = the employee themselves), `id`, and `name`.

---

### Task S-2 — ROLLUP

Show total revenue grouped by `category` and `status` using `ROLLUP`.  
The result must include subtotals per category and a grand total row.  
Use `GROUPING()` to label subtotal/grand-total rows clearly.

---

### Task S-3 — Window frame — 3-month moving average

For each month, calculate the 3-month moving average of order counts  
(current month + 2 preceding months).  
Use an explicit `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` frame.

---

### Task S-4 — NTILE and PERCENT_RANK

Divide all products into 4 equal price quartiles using `NTILE(4)`.  
Also compute `PERCENT_RANK()` for each product.  
Show `name`, `price`, `quartile`, and `pct_rank` (rounded to 2 decimal places).

---

### Task S-5 — FIRST_VALUE / LAST_VALUE

For each order, show the cheapest and most expensive item in that order  
(by `unit_price`) using `FIRST_VALUE` and `LAST_VALUE` with correct frame.  
Show `order_id`, `product_id`, `unit_price`, `cheapest_in_order`, `most_expensive_in_order`.

---

### Task S-6 — Gaps and islands

The `orders` table records a daily count of orders. Some days have zero orders (no row at all).  
Find all **consecutive date ranges** (islands) where orders existed.  
Return `island_start`, `island_end`, and the number of days in each island.  
*(Assume a helper `generate_series` or a pre-existing calendar table to produce the date spine.)*

---

### Task S-7 — Pivot with CASE + GROUP BY

Produce a pivot table showing the number of orders per `status` as separate columns,  
grouped by the year of `created_at`.  
Columns: `year`, `pending`, `paid`, `shipped`, `cancelled`.

---

### Task S-8 — LATERAL join

For each customer return their **3 most recent orders** (by `created_at`).  
Use a `LATERAL` subquery. Show `customer_id`, `customer_name`, and the order `id`, `status`, `created_at`.

---

### Task S-9 — JSON aggregation (PostgreSQL)

Aggregate each order's items into a JSON array column.  
Each element should be `{"product_id": ..., "quantity": ..., "unit_price": ...}`.  
Use `JSON_AGG` + `JSON_BUILD_OBJECT`. Return `order_id` and `items` (the JSON array).

---

### Task S-10 — Query optimisation analysis

You run the query below and it is slow on a 10-million-row `order_items` table:

```sql
SELECT c.name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM   order_items oi
JOIN   orders      o  ON o.id          = oi.order_id
JOIN   customers   c  ON c.id          = o.customer_id
WHERE  o.created_at BETWEEN '2025-01-01' AND '2025-12-31'
GROUP  BY c.name
ORDER  BY revenue DESC;
```

Write the `EXPLAIN (ANALYZE, BUFFERS)` call and propose **two concrete index definitions** that would speed it up. Justify each index.

---

## Answers — Junior

### Answer J-1

```sql
SELECT name, city
FROM   customers
WHERE  city = 'Kyiv'
ORDER  BY name;
```

---

### Answer J-2

```sql
SELECT name, category, price
FROM   products
ORDER  BY price DESC
LIMIT  5;
```

---

### Answer J-3

```sql
SELECT status, COUNT(*) AS order_count
FROM   orders
GROUP  BY status
ORDER  BY order_count DESC;
```

---

### Answer J-4

```sql
SELECT   order_id, SUM(quantity * unit_price) AS total
FROM     order_items
GROUP    BY order_id
HAVING   SUM(quantity * unit_price) > 1000;
```

> Note: the task asks for `customer_id` but `order_items` only has `order_id`.  
> To aggregate by customer, join to `orders` first:

```sql
SELECT   o.customer_id, SUM(oi.quantity * oi.unit_price) AS total
FROM     order_items oi
JOIN     orders      o ON o.id = oi.order_id
GROUP    BY o.customer_id
HAVING   SUM(oi.quantity * oi.unit_price) > 1000;
```

---

### Answer J-5

```sql
SELECT o.id, o.status, c.name
FROM   orders    o
JOIN   customers c ON c.id = o.customer_id;
```

---

### Answer J-6

```sql
SELECT c.id, c.name
FROM   customers c
LEFT   JOIN orders o ON o.customer_id = c.id
WHERE  o.id IS NULL;
```

---

### Answer J-7

```sql
SELECT name, COALESCE(category, 'Uncategorised') AS category
FROM   products;
```

---

### Answer J-8

```sql
SELECT UPPER(name)                          AS upper_name,
       SPLIT_PART(email, '@', 2)            AS email_domain
FROM   customers;
```

> `SPLIT_PART` is PostgreSQL syntax. Standard-SQL alternative: `SUBSTRING(email FROM POSITION('@' IN email) + 1)`.

---

### Answer J-9

```sql
SELECT   EXTRACT(YEAR FROM created_at) AS year,
         COUNT(*)                       AS total_customers
FROM     customers
GROUP    BY year
ORDER    BY year;
```

---

### Answer J-10

```sql
SELECT name,
       price,
       CASE
           WHEN price < 50             THEN 'Budget'
           WHEN price BETWEEN 50 AND 199.99 THEN 'Standard'
           ELSE                             'Premium'
       END AS price_tier
FROM   products;
```

---

## Answers — Mid

### Answer M-1

```sql
SELECT id, name
FROM   customers
WHERE  id IN (
    SELECT customer_id
    FROM   orders
    WHERE  status = 'cancelled'
);
```

---

### Answer M-2

```sql
WITH revenue_per_customer AS (
    SELECT   o.customer_id,
             SUM(oi.quantity * oi.unit_price) AS total_revenue
    FROM     order_items oi
    JOIN     orders      o ON o.id = oi.order_id
    GROUP    BY o.customer_id
)
SELECT customer_id, total_revenue
FROM   revenue_per_customer
WHERE  total_revenue > (SELECT AVG(total_revenue) FROM revenue_per_customer);
```

---

### Answer M-3

```sql
WITH ranked AS (
    SELECT category,
           name,
           price,
           ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
    FROM   products
)
SELECT category, name, price
FROM   ranked
WHERE  rn = 1;
```

---

### Answer M-4

```sql
SELECT name,
       price,
       RANK()       OVER (ORDER BY price DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rnk
FROM   products
ORDER  BY price DESC;
```

> When two products share the same price, `RANK()` skips the next number (e.g. 1, 2, 2, **4**), while `DENSE_RANK()` does not (1, 2, 2, **3**).

---

### Answer M-5

```sql
WITH monthly AS (
    SELECT   DATE_TRUNC('month', created_at) AS month,
             COUNT(*)                         AS order_count
    FROM     orders
    GROUP    BY 1
)
SELECT month,
       order_count,
       LAG(order_count) OVER (ORDER BY month) AS prev_month_count
FROM   monthly
ORDER  BY month;
```

---

### Answer M-6

```sql
WITH order_totals AS (
    SELECT order_id,
           SUM(quantity * unit_price) AS order_total
    FROM   order_items
    GROUP  BY order_id
)
SELECT order_id,
       order_total,
       SUM(order_total) OVER (ORDER BY order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM   order_totals
ORDER  BY order_id;
```

---

### Answer M-7

```sql
SELECT name
FROM   products p
WHERE  EXISTS (
    SELECT 1
    FROM   order_items oi
    WHERE  oi.product_id = p.id
      AND  oi.quantity >= 5
);
```

---

### Answer M-8

```sql
SELECT customer_id FROM orders WHERE status = 'paid'
EXCEPT
SELECT customer_id FROM orders WHERE status = 'shipped';
```

---

### Answer M-9

```sql
SELECT oi.order_id,
       c.name  AS customer_name,
       p.name  AS product_name,
       oi.quantity,
       oi.unit_price
FROM   order_items oi
JOIN   orders      o  ON o.id  = oi.order_id
JOIN   customers   c  ON c.id  = o.customer_id
JOIN   products    p  ON p.id  = oi.product_id;
```

---

### Answer M-10

```sql
SELECT e.name  AS employee_name,
       m.name  AS manager_name
FROM   employees e
LEFT   JOIN employees m ON m.id = e.manager_id;
```

---

## Answers — Senior

### Answer S-1

```sql
WITH RECURSIVE chain AS (
    -- anchor: start from the target employee
    SELECT 0 AS level, id, name, manager_id
    FROM   employees
    WHERE  id = 5

    UNION ALL

    -- recursive step: walk up to the manager
    SELECT c.level + 1, e.id, e.name, e.manager_id
    FROM   employees e
    JOIN   chain     c ON c.manager_id = e.id
)
SELECT level, id, name
FROM   chain
ORDER  BY level;
```

---

### Answer S-2

```sql
SELECT COALESCE(p.category, '-- ALL CATEGORIES --') AS category,
       COALESCE(o.status,   '-- ALL STATUSES --')   AS status,
       SUM(oi.quantity * oi.unit_price)              AS revenue,
       GROUPING(p.category)                          AS is_category_subtotal,
       GROUPING(o.status)                            AS is_status_subtotal
FROM   order_items oi
JOIN   orders      o  ON o.id  = oi.order_id
JOIN   products    p  ON p.id  = oi.product_id
GROUP  BY ROLLUP(p.category, o.status)
ORDER  BY p.category NULLS LAST, o.status NULLS LAST;
```

---

### Answer S-3

```sql
WITH monthly AS (
    SELECT   DATE_TRUNC('month', created_at) AS month,
             COUNT(*)                         AS order_count
    FROM     orders
    GROUP    BY 1
)
SELECT month,
       order_count,
       AVG(order_count) OVER (
           ORDER BY month
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS moving_avg_3m
FROM   monthly
ORDER  BY month;
```

---

### Answer S-4

```sql
SELECT name,
       price,
       NTILE(4)       OVER (ORDER BY price) AS quartile,
       ROUND(
           PERCENT_RANK() OVER (ORDER BY price)::NUMERIC,
           2
       )                                    AS pct_rank
FROM   products
ORDER  BY price;
```

---

### Answer S-5

```sql
SELECT order_id,
       product_id,
       unit_price,
       FIRST_VALUE(unit_price) OVER w  AS cheapest_in_order,
       LAST_VALUE(unit_price)  OVER w  AS most_expensive_in_order
FROM   order_items
WINDOW w AS (
    PARTITION BY order_id
    ORDER BY unit_price
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
ORDER  BY order_id, unit_price;
```

> Without `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, `LAST_VALUE` uses the default frame (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`) and returns the current row's value instead of the true last.

---

### Answer S-6

```sql
-- Step 1: build a date spine of all days that have at least one order
WITH dates AS (
    SELECT DISTINCT created_at AS d FROM orders
),
-- Step 2: assign each date to an island by subtracting a sequential row number
-- Dates in the same consecutive run produce the same (d - interval) value
numbered AS (
    SELECT d,
           d - (ROW_NUMBER() OVER (ORDER BY d) * INTERVAL '1 day') AS island_key
    FROM   dates
)
SELECT MIN(d)                                    AS island_start,
       MAX(d)                                    AS island_end,
       (MAX(d) - MIN(d))::INT + 1                AS days_in_island
FROM   numbered
GROUP  BY island_key
ORDER  BY island_start;
```

---

### Answer S-7

```sql
SELECT EXTRACT(YEAR FROM created_at)                        AS year,
       COUNT(*) FILTER (WHERE status = 'pending')           AS pending,
       COUNT(*) FILTER (WHERE status = 'paid')              AS paid,
       COUNT(*) FILTER (WHERE status = 'shipped')           AS shipped,
       COUNT(*) FILTER (WHERE status = 'cancelled')         AS cancelled
FROM   orders
GROUP  BY year
ORDER  BY year;
```

---

### Answer S-8

```sql
SELECT c.id   AS customer_id,
       c.name AS customer_name,
       o.id   AS order_id,
       o.status,
       o.created_at
FROM   customers c
CROSS  JOIN LATERAL (
    SELECT id, status, created_at
    FROM   orders
    WHERE  customer_id = c.id
    ORDER  BY created_at DESC
    LIMIT  3
) o;
```

---

### Answer S-9

```sql
SELECT order_id,
       JSON_AGG(
           JSON_BUILD_OBJECT(
               'product_id', product_id,
               'quantity',   quantity,
               'unit_price', unit_price
           )
           ORDER BY product_id
       ) AS items
FROM   order_items
GROUP  BY order_id
ORDER  BY order_id;
```

---

### Answer S-10

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM   order_items oi
JOIN   orders      o  ON o.id          = oi.order_id
JOIN   customers   c  ON c.id          = o.customer_id
WHERE  o.created_at BETWEEN '2025-01-01' AND '2025-12-31'
GROUP  BY c.name
ORDER  BY revenue DESC;
```

**Proposed indexes:**

```sql
-- Index 1: filter + join on orders
-- Supports the WHERE range scan on created_at and the join to order_items.
CREATE INDEX idx_orders_created_at_customer
    ON orders (created_at, customer_id, id);

-- Index 2: foreign key lookup from order_items to orders
-- Avoids a sequential scan of order_items when joining on order_id.
CREATE INDEX idx_order_items_order_id
    ON order_items (order_id);
```

**Justification:**
- `idx_orders_created_at_customer` — the query filters `o.created_at` in a range; an index on `(created_at, customer_id, id)` lets the planner do an **index range scan** and retrieve `customer_id` and `id` without touching the heap (index-only scan potential). Without it the planner does a full sequential scan of `orders`.
- `idx_order_items_order_id` — `order_items` is the largest table. Without an index on `order_id`, the join uses a hash join that materialises the entire table. With the index the planner can choose a **nested-loop index join** when the filtered order set is small.

---

*[Back to Table of Contents](#table-of-contents)*
