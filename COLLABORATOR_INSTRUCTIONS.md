# FlowPRD - Frontend Collaboration Instructions

Welcome! This guide will help you set up the backend and build your own frontend.

---

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jawad5C/FlowPRD.git
cd FlowPRD
```

### Step 2: Delete the Existing Frontend (Optional)

```bash
# You can keep it as a reference, or delete it to start fresh
rm -rf frontend
```

### Step 3: Set Up the Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (see below)
```

### Step 4: Get FREE Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Open `backend/.env` and replace `your_api_key_here` with your key

### Step 5: Run the Backend

```bash
cd backend
source venv/bin/activate
python app.py
```

Backend will run on: **http://localhost:5001**

---

## 📡 API Documentation

### Health Check

```bash
GET http://localhost:5001/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "FlowPRD Backend",
  "version": "1.0.0"
}
```

### Transform PRD

```bash
POST http://localhost:5001/api/transform
```

**Option 1: File Upload**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Supported formats: .docx, .pdf, .txt, .md

**Option 2: Text Input**
- Content-Type: `application/json`
- Body:
```json
{
  "text": "Your PRD content here..."
}
```

**Success Response:**
```json
{
  "success": true,
  "hybrid": "flowchart TD\n  A[Problem] --> B[Solution]\n  ...",
  "flowchart": "flowchart TD\n  start([Start]) --> process[Analyze]\n  ...",
  "gaps_detected": ["Missing Success Metrics"],
  "input_length": 1234
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 💻 Frontend Development

### What to Build

Your frontend should:

1. **Allow file upload OR text input**
   - File types: .docx, .pdf, .txt, .md
   - Max size: 5MB

2. **Call the API**
   ```javascript
   // Example using fetch
   const formData = new FormData();
   formData.append('file', file);
   
   const response = await fetch('http://localhost:5001/api/transform', {
     method: 'POST',
     body: formData
   });
   
   const data = await response.json();
   console.log(data.hybrid);      // Hybrid Mermaid diagram
   console.log(data.flowchart);   // Flowchart diagram
   console.log(data.gaps_detected); // Missing sections
   ```

3. **Display Results**
   - Show both Hybrid and Flowchart versions
   - Allow toggling between views or side-by-side
   - Display detected gaps (if any)

4. **Export Options**
   - Copy Mermaid code to clipboard
   - Download as Markdown file

### Rendering Mermaid Diagrams

To render the Mermaid code visually:

```bash
npm install mermaid
```

```javascript
import mermaid from 'mermaid';

// Initialize
mermaid.initialize({ 
  startOnLoad: true, 
  theme: 'default' 
});

// Render
const element = document.getElementById('mermaid-output');
element.innerHTML = `\`\`\`mermaid\n${data.hybrid}\n\`\`\``;
mermaid.run();
```

### Suggested Tech Stack

Choose any you're comfortable with:
- **React** (what the reference frontend uses)
- **Vue.js**
- **Svelte**
- **Next.js**
- **Plain HTML/CSS/JavaScript**
- **Angular**

The backend is framework-agnostic!

---

## 🎨 Design Freedom

You have complete creative freedom! The reference frontend is just one example. Feel free to:
- Use any design system (Material UI, Tailwind, Bootstrap, etc.)
- Create any layout you want
- Add extra features (history, favorites, templates, etc.)
- Make it mobile-responsive
- Add animations and transitions

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5001 already in use:**
```bash
lsof -ti:5001 | xargs kill -9
```

**Gemini API error:**
- Check your `.env` file has the correct key
- Verify at: https://aistudio.google.com/app/apikey
- Check free tier limit (60 requests/minute)

**Module not found:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Issues

CORS is already enabled for all origins in development. If you still have issues, the backend has:

```python
from flask_cors import CORS
CORS(app)  # Already configured
```

---

## 📂 Project Structure

```
FlowPRD/
├── backend/
│   ├── app.py              # Main Flask app
│   ├── ai_transformer.py   # Gemini AI integration
│   ├── file_parser.py      # Document parsing
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── uploads/            # Temporary storage
│
├── (your-frontend-folder)/  # Build your frontend here!
│
└── README.md
```

---

## 📞 Questions?

Contact Jawad if you need:
- Backend changes or new endpoints
- Help with the API
- Clarification on requirements

---

## 🎯 Success Criteria

Your frontend is ready when it can:
1. ✅ Upload a PRD file or paste text
2. ✅ Display loading state while processing
3. ✅ Show both Hybrid and Flowchart diagrams
4. ✅ Display detected gaps
5. ✅ Allow copying/downloading Mermaid code
6. ✅ Handle errors gracefully

---

## 🚀 Deployment (Future)

Once your frontend is ready, we can deploy:
- **Backend:** Railway, Heroku, or Render
- **Frontend:** Vercel, Netlify, or GitHub Pages

But for now, focus on localhost development!

---

**Happy coding! 🎨**
