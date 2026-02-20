import React from 'react';
import type { Newsletter, Block, EditorState } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderers';

interface PreviewProps {
  newsletter: Newsletter;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveRowUp: (rowIndex: number) => void;
  onMoveRowDown: (rowIndex: number) => void;
}

export const NewsletterPreview: React.FC<PreviewProps> = ({
  newsletter, editorState, setEditorState,
  onUpdateBlock, onRemoveBlock, onMoveRowUp, onMoveRowDown,
}) => {
  const { selectedBlockId } = editorState;

  // Flat list of all block IDs in order across all rows
  const allBlockIds = newsletter.rows.flatMap(r => r.blockIds);

  const moveBlockUp = (blockId: string) => {
    const idx = allBlockIds.indexOf(blockId);
    if (idx <= 0) return;
    const aboveId = allBlockIds[idx - 1];

    // Find which rows contain each block
    const rowOfBlock = newsletter.rows.findIndex(r => r.blockIds.includes(blockId));
    const rowOfAbove = newsletter.rows.findIndex(r => r.blockIds.includes(aboveId));

    if (rowOfBlock === rowOfAbove) {
      // Same row — swap within row: move the whole row up instead
      onMoveRowUp(rowOfBlock);
    } else {
      // Different rows — swap the two rows
      onMoveRowUp(rowOfBlock);
    }
  };

  const moveBlockDown = (blockId: string) => {
    const idx = allBlockIds.indexOf(blockId);
    if (idx >= allBlockIds.length - 1) return;

    const rowOfBlock = newsletter.rows.findIndex(r => r.blockIds.includes(blockId));

    if (rowOfBlock < newsletter.rows.length - 1) {
      onMoveRowDown(rowOfBlock);
    }
  };

  return (
    <div className="preview-pane" onClick={(e) => {
      if (e.target === e.currentTarget) setEditorState(s => ({ ...s, selectedBlockId: null }));
    }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.05em' }}>
        ✏️ Click a block to select it · Use ↑↓ to reorder · 🗑️ to remove
      </div>
      <div className="newsletter-preview" id="newsletter-preview">
        {newsletter.rows.map((row, rowIndex) => (
          <div key={row.id} className="newsletter-row" style={{ position: 'relative' }}>
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
                  {/* Block controls — always visible on hover, always shown when selected */}
                  <div className="block-controls" data-editor-only>

                    {/* Move up */}
                    <button
                      className="block-control-btn"
                      onClick={e => { e.stopPropagation(); moveBlockUp(blockId); }}
                      disabled={isFirst}
                      title="Move block up"
                      style={{ opacity: isFirst ? 0.25 : 1 }}
                    >↑</button>

                    {/* Move down */}
                    <button
                      className="block-control-btn"
                      onClick={e => { e.stopPropagation(); moveBlockDown(blockId); }}
                      disabled={isLast}
                      title="Move block down"
                      style={{ opacity: isLast ? 0.25 : 1 }}
                    >↓</button>

                    {/* Remove */}
                    <button
                      className="block-control-btn danger"
                      onClick={e => { e.stopPropagation(); onRemoveBlock(blockId); }}
                      title="Remove block"
                    >🗑️</button>

                    {isSelected && (
                      <span style={{
                        fontSize: '0.6rem',
                        background: 'var(--color-accent)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        ✏️ Editing
                      </span>
                    )}
                  </div>

                  {/* Per-block color overrides */}
                  {(block.blockBgColor || block.blockTextColor) && (
                    <style>{`
                      #block-${blockId} {
                        ${block.blockBgColor ? `background: ${block.blockBgColor} !important;` : ''}
                      }
                      #block-${blockId} > * {
                        ${block.blockBgColor ? `background: ${block.blockBgColor} !important;` : ''}
                        ${block.blockTextColor ? `color: ${block.blockTextColor} !important;` : ''}
                      }
                      #block-${blockId} h1,
                      #block-${blockId} h2,
                      #block-${blockId} h3,
                      #block-${blockId} p,
                      #block-${blockId} .editable {
                        ${block.blockTextColor ? `color: ${block.blockTextColor} !important;` : ''}
                      }
                    `}</style>
                  )}

                  <div id={`block-${blockId}`}>
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
