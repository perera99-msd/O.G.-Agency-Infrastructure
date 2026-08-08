const { callGemini } = require('./gemini');
const { callGroq } = require('./groq');

/**
 * Orchestrator to generate answers with automatic fallback
 * @param {string} question 
 * @param {Array} contextChunks 
 * @returns {Promise<{ reply: string, provider: string }>}
 */
async function generateAnswer(question, contextChunks = []) {
  // 1. Try Primary: Google Gemini
  try {
    const geminiReply = await callGemini(question, contextChunks);
    return {
      reply: geminiReply,
      provider: 'gemini'
    };
  } catch (geminiError) {
    console.warn(`[LLM Orchestrator] Gemini failed (${geminiError.message}). Attempting fallback to Groq...`);
  }

  // 2. Try Fallback: Groq (Llama-3.1)
  try {
    const groqReply = await callGroq(question, contextChunks);
    return {
      reply: groqReply,
      provider: 'groq'
    };
  } catch (groqError) {
    console.warn(`[LLM Orchestrator] Groq fallback failed (${groqError.message}).`);
  }

  // 3. Graceful offline fallback if no API keys or all LLM APIs are unreachable
  if (contextChunks && contextChunks.length > 0) {
    const bestChunk = contextChunks[0];
    return {
      reply: `Here is the relevant information from our official guide:\n\n${bestChunk.text}\n\nFor more details, you can contact our support team at support@ogagency.com or call +1 (800) 555-0199.`,
      provider: 'knowledge-base-direct'
    };
  }

  return {
    reply: "Hello! I am the O.G. Agency AI assistant. I don't have that specific information right now. Please contact our support team directly at support@ogagency.com or call +1 (800) 555-0199, and our team will be happy to assist you.",
    provider: 'fallback-default'
  };
}

module.exports = {
  generateAnswer
};
