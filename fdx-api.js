const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./fdx.db');
require('dotenv').config();
app.use(express.json());

// Plaid setup (if needed)
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});
const plaidClient = new PlaidApi(configuration);

// Create Plaid Link token
app.post('/api/create_link_token', async (req, res) => {
  try {
    const plaidResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique-user-id' },
      client_name: 'Openbank',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: plaidResponse.data.link_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Openbank sub-page endpoints ---

// Get Openbank customer info
app.get('/api/openbank/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  db.get(
    'SELECT * FROM customers WHERE customer_id = ?',
    [customerId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Customer not found' });
      res.json(row);
    }
  );
});

// Get Openbank accounts for customer
app.get('/api/openbank/accounts', (req, res) => {
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

// Get Openbank transactions for customer
app.get('/api/openbank/transactions', (req, res) => {
  const customerId = req.query.customerId;
  if (!customerId) return res.status(400).json({error: 'customerId required'});
  db.all(
    `SELECT t.* FROM transactions t
     JOIN accounts a ON t.account_id = a.account_id
     WHERE a.customer_id = ?`,
    [customerId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({transactions: rows});
    }
  );
});

// Get Openbank statements for customer
app.get('/api/openbank/statements', (req, res) => {
  const customerId = req.query.customerId;
  if (!customerId) return res.status(400).json({error: 'customerId required'});
  db.all(
    `SELECT s.* FROM statements s
     JOIN accounts a ON s.account_id = a.account_id
     WHERE a.customer_id = ?`,
    [customerId],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({statements: rows});
    }
  );
});

// Serve static files after API routes
app.use(express.static('public'));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`FDA_V2 server running on port ${PORT}`);
  });
}

module.exports = app;

