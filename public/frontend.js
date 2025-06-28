document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('linkForm');
  const bankSelect = document.getElementById('bankSelect');
  const customerIdInput = document.getElementById('customerId');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const bank = bankSelect.value;
    const customerId = customerIdInput.value.trim();
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Loading...';

    if (!bank) {
      resultDiv.textContent = 'Please select a bank.';
      return;
    }
    if (!customerId) {
      resultDiv.textContent = 'Please enter your customer number.';
      return;
    }

    // For demo, only "Openbank" is fully supported
    if (bank !== 'openbank') {
      resultDiv.textContent = 'Demo only supports Openbank. Please select Openbank.';
      return;
    }

    try {
      // Fetch accounts for the customer
      const accountsRes = await fetch(`/accounts?customerId=${encodeURIComponent(customerId)}`);
      if (!accountsRes.ok) throw new Error('Failed to fetch accounts');
      const accountsData = await accountsRes.json();

      // For each account, fetch details, transactions, contacts, payment networks
      const details = await Promise.all((accountsData.accounts || []).map(async (account) => {
        const [transactionsRes, contactsRes, paymentNetworksRes] = await Promise.all([
          fetch(`/accounts/${account.account_id}/transactions`),
          fetch(`/accounts/${account.account_id}/contact`),
          fetch(`/accounts/${account.account_id}/payment-networks`)
        ]);
        const [transactions, contacts, paymentNetworks] = await Promise.all([
          transactionsRes.json(),
          contactsRes.json(),
          paymentNetworksRes.json()
        ]);
        return {
          ...account,
          transactions: transactions.transactions || [],
          contacts: contacts.contacts || [],
          payment_networks: paymentNetworks.payment_networks || []
        };
      }));

      if (details.length === 0) {
        resultDiv.textContent = 'No accounts found for this customer number.';
        return;
      }

      // Nicely format the output
      resultDiv.textContent = JSON.stringify(details, null, 2);
    } catch (err) {
      resultDiv.textContent = `Error: ${err.message}`;
    }
  });
});
