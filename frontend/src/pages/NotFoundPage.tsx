import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div style={styles.container}>
      {/* Light gradient ambient glow */}
      <div style={styles.ambientLight} />
      <div style={styles.gridOverlay} />

      {/* Center Frosted Glass Floating Card */}
      <div style={styles.glassCard}>
        {/* Header Indicator */}
        <div style={styles.headerIndicator}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>STATUS // 404 UNCHARTED ENDPOINT</span>
        </div>

        {/* Oversized Thin 404 */}
        <div style={styles.errorCode}>404</div>

        {/* Title & Description */}
        <h1 style={styles.title}>RESOURCE OUTSIDE SENTINEL PERIMETER</h1>
        <p style={styles.description}>
          The requested path is not registered in the API Sentinel Gateway routing table or Intrusion
          Detection matrix. All unmapped ingress attempts are audited.
        </p>

        {/* Diagnostic Smoked Glass Console */}
        <div style={styles.diagnosticConsole}>
          <div style={styles.diagnosticHeader}>
            <span>INGRESS AUDIT TELEMETRY</span>
            <span style={styles.diagnosticBadge}>SYS_TRACE</span>
          </div>

          <div style={styles.telemetryRow}>
            <span style={styles.telemetryKey}>ATTEMPTED_PATH:</span>
            <span style={styles.telemetryValue}>{location.pathname || '/unknown-route'}</span>
          </div>

          <div style={styles.telemetryRow}>
            <span style={styles.telemetryKey}>PERIMETER_GATE:</span>
            <span style={styles.telemetryValue}>SENTINEL_EDGE_ROUTER</span>
          </div>

          <div style={styles.telemetryRow}>
            <span style={styles.telemetryKey}>RESPONSE_STATUS:</span>
            <span style={styles.telemetryValue}>404 NOT FOUND</span>
          </div>

          <div style={styles.telemetryRow}>
            <span style={styles.telemetryKey}>AUDIT_TIMESTAMP:</span>
            <span style={styles.telemetryValue}>{timestamp || '2026-10-09T08:56:12Z'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={styles.actionRow}>
          <Link to="/" style={styles.primaryButton}>
            Return to Surveillance Console
          </Link>
          <Link to="/incidents" style={styles.secondaryButton}>
            Inspect Incidents
          </Link>
        </div>

        {/* Footer Meta */}
        <div style={styles.footerMeta}>
          <span>API SENTINEL // INTRUSION DETECTION SYSTEM</span>
          <span>SECURITY NODE: LOCALHOST</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 50% 20%, #FFFFFF 0%, #F4F5F8 50%, #ECEFF2 100%)',
    color: '#121212',
    fontFamily: "'Plus Jakarta Sans', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '24px',
    overflow: 'hidden',
  },
  ambientLight: {
    position: 'fixed',
    top: '10%',
    left: '30%',
    width: '40vw',
    height: '400px',
    background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glassCard: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '640px',
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    borderRadius: '28px',
    padding: '36px 32px',
    boxShadow: '0 24px 64px -15px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  headerIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '20px',
    padding: '4px 14px',
    marginBottom: '16px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#000000',
  },
  statusText: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#4B5563',
  },
  errorCode: {
    fontSize: '84px',
    fontWeight: 200,
    lineHeight: 1,
    letterSpacing: '-0.06em',
    color: '#000000',
    margin: '4px 0 12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#111111',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#555555',
    maxWidth: '480px',
    margin: '0 0 24px 0',
  },
  diagnosticConsole: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(28, 28, 30, 0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    padding: '18px 20px',
    textAlign: 'left',
    marginBottom: '26px',
    boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.25)',
  },
  diagnosticHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#A1A1AA',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  diagnosticBadge: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#FFFFFF',
    fontSize: '9px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontFamily: 'monospace',
  },
  telemetryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    marginBottom: '6px',
    fontFamily: 'monospace',
  },
  telemetryKey: {
    color: '#8E8E93',
  },
  telemetryValue: {
    color: '#FFFFFF',
    fontWeight: 600,
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '24px',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000000',
    color: '#FFFFFF',
    padding: '10px 22px',
    borderRadius: '24px',
    fontSize: '12px',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: '#111111',
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  footerMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '10px',
    color: '#888888',
    letterSpacing: '0.04em',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    paddingTop: '16px',
  },
};

export default NotFoundPage;
