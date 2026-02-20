import React from 'react';
import type { Newsletter, Block, EditorState, RowLayout } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderers';

interface PreviewProps {
  newsletter: Newsletter;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveRowUp: (rowIndex: number) => void;
  onMoveRowDown: (rowIndex: number) => void;
  onUpdateRowLayout: (rowId: string, layout: RowLayout) => void;
}

const LAYOUT_OPTIONS: { value: RowLayout; label: string }[] = [
  { value: '1col', label: '▌' },
  { value: '2col', label: '▌▌' },
  { value: '3col', label: '▌▌▌' },
  { value: '2x2',  label: '⊞' },
];

export const NewsletterPreview: React.FC<PreviewProps> = ({
  newsletter, editorState, setEditorState,
  onUpdateBlock, onRemoveBlock, onMoveRowUp, onMoveRowDown, onUpdateRowLayout,
}) => {
  const { selectedBlockId } = editorState;
  const allBlockIds = newsletter.rows.flatMap(r => r.blockIds);

  const moveBlockUp = (blockId: string) => {
    const rowIdx = newsletter.rows.findIndex(r => r.blockIds.includes(blockId));
    if (rowIdx > 0) onMoveRowUp(rowIdx);
  };

  const moveBlockDown = (blockId: string) => {
    const rowIdx = newsletter.rows.findIndex(r => r.blockIds.includes(blockId));
    if (rowIdx < newsletter.rows.length - 1) onMoveRowDown(rowIdx);
  };

  return (
    <div className="preview-pane" onClick={(e) => {
      if (e.target === e.currentTarget) setEditorState(s => ({ ...s, selectedBlockId: null }));
    }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.05em' }}>
        ✏️ Click a block to select · ↑↓ reorder · hover row edge to change layout
      </div>
      <div className="newsletter-preview" id="newsletter-preview">
        {newsletter.rows.map((row, rowIndex) => (
          <div key={row.id} className="newsletter-row" data-layout={row.layout} style={{ position: 'relative' }}>

            {/* Row layout switcher — appears on left edge on hover */}
            <div className="row-layout-switcher" data-editor-only>
              {LAYOUT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  title={opt.value}
                  onClick={() => onUpdateRowLayout(row.id, opt.value)}
                  style={{
                    display: 'block',
                    width: 28, height: 22,
                    marginBottom: 2,
                    border: 'none',
                    borderRadius: 3,
                    background: row.layout === opt.value ? 'var(--color-accent)' : 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    fontSize: '0.55rem',
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                    fontWeight: 700,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {row.blockIds.map(blockId => {
              const block = newsletter.blocks[blockId];
              if (!block) return null;
              const isSelected = selectedBlockId === blockId;
              const flatIdx = allBlockIds.indexOf(blockId);
              const isFirst = flatIdx === 0;
              const isLast = flatIdx === allBlockIds.length - 1;

              return (
                <div
                  key={blockId}
                  className={`block-wrapper ${isSelected ? 'selected' : ''}`}
                  style={{
                    flex: 1,
                    outline: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
                    outlineOffset: -2,
                    position: 'relative',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditorState(s => ({ ...s, selectedBlockId: blockId }));
                  }}
                >
                  <div className="block-controls" data-editor-only>
                    <button className="block-control-btn" onClick={e => { e.stopPropagation(); moveBlockUp(blockId); }} disabled={isFirst} title="Move up" style={{ opacity: isFirst ? 0.25 : 1 }}>↑</button>
                    <button className="block-control-btn" onClick={e => { e.stopPropagation(); moveBlockDown(blockId); }} disabled={isLast} title="Move down" style={{ opacity: isLast ? 0.25 : 1 }}>↓</button>
                    <button className="block-control-btn danger" onClick={e => { e.stopPropagation(); onRemoveBlock(blockId); }} title="Remove">🗑️</button>
                    {isSelected && (
                      <span style={{ fontSize: '0.6rem', background: 'var(--color-accent)', color: '#fff', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
                        ✏️ Editing
                      </span>
                    )}
                  </div>

                  {(block.blockBgColor || block.blockTextColor || block.blockPadding != null || block.blockFontSize || block.blockWidth) && (
                    <style>{`
                      #block-${blockId} > .block-header,
                      #block-${blockId} > .block-ticker,
                      #block-${blockId} > .block-section-divider,
                      #block-${blockId} > .block-article-grid,
                      #block-${blockId} > .block-spotlight,
                      #block-${blockId} > .block-ethics,
                      #block-${blockId} > .block-image,
                      #block-${blockId} > .block-text,
                      #block-${blockId} > .block-prompt,
                      #block-${blockId} > .block-sbar,
                      #block-${blockId} > .block-term,
                      #block-${blockId} > .block-history,
                      #block-${blockId} > .block-humor,
                      #block-${blockId} > .block-spacer,
                      #block-${blockId} > .block-footer {
                        ${block.blockBgColor ? `background: ${block.blockBgColor} !important;` : ''}
                        ${block.blockPadding != null ? `padding-top: ${block.blockPadding}px !important; padding-bottom: ${block.blockPadding}px !important;` : ''}
                        ${block.blockFontSize ? `font-size: ${block.blockFontSize}px !important;` : ''}
                      }
                      #block-${blockId} h1, #block-${blockId} h2, #block-${blockId} h3,
                      #block-${blockId} p, #block-${blockId} .editable {
                        ${block.blockTextColor ? `color: ${block.blockTextColor} !important;` : ''}
                      }
                      ${block.blockWidth && block.blockWidth !== '100' ? `
                      #block-${blockId} {
                        width: ${block.blockWidth}% !important;
                        flex: 0 0 ${block.blockWidth}% !important;
                        margin-left: auto !important; margin-right: auto !important;
                      }` : ''}
                    `}</style>
                  )}

                  <div
                    id={`block-${blockId}`}
                    data-block-bg={block.blockBgColor || undefined}
                    data-block-color={block.blockTextColor || undefined}
                    data-block-padding={block.blockPadding || undefined}
                    data-block-font-size={block.blockFontSize || undefined}
                  >
                    <BlockRenderer
                      block={block}
                      update={(updates) => onUpdateBlock(blockId, updates)}
                      editable={isSelected}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

