import React from 'react';

interface ShapeProps {
  type: string;
  text: string;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

// Helper function to wrap text to fit within width
const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
};

const Shape: React.FC<ShapeProps> = ({ type, text, x, y, color, width = 220, height = 80 }) => {
  // Calculate max characters per line based on shape width
  // Special handling for shapes with angled/curved sides
  let usableWidthPercent = 0.9;
  if (type === 'hexagon') usableWidthPercent = 0.65;  // Angled sides reduce space
  if (type === 'diamond') usableWidthPercent = 0.5;   // Diamond is very narrow
  if (type === 'parallelogram') usableWidthPercent = 0.8; // Slanted sides
  
  const usableWidth = width * usableWidthPercent;
  const maxCharsPerLine = Math.floor(usableWidth / 9); // ~9px per character at 15px font
  
  // Wrap text to fit within shape
  const textLines = wrapText(text, maxCharsPerLine);
  
  // Adjust height if text needs more space
  const fontSize = 15;
  const lineHeight = 20;
  const paddingVertical = 25;
  const requiredHeight = (textLines.length * lineHeight) + paddingVertical;
  const finalHeight = Math.max(height, requiredHeight);
  
  const renderShape = () => {
    switch (type) {
      case 'stadium':
        // Rounded ends (Start/End/Users)
        return (
          <g>
            <rect
              x={x - width / 2}
              y={y - finalHeight / 2}
              width={width}
              height={finalHeight}
              rx={finalHeight / 2}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'rectangle':
        // Standard rectangle (Features/Actions)
        return (
          <g>
            <rect
              x={x - width / 2}
              y={y - finalHeight / 2}
              width={width}
              height={finalHeight}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'rounded_box':
        // Rounded corners (Problem/Solution/Descriptions)
        return (
          <g>
            <rect
              x={x - width / 2}
              y={y - finalHeight / 2}
              width={width}
              height={finalHeight}
              rx="10"
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'parallelogram':
        // Slanted (Requirements)
        const skew = 15;
        return (
          <g>
            <path
              d={`M ${x - width / 2 + skew} ${y - finalHeight / 2}
                  L ${x + width / 2 + skew} ${y - finalHeight / 2}
                  L ${x + width / 2 - skew} ${y + finalHeight / 2}
                  L ${x - width / 2 - skew} ${y + finalHeight / 2}
                  Z`}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'diamond':
        // Diamond (Decisions/Questions) - Keep compact
        const diamondSize = Math.max(width * 1.2, finalHeight * 1.2);
        return (
          <g>
            <path
              d={`M ${x} ${y - diamondSize / 2}
                  L ${x + diamondSize / 2} ${y}
                  L ${x} ${y + diamondSize / 2}
                  L ${x - diamondSize / 2} ${y}
                  Z`}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'hexagon':
        // Hexagon (Constraints/Rules)
        const hexWidth = width * 0.85;
        const hexHeight = finalHeight;
        const offset = hexWidth * 0.2;
        return (
          <g>
            <path
              d={`M ${x - hexWidth / 2 + offset} ${y - hexHeight / 2}
                  L ${x + hexWidth / 2 - offset} ${y - hexHeight / 2}
                  L ${x + hexWidth / 2} ${y}
                  L ${x + hexWidth / 2 - offset} ${y + hexHeight / 2}
                  L ${x - hexWidth / 2 + offset} ${y + hexHeight / 2}
                  L ${x - hexWidth / 2} ${y}
                  Z`}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'cylinder':
        // Cylinder (Databases/Storage)
        const cylHeight = finalHeight - 20;
        const ellipseRy = 10;
        return (
          <g>
            <ellipse
              cx={x}
              cy={y - cylHeight / 2}
              rx={width / 2}
              ry={ellipseRy}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
            <rect
              x={x - width / 2}
              y={y - cylHeight / 2}
              width={width}
              height={cylHeight}
              fill={color}
              stroke="none"
            />
            <line
              x1={x - width / 2}
              y1={y - cylHeight / 2}
              x2={x - width / 2}
              y2={y + cylHeight / 2}
              stroke="#fff"
              strokeWidth="2"
            />
            <line
              x1={x + width / 2}
              y1={y - cylHeight / 2}
              x2={x + width / 2}
              y2={y + cylHeight / 2}
              stroke="#fff"
              strokeWidth="2"
            />
            <ellipse
              cx={x}
              cy={y + cylHeight / 2}
              rx={width / 2}
              ry={ellipseRy}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      default:
        return null;
    }
  };
  
  // Render text with proper wrapping
  const renderText = () => {
    const startY = y - (textLines.length * lineHeight) / 2 + fontSize / 2;
    
    return (
      <text
        textAnchor="middle"
        fill="#fff"
        fontSize={fontSize}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {textLines.map((line, i) => (
          <tspan 
            key={i} 
            x={x} 
            y={startY + (i * lineHeight)}
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };
  
  return (
    <g>
      {renderShape()}
      {renderText()}
    </g>
  );
};

export default Shape;
