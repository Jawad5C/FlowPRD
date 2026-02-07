import React from 'react';
import DiagramRenderer from './DiagramRenderer';

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
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
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
    connections: result.connections,
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-5">
      {/* Control Bar - her panel style */}
      <div className="bg-white rounded-xl p-5 shadow border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-squid-navy m-0 mb-1">
            📊 PRD Structure Visualization
          </h3>
          <p className="text-gray-500 text-sm m-0">
            Hover over any shape to see full section details
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => copyJSON(diagramData, 'PRD Diagram')}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-medium text-squid-navy hover:bg-gray-50 transition-colors"
          >
            📋 Copy JSON
          </button>
          <button
            type="button"
            onClick={() => downloadJSON(diagramData, 'prd-diagram.json')}
            className="px-5 py-2.5 bg-squid-teal text-white rounded-lg font-medium hover:bg-squid-teal/90 transition-colors"
          >
            ⬇️ Download
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 bg-white border-2 border-squid-pink text-squid-pink rounded-lg font-medium hover:bg-squid-light-pink/30 transition-colors"
          >
            ↻ Transform Another PRD
          </button>
        </div>
      </div>

      {/* Gaps Alert - keep behavior, her-style panel */}
      {result.gaps.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
          <h3 className="text-amber-900 font-semibold text-lg m-0 mb-2">
            ⚠️ Missing PRD Sections Detected
          </h3>
          <p className="text-amber-800 text-sm m-0 mb-2">
            The following sections are missing from your PRD. Check the diagram
            for AI-generated suggestions.
          </p>
          <ul className="list-disc pl-6 m-0 text-amber-800">
            {result.gaps.map((gap, index) => (
              <li key={index} className="mb-1">
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Diagram (legend is on the left column of the same page) */}
      <div className="flex-1 min-h-0 bg-white rounded-xl p-5 shadow border border-gray-200 flex flex-col overflow-hidden">
        <div className="border border-gray-200 rounded-xl overflow-auto flex-1 min-h-0">
          <DiagramRenderer data={diagramData} />
        </div>
      </div>

      {/* Footer - her colors */}
      <div className="flex-shrink-0 py-4 px-5 bg-gray-100 rounded-xl text-center text-gray-600 text-sm">
        ✨ Processed {result.inputLength.toLocaleString()} characters •{' '}
        {result.nodes.length} sections visualized • {result.gaps.length} missing
        sections
      </div>
    </div>
  );
};

export default ResultsDisplay;
