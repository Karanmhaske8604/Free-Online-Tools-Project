import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, ShieldAlert } from 'lucide-react';

export default function PasswordGen() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charPool = '';
    if (includeUpper) charPool += upperChars;
    if (includeLower) charPool += lowerChars;
    if (includeNumber) charPool += numChars;
    if (includeSymbol) charPool += symbolChars;

    if (!charPool) {
      setPassword('');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charPool.length);
      generated += charPool[idx];
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumber, includeSymbol]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthScore = () => {
    if (!password) return { label: 'Empty', score: 0, color: '#64748b' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 14) score += 1;
    if (includeUpper && /[A-Z]/.test(password)) score += 1;
    if (includeLower && /[a-z]/.test(password)) score += 1;
    if (includeNumber && /[0-9]/.test(password)) score += 1;
    if (includeSymbol && /[^A-Za-z0-9]/.test(password)) score += 1;

    // Normalise to 1-4 scale
    let rating = 1;
    if (score >= 5) rating = 4; // Strong
    else if (score >= 4) rating = 3; // Good
    else if (score >= 3) rating = 2; // Fair
    else rating = 1; // Weak

    const ratings = [
      { label: 'Weak', score: 25, color: '#f43f5e' },
      { label: 'Fair', score: 50, color: '#f59e0b' },
      { label: 'Good', score: 75, color: '#3b82f6' },
      { label: 'Strong', score: 100, color: '#10b981' },
    ];
    return ratings[rating - 1];
  };

  const strength = getStrengthScore();

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Rules & Rules</h3>
        
        <div className="form-group">
          <label className="form-label">Password Length: {length}</label>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="quality-slider"
          />
        </div>

        <div className="checkbox-options-list">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="glass-checkbox"
            />
            <span>Include Uppercase (A-Z)</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="glass-checkbox"
            />
            <span>Include Lowercase (a-z)</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={includeNumber}
              onChange={(e) => setIncludeNumber(e.target.checked)}
              className="glass-checkbox"
            />
            <span>Include Numbers (0-9)</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={includeSymbol}
              onChange={(e) => setIncludeSymbol(e.target.checked)}
              className="glass-checkbox"
            />
            <span>Include Special Symbols (!@#$)</span>
          </label>
        </div>

        <button onClick={generatePassword} className="btn btn-secondary w-full">
          <Key size={14} />
          Regenerate Password
        </button>
      </div>

      <div className="tool-results glass-panel password-results-panel">
        <h3>Generated Password</h3>

        <div className="password-display-box glass-panel">
          <div className="password-text" title={password}>
            {password || <span className="empty-password">Select rules to generate</span>}
          </div>
          <button onClick={handleCopy} disabled={!password} className="btn btn-primary btn-copy-pw">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {password && (
          <div className="strength-analysis-container">
            <div className="strength-header">
              <span>Strength Rating:</span>
              <strong style={{ color: strength.color }}>{strength.label}</strong>
            </div>

            <div className="strength-meter-bar-bg">
              <div
                className="strength-meter-bar-fill"
                style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
              ></div>
            </div>

            <div className="strength-tips">
              <ShieldAlert size={14} className="alert-icon" />
              <span>
                {length < 8 && 'Increase length above 8 to make it more secure. '}
                {(!includeSymbol || !includeNumber) && 'Add symbols and numbers for extra entropy.'}
                {length >= 14 && includeSymbol && includeNumber && 'Excellent choice! This password will take centuries to crack.'}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .checkbox-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .glass-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          outline: none;
          cursor: pointer;
          accent-color: var(--primary);
        }
        .password-results-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .password-display-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(8, 9, 12, 0.4) !important;
          border-color: rgba(99, 102, 241, 0.2) !important;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          min-height: 60px;
        }
        .password-text {
          font-family: var(--mono);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          word-break: break-all;
          overflow: hidden;
          padding-right: 1rem;
        }
        .empty-password {
          color: var(--text-muted);
          font-size: 1.1rem;
          font-weight: normal;
        }
        .btn-copy-pw {
          width: 44px;
          height: 44px;
          padding: 0;
          flex-shrink: 0;
          border-radius: 50%;
        }
        .strength-analysis-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
        }
        .strength-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        .strength-meter-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .strength-meter-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        .strength-tips {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .alert-icon {
          flex-shrink: 0;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
