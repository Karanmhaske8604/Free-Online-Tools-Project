import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RefreshCw } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState('https://digitalheroesco.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const canvasRef = useRef(null);

  const generateQr = async () => {
    if (!canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text || ' ', {
        width: size,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQr();
  }, [text, fgColor, bgColor, size, margin]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>QR Configuration</h3>
        
        <div className="form-group">
          <label className="form-label">QR Content (Text or URL)</label>
          <textarea
            className="glass-textarea text-input"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type link or text to encode..."
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Foreground Color</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="color-input"
              />
              <span className="color-hex">{fgColor}</span>
            </div>
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Background Color</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="color-input"
              />
              <span className="color-hex">{bgColor}</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Size: {size}px x {size}px</label>
          <input
            type="range"
            min="128"
            max="512"
            step="16"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="quality-slider"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Quiet Zone Margin: {margin}</label>
          <input
            type="range"
            min="0"
            max="10"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
            className="quality-slider"
          />
        </div>

        <button onClick={handleDownload} className="btn btn-primary w-full">
          <Download size={16} />
          Download PNG
        </button>
      </div>

      <div className="tool-results glass-panel qr-results-panel">
        <h3>Live Preview</h3>
        <div className="qr-preview-box">
          <canvas ref={canvasRef} className="qr-canvas"></canvas>
          {!text && <span className="empty-qr-overlay">Enter text to see code</span>}
        </div>
      </div>

      <style>{`
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .flex-1 {
          flex: 1;
        }
        .text-input {
          resize: none;
        }
        .color-picker-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }
        .color-input {
          border: none;
          background: transparent;
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 4px;
        }
        .color-hex {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .qr-results-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .qr-preview-box {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-md);
          padding: 2rem;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .qr-canvas {
          max-width: 100%;
          border-radius: 4px;
        }
        .empty-qr-overlay {
          position: absolute;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
