import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowNode, ShapeType } from '../types';
import CustomNode from './CustomNode';
import { getShapeColor } from '../utils/shapeDefinitions';
import { getLayoutedElements } from '../utils/autoLayout';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { Undo2, Redo2, Layout } from 'lucide-react';

interface VisualEditorProps {
  selectedShape: ShapeType | null;
  onNodesChange: (nodes: FlowNode[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  initialNodes?: FlowNode[];
  initialEdges?: Edge[];
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const VisualEditor: React.FC<VisualEditorProps> = ({
  selectedShape,
  onNodesChange,
  onEdgesChange,
  initialNodes = [],
  initialEdges = [],
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(initialNodes, initialEdges);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, type: 'smoothstep' }, edges);
      setEdges(newEdges);
      saveState(nodes as FlowNode[], newEdges);
      onEdgesChange(newEdges);
    },
    [edges, nodes, saveState, onEdgesChange, setEdges]
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!selectedShape || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 80,
        y: event.clientY - bounds.top - 40,
      };

      // Ensure position is within reasonable bounds
      if (position.x < 0 || position.y < 0) return;

      const newNode: FlowNode = {
        id: `node-${nodeIdCounter}`,
        type: 'custom',
        position,
        data: {
          label: `New ${selectedShape}`,
          shapeType: selectedShape,
          color: getShapeColor(selectedShape),
        },
      };

      const newNodes = [...nodes, newNode] as FlowNode[];
      setNodes(newNodes);
      setNodeIdCounter(nodeIdCounter + 1);
      saveState(newNodes, edges);
      onNodesChange(newNodes);
    },
    [selectedShape, nodes, edges, nodeIdCounter, saveState, onNodesChange, setNodes]
  );

  const handleNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      // Validate label isn't empty
      if (!newLabel || !newLabel.trim()) {
        return;
      }
      
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel.trim() } }
          : node
      ) as FlowNode[];
      
      setNodes(updatedNodes);
      saveState(updatedNodes, edges);
      onNodesChange(updatedNodes);
    },
    [nodes, edges, saveState, onNodesChange, setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (deleteConfirm === nodeId) {
        const updatedNodes = nodes.filter((node) => node.id !== nodeId) as FlowNode[];
        const updatedEdges = edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        );
        
        setNodes(updatedNodes);
        setEdges(updatedEdges);
        saveState(updatedNodes, updatedEdges);
        onNodesChange(updatedNodes);
        onEdgesChange(updatedEdges);
        setDeleteConfirm(null);
      } else {
        setDeleteConfirm(nodeId);
        setTimeout(() => setDeleteConfirm(null), 3000);
      }
    },
    [nodes, edges, deleteConfirm, saveState, onNodesChange, onEdgesChange, setNodes, setEdges]
  );

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      onNodesChange(state.nodes);
      onEdgesChange(state.edges);
    }
  }, [undo, setNodes, setEdges, onNodesChange, onEdgesChange]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      onNodesChange(state.nodes);
      onEdgesChange(state.edges);
    }
  }, [redo, setNodes, setEdges, onNodesChange, onEdgesChange]);

  const handleAutoLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes as FlowNode[], edges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    saveState(layouted.nodes, layouted.edges);
    onNodesChange(layouted.nodes);
  }, [nodes, edges, saveState, onNodesChange, setNodes, setEdges]);

  // Enhance nodes with callback props
  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onLabelChange: handleNodeLabelChange,
      onDelete: handleDeleteNode,
      deleteConfirm: deleteConfirm === node.id,
    },
  }));

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleAutoLayout}
            className="p-2 bg-white rounded shadow hover:bg-gray-100"
            title="Auto Layout"
          >
            <Layout className="w-5 h-5" />
          </button>
        </Panel>
      </ReactFlow>
      {selectedShape && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-squid-pink text-white px-4 py-2 rounded-full shadow-lg">
          Click on canvas to add {selectedShape} shape
        </div>
      )}
    </div>
  );
};

export default VisualEditor;
