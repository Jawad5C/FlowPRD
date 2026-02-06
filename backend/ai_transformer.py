"""
AI Transformer Module
Uses Google Gemini API to transform PRD text into Mermaid diagrams
"""

from typing import Optional, Dict
import os
import google.generativeai as genai


def transform_to_mermaid(prd_text: str) -> Optional[Dict[str, str]]:
    """
    Transform PRD text into Mermaid diagrams using Gemini AI.
    
    Args:
        prd_text: The PRD content as text
        
    Returns:
        Dictionary with 'hybrid' and 'flowchart' Mermaid code, or None if failed
    """
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment")
        return None
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Create the prompt for Gemini
        prompt = f"""You are a PRD analysis expert. Transform this PRD into a structured JSON diagram.

CRITICAL: Output ONLY valid JSON. Use these 7 shape types:

Shape Types & Colors:
1. "stadium" - Start/End/Users/Actors - Color: "#10B981" (green)
2. "rectangle" - Features/Actions/Processes - Color: "#8B5CF6" (purple)  
3. "rounded_box" - Problem/Solution/Descriptions - Color: "#3B82F6" (blue)
4. "parallelogram" - Functional Requirements - Color: "#F59E0B" (orange)
5. "diamond" - Decisions/Questions/Status - Color: "#EAB308" (yellow)
6. "hexagon" - Constraints/Rules/Principles - Color: "#EF4444" (red)
7. "cylinder" - Databases/Storage/Data - Color: "#06B6D4" (cyan)

PRD Sections to Extract:
- Problem/Pain Points → rounded_box (blue)
- Users/Actors → stadium (green)
- Solution/Features → rectangle (purple)
- Functional Requirements → parallelogram (orange)
- Technical Decisions → diamond (yellow)
- Constraints/Rules → hexagon (red)
- Data/Storage → cylinder (cyan)

If a section is MISSING, create node with text "[Section Missing - Needs Definition]"

1. **HYBRID VERSION**: Detailed diagram with rich text in shapes
   - Extract ALL PRD sections
   - Choose appropriate shape for each section type
   - Text length by shape:
     * rounded_box/rectangle: 80-120 chars (can be long, will wrap)
     * stadium: 40-60 chars
     * diamond: 15-25 chars (keep SHORT)
     * parallelogram: 50-70 chars
     * hexagon: 40-60 chars
     * cylinder: 30-50 chars
   - CRITICAL: Position nodes with LARGE vertical spacing
     * y-coordinates: 0, 250, 500, 750, 1000, 1250, etc.
     * Minimum 250px between each node vertically
     * Keep x-coordinate centered at 400 for main flow
   - Connect related nodes with arrows

2. **FLOWCHART VERSION**: Simplified workflow diagram
   - Show main flow only (Problem → Solution → Requirements → Implementation)
   - Shorter text (20-40 chars per node)
   - Use proper shapes for workflow (stadium for start/end, diamond for decisions)
   - CRITICAL: Large vertical spacing
     * y-coordinates: 0, 250, 500, 750, 1000, etc.
     * Minimum 250px between nodes
   - Clear top-to-bottom flow

PRD CONTENT:
{prd_text}

Return in this EXACT JSON format:

{{
  "hybrid": {{
    "nodes": [
      {{"id": "A", "shape": "rounded_box", "text": "Problem: ...", "x": 400, "y": 50, "color": "#3B82F6"}},
      {{"id": "B", "shape": "stadium", "text": "Users: ...", "x": 400, "y": 200, "color": "#10B981"}}
    ],
    "connections": [
      {{"from": "A", "to": "B", "label": ""}}
    ]
  }},
  "flowchart": {{
    "nodes": [
      {{"id": "A", "shape": "stadium", "text": "Start", "x": 400, "y": 50, "color": "#10B981"}},
      {{"id": "B", "shape": "rectangle", "text": "Analyze", "x": 400, "y": 150, "color": "#8B5CF6"}}
    ],
    "connections": [
      {{"from": "A", "to": "B", "label": ""}}
    ]
  }},
  "gaps": ["Missing sections or empty array"]
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
    Parse Gemini's JSON response to extract Hybrid, Flowchart, and Gaps.
    
    Args:
        response: Raw response from Gemini (should be JSON)
        
    Returns:
        Dictionary with hybrid, flowchart, and gaps keys
    """
    import json
    import re
    
    result = {
        'hybrid': {'nodes': [], 'connections': []},
        'flowchart': {'nodes': [], 'connections': []},
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
        
        result['hybrid'] = data.get('hybrid', result['hybrid'])
        result['flowchart'] = data.get('flowchart', result['flowchart'])
        result['gaps'] = data.get('gaps', [])
        
        print(f"📊 Parsed: Hybrid={len(result['hybrid'].get('nodes', []))} nodes, Flowchart={len(result['flowchart'].get('nodes', []))} nodes, Gaps={len(result['gaps'])}")
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response preview: {response[:500]}")
        return result
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return result


if __name__ == '__main__':
    # Test the parser
    test_text = "This is a test PRD for a blockchain notary application."
    result = transform_to_mermaid(test_text)
    if result:
        print("\n✅ Test successful!")
        print(f"Hybrid nodes: {len(result['hybrid'].get('nodes', []))}")
        print(f"Flowchart nodes: {len(result['flowchart'].get('nodes', []))}")
        print(f"Gaps detected: {result['gaps']}")
