import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';

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

interface TransformResult {
  hybrid: DiagramData;
  flowchart: DiagramData;
  gaps: string[];
  inputLength: number;
}

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async (fileOrText: File | string) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      
      if (typeof fileOrText === 'string') {
        // Text input
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fileOrText })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setResult({
            hybrid: data.hybrid,
            flowchart: data.flowchart,
            gaps: data.gaps_detected || [],
            inputLength: data.input_length
          });
        } else {
          setError(data.error || 'Transformation failed');
        }
      } else {
        // File upload
        formData.append('file', fileOrText);
        
        const response = await fetch('/api/transform', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          setResult({
            hybrid: data.hybrid,
            flowchart: data.flowchart,
            gaps: data.gaps_detected || [],
            inputLength: data.input_length
          });
        } else {
          setError(data.error || 'Transformation failed');
        }
      }
    } catch (err) {
      console.error('Transform error:', err);
      setError('Failed to connect to backend. Make sure Flask is running on port 5000.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3.5em',
            fontWeight: '800',
            marginBottom: '10px',
            textShadow: '2px 2px 20px rgba(0,0,0,0.3)'
          }}>
            FlowPRD
          </h1>
          <p style={{
            fontSize: '1.2em',
            opacity: 0.95,
            fontWeight: '300'
          }}>
            AI-Powered Visual PRD Transformer
          </p>
        </header>

        {!result ? (
          <FileUpload 
            onTransform={handleTransform} 
            isProcessing={isProcessing}
            error={error}
          />
        ) : (
          <ResultsDisplay 
            result={result} 
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default App;
