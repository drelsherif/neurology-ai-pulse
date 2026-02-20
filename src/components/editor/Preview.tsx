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

  return (
    <div className="preview-pane" onClick={(e) => {
      if (e.target === e.currentTarget) setEditorState(s => ({ ...s, selectedBlockId: null }));
    }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.05em' }}>
        ✏️ All blocks are editable — click any text to edit inline · Click a block to select it
      </div>
      <div className="newsletter-preview" id="newsletter-preview">
        {newsletter.rows.map((row, rowIndex) => (
          <div key={row.id} className="newsletter-row" style={{ position: 'relative' }}>

            {/* Row move controls — visible on row hover */}
            <div className="row-controls" data-editor-only>
              <button
                className="block-control-btn"
                onClick={() => onMoveRowUp(rowIndex)}
                disabled={rowIndex === 0}
                title="Move row up"
                style={{ opacity: rowIndex === 0 ? 0.3 : 1 }}
              >↑</button>
              <button
                className="block-control-btn"
                onClick={() => onMoveRowDown(rowIndex)}
                disabled={rowIndex === newsletter.rows.length - 1}
                title="Move row down"
                style={{ opacity: rowIndex === newsletter.rows.length - 1 ? 0.3 : 1 }}
              >↓</button>
            </div>

            {row.blockIds.map(blockId => {
              const block = newsletter.blocks[blockId];
              if (!block) return null;
              const isSelected = selectedBlockId === blockId;

              return (
                <div
                  key={blockId}
                  className={`block-wrapper ${isSelected ? 'selected' : ''}`}
                  style={{
                    flex: 1,
                    outline: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
                    outlineOffset: -2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditorState(s => ({ ...s, selectedBlockId: blockId }));
                  }}
                >
                  {/* Remove button */}
                  <div className="block-controls" data-editor-only>
                    <button
                      className="block-control-btn danger"
                      onClick={e => { e.stopPropagation(); onRemoveBlock(blockId); }}
                      title="Remove block"
                    >🗑️</button>
                    {isSelected && (
                      <span style={{ fontSize: '0.6rem', background: 'var(--color-accent)', color: '#fff', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
                        ✏️ Editing
                      </span>
                    )}
                  </div>

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
