const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database('./myfdx.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// GET /accounts endpoint
router.get('/', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }
    
    // Parse JSON fields if needed
    const accounts = rows.map(row => ({
      account_id: row.account_id,
      name: row.name,
      balances: row.balances ? JSON.parse(row.balances) : null,
      owners: row.owners ? JSON.parse(row.owners) : null,
      type: row.type,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
    
    res.json(accounts);
  });
});

module.exports = router;
