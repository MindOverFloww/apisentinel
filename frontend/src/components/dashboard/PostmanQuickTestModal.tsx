import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Play, ShieldAlert } from 'lucide-react';

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

  if (!isOpen) return null;

  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

  const testCases = [
    {
      title: '1. Brute-Force Authentication Test',
      type: 'BRUTE_FORCE' as const,
      description: 'Send > 5 failed login attempts in 60 seconds from Postman or cURL:',
      curl: `curl -X POST ${apiBase}/demo/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"invalid_password"}'`,
    },
    {
      title: '2. SQL Injection-Like Pattern Test',
      type: 'SQL_INJECTION' as const,
      description: 'Send a malicious boolean tautology query parameter probe:',
      curl: `curl "${apiBase}/demo/products?search=%27%20OR%20%271%27=%271"`,
    },
    {
      title: '3. API Abuse / Rate Flooding Test',
      type: 'API_ABUSE' as const,
      description: 'Rapidly trigger > 100 requests within 60 seconds from identical client IP:',
      curl: `for i in {1..105}; do curl -s "${apiBase}/demo/orders" > /dev/null; done`,
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
            Postman / External Traffic Testing
          </h2>
        </div>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
          API Sentinel monitors live external HTTP traffic sent to the Spring Boot Demo API. Use these commands in Postman or Terminal, or click &quot;Simulate Traffic Event&quot; to test the live dashboard response.
        </p>

        <div className="space-y-4">
          {testCases.map((tc, idx) => (
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
                  {tc.curl}
                </pre>
                <button
                  onClick={() => handleCopy(tc.curl, idx)}
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
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>Demo Base URL: http://localhost:8080/api/demo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium hover:bg-black/15"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
