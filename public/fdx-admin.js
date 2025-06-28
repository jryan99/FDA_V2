// Tab logic
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  };
});

// --- Customers CRUD ---
const customerForm = document.getElementById('customer-form');
const customerResult = document.getElementById('customer-result');
const customersTable = document.getElementById('customers-table');

function loadCustomers() {
  fetch('/admin/customers').then(res => res.json()).then(rows => {
    let html = '<tr><th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Created</th><th>Actions</th></tr>';
    rows.forEach(row => {
      html += `<tr>
        <td>${row.customer_id}</td>
        <td>${row.first_name}</td>
        <td>${row.last_name}</td>
        <td>${row.email}</td>
        <td>${row.created_at}</td>
        <td>
          <button onclick="editCustomer(${row.customer_id})">Edit</button>
          <button onclick="deleteCustomer(${row.customer_id})">Delete</button>
        </td>
      </tr>`;
    });
    customersTable.innerHTML = html;
  });
}
customerForm.onsubmit = function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(customerForm));
  const method = data.edit_id ? 'PUT' : 'POST';
  const url = data.edit_id ? `/admin/customers/${data.edit_id}` : '/admin/customers';
  if (data.edit_id) delete data.edit_id;
  fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    customerResult.textContent = res.success ? 'Success!' : (res.error || 'Error');
    customerForm.reset();
    loadCustomers();
  });
};
window.editCustomer = function(id) {
  fetch('/admin/customers').then(res => res.json()).then(rows => {
    const row = rows.find(r => r.customer_id == id);
    if (row) {
      customerForm.edit_id.value = row.customer_id;
      customerForm.customer_id.value = row.customer_id;
      customerForm.first_name.value = row.first_name;
      customerForm.last_name.value = row.last_name;
      customerForm.email.value = row.email;
      customerForm.created_at.value = row.created_at;
    }
  });
};
window.deleteCustomer = function(id) {
  if (!confirm('Delete this customer?')) return;
  fetch(`/admin/customers/${id}`, {method: 'DELETE'}).then(res => res.json()).then(res => {
    loadCustomers();
  });
};
loadCustomers();

// --- Customer Search ---
function searchCustomers() {
  const query = document.getElementById('customer-search').value;
  const messageDiv = document.getElementById('search-message');
  messageDiv.textContent = ''; // Clear previous message

  if (!query) {
    document.getElementById('search-results').innerHTML = '';
    messageDiv.textContent = '';
    return;
  }

  fetch(`/admin/customers/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(rows => {
      let html = '<tr><th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Select</th></tr>';
      if (rows.length === 0) {
        messageDiv.textContent = 'No customers found.';
      } else {
        messageDiv.textContent = `Found ${rows.length} customer(s).`;
      }
      rows.forEach(row => {
        html += `<tr>
          <td>${row.customer_id}</td>
          <td>${row.first_name}</td>
          <td>${row.last_name}</td>
          <td>${row.email}</td>
          <td><button onclick="selectCustomer(${row.customer_id})">Select</button></td>
        </tr>`;
      });
      document.getElementById('search-results').innerHTML = html;
    })
    .catch(() => {
      messageDiv.textContent = 'Error searching for customers.';
    });
}
window.searchCustomers = searchCustomers;

// --- Enhanced: When a customer is selected, pre-fill forms and load related data ---
function selectCustomer(customerId) {
  fetch('/admin/customers')
    .then(res => res.json())
    .then(rows => {
      const customer = rows.find(r => r.customer_id == customerId);
      if (customer) {
        // Pre-fill customer form
        customerForm.edit_id.value = customer.customer_id;
        customerForm.customer_id.value = customer.customer_id;
        customerForm.first_name.value = customer.first_name;
        customerForm.last_name.value = customer.last_name;
        customerForm.email.value = customer.email;
        customerForm.created_at.value = customer.created_at;

        // Pre-fill Account and Transaction forms with customer_id
        document.querySelector('#account-form [name="customer_id"]').value = customer.customer_id;
        document.querySelector('#transaction-form [name="account_id"]').value = ''; // Clear, user must pick an account
        // Optionally, clear other fields in those forms if you wish

        // Load and display accounts for this customer
        loadAccounts(customer.customer_id);

        // Load and display transactions for this customer's accounts
        loadTransactionsForCustomer(customer.customer_id);

        // Scroll to customer form for convenience
        customerForm.scrollIntoView({behavior: "smooth"});
      } else {
        alert("Customer not found.");
      }
    })
    .catch(err => {
      alert("Error selecting customer: " + err.message);
    });
}
window.selectCustomer = selectCustomer;

// --- Accounts CRUD ---
const accountForm = document.getElementById('account-form');
const accountResult = document.getElementById('account-result');
const accountsTable = document.getElementById('accounts-table');

// Enhanced: loadAccounts optionally filtered by customer_id
function loadAccounts(customerId) {
  let url = '/admin/accounts';
  if (customerId) {
    url += `?customer_id=${customerId}`;
  }
  fetch(url).then(res => res.json()).then(rows => {
    let html = '<tr><th>ID</th><th>Customer</th><th>Type</th><th>Number</th><th>Status</th><th>Balance</th><th>Currency</th><th>Created</th><th>Actions</th></tr>';
    rows.forEach(row => {
      html += `<tr>
        <td>${row.account_id}</td>
        <td>${row.customer_id}</td>
        <td>${row.account_type}</td>
        <td>${row.account_number}</td>
        <td>${row.status}</td>
        <td>${row.balance}</td>
        <td>${row.currency}</td>
        <td>${row.created_at}</td>
        <td>
          <button onclick="editAccount(${row.account_id})">Edit</button>
          <button onclick="deleteAccount(${row.account_id})">Delete</button>
        </td>
      </tr>`;
    });
    accountsTable.innerHTML = html;
  });
}
accountForm.onsubmit = function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(accountForm));
  const method = data.edit_id ? 'PUT' : 'POST';
  const url = data.edit_id ? `/admin/accounts/${data.edit_id}` : '/admin/accounts';
  if (data.edit_id) delete data.edit_id;
  fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    accountResult.textContent = res.success ? 'Success!' : (res.error || 'Error');
    accountForm.reset();
    loadAccounts(document.querySelector('#account-form [name="customer_id"]').value);
  });
};
window.editAccount = function(id) {
  fetch('/admin/accounts').then(res => res.json()).then(rows => {
    const row = rows.find(r => r.account_id == id);
    if (row) {
      accountForm.edit_id.value = row.account_id;
      accountForm.account_id.value = row.account_id;
      accountForm.customer_id.value = row.customer_id;
      accountForm.account_type.value = row.account_type;
      accountForm.account_number.value = row.account_number;
      accountForm.status.value = row.status;
      accountForm.balance.value = row.balance;
      accountForm.currency.value = row.currency;
      accountForm.created_at.value = row.created_at;
    }
  });
};
window.deleteAccount = function(id) {
  if (!confirm('Delete this account?')) return;
  fetch(`/admin/accounts/${id}`, {method: 'DELETE'}).then(res => res.json()).then(res => {
    loadAccounts(document.querySelector('#account-form [name="customer_id"]').value);
  });
};
// Default: load all accounts
loadAccounts();

// --- Transactions CRUD ---
const transactionForm = document.getElementById('transaction-form');
const transactionResult = document.getElementById('transaction-result');
const transactionsTable = document.getElementById('transactions-table');

// Enhanced: loadTransactions optionally filtered by customer_id
function loadTransactionsForCustomer(customerId) {
  // Get all accounts for this customer, then all transactions for those accounts
  fetch(`/admin/accounts?customer_id=${customerId}`)
    .then(res => res.json())
    .then(accounts => {
      const accountIds = accounts.map(acc => acc.account_id);
      if (accountIds.length === 0) {
        transactionsTable.innerHTML = '<tr><td colspan="7">No transactions found for this customer.</td></tr>';
        return;
      }
      // Fetch all transactions, filter client-side for these accounts
      fetch('/admin/transactions')
        .then(res => res.json())
        .then(transactions => {
          let html = '<tr><th>ID</th><th>Account</th><th>Amount</th><th>Type</th><th>Description</th><th>Created</th><th>Actions</th></tr>';
          transactions.filter(tx => accountIds.includes(tx.account_id)).forEach(row => {
            html += `<tr>
              <td>${row.transaction_id}</td>
              <td>${row.account_id}</td>
              <td>${row.amount}</td>
              <td>${row.type}</td>
              <td>${row.description}</td>
              <td>${row.created_at}</td>
              <td>
                <button onclick="editTransaction(${row.transaction_id})">Edit</button>
                <button onclick="deleteTransaction(${row.transaction_id})">Delete</button>
              </td>
            </tr>`;
          });
          transactionsTable.innerHTML = html;
        });
    });
}

transactionForm.onsubmit = function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(transactionForm));
  const method = data.edit_id ? 'PUT' : 'POST';
  const url = data.edit_id ? `/admin/transactions/${data.edit_id}` : '/admin/transactions';
  if (data.edit_id) delete data.edit_id;
  fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    transactionResult.textContent = res.success ? 'Success!' : (res.error || 'Error');
    transactionForm.reset();
    // Reload transactions for the selected customer, if any
    const customerId = document.querySelector('#account-form [name="customer_id"]').value;
    if (customerId) {
      loadTransactionsForCustomer(customerId);
    } else {
      loadTransactions();
    }
  });
};
window.editTransaction = function(id) {
  fetch('/admin/transactions').then(res => res.json()).then(rows => {
    const row = rows.find(r => r.transaction_id == id);
    if (row) {
      transactionForm.edit_id.value = row.transaction_id;
      transactionForm.transaction_id.value = row.transaction_id;
      transactionForm.account_id.value = row.account_id;
      transactionForm.amount.value = row.amount;
      transactionForm.type.value = row.type;
      transactionForm.description.value = row.description;
      transactionForm.created_at.value = row.created_at;
    }
  });
};
window.deleteTransaction = function(id) {
  if (!confirm('Delete this transaction?')) return;
  fetch(`/admin/transactions/${id}`, {method: 'DELETE'}).then(res => res.json()).then(res => {
    const customerId = document.querySelector('#account-form [name="customer_id"]').value;
    if (customerId) {
      loadTransactionsForCustomer(customerId);
    } else {
      loadTransactions();
    }
  });
};
// Default: load all transactions
function loadTransactions() {
  fetch('/admin/transactions').then(res => res.json()).then(rows => {
    let html = '<tr><th>ID</th><th>Account</th><th>Amount</th><th>Type</th><th>Description</th><th>Created</th><th>Actions</th></tr>';
    rows.forEach(row => {
      html += `<tr>
        <td>${row.transaction_id}</td>
        <td>${row.account_id}</td>
        <td>${row.amount}</td>
        <td>${row.type}</td>
        <td>${row.description}</td>
        <td>${row.created_at}</td>
        <td>
          <button onclick="editTransaction(${row.transaction_id})">Edit</button>
          <button onclick="deleteTransaction(${row.transaction_id})">Delete</button>
        </td>
      </tr>`;
    });
    transactionsTable.innerHTML = html;
  });
}
loadTransactions();

