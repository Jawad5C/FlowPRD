import React from 'react';
import { SHAPE_DEFINITIONS } from '../utils/shapeDefinitions';
import { ShapeType } from '../types';

interface ShapePaletteProps {
  onShapeSelect: (shapeType: ShapeType) => void;
  selectedShape: ShapeType | null;
}

const ShapePalette: React.FC<ShapePaletteProps> = ({ onShapeSelect, selectedShape }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Shape Palette</h3>
      <div className="flex flex-wrap gap-2">
        {SHAPE_DEFINITIONS.map((shape) => (
          <button
            key={shape.type}
            onClick={() => onShapeSelect(shape.type)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
              hover:shadow-md min-w-[100px]
              ${selectedShape === shape.type 
                ? 'border-squid-pink bg-squid-light-pink' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            title={shape.useFor}
          >
            <div 
              className="text-3xl mb-1"
              style={{ color: shape.color === '#FFFFFF' ? '#000000' : shape.color }}
            >
              {shape.icon}
            </div>
            <span className="text-xs font-medium text-gray-700">{shape.label}</span>
            <span className="text-[10px] text-gray-500 text-center mt-1 line-clamp-2">
              {shape.useFor}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapePalette;
