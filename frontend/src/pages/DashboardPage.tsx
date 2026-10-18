import React, { useState, useEffect } from 'react';
import { RefreshCw, Terminal, CheckCircle2, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';
import { HeroThreatShieldCard } from '../components/dashboard/HeroThreatShieldCard';
import { RiskAreaChartCard } from '../components/dashboard/RiskAreaChartCard';
import { AttackVectorCard } from '../components/dashboard/AttackVectorCard';
import { RuleSettingsCard } from '../components/dashboard/RuleSettingsCard';
import { IncidentsTableCard } from '../components/dashboard/IncidentsTableCard';
import { IncidentDetailModal } from '../components/dashboard/IncidentDetailModal';
import { PostmanQuickTestModal } from '../components/dashboard/PostmanQuickTestModal';
import { apiService } from '../services/api';
import { Incident } from '../types/sentinel';

export const DashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isPostmanModalOpen, setIsPostmanModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalEvents: number;
    totalIncidents: number;
    openIncidents: number;
    criticalIncidents: number;
    highIncidents: number;
  }>({
    totalEvents: 0,
    totalIncidents: 0,
    openIncidents: 0,
    criticalIncidents: 0,
    highIncidents: 0,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDashboardData = async () => {
    try {
      const [sum, incs] = await Promise.all([
        apiService.getDashboardSummary().catch(() => null),
        apiService.getIncidents().catch(() => []),
      ]);

      if (sum) {
        setSummary(sum);
      }

      const formattedIncidents: Incident[] = (incs || []).map((item: any) => ({
        ...item,
        id: String(item.id),
        factors: typeof item.factors === 'string'
          ? [{ factor: item.factors, points: item.riskScore || 20 }]
          : item.factors || [],
      }));

      setIncidents(formattedIncidents);
    } catch (err) {
      console.error('Error fetching dashboard telemetry', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => {
    try {
      await apiService.updateIncidentStatus(id, newStatus);
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
      );
      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`Incident #${id} updated to ${newStatus}`);
      await loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Status update failed');
    }
  };

  const handleSimulateAttack = async (type: 'BRUTE_FORCE' | 'SQL_INJECTION' | 'API_ABUSE') => {
    showToast(`Injecting test traffic to backend: ${type}`);
    try {
      if (type === 'BRUTE_FORCE') {
        for (let i = 0; i < 6; i++) {
          await apiService.simulateDemoLogin({ username: 'admin', password: 'bad_pwd_' + i }).catch(() => {});
        }
      } else if (type === 'SQL_INJECTION') {
        await apiService.simulateProductsRequest("' OR '1'='1").catch(() => {});
      } else if (type === 'API_ABUSE') {
        for (let i = 0; i < 15; i++) {
          await apiService.simulateOrdersRequest().catch(() => {});
        }
      }
      setTimeout(loadDashboardData, 1200);
    } catch (err) {
      // Backend evaluated
    }
    setIsPostmanModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shadow-2xl animate-fade-slide">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              API Sentinel Platform
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Rule-Based Security Interception
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-neutral-900 dark:text-white leading-tight">
            API Sentinel
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Rule-Based API Intrusion Detection and Security Monitoring System. Intercepts HTTP traffic, analyzes patterns against deterministic signatures, and registers explainable incident risk.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsPostmanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-medium shadow-md hover:opacity-85 transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulate Attacks</span>
          </button>

          <button
            onClick={() => {
              loadDashboardData();
              showToast('Refreshed real-time telemetry');
            }}
            className="p-2.5 rounded-full glass-light hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Live KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Monitored Requests
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {summary.totalEvents}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">Recorded in database</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-dark p-5 rounded-2xl flex items-center justify-between text-white">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block">
              Total Incidents
            </span>
            <span className="text-3xl font-light text-white mt-1 block">
              {summary.totalIncidents}
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5 block">Spawned from rules</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Open Incidents
            </span>
            <span className="text-3xl font-light text-rose-600 dark:text-rose-400 mt-1 block">
              {summary.openIncidents}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block">Awaiting analyst triage</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-dark p-5 rounded-2xl flex items-center justify-between text-white">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block">
              High / Critical Threat
            </span>
            <span className="text-3xl font-light text-amber-400 mt-1 block">
              {summary.criticalIncidents + summary.highIncidents}
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5 block">Priority mitigation</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Clean Functional Components Connected to Real Rules and Data */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tall Hero Card */}
        <HeroThreatShieldCard
          onInvestigateClick={() => incidents[0] && setSelectedIncident(incidents[0])}
          totalEvents={summary.totalEvents}
          totalIncidents={summary.totalIncidents}
          openIncidents={summary.openIncidents}
          criticalAndHigh={summary.criticalIncidents + summary.highIncidents}
          sqliCount={incidents.filter((i) => i.type === 'SQL_INJECTION_PATTERN').length}
        />

        {/* 2. Attack Vector Progress Bars */}
        <AttackVectorCard incidents={incidents} />

        {/* 3. Black Gradient Area Chart */}
        <RiskAreaChartCard incidents={incidents} />

        {/* 4. Rule Settings with Real Hot Reload */}
        <RuleSettingsCard />

        {/* 5. Incidents Table */}
        <IncidentsTableCard
          incidents={incidents}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Modals */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onStatusChange={handleStatusChange}
      />

      <PostmanQuickTestModal
        isOpen={isPostmanModalOpen}
        onClose={() => setIsPostmanModalOpen(false)}
        onSimulateAttack={handleSimulateAttack}
      />
    </div>
  );
};

export default DashboardPage;
