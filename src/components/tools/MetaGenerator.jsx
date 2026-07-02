import React, { useState } from 'react';
import { Copy, Check, Tags, Eye } from 'lucide-react';

export default function MetaGenerator() {
  const [title, setTitle] = useState('OptiSuite | Premium Free Developer Tools');
  const [desc, setDesc] = useState('An all-in-one developer toolbox featuring GST calculator, EMI calculator, PDF merger, QR code generator, image compressor, and 9 other helpful client-side utilities.');
  const [url, setUrl] = useState('https://optisuite.vercel.app');
  const [image, setImage] = useState('https://optisuite.vercel.app/og-cover.png');
  const [keywords, setKeywords] = useState('dev tools, invoice generator, pdf merge, image compressor');
  const [author, setAuthor] = useState('Karan Mhaske');
  const [copied, setCopied] = useState(false);

  const generateMetaHtml = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMetaHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel meta-inputs-column">
        <h3>Meta Parameters</h3>
        
        <div className="form-group">
          <label className="form-label">Page Title</label>
          <input type="text" className="glass-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Meta Description</label>
          <textarea className="glass-textarea" rows="3" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Site URL</label>
          <input type="text" className="glass-input" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">OG Image URL</label>
          <input type="text" className="glass-input" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Keywords</label>
            <input type="text" className="glass-input" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Author</label>
            <input type="text" className="glass-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="tool-results glass-panel meta-outputs-column">
        <div className="tab-header-row">
          <h3>SEO Previews & HTML</h3>
        </div>

        <div className="preview-section google-preview">
          <h4>Google Search Preview</h4>
          <div className="google-card">
            <div className="google-url">{url}</div>
            <div className="google-title">{title}</div>
            <div className="google-desc">{desc.substring(0, 155)}...</div>
          </div>
        </div>

        <div className="preview-section social-preview">
          <h4>Social Media Share Card</h4>
          <div className="social-card">
            <div className="social-card-img" style={{ backgroundImage: `url(${image})` }}>
              {!image && <span className="image-placeholder">OG Cover Image</span>}
            </div>
            <div className="social-card-details">
              <span className="social-domain">{url.replace('https://', '').replace('http://', '').split('/')[0]}</span>
              <strong className="social-title">{title}</strong>
              <p className="social-desc">{desc.substring(0, 110)}...</p>
            </div>
          </div>
        </div>

        <div className="html-output-section">
          <div className="section-title-row">
            <h4>Generated HTML Snippet</h4>
            <button onClick={handleCopy} className="btn btn-secondary btn-sm btn-copy-meta">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="html-block">
            <code>{generateMetaHtml()}</code>
          </pre>
        </div>
      </div>

      <style>{`
        .meta-inputs-column {
          max-height: 80vh;
          overflow-y: auto;
        }
        .meta-outputs-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .preview-section h4 {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .google-card {
          background: #ffffff;
          color: #202124;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
          font-family: Arial, sans-serif;
          text-align: left;
        }
        .google-url {
          font-size: 12px;
          color: #202124;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .google-title {
          font-size: 20px;
          color: #1a0dab;
          text-decoration: none;
          line-height: 1.3;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .google-title:hover {
          text-decoration: underline;
        }
        .google-desc {
          font-size: 14px;
          color: #4d5156;
          line-height: 1.58;
          word-wrap: break-word;
        }
        .social-card {
          max-width: 450px;
          background: #242526;
          border: 1px solid #3e4042;
          border-radius: 8px;
          overflow: hidden;
          font-family: Helvetica, Arial, sans-serif;
          text-align: left;
        }
        .social-card-img {
          height: 200px;
          background-size: cover;
          background-position: center;
          background-color: #18191a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-placeholder {
          color: #8a8d91;
          font-size: 0.85rem;
        }
        .social-card-details {
          padding: 0.75rem 1rem;
          border-top: 1px solid #3e4042;
          background: #242526;
        }
        .social-domain {
          font-size: 12px;
          color: #b0b3b8;
          text-transform: uppercase;
          display: block;
          margin-bottom: 2px;
        }
        .social-title {
          font-size: 16px;
          color: #e4e6eb;
          display: block;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .social-desc {
          font-size: 14px;
          color: #b0b3b8;
          line-height: 1.3;
        }
        .html-output-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-copy-meta {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          border-radius: 6px;
        }
        .html-block {
          background: rgba(8, 9, 12, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: var(--radius-sm);
          overflow-x: auto;
          font-family: var(--mono);
          font-size: 0.8rem;
          color: #a7f3d0;
          text-align: left;
          line-height: 1.4;
          max-height: 250px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
