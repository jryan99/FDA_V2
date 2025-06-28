const request = require('supertest');
const app = require('./fdx-api');

describe('FDX API', () => {
  it('GET /accounts?customerId=1 returns accounts for customer', async () => {
    const res = await request(app)
      .get('/accounts')
      .query({ customerId: 1 })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.accounts)).toBe(true);
    // Optionally, check for known data
    // expect(res.body.accounts[0]).toHaveProperty('account_id');
  });

  it('GET /accounts/:accountId returns account details', async () => {
    const res = await request(app)
      .get('/accounts/101')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('account_id', 101);
  });

  it('GET /accounts/:accountId/transactions returns transactions', async () => {
    const res = await request(app)
      .get('/accounts/101/transactions')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.transactions)).toBe(true);
  });

  it('GET /health returns status', async () => {
    const res = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status');
  });
});

