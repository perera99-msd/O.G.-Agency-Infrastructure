const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { retrieveContext } = require('../rag/retrieve');
const { generateAnswer } = require('../llm/generate');

const router = express.Router();

// Rate limiter: Max 30 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Too many chat requests from this IP, please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string.'
      });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        error: 'Message is too long. Please limit your inquiry to 1000 characters.'
      });
    }

    // 1. Retrieve relevant knowledge chunks
    const contextChunks = await retrieveContext(cleanMessage, 4);

    // 2. Generate answer via primary LLM (Gemini) or fallback (Groq / direct)
    const { reply, provider } = await generateAnswer(cleanMessage, contextChunks);

    return res.status(200).json({
      reply,
      provider,
      contextFound: contextChunks.length > 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Chat Route Error]:', error);
    return res.status(500).json({
      error: 'An internal error occurred while processing your request. Please try again later.'
    });
  }
});

module.exports = router;
