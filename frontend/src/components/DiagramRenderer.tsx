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
  
  // Calculate SVG dimensions based on node positions
  const maxX = Math.max(...nodes.map(n => n.x)) + 300;
  const maxY = Math.max(...nodes.map(n => n.y)) + 200;
  const minX = Math.min(...nodes.map(n => n.x)) - 300;
  const minY = Math.min(...nodes.map(n => n.y)) - 200;
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Find node by ID
  const findNode = (id: string) => nodes.find(n => n.id === id);
  
  // Render arrow between nodes
  const renderConnection = (conn: Connection) => {
    const fromNode = findNode(conn.from);
    const toNode = findNode(conn.to);
    
    if (!fromNode || !toNode) return null;
    
    const x1 = fromNode.x;
    const y1 = fromNode.y + 60; // Bottom of from node (more space for tall shapes)
    const x2 = toNode.x;
    const y2 = toNode.y - 60; // Top of to node (more space for tall shapes)
    
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
      height={height + 100}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      style={{ background: '#0F172A', borderRadius: '8px' }}
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
          width={280}
          height={100}
        />
      ))}
    </svg>
  );
};

export default DiagramRenderer;
