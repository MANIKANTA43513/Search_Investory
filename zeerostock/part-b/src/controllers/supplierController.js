const db = require('../db/connection');

/**
 * POST /supplier
 * Body: { name, city }
 */
const createSupplier = (req, res) => {
  const { name, city } = req.body;

  // ── Validation ──
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: true, message: 'Supplier name is required.' });
  }
  if (!city || typeof city !== 'string' || city.trim() === '') {
    return res.status(400).json({ error: true, message: 'Supplier city is required.' });
  }

  const stmt = db.prepare('INSERT INTO suppliers (name, city) VALUES (?, ?)');
  const result = stmt.run(name.trim(), city.trim());

  const newSupplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({
    message: 'Supplier created successfully.',
    supplier: newSupplier
  });
};

/**
 * GET /supplier
 * Returns all suppliers
 */
const getAllSuppliers = (req, res) => {
  const suppliers = db.prepare('SELECT * FROM suppliers ORDER BY id').all();
  return res.json({ count: suppliers.length, suppliers });
};

module.exports = { createSupplier, getAllSuppliers };
