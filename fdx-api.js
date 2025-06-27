// fdx-api.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// Utility: open DB connection per request
function getDb() {
  return new sqlite3.Database(path.join(__dirname, 'fdx.db'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'FDX API is running' });
});

// FDX: Get all customer data (accounts, transactions, statements) by customer_id
app.get('/fdx/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const db = getDb();

  // Get customer info
  db.get(
    `SELECT customer_id, first_name, last_name, email, created_at
     FROM customers WHERE customer_id = ?`,
    [customerId],
    (err, customer) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      if (!customer) {
        db.close();
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get all accounts for the customer
      db.all(
        `SELECT * FROM accounts WHERE customer_id = ?`,
        [customerId],
        (err, accounts) => {
          if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
          }

          // For each account, get transactions and statements
          const accountIds = accounts.map(acc => acc.account_id);
          if (accountIds.length === 0) {
            db.close();
            return res.json({ customer, accounts: [] });
          }

          // Helper to run multi-account queries
          const placeholders = accountIds.map(() => '?').join(',');

          db.all(
            `SELECT * FROM transactions WHERE account_id IN (${placeholders})`,
            accountIds,
            (err, transactions) => {
              if (err) {
                db.close();
                return res.status(500).json({ error: err.message });
              }

              db.all(
                `SELECT * FROM statements WHERE account_id IN (${placeholders})`,
                accountIds,
                (err, statements) => {
                  db.close();
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }

                  // Structure the response: nest transactions and statements under each account
                  const accountsWithDetails = accounts.map(acc => ({
                    ...acc,
                    transactions: transactions.filter(t => t.account_id === acc.account_id),
                    statements: statements.filter(s => s.account_id === acc.account_id)
                  }));

                  res.json({
                    customer,
                    accounts: accountsWithDetails
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Start the server (only if run directly)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`FDX API server running on port ${PORT}`);
  });
}

module.exports = app;

