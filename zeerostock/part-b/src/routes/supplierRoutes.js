const express = require('express');
const router = express.Router();
const { createSupplier, getAllSuppliers } = require('../controllers/supplierController');

// POST /supplier  → create a new supplier
router.post('/', createSupplier);

// GET  /supplier  → list all suppliers
router.get('/', getAllSuppliers);

module.exports = router;
