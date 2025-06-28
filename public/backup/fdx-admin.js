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

  console.log("searchCustomers called");

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

function selectCustomer(customerId) {
  fetch('/admin/customers')
    .then(res => res.json())
    .then(rows => {
      const customer = rows.find(r => r.customer_id == customerId);
      if (customer) {
        customerForm.edit_id.value = customer.customer_id;
        customerForm.customer_id.value = customer.customer_id;
        customerForm.first_name.value = customer.first_name;
        customerForm.last_name.value = customer.last_name;
        customerForm.email.value = customer.email;
        customerForm.created_at.value = customer.created_at;
        // Optionally, scroll to the form for user convenience
        document.getElementById('customer-form').scrollIntoView({behavior: "smooth"});
      } else {
        alert("Customer not found.");
      }
    })
    .catch(err => {
      alert("Error selecting customer: " + err.message);
    });
}
window.selectCustomer = selectCustomer;

