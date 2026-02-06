import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Download, Copy, Share2, Image } from 'lucide-react';
import { exportAsPNG, exportAsSVG, copyToClipboard, generateShareableLink } from '../utils/export';
import { FlowNode } from '../types';
import { Edge } from 'reactflow';

interface ExportPanelProps {
  mermaidCode: string;
  nodes: FlowNode[];
  edges: Edge[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ mermaidCode, nodes, edges }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        mermaid.initialize({ 
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        if (mermaidRef.current && mermaidCode) {
          mermaidRef.current.removeAttribute('data-processed');
          mermaidRef.current.innerHTML = mermaidCode;
          await mermaid.run({
            nodes: [mermaidRef.current],
          });
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '<p class="text-red-500 text-sm">Error rendering diagram. Check console for details.</p>';
        }
      }
    };
    
    renderMermaid();
  }, [mermaidCode]);

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(mermaidCode);
      alert('Mermaid code copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  const handleExportPNG = async () => {
    try {
      await exportAsPNG('react-flow-canvas');
      alert('Exported as PNG!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportSVG = async () => {
    try {
      await exportAsSVG('react-flow-canvas');
      alert('Exported as SVG!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleGenerateLink = async () => {
    try {
      const link = generateShareableLink(nodes, edges);
      await copyToClipboard(link);
      alert('Shareable link copied to clipboard!');
    } catch (error) {
      console.error('Link generation failed:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Export & Share</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mermaid Code
          </label>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto max-h-40 border border-gray-200">
              <code>{mermaidCode || 'No diagram generated yet'}</code>
            </pre>
            {mermaidCode && (
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-2 bg-white rounded shadow hover:bg-gray-100"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <div ref={mermaidRef} className="mermaid">
              {mermaidCode || 'No diagram to preview'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExportPNG}
            disabled={!nodes.length}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-squid-teal text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Image className="w-4 h-4" />
            Export PNG
          </button>
          
          <button
            onClick={handleExportSVG}
            disabled={!nodes.length}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-squid-teal text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-4 h-4" />
            Export SVG
          </button>
          
          <button
            onClick={handleCopyCode}
            disabled={!mermaidCode}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-squid-gold text-gray-900 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Copy className="w-4 h-4" />
            Copy Code
          </button>
          
          <button
            onClick={handleGenerateLink}
            disabled={!nodes.length}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-squid-pink text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
