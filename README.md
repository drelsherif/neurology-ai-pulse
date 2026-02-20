# Neurology AI Pulse — Newsletter Builder

A professional-grade newsletter editor for medical/neurology AI content, built with React 18, Vite, and TypeScript.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── blocks/
│   │   └── BlockRenderers.tsx     # All 14 block components + BlockRouter
│   ├── editor/
│   │   ├── TopBar.tsx             # Top navigation bar
│   │   ├── Sidebar.tsx            # Left panel (blocks, theme, settings)
│   │   └── Preview.tsx            # Live newsletter preview pane
│   └── layout/
│       └── HomePage.tsx           # Launcher page
├── data/
│   ├── defaults.ts                # Default newsletter template + block factories
│   └── themes.ts                  # Theme presets + CSS variable application
├── hooks/
│   ├── useNewsletter.ts           # Core newsletter state management
│   └── useNewsletterStorage.ts    # localStorage autosave, versioning, import/export
├── styles/
│   ├── global.css                 # Base styles, CSS variables, animations
│   ├── editor.css                 # Editor UI (sidebar, topbar, preview pane)
│   └── blocks.css                 # All block-specific styles
├── types/
│   └── index.ts                   # Complete TypeScript type system
├── utils/
│   └── export.ts                  # HTML and PDF export
├── App.tsx                        # Root component, page routing
└── main.tsx                       # Entry point
```

---

## 🧩 Block Library

| Block | Description |
|-------|-------------|
| `header` | Logo, title, issue number, date, tagline |
| `ticker` | Scrolling news ticker with speed control |
| `section-divider` | Visual separator with label (line/gradient styles) |
| `article-grid` | 1/2/3-column article cards with clinical review fields |
| `spotlight` | Featured article with full layout |
| `ethics-split` | Two-column Issue / My View ethics panel |
| `image` | Image upload with caption, credit, alignment |
| `text` | Freeform text block with optional heading |
| `prompt-masterclass` | Styled clinical AI prompt with code block |
| `term-of-month` | Glossary card with definition + clinical context |
| `history` | Historical moment with large year watermark |
| `humor` | Pull-quote style humor block |
| `spacer` | Configurable vertical spacer |
| `footer` | Institution, links, disclaimer, social icons |

---

## 🎨 Theme System

Four built-in presets:
- **Northwell Blue** — Institutional, professional
- **Dark Mode** — Dark background with cyan accents  
- **Minimal** — Monochromatic, typography-forward
- **High Contrast** — Black/white/yellow, accessibility-first

All themes are implemented via CSS custom properties (`var(--color-primary)`, etc.) applied at runtime. Custom hex colors can be set per-property in the Theme panel.

---

## 💾 Data & Storage

- **Autosave**: Every 30 seconds to `localStorage` (key: `neurology-ai-pulse:autosave`)
- **Version Snapshots**: Manual save-points stored in `localStorage` (up to 20 versions)
- **JSON Export/Import**: Full newsletter state as portable JSON
- **HTML Export**: Standalone, self-contained HTML file
- **PDF Export**: Via `html2canvas` + `jsPDF` (client-side)

### Newsletter JSON Schema

```json
{
  "meta": { "id", "title", "issueNumber", "createdAt", "updatedAt", "version" },
  "theme": { "preset", "primaryColor", "accentColor", "backgroundColor", ... },
  "rows": [{ "id", "layout", "blockIds" }],
  "blocks": { "[blockId]": { "id", "type", ...blockSpecificFields } }
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Autosave |
| `Escape` | Deselect block |
| `Cmd/Ctrl + Enter` | Confirm inline edit |

---

## 📐 Layout Rules

- **1 block per row** → 100% width
- **2 blocks per row** → 50/50
- **3 blocks per row** → 33/33/33
- **2×2 grid** → 4 blocks, 50/50 per row pair
- New blocks added before the footer row by default
- Removing a block auto-collapses empty rows

---

## 🛠️ Extending

### Adding a New Block Type

1. Add the type string to `BlockType` in `src/types/index.ts`
2. Define the block interface extending `BlockBase`
3. Add it to the `Block` union type
4. Add a `case` in `createEmptyBlock()` in `src/hooks/useNewsletter.ts`
5. Create a view component in `src/components/blocks/BlockRenderers.tsx`
6. Add a `case` in `BlockRenderer`
7. Add styles in `src/styles/blocks.css`
8. Add label in `BLOCK_LABELS` in `src/data/defaults.ts`

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react@18` | UI framework |
| `react-dom@18` | DOM rendering |
| `vite@4` | Build tool & dev server |
| `typescript@5` | Type safety |
| `uuid@9` | Block/row ID generation |
| `html2canvas@1` | PDF screenshot rendering |
| `jspdf@2` | PDF generation |

---

## 🏥 About

Built for the **Northwell Health Department of Neurology** to support the *Neurology AI Pulse* newsletter program. Designed to streamline evidence-based AI research communication for clinical audiences.

**Author**: Yasir (Northwell Neurology AI Research)  
**Stack**: React 18 · Vite · TypeScript · CSS Variables
