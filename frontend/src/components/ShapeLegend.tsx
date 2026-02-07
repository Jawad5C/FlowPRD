import React from 'react';

/** Shapes and meanings used in our PRD diagrams (matches Shape.tsx + backend) */
const SHAPE_LEGEND = [
  {
    type: 'stadium',
    label: 'START / END',
    meaning: 'Start/End points, Users & Actors',
    color: '#10B981',
    icon: '⬭',
  },
  {
    type: 'rectangle',
    label: 'ACTIVITY',
    meaning: 'Features, Actions, Processes (e.g. Problem, Solution, Requirements)',
    color: '#8B5CF6',
    icon: '▭',
  },
  {
    type: 'rounded_box',
    label: 'DESCRIPTION',
    meaning: 'Problem/Solution descriptions, details',
    color: '#3B82F6',
    icon: '▢',
  },
  {
    type: 'parallelogram',
    label: 'INPUT / OUTPUT',
    meaning: 'Functional Requirements (FR)',
    color: '#F59E0B',
    icon: '▱',
  },
  {
    type: 'diamond',
    label: 'DECISION',
    meaning: 'Decisions, Questions, Timeline, Dependencies',
    color: '#EAB308',
    icon: '◆',
  },
  {
    type: 'hexagon',
    label: 'CONSTRAINT',
    meaning: 'Constraints, Rules, Principles',
    color: '#EC4899',
    icon: '⬡',
  },
  {
    type: 'cylinder',
    label: 'DATA / RESOURCES',
    meaning: 'Databases, Storage, Technical implementation',
    color: '#06B6D4',
    icon: '⬮',
  },
];

const ShapeLegend: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200 flex-1 min-h-0 min-w-0 overflow-auto">
      <h3 className="text-base font-semibold text-squid-navy mb-3">
        Shapes &amp; meanings
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {SHAPE_LEGEND.map((item) => (
          <div
            key={item.type}
            className="flex items-start gap-3 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-squid-teal/30 hover:bg-gray-50 transition-colors min-w-0"
            title={`${item.label}: ${item.meaning}`}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{
                backgroundColor: `${item.color}22`,
                color: item.color,
              }}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: item.color }}
              >
                {item.label}
              </p>
              <p className="text-xs text-gray-600 mt-0.5 leading-snug break-words">
                {item.meaning}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">Red = missing section (AI suggestion)</p>
    </div>
  );
};

export default ShapeLegend;
