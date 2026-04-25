import React from 'react';
import { Bot, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

interface AiInsightsProps {
  isAnalyzing: boolean;
  onAnalyze: () => void;
  result: {
    analysis: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  } | null;
}

const AiInsights: React.FC<AiInsightsProps> = ({ isAnalyzing, onAnalyze, result }) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-indigo-950/40 p-5 backdrop-blur-md relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/15 p-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">AI Telemetry Snapshot</h2>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Experimental summary layer for the latest sensor snapshot.
            </p>
          </div>
        </div>
        
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isAnalyzing 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              Generate Summary
            </>
          )}
        </button>
      </div>

      {result ? (
        <div className="space-y-4 animate-fadeIn relative z-10">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3">
            <span className="text-sm text-slate-400">Assessment:</span>
            {result.riskLevel === 'HIGH' && <span className="flex items-center gap-1 text-red-400 font-bold"><AlertTriangle className="w-4 h-4" /> Critical</span>}
            {result.riskLevel === 'MEDIUM' && <span className="flex items-center gap-1 text-amber-400 font-bold"><AlertTriangle className="w-4 h-4" /> Warning</span>}
            {result.riskLevel === 'LOW' && <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle className="w-4 h-4" /> Stable</span>}
          </div>

          <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-indigo-500/50 pl-3">
            {result.analysis}
          </p>

          {result.recommendations.length > 0 && (
            <div className="rounded-2xl bg-slate-950/50 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Suggested Actions</h4>
              <ul className="space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-slate-500 text-sm relative z-10">
          Generate an optional AI summary from the current telemetry snapshot.
        </div>
      )}
    </div>
  );
};

export default AiInsights;
