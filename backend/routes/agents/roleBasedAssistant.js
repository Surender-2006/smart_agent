// Agent 8: Role-Based AI Assistant Agent — All roles
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Role-Based AI Assistant Agent';

const SYSTEM_PROMPT = `You are the Role-Based AI Assistant Agent for Smart Town Energy Management System.
Serve Consumer, EB Officer, and Grid Operator roles with role-appropriate responses.
Always respond with: Summary | Analysis | Recommendation | Priority | Next Action.
Use Smart Town terminology only. Never fabricate data. If unavailable, use realistic demo values.`;

const ROLE_CONTEXT = {
  consumer: {
    greeting: 'Hello! I am your Smart Town Home Energy Assistant. I can help with your electricity bills, usage analysis, appliance consumption, and energy-saving tips.',
    capabilities: [
      'What is my electricity usage today?',
      'Show my monthly electricity bill.',
      'Which appliance uses the most electricity?',
      'Give me energy-saving tips.',
      'Show my personal alerts.',
    ],
  },
  eb_officer: {
    greeting: 'Hello, EB Officer! I am the Smart Town AI Management Assistant. I provide town-wide analytics, consumer statistics, carbon reports, and IoT device status.',
    capabilities: [
      "Show today's town energy consumption.",
      'Show consumer statistics.',
      'Generate town energy report.',
      'Show carbon analytics.',
      'Show IoT device status.',
    ],
  },
  grid_operator: {
    greeting: 'Hello, Grid Operator! I am the Smart Town Grid Intelligence Assistant. I provide transformer health, voltage monitoring, load balancing, and fault detection.',
    capabilities: [
      'Check all transformers.',
      'Show voltage levels.',
      'Suggest load balancing.',
      'Show live grid status.',
      'Detect grid faults.',
    ],
  },
};

function buildDemoResponse(query, role = 'eb_officer') {
  const q = query.toLowerCase();
  const ctx = ROLE_CONTEXT[role] || ROLE_CONTEXT.eb_officer;

  // Consumer-specific responses
  if (role === 'consumer') {
    if (/bill|cost|charge/.test(q)) {
      return `## Summary
Your current electricity bill for July 2026 is **₹1,845** (248 kWh).

## Analysis
- Billing Period: 01 Jul – 31 Jul 2026
- Units Consumed: **248 kWh**
- Amount Due: **₹1,845**
- Due Date: **10 August 2026**
- Status: **Pending**
- Change vs Last Month: **+8.3%** (higher cooling loads)

## Recommendation
Pay before the due date to avoid late fees. Consider reducing AC usage during peak hours (6–9 PM) to lower next month's bill.

## Priority
🟡 **Medium** — Bill due in 10 days.

## Next Action
Ask: "How can I reduce my electricity bill?" for personalized saving tips.`;
    }

    if (/usage|consume|energy/.test(q)) {
      return `## Summary
Your electricity usage today: **8.6 kWh** (₹74.20).

## Analysis
- Today's Usage: **8.6 kWh**
- Monthly Usage (Jul): **248 kWh**
- Top Consumer: **Air Conditioner (45%)**
- Status: Within normal range.

## Recommendation
Your AC is consuming 45% of your electricity. Setting it to 24°C and using a timer can reduce consumption by 15–20%.

## Priority
🟢 **Low** — Usage within normal range.

## Next Action
Ask: "Show my appliance energy consumption" for detailed breakdown.`;
    }

    if (/alert|notification|warning/.test(q)) {
      return `## Summary
You have **1 active alert** for your Smart Town connection.

## Analysis
- ⚠️ **High Usage Alert**: Your July consumption (248 kWh) is 8.3% above June.
- ✅ **Voltage Status**: Normal (231V — stable).
- ✅ **Meter Status**: Online and transmitting.
- ℹ️ **Scheduled Maintenance**: Zone North — Tomorrow 9:00–11:00 AM.

## Recommendation
Review your evening electricity usage (6–9 PM) which is driving the consumption increase.

## Priority
🟡 **Medium** — Monitor usage to avoid higher bill next month.

## Next Action
Ask: "Give me energy-saving tips" to reduce consumption.`;
    }
  }

  // EB Officer-specific responses
  if (role === 'eb_officer') {
    if (/consumer|statistic/.test(q)) {
      return `## Summary
Smart Town has **12,850 active consumer connections** as of July 2026.

## Analysis
- Total Consumers: **12,850**
- Residential: **11,200** (87%)
- Commercial: **1,650** (13%)
- Online Smart Meters: **12,826** (99.8%)
- Offline Meters: **24** (0.2%)
- Average Monthly Bill: **₹1,845** (residential)
- Monthly Revenue: **₹23.7 Lakhs**

## Recommendation
Resolve the 24 offline smart meters to ensure accurate billing. Estimated revenue at risk: **₹1.2 Lakhs/month**.

## Priority
🟡 **Medium** — Offline meter resolution within 7 days.

## Next Action
Ask: "Show IoT device status" for detailed meter connectivity report.`;
    }

    if (/iot|device|meter|online/.test(q)) {
      return `## Summary
**12,826 of 12,850** smart meters are online (99.8% connectivity).

## Analysis
- Online Devices: **12,826**
- Offline Devices: **24** (battery drainage / hardware fault)
- Transmission Interval: **15 minutes**
- Signal Quality: **18 dB SNR** (Excellent)
- Last Sync: **2 minutes ago**

## Recommendation
Dispatch maintenance crew to replace batteries on 24 offline meters. Prioritize meters in Zone South (near Transformer C overload area).

## Priority
🟡 **Medium** — Resolve within 7 days to maintain billing accuracy.

## Next Action
Ask: "Show anomaly detection report" to check for meter tampering alerts.`;
    }

    if (/report|generate/.test(q)) {
      return `## Summary
Smart Town Monthly Operations Report — July 2026 is ready.

## Analysis
| KPI | Value | Status |
|---|---|---|
| Total Energy | 89.6 MWh | ✅ Normal |
| Renewable Share | 35% | ⚠️ Below 40% target |
| Grid Losses | 2.1% | ✅ Within limit |
| Online Meters | 99.8% | ✅ Excellent |
| CO₂ Offset | 45.2 tons | ✅ Exceeded target |
| Grid Health | 98% | ✅ Excellent |

## Recommendation
Export the monthly PDF report from the Reports page for administrative sign-off. Highlight the renewable energy gap (5%) for management attention.

## Priority
🟢 **Low** — Routine monthly reporting.

## Next Action
Navigate to the Reports page to download the full PDF/Excel report.`;
    }
  }

  // Grid Operator-specific responses
  if (role === 'grid_operator') {
    if (/transformer|health/.test(q)) {
      return `## Summary
Transformer fleet status — **1 Critical, 1 Warning, 2 Healthy**.

## Analysis
| Transformer | Load | Temp | Status |
|---|---|---|---|
| Transformer A (North) | 72% | 46°C | ✅ Healthy |
| Transformer B (East) | 91% | 65°C | ⚠️ Warning |
| Transformer C (South) | 97% | 79°C | 🔴 Critical |
| Transformer D (West) | 63% | 43°C | ✅ Healthy |

## Recommendation
Immediately redistribute 15% load from Transformer C to Transformer D. Transformer C winding temperature (79°C) is approaching thermal shutdown (85°C).

## Priority
🔴 **CRITICAL** — Immediate action required.

## Next Action
Ask: "Suggest load balancing" for detailed redistribution plan.`;
    }

    if (/voltage|current|power/.test(q)) {
      return `## Summary
Voltage monitoring — **1 critical sag detected** on Feeder FL-3.

## Analysis
| Feeder | Voltage | Status |
|---|---|---|
| FL-1 (North) | 11.0 kV | ✅ Normal |
| FL-2 (East) | 10.8 kV | ⚠️ Low |
| FL-3 (South) | 10.6 kV | 🔴 Critical |
| FL-4 (West) | 11.1 kV | ✅ Normal |

Grid Frequency: **50.02 Hz** ✅ | Power Factor: **0.94** ✅

## Recommendation
Initiate tap changer adjustment on Transformer C to restore FL-3 voltage to 11.0 kV.

## Priority
🔴 **HIGH** — Voltage sag may damage consumer equipment in Zone South.

## Next Action
Ask: "Show live grid status" for complete grid overview.`;
    }

    if (/fault|outage|detect/.test(q)) {
      return `## Summary
Grid fault detection — **1 active fault** on Transformer C feeder.

## Analysis
- Active Faults: **1** (Transformer C overload)
- Active Outages: **None**
- Overcurrent Alarm: **Phase L1, Feeder FL-3**
- Voltage Sag: **3.6%** on FL-3
- Harmonic Distortion: **2.8% THD** (within limits)

## Recommendation
Dispatch field crew to inspect Transformer C connections. Initiate load transfer to prevent thermal trip.

## Priority
🔴 **HIGH** — Fault active; risk of unplanned outage.

## Next Action
Ask: "Suggest load balancing" to resolve the overload condition.`;
    }
  }

  // Default welcome for any role
  return `## Summary
${ctx.greeting}

## Analysis
I am the Role-Based AI Assistant for Smart Town Energy Management System.
Your role: **${role.replace('_', ' ').toUpperCase()}**

## Recommendation
You can ask me:
${ctx.capabilities.map(c => `- "${c}"`).join('\n')}

## Priority
🟢 **Ready** — All systems operational.

## Next Action
Type any question above or ask me anything about Smart Town energy management.`;
}

export async function handle(query, context = {}) {
  const role = context.role || 'eb_officer';
  try {
    const llmResponse = await callLLM(
      `${SYSTEM_PROMPT}\nCurrent user role: ${role}`,
      query
    );
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query, role);
}
