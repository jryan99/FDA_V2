-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Drop existing tables (if needed)
DROP TABLE IF EXISTS payment_networks;
DROP TABLE IF EXISTS account_contacts;
DROP TABLE IF EXISTS statements;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

-- Create tables
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  account_type TEXT NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  balance REAL NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  description TEXT NOT NULL,
  posted_timestamp TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE statements (
  statement_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  statement_url TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE account_contacts (
  contact_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE payment_networks (
  network_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  network_type TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- Import CSV data
.mode csv
.import customers.csv customers
.import accounts.csv accounts
.import transactions.csv transactions
.import statements.csv statements
.import account_contacts.csv account_contacts
.import payment_networks.csv payment_networks

-- Verify counts
SELECT 'Customers' AS table, COUNT(*) AS count FROM customers
UNION ALL
SELECT 'Accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Statements', COUNT(*) FROM statements
UNION ALL
SELECT 'Account Contacts', COUNT(*) FROM account_contacts
UNION ALL
SELECT 'Payment Networks', COUNT(*) FROM payment_networks;

