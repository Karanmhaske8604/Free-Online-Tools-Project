import React, { useState } from 'react';
import { Plus, Trash2, Printer, Percent } from 'lucide-react';

export default function GstCalculator() {
  const [company, setCompany] = useState('OptiSuite Billing');
  const [client, setClient] = useState('John Doe Corp');
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-001');
  const [taxRate, setTaxRate] = useState(18); // Default 18% GST
  const [items, setItems] = useState([
    { id: '1', name: 'Premium Development Services', price: 1500, qty: 1 },
    { id: '2', name: 'Cloud Infrastructure Setup', price: 450, qty: 2 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: 'New Billing Item',
        price: 100,
        qty: 1,
      },
    ]);
  };

  const handleUpdateItem = (id, key, val) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let finalVal = val;
        if (key === 'price') finalVal = parseFloat(val) || 0;
        if (key === 'qty') finalVal = parseInt(val) || 0;
        return { ...item, [key]: finalVal };
      })
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-split-layout invoice-tool-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Invoice Details</h3>
        
        <div className="form-group">
          <label className="form-label">Issuer / Company Name</label>
          <input
            type="text"
            className="glass-input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            className="glass-input"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Invoice Number</label>
          <input
            type="text"
            className="glass-input"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tax Rate (GST %)</label>
          <select
            className="glass-select"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          >
            <option value="0">0% (Exempt)</option>
            <option value="5">5% (GST)</option>
            <option value="12">12% (GST)</option>
            <option value="18">18% (GST)</option>
            <option value="28">28% (GST)</option>
          </select>
        </div>

        <button onClick={handlePrint} className="btn btn-primary w-full">
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      <div className="tool-results glass-panel invoice-sheet">
        <div className="invoice-header">
          <div className="issuer-details">
            <h2>{company}</h2>
            <span>Official Invoice / Tax Bill</span>
          </div>
          <div className="invoice-meta text-right">
            <div><strong>Invoice:</strong> {invoiceNo}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="invoice-bill-to">
          <strong>Bill To:</strong>
          <p>{client}</p>
        </div>

        <div className="item-table-wrapper">
          <table className="item-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Total ($)</th>
                <th className="text-center print-hide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      className="invoice-item-input"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    />
                  </td>
                  <td className="text-right w-100">
                    <input
                      type="number"
                      className="invoice-item-input text-right"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                    />
                  </td>
                  <td className="text-right w-80">
                    <input
                      type="number"
                      className="invoice-item-input text-right"
                      value={item.qty}
                      onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                    />
                  </td>
                  <td className="text-right font-semibold">
                    ${(item.price * item.qty).toFixed(2)}
                  </td>
                  <td className="text-center print-hide">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="invoice-delete-btn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-actions-row print-hide">
          <button onClick={handleAddItem} className="btn btn-secondary btn-sm">
            <Plus size={14} />
            Add Item
          </button>
        </div>

        <div className="invoice-summary-box">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>GST ({taxRate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row grand-total-row">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style>{`
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .font-semibold {
          font-weight: 600;
        }
        .w-100 {
          width: 100px;
        }
        .w-80 {
          width: 80px;
        }
        .invoice-sheet {
          padding: 2rem !important;
          background: rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .issuer-details h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }
        .issuer-details span {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
        .invoice-meta {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .invoice-bill-to {
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        .invoice-bill-to strong {
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .invoice-bill-to p {
          color: var(--text-primary);
          font-weight: 500;
        }
        .invoice-item-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          font-size: 0.9rem;
          padding: 0.25rem 0;
          border-bottom: 1px solid transparent;
        }
        .invoice-item-input:focus {
          border-bottom-color: var(--primary);
        }
        .invoice-delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
        }
        .invoice-delete-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .invoice-actions-row {
          margin-bottom: 1.5rem;
        }
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          border-radius: 6px;
        }
        .invoice-summary-box {
          align-self: flex-end;
          width: 250px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .grand-total-row {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--primary);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.5rem;
          margin-top: 0.25rem;
        }

        /* Print styles */
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #root {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .app-header, .candidate-card, .tool-controls, .invoice-actions-row, .app-footer, .print-hide {
            display: none !important;
          }
          .tool-split-layout {
            grid-template-columns: 1fr !important;
          }
          .invoice-sheet {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            color: black !important;
          }
          .invoice-header, .invoice-summary-box {
            border-color: #ddd !important;
          }
          .invoice-item-input {
            color: black !important;
          }
          .grand-total-row {
            color: black !important;
            border-color: #000 !important;
          }
          .issuer-details h2, .invoice-bill-to p {
            color: black !important;
          }
          .item-table th {
            background: #f5f5f5 !important;
            color: #333 !important;
          }
          .item-table td {
            border-bottom-color: #eee !important;
          }
        }
      `}</style>
    </div>
  );
}
