import { useState, useCallback } from 'react';
import { FlowNode } from '../types';
import { Edge } from 'reactflow';

interface HistoryState {
  nodes: FlowNode[];
  edges: Edge[];
}

const MAX_HISTORY = 20;

export const useUndoRedo = (initialNodes: FlowNode[], initialEdges: Edge[]) => {
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const saveState = useCallback((nodes: FlowNode[], edges: Edge[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes, edges });
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        setCurrentIndex(MAX_HISTORY - 1);
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0 && history.length > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex] || null;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1 && history.length > 0) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex] || null;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { saveState, undo, redo, canUndo, canRedo };
};
