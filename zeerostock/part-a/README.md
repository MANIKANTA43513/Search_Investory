# Zeerostock — Part A: Inventory Search API + UI

## Tech Stack
- **Backend:** Node.js + Express
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Data Source:** Static JSON file (`backend/data/inventory.json`)

## Features
- `GET /search` API with 4 query parameters: `q`, `category`, `minPrice`, `maxPrice`
- Case-insensitive partial product name matching
- Category filter (exact match, case-insensitive)
- Price range filter (min and max)
- All filters can be combined
- Edge case handling: empty query, invalid price range (400 error), no matches
- Responsive, production-grade UI with real-time result rendering

## Project Structure
```
part-a/
├── backend/
│   ├── data/
│   │   └── inventory.json      # 15 sample inventory records
│   ├── server.js               # Express server + /search endpoint
│   └── package.json
├── frontend/
│   ├── index.html              # UI layout
│   ├── style.css               # Styling
│   └── script.js               # fetch() + result rendering
└── README.md
```

## How to Run Locally

```bash
cd backend
npm install
npm start
```

Then open your browser at: **http://localhost:3000**

The Express server also serves the frontend, so no separate server is needed.

## Search Logic Explanation

1. The API reads `q`, `category`, `minPrice`, `maxPrice` from the URL query string.
2. It starts with the full inventory array.
3. **Name filter:** If `q` is provided, it converts both the query and each product name to lowercase and checks if the product name includes the query string.
4. **Category filter:** If `category` is provided, it compares the lowercase version of each item's category against the lowercase query value.
5. **Price filters:** It converts `minPrice` and `maxPrice` to numbers and filters items whose price is within the range.
6. **Validation:** If `minPrice > maxPrice`, the API returns a `400 Bad Request` with a friendly message before any filtering.
7. Returns a JSON object with `count` and `results` array.

## Edge Cases Handled
| Case | Behavior |
|------|----------|
| Empty `q` | Name filter is skipped; other filters still apply |
| `minPrice > maxPrice` | Returns `400 Bad Request: Invalid price range` |
| No matching results | Returns `{ count: 0, results: [] }`; UI shows "No results found" |

## API Examples
```
GET /search                           → all 15 items
GET /search?q=chair                  → items with "chair" in name
GET /search?category=Electronics     → electronics only
GET /search?minPrice=50&maxPrice=200 → items priced $50–$200
GET /search?q=desk&category=Furniture&minPrice=100&maxPrice=400
```

## Performance Improvement for Large Datasets
For datasets with thousands of items, the current in-memory linear scan (O(n)) becomes slow.

**Recommended improvement:** Introduce a **full-text search index** using a tool like [Fuse.js](https://fusejs.io/) for in-process fuzzy search, or migrate to a database (PostgreSQL / SQLite) and add a **GIN index** on `productName` for fast text search using `ILIKE` or `tsvector`. Additionally, **pagination** (`limit` and `offset` query params) would prevent sending thousands of records in a single response.
