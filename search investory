Zeerostock Developer Assignment

This project implements both parts of the Zeerostock assignment:

- Part A: Inventory Search API + UI
- Part B: Inventory Database + APIs

The system allows users to search inventory efficiently and manage supplier-based inventory with proper validations and aggregation.

---

🚀 Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite

---

📌 Features

🔹 Part A — Inventory Search

- Search inventory using:
  - Product name (partial + case-insensitive)
  - Category filter
  - Price range filter
- Combine multiple filters
- Pagination support for scalability
- Displays results in table format
- Handles edge cases:
  - Empty search
  - Invalid price range
  - No results found

---

🔹 Part B — Inventory Database

- Supplier and Inventory management
- One-to-many relationship:
  - One supplier → multiple inventory items
- APIs:
  - Create supplier
  - Create inventory
  - Fetch grouped inventory data
- Validations:
  - Supplier must exist
  - Quantity ≥ 0
  - Price > 0

---

📂 Project Structure

zeerostock-project/
│
├── backend/
│   ├── data/
│   │   └── inventory.json
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md

---

⚙️ Setup & Run Locally

Backend

cd backend
npm install
node server.js

Server runs at:

http://localhost:5000

---

Frontend

Open:

frontend/index.html

---

🔍 API Documentation

1. Search API

GET /search

Query Parameters:

Param| Description
q| Product name (partial search)
category| Filter by category
minPrice| Minimum price
maxPrice| Maximum price
page| Page number
limit| Items per page

Example:

/search?q=chair&category=Furniture&minPrice=50&maxPrice=200&page=1&limit=5

---

2. Create Supplier

POST /supplier

Body:

{
  "name": "ABC Traders",
  "city": "Hyderabad"
}

---

3. Create Inventory

POST /inventory

Body:

{
  "supplier_id": 1,
  "product_name": "Office Chair",
  "quantity": 10,
  "price": 120
}

---

4. Get Inventory Summary

GET /inventory

Description:

Returns inventory grouped by supplier and sorted by total inventory value.

---

🧠 Search Logic Explanation

Filtering is applied sequentially:

1. Convert product name and query to lowercase
2. Perform partial match using "includes()"
3. Apply category filter
4. Apply price range filter
5. Apply pagination

---

📊 Database Design

Tables

Suppliers

- id
- name
- city

Inventory

- id
- supplier_id (foreign key)
- product_name
- quantity
- price

---

Relationship

- One supplier can have multiple inventory items
- Implemented using "supplier_id"

---

📈 Required Query

SELECT s.name, SUM(i.quantity * i.price) as total_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id
ORDER BY total_value DESC;

---

⚡ Performance Improvements

1. Pagination

- Prevents loading large datasets at once
- Improves response time

2. Indexing (Future)

- Index on "supplier_id" improves join performance

3. Future Enhancements

- Full-text search
- Debounced frontend search
- Caching

---

🌐 Deployment

- Backend: Render
- Frontend: Vercel

---

🎯 Conclusion

This project demonstrates:

- Efficient search functionality
- Clean API design
- Proper validation handling
- Relational database modeling
- Scalable approach using pagination

---
