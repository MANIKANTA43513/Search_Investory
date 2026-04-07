const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Load inventory data once at startup
const inventoryPath = path.join(__dirname, 'data', 'inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

// GET /search
app.get('/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  // Validate price range if both are provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!isNaN(min) && !isNaN(max) && min > max) {
      return res.status(400).json({
        error: true,
        message: 'Invalid price range: minPrice cannot be greater than maxPrice'
      });
    }
  }

  let results = [...inventory];

  // Filter by product name (case-insensitive partial match)
  if (q && q.trim() !== '') {
    const query = q.trim().toLowerCase();
    results = results.filter(item =>
      item.productName.toLowerCase().includes(query)
    );
  }

  // Filter by category (case-insensitive)
  if (category && category.trim() !== '') {
    const cat = category.trim().toLowerCase();
    results = results.filter(item =>
      item.category.toLowerCase() === cat
    );
  }

  // Filter by minPrice
  if (minPrice !== undefined && minPrice !== '') {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      results = results.filter(item => item.price >= min);
    }
  }

  // Filter by maxPrice
  if (maxPrice !== undefined && maxPrice !== '') {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      results = results.filter(item => item.price <= max);
    }
  }

  //Add this
  results.sort((a, b) => a.price - b.price);

  res.json({
    count: results.length,
    results
  });
});

// Catch-all: serve frontend for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Part A Server running at http://localhost:${PORT}`);
});
