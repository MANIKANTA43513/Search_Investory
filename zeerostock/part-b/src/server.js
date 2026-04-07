const express = require('express');
const app = express();
const PORT = 4000;

// ── Middleware ──
app.use(express.json());

// ── Routes ──
const supplierRoutes  = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

app.use('/supplier',  supplierRoutes);
app.use('/inventory', inventoryRoutes);

// ── Root health check ──
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zeerostock Part B API is running.',
    endpoints: {
      'POST /supplier':          'Create a new supplier',
      'GET  /supplier':          'List all suppliers',
      'POST /inventory':         'Create an inventory item',
      'GET  /inventory':         'List all inventory with supplier info',
      'GET  /inventory/grouped': 'Inventory grouped by supplier, sorted by total value'
    }
  });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: true, message: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: true, message: 'Internal server error.' });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`✅ Part B Server running at http://localhost:${PORT}`);
  console.log(`   POST /supplier          → create supplier`);
  console.log(`   POST /inventory         → create inventory item`);
  console.log(`   GET  /inventory         → all inventory`);
  console.log(`   GET  /inventory/grouped → grouped by supplier`);
});
