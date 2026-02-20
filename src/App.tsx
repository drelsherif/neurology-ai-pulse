import { useState, useEffect, useCallback } from 'react';
import type { EditorState, BlockType, Newsletter, ThemePreset } from './types';
import { useNewsletter } from './hooks/useNewsletter';
import { useNewsletterStorage } from './hooks/useNewsletterStorage';
import { applyTheme, THEMES } from './data/themes';
import { TopBar } from './components/editor/TopBar';
import { Sidebar } from './components/editor/Sidebar';
import { NewsletterPreview } from './components/editor/Preview';
import { HomePage } from './components/layout/HomePage';
import { exportToHTML, exportToPDF } from './utils/export';

type AppPage = 'home' | 'editor';

export default function App() {
  const [page, setPage] = useState<AppPage>('home');

  const {
    newsletter, updateBlock, addBlock, removeBlock,
    moveBlockUp, moveBlockDown, updateTheme, updateMeta, loadNewsletter,
  } = useNewsletter();

  const {
    versions, autosave, loadAutosave, saveVersion,
    deleteVersion, exportJSON, importJSON,
  } = useNewsletterStorage();

  const [editorState, setEditorState] = useState<EditorState>({
    selectedBlockId: null,
    editingBlockId: null,
    activePanel: 'blocks',
  });

  const [lastSaved, setLastSaved] = useState<string | undefined>();

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(newsletter.theme);
  }, [newsletter.theme]);

  // Autosave every 30s when in editor
  useEffect(() => {
    if (page !== 'editor') return;
    const timer = setInterval(() => {
      autosave(newsletter);
      setLastSaved(new Date().toISOString());
    }, 30000);
    return () => clearInterval(timer);
  }, [page, newsletter, autosave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorState(s => ({ ...s, selectedBlockId: null, editingBlockId: null }));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        autosave(newsletter);
        setLastSaved(new Date().toISOString());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [newsletter, autosave]);

  // Theme change handler
  const handleThemeChange = useCallback((presetOrTheme: ThemePreset | Partial<Newsletter['theme']>) => {
    if (typeof presetOrTheme === 'string') {
      updateTheme(THEMES[presetOrTheme]);
    } else {
      updateTheme(presetOrTheme);
    }
  }, [updateTheme]);

  const handleSaveVersion = useCallback(() => {
    const label = prompt('Version label (optional):') || undefined;
    saveVersion(newsletter, label);
    autosave(newsletter);
    setLastSaved(new Date().toISOString());
  }, [newsletter, saveVersion, autosave]);

  const handleLoadVersion = useCallback((v: any) => {
    loadNewsletter(v.newsletter);
    setPage('editor');
  }, [loadNewsletter]);

  const handleLoadAutosave = useCallback(() => {
    const saved = loadAutosave();
    if (saved) {
      loadNewsletter(saved);
      setPage('editor');
    } else {
      alert('No autosave found. Creating a new newsletter.');
      setPage('editor');
    }
  }, [loadAutosave, loadNewsletter]);

  const handleImportJSON = useCallback(async (file: File) => {
    try {
      const nl = await importJSON(file);
      loadNewsletter(nl);
      setPage('editor');
    } catch {
      alert('Failed to import newsletter. Make sure the file is valid JSON.');
    }
  }, [importJSON, loadNewsletter]);

  if (page === 'home') {
    return (
      <HomePage
        onCreateNew={() => setPage('editor')}
        onLoadSaved={handleLoadAutosave}
        onImport={handleImportJSON}
        recentVersions={versions}
        onLoadVersion={handleLoadVersion}
      />
    );
  }

  return (
    <div className="app-shell">
      <TopBar
        newsletter={newsletter}
        onSaveVersion={handleSaveVersion}
        onExportHTML={() => exportToHTML(newsletter)}
        onExportPDF={() => exportToPDF(newsletter)}
        onGoHome={() => setPage('home')}
        lastSaved={lastSaved}
      />
      <div className="editor-body">
        <Sidebar
          newsletter={newsletter}
          editorState={editorState}
          setEditorState={setEditorState}
          onAddBlock={(type: BlockType) => addBlock(type)}
          onThemeChange={handleThemeChange as any}
          onUpdateMeta={updateMeta}
          onUpdateBlock={updateBlock}
          versions={versions}
          onSaveVersion={handleSaveVersion}
          onLoadVersion={handleLoadVersion}
          onDeleteVersion={deleteVersion}
          onExportJSON={() => exportJSON(newsletter)}
          onImportJSON={handleImportJSON}
          onExportHTML={() => exportToHTML(newsletter)}
          onExportPDF={() => exportToPDF(newsletter)}
        />
        <NewsletterPreview
          newsletter={newsletter}
          editorState={editorState}
          setEditorState={setEditorState}
          onUpdateBlock={updateBlock}
          onRemoveBlock={removeBlock}
          onMoveRowUp={moveBlockUp}
          onMoveRowDown={moveBlockDown}
        />
      </div>
    </div>
  );
}
