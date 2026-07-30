// Agent 7: Smart Decision Support Agent — EB Officer role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Smart Decision Support Agent';

const SYSTEM_PROMPT = `You are the Smart Decision Support Agent for Smart Town Energy Management System.
Only answer requests for the EB Officer role.
Always respond with: Situation Summary | AI Analysis | Recommended Actions | Expected Benefits.
Use Smart Town terminology. If data is unavailable, use realistic demo values.`;

const TOWN_DATA = {
  totalLoad: 12.4,
  totalConsumers: 12850,
  onlineMeters: 12826,
  offlineMeters: 24,
  gridHealth: 98,
  renewableShare: 35,
  gridLoss: 2.1,
  transformers: [
    { name: 'Transformer A', zone: 'North', utilization: 72, status: 'Healthy' },
    { name: 'Transformer B', zone: 'East', utilization: 91, status: 'Warning' },
    { name: 'Transformer C', zone: 'South', utilization: 97, status: 'Critical' },
    { name: 'Transformer D', zone: 'West', utilization: 63, status: 'Healthy' },
  ],
  highDemandZones: [
    { zone: 'Industrial East', load: 5.2, consumers: 1650, avgLoad: 3.15 },
    { zone: 'Residential North', load: 3.8, consumers: 4200, avgLoad: 0.90 },
    { zone: 'Commercial South', load: 2.4, consumers: 3800, avgLoad: 0.63 },
    { zone: 'Residential West', load: 1.0, consumers: 3200, avgLoad: 0.31 },
  ],
  monthlyRevenue: 23.7, // Lakhs
  energySaved: 45.2, // tons CO2
};

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/town|consumption|overall|energy/.test(q)) {
    return `## Situation Summary
Smart Town energy consumption analysis — July 2026.
Total active load: **${TOWN_DATA.totalLoad} MW** | Grid health: **${TOWN_DATA.gridHealth}%** | Consumers: **${TOWN_DATA.totalConsumers.toLocaleString()}**

## AI Analysis
| Zone | Load | Consumers | Avg Load/Consumer |
|---|---|---|---|
${TOWN_DATA.highDemandZones.map(z => `| ${z.zone} | ${z.load} MW | ${z.consumers.toLocaleString()} | ${z.avgLoad} kW |`).join('\n')}

Key findings:
- Industrial East accounts for **42%** of total town load with only **13%** of consumers.
- Residential North shows elevated per-consumer load (0.90 kW avg) — summer cooling effect.
- Grid losses at **${TOWN_DATA.gridLoss}%** — within acceptable limits (< 3%).
- Renewable contribution: **${TOWN_DATA.renewableShare}%** — 5% below annual target.

## Recommended Actions
1. Implement time-of-use tariffs for industrial consumers to shift load off-peak.
2. Launch residential energy efficiency program in Zone North.
3. Expand solar capacity by 0.8 MW to close renewable gap.
4. Investigate the 24 offline smart meters for billing accuracy.

## Expected Benefits
- Load shift: Reduce peak demand by **8–12%** (1.0–1.5 MW).
- Revenue protection: Recover estimated **₹1.2 Lakhs/month** from offline meter resolution.
- Renewable target: Achieve 40% renewable share by Q4 2026.`;
  }

  if (/transformer|utilization|maintenance priority/.test(q)) {
    return `## Situation Summary
Transformer utilization analysis — Smart Town Distribution Network.

## AI Analysis
| Transformer | Zone | Utilization | Status | Action Required |
|---|---|---|---|---|
${TOWN_DATA.transformers.map(t => `| ${t.name} | ${t.zone} | ${t.utilization}% | ${t.status} | ${t.status === 'Critical' ? '🔴 Emergency' : t.status === 'Warning' ? '🟡 Urgent' : '✅ Routine'} |`).join('\n')}

Critical finding: **Transformer C (97% utilization)** is at immediate risk of failure.
Transformer B (91%) is approaching critical threshold — requires attention within 14 days.

## Recommended Actions
1. **Emergency**: Redistribute 15% load from Transformer C to Transformer D immediately.
2. **Urgent**: Schedule Transformer B maintenance within 14 days.
3. **Planning**: Evaluate capacity expansion for Zone South (Transformer C area) — demand growing 8% annually.
4. **Routine**: Continue monitoring Transformer A and D on standard schedule.

## Expected Benefits
- Prevent unplanned outage affecting **3,800 consumers** in Zone South.
- Extend Transformer C lifespan by **3–5 years** with proper load management.
- Reduce emergency maintenance costs by **₹8–12 Lakhs** vs reactive repair.`;
  }

  if (/load redistrib|balance|optimization/.test(q)) {
    return `## Situation Summary
Load redistribution analysis — Smart Town grid optimization.

## AI Analysis
Current load imbalance across distribution network:
- Transformer C: **97%** (overloaded) — Zone South
- Transformer D: **63%** (underutilized) — Zone West
- Imbalance factor: **34%** — significant optimization opportunity.

Recommended redistribution:
| From | To | Transfer | New Load (From) | New Load (To) |
|---|---|---|---|---|
| Transformer C | Transformer D | 15% (290 kW) | 82% | 78% |
| Transformer B | Transformer A | 6% (60 kW) | 85% | 75% |

## Recommended Actions
1. Execute load transfer from Transformer C to Transformer D via feeder switching.
2. Notify Grid Operator to implement redistribution before 17:00 today.
3. Update load balancing algorithm to prevent recurrence.
4. Install additional feeder tie switches between Zone South and Zone West.

## Expected Benefits
- Eliminate critical overload risk on Transformer C.
- Reduce transformer failure probability from 84% to < 20%.
- Improve overall grid efficiency by **12%**.
- Prevent potential outage affecting **3,800 consumers**.`;
  }

  if (/high.demand|demand area|zone/.test(q)) {
    return `## Situation Summary
High-demand area identification — Smart Town.

## AI Analysis
Demand hotspot analysis:

| Rank | Zone | Load | Growth Rate | Risk |
|---|---|---|---|---|
| 1 | Industrial East | 5.2 MW | +6.2%/yr | 🟡 Medium |
| 2 | Residential North | 3.8 MW | +8.1%/yr | 🔴 High |
| 3 | Commercial South | 2.4 MW | +4.3%/yr | 🟢 Low |
| 4 | Residential West | 1.0 MW | +3.1%/yr | 🟢 Low |

Residential North is the fastest-growing demand zone — driven by new housing developments and summer cooling loads.

## Recommended Actions
1. Prioritize grid capacity expansion in Residential North (8.1% annual growth).
2. Implement demand response program for Industrial East (largest absolute load).
3. Plan new transformer installation in Zone North within 18 months.
4. Offer solar subsidy program to Residential North consumers.

## Expected Benefits
- Prevent capacity shortage in Zone North within 2 years.
- Reduce Industrial East peak demand by 10% through demand response.
- Improve grid reliability for fastest-growing residential area.`;
  }

  if (/resource|allocat|budget/.test(q)) {
    return `## Situation Summary
Resource allocation recommendations — Smart Town Energy Management.

## AI Analysis
Current resource utilization and gaps:

| Resource | Current Status | Gap | Priority |
|---|---|---|---|
| Transformer C Maintenance | Overdue | Emergency | 🔴 Critical |
| Transformer B Maintenance | Due in 2 weeks | Urgent | 🟡 High |
| Solar Capacity | 35% renewable | 5% below target | 🟡 Medium |
| Smart Meter Replacement | 24 offline | Billing risk | 🟡 Medium |
| Zone North Capacity | Near limit | 18-month horizon | 🟢 Planning |

## Recommended Actions
1. **Immediate Budget**: Allocate emergency maintenance funds for Transformer C (est. ₹3.5 Lakhs).
2. **Q3 Budget**: Schedule Transformer B maintenance (est. ₹1.8 Lakhs).
3. **Q4 Budget**: Procure 24 replacement smart meters (est. ₹0.6 Lakhs).
4. **Annual Plan**: Solar capacity expansion — 0.8 MW addition (est. ₹45 Lakhs, 4-year ROI).

## Expected Benefits
- Emergency maintenance ROI: Prevents ₹15–25 Lakh outage cost.
- Smart meter replacement: Recovers ₹1.2 Lakh/month in billing accuracy.
- Solar expansion: Saves ₹8.4 Lakhs/year in grid purchase costs.`;
  }

  if (/report|recommendation|operational/.test(q)) {
    return `## Situation Summary
AI-based operational recommendations — Smart Town, July 2026.

## AI Analysis
**Overall System Status**: 🟡 Requires Attention
- Grid Health: ${TOWN_DATA.gridHealth}% ✅
- Critical Assets: 1 (Transformer C) 🔴
- Warning Assets: 1 (Transformer B) 🟡
- Offline Meters: ${TOWN_DATA.offlineMeters} 🟡
- Renewable Gap: 5% below target 🟡

## Recommended Actions
**Priority 1 — Immediate**:
- Emergency load redistribution on Transformer C.

**Priority 2 — This Week**:
- Replace 24 offline smart meters.
- Issue demand response advisory to Industrial East.

**Priority 3 — This Month**:
- Schedule Transformer B maintenance.
- Launch residential energy efficiency campaign in Zone North.

**Priority 4 — This Quarter**:
- Initiate solar capacity expansion tender.
- Review and update load balancing algorithms.

## Expected Benefits
Implementing all recommendations:
- Prevent 1 major outage (saves ₹15–25 Lakhs).
- Recover ₹1.2 Lakhs/month in billing.
- Reduce peak demand by 10–15%.
- Achieve 40% renewable target by Q4 2026.`;
  }

  return `## Situation Summary
**Smart Town AI Decision Support System** — Active.
Town Load: **${TOWN_DATA.totalLoad} MW** | Consumers: **${TOWN_DATA.totalConsumers.toLocaleString()}** | Grid Health: **${TOWN_DATA.gridHealth}%**

## AI Analysis
Current priorities:
1. 🔴 Transformer C overload — emergency action required.
2. 🟡 Transformer B approaching warning threshold.
3. 🟡 24 smart meters offline — billing impact.
4. 🟡 Renewable share 5% below annual target.

## Recommended Actions
Ask me about:
- "Analyze town energy consumption" | "Show transformer utilization"
- "Recommend load redistribution" | "Identify high-demand areas"
- "Recommend resource allocation" | "Generate operational recommendations"

## Expected Benefits
Proactive management can prevent outages and save **₹20–30 Lakhs** annually.`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
