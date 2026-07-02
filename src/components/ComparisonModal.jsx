import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, Info } from 'lucide-react';

export default function ComparisonModal({ image, onClose }) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1 || isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const pctSavings = image.compressedSize 
    ? Math.round(((image.size - image.compressedSize) / image.size) * 100)
    : 0;

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-area">
            <h3>Visual Comparison</h3>
            <span className="modal-filename">{image.name}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="comparison-meta-row">
            <div className="meta-box original">
              <span className="meta-label">Original File</span>
              <span className="meta-size">{formatSize(image.size)}</span>
            </div>
            <div className="savings-highlight">
              <span>Optimized Savings</span>
              <strong>{pctSavings}% Smaller</strong>
            </div>
            <div className="meta-box compressed">
              <span className="meta-label">Compressed File</span>
              <span className="meta-size">{formatSize(image.compressedSize)}</span>
            </div>
          </div>

          <div 
            className="slider-container"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
          >
            {/* Original Image (Left Side background) */}
            <div className="image-panel original-panel">
              <img src={image.previewUrl} alt="Original" className="comparison-image" />
              <div className="panel-tag tag-original">Original</div>
            </div>

            {/* Compressed Image (Right Side absolute clip) */}
            <div 
              className="image-panel compressed-panel"
              style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            >
              <img src={image.compressedPreviewUrl} alt="Compressed" className="comparison-image" />
              <div className="panel-tag tag-compressed">Compressed</div>
            </div>

            {/* Drag Handle Divider */}
            <div 
              className="slider-divider"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="slider-handle">
                <span className="handle-arrows">↔</span>
              </div>
            </div>
          </div>

          <div className="instruction-tip">
            <Info size={14} />
            <span>Drag the center divider to compare image quality and compression artifacts.</span>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(8, 9, 12, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .modal-container {
          width: 100%;
          max-width: 900px;
          background: rgba(22, 28, 45, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-title-area h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .modal-filename {
          font-size: 0.85rem;
          color: var(--text-secondary);
          word-break: break-all;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.12);
        }

        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .comparison-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
        }

        .meta-box {
          display: flex;
          flex-direction: column;
        }

        .meta-box.original {
          align-items: flex-start;
        }

        .meta-box.compressed {
          align-items: flex-end;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-size {
          font-size: 1rem;
          font-weight: 600;
        }

        .savings-highlight {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .savings-highlight span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .savings-highlight strong {
          color: #10b981;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: ew-resize;
          user-select: none;
        }

        .image-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comparison-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        .panel-tag {
          position: absolute;
          bottom: 1rem;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tag-original {
          left: 1rem;
          background: rgba(15, 23, 42, 0.6);
          color: var(--text-primary);
        }

        .tag-compressed {
          right: 1rem;
          background: rgba(16, 185, 129, 0.6);
          color: white;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .slider-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          pointer-events: none;
          z-index: 10;
        }

        .slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1.5px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .handle-arrows {
          color: var(--primary);
          font-weight: bold;
          font-size: 1rem;
        }

        .instruction-tip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .slider-container {
            height: 320px;
          }
          .comparison-meta-row {
            font-size: 0.9rem;
          }
          .savings-highlight strong {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
