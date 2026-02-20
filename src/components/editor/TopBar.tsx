import React from 'react';
import type { Newsletter } from '../../types';

interface TopBarProps {
  newsletter: Newsletter;
  onSaveVersion: () => void;
  onExportHTML: () => void;
  onExportPDF: () => void;
  onGoHome: () => void;
  lastSaved?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  newsletter, onSaveVersion, onExportHTML, onExportPDF, onGoHome, lastSaved,
}) => (
  <header className="topbar" role="banner">
    <button
      onClick={onGoHome}
      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', padding: 0, opacity: 0.7 }}
      title="Back to home"
      aria-label="Back to home"
    >
      ← 
    </button>
    <div>
      <div className="topbar__logo">Neurology AI Pulse</div>
      <div className="topbar__meta">{newsletter.meta.title} · Issue {newsletter.meta.issueNumber}</div>
    </div>
    <div className="topbar__spacer" />
    {lastSaved && (
      <span style={{ fontSize: '0.72rem', opacity: 0.5, marginRight: 8 }}>
        Saved {new Date(lastSaved).toLocaleTimeString()}
      </span>
    )}
    <button className="topbar__btn" onClick={onSaveVersion}>💾 Save Version</button>
    <button className="topbar__btn" onClick={onExportHTML}>📄 HTML</button>
    <button className="topbar__btn topbar__btn--primary" onClick={onExportPDF}>🖨️ PDF</button>
  </header>
);
