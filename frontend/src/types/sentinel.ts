export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
export type DetectionType = 'BRUTE_FORCE' | 'API_ABUSE' | 'SQL_INJECTION_PATTERN';

export interface ScoreFactor {
  factor: string;
  points: number;
}

export interface Incident {
  id: string;
  type: DetectionType;
  title: string;
  riskScore: number;
  severity: IncidentSeverity;
  sourceIp: string;
  endpoint: string;
  method: string;
  description: string;
  detectionRule: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  factors: ScoreFactor[];
  samplePayload?: string;
  requestCount?: number;
}

export interface ApiTrafficEvent {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  sourceIp: string;
  userAgent: string;
  riskFlag: boolean;
  riskType?: DetectionType;
}

export interface DetectionRuleItem {
  id: string;
  name: string;
  type: DetectionType;
  description: string;
  threshold: number;
  timeWindow: number;
  enabled: boolean;
}

export interface ScheduleEvent {
  day: string;
  time: string;
  title: string;
  category: string;
}
