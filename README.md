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

An **AI-powered web application** that transforms any existing PRD (text, Word, PDF, fragmented notes) into a visual, scannable Mermaid flowchart that both humans and AI coding assistants can instantly understand.

### **How It Works:**

**User Flow:**
1. **Upload/Paste:** User uploads PRD file (.docx, .pdf, .txt, .md) or pastes text directly
2. **AI Analysis:** Claude AI extracts and restructures content using standardized flowchart semantics
3. **Transform:** System generates two versions simultaneously:
   - **Hybrid:** Mermaid diagram + detailed text descriptions
   - **Flowchart-only:** Pure visual flowchart (100% UML/flowchart compliant)
4. **Display:** Side-by-side view with toggle between formats
5. **Export:** User downloads/copies result (no storage, stateless)

**Intelligent Gap Detection:**
- **Primary:** AI restructures existing content (Option A)
- **Secondary:** If PRD is missing sections, AI suggests what's missing (Option B)
- User decides whether to fill gaps or proceed with current content

### **Technical Architecture:**

**Frontend:**
- React/HTML with drag & drop file upload
- Side-by-side display with format toggle
- Real-time preview of Mermaid diagrams
- Download/copy functionality

**Backend:**
- Python Flask API
- File parsing libraries (python-docx, PyPDF2, markdown)
- Claude API integration (Anthropic)
- No database required (stateless transformations)

**AI Processing:**
- Claude Sonnet 4.5 for structured output
- Follows UML/flowchart conventions (ovals, diamonds, rectangles, parallelograms)
- Generates both Hybrid and Flowchart-only versions
- 7-section framework: Problem, Opportunity, Users, Solution, Requirements, Metrics, Scope

### **Deployment:**

**v1.0 (Demo):** Localhost (like Anchore demo)  
**v2.0 (Scale):** Vercel deployment with serverless functions

**Competitive Advantage:**
- **vs. Confluence:** AI transforms text walls into visual diagrams, free, AI-parseable output
- **vs. Notion:** Automated conversion (not manual), standardized flowchart format
- **vs. Productboard AI:** Generates visual flowcharts (not text), accepts any input format, 100% free

---

## Functional Requirements

**Must-Have (P0):**

| Feature ID | Feature Name | Description | Priority |
|------------|--------------|-------------|----------|
| FR-01 | Multi-Format File Upload | Accept .docx, .pdf, .txt, .md files and direct text paste | P0 |
| FR-02 | AI-Powered Parsing | Claude API extracts and restructures PRD content | P0 |
| FR-03 | Dual Output Generation | Generate both Hybrid and Flowchart-only Mermaid versions | P0 |
| FR-04 | Side-by-Side Display | Show both formats simultaneously with toggle capability | P0 |
| FR-05 | Gap Detection | AI identifies missing PRD sections and suggests additions | P0 |
| FR-06 | Export Functionality | Download/copy results in Markdown format | P0 |
| FR-07 | Drag & Drop UI | Intuitive file upload interface | P0 |

**Should-Have (P1):**
- Real-time preview as AI processes
- Example PRD samples (Anchore, FlowPRD itself)
- Customizable color schemes for diagrams
- Processing status indicators
- Error handling for malformed PRDs

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

**Frontend (React/HTML):**
- React components for UI
- Mermaid.js for diagram rendering
- Drag & drop file upload (React-Dropzone)
- Toggle component for Hybrid/Flowchart view
- Copy-to-clipboard functionality

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
- Anthropic Claude API (Sonnet 4.5)
- Structured prompt for PRD transformation
- Follows UML/flowchart shape conventions
- Returns both Hybrid and Flowchart versions

**Storage:**
- No database required (stateless)
- No file retention (privacy-first)
- API key stored in backend .env only

**Constraints:**
- Maximum file size: 5MB (PRD documents)
- Maximum template complexity: 50 nodes for readability
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
- 0 ambiguous sections when reviewed by 3rd party developer
- Both Hybrid and Flowchart versions generated successfully 95%+ of time

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

**v1.0 Demo - Localhost Setup**

### Prerequisites
- Python 3.9+
- Node.js 16+
- Claude API key (Anthropic)

### Installation
```bash
# Clone repository
git clone https://github.com/Jawad5C/FlowPRD.git
cd FlowPRD

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your CLAUDE_API_KEY to .env

# Frontend setup
cd ../frontend
npm install

# Run both servers
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend
cd frontend && npm start
```

### Usage
1. Open http://localhost:3000
2. Drag & drop your PRD file or paste text
3. Click "Transform"
4. View Hybrid and Flowchart-only versions side-by-side
5. Toggle between formats
6. Copy/download result

**Test with included samples:**
- Anchore PRD (blockchain document notary)
- FlowPRD PRD (this project!)

---

## Tech Stack

**Frontend:** React, Mermaid.js, React-Dropzone  
**Backend:** Python Flask, Claude API  
**AI:** Anthropic Claude Sonnet 4.5  
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
- [ ] Backend API (Flask)
- [ ] Frontend UI (React)
- [ ] Claude API Integration
- [ ] File Upload & Parsing
- [ ] Dual Output Generation
- [ ] Side-by-Side Display
- [ ] Gap Detection Feature
- [ ] Demo Testing (Anchore + FlowPRD samples)
- [ ] Vercel Deployment (v2.0)
