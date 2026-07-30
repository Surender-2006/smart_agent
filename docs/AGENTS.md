# EcoGrid AI — Multi-Agent System Documentation

## Overview

The EcoGrid AI Multi-Agent System consists of **8 specialized AI agents** integrated into a single orchestrated system. Each agent is role-secured, domain-specific, and returns structured responses with Summary, Analysis, Recommendation, and Priority sections.

All agents support:
- **LLM Mode** — Uses OpenAI GPT when `OPENAI_API_KEY` is configured
- **Demo Mode** — Returns realistic Smart Town demo data when no API key is set
- **Structured Responses** — Every response follows a consistent markdown format

---

## Agent Routing

File: `backend/orchestratorService.js`

The orchestrator selects the correct agent using:
1. **Role** — Consumer, EB Officer, or Grid Operator
2. **Keyword matching** — regex patterns on the user's query

```
Consumer     → Energy Intelligence (default) | Role-Based Assistant
EB Officer   → Anomaly Detection | Carbon Analytics | Demand Forecasting | Smart Decision Support | Role-Based Assistant
Grid Operator→ Grid Operations | Predictive Maintenance | Demand Forecasting | Role-Based Assistant
```

---

## Agent 1 — Energy Intelligence Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/energyIntelligence.js` |
| Role | Consumer |
| Route Type | `energy-intelligence` |
| Chat URL | `/dashboard/agents/energy-intelligence` |
| Icon | Zap (Blue) |

### Purpose
Help consumers understand and optimize their personal electricity usage.

### Capabilities
- Analyze daily electricity usage
- Analyze monthly electricity usage
- Explain why electricity consumption increased
- Explain why electricity bills increased
- Predict next month's electricity bill
- Analyze appliance-wise energy consumption
- Suggest personalized energy-saving tips
- Estimate monthly savings
- Compare current usage with previous months

### Response Format
```
## Summary
## Usage Analysis
## Bill Prediction
## Recommendations
## Estimated Savings
```

### Keyword Triggers
`bill`, `cost`, `charge`, `usage`, `consume`, `kwh`, `today`, `monthly`, `appliance`, `ac`, `refrigerator`, `tip`, `saving`, `reduce`, `predict`, `compare`, `history`

### Demo Data
- Consumer: House #47, Zone North (Meter: SM-2047)
- Current Month: 248 kWh — ₹1,845
- Top Consumer: Air Conditioner (45%)
- Predicted Next Month: 265 kWh — ₹1,970
- Potential Savings: ₹250–₹450/month

---

## Agent 2 — Grid Operations Intelligence Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/gridOperations.js` |
| Role | Grid Operator |
| Route Type | `grid-operations` |
| Chat URL | `/dashboard/agents/grid-operations` |
| Icon | Activity (Red) |

### Purpose
Monitor and manage the town's electrical distribution network in real time.

### Capabilities
- Monitor transformer health (load, temperature, voltage, current)
- Detect overloaded transformers
- Detect voltage fluctuations and sags
- Recommend load balancing actions
- Monitor feeder line status
- Display live grid status
- Report power quality metrics (THD, power factor, frequency)

### Response Format
```
## Grid Status
## Transformer Health
## Issues Detected
## AI Recommendation
## Priority Level
```

### Keyword Triggers
`transformer`, `substation`, `voltage`, `current`, `feeder`, `power quality`, `frequency`, `load`, `balanc`, `redistrib`, `live`, `grid status`, `overall`, `temperature`, `thermal`

### Demo Data
| Transformer | Zone | Load | Temp | Status |
|---|---|---|---|---|
| Transformer A | North | 72% | 46°C | Healthy |
| Transformer B | East | 91% | 65°C | Warning |
| Transformer C | South | 97% | 79°C | Critical |
| Transformer D | West | 63% | 43°C | Healthy |

---

## Agent 3 — Anomaly Detection Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/anomalyDetection.js` |
| Role | EB Officer |
| Route Type | `anomaly-detection` |
| Chat URL | `/dashboard/agents/anomaly-detection` |
| Icon | ShieldAlert (Orange) |

### Purpose
Detect abnormal electricity usage and equipment behavior across the Smart Town.

### Capabilities
- Detect abnormal energy consumption patterns
- Detect possible electricity theft indicators
- Detect meter tampering and bypass
- Detect faulty smart meters
- Detect abnormal transformer behavior
- Detect unusual IoT sensor readings
- Generate confidence scores (%)
- Generate risk levels (Low / Medium / High / Critical)
- Recommend investigation actions

### Safety Rules
- **Never directly accuse consumers**
- Always report as "Possible abnormal activity detected"
- Recommend physical verification before any action

### Response Format
```
## Risk Level
## Confidence Score
## Possible Cause
## Recommended Action
```

### Keyword Triggers
`theft`, `tamper`, `bypass`, `illegal`, `meter fault`, `abnormal`, `spike`, `anomal`, `faulty`, `sensor`, `iot`

### Demo Data
| Meter | Issue | Risk | Confidence |
|---|---|---|---|
| SM-3301 | Meter reading reversal | Critical | 95% |
| SM-1042 | 340% consumption spike | High | 91% |
| SM-2187 | Zero consumption 14 days | High | 88% |
| SM-0765 | Night-time spike | Medium | 74% |

---

## Agent 4 — Predictive Maintenance Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/predictiveMaintenance.js` |
| Role | Grid Operator |
| Route Type | `predictive-maintenance` |
| Chat URL | `/dashboard/agents/predictive-maintenance` |
| Icon | Wrench (Yellow) |

### Purpose
Predict equipment failures before they occur and recommend preventive maintenance.

### Capabilities
- Predict transformer failure probability
- Calculate transformer health scores (0–100)
- Generate maintenance schedules
- Analyze temperature trends
- Analyze voltage and load history
- Analyze insulation resistance and oil levels
- Recommend preventive maintenance actions

### Response Format
```
## Health Score
## Failure Probability
## Maintenance Recommendation
## Priority
```

### Keyword Triggers
`predict`, `failure`, `fail`, `maintenance`, `health score`, `schedule`, `temperature`, `thermal`, `heat`, `all`, `overview`, `summary`

### Demo Data
| Transformer | Health Score | Failure Risk | Last Maintenance |
|---|---|---|---|
| Transformer A | 88/100 | 8% | 2026-03-15 |
| Transformer B | 62/100 | 38% | 2025-11-20 |
| Transformer C | 34/100 | 84% | 2025-08-10 |
| Transformer D | 91/100 | 5% | 2026-05-01 |

---

## Agent 5 — Carbon Analytics Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/carbonAnalytics.js` |
| Role | EB Officer |
| Route Type | `carbon-analytics` |
| Chat URL | `/dashboard/agents/carbon-analytics` |
| Icon | Leaf (Green) |

### Purpose
Analyze the environmental impact of electricity usage across the Smart Town.

### Capabilities
- Estimate CO₂ emissions (gross and net)
- Calculate carbon reduction vs previous months
- Monitor renewable energy contribution (solar + wind)
- Generate monthly sustainability reports
- Compare monthly emissions trends
- Suggest methods to reduce carbon emissions
- Display zone-wise environmental impact

### Response Format
```
## Carbon Report
## Renewable Energy Contribution
## CO₂ Reduction
## AI Recommendation
```

### Keyword Triggers
`co2`, `emission`, `carbon`, `renewable`, `solar`, `wind`, `green`, `sustainability`, `report`, `compare`, `zone`, `area`

### Demo Data (July 2026)
- Gross Emissions: 89.4 tons CO₂
- Renewable Offset: 45.2 tons CO₂
- Net Emissions: 44.2 tons CO₂
- Renewable Share: 35% (Target: 40%)
- Solar Generation: 1.45 MW peak
- Trees Equivalent: 1,240 mature trees

---

## Agent 6 — Demand Forecasting Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/demandForecasting.js` |
| Roles | EB Officer, Grid Operator |
| Route Type | `demand-forecasting` |
| Chat URL | `/dashboard/agents/demand-forecasting` |
| Icon | TrendingUp (Purple) |

### Purpose
Predict future electricity demand at hourly, daily, weekly, and monthly levels.

### Capabilities
- Predict hourly demand profile
- Predict daily demand
- Predict weekly demand patterns
- Predict monthly demand totals
- Predict peak usage hours
- Forecast individual transformer loads
- Forecast town-wide energy demand
- Use historical consumption trends
- Factor in weather and seasonal patterns

### Response Format
```
## Forecast
## Peak Hours
## Confidence
## Recommendation
```

### Keyword Triggers
`hourly`, `today`, `hour`, `weekly`, `week`, `daily`, `monthly`, `month`, `peak`, `evening`, `morning`, `transformer`, `load forecast`, `zone`, `area`, `town`

### Demo Data
- Current Load: 12.4 MW
- Today's Peak: 13.8 MW at 20:00
- This Month: 89.6 MWh
- Next Month Forecast: 94.1 MWh
- Peak Window: 18:00–22:00 (Evening residential)
- Forecast Confidence: 87%

---

## Agent 7 — Smart Decision Support Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/smartDecisionSupport.js` |
| Role | EB Officer |
| Route Type | `smart-decision` |
| Chat URL | `/dashboard/agents/smart-decision` |
| Icon | BarChart3 (Cyan) |

### Purpose
Help EB Officers make informed operational decisions for the Smart Town.

### Capabilities
- Analyze town-wide energy consumption
- Analyze transformer utilization rates
- Recommend load redistribution strategies
- Suggest maintenance priorities
- Recommend energy optimization measures
- Identify high-demand zones and areas
- Recommend resource allocation
- Generate AI-based operational recommendations

### Response Format
```
## Situation Summary
## AI Analysis
## Recommended Actions
## Expected Benefits
```

### Keyword Triggers
`town`, `consumption`, `overall`, `energy`, `transformer`, `utilization`, `maintenance priority`, `load redistrib`, `zone`, `area`, `high.demand`, `resource`, `allocat`, `report`, `recommendation`, `operational`

### Demo Data
- Total Load: 12.4 MW
- Total Consumers: 12,850
- Online Meters: 12,826 (99.8%)
- Grid Health: 98%
- Renewable Share: 35%
- Monthly Revenue: ₹23.7 Lakhs

---

## Agent 8 — Role-Based AI Assistant Agent

| Property | Value |
|---|---|
| File | `backend/routes/agents/roleBasedAssistant.js` |
| Roles | Consumer, EB Officer, Grid Operator |
| Route Type | `role-assistant` |
| Chat URL | `/dashboard/agents/role-assistant` |
| Icon | BrainCircuit (Cyan/Accent) |

### Purpose
Provide intelligent role-aware conversations for all user types.

### Capabilities by Role

**Consumer can ask:**
- My electricity bill and payment status
- My energy usage today and monthly
- Appliance consumption breakdown
- Energy-saving tips
- Personal alerts and notifications

**EB Officer can ask:**
- Town analytics and statistics
- Consumer connection reports
- Carbon analytics summary
- IoT device status
- Energy reports and exports

**Grid Operator can ask:**
- Transformer health status
- Voltage and current levels
- Grid health overview
- Load balancing guidance
- Power outage status
- Fault detection summary

### Response Format
```
## Summary
## Analysis
## Recommendation
## Priority
## Next Action
```

### Keyword Triggers
Fallback agent — triggered when no other agent matches the query for the given role.

---

## Agent Comparison Table

| # | Agent | Role | Icon Color | Key Domain |
|---|---|---|---|---|
| 1 | Energy Intelligence | Consumer | Blue | Personal usage & bills |
| 2 | Grid Operations Intelligence | Grid Operator | Red | Live grid monitoring |
| 3 | Anomaly Detection | EB Officer | Orange | Theft & tampering detection |
| 4 | Predictive Maintenance | Grid Operator | Yellow | Failure prediction |
| 5 | Carbon Analytics | EB Officer | Green | CO₂ & sustainability |
| 6 | Demand Forecasting | EB Officer + Grid Operator | Purple | Load prediction |
| 7 | Smart Decision Support | EB Officer | Cyan | Operational decisions |
| 8 | Role-Based AI Assistant | All Roles | Accent | General assistance |

---

## Adding a New Agent

1. Create `backend/routes/agents/yourAgent.js` with:
   ```js
   export const name = 'Your Agent Name';
   export async function handle(query, context = {}) { ... }
   ```

2. Add keyword routing in `backend/orchestratorService.js` inside `pickAgent()`

3. Add the agent type mapping in `AGENT_TYPE_MAP`

4. Add the agent config in `frontend/src/pages/AgentChat.jsx` → `AGENT_CONFIG`

5. Add the agent to `frontend/src/pages/AIAssistant.jsx` → `ALL_AGENTS`

6. Add the sidebar link in `frontend/src/components/layout/Sidebar.jsx` → `AGENT_NAV`
