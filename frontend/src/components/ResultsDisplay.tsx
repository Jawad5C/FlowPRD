import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';

interface ResultsDisplayProps {
  result: {
    hybrid: string;
    flowchart: string;
    gaps: string[];
    inputLength: number;
  };
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'hybrid' | 'flowchart'>('side-by-side');

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
    
    // Render diagrams after a short delay to ensure DOM is ready
    setTimeout(() => {
      mermaid.run();
    }, 100);
  }, [result]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Control Bar */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewMode('side-by-side')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              background: viewMode === 'side-by-side' ? '#667eea' : '#e2e8f0',
              color: viewMode === 'side-by-side' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ⚡ Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('hybrid')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              background: viewMode === 'hybrid' ? '#667eea' : '#e2e8f0',
              color: viewMode === 'hybrid' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📊 Hybrid Only
          </button>
          <button
            onClick={() => setViewMode('flowchart')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              background: viewMode === 'flowchart' ? '#667eea' : '#e2e8f0',
              color: viewMode === 'flowchart' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Flowchart Only
          </button>
        </div>

        <button
          onClick={onReset}
          style={{
            padding: '10px 25px',
            border: 'none',
            borderRadius: '10px',
            background: '#ef4444',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 New PRD
        </button>
      </div>

      {/* Gaps Detection */}
      {result.gaps.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            fontSize: '1.2em', 
            marginBottom: '10px',
            color: '#92400e',
            fontWeight: '700'
          }}>
            ⚠️ Missing Sections Detected
          </h3>
          <ul style={{ 
            marginLeft: '20px',
            color: '#78350f'
          }}>
            {result.gaps.map((gap, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{gap}</li>
            ))}
          </ul>
          <p style={{ 
            marginTop: '10px',
            fontSize: '0.9em',
            color: '#78350f',
            fontStyle: 'italic'
          }}>
            💡 Consider adding these sections for a complete PRD
          </p>
        </div>
      )}

      {/* Results Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'side-by-side' ? '1fr 1fr' : '1fr',
        gap: '20px'
      }}>
        {(viewMode === 'side-by-side' || viewMode === 'hybrid') && (
          <DiagramCard
            title="📊 Hybrid Version"
            subtitle="Visual + Detailed Text"
            mermaidCode={result.hybrid}
            onCopy={() => copyToClipboard('```mermaid\n' + result.hybrid + '\n```', 'Hybrid diagram')}
            onDownload={() => downloadMarkdown('```mermaid\n' + result.hybrid + '\n```', 'flowprd-hybrid.md')}
          />
        )}

        {(viewMode === 'side-by-side' || viewMode === 'flowchart') && (
          <DiagramCard
            title="🔄 Flowchart Version"
            subtitle="Pure Visual (90%+ UML Compliant)"
            mermaidCode={result.flowchart}
            onCopy={() => copyToClipboard('```mermaid\n' + result.flowchart + '\n```', 'Flowchart diagram')}
            onDownload={() => downloadMarkdown('```mermaid\n' + result.flowchart + '\n```', 'flowprd-flowchart.md')}
          />
        )}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        color: 'white',
        fontSize: '0.9em'
      }}>
        ✨ Processed {result.inputLength} characters • Generated {result.gaps.length === 0 ? 'Complete' : 'Partial'} PRD
      </div>
    </div>
  );
};

interface DiagramCardProps {
  title: string;
  subtitle: string;
  mermaidCode: string;
  onCopy: () => void;
  onDownload: () => void;
}

const DiagramCard: React.FC<DiagramCardProps> = ({ title, subtitle, mermaidCode, onCopy, onDownload }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.3em', fontWeight: '700', color: '#1e293b' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.85em', color: '#64748b', marginTop: '3px' }}>
            {subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCopy}
            style={{
              padding: '8px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              color: '#64748b',
              fontSize: '0.85em',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📋 Copy
          </button>
          <button
            onClick={onDownload}
            style={{
              padding: '8px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              color: '#64748b',
              fontSize: '0.85em',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💾 Download
          </button>
        </div>
      </div>

      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        overflow: 'auto',
        maxHeight: '600px'
      }}>
        <pre className="mermaid">
          {mermaidCode}
        </pre>
      </div>
    </div>
  );
};

export default ResultsDisplay;
