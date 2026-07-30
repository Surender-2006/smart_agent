# EcoGrid AI — Smart Town Energy Management System

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [User Roles & Access Control](#6-user-roles--access-control)
7. [Pages & Features](#7-pages--features)
8. [Multi-Agent AI System](#8-multi-agent-ai-system)
9. [API Reference](#9-api-reference)
10. [Database Schema](#10-database-schema)
11. [Environment Configuration](#11-environment-configuration)

---

## 1. Project Overview

**EcoGrid AI** is a Smart Town Energy Management System that uses a Multi-Agent AI architecture to monitor, analyze, and optimize electricity distribution across a smart town. The system serves three distinct user roles — Consumers, EB Officers, and Grid Operators — each with their own secure dashboard, AI agents, and data access.

### Key Highlights

- **8 Specialized AI Agents** — each dedicated to a specific domain
- **Role-Based Access Control** — strict data isolation per user role
- **Real-Time Grid Monitoring** — live transformer, voltage, and load data
- **Predictive Analytics** — failure prediction and demand forecasting
- **Carbon Analytics** — CO₂ tracking and sustainability reporting
- **Smart Town Terminology** — Houses, Consumers, Transformers, Distribution Areas, IoT Devices

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Consumer │  │EB Officer│  │   Grid Operator       │  │
│  │Dashboard │  │Dashboard │  │   Dashboard           │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       └─────────────┴──────────────────┘               │
│                    AI Assistant + Agent Chats            │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (Axios / Proxy)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)            │
│                                                         │
│   POST /api/ai/chat                                     │
│         │                                               │
│         ▼                                               │
│   ┌─────────────────┐                                   │
│   │  AI Orchestrator │  ← orchestratorService.js        │
│   │  (Role + Keyword │                                   │
│   │   Based Routing) │                                   │
│   └────────┬────────┘                                   │
│            │                                            │
│   ┌────────▼──────────────────────────────────────┐    │
│   │           8 AI Agent Handlers                  │    │
│   │  Agent 1: Energy Intelligence                  │    │
│   │  Agent 2: Grid Operations Intelligence         │    │
│   │  Agent 3: Anomaly Detection                    │    │
│   │  Agent 4: Predictive Maintenance               │    │
│   │  Agent 5: Carbon Analytics                     │    │
│   │  Agent 6: Demand Forecasting                   │    │
│   │  Agent 7: Smart Decision Support               │    │
│   │  Agent 8: Role-Based AI Assistant              │    │
│   └───────────────────────────────────────────────┘    │
│                                                         │
│   Other Routes: /api/auth  /api/dashboard               │
│                 /api/devices  /api/search               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   MongoDB Database      │
              │   (localhost:27017)     │
              │   DB: smart-agent       │
              └────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.7 | UI Framework |
| Vite | 8.1.1 | Build Tool & Dev Server |
| Tailwind CSS | 4.3.3 | Styling |
| Framer Motion | 12.42.2 | Animations |
| React Router DOM | 7.18.1 | Client-Side Routing |
| Axios | 1.18.1 | HTTP Client |
| Recharts | 3.10.1 | Charts & Graphs |
| Lucide React | 1.27.0 | Icons |
| jsPDF | 4.2.1 | PDF Generation |
| XLSX | 0.18.5 | Excel Export |
| Leaflet | 1.9.4 | Map Visualization |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24+ | Runtime |
| Express | 4.21.2 | Web Framework |
| MongoDB | Local | Database |
| Mongoose | 8.5.0 | ODM |
| JSON Web Token | 9.0.2 | Authentication |
| dotenv | 16.4.5 | Environment Config |
| CORS | 2.8.5 | Cross-Origin Requests |

---

## 4. Project Structure

```
Smart Agent/
├── backend/
│   ├── models/
│   │   └── device.js              # IoT Device schema
│   ├── routes/
│   │   ├── agents/
│   │   │   ├── energyIntelligence.js      # Agent 1
│   │   │   ├── gridOperations.js          # Agent 2
│   │   │   ├── anomalyDetection.js        # Agent 3
│   │   │   ├── predictiveMaintenance.js   # Agent 4
│   │   │   ├── carbonAnalytics.js         # Agent 5
│   │   │   ├── demandForecasting.js       # Agent 6
│   │   │   ├── smartDecisionSupport.js    # Agent 7
│   │   │   └── roleBasedAssistant.js      # Agent 8
│   │   ├── ai.js                  # AI chat route → orchestrator
│   │   ├── auth.js                # Login / Register
│   │   ├── dashboard.js           # Dashboard data
│   │   ├── devices.js             # IoT device CRUD
│   │   ├── health.js              # Health check
│   │   └── search.js              # Search
│   ├── utils/
│   │   └── llmClient.js           # OpenAI API wrapper
│   ├── orchestrator.js            # Express router for /api/agent
│   ├── orchestratorService.js     # Core routing logic (role + keyword)
│   ├── db.js                      # MongoDB connection
│   ├── index.js                   # App entry point
│   ├── seed.js                    # Database seeder
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx        # Role-based navigation
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── TopNavbar.jsx
│   │   │   └── AgentPanel.jsx         # Embedded agent panel
│   │   ├── pages/
│   │   │   ├── AIAssistant.jsx        # Agent card selection page
│   │   │   ├── AgentChat.jsx          # Individual agent chat page
│   │   │   ├── DashboardHome.jsx      # Role-based dashboard
│   │   │   ├── EnergyMonitoring.jsx
│   │   │   ├── FaultDetection.jsx
│   │   │   ├── CarbonAnalytics.jsx
│   │   │   ├── PredictiveAnalytics.jsx
│   │   │   ├── IoTDevices.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx                    # Routes
│   │   └── main.jsx
│   ├── vite.config.js                 # Proxy: /api → localhost:5001
│   └── package.json
│
└── docs/                              # ← This documentation folder
    ├── README.md                      # This file
    ├── AGENTS.md                      # All 8 agents detailed
    ├── API.md                         # API endpoints reference
    ├── ROLES.md                       # Role access matrix
    └── SETUP.md                       # Installation & run guide
```

---

## 5. Getting Started

See [SETUP.md](./SETUP.md) for full installation and run instructions.

**Quick Start:**
```bash
# Terminal 1 — Start MongoDB
mongod

# Terminal 2 — Start Backend
cd backend
npm install
npm start

# Terminal 3 — Start Frontend
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 6. User Roles & Access Control

See [ROLES.md](./ROLES.md) for the full access matrix.

| Role | Primary Focus | Agent Access |
|---|---|---|
| **Consumer** | Personal energy usage & bills | Energy Intelligence, Role-Based Assistant |
| **EB Officer** | Town administration & analytics | Anomaly Detection, Carbon Analytics, Demand Forecasting, Smart Decision Support, Role-Based Assistant |
| **Grid Operator** | Live grid operations | Grid Operations, Predictive Maintenance, Demand Forecasting, Role-Based Assistant |

---

## 7. Pages & Features

| Page | Route | Roles | Description |
|---|---|---|---|
| Landing Page | `/` | All | Public landing page |
| Login | `/login` | All | Authentication |
| Dashboard | `/dashboard` | All | Role-specific home dashboard |
| Energy Monitoring | `/dashboard/energy` | EB Officer, Grid Operator | Live energy charts |
| Fault Detection | `/dashboard/fault` | Grid Operator | Fault alerts & diagnostics |
| Carbon Analytics | `/dashboard/carbon` | EB Officer | CO₂ & sustainability |
| Predictions | `/dashboard/predictions` | Grid Operator | Demand forecasting charts |
| IoT Devices | `/dashboard/iot` | EB Officer, Grid Operator | Device management |
| Reports | `/dashboard/reports` | EB Officer | PDF/Excel report generation |
| AI Assistant | `/dashboard/ai-assistant` | All | Agent selection cards |
| Agent Chat | `/dashboard/agents/:agentId` | Role-specific | Individual agent chat |
| Settings | `/dashboard/settings` | All | User settings |

---

## 8. Multi-Agent AI System

See [AGENTS.md](./AGENTS.md) for full agent documentation.

The system uses an **AI Orchestrator** that routes each user request to the correct agent based on:
1. The logged-in user's **role**
2. **Keyword matching** in the query

### Orchestration Flow

```
User Query → /api/ai/chat
    → orchestratorService.js
        → pickAgent(role, query)
            → Agent.handle(query, context)
                → callLLM() [if API key set]
                → buildDemoResponse() [fallback]
    → { text, type, agentName, id }
```

---

## 9. API Reference

See [API.md](./API.md) for full endpoint documentation.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/dashboard/summary` | Dashboard KPI data |
| POST | `/api/ai/chat` | Main AI agent chat |
| POST | `/api/agent` | Direct agent routing |
| GET | `/api/devices` | List IoT devices |
| POST | `/api/devices` | Add IoT device |
| POST | `/api/devices/:id/restart` | Restart device |

---

## 10. Database Schema

### User
```js
{
  name: String,
  email: String,
  password: String (hashed),
  role: 'consumer' | 'eb_officer' | 'grid_operator'
}
```

### IoT Device
```js
{
  id: String,           // e.g. TM-001
  name: String,
  type: String,         // Smart Energy Meter, Transformer Monitoring Sensor, etc.
  zone: String,         // Zone North, Zone East, etc.
  area: String,
  houseNumber: String,
  transformer: String,  // Transformer A/B/C/D
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

## 11. Environment Configuration

### backend/.env
```env
MONGODB_URI=mongodb://localhost:27017/smart-agent
PORT=5001
OPENAI_API_KEY=           # Optional — leave blank to use demo data
LLM_MODEL=gpt-4o-mini     # Optional — default model
```

### frontend/vite.config.js
```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true
    }
  }
}
```
