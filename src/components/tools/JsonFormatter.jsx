import React, { useState } from 'react';
import { FileCode, Play, Copy, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"OptiSuite","version":"1.0","private":true,"features":["image","pdf","json","qr"],"author":{"name":"Karan Mhaske","email":"karan.mhaske@gmail.com"}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError(null);
    setSuccess(null);
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setSuccess('Valid JSON! Beautifully formatted.');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    setError(null);
    setSuccess(null);
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setSuccess('Valid JSON! Successfully minified.');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const handleValidate = () => {
    setError(null);
    setSuccess(null);
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setSuccess('JSON is valid!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel json-input-side">
        <div className="json-title-row">
          <h3>Raw JSON Input</h3>
          <button onClick={handleClear} className="btn-text">Clear</button>
        </div>
        
        <textarea
          className="glass-textarea json-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste raw JSON here..."
        />

        <div className="json-actions-grid">
          <button onClick={handleFormat} className="btn btn-primary">
            <Play size={14} />
            Prettify
          </button>
          <button onClick={handleMinify} className="btn btn-secondary">
            Minify
          </button>
          <button onClick={handleValidate} className="btn btn-secondary">
            Validate
          </button>
        </div>

        {error && (
          <div className="validation-error-box glass-panel">
            <AlertCircle size={18} className="error-icon" />
            <div>
              <strong>Syntax Error:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="validation-success-box glass-panel">
            <CheckCircle size={18} className="success-icon" />
            <p>{success}</p>
          </div>
        )}
      </div>

      <div className="tool-results glass-panel json-output-side">
        <div className="json-title-row">
          <h3>Formatted Output</h3>
          {output && (
            <button onClick={handleCopy} className="btn btn-secondary btn-copy-json">
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        <textarea
          className="glass-textarea json-textarea output-area"
          readOnly
          value={output}
          placeholder="Formatted JSON will appear here..."
        />
      </div>

      <style>{`
        .json-input-side, .json-output-side {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 520px !important;
        }
        .json-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-text {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-text:hover {
          color: var(--primary);
        }
        .json-textarea {
          flex: 1;
          font-family: var(--mono, monospace) !important;
          font-size: 0.85rem !important;
          line-height: 1.4 !important;
          resize: none;
          background: rgba(8, 9, 12, 0.4) !important;
        }
        .output-area {
          background: rgba(8, 9, 12, 0.6) !important;
          color: #818cf8 !important;
          border-color: rgba(99, 102, 241, 0.15) !important;
        }
        .json-actions-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 0.5rem;
        }
        .validation-error-box {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(244, 63, 94, 0.05) !important;
          border-color: rgba(244, 63, 94, 0.2) !important;
          font-size: 0.8rem;
        }
        .error-icon {
          color: #f43f5e;
          flex-shrink: 0;
        }
        .validation-error-box strong {
          color: #f43f5e;
          display: block;
          margin-bottom: 0.15rem;
        }
        .validation-error-box p {
          color: var(--text-secondary);
        }
        .validation-success-box {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(16, 185, 129, 0.05) !important;
          border-color: rgba(16, 185, 129, 0.2) !important;
          font-size: 0.8rem;
        }
        .success-icon {
          color: #10b981;
        }
        .validation-success-box p {
          color: #10b981;
          font-weight: 500;
        }
        .btn-copy-json {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
