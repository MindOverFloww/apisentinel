import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Server, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onLoginSuccess?: (role: string) => void;
  onNavigateHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Backend URL configuration modal / inline state
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(() => {
    return localStorage.getItem('sentinel_api_base_url') || import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
  });
  const [testStatus, setTestStatus] = useState<{ text: string; success: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const authUser = await login(username, password);
      setIsLoading(false);
      setStatusMessage({ text: `Authenticated as ${authUser.username} (${authUser.role})`, isError: false });
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(authUser.role);
        } else if (onNavigateHome) {
          onNavigateHome();
        }
      }, 400);
    } catch (err: any) {
      setIsLoading(false);
      setStatusMessage({ text: err.message || 'Login failed. Verify backend connectivity and credentials.', isError: true });
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    const target = customApiUrl.trim().replace(/\/+$/, '');
    const pingUrl = target.endsWith('/api') ? `${target}/demo/products` : `${target}/api/demo/products`;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(pingUrl, { signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        setTestStatus({ text: `Connected! Backend online (${res.status})`, success: true });
      } else {
        setTestStatus({ text: `Backend returned HTTP ${res.status}`, success: false });
      }
    } catch (err: any) {
      setTestStatus({ text: `Cannot reach backend: ${err.message || 'Network error'}`, success: false });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveApiUrl = () => {
    const formatted = customApiUrl.trim().replace(/\/+$/, '');
    if (!formatted) {
      localStorage.removeItem('sentinel_api_base_url');
    } else {
      localStorage.setItem('sentinel_api_base_url', formatted);
    }
    window.location.reload();
  };

  const handleSelectCredential = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setStatusMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden animate-fade-slide">
      {/* Background ambient diffuse white light glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[650px] h-[650px] bg-white/50 dark:bg-white/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/[0.08] rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Dark Smoked Glass Showcase Card */}
        <div className="lg:col-span-5 glass-dark p-7 md:p-8 flex flex-col justify-between rounded-[28px] relative overflow-hidden order-2 lg:order-1">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                Security Gateway
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-3">
              Protected by Sentinel Core
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
              Authentication endpoints are continuously audited. Every request is verified with Spring Security JWT tokens and BCrypt cryptographic salted hashes.
            </p>

            {/* Quick Test Role Presets */}
            <div className="mb-6 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mb-2">
                Evaluator Quick Logins
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectCredential('admin', 'admin123')}
                  className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-all text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCredential('analyst', 'analyst123')}
                  className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-all text-center"
                >
                  Analyst
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCredential('viewer', 'viewer123')}
                  className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-all text-center"
                >
                  Viewer
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                  Active Enforcement Rule
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  Brute Force Trigger: &gt; 5 Fails / 60s
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                  Database & Cloud Target
                </div>
                <div className="text-xs font-semibold text-white mt-0.5 font-mono truncate">
                  Supabase PostgreSQL + Render
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Role-Based Access Control</span>
            <span className="text-white font-mono">Spring Security 6</span>
          </div>
        </div>

        {/* Right Card: Light Frosted Glass Login Form */}
        <div className="lg:col-span-7 glass-light p-7 md:p-10 rounded-[28px] flex flex-col justify-between order-1 lg:order-2">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                Console Authentication
              </span>
              <button
                type="button"
                onClick={() => setShowApiConfig(!showApiConfig)}
                className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Configure Backend API URL"
              >
                <Server className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">API Target</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-neutral-900 dark:text-white mb-2">
              Sign In
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mb-4">
              Enter your registered username and password to access the Sentinel console.
            </p>

            {/* Backend URL Configuration Box */}
            {showApiConfig && (
              <div className="mb-5 p-3.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/15 animate-fade-slide text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Render / Backend Endpoint
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Live API</span>
                </div>
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="https://your-service.onrender.com/api"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/20 text-xs font-mono mb-2 text-neutral-900 dark:text-white"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveApiUrl}
                      className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-medium text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Save & Connect
                    </button>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 font-medium text-[11px] flex items-center gap-1 text-neutral-800 dark:text-neutral-200"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                      {isTesting ? 'Testing...' : 'Test Ping'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('sentinel_api_base_url');
                      setCustomApiUrl(API_BASE_URL);
                      window.location.reload();
                    }}
                    className="text-[10px] text-neutral-400 hover:underline"
                  >
                    Reset
                  </button>
                </div>
                {testStatus && (
                  <div className={`mt-2 p-2 rounded-xl text-[11px] font-medium flex items-center gap-1.5 ${testStatus.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {testStatus.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{testStatus.text}</span>
                  </div>
                )}
              </div>
            )}

            {/* Status Toast */}
            {statusMessage && (
              <div className={`mb-4 flex items-center gap-2 p-2.5 rounded-2xl text-xs font-medium shadow-sm animate-fade-slide ${statusMessage.isError ? 'bg-rose-500/15 border border-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                {statusMessage.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-black dark:focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Indicator */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-neutral-300 accent-black dark:accent-white"
                  />
                  <span className="text-[11px]">Remember credentials</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowApiConfig(!showApiConfig)}
                  className="text-[10px] text-neutral-500 hover:underline font-mono truncate max-w-[180px]"
                >
                  {API_BASE_URL}
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-5 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to API Sentinel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Target: <span className="font-mono text-neutral-600 dark:text-neutral-300">{API_BASE_URL}</span></span>
            <span className="font-mono text-[10px]">Version 1.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
