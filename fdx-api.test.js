const request = require('supertest');
const app = require('./fdx_api'); // Adjust path as needed

describe('FDX API End-to-End Customer Data Retrieval', () => {
  const customerId = 1;

  it('should retrieve the customer profile', async () => {
    // If you have a /customers/:customerId endpoint
    const res = await request(app).get(`/customers/${customerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('customer_id', customerId);
    // Add more FDX/Plaid field checks as needed
  });

  it('should retrieve all accounts for the customer', async () => {
    const res = await request(app).get(`/accounts?customerId=${customerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.accounts).toBeInstanceOf(Array);
    expect(res.body.accounts.length).toBeGreaterThan(0);
    // Optionally store accounts for further tests
    global.accounts = res.body.accounts;
  });

  it('should retrieve full account details and related info for each account', async () => {
    for (const account of global.accounts) {
      // Account details
      const accRes = await request(app).get(`/accounts/${account.account_id}`);
      expect(accRes.statusCode).toBe(200);
      expect(accRes.body).toHaveProperty('account_id', account.account_id);

      // Transactions
      const txRes = await request(app).get(`/accounts/${account.account_id}/transactions`);
      expect(txRes.statusCode).toBe(200);
      expect(txRes.body.transactions).toBeInstanceOf(Array);

      // Statements
      const stmtRes = await request(app).get(`/accounts/${account.account_id}/statements`);
      expect(stmtRes.statusCode).toBe(200);
      expect(stmtRes.body.statements).toBeInstanceOf(Array);

      // Contacts
      const contactRes = await request(app).get(`/accounts/${account.account_id}/contact`);
      expect(contactRes.statusCode).toBe(200);
      expect(contactRes.body.contacts).toBeInstanceOf(Array);

      // Payment Networks
      const pnRes = await request(app).get(`/accounts/${account.account_id}/payment-networks`);
      expect(pnRes.statusCode).toBe(200);
      expect(pnRes.body.payment_networks).toBeInstanceOf(Array);
    }
  });
});

