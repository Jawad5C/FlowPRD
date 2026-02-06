import React, { useState } from 'react';
import DiagramRenderer from './DiagramRenderer';

interface Node {
  id: string;
  shape: string;
  text: string;
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
    hybrid: DiagramData;
    flowchart: DiagramData;
    gaps: string[];
    inputLength: number;
  };
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'hybrid' | 'flowchart'>('side-by-side');

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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('side-by-side')}
            style={{
              padding: '10px 20px',
              border: viewMode === 'side-by-side' ? '2px solid #3B82F6' : '2px solid #E5E7EB',
              background: viewMode === 'side-by-side' ? '#EFF6FF' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('hybrid')}
            style={{
              padding: '10px 20px',
              border: viewMode === 'hybrid' ? '2px solid #3B82F6' : '2px solid #E5E7EB',
              background: viewMode === 'hybrid' ? '#EFF6FF' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Hybrid Only
          </button>
          <button
            onClick={() => setViewMode('flowchart')}
            style={{
              padding: '10px 20px',
              border: viewMode === 'flowchart' ? '2px solid #3B82F6' : '2px solid #E5E7EB',
              background: viewMode === 'flowchart' ? '#EFF6FF' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Flowchart Only
          </button>
        </div>
        
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

      {/* Gaps Alert */}
      {result.gaps.length > 0 && (
        <div style={{
          background: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#92400E' }}>
            ⚠️ Missing Sections Detected
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400E' }}>
            {result.gaps.map((gap, index) => (
              <li key={index}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Diagrams */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'side-by-side' ? '1fr 1fr' : '1fr',
        gap: '20px'
      }}>
        {/* Hybrid Diagram */}
        {(viewMode === 'side-by-side' || viewMode === 'hybrid') && (
          <DiagramCard
            title="📊 Hybrid Version"
            subtitle="Detailed PRD with Rich Text"
            data={result.hybrid}
            onCopy={() => copyJSON(result.hybrid, 'Hybrid')}
            onDownload={() => downloadJSON(result.hybrid, 'hybrid-diagram.json')}
          />
        )}
        
        {/* Flowchart Diagram */}
        {(viewMode === 'side-by-side' || viewMode === 'flowchart') && (
          <DiagramCard
            title="🔄 Flowchart Version"
            subtitle="Simplified Workflow"
            data={result.flowchart}
            onCopy={() => copyJSON(result.flowchart, 'Flowchart')}
            onDownload={() => downloadJSON(result.flowchart, 'flowchart-diagram.json')}
          />
        )}
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
        ✨ Processed {result.inputLength.toLocaleString()} characters • {result.hybrid.nodes.length} nodes in Hybrid • {result.flowchart.nodes.length} nodes in Flowchart
      </div>
    </div>
  );
};

interface DiagramCardProps {
  title: string;
  subtitle: string;
  data: DiagramData;
  onCopy: () => void;
  onDownload: () => void;
}

const DiagramCard: React.FC<DiagramCardProps> = ({ title, subtitle, data, onCopy, onDownload }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
            {title}
          </h3>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
            {subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCopy}
            style={{
              padding: '8px 15px',
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📋 Copy JSON
          </button>
          <button
            onClick={onDownload}
            style={{
              padding: '8px 15px',
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ⬇️ Download
          </button>
        </div>
      </div>
      
      <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
        <DiagramRenderer data={data} />
      </div>
    </div>
  );
};

export default ResultsDisplay;
