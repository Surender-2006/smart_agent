# EcoGrid AI — System Architecture

## Overview

EcoGrid AI is a full-stack web application with a React frontend, Node.js/Express backend, MongoDB database, and an 8-agent AI orchestration layer.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (User)                            │
│                   http://localhost:5173                          │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                    React + Vite
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                     FRONTEND LAYER                               │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Sidebar    │  │  Pages       │  │  AI Components         │  │
│  │  (Role Nav) │  │  (Dashboard, │  │  AIAssistant.jsx       │  │
│  │             │  │   Fault,     │  │  AgentChat.jsx         │  │
│  │  Pages      │  │   Carbon,    │  │  AgentPanel.jsx        │  │
│  │  + Agents   │  │   Reports..) │  │                        │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                  │
│  State: localStorage (user role, token)                         │
│  HTTP: Axios → /api/* → proxy → localhost:5001                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP/JSON
                           │ (Vite Proxy)
┌──────────────────────────▼───────────────────────────────────────┐
│                     BACKEND LAYER                                │
│                   http://localhost:5001                          │
│                                                                  │
│  Express App (index.js)                                         │
│  ├── /api/auth      → auth.js                                   │
│  ├── /api/dashboard → dashboard.js                              │
│  ├── /api/devices   → devices.js                                │
│  ├── /api/search    → search.js                                 │
│  ├── /api/health    → health.js                                 │
│  ├── /api/ai/chat   → ai.js → orchestratorService.js           │
│  └── /api/agent     → orchestrator.js                          │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
┌─────────────▼──────────┐  ┌──────────▼──────────────────────────┐
│   MongoDB Database      │  │      AI Orchestration Layer         │
│   localhost:27017       │  │                                     │
│   DB: smart-agent       │  │  orchestratorService.js             │
│                         │  │  ┌─────────────────────────────┐   │
│   Collections:          │  │  │  pickAgent(role, query)      │   │
│   - users               │  │  │  ↓                           │   │
│   - devices             │  │  │  Agent 1: energyIntelligence │   │
│                         │  │  │  Agent 2: gridOperations     │   │
└─────────────────────────┘  │  │  Agent 3: anomalyDetection   │   │
                             │  │  Agent 4: predictiveMaint.   │   │
                             │  │  Agent 5: carbonAnalytics    │   │
                             │  │  Agent 6: demandForecasting  │   │
                             │  │  Agent 7: smartDecision      │   │
                             │  │  Agent 8: roleBasedAssistant │   │
                             │  └─────────────────────────────┘   │
                             │           ↓                         │
                             │  llmClient.js                       │
                             │  ├── OpenAI API (if key set)        │
                             │  └── Demo Data (fallback)           │
                             └─────────────────────────────────────┘
```

---

## Frontend Architecture

### Routing Structure

```
/                          → LandingPage
/login                     → LoginPage
/dashboard                 → DashboardLayout (wrapper)
  /dashboard               → DashboardHome (role-specific)
  /dashboard/energy        → EnergyMonitoring
  /dashboard/fault         → FaultDetection (grid_operator only)
  /dashboard/carbon        → CarbonAnalytics (eb_officer only)
  /dashboard/predictions   → PredictiveAnalytics (grid_operator only)
  /dashboard/iot           → IoTDevices
  /dashboard/reports       → Reports (eb_officer only)
  /dashboard/settings      → Settings
  /dashboard/ai-assistant  → AIAssistant (agent card grid)
  /dashboard/agents/:id    → AgentChat (individual agent chat)
```

### Component Hierarchy

```
App.jsx
└── DashboardLayout.jsx
    ├── Sidebar.jsx
    │   ├── Page NavLinks (role-filtered)
    │   └── Agent NavLinks (role-filtered, collapsible)
    ├── TopNavbar.jsx
    └── <Outlet /> (page content)
        ├── DashboardHome.jsx
        │   └── AgentPanel.jsx (embedded, role-specific)
        ├── EnergyMonitoring.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── FaultDetection.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── CarbonAnalytics.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── PredictiveAnalytics.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── IoTDevices.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── Reports.jsx
        │   └── AgentPanel.jsx (embedded)
        ├── AIAssistant.jsx (agent card selection)
        └── AgentChat.jsx (full chat per agent)
```

### State Management
- No global state library — uses React `useState` + `useEffect`
- User role and token stored in `localStorage`
- Each page reads role from `localStorage` on mount

---

## Backend Architecture

### Request Flow

```
POST /api/ai/chat
  { message: "Check all transformers", role: "grid_operator" }
         │
         ▼
    routes/ai.js
         │
         ▼
  orchestratorService.js
    processRequest({ role, query })
         │
         ▼
    pickAgent(role, query.toLowerCase())
         │
    ┌────┴──────────────────────────────────┐
    │  role = 'grid_operator'               │
    │  query matches /transformer/          │
    │  → returns gridOperations handler     │
    └────┬──────────────────────────────────┘
         │
         ▼
    gridOperations.handle(query, { role })
         │
    ┌────┴──────────────────────────────────┐
    │  1. Try callLLM(SYSTEM_PROMPT, query) │
    │     → OpenAI API (if key configured)  │
    │  2. If fails/mock → buildDemoResponse │
    └────┬──────────────────────────────────┘
         │
         ▼
    {
      text: "## Grid Status\n...",
      type: "grid-operations",
      agentName: "Grid Operations Intelligence Agent",
      id: 1722345678901
    }
         │
         ▼
    res.json(result) → Frontend
```

### Agent File Structure

Each agent file exports:
```js
export const name = 'Agent Name';

export async function handle(query, context = {}) {
  // 1. Try LLM
  try {
    const response = await callLLM(SYSTEM_PROMPT, query);
    if (response && !response.includes('Mock LLM')) return response;
  } catch (_) {}
  // 2. Fallback to demo data
  return buildDemoResponse(query);
}
```

---

## AI Orchestration Logic

### Role → Agent Mapping

```javascript
// Consumer
if (role === 'consumer') {
  if (/bill|cost|charge|usage|consume|appliance|tip|saving|predict|compare/) 
    → energyIntelligence
  else → roleBasedAssistant
}

// EB Officer
if (role === 'eb_officer') {
  if (/theft|tamper|abnormal|spike|anomal/)  → anomalyDetection
  if (/carbon|co2|renewable|emission/)       → carbonAnalytics
  if (/forecast|demand|predict|peak/)        → demandForecasting
  if (/transformer|town|zone|resource/)      → smartDecisionSupport
  else                                       → smartDecisionSupport
}

// Grid Operator
if (role === 'grid_operator') {
  if (/predict|failure|maintenance|health/)  → predictiveMaintenance
  if (/forecast|demand|peak/)               → demandForecasting
  if (/transformer|voltage|feeder|load/)    → gridOperations
  else                                      → roleBasedAssistant
}
```

---

## Database Design

### Collections

**users**
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: 'consumer' | 'eb_officer' | 'grid_operator',
  createdAt: Date
}
```

**devices**
```
{
  _id: ObjectId,
  id: String (unique, e.g. TM-001),
  name: String,
  type: String,
  zone: String,
  area: String,
  houseNumber: String,
  transformer: String,
  lat: Number,
  long: Number,
  installationDate: String,
  status: 'Online' | 'Offline' | 'Warning',
  battery: String,
  signal: String,
  location: String
}
```

---

## Security Design

| Layer | Mechanism |
|---|---|
| Authentication | JWT tokens via `/api/auth/login` |
| Role Enforcement (Frontend) | `localStorage` role check on every page |
| Role Enforcement (Backend) | Role passed in request body, validated in orchestrator |
| Data Isolation | Each agent only returns data for the requesting role |
| Access Denied Pages | Frontend renders "Access Denied" for wrong role |
| Agent Access Control | `AgentChat.jsx` checks `agent.roles.includes(role)` |

---

## Performance Considerations

- **Demo Mode** — instant responses, no API latency
- **LLM Mode** — 1–3 second response time (OpenAI API)
- **Frontend** — Vite HMR for instant dev updates
- **Charts** — Recharts with `animationDuration={500}` for smooth rendering
- **Live Data** — Dashboard polls every 3 seconds for EB Officer and Grid Operator
- **Consumer** — No polling (static personal data)
