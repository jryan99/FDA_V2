// accounts-api.test.js
const request = require('supertest');
const app = require('./server'); // Adjust path if needed

describe('Accounts API', () => {
  it('GET /accounts should return a list of accounts', async () => {
    const res = await request(app).get('/accounts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /accounts should create a new account', async () => {
    const newAccount = { name: "Test Account", balance: 1000 };
    const res = await request(app)
      .post('/accounts')
      .send(newAccount)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newAccount.name);
    expect(res.body.balance).toBe(newAccount.balance);
  });

  // Add more tests as needed for PUT, DELETE, etc.
});

