import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Newsletter, Block, Row, RowLayout, BlockType, Theme, SbarPromptBlock
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

  // afterBlockId: insert new block immediately after this block's row
  const addBlock = useCallback((type: BlockType, afterBlockId?: string, layout: RowLayout = '1col') => {
    const blockId = uuidv4();
    const newBlock = createEmptyBlock(type, blockId);

    setNewsletter(prev => {
      const newBlocks = { ...prev.blocks, [blockId]: newBlock };
      const newRow: Row = { id: uuidv4(), layout, blockIds: [blockId] };
      const rows = [...prev.rows];

      if (afterBlockId) {
        // Find the row containing afterBlockId and insert after it
        const afterRowIdx = rows.findIndex(r => r.blockIds.includes(afterBlockId));
        if (afterRowIdx >= 0) {
          rows.splice(afterRowIdx + 1, 0, newRow);
          return {
            ...prev,
            blocks: newBlocks,
            rows,
            meta: { ...prev.meta, updatedAt: new Date().toISOString() },
          };
        }
      }

      // No context: append at end
      rows.push(newRow);
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
        .map(row => ({ ...row, blockIds: row.blockIds.filter(id => id !== blockId) }))
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

// ─── Helpers ────────────────────────────────────────────────────────────────

function maxBlocksForLayout(layout: RowLayout): number {
  if (layout === '1col') return 1;
  if (layout === '2col') return 2;
  if (layout === '3col') return 3;
  if (layout === '2x2') return 4;
  return 1;
}

// Keep for potential future use
const _maxBlocksForLayout = maxBlocksForLayout;
void _maxBlocksForLayout;

function createEmptyBlock(type: BlockType, id: string): Block {
  switch (type) {
    case 'header': return { id, type, title: 'Newsletter Title', subtitle: 'Subtitle here', issueNumber: 'Issue 001', issueDate: new Date().toLocaleDateString(), tagline: '' };
    case 'ticker': return { id, type, items: ['New headline here'], speed: 'medium' };
    case 'section-divider': return { id, type, label: 'SECTION', style: 'gradient' };
    case 'article-grid': return { id, type, sectionTitle: 'Top Stories', articles: [{ id: uuidv4(), title: 'New Article', source: 'Journal', url: '', imageUrl: '', summary: 'Article summary here.', clinicalReview: 'Clinical review here.', myView: 'My view here.', evidenceLevel: 'Moderate' as const, comments: [] }], columns: 2 as const };
    case 'spotlight': return { id, type, title: 'Spotlight Title', source: 'Journal', url: '', summary: 'Summary here.', clinicalReview: 'Clinical review here.', myView: 'My view here.', evidenceLevel: 'Moderate' };
    case 'ethics-split': return { id, type, topic: 'Topic Title', issue: 'The issue...', myView: 'My view...' };
    case 'image': return { id, type, imageUrl: '', caption: 'Image caption', altText: 'Image', alignment: 'center' };
    case 'text': return { id, type, heading: '', content: 'Text content here.' };
    case 'prompt-masterclass': return { id, type, title: 'Prompt Masterclass', prompt: 'Your prompt here...', explanation: 'Explanation...', useCase: 'Use case...' };
    case 'sbar-prompt': return {
      id, type,
      title: 'The SBAR-P Prompting Framework',
      intro: 'Apply the SBAR-P framework — adapted from clinical handover protocols — to communicate with AI tools as you would a knowledgeable consultant. Well-structured prompts yield safer, more accurate, and clinically actionable outputs.',
      steps: [
        { letter: 'S', name: 'Situation', description: 'State the clinical context clearly. Specify patient age, sex, setting (inpatient/ED/outpatient), and the presenting problem.', example: '"58M, admitted with acute decompensated heart failure, EF 25%, on furosemide 80mg IV BD…"' },
        { letter: 'B', name: 'Background', description: 'Provide relevant history, comorbidities, medications, allergies, and recent investigations that shape your clinical question.', example: '"… PMH: CKD stage 3 (eGFR 38), diabetes. Current Cr 2.1, up from baseline 1.6."' },
        { letter: 'A', name: 'Ask', description: 'Be explicit and specific about what you want. Vague questions produce vague answers. Request format (list, summary, table, differential).', example: '"List the top 5 causes of worsening renal function in this context and for each, suggest one targeted investigation."' },
        { letter: 'R', name: 'Role', description: 'Assign a clinical persona. The AI performs better when given a specialist frame of reference aligned with your question.', example: '"Respond as a consultant nephrologist reviewing this case for a renal consult note."' },
        { letter: 'P', name: 'Parameters', description: 'Set safety guardrails. Specify evidence base, uncertainty disclosure, and what to do when information is insufficient.', example: '"Use current KDIGO guidelines. Flag any recommendations where evidence is limited. Do not fabricate drug doses."' },
      ],
      promptTemplate: `Act as a [SPECIALTY] consultant.\n\nPatient: [AGE] [SEX], [SETTING]\nPresentation: [CHIEF COMPLAINT for DURATION]\nKey findings: [VITALS, EXAM, KEY LABS]\nPMH: [COMORBIDITIES]\nMedications: [MED LIST]\n\nTask: [SPECIFIC QUESTION — e.g. "Generate a prioritised differential of the top 5 conditions"]\n\nFormat: [LIST / TABLE / NARRATIVE]\nEvidence base: [GUIDELINE — e.g. "Current AHA/ACC guidelines"]\nConstraints: Do not hallucinate lab values. Flag areas of uncertainty. State confidence level for each recommendation.`,
      safetyNotes: [
        'Verify all outputs. AI can hallucinate drug doses, lab values, and guideline details. Always cross-reference with UpToDate or the primary source before acting.',
        'Never enter identifiable patient data into consumer AI tools. Use only HIPAA-compliant, enterprise-approved platforms within your institution.',
        'Clinical judgement remains paramount. AI is a decision support tool, not a decision-maker. You are responsible for all clinical decisions.',
        'Knowledge cutoffs matter. For rapidly evolving guidance (antimicrobial stewardship, oncology protocols), always check the latest version of the relevant guideline.',
      ],
    };
    case 'term-of-month': return { id, type, term: 'Term', definition: 'Definition here.', clinicalContext: 'Clinical context here.' };
    case 'history': return { id, type, year: new Date().getFullYear().toString(), title: 'Historical Event', content: 'Historical content here.' };
    case 'humor': return { id, type, heading: '😄 Humor Break', content: 'Content here.', attribution: '' };
    case 'spacer': return { id, type, height: 24 };
    case 'footer': return { id, type, institution: 'Institution', department: 'Department', contactEmail: '', unsubscribeUrl: '#', websiteUrl: '#', copyrightYear: new Date().getFullYear().toString(), disclaimer: '', socials: [], contributors: [] };
  }
}
