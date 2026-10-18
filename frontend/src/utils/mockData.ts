import { Incident } from '../types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-00125',
    title: 'High Velocity Brute Force & Credential Spray',
    type: 'BRUTE_FORCE',
    severity: 'CRITICAL',
    riskScore: 94,
    status: 'OPEN',
    sourceIp: '192.168.1.104',
    location: 'Ashburn, United States',
    targetEndpoint: '/api/v1/auth/login',
    httpMethod: 'POST',
    detectedAt: '2 mins ago',
    timeWindow: '10:24:12 - 10:25:31 UTC',
    detectionSource: 'HYBRID',
    requestCount: 483,
    failedCount: 421,
    ruleFindings: [
      'Excessive Login Failures: 421 failed attempts within 60s window (threshold: >10/min)',
      'Single IP Targeting Single Endpoint: /api/v1/auth/login (100% path concentration)',
      'Cascading 401 Unauthorized status responses (87.1% failure rate)'
    ],
    mlScore: 0.93,
    mlInsights: [
      { name: 'Failure Rate (4xx)', baseline: '2.1%', observed: '87.1%', deviation: '+4052%' },
      { name: 'Request Velocity', baseline: '12 req/min', observed: '483 req/min', deviation: '+3925%' },
      { name: 'Endpoint Entropy', baseline: '0.84', observed: '0.01', deviation: '-98.8%' },
      { name: 'User-Agent Novelty', baseline: 'Browser Chrome/120', observed: 'python-requests/2.28', deviation: 'Automated Tool' }
    ],
    recommendedAction: 'Apply immediate Gateway IP blocklist rule and mandate multi-factor step-up authentication.',
    notes: [
      'Initial automated triage flagged anomalous traffic burst at 10:24 UTC.',
      'Analyst assigned: Unassigned (Awaiting Review)'
    ],
    recentLogs: [
      { id: 'log-1', timestamp: '10:25:31.204', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 38, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 },
      { id: 'log-2', timestamp: '10:25:30.892', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 41, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 },
      { id: 'log-3', timestamp: '10:25:30.410', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 35, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 },
      { id: 'log-4', timestamp: '10:25:29.980', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 39, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 },
      { id: 'log-5', timestamp: '10:25:29.110', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 44, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 },
      { id: 'log-6', timestamp: '10:25:28.420', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, latencyMs: 37, sourceIp: '192.168.1.104', userAgent: 'python-requests/2.28.2', riskScore: 94 }
    ]
  },
  {
    id: 'INC-00124',
    title: 'SQL Injection Signature in Search Parameter',
    type: 'SQL_INJECTION',
    severity: 'HIGH',
    riskScore: 87,
    status: 'INVESTIGATING',
    sourceIp: '45.33.32.156',
    location: 'Frankfurt, Germany',
    targetEndpoint: '/api/v1/catalog/search',
    httpMethod: 'GET',
    detectedAt: '18 mins ago',
    timeWindow: '10:07:05 - 10:08:20 UTC',
    detectionSource: 'HYBRID',
    requestCount: 38,
    failedCount: 14,
    ruleFindings: [
      'SQL Injection Pattern: Detected UNION SELECT payload in query string ?q=\' UNION SELECT null, username, password FROM users--',
      'Repeated 500 Internal Server Errors caused by malformed SQL syntax parser exceptions'
    ],
    mlScore: 0.81,
    mlInsights: [
      { name: 'Query String Complexity', baseline: '14 chars', observed: '148 chars', deviation: '+957%' },
      { name: '5xx Server Fault Rate', baseline: '0.05%', observed: '36.8%', deviation: '+73500%' }
    ],
    recommendedAction: 'Inspect ORM parameterization on /catalog/search; verify input sanitization filter on Gateway.',
    notes: [
      'Analyst dev_sec_01 marked for active investigation. Patch deployed to staging.'
    ],
    recentLogs: [
      { id: 'log-7', timestamp: '10:08:19.410', method: 'GET', endpoint: '/api/v1/catalog/search?q=\' UNION SELECT', statusCode: 500, latencyMs: 142, sourceIp: '45.33.32.156', userAgent: 'sqlmap/1.7.2#stable', riskScore: 87 },
      { id: 'log-8', timestamp: '10:08:14.210', method: 'GET', endpoint: '/api/v1/catalog/search?q=\' OR 1=1--', statusCode: 200, latencyMs: 89, sourceIp: '45.33.32.156', userAgent: 'sqlmap/1.7.2#stable', riskScore: 85 }
    ]
  },
  {
    id: 'INC-00123',
    title: 'Automated Endpoint ID Enumeration & Scraping',
    type: 'ENDPOINT_ENUMERATION',
    severity: 'HIGH',
    riskScore: 81,
    status: 'OPEN',
    sourceIp: '104.28.19.42',
    location: 'London, United Kingdom',
    targetEndpoint: '/api/v1/users/{id}',
    httpMethod: 'GET',
    detectedAt: '34 mins ago',
    timeWindow: '09:51:10 - 09:54:00 UTC',
    detectionSource: 'RULE',
    requestCount: 1420,
    failedCount: 410,
    ruleFindings: [
      'Endpoint Traversal: 1,420 sequential IDs accessed across 180 seconds',
      'Exceeded rate threshold: >500 requests/min from single consumer token'
    ],
    mlScore: 0.68,
    mlInsights: [
      { name: 'Unique Endpoint IDs', baseline: '3/min', observed: '473/min', deviation: '+15600%' },
      { name: 'Inter-arrival Jitter', baseline: '1400ms', observed: '42ms', deviation: '-97%' }
    ],
    recommendedAction: 'Throttle IP address at Gateway rate-limiter (tier: 60 req/min). Verify IDOR authorization guard.',
    notes: [
      'High confidence scraper scraping public profiles.'
    ],
    recentLogs: [
      { id: 'log-9', timestamp: '09:53:59.102', method: 'GET', endpoint: '/api/v1/users/4912', statusCode: 200, latencyMs: 24, sourceIp: '104.28.19.42', userAgent: 'Scrapy/2.11', riskScore: 81 },
      { id: 'log-10', timestamp: '09:53:58.910', method: 'GET', endpoint: '/api/v1/users/4911', statusCode: 200, latencyMs: 22, sourceIp: '104.28.19.42', userAgent: 'Scrapy/2.11', riskScore: 81 }
    ]
  },
  {
    id: 'INC-00122',
    title: 'Unusual Latency Spike & Model Outlier',
    type: 'ANOMALY',
    severity: 'MEDIUM',
    riskScore: 64,
    status: 'INVESTIGATING',
    sourceIp: '198.51.100.88',
    location: 'Tokyo, Japan',
    targetEndpoint: '/api/v1/analytics/reports',
    httpMethod: 'POST',
    detectedAt: '1 hour ago',
    timeWindow: '09:12:00 - 09:15:30 UTC',
    detectionSource: 'ML',
    requestCount: 45,
    failedCount: 3,
    ruleFindings: [
      'No explicit rule violation triggered, flagged strictly by ML Anomaly Model'
    ],
    mlScore: 0.89,
    mlInsights: [
      { name: 'Average Latency', baseline: '110ms', observed: '3480ms', deviation: '+3063%' },
      { name: 'Payload Size', baseline: '1.2 KB', observed: '84.6 KB', deviation: '+6950%' }
    ],
    recommendedAction: 'Review heap and DB query metrics on analytics workers.',
    notes: [
      'Heavy payload report generation from enterprise partner.'
    ],
    recentLogs: [
      { id: 'log-11', timestamp: '09:14:22.010', method: 'POST', endpoint: '/api/v1/analytics/reports', statusCode: 200, latencyMs: 3820, sourceIp: '198.51.100.88', userAgent: 'EnterpriseSync/1.0', riskScore: 64 }
    ]
  },
  {
    id: 'INC-00121',
    title: 'Excessive Distributed API Abuse',
    type: 'API_ABUSE',
    severity: 'HIGH',
    riskScore: 78,
    status: 'RESOLVED',
    sourceIp: '185.220.101.5',
    location: 'Amsterdam, Netherlands',
    targetEndpoint: '/api/v1/products',
    httpMethod: 'GET',
    detectedAt: '3 hours ago',
    timeWindow: '07:30:00 - 07:45:00 UTC',
    detectionSource: 'HYBRID',
    requestCount: 3800,
    failedCount: 92,
    ruleFindings: [
      'Rate threshold breach: > 800 req/min for 15 consecutive minutes'
    ],
    mlScore: 0.77,
    mlInsights: [
      { name: 'Request Volume', baseline: '40/min', observed: '810/min', deviation: '+1925%' }
    ],
    recommendedAction: 'IP temporarily blacklisted on Spring Gateway.',
    notes: [
      'Temporary Gateway block applied. Attack subsided. Marked resolved.'
    ],
    recentLogs: []
  }
];
