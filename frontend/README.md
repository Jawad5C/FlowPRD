# FlowPRD Frontend

React + TypeScript frontend for FlowPRD AI-powered PRD transformer.

## Features

- 📤 Drag & drop file upload
- ✍️ Direct text paste
- 🤖 AI transformation via Gemini
- 📊 Visual diagram with custom SVG shapes
- 🖱️ Hover tooltips showing full section text
- 📋 Copy diagram as JSON
- 💾 Download as JSON file
- ⚠️ Gap detection with AI suggestions
- ✅ Always shows all 10 standard PRD sections

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

2. Click "Transform to Visual Diagram"

3. View results:
   - 📊 Single flowchart with all 10 PRD sections
   - 🖱️ Hover over any shape to see full text
   - ⚠️ Missing sections shown with AI suggestions

4. Export:
   - 📋 Copy diagram data as JSON
   - 💾 Download as .json file

## Tech Stack

- React 19
- TypeScript
- Vite (dev server)
- Custom SVG shape rendering (7 shape types)

## API Connection

Frontend proxies API calls to Flask backend at `http://localhost:5001`:
- `POST /api/transform` - Transform PRD to visual diagram data

Make sure backend is running before starting frontend!
