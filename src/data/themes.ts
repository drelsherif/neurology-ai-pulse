import type { Theme, ThemePreset } from '../types';

export const THEMES: Record<ThemePreset, Theme> = {
  northwell: {
    preset: 'northwell',
    primaryColor: '#003087',   // Northwell deep blue
    accentColor: '#00A3E0',    // Northwell sky blue
    backgroundColor: '#F5F7FA',
    surfaceColor: '#FFFFFF',
    textColor: '#1A1A2E',
    mutedColor: '#6B7280',
    fontFamily: "'IBM Plex Sans', sans-serif",
    headingFamily: "'Playfair Display', serif",
  },
  dark: {
    preset: 'dark',
    primaryColor: '#00A3E0',
    accentColor: '#38BDF8',
    backgroundColor: '#0F172A',
    surfaceColor: '#1E293B',
    textColor: '#E2E8F0',
    mutedColor: '#94A3B8',
    fontFamily: "'IBM Plex Sans', sans-serif",
    headingFamily: "'Playfair Display', serif",
  },
  minimal: {
    preset: 'minimal',
    primaryColor: '#18181B',
    accentColor: '#52525B',
    backgroundColor: '#FAFAFA',
    surfaceColor: '#FFFFFF',
    textColor: '#09090B',
    mutedColor: '#A1A1AA',
    fontFamily: "'IBM Plex Sans', sans-serif",
    headingFamily: "'IBM Plex Sans', sans-serif",
  },
  highcontrast: {
    preset: 'highcontrast',
    primaryColor: '#000000',
    accentColor: '#FFDD00',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F0F0F0',
    textColor: '#000000',
    mutedColor: '#333333',
    fontFamily: "'IBM Plex Sans', sans-serif",
    headingFamily: "'Playfair Display', serif",
  },
};

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-bg', theme.backgroundColor);
  root.style.setProperty('--color-surface', theme.surfaceColor);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-muted', theme.mutedColor);
  root.style.setProperty('--font-body', theme.fontFamily);
  root.style.setProperty('--font-heading', theme.headingFamily);
}

export const THEME_LABELS: Record<ThemePreset, string> = {
  northwell: '🏥 Northwell Blue',
  dark: '🌙 Dark Mode',
  minimal: '⬜ Minimal',
  highcontrast: '⚡ High Contrast',
};
