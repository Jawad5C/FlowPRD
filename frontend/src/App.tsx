import { useState, useCallback, useEffect } from 'react';
import { Edge } from 'reactflow';
import ShapePalette from './components/ShapePalette';
import VisualEditor from './components/VisualEditor';
import InputPanel from './components/InputPanel';
import ExportPanel from './components/ExportPanel';
import GapAnalysisPanel from './components/GapAnalysisPanel';
import ValidationPanel from './components/ValidationPanel';
import { FlowNode, ShapeType, GapAnalysisItem, ConventionViolation } from './types/index';
import { generateMermaidCode } from './utils/export';
import { API_ENDPOINTS, apiCall } from './utils/api';
import { FileText } from 'lucide-react';

function App() {
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mermaidCode, setMermaidCode] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisItem[]>([]);
  const [violations, setViolations] = useState<ConventionViolation[]>([]);
  const [conventionScore, setConventionScore] = useState(100);
  const [aiReadiness, setAiReadiness] = useState(true);

  // Update Mermaid code when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0) {
      const code = generateMermaidCode(nodes, edges);
      setMermaidCode(code);
      
      // Mock validation (in real app, this would call backend)
      validatePRD(nodes);
    } else {
      setMermaidCode('');
      setGapAnalysis([]);
      setViolations([]);
      setConventionScore(100);
      setAiReadiness(true);
    }
  }, [nodes, edges]);

  const validatePRD = useCallback((currentNodes: FlowNode[]) => {
    // Mock gap analysis
    const gaps: GapAnalysisItem[] = [];
    
    const hasUsers = currentNodes.some(n => n.data.shapeType === 'stadium');
    const hasFeatures = currentNodes.some(n => n.data.shapeType === 'rectangle');
    const hasConstraints = currentNodes.some(n => n.data.shapeType === 'hexagon');
    const hasDatabase = currentNodes.some(n => n.data.shapeType === 'cylinder');
    
    if (!hasUsers) {
      gaps.push({
        id: 'gap-users',
        category: 'Users & Actors',
        message: 'No user personas or actors defined. Add stadium shapes to define who will use this product.',
        severity: 'high',
        dismissed: false,
      });
    }
    
    if (!hasFeatures) {
      gaps.push({
        id: 'gap-features',
        category: 'Core Features',
        message: 'No core features or processes defined. Add rectangles to describe main functionality.',
        severity: 'high',
        dismissed: false,
      });
    }
    
    if (!hasConstraints) {
      gaps.push({
        id: 'gap-constraints',
        category: 'Constraints & Rules',
        message: 'No constraints or limitations documented. Add hexagons for important system constraints.',
        severity: 'medium',
        dismissed: false,
      });
    }
    
    if (!hasDatabase) {
      gaps.push({
        id: 'gap-database',
        category: 'Data Storage',
        message: 'No database or storage layer defined. Add cylinders if data persistence is needed.',
        severity: 'medium',
        dismissed: false,
      });
    }
    
    setGapAnalysis(gaps);
    
    // Mock convention validation
    const mockViolations: ConventionViolation[] = [];
    currentNodes.forEach(node => {
      const label = node.data.label.toLowerCase();
      
      // Check if "database" or "storage" should be cylinder
      if ((label.includes('database') || label.includes('storage') || label.includes('db')) 
          && node.data.shapeType !== 'cylinder') {
        mockViolations.push({
          nodeId: node.id,
          nodeName: node.data.label,
          currentShape: node.data.shapeType,
          suggestedShape: 'cylinder',
          reason: 'Databases and storage should use cylinder shapes',
        });
      }
      
      // Check if "user" or "actor" should be stadium
      if ((label.includes('user') || label.includes('actor') || label.includes('person')) 
          && node.data.shapeType !== 'stadium') {
        mockViolations.push({
          nodeId: node.id,
          nodeName: node.data.label,
          currentShape: node.data.shapeType,
          suggestedShape: 'stadium',
          reason: 'Users and actors should use stadium/oval shapes',
        });
      }
      
      // Check if "requirement" or "FR" should be parallelogram
      if ((label.includes('requirement') || label.includes('fr-') || label.includes('req-')) 
          && node.data.shapeType !== 'parallelogram') {
        mockViolations.push({
          nodeId: node.id,
          nodeName: node.data.label,
          currentShape: node.data.shapeType,
          suggestedShape: 'parallelogram',
          reason: 'Functional requirements should use parallelogram shapes',
        });
      }
    });
    
    setViolations(mockViolations);
    
    const score = currentNodes.length > 0 
      ? Math.round(((currentNodes.length - mockViolations.length) / currentNodes.length) * 100)
      : 100;
    setConventionScore(score);
    setAiReadiness(score >= 80);
  }, []);

  const handleShapeSelect = useCallback((shapeType: ShapeType) => {
    setSelectedShape(shapeType);
  }, []);

  const handleNodesChange = useCallback((newNodes: FlowNode[]) => {
    setNodes(newNodes);
  }, []);

  const handleEdgesChange = useCallback((newEdges: Edge[]) => {
    setEdges(newEdges);
  }, []);

  const handleTextSubmit = async (text: string) => {
    try {
      // Try to call backend API
      const data = await apiCall(API_ENDPOINTS.GENERATE, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      
      if (data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
        return;
      }
    } catch (error) {
      console.warn('API not available, using mock data:', error);
    }
    
    // Fallback to mock data if API not available
    const sampleNodes: FlowNode[] = [
      {
        id: 'node-0',
        type: 'custom',
        position: { x: 250, y: 0 },
        data: {
          label: 'User',
          shapeType: 'stadium',
          color: '#ED1B76',
        },
      },
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 250, y: 100 },
        data: {
          label: 'Create Visual PRD',
          shapeType: 'rectangle',
          color: '#067D72',
        },
      },
      {
        id: 'node-2',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'PostgreSQL Database',
          shapeType: 'cylinder',
          color: '#FFE4EC',
        },
      },
    ];
    
    const sampleEdges: Edge[] = [
      { id: 'edge-0', source: 'node-0', target: 'node-1', type: 'smoothstep' },
      { id: 'edge-1', source: 'node-1', target: 'node-2', type: 'smoothstep' },
    ];
    
    setNodes(sampleNodes);
    setEdges(sampleEdges);
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Try to call backend API
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          return;
        }
      }
    } catch (error) {
      console.warn('API not available, using fallback:', error);
    }
    
    // Fallback: read file and use text submission
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await handleTextSubmit(content);
    };
    reader.readAsText(file);
  };

  const handleDismissGap = (id: string) => {
    setGapAnalysis(prev => 
      prev.map(item => 
        item.id === id ? { ...item, dismissed: true } : item
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-squid-navy text-white py-4 px-6 shadow-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-squid-pink" />
          <div>
            <h1 className="text-2xl font-bold">FlowPRD</h1>
            <p className="text-sm text-gray-300">Visual PRD Generator with AI-Powered Flowchart Creation</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <InputPanel onTextSubmit={handleTextSubmit} onFileUpload={handleFileUpload} />
          <div className="p-4 space-y-4">
            <GapAnalysisPanel items={gapAnalysis} onDismiss={handleDismissGap} />
            <ValidationPanel
              conventionScore={conventionScore}
              violations={violations}
              aiReadiness={aiReadiness}
            />
          </div>
        </div>

        {/* Center - Visual Editor */}
        <div className="flex-1 flex flex-col">
          <ShapePalette onShapeSelect={handleShapeSelect} selectedShape={selectedShape} />
          <div className="flex-1" id="react-flow-canvas">
            <VisualEditor
              selectedShape={selectedShape}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              initialNodes={nodes}
              initialEdges={edges}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <ExportPanel mermaidCode={mermaidCode} nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
}

export default App;
