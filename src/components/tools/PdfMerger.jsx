import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, UploadCloud, Trash2, ArrowUp, ArrowDown, Download, CheckCircle, Loader } from 'lucide-react';

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .filter((file) => file.type === 'application/pdf')
        .map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
        }));
      setFiles((prev) => [...prev, ...newFiles]);
      setMergedPdfUrl(null);
    }
  };

  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedPdfUrl(null);
  };

  const moveFile = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[nextIndex];
    newFiles[nextIndex] = temp;
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('PDF Merge Error:', error);
      alert('Error merging PDFs. Please check if any file is corrupted or password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdfUrl) return;
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`;
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>PDF Settings</h3>
        <p className="sidebar-description">Select and order the PDF files you wish to merge.</p>
        
        <div className="upload-container">
          <input
            type="file"
            id="pdf-upload"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
          <label htmlFor="pdf-upload" className="pdf-upload-box">
            <UploadCloud size={28} />
            <span>Upload PDFs</span>
          </label>
        </div>

        <button
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
          className="btn btn-primary w-full"
        >
          {isProcessing ? (
            <>
              <Loader className="spin-loader" size={16} />
              Merging Files...
            </>
          ) : (
            'Merge PDFs'
          )}
        </button>

        {mergedPdfUrl && (
          <button onClick={handleDownload} className="btn btn-success w-full">
            <Download size={16} />
            Download Merged PDF
          </button>
        )}
      </div>

      <div className="tool-results glass-panel">
        <div className="results-header">
          <h3>Files Queue ({files.length})</h3>
        </div>

        <div className="pdf-files-list">
          {files.map((file, index) => (
            <div key={file.id} className="pdf-file-row">
              <div className="pdf-icon">
                <FileText size={20} />
              </div>
              <div className="pdf-details">
                <span className="pdf-name" title={file.name}>{file.name}</span>
                <span className="pdf-size">{formatSize(file.size)}</span>
              </div>
              <div className="pdf-actions">
                <button
                  onClick={() => moveFile(index, -1)}
                  disabled={index === 0}
                  className="pdf-action-btn"
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveFile(index, 1)}
                  disabled={index === files.length - 1}
                  className="pdf-action-btn"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => handleRemove(file.id)}
                  className="pdf-action-btn delete"
                  title="Remove File"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {files.length === 0 && (
            <div className="empty-files-placeholder">
              <FileText size={48} className="empty-icon" />
              <p>No PDF files uploaded yet.</p>
              <span>Upload at least 2 files to combine them.</span>
            </div>
          )}

          {mergedPdfUrl && (
            <div className="merge-success-banner glass-panel">
              <CheckCircle size={28} className="success-icon" />
              <div>
                <h4>PDF Merged Successfully!</h4>
                <span>All documents have been merged into a single PDF. Click download to save it.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-description {
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }
        .upload-container {
          position: relative;
          margin-bottom: 1rem;
        }
        .pdf-upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-sm);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s ease;
        }
        .pdf-upload-box:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }
        .pdf-files-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .pdf-file-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
        }
        .pdf-icon {
          color: #ef4444;
        }
        .pdf-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .pdf-name {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pdf-size {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .pdf-actions {
          display: flex;
          gap: 0.25rem;
        }
        .pdf-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pdf-action-btn:hover:not(:disabled) {
          color: white;
          background: rgba(255, 255, 255, 0.08);
        }
        .pdf-action-btn.delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }
        .pdf-action-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .empty-files-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .empty-files-placeholder span {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .merge-success-banner {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(16, 185, 129, 0.05) !important;
          border-color: rgba(16, 185, 129, 0.2) !important;
          margin-top: 1.5rem;
        }
        .success-icon {
          color: #10b981;
          flex-shrink: 0;
        }
        .merge-success-banner h4 {
          color: #10b981;
          font-size: 1rem;
          margin-bottom: 0.15rem;
        }
        .merge-success-banner span {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .spin-loader {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
