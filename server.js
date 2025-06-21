const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {OAuth2Client} = require("google-auth-library");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "YOUR_PLAID_CLIENT_ID",
      "PLAID-SECRET": "YOUR_PLAID_SECRET",
    },
  },
});
const plaidClient = new PlaidApi(plaidConfig);

// Verify Google ID token
async function verifyGoogleToken(token) {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

app.post("/api/accounts", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/, "");

  try {
    await verifyGoogleToken(token); // Throws if invalid

    // 1. Create a public_token in sandbox
    const publicTokenResp = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_109508",
      initial_products: ["auth", "transactions"],
    });
    const publicToken = publicTokenResp.data.public_token;

    // 2. Exchange public_token for access_token
    const accessTokenResp = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = accessTokenResp.data.access_token;

    // 3. Call /accounts/get
    const accountsResp = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    res.json(accountsResp.data);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message || "Unauthorized" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});

