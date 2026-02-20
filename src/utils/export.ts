import type { Newsletter } from '../types';

// ─── Collect all page CSS ──────────────────────────────────────────────────

function collectAllStyles(theme: Newsletter['theme']): string {
  // Grab all stylesheets loaded in the page
  let styles = '';
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        styles += rules.map(r => r.cssText).join('\n');
      } catch {
        // Cross-origin sheet — skip
      }
    }
  } catch {
    // Ignore
  }

  // Always include theme variable overrides
  const themeVars = `
    :root {
      --color-primary: ${theme.primaryColor};
      --color-accent: ${theme.accentColor};
      --color-bg: ${theme.backgroundColor};
      --color-surface: ${theme.surfaceColor};
      --color-text: ${theme.textColor};
      --color-muted: ${theme.mutedColor};
      --font-body: ${theme.fontFamily};
      --font-heading: ${theme.headingFamily};
      --font-mono: 'IBM Plex Mono', monospace;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 16px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
      --shadow-lg: 0 8px 32px rgba(0,0,0,0.16);
    }
    /* Hide all editor UI in export */
    .block-controls,
    .row-controls,
    [data-editor-only],
    .upload-btn,
    .add-article-btn,
    .comment-add,
    .comment-delete,
    button[data-editor-only] { display: none !important; }
    /* Print / clean layout */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    }
    .newsletter-preview {
      max-width: 860px;
      margin: 0 auto;
    }
    a { color: var(--color-accent); }
    /* Ticker animation still works in HTML */
    @keyframes ticker-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

  return themeVars + '\n' + styles;
}

// ─── Build standalone HTML string ─────────────────────────────────────────

function buildHTML(newsletter: Newsletter, previewEl: HTMLElement): string {
  const styles = collectAllStyles(newsletter.theme);

  // Clone the preview so we can strip editor-only elements
  const clone = previewEl.cloneNode(true) as HTMLElement;

  // Remove editor-only elements from clone
  clone.querySelectorAll(
    '.block-controls, .row-controls, [data-editor-only], .upload-btn, .add-article-btn, .comment-add, .comment-delete'
  ).forEach(el => el.remove());

  // Remove contenteditable attributes
  clone.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable');
  });

  // Remove outline styles on block wrappers
  clone.querySelectorAll('.block-wrapper').forEach((el: Element) => {
    (el as HTMLElement).style.outline = 'none';
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${newsletter.meta.title} — Issue ${newsletter.meta.issueNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>${styles}</style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;
}

// ─── HTML Export ───────────────────────────────────────────────────────────

export function exportToHTML(newsletter: Newsletter): void {
  const previewEl = document.getElementById('newsletter-preview');
  if (!previewEl) {
    alert('Preview element not found. Make sure you are in the editor.');
    return;
  }

  const html = buildHTML(newsletter, previewEl);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neurology-ai-pulse-issue-${newsletter.meta.issueNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── PDF Export (print-window approach — no external deps, fully reliable) ─

export function exportToPDF(newsletter: Newsletter): void {
  const previewEl = document.getElementById('newsletter-preview');
  if (!previewEl) {
    alert('Preview element not found. Make sure you are in the editor.');
    return;
  }

  const html = buildHTML(newsletter, previewEl);

  // Inject print-specific CSS
  const printCSS = `
    @page {
      size: A4;
      margin: 12mm 14mm;
    }
    @media print {
      html, body {
        width: 210mm;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .newsletter-preview {
        max-width: 100%;
        box-shadow: none !important;
      }
      .block-ticker {
        overflow: hidden;
      }
      .ticker-inner {
        animation: none !important;
      }
      a { color: inherit; text-decoration: none; }
    }
  `;

  const fullHTML = html.replace('</style>', printCSS + '</style>');

  // Open in a new window and trigger print dialog
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Popup was blocked. Please allow popups for this page and try again.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(fullHTML);
  printWindow.document.close();

  // Wait for fonts/images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Close after print dialog is dismissed
      printWindow.onafterprint = () => printWindow.close();
    }, 800);
  };
}
