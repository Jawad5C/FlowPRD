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

1. **HYBRID VERSION**: Detailed flowchart with RICH text and VARIED shapes
   - USE THESE EXACT SHAPE FORMATS WITH TEXT LENGTH RULES:
     * Rectangle ["text"]: Detailed text BUT break into lines using <br/>
       - CRITICAL: Each line max 40-50 characters
       - Use <br/> to break text every 40-50 chars
       - Creates 3:1 length-to-width ratio (tall, not wide)
       - Example: ["Users need better PRD tools.<br/>Current solutions are expensive.<br/>Missing visual representation."]
     * Oval/Stadium (["text"]): Medium text (50-80 chars) - use for Start/End/Actors
     * Diamond {{"text"}}: SHORT text ONLY (10-30 chars max) - use for Decisions/Questions
     * Parallelogram [/"text"/]: Medium text (40-60 chars) - use for Input/Output
     * Cylinder [("text")]: Medium text (40-60 chars) - use for Data/Storage
   - Include ALL PRD sections
   - IMPORTANT: Always break long rectangle text with <br/> every 40-50 characters

2. **FLOWCHART-ONLY VERSION**: Visual workflow following UML conventions
   - MANDATORY SHAPE USAGE BY TYPE:
     * Start/End: MUST use ovals (["text"])
     * Process/Action: Use rectangles ["text"] with short text (20-30 chars max)
     * Decisions/Conditionals: MUST use diamonds {{"text"}} - always use for yes/no questions (10-20 chars)
     * Input/Output: Use parallelograms [/"text"/] (20-30 chars)
     * Data storage: Use cylinders [("text")] (20-30 chars)
   - Keep ALL text short (no <br/> needed in flowchart)
   - Focus on proper flowchart conventions
   - Every decision point MUST be a diamond with yes/no branches

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
                result['hybrid'] = clean_mermaid_syntax(hybrid_section[start:end].strip())
        
        # Extract FLOWCHART section
        if 'FLOWCHART:' in response:
            flowchart_start = response.find('FLOWCHART:')
            flowchart_section = response[flowchart_start:]
            
            # Find mermaid code block
            if '```mermaid' in flowchart_section:
                start = flowchart_section.find('```mermaid') + len('```mermaid')
                end = flowchart_section.find('```', start)
                result['flowchart'] = clean_mermaid_syntax(flowchart_section[start:end].strip())
        
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


def clean_mermaid_syntax(mermaid_code: str) -> str:
    """
    Clean Mermaid code to ensure valid syntax.
    Only cleans TEXT content, preserves shape syntax.
    """
    import re
    
    lines = mermaid_code.split('\n')
    cleaned_lines = []
    
    for line in lines:
        if not line.strip():
            continue
            
        # Keep flowchart declaration as-is
        if line.strip().startswith('flowchart'):
            cleaned_lines.append(line)
            continue
        
        # Find and clean ONLY the text inside quotes, preserve shape syntax
        def clean_text_only(match):
            text = match.group(1)
            # Remove ONLY problematic characters from text content
            text = text.replace(':', ' -')
            text = text.replace(';', ',')
            text = text.replace('|', ' ')
            text = text.replace('\\', '/')
            text = text.replace('"', "'")  # Inner quotes to apostrophes
            text = text.replace('`', "'")
            # Clean up multiple spaces
            text = re.sub(r'\s+', ' ', text).strip()
            return f'"{text}"'
        
        # Only clean text inside quotes, leave shape syntax alone
        line = re.sub(r'"([^"]*)"', clean_text_only, line)
        
        # Ensure proper arrow spacing
        line = line.replace('-->', ' --> ')
        line = re.sub(r'\s+', ' ', line).strip()
        
        cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)


if __name__ == '__main__':
    # Test the parser
    test_text = "This is a test PRD for a blockchain notary application."
    result = transform_to_mermaid(test_text)
    if result:
        print("\n✅ Test successful!")
        print(f"Hybrid length: {len(result['hybrid'])}")
        print(f"Flowchart length: {len(result['flowchart'])}")
        print(f"Gaps detected: {result['gaps']}")
