import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, Filter, RefreshCw, ShieldAlert, CheckCircle2, Clock, Search, Zap } from 'lucide-react';
import { apiService } from '../services/api';
import { ApiTrafficEvent } from '../types/sentinel';

export const TrafficPage: React.FC = () => {
  const [events, setEvents] = useState<ApiTrafficEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'FLAGGED' | 'NORMAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(50);

  const fetchEvents = async (isManual = false) => {
    if (isManual) {
      setIsPolling(true);
    }
    try {
      const data = await apiService.getTrafficEvents(150);
      const sorted = (data || []).sort((a: any, b: any) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return Number(b.id || 0) - Number(a.id || 0);
      });
      setEvents(sorted);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setIsLoading(false);
      if (isManual) {
        setIsPolling(false);
      }
    }
  };

  useEffect(() => {
    fetchEvents(false);
    const interval = setInterval(() => fetchEvents(false), 2500);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesMethod = methodFilter === 'ALL' || ev.method?.toUpperCase() === methodFilter;
    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'FLAGGED' && ev.riskFlag) ||
      (riskFilter === 'NORMAL' && !ev.riskFlag);
    const matchesSearch =
      !searchQuery ||
      ev.endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.sourceIp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.riskType && ev.riskType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMethod && matchesRisk && matchesSearch;
  });

  const displayedEvents = filteredEvents.slice(0, pageSize);

  const flaggedCount = events.filter((e) => e.riskFlag).length;
  const normalCount = events.length - flaggedCount;

  const getMethodBadgeClass = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20';
    }
  };

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-600 dark:text-emerald-400';
    if (status >= 400 && status < 500) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const formatTime = (ts: string) => {
    if (!ts) return '—';
    try {
      const d = new Date(ts);
      return isNaN(d.getTime()) ? ts : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return ts;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 pt-6 px-4 sm:px-6 lg:px-8 animate-fade-slide">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              Live Ingestion Pipeline
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Spring Boot Interceptor Feed (Newest First)
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white leading-tight">
            API Traffic Log
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light mt-1 max-w-2xl leading-relaxed">
            Real-time telemetry stream recorded from incoming HTTP requests to Sentinel API and Demo endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchEvents(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-light hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin' : ''}`} />
            <span>Poll Stream</span>
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Captured Requests
            </span>
            <span className="text-3xl font-light text-neutral-900 dark:text-white mt-1 block">
              {events.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Intrusion-Flagged
            </span>
            <span className="text-3xl font-light text-rose-600 dark:text-rose-400 mt-1 block">
              {flaggedCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-light p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Normal Traffic
            </span>
            <span className="text-3xl font-light text-emerald-600 dark:text-emerald-400 mt-1 block">
              {normalCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="glass-light rounded-3xl p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoint, IP, or detection type..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] uppercase font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
                Filters:
              </span>
            </div>

            {/* Method Filter */}
            <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full text-[11px]">
              {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethodFilter(m)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    methodFilter === m
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Risk Filter */}
            <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full text-[11px]">
              {(['ALL', 'FLAGGED', 'NORMAL'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    riskFilter === r
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Limit Selector */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Items per page"
              className="bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 px-2.5 py-1 rounded-full text-[11px] text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
              <option value={100}>Show 100</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Method</th>
                <th className="pb-3 px-3">Endpoint</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Latency</th>
                <th className="pb-3 px-3">Source IP</th>
                <th className="pb-3 px-3">Detection Flag</th>
                <th className="pb-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading && events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Fetching real-time API events from PostgreSQL...
                  </td>
                </tr>
              ) : displayedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No matching requests found. Send requests to /api/demo/products, /api/demo/login or other endpoints to see them live.
                  </td>
                </tr>
              ) : (
                displayedEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadgeClass(ev.method)}`}>
                        {ev.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-neutral-900 dark:text-white max-w-xs truncate">
                      {ev.endpoint}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={getStatusBadgeClass(ev.statusCode)}>
                        {ev.statusCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Zap className="w-3 h-3 text-neutral-400" />
                        {ev.responseTime != null ? `${ev.responseTime} ms` : '15 ms'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                      {ev.sourceIp}
                    </td>
                    <td className="py-3 px-3">
                      {ev.riskFlag ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {ev.riskType || 'SUSPICIOUS'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-neutral-400 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 dark:bg-emerald-400/60" />
                          Clean
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {formatTime(ev.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {filteredEvents.length > pageSize && (
          <div className="pt-4 text-center text-xs text-neutral-500">
            Showing latest {pageSize} of {filteredEvents.length} filtered requests. Increase page size above to view more.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficPage;
