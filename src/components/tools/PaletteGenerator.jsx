import React, { useState, useEffect } from 'react';
import { Palette, Lock, Unlock, Copy, Check, RefreshCw } from 'lucide-react';

export default function PaletteGenerator() {
  const [colors, setColors] = useState([
    { hex: '#6366f1', locked: false },
    { hex: '#a855f7', locked: false },
    { hex: '#ec4899', locked: false },
    { hex: '#10b981', locked: false },
    { hex: '#0f172a', locked: false },
  ]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [cssCopied, setCssCopied] = useState(false);

  // Convert HSL to Hex helper
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = () => {
    // Generate a random base hue
    const baseHue = Math.floor(Math.random() * 360);
    
    // Aesthetic scheme definitions
    const schemes = [
      // Analogous + complementary accents
      [
        { h: baseHue, s: 75, l: 55 },
        { h: (baseHue + 30) % 360, s: 70, l: 50 },
        { h: (baseHue + 60) % 360, s: 65, l: 45 },
        { h: (baseHue + 180) % 360, s: 80, l: 60 },
        { h: baseHue, s: 30, l: 15 },
      ],
      // Monochromatic
      [
        { h: baseHue, s: 60, l: 90 },
        { h: baseHue, s: 65, l: 70 },
        { h: baseHue, s: 70, l: 50 },
        { h: baseHue, s: 75, l: 30 },
        { h: baseHue, s: 80, l: 15 },
      ],
      // Triadic
      [
        { h: baseHue, s: 70, l: 50 },
        { h: (baseHue + 120) % 360, s: 65, l: 55 },
        { h: (baseHue + 240) % 360, s: 65, l: 55 },
        { h: baseHue, s: 40, l: 85 },
        { h: baseHue, s: 50, l: 20 },
      ]
    ];

    const chosenScheme = schemes[Math.floor(Math.random() * schemes.length)];

    setColors((prev) =>
      prev.map((c, idx) => {
        if (c.locked) return c;
        const hsl = chosenScheme[idx];
        return {
          hex: hslToHex(hsl.h, hsl.s, hsl.l),
          locked: false,
        };
      })
    );
  };

  // Listen for Spacebar key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors]);

  const toggleLock = (index) => {
    setColors((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const handleCopyColor = (hex, index) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateCssVariables = () => {
    return `:root {
  --color-primary: ${colors[0].hex};
  --color-secondary: ${colors[1].hex};
  --color-accent: ${colors[2].hex};
  --color-light: ${colors[3].hex};
  --color-dark: ${colors[4].hex};
}`;
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(generateCssVariables());
    setCssCopied(true);
    setTimeout(() => setCssCopied(false), 2000);
  };

  return (
    <div className="tool-split-layout palette-tool-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Palette Options</h3>
        <p className="sidebar-description">Click spacebar to randomize palettes. Lock colors to keep them.</p>

        <button onClick={generatePalette} className="btn btn-primary w-full mb-3">
          <RefreshCw size={14} />
          Generate New
        </button>

        <button onClick={handleCopyCss} className="btn btn-secondary w-full">
          {cssCopied ? <Check size={14} /> : <Copy size={14} />}
          Copy CSS Variables
        </button>

        <div className="css-preview-box">
          <h4>CSS Code Snippet</h4>
          <pre className="css-snippet">
            <code>{generateCssVariables()}</code>
          </pre>
        </div>
      </div>

      <div className="tool-results glass-panel palette-display-side">
        <h3>Colors Palette</h3>
        <div className="palette-blocks-container">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className="color-block"
              style={{ backgroundColor: c.hex }}
            >
              <div className="color-block-overlay">
                <button onClick={() => toggleLock(idx)} className="overlay-btn lock-btn">
                  {c.locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
                <button
                  onClick={() => handleCopyColor(c.hex, idx)}
                  className="overlay-btn copy-hex-btn"
                >
                  {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <div className="color-hex-label">{c.hex.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="spacebar-hint">Press [Spacebar] on your keyboard to instantly generate a new scheme.</div>
      </div>

      <style>{`
        .mb-3 {
          margin-bottom: 0.75rem;
        }
        .css-preview-box {
          margin-top: 1.5rem;
          text-align: left;
        }
        .css-preview-box h4 {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .css-snippet {
          background: rgba(8, 9, 12, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--mono);
          font-size: 0.8rem;
          color: #818cf8;
          line-height: 1.4;
        }
        .palette-display-side {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .palette-blocks-container {
          flex: 1;
          display: flex;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 600px) {
          .palette-blocks-container {
            flex-direction: column;
            height: 500px;
          }
        }
        .color-block {
          flex: 1;
          position: relative;
          transition: all 0.15s ease;
        }
        .color-block-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          transition: opacity 0.2s ease;
          cursor: pointer;
        }
        .color-block:hover .color-block-overlay {
          opacity: 1;
        }
        .overlay-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .overlay-btn:hover {
          background: white;
          color: black;
          transform: scale(1.1);
        }
        .color-hex-label {
          font-family: var(--font-display);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          margin-top: 0.5rem;
        }
        .spacebar-hint {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
