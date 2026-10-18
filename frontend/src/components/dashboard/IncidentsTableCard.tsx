import React, { useState } from 'react';
import { AlertTriangle, Filter, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import { Incident } from '../../types/sentinel';

interface IncidentsTableCardProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onStatusChange: (id: string, status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => void;
}

export const IncidentsTableCard: React.FC<IncidentsTableCardProps> = ({
  incidents,
  onSelectIncident,
  onStatusChange,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CRITICAL' | 'RESOLVED'>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'OPEN') return inc.status === 'OPEN';
    if (filter === 'CRITICAL') return inc.severity === 'CRITICAL';
    if (filter === 'RESOLVED') return inc.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="glass-light p-6 md:p-7 col-span-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
              Security Incident Register & Threat Audit
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Automated incidents spawned from rule engine triggers. Select an incident for explainable factor breakdown.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 p-1 rounded-full self-start sm:self-auto">
          {(['ALL', 'OPEN', 'CRITICAL', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                filter === tab
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Incidents' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-2">Incident ID</th>
              <th className="pb-3">Detection Type</th>
              <th className="pb-3">Target Endpoint</th>
              <th className="pb-3">Source IP</th>
              <th className="pb-3">Risk Score</th>
              <th className="pb-3">Severity</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-sans">
            {filteredIncidents.map((incident) => {
              const isCritical = incident.severity === 'CRITICAL';
              const isHigh = incident.severity === 'HIGH';

              return (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  {/* ID */}
                  <td className="py-3.5 pl-2 font-mono font-bold text-neutral-900 dark:text-white">
                    {incident.id}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="block">{incident.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {incident.type}
                    </span>
                  </td>

                  {/* Endpoint */}
                  <td className="py-3.5 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 mr-1.5 font-bold text-[10px]">
                      {incident.method}
                    </span>
                    {incident.endpoint}
                  </td>

                  {/* Source IP */}
                  <td className="py-3.5 font-mono text-neutral-600 dark:text-neutral-400">
                    {incident.sourceIp}
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                        {incident.riskScore}
                      </span>
                      <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${incident.riskScore}%` }}
                          className="h-full bg-black dark:bg-white rounded-full"
                        />
                      </div>
                    </div>
                  </td>

                  {/* Severity Badge */}
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        isCritical
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : isHigh
                          ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                          : 'bg-black/10 dark:bg-white/15 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </td>

                  {/* Status Dropdown/Pill */}
                  <td className="py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={incident.status}
                      onChange={(e) =>
                        onStatusChange(incident.id, e.target.value as any)
                      }
                      className="bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white text-[11px] font-semibold rounded-full px-2.5 py-1 border border-black/10 dark:border-white/15 focus:outline-hidden cursor-pointer"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="INVESTIGATING">INVESTIGATING</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(incident);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-medium hover:opacity-85 transition-opacity"
                    >
                      <span>Investigate</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <span>Displaying {filteredIncidents.length} active incidents</span>
        <span className="font-mono text-[11px]">
          Demo Postman traffic automatically populates this register
        </span>
      </div>
    </div>
  );
};
