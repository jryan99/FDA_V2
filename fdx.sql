SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  c.email,
  a.account_id,
  a.account_type,
  a.account_number,
  a.status AS account_status,
  a.balance,
  a.currency AS account_currency,
  t.transaction_id,
  t.amount AS transaction_amount,
  t.currency AS transaction_currency,
  t.description AS transaction_description,
  t.posted_timestamp,
  s.statement_id,
  s.period_start,
  s.period_end,
  s.statement_url
FROM customers c
LEFT JOIN accounts a ON a.customer_id = c.customer_id
LEFT JOIN transactions t ON t.account_id = a.account_id
LEFT JOIN statements s ON s.account_id = a.account_id
WHERE c.customer_id = 1
ORDER BY a.account_id, t.transaction_id, s.statement_id;
