// Agent 2: Grid Operations Intelligence Agent — Grid Operator role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Grid Operations Intelligence Agent';

const SYSTEM_PROMPT = `You are the Grid Operations Intelligence Agent for Smart Town Energy Management System.
Only answer requests for the Grid Operator role.
Always respond with: Grid Status | Transformer Health | Issues Detected | AI Recommendation | Priority Level.
Use Smart Town terminology: Transformers, Feeders, Distribution Areas, IoT Sensors.
Never access consumer personal data. If data is unavailable, use realistic demo values.`;

const GRID_DATA = {
  transformers: [
    { id: 'TRF-A', name: 'Transformer A', zone: 'North', load: 72, temp: 46, voltage: 11.0, current: 320, status: 'Healthy' },
    { id: 'TRF-B', name: 'Transformer B', zone: 'East', load: 91, temp: 65, voltage: 10.8, current: 410, status: 'Warning' },
    { id: 'TRF-C', name: 'Transformer C', zone: 'South', load: 97, temp: 79, voltage: 10.6, current: 445, status: 'Critical' },
    { id: 'TRF-D', name: 'Transformer D', zone: 'West', load: 63, temp: 43, voltage: 11.1, current: 285, status: 'Healthy' },
  ],
  feeders: [
    { id: 'FL-1', transformer: 'TRF-A', voltage: 11.0, status: 'Normal' },
    { id: 'FL-2', transformer: 'TRF-B', voltage: 10.8, status: 'Warning' },
    { id: 'FL-3', transformer: 'TRF-C', voltage: 10.6, status: 'Critical' },
    { id: 'FL-4', transformer: 'TRF-D', voltage: 11.1, status: 'Normal' },
  ],
  gridHealth: 98,
  frequency: 50.02,
  totalLoad: 12.4,
  peakLoad: 13.8,
};

function transformerTable() {
  return GRID_DATA.transformers.map(t =>
    `| ${t.name} | ${t.zone} | ${t.load}% | ${t.temp}°C | ${t.voltage} kV | ${t.status} |`
  ).join('\n');
}

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/transformer|substation/.test(q)) {
    const critical = GRID_DATA.transformers.filter(t => t.status === 'Critical');
    const warning = GRID_DATA.transformers.filter(t => t.status === 'Warning');
    return `## Grid Status
Grid Health Index: **${GRID_DATA.gridHealth}%** | Frequency: **${GRID_DATA.frequency} Hz** | Total Load: **${GRID_DATA.totalLoad} MW**

## Transformer Health
| Transformer | Zone | Load | Temp | Voltage | Status |
|---|---|---|---|---|---|
${transformerTable()}

## Issues Detected
${critical.map(t => `- 🔴 **${t.name}** (${t.zone}): CRITICAL — ${t.load}% load, ${t.temp}°C`).join('\n')}
${warning.map(t => `- 🟡 **${t.name}** (${t.zone}): WARNING — ${t.load}% load, ${t.temp}°C`).join('\n')}

## AI Recommendation
Immediately redistribute **15% load** from Transformer C to Transformer D.
Transformer C winding temperature (${critical[0]?.temp}°C) is approaching thermal shutdown threshold (85°C).

## Priority Level
🔴 **CRITICAL** — Immediate action required on Transformer C.`;
  }

  if (/voltage|fluctuation|sag/.test(q)) {
    return `## Grid Status
Voltage monitoring across all distribution feeders — Smart Town Grid.

## Transformer Health
| Feeder | Transformer | Voltage | Status |
|---|---|---|---|
| FL-1 | Transformer A | 11.0 kV | ✅ Normal |
| FL-2 | Transformer B | 10.8 kV | ⚠️ Warning |
| FL-3 | Transformer C | 10.6 kV | 🔴 Critical |
| FL-4 | Transformer D | 11.1 kV | ✅ Normal |

## Issues Detected
- Feeder FL-3 (Transformer C): **3.6% voltage sag** detected.
- Feeder FL-2 (Transformer B): **1.8% voltage sag** — monitor closely.
- Phase L1 overcurrent alarm active on Feeder FL-3.

## AI Recommendation
Initiate tap changer adjustment on Transformer C to restore voltage to 11.0 kV.
Consider reactive power compensation (capacitor bank) on Feeder FL-2.

## Priority Level
🔴 **HIGH** — Voltage sag on FL-3 may cause equipment damage in Zone South.`;
  }

  if (/load|balanc|redistrib/.test(q)) {
    return `## Grid Status
Load distribution analysis — Smart Town Distribution Network.

## Transformer Health
| Transformer | Current Load | Recommended Load | Action |
|---|---|---|---|
| Transformer A | 72% | 75% | Accept +3% |
| Transformer B | 91% | 85% | Shed 6% |
| Transformer C | 97% | 82% | Shed 15% |
| Transformer D | 63% | 78% | Accept +15% |

## Issues Detected
- Transformer C is **overloaded at 97%** — thermal risk imminent.
- Transformer B approaching warning threshold at **91%**.

## AI Recommendation
**Immediate Action**: Transfer **290 kW (15%)** from Transformer C → Transformer D.
**Secondary Action**: Transfer **60 kW (6%)** from Transformer B → Transformer A.
This will bring all transformers within safe operating range (60–85%).

## Priority Level
🔴 **CRITICAL** — Execute load transfer within 30 minutes to prevent outage.`;
  }

  if (/feeder|status/.test(q)) {
    return `## Grid Status
Feeder line status — Smart Town Distribution Network.

## Transformer Health
All 4 primary feeders monitored via IoT sensors.

## Issues Detected
| Feeder | Zone | Voltage | Current | Status |
|---|---|---|---|---|
| FL-1 | North | 11.0 kV | 320 A | ✅ Normal |
| FL-2 | East | 10.8 kV | 410 A | ⚠️ Warning |
| FL-3 | South | 10.6 kV | 445 A | 🔴 Critical |
| FL-4 | West | 11.1 kV | 285 A | ✅ Normal |

## AI Recommendation
Feeder FL-3 requires immediate attention. Dispatch field crew to inspect Transformer C connections.
Feeder FL-2 should be monitored every 15 minutes until load is reduced.

## Priority Level
🔴 **HIGH** — FL-3 critical; FL-2 elevated monitoring required.`;
  }

  if (/live|grid status|overall/.test(q)) {
    return `## Grid Status
**Live Smart Town Grid Status** — ${new Date().toLocaleString()}

- Grid Health Index: **${GRID_DATA.gridHealth}%**
- Total Active Load: **${GRID_DATA.totalLoad} MW**
- Grid Frequency: **${GRID_DATA.frequency} Hz** (Nominal: 50 Hz)
- Active Outages: **None**
- Emergency Alerts: **1 Overload Warning (Transformer C)**

## Transformer Health
${GRID_DATA.transformers.map(t => `- ${t.status === 'Critical' ? '🔴' : t.status === 'Warning' ? '🟡' : '✅'} **${t.name}**: ${t.load}% load, ${t.temp}°C`).join('\n')}

## Issues Detected
- Transformer C: Critical overload (97%, 79°C)
- Transformer B: Elevated load (91%, 65°C)

## AI Recommendation
Prepare solar battery bank discharge at 6:30 PM to offset evening residential peak.
Monitor Transformer C every 5 minutes until load is redistributed.

## Priority Level
🟡 **HIGH** — Grid stable overall; localized critical alert on Transformer C.`;
  }

  if (/power quality|current|frequency/.test(q)) {
    return `## Grid Status
Power quality metrics — Smart Town Distribution Network.

## Transformer Health
| Parameter | Value | Standard | Status |
|---|---|---|---|
| Grid Frequency | 50.02 Hz | 50 ± 0.5 Hz | ✅ Normal |
| Voltage (TRF-A) | 11.0 kV | 11 ± 0.5 kV | ✅ Normal |
| Voltage (TRF-C) | 10.6 kV | 11 ± 0.5 kV | ⚠️ Low |
| THD (Harmonics) | 2.8% | < 5% | ✅ Normal |
| Power Factor | 0.94 | > 0.90 | ✅ Normal |

## Issues Detected
- Voltage on Transformer C feeder is below nominal by 3.6%.
- No harmonic distortion issues detected.

## AI Recommendation
Install power factor correction capacitors on Feeder FL-3 to improve voltage stability.

## Priority Level
🟡 **MEDIUM** — Power quality acceptable except for FL-3 voltage sag.`;
  }

  return `## Grid Status
**Smart Town Grid Operations Dashboard** — All systems monitored.
Grid Health: **${GRID_DATA.gridHealth}%** | Load: **${GRID_DATA.totalLoad} MW** | Frequency: **${GRID_DATA.frequency} Hz**

## Transformer Health
${GRID_DATA.transformers.map(t => `- ${t.status === 'Critical' ? '🔴' : t.status === 'Warning' ? '🟡' : '✅'} **${t.name}** (${t.zone}): ${t.load}% load, ${t.temp}°C`).join('\n')}

## Issues Detected
- 🔴 Transformer C: Critical overload — immediate action required.
- 🟡 Transformer B: Warning — elevated load monitoring active.

## AI Recommendation
You can ask me:
- "Check all transformers" | "Show voltage fluctuations"
- "Suggest load balancing" | "Show feeder status"
- "Show live grid status" | "Check power quality"

## Priority Level
🔴 **CRITICAL** — Transformer C requires immediate load redistribution.`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
