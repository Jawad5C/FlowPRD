# FlowPRD - AI-Powered Visual PRD Transformer

**Project:** FlowPRD - AI-Powered Visual PRD Transformer  
**Owner:** Yaasameen & Jawad  
**Date:** February 3, 2026  
**Version:** 1.0 MVP  
**Status:** In Development

---

## Problem

Developers and product managers waste hours writing and organizing Product Requirements Documents, only to find their team still misunderstands the requirements. While tools like **Confluence, Notion, and Productboard** help teams create PRDs, they share critical limitations:

**(Optional) Supporting Context:**
- **Hard to Scan:** Dense text-based PRDs (even in Confluence/Notion) make it difficult to quickly identify key requirements, dependencies, and scope
- **Difficult for AI to Parse:** Existing PRD generators (Productboard AI, Delibr, Coda AI) output text documents that AI coding assistants struggle to extract structured information from
- **Expensive & Locked-In:** Enterprise tools like Confluence ($5-10/user/month), Productboard ($20-60/user/month), and Notion ($10/user/month) require ongoing subscriptions
- **Rapidly Outdated:** Static documents in proprietary formats (Confluence, Notion databases) become stale the moment they are written, creating misalignment between documentation and actual requirements
- **Inconsistent Structure:** Each tool uses different PRD formats, making cross-project comparison and learning difficult

---

## Opportunity

**In a few sentences: What's the product opportunity?**

Enable product teams to transform any idea or existing PRD into a visual flowchart that makes requirements instantly comprehensible—solving what Confluence, Notion, and Productboard can't: AI-native requirements documentation.

**Market Opportunity:**
- The global project management software market is projected to reach $15.08 billion by 2030, with increasing demand for AI-integrated documentation tools
- **Current Market Leaders:**
  - **Confluence** (Atlassian): 60,000+ customers, 83% Fortune 500 usage—but PRDs are text-heavy and AI assistants can't parse them
  - **Notion**: Popular with startups, has AI features—but generates text documents, not visual flowcharts
  - **Productboard AI** ($20-60/user/month): Auto-generates PRDs from feedback—but output is still traditional text format
- **Gap:** No existing tool combines visual PRDs with direct AI coding assistant compatibility in a free, version-controllable format

---

## Users & Needs

**Who:**

**Primary users:** Product Managers, Technical Leads, Solo Founders

**Secondary users:** Developers, Stakeholders, AI Coding Assistants (Cursor, GitHub Copilot)

**Needs:** be as detailed as possible here!

- **Key user need:** As a [Product Manager] I need to [create scannable PRDs] because [my team misses requirements buried in text documents, even in Confluence]
- **Key user need:** As a [Developer] I need to [quickly understand project scope] in order to [estimate work and identify dependencies without reading 20 pages in Notion]
- **Key user need:** As a [Solo Founder] I need to [communicate my vision to AI assistants] because [I want Cursor to generate accurate code from my requirements, but it can't parse my Confluence pages]
- **Key user need:** As a [Technical Lead] I need to [maintain consistency across multiple PRDs] in order to [onboard new team members faster than with our scattered Notion docs]
- **Key user need:** As an [AI Coding Assistant] I need to [parse structured requirements] because [unstructured prose from Productboard/Delibr leads to incorrect code generation]

---

## Proposed Solution

An **AI-powered web application** that transforms any existing PRD (text, Word, PDF, fragmented notes) into a visual, scannable flowchart using custom SVG shapes that both humans and AI coding assistants can instantly understand.

### **How It Works:**

**User Flow:**
1. **Upload/Paste:** User uploads PRD file (.docx, .pdf, .txt, .md) or pastes text directly
2. **AI Analysis:** Gemini AI extracts and restructures content into 10 standard PRD sections
3. **Transform:** System generates visual diagram with custom SVG shapes (stadiums, rectangles, diamonds, hexagons, etc.)
4. **Display:** Single flowchart showing ALL sections (including missing ones with AI suggestions)
5. **Hover:** Hover over any shape to see full section text in tooltip
6. **Export:** User downloads/copies result as JSON (no storage, stateless)

**Intelligent Gap Detection:**
- AI always shows ALL 10 standard PRD sections
- Missing sections display with placeholder: "[Section Missing]"
- AI provides contextual suggestions for each missing section
- Educational tool for learning complete PRD structure

### **Technical Architecture:**

**Frontend:**
- React with TypeScript
- Custom SVG shape rendering (7 shape types)
- Hover tooltips for full section text
- Drag & drop file upload
- Download/copy JSON functionality

**Backend:**
- Python Flask API
- File parsing libraries (python-docx, PyPDF2, markdown)
- Gemini API integration (Google)
- No database required (stateless transformations)

**AI Processing:**
- Google Gemini 2.5 Flash for structured JSON output
- Follows UML/flowchart conventions (ovals, diamonds, rectangles, parallelograms, hexagons, cylinders)
- Always generates 10 standard sections (shows "[Missing]" placeholders)
- 10-section framework: Problem, Opportunity, Users, Solution, Requirements, Tech Stack, Metrics, Out of Scope, Timeline, Dependencies

### **Deployment:**

**v1.0 (Demo):** Localhost (like Anchore demo)  
**v2.0 (Scale):** Vercel deployment with serverless functions

**Competitive Advantage:**
- **vs. Confluence:** AI transforms text walls into visual diagrams, free, AI-parseable output, custom shapes (not limited to Mermaid syntax)
- **vs. Notion:** Automated conversion (not manual), standardized flowchart format, educational gap detection
- **vs. Productboard AI:** Generates visual flowcharts (not text), accepts any input format, 100% free, always shows complete PRD structure
- **vs. Mermaid.js tools:** Direct SVG rendering (no syntax errors), hover tooltips, guaranteed 10-section coverage

---

## Functional Requirements

**Must-Have (P0):**

| Feature ID | Feature Name | Description | Priority |
|------------|--------------|-------------|----------|
| FR-01 | Multi-Format File Upload | Accept .docx, .pdf, .txt, .md files and direct text paste | P0 |
| FR-02 | AI-Powered Parsing | Gemini API extracts and restructures PRD into 10 sections | P0 |
| FR-03 | Custom SVG Diagram | Generate visual flowchart with 7 custom shape types | P0 |
| FR-04 | Hover Tooltips | Show full section text on hover over any shape | P0 |
| FR-05 | Complete Coverage | Always show all 10 PRD sections (with "[Missing]" placeholders) | P0 |
| FR-06 | Gap Detection & Suggestions | AI identifies missing sections and provides contextual hints | P0 |
| FR-07 | Export Functionality | Download/copy results in JSON format | P0 |
| FR-08 | Drag & Drop UI | Intuitive file upload interface | P0 |

**Should-Have (P1):**
- Real-time preview as AI processes
- Example PRD samples (Anchore, FlowPRD itself)
- Customizable color schemes for shapes
- Processing status indicators
- Error handling for malformed PRDs
- Print-friendly view (tooltips visible)

**Nice-to-Have (P2):**
- User accounts (save API preferences)
- PRD history (view past conversions)
- Team collaboration features
- Version comparison (v1 vs v2 diff)
- Mobile app version

**Out of Scope (v1.0):**
- Database/storage (stateless only)
- User authentication
- Real-time collaboration
- Multiple language support

---

## Technical Implementation

**Frontend (React/TypeScript):**
- React components for UI
- Custom SVG shape rendering (Stadium, Rectangle, Rounded Box, Parallelogram, Diamond, Hexagon, Cylinder)
- Drag & drop file upload (React-Dropzone)
- Hover tooltip component with text wrapping
- Copy-to-clipboard and JSON download functionality

**Backend (Python Flask):**
```
/api/upload      → Accept file uploads
/api/transform   → Send to Claude, return Mermaid
/api/status      → Check processing status
```

**File Processing:**
- `python-docx` for .docx files
- `PyPDF2` for .pdf files
- `markdown` for .md files
- Plain text parser for .txt

**AI Integration:**
- Google Gemini API (2.5 Flash - FREE!)
- Structured prompt for 10-section PRD transformation
- Follows UML/flowchart shape conventions
- Returns JSON with nodes (text + fullText), connections, and gaps array

**Storage:**
- No database required (stateless)
- No file retention (privacy-first)
- API key stored in backend .env only

**Constraints:**
- Maximum file size: 5MB (PRD documents)
- Maximum nodes: 10 (one per standard section)
- Custom SVG rendering (not dependent on third-party diagram libraries)
- Compatible with all major AI coding assistants (Cursor, Copilot, Claude, ChatGPT)
- Zero subscription costs (API costs only)

---

## Success Metrics (KPIs)

**Performance:**
- PRD transformation time: < 30 seconds (vs. 2+ hours manual conversion)
- AI accuracy: 90%+ correct structure extraction
- Output quality: 95%+ AI coding assistant comprehension (Cursor/Copilot test)

**Adoption:**
- 100 conversions in first month
- 80% of users report "clearer requirements than original PRD"
- 50 GitHub stars in first quarter

**Quality:**
- Support for 4 file formats (.docx, .pdf, .txt, .md)
- 10 sections always displayed (100% coverage)
- SVG diagrams render successfully 95%+ of time (no syntax errors)
- Hover tooltips work on all shapes

**Cost Savings:**
- Users save $60-720/year vs. Confluence/Productboard subscriptions
- Free to use (only API costs for hosting)

---

## Out of Scope (v1.0)

❌ **Not included in first version:**
- Database/storage (stateless only - no history)
- User accounts/authentication
- Real-time collaboration like Confluence
- Integration with Jira/Linear/project management tools
- Multiple language support (English only initially)
- Mobile app version
- Direct Confluence/Notion export plugin
- Batch processing (multiple PRDs at once)
- Custom template creation

**Future Scalability (v2.0+):**
- ☁️ Vercel deployment (currently localhost only)
- 📱 Mobile app version
- 👥 User accounts and PRD history
- 🌍 Multi-language support
- 🔗 Project management tool integrations

---

## Getting Started

**v1.0 Demo - Localhost Setup (5 minutes)**

### Quick Install

```bash
# 1. Backend Setup
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_actual_key

# 2. Frontend Setup (new terminal)
cd ../frontend
npm install
```

### Run Application

```bash
# Terminal 1: Start Backend
cd backend && python app.py
# → Running on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend && npm run dev
# → Running on http://localhost:3000
```

### Usage
1. **Open** `http://localhost:3000` in your browser
2. **Upload** your PRD (.docx, .pdf, .txt, .md) or paste text
3. **Transform** with AI (Gemini 2.5 Flash - FREE!)
4. **View** visual diagram with all 10 PRD sections
5. **Hover** over any shape to see full section text
6. **Export** via copy-to-clipboard or download as JSON

**Test Files:** Try this README.md as your first transformation!

📖 **Full setup guide with troubleshooting:** [SETUP.md](SETUP.md)

---

## Tech Stack

**Frontend:** React, TypeScript, Custom SVG Shapes  
**Backend:** Python Flask, Gemini API  
**AI:** Google Gemini 2.5 Flash (FREE - 1M tokens!)  
**File Processing:** python-docx, PyPDF2, markdown  
**Deployment:** Localhost (v1), Vercel (v2)

---

## Contributing

Contributions welcome! This project is in active development.

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

---

## License

[To be determined]

---

## Roadmap

- [x] PRD Documentation
- [x] Backend API (Flask)
- [x] Frontend UI (React + TypeScript)
- [x] Gemini API Integration
- [x] File Upload & Parsing
- [x] Custom SVG Shape Rendering
- [x] 10-Section Coverage with Gap Detection
- [x] Hover Tooltip Feature
- [ ] Demo Testing (Anchore + FlowPRD samples)
- [ ] Vercel Deployment (v2.0)
