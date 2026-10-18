import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Filter, ArrowUpRight, ShieldAlert, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { Incident, IncidentStatus } from '../types/sentinel';

export const IncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getIncidents();
      // Format factors and properties if stringified
      const formatted = data.map((item: any) => ({
        ...item,
        id: String(item.id),
        factors: typeof item.factors === 'string'
          ? [{ factor: item.factors, points: item.riskScore || 20 }]
          : item.factors || [],
      }));
      setIncidents(formatted);
    } catch (err: any) {
      console.error('Failed to load incidents', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: IncidentStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiService.updateIncidentStatus(id, newStatus);
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
      );
      showToast(`Incident #${id} marked as ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Status update failed');
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.endpoint && item.endpoint.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' || (i.riskScore && i.riskScore >= 75)).length;
  const openCount = incidents.filter((i) => i.status === 'OPEN').length;

  const getSeverityBadge = (severity: string, score: number) => {
    if (score >= 75 || severity === 'CRITICAL') {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
    if (score >= 50 || severity === 'HIGH') {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'INVESTIGATING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shadow-2xl animate-fade-slide">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              Threat Forensic Register
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Rule-Triggered Incidents
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white leading-tight">
            Security Incidents
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Correlated intrusion events detected by Sentinel rule evaluation engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchIncidents}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-light hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Incidents</span>
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Total Incidents
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {incidents.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Open Incidents
            </span>
            <span className="text-3xl font-light text-rose-600 dark:text-rose-400 mt-1 block">
              {openCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              High / Critical Threat
            </span>
            <span className="text-3xl font-light text-amber-600 dark:text-amber-400 mt-1 block">
              {criticalCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-light rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title, IP, endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden w-full sm:max-w-xs"
          />

          <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full text-[11px]">
            {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Incident</th>
                <th className="pb-3 px-3">Type & Severity</th>
                <th className="pb-3 px-3">Source & Target</th>
                <th className="pb-3 px-3">Risk Score</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading && incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    Loading incident register from database...
                  </td>
                </tr>
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No incidents recorded. Test demo attacks from the Dashboard or Postman to generate incidents!
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {inc.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        ID: #{inc.id} • {inc.detectionRule}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-mono text-[10px] text-neutral-700 dark:text-neutral-300">
                          {inc.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(inc.severity, inc.riskScore)}`}>
                          {inc.severity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-mono text-[11px]">
                      <div className="text-neutral-900 dark:text-white font-medium">
                        {inc.endpoint || 'N/A'}
                      </div>
                      <div className="text-neutral-500 text-[10px]">
                        IP: {inc.sourceIp}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-base font-light font-mono text-neutral-900 dark:text-white">
                        {inc.riskScore}
                      </span>
                      <span className="text-[10px] text-neutral-400"> / 100</span>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inc.status === 'OPEN' && (
                          <button
                            onClick={(e) => handleStatusUpdate(inc.id, 'INVESTIGATING', e)}
                            className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[10px] font-semibold transition-colors"
                          >
                            Investigate
                          </button>
                        )}
                        {inc.status !== 'RESOLVED' && (
                          <button
                            onClick={(e) => handleStatusUpdate(inc.id, 'RESOLVED', e)}
                            className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] font-semibold transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        {inc.status === 'RESOLVED' && (
                          <button
                            onClick={(e) => handleStatusUpdate(inc.id, 'OPEN', e)}
                            className="px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium"
                          >
                            Re-open
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
