const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./fdx.db');
app.use(express.json());

// Get all accounts for a customer
app.get('/accounts', (req, res) => {
  const customerId = req.query.customerId;
  if (!customerId) return res.status(400).json({error: 'customerId required'});
  db.all(
    'SELECT * FROM accounts WHERE customer_id = ?',
    [customerId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({accounts: rows});
    }
  );
});

// Get account details by accountId
app.get('/accounts/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  db.get(
    'SELECT * FROM accounts WHERE account_id = ?',
    [accountId],
    (err, row) => {
      if (err) return res.status(500).json({error: err.message});
      if (!row) return res.status(404).json({error: 'Account not found'});
      res.json(row);
    }
  );
});

// Get transactions for an account
app.get('/accounts/:accountId/transactions', (req, res) => {
  const accountId = req.params.accountId;
  db.all(
    'SELECT * FROM transactions WHERE account_id = ?',
    [accountId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({transactions: rows});
    }
  );
});

// Get contact info for an account
app.get('/accounts/:accountId/contact', (req, res) => {
  const accountId = req.params.accountId;
  db.all(
    'SELECT * FROM account_contacts WHERE account_id = ?',
    [accountId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({contacts: rows});
    }
  );
});

// Get payment networks for an account
app.get('/accounts/:accountId/payment-networks', (req, res) => {
  const accountId = req.params.accountId;
  db.all(
    'SELECT * FROM payment_networks WHERE account_id = ?',
    [accountId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({payment_networks: rows});
    }
  );
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({status: 'FDX API is running'});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FDX API server running on port ${PORT}`);
});

