const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('./fdx.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your admin.html from /public

// Add a customer
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

// Add an account
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

// Add a transaction
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

// Add more endpoints for statements, contacts, payment_networks as needed

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FDX Admin API running on port ${PORT}`);
});

