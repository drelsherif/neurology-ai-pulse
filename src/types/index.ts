// ─── Block Types ────────────────────────────────────────────────────────────

export type BlockType =
  | 'header'
  | 'ticker'
  | 'section-divider'
  | 'article-grid'
  | 'spotlight'
  | 'ethics-split'
  | 'image'
  | 'text'
  | 'prompt-masterclass'
  | 'sbar-prompt'
  | 'term-of-month'
  | 'history'
  | 'humor'
  | 'spacer'
  | 'footer';

export interface ArticleComment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  source: string;
  url: string;
  imageUrl?: string;
  summary: string;
  clinicalReview: string;
  myView: string;
  evidenceLevel: 'High' | 'Moderate' | 'Low' | 'Expert Opinion';
  comments: ArticleComment[];
}

export interface BlockBase {
  id: string;
  type: BlockType;
  // Visual overrides
  blockBgColor?: string;
  blockTextColor?: string;
  blockPadding?: number;       // px, applied as padding top/bottom
  blockFontSize?: number;      // px, base font size override
  blockWidth?: '25' | '50' | '75' | '100'; // % width within its column
}

\1  useAnimatedLogo?: boolean;
  animatedLogoSize?: number;
  title: string;
  subtitle: string;
  issueNumber: string;
  issueDate: string;
  tagline: string;
}

export interface TickerBlock extends BlockBase {
  type: 'ticker';
  items: string[];
  speed: 'slow' | 'medium' | 'fast';
}

export interface SectionDividerBlock extends BlockBase {
  type: 'section-divider';
  label: string;
  style: 'line' | 'gradient' | 'icon';
}

export interface ArticleGridBlock extends BlockBase {
  type: 'article-grid';
  sectionTitle: string;
  articles: ArticleItem[];
  columns: 1 | 2 | 3;
}

export interface SpotlightBlock extends BlockBase {
  type: 'spotlight';
  title: string;
  source: string;
  url: string;
  summary: string;
  clinicalReview: string;
  myView: string;
  evidenceLevel: ArticleItem['evidenceLevel'];
  imageUrl?: string;
}

export interface EthicsSplitBlock extends BlockBase {
  type: 'ethics-split';
  topic: string;
  issue: string;
  myView: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  imageUrl: string;
  caption: string;
  credit?: string;
  altText: string;
  alignment: 'left' | 'center' | 'right';
}

export interface TextBlock extends BlockBase {
  type: 'text';
  content: string;
  heading?: string;
}

export interface PromptMasterclassBlock extends BlockBase {
  type: 'prompt-masterclass';
  title: string;
  prompt: string;
  explanation: string;
  useCase: string;
}

export interface TermOfMonthBlock extends BlockBase {
  type: 'term-of-month';
  term: string;
  definition: string;
  clinicalContext: string;
}

export interface HistoryBlock extends BlockBase {
  type: 'history';
  year: string;
  title: string;
  content: string;
}

export interface HumorBlock extends BlockBase {
  type: 'humor';
  heading: string;
  content: string;
  attribution?: string;
}

export interface SpacerBlock extends BlockBase {
  type: 'spacer';
  height: number;
}

export interface Contributor {
  id: string;
  name: string;
  role: string;
  url?: string;
}

export interface FooterBlock extends BlockBase {
  type: 'footer';
  institution: string;
  department: string;
  contactEmail?: string;
  unsubscribeUrl: string;
  websiteUrl: string;
  copyrightYear: string;
  disclaimer: string;
  socials: { platform: string; url: string }[];
  contributors: Contributor[];
}

export interface SbarStep {
  letter: string;  // S, B, A, R, P
  name: string;    // e.g. "Situation"
  description: string;
  example: string;
}

export interface SbarPromptBlock extends BlockBase {
  type: 'sbar-prompt';
  title: string;
  intro: string;
  steps: SbarStep[];
  promptTemplate: string;  // the full editable prompt example
  safetyNotes: string[];
}

export type Block =
  | HeaderBlock
  | TickerBlock
  | SectionDividerBlock
  | ArticleGridBlock
  | SpotlightBlock
  | EthicsSplitBlock
  | ImageBlock
  | TextBlock
  | PromptMasterclassBlock
  | SbarPromptBlock
  | TermOfMonthBlock
  | HistoryBlock
  | HumorBlock
  | SpacerBlock
  | FooterBlock;

// ─── Row / Layout ────────────────────────────────────────────────────────────

export type RowLayout = '1col' | '2col' | '3col' | '2x2';

export interface Row {
  id: string;
  layout: RowLayout;
  blockIds: string[];
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemePreset = 'northwell' | 'dark' | 'minimal' | 'highcontrast';

export interface Theme {
  preset: ThemePreset;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
  headingFamily: string;
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export interface NewsletterMeta {
  id: string;
  title: string;
  issueNumber: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Newsletter {
  meta: NewsletterMeta;
  theme: Theme;
  rows: Row[];
  blocks: Record<string, Block>;
}

// ─── Editor State ─────────────────────────────────────────────────────────────

export interface EditorState {
  selectedBlockId: string | null;
  editingBlockId: string | null;
  activePanel: 'blocks' | 'settings' | 'theme' | 'versions';
}

// ─── Save Version ─────────────────────────────────────────────────────────────

export interface SaveVersion {
  id: string;
  label: string;
  savedAt: string;
  newsletter: Newsletter;
}
