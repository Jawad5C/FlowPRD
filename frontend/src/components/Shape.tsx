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

const Shape: React.FC<ShapeProps> = ({ type, text, x, y, color, width = 200, height = 80 }) => {
  const textLines = text.split('\n');
  const fontSize = 14;
  const lineHeight = 18;
  
  const renderShape = () => {
    switch (type) {
      case 'stadium':
        // Rounded ends (Start/End/Users)
        return (
          <g>
            <rect
              x={x - width / 2}
              y={y - height / 2}
              width={width}
              height={height}
              rx={height / 2}
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
              y={y - height / 2}
              width={width}
              height={height}
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
              y={y - height / 2}
              width={width}
              height={height}
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
              d={`M ${x - width / 2 + skew} ${y - height / 2}
                  L ${x + width / 2 + skew} ${y - height / 2}
                  L ${x + width / 2 - skew} ${y + height / 2}
                  L ${x - width / 2 - skew} ${y + height / 2}
                  Z`}
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        );
      
      case 'diamond':
        // Diamond (Decisions/Questions)
        const diamondSize = Math.max(width, height) * 0.7;
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
        const hexHeight = height;
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
        const cylHeight = height - 20;
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
  
  // Render text
  const renderText = () => {
    return (
      <text
        x={x}
        y={y - (textLines.length * lineHeight) / 2 + fontSize}
        textAnchor="middle"
        fill="#fff"
        fontSize={fontSize}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {textLines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
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
