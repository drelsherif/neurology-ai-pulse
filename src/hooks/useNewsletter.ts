import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Newsletter, Block, Row, RowLayout, BlockType, Theme
} from '../types';
import { createDefaultNewsletter } from '../data/defaults';

export function useNewsletter(initial?: Newsletter) {
  const [newsletter, setNewsletter] = useState<Newsletter>(initial || createDefaultNewsletter());

  // ─── Block Operations ──────────────────────────────────────────────────────

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setNewsletter(prev => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: { ...prev.blocks[blockId], ...updates } as Block,
      },
      meta: { ...prev.meta, updatedAt: new Date().toISOString() },
    }));
  }, []);

  const addBlock = useCallback((type: BlockType, rowId?: string, layout: RowLayout = '1col') => {
    const blockId = uuidv4();
    const newBlock = createEmptyBlock(type, blockId);

    setNewsletter(prev => {
      const newBlocks = { ...prev.blocks, [blockId]: newBlock };

      if (rowId) {
        // Add to existing row if space allows
        const row = prev.rows.find(r => r.id === rowId);
        if (row && row.blockIds.length < maxBlocksForLayout(row.layout)) {
          return {
            ...prev,
            blocks: newBlocks,
            rows: prev.rows.map(r =>
              r.id === rowId ? { ...r, blockIds: [...r.blockIds, blockId] } : r
            ),
          };
        }
      }

      // Create new row
      const newRow: Row = {
        id: uuidv4(),
        layout,
        blockIds: [blockId],
      };

      // Insert before footer row
      const rows = [...prev.rows];
      const footerIdx = rows.findIndex(r =>
        r.blockIds.some(bid => prev.blocks[bid]?.type === 'footer')
      );
      if (footerIdx >= 0) {
        rows.splice(footerIdx, 0, newRow);
      } else {
        rows.push(newRow);
      }

      return {
        ...prev,
        blocks: newBlocks,
        rows,
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      };
    });

    return blockId;
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setNewsletter(prev => {
      const newBlocks = { ...prev.blocks };
      delete newBlocks[blockId];

      const newRows = prev.rows
        .map(row => ({
          ...row,
          blockIds: row.blockIds.filter(id => id !== blockId),
        }))
        .filter(row => row.blockIds.length > 0);

      return {
        ...prev,
        blocks: newBlocks,
        rows: newRows,
        meta: { ...prev.meta, updatedAt: new Date().toISOString() },
      };
    });
  }, []);

  const moveBlockUp = useCallback((rowIndex: number) => {
    setNewsletter(prev => {
      if (rowIndex === 0) return prev;
      const rows = [...prev.rows];
      [rows[rowIndex - 1], rows[rowIndex]] = [rows[rowIndex], rows[rowIndex - 1]];
      return { ...prev, rows };
    });
  }, []);

  const moveBlockDown = useCallback((rowIndex: number) => {
    setNewsletter(prev => {
      if (rowIndex >= prev.rows.length - 1) return prev;
      const rows = [...prev.rows];
      [rows[rowIndex], rows[rowIndex + 1]] = [rows[rowIndex + 1], rows[rowIndex]];
      return { ...prev, rows };
    });
  }, []);

  const updateRowLayout = useCallback((rowId: string, layout: RowLayout) => {
    setNewsletter(prev => ({
      ...prev,
      rows: prev.rows.map(r => r.id === rowId ? { ...r, layout } : r),
    }));
  }, []);

  // ─── Theme ─────────────────────────────────────────────────────────────────

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    setNewsletter(prev => ({
      ...prev,
      theme: { ...prev.theme, ...updates },
      meta: { ...prev.meta, updatedAt: new Date().toISOString() },
    }));
  }, []);

  // ─── Meta ──────────────────────────────────────────────────────────────────

  const updateMeta = useCallback((updates: Partial<Newsletter['meta']>) => {
    setNewsletter(prev => ({
      ...prev,
      meta: { ...prev.meta, ...updates, updatedAt: new Date().toISOString() },
    }));
  }, []);

  const loadNewsletter = useCallback((nl: Newsletter) => {
    setNewsletter(nl);
  }, []);

  return {
    newsletter,
    updateBlock,
    addBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    updateRowLayout,
    updateTheme,
    updateMeta,
    loadNewsletter,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function maxBlocksForLayout(layout: RowLayout): number {
  if (layout === '1col') return 1;
  if (layout === '2col') return 2;
  if (layout === '3col') return 3;
  if (layout === '2x2') return 4;
  return 1;
}

function createEmptyBlock(type: BlockType, id: string): Block {
  switch (type) {
    case 'header': return { id, type, title: 'Neurology AI Pulse', subtitle: 'AI in Clinical Neuroscience', issueNumber: 'Issue 001', issueDate: new Date().toLocaleDateString(), tagline: '' };
    case 'ticker': return { id, type, items: ['New headline here'], speed: 'medium' };
    case 'section-divider': return { id, type, label: 'SECTION', style: 'gradient' };
    case 'article-grid': return { id, type, sectionTitle: 'Top Stories', articles: [{ id: uuidv4(), title: 'New Article', source: 'Journal', url: '', imageUrl: '', summary: 'Article summary here.', clinicalReview: 'Clinical review here.', myView: 'My view here.', evidenceLevel: 'Moderate' as const, comments: [] }], columns: 2 as const };
    case 'spotlight': return { id, type, title: 'Spotlight Title', source: 'Journal', url: '', summary: 'Summary here.', clinicalReview: 'Clinical review here.', myView: 'My view here.', evidenceLevel: 'Moderate' };
    case 'ethics-split': return { id, type, topic: 'Ethics Topic', issue: 'The issue...', myView: 'My view...' };
    case 'image': return { id, type, imageUrl: '', caption: 'Image caption', altText: 'Image', alignment: 'center' };
    case 'text': return { id, type, heading: '', content: 'Text content here.' };
    case 'prompt-masterclass': return { id, type, title: 'Prompt Masterclass', prompt: 'Your prompt here...', explanation: 'Explanation...', useCase: 'Use case...' };
    case 'term-of-month': return { id, type, term: 'Term', definition: 'Definition here.', clinicalContext: 'Clinical context here.' };
    case 'history': return { id, type, year: '2024', title: 'Historical Event', content: 'Historical content here.' };
    case 'humor': return { id, type, heading: '🧠 Humor Break', content: 'Humor content here.', attribution: '' };
    case 'spacer': return { id, type, height: 24 };
    case 'footer': return { id, type, institution: 'Institution', department: 'Department', unsubscribeUrl: '#', websiteUrl: '#', copyrightYear: new Date().getFullYear().toString(), disclaimer: '', socials: [] };
  }
}
