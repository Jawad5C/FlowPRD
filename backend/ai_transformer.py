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
        prompt = f"""You are a Mermaid diagram expert. Transform this PRD into TWO valid Mermaid flowcharts.

CRITICAL RULES - FOLLOW EXACTLY:
1. Start EVERY diagram with: flowchart TD
2. Node IDs: ONLY letters/numbers (A, B, C, step1, etc.) - NO spaces, NO special chars
3. Node text: ALWAYS use double quotes ["text here"]
4. NEVER use these characters in text: ( ) [ ] {{ }} : ; | \\ < >
5. Replace special chars: Use dash for hyphen, spell out symbols
6. Line breaks: Use <br/> tag (not \\n or br)
7. Arrows: ONLY use -->

VALID EXAMPLE:
flowchart TD
    A["Start - User identifies problem"] --> B["Analyze requirements and constraints"]
    B --> C["Design solution with 3 key features"]
    C --> D["Implement and test"]

INVALID (DO NOT DO):
- A[Start: Problem] ❌ (colon breaks it)
- B("Text with (parens)") ❌ (parentheses break it)
- C{{Decision?}} ❌ (question mark breaks it)

1. **HYBRID VERSION**: Detailed flowchart with RICH text
   - Use these shapes ONLY:
     * Start/End: A["text"]  (keep it simple, no fancy shapes)
     * Process: B["text"]
     * Decision: C["text"]
   - Include ALL PRD sections (Problem, Solution, Requirements, etc.)
   - Put DETAILED text in nodes:
     * Short sections: Complete text (remove special chars)
     * Long sections: 100-200 char summary (remove special chars)
   - Use <br/> for line breaks in long text
   - CLEAN text of ALL special characters before putting in nodes

2. **FLOWCHART-ONLY VERSION**: Simple visual workflow
   - Same syntax rules as Hybrid
   - Shorter text (10-30 chars per node)
   - Focus on flow, not details

PRD CONTENT:
{prd_text}

Return in this EXACT format:

HYBRID:
```mermaid
flowchart TD
    [your code here]
```

FLOWCHART:
```mermaid
flowchart TD
    [your code here]
```

GAPS:
- [missing sections or "None"]
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
    Parse Gemini's response to extract Hybrid, Flowchart, and Gaps.
    
    Args:
        response: Raw response from Gemini
        
    Returns:
        Dictionary with hybrid, flowchart, and gaps keys
    """
    result = {
        'hybrid': '',
        'flowchart': '',
        'gaps': []
    }
    
    try:
        # Extract HYBRID section
        if 'HYBRID:' in response:
            hybrid_start = response.find('HYBRID:')
            hybrid_section = response[hybrid_start:]
            
            # Find mermaid code block
            if '```mermaid' in hybrid_section:
                start = hybrid_section.find('```mermaid') + len('```mermaid')
                end = hybrid_section.find('```', start)
                result['hybrid'] = hybrid_section[start:end].strip()
        
        # Extract FLOWCHART section
        if 'FLOWCHART:' in response:
            flowchart_start = response.find('FLOWCHART:')
            flowchart_section = response[flowchart_start:]
            
            # Find mermaid code block
            if '```mermaid' in flowchart_section:
                start = flowchart_section.find('```mermaid') + len('```mermaid')
                end = flowchart_section.find('```', start)
                result['flowchart'] = flowchart_section[start:end].strip()
        
        # Extract GAPS section
        if 'GAPS:' in response:
            gaps_start = response.find('GAPS:')
            gaps_section = response[gaps_start:].split('\n')
            
            for line in gaps_section[1:]:  # Skip the "GAPS:" line
                line = line.strip()
                if line.startswith('-') or line.startswith('•'):
                    gap = line.lstrip('-•').strip()
                    if gap and gap.lower() != 'none':
                        result['gaps'].append(gap)
        
        print(f"📊 Parsed: Hybrid={len(result['hybrid'])} chars, Flowchart={len(result['flowchart'])} chars, Gaps={len(result['gaps'])}")
        
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
        print(f"Hybrid length: {len(result['hybrid'])}")
        print(f"Flowchart length: {len(result['flowchart'])}")
        print(f"Gaps detected: {result['gaps']}")
