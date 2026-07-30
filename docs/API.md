# EcoGrid AI — API Reference

**Base URL:** `http://localhost:5001`  
**Frontend Proxy:** All `/api/*` requests from `localhost:5173` are proxied to `localhost:5001`

---

## Authentication

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "consumer@ecogrid.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Consumer",
    "email": "consumer@ecogrid.com",
    "role": "consumer"
  }
}
```

---

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Consumer",
  "email": "consumer@ecogrid.com",
  "password": "password123",
  "role": "consumer"
}
```

**Roles:** `consumer` | `eb_officer` | `grid_operator`

---

## AI Chat (Main Agent Endpoint)

### POST `/api/ai/chat`
Send a message to the AI orchestrator. The orchestrator routes to the correct agent based on role and query keywords.

**Request Body:**
```json
{
  "message": "What is my electricity usage today?",
  "role": "consumer"
}
```

**Response:**
```json
{
  "text": "## Summary\nYour smart meter (SM-2047)...",
  "type": "energy-intelligence",
  "agentName": "Energy Intelligence Agent",
  "id": 1722345678901
}
```

**Role Values:** `consumer` | `eb_officer` | `grid_operator`

**Agent Type Values in Response:**
| type | Agent |
|---|---|
| `energy-intelligence` | Energy Intelligence Agent |
| `grid-operations` | Grid Operations Intelligence Agent |
| `anomaly-detection` | Anomaly Detection Agent |
| `predictive-maintenance` | Predictive Maintenance Agent |
| `carbon-analytics` | Carbon Analytics Agent |
| `demand-forecasting` | Demand Forecasting Agent |
| `smart-decision` | Smart Decision Support Agent |
| `role-assistant` | Role-Based AI Assistant Agent |

---

## Direct Agent Routing

### POST `/api/agent`
Route directly to a specific agent by name.

**Request Body:**
```json
{
  "role": "grid_operator",
  "agent": "grid operations",
  "query": "Check all transformers"
}
```

**Agent Name Values:**
- `energy intelligence`
- `grid operations`
- `anomaly detection`
- `predictive maintenance`
- `carbon analytics`
- `demand forecasting`
- `smart decision support`
- `role based assistant`

**Response:**
```json
{
  "agent": "Grid Operations Intelligence Agent",
  "response": "## Grid Status\n..."
}
```

---

## Dashboard

### GET `/api/dashboard/summary`
Get dashboard KPI data and chart data.

**Query Parameters:**
| Param | Values | Default |
|---|---|---|
| `timeframe` | `today` \| `week` \| `month` | `today` |

**Response:**
```json
{
  "kpis": {
    "totalEnergy": 45.2,
    "currentPower": 3240,
    "costSavings": 12450,
    "carbonSaved": 18.5
  },
  "chartData": [...],
  "lastUpdate": "2026-07-29T10:30:00.000Z"
}
```

---

## IoT Devices

### GET `/api/devices`
Get all IoT devices.

**Response:**
```json
[
  {
    "id": "TM-001",
    "name": "Solar Panel A",
    "type": "Solar Panel",
    "zone": "North",
    "area": "Main Road",
    "transformer": "Transformer A",
    "status": "Online",
    "battery": "100%",
    "signal": "Strong",
    "location": "Main Road",
    "lat": 12.97,
    "long": 77.59
  }
]
```

---

### POST `/api/devices`
Add a new IoT device.

**Request Body:**
```json
{
  "name": "Smart Meter 105",
  "type": "Smart Energy Meter",
  "zone": "Zone North",
  "area": "North Street",
  "houseNumber": "105",
  "transformer": "Transformer A",
  "lat": 12.97,
  "long": 77.59,
  "installationDate": "2026-07-29",
  "status": "Online",
  "battery": "100%",
  "signal": "Strong"
}
```

**Device Types:**
- `Smart Energy Meter`
- `Transformer Monitoring Sensor`
- `Voltage Sensor`
- `Current Sensor`
- `Temperature Sensor`
- `Power Quality Sensor`
- `Distribution Line Sensor`
- `Solar Panel`
- `Wind Turbine`

---

### POST `/api/devices/:id/restart`
Restart a specific IoT device.

**URL Params:** `id` — Device ID (e.g. `TM-001`)

**Response:**
```json
{
  "message": "Device TM-001 restarted successfully",
  "device": { ... }
}
```

---

## Search

### GET `/api/search`
Search across devices and data.

**Query Parameters:**
| Param | Description |
|---|---|
| `q` | Search query string |

---

## Health Check

### GET `/api/health`
Check if the backend is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-29T10:30:00.000Z"
}
```

---

## Error Responses

All endpoints return standard error format:

```json
{
  "error": "Description of the error"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — missing or invalid parameters |
| 401 | Unauthorized — invalid or missing token |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Orchestrator Routing Logic

The `POST /api/ai/chat` endpoint uses this routing logic:

```
role = 'consumer'
  → /bill|cost|charge/ → Energy Intelligence Agent
  → /usage|consume|kwh/ → Energy Intelligence Agent
  → /appliance|ac|refrigerator/ → Energy Intelligence Agent
  → /tip|saving|reduce/ → Energy Intelligence Agent
  → /predict|next month/ → Energy Intelligence Agent
  → default → Role-Based AI Assistant

role = 'eb_officer'
  → /theft|tamper|abnormal|spike/ → Anomaly Detection Agent
  → /carbon|co2|renewable|emission/ → Carbon Analytics Agent
  → /forecast|demand|predict|peak/ → Demand Forecasting Agent
  → /transformer|utilization|zone|town/ → Smart Decision Support Agent
  → default → Smart Decision Support Agent

role = 'grid_operator'
  → /predict|failure|maintenance|health/ → Predictive Maintenance Agent
  → /forecast|demand|peak/ → Demand Forecasting Agent
  → /transformer|substation|voltage|feeder/ → Grid Operations Agent
  → /load|balanc|redistrib/ → Grid Operations Agent
  → default → Role-Based AI Assistant
```
