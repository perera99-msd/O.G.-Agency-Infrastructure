const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_PROMPT, buildPrompt } = require('../config/prompts');

/**
 * Call Gemini LLM (gemini-1.5-flash) with context
 * @param {string} question 
 * @param {Array} contextChunks 
 * @returns {Promise<string>}
 */
async function callGemini(question, contextChunks = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  });

  const prompt = buildPrompt(question, contextChunks);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error('Gemini returned an empty response');
  }

  return text.trim();
}

module.exports = {
  callGemini
};
