# Zeerostock — Part B: Inventory Database + APIs

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)
- **API Testing:** Postman / curl / browser

## Features
- `POST /supplier` — Create a supplier with name and city
- `GET  /supplier` — List all suppliers
- `POST /inventory` — Create an inventory item with full validation
- `GET  /inventory` — List all items joined with supplier info
- `GET  /inventory/grouped` — Inventory grouped by supplier, sorted by total value (quantity × price) DESC

## Project Structure
```
part-b/
├── src/
│   ├── db/
│   │   ├── schema.sql          # Table definitions + index
│   │   └── connection.js       # SQLite connection + schema init
│   ├── routes/
│   │   ├── supplierRoutes.js   # /supplier routes
│   │   └── inventoryRoutes.js  # /inventory routes
│   ├── controllers/
│   │   ├── supplierController.js
│   │   └── inventoryController.js
│   └── server.js               # Express app entry point
├── package.json
└── README.md
```

## How to Run Locally

```bash
cd part-b
npm install
npm start
```

Server runs at: **http://localhost:4000**

The SQLite database file (`zeerostock.db`) is created automatically on first run.

---

## API Reference

### POST /supplier
**Body (JSON):**
```json
{ "name": "ABC Traders", "city": "Mumbai" }
```
**Response 201:**
```json
{
  "message": "Supplier created successfully.",
  "supplier": { "id": 1, "name": "ABC Traders", "city": "Mumbai" }
}
```

### GET /supplier
Returns all suppliers.

### POST /inventory
**Body (JSON):**
```json
{
  "supplier_id": 1,
  "product_name": "Office Chair",
  "quantity": 50,
  "price": 120.00
}
```
**Response 201:**
```json
{
  "message": "Inventory item created successfully.",
  "item": { "id": 1, "supplier_id": 1, "product_name": "Office Chair", "quantity": 50, "price": 120 }
}
```

### GET /inventory
Returns all items with supplier name and city, plus computed `total_value`.

### GET /inventory/grouped
Returns inventory grouped by supplier, sorted by `total_inventory_value` (quantity × price) descending.

**Response:**
```json
{
  "description": "Inventory grouped by supplier, sorted by total inventory value (quantity × price)",
  "grouped": [
    { "supplier_name": "ABC Traders", "product_count": 3, "total_quantity": 150, "total_inventory_value": 18000 },
    { "supplier_name": "TechZone",    "product_count": 2, "total_quantity": 80,  "total_inventory_value": 9600  }
  ]
}
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `supplier_id` | Must exist in suppliers table |
| `quantity` | Must be integer ≥ 0 |
| `price` | Must be number > 0 |
| `name` / `city` / `product_name` | Required, non-empty strings |

**Error responses use HTTP status `400`:**
```json
{ "error": true, "message": "quantity must be 0 or more." }
```

---

## Database Schema Explanation

### Why SQLite?
SQLite was chosen because:
1. The supplier → inventory relationship is structured and naturally fits a relational model.
2. Foreign keys enforce referential integrity (no orphaned inventory rows).
3. Zero-configuration — no separate database server needed for local development.
4. `better-sqlite3` provides synchronous APIs, making the code cleaner and easier to reason about.

### Schema Overview
```sql
suppliers (id PK, name, city)
inventory (id PK, supplier_id FK→suppliers.id, product_name, quantity, price)
```
One supplier can have many inventory items (one-to-many).

### Optimization / Indexing Suggestion
An index is already created on `inventory.supplier_id`:
```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```
This makes `JOIN` and `GROUP BY supplier_id` queries significantly faster as the table grows.

**Additional recommendation:** For production scale, add a **composite index** on `(supplier_id, price)` to speed up range queries combining supplier and price filters:
```sql
CREATE INDEX idx_inventory_supplier_price ON inventory(supplier_id, price);
```
For very large datasets, consider migrating to **PostgreSQL** with `EXPLAIN ANALYZE` to monitor query plans, and use **connection pooling** (`pg-pool`) to handle concurrent requests efficiently.
