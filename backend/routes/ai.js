import { Router } from 'express';

const router = Router();

router.post('/chat', (req, res) => {
  const { message } = req.body;
  const role = req.body.role || 'eb_officer';

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const lowerInput = message.toLowerCase();
  let responseText = '';
  let agentType = 'orchestrator';

  // ----------------------------------------------------
  // ROLE 1: CONSUMER - RESTRICTED PERSONAL DATA ONLY
  // ----------------------------------------------------
  if (role === 'consumer') {
    // Check if trying to access town-wide or operator/officer information
    const isProhibited = 
      /\b(town|city|substation|feeder|admin)\b/.test(lowerInput) || 
      lowerInput.includes('all houses') || 
      lowerInput.includes('all consumers') || 
      lowerInput.includes('all transformers') || 
      lowerInput.includes('transformer a') || 
      lowerInput.includes('transformer b') || 
      lowerInput.includes('transformer c') || 
      lowerInput.includes('transformer d') || 
      lowerInput.includes('grid statistics') || 
      lowerInput.includes('internal eb') || 
      lowerInput.includes('high-usage houses') ||
      lowerInput.includes('other houses') ||
      lowerInput.includes('other consumers');

    if (isProhibited) {
      responseText = `## Access Restricted

You are logged in as a **Consumer**.

You can access only your own electricity usage, bills, appliance analysis, and personal energy insights.

Town-wide statistics, transformer information, EB operational data, and other consumers' information are restricted.`;
      agentType = 'orchestrator';
    } 
    // Personal connection usage
    else if (lowerInput.includes('usage today') || lowerInput.includes('consume today') || lowerInput.includes('current usage')) {
      responseText = `## Today's Electricity Usage

**Today's Consumption**

* **8.6 kWh**

**Current Status**

* Your electricity usage is within the normal range.
* Approximately **62%** of today's average household consumption has been reached.

**Usage Breakdown**

* Air Conditioner: **3.4 kWh**
* Fan: **1.5 kWh**
* Lighting: **1.2 kWh**
* Refrigerator: **1.0 kWh**
* Other Appliances: **1.5 kWh**

**Estimated Cost Today**

* **₹74.20**

**AI Insight**
Your highest electricity consumption today is from the Air Conditioner. If you increase the AC temperature by 1–2°C or reduce usage during peak hours, you can save additional energy.`;
      agentType = 'energy';
    }
    // Monthly bill / Show my monthly electricity bill
    else if (lowerInput.includes('bill') || lowerInput.includes('charges') || lowerInput.includes('cost')) {
      responseText = `## Monthly Electricity Bill

Current Bill

* ₹1,845

Units Consumed

* 248 kWh

Billing Period

* 01 July – 31 July

Due Date

* 10 August

Payment Status

* Pending

AI Insight
Your bill is approximately 8% higher than last month due to increased evening electricity usage.`;
      agentType = 'energy';
    }
    // How much electricity did I consume this month?
    else if (lowerInput.includes('consume this month') || lowerInput.includes('monthly electricity') || lowerInput.includes('this month\'s usage')) {
      responseText = `## Monthly Electricity Bill

Current Bill

* ₹1,845

Units Consumed

* 248 kWh

Billing Period

* 01 July – 31 July

Due Date

* 10 August

Payment Status

* Pending

AI Insight
Your bill is approximately 8% higher than last month due to increased evening electricity usage.`;
      agentType = 'energy';
    }
    // How can I reduce my electricity bill? / Personalized energy-saving tips
    else if (lowerInput.includes('reduce') || lowerInput.includes('saving tips') || lowerInput.includes('tips')) {
      responseText = `## Energy Saving Recommendations

Based on your recent usage:

* Reduce AC usage during peak hours.
* Switch off unused lights and fans.
* Use LED lighting.
* Avoid leaving appliances on standby.
* Schedule heavy appliances during off-peak hours.

Estimated Monthly Savings

* ₹250–₹450`;
      agentType = 'carbon';
    }
    // Show my appliance energy consumption / Which appliance uses the most electricity?
    else if (lowerInput.includes('appliance') || lowerInput.includes('ac') || lowerInput.includes('refrigerator') || lowerInput.includes('tv') || lowerInput.includes('highest consuming') || lowerInput.includes('most energy')) {
      responseText = `## Appliance Energy Analysis

Highest Consumption

* Air Conditioner

Energy Used

* 112 kWh

Share of Total Usage

* 45%

Second Highest

* Water Heater

Recommendation
The Air Conditioner is your largest energy consumer. Using Energy Saver mode or setting the temperature to 24–26°C can help reduce electricity consumption.`;
      agentType = 'energy';
    }
    // Is there a scheduled power outage in my area?
    else if (lowerInput.includes('outage') || lowerInput.includes('load shedding') || lowerInput.includes('power cut')) {
      responseText = `## Outage & Maintenance Status

**Status**

* No active unscheduled outages.
* Scheduled maintenance tomorrow from 9:00 AM to 11:00 AM in Zone North.

**AI Insight**
Pre-charge backup systems and avoid scheduled runs of heavy appliances like washing machines during the outage window.`;
      agentType = 'fault';
    }
    // Is my home receiving normal voltage?
    else if (lowerInput.includes('voltage') || lowerInput.includes('voltage level')) {
      responseText = `## Voltage Stability Check

**Live Reading**

* **231V** (Within safety limits)

**Status**

* Normal and stable incoming line voltage.

**AI Insight**
Your connection reports stable phase levels with no transient voltage dips or grid frequency anomalies today.`;
      agentType = 'fault';
    }
    // Show my previous bills / Download my electricity bill
    else if (lowerInput.includes('previous bills') || lowerInput.includes('download')) {
      responseText = `## Billing History & Invoice Downloads

**Invoice Available**

* July 2026 Invoice (₹1,470.00) - Paid

**Past Records**

* June 2026: 230 kWh (₹1,380.00) - Paid
* May 2026: 210 kWh (₹1,260.00) - Paid

**AI Recommendation**
Use the "Download Bill (PDF)" button in the bill card widget to download your full statement for the current period.`;
      agentType = 'orchestrator';
    }
    // Fallback for Consumer
    else {
      responseText = `## Home Energy Coach Assistant

**Available Commands**

You can ask me questions about your personal electricity account:
* "What is my electricity usage today?"
* "Show my monthly electricity bill."
* "How can I reduce my electricity bill?"
* "Which appliance consumes the most electricity?"
* "Is there a scheduled power outage in my area?"
* "Is my home receiving normal voltage?"

**AI Recommendation**
Enter any of the prompts above to inspect your consumption patterns, load analysis, or billing stats directly.`;
      agentType = 'orchestrator';
    }
  }

  // ----------------------------------------------------
  // ROLE 2: EB OFFICER - TOWN MANAGEMENT & ADMINISTRATION
  // ----------------------------------------------------
  else if (role === 'eb_officer') {
    // Intercept operational questions
    const isOperationalQuery = 
      lowerInput.includes('transformer a') || 
      lowerInput.includes('transformer b') || 
      lowerInput.includes('transformer c') || 
      lowerInput.includes('transformer d') || 
      lowerInput.includes('voltage fluctuation') || 
      lowerInput.includes('current imbalance') || 
      lowerInput.includes('load balancing') || 
      lowerInput.includes('redistribution') || 
      lowerInput.includes('feeder status') || 
      lowerInput.includes('grid frequency') || 
      lowerInput.includes('balancing suggestions') ||
      lowerInput.includes('redistribute');

    if (isOperationalQuery) {
      responseText = `## Restricted Access: Operational Telemetry

**Summary**
Your request regarding physical transformer loading details or load balancing controls has been redirected.

**Detailed Explanation**
As an Electricity Board Officer, your role focuses on administrative management, consumer billing administration, sustainability scoring, carbon auditing, and town-wide reports. Physical grid balancing operations, real-time breaker trips, transformer cooling parameters, and live distribution line adjustments are restricted to the Grid Operator's command desk.

**Current Status**
Active Administrative Session. Overall grid telemetry: Stable.

**AI Recommendation**
Refer to the Grid Operations control desk or Grid Operator role for transformer load shifting and electrical stabilization controls.

**Priority Level**: Medium

**Suggested Next Action**: Request general town management details by asking: "Show today's town energy consumption."`;
      agentType = 'orchestrator';
    } 
    // Show today's town energy consumption
    else if (lowerInput.includes('town energy') || lowerInput.includes('town consumption') || lowerInput.includes('overall town')) {
      responseText = `## Town-Wide Energy Consumption Audit

**Summary**
The municipal grid's cumulative energy consumption is at 12.4 MWh today, within optimal thresholds.

**Detailed Explanation**
Aggregate town demand peaked at 3.5 MW at 2:15 PM. Solar generation provided a strong peak offset, keeping primary coal grid draws lower than forecast. Overall network health remains at 98.5%.

**Current Status**
Live Grid Load: 3.24 MW. Sustainable energy contribution is at 35%.

**AI Recommendation**
Review time-of-use adjustments to industrial sectors during high tariff slots to optimize energy bills.

**Priority Level**: Low

**Suggested Next Action**: Identify areas with high energy consumption by asking: "Which zone has the highest electricity usage?"`;
      agentType = 'energy';
    }
    // Which zone has the highest electricity usage?
    else if (lowerInput.includes('zone') || lowerInput.includes('area') || lowerInput.includes('highest electricity') || lowerInput.includes('high usage')) {
      responseText = `## Zone-Wise Consumption Analysis

**Summary**
The Industrial Park accounts for the highest active load (5.2 MW), followed by Residential Zone North (3.8 MW).

**Detailed Explanation**
Zone breakdowns:
- **Industrial Park (Zone East)**: 5.2 MW (Heavy machinery, flat daytime draw)
- **Residential Zone North**: 3.8 MW (High peak spike between 6:00 PM and 9:00 PM due to cooling loads)
- **Commercial District (Zone South)**: 2.4 MW (HVAC and retail lighting draws)

**Current Status**
Zone North is experiencing high transient loading.

**AI Recommendation**
Apply residential demand response guidelines to Zone North to shave 10% off the evening peak.

**Priority Level**: Medium

**Suggested Next Action**: Check IoT device connectivity in Zone North by asking: "Show IoT device status."`;
      agentType = 'energy';
    }
    // Generate town report / Generate today's town report / Generate management reports
    else if (lowerInput.includes('report') || lowerInput.includes('excel') || lowerInput.includes('pdf')) {
      responseText = `## Town Grid Operations Report

**Summary**
Grid optimization reports are compiled and ready for PDF/Excel export.

**Detailed Explanation**
Summary of July 2026 performance indicators:
- **Total Energy Transmitted**: 78.4 MWh
- **Renewable Energy Offset Ratio**: 35%
- **Active IoT Smart Meters**: 12,850 online (99.8%)
- **Identified Grid Losses**: 2.1% (Standard limits: <3.0%)
- **Carbon Emissions Avoided**: 45.2 Tons CO₂

**Current Status**
System performance rating: **A+ (Excellent)**.

**AI Recommendation**
Generate and export the monthly PDF compliance report from the Reports page for administrative sign-off.

**Priority Level**: Low

**Suggested Next Action**: View carbon offset trends by asking: "Show carbon reduction statistics."`;
      agentType = 'orchestrator';
    }
    // Show consumer statistics
    else if (lowerInput.includes('consumer')) {
      responseText = `## Active Consumer Connection Summary

**Summary**
Total active municipal consumers stand at 12,850, consisting of 11,200 residential and 1,650 commercial nodes.

**Detailed Explanation**
Daily telemetry audits show 99.8% of smart meters are sync-transmitting. The average household load sits at 1.8 kW, and total monthly billing revenue is projected to grow by 4.2% due to summer cooling demands.

**Current Status**
Active connections: 12,850 online. Under-billing alarms: 0 active.

**AI Recommendation**
Issue energy-saving tips to the top 5% highest energy consuming households to promote sustainability targets.

**Priority Level**: Low

**Suggested Next Action**: Request smart meter hardware details by asking: "Show IoT device status."`;
      agentType = 'orchestrator';
    }
    // Show carbon reduction statistics / Show carbon reduction statistics
    else if (lowerInput.includes('carbon') || lowerInput.includes('sustainability') || lowerInput.includes('green energy')) {
      responseText = `## Carbon Analytics & Green Energy Yield

**Summary**
Carbon offset metrics show 45.2 Tons of CO₂ saved this month, representing a 14% improvement.

**Detailed Explanation**
The town's solar park has delivered a cumulative peak yield of 1.45 MW today. This offset has saved the equivalent of 1,240 mature trees in emissions offset. Renewable sources contributed to 35% of the town's total energy footprint.

**Current Status**
Green Energy Ratio: 35% (Target: 40% by end of year).

**AI Recommendation**
Expand solar feeder sync routes during high yield cycles to charge substation battery storages.

**Priority Level**: Low

**Suggested Next Action**: Request online smart meter status by asking: "Show IoT device status."`;
      agentType = 'carbon';
    }
    // Show IoT device status / Show all online IoT devices
    else if (lowerInput.includes('iot') || lowerInput.includes('devices') || lowerInput.includes('online')) {
      responseText = `## Smart IoT Device Status Summary

**Summary**
12,850 smart meters are communicating online, representing a 99.8% device connectivity rate.

**Detailed Explanation**
IoT performance status:
- **Online Devices**: 12,850 Smart Meters
- **Offline Devices**: 24 Smart Meters (primarily localized battery drainage issues)
- **Active Transmission Rate**: 15-minute telemetry intervals
- **Signal Quality (SNR)**: Average 18 dB (Excellent)

**Current Status**
Smart telemetry network is fully operational.

**AI Recommendation**
Dispatch maintenance crew to replace batteries on the 24 offline smart meters during the next zone visit.

**Priority Level**: Low

**Suggested Next Action**: Review town energy statistics by asking: "Show today's town energy consumption."`;
      agentType = 'orchestrator';
    }
    // Fallback for EB Officer
    else {
      responseText = `## AI Town Energy Management Agent (TEMA)

**Summary**
Hello, EB Officer! I am the AI Town Energy Management Agent (TEMA). I provide municipal-level analytics, billing reports, and IoT audits.

**Detailed Explanation**
I have access to the entire town's administrative dataset. You can ask me:
- "Show today's town energy consumption."
- "Which zone has the highest electricity usage?"
- "Show consumer statistics."
- "Show IoT device status."
- "Show carbon reduction statistics."
- "Generate management reports."

**Current Status**
Officer authorization active. All administrative views accessible.

**AI Recommendation**
Generate the monthly Sustainability PDF report to verify solar contribution trends.

**Priority Level**: Low

**Suggested Next Action**: Ask: "Show carbon reduction statistics" to review green offsets.`;
      agentType = 'orchestrator';
    }
  }

  // ----------------------------------------------------
  // ROLE 3: GRID OPERATOR - LIVE GRID OPERATIONS
  // ----------------------------------------------------
  else if (role === 'grid_operator') {
    // Intercept administrative questions
    const isAdminQuery = 
      lowerInput.includes('consumer statistics') || 
      lowerInput.includes('customer statistics') || 
      lowerInput.includes('billing') || 
      lowerInput.includes('bill history') || 
      lowerInput.includes('carbon reduction') || 
      lowerInput.includes('sustainability report') || 
      lowerInput.includes('carbon emission') || 
      lowerInput.includes('management reports') ||
      lowerInput.includes('revenue') ||
      lowerInput.includes('cost savings');

    if (isAdminQuery) {
      responseText = `## Restricted Access: Administrative Analytics

**Summary**
Your request regarding consumer billing accounts, financial reports, or carbon emission metrics has been redirected.

**Detailed Explanation**
As a Grid Operator, your role focuses on real-time grid operations, live transformer utilization, fault detection, and load balancing dispatches. Consumer records, monthly billing statistics, revenue analytics, and carbon emission offsets are administrative responsibilities restricted to the EB Officer's management console.

**Current Status**
Active Grid Operator Session. Grid load balancing: Active.

**AI Recommendation**
Refer to the EB Officer Management console for consumer accounts, financial audits, or sustainability reports.

**Priority Level**: Medium

**Suggested Next Action**: Request live grid performance data by asking: "Show live grid status."`;
      agentType = 'orchestrator';
    }
    // Check all transformers / Is Transformer A healthy? / Show overloaded / transformer utilization
    else if (lowerInput.includes('transformer') || lowerInput.includes('substation')) {
      responseText = `## Transformer Utilization & Diagnostics

**Summary**
Transformer C is under critical overload conditions (97% load, 79°C), while Transformer A and D are operating healthy.

**Detailed Explanation**
Current asset statuses:
- **Transformer A**: Healthy (72% load, 46°C, 11 kV)
- **Transformer B**: Warning (91% load, 65°C, 11 kV)
- **Transformer C**: Critical (97% load, 79°C, 11 kV)
- **Transformer D**: Healthy (63% load, 43°C, 11 kV)

**Current Status**
Transformer C is approaching thermal shutdown.

**AI Recommendation**
Transformer C is approaching overload conditions. Redistribute approximately 15% of the load to Transformer D to maintain grid stability and reduce the risk of failure.

**Priority Level**: Critical

**Suggested Next Action**: Check voltage levels to locate sags by asking: "Show voltage fluctuations."`;
      agentType = 'fault';
    }
    // Detect transformer faults / Show voltage fluctuations / Show feeder status
    else if (lowerInput.includes('fault') || lowerInput.includes('voltage') || lowerInput.includes('feeder') || lowerInput.includes('abnormal')) {
      responseText = `## Grid Fault & Voltage Fluctuation Diagnostics

**Summary**
A voltage sag of 3.4% has been detected on Feeder Line 4 connected to Transformer C.

**Detailed Explanation**
Grid telemetry indicates phase imbalance:
- **Feeder Line 4**: Voltage dropped to 10.6 kV (3.4% sag) due to overloaded drawing.
- **Active Alerts**: Overcurrent alarm on Phase L1.
- **Grid Frequency**: 50.02 Hz (Stable).

**Current Status**
Active fault warning on Substation C (Feeder Line 4).

**AI Recommendation**
Initiate tap changer adjustments on Transformer C to stabilize phase voltage levels and clear phase warnings.

**Priority Level**: High

**Suggested Next Action**: Look into load shifting actions by asking: "Suggest load balancing."`;
      agentType = 'fault';
    }
    // Check load balancing / Suggest load balancing
    else if (lowerInput.includes('load') || lowerInput.includes('balancing') || lowerInput.includes('balance') || lowerInput.includes('redistribution')) {
      responseText = `## Load Redistribution & Shifting Guidelines

**Summary**
A 15% load transfer from Transformer C to Transformer D is recommended to avoid evening overload failure.

**Detailed Explanation**
Winding temperatures at 79°C represent high thermal stress, which accelerates insulation aging. Moving 15% of the load (approximately 290 kW) will bring Transformer C back to a safe load level of 82%, while Transformer D will rise to a manageable 78% load level.

**Current Status**
Transformer C: 97% Load. Transformer D: 63% Load.

**AI Recommendation**
Execute automatic or manual phase transfer on the local grid breakers to shift 15% load immediately.

**Priority Level**: Critical

**Suggested Next Action**: Predict peak timings by asking: "Predict evening peak demand."`;
      agentType = 'energy';
    }
    // Predict evening peak demand / Predict transformer failure
    else if (lowerInput.includes('predict') || lowerInput.includes('peak') || lowerInput.includes('failure') || lowerInput.includes('forecast')) {
      responseText = `## Evening Peak Load Forecasting

**Summary**
Evening demand is expected to peak at 7:15 PM at 13.8 MW, with an 84% failure probability for Transformer C.

**Detailed Explanation**
Historical patterns indicate residential loads rise sharply from 6:30 PM due to lighting, cooling, and appliance activation. Transformer C winding temperatures will likely cross the 85°C safety limit, triggering an automatic safety breaker trip.

**Current Status**
Current load is 12.4 MW. Peak prediction: 13.8 MW.

**AI Recommendation**
Discharge substation solar battery banks at 6:30 PM to shave the residential demand peak.

**Priority Level**: Critical

**Suggested Next Action**: Inspect all transformer values by asking: "Check all transformers."`;
      agentType = 'energy';
    }
    // Show live grid status / Show outage locations / Show emergency alerts
    else if (lowerInput.includes('grid status') || lowerInput.includes('outage') || lowerInput.includes('alert') || lowerInput.includes('temperature')) {
      responseText = `## Live Grid Operations Status

**Summary**
The grid is stable overall with a 98% health rating, except for localized critical loading alerts on Substation C.

**Detailed Explanation**
- **Grid Health Index**: 98%
- **Outage Status**: None active (All zones online)
- **Transformer Temps**: Transformer C (79°C - High), Transformer B (65°C - Moderate)
- **Active Emergency Alerts**: 1 Overload Warning (Substation C)

**Current Status**
Continuous municipal power supply is maintained.

**AI Recommendation**
Monitor thermal rise on Transformer C. Prepare solar battery banks for peak support.

**Priority Level**: High

**Suggested Next Action**: Balance the substation loads by asking: "Suggest load balancing."`;
      agentType = 'orchestrator';
    }
    // Fallback for Grid Operator
    else {
      responseText = `## AI Grid Operations Intelligence Agent (GOIA)

**Summary**
Hello, Grid Operator! I am the AI Grid Operations Intelligence Agent (GOIA). I can help monitor transformers, balance load, and detect anomalies.

**Detailed Explanation**
You can ask me operational grid questions like:
- "Check Transformer A."
- "Show overloaded transformers."
- "Detect transformer faults."
- "Show voltage fluctuations."
- "Predict today's peak demand."
- "Suggest load balancing."
- "Show live grid status."

**Current Status**
Grid Operator dashboard synchronization: Active.

**AI Recommendation**
Examine Transformer C temperature levels (79°C) and prepare auxiliary cooling fans if load balancing is delayed.

**Priority Level**: Low

**Suggested Next Action**: Ask: "Check all transformers" to view active substation loads.`;
      agentType = 'orchestrator';
    }
  }

  res.json({
    text: responseText,
    type: agentType,
    id: Date.now()
  });
});

export default router;
