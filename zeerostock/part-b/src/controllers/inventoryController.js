const db = require('../db/connection');

/**
 * POST /inventory
 * Body: { supplier_id, product_name, quantity, price }
 */
const createInventory = (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // ── Validate required fields ──
  if (!supplier_id) {
    return res.status(400).json({ error: true, message: 'supplier_id is required.' });
  }
  if (!product_name || typeof product_name !== 'string' || product_name.trim() === '') {
    return res.status(400).json({ error: true, message: 'product_name is required.' });
  }
  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ error: true, message: 'quantity is required.' });
  }
  if (price === undefined || price === null) {
    return res.status(400).json({ error: true, message: 'price is required.' });
  }

  const qty   = Number(quantity);
  const prc   = Number(price);
  const supId = Number(supplier_id);

  // ── Validate quantity ──
  if (isNaN(qty) || !Number.isInteger(qty)) {
    return res.status(400).json({ error: true, message: 'quantity must be a whole number.' });
  }
  if (qty < 0) {
    return res.status(400).json({ error: true, message: 'quantity must be 0 or more.' });
  }

  // ── Validate price ──
  if (isNaN(prc)) {
    return res.status(400).json({ error: true, message: 'price must be a valid number.' });
  }
  if (prc <= 0) {
    return res.status(400).json({ error: true, message: 'price must be greater than 0.' });
  }

  // ── Validate supplier exists ──
  const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(supId);
  if (!supplier) {
    return res.status(400).json({
      error: true,
      message: `Invalid supplier_id: no supplier found with id ${supId}.`
    });
  }

  // ── Insert ──
  const stmt = db.prepare(
    'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(supId, product_name.trim(), qty, prc);

  const newItem = db.prepare('SELECT * FROM inventory WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({
    message: 'Inventory item created successfully.',
    item: newItem
  });
};

/**
 * GET /inventory
 * Returns all inventory items with supplier name
 */
const getAllInventory = (req, res) => {
  const items = db.prepare(`
    SELECT
      i.id,
      i.product_name,
      i.quantity,
      i.price,
      i.supplier_id,
      s.name AS supplier_name,
      s.city AS supplier_city,
      (i.quantity * i.price) AS total_value
    FROM inventory i
    JOIN suppliers s ON s.id = i.supplier_id
    ORDER BY i.id
  `).all();

  return res.json({ count: items.length, items });
};

/**
 * GET /inventory/grouped
 * Returns inventory grouped by supplier, sorted by total inventory value DESC
 */
const getGroupedInventory = (req, res) => {
  const grouped = db.prepare(`
    SELECT
      s.id        AS supplier_id,
      s.name      AS supplier_name,
      s.city      AS supplier_city,
      COUNT(i.id) AS product_count,
      SUM(i.quantity)               AS total_quantity,
      ROUND(SUM(i.quantity * i.price), 2) AS total_inventory_value
    FROM suppliers s
    JOIN inventory i ON s.id = i.supplier_id
    GROUP BY s.id, s.name, s.city
    ORDER BY total_inventory_value DESC
  `).all();

  return res.json({
    description: 'Inventory grouped by supplier, sorted by total inventory value (quantity × price)',
    count: grouped.length,
    grouped
  });
};

module.exports = { createInventory, getAllInventory, getGroupedInventory };
