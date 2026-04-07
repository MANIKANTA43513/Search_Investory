const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'zeerostock.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Open (or create) the SQLite database
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
// Enforce foreign keys
db.pragma('foreign_keys = ON');

// Run schema on first start
const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);

console.log('✅ Database connected and schema applied.');

module.exports = db;
