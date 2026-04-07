const express = require('express');
const router = express.Router();
const { createInventory, getAllInventory, getGroupedInventory } = require('../controllers/inventoryController');

// POST /inventory          → create inventory item
router.post('/', createInventory);

// GET  /inventory          → list all inventory
router.get('/', getAllInventory);

// GET  /inventory/grouped  → grouped by supplier, sorted by total value
router.get('/grouped', getGroupedInventory);

module.exports = router;
