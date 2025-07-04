:root {
  --fidelity-green: #10713f;
  --fidelity-green-dark: #0b5e34;
  --fidelity-gray-light: #f5f6fa;
  --fidelity-gray: #ededed;
  --fidelity-border: #e0e0e0;
  --fidelity-text: #222;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background: var(--fidelity-gray-light);
  margin: 0;
  color: var(--fidelity-text);
}

.header {
  background: var(--fidelity-green);
  color: #fff;
  padding: 0;
  font-size: 1.1em;
  font-weight: bold;
  letter-spacing: 1px;
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2em;
  padding: 0.8em 2em 0.2em 2em;
}

.logo {
  font-size: 2.2em;
  font-weight: 900;
  letter-spacing: 2px;
  margin-right: 2em;
}

.header-link {
  cursor: pointer;
  font-weight: 500;
  font-size: 1em;
  margin-right: 1.5em;
  white-space: nowrap;
}

.header-search {
  margin-left: auto;
  border-radius: 5px;
  border: none;
  padding: 0.3em 0.7em;
  font-size: 1em;
  max-width: 180px;
}

.header-sub {
  display: flex;
  gap: 2em;
  padding: 0.3em 2em 0.6em 2em;
  background: var(--fidelity-green-dark);
  font-size: 1em;
}
.main-content {
  max-width: 1200px;
  margin: 2em 0 2em 2em;   /* Remove 'auto', add left margin only */
  background: #fff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: auto;
  min-width: 0;
  box-sizing: border-box;
  text-align: left;
}

.nav-tabs {
  display: flex;
  gap: 2em;
  margin-bottom: 1.5em;
  border-bottom: 2px solid var(--fidelity-border);
}

.tab {
  padding: 0.7em 2em 0.7em 0.2em;
  background: transparent;
  border: none;
  border-bottom: 4px solid transparent;
  color: var(--fidelity-green-dark);
  font-weight: bold;
  font-size: 1.2em;
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
}

.tab.active {
  border-bottom: 4px solid var(--fidelity-green);
  color: var(--fidelity-green);
}

.panel {
  display: flex;
  gap: 2em;
  margin-bottom: 2em;
}

.accounts-box, .balance-box {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px #0001;
  padding: 2em 2em 1.5em 2em;
  min-width: 340px;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.accounts-box h3, .balance-box h3 {
  color: var(--fidelity-green);
  margin-top: 0;
  margin-bottom: 0.7em;
  font-size: 1.2em;
  font-weight: 700;
}

.accounts-value, .balance-value {
  font-size: 2em;
  font-weight: 900;
  margin: 0.2em 0 0.7em 0;
}

.accounts-breakdown {
  margin-top: 1em;
  font-size: 1em;
  font-weight: 500;
  color: #444;
}

.balance-change {
  color: var(--fidelity-green);
  font-weight: 700;
  margin-left: 1em;
  font-size: 1em;
}

.balance-bar {
  height: 32px;
  width: 100%;
  background: repeating-linear-gradient(
    90deg, #eaf8f0, #eaf8f0 10px, #d9f2e6 10px, #d9f2e6 20px
  );
  border-radius: 8px;
  margin: 1em 0;
}

.security-message {
  background: #f8faf8;
  border: 1px solid var(--fidelity-border);
  border-radius: 8px;
  padding: 1em;
  margin-top: 0.8em;
  font-size: 1em;
}

.security-message strong {
  display: block;
  margin-bottom: 0.3em;
}

.add-security-link {
  color: var(--fidelity-green);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.footer {
  text-align: center;
  color: #888;
  font-size: 0.95em;
  margin-top: 3em;
  margin-bottom: 1em;
}

