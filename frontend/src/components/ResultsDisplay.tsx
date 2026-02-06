import React, { useState } from 'react';
import DiagramRenderer from './DiagramRenderer';

interface Node {
  id: string;
  shape: string;
  text: string;
  fullText: string;  // NEW: Full PRD content for tooltip
  x: number;
  y: number;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

interface DiagramData {
  nodes: Node[];
  connections: Connection[];
}

interface ResultsDisplayProps {
  result: {
    nodes: Node[];
    connections: Connection[];
    gaps: string[];
    inputLength: number;
  };
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const downloadJSON = (data: DiagramData, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = (data: DiagramData, type: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert(`${type} JSON copied to clipboard!`);
  };

  const diagramData: DiagramData = {
    nodes: result.nodes,
    connections: result.connections
  };

  return (
    <div>
      {/* Control Bar */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: '600', color: '#1F2937' }}>
            📊 PRD Structure Visualization
          </h3>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
            Hover over any shape to see full section details
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => copyJSON(diagramData, 'PRD Diagram')}
            style={{
              padding: '10px 20px',
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📋 Copy JSON
          </button>
          <button
            onClick={() => downloadJSON(diagramData, 'prd-diagram.json')}
            style={{
              padding: '10px 20px',
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ⬇️ Download
          </button>
          <button
            onClick={onReset}
            style={{
              padding: '10px 20px',
              border: '2px solid #EF4444',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#EF4444',
              fontWeight: '500'
            }}
          >
            ↻ Transform Another PRD
          </button>
        </div>
      </div>

      {/* Gaps Alert */}
      {result.gaps.length > 0 && (
        <div style={{
          background: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#92400E', fontSize: '18px' }}>
            ⚠️ Missing PRD Sections Detected
          </h3>
          <p style={{ margin: '0 0 10px 0', color: '#92400E', fontSize: '14px' }}>
            The following sections are missing from your PRD. Check the diagram for AI-generated suggestions.
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400E' }}>
            {result.gaps.map((gap, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Single Full-Width Diagram */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
          <DiagramRenderer data={diagramData} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#F3F4F6',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6B7280',
        fontSize: '14px'
      }}>
        ✨ Processed {result.inputLength.toLocaleString()} characters • {result.nodes.length} sections visualized • {result.gaps.length} missing sections
      </div>
    </div>
  );
};

export default ResultsDisplay;
