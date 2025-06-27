PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS payment_networks;
DROP TABLE IF EXISTS account_contacts;
DROP TABLE IF EXISTS statements;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

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

-- Insert customers (20 records)
INSERT INTO customers VALUES
(1,'Jane','Doe','jane.doe@email.com','2022-01-01'),
(2,'John','Smith','john.smith@email.com','2022-01-03'),
(3,'Emily','Wong','emily.wong@email.com','2022-01-05'),
(4,'Michael','Brown','michael.brown@email.com','2022-01-07'),
(5,'Sarah','Johnson','sarah.johnson@email.com','2022-01-09'),
(6,'David','Lee','david.lee@email.com','2022-01-11'),
(7,'Alice','Garcia','alice.garcia@email.com','2022-01-13'),
(8,'Robert','Martinez','robert.martinez@email.com','2022-01-15'),
(9,'Linda','Lopez','linda.lopez@email.com','2022-01-17'),
(10,'James','Gonzalez','james.gonzalez@email.com','2022-01-19'),
(11,'Patricia','Wilson','patricia.wilson@email.com','2022-01-21'),
(12,'Christopher','Anderson','christopher.anderson@email.com','2022-01-23'),
(13,'Barbara','Thomas','barbara.thomas@email.com','2022-01-25'),
(14,'Daniel','Taylor','daniel.taylor@email.com','2022-01-27'),
(15,'Elizabeth','Moore','elizabeth.moore@email.com','2022-01-29'),
(16,'Matthew','Jackson','matthew.jackson@email.com','2022-01-31'),
(17,'Jennifer','White','jennifer.white@email.com','2022-02-02'),
(18,'Anthony','Harris','anthony.harris@email.com','2022-02-04'),
(19,'Mary','Martin','mary.martin@email.com','2022-02-06'),
(20,'Chris','Lee','chris.lee@email.com','2022-02-08');

-- Insert accounts (20 records)
INSERT INTO accounts VALUES
(101,1,'checking','11100001','active',5023.45,'USD','2022-01-01'),
(102,2,'savings','22200002','active',12000.00,'USD','2022-01-03'),
(103,3,'creditcard','33300003','active',-230.55,'USD','2022-01-05'),
(104,4,'loan','44400004','active',-5000.00,'USD','2022-01-07'),
(105,5,'investment','55500005','active',15000.00,'USD','2022-01-09'),
(106,6,'checking','66600006','active',3200.00,'USD','2022-01-11'),
(107,7,'savings','77700007','active',8500.00,'USD','2022-01-13'),
(108,8,'creditcard','88800008','

