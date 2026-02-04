# FlowPRD Frontend

React + TypeScript frontend for FlowPRD AI-powered PRD transformer.

## Features

- 📤 Drag & drop file upload
- ✍️ Direct text paste
- 🤖 AI transformation via Claude
- 📊 Side-by-side diagram view
- 🔄 Toggle between Hybrid and Flowchart-only
- 📋 Copy to clipboard
- 💾 Download as Markdown
- ⚠️ Gap detection alerts

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

Frontend runs on: http://localhost:3000

## Usage

1. Choose input method:
   - 📄 Upload File (.docx, .pdf, .txt, .md)
   - ✍️ Paste Text directly

2. Click "Transform to Mermaid"

3. View results:
   - ⚡ Side-by-Side (both versions)
   - 📊 Hybrid Only (diagram + text)
   - 🔄 Flowchart Only (pure visual)

4. Export:
   - 📋 Copy to clipboard
   - 💾 Download as .md file

## Tech Stack

- React 19
- TypeScript
- Vite (dev server)
- Mermaid.js (diagram rendering)

## API Connection

Frontend proxies API calls to Flask backend at `http://localhost:5000`:
- `POST /api/transform` - Transform PRD

Make sure backend is running before starting frontend!
