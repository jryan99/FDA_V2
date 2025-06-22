const express = require('express');
const bodyParser = require('body-parser');
const plaid = require('plaid');

// Import the accounts router
const accountsRouter = require('./accounts-api');

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Mount the accounts router at /accounts
app.use('/accounts', accountsRouter);

// Example Plaid endpoint (leave as is if you use it)
app.post('/api/public_token', async (req, res) => {
  try {
    const publicToken = req.body.public_token;
    // ... your Plaid logic here ...
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message || "Unauthorized" });
  }
});

// Optional: Root route for health check
app.get('/', (req, res) => {
  res.send('API server is running');
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
