// Agent 4: Predictive Maintenance Agent — Grid Operator role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Predictive Maintenance Agent';

const SYSTEM_PROMPT = `You are the Predictive Maintenance Agent for Smart Town Energy Management System.
Only answer requests for the Grid Operator role.
Always respond with: Health Score | Failure Probability | Maintenance Recommendation | Priority.
Use Smart Town terminology: Transformers, Distribution Areas, IoT Sensors.
Never access consumer personal data. If data is unavailable, use realistic demo values.`;

const MAINTENANCE_DATA = {
  transformers: [
    {
      id: 'TRF-A', name: 'Transformer A', zone: 'North',
      healthScore: 88, failureProbability: 8, temp: 46, voltage: 11.0, load: 72,
      lastMaintenance: '2026-03-15', nextScheduled: '2026-09-15',
      age: 4, oilLevel: 'Normal', insulationResistance: 'Good',
      status: 'Healthy',
    },
    {
      id: 'TRF-B', name: 'Transformer B', zone: 'East',
      healthScore: 62, failureProbability: 38, temp: 65, voltage: 10.8, load: 91,
      lastMaintenance: '2025-11-20', nextScheduled: '2026-05-20',
      age: 7, oilLevel: 'Low', insulationResistance: 'Degraded',
      status: 'Warning',
    },
    {
      id: 'TRF-C', name: 'Transformer C', zone: 'South',
      healthScore: 34, failureProbability: 84, temp: 79, voltage: 10.6, load: 97,
      lastMaintenance: '2025-08-10', nextScheduled: '2026-02-10',
      age: 11, oilLevel: 'Critical Low', insulationResistance: 'Poor',
      status: 'Critical',
    },
    {
      id: 'TRF-D', name: 'Transformer D', zone: 'West',
      healthScore: 91, failureProbability: 5, temp: 43, voltage: 11.1, load: 63,
      lastMaintenance: '2026-05-01', nextScheduled: '2026-11-01',
      age: 3, oilLevel: 'Normal', insulationResistance: 'Excellent',
      status: 'Healthy',
    },
  ],
};

function healthBar(score) {
  if (score >= 80) return '🟢 Good';
  if (score >= 60) return '🟡 Fair';
  if (score >= 40) return '🟠 Poor';
  return '🔴 Critical';
}

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/transformer c|trf-c|critical/.test(q)) {
    const t = MAINTENANCE_DATA.transformers[2];
    return `## Health Score
**${t.name} (${t.zone} Zone)** — Health Score: **${t.healthScore}/100** ${healthBar(t.healthScore)}

| Parameter | Value | Status |
|---|---|---|
| Load | ${t.load}% | 🔴 Overloaded |
| Temperature | ${t.temp}°C | 🔴 High |
| Voltage | ${t.voltage} kV | ⚠️ Low |
| Oil Level | ${t.oilLevel} | 🔴 Critical |
| Insulation | ${t.insulationResistance} | 🔴 Poor |
| Age | ${t.age} years | ⚠️ Aging |
| Last Maintenance | ${t.lastMaintenance} | 🔴 Overdue |

## Failure Probability
**${t.failureProbability}%** probability of failure within the next **72 hours**.
Thermal model predicts winding temperature will exceed 85°C safety limit by **6:45 PM today**.

## Maintenance Recommendation
1. **IMMEDIATE**: Reduce load to below 80% via load redistribution to Transformer D.
2. **Within 24 hours**: Top up transformer oil to normal level.
3. **Within 48 hours**: Inspect and replace degraded insulation windings.
4. **Within 1 week**: Full preventive maintenance overhaul — oil filtration, cooling system check, bushing inspection.
5. **Long-term**: Plan replacement within 18 months (transformer age: ${t.age} years).

## Priority
🔴 **CRITICAL** — Immediate intervention required to prevent unplanned outage in Zone South.`;
  }

  if (/all|overview|health score|summary/.test(q)) {
    const rows = MAINTENANCE_DATA.transformers.map(t =>
      `| ${t.name} | ${t.zone} | ${t.healthScore}/100 | ${t.failureProbability}% | ${t.nextScheduled} | ${healthBar(t.healthScore)} |`
    ).join('\n');
    return `## Health Score
Smart Town Transformer Fleet Health Overview:

| Transformer | Zone | Health | Failure Risk | Next Maintenance | Status |
|---|---|---|---|---|---|
${rows}

Overall Fleet Health: **69/100** — 1 Critical, 1 Warning, 2 Healthy.

## Failure Probability
- **Transformer C**: 84% failure risk — CRITICAL
- **Transformer B**: 38% failure risk — WARNING
- **Transformer A**: 8% failure risk — Healthy
- **Transformer D**: 5% failure risk — Healthy

## Maintenance Recommendation
1. Emergency maintenance on Transformer C — overdue since ${MAINTENANCE_DATA.transformers[2].lastMaintenance}.
2. Schedule Transformer B maintenance within 2 weeks — oil level low, insulation degraded.
3. Transformer A routine maintenance on schedule (${MAINTENANCE_DATA.transformers[0].nextScheduled}).
4. Transformer D in excellent condition — no action required.

## Priority
🔴 **CRITICAL** — Transformer C requires emergency maintenance immediately.
🟡 **HIGH** — Transformer B requires maintenance within 14 days.`;
  }

  if (/predict|failure|fail/.test(q)) {
    return `## Health Score
Failure prediction analysis — Smart Town transformer fleet.

## Failure Probability
| Transformer | Failure Probability | Time to Failure | Risk |
|---|---|---|---|
| Transformer C | **84%** | < 72 hours | 🔴 Critical |
| Transformer B | **38%** | 2–4 weeks | 🟡 Warning |
| Transformer A | **8%** | > 12 months | 🟢 Low |
| Transformer D | **5%** | > 18 months | 🟢 Low |

Prediction model uses: temperature trends, load history, oil degradation rate, insulation resistance, and age factor.

## Maintenance Recommendation
- Transformer C: Emergency intervention within 24 hours.
- Transformer B: Planned maintenance within 14 days.
- Transformer A & D: Continue routine monitoring.

## Priority
🔴 **CRITICAL** — Transformer C failure imminent without immediate action.`;
  }

  if (/schedule|maintenance|plan/.test(q)) {
    return `## Health Score
Maintenance schedule optimization — Smart Town Distribution Network.

## Failure Probability
Maintenance scheduling based on predictive health scores and failure probability models.

## Maintenance Recommendation
| Priority | Transformer | Action | Deadline | Estimated Duration |
|---|---|---|---|---|
| 🔴 Emergency | Transformer C | Full overhaul + oil replacement | Immediate | 8 hours |
| 🟡 Urgent | Transformer B | Oil top-up + insulation check | Within 14 days | 4 hours |
| 🟢 Routine | Transformer A | Scheduled inspection | ${MAINTENANCE_DATA.transformers[0].nextScheduled} | 2 hours |
| 🟢 Routine | Transformer D | Scheduled inspection | ${MAINTENANCE_DATA.transformers[3].nextScheduled} | 2 hours |

**Estimated maintenance cost savings** from predictive vs reactive maintenance: **₹4.2 Lakhs/year**.

## Priority
🔴 **CRITICAL** — Transformer C emergency maintenance cannot be deferred.`;
  }

  if (/temperature|thermal|heat/.test(q)) {
    return `## Health Score
Thermal analysis — Smart Town transformer monitoring.

## Failure Probability
| Transformer | Temperature | Threshold | Status | Trend |
|---|---|---|---|---|
| Transformer A | 46°C | 85°C | ✅ Normal | Stable |
| Transformer B | 65°C | 85°C | ⚠️ Elevated | Rising +0.5°C/hr |
| Transformer C | 79°C | 85°C | 🔴 Critical | Rising +2°C/hr |
| Transformer D | 43°C | 85°C | ✅ Normal | Stable |

## Maintenance Recommendation
- Transformer C will reach thermal shutdown threshold (85°C) in approximately **3 hours** at current rate.
- Activate emergency cooling fans on Transformer C immediately.
- Reduce Transformer C load by 15% to slow thermal rise.
- Inspect Transformer B cooling system — elevated temperature trend detected.

## Priority
🔴 **CRITICAL** — Transformer C thermal emergency. Activate cooling protocols now.`;
  }

  return `## Health Score
**Smart Town Predictive Maintenance System** — Fleet overview.

| Transformer | Health | Failure Risk | Status |
|---|---|---|---|
| Transformer A | 88/100 | 8% | 🟢 Healthy |
| Transformer B | 62/100 | 38% | 🟡 Warning |
| Transformer C | 34/100 | 84% | 🔴 Critical |
| Transformer D | 91/100 | 5% | 🟢 Healthy |

## Failure Probability
Overall fleet risk: **ELEVATED** — 1 critical asset requires immediate attention.

## Maintenance Recommendation
Ask me about:
- "Predict transformer failure" | "Show maintenance schedule"
- "Check Transformer C health" | "Analyze transformer temperatures"
- "Show all transformer health scores"

## Priority
🔴 **CRITICAL** — Transformer C requires emergency maintenance.`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
