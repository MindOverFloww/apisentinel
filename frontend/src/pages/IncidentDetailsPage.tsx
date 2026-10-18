import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { RiskGauge } from '../components/RiskGauge';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusPill } from '../components/StatusPill';
import { MOCK_INCIDENTS } from '../utils/mockData';
import { IncidentStatus } from '../types';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Clock,
  Globe2,
  Server,
  FileText,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Send,
} from 'lucide-react';

export const IncidentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find incident or fallback to first
  const incident =
    MOCK_INCIDENTS.find((i) => i.id === id) || MOCK_INCIDENTS[0];

  const [currentStatus, setCurrentStatus] = useState<IncidentStatus>(incident.status);
  const [ipBlocked, setIpBlocked] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[]>(incident.notes);
  const [newNote, setNewNote] = useState<string>('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([`Analyst note: ${newNote.trim()}`, ...notes]);
    setNewNote('');
  };

  const handleToggleBlock = () => {
    setIpBlocked(!ipBlocked);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incidents</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500">{incident.id}</span>
          <SeverityBadge severity={incident.severity} />
          <StatusPill status={currentStatus} />
        </div>
      </div>

      {/* Page Title & Incident Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
          Forensic Incident Investigation
        </span>
        <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight text-zinc-950 mt-1">
          {incident.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 mt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            Window: {incident.timeWindow}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-zinc-500" />
            Source: <strong className="font-mono text-zinc-900">{incident.sourceIp}</strong> ({incident.location})
          </span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TALL HERO CARD (Dark Smoked Glass) - Col 1 to 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard variant="smoked" className="flex flex-col justify-between space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                Composite Risk Gauge
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                {incident.detectionSource} DETECTION
              </span>
            </div>

            {/* Circular Donut Gauge */}
            <div className="py-2">
              <RiskGauge score={incident.riskScore} size={150} strokeWidth={11} variant="smoked" />
            </div>

            {/* Attack Target Specs */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Target Endpoint</span>
                <span className="font-mono font-medium text-white px-2 py-0.5 rounded bg-white/10">
                  {incident.httpMethod} {incident.targetEndpoint}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Attacker Source IP</span>
                <span className="font-mono text-zinc-200">{incident.sourceIp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Request Velocity</span>
                <span className="font-mono text-white">
                  {incident.requestCount} requests ({incident.failedCount} failures)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Failure Ratio</span>
                <span className="font-mono text-white">
                  {((incident.failedCount / incident.requestCount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Recommended Remediation Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                Remediation Actions
              </div>
              <button
                onClick={handleToggleBlock}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  ipBlocked
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-600'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {ipBlocked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>IP Blocked at Gateway (Active)</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>Block Source IP in Gateway</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 italic text-center pt-1">
                {incident.recommendedAction}
              </p>
            </div>
          </GlassCard>

          {/* TRIAGE STATUS WORKFLOW DOCK (Dark Smoked Glass) */}
          <GlassCard variant="smoked" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                Triage Status Control
              </span>
              <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Status Switcher Pills */}
            <div className="grid grid-cols-2 gap-2">
              {(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'] as IncidentStatus[]).map(
                (status) => {
                  const active = currentStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setCurrentStatus(status)}
                      className={`py-2 px-3 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 ${
                        active
                          ? 'bg-white text-zinc-950 shadow-md scale-[1.02]'
                          : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  );
                }
              )}
            </div>

            {/* Analyst Investigation Notes */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Analyst Investigation Notes
              </span>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Append triage finding..."
                  className="flex-1 px-3 py-1.5 rounded-full text-xs bg-white/10 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-zinc-300 p-2.5 rounded-xl bg-white/5 border border-white/5 leading-relaxed"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* EVIDENCE AND LOGS PANELS (Light Frosted Glass) - Col 6 to 12 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* DUAL ENGINE FORENSIC EVIDENCE */}
          <GlassCard variant="light" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500">
                  Dual-Engine Detection Breakdown
                </span>
                <h3 className="text-xl font-semibold text-zinc-950 mt-0.5">
                  Detection Analysis
                </h3>
              </div>
              <Cpu className="w-5 h-5 text-zinc-800" />
            </div>

            {/* RULE ENGINE SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Rule-Based Engine Findings (Deterministic)
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 text-zinc-700">
                  MATCH: CONFIRMED
                </span>
              </div>

              <div className="space-y-2 pl-4">
                {incident.ruleFindings.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-800 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ML ANOMALY SECTION */}
            <div className="space-y-3 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Unsupervised ML Anomaly Service (Behavioral)
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black text-white">
                  SCORE: {incident.mlScore} / 1.0
                </span>
              </div>

              {/* Horizontal Progress Bars with Labeled Percentages */}
              <div className="space-y-3 pl-4 pt-1">
                {incident.mlInsights.map((insight, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-800">{insight.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">Baseline: {insight.baseline}</span>
                        <span className="font-mono font-semibold text-zinc-950">Observed: {insight.observed}</span>
                        <span className="font-mono font-bold text-zinc-900 px-1.5 py-0.2 rounded bg-black/5">
                          {insight.deviation}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(95, 20 + idx * 25)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RISK SYNTHESIS NOTE */}
            <div className="p-3.5 rounded-2xl bg-black/5 border border-black/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-700 leading-relaxed">
                <strong>Composite Risk Engine Synthesis:</strong> Rule trigger weight (0.80) correlated with ML Anomaly outlier index (0.93) and rapid 401 status clustering generated the unified Risk Score of <strong>{incident.riskScore} (CRITICAL)</strong>.
              </div>
            </div>
          </GlassCard>

          {/* FORENSIC REQUEST PAYLOAD STREAM */}
          <GlassCard variant="light" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/5">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500">
                  Forensic Ingestion Audit
                </span>
                <h3 className="text-base font-semibold text-zinc-950 mt-0.5">
                  Captured Request Stream
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                {incident.recentLogs.length} Samples Cached
              </span>
            </div>

            {incident.recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No active raw frames recorded for this timeframe.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-black/10 text-zinc-500 text-[10px] uppercase">
                      <th className="pb-2 font-semibold">Timestamp</th>
                      <th className="pb-2 font-semibold">Method</th>
                      <th className="pb-2 font-semibold">Endpoint</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Latency</th>
                      <th className="pb-2 font-semibold text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-zinc-800">
                    {incident.recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-2.5 text-zinc-500">{log.timestamp}</td>
                        <td className="py-2.5 font-bold text-zinc-950">{log.method}</td>
                        <td className="py-2.5 max-w-[180px] truncate text-zinc-900" title={log.endpoint}>
                          {log.endpoint}
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.statusCode >= 400 ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-800'
                          }`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="py-2.5 text-zinc-600">{log.latencyMs}ms</td>
                        <td className="py-2.5 text-right font-bold text-zinc-950">{log.riskScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;
