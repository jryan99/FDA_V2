const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3005;

// Open your SQLite database
const db = new sqlite3.Database('./myfdx.db');

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// /accounts endpoint
app.get('/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    // Parse balances and owners fields from JSON strings
    const accounts = rows.map(row => ({
      account_id: row.account_id,
      balances: JSON.parse(row.balances),
      mask: row.mask,
      name: row.name,
      official_name: row.official_name,
      subtype: row.subtype,
      type: row.type,
      verification_status: row.verification_status,
      institution_id: row.institution_id,
      owners: row.owners ? JSON.parse(row.owners) : [],
      limit: row.credit_limit,
      iso_currency_code: row.iso_currency_code,
      unofficial_currency_code: row.unofficial_currency_code
    }));

    res.json({ accounts });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Accounts API listening at http://localhost:${port}/accounts`);
});

