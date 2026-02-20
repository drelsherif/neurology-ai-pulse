import React from 'react';
import type { Newsletter, BlockType, ThemePreset, EditorState, Block } from '../../types';
import { BLOCK_LABELS } from '../../data/defaults';
import { THEMES, THEME_LABELS } from '../../data/themes';

interface SidebarProps {
  newsletter: Newsletter;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  onAddBlock: (type: BlockType) => void;
  onThemeChange: (preset: ThemePreset | Partial<Newsletter['theme']>) => void;
  onUpdateMeta: (updates: Partial<Newsletter['meta']>) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  versions: any[];
  onSaveVersion: () => void;
  onLoadVersion: (v: any) => void;
  onDeleteVersion: (id: string) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onExportHTML: () => void;
  onExportPDF: () => void;
}

const BLOCK_TYPES: BlockType[] = [
  'header', 'ticker', 'section-divider', 'article-grid',
  'spotlight', 'ethics-split', 'image', 'text',
  'prompt-masterclass', 'term-of-month', 'history', 'humor', 'spacer', 'footer',
];

// ─── Block color picker ────────────────────────────────────────────────────

const PRESET_BG_COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#F5F7FA' },
  { label: 'Pale Blue', value: '#EFF6FF' },
  { label: 'Pale Green', value: '#F0FDF4' },
  { label: 'Pale Yellow', value: '#FEFCE8' },
  { label: 'Pale Red', value: '#FEF2F2' },
  { label: 'Navy', value: '#003087' },
  { label: 'Dark Blue', value: '#1E293B' },
  { label: 'Sky Blue', value: '#00A3E0' },
  { label: 'Teal', value: '#0D9488' },
  { label: 'Forest', value: '#15803D' },
  { label: 'Slate', value: '#475569' },
  { label: 'Black', value: '#09090B' },
  { label: 'Transparent', value: 'transparent' },
];

const PRESET_TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Black', value: '#09090B' },
  { label: 'Dark Gray', value: '#1A1A2E' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Navy', value: '#003087' },
  { label: 'Sky Blue', value: '#00A3E0' },
  { label: 'Green', value: '#15803D' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Gold', value: '#D97706' },
];

const BlockColorPanel: React.FC<{ block: Block; onUpdate: (updates: Partial<Block>) => void }> = ({ block, onUpdate }) => (
  <div style={{ marginTop: 14 }}>
    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>
      Block Colors
    </div>

    {/* Background color */}
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>Background</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
        {PRESET_BG_COLORS.map(c => (
          <button
            key={c.value}
            title={c.label}
            onClick={() => onUpdate({ blockBgColor: c.value } as any)}
            style={{
              width: 22, height: 22,
              borderRadius: 4,
              border: block.blockBgColor === c.value ? '2px solid var(--color-accent)' : '1px solid rgba(0,0,0,0.15)',
              background: c.value === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 8px 8px' : c.value,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="color" value={block.blockBgColor && block.blockBgColor !== 'transparent' ? block.blockBgColor : '#ffffff'}
          onChange={e => onUpdate({ blockBgColor: e.target.value } as any)}
          style={{ width: 32, height: 28, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, padding: 2, cursor: 'pointer' }} />
        <input type="text" value={block.blockBgColor || ''} placeholder="Custom hex…"
          onChange={e => onUpdate({ blockBgColor: e.target.value } as any)}
          style={{ flex: 1, fontSize: '0.72rem', padding: '3px 7px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, fontFamily: 'monospace' }} />
        {block.blockBgColor && (
          <button onClick={() => onUpdate({ blockBgColor: undefined } as any)}
            style={{ fontSize: '0.7rem', color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        )}
      </div>
    </div>

    {/* Text color */}
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>Text Color</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
        {PRESET_TEXT_COLORS.map(c => (
          <button
            key={c.value}
            title={c.label}
            onClick={() => onUpdate({ blockTextColor: c.value || undefined } as any)}
            style={{
              width: 22, height: 22,
              borderRadius: 4,
              border: (block.blockTextColor || '') === c.value ? '2px solid var(--color-accent)' : '1px solid rgba(0,0,0,0.15)',
              background: c.value || '#F3F4F6',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', color: c.value === '#FFFFFF' || !c.value ? '#999' : '#fff',
            }}
          >
            {!c.value ? 'A' : ''}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="color" value={block.blockTextColor || '#09090B'}
          onChange={e => onUpdate({ blockTextColor: e.target.value } as any)}
          style={{ width: 32, height: 28, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, padding: 2, cursor: 'pointer' }} />
        <input type="text" value={block.blockTextColor || ''} placeholder="Custom hex…"
          onChange={e => onUpdate({ blockTextColor: e.target.value } as any)}
          style={{ flex: 1, fontSize: '0.72rem', padding: '3px 7px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, fontFamily: 'monospace' }} />
        {block.blockTextColor && (
          <button onClick={() => onUpdate({ blockTextColor: undefined } as any)}
            style={{ fontSize: '0.7rem', color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        )}
      </div>
    </div>
  </div>
);

// ─── Contextual block info panel ───────────────────────────────────────────

const BlockInfoPanel: React.FC<{ block: Block; onUpdate: (updates: Partial<Block>) => void }> = ({ block }) => {
  const getHints = () => {
    switch (block.type) {
      case 'header': return ['Click the title, subtitle, or tagline in the preview to edit them directly.', 'Use the "Upload Logo" button that appears in the block when selected.'];
      case 'ticker': return ['When selected, an editor strip appears at the top of the ticker.', 'Add/remove items and adjust scroll speed inline.'];
      case 'article-grid': return ['Click an article card to edit any field inline.', 'Use "Add Article Image" to upload a photo per article.', '💬 Comments appear at the bottom of each card — anyone can add one.', 'Use the column buttons (1/2/3) to change layout.', 'Use "Add Article" to create a new card.'];
      case 'spotlight': return ['Edit all fields directly in the preview.', 'Upload a cover image with the button that appears when selected.'];
      case 'image': return ['Click the image area to upload a photo.', 'Caption, alt text, and credit fields appear below the image when selected.', 'Use Left/Center/Right buttons to align.'];
      case 'spacer': return ['Use the slider that appears in the block to adjust height.'];
      case 'footer': return ['Edit institution, department, disclaimer directly.', 'Add/remove social links with the "+ Add" button.', 'URL fields appear inline when selected.'];
      default: return ['Click any text in the preview to edit it directly.'];
    }
  };

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 10 }}>
        {BLOCK_LABELS[block.type]}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text)', lineHeight: 1.6, background: 'rgba(0,163,224,0.06)', borderRadius: 6, padding: '10px 12px', border: '1px solid rgba(0,163,224,0.12)' }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--color-accent)' }}>✏️ How to edit this block:</div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {getHints().map((hint, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{hint}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 12, fontSize: '0.7rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
        All changes auto-save every 30 seconds. Use Cmd+S for immediate save.
      </div>
    </div>
  );
};

// ─── Main Sidebar ──────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
  newsletter, editorState, setEditorState,
  onAddBlock, onThemeChange, onUpdateMeta, onUpdateBlock,
  versions, onSaveVersion, onLoadVersion, onDeleteVersion,
  onExportJSON, onImportJSON, onExportHTML, onExportPDF,
}) => {
  const { activePanel, selectedBlockId } = editorState;
  const fileRef = React.useRef<HTMLInputElement>(null);
  const selectedBlock = selectedBlockId ? newsletter.blocks[selectedBlockId] : null;

  return (
    <aside className="sidebar" role="complementary" aria-label="Editor controls">
      <nav className="sidebar__tabs" role="tablist">
        {(['blocks', 'theme', 'settings', 'versions'] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activePanel === tab}
            className={`sidebar__tab ${activePanel === tab ? 'active' : ''}`}
            onClick={() => setEditorState(s => ({ ...s, activePanel: tab }))}
          >
            {tab === 'blocks' ? '🧩' : tab === 'theme' ? '🎨' : tab === 'settings' ? '⚙️' : '🕐'}
            <span style={{ display: 'block', fontSize: '0.6rem', marginTop: 2 }}>
              {tab === 'blocks' ? 'Blocks' : tab === 'theme' ? 'Theme' : tab === 'settings' ? 'Settings' : 'Versions'}
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar__content">

        {/* ── BLOCKS PANEL ── */}
        {activePanel === 'blocks' && (
          <>
            {/* Selected block info */}
            {selectedBlock && (
              <div className="panel-section" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 16, marginBottom: 16 }}>
                <div className="panel-section__title">Selected Block</div>
                <BlockInfoPanel block={selectedBlock} onUpdate={updates => onUpdateBlock(selectedBlockId!, updates)} />
                <BlockColorPanel block={selectedBlock} onUpdate={updates => onUpdateBlock(selectedBlockId!, updates)} />
                <button
                  onClick={() => setEditorState(s => ({ ...s, selectedBlockId: null }))}
                  style={{ width: '100%', padding: '6px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, background: 'none', fontSize: '0.75rem', cursor: 'pointer', marginTop: 12, color: 'var(--color-muted)' }}
                >
                  Deselect Block
                </button>
              </div>
            )}

            {/* Block picker */}
            <div className="panel-section">
              <div className="panel-section__title">Add Block</div>
              <div className="block-picker-grid">
                {BLOCK_TYPES.map(type => (
                  <button
                    key={type}
                    className="block-pick-btn"
                    onClick={() => onAddBlock(type)}
                    title={`Add ${BLOCK_LABELS[type]}`}
                  >
                    {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section__title">How to Use</div>
              <p style={{ fontSize: '0.73rem', color: 'var(--color-muted)', lineHeight: 1.55 }}>
                <strong>Click any block</strong> in the preview to select it and unlock editing controls.<br /><br />
                <strong>Click any text</strong> to edit it inline. Press <kbd style={{ background: 'rgba(0,0,0,0.07)', padding: '1px 4px', borderRadius: 3, fontSize: '0.7rem' }}>Esc</kbd> to finish.<br /><br />
                Use <strong>↑↓ arrows</strong> (appear on hover left of each row) to reorder rows.<br /><br />
                Use the <strong>🗑️ button</strong> to remove a block.
              </p>
            </div>
          </>
        )}

        {/* ── THEME PANEL ── */}
        {activePanel === 'theme' && (
          <>
            <div className="panel-section">
              <div className="panel-section__title">Theme Preset</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(Object.keys(THEMES) as ThemePreset[]).map(preset => (
                  <button
                    key={preset}
                    onClick={() => onThemeChange(preset)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `2px solid ${newsletter.theme.preset === preset ? THEMES[preset].primaryColor : 'rgba(0,0,0,0.08)'}`,
                      background: THEMES[preset].backgroundColor,
                      color: THEMES[preset].textColor,
                      fontFamily: THEMES[preset].fontFamily,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {newsletter.theme.preset === preset && <span style={{ color: THEMES[preset].primaryColor }}>✓</span>}
                    {THEME_LABELS[preset]}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section__title">Custom Colors</div>
              {[
                { label: 'Primary Color', key: 'primaryColor' },
                { label: 'Accent Color', key: 'accentColor' },
                { label: 'Background', key: 'backgroundColor' },
                { label: 'Surface / Cards', key: 'surfaceColor' },
                { label: 'Body Text', key: 'textColor' },
                { label: 'Muted Text', key: 'mutedColor' },
              ].map(({ label, key }) => (
                <div key={key} className="panel-field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label style={{ flex: 1, marginBottom: 0, fontSize: '0.75rem' }}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={(newsletter.theme as any)[key]}
                      onChange={e => onThemeChange({ ...newsletter.theme, [key]: e.target.value })}
                      style={{ width: 36, height: 30, padding: 2, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={(newsletter.theme as any)[key]}
                      onChange={e => onThemeChange({ ...newsletter.theme, [key]: e.target.value })}
                      style={{ width: 70, fontSize: '0.68rem', padding: '3px 6px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── SETTINGS PANEL ── */}
        {activePanel === 'settings' && (
          <>
            <div className="panel-section">
              <div className="panel-section__title">Newsletter Info</div>
              <div className="panel-field">
                <label>Title</label>
                <input value={newsletter.meta.title} onChange={e => onUpdateMeta({ title: e.target.value })} />
              </div>
              <div className="panel-field">
                <label>Issue Number</label>
                <input value={newsletter.meta.issueNumber} onChange={e => onUpdateMeta({ issueNumber: e.target.value })} />
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section__title">Export</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="home-btn home-btn--primary" style={{ fontSize: '0.82rem', padding: 10 }} onClick={onExportHTML}>📄 Export HTML</button>
                <button className="home-btn home-btn--secondary" style={{ fontSize: '0.82rem', padding: 10 }} onClick={onExportPDF}>🖨️ Export PDF</button>
                <button className="home-btn home-btn--ghost" style={{ fontSize: '0.82rem', padding: 10 }} onClick={onExportJSON}>💾 Export JSON</button>
                <button className="home-btn home-btn--ghost" style={{ fontSize: '0.82rem', padding: 10 }} onClick={() => fileRef.current?.click()}>📂 Import JSON</button>
                <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) onImportJSON(f); }} />
              </div>
            </div>
          </>
        )}

        {/* ── VERSIONS PANEL ── */}
        {activePanel === 'versions' && (
          <>
            <div className="panel-section">
              <div className="panel-section__title">Version History</div>
              <button
                className="home-btn home-btn--secondary"
                style={{ fontSize: '0.78rem', padding: '9px', marginBottom: 14, width: '100%' }}
                onClick={onSaveVersion}
              >
                💾 Save Version Snapshot
              </button>
              {versions.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>No saved versions yet. Create a snapshot to save a restore point.</p>
              )}
              {versions.map(v => (
                <div key={v.id} className="version-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="version-item__label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.label}</div>
                    <div className="version-item__date">{new Date(v.savedAt).toLocaleString()}</div>
                  </div>
                  <div className="version-item__actions">
                    <button onClick={() => onLoadVersion(v)} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>Load</button>
                    <button onClick={() => onDeleteVersion(v.id)} style={{ color: '#DC2626' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </aside>
  );
};
