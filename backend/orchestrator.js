// orchestrator.js
// Core routing logic for EcoGrid AI multi‑agent system
// Receives a request with a user role and query, forwards to the appropriate agent

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Import agent handlers
import * as energyIntelligence from './routes/agents/energyIntelligence.js';
import * as gridOperations from './routes/agents/gridOperations.js';
import * as anomalyDetection from './routes/agents/anomalyDetection.js';
import * as predictiveMaintenance from './routes/agents/predictiveMaintenance.js';
import * as carbonAnalytics from './routes/agents/carbonAnalytics.js';
import * as demandForecasting from './routes/agents/demandForecasting.js';
import * as smartDecisionSupport from './routes/agents/smartDecisionSupport.js';
import * as roleBasedAssistant from './routes/agents/roleBasedAssistant.js';

// Mapping of role → handler
const roleMap = {
  consumer: energyIntelligence,
  "grid operator": gridOperations,
  "eb officer": anomalyDetection, // also carbonAnalytics, demandForecasting, smartDecisionSupport
  // For agents that share roles, the orchestrator will decide based on a "agent" field in the payload
};

/**
 * POST /api/agent
 * Body: { role: string, agent?: string, query: string }
 */
router.post('/agent', async (req, res) => {
  const { role, agent, query } = req.body;
  if (!role || !query) {
    return res.status(400).json({ error: 'role and query are required' });
  }
  try {
    let handler;
    // Direct routing based on explicit agent name if provided
    if (agent) {
      switch (agent.toLowerCase()) {
        case 'energy intelligence':
          handler = energyIntelligence; break;
        case 'grid operations':
          handler = gridOperations; break;
        case 'anomaly detection':
          handler = anomalyDetection; break;
        case 'predictive maintenance':
          handler = predictiveMaintenance; break;
        case 'carbon analytics':
          handler = carbonAnalytics; break;
        case 'demand forecasting':
          handler = demandForecasting; break;
        case 'smart decision support':
          handler = smartDecisionSupport; break;
        case 'role based assistant':
          handler = roleBasedAssistant; break;
        default:
          return res.status(400).json({ error: `unknown agent: ${agent}` });
      }
    } else {
      // Fallback routing based on role – choose the primary agent for that role
      const key = role.toLowerCase();
      handler = roleMap[key];
      if (!handler) {
        return res.status(400).json({ error: `no default agent for role: ${role}` });
      }
    }
    const response = await handler.handle(query);
    res.json({ agent: handler.name, response });
  } catch (err) {
    console.error('Orchestrator error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

export default router;
