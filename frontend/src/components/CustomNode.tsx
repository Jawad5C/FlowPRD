import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trash2 } from 'lucide-react';

const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onLabelChange) {
      data.onLabelChange(id, label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const getShapeStyle = () => {
    const baseStyle = {
      backgroundColor: data.color,
      border: '2px solid #333',
      color: data.color === '#FFFFFF' || data.color === '#FFD700' ? '#000' : '#fff',
      padding: '8px 16px',
      minWidth: '120px',
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: 500,
    };

    switch (data.shapeType) {
      case 'stadium':
        return { ...baseStyle, borderRadius: '50px' };
      case 'rectangle':
        return { ...baseStyle, borderRadius: '4px' };
      case 'rounded':
        return { ...baseStyle, borderRadius: '12px' };
      case 'parallelogram':
        return { ...baseStyle, transform: 'skew(-20deg)', borderRadius: '4px' };
      case 'diamond':
        return { 
          ...baseStyle, 
          transform: 'rotate(45deg)', 
          width: '80px', 
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      case 'hexagon':
        return { ...baseStyle, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
      case 'cylinder':
        return { ...baseStyle, borderRadius: '50px 50px 4px 4px' };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} />
      <div style={getShapeStyle()} onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-transparent border-none outline-none w-full text-center"
            style={{ 
              color: data.color === '#FFFFFF' || data.color === '#FFD700' ? '#000' : '#fff',
              transform: data.shapeType === 'diamond' ? 'rotate(-45deg)' : data.shapeType === 'parallelogram' ? 'skew(20deg)' : 'none',
            }}
          />
        ) : (
          <span 
            style={{ 
              transform: data.shapeType === 'diamond' ? 'rotate(-45deg)' : data.shapeType === 'parallelogram' ? 'skew(20deg)' : 'none',
              display: 'inline-block',
            }}
          >
            {label}
          </span>
        )}
      </div>
      <button
        onClick={handleDelete}
        className={`
          absolute -top-2 -right-2 p-1 rounded-full 
          ${data.deleteConfirm ? 'bg-red-500' : 'bg-gray-700'} 
          text-white opacity-0 group-hover:opacity-100 transition-opacity
          hover:scale-110
        `}
        title={data.deleteConfirm ? 'Click again to confirm' : 'Delete node'}
      >
        <Trash2 className="w-3 h-3" />
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
