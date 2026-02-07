# FlowPRD Frontend

Visual PRD Generator built with React + TypeScript + React Flow + Mermaid.js

## Tech Stack

- **React 18** + **TypeScript** - Type-safe component architecture
- **Vite** - Fast build tool and dev server
- **React Flow** - Visual flowchart editor with drag-and-drop
- **Mermaid.js** - Diagram rendering and export
- **TailwindCSS** - Utility-first styling with Squid Game color palette
- **Dagre** - Auto-layout algorithm
- **Lucide React** - Icon library

## Features

<<<<<<< HEAD
### Phase 1: Foundation ✅
- Shape palette toolbar with 7 UML-inspired shape types
- Visual editor canvas with React Flow
- Drag-and-drop functionality
- Squid Game color palette integration
=======
- 📤 Drag & drop file upload
- ✍️ Direct text paste
- 🤖 AI transformation via Gemini
- 📊 Visual diagram with custom SVG shapes
- 🖱️ Hover tooltips showing full section text
- 📋 Copy diagram as JSON
- 💾 Download as JSON file
- ⚠️ Gap detection with AI suggestions
- ✅ Always shows all 10 standard PRD sections
>>>>>>> 2aa74be493c8cc2d0d30fdf6d2788702d2b0e7ba

### Phase 2: Editor Features ✅
- Inline shape editing (double-click to edit)
- Connection drawing between shapes
- Delete with confirmation dialog
- Undo/redo (20 action history)
- Auto-layout button

### Phase 3: Input & Output ✅
- Text input field for PRD descriptions
- File upload (.txt, .md, .docx)
- Mermaid.js diagram rendering
- Export to PNG/SVG
- Copy Mermaid code to clipboard
- Shareable link generation

### Phase 4: Validation UI ✅
- Gap analysis panel with completion tracking
- Convention validation with percentage score
- AI readiness indicator
- Auto-fix suggestions for violations

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
VITE_API_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

<<<<<<< HEAD
### Preview Production Build

```bash
npm run preview
```

## Deployment
=======
2. Click "Transform to Visual Diagram"

3. View results:
   - 📊 Single flowchart with all 10 PRD sections
   - 🖱️ Hover over any shape to see full text
   - ⚠️ Missing sections shown with AI suggestions

4. Export:
   - 📋 Copy diagram data as JSON
   - 💾 Download as .json file
>>>>>>> 2aa74be493c8cc2d0d30fdf6d2788702d2b0e7ba

### Deploy to Vercel

<<<<<<< HEAD
**Option 1: One-Click Deploy**
=======
- React 19
- TypeScript
- Vite (dev server)
- Custom SVG shape rendering (7 shape types)
>>>>>>> 2aa74be493c8cc2d0d30fdf6d2788702d2b0e7ba

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/flowprd&project-name=flowprd-frontend&repository-name=flowprd&root-directory=frontend&env=VITE_API_URL&envDescription=Backend%20API%20URL&envLink=https://github.com/your-username/flowprd)

<<<<<<< HEAD
**Option 2: Vercel CLI**
=======
Frontend proxies API calls to Flask backend at `http://localhost:5001`:
- `POST /api/transform` - Transform PRD to visual diagram data
>>>>>>> 2aa74be493c8cc2d0d30fdf6d2788702d2b0e7ba

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option 3: GitHub Integration**

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Set `frontend` as root directory
4. Add environment variable: `VITE_API_URL`
5. Deploy!

See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for detailed instructions.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | `http://localhost:5000` |

Set in Vercel Dashboard → Settings → Environment Variables for production.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ShapePalette.tsx       # Shape selection toolbar
│   │   ├── VisualEditor.tsx       # React Flow canvas
│   │   ├── CustomNode.tsx         # Custom node component
│   │   ├── InputPanel.tsx         # Text/file input
│   │   ├── ExportPanel.tsx        # Mermaid preview & export
│   │   ├── GapAnalysisPanel.tsx   # Missing sections tracker
│   │   └── ValidationPanel.tsx    # Convention validation
│   ├── hooks/
│   │   └── useUndoRedo.ts         # Undo/redo state management
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── shapeDefinitions.ts    # Shape metadata & colors
│   │   ├── export.ts              # Export utilities
│   │   └── autoLayout.ts          # Dagre layout algorithm
│   ├── App.tsx                    # Main application
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # TailwindCSS config
├── postcss.config.js              # PostCSS config
└── vite.config.ts                 # Vite config
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Pink | #ED1B76 | Stadium (Users/Actors) |
| Teal | #067D72 | Rectangle (Features) |
| Gold | #FFD700 | Parallelogram (Requirements) |
| Navy | #0B1C3D | Hexagon (Constraints) |
| White | #FFFFFF | Diamond (Decisions) |
| Light Pink | #FFE4EC | Cylinder (Databases) |
| Light Teal | #E0F5F3 | Rounded Box (Descriptions) |

## Shape Types

1. **Stadium/Oval** - Start/End Points, Users, Actors
2. **Rectangle** - Standard Items, Features, Processes
3. **Rounded Box** - Descriptions, Details, Pain Points
4. **Parallelogram** - Functional Requirements (FR)
5. **Diamond** - Decisions, Status, Conditions
6. **Hexagon** - Constraints, Rules, Limitations
7. **Cylinder** - Databases, Storage

## Keyboard Shortcuts

- **Double-click** node - Edit label
- **Click + Drag** - Move node
- **Click background** - Add selected shape
- **Delete button** - Remove node (click twice to confirm)

## Backend Integration

The frontend expects the following API endpoints (to be implemented):

- `POST /api/generate` - Convert text to flowchart
- `POST /api/upload` - Process uploaded PRD file
- `POST /api/validate` - Validate PRD structure
- `GET /api/share/:id` - Load shared PRD

## License

MIT
