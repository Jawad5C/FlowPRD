import React from 'react';
import { GapAnalysisItem } from '../types';
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';

interface GapAnalysisPanelProps {
  items: GapAnalysisItem[];
  onDismiss: (id: string) => void;
}

const GapAnalysisPanel: React.FC<GapAnalysisPanelProps> = ({ items, onDismiss }) => {
  const activeItems = items.filter(item => !item.dismissed);
  const completionRate = items.length > 0 
    ? Math.round(((items.length - activeItems.length) / items.length) * 100)
    : 100;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Gap Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Completion:</span>
          <span className="text-lg font-bold text-squid-pink">{completionRate}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-squid-pink h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p className="font-medium">All requirements addressed!</p>
          <p className="text-sm">Your PRD is complete.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${getSeverityColor(item.severity)} relative`}
            >
              <button
                onClick={() => onDismiss(item.id)}
                className="absolute top-2 right-2 p-1 hover:bg-white rounded transition-all"
                title="Dismiss"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              
              <div className="flex items-start gap-3">
                {getSeverityIcon(item.severity)}
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800 mb-1">
                    {item.category}
                  </div>
                  <p className="text-sm text-gray-700">{item.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GapAnalysisPanel;
