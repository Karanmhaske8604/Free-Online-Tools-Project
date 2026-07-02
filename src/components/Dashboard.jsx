import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Percent,
  Image,
  QrCode,
  ArrowLeftRight,
  Users,
  FileUser,
  Tags,
  FileCode,
  Key,
  Calendar,
  FileText,
  Palette,
  Search,
} from 'lucide-react';

export const TOOLS_LIST = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    desc: 'Compress and optimize JPEG, PNG, and WebP images client-side with quality and scale control.',
    icon: Image,
    color: '#6366f1',
    tags: ['image', 'compress', 'webp', 'png', 'jpeg', 'optimize', 'media'],
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    desc: 'Combine multiple PDF documents into a single PDF file directly in your browser.',
    icon: FileText,
    color: '#a855f7',
    tags: ['pdf', 'merge', 'combine', 'join', 'files'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    desc: 'Generate customized QR codes with colors, dynamic values, and PNG/SVG download support.',
    icon: QrCode,
    color: '#10b981',
    tags: ['qr', 'barcode', 'code', 'link', 'generate'],
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    desc: 'Prettify, minify, validate, and debug JSON structures with real-time error reports.',
    icon: FileCode,
    color: '#f59e0b',
    tags: ['json', 'format', 'pretty', 'validate', 'syntax', 'code'],
  },
  {
    id: 'gst-calculator',
    name: 'GST & Invoice Calculator',
    desc: 'Generate tax-compliant GST invoices, calculate totals, and print or download custom receipts.',
    icon: FileSpreadsheet,
    color: '#06b6d4',
    tags: ['calculator', 'gst', 'tax', 'invoice', 'billing', 'finance'],
  },
  {
    id: 'emi-calculator',
    name: 'EMI / Loan Calculator',
    desc: 'Calculate monthly loan repayments, interest rates, tenure splits, and view interest vs principal charts.',
    icon: Percent,
    color: '#ec4899',
    tags: ['loan', 'repayments', 'emi', 'finance', 'mortgage', 'interest'],
  },
  {
    id: 'bill-splitter',
    name: 'Split the Bill',
    desc: 'Divide group expenses and bills among friends. Calculates who owes whom in seconds.',
    icon: Users,
    color: '#3b82f6',
    tags: ['split', 'bill', 'expense', 'debt', 'group', 'share'],
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    desc: 'Build a professional CV with simple forms and print or export it directly to PDF.',
    icon: FileUser,
    color: '#8b5cf6',
    tags: ['cv', 'resume', 'builder', 'career', 'job', 'portfolio'],
  },
  {
    id: 'unit-converter',
    name: 'Unit & Currency Converter',
    desc: 'Convert length, weight, temperature, area, and major baseline exchange rates.',
    icon: ArrowLeftRight,
    color: '#14b8a6',
    tags: ['convert', 'unit', 'currency', 'money', 'exchange', 'metrics'],
  },
  {
    id: 'meta-generator',
    name: 'Meta-Tag Generator',
    desc: 'Generate HTML meta tags for SEO, Facebook OpenGraph, and Twitter Cards with real-time previews.',
    icon: Tags,
    color: '#ef4444',
    tags: ['seo', 'meta', 'html', 'tags', 'opengraph', 'search'],
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    desc: 'Generate strong, customizable passwords with length filters and visual strength tests.',
    icon: Key,
    color: '#22c55e',
    tags: ['password', 'security', 'generator', 'safe', 'hash'],
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    desc: 'Calculate exact age in years, months, days, and seconds, and count down to your next birthday.',
    icon: Calendar,
    color: '#f97316',
    tags: ['age', 'birthday', 'time', 'date', 'calculator'],
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    desc: 'Count characters, words, sentences, reading speeds, and density frequencies of text.',
    icon: FileText,
    color: '#06b6d4',
    tags: ['counter', 'words', 'characters', 'reading', 'text', 'seo'],
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    desc: 'Generate aesthetic color palettes, lock matching shades, and copy CSS/Hex codes.',
    icon: Palette,
    color: '#84cc16',
    tags: ['palette', 'color', 'theme', 'designer', 'hex', 'css'],
  },
];

export default function Dashboard({ onSelectTool }) {
  const [search, setSearch] = useState('');

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const query = search.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.includes(query))
    );
  });

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-title-row">
        <h2>Developer & Utility Toolbox</h2>
        <p>14 high-performance client-side utility tools. Fully private, running entirely in your browser.</p>
      </div>

      <div className="search-bar-container">
        <Search className="search-icon-input" size={18} />
        <input
          type="text"
          placeholder="Search tools (e.g. GST, PDF, password, convert...)"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="dashboard-grid">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="tool-card glass-panel"
            >
              <div
                className="tool-icon-wrapper"
                style={{ backgroundColor: tool.color, boxShadow: `0 4px 12px ${tool.color}40` }}
              >
                <Icon size={22} />
              </div>
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-desc">{tool.desc}</p>
            </div>
          );
        })}
        {filteredTools.length === 0 && (
          <div className="no-results-panel glass-panel">
            <p>No tools matched your search query. Try searching for "PDF", "calculator", or "image".</p>
          </div>
        )}
      </div>

      <style>{`
        .no-results-panel {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
