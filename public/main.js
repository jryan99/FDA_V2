// main.js

// Tab Switching Logic
function showTab(tab) {
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
  const linkScreen = document.getElementById('link-accounts-screen');
  if (linkScreen) linkScreen.style.display = 'none';
  const mainTabs = document.getElementById('main-tabs');
  if (mainTabs) mainTabs.style.display = '';
  if (tab === 'summary') {
    const tabSummary = document.getElementById('tab-summary');
    const summaryTab = document.getElementById('summary-tab');
    if (tabSummary) tabSummary.classList.add('active');
    if (summaryTab) summaryTab.style.display = 'block';
  } else {
    const tabFullview = document.getElementById('tab-fullview');
    const fullviewTab = document.getElementById('fullview-tab');
    if (tabFullview) tabFullview.classList.add('active');
    if (fullviewTab) fullviewTab.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const addBtn = document.getElementById('add-non-fidelity-btn');
  const backBtn = document.getElementById('back-to-main-btn');
  const linkScreen = document.getElementById('link-accounts-screen');
  const mainTabs = document.getElementById('main-tabs');
  const summaryTab = document.getElementById('summary-tab');
  const fullviewTab = document.getElementById('fullview-tab');
  const openbankProvider = document.getElementById('openbank-provider');

  // Modal overlay references
  const modal = document.getElementById('fdx-modal');
  const closeBtn = document.getElementById('fdx-close-modal');
  const tabs = modal ? modal.querySelectorAll('.fdx-tab') : [];
  const tabContents = modal ? modal.querySelectorAll('.fdx-tab-content') : [];

  // Show Link Accounts Screen
  if (addBtn) {
    addBtn.onclick = () => {
      summaryTab.style.display = 'none';
      fullviewTab.style.display = 'none';
      mainTabs.style.display = 'none';
      linkScreen.style.display = 'block';
    };
  }

  // Back to Main Tabs
  if (backBtn) {
    backBtn.onclick = () => {
      linkScreen.style.display = 'none';
      mainTabs.style.display = '';
      showTab('fullview');
    };
  }

  // Enhanced Plaid Link Handler for Openbank
  if (openbankProvider) {
    openbankProvider.onclick = async () => {
      console.log('Openbank provider clicked');
      try {
        // Check if Plaid is available
        if (typeof Plaid === 'undefined') {
          console.error('Plaid SDK not loaded');
          alert('Plaid SDK not available. Please check your internet connection and reload the page.');
          return;
        }

        console.log('Creating Plaid link token...');
        const res = await fetch('/api/create_link_token', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server error:', res.status, errorText);
          throw new Error(`Server error: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        console.log('Link token response:', data);
        
        if (!data.link_token) {
          throw new Error('No link token received from server');
        }

        console.log('Initializing Plaid Link...');
        const handler = Plaid.create({
          token: data.link_token,
          onSuccess: (public_token, metadata) => {
            console.log('Plaid Link success:', { public_token, metadata });
            // Use customer_id = 1 as constant for demo
            displayBankData('ACCESS_TOKEN', 'ACCOUNT_ID', 1);
          },
          onExit: (err, metadata) => {
            console.log('Plaid Link exit:', { err, metadata });
            if (err) {
              console.error('Plaid Link error:', err);
            }
          },
          onEvent: (eventName, metadata) => {
            console.log('Plaid Link event:', eventName, metadata);
          }
        });
        
        console.log('Opening Plaid Link...');
        handler.open();
        
      } catch (err) {
        console.error('Plaid Link error:', err);
        alert('Error connecting to bank: ' + err.message + '\n\nPlease check:\n1. Your internet connection\n2. That the server is running\n3. Your Plaid credentials are configured');
      }
    };
  }

  // Modal tab switching logic
  if (modal && tabs.length && tabContents.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        tabContents.forEach(tc => {
          tc.classList.toggle('active', tc.id === 'fdx-tab-' + target);
        });
      });
    });
  }

  // Modal close logic
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      tabContents.forEach(tc => tc.innerHTML = '');
    });
  }

  // Display Bank Data in Overlay (calls FDX API endpoints)
  window.displayBankData = async (accessToken, accountId, customerId) => {
    if (!modal) return;
    modal.style.display = 'flex';

    const contactEl = document.getElementById('fdx-tab-contact');
    const accountsEl = document.getElementById('fdx-tab-accounts');
    const transactionsEl = document.getElementById('fdx-tab-transactions');
    const statementsEl = document.getElementById('fdx-tab-statements');

    // Show loading placeholders
    [contactEl, accountsEl, transactionsEl, statementsEl].forEach(el => {
      if (el) el.innerHTML = '<p>Loading...</p>';
    });

    try {
      const [contactRes, accountsRes, transactionsRes, statementsRes] = await Promise.all([
        fetch(`/api/openbank/customer/${customerId}`),
        fetch(`/api/openbank/accounts?customerId=${customerId}`),
        fetch(`/api/openbank/transactions?customerId=${customerId}`),
        fetch(`/api/openbank/statements?customerId=${customerId}`)
      ]);

      const contact = await contactRes.json();
      const accounts = (await accountsRes.json()).accounts || [];
      const transactions = (await transactionsRes.json()).transactions || [];
      const statements = (await statementsRes.json()).statements || [];

      // Build Contact Table
      if (contactEl) contactEl.innerHTML = `
        <table>
          <tr><th>Name</th><td>${contact.first_name || ''} ${contact.last_name || ''}</td></tr>
          <tr><th>Email</th><td>${contact.email || ''}</td></tr>
          <tr><th>Customer ID</th><td>${contact.customer_id || ''}</td></tr>
          <tr><th>Created</th><td>${contact.created_at || ''}</td></tr>
        </table>`;

      // Build Accounts Table
      if (accountsEl) accountsEl.innerHTML = `
        <table>
          <thead>
            <tr><th>Account ID</th><th>Type</th><th>Number</th><th>Balance</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${accounts.length ? accounts.map(a => `
              <tr>
                <td>${a.account_id}</td>
                <td>${a.account_type || ''}</td>
                <td>${a.account_number || ''}</td>
                <td>$${a.balance || '0.00'}</td>
                <td>${a.status || ''}</td>
              </tr>`).join('') : '<tr><td colspan="5">No accounts found.</td></tr>'}
          </tbody>
        </table>`;

      // Build Transactions Table
      if (transactionsEl) transactionsEl.innerHTML = `
        <table>
          <thead>
            <tr><th>Transaction ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Currency</th></tr>
          </thead>
          <tbody>
            ${transactions.length ? transactions.map(t => `
              <tr>
                <td>${t.transaction_id || ''}</td>
                <td>${t.posted_timestamp || ''}</td>
                <td>${t.description || ''}</td>
                <td>$${t.amount || '0.00'}</td>
                <td>${t.currency || 'USD'}</td>
              </tr>`).join('') : '<tr><td colspan="5">No transactions found.</td></tr>'}
          </tbody>
        </table>`;

      // Build Statements Table
      if (statementsEl) statementsEl.innerHTML = `
        <table>
          <thead>
            <tr><th>Statement ID</th><th>Period Start</th><th>Period End</th><th>URL</th></tr>
          </thead>
          <tbody>
            ${statements.length ? statements.map(s => `
              <tr>
                <td>${s.statement_id || ''}</td>
                <td>${s.period_start || ''}</td>
                <td>${s.period_end || ''}</td>
                <td><a href="${s.statement_url || '#'}" target="_blank">View</a></td>
              </tr>`).join('') : '<tr><td colspan="4">No statements found.</td></tr>'}
          </tbody>
        </table>`;

    } catch (err) {
      console.error('Error loading bank data:', err);
      [contactEl, accountsEl, transactionsEl, statementsEl].forEach(el => {
        if (el) el.innerHTML = `<p style="color:red;">Failed to load data: ${err.message}</p>`;
      });
    }
  };
});