import React from 'react';
import type { SaveVersion } from '../../types';

interface HomePageProps {
  onCreateNew: () => void;
  onLoadSaved: () => void;
  onImport: (file: File) => void;
  recentVersions: SaveVersion[];
  onLoadVersion: (v: SaveVersion) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onCreateNew, onLoadSaved, onImport, recentVersions, onLoadVersion,
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <main className="home-page">
      <div className="home-card">
        {/* Logo mark */}
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #003087, #00A3E0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 32px rgba(0,48,135,0.25)',
        }}>
          <span style={{ fontSize: '2rem' }}>🧠</span>
        </div>

        <div className="home-card__logo">Neurology AI Pulse</div>
        <div className="home-card__tagline">Professional Newsletter Builder for Clinical AI Research</div>

        <div className="home-card__actions">
          <button className="home-btn home-btn--primary" onClick={onCreateNew}>
            ✨ Create New Newsletter
          </button>
          <button className="home-btn home-btn--secondary" onClick={onLoadSaved}>
            📂 Load Last Autosave
          </button>
          <button className="home-btn home-btn--ghost" onClick={() => fileRef.current?.click()}>
            📥 Import Newsletter JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
            }}
          />
        </div>

        {recentVersions.length > 0 && (
          <div style={{ marginTop: 32, textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 10 }}>
              Recent Versions
            </div>
            {recentVersions.slice(0, 4).map(v => (
              <div
                key={v.id}
                onClick={() => onLoadVersion(v)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  marginBottom: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{v.label}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{new Date(v.savedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: '0.7rem', color: 'var(--color-muted)' }}>
          Northwell Health · Department of Neurology · AI Research Tools
        </div>
      </div>
    </main>
  );
};
