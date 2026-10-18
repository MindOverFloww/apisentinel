import React from 'react';
import { X, ShieldAlert, CheckCircle2, Clock, Terminal, ArrowRight } from 'lucide-react';
import { Incident } from '../../types/sentinel';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onStatusChange: (id: string, status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onStatusChange,
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-slide">
      <div className="glass-light dark:glass-dark max-w-2xl w-full p-6 md:p-8 rounded-[28px] border border-white/60 dark:border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-neutral-800 dark:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black">
            {incident.id}
          </span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/15 text-neutral-900 dark:text-neutral-100 uppercase">
            {incident.severity} SEVERITY
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          {incident.title}
        </h2>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
          {incident.description}
        </p>

        {/* Explainable Risk Scoring Engine Breakdown */}
        <div className="mb-6 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Explainable Risk Scoring Breakdown
              </h4>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Score:</span>
              <span className="font-mono text-lg font-bold text-neutral-900 dark:text-white">
                {incident.riskScore}/100
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {incident.factors.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5"
              >
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {item.factor}
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  +{item.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Detection Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
              Triggering Detection Rule
            </span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
              {incident.detectionRule}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
              Source Origin
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white block">
              {incident.sourceIp} ({incident.endpoint})
            </span>
          </div>
        </div>

        {/* Sample Payload */}
        {incident.samplePayload && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Captured Traffic Snippet / Parameter Signature</span>
            </div>
            <pre className="p-3 rounded-2xl bg-black/90 text-white font-mono text-[11px] overflow-x-auto border border-white/10">
              {incident.samplePayload}
            </pre>
          </div>
        )}

        {/* Status Transition Lifecycle */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
              Current Lifecycle State:
            </span>
            <span className="font-bold text-xs font-mono text-neutral-900 dark:text-white">
              {incident.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(['OPEN', 'INVESTIGATING', 'RESOLVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange(incident.id, st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  incident.status === st
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-black/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
