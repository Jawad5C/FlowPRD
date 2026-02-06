import React from 'react';
import { ConventionViolation } from '../types';
import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface ValidationPanelProps {
  conventionScore: number;
  violations: ConventionViolation[];
  aiReadiness: boolean;
  onAutoFix?: (nodeId: string, suggestedShape: string) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  conventionScore,
  violations,
  aiReadiness,
  onAutoFix,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Convention Validation</h3>

      {/* Convention Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">UML Convention Compliance</span>
          <span className={`text-2xl font-bold ${getScoreColor(conventionScore)}`}>
            {conventionScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getScoreBgColor(conventionScore)}`}
            style={{ width: `${conventionScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {conventionScore >= 90 && 'Excellent! Your PRD follows UML conventions.'}
          {conventionScore >= 70 && conventionScore < 90 && 'Good, but some improvements recommended.'}
          {conventionScore < 70 && 'Several violations detected. Review suggestions below.'}
        </p>
      </div>

      {/* AI Readiness */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-squid-light-teal to-squid-light-pink border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className={`w-6 h-6 ${aiReadiness ? 'text-green-500' : 'text-yellow-500'}`} />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">AI Readiness</div>
            <p className="text-sm text-gray-600">
              {aiReadiness 
                ? 'Ready for AI consumption - structure is parseable'
                : 'May have parsing issues - fix violations for better AI compatibility'
              }
            </p>
          </div>
          {aiReadiness ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          )}
        </div>
      </div>

      {/* Violations */}
      {violations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p className="font-medium">Perfect compliance!</p>
          <p className="text-sm">All shapes follow UML conventions.</p>
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Convention Violations ({violations.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {violations.map((violation, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-yellow-200 bg-yellow-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800 mb-1">
                      {violation.nodeName}
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{violation.reason}</p>
                    <div className="text-xs text-gray-600">
                      Current: <span className="font-semibold">{violation.currentShape}</span>
                      {' → '}
                      Suggested: <span className="font-semibold text-green-600">{violation.suggestedShape}</span>
                    </div>
                  </div>
                  {onAutoFix && (
                    <button
                      onClick={() => onAutoFix(violation.nodeId, violation.suggestedShape)}
                      className="px-3 py-1 bg-squid-pink text-white text-xs rounded hover:bg-opacity-90 transition-all"
                    >
                      Auto-fix
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
