// Agent 6: Demand Forecasting Agent — EB Officer & Grid Operator roles
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Demand Forecasting Agent';

const SYSTEM_PROMPT = `You are the Demand Forecasting Agent for Smart Town Energy Management System.
Answer requests for EB Officer and Grid Operator roles.
Always respond with: Forecast | Peak Hours | Confidence | Recommendation.
Use Smart Town terminology. If data is unavailable, use realistic demo values.`;

const FORECAST_DATA = {
  currentLoad: 12.4,
  hourly: [
    { hour: '00:00', load: 6.2 }, { hour: '02:00', load: 5.4 }, { hour: '04:00', load: 5.1 },
    { hour: '06:00', load: 7.8 }, { hour: '08:00', load: 10.2 }, { hour: '10:00', load: 11.8 },
    { hour: '12:00', load: 12.4 }, { hour: '14:00', load: 13.1 }, { hour: '16:00', load: 12.9 },
    { hour: '18:00', load: 13.5 }, { hour: '20:00', load: 13.8 }, { hour: '22:00', load: 10.4 },
  ],
  peakHour: '20:00',
  peakLoad: 13.8,
  daily: [
    { day: 'Mon', load: 11.2 }, { day: 'Tue', load: 11.8 }, { day: 'Wed', load: 12.1 },
    { day: 'Thu', load: 12.4 }, { day: 'Fri', load: 13.2 }, { day: 'Sat', load: 14.1 },
    { day: 'Sun', load: 13.6 },
  ],
  monthly: [
    { month: 'May', demand: 78.4 }, { month: 'Jun', demand: 84.2 },
    { month: 'Jul', demand: 89.6 }, { month: 'Aug (Predicted)', demand: 94.1 },
    { month: 'Sep (Predicted)', demand: 88.3 }, { month: 'Oct (Predicted)', demand: 79.2 },
  ],
  transformerLoad: [
    { name: 'Transformer A', current: 72, predicted: 78, zone: 'North' },
    { name: 'Transformer B', current: 91, predicted: 96, zone: 'East' },
    { name: 'Transformer C', current: 97, predicted: 102, zone: 'South' },
    { name: 'Transformer D', current: 63, predicted: 69, zone: 'West' },
  ],
  zones: [
    { name: 'Industrial East', current: 5.2, predicted: 5.6 },
    { name: 'Residential North', current: 3.8, predicted: 4.2 },
    { name: 'Commercial South', current: 2.4, predicted: 2.6 },
    { name: 'Residential West', current: 1.0, predicted: 1.1 },
  ],
};

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/hourly|today|hour/.test(q)) {
    const rows = FORECAST_DATA.hourly.map(h => `| ${h.hour} | ${h.load} MW |`).join('\n');
    return `## Forecast
Hourly demand forecast — Smart Town, Today.

| Time | Predicted Load |
|---|---|
${rows}

Peak: **${FORECAST_DATA.peakLoad} MW at ${FORECAST_DATA.peakHour}**

## Peak Hours
- **Morning Peak**: 08:00–10:00 (10.2–11.8 MW) — Residential + Commercial startup
- **Afternoon Peak**: 14:00–16:00 (12.9–13.1 MW) — Industrial + Cooling loads
- **Evening Peak**: 18:00–22:00 (13.5–13.8 MW) — Residential cooling + Lighting

## Confidence
Forecast confidence: **91%** (based on 90-day historical pattern + weather data)

## Recommendation
- Pre-position solar battery discharge for 18:00 to offset evening peak.
- Issue demand response alert to industrial consumers for 20:00 peak window.
- Ensure Transformer C load is reduced before 18:00 to handle evening surge.`;
  }

  if (/weekly|week|daily/.test(q)) {
    const rows = FORECAST_DATA.daily.map(d => `| ${d.day} | ${d.load} MW |`).join('\n');
    return `## Forecast
Weekly demand forecast — Smart Town.

| Day | Predicted Peak Load |
|---|---|
${rows}

Highest demand day: **Saturday (14.1 MW)**
Lowest demand day: **Monday (11.2 MW)**

## Peak Hours
Weekend peak demand is **26% higher** than weekday average due to residential activity.
Friday–Sunday: Elevated demand from 17:00–22:00.

## Confidence
Weekly forecast confidence: **86%**

## Recommendation
- Schedule transformer maintenance on Monday–Tuesday (lowest demand days).
- Activate demand response programs on Friday evenings and weekends.
- Ensure full transformer capacity available by Friday 16:00.`;
  }

  if (/monthly|month/.test(q)) {
    const rows = FORECAST_DATA.monthly.map(m => `| ${m.month} | ${m.demand} MWh |`).join('\n');
    return `## Forecast
Monthly demand forecast — Smart Town.

| Month | Total Demand |
|---|---|
${rows}

Peak month: **August 2026 (94.1 MWh)** — Summer cooling demand.
Demand expected to ease from October as temperatures drop.

## Peak Hours
Summer months (Jul–Sep): Evening peak 18:00–22:00 consistently above 13 MW.
Winter months (Nov–Feb): Morning peak 07:00–09:00 dominant.

## Confidence
Monthly forecast confidence: **83%** (weather-adjusted model)

## Recommendation
- Procure additional grid capacity for August peak demand.
- Plan transformer maintenance windows for October–November (demand trough).
- Negotiate peak-hour industrial tariffs to flatten August demand curve.`;
  }

  if (/peak|evening|morning/.test(q)) {
    return `## Forecast
Peak demand analysis — Smart Town.

**Today's Peak Prediction**: **${FORECAST_DATA.peakLoad} MW at ${FORECAST_DATA.peakHour}**

| Period | Time | Load | Driver |
|---|---|---|---|
| Morning Peak | 08:00–10:00 | 10.2–11.8 MW | Commercial + Industrial startup |
| Afternoon Peak | 14:00–16:00 | 12.9–13.1 MW | Industrial + AC cooling |
| Evening Peak | 18:00–22:00 | **13.5–13.8 MW** | Residential cooling + Lighting |
| Night Valley | 00:00–05:00 | 5.1–6.2 MW | Minimal load |

## Peak Hours
Critical window: **20:00 tonight** — highest predicted load of the day.
Transformer C will likely exceed safe operating limits during this window.

## Confidence
Peak prediction confidence: **89%**

## Recommendation
1. Discharge solar battery banks at 18:00 to offset 1.2 MW of evening peak.
2. Send demand response SMS to top 50 industrial consumers for voluntary load reduction.
3. Reduce Transformer C load by 15% before 17:00 to create headroom for evening peak.`;
  }

  if (/transformer|load forecast/.test(q)) {
    const rows = FORECAST_DATA.transformerLoad.map(t =>
      `| ${t.name} | ${t.zone} | ${t.current}% | ${t.predicted}% | ${t.predicted > 100 ? '🔴 Overload Risk' : t.predicted > 90 ? '🟡 Warning' : '✅ Safe'} |`
    ).join('\n');
    return `## Forecast
Transformer load forecast — Smart Town, Evening Peak (20:00).

| Transformer | Zone | Current Load | Predicted Peak | Status |
|---|---|---|---|---|
${rows}

## Peak Hours
Transformer C predicted to reach **102% load** at 20:00 — exceeds safe operating limit.
Transformer B predicted at **96%** — approaching critical threshold.

## Confidence
Transformer load forecast confidence: **88%**

## Recommendation
1. **Immediate**: Redistribute 15% load from Transformer C to Transformer D.
2. **Before 17:00**: Reduce Transformer B load by 6% to create safety margin.
3. **Monitoring**: Set 5-minute alert intervals on Transformer C from 17:00 onwards.`;
  }

  if (/zone|area|town/.test(q)) {
    const rows = FORECAST_DATA.zones.map(z =>
      `| ${z.name} | ${z.current} MW | ${z.predicted} MW | +${((z.predicted - z.current) / z.current * 100).toFixed(1)}% |`
    ).join('\n');
    return `## Forecast
Town-wide zone demand forecast — Smart Town.

| Zone | Current Load | Evening Peak Forecast | Change |
|---|---|---|---|
${rows}

Total town demand forecast: **${FORECAST_DATA.zones.reduce((s, z) => s + z.predicted, 0).toFixed(1)} MW** at evening peak.

## Peak Hours
Industrial East will remain the highest demand zone throughout the day.
Residential zones will spike sharply between 18:00–22:00.

## Confidence
Zone-level forecast confidence: **84%**

## Recommendation
- Deploy demand response in Industrial East to reduce peak by 0.4 MW.
- Issue energy conservation advisory to Residential North for evening hours.
- Monitor Commercial South for any unexpected load increases.`;
  }

  return `## Forecast
**Smart Town Demand Forecasting System** — Active.

Current Load: **${FORECAST_DATA.currentLoad} MW**
Today's Peak Prediction: **${FORECAST_DATA.peakLoad} MW at ${FORECAST_DATA.peakHour}**
This Month's Total: **89.6 MWh** | Next Month Forecast: **94.1 MWh**

## Peak Hours
Evening peak (18:00–22:00) is the critical window requiring active management.

## Confidence
Overall forecast confidence: **87%**

## Recommendation
Ask me about:
- "Predict hourly demand" | "Predict weekly demand"
- "Predict monthly demand" | "Predict peak hours"
- "Forecast transformer load" | "Forecast town energy demand"`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
