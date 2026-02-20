import { useState, useEffect, useCallback } from 'react';
import type { Newsletter, SaveVersion } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'neurology-ai-pulse:autosave';
const VERSIONS_KEY = 'neurology-ai-pulse:versions';
const RECENT_KEY = 'neurology-ai-pulse:recent';

export function useNewsletterStorage() {
  const [versions, setVersions] = useState<SaveVersion[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(VERSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const autosave = useCallback((newsletter: Newsletter) => {
    try {
      const updated = {
        ...newsletter,
        meta: { ...newsletter.meta, updatedAt: new Date().toISOString() },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Update recent list
      const recent: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      const filtered = recent.filter(id => id !== newsletter.meta.id);
      localStorage.setItem(RECENT_KEY, JSON.stringify([newsletter.meta.id, ...filtered].slice(0, 5)));
    } catch {
      console.warn('Autosave failed');
    }
  }, []);

  const loadAutosave = useCallback((): Newsletter | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const saveVersion = useCallback((newsletter: Newsletter, label?: string) => {
    const version: SaveVersion = {
      id: uuidv4(),
      label: label || `Version ${newsletter.meta.version} — ${new Date().toLocaleString()}`,
      savedAt: new Date().toISOString(),
      newsletter: {
        ...newsletter,
        meta: {
          ...newsletter.meta,
          version: newsletter.meta.version + 1,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    const updated = [version, ...versions].slice(0, 20); // keep last 20
    setVersions(updated);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
    return version;
  }, [versions]);

  const deleteVersion = useCallback((versionId: string) => {
    const updated = versions.filter(v => v.id !== versionId);
    setVersions(updated);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
  }, [versions]);

  const exportJSON = useCallback((newsletter: Newsletter) => {
    const blob = new Blob([JSON.stringify(newsletter, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurology-ai-pulse-${newsletter.meta.issueNumber}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importJSON = useCallback((file: File): Promise<Newsletter> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data as Newsletter);
        } catch {
          reject(new Error('Invalid newsletter JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    versions,
    autosave,
    loadAutosave,
    saveVersion,
    deleteVersion,
    exportJSON,
    importJSON,
  };
}

export function useAutosave(newsletter: Newsletter | null, intervalMs = 30000) {
  const { autosave } = useNewsletterStorage();

  useEffect(() => {
    if (!newsletter) return;
    const timer = setInterval(() => {
      autosave(newsletter);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [newsletter, autosave, intervalMs]);
}
