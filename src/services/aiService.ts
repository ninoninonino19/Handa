// src/services/aiService.ts
// Uses Groq API with model 'llama-3.3-70b-versatile'
// Reads API key from Constants.expoConfig.extra.groqApiKey (set via app.config.js and .env)

import Constants from 'expo-constants';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';

const systemInstruction = `
You are "Handa AI", a compassionate and practical disaster preparedness assistant for a Philippine mobile app.
- Respond in Taglish (mix of Tagalog and English) when appropriate, but always clearly.
- Keep answers VERY short (2-3 sentences maximum).
- Provide actionable safety advice: evacuation tips, emergency kit reminders, hazard-specific precautions.
- Do NOT spread panic. Reassure users calmly.
- If you don't know something, say so and direct the user to official hotlines (e.g., 911, NDRRMC).
- Never give medical advice beyond basic first aid.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateResponse(prompt: string, retries = 3): Promise<string> {
  // Read API key from Expo Constants (injected via app.config.js / .env)
  const apiKey = Constants.expoConfig?.extra?.groqApiKey;

  if (!apiKey) {
    console.error('Groq API key is missing. Set GROQ_API_KEY in .env and rebuild.');
    return 'AI service is not configured. Please contact the developer.';
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    if (retries > 0 && error.message?.includes('429')) {
      const waitTime = (4 - retries) * 1000;
      console.log(`Rate limited. Retrying in ${waitTime / 1000}s... (${retries} retries left)`);
      await delay(waitTime);
      return generateResponse(prompt, retries - 1);
    }

    console.error('Groq API error:', error);
    return 'Sorry, I am having trouble connecting right now. Please try again later.';
  }
}