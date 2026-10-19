import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Play, Globe, Laptop, Cloud } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface PostmanQuickTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateAttack: (type: 'BRUTE_FORCE' | 'SQL_INJECTION' | 'API_ABUSE') => void;
}

export const PostmanQuickTestModal: React.FC<PostmanQuickTestModalProps> = ({
  isOpen,
  onClose,
  onSimulateAttack,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [targetPreset, setTargetPreset] = useState<'vercel' | 'connected' | 'localhost'>('vercel');
  const [commandSyntax, setCommandSyntax] = useState<'curl' | 'powershell'>('curl');

  if (!isOpen) return null;

  const connectedBase = API_BASE_URL.replace(/\/$/, '');
  
  // Resolve base URL depending on selection
  let selectedBase = 'https://apisentinel-azure.vercel.app/api';
  if (targetPreset === 'connected') {
    selectedBase = connectedBase;
  } else if (targetPreset === 'localhost') {
    selectedBase = 'http://localhost:8081/api';
  }

  const testCases = [
    {
      title: '1. Brute-Force Authentication Test',
      type: 'BRUTE_FORCE' as const,
      description: 'Send > 5 failed login attempts in 60 seconds from Postman or terminal:',
      curl: `curl -X POST ${selectedBase}/demo/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"invalid_password"}'`,
      powershell: `1..6 | ForEach-Object {
  Invoke-RestMethod -Uri "${selectedBase}/demo/login" -Method POST \`
    -ContentType "application/json" \`
    -Body '{"username":"admin","password":"invalid_password"}' -SkipHttpErrorCheck
}`,
    },
    {
      title: '2. SQL Injection-Like Pattern Test',
      type: 'SQL_INJECTION' as const,
      description: 'Send a malicious boolean tautology query parameter probe:',
      curl: `curl "${selectedBase}/demo/products?search=%27%20OR%20%271%27=%271"`,
      powershell: `Invoke-RestMethod -Uri "${selectedBase}/demo/products?search=%27%20OR%20%271%27=%271" -Method GET`,
    },
    {
      title: '3. API Abuse / Rate Flooding Test',
      type: 'API_ABUSE' as const,
      description: 'Rapidly trigger > 15 requests within 60 seconds from identical client IP:',
      curl: `for i in {1..20}; do curl -s "${selectedBase}/demo/orders" > /dev/null; done`,
      powershell: `1..20 | ForEach-Object {
  Invoke-RestMethod -Uri "${selectedBase}/demo/orders" -Method GET
}`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-slide">
      <div className="glass-light dark:glass-dark max-w-2xl w-full p-6 md:p-8 rounded-[28px] border border-white/60 dark:border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-neutral-800 dark:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white">
            Attack Simulation & Traffic Testing
          </h2>
        </div>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
          API Sentinel monitors live HTTP ingress traffic and flags real-time threats. Send live requests from your terminal or Postman, or click &quot;Simulate Event&quot; to test instant detection.
        </p>

        {/* Target Environment Selector */}
        <div className="mb-4 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span>Target Endpoint:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-black/5 dark:bg-white/10">
              <button
                type="button"
                onClick={() => setTargetPreset('vercel')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                  targetPreset === 'vercel'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Vercel (Live)</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetPreset('connected')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                  targetPreset === 'connected'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Cloud className="w-3 h-3" />
                <span>Backend Cloud</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetPreset('localhost')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                  targetPreset === 'localhost'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Laptop className="w-3 h-3" />
                <span>Localhost</span>
              </button>
            </div>
          </div>

          {/* Syntax Toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mr-1">Syntax:</span>
            <button
              type="button"
              onClick={() => setCommandSyntax('curl')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                commandSyntax === 'curl'
                  ? 'bg-black/10 dark:bg-white/20 font-bold text-neutral-900 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              cURL
            </button>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <button
              type="button"
              onClick={() => setCommandSyntax('powershell')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                commandSyntax === 'powershell'
                  ? 'bg-black/10 dark:bg-white/20 font-bold text-neutral-900 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              PowerShell
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {testCases.map((tc, idx) => {
            const command = commandSyntax === 'curl' ? tc.curl : tc.powershell;
            return (
              <div
                key={tc.title}
                className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {tc.title}
                  </span>
                  <button
                    onClick={() => onSimulateAttack(tc.type)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-medium hover:opacity-85 transition-opacity"
                  >
                    <Play className="w-3 h-3" />
                    <span>Simulate Event</span>
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
                  {tc.description}
                </p>

                <div className="relative">
                  <pre className="p-3 pr-10 rounded-xl bg-black text-white font-mono text-[10px] overflow-x-auto leading-relaxed border border-white/10">
                    {command}
                  </pre>
                  <button
                    onClick={() => handleCopy(command, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-neutral-300" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="font-mono text-[11px] truncate">
            <span className="text-neutral-400">Target Demo API: </span>
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{selectedBase}/demo</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium hover:bg-black/15 self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
