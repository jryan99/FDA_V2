const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('./fdx.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- CUSTOMERS CRUD ---

// Create
app.post('/admin/customers', (req, res) => {
  const { customer_id, first_name, last_name, email, created_at } = req.body;
  db.run(
    `INSERT INTO customers (customer_id, first_name, last_name, email, created_at) VALUES (?, ?, ?, ?, ?)`,
    [customer_id, first_name, last_name, email, created_at],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, customer_id: this.lastID });
    }
  );
});
// Read all
app.get('/admin/customers', (req, res) => {
  db.all(`SELECT * FROM customers ORDER BY customer_id`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Search
app.get('/admin/customers/search', (req, res) => {
  const q = req.query.q || '';
  const query = `
    SELECT * FROM customers 
    WHERE customer_id LIKE ? 
       OR first_name LIKE ? 
       OR last_name LIKE ? 
       OR email LIKE ?
    ORDER BY customer_id
  `;
  const searchTerm = `%${q}%`;
  db.all(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Update
app.put('/admin/customers/:id', (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, email, created_at } = req.body;
  db.run(
    `UPDATE customers SET first_name=?, last_name=?, email=?, created_at=? WHERE customer_id=?`,
    [first_name, last_name, email, created_at, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    }
  );
});
// Delete
app.delete('/admin/customers/:id', (req, res) => {
  db.run(`DELETE FROM customers WHERE customer_id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// --- ACCOUNTS CRUD ---

app.post('/admin/accounts', (req, res) => {
  const { account_id, customer_id, account_type, account_number, status, balance, currency, created_at } = req.body;
  db.run(
    `INSERT INTO accounts (account_id, customer_id, account_type, account_number, status, balance, currency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [account_id, customer_id, account_type, account_number, status, balance, currency, created_at],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, account_id: this.lastID });
    }
  );
});
app.get('/admin/accounts', (req, res) => {
  db.all(`SELECT * FROM accounts ORDER BY account_id`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.put('/admin/accounts/:id', (req, res) => {
  const id = req.params.id;
  const { customer_id, account_type, account_number, status, balance, currency, created_at } = req.body;
  db.run(
    `UPDATE accounts SET customer_id=?, account_type=?, account_number=?, status=?, balance=?, currency=?, created_at=? WHERE account_id=?`,
    [customer_id, account_type, account_number, status, balance, currency, created_at, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    }
  );
});
app.delete('/admin/accounts/:id', (req, res) => {
  db.run(`DELETE FROM accounts WHERE account_id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// --- TRANSACTIONS CRUD ---

app.post('/admin/transactions', (req, res) => {
  const { transaction_id, account_id, amount, type, description, created_at } = req.body;
  db.run(
    `INSERT INTO transactions (transaction_id, account_id, amount, type, description, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [transaction_id, account_id, amount, type, description, created_at],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, transaction_id: this.lastID });
    }
  );
});
app.get('/admin/transactions', (req, res) => {
  db.all(`SELECT * FROM transactions ORDER BY transaction_id`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.put('/admin/transactions/:id', (req, res) => {
  const id = req.params.id;
  const { account_id, amount, type, description, created_at } = req.body;
  db.run(
    `UPDATE transactions SET account_id=?, amount=?, type=?, description=?, created_at=? WHERE transaction_id=?`,
    [account_id, amount, type, description, created_at, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    }
  );
});
app.delete('/admin/transactions/:id', (req, res) => {
  db.run(`DELETE FROM transactions WHERE transaction_id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FDX Admin API running on port ${PORT}`);
});

