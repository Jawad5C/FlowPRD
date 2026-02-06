import { FlowNode } from '../types';
import { Edge } from 'reactflow';
import { getShapeDefinition } from './shapeDefinitions';

export const generateMermaidCode = (nodes: FlowNode[], edges: Edge[]): string => {
  if (!nodes || nodes.length === 0) {
    return 'graph TD\n  Start["Add shapes to begin"]';
  }
  
  let code = 'graph TD\n';
  
  // Add nodes
  nodes.forEach(node => {
    try {
      const shape = getShapeDefinition(node.data.shapeType);
      const nodeId = (node.id || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
      const label = (node.data.label || 'Untitled').replace(/"/g, "'");
      const color = node.data.color || '#CCCCCC';
      
      code += `  ${nodeId}${shape.mermaidPrefix}${label}${shape.mermaidSuffix}\n`;
      
      // Add styling
      code += `  style ${nodeId} fill:${color}\n`;
    } catch (error) {
      console.error('Error generating mermaid code for node:', node.id, error);
    }
  });
  
  // Add edges
  edges.forEach(edge => {
    try {
      const sourceId = (edge.source || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
      const targetId = (edge.target || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
      code += `  ${sourceId} --> ${targetId}\n`;
    } catch (error) {
      console.error('Error generating mermaid code for edge:', edge.id, error);
    }
  });
  
  return code;
};

export const exportAsPNG = async (elementId: string, filename: string = 'flowprd-diagram.png'): Promise<void> => {
  try {
    const { toPng } = await import('html-to-image');
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Canvas element not found. Please ensure the diagram is visible.');
    }
    
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('PNG export error:', error);
    throw new Error('Failed to export PNG. Please try again.');
  }
};

export const exportAsSVG = async (elementId: string, filename: string = 'flowprd-diagram.svg'): Promise<void> => {
  try {
    const { toSvg } = await import('html-to-image');
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Canvas element not found. Please ensure the diagram is visible.');
    }
    
    const dataUrl = await toSvg(element, {
      backgroundColor: '#ffffff',
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('SVG export error:', error);
    throw new Error('Failed to export SVG. Please try again.');
  }
};

export const copyToClipboard = async (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      document.body.removeChild(textarea);
      throw new Error('Failed to copy to clipboard');
    }
    return;
  }
  await navigator.clipboard.writeText(text);
};

export const generateShareableLink = (nodes: FlowNode[], edges: Edge[]): string => {
  const data = { nodes, edges };
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}/share/${encoded}`;
};
