import React, { useState } from 'react';
import { Sparkles, Flame, ArrowLeft, LayoutGrid } from 'lucide-react';
import CandidateCard from './components/CandidateCard';
import Dashboard, { TOOLS_LIST } from './components/Dashboard';

// Import all 14 tools
import GstCalculator from './components/tools/GstCalculator';
import EmiCalculator from './components/tools/EmiCalculator';
import ImageCompressor from './components/tools/ImageCompressor';
import PdfMerger from './components/tools/PdfMerger';
import QrGenerator from './components/tools/QrGenerator';
import UnitConverter from './components/tools/UnitConverter';
import BillSplitter from './components/tools/BillSplitter';
import ResumeBuilder from './components/tools/ResumeBuilder';
import MetaGenerator from './components/tools/MetaGenerator';
import JsonFormatter from './components/tools/JsonFormatter';
import PasswordGen from './components/tools/PasswordGen';
import AgeCalc from './components/tools/AgeCalc';
import WordCounter from './components/tools/WordCounter';
import PaletteGenerator from './components/tools/PaletteGenerator';

export default function App() {
  const [currentTool, setCurrentTool] = useState('dashboard');

  const renderActiveTool = () => {
    switch (currentTool) {
      case 'gst-calculator':
        return <GstCalculator />;
      case 'emi-calculator':
        return <EmiCalculator />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'bill-splitter':
        return <BillSplitter />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'meta-generator':
        return <MetaGenerator />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'password-generator':
        return <PasswordGen />;
      case 'age-calculator':
        return <AgeCalc />;
      case 'word-counter':
        return <WordCounter />;
      case 'color-palette':
        return <PaletteGenerator />;
      default:
        return null;
    }
  };

  const activeToolMetadata = TOOLS_LIST.find((t) => t.id === currentTool);
  const ActiveToolIcon = activeToolMetadata ? activeToolMetadata.icon : null;

  return (
    <>
      <div className="ambient-glow glow-top-left"></div>
      <div className="ambient-glow glow-bottom-right"></div>

      <header className="app-header fade-in">
        <a href="#" className="logo-section" onClick={() => setCurrentTool('dashboard')}>
          <div className="app-logo">
            <Flame className="logo-icon-img" size={24} />
          </div>
          <div>
            <h1 className="app-title">Free Online Tools</h1>
            <p className="app-tagline">Dev & Design Utility Toolbox</p>
          </div>
        </a>
        <div className="badge-section">
          <span className="badge-tag">
            <Sparkles size={14} className="sparkle-icon" />
            14 Premium Tools
          </span>
        </div>
      </header>

      {/* Floating Candidate Card containing candidate details & Digital Heroes button */}
      <CandidateCard />

      <main className="main-content">
        {currentTool === 'dashboard' ? (
          <Dashboard onSelectTool={setCurrentTool} />
        ) : (
          <div className="tool-view-container">
            {/* Sidebar drawer to switch tools instantly */}
            <aside className="tool-sidebar glass-panel">
              <h4 className="sidebar-title">All Utility Tools</h4>
              <nav className="sidebar-menu">
                <button
                  onClick={() => setCurrentTool('dashboard')}
                  className="sidebar-item"
                >
                  <LayoutGrid size={16} />
                  <span>Dashboard</span>
                </button>
                {TOOLS_LIST.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setCurrentTool(tool.id)}
                      className={`sidebar-item ${currentTool === tool.id ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{tool.name}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Workspace for active tool */}
            <section className="tool-workspace">
              <div className="workspace-header">
                <div className="workspace-title-row">
                  {ActiveToolIcon && (
                    <div
                      className="workspace-icon"
                      style={{
                        backgroundColor: activeToolMetadata.color,
                        boxShadow: `0 4px 12px ${activeToolMetadata.color}30`,
                      }}
                    >
                      <ActiveToolIcon size={20} />
                    </div>
                  )}
                  <div>
                    <h2>{activeToolMetadata?.name}</h2>
                    <p className="tool-desc">{activeToolMetadata?.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTool('dashboard')}
                  className="btn btn-secondary btn-sm print-hide"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>

              {renderActiveTool()}
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer print-hide">
        <p>&copy; {new Date().getFullYear()} FreeTools. All rights reserved.</p>
        <p className="footer-candidate">Developed by Karan Mhaske | karanmhaske3050@gmail.com</p>
      </footer>
    </>
  );
}
