import { ShapeDefinition, ShapeType } from '../types';

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    type: 'stadium',
    label: 'Stadium/Oval',
    color: '#ED1B76',
    mermaidPrefix: '([',
    mermaidSuffix: '])',
    useFor: 'Start/End Points, Users, Actors',
    icon: '⬭',
  },
  {
    type: 'rectangle',
    label: 'Rectangle',
    color: '#067D72',
    mermaidPrefix: '[',
    mermaidSuffix: ']',
    useFor: 'Standard Items, Features, Processes',
    icon: '▭',
  },
  {
    type: 'rounded',
    label: 'Rounded Box',
    color: '#E0F5F3',
    mermaidPrefix: '["',
    mermaidSuffix: '"]',
    useFor: 'Descriptions, Details, Pain Points',
    icon: '▢',
  },
  {
    type: 'parallelogram',
    label: 'Parallelogram',
    color: '#FFD700',
    mermaidPrefix: '[/"',
    mermaidSuffix: '"\\]',
    useFor: 'Functional Requirements (FR)',
    icon: '▱',
  },
  {
    type: 'diamond',
    label: 'Diamond',
    color: '#FFFFFF',
    mermaidPrefix: '{',
    mermaidSuffix: '}',
    useFor: 'Decisions, Status, Conditions',
    icon: '◆',
  },
  {
    type: 'hexagon',
    label: 'Hexagon',
    color: '#0B1C3D',
    mermaidPrefix: '{{',
    mermaidSuffix: '}}',
    useFor: 'Constraints, Rules, Limitations',
    icon: '⬡',
  },
  {
    type: 'cylinder',
    label: 'Cylinder',
    color: '#FFE4EC',
    mermaidPrefix: '[(',
    mermaidSuffix: ')]',
    useFor: 'Databases, Storage',
    icon: '⬮',
  },
];

export const getShapeDefinition = (type: ShapeType): ShapeDefinition => {
  const definition = SHAPE_DEFINITIONS.find(s => s.type === type);
  if (!definition) {
    console.warn(`Unknown shape type: ${type}, falling back to rectangle`);
    return SHAPE_DEFINITIONS.find(s => s.type === 'rectangle') || SHAPE_DEFINITIONS[0];
  }
  return definition;
};

export const getShapeColor = (type: ShapeType): string => {
  const definition = getShapeDefinition(type);
  return definition?.color || '#CCCCCC';
};
