import React, { useState } from 'react';

interface ShapeProps {
  type: string;
  text: string;
  fullText: string;  // Full PRD content for tooltip
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

// Shape type labels for display (UML-aligned)
const shapeLabels: { [key: string]: string } = {
  stadium: "START/END",
  rectangle: "ACTIVITY",
  rounded_box: "DESCRIPTION",
  parallelogram: "INPUT/OUTPUT",
  diamond: "DECISION",
  hexagon: "CONSTRAINT",
  cylinder: "DATA/RESOURCES"
};

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

const Shape: React.FC<ShapeProps> = ({ type, text, fullText, x, y, color, width = 540, height = 192 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate max characters per line based on shape width
  // Special handling for shapes with angled/curved sides
  let usableWidthPercent = 0.9;
  if (type === 'hexagon') usableWidthPercent = 0.65;  // Angled sides reduce space
  if (type === 'diamond') usableWidthPercent = 0.5;   // Diamond is very narrow
  if (type === 'parallelogram') usableWidthPercent = 0.8; // Slanted sides
  
  const usableWidth = width * usableWidthPercent;
  const maxCharsPerLine = Math.floor(usableWidth / 14); // ~14px per character at 26px font
  
  // Wrap text to fit within shape
  const textLines = wrapText(text, maxCharsPerLine);
  
  // Adjust height if text needs more space
  const fontSize = 26;
  const lineHeight = 36;
  const paddingVertical = 54;
  const labelHeight = 31; // Space for shape type label
  const requiredHeight = (textLines.length * lineHeight) + paddingVertical + labelHeight;
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
  
  // Render shape type label (small text at top)
  const renderLabel = () => {
    const labelY = y - finalHeight / 2 + 24; // Near top of shape
    
    return (
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="17"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        opacity="0.8"
      >
        {shapeLabels[type] || type.toUpperCase()}
      </text>
    );
  };
  
  // Render text with proper wrapping
  const renderText = () => {
    const startY = y - (textLines.length * lineHeight) / 2 + fontSize / 2 + 10; // Offset for label
    
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
  
  // Render hover tooltip with full PRD text
  const renderTooltip = () => {
    if (!showTooltip) return null;
    
    const tooltipWidth = 600;
    const tooltipPadding = 29;
    const tooltipLineHeight = 31;
    
    // Wrap full text for tooltip
    const tooltipLines = wrapText(fullText, 70); // ~70 chars per line for tooltip
    const tooltipHeight = (tooltipLines.length * tooltipLineHeight) + (tooltipPadding * 2);
    
    // Position tooltip above the shape
    const tooltipX = x;
    const tooltipY = y - finalHeight / 2 - tooltipHeight - 20;
    
    return (
      <g>
        {/* Tooltip background with shadow */}
        <rect
          x={tooltipX - tooltipWidth / 2}
          y={tooltipY}
          width={tooltipWidth}
          height={tooltipHeight}
          fill="#1E293B"
          stroke="#64748B"
          strokeWidth="2"
          rx="8"
          filter="url(#tooltip-shadow)"
        />
        
        {/* Tooltip text */}
        <text
          x={tooltipX}
          y={tooltipY + tooltipPadding + 19}
          textAnchor="middle"
          fill="#F1F5F9"
          fontSize="19"
          fontFamily="Arial, sans-serif"
        >
          {tooltipLines.map((line, i) => (
            <tspan 
              key={i}
              x={tooltipX}
              y={tooltipY + tooltipPadding + 19 + (i * tooltipLineHeight)}
              textAnchor="middle"
            >
              {line}
            </tspan>
          ))}
        </text>
        
        {/* Tooltip arrow pointing to shape */}
        <path
          d={`M ${tooltipX - 10} ${tooltipY + tooltipHeight}
              L ${tooltipX} ${tooltipY + tooltipHeight + 10}
              L ${tooltipX + 10} ${tooltipY + tooltipHeight}
              Z`}
          fill="#1E293B"
          stroke="#64748B"
          strokeWidth="1"
        />
      </g>
    );
  };
  
  return (
    <g 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Define shadow filter for tooltip */}
      <defs>
        <filter id="tooltip-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {renderShape()}
      {renderLabel()}
      {renderText()}
      {renderTooltip()}
    </g>
  );
};

export default Shape;
