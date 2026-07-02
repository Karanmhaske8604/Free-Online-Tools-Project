import React, { useState } from 'react';
import { Plus, Trash2, Copy, Send, Check } from 'lucide-react';

export default function BillSplitter() {
  const [people, setPeople] = useState(['Alice', 'Bob', 'Charlie']);
  const [newPerson, setNewPerson] = useState('');
  const [expenses, setExpenses] = useState([
    { id: '1', desc: 'Dinner outing', amount: 90, paidBy: 'Alice', splitWith: ['Alice', 'Bob', 'Charlie'] },
    { id: '2', desc: 'Taxi fare', amount: 15, paidBy: 'Bob', splitWith: ['Alice', 'Bob'] },
  ]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [payer, setPayer] = useState('Alice');
  const [copied, setCopied] = useState(false);

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (newPerson.trim() && !people.includes(newPerson.trim())) {
      setPeople((prev) => [...prev, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (name) => {
    setPeople((prev) => prev.filter((p) => p !== name));
    // Clean up expenses
    setExpenses((prev) =>
      prev
        .map((exp) => ({
          ...exp,
          splitWith: exp.splitWith.filter((p) => p !== name),
        }))
        .filter((exp) => exp.paidBy !== name && exp.splitWith.length > 0)
    );
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amt = parseFloat(newAmt);
    if (newDesc.trim() && amt > 0) {
      setExpenses((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          desc: newDesc.trim(),
          amount: amt,
          paidBy: payer,
          splitWith: [...people], // Split equally with everyone by default
        },
      ]);
      setNewDesc('');
      setNewAmt('');
    }
  };

  const handleRemoveExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Balancing algorithm
  const computeBalances = () => {
    const balances = {};
    people.forEach((p) => {
      balances[p] = 0;
    });

    expenses.forEach((exp) => {
      const payerName = exp.paidBy;
      const amount = exp.amount;
      const count = exp.splitWith.length;
      if (count === 0) return;

      const share = amount / count;

      // Add to payer
      if (balances[payerName] !== undefined) {
        balances[payerName] += amount;
      }

      // Subtract from members splitting
      exp.splitWith.forEach((member) => {
        if (balances[member] !== undefined) {
          balances[member] -= share;
        }
      });
    });

    return balances;
  };

  const balances = computeBalances();

  const calculateTransactions = () => {
    const transactions = [];
    const activeBalances = { ...balances };

    const creditors = [];
    const debtors = [];

    Object.keys(activeBalances).forEach((person) => {
      const bal = activeBalances[person];
      if (bal > 0.01) {
        creditors.push({ name: person, amount: bal });
      } else if (bal < -0.01) {
        debtors.push({ name: person, amount: Math.abs(bal) });
      }
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amountToPay = Math.min(debtor.amount, creditor.amount);

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amountToPay,
      });

      debtor.amount -= amountToPay;
      creditor.amount -= amountToPay;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return transactions;
  };

  const transactions = calculateTransactions();

  const handleCopySummary = () => {
    let summaryText = '--- Expense Split Summary ---\n\n';
    summaryText += 'Individual Balances:\n';
    Object.keys(balances).forEach((p) => {
      summaryText += `${p}: ${balances[p] >= 0 ? '+' : ''}$${balances[p].toFixed(2)}\n`;
    });
    summaryText += '\nClear Settlements:\n';
    transactions.forEach((tx) => {
      summaryText += `${tx.from} pays $${tx.amount.toFixed(2)} to ${tx.to}\n`;
    });
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Participants ({people.length})</h3>
        
        <form onSubmit={handleAddPerson} className="form-row-compact">
          <input
            type="text"
            className="glass-input"
            placeholder="Add new person..."
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-icon-only-btn">
            <Plus size={16} />
          </button>
        </form>

        <div className="people-badges-list">
          {people.map((p) => (
            <div key={p} className="person-badge">
              <span>{p}</span>
              <button onClick={() => handleRemovePerson(p)} className="badge-delete">
                &times;
              </button>
            </div>
          ))}
        </div>

        <h3 className="section-divider-title">Add Expense</h3>
        <form onSubmit={handleAddExpense} className="expense-form">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="glass-input"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Groceries, tickets..."
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className="glass-input"
                value={newAmt}
                onChange={(e) => setNewAmt(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Paid By</label>
              <select
                className="glass-select"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                {people.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Add Expense
          </button>
        </form>
      </div>

      <div className="tool-results glass-panel splitter-results">
        <div className="results-header-row">
          <h3>Settlement Summary</h3>
          {transactions.length > 0 && (
            <button onClick={handleCopySummary} className="btn btn-secondary btn-sm">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Share Summary'}
            </button>
          )}
        </div>

        <div className="splitter-sections-container">
          <div className="balances-section">
            <h4>Balances</h4>
            <div className="balances-list">
              {people.map((p) => {
                const bal = balances[p] || 0;
                return (
                  <div key={p} className="balance-item-row">
                    <span className="balance-person-name">{p}</span>
                    <span className={`balance-person-amt ${bal > 0.01 ? 'positive' : bal < -0.01 ? 'negative' : ''}`}>
                      {bal >= 0 ? '+' : ''}${bal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="transactions-section">
            <h4>Suggested Payments</h4>
            <div className="payments-list">
              {transactions.map((tx, idx) => (
                <div key={idx} className="payment-suggestion-card">
                  <strong>{tx.from}</strong>
                  <span className="payment-arrow">owes</span>
                  <strong className="payment-amt">${tx.amount.toFixed(2)}</strong>
                  <span className="payment-arrow">to</span>
                  <strong>{tx.to}</strong>
                </div>
              ))}

              {transactions.length === 0 && (
                <div className="all-settled-box">
                  <p>All expenses are balanced! No settlements needed.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {expenses.length > 0 && (
          <div className="expenses-history-section">
            <h4>Expenses History</h4>
            <div className="expenses-history-list">
              {expenses.map((exp) => (
                <div key={exp.id} className="history-expense-row">
                  <div className="history-details">
                    <strong>{exp.desc}</strong>
                    <span>Paid by {exp.paidBy}</span>
                  </div>
                  <div className="history-amt">
                    <span>${exp.amount.toFixed(2)}</span>
                    <button onClick={() => handleRemoveExpense(exp.id)} className="history-delete-btn">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .form-row-compact {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .btn-icon-only-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .people-badges-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .person-badge {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: var(--primary);
          padding: 0.25rem 0.5rem 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }
        .badge-delete {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          line-height: 1;
        }
        .section-divider-title {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1rem;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
        }
        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .results-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .splitter-sections-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 600px) {
          .splitter-sections-container {
            grid-template-columns: 1fr;
          }
        }
        .balances-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        .balance-item-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .balance-person-amt {
          font-weight: 600;
          color: var(--text-secondary);
        }
        .balance-person-amt.positive {
          color: #10b981;
        }
        .balance-person-amt.negative {
          color: #f43f5e;
        }
        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .payment-suggestion-card {
          padding: 0.75rem 1rem;
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .payment-arrow {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .payment-amt {
          color: var(--primary);
        }
        .all-settled-box {
          padding: 1.5rem;
          text-align: center;
          color: var(--text-muted);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .expenses-history-section {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.25rem;
        }
        .expenses-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
        }
        .history-expense-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .history-details {
          display: flex;
          flex-direction: column;
        }
        .history-details span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .history-amt {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }
        .history-delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .history-delete-btn:hover {
          color: #f43f5e;
        }
      `}</style>
    </div>
  );
}
