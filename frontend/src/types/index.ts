export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export type ThreatType = 
  | 'BRUTE_FORCE' 
  | 'SQL_INJECTION' 
  | 'ANOMALY' 
  | 'API_ABUSE' 
  | 'ENDPOINT_ENUMERATION'
  | 'CREDENTIAL_STUFFING';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface ForensicLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  sourceIp: string;
  userAgent: string;
  riskScore: number;
}

export interface MLFeatureInsight {
  name: string;
  baseline: string;
  observed: string;
  deviation: string;
}

export interface Incident {
  id: string;
  title: string;
  type: ThreatType;
  severity: IncidentSeverity;
  riskScore: number;
  status: IncidentStatus;
  sourceIp: string;
  location?: string;
  targetEndpoint: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  detectedAt: string;
  timeWindow: string;
  detectionSource: 'RULE' | 'ML' | 'HYBRID';
  requestCount: number;
  failedCount: number;
  ruleFindings: string[];
  mlScore: number;
  mlInsights: MLFeatureInsight[];
  recommendedAction: string;
  notes: string[];
  recentLogs: ForensicLog[];
}
