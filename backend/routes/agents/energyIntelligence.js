// Agent 1: Energy Intelligence Agent — Consumer role
import { callLLM } from '../../utils/llmClient.js';

export const name = 'Energy Intelligence Agent';

const SYSTEM_PROMPT = `You are the Energy Intelligence Agent for Smart Town Energy Management System.
Only answer requests for the Consumer role using the logged-in consumer's data.
Always respond with these sections: Summary | Usage Analysis | Bill Prediction | Recommendations | Estimated Savings.
Use Smart Town terminology: Houses, Consumers, Distribution Areas, IoT Devices.
Never access other consumers' data. If data is unavailable, use realistic demo values.`;

const DEMO_DATA = {
  consumer: { name: 'House #47, Zone North', meterId: 'SM-2047' },
  currentMonth: { units: 248, bill: 1845, period: '01 Jul – 31 Jul', dueDate: '10 Aug', status: 'Pending' },
  lastMonth: { units: 229, bill: 1710 },
  today: { units: 8.6, cost: 74.20 },
  appliances: [
    { name: 'Air Conditioner', units: 112, share: '45%' },
    { name: 'Water Heater', units: 42, share: '17%' },
    { name: 'Refrigerator', units: 28, share: '11%' },
    { name: 'Lighting', units: 22, share: '9%' },
    { name: 'Fan', units: 18, share: '7%' },
    { name: 'TV & Electronics', units: 14, share: '6%' },
    { name: 'Other Appliances', units: 12, share: '5%' },
  ],
  nextMonthPrediction: { units: 265, bill: 1970 },
  potentialSavings: { min: 250, max: 450 },
};

function buildDemoResponse(query) {
  const q = query.toLowerCase();

  if (/today|current usage|consume today/.test(q)) {
    return `## Summary
Your Smart Town smart meter (${DEMO_DATA.consumer.meterId}) at ${DEMO_DATA.consumer.name} has recorded **${DEMO_DATA.today.units} kWh** today.

## Usage Analysis
| Appliance | Usage |
|---|---|
| Air Conditioner | 3.4 kWh |
| Fan | 1.5 kWh |
| Lighting | 1.2 kWh |
| Refrigerator | 1.0 kWh |
| Other | 1.5 kWh |

Today's estimated cost: **₹${DEMO_DATA.today.cost}**
Status: Within normal range (62% of daily average).

## Bill Prediction
At this rate, your monthly bill is projected at **₹${DEMO_DATA.nextMonthPrediction.bill}**.

## Recommendations
- Reduce AC usage during peak hours (6 PM – 9 PM).
- Set AC temperature to 24–26°C for optimal efficiency.

## Estimated Savings
Implementing these tips could save **₹150–₹200** this month.`;
  }

  if (/bill|charges|cost|monthly|this month/.test(q)) {
    const change = (((DEMO_DATA.currentMonth.units - DEMO_DATA.lastMonth.units) / DEMO_DATA.lastMonth.units) * 100).toFixed(1);
    return `## Summary
Your current electricity bill for **${DEMO_DATA.currentMonth.period}** is **₹${DEMO_DATA.currentMonth.bill}** (${DEMO_DATA.currentMonth.units} kWh).

## Usage Analysis
- Current Month: **${DEMO_DATA.currentMonth.units} kWh** (₹${DEMO_DATA.currentMonth.bill})
- Last Month: **${DEMO_DATA.lastMonth.units} kWh** (₹${DEMO_DATA.lastMonth.bill})
- Change: **+${change}%** increase due to higher evening cooling loads.

Due Date: **${DEMO_DATA.currentMonth.dueDate}** | Status: **${DEMO_DATA.currentMonth.status}**

## Bill Prediction
Next month's projected bill: **₹${DEMO_DATA.nextMonthPrediction.bill}** (${DEMO_DATA.nextMonthPrediction.units} kWh).

## Recommendations
- Shift heavy appliance usage to off-peak hours (10 PM – 6 AM).
- Use energy-efficient appliances rated 5-star BEE.

## Estimated Savings
Potential savings: **₹${DEMO_DATA.potentialSavings.min}–₹${DEMO_DATA.potentialSavings.max}/month**.`;
  }

  if (/appliance|ac|refrigerator|tv|most energy|highest consuming/.test(q)) {
    const rows = DEMO_DATA.appliances.map(a => `| ${a.name} | ${a.units} kWh | ${a.share} |`).join('\n');
    return `## Summary
Appliance-wise energy analysis for ${DEMO_DATA.consumer.name} — Billing period ${DEMO_DATA.currentMonth.period}.

## Usage Analysis
| Appliance | Units | Share |
|---|---|---|
${rows}

Top consumer: **Air Conditioner (112 kWh, 45%)**.

## Bill Prediction
AC alone contributes approximately **₹830** to your current bill.

## Recommendations
- Set AC to Energy Saver mode at 24°C.
- Replace water heater with solar water heater to save 17% of consumption.
- Use LED lighting throughout the house.

## Estimated Savings
Optimizing AC and water heater usage: **₹300–₹450/month**.`;
  }

  if (/tip|saving|reduce|lower/.test(q)) {
    return `## Summary
Personalized energy-saving tips for ${DEMO_DATA.consumer.name} based on your July usage pattern.

## Usage Analysis
Your top 3 energy consumers: Air Conditioner (45%), Water Heater (17%), Refrigerator (11%).
Combined, these account for **73%** of your total bill.

## Bill Prediction
With the following changes, next month's bill could drop to **₹1,400–₹1,600**.

## Recommendations
1. **AC**: Set to 24–26°C; use timer to auto-off at night.
2. **Water Heater**: Switch to solar water heater or use only during off-peak hours.
3. **Refrigerator**: Keep coils clean; maintain 3–5°C temperature.
4. **Lighting**: Replace all bulbs with LED (saves up to 80% lighting energy).
5. **Standby Power**: Unplug chargers and electronics when not in use.
6. **Peak Hours**: Avoid running washing machine/dishwasher between 6 PM–9 PM.

## Estimated Savings
Total potential savings: **₹${DEMO_DATA.potentialSavings.min}–₹${DEMO_DATA.potentialSavings.max}/month**.`;
  }

  if (/predict|next month|forecast/.test(q)) {
    return `## Summary
AI-powered bill prediction for ${DEMO_DATA.consumer.name} — Next billing cycle.

## Usage Analysis
- Current Month: ${DEMO_DATA.currentMonth.units} kWh (₹${DEMO_DATA.currentMonth.bill})
- Trend: +${(((DEMO_DATA.currentMonth.units - DEMO_DATA.lastMonth.units) / DEMO_DATA.lastMonth.units) * 100).toFixed(1)}% vs last month
- Seasonal factor: Summer cooling demand expected to remain high.

## Bill Prediction
Predicted next month: **${DEMO_DATA.nextMonthPrediction.units} kWh → ₹${DEMO_DATA.nextMonthPrediction.bill}**
Confidence: **87%**

## Recommendations
- Pre-cool your home before peak hours to reduce AC runtime.
- Use smart plugs to schedule appliance usage.

## Estimated Savings
Proactive measures could reduce next month's bill by **₹200–₹350**.`;
  }

  if (/compare|previous|history|last month/.test(q)) {
    return `## Summary
Monthly consumption comparison for ${DEMO_DATA.consumer.name}.

## Usage Analysis
| Month | Units | Bill | Change |
|---|---|---|---|
| May 2026 | 210 kWh | ₹1,260 | — |
| June 2026 | 229 kWh | ₹1,710 | +9% |
| July 2026 | 248 kWh | ₹1,845 | +8.3% |
| Aug 2026 (Predicted) | 265 kWh | ₹1,970 | +6.9% |

Trend: Consistent increase due to summer season cooling demand.

## Bill Prediction
If current trend continues, August bill: **₹1,970**.

## Recommendations
- Implement demand response during peak summer months.
- Consider installing a rooftop solar panel to offset 20–30% of consumption.

## Estimated Savings
Solar installation ROI: **₹400–₹600/month** after payback period.`;
  }

  // Default welcome
  return `## Summary
Hello! I am the **Energy Intelligence Agent** for Smart Town Energy Management.
I manage energy insights for ${DEMO_DATA.consumer.name} (Meter: ${DEMO_DATA.consumer.meterId}).

## Usage Analysis
- This Month: **${DEMO_DATA.currentMonth.units} kWh** | Bill: **₹${DEMO_DATA.currentMonth.bill}**
- Today: **${DEMO_DATA.today.units} kWh** | Cost: **₹${DEMO_DATA.today.cost}**
- Top Consumer: **Air Conditioner (45%)**

## Bill Prediction
Next month predicted: **₹${DEMO_DATA.nextMonthPrediction.bill}**

## Recommendations
Ask me about your usage, bills, appliances, or saving tips.

## Estimated Savings
Potential monthly savings: **₹${DEMO_DATA.potentialSavings.min}–₹${DEMO_DATA.potentialSavings.max}**`;
}

export async function handle(query, context = {}) {
  try {
    const llmResponse = await callLLM(SYSTEM_PROMPT, query);
    if (llmResponse && !llmResponse.includes('Mock LLM')) return llmResponse;
  } catch (_) {}
  return buildDemoResponse(query);
}
