function showOverlay(accounts) {
  const overlay = document.getElementById("tabularOverlay");
  const tbody = document.getElementById("accountsTableBody");
  tbody.innerHTML = ''; // Clear existing rows

  accounts.forEach(account => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${account.bankName}</td>
      <td>${account.accountNumber}</td>
      <td>${account.accountType}</td>
    `;
    tbody.appendChild(row);
  });

  overlay.style.display = "block";
}

function closeOverlay() {
  document.getElementById("tabularOverlay").style.display = "none";
}

