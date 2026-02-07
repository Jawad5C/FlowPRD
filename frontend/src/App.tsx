import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import ShapeLegend from './components/ShapeLegend';
import { FileText } from 'lucide-react';

interface Node {
  id: string;
  shape: string;
  text: string;
  fullText: string;
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
  nodes: Node[];
  connections: Connection[];
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
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fileOrText }),
        });
        const data = await response.json();
        if (data.success) {
          setResult({
            nodes: data.nodes,
            connections: data.connections,
            gaps: data.gaps_detected || [],
            inputLength: data.input_length,
          });
        } else {
          setError(data.error || 'Transformation failed');
        }
      } else {
        formData.append('file', fileOrText);
        const response = await fetch('/api/transform', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setResult({
            nodes: data.nodes,
            connections: data.connections,
            gaps: data.gaps_detected || [],
            inputLength: data.input_length,
          });
        } else {
          setError(data.error || 'Transformation failed');
        }
      }
    } catch (err) {
      console.error('Transform error:', err);
      setError('Failed to connect to backend. Make sure Flask is running on port 5001.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Her design: header with squid color scheme */}
      <header className="bg-squid-navy text-white py-4 px-6 shadow-lg">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <FileText className="w-8 h-8 text-squid-pink flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">FlowPRD</h1>
            <p className="text-sm text-gray-300">
              AI-Powered Visual PRD Transformer
            </p>
          </div>
        </div>
      </header>

      {/* Both sections on the same page: upload left, results right */}
      <main className="flex-1 py-2 px-2 sm:px-3 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 flex gap-3 max-w-[1600px] mx-auto w-full min-h-0">
          {/* Left: upload + shapes (wider so shapes fit container) */}
          <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-4 min-h-0 max-h-[calc(100vh-6rem)]">
            <FileUpload
              onTransform={handleTransform}
              isProcessing={isProcessing}
              error={error}
            />
            <ShapeLegend />
          </div>
          {/* Right: Results / diagram */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            {result ? (
              <ResultsDisplay result={result} onReset={handleReset} />
            ) : (
              <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow flex items-center justify-center text-gray-400 p-8">
                <p className="text-center">
                  Transform a PRD (file or text) to see the diagram here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
