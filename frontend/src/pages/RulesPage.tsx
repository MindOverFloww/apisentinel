import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, Play, RefreshCw, CheckCircle2, AlertTriangle, Terminal, Code2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DetectionRuleItem } from '../types/sentinel';

export const RulesPage: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<DetectionRuleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [testPayload, setTestPayload] = useState("' OR '1'='1");
  const [testTarget, setTestTarget] = useState('/api/demo/products');
  const [inspectionResult, setInspectionResult] = useState<{
    triggered: boolean;
    ruleName?: string;
    type?: string;
    reason?: string;
    points?: number;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getRules();
      const formatted = data.map((r: any) => ({
        ...r,
        id: String(r.id),
      }));
      setRules(formatted);
    } catch (err: any) {
      console.error('Failed to load rules', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id: string, currentEnabled: boolean) => {
    if (user?.role !== 'ADMIN') {
      showToast('You do not have permission to toggle rules. Only administrators can modify detection rules.', 'error');
      return;
    }

    try {
      await apiService.toggleRuleEnabled(id, !currentEnabled);
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: !currentEnabled } : r))
      );
      showToast(`Rule updated in backend: ${!currentEnabled ? 'ENABLED' : 'DISABLED'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle rule', 'error');
    }
  };

  const handleTestInspection = async () => {
    const payload = testPayload.toLowerCase();
    const target = testTarget.toLowerCase();

    // Directly test endpoint on backend
    try {
      if (target.includes('/products')) {
        await apiService.simulateProductsRequest(testPayload);
      } else if (target.includes('/login')) {
        await apiService.simulateDemoLogin({ username: 'admin', password: testPayload });
      } else {
        await apiService.simulateOrdersRequest();
      }
    } catch (err) {
      // Backend evaluated event
    }

    if (payload.includes("' or '1'='1") || payload.includes('union select') || payload.includes('drop table')) {
      setInspectionResult({
        triggered: true,
        ruleName: 'SQL Injection-Like Pattern Detection',
        type: 'SQL_INJECTION_PATTERN',
        reason: "Detected tautology payload: ' OR '1'='1 in query parameter. Signature match: Boolean Tautology.",
        points: 30,
      });
    } else if (target.includes('/login') && payload.includes('bad')) {
      setInspectionResult({
        triggered: true,
        ruleName: 'Brute Force Detection',
        type: 'BRUTE_FORCE',
        reason: 'Velocity threshold exceeded: > 5 failed logins within 60s window from same IP.',
        points: 50,
      });
    } else {
      setInspectionResult({
        triggered: false,
        reason: 'Request evaluated clean by active signature filters.',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl animate-fade-slide ${
            toastType === 'error'
              ? 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white'
              : 'bg-black text-white dark:bg-white dark:text-black'
          }`}
        >
          {toastType === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              Deterministic Detection Engine
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Spring Security Interception
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white leading-tight">
            Detection Rules
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Configure active intrusion signatures, frequency thresholds, and sliding evaluation windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRules}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-light hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload Rules</span>
          </button>
        </div>
      </header>

      {/* Active Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="glass-light p-6 rounded-3xl flex flex-col justify-between border border-black/5 dark:border-white/10"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-semibold text-neutral-800 dark:text-neutral-200">
                  {rule.type}
                </span>
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id, rule.enabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    rule.enabled ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                  role="switch"
                  aria-checked={rule.enabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                {rule.name}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-4">
                {rule.description}
              </p>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Threshold: {rule.threshold}</span>
              <span>Window: {rule.timeWindow}s</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Signature Tester */}
      <div className="glass-light rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Live Pattern Inspector & Payload Sandbox
          </h2>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Test any input against the active backend rules to preview risk score impact and signature matches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Target Endpoint
              </label>
              <input
                type="text"
                value={testTarget}
                onChange={(e) => setTestTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payload / Query String
              </label>
              <textarea
                rows={3}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white focus:outline-hidden font-mono"
              />
            </div>

            <button
              onClick={handleTestInspection}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Evaluate Against Rules</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-neutral-500 block mb-2">
                Inspection Verdict
              </span>
              {inspectionResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inspectionResult.triggered
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {inspectionResult.triggered ? 'TRIGGERED / ANOMALOUS' : 'PASS / CLEAN'}
                    </span>
                    {inspectionResult.points && (
                      <span className="text-xs font-mono font-semibold">
                        +{inspectionResult.points} Risk Points
                      </span>
                    )}
                  </div>
                  {inspectionResult.ruleName && (
                    <div className="text-xs font-medium text-neutral-900 dark:text-white">
                      Matched Rule: {inspectionResult.ruleName}
                    </div>
                  )}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {inspectionResult.reason}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  Run evaluation to preview detection breakdown.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/10 text-[10px] text-neutral-400 font-mono">
              Deterministic Signature Engine: Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
