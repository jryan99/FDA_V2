const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const plaid = require('plaid');

// Add this line to import accounts router
const accountsRouter = require('./accounts-api');

// Middleware to parse JSON
app.use(bodyParser.json());

// Mount accounts router
app.use('/accounts', accountsRouter);  // Add this line

// Existing Plaid endpoint
app.post('/api/public_token', async (req, res) => {
  try {
    const publicToken = req.body.public_token;
    // ... rest of your Plaid code ...
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message || "Unauthorized" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
