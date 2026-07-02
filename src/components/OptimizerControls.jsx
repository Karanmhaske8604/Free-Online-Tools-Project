import React from 'react';
import { Settings, Download, Trash2, Zap } from 'lucide-react';

export default function OptimizerControls({
  options,
  setOptions,
  onOptimizeAll,
  onDownloadAll,
  onClearAll,
  hasImages,
  hasCompressed,
  isProcessing,
}) {
  const handleFormatChange = (e) => {
    setOptions((prev) => ({ ...prev, format: e.target.value }));
  };

  const handleQualityChange = (e) => {
    setOptions((prev) => ({ ...prev, quality: parseInt(e.target.value) }));
  };

  const handleScaleChange = (scale) => {
    setOptions((prev) => ({ ...prev, scale }));
  };

  const getQualityLabel = (q) => {
    if (q >= 90) return 'Maximum Quality (Large File)';
    if (q >= 75) return 'Recommended balance (Standard)';
    if (q >= 50) return 'High Compression (Smaller File)';
    return 'Extreme Compression (Low Quality)';
  };

  return (
    <div className="controls-panel glass-panel fade-in">
      <div className="panel-header">
        <Settings className="header-icon" size={20} />
        <h2>Optimization Settings</h2>
      </div>

      <div className="controls-group">
        <label className="control-label">Output Format</label>
        <div className="format-selector">
          <select
            value={options.format}
            onChange={handleFormatChange}
            className="glass-input format-select"
            disabled={!hasImages}
          >
            <option value="original">Keep Original Format</option>
            <option value="webp">Convert to WebP (Recommended)</option>
            <option value="jpeg">Convert to JPEG</option>
            <option value="png">Convert to PNG</option>
          </select>
        </div>
      </div>

      <div className="controls-group">
        <div className="label-row">
          <label className="control-label">Compression Quality</label>
          <span className="quality-value">{options.quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={options.quality}
          onChange={handleQualityChange}
          disabled={!hasImages || options.format === 'png'}
          className="quality-slider"
        />
        <div className="slider-label">
          {options.format === 'png'
            ? 'Lossless compression (Quality slider inactive)'
            : getQualityLabel(options.quality)}
        </div>
      </div>

      <div className="controls-group">
        <label className="control-label">Resize/Scale Image</label>
        <div className="scale-buttons">
          {[25, 50, 75, 100].map((s) => (
            <button
              key={s}
              type="button"
              className={`scale-btn ${options.scale === s ? 'active' : ''}`}
              onClick={() => handleScaleChange(s)}
              disabled={!hasImages}
            >
              {s === 100 ? 'Original (100%)' : `${s}%`}
            </button>
          ))}
        </div>
      </div>

      <div className="actions-section">
        <button
          onClick={onOptimizeAll}
          disabled={!hasImages || isProcessing}
          className="btn btn-primary w-full"
        >
          <Zap size={16} />
          {isProcessing ? 'Optimizing...' : 'Optimize Images'}
        </button>

        <div className="secondary-actions">
          <button
            onClick={onDownloadAll}
            disabled={!hasCompressed}
            className="btn btn-success flex-1"
          >
            <Download size={16} />
            Download All
          </button>
          <button
            onClick={onClearAll}
            disabled={!hasImages}
            className="btn btn-secondary btn-icon-only"
            title="Clear list"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .controls-panel {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: fit-content;
          background: rgba(17, 24, 39, 0.4);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .header-icon {
          color: var(--primary);
        }

        .panel-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .controls-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-label {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quality-value {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--primary);
        }

        .format-select {
          width: 100%;
          cursor: pointer;
        }

        .slider-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .scale-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .scale-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          padding: 0.5rem 0.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .scale-btn:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .scale-btn.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .scale-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .actions-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .w-full {
          width: 100%;
        }

        .secondary-actions {
          display: flex;
          gap: 0.5rem;
        }

        .flex-1 {
          flex: 1;
        }

        .btn-icon-only {
          padding: 0.75rem;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .controls-panel {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
