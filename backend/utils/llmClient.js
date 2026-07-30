// utils/llmClient.js
// Simple wrapper around OpenAI Chat Completion (or any configured LLM)

import fetch from 'node-fetch';

/**
 * Call the LLM with a system prompt and user query.
 * Returns the raw content string (the agent is expected to format its
 * response as JSON or structured markdown as described in the design doc).
 */
export async function callLLM(systemPrompt, userQuery) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    if (!apiKey) {
      // Return a mock response for development/testing when no API key is set
      return 'Mock LLM response (OPENAI_API_KEY not configured)';
    }

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.2,
    max_tokens: 1000
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
