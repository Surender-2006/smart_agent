// backend/orchestratorService.js
// Multi-Agent AI Orchestrator — Smart Town Energy Management System
import * as energyIntelligence from './routes/agents/energyIntelligence.js';
import * as gridOperations from './routes/agents/gridOperations.js';
import * as anomalyDetection from './routes/agents/anomalyDetection.js';
import * as predictiveMaintenance from './routes/agents/predictiveMaintenance.js';
import * as carbonAnalytics from './routes/agents/carbonAnalytics.js';
import * as demandForecasting from './routes/agents/demandForecasting.js';
import * as smartDecisionSupport from './routes/agents/smartDecisionSupport.js';
import * as roleBasedAssistant from './routes/agents/roleBasedAssistant.js';

// Map agent name → agent type key used by frontend agentConfig
const AGENT_TYPE_MAP = {
  'Energy Intelligence Agent': 'energy-intelligence',
  'Grid Operations Intelligence Agent': 'grid-operations',
  'Anomaly Detection Agent': 'anomaly-detection',
  'Predictive Maintenance Agent': 'predictive-maintenance',
  'Carbon Analytics Agent': 'carbon-analytics',
  'Demand Forecasting Agent': 'demand-forecasting',
  'Smart Decision Support Agent': 'smart-decision',
  'Role-Based AI Assistant Agent': 'role-assistant',
};

function pickAgent(role, q) {
  // ── CONSUMER ──────────────────────────────────────────────────────────────
  if (role === 'consumer') {
    if (/bill|cost|charge|payment|due/.test(q)) return energyIntelligence;
    if (/usage|consume|kwh|today|monthly|this month/.test(q)) return energyIntelligence;
    if (/appliance|ac|refrigerator|tv|fan|heater|most energy/.test(q)) return energyIntelligence;
    if (/tip|saving|reduce|lower|efficient/.test(q)) return energyIntelligence;
    if (/predict|next month|forecast/.test(q)) return energyIntelligence;
    if (/compare|previous|history|last month/.test(q)) return energyIntelligence;
    return roleBasedAssistant;
  }

  // ── EB OFFICER ────────────────────────────────────────────────────────────
  if (role === 'eb_officer') {
    if (/theft|tamper|bypass|illegal|meter fault|abnormal|spike|anomal/.test(q)) return anomalyDetection;
    if (/carbon|co2|emission|renewable|solar|wind|green|sustainability/.test(q)) return carbonAnalytics;
    if (/forecast|demand|predict|peak hour|weekly demand|monthly demand/.test(q)) return demandForecasting;
    if (/transformer|utilization|maintenance priority|load redistrib/.test(q)) return smartDecisionSupport;
    if (/town|consumption|overall|zone|area|high.demand|resource|allocat/.test(q)) return smartDecisionSupport;
    if (/report|recommendation|operational/.test(q)) return smartDecisionSupport;
    if (/consumer|statistic|iot|device|meter|online/.test(q)) return roleBasedAssistant;
    return smartDecisionSupport;
  }

  // ── GRID OPERATOR ─────────────────────────────────────────────────────────
  if (role === 'grid_operator') {
    if (/predict|failure|maintenance|health score|schedule/.test(q)) return predictiveMaintenance;
    if (/forecast|demand|peak|zone demand/.test(q)) return demandForecasting;
    if (/transformer|substation|overload/.test(q)) return gridOperations;
    if (/voltage|current|feeder|power quality|frequency/.test(q)) return gridOperations;
    if (/load|balanc|redistrib/.test(q)) return gridOperations;
    if (/live|grid status|overall|temperature|thermal/.test(q)) return gridOperations;
    if (/fault|outage|detect|alert/.test(q)) return gridOperations;
    return roleBasedAssistant;
  }

  return roleBasedAssistant;
}

export function processRequest({ role, query }) {
  const q = query.toLowerCase();
  const handler = pickAgent(role, q);
  const context = { role };
  return handler.handle(query, context).then(text => ({
    text,
    type: AGENT_TYPE_MAP[handler.name] || 'role-assistant',
    agentName: handler.name,
    id: Date.now(),
  }));
}
