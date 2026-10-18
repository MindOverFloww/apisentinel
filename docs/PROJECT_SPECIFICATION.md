# API Sentinel — Project Specification & Roadmap

> **One-Sentence Project Definition:**  
> *"We are building an API security monitoring platform. It receives API traffic, converts requests into security-relevant events, analyzes those events using both predefined detection rules and machine-learning-based anomaly detection, combines the results into a risk score, stores security incidents, and presents them through a dashboard where analysts can investigate and manage threats."*

---

## 1. What Problem Are We Solving?

In modern cloud applications, thousands of API requests arrive every minute across various endpoints:
- `POST /api/login`
- `GET /api/users/123`
- `POST /api/payment`
- `DELETE /api/account/123`

Among legitimate traffic, threat actors launch attacks such as:
1. **Automated Enumeration:** Sequentially requesting `GET /api/users/1`, `GET /api/users/2` ... `GET /api/users/10000`.
2. **SQL Injection:** Injecting payloads such as `GET /api/search?q=' OR 1=1 --`.
3. **Credential Stuffing & Brute Force:** Repeatedly posting failed login attempts against `POST /api/login`.
4. **API Abuse & Scraping:** Hundreds of calls per second to harvest business data or exhaust resources.

API Sentinel identifies, scores, and surfaces these malicious patterns in real time.

---

## 2. Overall Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                   │
│             React + TypeScript               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   Gateway                    │
│                Spring Gateway                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   Backend                    │
│                 Spring Boot                  │
│          Auth / Users / APIs / DB            │
└──────────────┬───────────────────────────────┘
               │
          API Event
               │
       ┌───────┴───────────────┐
       ▼                       ▼
┌───────────────┐     ┌─────────────────┐
│Detection Engine│    │   ML Service    │
│     Java      │     │     Python      │
│ Rules + Risk  │     │  Anomaly Model  │
└──────┬────────┘     └────────┬────────┘
       │                       │
       └──────────────┬────────┘
                      ▼
             ┌─────────────────┐
             │   PostgreSQL    │
             │Events/Incidents │
             │ Users/Rules/etc │
             └─────────────────┘
```

> **Note:** These are not four isolated projects; they are tightly integrated subsystems of one unified platform.

---

## 3. Request Lifecycle

When an API request arrives at an endpoint:
```http
GET /api/users?id=100
Authorization: Bearer <JWT>
User-Agent: Mozilla/5.0
```

The system captures an **API Event** with structured metadata:
- **HTTP Method:** `GET`
- **Endpoint:** `/api/users`
- **Query Parameters:** `id=100`
- **Status Code:** `200`
- **Response Time:** `120 ms`
- **Source IP:** `192.168.x.x`
- **User Agent:** `Mozilla/5.0`
- **Timestamp:** `10:20:35`
- **Authenticated:** `true`
- **User:** `analyst1`

---

## 4. Features Processed

API Sentinel focuses on **metadata and behavioral features** rather than storing unbounded raw payloads.

### Request-Level Features
- HTTP method, Endpoint/path, Query structure
- Response status code, Request size, Response size, Response latency
- Source IP, User-Agent, Authentication status, Timestamp

### Behavioral Features (Aggregated Windows, e.g. 60s)
- Request volume from IP
- Failed request count (4xx, 5xx)
- Unique endpoints accessed
- Login failure rate
- Latency variance

---

## 5. Dual-Layer Detection Strategy

```
                    API Event
                        │
                ┌───────┴───────┐
                ▼               ▼
         Rule Detection     ML Detection
          (Deterministic)   (Statistical)
                │               │
                ▼               ▼
             Findings      Anomaly Score
                │               │
                └───────┬───────┘
                        ▼
                   Risk Scoring
                        │
                        ▼
               Final Security Event
```

1. **Rule-Based Engine:** Fast, deterministic detection for known attack signatures and threshold breaches.
2. **Machine Learning Model:** Unsupervised anomaly detection to flag zero-day or non-obvious behavioral shifts.

---

## 6. Subsystem Specifications

### Member 1: Backend (Central Backbone)
- **Directory:** `backend/`
- **Technologies:** Java 21, Spring Boot, Spring Security, JWT, PostgreSQL, Flyway, JPA/Hibernate, WebSocket
- **Responsibilities:**
  - User management & RBAC (`ADMIN`, `ANALYST`, `VIEWER`)
  - Authentication & JWT token issuing/validation
  - API event ingestion pipeline
  - Storage & retrieval for events, incidents, and audit trails
  - Coordination with Detection Engine and ML Service
  - Real-time updates to Frontend (WebSocket / SSE)

### Member 2: Detection Engine
- **Directory:** `detection-engine/`
- **Technologies:** Java / Spring component or module
- **Responsibilities:**
  - Define rules & threshold evaluators:
    - *Brute Force:* >10 failed logins per IP within 60s
    - *Rate Abuse:* >500 requests per IP within 60s
    - *SQLi:* Signature matching on queries/headers
    - *Enumeration:* Rapid traversal across resource IDs
  - Severity classification (LOW, MEDIUM, HIGH, CRITICAL)
  - Risk formula engine combining rule outputs + ML anomaly scores

### Member 3: ML Service
- **Directory:** `ml-service/`
- **Technologies:** Python, FastAPI/Flask, scikit-learn, Isolation Forest
- **Responsibilities:**
  - Feature extraction & data preprocessing
  - Model training (Unsupervised Isolation Forest)
  - Serialization (`joblib` / `pickle`)
  - Lightweight inference API:
    - Input: `{"request_count": 400, "failed_request_count": 180, "unique_endpoint_count": 20, "average_response_time": 850}`
    - Output: `{"anomaly": true, "score": 0.91}`

### Member 4: Frontend (Security Operations Center)
- **Directory:** `frontend/`
- **Technologies:** React 18, TypeScript, Vite, React Router, Axios
- **Responsibilities:**
  - Authentication & Protected Routes
  - **Dashboard:** Live metrics, event counters, severity breakdown, threat trends
  - **Incidents:** Triage table, status management (`OPEN` → `INVESTIGATING` → `RESOLVED`)
  - **Incident Detail View:** Drill-down timeline, triggered rules, ML score, recommended action
  - **API Traffic Inspector:** Searchable, filterable event table
  - **Rules & ML Pages:** Rule configuration toggles, model metrics & health

---

## 7. Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **ADMIN** | Full system control, rule tuning, user management, configuration |
| **ANALYST** | Triage incidents, investigate traffic, change incident status, view reports |
| **VIEWER** | Read-only access to dashboard, incidents, and metrics |

---

## 8. Incident Data Model

Stored in PostgreSQL upon high-risk detection:
- `id`: Unique Incident ID (e.g., `INC-00125`)
- `type`: Attack category (`BRUTE_FORCE`, `SQL_INJECTION`, `ANOMALY`, `API_ABUSE`)
- `severity`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- `risk_score`: Numeric composite (0–100)
- `source_ip`: Originating IP address
- `endpoint`: Target endpoint
- `detected_at`: Timestamp
- `status`: `OPEN` | `INVESTIGATING` | `RESOLVED`
- `detection_source`: `RULE` | `ML` | `HYBRID`

---

## 9. Demo Generator (`demo-api/`)

To validate and showcase the system in presentations:
- Generates realistic normal user traffic (browsing, ordering, profile lookup).
- Injects scripted attacks:
  - High-frequency login failures
  - Path traversal and SQL injection queries
  - Mass ID enumeration loops

---

## 10. Completed Milestones vs. Next Steps

### Completed So Far
- Monorepo structure & branch strategy
- Backend Spring Boot foundation on Java 21
- PostgreSQL database connectivity & Flyway migration support
- Initial schemas: `users`, `roles`, `user_roles`
- Role seeding (`ADMIN`, `ANALYST`, `VIEWER`)
- BCrypt password hashing & registration endpoint
- Swagger/OpenAPI & Actuator health monitoring
- Frontend scaffolding (React, TypeScript, Vite, dependencies installed)

### Immediate Backend Roadmap
1. **JWT Authentication & Login:** Issue and validate tokens on protected routes.
2. **Global Exception Handling:** Standardized error responses across all controllers.
3. **API Event Model:** Define entity, DTO, and repository for ingested traffic.
4. **Event Ingestion Endpoint:** Route to receive requests from the gateway or interceptor.
5. **Detection Engine Integration:** Hook incoming events into rule evaluation.
6. **Incident Model & APIs:** Create, list, filter, and update incident statuses.
7. **ML Service Integration:** HTTP client connecting backend to Python inference endpoint.
8. **WebSocket / Live Alerting:** Push critical incidents to frontend in real time.
9. **End-to-End Testing with Demo API.**

---

## 11. Git Branching Strategy

```text
main
 ├── backend-dev       (backend/)
 ├── detection-dev     (detection-engine/)
 ├── ml-dev            (ml-service/)
 └── frontend-dev      (frontend/)
```
Each member develops within their assigned subfolder branch and opens a Pull Request into `main` after local verification.
