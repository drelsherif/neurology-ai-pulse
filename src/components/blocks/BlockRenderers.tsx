import React from 'react';
import RichTextEditor from '../editor/RichTextEditor';
import NeurologyAIPulseLogo from '../branding/NeurologyAIPulseLogo';
import { v4 as uuidv4 } from 'uuid';
import type {
  HeaderBlock, TickerBlock, SectionDividerBlock, ArticleGridBlock,
  SpotlightBlock, EthicsSplitBlock, ImageBlock, TextBlock,
  PromptMasterclassBlock, SbarPromptBlock, SbarStep, TermOfMonthBlock, HistoryBlock, HumorBlock,
  SpacerBlock, FooterBlock, Block, ArticleItem, ArticleComment,
} from '../../types';

// ─── Inline editable field ─────────────────────────────────────────────────

interface EditableProps {
  value: string;
  tag?: string;
  className?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const Editable: React.FC<EditableProps> = ({
  value, tag = 'span', className, onChange, placeholder, style
}) => {
  // Inline usage (span) stays lightweight and plain-text to avoid invalid DOM nesting.
  if (tag === 'span') {
    const ref = React.useRef<HTMLElement>(null);
    const [focused, setFocused] = React.useState(false);

    const handleBlur = () => {
      setFocused(false);
      if (ref.current) onChange(ref.current.innerText);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { if (ref.current) ref.current.blur(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { handleBlur(); }
    };

    return React.createElement(tag, {
      ref,
      className: `editable ${className || ''}`,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onFocus: () => setFocused(true),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      style: { ...style, outline: 'none', minHeight: '1em', cursor: 'text' },
      'data-placeholder': !value && !focused ? (placeholder || 'Click to edit…') : undefined,
      children: value,
    });
  }

  // Block usage uses TipTap (RichTextEditor) to support Word-like selection formatting.
  return (
    <RichTextEditor
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      minimal={['h1','h2','h3','h4','h5','h6'].includes(tag) || (className || '').includes('block-header__')}
    />
  );
};


// ─── Image upload hook ─────────────────────────────────────────────────────

function useImageUpload(onUrl: (url: string) => void) {
  const ref = React.useRef<HTMLInputElement>(null);
  const trigger = () => ref.current?.click();
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => onUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
      }}
    />
  );
  return { trigger, input };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateFn<_T> = (updates: Record<string, any>) => void;

const EVIDENCE_COLORS: Record<string, string> = {
  High: '#16A34A', Moderate: '#2563EB', Low: '#D97706', 'Expert Opinion': '#7C3AED',
};
const EVIDENCE_OPTIONS: ArticleItem['evidenceLevel'][] = ['High', 'Moderate', 'Low', 'Expert Opinion'];

// ═══════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════

export const HeaderBlockView: React.FC<{ block: HeaderBlock; update: UpdateFn<HeaderBlock>; editable?: boolean }> = ({ block, update, editable }) => {
  const { trigger: triggerLogo, input: logoInput } = useImageUpload(url => update({ logoUrl: url }));

  const useAnimated = !!block.useAnimatedLogo;
  const logoSize = block.animatedLogoSize ?? 34;

  return (
    <div className="block-header">
      {logoInput}

      {editable && (
        <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="upload-btn" onClick={triggerLogo}>
            {block.logoUrl ? '🔄 Change Logo' : '📁 Upload Logo'}
          </button>
          {block.logoUrl && (
            <button className="upload-btn upload-btn--danger" onClick={() => update({ logoUrl: undefined })}>
              ✕ Remove
            </button>
          )}

          <button
            className="upload-btn"
            onClick={() => update({ useAnimatedLogo: !useAnimated })}
            title="Toggle animated logo next to the title"
          >
            {useAnimated ? '✨ Animated Logo: ON' : '✨ Animated Logo: OFF'}
          </button>

          {useAnimated && (
            <>
              <button
                className="upload-btn"
                onClick={() => update({ animatedLogoSize: Math.min(64, logoSize + 4) })}
                title="Increase animated logo size"
              >
                ➕ Size
              </button>
              <button
                className="upload-btn"
                onClick={() => update({ animatedLogoSize: Math.max(20, logoSize - 4) })}
                title="Decrease animated logo size"
              >
                ➖ Size
              </button>
            </>
          )}
        </div>
      )}

      <div className="block-header__titleRow">
        <div className="block-header__titleLogo">
          {useAnimated ? (
            <NeurologyAIPulseLogo size={logoSize} showWordmark={false} theme="dark" />
          ) : (
            block.logoUrl ? <img src={block.logoUrl} alt="Logo" className="block-header__logo" /> : null
          )}
        </div>

        <Editable value={block.title} tag="h1" className="block-header__title" onChange={v => update({ title: v })} placeholder="Newsletter Title" />
      </div>

      <Editable value={block.subtitle} className="block-header__subtitle" onChange={v => update({ subtitle: v })} placeholder="Subtitle" />
      <div className="block-header__meta">
        <Editable value={block.issueNumber} onChange={v => update({ issueNumber: v })} placeholder="Issue 001" style={{ display: 'inline' }} />
        <span>•</span>
        <Editable value={block.issueDate} onChange={v => update({ issueDate: v })} placeholder="Date" style={{ display: 'inline' }} />
      </div>
      <Editable value={block.tagline} className="block-header__tagline" onChange={v => update({ tagline: v })} placeholder="Tagline…" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TICKER
// ═══════════════════════════════════════════════════════════

export const TickerBlockView: React.FC<{ block: TickerBlock; update: UpdateFn<TickerBlock>; editable?: boolean }> = ({ block, update, editable }) => {
  const [newItem, setNewItem] = React.useState('');
  const items = block.items.length > 0 ? [...block.items, ...block.items] : ['Add ticker items above'];
  return (
    <div className="block-ticker">
      {editable && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }} data-editor-only>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {block.items.map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: '0.72rem', color: '#fff' }}>
                {item}
                <button onClick={() => update({ items: block.items.filter((_, idx) => idx !== i) })} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={newItem} onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { update({ items: [...block.items, newItem.trim()] }); setNewItem(''); } }}
              placeholder="Add ticker item, press Enter…"
              style={{ flex: 1, padding: '4px 8px', borderRadius: 4, border: 'none', fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            />
            <button onClick={() => { if (newItem.trim()) { update({ items: [...block.items, newItem.trim()] }); setNewItem(''); } }}
              style={{ padding: '4px 12px', background: 'var(--color-accent)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>+ Add</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Speed:</span>
            {(['slow', 'medium', 'fast'] as const).map(s => (
              <button key={s} onClick={() => update({ speed: s })}
                style={{ padding: '2px 8px', borderRadius: 4, border: `1px solid ${block.speed === s ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)'}`, background: block.speed === s ? 'var(--color-accent)' : 'none', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="ticker-track">
        <div className={`ticker-inner ticker-inner--${block.speed}`}>
          {items.map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
        </div>
        <div className={`ticker-inner ticker-inner--${block.speed}`} aria-hidden>
          {items.map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SECTION DIVIDER
// ═══════════════════════════════════════════════════════════

export const SectionDividerBlockView: React.FC<{ block: SectionDividerBlock; update: UpdateFn<SectionDividerBlock>; editable?: boolean }> = ({ block, update, editable }) => (
  <div className="block-section-divider">
    {editable && (
      <select value={block.style} onChange={e => update({ style: e.target.value as any })}
        style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, marginRight: 8 }} data-editor-only>
        <option value="gradient">Gradient</option>
        <option value="line">Line</option>
      </select>
    )}
    <div className={block.style === 'gradient' ? 'section-divider__gradient' : 'section-divider__line'} />
    <Editable value={block.label} className="section-divider__label" onChange={v => update({ label: v })} placeholder="SECTION" />
    <div className={block.style === 'gradient' ? 'section-divider__gradient' : 'section-divider__line'} />
  </div>
);

// ═══════════════════════════════════════════════════════════
// ARTICLE CARD (with image + comments)
// ═══════════════════════════════════════════════════════════

interface ArticleCardProps {
  article: ArticleItem;
  editable: boolean;
  onUpdate: (updates: Partial<ArticleItem>) => void;
  onRemove: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, editable, onUpdate, onRemove }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');
  const [newRole, setNewRole] = React.useState('');
  const { trigger: triggerImg, input: imgInput } = useImageUpload(url => onUpdate({ imageUrl: url }));

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: ArticleComment = {
      id: uuidv4(),
      author: newAuthor || 'Anonymous',
      role: newRole || '',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    };
    onUpdate({ comments: [...(article.comments || []), comment] });
    setNewComment(''); setNewAuthor(''); setNewRole('');
  };

  return (
    <div className="article-card">
      {imgInput}

      {/* Article image */}
      {article.imageUrl ? (
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
          {editable && (
            <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 }}>
              <button className="upload-btn" style={{ fontSize: '0.65rem', padding: '2px 6px' }} onClick={triggerImg}>🔄</button>
              <button className="upload-btn upload-btn--danger" style={{ fontSize: '0.65rem', padding: '2px 6px' }} onClick={() => onUpdate({ imageUrl: '' })}>✕</button>
            </div>
          )}
        </div>
      ) : editable ? (
        <button className="upload-btn" style={{ width: '100%', marginBottom: 10 }} onClick={triggerImg}>📁 Add Article Image</button>
      ) : null}

      {/* Source + Evidence */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
        <Editable value={article.source} className="article-card__source" onChange={v => onUpdate({ source: v })} placeholder="Journal" />
        {editable ? (
          <select value={article.evidenceLevel} onChange={e => onUpdate({ evidenceLevel: e.target.value as ArticleItem['evidenceLevel'] })}
            style={{ fontSize: '0.65rem', padding: '2px 6px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 99 }}>
            {EVIDENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <span className="article-card__evidence" style={{ color: EVIDENCE_COLORS[article.evidenceLevel], background: `${EVIDENCE_COLORS[article.evidenceLevel]}18` }}>
            {article.evidenceLevel} Evidence
          </span>
        )}
      </div>

      {/* Title */}
      {editable ? (
        <Editable value={article.title} tag="div" className="article-card__title" onChange={v => onUpdate({ title: v })} placeholder="Article Title" />
      ) : (
        <div className="article-card__title">
          {article.url ? <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a> : article.title}
        </div>
      )}

      {/* URL field (editor only) */}
      {editable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', flexShrink: 0 }}>🔗</span>
          <input value={article.url} onChange={e => onUpdate({ url: e.target.value })} placeholder="https://doi.org/..."
            style={{ flex: 1, fontSize: '0.7rem', padding: '3px 6px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
        </div>
      )}

      {/* Summary */}
      <div className="article-card__review-block">
        <div className="article-card__review-label">Summary</div>
        <Editable value={article.summary} tag="div" className="article-card__review-text" onChange={v => onUpdate({ summary: v })} placeholder="Summary…" />
      </div>

      {/* Clinical Review */}
      <div className="article-card__review-block">
        <div className="article-card__review-label">Clinical Review</div>
        <Editable value={article.clinicalReview} tag="div" className="article-card__review-text" onChange={v => onUpdate({ clinicalReview: v })} placeholder="Clinical review…" />
      </div>

      {/* My View */}
      <div className="article-card__review-block">
        <div className="article-card__review-label">My View</div>
        <Editable value={article.myView} tag="div" className="article-card__review-text" style={{ fontStyle: 'italic', color: 'var(--color-primary)' }} onChange={v => onUpdate({ myView: v })} placeholder="Your perspective…" />
      </div>

      {/* ── Comments ── */}
      <div className="article-card__comments">
        <button className="comments-toggle" onClick={() => setShowComments(s => !s)}>
          💬 {article.comments?.length || 0} Comment{(article.comments?.length || 0) !== 1 ? 's' : ''} {showComments ? '▲' : '▼'}
        </button>

        {showComments && (
          <div className="comments-body">
            {(article.comments || []).length === 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', padding: '8px 0', fontStyle: 'italic' }}>No comments yet.</div>
            )}
            {(article.comments || []).map(c => (
              <div key={c.id} className="comment-item">
                <div className="comment-meta">
                  <strong className="comment-author">{c.author}</strong>
                  {c.role && <span className="comment-role">{c.role}</span>}
                  <span className="comment-time">{new Date(c.timestamp).toLocaleDateString()}</span>
                  <button onClick={() => onUpdate({ comments: (article.comments || []).filter(x => x.id !== c.id) })} className="comment-delete">✕</button>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}

            <div className="comment-add">
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="Your name"
                  style={{ flex: 1, fontSize: '0.72rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
                <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Role (optional)"
                  style={{ flex: 1, fontSize: '0.72rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={newComment} onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addComment()}
                  placeholder="Add a comment… (Enter to post)"
                  style={{ flex: 1, fontSize: '0.72rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
                <button onClick={addComment}
                  style={{ padding: '4px 12px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.72rem', cursor: 'pointer' }}>Post</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editable && (
        <button className="upload-btn upload-btn--danger" style={{ width: '100%', marginTop: 8 }} onClick={onRemove}>
          🗑️ Remove Article
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ARTICLE GRID
// ═══════════════════════════════════════════════════════════

export const ArticleGridBlockView: React.FC<{ block: ArticleGridBlock; update: UpdateFn<ArticleGridBlock>; editable?: boolean }> = ({ block, update, editable = false }) => {
  const updateArticle = (aid: string, updates: Partial<ArticleItem>) =>
    update({ articles: block.articles.map(a => a.id === aid ? { ...a, ...updates } : a) });

  const addArticle = () => {
    const newArt: ArticleItem = {
      id: uuidv4(), title: 'New Article Title', source: 'Journal', url: '', imageUrl: '',
      summary: 'Article summary here.', clinicalReview: 'Clinical review here.',
      myView: 'My view here.', evidenceLevel: 'Moderate', comments: [],
    };
    update({ articles: [...block.articles, newArt] });
  };

  return (
    <div className="block-article-grid">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <Editable value={block.sectionTitle} tag="div" className="article-grid__title" style={{ marginBottom: 0, flex: 1 }} onChange={v => update({ sectionTitle: v })} placeholder="Section Title" />
        {editable && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Columns:</span>
            {([1, 2, 3] as const).map(c => (
              <button key={c} onClick={() => update({ columns: c })}
                style={{ width: 28, height: 28, borderRadius: 4, border: `2px solid ${block.columns === c ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)'}`, background: block.columns === c ? 'var(--color-primary)' : 'none', color: block.columns === c ? '#fff' : 'var(--color-text)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`article-grid__grid article-grid__grid--${block.columns}`}>
        {block.articles.map(article => (
          <ArticleCard key={article.id} article={article} editable={editable}
            onUpdate={updates => updateArticle(article.id, updates)}
            onRemove={() => update({ articles: block.articles.filter(a => a.id !== article.id) })}
          />
        ))}
        {editable && (
          <button className="add-article-btn" onClick={addArticle}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 6 }}>+</span>
            Add Article
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SPOTLIGHT
// ═══════════════════════════════════════════════════════════

export const SpotlightBlockView: React.FC<{ block: SpotlightBlock; update: UpdateFn<SpotlightBlock>; editable?: boolean }> = ({ block, update, editable }) => {
  const { trigger: triggerImg, input: imgInput } = useImageUpload(url => update({ imageUrl: url }));
  return (
    <div className="block-spotlight">
      {imgInput}
      <div className="spotlight__badge">⭐ SPOTLIGHT ARTICLE</div>
      {editable && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <button className="upload-btn" onClick={triggerImg}>{block.imageUrl ? '🔄 Change Image' : '📁 Add Cover Image'}</button>
          {block.imageUrl && <button className="upload-btn upload-btn--danger" onClick={() => update({ imageUrl: undefined })}>✕ Remove</button>}
          <select value={block.evidenceLevel} onChange={e => update({ evidenceLevel: e.target.value as any })}
            style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}>
            {EVIDENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )}
      {block.imageUrl && <img src={block.imageUrl} alt={block.title} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 16, maxHeight: 300, objectFit: 'cover' }} />}
      <Editable value={block.title} tag="h2" className="spotlight__title" onChange={v => update({ title: v })} placeholder="Spotlight Title" />
      {editable ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <Editable value={block.source} className="spotlight__source" style={{ marginBottom: 0 }} onChange={v => update({ source: v })} placeholder="Journal" />
          <input value={block.url} onChange={e => update({ url: e.target.value })} placeholder="Article URL…"
            style={{ flex: 1, minWidth: 160, fontSize: '0.75rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }} />
        </div>
      ) : (
        <div className="spotlight__source">{block.source} · {block.evidenceLevel} Evidence</div>
      )}
      <Editable value={block.summary} tag="p" style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--color-text)', marginBottom: 20 }} onChange={v => update({ summary: v })} placeholder="Summary…" />
      <div className="spotlight__body">
        <div>
          <div className="spotlight__section-label">Clinical Review</div>
          <Editable value={block.clinicalReview} tag="div" className="spotlight__section-text" onChange={v => update({ clinicalReview: v })} placeholder="Clinical review…" />
        </div>
        <div>
          <div className="spotlight__section-label">My View</div>
          <Editable value={block.myView} tag="div" className="spotlight__section-text" style={{ fontStyle: 'italic', color: 'var(--color-primary)' }} onChange={v => update({ myView: v })} placeholder="Your perspective…" />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ETHICS SPLIT
// ═══════════════════════════════════════════════════════════

export const EthicsSplitBlockView: React.FC<{ block: EthicsSplitBlock; update: UpdateFn<EthicsSplitBlock> }> = ({ block, update }) => (
  <div className="block-ethics-split">
    <Editable value={block.topic} tag="div" className="ethics-split__topic" onChange={v => update({ topic: v })} placeholder="Ethics Topic" />
    <div className="ethics-split__columns">
      <div className="ethics-column ethics-column--issue">
        <div className="ethics-column__label">The Issue</div>
        <Editable value={block.issue} tag="div" className="ethics-column__text" onChange={v => update({ issue: v })} placeholder="Describe the ethical issue…" />
      </div>
      <div className="ethics-column ethics-column--view">
        <div className="ethics-column__label">My View</div>
        <Editable value={block.myView} tag="div" className="ethics-column__text" onChange={v => update({ myView: v })} placeholder="Your perspective…" />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// IMAGE BLOCK
// ═══════════════════════════════════════════════════════════

export const ImageBlockView: React.FC<{ block: ImageBlock; update: UpdateFn<ImageBlock>; editable?: boolean }> = ({ block, update, editable }) => {
  const { trigger: triggerImg, input: imgInput } = useImageUpload(url => update({ imageUrl: url }));
  return (
    <div className={`block-image block-image--${block.alignment}`}>
      {imgInput}
      {editable && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
          <button className="upload-btn" onClick={triggerImg}>{block.imageUrl ? '🔄 Change Image' : '📁 Upload Image'}</button>
          {block.imageUrl && <button className="upload-btn upload-btn--danger" onClick={() => update({ imageUrl: '' })}>✕ Remove</button>}
          {(['left', 'center', 'right'] as const).map(a => (
            <button key={a} onClick={() => update({ alignment: a })}
              style={{ padding: '4px 8px', border: `1px solid ${block.alignment === a ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)'}`, background: block.alignment === a ? 'var(--color-primary)' : 'none', color: block.alignment === a ? '#fff' : 'var(--color-text)', borderRadius: 4, fontSize: '0.72rem', cursor: 'pointer' }}>
              {a === 'left' ? '⬅ Left' : a === 'center' ? '↔ Center' : '➡ Right'}
            </button>
          ))}
        </div>
      )}
      {block.imageUrl ? (
        <img src={block.imageUrl} alt={block.altText || 'Image'} style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }} />
      ) : (
        <div onClick={editable ? triggerImg : undefined}
          style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '0.85rem', cursor: editable ? 'pointer' : 'default', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '2rem' }}>🖼️</span>
          <span>{editable ? 'Click to upload image' : 'No image'}</span>
        </div>
      )}
      {editable ? (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input value={block.altText} onChange={e => update({ altText: e.target.value })} placeholder="Alt text (accessibility)" style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
          <input value={block.caption} onChange={e => update({ caption: e.target.value })} placeholder="Caption…" style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
          <input value={block.credit || ''} onChange={e => update({ credit: e.target.value })} placeholder="Image credit (optional)" style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4 }} />
        </div>
      ) : (
        <>
          {block.caption && <div className="block-image__caption">{block.caption}</div>}
          {block.credit && <div className="block-image__credit">Credit: {block.credit}</div>}
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TEXT BLOCK
// ═══════════════════════════════════════════════════════════

export const TextBlockView: React.FC<{ block: TextBlock; update: UpdateFn<TextBlock> }> = ({ block, update }) => (
  <div className="block-text">
    <Editable value={block.heading || ''} tag="h3" className="block-text__heading" onChange={v => update({ heading: v })} placeholder="Heading (optional)" />
    <Editable value={block.content} tag="div" className="block-text__content" onChange={v => update({ content: v })} placeholder="Text content here…" />
  </div>
);

// ═══════════════════════════════════════════════════════════
// PROMPT MASTERCLASS
// ═══════════════════════════════════════════════════════════

export const PromptMasterclassBlockView: React.FC<{ block: PromptMasterclassBlock; update: UpdateFn<PromptMasterclassBlock> }> = ({ block, update }) => (
  <div className="block-prompt">
    <div className="prompt__badge">🤖 PROMPT MASTERCLASS</div>
    <Editable value={block.title} tag="div" className="prompt__title" onChange={v => update({ title: v })} placeholder="Masterclass Title" />
    <Editable value={block.prompt} tag="div" className="prompt__code" onChange={v => update({ prompt: v })} placeholder="Paste the prompt here…" />
    <div className="prompt__meta">
      <div className="prompt__meta-section">
        <label>Why It Works</label>
        <Editable value={block.explanation} tag="p" onChange={v => update({ explanation: v })} placeholder="Explanation…" />
      </div>
      <div className="prompt__meta-section">
        <label>Use Case</label>
        <Editable value={block.useCase} tag="p" onChange={v => update({ useCase: v })} placeholder="Use case…" />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// SBAR-P PROMPT FRAMEWORK BLOCK
// ═══════════════════════════════════════════════════════════

const SBAR_ACCENT_COLORS: Record<string, string> = {
  S: '#38BDF8', B: '#818CF8', A: '#34D399', R: '#FB923C', P: '#F472B6',
};

export const SbarPromptBlockView: React.FC<{ block: SbarPromptBlock; update: UpdateFn<SbarPromptBlock>; editable?: boolean }> = ({ block, update, editable }) => {
  const updateStep = (i: number, field: keyof SbarStep, value: string) => {
    const steps = [...block.steps];
    steps[i] = { ...steps[i], [field]: value };
    update({ steps });
  };
  const updateSafetyNote = (i: number, value: string) => {
    const notes = [...block.safetyNotes];
    notes[i] = value;
    update({ safetyNotes: notes });
  };

  return (
    <div className="block-sbar">
      <div className="sbar__header">
        <div className="sbar__badge">🤖 PROMPTING FRAMEWORK</div>
        <Editable value={block.title} tag="div" className="sbar__title" onChange={v => update({ title: v })} placeholder="Framework Title" />
        <Editable value={block.intro} tag="p" className="sbar__intro" onChange={v => update({ intro: v })} placeholder="Intro text…" />
        <div className="sbar__acronym">
          {block.steps.map(s => (
            <span key={s.letter} className="sbar__acronym-letter" style={{ color: SBAR_ACCENT_COLORS[s.letter] || '#38BDF8' }}>
              {s.letter}
            </span>
          ))}
        </div>
        <div className="sbar__acronym-sub">
          {block.steps.map((s, i) => (
            <span key={s.letter}>
              <Editable value={s.name} tag="span" onChange={v => updateStep(i, 'name', v)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.6rem' }} />
              {i < block.steps.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div className="sbar__steps">
        {block.steps.map((step, i) => (
          <div key={step.letter} className="sbar__step" style={{ borderTopColor: SBAR_ACCENT_COLORS[step.letter] || '#38BDF8' }}>
            <div className="sbar__step-letter" style={{ color: SBAR_ACCENT_COLORS[step.letter] || '#38BDF8' }}>
              <Editable value={step.letter} tag="span" onChange={v => updateStep(i, 'letter', v)} />
            </div>
            <div className="sbar__step-name">
              <Editable value={step.name} tag="span" onChange={v => updateStep(i, 'name', v)} placeholder="Name" />
            </div>
            <div className="sbar__step-desc">
              <Editable value={step.description} tag="p" onChange={v => updateStep(i, 'description', v)} placeholder="Describe this step…" />
            </div>
            <div className="sbar__step-example">
              <Editable value={step.example} tag="span" onChange={v => updateStep(i, 'example', v)} placeholder="e.g. example phrase…" />
            </div>
          </div>
        ))}
      </div>

      {/* Full prompt template */}
      <div className="sbar__prompt-section">
        <div className="sbar__prompt-label">📋 Prompt Template — click to edit</div>
        <Editable value={block.promptTemplate} tag="div" className="sbar__prompt-code" onChange={v => update({ promptTemplate: v })} placeholder="Paste your full prompt template here…" />
      </div>

      {/* Safety notes */}
      {block.safetyNotes.length > 0 && (
        <div className="sbar__safety">
          <div className="sbar__safety-title">⚠️ AI Safety Reminders</div>
          <div className="sbar__safety-grid">
            {block.safetyNotes.map((note, i) => (
              <div key={i} className="sbar__safety-item">
                <span className="sbar__safety-check">✓</span>
                <Editable value={note} tag="span" className="sbar__safety-text" onChange={v => updateSafetyNote(i, v)} placeholder="Safety note…" />
                {editable && (
                  <button onClick={() => update({ safetyNotes: block.safetyNotes.filter((_, idx) => idx !== i) })}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.7rem', marginLeft: 4 }}>✕</button>
                )}
              </div>
            ))}
          </div>
          {editable && (
            <button onClick={() => update({ safetyNotes: [...block.safetyNotes, 'New safety note…'] })}
              style={{ marginTop: 10, padding: '3px 12px', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', cursor: 'pointer' }}>
              + Add Note
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TERM OF MONTH
// ═══════════════════════════════════════════════════════════

export const TermOfMonthBlockView: React.FC<{ block: TermOfMonthBlock; update: UpdateFn<TermOfMonthBlock> }> = ({ block, update }) => (
  <div className="block-term">
    <div className="term__label">📖 Term of the Month</div>
    <Editable value={block.term} tag="div" className="term__word" onChange={v => update({ term: v })} placeholder="Term" />
    <Editable value={block.definition} tag="div" className="term__definition" onChange={v => update({ definition: v })} placeholder="Definition…" />
    <div className="term__context-label">Clinical Context</div>
    <Editable value={block.clinicalContext} tag="div" className="term__context" onChange={v => update({ clinicalContext: v })} placeholder="Clinical context…" />
  </div>
);

// ═══════════════════════════════════════════════════════════
// HISTORY BLOCK
// ═══════════════════════════════════════════════════════════

export const HistoryBlockView: React.FC<{ block: HistoryBlock; update: UpdateFn<HistoryBlock> }> = ({ block, update }) => (
  <div className="block-history">
    <Editable value={block.year} tag="div" className="history__year" onChange={v => update({ year: v })} placeholder="Year" />
    <div className="history__content">
      <Editable value={block.title} tag="div" className="history__title" onChange={v => update({ title: v })} placeholder="Historical Event Title" />
      <Editable value={block.content} tag="div" className="history__text" onChange={v => update({ content: v })} placeholder="Historical content…" />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// HUMOR BLOCK
// ═══════════════════════════════════════════════════════════

export const HumorBlockView: React.FC<{ block: HumorBlock; update: UpdateFn<HumorBlock> }> = ({ block, update }) => (
  <div className="block-humor">
    <Editable value={block.heading} tag="div" className="humor__heading" onChange={v => update({ heading: v })} placeholder="Section Heading" />
    <Editable value={block.content} tag="div" className="humor__content" onChange={v => update({ content: v })} placeholder="Humorous content…" />
    <Editable value={block.attribution || ''} tag="div" className="humor__attribution" onChange={v => update({ attribution: v })} placeholder="— Attribution" />
  </div>
);

// ═══════════════════════════════════════════════════════════
// SPACER BLOCK
// ═══════════════════════════════════════════════════════════

export const SpacerBlockView: React.FC<{ block: SpacerBlock; update: UpdateFn<SpacerBlock>; editable?: boolean }> = ({ block, update, editable }) => (
  <div style={{ height: block.height, position: 'relative' }}>
    {editable && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: 4, gap: 10 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Spacer: {block.height}px</span>
        <input type="range" min={8} max={120} value={block.height} onChange={e => update({ height: Number(e.target.value) })} style={{ width: 80 }} />
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════
// FOOTER BLOCK
// ═══════════════════════════════════════════════════════════

export const FooterBlockView: React.FC<{ block: FooterBlock; update: UpdateFn<FooterBlock>; editable?: boolean }> = ({ block, update, editable }) => (
  <div className="block-footer">
    <div className="footer__top">
      <div>
        <Editable value={block.institution} tag="div" className="footer__brand" onChange={v => update({ institution: v })} placeholder="Institution" />
        <Editable value={block.department} tag="div" className="footer__dept" onChange={v => update({ department: v })} placeholder="Department" />
        <div style={{ marginTop: 6, fontSize: '0.72rem', opacity: 0.75 }}>
          {editable ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>📧</span>
              <input value={block.contactEmail || ''} onChange={e => update({ contactEmail: e.target.value })}
                placeholder="contact@email.com"
                style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 180 }} />
            </div>
          ) : block.contactEmail ? (
            <a href={`mailto:${block.contactEmail}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              📧 {block.contactEmail}
            </a>
          ) : null}
        </div>
      </div>
      <div className="footer__socials">
        {block.socials.map((s, i) => (
          editable ? (
            <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
              <input value={s.platform} onChange={e => { const soc = [...block.socials]; soc[i] = { ...s, platform: e.target.value }; update({ socials: soc }); }}
                style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 80 }} />
              <input value={s.url} onChange={e => { const soc = [...block.socials]; soc[i] = { ...s, url: e.target.value }; update({ socials: soc }); }}
                style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 110 }} />
              <button onClick={() => update({ socials: block.socials.filter((_, idx) => idx !== i) })}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
            </div>
          ) : (
            <a key={i} href={s.url} className="footer__social-link" target="_blank" rel="noopener noreferrer">{s.platform}</a>
          )
        ))}
        {editable && (
          <button onClick={() => update({ socials: [...block.socials, { platform: 'Platform', url: '#' }] })}
            style={{ padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.3)', background: 'none', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', marginTop: 4 }}>
            + Add Social
          </button>
        )}
      </div>
    </div>

    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 8 }}>Contributors</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {((block as any).contributors || []).map((c: any, i: number) => (
          editable ? (
            <div key={c.id} style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 8px' }}>
              <input value={c.name} onChange={e => { const cs = [...((block as any).contributors||[])]; cs[i] = { ...c, name: e.target.value }; update({ contributors: cs } as any); }}
                placeholder="Name" style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 110 }} />
              <input value={c.role} onChange={e => { const cs = [...((block as any).contributors||[])]; cs[i] = { ...c, role: e.target.value }; update({ contributors: cs } as any); }}
                placeholder="Role" style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 90 }} />
              <input value={c.url || ''} onChange={e => { const cs = [...((block as any).contributors||[])]; cs[i] = { ...c, url: e.target.value }; update({ contributors: cs } as any); }}
                placeholder="URL" style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 100 }} />
              <button onClick={() => update({ contributors: ((block as any).contributors||[]).filter((_: any, idx: number) => idx !== i) } as any)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
            </div>
          ) : (
            <div key={c.id} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>
              {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 600 }}>{c.name}</a>
                : <span style={{ fontWeight: 600 }}>{c.name}</span>}
              {c.role && <span style={{ opacity: 0.6 }}> · {c.role}</span>}
            </div>
          )
        ))}
      </div>
      {editable && (
        <button onClick={() => update({ contributors: [...((block as any).contributors||[]), { id: Date.now().toString(), name: 'Contributor', role: 'Role', url: '' }] } as any)}
          style={{ marginTop: 8, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.3)', background: 'none', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}>
          + Add Contributor
        </button>
      )}
    </div>

    <hr className="footer__divider" />
    <Editable value={block.disclaimer} tag="div" className="footer__disclaimer" onChange={v => update({ disclaimer: v })} placeholder="Disclaimer text…" />
    <div className="footer__bottom">
      <span>© <Editable value={block.copyrightYear} tag="span" onChange={v => update({ copyrightYear: v })} /> {block.institution}</span>
      {editable ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={block.unsubscribeUrl} onChange={e => update({ unsubscribeUrl: e.target.value })} placeholder="Unsubscribe URL"
            style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 130 }} />
          <input value={block.websiteUrl} onChange={e => update({ websiteUrl: e.target.value })} placeholder="Website URL"
            style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', width: 130 }} />
        </div>
      ) : (
        <span><a href={block.unsubscribeUrl} style={{ color: 'rgba(255,255,255,0.5)' }}>Unsubscribe</a> · <a href={block.websiteUrl} style={{ color: 'rgba(255,255,255,0.5)' }}>Website</a></span>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// BLOCK ROUTER
// ═══════════════════════════════════════════════════════════

interface BlockRendererProps {
  block: Block;
  update: (updates: Partial<Block>) => void;
  editable?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, update, editable }) => {
  const u = (updates: Partial<any>) => update(updates);
  switch (block.type) {
    case 'header':             return <HeaderBlockView block={block} update={u} editable={editable} />;
    case 'ticker':             return <TickerBlockView block={block} update={u} editable={editable} />;
    case 'section-divider':    return <SectionDividerBlockView block={block} update={u} editable={editable} />;
    case 'article-grid':       return <ArticleGridBlockView block={block} update={u} editable={editable} />;
    case 'spotlight':          return <SpotlightBlockView block={block} update={u} editable={editable} />;
    case 'ethics-split':       return <EthicsSplitBlockView block={block} update={u} />;
    case 'image':              return <ImageBlockView block={block} update={u} editable={editable} />;
    case 'text':               return <TextBlockView block={block} update={u} />;
    case 'prompt-masterclass': return <PromptMasterclassBlockView block={block} update={u} />;
    case 'sbar-prompt':        return <SbarPromptBlockView block={block as SbarPromptBlock} update={u as any} editable={editable} />;
    case 'term-of-month':      return <TermOfMonthBlockView block={block} update={u} />;
    case 'history':            return <HistoryBlockView block={block} update={u} />;
    case 'humor':              return <HumorBlockView block={block} update={u} />;
    case 'spacer':             return <SpacerBlockView block={block} update={u} editable={editable} />;
    case 'footer':             return <FooterBlockView block={block} update={u} editable={editable} />;
    default: return <div style={{ padding: 20, color: 'red' }}>Unknown block type</div>;
  }
};
