import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { SCHEDULE_ITEMS } from '../../services/mockData';

export const WeeklyScheduleCard: React.FC = () => {
  return (
    <div className="glass-light p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-neutral-900 dark:text-white">
              Security Operations Schedule
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            Current Week
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
          Scheduled engine synchronizations, vulnerability window audits, and test cycles.
        </p>

        {/* Weekly schedule with black pill event tags */}
        <div className="space-y-2.5">
          {SCHEDULE_ITEMS.map((item) => (
            <div
              key={item.day + item.time}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Day circle */}
                <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 flex flex-col items-center justify-center font-mono text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                  <span>{item.day}</span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{item.time} UTC</span>
                  </div>
                </div>
              </div>

              {/* Black pill event tag */}
              <div className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-medium tracking-wide shadow-xs whitespace-nowrap">
                {item.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Auto-Audit Sync: ON</span>
        <span className="font-mono text-[10px]">Next Run: Wed 14:30</span>
      </div>
    </div>
  );
};
