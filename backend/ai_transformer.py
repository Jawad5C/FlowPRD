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
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Create the prompt for Gemini
        prompt = f"""You are a PRD (Product Requirements Document) transformation expert. 
        
Your task: Transform the following PRD into TWO Mermaid diagram formats:

1. **HYBRID VERSION**: Combine visual Mermaid flowchart with detailed text descriptions
   - Use proper flowchart shapes: ovals (start/end), diamonds (decisions), rectangles (processes), parallelograms (input/output), hexagons (constraints), cylinders (databases)
   - Include all 7 sections: Problem, Opportunity, Users, Solution, Requirements, Metrics, Scope
   - Add detailed text descriptions under each section
   - Use color classes for visual distinction

2. **FLOWCHART-ONLY VERSION**: Pure visual flowchart following strict UML/flowchart conventions
   - 90%+ proper shape usage (ovals, diamonds, rectangles, parallelograms)
   - Show PRD creation/analysis workflow
   - Minimal text, maximum visual clarity
   - Sequential process flow

Also identify any GAPS in the PRD (missing sections like Success Metrics, Out of Scope, etc.)

PRD CONTENT:
{prd_text}

Return your response in this EXACT format:

HYBRID:
```mermaid
[your hybrid mermaid code here]
```

FLOWCHART:
```mermaid
[your flowchart-only mermaid code here]
```

GAPS:
- [List any missing sections, or write "None" if complete]
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
