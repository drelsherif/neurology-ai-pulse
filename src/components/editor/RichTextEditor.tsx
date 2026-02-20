import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

type FontPreset = { key: string; label: string; size: string };

const FONT_PRESETS: FontPreset[] = [
  { key: 'sm', label: 'A−', size: '0.95em' },
  { key: 'md', label: 'A', size: '1.00em' },
  { key: 'lg', label: 'A+', size: '1.15em' },
  { key: 'xl', label: 'A++', size: '1.35em' },
];

type ColorPreset = { key: string; label: string; value: string };
const COLOR_PRESETS: ColorPreset[] = [
  { key: 'black', label: 'Black', value: '#0A1628' },
  { key: 'slate', label: 'Slate', value: '#334155' },
  { key: 'blue', label: 'Blue', value: '#009CDE' },
  { key: 'teal', label: 'Teal', value: '#00B5CC' },
  { key: 'green', label: 'Green', value: '#00A651' },
  { key: 'orange', label: 'Orange', value: '#F47920' },
  { key: 'red', label: 'Red', value: '#D72638' },
  { key: 'purple', label: 'Purple', value: '#7B2D8B' },
];



const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => (element as HTMLElement).style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: null }).run(),
    } as any;
  },
});

function looksLikeHTML(v: string) {
  const s = (v || '').trim();
  return s.startsWith('<') && s.includes('>');
}

function toHTML(value: string) {
  const v = value || '';
  if (looksLikeHTML(v)) return v;
  // preserve line breaks
  const escaped = v
    .split('\n')
    .map(line => line.trim() === '' ? '<br/>' : `<p>${escapeHTML(line)}</p>`)
    .join('');
  return escaped || '<p></p>';
}

function escapeHTML(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

type Props = {
  value: string; // stored as HTML string after first edit; accepts plain text too
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Minimal mode hides BubbleMenu (useful for very small fields) */
  minimal?: boolean;
};

export default function RichTextEditor({ value, onChange, placeholder, className, minimal }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      FontSize,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: toHTML(value),
    editorProps: {
      attributes: {
        class: `rte__content ${className || ''}`.trim(),
        'data-placeholder': placeholder || '',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  React.useEffect(() => {
    if (!editor) return;
    const next = toHTML(value);
    const current = editor.getHTML();
    if (current !== next) editor.commands.setContent(next, false);
  }, [editor, value]);

  if (!editor) return null;

  const toggleLink = () => {
    const prev = (editor.getAttributes('link').href as string) || '';
    const url = window.prompt('Enter URL', prev || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const clearFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const clearTextColor = () => {
    editor.chain().focus().unsetColor().run();
  };

  const pickColor = () => {
    const prev = (editor.getAttributes('textStyle') as any)?.color as string | undefined;
    const next = window.prompt('Enter hex color (e.g. #ff00aa)', prev || '#000000');
    if (next === null) return;
    const v = next.trim();
    if (!v) return;
    setTextColor(v);
  };

  const clearFont = () => editor.chain().focus().unsetMark('textStyle').run();

  return (
    <div className={`rte ${minimal ? 'rte--minimal' : ''}`.trim()}>
      {!minimal && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100, placement: 'top' }}>
          <div className="rte__bubble" data-editor-only>
            <button type="button" className={`rte__btn ${editor.isActive('bold') ? 'is-active' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
            <button type="button" className={`rte__btn ${editor.isActive('italic') ? 'is-active' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
            <button type="button" className={`rte__btn ${editor.isActive('underline') ? 'is-active' : ''}`} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
            <span className="rte__sep" />
            {FONT_PRESETS.map(p => (
              <button key={p.key} type="button" className="rte__btn" onClick={() => setFontSize(p.size)}>{p.label}</button>
            ))}
            <button type="button" className="rte__btn" onClick={clearFont}>Reset</button>
            <span className="rte__sep" />
            <div className="rte__colors">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c.key}
                  type="button"
                  className={`rte__colorDot ${editor.getAttributes('textStyle')?.color === c.value ? 'is-active' : ''}`}
                  title={c.label}
                  onClick={() => setTextColor(c.value)}
                  style={{ background: c.value }}
                />
              ))}
              <button type="button" className="rte__btn" onClick={pickColor} title="Custom color">🎨</button>
              <button type="button" className="rte__btn" onClick={clearTextColor} title="Clear color">Clr</button>
            </div>
<span className="rte__sep" />
            <button type="button" className={`rte__btn ${editor.isActive('link') ? 'is-active' : ''}`} onClick={toggleLink}>Link</button>
            <button type="button" className="rte__btn" onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>
          </div>
        </BubbleMenu>
      )}

      <div className="rte__editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}