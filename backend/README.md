# FlowPRD Backend

Python Flask API for AI-powered PRD transformation.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Get Gemini API Key (FREE):**
- Go to: https://aistudio.google.com/app/apikey
- Sign in with Google account
- Click "Create API Key"
- Copy and add to `.env` file
- No credit card required!

4. **Run server:**
```bash
python app.py
```

Server runs on: http://localhost:5000

## API Endpoints

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "FlowPRD Backend",
  "version": "1.0.0"
}
```

### `POST /api/transform`
Transform PRD file or text into Mermaid diagrams.

**Request (File Upload):**
- Content-Type: `multipart/form-data`
- Body: `file` (File) - .docx, .pdf, .txt, or .md

**Request (Text Input):**
- Content-Type: `application/json`
- Body: `{"text": "Your PRD content here..."}`

**Response:**
```json
{
  "success": true,
  "hybrid": "graph TB\n...",
  "flowchart": "graph TB\n...",
  "gaps_detected": ["Missing Success Metrics", "Missing Out of Scope"],
  "input_length": 5000
}
```

## File Processing

Supported formats:
- `.txt` - Plain text
- `.md` - Markdown
- `.docx` - Microsoft Word
- `.pdf` - Adobe PDF

Max file size: 5MB (configurable in .env)

## AI Processing

Uses **Gemini 1.5 Pro** (Google - FREE) to:
1. Parse PRD content
2. Extract structure
3. Generate Hybrid Mermaid diagram (visual + text)
4. Generate Flowchart-only diagram (pure visual)
5. Detect missing sections

**Why Gemini?**
- ✅ FREE (60 requests/minute)
- ✅ 1M token context window
- ✅ No credit card required
- ✅ High-quality diagram generation

## Testing

Test the API directly:
```bash
# Health check
curl http://localhost:5000/api/health

# Transform text
curl -X POST http://localhost:5000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"text": "Problem: Users need better PRDs..."}'

# Transform file
curl -X POST http://localhost:5000/api/transform \
  -F "file=@/path/to/prd.docx"
```
