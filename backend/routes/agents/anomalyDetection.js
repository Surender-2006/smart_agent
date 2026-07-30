// Agent 3: Anomaly Detection Agent — EB Officer role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Anomaly Detection Agent';

const SYSTEM_PROMPT = `You are the Anomaly Detection Agent for Smart Town Energy Management System.
Only answer requests for the EB Officer role.
Always respond with: Risk Level | Confidence Score | Possible Cause | Recommended Action.
Never directly accuse consumers. Always start findings with "Possible abnormal activity detected."
Use Smart Town terminology. If data is unavailable, use realistic demo values.`;

const ANOMALY_DATA = {
  flaggedMeters: [
    { id: 'SM-1042', house: 'House #42, Zone East', issue: 'Consumption spike 340% above baseline', risk: 'High', confidence: 91 },
    { id: 'SM-2187', house: 'House #87, Zone South', issue: 'Zero consumption for 14 days despite active connection', risk: 'High', confidence: 88 },
    { id: 'SM-3301', house: 'House #101, Zone North', issue: 'Meter reading reversal detected', risk: 'Critical', confidence: 95 },
    { id: 'SM-0765', house: 'House #65, Zone West', issue: 'Irregular consumption pattern — night-time spike', risk: 'Medium', confidence: 74 },
  ],
  transformerAnomalies: [
    { id: 'TRF-C', issue: 'Thermal runaway pattern — temperature rising 2°C/hour', risk: 'Critical', confidence: 93 },
    { id: 'TRF-B', issue: 'Harmonic distortion above threshold (THD 6.2%)', risk: 'Medium', confidence: 78 },
  ],
  iotAnomalies: [
    { id: 'IOT-0024', issue: 'Smart meter offline for 72 hours — possible tampering', risk: 'High', confidence: 82 },
    { id: 'IOT-0089', issue: 'Sensor reporting impossible negative current values', risk: 'High', confidence: 89 },
  ],
};

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/theft|tamper|meter|bypass|illegal/.test(q)) {
    const critical = ANOMALY_DATA.flaggedMeters.filter(m => m.risk === 'Critical' || m.risk === 'High');
    return `## Risk Level
🔴 **CRITICAL / HIGH** — ${critical.length} meters flagged for possible abnormal activity.

## Confidence Score
| Meter ID | Location | Issue | Confidence |
|---|---|---|---|
${critical.map(m => `| ${m.id} | ${m.house} | ${m.issue} | ${m.confidence}% |`).join('\n')}

## Possible Cause
Possible abnormal activity detected:
- **${ANOMALY_DATA.flaggedMeters[2].id}** (${ANOMALY_DATA.flaggedMeters[2].house}): Meter reading reversal is a strong indicator of possible meter bypass or tampering. Confidence: **${ANOMALY_DATA.flaggedMeters[2].confidence}%**.
- **${ANOMALY_DATA.flaggedMeters[0].id}** (${ANOMALY_DATA.flaggedMeters[0].house}): Consumption 340% above baseline may indicate unauthorized connection or meter fault.
- **${ANOMALY_DATA.iotAnomalies[0].id}**: Smart meter offline 72 hours — physical inspection recommended.

## Recommended Action
1. Dispatch field inspection team to ${ANOMALY_DATA.flaggedMeters[2].house} within 24 hours.
2. Cross-verify meter readings with IoT sensor logs for ${ANOMALY_DATA.flaggedMeters[0].id}.
3. Replace offline IoT device ${ANOMALY_DATA.iotAnomalies[0].id} and audit surrounding meters.
4. File preliminary investigation report — do not take punitive action until physical verification.`;
  }

  if (/abnormal|spike|unusual|consumption/.test(q)) {
    return `## Risk Level
🟡 **MEDIUM–HIGH** — Abnormal consumption patterns detected across ${ANOMALY_DATA.flaggedMeters.length} meters.

## Confidence Score
| Meter ID | Location | Anomaly | Risk | Confidence |
|---|---|---|---|---|
${ANOMALY_DATA.flaggedMeters.map(m => `| ${m.id} | ${m.house} | ${m.issue} | ${m.risk} | ${m.confidence}% |`).join('\n')}

## Possible Cause
Possible abnormal activity detected:
- **SM-1042**: 340% consumption spike may indicate faulty meter, unauthorized load, or data transmission error.
- **SM-2187**: Zero consumption for 14 days on an active connection suggests meter bypass or vacant property with illegal connection.
- **SM-0765**: Night-time consumption spikes (11 PM–3 AM) inconsistent with residential profile.

## Recommended Action
1. Prioritize physical inspection of SM-3301 and SM-2187 within 48 hours.
2. Send automated alert to field team for SM-1042 consumption verification.
3. Review SM-0765 historical data for pattern confirmation before escalation.
4. Generate anomaly report for EB Officer review and sign-off.`;
  }

  if (/faulty|meter fault|sensor|iot/.test(q)) {
    return `## Risk Level
🟡 **HIGH** — ${ANOMALY_DATA.iotAnomalies.length} IoT devices reporting anomalous data.

## Confidence Score
| Device ID | Issue | Confidence |
|---|---|---|
${ANOMALY_DATA.iotAnomalies.map(d => `| ${d.id} | ${d.issue} | ${d.confidence}% |`).join('\n')}

## Possible Cause
Possible abnormal activity detected:
- **IOT-0024**: 72-hour offline period on a smart meter may indicate physical tampering, power disconnection, or hardware failure.
- **IOT-0089**: Negative current readings are physically impossible — sensor malfunction or data corruption confirmed.

## Recommended Action
1. Replace IOT-0089 sensor immediately — data from this device is unreliable.
2. Dispatch technician to IOT-0024 location for physical inspection within 24 hours.
3. Flag all readings from these devices as unreliable in the billing system until resolved.
4. Audit neighboring meters for cross-contamination of anomalous data.`;
  }

  if (/transformer|equipment|behavior/.test(q)) {
    return `## Risk Level
🔴 **CRITICAL** — Transformer anomalies detected requiring immediate attention.

## Confidence Score
| Transformer | Issue | Risk | Confidence |
|---|---|---|---|
${ANOMALY_DATA.transformerAnomalies.map(t => `| ${t.id} | ${t.issue} | ${t.risk} | ${t.confidence}% |`).join('\n')}

## Possible Cause
Possible abnormal activity detected:
- **TRF-C**: Thermal runaway pattern (temperature rising 2°C/hour) indicates possible cooling system failure or sustained overload condition.
- **TRF-B**: THD of 6.2% exceeds the 5% IEEE standard — possible non-linear load injection or capacitor bank failure.

## Recommended Action
1. Immediately reduce load on TRF-C and activate emergency cooling protocols.
2. Inspect TRF-B capacitor banks and harmonic filters.
3. Escalate TRF-C to Grid Operator for emergency load redistribution.
4. Schedule preventive maintenance inspection within 72 hours.`;
  }

  if (/all|overview|summary|report/.test(q)) {
    const totalAnomalies = ANOMALY_DATA.flaggedMeters.length + ANOMALY_DATA.transformerAnomalies.length + ANOMALY_DATA.iotAnomalies.length;
    return `## Risk Level
🔴 **HIGH** — ${totalAnomalies} total anomalies detected across Smart Town infrastructure.

## Confidence Score
- Meter Anomalies: **${ANOMALY_DATA.flaggedMeters.length}** flagged (avg confidence: 87%)
- Transformer Anomalies: **${ANOMALY_DATA.transformerAnomalies.length}** flagged (avg confidence: 86%)
- IoT Device Anomalies: **${ANOMALY_DATA.iotAnomalies.length}** flagged (avg confidence: 86%)

## Possible Cause
Possible abnormal activity detected across multiple systems:
- 1 Critical meter tampering indicator (SM-3301)
- 1 Critical transformer thermal anomaly (TRF-C)
- 2 High-risk consumption spikes (SM-1042, SM-2187)
- 2 IoT device failures (IOT-0024, IOT-0089)

## Recommended Action
1. **Immediate**: Inspect SM-3301 and reduce TRF-C load.
2. **24 Hours**: Field inspection of SM-1042, SM-2187, IOT-0024.
3. **48 Hours**: Replace IOT-0089; audit TRF-B harmonic filters.
4. **Weekly**: Generate full anomaly report for management review.`;
  }

  return `## Risk Level
🟡 **MONITORING ACTIVE** — Smart Town Anomaly Detection System operational.

## Confidence Score
Currently monitoring:
- **${ANOMALY_DATA.flaggedMeters.length}** meters with anomalous readings
- **${ANOMALY_DATA.transformerAnomalies.length}** transformers with abnormal behavior
- **${ANOMALY_DATA.iotAnomalies.length}** IoT devices with sensor faults

## Possible Cause
Possible abnormal activity detected — system is actively scanning all 12,850 smart meters and 4 transformers.

## Recommended Action
Ask me about:
- "Detect possible electricity theft"
- "Show abnormal consumption patterns"
- "Check faulty smart meters"
- "Detect transformer anomalies"
- "Show full anomaly report"`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
