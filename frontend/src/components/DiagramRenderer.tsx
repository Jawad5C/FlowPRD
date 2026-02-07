import React from 'react';
import Shape from './Shape';

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

interface DiagramRendererProps {
  data: DiagramData;
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ data }) => {
  const { nodes, connections } = data;
  
  // Calculate SVG dimensions based on node positions with extra padding
  const maxX = Math.max(...nodes.map(n => n.x)) + 400;
  const maxY = Math.max(...nodes.map(n => n.y)) + 300;
  const minX = Math.min(...nodes.map(n => n.x)) - 400;
  const minY = Math.min(...nodes.map(n => n.y)) - 300;
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Find node by ID
  const findNode = (id: string) => nodes.find(n => n.id === id);
  
  // Render arrow between nodes (smart edge detection for any angle)
  const renderConnection = (conn: Connection) => {
    const fromNode = findNode(conn.from);
    const toNode = findNode(conn.to);
    
    if (!fromNode || !toNode) return null;
    
    // Calculate angle between nodes
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    
    // Shape dimensions (accounting for label space)
    const shapeWidth = 450; // Updated to match new shape size
    const shapeHeight = 186; // 160 + 26 for label space
    
    // Calculate edge points based on angle
    // For "from" node - find exit point on edge
    let x1, y1;
    if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
      // More horizontal - use left/right edge
      x1 = fromNode.x + (Math.cos(angle) > 0 ? shapeWidth/2 : -shapeWidth/2);
      y1 = fromNode.y + (shapeHeight/2) * Math.sin(angle) / Math.abs(Math.cos(angle));
    } else {
      // More vertical - use top/bottom edge
      x1 = fromNode.x + (shapeWidth/2) * Math.cos(angle) / Math.abs(Math.sin(angle));
      y1 = fromNode.y + (Math.sin(angle) > 0 ? shapeHeight/2 : -shapeHeight/2);
    }
    
    // For "to" node - find entry point on opposite edge
    const reverseAngle = angle + Math.PI;
    let x2, y2;
    if (Math.abs(Math.cos(reverseAngle)) > Math.abs(Math.sin(reverseAngle))) {
      // More horizontal - use left/right edge
      x2 = toNode.x + (Math.cos(reverseAngle) > 0 ? shapeWidth/2 : -shapeWidth/2);
      y2 = toNode.y + (shapeHeight/2) * Math.sin(reverseAngle) / Math.abs(Math.cos(reverseAngle));
    } else {
      // More vertical - use top/bottom edge
      x2 = toNode.x + (shapeWidth/2) * Math.cos(reverseAngle) / Math.abs(Math.sin(reverseAngle));
      y2 = toNode.y + (Math.sin(reverseAngle) > 0 ? shapeHeight/2 : -shapeHeight/2);
    }
    
    return (
      <g key={`${conn.from}-${conn.to}`}>
        <defs>
          <marker
            id={`arrowhead-${conn.from}-${conn.to}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#94A3B8" />
          </marker>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#94A3B8"
          strokeWidth="2"
          markerEnd={`url(#arrowhead-${conn.from}-${conn.to})`}
        />
        {conn.label && (
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2}
            textAnchor="middle"
            fill="#E2E8F0"
            fontSize="12"
            fontFamily="Arial, sans-serif"
          >
            {conn.label}
          </text>
        )}
      </g>
    );
  };
  
  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`${minX} ${minY} ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ background: '#0F172A', borderRadius: '8px', maxHeight: '80vh' }}
    >
      {/* Render connections first (behind nodes) */}
      {connections.map(renderConnection)}
      
      {/* Render nodes */}
      {nodes.map(node => (
        <Shape
          key={node.id}
          type={node.shape}
          text={node.text}
          fullText={node.fullText}
          x={node.x}
          y={node.y}
          color={node.color}
          width={320}
          height={120}
        />
      ))}
    </svg>
  );
};

export default DiagramRenderer;
