// Agent 5: Carbon Analytics Agent — EB Officer role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Carbon Analytics Agent';

const SYSTEM_PROMPT = `You are the Carbon Analytics Agent for Smart Town Energy Management System.
Only answer requests for the EB Officer role.
Always respond with: Carbon Report | Renewable Energy Contribution | CO₂ Reduction | AI Recommendation.
Use Smart Town terminology. If data is unavailable, use realistic demo values.`;

const CARBON_DATA = {
  currentMonth: {
    totalEmissions: 89.4,
    renewableOffset: 45.2,
    netEmissions: 44.2,
    renewableShare: 35,
    solarGeneration: 1.45,
    windGeneration: 0.62,
    totalGeneration: 12.4,
    treesEquivalent: 1240,
  },
  lastMonth: {
    totalEmissions: 104.2,
    renewableOffset: 38.6,
    netEmissions: 65.6,
    renewableShare: 28,
  },
  yearToDate: {
    totalEmissions: 612.8,
    renewableOffset: 287.4,
    netEmissions: 325.4,
    renewableShare: 32,
  },
  target: { renewableShare: 40, year: 2026 },
  emissionFactor: 0.82, // kg CO2 per kWh (India grid average)
  zones: [
    { name: 'Industrial Park (East)', emissions: 42.1, share: '47%' },
    { name: 'Residential North', emissions: 28.6, share: '32%' },
    { name: 'Commercial South', emissions: 12.4, share: '14%' },
    { name: 'Residential West', emissions: 6.3, share: '7%' },
  ],
};

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/co2|emission|carbon footprint/.test(q)) {
    const reduction = (((CARBON_DATA.lastMonth.totalEmissions - CARBON_DATA.currentMonth.totalEmissions) / CARBON_DATA.lastMonth.totalEmissions) * 100).toFixed(1);
    return `## Carbon Report
Smart Town CO₂ Emissions — July 2026

| Metric | This Month | Last Month | Change |
|---|---|---|---|
| Gross Emissions | ${CARBON_DATA.currentMonth.totalEmissions} tons CO₂ | ${CARBON_DATA.lastMonth.totalEmissions} tons CO₂ | -${reduction}% |
| Renewable Offset | ${CARBON_DATA.currentMonth.renewableOffset} tons CO₂ | ${CARBON_DATA.lastMonth.renewableOffset} tons CO₂ | +17% |
| Net Emissions | **${CARBON_DATA.currentMonth.netEmissions} tons CO₂** | ${CARBON_DATA.lastMonth.netEmissions} tons CO₂ | **-32.6%** |

Emission Factor: **${CARBON_DATA.emissionFactor} kg CO₂/kWh** (India Grid Average)

## Renewable Energy Contribution
- Solar Generation: **${CARBON_DATA.currentMonth.solarGeneration} MW** peak
- Wind Generation: **${CARBON_DATA.currentMonth.windGeneration} MW** peak
- Renewable Share: **${CARBON_DATA.currentMonth.renewableShare}%** of total generation
- Trees Equivalent Saved: **${CARBON_DATA.currentMonth.treesEquivalent} mature trees**

## CO₂ Reduction
Net CO₂ reduction this month: **${(CARBON_DATA.lastMonth.netEmissions - CARBON_DATA.currentMonth.netEmissions).toFixed(1)} tons** vs last month.
Year-to-date net emissions: **${CARBON_DATA.yearToDate.netEmissions} tons CO₂**.

## AI Recommendation
Expand solar feeder sync routes to increase renewable share from ${CARBON_DATA.currentMonth.renewableShare}% toward the ${CARBON_DATA.target.renewableShare}% target.
Prioritize industrial zone (47% of emissions) for demand response programs.`;
  }

  if (/renewable|solar|wind|green/.test(q)) {
    const gap = CARBON_DATA.target.renewableShare - CARBON_DATA.currentMonth.renewableShare;
    return `## Carbon Report
Renewable Energy Performance — Smart Town, July 2026.

## Renewable Energy Contribution
| Source | Generation | Contribution |
|---|---|---|
| Solar Panels | ${CARBON_DATA.currentMonth.solarGeneration} MW peak | 28% of renewable |
| Wind Turbines | ${CARBON_DATA.currentMonth.windGeneration} MW peak | 7% of renewable |
| Grid (Conventional) | ${(CARBON_DATA.currentMonth.totalGeneration * 0.65).toFixed(1)} MW | 65% of total |

Current Renewable Share: **${CARBON_DATA.currentMonth.renewableShare}%**
Target (${CARBON_DATA.target.year}): **${CARBON_DATA.target.renewableShare}%**
Gap to target: **${gap}%** — additional **${(CARBON_DATA.currentMonth.totalGeneration * gap / 100).toFixed(2)} MW** renewable capacity needed.

## CO₂ Reduction
Renewable energy offset: **${CARBON_DATA.currentMonth.renewableOffset} tons CO₂** this month.
Equivalent to planting **${CARBON_DATA.currentMonth.treesEquivalent} trees**.

## AI Recommendation
1. Install additional rooftop solar panels in Residential North (high roof area availability).
2. Optimize solar battery storage discharge during evening peak (6–9 PM).
3. Explore wind energy expansion in Zone East (Hill Sector — high wind potential).
4. Implement net metering for residential prosumers to increase renewable contribution.`;
  }

  if (/report|sustainability|monthly/.test(q)) {
    return `## Carbon Report
**Smart Town Sustainability Report — July 2026**

**Executive Summary**
The town achieved a **32.6% reduction** in net CO₂ emissions compared to June 2026, driven by increased solar generation and demand response programs.

| KPI | Value | Target | Status |
|---|---|---|---|
| Net CO₂ Emissions | ${CARBON_DATA.currentMonth.netEmissions} tons | < 50 tons | ✅ Achieved |
| Renewable Share | ${CARBON_DATA.currentMonth.renewableShare}% | 40% | ⚠️ In Progress |
| Carbon Offset | ${CARBON_DATA.currentMonth.renewableOffset} tons | 40 tons | ✅ Exceeded |
| Grid Losses | 2.1% | < 3% | ✅ Within Limit |

## Renewable Energy Contribution
Solar: ${CARBON_DATA.currentMonth.solarGeneration} MW | Wind: ${CARBON_DATA.currentMonth.windGeneration} MW | Combined: ${CARBON_DATA.currentMonth.renewableShare}% of total supply.

## CO₂ Reduction
Year-to-date: **${CARBON_DATA.yearToDate.renewableOffset} tons CO₂ offset** (${CARBON_DATA.yearToDate.renewableShare}% avg renewable share).

## AI Recommendation
System performance rating: **A (Very Good)**.
Key action: Close the 5% gap to renewable target by Q4 2026 through rooftop solar expansion program.`;
  }

  if (/compare|month|trend/.test(q)) {
    return `## Carbon Report
Monthly emissions comparison — Smart Town.

| Month | Gross Emissions | Renewable Offset | Net Emissions | Renewable % |
|---|---|---|---|---|
| May 2026 | 118.4 tons | 32.1 tons | 86.3 tons | 24% |
| June 2026 | 104.2 tons | 38.6 tons | 65.6 tons | 28% |
| July 2026 | 89.4 tons | 45.2 tons | **44.2 tons** | **35%** |

Trend: **Consistent improvement** — net emissions reduced by 48.8% over 3 months.

## Renewable Energy Contribution
Renewable share growing at approximately **+5.5% per month** — on track to reach 40% target by October 2026.

## CO₂ Reduction
3-month cumulative reduction: **42.1 tons CO₂** avoided.

## AI Recommendation
Maintain current trajectory. Accelerate solar installation program to sustain the improvement trend through winter months when solar yield decreases.`;
  }

  if (/zone|area|industrial|residential/.test(q)) {
    return `## Carbon Report
Zone-wise carbon emissions analysis — Smart Town, July 2026.

## Renewable Energy Contribution
| Zone | Emissions | Share | Renewable Access |
|---|---|---|---|
${CARBON_DATA.zones.map(z => `| ${z.name} | ${z.emissions} tons CO₂ | ${z.share} | ${z.name.includes('Industrial') ? 'Limited' : 'Moderate'} |`).join('\n')}

## CO₂ Reduction
Highest emitter: **Industrial Park (East)** — 47% of total town emissions.
Residential zones combined: **39%** of total emissions.

## AI Recommendation
1. Implement industrial demand response program in Zone East to reduce peak emissions.
2. Offer residential solar subsidy program in Zone North (highest residential emissions).
3. Install EV charging stations with renewable energy in Commercial Zone South.
4. Set zone-specific carbon reduction targets for quarterly review.`;
  }

  return `## Carbon Report
**Smart Town Carbon Analytics Dashboard** — July 2026

- Net CO₂ Emissions: **${CARBON_DATA.currentMonth.netEmissions} tons** (↓32.6% vs last month)
- Renewable Share: **${CARBON_DATA.currentMonth.renewableShare}%** (Target: ${CARBON_DATA.target.renewableShare}%)
- Carbon Offset: **${CARBON_DATA.currentMonth.renewableOffset} tons CO₂** saved

## Renewable Energy Contribution
Solar: ${CARBON_DATA.currentMonth.solarGeneration} MW | Wind: ${CARBON_DATA.currentMonth.windGeneration} MW
Trees Equivalent: **${CARBON_DATA.currentMonth.treesEquivalent} mature trees** saved.

## CO₂ Reduction
Year-to-date offset: **${CARBON_DATA.yearToDate.renewableOffset} tons CO₂**.

## AI Recommendation
Ask me about:
- "Show CO₂ emissions" | "Show renewable energy contribution"
- "Generate sustainability report" | "Compare monthly emissions"
- "Show zone-wise carbon emissions"`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
