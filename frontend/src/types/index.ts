import { Node, Edge } from 'reactflow';

export type ShapeType = 'stadium' | 'rectangle' | 'rounded' | 'parallelogram' | 'diamond' | 'hexagon' | 'cylinder';

export interface FlowNode extends Node {
  data: {
    label: string;
    shapeType: ShapeType;
    color: string;
  };
}

export interface PRDData {
  nodes: FlowNode[];
  edges: Edge[];
  mermaidCode: string;
}

export interface GapAnalysisItem {
  id: string;
  category: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  dismissed: boolean;
}

export interface ConventionViolation {
  nodeId: string;
  nodeName: string;
  currentShape: ShapeType;
  suggestedShape: ShapeType;
  reason: string;
}

export interface ValidationResult {
  conventionScore: number;
  violations: ConventionViolation[];
  aiReadiness: boolean;
  gapAnalysis: GapAnalysisItem[];
}

export interface ShapeDefinition {
  type: ShapeType;
  label: string;
  color: string;
  mermaidPrefix: string;
  mermaidSuffix: string;
  useFor: string;
  icon: string;
}
