import React from 'react';
import { Download, Trash2, Eye, Loader, CheckCircle, Percent } from 'lucide-react';

export default function ImageCard({
  image,
  onRemove,
  onDownload,
  onOpenPreview,
}) {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getSavings = () => {
    if (!image.compressedSize) return null;
    const diff = image.size - image.compressedSize;
    const pct = Math.round((diff / image.size) * 100);
    return pct > 0 ? `${pct}%` : '0%';
  };

  return (
    <div className="image-card glass-panel fade-in">
      <div className="thumbnail-container">
        <img src={image.previewUrl} alt={image.name} className="image-thumbnail" />
      </div>

      <div className="image-details">
        <h4 className="image-filename" title={image.name}>
          {image.name}
        </h4>
        <div className="size-info-row">
          <span className="size-badge original-size">
            {formatSize(image.size)}
          </span>
          {image.status === 'success' && (
            <>
              <span className="arrow-separator">→</span>
              <span className="size-badge compressed-size">
                {formatSize(image.compressedSize)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="status-and-savings">
        {image.status === 'pending' && (
          <span className="status-badge pending">Ready</span>
        )}
        {image.status === 'processing' && (
          <span className="status-badge processing">
            <Loader className="spin-loader" size={14} />
            Optimizing
          </span>
        )}
        {image.status === 'success' && (
          <div className="savings-badge-wrapper">
            <span className="savings-badge">
              -{getSavings()}
            </span>
            <CheckCircle className="status-icon-check" size={14} />
          </div>
        )}
      </div>

      <div className="card-actions">
        {image.status === 'success' && (
          <button
            onClick={() => onOpenPreview(image)}
            className="card-action-btn view"
            title="Compare Before/After"
          >
            <Eye size={16} />
          </button>
        )}
        <button
          onClick={() => onDownload(image)}
          disabled={image.status !== 'success'}
          className="card-action-btn download"
          title="Download optimized"
        >
          <Download size={16} />
        </button>
        <button
          onClick={() => onRemove(image.id)}
          className="card-action-btn delete"
          title="Remove image"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <style>{`
        .image-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem;
          background: rgba(17, 24, 39, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s ease;
        }

        .image-card:hover {
          background: rgba(17, 24, 39, 0.4);
          border-color: rgba(99, 102, 241, 0.15);
        }

        .thumbnail-container {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .image-filename {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .size-info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .size-badge {
          font-weight: 500;
        }

        .original-size {
          color: var(--text-secondary);
        }

        .compressed-size {
          color: #10b981;
          font-weight: 600;
        }

        .arrow-separator {
          color: var(--text-muted);
        }

        .status-and-savings {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.pending {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .status-badge.processing {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .spin-loader {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .savings-badge-wrapper {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .savings-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-icon-check {
          color: #10b981;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .card-action-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-action-btn:hover:not(:disabled) {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .card-action-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .card-action-btn.view:hover {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .card-action-btn.download:hover:not(:disabled) {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .card-action-btn.delete:hover {
          color: #f43f5e;
          background: rgba(244, 63, 94, 0.1);
          border-color: rgba(244, 63, 94, 0.2);
        }

        @media (max-width: 600px) {
          .image-card {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1.25rem;
          }

          .thumbnail-container {
            align-self: center;
            width: 70px;
            height: 70px;
          }

          .image-details {
            text-align: center;
          }

          .size-info-row {
            justify-content: center;
          }

          .status-and-savings {
            align-self: center;
          }

          .card-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
