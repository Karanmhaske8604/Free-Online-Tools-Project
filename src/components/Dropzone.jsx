import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function Dropzone({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const processFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return (
    <div
      className={`dropzone-container glass-panel fade-in ${
        isDragActive ? 'drag-active' : ''
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="image-file-input"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden-file-input"
      />
      <label htmlFor="image-file-input" className="dropzone-label">
        <div className="upload-icon-wrapper">
          <UploadCloud className="upload-icon" size={48} />
        </div>
        <h2 className="dropzone-title">Optimize Your Images</h2>
        <p className="dropzone-subtitle">
          Drag and drop your JPEG, PNG, or WebP files here, or{' '}
          <span className="browse-text">browse files</span>
        </p>
        <div className="formats-badge-container">
          <span className="format-badge">PNG</span>
          <span className="format-badge">JPEG</span>
          <span className="format-badge">WebP</span>
          <span className="format-badge">GIF</span>
        </div>
        <p className="dropzone-limit-text">100% Secure & Local - Images never leave your device.</p>
      </label>

      <style>{`
        .dropzone-container {
          position: relative;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          background: rgba(17, 24, 39, 0.3);
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .dropzone-container:hover, .dropzone-container.drag-active {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.04);
          box-shadow: var(--shadow-glow);
        }

        .hidden-file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }

        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .upload-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .dropzone-container:hover .upload-icon-wrapper,
        .dropzone-container.drag-active .upload-icon-wrapper {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-5px);
        }

        .upload-icon {
          transition: transform 0.3s ease;
        }

        .dropzone-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .dropzone-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .browse-text {
          color: var(--primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .formats-badge-container {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .format-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .dropzone-limit-text {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
