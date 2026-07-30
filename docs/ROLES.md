# EcoGrid AI — Role-Based Access Control

## User Roles

The system has three distinct user roles. Each role has its own dashboard, pages, AI agents, and data access scope.

---

## Role 1 — Consumer

### Profile
A residential electricity consumer connected to the Smart Town grid.

### Data Access
- **Own data only** — meter readings, bills, appliance usage
- Cannot access other consumers' data
- Cannot access town-wide statistics
- Cannot access transformer or grid data

### Sidebar Pages
| Page | Route |
|---|---|
| Dashboard | `/dashboard` |

### AI Agents Available
| Agent | Chat URL | Purpose |
|---|---|---|
| Energy Intelligence Agent | `/dashboard/agents/energy-intelligence` | Personal usage & bills |
| Role-Based AI Assistant | `/dashboard/agents/role-assistant` | General assistance |

### Allowed Queries
- What is my electricity usage today?
- Show my monthly electricity bill
- Which appliance uses the most electricity?
- Give me energy-saving tips
- Predict my next month bill
- Compare my monthly usage
- Show my personal alerts
- Is my home receiving normal voltage?

### Restricted Queries
- Town-wide statistics
- Other consumers' data
- Transformer information
- Grid operations data
- EB Officer reports

---

## Role 2 — EB Officer (Electricity Board Officer)

### Profile
An administrative officer responsible for town-wide energy management, billing, and sustainability.

### Data Access
- Town-wide consumption statistics
- All consumer connection data (aggregated)
- Carbon and sustainability metrics
- IoT device management
- Report generation
- Anomaly and theft detection

### Sidebar Pages
| Page | Route |
|---|---|
| Dashboard | `/dashboard` |
| Energy Monitoring | `/dashboard/energy` |
| Carbon Analytics | `/dashboard/carbon` |
| IoT Devices | `/dashboard/iot` |
| Reports | `/dashboard/reports` |

### AI Agents Available
| Agent | Chat URL | Purpose |
|---|---|---|
| Anomaly Detection Agent | `/dashboard/agents/anomaly-detection` | Theft & tampering detection |
| Carbon Analytics Agent | `/dashboard/agents/carbon-analytics` | CO₂ & sustainability |
| Demand Forecasting Agent | `/dashboard/agents/demand-forecasting` | Load prediction |
| Smart Decision Support Agent | `/dashboard/agents/smart-decision` | Operational decisions |
| Role-Based AI Assistant | `/dashboard/agents/role-assistant` | General assistance |

### Allowed Queries
- Show today's town energy consumption
- Which zone has the highest electricity usage?
- Detect possible electricity theft
- Show carbon reduction statistics
- Generate sustainability report
- Show consumer statistics
- Show IoT device status
- Predict monthly demand
- Recommend resource allocation
- Generate management reports

### Restricted Queries
- Individual transformer load balancing controls
- Live breaker operations
- Real-time feeder switching
- Grid Operator operational controls

---

## Role 3 — Grid Operator

### Profile
A technical operator responsible for real-time management of the electrical distribution network.

### Data Access
- Live transformer telemetry
- Voltage, current, and frequency data
- Feeder line status
- Fault detection and alerts
- Load balancing controls
- Predictive maintenance data

### Sidebar Pages
| Page | Route |
|---|---|
| Dashboard | `/dashboard` |
| Energy Monitoring | `/dashboard/energy` |
| Fault Detection | `/dashboard/fault` |
| Predictions | `/dashboard/predictions` |
| IoT Devices | `/dashboard/iot` |

### AI Agents Available
| Agent | Chat URL | Purpose |
|---|---|---|
| Grid Operations Intelligence Agent | `/dashboard/agents/grid-operations` | Live grid monitoring |
| Predictive Maintenance Agent | `/dashboard/agents/predictive-maintenance` | Failure prediction |
| Demand Forecasting Agent | `/dashboard/agents/demand-forecasting` | Load forecasting |
| Role-Based AI Assistant | `/dashboard/agents/role-assistant` | General assistance |

### Allowed Queries
- Check all transformers
- Show voltage fluctuations
- Show feeder status
- Suggest load balancing
- Show live grid status
- Predict transformer failure
- Show maintenance schedule
- Predict evening peak demand
- Check power quality

### Restricted Queries
- Consumer billing records
- Financial reports
- Carbon emission reports
- Revenue analytics
- Consumer personal data

---

## Access Matrix

| Feature | Consumer | EB Officer | Grid Operator |
|---|---|---|---|
| Personal usage data | ✅ Own only | ❌ | ❌ |
| Town energy statistics | ❌ | ✅ | ✅ |
| Transformer telemetry | ❌ | ❌ | ✅ |
| Voltage / current data | ❌ | ❌ | ✅ |
| Load balancing controls | ❌ | ❌ | ✅ |
| Fault detection | ❌ | ❌ | ✅ |
| Anomaly detection | ❌ | ✅ | ❌ |
| Carbon analytics | ❌ | ✅ | ❌ |
| Consumer statistics | ❌ | ✅ | ❌ |
| Report generation | ❌ | ✅ | ❌ |
| IoT device management | ❌ | ✅ | ✅ (view) |
| Demand forecasting | ❌ | ✅ | ✅ |
| Predictive maintenance | ❌ | ❌ | ✅ |
| Energy Intelligence Agent | ✅ | ❌ | ❌ |
| Grid Operations Agent | ❌ | ❌ | ✅ |
| Anomaly Detection Agent | ❌ | ✅ | ❌ |
| Predictive Maintenance Agent | ❌ | ❌ | ✅ |
| Carbon Analytics Agent | ❌ | ✅ | ❌ |
| Demand Forecasting Agent | ❌ | ✅ | ✅ |
| Smart Decision Support Agent | ❌ | ✅ | ❌ |
| Role-Based AI Assistant | ✅ | ✅ | ✅ |

---

## Security Implementation

### Frontend
- Role is read from `localStorage` (`user.role`) on every page load
- Pages show "Access Denied" for unauthorized roles
- Sidebar only shows pages and agents for the logged-in role
- Agent chat pages check role before rendering

### Backend
- Role is passed with every `/api/ai/chat` request
- `orchestratorService.js` routes only to agents permitted for that role
- Agent handlers use role context for response personalization
- No cross-role data leakage in demo data responses
