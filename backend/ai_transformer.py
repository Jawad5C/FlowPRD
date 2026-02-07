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
6. "hexagon" - Constraints/Rules/Principles - Color: "#EC4899" (pink)
7. "cylinder" - Databases/Storage/Data - Color: "#06B6D4" (cyan)

CRITICAL COLOR OVERRIDE:
- If a section is MISSING, ALWAYS use color: "#EF4444" (red) regardless of shape type
- This provides instant visual identification of gaps in the PRD
- Red is RESERVED for missing sections only

MANDATORY NODES (create ALL 12, including START/END):

0. **START** (stadium, green)
   - Always present: text="START", color="#10B981" (green)

1. **Problem/Pain Points** (rectangle - UML activity)
   - If EXISTS: color="#3B82F6" (blue), full content
   - If MISSING: color="#EF4444" (RED), text="[Problem Missing]", suggest "What user problem does this solve?"

2. **Opportunity** (rectangle - UML activity)
   - If EXISTS: color="#3B82F6" (blue), full content
   - If MISSING: color="#EF4444" (RED), text="[Opportunity Missing]", suggest "What's the market opportunity?"

3. **Target Users & Needs** (rectangle - UML activity)
   - If EXISTS: color="#10B981" (green), full content
   - If MISSING: color="#EF4444" (RED), text="[Users Missing]", suggest "Who will use this product?"

4. **Proposed Solution** (rectangle - UML activity)
   - If EXISTS: color="#8B5CF6" (purple), full content
   - If MISSING: color="#EF4444" (RED), text="[Solution Missing]", suggest "What solution are you proposing?"

5. **Functional Requirements** (rectangle - UML activity)
   - If EXISTS: color="#F59E0B" (orange), full content
   - If MISSING: color="#EF4444" (RED), text="[Requirements Missing]", suggest "List must-have features"

6. **Technical Implementation** (cylinder - data/resources)
   - If EXISTS: color="#06B6D4" (cyan), full content
   - If MISSING: color="#EF4444" (RED), text="[Tech Stack Missing]", suggest "What technologies will you use?"

7. **Success Metrics** (rectangle - UML activity)
   - If EXISTS: color="#EC4899" (pink), full content
   - If MISSING: color="#EF4444" (RED), text="[Metrics Missing]", suggest "How will you measure success?"

8. **Out of Scope** (rectangle - UML activity)
   - If EXISTS: color="#EC4899" (pink), full content
   - If MISSING: color="#EF4444" (RED), text="[Scope Missing]", suggest "What features are excluded?"

9. **Timeline/Phases** (diamond - UML decision)
   - If EXISTS: color="#EAB308" (yellow), full content
   - If MISSING: color="#EF4444" (RED), text="[Timeline Missing]", suggest "What's the delivery timeline?"

10. **Dependencies/Risks** (diamond - UML decision)
    - If EXISTS: color="#EAB308" (yellow), full content
    - If MISSING: color="#EF4444" (RED), text="[Dependencies Missing]", suggest "What could block this project?"

11. **END** (stadium, green)
    - Always present: text="END", color="#10B981" (green)

POSITIONING RULES - COMPACT TOP-DOWN FLOW LAYOUT:
- CRITICAL: Use EXACTLY these coordinates:
  
  TOP ROW (y=300):
  * Node 0 (START): x=600, y=300
  * Node 3 (Users): x=2250, y=300
  
  LEFT COLUMN - VERTICAL (Problem & Opportunity):
  * Node 1 (Problem): x=600, y=1050
  * Node 2 (Opportunity): x=600, y=1800
  
  RIGHT COLUMN - SOLUTION PATH:
  * Node 4 (Solution): x=2250, y=1050
  * Node 5 (Requirements): x=2250, y=1800
  
  BOTTOM ROW - TECH & METRICS (spacing: 1050px between shapes):
  * Node 6 (Tech Stack): x=2250, y=2550
  * Node 7 (Metrics): x=3300, y=2550
  * Node 8 (Out of Scope): x=4350, y=2550
  
  FINAL ROW - DECISIONS (spacing: 1050px between shapes, 750px vertical like START→Problem):
  * Node 9 (Timeline): x=4350, y=3300
  * Node 10 (Dependencies): x=5400, y=3300
  
  END (750px below Dependencies, matching START→Problem vertical spacing):
  * Node 11 (END): x=5400, y=4050

- Connect nodes following the specified flow:
  START → Problem (down)
  Problem → Opportunity (down)
  Opportunity → Users (up and right)
  Users → Solution (down)
  Solution → Requirements (down)
  Requirements → Tech Stack (down)
  Tech Stack → Metrics (right)
  Metrics → Out of Scope (right)
  Out of Scope → Timeline (down)
  Timeline → Dependencies (right)
  Dependencies → END (down)

CONTENT EXTRACTION RULES:
- If section EXISTS: Extract actual content
  * Summary: Intelligently condense to 30-50 chars
  * Full text: Include complete content (max 500 chars, summarize if longer)
- If section MISSING: 
  * Summary: "[Section Name Missing]"
  * Full text: "⚠️ Missing Section: [Name]\\n\\nSuggestion: [contextual hint based on what IS in the document]"

PRD CONTENT:
{prd_text}

Return in this EXACT JSON format (12 nodes including START/END):

{{
  "nodes": [
    {{
      "id": "START",
      "shape": "stadium",
      "text": "START",
      "fullText": "Beginning of PRD analysis",
      "x": 100,
      "y": 400,
      "color": "#10B981"
    }},
    {{
      "id": "A",
      "shape": "rectangle",
      "text": "Problem: User summary here",
      "fullText": "Complete problem description from PRD document...",
      "x": 300,
      "y": 250,
      "color": "#3B82F6"
    }},
    {{
      "id": "END",
      "shape": "stadium",
      "text": "END",
      "fullText": "End of PRD analysis",
      "x": 1950,
      "y": 450,
      "color": "#10B981"
    }}
  ],
  "connections": [
    {{"from": "START", "to": "A", "label": ""}},
    {{"from": "A", "to": "B", "label": ""}},
    {{"from": "J", "to": "END", "label": ""}}
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
