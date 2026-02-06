"""
AI Transformer Module
Uses Google Gemini API to transform PRD text into structured diagram data
"""

from typing import Optional, Dict
import os
import google.generativeai as genai


def transform_to_diagram(prd_text: str) -> Optional[Dict[str, str]]:
    """
    Transform PRD text into structured diagram data using Gemini AI.
    
    Args:
        prd_text: The PRD content as text
        
    Returns:
        Dictionary with nodes, connections, and gaps, or None if failed
    """
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment")
        return None
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Create the prompt for Gemini
        prompt = f"""You are a PRD validation and education tool. Your job is to:
1. Parse the PRD document
2. Create a visual flowchart showing ALL standard PRD sections
3. For missing sections, show placeholder with AI suggestion

CRITICAL: Output ONLY valid JSON.

Shape Types & Colors:
1. "stadium" - Start/End/Users/Actors - Color: "#10B981" (green)
2. "rectangle" - Features/Actions/Processes - Color: "#8B5CF6" (purple)  
3. "rounded_box" - Problem/Solution/Descriptions - Color: "#3B82F6" (blue)
4. "parallelogram" - Functional Requirements - Color: "#F59E0B" (orange)
5. "diamond" - Decisions/Questions/Status - Color: "#EAB308" (yellow)
6. "hexagon" - Constraints/Rules/Principles - Color: "#EF4444" (red)
7. "cylinder" - Databases/Storage/Data - Color: "#06B6D4" (cyan)

MANDATORY PRD SECTIONS (create nodes for ALL 10, even if missing):

1. **Problem/Pain Points** (rounded_box, blue)
   - Summary: 30-50 chars
   - Full text: Complete problem description from PRD
   - If missing: "[Problem Missing]" + suggest "What user problem does this solve?"

2. **Opportunity** (rounded_box, blue)  
   - Summary: 30-50 chars
   - Full text: Market opportunity, why now?
   - If missing: "[Opportunity Missing]" + suggest "What's the market opportunity?"

3. **Target Users & Needs** (stadium, green)
   - Summary: 30-50 chars
   - Full text: Who are the users and what do they need?
   - If missing: "[Users Missing]" + suggest "Who will use this product?"

4. **Proposed Solution** (rectangle, purple)
   - Summary: 30-50 chars
   - Full text: What are we building? Key features?
   - If missing: "[Solution Missing]" + suggest "What solution are you proposing?"

5. **Functional Requirements** (parallelogram, orange)
   - Summary: 30-50 chars (e.g. "FR-01, FR-02, FR-03...")
   - Full text: All functional requirements with details
   - If missing: "[Requirements Missing]" + suggest "List must-have features"

6. **Technical Implementation** (cylinder, cyan)
   - Summary: 30-50 chars
   - Full text: Tech stack, architecture, databases
   - If missing: "[Tech Stack Missing]" + suggest "What technologies will you use?"

7. **Success Metrics** (hexagon, red)
   - Summary: 30-50 chars
   - Full text: How will you measure success? KPIs?
   - If missing: "[Metrics Missing]" + suggest "How will you measure success?"

8. **Out of Scope** (hexagon, red)
   - Summary: 30-50 chars
   - Full text: What are we NOT building?
   - If missing: "[Scope Missing]" + suggest "What features are excluded?"

9. **Timeline/Phases** (diamond, yellow)
   - Summary: 30-50 chars
   - Full text: Project phases, milestones, dates
   - If missing: "[Timeline Missing]" + suggest "What's the delivery timeline?"

10. **Dependencies/Risks** (diamond, yellow)
    - Summary: 30-50 chars
    - Full text: External dependencies, risks, blockers
    - If missing: "[Dependencies Missing]" + suggest "What could block this project?"

POSITIONING RULES:
- Start at y=100, then increment by 250px (100, 350, 600, 850, 1100, 1350, 1600, 1850, 2100, 2350)
- All nodes centered at x=400
- Connect each node to the next (A→B→C→D→E→F→G→H→I→J)

CONTENT EXTRACTION RULES:
- If section EXISTS: Extract actual content
  * Summary: Intelligently condense to 30-50 chars
  * Full text: Include complete content (max 500 chars, summarize if longer)
- If section MISSING: 
  * Summary: "[Section Name Missing]"
  * Full text: "⚠️ Missing Section: [Name]\\n\\nSuggestion: [contextual hint based on what IS in the document]"

PRD CONTENT:
{prd_text}

Return in this EXACT JSON format:

{{
  "nodes": [
    {{
      "id": "A",
      "shape": "rounded_box",
      "text": "Problem: User summary here",
      "fullText": "Complete problem description from PRD document...",
      "x": 400,
      "y": 100,
      "color": "#3B82F6"
    }},
    {{
      "id": "B",
      "shape": "rounded_box",
      "text": "[Opportunity Missing]",
      "fullText": "⚠️ Missing Section: Opportunity\\n\\nSuggestion: Based on the problem you described, consider explaining why now is the right time to solve this. What market trends support this solution?",
      "x": 400,
      "y": 350,
      "color": "#3B82F6"
    }}
  ],
  "connections": [
    {{"from": "A", "to": "B", "label": ""}},
    {{"from": "B", "to": "C", "label": ""}}
  ],
  "gaps": ["Opportunity", "Timeline/Phases"]
}}
"""
        
        print("🤖 Calling Gemini API...")
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        print(f"✅ Received response ({len(response_text)} chars)")
        
        # Parse the response
        result = parse_gemini_response(response_text)
        
        return result
        
    except Exception as e:
        print(f"❌ Error calling Gemini API: {e}")
        import traceback
        traceback.print_exc()
        return None


def parse_gemini_response(response: str) -> Dict[str, any]:
    """
    Parse Gemini's JSON response to extract diagram nodes and connections.
    
    Args:
        response: Raw response from Gemini (should be JSON)
        
    Returns:
        Dictionary with nodes, connections, and gaps keys
    """
    import json
    import re
    
    result = {
        'nodes': [],
        'connections': [],
        'gaps': []
    }
    
    try:
        # Try to extract JSON from response (might have markdown code blocks)
        json_match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find raw JSON
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                json_str = response
        
        # Parse JSON
        data = json.loads(json_str)
        
        result['nodes'] = data.get('nodes', [])
        result['connections'] = data.get('connections', [])
        result['gaps'] = data.get('gaps', [])
        
        print(f"📊 Parsed: {len(result['nodes'])} nodes, {len(result['connections'])} connections, {len(result['gaps'])} gaps")
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response preview: {response[:500]}")
        return result
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return result


if __name__ == '__main__':
    # Test the transformer
    test_text = "This is a test PRD for a blockchain notary application."
    result = transform_to_diagram(test_text)
    if result:
        print("\n✅ Test successful!")
        print(f"Nodes: {len(result['nodes'])}")
        print(f"Connections: {len(result['connections'])}")
        print(f"Gaps detected: {result['gaps']}")
