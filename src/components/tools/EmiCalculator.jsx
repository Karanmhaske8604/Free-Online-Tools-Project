import React, { useState } from 'react';
import { Percent, DollarSign, Calendar } from 'lucide-react';

export default function EmiCalculator() {
  const [amount, setAmount] = useState(100000); // 100k principal
  const [rate, setRate] = useState(8.5); // 8.5% interest
  const [tenure, setTenure] = useState(15); // 15 years tenure
  const [tenureType, setTenureType] = useState('years'); // years or months

  // Calculate EMI
  const monthlyRate = rate / 12 / 100;
  const numberOfMonths = tenureType === 'years' ? tenure * 12 : tenure;

  const emi =
    numberOfMonths > 0 && monthlyRate > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
        (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
      : numberOfMonths > 0
      ? amount / numberOfMonths
      : 0;

  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - amount;

  const principalPercent = totalPayment > 0 ? (amount / totalPayment) * 100 : 100;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // SVG Circumference for Circle graph (radius = 50, C = 2 * pi * 50 = 314.159)
  const c = 314.159;
  const interestStrokeOffset = c - (interestPercent / 100) * c;

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Loan Details</h3>

        <div className="form-group">
          <label className="form-label">Loan Amount (Rs)</label>
          <div className="input-with-icon">
            <DollarSign className="input-inner-icon" size={16} />
            <input
              type="number"
              className="glass-input prefix-padding"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Interest Rate (% per annum)</label>
          <div className="input-with-icon">
            <Percent className="input-inner-icon" size={16} />
            <input
              type="number"
              step="0.1"
              className="glass-input prefix-padding"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Tenure</label>
            <input
              type="number"
              className="glass-input"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Unit</label>
            <select
              className="glass-select"
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value)}
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tool-results glass-panel emi-results-wrapper">
        <div className="results-header">
          <h3>EMI Breakdown</h3>
        </div>

        <div className="metrics-row">
          <div className="metric-block">
            <div className="metric-title">Monthly EMI</div>
            <div className="metric-value emi-highlight">${emi.toFixed(2)}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Total Interest</div>
            <div className="metric-value">${totalInterest.toFixed(2)}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Total Payable</div>
            <div className="metric-value">${totalPayment.toFixed(2)}</div>
          </div>
        </div>

        <div className="chart-and-legend-row">
          <div className="svg-chart-container">
            <svg width="150" height="150" viewBox="0 0 120 120" className="pie-chart-svg">
              {/* Background circle representing Principal */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth="16"
              />
              {/* Overlay circle representing Interest */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="16"
                strokeDasharray={c}
                strokeDashoffset={interestStrokeOffset}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="chart-center-label">
              <strong>Split</strong>
            </div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color principal"></span>
              <div className="legend-text">
                <span className="legend-label">Principal Amount</span>
                <span className="legend-percent">{principalPercent.toFixed(1)}%</span>
                <span className="legend-amt">${amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-color interest"></span>
              <div className="legend-text">
                <span className="legend-label">Total Interest</span>
                <span className="legend-percent">{interestPercent.toFixed(1)}%</span>
                <span className="legend-amt">${totalInterest.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-inner-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
        }
        .prefix-padding {
          padding-left: 2.25rem;
        }
        .emi-results-wrapper {
          display: flex;
          flex-direction: column;
        }
        .emi-highlight {
          color: var(--primary) !important;
          font-size: 1.5rem !important;
        }
        .chart-and-legend-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .svg-chart-container {
          position: relative;
          width: 150px;
          height: 150px;
        }
        .pie-chart-svg {
          transform: scale(1);
        }
        .chart-center-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .chart-center-label strong {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .legend-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }
        .legend-color.principal {
          background-color: #6366f1;
        }
        .legend-color.interest {
          background-color: #ec4899;
        }
        .legend-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .legend-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .legend-percent {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .legend-amt {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 0.15rem;
        }
      `}</style>
    </div>
  );
}
