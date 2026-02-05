# FlowPRD Setup Guide

Complete guide to getting FlowPRD up and running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Gemini API Key** - Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey) - FREE!

---

## Quick Start

### 1. Clone the Repository

```bash
cd /Users/jawadashraf/Desktop/FlowPRD
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# This will install:
# - React 19.2.4
# - Vite 6.2.0
# - Mermaid 10.9.0
# - TypeScript 5.8.2
```

---

## Running the Application

You need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend

```bash
cd /Users/jawadashraf/Desktop/FlowPRD/backend
source venv/bin/activate  # If using virtual environment
python app.py
```

**Backend will run on:** `http://localhost:5000`

You should see:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### Terminal 2: Start Frontend

```bash
cd /Users/jawadashraf/Desktop/FlowPRD/frontend
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

You should see:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

---

## Using FlowPRD

1. **Open your browser** to `http://localhost:3000`

2. **Upload a PRD** in one of these ways:
   - **Drag & drop** a file (.docx, .pdf, .txt, .md)
   - **Click** the upload area to browse files
   - **Switch to text mode** and paste your PRD directly

3. **Click "Transform to Mermaid"**
   - AI will analyze your PRD
   - Generate both Hybrid and Flowchart versions
   - Detect any missing sections

4. **View Results:**
   - **Side-by-side**: See both versions at once
   - **Hybrid only**: Detailed version with text
   - **Flowchart only**: 90%+ UML-compliant visual

5. **Export:**
   - **Copy to clipboard**: Use for Confluence, Notion, etc.
   - **Download as Markdown**: Save for documentation

---

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Problem:** `Gemini API error`
```bash
# Check your .env file
cat .env
# Make sure GEMINI_API_KEY is set correctly
```

**Problem:** `Port 5000 already in use`
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**Problem:** `npm install` fails
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

**Problem:** `Port 3000 already in use`
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Problem:** Mermaid diagrams not rendering
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console for errors
- Ensure backend is running

### Network Issues (Train/Limited Connectivity)

**Problem:** `npm install` taking too long
```bash
# Kill the process
# Find the process ID
ps aux | grep "npm install"
# Kill it
kill -9 <PID>

# Try with reduced concurrency
npm install --prefer-offline --maxsockets 1
```

---

## API Endpoints

### Backend Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "healthy",
  "service": "FlowPRD Backend",
  "version": "1.0.0"
}
```

#### Transform PRD (File Upload)
```bash
curl -X POST http://localhost:5000/api/transform \
  -F "file=@your-prd.docx"
```

#### Transform PRD (Text Input)
```bash
curl -X POST http://localhost:5000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"text": "Your PRD content here..."}'
```

Response:
```json
{
  "success": true,
  "hybrid": "flowchart TD\n...",
  "flowchart": "flowchart TD\n...",
  "gaps_detected": ["Success Metrics", "Timeline"],
  "input_length": 1234
}
```

---

## Project Structure

```
FlowPRD/
├── backend/
│   ├── app.py              # Flask application
│   ├── file_parser.py      # Document parsing
│   ├── ai_transformer.py   # Claude API integration
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── uploads/            # Temporary file storage
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── components/
│   │   │   ├── FileUpload.tsx     # Upload interface
│   │   │   └── ResultsDisplay.tsx # Results viewer
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── index.html          # HTML entry point
│
├── README.md               # Project overview
└── SETUP.md                # This file
```

---

## Tech Stack

### Backend
- **Flask 3.0.0** - Web framework
- **Google Gemini 1.5 Pro** - FREE AI transformation (1M tokens!)
- **python-docx 1.1.0** - Word document parsing
- **PyPDF2 3.0.1** - PDF parsing
- **python-dotenv 1.0.0** - Environment management

### Frontend
- **React 19.2.4** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool & dev server
- **Mermaid 10.9.0** - Diagram rendering

---

## Next Steps

After setup is complete:

1. **Test with sample PRD** - Try the README.md as input
2. **Customize AI prompts** - Edit `ai_transformer.py`
3. **Add more file formats** - Extend `file_parser.py`
4. **Deploy to production** - Use Vercel (frontend) + Railway (backend)

---

## Getting Help

- **Backend issues**: Check `backend/README.md`
- **Frontend issues**: Check `frontend/README.md`
- **API issues**: Test with `curl` commands above
- **Still stuck?**: Review the main `README.md`

---

## License

MIT License - See LICENSE file for details
