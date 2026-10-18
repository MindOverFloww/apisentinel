import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Incident } from '../../types/sentinel';

interface AttackVectorCardProps {
  incidents?: Incident[];
}

export const AttackVectorCard: React.FC<AttackVectorCardProps> = ({ incidents = [] }) => {
  const total = incidents.length;

  const sqliCount = incidents.filter((i) => i.type === 'SQL_INJECTION_PATTERN').length;
  const bruteCount = incidents.filter((i) => i.type === 'BRUTE_FORCE').length;
  const abuseCount = incidents.filter((i) => i.type === 'API_ABUSE').length;

  const vectors = [
    {
      name: 'SQL Injection-Like Pattern',
      rule: 'SQL_INJECTION_PATTERN',
      percentage: total > 0 ? Math.round((sqliCount / total) * 100) : 0,
      count: `${sqliCount} incident${sqliCount === 1 ? '' : 's'}`,
      signature: "' OR '1'='1 | UNION SELECT",
    },
    {
      name: 'Brute-Force Authentication',
      rule: 'BRUTE_FORCE',
      percentage: total > 0 ? Math.round((bruteCount / total) * 100) : 0,
      count: `${bruteCount} incident${bruteCount === 1 ? '' : 's'}`,
      signature: '> 5 failed logins / 60s',
    },
    {
      name: 'API Abuse / Rate Flooding',
      rule: 'API_ABUSE',
      percentage: total > 0 ? Math.round((abuseCount / total) * 100) : 0,
      count: `${abuseCount} incident${abuseCount === 1 ? '' : 's'}`,
      signature: '> 100 requests / 60s',
    },
  ];

  return (
    <div className="glass-light p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-neutral-900 dark:text-white">
              Detected Threat Vectors
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            Total {total} Flagged
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-5">
          Distribution of security rule triggers captured across monitored endpoints.
        </p>

        {/* Horizontal progress bars with labeled percentages */}
        <div className="space-y-4">
          {vectors.map((vector) => (
            <div key={vector.rule} className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white block">
                    {vector.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    {vector.signature}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">
                    {vector.percentage}%
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono">
                    {vector.count}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  style={{ width: `${vector.percentage}%` }}
                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-700 ease-out"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Evaluation Window: Continuous</span>
        <span className="font-medium text-neutral-800 dark:text-neutral-200">Rule-Based Detection Only</span>
      </div>
    </div>
  );
};
