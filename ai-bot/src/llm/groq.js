const Groq = require('groq-sdk');
const { SYSTEM_PROMPT, buildPrompt } = require('../config/prompts');

/**
 * Call Groq LLM (llama-3.1-8b-instant) with context as a fallback
 * @param {string} question 
 * @param {Array} contextChunks 
 * @returns {Promise<string>}
 */
async function callGroq(question, contextChunks = []) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const groq = new Groq({ apiKey });
  const prompt = buildPrompt(question, contextChunks);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    max_tokens: 1024
  });

  const content = chatCompletion.choices?.[0]?.message?.content;
  if (!content || content.trim().length === 0) {
    throw new Error('Groq returned an empty response');
  }

  return content.trim();
}

module.exports = {
  callGroq
};
